import { formatTimestamp, inferStorage, normalizeOffer } from "../normalizers.mjs";

export async function searchShopeeOffers({ keyword, config, timeoutMs }) {
  if (config.mode !== "live") {
    return [];
  }

  const url = config.searchUrl.replace("{keyword}", encodeURIComponent(keyword));
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 PhonePriceDashboard/1.0",
      accept: "application/json, text/plain, */*",
      referer: "https://shopee.tw/",
    },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Shopee request failed: ${response.status}`);
  }

  const payload = await response.json();

  return parseShopeeSearchPayload(payload).map((item) =>
    normalizeOffer({
      ...item,
      platform: config.label,
      updatedAt: formatTimestamp(),
    }),
  );
}

export function parseShopeeSearchPayload(payload) {
  const rows = Array.isArray(payload?.items) ? payload.items : [];

  return rows
    .slice(0, 20)
    .map((row) => row?.item_basic ?? row)
    .filter(Boolean)
    .map((item) => {
      const model = item.name ?? "";
      const rawPrice = Number(item.price_min ?? item.price ?? 0);
      const stock = Number(item.stock ?? 0);
      const sellerName = item.shop_name || (item.is_official_shop ? "Shopee official seller" : "Shopee seller");

      return {
        model,
        storage: inferStorage(model),
        sellerName,
        price: normalizeShopeePrice(rawPrice),
        inStock: stock > 0 && item.item_status !== "sold_out",
        condition: "New",
        color: "See Listing",
        shippingNote: item.is_mart ? "Shopee fast delivery" : "See Listing",
        url: `https://shopee.tw/product/${item.shopid}/${item.itemid}`,
      };
    });
}

function normalizeShopeePrice(value) {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  return value >= 100000 ? Math.round(value / 100000) : Math.round(value);
}
