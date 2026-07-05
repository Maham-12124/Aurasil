"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice, type Product } from "@/lib/product-types";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const isSaved = useWishlistStore((s) => s.isSaved(product.id));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Wishlist state comes from localStorage, which the server can't see —
  // rendering it as "not saved" until mount keeps SSR/client markup in
  // sync and avoids a hydration mismatch.
  const saved = mounted && isSaved;

  return (
    <div className="group">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-primary px-2 py-1 text-[10px] uppercase tracking-widest text-primary-foreground">
            New
          </span>
        )}
        <Button
          size="icon"
          variant="secondary"
          className={cn(
            "absolute right-3 top-3 h-9 w-9 rounded-none shadow-md transition-opacity duration-300",
            saved ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          <Heart className={cn("h-4 w-4", saved && "fill-primary text-primary")} />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-3 right-3 h-9 w-9 rounded-none opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            addItem(product, 1);
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/products/${product.slug}`} className="mt-3 block">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
          {product.category}
        </p>
        <h3 className="mt-1 font-heading text-base leading-snug">{product.name}</h3>
        <p className="mt-1 text-sm text-foreground/80">{formatPrice(product.price)}</p>
      </Link>
    </div>
  );
}
