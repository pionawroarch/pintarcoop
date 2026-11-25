// =================== ETAP 5: struktury, bossowie (logika) ===================
const SR=192, structs=new Map(), strReq=new Set(), strState=new Map();
const STRN={ruiny:'Ruiny',oboz:'Obóz bandytów',wieza:'Wieża strażnicza',kurhan:'Kurhan',zamczysko:'Mroczne zamczysko',grota:'Smocza grota',gospoda:'Gospoda przy trakcie',kupcy:'Obóz kupców',pustelnia:'Pustelnia',swiatynia:'Świątynia'};
const STRC={ruiny:'#b0aaa0',oboz:'#e5483b',wieza:'#9fb6c8',kurhan:'#b874ff',zamczysko:'#ff3a5a',grota:'#ff8a2e',gospoda:'#7dd87d',kupcy:'#7dd87d',pustelnia:'#7dd87d',swiatynia:'#7dd87d'};
Object.assign(STRN,{wrak:'Zatopiony wrak',legowisko:'Leże olbrzyma',krag:'Kamienny krąg',gniazdo:'Pajęcze gniazdo',kopalnia:'Opuszczona kopalnia',oltarz:'Ołtarz kultystów',wiatrak:'Opuszczony wiatrak'});Object.assign(STRC,{wrak:'#3f7db5',legowisko:'#ff6b3a',krag:'#8ad8ff',gniazdo:'#d8d0b8',kopalnia:'#d9b23a',oltarz:'#c82a3a',wiatrak:'#c8a870'});
const FRIENDLY=new Set(['gospoda','kupcy','pustelnia','swiatynia']);Object.assign(STRN,{loch:'Wejście do lochu',jaskinia:'Jaskinia'});Object.assign(STRC,{loch:'#c87aff',jaskinia:'#a08060'});
const BOSSKEY={krol:'krol_s',matka:'matka',kolos:'kolos',faraon:'faraon'};
/*STRUCTS2*/
function hsAt(s,x,z){if(!s.fl){let mn=null;for(const [a,b] of [[-0.45,-0.45],[0.45,-0.45],[-0.45,0.45],[0.45,0.45]]){const h=colAt(x+a,z+b);if(h===null){mn=null;break}mn=mn===null?h:Math.min(mn,h)}if(mn!==null)return mn}const i=Math.max(0,Math.min(8,Math.round((x-s.x)/3)+4)),j=Math.max(0,Math.min(8,Math.round((z-s.z)/3)+4));return s.hs[j*9+i]}
function friendlyVillage(s){const b=s.b,race=(b===7||b===9)?'saurianie':(b===19||b===20)?'drowy':(b===3||b===10||b===11)?'elfy':(b===5||b===6||b===12)?'krasnoludy':(b===4||b===8)?'orkowie':'ludzie',R=RACES[race],r=rngOf('fv'+s.id);
  const v={id:s.id,x:s.x,z:s.z,h:s.h,b,race,small:1,houses:[],npcs:[],lvl:s.lvl,name:STRN[s.type],cols:[]};
  const H=(type,func,dz)=>{const h={x:s.x,z:s.z+(dz||0),rot:0,top:s.h,bot:s.h-1,type,func,v:Math.floor(r()*5)};const c=houseCore(h);h.core=c;h.cx=h.x+c.ox;h.cz=h.z+c.oz;v.houses.push(h);return h};
  const N=(role,roleN,dx,dz,qg)=>{const fem=r()<0.45,pool=fem?R.f:R.m;v.npcs.push({id:s.id+':'+role+v.npcs.length,vid:s.id,role,fem,name:pool[Math.floor(r()*pool.length)],roleN:roleN||ROLE[role][fem?1:0],x:s.x+dx,z:s.z+dz,ry:0,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth),race,qg:!!qg})};
  if(s.type==='gospoda'){H('karczma','karczma',-3);N('kupiec','Karczmarz',2.5,4.5);N('wedr',null,-3,5.5);N('mieszk','Gość',4,6.5,r()<0.5)}
  if(s.type==='kupcy'){v.camp=1;N('kupiec',null,-3.5,0);N('kupiec',null,3.5,0);N('straz',null,0,-4);N('wedr',null,0,4.5,true)}
  if(s.type==='pustelnia'){H('chata','dom',-2);N('starszy','Pustelnik',1.5,4.2,true)}
  if(s.type==='swiatynia'){H('wiezaDom','kaplica',-3);v.temple=1;N('starszy','Kapłan',2,4.5,true);N('mieszk','Pielgrzym',-2.5,5)}
  if(s.type==='klasztor'){v.temple=1;N('starszy','Opat',0,8,true);N('mieszk','Mnich',2.5,1.5);N('mieszk','Mnich zielarz',6.5,2);N('kupiec','Brat szafarz',-6.5,6)}
  if(s.type==='cyrk'){v.camp=1;N('kupiec','Dyrektor cyrku',0,8.6);N('mieszk','Żongler',-3,8.2);N('mieszk','Linoskoczka',3,8.6);N('wedr','Treser',7,3.6,true)}
  if(s.type==='farma'){N('mieszk','Gospodarz',0,2.2,true);N('mieszk','Gospodyni',-5,-1.6);N('kupiec','Rolnik',3,1.5)}
  if(s.type==='latarnik'){N('starszy','Latarnik',3.8,4.4,true)}
  if(s.type==='gaj'){v.temple=1;N('starszy','Arcydruid',0,2,true);N('kupiec','Druidka zielarka',3,-3)}
  return v}
function onStr(list){for(const {gx,gz,s} of list){const k=gx+'_'+gz;strReq.delete(k);if(s){const sp=spawnPt();s.lvl=Math.max(1,1+Math.floor(Math.hypot(s.x-sp[0],s.z-sp[2])/260));
  if(s.type==='kurhan'){s.bossT=BOSSKEY[BOSS_BY_BIOME[s.b]||'krol'];s.name='Kurhan: '+EDEF[s.bossT].n}else s.name=STRN[s.type];
  if(s.isl){s.lvl+=3;s.name='Lochy Wyspy (wyprawa)';s.icol='#4ac8ff'}
  if(s.type==='zamczysko'){s.bossT=[3,9,10,11].includes(s.b)?'prastary':strHash(s.id)%2?'lich':'krol_troll';s.name='Zamczysko: '+EDEF[s.bossT].n}
  if(s.type==='grota'){s.bossT='smok';s.name=STRN.grota}
  if(s.type==='legowisko'){s.bossT=hugeFor(s.b);s.name='Leże: '+((EDEF[s.bossT]&&EDEF[s.bossT].n)||HUGEB[s.bossT].n)}
  if(FRIENDLY.has(s.type)){s.friendly=1;const fv=friendlyVillage(s);villages.set(s.id,fv)}s.cols=[]}structs.set(k,s)}}
function clearStructs(){for(const s of structs.values())if(s&&s.g)unbuildStruct(s);structs.clear();strReq.clear()}
const strSeen=s=>s&&(W.seen[s.id]||Math.hypot(s.x-player.p.x,s.z-player.p.z)<Math.max(150,S.rd*C*0.92));
let sreqT={};
function strTick(){
  if(!S.spawn)return;const gx=Math.floor(player.p.x/SR),gz=Math.floor(player.p.z/SR),need=[];
  for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){const k=(gx+dx)+'_'+(gz+dz);if(!structs.has(k)&&!strReq.has(k)){need.push([gx+dx,gz+dz]);strReq.add(k)}}
  if(need.length){const w=workers[0];w.busy++;w.postMessage({type:'str',seed:S.seed,cells:need,sx:S.spawn[0],sz:S.spawn[2],id:reqId++})}
  const lim=S.rd*C+40,now=Date.now();
  for(const s of structs.values()){if(!s)continue;const d=Math.hypot(s.x-player.p.x,s.z-player.p.z);
    if(d<lim&&!s.g){/* budujemy dopiero, gdy teren pod całą budowlą jest wczytany — inaczej części wisiały nad ziemią albo w niej tonęły */let ok=true;for(const [a,b] of [[0,0],[-11,-11],[11,-11],[-11,11],[11,11]])if(colAt(s.x+a,s.z+b)===null){ok=false;break}if(ok){buildStruct(s);mapCaptureStruct(s)}}else if(d>lim+80&&s.g)unbuildStruct(s);
    if(d<Math.max(150,S.rd*C*0.92)&&!W.seen[s.id]){W.seen[s.id]=1;saveW();MAP3D.dirty=true;try{mapV.dirty=true}catch(_){}toast('Odkryto: '+s.name,STRC[s.type])}
    // strażnicy / boss: prośba do hosta
    if(s.friendly||s.type==='loch'||s.type==='jaskinia'||s.type==='wrak'||s.type==='smok'||s.type==='portal'||['obelisk','akwedukt','kolos','sterowiec','sygnal','rozdroze'].includes(s.type))continue;const trig=s.type==='kurhan'?20:s.type==='grota'?30:s.type==='zamczysko'?55:s.type==='legowisko'?38:45;
    if(d<trig&&!P2.dead&&!guardsAlive(s)&&(!sreqT[s.id]||now-sreqT[s.id]>5000)){sreqT[s.id]=now;const def={id:s.id,type:s.type,x:s.x,z:s.z,lvl:s.lvl,b:s.b,boss:s.bossT||null};
      if(isAuth())spawnStructGuards(def);else NET.tr.send({t:'sspawn',from:NET.id,def})}}
}
const guardsAlive=s=>{for(const e of enemies.values())if(e.sid===s.id&&e.st!==2)return true;return false};
const ERAR=[{n:'',hp:1,dmg:1,xp:1,sc:1},{n:'Niezwykły',hp:1.3,dmg:1.12,xp:1.5,sc:1.04},{n:'Rzadki',hp:1.7,dmg:1.28,xp:2.2,sc:1.08},{n:'Epicki',hp:2.4,dmg:1.5,xp:3.5,sc:1.13},{n:'Legendarny',hp:3.4,dmg:1.8,xp:6,sc:1.2}];
function rollERar(){const q=Math.random();return q<0.012?4:q<0.045?3:q<0.12?2:q<0.3?1:0}
// v125: poziom stworów zależy od poziomu graczy w pobliżu (nigdy niższy), a nie od odległości od spawnu.
// Premie miejsca (lochy, kolejne piętra, bossowie) zostają jako dodatek ponad poziom gracza.
function partyLvlAt(x,z){let best=0;try{for(const p of playersList()){if(Math.hypot(p.p.x-x,p.p.z-z)<220)best=Math.max(best,p.lv||1)}}catch(_){}return best||HERO.lvl||1}
function scaleELvl(t,lvl,elite,x,z,extra){const d0=EDEF[t]||{};if(d0.ally||(extra&&(extra.pet||extra.ally||extra.keepLvl)))return lvl;const base=partyLvlAt(x,z),zl=evLvl(x,z),bonus=Math.max(0,Math.min(8,(lvl||1)-zl));
  const roll=Math.random()<0.35?1:Math.random()<0.12?2:0;return Math.max(1,base+bonus+roll+(d0.boss?2:0))}
function makeE(t,lvl,elite,x,y,z,extra){lvl=scaleELvl(t,lvl,elite,x,z,extra);const d0=EDEF[t],rar=(d0.boss||(extra&&(extra.car||extra.qid||extra.rar===0))||t==='woz')?0:rollERar(),max=Math.round((d0.passive?1:HPM)*d0.hp*(1+0.38*(lvl-1))*(elite&&!d0.boss?3:1)*ERAR[rar].hp);
  const e={id:eSeq++,t,lvl,elite,rar,p:new THREE.Vector3(x,y,z),vx:0,vz:0,ry:Math.random()*6,hp:max,max,st:0,cd:0,wind:0,tgt:null,prov:0,wan:null,dieT:0,flash:0,speed:0,...extra};
  addEnemyModel(e);enemies.set(e.id,e);return e}
