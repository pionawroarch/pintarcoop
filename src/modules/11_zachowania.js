// ===== zachowania: watahy z przewodnikiem, drapieżniki polują, zwierzęta uciekają, noc i dzień, gniazda, statek-widmo, efekty biomów =====
function isNightH(){return hour<5.5||hour>20.5}
function dnFix(t,list){const n=isNightH();for(let k=0;k<4;k++){if(BIO.NIGHT.has(t)&&!n){t=pick(list);continue}if(BIO.DAY.has(t)&&n){t=pick(list);continue}break}if((BIO.NIGHT.has(t)&&!n)||(BIO.DAY.has(t)&&n))return null;return t}
function spawnPack(t,lvl,elite,x,h,z){const n=BIO.PACK[t]||0;const lead=makeE(t,lvl+(n?1:0),elite,x,h,z,n?{lead:1}:{});if(!n)return lead;lead.m.scale.multiplyScalar(1.15);
  for(let i=0;i<n;i++){const a=Math.random()*6.28,xx=x+Math.cos(a)*rnd(2,4),zz=z+Math.sin(a)*rnd(2,4),hh=colAt(xx,zz);if(hh!==null&&hh>=WATER&&Math.abs(hh-h)<2.5)makeE(t,lvl,false,xx,hh,zz,{pack:lead.id})}return lead}
function preyFor(e){let best=null,bd=22;for(const o of enemies.values()){if(o===e||o.st===2||!EDEF[o.t].passive||o.car||o.qid)continue;const dd=Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z);if(dd<bd&&Math.abs(o.p.y-e.p.y)<4){bd=dd;best=o}}
  if(!best)return null;best.fright=Math.max(best.fright||0,3);best.frX=e.p.x;best.frZ=e.p.z;return{id:'e:'+best.id,p:best.p,comp:'prey',e:best,td:bd}}
function frightAround(x,z,r){for(const o of enemies.values()){if(o.st===2||!EDEF[o.t].passive)continue;if(Math.hypot(o.p.x-x,o.p.z-z)<r){o.fright=Math.max(o.fright||0,rnd(4,6));o.frX=x;o.frZ=z}}}
// gniazda i legowiska: dopóki stoją, w okolicy pojawiają się ich mieszkańcy
const NESTS=new Map();let nestT=0;
function nestDead(){try{return JSON.parse(localStorage.getItem('pintar_nests_'+(S&&S.seed))||'[]')}catch(_){return[]}}
function nestModel(b){const L=[],W='#6a4a2a',W2='#4a301c',BONE='#e8e0c8',E=[5,32,24].includes(b)?'#dfe8f2':[4,35,15,16].includes(b)?'#c8a060':'#e8dcc0';
  for(let i=0;i<14;i++){const a=i/14*6.283,r=1.3+((i*7)%3)*0.12;L.push([Math.cos(a)*r,0.25+(i%2)*0.2,Math.sin(a)*r,i%2?1.2:0.3,0.22,i%2?0.3:1.2,i%3?W:W2])}
  L.push([0,0.08,0,2.4,0.16,2.4,'#5a4a34']);for(const [x,z] of [[0.3,0.2],[-0.35,0.1],[0,-0.35],[0.1,0.5]])L.push([x,0.36,z,0.34,0.44,0.34,E]);
  for(const [x,z,w,d] of [[1.8,0.6,1,0.15],[-1.7,-0.8,0.15,1],[0.6,-1.9,0.9,0.15]])L.push([x,0.08,z,w,0.12,d,BONE]);L.push([-1.9,0.3,1.2,0.5,0.5,0.5,BONE],[-1.9,0.3,1.46,0.12,0.12,0.04,'#1a1612']);
  const m=new THREE.Mesh(boxes(L),decoMat);m.castShadow=true;return m}
function nestTick(dt){if(SPC||!S)return;nestT-=dt;if(nestT<=0){nestT=2;const G=190,cx=Math.floor(player.p.x/G),cz=Math.floor(player.p.z/G),dead=nestDead(),keep=new Set();
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const gx=cx+dx,gz=cz+dz,k=gx+','+gz;keep.add(k);if(NESTS.has(k)||dead.includes(k))continue;const hs=(a)=>{const v=Math.sin(gx*127.1+gz*311.7+a*74.7+(S.seed||0)*0.013)*43758.5453;return v-Math.floor(v)};if(hs(1)>0.42)continue;
   const x=(gx+0.2+hs(2)*0.6)*G,z=(gz+0.2+hs(3)*0.6)*G,h=colAt(x,z);if(h===null)continue;if(h<WATER+0.5||inVillage(x,z,70)){NESTS.set(k,{skip:1});continue}const b=biomeAt(x,z),list=BIOME_E[b];if(!list||!list.length){NESTS.set(k,{skip:1});continue}
   let t=list[Math.floor(hs(4)*list.length)];if(EDEF[t].boss||EDEF[t].giant||EDEF[t].swim)t=list[0];const m=nestModel(b);m.position.set(x,h,z);m.rotation.y=hs(5)*6;scene.add(m);NESTS.set(k,{x,y:h,z,b,t,hp:160,max:160,m,spT:0,kids:new Set()})}
  for(const [k,n] of NESTS)if(!keep.has(k)){if(n.m){scene.remove(n.m);n.m.geometry.dispose()}NESTS.delete(k)}}
  if(!isAuth())return;for(const n of NESTS.values()){if(n.skip||n.dead)continue;const d=Math.hypot(player.p.x-n.x,player.p.z-n.z);if(d>80)continue;n.spT-=dt;for(const id of [...n.kids]){const e=enemies.get(id);if(!e||e.st===2)n.kids.delete(id)}
   if(n.spT<=0&&n.kids.size<3&&d>14){n.spT=rnd(22,34);const t=dnFix(n.t,[n.t])||(BIO.NIGHT.has(n.t)?null:n.t);if(!t)continue;const a=Math.random()*6.28,x=n.x+Math.cos(a)*3,z=n.z+Math.sin(a)*3,h=colAt(x,z);if(h===null||h<WATER)continue;const sp=spawnPt(),lvl=Math.max(1,1+Math.floor(Math.hypot(x-sp[0],z-sp[2])/260));const e=makeE(t,lvl,false,x,h,z,{home:[n.x,n.z],nest:1});n.kids.add(e.id)}}}
function nestMelee(fx,fz){for(const [k,n] of NESTS){if(n.skip||n.dead)continue;const dx=n.x-player.p.x,dz=n.z-player.p.z,d=Math.hypot(dx,dz);if(d>ST.rng+1.6||Math.abs(n.y-player.p.y)>3)continue;if(d>1&&(dx*fx+dz*fz)/d<0.3)continue;
  const dmg=Math.round(ST.dmg*rnd(0.9,1.1));n.hp-=dmg;try{fxNum(n.x,n.y+1.4,n.z,String(dmg),'#ffd34d');PFX.emit(n.x,n.y+0.5,n.z,8,['#6a4a2a','#e8dcc0'],{sp:3,up:2,life:0.5,size:0.1});sfx('thud',0.5)}catch(_){}
  if(n.hp<=0){n.dead=1;try{for(const q of W.quests)if(q.type==='nest'&&!q.done)questInc(q)}catch(_){}scene.remove(n.m);n.m.geometry.dispose();const dl=nestDead();dl.push(k);try{localStorage.setItem('pintar_nests_'+S.seed,JSON.stringify(dl.slice(-400)))}catch(_){}
   try{PFX.emit(n.x,n.y+0.6,n.z,30,['#6a4a2a','#e8dcc0','#4a301c'],{sp:5,up:4,life:0.9,size:0.14});spawnDrop({p:[n.x,n.y+0.3,n.z],items:Math.random()<0.6?[genItem(Math.max(1,(P2.lvl||5)))]:[],gold:Math.round(20+Math.random()*40)});toast('Gniazdo zniszczone — w okolicy będzie spokojniej','#7dd87d')}catch(e){console.warn(e)}}}}
// statek-widmo: nocą przy brzegu przypływa upiorny okręt i wysadza załogę
const GHOST={s:null,t:0,cd:40};
function ghostTick(dt){if(SPC||!isAuth())return;const G=GHOST;if(G.s){G.t+=dt;const s=G.s;s.m.position.x+=s.vx*dt;s.m.position.z+=s.vz*dt;s.m.position.y=WATER-0.4+Math.sin(G.t*0.8)*0.15;s.m.rotation.z=Math.sin(G.t*0.6)*0.05;
   const mat=s.mat;mat.opacity=Math.min(0.62,G.t*0.2)*(G.t>80?Math.max(0,1-(G.t-80)/8):1);
   if(!s.landed&&(G.t>18||(colAt(s.m.position.x+s.vx*2,s.m.position.z+s.vz*2)??-99)>=WATER-1)){s.landed=1;s.vx*=0.1;s.vz*=0.1;let sx=player.p.x,sz=player.p.z;for(let r=2;r<40;r+=2){const x=s.m.position.x+(player.p.x-s.m.position.x)*r/40,z=s.m.position.z+(player.p.z-s.m.position.z)*r/40,h=colAt(x,z);if(h!==null&&h>=WATER){sx=x;sz=z;break}}
     for(let i=0;i<4;i++){const x=sx+rnd(-3,3),z=sz+rnd(-3,3),h=colAt(x,z);if(h!==null&&h>=WATER-0.5)makeE('upiorny_marynarz',Math.max(1,(P2.lvl||1)),i===0,x,h,z,{})}toast('Upiorna załoga schodzi na ląd!','#7affd0')}
   if(G.t>88||(!isNightH()&&G.t>30)){scene.remove(s.m);G.s=null;G.cd=240}return}
  G.cd-=dt;if(G.cd>0||!isNightH())return;G.cd=60;if(Math.random()>0.3)return;const b=biomeAt(player.p.x,player.p.z);if(![0,1,37,30].includes(b))return;
  for(let k=0;k<10;k++){const a=Math.random()*6.28,d=rnd(50,70),x=player.p.x+Math.cos(a)*d,z=player.p.z+Math.sin(a)*d,h=colAt(x,z);if(h===null||h>WATER-4)continue;
   const m=makeBoat();m.scale.setScalar(4.2);const mat=new THREE.MeshLambertMaterial({color:0x9affd8,emissive:0x1a5a4a,transparent:true,opacity:0,depthWrite:false});m.traverse(o=>{if(o.isMesh){if(o.userData.mask){o.visible=false;return}o.material=mat;o.castShadow=false}});
   const mast=new THREE.Mesh(boxes([[0,3,0,0.2,6,0.2,'#ffffff'],[0,4.2,0.05,2.6,2.2,0.04,'#ffffff'],[0,6.1,0,0.4,0.3,0.4,'#ffffff']]),mat);m.add(mast);
   m.position.set(x,WATER-0.4,z);const dx=player.p.x-x,dz=player.p.z-z,l=Math.hypot(dx,dz)||1;m.rotation.y=Math.atan2(dx,dz);scene.add(m);GHOST.s={m,mat,vx:dx/l*1.6,vz:dz/l*1.6};GHOST.t=0;toast('Na wodzie majaczy upiorny okręt…','#7affd0');try{sfx('moan',0.7)}catch(_){}break}}
// efekty biomów: zorza, mgła z błędnymi ognikami, płatki wiśni, oślepiający blask szkła
window.BFX={mist:0,aur:0,glare:0,petal:0,b:-1};
let AUR=null,WISPS=null,glareEl=null;
function bioGlowTex(c){const cv=document.createElement('canvas');cv.width=cv.height=64;const g=cv.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.25,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);return new THREE.CanvasTexture(cv)}
function auroraMake(){const g=new THREE.Group();const cv=document.createElement('canvas');cv.width=256;cv.height=64;const x=cv.getContext('2d'),gr=x.createLinearGradient(0,0,0,64);gr.addColorStop(0,'rgba(120,80,255,0)');gr.addColorStop(0.35,'rgba(140,90,255,0.5)');gr.addColorStop(0.7,'rgba(80,255,170,0.9)');gr.addColorStop(1,'rgba(60,255,160,0)');x.fillStyle=gr;x.fillRect(0,0,256,64);
  for(let i=0;i<40;i++){x.fillStyle='rgba(200,255,230,'+(0.05+Math.random()*0.12)+')';x.fillRect(Math.random()*256,0,2+Math.random()*4,64)}const tex=new THREE.CanvasTexture(cv);
  for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(320,70,24,1),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));m.position.set((i-2)*60,150+i*12,-120+i*40);m.rotation.y=0.4*i-0.8;m.userData.ph=i*1.3;m.renderOrder=-10;g.add(m)}scene.add(g);return g}
