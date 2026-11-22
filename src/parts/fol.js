// =================== TOWARZYSZE BRONI (najemnicy, maks. 2) ===================
const FOL=[];INV.fol=INV.fol||[];
const MERCW=['miecz','topor','wlocznia','buzdygan','luk','kusza','szabla','mlot'];
function mercOffer(n,v){const r=rngOf('merc'+n.id),lvl=Math.max(1,(v&&v.lvl||1)+Math.floor(r()*3)),w=MERCW[Math.floor(r()*MERCW.length)];
  return{lvl,w,price:Math.round(30+lvl*22),look:{fem:n.fem?1:0,skin:n.skin,hairC:n.hair,hair:n.fem?rpick(r,['dlugie','warkocze','kucyk']):rpick(r,['krotkie','krotkie','lysy','irokez']),beard:n.fem?'brak':rpick(r,['brak','zarost','krotka','dluga']),eyes:Math.floor(r()*5),tunic:n.cloth,pants:darker(n.cloth,0.6),boots:'#3a2a1a',cape:r()<0.5?1:0,capeC:rpick(r,['#7a2a2a','#2a4a6a','#3a5a3a'])},
    ex:{hat:rpick(r,['helm','kaptur',undefined]),armor:r()<0.6?rpick(r,['#8a8f94','#7a5030','#9aa0a6']):undefined,gloves:'#4a3020'},name:n.name,race:n.race}}
function hireMerc(n){const o=n.merc;if(!o)return;if(INV.fol.length>=2)return dlgShow('Masz już dwóch towarzyszy. Więcej z tobą nie pójdzie.',[bye]);if(INV.gold<o.price)return dlgShow(`Za ${o.price} złota pójdę z tobą choćby do piekła. Wróć, gdy uzbierasz.`,[bye]);
  INV.gold-=o.price;INV.fol.push({id:'f'+Date.now(),name:o.name,lvl:o.lvl,w:o.w,look:o.look,ex:o.ex,race:o.race});n.merc=null;saveInv();updHud();spawnFols();sfx('recruit');toast(o.name+' dołącza do drużyny!','#ffd34d');
  dlgShow('Umowa stoi. Prowadź, a ja będę pilnować twoich pleców.',[bye])}
function spawnFols(){for(const f of FOL)scene.remove(f.m);FOL.length=0;INV.fol.forEach((d,i)=>{const m=makeChar(d.look,d.ex);setWeapon(m,d.w,Math.min(4,Math.floor(d.lvl/8)));m.add(nameTag(d.name+' · poz. '+d.lvl,'#ffd34d'));scene.add(m);
  FOL.push({d,m,p:new THREE.Vector3(player.p.x+1+i,player.p.y,player.p.z+1),ry:0,cd:0,atk:0,atkD:0.4,combo:0,i,speed:0,shotT:0})})}
