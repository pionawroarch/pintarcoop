// =================== ETAP 3: klasy, doświadczenie, poziomy, perki (logika) ===================
function cdFor(s){const c=CLS[abilSet()];if(!c)return 1;let cd=c[s].cd*(1-0.08*pk(s))*(1-0.05*pk('mistrz'));if(hasP('uczony'))cd*=0.85;return cd}
const abilMul=s=>1+0.12*pk(s);
const facing=()=>Math.atan2(-Math.sin(yaw),-Math.cos(yaw));
function rollDmg(base){const crit=Math.random()*100<ST.crit+(LUCK.t>0?10:0);let d=base*(crit?2+0.1*pk('cios'):1);if(P3.stealth>0){d*=2;P3.stealth=0;setGhost(meRef,false)}return[d,crit]}
function dealHit(e,dmg,crit,kx,kz,slow,stun){if(EDEF[e.t].ally)return;const src=HIT_SRC;if(!src)e.hurtP=nowS();/* v152: atak zgrany — cios w wroga ogłuszonego przez kogoś innego */if(!src&&!stun&&typeof comboCheck==='function'&&comboCheck(e)){dmg*=1.8;crit=true;e.stunU=0;fxNum(e.p.x,e.p.y+2.6*eSc(e),e.p.z,'Atak zgrany!','#ffd34d');sfx('crit',0.8)}if(stun&&typeof stunNote==='function')stunNote(e,stun,!src);if(!src&&ST.ls>0&&dmg>0){P2.hp=Math.min(ST.hp,P2.hp+dmg*ST.ls/100)}/* kompani i zwierzak włączają się do walki z celem gracza */if(!src&&P3.sneak&&!EDEF[e.t].boss&&(isAuth()?e.tgId!==NET.id:!(e.cHit>nowS()-6))){dmg*=2.5;crit=true;fxNum(e.p.x,e.p.y+2.4*eSc(e),e.p.z,'Z ukrycia!','#b8e0ff');sfx('crit',0.7)}try{if(HGEAR[e.t]&&Math.random()<0.7)sfx('clang',0.45);else if(e.t==='golem'||e.t==='kolos')sfx('thud',0.6)}catch(_){}
  if(e.car||e.t==='woz')return;
  if((crit||Math.random()<0.25)&&!/szkielet|golem|kolos|zywiolak|drzewiec|slime|lich|upior|mumia|faraon/.test(e.t))bloodDecal(e.p.x+kx*0.8,e.p.z+kz*0.8,crit?0.35:0.22);
  {const hy=e.p.y+1.1*eSc(e);PFX.emit(e.p.x,hy,e.p.z,crit?16:8,BLOODC(e.t),{sp:crit?5:3.5,life:0.55,size:crit?0.12:0.09,dx:kx*2,dz:kz*2});PFX.emit(e.p.x,hy,e.p.z,crit?10:4,crit?['#fff2a0','#ffd34d','#ffffff']:['#ffffff','#fff2c0'],{sp:crit?7:5,life:0.22,size:0.05,g:2,up:0.5})}
  if(!EDEF[e.t].passive)skGain(ST.ranged?'strzel':'walka',1);
  e.mark=nowS();sfx(crit?'crit':'hit');{const wk=weaponKind(INV.eq.bron?INV.eq.bron.base:'');if(!src){if(/mlot|maczug|bulaw|kostur/.test(INV.eq.bron?INV.eq.bron.base:'')||wk==='fist')sfx('eblunt',0.7);else if(wk==='melee'||wk==='dagger')sfx('eblade',0.7)}if(Math.random()<0.35)eVoice(e,0.4)}
  if(pk('wampir')&&!P2.dead)P2.hp=Math.min(ST.hp,P2.hp+dmg*0.02*pk('wampir'));
  fxNum(e.p.x,e.p.y+1.8*eSc(e),e.p.z,(crit?'✦':'')+Math.round(dmg),crit?'#ffd34d':'#fff');e.flash=1;
  if(stun)e.stunV=stun;if(isAuth())applyHit(e.id,dmg,kx,kz,NET.id,slow,stun,src);else{e.cHit=nowS();NET.tr.send({t:'hit',from:NET.id,eid:e.id,dmg,k:[kx,kz],slow:slow||0,stun:stun||0,src})}
  P2.lastHurt=Math.max(P2.lastHurt,nowS()-2);
}
function sendFx(o){if(NET.tr)NET.tr.send({t:'fx',from:NET.id,...o})}
function showFx(m){
  if(m.k==='bolt'){boltFx(m.pts);return}
  if(m.k==='toast'){toast(m.txt,m.col);return}
  if(m.k==='evt'){toast(m.txt,m.col);if(m.mk)MARKS.set('evt',{x:m.mk[0],z:m.mk[1],n:m.mk[2],col:'#ffd34d',evt:1});else MARKS.delete('evt');return}
  if(m.k==='evrw'){if(m.to===NET.id)giveEvReward(m.gold,m.xp,m.txt);return}
  if(m.k==='wkup'){addWanderer(m.d);return}
  if(m.k==='wkupx'){removeWanderer(m.id);return}
  if(m.k&&FXH[m.k]){FXH[m.k](m);return}if(m.k==='proj')spawnProj(m.kind,m.o,m.d,false,0,{aoe:m.aoe,h:m.h,sm:m.sm||1,ench:m.en||0});else if(m.k==='ring')ringFx(m.p[0],m.p[1],m.p[2],m.r,m.kind);else if(m.k==='tele')teleFx(m.p[0],m.p[1],m.p[2],m.r,m.t)}

