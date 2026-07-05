"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cartTotal, useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/product-types";
import { cn } from "@/lib/utils";

// TODO: replace with the store's real bank account details before launch.
const BANK_DETAILS = {
  bankName: "Meezan Bank",
  accountTitle: "Aurasil Jewelry",
  accountNumber: "0123456789012",
  iban: "PK00MEZN0000000123456789",
  confirmationEmail: "aurasil095@gmail.com",
};

type PaymentMethod = "COD" | "BANK_TRANSFER";

export function CheckoutForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const storedLines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Cart state comes from localStorage, which the server can't see —
  // rendering as empty until mount keeps SSR/client markup in sync.
  const lines = mounted ? storedLines : [];
  const total = cartTotal(lines);

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.name) setCustomerName((v) => v || session.user!.name!);
    if (session?.user?.email) setEmail((v) => v || session.user!.email!);
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          address,
          city,
          notes: notes || undefined,
          paymentMethod,
          items: lines.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Could not place your order, please try again.");
        setLoading(false);
        return;
      }

      clear();
      router.push(`/order/${data.orderNumber}?email=${encodeURIComponent(email)}`);
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-muted-foreground">Your bag is empty.</p>
        <Button nativeButton={false} className="rounded-none" render={<Link href="/products">Continue Shopping</Link>} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-8">
        <div>
          <h2 className="font-heading text-xl">Contact &amp; Shipping</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="customerName">Full Name</Label>
              <Input
                id="customerName"
                required
                className="rounded-none"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                className="rounded-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                required
                className="rounded-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                required
                className="rounded-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                required
                className="rounded-none"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Order Notes (optional)</Label>
              <Textarea
                id="notes"
                className="rounded-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-xl">Payment Method</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(["COD", "BANK_TRANSFER"] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={cn(
                  "border px-4 py-3 text-left text-sm transition-colors",
                  paymentMethod === method
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                )}
              >
                <span className="block font-medium">
                  {method === "COD" ? "Cash on Delivery" : "Bank Transfer"}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {method === "COD"
                    ? "Pay when your order arrives"
                    : "Pay via direct bank transfer"}
                </span>
              </button>
            ))}
          </div>

          {paymentMethod === "BANK_TRANSFER" && (
            <div className="mt-3 border border-border bg-muted/40 p-4 text-sm">
              <p className="font-medium">Transfer to:</p>
              <dl className="mt-2 space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <dt>Bank</dt>
                  <dd>{BANK_DETAILS.bankName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Account Title</dt>
                  <dd>{BANK_DETAILS.accountTitle}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Account Number</dt>
                  <dd>{BANK_DETAILS.accountNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>IBAN</dt>
                  <dd>{BANK_DETAILS.iban}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">
                Please include your order number as the payment reference, and
                email a screenshot of the transfer to{" "}
                {BANK_DETAILS.confirmationEmail}.
              </p>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-none py-6 text-xs uppercase tracking-widest sm:w-auto sm:px-10"
        >
          {loading ? "Placing Order…" : "Place Order"}
        </Button>
      </div>

      <div className="h-fit border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-heading text-lg">Order Summary</h2>
        <ul className="mt-4 divide-y divide-border">
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex gap-3 py-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col text-sm">
                <span className="leading-snug">{product.name}</span>
                <span className="mt-1 text-xs text-muted-foreground">Qty {quantity}</span>
              </div>
              <span className="text-sm">{formatPrice(product.price * quantity)}</span>
            </li>
          ))}
        </ul>
        <Separator className="my-4" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="mt-2 flex justify-between font-heading text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </form>
  );
}
