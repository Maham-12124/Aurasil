import "server-only";
import { prisma } from "@/lib/prisma";

export * from "@/lib/review-types";

export function getReviewsByProductId(productId: string) {
  return prisma.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
}

export function getAllReviews() {
  return prisma.review.findMany({
    include: { product: { select: { name: true, slug: true, image: true } } },
    orderBy: { createdAt: "desc" },
  });
}
