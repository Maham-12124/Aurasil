"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShieldCheck, Droplets, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, type Product } from "@/lib/product-types";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { cn } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const saved = useWishlistStore((s) => s.isSaved(product.id));

  return (
    <div className="flex flex-col">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {product.category}
      </p>
      <h1 className="mt-2 font-heading text-3xl leading-snug sm:text-4xl">
        {product.name}
      </h1>
      <p className="mt-3 text-xl">{formatPrice(product.price)}</p>

      <Separator className="my-6" />

      <p className="text-sm leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Gem className="h-3.5 w-3.5 text-primary" /> {product.finish}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Nickel-Free
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Droplets className="h-3.5 w-3.5 text-primary" /> Water-Resistant
        </span>
      </div>

      <Separator className="my-6" />

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-border">
          <button
            className="p-3"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            className="p-3"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <Button
          className="flex-1 rounded-none py-6 text-xs uppercase tracking-widest"
          onClick={() => addItem(product, quantity)}
        >
          Add to Bag — {formatPrice(product.price * quantity)}
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-13 w-13 shrink-0 rounded-none"
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart className={cn("h-5 w-5", saved && "fill-primary text-primary")} />
        </Button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Free shipping on orders over Rs 5,000 · Ships in 2–4 business days
      </p>
    </div>
  );
}
