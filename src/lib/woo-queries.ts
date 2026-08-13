import { queryOptions } from "@tanstack/react-query";

import { getProduct, listCategories, listProducts } from "./woo.functions";

type ListArgs = {
  page?: number | undefined;
  perPage?: number | undefined;
  category?: string | undefined;
  search?: string | undefined;
  orderby?: "date" | "price" | "popularity" | "rating" | "title" | undefined;
  order?: "asc" | "desc" | undefined;
  featured?: boolean | undefined;
  onSale?: boolean | undefined;
};

export const productsQuery = (args: ListArgs = {}) =>
  queryOptions({
    queryKey: ["woo", "products", args],
    queryFn: () => listProducts({ data: args }),
    staleTime: 5 * 60 * 1000,
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["woo", "product", slug],
    queryFn: () => getProduct({ data: { slug } }),
    staleTime: 5 * 60 * 1000,
  });

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["woo", "categories"],
    queryFn: () => listCategories(),
    staleTime: 30 * 60 * 1000,
  });
