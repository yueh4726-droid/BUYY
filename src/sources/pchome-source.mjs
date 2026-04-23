import { formatTimestamp, inferStorage, normalizeOffer } from "../normalizers.mjs";

export async function searchPChomeOffers({ keyword, config, timeoutMs }) {
  if (config.mode !== "live") {
    return [];
  }

  const url = config.searchUrl.replace("{keyword}", encodeURIComponent(keyword));
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 PhonePriceDashboard/1.0",
      accept: "application/json, text/plain, */*",
    },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`PChome request failed: ${response.status}`);
  }

  const payload = await response.json();

  return parsePChomeSearchPayload(payload).map((item) =>
    normalizeOffer({
      ...item,
      platform: config.label,
      updatedAt: formatTimestamp(),
    }),
  );
}

export function parsePChomeSearchPayload(payload) {
  const rows = Array.isArray(payload?.prods) ? payload.prods : [];

  return rows.slice(0, 20).map((row) => ({
    model: row.name ?? "",
    storage: inferStorage(row.name ?? ""),
    sellerName: "PChome 24h",
    price: Number(row.price ?? 0),
    inStock: row.buttonType !== "soldout" && row.isPreOrd !== 1,
    condition: "New",
    color: "See Listing",
    shippingNote: "24h delivery",
    url: `https://24h.pchome.com.tw/prod/${row.Id}`,
  }));
}
