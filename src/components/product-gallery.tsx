"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Product } from "@/lib/product-types";

export function ProductGallery({ product }: { product: Product }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState("50% 50%");
  const [zoomed, setZoomed] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-muted"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
    >
      <Image
        src={product.image}
        alt={product.name}
        fill
        priority
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover transition-transform duration-300 ease-out"
        style={{
          transformOrigin: origin,
          transform: zoomed ? "scale(1.9)" : "scale(1)",
        }}
      />
    </div>
  );
}