function dismissFol(i){const d=INV.fol[i];if(!d)return;INV.fol.splice(i,1);saveInv();spawnFols();toast(d.name+' odchodzi.','#cfe8ff')}
function folTick(dt){
  for(const f of FOL){const d=f.d,ox=f.p.x,oz=f.p.z,bow=d.w==='luk'||d.w==='kusza';f.cd-=dt;
    let tg=null,td=1e9;for(const e of enemies.values()){if(e.st===2||e.pas||!(e.mark&&nowS()-e.mark<12))continue;const de=Math.hypot(e.p.x-f.p.x,e.p.z-f.p.z);if(de<22&&de<td&&Math.abs(e.p.y-f.p.y)<6){td=de;tg=e}}
    let tx,tz,spd;const side=f.i?-1:1,a=player.ry+Math.PI+side*0.7;
    if(tg&&!P2.dead){const rng=bow?14:2.2+eSc(tg)*0.6;if(td>rng){tx=tg.p.x;tz=tg.p.z;spd=6.5}else{tx=f.p.x;tz=f.p.z;spd=0;f.ry=Math.atan2(tg.p.x-f.p.x,tg.p.z-f.p.z);
        if(f.cd<=0){f.cd=bow?1.6:1.1;f.atk=f.atkD;f.combo=(f.combo+1)%3;f.tg=tg;f.hitDone=false}}}
    else{tx=player.p.x+Math.sin(a)*2.6;tz=player.p.z+Math.cos(a)*2.6;spd=Math.min(9,Math.hypot(tx-f.p.x,tz-f.p.z)*2)}
    const dx=tx-f.p.x,dz=tz-f.p.z,dd=Math.hypot(dx,dz);
    if(dd>45||Math.abs(player.p.y-f.p.y)>30){f.p.set(player.p.x-1,player.p.y,player.p.z-1)}else if(dd>0.35&&spd>0){const st=Math.min(dd,spd*dt);const nx=f.p.x+dx/dd*st,nz=f.p.z+dz/dd*st,h=colAt(nx,nz,f.p.y);if(h!==null&&h-f.p.y<1.2){f.p.x=nx;f.p.z=nz}else{f.p.x+=dx/dd*st*0.3}f.ry=Math.atan2(dx,dz)}
    const h=colAt(f.p.x,f.p.z,f.p.y);if(h!==null)f.p.y+=(Math.max(h,WATER-1.3)-f.p.y)*Math.min(1,12*dt);
    if(f.atk>0){f.atk-=dt;const k=1-f.atk/f.atkD;if(bow){animCombat(f.m,'bow',0,Math.min(0.99,k*1.1));if(!f.hitDone&&k>0.85&&f.tg){f.hitDone=true;const e=f.tg,o=[f.p.x,f.p.y+1.35,f.p.z],ddx=e.p.x-o[0],ddy=e.p.y+0.9-o[1],ddz=e.p.z-o[2],l=Math.hypot(ddx,ddy,ddz)||1;spawnProj('arrow',o,[ddx/l,ddy/l+0.04,ddz/l],true,folDmg(d),{});sendFx({k:'proj',kind:'arrow',o,d:[ddx/l,ddy/l+0.04,ddz/l],sm:1});sfx('bow',0.6)}}
      else{animCombat(f.m,weaponKind(d.w)==='dagger'?'dagger':'melee',f.combo,k);if(!f.hitDone&&k>0.42&&f.tg&&f.tg.st!==2){f.hitDone=true;const e=f.tg,ex=e.p.x-f.p.x,ez=e.p.z-f.p.z,l=Math.hypot(ex,ez)||1;if(l<3.2+eSc(e))dealHit(e,folDmg(d)*rnd(0.9,1.1),Math.random()<0.08,ex/l,ez/l);sfx('swing',0.6)}}}
    f.speed=Math.hypot(f.p.x-ox,f.p.z-oz)/Math.max(dt,1e-3);
    f.m.position.copy(f.p);let dr=f.ry-f.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));f.m.rotation.y+=dr*Math.min(1,10*dt);
    if(f.atk<=0)animChar(f.m,Math.min(f.speed,9),dt,false,f.p.y<WATER-1.2)}
}
const folDmg=d=>(WEAP[d.w].dmg*(1+0.13*(d.lvl-1)))*(1+0.04*(HERO.lvl-1))*0.8;
// =================== BANDY WROGÓW WĘDRUJĄCE PO MAPIE (z pochodniami) ===================
const BANDS=new Map();let bandSeq=1;
function spawnBand(pp){const a=Math.random()*6.283,d=rnd(60,90),x=pp.p.x+Math.cos(a)*d,z=pp.p.z+Math.sin(a)*d,h=colAt(x,z),b=biomeAt(x,z);if(h===null||h<WATER||inVillage(x,z,60))return;
  const night=hour<6||hour>19.5,kinds=night&&Math.random()<0.5?['szkielet','lucznik_s','szkielet','upior']:b===4||b===8?['ork','ork','bandyta','ork']:b===6||b===5||b===12?['troll','ork','ork']:b===3||b===9||b===10?['goblin','goblin','szaman','goblin']:['bandyta','bandyta','bandyta','szaman','bandyta'];
  const n=3+Math.floor(Math.random()*3),id=bandSeq++,sp=spawnPt(),lvl=Math.max(1,1+Math.floor(Math.hypot(x-sp[0],z-sp[2])/260));const B={id,tx:x,tz:z,t:0,mem:[]};BANDS.set(id,B);
  for(let i=0;i<n;i++){const xx=x+rnd(-3,3),zz=z+rnd(-3,3),hh=colAt(xx,zz);if(hh===null)continue;const t=kinds[i%kinds.length],e=makeE(t,lvl,i===0&&Math.random()<0.5,xx,hh,zz,{band:id,torch:HUM[t]&&(i%2===0||night),bo:[(i%3-1)*1.8,-Math.floor(i/3)*1.8-(i?1.4:0)]});B.mem.push(e.id)}}
function bandMove(e,dt){const B=BANDS.get(e.band);if(!B)return null;const lead=enemies.get(B.mem.find(id=>{const q=enemies.get(id);return q&&q.st!==2}));if(!lead){BANDS.delete(e.band);return null}
  if(lead===e){B.t-=dt;const d=Math.hypot(B.tx-e.p.x,B.tz-e.p.z);if(d<3||B.t<=0){const a=Math.random()*6.283,r=rnd(50,110);let nx=e.p.x+Math.cos(a)*r,nz=e.p.z+Math.sin(a)*r;if(inVillage(nx,nz,40)){nx=e.p.x-Math.cos(a)*r;nz=e.p.z-Math.sin(a)*r}B.tx=nx;B.tz=nz;B.t=40}
    const dx=B.tx-e.p.x,dz=B.tz-e.p.z,l=Math.hypot(dx,dz)||1;e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,0.42]}
  const c=Math.cos(lead.ry),s=Math.sin(lead.ry),ox=e.bo[0]*c+e.bo[1]*s,oz=-e.bo[0]*s+e.bo[1]*c,tx=lead.p.x+ox,tz=lead.p.z+oz,dx=tx-e.p.x,dz=tz-e.p.z,l=Math.hypot(dx,dz);
  if(l<0.4)return[0,0,0];e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,Math.min(0.75,0.3+l*0.12)]}
function torchModel(m){const u=m.userData;if(!u.ch||u.torchM)return;const t=new THREE.Group();t.add(new THREE.Mesh(boxes([[0,-0.3,0.25,0.07,0.07,0.75,'#4a2f1d'],[0,-0.3,0.65,0.13,0.13,0.14,'#3a3a40']]),decoMat));
  const fl=new THREE.Mesh(boxes([[0,-0.3,0.78,0.2,0.2,0.24,'#ff8a2e'],[0,-0.3,0.9,0.12,0.12,0.16,'#ffe08a']]),new THREE.MeshBasicMaterial({vertexColors:true}));t.add(fl);
  const gs=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));gs.scale.set(1.3,1.3,1);gs.position.set(0,-0.3,0.85);t.add(gs);
  t.rotation.x=-0.9;u.ch.userData.le.add(t);u.torchM=t;u.flame=fl}
