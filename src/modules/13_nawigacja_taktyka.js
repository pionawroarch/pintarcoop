/* v152: wrogowie nie wchodzą w dziury i przepaście — zejście najwyżej o ~2 bloki, z podglądem krawędzi przed sobą */
function eUnstick(e,tg){const dx=tg.p.x-e.p.x,dz=tg.p.z-e.p.z,l=Math.hypot(dx,dz)||1,ux=dx/l,uz=dz/l,sc=Math.max(1,eSc(e));
  for(const dist of [1.3*sc,2.2*sc,3.2*sc])for(const da of [0,0.45,-0.45,0.9,-0.9]){const c=Math.cos(da),s=Math.sin(da),vx=ux*c-uz*s,vz=ux*s+uz*c,x=e.p.x+vx*dist,z=e.p.z+vz*dist,h=colAt(x,z,e.p.y+3.6);if(h===null)continue;
    if(h-e.p.y>3.4||e.p.y-h>3.5)continue;if(solidAt(x,h+0.9,z)||solidAt(x,h+1.6,z))continue;/* v160: po drodze nie może być muru ani zbyt wysokiej przeszkody (żadnych skoków przez mury miast) */{let bad=false;for(let t=0.5;t<dist&&!bad;t+=0.5){const px=e.p.x+vx*t,pz=e.p.z+vz*t,hm=colAt(px,pz,e.p.y+3.6);if(hm!==null&&hm-e.p.y>3.4)bad=true;else{const yy=Math.max(e.p.y,hm??e.p.y)+0.9;if(solidAt(px,yy,pz)||solidAt(px,yy+0.8,pz))bad=true}}if(bad)continue}if(VOX.size&&eSc(e)<2.6&&voxProbe(x,z,h,0.3,1.5).block)continue;
    const wet=wetAt(x,z,h);e.p.x=x;e.p.z=z;e.p.y=wet?eWadeY(x,z,h,e):h;e.vx=vx*2;e.vz=vz*2;e.climbT=0.25;e.wade=wet?0.25:0.4;return true}
  return false}
function eLedgeOk(e,nx,nz,h){const sc=Math.max(1,eSc(e)),lim=2.1*Math.min(2,sc);if(e.p.y-h>=lim)return false;const vx=nx-e.p.x,vz=nz-e.p.z,l=Math.hypot(vx,vz)||1,ah=0.9*sc;const h2=colAt(nx+vx/l*ah,nz+vz/l*ah,e.p.y);if(h2===null)return false;if(h-h2>lim&&!wetAt(nx+vx/l*ah,nz+vz/l*ah,h2))return false;return true}
// ===== NAWIGACJA WROGÓW: siatka 1 m z pamięcią podręczną, A* wokół budynków, murów, wody i urwisk =====
const NAV={c:new Map(),cs:new Map(),t:0,budget:0,R:26};
const NAVN=(NAV.R*2+1)*(NAV.R*2+1),NAVG=new Float32Array(NAVN),NAVF=new Float32Array(NAVN),NAVP=new Int32Array(NAVN),NAVS=new Uint8Array(NAVN),NAVH=new Int32Array(NAVN+8);
function navCell(ix,iz,y){const sp=y>450,M=sp?NAV.cs:NAV.c,k=vkey(ix,iz);let v=M.get(k);if(v!==undefined)return v;const x=ix+0.5,z=iz+0.5,h=colAt(x,z,sp?y:undefined);
  if(h===null)v=-1;else if(sp)v=h>y+6?-1:h;else if(wetAt(x,z,h))v=Math.max(h,Math.max(WATER,wlAt(x,z))-0.8);else if(VOX.size&&voxProbe(x,z,h,0.3,1.6).block)v=-1;else if(solidAt(x,h+0.9,z))v=-1;else v=h;
  M.set(k,v);return v}
const NDI=[1,-1,0,0,1,1,-1,-1],NDJ=[0,0,1,-1,1,-1,1,-1];
const navStep=(ha,hb)=>hb>=0&&hb-ha<=1.05&&ha-hb<=3.6;
// czy da się przejść po prostej (próbkowanie co 0,5 m)
function navLine(x0,z0,x1,z1,y,maxD){const dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz);if(L<0.6)return true;const D=Math.min(L,maxD||16),n=Math.ceil(D/0.5);let pi=Math.floor(x0),pj=Math.floor(z0),ph=navCell(pi,pj,y);if(ph<0)ph=colAt(x0,z0,y>450?y:undefined)??y;
  for(let k=1;k<=n;k++){const t=k/n*D/L,ix=Math.floor(x0+dx*t),iz=Math.floor(z0+dz*t);if(ix===pi&&iz===pj)continue;const h=navCell(ix,iz,y);if(!navStep(ph,h))return false;
    if(ix!==pi&&iz!==pj){if(navCell(ix,pj,y)<0||navCell(pi,iz,y)<0)return false}pi=ix;pj=iz;ph=h}return true}
// A* w oknie 53×53 m wokół startu; zwraca listę punktów [x,z] (po wygładzeniu) albo null
function navPath(sx,sz,tx,tz,y,maxN){const R=NAV.R,W=R*2+1,ox=Math.floor(sx)-R,oz=Math.floor(sz)-R,six=R,siz=R;let tix=Math.floor(tx)-ox,tiz=Math.floor(tz)-oz;
  NAVS.fill(0);let hn=0;const push=(i,f)=>{let c=hn++;NAVF[i]=f;while(c>0){const p2=(c-1)>>1;if(NAVF[NAVH[p2]]<=f)break;NAVH[c]=NAVH[p2];c=p2}NAVH[c]=i},pop=()=>{const top=NAVH[0],last=NAVH[--hn];if(hn>0){const f=NAVF[last];let c=0;for(;;){let ch=c*2+1;if(ch>=hn)break;if(ch+1<hn&&NAVF[NAVH[ch+1]]<NAVF[NAVH[ch]])ch++;if(NAVF[NAVH[ch]]>=f)break;NAVH[c]=NAVH[ch];c=ch}NAVH[c]=last}return top};
  const hh=(i,j)=>{const a=Math.abs(i-tix),b=Math.abs(j-tiz);return Math.max(a,b)+0.414*Math.min(a,b)};
  const s0=siz*W+six;NAVG[s0]=0;NAVP[s0]=-1;NAVS[s0]=1;push(s0,hh(six,siz));let best=s0,bh=hh(six,siz),exp=0;
  let sh=navCell(six+ox,siz+oz,y);if(sh<0)sh=colAt(sx,sz,y>450?y:undefined)??y;const HT=new Map();HT.set(s0,sh);
  while(hn>0&&exp<maxN){const cur=pop();if(NAVS[cur]===2)continue;NAVS[cur]=2;exp++;const ci=cur%W,cj=(cur-ci)/W,ch=HT.get(cur),hd=hh(ci,cj);if(hd<bh){bh=hd;best=cur}if(ci===tix&&cj===tiz){best=cur;break}
    for(let d=0;d<8;d++){const di=NDI[d],dj=NDJ[d],ni=ci+di,nj=cj+dj;if(ni<0||nj<0||ni>=W||nj>=W)continue;const nk=nj*W+ni;if(NAVS[nk]===2)continue;const nh=navCell(ni+ox,nj+oz,y);if(!navStep(ch,nh))continue;
      if(d>3){const a=navCell(ci+di+ox,cj+oz,y),b=navCell(ci+ox,cj+dj+oz,y);if(!navStep(ch,a)||!navStep(ch,b))continue}
      const g=NAVG[cur]+(d>3?1.414:1)+(nh>ch?0.4:0);if(NAVS[nk]===1&&g>=NAVG[nk])continue;NAVG[nk]=g;NAVP[nk]=cur;NAVS[nk]=1;HT.set(nk,nh);push(nk,g+hh(ni,nj)*1.05)}}
  if(best===s0)return null;const pts=[];for(let c=best;c!==-1;c=NAVP[c]){const ci=c%W,cj=(c-ci)/W;pts.push([ci+ox+0.5,cj+oz+0.5])}pts.reverse();pts[0]=[sx,sz];
  // wygładzanie: pomijaj punkty, do których da się dojść po prostej
  const out=[pts[0]];let a=0;while(a<pts.length-1){let b=Math.min(pts.length-1,a+12);while(b>a+1&&!navLine(pts[a][0],pts[a][1],pts[b][0],pts[b][1],y,40))b--;out.push(pts[b]);a=b}
  out.done=best===(tiz*W+tix);return out}
// kierunek ruchu do celu z omijaniem przeszkód; null = idź prosto
function navSteer(e,gx,gz,dt){const d=EDEF[e.t];if(d.fly||d.swim||e.car||d.passive||eSc(e)>=2.6)return null;const dist=Math.hypot(gx-e.p.x,gz-e.p.z);if(dist<1.2){e.path=null;return null}
  e.nt=(e.nt||0)-dt;e.stT=(e.stT||0)+dt;if(e.stT>0.7){const mv=Math.hypot(e.p.x-(e.sx??e.p.x+9),e.p.z-(e.sz??e.p.z));e.stuck=mv<0.3;e.sx=e.p.x;e.sz=e.p.z;e.stT=0;if(e.stuck){e.nt=0;e.path=null}}
  if(e.path){const P=e.path.p;while(e.path.i<P.length&&Math.hypot(P[e.path.i][0]-e.p.x,P[e.path.i][1]-e.p.z)<0.75)e.path.i++;
    if(e.path.i>=P.length)e.path=null;else if(e.nt<=0||Math.hypot(gx-e.path.gx,gz-e.path.gz)>3.5){if(navLine(e.p.x,e.p.z,gx,gz,e.p.y,16)&&!e.stuck){e.path=null;e.nt=0.3+Math.random()*0.2}else if(NAV.budget>0){NAV.budget--;const N=navPath(e.p.x,e.p.z,gx,gz,e.p.y,e.p.y>450?1600:700);e.nt=0.8+Math.random()*0.5;e.path=N&&N.length>1?{p:N,i:1,gx,gz}:null}else e.nt=0.15}}
  if(!e.path){if(e.nt>0&&!e.stuck)return e.blk?[0,0]:null;
    if(!e.stuck&&navLine(e.p.x,e.p.z,gx,gz,e.p.y,16)){e.nt=0.3+Math.random()*0.2;e.blk=0;return null}
    if(NAV.budget<=0){e.nt=0.1;return null}NAV.budget--;const N=navPath(e.p.x,e.p.z,gx,gz,e.p.y,e.p.y>450?1600:700);e.nt=0.8+Math.random()*0.5;e.stuck=false;
    if(!N||N.length<2){e.blk=1;return[0,0]}e.blk=0;e.path={p:N,i:1,gx,gz}}
  const w=e.path.p[e.path.i],wx=w[0]-e.p.x,wz=w[1]-e.p.z,l=Math.hypot(wx,wz)||1;return[wx/l,wz/l]}
