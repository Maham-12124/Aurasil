import type { Product } from "@/generated/prisma/client";

export type { Product };

// Categories are managed by admins in the database (see src/lib/categories.ts)
// rather than hardcoded here — a product's category is just whichever
// category name was selected at the time, so this stays a plain string.
export type Category = string;
export type Collection = "quiet-luxury-daily" | "desi-wedding-essentials";

export const collectionLabels: Record<Collection, string> = {
  "quiet-luxury-daily": "Quiet Luxury Daily Wear",
  "desi-wedding-essentials": "Desi Wedding Essentials",
};

export function formatPrice(price: number) {
  return `Rs ${price.toLocaleString("en-PK")}`;
}
