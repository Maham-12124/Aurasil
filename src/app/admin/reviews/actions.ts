"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function deleteReview(id: string) {
  await requireAdmin();
  const review = await prisma.review.delete({ where: { id }, select: { product: { select: { slug: true } } } });
  revalidatePath("/admin/reviews");
  revalidatePath(`/products/${review.product.slug}`);
}
