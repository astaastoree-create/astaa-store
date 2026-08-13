import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

import { formatPrice, stripHtml, type WooProduct } from "@/lib/woo-types";

function PriceLine({ product }: { product: WooProduct }) {
  if (product.type === "variable" && product.price_html) {
    return <span className="text-sm text-clay">{stripHtml(product.price_html)}</span>;
  }
  if (product.on_sale && product.regular_price) {
    return (
      <span className="flex items-baseline gap-2 text-sm">
        <span className="text-clay">{formatPrice(product.price)}</span>
        <span className="text-muted-foreground line-through">
          {formatPrice(product.regular_price)}
        </span>
      </span>
    );
  }
  return <span className="text-sm text-clay">{formatPrice(product.price)}</span>;
}

export function ProductCard({ product, index = 0 }: { product: WooProduct; index?: number }) {
  const image = product.images[0];
  const category = product.categories[0];

  return (
    <article className="group relative">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="block overflow-hidden bg-secondary"
      >
        <div className="relative aspect-[3/4] w-full">
          {image ? (
            <img
              src={image.src}
              alt={image.alt || product.name}
              loading={index < 4 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-sand">
              <span className="font-display text-3xl italic opacity-30">Astaa</span>
            </div>
          )}

          {product.on_sale && (
            <span className="eyebrow absolute top-3 left-3 bg-clay px-2 py-1 text-clay-foreground">
              Sale
            </span>
          )}
          {product.stock_status === "outofstock" && (
            <span className="eyebrow absolute top-3 right-3 bg-ink px-2 py-1 text-ink-foreground">
              Sold out
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/90 py-3 text-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="eyebrow text-ink-foreground">View details</span>
          </div>
        </div>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {category && (
            <span className="eyebrow block text-muted-foreground">{stripHtml(category.name)}</span>
          )}
          <h3 className="mt-1 truncate text-base font-medium">{stripHtml(product.name)}</h3>
          <div className="mt-1">
            <PriceLine product={product} />
          </div>
        </div>
        <button
          type="button"
          aria-label={`Save ${stripHtml(product.name)}`}
          className="mt-1 shrink-0 text-muted-foreground transition-colors hover:text-clay"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] w-full bg-secondary" />
      <div className="mt-3 h-2 w-16 bg-secondary" />
      <div className="mt-2 h-3 w-3/4 bg-secondary" />
      <div className="mt-2 h-3 w-14 bg-secondary" />
    </div>
  );
}
