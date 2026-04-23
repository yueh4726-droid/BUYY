export async function fetchHtml(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 12000);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 PhonePriceDashboard/1.0",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`抓取失敗：${response.status} ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export function extractFirstNumber(text) {
  const match = text.replace(/,/g, "").match(/(\d{3,8})/);
  return match ? Number(match[1]) : 0;
}

export function guessStockStatus(text) {
  const normalized = text.toLowerCase();
  if (normalized.includes("缺貨") || normalized.includes("補貨中") || normalized.includes("售完")) {
    return false;
  }

  if (normalized.includes("24h") || normalized.includes("有貨") || normalized.includes("可購買") || normalized.includes("立即出貨")) {
    return true;
  }

  return false;
}
