/* ============ MOTEUR ============ */
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lcFirst=s=>s.charAt(0).toLowerCase()+s.slice(1);
const ucFirst=s=>s.charAt(0).toUpperCase()+s.slice(1);
const de=n=>(/^[aeiouyhâàéèêëîïôöûüœ]/i.test(n)?"d'":"de ")+lcFirst(n);
const joinFr=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' ou '+a[a.length-1];
const hex2rgb=h=>{h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
const rgb2hex=([r,g,b])=>'#'+[r,g,b].map(v=>clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('');
function mixHex(list){ // [{c,w}]
  let W=0,r=0,g=0,b=0; list.forEach(o=>{const [R,G,B]=hex2rgb(o.c);r+=R*o.w;g+=G*o.w;b+=B*o.w;W+=o.w});
  return W?rgb2hex([r/W,g/W,b/W]):'#888888';
}
function hsl(h){const [r,g,b]=hex2rgb(h).map(v=>v/255);const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let H=0,S=0;const L=(mx+mn)/2;
  if(mx!==mn){const d=mx-mn;S=L>.5?d/(2-mx-mn):d/(mx+mn);H=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;H*=60}return [H,S,L]}
function colorName(hex){
  const [H,S,L]=hsl(hex);
  if(L<.13)return 'noir d\'encre';
  if(S<.18){return L>.82?'incolore':L>.6?'gris clair':L>.3?'gris':'gris sombre'}
  let n; if(H<12||H>=345)n='rouge';else if(H<38)n=L<.4?'brun':'orangé';else if(H<62)n=L<.4?'brun doré':'jaune';else if(H<80)n='vert-jaune';else if(H<165)n='vert';else if(H<200)n='vert d\'eau';else if(H<255)n='bleu';else if(H<300)n='violet';else n='rose';
  if(L<.28)n+=' sombre';else if(L>.72)n+=' pâle';
  return n;
}

const ANT=[
  ['calmant','stimulant',1,0,'Le calmant et le stimulant se contrarient : leurs effets s\'annulent en partie.'],
  ['soporifique','stimulant',1,0,'Le stimulant retient le sommeil que la mixture voudrait donner.'],
  ['astringent','purgatif',.9,0,'L\'astringent retient ce que le purgatif voudrait chasser.'],
  ['antitoxique','toxique',.9,0,'L\'antitoxique neutralise une partie du poison.'],
  ['antitoxique','paralysant',.5,0,''],
  ['febrifuge','echauffant',.8,0,'Le fébrifuge rafraîchit ce que l\'échauffant réchauffe.'],
  ['lucidite','delirant',.8,0,'La clarté d\'esprit contrarie le délire.'],
  ['emollient','irritant',.6,1,'L\'émollient adoucit l\'irritation.']
];
const SYN=[
  ['antiseptique','cicatrisant',1.2,'Des plaies propres cicatrisent mieux : l\'antiseptique et le cicatrisant se renforcent.'],
  ['calmant','antalgique',1.2,'Le calme aide la douleur à céder : synergie.'],
  ['pectoral','emollient',1.15,'Gorge et poumons profitent doublement de l\'émollient.'],
  ['tonique','digestif',1.1,'Un estomac qui travaille nourrit mieux : le tonique et le digestif se renforcent.'],
  ['soporifique','calmant',1.15,'Calme et sommeil se prêtent main forte.']
];
const CALC_KEEP={astringent:.5,colorant:.6,conservateur:.4,antiseptique:.3};
const SHELF={'Infusion':2,'Décoction':3,'Macérat':4,'Sirop':365,'Teinture':730,'Élixir':500,'Vinaigre médicinal':365,'Oxymel':365,'Huile médicinale':180,'Liniment':180,'Onguent':75,'Cérat':200,'Emplâtre':200,'Poudre':365,'Cendre':3650,'Eau distillée':21,'Esprit':1000,'Vinaigre distillé':365,'Fumigation':365,'Vin médicinal':240,'Hydromel médicinal':365,'Électuaire':120,'Pâte':60,'Savon':365,'Mélange':30};
const POSO={'Infusion':'Une tasse, deux fois par jour.','Décoction':'Un verre, matin et soir.','Macérat':'Un verre par jour.','Sirop':'Une cuillerée à soupe, trois fois par jour.','Teinture':'Vingt gouttes dans un peu d\'eau, deux fois par jour.','Élixir':'Une petite cuillerée, matin et soir.','Vinaigre médicinal':'Une cuillerée dans un verre d\'eau, ou en lotion.','Oxymel':'Une cuillerée à soupe, trois fois par jour.','Huile médicinale':'En friction, matin et soir.','Liniment':'En friction douce, matin et soir.','Onguent':'Étaler en couche mince, deux fois par jour.','Cérat':'Appliquer en couche épaisse et recouvrir d\'un linge.','Emplâtre':'Appliquer tiède sur la zone, renouveler chaque jour.','Poudre':'Une pincée dans de l\'eau ou du miel, ou saupoudrée.','Cendre':'Usage externe, ou comme base pour d\'autres préparations.','Eau distillée':'Une cuillerée, ou quelques gouttes sur un linge.','Esprit':'Dix gouttes dans de l\'eau.','Vinaigre distillé':'Quelques gouttes dans l\'eau, ou en lotion.','Fumigation':'Brûler sur braises dans une pièce fermée, puis aérer.','Vin médicinal':'Un petit verre au repas.','Hydromel médicinal':'Un petit verre au repas.','Électuaire':'Une noix, matin et soir.','Pâte':'Appliquer ou avaler en petite quantité.','Savon':'Mousser à l\'eau chaude.','Mélange':'À doser avec prudence : c\'est un assemblage.'};
const TYPE_POSO={
  poison:'Ne jamais ingérer. Manipuler avec des gants et ranger sous clé.',
  caustique:'Gants et lunettes. À conserver dans le verre.',
  incendiaire:'Tenir loin de toute flamme. À manier à l\'air libre.',
  colorant:'À délayer dans un peu d\'eau ou d\'huile pour peindre ou teindre.',
  parfum:'Quelques gouttes sur un linge, ou brûlé sur braises.',
  conservateur:'Frotter ou saumurer la denrée à conserver.',
  antidote:'À prendre aussitôt après l\'ingestion du poison.',
  purgatif:'Une petite dose à jeun, en buvant beaucoup d\'eau.',
  desinfectant:'À passer sur les plaies propres ou sur les surfaces.',
  bourbe:'Rien à en faire. Jeter ou recommencer.'
};

function formOf(rc,items,sid,aid){
  const t=rc.tech,s=sid,a=aid;
  const has=p=>items.some(i=>i.ing.p===p);
  const F=(n,liquid,ext,shape)=>({n,liquid,ext,shape});
  const fatMix=items.find(i=>i.ing.mix&&!i.ing.liquidMix&&['Onguent','Cérat','Emplâtre'].includes(i.ing.res.form));
  switch(t){
    case 'broyer': if(a==='miel')return F('Électuaire',false,'interne','pot'); if(a==='graisse_oie')return F('Onguent',false,'externe','pot'); if(a==='cire_brune')return F('Cérat',false,'externe','pot'); if(a==='glycerine')return F('Pâte',false,'mixte','pot'); return F('Poudre',false,'mixte','sachet');
    case 'melanger': {
      const liqs=items.filter(i=>i.ing.liquidMix);
      if(s||liqs.length){
        if(!s&&liqs.length&&items.every(i=>i.ing.liquidMix)&&new Set(liqs.map(l=>l.ing.res.form)).size===1){const d=liqs.slice().sort((x,y)=>y.dose-x.dose)[0];return F(d.ing.res.form,true,d.ing.res.ext||'mixte','fiole')}
        return F('Mélange',true,'mixte','fiole');
      }
      if(s==='lait_chaux'&&a==='graisse_oie')return F('Savon',false,'externe','pot');
      if(a==='cire_brune')return F('Cérat',false,'externe','pot');
      if(a==='graisse_oie')return F('Onguent',false,'externe','pot');
      if(fatMix)return F(fatMix.ing.res.form,false,'externe','pot');
      if(a==='miel')return F('Électuaire',false,'interne','pot');
      if(a==='glycerine')return F('Pâte',false,'mixte','pot');
      return F('Poudre',false,'mixte','sachet');
    }
    case 'infuser': return F('Infusion',true,'interne','fiole');
    case 'decocter': if(s==='lait_chaux'&&a==='graisse_oie')return F('Savon',false,'externe','pot'); if(a==='miel')return F('Sirop',true,'interne','fiole'); return F('Décoction',true,'mixte','fiole');
    case 'macerer': if(s==='alcool')return a==='miel'?F('Élixir',true,'interne','fiole'):F('Teinture',true,'mixte','fiole'); if(s==='vinaigre')return a==='miel'?F('Oxymel',true,'interne','fiole'):F('Vinaigre médicinal',true,'mixte','fiole'); if(s==='huile')return F('Huile médicinale',true,'externe','fiole'); return F('Macérat',true,'interne','fiole');
    case 'distiller': if(s==='alcool')return F('Esprit',true,'interne','fiole'); if(s==='vinaigre')return F('Vinaigre distillé',true,'mixte','fiole'); return F('Eau distillée',true,'mixte','fiole');
    case 'calciner': return F('Cendre',false,'mixte','sachet');
    case 'petrir': if(s==='lait_chaux'&&a==='graisse_oie')return F('Savon',false,'externe','pot'); if(a==='cire_brune')return has('resine')?F('Emplâtre',false,'externe','pot'):F('Cérat',false,'externe','pot'); if(a==='graisse_oie')return F('Onguent',false,'externe','pot'); if(fatMix)return F(fatMix.ing.res.form,false,'externe','pot'); return F('Liniment',true,'externe','fiole');
    case 'fumiger': return F('Fumigation',false,'inhale','cone');
    case 'fermenter': return a==='miel'?F('Hydromel médicinal',true,'interne','fiole'):F('Vin médicinal',true,'interne','fiole');
  }
}

function extractionOf(ing,c){
  if(ing.mix){
    if(c.tech==='melanger')return {e:.95,mfx:null,suspended:false};
    if(ing.liquidMix)return extractionOf({p:'tendre',s:'dis_'+ing.kind,v:ing.v||0,tags:ing.tags||[],id:ing.id},c);
    const rs=(ing.comps||[]).map(k=>({w:k.w,r:extractionOf(k.ing,c)}));
    const W=rs.reduce((s,o)=>s+o.w,0)||1;
    const We=rs.reduce((s,o)=>s+o.w*o.r.e,0);
    const mf=rs.some(o=>o.r.mfx)?(k=>We?rs.reduce((s,o)=>s+o.w*o.r.e*(o.r.mfx?o.r.mfx(k):1),0)/We:1):null;
    return {e:clamp(We/W,0,1.25),mfx:mf,suspended:rs.some(o=>o.r.suspended)};
  }
  const P=ing.p,S=SOL[ing.s],tags=ing.tags||[],feu=c.feu,sk=c.sk;
  let e=0,mfx=null,suspended=false;
  const organic=['tendre','dur','resine','animal'].includes(P);
  const inertish=['inerte','sel','metal'].includes(P);
  switch(c.tech){
    case 'broyer':
      e={tendre:.9,dur:.75,resine:.6,sel:1,metal:.6,inerte:1,animal:.9}[P]; break;
    case 'melanger':
      e={tendre:.5,dur:.4,resine:.3,sel:.9,metal:.6,inerte:.95,animal:.6}[P];
      if(P==='inerte'&&c.fin.filtrer)e=.08;
      break;
    case 'infuser': case 'decocter': case 'macerer': case 'fermenter': {
      const tbl=PF[c.tech==='fermenter'?'macerer':c.tech];
      const aff=c.tech==='fermenter'?(S.eau+S.alcool)/2:S[sk];
      e=tbl[P]*aff;
      if(c.tech==='infuser')e*=[.7,1,1.05][feu];
      if(c.tech==='decocter')e*=[.85,1,1.1][feu];
      if(ing.v){ if(c.tech==='infuser')e*=[1.05,1,.7][feu]; if(c.tech==='decocter')e*=[.8,.55,.3][feu]; }
      if(c.tech==='macerer'&&sk==='alcool'&&['alcal','resine','ess'].includes(ing.s))e*=1.1;
      if(c.tech==='fermenter')e*=.9;
      if(P==='inerte'){e=c.fin.filtrer?.08:.5;suspended=true}
      break; }
    case 'distiller':
      if(tags.includes('mercure'))e=.9;
      else if(ing.v)e=.7*ing.v*S[sk]*[.9,1,.85][feu]; else e=0;
      break;
    case 'calciner':
      if(tags.includes('fumeux')||tags.includes('mercure')){e=.3}
      else if(organic){e=.7;mfx=k=>CALC_KEEP[k]||0}
      else{e=1;mfx=k=>k==='combustible'?0:k==='corrosif'?1.25:k==='irritant'?1.2:1}
      e*=[.7,1,1][feu]; break;
    case 'petrir':
      if(inertish)e=P==='metal'?.7:.85;
      else e=Math.max(PF.macerer[P]*S.huile,.35*(P==='dur'?.8:1));
      e*=[1,1,.7][feu];
      if(ing.v)e*=[1.05,1,.7][feu];
      break;
    case 'fumiger':
      if(tags.includes('fumeux'))e=1;
      else if(inertish)e=.1;
      else{e=(.2+.45*ing.v)*[1,1.1,.75][feu]; if(feu===2&&ing.v)e*=1-.15*ing.v}
      mfx=k=>(k==='colorant'||k==='combustible')?0:1;
      break;
  }
  return {e:clamp(e,0,1.25),mfx,suspended};
}
function fxOf(ing,c){
  if(ing.id==='moisissure_bleue'){
    if(c.tech==='fermenter'||(c.tech==='macerer'&&c.sk==='eau'))return {antiseptique:3,conservateur:1,toxique:.4};
    if(c.tech==='decocter'||c.tech==='calciner')return {conservateur:.4};
  }
  return ing.fx;
}
function bestWay(ing){
  if(ing.p==='inerte')return 'À broyer, pétrir dans un corps gras, ou laisser en suspension sans filtrer.';
  if(ing.p==='metal')return 'Au vinaigre, ou à broyer.';
  const S=SOL[ing.s];
  const o=[[S.eau,'à l\'eau (infusion ou décoction)'],[S.alcool,'à l\'alcool (macération)'],[S.huile,'à l\'huile'],[S.vinaigre,'au vinaigre']].sort((a,b)=>b[0]-a[0]);
  let t='Mieux '+o[0][1]; if(ing.v>=1)t+=', sans trop chauffer'; return t+'.';
}
function whyPoor(ing,c,e){
  const P=ing.p;
  if(c.tech==='distiller')return 'rien ne s\'en évapore : il reste dans la cornue';
  if(c.tech==='calciner')return 'réduit en cendre, ses vertus sont perdues';
  if(c.tech==='fumiger')return 'trop lourd : sa fumée porte peu';
  if(c.tech==='broyer')return 'difficile à réduire en poudre fine';
  if(c.tech==='petrir')return 'les principes de cette substance ne se fixent pas dans le gras';
  if(P==='inerte')return c.fin.filtrer?'retenu par le filtre':'insoluble : elle n\'a rien cédé au liquide';
  const S=SOL[ing.s];
  if(S[c.sk]!==undefined&&S[c.sk]<.3)return 'se dissout mal dans '+({eau:'l\'eau',alcool:'l\'alcool',huile:'l\'huile',vinaigre:'le vinaigre'})[c.sk];
  if(ing.v&&c.feu===2)return 'ses essences se sont envolées';
  return 'trop dur pour cette technique';
}

function typeScores(raw,form,special){
  const g=k=>raw[k]||0;
  const vals=Object.values(raw);const top=vals.length?Math.max(...vals):0;
  const dom=k=>g(k)>=.6*top;
  const sc={};
  const P=g('toxique')+.9*g('paralysant');
  sc.poison=P>=1.6?P*1.4:0;
  sc.caustique=g('corrosif')>=1.5?g('corrosif')*1.5:0;
  sc.incendiaire=g('combustible')>=3.2?g('combustible')*1.0:0;
  sc.antidote=g('antitoxique')>=2?g('antitoxique')*1.3:0;
  sc.purgatif=g('purgatif')>=2?g('purgatif')*1.1:0;
  const sed=g('calmant')+g('soporifique');sc.sedatif=sed>=1.8?sed*.9:0;
  const stu=g('euphorisant')+g('delirant');sc.stupefiant=stu>=1.8?stu:0;
  const ton=g('tonique')+g('stimulant')+.3*g('echauffant');sc.tonique=ton>=1.8?ton*.9:0;
  const heal=g('febrifuge')+g('pectoral')+g('digestif')+g('antalgique')+g('cicatrisant')+.5*g('antiseptique')+.5*g('astringent')+g('diuretique')+.6*g('tonique');
  const topical=g('cicatrisant')+g('emollient')+g('antiseptique')+g('antalgique')+g('astringent')+.5*g('echauffant');
  const ext=form.ext;
  sc.soin=heal>=1.8?heal*.85*(ext==='interne'?1:ext==='mixte'?.9:ext==='externe'?.5:.4):0;
  sc.baume=(ext==='externe'||ext==='mixte')&&topical>=1.8?topical*1.05*(ext==='externe'?1.2:1):0;
  sc.parfum=g('parfumant')>=2.4&&dom('parfumant')?g('parfumant')*1.1:0;
  sc.colorant=g('colorant')>=2.4&&dom('colorant')?g('colorant')*1.1:0;
  sc.conservateur=g('conservateur')>=2.4&&dom('conservateur')?g('conservateur')*1.05:0;
  sc.detergent=g('detersif')>=2?g('detersif')*1.2:0;
  sc.desinfectant=g('antiseptique')>=2.4&&dom('antiseptique')?g('antiseptique'):0;
  if(special&&special.type)sc[special.type]=99;
  return sc;
}
function fmtDays(d){
  if(d>=3000)return 'indéfinie';
  if(d<14)return Math.max(1,Math.round(d))+' jour'+(Math.round(d)>1?'s':'');
  if(d<60)return Math.round(d/7)+' semaines';
  if(d<730)return Math.round(d/30)+' mois';
  return Math.round(d/365)+' ans';
}
const ACCIDENTS={
  vapeurs:{title:'Vapeurs d\'argent-vif',text:'Le métal s\'évapore dans l\'air chaud. Vous reculez en toussant, la vue trouble : ces vapeurs sont mortelles à respirer. Tout est perdu et l\'atelier est à aérer pour plusieurs jours.',tip:'N\'expose jamais l\'argent-vif à un feu vif : mêle-le à froid, en broyage ou en macération au vinaigre.'},
  alcool:{title:'Les vapeurs d\'alcool s\'enflamment',text:'Le feu est trop vif : les vapeurs s\'échappent du joint de l\'alambic et s\'embrasent. Vous étouffez les flammes sous un linge mouillé ; la cornue est fêlée, la préparation perdue.',tip:'Distille l\'alcool à chauffe douce ou régulière.'},
  flambee:{title:'Flambée',text:'Trop de matières inflammables sur un feu trop vif : tout prend d\'un seul coup. Sourcils roussis, mixture réduite en fumée.',tip:'Baisse le feu, ou allège les doses de ce qui brûle (soufre, salpêtre, charbon, résines).'}
};

function prepare(rc,MIX){
  MIX=MIX||{};const lk=id=>BY[id]||MIX[id];
  const T=TECH[rc.tech];
  const fin=rc.fin||{};
  const items=rc.items.map(i=>({ing:lk(i.id),dose:i.dose}));
  if(!items.length)return {error:'L\'établi est vide. Prends quelques ingrédients sur l\'étagère.'};
  const solv0=rc.solvent?lk(rc.solvent):null, adj0=rc.adj?lk(rc.adj):null;
  if(items.some(i=>!i.ing)||(rc.solvent&&!solv0))return {error:'Un contenant posé sur l\'établi n\'existe plus. Retire-le.'};
  const solvOK=!!(solv0&&(solv0.mix?(solv0.liquidMix&&T.solv.some(id=>BY[id].kind===solv0.kind)):T.solv.includes(solv0.id))), adjOK=!!(adj0&&!adj0.mix&&T.adj.includes(adj0.id));
  const solv=solvOK?solv0:null, adj=adjOK?adj0:null;
  const KID={eau:'eau_pluie',alcool:'alcool',vinaigre:'vinaigre',huile:'huile'};
  const sid=solv?(solv.mix?KID[solv.kind]:solv.id):null, aid=adj?adj.id:null;
  const names=ids=>joinFr(ids.map(id=>lcFirst(BY[id].n)));
  const needSolv=['infuser','decocter','macerer','distiller','fermenter'].includes(rc.tech);
  if(needSolv&&!solvOK)return {error:solv0?`${T.n} ne se fait pas avec ${lcFirst(solv0.n)}. Prends plutôt : ${names(T.solv)}.`:`${T.n} demande un liquide. Prends-en un dans l'étagère des bases : ${names(T.solv)}.`};
  if(rc.tech==='petrir'){
    const fat=aid==='graisse_oie'||aid==='cire_brune'||sid==='huile'||items.some(i=>i.ing.mix&&!i.ing.liquidMix&&['Onguent','Cérat','Emplâtre'].includes(i.ing.res.form));
    if(!fat)return {error:'Un onguent demande un corps gras : graisse d\'oie, cire brune ou huile d\'olive.'};
  }
  if(rc.tech==='fermenter'){
    const sugar=items.some(i=>(i.ing.tags||[]).includes('sucre'))||(aid==='miel');
    if(!sugar)return {error:'Rien à faire fermenter : sans sucre (miel, sang-de-bouleau), la mixture tourne.'};
  }
  const hasTag=t=>items.some(i=>(i.ing.tags||[]).includes(t));
  const has=id=>items.some(i=>i.ing.id===id||(i.ing.comps&&i.ing.comps.some(k=>k.ing.id===id)));
  // accidents
  const acc=k=>({accident:Object.assign({id:k},ACCIDENTS[k]),recipe:JSON.parse(JSON.stringify(rc))});
  if(hasTag('mercure')&&(rc.tech==='calciner'||rc.tech==='fumiger'||(rc.tech==='distiller'&&rc.feu===2)))return acc('vapeurs');
  if(rc.tech==='distiller'&&sid==='alcool'&&rc.feu===2)return acc('alcool');
  const fuel=items.reduce((s,i)=>s+i.dose*((i.ing.fx.combustible)||0),0);
  if((rc.tech==='calciner'||rc.tech==='fumiger')&&rc.feu===2&&fuel>=6)return acc('flambee');

  const form=formOf(rc,items,sid,aid);
  const sk=solvOK?solv.kind:null;
  const ctx={tech:rc.tech,feu:T.heat?rc.feu:1,sk,fin:{filtrer:!!fin.filtrer&&form.liquid}};
  const feu=ctx.feu;
  const heated=(rc.tech==='decocter'&&feu>=1)||(rc.tech==='infuser'&&feu>=1)||rc.tech==='calciner'||rc.tech==='distiller'||rc.tech==='fumiger'||(rc.tech==='petrir'&&feu===2);
  const load=items.reduce((s,i)=>s+i.dose,0);
  const over=load>CAP, sat=over?CAP/load:1;
  const ex=items.map(i=>extractionOf(i.ing,ctx));
  const raw={};const add=(k,v)=>{if(v)raw[k]=(raw[k]||0)+v};
  const weights=[];
  items.forEach((it,idx)=>{
    const {ing,dose}=it,r=ex[idx];
    const w=DF[dose]*r.e*sat;weights.push(w);
    const fx=fxOf(ing,ctx);
    for(const k in fx){
      let m=r.mfx?r.mfx(k):1;
      if(ing.labile&&ing.labile.includes(k)&&heated)m*=.2;
      if(m)add(k,fx[k]*w*m);
    }
    if(dose===1&&ing.micro)for(const k in ing.micro)add(k,ing.micro[k]*r.e*.9*sat);
    if(dose===3&&ing.over)for(const k in ing.over)add(k,ing.over[k]*r.e*sat);
  });
  const journal=[];
  journal.push(`Technique : ${T.n.toLowerCase()} (${T.tool.toLowerCase()})${T.heat?', chaleur : '+T.heat[feu].toLowerCase():', sans feu'}.`);
  if(solv)journal.push(`Liquide : ${lcFirst(solv.n)}.`);
  if(adj)journal.push(`Liant : ${lcFirst(adj.n)}.`);
  if(solv0&&!solvOK)journal.push(`${solv0.n} n'est pas employé avec cette technique et reste sur l'étagère.`);
  if(adj0&&!adjOK)journal.push(`${adj0.n} n'est pas employé avec cette technique et reste sur l'étagère.`);
  const bw=.9;
  if(solvOK){const sf=solv.mix?(rc.tech==='distiller'?.9*clamp((solv.v||0)/2,.1,1):1.2):bw*(rc.tech==='distiller'?.6:1);for(const k in solv.fx)add(k,solv.fx[k]*sf)}
  if(adjOK)for(const k in adj.fx)add(k,adj.fx[k]*bw*(['broyer','fumiger'].includes(rc.tech)?.5:1));
  const notes=[];const tips=[];
  let special=null,conflicts=0;
  // réactions particulières
  if(has('vitriol_vert')&&hasTag('tanin')&&['infuser','decocter','macerer','melanger'].includes(rc.tech)){
    add('colorant',3.4);raw.corrosif=(raw.corrosif||0)*.5;raw.astringent=(raw.astringent||0)*.6;
    special={type:'colorant',name:'Encre noire',color:'#15141c',note:'Le fer du vitriol et le tanin de la cornouille noircissent ensemble : vous obtenez une encre.'};
  }
  if(rc.tech==='broyer'&&has('argent_vif')&&has('soufre_jaune')){
    add('colorant',3.6);
    special={type:'colorant',name:'Vermillon',color:'#c8321f',note:'Argent-vif et soufre, broyés ensemble, donnent un rouge éclatant : c\'est un cinabre. Il reste toxique.'};
  }
  if(has('fleur_cuivre')&&sid==='vinaigre'&&['decocter','macerer'].includes(rc.tech)){
    add('colorant',3);add('irritant',.8);
    special={type:'colorant',name:'Vert-de-gris',color:'#2e9c74',note:'Le vinaigre attaque le cuivre et donne un beau vert, mais un vert qui empoisonne.'};
  }
  if(sid==='lait_chaux'&&aid==='graisse_oie'&&['decocter','petrir','melanger'].includes(rc.tech)){
    add('detersif',3.6);raw.corrosif=Math.max(0,(raw.corrosif||0)-1.2);
    special={type:'detergent',name:'Savon',color:'#e9e1cc',note:'La chaux et la graisse se marient : c\'est un savon.'};
  }
  if(rc.tech==='fermenter'){
    let sug=items.filter(i=>(i.ing.tags||[]).includes('sucre')).reduce((s,i)=>s+DF[i.dose],0)+(aid==='miel'?1.6:0);
    const al=clamp(sug*.9,0,3.6);
    add('euphorisant',al*.9);add('conservateur',al*.5);add('antiseptique',al*.25);
    journal.push('Les sucres travaillent pendant des semaines et deviennent alcool.');
  }
  if(has('moisissure_bleue')&&(rc.tech==='fermenter'||(rc.tech==='macerer'&&sk==='eau')))notes.push('Sous l\'eau, la moisissure bleue devient un puissant antiseptique.');
  if(has('ambre_gris')&&(raw.parfumant||0)>0){raw.parfumant*=1.2;notes.push('L\'ambre gris fixe les parfums : ils tiendront longtemps.');}
  if(has('fleur_cuivre')&&rc.tech==='fumiger')notes.push('La fumée file vers le vert : la flamme est teintée par le cuivre.');
  if(hasTag('mercure')&&rc.tech==='distiller')notes.push('L\'argent-vif a passé dans le distillat, qui est donc toxique.');
  if(has('soufre_jaune')&&rc.tech==='fumiger'){raw.antiseptique=(raw.antiseptique||0)*1.5;raw.irritant=(raw.irritant||0)*2;notes.push('La fumée de soufre assainit l\'air, mais elle prend à la gorge : aérez.');}
  if(items.some(i=>i.ing.labile)&&heated&&items.some(i=>i.ing.labile&&i.ing.labile.includes('irritant')))notes.push('La chaleur a détruit le mordant de l\'ortie : elle n\'irrite presque plus.');
  // antagonismes
  ANT.forEach(([a,b,r,one,txt])=>{
    const A=raw[a]||0,B=raw[b]||0;if(!A||!B)return;
    let m;
    if(one){m=Math.min(B,A*r);raw[b]=B-m}
    else{m=Math.min(A,B)*r;raw[a]=A-m;raw[b]=B-m}
    if(m>=.8&&txt){notes.push(txt);if(!one)conflicts++}
  });
  SYN.forEach(([a,b,mu,txt])=>{
    if((raw[a]||0)>=1&&(raw[b]||0)>=1){raw[a]*=mu;raw[b]*=mu;notes.push(txt)}
  });
  // finitions
  if(fin.filtrer&&!form.liquid)journal.push('Filtrer n\'a pas de sens ici : la préparation n\'est pas liquide.');
  if(fin.reduire&&!form.liquid)journal.push('Réduire n\'a pas de sens ici : la préparation n\'est pas liquide.');
  if(form.liquid&&fin.filtrer){raw.irritant=(raw.irritant||0)*.6;journal.push('Passé au filtre de lin : la mixture est plus nette, les poudres sont restées dans le tissu.')}
  if(form.liquid&&fin.reduire){for(const k in raw)raw[k]*=(k==='parfumant'||k==='lucidite')?.8:1.25;journal.push('Réduit à feu doux : plus concentré, les parfums se sont un peu envolés.')}
  if(fin.sceller)journal.push('Flacon scellé à la cire.');
  // une mixture dangereuse garde au moins des traces de sa nature, sauf si la technique la détruit ou si un antidote agit
  if(rc.tech!=='distiller'&&rc.tech!=='calciner'){
    const DK=['toxique','paralysant','corrosif','irritant','purgatif','delirant'];
    items.forEach((it,i)=>{
      if(!it.ing.mix||weights[i]<=.02)return;
      DK.forEach(k=>{
        if((it.ing.fx[k]||0)<.75||(raw[k]||0)>=.5)return;
        if((k==='toxique'||k==='paralysant')&&(raw.antitoxique||0)>=1.5)return;
        if(k==='irritant'&&(raw.emollient||0)>=2)return;
        raw[k]=.5;
        const msg=`${it.ing.n} garde une trace de sa nature : ${FX[k].n.toLowerCase()}.`;
        if(!notes.includes(msg))notes.push(msg);
      });
    });
  }
  Object.keys(raw).forEach(k=>{if(raw[k]<.45)delete raw[k]});
  // ingrédients : rendement
  const ingr=items.map((it,i)=>Object.assign({id:it.ing.id,n:it.ing.n,dose:it.dose,pct:Math.round(clamp(ex[i].e,0,1)*100),col:it.ing.col},it.ing.mix?{t:it.ing.res.type,dg:it.ing.res.danger.label}:{}));
  const wasted=[];
  items.forEach((it,i)=>{
    const p=ingr[i].pct;
    if(p<15){wasted.push(it.ing.n);journal.push(`${it.ing.n} : presque rien n'a passé (${it.ing.mix?'cette mixture ne s\'y prête pas':whyPoor(it.ing,{tech:rc.tech,sk,feu,fin:ctx.fin},ex[i].e)}).`);tips.push(`${it.ing.n} : ${it.ing.mix?'essaie plutôt de la mélanger telle quelle, ou de la traiter autrement.':bestWay(it.ing)}`)}
    else if(p<40)journal.push(`${it.ing.n} : rendement faible, ${p} %.`);
    else journal.push(`${it.ing.n} : rendement ${p} %.`);
  });
  if(over)journal.push(`Le récipient déborde (${load}/${CAP}) : une part se perd et chaque vertu s'en trouve diluée.`);
  // effets
  const fxList=Object.keys(raw).map(k=>({id:k,raw:+raw[k].toFixed(2),tier:raw[k]<1.2?0:raw[k]<2.6?1:raw[k]<4.4?2:3,pct:clamp(raw[k]/7,.04,1)})).sort((a,b)=>b.raw-a.raw);
  // type
  const sc=typeScores(raw,form,special);
  const ranked=Object.entries(sc).filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]);
  const topRaw=fxList.length?fxList[0].raw:0;
  let main=(ranked.length&&topRaw>=1.2)?ranked[0][0]:'bourbe';
  const alt=main==='bourbe'?[]:ranked.slice(1).filter(e=>e[1]>=ranked[0][1]*.7&&e[0]!=='conservateur').slice(0,2).map(e=>e[0]);
  // danger
  const g=k=>raw[k]||0;
  let D=g('toxique')+.85*g('paralysant')+.7*g('corrosif')+.35*g('delirant')+.3*g('purgatif')+.25*g('irritant');
  if(hasTag('lent')&&g('toxique')>0)D*=1.35;
  let dl=D<.7?0:D<2?1:D<4?2:D<6.5?3:4;
  if(dl<1&&(g('toxique')>=.45||g('paralysant')>=.45||g('corrosif')>=.45))dl=1;
  const danger={level:dl,label:['Inoffensif','Prudence','Dangereux','Très dangereux','Mortel'][dl],score:+D.toFixed(2)};
  // effets secondaires
  const sides=[];
  items.forEach((it,i)=>{if(it.ing.side&&weights[i]>=(it.ing.mix?.25:.9))it.ing.side.forEach(s=>{if(!sides.includes(s))sides.push(s)})});
  if(main!=='poison'&&g('toxique')>=.8)sides.push('Nausées et malaise passager');
  if(main!=='purgatif'&&g('purgatif')>=1.4)sides.push('Coliques');
  if(g('irritant')>=1.2&&form.ext!=='externe')sides.push('Gorge et estomac irrités');
  if(g('irritant')>=1.2&&form.ext==='externe')sides.push('Peau rougie à l\'application');
  if(main!=='stupefiant'&&g('delirant')>=1)sides.push('Vue brouillée');
  if(sid==='alcool'&&form.ext==='externe')sides.push('Brûle sur plaie ouverte');
  // couleur
  let color;
  if(special)color=special.color;
  else if(rc.tech==='distiller')color='#dbe8ee';
  else{
    const list=[];
    items.forEach((it,i)=>{const wt=Math.max(.04,weights[i])*(it.ing.p==='inerte'&&form.liquid?.8:1);list.push({c:it.ing.col,w:wt})});
    if(form.liquid){const base=solv?solv.col:'#d3ddd9';list.push({c:base,w:1.6});if(adj)list.push({c:adj.col,w:.5})}
    else if(form.shape==='pot'){const base=adj?adj.col:'#eee2c3';list.push({c:base,w:2.5})}
    else if(adj)list.push({c:adj.col,w:.6});
    color=mixHex(list);
  }
  // texture
  const susp=items.reduce((s,it,i)=>s+(it.ing.p==='inerte'&&form.liquid&&!ctx.fin.filtrer?weights[i]:0),0);
  let texture;
  if(form.liquid){
    const vis=aid==='miel'?'sirupeux':aid==='glycerine'?'onctueux':sid==='huile'?'huileux':'fluide';
    const cl=(rc.tech==='distiller'||ctx.fin.filtrer||susp<.3)?'limpide':susp<1?'légèrement trouble':'trouble, avec un dépôt';
    texture=`${vis}, ${cl}`;
  }else if(form.shape==='pot'){texture=form.n==='Cérat'||form.n==='Emplâtre'?(form.n==='Emplâtre'?'collant et poisseux':'ferme et cireux'):form.n==='Électuaire'?'pâte épaisse et collante':form.n==='Savon'?'pâte grasse et douce':'onctueuse';}
  else if(form.shape==='cone')texture='mélange sec à brûler';
  else texture=rc.tech==='calciner'?'cendre fine':(items.some(i=>['dur','resine'].includes(i.ing.p))?'poudre grossière et fibreuse':'poudre fine');
  // odeur et goût
  const senso=(key,noun)=>{
    const acc={};
    const ent=ing=>(ing.sens&&ing.sens[key])?ing.sens[key].map(([w,s])=>[w,Math.min(3,s)]):(ing[key]?[ing[key]]:[]);
    items.forEach((it,i)=>{ent(it.ing).forEach(([w,it_])=>{if(it_>0&&w!=='aucune')acc[w]=(acc[w]||0)+it_*Math.min(1.3,weights[i]+.15)})});
    [solv,adj].forEach(b=>{if(b)ent(b).forEach(([w,it_])=>{if(it_>0&&w!=='aucune')acc[w]=(acc[w]||0)+it_*.7})});
    if(key==='taste'&&aid==='miel'){if(acc['amer'])acc['amer']*=.5;acc['doux']=(acc['doux']||0)+1.2}
    if(rc.tech==='distiller'){for(const k in acc)acc[k]*=.5}
    return Object.entries(acc).filter(e=>e[1]>=.7).sort((a,b)=>b[1]-a[1]).slice(0,2);
  };
  const tArr=senso('taste'),sArr=senso('smell');
  const txtS=(arr,none)=>arr.length?(arr[0][1]>=3.2?'très ':'')+arr.map(e=>e[0]).join(' et '):none;
  const sensory={
    aspect:`${colorName(color)}, ${texture}`,
    smell:sArr.length?txtS(sArr):'à peine perceptible',
    taste:tArr.length?txtS(tArr):'sans goût marqué'
  };
  // conservation
  let days=SHELF[form.n]||100;
  days*=1+.3*g('conservateur');
  if(aid==='miel')days*=1.3;
  if(fin.sceller)days*=3;
  if(has('ambre_gris'))days*=1.1;
  const shelf={days:Math.round(days),label:fmtDays(days)};
  // qualité
  const avgE=ex.reduce((s,r)=>s+Math.min(1,r.e),0)/ex.length;
  let q=3;
  if(avgE>=.7)q+=.8;else if(avgE<.35)q-=1.2;else if(avgE<.5)q-=.6;
  q-=Math.min(1.5,wasted.length*.5);
  if(over)q-=.8;
  if(feu===2&&T.heat&&rc.tech!=='calciner'&&items.some(i=>i.ing.v))q-=.6;
  if(rc.tech==='petrir'&&feu===2)q-=1;
  q-=Math.min(1,conflicts*.5);
  if(form.liquid&&ctx.fin.filtrer)q+=.6;
  if(rc.tech==='distiller')q+=.8;
  if(fin.sceller)q+=.2;
  const top2=fxList.slice(0,2).reduce((s,e)=>s+e.raw,0),tot=fxList.reduce((s,e)=>s+e.raw,0)||1;
  if(top2/tot>=.65)q+=.5;
  if(fxList.filter(e=>e.raw>1).length>=5)q-=.5;
  if(main==='bourbe')q=Math.min(q,1.6);
  const qs=clamp(Math.round(q),1,5);
  const quality={score:qs,label:['','Grossière','Médiocre','Honnête','Fine','Magistrale'][qs]};
  // posologie
  let dose=TYPE_POSO[main]||POSO[form.n]||'Selon l\'usage.';
  if(['soin','tonique','sedatif','stupefiant','baume'].includes(main)){dose=POSO[form.n]||dose;if(dl>=2)dose+=' Réduire la dose de moitié : la mixture est risquée.'}
  if(main==='bourbe'&&dl>=1)dose='Rien de bon à en tirer, et pas inoffensive : ne pas l\'ingérer.';
  if(main==='colorant'&&special&&special.name==='Encre noire')dose='Prête à écrire ; sèche en noircissant.';
  if(main==='colorant'&&special&&special.name==='Vermillon')dose='À délayer pour peindre. Toxique : ne pas lécher le pinceau.';
  // nom
  const mains=items.map((it,i)=>({n:it.ing.n,w:weights[i]})).sort((a,b)=>b.w-a.w).filter(o=>o.w>.05).slice(0,2);
  const nm=mains.length?mains.map((o,i)=>i===0?de(o.n):de(o.n)).join(' et '):'';
  let noun=form.n;
  if(special)noun=null;
  else if(rc.tech==='melanger')noun='Mélange';
  else if(main==='baume')noun=form.liquid&&form.ext!=='externe'?'Lotion':'Baume';
  else if(main==='poison')noun=form.liquid?'Breuvage':form.n==='Poudre'||form.n==='Cendre'?'Poudre':form.n==='Fumigation'?'Fumées':form.n;
  else if(main==='bourbe')noun='Mixture';
  else if(main==='incendiaire')noun=form.n==='Poudre'?'Poudre':'Mixture';
  let name;
  if(special)name=special.name;
  else{
    name=`${noun} ${nm}`;
    const first=mains[0]&&mains[0].n.toLowerCase();
    if(mains.length===1&&first&&first.split(' ')[0]===noun.toLowerCase())name=ucFirst(mains[0].n);
    if(main==='colorant'&&form.n!=='Poudre')name=`Teinture ${nm}`;
  }
  // composition (pour réutiliser la mixture comme ingrédient)
  const cm={};
  items.forEach((it,i)=>{
    const wg=weights[i];if(wg<=.03)return;
    if(it.ing.mix){const tot=(it.ing.comps||[]).reduce((s,k)=>s+k.w,0)||1;(it.ing.comps||[]).forEach(k=>{cm[k.ing.id]=(cm[k.ing.id]||0)+k.w/tot*wg})}
    else cm[it.ing.id]=(cm[it.ing.id]||0)+wg;
  });
  const comps=Object.keys(cm).map(id=>({id,w:+cm[id].toFixed(3)}));
  const Wc=comps.reduce((s,c)=>s+c.w,0)||1;
  const va=comps.reduce((s,c)=>s+c.w*(BY[c.id].v||0),0)/Wc;
  let vol=va>=1.4?2:va>=.5?1:0;if(form.liquid&&sid==='alcool')vol=Math.min(2,vol+1);
  let solvKind=null;
  if(form.liquid){const dm=items.filter(i=>i.ing.liquidMix).sort((a,b)=>b.dose-a.dose)[0];solvKind=sk||(dm?dm.ing.kind:'eau')}
  return {
    ok:true,comps,solvKind,v:vol,sens:{taste:tArr.map(e=>[e[0],+e[1].toFixed(2)]),smell:sArr.map(e=>[e[0],+e[1].toFixed(2)])},
    name,form:form.n,formShape:form.shape,liquid:form.liquid,ext:form.ext,
    type:main,alt,fx:fxList,danger,quality,shelf,dose,sides,notes,tips:tips.slice(0,4),
    color,colorName:colorName(color),sensory,special:special?{name:special.name,note:special.note}:null,
    ingr,base:{solvent:solvOK?solv.n:null,adj:adjOK?adj.n:null},
    load,cap:CAP,journal:journal.concat(special?[special.note]:[]),
    hint:main==='bourbe'?(wasted.length?'Une partie des ingrédients n\'a presque rien cédé.':'Trop faible : augmente les doses, ou change de technique.'):'',
    recipe:JSON.parse(JSON.stringify(rc))
  };
}

