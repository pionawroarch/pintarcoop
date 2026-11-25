// =================== v153: SŁAWA I ŻYCIE — tytuły, mistrzostwo broni, nagrody frakcji, wieże widokowe, legendarne bestie, gry jarmarczne, obozy bandytów, zagroda i ogród, kronika, porównywanie łupów, ikony usług ===================
PRZ.stat=PRZ.stat||{};PRZ.ach=PRZ.ach||{};PRZ.mast=PRZ.mast||{};PRZ.tw=PRZ.tw||{};PRZ.chron=PRZ.chron||[];PRZ.prod=PRZ.prod||{};PRZ.garden=PRZ.garden||[null,null,null,null];PRZ.anim=PRZ.anim||{kura:0,krowa:0};PRZ.animT=PRZ.animT||{};PRZ.best2=PRZ.best2||{};
const stInc=(k,n)=>{PRZ.stat[k]=(PRZ.stat[k]||0)+(n||1);achCheck()};
// ---------- KRONIKA ŚWIATA ----------
function chronAdd(txt,share){PRZ.chron.unshift({t:Date.now(),txt,who:S.name});if(PRZ.chron.length>200)PRZ.chron.length=200;przSave();if(share&&NET.tr)sendFx({k:'chron',txt})}
// ---------- TYTUŁY I OSIĄGNIĘCIA ----------
const ACH=[
  ['smok','Pogromca Smoków','Pokonaj smoka albo wiwernę',()=>PRZ.stat.smok>=1,'+4% obrażeń',s=>{s.dmg*=1.04}],
  ['lowca','Łowca Bestii','Pokonaj 100 wrogów',()=>PRZ.stat.kill>=100,'+3% krytyka',s=>{s.crit+=3}],
  ['tyran','Pogromca Tyranów','Pokonaj 5 bossów',()=>PRZ.stat.boss>=5,'+5% obrażeń',s=>{s.dmg*=1.05}],
  ['legenda','Żywa Legenda','Pokonaj legendarną bestię',()=>PRZ.stat.leg>=1,'+6% zdrowia',s=>{s.hp*=1.06}],
  ['kart','Kartograf','Zdobądź 5 wież widokowych',()=>Object.keys(PRZ.tw).length>=5,'+5% szybkości ruchu',s=>{s.move*=1.05}],
  ['zwierz','Przyjaciel Zwierząt','Odkryj 15 zwierząt w albumie',()=>Object.keys(PRZ.best).filter(t=>EDEF[t]&&EDEF[t].passive).length>=15,'+1 regeneracji',s=>{s.regen+=1}],
  ['kronik','Kronikarz Bestii','Zapełnij 50 wpisów w albumie',()=>Object.keys(PRZ.best).length>=50,'+3% obrażeń',s=>{s.dmg*=1.03}],
  ['skarb','Poszukiwacz Skarbów','Wykop 3 skarby',()=>PRZ.stat.skarb>=3,'+4% obrony',s=>{s.def*=1.04}],
  ['kucharz','Mistrz Kuchni','Ugotuj 10 potraw',()=>PRZ.stat.cook>=10,'+1 regeneracji',s=>{s.regen+=1}],
  ['mistrz','Mistrz Oręża','Osiągnij 10 poziom mistrzostwa broni',()=>Object.values(PRZ.mast).some(x=>mastLvl(x)>=10),'+5% szybkości ataku',s=>{s.haste+=5}],
  ['wedr','Wędrowiec','Przejdź 20 km',()=>(PRZ.stat.dist||0)>=20000,'+5% szybkości ruchu',s=>{s.move*=1.05}],
  ['obronca','Obrońca Wiosek','Zniszcz 3 obozy bandytów',()=>PRZ.stat.camp>=3,'+5% obrony',s=>{s.def*=1.05}],
  ['bohater','Bohater Ludu','Wykonaj 25 zadań',()=>PRZ.stat.quest>=25,'+5% zdrowia',s=>{s.hp*=1.05}],
  ['gosp','Gospodarz','Kup dom i dwa zwierzęta do zagrody',()=>!!myHome()&&(PRZ.anim.kura+PRZ.anim.krowa)>=2,'+1 regeneracji',s=>{s.regen+=1}],
  ['jarmark','Król Jarmarku','Wygraj 3 gry jarmarczne',()=>PRZ.stat.fair>=3,'+3% krytyka',s=>{s.crit+=3}],
  ['pielg','Pielgrzym','Pomódl się w 5 kapliczkach',()=>Object.keys(PRZ.shr).length>=5,'+4% obrony',s=>{s.def*=1.04}]];
function achCheck(){for(const A of ACH){if(PRZ.ach[A[0]])continue;let ok=false;try{ok=A[3]()}catch(_){}if(ok){PRZ.ach[A[0]]=Date.now();przSave();toast('🏆 Osiągnięcie: '+A[1]+' — nowy tytuł! ('+A[4]+' gdy go nosisz)','#ffd34d');sfx('lvl',0.7);chronAdd(S.name+' zdobywa tytuł „'+A[1]+'”.',true);if(!PRZ.title)titleSet(A[0])}}}
function titleSet(id){PRZ.title=id||'';przSave();afterBuff();renderBook()}
function titleName(){const A=ACH.find(a=>a[0]===PRZ.title);return A?A[1]:''}
// ---------- MISTRZOSTWO BRONI ----------
const MFAM={miecz:'ostrza',szabla:'ostrza',sztylet:'ostrza',topor:'ciezkie',mlot:'ciezkie',buzdygan:'ciezkie',halabarda:'drzewce',wlocznia:'drzewce',luk:'luki',kusza:'luki',kostur:'magia',rozdzka:'magia'};
const MMOVE={ostrza:['Wir ostrzy','obraca się, raniąc wszystkich wokół'],ciezkie:['Trzęsienie ziemi','uderza w ziemię, ogłuszając wrogów wokół'],drzewce:['Pchnięcie przebijające','przebija wszystkich wrogów w linii przed sobą'],luki:['Deszcz strzał','zasypuje strzałami miejsce przed tobą i spowalnia wrogów'],magia:['Nova arkaniczna','wyzwala falę mocy, raniąc i spowalniając wrogów']};
const mastNeed=l=>Math.round(30*Math.pow(l,1.6));
function mastLvl(x){let l=0;while(l<10&&x>=mastNeed(l+1))l++;return l}
function mastGain(n){const it=INV.eq.bron;if(!it||!MFAM[it.base])return;const b=it.base,l0=mastLvl(PRZ.mast[b]||0);PRZ.mast[b]=(PRZ.mast[b]||0)+n;const l1=mastLvl(PRZ.mast[b]);
  if(l1>l0){const nm=WEAP[b].n;toast(`⚔ Mistrzostwo: ${nm} — poziom ${l1}`+(l1===3?` · nowy ruch: ${MMOVE[MFAM[b]][0]} (klawisz 9)`:l1===6?' · ruch mistrzowski silniejszy':l1===10?' · pełne mistrzostwo!':''),'#ffb050');sfx('lvl',0.5);if(l1>=10)chronAdd(S.name+' osiąga pełne mistrzostwo broni: '+nm+'.',true);achCheck();przSave()}}
