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
    <div className="mx-auto max-w-7xl gap-10 px-4 py-6 sm:px-6 sm:py-10 lg:flex lg:px-8">
      <aside className="mb-6 lg:mb-0 lg:w-48 lg:shrink-0">
        <p className="font-heading text-xl text-primary">Admin</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{session.user.email}</p>
        <nav className="scrollbar-none mt-6 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col lg:overflow-visible">
          {ADMIN_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 whitespace-nowrap px-2 py-2 text-sm uppercase tracking-widest text-foreground/80 hover:bg-muted hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-4 block px-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary lg:mt-8"
        >
          ← Back to Store
        </Link>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
