// =================== v152: PRZYGODA — tablica zleceń, łączone ataki, rzemiosło, zestawy, artefakty, dom, wydarzenia, skarby, kapliczki, pogoda, wierzchowce, dyliżans, album, gotowanie ===================
const PRZ_DAY=()=>Math.floor(Date.now()/864e5);
function przSave(){LS.set('prz_'+S.seed,PRZ)}
const PRZ=Object.assign({mat:{sztaby:0,esencja:0},best:{},meals:{},buf:{},tmaps:[],shr:{},chest:[],stand:{},warm:0,fires:[]},LS.get('prz_'+(S.seed||''),{})||{});
PRZ.mat=PRZ.mat||{sztaby:0,esencja:0};PRZ.best=PRZ.best||{};PRZ.meals=PRZ.meals||{};PRZ.tmaps=PRZ.tmaps||[];PRZ.shr=PRZ.shr||{};PRZ.chest=PRZ.chest||[];PRZ.stand=PRZ.stand||{};PRZ.buf=PRZ.buf||{};
const PBUF={};/* aktywne premie: k -> {t (s), n, c} */
function buffSet(k,t,n,c){PBUF[k]={t,n,c};afterBuff()}
function afterBuff(){try{const r=P2.hp/ST.hp;ST=stats();P2.hp=Math.min(ST.hp,Math.max(1,r*ST.hp))}catch(_){}przBar()}
function przBar(){let el=document.getElementById('przbuf');if(!el){el=document.createElement('div');el.id='przbuf';document.body.appendChild(el)}
  const L=[];for(const k in PBUF){const b=PBUF[k];L.push(`<span style="border-color:${b.c}"><b style="color:${b.c}">${b.n}</b>${b.t<9e8?' '+Math.ceil(b.t/60)+' min':''}</span>`)}el.innerHTML=L.join('');el.hidden=!L.length}

// ---------- 1. ŁĄCZONE ATAKI: uderzenie tarczą ogłusza, a cios innego gracza (albo twój po ogłuszeniu przez kompana) trafia krytycznie ----------
function shieldBash(){if((P2.bashCd||0)>0||P2.dead||!player.ready||invOpen()||uiOpen()||VH.mode)return;P2.bashCd=1.4;
  const fx=Math.sin(player.ry),fz=Math.cos(player.ry);let n=0;
  for(const e of enemies.values()){if(e.st===2||e.car||EDEF[e.t].ally||e.pas)continue;const dx=e.p.x-player.p.x,dz=e.p.z-player.p.z,d=Math.hypot(dx,dz),r=2.6+eSc(e)*0.4;if(d>r||Math.abs(e.p.y-player.p.y)>2.5)continue;if(d>0.5&&(dx*fx+dz*fz)/d<0.35)continue;
    dealHit(e,ST.dmg*0.35,false,fx*1.6,fz*1.6,0,1.6);n++}
  P2.atkT=0.25;sfx('block',0.8);fxNum(player.p.x+fx,player.p.y+2.2,player.p.z+fz,n?'Uderzenie tarczą!':'Pudło','#cfe8ff')}
function comboCheck(e){return e&&e.stunU>nowS()&&e.stunBy!==NET.id}
function stunNote(e,dur,local){e.stunU=nowS()+dur;e.stunBy=local?NET.id:'kompan';if(local)sendFx({k:'stn',eid:e.id,d:dur})}

// ---------- 2. TABLICA ZLECEŃ DRUŻYNOWYCH (u starszego wioski) ----------
function dlgBoard(){const n=dlg.n;const mine=W.quests.find(q=>q.giver===n.id);
  if(mine)return dlgShow('Najpierw dokończ zlecenie, które już ode mnie wziąłeś: '+mine.title+'.',[['Wróć.',()=>dlgRoot()]]);
  if(W.quests.length>=QMAX)return dlgShow('Masz pełny dziennik ('+W.quests.length+' zadań). Ukończ albo porzuć któreś zadanie.',[['Wróć.',()=>dlgRoot()]]);
  const day=PRZ_DAY(),L=[];
  for(let k=0;k<3;k++){let q=null;for(let t=0;t<16&&!(q&&q.hard);t++){try{q=genQuest0(Object.assign({},n,{id:n.id+'#tz'+day+'_'+k+'_'+t,role:'starszy'}))}catch(_){q=null}}
    if(!q)continue;q.id='tz'+n.id+'_'+day+'_'+k;q.giver=n.id;q.party=1;q.rw.gold=Math.round(q.rw.gold*1.5);q.rw.xp=Math.round(q.rw.xp*1.5);q.rw.item=1;q.title='⚔ '+q.title;L.push(q)}
  if(!L.length)return dlgShow('Tablica jest dziś pusta. Wróć jutro.',[['Wróć.',()=>dlgRoot()]]);
  const done=W.qdoneIds||{};
  dlgShow('Na tablicy wiszą zlecenia dla drużyny. Nagroda jest półtora raza większa i trafia do każdego członka drużyny. Zlecenia zmieniają się każdego dnia.',
    L.map(q=>[done[q.id]?q.title+' — wykonane dziś':`${q.title} — ${q.rw.gold} zł, ${q.rw.xp} PD + przedmiot`,()=>{if(done[q.id])return dlgBoard();dlgShow(q.desc+' (zlecenie drużynowe)',[['Bierzemy to.',()=>{W.quests.push(q);qNet({k:'qadd',q,nm:S.name});saveW();toast('Nowe zlecenie drużynowe: '+q.title,'#ffd34d');dlgRoot('Powodzenia. Wróćcie z dobrymi wieściami.')}],['Wróć do tablicy.',()=>dlgBoard()]])},!!done[q.id]]).concat([['Wróć.',()=>dlgRoot()]]))}

// ---------- 3. RZEMIOSŁO: przetapianie łupów, ulepszanie z materiałów, kradzież życia ----------
const SALV=it=>({s:1+it.rar+Math.floor((it.lvl||1)/6),e:it.rar>=2?it.rar-1:0});
function matTxt(){return `${PRZ.mat.sztaby} sztab, ${PRZ.mat.esencja} esencji`}
function dlgSalvage(){const opts=[];const bag=INV.bag.map((it,i)=>[it,i]).filter(([it])=>it&&it.slot&&!it.art);
  const cheap=bag.filter(([it])=>it.rar<=1);
  if(cheap.length)opts.push([`🔥 Przetop wszystkie zwykłe i niezwykłe (${cheap.length} szt.)`,()=>{let s=0,e=0;for(const [it] of cheap){const y=SALV(it);s+=y.s;e+=y.e}INV.bag=INV.bag.filter(it=>!(it&&it.slot&&!it.art&&it.rar<=1));PRZ.mat.sztaby+=s;PRZ.mat.esencja+=e;przSave();afterInv();sfx('clang',0.6);toast(`Przetopiono: +${s} sztab${e?', +'+e+' esencji':''}`,'#ffb050');dlgSalvage()}]);
  for(const [it,i] of bag.slice(0,14)){const y=SALV(it);opts.push([`${it.name} (${RAR[it.rar].n}) → ${y.s} sztab${y.e?' + '+y.e+' esencji':''}`,()=>{const j=INV.bag.indexOf(it);if(j<0)return dlgSalvage();INV.bag.splice(j,1);PRZ.mat.sztaby+=y.s;PRZ.mat.esencja+=y.e;przSave();afterInv();sfx('clang',0.6);dlgSalvage()}])}
  opts.push(['Wróć.',()=>dlgSmith()]);dlgShow(`Przetapiam zbędne łupy z plecaka na sztaby żelaza, a rzadkie przedmioty także na esencję. Masz: ${matTxt()}.`,opts)}
