"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ShowcaseCategory = {
  label: string;
  href: string;
  image: string;
  blink?: boolean;
};

export function CategoryShowcase({ categories }: { categories: ShowcaseCategory[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCards(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const cardSpan = (card?.offsetWidth ?? el.clientWidth / 4) + 24;
    // Advance by a full "page" of fully-visible cards rather than one at a
    // time, so each click reveals an entirely new set instead of a sliver.
    const cardsPerPage = Math.max(1, Math.floor(el.clientWidth / cardSpan));
    el.scrollBy({ left: direction * cardsPerPage * cardSpan, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous categories"
        onClick={() => scrollByCards(-1)}
        className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center bg-foreground/80 p-2 text-background hover:bg-foreground sm:left-3 sm:flex lg:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={scrollerRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-2 sm:px-10 lg:px-16"
      >
        {categories.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            data-card
            className="group relative aspect-4/5 w-[70%] shrink-0 snap-start overflow-hidden bg-muted sm:w-[38%] lg:w-[23%]"
          >
            <Image
              src={category.image}
              alt={category.label}
              fill
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 38vw, 70vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span
              className={cn(
                "absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 text-xs uppercase tracking-[0.2em]",
                category.blink
                  ? "animate-blink bg-primary text-primary-foreground"
                  : "bg-background text-foreground",
              )}
            >
              {category.label}
            </span>
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Next categories"
        onClick={() => scrollByCards(1)}
        className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center bg-foreground/80 p-2 text-background hover:bg-foreground sm:right-3 sm:flex lg:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
