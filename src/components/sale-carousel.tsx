"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { formatPrice, type Product } from "@/lib/product-types";

export function SaleCarousel({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCards(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-deal-card]");
    const cardSpan = (card?.offsetWidth ?? el.clientWidth / 4) + 24;
    const cardsPerPage = Math.max(1, Math.floor(el.clientWidth / cardSpan));
    el.scrollBy({ left: direction * cardsPerPage * cardSpan, behavior: "smooth" });
  }

  if (!products.length) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.3em] text-primary-foreground">
            <Flame className="h-3.5 w-3.5" />
            Limited Time
          </p>
          <h2 className="mt-2 font-heading text-3xl text-primary-foreground">Hot Deals</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Previous deals"
            onClick={() => scrollByCards(-1)}
            className="border border-primary-foreground/40 p-2 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next deals"
            onClick={() => scrollByCards(1)}
            className="border border-primary-foreground/40 p-2 text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <Link
            href="/products?sale=true"
            className="ml-2 hidden text-xs uppercase tracking-widest text-primary-foreground hover:underline sm:block"
          >
            All Deals →
          </Link>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((product) => {
          const discount =
            product.compareAtPrice && product.compareAtPrice > product.price
              ? Math.round((1 - product.price / product.compareAtPrice) * 100)
              : 0;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              data-deal-card
              className="group w-[70%] shrink-0 snap-start bg-card sm:w-[45%] lg:w-[23%]"
            >
              <div className="relative aspect-4/5 overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 70vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                  {discount > 0 && (
                    <span className="bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground">
                      −{discount}%
                    </span>
                  )}
                  {product.stock <= 5 && (
                    <span className="bg-accent px-2 py-1 text-[10px] uppercase tracking-wide text-accent-foreground">
                      Only {product.stock} left
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {product.category}
                </p>
                <h3 className="mt-1 font-heading text-base leading-snug text-foreground">
                  {product.name}
                </h3>
                <p className="mt-1 flex items-center gap-2 text-sm">
                  <span className="text-foreground/80">{formatPrice(product.price)}</span>
                  {product.compareAtPrice && (
                    <span className="text-muted-foreground line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
