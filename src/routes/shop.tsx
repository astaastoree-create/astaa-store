import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/woo-queries";
import { stripHtml } from "@/lib/woo-types";

const searchSchema = z.object({
  page: z.number().int().min(1).max(500).default(1),
  category: z.string().max(120).optional(),
  q: z.string().max(120).optional(),
  sort: z.enum(["date", "price", "popularity", "rating", "title"]).default("date"),
  sale: z.boolean().optional(),
});

const SORTS = [
  { value: "date", label: "Newest" },
  { value: "popularity", label: "Popular" },
  { value: "rating", label: "Top rated" },
  { value: "price", label: "Price" },
  { value: "title", label: "A–Z" },
] as const;

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop All Products — Astaa Store" },
      {
        name: "description",
        content:
          "Browse the full Astaa Store catalogue: fashion, gadgets, beauty care and home accessories with fast delivery.",
      },
      { property: "og:title", content: "Shop All Products — Astaa Store" },
      {
        property: "og:description",
        content: "Fashion, gadgets, beauty and home objects — curated by Astaa Store.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { page, category, q, sort, sale } = Route.useSearch();
  const { data: categories } = useQuery(categoriesQuery());
  const { data, isPending, isError } = useQuery(
    productsQuery({
      page,
      perPage: 24,
      category: category ? String(categories?.find((c) => c.slug === category)?.id ?? "") : undefined,
      search: q,
      orderby: sort,
      order: sort === "price" || sort === "title" ? "asc" : "desc",
      onSale: sale,
    }),
  );

  const activeCategory = categories?.find((c) => c.slug === category);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <p className="eyebrow text-muted-foreground">
          {q ? `Search results for “${q}”` : sale ? "Reduced" : "Catalogue"}
        </p>
        <h1 className="mt-3 text-4xl font-light sm:text-5xl">
          {activeCategory ? stripHtml(activeCategory.name) : q ? q : "Everything at Astaa"}
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          {data ? `${data.total} products` : "Loading catalogue"} — filter by collection, sort the
          way you shop, checkout securely on astaa.store.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
          <Link
            to="/shop"
            search={{ page: 1, sort }}
            className={`eyebrow border px-3 py-2 transition-colors ${
              !category && !sale
                ? "border-ink bg-ink text-ink-foreground"
                : "border-border hover:border-ink"
            }`}
          >
            All
          </Link>
          {(categories ?? []).map((cat) => (
            <Link
              key={cat.id}
              to="/shop"
              search={{ page: 1, category: cat.slug, sort }}
              className={`eyebrow border px-3 py-2 transition-colors ${
                category === cat.slug
                  ? "border-ink bg-ink text-ink-foreground"
                  : "border-border hover:border-ink"
              }`}
            >
              {stripHtml(cat.name)}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-y border-border py-3">
          <span className="eyebrow mr-2 text-muted-foreground">Sort</span>
          {SORTS.map((option) => (
            <Link
              key={option.value}
              to="/shop"
              search={{ page: 1, category, q, sale, sort: option.value }}
              className={`text-sm transition-colors ${
                sort === option.value
                  ? "text-clay underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {isError && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            We couldn't load products right now. Please refresh in a moment.
          </p>
        )}

        {isPending && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {data && data.products.length === 0 && (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-light">Nothing matched that</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try another collection or a shorter search term.
            </p>
            <Link
              to="/shop"
              search={{ page: 1 }}
              className="eyebrow mt-6 inline-block bg-ink px-6 py-3 text-ink-foreground"
            >
              Browse everything
            </Link>
          </div>
        )}

        {data && data.products.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {data.products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {data.totalPages > 1 && (
              <nav className="mt-16 flex items-center justify-center gap-3">
                {page > 1 && (
                  <Link
                    to="/shop"
                    search={{ page: page - 1, category, q, sale, sort }}
                    className="eyebrow border border-border px-4 py-3 hover:border-ink"
                  >
                    Previous
                  </Link>
                )}
                <span className="eyebrow text-muted-foreground">
                  Page {page} of {data.totalPages}
                </span>
                {page < data.totalPages && (
                  <Link
                    to="/shop"
                    search={{ page: page + 1, category, q, sale, sort }}
                    className="eyebrow bg-ink px-4 py-3 text-ink-foreground"
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
