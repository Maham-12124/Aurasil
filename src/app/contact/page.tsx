import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata = {
  title: "Contact Us — Aurasil",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Get In Touch</p>
        <h1 className="mt-2 font-heading text-4xl">Contact Us</h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Questions about an order, a piece, or a custom request? We&apos;d love
          to hear from you.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        <ContactForm />

        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-foreground/70">
              Studio
            </p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Aurasil Studio, Lahore, Pakistan
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:hello@aurasil.com" className="hover:text-primary">
                  hello@aurasil.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+923364961393" className="hover:text-primary">
                  +92 336 4961393
                </a>
              </li>
            </ul>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-xs uppercase tracking-widest text-foreground/70">
              Hours
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Monday – Saturday, 11am – 7pm PKT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
