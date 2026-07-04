"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(
      `/order/${encodeURIComponent(orderNumber.trim())}?email=${encodeURIComponent(email.trim())}`,
    );
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <div className="mb-10 text-center">
        <p className="font-heading text-2xl tracking-[0.15em] text-primary">AURASIL</p>
        <h1 className="mt-4 font-heading text-3xl">Track Your Order</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your Order Number and the email you used at checkout.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="orderNumber">Order Number</Label>
          <Input
            id="orderNumber"
            required
            placeholder="AUR-XXXXXXXX"
            className="rounded-none"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
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

        <Button
          type="submit"
          className="w-full rounded-none py-6 text-xs uppercase tracking-widest"
        >
          Track Order
        </Button>
      </form>
    </div>
  );
}
