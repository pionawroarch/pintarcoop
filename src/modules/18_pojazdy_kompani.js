// =================== ETAP 6: łódź, lotnia, zwierzaki, wierzchowce ===================
const VH={mode:0,bry:0,spd:0,push:0,boat:null,gl:null};
// ===== wierzchowce: koń (G) i gryf (V) =====
let MNT=LS.get('mounts',{});
function toggleOwnMount(kind){
  if(VH.mode===5||VH.mode===6){dismountOwn();return}
  if(VH.mode!==0||P2.dead)return;
  if(kind==='kon'&&MNT.ride&&MNT[MNT.ride])kind=MNT.ride;
  if(!MNT[kind]&&!(kind==='gryf'&&MNT.plaszczka))return toast(kind==='gryf'?'Nie masz gryfa. Kupisz go u kupca w osadzie (od 12 poziomu).':'Nie masz konia. Kupisz go u kupca w osadzie.','#ff8a7a');
  if(player.swim)return toast('Nie w wodzie','#ff8a7a');
  const gnd=kind!=='gryf';const m=gnd?mountModel(kind):makeEnemy(MNT.plaszczka?'plaszczka':'gryf',false);m.position.copy(player.p);m.rotation.y=player.ry;scene.add(m);
  VH.mnt={m,kind};VH.mode=gnd?5:6;sfx(kind==='kon'?'neigh':kind==='wilk'?'howl':kind==='jelen'?'neigh':'screech');
  toast(gnd?(MRIDE[kind]?MRIDE[kind].n:'Koń')+' · Shift galop · G zsiada':(MNT.plaszczka?'Lot na płaszczce':'Lot na gryfie')+' · Spacja w górę · Ctrl w dół · V zsiada (przy ziemi)','#cfe8ff')}
function dismountOwn(force){if(!VH.mnt){if(VH.mode===5||VH.mode===6)VH.mode=0;return}
  if(VH.mode===6&&!force){const h=colAt(player.p.x,player.p.z);if(h!==null&&player.p.y-h>3)return toast('Najpierw zniż lot przy ziemi (Ctrl)','#ff8a7a')}
  scene.remove(VH.mnt.m);VH.mnt=null;VH.mode=0;player.p.y+=0.2;meRef.rotation.x=0;meRef.rotation.z=0}
function dlgCoat(buy){const o=HCOATS.slice(0,HCN).map(([n],i)=>[n+(buy?'':(i===(MNT.koat||0)?' (obecna)':'')),()=>{if(buy){MNT.koat=i;buyMount('kon',250,1)}else{if((INV.gold||0)<60)return dlgRoot('Przefarbowanie… znaczy zamiana konia na innej maści kosztuje 60 zł.');INV.gold-=60;MNT.koat=i;LS.set('mounts',MNT);saveInv();updHud();if(VH.mnt&&VH.mode===5){dismountOwn(1)}toast('Twój koń ma teraz maść: '+n,'#7dd87d');dlgRoot('Proszę bardzo, '+n.toLowerCase()+' rumak czeka.')}}]);o.push(['Wróć',()=>dlgMounts()]);dlgShow(buy?'Jakiej maści konia szukasz? Mam w stajni wszystkie.':'Na jaką maść chcesz zamienić konia? Koszt: 60 zł.',o)}
function dlgMounts(){const o=[];if(!MNT.kon)o.push(['Koń wierzchowy — 250 zł (wybierz maść)',()=>dlgCoat(true)]);else{o.push(['(Masz już konia — przywołasz go klawiszem G)',()=>dlgMounts()]);o.push(['Zamień konia na inną maść — 60 zł',()=>dlgCoat(false)])}
  if(!MNT.mul)o.push(['Muł juczny — 120 zł (+50 miejsc w jukach na towary handlowe)',()=>{if((INV.gold||0)<120)return dlgRoot('Nie stać cię na muła.');INV.gold-=120;MNT.mul=1;LS.set('mounts',MNT);saveInv();updHud();sfx('coin');dlgRoot('Muł jest twój. Uparty, ale udźwignie sporo worków. Juki: '+goodsCap()+' miejsc.')}]);
  for(const k of ['jelen','wilk']){const R=MRIDE[k];if(!MNT[k])o.push([`${R.n} pod siodło — ${R.price} zł (od ${R.lvl} poziomu)`,()=>buyMount(k,R.price,R.lvl)])}
  {const own=['kon','jelen','wilk'].filter(k=>MNT[k]);if(own.length>1)o.push([`Wierzchowiec pod klawiszem G: ${MRIDE[MNT.ride&&MNT[MNT.ride]?MNT.ride:'kon'].n} — zmień`,()=>{const i=own.indexOf(MNT.ride&&MNT[MNT.ride]?MNT.ride:'kon');MNT.ride=own[(i+1)%own.length];LS.set('mounts',MNT);dlgMounts()}])}
  if(!MNT.gryf)o.push(['Gryf do latania — 2500 zł (od 12 poziomu)',()=>buyMount('gryf',2500,12)]);else o.push(['(Masz już gryfa — przywołasz go klawiszem V)',()=>dlgMounts()]);
  o.push(['Wróćmy do rozmowy.',()=>dlgRoot()]);dlgShow('Mam w stajni konia pod siodło, a od czasu do czasu trafia mi się oswojony gryf. Na koniu przemierzysz krainę dwa razy szybciej, a gryf zabierze cię w przestworza.',o)}
function buyMount(k,price,lvl){if(HERO.lvl<lvl)return dlgRoot((k==='gryf'?'Gryf':k==='wilk'?'Wilk bojowy':'Jeleń')+' nie posłucha nowicjusza. Wróć, gdy osiągniesz '+lvl+' poziom.');if((INV.gold||0)<price)return dlgRoot('Nie stać cię. Potrzebujesz '+price+' złota.');
  INV.gold-=price;MNT[k]=1;if(k==='wilk'||k==='jelen')MNT.ride=k;LS.set('mounts',MNT);saveInv();updHud();sfx('coin');if(k==='wilk'||k==='jelen'){toast('Kupiono: '+MRIDE[k].n+'! Przywołasz go klawiszem G.','#7dd87d');return dlgRoot('Twój '+MRIDE[k].n.toLowerCase()+' czeka. Gwizdnij (G).')}toast(k==='kon'?'Kupiono konia! Przywołasz go klawiszem G.':'Kupiono gryfa! Przywołasz go klawiszem V.','#7dd87d');dlgRoot(k==='kon'?'Dobry wybór. Gwizdnij (G), a przybiegnie.':'Gryf jest twój. Wezwij go klawiszem V.')}
function mountFrame(dt){if(!(VH.mode===5||VH.mode===6))return;if(!VH.mnt){VH.mode=0;return}
  if(P2.dead){dismountOwn(1);return}if(VH.mode===5&&player.swim){dismountOwn(1);toast('Koń nie wejdzie do głębokiej wody','#ff8a7a');return}
  const M=VH.mnt.m,ox=M.position.x,oz=M.position.z;M.position.copy(player.p);let dr=player.ry-M.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));M.rotation.y+=dr*Math.min(1,dt*10);
  const spd=Math.hypot(player.p.x-ox,player.p.z-oz)/Math.max(dt,1e-3),air=VH.mode===6&&!player.ground;animEnemy(M,air?0:Math.min(16,spd),dt,0,0,false);
  let bob=0;if(VH.mode===6){VH.bank=(VH.bank||0)+((-dr*2.4)-(VH.bank||0))*Math.min(1,dt*3);M.rotation.z=air?Math.max(-0.5,Math.min(0.5,VH.bank)):0;M.rotation.x=air?Math.max(-0.3,Math.min(0.3,-player.v.y*0.025+Math.min(0.2,spd*0.006))):0;
    if(air){for(const l of (M.userData.plegs||[]))l.rotation.x=-0.9;bob=Math.sin(performance.now()*0.004)*0.1;M.position.y+=bob;VH.flapT=(VH.flapT||0)-dt;if(VH.flapT<=0){VH.flapT=0.55+Math.random()*0.4;sfx('flap',0.35)}}}
  else{M.rotation.z=0;M.rotation.x=0}
  meRef.position.y+=(VH.mode===5?((MRIDE[VH.mnt.kind]&&MRIDE[VH.mnt.kind].seat)||1.0):0.95)+bob;meRef.rotation.z=M.rotation.z;meRef.rotation.x=M.rotation.x;const u=meRef.userData;u.ll.rotation.x=-1.35;u.rl.rotation.x=-1.35}
function remoteMount(r,c,dt){if(c.veh===5||c.veh===6){const kind=c.veh===5?(MRIDE[c.mk]?c.mk:'kon'):'gryf';if(!r.mnt||r.mntK!==kind||(kind==='kon'&&(r.mnt.userData.coat||0)!==(c.hc||0))){if(r.mnt)scene.remove(r.mnt);r.mnt=kind==='kon'?horseCoat(makeHorseE('kon',false),c.hc||0):kind==='gryf'?makeEnemy('gryf',false):(()=>{const q=makeEnemy(kind,false);q.scale.multiplyScalar(MRIDE[kind].sc||1);return q})();r.mntK=kind;scene.add(r.mnt)}
    const ox=r.mnt.position.x,oz=r.mnt.position.z;r.mnt.position.set(r.g.position.x,r.g.position.y,r.g.position.z);r.mnt.rotation.y=r.g.rotation.y;const s=Math.hypot(r.mnt.position.x-ox,r.mnt.position.z-oz)/Math.max(dt,1e-3);animEnemy(r.mnt,Math.min(16,s),dt,0,0,false);
    r.g.position.y+=kind==='gryf'?0.95:((MRIDE[kind]&&MRIDE[kind].seat)||1.0);const u=r.g.userData;u.ll.rotation.x=-1.35;u.rl.rotation.x=-1.35}else if(r.mnt){scene.remove(r.mnt);r.mnt=null}}
// ===== kondycja (stamina) na sprint =====
function staTick(dt,wantS,moving){if(!isFinite(P2.sta))P2.sta=100;if(!isFinite(dt))dt=0.016;let sprint=wantS&&moving&&!P2.staLock&&P2.sta>0;
  if(sprint){P2.sta=Math.max(0,P2.sta-dt*11*(1-0.004*Math.min(100,skL('wytrz')))*(1-0.12*pk('kondycja')));P2.staT=0.6;if(P2.sta<=0)P2.staLock=1}
  else{P2.staT=(P2.staT||0)-dt;if(P2.staT<=0)P2.sta=Math.min(100,P2.sta+dt*(player.ground?38:18)*(1+0.15*pk('kondycja')))}
  if(P2.staLock&&P2.sta>=30)P2.staLock=0;const e=document.getElementById('stb');if(e){e.style.width=P2.sta+'%';const w=e.parentNode;w.classList.toggle('lock',!!P2.staLock);w.classList.toggle('full',P2.sta>=99.9)}return sprint}
