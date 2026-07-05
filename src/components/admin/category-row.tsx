"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ImagePicker } from "@/components/admin/image-picker";
import { renameCategory, deleteCategory } from "@/app/admin/categories/actions";

export function CategoryRow({
  id,
  name,
  image,
  productCount,
}: {
  id: string;
  name: string;
  image: string | null;
  productCount: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRename(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await renameCategory(id, formData);
        setEditing(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleDelete() {
    if (!confirm(`Delete category "${name}"?`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteCategory(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  if (editing) {
    return (
      <tr className="border-b border-border last:border-0">
        <td colSpan={3} className="px-4 py-4">
          <form action={handleRename} className="max-w-md space-y-3">
            <Input name="name" defaultValue={name} className="h-8 rounded-none" autoFocus />
            <ImagePicker name="image" defaultValue={image ?? undefined} />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="text-xs uppercase tracking-widest text-primary hover:underline disabled:opacity-50"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError(null);
                }}
                className="text-xs uppercase tracking-widest text-muted-foreground hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden border border-border bg-muted">
            {image ? (
              <Image src={image} alt={name} fill sizes="40px" className="object-cover" />
            ) : null}
          </div>
          {name}
        </div>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </td>
      <td className="px-4 py-3">{productCount}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setEditing(true)}
            className="text-xs uppercase tracking-widest text-primary hover:underline"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-xs uppercase tracking-widest text-destructive hover:underline disabled:opacity-50"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
