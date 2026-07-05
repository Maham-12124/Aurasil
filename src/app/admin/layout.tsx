import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/subscribers", label: "Subscribers" },
  { href: "/admin/users", label: "Users" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:px-8">
      <aside className="w-48 shrink-0">
        <p className="font-heading text-xl text-primary">Admin</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{session.user.email}</p>
        <nav className="mt-8 flex flex-col gap-1">
          {ADMIN_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2 py-2 text-sm uppercase tracking-widest text-foreground/80 hover:bg-muted hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-8 block px-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
        >
          ← Back to Store
        </Link>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