let mastCd=0;
function mastMove(){const it=INV.eq.bron;if(!it||!MFAM[it.base])return toast('Ta broń nie ma ruchu mistrzowskiego','#ff8a7a');const l=mastLvl(PRZ.mast[it.base]||0);if(l<3)return toast(`Ruch mistrzowski odblokujesz na 3 poziomie mistrzostwa (${WEAP[it.base].n}: ${l})`,'#ff8a7a');
  if(mastCd>0)return toast('Ruch mistrzowski gotowy za '+Math.ceil(mastCd)+' s','#cfcfcf');if(P2.dead||VH.mode||invOpen()||uiOpen())return;
  mastCd=l>=6?8:12;const k=l>=6?1.5:1,f=MFAM[it.base],p=player.p,fx=Math.sin(player.ry),fz=Math.cos(player.ry),D=ST.dmg*k;P2.atkT=0.4;
  if(f==='ostrza'){aoe(p.x,p.y,p.z,3.4,D*1.6,0,'war');sfx('whirl',0.9)}
  else if(f==='ciezkie'){aoe(p.x,p.y,p.z,4.2,D*1.3,0,'smoke');for(const e of enemies.values()){if(e.st===2||e.pas||EDEF[e.t].ally)continue;if(Math.hypot(e.p.x-p.x,e.p.z-p.z)<4.2)dealHit(e,0.01,false,0,0,0,1.5)}sfx('thud',1)}
  else if(f==='drzewce'){let n=0;for(const e of enemies.values()){if(e.st===2||e.pas||EDEF[e.t].ally)continue;const dx=e.p.x-p.x,dz=e.p.z-p.z,a=dx*fx+dz*fz,b=Math.abs(dx*fz-dz*fx);if(a>0&&a<6.5&&b<1.3+eSc(e)*0.3){dealHit(e,D*2,true,fx*2.5,fz*2.5);n++}}for(let i=1;i<7;i++)PFX.emit(p.x+fx*i,p.y+1.1,p.z+fz*i,3,['#ffffff','#ffd34d'],{sp:1,life:0.3,size:0.07});sfx('swing',1)}
  else if(f==='luki'){const x=p.x+fx*12,z=p.z+fz*12,h=colAt(x,z)??p.y;aoe(x,h,z,4.2,D*1.25,2.5,'frost');for(let i=0;i<14;i++)PFX.emit(x+(Math.random()-0.5)*7,h+6,z+(Math.random()-0.5)*7,1,['#d8d0c0'],{sp:0.2,up:-9,life:0.6,size:0.06});sfx('bow',1)}
  else {aoe(p.x,p.y,p.z,5,D*1.4,2.5,'lvl');sfx('magic',1)}
  toast(MMOVE[f][0]+'!','#ffb050')}
// ---------- NAGRODY FRAKCJI: unikatowe zbroje u kowala przy wysokiej reputacji ----------
const RARM={ludzie:['Królewskiej Gwardii','plyt'],elfy:['Strażnika Puszczy','elf'],krasnoludy:['Kowali Khazadu','krasn'],orkowie:['Wodza Hordy','smok'],niziolki:['Zwiadowcy Wzgórz','skora'],drowy:['Cienia Podmroku','elf'],saurianie:['Łuskowego Kapłana','smok']};
function raceArmor(race,slot){const R=RARM[race]||RARM.ludzie,it=genItem(HERO.lvl+2,60,slot);it.rar=4;it.mat=R[1];for(const s of ['def','hp'])if(it[s])it[s]=+(it[s]*1.25).toFixed(1);it.crit=+((it.crit||0)+4).toFixed(1);it.name={helm:'Hełm',zbroja:'Zbroja',rekawice:'Rękawice',buty:'Buty'}[slot]+' '+R[0];it.frak=race;return it}
function dlgRaceArmor(){const n=dlg.n,t=tierOf(W.rep[n.race]),pm=pmod(n),R=RARM[n.race]||RARM.ludzie;
  if(t<4)return dlgShow(`Najlepsze zbroje ${RACES[n.race].n.toLowerCase()} kuję tylko dla tych, których mój lud honoruje. Wróć, gdy zdobędziesz poziom „Honorowany”.`,[['Wróć.',()=>dlgSmith()]]);
  const o=['helm','zbroja','rekawice','buty'].map(sl=>{const pr=Math.round((sl==='zbroja'?2400:1500)*pm*(t>=5?0.8:1));return[`${({helm:'Hełm',zbroja:'Zbroja',rekawice:'Rękawice',buty:'Buty'})[sl]} ${R[0]} — ${pr} zł`,()=>{if((INV.gold||0)<pr)return toast('Za mało złota','#ff8a7a');if(INV.bag.length>=bagN())return toast('Plecak jest pełny','#ff8a7a');INV.gold-=pr;const it=raceArmor(n.race,sl);INV.bag.push(it);saveInv();updHud();sfx('clang');toast('Wykuto: '+it.name,RAR[4].c);chronAdd(S.name+' otrzymuje od kowala '+RACES[n.race].n.toLowerCase()+': '+it.name+'.',false);dlgRaceArmor()}]});
  o.push(['Wróć.',()=>dlgSmith()]);dlgShow(`Dla przyjaciół mojego ludu: legendarne zbroje ${R[0]}${t>=5?' (dla uwielbianych 20% taniej)':''}.`,o)}