function upMatCost(up){return{s:(up+1)*3,e:up>=5?up-3:0}}
function dlgUpMat(){const opts=[];for(const [k] of SLOTS){const it=INV.eq[k];if(!it)continue;const up=it.up||0;if(up>=10){opts.push([`${it.name} +10 — maksymalnie`,()=>{},true]);continue}
    const c=upMatCost(up);opts.push([`${it.name}${up?' +'+up:''} → +${up+1} — ${c.s} sztab${c.e?' + '+c.e+' esencji':''}`,()=>{if(PRZ.mat.sztaby<c.s||PRZ.mat.esencja<c.e)return toast('Za mało materiałów','#ff8a7a');PRZ.mat.sztaby-=c.s;PRZ.mat.esencja-=c.e;it.up=up+1;przSave();afterInv();sfx('clang');toast(it.name+' +'+it.up,RAR[it.rar].c);dlgUpMat()}])}
  opts.push(['Wróć.',()=>dlgSmith()]);dlgShow(`Ulepszę ekwipunek za materiały zamiast złota. Masz: ${matTxt()}.`,opts)}

// ---------- 4. ZESTAWY PRZEDMIOTÓW (z bossów i elit) ----------
const SETS2={
  swit:{n:'Komplet Strażnika Świtu',c:'#ffe08a',p:{helm:'Hełm',zbroja:'Napierśnik',rekawice:'Rękawice',buty:'Nagolenice'},b:[[2,'+10% obrony'],[4,'+15% zdrowia, +2 regeneracji']]},
  noc:{n:'Komplet Nocnego Łowcy',c:'#9a8aff',p:{helm:'Kaptur',zbroja:'Kaftan',rekawice:'Karwasze',buty:'Buty'},b:[[2,'+8% krytyka'],[4,'+12% obrażeń, +8% szybkości ruchu']]},
  burza:{n:'Komplet Kowala Burzy',c:'#8fd8ff',p:{helm:'Hełm',zbroja:'Zbroja',rekawice:'Rękawice',buty:'Buty'},b:[[2,'+10% szybkości ataku'],[4,'+10% obrażeń, +6 obrony']]}};
function set2Counts(){const c={};for(const k of ['helm','zbroja','rekawice','buty']){const it=INV.eq[k];if(it&&it.set2)c[it.set2]=(c[it.set2]||0)+1}return c}
function makeSetPiece(lvl,key,slot){const S2=SETS2[key];slot=slot||pick(['helm','zbroja','rekawice','buty']);const it=genItem(lvl,40,slot);it.rar=Math.max(3,it.rar);for(const s of ['def','hp'])if(it[s])it[s]=+(it[s]*1.15).toFixed(1);it.set2=key;it.name=S2.p[slot]+' — '+S2.n.replace('Komplet ','');return it}

// ---------- 5. ARTEFAKTY z historią (z bossów) ----------
const ARTS=[
  {id:'kiel',slot:'bron',base:'miecz',var:'dlugi',n:'Kieł Pierwszego Wilka',lore:'Wykuty z kła wilka, który prowadził watahy, zanim powstały pierwsze wioski.',fx:{crit:12,ls:4},fxt:'+12% krytyka, kradzież życia 4%'},
  {id:'mlot',slot:'bron',base:'mlot',var:'wielki',n:'Młot Siedmiu Kuźni',lore:'Siedmiu krasnoludzkich mistrzów kuło go po kolei przez siedem zim.',fx:{dmgP:15},fxt:'+15% obrażeń'},
  {id:'luk',slot:'bron',base:'luk',var:'elfi',n:'Łuk Szeptu Liści',lore:'Elfy mówią, że jego cięciwa zrobiona jest z promienia księżyca.',fx:{haste:15,crit:6},fxt:'+15% szybkości ataku, +6% krytyka'},
  {id:'tarcza',slot:'tarcza',n:'Tarcza Ostatniej Bramy',lore:'Wytrzymała oblężenie, które trwało rok i jeden dzień.',fx:{defP:15,hpb:40},fxt:'+15% obrony, +40 zdrowia'},
  {id:'helm',slot:'helm',n:'Korona Zapomnianego Króla',lore:'Nikt nie pamięta jego imienia. Korona pamięta.',fx:{regen:2,hpb:30},fxt:'+2 regeneracji, +30 zdrowia'},
  {id:'amulet',slot:'amulet',n:'Oko Burzy',lore:'Bursztyn, w którym zastygła błyskawica.',fx:{move:0.1,haste:8},fxt:'+10% szybkości ruchu, +8% szybkości ataku'},
  {id:'pierscien',slot:'pierscien',n:'Pierścień Kruczej Nocy',lore:'Kruki siadają na ramieniu tego, kto go nosi.',fx:{crit:10,ls:3},fxt:'+10% krytyka, kradzież życia 3%'},
  {id:'buty',slot:'buty',n:'Buty Wędrowca Mgieł',lore:'Ich właściciel przeszedł podobno całą krainę w jedną noc.',fx:{move:0.15},fxt:'+15% szybkości ruchu'}];
function makeArtifact(lvl,a){a=a||pick(ARTS);const it=genItem(lvl+2,80,a.slot);it.rar=4;if(a.base&&it.slot==='bron'){it.base=a.base;const V=WEAPV[a.base].find(v=>v[0]===a.var)||WEAPV[a.base][0];it.var=V[0];it.dmg=+(WEAP[a.base].dmg*(1+0.13*(lvl+1))*RMUL[4]*V[2]).toFixed(1);it.spd=+(WEAP[a.base].spd*V[3]).toFixed(2)}
  for(const s of ['dmg','def','hp'])if(it[s])it[s]=+(it[s]*1.1).toFixed(1);it.art=a.id;it.name=a.n;return it}
function artOf(it){return it&&it.art?ARTS.find(a=>a.id===it.art):null}

// ---------- statystyki: zestawy, artefakty, premie, zimno ----------
{const _st=stats;stats=function(){const s=_st();try{
  const sc=set2Counts();for(const k in sc){const n=sc[k];if(n>=2){if(k==='swit')s.def*=1.1;if(k==='noc')s.crit+=8;if(k==='burza')s.haste+=10}if(n>=4){if(k==='swit'){s.hp*=1.15;s.regen+=2}if(k==='noc'){s.dmg*=1.12;s.move*=1.08}if(k==='burza'){s.dmg*=1.1;s.def+=6}}}
  s.ls=0;for(const [k] of SLOTS){if(k==='dyst')continue;const a=artOf(INV.eq[k]);if(!a)continue;const f=a.fx;if(f.crit)s.crit+=f.crit;if(f.haste)s.haste+=f.haste;if(f.regen)s.regen+=f.regen;if(f.hpb)s.hp+=f.hpb;if(f.move)s.move*=1+f.move;if(f.dmgP)s.dmg*=1+f.dmgP/100;if(f.defP)s.def*=1+f.defP/100;if(f.ls)s.ls+=f.ls}
  if(INV.eq.bron&&INV.eq.bron.ench==='wampir')s.ls+=5;
  for(const k in PBUF){const b=PBUF[k];if(b.f)b.f(s)}
  }catch(_){}return s}}