function bioTick(dt){if(!S)return;const b=SPC?-1:biomeAt(player.p.x,player.p.z),night=isNightH(),F=BFX;F.b=b;const L=(k,v,s)=>{F[k]+=(v-F[k])*Math.min(1,dt*(s||0.6))};
  L('mist',b===33||b===42?1:0,0.5);L('aur',night&&[32,5,21,24,44,47].includes(b)?(b===32?1:0.45):0,0.4);L('glare',b===35&&hour>10&&hour<16?1:0,0.8);
  if(F.aur>0.01){if(!AUR)AUR=auroraMake();AUR.visible=true;AUR.position.set(camera.position.x,0,camera.position.z);const t=performance.now()/1000;AUR.children.forEach(m=>{m.material.opacity=F.aur*(0.5+0.35*Math.sin(t*0.4+m.userData.ph));const P=m.geometry.attributes.position;for(let i=0;i<P.count;i++){const px=P.array[i*3];P.array[i*3+2]=Math.sin(px*0.02+t*0.5+m.userData.ph)*14}P.needsUpdate=true})}else if(AUR)AUR.visible=false;
  // błędne ogniki na torfowisku
  if(F.mist>0.05){if(!WISPS){WISPS=[];const tex=bioGlowTex("rgba(150,255,210,0.8)");for(let i=0;i<7;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));sp.scale.setScalar(0.7);scene.add(sp);WISPS.push({s:sp,x:0,z:0,y:0,ph:Math.random()*6,init:0})}}
   const t=performance.now()/1000;for(const w of WISPS){if(!w.init||Math.hypot(w.x-player.p.x,w.z-player.p.z)>40){const a=Math.random()*6.28,d=rnd(8,30);w.x=player.p.x+Math.cos(a)*d;w.z=player.p.z+Math.sin(a)*d;w.init=1}
    const dx=w.x-player.p.x,dz=w.z-player.p.z,dd=Math.hypot(dx,dz)||1;if(dd<6){w.x+=dx/dd*dt*5;w.z+=dz/dd*dt*5}else{w.x+=Math.sin(t*0.3+w.ph)*dt*0.8;w.z+=Math.cos(t*0.27+w.ph)*dt*0.8}
    const h=colAt(w.x,w.z)??player.p.y;w.y=Math.max(h,WATER)+1.2+Math.sin(t*1.3+w.ph)*0.4;w.s.position.set(w.x,w.y,w.z);w.s.material.opacity=F.mist*(night?1:0.45)*(0.6+0.4*Math.sin(t*2+w.ph));w.s.visible=true}}
  else if(WISPS)for(const w of WISPS)w.s.visible=false;
  // v103: cząsteczki nowych biomów — para z gejzerów, popiół w martwym lesie, śnieg nad lodowcem, iskry otchłani, pyłki na podniebnych łąkach
  try{const em=(n,c,o)=>{const a=Math.random()*6.28,d=rnd(1,14);PFX.emit(player.p.x+Math.cos(a)*d,player.p.y+(o.y||rnd(3,7)),player.p.z+Math.sin(a)*d,n,c,o)};
   if(b===41&&Math.random()<dt*10)em(2,['#ffffff','#e8f0f4'],{sp:0.3,up:1.2,life:3,size:0.22,g:0.3,y:rnd(0,2)});if(b===42&&Math.random()<dt*10)em(1,['#7a7470','#5a5450','#9a948c'],{sp:0.3,up:-0.4,life:4,size:0.06,g:-0.3});
   if(b===47&&Math.random()<dt*22)em(1,['#ffffff','#e8f4ff'],{sp:0.3,up:-1,life:4,size:0.06,g:-0.5});if(b===48&&Math.random()<dt*14)em(1,['#c890ff','#8a3aff','#e0b8ff'],{sp:0.2,up:0.8,life:3,size:0.08,g:0.2,y:rnd(0,3)});if(b===39&&Math.random()<dt*8)em(1,['#fff0a0','#f0c8f0','#ffffff'],{sp:0.3,up:0.2,life:4,size:0.05,g:0});if(b===51&&Math.random()<dt*10)em(1,['#ffd060','#f0a030','#ffe8a0'],{sp:0.3,up:-0.3,life:5,size:0.07,g:-0.2});if(b===53&&Math.random()<dt*(night?20:6))em(1,['#5affe8','#8ab8ff','#c8ff8a'],{sp:0.4,up:0.3,life:3,size:0.07,g:0,y:rnd(0.5,3)});if(b===54&&Math.random()<dt*10)em(1,['#f08ab0','#f8d840','#ffffff','#c8a8f0'],{sp:0.4,up:0,life:5,size:0.08,g:-0.15});if(b===56&&Math.random()<dt*12)em(1,['#a82a22','#8a1a1a','#c84a32'],{sp:0.3,up:-0.5,life:5,size:0.08,g:-0.3});if(b===50&&Math.random()<dt*6)em(1,['#ff8a2e','#ffd34d'],{sp:0.2,up:0.8,life:2,size:0.05,g:0.3,y:rnd(0,1)})}catch(_){}
  // v113: cząsteczki nowych biomów
  try{const em=(n,c,o)=>{const a=Math.random()*6.28,d=rnd(1,14);PFX.emit(player.p.x+Math.cos(a)*d,player.p.y+(o.y!=null?o.y:rnd(3,7)),player.p.z+Math.sin(a)*d,n,c,o)},R=Math.random,nt=night;
   if(b===57&&R()<dt*8)em(1,['#8a8478','#a8a090','#6a6458'],{sp:0.3,up:-0.3,life:4,size:0.06,g:-0.3});
   if(b===58&&R()<dt*5)em(1,['#c8f4ff','#e8d8ff'],{sp:0.1,up:0.1,life:2,size:0.05,g:0,y:rnd(0.5,3)});
   if(b===59&&R()<dt*6)em(1,['#ffffff','#f4f8ff'],{sp:0.2,up:0.3,life:2,size:0.04,g:0,y:rnd(0,1.5)});
   if(b===60&&R()<dt*12)em(2,['#ffffff','#eef2f8','#f8faff'],{sp:0.5,up:0.05,life:5,size:0.35,g:0,y:rnd(-2,1)});
   if(b===61&&R()<dt*5)em(1,['#e07a3a','#e8b84a','#a86ab8','#5aa88a'],{sp:0.3,up:0.2,life:3,size:0.05,g:0});
   if(b===62&&R()<dt*8)em(1,['#2a2622','#1a1816','#3a342e'],{sp:0.1,up:0.6,life:1.6,size:0.12,g:0.2,y:rnd(0,0.6)});
   if(b===63&&R()<dt*(nt?16:5))em(1,['#ffd860','#ffe890','#fff4c0'],{sp:0.35,up:0.15,life:3,size:0.07,g:0,y:rnd(0.5,4)});
   if(b===64&&R()<dt*16)em(1,['#ffffff','#e8f4ff'],{sp:0.3,up:-0.8,life:4,size:0.06,g:-0.4});
   if(b===65&&R()<dt*8)em(1,['#c8b898','#b8a888','#d8c8a8'],{sp:0.8,up:0.2,life:3,size:0.06,g:0,y:rnd(0,2)});
   if(b===66&&R()<dt*5)em(1,['#f4f0f8','#e0dce8'],{sp:0.2,up:-0.1,life:5,size:0.09,g:-0.05});
   if(b===67&&R()<dt*5)em(1,['#f8c8d8','#ffffff'],{sp:0.3,up:-0.4,life:4,size:0.05,g:-0.3});
   if(b===68&&R()<dt*7)em(2,['#ff9a3a','#ffc860','#ff6a1a'],{sp:1.2,up:1.4,life:0.8,size:0.05,g:1.2,y:rnd(0,1.5)})}catch(_){}
  // płatki wiśni
  if(b===34&&Math.random()<dt*14){const a=Math.random()*6.28,d=rnd(1,12);try{PFX.emit(player.p.x+Math.cos(a)*d,player.p.y+rnd(4,8),player.p.z+Math.sin(a)*d,1,['#f8c8d8','#ffdce8','#f0a8c0'],{sp:0.4,up:-0.6,life:4,size:0.07,g:-0.4})}catch(_){}}
  if(!glareEl){glareEl=document.createElement('div');glareEl.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:3;background:radial-gradient(circle at 50% 30%,rgba(255,255,250,.85),rgba(220,255,255,.25) 45%,rgba(255,255,255,0) 80%);opacity:0';document.body.appendChild(glareEl)}
  glareEl.style.opacity=(F.glare*0.32).toFixed(3);
  // chorąży wzmacnia sojuszników, kamienny troll twardnieje za dnia, czerw kryje się w piasku
  if(isAuth()){for(const e of enemies.values()){if(e.st===2)continue;const d=EDEF[e.t];
    if(d.banner){e.bT=(e.bT||0)-dt;if(e.bT<=0){e.bT=1;for(const o of enemies.values()){if(o===e||o.st===2||EDEF[o.t].passive)continue;if(Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z)<12&&o.hp<o.max){o.hp=Math.min(o.max,o.hp+o.max*0.04);o.prov=Math.max(o.prov||0,3)}}try{PFX.emit(e.p.x,e.p.y+2.6,e.p.z,4,['#7affd0','#c8fff0'],{sp:1.5,up:1,life:0.6,size:0.08})}catch(_){}}}
    if(d.blind&&!(e.prov>0)){const dd=Math.hypot(player.p.x-e.p.x,player.p.z-e.p.z),sp=Math.hypot(player.v.x,player.v.z);if(dd<20&&Math.abs(player.p.y-e.p.y)<6&&((sp>4.6&&!(typeof P3!=='undefined'&&P3.sneak))||P2.atkCd>0))e.prov=4}
    if(d.blink&&e.tgId&&Math.random()<dt*0.3){const a=e.ry+(Math.random()<0.5?1.57:-1.57),nx=e.p.x+Math.sin(a)*5,nz=e.p.z+Math.cos(a)*5,h=colAt(nx,nz);if(h!==null&&h>=WATER&&Math.abs(h-e.p.y)<2){try{PFX.emit(e.p.x,e.p.y+0.6,e.p.z,12,['#ff9a3a','#ffffff'],{sp:2,up:1.5,life:0.5,size:0.1})}catch(_){}e.p.x=nx;e.p.z=nz;e.p.y=h}}
    if(d.pack==null&&e.pack!=null){const L2=enemies.get(e.pack);if((!L2||L2.st===2)&&!e.packBroke){e.packBroke=1;e.flee=rnd(5,8);e.fleeTo=null;e.fled=1}}}}
  for(const e of enemies.values()){const d=EDEF[e.t];if(d.burrow&&e.m){const act=e.tgId&&e.st!==2;e.bur=(e.bur??1)+((act?0:1)-(e.bur??1))*Math.min(1,dt*2.5);const ch=e.m.children[0];if(ch)ch.position.y=-e.bur*3.4;if(act&&e.bur>0.3&&Math.random()<dt*20)try{PFX.emit(e.p.x+rnd(-1,1),e.p.y+0.2,e.p.z+rnd(-1,1),2,['#d8b878','#c8a060'],{sp:2,up:3,life:0.6,size:0.12})}catch(_){}}
   if(d.stoneDay&&e.m){const day=!isNightH()&&hour>8&&hour<17;e.stoneK=day?1:0}}
  // wróżka-kompan leczy gracza
  if(typeof PET!=='undefined'&&PET&&PET.t==='wrozka'&&!P2.dead){PET.healT=(PET.healT||0)-dt;if(PET.healT<=0){PET.healT=3;if(P2.hp<ST.hp){P2.hp=Math.min(ST.hp,P2.hp+ST.hp*0.03);try{PFX.emit(player.p.x,player.p.y+1.4,player.p.z,6,['#9affc8','#ffffff'],{sp:1.2,up:1.5,life:0.7,size:0.08})}catch(_){}}}}
  nestTick(dt);ghostTick(dt);
  if(window.__root>0){window.__root-=dt;if(window.__rootP){player.p.x=window.__rootP[0];player.p.z=window.__rootP[1]}}else window.__rootP=null}
// efekty po trafieniu gracza przez specjalne stwory
function onPlayerHitBy(e,dmg){const d=EDEF[e.t];if(!d)return;
  if(d.leech&&e.hp<e.max){e.hp=Math.min(e.max,e.hp+dmg*d.leech*4)}
  if(d.kb){const dx=player.p.x-e.p.x,dz=player.p.z-e.p.z,l=Math.hypot(dx,dz)||1;player.v.x+=dx/l*d.kb;player.v.z+=dz/l*d.kb;player.v.y=Math.max(player.v.y,6);toast('Odrzuca cię!','#ff9d6b')}
  if(d.thief&&!e.loot&&INV.gold>0){const g=Math.min(INV.gold,Math.max(5,Math.round(INV.gold*0.08)));INV.gold-=g;e.loot=g;e.flee=10;e.fleeTo=null;toast('Małpa ukradła '+g+' złota! Złap ją!','#ffd34d');try{updHud()}catch(_){}}
  if(d.constrict&&!(window.__root>0)){window.__root=1.4;window.__rootP=[player.p.x,player.p.z];toast('Wąż cię oplata!','#ff9d6b')}}