// ---------- pociski ----------
const PROJ={
 arrow:{spd:80,g:4.2,life:4.2,geo:()=>boxes([[0,0,0,0.05,0.05,0.75,'#7a5a3a'],[0,0,0.38,0.08,0.08,0.1,'#cfd6dc'],[0,0,-0.33,0.14,0.02,0.14,'#f2f2f2']])},
 bolt:{spd:42,g:0,life:2.6,geo:()=>boxes([[0,0,0,0.32,0.32,0.32,'#a8d8ff'],[0,0,-0.25,0.16,0.16,0.3,'#5aa6ff']])},
 fire:{spd:32,g:1.6,life:3.2,geo:()=>boxes([[0,0,0,0.52,0.52,0.52,'#ff8a2e'],[0,0,0,0.32,0.66,0.32,'#ffd34d'],[0,0,-0.35,0.25,0.25,0.4,'#ff5a1a']])},
};
const EBIG={golem:1.15,yeti:1.05};
const projGeo={}, projMat=new THREE.MeshBasicMaterial({vertexColors:true}), projs=[];
function spawnProj(kind,o,d,mine,dmg,opt){
  const P=PROJ[kind];if(!P)return;const m=new THREE.Mesh(projGeo[kind]||(projGeo[kind]=P.geo()),projMat);
  m.position.set(o[0],o[1],o[2]);scene.add(m);const sm=(opt&&opt.sm)||1;projs.push({m,kind,v:[d[0]*P.spd*sm,d[1]*P.spd*sm,d[2]*P.spd*sm],life:P.life,mine,dmg,opt:opt||{},hit:new Set(),tr:projTrail(kind,o)});
}
// v124: smuga za pociskiem (cień aerodynamiczny) — kilka ostatnich pozycji jako zanikająca wstęga
const TRAILN=14,trailMat=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,side:THREE.DoubleSide,fog:true});
function projTrail(kind,o){const g=new THREE.BufferGeometry(),pos=new Float32Array(TRAILN*2*3),col=new Float32Array(TRAILN*2*4),idx=[];for(let i=0;i<TRAILN-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}
  g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('color',new THREE.BufferAttribute(col,4));g.setIndex(idx);const c=kind==='arrow'?[0.95,0.95,0.92]:kind==='fire'?[1,0.55,0.15]:[0.6,0.85,1];
  for(let i=0;i<TRAILN;i++){const a=(1-i/(TRAILN-1))*(kind==='arrow'?0.55:0.8);for(const j of [0,1]){col.set([c[0],c[1],c[2],a],(i*2+j)*4)}}const m=new THREE.Mesh(g,trailMat);m.frustumCulled=false;m.renderOrder=3;scene.add(m);return{m,pts:Array.from({length:TRAILN},()=>[o[0],o[1],o[2]]),w:kind==='arrow'?0.07:0.2}}
function trailTick(tr,p,dead){const P=tr.pts;P.pop();P.unshift(dead?P[0]:[p.x,p.y,p.z]);const pos=tr.m.geometry.attributes.position.array,c=camera.position;
  for(let i=0;i<TRAILN;i++){const a=P[i],b=P[Math.min(TRAILN-1,i+1)],dx=a[0]-b[0],dy=a[1]-b[1],dz=a[2]-b[2],vx=a[0]-c.x,vy=a[1]-c.y,vz=a[2]-c.z;let nx=dy*vz-dz*vy,ny=dz*vx-dx*vz,nz=dx*vy-dy*vx;const l=Math.hypot(nx,ny,nz)||1,w=tr.w*(1-i/TRAILN*0.6)/l;nx*=w;ny*=w;nz*=w;
    pos.set([a[0]+nx,a[1]+ny,a[2]+nz,a[0]-nx,a[1]-ny,a[2]-nz],i*6)}tr.m.geometry.attributes.position.needsUpdate=true}
function trailKill(tr){if(!tr)return;scene.remove(tr.m);tr.m.geometry.dispose()}
// v124: celowanie dokładnie w środek celownika — promień z kamery przez celownik szuka pierwszego trafienia (wróg, teren, budynek), pocisk leci z dłoni do tego punktu
const _aimV=new THREE.Vector3();
function aimPoint(){camera.getWorldDirection(_aimV);const c=camera.position,fx=_aimV.x,fy=_aimV.y,fz=_aimV.z;const t0=Math.max(0.5,Math.hypot(c.x-player.p.x,c.z-player.p.z,c.y-player.p.y-1.35)+0.6);
  let best=140;for(const e of enemies.values()){if(e.st===2||(EDEF[e.t]&&EDEF[e.t].ally))continue;const sc=(EDEF[e.t]&&EDEF[e.t].sc)||1,r=0.6*sc+0.2,ex=e.p.x-c.x,ey=e.p.y+0.9*sc-c.y,ez=e.p.z-c.z,t=ex*fx+ey*fy+ez*fz;if(t<t0||t>best)continue;const qx=ex-fx*t,qy=ey-fy*t,qz=ez-fz*t;if(qx*qx+qy*qy*0.45+qz*qz<r*r)best=t}
  for(let t=t0;t<best;t+=0.5){const x=c.x+fx*t,y=c.y+fy*t,z=c.z+fz*t,h=colAt(x,z,y);if((h!=null&&y<h)||(t<60&&solidAt(x,y,z))){best=t;break}}
  return[c.x+fx*best,c.y+fy*best,c.z+fz*best,best]}