// ---------- 6. GOTOWANIE i ognisko ----------
const MEALS={
  pieczen:{n:'Pieczeń z rożna',c:'#ff9a5a',need:{mieso:2},d:'+15% obrażeń',f:s=>{s.dmg*=1.15}},
  zupa:{n:'Zupa rybna',c:'#8fd8ff',need:{ryba:2},d:'+2 regeneracji zdrowia',f:s=>{s.regen+=2}},
  placek:{n:'Placek z jagodami',c:'#c8a0ff',need:{jagody:1,ziarno:1},d:'+12% szybkości ruchu',f:s=>{s.move*=1.12}},
  gulasz:{n:'Gulasz myśliwski',c:'#d9a27c',need:{mieso:1,marchew:1,jablko:1},d:'+20% zdrowia',f:s=>{s.hp*=1.2}},
  kurczak:{n:'Kurczak z ziołami',c:'#ffd34d',need:{kurczak:1,ziarno:1},d:'+8% krytyka i +5% szybkości ataku',f:s=>{s.crit+=8;s.haste+=5}}};
function haveIng(k){if(k==='ryba')return fishCount();return (INV.food&&INV.food[k])||0}
function takeIng(k,n){if(k==='ryba'){for(const f in (INV.fish||{})){while(n>0&&INV.fish[f]>0){INV.fish[f]--;n--}if(!INV.fish[f])delete INV.fish[f]}return}INV.food[k]-=n;if(INV.food[k]<=0)delete INV.food[k]}
function ingName(k){return k==='ryba'?'ryba':(typeof foodName==='function'?foodName(k):k).toLowerCase()}
function nearFire(){const p=player.p;for(const f of PRZ.fires)if(Math.hypot(f.x-p.x,f.z-p.z)<5&&f.until>Date.now())return true;for(const h of (W.huts||[]))if(Math.hypot(h.x-p.x,h.z-p.z)<6)return true;return false}
function placeFire(){if(SPC)return toast('Tu nie rozpalisz ogniska','#ff8a7a');const fx=Math.sin(player.ry)*1.6,fz=Math.cos(player.ry)*1.6,x=player.p.x+fx,z=player.p.z+fz,h=colAt(x,z);if(h===null||h<WATER+0.2)return toast('Tu jest za mokro','#ff8a7a');
  const f={id:PID+':'+Date.now(),x,y:h,z,until:Date.now()+5*60e3};PRZ.fires=PRZ.fires.filter(q=>q.until>Date.now()&&!String(q.id).startsWith(PID+':'));PRZ.fires.push(f);sendFx({k:'fire',f});sfx('crackle',0.8);toast('Rozpalono ognisko (5 min)','#ffb050');renderCook()}
const fireM=new Map();
function fireTick(dt){const now=Date.now();PRZ.fires=PRZ.fires.filter(f=>f.until>now);for(const [id,g] of fireM){if(!PRZ.fires.find(f=>f.id===id)){scene.remove(g);fireM.delete(id)}}
  for(const f of PRZ.fires){let g=fireM.get(f.id);if(!g){g=new THREE.Group();g.add(new THREE.Mesh(boxes([[0,0.08,0,0.9,0.12,0.16,'#5a3a22'],[0,0.08,0,0.16,0.12,0.9,'#4a2e1a'],[0.3,0.04,0.3,0.2,0.08,0.2,'#7a7a7a'],[-0.32,0.04,0.28,0.2,0.08,0.2,'#6a6a6a'],[0.3,0.04,-0.3,0.2,0.08,0.2,'#7a7a7a'],[-0.3,0.04,-0.3,0.2,0.08,0.2,'#6a6a6a']]),matB));
      const fl=new THREE.Mesh(boxes([[0,0.35,0,0.34,0.5,0.34,'#ff8a2e'],[0,0.55,0,0.2,0.4,0.2,'#ffd34d']]),GLOWMAT);g.add(fl);g.userData.fl=fl;g.position.set(f.x,f.y,f.z);scene.add(g);fireM.set(f.id,g)}
    const fl=g.userData.fl;fl.scale.set(1,0.8+Math.sin(performance.now()/80+f.x)*0.2,1);if(Math.random()<dt*6)PFX.emit(f.x,f.y+0.7,f.z,1,['#ff8a2e','#ffd34d','#5a5a5a'],{sp:0.4,up:1.6,life:0.8,size:0.06})}}
function openCook(){przWin('cook','🔥 Ognisko i gotowanie',renderCook)}
function renderCook(){const el=document.getElementById('przbody');if(!el||przCur!=='cook')return;const fire=nearFire();let h='';
  h+=fire?'<p class="sub2">Siedzisz przy ogniu — możesz gotować.</p>':'<p class="sub2">Nie ma ognia w pobliżu. Rozpal ognisko albo podejdź do swojego szałasu lub domu.</p><button data-pz="fire">🔥 Rozpal ognisko tutaj</button>';
  h+='<h3>Przepisy</h3>';for(const k in MEALS){const M=MEALS[k],ok=Object.entries(M.need).every(([i,n])=>haveIng(i)>=n);h+=`<div class="prow"><b style="color:${M.c}">${M.n}</b><small>${M.d} · 10 min · potrzeba: ${Object.entries(M.need).map(([i,n])=>`${n}× ${ingName(i)} (${haveIng(i)})`).join(', ')}</small><button data-pz="cook:${k}" ${fire&&ok?'':'disabled'}>Ugotuj</button></div>`}
  const have=Object.entries(PRZ.meals).filter(([k,n])=>n>0&&MEALS[k]);h+='<h3>Twoje potrawy</h3>'+(have.length?have.map(([k,n])=>`<div class="prow"><b style="color:${MEALS[k].c}">${MEALS[k].n} ×${n}</b><small>${MEALS[k].d}</small><button data-pz="eat:${k}">Zjedz</button></div>`).join(''):'<p class="sub2">Brak. Składniki zdobywasz z łupów, połowu ryb i od kupców.</p>');
  el.innerHTML=h}
function cookMeal(k){const M=MEALS[k];if(!M||!nearFire())return;for(const [i,n] of Object.entries(M.need))if(haveIng(i)<n)return toast('Brakuje składników','#ff8a7a');for(const [i,n] of Object.entries(M.need))takeIng(i,n);PRZ.meals[k]=(PRZ.meals[k]||0)+1;saveInv();przSave();sfx('crackle',0.6);toast('Ugotowano: '+M.n,M.c);renderCook()}
function eatMeal(k){const M=MEALS[k];if(!M||!(PRZ.meals[k]>0))return;PRZ.meals[k]--;przSave();PBUF.meal={t:600,n:'🍲 '+M.n,c:M.c,f:M.f};afterBuff();sfx('click',0.6);toast('Zjedzono: '+M.n+' ('+M.d+', 10 min)',M.c);renderCook()}

// ---------- okna dodatków (wspólny panel) ----------
let przCur=null;
function przWin(id,title,render){let el=document.getElementById('przui');if(!el){el=document.createElement('div');el.id='przui';el.className='pane';el.hidden=true;el.innerHTML='<div class="przhead"><h2 id="przttl"></h2><button id="przx">✕</button></div><div id="przbody"></div>';document.body.appendChild(el);
    el.addEventListener('click',e=>{const b=e.target.closest('[data-pz]');if(b&&!b.disabled)przAct(b.dataset.pz);if(e.target.id==='przx')przClose()})}
  przCur=id;document.getElementById('przttl').textContent=title;el.hidden=false;try{document.exitPointerLock()}catch(_){}render()}