// ===== światło od świecących stworzeń (sloty 8-11) =====
const GLOWL={zywiolak:[1,.55,.2,11,2.6],lich:[.75,.45,1,7,1.6],upior:[.5,.85,1,6,1.3],matka:[.5,1,.4,5,1.1],golem:[.5,.9,1,4.5,0.9],kolos:[1,.6,.2,5,1.0],faraon:[.5,.9,1,4,.9],mumia:[1,.85,.3,4,.8],krol_s:[1,.25,.2,4,1],smok:[1,.5,.2,6,0.9]};
function glowLights(){const cand=[];for(const e of enemies.values()){if(e.st===2)continue;const G=GLOWL[e.t];if(!G)continue;const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d<70)cand.push([d,e,G])}cand.sort((a,b)=>a[0]-b[0]);const now=performance.now();
  for(let k=0;k<4;k++){const U=SEAS_U.uLamp.value[8+k],c=cand[k];if(c){const e=c[1],G=c[2],fl=e.t==='zywiolak'?1+Math.sin(now*0.017+e.id)*0.12+Math.sin(now*0.041+e.id*2)*0.08:1+Math.sin(now*0.003+e.id)*0.05;U.set(e.p.x,e.p.y+1.4*(e.elite?1.35:1),e.p.z,G[3]*(e.elite?1.25:1));SEAS_U.uLampI.value[8+k]=G[4]*fl;SEAS_U.uLampC.value[8+k].set(G[0],G[1],G[2])}else{U.w=0;SEAS_U.uLampI.value[8+k]=0}}}
// ===== odgłosy stworzeń: [w spoczynku, przy zamachu, przy uderzeniu] =====
const CRS={krowa:['moo'],owca:['baa'],swinia:['oink'],kura:['cluck'],kaczka:['quack'],pies:['bark'],kot:['meow'],kon:['neigh'],koza:['baa'],jelen:[null],renifer:[null],wielblad:['grunt'],
 wilk:['howl','growl','bite'],wilkolak:['howl','growl','claw'],dzik:['snort','snort','thud'],niedzwiedz:['bearroar','bearroar','claw'],pajak:['hiss','hiss','bite'],matka:['hiss','screech','bite'],skorpion:['hiss','hiss','claw'],krab:[null,'claw','claw'],slime:['squelch','squelch','squelch'],ropucha:['frog','frog','squelch'],
 yeti:['roar','roar','slam'],golem:[null,'grunt','slam'],kolos:[null,'roar','slam'],bazyliszek:['hiss','hiss','bite'],gryf:['screech','screech','claw'],zywiolak:['crackle','crackle','slam'],smok:['roar','roar','bite'],
 troll:['grunt','roar','thud'],krol_troll:['grunt','roar','thud'],ork:['grunt','grunt','whoosh'],goblin:[null,'screech','whoosh'],bandyta:[null,'grunt','whoosh'],szaman:[null,'moan','whoosh'],szkielet:['rattle','rattle','whoosh'],lucznik_s:['rattle','rattle',null],krol_s:['rattle','moan','whoosh'],mumia:['moan','moan','thud'],faraon:['moan','moan','whoosh'],upior:['moan','moan','whoosh'],lich:['moan','moan',null],drzewiec:['grunt','grunt','thud'],prastary:['grunt','roar','thud']};
function sfxAt(n,x,z,vol){if(!n||!AUD.on)return;const d=Math.hypot(x-player.p.x,z-player.p.z);if(d>42)return;sfx(n,(vol??1)*Math.pow(Math.max(0,1-d/42),1.3))}
function enemySounds(m,u,st,dt){const S2=CRS[u.et];if(!m.parent)return;const x=m.position.x,z=m.position.z;
  if(st===2){if(!u.sdead){u.sdead=1;sfxAt(u.pas?'thud':'kill',x,z,0.7)}return}u.sdead=0;
  if(!S2)return;if(u.lastSt!==1&&st===1&&Math.random()<0.45)sfxAt(S2[1],x,z,0.8);
  u.sndT=(u.sndT??(3+Math.random()*10))-dt;if(u.sndT<=0){u.sndT=7+Math.random()*16;if(S2[0]&&Math.random()<0.6)sfxAt(S2[0],x,z,u.pas?0.5:0.65)}}
function enemyStrikeSound(m,u){const S2=CRS[u.et];if(m.parent)sfxAt((S2&&S2[2])||'whoosh',m.position.x,m.position.z,0.8)}
// ===== style ataku stworzeń =====
const ATKS={wolf:'pounce',dog:'pounce',fox:'pounce',cat:'pounce',griffin:'rear',bear:'rear',boar:'charge',deer:'charge',reindeer:'charge',goat:'charge',cow:'charge',camel:'charge',yeti:'slam',golem:'slam',colossus:'slam',dragon:'rear',scorpion:'sting',spider:'pounceS',spiderq:'pounceS',crab:'pounceS',toad:'pounce',basilisk:'charge',turtle:'charge',lizard:'pounce'};
function atkStyle(u,w,sk){const sty=ATKS[u.pk];if(!sty||(w<=0.001&&sk<=0.001))return 0;const S=u.S,R=u.root;
  switch(sty){case 'pounce':R.position.y+=(-w*0.1+sk*0.42)*S;R.position.z+=(-w*0.12+sk*0.55)*S;R.rotation.x+=w*0.14-sk*0.28;break;
   case 'pounceS':R.position.y+=(w*0.1+sk*0.2)*S;R.position.z+=(-w*0.1+sk*0.42)*S;R.rotation.x+=-w*0.38+sk*0.22;break;
   case 'charge':R.position.z+=(-w*0.16+sk*0.75)*S;R.rotation.x+=w*0.1-sk*0.05;return 0.5*w-0.7*sk;
   case 'rear':R.rotation.x+=-w*0.6+sk*0.38;R.position.y+=w*0.16*S;R.position.z+=(sk*0.42-w*0.08)*S;break;
   case 'slam':R.rotation.x+=-w*0.3+sk*0.48;R.position.y+=(w*0.08-sk*0.05)*S;R.position.z+=sk*0.28*S;R.rotation.z+=Math.sin(u.idt*45)*0.035*sk;break;
   case 'sting':R.rotation.x+=-w*0.28+sk*0.32;R.position.z+=(-w*0.1+sk*0.38)*S;break}return 0}

const tameable=t=>!!FOODOF[t]&&!EDEF[t].boss;
const MOUNT=Object.assign(MOUNT_X,{gryf:0.95,wilkolak:0.95,wilk:0.65,dzik:0.6,yeti:1.8,golem:2.0,skorpion:0.6,pajak:0.75,kon:1.0,jelen:0.9,renifer:0.9,wielblad:1.4,niedzwiedz:1.15});for(const [t,f] of Object.entries(SCALE_FIX))if(MOUNT[t]!=null)MOUNT[t]*=f;
const MH={};// wysokość siodła dla zwierząt bez wpisu w MOUNT (z obrysu modelu)
function mountH(t,m){if(!t||!EDEF[t])return 0;if(MOUNT[t]!=null)return MOUNT[t];const d=EDEF[t];if(HUM[t]||d.sea||d.swim||NOMOUNT.has(t))return 0;if(MH[t]!=null)return MH[t];
  if(!m&&PET&&PET.t===t)m=PET.m;let tmp=null;if(!m){try{m=tmp=makeEnemy(t,false)}catch(_){return 0}}let h=0.8,raw=1;try{const B=hbLocal(m);if(B){raw=(B[4]-B[1])*(m.scale?m.scale.y:1);h=raw*0.74}}catch(_){}if(tmp)try{tmp.userData.mat&&tmp.userData.mat.dispose()}catch(_){}return MH[t]=raw<1.05?0:Math.max(0.5,Math.min(2.2,h))}
