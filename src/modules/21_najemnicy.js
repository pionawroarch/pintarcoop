// =================== TOWARZYSZE BRONI (najemnicy, maks. 2) ===================
const FOL=[];INV.fol=INV.fol||[];let folPick=null;const FOLSL=[['bron','Broń'],['tarcza','Tarcza'],['helm','Hełm'],['zbroja','Zbroja'],['rekawice','Rękawice'],['buty','Buty']];
const MERCW=['miecz','topor','wlocznia','buzdygan','luk','kusza','szabla','mlot'];
function mercOffer(n,v){const r=rngOf('merc'+n.id),lvl=Math.max(1,(v&&v.lvl||1)+Math.floor(r()*3)),w=MERCW[Math.floor(r()*MERCW.length)];
  return{lvl,w,price:Math.round(30+lvl*22),look:{fem:n.fem?1:0,skin:n.skin,hairC:n.hair,hair:n.fem?rpick(r,['dlugie','warkocze','kucyk']):rpick(r,['krotkie','krotkie','lysy','irokez']),beard:n.fem?'brak':rpick(r,['brak','zarost','krotka','dluga']),eyes:Math.floor(r()*5),tunic:n.cloth,pants:darker(n.cloth,0.6),boots:'#3a2a1a',cape:r()<0.5?1:0,capeC:rpick(r,['#7a2a2a','#2a4a6a','#3a5a3a'])},
    ex:{hat:rpick(r,['helm','kaptur',undefined]),armor:r()<0.6?rpick(r,['#8a8f94','#7a5030','#9aa0a6']):undefined,gloves:'#4a3020'},name:n.name,race:n.race}}
function hireMerc(n){const o=n.merc;if(!o)return;if(INV.fol.length>=2)return dlgShow('Masz już dwóch towarzyszy. Więcej z tobą nie pójdzie.',[bye]);if(INV.gold<o.price)return dlgShow(`Za ${o.price} złota pójdę z tobą choćby do piekła. Wróć, gdy uzbierasz.`,[bye]);
  INV.gold-=o.price;INV.fol.push({id:'f'+Date.now(),name:o.name,lvl:o.lvl,w:o.w,look:o.look,ex:o.ex,race:o.race});n.merc=null;saveInv();updHud();spawnFols();sfx('recruit');toast(o.name+' dołącza do drużyny!','#ffd34d');
  dlgShow('Umowa stoi. Prowadź, a ja będę pilnować twoich pleców.',[bye])}
function spawnFols(){for(const f of FOL)scene.remove(f.m);FOL.length=0;INV.fol.forEach((d,i)=>{d.eq=d.eq||{};const ex={...(d.ex||{})};const RR=RACES[d.race]||{};if(d.eq.helm&&!RR.nohelm)ex.hat='helm';if(RR.nohelm&&ex.hat==='helm')ex.hat=undefined;if(RR.lizard&&d.look){d.look.hair='lysy';d.look.beard='brak'}if(RR.ears)ex.ears=1;if(d.eq.zbroja)ex.armor=['#8a8f94','#9aa0a6','#7a8a9a','#8a6ab0','#c9a24a'][d.eq.zbroja.rar||0];if(d.eq.rekawice)ex.gloves='#5a4a3a';const m=makeChar(d.look,ex);m.userData.herb=S.herb;m.userData.skinC=d.look&&d.look.skin;try{applyGear(m,RR.nohelm?Object.assign({},d.eq,{helm:undefined}):d.eq)}catch(_){}try{raceDeco(m,d.race);if(RR.hs&&RR.hs!==1)m.scale.set(RR.ws,RR.hs,RR.ws)}catch(_){}const wi=d.eq.bron;if(wi)setWeapon(m,wi.base,wi.rar||0,wi.var,wi.lk,wi.sd);else setWeapon(m,d.w,Math.min(4,Math.floor(d.lvl/8)));const ntg=nameTag(d.name+' · poz. '+d.lvl,'#ffd34d');m.add(ntg);scene.add(m);
  FOL.push({tag:ntg,d,m,p:new THREE.Vector3(player.p.x+1+i,player.p.y,player.p.z+1),ry:0,cd:0,atk:0,atkD:0.4,combo:0,i,speed:0,shotT:0})})}