function makeEnemy(t,elite){const m0=makeEnemy0(t,elite);m0.userData.et=t;try{m0.traverse(o=>{const g=o.geometry;if(!o.isMesh||!g||!g.attributes||!g.attributes.color||g.userData.shd||!g.attributes.position)return;g.userData.shd=1;const P=g.attributes.position.array,Cc=g.attributes.color,A=Cc.array,s=Cc.itemSize;let mn=1e9,mx=-1e9;for(let i=1;i<P.length;i+=3){mn=Math.min(mn,P[i]);mx=Math.max(mx,P[i])}const span=mx-mn||1;for(let i=0;i<P.length/3;i++){const t2=(P[i*3+1]-mn)/span,f=0.8+0.3*t2;for(let k=0;k<3;k++)A[i*s+k]=Math.min(A instanceof Uint8Array?255:1,A[i*s+k]*f)}Cc.needsUpdate=true})}catch(e){}return m0}
const MX={slime:{core:1},skorpion:{ridge:1,spots:1,belly:1,seg:1},krab:{spots:1,belly:1},yeti:{fur:1,belly:1},golem:{moss:1,cracks:1},kolos:{moss:1,cracks:1},ropucha:{spots:1,belly:1,warts:1},pajak:{stripes:1,hair:1},matka:{stripes:1,hair:1},wilkolak:{fur:1,belly:1},bazyliszek:{ridge:1,spots:1,belly:1},gryf:{feathers:1,belly:1},zywiolak:{flames:1},smok:{ridge:1,belly:1,scales:1}};
/*QX*/
function monExtra(t,d){if(d._ext)return d._ext;const F=MX[t]||{belly:1},L=[];let b=null,bv=0;for(const p of d.parts){const v=p[3]*p[4]*p[5];if(v>bv){bv=v;b=p}}if(!b)return d._ext=L;
  const [x,y,z,w,h,dd,c]=b,D1=darker(c,0.72),D2=darker(c,0.85),L1=darker(c,1.18),L2=darker(c,1.35),hs=(a,k)=>{const s=Math.sin(a*12.9898+k*78.233)*43758.5453;return s-Math.floor(s)},P=(...q)=>L.push(q);
  if(F.belly)P(x,y-h/2+0.012,z,w*0.7,0.03,dd*0.75,L1);
  if(F.spots)for(let i=0;i<7;i++){const u=hs(i,1)-0.5,v=hs(i,2)-0.5,s=0.06+hs(i,3)*0.08;P(x+u*w*0.8,y+h/2+0.008,z+v*dd*0.85,s,0.02,s*1.3,i%2?D1:L1)}
  if(F.ridge){const n=Math.max(4,Math.round(dd/0.22));for(let i=0;i<n;i++){const zz=z-dd/2+(i+0.5)*dd/n,hh=0.08+0.06*Math.sin(i/n*Math.PI);P(x,y+h/2+hh/2,zz,0.05,hh,0.08,D1);P(x,y+h/2+hh+0.02,zz,0.03,0.04,0.05,L2)}}
  if(F.seg)for(let i=1;i<4;i++)P(x,y+h/2+0.005,z-dd/2+i*dd/4,w*0.95,0.02,0.03,D1);
  if(F.scales)for(let r=0;r<3;r++)for(let i=0;i<8;i++)P(x+(r-1)*w*0.32,y+h/2+0.01,z-dd/2+(i+0.5+(r%2)*0.5)*dd/8.5,w*0.22,0.02,dd/12,i%2?D2:D1);
  if(F.fur){for(let i=0;i<10;i++){const u=hs(i,4)-0.5,v=hs(i,5)-0.5;P(x+u*w*0.9,y+h/2+0.04,z+v*dd*0.9,0.1,0.08,0.1,i%2?L1:D2)}for(const s of [1,-1])P(x+s*(w/2+0.02),y+h*0.2,z,0.05,h*0.5,dd*0.7,D2)}
  if(F.moss){for(let i=0;i<5;i++){const u=hs(i,6)-0.5,v=hs(i,7)-0.5;P(x+u*w*0.8,y+h/2+0.02,z+v*dd*0.8,0.2,0.05,0.2,i%2?'#5a8a3a':'#4a7a2a')}P(x+w*0.3,y+h*0.1,z+dd/2+0.01,0.25,0.18,0.02,'#5a8a3a')}
  if(F.cracks){P(x-w*0.2,y+h*0.1,z+dd/2+0.012,0.03,h*0.6,0.012,'!#7fe3ff');P(x-w*0.1,y-h*0.05,z+dd/2+0.012,0.25,0.03,0.012,'!#7fe3ff');P(x+w*0.25,y+h*0.25,z+dd/2+0.012,0.03,h*0.4,0.012,'!#7fe3ff');for(const s of [1,-1])P(x+s*(w/2+0.08),y+h/2-0.1,z,0.2,0.2,0.3,D2)}
  if(F.stripes)for(let i=0;i<4;i++)P(x,y+h/2+0.008,z-dd*0.35+i*dd*0.23,w*0.9,0.02,0.05,i%2?'#a8302a':L2);
  if(F.hair)for(let i=0;i<12;i++){const u=hs(i,8)-0.5,v=hs(i,9)-0.5;P(x+u*w,y+h/2+0.03,z+v*dd,0.02,0.07,0.02,L2)}
  if(F.warts)for(let i=0;i<9;i++){const u=hs(i,10)-0.5,v=hs(i,11)-0.5;P(x+u*w*0.85,y+h/2+0.015,z+v*dd*0.85,0.05,0.04,0.05,i%3?'#7a9a4a':'#3a5a2a')}
  if(F.feathers){for(let i=0;i<6;i++)for(const s of [1,-1])P(x+s*(w/2+0.015),y+h*0.25-i*0.03,z-dd*0.3+i*0.12,0.03,0.12,0.14,i%2?L1:'#f2ead8');for(let i=0;i<5;i++)P(x,y+h/2+0.02,z-dd*0.4+i*0.18,w*0.6,0.03,0.12,i%2?L1:D2)}
  if(F.flames){for(let i=0;i<7;i++){const a=i/7*6.283;P(x+Math.cos(a)*w*0.38,y+h/2+0.1+hs(i,12)*0.15,z+Math.sin(a)*dd*0.38,0.12,0.2+hs(i,13)*0.15,0.12,i%2?'!#ffb030':'!#ffe080')}P(x,y+h/2+0.3,z,0.18,0.3,0.18,'!#ffe080');P(x,y,z,w*0.6,h*0.6,dd*0.6,'!#fff0a0')}
  if(F.core){P(x,y-h*0.05,z,w*0.45,h*0.45,dd*0.45,darker(c,0.55));P(x+w*0.22,y+h*0.32,z+dd*0.3,0.14,0.08,0.03,'#e8ffd8');for(let i=0;i<4;i++)P(x+(hs(i,14)-0.5)*w*0.6,y+(hs(i,15)-0.5)*h*0.6,z+(hs(i,16)-0.5)*dd*0.6,0.07,0.07,0.07,L2)}
  return d._ext=L}
{const _mc=makeChar,_ag=applyGear,_sw=setWeapon,_me=makeEnemy;makeChar=function(...x){return layerMeshes(_mc.apply(this,x))};applyGear=function(g,...x){const r=_ag.call(this,g,...x);layerMeshes(g);return r};setWeapon=function(g,...x){const r=_sw.call(this,g,...x);layerMeshes(g);return r};makeEnemy=function(...x){return layerMeshes(_me.apply(this,x))}}
// ===== v83: dopracowane modele słabszych zwierząt (królik, kaczka, kot, pingwin, żółw, jaszczurka, żuraw/czapla/ibis/struś, flaming, sowa śnieżna, wróżka, ślimak) =====
{const EY=(hw,y,z,s)=>[[-hw-.25,y,z,.5,s,s,'#f6f2e8'],[hw-.25,y,z,.5,s,s,'#f6f2e8'],[-hw-.45,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010'],[hw+.05,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010']];
 const mr=b=>[-(b[0]+b[3]),b[1],b[2],b[3],b[4],b[5],b[6]],S=(...L)=>L.flatMap(b=>[b,mr(b)]);
 // królik: zad, skoki, łapki, puszysty ogon, uszy z różowym wnętrzem
 {const F='#8a7a62',FD='#7a6a52',FL='#9c8c74';
  PANIM.rabbit.body=voxGeo([[-1.3,.6,-1.8,2.6,2.3,3.6,F],[-1.5,.5,-2.6,3,2.8,2.2,'#857560'],[-1,2.9,-1.9,2,.4,2.6,FL],[-1.1,3.3,-2.4,2.2,.3,1.6,FL],[-1,.5,1.3,2,1.7,.7,'#b8a88e'],[-1.1,.3,-1.6,2.2,.4,3,'#c8b89e'],
   ...S([1.1,.3,-2.3,.8,2.1,2.1,FD],[1,0,-1.7,.9,.5,2.5,'#6e5e48'],[.3,0,1,.7,1.1,.8,FD],[.3,0,1.6,.7,.35,.5,'#6e5e48']),[-.7,1.3,-3.3,1.4,1.4,1,'#fbf8f0'],[-.5,1.6,-3.6,1,1,.5,'#ffffff']]);
  PANIM.rabbit.head=voxGeo([...EY(1.1,1.1,1,.75),[-1.1,0,0,2.2,2.2,2.2,F],[-.9,2.1,.2,1.8,.3,1.7,FL],[-.7,.1,2,1.4,1.1,.7,'#a09078'],[-.25,.8,2.6,.5,.35,.2,'#e8a0a8'],[-.1,.3,2.65,.2,.5,.1,'#5a4a3a'],
   ...S([.5,0,1.5,.45,.8,.8,'#d8ccb8'],[.3,2.1,.3,.7,1.3,.7,F],[.35,3.2,.2,.6,2.3,.6,F],[.45,2.5,.78,.4,2.7,.14,'#e8b8b8'],[.4,5.4,.25,.5,.3,.5,FD])]);}
 // kaczka (kaczor krzyżówki): pierś, lusterko na skrzydle, zakręcone sterówki, nogi z błonami
 {const B='#8a6a44';
  PANIM.duck={...PANIM.duck,body:voxGeo([[-1.5,1.1,-2.2,3,2.2,4.4,B],[-1.3,1.2,1.8,2.6,2,.9,'#6a4630'],[-1.1,1.5,2.5,2.2,1.4,.4,'#5e3e2a'],[-1.2,3.2,-2,2.4,.5,3.6,'#9a7a54'],[-1.6,1.3,-1.6,3.2,.9,3.2,'#b8b0a0'],[-1.2,.8,-1.6,2.4,.4,3.2,'#d8d0c0'],
    ...S([1.5,1.9,-1.9,.35,1.3,3.4,'#6a5238'],[1.55,2.1,-1.6,.35,.5,1.2,'#3a5a9a'],[1.56,2.1,-.3,.34,.5,.25,'#f4f4f4'],[1.56,2.1,-1.9,.34,.5,.25,'#f4f4f4']),
    [-1,2.3,-3.2,2,.9,1.2,'#4a3a2a'],[-.6,2.9,-3.8,1.2,.6,.8,'#2a2420'],[-.3,3.4,-3.9,.6,.5,.5,'#1a1a1a'],[-.9,1.7,-2.8,1.8,.6,.7,'#f4f4f4']]),
   head:voxGeo([...EY(1,1.2,.9,.7),[-.7,-.7,-.2,1.4,1,1.4,'#2f7a4a'],[-.8,-.3,-.3,1.6,.35,1.6,'#f4f4f4'],[-1,.1,-.1,2,2,2.1,'#2f7a4a'],[-.8,2.1,.1,1.6,.3,1.6,'#3a8a56'],[-.7,.5,2,1.4,.55,1.5,'#e8b020'],[-.6,.5,3.4,1.2,.4,.3,'#c89010'],[-.5,.3,2,1,.2,1.3,'#d09a18']]),
   neck:[0,3.3,1.5],leg:{w:.5,h:1.2,c:'#e8903a',hoof:'#d87a28',hips:[[-.7,-.3],[.7,-.3]],amp:.6},gait:14};}
 // kot: pręgi, biała pierś, brzuch, ogon w górę z jasną końcówką
 {const C='#d88a3a',D='#b06a28';
  PANIM.cat.body=voxGeo([[-1.2,1.9,-3,2.4,2.4,6,C],[-.8,1.8,2.6,1.6,1.5,.5,'#f4efe4'],[-1,1.7,2.2,2,2,.6,'#e8a860'],[-.9,1.6,-2.4,1.8,.35,4.6,'#f0d8b0'],[-.9,4.3,-2.6,1.8,.3,5.2,'#c87a30'],
   ...[-2.4,-1,.4,1.8].map(z=>[-1.3,3.2,z,2.6,1.2,.5,D]),...S([1,1.9,-2.9,.45,2,1.8,'#cc8034'],[1,1.9,1.3,.4,1.8,1.3,'#cc8034']),
   [-.4,3.4,-4.2,.8,.8,1.4,C],[-.4,3.8,-5.2,.8,.8,1.2,C],[-.4,4.4,-6,.8,1.6,.8,C],[-.45,4.9,-6.05,.9,.4,.9,D],[-.4,5.8,-6.3,.8,1.2,.8,C],[-.45,6.3,-6.35,.9,.35,.9,D],[-.4,6.9,-6.1,.8,.7,.8,'#f4efe4']]);}
 // pingwin cesarski: wysmukła sylwetka, żółta pierś i plamy na głowie, płetwy, ogon
 {const K='#1e2228',W='#f4f4f0';
  PANIM.penguin={...PANIM.penguin,body:voxGeo([[-1.9,1.2,-1.7,3.8,3.4,3.4,K],[-1.6,4.4,-1.5,3.2,2.6,3,K],[-1.4,1.3,1.5,2.8,3.2,.5,W],[-1.1,4.4,1.3,2.2,2,.5,W],[-1.1,6,1.35,2.2,.8,.5,'#f0c840'],[-.9,6.6,1.36,1.8,.35,.5,'#e8a030'],
    ...S([1.9,3,-.9,.5,3.6,1.6,'#16191e'],[1.95,2.4,-.6,.4,.8,1,'#16191e'],[1.6,1.2,-1.4,.4,3,.5,'#2a2e36']),[-.8,1.2,-2.4,1.6,.7,.9,'#16191e'],[-.5,1.2,-2.9,1,.4,.6,'#16191e']]),
   head:voxGeo([...EY(1.4,1,.9,.65),[-1.4,0,-1.3,2.8,2.6,2.7,K],[-1.1,2.5,-1,2.2,.3,2.1,'#262a32'],...S([1.05,.5,-.5,.45,1.3,1.2,'#f0c840']),[-.4,.7,1.4,.8,.6,1.3,'#3a3a40'],[-.35,.6,1.4,.7,.22,1.2,'#e8a03a'],[-1,-.2,1.2,2,.8,.3,W]]),neck:[0,6.9,.1]};}
 // żółw: warstwowa skorupa z tarczkami, plastron, szyja, ogonek
 {const G='#4a6a3a',SK='#8a9a5a';
  PANIM.turtle={...PANIM.turtle,body:voxGeo([[-3.2,.9,-3.6,6.4,.5,7.2,'#c8b878'],[-3.7,1.3,-4.1,7.4,.7,8.2,'#3e5a30'],[-3.3,1.9,-3.7,6.6,1.6,7.4,G],[-2.7,3.5,-3,5.4,1,6,'#567a40'],[-1.9,4.5,-2.1,3.8,.6,4.2,'#628a48'],
    ...[-1.9,-.6,.7].map(z=>[-.9,5.1,z,1.8,.25,1.1,'#7a9a52']),...S(...[-2.7,-.9,.9].map(z=>[2,4.5,z,.6,.22,1.4,'#6e8e4c'])),...S(...[-3.3,-1.5,.3,2.1].map(z=>[2.8,3.5,z,.45,.2,1.2,'#5e7e44'])),
    ...S(...[-3.6,-1.8,0,1.8].map(z=>[3.7,1.5,z+.2,.12,.35,1.3,'#2e4a24'])),[-.4,1.3,-4.7,.8,.6,.8,SK],[-.25,1.4,-5.2,.5,.4,.6,SK]]),
   head:voxGeo([...EY(1,.6,1.2,.6),[-.7,-.3,-1.4,1.4,1.4,1.6,'#7a8a50'],[-1,-.4,0,2,1.8,2.4,SK],[-.8,-.4,2.3,1.6,.9,.4,'#9aaa6a'],[-.8,1.4,.3,1.6,.2,1.8,'#6a7a44'],[-.6,-.45,1,1.2,.15,1.6,'#c8b878']])};}
 // jaszczurka: grzebień, cętki, brzuch, długi zwężany ogon, pysk z językiem
 {const G='#6a8a3a',D='#5a7a32';
  PANIM.lizard={...PANIM.lizard,body:voxGeo([[-1.8,1.4,-4,3.6,1.8,8,G],[-1.4,1.1,-3.4,2.8,.4,6.8,'#c8c070'],[-1.2,3.2,-3.6,2.4,.35,7.2,'#8aa84a'],...[-3,-1.6,-.2,1.2,2.6].map(z=>[-.25,3.5,z,.5,.6,.7,'#3e5a24']),
    ...S(...[-2.5,-.5,1.5].map(z=>[1.8,2,z,.15,.6,.8,'#4a6a2a']),[1.6,1.3,2,.7,1.4,1.6,D],[1.6,1.3,-3.4,.7,1.4,1.6,D]),
    [-1.2,1.5,-6.6,2.4,1.5,2.8,'#628236'],[-.8,1.6,-9,1.6,1.1,2.6,D],[-.5,1.7,-11.2,1,.8,2.4,'#527030'],[-.3,1.75,-13,.6,.5,2,'#4a682a'],[-.2,2.9,-6.2,.4,.4,.6,'#3e5a24'],[-.2,2.6,-7.6,.4,.3,.5,'#3e5a24']]),
   head:voxGeo([...EY(1.3,.3,1.2,.6),[-1.3,-.6,0,2.6,1.6,3,G],[-1,-.6,2.8,2,1.2,1.4,'#5f8034'],[-1.1,-.9,.4,2.2,.35,3.6,'#c8c070'],...S([.7,.95,.8,.6,.3,1,'#4a6a2a'],[.4,.5,4.1,.25,.2,.12,'#2a3a18']),[-.15,-.5,4.2,.3,.14,.9,'#d04050']])};}
 // żuraw (baza także dla czapli, ibisa i strusia): esowata szyja, skrzydła z lotkami, kuper, uda
 {const G='#c8ccd0';
  PANIM.crane={...PANIM.crane,body:voxGeo([[-1.4,9,-3,2.8,3.2,6.2,G],[-1.1,9.4,3,2.2,2.6,.9,'#d4d8dc'],[-.8,9.9,3.7,1.6,1.8,.5,'#dadde0'],[-1,12.2,-2.6,2,.4,5.2,'#b8bcc2'],[-1,8.7,-2.2,2,.4,4.4,'#dadde0'],
    ...S([1.4,9.8,-2.6,.45,2.4,5,'#aeb2b8'],[1.45,9.3,-3.2,.4,1,3.4,'#9aa0a8'],[1.45,9.5,-4.6,.4,1.6,2,'#2a2a30'],[.4,8.1,-.7,.9,1,1.2,'#b8bcc2']),
    [-1.1,9.8,-4.8,2.2,2,2,'#3a3a42'],[-.8,8.8,-5.4,1.6,1.4,1.2,'#2a2a30'],[-.6,10.8,-5.6,1.2,.9,1,'#4a4a52']]),
   head:voxGeo([[-.45,0,-.4,.9,2.3,.9,'#e0e0e4'],[-.45,2.1,-.05,.9,2.2,.9,'#e0e0e4'],[-.45,4.1,-.4,.9,2,.9,'#e8e8ec'],[-.3,.4,.45,.6,3.6,.15,'#3a3a42'],[-.7,5.9,-.5,1.4,1.3,2,'#e8e8ec'],[-.5,7.2,-.3,1,.3,1.2,'#d03030'],
    ...S([.7,6.2,.1,.1,.5,.9,'#f4f4f6'],[.72,6.6,.75,.1,.35,.35,'#101010']),[-.3,6.2,1.5,.6,.55,2,'#c0a860'],[-.2,6.25,3.5,.4,.4,1.2,'#a89050']])};}
 // flaming: esowata szyja, zagięty dziób, skrzydła z czarnymi lotkami
 {const P='#f4a0b0';
  PANIM.flamingo={...PANIM.flamingo,body:voxGeo([[-1.4,7,-2.4,2.8,2.4,4.4,P],[-1.1,7.3,1.9,2.2,1.9,.8,'#f6aabb'],[-1,9.3,-2,2,.4,3.4,'#f8b4c2'],[-1.2,6.7,-1.8,2.4,.4,3.2,'#f8b8c4'],
    ...S([1.4,7.5,-2.2,.4,1.7,3.6,'#e88898'],[1.45,7.3,-2.6,.35,.6,2.4,'#d05a70'],[1.45,7.6,-3.4,.35,1,1.4,'#1a1a1a'],[.3,6.2,-.5,.7,.9,.9,'#f0a4b2']),[-1,8.2,-3.3,2,1,1.1,'#e88898'],[-.7,8,-3.9,1.4,.7,.8,P]],0.04),
   head:voxGeo([[-.35,0,0,.7,1.9,.7,P],[-.35,1.6,.45,.7,.65,.9,P],[-.35,2,.9,.7,1.8,.7,P],[-.6,3.6,.6,1.2,1.1,1.5,P],[-.5,4.65,.75,1,.2,1.1,'#f8b4c2'],[-.3,3.7,2,.6,.6,.8,'#f4e8e8'],[-.3,3.1,2.5,.6,.95,.6,'#1a1a1a'],
    ...S([.57,3.9,1.2,.1,.3,.3,'#f0c020'],[.62,3.97,1.27,.08,.14,.14,'#101010'])],0.03)};}
 // sowa śnieżna: stojąca, szlara, żółte oczy, prążki
 {const W='#f4f4f0',FL=[[-1,1.6],[.3,2],[-.4,2.6],[.6,3.1],[-1.1,3.5],[0,4],[.9,4.3],[-.2,1.3]];
  PANIM.snowowl={body:voxGeo([[-1.6,.8,-1.5,3.2,4.2,3,W],[-1.3,1,1.4,2.6,3.4,.4,'#ffffff'],...FL.map(([x,y])=>[x,y,1.76,.6,.2,.1,'#6a6a66']),[-1.2,4.9,-1.2,2.4,.3,2.4,'#ecece6'],
    ...S([1.6,1.2,-1.3,.45,3.4,2.4,'#e4e4de'],[1.6,.5,-1.6,.4,1,1.4,'#d0d0c8'],[2.02,1.9,-.9,.08,.2,.7,'#6a6a66'],[2.02,2.8,-.3,.08,.2,.7,'#6a6a66'],[2.02,3.6,-1,.08,.2,.7,'#6a6a66'],[.4,.6,-.3,.9,.5,1,'#ecece6']),
    [-1,.5,-2.2,2,.6,1.2,'#dcdcd4'],[-.7,.3,-2.6,1.4,.4,.8,'#c8c8c0']]),
   head:voxGeo([[-1.7,-.2,-1.5,3.4,2.8,3,'#f8f8f4'],[-1.4,.1,1.5,2.8,2.2,.25,'#ffffff'],...S([.35,1,1.7,.9,.9,.2,'#f0c020'],[.6,1.2,1.86,.45,.5,.15,'#101010'],[.3,1.95,1.6,1.1,.25,.3,'#dcdcd4']),
    [-.25,.5,1.7,.5,.7,.5,'#2a2a2a'],[-1.3,2.6,-1.1,2.6,.25,2.2,'#ecece6']]),neck:[0,5,0],leg:{w:.7,h:.9,c:'#ecece6',hoof:'#3a3a3a',hips:[[-.7,0],[.7,0]],amp:.4},gait:10};
  CRK.snowowl=CRK.chicken;if(EDEF.sowa_s){PMAP.sowa_s='snowowl';PSC.sowa_s=1.75}}
 if(EDEF.zuraw){PMAP.zuraw='crane';PSC.zuraw=1.25}
 // kruk/wrona: dwunożny ptak ze złożonymi skrzydłami, wachlarz ogona, mocny dziób
 {const K='#1a1a20';
  PANIM.raven={body:voxGeo([[-1.3,1.6,-2.2,2.6,2.6,4.4,K],[-1.1,1.8,2,2.2,2.2,.8,'#22222a'],[-1,4.2,-1.8,2,.3,3.6,'#2a2a34'],
    ...S([1.3,2.2,-2.6,.4,1.9,4.2,'#14141a'],[1.35,3.2,-1.8,.38,.6,2.6,'#2e3040'],[1.2,2,-3.8,.4,1,1.8,'#101016'],[.4,1.3,-.4,.8,.8,1,K]),[-.9,2.2,-4.2,1.8,.7,2.2,'#14141a'],[-.6,2.3,-5.4,1.2,.5,1.4,'#101016']]),
   head:voxGeo([[-1,-.2,-.6,2,2.2,2.4,K],[-.8,-.8,.6,1.6,.8,1.2,'#22222a'],[-.8,2,-.4,1.6,.25,1.8,'#2a2a34'],[-.4,.5,1.8,.8,.9,1.6,'#3a3a3a'],[-.3,.4,3.4,.6,.6,.7,'#2a2a2a'],...S([1,1.1,.9,.12,.4,.4,'#e8c030'],[1.06,1.2,1,.1,.2,.2,'#101010'])]),
   neck:[0,4,1.6],leg:{w:.4,h:1.6,c:'#3a3a3a',hips:[[-.6,-.2],[.6,-.2]],amp:.6},gait:14};
  // orzeł olbrzymi: bielik – biała głowa i ogon, haczykowaty dziób, na wpół złożone skrzydła
  const B='#5a3a22';
  PANIM.eagle={body:voxGeo([[-1.8,3,-2.6,3.6,3.6,5.4,B],[-1.5,3.3,2.6,3,3,1,'#6a4830'],[-1.1,3.8,3.5,2.2,2,.4,'#74523a'],[-1.4,6.6,-2.2,2.8,.4,4.4,'#4a2e1a'],
    ...S([1.8,4.4,-2.4,.6,2.4,5,'#4a2e1a'],[2.3,3.6,-3.6,.5,2.2,4.4,'#3a2414'],[2,3,-5,.5,1.4,2.4,'#2e1c10'],[1.85,5.6,-1.6,.6,.5,3,'#7a5a3a'],[.5,2.2,-.6,1.2,1.4,1.4,B]),
    [-1.3,3.4,-4.6,2.6,.8,2.4,'#f4f0e8'],[-1,3.5,-6,2,.6,1.6,'#e8e4dc']]),
   head:voxGeo([[-1.3,-.3,-.9,2.6,2.8,2.8,'#f4f0e8'],[-1.4,-.9,-1.1,2.8,.9,2.2,'#ece8de'],[-.55,.5,1.8,1.1,1.1,1.3,'#e8b030'],[-.4,-.1,2.7,.8,.8,.6,'#d09820'],
    ...S([.9,1.7,.7,.6,.35,1.2,'#dcd8ce'],[1.3,1.1,.9,.12,.5,.5,'#e8c030'],[1.36,1.2,1.05,.1,.26,.26,'#101010'])].map(b=>b.map((v,k)=>k<6?v*.85:v))),
   neck:[0,6.2,2],leg:{w:.8,h:3,c:'#e8b030',hoof:'#3a3a3a',hips:[[-.9,-.2],[.9,-.2]],amp:.5},gait:9};
  CRK.raven=CRK.eagle=CRK.chicken;if(EDEF.wrona){PMAP.wrona='raven';PSC.wrona=1.5}if(EDEF.orzel){PMAP.orzel='eagle';PSC.orzel=2.6}
  if(EDEF.hipogryf){PVAR.hipogryf={b:'griffin',sc:1.85,pal:['#3a2a1c','#7a5a3c','#d8c8a8']};PMAP.hipogryf='griffin';PSC.hipogryf=1.85}}
 if(PSC.kaczka)PSC.kaczka*=0.68;PSC.jaszczurka=(PSC.jaszczurka||PSC0)*0.6;PSC.zolw=(PSC.zolw||PSC0)*0.8;
 // leśna wróżka: drobna postać w sukience z płatków, włosy z wiankiem, świetliste skrzydła
 if(EDEF.wrozka){const SKN='#f4dcc8',H='#f0c040',G='#9ae8b0',P=[[0,.27,0,.3,.1,.26,'#7ad098'],[0,.34,0,.24,.08,.2,G],[0,.2,0,.34,.05,.3,'#6ac088'],[0,.44,0,.18,.16,.14,G],[0,.375,0,.2,.03,.16,H],[0,.5,.06,.1,.05,.03,'#ffffff'],
   [.13,.43,.02,.05,.18,.05,SKN],[-.13,.43,.02,.05,.18,.05,SKN],[.13,.51,.02,.07,.05,.07,G],[-.13,.51,.02,.07,.05,.07,G],
   [0,.62,.01,.2,.2,.2,SKN],[0,.715,0,.23,.08,.21,H],[0,.6,-.08,.22,.24,.05,H],[.11,.6,0,.03,.18,.14,H],[-.11,.6,0,.03,.18,.14,H],[0,.78,-.02,.1,.07,.1,H],
   [.05,.63,.115,.04,.05,.02,'#2a4a6a'],[-.05,.63,.115,.04,.05,.02,'#2a4a6a'],[0,.565,.115,.05,.015,.02,'#d07080'],[.085,.59,.112,.04,.03,.02,'#f0b0b0'],[-.085,.59,.112,.04,.03,.02,'#f0b0b0'],
   [.08,.755,.08,.05,.04,.05,'#ff8ab0'],[-.08,.755,.08,.05,.04,.05,'#ffffff'],[0,.76,.1,.05,.04,.05,'#ffd040'],[.1,.755,0,.04,.04,.05,'#c8a8ff'],[-.1,.755,0,.04,.04,.05,'#ff8ab0'],
   [.2,.56,-.11,.26,.3,.02,'!#d8f8ff'],[-.2,.56,-.11,.26,.3,.02,'!#d8f8ff'],[.16,.36,-.11,.18,.2,.02,'!#c8f0ff'],[-.16,.36,-.11,.18,.2,.02,'!#c8f0ff'],[.17,.34,.08,.03,.03,.03,'!#ffffff']];
  Object.assign(EDEF.wrozka,{parts:P,hd:{c:[0,.62,.01],r:.2},tz:null,ty:.4,legs:[[.06,.2,0,0],[-.06,.2,0,1]],lw:.06,lh:.2,lc:SKN,lf:'#7ad098',_ext:[]})}
 // olbrzymi ślimak: spiralna muszla z przyrostami, noga z fałdą, czułki
 if(EDEF.slimak){const F='#c8b088',FD='#a8906a';EDEF.slimak.parts=[[0,.1,.05,.44,.14,1.3,F],[0,.04,.05,.5,.06,1.38,FD],[0,.12,.78,.34,.14,.2,F],[0,.09,-.68,.3,.1,.22,'#b89c78'],[0,.07,-.84,.18,.07,.14,'#b89c78'],
   [0,.26,.6,.28,.24,.26,F],[0,.4,.7,.3,.2,.26,'#d0b890'],[.08,.6,.72,.035,.26,.035,FD],[-.08,.6,.72,.035,.26,.035,FD],[.08,.75,.72,.08,.08,.08,'#2a1a10'],[-.08,.75,.72,.08,.08,.08,'#2a1a10'],
   [.07,.38,.86,.03,.03,.1,FD],[-.07,.38,.86,.03,.03,.1,FD],[0,.33,.835,.14,.03,.02,'#8a6a4a'],
   [0,.64,-.14,.46,.8,.8,'#9a5a28'],[0,.66,-.16,.52,.62,.62,'#b87434'],[0,.68,-.17,.57,.44,.44,'#d09248'],[0,.69,-.18,.61,.28,.28,'#e8b468'],[0,.7,-.18,.64,.13,.13,'#f8dc98'],
   [0,.64,-.37,.47,.82,.05,'#7a421c'],[0,.64,.09,.47,.82,.05,'#7a421c'],[0,.42,-.14,.47,.05,.82,'#7a421c'],[0,.87,-.14,.47,.05,.82,'#7a421c'],[0,.36,.22,.4,.24,.14,'#8a4a22']];EDEF.slimak._ext=[]}
}
function makeEnemy0(t,elite){
  if(SEA[t])return makeSeaE(t,elite);
  if(GIANT[t]){const gm=makeEnemy0(GIANT[t].b,elite);gm.scale.multiplyScalar(GIANT[t].k);if(HUGEB[t])try{hugeLook(gm,t)}catch(_){}return gm}
  if(t==='woz'){const g=makeHorseE('kon',false),k=1/(g.scale.x||1),cart=new THREE.Group();cart.scale.setScalar(k);cart.position.z=-3.15*k;g.add(cart);
    const W1='#7a5030',W2='#8a5a30',W3='#5a3a22',IRN='#3a3a40',CL='#e8dcc0',CL2='#d8ccb0',L=[],P=(...b)=>L.push(b);
    P(0,0.98,0,1.8,0.16,2.9,W1);for(const s of [-1,1]){P(s*0.92,1.32,0,0.1,0.56,2.9,W2);for(const y of [1.12,1.32,1.52])P(s*0.975,y,0,0.02,0.04,2.92,W3);for(const z of [-1.4,-0.5,0.5,1.4])P(s*0.98,1.32,z,0.04,0.6,0.08,IRN)}
    P(0,1.32,1.43,1.84,0.56,0.1,W2);P(0,1.3,-1.43,1.84,0.5,0.1,W2);P(0,0.88,0,0.2,0.12,2.6,W3);for(const z of [-0.85,0.85])P(0,0.62,z,2.1,0.1,0.1,IRN);
    for(let i=0;i<9;i++){const a=i/8*Math.PI,x=Math.cos(a)*0.93,y=1.62+Math.sin(a)*0.92;P(x,y,0.05,0.36,0.36,2.6,i%2?CL:CL2+'~');for(const z of [-1.05,-0.2,0.65,1.3])P(x*1.02,y*1.0+0.01,z,0.38,0.38,0.06,W3)}
    P(0,1.75,-1.38,1.6,0.9,0.04,'#3a2a1a');P(0.4,1.25,-0.9,0.6,0.5,0.6,'#9a7048');P(-0.4,1.2,-1.0,0.55,0.45,0.55,'#8a6a3a');P(-0.1,1.28,-0.2,0.5,0.6,0.5,'#c8b080');P(0.45,1.22,0.2,0.5,0.5,0.5,'#8a5a30');
    P(0,1.15,1.75,1.5,0.1,0.5,W1);P(0,1.4,1.95,1.5,0.4,0.08,W2);for(const s of [-0.55,0.55]){P(s,1.0,2.6,0.08,0.08,2.0,W3)}P(0,0.95,3.5,1.2,0.08,0.08,W3);
    P(0.8,2.1,1.55,0.05,0.4,0.05,IRN);P(0.8,1.85,1.55,0.18,0.24,0.18,'!#ffcc66');
    const body=new THREE.Mesh(boxes(L),decoMat);body.castShadow=true;cart.add(body);
    const wheelGeo=(()=>{const W=[],r=0.55;for(let i=0;i<14;i++){const a=i/14*Math.PI*2;W.push([0,Math.cos(a)*r,Math.sin(a)*r,0.1,0.13,0.27,i%2?'#4a2f1d':'#5a3a22']);W.push([0,Math.cos(a)*(r+0.03),Math.sin(a)*(r+0.03),0.12,0.06,0.25,IRN])}for(let i=0;i<6;i++){const a=i/6*Math.PI;W.push([0,0,0,0.05,Math.abs(Math.cos(a))*r*2+0.05,Math.abs(Math.sin(a))*r*2+0.05,'#6b4528'])}W.push([0,0,0,0.16,0.16,0.16,IRN]);return boxes(W)})();
    const wh=[];for(const [x,z] of [[1.0,0.85],[-1.0,0.85],[1.0,-0.85],[-1.0,-0.85]]){const w=new THREE.Mesh(wheelGeo,decoMat);w.position.set(x,0.58,z);w.castShadow=true;cart.add(w);wh.push(w)}
    try{const dr=makeChar({skin:'#e0b08a',hairC:'#5a3a22',hair:'krotkie',beard:'krotka',tunic:'#3f6a8a',pants:'#4a3a2a',boots:'#2a1c12'},{hat:'kaptur'});dr.position.set(0,1.18,1.7);dr.scale.setScalar(0.95);const du=dr.userData;if(du.ll)du.ll.rotation.x=-1.4;if(du.rl)du.rl.rotation.x=-1.4;if(du.la)du.la.rotation.x=-0.9;if(du.ra)du.ra.rotation.x=-0.9;cart.add(dr);g.userData.drv=dr}catch(_){}
    Object.assign(g.userData,{cartW:wh,cart,cartBody:body});return g}
  if(t==='kon')return makeHorseE(t,elite);
  if(t==='jednorozec'||t==='pegaz')return makeHorseF(t,elite);
  if(PMAP[t])return makePanim(t,elite);
  if(HUM[t]){const H=HUM[t],d=EDEF[t],mat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});seasonPatch(mat,false);crTex(mat,CRKH[t]??5);
    const ch=makeChar(H.look,Object.assign({mat},H.ex));ch.scale.setScalar(H.sc);if(H.w)setWeapon(ch,H.w,H.rar||(elite?3:0));
    if(HGEAR[t])try{applyGear(ch,HGEAR[t](elite))}catch(e){}
    if(HDECO[t])try{HDECO[t](ch.userData,H)}catch(e){console.error(e)}
    try{MENACE(ch.userData,t,H)}catch(e){console.error(e)}
    const BP={wilkolak:[1.3,1.05,1.2,.92,1.32,1.25,.38],troll:[1.32,1.06,1.25,.78,1.32,1.3,.3],krol_troll:[1.35,1.08,1.28,.76,1.34,1.32,.26],drzewiec:[1.22,1.16,1.12,.9,1.36,1.4,.12],prastary:[1.25,1.2,1.15,.88,1.4,1.45,.14],ork:[1.16,1.02,1.12,.92,1.12,1.15,.12],goblin:[.92,.92,.9,1.18,1.08,.9,.22]}[t];
    let hunch=0;if(BP){const c=ch.userData;c.torso.scale.set(BP[0],BP[1],BP[2]);c.head.scale.set(BP[3]/BP[0],BP[3]/BP[1],BP[3]/BP[2]);for(const a of [c.la,c.ra])if(a)a.scale.set(1.08,BP[4]/BP[1],1.08);for(const l of [c.ll,c.rl])if(l)l.scale.set(BP[5],1,BP[5]);hunch=BP[6]}
    ch.traverse(o=>{if(o.isMesh&&o.material===decoMat)o.material=mat});
    const g=new THREE.Group();g.add(ch);const inner=new THREE.Group();inner.add(g);inner.scale.setScalar(d.sc||(elite?1.35:1));
    inner.userData={g,legs:[],mat,ph:Math.random()*6,body:ch,hum:1,ch,hunch,wk:weaponKind(H.w||''),combo:0};return inner}
  const d=EDEF[t], g=new THREE.Group(), mat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});seasonPatch(mat,false);
  let BP=d.parts.concat(monExtra(t,d)),head=null,tail=null;
  if(d.hd){const hc=d.hd.c,hs=d.hd.r,HP=[],TP=[],RP=[];
    for(const p of d.parts){if(p[2]>hc[2]-hs*0.5&&p[1]>hc[1]-hs*0.7)HP.push(p);else if(d.tz!=null&&p[2]<d.tz+0.01&&p[1]>d.ty-0.6)TP.push(p);else RP.push(p)}
    if(HP.length){const jy=hc[1]-hs*0.3,jz=hc[2]-hs*0.5;head=new THREE.Group();head.position.set(0,jy,jz);const HQ=HP.map(p=>{const q=p.slice();q[1]-=jy;q[2]-=jz;return q}),isG=p=>typeof p[6]==='string'&&p[6][0]==='!';const hm=new THREE.Mesh(rboxes(HQ.filter(p=>!isG(p)),0.18),mat);hm.castShadow=true;head.add(hm);if(HQ.some(isG))head.add(new THREE.Mesh(boxes(HQ.filter(isG)),GLOWMAT));BP=RP.concat(TP)}
    if(TP.length&&head){tail=new THREE.Group();tail.position.set(0,d.ty,d.tz);const TQ=TP.map(p=>{const q=p.slice();q[1]-=d.ty;q[2]-=d.tz;return q}),isG2=p=>typeof p[6]==='string'&&p[6][0]==='!';const tm=new THREE.Mesh(rboxes(TQ.filter(p=>!isG2(p)),0.18),mat);tm.castShadow=true;tail.add(tm);if(TQ.some(isG2))tail.add(new THREE.Mesh(boxes(TQ.filter(isG2)),GLOWMAT));BP=RP}}
  const GLW=BP.filter(p=>typeof p[6]==='string'&&p[6][0]==='!');BP=BP.filter(p=>!(typeof p[6]==='string'&&p[6][0]==='!'));
  const body=new THREE.Mesh(rboxes(BP,0.18),mat);body.castShadow=true;g.add(body);if(GLW.length)body.add(new THREE.Mesh(boxes(GLW),GLOWMAT));if(head)g.add(head);if(tail)g.add(tail);
  const legs=[];(d.legs||[]).forEach(([x,y,z,ph],li)=>{const p=new THREE.Group();p.position.set(x,y,z);p.userData.y0=y;const m=new THREE.Mesh(rboxes(d.legP?d.legP(li).filter(q=>!(typeof q[6]==='string'&&q[6][0]==='!')):[[0,-d.lh/2,0,d.lw,d.lh,d.lw,d.lc]].concat(d.lf?[[0,-d.lh+0.05,0.012,d.lw+0.025,0.1,d.lw+0.035,d.lf]]:[]),d.legP?0.12:undefined),mat);m.castShadow=true;p.add(m);if(d.legP){const gl=d.legP(li).filter(q=>typeof q[6]==='string'&&q[6][0]==='!');if(gl.length)p.add(new THREE.Mesh(boxes(gl),GLOWMAT))}p.userData.ph=ph;g.add(p);legs.push(p)});
  const inner=new THREE.Group();inner.add(g);inner.scale.setScalar(d.sc||(elite?1.35:1));
  let bw=null;if(d.wingP){bw=[];const isG=p=>typeof p[6]==='string'&&p[6][0]==='!',W0=d.wingP.filter(p=>!isG(p)),WG=d.wingP.filter(isG),wgeo=W0.length?boxes(W0):null,ggeo=WG.length?boxes(WG):null;for(const sg of [1,-1]){const wg=new THREE.Group();wg.position.set(sg*d.wingAt[0],d.wingAt[1],d.wingAt[2]);const inn=new THREE.Group();inn.scale.x=sg;wg.add(inn);if(wgeo){const me=new THREE.Mesh(wgeo,d.wingMat==='glass'?(window.__wingGlass||(window.__wingGlass=new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,opacity:0.55,side:THREE.DoubleSide}))):mat);me.castShadow=d.wingMat!=='glass';inn.add(me)}if(ggeo)inn.add(new THREE.Mesh(ggeo,GLOWMAT));g.add(wg);bw.push([wg,sg])}}
  let flm=null;if(d.flames){flm=[];const hr=d.hd?d.hd.r:0,jy=d.hd?d.hd.c[1]-hr*0.3:0,jz=d.hd?d.hd.c[2]-hr*0.5:0;d.flames.forEach((f,i)=>{const fg=new THREE.Group();const par=(f.h&&head)?head:g;fg.position.set(f.p[0],f.p[1]-(par===head?jy:0),f.p[2]-(par===head?jz:0));if(f.r)fg.rotation.set(f.r[0]||0,0,f.r[2]||0);fg.add(new THREE.Mesh(boxes(f.b),GLOWMAT));par.add(fg);flm.push([fg,i*1.7+Math.random()*2,f.s||1])})}
  inner.userData={g,legs,mat,ph:Math.random()*6,body,hop:d.hop,head,tail,pas:!!d.passive,look:0,lookT:0,graze:0,bw,bwk:d.wingK||'flap',flm};
  return inner;
}
function animEnemy(m,speed,dt,st,flash,slowed){
  const u=m.userData;if(u.flm){const tt=performance.now()*0.001;for(const [f,ph,k] of u.flm){const a=Math.sin(tt*9.5*k+ph),b=Math.sin(tt*6.3*k+ph*1.7);f.scale.set(1-0.08*a,1+0.22*a+0.08*b,1-0.08*b);f.rotation.y=b*0.25}}if(u.bw){const tt=performance.now()*0.001+(u.ph0||(u.ph0=Math.random()*9)),run=Math.min(1,speed/4);for(const [w,sg] of u.bw){if(u.bwk==='buzz')w.rotation.z=sg*(0.25+Math.sin(tt*42)*0.55);else if(u.bwk==='glide')w.rotation.z=sg*Math.sin(tt*1.6)*0.18;else w.rotation.z=sg*(Math.sin(tt*(run>0.2?7:2.4))*(run>0.2?0.75:0.3)+0.1)}}if(u.pwings){const tt=performance.now()*0.001,run=Math.min(1,speed/5),fl=run>0.3?Math.sin(tt*7)*0.55*run:Math.sin(tt*1.3)*0.05;for(const [w,sg] of u.pwings){w.rotation.z=sg*(0.32+fl+run*0.15);w.rotation.y=sg*(1.15-run*0.85)}}if(u.cartW){for(const w of u.cartW)w.rotation.x+=speed*dt/0.58;const bb=Math.min(1,speed/2);u.cart.rotation.z=Math.sin(performance.now()*0.006)*0.018*bb;u.cart.position.y=Math.abs(Math.sin(performance.now()*0.009))*0.03*bb/(m.scale.x||1);if(u.drv&&u.drv.userData.head)u.drv.userData.head.rotation.y=Math.sin(performance.now()*0.0007)*0.4}u.ph+=dt*(3+speed*1.6);const g=u.g;
  // stan ataku: zamach (st=1) -> uderzenie przy przejściu 1->0 -> powrót
  if(st===1){if(u.lastSt!==1){u.atv=Math.floor(Math.random()*3);u.atS=Math.random()<0.5?1:-1}u.wind=Math.min(1,(u.wind||0)+dt*2.4)}else{if(u.lastSt===1&&st===0)u.strike=0.32;u.wind=Math.max(0,(u.wind||0)-dt*6)}
  try{enemySounds(m,u,st,dt);if(u.lastSt===1&&st===0)enemyStrikeSound(m,u)}catch(e){}
  if(flash>0.85&&!(u.lastFl>0.85))u.hit=0.22;u.lastFl=flash;u.lastSt=st;
  u.strike=Math.max(0,(u.strike||0)-dt);u.hit=Math.max(0,(u.hit||0)-dt);
  if(u.sea){animSea(u,speed,dt,st);return finishEnemy(m,u,dt,st,flash,slowed)}
  if(u.hum){animHumEnemy(u,speed,dt,st);return finishEnemy(m,u,dt,st,flash,slowed)}
  if(u.root){animPan(u,speed,dt,st);if(u.fire)fireAnim(u,dt,m);return finishEnemy(m,u,dt,st,flash,slowed)}
  const w=u.wind,sk=u.strike>0?Math.sin((1-u.strike/0.32)*Math.PI):0,hk=u.hit>0?Math.sin(u.hit/0.22*Math.PI):0;
  if(u.hop){const h=speed>0.3?Math.abs(Math.sin(u.ph*0.8))*0.45:Math.abs(Math.sin(u.ph*0.3))*0.05;const sq=w*0.25;
    const big=u.atv===1?1.8:1;g.position.y=st===2?g.position.y:h+sk*0.6*big;g.scale.set(1+(0.45-h)*0.15+sq,1-(0.45-h)*0.15+0.07-sq*1.4+sk*0.25,1+(0.45-h)*0.15+sq);g.position.z=sk*0.55}
  else{const run=Math.min(1,speed/3);
    for(const l of u.legs){const ph=u.ph+(l.userData.ph?Math.PI:0);l.rotation.x=Math.sin(ph)*run*0.75-(w*0.35)*(l.position.z>0?-1:1)+sk*0.5*(l.position.z>0?-1:1);l.position.y=l.userData.y0+Math.max(0,Math.cos(ph))*0.05*run}
    if(st!==2){g.position.y=(speed>0.3?Math.abs(Math.cos(u.ph))*0.045*run:0)-w*0.08+sk*0.1;g.rotation.z=Math.sin(u.ph*0.5)*0.035*run-hk*0.1;
      g.rotation.x=-w*0.22+sk*0.42-hk*0.25;g.position.z=-w*0.18+sk*0.45-hk*0.15;g.rotation.y=0;
      /* v142: odmiany ataku zwierząt — stanięcie dęba i uderzenie (1), zamach bokiem z obrotem (2) */
      if(u.atv===1&&(w>0||sk>0)){g.rotation.x+=-w*0.45+sk*0.4;g.position.y+=w*0.28-sk*0.05;for(const l of u.legs)if(l.position.z>0)l.rotation.x-=w*1.1-sk*0.6}
      else if(u.atv===2&&(w>0||sk>0)){g.rotation.y=(w*0.45-sk*0.9)*(u.atS||1);g.rotation.z+=(w*0.08-sk*0.12)*(u.atS||1);g.position.z-=sk*0.2;if(u.head)u.head.rotation.z=(sk*0.5-w*0.2)*(u.atS||1)}}}
  if(!u.hop&&st!==2)u.body.scale.y=1+Math.sin(u.ph*0.45)*0.018;
  if(u.head&&st!==2){const run=Math.min(1,speed/3);u.lookT-=dt;
    if(u.lookT<=0){u.lookT=1.5+Math.random()*3;u.lookTo=speed>0.3?0:(Math.random()-0.5)*1.1;u.graze=u.pas&&speed<0.2&&Math.random()<0.35?2+Math.random()*2:0}
    u.graze=Math.max(0,u.graze-dt);u.look+=((u.lookTo||0)-u.look)*Math.min(1,3*dt);
    const tx=Math.sin(u.ph*2)*0.07*run-w*0.35+sk*0.6-hk*0.3+(u.graze>0?0.75:0)+Math.sin(u.ph*0.6)*0.03*(1-run);
    u.head.rotation.x+=(tx-u.head.rotation.x)*Math.min(1,10*dt);u.head.rotation.y=u.look*(1-run)*(1-w);if(!(u.atv===2&&(w>0||sk>0)))u.head.rotation.z*=Math.max(0,1-dt*8);}
  if(u.tail&&st!==2){const run=Math.min(1,speed/3);u.tail.rotation.y=Math.sin(u.ph*(run>0.1?2.4:1.3))*(0.25+0.25*run);u.tail.rotation.x=-0.1*run+Math.sin(u.ph*0.9)*0.05}
  finishEnemy(m,u,dt,st,flash,slowed);
}
function animHumEnemy(u,speed,dt,st){const c=u.ch;if(st===2)return;
  if(u.hunch){c.userData.torso.rotation.x-=u._hA||0;c.userData.head.rotation.x+=(u._hA||0)*0.85}
  animChar(c,speed,dt,false,false);if(u.hunch){c.userData.torso.rotation.x+=u.hunch;c.userData.head.rotation.x-=u.hunch*0.85;u._hA=u.hunch}
  if(u.strike>0.31&&!u.cnt){u.combo=Math.random()<0.15?3:(u.combo+1)%3;c.userData.avar=Math.floor(Math.random()*3);u.cnt=1}/* v142: przeciwnicy też losują odmiany ciosów */if(u.strike<=0)u.cnt=0;
  const bow=u.wk==='bow'||u.wk==='staff';let k=-1;
  if(u.strike>0)k=bow?0.9+0.1*(1-u.strike/0.32):0.33+0.67*(1-u.strike/0.32);else if(u.wind>0)k=bow?u.wind*0.88:u.wind*0.33;
  if(k>=0)animCombat(c,u.wk==='fist'?'melee':u.wk,u.combo,k);else if(c.userData.nock)c.userData.nock.visible=false;
  if(u.hit>0){c.userData.torso.rotation.x-=Math.sin(u.hit/0.22*Math.PI)*0.25}
  {const sk=u.strike>0?Math.sin((1-u.strike/0.32)*Math.PI):0,w=u.wind||0;u.g.position.z=sk*0.32-w*0.08;u.g.rotation.x=-w*0.06+sk*0.12;u.g.rotation.y=-w*0.25+sk*0.3}
}
function finishEnemy(m,u,dt,st,flash,slowed){const g=u.g;
  if(st===2){u.dt2=(u.dt2||0)+dt;g.rotation.z=Math.min(Math.PI/2,g.rotation.z+dt*5);g.position.y=-0.15*Math.min(1,u.dt2/0.4);}else u.dt2=0;
  if(slowed===2){if(!u.stars){u.stars=new THREE.Mesh(STARGEO||(STARGEO=boxes([[0.55,0,0,0.16,0.16,0.16,'#ffe066'],[-0.28,0.05,0.48,0.14,0.14,0.14,'#fff3a0'],[-0.28,-0.04,-0.48,0.15,0.15,0.15,'#ffd34d'],[0,0,0.55,0.08,0.08,0.08,'#ffffff']])),projMat);m.add(u.stars)}u.stars.visible=true;u.stars.position.y=u.hum?2.05:1.75;u.stars.rotation.y+=dt*5;g.rotation.z=Math.sin(u.ph*0.7)*0.12}else if(u.stars)u.stars.visible=false;
  if(slowed===1&&flash<=0)u.mat.emissive.setRGB(0.06,0.18,0.42);else if(slowed===2&&flash<=0)u.mat.emissive.setRGB(0.22,0.18,0.02);else u.mat.emissive.setScalar(Math.max(0,flash)*0.8);
}