const NOMOUNT=new Set(['szczur','kura','kurczak','zaba','motyl','wazka','swietlik','krolik','wiewiorka','jez','kaczka','ryba','mysz','nietoperz','cma','cma_ksiezycowa','swietlik_bledny']);
const MSPD={slon:1.15,los:1.4,strus:1.55,jednorozec:1.6,pegaz:1.7,jelen_ks:1.4,zolw_kr:0.8,slimak:0.6,gryf:1.6,kon:1.5,jelen:1.35,renifer:1.35,wielblad:1.25,wilk:1.2,niedzwiedz:1.1};
// łódź na 2 graczy + po jednym zwierzęciu: sternik w 0, pasażer z przodu, zwierzęta na dziobie i rufie
const BSEAT={drv:0,pas:2.25,petD:-1.55,petP:3.5};
function makeBoat(){
  // prosta łódź wiosłowa: klepkowy kadłub, dwie burty z listwą, trzy ławki, dulki i dobrze ustawione wiosła
  const g=new THREE.Group(),L=[],WP=['#8a6240','#7a5532','#94693f'],DK='#4a2f1d',IN='#9a7048',cz=0.7,half=2.85,n=26,dz=2*half/n;
  const W=t=>Math.max(0.22,1.55*Math.pow(Math.max(0,1-Math.pow(Math.abs(t),2.2)),0.5));
  for(let i=0;i<n;i++){const z=cz-half+(i+0.5)*dz,t=(z-cz)/half,w=W(t),rise=0.22*t*t*(t>0?1.3:0.8),bot=-0.3+0.16*t*t,top=0.5+rise,dd=dz+0.004;
    L.push([0,bot,z,Math.max(0.16,w*0.55),0.1,dd,DK]);
    for(let k=0;k<3;k++){const hS=(top-bot)/3,y0=bot+k*hS,xo=w/2*(0.62+0.38*k/2),th=0.09;for(const sg of [-1,1])L.push([sg*(xo-th/2),y0+hS/2,z,th,hS+0.03,dd,WP[(k+(i>>2))%3]])}
    for(const sg of [-1,1])L.push([sg*(w/2-0.02),top+0.04,z,0.12,0.07,dd,'#6b4528']);
    if(Math.abs(t)<0.86)L.push([0,bot+0.08,z,w*0.62-0.06,0.03,dd,i%2?IN:'#8e6640']);else L.push([0,(bot+top)/2,z,w*0.9,top-bot,dd,WP[0]])}
  L.push([0,-0.36,cz,0.1,0.08,2*half-0.1,DK]);
  {const zf=cz+half,zb=cz-half;L.push([0,0.62,zf-0.05,0.12,0.55,0.16,DK],[0,0.95,zf+0.02,0.1,0.1,0.12,'#6b4528']);L.push([0,0.18,zb+0.06,1.0,0.62,0.08,WP[1]],[0,0.5,zb+0.04,1.04,0.06,0.1,DK])}
  for(const [z,w] of [[0,1.38],[1.75,1.2],[-1.2,1.1]])L.push([0,0.3,z,w,0.07,0.34,'#a07650'],[0,0.12,z,0.12,0.3,0.12,DK]);
  L.push([0.35,0.12,2.6,0.4,0.3,0.4,'#8a5a30'],[0.35,0.28,2.6,0.44,0.04,0.44,'#3a3a40'],[-0.3,0.08,-1.9,0.42,0.12,0.42,'#d8c8a0'],[-0.3,0.15,-1.9,0.3,0.04,0.3,'#c8b890']);
  for(const sg of [-1,1])L.push([sg*0.68,0.6,0.1,0.06,0.14,0.06,'#3a3a40'],[sg*0.68,0.68,0.1,0.06,0.04,0.16,'#3a3a40']);
  g.add(new THREE.Mesh(boxes(L),decoMat));
  {// maska głębi wnętrza kadłuba: niewidoczna bryła zapisująca tylko głębię, rysowana przed wodą — woda nie prześwituje przez łódź
    const M=[];for(let i=0;i<n;i++){const z=cz-half+(i+0.5)*dz,t=(z-cz)/half,w=W(t);if(Math.abs(t)>0.9)continue;const rise=0.22*t*t*(t>0?1.3:0.8),bot=-0.3+0.16*t*t,top=0.5+rise,mid=(bot+top)/2;M.push([0,(bot+0.05+mid)/2,z,Math.max(0.05,w*0.62-0.08),mid-bot-0.05,dz+0.01,'#000'],[0,(mid+top)/2,z,Math.max(0.05,w*0.86-0.1),top-mid,dz+0.01,'#000'])}
    const mk=new THREE.Mesh(boxes(M),new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:true,transparent:true}));mk.renderOrder=-5;mk.userData.mask=1;g.add(mk)}
  const oar=sg=>{const o=new THREE.Group();o.position.set(sg*0.68,0.66,0.1);const inner=new THREE.Group();inner.rotation.z=sg*-0.42;
    inner.add(new THREE.Mesh(boxes([[sg*0.62,0,0,2.3,0.055,0.055,'#9a7448'],[sg*-0.44,0,0,0.22,0.08,0.08,'#5a3a22'],[sg*0.05,0,0,0.12,0.08,0.08,'#3a3a40'],[sg*1.92,0,0,0.6,0.22,0.035,'#9a7448'],[sg*1.62,0,0,0.08,0.12,0.045,'#7a5532'],[sg*2.2,0,0,0.04,0.22,0.04,'#6b4528']]),decoMat));
    o.add(inner);g.add(o);return o};
  if(MNT.sail){const S2=[];S2.push([0,2.6,0.9,0.14,4.4,0.14,'#5a3a22'],[0,4.6,0.9,0.1,0.1,2.4,'#4a2f1d'],[0,1.6,0.9,0.1,0.1,2.6,'#4a2f1d']);for(let k=0;k<5;k++)S2.push([0.05,1.8+k*0.56,0.9,0.04,0.58,2.3-k*0.12,k%2?'#efe6d0':'#e0d4b8']);S2.push([0,5,0.9,0.04,0.4,0.6,'#a8302a']);const sm=new THREE.Mesh(boxes(S2),decoMat);sm.castShadow=true;g.add(sm)}
  {// detale: wręgi od środka, latarnia na dziobie, zwój liny, kotwica, oparcie rufowe, wiadro i sieć
    const D=[];for(let z=-1.9;z<=2.4;z+=0.62){const t=(z-0.7)/2.85,w=W(t);for(const sg of [-1,1])D.push([sg*(w/2-0.1),0.25,z,0.07,0.42,0.07,'#5a3a22'])}
    D.push([0,1.05,3.38,0.06,0.7,0.06,'#3a2414'],[0,1.42,3.38,0.22,0.06,0.06,'#3a2414'],[0.1,1.3,3.38,0.14,0.2,0.14,'#2a2a2e'],[0.1,1.3,3.38,0.09,0.13,0.09,'!#ffcf6a'],[0.1,1.42,3.38,0.16,0.03,0.16,'#2a2a2e']);
    for(let k=0;k<8;k++){const a=k/8*6.283;D.push([-0.35+Math.cos(a)*0.17,0.06+(k%2)*0.03,2.3+Math.sin(a)*0.17,0.1,0.06,0.1,'#c8b890'])}
    D.push([0.38,0.1,-0.4,0.1,0.42,0.06,'#4a4a52'],[0.38,-0.08,-0.4,0.34,0.06,0.06,'#4a4a52'],[0,0.62,-1.86,0.9,0.5,0.06,'#8a6240'],[0,0.88,-1.86,0.95,0.05,0.09,'#4a2f1d'],[-0.42,0.06,0.9,0.22,0.24,0.22,'#7a5a3a'],[-0.42,0.19,0.9,0.24,0.03,0.24,'#3a3a40'],[0.4,0.04,1.2,0.4,0.05,0.5,'#a89878']);
    const dm=new THREE.Mesh(boxes(D.filter(b=>b[6][0]!=='!')),decoMat);g.add(dm);g.add(new THREE.Mesh(boxes(D.filter(b=>b[6][0]==='!').map(b=>[...b.slice(0,6),b[6].slice(1)])),GLOWMAT))}
  g.userData={oL:oar(-1),oR:oar(1),ph:0};g.traverse(o=>{if(o.isMesh&&!o.userData.mask)o.castShadow=true});g.scale.setScalar(1.25);return g;
}
function makeGlider(){const L=[],n=14,SAIL=['#e8dcc0','#a8352a','#e8dcc0','#2f4f7a','#e8dcc0','#a8352a'],WD='#5a3b22',WDD='#3a2414',IR='#6a6a72';
  // lotnia: delta z płótna na drewnianej ramie — panele promieniowe, listwy, krawędź natarcia z drzewca, maszt (kil), poprzeczka, trapez sterowy, uprząż i proporce
  for(let k=0;k<n;k++){const t=k/(n-1),z=1.25-t*2.1,hw=0.12+t*2.25,y=-t*0.06+Math.sin(t*Math.PI)*0.05,dz=2.1/(n-1)+0.01,np=6;
    for(let q=0;q<np;q++){const x0=-hw+q*(2*hw/np),w=2*hw/np;L.push([x0+w/2,y-Math.abs(x0+w/2)*0.035,z,w+0.01,0.04,dz,SAIL[q]])}
    for(let q=1;q<6;q++){const x=-hw+q*(2*hw/6);L.push([x,y-Math.abs(x)*0.035+0.03,z,0.035,0.03,dz,WDD])}
    const sw=2.25/(n-1)+0.07;L.push([hw-sw/2+0.05,y-hw*0.035+0.02,z,sw,0.075,dz+0.02,WD],[-hw+sw/2-0.05,y-hw*0.035+0.02,z,sw,0.075,dz+0.02,WD])}
  for(let q=0;q<6;q++){const x=-2.37+q*0.79+0.4;L.push([x,-0.11-Math.abs(x)*0.035,-0.9,0.5,0.03,0.18,SAIL[q]])}
  L.push([0,0.06,0.15,0.08,0.08,2.6,WD],[0,0.05,1.42,0.12,0.12,0.12,'#c9a24a'],[0,0.12,-1.05,0.05,0.28,0.32,WDD],[0,0.0,-0.2,3.6,0.07,0.07,WD],[0,0.08,0.15,0.16,0.16,0.16,IR]);
  for(const sg of [1,-1])L.push([sg*1.8,-0.06,-0.2,0.1,0.1,0.1,IR],[sg*2.42,-0.02,-0.85,0.04,0.36,0.04,WDD],[sg*2.42,-0.25,-0.85,0.03,0.12,0.25,sg>0?'#d9b23a':'#a8352a'],[sg*2.42,-0.36,-0.97,0.03,0.1,0.22,sg>0?'#a8352a':'#d9b23a']);
  L.push([0.34,-0.46,0.12,0.05,0.92,0.05,WD],[-0.34,-0.46,0.12,0.05,0.92,0.05,WD],[0,-0.94,0.12,0.84,0.06,0.06,WD],[0.36,-0.94,0.12,0.09,0.13,0.09,'#2a1a10'],[-0.36,-0.94,0.12,0.09,0.13,0.09,'#2a1a10']);
  L.push([0,-0.3,0.02,0.03,0.6,0.03,'#6b4a2b'],[0.16,-0.32,-0.08,0.02,0.62,0.02,'#6b4a2b'],[-0.16,-0.32,-0.08,0.02,0.62,0.02,'#6b4a2b'],[0,-0.62,-0.05,0.4,0.1,0.18,'#5a3a22']);
  L.push([0,0.03,0.62,0.5,0.03,0.5,'#c9a24a'],[0,0.035,0.62,0.36,0.03,0.36,'#2f4f7a'],[0,0.04,0.62,0.12,0.03,0.24,'#e8dcc0'],[0,0.04,0.62,0.24,0.03,0.08,'#e8dcc0']);
  const m=new THREE.Mesh(boxes(L),decoMat);m.castShadow=true;m.position.y=2.45;return m}
function animBoat(b,spd,dt){const u=b.userData;u.ph+=dt*(1+Math.abs(spd)*0.6);const t=u.ph,s=Math.min(1,Math.abs(spd)/6);
  let dr=b.rotation.y-(u.lry??b.rotation.y);dr=Math.atan2(Math.sin(dr),Math.cos(dr));u.lry=b.rotation.y;u.turn=(u.turn||0)+((dr/Math.max(dt,1e-3))-(u.turn||0))*Math.min(1,dt*4);
  b.rotation.z=Math.sin(t*0.9)*0.03+Math.sin(t*2.3)*0.01-u.turn*0.09*s;b.rotation.x=Math.sin(t*0.7)*0.02-s*0.05+Math.sin(t*2.2)*0.012*s;
  const go=Math.abs(spd)>0.5,ph=t*2.2,sw=go?Math.sin(ph)*0.55:0,dip=Math.cos(ph),lift=go?(dip>0?-0.04:0.22):0.16;u.oL.rotation.y=-sw;u.oR.rotation.y=sw;u.oL.rotation.z=-lift;u.oR.rotation.z=lift;u.row=go?Math.sin(ph):0;
  b.position.y+=Math.sin(t*1.7)*0.05+Math.sin(t*0.6)*0.03;
  if(typeof PFX!=='undefined'&&b.parent){const a=b.rotation.y;if(s>0.25&&Math.random()<dt*10*s)PFX.emit(b.position.x-Math.sin(a)*2.4+(Math.random()-0.5)*1.2,WATER-0.05,b.position.z-Math.cos(a)*2.4,1,['#ffffff','#d8f0ff'],{sp:1,up:0.8,g:5,life:0.7,size:0.08});
    if(go&&dip>0.96&&!u.spl){u.spl=1;for(const sd of [1,-1])PFX.emit(b.position.x+Math.cos(a)*1.9*sd,WATER,b.position.z-Math.sin(a)*1.9*sd,4,['#ffffff','#cfe8ff'],{sp:1.5,up:1.6,g:7,life:0.5,size:0.07});sfx('splash',0.12)}else if(dip<0.85)u.spl=0}}
