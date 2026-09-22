const P=(items,o)=>prepare(Object.assign({items:items.map(([id,dose])=>({id,dose})),solvent:null,adj:null,tech:'infuser',feu:1,fin:{}},o),MIXES);
const MIXES={};
const stock=(id,name,r)=>{MIXES[id]=mixIng(id,name,r);return MIXES[id]};
const show=(t,r)=>{ if(r.error)return console.log(t,'ERR',r.error); if(r.accident)return console.log(t,'ACC',r.accident.title);
  console.log(t,'=>',r.name,`[${r.type}${r.alt.length?'+'+r.alt:''}]`,r.form,'Q'+r.quality.score,r.danger.label,'|',r.fx.slice(0,4).map(e=>e.id+':'+e.raw).join(' '),'| solv:',r.solvKind,'v:',r.v,'| comps:',r.comps.map(c=>c.id+':'+c.w).join(','));};
// Étape 1 : poudre au broyeur
const A=P([['racine_amere',2],['lichen_roche',2],['cornouille_amere',1]],{tech:'broyer'});show('A poudre',A);stock('m:A','Poudre fortifiante',A);
// Étape 2 : distillation d'un mélange de liquides (eau + plantes volatiles)
const B=P([['melisse_tourbieres',3],['sauge_fievre',2]],{tech:'distiller',solvent:'eau_pluie'});show('B distillat',B);stock('m:B','Eau des simples',B);
// Étape 3 : décocter la poudre dans le distillat
const C=P([['m:A',2]],{tech:'decocter',solvent:'m:B'});show('C décoction poudre+distillat',C);
console.log('   journal:',C.journal.join(' | '));
// même chose mais avec le distillat comme ingrédient (mélanger)
show('C2 mélange poudre+distillat',P([['m:A',2],['m:B',2]],{tech:'melanger'}));
// mélange de deux liquides de même forme
const T1=P([['melisse_tourbieres',3]],{tech:'macerer',solvent:'alcool'});stock('m:T1','Teinture de mélisse',T1);
const T2=P([['fleur_nuit',3]],{tech:'macerer',solvent:'alcool'});stock('m:T2','Teinture de nuit',T2);
show('D teinture+teinture',P([['m:T1',2],['m:T2',2]],{tech:'melanger'}));
show('D2 teinture+infusion',P([['m:T1',2],['m:B',2]],{tech:'melanger'}));
// poudre + onguent
const O=P([['mauve_grasse',2],['larme_pin',1]],{tech:'petrir',adj:'graisse_oie',feu:0});stock('m:O','Onguent doux',O);
show('E onguent+poudre',P([['m:O',2],['m:A',1]],{tech:'melanger'}));
show('E2 pétrir avec onguent',P([['vesse_loup',2],['m:O',2]],{tech:'petrir'}));
// mercure dans un contenant, puis calcination => accident
const M=P([['argent_vif',1]],{tech:'macerer',solvent:'vinaigre'});show('M mercure/vinaigre',M);stock('m:M','Mercure acide',M);
show('M2 calciner contenant au mercure',P([['m:M',1]],{tech:'calciner'}));
// encre par mélange : vitriol infusé + cornouille infusée
const V=P([['vitriol_vert',2]],{tech:'infuser',solvent:'eau_pluie'});stock('m:V','Solution de vitriol',V);
const Cn=P([['cornouille_amere',3]],{tech:'decocter',solvent:'eau_pluie'});stock('m:Cn','Décoction de cornouille',Cn);
show('V encre par mélange',P([['m:V',2],['m:Cn',2]],{tech:'melanger'}));
// contenant supprimé
show('X contenant absent',P([['m:ZZ',1]],{tech:'melanger'}));
// vieille entrée sans comps/solvKind/sens/v
const old=JSON.parse(JSON.stringify(A));delete old.comps;delete old.solvKind;delete old.v;delete old.sens;stock('m:old','Vieille poudre',old);
show('Y ancienne entrée',P([['m:old',2]],{tech:'decocter',solvent:'eau_pluie'}));
// solvant non compatible
show('Z esprit dans décoction',P([['racine_amere',2]],{tech:'decocter',solvent:'m:T1'}));
// fuzz
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};const pick=a=>a[Math.floor(rnd()*a.length)];
const ids=ING.filter(i=>i.cat!=='bases').map(i=>i.id),sol=ING.filter(i=>i.role==='solvant').map(i=>i.id),adjs=ING.filter(i=>i.role==='adjuvant').map(i=>i.id);
const gen=(pool)=>{const k=1+Math.floor(rnd()*4),used=new Set(),items=[];while(items.length<k){const id=pick(pool);if(used.has(id))continue;used.add(id);items.push({id,dose:1+Math.floor(rnd()*3)})}
  return {items,solvent:rnd()<.6?pick(sol.concat(Object.keys(MIXES).filter(k=>MIXES[k].liquidMix))):null,adj:rnd()<.4?pick(adjs):null,tech:pick(TECH_ORDER),feu:Math.floor(rnd()*3),fin:{filtrer:rnd()<.3,reduire:rnd()<.3,sceller:rnd()<.3}}};
let bad=0,made=0,n=0,cnt={};
for(let i=0;i<30000;i++){
  const pool=ids.concat(Object.keys(MIXES));
  const rc=gen(pool);let r;
  try{r=prepare(rc,MIXES)}catch(e){bad++;if(bad<4)console.log('EXC',e.message,e.stack.split('\n')[1],JSON.stringify(rc));continue}
  n++;
  if(r.error){cnt.err=(cnt.err||0)+1;continue}if(r.accident){cnt.acc=(cnt.acc||0)+1;continue}
  const s=JSON.stringify(r);if(/NaN|undefined|Infinity/.test(s)){bad++;if(bad<4)console.log('BAD',s.slice(0,200),JSON.stringify(rc))}
  cnt[r.form]=(cnt[r.form]||0)+1;
  if(rnd()<.05&&Object.keys(MIXES).length<40){const id='m:f'+made++;MIXES[id]=mixIng(id,r.name,JSON.parse(JSON.stringify(r)))}
}
console.log({n,bad,stockCreated:made,mixes:Object.keys(MIXES).length});
console.log(cnt);