// czy strzelec widzi cel (ściany, teren)
function losClear(e,tg){const x0=e.p.x,y0=e.p.y+1.3*eSc(e),z0=e.p.z,x1=tg.p.x,y1=tg.p.y+1.1,z1=tg.p.z,L=Math.hypot(x1-x0,y1-y0,z1-z0),n=Math.ceil(L/0.9);for(let k=1;k<n;k++){const t=k/n,x=x0+(x1-x0)*t,y=y0+(y1-y0)*t,z=z0+(z1-z0)*t,h=colAt(x,z,y);if(h!==null&&h>y+0.2)return false;if(y<450&&solidAt(x,y,z))return false}return true}
// ===== TAKTYKA GRUPOWA: okrążanie celu (miejsca wokół celu), drugi szereg czeka, ataki na zmianę =====
const TAC={t:0,clk:0,atk:new Map()};
function tacticsTick(dt,pl){TAC.t-=dt;if(TAC.t>0)return;TAC.t=0.4;const G=new Map();
  for(const e of enemies.values()){if(e.st===2||!e.tgId||e.car)continue;const d=EDEF[e.t];if(d.passive||d.swim||d.fly||d.boss||d.ranged||eSc(e)>=2.6){e.slot=null;continue}let L=G.get(e.tgId);if(!L){L=[];G.set(e.tgId,L)}L.push(e)}
  const comps=compTargets();
  for(const [id,L] of G){const tg=pl.find(p=>p.id===id)||comps.find(c=>c.id===id);if(!tg||L.length<2){for(const e of L)e.slot=null;continue}
    for(const e of L)e._td=Math.hypot(e.p.x-tg.p.x,e.p.z-tg.p.z);L.sort((a,b)=>a._td-b._td);const near=L.filter(e=>e._td<14),inner=near.slice(0,6),outer=near.slice(6);for(const e of L)if(e._td>=14)e.slot=null;
    const ring=(M,rad,out)=>{const n=M.length;if(!n)return;for(const e of M)e._a=Math.atan2(e.p.x-tg.p.x,e.p.z-tg.p.z);M.sort((a,b)=>a._a-b._a);let sx=0,sy=0;M.forEach((e,i)=>{const o=e._a-i*6.2832/n;sx+=Math.cos(o);sy+=Math.sin(o)});const a0=Math.atan2(sy,sx);M.forEach((e,i)=>{e.slot={id,a:a0+i*6.2832/n,r:rad(e),out}})};
    ring(inner,e=>Math.max(1.1,eReach(e)*0.82),0);ring(outer,e=>eReach(e)+2.8,1)}}
