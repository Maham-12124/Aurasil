import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { getOrderByOrderNumber } from "@/lib/orders";
import { formatPrice } from "@/lib/product-types";
import { Button } from "@/components/ui/button";

export const revalidate = 0;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const PAYMENT_LABELS: Record<string, string> = {
  COD: "Cash on Delivery",
  BANK_TRANSFER: "Bank Transfer",
};

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { orderNumber } = await params;
  const { email } = await searchParams;
  const order = await getOrderByOrderNumber(orderNumber);
  const session = await auth();

  const authorized =
    order &&
    ((email && order.email.toLowerCase() === email.toLowerCase()) ||
      (session?.user?.id && session.user.id === order.userId));

  if (!order || !authorized) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="font-heading text-2xl">Order Not Found</h1>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t find that order. Double-check your Order Number and
          the email you used at checkout.
        </p>
        <Button nativeButton={false} className="rounded-none" render={<Link href="/track">Track an Order</Link>} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Thank You</p>
        <h1 className="mt-2 font-heading text-3xl">Order Confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve received your order — keep this page bookmarked to track it.
        </p>
      </div>

      <div className="border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Order Number
            </p>
            <p className="mt-1 font-heading text-xl">{order.orderNumber}</p>
          </div>
          <span className="border border-primary px-3 py-1 text-xs uppercase tracking-widest text-primary">
            {STATUS_LABELS[order.status] ?? order.status}
          </span>
        </div>

        <ul className="mt-4 divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-muted">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col text-sm">
                <span className="leading-snug">{item.productName}</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Qty {item.quantity} × {formatPrice(item.unitPrice)}
                </span>
              </div>
              <span className="text-sm">{formatPrice(item.lineTotal)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-border pt-4">
          <div className="flex justify-between font-heading text-lg">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 border-t border-border pt-6 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Shipping To
            </p>
            <p className="mt-2">{order.customerName}</p>
            <p className="text-muted-foreground">{order.address}</p>
            <p className="text-muted-foreground">{order.city}</p>
            <p className="mt-1 text-muted-foreground">{order.phone}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Payment
            </p>
            <p className="mt-2">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</p>
            {order.notes && (
              <>
                <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
                  Notes
                </p>
                <p className="mt-2 text-muted-foreground">{order.notes}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button nativeButton={false} variant="outline" className="rounded-none" render={<Link href="/products">Continue Shopping</Link>} />
      </div>
    </div>
  );
}
