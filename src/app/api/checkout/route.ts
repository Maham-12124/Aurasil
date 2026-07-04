import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateOrderNumber() {
  return `AUR-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const customerName = String(body.customerName ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  const address = String(body.address ?? "").trim();
  const city = String(body.city ?? "").trim();
  const notes = body.notes ? String(body.notes).trim() : null;
  const paymentMethod = body.paymentMethod;
  const items = Array.isArray(body.items) ? body.items : [];

  if (!customerName) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
  }
  if (!address) {
    return NextResponse.json({ error: "Address is required." }, { status: 400 });
  }
  if (!city) {
    return NextResponse.json({ error: "City is required." }, { status: 400 });
  }
  if (paymentMethod !== "COD" && paymentMethod !== "BANK_TRANSFER") {
    return NextResponse.json({ error: "Choose a valid payment method." }, { status: 400 });
  }
  if (!items.length) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const quantities = new Map<string, number>();
  for (const item of items) {
    const productId = String(item?.productId ?? "");
    const quantity = Number(item?.quantity);
    if (!productId || !Number.isFinite(quantity) || quantity < 1) {
      return NextResponse.json({ error: "Invalid item in bag." }, { status: 400 });
    }
    quantities.set(productId, (quantities.get(productId) ?? 0) + Math.round(quantity));
  }

  // Re-fetch authoritative price/stock from the DB — never trust the
  // client's persisted cart snapshot for money or availability.
  const products = await prisma.product.findMany({
    where: { id: { in: [...quantities.keys()] } },
  });

  if (products.length !== quantities.size) {
    return NextResponse.json(
      { error: "Some items in your bag are no longer available." },
      { status: 400 },
    );
  }

  for (const product of products) {
    const quantity = quantities.get(product.id)!;
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: `Only ${product.stock} left of "${product.name}" — please update your bag.` },
        { status: 409 },
      );
    }
  }

  const session = await auth();
  const orderItemsData = products.map((product) => {
    const quantity = quantities.get(product.id)!;
    return {
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    };
  });
  const total = orderItemsData.reduce((sum, item) => sum + item.lineTotal, 0);

  let orderNumber = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    const candidate = generateOrderNumber();
    const existing = await prisma.order.findUnique({ where: { orderNumber: candidate } });
    if (!existing) {
      orderNumber = candidate;
      break;
    }
  }
  if (!orderNumber) {
    return NextResponse.json(
      { error: "Could not place order, please try again." },
      { status: 500 },
    );
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Conditional decrement guards against a race where stock changed
      // between the check above and now — updateMany's count tells us if
      // the decrement actually applied.
      for (const product of products) {
        const quantity = quantities.get(product.id)!;
        const result = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });
        if (result.count === 0) {
          throw new Error(`Only a few left of "${product.name}" — please update your bag.`);
        }
      }

      return tx.order.create({
        data: {
          orderNumber,
          paymentMethod,
          customerName,
          email,
          phone,
          address,
          city,
          notes,
          subtotal: total,
          total,
          userId: session?.user?.id ?? null,
          items: { create: orderItemsData },
        },
        include: { items: true },
      });
    });

    return NextResponse.json({ id: order.id, orderNumber: order.orderNumber }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not place order, please try again.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