function sepOk(e,x,z){if(e.st===2||e.car)return false;const d=EDEF[e.t];if(e.p.y>450){const rr=0.4*Math.max(1,Math.min(3,eSc(e)));for(const [ox,oz] of [[0,0],[rr,0],[-rr,0],[0,rr],[0,-rr]]){const hh=colAt(x+ox,z+oz,e.p.y);if(hh!==null&&hh-e.p.y>(d.fly?-0.3:1.05))return false}}if(d.fly)return true;const h=colAt(x,z,e.p.y);if(h===null)return false;if(d.swim)return h<WATER-1.6;if(wetAt(x,z,h))return true;return Math.abs(h-e.p.y)<=1.05}
function simEnemies(dt){
  const pl=playersList().filter(p=>!p.dead);
  NAV.budget=3;NAV.t-=dt;if(NAV.t<=0||NAV.c.size>90000){NAV.t=4;NAV.c.clear();NAV.cs.clear()}
  TAC.clk+=dt;try{tacticsTick(dt,pl)}catch(err){console.warn('taktyka',err)}
  for(const e of enemies.values()){
    const d=EDEF[e.t]; e.flash-=dt*4; e.cd-=dt;if(e.dot&&e.st!==2)dotTick(e,dt);
    if(e.st===2){e.dieT-=dt;if(e.dieT<=0)removeEnemy(e.id);continue}
    let tg=null,td=1e9;const ag=e.prov>0?28:d.aggro*(e.elite?1.3:1)*(typeof wxAggro==='function'?wxAggro():1),night=hour<5.5||hour>20.5;let seeS=false;
    if(e.peace){const P=e.peaceTo||player.p;if(P){const dx=P.x-e.p.x,dz=P.z-e.p.z,dd=Math.hypot(dx,dz);if(dd>(e.peaceTo?2:4.2)){tg={id:'post',p:{x:P.x,y:e.p.y,z:P.z},comp:'post'};td=dd+99}}}
    if(e.route)guardRoute(e);
    if(e.peace){}else if(d.ally){let bd=30;for(const o of enemies.values()){if(o===e||o.st===2||o.car||EDEF[o.t].ally||EDEF[o.t].passive)continue;const dd=Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z);if(dd<bd&&Math.abs(o.p.y-e.p.y)<6){bd=dd;tg={id:'e:'+o.id,p:o.p,comp:'foe',e:o};td=dd}}
      if(!tg&&e.post){const dx=e.post[0]-e.p.x,dz=e.post[1]-e.p.z;if(Math.hypot(dx,dz)>3){tg={id:'post',p:{x:e.post[0],y:e.p.y,z:e.post[1]},comp:'post'};td=Math.hypot(dx,dz)+99}}}
    else if(e.aggro&&e.aggro.t>0){e.aggro.t-=dt;const p=pl.find(q=>q.id===e.aggro.id);let ok=p&&!p.sl&&!p.stl;if(ok&&d.swim){const ph=colAt(p.p.x,p.p.z);ok=p.p.y<WATER+1.8&&ph!==null&&ph<WATER-0.4}if(ok){tg=p;td=Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)}else e.aggro=null}
    if(!tg&&!d.ally&&!e.peace)for(const p of pl){if(p.stl)continue;if(d.swim){const ph=colAt(p.p.x,p.p.z);if(!(p.p.y<WATER+1.8&&ph!==null&&ph<WATER-0.4))continue}if(e.home&&Math.hypot(p.p.x-e.home[0],p.p.z-e.home[1])>(d.boss?28:34))continue;const dd=Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z);if(Math.abs(p.p.y-e.p.y)>=8)continue;
      if(p.snk&&!d.boss){const fx=Math.sin(e.ry),fz=Math.cos(e.ry),cs=dd>0.01?((p.p.x-e.p.x)*fx+(p.p.z-e.p.z)*fz)/dd:1,eff=ag*0.45*(cs<-0.2?0.55:1)*(night?0.75:1);
        if(dd<eff){seeS=true;e.det=Math.min(1.2,(e.det||0)+dt*(0.5+2.2*(1-dd/eff)));if(e.det<1)continue}else continue}
      if(dd<ag&&dd<td){tg=p;td=dd}}
    if(!seeS&&e.det)e.det=Math.max(0,e.det-dt*0.35);
    if(!tg&&BIO.PRED.has(e.t)&&isAuth()&&!e.car&&!e.sid){e.huntT=(e.huntT||0)-dt;if(e.huntT<=0||e.prey){e.huntT=rnd(3,6);const pr=e.prey&&e.prey.e.st!==2&&enemies.has(e.prey.e.id)?e.prey:preyFor(e);e.prey=pr;if(pr){tg=pr;td=Math.hypot(pr.p.x-e.p.x,pr.p.z-e.p.z)}}}
    if(!d.ally&&!d.passive&&!d.swim&&!e.peace&&isAuth()&&!(e.aggro&&e.aggro.t>0)){let forced=null;for(const c of compTargets()){const dd=Math.hypot(c.p.x-e.p.x,c.p.z-e.p.z);if(Math.abs(c.p.y-e.p.y)>=8)continue;if(e.aggroC&&e.aggroC.t>0&&e.aggroC.id===c.id&&dd<40){forced=[c,dd];break}if(e.home&&Math.hypot(c.p.x-e.home[0],c.p.z-e.home[1])>34)continue;
        if(dd<ag&&(!tg||dd*0.8<td||(e.tgId===c.id&&dd<td*1.3))){tg=c;td=dd}}if(forced){tg=forced[0];td=forced[1]}if(e.aggroC)e.aggroC.t-=dt}
    e.tgId=tg?tg.id:null;
    if(!tg&&e.alert&&e.alert.t>0&&!d.passive){e.alert.t-=dt}
    e.prov-=dt;
    if(tg&&!d.passive){if(!e.seen){e.seen=1;for(const o of enemies.values())if(o!==e&&o.st!==2&&!EDEF[o.t].passive&&!o.car&&!o.peace&&Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z)<AIP.alertR)o.prov=Math.max(o.prov,6)}
      if(!d.boss&&!e.fled&&e.hp/e.max<AIP.fleeHP){e.fled=1;if(Math.random()<(HUM[e.t]?AIP.fleeH:AIP.fleeA)){e.flee=rnd(2.5,4);e.fleeTo=null;let bd=0;for(const o of enemies.values()){if(o===e||o.st===2||EDEF[o.t].passive||o.car||EDEF[o.t].swim)continue;const de=Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z);if(de>30||de<3)continue;const dt2=Math.hypot(o.p.x-tg.p.x,o.p.z-tg.p.z);if(dt2>bd&&dt2>td){bd=dt2;e.fleeTo=o}}if(e.fleeTo){const o=e.fleeTo;for(const q of enemies.values())if(q.st!==2&&!EDEF[q.t].passive&&Math.hypot(q.p.x-o.p.x,q.p.z-o.p.z)<10){q.prov=Math.max(q.prov||0,10);if(!q.tgId)q.alert={x:tg.p.x,z:tg.p.z,t:9}}}}}}else if(!tg)e.seen=0;
    let mx=0,mz=0,sp=d.spd*(e.elite?1.1:1)*(e.slow>0?0.45:1);e.slow=(e.slow||0)-dt;
    if(e.stun>0){e.stun-=dt;e.vx*=Math.max(0,1-6*dt);e.vz*=Math.max(0,1-6*dt);const h=colAt(e.p.x+e.vx*dt,e.p.z+e.vz*dt,e.p.y);if(h!==null&&Math.abs(h-e.p.y)<1.1){e.p.x+=e.vx*dt;e.p.z+=e.vz*dt;e.p.y+=(h-e.p.y)*Math.min(1,14*dt)}e.speed=0;continue}
    if(e.enraged)sp*=1.3;
    const B=d.boss&&e.wind<=0?bossAI(e,d,tg,td,dt):null;
    const PA=e.car?caravanMove(e,dt):d.passive?passiveAI(e,dt):null;
    if(PA){mx=PA[0];mz=PA[1];sp*=PA[2]}
    else if(B){mx=B[0];mz=B[1];sp=B[2]}
    else if(e.wind>0){e.wind-=dt;e.st=1;
      if(e.wind<=0){e.st=0;
        if(e.rw){e.rw=0;e.cd=d.ranged.cd;if(tg&&tg.comp){compHurt(tg,eDmg(e),e);sfx('bow',0.4)}else if(tg)enemyShoot(e,tg,d.ranged.proj,eDmg(e))}
        else{e.cd=d.cd*rnd(0.85,1.15);if(!HUM[e.t]&&!d.boss&&eSc(e)<1.8&&Math.random()<0.45)e.backT=rnd(0.35,0.7);if(tg&&td<eReach(e)+0.6&&Math.abs(tg.p.y-e.p.y)<2.6+eSc(e)*(d.swim?1.2:0.8)){if(tg.comp)compHurt(tg,eDmg(e),e);else hurtPlayer(tg.id,eDmg(e),e)}}}
    } else if(e.flee>0&&tg){e.flee-=dt;let dx=e.p.x-tg.p.x,dz=e.p.z-tg.p.z,l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const fo=e.fleeTo;if(fo&&fo.st!==2){const ax=fo.p.x-e.p.x,az=fo.p.z-e.p.z,al=Math.hypot(ax,az);if(al>2.5){const S2=navSteer(e,fo.p.x,fo.p.z,dt);if(S2){dx=dx*0.3+S2[0];dz=dz*0.3+S2[1]}else{dx=dx*0.5+ax/al;dz=dz*0.5+az/al}}else e.flee=Math.min(e.flee,0.3)}l=Math.hypot(dx,dz)||1;mx=dx/l;mz=dz/l;sp*=1.15;e.ry=Math.atan2(mx,mz);if(e.flee<=0){e.prov=10;e.hp=Math.min(e.max,e.hp+e.max*0.1)}
    } else if(tg){
      const dx=tg.p.x-e.p.x,dz=tg.p.z-e.p.z;e.ry=Math.atan2(dx,dz);const px=-dz/td,pz=dx/td,side=e.id%2?1:-1;
      // unik przed ciosem gracza (elity i humanoidy)
      e.dgc=(e.dgc||0)-dt;e.guard=(e.guard||0)-dt;if(tg.id===NET.id&&P2.atkT>0.18&&td<2.8&&e.dgc<=0&&(e.elite||HUM[e.t])&&e.cd>0.2){e.dgc=2.2;const r=Math.random();if(r<AIP.dodgeP){e.vx-=dx/td*7;e.vz-=dz/td*7}else if(HUM[e.t]&&r<AIP.dodgeP+0.3)e.guard=0.55}
      if(d.ranged){e.losT=(e.losT||0)-dt;if(e.losT<=0){e.losT=0.35+Math.random()*0.2;e.los=td<d.ranged.rng+4?losClear(e,tg):true}}
      if(d.ranged&&td<d.ranged.rng&&td>3.2&&e.los===false){const S2=navSteer(e,tg.p.x,tg.p.z,dt);if(S2){mx=S2[0];mz=S2[1]}else{mx=dx/td;mz=dz/td}if(mx||mz)e.ry=Math.atan2(mx,mz)}
      else if(d.ranged&&td<d.ranged.rng&&td>3.2){if(td<AIP.kiteR){mx=-dx/td+px*side*0.5;mz=-dz/td+pz*side*0.5;sp*=0.6}else{e.strT=(e.strT||0)-dt;if(e.strT<=0){e.strT=rnd(0.9,2.2);e.strS=Math.random()<0.5?1:-1}mx=px*e.strS;mz=pz*e.strS;sp*=AIP.strafeK}if(e.cd<=0){e.wind=0.6;e.st=1;e.rw=1}}
      else{const SL=e.slot&&e.slot.id===tg.id?e.slot:null,rch=eReach(e);let gx=tg.p.x,gz=tg.p.z;if(td>rch+1.5){const tv=tg.id===NET.id?player.v:tg.v;if(tv){const lead=Math.min(0.6,td/Math.max(4,d.spd)*0.5);gx+=tv.x*lead;gz+=tv.z*lead}}
       if(SL&&td<11){gx=tg.p.x+Math.sin(SL.a)*SL.r;gz=tg.p.z+Math.cos(SL.a)*SL.r}
       if(e.backT>0){e.backT-=dt;mx=-dx/td+px*side*0.6;mz=-dz/td+pz*side*0.6;const l=Math.hypot(mx,mz)||1;mx/=l;mz/=l;sp*=0.75}
       else if(tg.id===NET.id&&(P2.bowT>0||P2.castT>0||P3.chg)&&td>5&&td<26&&(e.elite||HUM[e.t]||d.spd>5)){e.zz=(e.zz||0)-dt;if(e.zz<=0){e.zz=rnd(0.5,1.1);e.zs=Math.random()<0.5?1:-1}mx=dx/td*0.75+px*e.zs*0.9;mz=dz/td*0.75+pz*e.zs*0.9;const l=Math.hypot(mx,mz)||1;mx/=l;mz/=l;sp*=1.05}// zygzak pod ostrzałem
       else if(td>rch||(SL&&SL.out&&td>rch*0.9)){const S2=navSteer(e,gx,gz,dt);
        if(S2){mx=S2[0];mz=S2[1];if(mx||mz)e.ry=Math.atan2(mx,mz)}
        else if(SL&&td<11){const sx=gx-e.p.x,sz=gz-e.p.z,sl=Math.hypot(sx,sz);if(sl>0.5){mx=sx/sl;mz=sz/sl;if(SL.out)sp*=0.55}}
        else{let c=0;for(const o of enemies.values())if(o!==e&&o.st!==2&&!EDEF[o.t].passive&&Math.hypot(o.p.x-tg.p.x,o.p.z-tg.p.z)<5)c++;const fl=td<AIP.flankR&&c>0?Math.min(AIP.flankMax,AIP.flankK*c):0;mx=dx/td+px*side*fl;mz=dz/td+pz*side*fl;const l=Math.hypot(mx,mz)||1;mx/=l;mz/=l}}
       else if(e.cd<=0){const la=TAC.atk.get(tg.id)??-9,nw=TAC.clk;if(nw-la>=0.3||!SL){TAC.atk.set(tg.id,nw);if(HUM[e.t]&&Math.random()<0.14&&!e.feinted){e.feinted=1;e.cd=rnd(0.5,0.9);e.zz=0.6;e.zs=side;e.backT=0.35}else{e.feinted=0;e.wind=0.45*rnd(0.8,1.25)*(e.enraged?0.8:1);e.st=1;if(td<14&&Math.random()<0.6)eVoice(e,0.55)}}}
       else if(e.cd>0.35){if(SL){const sx=gx-e.p.x,sz=gz-e.p.z,sl=Math.hypot(sx,sz);if(sl>0.6){mx=sx/sl;mz=sz/sl;sp*=0.45}}else{mx=px*side*AIP.circleK-dx/td*AIP.backK;mz=pz*side*AIP.circleK-dz/td*AIP.backK;sp*=0.32}}}
    } else if(e.alert&&e.alert.t>0&&!d.passive){const dx=e.alert.x-e.p.x,dz=e.alert.z-e.p.z,l=Math.hypot(dx,dz);if(l>1.5){const S2=navSteer(e,e.alert.x,e.alert.z,dt);if(S2){mx=S2[0];mz=S2[1]}else{mx=dx/l;mz=dz/l}sp*=0.55;if(mx||mz)e.ry=Math.atan2(mx,mz)}
    } else if(e.home&&Math.hypot(e.home[0]-e.p.x,e.home[1]-e.p.z)>9){const dx=e.home[0]-e.p.x,dz=e.home[1]-e.p.z,l=Math.hypot(dx,dz);const S2=navSteer(e,e.home[0],e.home[1],dt);if(S2){mx=S2[0];mz=S2[1]}else{mx=dx/l;mz=dz/l}sp*=0.7;if(mx||mz)e.ry=Math.atan2(mx,mz);if(e.hp<e.max)e.hp=Math.min(e.max,e.hp+e.max*0.1*dt)
    } else {
      const BM=e.band?bandMove(e,dt):null;if(BM){mx=BM[0];mz=BM[1];sp*=BM[2]}else{
      const W2=wanderStep(e,dt,d.boss?6:12);if(W2){mx=W2[0];mz=W2[1];sp*=W2[2];e.ry=Math.atan2(mx,mz)}}
    }
    // odrzut + ruch po terenie
    e.vx+=(mx*sp-e.vx)*Math.min(1,8*dt);e.vz+=(mz*sp-e.vz)*Math.min(1,8*dt);
    const nx=e.p.x+e.vx*dt,nz=e.p.z+e.vz*dt,inS=e.p.y>450;let h=colAt(nx,nz,e.p.y);
    /* v139: w lochach i wnętrzach sprawdzamy ściany na szerokość ciała, żeby wrogowie nie wchodzili w mury */if(inS&&h!==null){const rr=Math.min(1.2,0.4*Math.max(1,eSc(e)));for(const [ox,oz] of [[rr,0],[-rr,0],[0,rr],[0,-rr],[rr*0.7,rr*0.7],[-rr*0.7,rr*0.7],[rr*0.7,-rr*0.7],[-rr*0.7,-rr*0.7]]){const h2=colAt(nx+ox,nz+oz,e.p.y);if(h2===null||h2>h)h=h2===null?h:h2}}
    if(e.sky){const sg=structGround(nx,nz,e.p.y+0.5);if(sg!==null&&Math.abs(sg-e.p.y)<1.3){e.p.x=nx;e.p.z=nz;e.p.y+=(sg-e.p.y)*Math.min(1,14*dt)}else{e.vx*=-0.3;e.vz*=-0.3;if(e.wan)e.wan.t=0}}
    else if(d.swim){if(h!==null&&h<WATER-1.6){e.p.x=nx;e.p.z=nz}else{e.vx*=-0.4;e.vz*=-0.4;if(e.wan)e.wan.t=0}
      // stwory morskie krążą w głębinie; wynurzają się dopiero, gdy ruszają do ataku
      const eng=(tg&&td<eReach(e)+5)||(e.wind>0)||(e.hurtT>0)||e.st===2;if(e.hurtT>0)e.hurtT-=dt;const gr=colAt(e.p.x,e.p.z,WATER),sc=eSc(e),deep=Math.max((gr??WATER-8)+0.6+sc*0.5,WATER-1.15-Math.min(3.4,1.4+sc*0.9));
      const ty=eng?WATER-1.15+Math.sin(performance.now()*0.002+e.id)*0.08:deep;e.p.y+=(ty-e.p.y)*Math.min(1,dt*(eng?3.2:1.2))}
    else if(h!==null&&wetAt(nx,nz,h)&&!d.fly){const ty=eWadeY(nx,nz,h,e);if(ty-e.p.y<=1.1){e.p.x=nx;e.p.z=nz;e.vx*=1-Math.min(0.6,dt*2.2);e.vz*=1-Math.min(0.6,dt*2.2);e.p.y+=(ty+Math.sin(performance.now()*0.004+e.id)*0.05-e.p.y)*Math.min(1,6*dt);e.wade=0.25}else{e.vx*=-0.3;e.vz*=-0.3;if(e.wan)e.wan.t=0}}
    else if(h!==null&&!wetAt(nx,nz,h)&&h-e.p.y<=1.05+(e.wade>0?0.5:0)&&(d.fly||eLedgeOk(e,nx,nz,h))&&!(inS&&d.fly&&h>e.p.y-0.3)&&!(VOX.size&&!d.fly&&eSc(e)<2.6&&voxProbe(nx,nz,e.p.y,0.3*Math.min(1.6,eSc(e)),1.5*eSc(e)).block)){e.p.x=nx;e.p.z=nz;const hf=eFoot(e,nx,nz,h);e.p.y=hf>e.p.y?hf:e.p.y+(hf-e.p.y)*Math.min(1,14*dt);if(e.wade>0)e.wade-=dt}else if(tg&&!inS&&!d.passive&&!e.pas&&!d.fly&&h!==null&&!wetAt(nx,nz,h)&&h-e.p.y>1.05&&h-e.p.y<10&&eSc(e)<2.6){/* v124: wrogowie wspinają się na skarpy i skały za celem */e.p.y=Math.min(h,e.p.y+3.6*dt*(d.spd>4?1.2:1));e.climbT=0.3;if(h-e.p.y<0.2){e.p.x=nx;e.p.z=nz;e.p.y=h}}else{e.vx*=-0.3;e.vz*=-0.3;if(e.wan)e.wan.t=0}
    if(e.climbT>0)e.climbT-=dt;
    if(!d.fly&&!e.car&&!d.swim&&!e.sid){try{villageCollide(e.p)}catch(_){}}
    if(!d.fly&&!e.car&&!d.swim&&!(e.climbT>0)){const c0=(()=>{const c=colAt(e.p.x,e.p.z,e.p.y);return c==null?c:eFoot(e,e.p.x,e.p.z,c)})(),s0=(e.sid||e.sky)?structGround(e.p.x,e.p.z,e.p.y):null,g0=Math.max(c0??-1e9,s0??-1e9);if(g0>-1e8&&g0>=WATER-0.6&&e.p.y>g0+0.04&&!(c0!==null&&wetAt(e.p.x,e.p.z,c0)))e.p.y=Math.max(g0,e.p.y-16*dt)}
    e.speed=Math.hypot(e.vx,e.vz);
    /* v154: wróg z celem, który nie robi postępu (brzeg rzeki, kamień, płot) — podskakuje/wychodzi w stronę celu */
    if(tg&&!d.fly&&!d.swim&&!e.car&&!e.sky&&!inS&&!d.passive&&!e.peace&&td>eReach(e)+0.8&&td<60){const k=e._sk||(e._sk={x:e.p.x,z:e.p.z,t:0,d:td});k.t+=dt;if(k.t>1.1){const mv=Math.hypot(e.p.x-k.x,e.p.z-k.z);if(mv<0.7&&td>k.d-0.8)eUnstick(e,tg);k.x=e.p.x;k.z=e.p.z;k.t=0;k.d=td}}else if(e._sk)e._sk=null;
  }
  // rozpychanie
  const arr=[...enemies.values()];for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++){const a=arr[i],b=arr[j],dx=a.p.x-b.p.x,dz=a.p.z-b.p.z,dd=Math.hypot(dx,dz),mn=Math.max(1.1,(EDEF[a.t].huge||EDEF[a.t].giant?eSc(a)*0.45:0.55)+(EDEF[b.t].huge||EDEF[b.t].giant?eSc(b)*0.45:0.55));if(dd<mn&&dd>1e-3&&Math.abs(a.p.y-b.p.y)<3){const k=(mn-dd)/2/dd;if(sepOk(a,a.p.x+dx*k,a.p.z+dz*k)){a.p.x+=dx*k;a.p.z+=dz*k}if(sepOk(b,b.p.x-dx*k,b.p.z-dz*k)){b.p.x-=dx*k;b.p.z-=dz*k}}}
}
function renderEnemies(dt){
  const rt=performance.now()-120;
  for(const e of enemies.values()){
    {const dv=e.dot||e.dotVis;if(dv&&e.st!==2&&ENCH[dv.k]){if(e.dotVis){e.dotVis.t-=dt;if(e.dotVis.t<=0)e.dotVis=null}if(Math.random()<dt*14)PFX.emit(e.p.x+(Math.random()-0.5)*eSc(e),e.p.y+(0.4+Math.random()*1.2)*eSc(e),e.p.z+(Math.random()-0.5)*eSc(e),1,ENCH[dv.k].fx,{sp:0.5,up:1.6,life:0.6,size:0.11,g:-1.5})}}
    if(!isAuth()&&e.buf){const b=e.buf;let a=b[0],c=b[b.length-1];for(let i=0;i<b.length-1;i++)if(b[i].t<=rt&&b[i+1].t>=rt){a=b[i];c=b[i+1];break}
      const k=c.t>a.t?Math.min(1,Math.max(0,(rt-a.t)/(c.t-a.t))):1;const ox=e.p.x,oz=e.p.z;
      e.p.set(a.p[0]+(c.p[0]-a.p[0])*k,a.p[1]+(c.p[1]-a.p[1])*k,a.p[2]+(c.p[2]-a.p[2])*k);e.ry=c.ry;e.st=c.st;e.hp=c.hp;e.max=c.max;
      e.speed=Math.hypot(e.p.x-ox,e.p.z-oz)/Math.max(dt,1e-3);e.flash-=dt*4}
    if(e.st===2&&!e.dfx){e.dfx=1;dismember(e);{const k=eVoiceK(e.t);eVoice({p:e.p,t:e.t},0.7);if(k==='vhum')sfx('vhumd',0.5);sfx('gore',0.5)}PFX.emit(e.p.x,e.p.y+0.8*eSc(e),e.p.z,20,['#c8c0b0','#a89a88','#e8e0d0'],{sp:2.5,up:1.5,life:0.8,size:0.14,g:-0.6,drag:2,r:0.8});PFX.emit(e.p.x,e.p.y+1,e.p.z,10,BLOODC(e.t),{sp:4,life:0.6})}
    e.m.position.copy(e.p);if(EDEF[e.t].swim){e.m.visible=true;if(e.lbl)e.lbl.visible=e.m.visible}let dr=e.ry-e.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));e.m.rotation.y+=dr*Math.min(1,10*dt);
    animEnemy(e.m,e.hm?0:Math.min(e.speed,8),dt,e.st,e.flash,isAuth()?(e.stun>0?2:e.slow>0?1:0):(e.sl||0));
    if(e.hm&&e.st!==2){e.hm.position.copy(e.p);e.hm.rotation.y=e.m.rotation.y;animEnemy(e.hm,Math.min(e.speed,16),dt,0,0,false);e.m.position.y+=1.0;const ch=e.m.userData.ch,u=ch&&ch.userData;if(u&&u.ll){u.ll.rotation.x=-1.35;u.rl.rotation.x=-1.35}}
  }
}
// trafienie wroga (host stosuje; klient wysyła prośbę)
function applyHit(eid,dmg,kx,kz,fromId,slow,stun,src){
  const e=enemies.get(eid);if(!e||e.st===2||e.car)return;if(EDEF[e.t].ally&&fromId!=null)return;if(slow)e.slow=slow;if(stun){e.stun=EDEF[e.t].boss?stun*0.5:stun;e.wind=0;e.rw=0;e.st=0}
  if(e.guard>0&&!EDEF[e.t].boss){dmg*=0.3;e.guard=0;try{fxNum(e.p.x,e.p.y+2.3*eSc(e),e.p.z,'Blok!','#cfe8ff');if(Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z)<30)sfx('block',0.6)}catch(_){}}
  {const dd=EDEF[e.t];if(dd.armor&&!slow)dmg*=dd.armor;if(dd.stoneDay&&e.stoneK)dmg*=0.35;if(!dd.passive)try{frightAround(e.p.x,e.p.z,18)}catch(_){}}
  if(e.duel===1&&e.hp-dmg<=e.max*0.18){e.hp=Math.max(1,Math.min(e.hp,e.max*0.18));e.flash=1;duelYield(e);return}if(e.peace&&e.t==='pretendent')return;
  e.hp-=dmg;e.flash=1;e.hurtT=6;
  if(src){e.aggroC={id:(fromId!=null&&fromId!==NET.id?'r:'+fromId+':':'c:')+src,t:15};e.prov=8}else if(fromId!=null){const p=playersList().find(q=>q.id===fromId);if(p&&p.snk&&!(e.det>=1)&&!(e.snkT&&nowS()-e.snkT<20)&&e.tgId!==fromId){e.snkT=nowS();e.det=Math.max(0.5,(e.det||0)+0.5);e.alert={x:p.p.x+rnd(-4,4),z:p.p.z+rnd(-4,4),t:7}}else{e.aggro={id:fromId,t:25};e.prov=8;e.det=1.2}}else e.prov=8;e.vx+=kx*6;e.vz+=kz*6;
  if(e.hp<=0){e.hp=0;e.st=2;e.dieT=1.1;dropLoot(e);if(e.loot){INV.gold+=e.loot;try{toast('Odzyskano '+e.loot+' złota','#ffd34d');updHud()}catch(_){}e.loot=0}if(e.sid){let alive=false;for(const o of enemies.values())if(o!==e&&o.sid===e.sid&&o.st!==2)alive=true;if(!alive)strState.set(e.sid,{cleared:Date.now()})}}
}
function dropLoot(e){
  for(const p of playersList()){if(Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)>45)continue;
    const rr=e.rar||0;if(EDEF[e.t].passive){const L={p:[e.p.x,EDEF[e.t].swim?WATER+0.05:e.p.y,e.p.z],items:Math.random()<0.07+0.14*rr?[genItem(e.lvl,rr*10,undefined,p.cls)]:[],gold:Math.round(e.lvl*(rr?rr*2.5:0.6)*(Math.random()<0.6?1:0)),pot:Math.random()<0.03?1:0,xp:Math.round(3*ERAR[rr].xp),et:e.t,food:Math.random()<0.07+rr*0.05?(e.t==='kura'?'kurczak':'mieso'):0};/* v124: więcej łupów, mniej surowego mięsa */if(p.id===NET.id)spawnDrop(L);else NET.tr&&NET.tr.send({t:'drop',from:NET.id,to:p.id,L});continue}
    const boss=!!EDEF[e.t].boss,tb=1+0.08*(p.tb||0),items=[];
    if(boss){for(let i=0;i<(EDEF[e.t].huge?3:2);i++)items.push(genItem(e.lvl,EDEF[e.t].huge?40:30,undefined,p.cls))}
    else{if(Math.random()<(e.elite?0.6:0.15)*tb*(1+rr*0.45))items.push(genItem(e.lvl,(e.elite?25:0)+rr*12,undefined,p.cls));if((e.elite||rr>=2)&&Math.random()<0.2*tb*(1+rr*0.3))items.push(genItem(e.lvl,10+rr*8,undefined,p.cls));if(Math.random()<0.03*tb)items.push(genItem(e.lvl,5,undefined,p.cls))}
    const L={p:[e.p.x,EDEF[e.t].swim?WATER+0.05:e.p.y,e.p.z],items,gold:Math.random()<(boss||e.elite?1:0.6)?Math.round(e.lvl*rnd(0.6,1.6)*(e.elite?3:1)*(boss?8:1)*tb*(1+rr*0.6)):0,pot:boss?1:Math.random()<(e.elite?0.28:0.05)?1:0,xp:Math.round(xpFor(e,p.lv)*(boss?4:1)*ERAR[rr].xp),et:e.t,el:(e.elite||e.rar)?1:0,qid:e.qid||0,boss:boss?EDEF[e.t].n:0,food:FOODOF[e.t]&&Math.random()<(FOODOF[e.t]==='mieso'?0.025:0.07)?FOODOF[e.t]:0};
    if(p.id===NET.id)spawnDrop(L);else NET.tr&&NET.tr.send({t:'drop',from:NET.id,to:p.id,L});}
}
function hurtPlayer(pid,dmg,e){if(pid===NET.id){if(e)e.hurtP=nowS();takeDamage(dmg,e.p);try{onPlayerHitBy(e,dmg)}catch(_){}}else NET.tr&&NET.tr.send({t:'dmg',from:NET.id,to:pid,dmg,src:[e.p.x,e.p.z]})}