function spawnStructGuards(def){
  for(const e of enemies.values())if(e.sid===def.id&&e.st!==2)return;
  const st=strState.get(def.id);if(st&&st.cleared&&Date.now()-st.cleared<(def.type==='legowisko'||def.type==='kurhan'||def.type==='zamczysko'||def.type==='grota'?900e3:600e3))return;
  let list;
  if(def.space){for(const [t,x,y,z,boss] of spaceSpawnList(def))makeE(t,def.lvl+(boss?2:0),boss,x,y+0.05,z,{sid:def.id,home:[x,z]});strState.set(def.id,{cleared:0});return}
  if(def.type==='wyspy'){skySpawn(def);return}
  if(def.type==='kurhan')list=[def.boss].concat(def.boss==='krol_s'?['szkielet','szkielet']:[]);
  else if(def.type==='zamczysko')list=[def.boss].concat(def.boss==='lich'?['upior','upior','szkielet','lucznik_s','szkielet','lucznik_s']:def.boss==='prastary'?['drzewiec','wilkolak','drzewiec','wilk','wilk']:['ork','ork','troll','ork','lucznik_s','ork']);
  else if(def.type==='grota')list=[def.boss];
  else if(def.type==='legowisko'){const H=HUGEB[def.boss]||HUGEB.behemot;list=[def.boss].concat(H.m.filter(t=>EDEF[t]))}
  else if(def.type==='oboz')list=['bandyta','bandyta','bandyta','szaman'];
  else if(def.type==='wieza')list=['lucznik_s','lucznik_s','szkielet','szkielet'];
  else if(def.type==='krag')list=['upior','upior','kultysta','mag'].filter(t=>EDEF[t]);
  else if(def.type==='gniazdo')list=['pajak','pajak','pajak','pajak','pajak'];
  else if(def.type==='kopalnia')list=['goblin','goblin','goblin','szaman','goblin'];
  else if(def.type==='oltarz')list=['kultysta','kultysta','kultysta','mroczny_rycerz'].filter(t=>EDEF[t]);
  else if(def.type==='wiatrak')list=['bandyta','bandyta','bandyta','kusznik'].filter(t=>EDEF[t]);
  else if(def.type==='wiezaczar')list=['lich','kultysta','upior','kultysta','mag'].filter(t=>EDEF[t]);
  else if(def.type==='piraci')list=['bandyta','bandyta','kusznik','bandyta','szaman'].filter(t=>EDEF[t]);
  else if(def.type==='gryf')list=['wiwerna','wiwerna','wiwerna'].filter(t=>EDEF[t]);
  else if(def.type==='widmo')list=['upior','szkielet','upior','szkielet','wilkolak','lucznik_s'].filter(t=>EDEF[t]);
  else if(def.type==='most')list=['bandyta','kusznik','bandyta','kusznik','bandyta'].filter(t=>EDEF[t]);
  else if(def.type==='cmentarz')list=['szkielet','upior','szkielet','lucznik_s'].filter(t=>EDEF[t]);
  else if(def.type==='ul')list=['pszczola','pszczola','pszczola','pszczola'].filter(t=>EDEF[t]);
  else if(def.type==='meteoryt')list=['golem_meteor','zywiolak'].filter(t=>EDEF[t]);
  else if(def.type==='totemy')list=['ork','ork','szaman','ork'].filter(t=>EDEF[t]);
  else if(def.type==='kamieniolom')list=['bandyta','golem','bandyta'].filter(t=>EDEF[t]);
  else if(def.type==='zatopiona')list=['krab','krab','slime','krab'].filter(t=>EDEF[t]);
  else list=def.b===4?['mumia','szkielet','lucznik_s','mumia']:['szkielet','szkielet','szkielet','lucznik_s'];
  if(list.some(t=>EDEF[t].boss))sfx('roar');
  list.forEach((t,i)=>{const boss=!!EDEF[t].boss,a=i/list.length*6.28+0.4,r=boss?(def.type==='grota'?-6:0):(def.type==='zamczysko'?5+(i%3)*3:4+(i%2)*2.5),x=def.x+Math.cos(a)*r,z=def.z+Math.sin(a)*r,h=colAt(x,z);if(h===null)return;
    makeE(t,def.lvl+(boss?2:0),boss||(i===0&&Math.random()<0.4),x,h,z,{sid:def.id,home:[def.x,def.z]})});
  strState.set(def.id,{cleared:0});
}
function summon(e){
  {const D=EDEF[e.t];if(D.mins){for(let i=0;i<3;i++){const a=i*2.1+Math.random(),x=e.p.x+Math.cos(a)*7,z=e.p.z+Math.sin(a)*7,h=colAt(x,z);if(h!==null&&h<WATER-2)makeE(D.mins[i%D.mins.length],Math.max(1,e.lvl-2),false,x,WATER-1.15,z,{home:e.home,prov:10})}ringFx(e.p.x,WATER,e.p.z,5,'frost');sendFx({k:'ring',p:[e.p.x,WATER,e.p.z],r:5,kind:'frost'});toast('Z głębin przybywają sługi: '+D.n+'!','#7fe3ff');return}}
  const bk=EDEF[e.t].boss,t=bk==='krol'||bk==='lich'?'szkielet':bk==='matka'?'pajak':bk==='faraon'?'mumia':bk==='troll'?'ork':bk==='ent'?'wilk':bk==='lich2'?'upior':null;
  if(!t){e.enraged=1;return}
  for(let i=0;i<3;i++){const a=i*2.1,x=e.p.x+Math.cos(a)*3,z=e.p.z+Math.sin(a)*3,h=colAt(x,z);if(h!==null)makeE(t,Math.max(1,e.lvl-2),false,x,h,z,{sid:e.sid,home:e.home,prov:10})}
  ringFx(e.p.x,e.p.y,e.p.z,4,'smoke');sendFx({k:'ring',p:[e.p.x,e.p.y,e.p.z],r:4,kind:'smoke'});
}
const HPM=2.7,DMGM=1.5;
const eDmg=e=>DMGM*EDEF[e.t].dmg*(1+0.27*(e.lvl-1))*(e.elite&&!EDEF[e.t].boss?1.6:1)*ERAR[e.rar||0].dmg*rnd(0.9,1.1);
function enemyShoot(e,tg,kind,dmg,spread){
  const s=eSc(e),o=[e.p.x,e.p.y+1.25*s,e.p.z];let dx=tg.p.x-o[0],dy=tg.p.y+1.0-o[1],dz=tg.p.z-o[2];const dist=Math.hypot(dx,dz)||1;
  const P=PROJ[kind];dy+=0.5*P.g*Math.pow(dist/P.spd,2);let l=Math.hypot(dx,dy,dz);let d=[dx/l,dy/l,dz/l];
  if(spread){const c=Math.cos(spread),sn=Math.sin(spread);d=[d[0]*c+d[2]*sn,d[1],-d[0]*sn+d[2]*c]}
  spawnProj(kind,o,d,false,0,{h:1,dmg,src:[e.p.x,e.p.z]});sendFx({k:'proj',kind,o,d,h:1});
}
function bossAI(e,d,tg,td,dt){
  const A=e.ab||(e.ab={slam:3,vol:4,ch:5,sum:[0.66,0.33],tele:0,charge:0,tr:5});
  A.slam-=dt;A.vol-=dt;A.ch-=dt;
  {const hp=e.hp/e.max,ph=hp<0.3?3:hp<0.6?2:1;if(!A.ph)A.ph=1;if(ph>A.ph){A.ph=ph;if(ph===3)e.enraged=1;const tx=EDEF[e.t].n+(ph===2?' wpada w szał! (faza 2)':' walczy resztkami sił! (faza 3)');toast(tx,'#ff6b5b');sendFx({k:'toast',txt:tx,col:'#ff6b5b'});sfx('growl',1);A.zone=1.2;A.slam=Math.min(A.slam,1)}
    if(A.ph>=2){A.zone=(A.zone??4)-dt;if(A.zone<=0&&!A.zs){A.zone=A.ph===3?5:7.5;A.zs=[];for(const p of playersList())if(!p.dead&&Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)<32)A.zs.push([p.p.x,p.p.y,p.p.z]);for(let k=0;k<(A.ph===3?4:2);k++){const a=Math.random()*6.28,r=rnd(3,10);const x=e.p.x+Math.cos(a)*r,z=e.p.z+Math.sin(a)*r,h=colAt(x,z,e.p.y+3);A.zs.push([x,d.swim?Math.max(WATER,h??WATER):(h??e.p.y),z])}
        A.zt=1.4;for(const q of A.zs){teleFx(q[0],q[1],q[2],3.2,1.4);sendFx({k:'tele',p:q,r:3.2,t:1.4})}}
      if(A.zs){A.zt-=dt;if(A.zt<=0){const kind=d.boss==='lich'||d.boss==='faraon'?'smoke':d.boss==='matka'?'frost':'fire';for(const q of A.zs){ringFx(q[0],q[1],q[2],3.2,kind);sendFx({k:'ring',p:q,r:3.2,kind});for(const p of playersList())if(!p.dead&&Math.hypot(p.p.x-q[0],p.p.z-q[2])<3.2&&Math.abs(p.p.y-q[1])<4)hurtPlayer(p.id,eDmg(e)*1.4,e)}A.zs=null}}}}
  if(A.tele>0){A.tele-=dt;e.st=1;if(A.tele<=0){e.st=0;for(const p of playersList())if(!p.dead&&Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)<A.tr)hurtPlayer(p.id,eDmg(e)*1.7,e);
      {const ty=d.swim?WATER+0.05:e.p.y;ringFx(e.p.x,ty,e.p.z,A.tr,'war');sendFx({k:'ring',p:[e.p.x,ty,e.p.z],r:A.tr,kind:'war'})}}return[0,0,0]}
  if(A.charge>0){A.charge-=dt;for(const p of playersList())if(!p.dead&&!A.hit.has(p.id)&&Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)<2.4){A.hit.add(p.id);hurtPlayer(p.id,eDmg(e)*1.3,e)}return[A.cdir[0],A.cdir[1],15]}
  if(A.sum.length&&e.hp/e.max<A.sum[0]){A.sum.shift();summon(e)}
  if(!tg)return null;
  if(A.slam<=0&&td<7){A.slam=6.5+rnd(0,2);A.tr=(d.boss==='kolos'||d.boss==='smok'||d.boss==='ent'?7.5:d.boss==='troll'?6.5:5.5)*(d.huge?Math.max(1,eSc(e)/2.8):1);A.tele=1.1;{const ty=d.swim?WATER+0.05:e.p.y;teleFx(e.p.x,ty,e.p.z,A.tr,1.1);sendFx({k:'tele',p:[e.p.x,ty,e.p.z],r:A.tr,t:1.1})}return[0,0,0]}
  if(A.vol<=0&&(d.boss==='matka'||d.boss==='faraon'||d.boss==='smok'||d.boss==='lich')&&td>3.5&&td<26){A.vol=d.boss==='smok'?4:5;const kind=d.boss==='matka'?'poison':d.boss==='smok'?'fire':'curse';for(let i=-2;i<=2;i++){if((d.boss==='faraon'||d.boss==='lich')&&Math.abs(i)>1)continue;enemyShoot(e,tg,kind,eDmg(e)*0.7,i*0.2)}e.cd=Math.max(e.cd,0.8);return null}
  if(A.ch<=0&&(d.boss==='kolos'||d.boss==='krol'||d.boss==='troll'||d.boss==='smok'||d.boss==='ent')&&td>5&&td<18){A.ch=7.5;A.charge=0.7;A.cdir=[(tg.p.x-e.p.x)/td,(tg.p.z-e.p.z)/td];A.hit=new Set();e.ry=Math.atan2(A.cdir[0],A.cdir[1]);return[A.cdir[0],A.cdir[1],15]}
  if(e.enraged)return null;
  return null;
}
// ---------- efekt zapowiedzi uderzenia ----------
const discGeo=new THREE.CircleGeometry(1,40);
function teleFx(x,y,z,r,t){
  const g=new THREE.Group();const o=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:0xff3b2e,transparent:true,opacity:0.7,side:THREE.DoubleSide,depthWrite:false}));o.scale.setScalar(r);
  const i=new THREE.Mesh(discGeo,new THREE.MeshBasicMaterial({color:0xff3b2e,transparent:true,opacity:0.3,side:THREE.DoubleSide,depthWrite:false}));g.add(o,i);g.rotation.x=-Math.PI/2;g.position.set(x,y+0.25,z);scene.add(g);rings.push({m:g,r,t:0,dur:t,tele:i});
}
// ---------- budowa struktur ----------
function castleGeo(s){const L=[],D='#6f6a73',D2='#5d5a63',D3='#7d7884',SL='#4a4f5a',SL2='#3e4350',WD='#3a2414',P=(...b)=>L.push(b);const A=21,Hw=12;
  const wall=(x,z,w,d)=>{P(x,Hw/2-1,z,w,Hw+2,d,D);P(x,Hw-0.4,z,w+0.3,0.5,d+0.3,D3);const long=w>d,len=long?w:d,n=Math.floor(len/1.6);for(let i=0;i<n;i+=2){const o=-len/2+0.8+i*1.6;P(long?x+o:x,Hw+0.6,long?z:z+o,long?0.9:d,1.4,long?d:0.9,D2)}P(x,1.2,z,w+0.8,2.4,d+0.8,D2)};
  wall(0,-A,2*A,3);wall(A,0,3,2*A);wall(-A,0,3,2*A);wall(-12.25,A,17.5,3);wall(12.25,A,17.5,3);
  const tower=(x,z,s,h,roof)=>{P(x,h/2-1,z,s,h+2,s,D);P(x,1.2,z,s+1.2,2.4,s+1.2,D2);for(const y of [h*0.4,h*0.75])P(x,y,z,s+0.3,0.4,s+0.3,D3);
    for(const [ax,az] of [[1,0],[-1,0],[0,1],[0,-1]])for(const y of [h*0.3,h*0.55,h*0.8])P(x+ax*(s/2+0.01),y,z+az*(s/2+0.01),ax?0.04:0.25,1.1,az?0.04:0.25,'#1a1a1a');
    P(x,h+0.3,z,s+1,0.6,s+1,D3);const st=7,rh=s*1.1;for(let i=0;i<st;i++){const w=(s+0.4)*(1-i/st)+0.2;P(x,h+0.6+i*rh/st+rh/st/2,z,w,rh/st+0.05,w,i%2?SL2:roof)}
    P(x,h+0.6+rh+0.6,z,0.12,1.2,0.12,WD);P(x+0.5,h+0.6+rh+0.9,z,1.0,0.6,0.05,'#1a1a1a~');P(x+0.5,h+0.6+rh+0.9,z,0.4,0.3,0.06,'#a8352a')};
  for(const [x,z] of [[A,A],[-A,A],[A,-A],[-A,-A]])tower(x,z,8,18,SL);
  for(const x of [-6,6])tower(x,A,5,15,SL);
  P(0,13.6,A,7.5,3.2,3.2,D);for(let i=-3;i<=3;i++)P(i*0.9,9.4,A+1.6,0.1,4.4,0.1,'#2a2a30');P(0,11.4,A+1.7,7,0.12,0.12,'#2a2a30');
  // donżon
  P(0,9,-12,16,20,14,D);P(0,1.2,-12,17,2.4,15,D2);for(const y of [6,12,17])P(0,y,-12,16.3,0.4,14.3,D3);
  for(const xx of [-5,-1.7,1.7,5])for(const y of [8,13,17.5])P(xx,y,-4.99,0.5,1.4,0.04,y>12?'#ffb04a':'#1a1a1a');
  P(0,2,-4.95,3,4,0.1,WD);P(0,4.4,-4.9,3.4,0.6,0.15,D3);
  for(const [x,z] of [[8,-5],[-8,-5],[8,-19],[-8,-19]])tower(x,z,4,25,SL);
  {const st=8;for(let i=0;i<st;i++){const w=14*(1-i/st)+0.4,d=12*(1-i/st)+0.4;P(0,19.3+i*0.9,-12,w,0.95,d,i%2?SL2:SL)}}
  // dziedziniec: koksowniki, sztandary, kości
  for(const [x,z] of [[-6,4],[6,4],[-6,14],[6,14]])P(x,0.5,z,0.8,1.0,0.8,'#2a2a30'),P(x,1.15,z,0.6,0.3,0.6,'#ff6a1a'),P(x,1.4,z,0.3,0.3,0.3,'#ffd34d');
  for(const x of [-14,-8,8,14])P(x,8,A-1.55,1.4,4,0.08,'#1a1a1a~'),P(x,8.6,A-1.6,0.6,0.6,0.08,'#a8352a');
  for(let i=0;i<6;i++)P(-10+i*4,0.1,8+((i*37)%5),0.6,0.12,0.18,'#e8e2cc');
  return kitB(L)}
function grotaGeo(s,r){const L=[],S1='#6c6a67',S2='#7d7b78',S3='#5a5856';
  for(let i=0;i<26;i++){const a=i/26*Math.PI*2,rr=6+r()*4,x=Math.cos(a)*rr,z=Math.sin(a)*rr;if(Math.sin(a)>0.82&&Math.abs(Math.cos(a))<0.5)continue;const h=3+r()*6*(1-Math.max(0,Math.sin(a))*0.4);L.push([x,h/2-2,z,2.6+r()*2,h+4,2.6+r()*2,[S1,S2,S3][i%3]])}
  L.push([0,4,-1,10,10,8,S3],[0,8.5,-1.5,7,3,6,S1],[0,10.5,-2,4,2,4,S2]);
  L.push([0,1.6,5.2,3.4,3.6,0.4,'#120c0a'],[0,3.6,5.3,4.2,0.6,0.8,S2]);
  for(let i=0;i<10;i++){const x=(r()-0.5)*9,z=6+r()*5;L.push([x,0.08,z,1.6+r(),0.08,1.4+r(),'#2a221c'])}
  for(let i=0;i<8;i++)L.push([(r()-0.5)*8,0.15,6+r()*5,0.7,0.14,0.18,'#e8e2cc']);
  for(let i=0;i<5;i++){const x=-2+i,z=4.2+(i%2)*0.5;L.push([x,0.2+(i%3)*0.1,z,0.8,0.4+(i%3)*0.2,0.7,'#e0b84a'])}
  return kitB(L)}