function przClose(){const el=document.getElementById('przui');if(el)el.hidden=true;przCur=null}
function przAct(a){const [k,v]=a.split(':');
  if(k==='fire')placeFire();else if(k==='cook')cookMeal(v);else if(k==='eat')eatMeal(v);
  else if(k==='hc')homeChestMove(+v,1);else if(k==='hb')homeChestMove(+v,0);else if(k==='stand')standSwap();else if(k==='hcook')openCook();else if(k==='hchest')przWin('chest','📦 Skrzynia w domu',renderChest);else if(k==='hstand')przWin('stand','🛡 Stojak na zbroję',renderStand);else if(k==='hsleep'){przClose();toast('Podejdź do łóżka i naciśnij F, żeby się przespać','#cfe8ff')}
  else if(k==='alb')albCat=v,renderAlbum()}

// ---------- 7. DOM GRACZA (działka u starszego) ----------
const HOMEPRICE=800;
function myHome(){return (W.huts||[]).find(h=>h.kind==='dom'&&h.pid===PID+'#dom')}
function dlgBuyHome(){const n=dlg.n,v=villages.get(n.vid);if(myHome())return dlgShow('Masz już dom. Możesz go przenieść tutaj za 200 zł.',[['Przenieś dom tutaj — 200 zł',()=>buyHome(v,200)],['Wróć.',()=>dlgRoot()]]);
  dlgShow(`Za ${HOMEPRICE} zł sprzedam ci działkę na skraju osady i postawimy na niej dom: łóżko (punkt odrodzenia), skrzynia na łupy, stojak na zbroję i palenisko do gotowania.`,[[`Kupuję — ${HOMEPRICE} zł`,()=>buyHome(v,HOMEPRICE)],['Może później.',()=>dlgRoot()]])}
function buyHome(v,price){if(!v)return dlgRoot();if((INV.gold||0)<price)return dlgRoot('Nie stać cię. Potrzebujesz '+price+' złota.');
  const R0=(v.city?v.Hs*1.2:16)+10;let best=null;
  for(let ring=0;ring<6&&!best;ring++)for(let a=0;a<24&&!best;a++){const ang=a/24*Math.PI*2+ring*0.37,r=R0+ring*5,x=v.x+Math.sin(ang)*r,z=v.z+Math.cos(ang)*r,h=colAt(x,z);if(h===null||h<WATER+0.5)continue;if(inVillage(x,z,3)&&inVillage(x,z,3)!==v)continue;
    let ok=true;for(const [ax,az] of [[3.5,3.5],[-3.5,3.5],[3.5,-3.5],[-3.5,-3.5],[0,4.5],[0,-4.5]]){const q=colAt(x+ax,z+az);if(q===null||Math.abs(q-h)>1.2||wetAt(x+ax,z+az,q)){ok=false;break}}if(!ok)continue;
    try{if(typeof villageGround==='function'&&villageGround(x,z,h+3)!==null)continue}catch(_){}
    best={x,z,h,ry:Math.atan2(v.x-x,v.z-z)}}
  if(!best)return dlgRoot('Nie widzę tu wolnej, płaskiej działki. Spróbuj w innej osadzie.');
  INV.gold-=price;saveInv();updHud();
  const c=Math.cos(best.ry),s=Math.sin(best.ry),bx=best.x+(-1.6)*c+(-1.5)*s,bz=best.z-(-1.6)*s+(-1.5)*c;
  const hh={id:PID+'#dom',pid:PID+'#dom',kind:'dom',n:S.name,x:bx,y:best.h,z:bz,ry:best.ry,hx:best.x,hz:best.z,vn:v.name};
  W.huts=(W.huts||[]).filter(q=>q.pid!==hh.pid);W.huts.push(hh);saveW();try{syncHuts()}catch(_){}sendFx({k:'hut',h:hh});
  LS.set('home_'+S.seed,[best.x+Math.sin(best.ry)*4.2,best.h+0.5,best.z+Math.cos(best.ry)*4.2]);homeBuild(hh,true);sfx('coin');closeDialog();
  MARKS.set('home',{x:best.x,z:best.z,n:'Twój dom',col:'#ffd34d',t:1e9});toast('🏠 Masz dom w osadzie '+v.name+'! Zaznaczono go na mapie.','#ffd34d')}
const homeM=new Map();
function homeGeo(){const W1='#8a6a44',W2='#7a5a3a',ST='#8a8a8a',RF='#7a3a24',RF2='#6a2e1c',WD='#5a3a22',L=[],P=(...b)=>L.push(b);
  // podmurówka, podłoga
  P(0,0.15,0,8.4,0.3,7.4,ST);P(0,0.32,0,7.8,0.06,6.8,'#9a7a54');
  // ściany z otworem na drzwi (przód +z) i oknami
  P(0,1.8,-3.3,7.8,3,0.3,W1);P(-3.75,1.8,0,0.3,3,6.9,W2);P(3.75,1.8,0,0.3,3,6.9,W2);
  P(-2.45,1.8,3.3,2.9,3,0.3,W1);P(2.45,1.8,3.3,2.9,3,0.3,W1);P(0,2.95,3.3,2.0,0.7,0.3,W1);
  for(const x of [-3.75,3.75])for(const z of [-3.3,3.3])P(x,1.8,z,0.42,3.1,0.42,WD);
  P(-2.4,2.0,3.47,1.0,0.8,0.06,'#2a3a4a');P(2.4,2.0,3.47,1.0,0.8,0.06,'#2a3a4a');P(-2.4,2.0,3.5,1.1,0.08,0.04,WD);P(2.4,2.0,3.5,1.1,0.08,0.04,WD);
  // dach dwuspadowy (schodkowy)
  for(let i=0;i<6;i++){const y=3.4+i*0.42,w=8.8-i*1.5;P(0,y,0,w,0.42,7.9,i%2?RF:RF2)}P(0,6.0,0,0.5,0.25,8.1,WD);
  // komin
  P(2.4,5.2,-2.4,0.9,2.6,0.9,ST);P(2.4,6.55,-2.4,1.0,0.15,1.0,'#6a6a6a');
  // łóżko (lewy tył), skrzynia, stojak, palenisko
  P(-2.5,0.6,-2.0,1.4,0.5,2.4,WD);P(-2.5,0.9,-2.0,1.3,0.12,2.3,'#b83a2a');P(-2.5,1.0,-3.0,1.2,0.2,0.4,'#e8e0d0');
  P(1.9,0.65,2.6,1.2,0.6,0.7,'#6a4426');P(1.9,0.97,2.6,1.26,0.06,0.76,'#3a3a40');P(1.9,0.8,2.97,0.18,0.18,0.04,'#c9a24a');
  P(-2.9,1.2,1.8,0.12,1.8,0.12,WD);P(-2.9,0.35,1.8,0.6,0.08,0.6,WD);P(-2.9,1.75,1.8,0.7,0.6,0.3,'#9aa0a6');P(-2.9,2.2,1.8,0.32,0.3,0.32,'#9aa0a6');
  P(2.4,0.7,-2.4,1.4,1.2,1.0,ST);P(2.4,0.55,-1.95,0.8,0.5,0.12,'#2a1a10');
  P(0,0.34,0.4,2.6,0.02,1.8,'#7a2a22');
  return boxes(L)}
