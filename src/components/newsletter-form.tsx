"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong. Please try again.");
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  }

  if (status === "success") {
    return (
      <p className="text-sm text-primary">Thanks — you&apos;re on the list.</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <div className="flex gap-2">
        <Input
          type="email"
          required
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-none bg-background"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-none px-5 text-xs uppercase tracking-widest"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </form>
  );
}
