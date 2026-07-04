import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [productCount, userCount, newCount, outOfStockCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.product.count({ where: { isNew: true } }),
    prisma.product.count({ where: { stock: 0 } }),
  ]);

  const stats = [
    { label: "Total Products", value: productCount, href: "/admin/products" },
    { label: "Registered Users", value: userCount, href: null },
    { label: "Marked \"New\"", value: newCount, href: "/admin/products" },
    { label: "Out of Stock", value: outOfStockCount, href: "/admin/products" },
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl">Dashboard</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const content = (
            <div className="border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 font-heading text-3xl">{stat.value}</p>
            </div>
          );
          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={stat.label}>{content}</div>
          );
        })}
      </div>

      <div className="mt-10 border border-border bg-card p-6">
        <h2 className="font-heading text-xl">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="border border-primary px-4 py-2 text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Add New Product
          </Link>
          <Link
            href="/admin/products"
            className="border border-border px-4 py-2 text-xs uppercase tracking-widest hover:bg-muted"
          >
            Manage Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