// --- łódź ---
function toggleBoat(){
  if(VH.mode===1)return exitBoat();
  if(VH.mode===4)return leavePassenger();
  if(VH.mode!==0||P2.dead)return;
  for(const [id,r] of remotes){if(!r.boat)continue;const sp=seatPos(r.boat,BSEAT.pas);if(Math.hypot(sp[0]-player.p.x,sp[2]-player.p.z)<4.5){if([...remotes.values()].some(o=>o!==r&&o.buf.length&&o.buf[o.buf.length-1].veh===4&&o.buf[o.buf.length-1].bh===id))return toast('Miejsce pasażera jest zajęte','#ff8a7a');
    VH.mode=4;VH.host=id;toast('Płyniesz jako pasażer · Shift lub B — wysiądź','#cfe8ff');return}}
  let spot=null;const p=player.p,ic=season===2&&WATER_U.uIce.value>0.5,okW=h=>h!==null&&h<(ic?WATER-4.2:WATER-0.6);
  const okR=(x,z)=>{const h=colAt(x,z),w=wlAt(x,z);return w>WATER&&h!==null&&h<w-0.6};
  if(okW(colAt(p.x,p.z))||okR(p.x,p.z))spot=[p.x,p.z];
  for(let r=1;r<=4&&!spot;r++)for(let a=0;a<6.28&&!spot;a+=0.5){const x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r,h=colAt(x,z);if(okW(h)||okR(x,z))spot=[x,z]}
  if(!spot)return toast(ic?'Woda jest tu zamarznięta – łódź zwodujesz tylko przy głębokiej wodzie':'Łódź zwodujesz tylko przy wodzie','#ff8a7a');
  VH.mode=1;VH.bry=player.ry;VH.spd=0;VH.push=0;VH.wl=wlAt(spot[0],spot[1]);p.set(spot[0],VH.wl-0.05,spot[1]);player.v.set(0,0,0);VH.boat=makeBoat();scene.add(VH.boat);toast('Łódź: W/S płyń, A/D skręcaj, Shift lub B — wysiądź','#cfe8ff');
}
// pasażer siedzi nieruchomo twarzą do wioślarza, dłonie na kolanach
function seatPose(u){if(!u.ll)return;u.ll.rotation.set(-1.45,0,0.06);u.rl.rotation.set(-1.45,0,-0.06);if(u.lk)u.lk.rotation.x=1.4;if(u.rk)u.rk.rotation.x=1.4;u.la.rotation.set(-0.55,0,0.1);u.ra.rotation.set(-0.55,0,-0.1);if(u.le)u.le.rotation.x=-0.5;if(u.re)u.re.rotation.x=-0.5;if(u.torso){u.torso.rotation.set(0.04,0,0);u.torso.position.y=(u.ty0||0.74)}if(u.head)u.head.rotation.set(0,0,0);if(u.cape)u.cape.rotation.x=0.1}
function seatPos(b,z){const ry=b.rotation.y;return[b.position.x+Math.sin(ry)*z,b.position.y+0.1,b.position.z+Math.cos(ry)*z,ry]}
function passengerTick(){const r=remotes.get(VH.host);if(!r||!r.boat){leavePassenger();return}const s=seatPos(r.boat,BSEAT.pas);player.p.set(s[0],s[1],s[2]);player.v.set(0,0,0);player.ry=s[3]+Math.PI;player.ground=true;player.swim=false}
function leavePassenger(){VH.mode=0;VH.host=null;meRef.rotation.x=0;meRef.rotation.z=0;const p=player.p;for(let rr=2;rr<=7;rr++)for(let a=0;a<6.28;a+=0.4){const x=p.x+Math.cos(a)*rr,z=p.z+Math.sin(a)*rr,h=colAt(x,z);if(h!==null&&!wetAt(x,z,h)){p.set(x,h+0.05,z);return}}p.y=(VH.wl||WATER)-1.3}
function exitBoat(land){
  if(VH.boat){scene.remove(VH.boat);VH.boat=null}VH.mode=0;
  if(land)player.p.set(land[0],land[1]+0.05,land[2]);else{player.p.y=(VH.wl||WATER)-1.3}
  player.v.set(0,0,0);
}
function boatPhysics(dt){
  const p=player.p,mul=hasP('plywak')?1.25:1;
  if(keys.has('KeyA'))VH.bry+=1.7*dt;if(keys.has('KeyD'))VH.bry-=1.7*dt;
  if(keys.has('KeyW'))VH.spd=Math.min((MNT.sail?17:11)*mul,VH.spd+7*dt);else if(keys.has('KeyS'))VH.spd=Math.max(-4,VH.spd-7*dt);else VH.spd*=1-0.7*dt;
  const nx=p.x+Math.sin(VH.bry)*VH.spd*dt,nz=p.z+Math.cos(VH.bry)*VH.spd*dt,ax=nx+Math.sin(VH.bry)*(VH.spd>=0?3.9:-2.1),az=nz+Math.cos(VH.bry)*(VH.spd>=0?3.9:-2.1),ah=colAt(ax,az);
  const curL=VH.wl||WATER,aL=ah===null?curL:wlAt(ax,az);
  const iced=season===2&&WATER_U.uIce.value>0.5&&curL===WATER;
  if(ah===null){VH.spd=0}
  else if(iced&&ah<WATER-0.35&&ah>WATER-4.2){VH.spd=Math.min(VH.spd,0);if(keys.has('KeyW')&&!VH.iceT){VH.iceT=1;toast('Lód blokuje łódź – płyń głębszą wodą','#cfe8ff');setTimeout(()=>VH.iceT=0,4000)}}
  else if(ah<aL-0.35&&aL>curL+0.5){VH.spd=Math.min(VH.spd,0);if(keys.has('KeyW')&&!VH.iceT){VH.iceT=1;toast('Wodospad – łodzią nie popłyniesz pod prąd','#cfe8ff');setTimeout(()=>VH.iceT=0,4000)}}
  else if(ah>=aL-0.35){if(keys.has('KeyW')){VH.push+=dt;if(VH.push>0.35){const lx=nx+Math.sin(VH.bry)*4.3,lz=nz+Math.cos(VH.bry)*4.3,lh=colAt(lx,lz);if(lh!==null&&lh-curL<2.2){exitBoat([lx,lh,lz]);return}}}VH.spd=Math.min(VH.spd,0)}
  else{VH.push=0;p.x=nx;p.z=nz}
  {const h0=colAt(p.x,p.z),w0=wlAt(p.x,p.z);if(h0!==null&&h0<w0){if(w0<curL-0.5&&VH.wl!==w0)sfx('splash',0.8);if(w0<=curL||w0-curL<0.6)VH.wl=w0}}
  {const T=(VH.wl||WATER)-0.05;p.y=p.y>T+0.01?Math.max(T,p.y-15*dt):T}
  player.v.set(0,0,0);player.ry=VH.bry;player.ground=true;player.swim=false;
}
// --- lotnia ---
function startGlide(){if(VH.mode!==0||player.ground||player.swim||P2.dead)return false;const h=colAt(player.p.x,player.p.z);if(h!==null&&player.p.y-h<2.2)return false;VH.mode=2;VH.gl=makeGlider();meRef.add(VH.gl);return true}
function stopGlide(){if(VH.gl){meRef.remove(VH.gl);VH.gl=null}if(VH.mode===2)VH.mode=0;meRef.rotation.z=0}
function gliderVel(v,dt){
  const fy=facing();let dr=fy-player.ry;dr=Math.atan2(Math.sin(dr),Math.cos(dr));player.ry+=dr*Math.min(1,3*dt);
  const w=keys.has('KeyW'),s=keys.has('KeyS'),spd=w?19:s?9:14,vy=(w?-2.6:s?-0.45:-0.95)*(1-0.1*pk('lotnik'));
  v.x+=(Math.sin(player.ry)*spd-v.x)*Math.min(1,2*dt);v.z+=(Math.cos(player.ry)*spd-v.z)*Math.min(1,2*dt);v.y+=(vy-v.y)*Math.min(1,3*dt);
}
// --- zwierzaki ---
if(!INV.lampGiven){INV.lampGiven=1;const has=INV.eq.latarnia||INV.bag.some(b=>b&&b.base==='latarnia');if(!has)INV.eq.latarnia={id:'i'+Date.now()+'L',slot:'latarnia',base:'latarnia',rar:0,lvl:1,name:'Latarnia Wędrowca'}}
INV.hot=INV.hot||[{k:'pot'},null,null,null,null,null,null,null];
$('hotbar').onclick=e=>{const b=e.target.closest('[data-hot]');if(b)useHot(+b.dataset.hot)};
$('hotbar').oncontextmenu=e=>{e.preventDefault();const b=e.target.closest('[data-hot]');if(b&&INV.hot[+b.dataset.hot]&&INV.hot[+b.dataset.hot].k!=='pot'){INV.hot[+b.dataset.hot]=null;saveInv();renderHot()}};
$('hotbar').ondragover=e=>e.preventDefault();
$('hotbar').ondrop=e=>{e.preventDefault();const b=e.target.closest('[data-hot]'),id=e.dataTransfer.getData('text/iid');if(!b||!id)return;for(let k=0;k<8;k++)if(INV.hot[k]&&INV.hot[k].id===id)INV.hot[k]=null;INV.hot[+b.dataset.hot]={k:'item',id};saveInv();renderHot()};
document.addEventListener('dragstart',e=>{const s=e.target.closest&&e.target.closest('[data-iid]');if(s)e.dataTransfer.setData('text/iid',s.dataset.iid)});
setTimeout(renderHot,500);
INV.pets=INV.pets||[];INV.food=INV.food||{koniczyna:2,marchew:2,owies:1,mieso:1};if(INV.treat){INV.food.mieso=(INV.food.mieso||0)+INV.treat}delete INV.treat;
let PET=null;
function petDef(){return INV.pets.find(p=>p.id===INV.petA)||null}
function spawnPet(){despawnPet();const d=petDef();if(!d)return;const m=makeEnemy(d.t,false);m.add(nameTag(d.name||EDEF[d.t].n,'#7dd87d'));m.children[m.children.length-1].position.y=(EDEF[d.t].legs.length?1.9:1.5)*(EDEF[d.t].sc||1);scene.add(m);
  const a=player.ry+Math.PI;PET={t:d.t,m,p:new THREE.Vector3(player.p.x+Math.sin(a)*2,player.p.y,player.p.z+Math.cos(a)*2),ry:player.ry,cd:0,st:0,stT:0,speed:0}}
