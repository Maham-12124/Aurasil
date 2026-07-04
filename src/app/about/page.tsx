import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us — Aurasil",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border pb-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Our Story</p>
        <h1 className="mt-2 font-heading text-4xl">About Aurasil</h1>
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src="/images/products/product-25.jpg"
            alt="Aurasil jewelry"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-heading text-2xl leading-snug">
            Quiet luxury, made for everyday wear.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Aurasil started with a simple question: why should fine-looking
            jewelry only come out for special occasions? We design gold-toned
            earrings, necklaces, rings and bracelets meant to be worn daily —
            considered pieces that hold their shine through mehndi, walima,
            and every ordinary Tuesday in between.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Every piece is nickel-free and water-resistant, finished to last —
            so the piece you fell for on day one still looks that way a year
            in. We&apos;re based in Lahore, Pakistan, and ship nationwide.
          </p>
          <Button
            nativeButton={false}
            className="mt-6 rounded-none uppercase tracking-widest"
            render={<Link href="/products">Shop The Collection</Link>}
          />
        </div>
      </div>

      <div className="mt-16 grid gap-8 border-t border-border pt-12 sm:grid-cols-3">
        <div>
          <h3 className="font-heading text-lg">Nickel-Free</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Gentle on sensitive skin, safe for all-day wear.
          </p>
        </div>
        <div>
          <h3 className="font-heading text-lg">Water-Resistant</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Finished to resist tarnish from daily wash-ups and wudu.
          </p>
        </div>
        <div>
          <h3 className="font-heading text-lg">Considered Design</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Pieces built to be worn daily, not just kept for one event.
          </p>
        </div>
      </div>
    </div>
  );
}
