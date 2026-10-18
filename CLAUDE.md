# 西餐練習簿

開源的西餐料理與調酒學習 PWA。純 HTML／CSS／JavaScript，沒有框架、沒有建置步驟。

## 專案重點
- 介面文字、食譜內容一律使用繁體中文（台灣用語）。
- 食譜資料：`js/data-food-1.js`、`js/data-food-2.js`（`window.FOOD`），調酒：`js/data-drinks.js`（`window.DRINK`），小教室：`js/data-learn.js`。資料欄位說明見 README「新增一道食譜」。
- 分類清單在 `js/app.js` 的 `CATS`；新增分類要同步改這裡。
- 插圖由 `js/art.js` 依 `pic`／`glass` 與 `col` 配色畫成 SVG；食譜加 `photo:"images/xxx.jpg"` 會改用照片。
- 使用者狀態（做過、收藏、心得、份量）存在 localStorage 的 `wk-state`。
- 顏色都寫成 CSS 變數，深色模式在 `css/style.css` 的兩個 dark 區塊。

## 常用指令
- 本機預覽：`python -m http.server 8000`，打開 http://localhost:8000
- 產生單一 HTML 檔：`python tools/build-preview.py` → `dist/western-kitchen.html`
- 語法檢查：`node --check js/app.js`

## 修改時注意
- 改了任何檔案要發布時，把 `sw.js` 的 `CACHE` 版本號加 1，手機才會更新。
- 新增 JS 檔要同時加到 `index.html` 的 SCRIPTS 區塊和 `sw.js` 的 `FILES`。
- 生蛋、生魚、發酵、熟成、油炸、酒精相關的食譜，必須保留或補上安全注意事項；調酒要附無酒精版本。
