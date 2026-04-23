import { searchMomoOffers } from "./momo-source.mjs";
import { searchPChomeOffers } from "./pchome-source.mjs";
import { searchShopeeOffers } from "./shopee-source.mjs";

export const sourceHandlers = {
  momo: searchMomoOffers,
  pchome: searchPChomeOffers,
  shopee: searchShopeeOffers,
  yahoo: async () => [],
};
