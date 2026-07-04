import type { Order, OrderItem, OrderStatus, PaymentMethod } from "@/generated/prisma/client";

export type { Order, OrderItem, OrderStatus, PaymentMethod };
export type OrderWithItems = Order & { items: OrderItem[] };

export const orderStatuses: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];
