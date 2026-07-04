"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategory } from "@/app/admin/categories/actions";

export function AddCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("name", name);
        await createCategory(formData);
        setName("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      <div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="w-56 rounded-none"
          required
        />
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="rounded-none px-4 text-xs uppercase tracking-widest"
      >
        {isPending ? "Adding…" : "+ Add Category"}
      </Button>
    </form>
  );
}
