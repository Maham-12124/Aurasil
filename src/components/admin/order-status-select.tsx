"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/app/admin/orders/actions";
import { orderStatuses, type OrderStatus } from "@/lib/order-types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        const nextStatus = next as OrderStatus;
        setValue(nextStatus);
        startTransition(async () => {
          await updateOrderStatus(orderId, nextStatus);
        });
      }}
      disabled={pending}
    >
      <SelectTrigger size="sm" className="w-36 rounded-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {orderStatuses.map((s) => (
          <SelectItem key={s} value={s}>
            {STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
