import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { Logo } from "./Logo";
import { categoriesQuery } from "@/lib/woo-queries";
import { stripHtml } from "@/lib/woo-types";

const STORE_CART_URL = "https://astaa.store/cart/";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const { data: categories } = useQuery(categoriesQuery());
  const topCategories = (categories ?? []).slice(0, 6);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const q = term.trim();
    setMenuOpen(false);
    navigate({ to: "/shop", search: q ? { q, page: 1 } : { page: 1 } });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          className="lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Logo />

        <nav className="ml-6 hidden items-center gap-6 lg:flex">
          <Link to="/shop" search={{ page: 1 }} className="eyebrow hover:text-clay">
            All products
          </Link>
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              to="/shop"
              search={{ page: 1, category: cat.slug }}
              className="eyebrow text-muted-foreground hover:text-clay"
            >
              {stripHtml(cat.name)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <form onSubmit={submitSearch} className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-2 border-b border-border pb-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search 1000+ products"
                className="w-44 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </form>
          <a
            href={STORE_CART_URL}
            className="relative inline-flex h-10 w-10 items-center justify-center bg-ink text-ink-foreground transition-opacity hover:opacity-90"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </a>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-background px-4 pt-4 pb-6 lg:hidden">
          <form onSubmit={submitSearch} className="mb-4 flex items-center gap-2 border-b pb-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>
          <div className="flex flex-col gap-3">
            <Link
              to="/shop"
              search={{ page: 1 }}
              onClick={() => setMenuOpen(false)}
              className="eyebrow"
            >
              All products
            </Link>
            {(categories ?? []).map((cat) => (
              <Link
                key={cat.id}
                to="/shop"
                search={{ page: 1, category: cat.slug }}
                onClick={() => setMenuOpen(false)}
                className="eyebrow text-muted-foreground"
              >
                {stripHtml(cat.name)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