// ===== szczegółowe struktury (poziom detalu jak budynki ludzi: ciosy kamienne, belki, dachówki, otwory, rekwizyty) =====
function structDetail(s,r){const T=s.type,L=[],cols=[],B=(x,y,z,w,h,d,c)=>L.push([x,y+h/2,z,w,h,d,c]),G=(x,z)=>hsAt(s,s.x+x,s.z+z),col=(x,z,hw,hd,top)=>cols.push([s.x+x,s.z+z,hw,hd,top]);
  const pc=(p,a,b,c)=>p[Math.abs(Math.floor(a*7.31+b*13.17+c*3.71))%p.length],desert=s.b===4;
  const STN=desert?['#d9c79a','#cfbb8a','#e2d2a8','#c4ae7c']:['#8e8a90','#83808a','#9a959c','#77737d'],SDK=desert?'#b49a68':'#5d5a63',MOSS=['#5f7a3a','#6b8a40','#4f6a32'],WD=['#6a4428','#5a3a22','#7a5030'],WDD='#3a2414',RF=['#a8452c','#93391f','#b5532f'],CV=['#c8b89a','#b8a888','#d6c8aa'],IR='#3a3a40',BN='#e8e2cc',FIRE='!#ff8a2e',GLOWP='!#c890ff';
  // mur z ciosów: ax 'x' (wzdłuż X na z=o) lub 'z'; holes: [a0,a1,y0,y1]
  const cw=(ax,a0,a1,o,y0,h,th,pal,q={})=>{const n=Math.max(1,Math.round((a1-a0)/(q.bl||1))),st=(a1-a0)/n,hs=[],holes=q.holes||[];
    for(let i=0;i<n;i++){let hc=h;if(q.jag){const e=Math.min(i,n-1-i);hc=h*Math.min(1,(q.min||0.3)+r()*0.5+e*0.12)}hs.push(Math.max(0.5,Math.round(hc*2)/2))}
    const put=(a,y,o2,la,hg,t,c)=>ax==='x'?B(a,y,o2,la,hg,t,c):B(o2,y,a,t,hg,la,c);
    const inH=(a,y)=>holes.some(k=>a>k[0]&&a<k[1]&&y>k[2]&&y<k[3]);
    for(let i=0;i<n;i++){const a=a0+(i+0.5)*st;let cuts=[[0,hs[i]]];for(const k of holes)if(a>k[0]&&a<k[1]){const nc=[];for(const [u,v] of cuts){if(k[2]>u)nc.push([u,Math.min(v,k[2])]);if(k[3]<v)nc.push([Math.max(u,k[3]),v])}cuts=nc}
      if(!q.nocore)for(const [u,v] of cuts)if(v-u>0.05)put(a,y0+u,o,st,v-u,th,q.core||SDK);if(q.moss&&r()<0.35)put(a,y0+hs[i],o,st*0.9,0.18,th+0.1,MOSS[i%3])}
    const mh=Math.max(...hs);const rh=q.rh||0.5;for(let y=0,row=0;y<mh-0.2;y+=rh,row++)for(let a=a0-(row%2?0.5*st:0);a<a1;a+=st){const s0=Math.max(a,a0),s1=Math.min(a+st,a1);if(s1-s0<0.3)continue;
      const i0=Math.max(0,Math.floor((s0-a0)/st)),i1=Math.min(n-1,Math.floor((s1-a0-0.01)/st));let m=1e9;for(let i=i0;i<=i1;i++)m=Math.min(m,hs[i]);if(y+rh>m+0.01)continue;const mid=(s0+s1)/2;if(inH(mid,y+rh/2)||inH(s0+0.05,y+rh/2)||inH(s1-0.05,y+rh/2))continue;
      const c=pc(pal,mid,y,o+row);for(const f of (q.one?[q.one]:[-1,1]))put(mid,y0+y+0.02,o+f*(th/2+0.04),s1-s0-0.07,rh-0.04,0.09,c)}
    for(const k of holes){const am=(k[0]+k[1])/2,wd=k[1]-k[0];if(k[3]<h-0.3){put(am,y0+k[3],o,wd+0.6,0.5,th+0.2,pal[2]);if(wd>1.2)put(am,y0+k[3]+0.5,o,wd*0.5,0.3,th+0.2,pal[0])}if(k[2]>0.1)put(am,y0+k[2]-0.18,o,wd+0.3,0.2,th+0.25,pal[3])}
    return hs};
  // ściany ciosów wokół bryły (prostopadłościan)
  const blockFaces=(x,z,w,d,y0,h,pal,q={})=>{B(x,y0,z,w-0.1,h,d-0.1,q.core||SDK);const o2={nocore:1,bl:q.bl,rh:q.rh};cw('x',x-w/2,x+w/2,z+d/2-0.05,y0,h,0.02,pal,{...o2,one:1,holes:q.hz||[]});cw('x',x-w/2,x+w/2,z-d/2+0.05,y0,h,0.02,pal,{...o2,one:-1,holes:q.hz2||[]});cw('z',z-d/2,z+d/2,x+w/2-0.05,y0,h,0.02,pal,{...o2,one:1});cw('z',z-d/2,z+d/2,x-w/2+0.05,y0,h,0.02,pal,{...o2,one:-1})};
  const gable=(x,z,w,d,y,h,pal,ax,end)=>{const n=Math.max(4,Math.round(h/0.45)),dh=h/n;for(let i=0;i<n;i++){const k=1-i/n,c=pal[i%pal.length];if(ax==='x'){B(x,y+i*dh,z,w+0.7,dh+0.02,d*k+0.5,c);if(end)for(const s2 of [-1,1])B(x+s2*(w/2-0.05),y+i*dh,z,0.15,dh,d*k-0.2,end)}else{B(x,y+i*dh,z,d*k+0.5,dh+0.02,w+0.7,c);if(end)for(const s2 of [-1,1])B(x,y+i*dh,z+s2*(w/2-0.05),d*k-0.2,dh,0.15,end)}}
    if(ax==='x')B(x,y+h,z,w+0.9,0.22,0.35,WDD);else B(x,y+h,z,0.35,0.22,w+0.9,WDD)};
  const pyr=(x,z,s2,y,h,pal)=>{const n=Math.max(4,Math.round(h/0.5)),dh=h/n;for(let i=0;i<n;i++){const k=(s2+0.6)*(1-i/n)+0.2;B(x,y+i*dh,z,k,dh+0.02,k,pal[i%pal.length]);B(x,y+i*dh,z,k+0.25,0.08,k+0.25,WDD)}B(x,y+h,z,0.12,1.2,0.12,WDD)};
  const torch=(x,y,z)=>{B(x,y,z,0.12,0.6,0.12,WDD);B(x,y+0.6,z,0.22,0.22,0.22,FIRE)};
  const crate=(x,y,z,k)=>{B(x,y,z,k,k,k,WD[0]);B(x,y+k*0.45,z,k+0.04,0.08,k+0.04,WDD);B(x,y,z,k+0.04,0.08,k+0.04,WDD)};
  const barrel=(x,y,z)=>{B(x,y,z,0.7,0.9,0.7,WD[2]);B(x,y+0.15,z,0.76,0.08,0.76,IR);B(x,y+0.68,z,0.76,0.08,0.76,IR);B(x,y+0.9,z,0.56,0.05,0.56,WD[1])};
  const deadTree=(x,z,h)=>{const g=G(x,z);B(x,g-0.5,z,0.5,h+0.5,0.5,'#4a3a2c');B(x+0.6,g+h*0.6,z,1.2,0.25,0.25,'#4a3a2c');B(x-0.3,g+h*0.8,z+0.4,0.25,0.25,0.9,'#4a3a2c');B(x+1.1,g+h*0.6,z,0.2,0.8,0.2,'#4a3a2c')};
  const rubble=(x,z,n,pal)=>{for(let i=0;i<n;i++){const a=r()*6.28,rr=r()*1.6,px=x+Math.cos(a)*rr,pz=z+Math.sin(a)*rr,k=0.3+r()*0.5;B(px,G(px,pz)-0.1,pz,k*1.3,k,k,pal[i%pal.length])}};
  const rock=(x,z,y0,w,h,d,pal)=>{const n=Math.max(3,Math.round(h/0.9));let cx=x,cz=z;for(let i=0;i<n;i++){const k=1-0.55*Math.pow(i/n,1.4),ww=w*k*(0.85+r()*0.3),dd=d*k*(0.85+r()*0.3),y=y0+i*h/n;B(cx,y,cz,ww,h/n+0.05,dd,pal[(i+Math.round(x+z))%pal.length]);if(r()<0.5)B(cx+(r()-0.5)*ww*0.6,y,cz+(r()-0.5)*dd*0.6,ww*0.5,h/n*0.6,dd*0.5,pal[(i+1)%pal.length]);B(cx,y+h/n-0.06,cz,ww+0.08,0.08,dd+0.08,pal[pal.length-1]);cx+=(r()-0.5)*0.5;cz+=(r()-0.5)*0.5}};
  let chest=[0,0];
  if(T==='ruiny'){const gy=G(0,0),ang=r()<0.5;const W2=14,D2=10;B(0,gy-3,0,W2+1,3,D2+1,SDK);
    for(let x=-W2/2+1;x<W2/2;x+=1.5)for(let z=-D2/2+1;z<D2/2;z+=1.5)if(r()<0.8)B(x,gy-0.05,z,1.4,0.12,1.4,pc(STN,x,z,1));
    cw('x',-W2/2,W2/2,-D2/2,gy,6,0.9,STN,{jag:1,min:0.45,moss:!desert,holes:[[-4.2,-2.8,2.4,4.2],[2.8,4.2,2.4,4.2]]});
    cw('x',-W2/2,W2/2,D2/2,gy,5,0.9,STN,{jag:1,min:0.15,moss:!desert,holes:[[-1,1,0,3.4]]});
    cw('z',-D2/2,D2/2,-W2/2,gy,5.5,0.9,STN,{jag:1,min:0.3,moss:!desert,holes:[[-1,0.4,2.2,4]]});
    cw('z',-D2/2,D2/2,W2/2,gy,4,0.9,STN,{jag:1,min:0.05});
    // portal z łukiem i resztkami wrót
    for(const sx of [-1.3,1.3]){B(sx,gy,D2/2+0.5,0.6,3.6,0.6,STN[2]);B(sx,gy,D2/2+0.5,0.8,0.4,0.8,STN[3])}for(let k=-2;k<=2;k++)B(k*0.5,gy+3.4+(2-Math.abs(k))*0.15,D2/2+0.5,0.5,0.4,0.7,STN[k&1?0:2]);B(-0.6,gy,D2/2+0.1,0.9,2.4,0.12,WD[1]);B(-0.6,gy+0.6,D2/2+0.18,0.95,0.1,0.06,IR);B(-0.6,gy+1.8,D2/2+0.18,0.95,0.1,0.06,IR);
    // narożna baszta – złamana
    {const tx=-W2/2,tz=-D2/2,th=9;blockFaces(tx,tz,3.4,3.4,gy-1,th,STN);for(let i=0;i<5;i++)B(tx-1.2+r()*2.4,gy+th-1,tz-1.2+r()*2.4,0.8,0.5+r()*1.3,0.8,STN[i%4]);B(tx+1.72,gy+4,tz,0.06,1,0.25,'#1a1a1a');B(tx,gy+6,tz+1.72,0.25,1,0.06,'#1a1a1a');col(tx,tz,1.7,1.7,gy+th)}
    // kolumny, bębny, posąg
    for(const [cx,cz,hc] of [[-3,-1,4.5],[3,-1,2.2],[-3,2,1.2],[3,2,3.4]]){B(cx,gy,cz,1,0.4,1,STN[3]);for(let y=0.4,k=0;y<hc;y+=0.6,k++)B(cx,gy+y,cz,0.7,0.58,0.7,STN[k%3]);if(hc>4)B(cx,gy+hc,cz,1.1,0.35,1.1,STN[2]);col(cx,cz,0.45,0.45,gy+hc)}
    for(let k=0;k<3;k++)B(4.6+k*0.65,gy+0.05,-3.4+k*0.3,0.6,0.7,0.7,STN[k%3]);
    B(0,gy,-3,1.6,0.6,1.2,STN[3]);B(-0.9,gy+0.05,-1.6,2.2,0.6,0.7,STN[2]);B(-1.7,gy+0.3,-1.6,0.55,0.55,0.55,STN[0]);B(0.1,gy+0.1,-1.65,0.3,0.4,0.9,STN[1]);
    if(!desert)for(let i=0;i<10;i++){const x=-W2/2+r()*W2,side=r()<0.5?-1:1;B(x,gy+0.5+r()*2,side*(D2/2+0.48),0.16,1.4+r()*1.8,0.06,MOSS[i%3]);B(x,gy+1+r()*2,side*(D2/2+0.5),0.4,0.3,0.06,'#7a9a4a')}
    rubble(-5,3,8,STN);rubble(5.5,4,6,STN);rubble(W2/2+1,0,7,STN);
    for(const [x,z,hw,hd] of [[0,-D2/2,W2/2,0.5],[-W2/2,0,0.5,D2/2],[W2/2,0,0.5,D2/2],[-4,D2/2,3,0.5],[4,D2/2,3,0.5]])col(x,z,hw,hd,gy+2.5);
    chest=[0,-2.2]}
  else if(T==='oboz'){const gy=G(0,0);
    // palisada z bramą
    const R0=11;for(let i=0;i<44;i++){const a=i/44*Math.PI*2;if(Math.abs(Math.sin(a)-1)<0.06)continue;const x=Math.cos(a)*R0,z=Math.sin(a)*R0,g=G(x,z),hh=3+((i*7)%3)*0.35;B(x,g-0.6,z,0.55,hh+0.6,0.55,WD[i%3]);B(x,g+hh,z,0.3,0.4,0.3,'#9a7a5a');if(i%2)B(x,g+hh*0.65,z,0.6,0.16,0.6,WDD)}
    for(let i=0;i<22;i++){const a=(i+0.5)/22*Math.PI*2;if(Math.abs(Math.sin(a)-1)<0.12)continue;col(Math.cos(a)*R0,Math.sin(a)*R0,1.2,1.2,G(Math.cos(a)*R0,Math.sin(a)*R0)+3)}
    for(const sx of [-1.6,1.6]){B(sx,G(sx,R0)-0.5,R0,0.7,5.4,0.7,WD[0]);B(sx,G(sx,R0)+4.6,R0+0.4,0.08,1.2,0.6,'#8a2a22~')}B(0,G(0,R0)+4.4,R0,4,0.5,0.6,WD[1]);B(0,G(0,R0)+4.9,R0+0.3,0.8,0.7,0.6,BN);
    // namioty: płótno, maszty, liny, kołki
    const tent=(x,z,w,d,h,c,rot)=>{const g=G(x,z);const n=7,dh=h/n;for(let i=0;i<n;i++){const k=1-i/n;if(rot)B(x,g+i*dh,z,w*k+0.2,dh+0.02,d,i%2?c[0]:c[1]);else B(x,g+i*dh,z,d,dh+0.02,w*k+0.2,i%2?c[0]:c[1])}
      if(rot){B(x,g+h,z,0.15,0.15,d+0.6,WDD);for(const s2 of [-1,1]){B(x,g,z+s2*(d/2+0.25),0.15,h+0.2,0.15,WDD);B(x+w*0.7,g,z+s2*(d/2+0.6),0.1,0.3,0.1,WDD)}B(x,g,z+d/2+0.02,w*0.3,h*0.6,0.06,'#2a2018')}
      else{B(x,g+h,z,d+0.6,0.15,0.15,WDD);for(const s2 of [-1,1]){B(x+s2*(d/2+0.25),g,z,0.15,h+0.2,0.15,WDD)}B(x+d/2+0.02,g,z,0.06,h*0.6,w*0.3,'#2a2018')}col(x,z,rot?w/2:d/2,rot?d/2:w/2,g+h*0.7)};
    tent(-6,-3,4,4.5,2.8,CV,1);tent(5.5,-4,3.6,4,2.6,['#8a3a2a','#9a4a32'],1);tent(-3,-7,3.4,3.8,2.4,['#6b5a3a','#7a6a48'],0);tent(4,4,3.2,3.6,2.3,CV,0);
    // ognisko z rożnem
    {for(let k=0;k<8;k++){const a=k/8*6.28;B(Math.cos(a)*1.1,gy,Math.sin(a)*1.1,0.5,0.35,0.5,'#6a6670')}B(0,gy,0,1.2,0.3,1.2,'#3a2a1c');B(0,gy+0.2,0,0.8,0.5,0.8,FIRE);B(0,gy+0.4,0,0.4,0.5,0.4,'!#ffd34d');for(const s2 of [-1,1])B(s2*1.2,gy,0,0.12,1.6,0.12,WDD);B(0,gy+1.5,0,2.6,0.1,0.1,WDD);B(0,gy+1.2,0,0.9,0.4,0.4,'#8a4a2a');
      for(const [x,z,ro] of [[-2.4,0.4,0],[2.4,-0.6,0],[0.3,2.4,1]])B(x,G(x,z),z,ro?1.8:0.5,0.45,ro?0.5:1.8,WD[1])}
    // wieżyczka obserwacyjna
    {const tx=-7,tz=5,g=G(tx,tz);for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])B(tx+a,g,tz+b,0.3,5,0.3,WD[0]);for(const y of [1.6,3.2])for(const s2 of [-1,1]){B(tx,g+y,tz+s2,2.2,0.15,0.15,WDD);B(tx+s2,g+y,tz,0.15,0.15,2.2,WDD)}B(tx,g+5,tz,2.8,0.2,2.8,WD[1]);for(const s2 of [-1,1]){B(tx,g+5.2,tz+s2*1.35,2.8,0.7,0.12,WD[2]);B(tx+s2*1.35,g+5.2,tz,0.12,0.7,2.8,WD[2])}gable(tx,tz,2.6,2.6,g+6.6,1,CV,'x',WD[1]);for(const [a,b] of [[-1.2,-1.2],[1.2,1.2],[-1.2,1.2],[1.2,-1.2]])B(tx+a,g+5.2,tz+b,0.15,1.4,0.15,WDD);for(let y=0;y<5;y+=0.5)B(tx+1.25,g+y,tz,0.08,0.08,0.7,WDD);col(tx,tz,1.2,1.2,g+5.2)}
    // skrzynie, beczki, stojak z bronią, łup
    crate(6,G(6,1),1,0.9);crate(6.2,G(6,1)+0.9,1.1,0.7);barrel(7,G(7,2.2),2.2);barrel(6.4,G(6.4,3),3);
    {const x=-2,z=6,g=G(x,z);B(x,g,z,2.4,0.15,0.4,WDD);B(x,g+1.4,z,2.4,0.15,0.4,WDD);for(const s2 of [-1.1,1.1])B(x+s2,g,z,0.15,1.6,0.4,WDD);for(let k=0;k<4;k++){B(x-0.8+k*0.5,g+0.2,z+0.25,0.07,1.5,0.07,'#8a8a90');B(x-0.8+k*0.5,g+1.7,z+0.25,0.18,0.25,0.05,'#a0a0a8')}}
    for(let i=0;i<5;i++){const x=1+r()*3,z=-1-r()*2;B(x,G(x,z),z,0.35,0.15,0.35,'#d9b23a')}
    chest=[Math.cos(0.5)*6+2.3,Math.sin(0.5)*6]}
  else if(T==='wieza'){const tx=-3,tz=0,gy=G(tx,tz),S=6,H=15;B(tx,gy-3,tz,S+1.2,3.2,S+1.2,SDK);
    cw('x',tx-S/2,tx+S/2,tz+S/2,gy,H,1,STN,{holes:[[tx-0.8,tx+0.8,0,2.6],[tx-0.2,tx+0.2,5,6.4],[tx-0.2,tx+0.2,10,11.4]]});cw('x',tx-S/2,tx+S/2,tz-S/2,gy,H,1,STN,{holes:[[tx-0.2,tx+0.2,6,7.4],[tx-0.2,tx+0.2,11,12.4]]});
    cw('z',tz-S/2+0.5,tz+S/2-0.5,tx-S/2+0.5,gy,H,1,STN,{holes:[[tz-0.2,tz+0.2,8,9.4]]});cw('z',tz-S/2+0.5,tz+S/2-0.5,tx+S/2-0.5,gy,H,1,STN,{holes:[[tz-0.2,tz+0.2,4,5.4],[tz-0.2,tz+0.2,12,13.4]]});
    for(const y of [5,10])B(tx,gy+y,tz,S+0.3,0.3,S+0.3,STN[2]);for(let y=0.5;y<H;y+=2.5)B(tx,gy+y,tz,S-1.2,0.2,S-1.2,WD[0]);
    // drewniane hurdycje na szczycie
    B(tx,gy+H,tz,S+2,0.3,S+2,WD[1]);for(const [a,b] of [[1,1],[1,-1],[-1,1],[-1,-1]])B(tx+a*(S/2+0.6),gy+H-1.4,tz+b*(S/2+0.6),0.2,1.4,0.2,WDD);
    for(let k=-3;k<=3;k++)for(const s2 of [-1,1]){B(tx+k*(S+2)/7,gy+H+0.3,tz+s2*(S/2+0.92),(S+2)/7-0.06,1.3,0.15,WD[(k+3)%3]);B(tx+s2*(S/2+0.92),gy+H+0.3,tz+k*(S+2)/7,0.15,1.3,(S+2)/7-0.06,WD[(k+4)%3])}
    for(const [a,b] of [[1,1],[1,-1],[-1,1],[-1,-1]])B(tx+a*(S/2+0.8),gy+H+0.3,tz+b*(S/2+0.8),0.25,2.3,0.25,WDD);pyr(tx,tz,S+2,gy+H+2.5,4.2,RF);B(tx+0.5,gy+H+7.3,tz,0.9,0.5,0.05,'#7a2a22~');
    // drzwi, schody, pochodnie, przybudówka-szopa
    B(tx,gy,tz+S/2+0.02,1.5,2.5,0.1,WD[1]);for(const y of [0.6,1.8])B(tx,gy+y,tz+S/2+0.1,1.55,0.1,0.06,IR);for(let k=0;k<3;k++)B(tx,gy-0.6+k*0.2,tz+S/2+0.8+(2-k)*0.45,2,0.25,0.5,STN[k]);torch(tx-1.3,gy+1.8,tz+S/2+0.3);torch(tx+1.3,gy+1.8,tz+S/2+0.3);
    {const ax=tx+S/2+2,g=G(ax,tz);B(ax,g,tz,3.2,2.6,4,WD[2]);for(let z=-1.6;z<=1.6;z+=0.8)B(ax+1.62,g,tz+z,0.08,2.6,0.7,WD[(z*5|0)&1]);for(let i=0;i<5;i++)B(ax+0.2-i*0.3,g+2.6+i*0.25,tz,3.4-i*0.6,0.25,4.4,RF[i%2]);B(ax+1.2,g+0.2,tz-2.6,0.8,0.9,0.4,WD[0]);col(ax,tz,1.6,2,g+2.6)}
    for(let i=0;i<4;i++){const x=1+r()*4,z=(r()-0.5)*7;crate(x,G(x,z),z,0.8)}rubble(tx-4,3,5,STN);
    col(tx,tz,S/2,S/2,gy+H+1.6);chest=[tx,tz+S/2+1.2]}
  else if(T==='kurhan'){const gy=G(0,0);
    // kopiec warstwowy z darnią
    for(let i=0;i<9;i++){const k=1-i/9,w=13*k+1,d=10*k+1;B(0,gy-1+i*0.6,-4.5,w,0.62,d,i>5?'#5f7a3a':i%2?'#5a6a4a':'#647a50');if(i<7)B(0,gy-1+i*0.6+0.55,-4.5,w+0.1,0.08,d+0.1,'#4f6a32')}
    for(let i=0;i<12;i++){const x=(r()-0.5)*10,z=-4.5+(r()-0.5)*7;B(x,gy+2.2+r()*2,z,0.5,0.4,0.5,'#7a8a50')}
    // korytarz z ciosów i nadproża
    for(let k=0;k<4;k++){const z=0.3-k*1.2;for(const sx of [-1.25,1.25])blockFaces(sx,z,0.8,1.2,gy-0.5,3.2,STN);B(0,gy+2.7,z,3.4,0.6,1.3,STN[k%3])}B(0,gy,-1.6,1.7,2.6,3.2,'#0e0a08');B(0,gy+3.3,0.4,4,0.5,0.8,STN[2]);
    for(let k=-1;k<=1;k++)B(k*0.6,gy+3.8,0.7,0.12,0.5,0.06,GLOWP);
    // krąg kamieni z runami
    for(let i=0;i<10;i++){const a=i/10*6.28+0.3,x=Math.cos(a)*10,z=Math.sin(a)*8-2.5,g=G(x,z),hh=2.6+((i*37)%4)*0.6;B(x,g-0.5,z,1.1,hh+0.5,0.8,STN[i%4]);B(x,g+hh,z,0.9,0.3,0.6,STN[3]);if(!desert)B(x,g+hh+0.3,z,0.7,0.12,0.5,MOSS[i%3]);B(x,g+hh*0.5,z+0.41,0.1,0.8,0.04,GLOWP);B(x,g+hh*0.5+0.2,z+0.41,0.4,0.1,0.04,GLOWP);col(x,z,0.55,0.4,g+hh)}
    for(let i=0;i<10;i+=3){const a=(i+0.5)/10*6.28+0.3,x=Math.cos(a)*10,z=Math.sin(a)*8-2.5;B(x,G(x,z)+3.6,z,2.4,0.5,0.9,STN[1])}
    // ołtarz ofiarny, czaszki, świece, martwe drzewa
    B(0,gy,1.8,2.4,0.8,1.3,STN[0]);B(0,gy+0.8,1.8,2.6,0.15,1.5,STN[2]);B(0,gy+0.95,1.8,0.5,0.4,0.5,BN);B(-0.12,gy+1.1,2.06,0.12,0.1,0.02,'#141414');B(0.12,gy+1.1,2.06,0.12,0.1,0.02,'#141414');for(const s2 of [-1,1]){B(s2*0.9,gy+0.95,1.8,0.12,0.35,0.12,'#f0e8d0');B(s2*0.9,gy+1.3,1.8,0.08,0.12,0.08,'!#ffd38a')}
    for(let i=0;i<6;i++){const x=-3+r()*6,z=2.5+r()*2;B(x,G(x,z),z,0.4,0.35,0.4,BN)}deadTree(-7,4,4.5);deadTree(7.5,3,3.8);deadTree(6,-11,4);
    col(0,-4.5,6,4.5,gy+2.6);col(0,1.8,1.2,0.7,gy+0.95);chest=[0,-1.6]}
  else if(T==='krag'){const gy=G(0,0);
    for(let i=0;i<12;i++){const a=i/12*6.28,x=Math.cos(a)*8,z=Math.sin(a)*8,g=G(x,z),hh=4.2+((i*13)%3)*0.5;blockFaces(x,z,1.2,0.9,g-0.6,hh+0.6,STN);B(x,g+hh*0.4,z+0.47,0.12,1.4,0.03,'!#8ad8ff');B(x-0.2,g+hh*0.4+0.5,z+0.47,0.5,0.12,0.03,'!#8ad8ff');col(x,z,0.6,0.45,g+hh);if(i%2===0){const a2=(i+1)/12*6.28;B(Math.cos(a+0.26)*8,g+hh,Math.sin(a+0.26)*8,3.6,0.7,1,STN[2])}}
    for(let i=0;i<5;i++){const a=i/5*6.28,x=Math.cos(a)*3.4,z=Math.sin(a)*3.4,g=G(x,z);blockFaces(x,z,0.8,0.7,g-0.4,2.4,STN)}
    B(0,gy-0.2,0,3,0.6,3,STN[2]);B(0,gy+0.4,0,2.2,0.6,2.2,STN[0]);B(0,gy+1,0,0.6,1.6,0.6,'!#8ad8ff');B(0,gy+2.7,0,0.3,0.4,0.3,'!#ffffff');for(let k=0;k<16;k++){const a=k/16*6.28;B(Math.cos(a)*5.5,G(Math.cos(a)*5.5,Math.sin(a)*5.5)+0.02,Math.sin(a)*5.5,0.8,0.06,0.3,'!#5aa8d8')}
    for(let i=0;i<14;i++){const a=r()*6.28,rr=9+r()*3,x=Math.cos(a)*rr,z=Math.sin(a)*rr;B(x,G(x,z),z,0.15,0.4,0.15,'#4a8a3a');B(x,G(x,z)+0.4,z,0.3,0.25,0.3,i%2?'#c8a8f0':'#fff4e0')}
    col(0,0,1.5,1.5,gy+1);chest=[0,2.6]}
  else if(T==='gniazdo'){const gy=G(0,0);const WEB='#e8e6e0',SAC='#d8d0b8';
    for(let i=0;i<7;i++){const a=i/7*6.28,x=Math.cos(a)*7,z=Math.sin(a)*7;deadTree(x,z,4+r()*2)}
    for(let i=0;i<9;i++){const a=i/9*6.28,x=Math.cos(a)*5,z=Math.sin(a)*5,g=G(x,z);B(x,g,z,1.6+r(),0.9+r()*1.2,1.4+r(),'#5a5048')}
    // pajęczyny: promieniste sieci (szprychy + spirala) rozpięte między drzewami i na ziemi
    const LN=(x0,y0,z0,x1,y1,z1,c)=>{const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),dz=Math.abs(z1-z0),L=Math.hypot(dx,dy,dz),n=Math.max(1,Math.ceil(L/0.3)),m=Math.max(dx,dy,dz)/n;for(let k=0;k<n;k++){const t=(k+0.5)/n;B(x0+(x1-x0)*t,y0+(y1-y0)*t,z0+(z1-z0)*t,dx/n>=m*0.99?m*0.95+0.03:0.05,dy/n>=m*0.99?m*0.95+0.03:0.05,dz/n>=m*0.99?m*0.95+0.03:0.05,c)}};
    for(let i=0;i<7;i+=2){const a0=i/7*6.28,a1=(i+1)/7*6.28,x0=Math.cos(a0)*7,z0=Math.sin(a0)*7,x1=Math.cos(a1)*7,z1=Math.sin(a1)*7,mx=(x0+x1)/2,mz=(z0+z1)/2,g=G(mx,mz),cy=g+2.6,ux=(x1-x0)/Math.hypot(x1-x0,z1-z0),uz=(z1-z0)/Math.hypot(x1-x0,z1-z0),R=Math.min(2.6,Math.hypot(x1-x0,z1-z0)/2*0.92);
      const pt=(a,rr)=>[mx+ux*Math.cos(a)*rr,cy+Math.sin(a)*rr*0.9,mz+uz*Math.cos(a)*rr];
      for(let k=0;k<8;k++){const q=pt(k/8*6.283,R);LN(mx,cy,mz,q[0],q[1],q[2],WEB+'~')}
      for(const f of [0.4,0.8]){for(let k=0;k<8;k++){const p0=pt(k/8*6.283,R*f),p1=pt((k+1)/8*6.283,R*f);LN(p0[0],p0[1],p0[2],p1[0],p1[1],p1[2],WEB+'~')}}
      LN(x0,g+3.6,z0,pt(Math.PI*0.75,R)[0],pt(Math.PI*0.75,R)[1],pt(Math.PI*0.75,R)[2],WEB+'~');LN(x1,g+3.6,z1,pt(Math.PI*0.25,R)[0],pt(Math.PI*0.25,R)[1],pt(Math.PI*0.25,R)[2],WEB+'~')}
    {const R=4.2;for(let k=0;k<12;k++){const a=k/12*6.283;LN(0,gy+0.05,0,Math.cos(a)*R,gy+0.05,Math.sin(a)*R,WEB)}for(const f of [0.25,0.45,0.65,0.85])for(let k=0;k<12;k++){const a0=k/12*6.283,a1=(k+1)/12*6.283;LN(Math.cos(a0)*R*f,gy+0.06,Math.sin(a0)*R*f,Math.cos(a1)*R*f,gy+0.06,Math.sin(a1)*R*f,WEB)}
     // lejek-tunel do kryjówki
     for(let k=0;k<8;k++){const a=k/8*6.283;LN(Math.cos(a)*1.4,gy+0.1,Math.sin(a)*1.4,Math.cos(a)*0.5,gy+1.6,Math.sin(a)*0.5,WEB+'~')}B(0,gy+0.1,0,0.9,0.2,0.9,'#1a1612')}
    // kokony zwisające z gałęzi i skupiska jaj
    for(let i=0;i<7;i++){const a=i/7*6.28+0.3,x=Math.cos(a)*6.3,z=Math.sin(a)*6.3,g=G(x,z),y=g+2.4+r()*1.2;B(x,y+0.9,z,0.04,1.2,0.04,WEB);B(x,y,z,0.5,1.0,0.5,SAC);B(x,y+0.45,z,0.4,0.2,0.4,'#c8bea0');B(x,y-0.45,z,0.36,0.2,0.36,'#c8bea0');if(i%2)B(x+0.18,y+0.1,z+0.18,0.12,0.25,0.06,'#5a4a3a')}
    for(const [x,z] of [[2.6,-1.8],[-2.2,2.4],[-3,-2.6]]){const g=G(x,z);for(let k=0;k<6;k++)B(x+(k%3-1)*0.32,g+0.18+(k>2?0.28:0),z+(k>2?0.1:-0.1),0.3,0.3,0.3,k%2?'#efe8d0':'#e0d8bc');B(x,g+0.03,z,1.4,0.05,1.1,WEB)}
    for(let i=0;i<10;i++){const x=(r()-0.5)*7,z=(r()-0.5)*7,g=G(x,z);B(x,g,z,0.6,0.7,0.6,SAC);B(x,g+0.7,z,0.4,0.2,0.4,'#c8bea0')}
    for(let i=0;i<3;i++){const x=(r()-0.5)*6,z=(r()-0.5)*6,g=G(x,z);B(x,g+0.2,z,0.6,1.8,0.6,WEB);B(x,g+0.5,z,0.66,0.12,0.66,'#c8c0a8');B(x,g+1.4,z,0.66,0.12,0.66,'#c8c0a8')}
    for(let i=0;i<8;i++){const x=(r()-0.5)*9,z=(r()-0.5)*9;B(x,G(x,z),z,0.5,0.12,0.15,BN)}chest=[0,-1]}
  else if(T==='kopalnia'){const gy=G(0,-3);
    // skalne wzgórze z wejściem w drewnianej obudowie
    for(let i=0;i<16;i++){const a=Math.PI+i/15*Math.PI,x=Math.cos(a)*6,z=Math.sin(a)*4-4,g=G(x,z),hh=3+r()*3;rock(x,z,g-1,3+r()*2,hh+1,3+r()*1.5,STN)}rock(0,-6,gy-1,10,9,6,STN);if(!desert){B(0,gy+8,-6.5,6,0.3,3.6,MOSS[0]);B(-2,gy+5,-3.6,3,0.25,1,MOSS[1])}
    B(0,gy,-3.1,2.6,3,0.6,'#0e0a08');for(const s2 of [-1.45,1.45]){B(s2,gy,-2.8,0.4,3.2,0.4,WD[0]);B(s2,gy,-2,0.3,3.2,0.3,WD[1])}B(0,gy+3.2,-2.8,3.6,0.4,0.5,WD[2]);B(0,gy+3.2,-2,3.4,0.35,0.4,WD[0]);B(0,gy+3.6,-2.4,1.6,0.6,0.08,WD[1]);B(0.75,gy+2.2,-2.6,0.3,0.3,0.3,'!#ffcc66');B(0.75,gy+2.5,-2.6,0.12,0.4,0.12,IR);
    // tory, wózek, urobek, szopa
    for(let z=-2.6;z<6;z+=0.7)B(0,G(0,z),z,1.6,0.12,0.25,WD[1]);for(const s2 of [-0.55,0.55])B(s2,G(0,1.5)+0.12,1.5,0.1,0.1,8.6,IR);
    {const z=2.5,g=G(0,z)+0.2;B(0,g+0.3,z,1.2,0.8,1.6,'#5a5a60');B(0,g+0.3,z,1.3,0.1,1.7,IR);for(const s2 of [-0.55,0.55])for(const z2 of [-0.5,0.5])B(s2,g,z+z2,0.12,0.36,0.36,IR);B(0,g+1.1,z,1,0.35,1.3,'#7a6a5a');B(0.2,g+1.4,z,0.3,0.2,0.3,'#d9b23a')}
    for(let i=0;i<4;i++){const x=3+r()*2,z=1+r()*3,g=G(x,z);B(x,g,z,1.4,0.6+r()*0.6,1.2,i%2?'#6a6670':'#7a7480');B(x+0.2,g+0.8,z,0.3,0.3,0.3,i%2?'#d9b23a':'#a8d8f0')}
    {const hx=-5,hz=2,g=G(hx,hz);B(hx,g-0.5,hz,4,3.2,3.4,WD[0]);for(let x=-1.8;x<=1.8;x+=0.6)B(hx+x,g,hz+1.72,0.55,2.7,0.08,WD[(x*5|0)&1]);B(hx,g,hz+1.76,1,2,0.08,WD[1]);gable(hx,hz,4,3.4,g+2.7,1.6,RF,'x',WD[2]);B(hx+1.2,g+1.4,hz+1.78,0.8,0.6,0.06,'!#ffcc66');col(hx,hz,2,1.7,g+2.7)}
    crate(4,G(4,-1),-1,0.8);barrel(3.2,G(3.2,-1.6),-1.6);for(let k=0;k<3;k++)B(-2.6,G(-2.6,0)+k*0.25,0.2+k*0.1,1.6,0.25,0.3,WD[k%3]);B(2.4,G(2.4,-2),-2,0.08,1.2,0.08,WDD);B(2.4,G(2.4,-2)+1.1,-2,0.6,0.15,0.1,'#8a8a90');
    col(0,-6,5,3,gy+6);chest=[2,0.5]}
  else if(T==='oltarz'){const gy=G(0,0),OB=['#2a2633','#33303d','#24212b'],RD='#8a1a2a';
    for(let k=0;k<3;k++){const w=9-k*2.4;B(0,gy-0.8+k*0.5,0,w,0.5+(k===0?0.8:0),w,OB[k%3]);for(let x=-w/2+0.4;x<w/2;x+=0.9)B(x,gy-0.3+k*0.5+0.48,w/2-0.2,0.85,0.04,0.3,OB[(k+1)%3])}
    B(0,gy+0.7,0,2.6,1.1,1.4,OB[1]);B(0,gy+1.8,0,2.9,0.2,1.7,OB[0]);B(0,gy+2,0,1.8,0.04,0.8,'!#c82a3a');B(0,gy+2,0,0.6,0.5,0.6,BN);
    for(const [x,z] of [[-3.4,-3.4],[3.4,-3.4],[-3.4,3.4],[3.4,3.4]]){const g=G(x,z);for(let y=0,k=0;y<5;y+=0.9,k++)B(x,g+y,z,0.9-k*0.05,0.9,0.9-k*0.05,OB[k%3]);B(x,g+5,z,1.2,0.3,1.2,IR);B(x,g+5.3,z,0.8,0.5,0.8,'!#c84a3a');B(x,g+5.6,z,0.4,0.5,0.4,'!#ffaa55');col(x,z,0.45,0.45,g+5)}
    for(const sx of [-2,2]){const g=G(sx,-4.4);B(sx,g,-4.4,0.15,5,0.15,WDD);B(sx,g+4.8,-4.4,1.6,0.1,0.1,WDD);B(sx,g+2.6,-4.36,1.3,2.2,0.05,RD+'~');B(sx,g+3.4,-4.33,0.6,0.6,0.05,'#141414')}
    for(let k=0;k<24;k++){const a=k/24*6.28;B(Math.cos(a)*6.4,G(Math.cos(a)*6.4,Math.sin(a)*6.4)+0.02,Math.sin(a)*6.4,1.8,0.05,0.25,'!#a82a3a')}for(let k=0;k<5;k++){const a=k/5*6.28,b=(k+2)/5*6.28;const x0=Math.cos(a)*6.2,z0=Math.sin(a)*6.2,x1=Math.cos(b)*6.2,z1=Math.sin(b)*6.2;for(let t=0;t<1;t+=0.1)B(x0+(x1-x0)*t,gy+0.06,z0+(z1-z0)*t,0.5,0.04,0.5,'!#a82a3a')}
    for(let i=0;i<8;i++){const x=(r()-0.5)*12,z=(r()-0.5)*12;if(Math.abs(x)<5&&Math.abs(z)<5)continue;B(x,G(x,z),z,0.15,0.4,0.15,'#f0e8d0');B(x,G(x,z)+0.4,z,0.1,0.12,0.1,'!#ffd38a')}
    deadTree(-8,6,5);deadTree(8,-6,4.6);col(0,0,1.4,0.8,gy+1.8);col(0,0,4.5,4.5,gy+0.5);chest=[0,-2.2]}
  else if(T==='wiatrak'){const tx=0,tz=-2,gy=G(tx,tz);B(tx,gy-3,tz,6,3.2,6,SDK);
    // kamienna podstawa + drewniana wieża z łamanymi skrzydłami
    blockFaces(tx,tz,5.4,5.4,gy,3.4,STN,{hz:[[tx-0.7,tx+0.7,0,2.4]]});B(tx,gy,tz+2.75,1.4,2.4,0.1,'#0e0a08');
    for(let y=3.4,k=0;y<10;y+=0.6,k++){const w=5-k*0.25;B(tx,gy+y,tz,w,0.62,w,WD[k%3]);B(tx,gy+y,tz,w+0.06,0.06,w+0.06,WDD)}
    gable(tx,tz,3.2,3.6,gy+10,2.2,['#5a5048','#4a4038'],'x',WD[1]);B(tx,gy+8,tz+2.1,0.6,0.6,0.8,WDD);
    const arm=(ang,len,broken)=>{const L2=broken?len*0.5:len;for(let t=0.6;t<L2;t+=0.5){const x=tx+Math.cos(ang)*t,y=gy+8.3+Math.sin(ang)*t;B(x,y,tz+2.6,0.3,0.3,0.15,WD[0]);if(t>1.5){const nx=-Math.sin(ang)*0.7,ny=Math.cos(ang)*0.7;B(x+nx,y+ny,tz+2.7,0.5,0.5,0.06,broken?'#8a7a60':'#c8b89a~')}}};
    arm(0.4,5.4,0);arm(0.4+Math.PI/2,5.4,1);arm(0.4+Math.PI,5.4,0);arm(0.4+3*Math.PI/2,5.4,1);
    for(let i=0;i<5;i++){const x=3+r()*3,z=(r()-0.5)*5;B(x,G(x,z),z,0.9,0.5,0.6,'#d8c08a')}{const x=-4,z=3,g=G(x,z);B(x,g,z,2.2,0.12,1.2,WD[1]);B(x,g+0.12,z,0.9,0.7,0.9,'#c8b89a');B(x+0.8,g+0.12,z,0.8,0.6,0.8,'#d0c098')}
    for(let i=0;i<10;i++){const a=i/10*6.28,x=Math.cos(a)*8,z=Math.sin(a)*8-1,g=G(x,z);if(i%3===2)continue;B(x,g,z,0.15,1.1,0.15,WD[0]);B(x+Math.sin(a)*1.1,g+0.8,z-Math.cos(a)*1.1,Math.abs(Math.sin(a))*2+0.1,0.1,Math.abs(Math.cos(a))*2+0.1,WD[1])}
    col(tx,tz,2.7,2.7,gy+10);chest=[2.6,2.4]}
  else if(T==='loch'){const gy=G(0,0),K=['#7d7884','#6f6a73','#8a8590','#64606a'];B(0,gy-3,0,8,3,8,SDK);
    blockFaces(0,0,6,6,gy,4.4,K,{hz:[[-1.1,1.1,0,3]]});B(0,gy,3.02,2.2,3,0.1,'#100c0a');for(let k=-3;k<=3;k++)B(k*0.32,gy+0.1,3.15,0.06,2.6,0.06,IR);B(0,gy+1.6,3.15,2.2,0.08,0.08,IR);
    for(const sx of [-1.7,1.7]){B(sx,gy,3.4,0.7,0.4,0.7,K[3]);for(let y=0.4,k=0;y<3.6;y+=0.55,k++)B(sx,gy+y,3.4,0.5,0.53,0.5,K[k%3]);B(sx,gy+3.6,3.4,0.8,0.3,0.8,K[2])}
    for(let i=0;i<5;i++){const w=4.2-i*0.9;B(0,gy+3.9+i*0.35,3.5,w,0.36,0.8,K[i%3])}B(0,gy+4.4,0,6.6,0.4,6.6,K[2]);pyr(0,0,6,gy+4.8,2.4,['#5d5a63','#6f6a73']);B(0,gy+7.4,0,0.4,1,0.4,K[0]);B(0,gy+8.1,0,1.2,0.3,0.3,K[0]);
    for(let k=0;k<3;k++)B(0,gy-0.45+k*0.15,3.6+(2-k)*0.5,2.6,0.2,0.55,K[k]);torch(-2.6,gy+1.6,3.2);torch(2.6,gy+1.6,3.2);for(const x of [-2.6,2.6]){B(x,gy,4,0.8,0.6,0.8,K[1]);B(x,gy+0.6,4,0.5,0.4,0.5,BN)}
    for(let i=0;i<5;i++){const a=r()*6.28,x=Math.cos(a)*6,z=Math.sin(a)*6;B(x,G(x,z),z,0.9,1.4+r(),0.3,K[i%4]);B(x,G(x,z)+1,z,0.6,0.12,0.32,K[2])}
    s.cols=[[s.x,s.z,3,3,gy+4.4]];chest=null}
  else if(T==='jaskinia'){const gy=G(0,0),R=['#6c6a67','#7d7b78','#5f5d5a','#888580'];
    for(let i=0;i<20;i++){const a=i/20*Math.PI*2,rx=4.8,rz=3.8,x=Math.cos(a)*rx,z=Math.sin(a)*rz;if(Math.sin(a)>0.75)continue;const hh=3+((i*37)%5)*0.7;rock(x,z,gy-1.5,2.6+((i*7)%3)*0.5,hh+2,2.6,R)}
    rock(0,-0.5,gy-1,7,7.4,5.5,R);if(!desert){B(0,gy+6.6,-1,4.6,0.2,3.6,MOSS[0]);for(let i=0;i<6;i++)B(-2+i*0.8,gy+3.6-((i*3)%3)*0.4,2.32,0.12,1.4,0.06,MOSS[i%3])}
    B(0,gy,2.2,2.4,2.8,0.4,'#120c0a');for(const s2 of [-1.3,1.3])B(s2,gy,2.4,0.32,3,0.32,WD[0]);B(0,gy+3,2.4,3,0.35,0.4,WD[1]);B(-1.3,gy+2.2,2.62,0.25,0.25,0.25,'!#ffcc66');
    for(let i=0;i<4;i++){const x=-2+i*1.3,z=3.4+(i%2)*0.6;B(x,G(x,z),z,0.9,0.5+(i%2)*0.4,0.8,R[i%4])}for(let k=0;k<3;k++)B(-0.8+k*0.8,gy+2.6,2.3,0.25,0.5-k%2*0.2,0.25,R[2]);
    s.cols=[[s.x,s.z-0.5,3.5,2.8,gy+5]];chest=null}
  else if(T==='zamczysko'){const gy=s.h,A=30,Hw=12,TH=3,K=['#6f6a73','#64606a','#7a7580','#5d5a63'],K2='#4f4c55',SL=['#4a4f5a','#3e4350'],q={bl:1.6,rh:0.8};
    const curtain=(ax,a0,a1,o,out)=>{const mid=(a0+a1)/2,len=a1-a0;if(ax==='x')B(mid,gy-4,o,len,4+Hw,TH,K2);else B(o,gy-4,mid,TH,4+Hw,len,K2);
      cw(ax,a0,a1,o,gy,Hw,TH,K,{...q,nocore:1,one:out});cw(ax,a0,a1,o,gy,Hw,TH,K,{...q,nocore:1,one:-out});
      const put=(a,y,oo,la,h,t,c)=>ax==='x'?B(a,y,o+oo*out,la,h,t,c):B(o+oo*out,y,a,t,h,la,c);
      put(mid,gy-0.2,TH/2+0.6,len,1.2,1.2,K2);put(mid,gy+Hw,0,len,0.15,TH-0.6,'#5a4a3a');
      put(mid,gy+Hw,TH/2-0.3,len,1.1,0.6,K[2]);const nb=Math.floor(len/1.8);for(let i=0;i<nb;i+=2)put(a0+(i+0.5)*len/nb,gy+Hw+1.1,TH/2-0.3,len/nb*0.96,1.1,0.6,K[i%4]);
      put(mid,gy+Hw,-TH/2+0.25,len,0.9,0.5,K[1]);for(let a=a0+2;a<a1-1;a+=3){put(a,gy+Hw-0.9,TH/2+0.3,0.6,0.9,0.6,K[3]);put(a+1.5,gy+Hw-0.5,TH/2+0.05,0.12,0.6,0.04,'#1a1a1a')}
      for(let a=a0+5;a<a1-3;a+=9){put(a,gy,TH/2+0.9,1.6,6,1.8,K[0]);put(a,gy+6,TH/2+0.6,1.3,1.2,1.2,K[2])}
      for(let a=a0+7;a<a1-5;a+=14){put(a,gy+Hw-4.8,TH/2+0.08,1.6,3.6,0.06,'#1a1a1a~');put(a,gy+Hw-3.6,TH/2+0.12,0.7,0.7,0.06,'#a8352a')}
      cols.push(ax==='x'?[s.x+mid,s.z+o,len/2,TH/2,gy+Hw]:[s.x+o,s.z+mid,TH/2,len/2,gy+Hw])};
    curtain('x',-A,A,-A,-1);curtain('z',-A,A,-A,-1);curtain('z',-A,A,A,1);curtain('x',-A,-4,A,1);curtain('x',4,A,A,1);
    const tower=(x,z,S,h,roof)=>{B(x,gy-4,z,S+1,4.4,S+1,K2);blockFaces(x,z,S,S,gy,h,K,{...q,core:K2});for(const y of [h*0.33,h*0.66])B(x,gy+y,z,S+0.35,0.4,S+0.35,K[2]);
      for(const [ax,az] of [[1,0],[-1,0],[0,1],[0,-1]])for(const y of [h*0.25,h*0.5,h*0.75]){const hot=y>h*0.6;B(x+ax*(S/2+0.04),gy+y,z+az*(S/2+0.04),ax?0.06:0.35,1.4,az?0.06:0.35,hot?'!#ffb04a':'#1a1a1a')}
      const ck=S+1.4;B(x,gy+h,z,ck,0.8,ck,K[2]);const n=Math.max(3,Math.round(S/1.6));for(let i=0;i<n;i++){const o=-S/2+(i+0.5)*S/n;for(const sg of [-1,1]){B(x+o,gy+h-0.7,z+sg*(S/2+0.35),0.5,0.7,0.6,K[3]);B(x+sg*(S/2+0.35),gy+h-0.7,z+o,0.6,0.7,0.5,K[3])}}
      const m2=n*2-1,stp=ck/m2;for(let i=0;i<m2;i+=2){const o=-ck/2+(i+0.5)*stp;for(const sg of [-1,1]){B(x+o,gy+h+0.8,z+sg*(ck/2-0.3),stp*0.96,1.2,0.6,K[i%4]);B(x+sg*(ck/2-0.3),gy+h+0.8,z+o,0.6,1.2,stp*0.96,K[(i+1)%4])}}
      if(roof)pyr(x,z,S,gy+h+0.8,S*1.15,SL);B(x+0.6,gy+h+0.8+S*1.15+0.6,z,1.2,0.7,0.06,'#1a1a1a~');B(x+0.6,gy+h+0.8+S*1.15+0.7,z,0.4,0.35,0.07,'#a8352a');cols.push([s.x+x,s.z+z,S/2,S/2,gy+h])};
    for(const [x,z] of [[A,A],[-A,A],[A,-A],[-A,-A]])tower(x,z,9,20,1);for(const [x,z] of [[A,0],[-A,0],[0,-A]])tower(x,z,6,16,1);for(const x of [-6.5,6.5])tower(x,A,5,17,1);
    // brama: łuk, krata, most nad fosą
    B(0,gy+7,A,8,Hw-7+1.2,TH,K2);cw('x',-4,4,A,gy+7,Hw-7,TH,K,{...q,nocore:1,one:1});for(let k=-4;k<=4;k++)B(k*0.85,gy+6.4+(4-Math.abs(k))*0.16,A+TH/2,0.8,0.7,0.6,K[(k+4)%4]);
    for(let i=-4;i<=4;i++)B(i*0.85,gy+3.5,A+TH/2+0.3,0.12,3.6,0.12,'#2a2a30');for(const y of [4,5.5,6.6])B(0,gy+y,A+TH/2+0.3,7.4,0.14,0.14,'#2a2a30');
    for(const sg of [-1,1]){B(sg*3.6,gy,A+TH/2+1,0.3,4.8,0.3,'#4a2f1d');B(sg*3.8,gy+4.6,A+TH/2+0.7,0.12,3,0.12,'#2a2a30')}for(let z=A+2;z<A+9;z+=0.6)B(0,gy-0.25,z,7,0.25,0.55,(z*3|0)%2?WD[0]:WD[1]);
    for(const sg of [-1,1])for(let k=0;k<2;k++)B(sg*2.6,gy+8.5+k*1.6,A+TH/2+0.1,1.2,1.4,0.06,'#a8352a~');
    // donżon z przyporami i narożnymi wieżyczkami
    {const dx=0,dz=-16,W3=18,D3=14,H3=22;B(dx,gy-4,dz,W3+1,4.6,D3+1,K2);blockFaces(dx,dz,W3,D3,gy,H3,K,{...q,core:K2,hz:[[-1.5,1.5,0,4]]});for(const y of [7,14,20])B(dx,gy+y,dz,W3+0.4,0.45,D3+0.4,K[2]);
      for(const xx of [-6,-2,2,6])for(const y of [9,15.5])B(xx,gy+y,dz+D3/2+0.05,0.7,1.8,0.06,y>12?'!#ffb04a':'#141414');for(const zz of [-4,0,4])for(const sg of [-1,1])B(dx+sg*(W3/2+0.05),gy+12,dz+zz,0.06,1.8,0.7,'#141414');
      B(0,gy,dz+D3/2+0.06,3,4,0.12,'#3a2414');for(const y of [1,2.6])B(0,gy+y,dz+D3/2+0.14,3.05,0.12,0.06,IR);for(let k=0;k<5;k++)B(0,gy-0.4+k*0.08,dz+D3/2+1+k*0.0,4.4-k*0.4,0.2,2.2-k*0.35,K[k%3]);
      for(const xx of [-W3/2+2,W3/2-2])for(const sg of [-1,1])B(xx,gy,dz+sg*(D3/2+0.7),1.6,7,1.4,K[0]);
      B(dx,gy+H3,dz,W3+1,0.7,D3+1,K[2]);for(let i=0;i<10;i+=2){const o=-W3/2+(i+0.5)*W3/10;for(const sg of [-1,1])B(dx+o,gy+H3+0.7,dz+sg*(D3/2+0.2),W3/10*0.96,1.2,0.6,K[i%4])}
      {const st=8;for(let i=0;i<st;i++){const w=(W3-2)*(1-i/st)+0.4,d=(D3-2)*(1-i/st)+0.4;B(dx,gy+H3+0.7+i*0.9,dz,w,0.92,d,SL[i%2])}}
      for(const [x,z] of [[W3/2,D3/2],[-W3/2,D3/2],[W3/2,-D3/2],[-W3/2,-D3/2]])tower(dx+x,dz+z,4,H3+5,1);cols.push([s.x+dx,s.z+dz,W3/2,D3/2,gy+H3])}
    // koszary i kaplica przy murach
    {const bx=-A+5.5,bz=6,g=gy;B(bx,g,bz,7,4.5,14,K[1]);cw('z',bz-7,bz+7,bx+3.5,g,4.5,0.05,K,{...q,nocore:1,one:1,holes:[[bz-1,bz+1,0,2.8],[bz-5,bz-4,2,3.4],[bz+4,bz+5,2,3.4]]});B(bx+3.52,g,bz,0.1,2.8,2,'#3a2414');gable(bx,bz,14,7,g+4.5,3.2,SL,'z',WD[1]);B(bx+3.56,g+2.4,bz-4.5,0.06,1.4,1,'!#ffb04a');cols.push([s.x+bx,s.z+bz,3.5,7,g+4.5])}
    {const cx=A-6,cz=6,g=gy;B(cx,g,cz,7,6,10,K[2]);cw('z',cz-5,cz+5,cx-3.5,g,6,0.05,K,{...q,nocore:1,one:-1,holes:[[cz-0.9,cz+0.9,0,3],[cz-3.4,cz-2.6,2.6,4.8],[cz+2.6,cz+3.4,2.6,4.8]]});for(const zz of [-3,3])B(cx-3.55,g+2.6,cz+zz,0.06,2.2,0.8,'!#b08aff');B(cx-3.52,g,cz,0.1,3,1.8,'#3a2414');gable(cx,cz,10,7,g+6,3.4,SL,'z',K[1]);B(cx,g+9.4,cz-3,0.2,2,0.2,'#c9a24a');B(cx,g+10.4,cz-3,0.9,0.2,0.2,'#c9a24a');cols.push([s.x+cx,s.z+cz,3.5,5,g+6])}
    // dziedziniec: bruk, studnia, koksowniki, manekiny, kości
    for(let x=-A+3;x<A-2;x+=3)for(let z=-7;z<A-2;z+=3)if(Math.abs(x)>A-10&&z>-2&&z<14){}else B(x,gy-0.06,z,2.9,0.08,2.9,((x+z)/3&1)?'#6a6670':'#76727c');
    B(0,gy,6,3,1,3,K[0]);B(0,gy+0.95,6,2.4,0.1,2.4,'#2a4a6a');for(const sg of [-1,1])B(sg*1.2,gy+1,6,0.25,2.4,0.25,WD[0]);B(0,gy+3.3,6,2.8,0.25,0.25,WD[1]);gable(0,6,3,2.6,gy+3.4,1,SL,'x',null);cols.push([s.x,s.z+6,1.5,1.5,gy+1]);
    for(const [x,z] of [[-8,0],[8,0],[-8,16],[8,16],[-4,24],[4,24]]){B(x,gy,z,0.9,1.1,0.9,'#2a2a30');B(x,gy+1.1,z,0.7,0.35,0.7,'!#ff6a1a');B(x,gy+1.4,z,0.35,0.35,0.35,'!#ffd34d')}
    for(const x of [12,15,18]){B(x,gy,18,0.2,1.6,0.2,WD[0]);B(x,gy+1.2,18,1,0.2,0.2,WD[0]);B(x,gy+1.4,18,0.5,0.6,0.4,'#c8b89a')}
    for(let i=0;i<10;i++)B(-12+r()*24,gy+0.02,10+r()*10,0.6,0.12,0.18,BN);
    chest=[0,-6.5]}
  else if(T==='wrak'){const gy=G(0,0),WD2=['#4a3a2a','#3e3022','#56432f'],AL=['#2f5a3a','#3a6a42','#285030'];
    for(let i=0;i<14;i++){const z=-5+i*0.8,t=(z)/5.6,w=2.6*Math.sqrt(Math.max(0.05,1-t*t)),g=G(0,z)-0.4;B(0,g,z,w*0.5,0.3,0.82,WD2[i%3]);for(const sg of [-1,1]){const br=sg>0&&i>4&&i<10;if(br)continue;for(let k=0;k<3;k++)B(sg*(w/2-0.1),g+0.3+k*0.45,z,0.18,0.42,0.78,WD2[(i+k)%3])}}
    for(let k=0;k<6;k++){const z=-3.5+k*1.4,g=G(0,z)-0.3;for(const sg of [-1,1])B(sg*1.15,g+0.7,z,0.16,1.6,0.16,'#2e2418')}
    {const g=G(1.5,1)-0.2;for(let k=0;k<9;k++)B(1.2+k*0.55,g+0.25,1.2+k*0.3,0.3,0.3,0.4,'#3a2a1a');B(5.4,g+0.3,3.4,2.4,0.06,1.6,'#9a8a6a')}
    for(let i=0;i<8;i++){const x=(r()-0.5)*8,z=(r()-0.5)*10,g=G(x,z);if(i%2)B(x,g,z,0.6,0.8,0.6,'#5a4030');else{B(x,g,z,0.7,0.5,0.7,'#4a3a2a');B(x,g+0.5,z,0.72,0.06,0.72,'#2a2a2a')}}
    for(let i=0;i<18;i++){const x=(r()-0.5)*9,z=(r()-0.5)*12,g=G(x,z),hh=0.8+r()*2.2;B(x,g,z,0.12,hh,0.06,AL[i%3]);B(x+0.08,g+hh*0.5,z,0.1,hh*0.5,0.05,AL[(i+1)%3])}
    for(let i=0;i<10;i++){const x=(r()-0.5)*7,z=(r()-0.5)*9;B(x,G(x,z),z,0.3,0.12,0.3,['#d8b24a','#e0c06a','#c8a040'][i%3])}
    cols.push([s.x,s.z,1.3,5,gy+0.6]);chest=[0,0.5]}
  else if(T==='legowisko'){const gy=G(0,0),BO=['#e8e0c8','#d8ceb0','#c8bc98'],RK=['#6c6a67','#7d7b78','#5f5d5a','#888580'],SC='#2a221c';
    for(let i=0;i<40;i++){const a=r()*6.28,rr=r()*15,x=Math.cos(a)*rr,z=Math.sin(a)*rr;B(x,G(x,z)+0.01,z,1.6+r()*2,0.05,1.4+r()*2,i%3?SC:'#3a2e24')}
    for(let i=0;i<9;i++){const a=i/9*6.28+0.2,x=Math.cos(a)*17,z=Math.sin(a)*17;if(Math.abs(a-Math.PI/2)<0.45)continue;const h=3+r()*4;rock(x,z,G(x,z)-1,3+r()*2,h+1,3+r()*2,RK);cols.push([s.x+x,s.z+z,1.6,1.6,G(x,z)+h])}
    // ogromny szkielet: kręgosłup i żebra łukami
    for(let k=0;k<9;k++){const z=-8+k*1.6,g=G(0,z);B(0,g+0.1,z,0.9,0.7,1.2,BO[k%3]);if(k>1&&k<8){const span=3.2+Math.sin(k/9*Math.PI)*2.2;for(const sg of [-1,1])for(let t=0;t<7;t++){const an=t/6*Math.PI*0.62,x=sg*Math.sin(an)*span,y=Math.cos(an)*-0+Math.sin(an*1.6)*span*0.9;B(x,g+0.1+y,z,0.45,0.45,0.4,BO[(t+k)%3])}}}
    {const z=8,g=G(0,z);B(0,g,z,3.2,2.2,3,BO[0]);B(0,g+2.2,z-0.3,2.8,0.8,2.4,BO[1]);for(const sg of [-1,1]){B(sg*0.8,g+1.2,z+1.52,0.8,0.7,0.06,'#141414');B(sg*1.9,g+2.4,z+0.4,0.7,0.6,0.7,BO[2]);B(sg*2.5,g+3.2,z+0.2,0.5,1.4,0.5,BO[0]);B(sg*2.6,g+4.4,z,0.35,0.9,0.35,BO[1])}B(0,g+0.3,z+1.6,2.2,0.5,0.6,BO[2]);for(let t=-3;t<=3;t++)B(t*0.3,g+0.6,z+1.85,0.15,0.4,0.12,'#f4efe4');cols.push([s.x,s.z+z,1.6,1.5,g+2.6])}
    for(let i=0;i<14;i++){const x=(r()-0.5)*20,z=(r()-0.5)*20;if(Math.hypot(x,z)<4)continue;const g=G(x,z);B(x,g,z,0.25,0.18,1.3+r(),BO[i%3]);if(i%3==0)B(x+0.5,g,z,0.6,0.5,0.6,BO[0])}
    for(let i=0;i<16;i++){const x=-2+r()*4,z=-2+r()*3;B(x,G(x,z)+(i%3)*0.15,z,0.5+r()*0.4,0.25,0.5,i%4?'#e0b84a':'#c8a030')}
    for(const [x,z] of [[-6,-6],[6,-6],[-6,5],[6,5]]){const g=G(x,z);B(x,g,z,0.2,2.6,0.2,'#3a2414');B(x,g+2.4,z,0.7,0.6,0.7,BO[0]);B(x,g+2.2,z,0.5,0.3,0.5,FIRE)}
    chest=[0,-2.5]}
  else if(T==='grota'){const gy=G(0,0),R=['#6c6a67','#7d7b78','#5a5856','#4e4c4a'],GO='#e0b84a';
    for(let i=0;i<26;i++){const a=i/26*Math.PI*2,rr=7+r()*3.5,x=Math.cos(a)*rr,z=Math.sin(a)*rr;if(Math.sin(a)>0.8&&Math.abs(Math.cos(a))<0.5)continue;const h=4+r()*6*(1-Math.max(0,Math.sin(a))*0.4);rock(x,z,gy-2,3+r()*2,h+2,3+r()*2,R)}
    rock(0,-1.5,gy-1,12,12,9,R);rock(-3,-2,gy+8,5,5,5,R);rock(3,-1,gy+7,4,4,4,R);
    B(0,gy,5.4,4.4,4.4,0.5,'#120c0a');for(let k=-3;k<=3;k++)B(k*0.75,gy+4.2+(3-Math.abs(k))*0.25,5.6,0.8,0.9,1,R[(k+3)%4]);for(let k=-2;k<=2;k++)B(k*0.9,gy+3.6-((k*7)%3)*0.2,5.75,0.25,0.6,0.25,R[1]);
    for(let i=0;i<14;i++){const x=(r()-0.5)*10,z=5.5+r()*6;B(x,G(x,z)+0.02,z,1.6+r(),0.06,1.4+r(),'#2a221c')}
    for(let i=0;i<8;i++){const x=-3+r()*6,z=6+r()*4;B(x,G(x,z),z,0.8,0.14,0.2,BN);if(i%3==0)B(x+0.4,G(x,z),z,0.3,0.25,0.3,BN)}
    {const x=4,z=7,g=G(x,z);B(x,g,z,1.6,0.9,2.2,'#d8d0b8');B(x,g+0.3,z+1.3,1.2,0.5,0.8,'#d8d0b8');B(x-0.5,g+0.6,z+0.6,0.3,0.25,0.06,'#141414');B(x+0.5,g+0.6,z+0.6,0.3,0.25,0.06,'#141414');for(const s2 of [-1,1])B(x+s2*0.6,g+0.9,z-0.8,0.25,0.9,0.25,'#d8d0b8')}
    for(let i=0;i<12;i++){const x=-2.5+r()*5,z=4.4+r()*1.6;B(x,G(x,z)+(i%3)*0.15,z,0.6+r()*0.4,0.25,0.5,i%4?GO:'#c8a030')}B(-1,gy,4.6,0.9,0.7,0.6,'#7a4b22');B(-1,gy+0.7,4.6,0.95,0.1,0.65,GO);
    for(let i=0;i<5;i++){const x=-5+r()*10,z=8+r()*4;B(x,G(x,z),z,0.4,1+r()*1.4,0.4,R[i%4])}
    cols.push([s.x,s.z-1.5,6,4.5,gy+9]);chest=[1.5,4.5]}
  else if(STRUCT2[T]){chest=STRUCT2[T](s,r,{B,G,col,STN,SDK,MOSS,WD,WDD,RF,IR,BN,blockFaces,rock,deadTree,crate,barrel,gable})}
  else if(T==='wyspy'){return skyDetail(s,L,cols)}
  else return null;
  return{L,cols,chest}}