// ---------- obrażenia gracza ----------
function takeDamage(raw,src){if(typeof ECL!=='undefined'&&ECL>0)raw*=1.2;let blk=false;if(src&&typeof src==='object'){const sx=src.x??src[0],sz=src.z??src[1];if(!Number.isFinite(sx)||!Number.isFinite(sz))src=null}else src=null;if(!Number.isFinite(raw))return;if(P3.block&&INV.eq.tarcza&&raw>0&&P2.sta>0){let ok=true;if(src){const sx=src.x??src[0],sz=src.z??src[1];if(sx!=null){const dx=sx-player.p.x,dz=sz-player.p.z,l=Math.hypot(dx,dz)||1;ok=(dx*Math.sin(player.ry)+dz*Math.cos(player.ry))/l>-0.25}}if(ok){raw*=Math.max(0.12,0.32-(INV.eq.tarcza.rar||0)*0.04);P2.sta=Math.max(0,P2.sta-10);P2.staT=1;fxNum(player.p.x,player.p.y+2.2,player.p.z,'Zablokowano','#cfe8ff');sfx('clang',0.7);blk=true}}if(!blk&&INV.eq.tarcza&&raw>0&&Math.random()*100<(INV.eq.tarcza.block||12)*0.5){raw*=0.35;fxNum(player.p.x,player.p.y+2.2,player.p.z,'Blok!','#cfe8ff');sfx('clang',0.6)}
  if(custOn||(SPC&&SPC.func==='garderoba'))return;
  if(P2.dead||P2.roll>0||P2.iframe>0)return;
  if(Math.random()<0.02*pk('unik')){fxNum(player.p.x,player.p.y+2,player.p.z,'unik','#cfe8ff');return}
  const dmg=raw*(1-ST.def/(ST.def+60))*(1-0.03*pk('tarcza'));sfx('hurt');PFX.emit(player.p.x,player.p.y+1.2,player.p.z,9,['#b8202a','#8a1018','#d8303a'],{sp:3,life:0.5});skGain('wytrz',0.5+dmg/20);
  if(src){const sx=src.x??src[0],sz=src.z??src[1];let be=null,bd=4;for(const e of enemies.values()){if(e.st===2)continue;const d=Math.hypot(e.p.x-sx,e.p.z-sz);if(d<bd){bd=d;be=e}}if(be){be.mark=nowS();be.hurtP=nowS()}}P2.hp-=dmg;P2.lastHurt=nowS();P2.iframe=0.2;
  {const fr=dmg/Math.max(1,ST.hp);fxNum(player.p.x,player.p.y+2,player.p.z,'-'+Math.round(dmg),fr>0.15?'#ff2a2a':'#ff6b5b');$('hurt').style.opacity=Math.min(1,0.45+fr*3);P2.shake=Math.max(P2.shake||0,Math.min(0.45,0.08+fr*1.6));hurtFlash(fr);if(src)hurtDir(src.x??src[0],src.z??src[1]);
  if(meRef){meRef.userData.hitT=0.25}if(fr>0.12&&SET_G.blood)bloodDecal(player.p.x,player.p.z,0.25)}
  if(src){const dx=player.p.x-(src.x??src[0]),dz=player.p.z-(src.z??src[1]),l=Math.hypot(dx,dz)||1;player.v.x+=dx/l*5;player.v.z+=dz/l*5;player.v.y=Math.max(player.v.y,4)}
  if(P2.hp<=0){P2.hp=0;const co=NET.role!=='off'&&[...remotes.values()].some(r=>{const b=r.buf[r.buf.length-1];return b&&b.a!==5});P2.dead=co?30:5;P2.down=co;sfx('death');if(VH.mode===1)exitBoat();if(VH.mode===2)stopGlide();if(VH.mode===3)VH.mode=0;if(VH.mode===5||VH.mode===6)dismountOwn(1);$('dead').hidden=false;$('deadhint').textContent=co?'Kompan może cię podnieść: niech podejdzie i przytrzyma F.':'';$('deadnow').hidden=!co;toast(co?'Jesteś powalony! Czekaj na pomoc kompana.':'Poległeś. Powrót za 5 s','#ff8a7a')}
}
function respawn(){P2.dead=0;P2.down=0;P2.hp=ST.hp;$('dead').hidden=true;const sp=spawnPt();
  let tgt=LS.get('home_'+S.seed,null);if(tgt){tgt=tgt.slice();tgt[0]-=1;tgt[2]-=1;tgt[1]-=1}if(!tgt&&NET.role!=='off')for(const r of remotes.values()){const b=r.buf[r.buf.length-1];if(b&&b.a!==5){tgt=b.p;break}}
  const p=tgt||[sp[0],sp[1]+1,sp[2]];player.p.set(p[0]+1,p[1]+1,p[2]+1);player.v.set(0,0,0);camY=null;holdIfUnloaded()}

