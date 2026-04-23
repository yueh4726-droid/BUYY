const state = {
  offers: [],
  filters: {
    brand: "all",
    search: "",
    storage: "all",
    platform: "all",
    inStockOnly: true,
  },
  meta: {
    source: "loading",
    updatedAt: "",
  },
};

const brandFilter = document.querySelector("#brandFilter");
const searchFilter = document.querySelector("#searchFilter");
const storageFilter = document.querySelector("#storageFilter");
const platformFilter = document.querySelector("#platformFilter");
const stockFilter = document.querySelector("#stockFilter");
const resetButton = document.querySelector("#resetButton");
const offerCount = document.querySelector("#offerCount");
const resultSummary = document.querySelector("#resultSummary");
const topFiveList = document.querySelector("#topFiveList");
const allResultsList = document.querySelector("#allResultsList");
const topCardTemplate = document.querySelector("#topCardTemplate");
const rowTemplate = document.querySelector("#rowTemplate");

async function bootstrap() {
  const payload = await loadOffers();
  state.offers = payload.offers ?? [];
  state.meta.source = payload.source ?? "unknown";
  state.meta.updatedAt = payload.updatedAt ?? "";

  offerCount.textContent = state.offers.filter((item) => item.inStock).length.toLocaleString("zh-TW");

  hydrateFilterOptions();
  bindEvents();
  render();
}

async function loadOffers() {
  const candidates = ["/api/offers", "./data/offers.json"];

  for (const url of candidates) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        continue;
      }

      return await response.json();
    } catch (error) {
      console.warn(`Failed to load ${url}`, error);
    }
  }

  throw new Error("No offer source available");
}

function hydrateFilterOptions() {
  setOptions(brandFilter, collectUnique("brand"), "全部品牌");
  setOptions(storageFilter, collectUnique("storage"), "全部容量");
  setOptions(platformFilter, collectUnique("platform"), "全部平台");
}

function setOptions(element, values, allLabel) {
  element.innerHTML = "";
  const options = [{ value: "all", label: allLabel }, ...values.map((value) => ({ value, label: value }))];

  options.forEach((option) => {
    const node = document.createElement("option");
    node.value = option.value;
    node.textContent = option.label;
    element.appendChild(node);
  });
}

function collectUnique(key) {
  return [...new Set(state.offers.map((item) => item[key]).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "zh-Hant"));
}

function bindEvents() {
  brandFilter.addEventListener("change", (event) => updateFilter("brand", event.target.value));
  searchFilter.addEventListener("input", (event) => updateFilter("search", event.target.value.trim()));
  storageFilter.addEventListener("change", (event) => updateFilter("storage", event.target.value));
  platformFilter.addEventListener("change", (event) => updateFilter("platform", event.target.value));
  stockFilter.addEventListener("change", (event) => updateFilter("inStockOnly", event.target.checked));

  resetButton.addEventListener("click", () => {
    state.filters = {
      brand: "all",
      search: "",
      storage: "all",
      platform: "all",
      inStockOnly: true,
    };

    brandFilter.value = "all";
    searchFilter.value = "";
    storageFilter.value = "all";
    platformFilter.value = "all";
    stockFilter.checked = true;

    render();
  });
}

function updateFilter(key, value) {
  state.filters[key] = value;
  render();
}

function render() {
  const filtered = getFilteredOffers();
  const topFive = filtered.slice(0, 5);
  const sourceLabel = state.meta.source === "live-api" ? "即時資料" : "示範資料";
  const updatedLabel = state.meta.updatedAt ? `，最後更新 ${state.meta.updatedAt}` : "";

  resultSummary.textContent = `共找到 ${filtered.length} 筆符合條件的報價，依價格由低到高排序。資料來源：${sourceLabel}${updatedLabel}`;
  renderTopCards(topFive);
  renderAllResults(filtered);
}

function getFilteredOffers() {
  const { brand, search, storage, platform, inStockOnly } = state.filters;
  const normalizedSearch = search.toLowerCase();

  return state.offers
    .filter((offer) => (brand === "all" ? true : offer.brand === brand))
    .filter((offer) => (storage === "all" ? true : offer.storage === storage))
    .filter((offer) => (platform === "all" ? true : offer.platform === platform))
    .filter((offer) => (inStockOnly ? offer.inStock : true))
    .filter((offer) => {
      if (!normalizedSearch) return true;
      const target = `${offer.brand} ${offer.model} ${offer.storage}`.toLowerCase();
      return target.includes(normalizedSearch);
    })
    .sort((a, b) => a.price - b.price || a.platform.localeCompare(b.platform, "zh-Hant"));
}

function renderTopCards(items) {
  topFiveList.innerHTML = "";

  if (!items.length) {
    topFiveList.appendChild(createEmptyState("目前沒有符合條件的前 5 名結果，請放寬篩選條件。"));
    return;
  }

  items.forEach((item, index) => {
    const fragment = topCardTemplate.content.cloneNode(true);
    fragment.querySelector(".platform").textContent = `#${index + 1} ${item.platform}`;
    fragment.querySelector(".title").textContent = `${item.brand} ${item.model} ${item.storage}`;
    fragment.querySelector(".price").textContent = formatPrice(item.price);
    fragment.querySelector(".card-meta").textContent =
      `${item.condition}｜${item.color}｜${item.sellerName}｜${item.shippingNote}`;
    fragment.querySelector(".updated-at").textContent =
      `${item.urlType === "product" ? "商品頁" : "搜尋結果"}｜更新時間：${item.updatedAt}`;

    const button = fragment.querySelector(".link-button");
    button.href = item.url;
    button.textContent = item.urlType === "product" ? "前往商品頁" : "前往搜尋結果";
    button.setAttribute("aria-label", `${item.platform} 連結`);

    topFiveList.appendChild(fragment);
  });
}

function renderAllResults(items) {
  allResultsList.innerHTML = "";

  if (!items.length) {
    allResultsList.appendChild(createEmptyState("沒有符合條件的資料。"));
    return;
  }

  items.forEach((item) => {
    const fragment = rowTemplate.content.cloneNode(true);
    fragment.querySelector(".row-title").textContent = `${item.brand} ${item.model} ${item.storage}`;
    fragment.querySelector(".row-meta").textContent =
      `${item.platform}｜${item.condition}｜${item.color}｜${item.sellerName}｜${item.inStock ? "有貨" : "缺貨"}｜${item.urlType === "product" ? "商品頁" : "搜尋結果"}｜更新 ${item.updatedAt}`;
    fragment.querySelector(".row-price").textContent = formatPrice(item.price);

    const link = fragment.querySelector(".row-link");
    link.href = item.url;
    link.textContent = item.urlType === "product" ? "商品頁" : "搜尋";

    allResultsList.appendChild(fragment);
  });
}

function createEmptyState(message) {
  const node = document.createElement("div");
  node.className = "empty-state";
  node.textContent = message;
  return node;
}

function formatPrice(price) {
  return new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0,
  }).format(price);
}

bootstrap().catch((error) => {
  console.error(error);
  resultSummary.textContent = "資料載入失敗，請先啟動後端伺服器或重新整理頁面。";
  topFiveList.appendChild(createEmptyState("目前無法讀取資料，請確認 API 或本機資料是否正常。"));
});