// faktura dla budowli (lista w metrach, środek+wymiar): kamień / drewno / kość rozpoznane po kolorze
function structTex(L,seed,mul){mul=mul||1;const K=8,G=[],cls={stone:new Set(),wood:new Set(),bone:new Set()},c=new THREE.Color(),hs={};
  for(const b of L){const col=b[6];if(typeof col!=='string'||col.length!==7||col[0]!=='#')continue;if(Math.min(b[3],b[4],b[5])<0.12)continue;
    c.set(col);c.getHSL(hs);const k=hs.s<0.26&&hs.l>0.09&&hs.l<0.88&&!(hs.h>0.03&&hs.h<0.13&&hs.s>0.2)?'stone':(hs.h>0.03&&hs.h<0.13&&hs.s>0.22&&hs.l<0.42&&hs.l>0.1)?'wood':(hs.h>0.07&&hs.h<0.17&&hs.l>0.72&&hs.s<0.5)?'bone':null;
    if(!k)continue;cls[k].add(col);G.push([(b[0]-b[3]/2)*K,(b[1]-b[4]/2)*K,(b[2]-b[5]/2)*K,b[3]*K,b[4]*K,b[5]*K,col])}
  const n0=G.length;let i=0;for(const k in cls)if(cls[k].size)surfTex(G,[...cls[k]],k,(seed||5)+(i++)*17,Math.round((k==='stone'?520:300)*mul));
  for(let j=n0;j<G.length;j++){const b=G[j];L.push([(b[0]+b[3]/2)/K,(b[1]+b[4]/2)/K,(b[2]+b[5]/2)/K,b[3]/K,b[4]/K,b[5]/K,b[6]])}return L}
