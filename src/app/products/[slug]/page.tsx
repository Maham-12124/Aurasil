import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { getReviewsByProductId } from "@/lib/reviews";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { ProductCard } from "@/components/product-card";
import { ProductReviews } from "@/components/product-reviews";

export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [allProducts, reviews] = await Promise.all([
    getAllProducts(),
    getReviewsByProductId(product.id),
  ]);
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 text-xs uppercase tracking-widest text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary">All Jewelry</Link>
        <span className="mx-2">/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-primary">
          {product.category}
        </Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} />
      </div>

      <ProductReviews productId={product.id} reviews={reviews} />

      {related.length > 0 && (
        <section className="mt-24 border-t border-border pt-14">
          <h2 className="mb-8 font-heading text-2xl">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
