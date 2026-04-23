import { formatTimestamp, inferStorage, normalizeOffer } from "../normalizers.mjs";
import { fetchHtml } from "./http-source.mjs";

export async function searchMomoOffers({ keyword, config, timeoutMs }) {
  if (config.mode !== "live") {
    return [];
  }

  const url = config.searchUrl.replace("{keyword}", encodeURIComponent(keyword));
  const html = await fetchHtml(url, { timeoutMs });

  return parseMomoSearchHtml(html).map((item) =>
    normalizeOffer({
      ...item,
      platform: config.label,
      updatedAt: formatTimestamp(),
    }),
  );
}

export function parseMomoSearchHtml(html) {
  const offers = [];
  const productBlocks = html.match(/<li[^>]*class="[^"]*goodsItemLi[^"]*"[\s\S]*?<\/li>/g) ?? [];

  for (const block of productBlocks.slice(0, 20)) {
    const name = pickText(block, [
      /title="([^"]+)"/,
      /<p[^>]*class="prdName"[^>]*>([\s\S]*?)<\/p>/,
    ]);
    const url = pickText(block, [/href="([^"]+)"/]);
    const priceText = pickText(block, [
      /<b>([\d,]+)<\/b>/,
      /class="price"[^>]*>[\s\S]*?([\d,]+)[\s\S]*?<\/span>/,
    ]);

    if (!name || !url || !priceText) {
      continue;
    }

    const soldOut = /售完|補貨中|缺貨/.test(block);
    offers.push({
      model: cleanText(name),
      storage: inferStorage(name),
      sellerName: "momo direct or partner",
      price: Number(priceText.replace(/,/g, "")),
      inStock: !soldOut,
      condition: "New",
      color: "See Listing",
      shippingNote: /24h/.test(block) ? "24h delivery" : "See Listing",
      url: normalizeUrl(url, "https://www.momoshop.com.tw"),
    });
  }

  return offers;
}

function pickText(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return decodeHtml(match[1]).trim();
    }
  }

  return "";
}

function cleanText(value) {
  return decodeHtml(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeUrl(url, baseUrl) {
  if (!url) return "#";
  return url.startsWith("http") ? url : `${baseUrl}${url}`;
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}