// ---------- atak gracza ----------
function attack(){
  if(P3.block){/* v152: uderzenie tarczą */try{shieldBash()}catch(_){}return}if(P2.dead||P2.atkCd>0||P2.roll>0||P3.charge>0||!player.ready||invOpen()||uiOpen()||(VH.mode===1&&!isBow())||VH.mode===2||VH.mode===6)return;/* v141: z łodzi można strzelać z łuku */
  if(VH.mode===3)VH.mode=0;if(VH.mode===5||VH.mode===6)dismountOwn(1);
  const fy=facing();if(VH.mode!==1&&VH.mode!==4){player.ry=fy;meRef.rotation.y=fy}
  const kind=weaponKind(INV.eq.bron?INV.eq.bron.base:''),spd=(ST.spd*(1+(ST.haste||0)/100))||1;
  if(kind==='bow'){meRef.userData.avar=Math.floor(Math.random()*3);P2.bowD=Math.max(0.34,0.62/spd);P2.bowT=P2.bowD;P2.bowShot=false;P2.atkCd=P2.bowD+0.05;P2.atkT=P2.bowD;return}
  if(kind==='staff'){P2.castD=Math.max(0.3,0.5/spd);P2.castT=P2.castD;P2.castShot=false;P2.atkCd=P2.castD+0.08;P2.atkT=P2.castD;return}
  const two=!!(meRef&&meRef.userData.two),heavyK=two?1.5:1;
  {const now=performance.now();if(now-(P2.lastAtk||0)>(two?1600:1100)||!P2.hitAny)P2.combo=-1;P2.lastAtk=now}P2.combo=(P2.combo+1)%4;meRef.userData.avar=Math.floor(Math.random()*3);P2.hitAny=false;/* combo rośnie tylko po trafieniu */sfx(P2.combo===3?'whoosh':'swing',P2.combo>=2?1.15:1);if(P2.combo>=2)comboPop(P2.combo+1);if(P2.combo===3)sfx('whirl',0.8);if(player.ground&&!P3.sneak){const st=P2.combo===2?4.2:P2.combo===3?1.5:2.6;player.v.x+=Math.sin(fy)*st;player.v.z+=Math.cos(fy)*st}
  P2.atkD=Math.max(0.22,0.36/Math.max(0.7,spd))*(P2.combo===3?1.45:P2.combo===2?1.12:1)*heavyK;P2.atkT=P2.atkD;P2.atkCd=Math.max(P2.atkD*0.92,0.55/spd*heavyK);P2.two=two;P2.hitDone=false;P2.slashDone=false;
}
// ===== HITBOXY: obrys modelu wroga (prostopadłościan w układzie wroga), liczony raz na typ =====
const HBC=new Map();
function hbLocal(m){const B=[1e9,1e9,1e9,-1e9,-1e9,-1e9];
  const rot=(r,v)=>{const cx=Math.cos(r.x||0),sx=Math.sin(r.x||0),cy=Math.cos(r.y||0),sy=Math.sin(r.y||0),cz=Math.cos(r.z||0),sz=Math.sin(r.z||0);let [x,y,z]=v;const x1=x*cz-y*sz,y1=x*sz+y*cz,z1=z;
    if(r.order==='YXZ'){const y2=y1*cx-z1*sx,z2=y1*sx+z1*cx;return[x1*cy+z2*sy,y2,-x1*sy+z2*cy]}const x2=x1*cy+z1*sy,z2=-x1*sy+z1*cy;return[x2,y1*cx-z2*sx,y1*sx+z2*cx]};
  const walk=(o,ch)=>{if(o.isSprite===true||o.visible===false)return;ch=ch.concat([o]);const g=o.geometry;
    if(o.isMesh===true&&g&&g.attributes&&g.attributes.position&&o.isInstancedMesh!==true){const P=g.attributes.position.array,st=3*Math.max(1,Math.floor(P.length/3/2500));
      for(let i=0;i+2<P.length;i+=st){let v=[P[i],P[i+1],P[i+2]];for(let k=ch.length-1;k>=0;k--){const t=ch[k];v=[v[0]*t.scale.x,v[1]*t.scale.y,v[2]*t.scale.z];v=rot(t.rotation,v);v=[v[0]+t.position.x,v[1]+t.position.y,v[2]+t.position.z]}
        if(v[0]<B[0])B[0]=v[0];if(v[1]<B[1])B[1]=v[1];if(v[2]<B[2])B[2]=v[2];if(v[0]>B[3])B[3]=v[0];if(v[1]>B[4])B[4]=v[1];if(v[2]>B[5])B[5]=v[2]}}
    for(const c of (o.children||[]))walk(c,ch)};
  for(const c of (m.children||[]))walk(c,[]);return B[3]>B[0]?B:null}