function aimDir(kind){
  const o=[player.p.x,player.p.y+1.35,player.p.z],T=aimPoint();let dx=T[0]-o[0],dy=T[1]-o[1],dz=T[2]-o[2];const dist=Math.hypot(dx,dy,dz)||1;
  const P=kind&&PROJ[kind];if(P&&P.g>0){const tt=dist/P.spd;dy+=0.5*P.g*tt*tt}/* poprawka na opadanie strzały */const l=Math.hypot(dx,dy,dz)||1;
  return{o,d:[dx/l,dy/l,dz/l]};
}
function shootFromMe(kind,dmg,spread,opt){
  if(kind==='arrow'&&pk('sokol')){opt=Object.assign({},opt||{});opt.sm=(opt.sm||1)*(1+0.08*pk('sokol'))}
  const a=aimDir(kind);const cs=Math.cos(spread),sn=Math.sin(spread);const d=[a.d[0]*cs+a.d[2]*sn,a.d[1],-a.d[0]*sn+a.d[2]*cs];
  player.ry=Math.atan2(d[0],d[2]);meRef.rotation.y=player.ry;
  spawnProj(kind,a.o,d,true,dmg,opt);sendFx({k:'proj',kind,o:a.o,d,aoe:opt&&opt.aoe||0,sm:opt&&opt.sm||1,en:opt&&opt.ench||0});
}
function projTick(dt){
  for(let i=projs.length-1;i>=0;i--){const pr=projs[i],P=PROJ[pr.kind],p=pr.m.position;
    pr.v[1]-=P.g*dt;p.x+=pr.v[0]*dt;p.y+=pr.v[1]*dt;p.z+=pr.v[2]*dt;pr.life-=dt;
    pr.m.rotation.y=Math.atan2(pr.v[0],pr.v[2]);pr.m.rotation.x=-Math.atan2(pr.v[1],Math.hypot(pr.v[0],pr.v[2]));if(pr.tr)trailTick(pr.tr,p);
    {const tc={arrow:['#e8e0c8','#c8c0a8'],bolt:['#8ab0ff','#c8d8ff','#ffffff'],fire:['#ff7a1a','#ffb030','#ffe080'],frost:['#bfe8ff','#ffffff'],curse:['#a060ff','#6a2aa8'],poison:['#7ad15a','#3a8a2a']}[pr.kind]||['#ffffff'];if(Math.random()<(pr.kind==='arrow'?0.5:1))PFX.emit(p.x,p.y,p.z,pr.kind==='arrow'?1:2,tc,{sp:0.4,up:0.2,life:pr.kind==='arrow'?0.25:0.4,size:pr.kind==='arrow'?0.04:0.08,g:pr.kind==='arrow'?1:-0.5})}
    let done=pr.life<=0,stick=false;const h=colAt(p.x,p.z,p.y);if(h!==null&&p.y<h){done=true;stick=!done||pr.life>0}else if(!done&&!SPC&&solidAt(p.x,p.y,p.z)){done=true;stick=true;PFX.emit(p.x,p.y,p.z,4,['#c8b89a','#8a7a64'],{sp:1.5,life:0.3,size:0.05})}
    if(pr.opt.ench&&ENCH[pr.opt.ench]&&Math.random()<0.8)PFX.emit(p.x,p.y,p.z,pr.opt.ench==='ogien'||pr.opt.ench==='wybuch'?3:1,ENCH[pr.opt.ench].fx,{sp:0.6,up:0.5,life:0.35,size:0.09,g:-1});
    if(!done&&pr.opt.h){for(const pp of playersList()){if(pp.dead)continue;if(Math.hypot(pp.p.x-p.x,pp.p.z-p.z)<0.75&&p.y>pp.p.y-0.2&&p.y<pp.p.y+2.1){if(pr.opt.dmg&&isAuth())hurtPlayer(pp.id,pr.opt.dmg,{p:{x:pr.opt.src[0],z:pr.opt.src[1]}});done=true;break}}}
    else if(!done)for(const e of enemies.values()){if(e.st===2||pr.hit.has(e.id))continue;const r=EDEF[e.t].bodyR?Math.max(1,eBody(e)*0.8):EDEF[e.t].huge||EDEF[e.t].giant?Math.max(1,eSc(e)*0.55):eSc(e)*(EBIG[e.t]||0.7);
      {const ih=eHitSeg(e,p.x-pr.v[0]*dt,p.y-pr.v[1]*dt,p.z-pr.v[2]*dt,p.x,p.y,p.z,0.22);if(!(ih===null?(Math.hypot(e.p.x-p.x,e.p.z-p.z)<r+0.25&&p.y>e.p.y-0.3&&p.y<e.p.y+r*2.6+0.4):ih))continue}{
        if(pr.mine&&!pr.opt.aoe){const[dm,cr]=rollDmg(pr.dmg);const l=Math.hypot(pr.v[0],pr.v[2])||1;let stun=0;const sv=pr.opt.sv;if(sv){const n=(sv.hits.get(e.id)||0)+1;sv.hits.set(e.id,n);if(n>=3){stun=2.5;fxNum(e.p.x,e.p.y+2.6*eSc(e),e.p.z,'OGŁUSZENIE','#ffe066')}}if(pr.opt.src&&!pr.opt.src.startsWith)HIT_SRC=null;HIT_SRC=pr.opt.src||null;const[dm2,cr2]=pr.opt.src?[pr.dmg,false]:[dm,cr];dealHit(e,dm2,cr2,pr.v[0]/l,pr.v[2]/l,0,stun);HIT_SRC=null;if(pr.opt.ench&&!pr.opt.src&&pr.opt.ench!=='wybuch')encHit(e,dm2,pr.opt.ench)}
        pr.hit.add(e.id);if(!pr.opt.pierce){done=true;break}}}
    if(done){if(pr.opt.aoe){if(pr.mine)aoe(p.x,p.y,p.z,pr.opt.aoe,pr.dmg,0,'fire');else ringFx(p.x,p.y,p.z,pr.opt.aoe,'fire');if(pr.kind==='fire'){boomFx(p.x,Math.max(p.y,(h??p.y)),p.z,pr.opt.aoe);if(pr.mine)terrainBlast(p.x,Math.max(p.y,(h??p.y)),p.z,pr.opt.aoe*0.8,true)}}
      else if(pr.kind==='fire'&&pr.life>0){boomFx(p.x,Math.max(p.y,(h??p.y)),p.z,1.6);if(pr.mine)terrainBlast(p.x,Math.max(p.y,(h??p.y)),p.z,1.6,true)}
      else if(pr.kind==='bolt'&&pr.mine&&stick)terrainBlast(p.x,Math.max(p.y,(h??p.y)),p.z,1.15,true);
      if(pr.opt.ench==='wybuch'&&pr.life>0){boomFx(p.x,p.y,p.z,2.6);if(pr.mine){aoe(p.x,p.y,p.z,2.8,pr.dmg*0.7,0,'fire');terrainBlast(p.x,p.y,p.z,2.0,true)}}else if(pr.opt.ench==='ogien'&&stick)PFX.emit(p.x,p.y,p.z,10,ENCH.ogien.fx,{sp:1.5,up:1.5,life:0.6,size:0.1,g:-2});
      if(stick&&pr.kind==='arrow'&&pr.opt.ench!=='wybuch'){const l=Math.hypot(pr.v[0],pr.v[1],pr.v[2])||1;p.x-=pr.v[0]/l*0.22;p.y-=pr.v[1]/l*0.22;p.z-=pr.v[2]/l*0.22;STUCK.push(pr.m);if(STUCK.length>20)scene.remove(STUCK.shift())}else scene.remove(pr.m);if(pr.tr){const T=pr.tr;FTRAIL.push(T)}projs.splice(i,1)}
  }
  for(let i=FTRAIL.length-1;i>=0;i--){const T=FTRAIL[i];T.fade=(T.fade||0)+dt;trailTick(T,null,true);if(T.fade>0.25){trailKill(T);FTRAIL.splice(i,1)}}
}
const FTRAIL=[];
function aoe(x,y,z,r,dmg,slow,kind){
  ringFx(x,y,z,r,kind);sendFx({k:'ring',p:[x,y,z],r,kind});
  for(const e of enemies.values()){if(e.st===2)continue;const dx=e.p.x-x,dz=e.p.z-z,d=Math.hypot(dx,dz);if(eDist(e,x,z)>r+0.3||!eYOk(e,y-1,2,3))continue;
    const[dm,cr]=rollDmg(dmg*rnd(0.9,1.1));dealHit(e,dm,cr,d>0.1?dx/d:0,d>0.1?dz/d:0,slow)}
}
const PFX=(()=>{const N=1400,im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xffffff}),N);im.frustumCulled=false;im.renderOrder=3;scene.add(im);
  const P=[],M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),V=new THREE.Vector3(),C=new THREE.Color();for(let i=0;i<N;i++){P.push({life:0,vis:1});C.set('#ffffff');im.setColorAt(i,C)}let nx=0;
  return{emit(x,y,z,n,col,o){o=o||{};if(SET_G.pfx<1)n=Math.round(n*SET_G.pfx+Math.random()*0.5);for(let k=0;k<n;k++){const p=P[nx];nx=(nx+1)%N;const sp=o.sp??4,a=o.fan!=null?o.fan+(Math.random()-0.5)*(o.fw||0.9):Math.random()*6.283,b=o.flat?Math.random()*0.32-0.12:Math.random()*1.3-0.25;p.x=x+(Math.random()-0.5)*(o.r||0.2);p.y=y+(Math.random()-0.5)*(o.r||0.2);p.z=z+(Math.random()-0.5)*(o.r||0.2);
      p.vx=Math.cos(a)*Math.cos(b)*sp*(0.3+Math.random()*0.7)+(o.dx||0);p.vy=Math.sin(b)*sp*(0.4+Math.random()*0.8)+(o.up??1.2);p.vz=Math.sin(a)*Math.cos(b)*sp*(0.3+Math.random()*0.7)+(o.dz||0);p.max=p.life=(o.life||0.5)*(0.6+Math.random()*0.7);p.s=(o.size||0.09)*(0.6+Math.random()*0.8);p.g=o.g??9;p.dr=o.drag||0;
      C.set(Array.isArray(col)?col[Math.floor(Math.random()*col.length)]:col);im.setColorAt(nx===0?N-1:nx-1,C);if(im.instanceColor)im.instanceColor.needsUpdate=true}},
    tick(dt){for(let i=0;i<N;i++){const p=P[i];if(p.life<=0){if(p.vis){p.vis=0;S.set(0,0,0);M.compose(V.set(0,-999,0),Q,S);im.setMatrixAt(i,M)}continue}p.vis=1;p.life-=dt;p.vy-=p.g*dt;if(p.dr){const k=Math.max(0,1-p.dr*dt);p.vx*=k;p.vy*=k;p.vz*=k}p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;
      const k=Math.max(0,p.life/p.max);S.setScalar(p.s*(0.25+0.75*k));M.compose(V.set(p.x,p.y,p.z),Q,S);im.setMatrixAt(i,M)}im.instanceMatrix.needsUpdate=true}}})();
