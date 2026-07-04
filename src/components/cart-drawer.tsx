"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cartCount, cartTotal, useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/product-types";

export function CartDrawer() {
  const { lines, isOpen, close, removeItem, setQuantity } = useCartStore();
  const total = cartTotal(lines);
  const count = cartCount(lines);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">
            Your Bag {count > 0 && `(${count})`}
          </SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Button variant="outline" className="mt-2 rounded-none" onClick={close}>
              Continue Browsing
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="divide-y divide-border">
                {lines.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-4 py-4">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading text-sm leading-snug">{product.name}</h4>
                        <button
                          onClick={() => removeItem(product.id)}
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {product.finish}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            className="p-1.5"
                            onClick={() =>
                              setQuantity(product.id, Math.max(1, quantity - 1))
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{quantity}</span>
                          <button
                            className="p-1.5"
                            onClick={() => setQuantity(product.id, quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <SheetFooter className="border-t border-border">
              <div className="flex w-full items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-heading text-lg">{formatPrice(total)}</span>
              </div>
              <Button
                nativeButton={false}
                className="w-full rounded-none py-6 text-xs uppercase tracking-widest"
                onClick={close}
                render={<Link href="/checkout">Proceed to Checkout</Link>}
              />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
