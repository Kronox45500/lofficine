/* ============ INTERFACE ============ */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isWide=()=>window.matchMedia('(min-width:1000px)').matches;
const reduced=()=>window.matchMedia('(prefers-reduced-motion:reduce)').matches;

const LS={mem:{},ok:true,
  get(k){try{return localStorage.getItem(k)}catch(e){this.ok=false;return this.mem[k]==null?null:this.mem[k]}},
  set(k,v){try{localStorage.setItem(k,v)}catch(e){this.ok=false;this.mem[k]=v}}
};
(function(){try{localStorage.setItem('officine.t','1');localStorage.removeItem('officine.t')}catch(e){LS.ok=false}})();

const S={view:'bench',cat:'plantes',reserve:[],mixes:{},stockedId:null,confirmStock:null,items:[],solvent:null,adj:null,tech:'infuser',feu:1,fin:{filtrer:false,reduire:false,sceller:false},finHint:'filtrer',
  result:null,savedId:null,fresh:false,book:[],openId:null,filter:'all',q:'',sort:'recent',msg:'',brewing:false,confirmDel:null};

function load(){
  try{const rs=JSON.parse(LS.get('officine.v1.reserve')||'[]');S.reserve=Array.isArray(rs)?rs.filter(validStock).slice(0,MAX_STOCK):[]}catch(e){S.reserve=[]}
  rebuildMixes();
  try{
    const b=JSON.parse(LS.get('officine.v1.bench')||'null');
    if(b){
      S.items=(b.items||[]).filter(i=>G(i.id)&&G(i.id).cat!=='bases'&&i.dose>=1&&i.dose<=3).slice(0,MAX_ITEMS);
      S.solvent=b.solvent&&G(b.solvent)&&(G(b.solvent).role==='solvant'||G(b.solvent).liquidMix)?b.solvent:null;
      S.adj=b.adj&&G(b.adj)&&G(b.adj).role==='adjuvant'?b.adj:null;
      if(TECH[b.tech])S.tech=b.tech;
      if([0,1,2].includes(b.feu))S.feu=b.feu;
      if(b.fin)S.fin={filtrer:!!b.fin.filtrer,reduire:!!b.fin.reduire,sceller:!!b.fin.sceller};
    }
  }catch(e){}
  try{
    const bk=JSON.parse(LS.get('officine.v1.book')||'[]');
    S.book=Array.isArray(bk)?bk.filter(validEntry):[];
  }catch(e){S.book=[]}
}
function validEntry(e){return e&&typeof e.id==='string'&&typeof e.name==='string'&&e.res&&TYPES[e.res.type]&&Array.isArray(e.res.fx)&&Array.isArray(e.res.ingr)&&e.res.recipe&&FX&&e.res.fx.every(f=>FX[f.id])}
function persist(){
  LS.set('officine.v1.bench',JSON.stringify({items:S.items,solvent:S.solvent,adj:S.adj,tech:S.tech,feu:S.feu,fin:S.fin}));
}
function persistBook(){LS.set('officine.v1.book',JSON.stringify(S.book))}
const rc=()=>({items:S.items.map(i=>({id:i.id,dose:i.dose})),solvent:S.solvent,adj:S.adj,tech:S.tech,feu:S.feu,fin:Object.assign({},S.fin)});

const G=id=>BY[id]||S.mixes[id];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const solvAllowed=(T,g)=>g.mix?!!(g.liquidMix&&T.solv.some(id=>BY[id].kind===g.kind)):T.solv.includes(g.id);
function validStock(c){return !!(c&&typeof c.id==='string'&&c.id.indexOf('m:')===0&&typeof c.name==='string'&&c.res&&TYPES[c.res.type]&&Array.isArray(c.res.fx)&&Array.isArray(c.res.ingr)&&c.res.recipe&&c.res.fx.every(f=>FX[f.id]))}
function rebuildMixes(){S.mixes={};S.reserve=S.reserve.filter(c=>{try{S.mixes[c.id]=mixIng(c.id,c.name,c.res);return true}catch(e){return false}})}
function persistReserve(){LS.set('officine.v1.reserve',JSON.stringify(S.reserve))}
/* ---------- utilitaires ---------- */
let toastT;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),1900)}
function live(m){$('#live').textContent=m}
function previewColor(){
  if(!S.items.length)return 'transparent';
  const T=TECH[S.tech];const list=S.items.map(i=>({c:G(i.id).col,w:DF[i.dose]}));
  if(S.solvent&&G(S.solvent)&&solvAllowed(T,G(S.solvent)))list.push({c:G(S.solvent).col,w:2.4});
  return mixHex(list);
}
const load_=()=>S.items.reduce((s,i)=>s+i.dose,0);
const FLAME='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-2.500 1-4 2.500-5 0 2 1 3 2 3 0-4-1-6 1.500-10z"/></svg>';
const BASE_USE={eau_pluie:'Liquide des infusions, décoctions et macérations aqueuses. Se corrompt vite.',eau_distillee:'Liquide pur pour infusions, décoctions et distillations.',alcool:'Liquide de macération et de distillation. Extrait le plus, conserve tout.',vinaigre:'Liquide qui attaque les sels et les métaux. Sert aussi à macérer.',huile:'Liquide gras : macération à l\'huile ou base de liniment.',lait_chaux:'Liquide alcalin, employé aussi pour faire du savon avec de la graisse.',miel:'Liant qui adoucit, masque l\'amertume et conserve : sirops, élixirs, électuaires.',glycerine:'Liant onctueux : adoucit, donne du corps aux pâtes et aux lotions.',graisse_oie:'Corps gras pour onguents. Avec la chaux, donne du savon.',cire_brune:'Corps ferme pour cérats et emplâtres. Aussi liant pour fumigations.'};
function ingHints(ing){
  const h=[];
  if(ing.cat==='bases'){h.push(BASE_USE[ing.id]);return h}
  h.push('Se présente sous forme de : '+lcFirst(PART_LABEL[ing.p])+'.');
  h.push('Sa vertu passe surtout '+SOL_LABEL[ing.s]+'.');
  if(ing.v===1)h.push('Ses essences s\'évaporent en partie à la chaleur.');
  if(ing.v===2)h.push('Très volatile : la chaleur chasse ses essences, la distillation les recueille.');
  if((ing.tags||[]).includes('mercure'))h.push('Métal liquide : chauffé, il s\'évapore en vapeurs mortelles.');
  if((ing.tags||[]).includes('fumeux'))h.push('Brûle ou fume au feu.');
  if((ing.tags||[]).includes('sucre'))h.push('Contient des sucres : peut fermenter.');
  if(ing.labile)h.push('La cuisson en adoucit le mordant.');
  if((ing.tags||[]).includes('lent'))h.push('Agit lentement, sans avertir.');
  if(ing.danger)h.push('Dangereuse : à manier avec le plus grand soin.');
  return h;
}