function buildStruct(s){
  const r=rngOf('st'+s.id),g=new THREE.Group(),L=[],cols=[];g.position.set(0.0071,0,0.0093);/* poza siatką świata: ściany budowli nie leżą w płaszczyznach ścian terenu */
  if(s.friendly&&!STRUCT2[s.type]){s.g=g;s.cols=[];scene.add(g);return}
  let SD=null;try{SD=structDetail(s,r)}catch(e){console.warn('struktura',s.type,e)}
  if(SD){try{structTex(SD.L,strHash(s.id)%997)}catch(e){console.warn(e)}const m0=new THREE.Mesh(boxes(SD.L),matB);m0.position.set(s.x,0.012,s.z);/* +1,2 cm: płyty podłoża budowli nie leżą w płaszczyźnie terenu */m0.castShadow=true;m0.receiveShadow=true;g.add(m0);cols.push(...SD.cols);s._ch=SD.chest;if(!SD.chest){if(!(s.cols&&s.cols.length))s.cols=cols;s.g=g;scene.add(g);voxQueue(g,'S'+s.id);return}}
  if(!SD&&(s.type==='loch'||s.type==='jaskinia')){const gr=hsAt(s,s.x,s.z),EL=[];
    if(s.type==='loch'){const S1='#7d7884',S2='#6f6a73';EL.push([0,gr+1.6,0,6,4.2,6,S1],[0,gr+3.9,0,6.6,0.5,6.6,S2],[0,gr+4.4,0,5,0.5,5,S1],[0,gr+4.9,0,3,0.5,3,S2],[0,gr+5.6,0,0.5,1.2,0.5,S1],[0,gr+5.9,0,1.4,0.4,0.4,S1],[0,gr-1,0,7,2,7,S2]);
      EL.push([0,gr+1.3,3.02,2.2,2.8,0.1,'#100c0a'],[-1.4,gr+1.6,3.05,0.5,3.2,0.3,S2],[1.4,gr+1.6,3.05,0.5,3.2,0.3,S2],[0,gr+3.2,3.05,3.3,0.5,0.3,S2]);for(const x of [-2.4,2.4])EL.push([x,gr+0.6,3.6,0.9,1.2,0.9,S2],[x,gr+1.6,3.6,0.4,0.8,0.4,'#e8e2cc']);s.cols=[[s.x,s.z,3,3,gr+5]]}
    else{const R1='#6c6a67',R2='#7d7b78';for(let i=0;i<14;i++){const a=i/14*Math.PI*2;if(Math.sin(a)>0.8)continue;const x=Math.cos(a)*4.5,z=Math.sin(a)*3.5,h=3+((i*37)%5)*0.7;EL.push([x,gr+h/2-1,z,2.8,h+2,2.8,i%2?R1:R2])}EL.push([0,gr+3,0,7,5,6,R1],[0,gr+5.6,-0.5,5,2,4,R2],[0,gr+1.3,3.1,2.6,2.8,0.4,'#0c0a08'],[0,gr+3.1,3.2,3.4,0.8,0.8,R2]);s.cols=[[s.x,s.z-0.5,3.5,3,gr+5]]}
    try{structTex(EL,7)}catch(e){}const mm=new THREE.Mesh(boxes(EL),matB);mm.position.set(s.x,0.012,s.z);mm.castShadow=true;mm.receiveShadow=true;g.add(mm);s.g=g;scene.add(g);voxQueue(g,'S'+s.id);return}
  if(!SD&&(s.type==='zamczysko'||s.type==='grota')){const geo=s.type==='zamczysko'?castleGeo(s):grotaGeo(s,r),mm=new THREE.Mesh(geo,matB);mm.position.set(s.x,s.h+0.012,s.z);mm.scale.setScalar(BS);mm.castShadow=true;mm.receiveShadow=true;g.add(mm);
    const H=s.h;if(s.type==='zamczysko'){const A=21;cols.push([s.x,s.z-A,22.5,1.5,H+12],[s.x+A,s.z,1.5,22.5,H+12],[s.x-A,s.z,1.5,22.5,H+12],[s.x-12.25,s.z+A,8.75,1.5,H+12],[s.x+12.25,s.z+A,8.75,1.5,H+12],[s.x,s.z-12,8,7,H+20]);for(const [x,z] of [[A,A],[-A,A],[A,-A],[-A,-A]])cols.push([s.x+x,s.z+z,4,4,H+18]);for(const x of [-6,6])cols.push([s.x+x,s.z+A,2.5,2.5,H+15])}
    else cols.push([s.x,s.z-1,5,4,H+9]);
    const cx=0,cz=s.type==='zamczysko'?-3.5:4.5,cy=H;const chest=new THREE.Group(),base=new THREE.Mesh(boxes([[0,0.35,0,1.2,0.7,0.8,'#7a4b22'],[0,0.35,0.41,1.22,0.12,0.02,'#d9b23a'],[0,0.55,0.41,0.18,0.22,0.03,'#ffd34d']]),decoMat);
    const lid=new THREE.Group();lid.position.set(0,0.7,-0.4);lid.add(new THREE.Mesh(boxes([[0,0.12,0.4,1.24,0.26,0.84,'#8f5a2a'],[0,0.12,0.82,1.26,0.08,0.02,'#d9b23a']]),decoMat));chest.add(base,lid);chest.position.set(s.x+cx,cy,s.z+cz);g.add(chest);if(W.opened[s.id])lid.rotation.x=-1.9;
    s.chest={x:s.x+cx,z:s.z+cz,y:cy,lid};s.cols=cols;s.g=g;scene.add(g);voxQueue(g,'S'+s.id);return}
  const box=(x,z,w,hgt,d,col,base,solid=true)=>{const gr=base!=null?base:hsAt(s,s.x+x,s.z+z);L.push([x,gr-1+(hgt+1)/2,z,w,hgt+1,d,col]);if(solid)cols.push([s.x+x,s.z+z,w/2,d/2,gr+hgt])};
  const STONE='#8b8b8e',MOSS='#5f7a3a',DSTONE='#6c6a67';
  if(SD){}else if(s.type==='ruiny'){
    const st=s.b===4?'#d9c79a':STONE;
    for(let i=0;i<9;i++){const a=i/9*6.28+r()*0.4,rr=4+r()*4.5,x=Math.cos(a)*rr,z=Math.sin(a)*rr,len=2+Math.floor(r()*4),hgt=1+Math.floor(r()*3.5),ax=r()<0.5;
      box(x,z,ax?len:1,hgt,ax?1:len,st);if(r()<0.5&&s.b!==4)L.push([x,hsAt(s,s.x+x,s.z+z)+hgt+0.05,z,ax?len:1,0.12,ax?1:len,MOSS])}
    for(let i=0;i<3;i++){const a=r()*6.28,x=Math.cos(a)*3,z=Math.sin(a)*3;box(x,z,1.1,4+Math.floor(r()*3),1.1,st)}
    for(let i=0;i<6;i++){const x=(r()-0.5)*8,z=(r()-0.5)*8;L.push([x,hsAt(s,s.x+x,s.z+z)+0.05,z,1.6,0.12,1.6,DSTONE])}
    {const ax=r()*6.28,x=Math.cos(ax)*2,z=Math.sin(ax)*2,g0=hsAt(s,s.x+x,s.z+z);box(x-1.6,z,0.9,5,0.9,st);box(x+1.6,z,0.9,5,0.9,st);L.push([x,g0+4.6,z,4.1,0.9,1,st],[x,g0+4.05,z,2.3,0.25,0.9,st],[x-1.6,g0+5.15,z,1.1,0.2,1.1,DSTONE],[x+1.6,g0+5.15,z,1.1,0.2,1.1,DSTONE]);if(s.b!==4)L.push([x-1.6,g0+2.5,z+0.47,0.3,3.5,0.06,MOSS],[x+0.4,g0+4.1,z+0.52,1.2,0.6,0.06,MOSS])}
    for(let i=0;i<4;i++){const x=(r()-0.5)*9,z=(r()-0.5)*9,g0=hsAt(s,s.x+x,s.z+z);L.push([x,g0+0.25,z,1.2,0.5,0.7,st],[x+0.3,g0+0.62,z,0.6,0.3,0.6,DSTONE])}
  } else if(s.type==='oboz'){
    const cl=['#8a3a2a','#6b5a3a','#7a6a55','#5a4a3a'];
    for(let i=0;i<4;i++){const a=i/4*6.28+0.5,x=Math.cos(a)*6,z=Math.sin(a)*6,gr=hsAt(s,s.x+x,s.z+z),c=cl[i];
      for(let k=0;k<4;k++){const sz=3.4-k*0.8;L.push([x,gr+0.4+k*0.6,z,sz,0.6,sz,c])}L.push([x,gr+2.9,z,0.15,0.8,0.15,'#5a3b22']);cols.push([s.x+x,s.z+z,1.7,1.7,gr+2.6])}
    const gr=hsAt(s,s.x,s.z);L.push([0,gr+0.15,0,1.4,0.3,1.4,'#4a4a4a'],[0,gr+0.5,0,0.8,0.5,0.8,'#ff8a2e'],[0,gr+0.85,0,0.4,0.4,0.4,'#ffd34d']);cols.push([s.x,s.z,0.7,0.7,gr+0.5]);
    L.push([2.2,gr+0.25,0,2.4,0.5,0.5,'#6b4a2b'],[-2.2,gr+0.25,0.5,0.5,0.5,2.4,'#6b4a2b']);
    for(let i=0;i<22;i++){const a=i/22*6.28;if(i%11===0)continue;const x=Math.cos(a)*10,z=Math.sin(a)*10,g0=hsAt(s,s.x+x,s.z+z),h=2.2+(i%3)*0.3;L.push([x,g0+h/2-0.2,z,0.5,h,0.5,'#6b4a2b'],[x,g0+h,z,0.3,0.4,0.3,'#8a6a44']);cols.push([s.x+x,s.z+z,0.3,0.3,g0+h])}
    for(const sg of [-1,1]){const x=9.8,z=sg*1.2,g0=hsAt(s,s.x+x,s.z+z);L.push([x,g0+2,z,0.14,4,0.14,'#4a2f1d'],[x+sg*0.45,g0+3.3,z,0.8,1.3,0.04,'#7a2a22'],[x+sg*0.45,g0+3.2,z,0.3,0.3,0.05,'#e8e2cc'])}
    {const x=-3.5,z=-2,g0=hsAt(s,s.x+x,s.z+z);L.push([x,g0+0.9,z,1.6,0.12,0.2,'#5a3b22'],[x-0.7,g0+0.6,z,0.12,1.2,0.12,'#5a3b22'],[x+0.7,g0+0.6,z,0.12,1.2,0.12,'#5a3b22'],[x-0.3,g0+0.8,z+0.1,0.06,1.3,0.06,'#aeb6bd'],[x+0.2,g0+0.8,z+0.1,0.06,1.3,0.06,'#7a5230'],[x+0.2,g0+1.5,z+0.1,0.14,0.2,0.04,'#aeb6bd'])}
  } else if(s.type==='wieza'){
    const gr=Math.min(...[-2,0,2].flatMap(a=>[-2,0,2].map(b=>hsAt(s,s.x-3+a,s.z+b))));
    for(let k=0;k<11;k++)L.push([-3,gr-1+k+0.5,0,5-(k%3===2?0.2:0),1,5-(k%3===2?0.2:0),k%2?STONE:DSTONE]);
    for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])L.push([-3+a*2,gr+10.5,b*2,1,1.2,1,STONE]);
    L.push([-3,gr+1.1,2.52,1.2,2.2,0.08,'#2a2018'],[-3,gr+6,2.52,0.6,1,0.08,'#1a1a1a'],[-0.48,gr+4,0,0.08,1,0.6,'#1a1a1a']);
    cols.push([s.x-3,s.z,2.5,2.5,gr+11]);
    for(let i=0;i<5;i++)L.push([-3+(i-2)*0.95,gr+0.15+i*0.0,2.9+i*0.0,0.9,0.3,0.6,DSTONE]);
    L.push([-3,gr+2.35,2.55,1.6,0.3,0.2,DSTONE],[-3.7,gr+1.1,2.55,0.25,2.4,0.2,DSTONE],[-2.3,gr+1.1,2.55,0.25,2.4,0.2,DSTONE]);
    for(let k=0;k<5;k++){const w=5.2-k*1.05;L.push([-3,gr+11.2+k*0.55,0,w,0.55,w,k%2?'#93391f':'#a8452c'])}L.push([-3,gr+14.2,0,0.12,1.3,0.12,'#4a2f1d'],[-2.6,gr+14.5,0,0.8,0.45,0.04,'#7a2a22']);
    if(s.b!==4)for(let k=0;k<3;k++)L.push([-0.47,gr+1.5+k*2.2,(k-1)*0.9,0.06,1.6,0.6,MOSS]);
    for(let i=0;i<4;i++){const x=1+r()*4,z=(r()-0.5)*7;box(x,z,1,1,1,STONE)}
  } else {
    for(let i=0;i<8;i++){const a=i/8*6.28,x=Math.cos(a)*9,z=Math.sin(a)*9;box(x,z,1,3+Math.floor(r()*2),0.9,DSTONE);L.push([x,hsAt(s,s.x+x,s.z+z)+0.2,z,1.4,0.4,1.3,MOSS])}
    const gr=hsAt(s,s.x,s.z);
    for(let k=0;k<3;k++)L.push([0,gr+k*0.7,-4.5,7-k*2,0.7,4-k*1,k===2?MOSS:'#5a6a4a']);cols.push([s.x,s.z-4.5,3.5,2,gr+1.5]);
    L.push([0,gr+0.5,0,2.2,1,1.2,STONE],[0,gr+1.05,0,2.4,0.1,1.4,'#b874ff']);cols.push([s.x,s.z,1.1,0.6,gr+1]);
    for(let i=0;i<8;i+=2){const a=i/8*6.28,x=Math.cos(a)*9,z=Math.sin(a)*9,g0=hsAt(s,s.x+x,s.z+z);L.push([x,g0+4.4,z,1.3,0.5,1.2,DSTONE],[x,g0+2.2,z+0.46,0.3,0.3,0.02,'#b874ff'])}
    L.push([0,gr+0.6,-2.45,1.4,1.2,0.1,'#2a2420'],[0,gr+1.35,-2.45,1.8,0.3,0.3,STONE],[-0.75,gr+0.6,-2.45,0.3,1.4,0.3,STONE],[0.75,gr+0.6,-2.45,0.3,1.4,0.3,STONE]);
    for(const sg of [-1,1])L.push([sg*1.6,gr+0.3,0.8,0.3,0.6,0.3,'#3a3a3a'],[sg*1.6,gr+0.75,0.8,0.2,0.3,0.2,'#9a7aff']);
  }
  if(L.length){try{structTex(L,strHash(s.id)%997)}catch(e){}const m=new THREE.Mesh(boxes(L),matB);m.position.set(s.x,0.012,s.z);m.castShadow=true;m.receiveShadow=true;g.add(m)}
  // skrzynia
  const cx=s._ch?s._ch[0]:s.type==='wieza'?-3:s.type==='oboz'?Math.cos(0.5)*6+2.3:s.type==='kurhan'?0:0,cz=s._ch?s._ch[1]:s.type==='wieza'?3.6:s.type==='oboz'?Math.sin(0.5)*6:s.type==='kurhan'?-1.6:0;
  const cy=SD&&SD.chestY!=null?SD.chestY:hsAt(s,s.x+cx,s.z+cz);
  const CM=chestModel(s.type==='zamczysko'||s.type==='grota'||s.type==='kurhan'),chest=new THREE.Group(),base=new THREE.Mesh(boxes(CM[0]),decoMat);base.castShadow=true;
  const lid=new THREE.Group();lid.position.set(0,CM[2],-CM[3]/2);lid.add(new THREE.Mesh(boxes(CM[1]),decoMat));
  chest.add(base,lid);chest.position.set(s.x+cx,cy,s.z+cz);g.add(chest);if(W.opened[s.id])lid.rotation.x=-1.9;
  s.chest={x:s.x+cx,z:s.z+cz,y:cy,lid};s.cols=cols;s.g=g;scene.add(g);voxQueue(g,'S'+s.id);
}
function unbuildStruct(s){voxRemove('S'+s.id);scene.remove(s.g);s.g.traverse(o=>{if(o.geometry&&o.geometry!==ringGeo)o.geometry.dispose()});s.g=null;s.chest=null}
function structCollide(p){
  for(const s of structs.values()){if(!s||!s.cols||Math.abs(s.x-p.x)>48||Math.abs(s.z-p.z)>48)continue;
    for(const [cx,cz,hw,hd,top] of s.cols){if(p.y>=top-0.05)continue;const ex=hw+PR-Math.abs(p.x-cx),ez=hd+PR-Math.abs(p.z-cz);
      if(ex>0&&ez>0){if(top-p.y<=1.05&&player.ground){p.y=top;continue}if(ex<ez)p.x+=Math.sign(p.x-cx||1)*ex;else p.z+=Math.sign(p.z-cz||1)*ez}}}
}
function structGround0(x,z,y){let best=null;for(const s of structs.values()){if(!s||!s.cols||Math.abs(s.x-x)>48||Math.abs(s.z-z)>48)continue;for(const [cx,cz,hw,hd,top] of s.cols)if(Math.abs(x-cx)<hw+0.05&&Math.abs(z-cz)<hd+0.05&&top<=y+0.3&&(best===null||top>best))best=top}return best}
// ===== PODNIEBNE WYSPY: lewitujące skały nad światem, spiralne kamienne stopnie, harpie, skarbiec z gwizdkiem płaszczki =====
Object.assign(STRN,{wyspy:'Podniebne wyspy'});Object.assign(STRC,{wyspy:'#8fd8ff'});
function skyBase(x,z){let mn=null;for(const [a,b] of [[-0.45,-0.45],[0.45,-0.45],[-0.45,0.45],[0.45,0.45],[0,0]]){const h=colAt(x+a,z+b);if(h===null)continue;mn=mn===null?h:Math.min(mn,h)}return mn===null?null:Math.round(mn)+46}
function skyIsles(s){const r=rngOf('sky'+s.id),A=[[0,0,11,0]];const a0=r()*6.283;for(let k=0;k<3;k++){const a=a0+k*2.1+r()*0.4,R=4.2+r()*2.2,d=11+R+3.5+r()*2;A.push([Math.cos(a)*d,Math.sin(a)*d,R,Math.round((r()-0.4)*5)])}return A}
function skyDetail(s,L,cols){const Y0=skyBase(s.x,s.z);if(Y0===null)return null;const r=rngOf('skyg'+s.id),P=(...b)=>L.push(b),GR=['#6aa84a','#78b656','#5f9a42'],DT=['#7a5a3a','#6b4e30'],RK=['#8a8690','#77737d','#9a96a0','#6a6670'],plat=[];
  const cold=[5,6,21,24,32].includes(s.b),dry=[4,15,28,31,35].includes(s.b);if(cold){GR[0]='#e8eef4';GR[1]='#dfe8f2';GR[2]='#f4f8fc'}if(dry){GR[0]='#d8c080';GR[1]='#cdb474';GR[2]='#e2cc90'}
  const isle=(cx,cz,R,y)=>{ringBoxes(P,cx,cz,0,R,y-0.9,y,z=>GR[Math.abs(Math.round(z*1.3+cx))%3],1);ringBoxes(P,cx,cz,0,R-0.4,y-2.2,y-0.9,z=>DT[Math.abs(Math.round(z))%2],1);
    const n=Math.max(3,Math.round(R*0.75));for(let k=0;k<n;k++){const f=(k+1)/n,rr=(R-0.6)*Math.pow(1-f,0.75)+0.5,th=1.5+R*0.12;ringBoxes(P,cx+Math.sin(k*1.7)*0.5,cz+Math.cos(k*2.3)*0.5,0,rr,y-2.2-(k+1)*th,y-2.2-k*th,RK[k%4],1)}
    P(cx,y-2.2-n*(1.5+R*0.12)-1,cz,0.9,2.2,0.9,RK[1]);for(let k=0;k<Math.round(R*1.6);k++){const a=r()*6.283,d=(R-0.6)*(0.85+r()*0.15);P(cx+Math.cos(a)*d,y-2.6-r()*2,cz+Math.sin(a)*d,0.9+r(),1.6+r()*2.4,0.9+r(),RK[k%4])}
    for(let k=0;k<Math.round(R*R*0.2);k++){const a=r()*6.283,d=Math.sqrt(r())*(R-1);const x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d;if(r()<0.6)P(x,y+0.2,z,0.12,0.4,0.12,cold?'#c8d8e8':'#4f8a3c');else{P(x,y+0.16,z,0.1,0.32,0.1,'#4f8a3c');P(x,y+0.36,z,0.22,0.12,0.22,['#e8c040','#ffffff','#d96bd0','#8fd8ff'][k%4])}}
    plat.push([s.x+cx,s.z+cz,R*0.72,R*0.72,y],[s.x+cx,s.z+cz,R*0.98,R*0.34,y],[s.x+cx,s.z+cz,R*0.34,R*0.98,y],[s.x+cx,s.z+cz,R*0.9,R*0.52,y],[s.x+cx,s.z+cz,R*0.52,R*0.9,y])};
  const tree=(x,z,y,sc)=>{const lc=cold?'#dfe8f2':dry?'#b8a050':'#4a9a46',l2=cold?'#f4f8fc':dry?'#cdb464':'#5aae54';P(x,y+1.4*sc,z,0.5*sc,2.8*sc,0.5*sc,'#6b4528');P(x,y+3.2*sc,z,2.6*sc,1.4*sc,2.6*sc,lc);P(x,y+4.2*sc,z,1.8*sc,1.0*sc,1.8*sc,l2);P(x,y+4.9*sc,z,0.9*sc,0.6*sc,0.9*sc,lc);};
  const I=skyIsles(s);for(const [x,z,R,dy] of I)isle(x,z,R,Y0+dy);
  // wyspa główna: krąg kolumn dawnej świątyni, ołtarz ze skarbem, staw, drzewa, świecące kryształy
  for(let k=0;k<8;k++){const a=k/8*6.283+0.39,x=Math.cos(a)*6.2,z=Math.sin(a)*6.2,br=k===2||k===5;P(x,Y0+0.2,z,1.3,0.4,1.3,'#b8b4a8');P(x,Y0+(br?1.2:2.4),z,0.9,br?1.6:4.0,0.9,'#d8d4c8');if(!br){P(x,Y0+4.55,z,1.3,0.3,1.3,'#b8b4a8')}else P(x+0.9,Y0+0.3,z+0.6,0.9,0.6,1.6,'#c8c4b8')}
  for(let k=0;k<8;k++){if(k===1||k===2||k===4||k===5)continue;const a=(k+0.5)/8*6.283+0.39;P(Math.cos(a)*6.2,Y0+4.9,Math.sin(a)*6.2,Math.abs(Math.sin(a))*4.6+0.8,0.4,Math.abs(Math.cos(a))*4.6+0.8,'#c8c4b8')}
  P(0,Y0+0.2,-1.5,4.2,0.4,3.4,'#b8b4a8');P(0,Y0+0.5,-1.5,3.4,0.2,2.6,'#d8d4c8');for(const sx of [-1.5,1.5]){P(sx,Y0+1.2,-2.6,0.3,1.4,0.3,'!#8fe8ff');P(sx,Y0+2.0,-2.6,0.2,0.4,0.2,'!#e8ffff')}
  for(const [x,z,q] of [[-7.5,2.5,1.1],[7,3.5,0.9],[3,8,1],[-4,-8,0.85]])tree(x,z,Y0,q);
  ringBoxes(P,5.5,-5,0,2.2,Y0-0.5,Y0+0.04,'#5ab8e0',1);ringBoxes(P,5.5,-5,2.2,2.8,Y0,Y0+0.2,'#b8b4a8',1);
  for(const [x,z,h] of [[-8.6,-3.5,2.2],[8.8,-1.5,1.6],[-2,9.4,1.8],[1.5,-9.6,2.4]]){P(x,Y0+h/2,z,0.5,h,0.5,'!#8fe8ff');P(x+0.4,Y0+h*0.3,z+0.2,0.36,h*0.6,0.36,'!#c8f8ff');P(x-0.3,Y0+h*0.25,z-0.3,0.3,h*0.5,0.3,'!#6ad0f0')}
  // wysepki: drzewo, ruina albo gniazdo harpii; mosty linowe do wyspy głównej
  I.slice(1).forEach(([x,z,R,dy],k)=>{const y=Y0+dy;if(k===0)tree(x,z,y,1.2);else if(k===1){for(let q=0;q<10;q++){const a=q/10*6.283;P(x+Math.cos(a)*1.6,y+0.3,z+Math.sin(a)*1.6,1.1,0.6,0.4,q%2?'#6b4a2b':'#8a6a44')}P(x,y+0.2,z,2.4,0.3,2.4,'#a8905a');for(const [ex,ez] of [[0.3,0.2],[-0.4,-0.2],[0,0.5]])P(x+ex,y+0.55,z+ez,0.4,0.5,0.4,'#e8e0d0')}
    else{P(x,y+1.4,z,1.0,2.8,1.0,'#d8d4c8');P(x,y+3.0,z,1.5,0.4,1.5,'#b8b4a8');P(x+1.4,y+0.4,z,1.2,0.8,0.8,'#c8c4b8');P(x,y+3.6,z,0.4,0.8,0.4,'!#8fe8ff')}
    const d=Math.hypot(x,z),ux=x/d,uz=z/d,a0=10.6,a1=d-R+0.5,n=Math.max(3,Math.round((a1-a0)/0.7));for(let q=0;q<=n;q++){const t=q/n,dd=a0+(a1-a0)*t,py=Y0+dy*t-Math.sin(t*Math.PI)*0.5,ax=Math.abs(ux)>Math.abs(uz);P(ux*dd,py-0.06,uz*dd,ax?0.62:1.9,0.14,ax?1.9:0.62,q%2?'#8a6a44':'#7a5a38');if(q%3===0)for(const sg of [-1,1]){P(ux*dd-uz*sg*0.95,py+0.5,uz*dd+ux*sg*0.95,0.1,1.0,0.1,'#5a3a22')}
      for(const sg of [-1,1])P(ux*dd-uz*sg*0.95,py+1.0,uz*dd+ux*sg*0.95,ax?0.72:0.08,0.06,ax?0.08:0.72,'#c8b890');plat.push([s.x+ux*dd,s.z+uz*dd,1.0,1.0,py])}});
  // spiralne stopnie z ziemi: lewitujące kamienie wokół słupa wiatru
  {const gy=skyBase(s.x+13,s.z)-46,n=Math.ceil((Y0-0.4-gy)/0.8),R0=13.2;const aEnd=Math.atan2(I[1][1],I[1][0])+1.2;
    for(let k=0;k<n;k++){const t=k/(n-1),ang=aEnd-(n-1-k)*0.152,rr=k>n-7?R0-(k-(n-7))*0.75:R0,x=Math.cos(ang)*rr,z=Math.sin(ang)*rr,y=gy+0.5+k*0.8;P(x,y-0.25,z,2.1,0.5,2.1,RK[k%4]);plat.push([s.x+x,s.z+z,1.12,1.12,y]);P(x,y-0.75,z,1.3,0.5,1.3,RK[(k+1)%4]);P(x,y-1.2,z,0.6,0.5,0.6,RK[(k+2)%4]);if(k%6===3)P(x,y+0.02,z,2.1,0.05,2.1,cold?'#e8eef4':'#6aa84a');if(k%8===0){P(x+0.8,y+0.3,z+0.8,0.2,0.6,0.2,'!#8fe8ff')}}
    for(let k=0;k<16;k++){const y=gy+1+k*Math.max(2,Y0-gy-30)/16;P(Math.sin(k*1.9)*0.9,y,Math.cos(k*2.6)*0.9,0.5,0.8,0.5,'!#c8f4ff')}
    for(let k=0;k<10;k++){const a2=k/10*6.283;P(Math.cos(a2)*2.2,gy+0.3,Math.sin(a2)*2.2,0.9,0.6,0.9,RK[k%4])}P(0,gy+0.15,0,3.2,0.3,3.2,'#b8b4a8');P(0,gy+0.34,0,1.6,0.1,1.6,'!#8fe8ff')}
  s.plat=plat;s.skyY=Y0;return{L,cols,chest:[0,-1.5],chestY:Y0+0.6}}
