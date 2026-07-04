import "server-only";
import { prisma } from "@/lib/prisma";
import type { Product, Collection } from "@/lib/product-types";

export * from "@/lib/product-types";

export function getAllProducts(): Promise<Product[]> {
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export function getProductBySlug(slug: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { slug } });
}

export function getProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export function getProductsByCollection(collection: Collection): Promise<Product[]> {
  return prisma.product.findMany({
    where: { collections: { has: collection } },
    orderBy: { createdAt: "desc" },
  });
}
