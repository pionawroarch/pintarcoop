// ===== v110: handel między miastami — towary handlowe, ceny zależne od rasy miasta, nasycenie rynku, napady na karawany =====
const TOW={
  zboze:{n:'Zboże',p:6,ic:'🌾',pr:['niziolki','ludzie'],dm:['krasnoludy','drowy']},
  miod:{n:'Miód',p:15,ic:'🍯',pr:['niziolki','elfy'],dm:['orkowie','drowy']},
  ziele:{n:'Ziele fajkowe',p:19,ic:'🍂',pr:['niziolki'],dm:['krasnoludy','orkowie']},
  wino:{n:'Wino',p:18,ic:'🍷',pr:['elfy','ludzie'],dm:['orkowie','krasnoludy']},
  ziola:{n:'Zioła lecznicze',p:14,ic:'🌿',pr:['elfy','saurianie'],dm:['orkowie','krasnoludy','ludzie']},
  piwo:{n:'Piwo krasnoludzkie',p:14,ic:'🍺',pr:['krasnoludy'],dm:['ludzie','niziolki','orkowie']},
  zelazo:{n:'Sztaby żelaza',p:24,ic:'⛓️',pr:['krasnoludy','orkowie'],dm:['elfy','niziolki','ludzie']},
  klejnoty:{n:'Klejnoty',p:62,ic:'💎',pr:['krasnoludy','drowy'],dm:['elfy','ludzie','saurianie']},
  futra:{n:'Futra',p:22,ic:'🦊',pr:['orkowie'],dm:['saurianie','niziolki','ludzie']},
  sol:{n:'Sól',p:10,ic:'🧂',pr:['ludzie','saurianie'],dm:['orkowie','drowy','krasnoludy']},
  przyprawy:{n:'Przyprawy',p:32,ic:'🌶️',pr:['saurianie'],dm:['ludzie','elfy','niziolki']},
  jedwab:{n:'Pajęczy jedwab',p:46,ic:'🧵',pr:['drowy'],dm:['elfy','ludzie','saurianie']},
  grzyby:{n:'Grzyby jaskiniowe',p:12,ic:'🍄',pr:['drowy'],dm:['niziolki','krasnoludy']},
  bursztyn:{n:'Bursztyn',p:38,ic:'🟠',pr:['ludzie','elfy'],dm:['drowy','orkowie','saurianie']}};
INV.goods=INV.goods||{};const MKT=()=>W.mkt||(W.mkt={});
const goodsN=()=>Object.values(INV.goods).reduce((a,b)=>a+b,0);
const goodsCap=()=>30+(MNT.kon?20:0)+(MNT.mul?50:0)+(MNT.gryf?10:0);
// rynek, na którym handluje kupiec: miasto/wioska (rasa, wielkość) albo karawana na trakcie (ceny pośrednie)
function mktOf(n){const v=n&&villages.get(n.vid);if(n&&n.trav)return{id:'trav_'+n.id,race:null,city:false,trav:true,v};return{id:v?v.id:('n'+(n?n.id:'?')),race:(v&&v.race)||(n&&n.race)||'ludzie',city:!!(v&&v.city),trav:false,v}}
function mktKey(M,k){return M.id+'|'+k}
// nasycenie: każda sprzedana sztuka obniża cenę o 4%, kupiona podnosi; rynek wraca do równowagi (połowa w ~4 minuty)
function mktSat(M,k){const e=MKT()[mktKey(M,k)];if(!e)return 0;const dt=(Date.now()-e.t)/1000,v=e.v*Math.pow(0.5,dt/240);return Math.abs(v)<0.05?0:v}
function mktPush(M,k,d){const v=mktSat(M,k)+d;MKT()[mktKey(M,k)]={v,t:Date.now()};const ks=Object.keys(MKT());if(ks.length>400)delete MKT()[ks[0]]}
function goodRel(M,k){const g=TOW[k];if(M.trav)return 'trav';if(g.pr.includes(M.race))return 'pr';if(g.dm.includes(M.race))return 'dm';return 'n'}
function goodPrice(M,k){const g=TOW[k],rel=goodRel(M,k),loc=M.city?1:0.6;let f=rel==='pr'?1-0.45*loc:rel==='dm'?1+0.8*loc:rel==='trav'?1.05:1;
  const hs=strHash(M.id+k+S.seed),day=Math.floor(Date.now()/3600000);f*=0.9+((hs%1000)/1000)*0.2;f*=1+Math.sin(day*0.7+(hs%97))*0.07;f*=Math.max(0.35,1-mktSat(M,k)*0.04);return g.p*f}
