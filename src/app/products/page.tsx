import { Suspense } from "react";
import { ProductsGrid } from "@/components/products-grid";
import { getAllProducts } from "@/lib/products";
import { getCategoryNames } from "@/lib/categories";

export const revalidate = 0;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getCategoryNames()]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">The Full Collection</p>
        <h1 className="mt-2 font-heading text-4xl">All Jewelry</h1>
      </div>
      <Suspense>
        <ProductsGrid products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
