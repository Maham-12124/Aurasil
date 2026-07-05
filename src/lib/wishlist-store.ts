"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/product-types";

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  isSaved: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) =>
        set((state) => {
          const exists = state.items.some((p) => p.id === product.id);
          return {
            items: exists
              ? state.items.filter((p) => p.id !== product.id)
              : [...state.items, product],
          };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((p) => p.id !== productId) })),
      isSaved: (productId) => get().items.some((p) => p.id === productId),
    }),
    { name: "aurasil-wishlist" },
  ),
);

export function wishlistCount(items: Product[]) {
  return items.length;
}