function goodBuyPr(M,k,n){return Math.max(1,Math.round(goodPrice(M,k)*1.08*pmod(n)))}
function goodSellPr(M,k,n){return Math.max(1,Math.round(goodPrice(M,k)*0.9/pmod(n)))}
// zapas kupca: towary miejscowe w obfitości, reszta w małej ilości, poszukiwanych brak
function goodStock(M,k){const rel=goodRel(M,k),base=rel==='pr'?(M.city?30:14):rel==='dm'?0:rel==='trav'?6:(M.city?8:(strHash(M.id+k)%3===0?4:0));return Math.max(0,Math.round(base-Math.max(0,-mktSat(M,k))))}
const RACEGEN={ludzie:'ludzi',elfy:'elfów',krasnoludy:'krasnoludów',orkowie:'orków',niziolki:'niziołków',drowy:'drowów',saurianie:'saurian'};
function goodsRender(){const el=$('tradegoods');if(!el||!TRADE)return;const n=TRADE.n,M=mktOf(n);const keys=Object.keys(TOW);
  const rows=keys.map(k=>{const g=TOW[k],rel=goodRel(M,k),st=goodStock(M,k),bp=goodBuyPr(M,k,n),sp=goodSellPr(M,k,n),have=INV.goods[k]||0;if(!st&&!have&&rel!=='dm')return '';
    const tag=rel==='pr'?'<span class="gtag gcheap">miejscowy — tanio</span>':rel==='dm'?'<span class="gtag gdear">poszukiwany — drogo</span>':'';
    const hint=`Tanio u: ${g.pr.map(r=>RACEGEN[r]).join(', ')} · drogo u: ${g.dm.map(r=>RACEGEN[r]).join(', ')}`;
    return `<div class="grow" title="${hint}"><span class="gic">${g.ic}</span><b>${g.n}</b>${tag}<span class="gpr">kup <i>${st?bp+' zł':'—'}</i> · sprzedaj <i>${sp} zł</i></span><span class="ghave">masz ${have}</span>
      <span class="gbt"><button data-gb="${k}:1" ${st&&INV.gold>=bp?'':'disabled'}>+1</button><button data-gb="${k}:5" ${st>=5&&INV.gold>=bp*5?'':'disabled'}>+5</button><button data-gs="${k}:1" ${have?'':'disabled'}>−1</button><button data-gs="${k}:all" ${have?'':'disabled'}>Wszystko</button></span></div>`}).join('');
  el.innerHTML=`<h3>Towary handlowe <small>· juki ${goodsN()}/${goodsCap()}${M.race&&!M.trav?' · rynek '+RACEGEN[M.race]:' · karawana'}</small></h3><p class="sub2">Kupuj tanio tam, gdzie towar powstaje, i sprzedawaj drożej u ras, które go szukają. Każda transakcja przesuwa cenę — rynek wraca do równowagi po kilku minutach.</p>${rows||'<p class="sub2">Ten kupiec nie handluje towarami.</p>'}`}
function goodBuy(k,q){const n=TRADE.n,M=mktOf(n);let got=0,cost=0;for(let i=0;i<q;i++){if(goodStock(M,k)<=0||goodsN()>=goodsCap())break;const p=goodBuyPr(M,k,n);if(INV.gold<p)break;INV.gold-=p;cost+=p;INV.goods[k]=(INV.goods[k]||0)+1;mktPush(M,k,-1);got++}
  if(!got)return toast(goodsN()>=goodsCap()?'Juki pełne — kup muła jucznego u kupca od wierzchowców':'Brak towaru albo złota','#ff8a7a');sfx('coin',0.5);toast(`Kupiono: ${TOW[k].n} ×${got} (${cost} zł)`,'#ffd34d');saveInv();saveW();updHud();tradeRender()}
function goodSell(k,q){const n=TRADE.n,M=mktOf(n);const have=INV.goods[k]||0,cnt=q==='all'?have:Math.min(have,q);let earn=0;for(let i=0;i<cnt;i++){const p=goodSellPr(M,k,n);earn+=p;INV.goods[k]--;mktPush(M,k,1)}if(!INV.goods[k])delete INV.goods[k];
  if(!cnt)return;INV.gold+=earn;W.tradeProfit=(W.tradeProfit||0)+earn;sfx('coin',0.7);toast(`Sprzedano: ${TOW[k].n} ×${cnt} za ${earn} zł`,'#ffd34d');if(goodRel(M,k)==='dm'&&cnt>=5&&M.race){try{addRep(M.race,Math.min(6,Math.floor(cnt/5)),true)}catch(_){}}saveInv();saveW();updHud();tradeRender()}