function eBox(e){if(!e.m)return null;const k=e.t+(e.elite?'e':'');let B=HBC.get(k);if(B===undefined){try{B=hbLocal(e.m)}catch(_){B=null}const SD=SEA[e.t];if(B&&SD&&SD.amp){const w=(B[5]-B[2])*SD.amp*0.35;B[0]-=w;B[3]+=w}if(B&&SD&&SD.vert){const v=(B[5]-B[2])*SD.vert*0.3;B[1]-=v;B[4]+=v}HBC.set(k,B)}if(!B)return null;const s=e.m.scale.x||1;return[B[0]*s,B[1]*s,B[2]*s,B[3]*s,B[4]*s,B[5]*s]}
// siatka zajętości ciała (tylko tam, gdzie jest model), w układzie wroga bez skali
const HBG=new Map();
function hbGrid(e){if(!e.m)return null;const key=e.t+(e.elite?'e':'');if(HBG.has(key))return HBG.get(key);let G=null;
  try{const tris=[];const rot=(r,v)=>{const cx=Math.cos(r.x||0),sx=Math.sin(r.x||0),cy=Math.cos(r.y||0),sy=Math.sin(r.y||0),cz=Math.cos(r.z||0),sz=Math.sin(r.z||0);let [x,y,z]=v;const x1=x*cz-y*sz,y1=x*sz+y*cz,z1=z;
      if(r.order==='YXZ'){const y2=y1*cx-z1*sx,z2=y1*sx+z1*cx;return[x1*cy+z2*sy,y2,-x1*sy+z2*cy]}const x2=x1*cy+z1*sy,z2=-x1*sy+z1*cy;return[x2,y1*cx-z2*sx,y1*sx+z2*cx]};
    const walk=(o,ch)=>{if(o.isSprite===true||o.visible===false)return;ch=ch.concat([o]);const g=o.geometry;
      if(o.isMesh===true&&g&&g.attributes&&g.attributes.position&&o.isInstancedMesh!==true&&o.material!==GLOWMAT){const P=g.attributes.position.array,I=g.index?(g.index.array||null):null,nv=P.length/3,T=new Float32Array(P.length);
        for(let i=0;i<nv;i++){let v=[P[i*3],P[i*3+1],P[i*3+2]];for(let k=ch.length-1;k>=0;k--){const t=ch[k];v=[v[0]*t.scale.x,v[1]*t.scale.y,v[2]*t.scale.z];v=rot(t.rotation,v);v=[v[0]+t.position.x,v[1]+t.position.y,v[2]+t.position.z]}T[i*3]=v[0];T[i*3+1]=v[1];T[i*3+2]=v[2]}
        const n=I?I.length:nv;for(let q=0;q+2<n;q+=3)tris.push(T,I?I[q]:q,I?I[q+1]:q+1,I?I[q+2]:q+2)}
      for(const c of (o.children||[]))walk(c,ch)};
    for(const c of (e.m.children||[]))walk(c,[]);if(!tris.length)throw 0;
    let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(let q=0;q<tris.length;q+=4){const T=tris[q];for(let k=1;k<4;k++){const b=tris[q+k]*3;for(let a=0;a<3;a++){const v=T[b+a];if(v<mn[a])mn[a]=v;if(v>mx[a])mx[a]=v}}}
    const cs=Math.max(0.1,Math.max(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2])/30),pad=2,ox=mn[0]-pad*cs,oy=mn[1]-pad*cs,oz=mn[2]-pad*cs,nx=Math.ceil((mx[0]-mn[0])/cs)+pad*2+1,ny=Math.ceil((mx[1]-mn[1])/cs)+pad*2+1,nz=Math.ceil((mx[2]-mn[2])/cs)+pad*2+1,ID=(x,y,z)=>(y*nz+z)*nx+x,A=new Uint8Array(nx*ny*nz);
    for(let q=0;q<tris.length;q+=4){const T=tris[q];let a0=1e9,a1=-1e9,b0=1e9,b1=-1e9,c0=1e9,c1=-1e9;for(let k=1;k<4;k++){const b=tris[q+k]*3;a0=Math.min(a0,T[b]);a1=Math.max(a1,T[b]);b0=Math.min(b0,T[b+1]);b1=Math.max(b1,T[b+1]);c0=Math.min(c0,T[b+2]);c1=Math.max(c1,T[b+2])}
      const x0=Math.floor((a0-ox)/cs),x1=Math.floor((a1-ox)/cs),y0=Math.floor((b0-oy)/cs),y1=Math.floor((b1-oy)/cs),z0=Math.floor((c0-oz)/cs),z1=Math.floor((c1-oz)/cs);
      for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)A[ID(x,y,z)]=1}
    // wypełnienie wnętrza brył: komórka w środku, jeśli jest ograniczona powierzchnią w osiach X, Y i Z
    const F=A.slice(),fx=new Int16Array(ny*nz*2).fill(-1),fz=new Int16Array(ny*nx*2).fill(-1),fy=new Int16Array(nz*nx*2).fill(-1);
    for(let y=0;y<ny;y++)for(let z=0;z<nz;z++)for(let x=0;x<nx;x++)if(A[ID(x,y,z)]){const r=(y*nz+z)*2;if(fx[r]<0)fx[r]=x;fx[r+1]=x;const c=(y*nx+x)*2;if(fz[c]<0)fz[c]=z;fz[c+1]=z;const w=(z*nx+x)*2;if(fy[w]<0)fy[w]=y;fy[w+1]=y}
    for(let y=0;y<ny;y++)for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){const id=ID(x,y,z);if(A[id])continue;const r=(y*nz+z)*2,c=(y*nx+x)*2,w=(z*nx+x)*2;if(fx[r]>=0&&x>fx[r]&&x<fx[r+1]&&fz[c]>=0&&z>fz[c]&&z<fz[c+1]&&fy[w]>=0&&y>fy[w]&&y<fy[w+1])F[id]=1}
    // tolerancja na animację: poszerzenie o 1 komórkę (u stworów morskich bardziej w bok)
    const SD=SEA[e.t],dx=1+(SD&&SD.amp?Math.ceil((mx[2]-mn[2])*SD.amp*0.3/cs):0),dy=1+(SD&&SD.vert?Math.ceil((mx[2]-mn[2])*SD.vert*0.25/cs):0),D=new Uint8Array(F.length),pts=[];
    for(let y=0;y<ny;y++)for(let z=0;z<nz;z++)for(let x=0;x<nx;x++)if(F[ID(x,y,z)]){pts.push(ox+(x+0.5)*cs,oy+(y+0.5)*cs,oz+(z+0.5)*cs);for(let yy=Math.max(0,y-dy);yy<=Math.min(ny-1,y+dy);yy++)for(let zz=Math.max(0,z-1);zz<=Math.min(nz-1,z+1);zz++)for(let xx=Math.max(0,x-dx);xx<=Math.min(nx-1,x+dx);xx++)D[ID(xx,yy,zz)]=1}
    G={cs,ox,oy,oz,nx,ny,nz,D,pts:new Float32Array(pts),dx,dy}}catch(_){G=null}
  HBG.set(key,G);return G}