/* ---------- vues ---------- */
const ICO_DOCK={
  shelf:'<svg viewBox="0 0 24 24"><path d="M3 8h18M3 16h18M3 20h18M3 4h18"/><path d="M6 8V5M10 8V6M16 8V5M7 16v-3M12 16v-4M17 16v-3"/></svg>',
  bench:'<svg viewBox="0 0 24 24"><path d="M6 10h12c0 4-2.500 7-6 7s-6-3-6-7z"/><path d="M15 3l-4 7M9 20h6"/></svg>',
  result:'<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h7"/></svg>',
  book:'<svg viewBox="0 0 24 24"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>'
};
function renderChrome(){
  const n=S.items.length,b=S.book.length;
  $('#dock').innerHTML=[['shelf','Étagère'],['bench','Établi'],['result','Fiche'],['book','Grimoire']].map(([v,l])=>`<button data-a="view" data-v="${v}" ${S.view===v?'aria-current="page"':''}>${ICO_DOCK[v]}<span>${l}</span>${v==='bench'&&n?`<span class="count">${n}</span>`:''}${v==='book'&&b?`<span class="count">${b}</span>`:''}</button>`).join('');
  const nb=$$('#nav button');
  nb[0].setAttribute('aria-current',S.view!=='book'?'page':'false');
  nb[1].setAttribute('aria-current',S.view==='book'?'page':'false');
  $('#navcount').textContent=b?b:'';$('#navcount').style.display=b?'inline-block':'none';
}
function setView(v){
  $('#toast').classList.remove('show');
  S.view=v;$('#app').dataset.view=v;
  if(v==='book')renderBook();
  renderChrome();
  const p=$('.panel-'+v);if(p&&!isWide())p.scrollTop=0;
}

/* ---------- étagère ---------- */
function cellHTML(ing){
  const it=S.items.find(i=>i.id===ing.id);
  const on=!!it||S.solvent===ing.id||S.adj===ing.id;
  const badge=it?`<span class="badge">${it.dose}</span>`:on?`<span class="badge">✓</span>`:'';
  return `<div class="cell${on?' on':''}"><div class="slot" role="button" tabindex="0" draggable="true" data-a="add" data-id="${ing.id}" aria-label="Poser ${esc(ing.n)} sur l'établi${it?' (dose actuelle '+it.dose+')':''}"><span class="jar">${jarSVG(ing)}</span><span class="plank"><span class="tag">${esc(ing.n)}</span></span></div><button class="info" data-a="info" data-id="${ing.id}" aria-label="À propos de ${esc(ing.n)}">i</button>${badge}</div>`;
}
function stockCell(c){
  const g=G(c.id);if(!g)return '';
  const it=S.items.find(i=>i.id===c.id);const on=!!it||S.solvent===c.id;
  const badge=it?`<span class="badge low">${it.dose}</span>`:S.solvent===c.id?`<span class="badge low">✓</span>`:'';
  return `<div class="cell stock${on?' on':''}"><div class="slot" role="button" tabindex="0" draggable="true" data-a="add" data-id="${esc(c.id)}" title="${esc(c.name)} : ${esc(TYPES[c.res.type].n.toLowerCase())}, ${esc(c.res.danger.label.toLowerCase())}" aria-label="Poser ${esc(c.name)} sur l'établi"><span class="jar">${jarSVG(g)}</span><span class="plank"><span class="tag">${esc(c.name)}</span></span></div><button class="info" data-a="stockinfo" data-id="${esc(c.id)}" aria-label="Fiche de ${esc(c.name)}">i</button><span class="mini-seal">${sealSVG(c.res.type,26)}</span>${badge}</div>`;
}
function reserveHTML(){
  if(!S.reserve.length)return `<div class="shelf-empty"><p>La réserve est vide.</p><p>Quand une préparation te plaît, transvase-la dans un contenant depuis sa fiche. Tu pourras la reprendre ici comme ingrédient, la mélanger à d'autres ou la retravailler en plusieurs étapes.</p></div>`;
  const fill='<div class="cell"><span class="jar"></span><span class="plank"></span></div>'.repeat((3-S.reserve.length%3)%3);
  return `<p class="shelf-sub">Contenants (${S.reserve.length} sur ${MAX_STOCK})</p><div class="grid">${S.reserve.map(stockCell).join('')}${fill}</div>`;
}
function renderShelf(){
  const cats=CATS.concat([{id:'reserve',n:'Réserve'+(S.reserve.length?' ('+S.reserve.length+')':'')}]);
  const grid=a=>`<div class="grid">${a.map(cellHTML).join('')}</div>`;
  let h=`<div class="cats" role="group" aria-label="Rayons">${cats.map(c=>`<button class="cat" data-a="cat" data-id="${c.id}" aria-pressed="${c.id===S.cat}">${c.n}</button>`).join('')}</div>`;
  if(S.cat==='reserve')h+=reserveHTML();else if(S.cat==='bases')h+=`<p class="shelf-sub">Liquides</p>${grid(ING.filter(i=>i.role==='solvant'))}<p class="shelf-sub">Liants</p>${grid(ING.filter(i=>i.role==='adjuvant'))}`;
  else h+=grid(ING.filter(i=>i.cat===S.cat));
  h+='<div class="shelf-end"></div>';
  $('#shelf').innerHTML=h;
}

