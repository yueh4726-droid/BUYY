const genericHomepages = new Set([
  "https://www.momoshop.com.tw/",
  "https://24h.pchome.com.tw/",
  "https://shopee.tw/",
  "https://tw.buy.yahoo.com/",
]);

export function enrichOfferLink(rawOffer) {
  const offer = { ...rawOffer };
  const query = buildQuery(offer);
  const normalizedUrl = normalizeUrl(offer.url);

  if (!normalizedUrl || genericHomepages.has(normalizedUrl)) {
    offer.url = buildSearchUrl(offer.platform, query);
    offer.urlType = "search";
    return offer;
  }

  offer.url = normalizedUrl;
  offer.urlType = "product";
  return offer;
}

export function buildSearchUrl(platform, query) {
  const encoded = encodeURIComponent(query.trim());
  const name = (platform || "").toLowerCase();

  if (name.includes("momo")) {
    return `https://www.momoshop.com.tw/search/searchShop.jsp?keyword=${encoded}`;
  }

  if (name.includes("pchome")) {
    return `https://24h.pchome.com.tw/search/?q=${encoded}`;
  }

  if (name.includes("shopee")) {
    return `https://shopee.tw/search?keyword=${encoded}`;
  }

  if (name.includes("yahoo")) {
    return `https://tw.buy.yahoo.com/search/product?p=${encoded}`;
  }

  return "#";
}

export function buildQuery(offer) {
  return [offer.brand, offer.model, offer.storage].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function normalizeUrl(url) {
  if (!url || typeof url !== "string") {
    return "";
  }

  return url.trim();
}
