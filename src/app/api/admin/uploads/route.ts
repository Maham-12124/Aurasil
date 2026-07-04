import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MAX_BYTES = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

async function requireAdminApi() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const images = await prisma.uploadedImage.findMany({
    select: { id: true, mimeType: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  return NextResponse.json({
    images: images.map((img) => ({ ...img, url: `/api/uploads/${img.id}` })),
  });
}

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPEG, PNG, WEBP, or GIF." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 4MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const image = await prisma.uploadedImage.create({
    data: { data: buffer, mimeType: file.type },
    select: { id: true },
  });

  return NextResponse.json({ id: image.id, url: `/api/uploads/${image.id}` }, { status: 201 });
}
