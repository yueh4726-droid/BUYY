import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const dataPath = fileURLToPath(new URL("../../data/offers.json", import.meta.url));

export async function loadDemoOffers(keyword = "") {
  const file = await readFile(dataPath, "utf8");
  const payload = JSON.parse(file);
  const normalizedKeyword = keyword.trim().toLowerCase();

  const offers = payload.offers.filter((item) => {
    if (!normalizedKeyword) return true;
    return `${item.brand} ${item.model} ${item.storage}`.toLowerCase().includes(normalizedKeyword);
  });

  return {
    source: "demo-seed",
    updatedAt: payload.updatedAt,
    offers,
  };
}
