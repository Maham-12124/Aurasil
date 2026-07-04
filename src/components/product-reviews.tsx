"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getAverageRating, type Review } from "@/lib/review-types";
import { cn } from "@/lib/utils";

function StarRow({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(size, n <= Math.round(rating) ? "fill-primary text-primary" : "text-border")}
        />
      ))}
    </div>
  );
}

export function ProductReviews({
  productId,
  reviews,
}: {
  productId: string;
  reviews: Review[];
}) {
  const router = useRouter();
  const average = getAverageRating(reviews);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, authorName: name, rating, comment }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setName("");
    setRating(0);
    setComment("");
    router.refresh();
  }

  return (
    <section className="mt-24 border-t border-border pt-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl">Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <StarRow rating={average} />
            <span>
              {average.toFixed(1)} out of 5 ({reviews.length} review
              {reviews.length === 1 ? "" : "s"})
            </span>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No reviews yet — be the first to share your thoughts.
            </p>
          ) : (
            <ul className="space-y-6">
              {reviews.map((review) => (
                <li key={review.id} className="border-b border-border pb-6 last:border-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-heading text-base">{review.authorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="mt-1">
                    <StarRow rating={review.rating} />
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleSubmit} className="h-fit space-y-4 border border-border p-6">
          <h3 className="font-heading text-lg">Write a Review</h3>

          <div className="space-y-2">
            <Label>Rating</Label>
            <div
              className="flex items-center gap-1"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  aria-label={`${n} star${n === 1 ? "" : "s"}`}
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      n <= (hoverRating || rating)
                        ? "fill-primary text-primary"
                        : "text-border",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewName">Name</Label>
            <Input
              id="reviewName"
              required
              className="rounded-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewComment">Review</Label>
            <Textarea
              id="reviewComment"
              required
              rows={4}
              className="rounded-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-none py-5 text-xs uppercase tracking-widest"
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </Button>
        </form>
      </div>
    </section>
  );
}
