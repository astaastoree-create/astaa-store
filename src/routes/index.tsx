import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Truck, Undo2 } from "lucide-react";

import heroImage from "@/assets/astaa-hero.jpg";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { categoriesQuery, productsQuery } from "@/lib/woo-queries";
import { stripHtml } from "@/lib/woo-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Astaa Store — Your World. Your Finds." },
      {
        name: "description",
        content:
          "Astaa Store curates fashion, gadgets, beauty care and home accessories in one place. Up to 10% off new season trending items with fast delivery.",
      },
      { property: "og:title", content: "Astaa Store — Your World. Your Finds." },
      {
        property: "og:description",
        content:
          "Fashion, gadgets, beauty and home objects — curated by Astaa Store with fast delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MARQUEE = [
  "Up to 10% off new season",
  "Free delivery over $100",
  "7-day easy returns",
  "Secure checkout",
];

function Index() {
  const { data: categories } = useQuery(categoriesQuery());
  const { data: trending } = useQuery(productsQuery({ perPage: 8, orderby: "popularity" }));
  const { data: fresh } = useQuery(productsQuery({ perPage: 4, orderby: "date" }));

  const featuredCategories = (categories ?? []).filter((c) => c.image).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero — editorial split */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow text-clay">Casual &amp; everyday</p>
            <h1 className="mt-6 text-5xl leading-[0.95] font-light sm:text-6xl lg:text-7xl">
              Your world.
              <br />
              Your finds.
              <br />
              <span className="italic">Astaa.</span>
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
              Up to 10% off on all new season trending items. Quality guaranteed, delivered fast
              right to your doorstep.
            </p>
            <div className="mt-9 flex items-center gap-6">
              <Link
                to="/shop"
                search={{ page: 1 }}
                className="eyebrow inline-flex items-center gap-3 bg-ink px-8 py-4 text-ink-foreground transition-opacity hover:opacity-90"
              >
                Shop the collection <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/shop"
                search={{ page: 1, sale: true }}
                className="eyebrow border-b border-clay pb-1 text-clay"
              >
                See offers
              </Link>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Astaa Store new season editorial look with knit sweater and leather handbag"
              width={1408}
              height={1760}
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute -bottom-6 -left-6 hidden bg-background px-6 py-5 shadow-sm sm:block">
              <p className="font-display text-3xl">10%</p>
              <p className="eyebrow mt-1 text-muted-foreground">New season off</p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="overflow-hidden border-y border-border bg-sand py-3">
        <div className="marquee-track flex w-max gap-12">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="eyebrow whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-foreground">Shop by department</p>
            <h2 className="mt-3 text-4xl font-light">Four worlds, one store</h2>
          </div>
          <Link to="/shop" search={{ page: 1 }} className="eyebrow border-b border-ink pb-1">
            All departments
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featuredCategories.length > 0
            ? featuredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to="/shop"
                  search={{ page: 1, category: cat.slug }}
                  className="group relative block aspect-[3/4] overflow-hidden bg-secondary"
                >
                  <img
                    src={cat.image?.src}
                    alt={stripHtml(cat.name)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="text-xl font-normal text-ink-foreground">
                      {stripHtml(cat.name)}
                    </h3>
                    <span className="eyebrow mt-1 inline-flex items-center gap-2 text-ink-foreground/80">
                      Explore <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))
            : Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse bg-secondary" />
              ))}
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border pt-14">
          <div>
            <p className="eyebrow text-clay">Trending at Astaa</p>
            <h2 className="mt-3 text-4xl font-light">
              The products everyone&apos;s discovering right now
            </h2>
          </div>
          <Link
            to="/shop"
            search={{ page: 1, sort: "popularity" }}
            className="eyebrow border-b border-ink pb-1"
          >
            View all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {trending
            ? trending.products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            : Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </section>

      {/* Editorial banner */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <p className="eyebrow opacity-60">The Astaa promise</p>
            <h2 className="mt-4 max-w-2xl text-4xl leading-tight font-light sm:text-5xl">
              A thousand products, curated like a single collection.
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-relaxed opacity-70">
              Every item in the catalogue is checked for quality before it reaches the shelf —
              clothing, gadgets, beauty and home. Browse the full range and check out securely on
              astaa.store.
            </p>
            <Link
              to="/shop"
              search={{ page: 1 }}
              className="eyebrow mt-9 inline-flex items-center gap-3 border border-ink-foreground/30 px-8 py-4 transition-colors hover:bg-ink-foreground hover:text-ink"
            >
              Browse full catalogue <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <ul className="space-y-8 lg:pt-14">
            <li className="flex gap-4">
              <Truck className="mt-1 h-5 w-5 shrink-0 text-clay" />
              <div>
                <p className="text-base">Fast doorstep delivery</p>
                <p className="mt-1 text-sm opacity-60">Dispatched within 24 hours.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Undo2 className="mt-1 h-5 w-5 shrink-0 text-clay" />
              <div>
                <p className="text-base">7-day easy returns</p>
                <p className="mt-1 text-sm opacity-60">Changed your mind? No problem.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-clay" />
              <div>
                <p className="text-base">Quality guaranteed</p>
                <p className="mt-1 text-sm opacity-60">Hand-checked before shipping.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Just in */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-muted-foreground">Just in</p>
            <h2 className="mt-3 text-4xl font-light">Fresh arrivals this week</h2>
          </div>
          <Link
            to="/shop"
            search={{ page: 1, sort: "date" }}
            className="eyebrow border-b border-ink pb-1"
          >
            See new arrivals
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {fresh
            ? fresh.products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            : Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </section>

      <Footer />
    </div>
  );
}