function dismissFol(i){const d=INV.fol[i];if(!d)return;for(const k in (d.eq||{}))if(d.eq[k])INV.bag.push(d.eq[k]);INV.fol.splice(i,1);saveInv();spawnFols();toast(d.name+' odchodzi.','#cfe8ff')}
function remoteFols(r,c,dt){r.fols=r.fols||new Map();const seen=new Set();
  for(const q of (c.fo||[])){const id=q[5];seen.add(id);let o=r.fols.get(id);if(!o){const d=(c.fl||[]).find(x=>x[0]===id);if(!d)continue;const mm=makeChar(d[1],d[2]);setWeapon(mm,q[4],0);mm.add(nameTag(d[3],'#ffd34d'));scene.add(mm);o={m:mm,ph:0};r.fols.set(id,o)}
    const ox=o.m.position.x,oz=o.m.position.z;o.m.position.x+=(q[0]-ox)*Math.min(1,10*dt);o.m.position.y+=(q[1]-o.m.position.y)*Math.min(1,10*dt);o.m.position.z+=(q[2]-oz)*Math.min(1,10*dt);o.m.rotation.y=q[3];
    o.m.visible=q[7]!==0;if(q[6]){o.ph+=dt*3;animCombat(o.m,'melee',0,(o.ph%1))}else animChar(o.m,Math.hypot(o.m.position.x-ox,o.m.position.z-oz)/Math.max(dt,1e-3),dt,false,false)}
  for(const [id,o] of r.fols)if(!seen.has(id)){scene.remove(o.m);r.fols.delete(id)}}
