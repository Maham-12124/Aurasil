import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getOrdersByUserId } from "@/lib/orders";
import { formatPrice } from "@/lib/product-types";

export const revalidate = 0;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default async function MyOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/orders");

  const orders = await getOrdersByUserId(session.user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 border-b border-border pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Your Account</p>
        <h1 className="mt-2 font-heading text-4xl">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center text-muted-foreground">
          <p>You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="mt-3 inline-block text-sm text-primary hover:underline">
            Start Shopping →
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-border border border-border">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/order/${order.orderNumber}?email=${encodeURIComponent(order.email)}`}
                className="flex flex-wrap items-center justify-between gap-3 p-5 hover:bg-muted/40"
              >
                <div>
                  <p className="font-heading text-base">{order.orderNumber}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">{formatPrice(order.total)}</span>
                  <span className="border border-primary px-3 py-1 text-xs uppercase tracking-widest text-primary">
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