// ---------- WIEŻE WIDOKOWE ----------
const TWC=420,twM=new Map(),TWN=['Sokola','Wichrów','Strażnicza','Mglista','Orla','Zachodnia','Kamienna','Starej Straży','Kruków','Świtu','Gwiazd','Łuczników'];
function towerAt(cx,cz){const r=rngOf('tw'+S.seed+':'+cx+','+cz);if(r()>0.3)return null;return{id:'t'+cx+','+cz,x:cx*TWC+40+r()*(TWC-80),z:cz*TWC+40+r()*(TWC-80),n:'Wieża '+TWN[Math.floor(r()*TWN.length)]}}
function towerGeo(){const S1='#8a8a8a',S2='#7a7a7a',WD='#6a4a2a',WD2='#5a3a22',RF='#7a3a24',L=[],P=(...b)=>L.push(b);
  P(0,0.6,0,4.2,1.2,4.2,S1);P(0,1.6,0,3.6,0.8,3.6,S2);
  for(const [x,z] of [[-1.4,-1.4],[1.4,-1.4],[-1.4,1.4],[1.4,1.4]])P(x,8,z,0.45,13,0.45,WD);
  for(let y=4;y<14;y+=3){P(0,y,-1.4,3.2,0.2,0.2,WD2);P(0,y,1.4,3.2,0.2,0.2,WD2);P(-1.4,y,0,0.2,0.2,3.2,WD2);P(1.4,y,0,0.2,0.2,3.2,WD2)}
  P(0,14.4,0,4.0,0.3,4.0,WD);for(const [x,z,w,d] of [[0,-1.95,4,0.15],[0,1.95,4,0.15],[-1.95,0,0.15,4],[1.95,0,0.15,4]])P(x,15,z,w,0.9,d,WD2);
  for(const [x,z] of [[-1.85,-1.85],[1.85,-1.85],[-1.85,1.85],[1.85,1.85]])P(x,16,z,0.25,2.4,0.25,WD);for(let i=0;i<4;i++)P(0,17.3+i*0.4,0,4.6-i*1.15,0.4,4.6-i*1.15,i%2?RF:'#6a2e1c');
  for(let y=2;y<14.2;y+=0.6)P(0,y,2.0,0.9,0.08,0.08,'#8a6a44');P(-0.45,8,2.0,0.1,12.4,0.1,WD2);P(0.45,8,2.0,0.1,12.4,0.1,WD2);
  P(0,19.6,0,0.1,1.6,0.1,WD2);P(0.45,20.1,0,0.8,0.5,0.04,'#c8302a');return boxes(L)}
let towerGeoC=null;
function towerTick(){if(SPC)return;const cx0=Math.floor(player.p.x/TWC),cz0=Math.floor(player.p.z/TWC);
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const t=towerAt(cx0+dx,cz0+dz);if(!t||twM.has(t.id))continue;if(Math.hypot(t.x-player.p.x,t.z-player.p.z)>200)continue;const h=colAt(t.x,t.z);if(h===null)continue;
    let ok=h>WATER+0.6&&!inVillage(t.x,t.z,12);if(ok)for(const [a,b] of [[2.2,2.2],[-2.2,2.2],[2.2,-2.2],[-2.2,-2.2],[0,3.5]]){const q=colAt(t.x+a,t.z+b);if(q===null||Math.abs(q-h)>1.4)ok=false}
    if(!ok){twM.set(t.id,null);continue}towerGeoC=towerGeoC||towerGeo();const g=new THREE.Group(),m=new THREE.Mesh(towerGeoC,matB);m.castShadow=true;g.add(m);g.position.set(t.x,h,t.z);scene.add(g);t.g=g;t.y=h;twM.set(t.id,t);try{voxQueue(m,'tw:'+t.id)}catch(_){}
    if(PRZ.tw[t.id])MARKS.set(t.id,{x:t.x,z:t.z,n:t.n,col:'#8fd8ff',t:1e9})}
  for(const [id,t] of twM){if(!t)continue;if(Math.hypot(t.x-player.p.x,t.z-player.p.z)>320){scene.remove(t.g);try{voxRemove('tw:'+id)}catch(_){}twM.delete(id)}}}
function towerNear(){for(const t of twM.values()){if(!t)continue;const dB=Math.hypot(t.x-player.p.x,t.z-(player.p.z-0)),top=player.p.y>t.y+12;if(top&&Math.hypot(t.x-player.p.x,t.z-player.p.z)<2.2)return[t,'top'];if(!top&&Math.hypot(t.x-player.p.x,t.z+2.6-player.p.z)<2.4&&Math.abs(player.p.y-t.y)<3)return[t,'base']}return null}
function towerClimb(t){player.p.set(t.x,t.y+14.7,t.z);player.v.set(0,0,0);if(!PRZ.tw[t.id]){PRZ.tw[t.id]={x:t.x,z:t.z,y:t.y,n:t.n};przSave();MARKS.set(t.id,{x:t.x,z:t.z,n:t.n,col:'#8fd8ff',t:1e9});
    let nv=0;W.seen=W.seen||{};for(const v of villages.values()){if(v&&Math.hypot(v.x-t.x,v.z-t.z)<520&&!W.seen[v.id]){W.seen[v.id]=1;nv++}}saveW();gainXp(150*Math.max(1,HERO.lvl));sfx('lvl');
    toast(`🗼 Zdobyto: ${t.n}! Odkryto okolicę${nv?' ('+nv+' osad)':''} · szybka podróż między zdobytymi wieżami`,'#8fd8ff');chronAdd(S.name+' zdobywa '+t.n+'.',true);achCheck()}else toast('Widok z '+t.n.toLowerCase()+' zapiera dech','#8fd8ff')}
