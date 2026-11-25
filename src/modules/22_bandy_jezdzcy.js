// =================== BANDY WROGÓW WĘDRUJĄCE PO MAPIE (z pochodniami) ===================
const BANDS=new Map();let bandSeq=1;
function spawnBand(pp){const a=Math.random()*6.283,d=rnd(75,100),x=pp.p.x+Math.cos(a)*d,z=pp.p.z+Math.sin(a)*d,h=colAt(x,z),b=biomeAt(x,z);if(!spawnOK(x,z,playersList(),65))return;if(h===null||h<WATER||inVillage(x,z,60))return;
  const night=hour<6||hour>19.5,kinds=night&&Math.random()<0.5?['szkielet','lucznik_s','szkielet','upior']:b===4||b===8?['ork','ork','bandyta','ork']:b===6||b===5||b===12?['troll','ork','ork']:b===3||b===9||b===10?['goblin','goblin','szaman','goblin']:['bandyta','bandyta','bandyta','szaman','bandyta'];
  const n=4+Math.floor(Math.random()*4),id=bandSeq++,sp=spawnPt(),lvl=Math.max(1,1+Math.floor(Math.hypot(x-sp[0],z-sp[2])/260));const B={id,tx:x,tz:z,t:0,mem:[]};BANDS.set(id,B);
  for(let i=0;i<n;i++){const xx=x+rnd(-3,3),zz=z+rnd(-3,3),hh=colAt(xx,zz);if(hh===null)continue;const t=kinds[i%kinds.length],e=makeE(t,lvl,i===0&&Math.random()<0.5,xx,hh,zz,{band:id,torch:HUM[t]&&(i%2===0||night),bo:[(i%3-1)*1.8,-Math.floor(i/3)*1.8-(i?1.4:0)]});B.mem.push(e.id)}}
// =================== JEŹDŹCY KONNI: rozbójnicy, rycerze-bohaterowie, pretendent do pojedynku, gwardia konna ===================
Object.assign(EDEF,{
  jezdziec:{...EDEF.bandyta,n:'Jeździec rozbójnik',hp:95,dmg:14,spd:8.6,aggro:26,rng:2.7,cd:1.05,horse:1},
  rycerz_k:{...EDEF.bandyta,n:'Rycerz konny',hp:300,dmg:24,spd:9.2,aggro:28,rng:3.1,cd:1.25,armor:0.72,horse:2},
  pretendent:{...EDEF.bandyta,n:'Pretendent',hp:260,dmg:19,spd:9,aggro:0,rng:3.0,cd:1.2,armor:0.8,horse:2},
  gwardia_k:{...EDEF.straznik,n:'Gwardzista konny',hp:230,dmg:20,spd:7.4,horse:2}});
HUM.jezdziec={...HUM.bandyta,w:'miecz'};HDECO.jezdziec=HDECO.bandyta;
HUM.rycerz_k={sc:1.08,look:{...HUM.straznik.look,tunic:'#2a3a6a',cape:1,capeC:'#1a2448'},ex:{...HUM.straznik.ex,armor:'#b4bac2'},w:'wlocznia'};HDECO.rycerz_k=HDECO.straznik;
HUM.pretendent={...HUM.rycerz_k,look:{...HUM.rycerz_k.look,tunic:'#7a1f6a',capeC:'#4a1240',hairC:'#c8a050'}};HDECO.pretendent=HDECO.straznik;
HUM.gwardia_k={...HUM.straznik,look:{...HUM.straznik.look,cape:1,capeC:'#7a1f1f'}};HDECO.gwardia_k=HDECO.straznik;
const RIDE={t:4,guardT:0};
// czaprak dla koni rycerskich: kolorowa kapa z obszyciem, naczółek (rozmiar z bryły konia)
function caparison(hm,col,trim){try{const b=new THREE.Box3().setFromObject(hm);if(!b||!isFinite(b.max.y))return;const sx=b.max.x-b.min.x,sy=b.max.y-b.min.y,sz=b.max.z-b.min.z,L=Math.max(sx,sz),W=Math.min(sx,sz),y0=b.min.y+sy*0.42,hh=sy*0.24,alongZ=sz>=sx;
  const P=[];const bx=(x,y,z,w,h,d,c)=>P.push(alongZ?[x,y,z,w,h,d,c]:[z,y,x,d,h,w,c]);bx(0,y0+hh/2,-L*0.06,W*1.12,hh,L*0.62,col);bx(0,y0+0.02,-L*0.06,W*1.14,0.06,L*0.64,trim);bx(0,y0+hh+0.03,-L*0.06,W*0.9,0.05,L*0.5,trim);
  for(const s of [-1,1])bx(s*W*0.57,y0+hh*0.55,-L*0.06,0.03,hh*0.35,L*0.18,trim);const g=new THREE.Mesh(boxes(P),decoMat);g.position.set((b.min.x+b.max.x)/2-hm.position.x,0,(b.min.z+b.max.z)/2-hm.position.z);hm.add(g)}catch(_){}}