// ---------- wrogowie: symulacja u hosta (lub solo), interpolacja u klienta ----------
const enemies=new Map(); let eSeq=1;
const spawnPt=()=>S.spawn||[0,0,0];
function playersList(){const l=[{id:NET.id,sl:P2.sleep?1:0,p:player.p,dead:P2.dead>0,lv:HERO.lvl,tb:pk('skarb')+(hasP('szczesciarz')?2:0),stl:P3.stealth>0,snk:P3.sneak}];for(const [id,r] of remotes){const b=r.buf[r.buf.length-1];if(b)l.push({id,sl:b.sl,p:{x:b.p[0],y:b.p[1],z:b.p[2]},dead:b.a===5,lv:b.lv||1,cls:b.cls,tb:b.tb||0,stl:!!b.stl,snk:!!b.snk})}return l}
const AIP={alertR:18.857,flankK:0.433,flankMax:0.787,flankR:13.398,fleeHP:0.3,fleeH:0.942,fleeA:0.515,dodgeP:0.45,circleK:0.749,backK:0.302,strafeK:0.335,kiteR:10,herdR:8.875,shyR:2.039,shySp:0.826,pasFlee:1.056,cohD:6.815,npcPad:10,npcRun:4.5};
function isAuth(){return NET.role!=='client'}
// ---- wyrzucanie przedmiotów, wspólny zapis świata, szałasy, garderoba ----
const GD=new Map();
const PID=LS.get('pid',null)||(()=>{const p='p'+Math.random().toString(36).slice(2,10);LS.set('pid',p);return p})();
function dropItemById(id){let it=null;const bi=INV.bag.findIndex(x=>x.id===id);if(bi>=0){it=INV.bag[bi];INV.bag.splice(bi,1)}else for(const k in INV.eq)if(INV.eq[k]&&INV.eq[k].id===id){it=INV.eq[k];delete INV.eq[k]}
  if(!it)return;for(let k=0;k<8;k++)if(INV.hot[k]&&INV.hot[k].id===id)INV.hot[k]=null;selItem=null;afterInv();
  const fy=player.ry,x=player.p.x+Math.sin(fy)*1.6,z=player.p.z+Math.cos(fy)*1.6;const gid=PID+':'+Date.now();spawnDrop({p:[x,player.p.y,z],items:[it],gold:0,pot:0,xp:0,dropped:1,gid});if(isAuth())GD.set(gid,1);sendFx({k:'gdrop',gid,p:[x,player.p.y,z],it,nm:S.name});toast('Wyrzucono: '+it.name+' (leży na ziemi, możesz go podnieść)',RAR[it.rar].c);sfx('swing')}