function towerTravel(here){const L=Object.entries(PRZ.tw).filter(([id])=>id!==here.id);przWin('tw','🗼 '+here.n+' — szybka podróż',()=>{const el=document.getElementById('przbody');el.innerHTML='<p class="sub2">Z każdej zdobytej wieży możesz szybko przenieść się do innej zdobytej wieży.</p><button data-pz="twup">⬆ Wejdź na szczyt</button>'+(L.length?L.map(([id,t])=>`<div class="prow"><b>${esc(t.n)}</b><small>${Math.round(Math.hypot(t.x-player.p.x,t.z-player.p.z))} kroków, ${dirName(t.x-player.p.x,t.z-player.p.z)}</small><button data-pz="twgo:${id}">Podróżuj</button></div>`).join(''):'<p class="sub2">Nie masz jeszcze innych zdobytych wież.</p>')})}
function towerGo(id){const t=PRZ.tw[id];if(!t)return;przClose();if(VH.mode===5||VH.mode===6)dismountOwn(1);if(VH.mode===1)exitBoat();player.p.set(t.x,(t.y||colAt(t.x,t.z)||WATER)+1,t.z-3);player.v.set(0,0,0);camY=null;holdIfUnloaded();toast('🗼 Przybywasz pod: '+t.n,'#8fd8ff');for(const f of FOL)f.p.set(t.x+1.5,player.p.y,t.z-3);if(PET)PET.p.set(t.x-1.5,player.p.y,t.z-3)}
// ---------- LEGENDARNE BESTIE ----------
const LEGB=[['szablozab','Kłoszczęki',1.7],['grizli','Stary Burzogrzbiet',1.6],['wilk_mrozny','Szronogrzywa',1.8],['mamut','Pradawny Kieł',1.35],['dzik','Żelaznoszczeci',2.3],['jelen','Biały Pan Lasu',1.6],['krokodyl','Paszcza Bagien',1.6],['nosorozec','Taranogłowy',1.4]].filter(b=>EDEF[b[0]]);
let legT=900+Math.random()*900,LEGE=null;
function legLook(e,nm,sc){e.qn='✦ '+nm+' (legendarna)';e.leg=nm;if(e.m&&!e._legSc){e.m.scale.multiplyScalar(sc);e._legSc=1}}
function legTick(dt){if(LEGE){const e=enemies.get(LEGE.id);if(e&&e.m&&!e._legSc)legLook(e,LEGE.n,LEGE.sc);if(e&&e.st!==2&&isAuth())MARKS.set('leg',{x:e.p.x,z:e.p.z,n:LEGE.n,col:'#ff9d2e',t:30});
    if((!e||e.st===2)&&isAuth()){const killed=e&&e.st===2;if(killed){sendFx({k:'legd',n:LEGE.n});legDead(LEGE.n)}else MARKS.delete('leg');LEGE=null}}
  if(!isAuth()||SPC)return;legT-=dt;if(legT>0||LEGE||!LEGB.length)return;legT=1800+Math.random()*1200;const B=pick(LEGB),a=Math.random()*6.28,d=140+Math.random()*80,x=player.p.x+Math.sin(a)*d,z=player.p.z+Math.cos(a)*d,h=colAt(x,z);if(h===null||h<WATER+0.5){legT=60;return}
  let e=null;try{e=makeE(B[0],HERO.lvl+5,true,x,h,z,{evt:1})}catch(_){}if(!e){legT=120;return}e.max=Math.round(e.max*6);e.hp=e.max;LEGE={id:e.id,n:B[1],sc:B[2]};legLook(e,B[1],B[2]);sendFx({k:'leg',eid:e.id,n:B[1],sc:B[2]});
  evMsg('✦ W okolicy krąży legendarna bestia: '+B[1]+'! ('+dirName(x-player.p.x,z-player.p.z)+')','#ff9d2e',[x,z,B[1]])}
function legDead(n){MARKS.delete('leg');stInc('leg');const lv=HERO.lvl;INV.gold+=lv*60;PRZ.mat.esencja+=4;przSave();saveInv();updHud();gainXp(400*lv);toast('✦ Pokonano legendarną bestię: '+n+'! +'+lv*60+' zł, +4 esencji','#ff9d2e');sfx('cheer',0.6);
  if(Math.random()<0.5){const it=makeArtifact(lv);if(INV.bag.length<bagN()){INV.bag.push(it);toast('✦ Artefakt: '+it.name,'#ff9d2e')}}chronAdd('Drużyna pokonuje legendarną bestię: '+n+'.',false)}
// ---------- GRY JARMARCZNE (podczas jarmarku w mieście) ----------
function fairHere(){if(!(typeof FAIR!=='undefined'&&Date.now()<FAIR.until))return null;const c=villages.get(FAIR.cid);if(!c)return null;const [mx,mz]=mktM(c);return Math.hypot(mx-player.p.x,mz-player.p.z)<22?c:null}
let FG=null;
function openFair(){przWin('fair','🎪 Gry jarmarczne',renderFair)}
function renderFair(){const el=document.getElementById('przbody');if(!el||przCur!=='fair')return;if(FG&&FG.k==='shoot')return renderShoot();if(FG&&FG.k==='wrest')return renderWrest();
  el.innerHTML=`<p class="sub2">Udział w każdej grze kosztuje 10 zł. Wygrane: ${PRZ.stat.fair||0}. Najlepszy wynik w strzelaniu: ${PRZ.best2.shoot||0}.</p>
  <div class="prow"><b>🎯 Strzelanie do tarczy</b><small>5 strzałów — naciśnij Spację albo kliknij, gdy znacznik jest najbliżej środka. 40+ pkt wygrywa.</small><button data-pz="fg:shoot">Graj</button></div>
  <div class="prow"><b>💪 Zapasy</b><small>Na przemian naciskaj A i D (albo klikaj szybko), żeby przepchnąć przeciwnika na drugą stronę.</small><button data-pz="fg:wrest">Graj</button></div>
  <div class="prow"><b>🐎 Wyścig konny</b><small>Na swoim wierzchowcu przejedź przez 6 bramek wokół miasta w 90 sekund.</small><button data-pz="fg:race">Start</button></div>`}
function fairStart(k){if((INV.gold||0)<10)return toast('Udział kosztuje 10 zł','#ff8a7a');INV.gold-=10;saveInv();updHud();
  if(k==='shoot'){FG={k,shot:0,sc:0,pos:0,dir:1,spd:1.4}}else if(k==='wrest'){FG={k,v:0.5,t:10,last:''}}else if(k==='race'){if(VH.mode!==5){INV.gold+=10;return toast('Wsiądź na wierzchowca (G), żeby się ścigać','#ff8a7a')}przClose();raceStart();return}renderFair()}
function fairWin(prize,txt){INV.gold+=prize;saveInv();updHud();stInc('fair');sfx('cheer',0.6);toast('🏅 '+txt+' +'+prize+' zł','#ffd34d');chronAdd(S.name+' wygrywa na jarmarku: '+txt,false)}
function renderShoot(){const el=document.getElementById('przbody');el.innerHTML=`<p class="sub2">Strzał ${FG.shot+1}/5 · wynik: ${FG.sc}</p><div class="fbar"><i style="left:${(FG.pos*100).toFixed(1)}%"></i><b></b></div><button data-pz="shoot" class="pri">Strzał!</button>`}
function shootFire(){if(!FG||FG.k!=='shoot')return;const d=Math.abs(FG.pos-0.5),pts=Math.max(0,Math.round(10-d*24));FG.sc+=pts;FG.shot++;sfx('bow',0.8);toast(pts>=9?'W dziesiątkę! ('+pts+')':pts+' pkt',pts>=7?'#7dd87d':'#cfcfcf');FG.spd*=1.12;
  if(FG.shot>=5){const s=FG.sc;PRZ.best2.shoot=Math.max(PRZ.best2.shoot||0,s);przSave();FG=null;if(s>=40)fairWin(Math.round(s*2.5),'strzelanie do tarczy ('+s+' pkt)');else toast('Wynik: '+s+' pkt. Zabrakło do 40.','#cfcfcf');renderFair()}}
