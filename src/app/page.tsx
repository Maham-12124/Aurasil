import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { CategoryShowcase, type ShowcaseCategory } from "@/components/category-showcase";
import { SaleCarousel } from "@/components/sale-carousel";
import { getAllProducts, getProductsByCollection, type Product } from "@/lib/products";
import { getAllCategories } from "@/lib/categories";

export const revalidate = 0;

export default async function Home() {
  const [allProducts, dailyWearAll, weddingEssentialsAll, categories] = await Promise.all([
    getAllProducts(),
    getProductsByCollection("quiet-luxury-daily"),
    getProductsByCollection("desi-wedding-essentials"),
    getAllCategories(),
  ]);

  const newArrivals = allProducts.filter((p) => p.isNew);
  const dailyWear = dailyWearAll.slice(0, 4);
  const weddingEssentials = weddingEssentialsAll.slice(0, 4);
  const onSale = allProducts.filter(
    (p) => p.compareAtPrice != null && p.compareAtPrice > p.price,
  );

  const categoryShowcase: ShowcaseCategory[] = categories.map((category) => ({
    label: category.name,
    href: `/products?category=${category.name}`,
    image:
      category.image ??
      allProducts.find((p) => p.category === category.name)?.image ??
      "/images/products/product-01.jpg",
  }));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-gingham absolute inset-0 opacity-40" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-24 text-center sm:px-6 lg:py-32">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">
            Quiet Luxury, Everyday
          </p>
          <h1 className="max-w-3xl font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Fine Artificial Jewelry, Worn Daily
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Gold-toned earrings, necklaces, rings and bracelets — considered
            pieces for daily wear and desi wedding occasions alike.
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button
              size="lg"
              nativeButton={false}
              className="w-full rounded-none px-8 uppercase tracking-widest sm:w-auto"
              render={<Link href="/products">Shop All Jewelry</Link>}
            />
            <Button
              size="lg"
              nativeButton={false}
              variant="outline"
              className="w-full rounded-none border-primary px-8 uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground sm:w-auto"
              render={<Link href="/products?new=true">New Arrivals</Link>}
            />
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16">
        <div className="mx-auto mb-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Explore</p>
          <h2 className="mt-2 font-heading text-3xl">Shop by Category</h2>
        </div>
        <CategoryShowcase categories={categoryShowcase} />
      </section>

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Just Landed</p>
            <h2 className="mt-2 font-heading text-3xl">New Arrivals</h2>
          </div>
          <Link
            href="/products"
            className="hidden text-xs uppercase tracking-widest text-foreground/80 hover:text-primary sm:block"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {(newArrivals.length ? newArrivals : allProducts.slice(0, 8)).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Sale */}
      {onSale.length > 0 && (
        <section className="bg-gingham relative py-16">
          <SaleCarousel products={onSale} />
        </section>
      )}

      {/* Featured Collections */}
      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Shop by Look</p>
            <h2 className="mt-2 font-heading text-3xl">Featured Collections</h2>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <CollectionBlock
              title="Quiet Luxury Daily Wear"
              description="Minimal gold pieces built for every day — studs, huggies, and slim rings that never come off."
              href="/products"
              products={dailyWear}
            />
            <CollectionBlock
              title="Desi Wedding Essentials"
              description="Statement rings, layered necklaces, and full bangle stacks for mehndi to walima."
              href="/products"
              products={weddingEssentials}
            />
          </div>
        </div>
      </section>

      {/* Editorial strip */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src="/images/products/product-25.jpg"
              alt="Aurasil layered pearl necklace"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-md">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Our Story</p>
            <h2 className="mt-2 font-heading text-3xl leading-snug">
              Jewelry that carries a story, not just a shine.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Every Aurasil piece is nickel-free, water-resistant, and finished
              to hold its colour through daily wear — so the piece you fell
              for on day one still looks that way a year in.
            </p>
            <Button
              nativeButton={false}
              className="mt-6 rounded-none uppercase tracking-widest"
              render={<Link href="/products">Explore The Collection</Link>}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function CollectionBlock({
  title,
  description,
  href,
  products,
}: {
  title: string;
  description: string;
  href: string;
  products: Product[];
}) {
  return (
    <div className="bg-card p-6">
      <h3 className="font-heading text-xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="relative block aspect-square overflow-hidden bg-muted"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="150px"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </Link>
        ))}
      </div>
      <Link
        href={href}
        className="mt-6 inline-block text-xs uppercase tracking-widest text-primary"
      >
        Shop the Look →
      </Link>
    </div>
  );
}