let homeGeoC=null;
function homeBuild(h,force){if(h.kind!=='dom')return;let g=homeM.get(h.id);if(g&&!force){if(g.parent!==scene)scene.add(g);return}
  if(g){scene.remove(g);try{voxRemove('home:'+h.id)}catch(_){}}
  homeGeoC=homeGeoC||homeGeo();g=new THREE.Group();const m=new THREE.Mesh(homeGeoC,matB);m.castShadow=true;m.receiveShadow=true;g.add(m);
  const fl=new THREE.Mesh(boxes([[0,0.45,0,0.4,0.4,0.3,'#ff8a2e'],[0,0.6,0,0.22,0.3,0.2,'#ffd34d']]),GLOWMAT);fl.position.set(2.4,0.2,-2.1);g.add(fl);g.userData.fl=fl;
  g.position.set(h.hx??h.x,h.y,h.hz??h.z);g.rotation.y=h.ry;g.add(nameTag('Dom: '+h.n,'#ffd34d'));const tg=g.children[g.children.length-1];if(tg)tg.position.y=7.2;
  scene.add(g);homeM.set(h.id,g);try{voxQueue(m,'home:'+h.id)}catch(_){}}
function homeLocal(h,lx,lz){const c=Math.cos(h.ry),s=Math.sin(h.ry),x0=h.hx??h.x,z0=h.hz??h.z;return[x0+lx*c+lz*s,z0-lx*s+lz*c]}
let homeNear=null;
function homeTick(){homeNear=null;if(SPC)return;
  for(const h of (W.huts||[])){if(h.kind!=='dom')continue;const d=Math.hypot((h.hx??h.x)-player.p.x,(h.hz??h.z)-player.p.z);
    if(d<220)homeBuild(h);else{const g=homeM.get(h.id);if(g&&g.parent)scene.remove(g)}
    // ukryj szałas, który rysuje system szałasów w miejscu łóżka
    if(d<220&&!h._hid){for(const o of scene.children)if(o.userData&&o.userData.fl&&!homeM.get(h.id)?.children.includes(o)&&Math.abs(o.position.x-h.x)<0.05&&Math.abs(o.position.z-h.z)<0.05){o.visible=false;h._hid=1}}
    const g=homeM.get(h.id);if(g&&g.userData.fl)g.userData.fl.scale.y=0.8+Math.sin(performance.now()/90)*0.2;
    if(h.pid!==PID+'#dom')continue;
    const [cx,cz]=homeLocal(h,1.9,1.9),[sx,sz]=homeLocal(h,-2.9,1.2),[fx,fz]=homeLocal(h,2.4,-1.4);
    const p=player.p;if(Math.abs(p.y-h.y)>3)continue;
    if(Math.hypot(cx-p.x,cz-p.z)<1.6)homeNear='chest';else if(Math.hypot(sx-p.x,sz-p.z)<1.6)homeNear='stand';else if(Math.hypot(fx-p.x,fz-p.z)<1.8)homeNear='cook'}
  if(homeNear&&!dlg&&!nearNpc){const pr=$('prompt');pr.hidden=false;pr.innerHTML={chest:'<kbd>F</kbd> Skrzynia',stand:'<kbd>F</kbd> Stojak na zbroję',cook:'<kbd>F</kbd> Palenisko — gotowanie'}[homeNear]}}
function homeAct(){if(!homeNear)return false;if(homeNear==='chest')przWin('chest','📦 Skrzynia w domu',renderChest);else if(homeNear==='stand')przWin('stand','🛡 Stojak na zbroję',renderStand);else openCook();return true}
function renderChest(){const el=document.getElementById('przbody');if(!el||przCur!=='chest')return;const row=(it,i,act)=>`<div class="prow r${it.rar}">${icHTML(it)}<b style="color:${RAR[it.rar].c}">${esc(it.name)}${it.up?' +'+it.up:''}</b><small>${RAR[it.rar].n} · poz. ${it.lvl}</small><button data-pz="${act}:${i}">${act==='hc'?'Do skrzyni →':'← Do plecaka'}</button></div>`;
  el.innerHTML=`<div class="pcols"><div><h3>Plecak (${INV.bag.length}/${bagN()})</h3>${INV.bag.map((it,i)=>it&&it.slot?row(it,i,'hc'):'').join('')||'<p class="sub2">Pusto</p>'}</div><div><h3>Skrzynia (${PRZ.chest.length}/48)</h3>${PRZ.chest.map((it,i)=>row(it,i,'hb')).join('')||'<p class="sub2">Pusto</p>'}</div></div>`}
function homeChestMove(i,toChest){if(toChest){const it=INV.bag[i];if(!it)return;if(PRZ.chest.length>=48)return toast('Skrzynia jest pełna','#ff8a7a');INV.bag.splice(i,1);PRZ.chest.push(it)}else{const it=PRZ.chest[i];if(!it)return;if(INV.bag.length>=bagN())return toast('Plecak jest pełny','#ff8a7a');PRZ.chest.splice(i,1);INV.bag.push(it)}przSave();saveInv();afterInv();renderChest()}
const STK=['helm','zbroja','rekawice','buty','tarcza'];
function renderStand(){const el=document.getElementById('przbody');if(!el||przCur!=='stand')return;const has=STK.some(k=>PRZ.stand[k]);
  el.innerHTML=`<p class="sub2">Stojak trzyma drugi komplet zbroi. Jednym kliknięciem zamieniasz to, co masz na sobie, z tym, co wisi na stojaku.</p><div class="pcols"><div><h3>Na tobie</h3>${STK.map(k=>{const it=INV.eq[k];return `<div class="prow">${it?icHTML(it)+`<b style="color:${RAR[it.rar].c}">${esc(it.name)}</b>`:'<small>— brak —</small>'}</div>`}).join('')}</div><div><h3>Na stojaku</h3>${STK.map(k=>{const it=PRZ.stand[k];return `<div class="prow">${it?icHTML(it)+`<b style="color:${RAR[it.rar].c}">${esc(it.name)}</b>`:'<small>— pusto —</small>'}</div>`}).join('')}</div></div><button data-pz="stand" class="pri">⇄ Zamień komplety</button>${has?'':'<p class="sub2">Stojak jest pusty — zamiana odłoży na niego twoją zbroję.</p>'}`}
function standSwap(){for(const k of STK){const a=INV.eq[k]||null,b=PRZ.stand[k]||null;if(b)INV.eq[k]=b;else delete INV.eq[k];if(a)PRZ.stand[k]=a;else delete PRZ.stand[k]}przSave();afterInv();sfx('clang',0.5);toast('Zamieniono komplety zbroi','#cfe8ff');renderStand()}