const BLOODC=t=>/szkielet|lucznik_s|krol_s|lich|upior|mumia|faraon/.test(t)?['#e8e2cc','#cfc8b0','#a8a090']:/slime/.test(t)?['#7ad15a','#a8f080']:/golem|kolos/.test(t)?['#8a8a90','#6a6a70','#b0b0b8']:/zywiolak/.test(t)?['#ffb030','#ff6a1a']:/drzewiec|prastary/.test(t)?['#6b4a2b','#5a9a4a']:['#b8202a','#8a1018','#d8303a'];
const ringGeo=new THREE.RingGeometry(0.82,1,48), rings=[];
function boltFx(pts){for(const p of pts.slice(1))PFX.emit(p[0],p[1],p[2],10,['#cfefff','#ffffff','#8fd8ff'],{sp:5,life:0.3,size:0.06,g:1});const P=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];for(let k=0;k<6;k++){const t0=k/6,t1=(k+1)/6,j=k?0.45:0,j1=k<5?0.45:0;P.push(a[0]+(b[0]-a[0])*t0+(Math.random()-0.5)*j,a[1]+(b[1]-a[1])*t0+(Math.random()-0.5)*j,a[2]+(b[2]-a[2])*t0+(Math.random()-0.5)*j);P.push(a[0]+(b[0]-a[0])*t1+(Math.random()-0.5)*j1,a[1]+(b[1]-a[1])*t1+(Math.random()-0.5)*j1,a[2]+(b[2]-a[2])*t1+(Math.random()-0.5)*j1)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));const l=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xcfefff,transparent:true,opacity:1,fog:false}));scene.add(l);
  for(const p of pts.slice(1))ringFx(p[0],p[1]-1.2,p[2],1.2,'frost');setTimeout(()=>{scene.remove(l);g.dispose();l.material.dispose()},260)}
const RINGC={fire:0xff7a1a,frost:0x8fe9ff,war:0xff5040,lvl:0xffd34d,smoke:0x9a8fb0};
function ringFx(x,y,z,r,kind){{const col={fire:['#ff7a1a','#ffb030','#ffe080'],frost:['#bfe8ff','#ffffff','#8fd8ff'],war:['#ff6040','#ffd0a0','#c8c0b0'],lvl:['#ffd34d','#fff2a0','#ffffff'],smoke:['#9a8fb0','#6a6070','#c8c0d8']}[kind]||['#ffffff'];const n=Math.min(48,Math.round(r*8));for(let i=0;i<n;i++){const a=i/n*6.283;PFX.emit(x+Math.cos(a)*r*0.8,y+0.3,z+Math.sin(a)*r*0.8,1,col,{sp:1.5,up:kind==='smoke'?1:2.2,life:0.6,size:0.1,g:kind==='smoke'?-0.5:4,dx:Math.cos(a)*2,dz:Math.sin(a)*2})}}const m=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:RINGC[kind]||0xffffff,transparent:true,opacity:0.85,side:THREE.DoubleSide,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,y+0.2,z);scene.add(m);rings.push({m,r,t:0})}
function ringTick(dt){for(let i=rings.length-1;i>=0;i--){const g=rings[i];g.t+=dt;const k=Math.min(1,g.t/(g.dur||0.45));if(g.tele){g.tele.scale.setScalar(Math.max(0.01,k*g.r));if(k>=1){scene.remove(g.m);g.m.traverse(o=>o.material&&o.material.dispose());rings.splice(i,1)}continue}g.m.scale.setScalar(0.3+k*g.r);g.m.material.opacity=0.85*(1-k);if(k>=1){scene.remove(g.m);g.m.material.dispose();rings.splice(i,1)}}}