function folTick(dt){
  if(custOn||(SPC&&SPC.func==='garderoba')){for(const f of FOL){f.m.visible=false;f.cust=1}return}for(const f of FOL)if(f.cust){f.cust=0;f.p.set(player.p.x+1.5,player.p.y,player.p.z+1.5);if(!(f.d.deadUntil>Date.now()))f.m.visible=true}
  compSeparate();
  for(const f of FOL){const d=f.d,ox=f.p.x,oz=f.p.z,bow=d.w==='luk'||d.w==='kusza';f.cd-=dt;if(f.max==null){f.max=folMaxHp(d);f.hp=f.max}
    if(d.deadUntil>Date.now()){f.m.visible=false;continue}if(!f.m.visible){f.m.visible=true;f.hp=f.max;f.p.set(player.p.x+1.5,player.p.y,player.p.z+1.5);if(d.deadUntil){d.deadUntil=0;saveInv();toast(d.name+' wraca do drużyny!','#ffd34d')}}
    if(f.hp<f.max&&nowS()-(f.hurtT||0)>6)f.hp=Math.min(f.max,f.hp+f.max*0.03*(1+0.4*fpk(d,'rany'))*dt);
    let tg=null,td=1e9;const myC='c:'+d.id;for(const e of enemies.values()){if(e.st===2||!((e.hurtP&&nowS()-e.hurtP<15)||(f.lastAtk===e.id&&nowS()-(f.lastAtkT||0)<15)))continue;const de=Math.hypot(e.p.x-f.p.x,e.p.z-f.p.z);if(de<22&&de<td&&Math.abs(e.p.y-f.p.y)<6){td=de;tg=e}}
    let tx,tz,spd;const side=f.i?-1:1,a=player.ry+Math.PI+side*1.15;
    if(tg&&!P2.dead){const rng=bow?14:2.0;if((bow?td:eDist(tg,f.p.x,f.p.z))>rng){tx=tg.p.x;tz=tg.p.z;spd=6.5*(1+0.08*fpk(d,'szybki'))}else{tx=f.p.x;tz=f.p.z;spd=0;f.ry=Math.atan2(tg.p.x-f.p.x,tg.p.z-f.p.z);
        if(f.cd<=0){f.cd=(bow?1.6:1.1)*(pms(d,15)?0.9:1);f.atk=f.atkD;f.combo=(f.combo+1)%3;f.tg=tg;f.hitDone=false}}}
    else{tx=player.p.x+Math.sin(a)*3.1;tz=player.p.z+Math.cos(a)*3.1;spd=Math.min(9*(1+0.08*fpk(d,'szybki')),Math.hypot(tx-f.p.x,tz-f.p.z)*2)}
    const dx=tx-f.p.x,dz=tz-f.p.z,dd=Math.hypot(dx,dz);
    if((dd>45||Math.abs(player.p.y-f.p.y)>30)&&VH.mode!==2&&(player.ground||player.swim)){f.p.set(player.p.x-1,player.p.y,player.p.z-1)}else if(dd>0.35&&spd>0){const st=Math.min(dd,spd*dt);const nx=f.p.x+dx/dd*st,nz=f.p.z+dz/dd*st,h=colAt(nx,nz,f.p.y),vb=!SPC&&VOX.size&&voxProbe(nx,nz,f.p.y,0.3,1.6).block;if(vb){const sx=voxProbe(nx,f.p.z,f.p.y,0.3,1.6).block,sz=voxProbe(f.p.x,nz,f.p.y,0.3,1.6).block;if(!sx)f.p.x=nx;else if(!sz)f.p.z=nz}else if(h!==null&&h-f.p.y<1.2){f.p.x=nx;f.p.z=nz}else{f.p.x+=dx/dd*st*0.3}f.ry=Math.atan2(dx,dz)}
    if(!SPC&&VH.mode!==4){try{villageCollide(f.p);structCollide(f.p)}catch(_){}}
    const h=colAt(f.p.x,f.p.z,f.p.y);if(h!==null)f.p.y+=(Math.max(h,wlAt(f.p.x,f.p.z)-1.3)-f.p.y)*Math.min(1,12*dt);
    if(f.atk>0){f.atk-=dt;const k=1-f.atk/f.atkD;if(bow){animCombat(f.m,'bow',0,Math.min(0.99,k*1.1));if(!f.hitDone&&k>0.85&&f.tg){f.hitDone=true;const e=f.tg,o=[f.p.x,f.p.y+1.35,f.p.z],ddx=e.p.x-o[0],ddy=e.p.y+0.9-o[1],ddz=e.p.z-o[2],l=Math.hypot(ddx,ddy,ddz)||1;spawnProj('arrow',o,[ddx/l,ddy/l+0.04,ddz/l],true,folDmg(d),{src:d.id});folXp(f,folDmg(d)*0.12);sendFx({k:'proj',kind:'arrow',o,d:[ddx/l,ddy/l+0.04,ddz/l],sm:1});sfx('bow',0.6)}}
      else{animCombat(f.m,weaponKind(d.w)==='dagger'?'dagger':'melee',f.combo,k);if(!f.hitDone&&k>0.42&&f.tg&&f.tg.st!==2){f.hitDone=true;const e=f.tg,ex=e.p.x-f.p.x,ez=e.p.z-f.p.z,l=Math.hypot(ex,ez)||1;if(eDist(e,f.p.x,f.p.z)<2.8){HIT_SRC=d.id;const fcr=Math.random()<0.08+0.04*fpk(d,'krytyk')+(pms(d,40)?0.1:0),fdm=folDmg(d)*rnd(0.9,1.1);dealHit(e,fcr?fdm*2:fdm,fcr,ex/l,ez/l);HIT_SRC=null;folXp(f,fdm*0.12)}sfx('swing',0.6)}}}
    f.speed=Math.hypot(f.p.x-ox,f.p.z-oz)/Math.max(dt,1e-3);
    f.m.position.copy(f.p);let dr=f.ry-f.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));f.m.rotation.y+=dr*Math.min(1,10*dt);
    if(f.atk<=0)animChar(f.m,Math.min(f.speed,9),dt,false,f.p.y<wlAt(f.p.x,f.p.z)-1.2)}
}
const folDmgB=d=>{const it=d.eq&&d.eq.bron;if(it&&it.dmg!=null)return it.dmg*(1+0.1*(it.up||0))*(1+0.06*(d.lvl-1))*0.9;return(WEAP[d.w].dmg*(1+0.13*(d.lvl-1)))*(1+0.04*(HERO.lvl-1))*0.8};
const folDmg=d=>folDmgB(d)*(1+0.08*fpk(d,'bron'))*(pms(d,10)?1.1:1)*(pms(d,50)?1.2:1);