function riderTick(dt){
  // koń jeźdźca: pozycja, chód; jeździec na siodle; po śmierci koń zostaje i ucieka
  for(const e of enemies.values()){if(!e.hm)continue;if(e.st===2){const h=e.hm;e.hm=null;scene.remove(h);try{freeObj(h)}catch(_){}if(isAuth()&&!e.duel)try{makeE('kon',1,false,e.p.x,e.p.y,e.p.z,{pas:1})}catch(_){}continue}}
  if(!isAuth())return;RIDE.t-=dt;RIDE.guardT-=dt;const p=player.p;
  // pretendent: podjeżdża, wyzywa, walczy do poddania
  for(const e of enemies.values()){if(e.t!=='pretendent'||e.st===2)continue;const d=Math.hypot(e.p.x-p.x,e.p.z-p.z);
    if(e.duel===0&&d<7&&!dlg&&!P2.dead&&e.npc){e.duel=-1;try{openDialog(e.npc)}catch(err){console.warn(err);e.duel=0;dlg=null}}
    if(e.duel===-1&&!dlg&&d>9)e.duel=0;
    if(e.duel===1&&P2.hp/Math.max(1,ST.hp)<0.15){e.duel=3;e.peace=true;e.aggro=null;e.peaceTo={x:e.p.x+(e.p.x-p.x)*30,z:e.p.z+(e.p.z-p.z)*30};const g=Math.min(INV.gold||0,40+e.lvl*10);INV.gold-=g;saveInv();updHud();P2.iframe=3;toast(`${e.npc.name}: „Pojedynek mój! Biorę ${g} zł jako zakład — wróć, gdy nabierzesz sił.”`,'#ff9d6b');e.leaveT=25}
    if(e.leaveT!=null){e.leaveT-=dt;if(e.leaveT<=0&&d>40){e.hp=0;e.st=2;e.dieT=0;e.duel=9}}}
  if(RIDE.t>0||p.y>450||SPC)return;RIDE.t=22;
  if(inVillage(p.x,p.z,25)){// gwardia konna patroluje miasto
    const v=[...villages.values()].find(q=>q&&q.city&&q.g&&Math.abs(q.x-p.x)<q.Hs+30&&Math.abs(q.z-p.z)<q.Hs+30);
    if(v){let n=0;for(const e of enemies.values())if(e.t==='gwardia_k'&&e.cid===v.id&&e.st!==2)n++;const pl=cityPlan(v),RG=pl.ST.find(q=>q.k===2&&q.p.length>=110)||pl.ST[7],R=RG.p.filter((q,i)=>i%10===0).map(q=>[v.x+q[0],v.z+q[1]]);/* konny patrol jedzie ulicą przymurną dookoła miasta */
      for(;n<2;n++){const k=Math.floor(Math.random()*R.length),[x,z]=R[k],h=colAt(x,z);if(h==null)break;const e=makeE('gwardia_k',Math.max(3,v.lvl||3),false,x,h,z,{cid:v.id,route:R,ri:(k+1)%R.length,post:R[(k+1)%R.length],rar:0})}}
    return}
  const sp=spawnPt(),lvl=Math.max(1,1+Math.floor(Math.hypot(p.x-sp[0],p.z-sp[2])/260));let pret=0,riders=0;for(const e of enemies.values()){if(e.st===2)continue;if(e.t==='pretendent')pret++;if(EDEF[e.t].horse&&e.t!=='gwardia_k')riders++}
  if(riders>=4)return;const a=Math.random()*6.283,dd=rnd(75,100),x=p.x+Math.cos(a)*dd,z=p.z+Math.sin(a)*dd,h=colAt(x,z);if(h==null||h<WATER||inVillage(x,z,40)||!spawnOK(x,z,playersList(),65))return;
  const roll=Math.random();
  if(false){/* v126: pretendent usunięty z gry */const r=mulb((Date.now()&0xffff)^0x9e3),R=RACES.ludzie,name=rpick(r,R.m),from=['z Białogrodu','z Wilczego Jaru','znad Srebrnej Rzeki','spod Lwigrodu','z Dębowego Gaju','z Mrocznej Puszczy'][Math.floor(r()*6)];
    const e=makeE('pretendent',lvl+1,false,x,h,z,{peace:true,duel:0,rar:0});e.npc={id:'pret'+e.id,name:'Sir '+name,roleN:'Pretendent',race:'ludzie',role:'pretendent',pret:e,m:e.m,x,z,from};
    toast('🐎 Ktoś galopuje w twoją stronę…','#ffd27a')}
  else if(roll<0.1){const e=makeE('rycerz_k',lvl+2,true,x,h,z,{rar:0});const r=mulb(e.id*77),nm=rpick(r,RACES.ludzie.m);e.hero='Czarny Rycerz '+nm;evMsg('⚔ Na szlaku pojawił się bohater: '+e.hero+'! Pokonaj go dla sławy i łupów.','#ff9d6b',[Math.floor(x),Math.floor(z),e.hero]);{const mk=MARKS.get('evt');if(mk)mk.eid=e.id}}
  else if(roll<0.2){const n=2+Math.floor(Math.random()*2),B={id:bandSeq++,tx:x,tz:z,t:0,mem:[]};BANDS.set(B.id,B);for(let i=0;i<n;i++){const xx=x+rnd(-3,3),zz=z+rnd(-3,3),hh=colAt(xx,zz);if(hh==null)continue;const e=makeE('jezdziec',lvl,i===0&&Math.random()<0.4,xx,hh,zz,{band:B.id,bo:[(i%2?1:-1)*2.4,-i*2.6]});B.mem.push(e.id)}toast('🐎 Tętent kopyt — jeźdźcy na horyzoncie!','#ff9d6b')}}
