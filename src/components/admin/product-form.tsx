"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImagePicker } from "@/components/admin/image-picker";
import { collectionLabels, type Product } from "@/lib/product-types";

const COLLECTIONS = Object.entries(collectionLabels) as [string, string][];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({
  product,
  categories,
  action,
}: {
  product?: Product;
  categories: string[];
  action: (formData: FormData) => Promise<void>;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!product);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await action(formData);
      } catch (err) {
        // Server actions that call redirect() throw a special error that
        // must keep propagating, not be treated as a form validation error.
        if (err && typeof err === "object" && "digest" in err) throw err;
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={product?.category ?? categories[0] ?? ""}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (Rs)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={1}
            required
            defaultValue={product?.price}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min={0}
            required
            defaultValue={product?.stock ?? 20}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">Compare-at Price (optional)</Label>
          <Input
            id="compareAtPrice"
            name="compareAtPrice"
            type="number"
            min={1}
            defaultValue={product?.compareAtPrice ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="finish">Finish / Material</Label>
          <Input id="finish" name="finish" required defaultValue={product?.finish} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Product Image</Label>
        <ImagePicker name="image" defaultValue={product?.image} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={product?.description}
        />
      </div>

      <div className="space-y-2">
        <Label>Collections</Label>
        <div className="flex flex-col gap-2">
          {COLLECTIONS.map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <Checkbox
                name="collections"
                value={value}
                defaultChecked={product?.collections.includes(value)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox name="isNew" defaultChecked={product?.isNew} />
        Mark as &quot;New Arrival&quot;
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        disabled={isPending}
        className="rounded-none px-8 uppercase tracking-widest"
      >
        {isPending ? "Saving…" : product ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}
