"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { LayoutGrid, Grid3x3 } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Slider } from "@/components/ui/slider";
import { formatPrice, type Category, type Collection, type Product } from "@/lib/product-types";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export function ProductsGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const maxPrice = useMemo(
    () => (products.length ? Math.max(...products.map((p) => p.price)) : 0),
    [products],
  );

  const activeCategory = searchParams.get("category") as Category | null;
  const activeCollection = searchParams.get("collection") as Collection | null;
  const saleOnly = searchParams.get("sale") === "true";
  const newOnly = searchParams.get("new") === "true";
  const [priceMax, setPriceMax] = useState(maxPrice);
  const [sort, setSort] = useState<SortKey>("featured");
  const [cols, setCols] = useState<3 | 4>(4);

  function setCategory(category: Category | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= priceMax);
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (activeCollection) list = list.filter((p) => p.collections.includes(activeCollection));
    if (saleOnly) {
      list = list.filter((p) => p.compareAtPrice != null && p.compareAtPrice > p.price);
    }
    if (newOnly) list = list.filter((p) => p.isNew);

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [products, activeCategory, activeCollection, saleOnly, newOnly, priceMax, sort]);

  return (
    <div className="flex flex-col gap-10 lg:flex-row">
      {/* Filters sidebar */}
      <aside className="shrink-0 lg:w-56">
        <div>
          <p className="text-xs uppercase tracking-widest text-foreground/70">Category</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <button
                onClick={() => setCategory(null)}
                className={cn(
                  "text-muted-foreground hover:text-primary",
                  !activeCategory && "font-medium text-primary",
                )}
              >
                All
              </button>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setCategory(category)}
                  className={cn(
                    "text-muted-foreground hover:text-primary",
                    activeCategory === category && "font-medium text-primary",
                  )}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-widest text-foreground/70">
            Price up to {formatPrice(priceMax)}
          </p>
          <Slider
            className="mt-4"
            min={1000}
            max={maxPrice}
            step={100}
            value={[priceMax]}
            onValueChange={(v) => setPriceMax(Array.isArray(v) ? v[0] : v)}
          />
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <p className="text-sm text-muted-foreground">{filtered.length} pieces</p>
          <div className="flex items-center gap-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border border-border bg-background px-2 py-1 text-xs uppercase tracking-widest"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                aria-label="4 column grid"
                onClick={() => setCols(4)}
                className={cols === 4 ? "text-primary" : "text-muted-foreground"}
              >
                <Grid3x3 className="h-4 w-4" />
              </button>
              <button
                aria-label="3 column grid"
                onClick={() => setCols(3)}
                className={cols === 3 ? "text-primary" : "text-muted-foreground"}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            No pieces match these filters.
          </p>
        ) : (
          <div
            className={cn(
              "grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3",
              cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
            )}
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