/* Une mixture rangée dans un contenant devient un ingrédient à part entière */
function mixIng(id,name,res){
  const liquid=!!res.liquid;
  let cl=res.comps;
  if(!cl||!cl.length)cl=(res.ingr||[]).filter(i=>BY[i.id]).map(i=>({id:i.id,w:DF[i.dose]*Math.max(.05,i.pct/100)}));
  const comps=cl.filter(c=>BY[c.id]).map(c=>({ing:BY[c.id],w:c.w}));
  const W=comps.reduce((s,c)=>s+c.w,0)||1;
  const fx={};res.fx.forEach(f=>{if(FX[f.id])fx[f.id]=+(f.raw/1.2).toFixed(3)});
  const tags=[...new Set(comps.reduce((a,c)=>a.concat(c.ing.tags||[]),[]))];
  const kind=res.solvKind||(res.recipe&&BY[res.recipe.solvent]?BY[res.recipe.solvent].kind:null)||'eau';
  let v=res.v;
  if(v==null){const va=comps.reduce((s,c)=>s+c.w*(c.ing.v||0),0)/W;v=va>=1.4?2:va>=.5?1:0;if(liquid&&kind==='alcool')v=Math.min(2,v+1)}
  let sens=res.sens;
  if(!sens){
    const acc={taste:{},smell:{}};
    comps.forEach(c=>['taste','smell'].forEach(k=>{const t=c.ing[k]||[];if(t[1]>0&&t[0]!=='aucune')acc[k][t[0]]=(acc[k][t[0]]||0)+t[1]*Math.min(1.3,c.w/W*3)}));
    sens={};['taste','smell'].forEach(k=>{sens[k]=Object.entries(acc[k]).sort((a,b)=>b[1]-a[1]).slice(0,2)});
  }
  const sh=res.formShape;
  const ing={id,n:name,cat:'reserve',mix:true,res,liquidMix:liquid,kind,fx,comps,tags,col:res.color,v,sens,
    side:res.sides||[],danger:res.danger&&res.danger.level>=3?1:0,
    jar:sh==='fiole'?'bouteille':sh==='pot'?'pot':'bocal',sh:sh==='fiole'?'liquide':sh==='pot'?'pate':sh==='sachet'?'poudre':'pepites',
    d:res.form+', '+(TYPES[res.type]?TYPES[res.type].n.toLowerCase():'')};
  if(liquid){ing.p='tendre';ing.s='dis_'+kind}
  return ing;
}
