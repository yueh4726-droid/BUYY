export function normalizeOffer(rawOffer) {
  return {
    brand: rawOffer.brand ?? inferBrand(rawOffer.model ?? ""),
    model: rawOffer.model ?? "",
    storage: rawOffer.storage ?? inferStorage(rawOffer.model ?? ""),
    platform: rawOffer.platform ?? "Unknown Platform",
    sellerName: rawOffer.sellerName ?? "Unknown Seller",
    price: Number(rawOffer.price ?? 0),
    inStock: Boolean(rawOffer.inStock),
    condition: rawOffer.condition ?? "New",
    color: rawOffer.color ?? "See Listing",
    shippingNote: rawOffer.shippingNote ?? "See Listing",
    updatedAt: rawOffer.updatedAt ?? formatTimestamp(),
    url: rawOffer.url ?? "#",
  };
}

export function sortOffers(offers) {
  return [...offers].sort((a, b) => a.price - b.price || a.platform.localeCompare(b.platform, "en"));
}

export function filterInvalidOffers(offers) {
  return offers.filter((offer) => offer.price > 0 && offer.url && offer.url !== "#");
}

export function formatTimestamp(date = new Date()) {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date).replace(/\//g, "-");
}

export function inferBrand(model) {
  const text = model.toLowerCase();
  if (text.includes("iphone")) return "Apple";
  if (text.includes("galaxy")) return "Samsung";
  if (text.includes("pixel")) return "Google";
  if (text.includes("xiaomi")) return "Xiaomi";
  if (text.includes("oppo")) return "OPPO";
  if (text.includes("vivo")) return "vivo";
  return "Other";
}

export function inferStorage(model) {
  const match = model.match(/(128|256|512|1024)\s?g(b)?/i);
  return match ? `${match[1]}GB` : "Unknown";
}