// patrol gwardii konnej: kolejne punkty trasy po głównych ulicach
function guardRoute(e){if(!e.route)return;if(Math.hypot(e.post[0]-e.p.x,e.post[1]-e.p.z)<4){e.ri=(e.ri+1)%e.route.length;e.post=e.route[e.ri]}}
function duelYield(e){e.duel=2;e.peace=true;e.aggro=null;e.prov=0;const p=player.p;e.peaceTo={x:e.p.x+(e.p.x-p.x)*30,z:e.p.z+(e.p.z-p.z)*30};e.leaveT=30;
  const g=60+e.lvl*25;INV.gold=(INV.gold||0)+g;saveInv();updHud();try{gainXp(Math.round(xpFor(e,HERO.lvl)*2.5))}catch(_){}try{addRep('ludzie',12)}catch(_){}W.fame=(W.fame||0)+10;saveW();sfx('coin');
  toast(`${e.npc.name}: „Poddaję się! Walczysz jak lew.” — wygrany zakład ${g} zł, +sława`,'#7dd87d')}
function dlgPret(n){const e=n.pret;dlgShow(`${n.name} ${n.from} zatrzymuje konia i unosi przyłbicę: „Słyszałem o tobie, wędrowcze. Wyzywam cię na pojedynek — do pierwszej poddanej szabli! Zakład: sakwa złota.”`,[
  ['Przyjmuję wyzwanie!',()=>{closeDialog();e.peace=false;e.duel=1;e.aggro={id:NET.id,t:999};e.prov=8;toast('⚔ Pojedynek! Walcz z '+n.name+' — nikt nie zginie, przegrany się podda.','#ffd27a');sfx('bell',0.6)}],
  ['Odmawiam. Nie mam czasu na turnieje.',()=>{closeDialog();e.duel=4;const p=player.p;e.peaceTo={x:e.p.x+(e.p.x-p.x)*30,z:e.p.z+(e.p.z-p.z)*30};e.leaveT=20;W.fame=Math.max(0,(W.fame||0)-5);saveW();toast(n.name+': „Tchórz! Cała okolica się o tym dowie.” (−5 sławy)','#ff8a7a')}]])}