function despawnPet(){if(PET){scene.remove(PET.m);PET.m.userData.mat.dispose();PET=null}if(VH.mode===3)VH.mode=0}

// ===== kompani (zwierzak + najemnicy) jako cele wrogów =====
function petMaxHp(){if(!PET)return 1;const pd=petDef();return Math.round(EDEF[PET.t].hp*1.6*(1+0.38*(((pd&&pd.lvl)||1)-1))*(pd&&pd.el?1.4:1)*(1+0.08*ppk(pd,'skora'))*(pms(pd,5)?1.15:1))}
function folEq(d){d.eq=d.eq||{};let def=0,hp=0;for(const k in d.eq){const it=d.eq[k];if(!it)continue;const u=1+0.1*(it.up||0);if(it.def)def+=it.def*u;if(it.hp)hp+=it.hp*u}return{def,hp}}
function folMaxHp(d){return Math.round((80+d.lvl*20+folEq(d).hp)*(1+0.08*fpk(d,'twardy'))*(pms(d,5)?1.1:1)*(pms(d,30)?1.15:1))}
function compTargets(){const l=[];if(PET&&PET.m.visible&&VH.mode!==3){const pd=petDef();if(!(pd&&pd.down>Date.now()))l.push({id:'c:pet',p:PET.p,comp:'pet'})}
  for(const f of FOL)if(!(f.d.deadUntil>Date.now()))l.push({id:'c:'+f.d.id,p:f.p,comp:f});
  for(const g of enemies.values())if(g.st!==2&&EDEF[g.t].ally)l.push({id:'g:'+g.id,p:g.p,comp:'ally',e:g});
  if(NET.role==='host')for(const [pid,r] of remotes){const b=r.buf[r.buf.length-1];if(!b||b.a===5)continue;for(const q of (b.fo||[]))if(q[7]!==0)l.push({id:'r:'+pid+':'+q[5],p:{x:q[0],y:q[1],z:q[2]},comp:'remote',peer:pid,cid:q[5]});if(b.pet&&b.veh!==3)l.push({id:'r:'+pid+':pet',p:{x:b.pet[1],y:b.pet[2],z:b.pet[3]},comp:'remote',peer:pid,cid:'pet'})}
  return l}
function compHurt(tg,dmg,e){if(tg.comp==='post')return;if(tg.comp==='prey'){const o=tg.e;if(!o||o.st===2)return;const dx=o.p.x-(e?e.p.x:o.p.x),dz=o.p.z-(e?e.p.z:o.p.z),l=Math.hypot(dx,dz)||1;applyHit(o.id,dmg*2,dx/l*0.5,dz/l*0.5,null);return}if(tg.comp==='foe'){const o=tg.e;if(!o||o.st===2)return;const dx=o.p.x-(e?e.p.x:o.p.x),dz=o.p.z-(e?e.p.z:o.p.z),l=Math.hypot(dx,dz)||1;applyHit(o.id,dmg*4,dx/l*0.6,dz/l*0.6,null);if(e)o.aggroC={id:'g:'+e.id,t:8};try{const dd=Math.hypot(o.p.x-player.p.x,o.p.z-player.p.z);if(dd<30)sfx('eblade',0.5*(1-dd/32))}catch(_){}return}
  if(tg.comp==='ally'){const g=tg.e;if(!g||g.st===2)return;g.hp-=dmg*0.7;g.flash=1;g.hurtT=6;if(g.hp<=0){g.hp=0;g.st=2;g.dieT=1.1}return}
  if(tg.comp==='remote'){if(NET.tr)NET.tr.send({t:'chit',from:NET.id,to:tg.peer,cid:tg.cid,dmg:Math.round(dmg),eid:e?e.id:null});return}if(tg.comp==='pet'&&PET&&e){PET.lastAtk=e.id;PET.lastAtkT=nowS()}if(tg.comp&&tg.comp.d&&e){tg.comp.lastAtk=e.id;tg.comp.lastAtkT=nowS()}if(tg.comp==='pet'){if(!PET)return;if(PET.max==null){PET.max=petMaxHp();PET.hp=PET.max}const pkD=dmg*0.8*(pms(petDef(),25)?0.8:1);PET.hp-=pkD;PET.hurtT=nowS();fxNum(PET.p.x,PET.p.y+1.6,PET.p.z,Math.round(pkD),'#ff9d6b');
    if(PET.hp<=0){const pd=petDef();if(pd){pd.down=Date.now()+(pms(pd,10)?60000:120000);saveInv()}PET.m.visible=false;toast((pd&&pd.name||'Zwierzak')+' jest ciężko ranny i ucieka. Wróci za 2 minuty.','#ff8a7a');sfx('hurt',0.5)}return}
  const f=tg.comp;if(!f||f.d.deadUntil>Date.now())return;if(f.max==null){f.max=folMaxHp(f.d);f.hp=f.max}const def=folEq(f.d).def+5*fpk(f.d,'pancerz'),k=(1-def/(def+70))*(pms(f.d,25)?0.85:1);f.hp-=dmg*k;f.hurtT=nowS();fxNum(f.p.x,f.p.y+2.2,f.p.z,Math.round(dmg*k),'#ff9d6b');
  if(f.hp<=0){const lng=!pms(f.d,20);f.d.deadUntil=Date.now()+(lng?600000:300000);f.m.visible=false;saveInv();toast(f.d.name+' pada w walce! Wróci do drużyny za '+(lng?10:5)+' minut.','#ff8a7a');sfx('hurt',0.6)}}
function compSeparate(){const L=[];if(PET&&PET.m.visible&&VH.mode===0)L.push(PET);for(const f of FOL)if(f.m.visible)L.push(f);L.push({p:player.p,fixed:1});
  for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){const a=L[i],b=L[j],dx=a.p.x-b.p.x,dz=a.p.z-b.p.z,d=Math.hypot(dx,dz),mn=1.5;if(d<mn){const ux=d>1e-3?dx/d:Math.cos(i+j),uz=d>1e-3?dz/d:Math.sin(i+j),k=(mn-d);if(a.fixed){b.p.x-=ux*k;b.p.z-=uz*k}else if(b.fixed){a.p.x+=ux*k;a.p.z+=uz*k}else{a.p.x+=ux*k/2;a.p.z+=uz*k/2;b.p.x-=ux*k/2;b.p.z-=uz*k/2}}}}
