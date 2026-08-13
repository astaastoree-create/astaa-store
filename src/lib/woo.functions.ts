import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { ProductListResult, WooCategory, WooProduct } from "./woo-types";

const listInput = z.object({
  page: z.number().int().min(1).max(500).default(1),
  perPage: z.number().int().min(1).max(48).default(12),
  category: z.string().max(120).optional(),
  search: z.string().max(120).optional(),
  orderby: z.enum(["date", "price", "popularity", "rating", "title"]).default("date"),
  order: z.enum(["asc", "desc"]).default("desc"),
  featured: z.boolean().optional(),
  onSale: z.boolean().optional(),
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => listInput.parse(data ?? {}))
  .handler(async ({ data }): Promise<ProductListResult> => {
    const { wooFetch } = await import("./woo.server");
    const result = await wooFetch<WooProduct[]>("/products", {
      status: "publish",
      page: data.page,
      per_page: data.perPage,
      category: data.category,
      search: data.search,
      orderby: data.orderby,
      order: data.order,
      featured: data.featured,
      on_sale: data.onSale,
      _fields:
        "id,name,slug,permalink,type,price,regular_price,sale_price,on_sale,price_html,stock_status,average_rating,rating_count,short_description,images,categories",
    });
    return {
      products: result.data,
      total: result.total,
      totalPages: result.totalPages,
    };
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(data))
  .handler(async ({ data }): Promise<WooProduct | null> => {
    const { wooFetch } = await import("./woo.server");
    const result = await wooFetch<WooProduct[]>("/products", {
      slug: data.slug,
      status: "publish",
      per_page: 1,
    });
    return result.data[0] ?? null;
  });

export const listCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<WooCategory[]> => {
    const { wooFetch } = await import("./woo.server");
    const result = await wooFetch<WooCategory[]>("/products/categories", {
      per_page: 60,
      orderby: "count",
      order: "desc",
      hide_empty: false,
      _fields: "id,name,slug,count,description,image",
    });
    return result.data.filter((c) => c.slug !== "uncategorized");
  },
);
