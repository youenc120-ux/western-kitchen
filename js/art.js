/* 插圖產生器：依照食譜的 pic / glass 類型與 col 配色，畫出一張 400×300 的 SVG。
   想換成真實照片：在食譜資料加上 photo:"images/檔名.jpg" 即可。 */
(function(){
let UID=0;
function rnd(seed){let h=2166136261>>>0;for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619)}
  return function(){h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function hx(c){c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return[0,2,4].map(i=>parseInt(c.substr(i,2),16))}
function mix(a,b,t){const A=hx(a),B=hx(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
const lt=(c,t)=>mix(c,'#ffffff',t),dk=(c,t)=>mix(c,'#000000',t);
const f=n=>(+n).toFixed(1);
function blob(cx,cy,rx,ry,R,n,j){j=j||.22;const pts=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,k=1+(R()-.5)*j*2;pts.push([cx+Math.cos(a)*rx*k,cy+Math.sin(a)*ry*k])}
  let d=`M${f((pts[0][0]+pts[n-1][0])/2)} ${f((pts[0][1]+pts[n-1][1])/2)}`;
  for(let i=0;i<n;i++){const p=pts[i],q=pts[(i+1)%n];d+=` Q${f(p[0])} ${f(p[1])} ${f((p[0]+q[0])/2)} ${f((p[1]+q[1])/2)}`}return d+'Z'}
const leaf=(x,y,l,w,a,c)=>`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(l)}" ry="${f(w)}" fill="${c}" transform="rotate(${f(a)} ${f(x)} ${f(y)})"/>`;
function sprig(x,y,len,a,c,R){let s=`<g transform="rotate(${f(a)} ${f(x)} ${f(y)})"><line x1="${f(x)}" y1="${f(y)}" x2="${f(x+len)}" y2="${f(y)}" stroke="${dk(c,.2)}" stroke-width="2" stroke-linecap="round"/>`;
  for(let i=1;i<7;i++){const px=x+len*i/7;s+=leaf(px,y-4,5,2,-40,c)+leaf(px,y+4,5,2,40,c)}return s+'</g>'}
function lemon(x,y,r,a,c1,c2){return `<g transform="rotate(${a} ${x} ${y})"><path d="M${x-r} ${y} A${r} ${r} 0 0 1 ${x+r} ${y}Z" fill="${c1}"/><path d="M${x-r+4} ${y} A${r-4} ${r-4} 0 0 1 ${x+r-4} ${y}Z" fill="${c2}"/>
  ${[30,70,110,150].map(d=>{const t=d*Math.PI/180;return`<line x1="${x}" y1="${y}" x2="${f(x-Math.cos(t)*(r-5))}" y2="${f(y-Math.sin(t)*(r-5))}" stroke="${c1}" stroke-width="1.5"/>`}).join('')}</g>`}
function wheel(x,y,r,c1,c2){let s=`<circle cx="${x}" cy="${y}" r="${r}" fill="${c1}"/><circle cx="${x}" cy="${y}" r="${r-3.5}" fill="${c2}"/>`;
  for(let i=0;i<8;i++){const t=i/8*Math.PI*2;s+=`<line x1="${x}" y1="${y}" x2="${f(x+Math.cos(t)*(r-4))}" y2="${f(y+Math.sin(t)*(r-4))}" stroke="${c1}" stroke-width="1.6"/>`}
  return s+`<circle cx="${x}" cy="${y}" r="2.5" fill="${lt(c2,.5)}"/>`}

/* ---------- 料理背景 ---------- */
function foodBg(c,R,plate){
  const base=mix(c[2],'#DCE2DB',.6);
  let s=`<rect width="400" height="300" fill="${base}"/>`;
  s+=`<g transform="rotate(-16 70 260)"><rect x="-60" y="200" width="250" height="160" rx="6" fill="${lt(c[0],.62)}"/>`;
  for(let i=0;i<6;i++)s+=`<rect x="-60" y="${212+i*22}" width="250" height="5" fill="${lt(c[0],.4)}"/>`;
  s+='</g>';
  if(plate){s+=`<rect x="338" y="52" width="13" height="200" rx="6.5" fill="#C3C9C6"/><rect x="341" y="52" width="7" height="80" rx="3.5" fill="#E2E6E4"/>
    <rect x="362" y="60" width="9" height="190" rx="4.5" fill="#C3C9C6"/>`;}
  return s}
function plate(r){r=r||112;return `<ellipse cx="204" cy="160" rx="${r}" ry="${r*.98}" fill="#000000" opacity=".1"/>
  <circle cx="200" cy="150" r="${r}" fill="#FFFFFF"/><circle cx="200" cy="150" r="${r-18}" fill="#F6F7F5" stroke="#E4E8E4" stroke-width="2"/>`}
function board(){return `<ellipse cx="204" cy="160" rx="150" ry="112" fill="#000000" opacity=".1"/><rect x="52" y="44" width="296" height="214" rx="22" fill="#B98A57"/>
  <rect x="62" y="54" width="276" height="194" rx="16" fill="#C99A64"/>${[80,120,170,210].map(y=>`<path d="M70 ${y} Q200 ${y+8} 330 ${y-4}" stroke="#B98A57" stroke-width="2" fill="none"/>`).join('')}`}

const FOOD={
pasta(c,R){let s=plate();for(let i=0;i<40;i++){const a=R()*6.28,rr=8+R()*58,a2=a+.8+R()*2.4,r2=8+R()*62;
  s+=`<path d="M${f(200+Math.cos(a)*rr)} ${f(150+Math.sin(a)*rr*.85)} Q${f(200+(R()-.5)*130)} ${f(150+(R()-.5)*110)} ${f(200+Math.cos(a2)*r2)} ${f(150+Math.sin(a2)*r2*.85)}" stroke="${i%3?c[0]:dk(c[0],.14)}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`}
  for(let i=0;i<6;i++)s+=`<path d="${blob(170+R()*60,125+R()*50,9+R()*14,8+R()*12,R,8)}" fill="${c[1]}" opacity=".9"/>`;
  for(let i=0;i<7;i++)s+=`<rect x="${f(160+R()*80)}" y="${f(115+R()*70)}" width="7" height="5" rx="1.5" fill="${c[3]}" transform="rotate(${f(R()*90)} 200 150)"/>`;
  for(let i=0;i<16;i++)s+=`<rect x="${f(150+R()*100)}" y="${f(105+R()*90)}" width="3" height="3" fill="#FFF7E0"/>`;
  s+=sprig(215,95,26,30,'#4E8B3D',R);return s},
nest(c,R){let s=board();for(let n=0;n<3;n++){const cx=[140,250,195][n],cy=[120,125,195][n];for(let i=0;i<14;i++){const a=R()*6.28,rr=10+R()*28;
  s+=`<path d="M${f(cx+Math.cos(a)*rr)} ${f(cy+Math.sin(a)*rr)} Q${f(cx+(R()-.5)*60)} ${f(cy+(R()-.5)*60)} ${f(cx+Math.cos(a+2.5)*rr)} ${f(cy+Math.sin(a+2.5)*rr)}" stroke="${i%2?c[0]:dk(c[0],.08)}" stroke-width="8" fill="none" stroke-linecap="round"/>`}}
  for(let i=0;i<60;i++)s+=`<circle cx="${f(70+R()*260)}" cy="${f(60+R()*185)}" r="${f(.8+R()*1.6)}" fill="#FFFFFF" opacity=".8"/>`;
  s+=`<ellipse cx="300" cy="205" rx="26" ry="20" fill="#FFFFFF" opacity=".9"/><circle cx="302" cy="204" r="11" fill="${c[3]}"/>`;return s},
steak(c,R){let s=plate();s+=`<path d="${blob(205,165,88,34,R,10,.1)}" fill="${c[1]}" opacity=".85"/>`;
  const inner=mix(c[0],'#E9848A',.55);
  for(let i=0;i<5;i++){const x=140+i*30,y=150+Math.abs(i-2)*-4,a=-18+i*9;
   s+=`<g transform="rotate(${a} ${x} ${y})"><rect x="${x-15}" y="${y-50}" width="30" height="100" rx="7" fill="${dk(c[1],.15)}"/><rect x="${x-10}" y="${y-44}" width="20" height="88" rx="5" fill="${inner}"/><rect x="${x-5}" y="${y-36}" width="10" height="72" rx="4" fill="${lt(inner,.15)}"/></g>`}
  s+=sprig(250,95,34,20,c[3],R)+`<ellipse cx="120" cy="205" rx="10" ry="7" fill="#F1E6CF"/><ellipse cx="135" cy="212" rx="8" ry="6" fill="#E9DCC0"/>`;
  for(let i=0;i<12;i++)s+=`<circle cx="${f(130+R()*140)}" cy="${f(100+R()*100)}" r="1.4" fill="#2A2A2A"/>`;return s},
chicken(c,R){let s=plate();s+=`<path d="${blob(200,160,82,62,R,12,.12)}" fill="${c[2]}"/>`;
  s+=`<path d="${blob(195,140,62,44,R,11,.16)}" fill="${dk(c[0],.15)}"/><path d="${blob(192,135,56,38,R,11,.16)}" fill="${c[0]}"/><path d="${blob(178,124,26,14,R,8)}" fill="${lt(c[0],.35)}"/>`;
  for(let i=0;i<10;i++)s+=`<circle cx="${f(155+R()*80)}" cy="${f(115+R()*45)}" r="${f(2+R()*3)}" fill="${dk(c[0],.3)}" opacity=".6"/>`;
  for(let i=0;i<5;i++){const x=150+R()*110,y=185+R()*25;s+=`<ellipse cx="${f(x)}" cy="${f(y)}" rx="10" ry="7" fill="${c[1]}"/><rect x="${f(x-2.5)}" y="${f(y)}" width="5" height="8" rx="2" fill="${lt(c[1],.3)}"/>`}
  s+=sprig(230,90,26,15,c[3],R);return s},
fillet(c,R){let s=plate();s+=`<path d="${blob(205,165,80,40,R,10,.1)}" fill="${c[1]}" opacity=".9"/>`;
  s+=`<path d="M120 150 Q130 105 210 108 Q280 112 290 150 Q280 180 205 182 Q130 182 120 150Z" fill="${c[0]}"/><path d="M125 150 Q135 115 210 117 Q275 120 285 150" stroke="${dk(c[0],.35)}" stroke-width="7" fill="none"/>`;
  for(let i=0;i<6;i++)s+=`<path d="M${150+i*22} 122 Q${158+i*22} 150 ${150+i*22} 176" stroke="${lt(c[0],.4)}" stroke-width="3" fill="none"/>`;
  s+=lemon(275,205,20,-20,'#E8B830',c[3]);for(let i=0;i<5;i++)s+=`<circle cx="${f(160+R()*90)}" cy="${f(190+R()*14)}" r="3.5" fill="#4E7D3A"/>`;
  s+=`<rect x="100" y="95" width="70" height="6" rx="3" fill="${c[2]}" transform="rotate(-30 100 95)"/><rect x="108" y="102" width="70" height="6" rx="3" fill="${lt(c[2],.15)}" transform="rotate(-24 108 102)"/>`;return s},
fish(c,R){let s=plate();for(let i=0;i<7;i++){const a=-70+i*22,t=a*Math.PI/180,x=200+Math.cos(t)*48,y=158+Math.sin(t)*48;
  s+=`<g transform="rotate(${a+90} ${f(x)} ${f(y)})"><ellipse cx="${f(x)}" cy="${f(y)}" rx="16" ry="44" fill="${c[0]}"/>${[-24,-10,4,18].map(o=>`<path d="M${f(x-13)} ${f(y+o)} Q${f(x)} ${f(y+o-6)} ${f(x+13)} ${f(y+o)}" stroke="${c[3]}" stroke-width="2" fill="none" opacity=".8"/>`).join('')}</g>`}
  for(let i=0;i<4;i++)s+=sprig(150+R()*80,120+R()*60,26,R()*360,c[2],R);s+=lemon(130,205,18,15,'#E8B830','#F2D04B');return s},
soup(c,R){let s=foodBg(c,R,false);s+=`<ellipse cx="206" cy="162" rx="112" ry="108" fill="#000000" opacity=".12"/><circle cx="200" cy="150" r="110" fill="#FFFFFF"/><circle cx="200" cy="150" r="104" fill="#F1F3F0"/><circle cx="200" cy="150" r="84" fill="${dk(c[0],.08)}"/><circle cx="200" cy="148" r="80" fill="${c[0]}"/>`;
  let d='M200 150';for(let i=0;i<40;i++){const t=i*.42,rr=3+i*1.3;d+=` L${f(200+Math.cos(t)*rr)} ${f(150+Math.sin(t)*rr)}`}
  s+=`<path d="${d}" stroke="${c[2]}" stroke-width="3" fill="none" opacity=".8" stroke-linecap="round"/>`;
  for(let i=0;i<7;i++)s+=`<rect x="${f(150+R()*100)}" y="${f(105+R()*90)}" width="9" height="9" rx="2" fill="${c[1]}" transform="rotate(${f(R()*60)} 200 150)"/>`;
  for(let i=0;i<5;i++)s+=leaf(170+R()*60,120+R()*55,6,3,R()*180,c[3]);
  s+=`<g transform="rotate(30 330 230)"><ellipse cx="330" cy="200" rx="16" ry="22" fill="#C3C9C6"/><rect x="326" y="218" width="8" height="70" rx="4" fill="#C3C9C6"/></g>`;return s},
gratin(c,R){let s=foodBg(c,R,false);s+=`<ellipse cx="206" cy="162" rx="138" ry="104" fill="#000000" opacity=".12"/><ellipse cx="200" cy="150" rx="136" ry="102" fill="${c[1]}"/><ellipse cx="200" cy="148" rx="118" ry="86" fill="${dk(c[1],.18)}"/>`;
  s+=`<path d="${blob(200,148,112,80,R,14,.06)}" fill="${c[0]}"/>`;
  for(let i=0;i<26;i++)s+=`<path d="${blob(110+R()*180,85+R()*125,4+R()*9,3+R()*7,R,7)}" fill="${dk(c[0],.25+R()*.25)}" opacity=".75"/>`;
  for(let i=0;i<10;i++)s+=`<circle cx="${f(120+R()*160)}" cy="${f(95+R()*110)}" r="${f(3+R()*4)}" fill="${lt(c[0],.4)}"/>`;
  s+=sprig(270,80,30,25,c[3],R);return s},
bread(c,R){let s=board();s+=`<rect x="92" y="78" width="216" height="148" rx="26" fill="${dk(c[0],.2)}" transform="rotate(-5 200 152)"/><rect x="96" y="74" width="208" height="140" rx="24" fill="${c[0]}" transform="rotate(-5 200 144)"/>`;
  for(let y=0;y<4;y++)for(let x=0;x<6;x++)s+=`<circle cx="${f(122+x*31+R()*6)}" cy="${f(98+y*30+R()*6-x*2.6)}" r="${f(4+R()*2)}" fill="${dk(c[0],.22)}"/>`;
  for(let i=0;i<6;i++){const x=120+R()*160,y=95+R()*100;s+=`<circle cx="${f(x)}" cy="${f(y)}" r="8" fill="${c[3]}"/><circle cx="${f(x)}" cy="${f(y)}" r="4.5" fill="${lt(c[3],.35)}"/>`}
  for(let i=0;i<5;i++)s+=sprig(115+R()*150,95+R()*100,22,R()*360,c[1],R);
  for(let i=0;i<20;i++)s+=`<rect x="${f(110+R()*180)}" y="${f(90+R()*110)}" width="3" height="3" fill="#FFFFFF" opacity=".9"/>`;return s},
loaf(c,R){let s=board();s+=`<ellipse cx="200" cy="158" rx="118" ry="86" fill="${c[1]}"/><ellipse cx="200" cy="150" rx="114" ry="82" fill="${c[0]}"/>`;
  s+=`<path d="M120 170 Q190 95 280 128" stroke="${c[2]}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M122 168 Q190 98 278 128" stroke="${lt(c[0],.25)}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  for(let i=0;i<90;i++){const a=R()*6.28,rr=R()*100;s+=`<circle cx="${f(200+Math.cos(a)*rr)}" cy="${f(150+Math.sin(a)*rr*.72)}" r="${f(.8+R()*1.6)}" fill="${c[2]}" opacity=".8"/>`}
  s+=`<path d="M100 120 Q140 80 200 74" stroke="${c[2]}" stroke-width="3" fill="none" opacity=".7"/>`;return s},
pizza(c,R){let s=board();s+=`<circle cx="200" cy="150" r="104" fill="#C98A45"/><circle cx="200" cy="150" r="100" fill="#DDA45E"/><circle cx="200" cy="150" r="84" fill="${c[0]}"/>`;
  for(let i=0;i<12;i++)s+=`<circle cx="${f(200+Math.cos(i/12*6.28)*94)}" cy="${f(150+Math.sin(i/12*6.28)*94)}" r="${f(3+R()*4)}" fill="#7A4A1E" opacity=".6"/>`;
  for(let i=0;i<9;i++){const a=R()*6.28,rr=R()*60;s+=`<path d="${blob(200+Math.cos(a)*rr,150+Math.sin(a)*rr,14+R()*6,12+R()*6,R,8)}" fill="${c[1]}"/>`}
  for(let i=0;i<6;i++){const a=R()*6.28,rr=15+R()*55;s+=leaf(200+Math.cos(a)*rr,150+Math.sin(a)*rr,11,6,R()*180,c[2])}
  s+=`<path d="M200 150 L300 120 A104 104 0 0 1 296 190Z" fill="#000000" opacity=".06"/>`;return s},
jar(c,R,u){let s=foodBg(c,R,false);s+=`<ellipse cx="204" cy="262" rx="88" ry="12" fill="#000000" opacity=".14"/><rect x="138" y="50" width="124" height="28" rx="6" fill="#8E9894"/><rect x="138" y="50" width="124" height="8" rx="4" fill="#AAB3AF"/>`;
  s+=`<clipPath id="j${u}"><rect x="126" y="78" width="148" height="182" rx="28"/></clipPath><rect x="126" y="78" width="148" height="182" rx="28" fill="#FFFFFF" opacity=".45"/>`;
  s+=`<g clip-path="url(#j${u})"><rect x="120" y="118" width="160" height="150" fill="${c[0]}"/><rect x="120" y="118" width="160" height="10" fill="${lt(c[0],.35)}"/>`;
  for(let i=0;i<14;i++){const x=135+R()*130,y=130+R()*120;s+=`<path d="M${f(x)} ${f(y)} q14 -8 28 0 t28 0" stroke="${c[1]}" stroke-width="${f(3+R()*4)}" fill="none" stroke-linecap="round" opacity=".85"/>`}
  for(let i=0;i<12;i++)s+=`<circle cx="${f(135+R()*130)}" cy="${f(130+R()*120)}" r="${f(1.5+R()*3)}" fill="#FFFFFF" opacity=".6"/>`;
  s+=`</g><rect x="126" y="78" width="148" height="182" rx="28" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".8"/><rect x="140" y="92" width="10" height="140" rx="5" fill="#FFFFFF" opacity=".45"/>`;
  s+=`<rect x="150" y="170" width="100" height="48" rx="4" fill="${c[2]}"/><rect x="164" y="184" width="72" height="5" rx="2" fill="${dk(c[2],.3)}"/><rect x="172" y="196" width="56" height="4" rx="2" fill="${dk(c[2],.2)}"/>`;return s},
sauce(c,R){let s=foodBg(c,R,false);s+=`<ellipse cx="190" cy="160" rx="92" ry="88" fill="#000000" opacity=".12"/><circle cx="185" cy="150" r="90" fill="#FFFFFF"/><circle cx="185" cy="150" r="72" fill="${dk(c[0],.06)}"/><circle cx="185" cy="148" r="68" fill="${c[0]}"/>`;
  s+=`<path d="M140 140 Q165 115 195 135 T235 140" stroke="${c[1]}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M150 168 Q180 150 210 168" stroke="${c[2]}" stroke-width="4" fill="none" opacity=".7" stroke-linecap="round"/>`;
  s+=`<g transform="rotate(-35 320 150)"><ellipse cx="320" cy="110" rx="17" ry="24" fill="#C3C9C6"/><ellipse cx="320" cy="110" rx="12" ry="18" fill="${c[0]}"/><rect x="316" y="132" width="8" height="90" rx="4" fill="#C3C9C6"/></g>`;
  s+=`<ellipse cx="96" cy="250" rx="12" ry="9" fill="#F1E6CF"/><ellipse cx="114" cy="258" rx="10" ry="7" fill="#E9DCC0"/>`;for(let i=0;i<4;i++)s+=leaf(270+R()*60,230+R()*40,10,5,R()*180,c[3]);return s},
cup(c,R,u){let s=foodBg(c,R,false);const g="M150 70 L250 70 L238 236 Q200 250 162 236 Z";
  s+=`<ellipse cx="204" cy="252" rx="70" ry="10" fill="#000000" opacity=".14"/><clipPath id="c${u}"><path d="${g}"/></clipPath><path d="${g}" fill="#FFFFFF" opacity=".4"/>`;
  s+=`<g clip-path="url(#c${u})"><rect x="140" y="128" width="120" height="130" fill="${c[0]}"/><rect x="140" y="112" width="120" height="22" fill="${c[1]}"/><path d="M140 134 Q170 145 200 134 T260 134 V140 H140Z" fill="${c[1]}"/></g>`;
  s+=`<path d="${g}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity=".9"/><rect x="158" y="84" width="6" height="140" rx="3" fill="#FFFFFF" opacity=".5"/>`;
  for(let i=0;i<4;i++)s+=`<circle cx="${180+i*12}" cy="${106-(i%2)*6}" r="7" fill="${c[3]}"/>`;s+=leaf(222,96,9,4,30,'#4E8B3D')+leaf(214,92,8,3.5,-20,'#5E9A4A');return s},
tray(c,R){let s=foodBg(c,R,false);s+=`<rect x="76" y="58" width="256" height="196" rx="16" fill="#000000" opacity=".12"/><rect x="70" y="50" width="256" height="196" rx="16" fill="${c[2]}"/><rect x="84" y="64" width="228" height="168" rx="8" fill="${c[1]}"/>`;
  s+=`<rect x="84" y="64" width="228" height="168" rx="8" fill="${c[0]}" opacity=".92"/>`;for(let i=0;i<140;i++)s+=`<circle cx="${f(88+R()*220)}" cy="${f(68+R()*160)}" r="${f(.8+R()*1.8)}" fill="${dk(c[0],.3)}" opacity=".7"/>`;
  s+=`<path d="M198 64 L198 232 L256 232 L256 64Z" fill="${c[1]}"/><rect x="198" y="64" width="58" height="10" fill="${c[0]}"/><rect x="198" y="112" width="58" height="12" fill="${c[3]}"/><rect x="198" y="170" width="58" height="12" fill="${c[3]}"/>`;
  s+=`<g transform="rotate(25 330 220)"><rect x="316" y="160" width="28" height="12" rx="6" fill="#C3C9C6"/><rect x="340" y="163" width="60" height="6" rx="3" fill="#C3C9C6"/></g>`;return s},
lava(c,R){let s=plate();s+=`<path d="${blob(232,180,52,26,R,9,.2)}" fill="${c[1]}"/><ellipse cx="190" cy="168" rx="58" ry="20" fill="${dk(c[0],.3)}"/><path d="M134 165 Q134 100 190 100 Q246 100 246 165 Z" fill="${c[0]}"/><ellipse cx="190" cy="102" rx="52" ry="10" fill="${lt(c[0],.12)}"/>`;
  s+=`<path d="M215 140 Q230 150 238 172" stroke="${c[1]}" stroke-width="12" fill="none" stroke-linecap="round"/>`;for(let i=0;i<40;i++)s+=`<circle cx="${f(150+R()*80)}" cy="${f(97+R()*14)}" r="1.3" fill="${c[2]}"/>`;
  for(let i=0;i<4;i++)s+=`<circle cx="${130+i*16}" cy="${205+(i%2)*6}" r="7" fill="${c[3]}"/>`;s+=leaf(270,120,10,5,30,'#4E8B3D');return s},
ramekin(c,R){let s=foodBg(c,R,true);s+=`<circle cx="206" cy="160" r="96" fill="#000000" opacity=".12"/>`;for(let i=0;i<32;i++){const t=i/32*6.28;s+=`<circle cx="${f(200+Math.cos(t)*86)}" cy="${f(150+Math.sin(t)*86)}" r="10" fill="${c[2]}"/>`}
  s+=`<circle cx="200" cy="150" r="88" fill="${c[2]}"/><circle cx="200" cy="150" r="74" fill="${c[0]}"/><circle cx="200" cy="150" r="72" fill="${c[1]}"/>`;
  for(let i=0;i<9;i++){const a=R()*6.28,b=a+(R()-.5)*1.5;s+=`<path d="M${f(200+Math.cos(a)*20)} ${f(150+Math.sin(a)*20)} L${f(200+Math.cos(b)*66)} ${f(150+Math.sin(b)*66)}" stroke="${dk(c[1],.3)}" stroke-width="1.5" fill="none"/>`}
  s+=`<path d="${blob(176,128,20,10,R,7)}" fill="${lt(c[1],.3)}" opacity=".6"/>`;for(let i=0;i<3;i++)s+=`<circle cx="${226+i*12}" cy="${178-i*4}" r="7" fill="${c[3]}"/>`;s+=leaf(222,192,9,4,-30,'#4E8B3D');return s},
salad(c,R){let s=foodBg(c,R,false);s+=`<ellipse cx="206" cy="162" rx="114" ry="110" fill="#000000" opacity=".12"/><circle cx="200" cy="150" r="112" fill="#FFFFFF"/><circle cx="200" cy="150" r="98" fill="#F1F3F0"/>`;
  for(let i=0;i<26;i++){const a=R()*6.28,rr=R()*70;s+=leaf(200+Math.cos(a)*rr,150+Math.sin(a)*rr,22+R()*10,10+R()*5,R()*180,i%2?c[0]:c[1])}
  for(let i=0;i<8;i++)s+=`<rect x="${f(150+R()*100)}" y="${f(105+R()*90)}" width="14" height="14" rx="3" fill="${c[2]}" transform="rotate(${f(R()*45)} 200 150)"/>`;
  for(let i=0;i<10;i++)s+=`<rect x="${f(150+R()*100)}" y="${f(105+R()*90)}" width="12" height="4" rx="1" fill="${c[3]}" transform="rotate(${f(R()*180)} 200 150)"/>`;return s},
caprese(c,R){let s=plate(116);for(let i=0;i<10;i++){const t=i/10*6.28,x=200+Math.cos(t)*60,y=150+Math.sin(t)*56;
  if(i%2){s+=`<circle cx="${f(x)}" cy="${f(y)}" r="26" fill="${c[2]}"/><circle cx="${f(x-6)}" cy="${f(y-6)}" r="8" fill="#FFFFFF"/>`}
  else{s+=`<circle cx="${f(x)}" cy="${f(y)}" r="27" fill="${dk(c[0],.1)}"/><circle cx="${f(x)}" cy="${f(y)}" r="23" fill="${c[0]}"/>${[0,1,2,3].map(k=>{const q=k/4*6.28;return`<ellipse cx="${f(x+Math.cos(q)*11)}" cy="${f(y+Math.sin(q)*11)}" rx="5" ry="3" fill="${lt(c[0],.35)}" transform="rotate(${f(q*57)} ${f(x+Math.cos(q)*11)} ${f(y+Math.sin(q)*11)})"/>`}).join('')}`}
  s+=leaf(x+Math.cos(t+.3)*14,y+Math.sin(t+.3)*14,13,6,t*57+90,c[1])}
  s+=`<path d="M170 140 Q200 125 230 145 Q215 170 185 165" stroke="${c[3]}" stroke-width="3" fill="none" opacity=".8"/>`;return s},
bruschetta(c,R){let s=board();for(let n=0;n<3;n++){const x=120+n*80,y=150+(n%2?-14:14);s+=`<g transform="rotate(${-12+n*12} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="42" ry="58" fill="${dk(c[1],.2)}"/><ellipse cx="${x}" cy="${y}" rx="36" ry="52" fill="${c[1]}"/>`;
  for(let i=0;i<10;i++)s+=`<rect x="${f(x-22+R()*36)}" y="${f(y-36+R()*64)}" width="10" height="10" rx="2" fill="${i%3?c[0]:dk(c[0],.15)}"/>`;
  s+=leaf(x-5,y-10,9,4,40,c[3])+leaf(x+8,y+16,8,4,-30,c[3])+'</g>'}return s},
egg(c,R){let s=plate();for(let n=0;n<2;n++){const x=160+n*82,y=150+(n?6:-4);
  s+=`<circle cx="${x}" cy="${y+6}" r="40" fill="${dk(c[1],.15)}"/><circle cx="${x}" cy="${y}" r="38" fill="${c[1]}"/><circle cx="${x}" cy="${y-2}" r="34" fill="${c[2]}"/>`;
  s+=`<path d="${blob(x,y-4,30,26,R,9,.15)}" fill="#FFFFFF"/><path d="${blob(x+2,y-6,22,18,R,9,.12)}" fill="${c[0]}"/><path d="M${x+10} ${y+8} q4 18 -2 26 q-6 -10 -8 -24z" fill="${c[0]}"/>`;
  for(let i=0;i<6;i++)s+=`<rect x="${f(x-14+R()*28)}" y="${f(y-18+R()*20)}" width="6" height="2.5" rx="1" fill="${c[3]}" transform="rotate(${f(R()*180)} ${x} ${y})"/>`}
  for(let i=0;i<14;i++)s+=`<circle cx="${f(140+R()*120)}" cy="${f(115+R()*70)}" r="1.2" fill="#2A2A2A"/>`;return s},
omelette(c,R){let s=plate();s+=`<path d="M112 150 Q120 105 200 104 Q280 105 288 150 Q280 195 200 196 Q120 195 112 150Z" fill="${dk(c[0],.08)}"/><path d="M118 148 Q126 110 200 110 Q274 110 282 148 Q274 188 200 188 Q126 188 118 148Z" fill="${c[0]}"/>`;
  s+=`<path d="M140 130 Q200 112 262 132" stroke="${c[1]}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".8"/>`;for(let i=0;i<14;i++)s+=`<rect x="${f(150+R()*100)}" y="${f(125+R()*40)}" width="7" height="2.5" rx="1" fill="${c[3]}" transform="rotate(${f(R()*180)} 200 150)"/>`;return s},
stack(c,R){let s=foodBg(c,R,false);s+=`<ellipse cx="200" cy="236" rx="140" ry="34" fill="#000000" opacity=".12"/><ellipse cx="200" cy="230" rx="136" ry="32" fill="#FFFFFF"/><ellipse cx="200" cy="228" rx="112" ry="24" fill="#F1F3F0"/>`;
  for(let i=0;i<6;i++){const y=212-i*20;s+=`<ellipse cx="200" cy="${y+6}" rx="98" ry="22" fill="${dk(c[0],.2)}"/><ellipse cx="200" cy="${y}" rx="98" ry="22" fill="${c[0]}"/><ellipse cx="200" cy="${y-3}" rx="92" ry="17" fill="${lt(c[0],.15)}"/>`}
  s+=`<path d="M130 102 Q200 82 270 104 L272 126 Q262 130 258 116 Q250 140 240 118 Q226 132 214 116 Q200 150 190 118 Q170 136 160 116 Q146 128 132 112Z" fill="${c[1]}"/><rect x="186" y="84" width="30" height="20" rx="4" fill="${c[2]}"/>`;
  for(let i=0;i<4;i++)s+=`<circle cx="${90+i*16+(i%2)*8}" cy="${238-(i%2)*8}" r="8" fill="${c[3]}"/>`;return s},
toast(c,R){let s=plate();for(let n=0;n<2;n++){const x=170+n*62,y=146+n*10;s+=`<g transform="rotate(${-14+n*28} ${x} ${y})"><rect x="${x-46}" y="${y-46}" width="92" height="92" rx="16" fill="${dk(c[0],.25)}"/><rect x="${x-40}" y="${y-40}" width="80" height="80" rx="12" fill="${c[0]}"/><rect x="${x-28}" y="${y-28}" width="56" height="56" rx="8" fill="${lt(c[0],.3)}"/></g>`}
  s+=`<path d="M135 120 Q190 160 260 135 Q235 175 160 170" stroke="${c[1]}" stroke-width="6" fill="none" opacity=".85" stroke-linecap="round"/>`;
  for(let i=0;i<3;i++)s+=`<circle cx="${250+i*14}" cy="${196-i*6}" r="8" fill="${c[3]}"/>`;for(let i=0;i<60;i++)s+=`<circle cx="${f(130+R()*140)}" cy="${f(105+R()*95)}" r="1.1" fill="#FFFFFF"/>`;return s},
burger(c,R){let s=foodBg(c,R,false);s+=`<ellipse cx="200" cy="246" rx="140" ry="28" fill="#000000" opacity=".12"/><ellipse cx="200" cy="240" rx="134" ry="26" fill="#FFFFFF"/>`;
  s+=`<path d="M112 222 Q112 240 200 240 Q288 240 288 222 Z" fill="${c[0]}"/><rect x="112" y="210" width="176" height="14" rx="6" fill="${lt(c[0],.15)}"/>`;
  s+=`<path d="M104 196 Q130 182 150 198 Q175 184 200 198 Q225 184 250 198 Q272 184 296 196 L292 210 L108 210Z" fill="#6BAA3A"/>`;
  s+=`<rect x="118" y="168" width="164" height="30" rx="12" fill="${c[1]}"/>`;for(let i=0;i<10;i++)s+=`<circle cx="${f(126+R()*148)}" cy="${f(172+R()*20)}" r="2" fill="${dk(c[1],.3)}"/>`;
  s+=`<path d="M112 166 L288 166 L270 186 L250 170 L228 192 L205 170 L180 190 L158 170 L135 186Z" fill="${c[2]}"/><rect x="128" y="150" width="144" height="16" rx="5" fill="${c[3]}"/>`;
  s+=`<path d="M110 150 Q110 72 200 70 Q290 72 290 150 Z" fill="${c[0]}"/><path d="M128 128 Q140 88 200 86" stroke="${lt(c[0],.3)}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  for(let i=0;i<14;i++)s+=`<ellipse cx="${f(135+R()*130)}" cy="${f(88+R()*48)}" rx="3" ry="1.6" fill="#FFF3D6" transform="rotate(${f(R()*180)} 200 110)"/>`;return s},
cutlet(c,R){let s=plate(116);s+=`<path d="${blob(186,145,82,58,R,13,.16)}" fill="${dk(c[0],.18)}"/><path d="${blob(184,140,78,54,R,13,.16)}" fill="${c[0]}"/>`;
  for(let i=0;i<70;i++){const a=R()*6.28,rr=R()*66;s+=`<circle cx="${f(184+Math.cos(a)*rr)}" cy="${f(140+Math.sin(a)*rr*.7)}" r="${f(1+R()*1.6)}" fill="${i%2?lt(c[0],.3):dk(c[0],.2)}"/>`}
  s+=lemon(262,200,22,-10,'#E8B830',c[1]);s+=`<path d="${blob(140,206,28,16,R,8)}" fill="${c[2]}"/>`;for(let i=0;i<4;i++)s+=leaf(230+R()*20,105+R()*20,7,3,R()*180,c[3]);return s},
pan(c,R){let s=foodBg(c,R,false);s+=`<ellipse cx="206" cy="162" rx="116" ry="112" fill="#000000" opacity=".14"/><circle cx="200" cy="150" r="114" fill="${dk(c[1],.15)}"/><circle cx="200" cy="150" r="106" fill="${c[1]}"/><circle cx="200" cy="150" r="90" fill="${c[2]}"/>`;
  for(let i=0;i<8;i++){const a=i/8*6.28+R()*.4,rr=38+R()*22,x=200+Math.cos(a)*rr,y=150+Math.sin(a)*rr;s+=`<path d="M${f(x-12)} ${f(y)} A13 13 0 1 1 ${f(x+6)} ${f(y+11)}" stroke="${c[0]}" stroke-width="11" fill="none" stroke-linecap="round" transform="rotate(${f(R()*360)} ${f(x)} ${f(y)})"/>`}
  for(let i=0;i<14;i++)s+=`<ellipse cx="${f(130+R()*140)}" cy="${f(85+R()*130)}" rx="5" ry="3.2" fill="#F4EAD0" transform="rotate(${f(R()*180)} 200 150)"/>`;
  for(let i=0;i<5;i++)s+=`<rect x="${f(140+R()*120)}" y="${f(100+R()*100)}" width="10" height="3" rx="1.5" fill="#C2331F" transform="rotate(${f(R()*180)} 200 150)"/>`;
  for(let i=0;i<12;i++)s+=`<circle cx="${f(130+R()*140)}" cy="${f(90+R()*120)}" r="2.6" fill="${c[3]}"/>`;return s},
paella(c,R){let s=foodBg(c,R,false);s+=`<rect x="20" y="138" width="50" height="22" rx="10" fill="${c[1]}"/><rect x="330" y="138" width="50" height="22" rx="10" fill="${c[1]}"/><circle cx="200" cy="150" r="128" fill="${c[1]}"/><circle cx="200" cy="150" r="116" fill="${dk(c[0],.15)}"/><circle cx="200" cy="150" r="112" fill="${c[0]}"/>`;
  for(let i=0;i<160;i++){const a=R()*6.28,rr=R()*108;s+=`<ellipse cx="${f(200+Math.cos(a)*rr)}" cy="${f(150+Math.sin(a)*rr)}" rx="3" ry="1.5" fill="${lt(c[0],.3)}" transform="rotate(${f(R()*180)} ${f(200+Math.cos(a)*rr)} ${f(150+Math.sin(a)*rr)})"/>`}
  for(let i=0;i<6;i++){const a=i/6*6.28+.3,x=200+Math.cos(a)*62,y=150+Math.sin(a)*62;s+=`<g transform="rotate(${f(a*57)} ${f(x)} ${f(y)})"><ellipse cx="${f(x)}" cy="${f(y)}" rx="16" ry="9" fill="#23232F"/><ellipse cx="${f(x)}" cy="${f(y)}" rx="11" ry="5" fill="#E8935A"/></g>`}
  for(let i=0;i<5;i++){const a=i/5*6.28,x=200+Math.cos(a)*30,y=150+Math.sin(a)*30;s+=`<path d="M${f(x-12)} ${f(y)} A13 13 0 1 1 ${f(x+6)} ${f(y+11)}" stroke="${c[3]}" stroke-width="10" fill="none" stroke-linecap="round" transform="rotate(${f(a*57)} ${f(x)} ${f(y)})"/>`}
  for(let i=0;i<20;i++)s+=`<circle cx="${f(110+R()*180)}" cy="${f(60+R()*180)}" r="3.4" fill="${c[2]}"/>`;s+=lemon(285,210,20,20,'#E8B830','#F2D04B')+lemon(110,90,18,200,'#E8B830','#F2D04B');return s},
risotto(c,R){let s=plate();s+=`<path d="${blob(200,152,78,70,R,12,.08)}" fill="${dk(c[0],.08)}"/><path d="${blob(200,150,74,66,R,12,.08)}" fill="${c[0]}"/>`;
  for(let i=0;i<120;i++){const a=R()*6.28,rr=R()*64;s+=`<ellipse cx="${f(200+Math.cos(a)*rr)}" cy="${f(150+Math.sin(a)*rr*.9)}" rx="3.6" ry="1.8" fill="${i%3?lt(c[0],.4):dk(c[0],.08)}" transform="rotate(${f(R()*180)} ${f(200+Math.cos(a)*rr)} ${f(150+Math.sin(a)*rr*.9)})"/>`}
  for(let i=0;i<7;i++){const x=165+R()*70,y=120+R()*60;s+=`<path d="M${f(x-12)} ${f(y)} Q${f(x)} ${f(y-14)} ${f(x+12)} ${f(y)} Z" fill="${c[1]}"/><rect x="${f(x-3)}" y="${f(y)}" width="6" height="9" rx="2" fill="${lt(c[1],.35)}"/>`}
  for(let i=0;i<6;i++)s+=`<path d="${blob(170+R()*60,125+R()*50,8,4,R,6)}" fill="${c[2]}"/>`;for(let i=0;i<10;i++)s+=`<circle cx="${f(165+R()*70)}" cy="${f(115+R()*70)}" r="2.2" fill="${c[3]}"/>`;return s},
stew(c,R){let s=foodBg(c,R,false);s+=`<rect x="28" y="140" width="46" height="20" rx="8" fill="#2F3433"/><rect x="326" y="140" width="46" height="20" rx="8" fill="#2F3433"/><circle cx="206" cy="160" r="122" fill="#000000" opacity=".14"/><circle cx="200" cy="150" r="120" fill="#2F3433"/><circle cx="200" cy="150" r="108" fill="#454B4A"/><circle cx="200" cy="150" r="100" fill="${dk(c[0],.15)}"/><circle cx="200" cy="150" r="96" fill="${c[0]}"/>`;
  for(let i=0;i<12;i++){const a=R()*6.28,rr=R()*70;s+=`<path d="${blob(200+Math.cos(a)*rr,150+Math.sin(a)*rr,13+R()*6,11+R()*5,R,7,.3)}" fill="${c[1]}"/>`}
  for(let i=0;i<9;i++){const a=R()*6.28,rr=R()*74;s+=`<circle cx="${f(200+Math.cos(a)*rr)}" cy="${f(150+Math.sin(a)*rr)}" r="${f(7+R()*4)}" fill="${c[3]}"/>`}
  for(let i=0;i<7;i++){const a=R()*6.28,rr=R()*72;s+=`<path d="${blob(200+Math.cos(a)*rr,150+Math.sin(a)*rr,9,7,R,6)}" fill="${c[2]}"/>`}
  s+=sprig(160,95,34,-15,'#4E7D3A',R)+`<ellipse cx="240" cy="190" rx="12" ry="6" fill="#5E8B3D" transform="rotate(30 240 190)"/>`;return s},
roastpan(c,R){let s=foodBg(c,R,false);s+=`<rect x="56" y="56" width="296" height="206" rx="14" fill="#000000" opacity=".14"/><rect x="50" y="48" width="296" height="206" rx="14" fill="#3A403F"/><rect x="62" y="60" width="272" height="182" rx="8" fill="#F4EEDC"/>`;
  for(let i=0;i<16;i++){const x=80+R()*230,y=78+R()*150;s+=`<path d="${blob(x,y,12,10,R,6,.3)}" fill="${i%2?c[2]:c[3]}"/>`}
  for(let i=0;i<3;i++){const x=120+i*80,y=140+(i%2?-24:24);s+=`<path d="${blob(x,y,36,28,R,10,.16)}" fill="${dk(c[0],.2)}"/><path d="${blob(x-2,y-3,32,24,R,10,.16)}" fill="${c[0]}"/><path d="${blob(x-10,y-10,12,7,R,7)}" fill="${lt(c[0],.35)}"/>`}
  for(let i=0;i<5;i++)s+=sprig(80+R()*220,80+R()*140,24,R()*360,c[1],R);return s},
confit(c,R){let s=plate();s+=`<path d="${blob(150,190,40,22,R,9)}" fill="${c[1]}"/>`;for(let i=0;i<5;i++)s+=`<path d="${blob(130+R()*50,180+R()*25,10,8,R,6)}" fill="${lt(c[1],.25)}"/>`;
  s+=`<path d="${blob(205,138,58,40,R,11,.12)}" fill="${dk(c[0],.2)}"/><path d="${blob(203,134,54,36,R,11,.12)}" fill="${c[0]}"/><rect x="246" y="92" width="44" height="12" rx="6" fill="#F4EEDC" transform="rotate(-35 246 98)"/><circle cx="286" cy="76" r="9" fill="#F4EEDC"/><circle cx="294" cy="86" r="8" fill="#F4EEDC"/>`;
  for(let i=0;i<12;i++)s+=`<circle cx="${f(170+R()*70)}" cy="${f(115+R()*40)}" r="${f(1.5+R()*2.5)}" fill="${dk(c[0],.35)}" opacity=".6"/>`;
  for(let i=0;i<7;i++)s+=leaf(250+R()*40,180+R()*30,12,6,R()*180,c[2]);s+=`<path d="M120 120 Q130 100 150 110" stroke="${c[3]}" stroke-width="5" fill="none" stroke-linecap="round"/>`;return s},
plate(c,R){let s=plate();for(let i=0;i<5;i++)s+=`<path d="${blob(170+R()*60,125+R()*50,20,16,R,8)}" fill="${c[i%4]}"/>`;return s}
};

/* ---------- 酒杯 ---------- */
const G={
coupe:{o:"M128 118 Q130 182 200 184 Q270 182 272 118 Z",l:"M134 128 Q138 178 200 179 Q262 178 266 128 Z",stem:[184,246],rim:[128,272,118],top:128},
martini:{o:"M116 98 L284 98 L200 184 Z",l:"M130 110 L270 110 L200 178 Z",stem:[184,246],rim:[116,284,98],top:110},
flute:{o:"M176 58 L224 58 L219 168 Q200 186 181 168 Z",l:"M178 84 L222 84 L218 166 Q200 182 182 166 Z",stem:[184,246],rim:[176,224,58],top:84},
wine:{o:"M138 70 Q124 180 200 188 Q276 180 262 70 Z",l:"M133 114 Q132 176 200 182 Q268 176 267 114 Z",stem:[188,246],rim:[138,262,70],top:114},
rocks:{o:"M136 150 L143 252 Q200 259 257 252 L264 150 Z",l:"M140 176 L146 248 Q200 254 254 248 L260 176 Z",rim:[136,264,150],top:176},
highball:{o:"M156 70 L161 252 Q200 258 239 252 L244 70 Z",l:"M158 98 L163 248 Q200 253 237 248 L242 98 Z",rim:[156,244,70],top:98},
toddy:{o:"M150 92 L159 220 Q200 230 241 220 L250 92 Z",l:"M152 100 L160 216 Q200 225 240 216 L248 100 Z",stem:[226,246],rim:[150,250,92],top:100}
};
function drinkBg(c){const b=mix(dk(c[1],.7),'#1A2226',.55);return `<rect width="400" height="300" fill="${b}"/><ellipse cx="200" cy="110" rx="190" ry="140" fill="${lt(c[0],.15)}" opacity=".18"/><ellipse cx="200" cy="120" rx="110" ry="90" fill="${lt(c[0],.3)}" opacity=".12"/>
 <rect x="0" y="252" width="400" height="48" fill="#3A2A20"/><rect x="0" y="252" width="400" height="4" fill="#6A4E3A"/><ellipse cx="200" cy="254" rx="80" ry="6" fill="#000000" opacity=".35"/>`}
function garnish(r,gl,R){const c=r.col,[x1,x2,y]=gl.rim;let s='';
  (r.gar||[]).forEach(g=>{
   if(g==="orange")s+=wheel(x2-10,y+4,24,'#E8851E','#FBC66B');
   if(g==="lime")s+=wheel(x2-8,y+4,20,'#4E8B2A','#BFE07A');
   if(g==="lemon")s+=lemon(x2-6,y+6,22,-40,'#E8B830','#F7E07A');
   if(g==="peel")s+=`<path d="M${x2-30} ${y-2} q20 -26 46 -12 q-10 10 -26 8 q-12 0 -20 4z" fill="#E8851E"/>`;
   if(g==="olive")s+=`<line x1="${x1+10}" y1="${y-26}" x2="${(x1+x2)/2+10}" y2="${gl.top+40}" stroke="#C8B48A" stroke-width="2.5"/><circle cx="${(x1+x2)/2-2}" cy="${gl.top+18}" r="9" fill="#6E8B3D"/><circle cx="${(x1+x2)/2+6}" cy="${gl.top+32}" r="9" fill="#5E7D33"/><circle cx="${(x1+x2)/2-4}" cy="${gl.top+16}" r="3" fill="#C2331F"/>`;
   if(g==="cherry")s+=`<path d="M${(x1+x2)/2+4} ${gl.top+10} q10 -26 24 -34" stroke="#5A3A1E" stroke-width="2" fill="none"/><circle cx="${(x1+x2)/2}" cy="${gl.top+14}" r="10" fill="#7A1020"/><circle cx="${(x1+x2)/2-3}" cy="${gl.top+11}" r="3" fill="#C2304C"/>`;
   if(g==="mint"){for(let i=0;i<6;i++)s+=leaf((x1+x2)/2-14+i*6,y-12-(i%2)*8,11,5,-60+i*24,i%2?'#4E9A4A':'#3E8A3A')}
   if(g==="berry")s+=`<circle cx="${(x1+x2)/2}" cy="${gl.top+60}" r="7" fill="#3A1A3A"/><circle cx="${(x1+x2)/2+5}" cy="${gl.top+52}" r="6" fill="#5A2A4A"/>`;
   if(g==="beans")for(let i=0;i<3;i++)s+=`<ellipse cx="${(x1+x2)/2-14+i*14}" cy="${gl.top+4}" rx="6" ry="4" fill="#3A2214"/><line x1="${(x1+x2)/2-19+i*14}" y1="${gl.top+4}" x2="${(x1+x2)/2-9+i*14}" y2="${gl.top+4}" stroke="#1E120A" stroke-width="1.2"/>`;
   if(g==="celery")s+=`<rect x="${x2-34}" y="${y-58}" width="12" height="${gl.top-y+120}" rx="6" fill="#8FB35A" transform="rotate(12 ${x2-28} ${y})"/>${leaf(x2-22,y-62,14,6,-30,'#6BAA3A')}${leaf(x2-30,y-60,12,5,-80,'#5E9A4A')}`;
   if(g==="salt"){for(let i=0;i<26;i++){const t=i/25;s+=`<circle cx="${f(x1+(x2-x1)*t*.5)}" cy="${f(y+(R()-.5)*3)}" r="${f(1.6+R()*1.4)}" fill="#FFFFFF"/>`}}
  });return s}
function glassSVG(r,R,u){const c=r.col;let s=drinkBg(c);
  s+=`<defs><linearGradient id="l${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient>
   <linearGradient id="cu${u}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A4A25"/><stop offset=".35" stop-color="#D99A66"/><stop offset=".6" stop-color="#C47A45"/><stop offset="1" stop-color="#7A3E1E"/></linearGradient></defs>`;
  if(r.glass==="mug"){
   s+=`<path d="M246 160 q40 0 40 40 q0 34 -40 34" stroke="url(#cu${u})" stroke-width="12" fill="none"/><path d="M144 132 L152 248 Q200 258 248 248 L256 132 Z" fill="url(#cu${u})"/>`;
   for(let i=0;i<30;i++)s+=`<circle cx="${f(158+R()*86)}" cy="${f(145+R()*95)}" r="${f(1.5+R()*2)}" fill="#FFFFFF" opacity=".12"/>`;
   s+=`<ellipse cx="200" cy="132" rx="56" ry="9" fill="#E8B080"/><ellipse cx="200" cy="133" rx="50" ry="6" fill="${c[1]}"/>`;
   for(let i=0;i<3;i++)s+=`<rect x="${172+i*20}" y="${120-(i%2)*6}" width="18" height="16" rx="3" fill="#FFFFFF" opacity=".55"/>`;
   const gl={rim:[144,256,128],top:132};return s+garnish(r,gl,R)}
  if(r.glass==="pitcher"){
   const o="M140 64 L270 64 L284 52 L286 70 L272 82 L278 244 Q210 256 142 244 Z";
   s+=`<path d="M146 92 q-50 10 -46 64 q4 42 48 52" stroke="#FFFFFF" stroke-width="9" fill="none" opacity=".45"/>`;
   s+=`<clipPath id="p${u}"><path d="${o}"/></clipPath><path d="${o}" fill="#FFFFFF" opacity=".08"/><g clip-path="url(#p${u})"><rect x="120" y="96" width="180" height="170" fill="url(#l${u})"/>`;
   for(let i=0;i<7;i++){const x=160+R()*100,y=110+R()*120;s+=i%2?wheel(f(x),f(y),17,'#E8851E','#FBC66B'):`<path d="${blob(x,y,14,11,R,7)}" fill="#F4E6B0"/><path d="${blob(x,y,14,11,R,7)}" fill="none" stroke="#C2331F" stroke-width="2.5"/>`}
   for(let i=0;i<5;i++)s+=`<rect x="${f(160+R()*90)}" y="${f(96+R()*30)}" width="22" height="20" rx="4" fill="#FFFFFF" opacity=".3"/>`;
   s+=`</g><path d="${o}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity=".75"/><rect x="152" y="80" width="7" height="150" rx="3.5" fill="#FFFFFF" opacity=".35"/>`;
   s+=`<path d="M300 236 L330 186 L360 236 Z" fill="#FFFFFF" opacity=".1"/><path d="M302 236 L332 202 L358 236 Z" fill="url(#l${u})"/><rect x="329" y="236" width="4" height="12" fill="#FFFFFF" opacity=".4"/>`;return s}
  if(r.glass==="jar"){s+=`<rect x="160" y="62" width="80" height="26" rx="6" fill="#8E9894"/><clipPath id="b${u}"><rect x="146" y="88" width="108" height="164" rx="20"/></clipPath><rect x="146" y="88" width="108" height="164" rx="20" fill="#FFFFFF" opacity=".12"/>
   <g clip-path="url(#b${u})"><rect x="140" y="120" width="120" height="140" fill="url(#l${u})"/></g><rect x="146" y="88" width="108" height="164" rx="20" fill="none" stroke="#FFFFFF" stroke-width="3" opacity=".7"/><rect x="164" y="170" width="72" height="40" rx="4" fill="${c[3]}"/><rect x="176" y="184" width="48" height="5" rx="2" fill="${lt(c[3],.6)}"/>`;
   for(let i=0;i<8;i++)s+=`<rect x="${f(60+R()*50)}" y="${f(222+R()*22)}" width="12" height="12" rx="2" fill="#FFFFFF" opacity=".9" transform="rotate(${f(R()*45)} 80 230)"/>`;return s}
  const gl=G[r.glass]||G.rocks;
  s+=`<clipPath id="g${u}"><path d="${gl.l}"/></clipPath>`;
  if(gl.stem)s+=`<rect x="197" y="${gl.stem[0]}" width="6" height="${gl.stem[1]-gl.stem[0]}" fill="#FFFFFF" opacity=".5"/><ellipse cx="200" cy="249" rx="44" ry="7" fill="#FFFFFF" opacity=".22"/><ellipse cx="200" cy="249" rx="44" ry="7" fill="none" stroke="#FFFFFF" stroke-width="2" opacity=".6"/>`;
  s+=`<path d="${gl.o}" fill="#FFFFFF" opacity=".07"/><g clip-path="url(#g${u})"><path d="${gl.l}" fill="url(#l${u})"/>`;
  if(r.ice==="big")s+=`<rect x="172" y="${gl.top+14}" width="56" height="54" rx="6" fill="#FFFFFF" opacity=".24" transform="rotate(7 200 ${gl.top+40})"/><rect x="178" y="${gl.top+20}" width="20" height="8" rx="3" fill="#FFFFFF" opacity=".35" transform="rotate(7 200 ${gl.top+40})"/>`;
  if(r.ice==="cube")for(let i=0;i<4;i++)s+=`<rect x="${f(170+(i%2)*28+R()*6)}" y="${f(gl.top+4+Math.floor(i/2)*34+R()*6)}" width="30" height="28" rx="5" fill="#FFFFFF" opacity=".22" transform="rotate(${f((R()-.5)*30)} 200 ${gl.top+40})"/>`;
  if(r.ice==="crushed")for(let i=0;i<40;i++)s+=`<rect x="${f(160+R()*80)}" y="${f(gl.top+R()*140)}" width="${f(6+R()*8)}" height="${f(5+R()*7)}" rx="2" fill="#FFFFFF" opacity=".3" transform="rotate(${f(R()*90)} 200 160)"/>`;
  if(r.fizz)for(let i=0;i<26;i++)s+=`<circle cx="${f(150+R()*100)}" cy="${f(gl.top+6+R()*150)}" r="${f(1+R()*2.2)}" fill="#FFFFFF" opacity=".55"/>`;
  if((r.gar||[]).includes("foam"))s+=`<rect x="100" y="${gl.top-2}" width="200" height="14" fill="${c[2]}"/>`;
  if((r.gar||[]).includes("cream"))s+=`<rect x="100" y="${gl.top-2}" width="200" height="26" fill="${c[2]}"/><path d="M100 ${gl.top+24} q25 6 50 0 t50 0 t50 0 t50 0 v4 h-200z" fill="${c[2]}"/>`;
  if((r.gar||[]).includes("berry"))s+=`<circle cx="200" cy="${gl.top+70}" r="8" fill="#3A1A3A"/><circle cx="206" cy="${gl.top+60}" r="6" fill="#5A2A4A"/>`;
  s+=`</g><path d="${gl.o}" fill="none" stroke="#FFFFFF" stroke-width="3" opacity=".8" stroke-linejoin="round"/>`;
  s+=`<path d="M${gl.rim[0]+10} ${gl.rim[2]+14} Q${gl.rim[0]+8} ${gl.rim[2]+50} ${gl.rim[0]+18} ${gl.rim[2]+76}" stroke="#FFFFFF" stroke-width="4" fill="none" opacity=".4" stroke-linecap="round"/>`;
  return s+garnish(r,gl,R)}

window.ART=function(r){const u=(++UID)+r.id.replace(/[^a-z0-9]/gi,'');const R=rnd(r.id);let body;
  if(r.kind==="drink"||r.glass)body=glassSVG(r,R,u);
  else{const fn=FOOD[r.pic]||FOOD.plate;const needsBg=!["soup","gratin","jar","sauce","cup","tray","roastpan","salad","ramekin","stack","burger","pan","paella","stew"].includes(r.pic);
    body=(needsBg?foodBg(r.col,R,["pasta","steak","chicken","fillet","fish","egg","omelette","toast","risotto","cutlet","confit","caprese","lava","plate"].includes(r.pic)):'')+fn(r.col,R,u)}
  return `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${r.name}插圖">${body}</svg>`};
})();
