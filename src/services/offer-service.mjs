import { sourceConfigs, siteOptions } from "../config.mjs";
import { enrichOfferLink } from "../link-utils.mjs";
import { filterInvalidOffers, formatTimestamp, normalizeOffer, sortOffers } from "../normalizers.mjs";
import { loadDemoOffers } from "../sources/demo-source.mjs";
import { sourceHandlers } from "../sources/registry.mjs";

let cache = {
  expiresAt: 0,
  keyword: "",
  payload: null,
};

export async function loadLatestOffers({ keyword, limit = 100, onlyInStock = true }) {
  const normalizedKeyword = keyword.trim() || siteOptions.defaultKeyword;

  if (cache.payload && cache.keyword === normalizedKeyword && Date.now() < cache.expiresAt) {
    return buildResponse(cache.payload, limit, onlyInStock);
  }

  const liveOffers = await collectLiveOffers(normalizedKeyword);

  const payload = liveOffers.length > 0
    ? {
        source: "live-api",
        updatedAt: formatTimestamp(),
        offers: sortOffers(filterInvalidOffers(liveOffers)).map(normalizeOffer).map(enrichOfferLink),
      }
    : await loadDemoOffers(normalizedKeyword);

  cache = {
    keyword: normalizedKeyword,
    expiresAt: Date.now() + siteOptions.cacheDurationMs,
    payload,
  };

  return buildResponse(cache.payload, limit, onlyInStock);
}

async function collectLiveOffers(keyword) {
  const enabledSources = sourceConfigs.filter((source) => source.enabled);
  const results = await Promise.all(
    enabledSources.map(async (source) => {
      const handler = sourceHandlers[source.id];
      if (!handler) {
        return [];
      }

      try {
        return await handler({
          keyword,
          config: source,
          timeoutMs: siteOptions.requestTimeoutMs,
        });
      } catch (error) {
        console.warn(`[${source.id}] 抓價失敗`, error);
        return [];
      }
    }),
  );

  return results.flat();
}

function buildResponse(payload, limit, onlyInStock) {
  const offers = payload.offers
    .filter((item) => (onlyInStock ? item.inStock : true))
    .slice(0, Math.max(limit, 1));

  return {
    source: payload.source,
    updatedAt: payload.updatedAt,
    offers,
  };
}
