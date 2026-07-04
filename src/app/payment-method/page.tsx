import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Payment Method — Aurasil",
};

export default function PaymentMethodPage() {
  return (
    <LegalPage kicker="Checkout" title="Payment Method">
      <p>
        We currently accept two payment methods on every order, no account
        required.
      </p>

      <div>
        <h2>Cash on Delivery (COD)</h2>
        <p>
          Pay in cash when your order is delivered to your doorstep. This is
          the default option at checkout and available nationwide.
        </p>
      </div>

      <div>
        <h2>Bank Transfer</h2>
        <p>
          Transfer the order total directly to our bank account. Full account
          details are shown at checkout once you select Bank Transfer as your
          payment method. Please include your Order Number as the payment
          reference and email a screenshot of the transfer to our support
          email so we can confirm it quickly.
        </p>
      </div>

      <div>
        <h2>Order Confirmation</h2>
        <p>
          Every order receives a unique Order Number at checkout. You can
          look up your order status anytime on our{" "}
          <Link href="/track" className="text-primary hover:underline">
            Track Order
          </Link>{" "}
          page using your Order Number and email.
        </p>
      </div>
    </LegalPage>
  );
}
