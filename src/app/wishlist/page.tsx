"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { useWishlistStore } from "@/lib/wishlist-store";

export default function WishlistPage() {
  const storedItems = useWishlistStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Wishlist state comes from localStorage, which the server can't see —
  // rendering as empty until mount keeps SSR/client markup in sync.
  const items = mounted ? storedItems : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Saved</p>
        <h1 className="mt-2 font-heading text-4xl">Your Wishlist</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-muted-foreground">You haven&apos;t saved anything yet.</p>
          <Button nativeButton={false} className="rounded-none" render={<Link href="/products">Browse Jewelry</Link>} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
