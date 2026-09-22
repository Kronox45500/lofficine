let bad=0,count=0,types={},acc=0,err=0;
const ids=ING.filter(i=>i.cat!=='bases').map(i=>i.id);
const sol=ING.filter(i=>i.role==='solvant').map(i=>i.id), adjs=ING.filter(i=>i.role==='adjuvant').map(i=>i.id);
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
const pick=a=>a[Math.floor(rnd()*a.length)];
for(let n=0;n<20000;n++){
  const k=1+Math.floor(rnd()*MAX_ITEMS);const used=new Set();const items=[];
  while(items.length<k){const id=pick(ids);if(used.has(id))continue;used.add(id);items.push({id,dose:1+Math.floor(rnd()*3)})}
  const rc={items,solvent:rnd()<.6?pick(sol):null,adj:rnd()<.4?pick(adjs):null,tech:pick(TECH_ORDER),feu:Math.floor(rnd()*3),fin:{filtrer:rnd()<.3,reduire:rnd()<.3,sceller:rnd()<.3}};
  let r;try{r=prepare(rc)}catch(e){bad++;if(bad<5)console.log('EXC',e.message,JSON.stringify(rc));continue}
  count++;
  if(r.error){err++;continue}if(r.accident){acc++;continue}
  types[r.type]=(types[r.type]||0)+1;
  const s=JSON.stringify(r);if(/NaN|undefined|Infinity/.test(s)){bad++;if(bad<5)console.log('BAD',s.slice(0,300),JSON.stringify(rc))}
  if(!TYPES[r.type]){bad++;console.log('TYPE?',r.type)}
  r.fx.forEach(f=>{if(!FX[f.id]){bad++;console.log('FX?',f.id)}});
}
console.log({count,bad,err,acc,types});
