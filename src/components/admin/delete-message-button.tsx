"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteContactMessage } from "@/app/admin/messages/actions";

export function DeleteMessageButton({ messageId }: { messageId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteContactMessage(messageId);
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
