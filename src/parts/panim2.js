// --- gatunki gry dorobione w stylu Pintara (format PANIM: body/head/neck/leg/gait) ---
{const EY=(hw,y,z,s)=>[[-hw-.25,y,z,.5,s,s,'#f6f2e8'],[hw-.25,y,z,.5,s,s,'#f6f2e8'],[-hw-.45,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010'],[hw+.05,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010']];
 const BR='#5a3a22',BD='#4a2e1a';
 PANIM.bear={body:voxGeo([[-3.4,4.6,-6,6.8,6.4,12,BR],[-2.8,10.6,1,5.6,1.6,4.4,BD],[-3,4.2,-5,6,1,10,BD],[-3.6,6,2.4,7.2,4.6,3,'#62422a'],[-.6,8,-6.8,1.2,1.2,1,BD],[-3.5,8.2,-5,7,1.2,8,'#6a4a30']]),
  head:voxGeo([...EY(2.6,.8,2.6,1.1),[-2.6,-2.4,0,5.2,4.6,4.4,BR],[-1.4,-2.4,4.2,2.8,2.2,2,'#8a6a4a'],[-.6,-1,6.1,1.2,.8,.4,'#1a1a1a'],[-2.8,1.8,.6,1.4,1.4,1,BD],[1.4,1.8,.6,1.4,1.4,1,BD],[-2,2.2,1.4,4,.6,2,'#62422a']]),neck:[0,9,5.6],
  leg:{w:2.2,h:4.6,c:BD,hoof:'#2a1a10',hips:[[-2.4,-4.4],[2.4,-4.4],[-2.4,4.2],[2.4,4.2]],amp:.5},gait:6};
 const CM='#c9a46a',CD='#b8925a';
 PANIM.camel={body:voxGeo([[-2.6,10,-6,5.2,4.6,12,CM],[-2,14.4,-3.4,4,2.8,3.6,'#c49c60'],[-2,14.4,1.2,4,2.4,3.2,'#c49c60'],[-1.4,17,-2.6,2.8,.8,2,'#b8925a'],[-2.4,9.8,-5,4.8,.8,10,CD],[-.5,10.6,-6.8,1,4,1,CD],[-.6,7.6,-7,1.2,3,1.2,'#8a6a3a']]),
  head:voxGeo([...EY(1.4,7.2,2.4,.8),[-1.1,0,-.6,2.2,7.4,2.4,CM],[-1.5,6.2,-.2,3,2.6,4.6,CM],[-1.2,6,4.2,2.4,1.8,1.8,CD],[-.6,7,5.9,1.2,.5,.3,'#3a2a1a'],[-1.6,8.6,.2,.8,1,.8,CD],[.8,8.6,.2,.8,1,.8,CD],[-1.2,-.4,1.6,2.4,4,.8,'#d4b078']]),neck:[0,12.2,5.6],
  leg:{w:1.3,h:10,c:CD,hoof:'#5a4a3a',hips:[[-1.6,-4.4],[1.6,-4.4],[-1.6,4.4],[1.6,4.4]],amp:.42},gait:4};
 PANIM.penguin={body:voxGeo([[-1.8,1.2,-1.6,3.6,5.6,3.2,'#1e2228'],[-1.3,1.4,1.5,2.6,4.6,.5,'#f2f2ee'],[-2.3,2.6,-.8,.5,3.2,1.6,'#1e2228'],[1.8,2.6,-.8,.5,3.2,1.6,'#1e2228'],[-1,1.2,-2.2,2,.8,1,'#1e2228'],[-1.4,5.6,1.2,2.8,1,.5,'#e8c040']]),
  head:voxGeo([...EY(1.4,.9,1.1,.7),[-1.4,0,-1.2,2.8,2.6,2.6,'#1e2228'],[-.4,.5,1.4,.8,.6,1.4,'#e8a03a'],[-1.1,-.2,1.3,2.2,1,.3,'#f2f2ee']]),neck:[0,6.6,.2],
  leg:{w:.9,h:1.2,c:'#e8a03a',hips:[[-.8,0],[.8,0]],amp:.45},gait:12};
 PANIM.reindeer={...PANIM.deer,body:geoRecolor(PANIM.deer.body,(r,g,b)=>r>g+.05&&r>.45?[r*.8,g*.86,b*.95]:null),head:voxGeo([[-1.2,0,-.4,2.4,5,2.4,'#8a7a68'],[-1.6,4.4,0,3.2,2.6,4.4,'#8a7a68'],[-1,4.4,4,2,1.6,1.2,'#5a4a3a'],[-.5,5.2,5.1,1,.5,.3,'#2a2420'],[-1.8,-.2,1.6,3.6,3,1.2,'#efe9df'],
   [-1.4,7,.6,.6,4.6,.6,'#cfc2a8'],[.8,7,.6,.6,4.6,.6,'#cfc2a8'],[-3.6,10.2,.4,2.8,.6,.6,'#cfc2a8'],[1.4,10.2,.4,2.8,.6,.6,'#cfc2a8'],[-3.8,10.8,.4,.6,2.4,.6,'#cfc2a8'],[3.2,10.8,.4,.6,2.4,.6,'#cfc2a8'],[-1.6,10.6,1.8,.6,2,.6,'#cfc2a8'],[1,10.6,1.8,.6,2,.6,'#cfc2a8'],[-.8,7.2,2.2,.6,1.6,1.8,'#cfc2a8'],...EY(1.6,5.6,2.4,.9)]),
  leg:{...PANIM.deer.leg,c:'#6a5a48'}};
 const GT='#d8d0c0';
 PANIM.goat={body:voxGeo([[-2.4,5,-4.4,4.8,4.6,8.8,GT],[-2,9.4,-4,4,.8,8,'#e8e2d6'],[-2.6,5.4,-2,5.2,3.6,4,'#cfc6b4'],[-.5,8.4,-5.2,1,1.6,.8,GT]]),
  head:voxGeo([...EY(1.5,.6,1.8,.8),[-1.5,-2,0,3,3.6,3.6,GT],[-1.1,-2.2,3.4,2.2,1.8,1.4,'#c8c0b0'],[-.5,-1.4,4.7,1,.5,.3,'#3a3330'],[-.5,-3.6,2.6,1,2,1,'#f2eee6'],[-1.4,1.6,-.2,.7,2.4,.7,'#8a8070'],[.7,1.6,-.2,.7,2.4,.7,'#8a8070'],[-1.4,3.6,-1.4,.7,.7,1.6,'#8a8070'],[.7,3.6,-1.4,.7,.7,1.6,'#8a8070'],[-2.6,.2,.6,1.2,.7,1.4,GT],[1.4,.2,.6,1.2,.7,1.4,GT]]),neck:[0,8.4,4.2],
  leg:{w:1.1,h:5,c:'#b8b0a0',hoof:'#3a3330',hips:[[-1.6,-3.2],[1.6,-3.2],[-1.6,3.2],[1.6,3.2]],amp:.55},gait:8};
 PANIM.turtle={body:voxGeo([[-3.2,1.2,-3.6,6.4,2.6,7.2,'#4a6a3a'],[-2.6,3.8,-3,5.2,1.2,6,'#5a7a42'],[-1.4,5,-1.6,2.8,.6,3.2,'#6a8a4a'],[-3.6,.8,-4,7.2,.6,8,'#8a7a4a'],[-.5,1.4,-4.6,1,.8,1,'#8a9a5a']]),
  head:voxGeo([...EY(1,.6,1.2,.6),[-1,-.4,0,2,1.8,2.4,'#8a9a5a']]),neck:[0,2,3.6],
  leg:{w:1.4,h:1.4,c:'#8a9a5a',hips:[[-2.6,-2.6],[2.6,-2.6],[-2.6,2.6],[2.6,2.6]],amp:.3},gait:4};
 PANIM.lizard={body:voxGeo([[-1.8,1.4,-4,3.6,1.8,8,'#6a8a3a'],[-1.2,3.2,-3.6,2.4,.4,7,'#8aa84a'],[-.8,1.6,-8.6,1.6,1.2,4.6,'#5a7a32'],[-.4,1.7,-11,.8,.8,2.4,'#5a7a32'],[-1.4,1.2,-3,2.8,.4,6,'#c8c070']]),
  head:voxGeo([...EY(1.3,.8,1.2,.6),[-1.3,-.6,0,2.6,1.6,3.2,'#6a8a3a'],[-.9,-.7,3,1.8,1,1,'#5a7a32']]),neck:[0,2.4,4],
  leg:{w:.9,h:1.4,c:'#5a7a32',hips:[[-2.2,-2.6],[2.2,-2.6],[-2.2,2.6],[2.2,2.6]],amp:.6},gait:12};
}
const PMAP={krowa:'cow',owca:'sheep',swinia:'pig',kura:'chicken',pies:'dog',kot:'cat',lis:'fox',krolik:'rabbit',kaczka:'duck',jelen:'deer',wilk:'wolf',dzik:'boar',niedzwiedz:'bear',wielblad:'camel',pingwin:'penguin',renifer:'reindeer',koza:'goat',zolw:'turtle',jaszczurka:'lizard'};
const PSC={wilk:2.5,dzik:2.4,niedzwiedz:2.5,kura:2.3,kaczka:2.3,krolik:2.4,kot:2.3,lis:2.3,pingwin:2.2};const PSC0=2.1;
const legCache={};
let panimSeq=0;
function makePanim(t,elite){
  const base=PMAP[t],id=panimSeq++,w=VARW[base],kind=w&&w[id%w.length]?base+'_'+w[id%w.length]:base,A=PANIM[kind]||PANIM[base];
  const d=EDEF[t],mat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});seasonPatch(mat,false);
  const S=(PSC[t]||PSC0),root=new THREE.Group();root.scale.setScalar(S);
  const body=new THREE.Mesh(A.body,mat);body.castShadow=true;root.add(body);
  const head=new THREE.Group();head.position.set(A.neck[0]*V,A.neck[1]*V,A.neck[2]*V);const hm=new THREE.Mesh(A.head,mat);hm.castShadow=true;head.add(hm);root.add(head);
  const legs=[];if(A.leg){const key=kind+'|leg';const lg=legCache[key]||(legCache[key]=legGeo(A.leg));A.leg.hips.forEach((hp,k)=>{const p=new THREE.Group();p.position.set(hp[0]*V,A.leg.h*V,hp[1]*V);const m=new THREE.Mesh(lg,mat);m.castShadow=true;p.add(m);p.userData.off=(k===0||k===3)?0:Math.PI;root.add(p);legs.push(p)})}
  const g=new THREE.Group();g.add(root);const inner=new THREE.Group();inner.add(g);inner.scale.setScalar(d.sc||(elite?1.35:1));
  inner.userData={g,root,legs:[],plegs:legs,mat,ph:Math.random()*6,body,head,pan:A,pk:base,S,pas:!!d.passive,amt:0,str:0,pit:0,yaw:0,idt:Math.random()*100,graze:0,grT:2+Math.random()*4,hop:false};
  return inner;
}
function makeHorseE(t,elite){
  const d=EDEF[t],mat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});seasonPatch(mat,false);
  const H=makeHorse();H.g.traverse(o=>{if(o.isMesh)o.material=mat});H.root.scale.setScalar(2.1);
  const g=new THREE.Group();g.add(H.g);const inner=new THREE.Group();inner.add(g);inner.scale.setScalar(d.sc||(elite?1.35:1));
  inner.userData={g,root:H.root,legs:[],plegs:H.legs,mat,ph:0,body:H.root,head:H.head,tail:H.tail,horse:1,S:2.1,pas:true,amt:0,str:0,pit:0,yaw:0,idt:Math.random()*100,graze:0,grT:3,pan:{gait:2.2,leg:{amp:.55}}};
  return inner;
}
// animacja jak w syncAnimals Pintara: krok po przekątnej, bujanie, pasienie, rozglądanie, przechył
function animPan(u,speed,dt,st){
  const A=u.pan,k=Math.min(1,dt*6);u.idt+=dt;
  const tgt=speed>0.25?Math.min(1,speed/(1.4*u.S)):0;u.amt+=(tgt-u.amt)*Math.min(1,k*1.3);
  u.str+=speed*dt/u.S;const ph=u.str*(A.gait||8)*(u.horse?2.6:1),amt=u.amt;
  const w=u.wind||0,sk=u.strike>0?Math.sin((1-u.strike/0.32)*Math.PI):0,hk=u.hit>0?Math.sin(u.hit/0.22*Math.PI):0;
  if(st===2)return;
  if(u.pas&&amt<0.05){u.grT-=dt;if(u.grT<=0){u.graze=u.graze>0?0:2+Math.random()*4;u.grT=u.graze>0?u.graze:3+Math.random()*6}}else u.graze=0;
  const hopK=u.pk==='rabbit'&&amt>0.1;
  const bob=hopK?Math.abs(Math.sin(ph*1.6))*0.14:Math.abs(Math.sin(ph))*0.025*amt+Math.sin(u.idt*1.7)*0.004;
  u.root.position.y=bob*u.S-w*0.05*u.S+sk*0.05*u.S;u.root.position.z=(sk*0.12-w*0.06-hk*0.05)*u.S;
  u.root.rotation.z=Math.sin(ph)*0.03*amt;u.root.rotation.x=-w*0.08+sk*0.1-hk*0.12;
  const amp=(A.leg?A.leg.amp:0.5)*(u.horse?1:1);
  if(u.horse){const offs=[0,Math.PI,Math.PI,0];u.plegs.forEach((l,i)=>{l.rotation.x=Math.sin(ph+offs[i])*0.55*amt})}
  else for(const l of u.plegs)l.rotation.x=Math.sin(ph+l.userData.off)*amp*amt+sk*0.3*(l.position.z>0?-1:1);
  let tp=u.graze>0?(u.pk==='chicken'?0.35+Math.max(0,Math.sin(u.idt*7))*0.9:0.8+Math.sin(u.idt*2.3)*0.1):Math.sin(u.idt*0.7)*0.08-0.05*amt;
  tp+=-w*0.45+sk*0.7-hk*0.35;
  u.pit+=(tp-u.pit)*Math.min(1,(u.pk==='chicken'?k*3:k));
  const yt=u.graze>0||amt>0.1?0:Math.sin(u.idt*0.5+u.ph)*0.45;u.yaw+=(yt-u.yaw)*k;
  if(u.horse){u.head.rotation.x=(u.graze>0?1.05:0.1+Math.sin(ph*2)*0.06*amt)+u.pit*0.3;u.head.rotation.y=u.yaw*0.6;u.tail.rotation.x=0.15+0.4*amt;u.tail.rotation.z=Math.sin(u.idt*(amt>0.1?6:2.3))*0.35}
  else{u.head.rotation.x=u.pit;u.head.rotation.y=u.yaw}
}
// ---------- zwierzęta tła: ptaki, motyle, mewy, gołębie, sowy, nietoperze, ryby ----------
const AMB=[];let ambT=0;
function ambMake(kind,sc){const A=PANIM[kind],g=new THREE.Group(),b=new THREE.Mesh(A.body,matV),w=new THREE.Mesh(A.head,matV);g.add(b,w);g.scale.setScalar(sc*2.1);scene.add(g);return{g,w,kind,sc}}
function ambTick(dt){
  ambT+=dt;const px=player.p.x,pz=player.p.z,day=hour>6&&hour<20,night=hour<5.5||hour>20.5;
  const want={bird:day?8:0,butterfly:day?6:0,owl:night?2:0,bat:night?6:0,gull:0,pigeon:0,fish:5};
  {let wet=0;for(let k=0;k<8;k++){const a=k/8*6.283,h=colAt(px+Math.cos(a)*30,pz+Math.sin(a)*30);if(h!==null&&h<WATER)wet++}if(wet>=2&&day)want.gull=5;const v=inVillage(px,pz,20);if(v&&day)want.pigeon=6}
  const cnt={};for(const a of AMB)cnt[a.kind]=(cnt[a.kind]||0)+1;
  for(const k in want){while((cnt[k]||0)<want[k]){cnt[k]=(cnt[k]||0)+1;const a=k==='fish'?{fish:1,kind:'fish',sch:[]}:ambMake(k,{bird:1.4,butterfly:1,owl:1.5,bat:1.2,gull:1.5,pigeon:1.15}[k]);
      a.cx=px+(Math.random()-0.5)*70;a.cz=pz+(Math.random()-0.5)*70;a.ph=Math.random()*6.28;a.r=k==='butterfly'?2+Math.random()*3:k==='pigeon'?1+Math.random()*2:8+Math.random()*14;a.alt=k==='butterfly'?0.8+Math.random()*1.2:k==='pigeon'?0:k==='bat'?5+Math.random()*5:12+Math.random()*12;a.sp=(k==='butterfly'?0.6:k==='bat'?1.1:0.35)*(Math.random()<0.5?1:-1);
      if(k==='fish'){a.k=Math.floor(Math.random()*3);for(let i=0;i<6+Math.floor(Math.random()*5);i++){const m=new THREE.Mesh(FISHK[a.k],matV);m.scale.setScalar(2.1);scene.add(m);a.sch.push({m,o:Math.random()*6.28,r:0.4+Math.random()*1.4,y:Math.random()*0.5})}}
      AMB.push(a)}}
  for(let i=AMB.length-1;i>=0;i--){const a=AMB[i],far=Math.hypot(a.cx-px,a.cz-pz)>95;
    if(far||(cnt[a.kind]>(want[a.kind]||0))){cnt[a.kind]--;if(a.fish)for(const f of a.sch)scene.remove(f.m);else scene.remove(a.g);AMB.splice(i,1);continue}
    a.ph+=dt*a.sp;
    if(a.fish){const h=colAt(a.cx,a.cz);if(h===null||h>WATER-1.5){a.cx=px+(Math.random()-0.5)*60;a.cz=pz+(Math.random()-0.5)*60;for(const f of a.sch)f.m.visible=false;continue}
      const x=a.cx+Math.cos(a.ph*0.3)*4,z=a.cz+Math.sin(a.ph*0.3)*4;
      for(const f of a.sch){f.m.visible=true;const ang=a.ph*0.3+f.o;f.m.position.set(x+Math.cos(ang*2+f.o)*f.r,WATER-0.65-f.y+Math.sin(ambT*2+f.o)*0.05,z+Math.sin(ang*2+f.o)*f.r);f.m.rotation.y=Math.atan2(-Math.sin(a.ph*0.3),Math.cos(a.ph*0.3))+Math.PI/2+Math.sin(ambT*6+f.o)*0.15}continue}
    const x=a.cx+Math.cos(a.ph)*a.r,z=a.cz+Math.sin(a.ph)*a.r,gh=colAt(x,z);const base=gh===null?WATER:Math.max(gh,WATER);
    let y=base+a.alt,wing=1;
    if(a.kind==='bird'){y+=Math.sin(ambT*2+a.ph)*0.6;wing=0.3+Math.abs(Math.sin(ambT*12+a.ph))*0.7}
    else if(a.kind==='butterfly'){y+=Math.sin(ambT*5+a.ph)*0.3;wing=0.15+Math.abs(Math.sin(ambT*20+a.ph))*0.85;if(Math.random()<dt*0.2){a.cx+=(Math.random()-0.5)*6;a.cz+=(Math.random()-0.5)*6}}
    else if(a.kind==='gull'){y+=Math.sin(ambT*1.1+a.ph)*1.2;wing=Math.sin(ambT*0.5+a.ph)>0.15?0.9+Math.sin(ambT*1.4)*0.08:0.35+Math.abs(Math.sin(ambT*6))*0.65}
    else if(a.kind==='owl'){y+=Math.sin(ambT*1.3)*0.5;wing=0.35+Math.abs(Math.sin(ambT*5+a.ph))*0.65}
    else if(a.kind==='bat'){y+=Math.sin(ambT*3+a.ph)*0.8;wing=0.2+Math.abs(Math.sin(ambT*18+a.ph))*0.8}
    else if(a.kind==='pigeon'){const v=inVillage(a.cx,a.cz,20);const vg=v?villageGround(x,z,999):null;y=Math.max(base,vg??base)+0.05+Math.abs(Math.sin(ambT*7+a.ph))*0.05;wing=0.24;a.ph-=dt*a.sp*0.7}
    a.g.position.set(x,y,z);a.g.rotation.y=Math.atan2(-Math.sin(a.ph)*Math.sign(a.sp),Math.cos(a.ph)*Math.sign(a.sp));a.w.scale.x=wing}
}
