"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import type { Collection } from "@/lib/product-types";

const KNOWN_COLLECTIONS: Collection[] = ["quiet-luxury-daily", "desi-wedding-essentials"];

function parseProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const category = String(formData.get("category") ?? "").trim();
  const price = Number(formData.get("price"));
  const compareAtPriceRaw = String(formData.get("compareAtPrice") ?? "").trim();
  const compareAtPrice = compareAtPriceRaw ? Number(compareAtPriceRaw) : null;
  const image = String(formData.get("image") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const finish = String(formData.get("finish") ?? "").trim();
  const stock = Number(formData.get("stock") ?? 0);
  const isNew = formData.get("isNew") === "on";
  const collections = formData
    .getAll("collections")
    .map(String)
    .filter((c): c is Collection => KNOWN_COLLECTIONS.includes(c as Collection));

  if (!name) throw new Error("Product name is required.");
  if (!slug) throw new Error("Slug is required.");
  if (!category) throw new Error("Category is required.");
  if (!Number.isFinite(price) || price <= 0) throw new Error("Price must be a positive number.");
  if (!image) throw new Error("Image path is required.");
  if (!description) throw new Error("Description is required.");
  if (!finish) throw new Error("Finish is required.");
  if (!Number.isFinite(stock) || stock < 0) throw new Error("Stock must be zero or more.");

  return {
    name,
    slug,
    category,
    price: Math.round(price),
    compareAtPrice: compareAtPrice && Number.isFinite(compareAtPrice) ? Math.round(compareAtPrice) : null,
    image,
    description,
    finish,
    stock: Math.round(stock),
    isNew,
    collections,
  };
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/admin/products");
  if (slug) revalidatePath(`/products/${slug}`);
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = parseProductForm(formData);

  await prisma.product.create({ data });
  revalidateStorefront(data.slug);
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = parseProductForm(formData);

  await prisma.product.update({ where: { id }, data });
  revalidateStorefront(data.slug);
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const product = await prisma.product.delete({ where: { id } });
  revalidateStorefront(product.slug);
}