function skySpawn(def){const Y0=skyBase(def.x,def.z);if(Y0===null)return;sfx('screech');const I=skyIsles({id:def.id});
  for(let i=0;i<5;i++){const a=i/5*6.283+0.5,rr=i===0?2.5:5+i%2*2.5,x=def.x+Math.cos(a)*rr,z=def.z+Math.sin(a)*rr;makeE('harpia',def.lvl+(i===0?2:0),i===0,x,Y0+0.05,z,{sid:def.id,home:[def.x,def.z],sky:1})}
  let n=0;for(const e of enemies.values())if(e.t==='plaszczka'&&Math.hypot(e.p.x-def.x,e.p.z-def.z)<60)n++;
  if(n<2)for(const q of I.slice(1,3)){makeE('plaszczka',Math.max(1,def.lvl),false,def.x+q[0],Y0+q[3]+0.05,def.z+q[1],{home:[def.x+q[0],def.z+q[1]],sky:1})}
  strState.set(def.id,{cleared:0})}
function structGround(x,z,y){let best=structGround0(x,z,y);for(const s of structs.values()){if(!s||!s.plat||Math.abs(s.x-x)>48||Math.abs(s.z-z)>48)continue;for(const [cx,cz,hw,hd,top] of s.plat)if(Math.abs(x-cx)<hw+0.05&&Math.abs(z-cz)<hd+0.05&&top<=y+1.0&&(best===null||top>best))best=top}return best}
let nearChest=null;
function strFrame(dt){
  nearChest=null;
  // kolizja gracza ze wszystkimi stworzeniami (olbrzymy twardo, mniejsze rozsuwają się po połowie), jeźdźcy z koniem szerzej
  for(const e of enemies.values()){const d=EDEF[e.t];if(e.st===2||d.swim&&!player.swim)continue;const big=d.huge||d.giant,rr=big?eSc(e)*0.45:e.hm?0.75+PR:Math.max(0.22,eSc(e)*0.26)+PR,dx=player.p.x-e.p.x,dz=player.p.z-e.p.z,dd=Math.hypot(dx,dz);
    if(dd<rr&&dd>1e-3&&player.p.y<e.p.y+Math.max(1.4,eSc(e)*(big?1.5:1.1))&&player.p.y>e.p.y-1.6){const o=rr-dd,k=big||e.hm||!isAuth()?1:0.5;player.p.x+=dx/dd*o*k;player.p.z+=dz/dd*o*k;if(k<1){const ox=e.p.x-dx/dd*o*0.5,oz=e.p.z-dz/dd*o*0.5,h=colAt(ox,oz,e.p.y);if(h!==null&&Math.abs(h-e.p.y)<1.05){e.p.x=ox;e.p.z=oz}}}}
  for(const s of structs.values()){if(!s||!s.chest)continue;const c=s.chest;
    if(W.opened[s.id]){c.lid.rotation.x+=(-1.9-c.lid.rotation.x)*Math.min(1,6*dt);if(!chestLeft(s.id))continue}
    if(Math.hypot(c.x-player.p.x,c.z-player.p.z)<2.2&&Math.abs(c.y-player.p.y)<2.5)nearChest=s}
  if(nearChest&&!nearNpc&&!dlg){const pr=$('prompt');pr.hidden=false;pr.innerHTML=guardsAlive(nearChest)?'Skrzynia zamknięta: najpierw pokonaj strażników':(W.opened[nearChest.id]?'<kbd>F</kbd> Przeszukaj skrzynię':'<kbd>F</kbd> Otwórz skrzynię')}
  // pasek bossa
  let bb=null,bd=55;for(const e of enemies.values()){if(!EDEF[e.t].boss||e.st===2)continue;const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d<bd){bd=d;bb=e}}
  const el=$('bossbar');if(bb){el.hidden=false;{const hp=bb.hp/bb.max,ph=hp<0.3?3:hp<0.6?2:1;$('bossname').textContent=EDEF[bb.t].n+' · poziom '+bb.lvl+(ph>1?' · faza '+ph:'');$('bossbar').classList.toggle('rage',ph>1)}$('bossfill').style.width=(bb.hp/bb.max*100)+'%'}else el.hidden=true;
}
function chestModel(big){const k=big?1.25:1,W=0.95*k,H=0.55*k,D=0.62*k,WD='#7a4b22',WD2='#8f5a2a',WD3='#6a3e1a',IR='#3a3a40',GD='#d9b23a',B=[],Lb=[];
  for(let i=0;i<4;i++)B.push([0,0.07+i*H/4,0,W,H/4-0.01,D,i%2?WD:WD3]);for(const x of [-W/2+0.05,W/2-0.05])for(const z of [-D/2+0.05,D/2-0.05])B.push([x,H/2,z,0.1,H+0.02,0.1,IR]);
  for(const x of [-W*0.3,W*0.3])B.push([x,H/2,0,0.08,H+0.03,D+0.03,IR]);B.push([0,0.03,0,W+0.04,0.06,D+0.04,IR]);for(const x of [-W*0.3,W*0.3])for(const y of [H*0.25,H*0.75])B.push([x,y,D/2+0.03,0.05,0.05,0.02,'#8a8f94']);
  B.push([0,H*0.72,D/2+0.035,0.16,0.2,0.05,GD],[0,H*0.68,D/2+0.065,0.05,0.07,0.02,'#141414']);
  Lb.push([0,0.05,D/2,W+0.02,0.1,D+0.02,WD],[0,0.15,D/2,W,0.1,D-0.08,WD2],[0,0.23,D/2,W-0.02,0.06,D-0.26,WD]);for(const x of [-W*0.3,W*0.3])Lb.push([x,0.12,D/2,0.09,0.26,D+0.05,IR]);for(const x of [-W/2+0.04,W/2-0.04])Lb.push([x,0.1,D/2,0.07,0.2,D+0.04,IR]);Lb.push([0,0.0,D+0.02,0.16,0.14,0.04,GD]);
  return[B,Lb,H,D]}
