import { Link } from "@tanstack/react-router";

import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo className="items-start text-ink-foreground" />
            <p className="mt-4 text-sm opacity-70">
              Fashion, gadgets, beauty and home objects — curated in one place and shipped fast to
              your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="eyebrow opacity-60">Shop</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link to="/shop" search={{ page: 1 }} className="opacity-80 hover:opacity-100">
                    All products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    search={{ page: 1, sort: "popularity" }}
                    className="opacity-80 hover:opacity-100"
                  >
                    Best sellers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    search={{ page: 1, sale: true }}
                    className="opacity-80 hover:opacity-100"
                  >
                    On sale
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow opacity-60">Help</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href="https://astaa.store/cart/" className="opacity-80 hover:opacity-100">
                    Cart
                  </a>
                </li>
                <li>
                  <a href="https://astaa.store/my-account/" className="opacity-80 hover:opacity-100">
                    My account
                  </a>
                </li>
                <li>
                  <a href="https://astaa.store/checkout/" className="opacity-80 hover:opacity-100">
                    Checkout
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow opacity-60">Store</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="opacity-80">Free delivery over $100</li>
                <li className="opacity-80">7-day easy returns</li>
                <li className="opacity-80">Secure checkout</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-ink-foreground/15 pt-6 text-xs opacity-60 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Astaa Store. All rights reserved.</p>
          <p>Your World. Your Finds.</p>
        </div>
      </div>
    </footer>
  );
}
