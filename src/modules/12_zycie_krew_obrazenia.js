// ===== ŻYCIE W ŚWIECIE: motyle, świetliki, klucze ptaków, skaczące ryby, ważki =====
const LIFE={b:[],f:[],birds:[],fish:[],t:0,bt:20};
const LBM=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});
function lifeMesh(L,mat){return new THREE.Mesh(boxes(L),mat||LBM)}
function lifeKill(o){scene.remove(o);o.traverse(q=>{if(q.isMesh&&q.geometry)q.geometry.dispose()})}
function lifeTick(dt){if(SPC||!player.ready)return;const p=player.p,day=hour>6&&hour<19,b=biomeAt(p.x,p.z),T=performance.now()/1000;LIFE.t-=dt;
  const flowery=[2,3,8,9,10,11,26,29,31,25,24,27].includes(b),wet=[7,9,30,13,14,26,27,3,29].includes(b),cold=[5,21,22,23].includes(b);
  if(LIFE.t<=0){LIFE.t=0.6;
    // motyle w dzień, ważki nad wodą
    if(day&&flowery&&!cold&&LIFE.b.length<10){const a=Math.random()*6.283,r=6+Math.random()*14,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r,h=colAt(x,z);if(h!=null&&h>WATER){const C1=pick(['#ffcf3a','#ff8a2a','#f4f4f4','#7ab8ff','#d870e0','#ff5a5a']),dr=wlAt&&wlAt(x,z)>0;const m=new THREE.Group(),wl=lifeMesh([[-0.09,0,0,0.16,0.01,0.13,C1],[-0.07,0,-0.08,0.12,0.01,0.07,C1]]),wr=lifeMesh([[0.09,0,0,0.16,0.01,0.13,C1],[0.07,0,-0.08,0.12,0.01,0.07,C1]]),bd=lifeMesh([[0,0,0,0.03,0.03,0.16,'#2a2420']]);m.add(wl,wr,bd);m.position.set(x,h+0.6+Math.random()*1.4,z);scene.add(m);LIFE.b.push({m,wl,wr,h,ph:Math.random()*6,vx:0,vz:0,t:0})}}
    // świetliki nocą
    if(!day&&(wet||flowery)&&!cold&&LIFE.f.length<28){const a=Math.random()*6.283,r=3+Math.random()*16,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r,h=colAt(x,z);if(h!=null&&h>WATER-0.5){const m=lifeMesh([[0,0,0,0.07,0.07,0.07,'#e8ff7a']],GLOWMAT);m.position.set(x,h+0.4+Math.random()*2,z);scene.add(m);LIFE.f.push({m,h,ph:Math.random()*6,t:0,x,z})}}
    // ryby wyskakujące z wody
    if(LIFE.fish.length<2&&Math.random()<0.18){const a=Math.random()*6.283,r=6+Math.random()*16,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r,hw=colAt(x,z);if(hw!=null&&hw<WATER-1.2){const m=lifeMesh([[0,0,0,0.12,0.16,0.42,'#8aa8b8'],[0,0.02,-0.26,0.04,0.16,0.12,'#6a8898'],[0,0.1,0.02,0.03,0.06,0.16,'#6a8898']]);const d=Math.random()*6.283;m.position.set(x,WATER-0.3,z);m.rotation.y=d;scene.add(m);LIFE.fish.push({m,t:0,d,x,z});PFX.emit(x,WATER,z,6,['#e8f8ff','#bfe8f8'],{sp:1.5,up:2,life:0.5,size:0.07});try{sfx('splash',0.25)}catch(_){}}}}
  // klucz ptaków przelatuje co jakiś czas
  LIFE.bt-=dt;if(LIFE.bt<=0&&day&&!LIFE.birds.length){LIFE.bt=35+Math.random()*50;const n=5+Math.floor(Math.random()*5),a=Math.random()*6.283,dx=Math.cos(a),dz=Math.sin(a),sx=p.x-dx*90+(Math.random()-0.5)*40,sz=p.z-dz*90+(Math.random()-0.5)*40,y=p.y+28+Math.random()*18,col=cold?'#e8e8ec':pick(['#2a2a2e','#3a3430','#e8e8e8']);
    for(let i=0;i<n;i++){const side=i%2?1:-1,k=Math.ceil(i/2),g=new THREE.Group(),wl=lifeMesh([[-0.35,0,0,0.7,0.04,0.22,col]]),wr=lifeMesh([[0.35,0,0,0.7,0.04,0.22,col]]),bd=lifeMesh([[0,0,0,0.16,0.14,0.5,col],[0,0.02,0.3,0.08,0.06,0.12,'#d8a040']]);g.add(wl,wr,bd);g.position.set(sx-dz*side*k*1.6-dx*k*1.8,y,sz+dx*side*k*1.6-dz*k*1.8);g.rotation.y=Math.atan2(dx,dz);scene.add(g);LIFE.birds.push({g,wl,wr,dx,dz,t:0,ph:i*0.6})}
    try{if(Math.random()<0.5)sfx('gull',0.25)}catch(_){}}
  for(let i=LIFE.b.length-1;i>=0;i--){const q=LIFE.b[i];q.t+=dt;const f=Math.sin(T*22+q.ph);q.wl.rotation.z=f*0.9;q.wr.rotation.z=-f*0.9;q.vx+=(Math.random()-0.5)*dt*6;q.vz+=(Math.random()-0.5)*dt*6;q.vx*=0.97;q.vz*=0.97;q.m.position.x+=q.vx*dt;q.m.position.z+=q.vz*dt;q.m.position.y=q.h+0.9+Math.sin(T*1.7+q.ph)*0.5;q.m.rotation.y=Math.atan2(q.vx,q.vz);
    if(q.t>40||Math.hypot(q.m.position.x-p.x,q.m.position.z-p.z)>34||!day){lifeKill(q.m);LIFE.b.splice(i,1)}}
  for(let i=LIFE.f.length-1;i>=0;i--){const q=LIFE.f[i];q.t+=dt;const bl=Math.max(0,Math.sin(T*2.2+q.ph*3));q.m.scale.setScalar(0.3+bl);q.m.position.set(q.x+Math.sin(T*0.4+q.ph)*1.2,q.h+0.8+Math.sin(T*0.6+q.ph*2)*0.8+q.ph*0.12,q.z+Math.cos(T*0.35+q.ph)*1.2);
    if(q.t>60||day||Math.hypot(q.x-p.x,q.z-p.z)>30){lifeKill(q.m);LIFE.f.splice(i,1)}}
  for(let i=LIFE.fish.length-1;i>=0;i--){const q=LIFE.fish[i];q.t+=dt;const k=q.t/0.9;q.m.position.set(q.x+Math.sin(q.d)*k*1.6,WATER-0.3+Math.sin(Math.min(1,k)*Math.PI)*1.3,q.z+Math.cos(q.d)*k*1.6);q.m.rotation.x=-1.2+k*2.4;if(k>=1){PFX.emit(q.m.position.x,WATER,q.m.position.z,8,['#e8f8ff','#bfe8f8'],{sp:1.8,up:2.4,life:0.6,size:0.08});lifeKill(q.m);LIFE.fish.splice(i,1)}}
  for(let i=LIFE.birds.length-1;i>=0;i--){const q=LIFE.birds[i];q.t+=dt;q.g.position.x+=q.dx*11*dt;q.g.position.z+=q.dz*11*dt;q.g.position.y+=Math.sin(T*0.5)*0.02;const f=Math.sin(T*6+q.ph);q.wl.rotation.z=f*0.6;q.wr.rotation.z=-f*0.6;if(q.t>18){lifeKill(q.g);LIFE.birds.splice(i,1)}}}