// ---------- niewidzialność (wygląd) ----------
const ghostMat=new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,opacity:0.28,depthWrite:false});
function setGhost(g,on){if(!g||!!g.userData.ghost===on)return;g.userData.ghost=on;g.traverse(o=>{if(!o.isMesh)return;if(on){o.userData.m0=o.material;o.material=ghostMat}else if(o.userData.m0){o.material=o.userData.m0;o.userData.m0=null}})}

// ---------- umiejętności ----------
function useAbility(s){
  const set=abilSet(),c=CLS[set];if(!c||P2.dead||!player.ready||P3[s]>0||invOpen()||uiOpen())return;
  if(VH.mode===3)VH.mode=0;if(VH.mode===5||VH.mode===6)dismountOwn(1);if(VH.mode===1)return;
  const fy=facing(),fx=Math.sin(fy),fz=Math.cos(fy),base=ST.dmg*abilMul(s);let ok=true;
  const hitAround=(r,mult,kb,stun)=>{let n=0;for(const e of enemies.values()){if(e.st===2||e.car)continue;const dx=e.p.x-player.p.x,dz=e.p.z-player.p.z,d=Math.hypot(dx,dz);if(eDist(e,player.p.x,player.p.z)>r+0.3||!eYOk(e,player.p.y,1.9,1.2))continue;const[dm,cr]=rollDmg(base*mult*rnd(0.9,1.1));dealHit(e,dm,cr,(d?dx/d:0)*kb,(d?dz/d:0)*kb,0,stun);n++}return n};
  const fxR=(r,k)=>{ringFx(player.p.x,player.p.y,player.p.z,r,k);sendFx({k:'ring',p:[player.p.x,player.p.y,player.p.z],r,kind:k})};
  switch(s==='e'&&E_OF[set]?E_OF[set]+'e':set+s){
    case 'halabardnikq':player.ry=fy;hitAround(4.2,1.7,3,0);fxR(4.2,'war');sfx('swing');P2.atkT=0.35;break;
    case 'wlocznikq':{player.ry=fy;for(const e of enemies.values()){if(e.st===2||e.car)continue;const np=eNear(e,player.p.x+fx*3.5,player.p.z+fz*3.5),dx=np[0]-player.p.x,dz=np[1]-player.p.z,al=dx*fx+dz*fz,pp=Math.abs(dx*fz-dz*fx);if(al>-0.5&&al<7.5&&pp<1.4&&eYOk(e,player.p.y,1.9,1.2)){const[dm,cr]=rollDmg(base*2.0);dealHit(e,dm,cr,fx*1.5,fz*1.5)}}
      for(let k=1;k<=4;k++){const x=player.p.x+fx*k*1.6,z=player.p.z+fz*k*1.6;ringFx(x,player.p.y,z,0.7,'war');sendFx({k:'ring',p:[x,player.p.y,z],r:0.7,kind:'war'})}sfx('swing');P2.atkT=0.3;break}
    case 'mlotnikq':player.ry=fy;hitAround(4.5,1.6,1.5,1.5);fxR(4.5,'war');fxR(2.5,'smoke');sfx('crit');P2.atkT=0.4;break;
    case 'topornikq':P3.wir={t:1.2,tick:0};break;
    case 'szermierzq':P3.lunge={t:0.22,dir:[fx,fz],set:new Set()};player.ry=fy;sfx('swing');break;
    case 'kusznikq':player.ry=fy;shootFromMe('arrow',base*2.8,0,{pierce:1,sm:1.4});sfx('bow');P2.atkT=0.3;break;
    case 'czarodziejq':{const pts=[[player.p.x,player.p.y+1.4,player.p.z]],hit=new Set();let cur={p:player.p},mul=1.8,rng=16;
      for(let j=0;j<5;j++){let best=null,bd=rng;for(const e of enemies.values()){if(e.st===2||e.car||hit.has(e.id))continue;const d=Math.hypot(e.p.x-cur.p.x,e.p.z-cur.p.z);if(d<bd&&Math.abs(e.p.y-cur.p.y)<5){bd=d;best=e}}
        if(!best)break;hit.add(best.id);const[dm,cr]=rollDmg(base*mul);dealHit(best,dm,cr,0,0,1.2);pts.push([best.p.x,best.p.y+1.2,best.p.z]);cur=best;mul*=0.85;rng=8}
      if(pts.length<2){toast('Brak wroga w zasięgu','#ff8a7a');ok=false;break}boltFx(pts);sendFx({k:'bolt',pts});sfx('crit');P2.atkT=0.28;break}
    case 'wojownikq':P3.charge=0.36;P3.chargeSet=new Set();P3.chargeDir=[fx,fz];player.ry=fy;break;
    case 'wojownike':P3.buff=8*(1+0.1*pk('e'));ringFx(player.p.x,player.p.y,player.p.z,3,'war');sendFx({k:'ring',p:[player.p.x,player.p.y,player.p.z],r:3,kind:'war'});toast('Okrzyk bojowy!',c.col);break;
    case 'lucznikq':shootFromMe('arrow',base*2.2,0,{pierce:1});P2.bowD=0.3;P2.bowT=0.03;P2.bowShot=true;P2.atkT=0.3;break;
    case 'lucznike':{const k=P3.salvoK??1;P3.salvoK=null;P3.salvo={left:3,hits:new Map(),dmg:base*0.95*(0.3+0.7*k),sm:0.4+0.6*k,id:Math.random()};P2.bowT=0;if(k>=0.98)toast('Pełne naciągnięcie!','#ffd34d');break}
    case 'magq':shootFromMe('fire',base*2.2,0,{aoe:3.5});P2.atkT=0.28;break;
    case 'mage':aoe(player.p.x,player.p.y,player.p.z,6,base*1.2,4*(1+0.1*pk('e')),'frost');break;
    case 'lotrzykq':{let best=null,bd=14;for(const e of enemies.values()){if(e.st===2)continue;const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d<bd&&Math.abs(e.p.y-player.p.y)<5){bd=d;best=e}}
      if(!best){toast('Brak wroga w pobliżu','#ff8a7a');ok=false;break}
      const ry=best.ry,nx=best.p.x-Math.sin(ry)*1.3,nz=best.p.z-Math.cos(ry)*1.3,h=colAt(nx,nz);
      ringFx(player.p.x,player.p.y,player.p.z,1.5,'smoke');player.p.set(nx,(h??best.p.y)+0.05,nz);player.v.set(0,0,0);player.ry=ry;
      const[dm]=rollDmg(base*2.5);dealHit(best,dm,true,Math.sin(ry),Math.cos(ry));P2.atkT=0.28;break}
    case 'lotrzyke':P3.stealth=5*(1+0.1*pk('e'));setGhost(meRef,true);ringFx(player.p.x,player.p.y,player.p.z,2.5,'smoke');sendFx({k:'ring',p:[player.p.x,player.p.y,player.p.z],r:2.5,kind:'smoke'});toast('Zasłona dymna','#c9b8e8');break;
  }
  if(ok)P3[s]=cdFor(s);
}
function classTick(dt){
  P3.q-=dt;P3.e-=dt;P3.dash-=dt;
  {const cb=$('chgbar');if(P3.chg){if(!isBow()||P2.dead){P3.chg=null}else{P3.chg.t+=dt;player.ry=facing();P2.atkT=0.1}}if(P3.chg){cb.hidden=false;const k=Math.min(1,P3.chg.t/1.1);cb.firstChild.style.width=(k*100)+'%';cb.classList.toggle('full',k>=1)}else cb.hidden=true}
  if(P3.salvo&&P2.bowT<=0&&!P2.dead){const sv=P3.salvo;if(sv.left>0){sv.left--;P2.bowD=0.21;P2.bowT=P2.bowD;P2.bowShot=false;P2.sv=sv;P2.atkT=0.21;P2.atkCd=0.25}else{P3.salvo=null;P2.sv=null}}P3.buff-=dt;P3.haste-=dt;P3.leap-=dt;
  if(P3.stealth>0){P3.stealth-=dt;if(P3.stealth<=0)setGhost(meRef,false)}
  if(P3.wir){const w=P3.wir;w.t-=dt;w.tick-=dt;player.ry+=dt*16;if(w.tick<=0){w.tick=0.3;sfx('swing');for(const e of enemies.values()){if(e.st===2||e.car)continue;const dx=e.p.x-player.p.x,dz=e.p.z-player.p.z,d=Math.hypot(dx,dz);if(eDist(e,player.p.x,player.p.z)<3.4&&eYOk(e,player.p.y,1.9,1.2)){const[dm,cr]=rollDmg(ST.dmg*0.8*abilMul('q'));dealHit(e,dm,cr,(d?dx/d:0)*1.2,(d?dz/d:0)*1.2)}}ringFx(player.p.x,player.p.y,player.p.z,3.2,'war')}if(w.t<=0)P3.wir=null}
  if(P3.lunge){const L=P3.lunge;L.t-=dt;player.v.x=L.dir[0]*22;player.v.z=L.dir[1]*22;for(const e of enemies.values()){if(e.st===2||e.car||L.set.has(e.id))continue;const dx=e.p.x-player.p.x,dz=e.p.z-player.p.z,d=Math.hypot(dx,dz);if(eDist(e,player.p.x,player.p.z)<1.4&&eYOk(e,player.p.y,1.9,0.9)){L.set.add(e.id);const[dm,cr]=rollDmg(ST.dmg*1.6*abilMul('q'));dealHit(e,dm,cr,L.dir[0]*1.5,L.dir[1]*1.5)}}if(L.t<=0){P3.lunge=null;player.v.x*=0.3;player.v.z*=0.3}}
  if(P3.charge>0){P3.charge-=dt;player.v.x=P3.chargeDir[0]*16;player.v.z=P3.chargeDir[1]*16;
    for(const e of enemies.values()){if(e.st===2||P3.chargeSet.has(e.id))continue;const dx=e.p.x-player.p.x,dz=e.p.z-player.p.z,d=Math.hypot(dx,dz);
      if(eDist(e,player.p.x,player.p.z)<1.4&&eYOk(e,player.p.y,1.9,0.9)){P3.chargeSet.add(e.id);const[dm,cr]=rollDmg(ST.dmg*1.4*abilMul('q'));dealHit(e,dm,cr,(d?dx/d:0)*2.5,(d?dz/d:0)*2.5)}}}
  projTick(dt);ringTick(dt);
}