function eLoc(e,x,z){const t=e.m?e.m.rotation.y:(e.ry||0),c=Math.cos(t),sn=Math.sin(t),dx=x-e.p.x,dz=z-e.p.z;return[dx*c-dz*sn,dx*sn+dz*c,c,sn]}
// najbliższa komórka ciała wroga (w poziomie), z uwzględnieniem wysokości [y0,y1]
function eNearCell(e,x,z,y0,y1){const G=hbGrid(e);if(!G)return null;const s=e.m.scale.x||1,[lx,lz,c,sn]=eLoc(e,x,z),qx=lx/s,qz=lz/s,a=(y0==null?-1e9:(y0-e.p.y)/s-G.cs*G.dy),b=(y1==null?1e9:(y1-e.p.y)/s+G.cs*G.dy),P=G.pts;let bd=1e18,bx=0,bz=0;
  for(let i=0;i<P.length;i+=3){const py=P[i+1];if(py<a||py>b)continue;const ddx=Math.max(0,Math.abs(P[i]-qx)-G.cs*(G.dx-0.5)),ddz=Math.max(0,Math.abs(P[i+2]-qz)-G.cs*0.5),d=ddx*ddx+ddz*ddz;if(d<bd){bd=d;bx=P[i];bz=P[i+2]}}
  if(bd>1e17)return null;return{d:Math.sqrt(bd)*s,x:e.p.x+(bx*s)*c+(bz*s)*sn,z:e.p.z-(bx*s)*sn+(bz*s)*c}}
// odległość w poziomie od punktu do ciała wroga (0 = dotyka ciała); y0/y1 = zakres wysokości atakującego
function eDist(e,x,z,y0,y1){const B=eBox(e);if(!B)return Math.max(0,Math.hypot(x-e.p.x,z-e.p.z)-0.5-eBody(e));const [lx,lz]=eLoc(e,x,z),cx=Math.min(B[3],Math.max(B[0],lx)),cz=Math.min(B[5],Math.max(B[2],lz)),bd=Math.hypot(lx-cx,lz-cz);if(bd>8)return bd;const r=eNearCell(e,x,z,y0,y1);return r?r.d:(y0!=null?99:bd)}
function eNear(e,x,z,y0,y1){const r=eNearCell(e,x,z,y0,y1);if(r)return[r.x,r.z];const B=eBox(e);if(!B)return[e.p.x,e.p.z];const [lx,lz,c,sn]=eLoc(e,x,z),cx=Math.min(B[3],Math.max(B[0],lx)),cz=Math.min(B[5],Math.max(B[2],lz));return[e.p.x+cx*c+cz*sn,e.p.z-cx*sn+cz*c]}
function eYR(e){const B=eBox(e);return B?[e.p.y+B[1],e.p.y+B[4]]:[e.p.y-0.3,e.p.y+1.9*eSc(e)]}
// czy punkt (np. pocisk) trafia w ciało wroga (z zapasem m)
function eHitPt(e,x,y,z,m){const G=hbGrid(e);if(!G){const B=eBox(e);if(!B)return null;const [lx,lz]=eLoc(e,x,z),yy=y-e.p.y;return lx>B[0]-m&&lx<B[3]+m&&lz>B[2]-m&&lz<B[5]+m&&yy>B[1]-m&&yy<B[4]+m}
  const s=e.m.scale.x||1,[lx,lz]=eLoc(e,x,z),gx=Math.floor((lx/s-G.ox)/G.cs),gy=Math.floor(((y-e.p.y)/s-G.oy)/G.cs),gz=Math.floor((lz/s-G.oz)/G.cs),r=Math.max(0,Math.ceil(m/(s*G.cs))-1);
  for(let yy=gy-r;yy<=gy+r;yy++){if(yy<0||yy>=G.ny)continue;for(let zz=gz-r;zz<=gz+r;zz++){if(zz<0||zz>=G.nz)continue;for(let xx=gx-r;xx<=gx+r;xx++){if(xx<0||xx>=G.nx)continue;if(G.D[(yy*G.nz+zz)*G.nx+xx])return true}}}return false}
// odcinek lotu pocisku (poprzednia → obecna pozycja) przecina ciało wroga
function eHitSeg(e,x0,y0,z0,x1,y1,z1,m){const B=eBox(e);if(!B)return null;const R=Math.max(Math.abs(B[0]),Math.abs(B[3]),Math.abs(B[2]),Math.abs(B[5]))+m,L=Math.hypot(x1-x0,y1-y0,z1-z0);if(Math.hypot(x1-e.p.x,z1-e.p.z)>R+L+0.5)return false;if(y1<e.p.y+B[1]-m-L&&y0<e.p.y+B[1]-m-L)return false;
  const G=hbGrid(e),st=G?Math.max(0.06,Math.min(0.25,G.cs*(e.m.scale.x||1)*0.8)):0.25,n=Math.min(40,Math.max(1,Math.ceil(L/st)));for(let k=1;k<=n;k++){const t=k/n,r=eHitPt(e,x0+(x1-x0)*t,y0+(y1-y0)*t,z0+(z1-z0)*t,m);if(r===null)return null;if(r)return true}return false}
// czy pionowo się pokrywa z ciałem gracza (stopy y, wysokość h) z zapasem
function eYOk(e,y,h,m){const [a,b]=eYR(e);return y<b+m&&y+h>a-m}
// ===== ZAKLĘCIA BRONI (kowal) i wybuchy =====
const ENCH={ogien:{n:'Ognia',c:'#ff8a2e',fx:['#ff7a1a','#ffb030','#ffe080'],d:'podpala wroga: obrażenia od ognia przez 4 s'},
  wybuch:{n:'Wybuchu',c:'#ffb030',fx:['#ffb030','#ff6a1a','#fff2a0'],d:'strzały i bełty wybuchają przy trafieniu (obrażenia obszarowe)',bow:1},
  mroz:{n:'Mrozu',c:'#9fe8ff',fx:['#bfe8ff','#ffffff','#7fd0ff'],d:'spowalnia trafionego wroga'},
  trucizna:{n:'Trucizny',c:'#7ad15a',fx:['#7ad15a','#3a8a2a','#b8f080'],d:'zatruwa: obrażenia przez 6 s'},
  wampir:{n:'Krwi',c:'#c8304a',fx:['#c8304a','#7a1020','#ff8090'],d:'kradzież życia: leczy cię za 5% zadanych obrażeń'},
  piorun:{n:'Burzy',c:'#c8d8ff',fx:['#c8d8ff','#ffffff','#8ab0ff'],d:'piorun przeskakuje na pobliskiego wroga'}};
const STUCK=[];
// ===== NISZCZENIE TERENU: kratery po wybuchach i zaklęciach (zapisywane w świecie, synchronizowane w co-op) =====
const DIG=new Map(),DIGC=new Map();
function digIdx(x,z,k){for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const cx=Math.floor((x+dx*4)/C),cz=Math.floor((z+dz*4)/C),ck=K(cx,cz);let a=DIGC.get(ck);if(!a){a=new Set();DIGC.set(ck,a)}a.add(k)}}
function digLoad(){DIG.clear();DIGC.clear();if(W&&W.dig&&Object.keys(W.dig).length){W.dig={};W.digB={};try{saveW()}catch(_){}}const D=(W&&W.dig)||{};for(const k in D){DIG.set(k,D[k]);const [x,z]=k.split(',').map(Number);digIdx(x,z,k)}}
function digBase(x,z,cur){const k=x+','+z;W.digB=W.digB||{};if(W.digB[k]==null)W.digB[k]=cur;return W.digB[k]}
function digFor(cx,cz){const a=DIGC.get(K(cx,cz));if(!a)return[];const out=[];for(const k of a){const [x,z]=k.split(',').map(Number);if(x>=cx*C-4&&x<cx*C+C+4&&z>=cz*C-4&&z<cz*C+C+4)out.push(x,z,DIG.get(k))}return out}
function digApply(cells,save){const touched=new Set();for(let i=0;i<cells.length;i+=3){const x=cells[i],z=cells[i+1],h=cells[i+2],k=x+','+z;const old=DIG.get(k);if(old!=null&&old<=h)continue;DIG.set(k,h);W.dig=W.dig||{};W.dig[k]=h;digIdx(x,z,k);
    const cx=Math.floor(x/C),cz=Math.floor(z/C),ch=chunks.get(K(cx,cz));if(ch&&ch.heights){const j=(z-cz*C)*C+(x-cx*C);if(ch.heights[j]>h)ch.heights[j]=h}
    for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)touched.add(K(Math.floor((x+dx*4)/C),Math.floor((z+dz*4)/C)))}
  for(const ck of touched){const ch=chunks.get(ck);if(ch&&ch.mesh&&!ch.pend)ch.lod=-1}NAV.c.clear();if(save)saveW()}