// ---------- 8. WYDARZENIA ŚWIATA: meteoryt i zaćmienie ----------
const METR={list:[]};let ECL=0;
function meteorFall(x,z,t0){const id='met'+Math.round(x)+'_'+Math.round(z);if(METR.list.find(m=>m.id===id))return;const m={id,x,z,t:0,landed:false,taken:false};METR.list.push(m)}
function meteorTick(dt){for(const m of METR.list){m.t+=dt;if(!m.landed){const k=Math.min(1,m.t/3.2),h=colAt(m.x,m.z);if(h===null)continue;const y=h+(1-k)*120,x=m.x-(1-k)*60;
      if(!m.ball){m.ball=new THREE.Mesh(boxes([[0,0,0,1.6,1.6,1.6,'#ff6a1a'],[0,0,0,1.0,1.0,2.4,'#ffd34d']]),GLOWMAT);scene.add(m.ball)}m.ball.position.set(x,y,m.z);m.ball.rotation.x+=dt*3;
      PFX.emit(x,y,m.z,4,['#ff6a1a','#ffb030','#5a4a3a'],{sp:1,up:0.5,life:1,size:0.25});
      if(k>=1){m.landed=true;scene.remove(m.ball);m.ball=null;m.y=h;try{boomFx(m.x,h+0.5,m.z,6)}catch(_){}sfx('thunder',1);
        const g=new THREE.Group();g.add(new THREE.Mesh(boxes([[0,0.6,0,2.2,1.4,2.0,'#3a3038'],[0.3,1.2,0.2,1.4,0.8,1.4,'#4a3e46'],[-0.5,0.4,0.6,0.8,0.6,0.7,'#2a2228']]),matB));const gl=new THREE.Mesh(boxes([[0.6,1.0,0.9,0.4,0.3,0.12,'#ff9a3a'],[-0.8,0.7,0.2,0.12,0.3,0.4,'#ffb040'],[0.2,1.6,-0.5,0.3,0.12,0.3,'#ff8a2e']]),GLOWMAT);g.add(gl);g.position.set(m.x,h-0.2,m.z);scene.add(g);m.g=g;
        if(isAuth()){const lvl=Math.max(1,Math.round(typeof evLvl==='function'?evLvl(m.x,m.z):HERO.lvl));for(let i=0;i<3;i++){const a=i*2.1,xx=m.x+Math.sin(a)*5,zz=m.z+Math.cos(a)*5,hh=colAt(xx,zz);if(hh!==null)try{makeE(EDEF.golem_meteor?'golem_meteor':'golem',lvl+1,i===0,xx,hh,zz,{evt:1})}catch(_){}}}}}
    else if(!m.taken&&m.g){if(Math.random()<dt*3)PFX.emit(m.x,m.y+1.4,m.z,1,['#ff9a3a','#5a5a5a'],{sp:0.3,up:1.2,life:1.4,size:0.12})}}}
function meteorNear(){for(const m of METR.list)if(m.landed&&!m.taken&&Math.hypot(m.x-player.p.x,m.z-player.p.z)<3.2)return m;return null}
function meteorTake(m){m.taken=true;const lv=HERO.lvl;PRZ.mat.sztaby+=6;PRZ.mat.esencja+=3;INV.gold+=lv*25;przSave();saveInv();updHud();gainXp(80*lv);sfx('lvl');toast('☄ Gwiezdne żelazo: +6 sztab, +3 esencji, +'+lv*25+' zł','#ffb050');
  if(Math.random()<0.25){const it=makeArtifact(lv);if(INV.bag.length<bagN()){INV.bag.push(it);toast('Artefakt: '+it.name,'#ff9d2e')}}if(m.g){const gl=m.g.children[1];if(gl)m.g.remove(gl)}MARKS.delete('evt')}
function eclipseStart(t){ECL=t;let ov=document.getElementById('eclov');if(!ov){ov=document.createElement('div');ov.id='eclov';document.body.appendChild(ov)}ov.hidden=false;PBUF.ecl={t,n:'🌑 Zaćmienie: +50% PD, wrogowie silniejsi',c:'#ff7a5a'};przBar()}
function eclipseTick(dt){if(ECL<=0)return;ECL-=dt;const ov=document.getElementById('eclov');if(ov)ov.style.opacity=Math.min(1,Math.min(ECL,120-ECL)/6)*0.55;if(ECL<=0){if(ov)ov.hidden=true;delete PBUF.ecl;przBar();toast('Zaćmienie minęło','#ffd34d')}}
let evtT=600+Math.random()*600;
function evtTick(dt){if(!isAuth()||SPC)return;evtT-=dt;if(evtT>0)return;evtT=900+Math.random()*900;if(EVT&&EVT.cur&&!EVT.cur.done)return;
  const r=Math.random();if(r<0.5){const a=Math.random()*6.28,d=70+Math.random()*80,x=player.p.x+Math.sin(a)*d,z=player.p.z+Math.cos(a)*d,h=colAt(x,z);if(h===null||h<WATER+0.5)return;
    sendFx({k:'meteor',x,z});meteorFall(x,z);evMsg('☄ Na niebie płonie meteoryt! Spadnie '+dirName(x-player.p.x,z-player.p.z)+' stąd — gwiezdne żelazo strzegą golemy.','#ffb050',[x,z,'Meteoryt'])}
  else if(r<0.75){sendFx({k:'ecl',t:120});eclipseStart(120);evMsg('🌑 Słońce gaśnie — zaćmienie! Przez 2 minuty wrogowie są silniejsi, ale dają +50% doświadczenia.','#ff7a5a')}}

// ---------- 9. UKRYTE MIEJSCA: mapy skarbów i kapliczki ----------
function tmapNew(){const a=Math.random()*6.28,d=140+Math.random()*180,x=Math.round(player.p.x+Math.sin(a)*d),z=Math.round(player.p.z+Math.cos(a)*d);const t={id:'tm'+Date.now()%1e7,x,z};PRZ.tmaps.push(t);przSave();tmapMarks();toast('📜 Znaleziono mapę skarbu! Miejsce zaznaczono na mapie ('+dirName(x-player.p.x,z-player.p.z)+', '+Math.round(d)+' kroków).','#e8c060')}
function tmapMarks(){for(const t of PRZ.tmaps)MARKS.set(t.id,{x:t.x,z:t.z,n:'Skarb (mapa)',col:'#e8c060',t:1e9})}
function tmapNear(){for(const t of PRZ.tmaps)if(Math.hypot(t.x-player.p.x,t.z-player.p.z)<2.6)return t;return null}
function tmapDig(t){PRZ.tmaps=PRZ.tmaps.filter(q=>q!==t);MARKS.delete(t.id);const lv=HERO.lvl;INV.gold+=lv*40;const n=2+(Math.random()<0.4?1:0);for(let i=0;i<n;i++){const it=Math.random()<0.06?makeArtifact(lv):genItem(lv+2,30);if(INV.bag.length<bagN()){INV.bag.push(it);toast(it.name,RAR[it.rar].c)}}
  PRZ.mat.esencja+=1;przSave();saveInv();updHud();gainXp(60*lv);sfx('open');try{PFX.emit(t.x,player.p.y,t.z,24,['#6b5034','#8a7a64','#ffd34d'],{sp:3,up:4,life:0.8,size:0.1})}catch(_){}toast('💰 Wykopano skarb: +'+lv*40+' zł','#ffd34d')}