// ===== KREW I ROZCZŁONKOWANIE =====
const GIBS=[],DECALS=[];let decGeo=null;
function bloodDecal(x,z,r,col){if(SET_G&&!SET_G.blood)return;const h=colAt(x,z,99);if(h===null||h<WATER-0.2)return;if(!decGeo){decGeo=new THREE.CircleGeometry(1,9);decGeo.rotateX(-Math.PI/2)}
  const mt=new THREE.MeshBasicMaterial({color:col||'#5a0a0a',transparent:true,opacity:0.8,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});const m=new THREE.Mesh(decGeo,mt);m.position.set(x,h+0.03,z);m.scale.set(r*(0.7+Math.random()*0.6),1,r*(0.7+Math.random()*0.6));m.rotation.y=Math.random()*6;m.renderOrder=1;scene.add(m);DECALS.push({m,t:0});if(DECALS.length>60){const o=DECALS.shift();scene.remove(o.m);o.m.material.dispose()}}
function dismember(e){if(SET_G&&!SET_G.blood)return;const col=BLOODC(e.t),dark=/^#b|^#8|^#9|^#a/.test(col[0])&&!/szkielet|golem|kolos|zywiolak|drzewiec|slime|lich|upior|mumia|faraon/.test(e.t);
  if(dark){bloodDecal(e.p.x,e.p.z,0.6*eSc(e));for(let i=0;i<3;i++)bloodDecal(e.p.x+(Math.random()-0.5)*1.6*eSc(e),e.p.z+(Math.random()-0.5)*1.6*eSc(e),0.25)}
  const u=e.m.userData,ch=u.ch&&u.ch.userData;let parts=[];
  if(ch){const c=[ch.head,ch.la,ch.ra].filter(Boolean);parts=Math.random()<0.45?[c[0]]:[c[1+(Math.random()*2|0)]||c[0]];if(Math.random()<0.2&&c.length>2)parts.push(c[1])}
  for(const pt of parts){if(!pt||!pt.parent)continue;e.m.updateMatrixWorld(true);const wp=new THREE.Vector3(),wq=new THREE.Quaternion(),ws=new THREE.Vector3();pt.matrixWorld.decompose(wp,wq,ws);pt.parent.remove(pt);pt.position.copy(wp);pt.quaternion.copy(wq);pt.scale.copy(ws);scene.add(pt);
    const a=Math.random()*6.28;GIBS.push({o:pt,v:[Math.cos(a)*3+(e.vx||0)*0.3,4+Math.random()*2,Math.sin(a)*3+(e.vz||0)*0.3],w:[rnd(-8,8),rnd(-8,8),rnd(-8,8)],t:0,col:dark?col:null})}
  if(!ch&&!EDEF[e.t].boss){const geo=new THREE.BoxGeometry(0.22,0.22,0.22);for(let i=0;i<4;i++){const mt=new THREE.MeshLambertMaterial({color:dark?(i%2?'#7a1010':'#a82020'):col[i%col.length]});const m=new THREE.Mesh(geo,mt);m.position.set(e.p.x,e.p.y+0.6*eSc(e),e.p.z);m.scale.setScalar(eSc(e)*rnd(0.6,1.3));scene.add(m);const a=Math.random()*6.28;GIBS.push({o:m,v:[Math.cos(a)*3.5,3+Math.random()*3,Math.sin(a)*3.5],w:[rnd(-9,9),rnd(-9,9),rnd(-9,9)],t:0,own:1,col:dark?col:null})}}}