/* ---------- établi ---------- */
function mixInfo(g){
  const r=g.res,fx=r.fx.slice(0,3).map(f=>FX[f.id].n.toLowerCase());
  return `<small class="mixinfo${r.danger.level>=2?' warn':''}">${esc(TYPES[r.type].n)}, ${esc(r.danger.label.toLowerCase())}${fx.length?' : '+esc(fx.join(', ')):''}</small>`;
}
function baseSlot(kind){
  const T=TECH[S.tech];const id=kind==='solv'?S.solvent:S.adj;const ing=id?G(id):null;
  const allowed=kind==='solv'?T.solv:T.adj;
  const lab=kind==='solv'?'Liquide':'Liant';
  const need=kind==='solv'?['infuser','decocter','macerer','distiller','fermenter'].includes(S.tech):(S.tech==='petrir');
  let inner;
  if(ing){
    const ok=kind==='solv'?solvAllowed(T,ing):allowed.includes(id);
    inner=`<div class="val"><span class="dot" style="background:${ing.col}"></span>${esc(ing.n)}</div>${ing.mix?mixInfo(ing):''}${ok?'':'<div class="note">Non utilisé avec cette technique</div>'}${ing.mix?`<button class="link" data-a="toing" data-id="${esc(id)}">Employer comme ingrédient</button>`:''}<button class="x" data-a="unbase" data-k="${kind}" aria-label="Retirer ${esc(ing.n)}">×</button>`;
    return `<div class="base${ok?'':' off'}"><div class="lab">${lab}</div>${inner}</div>`;
  }
  const hint=allowed.length===0?'Sans '+lab.toLowerCase()+' ici':(need?(kind==='solv'?'Requis, dans les Bases':'Graisse, cire ou huile requise'):'Facultatif');
  return `<div class="base"><div class="lab">${lab}</div><div class="val muted small">${hint}</div></div>`;
}
function renderBench(){
  const T=TECH[S.tech];const load=load_();const over=load>CAP;
  const chips=S.items.length?`<div class="chips">${S.items.map(it=>{const g=G(it.id);return `<div class="chip"><span class="dot" style="background:${g.col}"></span><div class="nm">${esc(g.n)}<small>${DOSE_LABEL[it.dose]}${g.mix?', '+esc(g.res.form.toLowerCase()):''}</small>${g.mix?mixInfo(g):''}${g.liquidMix&&solvAllowed(T,g)?`<button class="link" data-a="tosolv" data-id="${esc(it.id)}">Employer comme liquide</button>`:''}</div><div class="dose"><button data-a="dose" data-id="${it.id}" data-d="-1" aria-label="Moins de ${esc(g.n)}" ${it.dose<=1?'disabled':''}>−</button><span class="pips" aria-hidden="true">${[1,2,3].map(n=>`<i class="${n<=it.dose?'f':''}"></i>`).join('')}</span><button data-a="dose" data-id="${it.id}" data-d="1" aria-label="Plus de ${esc(g.n)}" ${it.dose>=3?'disabled':''}>+</button></div><button class="x" data-a="remove" data-id="${it.id}" aria-label="Retirer ${esc(g.n)}">×</button></div>`}).join('')}</div>`:`<div class="empty">L'établi est vide. Touche un bocal de l'étagère pour le poser ici${isWide()?', ou glisse-le sur le récipient':''}.</div>`;
  const heat=T.heat?`<div class="seg" role="group" aria-label="Chaleur">${T.heat.map((l,i)=>`<button data-a="feu" data-n="${i}" aria-pressed="${S.feu===i}"><span class="fl">${FLAME.repeat(i+1)}</span><span>${l}</span></button>`).join('')}</div><p class="fin-desc">${T.heatTip[S.feu]}</p>`:`<p class="muted small">Cette technique se pratique sans feu.</p>`;
  const fins=`<div class="fins" role="group" aria-label="Finitions">${Object.keys(FIN).map(k=>`<button data-a="fin" data-k="${k}" aria-pressed="${S.fin[k]}">${FIN[k].n}</button>`).join('')}</div><p class="fin-desc">${esc(FIN[S.finHint].d)}</p>`;
  $('#bench').innerHTML=`<div class="pad">
  <h2 class="h">Technique</h2>
  <div class="tech" role="group" aria-label="Technique">${TECH_ORDER.map(t=>`<button data-a="tech" data-id="${t}" aria-pressed="${S.tech===t}">${toolSVG(t)}<span>${TECH[t].n}</span></button>`).join('')}</div>
  <p class="tech-desc"><strong>${T.tool}.</strong> ${T.d}</p>
  <div class="vessel-wrap${S.brewing?' brewing':''}" data-drop style="--mix:${previewColor()}">${toolSVG(S.tech,true)}<div class="bubbles"><i></i><i></i><i></i><i></i></div></div>
  <div class="gauge${over?' over':''}"><span>Charge ${load} sur ${CAP}${over?' : ça déborde':''}</span><span class="bar"><i style="width:${Math.min(100,load/CAP*100)}%"></i></span></div>
  <h2 class="h">Sur l'établi</h2>${chips}
  <div class="bases" style="margin-top:8px">${baseSlot('solv')}${baseSlot('adj')}</div>
  <h2 class="h">Chaleur</h2>${heat}
  <h2 class="h">Finitions</h2>${fins}
  ${S.msg?`<div class="msg" role="alert">${esc(S.msg)}</div>`:''}
  <div class="actions"><button class="btn primary" id="brew" data-a="brew" ${S.brewing?'disabled':''}>Préparer</button><button class="btn" data-a="clear" ${S.items.length||S.solvent||S.adj?'':'disabled'}>Vider l'établi</button></div>
  </div>`;
}
function refreshBenchLight(){ // évite de perdre le défilement
  const p=$('#bench'),y=p.scrollTop;renderBench();p.scrollTop=y;
}

