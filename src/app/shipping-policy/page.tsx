import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Shipping Policy — Aurasil",
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage kicker="Delivery" title="Shipping Policy">
      <div>
        <h2>Processing Time</h2>
        <p>
          Orders are processed within 1–2 business days of being placed. You&apos;ll
          receive updates as your order moves from Pending to Shipped.
        </p>
      </div>

      <div>
        <h2>Delivery Time</h2>
        <p>
          Orders typically arrive within 2–4 business days for major cities
          and 4–7 business days for other areas across Pakistan, once
          shipped.
        </p>
      </div>

      <div>
        <h2>Shipping Charges</h2>
        <p>
          We currently offer free shipping on every order, nationwide — the
          total shown at checkout is the total you pay.
        </p>
      </div>

      <div>
        <h2>Order Tracking</h2>
        <p>
          Every order gets a unique Order Number at checkout. Track its
          status anytime from the Track Order page or, if you&apos;re signed in,
          from My Orders in your account menu.
        </p>
      </div>
    </LegalPage>
  );
}