whenReady(()=>{
  const inv=$('inv');inv.addEventListener('dragover',e=>{if(!e.target.closest('.card')){e.preventDefault();inv.classList.add('dropout')}else inv.classList.remove('dropout')});
  inv.addEventListener('dragleave',e=>{if(e.target===inv)inv.classList.remove('dropout')});
  inv.addEventListener('drop',e=>{inv.classList.remove('dropout');if(e.target.closest('.card'))return;e.preventDefault();const id=e.dataTransfer.getData('text/iid');if(id)dropItemById(id)});
  document.addEventListener('dragend',()=>inv.classList.remove('dropout'));
  // wspólny zapis świata: skrzynie, oczyszczone miejsca, szałasy
  W.huts=W.huts||[];
  const wsync=()=>({k:'wsync',opened:W.opened,dig:W.dig||{},huts:W.huts,notes:W.notes||[],cl:[...strState].filter(([k,v])=>v&&v.cleared)});
  FXH.dig=m=>{};FXH.wopen=m=>{const was=W.opened[m.id];W.opened[m.id]=was||m.at||Date.now();saveW();if(was||P2.dead)return;
    for(const s of structs.values())if(s&&s.id===m.id&&s.chest&&Math.hypot(s.chest.x-player.p.x,s.chest.z-player.p.z)<45){openChest(s,m.nm||'Kompan');return}
    if(SPC&&SPC.id===m.id&&SPC.chest)openSpaceChest(SPC,m.nm||'Kompan')};
  FXH.wsync=m=>{if(isAuth())return;let ch=0;try{if(m.dig){const c=[];for(const k in m.dig){const [x,z]=k.split(',').map(Number);c.push(x,z,m.dig[k])}if(c.length)digApply(c,false)}}catch(_){}for(const k in m.opened)if(!W.opened[k]){W.opened[k]=m.opened[k];ch=1}for(const [k,v] of m.cl||[]){const o=strState.get(k);if(!o||!o.cleared||o.cleared<v.cleared)strState.set(k,v)}
    for(const n of m.notes||[])noteAdd(n,false);const mine=(W.huts||[]).filter(h=>h.pid===PID);W.huts=(m.huts||[]).filter(h=>h.pid!==PID).concat(mine);saveW();syncHuts()};
  FXH.hut=m=>{W.huts=(W.huts||[]).filter(h=>h.pid!==m.h.pid);W.huts.push(m.h);saveW();syncHuts();if(m.h.pid!==PID)toast(m.h.n+' rozbił(a) szałas','#d9a27c')};
  FXH.gdrop=m=>{if(isAuth())GD.set(m.gid,1);spawnDrop({p:m.p,items:[m.it],gold:0,pot:0,xp:0,gid:m.gid});toast(m.nm+' wyrzucił(a): '+m.it.name,RAR[m.it.rar].c)};
  const rmDrop=gid=>{const i=drops.findIndex(d=>d.L.gid===gid);if(i<0)return null;const d=drops[i];scene.remove(d.g);try{freeObj(d.g)}catch(_){}drops.splice(i,1);return d};
  window.grantDrop=d=>{const it=d.L.items[0];if(!it)return;if(INV.bag.length>=bagN()){toast('Plecak pełny – przedmiot przepadłby, zostaw miejsce','#ff8a7a');return false}INV.bag.push(it);toast('Podniesiono: '+it.name,RAR[it.rar].c);saveInv();if(invOpen())renderInv();return true};
  FXH.gpickreq=m=>{if(!isAuth()||!GD.has(m.gid))return;GD.delete(m.gid);rmDrop(m.gid);sendFx({k:'gpick',gid:m.gid,to:m.to})};
  FXH.gpick=m=>{const d=rmDrop(m.gid);if(m.to===NET.id&&d){if(!grantDrop(d)){/* pełny plecak: odłóż z powrotem */const gid=m.gid;spawnDrop({p:[player.p.x,player.p.y,player.p.z],items:d.L.items,gold:0,pot:0,xp:0,gid,dropped:1});sendFx({k:'gdrop',gid,p:[player.p.x,player.p.y,player.p.z],it:d.L.items[0],nm:S.name});if(isAuth())GD.set(gid,1)}}};
  FXH.wreq=m=>{if(isAuth()){sendFx(wsync());sendFx({k:'qall',qs:W.quests})}};
  let wsT=3,wasNet='off';TICKS.push(dt=>{if(NET.role==='off'){wasNet='off';return}if(NET.role==='client'&&wasNet!=='client'){wasNet='client';setTimeout(()=>{sendFx({k:'wreq'});W.huts=W.huts||[];for(const h of W.huts.filter(h=>h.pid===PID))sendFx({k:'hut',h});sendFx({k:'qall',qs:W.quests})},2500)}
    if(isAuth()){wasNet='host';wsT-=dt;if(wsT<=0){wsT=20;sendFx(wsync())}}});
  // szałas
  const hutM=new Map();
  window.syncHuts=function(){W.huts=W.huts||[];for(const h of W.huts){const og=hutM.get(h.id);if(og){if(og.parent!==scene)scene.add(og);continue}const g=new THREE.Group();
      // szałas: daszek z gałęzi kryty liśćmi, tylna ścianka, legowisko ze skór, ognisko w kręgu kamieni, trójnóg z kociołkiem, sągi drewna
      const B='#5a3b22',BD='#46301b',LF=['#4f6a2c','#5f7a34','#43602a','#6b8a3a'],L=[[0,2.12,-0.2,0.18,0.18,3.3,B],[0,0.06,-0.3,2.3,0.12,2.8,'#6b4a2b'],[-0.45,0.17,-0.45,0.85,0.1,1.9,'#8a6a4a'],[0.45,0.17,-0.45,0.85,0.1,1.9,'#cfc4b0'],[0.45,0.27,-1.15,0.6,0.14,0.36,'#e8dcc0'],[-0.45,0.25,0.35,0.7,0.06,0.3,'#6a4a32'],
        [0,0.3,-1.7,2.7,0.6,0.14,BD],[0,0.9,-1.7,2.0,0.6,0.14,LF[2]],[0,1.5,-1.7,1.2,0.6,0.14,LF[0]],[0,1.95,-1.7,0.5,0.3,0.14,LF[1]],
        [1.05,0.7,-0.9,0.36,0.5,0.3,'#7a5a3a'],[1.05,1.0,-0.9,0.3,0.12,0.26,'#5a4028'],[-1.0,0.5,-1.2,0.16,0.3,0.16,'#c9a24a'],[-1.0,0.68,-1.2,0.1,0.06,0.1,'#ffe08a']];
      for(let k=0;k<7;k++){const a=k/7*Math.PI*2;L.push([Math.cos(a)*0.55,0.1,1.95+Math.sin(a)*0.55,0.26,0.2,0.24,k%2?'#7c7a76':'#6a6864'])}
      L.push([0,0.2,1.95,0.9,0.14,0.14,'#4a2f1d'],[0,0.24,1.95,0.14,0.14,0.9,'#3a2414'],[0,0.12,1.95,0.6,0.06,0.6,'#2a1a10']);
      for(const [x,z] of [[-0.55,1.55],[0.55,1.55],[0,2.5]])L.push([x*0.7,0.75,1.95+(z-1.95)*0.7,0.07,1.5,0.07,B]);L.push([0,1.42,1.95,0.08,0.4,0.04,'#2a2a2e'],[0,1.05,1.95,0.42,0.32,0.42,'#3a3a40'],[0,1.24,1.95,0.46,0.06,0.46,'#2a2a2e']);
      for(let k=0;k<3;k++)for(let m=0;m<3-k;m++)L.push([1.85,0.13+k*0.24,0.4+m*0.26+k*0.13,0.7,0.22,0.22,m%2?'#8a6a3a':'#7a5a30']);
      g.add(new THREE.Mesh(boxes(L),decoMat));
      const side=[[0.98,0,-0.2,1.96,0.12,3.3,LF[0]],[0.35,0.1,-0.2,0.6,0.1,3.35,LF[1]],[0.95,0.1,-0.25,0.55,0.1,3.3,LF[3]],[1.55,0.1,-0.15,0.55,0.1,3.35,LF[2]],[1.96,0.04,-0.2,0.2,0.16,3.4,LF[1]],[0.98,-0.12,1.35,2.0,0.12,0.12,B],[0.98,-0.12,-1.6,2.0,0.12,0.12,B],[0.98,-0.12,-0.1,2.0,0.1,0.1,BD]];
      for(let k=0;k<6;k++)side.push([0.3+k*0.3,0.17,-1.2+((k*7)%5)*0.5,0.22,0.06,0.3,LF[k%4]]);const sg=boxes(side);
      for(const sx of [1,-1]){const r=new THREE.Group();r.position.set(0,2.12,0);r.rotation.z=-0.86*sx;const me=new THREE.Mesh(sg,decoMat);me.scale.x=sx;r.add(me);g.add(r)}
      const fl=new THREE.Mesh(boxes([[0,0.42,1.95,0.42,0.36,0.42,'#ff8a2e'],[0.06,0.66,1.92,0.24,0.3,0.24,'#ffb84d'],[-0.04,0.84,1.97,0.12,0.2,0.12,'#ffe08a']]),new THREE.MeshBasicMaterial({vertexColors:true}));g.add(fl);g.userData.fl=fl;
      g.add(nameTag('Szałas · '+h.n,'#d9a27c'));g.children[g.children.length-1].position.y=3.2;
      g.position.set(h.x,h.y,h.z);g.rotation.y=h.ry;g.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(g);hutM.set(h.id,g)}
    for(const [id,g] of hutM)if(!W.huts.some(h=>h.id===id)){scene.remove(g);hutM.delete(id)}};
  syncHuts();
  window.buildHut=function(){if(SPC||P2.dead||VH.mode)return toast('Nie możesz tu rozbić szałasu','#ff8a7a');const fy=player.ry,x=player.p.x+Math.sin(fy)*3.2,z=player.p.z+Math.cos(fy)*3.2,h=colAt(x,z);
    if(h===null||h<WATER+0.3)return toast('Tu jest za mokro na szałas','#ff8a7a');if(inVillage(x,z,10))return toast('W osadzie śpij w karczmie – szałas rozbij poza nią','#ff8a7a');
    for(const [a,b] of [[1.4,1.4],[-1.4,1.4],[1.4,-1.4],[-1.4,-1.4]]){const q=colAt(x+a,z+b);if(q===null||Math.abs(q-h)>1.3)return toast('Teren jest za nierówny','#ff8a7a')}
    if(enemies.size&&[...enemies.values()].some(e=>!e.pas&&e.st!==2&&Math.hypot(e.p.x-x,e.p.z-z)<18))return toast('Wrogowie są za blisko','#ff8a7a');
    const hut={id:PID+':'+Date.now(),pid:PID,n:S.name,x,y:h,z,ry:fy+Math.PI};W.huts=(W.huts||[]).filter(q=>q.pid!==PID);W.huts.push(hut);saveW();syncHuts();sendFx({k:'hut',h:hut});setHome(hut);toast('Rozbito szałas. To twój nowy punkt odrodzenia.','#d9a27c');sfx('door')};
  window.setHome=function(h){LS.set("home_"+S.seed,[h.x+Math.sin(h.ry)*3.1,h.y+0.5,h.z+Math.cos(h.ry)*3.1])};
  // sen
  const night=()=>hour>=19.5||hour<5.8;let nearHut=null;
  TICKS.push(dt=>{nearHut=null;if(!SPC)for(const h of W.huts)if(Math.hypot(h.x-player.p.x,h.z-player.p.z)<3.2&&Math.abs(h.y-player.p.y)<2.5){nearHut=h;break}
    for(const g of hutM.values()){g.userData.fl.scale.y=0.85+Math.sin(performance.now()/90+g.position.x)*0.15}
    const pr=$('prompt');
    if(P2.sleep){if(P2.dead||keys.has('KeyW')||keys.has('KeyA')||keys.has('KeyS')||keys.has('KeyD')||keys.has('Space')){wake('Obudziłeś się.')}else{P2.hp=Math.min(ST.hp,P2.hp+ST.hp*0.08*dt);
      const all=playersList().filter(p=>!p.dead),sl=all.filter(p=>p.id===NET.id?P2.sleep:p.sl).length;$('sleepov').hidden=false;$('sleeptx').textContent=night()?(sl<all.length?`Czekasz, aż zasną wszyscy (${sl}/${all.length})…`:'Śpisz… noc mija'):'Świta!';
      if(isAuth()&&sl===all.length&&night())hour=(hour+dt*2.4)%24;if(!night()){wake('Dzień dobry! Wypoczęty.');P2.hp=ST.hp}}return}
    if(nearHut&&!nearNpc&&!dlg&&!nearDoor){pr.hidden=false;pr.innerHTML=night()?'<kbd>F</kbd> Prześpij noc w szałasie':'<kbd>F</kbd> Ustaw punkt odrodzenia (szałas)'}});
  window.wake=function(t){P2.sleep=false;$('sleepov').hidden=true;if(t)toast(t,'#ffd34d')};
  window.hutAct=function(){if(!nearHut)return false;setHome(nearHut);if(night()){if([...enemies.values()].some(e=>!e.pas&&e.st!==2&&Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z)<22)){toast('Nie zaśniesz, wrogowie są w pobliżu!','#ff8a7a');return true}
      P2.sleep=true;player.v.set(0,0,0);toast('Kładziesz się spać… (ruch budzi)','#cfe8ff')}else toast('Punkt odrodzenia ustawiony przy szałasie','#d9a27c');return true};
},0);
setTimeout(()=>{if(LS.get('helpmin',false))$('help').classList.add('min');else setTimeout(()=>{$('help').classList.add('min')},innerHeight<760||innerWidth<1100?15000:60000)},0);
// ---- pogoda, fale, życie w mieście ----
whenReady(()=>{
  FXH.arstart=m=>{let s=SPACES.get(m.sid)||null;if(!s){const v=villages.get(m.vid),h=v&&v.houses.find(q=>q.func==='arena');if(h)s=genArena(h,v)}if(s&&isAuth())arenaStart(s)};FXH.armsg=m=>{toast(m.txt,'#ffd34d')};FXH.arrew=m=>{AR.cur=m.w;if(SPC&&SPC.kind==='arena')arenaGive(m.w)};FXH.lever=m=>{const s=SPACES.get(m.sid);if(s)pullLever(s,m.i,1)};FXH.gate=m=>{const s=SPACES.get(m.sid);if(s)openGate(s,1)};FXH.wx=m=>{if(m.w!==WX.k){WX.k=m.w;toast('Pogoda: '+WXN[WX.k],'#cfe8ff')}};FXH.thun=m=>{WX.flash=1;setTimeout(()=>sfx('thunder'),400+Math.random()*900)};
  const NR=1600,rg=new THREE.BufferGeometry(),rp=new Float32Array(NR*6);rg.setAttribute('position',new THREE.BufferAttribute(rp,3));const rain=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xaabfd8,transparent:true,opacity:0.45,fog:false}));rain.frustumCulled=false;scene.add(rain);
  const NS=1400,sg=new THREE.BufferGeometry(),sp=new Float32Array(NS*3);sg.setAttribute('position',new THREE.BufferAttribute(sp,3));const snow=new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:0.18,transparent:true,opacity:0.9,fog:false}));snow.frustumCulled=false;scene.add(snow);
  const RB=36,RH=26;for(let i=0;i<NR;i++){rp[i*6]=(Math.random()-0.5)*RB*2;rp[i*6+1]=Math.random()*RH;rp[i*6+2]=(Math.random()-0.5)*RB*2}for(let i=0;i<NS;i++){sp[i*3]=(Math.random()-0.5)*RB*2;sp[i*3+1]=Math.random()*RH;sp[i*3+2]=(Math.random()-0.5)*RB*2}
  const pickW=()=>{const r=Math.random(),win=season===2;if(hour>4&&hour<8.5&&r<0.35)return 'mgla';if(r<0.42)return 'jasno';if(r<0.6)return win?'snieg':'deszcz';if(r<0.65)return win?'snieg':'burza';if(r<0.84)return 'mgla';return 'jasno'};
  let ox=0,oz=0;
  TICKS.push(dt=>{const t=performance.now()/1000;WATER_U.uT.value=t;WATER_U.uSky.value.copy(SKYC);
    if(isAuth()){WX.t-=dt;WX.sync-=dt;if(WX.t<=0){const nw=pickW();WX.t=nw==='jasno'?rnd(150,300):rnd(90,200);if(nw!==WX.k){WX.k=nw;toast('Pogoda: '+WXN[nw],'#cfe8ff');WX.sync=0}}if(WX.sync<=0){WX.sync=15;sendFx({k:'wx',w:WX.k})}
      if(WX.k==='burza'&&WX.i>0.6){WX.thT-=dt;if(WX.thT<=0){WX.thT=rnd(40,90);WX.flash=1;setTimeout(()=>sfx('thunder'),400+Math.random()*900);sendFx({k:'thun'})}}}
    WX.flash=Math.max(0,WX.flash-dt*3.5);
    const tgt=WX.k==='jasno'?0:1;WX.i+=(tgt-WX.i)*Math.min(1,dt*0.25);
    const p=camera.position,b=biomeAt(player.p.x,player.p.z),dry=b===4||b===8,cold=season===2||b===5||(b===6&&player.p.y>WATER+34);
    const wet=(WX.k==='deszcz'||WX.k==='burza'||WX.k==='snieg')&&!SPC&&!dry,isSnow=wet&&(cold||WX.k==='snieg'),isRain=wet&&!isSnow,amt=WX.i*(WX.k==='burza'?1:0.7);
    SEAS_U.uWet.value+=((isRain?WX.i*0.9:0)-SEAS_U.uWet.value)*Math.min(1,dt*0.15);
    rain.visible=isRain&&amt>0.05;snow.visible=isSnow&&amt>0.05;
    if(rain.visible){const n=Math.floor(NR*amt),sl=WX.k==='burza'?0.18:0.06;for(let i=0;i<NR;i++){const k=i*6;if(i>=n){rp[k+1]=-999;rp[k+4]=-999;continue}let x=rp[k],y=rp[k+1],z=rp[k+2];if(y<-500)y=Math.random()*RH;y-=dt*(26+(i%5));x+=dt*sl*30;
        if(y<0){y+=RH;x=(Math.random()-0.5)*RB*2;z=(Math.random()-0.5)*RB*2}if(x>RB)x-=RB*2;rp[k]=x;rp[k+1]=y;rp[k+2]=z;rp[k+3]=x-sl*1.2;rp[k+4]=y+1.1;rp[k+5]=z}rain.position.set(p.x,p.y-8,p.z);rg.attributes.position.needsUpdate=true}
    if(snow.visible){const n=Math.floor(NS*amt);for(let i=0;i<NS;i++){const k=i*3;if(i>=n){sp[k+1]=-999;continue}let y=sp[k+1];if(y<-500)y=Math.random()*RH;y-=dt*(2.2+(i%4)*0.4);sp[k]+=Math.sin(t*0.8+i)*dt*0.6;if(y<0){y+=RH;sp[k]=(Math.random()-0.5)*RB*2;sp[k+2]=(Math.random()-0.5)*RB*2}sp[k+1]=y}snow.position.set(p.x,p.y-8,p.z);sg.attributes.position.needsUpdate=true}});
  // życie w mieście: straże na murach, biegające dzieci
  TICKS.push(dt=>{for(const v of villages.values()){if(!v||!v.city||!v.g)continue;
      if(v.life){const a=v.life.g[0]||v.life.k[0];if(a&&a.m.parent!==v.g)v.life=null}
      if(!v.life){v.life={g:[],k:[]};const r=rngOf('life'+v.id),WK={ludzie:[-0.5,0.5],niziolki:[-0.5,0.5],krasnoludy:[0.02,0.6],orkowie:[-2.07,1.1],saurianie:[-2.07,1.1]}[v.race];/* elfy/drowy: mur z liściastym daszkiem bez chodnika — bez straży na murach */if(WK)(v.wsegs||[]).forEach(([x,z,len,th2,top,ang],si)=>{if(len<8||si%3)return;const gi=0;
          const R=RACES[v.race]||RACES.ludzie,o=makeNpc({id:v.id+':wg'+v.life.g.length,vid:v.id,race:v.race,role:'straz',fem:false,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth)});o.userData.g.userData.noVox=1;v.g.add(o);v.life.g.push({m:o,a:o.userData.g,x,z,ang,len,top,wy:WK[0],wi:WK[1],ph:gi+r()*0.8,sp:1.1+r()*0.4})});
        for(let i=0;i<3+Math.floor(r()*3);i++)v.life.k.push(Object.assign(kidChar(v,r,i),{a:r()*6.28,r:6+r()*5,sp:(r()<0.5?1:-1)*(0.35+r()*0.25),cx:v.x+(r()-0.5)*6,cz:v.z+(r()-0.5)*6,ph:r()*9}))}
      if(Math.hypot(v.x-player.p.x,v.z-player.p.z)>140)continue;
      // straż patroluje mury: marsz tam i z powrotem (~1,3 m/s), krótki postój i rozglądanie się na końcach odcinka
      for(const q of v.life.g){const L=Math.max(2,q.len-5),cyc=2*L/q.sp+6,tt=((worldT+q.ph*cyc/2)%cyc+cyc)%cyc;let a,dir,stop=false;const T1=L/q.sp;
        if(tt<T1){a=-L/2+tt*q.sp;dir=1}else if(tt<T1+3){a=L/2;dir=1;stop=true}else if(tt<2*T1+3){a=L/2-(tt-T1-3)*q.sp;dir=-1}else{a=-L/2;dir=-1;stop=true}
        const ux=Math.cos(q.ang),uz=-Math.sin(q.ang),nx=Math.sin(q.ang),nz=Math.cos(q.ang),x=q.x+ux*a-nx*q.wi,z=q.z+uz*a-nz*q.wi;q.m.position.set(x,q.top+q.wy,z);
        {const fx=Math.abs(x-player.p.x),fz=Math.abs(z-player.p.z);q.m.visible=fx<120&&fz<120;npcLOD(q,fx>26||fz>26)}
        if(stop){q.m.rotation.y=q.ang+Math.sin(worldT*0.8+q.ph)*0.6;if(!q._impOn)animChar(q.a||q.m,0,dt,false,false)}else{q.m.rotation.y=Math.atan2(ux*dir,uz*dir);if(!q._impOn)animChar(q.a||q.m,q.sp,dt,false,false)}}
      {const hk=hour>=20.5||hour<6||v._dg;for(const k of v.life.k)k.m.visible=!hk}
      for(const k of v.life.k){k.ph+=dt;const run=Math.sin(k.ph*0.3)>-0.4;if(run)k.a+=dt*k.sp*(5/k.r);const x=k.cx+Math.cos(k.a)*k.r,z=k.cz+Math.sin(k.a)*k.r;let h=villageGround(x,z,999);if(h===null)h=colAt(x,z);k.m.position.set(x,(h??v.h)+(run?Math.abs(Math.sin(k.ph*9))*0.12:0),z);k.m.rotation.y=Math.atan2(-Math.sin(k.a)*k.sp,Math.cos(k.a)*k.sp);animChar(k.g||k.m,run?3.2:0,dt,false,false)}}});
  // dzieci w wioskach (rasy osady)
  TICKS.push(dt=>{for(const v of villages.values()){if(!v||v.city||v.small||v.wander||!v.g)continue;if(v.kids&&v.kids.length&&v.kids[0].m.parent!==v.g)v.kids=null;if(!v.kids){const r=rngOf('vkid'+v.id);v.kids=[];const n=r()<0.25?0:1+Math.floor(r()*3);for(let i=0;i<n;i++)v.kids.push(Object.assign(kidChar(v,r,i),{a:r()*6.28,r:4+r()*4,sp:(r()<0.5?1:-1)*(0.3+r()*0.25),cx:v.x+(r()-0.5)*4,cz:v.z+(r()-0.5)*4,ph:r()*9}))}
    if(Math.hypot(v.x-player.p.x,v.z-player.p.z)>110)continue;const hk=hour>=20.5||hour<6||v._dg;
    for(const k of v.kids){k.m.visible=!hk;if(hk)continue;k.ph+=dt;const run=Math.sin(k.ph*0.3)>-0.4;if(run)k.a+=dt*k.sp*(5/k.r);const x=k.cx+Math.cos(k.a)*k.r,z=k.cz+Math.sin(k.a)*k.r;let h=villageGround(x,z,999);if(h===null)h=colAt(x,z);k.m.position.set(x,(h??v.h)+(run?Math.abs(Math.sin(k.ph*9))*0.12:0),z);k.m.rotation.y=Math.atan2(-Math.sin(k.a)*k.sp,Math.cos(k.a)*k.sp);animChar(k.g,run?3.2:0,dt,false,false)}}});
},0);
// ---- co-op: znaczniki, podnoszenie kompana ----
whenReady(()=>{
  FXH.mark=m=>{MARKS.set('p'+m.id,{x:m.x,z:m.z,n:m.n,col:m.col,t:180});toast(m.n+' postawił(a) znacznik na mapie',m.col)};
  FXH.unmark=m=>{MARKS.delete('p'+m.id)};
  FXH.rev=m=>{if(m.to!==NET.id||!(P2.dead>0))return;try{document.getElementById('revui').style.display='none'}catch(_){}meRef&&(meRef.rotation.z=0);P2.dead=0;P2.down=0;P2.hp=ST.hp*0.5;P2.iframe=2;$('dead').hidden=true;toast('Podniósł cię: '+m.nm+'!','#7dd87d');sfx('lvl')};
  /* v141: znacznik wydarzenia podąża za tym, czego dotyczy (karawana, bohater, wędrowny kupiec) i znika, gdy tego już nie ma */
  TICKS.push(()=>{const mk=MARKS.get('evt');if(!mk)return;const c=EVT&&EVT.cur;let id=mk.eid;if(!id&&c&&!c.done&&c.kind==='karawana')id=c.eid;
    if(id!=null){const e=enemies.get(id);if(!e||e.st===2){if(isAuth()||!NET.tr){MARKS.delete('evt')}return}mk.x=e.p.x;mk.z=e.p.z;return}
    if(c&&c.kind==='kupiec'&&c.wid){const v=villages.get(c.wid);if(!v){MARKS.delete('evt');return}const n=v.npcs&&v.npcs[0];if(n){mk.x=n.x;mk.z=n.z}return}
    if(!c||c.done){if(!mk.t)mk.t=20}});
  const beams=new Map(),bGeo=new THREE.CylinderGeometry(0.35,0.35,60,8,1,true);
  TICKS.push(dt=>{for(const [k,mk] of MARKS){if(mk.t!=null){mk.t-=dt;if(mk.t<=0){MARKS.delete(k);continue}}let b=beams.get(k);if(!b){b=new THREE.Mesh(bGeo,new THREE.MeshBasicMaterial({color:mk.col,transparent:true,opacity:0.35,depthWrite:false,fog:false}));scene.add(b);beams.set(k,b)}
      b.material.color.set(mk.col);const h=colAt(mk.x,mk.z);b.position.set(mk.x,(h??player.p.y)+30,mk.z);b.visible=!SPC;b.material.opacity=0.25+Math.sin(performance.now()/300)*0.08}
    for(const [k,b] of beams)if(!MARKS.has(k)){scene.remove(b);b.material.dispose();beams.delete(k)}});
  // podnoszenie kompana: przytrzymaj F, duży pasek postępu na środku ekranu (widzi go też podnoszony), potwierdzenie wysyłane kilka razy
  let rv=0,rvSent=0;const revUI=(show,pct,txt)=>{let el=document.getElementById('revui');if(!el){el=document.createElement('div');el.id='revui';el.innerHTML='<div class="rt"></div><div class="rb"><i></i></div>';document.body.appendChild(el)}el.style.display=show?'block':'none';if(show){el.querySelector('.rt').textContent=txt;el.querySelector('i').style.width=Math.round(pct*100)+'%'}};
  FXH.revp=m=>{if(m.to!==NET.id||!(P2.dead>0))return;window.__revpT=performance.now();revUI(m.p>0,m.p,(m.nm||'Kompan')+' podnosi cię…')};
  TICKS.push(dt=>{if(P2.dead>0){$('deadt').textContent=Math.ceil(Math.max(0,P2.dead));if(window.__revpT&&performance.now()-window.__revpT>700)revUI(false);return}let tgt=null;for(const [id,r] of remotes){const b=r.buf[r.buf.length-1];if(b&&b.a===5){const gx=r.g?r.g.position.x:b.p[0],gz=r.g?r.g.position.z:b.p[2];if(Math.hypot(gx-player.p.x,gz-player.p.z)<3.6&&Math.abs(b.p[1]-player.p.y)<3.5){tgt=[id,r];break}}}
    const pr=$('prompt');if(!tgt){if(rv>0||window.REVT)revUI(false);rv=0;window.REVT=0;return}
    if(keys.has('KeyF')){rv+=dt;window.REVT=1}else{rv=Math.max(0,rv-dt*1.5);window.REVT=rv>0?1:0}
    pr.hidden=false;pr.innerHTML='Przytrzymaj <kbd>F</kbd>, aby podnieść: <b></b>';pr.querySelector('b').textContent=tgt[1].name;
    revUI(rv>0,Math.min(1,rv/2.5),'Podnoszenie: '+tgt[1].name);rvSent-=dt;if(rv>0&&rvSent<=0){rvSent=0.15;sendFx({k:'revp',to:tgt[0],p:Math.min(1,rv/2.5),nm:S.name})}
    if(rv>=2.5){rv=0;window.REVT=0;revUI(false);const msg={k:'rev',to:tgt[0],nm:S.name};sendFx(msg);setTimeout(()=>sendFx(msg),250);setTimeout(()=>sendFx(msg),700);toast('Podnosisz: '+tgt[1].name,'#7dd87d');sfx('lvl')}});
  $('deadnow').onclick=()=>{if(P2.dead>0)respawn()};
},0);
const MARKS=new Map(),FXH={},TICKS=[];setTimeout(()=>TICKS.push(dt=>PFX.tick(dt)),0);
const SKYDOME=(()=>{const mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,depthTest:false,fog:false,uniforms:{uH:{value:new THREE.Color(0x9cc7e6)},uZ:{value:new THREE.Color(0x4a7ac8)},uS:{value:new THREE.Vector3(0,1,0)},uSC:{value:new THREE.Color(0xfff0c0)}},
  vertexShader:'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform vec3 uH;uniform vec3 uZ;uniform vec3 uS;uniform vec3 uSC;varying vec3 vD;void main(){vec3 d=normalize(vD);float h=clamp(d.y,0.0,1.0);vec3 c=mix(uH,uZ,pow(h,0.5));float s=max(dot(d,normalize(uS)),0.0);c+=uSC*(pow(s,90.0)*1.2+pow(s,8.0)*0.22);if(d.y<0.0)c=uH;gl_FragColor=vec4(c,1.0);}'});
  const m=new THREE.Mesh(new THREE.SphereGeometry(1,32,16),mat);m.renderOrder=-10;m.frustumCulled=false;scene.add(m);return{m,mat}})();
