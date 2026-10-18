/* 西餐練習簿 — 主程式 */
(function(){
const PH=window.PHOTOS||{},PL=window.PLATE||{};
const prep=(r,kind)=>Object.assign(r,{kind,photo:r.photo||(PH[r.id]?`images/${r.id}.jpg`:null),plate:r.plate||PL[r.id]||null});
const FOOD=window.FOOD.map(r=>prep(r,"food"));
const DRINK=window.DRINK.map(r=>prep(r,"drink"));
const ALL=[...FOOD,...DRINK];const L=window.LEARN;
const CATS={food:["星級料理","主菜","麵與飯","湯品","前菜沙拉","早午餐","醬汁","發酵","熟成醃漬","甜點"],drink:["調酒基礎","餐前酒","經典調酒","早午餐","餐後酒","派對"]};
const LV={1:"簡單",2:"中等",3:"進階"};
const GLASS={coupe:"淺碟杯",martini:"馬丁尼杯",flute:"香檳杯",wine:"葡萄酒杯",rocks:"古典杯",highball:"高球杯",toddy:"耐熱玻璃杯",mug:"銅杯",pitcher:"大水壺",jar:"玻璃瓶"};
const DRINK_WARN=["未滿 18 歲禁止飲酒。","喝酒不開車、不騎車。","孕婦、正在服藥的人不建議飲酒。"];

let S={done:{},notes:{},serv:{},fav:{},shop:{},got:{},tab:"food",cat:{food:"全部",drink:"全部"},q:""};
try{const s=JSON.parse(localStorage.getItem("wk-state")||"null");if(s)S=Object.assign(S,s,{q:""});
  else{const o=JSON.parse(localStorage.getItem("wc2")||"null");if(o){S.done=o.done||{};S.notes=o.notes||{}}}}catch(e){}
const save=()=>{try{localStorage.setItem("wk-state",JSON.stringify(S))}catch(e){}};
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
const fmtMin=s=>s>=3600?`${Math.floor(s/3600)} 小時${s%3600?` ${Math.round(s%3600/60)} 分`:""}`:s>=60?(s%60?`${Math.floor(s/60)} 分 ${s%60} 秒`:`${s/60} 分鐘`):`${s} 秒`;
const timeOf=r=>r.time||`${r.min} 分鐘`;
const lvl=n=>`<span class="lvl" aria-label="${LV[n]}">${[1,2,3].map(i=>`<i class="${i<=n?"on":""}"></i>`).join("")}</span>`;
const pic=r=>`<span class="pic">${r.photo?`<img src="${esc(r.photo)}" alt="${esc(r.name)}" loading="lazy">`:window.ART(r)}</span>`;
const byId=id=>ALL.find(r=>r.id===id);
function updCount(){$("#pcount").textContent=ALL.filter(r=>S.done[r.id]).length}

function card(r){return `<button type="button" class="card" data-go="${r.id}">${pic(r)}
  ${S.fav[r.id]?'<span class="fav-mark" aria-label="已收藏">★</span>':""}${S.done[r.id]?'<span class="badge">✓ 做過</span>':""}
  <span class="body"><span class="tag">${r.cat}</span><h3>${esc(r.name)}</h3><span class="fr">${esc(r.fr)}</span>
  <span class="row"><span>${esc(timeOf(r))}</span>${lvl(r.lv)}${r.kind==="drink"&&r.alc===false?"<span>無酒精</span>":""}</span></span></button>`}

function listView(kind){
  const src=kind==="food"?FOOD:DRINK,cat=S.cat[kind];
  const q=S.q.trim().toLowerCase();
  const list=src.filter(r=>(cat==="全部"||r.cat===cat)&&(!q||(r.name+r.fr+r.intro+r.cat).toLowerCase().includes(q)));
  $("#view").innerHTML=`
  <section class="hero">
    <h1>${kind==="food"?"從一顆洋蔥開始的西餐廚房":"餐桌旁的吧台"}</h1>
    <p>${kind==="food"?`${FOOD.length} 道料理食譜：星級餐廳的經典菜、主菜、義大利麵、湯、醬汁、發酵麵包與熟成，還有擺盤建議。每一步都說明怎麼做，也說明為什麼。`:`${DRINK.length} 款西餐中常見的調酒：開胃的、經典的、早午餐的、餐後的。每一杯都附有無酒精版本和推薦搭配的料理。`}</p>
    ${kind==="drink"?`<div class="notice"><b>飲酒提醒</b>　未滿 18 歲禁止飲酒，喝酒不開車。每款調酒都有「無酒精版本」，大家都能做。</div>`:""}
    <div class="search"><input id="q" type="search" placeholder="${kind==="food"?"搜尋料理，例如：醬汁、牛排、麵包":"搜尋調酒，例如：琴酒、檸檬、氣泡"}" value="${esc(S.q)}" aria-label="搜尋"></div>
  </section>
  <div class="cats" role="group" aria-label="分類">${["全部",...CATS[kind]].map(c=>`<button type="button" class="cat" data-cat="${c}" aria-pressed="${cat===c}">${c}<span>${c==="全部"?src.length:src.filter(r=>r.cat===c).length}</span></button>`).join("")}</div>
  <div class="grid">${list.length?list.map(card).join(""):`<div class="empty">找不到符合的${kind==="food"?"料理":"調酒"}，換個關鍵字試試看。</div>`}</div>`;
  const qi=$("#q");qi.addEventListener("input",()=>{S.q=qi.value;const p=qi.selectionStart;listView(kind);const n=$("#q");n.focus();n.setSelectionRange(p,p)});
}
function favView(){
  const list=ALL.filter(r=>S.fav[r.id]);const done=ALL.filter(r=>S.done[r.id]&&!S.fav[r.id]);
  $("#view").innerHTML=`<section class="hero"><h1>我的收藏</h1><p>在食譜頁按「收藏」，就會出現在這裡。做過的菜和寫下的心得也會記錄在這台裝置上。</p></section>
  <div class="grid">${list.length?list.map(card).join(""):`<div class="empty">還沒有收藏任何食譜。</div>`}</div>
  ${done.length?`<h2 class="sec" style="margin-top:28px">做過的</h2><div class="grid">${done.map(card).join("")}</div>`:""}`;
}
/* 購物清單：S.shop 記錄 {食譜 id: 份量}，S.got 記錄已買到的項目 */
const num=v=>v>=10?Math.round(v):Math.round(v*10)/10;
function shopItems(){
  const m=new Map();
  Object.keys(S.shop).forEach(id=>{const r=byId(id);if(!r)return;const k=S.shop[id]/r.serv;
    r.ing.forEach(i=>{if(typeof i==="string")return;const key=i[0]+"|"+(i[1]==null?"":i[2]);
      const o=m.get(key)||{key,n:i[0],u:i[2],v:i[1]==null?null:0,from:[]};
      if(i[1]!=null)o.v+=i[1]*k;if(!o.from.includes(r.name))o.from.push(r.name);m.set(key,o)})});
  return [...m.values()];
}
const shopAmt=i=>i.v==null?i.u:`${num(i.v)} ${i.u}`;
function pruneGot(){const keys=new Set(shopItems().map(i=>i.key));Object.keys(S.got).forEach(k=>{if(!keys.has(k))delete S.got[k]})}
function shopView(){
  const rs=Object.keys(S.shop).map(byId).filter(Boolean),items=shopItems(),left=items.filter(i=>!S.got[i.key]).length;
  $("#view").innerHTML=`<section class="hero"><h1>購物清單</h1><p>在食譜頁按「加入購物清單」，食材會依照你設定的份量合併在這裡。買到的打勾，下次打開還會記得。</p></section>
  ${rs.length?`<div class="shop">
    <div class="box"><h2 class="sec">要做的菜</h2><ul class="shop-r">${rs.map(r=>`<li><button type="button" class="lnk" data-go="${r.id}">${esc(r.name)}</button><span>${S.shop[r.id]} ${esc(r.unit)}</span><button type="button" class="x" data-unshop="${r.id}" aria-label="從清單移除${esc(r.name)}">×</button></li>`).join("")}</ul></div>
    <div class="box"><h2 class="sec">要買的東西 <small>${left?`還有 ${left} 項`:"都買齊了！"}</small></h2>
      <ul class="ing">${items.map(i=>`<li><label><input type="checkbox" data-got="${esc(i.key)}"${S.got[i.key]?" checked":""}><span class="n">${esc(i.n)}${i.from.length>1?`<small class="from">${esc(i.from.join("、"))}</small>`:""}</span><span class="a">${esc(shopAmt(i))}</span></label></li>`).join("")}</ul>
      <div class="actions"><button type="button" class="act" id="shopcopy">複製清單</button><button type="button" class="act" id="shopclear">全部清空</button></div>
    </div></div>`:`<div class="empty">清單是空的。打開一道食譜，按「加入購物清單」就會出現在這裡。</div>`}`;
}
async function copyShop(b){
  const t=shopItems().filter(i=>!S.got[i.key]).map(i=>`□ ${i.n}　${shopAmt(i)}`).join("\n");
  try{if(navigator.share&&matchMedia("(pointer:coarse)").matches)await navigator.share({title:"購物清單",text:t});else{await navigator.clipboard.writeText(t);b.textContent="已複製"}}
  catch(e){if(e.name!=="AbortError")b.textContent="無法複製"}
}
function learnView(){
  $("#view").innerHTML=`<div class="learn">
  <section><h2>廚房新手須知</h2><div class="bgrid">${L.cook.map(b=>`<div><h3>${b[0]}</h3><p>${b[1]}</p></div>`).join("")}</div></section>
  <section><h2>量匙換算</h2><div class="measure">${L.measure.map(m=>`<span>${m}</span>`).join("")}</div></section>
  <section><h2>吧台基礎</h2><div class="bgrid">${L.bar.map(b=>`<div><h3>${b[0]}</h3><p>${b[1]}</p></div>`).join("")}</div></section>
  <section><h2>術語小抄</h2><dl class="gloss">${L.gloss.map(g=>`<div><dt>${g[0]}<span>${g[1]}</span></dt><dd>${g[2]}</dd></div>`).join("")}</dl></section>
  <section class="about"><h2>關於這個 App</h2><p>西餐練習簿是開源專案，食譜、插圖與程式碼都可以自由使用與修改（MIT 授權）。</p><p>進度、收藏和心得只存在你這台裝置的瀏覽器裡，不會上傳到任何地方。</p><p>食譜照片來自 Wikimedia Commons，依各自的創用 CC 授權使用（已裁切並縮小），作者與授權標示在每道食譜的照片下方，點作者名字可以看到原始照片。照片僅供參考，實際成品會依做法和擺盤而不同。</p></section>
  </div>`;
}
function amt(i,r){if(i[1]==null)return i[2];const k=(S.serv[r.id]||r.serv)/r.serv;let v=i[1]*k;v=v>=10?Math.round(v):Math.round(v*10)/10;return `${v} ${i[2]}`}
function detail(r){
  const sv=S.serv[r.id]||r.serv,done=!!S.done[r.id],fav=!!S.fav[r.id],isD=r.kind==="drink";
  const pairs=isD?(r.pair||[]).map(byId).filter(Boolean):DRINK.filter(d=>(d.pair||[]).includes(r.id));
  const rel=(r.rel||[]).map(byId).filter(Boolean);
  const facts=isD?[["杯型",GLASS[r.glass]||"—"],["調法",r.method],["酒精濃度",r.alc===false?"無":(r.abv||"—")],["時間",timeOf(r)]]
    :[["總時間",timeOf(r)],["難度",LV[r.lv]],["份量",`${r.serv} ${r.unit}`],["步驟",`${r.steps.length} 步`]];
  const warn=isD&&r.alc!==false?[...DRINK_WARN,...r.warn]:r.warn;
  $("#view").innerHTML=`
  <button type="button" class="back" data-back="1">← 回到${isD?"調酒":"料理"}</button>
  <section class="rhead"><figure class="hero-pic">${pic(r)}${PH[r.id]&&r.photo===`images/${r.id}.jpg`?`<figcaption>照片：<a href="${esc(PH[r.id].page)}" target="_blank" rel="noopener">${esc(PH[r.id].by)}</a>，${esc(PH[r.id].lic)}，Wikimedia Commons</figcaption>`:""}</figure>
    <div><span class="tag">${r.cat}</span><h1>${esc(r.name)}</h1><div class="fr">${esc(r.fr)}</div>
      <p class="intro">${esc(r.intro)}</p>
      <div class="facts">${facts.map(f=>`<div><small>${f[0]}</small><b>${esc(f[1])}</b></div>`).join("")}</div>
      <div class="actions"><button type="button" class="act" id="favbtn" aria-pressed="${fav}">${fav?"★ 已收藏":"☆ 收藏"}</button>
        <button type="button" class="act" id="wakebtn" aria-pressed="${!!wake}">${wake?"螢幕保持亮著":"做菜時螢幕常亮"}</button></div>
    </div>
  </section>
  <div class="rbody">
    <aside class="side">
      <div class="box"><h2 class="sec">${isD?"材料":"食材"}</h2>
        <div class="servings">份量 <button type="button" data-sv="-1" aria-label="減少份量">−</button><b>${sv}</b><button type="button" data-sv="1" aria-label="增加份量">＋</button>${esc(r.unit)}</div>
        <button type="button" class="act shopbtn" id="shopbtn" aria-pressed="${!!S.shop[r.id]}">${S.shop[r.id]?"✓ 已在購物清單":"＋ 加入購物清單"}</button>
        <ul class="ing">${r.ing.map((i,k)=>typeof i==="string"?`<li class="g">${esc(i.slice(1))}</li>`:
          `<li><label><input type="checkbox" id="i-${r.id}-${k}"><span class="n">${esc(i[0])}</span><span class="a">${esc(amt(i,r))}</span></label></li>`).join("")}</ul>
      </div>
      <div class="box"><h2 class="sec">需要的工具</h2><ul class="eq">${r.eq.map(e=>`<li>${esc(e)}</li>`).join("")}</ul></div>
    </aside>
    <div class="main">
      <section><h2 class="sec">做法</h2><p style="margin:-6px 0 8px;color:var(--muted);font-size:13px">點號碼可以標記完成；有「計時」按鈕的步驟可以直接倒數。</p>
      <ol class="steps">${r.steps.map((s,k)=>`<li id="s${k}"><button type="button" class="num" data-ok="${k}" aria-label="標記第 ${k+1} 步完成">${k+1}</button>
        <div class="st"><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p>
        ${s.w?`<div class="why"><b>為什麼？</b> ${esc(s.w)}</div>`:""}
        ${s.x?`<div class="wn"><b>注意：</b>${esc(s.x)}</div>`:""}
        ${s.s?`<div class="row">${typeof s.s==="number"?`<button type="button" class="tbtn" data-tm="${s.s}" data-lb="${esc(r.name)}・${esc(s.t)}">計時 ${fmtMin(s.s)}</button>`:`<span class="wait">等待 ${esc(s.s)}</span>`}</div>`:""}
        </div></li>`).join("")}</ol></section>
      ${r.plate?`<section class="plating"><h2 class="sec">擺盤建議</h2><ol>${r.plate.map(p=>`<li>${esc(p)}</li>`).join("")}</ol></section>`:""}
      ${isD&&r.mock?`<section class="mock"><h2 class="sec">無酒精版本：${esc(r.mock.name)}</h2><p><b>材料：</b>${esc(r.mock.ing)}</p><p>${esc(r.mock.d)}</p></section>`:""}
      <section class="alert"><h2 class="sec">注意事項</h2><ul>${warn.map(w=>`<li>${esc(w)}</li>`).join("")}</ul></section>
      ${r.tips?`<section class="tips"><h2 class="sec">小訣竅</h2><ul>${r.tips.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></section>`:""}
      ${r.fix&&r.fix.length?`<section><h2 class="sec">失敗了怎麼辦？</h2><div class="fix">${r.fix.map(f=>`<details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join("")}</div></section>`:""}
      ${r.store?`<section class="store"><h2 class="sec">保存方式</h2><p>${esc(r.store)}</p></section>`:""}
      ${pairs.length?`<section><h2 class="sec">${isD?"適合搭配的料理":"適合搭配的飲品"}</h2><div class="related">${pairs.map(x=>`<button type="button" data-go="${x.id}">${pic(x)}<span><small>${x.cat}</small>${esc(x.name)}</span></button>`).join("")}</div></section>`:""}
      ${rel.length?`<section><h2 class="sec">接著練習</h2><div class="related">${rel.map(x=>`<button type="button" data-go="${x.id}">${pic(x)}<span><small>${x.cat}</small>${esc(x.name)}</span></button>`).join("")}</div></section>`:""}
      <section class="made">
        <button type="button" class="big ${done?"on":""}" id="donebtn">${done?"✓ 做過了":"我做完這道了"}</button>
        <label class="note" for="note-${r.id}">我的心得（例如：下次火再小一點）<textarea id="note-${r.id}">${esc(S.notes[r.id]||"")}</textarea></label>
      </section>
    </div>
  </div>`;
}
function setNav(){document.querySelectorAll(".nav button").forEach(b=>b.setAttribute("aria-current",b.dataset.tab===S.tab))}
function route(){
  const id=location.hash.slice(1);const r=byId(id);
  if(r){S.tab=r.kind;detail(r);scrollTo(0,0)}
  else if(S.tab==="fav")favView();else if(S.tab==="shop")shopView();else if(S.tab==="learn")learnView();else listView(S.tab);
  setNav();updCount();
}
function clearHash(){if(location.hash)history.pushState("",document.title,location.pathname+location.search)}
window.addEventListener("hashchange",route);
window.addEventListener("popstate",route);

document.addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  if(b.dataset.tab){S.tab=b.dataset.tab;S.q="";save();clearHash();route();scrollTo(0,0);return}
  if(b.id==="home"){S.tab="food";save();clearHash();route();scrollTo(0,0);return}
  if(b.dataset.back){clearHash();route();return}
  if(b.dataset.go){if(location.hash.slice(1)===b.dataset.go)route();else location.hash=b.dataset.go;return}
  if(b.dataset.cat){S.cat[S.tab]=b.dataset.cat;save();listView(S.tab);return}
  if(b.dataset.unshop){delete S.shop[b.dataset.unshop];pruneGot();save();const y=scrollY;shopView();scrollTo(0,y);return}
  if(b.id==="shopclear"){S.shop={};S.got={};save();shopView();return}
  if(b.id==="shopcopy"){copyShop(b);return}
  const r=byId(location.hash.slice(1));
  if(b.dataset.sv&&r){S.serv[r.id]=Math.max(1,Math.min(30,(S.serv[r.id]||r.serv)+ +b.dataset.sv));if(S.shop[r.id])S.shop[r.id]=S.serv[r.id];save();const y=scrollY;detail(r);scrollTo(0,y);return}
  if(b.id==="shopbtn"&&r){if(S.shop[r.id])delete S.shop[r.id];else S.shop[r.id]=S.serv[r.id]||r.serv;pruneGot();save();b.setAttribute("aria-pressed",!!S.shop[r.id]);b.textContent=S.shop[r.id]?"✓ 已在購物清單":"＋ 加入購物清單";return}
  if(b.dataset.ok){document.getElementById("s"+b.dataset.ok).classList.toggle("ok");return}
  if(b.dataset.tm){startTimer(+b.dataset.tm,b.dataset.lb);return}
  if(b.id==="favbtn"&&r){S.fav[r.id]=!S.fav[r.id];if(!S.fav[r.id])delete S.fav[r.id];save();b.setAttribute("aria-pressed",!!S.fav[r.id]);b.textContent=S.fav[r.id]?"★ 已收藏":"☆ 收藏";return}
  if(b.id==="wakebtn"){toggleWake(b);return}
  if(b.id==="donebtn"&&r){S.done[r.id]=!S.done[r.id];if(!S.done[r.id])delete S.done[r.id];save();b.classList.toggle("on",!!S.done[r.id]);b.textContent=S.done[r.id]?"✓ 做過了":"我做完這道了";updCount()}
});
document.addEventListener("input",e=>{if(e.target.id&&e.target.id.startsWith("note-")){S.notes[e.target.id.slice(5)]=e.target.value;save()}});
document.addEventListener("change",e=>{const k=e.target.dataset&&e.target.dataset.got;if(k==null)return;
  if(e.target.checked)S.got[k]=true;else delete S.got[k];save();const y=scrollY;shopView();scrollTo(0,y)});

/* 螢幕常亮 */
let wake=null;
async function toggleWake(b){
  if(wake){try{await wake.release()}catch(e){}wake=null;b.setAttribute("aria-pressed","false");b.textContent="做菜時螢幕常亮";return}
  try{wake=await navigator.wakeLock.request("screen");b.setAttribute("aria-pressed","true");b.textContent="螢幕保持亮著";
    wake.addEventListener("release",()=>{wake=null;const x=$("#wakebtn");if(x){x.setAttribute("aria-pressed","false");x.textContent="做菜時螢幕常亮"}})}
  catch(e){b.textContent="此裝置不支援螢幕常亮"}
}

/* 計時器 */
let left=0,tick=null,paused=false,ac=null,ringing=null,curLabel="";
function beep(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();
  [0,.35,.7].forEach(t=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=880;o.connect(g);g.connect(ac.destination);
   g.gain.setValueAtTime(.25,ac.currentTime+t);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+t+.3);o.start(ac.currentTime+t);o.stop(ac.currentTime+t+.3)})}catch(e){}
  try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}
const draw=()=>{$("#clock").textContent=left>=3600?`${Math.floor(left/3600)}:${fmt(left%3600)}`:fmt(left)};
function stopRing(){clearInterval(ringing);ringing=null;$("#tbar").classList.remove("ring")}
let endAt=0;
function startTimer(sec,label){
  try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();ac.resume()}catch(e){}
  stopRing();left=sec;paused=false;curLabel=label;endAt=Date.now()+sec*1000;$("#tbar").hidden=false;$("#tpause").textContent="暫停";$("#tlabel").textContent=label;draw();
  clearInterval(tick);tick=setInterval(()=>{if(paused)return;left=Math.max(0,Math.round((endAt-Date.now())/1000));draw();
    if(left<=0){clearInterval(tick);tick=null;$("#tlabel").textContent="時間到！"+label;$("#tbar").classList.add("ring");beep();ringing=setInterval(beep,2000)}},500);
}
$("#tpause").onclick=()=>{if(!tick)return;paused=!paused;if(!paused)endAt=Date.now()+left*1000;$("#tpause").textContent=paused?"繼續":"暫停"};
$("#tplus").onclick=()=>{if(ringing||!tick){startTimer(Math.max(left,0)+60,curLabel||"計時");return}left+=60;endAt+=60000;draw()};
$("#treset").onclick=()=>{clearInterval(tick);tick=null;stopRing();left=0;$("#tbar").hidden=true};

route();
})();