const SHRC=256,shrM=new Map();
const BLESS=[['sila','✝ Błogosławieństwo siły: +15% obrażeń','#ffd34d',s=>{s.dmg*=1.15}],['tarcza','✝ Błogosławieństwo tarczy: +15% obrony','#cfe8ff',s=>{s.def*=1.15}],['wiatr','✝ Błogosławieństwo wiatru: +15% ruchu','#a8f0c8',s=>{s.move*=1.15}],['zycie','✝ Błogosławieństwo życia: +3 regeneracji','#7dff8a',s=>{s.regen+=3}]];
function shrineAt(cx,cz){const r=rngOf('shr'+S.seed+':'+cx+','+cz);if(r()>0.35)return null;return{id:cx+','+cz,x:cx*SHRC+20+r()*(SHRC-40),z:cz*SHRC+20+r()*(SHRC-40),b:Math.floor(r()*BLESS.length)}}
function shrineTick(){if(SPC)return;const cx0=Math.floor(player.p.x/SHRC),cz0=Math.floor(player.p.z/SHRC);
  for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const s=shrineAt(cx0+dx,cz0+dz);if(!s||shrM.has(s.id))continue;if(Math.hypot(s.x-player.p.x,s.z-player.p.z)>110)continue;const h=colAt(s.x,s.z);if(h===null)continue;
    let ok=h>WATER+0.4&&!inVillage(s.x,s.z,8);if(ok)for(const [a,b] of [[1.2,1.2],[-1.2,1.2],[1.2,-1.2],[-1.2,-1.2]]){const q=colAt(s.x+a,s.z+b);if(q===null||Math.abs(q-h)>0.9)ok=false}
    if(!ok){shrM.set(s.id,null);continue}
    const g=new THREE.Group();const m=new THREE.Mesh(boxes([[0,0.2,0,1.6,0.4,1.6,'#8a8a8a'],[0,0.9,0,0.9,1.0,0.7,'#9a9a9a'],[0,1.55,0,1.2,0.25,0.95,'#6a6a6a'],[0,1.85,0,0.7,0.35,0.6,'#7a7a7a'],[0,2.3,0,0.12,0.6,0.12,'#5a3a22'],[0,2.4,0,0.4,0.12,0.12,'#5a3a22'],[0,0.9,0.36,0.5,0.6,0.04,'#3a2a2a']]),matB);g.add(m);
    const orb=new THREE.Mesh(boxes([[0,0.95,0.38,0.24,0.24,0.06,'#ffe08a']]),GLOWMAT);g.add(orb);g.userData.orb=orb;g.position.set(s.x,h,s.z);g.rotation.y=rngOf('shrr'+s.id)()*6.28;scene.add(g);s.g=g;s.y=h;shrM.set(s.id,s);try{voxQueue(m,'shr:'+s.id)}catch(_){}}
  for(const [id,s] of shrM){if(!s)continue;const d=Math.hypot(s.x-player.p.x,s.z-player.p.z);if(d>180){scene.remove(s.g);try{voxRemove('shr:'+id)}catch(_){}shrM.delete(id);continue}const used=PRZ.shr[id]===PRZ_DAY();s.g.userData.orb.visible=!used}}
function shrineNear(){for(const s of shrM.values())if(s&&Math.hypot(s.x-player.p.x,s.z-player.p.z)<2.4&&Math.abs(s.y-player.p.y)<2.5)return s;return null}
function shrinePray(s){if(PRZ.shr[s.id]===PRZ_DAY())return toast('Ta kapliczka pobłogosławiła cię już dzisiaj','#cfe8ff');PRZ.shr[s.id]=PRZ_DAY();przSave();const B=BLESS[s.b];PBUF.bless={t:600,n:B[1].split(':')[0],c:B[2],f:B[3]};afterBuff();sfx('lvl',0.6);toast(B[1]+' (10 min)',B[2]);try{PFX.emit(s.x,s.y+1.2,s.z,20,['#ffe08a','#ffffff'],{sp:1.5,up:2,life:1,size:0.08})}catch(_){}}

// ---------- 10. POGODA wpływa na grę ----------
const COLDB=/Tundra|Lodow|Śnież|Szron|Mroź|Zamarz|Lodowiec|Szczyt/;
function wxAggro(){return WX.k==='mgla'?0.6:WX.k==='burza'?0.85:1}
function isWarm(){if(PRZ.warm)return true;if(SPC||nearFire())return true;for(const h of (W.huts||[]))if(Math.hypot((h.hx??h.x)-player.p.x,(h.hz??h.z)-player.p.z)<7)return true;for(const k of ['zbroja','helm']){const it=INV.eq[k];if(it&&(it.mat==='skora'||/futr|skór|wilcz/i.test(it.name||'')))return true}return false}
let coldT=0;
function weatherTick(dt){
  if(VH.mode===2&&WX.k==='burza'){player.v.y-=2.2*WX.i*dt;if(Math.random()<dt*2){player.v.x+=(Math.random()-0.5)*4*WX.i;player.v.z+=(Math.random()-0.5)*4*WX.i}}
  coldT-=dt;if(coldT>0)return;coldT=1;let cold=false;try{const b=biomeAt(player.p.x,player.p.z),nm=b>=0&&BIOMES[b]?BIOMES[b]:'';const night=hour<5.8||hour>20;cold=(COLDB.test(nm)&&(night||WX.k==='snieg'))||(WX.k==='snieg'&&night)}catch(_){}
  const want=cold&&!isWarm();if(want&&!PBUF.cold){PBUF.cold={t:1e9,n:'❄ Zimno: −10% ruchu, brak regeneracji (ogrzej się albo kup ciepły płaszcz)',c:'#9fe8ff',f:s=>{s.move*=0.9;s.regen=0}};afterBuff();toast('❄ Jest ci zimno. Rozpal ognisko (Y) albo kup u kupca ciepły płaszcz.','#9fe8ff')}
  else if(!want&&PBUF.cold){delete PBUF.cold;afterBuff()}}

// ---------- 11. DYLIŻANS między odwiedzonymi miastami ----------
function coachList(here){return [...villages.values()].filter(v=>v&&v.city&&W.seen&&W.seen[v.id]&&v!==here)}
function dlgCoach(){const here=villages.get(dlg.n.vid),L=coachList(here).map(v=>[v,Math.hypot(v.x-player.p.x,v.z-player.p.z)]).sort((a,b)=>a[1]-b[1]).slice(0,8);
  if(!L.length)return dlgShow('Dyliżans jeździ tylko do miast, które już odwiedziłeś. Na razie nie znam innych.',[['Wróć.',()=>dlgRoot()]]);
  dlgShow('Dyliżans odjeżdża, kiedy tylko zechcesz. Dokąd jedziemy?',L.map(([v,d])=>{const pr=Math.round(15+d/25);return[`${v.name} (${Math.round(d)} kroków) — ${pr} zł`,()=>{if((INV.gold||0)<pr)return dlgRoot('Na dyliżans brakuje ci złota.');INV.gold-=pr;saveInv();updHud();closeDialog();coachTo(v)}]}).concat([['Wróć.',()=>dlgRoot()]]))}
function coachTo(v){if(VH.mode===1)exitBoat();if(VH.mode===5||VH.mode===6)dismountOwn(1);const d=(v.Hs||20)-7,x=v.x,z=v.z+d;player.p.set(x,(colAt(x,z)??v.h)+1.2,z);player.v.set(0,0,0);camY=null;holdIfUnloaded();toast('🐎 Dyliżans dojechał do: '+v.name,'#cfe8ff');sfx('neigh',0.6);for(const f of FOL)f.p.set(x+1.5,player.p.y,z+1.5);if(PET)PET.p.set(x-1.5,player.p.y,z-1.5)}

