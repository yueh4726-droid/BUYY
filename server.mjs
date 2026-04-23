import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { loadLatestOffers } from "./src/services/offer-service.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 8080);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname === "/api/offers") {
    await handleApi(response, url);
    return;
  }

  await handleStatic(response, url.pathname);
});

server.listen(port, () => {
  console.log(`手機比價站已啟動：http://localhost:${port}`);
});

async function handleApi(response, url) {
  try {
    const offers = await loadLatestOffers({
      keyword: url.searchParams.get("q") ?? "",
      limit: Number(url.searchParams.get("limit") || 100),
      onlyInStock: url.searchParams.get("stock") !== "0",
    });

    respondJson(response, 200, offers);
  } catch (error) {
    respondJson(response, 500, {
      error: "FETCH_FAILED",
      message: error instanceof Error ? error.message : "未知錯誤",
    });
  }
}

async function handleStatic(response, pathname) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const normalized = normalize(safePath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(__dirname, normalized);

  try {
    const file = await readFile(filePath);
    const contentType = mimeTypes[extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(file);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("找不到頁面");
  }
}

function respondJson(response, statusCode, data) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data, null, 2));
}