function gibTick(dt){for(let i=GIBS.length-1;i>=0;i--){const g=GIBS[i],o=g.o;g.t+=dt;const h=colAt(o.position.x,o.position.z,o.position.y+1)??-99;
    const gy=g.shard?o.scale.y*0.5:0.12;if(o.position.y>h+gy){g.v[1]-=22*dt;o.position.x+=g.v[0]*dt;o.position.y+=g.v[1]*dt;o.position.z+=g.v[2]*dt;o.rotation.x+=g.w[0]*dt;o.rotation.y+=g.w[1]*dt;o.rotation.z+=g.w[2]*dt;if(g.col&&Math.random()<dt*20)PFX.emit(o.position.x,o.position.y,o.position.z,1,g.col,{sp:0.4,life:0.4,size:0.06})}
    else{if(!g.land){g.land=1;if(g.col)bloodDecal(o.position.x,o.position.z,0.3)}o.position.y=h+gy;g.v[0]*=0.5;g.v[2]*=0.5;if(g.shard){g.w[0]*=0.8;g.w[1]*=0.8;g.w[2]*=0.8}}
    if(g.shard){if(g.t>25){o.position.y-=dt*0.25;if(g.t>28){scene.remove(o);GIBS.splice(i,1)}}}else if(g.t>9){o.scale.multiplyScalar(Math.max(0,1-dt*3));if(g.t>10.5){scene.remove(o);if(g.own){o.material.dispose()}GIBS.splice(i,1)}}}
  for(let i=DECALS.length-1;i>=0;i--){const d=DECALS[i];d.t+=dt;if(d.t>25){d.m.material.opacity=Math.max(0,0.8*(1-(d.t-25)/5));if(d.t>30){scene.remove(d.m);d.m.material.dispose();DECALS.splice(i,1)}}}}
