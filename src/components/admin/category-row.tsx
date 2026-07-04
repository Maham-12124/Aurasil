"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { renameCategory, deleteCategory } from "@/app/admin/categories/actions";

export function CategoryRow({
  id,
  name,
  productCount,
}: {
  id: string;
  name: string;
  productCount: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRename() {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("name", value);
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

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        {editing ? (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-8 max-w-xs rounded-none"
            autoFocus
          />
        ) : (
          name
        )}
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </td>
      <td className="px-4 py-3">{productCount}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex justify-end gap-3">
          {editing ? (
            <>
              <button
                onClick={handleRename}
                disabled={isPending}
                className="text-xs uppercase tracking-widest text-primary hover:underline disabled:opacity-50"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setValue(name);
                  setError(null);
                }}
                className="text-xs uppercase tracking-widest text-muted-foreground hover:underline"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="text-xs uppercase tracking-widest text-primary hover:underline"
              >
                Rename
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-xs uppercase tracking-widest text-destructive hover:underline disabled:opacity-50"
              >
                {isPending ? "Deleting…" : "Delete"}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
