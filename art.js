/* ============ ILLUSTRATIONS ============ */
let _uid=0;
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function rng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function shade(hex,f){const c=hex2rgb(hex);const t=f>=0?255:0,k=Math.abs(f);return rgb2hex(c.map(v=>v+(t-v)*k))}
const f1=n=>(Math.round(n*10)/10);

function contentSVG(sh,col,r,b){
  const R=(a,z)=>a+(z-a)*r();
  const c1=col,c2=shade(col,.28),c3=shade(col,-.32);
  const cs=[c1,c1,c2,c3];const pk=()=>cs[Math.floor(r()*cs.length)];
  let s='';
  switch(sh){
    case 'feuilles':for(let i=0;i<17;i++){const x=R(b.x0+5,b.x1-5),y=R(b.y0+4,b.y1-3),a=R(0,180);s+=`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="7.5" ry="3.2" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})" fill="${pk()}"/>`}break;
    case 'fleurs':for(let i=0;i<10;i++){const x=R(b.x0+6,b.x1-6),y=R(b.y0+6,b.y1-4),cc=pk();for(let k=0;k<5;k++){const an=k*1.2566;s+=`<circle cx="${f1(x+Math.cos(an)*3.4)}" cy="${f1(y+Math.sin(an)*3.4)}" r="3" fill="${cc}"/>`}s+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="1.9" fill="${shade(col,-.5)}"/>`}break;
    case 'racines':for(let i=0;i<8;i++){const x=R(b.x0+4,b.x1-16),y=R(b.y0+6,b.y1-4);s+=`<path d="M${f1(x)} ${f1(y)} q${f1(R(3,8))} ${f1(R(-9,-2))} ${f1(R(10,16))} ${f1(R(-4,4))}" stroke="${pk()}" stroke-width="${f1(R(3,5))}" fill="none" stroke-linecap="round"/>`}break;
    case 'baies':for(let i=0;i<22;i++){const x=R(b.x0+5,b.x1-5),y=R(b.y0+4,b.y1-4),rr=R(3.2,4.6);s+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${pk()}"/><circle cx="${f1(x-1)}" cy="${f1(y-1.2)}" r="1" fill="#fff" opacity=".45"/>`}break;
    case 'fibres':for(let i=0;i<30;i++){const x=R(b.x0+4,b.x1-4),y=b.y1-1,a=R(-.7,.7),l=R(16,(b.y1-b.y0));s+=`<path d="M${f1(x)} ${f1(y)} l${f1(Math.sin(a)*l)} ${f1(-Math.cos(a)*l)}" stroke="${pk()}" stroke-width="1.7" stroke-linecap="round" fill="none"/>`}break;
    case 'mousse':for(let i=0;i<24;i++){s+=`<circle cx="${f1(R(b.x0+3,b.x1-3))}" cy="${f1(R(b.y0+3,b.y1-2))}" r="${f1(R(4,7))}" fill="${pk()}"/>`}break;
    case 'pepites':for(let i=0;i<9;i++){const x=R(b.x0+7,b.x1-7),y=R(b.y0+6,b.y1-4);let p='';for(let k=0;k<6;k++){const an=k*1.047+R(-.2,.2),rr=R(4,7.5);p+=`${f1(x+Math.cos(an)*rr)},${f1(y+Math.sin(an)*rr)} `}s+=`<polygon points="${p}" fill="${pk()}" stroke="${c3}" stroke-width=".6"/>`}break;
    case 'champignons':for(let i=0;i<6;i++){const x=R(b.x0+8,b.x1-8),y=R(b.y0+8,b.y1-4);s+=`<rect x="${f1(x-1.6)}" y="${f1(y)}" width="3.2" height="6" fill="${c2}"/><path d="M${f1(x-7)} ${f1(y)} a7 5.5 0 0 1 14 0z" fill="${pk()}"/>`}break;
    case 'boules':for(let i=0;i<7;i++){const x=R(b.x0+8,b.x1-8),y=R(b.y0+8,b.y1-6),rr=R(6,8);s+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="${c1}"/><circle cx="${f1(x+1.5)}" cy="${f1(y+1)}" r="1.1" fill="${c3}"/><circle cx="${f1(x-2)}" cy="${f1(y-1.5)}" r=".9" fill="${c3}"/>`}break;
    case 'cristaux':for(let i=0;i<11;i++){const x=R(b.x0+6,b.x1-6),y=R(b.y0+8,b.y1-3),h=R(8,15),w=R(3.5,6);s+=`<polygon points="${f1(x)},${f1(y-h)} ${f1(x+w)},${f1(y-h*.6)} ${f1(x+w)},${f1(y)} ${f1(x-w)},${f1(y)} ${f1(x-w)},${f1(y-h*.6)}" fill="${pk()}" stroke="${shade(col,.5)}" stroke-width=".7" opacity=".95"/><path d="M${f1(x)} ${f1(y-h)} v${f1(h)}" stroke="${shade(col,.5)}" stroke-width=".5" opacity=".7"/>`}break;
    case 'poudre':{const yt=b.y1-R(18,24),xm=(b.x0+b.x1)/2;s+=`<path d="M${b.x0} ${b.y1} Q${f1(xm-8)} ${f1(yt+2)} ${f1(xm)} ${f1(yt)} Q${f1(xm+10)} ${f1(yt+3)} ${b.x1} ${b.y1}z" fill="${c1}"/>`;for(let i=0;i<40;i++){s+=`<circle cx="${f1(R(b.x0+6,b.x1-6))}" cy="${f1(R(yt+6,b.y1-2))}" r="${f1(R(.5,1.3))}" fill="${r()<.5?c2:c3}"/>`}break}
    case 'aiguilles':for(let i=0;i<46;i++){const x=R(b.x0+3,b.x1-3),l=R(8,24);s+=`<path d="M${f1(x)} ${b.y1} l${f1(R(-2,2))} ${f1(-l)}" stroke="${r()<.5?c1:c2}" stroke-width="1.3" stroke-linecap="round"/>`}break;
    case 'galets':for(let i=0;i<6;i++){const x=R(b.x0+8,b.x1-8),y=R(b.y0+8,b.y1-5),rx=R(7,10.5),ry=R(4.6,6.5);s+=`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${c1}" stroke="${c3}" stroke-width=".7"/><ellipse cx="${f1(x-rx*.3)}" cy="${f1(y-ry*.35)}" rx="${f1(rx*.35)}" ry="${f1(ry*.25)}" fill="#fff" opacity=".5"/>`}break;
    case 'batons':for(let i=0;i<9;i++){const x=R(b.x0+8,b.x1-8),y=R(b.y0+8,b.y1-4),a=R(-70,70);s+=`<rect x="${f1(x-8)}" y="${f1(y-2)}" width="16" height="4.2" rx="1" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})" fill="${i%3?c1:c3}" stroke="${shade(col,.25)}" stroke-width=".5"/>`}break;
    case 'liquide':{const yt=b.y0;s+=`<rect x="${b.x0-2}" y="${yt}" width="${b.x1-b.x0+4}" height="${b.y1-yt+4}" fill="${c1}" opacity=".92"/><rect x="${b.x0-2}" y="${yt}" width="${b.x1-b.x0+4}" height="2.4" fill="${c2}" opacity=".9"/>`;for(let i=0;i<5;i++)s+=`<circle cx="${f1(R(b.x0+3,b.x1-3))}" cy="${f1(R(yt+8,b.y1-3))}" r="${f1(R(.8,1.6))}" fill="#fff" opacity=".28"/>`;break}
    case 'goutte':{const yt=b.y1-8;s+=`<rect x="${b.x0-2}" y="${yt}" width="${b.x1-b.x0+4}" height="14" fill="${c1}"/><rect x="${b.x0-2}" y="${yt}" width="${b.x1-b.x0+4}" height="2.2" fill="#fff" opacity=".7"/>`;for(let i=0;i<6;i++){const x=R(b.x0+5,b.x1-5);s+=`<circle cx="${f1(x)}" cy="${f1(yt-1.5)}" r="${f1(R(1.6,3))}" fill="${c2}" stroke="${c3}" stroke-width=".5"/>`}break}
  }
  return s;
}
const JARS={
  bocal:{body:'M22 24h36v4c7 3 11 8 11 15v41c0 6-4 10-10 10H21c-6 0-10-4-10-10V43c0-7 4-12 11-15z',lid:'<rect x="19" y="12" width="42" height="12" rx="3"/>',box:{x0:12,y0:46,x1:68,y1:92}},
  bouteille:{body:'M34 22h12v20c9 4 13 9 13 17v27c0 6-3 9-9 9H30c-6 0-9-3-9-9V59c0-8 4-13 13-17z',lid:'<rect x="33" y="10" width="14" height="13" rx="2"/>',box:{x0:22,y0:60,x1:58,y1:92}},
  fiole:{body:'M34 36h12v12c5 2 8 5 8 10v28c0 5-3 8-8 8H34c-5 0-8-3-8-8V58c0-5 3-8 8-10z',lid:'<rect x="32" y="26" width="16" height="11" rx="2.5"/>',box:{x0:27,y0:60,x1:53,y1:92}}
};
function jarSVG(ing,size){
  const id='j'+(++_uid),r=rng(hashStr(ing.id));
  const kind=ing.jar||(ing.cat==='bases'?'bouteille':ing.cat==='animal'?'fiole':'bocal');
  const lidCol=ing.danger?'#1e1720':ing.cat==='mineraux'?'#7f868f':ing.cat==='animal'?'#8a2f2b':'#a5794a';
  const glassFill=ing.danger?'rgba(58,105,190,.40)':'var(--glass-fill)';
  const glassLine=ing.danger?'rgba(140,182,250,.9)':'var(--glass-line)';
  let inner;
  if(kind==='pot'){
    const top=ing.col;
    inner=`<ellipse cx="40" cy="95" rx="30" ry="3.2" fill="rgba(0,0,0,.4)"/>
    <path d="M14 50h52c3 0 4 2 4 5v31c0 5-3 8-7 8H17c-4 0-7-3-7-8V55c0-3 1-5 4-5z" fill="#8b6f52" stroke="#4d3a28" stroke-width="1.4"/>
    <path d="M14 50h52" stroke="#c4a67c" stroke-width="2" opacity=".6"/>
    <ellipse cx="40" cy="50" rx="27" ry="6.5" fill="${shade(top,-.15)}" stroke="#4d3a28" stroke-width="1.4"/>
    <ellipse cx="40" cy="49" rx="24" ry="4.6" fill="${top}"/>
    <path d="M20 66q20 8 40 0" stroke="#4d3a28" stroke-width="1" fill="none" opacity=".5"/>
    <path d="M20 46l-2-6M62 46l2-6" stroke="#4d3a28" stroke-width="0" />`;
  }else{
    const J=JARS[kind];
    inner=`<defs><clipPath id="${id}"><path d="${J.body}"/></clipPath></defs>
    <ellipse cx="40" cy="95" rx="${kind==='fiole'?18:kind==='bocal'?30:24}" ry="3.2" fill="rgba(0,0,0,.4)"/>
    <path d="${J.body}" style="fill:${glassFill}"/>
    <g clip-path="url(#${id})">${contentSVG(ing.sh,ing.col,r,J.box)}</g>
    <path d="${J.body}" fill="none" style="stroke:${glassLine}" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="${kind==='bocal'?'M17 46v36':kind==='bouteille'?'M27 62v26':'M31 62v22'}" stroke="#fff" stroke-width="2.6" stroke-linecap="round" opacity=".28"/>
    <g fill="${lidCol}" stroke="rgba(0,0,0,.55)" stroke-width="1">${J.lid}</g>
    ${ing.cat==='animal'||ing.danger?`<path d="${kind==='fiole'?'M32 31h16':'M20 21h40'}" stroke="rgba(0,0,0,.35)" stroke-width="1.2"/>`:''}`;
  }
  return `<svg viewBox="0 0 80 100" width="${size||80}" height="${size?size*1.25:100}" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">${inner}</svg>`;
}

/* --- outils --- */
const TOOL_SVG={
broyer:`<path class="mixfill" d="M26 52h68c0 20-13 33-34 33S26 72 26 52z"/><path d="M20 50h80M26 52c0 21 13 34 34 34s34-13 34-34"/><path d="M46 86v6h28v-6"/><path d="M84 12L60 50" stroke-width="9"/><circle cx="87" cy="9" r="6"/>`,
infuser:`<path class="mixfill" d="M30 46h50v12a25 25 0 0 1-50 0z"/><path d="M30 46h50v12a25 25 0 0 1-50 0zM80 52h5a9 9 0 0 1 0 18h-7"/><path d="M20 88h70"/><path d="M46 36c-5-6 4-9 0-15M62 36c-5-6 4-9 0-15"/>`,
decocter:`<path class="mixfill" d="M28 40h64l-5 34a8 8 0 0 1-8 7H41a8 8 0 0 1-8-7z"/><path d="M28 40h64l-5 34a8 8 0 0 1-8 7H41a8 8 0 0 1-8-7zM22 40h76M22 46h-8M98 46h8"/><path d="M38 96c-6-7 3-9 0-15 9 4 8 11 4 15M58 96c-7-9 5-12 2-20 12 6 9 15 3 20M80 96c-6-7 3-9 0-15 9 4 8 11 4 15"/>`,
macerer:`<path class="mixfill" d="M36 42h48v6c8 4 10 9 10 17v18c0 6-4 10-10 10H36c-6 0-10-4-10-10V65c0-8 2-13 10-17z"/><path d="M36 34h48v14c8 4 10 9 10 17v18c0 6-4 10-10 10H36c-6 0-10-4-10-10V65c0-8 2-13 10-17z"/><rect x="34" y="22" width="52" height="12" rx="3"/><rect x="46" y="62" width="28" height="16" rx="2"/><path d="M51 68h18M51 73h12"/>`,
distiller:`<path class="mixfill" d="M18 68a24 22 0 1 0 48 0a24 22 0 1 0-48 0z"/><ellipse cx="42" cy="66" rx="24" ry="22"/><path d="M42 44v-12M30 32h24l-4-12H34z"/><path d="M52 24c26-2 36 4 40 18v22"/><path d="M82 68h20v18a10 10 0 0 1-20 0z"/><path d="M26 92h32"/>`,
calciner:`<path class="mixfill" d="M38 30h44l-7 32H45z"/><path d="M38 30h44l-7 32H45zM32 30h56"/><path d="M26 62h68v32H26z"/><path d="M46 94V84a14 14 0 0 1 28 0v10"/><path d="M56 94c-6-7 3-9 0-15 9 4 10 10 4 15"/>`,
petrir:`<path d="M22 56h76l-6 28a9 9 0 0 1-9 7H37a9 9 0 0 1-9-7z"/><path class="mixfill" d="M38 40h44v20a9 9 0 0 1-9 9H47a9 9 0 0 1-9-9z"/><path d="M38 40h44v20a9 9 0 0 1-9 9H47a9 9 0 0 1-9-9z"/><path d="M78 10L56 50" stroke-width="6"/><path d="M28 46c-4-5 3-7 0-13"/>`,
fumiger:`<path d="M60 6L36 42M60 6L84 42M60 6v30"/><path class="mixfill" d="M34 44h52a26 24 0 0 1-52 0z"/><path d="M34 44a26 24 0 0 0 52 0z"/><circle cx="50" cy="56" r="1.6"/><circle cx="60" cy="62" r="1.6"/><circle cx="70" cy="56" r="1.6"/><path d="M56 92c-5-6 3-8 0-14M66 94c-5-6 3-8 0-14"/>`,
melanger:`<path class="mixfill" d="M22 50h76c0 22-15 36-38 36S22 72 22 50z"/><path d="M18 48h84M22 50c0 22 15 36 38 36s38-14 38-36"/><path d="M46 88v5h28v-5"/><path d="M90 14L66 62" stroke-width="5"/><ellipse cx="92" cy="12" rx="7" ry="5" transform="rotate(-27 92 12)"/><path d="M40 58c6-5 10 5 16 0s10 5 16 0"/>`,
fermenter:`<path class="mixfill" d="M45 36h30c12 8 15 22 11 38-2 12-10 20-26 20S36 86 34 74C30 58 33 44 45 36z"/><path d="M45 36h30c12 8 15 22 11 38-2 12-10 20-26 20S36 86 34 74C30 58 33 44 45 36z"/><path d="M40 30h40"/><path d="M60 30V18h9v7"/><circle cx="52" cy="72" r="2.2"/><circle cx="66" cy="62" r="3"/><circle cx="60" cy="80" r="1.6"/>`
};
function toolSVG(id,big){
  return `<svg class="tool" viewBox="0 0 120 100" fill="none" stroke="currentColor" stroke-width="${big?2.4:3}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${TOOL_SVG[id]}</svg>`;
}
/* --- sceaux --- */
const ICON={
 skull:'<path d="M12 3a7 7 0 0 0-4 12.7V19h8v-3.3A7 7 0 0 0 12 3z"/><circle cx="9.3" cy="11" r="1.5"/><circle cx="14.7" cy="11" r="1.5"/><path d="M10.5 19v-2.2M13.5 19v-2.2"/>',
 cross:'<path d="M12 5v14M5 12h14"/>',
 jar:'<rect x="5" y="9.5" width="14" height="10" rx="3"/><path d="M6.5 9.5V7h11v2.5M9 14h6"/>',
 spark:'<path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 shield:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
 down:'<path d="M12 4v14M6 12l6 6 6-6"/>',
 bolt:'<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
 flame:'<path d="M12 3c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z"/>',
 flask:'<rect x="8" y="10" width="8" height="10" rx="2"/><path d="M10 10V7h4v3M11 4h2"/>',
 drop:'<path d="M12 3c4 5 7 8 7 11a7 7 0 0 1-14 0c0-3 3-6 7-11z"/>',
 hourglass:'<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9"/>',
 bubbles:'<circle cx="9" cy="14" r="4.5"/><circle cx="16.5" cy="8.5" r="3"/><circle cx="17" cy="17" r="2"/>',
 star:'<path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z"/>',
 waves:'<path d="M4 10c2-2 4 2 8 0s6 2 8 0M4 15c2-2 4 2 8 0s6 2 8 0"/>'
};
function sealSVG(typeId,size){
  const T=TYPES[typeId]||TYPES.bourbe,r=rng(hashStr(typeId)),cx=32,cy=32;
  let d='';const n=16;
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2,rr=27+r()*3.5;d+=(i?'L':'M')+f1(cx+Math.cos(a)*rr)+' '+f1(cy+Math.sin(a)*rr)}
  d+='Z';
  const ink=T.ink||'#fff6e3';
  return `<svg class="seal" viewBox="0 0 64 64" width="${size||44}" height="${size||44}" aria-hidden="true" focusable="false"><path d="${d}" fill="${T.c}" stroke="${shade(T.c,-.35)}" stroke-width="2" stroke-linejoin="round"/><circle cx="32" cy="32" r="21" fill="none" stroke="${shade(T.c,-.28)}" stroke-width="1.6"/><circle cx="32" cy="32" r="21" fill="none" stroke="${shade(T.c,.25)}" stroke-width=".7" transform="translate(-.8 -.8)" opacity=".7"/><g transform="translate(17 17) scale(1.25)" fill="none" stroke="${ink}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON[T.ic]}</g></svg>`;
}
/* --- flacon du résultat --- */
function vesselSVG(res){
  const col=res.color,id='v'+(++_uid);
  const seal=`<g transform="translate(60 74)"><circle r="9" fill="${TYPES[res.type].c}" stroke="rgba(0,0,0,.35)" stroke-width="1"/></g>`;
  const label=`<rect x="42" y="84" width="36" height="28" rx="2" fill="#e6d8b6" stroke="#a58f62" stroke-width=".8"/><path d="M48 92h24M48 98h24M48 104h14" stroke="#7a6743" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>`;
  let body='';
  if(res.formShape==='fiole'){
    const p='M50 22h20v22c14 6 20 14 20 26v40c0 8-5 12-12 12H42c-7 0-12-4-12-12V70c0-12 6-20 20-26z';
    body=`<defs><clipPath id="${id}"><path d="${p}"/></clipPath></defs><ellipse cx="60" cy="126" rx="34" ry="4" fill="rgba(0,0,0,.35)"/><path d="${p}" style="fill:var(--glass-fill)"/><g clip-path="url(#${id})"><rect x="26" y="66" width="68" height="70" fill="${col}" opacity=".95"/><rect x="26" y="66" width="68" height="3" fill="#fff" opacity=".3"/></g><path d="${p}" fill="none" style="stroke:var(--glass-line)" stroke-width="2" stroke-linejoin="round"/><path d="M38 76v34" stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".3"/><rect x="48" y="10" width="24" height="15" rx="3" fill="#a5794a" stroke="rgba(0,0,0,.5)"/>${label}${seal}`;
  }else if(res.formShape==='pot'){
    body=`<ellipse cx="60" cy="126" rx="42" ry="4" fill="rgba(0,0,0,.35)"/><path d="M20 66h80c4 0 6 3 6 7v44c0 7-5 11-11 11H25c-6 0-11-4-11-11V73c0-4 2-7 6-7z" fill="#8b6f52" stroke="#4d3a28" stroke-width="2"/><ellipse cx="60" cy="66" rx="40" ry="9" fill="${shade(col,-.2)}" stroke="#4d3a28" stroke-width="2"/><ellipse cx="60" cy="64.5" rx="36" ry="6.5" fill="${col}"/>${label.replace('y="84"','y="88"').replace(/M48 92h24M48 98h24M48 104h14/,'M48 96h24M48 102h24M48 108h14')}`;
  }else if(res.formShape==='sachet'){
    body=`<ellipse cx="60" cy="126" rx="36" ry="4" fill="rgba(0,0,0,.35)"/><path d="M28 50c8 3 16 4 32 4s24-1 32-4l6 68c0 4-3 7-7 7H29c-4 0-7-3-7-7z" fill="#cbb98f" stroke="#7a6743" stroke-width="2" stroke-linejoin="round"/><path d="M28 50c8-10 16-14 32-14s24 4 32 14" fill="#bda97b" stroke="#7a6743" stroke-width="2"/><path d="M40 42l4-8M80 42l-4-8" stroke="#7a6743" stroke-width="2" stroke-linecap="round"/><path d="M50 40c6 3 14 3 20 0" stroke="${col}" stroke-width="6" stroke-linecap="round" opacity=".9"/>${label.replace('y="84"','y="76"').replace(/M48 92h24M48 98h24M48 104h14/,'M48 84h24M48 90h24M48 96h14')}`;
  }else{
    body=`<ellipse cx="60" cy="126" rx="34" ry="4" fill="rgba(0,0,0,.35)"/><path d="M60 24L94 116H26z" fill="${shade(col,-.1)}" stroke="rgba(0,0,0,.45)" stroke-width="2" stroke-linejoin="round"/><path d="M60 24L72 116H48z" fill="${shade(col,.18)}" opacity=".5"/><path d="M60 22c-6-8 5-10 0-18M68 20c-5-7 4-9 0-16" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity=".6"/>`;
  }
  return `<svg class="vessel" viewBox="0 0 120 140" aria-hidden="true" focusable="false">${body}</svg>`;
}
const LOGO=`<svg viewBox="0 0 40 40" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5h10M17 5v9L8 31a4 4 0 0 0 3.6 6h16.8A4 4 0 0 0 32 31L23 14V5"/><path d="M12 27h16" opacity=".8"/><circle cx="18" cy="31" r="1.4"/><circle cx="23" cy="30" r="1"/></svg>`;
