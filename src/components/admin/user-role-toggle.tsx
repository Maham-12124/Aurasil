"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "@/app/admin/users/actions";
import { cn } from "@/lib/utils";
import type { Role } from "@/generated/prisma/client";

export function UserRoleToggle({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: Role;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next: Role = role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    if (!confirm(`Make ${next === "ADMIN" ? "this user an admin" : "this user a customer"}?`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await setUserRole(userId, next);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div>
      <button
        onClick={toggle}
        disabled={isSelf || isPending}
        title={isSelf ? "You can't change your own role" : undefined}
        className={cn(
          "border px-3 py-1 text-xs uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-50",
          role === "ADMIN"
            ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            : "border-border text-foreground/80 hover:bg-muted",
        )}
      >
        {isPending ? "…" : role === "ADMIN" ? "Admin" : "Customer"}
      </button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
