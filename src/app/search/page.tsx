import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { searchProducts } from "@/lib/products";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Search</p>
        <h1 className="mt-2 font-heading text-4xl">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        {query && (
          <p className="mt-2 text-sm text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {!query ? (
        <p className="text-muted-foreground">Enter a search term to find products.</p>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted-foreground">
            No products found for &quot;{query}&quot;.
          </p>
          <Link href="/products" className="text-sm text-primary hover:underline">
            Browse All Jewelry →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
