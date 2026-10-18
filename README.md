# 西餐練習簿

一個開源、可以安裝到手機的西餐與調酒學習 App。從煎雞腿、義大利麵，到醬汁、發酵麵包、熟成、經典調酒，每一個步驟都說明**怎麼做**，也說明**為什麼要這樣做**。

- **69 道料理**：星級料理（米其林餐廳常見的經典菜）、主菜、麵與飯、湯品、前菜沙拉、早午餐、醬汁、發酵、熟成醃漬、甜點
- **24 款調酒**：調酒基礎、餐前酒、經典調酒、早午餐、餐後酒、派對，每一杯都附**無酒精版本**
- 每道食譜都有真實照片、可調整份量的食材、逐步做法、**擺盤建議**、注意事項、失敗救援、保存方式
- 步驟內建**計時器**（時間到會響鈴、震動），做菜時可以開啟**螢幕常亮**
- 收藏、標記做過、寫心得，資料只存在自己的手機裡
- **購物清單**：把想做的菜加進清單，食材依份量自動合併，買到的可以打勾
- 料理和調酒互相推薦搭配
- 第一次打開後可以**離線使用**
- 不需要任何框架或建置工具，純 HTML、CSS、JavaScript

> 未滿 18 歲禁止飲酒。喝酒不開車。

## 安裝到手機

這個 App 是 PWA（漸進式網頁應用程式），放上網路後，用手機瀏覽器打開就能加到主畫面，跟一般 App 一樣使用。

### 第一步：用 GitHub Pages 免費放上網路

1. 在 GitHub 建立一個新的公開儲存庫，例如 `western-kitchen`。
2. 把這個資料夾裡的所有檔案上傳到儲存庫（可以用網頁直接拖曳上傳，或用 `git push`）。
3. 進入儲存庫的設定（Settings）→ 頁面（Pages）。
4. 來源選擇從分支部署（Deploy from a branch），分支選 `main`、資料夾選 `/ (root)`，按儲存（Save）。
5. 等 1～2 分鐘，網址會是 `https://你的帳號.github.io/western-kitchen/`。

> GitHub 的介面目前只有英文，括號裡是畫面上實際顯示的文字。

### 第二步：加到手機主畫面

**iPhone（Safari）**：打開網址 → 點下方的「分享」按鈕 → 選「加入主畫面」→ 點「新增」。

**Android（Chrome）**：打開網址 → 點右上角「⋮」選單 → 選「安裝應用程式」或「加到主畫面」。

## 在電腦上執行

因為有離線快取與資料檔，請用本機伺服器打開，不要直接雙擊 `index.html`：

```bash
cd western-kitchen
python3 -m http.server 8000
# 打開 http://localhost:8000
```

想要一個可以直接傳給朋友、雙擊就能開的單一檔案：

```bash
python3 tools/build-preview.py
# 產生 dist/western-kitchen.html
```

## 檔案結構

```
index.html              App 外殼
css/style.css           樣式（自動支援深色模式）
js/data-food-1.js       料理食譜（一）
js/data-food-2.js       料理食譜（二）
js/data-food-3.js       料理食譜（三）
js/data-food-4.js       料理食譜（四）：星級料理與更多家常菜
js/data-plating.js      擺盤建議（依食譜 id）
js/data-photos.js       照片的作者與授權
images/                 食譜照片（<id>.jpg，4:3）
js/data-drinks.js       調酒
js/data-learn.js        小教室：新手須知、吧台基礎、術語
js/art.js               插圖產生器（用程式畫出 SVG）
js/app.js               主程式
sw.js                   離線快取
manifest.webmanifest    安裝到手機用的設定
icons/                  App 圖示
images/                 放你自己拍的照片
tools/build-preview.py  合併成單一 HTML 檔
```

## 新增一道食譜

在 `js/data-food-2.js` 的 `window.FOOD.push( ... )` 裡加一筆：

```js
{id:"omurice", pic:"omelette", cat:"早午餐", name:"蛋包飯", fr:"Omurice",
 min:30, lv:2, serv:2, unit:"人份",
 col:["#F4D46A","#FBE7A0","#E9ECE6","#C2331F"],      // 插圖配色
 intro:"一句話介紹這道菜。",
 eq:["平底鍋","鍋鏟"],
 ing:["#炒飯", ["白飯",400,"g"], ["番茄醬",null,"適量"]],  // "#文字" 是分組標題；數量 null 代表不換算
 steps:[
   {t:"步驟標題", d:"怎麼做", s:180, w:"為什麼這樣做（可省略）", x:"注意事項（可省略）"},
   {t:"冷藏", d:"放冰箱", s:"4 小時"}                   // s 是數字會出現計時按鈕；是文字只顯示等待時間
 ],
 warn:["整道菜的注意事項"],
 tips:["小訣竅"],
 fix:[["失敗狀況","怎麼救"]],
 store:"保存方式",
 plate:["擺盤建議，一句一個重點"],                       // 也可以寫在 js/data-plating.js
 rel:["benedict"]}                                      // 相關食譜的 id
```

- `cat`（分類）要用 `js/app.js` 裡 `CATS` 列出的名稱，也可以在那裡新增分類。
- `lv` 難度：1 簡單、2 中等、3 進階。
- `pic` 插圖類型：`pasta` `nest` `steak` `chicken` `fillet` `fish` `soup` `gratin` `bread` `loaf` `pizza` `jar` `sauce` `cup` `tray` `lava` `ramekin` `salad` `caprese` `bruschetta` `egg` `omelette` `stack` `toast` `burger` `cutlet` `pan` `paella` `risotto` `stew` `roastpan` `confit`。

調酒寫在 `js/data-drinks.js`，另外有 `glass`（杯型：`coupe` `martini` `flute` `wine` `rocks` `highball` `toddy` `mug` `pitcher`）、`method`（調法）、`gar`（裝飾：`orange` `lime` `lemon` `peel` `olive` `cherry` `mint` `berry` `beans` `celery` `salt` `foam` `cream` `fruit`）、`ice`（`cube` `big` `crushed`）、`fizz`（有氣泡）、`mock`（無酒精版本）、`pair`（搭配料理的 id）。

## 照片

目前的照片來自 [Wikimedia Commons](https://commons.wikimedia.org/)，依各自的創用 CC 授權（CC BY、CC BY-SA、CC0 等）使用，作者、授權和原始頁面記錄在 `js/data-photos.js`，App 會顯示在每道食譜的照片下方。重新使用這些照片時，請保留作者與授權標示。沒有照片的食譜會自動改用程式畫的插圖。

想換成自己的照片：把照片存成 `images/<食譜 id>.jpg`，並在 `js/data-photos.js` 裡刪掉那一筆（就不會顯示別人的名字），或是在食譜加上 `photo:"images/檔名.jpg"`。建議尺寸 1200×900（4:3），檔案壓縮在 300 KB 以內。請使用自己拍的、或有授權可以使用的照片。

更新內容後，把 `sw.js` 裡的 `CACHE` 版本號加 1（例如 `v1` → `v2`），手機才會抓到新版本。

## 安全說明

食譜中的生蛋、生魚、發酵、熟成、油炸、酒精都有對應的注意事項，請在動手前閱讀。這個 App 是學習用的參考，不能取代專業的食品安全或醫療建議。

## 授權

程式碼、食譜內容與插圖以 [MIT 授權](LICENSE) 釋出，可以自由使用、修改、分享，請保留授權聲明。

歡迎發 Issue 或 Pull Request 分享你的食譜！