function renderWrest(){const el=document.getElementById('przbody');el.innerHTML=`<p class="sub2">Pozostało ${FG.t.toFixed(1)} s — naciskaj na przemian A i D!</p><div class="fbar wr"><i style="left:${(FG.v*100).toFixed(1)}%"></i></div><button data-pz="push" class="pri">Pchaj!</button>`}
function wrestPush(key){if(!FG||FG.k!=='wrest')return;if(key&&key===FG.last)return;FG.last=key||'';FG.v=Math.min(1,FG.v+0.045)}
function fairTick(dt){if(!FG)return;if(FG.k==='shoot'){FG.pos+=FG.dir*FG.spd*dt;if(FG.pos>1){FG.pos=1;FG.dir=-1}if(FG.pos<0){FG.pos=0;FG.dir=1}const i=document.querySelector('#przbody .fbar i');if(i)i.style.left=(FG.pos*100).toFixed(1)+'%'}
  else if(FG.k==='wrest'){FG.t-=dt;FG.v-=dt*(0.16+0.02*Math.max(0,HERO.lvl>10?0:10-HERO.lvl));const i=document.querySelector('#przbody .fbar i');if(i)i.style.left=(Math.max(0,FG.v)*100).toFixed(1)+'%';const p=document.querySelector('#przbody .sub2');if(p)p.textContent='Pozostało '+Math.max(0,FG.t).toFixed(1)+' s — naciskaj na przemian A i D!';
    if(FG.v>=1){FG=null;fairWin(80,'zapasy');renderFair()}else if(FG.v<=0||FG.t<=0){FG=null;toast('Przeciwnik okazał się silniejszy','#ff8a7a');renderFair()}}}
let RACE=null;
function raceStart(){const c=villages.get(FAIR.cid);if(!c)return;const R=(c.Hs||20)*1.25+16,a0=Math.atan2(player.p.x-c.x,player.p.z-c.z),g=new THREE.Group();scene.add(g);const pts=[];
  for(let i=0;i<6;i++){const a=a0+(i+1)*Math.PI*2/6,x=c.x+Math.sin(a)*R,z=c.z+Math.cos(a)*R,h=colAt(x,z)??c.h;const m=new THREE.Mesh(boxes([[-1.6,1.6,0,0.25,3.2,0.25,'#ffd34d'],[1.6,1.6,0,0.25,3.2,0.25,'#ffd34d'],[0,3.3,0,3.5,0.25,0.25,'#ffd34d']]),GLOWMAT);m.position.set(x,h,z);m.rotation.y=a+Math.PI/2;g.add(m);pts.push({x,z,m})}
  RACE={g,pts,i:0,t:90};pts[0].m.scale.setScalar(1.3);toast('🐎 Wyścig! Przejedź przez 6 złotych bramek w 90 s','#ffd34d')}
function raceTick(dt){if(!RACE)return;RACE.t-=dt;const p=RACE.pts[RACE.i];MARKS.set('race',{x:p.x,z:p.z,n:'Bramka '+(RACE.i+1)+'/6',col:'#ffd34d',t:5});
  if(Math.hypot(p.x-player.p.x,p.z-player.p.z)<3.5){p.m.visible=false;RACE.i++;sfx('coin',0.6);if(RACE.i>=RACE.pts.length){const left=RACE.t;raceEnd();fairWin(120+Math.round(left*2),'wyścig konny ('+Math.round(90-left)+' s)');return}RACE.pts[RACE.i].m.scale.setScalar(1.3)}
  const pr=$('prompt');pr.hidden=false;pr.innerHTML='🐎 Wyścig: bramka '+(RACE.i+1)+'/6 · '+Math.ceil(RACE.t)+' s';if(RACE.t<=0){raceEnd();toast('Czas minął — wyścig przegrany','#ff8a7a')}}
function raceEnd(){if(!RACE)return;scene.remove(RACE.g);MARKS.delete('race');RACE=null}
// ---------- OBOZY BANDYTÓW: zniszczenie pomaga pobliskiej wiosce ----------
W.vgrow=W.vgrow||{};W.campDone=W.campDone||{};
function vGrowMod(n){const g=(W.vgrow||{})[n.vid]||0;return 1-0.05*g}
function campCleared(s){if(W.campDone[s.id])return;W.campDone[s.id]=1;let best=null,bd=320;for(const v of villages.values()){if(!v||v.city||v.wander)continue;const d=Math.hypot(v.x-s.x,v.z-s.z);if(d<bd){bd=d;best=v}}stInc('camp');
  if(best){const g=Math.min(3,(W.vgrow[best.id]||0)+1);W.vgrow[best.id]=g;try{addRep(best.race,8)}catch(_){}toast(`🏘 Obóz bandytów zniszczony! ${best.name} rośnie (poziom ${g}): `+['','tańsze ceny i zielarka z miksturami','stajnia w wiosce','szkoła walki'][g],'#7dd87d');chronAdd(S.name+' niszczy obóz bandytów — '+best.name+' rośnie w siłę.',true)}
  else toast('🏘 Obóz bandytów zniszczony!','#7dd87d');saveW()}
function dlgVillageSvc(n){const g=(W.vgrow||{})[n.vid]||0,o=[];
  if(g>=1)o.push(['🌿 Mikstury od zielarki — 4 sztuki za 60 zł',()=>{if((INV.gold||0)<60)return dlgRoot('Brakuje ci złota.');INV.gold-=60;INV.pot=(INV.pot||0)+4;saveInv();updHud();renderHot();sfx('coin');dlgRoot('Proszę, świeżo uwarzone.')}]);
  if(g>=2)o.push(['🐎 Stajnia wioski',()=>dlgMounts()]);
  if(g>=3)o.push(['⚔ Szkoła walki — trening broni (+mistrzostwo) za 120 zł',()=>{const it=INV.eq.bron;if(!it||!MFAM[it.base])return dlgRoot('Przyjdź z prawdziwą bronią.');if((INV.gold||0)<120)return dlgRoot('Trening kosztuje 120 złota.');INV.gold-=120;saveInv();updHud();mastGain(Math.round(mastNeed(mastLvl(PRZ.mast[it.base]||0)+1)*0.35));dlgRoot('Dobra robota. Twoje ciosy są pewniejsze.')}]);
  return o}