$('tradegoods').onclick=e=>{const b=e.target.closest('[data-gb],[data-gs]');if(!b||!TRADE)return;if(b.dataset.gb){const [k,q]=b.dataset.gb.split(':');goodBuy(k,+q)}else{const [k,q]=b.dataset.gs.split(':');goodSell(k,q==='all'?'all':+q)}};
// plotki handlowe: karczmarz / kupiec podpowiada, gdzie co zarobić
function tradeRumor(n){const M=mktOf(n);const ks=Object.keys(TOW).filter(k=>goodRel(M,k)==='pr');if(!ks.length)return 'Handel? Słyszałem, że krasnoludy płacą krocie za zboże, a elfy za żelazo. Ale co ja tam wiem.';const k=rpick(Math.random,ks),g=TOW[k],r=rpick(Math.random,g.dm);
  let near=null,bd=1e9;for(const v of villages.values()){if(!v||!v.city||v.race!==r)continue;const d=Math.hypot(v.x-player.p.x,v.z-player.p.z);if(d<bd){bd=d;near=v}}
  return `${g.n} mamy tu tanio jak barszcz. A ${RACEGEN[r]} płacą za ${g.n.toLowerCase()} podwójnie${near?` — najbliżej w mieście ${near.name||''}, jakieś ${Math.round(bd/100)*100} kroków na ${dirName(near.x-player.p.x,near.z-player.p.z)}`:''}. Kup kilka worków i ruszaj!`}
// ===== napad na karawanę lub wóz kupiecki na trakcie =====
const ROBBED=new Map(),ROBS=[];
function robCaravan(n){const t=n.trav;if(!t||!t.g)return;const x=t.g.position.x,z=t.g.position.z,h=colAt(x,z)??t.g.position.y;closeDialog();
  ROBBED.set(t.key,worldT+900);try{scene.remove(t.g)}catch(_){}TRAV.delete(t.key);
  const lvl=Math.max(1,HERO.lvl),R={x,z,ids:[],kind:n.kind,t0:performance.now()};const nG=n.kind==='karawana'?3:2;
  for(let i=0;i<nG;i++){const a=i/nG*6.283,xx=x+Math.cos(a)*3,zz=z+Math.sin(a)*3,hh=colAt(xx,zz)??h;const TT=['rycerz_k','kusznik','lucznik','bandyta','najemnik_e'].filter(k=>EDEF[k]&&!EDEF[k].passive);const e=makeE(i===0?(TT[0]||'bandyta'):(EDEF.bandyta?'bandyta':TT[TT.length-1]),lvl,i===0,xx,hh,zz,{});e.nameOverride='Strażnik karawany';try{if(e.m&&e.m.add&&typeof nameTag==='function')e.m.add(nameTag('Strażnik karawany','#ff8a7a'))}catch(_){}R.ids.push(e.id)}
  ROBS.push(R);addRep('ludzie',-35);try{addKarma(-3)}catch(_){}toast('Napadasz na karawanę! Pokonaj strażników, żeby zagarnąć towar.','#ff6b5b');sfx('hit',0.6)}
function robTick(){for(let i=ROBS.length-1;i>=0;i--){const R=ROBS[i];if(R.ids.some(id=>enemies.has(id))){if(performance.now()-R.t0>300000)ROBS.splice(i,1);continue}ROBS.splice(i,1);
    const keys=Object.keys(TOW),r=Math.random;let got=0,txt=[];const n=R.kind==='karawana'?3:2;for(let j=0;j<n;j++){const k=rpick(r,keys),q=4+Math.floor(r()*(R.kind==='karawana'?10:6));let a=0;for(let m=0;m<q&&goodsN()<goodsCap();m++){INV.goods[k]=(INV.goods[k]||0)+1;a++}if(a){got+=a;txt.push(TOW[k].n+' ×'+a)}}
    const gold=20+Math.floor(r()*40)*(R.kind==='karawana'?2:1);INV.gold+=gold;saveInv();updHud();toast(`Łup z karawany: ${gold} zł${txt.length?', '+txt.join(', '):''}${goodsN()>=goodsCap()?' (juki pełne — reszta przepadła)':''}`,'#ffd34d')}}
TICKS.push(()=>{try{robTick()}catch(e){}});