function bandMove(e,dt){const B=BANDS.get(e.band);if(!B)return null;const lead=enemies.get(B.mem.find(id=>{const q=enemies.get(id);return q&&q.st!==2}));if(!lead){BANDS.delete(e.band);return null}
  if(lead===e&&B.raid){B.tx=B.raid[0]+Math.cos(worldT*0.25+B.id)*6;B.tz=B.raid[1]+Math.sin(worldT*0.25+B.id)*6;const dx=B.tx-e.p.x,dz=B.tz-e.p.z,l=Math.hypot(dx,dz)||1;e.ry=Math.atan2(dx,dz);return l<1.5?[0,0,0]:[dx/l,dz/l,0.7]}
  if(lead===e){B.t-=dt;const d=Math.hypot(B.tx-e.p.x,B.tz-e.p.z);if(d<3||B.t<=0){const a=Math.random()*6.283,r=rnd(50,110);let nx=e.p.x+Math.cos(a)*r,nz=e.p.z+Math.sin(a)*r;if(inVillage(nx,nz,40)){nx=e.p.x-Math.cos(a)*r;nz=e.p.z-Math.sin(a)*r}B.tx=nx;B.tz=nz;B.t=40}
    const dx=B.tx-e.p.x,dz=B.tz-e.p.z,l=Math.hypot(dx,dz)||1;e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,0.42]}
  const c=Math.cos(lead.ry),s=Math.sin(lead.ry),ox=e.bo[0]*c+e.bo[1]*s,oz=-e.bo[0]*s+e.bo[1]*c,tx=lead.p.x+ox,tz=lead.p.z+oz,dx=tx-e.p.x,dz=tz-e.p.z,l=Math.hypot(dx,dz);
  if(l<0.4)return[0,0,0];e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,Math.min(0.75,0.3+l*0.12)]}
function torchModel(m){const u=m.userData;if(!u.ch||u.torchM)return;const t=new THREE.Group();t.add(new THREE.Mesh(boxes([[0,-0.3,0.25,0.07,0.07,0.75,'#4a2f1d'],[0,-0.3,0.65,0.13,0.13,0.14,'#3a3a40']]),decoMat));
  const fl=new THREE.Mesh(boxes([[0,-0.3,0.78,0.2,0.2,0.24,'#ff8a2e'],[0,-0.3,0.9,0.12,0.12,0.16,'#ffe08a']]),new THREE.MeshBasicMaterial({vertexColors:true}));t.add(fl);
  const gs=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));gs.scale.set(1.3,1.3,1);gs.position.set(0,-0.3,0.85);t.add(gs);
  t.rotation.x=-0.9;u.ch.userData.le.add(t);u.torchM=t;u.flame=fl}

