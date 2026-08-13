const GATEWAY_URL = "https://connector-gateway.lovable.dev/woocommerce";

type Query = Record<string, string | number | boolean | undefined>;

export async function wooFetch<T>(
  path: string,
  query: Query = {},
): Promise<{ data: T; total: number; totalPages: number }> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const wooKey = process.env["WOOCOMMERCE_API_KEY"];
  if (!lovableKey || !wooKey) {
    throw new Error("Store connection is not configured (missing connector credentials).");
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  const url = `${GATEWAY_URL}${path}${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": wooKey,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`WooCommerce request failed [${response.status}] ${url}: ${body}`);
    throw new Error(`Store request failed [${response.status}]: ${body.slice(0, 400)}`);
  }

  const data = (await response.json()) as T;
  return {
    data,
    total: Number(response.headers.get("x-wp-total") ?? 0),
    totalPages: Number(response.headers.get("x-wp-totalpages") ?? 1),
  };
}
