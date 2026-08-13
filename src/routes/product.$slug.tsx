import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Star, Truck, Undo2 } from "lucide-react";
import { useState } from "react";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { productQuery, productsQuery } from "@/lib/woo-queries";
import { formatPrice, priceRangeLabel, stripHtml, wooAddToCartUrl } from "@/lib/woo-types";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const readable = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${readable} — Astaa Store` },
        {
          name: "description",
          content: `${readable} at Astaa Store. Secure checkout, fast delivery to your doorstep.`,
        },
        { property: "og:title", content: `${readable} — Astaa Store` },
        {
          property: "og:description",
          content: `${readable} at Astaa Store. Secure checkout, fast delivery.`,
        },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isPending, isError } = useQuery(productQuery(slug));
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const categoryId = product?.categories[0]?.id;
  const { data: related } = useQuery({
    ...productsQuery({ perPage: 4, category: categoryId ? String(categoryId) : undefined }),
    enabled: Boolean(product),
  });

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          to="/shop"
          search={{ page: 1 }}
          className="eyebrow inline-flex items-center gap-2 text-muted-foreground hover:text-clay"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to shop
        </Link>
      </div>

      {isPending && (
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="aspect-[4/5] animate-pulse bg-secondary" />
          <div className="space-y-4">
            <div className="h-3 w-24 animate-pulse bg-secondary" />
            <div className="h-8 w-3/4 animate-pulse bg-secondary" />
            <div className="h-20 w-full animate-pulse bg-secondary" />
          </div>
        </div>
      )}

      {(isError || (!isPending && !product)) && (
        <div className="mx-auto max-w-2xl px-4 py-32 text-center">
          <h1 className="text-3xl font-light">This product isn't available</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            It may have sold out or been renamed. Browse the catalogue to find something similar.
          </p>
          <Link
            to="/shop"
            search={{ page: 1 }}
            className="eyebrow mt-8 inline-block bg-ink px-6 py-3 text-ink-foreground"
          >
            Browse products
          </Link>
        </div>
      )}

      {product && (
        <>
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
            <div>
              <div className="aspect-[4/5] w-full overflow-hidden bg-secondary">
                {product.images[activeImage] ? (
                  <img
                    src={product.images[activeImage].src}
                    alt={product.images[activeImage].alt || stripHtml(product.name)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-sand">
                    <span className="font-display text-5xl italic opacity-30">Astaa</span>
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`h-20 w-16 shrink-0 overflow-hidden border-2 transition-colors ${
                        index === activeImage ? "border-clay" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt || `${stripHtml(product.name)} view ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:pt-6">
              {product.categories[0] && (
                <Link
                  to="/shop"
                  search={{ page: 1, category: product.categories[0].slug }}
                  className="eyebrow text-clay"
                >
                  {stripHtml(product.categories[0].name)}
                </Link>
              )}
              <h1 className="mt-4 text-4xl leading-tight font-light sm:text-5xl">
                {stripHtml(product.name)}
              </h1>

              <div className="mt-5 flex items-center gap-4">
                <p className="font-display text-2xl">
                  {product.type === "variable"
                    ? priceRangeLabel(product.price_html, product.price)
                    : formatPrice(product.price)}
                </p>
                {product.on_sale && product.regular_price && product.type !== "variable" && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                )}
                {product.rating_count > 0 && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-clay text-clay" />
                    {product.average_rating} ({product.rating_count})
                  </span>
                )}
              </div>

              {product.short_description && (
                <p className="mt-6 max-w-prose text-sm leading-relaxed text-muted-foreground">
                  {stripHtml(product.short_description)}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex items-center border border-border">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-3 text-sm hover:bg-secondary"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    className="px-4 py-3 text-sm hover:bg-secondary"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {product.type === "variable" ? (
                  <a
                    href={product.permalink}
                    className="eyebrow flex-1 bg-ink px-8 py-4 text-center text-ink-foreground transition-opacity hover:opacity-90"
                  >
                    Choose options
                  </a>
                ) : (
                  <a
                    href={wooAddToCartUrl(product.id, quantity)}
                    className="eyebrow flex-1 bg-ink px-8 py-4 text-center text-ink-foreground transition-opacity hover:opacity-90"
                  >
                    {product.stock_status === "outofstock" ? "Sold out" : "Add to cart"}
                  </a>
                )}
              </div>

              <ul className="mt-8 grid gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-clay" /> Fast delivery right to your doorstep
                </li>
                <li className="flex items-center gap-3">
                  <Undo2 className="h-4 w-4 text-clay" /> 7-day easy returns
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 text-clay" /> Secure checkout on astaa.store
                </li>
              </ul>
            </div>
          </div>

          {product.description && (
            <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="eyebrow text-muted-foreground">Details</h2>
              <p className="mt-5 text-base leading-relaxed">{stripHtml(product.description)}</p>
            </section>
          )}

          <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-light">You may also like</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {related
                ? related.products
                    .filter((p) => p.id !== product.id)
                    .slice(0, 4)
                    .map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
                : Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