function openChest(s,remote){
  if(!remote&&guardsAlive(s))return toast('Najpierw pokonaj strażników','#ff8a7a');
  sfx('open');W.opened[s.id]=W.opened[s.id]||Date.now();if(s.type==='wyspy'&&!MNT.plaszczka){MNT.plaszczka=1;LS.set('mounts',MNT);setTimeout(()=>toast('Znaleziono Gwizdek Płaszczki! Klawisz V przywołuje podniebną płaszczkę — latającego wierzchowca.','#8fe8ff'),900)}if(!remote)sendFx({k:'wopen',id:s.id,at:W.opened[s.id],nm:S.name});else toast(remote+' otworzył(a) skrzynię – twój łup:','#ffd34d');const big=s.type==='zamczysko'||s.type==='grota',k=s.type==='kurhan'||big,lv=s.lvl+(k?2:0);
  const n=big?4:k?2:s.type==='ruiny'?1:1+(Math.random()<0.5?1:0);
  if(remote){INV.gold+=Math.round(lv*rnd(3,6)*(k?3:1));INV.pot+=1;for(let i=0;i<n;i++){const it=genItem(lv,k?20:6);if(INV.bag.length<bagN()){INV.bag.push(it);toast(it.name,RAR[it.rar].c)}}gainXp(30*lv*(k?3:1))}
  else{W.chestLoot=W.chestLoot||{};if(!W.chestLoot[s.id]){const items=[];for(let i=0;i<n;i++)items.push(genItem(lv,k?20:6));W.chestLoot[s.id]={gold:Math.round(lv*rnd(3,6)*(k?3:1)),pot:1,food:Math.random()<0.45?pick(Object.keys(FOODS)):0,items};gainXp(30*lv*(k?3:1))}chestUiOpen(s.id,s.name||'Skrzynia')}
  for(const q of W.quests)if(q.type==='clear'&&q.sid===s.id&&!q.done){q.done=true;q.have=1;qNet({k:'qdone',id:q.id});toast('Zadanie wykonane: '+q.title+' — wróć do: '+q.gname,'#ffd34d')}
  saveInv();saveW();updHud();renderJournalIfOpen();
}


