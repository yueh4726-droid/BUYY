import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { loadLatestOffers } from "../src/services/offer-service.mjs";

const outputPath = fileURLToPath(new URL("../data/offers-live.json", import.meta.url));

const payload = await loadLatestOffers({
  keyword: "",
  limit: 200,
  onlyInStock: false,
});

await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`已輸出最新報價：${outputPath}`);
