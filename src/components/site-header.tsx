"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { CartDrawer } from "@/components/cart-drawer";
import { TopBar } from "@/components/top-bar";
import { cartCount, useCartStore } from "@/lib/cart-store";

const NAV_LINKS = [
  { href: "/products", label: "All Jewelry" },
  { href: "/products?category=Earrings", label: "Earrings" },
  { href: "/products?category=Necklaces", label: "Necklaces" },
  { href: "/products?category=Rings", label: "Rings" },
  { href: "/products?category=Bracelets", label: "Bracelets" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const openCart = useCartStore((s) => s.open);
  const { data: session, status } = useSession();

  useEffect(() => setMounted(true), []);

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link
              href="/"
              className="font-heading text-2xl tracking-[0.15em] text-primary"
            >
              AURASIL
            </Link>
          </div>

          <nav className="hidden gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-widest text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            {mounted && status === "authenticated" && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="flex items-center gap-1.5"
                  aria-label="Account menu"
                >
                  <User className="h-5 w-5" />
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-8 w-48 border border-border bg-card p-3 shadow-md">
                    <p className="truncate text-sm">{session.user.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                    <Link
                      href="/orders"
                      onClick={() => setAccountOpen(false)}
                      className="mt-3 block w-full border border-border py-1.5 text-center text-xs uppercase tracking-widest hover:bg-muted"
                    >
                      My Orders
                    </Link>
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        onClick={() => setAccountOpen(false)}
                        className="mt-2 block w-full border border-primary py-1.5 text-center text-xs uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setAccountOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="mt-2 w-full border border-border py-1.5 text-xs uppercase tracking-widest hover:bg-muted"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs uppercase tracking-widest text-foreground/80 hover:text-primary"
                aria-label="Sign in"
              >
                <User className="h-5 w-5 lg:hidden" />
                <span className="hidden lg:inline">Sign In</span>
              </Link>
            )}

            <button onClick={openCart} className="relative" aria-label="Open cart">
              <ShoppingBag className="h-5 w-5" />
              {mounted && cartCount(lines) > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {cartCount(lines)}
                </span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-border px-4 py-4 lg:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-sm uppercase tracking-widest text-foreground/80"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <CartDrawer />
    </>
  );
}