function terrainBlast(x,y,z,r,send){/* v124: niszczenie terenu wyłączone — tylko pył */if(!SPC)try{PFX.emit(x,y+0.3,z,Math.round(10+r*6),['#6b5034','#8a7a64','#5a4a38','#3a3028'],{sp:3+r,up:5,life:1,size:0.14,g:14,r:r*0.5})}catch(_){}return;}
function boomFx(x,y,z,r){r=r||3;const k=r/3;PFX.emit(x,y+0.4,z,Math.round(50*k)+10,['#ff7a1a','#ffb030','#ffe080','#ff4a1a'],{sp:7*k+2,up:2.5,life:0.7,size:0.18,g:-1,r:0.6*k});PFX.emit(x,y+0.6,z,Math.round(26*k)+6,['#3a3430','#5a5048','#2a2624','#6a6058'],{sp:2.6*k+1,up:3.5,life:1.7,size:0.3,g:-2.2,r:0.8*k});
  PFX.emit(x,y+0.3,z,Math.round(24*k)+6,['#ffd34d','#fff2a0','#ffffff'],{sp:10*k+3,up:6,life:0.9,size:0.05,g:9});PFX.emit(x,y+0.2,z,Math.round(18*k)+4,['#6b5034','#8a7a64','#5a5a5a','#4a3a28'],{sp:5*k+2,up:7,life:1.2,size:0.13,g:16});
  try{const d=Math.hypot(x-player.p.x,z-player.p.z);if(d<40){sfx('thud',Math.max(0.2,1-d/40));if(d<14)P2.shake=Math.max(P2.shake||0,0.35*(1-d/14))}}catch(_){}}
function encHit(e,dmg,en){if(!e||e.st===2)return;const E=ENCH[en];if(!E)return;PFX.emit(e.p.x,e.p.y+1.1*eSc(e),e.p.z,8,E.fx,{sp:2.5,up:1.5,life:0.5,size:0.09});
  if(en==='ogien'||en==='trucizna'){const dur=en==='ogien'?4:6,dps=dmg*(en==='ogien'?0.25:0.16);e.dotVis={k:en,t:dur};if(isAuth())dotApply(e.id,en,dps,dur,NET.id);else NET.tr&&NET.tr.send({t:'dot',from:NET.id,eid:e.id,k:en,dps,dur})}
  else if(en==='mroz'){if(isAuth())applyHit(e.id,0,0,0,NET.id,2.5,0);else NET.tr&&NET.tr.send({t:'hit',from:NET.id,eid:e.id,dmg:0,k:[0,0],slow:2.5,stun:0})}
  else if(en==='piorun'&&Math.random()<0.35){let b=null,bd=7;for(const o of enemies.values()){if(o===e||o.st===2||EDEF[o.t].passive)continue;const d=Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z);if(d<bd){bd=d;b=o}}if(b){try{boltFx([[e.p.x,e.p.y+1.2,e.p.z],[b.p.x,b.p.y+1.2,b.p.z]]);sendFx({k:'bolt',pts:[[e.p.x,e.p.y+1.2,e.p.z],[b.p.x,b.p.y+1.2,b.p.z]]})}catch(_){}const[dm]=rollDmg(dmg*0.5);dealHit(b,dm,false,0,0)}}}
function dotApply(eid,k,dps,dur,from){const e=enemies.get(eid);if(!e||e.st===2)return;e.dot={k,dps:Math.min(dps,4000),t:Math.min(dur,8),tick:0.5,from}}
function dotTick(e,dt){const D=e.dot;if(!D)return;D.t-=dt;D.tick-=dt;if(D.tick<=0){D.tick=0.5;const dm=D.dps*0.5;try{fxNum(e.p.x,e.p.y+2*eSc(e),e.p.z,Math.round(dm),D.k==='ogien'?'#ffb030':'#9ae86a')}catch(_){}applyHit(e.id,dm,0,0,D.from,0,0,null)}if(D.t<=0)e.dot=null}
function dlgEnchant(){const n=dlg.n,pm=pmod(n),it=INV.eq.bron,opts=[];if(!it){dlgShow('Najpierw załóż broń, którą mam zaczarować.',[['Wróć.',()=>dlgSmith()]]);return}
  const bow=it.base==='luk'||it.base==='kusza',cost=Math.round((150+itemVal(it)*1.2)*pm);
  for(const k in ENCH){const E=ENCH[k];if(E.bow&&!bow)continue;opts.push([`${it.ench===k?'✓ ':''}Zaklęcie ${E.n}: ${E.d} — ${cost} zł`,()=>{if(it.ench===k)return toast('Ta broń ma już to zaklęcie','#cfe8ff');if(INV.gold<cost)return toast('Za mało złota','#ff8a7a');INV.gold-=cost;it.ench=k;sfx('lvl');afterInv();toast('Zaklęto: '+it.name+' ('+E.n+')',E.c);dlgEnchant()}])}
  opts.push(['Wróć.',()=>dlgSmith()]);dlgShow(`Zaklęcie dla: ${it.name}${it.ench?' (teraz: '+ENCH[it.ench].n+')':''}. Nowe zaklęcie zastępuje stare. Masz ${INV.gold} złota.`,opts)}
function enchGlow(dt){const it=INV.eq.bron;if(!it||!it.ench||!ENCH[it.ench]||VH.mode===3||custOn)return;if(Math.random()<dt*9){const ry=player.ry,c=Math.cos(ry),sn=Math.sin(ry),lx=-0.38,lz=0.35;PFX.emit(player.p.x+lx*c+lz*sn,player.p.y+0.95+Math.random()*0.5,player.p.z-lx*sn+lz*c,1,ENCH[it.ench].fx,{sp:0.3,up:0.6,life:0.45,size:0.06,g:-1})}}
// licznik combo nad paskiem
function comboPop(n){let el=document.getElementById('combo');if(!el){el=document.createElement('div');el.id='combo';el.style.cssText='position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);font:800 30px Poppins,sans-serif;color:#fff;text-shadow:0 2px 8px #000,0 0 16px rgba(255,200,80,.7);pointer-events:none;z-index:40;transition:opacity .4s,transform .25s;opacity:0';document.body.appendChild(el)}
  el.textContent=n>=4?'COMBO ×4 — WIR!':'COMBO ×'+n;el.style.opacity='1';el.style.transform='translate(-50%,-50%) scale(1.25)';setTimeout(()=>{el.style.transform='translate(-50%,-50%) scale(1)'},90);clearTimeout(el._t);el._t=setTimeout(()=>{el.style.opacity='0'},650)}
function meleeHits(){
  const fy=player.ry,fx=Math.sin(fy),fz=Math.cos(fy);
  if(INV.eq.bron&&INV.eq.bron.base==='mlot'&&!SPC){// młot rozbija teren przed graczem
    const hx=player.p.x+fx*1.7,hz=player.p.z+fz*1.7,r=P2.combo>=2?1.9:1.15;terrainBlast(hx,player.p.y,hz,r,true);try{sfx('thud',0.8);P2.shake=Math.max(P2.shake||0,P2.combo>=2?0.4:0.22);PFX.emit(hx,player.p.y+0.2,hz,10,['#d8d0c0','#8a7a64'],{sp:5,up:3,life:0.5,size:0.1})}catch(_){}}
  try{nestMelee(fx,fz)}catch(_){}
  for(const e of enemies.values()){if(e.st===2)continue;
    if(!eYOk(e,player.p.y,1.9,0.9))continue;const de=eDist(e,player.p.x,player.p.z,player.p.y-0.6,player.p.y+2.6);if(de>ST.rng+0.45)continue;
    const np=eNear(e,player.p.x,player.p.z,player.p.y-0.6,player.p.y+2.6),dx=np[0]-player.p.x,dz=np[1]-player.p.z,dd=Math.hypot(dx,dz);
    if(P2.combo!==3&&dd>0.6&&(dx*fx+dz*fz)/dd<0.2)continue;// cios z obrotu (4. w combo) trafia dookoła
    P2.hitAny=true;const[dmg,crit]=rollDmg(ST.dmg*rnd(0.9,1.1)*(P2.combo===3?1.8:P2.combo===2?1.4:1)*(P2.two?1.75:1));if(P2.two){e.vx=(e.vx||0)+(dd>0?dx/dd:fx)*2.5;e.vz=(e.vz||0)+(dd>0?dz/dd:fz)*2.5}if(P2.combo===3){e.vx=(e.vx||0)+(dd>0?dx/dd:fx)*5;e.vz=(e.vz||0)+(dd>0?dz/dd:fz)*5;P2.shake=Math.max(P2.shake||0,0.25)}
    dealHit(e,dmg,crit,dd>0?dx/dd:fx,dd>0?dz/dd:fz);
    {const en=INV.eq.bron&&INV.eq.bron.ench;if(en&&en!=='wybuch')encHit(e,dmg,en)}
  }
}
let STARGEO=null;