// ---------- ZAGRODA I OGRÓD przy domu ----------
const PRODN={jajko:'jajka',mleko:'mleko',ziola:'zioła'};
const CROPS={marchew:{n:'Marchew',t:6,y:['marchew',3],c:'#ff9a3a'},zboze:{n:'Zboże',t:8,y:['ziarno',4],c:'#e8c860'},ziola:{n:'Zioła',t:10,y:['ziola',3],c:'#5ab04a'},jablon:{n:'Jabłoń karłowata',t:14,y:['jablko',4],c:'#d84a3a'}};
function animTick(){const now=Date.now();for(const [k,rate,cap,prod] of [['kura',4,4,'jajko'],['krowa',6,3,'mleko']]){const n=PRZ.anim[k]||0;if(!n)continue;const t0=PRZ.animT[k]||now;const made=Math.floor((now-t0)/(rate*60e3));if(made>0){PRZ.prod[prod]=Math.min(cap*n,(PRZ.prod[prod]||0)+made*n);PRZ.animT[k]=t0+made*rate*60e3}else if(!PRZ.animT[k])PRZ.animT[k]=now}}
function openFarm(){przWin('farm','🐔 Zagroda i ogród',renderFarm)}
function renderFarm(){const el=document.getElementById('przbody');if(!el||przCur!=='farm')return;animTick();const now=Date.now();
  let h=`<h3>Zagroda</h3><div class="prow"><b>🐔 Kury: ${PRZ.anim.kura||0}/3</b><small>jajko co 4 min</small><button data-pz="buy:kura" ${PRZ.anim.kura>=3?'disabled':''}>Kup kurę — 60 zł</button></div><div class="prow"><b>🐄 Krowa: ${PRZ.anim.krowa||0}/1</b><small>mleko co 6 min</small><button data-pz="buy:krowa" ${PRZ.anim.krowa>=1?'disabled':''}>Kup krowę — 220 zł</button></div>`;
  h+=`<div class="prow"><b>Zebrane: ${Object.entries(PRODN).map(([k,n])=>n+' '+(PRZ.prod[k]||0)).join(' · ')}</b><small>Składniki do nowych potraw przy ogniu (Y).</small></div><h3>Ogród — 4 grządki</h3>`;
  PRZ.garden.forEach((g,i)=>{if(!g){h+=`<div class="prow"><b>Grządka ${i+1}: pusta</b><small>Posadź:</small>${Object.entries(CROPS).map(([k,c])=>`<button data-pz="plant:${i}_${k}">${c.n} (${c.t} min)</button>`).join('')}</div>`;return}
    const C=CROPS[g.c],p=Math.min(1,(now-g.at)/(C.t*60e3));h+=`<div class="prow"><b style="color:${C.c}">Grządka ${i+1}: ${C.n}</b><small>${p>=1?'gotowe do zbioru':'rośnie: '+Math.round(p*100)+'%'}</small><button data-pz="harv:${i}" ${p>=1?'':'disabled'}>Zbierz</button></div>`});
  el.innerHTML=h}
function farmAct(a,v){if(a==='buy'){const pr=v==='kura'?60:220;if((INV.gold||0)<pr)return toast('Za mało złota','#ff8a7a');INV.gold-=pr;PRZ.anim[v]=(PRZ.anim[v]||0)+1;PRZ.animT[v]=PRZ.animT[v]||Date.now();saveInv();updHud();przSave();sfx('coin');achCheck();farmVis(true)}
  else if(a==='plant'){const [i,k]=v.split('_');PRZ.garden[+i]={c:k,at:Date.now()};przSave();farmVis(true)}
  else if(a==='harv'){const g=PRZ.garden[+v];if(!g)return;const C=CROPS[g.c];if(Date.now()-g.at<C.t*60e3)return;const [k,n]=C.y;if(k==='ziola')PRZ.prod.ziola=(PRZ.prod.ziola||0)+n;else{INV.food=INV.food||{};INV.food[k]=(INV.food[k]||0)+n}PRZ.garden[+v]=null;przSave();saveInv();toast('Zebrano: '+C.n+' ×'+n,C.c);farmVis(true)}renderFarm()}
let farmG=null,farmKey='';
function farmVis(force){const h=myHome();if(!h){if(farmG){scene.remove(farmG);farmG=null}return}const key=JSON.stringify([PRZ.anim,PRZ.garden.map(g=>g&&g.c),h.id]);if(farmG&&key===farmKey&&!force){if(farmG.parent!==scene)scene.add(farmG);return}
  if(farmG)scene.remove(farmG);farmKey=key;farmG=new THREE.Group();const c=Math.cos(h.ry),s=Math.sin(h.ry),x0=h.hx??h.x,z0=h.hz??h.z,L=(lx,lz)=>[x0+lx*c+lz*s,z0-lx*s+lz*c];
  // płot zagrody i grządki (w lokalnych współrzędnych domu)
  const fg=new THREE.Group(),fen=[];for(let i=0;i<=6;i++){fen.push([5.2+i*0.6,0.45,-1.5,0.12,0.9,0.12,'#7a5a3a'],[5.2+i*0.6,0.45,1.5,0.12,0.9,0.12,'#7a5a3a'])}fen.push([7.0,0.6,-1.5,3.7,0.1,0.08,'#8a6a44'],[7.0,0.6,1.5,3.7,0.1,0.08,'#8a6a44'],[8.8,0.6,0,0.08,0.1,3.0,'#8a6a44'],[5.2,0.6,-1.0,0.08,0.1,1.0,'#8a6a44'],[5.2,0.6,1.0,0.08,0.1,1.0,'#8a6a44']);
  for(let i=0;i<4;i++)fen.push([-5.4-(i%2)*1.6,0.12,-1.2+Math.floor(i/2)*2.2,1.3,0.22,1.9,'#5a3a22']);
  const fm=new THREE.Mesh(boxes(fen),matB);fg.add(fm);fg.position.set(x0,h.y,z0);fg.rotation.y=h.ry;farmG.add(fg);
  PRZ.garden.forEach((g,i)=>{if(!g)return;const C=CROPS[g.c],p=Math.min(1,(Date.now()-g.at)/(C.t*60e3)),pl=[];for(let k=0;k<4;k++)pl.push([-0.35+(k%2)*0.7,0.3+0.35*p,-0.5+Math.floor(k/2)*1.0,0.25+0.2*p,0.5*p+0.1,0.25+0.2*p,p>=1?C.c:'#5a9a4a']);const m=new THREE.Mesh(boxes(pl),matB);m.position.set(-5.4-(i%2)*1.6,0,-1.2+Math.floor(i/2)*2.2);fg.add(m)});
  let ai=0;for(const [k,n] of [['kura',PRZ.anim.kura||0],['krowa',PRZ.anim.krowa||0]])for(let i=0;i<n;i++){try{const m=makeEnemy(k,false);const [ax,az]=L(6.2+(ai%3)*0.9,-0.6+Math.floor(ai/3)*1.2+(k==='krowa'?0.4:0));const ay=colAt(ax,az);m.position.set(ax,(ay??h.y),az);m.rotation.y=h.ry+ai;m.userData.farm=1;farmG.add(m);ai++}catch(_){}}
  scene.add(farmG)}
