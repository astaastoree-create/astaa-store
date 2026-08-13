export type WooImage = {
  id: number;
  src: string;
  alt: string;
};

export type WooCategoryRef = {
  id: number;
  name: string;
  slug: string;
};

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  price_html: string;
  stock_status: string;
  average_rating: string;
  rating_count: number;
  short_description: string;
  description: string;
  images: WooImage[];
  categories: WooCategoryRef[];
};

export type WooCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
  image: { src: string } | null;
};

export type ProductListResult = {
  products: WooProduct[];
  total: number;
  totalPages: number;
};

export const CURRENCY = "$";

export function formatPrice(value: string | number): string {
  const n = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(n)) return "";
  return `${CURRENCY}${n.toFixed(2)}`;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&#8217;|&#039;|&#39;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#36;/g, "$")
    .replace(/\\'/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Variable products expose a price range in price_html; render it as a clean "$a – $b". */
export function priceRangeLabel(priceHtml: string, fallback: string): string {
  const matches = [...priceHtml.matchAll(/(\d+(?:[.,]\d{2})?)/g)].map((m) =>
    Number.parseFloat(m[1].replace(",", ".")),
  );
  const values = matches.filter((n) => Number.isFinite(n) && n > 0);
  if (values.length === 0) return formatPrice(fallback);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
}

/** WooCommerce checkout hand-off: adds the item and lands the user on the store cart. */
export function wooAddToCartUrl(productId: number, quantity = 1): string {
  return `https://astaa.store/cart/?add-to-cart=${productId}&quantity=${quantity}`;
}
