"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { orderStatuses, type OrderStatus } from "@/lib/order-types";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();

  if (!orderStatuses.includes(status)) {
    throw new Error("Invalid order status.");
  }

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath("/orders");
}
