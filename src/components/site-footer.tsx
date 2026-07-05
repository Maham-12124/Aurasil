import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";

// lucide-react no longer ships brand/social logos, so these are drawn inline.
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" {...props}>
      <path d="M12.02 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.43 1.26 4.87L2 22l5.32-1.28a9.9 9.9 0 0 0 4.7 1.2h.01c5.5 0 9.96-4.46 9.96-9.96S17.52 2 12.02 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.15.76.84-3.07-.2-.32a8.23 8.23 0 0 1-1.26-4.34c0-4.55 3.7-8.25 8.26-8.25 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.42 5.84c0 4.55-3.7 8.25-8.25 8.25Zm4.53-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.99-1.22-.73-.66-1.23-1.46-1.37-1.71-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.41 1.01 2.58c.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const MAPS_EMBED_SRC = "https://www.google.com/maps?q=Lahore,Pakistan&output=embed";
const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=Lahore,Pakistan";
const PHONE_DISPLAY = "+92 336 4961393";
const PHONE_TEL = "+923364961393";
const WHATSAPP_LINK = "https://wa.me/923364961393";
const INSTAGRAM_LINK =
  "https://www.instagram.com/_aurasil?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="bg-gingham h-2 w-full" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="font-heading text-2xl tracking-[0.15em] text-primary">AURASIL</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Fine artificial jewelry for quiet everyday luxury and desi wedding
            occasions — gold-toned pieces, considered details, worn daily.
          </p>

          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Aurasil Studio, Lahore, Pakistan
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              <a href="mailto:aurasil095@gmail.com" className="hover:text-primary">
                aurasil095@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <a href={`tel:${PHONE_TEL}`} className="hover:text-primary">
                {PHONE_DISPLAY}
              </a>
            </li>
          </ul>

          <div className="mt-5 flex gap-4">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="text-muted-foreground hover:text-primary"
            >
              <WhatsAppIcon />
            </a>
            <a
              href={INSTAGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-primary"
            >
              <InstagramIcon />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-foreground/70">Shop</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/products?category=Earrings" className="text-muted-foreground hover:text-primary">Earrings</Link></li>
            <li><Link href="/products?category=Necklaces" className="text-muted-foreground hover:text-primary">Necklaces</Link></li>
            <li><Link href="/products?category=Rings" className="text-muted-foreground hover:text-primary">Rings</Link></li>
            <li><Link href="/products?category=Bracelets" className="text-muted-foreground hover:text-primary">Bracelets</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-foreground/70">Information</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
            <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
            <li><Link href="/track" className="text-muted-foreground hover:text-primary">Track Order</Link></li>
            <li><Link href="/payment-method" className="text-muted-foreground hover:text-primary">Payment Method</Link></li>
            <li><Link href="/shipping-policy" className="text-muted-foreground hover:text-primary">Shipping Policy</Link></li>
            <li><Link href="/refund-policy" className="text-muted-foreground hover:text-primary">Refund Policy</Link></li>
            <li><Link href="/terms" className="text-muted-foreground hover:text-primary">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-foreground/70">Newsletter</p>
          <p className="mt-4 text-sm text-muted-foreground">Subscribe to our newsletter</p>
          <div className="mt-3">
            <NewsletterForm />
          </div>

          <p className="mt-6 text-xs uppercase tracking-widest text-foreground/70">
            Studio Location
          </p>
          <div className="relative mt-3 aspect-video w-full max-w-sm overflow-hidden border border-border">
            <iframe
              src={MAPS_EMBED_SRC}
              title="Aurasil Studio Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs uppercase tracking-widest text-primary hover:underline"
          >
            Open in Maps →
          </a>
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Aurasil. All rights reserved.
      </div>
    </footer>
  );
}