// ===== okno skrzyni: wybór, co zabrać =====
let CHEST_ID=null;
function chestLeft(id){const c=W.chestLoot&&W.chestLoot[id];return !!c&&(c.gold>0||c.pot>0||c.food||c.items.length>0)}
function chestUiOpen(id,title){CHEST_ID=id;const el=$('chestui');el.hidden=false;el.querySelector('h2').textContent=title;try{document.exitPointerLock()}catch(e){}chestUiRender()}
function chestUiClose(){CHEST_ID=null;$('chestui').hidden=true;saveW()}
function chestUiRender(){const c=W.chestLoot&&W.chestLoot[CHEST_ID],box=$('chestlist');if(!c){chestUiClose();return}let h='';
  if(c.gold>0)h+=`<div class="crow"><span class="cic gold">🪙</span><b style="color:#ffd34d">${c.gold} zł</b><button data-ct="gold">Weź</button></div>`;
  if(c.pot>0)h+=`<div class="crow">${icHTML({base:'potion',rar:0})}<b style="color:#7dff8a">Mikstura leczenia ×${c.pot}</b><button data-ct="pot">Weź</button></div>`;
  if(c.food)h+=`<div class="crow">${icHTML({base:'food',var:c.food,rar:0})}<b style="color:#d9a27c">${foodName(c.food)}</b><small>dla: ${foodFor(c.food)}</small><button data-ct="food">Weź</button></div>`;
  c.items.forEach((it,i)=>{const cur=INV.eq[it.slot];h+=`<div class="crow r${it.rar}" data-ctip="${i}">${icHTML(it)}<b style="color:${RAR[it.rar].c}">${esc(it.name)}</b><small>${RAR[it.rar].n} · poz. ${it.lvl}${it.slot==='bron'&&TWOH(it)?' · dwuręczna':''}${cur?'':' · wolny slot'}</small><button data-ct="i${i}">Weź</button></div>`});
  box.innerHTML=h||'<p class="sub2">Skrzynia jest pusta.</p>';$('chestall').disabled=!h}
function chestTake(k){const c=W.chestLoot&&W.chestLoot[CHEST_ID];if(!c)return false;
  if(k==='gold'){INV.gold+=c.gold;toast('+'+c.gold+' złota','#ffd34d');sfx('coin');c.gold=0}
  else if(k==='pot'){INV.pot+=c.pot;toast('Mikstura leczenia','#7dff8a');c.pot=0}
  else if(k==='food'){INV.food[c.food]=(INV.food[c.food]||0)+1;toast(foodName(c.food),'#d9a27c');c.food=0}
  else if(k[0]==='i'){const i=+k.slice(1),it=c.items[i];if(!it)return false;if(INV.bag.length>=bagN()){toast('Plecak pełny','#ff8a7a');return false}INV.bag.push(it);c.items.splice(i,1);toast(it.name,RAR[it.rar].c)}
  saveInv();saveW();updHud();return true}
$('chestlist').onclick=e=>{const b=e.target.closest('[data-ct]');if(!b)return;if(chestTake(b.dataset.ct))chestUiRender()};
$('chestall').onclick=()=>{const c=W.chestLoot&&W.chestLoot[CHEST_ID];if(!c)return;for(const k of ['gold','pot','food'])if(c[k])chestTake(k);while(c.items.length&&INV.bag.length<bagN())chestTake('i0');if(c.items.length)toast('Plecak pełny – część zostaje w skrzyni','#ff8a7a');chestUiRender();if(!chestLeft(CHEST_ID))chestUiClose()};
$('chestclose').onclick=()=>chestUiClose();