// ---------- doświadczenie i poziomy ----------
function xpFor(e,plv){return 12*e.lvl*(e.elite?3:1)*Math.min(1.6,Math.max(0.2,1+0.15*(e.lvl-(plv||1))))}
function gainXp(x){
  if(HERO.lvl>=LMAX)return;x=Math.round(x*(hasP('lowca')?1.15:1)*(1+0.04*pk('madrosc')));HERO.xp+=x;fxNum(player.p.x,player.p.y+2.4,player.p.z,'+'+x+' PD','#a7e0ff');
  while(HERO.lvl<LMAX&&HERO.xp>=need(HERO.lvl)){HERO.xp-=need(HERO.lvl);HERO.lvl++;HERO.pts++;ST=stats();P2.hp=ST.hp;
    toast('Awans! Poziom '+HERO.lvl+' · +1 punkt perku','#ffd34d');sfx('lvl');ringFx(player.p.x,player.p.y,player.p.z,3.5,'lvl');sendFx({k:'ring',p:[player.p.x,player.p.y,player.p.z],r:3.5,kind:'lvl'})}
  if(HERO.lvl>=LMAX)HERO.xp=0;saveHero();if(!$('perks').hidden)renderPerks();
}

// ---------- perki ----------
// ---------- drzewko umiejętności (zastępuje listę perków; klucze zgodne z dawnymi perkami) ----------
const NEWP=[['kondycja','Kondycja','Sprint zużywa 12% mniej kondycji, a ta wraca 15% szybciej'],['ogien','Żaroodporność','−15% obrażeń od lawy i kolców w pułapkach'],['galop','Jeździec','Wierzchowce poruszają się 6% szybciej']];
const PMAXK={kondycja:3,ogien:3,galop:3};const pmaxOf=k=>PMAXK[k]||PMAX;
const TREE=[{n:'Walka',c:'#e8644e',nodes:[['sila',0,1,null],['zrecz',1,0,'sila'],['prec',1,2,'sila'],['q',2,0,'zrecz'],['cios',2,2,'prec'],['mistrz',3,0,'q'],['wampir',3,2,'cios'],['e',4,1,'mistrz']]},
 {n:'Przetrwanie',c:'#6cc46d',nodes:[['wytrz',0,1,null],['odp',1,0,'wytrz'],['regen',1,2,'wytrz'],['tarcza',2,0,'odp'],['odnowa',2,2,'regen'],['unik',3,0,'tarcza'],['kondycja',3,2,'odnowa'],['ogien',4,1,'unik']]},
 {n:'Wędrowiec',c:'#5aa6ff',nodes:[['nogi',0,1,null],['skarb',1,0,'nogi'],['sokol',1,2,'nogi'],['opiekun',2,0,'skarb'],['lotnik',2,2,'sokol'],['madrosc',3,0,'opiekun'],['galop',3,2,'lotnik']]}];
