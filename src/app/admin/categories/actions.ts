"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

function revalidateCategoryPages() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Category name is required.");

  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) throw new Error(`"${name}" already exists.`);

  await prisma.category.create({ data: { name } });
  revalidateCategoryPages();
}

export async function renameCategory(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Category name is required.");

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found.");

  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing && existing.id !== id) throw new Error(`"${name}" already exists.`);

  await prisma.$transaction([
    prisma.category.update({ where: { id }, data: { name } }),
    prisma.product.updateMany({ where: { category: category.name }, data: { category: name } }),
  ]);
  revalidateCategoryPages();
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new Error("Category not found.");

  const productCount = await prisma.product.count({ where: { category: category.name } });
  if (productCount > 0) {
    throw new Error(
      `Can't delete "${category.name}" — ${productCount} product(s) still use it. Reassign or delete them first.`,
    );
  }

  await prisma.category.delete({ where: { id } });
  revalidateCategoryPages();
}
