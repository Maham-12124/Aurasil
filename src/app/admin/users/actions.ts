"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

export async function setUserRole(userId: string, role: Role) {
  const session = await requireAdmin();

  if (session.user.id === userId) {
    throw new Error("You can't change your own role from this panel.");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}