function eVoiceK(t){if(HUM[t]||/bandyt|rycerz|strazn|najemn|kultyst|pirat|ork|wiking|barbarz/.test(t))return 'vhum';if(/szkielet|lucznik_s|krol_s|mumia|faraon/.test(t))return 'vbone';if(/upior|lich|duch|widm|banshee/.test(t))return 'vghost';if(/golem|kolos|drzewiec|prastary|zywiolak/.test(t))return 'vstone';if(/slime|galaret/.test(t))return 'vslime';if(/pajak|skorpion|osa|chrzaszcz|mrowk|szarancz/.test(t))return 'vbug';if(/goblin|kobold|chochlik|imp/.test(t))return 'vsmall';if(/harpia|gryf|sep|kruk|ptak|nietoperz/.test(t))return 'vbird';if(/wilk|lis|hiena/.test(t))return 'growl';return 'vbeast'}
function eVoice(e,v){const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d>30)return;const k=eVoiceK(e.t),sc=eSc(e);sfx(k,(v||0.6)*(1-d/34)*(sc>2?1.3:1))}
// ===== obrażenia gracza: kierunek, błysk, pasek „utraconego” zdrowia =====
function hurtFlash(fr){let el=document.getElementById('hflash');if(!el){el=document.createElement('div');el.id='hflash';el.style.cssText='position:fixed;inset:0;pointer-events:none;background:rgba(200,0,0,.0);z-index:5;transition:background .35s';document.body.appendChild(el)}
  el.style.transition='none';el.style.background=`rgba(190,0,0,${Math.min(0.38,0.1+fr*1.2)})`;requestAnimationFrame(()=>{el.style.transition='background .45s';el.style.background='rgba(190,0,0,0)'});
  const hb=document.getElementById('hpw');if(hb){hb.classList.remove('hpshake');void hb.offsetWidth;hb.classList.add('hpshake')}}
const HDIR=[];function hurtDir(sx,sz){const el=document.createElement('div');el.className='hdir';document.body.appendChild(el);HDIR.push({el,sx,sz,t:0})}
function hurtDirTick(dt){for(let i=HDIR.length-1;i>=0;i--){const h=HDIR[i];h.t+=dt;const a=Math.atan2(h.sx-player.p.x,h.sz-player.p.z),rel=a-yaw+Math.PI;h.el.style.transform=`translate(-50%,-50%) rotate(${-rel}rad) translateY(-130px)`;h.el.style.opacity=Math.max(0,1-h.t/1.2);if(h.t>1.2){h.el.remove();HDIR.splice(i,1)}}
  const lw=document.getElementById('lowhp');const fr=P2.hp/Math.max(1,ST.hp);if(lw)lw.style.opacity=P2.dead?0:fr<0.3?(0.35+0.35*Math.sin(performance.now()*0.008))*(1-fr/0.3)+0.2:0}
