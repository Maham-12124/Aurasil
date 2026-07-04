"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteReview } from "@/app/admin/reviews/actions";

export function DeleteReviewButton({ reviewId }: { reviewId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteReview(reviewId);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs uppercase tracking-widest text-destructive hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
