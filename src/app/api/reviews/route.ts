import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId : "";
  const authorName = typeof body?.authorName === "string" ? body.authorName.trim() : "";
  const rating = Number(body?.rating);
  const comment = typeof body?.comment === "string" ? body.comment.trim() : "";

  if (!productId) {
    return NextResponse.json({ error: "Missing product." }, { status: 400 });
  }
  if (!authorName) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Please choose a rating from 1 to 5." }, { status: 400 });
  }
  if (!comment || comment.length < 5) {
    return NextResponse.json(
      { error: "Please write a short review (at least 5 characters)." },
      { status: 400 },
    );
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const review = await prisma.review.create({
    data: { productId, authorName, rating, comment },
  });

  return NextResponse.json({ review }, { status: 201 });
}