// ciała poległych zostają na ziemi przez 2 minuty, potem zapadają się w ziemię
const CORPSES=[];function freeEnemyModel(m){scene.remove(m);try{m.userData.mat.dispose()}catch(_){}try{freeGeos(m);m.traverse(o=>{if(o.isSprite&&o.material&&o.material.map&&o.material.map.isCanvasTexture){freeTagTex(o.material);o.material.dispose()}})}catch(_){}}
function corpseTick(dt){/* zwłoki zostają; znikają dopiero, gdy teren pod nimi zostanie wyładowany */const far=(S.rd*C+40)**2;for(let i=CORPSES.length-1;i>=0;i--){const c=CORPSES[i];c.t+=dt;if(c.t%5<dt){const dx=c.m.position.x-player.p.x,dz=c.m.position.z-player.p.z;if(dx*dx+dz*dz>far){freeEnemyModel(c.m);CORPSES.splice(i,1)}else c.m.visible=dx*dx+dz*dz<130*130}}}
const SHMAT=new Map(),SHGEO=new THREE.BoxGeometry(1,1,1);
// zwierzęta i stwory bez ludzkiego szkieletu rozsypują się na wokselowe kawałki w kolorach swojego modelu
function shatterEnemy(e){try{const m=e.m;m.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(m);if(!isFinite(box.min.x))return false;const cols=[];m.traverse(o=>{if(!o.isMesh||!o.visible||!o.geometry||!o.geometry.attributes.color)return;const c=o.geometry.attributes.color,n=c.count;for(let i=0;i<10;i++){const j=Math.floor(Math.random()*n);cols.push('#'+new THREE.Color(c.getX(j),c.getY(j),c.getZ(j)).getHexString())}});if(!cols.length)return false;
  const sz=box.getSize(new THREE.Vector3()),vol=Math.max(0.05,sz.x*sz.y*sz.z),N=Math.max(10,Math.min(42,Math.round(vol*14+10))),cs=Math.max(0.12,Math.min(0.55,Math.cbrt(vol/N)*0.85));
  for(let i=0;i<N;i++){const c=cols[Math.floor(Math.random()*cols.length)];let mt=SHMAT.get(c);if(!mt){mt=new THREE.MeshLambertMaterial({color:c});SHMAT.set(c,mt)}const q=new THREE.Mesh(SHGEO,mt);q.scale.setScalar(cs*rnd(0.7,1.25));q.position.set(rnd(box.min.x,box.max.x),rnd(box.min.y,box.max.y),rnd(box.min.z,box.max.z));q.castShadow=true;scene.add(q);const cx=(box.min.x+box.max.x)/2,cz=(box.min.z+box.max.z)/2,dx=q.position.x-cx,dz=q.position.z-cz,dl=Math.hypot(dx,dz)||1;
    GIBS.push({o:q,v:[dx/dl*rnd(1,3.2),rnd(1.5,4.5),dz/dl*rnd(1,3.2)],w:[rnd(-7,7),rnd(-7,7),rnd(-7,7)],t:0,shard:1,col:null})}
  PFX.emit(e.p.x,e.p.y+sz.y*0.5,e.p.z,14,cols.slice(0,6),{sp:2.5,up:1.5,life:0.7,size:0.12});return true}catch(_){return false}}
// wysokość podłoża pod całym obrysem stwora (nie tylko pod środkiem) — duże zwierzęta nie zapadają się w zbocza
function eFoot(e,x,z,h){const sc=eSc(e);if(sc<0.7)return h;const r=Math.min(1.4,0.32*sc),c=Math.cos(e.ry||0),s=Math.sin(e.ry||0);let m=h;for(const [a,b] of [[0,1],[0,-1],[0.7,0],[-0.7,0]]){const px=x+(a*c+b*s)*r,pz=z+(-a*s+b*c)*r,q=colAt(px,pz,h+1.2);if(q!=null&&q>m&&q-h<1.0)m=q}return m}
function removeEnemy(id,now){const e=enemies.get(id);if(!e)return;if(e.hm){scene.remove(e.hm);try{freeObj(e.hm)}catch(_){}e.hm=null}
  if(!now&&e.st===2&&!EDEF[e.t].boss&&e.m.parent===scene&&!(e.m.userData&&e.m.userData.ch)&&!e.shat){e.shat=1;if(shatterEnemy(e)){try{const b=document.querySelector('[data-bar="e'+e.id+'"]');b&&b.remove()}catch(_){}freeEnemyModel(e.m);enemies.delete(id);return}}
  if(!now&&e.st===2&&e.dfx&&!EDEF[e.t].boss&&e.m.parent===scene){e.m.traverse(o=>{if(o.isSprite)o.visible=false});try{const b=document.querySelector('[data-bar="e'+e.id+'"]');b&&b.remove()}catch(_){}CORPSES.push({m:e.m,t:0});if(CORPSES.length>90){/* v145: mniej zwłok naraz (każde to kilka–kilkanaście wywołań rysowania) */const o=CORPSES.shift();freeEnemyModel(o.m)}enemies.delete(id);return}
  scene.remove(e.m);e.m.userData.mat.dispose();try{freeGeos(e.m);e.m.traverse(o=>{if(o.isSprite&&o.material&&o.material.map&&o.material.map.isCanvasTexture){freeTagTex(o.material);o.material.dispose()}})}catch(_){}enemies.delete(id)}
function clearEnemies(){for(const id of [...enemies.keys()])removeEnemy(id,1);for(const c of CORPSES)freeEnemyModel(c.m);CORPSES.length=0}
let spawnT=0;
// wędrówka: idzie do losowego punktu wokół swojego miejsca, chwilę stoi, rozgląda się i idzie dalej
function wanderStep(e,dt,R,spd){spd=spd||0.4;if(!e.anc)e.anc=e.home?[e.home[0],e.home[1]]:[e.p.x,e.p.z];const W=e.wan;
  if(!W||W.t<=0){if(W&&W.w){e.wan={t:rnd(0.8,2.6),w:0}}else{const a=Math.random()*6.283,r=rnd(R*0.3,R);e.wan={t:rnd(4,9),w:1,tx:e.anc[0]+Math.cos(a)*r,tz:e.anc[1]+Math.sin(a)*r}}return null}
  W.t-=dt;if(!W.w)return null;const dx=W.tx-e.p.x,dz=W.tz-e.p.z,l=Math.hypot(dx,dz);if(l<0.8){W.t=0;return null}return[dx/l,dz/l,spd]}
