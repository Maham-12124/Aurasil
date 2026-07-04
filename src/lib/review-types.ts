import type { Review } from "@/generated/prisma/client";

export type { Review };

export function getAverageRating(reviews: { rating: number }[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}