function petTick(dt){
  if(!PET)return;const P=PET,d=EDEF[P.t];if(custOn||(SPC&&SPC.func==='garderoba')){P.m.visible=false;P.cust=1;return}if(P.cust){P.cust=0;P.p.set(player.p.x-1.5,player.p.y,player.p.z-1.5);P.m.visible=true}{const pd=petDef();if(P.max==null){P.max=petMaxHp();P.hp=P.max}if(pd&&pd.down>Date.now()){P.m.visible=false;return}if(!P.m.visible&&VH.mode!==3){P.m.visible=true;P.hp=P.max;P.p.set(player.p.x-1.5,player.p.y,player.p.z-1.5);if(pd&&pd.down){pd.down=0;saveInv();toast((pd.name||'Zwierzak')+' wraca do ciebie!','#7dd87d')}}if(P.hp<P.max&&nowS()-(P.hurtT||0)>6)P.hp=Math.min(P.max,P.hp+P.max*0.04*(pms(pd,10)?2:1)*dt)}P.cd-=dt;P.stT-=dt;if(P.stT<=0)P.st=0;const ox=P.p.x,oz=P.p.z;
  if(VH.mode===3){P.p.copy(player.p);P.ry=player.ry}
  else if((VH.mode===1&&VH.boat)||(VH.mode===4&&remotes.get(VH.host)&&remotes.get(VH.host).boat)){const b=VH.mode===1?VH.boat:remotes.get(VH.host).boat,s=seatPos(b,VH.mode===1?BSEAT.petD:BSEAT.petP);P.p.set(s[0],s[1]+0.35,s[2]);P.ry=s[3];P.speed=0}
  else{
    let tg=null,td=1e9;for(const e of enemies.values()){if(e.st===2||!((e.hurtP&&nowS()-e.hurtP<15)||(P.lastAtk===e.id&&nowS()-(P.lastAtkT||0)<15)))continue;const dp=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z),de=Math.hypot(e.p.x-P.p.x,e.p.z-P.p.z);if(dp<13*(1+0.15*ppk(petDef(),'czujnosc'))&&de<18&&de<td){td=de;tg=e}}
    let tx,tz,spd;
    if(tg&&!P2.dead){tx=tg.p.x;tz=tg.p.z;spd=d.spd*1.2*(1+0.08*ppk(petDef(),'zwinnosc'));const rr=d.rng*0.9+0.3;
      if(eDist(tg,P.p.x,P.p.z)<rr){tx=P.p.x;tz=P.p.z;P.ry=Math.atan2(tg.p.x-P.p.x,tg.p.z-P.p.z);if(P.cd<=0){P.cd=1.2*(1-0.08*ppk(petDef(),'zapal'));P.st=1;P.stT=0.3;const pd=petDef(),dmg=(1+0.08*pk('opiekun'))*(1+0.1*ppk(pd,'kly'))*d.dmg*(1+0.3*(HERO.lvl-1))*(1+0.1*((pd&&pd.lvl||1)-1))*(pd&&pd.el?1.25:1)*(hasP('przyjaciel')?1.3:1)*(pms(pd,40)?1.2:1)*rnd(0.9,1.1);const pcr=Math.random()<0.04*ppk(pd,'krytyk')+(pms(pd,15)?0.15:0);petXp(dmg*0.12);HIT_SRC='pet';dealHit(tg,pcr?dmg*2:dmg,pcr,(tg.p.x-P.p.x)/(td||1),(tg.p.z-P.p.z)/(td||1));HIT_SRC=null}}}
    else{const a=player.ry+Math.PI;tx=player.p.x+Math.sin(a)*2.3;tz=player.p.z+Math.cos(a)*2.3;spd=Math.min(11,Math.hypot(tx-P.p.x,tz-P.p.z)*2.2)}
    const dx=tx-P.p.x,dz=tz-P.p.z,dd=Math.hypot(dx,dz);
    if(dd>40&&VH.mode!==2&&(player.ground||player.swim)){P.p.set(tx,player.p.y,tz)}else if(dd>0.4){const pst=Math.min(dd,spd*dt),pnx=P.p.x+dx/dd*pst,pnz=P.p.z+dz/dd*pst;if(!SPC&&VOX.size&&voxProbe(pnx,pnz,P.p.y,0.3,1.0).block){if(!voxProbe(pnx,P.p.z,P.p.y,0.3,1.0).block)P.p.x=pnx;else if(!voxProbe(P.p.x,pnz,P.p.y,0.3,1.0).block)P.p.z=pnz}else{P.p.x=pnx;P.p.z=pnz}if(!tg||td>=d.rng)P.ry=Math.atan2(dx,dz)}
    if(!SPC){try{villageCollide(P.p);structCollide(P.p)}catch(_){}}
    const h=colAt(P.p.x,P.p.z,P.p.y);if(h!==null)P.p.y+=(Math.max(h,wlAt(P.p.x,P.p.z)-1.1)-P.p.y)*Math.min(1,12*dt);
  }
  P.speed=Math.hypot(P.p.x-ox,P.p.z-oz)/Math.max(dt,1e-3);
  P.m.position.copy(P.p);let dr=P.ry-P.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));P.m.rotation.y+=dr*Math.min(1,10*dt);
  animEnemy(P.m,Math.min(P.speed,9),dt,P.st,0,false);
}
const HEARTS=[];const heartTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#ff4a6a';x.strokeStyle='#fff';x.lineWidth=4;x.beginPath();x.moveTo(32,54);x.bezierCurveTo(4,34,8,8,32,22);x.bezierCurveTo(56,8,60,34,32,54);x.fill();x.stroke();return new THREE.CanvasTexture(c)})();
function hearts(x,y,z){for(let i=0;i<9;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:heartTex,transparent:true,depthWrite:false}));s.scale.setScalar(0.5+Math.random()*0.3);s.position.set(x+(Math.random()-0.5)*1.2,y+1+Math.random()*0.8,z+(Math.random()-0.5)*1.2);scene.add(s);HEARTS.push({s,t:-i*0.12,vx:(Math.random()-0.5)*0.6,vz:(Math.random()-0.5)*0.6})}}
function heartTick(dt){for(let i=HEARTS.length-1;i>=0;i--){const h=HEARTS[i];h.t+=dt;if(h.t<0){h.s.visible=false;continue}h.s.visible=true;h.s.position.y+=dt*1.3;h.s.position.x+=h.vx*dt;h.s.position.z+=h.vz*dt;h.s.material.opacity=Math.max(0,1-h.t/1.6);if(h.t>1.6){scene.remove(h.s);h.s.material.dispose();HEARTS.splice(i,1)}}}
function tameTarget(){let best=null,bd=4.5;for(const e of enemies.values()){if(e.st===2||!tameable(e.t)||e.sid||e.qid)continue;const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d<bd){bd=d;best=e}}return best}
function tryTame(){
  const best=tameTarget();
  if(!best)return toast('Podejdź bliżej do zwierzęcia, które da się oswoić','#ff8a7a');
  const fk=FOODOF[best.t];
  if(!(INV.food[fk]>0))return toast('Potrzebujesz: '+foodName(fk)+' (dla: '+EDEF[best.t].n+'). Kupisz u kupca.','#ff8a7a');
  INV.food[fk]--;const ch=tameChance(best);
  if(Math.random()<ch){const pd={id:'p'+Date.now(),t:best.t,name:EDEF[best.t].n,lvl:Math.max(1,best.lvl||1),xp:0,el:best.elite?1:0,at:Date.now()};INV.pets.push(pd);INV.petA=pd.id;spawnPet();petNew=pd.id;hearts(best.p.x,best.p.y,best.p.z);sfx('tame');
    if(isAuth())removeEnemy(best.id);else NET.tr.send({t:'tamek',from:NET.id,eid:best.id});toast('Oswojono: '+pd.name+'!','#7dd87d');ringFx(best.p.x,best.p.y,best.p.z,2,'lvl')}
  else{best.tries=(best.tries||0)+1;toast('Nie udało się (szansa '+Math.round(ch*100)+'%). Spróbuj jeszcze raz.','#ff8a7a');if(isAuth()&&!best.pas){best.prov=8}}
  saveInv();updHud();if(invOpen())renderInv();
}
const tameChance=e=>e.pas?Math.min(0.95,0.5+(hasP('przyjaciel')?0.25:0)+(e.tries||0)*0.15):Math.max(0.05,Math.min(0.95,0.2+0.55*(1-e.hp/e.max)+(hasP('przyjaciel')?0.25:0)-(e.elite?0.25:0)));
function toggleMount(){
  if(VH.mode===3){VH.mode=0;player.p.y+=0.1;return}
  if(VH.mode!==0||!PET||P2.dead)return;
  if(!mountH(PET.t,PET.m))return toast('Na tym zwierzaku nie da się jeździć','#ff8a7a');
  if(player.swim)return toast('Nie w wodzie','#ff8a7a');
  VH.mode=3;toast('Jazda: R zsiada','#cfe8ff');
}
function vehFrame(dt){
  if(VH.mode===1&&VH.boat){VH.boat.position.set(player.p.x,player.p.y-0.1,player.p.z);VH.boat.rotation.y=VH.bry;animBoat(VH.boat,VH.spd,dt)}
  if(VH.mode===3&&PET)meRef.position.y+=mountH(PET.t,PET.m)||0.8;
  mountFrame(dt);lavaTick(dt);if((performance.now()|0)%30<17)kingTick();arenaTick(dt);arenaHud();
  if(VH.mode===3&&player.swim){VH.mode=0}
  const u=meRef.userData;if(VH.mode===4){const hb=remotes.get(VH.host)&&remotes.get(VH.host).boat;if(hb){meRef.rotation.x=hb.rotation.x;meRef.rotation.z=hb.rotation.z}seatPose(u)}
  if(VH.mode===1||VH.mode===3){u.ll.rotation.x=-1.35;u.rl.rotation.x=-1.35;if(VH.mode===1&&!(P2.bowT>0||P3.chg)){const k=(VH.boat?VH.boat.userData.row||0:0)*0.55;u.la.rotation.x=-1.1+k;u.ra.rotation.x=-1.1+k;meRef.rotation.x=k*0.12}}
  if(VH.mode===2){const tt=performance.now()*0.001;let dr=player.ry-(VH._gry??player.ry);dr=Math.atan2(Math.sin(dr),Math.cos(dr));VH._gry=player.ry;VH._gt=(VH._gt||0)+((dr/Math.max(dt,1e-3))-(VH._gt||0))*Math.min(1,dt*4);const w=keys.has('KeyW'),s=keys.has('KeyS');
    u.la.rotation.x=-2.9+Math.sin(tt*1.3)*0.05;u.ra.rotation.x=-2.9+Math.cos(tt*1.3)*0.05;u.la.rotation.z=0.18;u.ra.rotation.z=-0.18;u.ll.rotation.x=0.35+Math.sin(tt*2.1)*0.18;u.rl.rotation.x=0.35-Math.sin(tt*2.1)*0.18;VH._pit=(VH._pit??0.1)+(((w?0.18:s?0.02:0.1))-(VH._pit??0.1))*Math.min(1,dt*3);meRef.rotation.x=VH._pit;meRef.rotation.z=Math.max(-0.2,Math.min(0.2,-VH._gt*0.12));VH._gb=1;
    if(Math.random()<dt*(w?14:6)&&typeof PFX!=='undefined'){const a=player.ry+Math.PI/2;for(const sd of [1,-1])PFX.emit(player.p.x+Math.sin(a)*2.6*sd,player.p.y+2.6,player.p.z+Math.cos(a)*2.6*sd,1,['#ffffff','#e8f4ff'],{sp:0.2,g:0,life:0.35,size:0.05,dx:-Math.sin(player.ry)*6,dz:-Math.cos(player.ry)*6})}}
  else if(VH._gb){VH._gb=0;meRef.rotation.z=0;meRef.rotation.x=0;u.la.rotation.z=0;u.ra.rotation.z=0}
  // podpowiedź oswajania
  const pr=$('prompt');
  if(pr.hidden&&VH.mode===0){const best=tameTarget();
    if(best){const fk=FOODOF[best.t],have=INV.food[fk]||0;pr.hidden=false;pr.innerHTML='<kbd>T</kbd> Oswój: <b></b>';pr.querySelector('b').textContent=EDEF[best.t].n+' · potrzebne: '+foodName(fk)+' (masz '+have+')'+(have?' · szansa '+Math.round(tameChance(best)*100)+'%':'')}}
}
function remoteVeh(r,c,dt){
  remoteMount(r,c,dt);
  if(c.veh===1){if(!r.boat){r.boat=makeBoat();scene.add(r.boat)}r.boat.position.set(r.g.position.x,r.g.position.y-0.1,r.g.position.z);r.boat.rotation.y=c.bry||0;animBoat(r.boat,c.bs||0,dt)}else if(r.boat){scene.remove(r.boat);r.boat=null}
  if(c.veh===2){if(!r.gl){r.gl=makeGlider();r.g.add(r.gl)}}else if(r.gl){r.g.remove(r.gl);r.gl=null}
  const u=r.g.userData;if(c.veh===1||c.veh===3||c.veh===4){u.ll.rotation.x=-1.35;u.rl.rotation.x=-1.35}
  if(c.veh===4){const hb=c.bh===NET.id?VH.boat:(remotes.get(c.bh)||{}).boat;if(hb){const sp=seatPos(hb,BSEAT.pas);r.g.position.set(sp[0],sp[1],sp[2]);r.g.rotation.set(hb.rotation.x,sp[3]+Math.PI,hb.rotation.z)}seatPose(u)}if(c.veh===3&&c.pet&&mountH(c.pet[0]))r.g.position.y+=mountH(c.pet[0]);if(c.veh===2){u.la.rotation.x=-2.9;u.ra.rotation.x=-2.9}
  if(c.pet){if(!r.pet||r.petT!==c.pet[0]){if(r.pet)scene.remove(r.pet);r.pet=makeEnemy(c.pet[0],false);r.petT=c.pet[0];{const d=EDEF[c.pet[0]],tg=nameTag((c.pet[6]||d.n)+' · '+r.name,'#7dd87d');tg.position.y=((d.legs&&d.legs.length)?1.9:1.5)*(d.sc||1);r.pet.add(tg)}scene.add(r.pet);r.pet.position.set(c.pet[1],c.pet[2],c.pet[3])}
    const ox=r.pet.position.x,oz=r.pet.position.z;r.pet.position.x+=(c.pet[1]-ox)*Math.min(1,10*dt);r.pet.position.y+=(c.pet[2]-r.pet.position.y)*Math.min(1,10*dt);r.pet.position.z+=(c.pet[3]-oz)*Math.min(1,10*dt);r.pet.rotation.y=c.pet[4];
    animEnemy(r.pet,Math.min(9,Math.hypot(r.pet.position.x-ox,r.pet.position.z-oz)/Math.max(dt,1e-3)),dt,c.pet[5]||0,0,false)}
  else if(r.pet){scene.remove(r.pet);r.pet=null}
}
/* v143: bez limitu oswojonych zwierząt */
const PETPERKS=[['kly','Ostre kły','+10% obrażeń kompana'],['zapal','Zapał','Kompan atakuje o 8% szybciej'],['zwinnosc','Zwinność','+8% szybkości kompana'],['czujnosc','Czujność','Kompan wyczuwa wrogów o 15% dalej'],['aura','Aura ochronna','+2 obrony dla ciebie, gdy kompan jest przy tobie'],['opieka','Opieka','+0,3 zdrowia na sekundę dla ciebie'],['skora','Gruba skóra','+8% zdrowia kompana'],['krytyk','Instynkt łowcy','+4% szansy na trafienie krytyczne'],['wsparcie','Wspólne łowy','+2% twoich obrażeń, gdy kompan walczy obok']];
/* v138: perki odblokowywane poziomem zwierzaka i najemnika */
const PETMS=[[5,'Wierny','+15% zdrowia zwierzaka'],[10,'Szybkie gojenie','leczy się 2× szybciej, po zranieniu wraca po 1 min'],[15,'Rozszarpanie','15% szansy na podwójne obrażenia'],[20,'Okrzyk stada','+5% twoich obrażeń, gdy zwierzak jest przy tobie'],[25,'Twarda skóra','otrzymuje 20% mniej obrażeń'],[30,'Doświadczony','+25% PD zwierzaka'],[40,'Alfa','+20% obrażeń zwierzaka'],[50,'Legenda','+3 obrony i +0,5 zdrowia/s dla ciebie']];
const FOLPERKS=[['bron','Mistrz broni','+8% obrażeń'],['twardy','Twardziel','+8% zdrowia'],['pancerz','Zahartowany','+5 obrony'],['szybki','Szybkie nogi','+8% szybkości'],['rany','Opatrunki','+40% szybsze leczenie ran'],['krytyk','Celne ciosy','+4% szansy na trafienie krytyczne'],['oslona','Osłona','+2 obrony dla ciebie, gdy jest przy tobie'],['medyk','Medyk','+0,2 zdrowia na sekundę dla ciebie']];
const FOLMS=[[5,'Zaprawiony','+10% zdrowia'],[10,'Weteran','+10% obrażeń'],[15,'Czujny','atakuje o 10% szybciej'],[20,'Niezłomny','po upadku wraca po 5 min zamiast 10'],[25,'Tarczownik','otrzymuje 15% mniej obrażeń'],[30,'Bohater','+15% zdrowia'],[40,'Mistrz','+10% szansy na trafienie krytyczne'],[50,'Legenda','+20% obrażeń i +3 obrony dla ciebie']];
const pms=(p,l)=>!!p&&(p.lvl||1)>=l;const fpk=(d,k)=>d&&d.pp?d.pp[k]||0:0;const folPts=d=>Math.max(0,(d.lvl||1)-1-Object.values(d.pp||{}).reduce((a,b)=>a+b,0));const folNeed=l=>Math.round(petNeed(l)*1.2);
function folXp(f,x){const d=f.d;d.lvl=d.lvl||1;d.xp=(d.xp||0)+x;let up=false;while(d.lvl<50&&d.xp>=folNeed(d.lvl)){d.xp-=folNeed(d.lvl);d.lvl++;up=true}if(up){toast(d.name+' awansuje na poziom '+d.lvl+'!','#ffd34d');const ms=FOLMS.find(m=>m[0]===d.lvl);if(ms)toast('Nowy perk: '+ms[1]+' ('+ms[2]+')','#ffd34d');f.max=folMaxHp(d);f.hp=f.max;try{ringFx(f.p.x,f.p.y,f.p.z,1.6,'lvl')}catch(_){}try{if(f.tag)f.m.remove(f.tag);f.tag=nameTag(d.name+' · poz. '+d.lvl,'#ffd34d');f.m.add(f.tag)}catch(_){}saveInv()}}
function msHTML(L,lv){return '<div class="pms">'+L.map(([l,n,dd])=>`<div class="pmsr${lv>=l?' on':''}"><em>${l}</em><b>${n}</b><span>${dd}</span></div>`).join('')+'</div>'}
const ppk=(p,k)=>p&&p.pp?p.pp[k]||0:0;const petPts=p=>Math.max(0,(p.lvl||1)-1-Object.values(p.pp||{}).reduce((a,b)=>a+b,0));let petNew=null,petSel=null;
const petNeed=l=>Math.round(90+70*Math.pow(l,1.4));
function petXp(x){const p=petDef();if(!p)return;p.lvl=p.lvl||1;p.xp=(p.xp||0)+x*(pms(p,30)?1.25:1);const lv0=p.lvl;let up=false;while(p.lvl<50&&p.xp>=petNeed(p.lvl)){p.xp-=petNeed(p.lvl);p.lvl++;up=true}
  if(up){toast((p.name||EDEF[p.t].n)+' awansuje na poziom '+p.lvl+'!','#7dd87d');for(const m of PETMS)if(m[0]>lv0&&m[0]<=p.lvl)toast('Nowy perk: '+m[1]+' ('+m[2]+')','#7dd87d');if(PET){PET.max=petMaxHp();PET.hp=PET.max}if(PET)ringFx(PET.p.x,PET.p.y,PET.p.z,1.6,'lvl');saveInv()}}