setTimeout(()=>TICKS.push(dt=>{const U=SKYDOME.mat.uniforms;SKYDOME.m.position.copy(camera.position);SKYDOME.m.scale.setScalar(camera.far*0.85);U.uH.value.copy(scene.fog.color);
  const br=(SKYC.r+SKYC.g+SKYC.b)/3;U.uZ.value.copy(SKYC).multiplyScalar(0.62).lerp(new THREE.Color(0.18*br*2,0.36*br*2,0.82*br*1.6),0.45);U.uS.value.copy(SV);U.uSC.value.setRGB(1,0.92,0.72).multiplyScalar(Math.min(1,br*1.6)*(1-WX.i*0.7));
  SKYDOME.m.visible=!SPC&&player.p.y>=WATER-1.15}),0);
function evMsg(txt,col,mk){toast(txt,col);if(mk)MARKS.set('evt',{x:mk[0],z:mk[1],n:mk[2],col:'#ffd34d',evt:1});else MARKS.delete('evt');sendFx({k:'evt',txt,col,mk:mk||null})}
const EVT={cur:null,next:150};
function evPlayers(x,z,r){return playersList().filter(p=>Math.hypot(p.p.x-x,p.p.z-z)<r)}
function evReward(c,x,z,r){for(const p of evPlayers(x,z,r)){const gold=Math.round(c.lvl*22+40),xp=Math.round(c.lvl*70+80),txt='Nagroda za wydarzenie „'+c.name+'”';if(p.id===NET.id)giveEvReward(gold,xp,txt);else sendFx({k:'evrw',to:p.id,gold,xp,txt})}}
function giveEvReward(gold,xp,txt){INV.gold+=gold;gainXp(xp);saveInv();updHud();toast(txt+': +'+gold+' zł','#ffd34d');sfx('coin');if(Math.random()<0.6){const it=genItem(HERO.lvl,30);if(INV.bag.length<bagN()){INV.bag.push(it);saveInv();toast('Otrzymano: '+it.name,RAR[it.rar].c)}}}
function evLvl(x,z){const sp=spawnPt();return Math.max(1,1+Math.floor(Math.hypot(x-sp[0],z-sp[2])/260))}
function nearVillage(x,z,maxd,skip){let best=null,bd=maxd;for(const v of villages.values()){if(!v||v===skip||v.wander)continue;const d=Math.hypot(v.x-x,v.z-z);if(d<bd){bd=d;best=v}}return best}
function startEvent(kind,pp){
  if(kind==='napad'){const v=nearVillage(pp.p.x,pp.p.z,170);if(!v)return false;const a=Math.random()*6.283,x=v.x+Math.cos(a)*55,z=v.z+Math.sin(a)*55,h=colAt(x,z);if(h===null||h<WATER)return false;
    const lvl=evLvl(v.x,v.z),kinds=['bandyta','ork','bandyta','ork','szaman','bandyta','ork','kusznik','bandyta','ork'].filter(k=>EDEF[k]),np=evPlayers(v.x,v.z,220).length,allMem=[],groups=v.city?3:2,per=6+Math.min(4,np*2);
    for(let gi=0;gi<groups;gi++){const a2=a+gi*(Math.PI*2/groups)+rnd(-0.3,0.3),gx=v.x+Math.cos(a2)*55,gz=v.z+Math.sin(a2)*55,gh=colAt(gx,gz);if(gh===null||gh<WATER)continue;const id=bandSeq++,B={id,tx:v.x,tz:v.z,t:99,mem:[],raid:[v.x,v.z]};BANDS.set(id,B);
      for(let i=0;i<per;i++){const xx=gx+rnd(-3,3),zz=gz+rnd(-3,3),hh=colAt(xx,zz);if(hh===null)continue;const kk=kinds[(i+gi)%kinds.length];const e=makeE(kk,lvl,i===0,xx,hh,zz,{band:id,evt:1,torch:HUM[kk]&&i%2===0,bo:[(i%3-1)*1.8,-Math.floor(i/3)*1.8-(i?1.4:0)]});B.mem.push(e.id);allMem.push(e.id)}}
    if(!allMem.length)return false;
    EVT.cur={kind,name:'Napad na '+(v.name||'osadę'),t:300,lvl,mem:allMem,vx:v.x,vz:v.z};evMsg('⚔ Bandyci napadają na: '+(v.name||'osadę')+'! Obroń mieszkańców.','#ff9d6b',[v.x,v.z,'Napad']);return true}
  if(kind==='karawana'){const A=nearVillage(pp.p.x,pp.p.z,140);if(!A)return false;const B2=nearVillage(A.x,A.z,420,A);if(!B2||Math.hypot(B2.x-A.x,B2.z-A.z)<90)return false;
    const dx=B2.x-A.x,dz=B2.z-A.z,l=Math.hypot(dx,dz),x=A.x+dx/l*14,z=A.z+dz/l*14,h=colAt(x,z);if(h===null)return false;const lvl=evLvl(A.x,A.z);
    const e=makeE('woz',lvl,false,x,h,z,{pas:1,evt:1,car:{tx:B2.x,tz:B2.z,sx:x,sz:z,amb:null,best:1e9,stuck:0}});
    EVT.cur={kind,name:'Karawana do: '+(B2.name||'osady'),t:420,lvl,eid:e.id,tx:B2.x,tz:B2.z};evMsg('🐎 Kupiecka karawana wyrusza z: '+(A.name||'osady')+' do: '+(B2.name||'osady')+'. Eskortuj ją!','#7dd87d',[x,z,'Karawana']);return true}
  if(kind==='jarmark'||kind==='turniej'||kind==='oblezenie'){let cty=null,bd=kind==='oblezenie'?260:600;for(const v of villages.values()){if(!v||!v.city||v.wander||!v.Hs)continue;const dd=Math.hypot(v.x-pp.p.x,v.z-pp.p.z);if(dd<bd){bd=dd;cty=v}}if(!cty)return false;const lvl=evLvl(cty.x,cty.z);
    if(kind==='jarmark'){const until=Date.now()+420000;fairShow({cid:cty.id,until});sendFx({k:'fair',cid:cty.id,until});
      const ids=[];for(const i of [1,4,6]){const [x,z,ry]=mktSlot(cty,i);const d={id:'wk'+Math.floor(Math.random()*1e9),x,z,h:cty.h,ry,inCity:cty.id,b:biomeAt(x,z),lvl};addWanderer(d);sendFx({k:'wkup',d});ids.push(d.id)}
      EVT.cur={kind,name:'Jarmark w: '+(cty.name||'mieście'),t:420,wids:ids};evMsg('🎪 W mieście '+(cty.name||'')+' trwa jarmark! Kramy z rzadkimi towarami, ceny niższe o 20%.','#ffd34d',[cty.x,cty.z,'Jarmark']);return true}
    if(kind==='turniej'){const h=cty.houses.find(q=>q.func==='arena');if(!h)return false;const until=Date.now()+480000;TOURN.until=until;TOURN.vid=cty.id;sendFx({k:'tourn',vid:cty.id,until});
      EVT.cur={kind,name:'Turniej w: '+(cty.name||'mieście'),t:480};evMsg('🏆 Turniej na arenie w mieście '+(cty.name||'')+'! Podwójne nagrody za fale, łupy co 3 fale, nagroda dla zwycięzcy 5. fali.','#ffd34d',[h.x,h.z,'Turniej']);return true}
    if(kind==='oblezenie'){const Hs=cty.Hs,dirs=[[0,-1],[0,1],[-1,0],[1,0]],okS=dirs.map((q,i)=>i).filter(i=>{const [ax,az]=dirs[i];for(const r of [3.5,9,16,24,30]){const h=colAt(cty.x+ax*(Hs+r),cty.z+az*(Hs+r));if(h===null||h<WATER||Math.abs(h-cty.h)>2.5)return false}return true});if(!okS.length)return false;const side=pick(okS),[dx,dz]=dirs[side],gx=cty.x+dx*(Hs+30),gz=cty.z+dz*(Hs+30);if(colAt(gx,gz)===null||colAt(gx,gz)<WATER)return false;
      const kinds=['ork','bandyta','ork','troll','szaman','ork','kusznik','bandyta'].filter(k=>EDEF[k]),np=evPlayers(cty.x,cty.z,300).length,mem=[],allies=[];
      for(let gi=0;gi<3;gi++){const ox=-dz*(gi-1)*12,oz=dx*(gi-1)*12,id=bandSeq++,fx=cty.x+dx*(Hs+9)+ox*0.5,fz=cty.z+dz*(Hs+9)+oz*0.5,B={id,tx:fx,tz:fz,t:99,mem:[],raid:[fx,fz]};BANDS.set(id,B);
        for(let i=0;i<5+np*2;i++){const xx=gx+ox+rnd(-3,3),zz=gz+oz+rnd(-3,3),hh=colAt(xx,zz);if(hh===null)continue;const kk=kinds[(i+gi)%kinds.length];const e=makeE(kk,lvl+1,i===0,xx,hh,zz,{band:id,evt:1,torch:HUM[kk]&&i%2===0,bo:[(i%3-1)*1.8,-Math.floor(i/3)*1.8-(i?1.4:0)]});B.mem.push(e.id);mem.push(e.id)}}
      for(let i=0;i<8;i++){const lat=(i-3.5)*2.6,xx=cty.x+dx*(Hs+3.5)-dz*lat,zz=cty.z+dz*(Hs+3.5)+dx*lat,hh=colAt(xx,zz);if(hh===null)continue;const g=makeE('straznik',lvl+1,i%4===0,xx,hh,zz,{evt:1});g.post=[xx,zz];g.ry=Math.atan2(dx,dz);allies.push(g.id)}
      if(!mem.length)return false;EVT.cur={kind,name:'Oblężenie: '+(cty.name||'miasto'),t:420,lvl,mem,allies,vx:cty.x,vz:cty.z};
      evMsg('🏰 Armia najeźdźców atakuje mury miasta '+(cty.name||'')+'! Straż wychodzi na mury — walcz u ich boku!','#ff9d6b',[gx,gz,'Oblężenie']);try{sfx('roar',0.5);sfx('bell',0.8)}catch(_){}return true}}
  if(kind==='kupiec'){// wędrowny kupiec rozkłada kram tylko na targu najbliższego miasta
    let cty=null,bd=700;for(const v of villages.values()){if(!v||!v.city||v.wander)continue;const dd=Math.hypot(v.x-pp.p.x,v.z-pp.p.z);if(dd<bd){bd=dd;cty=v}}if(!cty)return false;
    for(const v of villages.values())if(v&&v.wander&&v.inCity===cty.id)return false;
    const [x,z,ry]=mktSlot(cty,6);let h=cty.h;try{const c=colAt(x,z);if(c!==null)h=c}catch(_){}
    const d={id:'wk'+Math.floor(Math.random()*1e9),x,z,h,ry,inCity:cty.id,b:biomeAt(x,z),lvl:evLvl(x,z)};addWanderer(d);sendFx({k:'wkup',d});EVT.cur={kind,name:'Wędrowny kupiec',t:420,wid:d.id,done:false};
    evMsg('💰 Na targu w mieście '+(cty.name||'')+' rozłożył kram wędrowny kupiec z rzadkimi towarami!','#ffd34d',[x,z,'Kupiec']);return true}
  return false}
