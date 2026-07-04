import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { getAllReviews } from "@/lib/reviews";
import { DeleteReviewButton } from "@/components/admin/delete-review-button";
import { cn } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <div>
      <h1 className="font-heading text-3xl">Reviews</h1>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Comment</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/products/${review.product.slug}`}
                    className="flex items-center gap-3 hover:text-primary"
                  >
                    <div className="relative h-10 w-8 shrink-0 overflow-hidden bg-muted">
                      <Image
                        src={review.product.image}
                        alt={review.product.name}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <span className="max-w-[140px] truncate">{review.product.name}</span>
                  </Link>
                </td>
                <td className="px-4 py-3">{review.authorName}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn(
                          "h-3.5 w-3.5",
                          n <= review.rating ? "fill-primary text-primary" : "text-border",
                        )}
                      />
                    ))}
                  </div>
                </td>
                <td className="max-w-xs px-4 py-3">
                  <p className="line-clamp-2 text-muted-foreground">{review.comment}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(review.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteReviewButton reviewId={review.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
