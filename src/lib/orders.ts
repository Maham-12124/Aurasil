import "server-only";
import { prisma } from "@/lib/prisma";
import type { OrderWithItems } from "@/lib/order-types";

export * from "@/lib/order-types";

export function getOrderById(id: string): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({ where: { id }, include: { items: true } });
}

export function getOrderByOrderNumber(orderNumber: string): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({ where: { orderNumber }, include: { items: true } });
}

export function getOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

export function getAllOrders(): Promise<OrderWithItems[]> {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}