const FAIR={until:0,cid:null,g:null},TOURN={until:0,vid:null};
setTimeout(()=>{FXH.tourn=m=>{TOURN.until=m.until;TOURN.vid=m.vid};FXH.fair=fairShow},0);
function fairShow(m){FAIR.until=m.until;FAIR.cid=m.cid;if(FAIR.g){scene.remove(FAIR.g);freeObj(FAIR.g);FAIR.g=null}const c=villages.get(m.cid);if(!c)return;
  const L=[],P=(x,y,z,w,h,d,col)=>L.push([x,y,z,w,h,d,col]),CL=['#c8302a','#e8c040','#3a7ac0','#5a9a4a','#e8e2cc','#a83a8a'];
  for(let i=0;i<8;i++){if(i===1||i===4||i===6)continue;const a=MKT_A[i],x=Math.cos(a)*(MKT_R+0.5),z=Math.sin(a)*(MKT_R+0.5),c1=CL[i%CL.length],c2='#f2ead8';// kram z pasiastą markizą
    for(const [ox,oz] of [[-1,-0.7],[1,-0.7],[-1,0.7],[1,0.7]])P(x+ox,1.1,z+oz,0.12,2.2,0.12,'#6b4a2b');P(x,0.85,z,2.1,0.1,1.5,'#8a6a44');P(x,0.5,z,2,0.7,0.08,'#6b4a2b');
    for(let k=0;k<5;k++)P(x-0.9+k*0.45,2.3,z,0.45,0.08,1.8,k%2?c1:c2);for(let k=0;k<3;k++)P(x-0.6+k*0.6,1.02,z+0.2,0.3,0.2,0.3,CL[(i+k+2)%CL.length])}
  for(let k=0;k<4;k++){const a=k*Math.PI/2+0.4;for(let t=0;t<14;t++){const r=3+t*0.62,sag=Math.sin(t/13*Math.PI)*0.6;P(Math.cos(a)*r,4.6-sag,Math.sin(a)*r,0.22,0.3,0.04,CL[(t+k)%CL.length])}}// girlandy z chorągiewkami od centrum
  P(0,2.4,0,0.2,4.8,0.2,'#6b4a2b');P(0,4.9,0,0.5,0.2,0.5,'#e8c040');
  const g=new THREE.Group();const mm=new THREE.Mesh(boxes(L),decoMat);mm.castShadow=true;g.add(mm);{const [mx,mz]=mktM(c);g.position.set(mx,c.h+(c.lv?c.lv[0]:0),mz)}scene.add(g);FAIR.g=g;
  setTimeout(()=>{if(FAIR.g===g&&Date.now()>=FAIR.until-500){scene.remove(g);freeObj(g);FAIR.g=null}},Math.max(1000,m.until-Date.now()+500))}
