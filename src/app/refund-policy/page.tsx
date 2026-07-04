import Link from "next/link";
import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Refund Policy — Aurasil",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage kicker="After Your Order" title="Refund Policy">
      <div>
        <h2>Returns</h2>
        <p>
          We accept returns within 7 days of delivery for unworn items in
          their original packaging, with tags attached. Earrings are not
          eligible for return for hygiene reasons unless defective.
        </p>
      </div>

      <div>
        <h2>Damaged or Incorrect Items</h2>
        <p>
          If your order arrives damaged, defective, or different from what
          you ordered, contact us within 48 hours of delivery with photos of
          the item and packaging, and we&apos;ll arrange a replacement or full
          refund.
        </p>
      </div>

      <div>
        <h2>Refund Timeline</h2>
        <p>
          Once a return is received and inspected, approved refunds are
          processed within 5–7 business days. Bank Transfer orders are
          refunded to the original account; Cash on Delivery orders are
          refunded via bank transfer to an account you provide.
        </p>
      </div>

      <div>
        <h2>How to Start a Return</h2>
        <p>
          Reach out via our{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact Us
          </Link>{" "}
          page with your Order Number and reason for return, and we&apos;ll guide
          you through the next steps.
        </p>
      </div>
    </LegalPage>
  );
}
