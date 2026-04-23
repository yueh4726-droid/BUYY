# 手機新機比價網站

這個專案現在已經從純前端展示版，升級成「前台 + 後端 API + 平台抓價模組」的雛形。

## 已完成的內容

- 大字、高對比、適合現場快速操作的比價頁
- API 端點：`/api/offers`
- Node.js 原生 HTTP 伺服器，不依賴外部套件
- 平台來源模組化設計
- 統一資料格式與排序規則
- 快取機制，避免每次重新整理都重抓
- 無法抓到即時資料時，自動回退到示範資料

## 專案結構

- `index.html`：畫面結構
- `styles.css`：介面樣式
- `app.js`：前台邏輯，優先讀取 API
- `server.mjs`：本機後端與靜態檔案伺服器
- `src/config.mjs`：平台設定
- `src/services/offer-service.mjs`：整合抓價、快取、回傳結果
- `src/sources/`：各平台抓價模組
- `scripts/refresh-offers.mjs`：把最新報價輸出成 JSON

## 如何啟動

你需要可用的 Node.js 環境。

```powershell
npm start
```

啟動後打開：

```text
http://localhost:8080
```

## API 用法

```text
GET /api/offers
GET /api/offers?q=iPhone%2016%20128GB
GET /api/offers?q=Galaxy%20S25&limit=50
GET /api/offers?q=Pixel&stock=0
```

## 目前真實抓價狀態

目前我已經先把真實版架構寫好，但預設仍使用 `demo` 模式。

你可以在 `src/config.mjs` 把平台的：

- `mode: "demo"`

改成：

- `mode: "live"`

目前已先寫入基本抓取程式的來源：

- `momo`
- `PChome 24h`

其餘來源目前先保留接口：

- `Yahoo購物中心`
- `蝦皮商城`

## 為什麼還沒直接保證可抓到真實資料

因為不同平台的頁面結構、反爬限制、動態載入方式與使用條款都不同，而且我這裡目前無法實際連線測試與執行 Node 環境，所以這一版是「可延伸的真實抓價後端骨架」。

也就是說：

- 架構已經能接即時資料
- 模組已經拆好
- API 已經做好
- 但正式上線前，還需要針對每個平台做實測與微調 selector / parser

## 建議下一步

最務實的正式化順序是：

1. 先鎖定 2 到 3 個最重要平台
2. 每個平台各自做實測與 parser 校正
3. 加入資料庫保存歷史價格
4. 增加型號正規化，例如 iPhone 16 128G / 128GB 視為同一機型
5. 加入後台排程，每 10 到 30 分鐘更新一次

## 真正商用時建議補強

- 資料庫：PostgreSQL / Supabase
- 後台排程：GitHub Actions / cron / 雲端排程
- 部署：Vercel + API 伺服器
- 防呆：缺貨判斷、福利品過濾、拆封機排除、商家白名單
