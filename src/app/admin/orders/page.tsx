import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/product-types";
import { OrderStatusSelect } from "@/components/admin/order-status-select";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <h1 className="font-heading text-3xl">Orders</h1>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Placed</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p>{order.orderNumber}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="max-w-[160px] truncate">{order.customerName}</p>
                  <p className="max-w-[160px] truncate text-xs text-muted-foreground">
                    {order.email}
                  </p>
                </td>
                <td className="px-4 py-3">{order.items.length}</td>
                <td className="px-4 py-3">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  {order.paymentMethod === "COD" ? "COD" : "Bank Transfer"}
                </td>
                <td className="px-4 py-3">
                  {new Date(order.createdAt).toLocaleDateString("en-PK", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="py-10 text-center text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
