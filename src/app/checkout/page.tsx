import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout-form";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Almost There</p>
        <h1 className="mt-2 font-heading text-4xl">Checkout</h1>
      </div>
      <Suspense>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