const TIER_REQ=[0,2,5,9,14];let treeSel=null;
const perkInfo=k=>perkList().concat(NEWP).find(p=>p[0]===k)||[k,k,''];
const branchPts=B=>B.nodes.reduce((a,n)=>a+pk(n[0]),0);
function nodeState(B,n){const [k,t,,par]=n;if(pk(k)>=pmaxOf(k))return 'max';if(branchPts(B)<TIER_REQ[t])return 'lock';if(par&&pk(par)<1)return 'lock';return HERO.pts>0?'open':'wait'}
function renderTree(){const el=$('perklist');
  el.innerHTML='<div class="tree">'+TREE.map((B,bi)=>{const bp=branchPts(B);let lines='';for(const n of B.nodes){if(!n[3])continue;const p=B.nodes.find(q=>q[0]===n[3]);const on=pk(n[3])>0;lines+=`<line x1="${p[2]*100+50}" y1="${p[1]*100+50}" x2="${n[2]*100+50}" y2="${n[1]*100+50}" stroke="${on?B.c:'#4a3a28'}" stroke-width="${on?6:4}" stroke-dasharray="${on?'':'6 6'}"/>`}
    return `<div class="tbr" style="--bc:${B.c}"><div class="tbh"><b>${B.n}</b><span>${bp} pkt</span></div><div class="tgrid"><svg viewBox="0 0 300 500" preserveAspectRatio="none">${lines}</svg>`+
      [0,1,2,3,4].map(t=>`<div class="ttier" style="top:${t*20}%"><i>${TIER_REQ[t]?TIER_REQ[t]+'+':''}</i></div>`).join('')+
      B.nodes.map(n=>{const [k,t,c]=n,st=nodeState(B,n),r=pk(k),mx=pmaxOf(k),info=perkInfo(k);return `<button class="tnode ${st}${treeSel===k?' sel':''}" data-tn="${k}" data-b="${bi}" style="left:${c*33.33}%;top:${t*20}%"><b>${info[1]}</b><span class="tp">${'■'.repeat(r)}${'□'.repeat(mx-r)}</span></button>`}).join('')+'</div></div>'}).join('')+'</div><div id="tdet"></div>';
  renderTreeDet()}
function renderTreeDet(){const d=$('tdet');if(!d)return;if(!treeSel){d.innerHTML='<p class="sub2">Kliknij umiejętność, żeby zobaczyć opis. Dwuklik dodaje punkt. Kolejne rzędy odblokowujesz, wydając punkty w danej gałęzi (liczba po lewej), a każda umiejętność wymaga punktu w tej, z której wychodzi linia.</p>';return}
  const bi=TREE.findIndex(B=>B.nodes.some(n=>n[0]===treeSel)),B=TREE[bi],n=B.nodes.find(q=>q[0]===treeSel),info=perkInfo(treeSel),st=nodeState(B,n),r=pk(treeSel),mx=pmaxOf(treeSel);
  let req='';if(st==='lock'){const par=n[3]?perkInfo(n[3])[1]:null;req=branchPts(B)<TIER_REQ[n[1]]?`Wymaga ${TIER_REQ[n[1]]} pkt w gałęzi „${B.n}” (masz ${branchPts(B)}).`:`Wymaga co najmniej 1 punktu w: ${par}.`}
  d.innerHTML=`<div class="tdc" style="--bc:${B.c}"><div><h3>${info[1]} <small>${r}/${mx}</small></h3><p>${info[2]} <em>(za każdy punkt)</em></p>${req?`<p class="treq">🔒 ${req}</p>`:''}</div><button class="pri" id="tadd" ${st==='open'?'':'disabled'}>${st==='max'?'Maksimum':'+ Dodaj punkt'}</button></div>`;
  const b=$('tadd');if(b)b.onclick=()=>treeAdd(treeSel)}
function treeAdd(k){const bi=TREE.findIndex(B=>B.nodes.some(n=>n[0]===k));if(bi<0)return;const B=TREE[bi],n=B.nodes.find(q=>q[0]===k);if(nodeState(B,n)!=='open')return;HERO.perks[k]=pk(k)+1;HERO.pts--;saveHero();ST=stats();sfx('lvl',0.4);renderPerks()}

function perkList(){const l=GENPERKS.slice();{l.push(['q','Pierwsza umiejętność (Q)','−8% czasu odnowienia i +12% obrażeń']);l.push(['e','Druga umiejętność (E)','−8% czasu odnowienia i +10% dłuższe działanie'])}return l}
function renderPerks(){
  setTimeout(()=>{const box=document.getElementById('skillbox');if(!box)return;box.innerHTML='<h2 style="margin-top:14px">Umiejętności (rosną same od używania)</h2>'+SKILLS.map(([k,n,d])=>{const l=skL(k),x=(HERO.sk&&HERO.sk[k])||0,a=12*l*l,b=12*(l+1)*(l+1),pr=l>=50?100:Math.round((x-a)/(b-a)*100);return `<div class="perk"><div><b>${n} · poz. ${l}</b><span>${d}</span></div><div class="skbar"><i style="width:${pr}%"></i></div><div></div></div>`}).join('')},0);
  $('perkhead').innerHTML='Poziom <b>'+HERO.lvl+'</b> · punkty do rozdania: <b class="tpts">'+HERO.pts+'</b>';
  renderTree();
}
$('perklist').onclick=e=>{const b=e.target.closest('[data-tn]');if(!b)return;treeSel=b.dataset.tn;renderTree()};$('perklist').ondblclick=e=>{const b=e.target.closest('[data-tn]');if(!b)return;treeSel=b.dataset.tn;treeAdd(treeSel)};
$('perkreset').onclick=()=>{HERO.pts+=Object.values(HERO.perks).reduce((a,b)=>a+b,0);HERO.perks={};saveHero();ST=stats();P2.hp=Math.min(P2.hp,ST.hp);renderPerks()};
function togglePerks(){const v=$('perks');v.hidden=!v.hidden;if(!v.hidden){try{document.exitPointerLock()}catch(e){}renderPerks()}}
$('perkbtn').onclick=togglePerks;$('perkclose').onclick=togglePerks;