// ---------- 12. ALBUM ZWIERZĄT I BESTII ----------
let albCat='zw';
function bestCat(t){const d=EDEF[t];if(!d)return null;if(d.ally||t==='woz')return null;if(d.boss)return 'boss';if(d.passive)return 'zw';return 'wr'}
function bestSeen(t,kill){if(!EDEF[t]||!bestCat(t))return;const b=PRZ.best[t]||(PRZ.best[t]={s:0,k:0});const first=!b.s;b.s=1;if(kill)b.k++;if(first){const n=Object.keys(PRZ.best).length;toast('📖 Nowy wpis w albumie: '+EDEF[t].n+' ('+n+')','#c8e0a0');if(n%10===0){gainXp(100*Math.max(1,HERO.lvl));toast('📖 Album: '+n+' odkrytych stworzeń — premia PD!','#ffd34d')}}przSave()}
let seenT=0;function seenTick(dt){seenT-=dt;if(seenT>0)return;seenT=1;for(const e of enemies.values()){if(e.st===2)continue;if(Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z)<26&&e.m&&e.m.visible)bestSeen(e.t,false)}}
function openAlbum(){przWin('alb','📖 Album zwierząt i bestii',renderAlbum)}
function renderAlbum(){const el=document.getElementById('przbody');if(!el||przCur!=='alb')return;const all=Object.keys(EDEF).filter(t=>bestCat(t));const C={zw:'Zwierzęta',wr:'Wrogowie i stwory',boss:'Bossowie'};
  const tot=all.length,got=all.filter(t=>PRZ.best[t]&&PRZ.best[t].s).length;
  let h=`<p class="sub2">Odkryto ${got} z ${tot}. Co 10 nowych wpisów — premia doświadczenia.</p><div class="ptabs">${Object.entries(C).map(([k,n])=>`<button data-pz="alb:${k}" class="${albCat===k?'on':''}">${n} (${all.filter(t=>bestCat(t)===k&&PRZ.best[t]&&PRZ.best[t].s).length}/${all.filter(t=>bestCat(t)===k).length})</button>`).join('')}</div><div class="pgrid">`;
  for(const t of all.filter(t=>bestCat(t)===albCat).sort((a,b)=>((PRZ.best[b]&&PRZ.best[b].s?1:0)-(PRZ.best[a]&&PRZ.best[a].s?1:0))||(EDEF[a].n||a).localeCompare(EDEF[b].n||b,'pl'))){const b=PRZ.best[t],d=EDEF[t];h+=b&&b.s?`<div class="pcard"><b>${esc(d.n||t)}</b><small>${d.passive?'spokojne':'groźne'}${d.fly?' · lata':''}${d.swim?' · pływa':''}<br>zdrowie ${d.hp} · obrażenia ${d.dmg||0}<br>pokonano: ${b.k}</small></div>`:'<div class="pcard un"><b>???</b><small>nieodkryte</small></div>'}
  el.innerHTML=h+'</div>'}

// ---------- 13. WIERZCHOWCE: wilk i jeleń ----------
const MRIDE={kon:{n:'Koń',seat:1.0},wilk:{n:'Wilk bojowy',seat:1.05,sc:1.55,price:900,lvl:6},jelen:{n:'Jeleń',seat:1.1,sc:1.12,price:600,lvl:3}};
function mountModel(kind){if(kind==='kon')return horseCoat(makeHorseE('kon',false),MNT.koat||0);const m=makeEnemy(kind,false);m.scale.multiplyScalar(MRIDE[kind].sc||1);return m}


// ---------- dymek przedmiotu: zestaw i historia artefaktu ----------
function przTip(it){let h='';if(it.set2&&SETS2[it.set2]){const S2=SETS2[it.set2],n=set2Counts()[it.set2]||0;h+=`<div class="setinfo"><b style="color:${S2.c}">${S2.n}</b> (${n}/4)${S2.b.map(([k,t])=>`<div class="${n>=k?'on':''}">${k} cz.: ${t}</div>`).join('')}</div>`}
  const a=artOf(it);if(a)h+=`<div class="artinfo"><b>✦ Artefakt</b><div>${a.fxt}</div><i>„${a.lore}”</i></div>`;if(it.ench==='wampir')h+='<div class="artinfo"><div>Zaklęcie Krwi: kradzież życia 5%</div></div>';return h}
// ---------- łupy z pokonanych: album, zestawy, artefakty, mapy skarbów ----------
{const _qk=questKill;questKill=function(L){try{const t=L.et,d=EDEF[t];if(d){bestSeen(t,true);const lv=HERO.lvl;
    if(d.boss){if(Math.random()<0.3){const it=makeArtifact(lv);if(INV.bag.length<bagN()){INV.bag.push(it);toast('✦ Artefakt: '+it.name,'#ff9d2e');sfx('lvl')}}else if(Math.random()<0.5){const it=makeSetPiece(lv+1,pick(Object.keys(SETS2)));if(INV.bag.length<bagN()){INV.bag.push(it);toast(it.name,SETS2[it.set2].c)}}}
    else if(L.el&&!d.passive&&Math.random()<0.06){const it=makeSetPiece(lv,pick(Object.keys(SETS2)));if(INV.bag.length<bagN()){INV.bag.push(it);toast(it.name,SETS2[it.set2].c)}}
    if(!d.passive&&PRZ.tmaps.length<3&&Math.random()<(L.el?0.08:0.012))tmapNew();
    saveInv()}}catch(_){}return _qk(L)}}
{const _gx=gainXp;gainXp=function(x){return _gx(ECL>0?Math.round(x*1.5):x)}}

// ---------- integracja: zdarzenia sieciowe, klawisze, tik ----------
whenReady(()=>{
  FXH.stn=m=>{const e=enemies.get(m.eid);if(e){e.stunU=nowS()+(+m.d||1);e.stunBy=m.from}};
  FXH.fire=m=>{if(m.f&&isFinite(m.f.x)){PRZ.fires=PRZ.fires.filter(q=>q.id!==m.f.id);PRZ.fires.push(m.f)}};
  FXH.meteor=m=>{if(isFinite(m.x)&&isFinite(m.z))meteorFall(m.x,m.z)};
  FXH.ecl=m=>{eclipseStart(+m.t||120)};
  tmapMarks();{const h=myHome();if(h)MARKS.set('home',{x:h.hx??h.x,z:h.hz??h.z,n:'Twój dom',col:'#ffd34d',t:1e9})}
  try{WINIDS.push('przui')}catch(_){}
  // F: dom, meteoryt, skarb, kapliczka (przed szałasem)
  const oldHut=window.hutAct;window.hutAct=function(){if(homeAct())return true;const m=meteorNear();if(m){meteorTake(m);return true}const t=tmapNear();if(t){tmapDig(t);return true}const s=shrineNear();if(s){shrinePray(s);return true}return oldHut?oldHut():false};
  addEventListener('keydown',e=>{const pz=document.getElementById('przui');
    if(pz&&!pz.hidden&&(e.code==='Escape'||e.code==='KeyF')){przClose();e.stopImmediatePropagation();e.preventDefault();return}
    if(e.repeat||document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;if(!$('chatbox').hidden||custOpen()||dlg)return;
    if(e.code==='KeyY'){if(przCur==='cook')przClose();else openCook();e.preventDefault()}},true);
  let ownHomeT=5;
  TICKS.push(dt=>{for(const k in PBUF){const b=PBUF[k];if(b.t<9e8){b.t-=dt;if(b.t<=0){delete PBUF[k];afterBuff();toast('Wygasło: '+b.n,'#cfcfcf')}}}
    if((P2.bashCd||0)>0)P2.bashCd-=dt;
    fireTick(dt);meteorTick(dt);eclipseTick(dt);evtTick(dt);weatherTick(dt);seenTick(dt);
    if(((performance.now()/250)|0)%4===0){homeTick();shrineTick()}else if(homeNear&&!dlg&&!nearNpc){const pr=$('prompt');pr.hidden=false}
    const m=meteorNear(),t=tmapNear(),s=shrineNear();if((m||t||s)&&!dlg&&!nearNpc&&!homeNear){const pr=$('prompt');pr.hidden=false;pr.innerHTML=m?'<kbd>F</kbd> Zbierz gwiezdne żelazo':t?'<kbd>F</kbd> Kop — tu jest skarb!':(PRZ.shr[s.id]===PRZ_DAY()?'Kapliczka (pobłogosławiła cię już dziś)':'<kbd>F</kbd> Pomódl się w kapliczce')}
    ownHomeT-=dt;if(ownHomeT<0){ownHomeT=30;const h=myHome();if(h&&NET.tr)sendFx({k:'hut',h})}
    if(przCur==='cook'&&((performance.now()/1000)|0)%2===0)renderCook()});
  przBar();
});