// portrety zwierząt: renderujemy model do małej tekstury raz na gatunek (cache)
const PORTR={};let portrRT=null;const portrScene=new THREE.Scene(),portrCam=new THREE.PerspectiveCamera(32,1,0.1,60);
portrScene.add(new THREE.HemisphereLight(0xfff6e8,0x504030,1.0));{const dl=new THREE.DirectionalLight(0xffffff,0.75);dl.position.set(3,5,4);portrScene.add(dl)}
function portrait(t){
  if(PORTR[t])return PORTR[t];
  try{const S2=128;if(!portrRT)portrRT=new THREE.WebGLRenderTarget(S2,S2);
    const mdl=makeEnemy(t,false);mdl.rotation.y=0.65;portrScene.add(mdl);
    const sc=EDEF[t].sc||1,hy=(EDEF[t].legs&&EDEF[t].legs.length?0.75:0.5)*sc,D=2.6*sc+(EDEF[t].L||0.6);
    portrCam.position.set(D*0.55,hy+D*0.32,D);portrCam.lookAt(0,hy,0);
    const bg=portrScene.background;portrScene.background=new THREE.Color(0x2a2016);
    renderer.setRenderTarget(portrRT);renderer.render(portrScene,portrCam);const px=new Uint8Array(S2*S2*4);renderer.readRenderTargetPixels(portrRT,0,0,S2,S2,px);renderer.setRenderTarget(null);
    portrScene.remove(mdl);mdl.userData.mat.dispose();portrScene.background=bg;
    const c=document.createElement('canvas');c.width=c.height=S2;const x=c.getContext('2d'),id=x.createImageData(S2,S2);
    for(let y=0;y<S2;y++)id.data.set(px.subarray((S2-1-y)*S2*4,(S2-y)*S2*4),y*S2*4);x.putImageData(id,0,0);PORTR[t]=c.toDataURL();
  }catch(e){PORTR[t]=''}
  return PORTR[t];
}
const petsOpen=()=>!$('petsui').hidden;
function togglePets(){const v=$('petsui');v.hidden=!v.hidden;if(!v.hidden){try{document.exitPointerLock()}catch(e){}if(petNew){petSel=petNew;petNew=null}renderPets()}}
function petKind(t){const d=EDEF[t];return d.passive?(mountH(t)?'Wierzchowiec':'Zwierzę'):d.boss?'Legendarny':'Bestia'}
function renderPets(){
  if(!INV.pets.find(p=>p.id===petSel))petSel=INV.petA||(INV.pets[0]&&INV.pets[0].id)||null;
  const cards=INV.pets.map(p=>{const d=EDEF[p.t],img=portrait(p.t);return `<button class="pcard${p.id===petSel?' sel':''}${p.id===INV.petA?' act':''}" data-psel="${p.id}">
    ${img?`<img src="${img}" alt="">`:`<span class="pimg"></span>`}<b>${esc(p.name||d.n)}</b><small>Poz. ${p.lvl||1} · ${petKind(p.t)}</small>${p.id===INV.petA?'<em>Kompan</em>':''}${p.el?'<i>★</i>':''}</button>`}).join('');
  const empty=Array.from({length:Math.max(0,Math.ceil((INV.pets.length+1)/4)*4-INV.pets.length)},()=>'<div class="pcard empty"></div>').join('');
  $('pgrid').innerHTML=INV.pets.length?cards+empty:'<p class="sub2" style="grid-column:1/-1">Nie masz jeszcze zwierzaków. Podejdź do zwierzęcia z jego ulubionym jedzeniem i naciśnij <kbd>T</kbd>.</p>';
  const p=INV.pets.find(q=>q.id===petSel);let h='';
  if(p){const d=EDEF[p.t],lv=p.lvl||1,need=petNeed(lv),dm=Math.round(d.dmg*(1+0.1*(lv-1))*(p.el?1.25:1)*10)/10;
    h=`<div class="pbig">${portrait(p.t)?`<img src="${portrait(p.t)}" alt="">`:''}</div>
    <h3 id="pname">${esc(p.name||d.n)}</h3><p class="sub2">${d.n} · ${petKind(p.t)}${p.el?' · elitarny ★':''}</p>
    <div class="pxp"><div style="width:${Math.min(100,(p.xp||0)/need*100)}%"></div><span>Poziom ${lv} · ${Math.floor(p.xp||0)} / ${need} PD</span></div>
    <table><tr><td>Siła ataku</td><td>${dm}</td></tr><tr><td>Szybkość</td><td>${d.spd.toFixed(1)}</td></tr><tr><td>Jazda wierzchem</td><td>${mountH(p.t)?'tak (R) · ×'+(MSPD[p.t]||1).toFixed(2):'nie'}</td></tr><tr><td>Ulubione jedzenie</td><td>${FOODOF[p.t]?foodName(FOODOF[p.t]):'—'}</td></tr></table>
    <h2 style="margin-top:12px">Perki zwierzaka <small style="color:var(--mut);font-size:13px">punkty: ${petPts(p)}</small></h2><div class="pperks">${PETPERKS.map(([k,n,dd])=>{const r=ppk(p,k);return `<div class="pperk"><div><b>${n}</b><span>${dd}</span></div><div class="pips">${'<i class="on"></i>'.repeat(r)}${'<i></i>'.repeat(5-r)}</div><button data-pperk="${k}"${petPts(p)>0&&r<5?'':' disabled'}>+</button></div>`}).join('')}</div>
    <h2 style="margin-top:12px">Perki za poziom</h2>${msHTML(PETMS,lv)}
    <div class="pbtns">${INV.petA===p.id?'<button data-pact="off">Odeślij</button>':'<button class="pri" data-pact="on">Wybierz na kompana</button>'}<button data-pact="ren">Zmień imię</button><button data-pact="rel">${p.rel?'Na pewno? Kliknij ponownie':'Wypuść'}</button></div>
    <div id="prenw" hidden><input id="prenin" maxlength="18" value="${esc(p.name||d.n)}"><button data-pact="rok">Zapisz</button></div>`}
  else h='<p class="sub2">Wybierz zwierzaka z listy.</p>';
  const fl=Object.keys(INV.food).filter(k=>INV.food[k]>0&&FOODS[k]);
  h+='<h2 style="margin-top:14px">Jedzenie do oswajania</h2>'+(fl.length?'<div class="foods">'+fl.map(k=>`<div class="food"><img class="fimg" src="${itemIcon({base:'food',var:k,rar:0})}" alt=""><div><b>${foodName(k)} ×${INV.food[k]}</b><span>dla: ${foodFor(k)}</span></div></div>`).join('')+'</div>':'<p class="sub2">Brak. Kupisz je u kupców.</p>');
  $('pdet').innerHTML=h;$('pcount').textContent=INV.pets.length+(INV.pets.length===1?' zwierzak':' zwierząt');
  $('folbox').innerHTML='<h2>Towarzysze broni <small style="color:var(--mut);font-size:13px">'+INV.fol.length+' / 2 · werbujesz ich w karczmach i w miastach</small></h2>'+(INV.fol.length?INV.fol.map((d,i)=>{d.eq=d.eq||{};const f=FOL[i],dead=d.deadUntil>Date.now(),hp=f&&f.max?Math.round(f.hp)+' / '+f.max:folMaxHp(d),eqv=folEq(d),wn=d.eq.bron?d.eq.bron.name:WEAP[d.w].n;
    const slots=FOLSL.filter(([k])=>!(k==='helm'&&RACES[d.race]&&RACES[d.race].nohelm)).map(([k,n])=>{const it=d.eq[k];return `<button class="slot r${it?it.rar:'x'} fslot${folPick&&folPick.i===i&&folPick.k===k?' sel':''}" data-fslot="${i}:${k}" title="${n}${it?': '+esc(it.name):''}">${it?icHTML(it):`<span class="fsl">${n}</span>`}</button>`}).join('');
    let pick='';if(folPick&&folPick.i===i){const cand=INV.bag.map((it,bi)=>[it,bi]).filter(([it])=>it&&it.slot===folPick.k);pick=`<div class="fpick"><b>${FOLSL.find(q=>q[0]===folPick.k)[1]}: wybierz z plecaka</b>${cand.length?cand.map(([it,bi])=>`<button data-fput="${i}:${bi}">${icHTML(it)}<span style="color:${RAR[it.rar].c}">${esc(it.name)}</span><small>poz. ${it.lvl}</small></button>`).join(''):'<p class="sub2">Brak pasujących przedmiotów w plecaku.</p>'}${d.eq[folPick.k]?`<button data-foff="${i}:${folPick.k}">Zdejmij do plecaka</button>`:''}</div>`}
    return `<div class="pperk folcard"><div style="flex:1"><div class="fname"><input data-fname="${i}" value="${esc(d.name)}" maxlength="22"><button data-fren="${i}" style="width:auto;padding:3px 8px">Zmień imię</button></div><span>Poziom ${d.lvl} · ${esc(wn)} · ${dead?'<b style="color:#ff8a7a">poległ – wróci za '+Math.ceil((d.deadUntil-Date.now())/60000)+' min</b>':'zdrowie '+hp}${eqv.def?' · obrona '+Math.round(eqv.def):''}</span><div class="pxp"><div style="width:${Math.min(100,(d.xp||0)/folNeed(d.lvl)*100)}%"></div><span>Poziom ${d.lvl} · ${Math.floor(d.xp||0)} / ${folNeed(d.lvl)} PD</span></div><div class="fslots">${slots}</div>${pick}<details class="fperks"${window.__fopen===i?' open':''} ontoggle="window.__fopen=this.open?${i}:null"><summary>Perki najemnika · punkty: ${folPts(d)}</summary><div class="pperks">${FOLPERKS.map(([k,n,dd])=>{const r=fpk(d,k);return `<div class="pperk"><div><b>${n}</b><span>${dd}</span></div><div class="pips">${'<i class="on"></i>'.repeat(r)}${'<i></i>'.repeat(5-r)}</div><button data-fperk="${i}:${k}"${folPts(d)>0&&r<5?'':' disabled'}>+</button></div>`}).join('')}</div><b style="display:block;margin-top:6px">Perki za poziom</b>${msHTML(FOLMS,d.lvl)}</details></div><button data-folx="${i}" style="width:auto;padding:4px 10px">Odpraw</button></div>`}).join(''):'<p class="sub2">Nikt jeszcze z tobą nie wędruje.</p>');
}
$('petsui').onclick=e=>{{const fx=e.target.closest('[data-folx]');if(fx){dismissFol(+fx.dataset.folx);renderPets();return}}{const b=e.target.closest('[data-fperk]');if(b){const [i,k]=b.dataset.fperk.split(':'),d=INV.fol[+i];if(d&&folPts(d)>0&&fpk(d,k)<5){d.pp=d.pp||{};d.pp[k]=(d.pp[k]||0)+1;const f=FOL[+i];if(f){f.max=folMaxHp(d);f.hp=Math.min(f.hp||f.max,f.max)}saveInv();window.__fopen=+i}renderPets();return}}
  {const b=e.target.closest('[data-fren]');if(b){const i=+b.dataset.fren,inp=document.querySelector(`[data-fname="${i}"]`),d=INV.fol[i],nm=(inp&&inp.value||'').trim().slice(0,22);if(d&&nm){d.name=nm;saveInv();spawnFols();toast('Najemnik nazywa się teraz: '+nm,'#ffd34d')}renderPets();return}}
  {const b=e.target.closest('[data-fslot]');if(b){const [i,k]=b.dataset.fslot.split(':');folPick=folPick&&folPick.i===+i&&folPick.k===k?null:{i:+i,k};renderPets();return}}
  {const b=e.target.closest('[data-fput]');if(b){const [i,bi]=b.dataset.fput.split(':').map(Number),d=INV.fol[i],it=INV.bag[bi];if(d&&it&&it.slot===folPick.k){d.eq=d.eq||{};if(it.slot==='tarcza'&&TWOH(d.eq.bron||{base:d.w})){toast(d.name+' walczy bronią dwuręczną – tarcza się nie przyda','#ff8a7a');return}if(it.slot==='bron'&&TWOH(it)&&d.eq.tarcza){INV.bag.push(d.eq.tarcza);delete d.eq.tarcza}const old=d.eq[it.slot];INV.bag.splice(bi,1);if(old)INV.bag.push(old);d.eq[it.slot]=it;if(it.slot==='bron'){d.w0=d.w0||d.w;d.w=WEAP[it.base]?it.base:d.w}const f=FOL[i];if(f){f.max=folMaxHp(d);f.hp=Math.min(f.hp||f.max,f.max)}saveInv();spawnFols();toast(d.name+' zakłada: '+it.name,RAR[it.rar].c);folPick=null}renderPets();return}}
  {const b=e.target.closest('[data-foff]');if(b){const [i,k]=b.dataset.foff.split(':'),d=INV.fol[+i];if(d&&d.eq&&d.eq[k]){if(INV.bag.length>=bagN()){toast('Plecak pełny','#ff8a7a');return}INV.bag.push(d.eq[k]);delete d.eq[k];if(k==='bron'&&d.w0)d.w=d.w0;saveInv();spawnFols();folPick=null}renderPets();return}}{const b=e.target.closest('[data-pperk]');if(b){const p=INV.pets.find(q=>q.id===petSel);if(p&&petPts(p)>0){p.pp=p.pp||{};p.pp[b.dataset.pperk]=Math.min(5,(p.pp[b.dataset.pperk]||0)+1);saveInv();renderPets()}return}}const s=e.target.closest('[data-psel]');if(s){petSel=s.dataset.psel;for(const p of INV.pets)p.rel=0;renderPets();return}
  const b=e.target.closest('[data-pact]');if(!b)return;const p=INV.pets.find(q=>q.id===petSel);if(!p)return;const a=b.dataset.pact;
  if(a==='on'){INV.petA=p.id;spawnPet();toast((p.name||EDEF[p.t].n)+' jest teraz twoim kompanem','#7dd87d')}
  else if(a==='off'){INV.petA=null;despawnPet()}
  else if(a==='ren'){$('prenw').hidden=false;$('prenin').focus();$('prenin').select();return}
  else if(a==='rok'){const v=$('prenin').value.trim();if(v){p.name=v.slice(0,18);if(INV.petA===p.id)spawnPet()}}
  else if(a==='rel'){if(!p.rel){p.rel=1;renderPets();return}const i=INV.pets.indexOf(p);if(INV.petA===p.id){INV.petA=null;despawnPet()}INV.pets.splice(i,1);toast('Wypuszczono: '+(p.name||EDEF[p.t].n),'#cfe8ff')}
  saveInv();renderPets();if(invOpen())renderInv()};
$('petsclose').onclick=togglePets;$('petsbtn').onclick=togglePets;
function petsHTML(){
  return `<p class="sub2">Kompanów wybierasz w oknie drużyny: klawisz <kbd>P</kbd>.</p><button id="openpets2">Otwórz drużynę (${INV.pets.length})</button>`;
}

$('pets').onclick=e=>{if(e.target.closest('#openpets2')){toggleInv();togglePets();return}const b=e.target.closest('[data-pet],[data-petx]');if(!b)return;
  if(b.dataset.petx!=null){const p=INV.pets[+b.dataset.petx];if(p&&INV.petA===p.id){INV.petA=null;despawnPet()}INV.pets.splice(+b.dataset.petx,1)}
  else if(b.dataset.pet==='off'){INV.petA=null;despawnPet()}else{INV.petA=INV.pets[+b.dataset.pet].id;spawnPet()}
  saveInv();renderInv()};