function farmNear(){const h=myHome();if(!h||SPC)return false;const c=Math.cos(h.ry),s=Math.sin(h.ry),x0=h.hx??h.x,z0=h.hz??h.z;for(const [lx,lz] of [[5.0,2.6],[-6.2,2.2]]){const x=x0+lx*c+lz*s,z=z0-lx*s+lz*c;if(Math.hypot(x-player.p.x,z-player.p.z)<1.8&&Math.abs(player.p.y-h.y)<3)return true}return false}
// nowe potrawy z zagrody i ogrodu
Object.assign(MEALS,{
  jajecznica:{n:'Jajecznica na boczku',c:'#ffe08a',need:{jajko:2,mieso:1},d:'+10% obrony i +10% zdrowia',f:s=>{s.def*=1.1;s.hp*=1.1}},
  nalesniki:{n:'Naleśniki z miodem',c:'#f0c870',need:{mleko:1,jajko:1,ziarno:1},d:'+12% szybkości ataku',f:s=>{s.haste+=12}},
  napar:{n:'Napar ziołowy',c:'#7ad15a',need:{ziola:2},d:'+3 regeneracji',f:s=>{s.regen+=3}}});
{const _h=haveIng,_t=takeIng,_n=ingName;haveIng=k=>PRODN[k]?(PRZ.prod[k]||0):_h(k);takeIng=(k,n)=>{if(PRODN[k]){PRZ.prod[k]=Math.max(0,(PRZ.prod[k]||0)-n);return}return _t(k,n)};ingName=k=>({jajko:'jajko',mleko:'mleko',ziola:'zioła'})[k]||_n(k)}
// ---------- PORÓWNYWANIE ŁUPÓW i sprzedaż słabszych ----------
function itemPow(it){if(!it)return 0;const u=1+0.1*(it.up||0);let p=0;if(it.dmg!=null)p+=it.dmg*u*(it.spd||1)*3;p+=(it.def||0)*u*2+(it.hp||0)*u/5+(it.hpb||0)/5+(it.crit||0)+(it.haste||0);if(it.gem)p+=4;if(it.art)p+=12;return p}
function eqFor(it){if(!it)return null;if(it.slot==='bron'){const r=!!WEAP[it.base]?.proj,b=INV.eq.bron,d=INV.eq.dyst;if(b&&!!WEAP[b.base]?.proj===r)return b;if(d&&!!WEAP[d.base]?.proj===r)return d;return b||d}return INV.eq[it.slot]}
function cmpMark(it){const e=eqFor(it);if(!e||it.base==='latarnia')return 0;const a=itemPow(it),b=itemPow(e);return a>b*1.03?1:a<b*0.97?-1:0}
function weakerBag(){return INV.bag.map((it,i)=>[it,i]).filter(([it])=>it&&it.slot&&!it.art&&!it.set2&&!it.frak&&cmpMark(it)<0)}
function sellWeaker(){if(!TRADE)return;const L=weakerBag();if(!L.length)return toast('Nie masz słabszych przedmiotów niż założone','#cfcfcf');let g=0;for(const [it] of L){g+=Math.round(itemVal(it)*0.45/pmod(TRADE.n))}const set=new Set(L.map(x=>x[0]));INV.bag=INV.bag.filter(it=>!set.has(it));INV.gold+=g;saveInv();updHud();sfx('coin');toast(`Sprzedano ${L.length} słabszych przedmiotów: +${g} zł`,'#ffd34d');tradeRender()}
function decoBag(sel,attr){for(const el of document.querySelectorAll(sel)){const i=+el.dataset[attr],it=INV.bag[i];el.classList.remove('cmpup','cmpdn');if(!it)continue;const m=cmpMark(it);if(m>0)el.classList.add('cmpup');else if(m<0)el.classList.add('cmpdn')}}
{const _ri=renderInv;renderInv=function(){const r=_ri.apply(this,arguments);try{decoBag('#bag [data-bag]','bag')}catch(_){}return r}}
{const _tr=tradeRender;tradeRender=function(){const r=_tr.apply(this,arguments);try{decoBag('#tradesell [data-tsell]','tsell');let b=document.getElementById('sellweak');if(!b){b=document.createElement('button');b.id='sellweak';b.onclick=()=>sellWeaker();const cb=document.querySelector('#tradeui .cbtns');if(cb)cb.insertBefore(b,cb.firstChild)}const n=weakerBag().length;b.textContent='Sprzedaj słabsze niż założone ('+n+')';b.disabled=!n}catch(_){}return r}}
// ---------- integracja ----------
{const _qk=questKill;questKill=function(L){try{const d=EDEF[L.et];if(d&&!d.passive){stInc('kill');if(d.boss)stInc('boss');if(/smok|wiwern/.test(L.et))stInc('smok');mastGain(5)}}catch(_){}return _qk(L)}}
{const _oc=openChest;openChest=function(s,remote){const r=_oc.apply(this,arguments);try{if(s&&s.type==='oboz'&&!remote&&!guardsAlive(s))campCleared(s)}catch(_){}return r}}
{const _fq=finishQuest;finishQuest=function(q,n,gen){stInc('quest');if(q&&q.hard)chronAdd(S.name+' wykonuje trudne zadanie: '+q.title+'.',true);return _fq.apply(this,arguments)}}
{const _td=tmapDig;tmapDig=function(t){stInc('skarb');chronAdd(S.name+' wykopuje skarb.',false);return _td(t)}}
{const _cm=cookMeal;cookMeal=function(k){const n0=PRZ.meals[k]||0;_cm(k);if((PRZ.meals[k]||0)>n0)stInc('cook')}}
{const _sp=shrinePray;shrinePray=function(s){_sp(s);achCheck()}}
{const _ma=makeArtifact;makeArtifact=function(l,a){const it=_ma(l,a);try{chronAdd(S.name+' zdobywa artefakt: '+it.name+'.',true)}catch(_){}return it}}
{const _bh=buyHome;buyHome=function(v,price){const had=!!myHome();_bh(v,price);if(!had&&myHome())chronAdd(S.name+' kupuje dom w osadzie '+v.name+'.',true);achCheck()}}
{const _st=stats;stats=function(){const s=_st();try{const A=ACH.find(a=>a[0]===PRZ.title);if(A&&PRZ.ach[A[0]])A[5](s);const it=INV.eq.bron;if(it&&MFAM[it.base]){const l=mastLvl(PRZ.mast[it.base]||0);s.dmg*=1+0.015*l}}catch(_){}return s}}
// dodatkowe przyciski w oknach
{const _pa=przAct;przAct=function(a){const [k,v]=a.split(':');
  if(k==='twgo')return towerGo(v);if(k==='twup'){const tn=towerNear();if(tn)towerClimb(tn[0]);return przClose()}
  if(k==='fg')return fairStart(v);if(k==='shoot')return shootFire();if(k==='push')return wrestPush('');
  if(k==='buy'||k==='plant'||k==='harv')return farmAct(k,v);if(k==='title')return titleSet(v);if(k==='alb'){albCat=v;return renderBook()}if(k==='bk')return bookTab=v,renderBook();return _pa(a)}}
