import "server-only";
import { prisma } from "@/lib/prisma";

export function getAllCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export function getCategoryNames(): Promise<string[]> {
  return getAllCategories().then((rows) => rows.map((c) => c.name));
}
