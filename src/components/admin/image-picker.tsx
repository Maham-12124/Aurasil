"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type GalleryImage = { id: string; url: string };

export function ImagePicker({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const [imageUrl, setImageUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setError(null);
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setImageUrl(data.url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function openGallery() {
    setGalleryOpen(true);
    setGalleryLoading(true);
    try {
      const res = await fetch("/api/admin/uploads");
      const data = await res.json();
      setGallery(data.images ?? []);
    } finally {
      setGalleryLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={imageUrl} />

      {imageUrl && (
        <div className="relative h-40 w-32 overflow-hidden border border-border bg-muted">
          <Image
            src={imageUrl}
            alt="Selected product"
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) uploadFile(file);
        }}
        className={cn(
          "flex flex-col items-center gap-2 border border-dashed p-6 text-center text-sm text-muted-foreground",
          dragOver ? "border-primary bg-primary/5" : "border-border",
        )}
      >
        <p>Drag &amp; drop an image here, or</p>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload File"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-none"
            onClick={openGallery}
          >
            Choose From Gallery
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {galleryOpen && (
        <div className="border border-border p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-foreground/70">Gallery</p>
            <button
              type="button"
              onClick={() => setGalleryOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          {galleryLoading ? (
            <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
          ) : gallery.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No uploaded images yet — upload one above.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {gallery.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => {
                    setImageUrl(img.url);
                    setGalleryOpen(false);
                  }}
                  className={cn(
                    "relative aspect-square overflow-hidden border-2",
                    imageUrl === img.url ? "border-primary" : "border-transparent",
                  )}
                >
                  <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
