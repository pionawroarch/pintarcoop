// ===== v111: miasta zamknięte dla wrogów + garnizon wychodzący na najeźdźców =====
const GARR={t:0};
function cityHostile(e){if(e.st===2||e.car||e.pas||e.peace)return false;const d=EDEF[e.t];if(!d||d.ally||d.passive||d.boss||e.qid)return false;return d.aggro>0||!!e.band}
function cityPushOut(v,pl,e){const dx=e.p.x-v.x,dz=e.p.z-v.z,r=Math.hypot(dx,dz)||1,ux=dx/r,uz=dz/r;let t=r;for(let k=0;k<80&&pl.rho(ux*t,uz*t)<1.05;k++)t+=0.6;const x=v.x+ux*t,z=v.z+uz*t,h=colAt(x,z,e.p.y);e.p.x=x;e.p.z=z;if(h!=null&&!EDEF[e.t].fly)e.p.y=h;if(e.vx!=null){e.vx=0;e.vz=0}if(e.m)e.m.position.set(e.p.x,e.p.y,e.p.z);e._wallT=nowS()}
function cityGate(v,pl,tx,tz){// brama na osi miasta po stronie zagrożenia, punkt ~3 m przed murem
  const dx=tx-v.x,dz=tz-v.z,ax=Math.abs(dx)>Math.abs(dz)?[Math.sign(dx),0]:[0,Math.sign(dz)];let t=v.Hs*0.6;for(let k=0;k<200&&pl.rho(ax[0]*t,ax[1]*t)<1;k++)t+=0.5;return [v.x+ax[0]*(t+3),v.z+ax[1]*(t+3),ax]}
TICKS.push(dt=>{if(SPC)return;const now=nowS();GARR.t-=dt;const doGar=GARR.t<=0&&isAuth();if(doGar)GARR.t=0.5;
  for(const v of villages.values()){if(!v||!v.city||v.wander||!v.Hs)continue;const dv=Math.hypot(v.x-player.p.x,v.z-player.p.z);if(dv>v.Hs+260)continue;let pl;try{pl=cityPlan(v)}catch(_){continue}const RR=v.Hs*1.25+4;
    let foes=[],ex=0;for(const e of enemies.values()){if(Math.abs(e.p.x-v.x)>RR+40||Math.abs(e.p.z-v.z)>RR+40)continue;if(e.gar===v.id)continue;if(!cityHostile(e))continue;if(e.p.y<v.h-14||e.p.y>v.h+45)continue;
      const rh=pl.rho(e.p.x-v.x,e.p.z-v.z);if(rh<1.0){if(!e._ckC){removeEnemy(e.id,true);ex++;continue}cityPushOut(v,pl,e)}e._ckC=1;if(rh<1.7)foes.push(e)}
    if(!doGar)continue;v._gar=v._gar||{ids:[],cd:0,quiet:0};const G=v._gar;G.ids=G.ids.filter(id=>{const g=enemies.get(id);return g&&g.st!==2});G.cd-=0.5;
    if(foes.length){G.quiet=0;const want=Math.min(10,2+Math.ceil(foes.length*1.2));if(G.ids.length<want&&G.cd<=0){let cx=0,cz=0;for(const f of foes){cx+=f.p.x;cz+=f.p.z}cx/=foes.length;cz/=foes.length;const [gx,gz,ax]=cityGate(v,pl,cx,cz);
        const n=Math.min(want-G.ids.length,3);for(let i=0;i<n;i++){const lat=(i-1)*1.6,x=gx-ax[1]*lat,z=gz+ax[0]*lat,h=colAt(x,z);if(h==null)continue;const g=makeE('straznik',evLvl(v.x,v.z)+1,G.ids.length%4===0,x,h,z,{});g.gar=v.id;g.post=[x,z];g.ry=Math.atan2(ax[0],ax[1]);G.ids.push(g.id)}
        G.cd=2.5;if(!G.warn||now-G.warn>40){G.warn=now;if(dv<v.Hs+80)toast('🛡 Straż miasta '+(v.name||'')+' wychodzi na najeźdźców!','#9fd0ff')}}}
    else if(G.ids.length){G.quiet+=0.5;if(G.quiet>25){for(const id of G.ids){const g=enemies.get(id);if(!g)continue;const pd=Math.hypot(g.p.x-player.p.x,g.p.z-player.p.z);if(pd>12||G.quiet>60)removeEnemy(id,true)}G.ids=G.ids.filter(id=>enemies.has(id))}}}});