function addWanderer(d){if(villages.has(d.id))return;const R=RACES.ludzie,r=rngOf(d.id),fem=r()<0.3,pool=fem?R.f:R.m;
  const v={id:d.id,x:d.x,z:d.z,h:d.h,b:d.b,race:'ludzie',small:1,wander:1,inCity:d.inCity||null,houses:[],npcs:[],lvl:d.lvl,name:'Wędrowny kupiec',cols:[]};
  v.npcs.push({id:d.id+':kupiec',vid:d.id,role:'kupiec',rare:1,fem,name:pool[Math.floor(r()*pool.length)],roleN:fem?'Wędrowna kupcowa':'Wędrowny kupiec',x:d.x,z:d.z,ry:d.ry||0,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth),race:'ludzie',qg:false});villages.set(d.id,v)}
// v127: wędrowny kupiec stał na wysokości bazowej miasta (często w ziemi albo pod placem) — dosuwamy go do prawdziwego gruntu
TICKS.push(dt=>{const t=performance.now();if(TICKS._wk&&t-TICKS._wk<400)return;TICKS._wk=t;for(const v of villages.values()){if(!v||!v.wander||!v.g)continue;for(const n of v.npcs){if(!n.m)continue;let g=null;try{g=colAt(n.x,n.z)}catch(_){}
  try{const vg=villageGround(n.x,n.z,(g??v.h)+4);if(vg!==null&&(g===null||vg>g))g=vg}catch(_){}try{const sg=structGround(n.x,n.z,(g??v.h)+4);if(sg!==null&&(g===null||sg>g))g=sg}catch(_){}
  if(g!==null&&Math.abs(n.m.position.y-g)>0.02){n.m.position.y=g;v.h=g}}}});
function renderHeal(err){const fixed=[];const shared=new Map();
  scene.traverse(o=>{if(!(o.isMesh||o.isLine||o.isPoints))return;const g=o.geometry;if(!g||!g.attributes){o.visible=false;fixed.push('brak geometrii:'+(o.name||o.type));return}
    for(const k in g.attributes)if(g.attributes[k]==null){delete g.attributes[k];fixed.push('atrybut '+k)}
    if(g.morphAttributes)for(const k in g.morphAttributes){const a=g.morphAttributes[k];if(!Array.isArray(a)||a.some(x=>x==null)){delete g.morphAttributes[k];fixed.push('morph '+k)}}
    if(g.index===undefined)g.index=null;if(!g.attributes.position){o.visible=false;fixed.push('bez pozycji')}
    if(o.isInstancedMesh){if(!o.instanceMatrix){o.visible=false;fixed.push('instancja bez macierzy');return}const m=o.material;if(m&&!Array.isArray(m)){const r=shared.get(m)||{c:0,n:0,list:[]};if(o.instanceColor)r.c++;else{r.n++;r.list.push(o)}shared.set(m,r)}}});
  for(const [m,r] of shared)if(r.c&&r.n){for(const o of r.list)o.material=m.clone();fixed.push('materiał instancji ×'+r.n)}
  console.warn('renderHeal',String(err&&err.message),fixed.slice(0,12));return fixed}
function removeWanderer(id){const v=villages.get(id);if(!v)return;if(dlg&&dlg.n&&dlg.n.vid===id)closeDialog();if(v.g)unbuildVillage(v);villages.delete(id)}
function caravanMove(e,dt){const c=e.car,dx=c.tx-e.p.x,dz=c.tz-e.p.z,d=Math.hypot(dx,dz);
  if(d<8){e.carDone=1;return[0,0,0]}
  const tot=Math.hypot(c.tx-c.sx,c.tz-c.sz)||1;
  if(!c.amb&&d<tot*0.6){c.amb=[];const a=Math.atan2(dx,dz),x=e.p.x+Math.sin(a)*42,z=e.p.z+Math.cos(a)*42,lvl=e.lvl;for(let i=0;i<5;i++){const xx=x+rnd(-5,5),zz=z+rnd(-5,5),hh=colAt(xx,zz);if(hh===null)continue;const q=makeE(i%3===2?'lucznik_s':'bandyta',lvl,i===0,xx,hh,zz,{evt:1,prov:20});c.amb.push(q.id)}
    toast('Zasadzka na karawanę!','#ff6b5b');sendFx({k:'toast',txt:'Zasadzka na karawanę!',col:'#ff6b5b'})}
  if(c.amb&&c.amb.some(id=>{const q=enemies.get(id);return q&&q.st!==2&&Math.hypot(q.p.x-e.p.x,q.p.z-e.p.z)<26}))return[0,0,0];
  if(!playersList().some(p=>!p.dead&&Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)<28))return[0,0,0];
  if(d<c.best-0.5){c.best=d;c.stuck=0}else{c.stuck+=dt;if(c.stuck>8){const nx=e.p.x+dx/d*6,nz=e.p.z+dz/d*6,h=colAt(nx,nz);if(h!==null){e.p.set(nx,h,nz)}c.stuck=0}}
  e.ry=Math.atan2(dx,dz);return[dx/d,dz/d,1]}
function eventTick(dt){if(!isAuth())return;const c=EVT.cur;EVT.next-=dt;
  if(c){c.t-=dt;
    if(c.kind==='napad'){if(c.mem.every(id=>{const q=enemies.get(id);return !q||q.st===2})){const alive=c.mem.some(id=>enemies.has(id));if(!c.mem.some(id=>{const q=enemies.get(id);return q&&q.st!==2})){evReward(c,c.vx,c.vz,220);evMsg('Napad odparty! Mieszkańcy dziękują.','#7dd87d');c.done=1}}}
    if(c.kind==='karawana'){const e=enemies.get(c.eid);if(!e){if(!c.done){evMsg('Karawana przepadła…','#ff8a7a');c.done=1}}else if(e.carDone){evReward(c,e.p.x,e.p.z,60);evMsg('Karawana dotarła bezpiecznie!','#7dd87d');removeEnemy(e.id);c.done=1}}
    if(c.kind==='oblezenie'&&!c.done&&!c.mem.some(id=>{const q=enemies.get(id);return q&&q.st!==2})){evReward({lvl:c.lvl+2,name:c.name},c.vx,c.vz,300);evMsg('Oblężenie odparte! Miasto świętuje, straż dziękuje.','#7dd87d');c.done=1}
    if(c.kind==='oblezenie'&&c.done)for(const id of c.allies||[])if(enemies.has(id))removeEnemy(id);
    if(c.kind==='jarmark'&&c.t<=0){for(const id of c.wids)removeWanderer(id),sendFx({k:'wkupx',id});evMsg('Jarmark dobiegł końca.','#d2c29e');c.done=1}
    if(c.kind==='turniej'&&c.t<=0){evMsg('Turniej dobiegł końca.','#d2c29e');c.done=1}
    if(c.kind==='kupiec'&&c.t<=0){removeWanderer(c.wid);sendFx({k:'wkupx',id:c.wid});evMsg('Wędrowny kupiec ruszył w dalszą drogę.','#d2c29e');c.done=1}
    if(c.t<=0&&!c.done){evMsg('Wydarzenie „'+c.name+'” przepadło.','#ff8a7a');if(c.kind==='karawana')removeEnemy(c.eid);if(c.kind==='oblezenie'){for(const id of c.allies||[])if(enemies.has(id))removeEnemy(id)}c.done=1}
    if(c.done){EVT.cur=null;EVT.next=rnd(420,720)}return}
  if(EVT.next>0||SPC)return;const pl=playersList().filter(p=>!p.dead&&p.p.y<450);if(!pl.length)return;const pp=pick(pl);
  if(!startEvent(Math.random()<0.12?'kupiec':Math.random()<0.25?'napad':pick(['karawana','jarmark','turniej','oblezenie']),pp))EVT.next=40}

const HBQ=[];setInterval(()=>{let n=0;while(HBQ.length&&n<1){const e=HBQ.shift();if(e&&e.m&&!HBG.has(e.t+(e.elite?'e':''))){try{hbGrid(e)}catch(_){}n++}}},120);function addEnemyModel(e){HBQ.push(e);e.m=makeEnemy(e.t,e.elite);if(e.rar)e.m.scale.multiplyScalar(ERAR[e.rar].sc);if(e.t==='kon'||e.t==='woz')horseCoat(e.m,e.id%HCOATS.length);if(e.torch)torchModel(e.m);scene.add(e.m);if(EDEF[e.t].horse){const hm=horseCoat(makeHorseE('kon',false),e.id%HCOATS.length);if(EDEF[e.t].horse===2)caparison(hm,e.t==='pretendent'?'#7a1f6a':e.t==='gwardia_k'?'#7a1f1f':'#2a3a6a',e.t==='rycerz_k'?'#b4bac2':'#e8c84a');scene.add(hm);e.hm=hm}}
function freeGeos(o){o.traverse(q=>{const g=q.geometry;if(g&&g.dispose&&!(q.userData&&q.userData.keep)&&!(g.userData&&g.userData.keep)&&(typeof ringGeo==='undefined'||g!==ringGeo)&&(typeof discGeo==='undefined'||g!==discGeo))g.dispose()})}
function freeObj(o){const SH=new Set([decoMat,GLOWMAT,typeof projMat!=='undefined'?projMat:null,...Object.values(ARMATS)]);freeGeos(o);o.traverse(q=>{const m=q.material;if(m&&!Array.isArray(m)&&m.dispose&&!SH.has(m)&&!(m.userData&&m.userData.keep)){freeTagTex(m);m.dispose()}})}
function freeTagTex(m){const t=m&&m.map;if(t&&t.isCanvasTexture&&m.isSpriteMaterial&&(typeof glowTex==='undefined'||t!==glowTex)&&(typeof heartTex==='undefined'||t!==heartTex))t.dispose()}
