export const sourceConfigs = [
  {
    id: "momo",
    label: "momo",
    enabled: true,
    mode: "demo",
    searchUrl: "https://www.momoshop.com.tw/search/searchShop.jsp?keyword={keyword}",
  },
  {
    id: "pchome",
    label: "PChome 24h",
    enabled: true,
    mode: "demo",
    searchUrl: "https://ecshweb.pchome.com.tw/search/v3.3/all/results?q={keyword}&page=1&sort=sale/dc",
  },
  {
    id: "shopee",
    label: "Shopee Mall",
    enabled: true,
    mode: "demo",
    searchUrl: "https://shopee.tw/api/v4/search/search_items/?by=relevancy&keyword={keyword}&limit=20&newest=0&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2",
  },
  {
    id: "yahoo",
    label: "Yahoo Shopping",
    enabled: false,
    mode: "demo",
    searchUrl: "https://tw.buy.yahoo.com/search/product?p={keyword}",
  },
];

export const siteOptions = {
  requestTimeoutMs: 12000,
  cacheDurationMs: 10 * 60 * 1000,
  defaultKeyword: "iPhone 16 128GB",
};