// ---------- KSIĘGA BOHATERA (O): bestie, osiągnięcia, mistrzostwo, kronika ----------
let bookTab='best';
function openBook(){przWin('book','📖 Księga bohatera',renderBook)}
function renderBook(){const el=document.getElementById('przbody');if(!el||przCur!=='book')return;const T={best:'Album bestii',ach:'Osiągnięcia i tytuły',mast:'Mistrzostwo broni',chron:'Kronika świata'};
  let h=`<div class="ptabs">${Object.entries(T).map(([k,n])=>`<button data-pz="bk:${k}" class="${bookTab===k?'on':''}">${n}</button>`).join('')}</div><div id="bookin"></div>`;el.innerHTML=h;const bi=document.getElementById('bookin');
  if(bookTab==='best'){przCur='alb';const keep=el.innerHTML;renderAlbum();const albH=el.innerHTML;przCur='book';el.innerHTML=h;document.getElementById('bookin').innerHTML=albH;return}
  if(bookTab==='ach'){const got=ACH.filter(a=>PRZ.ach[a[0]]).length;bi.innerHTML=`<p class="sub2">Zdobyto ${got} z ${ACH.length}. Noszony tytuł widać nad twoją postacią u innych graczy i daje premię.${PRZ.title?' Teraz: <b>„'+titleName()+'”</b>':''}</p>`+ACH.map(a=>{const ok=!!PRZ.ach[a[0]],on=PRZ.title===a[0];return `<div class="prow" style="${ok?'':'opacity:.55'}"><b style="color:${ok?'#ffd34d':'#bbb'}">${ok?'🏆':'🔒'} ${a[1]}</b><small>${a[2]} · premia: ${a[4]}</small>${ok?`<button data-pz="title:${on?'':a[0]}">${on?'Zdejmij tytuł':'Noś tytuł'}</button>`:''}</div>`}).join('');return}
  if(bookTab==='mast'){bi.innerHTML='<p class="sub2">Mistrzostwo rośnie z każdym trafieniem i pokonanym wrogiem. Każdy poziom: +1,5% obrażeń tą bronią. Poziom 3 odblokowuje ruch mistrzowski (klawisz 9), poziom 6 go wzmacnia.</p>'+Object.keys(MFAM).map(b=>{const x=PRZ.mast[b]||0,l=mastLvl(x),nx=l<10?mastNeed(l+1):0,M=MMOVE[MFAM[b]];return `<div class="prow"><b>${WEAP[b].n}: ${l}/10</b><small>${l<10?`${x}/${nx} pkt`:'mistrz'} · ${M[0]}${l>=3?' ✓':' (od 3 poz.)'} — ${M[1]}</small><div class="mbar"><i style="width:${l>=10?100:Math.round((x-(l?mastNeed(l):0))/Math.max(1,nx-(l?mastNeed(l):0))*100)}%"></i></div></div>`}).join('');return}
  if(bookTab==='chron'){bi.innerHTML=PRZ.chron.length?PRZ.chron.slice(0,120).map(c=>`<div class="prow"><small style="flex:none;min-width:110px">${new Date(c.t).toLocaleString('pl-PL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}</small><b style="font-weight:400">${esc(c.txt)}</b></div>`).join(''):'<p class="sub2">Kronika jest jeszcze pusta. Pokonuj bossów, zdobywaj wieże i artefakty, a twoje czyny zostaną zapisane.</p>'}}
whenReady(()=>{
  FXH.chron=m=>{if(typeof m.txt==='string'){PRZ.chron.unshift({t:Date.now(),txt:m.txt.slice(0,200),who:m.from});if(PRZ.chron.length>200)PRZ.chron.length=200;przSave()}};
  FXH.leg=m=>{LEGE={id:m.eid,n:String(m.n||'').slice(0,40),sc:+m.sc||1.5}};
  FXH.legd=m=>{legDead(String(m.n||'').slice(0,40));LEGE=null};
  // F: wieża, gry jarmarczne, zagroda
  const oldHut=window.hutAct;window.hutAct=function(){const tn=towerNear();if(tn){if(tn[1]==='top'){const t=tn[0];player.p.set(t.x,t.y+1,t.z-3.2);player.v.set(0,0,0);return true}if(PRZ.tw[tn[0].id])towerTravel(tn[0]);else towerClimb(tn[0]);return true}if(fairHere()){openFair();return true}if(farmNear()){openFarm();return true}return oldHut?oldHut():false};
  addEventListener('keydown',e=>{if(e.repeat||document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;
    if(FG&&FG.k==='shoot'&&przCur==='fair'&&e.code==='Space'){shootFire();e.preventDefault();e.stopImmediatePropagation();return}
    if(FG&&FG.k==='wrest'&&przCur==='fair'&&(e.code==='KeyA'||e.code==='KeyD')){wrestPush(e.code);e.preventDefault();e.stopImmediatePropagation();return}
    if(!$('chatbox').hidden||custOpen()||dlg)return;
    if(e.code==='Digit9'){mastMove();e.preventDefault()}
    if(e.code==='KeyO'&&przCur!=='book'){e.stopImmediatePropagation();e.preventDefault();openBook()}else if(e.code==='KeyO'&&przCur==='book'){e.stopImmediatePropagation();e.preventDefault();przClose()}},true);
  let slow=0,lastP=null;
  TICKS.push(dt=>{if(mastCd>0)mastCd-=dt;fairTick(dt);raceTick(dt);legTick(dt);
    if(lastP&&!SPC&&!P2.dead){const d=Math.hypot(player.p.x-lastP[0],player.p.z-lastP[1]);if(d<30)PRZ.stat.dist=(PRZ.stat.dist||0)+d}lastP=[player.p.x,player.p.z];
    slow-=dt;if(slow<=0){slow=1;towerTick();farmVis();animTick();achCheck();if(przCur==='farm')renderFarm()}
    const tn=towerNear(),fh=fairHere(),fn=farmNear();if((tn||fh||fn)&&!dlg&&!nearNpc&&!RACE){const pr=$('prompt');pr.hidden=false;pr.innerHTML=tn?(tn[1]==='top'?'<kbd>F</kbd> Zejdź z wieży':PRZ.tw[tn[0].id]?'<kbd>F</kbd> '+esc(tn[0].n)+' — szybka podróż':'<kbd>F</kbd> Wejdź na wieżę i zdobądź ją'):fh?'<kbd>F</kbd> Gry jarmarczne':'<kbd>F</kbd> Zagroda i ogród'}});
  achCheck();
});