function passiveAI(e,dt){
  if(e.fright>0){e.fright-=dt;const dx=e.p.x-e.frX,dz=e.p.z-e.frZ,l=Math.hypot(dx,dz)||1;e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,AIP.pasFlee]}
  if(e.prov>0&&!e.herdA){e.herdA=1;for(const o of enemies.values())if(o!==e&&o.t===e.t&&o.pas&&Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z)<AIP.herdR)o.prov=Math.max(o.prov,5)}if(e.prov<=0)e.herdA=0;
  if(e.prov<=0){for(const p of playersList()){const dd=Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z);if(dd<AIP.shyR&&!p.dead){const dx=e.p.x-p.p.x,dz=e.p.z-p.p.z,l=dd||1;e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,AIP.shySp]}}}
  if(e.prov>0){let best=null,bd=1e9;for(const p of playersList()){const d=Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z);if(d<bd){bd=d;best=p}}
    if(best&&bd<30){const dx=e.p.x-best.p.x,dz=e.p.z-best.p.z,l=Math.hypot(dx,dz)||1;e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,AIP.pasFlee]}}
  {let cx=0,cz=0,n=0;if(!e.wan||e.wan.t<=0)for(const o of enemies.values())if(o!==e&&o.t===e.t&&EDEF[o.t].passive&&Math.abs(o.p.x-e.p.x)<20&&Math.abs(o.p.z-e.p.z)<20){cx+=o.p.x;cz+=o.p.z;n++}
   if(n){cx/=n;cz/=n;if(Math.hypot(cx-e.p.x,cz-e.p.z)>AIP.cohD)e.anc=[cx,cz]}}
  const W2=wanderStep(e,dt,10,0.32);if(W2){e.ry=Math.atan2(W2[0],W2[1]);return W2}return[0,0,0];
}
// v126: stwory nie pojawiają się znikąd — rodzą się daleko (poza zasięgiem wzroku albo poza kadrem kamery) i dopiero podchodzą
const SPWN={fw:new THREE.Vector3()};
function spawnOK(x,z,pl,minD){for(const q of pl){const d=Math.hypot(q.p.x-x,q.p.z-z);if(d<minD)return false}
  try{camera.getWorldDirection(SPWN.fw);const dx=x-camera.position.x,dz=z-camera.position.z,L=Math.hypot(dx,dz)||1,fl=Math.hypot(SPWN.fw.x,SPWN.fw.z)||1,cos=(dx*SPWN.fw.x+dz*SPWN.fw.z)/(L*fl),far=(scene.fog&&scene.fog.far)||160;
    if(cos>0.55&&L<far*0.8)return false}catch(_){}return true}