/* ---------- fiche ---------- */
function compHTML(r){
  let cs=(r.comps&&r.comps.length)?r.comps:(r.ingr||[]).filter(i=>BY[i.id]).map(i=>({id:i.id,w:DF[i.dose]*Math.max(.05,i.pct/100)}));
  cs=cs.filter(c=>BY[c.id]).sort((a,b)=>b.w-a.w);
  if(!cs.length)return '';
  const W=cs.reduce((s,c)=>s+c.w,0)||1;
  return `<p style="margin-top:10px"><b>Composition</b> (substances d'origine)</p><ul class="plain">${cs.map(c=>`<li>${esc(BY[c.id].n)}, environ ${Math.max(1,Math.round(c.w/W*100))} %${(BY[c.id].danger||(BY[c.id].tags||[]).includes('lent'))?' <em>(dangereuse)</em>':''}</li>`).join('')}</ul>`;
}
const TIER=['Faible','Modérée','Forte','Intense'];
function ficheHTML(r,o){
  o=o||{};const T=TYPES[r.type];const e=o.entry;
  const altTxt=r.alt.length?`<p class="f-meta">Peut aussi servir comme ${joinFr(r.alt.map(a=>TYPES[a].n.toLowerCase()))}.</p>`:'';
  const dots=`<span class="qdots" aria-hidden="true">${[1,2,3,4,5].map(n=>`<i class="${n<=r.quality.score?'f':''}"></i>`).join('')}</span>`;
  const showTaste=r.ext!=='externe'&&r.formShape!=='cone';
  const fxRows=r.fx.length?r.fx.slice(0,8).map(f=>{const d=FX[f.id];return `<div class="fx-row k-${d.k}"><div class="top2"><b>${esc(d.n)}</b><span class="tier">${TIER[f.tier]}</span></div><div class="track"><i style="width:${Math.round(f.pct*100)}%"></i></div><p>${esc(d.t[f.tier])}.</p></div>`}).join(''):'<p class="muted">Aucune vertu notable.</p>';
  const dg=`<div class="danger-g" role="img" aria-label="Dangerosité : ${r.danger.label}">${[0,1,2,3,4].map(i=>`<i class="${i<=r.danger.level?'f'+i:''}"></i>`).join('')}</div><p><span class="dlabel">${r.danger.label}</span></p>${r.sides.length?`<ul class="plain">${r.sides.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`:''}`;
  const notes=(r.notes.length||r.hint||r.tips.length)?`<div class="f-sec"><h3>Remarques</h3>${r.hint?`<p class="call">${esc(r.hint)}</p>`:''}${r.notes.length?`<ul class="plain">${r.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`:''}${r.tips.length?`<p style="margin-top:8px">À savoir pour la prochaine fois :</p><ul class="plain">${r.tips.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`:''}</div>`:'';
  const recipe=r.ingr.map(i=>`${DOSE_LABEL[i.dose].toLowerCase()} de ${lcFirst(i.n)}`);
  const rcp=r.recipe;const T2=TECH[rcp.tech];
  const details=`<details${o.mode==='stock'||o.mode==='entry'?' open':''}><summary>Recette et déroulé</summary>
    <p style="margin-top:8px">${esc(ucFirst(T2.n.toLowerCase()))}${T2.heat?', '+esc(T2.heat[rcp.feu].toLowerCase()):''}${r.base.solvent?', dans '+esc(lcFirst(r.base.solvent)):''}${r.base.adj?', avec '+esc(lcFirst(r.base.adj)):''}.</p>
    <div class="yield">${r.ingr.map(i=>`<span>${esc(i.n)}, ${DOSE_LABEL[i.dose].toLowerCase()}${i.t&&TYPES[i.t]?' ('+esc(TYPES[i.t].n.toLowerCase())+', '+esc((i.dg||'').toLowerCase())+')':''}</span><span>${i.pct} %</span><span class="track"><i style="width:${Math.min(100,i.pct)}%"></i></span>`).join('')}</div>
    ${compHTML(r)}
    <ul class="plain">${r.journal.map(j=>`<li>${esc(j)}</li>`).join('')}</ul></details>`;
  let foot;
  if(o.mode==='entry'){
    foot=`<div class="savebar"><label for="en-name">Nom dans le grimoire</label><input type="text" class="field" id="en-name" data-i="ename" data-id="${esc(e.id)}" value="${esc(e.name)}" maxlength="80"><label for="en-note">Notes</label><textarea id="en-note" data-i="enote" data-id="${esc(e.id)}" placeholder="Où tu l'as testé, ce que ça a donné…">${esc(e.note||'')}</textarea><div class="row"><button class="btn primary" data-a="redo" data-id="${esc(e.id)}">Refaire sur l'établi</button><button class="btn" data-a="stockEntry" data-id="${esc(e.id)}">Transvaser dans un contenant</button><button class="btn ${S.confirmDel===e.id?'danger':''}" data-a="del" data-id="${esc(e.id)}">${S.confirmDel===e.id?'Confirmer la suppression':'Supprimer'}</button></div></div>`;
  }else if(o.mode==='stock'){
    foot=`<div class="savebar"><label for="st-name">Nom du contenant</label><input type="text" class="field" id="st-name" data-i="cname" data-id="${esc(e.id)}" value="${esc(e.name)}" maxlength="80"><label for="st-note">Notes</label><textarea id="st-note" data-i="cnote" data-id="${esc(e.id)}" placeholder="À quoi elle doit servir, ce qu'il faut y ajouter…">${esc(e.note||'')}</textarea><div class="row"><button class="btn primary" data-a="useStock" data-id="${esc(e.id)}">Poser sur l'établi</button><button class="btn ${S.confirmStock===e.id?'danger':''}" data-a="delStock" data-id="${esc(e.id)}">${S.confirmStock===e.id?'Confirmer : vider':'Vider le contenant'}</button><button class="btn" data-a="closeDlg">Fermer</button></div></div>`;
  }else{
    const both=S.savedId&&S.stockedId;
    foot=`<div class="savebar">${both?'':`<label for="sv-name">Nom de la préparation</label><input type="text" class="field" id="sv-name" value="${esc(r.name)}" maxlength="80">`}<div class="row">${S.savedId?'':`<button class="btn primary" data-a="save">Inscrire au grimoire</button>`}${S.stockedId?'':`<button class="btn${S.savedId?' primary':''}" data-a="stock">Transvaser dans un contenant</button>`}</div>${S.savedId?`<p class="saved-ok">Inscrit au grimoire. <button class="btn small" data-a="openBook" data-id="${esc(S.savedId)}">Voir</button></p>`:''}${S.stockedId?`<p class="saved-ok">Transvasé dans un contenant. <button class="btn small" data-a="gotoStock">Voir la réserve</button></p>`:''}</div>`;
  }
  return `<article class="fiche${o.fresh?' fresh':''}">
    <header class="f-head">${sealSVG(r.type,64)}<div><h2 class="f-title">${esc(e?e.name:r.name)}</h2><p class="f-type" style="color:${T.ink?'var(--paper-ink)':shadeCss(T.c)}">${T.n}</p><p class="f-meta">${esc(r.form)}, qualité ${r.quality.label.toLowerCase()} ${dots}</p></div></header>
    <p class="f-blurb">${esc(T.b)}</p>${altTxt}
    <div class="f-body">${vesselSVG(r)}<dl class="kv"><dt>Aspect</dt><dd>${esc(r.sensory.aspect)}</dd><dt>Odeur</dt><dd>${esc(r.sensory.smell)}</dd>${showTaste?`<dt>Goût</dt><dd>${esc(r.sensory.taste)}</dd>`:''}<dt>Conservation</dt><dd>${esc(r.shelf.label)}</dd></dl></div>
    <div class="f-sec"><h3>Vertus</h3><div class="fx">${fxRows}</div></div>
    <div class="f-sec"><h3>Dangers</h3>${dg}</div>
    <div class="f-sec"><h3>Emploi</h3><p>${esc(r.dose)}</p></div>
    ${notes}${details}${foot}</article>`;
}
function shadeCss(hex){return shade(hex,-.28)}
function accidentHTML(a){
  return `<article class="fiche accident fresh"><h2 class="f-title">${esc(a.title)}</h2><p class="f-blurb">${esc(a.text)}</p><p class="call">${esc(a.tip)}</p><div class="savebar"><div class="row"><button class="btn primary" data-a="view" data-v="bench">Retourner à l'établi</button></div></div></article>`;
}
function renderResult(){
  const r=S.result;
  let h;
  if(!r)h=`<div class="empty-res">${toolSVG('distiller',true)}<h2>Rien n'a encore été préparé</h2><p>Pose des ingrédients sur l'établi, choisis une technique, puis prépare. La fiche de la mixture s'affiche ici.</p></div>`;
  else if(r.accident)h=accidentHTML(r.accident);
  else h=ficheHTML(r,{fresh:S.fresh});
  $('#result').innerHTML=`<div class="result-pad">${h}</div>`;
}

/* ---------- grimoire ---------- */
function filteredBook(){
  let a=S.book.slice();
  if(S.filter!=='all')a=a.filter(e=>e.res.type===S.filter);
  const q=S.q.trim().toLowerCase();
  if(q)a=a.filter(e=>(e.name+' '+e.res.form+' '+TYPES[e.res.type].n+' '+e.res.ingr.map(i=>i.n).join(' ')+' '+(e.note||'')).toLowerCase().includes(q));
  if(S.sort==='recent')a.sort((x,y)=>y.t-x.t);
  else if(S.sort==='nom')a.sort((x,y)=>x.name.localeCompare(y.name,'fr'));
  else if(S.sort==='type')a.sort((x,y)=>TYPES[x.res.type].n.localeCompare(TYPES[y.res.type].n,'fr')||y.t-x.t);
  else if(S.sort==='qualite')a.sort((x,y)=>y.res.quality.score-x.res.quality.score||y.t-x.t);
  return a;
}
function entriesHTML(){
  const a=filteredBook();
  if(!S.book.length)return `<div class="empty">Le grimoire est vide. Prépare une mixture, puis inscris-la depuis sa fiche.</div>`;
  if(!a.length)return `<div class="empty">Aucune préparation ne correspond à cette recherche.</div>`;
  const fmt=t=>new Date(t).toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
  return a.map(e=>{const top=e.res.fx.slice(0,2).map(f=>FX[f.id].n.toLowerCase());return `<button class="entry" data-a="open" data-id="${esc(e.id)}" aria-current="${S.openId===e.id}">${sealSVG(e.res.type,40)}<div><div class="en">${esc(e.name)}</div><div class="em">${esc(TYPES[e.res.type].n)}, ${esc(e.res.form.toLowerCase())}${top.length?', '+esc(top.join(' et ')):''}</div><div class="em">Inscrit le ${fmt(e.t)}</div></div></button>`}).join('');
}
function renderEntries(){const el=$('#entries');if(el)el.innerHTML=entriesHTML()}
function renderBook(){
  const counts={};S.book.forEach(e=>counts[e.res.type]=(counts[e.res.type]||0)+1);
  const filt=`<div class="filters" role="group" aria-label="Filtrer par type"><button data-a="filter" data-id="all" aria-pressed="${S.filter==='all'}">Tous (${S.book.length})</button>${Object.keys(counts).map(t=>`<button data-a="filter" data-id="${t}" aria-pressed="${S.filter===t}">${TYPES[t].n} (${counts[t]})</button>`).join('')}</div>`;
  const ent=S.openId&&S.book.find(e=>e.id===S.openId);
  const detail=ent?`<button class="btn small back" data-a="closeEntry">Retour à la liste</button>${ficheHTML(ent.res,{mode:'entry',entry:ent})}`:`<div class="empty-res">${toolSVG('macerer',true)}<h2>Choisis une préparation</h2><p>Sa fiche complète s'affichera ici, avec tes notes.</p></div>`;
  $('#book').innerHTML=`<div class="book${ent?' open':''}"><div class="book-list">
    ${LS.ok?'':'<p class="warn">Ce navigateur refuse l\'enregistrement local : le grimoire disparaîtra à la fermeture de la page. Pense à l\'exporter.</p>'}
    <div class="toolbar"><input type="search" placeholder="Chercher dans le grimoire" aria-label="Chercher dans le grimoire" data-i="q" value="${esc(S.q)}"><select data-i="sort" aria-label="Trier"><option value="recent"${S.sort==='recent'?' selected':''}>Les plus récentes</option><option value="nom"${S.sort==='nom'?' selected':''}>Par nom</option><option value="type"${S.sort==='type'?' selected':''}>Par type</option><option value="qualite"${S.sort==='qualite'?' selected':''}>Par qualité</option></select>${filt}</div>
    <div class="entries" id="entries">${entriesHTML()}</div>
    <div class="book-tools"><button class="btn small" data-a="export">Exporter</button><button class="btn small" data-a="import">Importer</button></div></div>
    <div class="book-detail">${detail}</div></div>`;
}

/* ---------- dialogues ---------- */
function openDlg(html,cls){const d=$('#dlg');d.innerHTML=`<div class="dlg${cls?' '+cls:''}">${html}</div>`;if(!d.open)d.showModal();d.setAttribute('tabindex','-1');d.focus({preventScroll:true});d.scrollTop=0;if(d.firstElementChild)d.firstElementChild.scrollTop=0}
function closeDlg(){const d=$('#dlg');if(d.open)d.close()}
function infoDlg(id){
  const g=G(id);
  openDlg(`<div class="jarbig">${jarSVG(g)}</div><h2>${esc(g.n)}</h2><p>${esc(g.d)}</p><ul>${ingHints(g).map(h=>`<li>${esc(h)}</li>`).join('')}</ul><div class="actions"><button class="btn primary" data-a="add" data-id="${g.id}" data-close="1">Poser sur l'établi</button><button class="btn" data-a="closeDlg">Fermer</button></div>`);
}
function stockDlg(id){const c=S.reserve.find(x=>x.id===id);if(!c)return;openDlg(ficheHTML(c.res,{mode:'stock',entry:c}),'fichewrap')}
function helpDlg(){
  openDlg(`<h2>L'Officine des Simples</h2><p>Un atelier d'apothicaire, sans magie : chaque substance a ses vertus, ses dangers, et une façon de la travailler.</p><ul><li>Choisis des bocaux sur l'étagère. Le <b>i</b> sur chaque bocal dit comment il se comporte.</li><li>Sur l'établi, prends une technique, un liquide ou un liant, règle la chaleur et les doses.</li><li>Prépare : la fiche donne le <b>type</b> (poison, baume, soin, sédatif…), les vertus, les dangers et la conservation.</li><li>Inscris tes réussites au grimoire, elles y restent.</li><li><b>Transvase</b> une mixture dans un contenant : elle rejoint la <b>Réserve</b> de l'étagère et devient un ingrédient. Tu peux ainsi la mélanger à d'autres, ou enchaîner les étapes : une poudre au mortier, un liquide distillé, puis la poudre décoctée dans le distillat.</li></ul><p class="muted">Rien ne t'est dit sur les bonnes recettes. Une plante qui ne donne rien à l'eau peut tout donner à l'alcool ; le feu détruit ce que le froid préserve ; certains mélanges se contrarient, d'autres se renforcent, et quelques-uns tournent mal.</p><div class="actions"><button class="btn primary" data-a="closeDlg">Ouvrir l'officine</button></div>`);
}
function exportDlg(){
  openDlg(`<h2>Exporter le grimoire</h2><p class="small muted">Copie ce texte et garde-le : il permet de retrouver tes préparations sur un autre appareil.</p><textarea id="exp" readonly aria-label="Contenu du grimoire">${esc(JSON.stringify({officine:2,book:S.book,reserve:S.reserve}))}</textarea><div class="actions"><button class="btn primary" data-a="copyExp">Copier</button><button class="btn" data-a="closeDlg">Fermer</button></div>`);
}
function importDlg(){
  openDlg(`<h2>Importer un grimoire</h2><p class="small muted">Colle ici un texte exporté. Les préparations s'ajoutent à celles que tu as déjà.</p><textarea id="imp" aria-label="Texte à importer"></textarea><p class="msg" id="imp-msg" style="display:none"></p><div class="actions"><button class="btn primary" data-a="doImport">Importer</button><button class="btn" data-a="closeDlg">Fermer</button></div>`);
}

/* ---------- actions ---------- */
function addIng(id){
  const g=G(id);if(!g)return;
  S.msg='';
  if(g.cat==='bases'){
    if(g.role==='solvant')S.solvent=S.solvent===id?null:id;else S.adj=S.adj===id?null:id;
    toast(((g.role==='solvant'?S.solvent:S.adj)===id?'Posé : ':'Retiré : ')+g.n);
  }else if(S.solvent===id){S.solvent=null;toast('Retiré : '+g.n)}
  else{
    const it=S.items.find(i=>i.id===id);
    if(!it&&g.liquidMix&&!S.solvent&&solvAllowed(TECH[S.tech],g)){S.solvent=id;toast('Posé comme liquide : '+g.n)}
    else if(it){if(it.dose>=3){toast('Dose maximale pour '+lcFirst(g.n));return}it.dose++;toast(g.n+' : '+DOSE_LABEL[it.dose].toLowerCase())}
    else{if(S.items.length>=MAX_ITEMS){toast('L\'établi est plein ('+MAX_ITEMS+' ingrédients)');return}S.items.push({id,dose:1});toast('Posé : '+g.n)}
  }
  persist();renderShelf();refreshBenchLight();renderChrome();
  const v=$('.vessel-wrap');if(v&&!reduced()){v.classList.remove('plop');void v.offsetWidth;v.classList.add('plop')}
}
function brew(){
  if(S.brewing)return;
  const r=prepare(rc(),S.mixes);
  if(r.error){S.msg=r.error;refreshBenchLight();return}
  S.msg='';S.brewing=true;refreshBenchLight();
  setTimeout(()=>{
    S.brewing=false;S.result=r;S.savedId=null;S.stockedId=null;S.fresh=true;
    refreshBenchLight();renderResult();
    live(r.accident?r.accident.title:('Préparation terminée : '+r.name+', '+TYPES[r.type].n));
    if(!isWide())setView('result');else $('#result').scrollTop=0;
    S.fresh=false;
  },reduced()?0:1400);
}
function saveResult(){
  const r=S.result;if(!r||!r.ok)return;
  const inp=$('#sv-name');const name=(inp&&inp.value.trim())||r.name;
  const e={id:'e'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),t:Date.now(),name:name.slice(0,80),note:'',res:r};
  S.book.push(e);S.savedId=e.id;persistBook();
  renderResult();renderChrome();toast('Inscrit au grimoire');
}
function loadRecipe(rec){
  S.items=rec.items.filter(i=>G(i.id)&&G(i.id).cat!=='bases').map(i=>({id:i.id,dose:clamp(i.dose|0,1,3)})).slice(0,MAX_ITEMS);
  S.solvent=rec.solvent&&G(rec.solvent)?rec.solvent:null;S.adj=rec.adj&&G(rec.adj)?rec.adj:null;
  if(TECH[rec.tech])S.tech=rec.tech;S.feu=[0,1,2].includes(rec.feu)?rec.feu:1;
  S.fin={filtrer:!!(rec.fin&&rec.fin.filtrer),reduire:!!(rec.fin&&rec.fin.reduire),sceller:!!(rec.fin&&rec.fin.sceller)};
  const lost=rec.items.length-S.items.length+((rec.solvent&&!S.solvent)?1:0);
  S.msg='';persist();renderShelf();renderBench();
  return lost;
}
const A={
  view:b=>setView(b.dataset.v),
  cat:b=>{S.cat=b.dataset.id;renderShelf();$('#shelf').scrollTop=0},
  add:(b)=>{addIng(b.dataset.id);if(b.dataset.close)closeDlg()},
  info:b=>infoDlg(b.dataset.id),
  dose:b=>{const it=S.items.find(i=>i.id===b.dataset.id);if(!it)return;it.dose=clamp(it.dose+(+b.dataset.d),1,3);persist();renderShelf();refreshBenchLight()},
  remove:b=>{S.items=S.items.filter(i=>i.id!==b.dataset.id);persist();renderShelf();refreshBenchLight();renderChrome()},
  unbase:b=>{if(b.dataset.k==='solv')S.solvent=null;else S.adj=null;persist();renderShelf();refreshBenchLight()},
  clear:()=>{S.items=[];S.solvent=null;S.adj=null;S.msg='';persist();renderShelf();refreshBenchLight();renderChrome()},
  tech:b=>{S.tech=b.dataset.id;S.msg='';if(!TECH[S.tech].heat)S.feu=1;persist();renderShelf();refreshBenchLight()},
  feu:b=>{S.feu=+b.dataset.n;persist();refreshBenchLight()},
  fin:b=>{const k=b.dataset.k;S.fin[k]=!S.fin[k];S.finHint=k;persist();refreshBenchLight()},
  brew:brew,
  save:saveResult,
  open:b=>{S.openId=b.dataset.id;S.confirmDel=null;renderBook();const d=$('.book-detail');if(d)d.scrollTop=0;if(!isWide())$('#book').scrollTop=0},
  openBook:b=>{S.openId=b.dataset.id;setView('book')},
  closeEntry:()=>{S.openId=null;renderBook()},
  filter:b=>{S.filter=b.dataset.id;renderBook()},
  redo:b=>{const e=S.book.find(x=>x.id===b.dataset.id);if(!e)return;const lost=loadRecipe(e.res.recipe);setView('bench');toast(lost>0?'Recette reposée, mais '+lost+' contenant'+(lost>1?'s':'')+' n\'existe'+(lost>1?'nt':'')+' plus':'Recette remise sur l\'établi')},
  del:b=>{
    const id=b.dataset.id;
    if(S.confirmDel===id){S.book=S.book.filter(e=>e.id!==id);S.openId=null;S.confirmDel=null;persistBook();renderBook();renderChrome();toast('Préparation supprimée')}
    else{S.confirmDel=id;renderBook();setTimeout(()=>{if(S.confirmDel===id){S.confirmDel=null;if(S.view==='book')renderBook()}},3500)}
  },
  stock:()=>{
    const r=S.result;if(!r||!r.ok)return;
    if(S.reserve.length>=MAX_STOCK){toast('La réserve est pleine ('+MAX_STOCK+' contenants)');return}
    const inp=$('#sv-name');const name=(inp&&inp.value.trim())||r.name;
    const c={id:'m:'+uid(),t:Date.now(),name:name.slice(0,80),note:'',res:r};
    S.reserve.push(c);rebuildMixes();persistReserve();S.stockedId=c.id;
    S.items=[];S.solvent=null;S.adj=null;S.msg='';persist();
    renderShelf();renderBench();renderResult();renderChrome();
    toast('Transvasé : '+c.name+'. L\'établi est libre.');
  },
  stockEntry:b=>{
    const e=S.book.find(x=>x.id===b.dataset.id);if(!e)return;
    if(S.reserve.length>=MAX_STOCK){toast('La réserve est pleine ('+MAX_STOCK+' contenants)');return}
    const c={id:'m:'+uid(),t:Date.now(),name:e.name,note:'',res:JSON.parse(JSON.stringify(e.res))};
    S.reserve.push(c);rebuildMixes();persistReserve();renderShelf();renderChrome();
    toast('Transvasé : '+c.name+' (voir la Réserve de l\'étagère)');
  },
  gotoStock:()=>{S.cat='reserve';renderShelf();setView('shelf');$('#shelf').scrollTop=0},
  stockinfo:b=>stockDlg(b.dataset.id),
  useStock:b=>{addIng(b.dataset.id);closeDlg()},
  delStock:b=>{
    const id=b.dataset.id;
    if(S.confirmStock===id){
      S.reserve=S.reserve.filter(c=>c.id!==id);S.confirmStock=null;S.items=S.items.filter(i=>i.id!==id);if(S.solvent===id)S.solvent=null;
      rebuildMixes();persistReserve();persist();closeDlg();renderShelf();refreshBenchLight();renderChrome();toast('Contenant vidé');
    }else{S.confirmStock=id;stockDlg(id);setTimeout(()=>{if(S.confirmStock===id){S.confirmStock=null;if($('#dlg').open&&$('#st-name'))stockDlg(id)}},3500)}
  },
  tosolv:b=>{const id=b.dataset.id;S.items=S.items.filter(i=>i.id!==id);S.solvent=id;persist();renderShelf();refreshBenchLight();renderChrome()},
  toing:b=>{const id=b.dataset.id;if(S.items.length>=MAX_ITEMS){toast('L\'établi est plein ('+MAX_ITEMS+' ingrédients)');return}S.solvent=null;S.items.push({id,dose:1});persist();renderShelf();refreshBenchLight();renderChrome()},
  closeDlg:closeDlg,
  help:helpDlg,
  export:exportDlg,
  import:importDlg,
  copyExp:()=>{const t=$('#exp');t.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}if(!ok&&navigator.clipboard)navigator.clipboard.writeText(t.value).then(()=>toast('Copié'),()=>toast('Sélectionne le texte et copie-le'));else toast(ok?'Copié':'Sélectionne le texte et copie-le')},
  doImport:()=>{
    const msg=$('#imp-msg');const show=t=>{msg.style.display='block';msg.textContent=t};
    try{
      const d=JSON.parse($('#imp').value.trim());
      const list=Array.isArray(d)?d:d.book;if(!Array.isArray(list))throw 0;
      let n=0;const have=new Set(S.book.map(e=>e.id));
      list.forEach(e=>{if(validEntry(e)&&!have.has(e.id)){S.book.push({id:e.id,t:+e.t||Date.now(),name:String(e.name).slice(0,80),note:String(e.note||'').slice(0,2000),res:e.res});have.add(e.id);n++}});
      let m=0;const haveR=new Set(S.reserve.map(c=>c.id));
      (Array.isArray(d.reserve)?d.reserve:[]).forEach(c=>{if(validStock(c)&&!haveR.has(c.id)&&S.reserve.length<MAX_STOCK){S.reserve.push({id:c.id,t:+c.t||Date.now(),name:String(c.name).slice(0,80),note:String(c.note||'').slice(0,2000),res:c.res});haveR.add(c.id);m++}});
      if(m){rebuildMixes();persistReserve();renderShelf()}
      persistBook();renderBook();renderChrome();
      if(n||m){closeDlg();toast((n?n+' préparation'+(n>1?'s':''):'')+(n&&m?' et ':'')+(m?m+' contenant'+(m>1?'s':''):'')+' importé'+((n+m)>1?'s':''))}else show('Rien de nouveau à importer.');
    }catch(err){show('Ce texte n\'est pas un grimoire valide.')}
  },
  theme:()=>{
    const cur=document.documentElement.dataset.theme||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
    const nx=cur==='dark'?'light':'dark';document.documentElement.dataset.theme=nx;LS.set('officine.theme',nx);
  }
};
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-a]');
  if(b&&A[b.dataset.a]){if(e.target.closest('.info')&&b.dataset.a==='add')return;A[b.dataset.a](b,e);return}
  if(e.target===$('#dlg'))closeDlg();
});
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.slot')){e.preventDefault();addIng(e.target.dataset.id)}
});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.i==='q'){S.q=t.value;renderEntries()}
});
document.addEventListener('change',e=>{
  const t=e.target,k=t.dataset.i;if(!k)return;
  if(k==='sort'){S.sort=t.value;renderEntries()}
  else if(k==='cname'||k==='cnote'){
    const c=S.reserve.find(x=>x.id===t.dataset.id);if(!c)return;
    if(k==='cname'){c.name=(t.value.trim()||c.res.name).slice(0,80);t.value=c.name}else c.note=t.value.slice(0,2000);
    rebuildMixes();persistReserve();renderShelf();refreshBenchLight();
    const ft=$('#dlg .f-title');if(ft&&k==='cname')ft.textContent=c.name;
  }
  else if(k==='ename'||k==='enote'){
    const en=S.book.find(x=>x.id===t.dataset.id);if(!en)return;
    if(k==='ename'){en.name=(t.value.trim()||en.res.name).slice(0,80);t.value=en.name}
    else en.note=t.value.slice(0,2000);
    persistBook();renderEntries();
    const ft=$('.book-detail .f-title');if(ft&&k==='ename')ft.textContent=en.name;
  }
});
/* glisser-déposer */
document.addEventListener('dragstart',e=>{const s=e.target.closest&&e.target.closest('.slot');if(!s)return;e.dataTransfer.setData('text/plain',s.dataset.id);e.dataTransfer.effectAllowed='copy'});
document.addEventListener('dragover',e=>{if(e.target.closest&&e.target.closest('[data-drop]')){e.preventDefault();e.dataTransfer.dropEffect='copy'}});
document.addEventListener('drop',e=>{const z=e.target.closest&&e.target.closest('[data-drop]');if(!z)return;e.preventDefault();const id=e.dataTransfer.getData('text/plain');if(G(id))addIng(id)});

/* ---------- démarrage ---------- */
function init(){
  $('#brand-logo').innerHTML=LOGO;
  const th=LS.get('officine.theme');if(th==='dark'||th==='light')document.documentElement.dataset.theme=th;
  load();
  renderShelf();renderBench();renderResult();renderChrome();
  setView(isWide()?'bench':'shelf');
  if(!LS.get('officine.seen')){LS.set('officine.seen','1');helpDlg()}
}
init();
