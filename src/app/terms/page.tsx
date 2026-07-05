import { LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Terms & Conditions — Aurasil",
};

export default function TermsPage() {
  return (
    <LegalPage kicker="Legal" title="Terms & Conditions">
      <div>
        <h2>General</h2>
        <p>
          By using the Aurasil website and placing an order, you agree to the
          terms outlined here. We may update these terms from time to time;
          continued use of the site means you accept the current version.
        </p>
      </div>

      <div>
        <h2>Products</h2>
        <p>
          All jewelry sold on Aurasil is artificial/fashion jewelry unless
          stated otherwise on the product page. Colours may vary slightly
          from photos due to screen settings and lighting.
        </p>
      </div>

      <div>
        <h2>Orders &amp; Pricing</h2>
        <p>
          Prices are listed in Pakistani Rupees (PKR) and may change without
          notice. We reserve the right to cancel an order if a product is
          out of stock or priced incorrectly, and will notify you if this
          happens.
        </p>
      </div>

      <div>
        <h2>Accounts</h2>
        <p>
          Creating an account is optional — you can check out as a guest.
          If you create an account, you&apos;re responsible for keeping your
          login details secure.
        </p>
      </div>

      <div>
        <h2>Payment &amp; Shipping</h2>
        <p>
          See our Payment Method and Shipping Policy pages for full details
          on how orders are paid for and delivered.
        </p>
      </div>

      <div>
        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to aurasil095@gmail.com.
        </p>
      </div>
    </LegalPage>
  );
}