function spawnTick(){
  for(const e of [...enemies.values()])if(e.t==='pretendent')removeEnemy(e.id);
  const pl=playersList().filter(p=>!p.dead);
  /* v157: pojawianie się jak w v155 (60–95 m), ale stwory nie znikają aż do zasięgu widzenia — widać je z daleka; łączny limit, żeby się nie kumulowały */
  const SR=Math.max(100,Math.min(260,S.rd*C*0.95*(SET_G.fog||1)*0.92));let TP=0,TE=0;for(const e of enemies.values()){if(e.st===2)continue;if(e.pas)TP++;else TE++};
  for(const pp of pl){if(pp.p.y>450)continue;
    if(Math.random()<0.012&&BANDS.size<1)spawnBand(pp);
    let near=0,pas=0;for(const e of enemies.values()){const dd=Math.hypot(e.p.x-pp.p.x,e.p.z-pp.p.z);if(dd<100){if(e.pas)pas++;else near++}}
    /* v140: gęstość jak przed v126 — liczona na większym obszarze (100 m zamiast 60 m), więc limity rosną proporcjonalnie */
    /* v154: więcej zwierząt — do 20 w promieniu 100 m, do 3 prób na sekundę */
    for(let pt=0;pt<3&&pas<20&&TP<70;pt++){const a=Math.random()*Math.PI*2,d=rnd(62,90),x=pp.p.x+Math.cos(a)*d,z=pp.p.z+Math.sin(a)*d,h=colAt(x,z),b=biomeAt(x,z),vv=inVillage(x,z,30);
      const list=vv?VILLAGE_P:BIOME_P[b];
      if(h!==null&&!wetAt(x,z,h)&&list&&spawnOK(x,z,pl,58)){let t=pick(list);if(FANT_P.has(t)&&Math.random()<0.55)t=pick(list);const n=1+Math.floor(Math.random()*(HERD[t]||1));
        for(let i=0;i<n;i++){const xx=x+rnd(-3,3),zz=z+rnd(-3,3),hh=colAt(xx,zz);if(hh!==null&&hh>=WATER-0.5&&Math.abs(hh-h)<2){makeE(t,1,false,xx,hh,zz,{pas:1});pas++;TP++}}}}
    {const ph=colAt(pp.p.x,pp.p.z);if(ph!==null&&ph<WATER-0.5&&pp.p.y<WATER+2&&Math.random()<0.18){let sw=0;for(const o of enemies.values())if(EDEF[o.t].swim&&o.st!==2)sw++;if(sw<3)for(let k=0;k<6;k++){const a=Math.random()*6.28,dd=rnd(48,70),x=pp.p.x+Math.cos(a)*dd,z=pp.p.z+Math.sin(a)*dd,h=colAt(x,z);if(h!==null&&h<WATER-3.5&&!(season===2&&WATER_U.uIce.value>0.5&&h>WATER-4.2)){const sp=spawnPt(),dist=Math.hypot(x-sp[0],z-sp[2]),lv=Math.max(1,1+Math.floor(dist/260));let t=(biomeAt(x,z)===37&&Math.random()<0.6)?(Math.random()<0.65?'murena':'syrena'):seaPick(WATER-h,dist,hour>=19.5||hour<5.8);if((t==='lewiatan'||t==='kraken')&&[...enemies.values()].some(o=>(o.t==='lewiatan'||o.t==='kraken')&&o.st!==2))t='rekin';if(t==='waz_morski'&&h>WATER-6)t='rekin';makeE(t,lv,false,x,WATER-1.15,z,{});if(t==='lewiatan'){toast('Woda drży… Z głębin wynurza się LEWIATAN!','#7fe3ff')}else if(t==='kraken')toast('Coś ogromnego porusza się pod powierzchnią… KRAKEN!','#ff9a8a');break}}}}
    if(near>=10||TE>=34||Math.random()<0.15)continue;/* v154: więcej stworów (było 6 / 35%) */
    for(let tries=0;tries<9;tries++){
      const a=Math.random()*Math.PI*2,d=rnd(65,95),x=pp.p.x+Math.cos(a)*d,z=pp.p.z+Math.sin(a)*d;
      const h=colAt(x,z),b=biomeAt(x,z);if(h===null||h<WATER||!BIOME_E[b])continue;
      if(!spawnOK(x,z,pl,60)||inVillage(x,z,48))continue;
      let t=dnFix(pick(BIOME_E[b]),BIOME_E[b]);if(!t)continue;const sp=spawnPt(),dist=Math.hypot(x-sp[0],z-sp[2]);
      if(dist>350&&Math.random()<0.035){const gt=giantFor(b);if(gt&&EDEF[gt]){let gn=0;for(const o of enemies.values())if(EDEF[o.t].giant&&o.st!==2)gn++;if(!gn){t=gt;toast('Ziemia drży… w pobliżu krąży '+EDEF[gt].n+'!','#ff9d6b')}}}
      const lvl=Math.max(1,1+Math.floor(dist/260)+(Math.random()<0.3?1:0)),elite=!EDEF[t].giant&&Math.random()<0.07;
      if(EDEF[t].giant)makeE(t,lvl,elite,x,h,z,{});else spawnPack(t,lvl,elite,x,h,z);break;
    }
  }
  for(const e of [...enemies.values()]){const dmin=Math.min(...pl.concat(playersList()).map(p=>Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)));if(dmin>(e.qid||e.evt?Math.max(260,SR+80):Math.max(140,SR+15))||colAt(e.p.x,e.p.z)===null)removeEnemy(e.id)}
}