// ---------- wybór pasywek ----------
let PSEL=[];
function renderClsel(){
  $('clcards').innerHTML=PASS.map(([k,n,d])=>`<button class="clcard${PSEL.includes(k)?' sel':''}" data-pas="${k}"><b>${n}</b><span>${d}</span></button>`).join('');
  $('pascount').textContent='Wybrano: '+PSEL.length+' / 3';$('pasok').disabled=PSEL.length!==3;$('clclose').hidden=!(HERO.pas&&HERO.pas.length===3);
}
function openClsel(){PSEL=(HERO.pas||[]).slice();renderClsel();$('clsel').hidden=false;try{document.exitPointerLock()}catch(e){}}
$('clcards').onclick=e=>{const b=e.target.closest('[data-pas]');if(!b)return;const k=b.dataset.pas,i=PSEL.indexOf(k);if(i>=0)PSEL.splice(i,1);else if(PSEL.length<3)PSEL.push(k);renderClsel()};
$('pasok').onclick=()=>{if(PSEL.length!==3)return;const first=!HERO.pas;setTimeout(()=>{if(!S.look)openCustom()},50);HERO.pas=PSEL.slice();saveHero();ST=stats();$('clsel').hidden=true;toast(first?'Pasywki wybrane. Powodzenia!':'Pasywki zmienione','#ffd34d');renderInv&&invOpen()&&renderInv()};
$('clclose').onclick=()=>$('clsel').hidden=true;
$('chgcls').onclick=()=>{toggleMenu();openClsel()};

function poseExtra(g,w,block,sh){const u=g.userData;if(!u||!u.la)return;
  u.blockPose=!!(block&&sh);if(block&&sh){u.la.rotation.x=-1.45;u.la.rotation.z=0.45;u.la.rotation.y=0.3;if(u.le)u.le.rotation.x=-0.35;return}}
function sneakHud(){{const k=$('abe')&&$('abe').querySelector('kbd'),t=INV.eq.tarcza?'C':'PPM';if(k&&k.textContent!==t)k.textContent=t}const el=$('snk');if(!el)return;if(!P3.sneak){if(!el.hidden)el.hidden=true;return}el.hidden=false;let det=0,seen=false;for(const e of enemies.values()){if(e.st===2||e.pas)continue;if(e.tgId===NET.id){seen=true;break}if(Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z)<30)det=Math.max(det,e.det||0)}
  el.className=seen?'seen':det>0.05?'warn':'';el.querySelector('b').textContent=seen?'Wykryty!':det>0.05?'Ktoś coś słyszy…':'Ukryty';el.querySelector('i').style.width=(seen?100:Math.min(100,det*100))+'%'}
function updHud3(){
  const c=CLS[abilSet()];$('lvl').textContent=HERO.lvl;$('xpb').style.width=(HERO.lvl>=LMAX?100:HERO.xp/need(HERO.lvl)*100)+'%';
  $('xpt').textContent=HERO.lvl>=LMAX?'Maks. poziom':HERO.xp+' / '+need(HERO.lvl)+' PD';
  $('pts').textContent=HERO.pts;$('pts').hidden=HERO.pts<=0;
  {const el=$('abd'),cd=Math.max(0,P3.dash);el.querySelector('i').style.height=(cd>0?cd/2.2*100:0)+'%';el.querySelector('em').textContent=cd>0?Math.ceil(cd):'';el.classList.toggle('ready',cd<=0)}
  for(const s of ['q','e']){const el=$('ab'+s);if(!c){el.hidden=true;continue}el.hidden=false;el.querySelector('span').textContent=c[s].n;
    const cd=Math.max(0,P3[s]),tot=cdFor(s);el.querySelector('i').style.height=(cd>0?cd/tot*100:0)+'%';el.querySelector('em').textContent=cd>0?Math.ceil(cd):'';el.classList.toggle('ready',cd<=0)}
  {let cb=document.getElementById('cdbar');if(!cb){cb=document.createElement('div');cb.id='cdbar';cb.innerHTML=['roll','q','e','luck'].map(k=>`<div class="cdi" data-k="${k}"><span><i></i></span><div class="cdt"><b></b><em></em></div></div>`).join('');document.body.appendChild(cb)}
    const it=[['roll','Unik (Ctrl)',Math.max(0,P2.rollCd||0),2.6],['q',c?'Q: '+c.q.n:'',c?Math.max(0,P3.q):0,c?cdFor('q'):1],['e',c?'E: '+c.e.n:'',c?Math.max(0,P3.e):0,c?cdFor('e'):1],['luck','Szczęście (0)',Math.max(0,LUCK.cd),300]];
    for(const [k,n,cd,tot] of it){const el=cb.querySelector(`[data-k="${k}"]`);if(!n){el.hidden=true;continue}el.hidden=false;if(el._n!==n){el._n=n;el.querySelector('b').textContent=n}el.querySelector('i').style.width=(cd>0?100-cd/tot*100:100)+'%';el.querySelector('em').textContent=cd>0?(cd>=60?Math.floor(cd/60)+':'+String(Math.ceil(cd%60)).padStart(2,'0'):cd.toFixed(cd<10?1:0)+' s'):'gotowe';el.classList.toggle('rdy',cd<=0)}}
  $('buffs').textContent=[P3.buff>0?'Okrzyk '+Math.ceil(P3.buff)+' s':'',P3.haste>0?'Pęd '+Math.ceil(P3.haste)+' s':'',P3.stealth>0?'Niewidzialny '+Math.ceil(P3.stealth)+' s':''].filter(Boolean).join(' · ');
}
$('abq').onclick=()=>useAbility('q');$('abe').onclick=()=>useAbility('e');
$('abd').onclick=()=>dash();
{const k=$('abe').querySelector('kbd');if(k)k.textContent='PPM'}


