"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/admin/image-picker";
import { createCategory } from "@/app/admin/categories/actions";

export function AddCategoryForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pickerKey, setPickerKey] = useState(0);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createCategory(formData);
        setName("");
        formRef.current?.reset();
        setPickerKey((k) => k + 1); // remount ImagePicker to clear its preview
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="max-w-md space-y-3 border border-border p-4">
      <div>
        <Input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="rounded-none"
          required
        />
      </div>
      <ImagePicker key={pickerKey} name="image" />
      {error && <p className="text-xs text-destructive">{error}</p>}
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
