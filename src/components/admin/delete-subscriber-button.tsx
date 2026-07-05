"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSubscriber } from "@/app/admin/subscribers/actions";

export function DeleteSubscriberButton({ subscriberId }: { subscriberId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Remove this subscriber? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteSubscriber(subscriberId);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs uppercase tracking-widest text-destructive hover:underline disabled:opacity-50"
    >
      {isPending ? "Removing…" : "Remove"}
    </button>
  );
}
