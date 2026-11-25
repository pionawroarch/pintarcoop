// =================== POSTAĆ: model, wygląd, animacje walki ===================
const SKINS=['#f6d7bd','#efc6a0','#e0ac80','#c98e60','#a46a42','#7a4a2c','#5a3420','#fbe6d6','#8ab0d8','#7aa05a','#a8a8b8','#c87a6a'];
const HAIRC=['#2a1c12','#4a2f1d','#7a4a26','#a8632e','#c9a05a','#e6d29a','#8a8a8a','#e9e6df','#6a2a1a','#2b2f45','#c8302a','#3a6ad8','#3aa04a','#e070b0','#9a4ad8','#f0f0f8'];
const CLOTHC=['#7a3a2a','#3f5f8a','#3f6a3a','#6a4a8a','#8a6a3a','#5a5a62','#a8452f','#2f4a4a','#c9a24a','#d8ccb0','#1e1e24','#f0ece0','#c84a8a','#3a8ac8','#5a3a22','#8a1a2a','#e08a2a','#5aa8a0'];
const EYEC=['#3a6aa0','#4a7a3a','#5a3a20','#6a6a6a','#2a2a2a','#c8302a','#d9b23a','#8a3ad8','#3ac8c8','#e8e8e8'];
const HAIRS=[['krotkie','Krótkie'],['dlugie','Długie'],['kucyk','Kucyk'],['warkocze','Warkocze'],['irokez','Irokez'],['lysy','Łysy'],['kok','Kok'],['loki','Loki'],['grzywka','Grzywka'],['boki','Wygolone boki'],['dredy','Dredy'],['koki','Dwa koki'],['zaczesane','Zaczesane'],['afro','Bujne'],['czub','Czub wojownika'],['polkucyk','Półkucyk']];
const BEARDS=[['brak','Brak'],['zarost','Zarost'],['krotka','Krótka broda'],['dluga','Długa broda'],['wasy','Wąsy'],['bokobrody','Bokobrody'],['kozia','Kozia bródka'],['warkocz','Broda z warkoczem'],['pelna','Pełna broda'],['podkrecane','Podkręcane wąsy'],['kotwica','Kotwica']];
const PAINTC=['#2a4a8a','#a8302a','#1a1a1a','#e8e2cc','#3a7a3a'],BELTC=['#4a3020','#2a1c12','#7a5230','#5a2a2a','#2b2f45'],ACCC=['#d9b23a','#c4ccd2','#b8302a','#3a8ac0','#5a9a4a'];
const DEFLOOK={skin:1,hair:'krotkie',hairC:1,beard:'brak',eyes:0,tunic:1,pants:5,boots:4,cape:0,capeC:0,build:0,brows:0,scar:'brak',paint:'brak',paintC:0,patch:0,ears:'ludzkie',ht:1,acc:'brak',accC:0,belt:0,beardC:-1,horns:'brak',hornC:0,hat:'brak',hatC:0,tattoo:'brak',tatC:0,freckles:0,tpat:0,tunic2:9};
const HORNC=['#e8dcc0','#5a4a3a','#2a2420','#a8302a','#d9b23a'];
const lookOf=l=>Object.assign({},DEFLOOK,l||{});
function darker(hex,k){return '#'+new THREE.Color(hex).multiplyScalar(k).getHexString()}
// look: indeksy kolorów albo wprost kolory (NPC); extra: ears, tusks, hat, apron, pack
// zaokrąglanie brył: box -> 3 przenikające się boxy (ścięte krawędzie), tylko dla większych brył; detale zostają ostre
function roundify(list,k){const out=[];for(const b of list){const [x,y,z,w,h,d,c]=b,mn=Math.min(w,h,d);if(mn<0.13||b[7]===0){out.push(b.length>7?b.slice(0,7):b);continue}
  const e=Math.min(0.075,mn*(k||0.2));out.push([x,y,z,w,h-2*e,d-2*e,c],[x,y,z,w-2*e,h,d-2*e,c],[x,y,z,w-2*e,h-2*e,d,c])}return out}
function rboxes(list,k){return boxes(roundify(list,k))}
// look: indeksy kolorów albo wprost kolory (NPC); extra: ears, tusks, hat, apron, pack, armor, gloves

// ===== warstwy siatek postaci i stworów (z-fighting) =====
// Ubranie, zbroja, ozdoby i ekwipunek to osobne siatki przyklejone do części ciała, często ściana w ścianę z nią.
// Każda kolejna siatka w tym samym rodzicu dostaje skalę 1+0,004·k wokół środka własnej geometrii — leży o ułamek milimetra nad poprzednią.
function layerMeshes(root){if(!root||!root.traverse)return root;
  const bbOf=m=>{const g=m.geometry;if(!g)return null;if(!g.boundingBox)g.computeBoundingBox();const b=g.boundingBox;return b&&isFinite(b.min.x)?b:null};
  // pudełko ograniczające siatki w układzie rodzica (z obrotem i skalą)
  const aabb=(m,self)=>{const b=bbOf(m);if(!b)return null;if(self)return[b.min.x,b.min.y,b.min.z,b.max.x,b.max.y,b.max.z];const q=m.quaternion,s=m.scale,p=m.position,qx=q.x||0,qy=q.y||0,qz=q.z||0,qw=q.w==null?1:q.w,r=[1e9,1e9,1e9,-1e9,-1e9,-1e9];
    for(let t=0;t<8;t++){let x=(t&1?b.max.x:b.min.x)*s.x,y=(t&2?b.max.y:b.min.y)*s.y,z=(t&4?b.max.z:b.min.z)*s.z;const ix=qw*x+qy*z-qz*y,iy=qw*y+qz*x-qx*z,iz=qw*z+qx*y-qy*x,iw=-qx*x-qy*y-qz*z;
      x=ix*qw-iw*qx-iy*qz+iz*qy+p.x;y=iy*qw-iw*qy-iz*qx+ix*qz+p.y;z=iz*qw-iw*qz-ix*qy+iy*qx+p.z;r[0]=Math.min(r[0],x);r[1]=Math.min(r[1],y);r[2]=Math.min(r[2],z);r[3]=Math.max(r[3],x);r[4]=Math.max(r[4],y);r[5]=Math.max(r[5],z)}return r};
  const clash=(A,B)=>{const ov=a=>Math.min(A[a+3],B[a+3])-Math.max(A[a],B[a]);const o=[ov(0),ov(1),ov(2)];if(o[0]>0.002&&o[1]>0.002&&o[2]>0.002)return true;
    for(let a=0;a<3;a++){const b=(a+1)%3,c=(a+2)%3;if(o[b]>0.004&&o[c]>0.004&&(Math.abs(A[a]-B[a])<0.002||Math.abs(A[a+3]-B[a+3])<0.002))return true}return false};
  root.traverse(node=>{const ch=node.children;if(!Array.isArray(ch)||!ch.length)return;
    let base=node.isMesh===true?node:null;if(!base)for(const c of ch)if(c.isMesh===true&&c.isInstancedMesh!==true){base=c;break}
    if(!base)return;const Bb=aabb(base,base===node);if(!Bb)return;
    const P=[(Bb[0]+Bb[3])/2,(Bb[1]+Bb[4])/2,(Bb[2]+Bb[5])/2],hm=Math.max(0.02,Math.min(Bb[3]-Bb[0],Bb[4]-Bb[1],Bb[5]-Bb[2])/2);
    const done=[[Bb,0]];
    for(const c of ch){if(c===base||c.isMesh!==true||c.isInstancedMesh===true)continue;if(c.userData&&(c.userData.mask===1||c.userData.noLayer===1))continue;
      const A=aabb(c,false);if(!A)continue;
      if(c.__lay===1){done.push([A,c.__lk||0]);continue}
      const used=new Set();for(const [D,k] of done)if(clash(A,D))used.add(k);let k=0;if(used.size){k=1;while(used.has(k))k++}
      if(k>0){const f=1+Math.min(0.05,0.0016*Math.min(k,12)/hm);
        c.position.x=P[0]+f*(c.position.x-P[0]);c.position.y=P[1]+f*(c.position.y-P[1]);c.position.z=P[2]+f*(c.position.z-P[2]);c.scale.x*=f;c.scale.y*=f;c.scale.z*=f}
      c.__lay=1;c.__lk=k;done.push([aabb(c,false)||A,k])}});return root}
const CHARPR={hs:0.85,tw:1.12,th:1.12,td:1.04,aw:1.05,al:1.12,ll:1.18};
function makeChar(look,extra){
  const L=lookOf(look),E=extra||{};
  const col=(arr,v)=>typeof v==='string'?v:arr[v%arr.length];
  const skin=col(SKINS,L.skin),hair=col(HAIRC,L.hairC),tun=col(CLOTHC,L.tunic),pan=col(CLOTHC,L.pants),boo=col(CLOTHC,L.boots),eye=col(EYEC,L.eyes);
  const tunD=darker(tun,0.74),tunL=darker(tun,1.15),panD=darker(pan,0.78),booD=darker(boo,0.72),hairD=darker(hair,0.8),skinD=darker(skin,0.9),bw=L.build===2?1.24:L.build?1.12:1,fem=!!L.fem,belt=col(BELTC,L.belt||0);
  const part=(list,mat)=>{const m=new THREE.Mesh(E.pint?boxesC(list.map(b=>b.slice(0,7))):rboxes(list),mat||E.mat||decoMat);m.castShadow=true;return m};
  const g=new THREE.Group();
  // nogi (biodro na 0,74)
  const leg=x=>{const p=new THREE.Group();p.position.set(x,0.74,0);p.add(part([[0,-0.2,0,0.21,0.38,0.24,pan],[0,-0.47,0,0.19,0.2,0.215,pan],[0,-0.35,0.118,0.11,0.09,0.012,panD,0],
    [0,-0.6,0.025,0.225,0.25,0.3,boo],[0,-0.475,0.005,0.245,0.065,0.265,booD],[0,-0.7165,0.035,0.235,0.047,0.32,'#2a1c12'],[0,-0.6,0.176,0.1,0.05,0.012,booD,0],[0,-0.42,0.13,0.12,0.03,0.012,panD,0],[0.07,-0.52,0.163,0.05,0.04,0.012,'#b8963a',0],[0,-0.52,0.162,0.235,0.025,0.012,booD,0],[0,-0.7,0.19,0.2,0.03,0.012,booD,0],[0.11,-0.2,0,0.012,0.34,0.2,panD,0]]));return p};
  const ll=leg(-0.135*bw),rl=leg(0.135*bw);
  // tułów
  const torso=new THREE.Group();torso.position.y=0.74;
  const tl=[[0,0.33,0,0.55*bw,0.54,0.31,tun],[0,0.46,0,0.64*bw,0.2,0.32,tun],[0.17*bw,0.6,0,0.2,0.07,0.27,tunD],[-0.17*bw,0.6,0,0.2,0.07,0.27,tunD],[0,0.36,0.158,0.34*bw,0.18,0.012,tunL,0],[0,0.005,0,0.555*bw,0.2,0.325,tun],[0,0.105,0,0.585*bw,0.085,0.35,belt],[0,0.105,0.177,0.1,0.075,0.02,'#d9b23a',0],
    [0.2*bw,0.015,0.17,0.12,0.14,0.07,darker(belt,1.3)],[0,0.585,0.015,0.39,0.075,0.32,tunD],[0,0.53,0.152,0.12,0.08,0.012,skin,0],[0,0.41,0.153,0.022,0.17,0.012,'#e6dcc4',0],
    [0,-0.085,0,0.565*bw,0.035,0.335,tunD],[0,0.47,0.155,0.012,0.11,0.01,'#4a3020',0],[0.025,0.5,0.156,0.04,0.012,0.008,'#4a3020',0],[-0.025,0.44,0.156,0.04,0.012,0.008,'#4a3020',0],
    [0.255*bw,0.3,0,0.012,0.44,0.29,tunD,0],[-0.255*bw,0.3,0,0.012,0.44,0.29,tunD,0],[0,0.585,-0.16,0.36,0.06,0.012,tunD,0],[0,0.25,0.152,0.4*bw,0.01,0.008,tunL,0]];
  {const t2=col(CLOTHC,L.tunic2==null?9:L.tunic2),tp=L.tpat|0;if(tp===1)for(let k=0;k<4;k++){tl.push([0,0.48-k*0.13,0.158,0.56*bw,0.045,0.012,t2,0],[0,0.48-k*0.13,-0.158,0.56*bw,0.045,0.012,t2,0])}
   if(tp===2)tl.push([0,-0.07,0.17,0.57*bw,0.05,0.012,t2,0],[0,0.585,0.17,0.4,0.05,0.012,t2,0],[0,0.33,0.159,0.05,0.5,0.012,t2,0]);if(tp===3)tl.push([-0.14*bw,0.3,0.158,0.27*bw,0.66,0.012,t2,0],[-0.14*bw,0.3,-0.158,0.27*bw,0.66,0.012,t2,0]);if(tp===4)for(let i=0;i<3;i++)for(let j=0;j<3;j++)if((i+j)%2)tl.push([(-0.18+i*0.18)*bw,0.5-j*0.18,0.158,0.17*bw,0.17,0.012,t2,0]);if(tp===5)tl.push([0,0.33,0.159,0.2,0.3,0.012,t2,0],[0,0.36,0.161,0.08,0.18,0.012,'#d9b23a',0])}
  if(L.acc==='naszyjnik')tl.push([0,0.54,0.16,0.3,0.03,0.02,col(ACCC,L.accC||0),0],[0,0.47,0.165,0.07,0.08,0.02,col(ACCC,L.accC||0),0]);if(L.acc==='szal')tl.push([0,0.6,0.02,0.44,0.1,0.36,col(ACCC,L.accC||0)],[0.12,0.42,0.17,0.1,0.26,0.03,col(ACCC,L.accC||0),0]);
  if(fem||E.dress)tl.push([0,-0.17,0,0.64*bw,0.52,0.43,tun],[0,-0.42,0,0.665*bw,0.065,0.455,tunD],[0,0.0,0.217,0.3,0.12,0.012,tunL,0]);
  if(E.apron)tl.push([0,0.13,0.19,0.44,0.56,0.035,'#5a3a22'],[0,0.45,0.19,0.3,0.03,0.04,'#3a2412',0]);
  if(E.pack)tl.push([0,0.34,-0.255,0.44,0.5,0.2,'#6b4a2b'],[0,0.64,-0.255,0.48,0.12,0.14,'#8a6a3a'],[0.14,0.36,0.157,0.05,0.48,0.012,'#4a3020',0],[-0.14,0.36,0.157,0.05,0.48,0.012,'#4a3020',0]);
  if(E.armor)tl.push([0,0.35,0,0.58*bw,0.44,0.36,E.armor],[0,0.57,0,0.62*bw,0.09,0.38,darker(E.armor,0.8)],[0,0.2,0.188,0.3,0.48,0.02,'#a8352a',0],[0,0.3,0.2,0.12,0.12,0.012,'#d9b23a',0]);
  if(E.ribs)for(let k=0;k<4;k++)tl.push([0,0.48-k*0.1,0.153,0.4,0.035,0.012,'#5a5246',0]);
  if(E.wraps)for(let k=0;k<5;k++)tl.push([0,0.52-k*0.11,0.153,0.5,0.03,0.012,darker(tun,0.82),0],[0.25,0.47-k*0.11,0,0.012,0.03,0.28,darker(tun,0.82),0]);
  if(E.robe)tl.push([0,-0.2,0,0.6*bw,0.58,0.4,tun],[0,-0.47,0,0.62*bw,0.06,0.42,'#d9b23a'],[0,0.3,0.162,0.06,0.5,0.012,'#d9b23a',0]);
  torso.add(part(tl));
  // głowa (szyja na 0,6 od tułowia) — duża jak w Cube World
  const head=new THREE.Group();head.position.y=0.6;
  const hl=E.pint?[[0,0.04,0,0.18,0.1,0.18,skin],[0,0.3,0,0.5,0.48,0.46,skin],[0.11,0.31,0.235,0.08,0.09,0.02,E.skull?(E.glow||'#ff5a2a'):'#101010'],[-0.11,0.31,0.235,0.08,0.09,0.02,E.skull?(E.glow||'#ff5a2a'):'#101010'],[0.11,0.385,0.236,0.13,0.03,0.02,hairD],[-0.11,0.385,0.236,0.13,0.03,0.02,hairD],[0,0.2,0.245,0.06,0.07,0.04,skinD],[0,0.13,0.236,0.1,0.025,0.02,E.skull?'#3a3228':'#6a3a2a']]:[[0,0.04,0,0.18,0.1,0.18,skin],[0,0.31,0,0.5,0.5,0.48,skin],
    [0.115,0.3,0.245,0.13,0.115,0.02,'#f8f6f0',0],[-0.115,0.3,0.245,0.13,0.115,0.02,'#f8f6f0',0],[0.105,0.293,0.257,0.075,0.095,0.02,eye,0],[-0.105,0.293,0.257,0.075,0.095,0.02,eye,0],
    [0.1,0.288,0.268,0.035,0.05,0.01,'#141414',0],[-0.1,0.288,0.268,0.035,0.05,0.01,'#141414',0],[0.084,0.318,0.274,0.026,0.026,0.01,'#ffffff',0],[-0.116,0.318,0.274,0.026,0.026,0.01,'#ffffff',0],
    [0.115,0.39,0.249,0.15,0.035,0.02,hairD,0],[-0.115,0.39,0.249,0.15,0.035,0.02,hairD,0],[0,0.215,0.256,0.07,0.085,0.04,skinD,0],[0,0.14,0.245,0.11,0.026,0.014,'#8a4a3a',0],
    [0.18,0.2,0.243,0.07,0.04,0.01,'#e8a090',0],[-0.18,0.2,0.243,0.07,0.04,0.01,'#e8a090',0],[0,0.09,0.238,0.22,0.03,0.01,skinD,0],[0.022,0.18,0.276,0.016,0.016,0.008,darker(skin,0.7),0],[-0.022,0.18,0.276,0.016,0.016,0.008,darker(skin,0.7),0],[0,0.158,0.247,0.08,0.012,0.01,darker(skin,0.8),0],[0,0.02,0.05,0.2,0.06,0.16,skinD,0]];
  if(E.skull&&E.pint){for(const sg of [-1,1])hl.push([sg*0.11,0.31,0.232,0.14,0.13,0.012,'#141414'])}
  if(E.skull&&!E.pint){for(const sg of [-1,1])hl.push([sg*0.115,0.3,0.247,0.14,0.13,0.02,'#141414',0],[sg*0.105,0.29,0.259,0.06,0.06,0.012,E.glow||'#ff5a2a',0]);hl.push([0,0.14,0.247,0.22,0.06,0.012,'#e8e2cc',0],[0,0.14,0.252,0.2,0.012,0.012,'#3a3228',0],[0,0.215,0.257,0.06,0.06,0.02,'#1a1a1a',0])}
  if(fem&&!E.pint)hl.push([0.115,0.364,0.257,0.15,0.018,0.012,'#1a1a1a',0],[-0.115,0.364,0.257,0.15,0.018,0.012,'#1a1a1a',0],[0,0.14,0.247,0.12,0.03,0.014,'#c0505a',0]);
  if(!E.ears&&E.hat!=='helm'&&E.hat!=='kaptur')hl.push([0.258,0.28,0,0.04,0.11,0.08,skinD,0],[-0.258,0.28,0,0.04,0.11,0.08,skinD,0]);
  const H=L.hair,hh=[];
  if(H!=='lysy'&&H!=='irokez')hh.push([0,0.585,0,0.54,0.1,0.52,hair],[0,0.42,-0.255,0.54,0.34,0.065,hair],[0.268,0.44,-0.03,0.05,0.24,0.44,hair,0],[-0.268,0.44,-0.03,0.05,0.24,0.44,hair,0],
    [0,0.535,0.25,0.52,0.08,0.05,hair,0],[0.13,0.482,0.262,0.1,0.075,0.03,hair,0],[-0.07,0.49,0.262,0.15,0.065,0.03,hair,0]);
  if(H==='lysy')hh.push([0.27,0.36,-0.04,0.03,0.12,0.36,hair,0],[-0.27,0.36,-0.04,0.03,0.12,0.36,hair,0],[0,0.36,-0.255,0.5,0.12,0.03,hair,0]);
  if(H==='dlugie')hh.push([0,0.2,-0.275,0.54,0.5,0.08,hair],[0.272,0.24,-0.08,0.06,0.4,0.3,hair,0],[-0.272,0.24,-0.08,0.06,0.4,0.3,hair,0]);
  if(H==='kucyk')hh.push([0,0.45,-0.3,0.14,0.14,0.08,hair],[0,0.26,-0.325,0.12,0.32,0.08,hair],[0,0.44,-0.33,0.15,0.04,0.02,'#c9a24a',0]);
  if(H==='warkocze')hh.push([0.245,0.13,0.05,0.09,0.44,0.09,hair],[-0.245,0.13,0.05,0.09,0.44,0.09,hair],[0.245,-0.11,0.05,0.1,0.05,0.1,'#c9a24a',0],[-0.245,-0.11,0.05,0.1,0.05,0.1,'#c9a24a',0]);
  if(H==='irokez')hh.push([0,0.62,0,0.12,0.16,0.5,hair]);
  if(H==='kok')hh.push([0,0.68,-0.12,0.2,0.16,0.2,hair],[0,0.63,-0.12,0.22,0.03,0.22,'#c9a24a',0]);
  if(H==='loki')for(const [x,y,z] of [[0.27,0.3,-0.1],[-0.27,0.3,-0.1],[0.2,0.2,-0.22],[-0.2,0.2,-0.22],[0,0.22,-0.28],[0.28,0.5,0.1],[-0.28,0.5,0.1],[0.15,0.64,0.1],[-0.15,0.64,-0.1]])hh.push([x,y,z,0.14,0.14,0.14,hair,0]);
  if(H==='grzywka')hh.push([0.05,0.47,0.265,0.42,0.13,0.04,hair,0],[0.2,0.4,0.265,0.12,0.08,0.03,hair,0]);
  if(H==='boki'){hh.length=0;hh.push([0,0.6,-0.02,0.24,0.12,0.5,hair],[0,0.44,-0.26,0.24,0.3,0.05,hair],[0.265,0.42,-0.04,0.03,0.2,0.4,hairD,0],[-0.265,0.42,-0.04,0.03,0.2,0.4,hairD,0])}
  if(H==='dredy'){for(let k=0;k<9;k++){const a=-1.1+k*0.275;hh.push([Math.sin(a)*0.27,0.22,-0.05+Math.cos(a)*-0.22,0.07,0.42,0.07,k%2?hair:hairD,0]);hh.push([Math.sin(a)*0.27,-0.0,-0.05+Math.cos(a)*-0.22,0.075,0.05,0.075,'#c9a24a',0])}}
  if(H==='koki')hh.push([0.17,0.66,-0.05,0.17,0.15,0.17,hair],[-0.17,0.66,-0.05,0.17,0.15,0.17,hair],[0.17,0.6,-0.05,0.19,0.03,0.19,'#c84a3a',0],[-0.17,0.6,-0.05,0.19,0.03,0.19,'#c84a3a',0]);
  if(H==='zaczesane')hh.push([0,0.62,-0.03,0.5,0.06,0.48,hair],[0,0.36,-0.29,0.5,0.24,0.05,hair,0],[0,0.24,-0.28,0.3,0.12,0.05,hairD,0]);
  if(H==='afro'){hh.length=0;hh.push([0,0.63,-0.05,0.72,0.3,0.64,hair],[0.33,0.36,-0.08,0.12,0.32,0.46,hair],[-0.33,0.36,-0.08,0.12,0.32,0.46,hair],[0,0.36,-0.3,0.6,0.32,0.12,hair],[0.18,0.5,0.24,0.14,0.08,0.06,hairD,0],[-0.14,0.5,0.24,0.18,0.07,0.06,hairD,0])}
  if(H==='czub'){hh.length=0;hh.push([0,0.6,-0.05,0.18,0.06,0.3,hair],[0,0.7,-0.14,0.13,0.16,0.13,hair],[0,0.8,-0.14,0.06,0.08,0.06,'#c84a3a',0],[0.265,0.4,-0.04,0.03,0.12,0.38,hairD,0],[-0.265,0.4,-0.04,0.03,0.12,0.38,hairD,0])}
  if(H==='polkucyk')hh.push([0,0.56,-0.29,0.12,0.12,0.08,hair],[0,0.44,-0.32,0.1,0.18,0.07,hair],[0,0.57,-0.33,0.14,0.035,0.02,'#c9a24a',0]);
  {const hc=col(CLOTHC,L.hatC||0),hd=darker(hc,0.78),HT=L.hat||'brak';
   if(HT==='bandana')hh.push([0,0.55,0,0.56,0.12,0.54,hc],[0,0.6,0.01,0.5,0.06,0.5,hc],[0,0.5,-0.29,0.12,0.1,0.06,hd,0],[0.05,0.36,-0.31,0.07,0.22,0.03,hc,0],[-0.05,0.38,-0.31,0.07,0.18,0.03,hc,0]);
   if(HT==='wianek'){for(let q=0;q<12;q++){const a=q/12*Math.PI*2;hh.push([Math.sin(a)*0.29,0.62,Math.cos(a)*0.28,0.08,0.06,0.08,'#4a8a32',0]);if(q%2)hh.push([Math.sin(a)*0.3,0.66,Math.cos(a)*0.29,0.07,0.07,0.07,['#f08ab0','#f8d840','#ffffff','#c8a8f0','#e86a6a','#7ab8ff'][q%6],0])}}
   if(HT==='kaptur'){hh.length=0;hh.push([0,0.6,-0.02,0.56,0.1,0.54,hc],[0,0.38,-0.282,0.56,0.46,0.065,hc],[0.276,0.38,-0.02,0.04,0.44,0.52,hc,0],[-0.276,0.38,-0.02,0.04,0.44,0.52,hc,0],[0,0.53,0.247,0.51,0.06,0.014,hair,0],[0,0.52,-0.34,0.18,0.18,0.08,hc],[0,0.6,0.27,0.58,0.06,0.04,hd,0])}
   if(HT==='piora')hh.push([0,0.5,0,0.56,0.05,0.54,hc,0],[0.27,0.62,-0.06,0.04,0.26,0.06,'#e8e2cc',0],[0.27,0.78,-0.08,0.03,0.12,0.05,'#a8302a',0],[0.24,0.58,-0.1,0.03,0.2,0.05,'#3a6ad8',0]);
   if(HT==='kapelusz'){hh.length=0;hh.push([0,0.58,0,0.82,0.05,0.82,hc],[0,0.68,0,0.5,0.16,0.48,hc],[0,0.62,0,0.52,0.04,0.5,hd,0],[0.22,0.76,-0.12,0.04,0.28,0.06,'#e8e2cc',0],[0,0.4,-0.256,0.52,0.32,0.03,hair,0],[0.257,0.46,-0.04,0.014,0.18,0.42,hair,0],[-0.257,0.46,-0.04,0.014,0.18,0.42,hair,0],[0,0.53,0.247,0.51,0.06,0.014,hair,0])}
   if(HT==='beret')hh.push([0.03,0.6,0,0.58,0.08,0.54,hc],[0.03,0.655,0,0.48,0.05,0.46,hc],[0.05,0.695,0,0.06,0.04,0.06,hd,0]);
   if(HT==='diadem')hh.push([0,0.52,0,0.555,0.04,0.535,'#d9b23a',0],[0,0.57,0.27,0.07,0.08,0.02,'#d9b23a',0],[0,0.57,0.282,0.04,0.04,0.012,col(EYEC,L.eyes),0])}
  {const HC=col(HORNC,L.hornC||0),HD=darker(HC,0.8),HR=L.horns||'brak';
   if(HR==='male')for(const sg of [-1,1])hl.push([sg*0.16,0.6,0.12,0.08,0.08,0.08,HC,0],[sg*0.17,0.66,0.12,0.05,0.06,0.05,HD,0]);
   if(HR==='baranie')for(const sg of [-1,1])hl.push([sg*0.27,0.5,0.02,0.1,0.1,0.14,HC],[sg*0.32,0.46,-0.12,0.1,0.14,0.1,HC],[sg*0.32,0.33,-0.08,0.1,0.12,0.1,HD],[sg*0.31,0.29,0.06,0.09,0.09,0.1,HC],[sg*0.3,0.36,0.14,0.07,0.07,0.07,HD,0]);
   if(HR==='demoniczne')for(const sg of [-1,1])hl.push([sg*0.18,0.62,0.06,0.09,0.12,0.09,HC],[sg*0.2,0.72,-0.02,0.075,0.12,0.075,HC],[sg*0.21,0.8,-0.1,0.06,0.1,0.06,HD],[sg*0.21,0.86,-0.18,0.045,0.08,0.045,HD,0]);
   if(HR==='jelenie')for(const sg of [-1,1])hl.push([sg*0.16,0.66,0,0.05,0.16,0.05,HC,0],[sg*0.24,0.76,-0.02,0.18,0.04,0.04,HC,0],[sg*0.3,0.86,-0.02,0.04,0.18,0.04,HC,0],[sg*0.2,0.84,-0.02,0.04,0.12,0.04,HD,0],[sg*0.34,0.94,-0.04,0.04,0.1,0.04,HD,0]);
   if(HR==='jednorozec')hl.push([0,0.66,0.18,0.08,0.12,0.08,HC],[0,0.76,0.2,0.06,0.1,0.06,HC],[0,0.84,0.22,0.035,0.08,0.035,HD,0])}
  if(!E.pint){const tc=col(PAINTC,L.tatC||0),TT=L.tattoo||'brak';
   if(TT==='runy')hl.push([0,0.45,0.252,0.04,0.07,0.012,tc,0],[0,0.47,0.252,0.1,0.02,0.012,tc,0],[0.17,0.22,0.249,0.02,0.07,0.012,tc,0],[0.2,0.22,0.249,0.02,0.05,0.012,tc,0],[-0.17,0.22,0.249,0.02,0.07,0.012,tc,0],[-0.2,0.24,0.249,0.05,0.02,0.012,tc,0]);
   if(TT==='plemienny')hl.push([0.17,0.3,0.25,0.025,0.2,0.012,tc,0],[0.2,0.2,0.25,0.06,0.025,0.012,tc,0],[0.21,0.38,0.25,0.06,0.025,0.012,tc,0],[0.25,0.28,0.12,0.012,0.18,0.14,tc,0]);
   if(TT==='lza')hl.push([-0.115,0.22,0.25,0.035,0.05,0.012,tc,0]);
   if(TT==='gwiazda')hl.push([0.14,0.43,0.252,0.07,0.02,0.012,tc,0],[0.14,0.43,0.252,0.02,0.07,0.012,tc,0]);
   if(L.freckles)for(const [x,y] of [[0.14,0.23],[0.18,0.25],[0.21,0.22],[0.16,0.2],[-0.14,0.23],[-0.18,0.25],[-0.21,0.22],[-0.16,0.2],[0.04,0.24],[-0.04,0.24]])hl.push([x,y,0.249,0.022,0.022,0.012,darker(skin,0.72),0])}
  const hlB0=hl.length;  const B=L.beard,bh=(L.beardC!=null&&L.beardC>=0)?col(HAIRC,L.beardC):hair,bhD=darker(bh,0.8);
  if(B==='pelna')hl.push([0,0.08,0.225,0.5,0.34,0.1,bh],[0.24,0.24,0.16,0.08,0.3,0.18,bh,0],[-0.24,0.24,0.16,0.08,0.3,0.18,bh,0],[0,-0.13,0.22,0.4,0.16,0.08,bh],[0.08,0.175,0.27,0.14,0.05,0.02,bh,0],[-0.08,0.175,0.27,0.14,0.05,0.02,bh,0]);
  if(B==='podkrecane')hl.push([0.09,0.172,0.264,0.15,0.035,0.02,bh,0],[-0.09,0.172,0.264,0.15,0.035,0.02,bh,0],[0.17,0.2,0.264,0.03,0.07,0.02,bh,0],[-0.17,0.2,0.264,0.03,0.07,0.02,bh,0],[0.19,0.235,0.264,0.03,0.03,0.02,bh,0],[-0.19,0.235,0.264,0.03,0.03,0.02,bh,0]);
  if(B==='kotwica')hl.push([0,0.08,0.24,0.12,0.12,0.05,bh],[0.12,0.09,0.24,0.14,0.03,0.03,bh,0],[-0.12,0.09,0.24,0.14,0.03,0.03,bh,0],[0.08,0.175,0.262,0.13,0.035,0.02,bh,0],[-0.08,0.175,0.262,0.13,0.035,0.02,bh,0]);
  if(B==='zarost')hl.push([0,0.15,0.236,0.42,0.14,0.016,bhD,0]);
  if(B==='krotka')hl.push([0,0.11,0.225,0.44,0.2,0.08,bh],[0.21,0.25,0.2,0.06,0.2,0.1,bh,0],[-0.21,0.25,0.2,0.06,0.2,0.1,bh,0]);
  if(B==='dluga')hl.push([0,0.06,0.225,0.44,0.3,0.08,bh],[0,-0.14,0.225,0.32,0.18,0.07,bh],[0,-0.27,0.215,0.18,0.1,0.06,bh],[0.21,0.25,0.2,0.06,0.2,0.1,bh,0],[-0.21,0.25,0.2,0.06,0.2,0.1,bh,0]);
  if(B==='bokobrody')hl.push([0.235,0.26,0.17,0.07,0.24,0.14,bh,0],[-0.235,0.26,0.17,0.07,0.24,0.14,bh,0],[0.2,0.14,0.2,0.1,0.08,0.1,bh,0],[-0.2,0.14,0.2,0.1,0.08,0.1,bh,0]);
  if(B==='kozia')hl.push([0,0.07,0.24,0.14,0.14,0.06,bh],[0,0.16,0.254,0.2,0.03,0.02,bhD,0]);
  if(B==='warkocz')hl.push([0,0.08,0.225,0.44,0.24,0.08,bh],[0,-0.12,0.23,0.12,0.2,0.08,bh],[0,-0.25,0.23,0.1,0.08,0.08,'#c9a24a',0],[0,-0.32,0.23,0.08,0.08,0.07,bh],[0.21,0.25,0.2,0.06,0.2,0.1,bh,0],[-0.21,0.25,0.2,0.06,0.2,0.1,bh,0]);
  if(B==='kozia'||B==='warkocz')hl.push([0.08,0.175,0.262,0.13,0.04,0.02,bh,0],[-0.08,0.175,0.262,0.13,0.04,0.02,bh,0]);
  const bl=hl.splice(hlB0,hl.length-hlB0);
  if(!E.pint){if(L.brows===1)hl.push([0.115,0.415,0.252,0.17,0.05,0.02,hairD,0],[-0.115,0.415,0.252,0.17,0.05,0.02,hairD,0]);if(L.brows===2)hl.push([0.12,0.405,0.252,0.15,0.035,0.02,hairD,0],[-0.12,0.405,0.252,0.15,0.035,0.02,hairD,0],[0.06,0.39,0.253,0.05,0.03,0.02,hairD,0],[-0.06,0.39,0.253,0.05,0.03,0.02,hairD,0]);
    const pc=col(PAINTC,L.paintC||0);if(L.paint==='pasy')hl.push([0.12,0.27,0.248,0.16,0.035,0.012,pc,0],[-0.12,0.27,0.248,0.16,0.035,0.012,pc,0],[0.12,0.23,0.248,0.12,0.03,0.012,pc,0],[-0.12,0.23,0.248,0.12,0.03,0.012,pc,0]);
    if(L.paint==='maska')hl.push([0,0.31,0.247,0.48,0.12,0.01,pc,0]);if(L.paint==='kropki')for(const [x,y] of [[0.15,0.25],[0.2,0.22],[-0.15,0.25],[-0.2,0.22],[0,0.45]])hl.push([x,y,0.249,0.04,0.04,0.012,pc,0]);
    if(L.scar==='policzek')hl.push([-0.15,0.24,0.249,0.03,0.14,0.012,'#b0605a',0],[-0.15,0.24,0.25,0.09,0.02,0.012,'#b0605a',0]);if(L.scar==='oko')hl.push([0.115,0.33,0.252,0.03,0.24,0.012,'#b0605a',0]);
    if(L.patch)hl.push(/* v151: opaska zasłania lewe oko, rzemyk biegnie skośnie przez czoło */[-0.115,0.296,0.274,0.155,0.14,0.022,'#1e1a17',0],[-0.115,0.296,0.287,0.11,0.095,0.006,'#2c2621',0],[-0.19,0.375,0.262,0.035,0.05,0.02,'#2a2420',0],[-0.04,0.375,0.262,0.035,0.05,0.02,'#2a2420',0],[-0.02,0.415,0.252,0.18,0.025,0.02,'#2a2420',0],[0.12,0.44,0.252,0.14,0.025,0.02,'#2a2420',0],[-0.215,0.355,0.235,0.05,0.025,0.03,'#2a2420',0],[0.25,0.44,0.05,0.02,0.025,0.4,'#2a2420',0],[-0.25,0.355,0.05,0.02,0.025,0.4,'#2a2420',0]);
    if(L.ears==='elfie')hl.push([0.28,0.33,-0.01,0.05,0.14,0.08,skin,0],[-0.28,0.33,-0.01,0.05,0.14,0.08,skin,0],[0.31,0.43,-0.04,0.04,0.12,0.05,skin,0],[-0.31,0.43,-0.04,0.04,0.12,0.05,skin,0]);
    if(L.ears==='orcze')hl.push([0.29,0.32,-0.01,0.07,0.16,0.12,skin,0],[-0.29,0.32,-0.01,0.07,0.16,0.12,skin,0],[0.1,0.13,0.262,0.05,0.09,0.02,'#f2ead8',0],[-0.1,0.13,0.262,0.05,0.09,0.02,'#f2ead8',0]);
    const ac=col(ACCC,L.accC||0);if(L.acc==='kolczyki')hl.push([0.27,0.22,0.02,0.04,0.06,0.04,ac,0],[-0.27,0.22,0.02,0.04,0.06,0.04,ac,0]);if(L.acc==='opaska')hh.push([0,0.5,0,0.555,0.06,0.535,ac,0]);}
  if(B==='wasy'||B==='dluga'){const bh=(L.beardC!=null&&L.beardC>=0)?col(HAIRC,L.beardC):hair;bl.push([0.08,0.175,0.262,0.13,0.04,0.02,bh,0],[-0.08,0.175,0.262,0.13,0.04,0.02,bh,0])}
  if(E.ears)for(const sg of [1,-1])hl.push([sg*0.275,0.31,0,0.05,0.15,0.13,skin,0],[sg*0.31,0.38,-0.04,0.05,0.13,0.11,skin,0],[sg*0.35,0.46,-0.08,0.045,0.12,0.09,skin,0],[sg*0.385,0.54,-0.12,0.04,0.1,0.07,skin,0],[sg*0.41,0.61,-0.15,0.035,0.07,0.05,skin,0],[sg*0.3,0.34,0.01,0.012,0.09,0.07,skinD,0]);
  if(E.tusks){hl.push([0,0.1,0.25,0.42,0.09,0.06,skinD,0],[0,0.415,0.258,0.44,0.05,0.035,skinD,0],[0,0.3,0.27,0.13,0.08,0.05,skinD,0]);for(const sg of [1,-1])hl.push([sg*0.12,0.17,0.285,0.06,0.15,0.05,'#f2ead8',0],[sg*0.13,0.25,0.29,0.045,0.06,0.04,'#e8dcc0',0],[sg*0.27,0.34,-0.02,0.05,0.12,0.1,skin,0],[sg*0.31,0.41,-0.05,0.04,0.09,0.07,skin,0])}
  if(E.hat==='kupiec')hl.push([0,0.59,0,0.58,0.07,0.56,'#a8452f'],[0,0.69,0,0.44,0.16,0.42,'#a8452f'],[0,0.64,0.215,0.44,0.05,0.04,'#d9b23a',0],[0.17,0.79,-0.06,0.04,0.22,0.04,'#f2efe6',0]);
  if(E.hat==='helm')hl.push([0,0.57,0,0.58,0.16,0.56,'#8a8f94'],[0,0.67,0,0.42,0.1,0.42,'#9aa0a6'],[0,0.4,0.29,0.07,0.24,0.04,'#8a8f94',0],[0.285,0.36,0.06,0.05,0.28,0.3,'#7f848a',0],[-0.285,0.36,0.06,0.05,0.28,0.3,'#7f848a',0],[0,0.75,0,0.06,0.08,0.4,'#a8352a',0]);
  if(E.hat==='kaptur')hl.push([0,0.6,-0.02,0.56,0.1,0.54,tunD],[0,0.38,-0.282,0.56,0.46,0.065,tunD],[0.276,0.38,-0.02,0.04,0.44,0.52,tunD,0],[-0.276,0.38,-0.02,0.04,0.44,0.52,tunD,0],[0,0.52,-0.34,0.18,0.18,0.08,tunD]);
  if(E.hat==='korona')hl.push([0,0.6,0,0.52,0.07,0.5,'#d9b23a'],[0.2,0.67,0.2,0.07,0.09,0.07,'#d9b23a',0],[-0.2,0.67,0.2,0.07,0.09,0.07,'#d9b23a',0],[0,0.67,0.23,0.07,0.09,0.05,'#d9b23a',0],[0,0.62,0.255,0.06,0.04,0.02,'#b8302a',0]);
  if(E.hat==='slomkowy')hl.push([0,0.575,0,0.8,0.05,0.8,'#d8b24a'],[0,0.65,0,0.5,0.12,0.48,'#c9a24a'],[0,0.605,0,0.52,0.04,0.5,'#a8452f',0]);
  if(E.hat==='nemes')hl.push([0,0.6,0,0.58,0.12,0.56,'#2f5f8f'],[0,0.6,0.005,0.6,0.04,0.58,'#d9b23a',0],[0.3,0.32,-0.02,0.06,0.52,0.42,'#2f5f8f'],[-0.3,0.32,-0.02,0.06,0.52,0.42,'#2f5f8f'],[0.3,0.32,0.0,0.07,0.04,0.44,'#d9b23a',0],[-0.3,0.32,0.0,0.07,0.04,0.44,'#d9b23a',0],[0,0.7,0.24,0.08,0.12,0.06,'#d9b23a',0]);
  if(E.hat==='chusta')hl.push([0,0.595,0,0.56,0.1,0.54,tunL],[0,0.44,-0.27,0.56,0.3,0.06,tunL],[0,0.3,-0.31,0.12,0.14,0.06,tunL,0]);
  /* v138: czepek z włosów — widoczny pod hełmem/kapeluszem, żeby nie było widać łysej głowy */
  const HCAP=(H!=='lysy'&&H!=='irokez')?[[0,0.565,0,0.37,0.016,0.35,hair],[0,0.41,-0.247,0.37,0.3,0.014,hair,0],[0.257,0.46,-0.01,0.014,0.16,0.31,hair,0],[-0.257,0.46,-0.01,0.014,0.16,0.31,hair,0],[0,0.525,0.247,0.37,0.05,0.014,hair,0]]:[];
  if(E.hat&&E.hat!=='korona'){hh.length=0;hl.push(...HCAP)}
  hl.push([0,0.03,0,0.27,0.14,0.25,skin],[0,0.0,0.06,0.22,0.06,0.16,skinD,0]);if(window.__HD)window.__HD.push({hl:hl.map(b=>b.slice(0,7)),hh:hh.map(b=>b.slice(0,7)),tl:tl.map(b=>b.slice(0,7))});head.add(part(hl));if(bl.length){/* v134: broda osobno — pod hełmem chowa się do środka, żeby nie przebijała bocznych osłon */const blT=bl.filter(b=>b[1]-b[4]/2>=0.0),blL=bl.filter(b=>b[1]-b[4]/2<0.0);const bm=part(blT.length?blT:bl);if(blT.length&&blL.length){/* v151: dolna część brody osobno — przy zbroi wysuwa się przed pierś zamiast w nią wchodzić */const lo=part(blL);lo.position.z=0.02;bm.add(lo);bm.userData.low=lo}bm.userData.beard=1;bm.userData.noLayer=1;head.add(bm);head.userData.beardM=bm}if(hh.length){const hm=part(hh);hm.userData.hair=1;head.add(hm);head.userData.hairM=hm}if(HCAP.length&&!(E.hat&&E.hat!=='korona')){const cm=part(HCAP);cm.visible=false;cm.userData.hairCap=1;cm.userData.noLayer=1;head.add(cm);head.userData.hairCapM=cm}torso.add(head);
  // ręce: bark -> łokieć -> dłoń z kciukiem
  const hand=E.gloves||skin;
  const arm=sg=>{const sh=new THREE.Group();sh.position.set(sg*0.385*bw,0.53,0);
    const ul=[[0,-0.13,0,0.205,0.3,0.225,tun],[0,-0.005,0,0.25,0.15,0.265,tunD],[0,0.04,0,0.22,0.06,0.24,tun]];if(E.armor)ul.push([0,0.03,0,0.27,0.13,0.28,E.armor]);sh.add(part(ul));
    const el=new THREE.Group();el.position.y=-0.28;el.add(part([[0,-0.1,0,0.16,0.22,0.18,tun],[0,-0.2,0,0.18,0.06,0.2,tunD],[0,-0.29,0.01,0.15,0.13,0.16,hand],[-sg*0.085,-0.27,0.06,0.05,0.07,0.06,hand,0],[0,-0.215,0,0.175,0.03,0.195,tunL,0],[0,-0.335,0.065,0.13,0.025,0.035,darker(hand,0.85),0],[0,-0.355,0.02,0.14,0.03,0.12,hand,0]]));sh.add(el);torso.add(sh);return[sh,el]};
  const [ra,re]=arm(1),[la,le]=arm(-1);
  // peleryna
  let cape=null;if(L.cape){const cc=col(CLOTHC,L.capeC),cs=L.cape;cape=new THREE.Group();cape.position.set(0,0.58,-0.17);cape.userData.hb=cs===3?[-0.215,0.62*bw+0.006,0.41,-0.0465]:cs===2?[-0.49,0.66*bw+0.006,0.96,-0.059]:[-0.425,0.6*bw+0.006,0.83,-0.0465];/* v150: herb na całej pelerynie */
    if(cs===3)cape.add(part([[0,-0.22,-0.02,0.62*bw,0.44,0.045,cc],[0,-0.44,-0.02,0.64*bw,0.05,0.05,darker(cc,0.7)],[0,0,-0.01,0.66*bw,0.12,0.12,darker(cc,0.75)],[0.2,0.0,0.06,0.07,0.07,0.04,'#c4ccd2',0]]));
    else if(cs===2)cape.add(part([[0,-0.5,-0.03,0.66*bw,1.0,0.05,cc],[0,-1.0,-0.03,0.68*bw,0.05,0.06,darker(cc,0.7)],[0,0.02,-0.01,0.6*bw,0.1,0.12,darker(cc,0.8)],[0,0.1,-0.06,0.44,0.22,0.1,darker(cc,0.85)],[0.2,0.0,0.06,0.07,0.07,0.04,'#d9b23a',0],[-0.2,0.0,0.06,0.07,0.07,0.04,'#d9b23a',0]]));
    else cape.add(part([[0,-0.44,-0.02,0.6*bw,0.88,0.045,cc],[0,-0.86,-0.02,0.62*bw,0.05,0.05,darker(cc,0.7)],[0,0,-0.01,0.62*bw,0.09,0.09,darker(cc,0.75)],[0.2,0.0,0.06,0.07,0.07,0.04,'#d9b23a',0]]));torso.add(cape)}
  // lustro w osi X: „prawa” ręka modelu (ra) jest anatomicznie prawą — broń zawsze w prawej dłoni, tarcza w lewej
  const mir=new THREE.Group();mir.scale.x=-1;mir.add(ll,rl,torso);g.add(mir);
  // v133: proporcje „Bohater” — mniejsza głowa, wyższy tułów, szersze barki, dłuższe ręce i nogi
  const PR=CHARPR;{const k=PR;for(const l of [ll,rl]){l.position.x*=1+(k.tw-1)*0.5;l.position.y=0.74*k.ll;l.scale.y=k.ll}torso.position.y=0.74*k.ll;torso.children[0].scale.set(k.tw,k.th,k.td);head.position.y=0.6*k.th;head.scale.setScalar(k.hs);
   for(const [a,e] of [[la,le],[ra,re]]){a.position.x*=k.tw;a.position.y=0.53*k.th;a.children[0].scale.set(k.aw,k.al,k.aw);e.position.y=-0.28*k.al;e.children[0].scale.set(k.aw,k.al,k.aw)}
   if(cape){cape.position.y=0.58*k.th;cape.scale.set(k.tw,(k.th+k.ll)/2,1)}torso.userData.prs=[k.tw,k.th,k.td];for(const a of [la,ra,le,re])a.userData.prs=[k.aw,k.al,k.aw]}
  g.userData={ll,rl,la,ra,le,re,torso,head,cape,phase:0,look:L,mir,ty0:0.74*PR.ll,pr:PR};if(L.ht!==1&&L.ht!=null)g.scale.setScalar([0.92,1,1.08,0.84,1.15][L.ht]||1);
  return g;
}
// ---------- chód / bieg / pływanie ----------
function wmPivot(m,th,dz){m.rotation.x=th;m.position.set(0,-0.3+0.3*Math.cos(th),0.3*Math.sin(th)+(dz||0))}// obrót broni wokół dłoni (y=-0.3)
function animChar(g,speed,dt,air,swim){animChar0(g,speed,dt,air,swim);const u=g.userData;
  // postawa gotowości z bronią dwuręczną: obie dłonie przy środku tułowia, broń skośnie w górę
  if(u.two&&u.wm&&!swim&&!air&&u.ra&&u.re){u.rdy=Math.min(1,(u.rdy||0)+dt*5);const k=u.rdy,s=Math.sin(u.phase||0)*Math.min(1,speed/6)*0.12,L=(a,b)=>a+(b-a)*k;const kz=/^kusza/.test(u.wkey||'');/* garda: łokcie na zewnątrz tułowia, dłonie przed klatką */u.ra.rotation.set(L(u.ra.rotation.x,(kz?-0.95:-1.2)+s*0.5),L(u.ra.rotation.y,0.1),L(u.ra.rotation.z,-0.6));u.re.rotation.x=L(u.re.rotation.x,kz?-0.05:-0.5)}else if(u.rdy)u.rdy=0}
function animChar0(g,speed,dt,air,swim){
  {const u0=g.userData;if(u0._kb){u0._kb=0;u0.ikOff=false;if(u0.wm)wmPivot(u0.wm,u0.wm.rotation.x*0.4,0)}else if(u0.wm&&u0.wm.rotation.x){const r=u0.wm.rotation.x*0.7;wmPivot(u0.wm,Math.abs(r)<0.01?0:r,0)}}
  const u=g.userData,k=Math.min(1,dt*14),R=(o,x,y,z)=>{if(!o)return;o.rotation.x+=(x-o.rotation.x)*k;o.rotation.y+=((y||0)-o.rotation.y)*k;o.rotation.z+=((z||0)-o.rotation.z)*k};
  const run=Math.min(1,Math.max(0,(speed-3.5)/4));u.phase+=dt*(speed>0.3?(2.4+speed*1.15):1.2);
  const s=Math.sin(u.phase),c=Math.cos(u.phase);
  if(swim){/* v124: nowa animacja pływania — kraul w poziomie, nurkowanie z pochyleniem, spokojne utrzymywanie się na wodzie */const mv=Math.min(1,speed/3.0),vy=u.vy||0,dive=Math.max(-0.55,Math.min(0.55,-vy*0.12));
    u.swP=(u.swP||0)+((mv*1.5+(mv>0.15?dive:0))-(u.swP||0))*Math.min(1,dt*3.5);u.swT=(u.swT||0)+dt*(1.4+speed*0.6);const t=u.swT;
    if(mv>0.15){/* v139: kraul — wolny wiosłujący ruch pod wodą (60% cyklu), szybki powrót nad wodą łukiem z ugiętym łokciem, przetaczanie tułowia, oddech co drugi ruch */
      const TW=Math.PI*2,arm=(ph,sg)=>{const q=((ph%TW)+TW)%TW/TW;let a,pull,rec;if(q<0.6){pull=q/0.6;a=pull*Math.PI;rec=-1}else{rec=(q-0.6)/0.4;a=Math.PI+rec*Math.PI;pull=-1}
        return{x:-Math.PI+a,z:sg*(pull>=0?0.08+Math.sin(pull*Math.PI)*0.12:0.2+Math.sin(rec*Math.PI)*0.62),el:pull>=0?-0.15-Math.sin(pull*Math.PI)*0.75:-0.25-Math.sin(rec*Math.PI)*1.15,pull,rec}};
      const A=arm(t,-1),B=arm(t+Math.PI,1);
      u.la.rotation.set(A.x,0,A.z);u.ra.rotation.set(B.x,0,B.z);R(u.le,A.el);R(u.re,B.el);
      const kk=Math.sin(t*3.0)*0.3;R(u.ll,0.1+kk);R(u.rl,0.1-kk);
      const roll=Math.sin(t+Math.PI*0.3)*0.42;u.torso.rotation.x+=(0.04-u.torso.rotation.x)*k;u.torso.rotation.z+=(0-u.torso.rotation.z)*k;u.torso.rotation.y=roll;u.swim0=1;
      const cyc=Math.floor(t/TW),br=cyc%2===0&&A.rec>=0?Math.sin(A.rec*Math.PI):0;
      if(u.head)R(u.head,-1.2+br*0.25,-roll*0.6-br*0.95,0)}
    else{// utrzymywanie się: ciało pionowo, dłonie zataczają ósemki, nogi „rowerek"
      const sc=Math.sin(t*2.4),cc=Math.cos(t*2.4);R(u.la,-0.35+cc*0.15,0,-1.05-sc*0.3);R(u.ra,-0.35-cc*0.15,0,1.05+sc*0.3);R(u.le,-0.7);R(u.re,-0.7);R(u.ll,0.55+Math.sin(t*2)*0.45);R(u.rl,0.55-Math.sin(t*2)*0.45);R(u.torso,0.05,0,0);if(u.head)R(u.head,-0.05,0,0)}
    g.rotation.order='YXZ';g.rotation.x=u.swP;g.position.y+=0.5*Math.min(1,u.swP)+Math.sin(t*1.3)*0.05;u.torso.position.y=(u.ty0||0.74);if(u.cape)u.cape.rotation.x=0.05+Math.sin(t*2.2)*0.04;/* v151: peleryna leży na plecach przy pływaniu */return}
  if(u.swP>0.01){u.swP*=Math.max(0,1-dt*8);g.rotation.x=u.swP;if(u.swP<0.02){u.swP=0;g.rotation.x=0}}
  if(u.swim0){u.swim0=0;if(u.torso)u.torso.rotation.y=0}
  if(air){u.wasAir=1;const vy=u.vy??-1;
    if(vy>1.5){R(u.la,-2.3,0,-0.3);R(u.ra,-2.0,0,0.3);R(u.ll,-1.05);R(u.rl,0.45);R(u.le,-0.45);R(u.re,-0.6);R(u.torso,0.14,0,0)}
    else{R(u.la,-0.8,0,-0.95);R(u.ra,-0.8,0,0.95);R(u.ll,-0.45);R(u.rl,-0.1);R(u.le,-0.5);R(u.re,-0.5);R(u.torso,-0.06,0,0)}
    u.torso.position.y+=(0.74-u.torso.position.y)*k;if(u.cape)u.cape.rotation.x+=((vy>0?0.2:0.9)-u.cape.rotation.x)*k;if(u.head)R(u.head,vy>0?-0.1:0.15,0,0);return}
  if(u.wasAir){u.wasAir=0;u.land=0.2}
  let dip=0;if(u.land>0){u.land-=dt;dip=Math.sin(Math.max(0,u.land)/0.2*Math.PI)*0.1}
  if(speed>0.3){const legA=0.5+run*0.55,armA=0.35+run*0.6;
    R(u.ll,-s*legA);R(u.rl,s*legA);R(u.la,s*armA,0,-0.07-run*0.06);R(u.ra,-s*armA,0,0.07+run*0.06);
    R(u.le,-0.15-run*1.0-Math.max(0,s)*0.25*run);R(u.re,-0.15-run*1.0-Math.max(0,-s)*0.25*run);
    u.torso.position.y=(u.ty0||0.74)+Math.abs(c)*(0.025+run*0.055)-dip;R(u.torso,0.03+run*0.22,s*(0.05+run*0.07),-c*0.02*(1-run));if(u.head)R(u.head,-run*0.14,-s*0.04,0)}
  else{const b=Math.sin(u.phase*1.4);R(u.ll,0);R(u.rl,0);R(u.la,b*0.03,0,-0.08);R(u.ra,-b*0.03,0,0.08);R(u.le,-0.16-dip);R(u.re,-0.16-dip);u.torso.position.y=(u.ty0||0.74)+b*0.008-dip;R(u.torso,dip*1.5,0,0);if(u.head)R(u.head,Math.sin(u.phase*0.37)*0.03,Math.sin(u.phase*0.21)*0.12,0)}
  if(u.cape)u.cape.rotation.x+=((0.12+run*0.5+Math.sin(u.phase*0.8)*0.05)-u.cape.rotation.x)*k;
}
// ---------- walka ----------
const ease=t=>t<0?0:t>1?1:t*t*(3-2*t);
const L3=(a,b,t)=>a+(b-a)*t;
function weaponKind(base){return base==='luk'?'bow':base==='kostur'||base==='kusza'||base==='rozdzka'?'staff':base==='sztylet'?'dagger':base?'melee':'fist'}
// k: 0..1 postęp ataku; combo 0,1,2
/* v141: odmiany strzału z łuku — przyklęk (1) i strzał z wychyleniem w bok (2); nakładane na postawę bazową */
function bowVar(u,k){u._bv=u.avar||0;u._bk=k}
function bowVarPost(u){const v=u._bv;if(!v||u._bk==null)return;const s=Math.sin(Math.min(1,u._bk)*Math.PI*0.5+0.6)*Math.min(1,u._bk*4);
  if(v===1){u.torso.position.y=(u.ty0||0.74)-0.2*s;if(u.ll)u.ll.rotation.x=-1.2*s;if(u.rl)u.rl.rotation.x=0.9*s;if(u.lk)u.lk.rotation.x=1.3*s;if(u.rk)u.rk.rotation.x=0.1}
  else{u.torso.rotation.z=0.22*s;u.torso.rotation.y+=0.2*s;if(u.ll)u.ll.rotation.z=-0.25*s;if(u.rl)u.rl.rotation.z=0.12*s}}
function animCombat(g,kind,combo,k){
  const u=g.userData,T=u.torso;
  const isSpear=kind==='melee'&&u.wkey&&/^(wlocznia|halabarda)/.test(u.wkey);
  if(isSpear&&combo!==3){// włócznia / halabarda: pchnięcia z wykrokiem, trzecie — zamach od góry ostrzem
    if(combo===2){const w=ease(k/0.42),st=ease((k-0.42)/0.2),rc=ease((k-0.7)/0.3);
      u.ra.rotation.set(L3(L3(-0.4,-2.8,w),-0.9,st)*(1-rc)-0.3*rc,0,0.1);u.re.rotation.x=L3(L3(-0.4,-0.7,w),-0.1,st)*(1-rc)-0.3*rc;
      T.rotation.set(L3(L3(0,-0.25,w),0.4,st)*(1-rc),L3(0,0.25,w)*(1-st),0);T.position.y=0.74-0.1*st*(1-rc);u.ll.rotation.x=-0.6*st*(1-rc);u.rl.rotation.x=0.45*st*(1-rc);if(u.head)u.head.rotation.set(-0.2*st*(1-rc),0,0);return}
    const w=ease(k/0.34),st=ease((k-0.34)/0.14),rc=ease((k-0.62)/0.38),side=combo===0?1:-1;
    u.ra.rotation.set(L3(L3(-0.6,-1.0,w),-1.55,st)*(1-rc)-0.35*rc,0,L3(0.15,0.35,w)*(1-st));u.re.rotation.x=L3(L3(-0.5,-1.7,w),-0.05,st)*(1-rc)-0.4*rc;
    T.rotation.set(0.1*st*(1-rc),L3(L3(0,0.55*side,w),-0.2*side,st)*(1-rc),0);u.ll.rotation.x=-0.7*st*(1-rc);u.rl.rotation.x=0.5*st*(1-rc);T.position.y=0.74-0.12*st*(1-rc);if(u.head)u.head.rotation.set(0,-0.3*side*w*(1-st),0);return}
  if(kind==='melee'&&u.two&&combo<2&&u.avar){/* v142: broń dwuręczna — cios od dołu w górę (1) i niski zamach po nogach z przyklękiem (2) */
    if(u.avar===1){const w=ease(k/0.42),st=ease((k-0.42)/0.2),rc=ease((k-0.72)/0.28);u.ra.rotation.set(L3(L3(-0.2,0.5,w),-2.9,st)*(1-rc)-0.2*rc,0,L3(0.1,0.3,w)*(1-rc));u.re.rotation.x=L3(L3(-0.3,-0.4,w),-0.3,st)*(1-rc)-0.25*rc;
      T.rotation.set(L3(L3(0,0.35,w),-0.25,st)*(1-rc),L3(0,0.4,w)*(1-st),0);T.position.y=0.74-0.2*w*(1-st)*(1-rc)+0.06*st*(1-rc);u.ll.rotation.x=-0.6*w*(1-rc);u.rl.rotation.x=0.5*w*(1-rc);return}
    const w=ease(k/0.38),st=ease((k-0.38)/0.26),rc=ease((k-0.72)/0.28);u.ra.rotation.set(L3(L3(-0.3,-0.9,w),-0.6,st)*(1-rc)-0.2*rc,0,L3(L3(0,1.4,w),-1.0,st)*(1-rc));u.re.rotation.x=-0.3*(1-rc)-0.25*rc;
    T.rotation.set(0.35*w*(1-rc),L3(L3(0,1.0,w),-1.1,st)*(1-rc),0);T.position.y=0.74-0.28*Math.min(1,w*1.4)*(1-rc);u.ll.rotation.x=-1.0*w*(1-rc);u.rl.rotation.x=0.8*w*(1-rc);return}
  if(kind==='melee'&&u.two){// broń dwuręczna: ciężkie zamachy całym ciałem (lewa dłoń trzyma trzonek przez IK)
    let shx,shz,elx,tx,ty,lunge=0,crouch=0;
    if(combo===3){const w=ease(k/0.25),sp=ease((k-0.22)/0.55),rc=ease((k-0.8)/0.2);
      shx=L3(-0.9,-1.45,w);shz=L3(0,1.1,w);elx=L3(-0.4,-0.1,w);u.ra.rotation.set(L3(shx,-0.2,rc),0,L3(shz,0.05,rc));u.re.rotation.x=L3(elx,-0.25,rc);
      T.rotation.set(0.15*(1-rc),(-sp*Math.PI*2)*(1-rc),0);T.position.y=0.74-0.16*Math.sin(Math.min(1,k/0.8)*Math.PI);u.ll.rotation.x=-0.5*(1-rc)*sp;u.rl.rotation.x=0.5*(1-rc)*sp;return}
    if(combo===0||combo===2){// cios znad głowy (2: z podskokiem i uderzeniem w ziemię)
      const big=combo===2,w=ease(k/(big?0.48:0.42)),st=ease((k-(big?0.48:0.42))/0.16),rc=ease((k-0.72)/0.28);
      shx=L3(L3(-0.2,-3.05,w),big?-0.35:-0.7,st);elx=L3(L3(-0.3,-1.15,w),-0.05,st);shz=0.1;tx=L3(L3(0,-0.3,w),big?0.75:0.5,st);ty=L3(0,0.15,w)*(1-st);crouch=st*(big?0.28:0.16);lunge=st;
      if(big)T.position.y=0.74+Math.sin(Math.min(1,k/0.48)*Math.PI)*0.2*(1-st)-crouch*(1-rc);else T.position.y=0.74-crouch*(1-rc);
      if(u.head)u.head.rotation.set(L3(L3(0,0.25,w),-0.3,st)*(1-rc),0,0)}
    else{// zamach poziomy z biodra na ukos
      const w=ease(k/0.4),st=ease((k-0.4)/0.2),rc=ease((k-0.72)/0.28);
      shx=L3(L3(-0.2,-1.3,w),-1.4,st);shz=L3(L3(0,1.35,w),-0.3,st);elx=L3(L3(-0.3,-0.9,w),-0.35,st);tx=0.15*st;ty=L3(L3(0,0.9,w),-1.2,st);lunge=st;T.position.y=0.74-0.1*st*(1-rc)}
    {const rc=ease((k-0.72)/0.28);shx=L3(shx,-0.2,rc);shz=L3(shz,0.05,rc);elx=L3(elx,-0.25,rc);tx=L3(tx||0,0,rc);ty=L3(ty||0,0,rc);lunge*=1-rc}
    u.ra.rotation.set(shx,0,shz);u.re.rotation.x=elx;T.rotation.set(tx,ty,0);u.ll.rotation.x=-0.6*lunge;u.rl.rotation.x=0.45*lunge;return}
  if((kind==='melee'||kind==='fist')&&combo<2&&u.avar){/* v141: odmiany ciosów jednoręcznych — pchnięcie z wypadem (1) i cięcie od dołu na ukos (2) */
    if(u.avar===1){const w=ease(k/0.32),st=ease((k-0.32)/0.16),rc=ease((k-0.6)/0.4);
      u.ra.rotation.set(L3(L3(-0.5,-0.9,w),-1.6,st)*(1-rc)-0.1*rc,0,L3(0.3,0.1,st)*(1-rc));u.re.rotation.x=L3(L3(-0.4,-1.8,w),-0.02,st)*(1-rc)-0.2*rc;
      T.rotation.set(0.12*st*(1-rc),L3(L3(0,-0.5,w),0.35,st)*(1-rc),0);u.la.rotation.set(-0.5+0.3*st,0,-0.35-0.4*st);u.le.rotation.x=-1.0;T.position.y=0.74-0.14*st*(1-rc);
      u.ll.rotation.x=-0.8*st*(1-rc);u.rl.rotation.x=0.55*st*(1-rc);if(u.head)u.head.rotation.set(-0.1*st*(1-rc),0.25*w*(1-st),0);return}
    const sg=combo===0?1:-1,w=ease(k/0.34),st=ease((k-0.34)/0.26),rc=ease((k-0.68)/0.32);
    u.ra.rotation.set(L3(L3(-0.1,0.45,w),-2.5,st)*(1-rc)-0.1*rc,0,L3(L3(0.05,sg>0?0.9:-0.6,w),sg>0?-0.5:0.9,st)*(1-rc));u.re.rotation.x=L3(L3(-0.2,-0.9,w),-0.2,st)*(1-rc)-0.2*rc;
    T.rotation.set(L3(0.25*w,-0.15,st)*(1-rc),L3(L3(0,sg*0.6,w),-sg*0.55,st)*(1-rc),0);T.position.y=0.74-0.18*w*(1-st)*(1-rc)+0.05*st*(1-rc);u.la.rotation.set(-0.4,0,-0.5);u.le.rotation.x=-0.8;
    u.ll.rotation.x=-0.5*w*(1-rc);u.rl.rotation.x=0.4*w*(1-rc);if(u.head)u.head.rotation.set(0.15*w*(1-st),-sg*0.3*st*(1-rc),0);return}
  if(kind==='melee'||kind==='fist'){
    let shx,shz,elx,ty,tx,lunge=0;
    if(combo===3){const w=ease(k/0.22),sp=ease((k-0.18)/0.55),rc=ease((k-0.78)/0.22);// obrót z ostrzem na wysokości pasa
      shx=L3(-1.2,-1.55,w);shz=L3(L3(0,1.25,w),1.1,sp);elx=L3(-0.6,-0.08,w);tx=0.12;ty=0;lunge=Math.sin(Math.min(1,k/0.8)*Math.PI);
      shx=L3(shx,-0.1,rc);shz=L3(shz,0.05,rc);elx=L3(elx,-0.2,rc);lunge*=1-rc;u.ra.rotation.set(shx,0,shz);u.re.rotation.x=elx;T.rotation.set(tx,-sp*Math.PI*2*(1-rc)+0,0);u.la.rotation.set(-0.6,0,-0.9*w*(1-rc));u.le.rotation.x=-0.4;u.ll.rotation.x=-0.5*lunge;u.rl.rotation.x=0.4*lunge;T.position.y=0.74-0.08*lunge;return}
    if(combo===2){const w=ease(k/0.4),st=ease((k-0.4)/0.25),rc=ease((k-0.7)/0.3);
      shx=L3(L3(0,-2.9,w),-0.5,st);elx=L3(L3(-0.2,-1.3,w),-0.1,st);shz=0.15;tx=L3(L3(0,-0.18,w),0.35,st);ty=0;lunge=st;
      shx=L3(shx,-0.1,rc);elx=L3(elx,-0.2,rc);tx=L3(tx,0,rc);lunge*=1-rc;T.position.y=0.74+Math.sin(Math.min(1,k/0.65)*Math.PI)*0.12}
    else{const sg=combo===0?1:-1,w=ease(k/0.35),st=ease((k-0.35)/0.3),rc=ease((k-0.72)/0.28);
      shx=L3(L3(0,-1.45,w),-1.5,st);shz=L3(L3(0,sg>0?1.15:-0.55,w),sg>0?-0.65:1.2,st);elx=L3(L3(-0.2,-0.7,w),-0.08,st);ty=L3(L3(0,sg>0?-0.55:0.5,w),sg>0?0.65:-0.6,st);tx=0.08;lunge=st;
      shx=L3(shx,-0.1,rc);shz=L3(shz,0.05,rc);elx=L3(elx,-0.2,rc);ty=L3(ty,0,rc);lunge*=1-rc}
    u.ra.rotation.set(shx,0,shz);u.re.rotation.x=elx;T.rotation.set(tx,ty,0);u.la.rotation.set(-0.4-lunge*0.4,0,-0.25-0.3*Math.abs(ty));u.le.rotation.x=-0.9;
    if(u.head)u.head.rotation.set(-0.12*lunge,-ty*0.55,0);if(combo!==2)T.position.y=0.74-0.07*lunge;u.ll.rotation.x=-0.45*lunge;u.rl.rotation.x=0.35*lunge;return}
  if(kind==='dagger'&&u.avar){/* v141: sztylety — cięcie na krzyż obiema rękami (1) i podwójne pchnięcie z wyskoku (2) */
    if(u.avar===1){const w=ease(k/0.3),st=ease((k-0.3)/0.22),rc=ease((k-0.6)/0.4);for(const [a,e,sg] of [[u.ra,u.re,1],[u.la,u.le,-1]]){a.rotation.set(L3(L3(-0.3,-2.2,w),-0.8,st)*(1-rc)-0.2*rc,0,L3(L3(0,sg*0.8,w),-sg*0.7,st)*(1-rc));e.rotation.x=L3(L3(-0.4,-1.4,w),-0.2,st)*(1-rc)-0.3*rc}
      T.rotation.set(L3(-0.1*w,0.3,st)*(1-rc),0,0);T.position.y=0.74-0.12*st*(1-rc);u.ll.rotation.x=-0.5*st*(1-rc);u.rl.rotation.x=0.4*st*(1-rc);return}
    const w=ease(k/0.28),st=ease((k-0.28)/0.2),rc=ease((k-0.58)/0.42),jp=Math.sin(Math.min(1,k/0.5)*Math.PI);for(const [a,e] of [[u.ra,u.re],[u.la,u.le]]){a.rotation.set(L3(L3(-0.4,-0.6,w),-1.7,st)*(1-rc)-0.2*rc,0,0);e.rotation.x=L3(L3(-0.4,-2.0,w),0,st)*(1-rc)-0.3*rc}
    T.rotation.set(0.25*st*(1-rc),0,0);T.position.y=0.74+0.16*jp*(1-rc);u.ll.rotation.x=-0.9*jp*(1-rc);u.rl.rotation.x=-0.3*jp*(1-rc);return}
  if(kind==='dagger'){const R=combo%2===0,a=R?u.ra:u.la,e=R?u.re:u.le,o=R?u.la:u.ra,oe=R?u.le:u.re,w=ease(k/0.3),st=ease((k-0.3)/0.25),rc=ease((k-0.6)/0.4);
    a.rotation.set(L3(L3(-0.3,-1.2,w),-1.65,st)*(1-rc)+(-0.2)*rc,0,(R?0.1:-0.1));e.rotation.x=L3(L3(-0.4,-1.6,w),0,st)*(1-rc)+(-0.3)*rc;o.rotation.set(-0.9,0,R?-0.2:0.2);oe.rotation.x=-1.3;T.rotation.set(0.1,(R?-0.35:0.35)*st*(1-rc),0);return}
  if(kind==='staff'&&u.wkey&&u.wkey.startsWith('kusza')){const up=ease(k/0.18),fire=k>=0.42?Math.exp(-(k-0.42)*26):0,rl=k>0.55?Math.sin(Math.min(1,(k-0.55)/0.4)*Math.PI):0,sw=k<0.42?Math.sin(k*38)*0.012:0;
    u.ra.rotation.set(L3(-0.2,-1.52,up)-fire*0.38+rl*0.95+sw,0,L3(0.05,0.2,up)-rl*0.12);u.re.rotation.x=L3(-0.2,-0.12,up)-rl*1.65;
    u.la.rotation.set(L3(-0.3,-1.44,up)-fire*0.32+rl*0.5-sw,0,L3(-0.1,-0.42,up)+rl*0.22);u.le.rotation.x=L3(-0.4,-0.48,up)-rl*0.45;
    u._kb=1;u.ikOff=rl>0.08;if(u.wm)wmPivot(u.wm,L3(0,1.5,up)+fire*0.3-rl*1.05,-fire*0.06)
    T.rotation.set(-fire*0.13+rl*0.22,L3(0,0.17,up)*(1-rl*0.6),fire*0.03);if(u.head)u.head.rotation.set(0.07*up-fire*0.09+rl*0.16,-0.15*up*(1-rl),0);u.ll.rotation.x=-0.18*up-rl*0.22;u.rl.rotation.x=0.14*up+fire*0.1;return}
  if(kind==='staff'){const wand=u.wkey&&u.wkey.startsWith('rozdzka');
    if(wand){// różdżka: zakręcenie nadgarstkiem, energiczne pchnięcie w cel, druga dłoń prowadzi gest
      const w=ease(k/0.3),st=ease((k-0.3)/0.16),rc=ease((k-0.62)/0.38),ci=Math.sin(Math.min(1,k/0.3)*Math.PI*2)*0.25*(1-st);
      u.ra.rotation.set(L3(L3(-0.2,-2.05,w),-1.5,st)*(1-rc)-0.2*rc,ci,L3(L3(0.05,0.45,w),-0.08,st)*(1-rc));u.re.rotation.x=L3(L3(-0.3,-1.25,w),-0.05,st)*(1-rc)-0.3*rc;
      u.la.rotation.set(L3(L3(-0.2,-0.9,w),-0.35,st)*(1-rc),0,L3(-0.2,-0.55,w)*(1-rc));u.le.rotation.x=L3(-0.6,-1.2,w)*(1-rc);T.rotation.set(0.04,L3(L3(0,0.22,w),-0.18,st)*(1-rc),0);return}
    if(u.avar===1){/* v141: kostur — uderzenie końcem o ziemię z falą */const w=ease(k/0.4),st=ease((k-0.4)/0.14),rc=ease((k-0.62)/0.38);
      u.ra.rotation.set(L3(L3(-0.3,-2.9,w),-0.9,st)*(1-rc)-0.25*rc,0,0.1);u.re.rotation.x=L3(L3(-0.3,-0.6,w),-0.3,st)*(1-rc)-0.3*rc;u.la.rotation.set(L3(L3(-0.3,-2.7,w),-1.0,st)*(1-rc)-0.2*rc,0,0.3);u.le.rotation.x=L3(-0.5,-0.4,w)*(1-rc);
      T.rotation.set(L3(L3(0,-0.2,w),0.4,st)*(1-rc),0,0);T.position.y=0.74+0.1*w*(1-st)-0.2*st*(1-rc);u.ll.rotation.x=-0.5*st*(1-rc);u.rl.rotation.x=0.4*st*(1-rc);return}
    if(u.avar===2){/* v141: kostur — szeroki zamach w bok */const w=ease(k/0.34),st=ease((k-0.34)/0.24),rc=ease((k-0.64)/0.36);
      u.ra.rotation.set(L3(L3(-0.3,-1.3,w),-1.4,st)*(1-rc)-0.25*rc,0,L3(L3(0.1,1.1,w),-0.6,st)*(1-rc));u.re.rotation.x=-0.4*(1-rc)-0.3*rc;u.la.rotation.set(L3(-0.3,-1.2,w)*(1-rc),0,L3(L3(-0.2,0.8,w),-0.5,st)*(1-rc));u.le.rotation.x=-0.8*(1-rc);
      T.rotation.set(0.05,L3(L3(0,0.8,w),-0.7,st)*(1-rc),0);u.ll.rotation.x=-0.3*st*(1-rc);u.rl.rotation.x=0.25*st*(1-rc);return}
    // kostur: oba chwyty, uniesienie nad głowę ze skrętem tułowia, mocne pchnięcie z wykrokiem, powrót
    const w=ease(k/0.36),st=ease((k-0.36)/0.18),rc=ease((k-0.6)/0.4);
    u.ra.rotation.set(L3(L3(-0.3,-2.5,w),-1.25,st)*(1-rc)-0.25*rc,0,L3(L3(0.1,-0.25,w),0.05,st)*(1-rc)+0.1*rc);u.re.rotation.x=L3(L3(-0.3,-0.5,w),-0.08,st)*(1-rc)-0.3*rc;
    u.la.rotation.set(L3(L3(-0.3,-2.2,w),-1.45,st)*(1-rc)-0.2*rc,0,L3(L3(-0.2,0.55,w),0.35,st)*(1-rc));u.le.rotation.x=L3(L3(-0.5,-0.7,w),-0.15,st)*(1-rc)-0.5*rc;
    T.rotation.set(L3(L3(0.04,-0.12,w),0.14,st)*(1-rc),L3(L3(0,0.38,w),-0.22,st)*(1-rc),0);u.ll.rotation.x=-0.35*st*(1-rc);u.rl.rotation.x=0.28*st*(1-rc);return}
  if(kind==='bow'){bowVar(u,k);
    // 0-0,25 sięga do kołczanu, 0,25-0,45 nakłada strzałę, 0,45-0,9 naciąga, 0,9+ zwolnienie
    T.rotation.set(0.04,0.45*ease(k/0.3),0);
    u.la.rotation.set(L3(-0.3,-1.52,ease((k-0.15)/0.3)),0,-0.12);u.le.rotation.x=L3(-0.4,0,ease((k-0.15)/0.3));
    if(k<0.25){const s=ease(k/0.25);u.ra.rotation.set(-2.85*s,0,-0.35*s);u.re.rotation.x=-1.5*s}
    else if(k<0.45){const s=ease((k-0.25)/0.2);u.ra.rotation.set(L3(-2.85,-1.5,s),0,L3(-0.35,-0.25,s));u.re.rotation.x=L3(-1.5,-1.0,s)}
    else if(k<0.9){const s=ease((k-0.45)/0.45);u.ra.rotation.set(-1.5,0,L3(-0.25,0.25,s));u.re.rotation.x=L3(-1.0,-2.45,s)}
    else{const s=ease((k-0.9)/0.1);u.ra.rotation.set(-1.4,0,L3(0.25,0.75,s));u.re.rotation.x=L3(-2.45,-0.6,s)}
    {const tw=ease(k/0.3)*(k>0.9?1-ease((k-0.9)/0.1)*0.4:1);T.rotation.y=0.75*tw;if(u.head)u.head.rotation.set(0,-0.6*tw,0);u.ll.rotation.x=-0.28*tw;u.rl.rotation.x=0.22*tw;if(k>0.9){const s=ease((k-0.9)/0.1);u.la.rotation.x=-1.52+0.15*s;T.rotation.x=0.04-0.05*s}}
    {const dr=k<0.45?0:k<0.9?ease((k-0.45)/0.45):0;bowDraw(g,dr,k>=0.25&&k<0.9);if(k>=0.4&&k<0.9){u.bowIK={d:dr,arrow:true};BOWSET.add(g)}else if(k>=0.9&&k<0.97){u.bowIK={d:0,arrow:false};BOWSET.add(g)}}return}
}

// ---------- broń, łuk, kołczan, strzała na cięciwie ----------
const WMET=['#aeb6bd','#c4ccd2','#c8d4e2','#cfc4e6','#f0d890'],WRUNE=[null,null,null,'#7fe3ff','#ffb030'];
function weaponGeo(base,rar,vr,lk,all,sd){const L=weaponV(base,rar,vr,lk,sd);if(!L)return weaponGeoOld(base,rar);if(all)return boxes(L);const N=L.filter(b=>b[6][0]!=='!'),G=L.filter(b=>b[6][0]==='!');const g=boxes(N);if(G.length)g.userData.glowGeo=boxes(G);return g}
const WLK=[{},{lea:'#6a1414',leal:'#c8302a',wood:'#5a1a14',woodd:'#3a0e0a',woodl:'#7a2a1a',fit:'#2a2a30',pom:'disc',guard:'disc',tas:'#c8302a'},{lea:'#4a3a2a',leal:'#e8e0c8',wood:'#3a2a1c',woodd:'#2a1c12',woodl:'#4a3a2a',fit:'#5e5e64',pom:'ball',guard:'none',serr:1,spike:1},{lea:'#1a2a5a',leal:'#c9a24a',wood:'#4a3020',woodd:'#2a1c12',woodl:'#5a3a22',fit:'#c9a24a',pom:'scent',guard:'fin',band:1},{lea:'#2a5a3a',leal:'#d8e8d0',wood:'#d8d0b8',woodd:'#b8b098',woodl:'#e8e0c8',fit:'#c8d0d8',pom:'disc',guard:'down',leaf:1},
 {fx:'demon',met:'#2e262c',edge:'#8a1a1a',glow:'#ff3030',lea:'#1a1014',leal:'#5a1a1a',wood:'#1e1418',woodd:'#120a0e',woodl:'#2a1c20',fit:'#3a2a30',pom:'ball',guard:'down'},
 {fx:'crystal',met:'#8fd8f0',edge:'#d8f8ff',glow:'#c8f8ff',lea:'#2a4a6a',leal:'#c8e8f8',wood:'#c8d8e0',woodd:'#a8b8c0',woodl:'#e0eef4',fit:'#e0e8f0',pom:'scent',guard:'fin'},
 {fx:'flame',met:'#8a3010',edge:'#ff8a20',glow:'#ffb030',lea:'#3a1a0a',leal:'#c8501a',wood:'#3a1a10',woodd:'#2a1008',woodl:'#5a2a14',fit:'#d9a030',pom:'disc',guard:'down'},
 {fx:'ice',met:'#b8dcee',edge:'#ffffff',glow:'#e0f8ff',lea:'#2a4a6a',leal:'#e8f4ff',wood:'#9ab8c8',woodd:'#7a98a8',woodl:'#c8e0ec',fit:'#e8f4ff',pom:'ball',guard:'fin'},
 {fx:'arcane',met:'#3a2a5a',edge:'#8a6ac8',glow:'#c890ff',lea:'#1a1030',leal:'#6a4aa8',wood:'#2a1e3a',woodd:'#1a1228',woodl:'#3a2a50',fit:'#d9b23a',pom:'scent',guard:'fin'}];
const VLEA=['#3a2414','#5a2a10','#2a2a30','#4a3a20','#3a1a1a','#2a3a2a'],VFIT=['#5a5a62','#a8743a','#c8ccd4','#3a3a40','#8a6a3a'];
let WG0=0;/* v151: miecz w dłoni jest obracany krawędzią do góry — jelec budujemy wtedy bez obrotu, żeby stał poprzecznie do głowni */
function weaponV(base,rar,vr,lk,sd){const V=(WEAPV[base]||[]).find(v=>v[0]===vr);if(!V)return null;let SL=WLK[lk||0]||{};const VR=sd?mulb(sd):null;if(VR){SL=Object.assign({},SL);if(!SL.lea){SL.lea=VLEA[Math.floor(VR()*VLEA.length)];SL.leal=darker(SL.lea,1.5)}else VR();if(!SL.fit&&rar<4)SL.fit=VFIT[Math.floor(VR()*VFIT.length)];else VR();if(!SL.wood&&VR()<0.5){const wb=['#5a3a20','#7a5232','#4a2a18','#8a6a44'][Math.floor(VR()*4)];SL.wood=wb;SL.woodd=darker(wb,0.7);SL.woodl=darker(wb,1.25)}}
  const c=RAR[rar].c,y=-0.3,M=SL.met||WMET[rar],MD=darker(M,0.72),ML=SL.edge||darker(M,1.18),MF=darker(M,0.86),GW='!'+(SL.glow||'#ffffff'),RU=WRUNE[rar],GOLD='#d9b23a',GOLDD='#a8822a',
    WOOD=SL.wood||'#6b4a2b',WOODD=SL.woodd||'#4a2f1d',WOODL=SL.woodl||'#8a6238',LEA=SL.lea||(rar>=4?'#5a2a10':'#3a2414'),LEAL=SL.leal||(rar>=4?'#7a3a18':'#5a3a22'),FIT=rar>=4?GOLD:SL.fit||(rar>=2?'#8a8f96':'#5a5a62'),FITD=darker(FIT,0.75),L=[],P=(x,yy,z,w,h,d,col)=>L.push([x,yy,z,w,h,d,col]),len=(V[4]||1)*(VR?0.9+VR()*0.2:1),wv=VR?0.88+VR()*0.26:1;
  const SR=sd?mulb(sd*31+7):null,SH=SR?{bs:Math.floor(SR()*7),gs:['straight','up','down','disc','ring','swept'][Math.floor(SR()*6)],ps:['ball','disc','scent','spike','ring','crescent'][Math.floor(SR()*6)],ax:Math.floor(SR()*6),hm:Math.floor(SR()*5),sp:Math.floor(SR()*6),fl:[4,6,8][Math.floor(SR()*3)],st:Math.floor(SR()*5),cv:0.6+SR()*0.9,hb:Math.floor(SR()*4),cb:Math.floor(SR()*3)}:null;
  // --- wspólne części ---
  const grip=(z0,gl,gw)=>{P(0,y,z0+gl/2,gw,gw,gl,LEA);const n=Math.max(2,Math.round(gl/0.05));for(let i=0;i<n;i++)P(0,y,z0+(i+0.5)*gl/n,gw+0.012,gw+0.012,gl/n*0.4,LEAL)};
  const pommel=(z,s,kind)=>{if(SH&&!SL.pom)kind=SH.ps;if(kind==='spike'){P(0,y,z,s*0.8,s*0.8,s*0.6,FIT);P(0,y,z-s*0.5,s*0.5,s*0.5,s*0.4,FITD);P(0,y,z-s*0.85,s*0.25,s*0.25,s*0.3,FIT);if(rar>=2)P(0,y,z,s*0.3,s*0.86,s*0.3,c);return}if(kind==='ring'){for(const [a,b] of [[0,1],[0,-1]])P(0,y+b*s*0.4,z-s*0.3,s*0.3,s*0.25,s*0.9,FIT);P(0,y,z-s*0.75,s*0.3,s*1.05,s*0.25,FIT);P(0,y,z+0.0,s*0.6,s*0.6,s*0.3,FITD);return}if(kind==='crescent'){P(0,y,z,s*0.6,s*0.6,s*0.5,FIT);for(const b of [1,-1]){P(0,y+b*s*0.45,z-s*0.25,s*0.5,s*0.35,s*0.45,FIT);P(0,y+b*s*0.65,z-s*0.05,s*0.35,s*0.25,s*0.3,FITD)}return}if(kind==='disc'){P(0,y,z,s*0.55,s,s,FIT);P(0,y,z,s*0.62,s*0.7,s*0.7,FITD)}else if(kind==='scent'){P(0,y,z,s,s,s*0.7,FIT);P(0,y,z-s*0.45,s*0.6,s*0.6,s*0.3,FITD)}else{P(0,y,z,s,s,s,FIT);P(0,y,z,s*1.1,s*0.6,s*0.6,FITD);P(0,y,z-s*0.55,s*0.4,s*0.4,s*0.2,FIT)}if(rar>=2)P(0,y,z,s*0.4,s*1.06,s*0.4,c)};
  const blade=(z0,bl,w,t,o={})=>{const bs=SH?SH.bs:0;if(bs===3)o=Object.assign({},o,{clip:1});if(bs===6)w*=0.78;const body=bl*(o.tip??(bs===2?0.88:0.8)),tl=bl-body;
    if(bs===4){const n=8;for(let i=0;i<n;i++)P((i%2?1:-1)*w*0.12,y,z0+(i+0.5)*body/n,w*(i%2?0.9:1.05),t,body/n+0.004,M)}else P(0,y,z0+body/2,w,t,body,M);
    if(bs===1){P(0,y,z0+body*0.6,w*1.35,t*0.9,body*0.36,M);P(w*0.66,y,z0+body*0.6,0.016,t*0.6,body*0.32,ML);P(-w*0.66,y,z0+body*0.6,0.016,t*0.6,body*0.32,ML)}
    if(bs===2){P(0,y,z0+body*0.82,w*1.3,t*0.9,body*0.28,M);P(w*0.64,y,z0+body*0.82,0.016,t*0.6,body*0.26,ML);P(-w*0.64,y,z0+body*0.82,0.016,t*0.6,body*0.26,ML)}
    if(bs===5)for(let k=0;k<3;k++)P(-w/2+0.006,y,z0+0.06+k*0.07,0.02,t*1.1,0.035,MD);
    if(bs===6)for(const s of [1,-1])P(s*w*0.22,y,z0+body*0.42,w*0.08,t+0.008,body*0.66,MD);                                   // płaz
    P(w/2-0.008,y,z0+body/2,0.016,t*0.6,body,ML);P(-w/2+0.008,y,z0+body/2,0.016,t*0.6,body,ML);   // zbrocze krawędzi
    if(!o.nofuller){P(0,y,z0+body*0.42,w*0.24,t+0.006,body*0.7,MF);P(0,y,z0+body*0.42,w*0.1,t+0.01,body*0.66,MD)}   // zbrocze środkowe
    const st=o.steps||4;for(let k=0;k<st;k++){const f=1-(k+1)/(st+1);P(o.clip&&k<2?w*0.12:0,y,z0+body+tl*(k+0.5)/st,w*f,t*(0.6+0.4*f),tl/st+0.002,k===st-1?ML:M)}
    if(SL.serr)for(let z=z0+0.06;z<z0+body-0.02;z+=0.075){P(w/2+0.012,y,z,0.026,t*0.55,0.035,MD);P(-w/2-0.012,y,z+0.035,0.026,t*0.55,0.035,MD)}
    if(SL.leaf){P(0,y,z0+body*0.62,w*1.4,t*0.85,body*0.32,M);P(w*0.7-0.01,y,z0+body*0.62,0.018,t*0.6,body*0.3,ML);P(-w*0.7+0.01,y,z0+body*0.62,0.018,t*0.6,body*0.3,ML);P(0,y,z0+body*0.62,w*0.3,t+0.012,body*0.28,'#d9b23a')}
    if(SL.band)P(0,y,z0+body*0.35,w*0.14,t+0.016,body*0.5,'#d9b23a');
    if(SL.fx==='demon'){for(let z=z0+0.1;z<z0+body-0.05;z+=0.14)for(const s of [1,-1]){P(s*(w/2+0.03),y,z,0.06,t*0.6,0.05,MD);P(s*(w/2+0.06),y,z+0.03,0.03,t*0.5,0.04,ML)}for(let k=0;k<4;k++)P(0,y,z0+body*(0.15+k*0.2),w*0.18,t+0.016,body*0.1,GW)}
    if(SL.fx==='crystal'){P(0,y,z0+body*0.45,w*0.3,t+0.012,body*0.85,GW);for(const s of [1,-1])P(s*(w/2+0.02),y,z0+0.06,0.04,0.06,0.1,ML)}
    if(SL.fx==='flame'){P(0,y,z0+body*0.45,w*0.2,t+0.012,body*0.8,GW);for(let z=z0+0.05,i=0;z<z0+body;z+=0.09,i++)for(const s of [1,-1])P(s*(w/2+0.02),y,z+(i%2)*0.04,0.035,t*0.5,0.06,i%2?GW:'!#ffe080')}
    if(SL.fx==='ice'){P(0,y,z0+body*0.45,w*0.2,t+0.012,body*0.8,GW);for(let z=z0+0.12;z<z0+body-0.05;z+=0.16)for(const s of [1,-1]){P(s*(w/2+0.025),y,z,0.05,t*0.5,0.03,'#ffffff');P(s*(w/2+0.055),y,z+0.02,0.025,t*0.4,0.02,'#e0f4ff')}}
    if(SL.fx==='arcane'){for(let k=0;k<5;k++)P(0,y,z0+body*(0.12+k*0.17),w*(k%2?0.3:0.16),t+0.016,body*0.06,GW);P(0,y,z0+bl+0.12,0.06,0.06,0.06,GW);P(0,y,z0+bl+0.12,0.08,0.03,0.03,'!#e8d0ff')}
    if(RU)for(let k=0;k<4;k++)P(0,y,z0+body*(0.2+k*0.16),w*0.12,t+0.014,body*0.08,RU)};
  const adorn=(z,hw)=>{hw=hw||0.07;if(SL.tas){P(0,y-hw/2-0.02,z-0.1,0.025,0.1,0.025,SL.tas);P(0,y-hw/2-0.06,z-0.16,0.05,0.06,0.05,SL.tas);P(0,y-hw/2-0.06,z-0.21,0.035,0.06,0.035,'#e05040')}
    if(SL.spike){P(0,y,z+0.12,0.035,0.035,0.08,MD);P(0,y,z+0.18,0.02,0.02,0.05,ML);for(const s of [1,-1])P(s*(hw/2+0.03),y,z-0.25,0.04,0.025,0.025,'#e8e0c8')}
    if(SL.band)for(const dz of [-0.3,-0.55])P(0,y,z+dz,hw+0.02,hw+0.02,0.03,'#d9b23a');
    if(SL.leaf)for(const s of [1,-1]){P(s*(hw/2+0.03),y,z-0.2,0.012,0.05,0.09,'#5a9a4a');P(s*(hw/2+0.04),y+0.02,z-0.26,0.01,0.04,0.05,'#86c060')}
    if(SL.fx){for(const dz of [-0.18,-0.42])P(0,y,z+dz,hw+0.024,hw+0.024,0.028,GW);
      if(SL.fx==='demon'){for(const s of [1,-1]){P(s*(hw/2+0.04),y,z-0.08,0.06,0.03,0.03,MD);P(s*(hw/2+0.08),y,z-0.04,0.03,0.03,0.05,ML)}P(0,y,z+0.14,0.04,0.04,0.1,MD);P(0,y,z+0.2,0.02,0.02,0.05,ML)}
      if(SL.fx==='crystal'||SL.fx==='ice'){P(0,y,z+0.16,0.07,0.07,0.12,GW);P(0.03,y+0.02,z+0.12,0.04,0.04,0.08,ML);P(-0.03,y-0.02,z+0.13,0.035,0.035,0.07,ML)}
      if(SL.fx==='flame'){for(let k=0;k<3;k++)P((k-1)*0.03,y,z+0.12+(k%2)*0.04,0.03,0.03,0.08,k%2?GW:'!#ffe080')}
      if(SL.fx==='arcane'){P(0,y+0.14,z+0.08,0.05,0.05,0.05,GW);P(0,y-0.14,z-0.02,0.04,0.04,0.04,GW);P(0.14,y,z+0.03,0.04,0.04,0.04,'!#e8d0ff')}}};
  const PG=(x,yy,z,w,h,d,c)=>WG0?P(x,yy,z,w,h,d,c):P(-(yy-y),y+x,z,h,w,d,c);/* jelec obrócony o 90° wokół osi głowni */const guard=(z,w,kind)=>{if(SH&&!SL.guard&&kind!=='none')kind=SH.gs;
    if(kind==='disc'){PG(0,y,z,w*0.6,w*0.6,0.04,FIT);PG(0,y,z,w*0.45,w*0.45,0.05,FITD);if(rar>=3)PG(0,y,z,0.05,0.12,0.05,c);return}
    if(kind==='ring'){PG(0,y,z,w,0.06,0.05,FIT);for(const s of [1,-1]){PG(s*(w/2+0.02),y,z+0.03,0.03,0.1,0.03,FIT);PG(s*(w/2+0.02),y,z+0.1,0.03,0.03,0.08,FITD)}PG(0,y,z,w*0.4,0.1,0.08,FITD);return}
    if(kind==='swept'){PG(0,y,z,w,0.06,0.05,FIT);for(const s of [1,-1]){PG(s*(w/2+0.01),y,z-0.05,0.04,0.05,0.1,FIT);PG(s*(w/2-0.02),y,z-0.13,0.035,0.045,0.06,FITD)}PG(w*0.18,y,z-0.11,0.03,0.04,0.2,FIT);PG(0,y,z,w*0.4,0.1,0.08,FITD);return}
    if(kind==='up'){PG(0,y,z,w*0.85,0.07,0.06,FIT);for(const s of [1,-1]){PG(s*(w*0.45),y,z+0.05,0.05,0.06,0.08,FIT);PG(s*(w*0.48),y,z+0.11,0.04,0.05,0.06,FITD)}PG(0,y,z,w*0.4,0.1,0.08,FITD);return}
    PG(0,y,z,w,0.07,0.06,FIT);PG(0,y,z,w*0.4,0.1,0.08,FITD);
    if(kind==='down')for(const s of [1,-1]){PG(s*(w/2+0.02),y,z+0.04,0.05,0.06,0.08,FIT);PG(s*(w/2+0.03),y,z+0.09,0.04,0.05,0.05,FITD)}
    if(kind==='fin')for(const s of [1,-1])PG(s*(w/2+0.03),y,z,0.07,0.09,0.09,FITD);
    if(rar>=3)PG(0,y,z,0.05,0.12,0.05,c)};
  const haft=(z0,hl,hw,col)=>{P(0,y,z0+hl/2,hw,hw,hl,col||WOOD);P(hw*0.3,y,z0+hl/2,hw*0.25,hw+0.004,hl*0.98,WOODD)};
  const wraps=(z0,zl,hw)=>{for(let i=0;i<3;i++)P(0,y,z0+i*zl/3,hw+0.014,hw+0.014,zl/6,LEA)};
  // --- miecze ---
  if(base==='miecz'){
    const S={krotki:[0.64,0.1,0.2,0.26,'none','disc'],dlugi:[0.98,0.088,0.22,0.36,'down','scent'],poltora:[1.08,0.098,0.32,0.44,'fin','scent'],tasak:[0.74,0.17,0.2,0.24,'none','disc']}[vr];
    const [bl0,bw0,gl,gw0,gk0,pk0]=S,bw=bw0*wv,gw=gw0*(VR?0.85+VR()*0.35:1),gk=SL.guard||gk0,pk=SL.pom||pk0,bl=bl0*len;grip(-gl*0.35,gl,0.065);pommel(-gl*0.35-0.04,0.09,pk);guard(gl*0.65+0.03,gk==='disc'?gw*0.55:gw,gk==='disc'?'none':gk);if(gk==='disc'){P(0,y,gl*0.65+0.03,0.16,0.16,0.04,FIT);P(0,y,gl*0.65+0.03,0.12,0.12,0.05,darker(FIT,0.75))}
    P(0,y,gl*0.65+0.09,bw*0.85,0.04,0.06,MD);   // ricasso
    if(vr==='tasak'){P(0,y,gl*0.65+0.12+bl*0.45,bw,0.035,bl*0.9,M);P(-bw/2+0.01,y,gl*0.65+0.12+bl*0.45,0.02,0.025,bl*0.9,ML);P(0.03,y,gl*0.65+0.12+bl*0.94,bw*0.65,0.035,bl*0.1,M);P(bw*0.2,y,gl*0.65+0.12+bl*0.45,0.025,0.04,0.025,MD)}
    else blade(gl*0.65+0.12,bl,bw,0.035);
    if(rar>=4)P(0,y,gl*0.65+0.03,0.03,gw*0.6,0.07,GOLD)}
  // --- topory ---
  else if(base==='topor'){const hl={toporek:0.7,bojowy:0.92,brodaty:0.98,dwureczny:1.3}[vr]*len,zh=hl*0.8,big=vr==='dwureczny';haft(-0.12,hl,0.07);wraps(-0.1,0.24,0.07);P(0,y,-0.14,0.085,0.085,0.05,FIT);
    P(0,y,zh,0.11,0.12,0.16,MD);P(0,y,zh+0.1,0.09,0.09,0.04,FIT);   // tuleja
    const sides=big?[1,-1]:[-1],n=6,reach=(vr==='toporek'?0.24:0.32)*(big?1.05:1);
    const ax=SH?SH.ax:0;
    for(const sd of sides)for(let i=0;i<n;i++){const t=i/(n-1),yy=y+sd*(0.07+t*reach*(ax===5?1.15:1)),span=ax===1?0.16+t*0.06:(vr==='toporek'?0.12:0.14)+t*t*(big?0.34:vr==='brodaty'||ax===2?0.32:ax===5?0.4:0.26),off=vr==='brodaty'||ax===2?-t*t*0.12:ax===4?t*t*0.06:0;
      P(0,yy,zh+off,0.055-t*0.025,reach/n+0.004,span,i===n-1?ML:i>=n-2?M:MF)}
    if(vr==='brodaty')P(0,y-0.2,zh-0.22,0.03,0.05,0.06,M);
    if(ax===3&&!big){for(let k=0;k<3;k++)P(0,y-0.1-k*0.05,zh,0.04-k*0.01,0.05,0.06-k*0.012,k===2?ML:M)}if(ax===4)P(0,y+0.12,zh+0.17,0.04,0.12,0.04,M),P(0,y+0.18,zh+0.22,0.035,0.05,0.04,ML);if(ax===1)P(0,y+0.07+reach,zh,0.04,0.02,0.2,ML);
    if(!big&&!(SH&&SH.ax===3))P(0,y-0.08,zh,0.06,0.06,0.1,MD);
    if(rar>=2)P(0.03,y+0.12,zh,0.02,0.05,0.05,c);if(RU)P(0.032,y+0.2,zh,0.012,0.12,0.03,RU);if(rar>=4)P(0,y,zh+0.1,0.1,0.1,0.02,GOLD);adorn(zh,0.07)}
  // --- młoty ---
  else if(base==='mlot'){const hl={kowalski:0.62,bojowy:1.0,wielki:1.22}[vr]*len,zh=hl*0.86;haft(-0.12,hl,0.08);wraps(-0.1,0.3,0.08);
    for(const s of [1,-1])P(s*0.046,y,zh-0.14,0.012,0.06,0.26,FIT);   // okucia
    if(vr==='kowalski'){P(0,y,zh,0.12,0.36,0.14,MD);P(0,y+0.18,zh,0.11,0.04,0.13,M);P(0,y-0.17,zh,0.06,0.06,0.08,M)}
    else if(vr==='bojowy'){P(0,y,zh,0.14,0.16,0.16,MD);P(0,y+0.12,zh,0.13,0.1,0.13,M);P(0,y+0.18,zh,0.15,0.03,0.15,ML);for(let k=0;k<3;k++)P(0,y-0.1-k*0.06,zh,0.08-k*0.022,0.06,0.08-k*0.022,k===2?ML:M);P(0,y,zh+0.12,0.06,0.06,0.1,M);P(0,y,zh+0.19,0.03,0.03,0.05,ML)}
    else{P(0,y,zh,0.26,0.44,0.26,MD);for(const s of [1,-1]){P(0,y+s*0.24,zh,0.24,0.04,0.24,M);P(0,y+s*0.27,zh,0.2,0.03,0.2,ML)}P(0,y,zh,0.27,0.06,0.27,FIT);P(0,y,zh,0.27,0.3,0.03,FITD);for(const s of [1,-1])for(const t of [1,-1])P(s*0.135,y+t*0.12,zh+s*0.0,0.02,0.04,0.04,FIT)}
    if(SH){const hm=SH.hm;if(hm===1)for(const s of [1,-1])for(let k=0;k<2;k++)P(0,y+s*(0.2+k*0.05),zh,0.1-k*0.03,0.05,0.1-k*0.03,k?ML:M);
      if(hm===2){P(0,y-0.2,zh,0.12,0.08,0.04,M);P(0,y-0.25,zh,0.12,0.04,0.02,ML)}
      if(hm===3)for(const s of [1,-1])for(const a of [-0.03,0.03])for(const b of [-0.03,0.03])P(a,y+s*0.2,zh+b,0.02,0.04,0.02,ML);
      if(hm===4){for(let k=0;k<4;k++)P(0,y-0.18-k*0.06,zh-k*0.02,0.05-k*0.01,0.07,0.05-k*0.01,k===3?ML:M)}}
    if(rar>=2)P(0.075,y,zh,0.01,0.06,0.06,c);if(RU)P(0,y,zh-0.09,0.1,0.14,0.012,RU);if(rar>=4)P(0,y,zh,0.03,0.2,0.29,GOLD);adorn(zh-0.1,0.08)}
  // --- sztylety ---
  else if(base==='sztylet'){const bl={sztylety:0.38,kordziki:0.44,mizerykordie:0.46}[vr]*len;grip(-0.04,0.14,0.055);pommel(-0.07,0.07,vr==='kordziki'?'disc':'ball');guard(0.12,vr==='mizerykordie'?0.1:0.16,SL.guard&&SL.guard!=='disc'?SL.guard:vr==='sztylety'?'down':'none');
    if(vr==='mizerykordie'){for(let k=0;k<5;k++)P(0,y,0.17+k*bl/5+bl/10,0.035-k*0.005,0.035-k*0.005,bl/5+0.002,k===4?ML:M);P(0,y,0.17+bl*0.4,0.012,0.04,bl*0.7,ML)}
    else blade(0.16,bl,vr==='kordziki'?0.085:0.06,0.03,{tip:0.7,steps:3})}
  // --- kostury ---
  else if(base==='kostur'){const hl={laska:1.5,kostur:1.55,arcymaga:1.75}[vr]*len,top=-0.2+hl;
    if(vr==='laska'){haft(-0.2,hl,0.065,'#8a6a44');P(0,y,-0.22,0.08,0.08,0.06,FIT);P(0,y,top,0.09,0.09,0.06,FIT);P(0,y,top+0.07,0.1,0.1,0.1,c);wraps(0.35,0.2,0.065)}
    else if(SH&&SH.st>0&&vr!=='arcymaga'){haft(-0.2,hl,0.07,vr==='laska'?'#8a6a44':WOOD);wraps(0.4,0.22,0.07);const st=SH.st;
      if(st===1){for(let i=0;i<8;i++){const a=i/8*6.283;P(0,y+Math.cos(a)*0.12,top+0.1+Math.sin(a)*0.12,0.04,0.04,0.04,GOLD)}P(0,y,top+0.1,0.1,0.1,0.1,c)}
      if(st===2){for(const s of [1,-1]){P(0,y+s*0.08,top+0.06,0.04,0.04,0.12,WOODD);P(0,y+s*0.06,top+0.16,0.035,0.035,0.06,WOODD)}P(0,y,top+0.12,0.11,0.11,0.11,c)}
      if(st===3)for(const [a,b,h] of [[0,0,0.2],[0.05,0.04,0.14],[-0.05,0.03,0.12],[0.02,-0.05,0.13]])P(a,y+b,top+0.04+h/2,0.06,0.06,h,c);
      if(st===4){P(0,y+0.06,top+0.04,0.06,0.08,0.06,WOOD);P(0,y+0.13,top+0.1,0.06,0.06,0.08,WOOD);P(0,y+0.1,top+0.18,0.06,0.06,0.06,WOODD);P(0,y+0.04,top+0.12,0.02,0.02,0.06,'#c9a24a');P(0,y+0.04,top+0.05,0.09,0.09,0.09,c)}}
    else if(vr==='kostur'){const n=10;for(let i=0;i<n;i++){const o=Math.sin(i*1.7)*0.012;P(o,y+Math.cos(i*1.3)*0.01,-0.2+(i+0.5)*hl/n,0.075-(i%2)*0.008,0.075,hl/n+0.004,i%3?WOOD:WOODD)}
      P(0,y+0.07,top-0.05,0.07,0.08,0.08,WOOD);P(0,y+0.12,top+0.02,0.06,0.07,0.1,WOODD);P(0,y+0.08,top+0.1,0.06,0.06,0.07,WOOD);P(0,y+0.02,top+0.06,0.13,0.13,0.13,c);P(0,y+0.02,top+0.06,0.08,0.15,0.08,'#ffffff');wraps(0.4,0.22,0.075)}
    else{haft(-0.2,hl,0.075,WOODD);for(const z of [0.3,0.9,top-0.15])P(0,y,z,0.095,0.095,0.04,GOLD);P(0,y,top,0.12,0.12,0.06,GOLD);
      for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){P(a*0.1,y+b*0.1,top+0.14,0.03,0.03,0.18,GOLDD);P(a*0.07,y+b*0.07,top+0.26,0.025,0.025,0.06,GOLD)}
      P(0,y,top+0.16,0.16,0.16,0.2,c);P(0,y,top+0.16,0.1,0.1,0.26,'#ffffff');P(0,y,top+0.3,0.06,0.06,0.06,c)}
    if(RU)for(let k=0;k<3;k++)P(0,y,0.55+k*0.12,0.085,0.085,0.03,RU);adorn(top-0.1,0.075)}
  // --- włócznie ---
  else if(base==='wlocznia'){const hl={oszczep:1.35,wlocznia:1.75,pika:2.15}[vr]*len,zt=-0.3+hl;haft(-0.3,hl,0.06,WOODL);wraps(-0.05,0.24,0.06);P(0,y,-0.32,0.07,0.07,0.06,FIT);
    P(0,y,zt+0.04,0.075,0.075,0.12,MD);for(const s of [1,-1])P(s*0.04,y,zt-0.06,0.01,0.03,0.14,FIT);
    if(vr==='pika'){for(let k=0;k<5;k++)P(0,y,zt+0.12+k*0.06,0.045-k*0.007,0.045-k*0.007,0.062,k===4?ML:M)}
    else if(SH&&SH.sp===3){for(const x of [-0.07,0,0.07])for(let k=0;k<4;k++)P(x,y,zt+0.14+k*0.06,0.022,0.022,0.064,k===3?ML:M);P(0,y,zt+0.12,0.18,0.03,0.04,M)}
    else if(SH&&SH.sp===4){for(let k=0;k<6;k++)P(0,y,zt+0.12+k*0.06,0.035-k*0.004,0.035-k*0.004,0.062,k===5?ML:M)}
    else if(SH&&SH.sp===1){const hb=vr==='oszczep'?0.2:0.3;for(let k=0;k<5;k++)P(0,y,zt+0.1+k*hb/5+hb/10,0.13*(1-k/5)+0.02,0.026,hb/5+0.003,k>=3?ML:M)}
    else if(SH&&SH.sp===5){const hb=0.36;for(let k=0;k<6;k++){const t=k/5;P(0,y,zt+0.1+k*hb/6+hb/12,0.17*(t<0.6?1:1-(t-0.6)*2)+0.02,0.026,hb/6+0.003,k>=4?ML:M)}P(0,y,zt+0.1+hb*0.4,0.018,0.036,hb*0.7,MD)}
    else{const hw=vr==='oszczep'?0.08:0.12,hb=vr==='oszczep'?0.2:0.32;if(SH&&SH.sp===2)for(const s of [1,-1])P(s*0.07,y,zt+0.06,0.06,0.03,0.03,MD);for(let k=0;k<6;k++){const t=k/5,w=hw*(t<0.35?0.5+t*1.4:1-(t-0.35)*1.4);P(0,y,zt+0.1+k*hb/6+hb/12,Math.max(0.02,w),0.026,hb/6+0.003,k>=4?ML:M)}P(0,y,zt+0.1+hb*0.45,0.018,0.036,hb*0.85,MD)}
    if(vr==='wlocznia')P(0,y-0.05,zt-0.02,0.02,0.07,0.1,'#a8352a');
    if(RU)P(0,y,zt+0.22,0.016,0.04,0.12,RU);if(rar>=2)P(0,y,zt-0.02,0.08,0.08,0.025,c);adorn(zt,0.06)}
  // --- buzdygany ---
  else if(base==='buzdygan'){const hl=0.82*len,zh=hl*0.94;
    if(vr==='maczuga'){for(let k=0;k<6;k++){const w=0.06+k*0.022;P(0,y,-0.12+k*hl/6+hl/12,w,w,hl/6+0.004,k%2?WOOD:WOODL)}grip(-0.12,0.22,0.065);for(let k=0;k<8;k++){const a=k*0.785,r=0.075+((k%3)*0.08+0.42)/hl*0.05;P(Math.cos(a)*(0.07+(k%3)*0.012),y+Math.sin(a)*(0.07+(k%3)*0.012),0.42+(k%3)*0.09,0.035,0.035,0.035,'#9aa0a6')}}
    else{haft(-0.12,hl,0.065,vr==='morgenstern'?WOODD:WOOD);grip(-0.12,0.22,0.07);P(0,y,-0.15,0.08,0.08,0.05,FIT);P(0,y,zh-0.16,0.085,0.085,0.06,FIT);
      if(vr==='buzdygan'){P(0,y,zh,0.11,0.11,0.24,MD);for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1],[0.7,0.7],[-0.7,0.7],[0.7,-0.7],[-0.7,-0.7]].slice(0,SH?SH.fl:8)){const d=Math.abs(a)>0.5&&Math.abs(b)>0.5?0.07:0.09;P(a*d,y+b*d,zh,a&&b?0.05:a?0.07:0.03,a&&b?0.05:b?0.07:0.03,0.22,M);P(a*d*1.15,y+b*d*1.15,zh,0.025,0.025,0.16,ML)}P(0,y,zh+0.14,0.06,0.06,0.05,FIT)}
      else{P(0,y,zh,0.2,0.2,0.2,MD);P(0,y,zh,0.22,0.16,0.16,M);P(0,y,zh,0.16,0.22,0.16,M);P(0,y,zh,0.16,0.16,0.22,M);for(const [a,b,cz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0.7,0.7,0.4],[-0.7,0.7,-0.4],[0.7,-0.7,-0.4],[-0.7,-0.7,0.4]]){P(a*0.14,y+b*0.14,zh+cz*0.14,0.05,0.05,0.05,'#e8e2cc');P(a*0.18,y+b*0.18,zh+cz*0.18,0.025,0.025,0.025,'#f4f0e0')}}}
    if(rar>=2)P(0,y,zh-0.16,0.09,0.09,0.02,c);if(RU)P(0,y,zh,0.13,0.012,0.13,RU);adorn(zh-0.1,0.065)}
  // --- szable ---
  else if(base==='szabla'){const cv={szabla:0.07,sejmitar:0.11,karabela:0.08}[vr]*(SH?SH.cv:1),n=9,bl=0.92*len,bw=vr==='sejmitar'?0.1:0.08;grip(-0.06,0.2,0.06);
    if(vr==='karabela'){P(0,y,-0.1,0.07,0.1,0.07,FIT);P(0,y+0.06,-0.14,0.06,0.06,0.06,FITD)}else pommel(-0.09,0.07,'ball');
    P(0,y,0.15,0.18,0.06,0.05,FIT);for(const s of [1,-1])P(s*0.1,y+0.02,0.17,0.04,0.05,0.04,FITD);
    if(vr==='karabela'){P(0,y+0.07,0.04,0.025,0.025,0.24,FIT);P(0,y+0.05,-0.08,0.025,0.05,0.025,FIT)}
    for(let i=0;i<n;i++){const t=i/(n-1),z=0.2+t*bl,off=cv*t*t*1.6,w=vr==='sejmitar'?bw*(0.8+t*0.5)*(i===n-1?0.6:1):bw*(i>=n-2?0.7-(i-n+2)*0.25:1);P(0,y+off,z,w,0.034,bl/n+0.008,M);P(0,y+off-0.006,z,w*0.4,0.04,bl/n+0.006,ML)}
    P(0,y+cv*1.6+0.01,0.2+bl+0.04,bw*0.35,0.03,0.06,ML);if(RU)P(0,y+0.02,0.5,0.014,0.044,0.3,RU);if(SL.serr)for(let i=1;i<n-1;i+=1){const t=i/(n-1);P(0,y+cv*t*t*1.6+0.05,0.2+t*bl,0.03,0.03,0.04,MD)}if(SL.tas){P(0,y-0.05,-0.12,0.025,0.08,0.025,SL.tas);P(0,y-0.08,-0.17,0.05,0.05,0.05,SL.tas)}if(SL.band)P(0,y+0.02,0.4,0.03,0.045,0.25,'#d9b23a');if(SL.leaf)P(0,y,0.15,0.22,0.08,0.03,'#5a9a4a')}
  // --- halabardy ---
  else if(base==='halabarda'){const hl=1.95*len,zt=-0.3+hl;haft(-0.3,hl,0.065);wraps(0.0,0.28,0.065);P(0,y,-0.32,0.075,0.075,0.06,FIT);P(0,y,zt-0.2,0.078,0.078,0.3,MD);for(const s of [1,-1])P(s*0.042,y,zt-0.42,0.012,0.04,0.2,FIT);
    if(vr==='halabarda'){for(let i=0;i<5;i++){const t=i/4;P(0,y+0.06+t*0.26,zt-0.2+t*0.05,0.04-t*0.015,0.056,0.2+t*0.26,i===4?ML:i>2?M:MF)}for(let k=0;k<3;k++)P(0,y-0.07-k*0.05,zt-0.18+k*0.03,0.035,0.05,0.06-k*0.01,k===2?ML:M);for(let k=0;k<5;k++)P(0,y,zt+0.0+k*0.06,0.045-k*0.007,0.045-k*0.007,0.062,k===4?ML:M)}
    else if(vr==='glewia'){for(let k=0;k<7;k++){const t=k/6;P(0,y+0.02+t*t*0.06,zt+0.0+k*0.08,0.03,0.11-t*0.06,0.085,k>=5?ML:M);P(0,y-0.03+t*t*0.06,zt+k*0.08,0.034,0.02,0.085,ML)}P(0,y-0.06,zt-0.05,0.03,0.06,0.05,M)}
    else{for(let k=0;k<7;k++){const t=k/6;P(0,y+0.1+t*0.32,zt+0.08+Math.sin(t*2.6)*0.12,0.03,0.07,0.12-t*0.06,k===6?ML:M);P(0,y+0.1+t*0.32,zt+0.08+Math.sin(t*2.6)*0.12-0.05,0.032,0.06,0.02,ML)}}
    if(SH&&vr!=='kosa'){if(SH.hb===1)for(let k=0;k<4;k++)P(0,y-0.08-k*0.05,zt-0.2+k*0.04,0.03,0.05,0.05,k===3?ML:M);if(SH.hb===2)for(const s of [1,-1])P(0,y+s*0.06,zt-0.3,0.03,0.08,0.03,M);if(SH.hb===3){P(0,y,zt+0.3,0.03,0.03,0.08,ML);P(0,y+0.04,zt+0.24,0.03,0.06,0.03,M)}}
    if(rar>=2)P(0,y,zt-0.36,0.085,0.085,0.025,c);if(RU)P(0.022,y+0.15,zt-0.15,0.01,0.12,0.03,RU);adorn(zt-0.3,0.065)}
  // --- kusze ---
  else if(base==='kusza'){const s=len,heavy=vr==='ciezka',light=vr==='lekka';
    P(0,y,0.28*s,0.075,0.09,0.74*s,WOOD);P(0,y-0.02,-0.05,0.09,0.16,0.18,WOODD);P(0,y+0.05,0.36*s,0.03,0.012,0.6*s,'#3a2414');   // łoże i rowek
    P(0,y-0.08,0.1,0.02,0.1,0.03,FITD);P(0,y+0.05,0.12,0.05,0.04,0.05,FIT);   // spust i orzech
    const pw=(heavy?0.92:light?0.66:0.8)*(SH?0.85+SH.cb*0.12:1),pc=heavy||vr==='kusza'?M:WOODL,n=6,pcv=SH?[0.12,0.04,0.2][SH.cb]:0.12;
    for(let i=0;i<n;i++){const t=i/(n-1);for(const sd of [1,-1])P(sd*(0.05+t*pw/2),y+0.02,0.62*s-t*t*pcv,pw/n*0.55+0.02,heavy?0.06:0.045,heavy?0.07:0.05,i===n-1?MD:pc)}
    P(0,y+0.02,0.62*s,0.12,0.08,0.09,FIT);P(0,y+0.02,0.7*s,0.12,0.03,0.03,FITD);for(const sd of [1,-1])P(sd*0.06,y+0.02,0.74*s,0.02,0.03,0.08,FITD);   // strzemię
    P(0,y+0.06,0.36*s,0.012,0.012,0.52*s,'#e8e2cc');for(const sd of [1,-1])P(sd*(pw/4+0.03),y+0.06,0.56*s-0.06,pw/2-0.04,0.01,0.01,'#e8e2cc');
    P(0,y+0.075,0.42*s,0.025,0.025,0.42*s,'#7a5230');P(0,y+0.075,0.66*s,0.04,0.04,0.06,'#b8bec4');   // bełt
    if(heavy){P(0,y-0.02,-0.16,0.16,0.05,0.05,FIT);for(const sd of [1,-1])P(sd*0.1,y-0.02,-0.16,0.03,0.12,0.03,FITD)}
    if(rar>=2)P(0.04,y-0.02,0.2,0.012,0.05,0.05,c);if(RU)P(0.04,y,0.4,0.01,0.03,0.2,RU);adorn(0.4*s,0.08)}
  // --- różdżki ---
  else if(base==='rozdzka'){if(vr==='berlo'){P(0,y,0.24,0.05,0.05,0.62,GOLDD);for(const z of [0,0.18,0.36,0.5])P(0,y,z,0.07,0.07,0.03,GOLD);P(0,y,0.58,0.1,0.1,0.06,GOLD);for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])P(a*0.07,y+b*0.07,0.67,0.03,0.03,0.12,GOLD);P(0,y,0.68,0.13,0.13,0.13,c);P(0,y,0.77,0.04,0.04,0.06,GOLD)}
    else{for(let k=0;k<6;k++)P(0,y,-0.02+k*0.1+0.05,0.05-k*0.004,0.05-k*0.004,0.104,k%2?'#e8dcc0':'#d8c8a8');for(const z of [0.12,0.3])P(0,y,z,0.06,0.06,0.02,'#8a6a44');P(0,y,0.6,0.06,0.06,0.04,'#c9a64a');P(0,y,0.66,0.09,0.09,0.1,c);P(0,y,0.66,0.05,0.11,0.05,'#ffffff')}
    if(RU)P(0,y,0.3,0.06,0.06,0.12,RU);adorn(0.45,0.05)}
  else return null;if(base==='mlot')for(const b of L)b[1]=2*y-b[1];
  // v136: halabarda — ostrze obrócone o 180° wokół drzewca; kostury i broń drzewcowa trzymane w połowie drzewca
  if(base==='halabarda'&&vr==='halabarda')for(const b of L){b[0]=-b[0];b[1]=2*y-b[1]}
  if(base==='kostur'||base==='wlocznia'||base==='halabarda'||(base==='mlot'&&vr==='wielki')){let z0=1e9,z1=-1e9;for(const b of L){z0=Math.min(z0,b[2]-b[5]/2);z1=Math.max(z1,b[2]+b[5]/2)}const dz=-(z0+(base==='kostur'?0.45:0.42)*(z1-z0));for(const b of L)b[2]+=dz}
  return L}
const BOWV={krotki:[0.82,'#8a6238','#9a7248',0.06],mysliwski:[1,'#7a5230','#8a6238',0.055],dlugi:[1.28,'#6b4a2b','#7a5532',0.05],refleks:[1.0,'#3a2414','#5a3a22',0.058],elfi:[1.12,'#e8e2cc','#d8d0b8',0.05],kosciany:[1.05,'#e8e0c8','#cfc4a8',0.062]};
const BLK=[null,['#7a1a14','#a8302a','#c8302a'],['#2a1c12','#3a2a1c','#e8e0c8'],['#3a2a20','#4a3828','#1a2a5a'],['#e8e2cc','#cfe0c0','#2a5a3a'],['#2e262c','#3a2a30','#5a1a1a','#ff3030'],['#8fd8f0','#b8e8f8','#2a4a6a','#d8f8ff'],['#8a3010','#a84018','#3a1a0a','#ffb030'],['#b8dcee','#d8eef8','#2a4a6a','#ffffff'],['#3a2a5a','#4a3a6a','#1a1030','#c890ff']];
function bowGroup(rar,vr,lk,sd){const VB=sd?mulb(sd):null;
  const c=RAR[rar].c,b=new THREE.Group(),y=-0.3,V=BOWV[vr]||BOWV.mysliwski,BS2=BLK[lk||0],w1=rar>=4?'#c9a24a':BS2?BS2[0]:V[1],w2=rar>=4?'#e0b84a':BS2?BS2[1]:V[2],th=V[3],L=[],P=(...q)=>L.push(q),LEA=BS2?BS2[2]:rar>=3?'#2a1c12':'#4a3020';
  // rękojeść z owijką i podstawką pod strzałę
  P(0,y,0,th+0.025,th+0.035,0.18,LEA);for(let k=0;k<4;k++)P(0,y,-0.07+k*0.047,th+0.035,th+0.045,0.018,'#6a4a2a');P(0,y+0.04,0.1,0.03,0.025,0.03,'#8a6a44');
  const BSR=sd?mulb(sd*13+5):null,bcv=BSR?0.1+BSR()*0.16:0.17,btip=BSR?Math.floor(BSR()*3):0;
  const n=8;for(const sg of [1,-1])for(let i=0;i<n;i++){const t=(i+0.5)/n,z=sg*(0.09+t*0.56),yy=y+bcv*t*t-(vr==='refleks'&&t>0.75?(t-0.75)*0.5:0),w=th*(1-t*0.45);
    P(0,yy,z,w,w*1.15,0.56/n+0.012,i%2?w1:w2);if(vr==='kosciany'&&i%2===1)P(0,yy,z,w+0.016,w*1.15+0.016,0.02,'#5a4a3a')}
  for(const sg of [1,-1]){const yy=y+bcv-(vr==='refleks'?0.12:0);P(0,yy,sg*0.67,th*0.6,th*0.8,0.04,'#efe6cc');P(0,yy+0.012,sg*0.69,th*0.4,th*0.5,0.02,'#2a1c12')}
  if(btip===1&&vr!=='refleks')for(const sg of [1,-1]){P(0,y+bcv-0.03,sg*0.71,th*0.6,0.05,0.05,w2);P(0,y+bcv-0.07,sg*0.73,th*0.5,0.04,0.04,'#efe6cc')}
  if(btip===2)for(const sg of [1,-1])P(0,y+0.04,sg*0.36,th+0.03,0.03,0.08,w2);
  if(vr==='refleks')for(const sg of [1,-1]){P(0,y+0.08,sg*0.7,th*0.6,0.05,0.05,w2);P(0,y+0.04,sg*0.72,th*0.55,0.04,0.04,'#efe6cc')}
  if(vr==='elfi')for(const sg of [1,-1]){for(const t of [0.3,0.6]){const z=sg*(0.09+t*0.56),yy=y+bcv*t*t;P(0.03,yy,z,0.012,0.08,0.06,'#5a9a4a');P(-0.03,yy,z,0.012,0.08,0.06,'#5a9a4a');P(0.035,yy+0.03,z+sg*0.03,0.01,0.04,0.04,'#86c060')}P(0,y+0.1,sg*0.45,th*0.7,0.012,0.12,'#d9b23a')}
  if(vr==='dlugi')for(const sg of [1,-1])P(0,y+0.05,sg*0.3,th+0.01,th+0.01,0.02,'#a8352a');
  if(lk===1)for(const sg of [1,-1]){P(0,y+0.13,sg*0.6,0.02,0.1,0.02,'#c8302a');P(0,y+0.08,sg*0.6,0.04,0.04,0.04,'#e05040')}
  if(lk===2)for(const sg of [1,-1]){P(0,y+0.2,sg*0.66,th*0.7,0.07,0.05,'#e8e0c8');P(0,y-0.02,sg*0.05,th+0.05,th+0.05,0.08,'#6a5a48')}
  if(lk===3)for(const sg of [1,-1])for(const t of [0.25,0.55])P(0,y+bcv*t*t,sg*(0.09+t*0.56),th+0.014,th*1.15+0.014,0.025,'#d9b23a');
  if(lk>=5){const gc='!'+BS2[3];for(const sg of [1,-1]){for(const t of [0.3,0.6,0.9])P(0,y+bcv*t*t,sg*(0.09+t*0.56),th+0.012,th*1.15+0.012,0.02,gc);P(0,y+0.19,sg*0.68,th*0.8,th,0.06,gc)}if(lk===5)for(const sg of [1,-1])P(0,y+0.24,sg*0.62,0.03,0.08,0.03,BS2[0]);if(lk===6||lk===8)for(const sg of [1,-1])P(0.03,y+0.1,sg*0.4,0.03,0.08,0.03,BS2[1])}
  if(lk===4)for(const sg of [1,-1])for(const t of [0.2,0.45,0.7]){const z=sg*(0.09+t*0.56),yy=y+bcv*t*t;P(0.028,yy,z,0.01,0.06,0.05,'#5a9a4a');P(-0.028,yy,z,0.01,0.06,0.05,'#5a9a4a')}
  if(rar>=2)for(const sg of [1,-1])P(0,y+0.02,sg*0.11,th+0.02,th+0.03,0.025,c);if(rar>=3)for(const sg of [1,-1])P(0,y+0.07,sg*0.4,th*0.7,0.012,0.14,WRUNE[rar]);
  if(VB&&!(lk>0)){const sh=0.85+VB()*0.3;for(const q of L)if(q[6]===w1||q[6]===w2)q[6]=darker(q[6],sh)}
  b.add(new THREE.Mesh(boxes(L),decoMat));{const G=L.filter(q=>typeof q[6]==='string'&&q[6][0]==='!');if(G.length)b.add(new THREE.Mesh(boxes(G.map(q=>[q[0]*1.03,q[1],q[2],q[3]*1.06,q[4]*1.06,q[5]*1.02,q[6]])),GLOWMAT))}b.scale.z=V[0]*(VB?0.94+VB()*0.12:1);
  const half=sg=>{const p=new THREE.Group();p.position.set(0,y+bcv-(vr==='refleks'?0.12:0),sg*0.68);p.add(new THREE.Mesh(boxes([[0,0,-sg*0.34,0.012,0.012,0.68,'#efe8d6']]),decoMat));b.add(p);return p};
  b.userData={sU:half(1),sD:half(-1),L:L.concat([[0,y+bcv-(vr==='refleks'?0.12:0),0,0.024,0.024,1.36,'#efe8d6']]),sz:V[0]};b.traverse(o=>{if(o.isMesh)o.castShadow=true});return b;
}
function accBoxes(it){const c=RAR[it.rar||0].c,r=it.rar||0,k=it.lk,L=[],P=(...q)=>L.push(q),GD=r>=2?'#d9b23a':'#c4ccd2',GD2=darker(GD,0.78);
  if(it.base==='pierscien'){const ring=(rad,th,col,cy=0.04)=>{for(let i=0;i<10;i++){const a=i/10*6.283;P(Math.cos(a)*rad,cy+Math.sin(a)*rad,0,th,th,0.07,col)}};
    if(k===1){ring(0.16,0.07,GD);P(0,0.25,0,0.2,0.08,0.13,GD);P(0,0.29,0,0.16,0.02,0.1,GD2);P(0,0.3,0,0.06,0.012,0.06,c)}
    if(k===2){for(let i=0;i<12;i++){const a=i/12*6.283;P(Math.cos(a)*0.16,0.04+Math.sin(a)*0.16,(i%2)*0.03-0.015,0.06,0.06,0.04,i%2?GD:GD2)}P(0,0.26,0,0.08,0.08,0.08,c)}
    if(k===3){ring(0.15,0.05,GD,0.04);for(let i=0;i<10;i++){const a=i/10*6.283;P(Math.cos(a)*0.15,0.04+Math.sin(a)*0.15,0.05,0.05,0.05,0.03,GD2)}P(0,0.24,0.03,0.08,0.06,0.14,c)}
    if(k===4){ring(0.16,0.07,'#c4ccd2');P(0,0.26,0,0.14,0.12,0.12,'#e8e2cc');P(0.04,0.27,0.06,0.03,0.03,0.012,'#141414');P(-0.04,0.27,0.06,0.03,0.03,0.012,'#141414');P(0,0.22,0.06,0.06,0.015,0.012,'#141414')}
    if(k===5){for(let i=0;i<14;i++){const a=i/14*6.283*1.15;P(Math.cos(a)*0.16,0.04+Math.sin(a)*0.16,i*0.004,0.06,0.06,0.06,i%3?'#5a9a4a':'#3a7a3a')}P(0.1,0.18,0.04,0.07,0.05,0.05,'#5a9a4a');P(0.13,0.2,0.07,0.02,0.02,0.012,c)}
    return L}
  if(it.base==='amulet'){for(let i=0;i<7;i++){const t=i/6;P(-0.18+t*0.36,0.46+0.06*(1-Math.sin(t*Math.PI)),0,0.045,0.03,0.03,i%2?GD2:GD)}for(const s of [1,-1])P(s*0.18,0.34,0,0.03,0.2,0.03,GD);P(0,0.27,0,0.05,0.04,0.04,GD);
    if(k===1){for(let i=0;i<7;i++){const a=-1.2+i*0.4;P(Math.cos(a)*0.12,0.12+Math.sin(a)*0.12,0,0.06,0.06,0.05,GD)}P(0.06,0.12,0.03,0.05,0.05,0.03,c)}
    if(k===2){P(0,0.14,0,0.08,0.1,0.06,'#e8e0c8');P(0,0.06,0,0.06,0.08,0.05,'#e8e0c8');P(0,0.0,0,0.04,0.06,0.04,'#d8d0b8');P(0,0.2,0,0.1,0.03,0.07,GD);P(0,0.12,0.035,0.03,0.03,0.012,c)}
    if(k===3){P(0,0.12,0,0.06,0.28,0.05,GD);P(0,0.16,0,0.22,0.06,0.05,GD);P(0,0.16,0.03,0.06,0.06,0.03,c);for(const s of [1,-1])P(s*0.11,0.16,0,0.03,0.08,0.05,GD2)}
    if(k===4){P(0,0.12,0,0.26,0.16,0.05,GD);P(0,0.12,0.02,0.2,0.1,0.04,'#f2ead8');P(0,0.12,0.04,0.08,0.08,0.03,c);P(0,0.12,0.05,0.04,0.04,0.02,'#141414')}
    if(k===5){P(0,0.12,0,0.1,0.1,0.05,c);for(const [a,b] of [[0,1],[0,-1],[1,0],[-1,0]])P(a*0.1,0.12+b*0.1,0,a?0.1:0.05,b?0.1:0.05,0.04,GD);for(const [a,b] of [[1,1],[-1,1],[1,-1],[-1,-1]])P(a*0.07,0.12+b*0.07,0,0.04,0.04,0.04,GD2)}
    return L}
  if(it.base==='latarnia'){const fr=r>=3?'#a8822a':'#3a3a40';
    if(k===1){P(0,0.04,0,0.2,0.06,0.2,'#3a2a20');for(const [y,w] of [[0.12,0.26],[0.2,0.34],[0.28,0.36],[0.36,0.32],[0.43,0.24]])P(0,y,0,w,0.08,w,'#e84a3a');for(const y of [0.16,0.24,0.32,0.4])P(0,y,0,0.37,0.012,0.37,'#a8302a');P(0,0.5,0,0.2,0.05,0.2,'#3a2a20');P(0,0.58,0,0.03,0.1,0.03,'#3a2a20');P(0,0.0,0,0.06,0.06,0.06,'#d9b23a');P(0,0.28,0,0.14,0.14,0.14,'!#ffe6a0')}
    if(k===2){P(0,0.03,0,0.3,0.06,0.3,'#c9a24a');P(0,0.27,0,0.24,0.36,0.24,c+'~');P(0,0.26,0,0.12,0.18,0.12,'!#ffe6a0');for(const [a,b] of [[1,1],[-1,1],[1,-1],[-1,-1]])P(a*0.13,0.27,b*0.13,0.04,0.42,0.04,'#c9a24a');for(let i=0;i<4;i++)P(0,0.5+i*0.04,0,0.3-i*0.07,0.04,0.3-i*0.07,'#d9b23a');P(0,0.68,0,0.05,0.05,0.05,'#d9b23a');for(const s of [1,-1])P(0,0.27,s*0.13,0.02,0.36,0.012,'#a8822a')}
    if(k===3){P(0,0.04,0,0.26,0.06,0.26,'#3a3a40');P(0,0.2,0,0.28,0.24,0.26,'#e8e2cc');P(0,0.36,0,0.24,0.12,0.22,'#e8e2cc');P(0.07,0.24,0.131,0.07,0.08,0.012,'!#ffb030');P(-0.07,0.24,0.131,0.07,0.08,0.012,'!#ffb030');P(0,0.14,0.131,0.12,0.03,0.012,'#3a3228');P(0,0.46,0,0.1,0.06,0.1,'#3a3a40');P(0,0.54,0,0.14,0.03,0.03,'#5a5a62')}
    if(k===4){P(0,0.03,0,0.24,0.06,0.24,'#c8d0d8');for(const [x,h] of [[0,0.4],[0.08,0.3],[-0.08,0.28],[0.04,0.22],[-0.05,0.2]])P(x,0.06+h/2,x*0.6,0.07,h,0.07,'!#bfe8ff');P(0,0.3,0,0.06,0.3,0.06,'!#ffffff');P(0,0.5,0,0.03,0.08,0.03,'#c8d0d8')}
    return L}
  return null}
function itemBoxes(it){if(it.lk&&(it.base==='pierscien'||it.base==='amulet'||it.base==='latarnia')){const a=accBoxes(it);if(a)return a}const L=itemBoxesS(it);
  if(L&&it.sd&&['helm','zbroja','rekawice','buty'].includes(it.base)){const T=TRIMC[Math.floor(it.sd/9)%TRIMC.length],P=(...q)=>L.push(q);
    if(it.base==='helm')P(0,0.085,0,0.575,0.03,0.575,T);if(it.base==='zbroja'){P(0,0.6,0.16,0.42,0.025,0.012,T);P(0,0.12,0.164,0.56,0.025,0.012,T)}if(it.base==='rekawice')P(0,0.42,0.02,0.29,0.025,0.25,T);if(it.base==='buty')P(0,0.5,-0.06,0.27,0.025,0.29,T);
    const Q=mulb(it.sd*17+3),M=gMat(it),M2=darker(M,0.8),M3=darker(M,1.15),s1=Math.floor(Q()*5),s2=Math.floor(Q()*4),s3=Q()<0.5;
    if(it.base==='helm'){if(s1===1)for(let k=0;k<4;k++)P(0,0.52+k*0.05,0,0.3-k*0.08,0.05,0.3-k*0.08,k===3?M3:M);if(s1===2){P(0,0.1,0,0.8,0.04,0.8,M);P(0,0.08,0,0.84,0.02,0.84,M2)}if(s1===3)P(0,0.55,0,0.05,0.1,0.5,M3),P(0,0.6,-0.05,0.04,0.06,0.36,M3);if(s1===4){P(0,0.52,0,0.36,0.1,0.36,M);P(0,0.6,0,0.22,0.08,0.22,M3);for(const s of [1,-1])P(s*0.28,0.12,0.1,0.04,0.26,0.24,M2)}}
    if(it.base==='zbroja'){for(const s of [1,-1]){if(s2===1)for(let k=0;k<3;k++)P(s*(0.42+k*0.03),0.6-k*0.07,0,0.3-k*0.04,0.07,0.42,k%2?M2:M3);if(s2===2){P(s*0.4,0.6,0,0.3,0.06,0.4,M3);P(s*0.42,0.66,0,0.26,0.04,0.36,M2)}if(s2===3)for(const z of [-0.1,0.1])P(s*0.44,0.66,z,0.04,0.12,0.04,M3)}if(s3){P(0,0.68,0,0.36,0.1,0.32,M2);P(0,0.74,0,0.3,0.04,0.28,M3)}}
    if(it.base==='rekawice'){if(s2===1){P(0,0.5,0.02,0.38,0.1,0.34,M2);P(0,0.56,0.02,0.42,0.03,0.38,M3)}if(s2===2)for(let i=0;i<4;i++)P(-0.09+i*0.06,0.03,0.17,0.05,0.05,0.04,M3);if(s2===3)P(0,0.6,0.02,0.24,0.14,0.2,M)}
    if(it.base==='buty'){if(s2===1){P(0,0.07,0.37,0.18,0.1,0.12,M);P(0,0.06,0.45,0.1,0.07,0.08,M3)}if(s2===2){P(0,0.58,-0.06,0.34,0.08,0.36,M2);P(0,0.63,-0.06,0.36,0.03,0.38,M3)}if(s2===3){P(0,0.6,0.1,0.24,0.12,0.06,M3);P(0,0.6,0.13,0.1,0.06,0.03,M2)}}}
  if(L&&it.base==='zbroja'){const cc=CAPEOF(it);if(cc){L.push([0,0.12,-0.2,0.6,0.74,0.04,cc],[0,-0.24,-0.2,0.62,0.04,0.05,darker(cc,0.65)],[0,0.52,-0.18,0.62,0.07,0.07,darker(cc,0.75)])}}
  return L}
function itemBoxesS(it){const L=itemBoxes0(it);if(!L||!it.lk||!['helm','zbroja','rekawice','buty'].includes(it.base))return L;
  const M=it.lk>=5?FTH[it.lk].m:it.mat?ARMT.find(a=>a.k===it.mat).c:MET[it.rar||0],M2=darker(M,0.78),M3=darker(M,1.15),FUR='#8a6a4a',FUR2='#a8886a',G='#d9b23a',RV='#d8dde2',P=(...q)=>L.push(q),k=it.lk;
  if(k>=5){const T=FTH[k],A=T.a,R=T.r,MAIL='#8a9096';
    if(it.base==='helm'){P(0,0.2,0.285,0.42,0.035,0.012,'#141414');P(0,0.42,0,0.05,0.05,0.5,M3);P(0,0.32,0.285,0.46,0.03,0.012,R);for(let i=0;i<6;i++)P(-0.2+i*0.08,0.32,0.29,0.025,0.025,0.01,A);
      if(k===5||k===8)P(0,0.0,-0.06,0.6,0.14,0.48,MAIL);if(k===7)P(0,0.47,0,0.04,0.06,0.46,R);if(k===6)for(const x of [-0.16,0.16])P(x,0.4,0,0.025,0.04,0.48,M3);if(k===9)P(0,0.36,0.285,0.52,0.04,0.012,R)}
    if(it.base==='zbroja'){P(0,0.58,0.168,0.36,0.03,0.012,R);P(0,0.0,0.168,0.36,0.03,0.012,R);P(0,0.3,0.172,0.03,0.5,0.008,M3);for(let r=0;r<3;r++)for(const sx of [-1,1])P(sx*0.14,0.14+r*0.16,0.174,0.025,0.025,0.008,A);
      for(const s of [1,-1])P(s*0.36,0.62,0,0.16,0.06,0.28,M),P(s*0.36,0.56,0,0.15,0.05,0.26,M2);if(k===5||k===8)P(0,-0.12,0.15,0.38,0.12,0.02,MAIL)}
    if(it.base==='rekawice')P(0,0.3,0.113,0.25,0.025,0.012,R);
    if(it.base==='buty'){P(0,0.4,0.075,0.2,0.025,0.012,R);P(0,0.25,0.08,0.06,0.06,0.012,A)}
    return L}
  if(it.base==='helm'){if(k===1){P(0,0.0,-0.06,0.6,0.14,0.48,'#8a9096');P(0,0.3,0.28,0.48,0.03,0.012,'#5a3a22')}
    if(k===2){P(0,0.15,0.27,0.06,0.26,0.03,M2);for(let i=0;i<7;i++)P(-0.24+i*0.08,0.12,0.285,0.025,0.025,0.012,RV);P(0,0.42,0.27,0.3,0.03,0.012,M3)}
    if(k===3){P(0,0.22,0,0.58,0.46,0.58,M);P(0,0.46,0,0.5,0.04,0.5,M2);P(0,0.29,0.292,0.44,0.035,0.01,'#141414');P(0,0.17,0.294,0.05,0.28,0.012,M3);P(0,0.21,0.294,0.32,0.03,0.012,M3);for(let i=0;i<4;i++)P(-0.09+i*0.06,0.1,0.294,0.02,0.02,0.012,'#141414')}
    if(k===4){P(0,0.5,0,0.32,0.06,0.32,M);P(0,0.56,0,0.2,0.06,0.2,M);P(0,0.62,0,0.1,0.06,0.1,M3);P(0,0.67,0,0.04,0.08,0.04,M3);P(0,0.15,0.27,0.05,0.26,0.03,M2);P(0,0.0,-0.06,0.6,0.14,0.48,'#9aa0a6');P(0,-0.04,-0.06,0.62,0.04,0.5,'#7a8086')}}
  if(it.base==='zbroja'){if(k===1){P(0,0.22,0.166,0.36,0.52,0.012,'#2f5f8f');P(0,0.22,0.172,0.08,0.52,0.01,G);P(0,0.34,0.176,0.13,0.13,0.01,G);P(0,0.34,0.18,0.07,0.07,0.01,'#a8302a');P(0,-0.08,0.155,0.34,0.16,0.02,'#2f5f8f')}
    if(k===2)for(let r=0;r<4;r++)for(let q=-2;q<=2;q++)P(q*0.1,0.14+r*0.12,0.163,0.03,0.03,0.012,RV);
    if(k===3)for(let r=0;r<6;r++)for(let q=-3;q<=3;q++)if(Math.abs(q*0.075+(r%2)*0.037)<0.26)P(q*0.075+(r%2)*0.037,0.1+r*0.08,0.163,0.065,0.055,0.012,r%2?M2:M3);
    if(k===4){P(0,0.64,0,0.68,0.12,0.4,FUR);P(0,0.7,0,0.52,0.06,0.34,FUR2);for(const s of [1,-1])P(s*0.3,0.58,0.12,0.08,0.08,0.12,FUR2);P(0,0.6,0.2,0.06,0.06,0.02,G)}}
  if(it.base==='rekawice'){if(k===1)for(let i=0;i<4;i++)P(-0.09+i*0.06,0.06,0.2,0.025,0.025,0.06,RV);if(k===2){P(0,0.5,0.02,0.34,0.1,0.3,FUR);P(0,0.55,0.02,0.3,0.04,0.26,FUR2)}if(k===3){P(0,0.54,0.02,0.36,0.14,0.32,M2);P(0,0.62,0.02,0.4,0.04,0.36,M3)}if(k===4){P(0,0.3,0.113,0.25,0.02,0.01,G);P(0,0.44,0.13,0.06,0.06,0.02,G);P(0,0.2,0.113,0.25,0.02,0.01,G)}}
  if(it.base==='buty'){if(k===1){P(0,0.57,-0.06,0.32,0.1,0.34,FUR);P(0,0.62,-0.06,0.28,0.04,0.3,FUR2)}if(k===2){P(0,0.1,-0.22,0.04,0.04,0.08,'#c9a24a');P(0,0.1,-0.28,0.07,0.07,0.02,G)}if(k===3){P(0,0.6,0.1,0.24,0.12,0.06,M3);P(0,0.66,0.12,0.14,0.06,0.04,M2)}if(k===4){P(0,0.4,-0.06,0.26,0.03,0.28,G);P(0.13,0.4,0.0,0.02,0.05,0.05,G);P(0,0.2,0.2,0.18,0.02,0.02,G)}}
  return L}
function itemBoxes0(it){const c=RAR[it.rar||0].c,mt=it.mat,MATC0=it.lk>=18&&EPCOL[it.lk]?EPCOL[it.lk]:it.lk>=5&&FTH[it.lk]?FTH[it.lk].m:mt?ARMT.find(a=>a.k===mt).c:MET[it.rar||0],MATC=it.sd?darker(MATC0,0.86+(it.sd%9)/9*0.28):MATC0,M=MATC,M2=darker(M,0.78),M3=darker(M,1.15),metal=!mt||mt==='kolcz'||mt==='plyt'||mt==='krasn'||mt==='smok',
  Lt='#6b4528',LtD='#4a2f1d',RV=metal?'#d8dde2':'#c9a24a',ST=metal?darker(M,0.6):'#e8d8b0',r=it.rar||0,L=[],P=(...q)=>L.push(q);
  switch(it.base){
    case 'tarcza':{const v=it.var||'okuta',W='#7a5030';if(v==='puklerz'){for(let i=0;i<12;i++){const a=i/12*Math.PI*2;P(Math.cos(a)*0.32,0.4+Math.sin(a)*0.32,0,0.16,0.16,0.08,M2)}P(0,0.4,0,0.56,0.56,0.06,M);P(0,0.4,0.05,0.18,0.18,0.08,c)}
      else if(v==='wiezowa'){P(0,0.45,0,0.6,1.0,0.06,W);for(const y of [0.0,0.9])P(0,y,0.01,0.64,0.06,0.08,M);for(const x of [-0.3,0.3])P(x,0.45,0.01,0.06,1.0,0.08,M);P(0,0.45,0.05,0.16,0.2,0.04,c)}
      else if(v==='herbowa'){for(let i=0;i<6;i++){const w=0.62-i*0.09;P(0,0.75-i*0.12,0,w,0.13,0.06,i%2?c:M)}P(0,0.45,0.04,0.07,0.66,0.02,'#f0e8d0');P(0,0.55,0.04,0.44,0.07,0.02,'#f0e8d0')}
      else{for(let i=0;i<5;i++)P(-0.24+i*0.12,0.45,0,0.115,0.74,0.06,i%2?W:'#8a5a30');P(0,0.8,0.01,0.64,0.06,0.08,M);P(0,0.1,0.01,0.64,0.06,0.08,M);P(0,0.45,0.05,0.16,0.16,0.06,c)}if(r>=3&&(v==='okuta'||v==='wiezowa'))for(const [x,y] of [[-0.22,0.72],[0.22,0.72],[-0.22,0.18],[0.22,0.18]])P(x,y,0.05,0.05,0.05,0.04,'#d8dde2');if(r>=4)P(0,0.45,0.08,0.08,0.08,0.03,'#ffffff');return L}
    case 'helm':{if(mt==='skora'||mt==='elf'){P(0,0.22,0,0.5,0.3,0.5,M);P(0,0.4,0,0.4,0.1,0.4,M3);P(0,0.47,0,0.26,0.05,0.26,M3);P(0,0.1,0,0.54,0.06,0.54,M2);for(let k=0;k<6;k++)P(-0.2+k*0.08,0.2,0.252,0.02,0.18,0.01,ST);P(0.255,0.05,0.04,0.02,0.22,0.24,M2);P(-0.255,0.05,0.04,0.02,0.22,0.24,M2);if(mt==='elf'){P(0,0.36,0.25,0.18,0.08,0.02,'#d9b23a');P(0.18,0.44,-0.1,0.04,0.2,0.06,'#5a9a4a');P(-0.18,0.44,-0.1,0.04,0.2,0.06,'#5a9a4a')}}
      else{P(0,0.2,0,0.52,0.34,0.52,M);P(0,0.4,0,0.44,0.08,0.44,M3);P(0,0.46,0,0.32,0.06,0.32,M3);P(0,0.5,0,0.16,0.04,0.16,M3);P(0,0.06,0,0.56,0.05,0.56,M2);
        P(0,0.18,0.262,0.42,0.04,0.012,'#141414');P(0,0.12,0.262,0.08,0.18,0.012,M2);for(const s of [1,-1]){P(s*0.08,0.25,0.262,0.06,0.02,0.012,'#141414');P(s*0.27,0.1,0.06,0.03,0.22,0.3,M2)}
        for(let k=0;k<5;k++)P(-0.2+k*0.1,0.06,0.282,0.025,0.025,0.012,RV);if(mt==='krasn')for(const s of [1,-1])P(s*0.3,0.34,0,0.08,0.06,0.06,'#e8e0c8'),P(s*0.36,0.42,0,0.05,0.12,0.05,'#e8e0c8');if(mt==='smok')for(let k=0;k<4;k++)P(0,0.48-k*0.05,-0.12-k*0.06,0.04,0.08,0.06,'#d8a040')}
      if(r>=2)P(0,0.11,0,0.57,0.035,0.57,c);if(r>=3)P(0,0.36,0.27,0.07,0.07,0.012,c);if(r>=4)P(0,0.44,0.22,0.14,0.08,0.02,'#d9b23a');return L}
    case 'zbroja':{P(0,0.3,0,0.58,0.58,0.3,M);P(0,0.36,0.152,0.5,0.4,0.012,M3);P(0,0.36,0.158,0.04,0.42,0.01,M2);
      for(const s of [1,-1]){for(let k=0;k<3;k++)P(s*(0.36+k*0.03),0.56-k*0.07,0,0.24-k*0.03,0.06,0.36,k%2?M2:M);P(s*0.36,0.58,0.12,0.04,0.04,0.02,RV)}
      P(0,0.62,0,0.4,0.06,0.32,M2);P(0,0.06,0,0.6,0.07,0.32,Lt);P(0,0.06,0.162,0.1,0.08,0.012,'#d9b23a');
      if(metal){for(let k=0;k<4;k++)P(0,-0.03-k*0.04,0,0.56-k*0.02,0.035,0.29,mt==='kolcz'?'#9aa0a6':k%2?M2:M);for(const s of [1,-1])for(const yy of [0.2,0.32,0.44])P(s*0.24,yy,0.158,0.025,0.025,0.012,RV)}
      else{for(let k=0;k<4;k++)P(-0.21+k*0.14,-0.06,0.1,0.12,0.12,0.04,Lt);for(const yy of [0.18,0.3,0.42])P(0,yy,0.159,0.46,0.012,0.01,ST)}
      if(mt==='elf'){P(0,0.36,0.162,0.06,0.3,0.01,'#d9b23a');P(0.1,0.42,0.162,0.12,0.04,0.01,'#5a9a4a');P(-0.1,0.3,0.162,0.12,0.04,0.01,'#5a9a4a')}
      if(mt==='smok')for(let k=0;k<5;k++)P(-0.2+k*0.1,0.24+(k%2)*0.06,0.162,0.08,0.08,0.012,'#d8a040');
      P(0,0.36,0.168,0.12,0.12,0.012,c);if(r>=4)P(0,0.62,0.16,0.42,0.04,0.012,'#d9b23a');return L}
    case 'rekawice':{P(0,0.08,0.02,0.26,0.2,0.24,metal?M:Lt);for(let k=0;k<4;k++)P(-0.09+k*0.06,0.0,0.15,0.05,0.08,0.06,k%2?M2:M);P(0.15,0.12,0.06,0.07,0.14,0.08,M);
      P(0,0.3,0.02,0.24,0.22,0.2,M);P(0,0.44,0.02,0.28,0.08,0.24,M2);P(0,0.48,0.02,0.3,0.03,0.26,c);if(metal){for(let k=0;k<3;k++)P(0,0.16+k*0.05,0.14,0.26,0.025,0.02,M3);P(0,0.3,0.112,0.03,0.03,0.01,RV)}else for(const yy of [0.24,0.36])P(0,yy,0.112,0.24,0.01,0.01,ST);return L}
    case 'buty':{P(0,0.32,-0.06,0.24,0.42,0.26,metal?M:Lt);P(0,0.08,0.1,0.25,0.16,0.48,Lt);P(0,0.0,0.11,0.27,0.04,0.5,'#2a1c12');P(0,0.0,-0.12,0.2,0.06,0.12,'#1a120c');P(0,0.54,-0.06,0.28,0.07,0.3,c);
      if(metal){P(0,0.34,0.075,0.22,0.36,0.02,M3);P(0,0.13,0.25,0.22,0.12,0.12,M);P(0,0.2,0.18,0.2,0.06,0.06,M2);for(const yy of [0.2,0.32,0.44])P(0.125,yy,-0.06,0.012,0.03,0.03,RV)}
      else{for(const yy of [0.22,0.38])P(0,yy,-0.06,0.25,0.04,0.27,LtD),P(0.13,yy,0.02,0.02,0.05,0.05,'#c9a24a');P(0,0.14,0.345,0.2,0.06,0.012,ST)}return L}
    case 'pierscien':{for(let k=0;k<8;k++){const a=k/8*6.283;P(Math.cos(a)*0.16,0.04+Math.sin(a)*0.16,0,0.075,0.075,0.07,r>=2?'#d9b23a':'#c4ccd2')}P(0,0.24,0,0.16,0.06,0.12,r>=2?'#e0b84a':'#d8dde2');for(const s of [1,-1])P(s*0.06,0.3,0,0.025,0.06,0.025,'#d9b23a');P(0,0.31,0,0.12,0.1,0.1,c);P(0.02,0.34,0.03,0.04,0.03,0.03,'#ffffff');return L}
    case 'amulet':{for(let k=0;k<7;k++){const t=k/6,x=-0.18+t*0.36,yy=0.46-Math.sin(t*Math.PI)*-0.06+0.06*(1-Math.sin(t*Math.PI));P(x,yy,0,0.05,0.035,0.035,k%2?'#a8822a':'#c9a24a')}for(const s of [1,-1])P(s*0.18,0.34,0,0.035,0.2,0.035,'#c9a24a');
      P(0,0.12,0,0.26,0.28,0.05,'#d9b23a');P(0,0.12,0.01,0.2,0.22,0.05,'#a8822a');P(0,0.12,0.03,0.13,0.15,0.04,c);P(0.03,0.16,0.05,0.04,0.04,0.02,'#ffffff');P(0,-0.04,0,0.06,0.06,0.04,'#d9b23a');P(0,0.28,0,0.05,0.05,0.05,'#d9b23a');return L}
    case 'latarnia':{const fr=r>=3?'#a8822a':'#3a3a40';P(0,0.02,0,0.32,0.05,0.32,fr);P(0,0.06,0,0.28,0.03,0.28,darker(fr,1.3));P(0,0.25,0,0.25,0.36,0.25,c+'~');P(0,0.24,0,0.12,0.18,0.12,'#ffe6a0');P(0,0.15,0,0.05,0.06,0.05,'#e8e2cc');
      for(const [a,b] of [[1,1],[-1,1],[1,-1],[-1,-1]])P(a*0.135,0.25,b*0.135,0.035,0.42,0.035,fr);for(const s of [1,-1]){P(0,0.25,s*0.135,0.2,0.02,0.012,fr);P(s*0.135,0.25,0,0.012,0.02,0.2,fr)}
      P(0,0.47,0,0.32,0.05,0.32,fr);for(let k=0;k<3;k++)P(0,0.52+k*0.04,0,0.24-k*0.07,0.04,0.24-k*0.07,fr);P(0,0.66,0,0.03,0.06,0.03,fr);P(0,0.71,0,0.16,0.03,0.03,'#5a5a62');P(0,0.69,0,0.03,0.02,0.1,'#5a5a62');return L}
    case 'potion':{const LQ='#d0303e',LQD='#8e1f26',LQL='#ff6a74',GL='#d8eef4',GLD='#a8c8d4';
      // kulista kolba z warstw
      for(const [y,w,col] of [[0.03,0.2,GLD],[0.08,0.32,LQD],[0.14,0.4,LQ],[0.21,0.42,LQ],[0.28,0.38,LQ],[0.33,0.3,LQL]])P(0,y,0,w,0.07,w*0.86,col),P(0,y,0,w*0.86,0.07,w,col);
      P(0,0.37,0,0.22,0.03,0.22,GL+'~');P(0,0.36,0,0.24,0.02,0.24,'#ff9aa2');
      P(0,0.43,0,0.12,0.1,0.12,GL);P(0,0.49,0,0.15,0.03,0.15,GLD);P(0,0.535,0,0.1,0.06,0.1,'#8a6a44');P(0,0.57,0,0.12,0.03,0.12,'#a8302a');P(0,0.555,0,0.13,0.012,0.13,'#7a1a1a');
      P(0,0.45,0,0.135,0.02,0.135,'#c9a24a');P(0.07,0.42,0.06,0.02,0.08,0.02,'#c9a24a');
      P(0.13,0.24,0.15,0.05,0.12,0.012,'#ffffff');P(0.15,0.16,0.14,0.03,0.05,0.012,'#ffd0d4');for(const [x,y] of [[-0.06,0.12],[-0.02,0.2],[0.04,0.1]])P(x,y,0.19,0.025,0.025,0.012,'#ff9aa2');
      P(0,0.2,0.2,0.18,0.12,0.012,'#e8dcb8');P(0,0.2,0.206,0.14,0.08,0.01,'#f2ead8');P(0,0.2,0.21,0.04,0.06,0.008,'#a8302a');P(0,0.2,0.21,0.08,0.02,0.008,'#a8302a');return L}
    case 'food':{const k=it.var;const ap=(c1,c2,s=1)=>{P(0,0.16*s,0,0.3*s,0.26*s,0.3*s,c1);P(0,0.16*s,0,0.34*s,0.18*s,0.24*s,c1);P(0,0.16*s,0,0.24*s,0.18*s,0.34*s,c1);P(0,0.31*s,0,0.04,0.08,0.04,'#5a3b22');P(0.05,0.33*s,0,0.1,0.03,0.06,'#5a9a4a');P(-0.08,0.22*s,0.13*s,0.06,0.06,0.03,c2)};
      switch(k){
      case 'koniczyna':for(const [a,b] of [[0.1,0],[-0.06,0.08],[-0.06,-0.08]])P(a,0.3,b,0.14,0.04,0.14,'#5aae4a'),P(a,0.32,b,0.06,0.02,0.06,'#86c870');P(0,0.15,0,0.03,0.3,0.03,'#4a8a3a');return L;
      case 'siano':P(0,0.15,0,0.42,0.3,0.32,'#d8b24a');P(0,0.15,0,0.44,0.04,0.34,'#8a6a3a');P(0.12,0.15,0,0.04,0.32,0.34,'#8a6a3a');P(-0.12,0.15,0,0.04,0.32,0.34,'#8a6a3a');for(let i=0;i<6;i++)P(-0.18+i*0.07,0.31+(i%2)*0.02,0.05,0.02,0.04,0.2,'#e8c860');return L;
      case 'jablko':ap('#c8302a','#ff8a7a');P(0.1,0.24,0.12,0.04,0.08,0.02,'#ffb0a0');P(0,0.06,0,0.18,0.04,0.18,'#8a1a14');P(0.11,0.3,0,0.08,0.02,0.05,'#6aae4a');return L;
      case 'zlote_jablko':ap('#e0b030','#fff0a0');P(0,0.16,0,0.36,0.04,0.36,'#ffe080');return L;
      case 'ziarno':P(0,0.06,0,0.36,0.1,0.36,'#8a6a3a');for(let i=0;i<9;i++)P(-0.12+(i%3)*0.12,0.13+(i%2)*0.02,-0.12+Math.floor(i/3)*0.12,0.07,0.05,0.05,'#e0c060');return L;
      case 'owies':P(0,0.18,0,0.32,0.34,0.28,'#c8b080');P(0,0.36,0,0.2,0.06,0.18,'#a89060');P(0,0.4,0,0.1,0.04,0.1,'#6b4a2b');P(0,0.2,0.145,0.16,0.12,0.01,'#8a6a3a');for(let i=0;i<4;i++)P(-0.06+i*0.04,0.46,0,0.02,0.1,0.02,'#e0c870');return L;
      case 'marchew':for(let k2=0;k2<5;k2++)P(0,0.04+k2*0.08,0,0.06+k2*0.025,0.09,0.06+k2*0.025,k2%2?'#e87a20':'#f08a30');P(0.03,0.45,0,0.03,0.12,0.03,'#4a9a3a');P(-0.03,0.45,0.02,0.03,0.1,0.03,'#5aae4a');return L;
      case 'jagody':P(0,0.05,0,0.38,0.08,0.32,'#8a6a3a');for(const x of [-0.12,-0.04,0.04,0.12])P(x,0.05,0.165,0.03,0.08,0.012,'#6a4a2a');for(const [a,b,cc] of [[0.14,-0.08,'#3a2a7a'],[-0.14,-0.06,'#4a2a6a'],[0.03,0.08,'#2a2a6a'],[-0.03,-0.12,'#5a2a8a']])P(a,0.17,b,0.07,0.07,0.07,cc),P(a+0.015,0.2,b+0.015,0.02,0.02,0.02,'#c8c0f0');for(const [a,b,cc] of [[0,0,'#3a3a8a'],[0.1,0.06,'#4a2a6a'],[-0.1,0.05,'#2a2a6a'],[0.05,-0.08,'#5a2a8a'],[-0.06,-0.07,'#3a3a8a'],[0,0.1,'#a8302a']])P(a,0.14,b,0.08,0.08,0.08,cc);P(0.12,0.2,-0.06,0.08,0.02,0.05,'#4a8a3a');return L;
      case 'kurczak':P(0,0.04,0,0.46,0.04,0.36,'#d8d0c0');P(0,0.12,0,0.34,0.2,0.26,'#b8702a');P(0,0.2,0,0.28,0.1,0.2,'#d08a3a');P(0,0.25,0,0.2,0.03,0.12,'#e8a050');P(-0.1,0.17,0.12,0.06,0.04,0.02,'#8a4a1a');P(0.08,0.2,-0.1,0.05,0.03,0.02,'#8a4a1a');for(const s of [1,-1])P(s*0.14,0.08,0.14,0.08,0.08,0.16,'#b8702a'),P(s*0.14,0.08,0.24,0.04,0.04,0.06,'#f2ead8');return L;
      case 'miod':P(0,0.06,0,0.38,0.1,0.32,'#c88a10');for(let r=0;r<3;r++)for(let q=0;q<4;q++){const x=-0.14+q*0.09+(r%2)*0.045,z=-0.09+r*0.09;if(Math.abs(x)<0.18){P(x,0.12,z,0.075,0.03,0.075,'#f8c840');P(x,0.13,z,0.045,0.02,0.045,'#e09010')}}P(0.14,0.06,0.17,0.04,0.08,0.03,'#e0a020');P(0.14,0.0,0.17,0.03,0.04,0.03,'#f0b030');P(-0.1,0.16,-0.05,0.04,0.02,0.04,'#ffe080');return L;
      case 'daktyle':for(const [a,b] of [[0,0],[0.1,0.05],[-0.1,0.04],[0.04,-0.09],[-0.06,-0.08]])P(a,0.08,b,0.08,0.08,0.16,'#6a3a1a'),P(a,0.11,b,0.05,0.03,0.12,'#8a5a2a');return L;
      case 'szarancza':P(0,0.1,0,0.1,0.1,0.36,'#7a9a3a');P(0,0.13,0.17,0.1,0.1,0.08,'#6a8a2a');for(const s of [1,-1])P(s*0.08,0.14,-0.04,0.04,0.16,0.06,'#5a7a2a'),P(s*0.06,0.16,0.04,0.02,0.06,0.2,'#a8c870');return L;
      case 'sledz':case 'ryba':{const c1=k==='sledz'?'#9ab0c0':'#a88a5a',c2=darker(c1,0.75),c3=darker(c1,1.2);P(0,0.13,0,0.12,0.16,0.44,c1);P(0,0.13,0.04,0.13,0.2,0.24,c1);P(0,0.13,0.2,0.11,0.12,0.08,c1);P(0,0.13,0.25,0.09,0.08,0.04,c2);P(0,0.19,0,0.122,0.04,0.4,c2);P(0,0.08,0.02,0.122,0.04,0.36,c3);for(const z of [-0.12,-0.04,0.04,0.12])P(0,0.14,z,0.124,0.12,0.012,c2);P(0,0.13,-0.27,0.03,0.24,0.06,c2);P(0,0.13,-0.3,0.025,0.3,0.03,c1);P(0,0.25,-0.02,0.02,0.06,0.18,c2);P(0,0.03,0.0,0.02,0.04,0.1,c2);P(0.062,0.16,0.18,0.012,0.04,0.04,'#f2ead8');P(0.068,0.16,0.185,0.008,0.022,0.022,'#141414');return L}
      case 'porost':for(const [a,b,cc] of [[0,0,'#8a9a6a'],[0.1,0.05,'#a8b080'],[-0.08,0.06,'#7a8a5a'],[0.03,-0.1,'#98a870']])P(a,0.08,b,0.14,0.12,0.14,cc);return L;
      case 'sol':P(0,0.12,0,0.3,0.24,0.26,'#f2eee6');P(0.06,0.2,0.04,0.16,0.16,0.16,'#ffffff');P(-0.08,0.08,-0.06,0.12,0.12,0.12,'#e0dcd4');return L;
      case 'chleb':P(0,0.1,0,0.4,0.18,0.26,'#c88a3a');P(0,0.12,0,0.44,0.12,0.2,'#c88a3a');P(0,0.2,0,0.34,0.06,0.2,'#a86a2a');P(0,0.235,0,0.26,0.02,0.14,'#8a5420');for(const x of [-0.1,0,0.1])P(x,0.245,0,0.03,0.015,0.16,'#f0d090');P(0,0.04,0,0.42,0.04,0.28,'#7a4a18');P(0.26,0.07,0.12,0.09,0.08,0.09,'#d8a050');P(0.26,0.11,0.12,0.06,0.02,0.06,'#f2d8a0');return L;
      case 'wodorosty':for(let i=0;i<4;i++)P(-0.09+i*0.06,0.18,0,0.04,0.36-(i%2)*0.08,0.06,i%2?'#3a7a4a':'#2a6a3a');P(0,0.04,0,0.3,0.06,0.16,'#5a8a5a');return L;
      case 'kielbasa':for(let i=0;i<5;i++)P(-0.16+i*0.08,0.1+Math.sin(i*0.8)*0.05,0,0.09,0.1,0.1,i%2?'#a8402a':'#b8503a');P(0.22,0.14,0,0.03,0.04,0.03,'#d8c8a0');return L;
      case 'mieso':P(-0.04,0.1,0,0.34,0.16,0.28,'#c84a4a');P(-0.04,0.12,0,0.38,0.12,0.22,'#c84a4a');P(-0.04,0.19,0,0.3,0.02,0.2,'#e06a6a');for(const [x,z] of [[-0.12,0.06],[0.02,-0.06],[-0.06,-0.02]])P(x,0.2,z,0.08,0.01,0.025,'#f2d8d0');P(-0.04,0.1,0.14,0.34,0.14,0.012,'#f2e0d4');P(0.18,0.1,0,0.14,0.06,0.06,'#f2ead8');P(0.27,0.1,0,0.06,0.11,0.11,'#f2ead8');P(0.27,0.1,0,0.08,0.06,0.06,'#e8dcc8');return L;
      case 'zoledzie':for(const [a,b] of [[0,0],[0.12,0.05],[-0.1,0.06]])P(a,0.08,b,0.1,0.12,0.1,'#a87a3a'),P(a,0.16,b,0.12,0.05,0.12,'#6a4a2a'),P(a,0.2,b,0.02,0.04,0.02,'#4a2f1d');return L;
      case 'galareta':P(0,0.12,0,0.3,0.24,0.3,'#7ad15a~');P(0,0.12,0,0.2,0.16,0.2,'#a8f080');P(0.06,0.2,0.08,0.05,0.05,0.05,'#ffffff');return L;
      case 'malze':for(const [a,b] of [[0,0],[0.12,0.06],[-0.11,0.05]])P(a,0.06,b,0.12,0.08,0.09,'#3a3a5a'),P(a,0.1,b,0.1,0.02,0.07,'#5a5a7a');return L;
      case 'muchy':P(0,0.16,0,0.26,0.3,0.26,'#cfe6ee~');P(0,0.33,0,0.28,0.05,0.28,'#8a6a3a');for(const [a,b,cc] of [[0.05,0.12,0],[-0.05,0.2,0.05],[0,0.08,-0.06]])P(a,b,cc,0.04,0.03,0.04,'#1a1a1a');return L;
      case 'jajo':P(0,0.16,0,0.24,0.3,0.24,'#e8e0c8');P(0,0.16,0,0.28,0.2,0.28,'#e8e0c8');P(0,0.32,0,0.14,0.04,0.14,'#f2ead8');P(0.08,0.2,0.13,0.04,0.04,0.02,'#8a2a8a');P(-0.05,0.1,0.14,0.03,0.03,0.02,'#8a2a8a');return L;
      case 'skarabeusz':P(0,0.08,0,0.26,0.12,0.32,'#2a6a7a');P(0,0.14,0,0.02,0.02,0.32,'#1a3a4a');P(0,0.1,0.18,0.14,0.08,0.08,'#1a4a5a');for(const s of [1,-1])P(s*0.15,0.04,0,0.06,0.03,0.24,'#1a2a2a');P(0.06,0.15,0.04,0.04,0.02,0.06,'#d9b23a');return L;
      case 'lod':P(0,0.14,0,0.2,0.28,0.2,'#bfe8ff');P(0.1,0.1,0.05,0.1,0.2,0.1,'#dff4ff');P(-0.08,0.08,-0.06,0.1,0.16,0.1,'#9fd8f8');P(0,0.3,0,0.08,0.08,0.08,'#ffffff');return L;
      case 'ziola':P(0,0.12,0,0.34,0.22,0.26,'#8aa04a');P(0,0.12,0,0.36,0.04,0.28,'#6a4a2a');for(let i=0;i<5;i++)P(-0.12+i*0.06,0.28,0.02,0.03,0.12,0.03,i%2?'#c8d070':'#a8c060');return L;
      case 'galazki':for(let i=0;i<5;i++)P(-0.12+i*0.06,0.06+(i%2)*0.03,0,0.04,0.04,0.44,i%2?'#8a6a3a':'#6a4a2a');P(0.1,0.14,0.12,0.1,0.04,0.06,'#6aae4a');return L;
      case 'robaki':P(0,0.05,0,0.36,0.08,0.36,'#5a3a22');for(let i=0;i<4;i++)P(-0.1+i*0.07,0.11,-0.08+(i%2)*0.14,0.04,0.04,0.16,'#d88a8a');return L;
      case 'krewetki':for(const [a,b] of [[0,0],[0.1,0.08],[-0.1,-0.06]])P(a,0.08,b,0.08,0.08,0.22,'#f08a6a'),P(a,0.1,b+0.1,0.06,0.06,0.06,'#e86a4a');return L;
      case 'mrozne_serce':P(0,0.16,0,0.24,0.24,0.18,'#7fd8ff');P(0,0.2,0,0.3,0.12,0.2,'#a8e8ff');P(0,0.06,0,0.1,0.1,0.1,'#5ab8e8');P(0.05,0.24,0.1,0.05,0.05,0.02,'#ffffff');return L;
      case 'zatrute_mieso':P(0,0.1,0,0.36,0.16,0.26,'#7a3a3a');P(0,0.18,0,0.3,0.04,0.2,'#6aae3a');P(0.1,0.2,0.06,0.06,0.04,0.06,'#9ae05a');return L;
      case 'krysztal':P(0,0.14,0,0.2,0.28,0.2,'#e0303a');P(0.1,0.1,0.05,0.1,0.2,0.1,'#ff6a6a');P(-0.08,0.08,-0.06,0.1,0.16,0.1,'#b0202a');P(0,0.3,0,0.08,0.08,0.08,'#ffd0d0');return L;
      default:ap('#8a6a3a','#c8a060');return L}}
  }return null}

function weaponGeoOld(base,rar){
  const c=RAR[rar].c,y=-0.3;
  if(base==='kostur')return boxes([[0,y,0.25,0.07,0.07,1.5,'#5a3b22'],[0,y,1.03,0.13,0.13,0.06,'#c9a64a'],[0,y,1.14,0.22,0.22,0.22,c],[0,y,0.0,0.09,0.09,0.12,'#3a2416']]);
  if(base==='topor')return boxes([[0,y,0.33,0.07,0.07,0.95,'#6b4a2b'],[0,y+0.15,0.68,0.05,0.36,0.26,'#c9cfd4'],[0,y+0.15,0.57,0.06,0.3,0.06,'#8a8f94'],[0,y-0.05,0.68,0.06,0.07,0.09,c],[0,y,0.0,0.08,0.08,0.08,'#3a2416']]);
  if(base==='mlot')return boxes([[0,y,0.38,0.08,0.08,1.05,'#6b4a2b'],[0,y,0.9,0.36,0.26,0.26,'#8a8f94'],[0,y+0.14,0.9,0.18,0.03,0.18,c],[0.19,y,0.9,0.03,0.18,0.18,'#6f747a'],[-0.19,y,0.9,0.03,0.18,0.18,'#6f747a']]);
  if(base==='wlocznia')return boxes([[0,y,0.55,0.06,0.06,1.75,'#7a5230'],[0,y,1.5,0.1,0.03,0.3,'#d7dde2'],[0,y,1.36,0.12,0.06,0.06,c],[0,y,1.12,0.07,0.07,0.1,'#3a2416']]);
  if(base==='buzdygan')return boxes([[0,y,0.3,0.07,0.07,0.8,'#5a3b22'],[0,y,0.78,0.24,0.24,0.24,'#8a8f94'],[0,y+0.14,0.78,0.06,0.06,0.18,'#aeb6bd'],[0,y-0.14,0.78,0.06,0.06,0.18,'#aeb6bd'],[0.14,y,0.78,0.06,0.18,0.06,'#aeb6bd'],[-0.14,y,0.78,0.06,0.18,0.06,'#aeb6bd'],[0,y,0.92,0.08,0.08,0.06,c]]);
  if(base==='szabla')return boxes([[0,y,0.03,0.06,0.06,0.2,'#5a3b22'],[0,y,0.15,0.22,0.06,0.05,c],[0,y+0.02,0.5,0.09,0.035,0.6,'#d7dde2'],[0,y+0.06,0.88,0.08,0.035,0.25,'#d7dde2'],[0,y+0.1,1.04,0.06,0.03,0.14,'#c8cdd2']]);
  if(base==='halabarda')return boxes([[0,y,0.6,0.07,0.07,1.9,'#6b4a2b'],[0,y+0.14,1.4,0.04,0.34,0.3,'#c9cfd4'],[0,y-0.08,1.4,0.04,0.12,0.14,'#c9cfd4'],[0,y,1.65,0.05,0.05,0.34,'#d7dde2'],[0,y,1.28,0.09,0.09,0.06,c]]);
  if(base==='kusza')return boxes([[0,y,0.3,0.08,0.1,0.7,'#6b4a2b'],[0,y+0.02,0.6,0.7,0.06,0.06,'#5a3b22'],[0.34,y+0.02,0.55,0.04,0.04,0.12,'#3a2416'],[-0.34,y+0.02,0.55,0.04,0.04,0.12,'#3a2416'],[0,y+0.06,0.4,0.02,0.02,0.5,'#e8e2cc'],[0,y-0.08,0.15,0.05,0.12,0.05,c]]);
  if(base==='rozdzka')return boxes([[0,y,0.25,0.05,0.05,0.6,'#e8dcc0'],[0,y,0.58,0.08,0.08,0.06,'#c9a64a'],[0,y,0.66,0.12,0.12,0.12,c]]);
  if(base==='sztylet')return boxes([[0,y,0.05,0.06,0.06,0.16,'#4a3020'],[0,y,0.15,0.18,0.04,0.04,c],[0,y,0.36,0.06,0.03,0.38,'#d7dde2'],[0,y,0.36,0.02,0.035,0.34,'#aeb6bd']]);
  return boxes([[0,y,0.03,0.07,0.07,0.22,'#5a3b22'],[0,y,-0.1,0.09,0.09,0.06,c],[0,y,0.17,0.34,0.07,0.07,'#8f949a'],[0,y,0.66,0.1,0.04,0.86,'#d7dde2'],[0,y,0.66,0.03,0.045,0.8,'#aeb6bd'],[0,y,1.12,0.06,0.04,0.08,'#d7dde2']]);
}
const arrowNockGeo=()=>boxes([[0,0,0,0.035,0.035,0.78,'#8a6a44'],[0,0,0.4,0.06,0.06,0.09,'#b8bec4'],[0,0.04,-0.33,0.01,0.06,0.12,'#f2efe6'],[0.04,0,-0.33,0.06,0.01,0.12,'#e04a3a']]);
function bowDraw(g,draw,showArrow){const u=g.userData;if(!u.bow)return;const s=u.bow.userData,a=Math.atan2(draw*0.56,0.64);s.sU.rotation.x=a;s.sD.rotation.x=-a;
  if(u.nock){u.nock.visible=showArrow;if(showArrow){u.nock.position.set(-0.05,1.34,0.62-draw*0.32)}}}
// ===== broń dwuręczna: lewa dłoń chwyta drzewce/łoże (IK dwóch kości w układzie tułowia) =====
const TWOSET=new Set(),_ik={a:new THREE.Vector3(),b:new THREE.Vector3(),c:new THREE.Vector3(),d:new THREE.Vector3(),q:new THREE.Quaternion(),q2:new THREE.Quaternion(),dn:new THREE.Vector3(0,-1,0),m:new THREE.Matrix4()};
// broń z krótką rękojeścią (miecz dwuręczny, topór, młot): lewa dłoń tuż pod prawą, na rękojeści od strony głowicy — jak na kosturze, nie na ostrzu
function ikBehind(u){if(u.ikB!=null)return u.ikB;const G=ikGrip(u),H=[0,-0.3,0.02],P=u.wm.geometry.attributes.position.array;let dx=G[0]-H[0],dy=G[1]-H[1],dz=G[2]-H[2];const l=Math.hypot(dx,dy,dz)||1;dx/=l;dy/=l;dz/=l;let bh=0;
  for(let i=0;i<P.length;i+=3){const q=-((P[i]-H[0])*dx+(P[i+1]-H[1])*dy+(P[i+2]-H[2])*dz);if(q>bh){const lat=Math.hypot(P[i]-H[0]+q*dx,P[i+1]-H[1]+q*dy,P[i+2]-H[2]+q*dz);if(lat<0.09)bh=q}}
  return u.ikB=bh>0.13?-Math.min(0.16,bh-0.05):0.12}
function ikGrip(u){if(u.ikGrip)return u.ikGrip;if(u.wkey&&u.wkey.startsWith('kusza'))return u.ikGrip=[0,-0.31,0.34];const g=u.wm.geometry,P=g.attributes.position.array,H=[0,-0.3,0.02];let far=0,fx=0,fy=0,fz=1;
  for(let i=0;i<P.length;i+=3){const dx=P[i]-H[0],dy=P[i+1]-H[1],dz=P[i+2]-H[2],d=dx*dx+dy*dy+dz*dz;if(d>far){far=d;fx=dx;fy=dy;fz=dz}}
  const L=Math.sqrt(far)||1,k=u.wkey&&u.wkey.startsWith('kusza')?Math.min(0.42,L*0.55):Math.min(0.34,L*0.32);return u.ikGrip=[H[0]+fx/L*k,H[1]+fy/L*k,H[2]+fz/L*k]}
function twoHandIK(g){const u=g.userData;if(!u||!u.two||!u.wm||!u.la||!u.le||!u.ra||!u.re||u.ikOff||u.blockPose){if(u&&u._ik&&u.la){u.la.rotation.y=0;u.la.rotation.z=0;u.le.rotation.y=0;u.le.rotation.z=0;u._ik=0}return}
  const I=_ik,G=ikGrip(u);u.ra.updateMatrix();u.re.updateMatrix();u.wm.updateMatrix();I.m.multiplyMatrices(u.ra.matrix,u.re.matrix).multiply(u.wm.matrix);
  // oś drzewca: od dłoni (0,-0.3,0.02) w stronę punktu chwytu; lewa dłoń łapie najbliższy lewemu barkowi punkt drzewca
  I.c.set(0,-0.3,0.02).applyMatrix4(I.m);I.d.set(G[0],G[1],G[2]).applyMatrix4(I.m).sub(I.c);const gl=I.d.length()||1;I.d.multiplyScalar(1/gl);
  const S=u.la.position,sc=u.la.scale.y||1,L1=0.28*sc,L2=0.3*sc;I.b.copy(S).sub(I.c);const pole=/^(halabarda|wlocznia|kostur)/.test(u.wkey||''),tt=pole||/^kusza/.test(u.wkey||'')?Math.max(/^kusza/.test(u.wkey||'')?0.18:-0.22,Math.min(gl*1.3,I.b.dot(I.d))):ikBehind(u);const t2=Math.abs(tt)<0.13?(tt<0?-0.13:0.13):tt;I.a.copy(I.c).addScaledVector(I.d,t2);
  I.b.copy(I.a).sub(S);let D=I.b.length();if(D<1e-4)return;if(D>L1+L2+0.35){if(u._ik){u.la.rotation.y=0;u.la.rotation.z=0;u.le.rotation.y=0;u.le.rotation.z=0;u._ik=0}return}const t=I.b.multiplyScalar(1/D);D=Math.min(L1+L2-0.005,Math.max(Math.abs(L1-L2)+0.02,D));
  const ca=Math.max(-1,Math.min(1,(L1*L1+D*D-L2*L2)/(2*L1*D))),sa=Math.sqrt(1-ca*ca);I.c.set(-1.0,-0.55,-0.25);I.c.addScaledVector(t,-I.c.dot(t));if(I.c.lengthSq()<1e-6)I.c.set(0,0,-1);I.c.normalize();
  const uX=t.x*ca+I.c.x*sa,uY=t.y*ca+I.c.y*sa,uZ=t.z*ca+I.c.z*sa;I.d.set(uX,uY,uZ);I.q.setFromUnitVectors(I.dn,I.d);u.la.quaternion.copy(I.q);
  I.c.set(S.x+uX*L1,S.y+uY*L1,S.z+uZ*L1);I.b.copy(I.a).sub(I.c).normalize();I.q2.setFromUnitVectors(I.dn,I.b);u.le.quaternion.copy(I.q.invert()).multiply(I.q2);u._ik=1}
const _bk={a:new THREE.Vector3(),b:new THREE.Vector3(),c:new THREE.Vector3(),m:new THREE.Matrix4(),m2:new THREE.Matrix4(),q:new THREE.Quaternion(),z:new THREE.Vector3(0,0,1)},BOWSET=new Set();
function armIK(sh,el,T,pole){const I=_ik,S=sh.position,sc=sh.scale.y||1,L1=0.28*sc,L2=0.3*sc;I.b.copy(T).sub(S);let D=I.b.length();if(D<1e-4)return;const t=I.b.multiplyScalar(1/D);D=Math.min(L1+L2-0.005,Math.max(Math.abs(L1-L2)+0.02,D));
  const ca=Math.max(-1,Math.min(1,(L1*L1+D*D-L2*L2)/(2*L1*D))),sa=Math.sqrt(1-ca*ca);I.c.copy(pole);I.c.addScaledVector(t,-I.c.dot(t));if(I.c.lengthSq()<1e-6)I.c.set(0,0,-1);I.c.normalize();
  I.d.set(t.x*ca+I.c.x*sa,t.y*ca+I.c.y*sa,t.z*ca+I.c.z*sa);I.q.setFromUnitVectors(I.dn,I.d);sh.quaternion.copy(I.q);I.c.copy(S).addScaledVector(I.d,L1);I.b.copy(T).sub(I.c).normalize();I.q2.setFromUnitVectors(I.dn,I.b);el.quaternion.copy(I.q.invert()).multiply(I.q2)}
function bowIK(g){const u=g.userData,B=u.bowIK;if(!B||!u.bow||!u.la||!u.le||!u.ra||!u.re||!u.torso)return;const K=_bk;u.la.updateMatrix();u.le.updateMatrix();u.torso.updateMatrix();
  K.m.multiplyMatrices(u.la.matrix,u.le.matrix);K.a.set(0,-0.3,0.02).applyMatrix4(K.m);// chwyt łuku (torso)
  K.b.set(0,-0.13,0).applyMatrix4(K.m);K.c.set(0.06,0.6,0.16);K.b.lerp(K.c,B.d*0.92);// cięciwa / nasada strzały (torso)
  armIK(u.ra,u.re,K.b,new THREE.Vector3(0.35,0.3,-1));u._bik=1;
  if(u.nock&&B.arrow){K.c.copy(K.a).sub(K.b);const L=K.c.length()||1;K.c.multiplyScalar(1/L);const P=K.b.clone().addScaledVector(K.c,0.39).applyMatrix4(u.torso.matrix);u.nock.position.copy(P);K.q.setFromUnitVectors(K.z,K.c);const tq=new THREE.Quaternion().setFromRotationMatrix(K.m2.extractRotation(u.torso.matrix));u.nock.quaternion.copy(tq.multiply(K.q));u.nock.visible=true}}
function ikTick(){for(const g of BOWSET){const u=g.userData;if(!u||!u.bowIK){if(u&&u._bik){u._bik=0;u.ra.rotation.y=0;u.re.rotation.y=0;u.re.rotation.z=0}BOWSET.delete(g);continue}let o=g,ok=false;for(let i=0;i<14&&o;i++){if(o===scene){ok=true;break}o=o.parent}if(ok&&g.visible)try{bowIK(g)}catch(_){}u.bowIK=null}
  for(const g of TWOSET){const u=g.userData;if(!u||!u.two){TWOSET.delete(g);continue}let o=g,ok=false;for(let i=0;i<14&&o;i++){if(o===scene){ok=true;break}o=o.parent}if(!ok)continue;if(!g.visible)continue;try{twoHandIK(g)}catch(_){}}}
function setWeapon(g,base,rar,vr,lk,sd){
  if(base&&!vr&&WEAPV[base]){const d=WEAPV[base].find(v=>v[2]===1&&v[3]===1)||WEAPV[base][0];vr=d[0]}
  const u=g.userData;const wk=base+rar+(vr||'')+(lk||0)+'.'+(sd||0);if(u.wkey===wk)return;u.wkey=wk;
  for(const k of ['wm','wm2','bow','quiver','nock']){if(u[k]){u[k].parent&&u[k].parent.remove(u[k]);u[k]=null}}u.two=false;
  if(!base)return;
  if(base==='luk'){u.bow=bowGroup(rar,vr,lk,sd);u.le.add(u.bow);
    u.quiver=new THREE.Mesh(boxes([[0.12, 0.36, -0.26, 0.24, 0.74, 0.2, '#7a4e2c'], [0.12, 0.36, -0.37, 0.2, 0.68, 0.02, '#5e3a20'], [0.12, 0.03, -0.26, 0.27, 0.07, 0.23, '#3e2716'], [0.12, 0.7, -0.26, 0.27, 0.07, 0.23, '#3e2716'], [0.12, 0.36, -0.26, 0.27, 0.05, 0.23, '#c9a24a'], [0.24, 0.36, -0.26, 0.02, 0.4, 0.1, '#a5432f'], [0.06, 0.82, -0.21, 0.025, 0.18, 0.025, '#8a6a44'], [0.06, 0.9299999999999999, -0.21, 0.02, 0.09, 0.08, '#e04a3a'], [0.15, 0.84, -0.2, 0.025, 0.22, 0.025, '#8a6a44'], [0.15, 0.97, -0.2, 0.02, 0.09, 0.08, '#f2efe6'], [0.09, 0.86, -0.3, 0.025, 0.26, 0.025, '#8a6a44'], [0.09, 1.01, -0.3, 0.02, 0.09, 0.08, '#4a8ad8'], [0.17, 0.82, -0.31, 0.025, 0.18, 0.025, '#8a6a44'], [0.17, 0.9299999999999999, -0.31, 0.02, 0.09, 0.08, '#f2efe6'], [0.12, 0.84, -0.25, 0.025, 0.22, 0.025, '#8a6a44'], [0.12, 0.97, -0.25, 0.02, 0.09, 0.08, '#e0b03a'], [0.05, 0.86, -0.32, 0.025, 0.26, 0.025, '#8a6a44'], [0.05, 1.01, -0.32, 0.02, 0.09, 0.08, '#e04a3a']]),decoMat);
    u.quiver.rotation.z=-0.35;u.torso.add(u.quiver);u.nock=new THREE.Mesh(arrowNockGeo(),decoMat);u.nock.visible=false;(u.mir||g).add(u.nock);return}
  {const eu=base==='miecz'||base==='sztylet';WG0=eu?1:0;let gg;try{gg=weaponGeo(base,rar,vr,lk,false,sd)}finally{WG0=0}/* v141: miecze i sztylety trzymane ostrzem (cieńszą krawędzią) do góry */if(base==='miecz'||base==='sztylet'){const gl=gg.userData.glowGeo;gg=edgeUp(gg);if(gl)gg.userData.glowGeo=edgeUp(gl)}u.wm=new THREE.Mesh(gg,decoMat);u.wm.castShadow=true;u.re.add(u.wm);u.two=['mlot','halabarda','wlocznia','kusza','kostur'].includes(base)||vr==='dwureczny'||vr==='poltora'||vr==='wielki';u.ikGrip=null;u.ikB=null;if(u.two)TWOSET.add(g);if(gg.userData.glowGeo)u.wm.add(new THREE.Mesh(gg.userData.glowGeo,GLOWMAT))}
  if(base==='sztylet'){WG0=1;let g2;try{g2=weaponGeo(base,rar,vr,lk,false,sd)}finally{WG0=0}u.wm2=new THREE.Mesh(edgeUp(g2),decoMat);u.le.add(u.wm2)}
}
function edgeUp(g){const c=g.clone();c.translate(0,0.3,0);c.rotateZ(Math.PI/2);c.translate(0,-0.3,0);c.userData={...g.userData};return c}
// ---------- smuga cięcia ----------

// smuga ciosu rysowana przez ostrze broni (od nasady głowni do czubka), nie przez dłonie
function slashFx(g,combo,color){const u=g.userData;u.trC=new THREE.Color(color).lerp(new THREE.Color('#ffffff'),0.45);u.trailT=combo===3?0.3:0.19;u.trPts=u.trPts||[]}
const TRV=new THREE.Vector3(),TRV2=new THREE.Vector3();
function bladeLocal(w){const gg=w.geometry;if(!gg.userData.tipL){gg.computeBoundingBox();const b=gg.boundingBox;let best='y',L=0;for(const a of ['x','y','z']){const l=b.max[a]-b.min[a];if(l>L){L=l;best=a}}const end=Math.abs(b.max[best])>Math.abs(b.min[best])?b.max[best]:b.min[best];const c=new THREE.Vector3((b.max.x+b.min.x)/2,(b.max.y+b.min.y)/2,(b.max.z+b.min.z)/2);const tip=c.clone(),base=c.clone();tip[best]=end;base[best]=end*0.42;gg.userData.tipL=tip;gg.userData.baseL=base}return gg.userData}
function trailOne(g,dt){const u=g.userData;if(!u.trPts)return;const on=u.trailT>0&&u.wm&&g.visible;if(u.trailT>0)u.trailT-=dt;
  if(on){g.updateMatrixWorld(true);const bl=bladeLocal(u.wm);TRV.copy(bl.tipL);u.wm.localToWorld(TRV);TRV2.copy(bl.baseL);u.wm.localToWorld(TRV2);u.trPts.push([TRV.x,TRV.y,TRV.z,TRV2.x,TRV2.y,TRV2.z,0])}
  for(const q of u.trPts)q[6]+=dt;while(u.trPts.length&&(u.trPts[0][6]>0.16||u.trPts.length>14))u.trPts.shift();
  if(u.trPts.length<2){if(u.trM)u.trM.visible=false;return}
  if(!u.trM){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(16*2*3),3));geo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(16*2*3),3));const idx=[];for(let i=0;i<15;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}geo.setIndex(idx);
    u.trM=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));u.trM.frustumCulled=false;u.trM.renderOrder=5;scene.add(u.trM)}
  const pa=u.trM.geometry.attributes.position,ca=u.trM.geometry.attributes.color,n=u.trPts.length,c=u.trC||new THREE.Color('#ffffff');
  for(let i=0;i<16;i++){const q=u.trPts[Math.min(i,n-1)],f=i<n?Math.pow(i/(n-1),1.4)*(1-q[6]/0.16):0;const P=pa.array,Cc=ca.array,o=i*6;P[o]=q[0];P[o+1]=q[1];P[o+2]=q[2];P[o+3]=q[3];P[o+4]=q[4];P[o+5]=q[5];Cc[o]=c.r*f;Cc[o+1]=c.g*f;Cc[o+2]=c.b*f;Cc[o+3]=c.r*f*0.15;Cc[o+4]=c.g*f*0.15;Cc[o+5]=c.b*f*0.15}
  u.trM.geometry.setDrawRange(0,Math.max(0,(n-1)*6));pa.needsUpdate=true;ca.needsUpdate=true;u.trM.visible=true}
function slashTick(dt){if(meRef)trailOne(meRef,dt);for(const r of remotes.values())trailOne(r.g,dt)}

function nameTag(text,hex,far){
  const cv=document.createElement('canvas');cv.width=512;cv.height=64;const x=cv.getContext('2d');
  x.font='700 30px "Alegreya Sans", sans-serif';x.textAlign='center';x.fillStyle='rgba(0,0,0,.45)';const w=x.measureText(text).width+28;x.fillRect(256-w/2,10,w,44);
  x.fillStyle=hex;x.fillRect(256-w/2,50,w,4);x.fillStyle='#fff';x.fillText(text,256,43);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false}));sp.scale.set(4,0.5,1);sp.position.y=2.35;sp.renderOrder=5;sp.userData.far=far||12;TAGS.push(sp);return sp;
}
// nazwy nad głowami widać tylko z bliska: pełne do ~70% zasięgu, dalej płynnie znikają
const TAGS=[],_tgv=new THREE.Vector3();
function tagsTick(){for(let i=TAGS.length-1;i>=0;i--){const sp=TAGS[i];if(!sp.parent){sp.userData.orph=(sp.userData.orph||0)+1;if(sp.userData.orph>600)TAGS.splice(i,1);continue}sp.userData.orph=0;
  if(typeof sp.getWorldPosition!=='function')continue;sp.getWorldPosition(_tgv);const d=Math.hypot(_tgv.x-player.p.x,_tgv.z-player.p.z),R=sp.userData.far,o=d>=R?0:Math.min(1,(R-d)/(R*0.3));if(sp.material.opacity!==o)sp.material.opacity=o}}

// ---------- chunki ----------
const chunks=new Map(), K=(x,z)=>x+','+z;
const hcache=new Map(); // wysokości terenu wokół zdalnych graczy (host)
const thumbs=new Map(); // odkryte chunki: miniatury
// ===== królestwa (nowe światy) =====
const KR=2200,KING=new Map(),kingReq=new Set();let kingCur=null;
const KTITLE={ludzie:'Królestwo',elfy:'Królestwo elfów',krasnoludy:'Królestwo krasnoludów',orkowie:'Horda orków',niziolki:'Kraina niziołków',drowy:'Imperium drowów',saurianie:'Plemiona Saurian'},KCOL={niziolki:'#d8f0a0',drowy:'#d0a8ff',saurianie:'#9ae8a8',ludzie:'#ffe7a8',elfy:'#b8f0a0',krasnoludy:'#ffc890',orkowie:'#ff9a8a'};
const kName=k=>k?KTITLE[k.race]+' '+k.name:'';
function kwarp(x,z){return[x+160*Math.sin(z/510)+90*Math.sin(z/170+1.3),z+160*Math.sin(x/530+0.7)+90*Math.sin(x/190+2.1)]}
function kingRequest(cells){const need=cells.filter(c=>!kingReq.has(c[0]+','+c[1]));if(!need.length)return;for(const c of need)kingReq.add(c[0]+','+c[1]);const w=workers[0];w.busy++;w.postMessage({type:'kingdoms',seed:S.seed,cells:need,id:reqId++})}
function kingdomAtM(x,z,noReq){if(S.gen!==2)return null;const [wx,wz]=kwarp(x,z),gx=Math.floor(wx/KR),gz=Math.floor(wz/KR);let best=null,bd=1e18;const miss=[];for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const k=KING.get((gx+dx)+','+(gz+dz));if(!k){miss.push([gx+dx,gz+dz]);continue}const dd=(k.x-wx)**2+(k.z-wz)**2;if(dd<bd){bd=dd;best=k}}if(miss.length){if(!noReq)kingRequest(miss);return null}return best}
let kherbT=0;function kherbShow(k){const el=document.getElementById('kherb');if(!el)return;try{herbDraw(el.querySelector('canvas'),kHerb(k))}catch(e){}el.querySelector('b').textContent=kName(k);el.querySelector('b').style.color=KCOL[k.race];el.classList.add('on');clearTimeout(kherbT);kherbT=setTimeout(()=>el.classList.remove('on'),6500)}
function kingTick(){if(S.gen!==2){kingCur=null;return}const k=kingdomAtM(player.p.x,player.p.z);if(k&&(!kingCur||kingCur.id!==k.id)){if(kingCur)toast('Wkraczasz: '+kName(k),KCOL[k.race]);else toast(kName(k),KCOL[k.race]);kingCur=k;kherbShow(k)}}

const MAPH=new Map(),MAPT=new Map(); // odkryte chunki: wysokości 16x16 i drzewa do mapy 3D
// ===== trwała mapa: odkryte chunki zapisywane w IndexedDB, osobno dla każdego świata (mapa nie znika po wczytaniu gry) =====
const MAPDB={db:null,pend:new Map(),seed:null,loaded:false};
function mapDbOpen(){return new Promise(res=>{if(MAPDB.db)return res(MAPDB.db);try{const rq=indexedDB.open('pintar_map',1);rq.onupgradeneeded=()=>{rq.result.createObjectStore('ch')};rq.onsuccess=()=>{MAPDB.db=rq.result;res(MAPDB.db)};rq.onerror=()=>res(null)}catch(_){res(null)}})}
function mapDbQueue(k,thumb,H,T){if(!S||S.seed==null)return;MAPDB.pend.set(S.seed+'|'+k,{t:thumb,h:H,tr:T})}
async function mapDbFlush(){if(!MAPDB.pend.size)return;const db=await mapDbOpen();if(!db)return;try{const tx=db.transaction('ch','readwrite'),st=tx.objectStore('ch');for(const [k,v] of MAPDB.pend)st.put(v,k);MAPDB.pend.clear()}catch(_){}}
async function mapDbLoad(){const db=await mapDbOpen();if(!db)return;const sd=S.seed;MAPDB.seed=sd;try{const tx=db.transaction('ch','readonly'),st=tx.objectStore('ch'),rq=st.openCursor(IDBKeyRange.bound(sd+'|',sd+'|\uffff'));let n=0;
  rq.onsuccess=()=>{const c=rq.result;if(!c){MAPDB.loaded=true;if(n){MAP3D.dirty=true;try{mapV.dirty=true}catch(_){}}return}if(S.seed!==sd)return;const k=String(c.key).slice(String(sd).length+1),v=c.value;
    if(!thumbs.has(k)&&v.t){const TS2=Math.round(Math.sqrt(v.t.length/4)),cv=document.createElement('canvas');cv.width=cv.height=TS2;cv.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(v.t),TS2,TS2),0,0);cv._d=new Uint8ClampedArray(v.t);thumbs.set(k,cv)}
    if(!MAPH.has(k)&&v.h){MAPH.set(k,new Float32Array(v.h));MAPT.set(k,new Float32Array(v.tr||[]))}n++;c.continue()}}catch(_){}}
setInterval(()=>{mapDbFlush()},8000);addEventListener('beforeunload',()=>{mapDbFlush()});
let reqId=1;
const NW=Math.max(2,Math.min(6,(navigator.hardwareConcurrency||4)-1));
const wsrc=document.getElementById('wk').textContent;
const wurl=URL.createObjectURL(new Blob([wsrc],{type:'text/javascript'}));
const workers=[]; const results=[];
let spawnCb=null,spawnCb2=false;
for(let i=0;i<NW;i++){const w=new Worker(wurl);{const _pm=w.postMessage.bind(w);w.postMessage=(msg,tr)=>_pm(Object.assign({gen:S.gen||1,kb:S.kb||0},msg),tr)}w.busy=0;w.onerror=e=>window.__err('worker: '+(e.message||'?')+' l.'+e.lineno);w.onmessage=e=>{w.busy--;const d=e.data;if(d.type==='kingdoms'){for(const k of d.list)KING.set(k.gx+','+k.gz,k);return}if(d.type==='spawn'){if(spawnCb2&&!spawnCb){spawnCb2=false;S.spawn=[d.x,d.h,d.z];LS.set('spawn',{seed:d.seed,p:S.spawn});return}spawnCb&&spawnCb(d);return}if(d.type==='vill'){onVill(d.list);return}if(d.type==='city'){onCity(d.list);return}if(d.type==='roads'){onRoads(d.list);return}if(d.type==='str'){onStr(d.list);return}if(d.type==='isl'){ISLE.list=d.list;ISLE.cb&&ISLE.cb(d.list);ISLE.cb=null;return}if(d.type==='hmap'){hreq.delete(K(d.cx,d.cz));if(d.seed===S.seed)hcache.set(K(d.cx,d.cz),{heights:d.heights,biomes:d.biomes,wlev:d.wlev,cx:d.cx,cz:d.cz});return}results.push(d)};workers.push(w)}
const lodFor=d=>d<=3.2?1:d<=6.5?2:d<=12.5?4:8;

const pc={x:0,z:0};
function updateChunks(){
  if(!player.ready||!S.spawn)return;
  pc.x=Math.floor(player.p.x/C); pc.z=Math.floor(player.p.z/C);
  const r=S.rd, need=[];
  for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){
    const d=Math.hypot(dx,dz); if(d>r+0.5)continue;
    const cx=pc.x+dx, cz=pc.z+dz, k=K(cx,cz), ch=chunks.get(k), lod=lodFor(d);
    if(!ch) need.push([d,cx,cz,lod]);
    else if(ch.lod!==lod&&ch.pend!==lod) need.push([d+0.3,cx,cz,lod]);
  }
  need.sort((a,b)=>a[0]-b[0]);
  for(const [d,cx,cz,lod] of need){
    const w=workers.reduce((a,b)=>a.busy<=b.busy?a:b); if(w.busy>=2)break;
    let ch=chunks.get(K(cx,cz)); if(!ch){ch={cx,cz,lod:0,mesh:null,heights:null,decos:null,pend:0};chunks.set(K(cx,cz),ch)}
    ch.pend=lod; w.busy++; {const dg=digFor(cx,cz);w.postMessage({type:'chunk',seed:S.seed,id:reqId++,cx,cz,lod,sx:S.spawn[0],sz:S.spawn[2],dig:dg.length?dg:null})}
  }
  for(const [k,ch] of chunks){ if(Math.hypot(ch.cx-pc.x,ch.cz-pc.z)>r+1.6) unload(k,ch) }
}
function unload(k,ch){voxRemove('T'+k);if(ch.micro){scene.remove(ch.micro);ch.micro=null}if(ch.wmesh){scene.remove(ch.wmesh);ch.wmesh.geometry.dispose();ch.wmesh=null}
  if(ch.mesh){scene.remove(ch.mesh);ch.mesh.geometry.dispose()}
  instDirty=true;
  chunks.delete(k);
}
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_v=new THREE.Vector3(),_s=new THREE.Vector3(),_c=new THREE.Color(),_up=new THREE.Vector3(0,1,0);
// drobne voxele na terenie: kamyki, kępki trawy, kwiatki (tylko bliskie chunki)
const MICRO_GEO=new THREE.BoxGeometry(1,1,1);MICRO_GEO.translate(0,0.5,0);const MICRO_MAT=new THREE.MeshLambertMaterial({color:0xffffff});try{seasonPatch(MICRO_MAT,false)}catch(_){}
function microVox(ch,m,mesh){if(ch.micro){scene.remove(ch.micro);ch.micro=null}if(m.lod!==1||!m.heights||!m.biomes)return;const H=m.heights,Bi=m.biomes,list=[],x0=m.cx*C,z0=m.cz*C;
  const hh=(a,b,k)=>{const v=Math.sin(a*12.9898+b*78.233+k*37.719)*43758.5453;return v-Math.floor(v)};
  const GR={57:['#7a7458','#8a8466'],58:['#5a6a50','#6a7a5a'],63:['#2e5a28','#3a6a30'],64:['#d8e8f4','#c0d8e8'],66:['#3a3e32','#4a4a3e'],67:['#5a9a32','#6aaa3a','#4a8a2a'],2:['#5a9a3a','#6aaa42','#4a8a32'],3:['#3a7a2a','#4a8a32'],7:['#5a7a2a','#6a8a32'],9:['#2a6a1a','#3a7a22'],10:['#8a7a2a','#a8902a'],11:['#6aaa52','#7aba5a'],12:['#6a5a6a','#7a6a5a'],8:['#a89a4a','#b8aa5a'],19:['#5a4a6a','#6a5a7a'],24:['#2e5a32','#3a6a3a','#4a6a3a'],25:['#b8a050','#c8b060','#a89848','#8a9a48'],26:['#6a9a2a','#7aaa36','#5a8a24'],27:['#2a4a1e','#345a24','#3e6a2a'],28:['#d8d4c8','#e8e4da'],29:['#5a7a3a','#6a8a44','#7a6aa8'],30:['#3e4e22','#4a5a2a','#56682e'],31:['#c8a858','#d8b868','#b89848'],32:['#c8d8e0','#a8b8a0'],33:['#4a4a2a','#5a5230','#3e4a26'],34:['#6aa848','#7ab858','#e8a8c0'],36:['#a89870','#8a8a5a'],38:['#6a6438','#5a5430','#7a7040'],39:['#5aa03a','#6ab048','#7ac050'],40:['#a89058','#8a7a48'],41:['#a8a070','#8a9a60'],42:['#5a5448','#4a443a','#6a6250'],43:['#4a8a2a','#5a9a32','#3a7a22'],44:['#3a5a2e','#4a6a36'],45:['#c8a848','#d8b858','#b89838'],46:['#c8b070','#a89858'],47:['#d8eef8','#c8e0f0'],48:['#3a2050','#4a2a60'],49:['#a8603a','#b8704a'],50:['#5a5650','#6a665e'],51:['#c89a3a','#d8aa4a','#b88a2a'],52:['#4a7a3a','#5a8a42'],53:['#1a4a48','#2a6a5a','#3ac8b8'],54:['#5aa040','#6ab048','#f08ab0'],55:['#3a3a40','#4a4a50'],56:['#7a2a22','#8a3a2a','#5a1a14']};
  const FL=['#f2ead8','#f0c040','#e05a6a','#9a7ad8','#f08a4a','#5a9af0'];
  for(let i=0;i<220;i++){const lx=Math.floor(hh(m.cx,m.cz,i*3)*C),lz=Math.floor(hh(m.cz,m.cx,i*3+1)*C),h=H[lz*C+lx],b=Bi[lz*C+lx];if(h<WATER+0.5||(m.wlev&&m.wlev[lz*C+lx])||b===0||b===13||b===14||b===17||b===16)continue;
    if(lx>0&&lz>0&&lx<C-1&&lz<C-1){if(H[lz*C+lx+1]!==h||H[lz*C+lx-1]!==h||H[(lz+1)*C+lx]!==h||H[(lz-1)*C+lx]!==h)continue}else continue;
    const wx=x0+lx+0.15+hh(lx,lz,5)*0.7,wz=z0+lz+0.15+hh(lz,lx,6)*0.7;if(typeof inVillage==='function'&&inVillage(wx,wz,42))continue;const r=hh(wx,wz,7);
    const G=GR[b];if(G&&r<0.55){const c=G[Math.floor(hh(wx,wz,8)*G.length)];const n=3+Math.floor(hh(wx,wz,9)*3);for(let k=0;k<n;k++){const ox=(hh(wx,k,1)-0.5)*0.35,oz=(hh(wz,k,2)-0.5)*0.35;list.push([wx+ox,h,wz+oz,0.07,0.16+hh(wx+k,wz,3)*0.22,0.07,c])}}
    else if(G&&r<0.75){const c=FL[Math.floor(hh(wx,wz,10)*FL.length)];list.push([wx,h,wz,0.05,0.22,0.05,'#4a8a32'],[wx,h+0.22,wz,0.13,0.11,0.13,c],[wx,h+0.25,wz,0.06,0.06,0.06,'#f0d040'])}
    else{const g=b===4||b===1||b===15?['#c8a878','#b89868','#d8b888']:b===5||b===21||b===6?['#9a98a0','#8a8890','#e8eef2']:['#8a8890','#7a7880','#9a98a0','#6a6458'];const n=1+Math.floor(hh(wx,wz,11)*3);for(let k=0;k<n;k++){const s=0.1+hh(wx+k,wz,12)*0.16;list.push([wx+(hh(k,wx,4)-0.5)*0.4,h,wz+(hh(k,wz,5)-0.5)*0.4,s*1.2,s*0.7,s,g[Math.floor(hh(wx,k,6)*g.length)]])}}}
  if(!list.length)return;const im=new THREE.InstancedMesh(MICRO_GEO,MICRO_MAT,list.length),M4=new THREE.Matrix4(),col=new THREE.Color();
  list.forEach((q,i)=>{M4.makeScale(q[3],q[4],q[5]);M4.setPosition(q[0],q[1],q[2]);im.setMatrixAt(i,M4);im.setColorAt(i,col.set(q[6]))});im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.receiveShadow=true;im.frustumCulled=false;scene.add(im);ch.micro=im}
let CHUNKN=0;
function villHeightsReady(v){const R=(v.Hs||40)+16,x0=Math.floor((v.x-R)/C),x1=Math.floor((v.x+R)/C),z0=Math.floor((v.z-R)/C),z1=Math.floor((v.z+R)/C);for(let cx=x0;cx<=x1;cx++)for(let cz=z0;cz<=z1;cz++){const k=K(cx,cz),ch=chunks.get(k);if(!(ch&&ch.heights)&&!hcache.get(k))return false}return true}
function processResults(){
  let n=0;
  while(results.length&&n<4){
    const m=results.shift(); if(m.seed!==S.seed)continue;CHUNKN++;
    const ch=chunks.get(K(m.cx,m.cz)); if(!ch||ch.pend!==m.lod)continue;
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(m.pos,3));
    g.setAttribute('normal',new THREE.BufferAttribute(m.nor,3,true));
    g.setAttribute('color',new THREE.BufferAttribute(m.col,3));
    g.setIndex(new THREE.BufferAttribute(m.idx,1)); g.computeBoundingSphere(); freeCPU(g);
    if(ch.mesh){scene.remove(ch.mesh);ch.mesh.geometry.dispose()}
    const mesh=new THREE.Mesh(g,terrainMat); mesh.position.set(m.cx*C,0,m.cz*C); mesh.receiveShadow=true; mesh.castShadow=m.lod===1; mesh.matrixAutoUpdate=false; mesh.updateMatrix();
    scene.add(mesh); ch.mesh=mesh; ch.lod=m.lod; ch.pend=0;
    /* drzewa osad stoją na wysokości aktualnej siatki terenu: po zmianie szczegółowości odświeżamy je (inaczej lewitują lub toną) */try{const x0=m.cx*C,z0=m.cz*C;for(const v of villages.values()){if(!v||!v.g)continue;const R=(v.Hs||40)+20;if(x0+C<v.x-R||x0>v.x+R||z0+C<v.z-R||z0>v.z+R)continue;v._treeDirty=1}}catch(_){}
    {const ok='T'+K(m.cx,m.cz);voxRemove(ok);if(m.slabs&&m.slabs.length&&m.lod===1){const ks=new Set();const S2=m.slabs;for(let i=0;i<S2.length;i+=6){for(let x=S2[i]+0.25;x<S2[i+2];x+=0.5)for(let z=S2[i+1]+0.25;z<S2[i+3];z+=0.5){const k=vkey(Math.floor(x/VOXC),Math.floor(z/VOXC));const L=VOX.get(k)||[];L.push({o:ok,a:S2[i+4],b:S2[i+5]});VOX.set(k,L);ks.add(k)}}VOWN.set(ok,ks)}}
    try{microVox(ch,m,mesh)}catch(e){console.warn('micro',e)}
    if(ch.wmesh){scene.remove(ch.wmesh);ch.wmesh.geometry.dispose();ch.wmesh=null}
    if(m.wpos&&m.wpos.length){const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.BufferAttribute(m.wpos,3));wg.setAttribute('aW',new THREE.BufferAttribute(m.wuv,2));const nn=new Float32Array(m.wpos.length);for(let i=1;i<nn.length;i+=3)nn[i]=1;wg.setAttribute('normal',new THREE.BufferAttribute(nn,3));wg.setIndex(new THREE.BufferAttribute(m.widx,1));wg.computeBoundingSphere();
      const wm=new THREE.Mesh(wg,RIVMAT);wm.position.set(m.cx*C,0,m.cz*C);wm.renderOrder=2;wm.matrixAutoUpdate=false;wm.updateMatrix();scene.add(wm);ch.wmesh=wm}
    if(m.wlev)ch.wlev=m.wlev;ch.falls=m.falls&&m.falls.length?m.falls:null;
    {const first=!ch.heights;/* dekoracje odświeżamy przy każdej zmianie LOD — wysokości drzew pasują do aktualnej siatki terenu */{const A=[],Bs=[];const D=m.decos;for(let i=0;i<D.length;i+=6){(SMALLT.has(D[i])&&!(D[i]===11&&D[i+4]>1.5)?Bs:A).push(D[i],D[i+1],D[i+2],D[i+3],D[i+4],D[i+5])}ch.decos=new Float32Array(A);ch.decoS=new Float32Array(Bs)}instDirty=true;if(first||m.dg){
      ch.heights=m.heights; ch.biomes=m.biomes;
      if(!thumbs.has(K(m.cx,m.cz))){const TS2=Math.round(Math.sqrt(m.thumb.length/4)),cv=document.createElement('canvas');cv.width=cv.height=TS2;cv.getContext('2d').putImageData(new ImageData(m.thumb,TS2,TS2),0,0);cv._d=new Uint8ClampedArray(m.thumb);thumbs.set(K(m.cx,m.cz),cv)}
      if(!MAPH.has(K(m.cx,m.cz))){const Hm=new Float32Array(256);for(let j=0;j<16;j++)for(let i=0;i<16;i++)Hm[j*16+i]=m.heights[(j*2+1)*C+i*2+1];MAPH.set(K(m.cx,m.cz),Hm);const D=m.decos,Tl=[];for(let i=0;i<D.length&&Tl.length<900;i+=6){const tk=TK[D[i]];if((MTREE[D[i]]||/^(oak|pine|birch|palm|snowpine|acacia|jtree|maple|sakura|cactus|sequoia|baobab|mangrove|bamboo)$/.test(tk))&&D[i+4]>0.3)Tl.push(D[i+1],D[i+2],D[i+3],D[i+4],D[i])}MAPT.set(K(m.cx,m.cz),new Float32Array(Tl));try{const tc=thumbs.get(K(m.cx,m.cz));mapDbQueue(K(m.cx,m.cz),tc&&tc._d?Array.from(tc._d):null,Array.from(Hm),Tl)}catch(_){}}
    }}
    n++;
  }
}
function colAt(x,z,y){if(y!==undefined&&y>450){const sh=spaceH(x,z,y);if(sh!==null)return sh}const cx=Math.floor(x/C),cz=Math.floor(z/C);let ch=chunks.get(K(cx,cz));if(!ch||!ch.heights)ch=hcache.get(K(cx,cz));if(!ch||!ch.heights)return null;const lx=Math.floor(x)-cx*C,lz=Math.floor(z)-cz*C;return ch.heights[lz*C+lx]}
// poziom wody w danej kolumnie: rzeki górskie mają własny poziom (ch.wlev), reszta świata — WATER
function wlAt(x,z){const cx=Math.floor(x/C),cz=Math.floor(z/C);let ch=chunks.get(K(cx,cz));if(!ch||!ch.heights)ch=hcache.get(K(cx,cz));if(!ch||!ch.wlev)return WATER;return ch.wlev[(Math.floor(z)-cz*C)*C+Math.floor(x)-cx*C]||WATER}
const wetAt=(x,z,h)=>h<WATER||h<wlAt(x,z);
// wrogowie lądowi brodzą/płyną po wodzie: wysokość tułowia przy tafli (głęboka woda) albo na dnie (płycizna)
const eWadeY=(x,z,h,e)=>{const wl=Math.max(WATER,wlAt(x,z));return Math.max(h,wl-Math.min(1.0,0.55*eSc(e)+0.25))};
function biomeAt(x,z){const cx=Math.floor(x/C),cz=Math.floor(z/C);let ch=chunks.get(K(cx,cz));if(!ch||!ch.biomes)ch=hcache.get(K(cx,cz));if(!ch||!ch.biomes)return -1;return ch.biomes[(Math.floor(z)-cz*C)*C+Math.floor(x)-cx*C]}
function maxH(x,z){let m=-1;for(const ox of [-PR,PR])for(const oz of [-PR,PR]){const h=colAt(x+ox,z+oz,player.p.y);if(h===null)return null;if(h>m)m=h}return m}

// ---------- gracz ----------
const player={p:new THREE.Vector3(0,80,0),v:new THREE.Vector3(),ry:0,ground:false,swim:false,ready:false,anim:0};
const me=makeChar(S.look); scene.add(me);
const keys=new Set(); let yaw=LS.get('yaw',0.6), pitch=0.32, dist=Math.min(12,LS.get('dist',7.5));
function physics(dt){
  if(!player.ready)return;
  {const p=player.p,v=player.v;if(Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.z)){if(!Number.isFinite(v.x+v.y+v.z))v.set(0,0,0);P2.goodP=[p.x,p.y,p.z]}else{const g=P2.goodP||spawnPt();p.set(g[0],g[1]+0.5,g[2]);v.set(0,0,0);camY=null}}
  if(P2.ride){player.v.set(0,0,0);player.ground=true;player.swim=false;return}
  {const s=SPC;if(s){const p=player.p;if(s.kind==='arena'&&s.cx!=null){const R=22.2-PR,dx=p.x-s.cx,dz=p.z-s.cz,d=Math.hypot(dx,dz);if(d>R&&!(Math.abs(dx)<2.2&&dz>0)){p.x=s.cx+dx/d*R;p.z=s.cz+dz/d*R}
      for(const b of (s.braz||[])){const ex=p.x-b[0],ez=p.z-b[2],e=Math.hypot(ex,ez),mn=0.75+PR;if(e<mn&&e>1e-4){p.x=b[0]+ex/e*mn;p.z=b[2]+ez/e*mn}}}
    if(s.ceil&&p.y>s.fy+s.ceil-PH-0.1){p.y=s.fy+s.ceil-PH-0.1;if(player.v.y>0)player.v.y=0}}}
  if(VH.mode===1){boatPhysics(dt);return}
  if(VH.mode===4){passengerTick();return}
  const f=[0,0];
  if(keys.has('KeyW'))f[1]+=1; if(keys.has('KeyS'))f[1]-=1; if(keys.has('KeyA'))f[0]-=1; if(keys.has('KeyD'))f[0]+=1;
  const wantS=keys.has('ShiftLeft')||keys.has('ShiftRight');
  const p=player.p, v=player.v;
  if(maxH(p.x,p.z)===null){v.set(0,0,0);return} // teren jeszcze się nie wczytał
  const WLp=wlAt(p.x,p.z),surf=WLp-0.15; player.swim=p.y<surf-1.15;if(VH.mode===6)player.swim=false;
  if(P2.wlPrev!=null&&WLp<P2.wlPrev-1.5&&p.y>WLp+0.5&&VH.mode===0&&P2.wasSwim){sfx('splash',0.8);v.y=Math.min(v.y,-2)}P2.wlPrev=WLp;P2.wasSwim=player.swim;
  if(season===2&&VH.mode===0&&WATER_U.uIce.value>0.5){const gh=colAt(p.x,p.z);if(gh!==null&&gh<WATER&&WATER-gh<4.2&&p.y>WATER-1.3){player.swim=false;if(p.y<=WATER-0.28){p.y=WATER-0.28;if(v.y<0)v.y=0;player.ground=true}}}
  const sprint=(VH.mode===3||VH.mode===5||VH.mode===6)?wantS:staTick(dt,wantS&&VH.mode===0,!!(f[0]||f[1]));
  let sp=(player.swim?3.2*(hasP('plywak')?1.6:1)*(1+0.01*skL('plyw'))*(sprint?1.8:1):VH.mode===5?(sprint?24:15)*(1+0.06*pk('galop')):VH.mode===6?(sprint?36:22)*(1+0.06*pk('galop')):VH.mode===3?(sprint?16:12)*(PET?MSPD[PET.t]||1:1):(P3.block&&VH.mode===0)?2.4:P3.sneak&&VH.mode===0?2.6:sprint?12.5*(1+0.006*skL('sprint')):5.8)*ST.move;if(P3.sneak&&(player.swim||VH.mode!==0))P3.sneak=false;
  let mx=0,mz=0;
  if(P2.dead>0){f[0]=f[1]=0}
  if(P2.atkT>0)sp*=0.45;
  if(f[0]||f[1]){const l=Math.hypot(f[0],f[1]);const fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);mx=(fx*f[1]+rx*f[0])/l;mz=(fz*f[1]+rz*f[0])/l;player.ry=Math.atan2(mx,mz)}
  const acc=VH.mode===6?3:player.ground||player.swim?14:4;
  if(P2.roll<=0&&!(P3.charge>0)&&!(P3.leap>0)&&VH.mode!==2){v.x+=(mx*sp-v.x)*Math.min(1,acc*dt); v.z+=(mz*sp-v.z)*Math.min(1,acc*dt);}
  if(VH.mode===2){gliderVel(v,dt)}
  else if(VH.mode===6){const up=keys.has('Space'),dn=keys.has('ControlLeft')||keys.has('KeyC');v.y+=(((up?11:0)-(dn?11:0))-v.y)*Math.min(1,4*dt);if(p.y>WATER+260)v.y=Math.min(v.y,0)}
  else if(player.swim){/* v124: nurkowanie — C/Ctrl albo patrzenie w dół podczas płynięcia; pod wodą ciało unosi się powoli, Spacja wypływa */
    const target=surf-1.35,fwd=keys.has('KeyW')||keys.has('ArrowUp'),down=keys.has('KeyC')||keys.has('ControlLeft'),up=keys.has('Space'),gnd=colAt(p.x,p.z),under=p.y<target-0.6;
    if(up)v.y+=((under?5.5:6)-v.y)*Math.min(1,5*dt);
    else if(down)v.y+=(-4.5-v.y)*Math.min(1,5*dt);
    else if(fwd&&(under||pitch>0.8)){const want=-Math.sin(pitch-0.3)*6.5;v.y+=(Math.max(-5,Math.min(4,want))-v.y)*Math.min(1,4*dt)}
    else if(under)v.y+=(0.55-v.y)*Math.min(1,2*dt);
    else v.y+=((target-p.y)*4-v.y)*Math.min(1,3*dt);
    if(gnd!=null&&p.y<gnd+0.05&&v.y<0)v.y=0;if(p.y>target&&v.y>0&&!up)v.y*=0.5;
  } else {
    v.y-=30*dt; if(v.y<-50)v.y=-50;
    if(keys.has('Space')&&player.ground&&!P2.dead){v.y=11.7;player.ground=false;sfx('jump')}
  }
  // oś X i Z osobno, z auto-wchodzeniem na 1 blok (jak w Cube World)
  for(const ax of ['x','z']){
    const np=ax==='x'?[p.x+v.x*dt,p.z]:[p.x,p.z+v.z*dt];
    let h=maxH(np[0],np[1]);
    if(h===null){v[ax]=0;continue}
    if(!SPC&&VOX.size){const vp=voxProbe(np[0],np[1],p.y,PR,PH-0.1);if(vp.block){if(P2.climbing>0&&vp.topC!==null&&vp.topC-p.y<=1.9&&!voxProbe(np[0],np[1],vp.topC,PR,PH-0.1).block){p.y=vp.topC+0.02;p[ax]=ax==='x'?np[0]:np[1];v.y=Math.max(0,v.y);player.ground=true;P2.climbing=0;continue}v[ax]=0;P2.wallHit=0.12;continue}if(vp.top!==null&&vp.top>h)h=vp.top}
    if(h<=p.y+0.01){p[ax]=ax==='x'?np[0]:np[1]}
    else if(h-p.y<=STEP&&(player.ground||player.swim)){p.y=h;p[ax]=ax==='x'?np[0]:np[1]}
    else if(P2.climbing>0&&h-p.y<=1.9&&!SPC){p.y=h+0.02;p[ax]=ax==='x'?np[0]:np[1];v.y=Math.max(0,v.y);player.ground=true;P2.climbing=0}
    else{v[ax]=0;if(h-p.y>STEP)P2.wallHit=0.12}
  }
  P2.wallHit=(P2.wallHit||0)-dt;P2.climbing=(P2.climbing||0)-dt;const cmax=6*(1+0.04*skL('wspin'));if(P2.cst==null)P2.cst=cmax;
  if(P2.wallHit>0&&f[1]>0&&!player.swim&&VH.mode===0&&!P2.dead&&!SPC&&!(typeof nearDoor!=='undefined'&&nearDoor&&nearDoor.house)){const tired=P2.cst<=0;v.y=Math.max(v.y,3.2*(1+0.01*skL('wspin'))*(tired?0.45:1));P2.cst=Math.max(0,P2.cst-dt);P2.climbing=0.15}
  else if(player.ground)P2.cst=Math.min(cmax,P2.cst+dt*2.5);
  {const cb=document.getElementById('climbbar');if(cb){const show=P2.cst<cmax-0.01;cb.hidden=!show;if(show)cb.firstChild.style.width=Math.max(0,P2.cst/cmax*100)+'%'}}
  // pnie drzew i skały
  const cx=Math.floor(p.x/C),cz=Math.floor(p.z/C);
  if(!SPC)for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const ch=chunks.get(K(cx+dx,cz+dz));if(!ch||!ch.decos)continue;const D=ch.decos;
    for(let i=0;i<D.length;i+=6){if(COLB[D[i]]&&!TREETOP[TK[D[i]]]){if(D[i]===11&&D[i+4]<1.5)continue;if(decoBoxPush(p,D,i)&&CLIMBD.has(D[i])&&f[1]>0)P2.wallHit=0.12;continue}const xs=SCLX[D[i]]||1,r=DECO[D[i]][1]*D[i+4]*xs;if(!r)continue;const ex=p.x-D[i+1],ez=p.z-D[i+3],ro=Math.max(3,r+1);if(Math.abs(ex)>ro||Math.abs(ez)>ro)continue;const tr=TRUNK[TK[D[i]]],s=D[i+4]*TS*xs/16,dd=Math.hypot(ex,ez),min=r+PR;
      if(dd<min+0.22&&dd>1e-4&&(-ex*Math.sin(player.ry)-ez*Math.cos(player.ry))/dd>0.35&&D[i]!==6&&D[i]!==12&&D[i]!==4&&keys.has('KeyW')&&!P2.dead&&VH.mode===0&&p.y>=D[i+2]-0.2&&p.y<D[i+2]+tr[2]*s){v.y=Math.max(v.y,5.2);player.climb=0.2}
      if(p.y>D[i+2]+tr[1]*s)continue;if(dd<min&&dd>1e-4){p.x+=ex/dd*(min-dd);p.z+=ez/dd*(min-dd)}}}
  if(!SPC){villageCollide(p);structCollide(p)}
  p.y+=v.y*dt;
  let g=maxH(p.x,p.z);if(!SPC){const sg=structGround(p.x,p.z,p.y);if(sg!==null&&(g===null||sg>g))g=sg;const vg=villageGround(p.x,p.z,p.y);if(vg!==null&&(g===null||vg>g))g=vg;const tg=treeGround(p.x,p.z,p.y);if(tg!==null&&(g===null||tg>g))g=tg}if(!SPC&&VOX.size){const vp=voxProbe(p.x,p.z,p.y,0,0.1);if(vp.top!==null&&vp.top<=p.y+0.35&&(g===null||vp.top>g))g=vp.top}{const bg=BRS.length?bridgeGround(p.x,p.z,p.y):null;if(bg!==null&&(g===null||bg>g)){g=bg;if(player.swim&&p.y>bg-1.3)player.swim=false}}
  if(g!==null&&p.y<=g){p.y=g;if(v.y<0)v.y=0;player.ground=true}
  else if(g!==null&&P2.wasG&&v.y<=0.01&&p.y-g<=STEP+0.2&&!player.swim&&VH.mode!==2&&!(P3.leap>0)){p.y=g;v.y=0;player.ground=true}
  else player.ground=false;
  if(VH.mode===2&&(player.ground||p.y<WATER-0.9))stopGlide();
  {const sp=Math.hypot(v.x,v.z);if((player.ground||player.swim)&&sp>1){P2.stepD=(P2.stepD||0)+sp*dt;if(P2.stepD>(sp>7?2.1:1.6)){P2.stepD=0;sfx(player.swim||p.y<WATER+0.1?'stepw':'step',0.8)}}if(player.ground&&!P2.wasG&&P2.fallV<-9)sfx('land');P2.wasG=player.ground;P2.fallV=v.y}
  if(p.y<-20){p.y=120;v.y=0}
  {const hs=Math.hypot(v.x,v.z);if(sprint&&hs>6&&player.ground&&VH.mode===0)skGain('sprint',dt);if(player.swim&&hs>1)skGain('plyw',dt);if(P2.climbing>0)skGain('wspin',dt*1.5)}
}

// korony drzew, skały i głazy, po których można chodzić
function treeGround(x,z,y){
  const cx=Math.floor(x/C),cz=Math.floor(z/C);let best=null;
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const ch=chunks.get(K(cx+dx,cz+dz));if(!ch||!ch.decos)continue;const D=ch.decos;
    for(let i=0;i<D.length;i+=6){const tt=TREETOP[TK[D[i]]];if(!tt){if(COLB[D[i]]){const t2=decoBoxTop(x,z,y,D,i);if(t2!==null&&(best===null||t2>best))best=t2}continue}const xs=SCLX[D[i]]||1,ex=x-D[i+1],ez=z-D[i+3];if(Math.abs(ex)>4.5*xs||Math.abs(ez)>4.5*xs)continue;
      const s=D[i+4]*TS*xs/16,q=Math.floor(D[i+5]/(Math.PI/2))&3;
      // obrót o -q*90° do układu modelu
      let lx=ex/s,lz=ez/s;for(let k=0;k<q;k++){const t=lx;lx=-lz;lz=t}
      for(const c of tt){const top=D[i+2]+c[3]*s;if(top>y+0.55||top<y-3)continue;if(Math.abs(lx-c[0])<c[2]+1.2&&Math.abs(lz-c[1])<c[2]+1.2&&(best===null||top>best))best=top}}}
  return best;
}

// ===== WODA ŻYJE: lilie i żaby, wodorosty i koralowce, wieloryby, mgła o świcie, prąd rzek, lód zimą, oddech pod wodą, wędkowanie =====
let _fm4,_fe,_fq,_fv,_fs;const WL={c:null,t:0,ims:[],frogs:[],whale:null,wT:20,mist:null};
// poranna mgła nad wodą: miękko zanikające brzegi (bez widocznego kwadratu) i zwykła mgła odległości
// mapa wysokości terenu wokół gracza (128×128 na 260 m) — warstwy mgły miękko zanikają przy ziemi zamiast ciąć teren ostrą linią
const MISTH={n:128,size:260,data:null,tex:null,cx:1e9,cz:1e9,U:{uHT:{value:null},uHC:{value:new THREE.Vector2()},uPC:{value:new THREE.Vector2()}}};
function mistHUpdate(px,pz){const M=MISTH;if(!M.tex){M.data=new Uint8Array(M.n*M.n*4);M.tex=new THREE.DataTexture(M.data,M.n,M.n,THREE.RGBAFormat);M.tex.magFilter=M.tex.minFilter=THREE.LinearFilter;M.tex.wrapS=M.tex.wrapT=THREE.ClampToEdgeWrapping;M.U.uHT.value=M.tex}
  if(Math.abs(px-M.cx)<10&&Math.abs(pz-M.cz)<10)return;M.cx=Math.round(px);M.cz=Math.round(pz);const st=M.size/M.n;
  for(let j=0;j<M.n;j++)for(let i=0;i<M.n;i++){const wx=M.cx+(i+0.5)*st-M.size/2,wz=M.cz+(j+0.5)*st-M.size/2;let h=colAt(wx,wz);if(h==null)h=mapHeightAt?mapHeightAt(wx,wz):null;const v=h==null?0:Math.max(0,Math.min(255,Math.round((Math.max(h,WATER-6)-WATER+6)*8)));const k=(j*M.n+i)*4;M.data[k]=v;M.data[k+1]=v;M.data[k+2]=v;M.data[k+3]=255}
  M.tex.needsUpdate=true;M.U.uHC.value.set(M.cx,M.cz)}
function mistMat(tx,y){const m=new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:0,depthWrite:false,fog:true});m.onBeforeCompile=sh=>{Object.assign(sh.uniforms,MISTH.U);sh.uniforms.uY={value:WATER+(y||0)};
  sh.vertexShader='varying vec2 vMP;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvMP=position.xy;');
  sh.fragmentShader='varying vec2 vMP;uniform sampler2D uHT;uniform vec2 uHC;uniform vec2 uPC;uniform float uY;\n'+sh.fragmentShader.replace('#include <fog_fragment>','vec2 wxz=uPC+vec2(vMP.x,-vMP.y);vec2 huv=(wxz-uHC)/'+MISTH.size.toFixed(1)+'+0.5;float th=texture2D(uHT,huv).r*255./8.-6.+'+WATER.toFixed(1)+';\ngl_FragColor.a*=(1.-smoothstep(45.,128.,length(vMP)))*smoothstep(0.,1.1,uY-th);\n#include <fog_fragment>')};m.customProgramCacheKey=()=>'mistR2';return m}
function wlBox(n,col,sway){const geo=new THREE.BoxGeometry(1,1,1);geo.translate(0,0.5,0);const mat=new THREE.MeshLambertMaterial({color:0xffffff});if(sway){mat.onBeforeCompile=sh=>{sh.uniforms.uT=WATER_U.uT;sh.vertexShader='uniform float uT;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat ph=instanceMatrix[3].x*0.7+instanceMatrix[3].z*0.3;\n#else\nfloat ph=0.;\n#endif\ntransformed.x+=sin(uT*1.3+ph)*0.35*position.y*position.y;transformed.z+=cos(uT*1.1+ph)*0.2*position.y;')};mat.customProgramCacheKey=()=>'kelp'}const im=new THREE.InstancedMesh(geo,mat,Math.max(1,n));im.frustumCulled=false;im.count=0;scene.add(im);return im}

function wlGeo(geo,n,sway){const mat=new THREE.MeshLambertMaterial({vertexColors:true});if(sway){mat.onBeforeCompile=sh=>{sh.uniforms.uT=WATER_U.uT;sh.vertexShader='uniform float uT;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat ph=instanceMatrix[3].x*0.9+instanceMatrix[3].z*0.4;\n#else\nfloat ph=0.;\n#endif\ntransformed.x+=sin(uT*1.6+ph)*'+sway.toFixed(3)+'*position.y*position.y;transformed.z+=cos(uT*1.2+ph)*'+(sway*0.6).toFixed(3)+'*position.y*position.y;')};mat.customProgramCacheKey=()=>'sway'+sway}
  const im=new THREE.InstancedMesh(geo,mat,Math.max(1,n));im.frustumCulled=false;im.count=0;im.castShadow=!!sway;im.userData.kg=1;scene.add(im);return im}
const LILYG=[];function lilyFlower(k){if(LILYG[k])return LILYG[k];const PC=[[['#fbf6ec','#efe4d0'],['#fffaf2','#f4ecd8']],[['#f6b8d0','#e888b0'],['#f8c8dc','#f0a0c0']],[['#fff0f4','#f4d0dc'],['#f0b0c8','#e890b0']]][k],L=[];
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,c=Math.cos(a),s=Math.sin(a);L.push([c*0.13,0.05,s*0.13,0.1+Math.abs(c)*0.04,0.05,0.1+Math.abs(s)*0.04,i%2?PC[0][0]:PC[0][1]])}
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2+0.3,c=Math.cos(a),s=Math.sin(a);L.push([c*0.08,0.11,s*0.08,0.07,0.1,0.07,i%2?PC[1][0]:PC[1][1]])}
  L.push([0,0.15,0,0.09,0.08,0.09,'#f0c830'],[0,0.2,0,0.05,0.04,0.05,'#e8a820'],[0,0.01,0,0.24,0.02,0.24,'#3a7a34']);LILYG['L'+k]=L;return LILYG[k]=boxes(L)}
const CATG={};function cattailGeo(dry){const k=dry?1:0;if(CATG[k])return CATG[k];const ST=dry?'#9a8a4a':'#5a8a3a',LF=dry?'#a89850':'#4a8a34',LF2=dry?'#8a7a40':'#5a9a3e',HD=dry?'#5a3a22':'#6a4426',L=[];
  for(const [x,z,h] of [[0,0,2.0],[0.18,0.1,1.7],[-0.15,0.14,1.85],[0.06,-0.18,1.5],[-0.2,-0.12,1.35]]){L.push([x,h/2,z,0.035,h,0.035,ST],[x,h-0.32,z,0.1,0.42,0.1,HD],[x,h-0.31,z,0.115,0.36,0.085,darker(HD,0.9)],[x,h+0.06,z,0.02,0.14,0.02,'#b8a878'])}
  for(const [x,z,h,w,c] of [[0.1,-0.05,1.6,0.07,LF],[-0.1,0.02,1.9,0.06,LF2],[0.02,0.2,1.4,0.06,LF],[-0.22,0.0,1.2,0.05,LF2],[0.24,-0.06,1.1,0.06,LF],[0.0,-0.24,1.3,0.05,LF2],[0.14,0.26,0.9,0.05,LF]]){L.push([x,h/2,z,w,h,0.015,c],[x+0.02,h*0.85,z,w*0.7,h*0.3,0.016,darker(c,1.12)])}
  return CATG[k]=boxes(L)}
function wlRebuild(){for(const im of WL.ims){scene.remove(im);if(!im.userData.kg)im.geometry.dispose();if(im.material!==decoMat)im.material.dispose()}WL.ims=[];for(const f of WL.frogs)scene.remove(f.m);WL.frogs=[];
  const px=Math.round(player.p.x/2.5)*2.5,pz=Math.round(player.p.z/2.5)*2.5,R=55,pad=[],kelp=[],cor=[],stn=[],sgr=[],shl=[],slog=[],duck=[],drift=[],fsh=[],hh=(x,z,k)=>{const s=Math.sin(x*12.9898+z*78.233+k*37.719)*43758.5453;return s-Math.floor(s)};
  const cat=[],CATNO=[0,1,4,5,6,15,16,17,18,20,21,22,23];for(let z=pz-R;z<=pz+R;z+=2.5)for(let x=px-R;x<=px+R;x+=2.5){if(Math.hypot(x-px,z-pz)>R)continue;const h=colAt(x,z);if(h==null)continue;const WLv=Math.max(WATER,wlAt(x,z)||0);if(h>=WLv){if(h<WLv+0.7&&hh(x,z,11)<0.24){const b=biomeAt(x,z);const near=[[2.5,0],[-2.5,0],[0,2.5],[0,-2.5]].some(([ox,oz])=>(colAt(x+ox,z+oz)??99)<Math.max(WATER,wlAt(x+ox,z+oz)||0));if(near&&!CATNO.includes(b))cat.push([x+(hh(x,z,12)-0.5)*2,h,z+(hh(x,z,13)-0.5)*2,0.75+hh(x,z,14)*0.4,hh(x,z,15)])}continue}const d=WLv-h,b=biomeAt(x,z),jx=x+(hh(x,z,1)-0.5)*2,jz=z+(hh(x,z,2)-0.5)*2;
    if([7,14,3,19,11,10,2,13].includes(b)&&d>=0.5&&d<=2.8&&hh(x,z,3)<(b===7||b===14?0.2:0.1)&&Math.abs(Math.max(WATER,wlAt(jx,jz)||0)-WLv)<0.1&&(colAt(jx,jz)??99)<WLv-0.3){pad.push([jx,jz,0.7+hh(x,z,4)*0.6,hh(x,z,5),WLv]);if(hh(x,z,16)<0.6)pad.push([jx+(hh(x,z,17)-0.5)*1.6,jz+(hh(x,z,18)-0.5)*1.6,0.45+hh(x,z,19)*0.35,hh(x,z,20),WLv])}
    if(d<=1.15&&!CATNO.includes(b)&&hh(x,z,11)<([7,14,19,3,11,10,2].includes(b)?0.38:0.15))cat.push([jx,h,jz,(d+1.6)/2,hh(x,z,15)]);
    if(d>=2.5&&hh(x,z,6)<0.17)kelp.push([jx,h,jz,Math.min(d-0.6,5)*(0.45+hh(x,z,7)*0.55),hh(x,z,8)]);
    if(([9,8,4,1,0,15].includes(b)&&d>=1.6&&d<=7&&hh(x,z,9)<0.12)||(b===37&&d>=0.8&&d<=8&&hh(x,z,9)<0.55))cor.push([jx,h,jz,hh(x,z,10)]);
    /* więcej życia w wodzie: kamienie na dnie, trawa morska, muszle i rozgwiazdy, zatopione kłody, rzęsa przy brzegu, dryfujące drewno */
    {const warm=[0,1,4,8,9,15,30,37].includes(b),cold=[5,21,23,24,32].includes(b),swamp=[7,30,33].includes(b);
     if(d>=0.25&&hh(x,z,21)<(cold?0.16:0.1))stn.push([jx+0.4,h,jz-0.3,0.35+hh(x,z,22)*0.6,hh(x,z,23),d]);
     if(d>=0.3&&d<=3.2&&!cold&&hh(x,z,24)<(swamp?0.32:warm?0.26:0.2))sgr.push([x+(hh(x,z,25)-0.5)*2.2,h,z+(hh(x,z,26)-0.5)*2.2,Math.min(d*0.55,1.0)*(0.6+hh(x,z,27)*0.6),hh(x,z,28)]);
     if(d>=0.2&&d<=3.5&&(warm||b===1||b===0)&&hh(x,z,29)<0.07)shl.push([jx,h,jz,hh(x,z,30)]);
     if(d>=1.0&&hh(x,z,31)<0.011)slog.push([jx,h,jz,hh(x,z,32)]);
     if(swamp&&d<=1.4&&hh(x,z,33)<0.5)duck.push([jx,WLv,jz,hh(x,z,34)]);
     if(d>=1.6&&hh(x,z,37)<0.03)fsh.push([x,z,h,WLv,hh(x,z,38),b]);
     if(d>=1.5&&hh(x,z,35)<0.004&&!(season===2&&WATER_U.uIce.value>0.5))drift.push([jx,WLv,jz,hh(x,z,36)])}}
  const m4=new THREE.Matrix4(),col=new THREE.Color();
  if(season===2&&WATER_U.uIce.value>0.5)pad.length=0;if(pad.length){
    // lilie wodne: liście i kwiaty sklejone w jedną bryłę ze wspólnym materiałem dekoracji (ten sam co trawa i kwiaty na lądzie)
    const LZ=[];for(const [x,z,s,f,wv] of pad){const yw=(wv||WATER)-0.2;const c=f<0.33?'#3f8a3a':f<0.66?'#4a9a42':'#3a7a34',c2=darker(c,0.82),w=s*0.95;LZ.push([x,yw,z,w,0.03,w*0.7,c],[x,yw,z,w*0.7,0.03,w,c],[x,yw+0.004,z,w*0.82,0.03,w*0.82,c]);LZ.push([x+w*0.3,yw+0.008,z,w*0.32,0.031,0.06,c2]);
      if(f>0.62){if(!LILYG['L0'])lilyFlower(0),lilyFlower(1),lilyFlower(2);const k=f>0.9?0:f>0.78?1:2,sc=0.75+f*0.4,fx=x+Math.sin(f*31.4)*s*0.15,fz=z+Math.cos(f*31.4)*s*0.15;for(const b of LILYG['L'+k])LZ.push([fx+b[0]*sc,yw+0.02+b[1]*sc,fz+b[2]*sc,b[3]*sc,b[4]*sc,b[5]*sc,b[6]])}}
    const lm=new THREE.Mesh(boxes(LZ),decoMat);lm.frustumCulled=false;scene.add(lm);WL.ims.push(lm);
    for(let k=0;k<Math.min(4,Math.floor(pad.length/5));k++){const p=pad[Math.floor(Math.random()*pad.length)],fm=new THREE.Mesh(boxes([[0,0.07,0,0.16,0.12,0.2,'#4a8a3a'],[0,0.15,0.06,0.13,0.08,0.1,'#5a9a4a'],[0.05,0.19,0.09,0.03,0.03,0.02,'#141414'],[-0.05,0.19,0.09,0.03,0.03,0.02,'#141414'],[0.08,0.03,-0.06,0.05,0.04,0.12,'#3a7a2a'],[-0.08,0.03,-0.06,0.05,0.04,0.12,'#3a7a2a']]),decoMat);fm.scale.setScalar(1.6);fm.position.set(p[0],(p[4]||WATER)-0.25,p[1]);fm.rotation.y=Math.random()*6.28;scene.add(fm);WL.frogs.push({m:fm,x:p[0],z:p[1],wy:(p[4]||WATER),t:2+Math.random()*6,j:0})}}
  if(cat.length){const cm=wlGeo(cattailGeo(season===1||season===2),cat.length,0.035);const e=new THREE.Euler(),qq=new THREE.Quaternion(),pv=new THREE.Vector3(),sv=new THREE.Vector3();cat.forEach(([x,y,z,sc,f],i)=>{e.set(0,f*40,0);qq.setFromEuler(e);m4.compose(pv.set(x,y,z),qq,sv.set(sc*(0.9+f*0.2),sc,sc*(0.9+f*0.2)));cm.setMatrixAt(i,m4)});cm.count=cat.length;cm.instanceMatrix.needsUpdate=true;WL.ims.push(cm)}
  if(kelp.length){const im=wlBox(kelp.length*2,0,true);let q=0;for(const [x,y,z,h,f] of kelp){m4.makeScale(0.22,h,0.08);m4.setPosition(x,y,z);im.setMatrixAt(q,m4);im.setColorAt(q++,col.set(f<0.33?'#2f6a3a':f<0.66?'#3a7a3a':'#4a7a2a'));m4.makeScale(0.16,h*0.7,0.06);m4.setPosition(x+0.15,y,z+0.1);im.setMatrixAt(q,m4);im.setColorAt(q++,col.set('#285a30'))}im.count=q;im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;WL.ims.push(im)}
  if(cor.length){const im=wlBox(cor.length*3,0);let q=0;const CC=['#e86a8a','#f08a4a','#b86ad8','#f0d050','#e8e0d0'];for(const [x,y,z,f] of cor)for(let k=0;k<3;k++){const s=0.25+((f*7+k)%1)*0.35;m4.makeScale(s,s*(1.2+k*0.5),s);m4.setPosition(x+(k-1)*0.35,y,z+((k*3)%2-0.5)*0.4);im.setMatrixAt(q,m4);im.setColorAt(q++,col.set(CC[Math.floor(f*5+k)%5]))}im.count=q;im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;WL.ims.push(im)}  {// detale wodne sklejone w jedną bryłę (materiał dekoracji)
    const L=[],P=(...q)=>L.push(q);
    for(const [x,y,z,s,f,d] of stn){const n=2+Math.floor(f*3),G=['#7a7a76','#6a6a66','#8a8580','#5f6460'];for(let k=0;k<n;k++){const a=k*2.4+f*6,r=k?s*0.7:0,w=s*(k?0.6+((f*7+k)%1)*0.4:1),hgt=w*(0.45+((f*3+k)%1)*0.35),sx=x+Math.cos(a)*r,sz=z+Math.sin(a)*r,c=G[(k+Math.floor(f*4))%4];P(sx,y+hgt/2,sz,w,hgt,w*0.85,c);P(sx,y+hgt*0.9,sz,w*0.8,hgt*0.25,w*0.7,darker(c,1.08));if(d<4&&((f*5+k)%1)<0.6)P(sx,y+hgt+0.02,sz,w*0.75,0.05,w*0.6,'#4a6a34')}}
    for(const [x,y,z,f] of shl){if(f<0.45){const c=['#e8d8c0','#f0c8b0','#d8c8e0'][Math.floor(f*6)%3];P(x,y+0.04,z,0.22,0.08,0.18,c);P(x,y+0.09,z-0.01,0.16,0.04,0.12,darker(c,1.06));for(let k=-1;k<=1;k++)P(x+k*0.06,y+0.085,z,0.015,0.03,0.17,darker(c,0.85))}
      else{const c=f<0.75?'#e86a4a':'#f0a040',a0=f*6;P(x,y+0.03,z,0.12,0.05,0.12,c);for(let k=0;k<5;k++){const a=a0+k*1.2566,cx=Math.cos(a),sz=Math.sin(a);P(x+cx*0.12,y+0.025,z+sz*0.12,0.07+Math.abs(cx)*0.1,0.04,0.07+Math.abs(sz)*0.1,c)}}}
    for(const [x,y,z,f] of slog){const len=1.8+f*1.6,ax=f<0.5;P(x,y+0.22,z,ax?len:0.42,0.42,ax?0.42:len,'#4a3a2a');P(x,y+0.44,z,ax?len*0.8:0.3,0.06,ax?0.3:len*0.8,'#3f5a2e');P(ax?x+len/2:x,y+0.22,ax?z:z+len/2,ax?0.04:0.36,0.36,ax?0.36:0.04,'#6a5238');P(x+(ax?-len*0.2:0.25),y+0.5,z+(ax?0.25:-len*0.2),0.1,0.5,0.1,'#3a2c20')}
    for(const [x,y,z,f] of duck){const n=5+Math.floor(f*6);for(let k=0;k<n;k++){const a=k*2.1+f*9,r=0.25+((f*11+k)%1)*0.9;P(x+Math.cos(a)*r,y-0.17,z+Math.sin(a)*r,0.12+((k*0.37)%0.1),0.02,0.12,k%3?'#6aa83a':'#5a9a30')}}
    for(const [x,y,z,f] of drift){const ax=f<0.5,len=1.2+f*1.2;P(x,y-0.12,z,ax?len:0.26,0.22,ax?0.26:len,'#9a8a70');P(x,y-0.02,z,ax?len*0.6:0.18,0.04,ax?0.18:len*0.6,'#b0a088');P(x+(ax?len*0.3:0.15),y-0.04,z+(ax?0.15:len*0.3),ax?0.08:0.4,0.07,ax?0.4:0.08,'#8a7a60')}
    if(L.length){const m=new THREE.Mesh(boxes(L),decoMat);m.frustumCulled=false;scene.add(m);WL.ims.push(m)}}
  WL.sch=[];if(fsh.length){// ławice ryb: kilka grup krążących w połowie głębokości
    if(!WL.fG)WL.fG=boxes([[0,0,0,0.07,0.09,0.24,'#ffffff'],[0,0.01,0.1,0.055,0.07,0.06,'#f0f0f0'],[0,0,-0.15,0.02,0.1,0.07,'#d8d8d8'],[0,0.055,-0.01,0.015,0.03,0.1,'#d0d0d0'],[0.03,0.015,0.11,0.012,0.012,0.012,'#141414'],[-0.03,0.015,0.11,0.012,0.012,0.012,'#141414']]);
    const FC=['#9ab0c0','#c8b070','#7a9a8a','#d07040','#e8d040','#5a8ad0'],used=[];let tot=0;
    for(const [x,z,h,wv,f,b] of fsh){if(WL.sch.length>=7)break;if(used.some(u=>Math.hypot(u[0]-x,u[1]-z)<9))continue;used.push([x,z]);const n=6+Math.floor(f*8),warm=[0,1,9,30,37,8].includes(b);WL.sch.push({x,z,y:h+(wv-h)*0.5,dep:wv-h,r:1.2+f*2.2,n,sp:(0.35+f*0.4)*(f<0.5?1:-1),ph:f*40,col:FC[warm?3+Math.floor(f*3)%3:Math.floor(f*3)%3],sc:0.8+f*0.7,o:tot});tot+=n}
    if(tot){const im=wlGeo(WL.fG,tot,0);im.castShadow=false;for(const S of WL.sch)for(let i=0;i<S.n;i++)im.setColorAt(S.o+i,col.set(S.col).multiplyScalar(0.85+((i*0.37)%0.3)));im.count=tot;if(im.instanceColor)im.instanceColor.needsUpdate=true;WL.fim=im;WL.ims.push(im)}}
  if(sgr.length){// trawa morska: kępki cienkich źdźbeł, falujące
    if(!WL.sgG){const L=[];for(let k=0;k<7;k++){const a=k*0.9,r=0.05+((k*0.37)%0.18),h=0.55+((k*0.53)%0.45),c=k%3===0?'#3f7a3a':k%3===1?'#4a8a3e':'#2f6a34';L.push([Math.cos(a)*r,h/2,Math.sin(a)*r,0.045,h,0.02,c],[Math.cos(a)*r+0.01,h*0.85,Math.sin(a)*r,0.035,h*0.3,0.021,darker(c,1.12)])}WL.sgG=boxes(L)}
    const im=wlGeo(WL.sgG,sgr.length,0.06);const e=new THREE.Euler(),qq=new THREE.Quaternion(),pv=new THREE.Vector3(),sv=new THREE.Vector3();sgr.forEach(([x,y,z,sc,f],i)=>{e.set(0,f*30,0);qq.setFromEuler(e);m4.compose(pv.set(x,y,z),qq,sv.set(sc*1.2,sc,sc*1.2));im.setMatrixAt(i,m4)});im.count=sgr.length;im.instanceMatrix.needsUpdate=true;WL.ims.push(im)}
}
// wodospady: mgiełka u podstawy, szum, prąd wciągający w dół rzeki
let fallsT=0,fallSnd=0;
function fallsTick(dt){const p=player.p;fallsT-=dt;if(fallsT<=0){fallsT=1;FALLS.length=0;const cx=Math.floor(p.x/C),cz=Math.floor(p.z/C);for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){const ch=chunks.get(K(cx+dx,cz+dz));if(!ch||!ch.falls)continue;const F=ch.falls;for(let i=0;i<F.length;i+=4){const d=Math.hypot(F[i]-p.x,F[i+2]-p.z);if(d<55)FALLS.push([F[i],F[i+1],F[i+2],F[i+3],d])}}FALLS.sort((a,b)=>a[4]-b[4]);if(FALLS.length>60)FALLS.length=60}
  if(!FALLS.length||SPC)return;for(const f of FALLS){if(Math.random()<dt*5){PFX.emit(f[0]+(Math.random()-0.5)*0.8,f[3]+0.25,f[2]+(Math.random()-0.5)*0.8,1,['#ffffff','#e6f4ff','#cfe8f8'],{sp:1.4,up:1.8,life:0.8,size:0.12,g:2.5});if(Math.random()<0.5)PFX.emit(f[0],f[1]-Math.random()*(f[1]-f[3]),f[2],1,['#ffffff','#dff0ff'],{sp:0.5,up:-1.5,life:0.5,size:0.07,g:9})}}
  fallSnd-=dt;if(fallSnd<=0&&FALLS[0][4]<26){fallSnd=2.2+Math.random()*1.5;try{sfx('wave',Math.max(0.15,0.8*(1-FALLS[0][4]/26)))}catch(_){}}
  if(player.swim&&VH.mode===0&&!P2.dead){const w=wlAt(p.x,p.z);if(w>WATER){let gx=0,gz=0;for(const [ox,oz] of [[3,0],[-3,0],[0,3],[0,-3],[6,0],[-6,0],[0,6],[0,-6]]){const x=p.x+ox,z=p.z+oz,h=colAt(x,z),w2=wlAt(x,z);if(h!==null&&h<w2&&w2<w||(h!==null&&w2===WATER&&h<WATER)){gx+=Math.sign(ox);gz+=Math.sign(oz)}}const l=Math.hypot(gx,gz);if(l>0){p.x+=gx/l*2.4*dt;p.z+=gz/l*2.4*dt}}}}
function whaleMake(){const g=new THREE.Group(),L=[];for(let k=0;k<8;k++)L.push([0,0.15+Math.sin(k/7*Math.PI)*0.5,-3+k*0.9,1.4-Math.abs(k-3.5)*0.15,0.6,0.95,k%2?'#3a4a5a':'#45566a']);L.push([0,0.9,0.2,0.18,0.8,0.7,'#2e3c4a'],[0,1.2,-0.05,0.14,0.4,0.4,'#2e3c4a'],[0,0.3,-4,1.8,0.12,0.5,'#3a4a5a']);g.add(new THREE.Mesh(boxes(L),decoMat));scene.add(g);return g}
let AIR=12,airHurtT=0;
const FISH={st:0,t:0,bob:null,line:null,ten:0,prog:0,tl:0};
const FISHT=[['plotka','Płotka',6,35],['okon','Okoń',9,25],['karp','Karp',14,15],['szczupak','Szczupak',22,10],['losos','Łosoś',30,7],['wegorz','Węgorz',40,3],['zlota','Złota rybka',150,1],['skarb','Skrzynka',0,2],['but','Stary but',0,2]];
function fishCount(){let n=0;for(const k in (INV.fish||{}))n+=INV.fish[k];return n}
function fishValue(){let v=0;for(const k in (INV.fish||{})){const t=FISHT.find(q=>q[0]===k);if(t)v+=t[2]*INV.fish[k]}return v}
function sellFish(){const v=fishValue();INV.gold+=v;INV.fish={};saveInv();updHud();sfx('coin');dlgRoot('Świeże ryby zawsze się sprzedadzą. Masz '+v+' zł.')}
function fishCancel(msg){if(FISH.bob){scene.remove(FISH.bob);FISH.bob=null}if(FISH.line){scene.remove(FISH.line);FISH.line=null}FISH.st=0;$('fishui').hidden=true;if(msg)toast(msg,'#cfe8ff')}
function fishKey(){if(FISH.st===2){FISH.st=3;FISH.ten=0.5;FISH.prog=0.2;FISH.tl=12;$('fishui').hidden=false;sfx('splash',0.5);return}if(FISH.st===1||FISH.st===3){if(FISH.st===1)fishCancel('Zwijasz żyłkę.');return}
  if(!INV.rod)return toast('Potrzebujesz wędki. Kupisz ją u kupca albo u kapitana portu.','#ff8a7a');if(P2.dead||(VH.mode!==0&&VH.mode!==1))return;
  let spot=null;const fy=player.ry;for(const d of [6,5,7,4,8]){const x=player.p.x+Math.sin(fy)*d,z=player.p.z+Math.cos(fy)*d,h=colAt(x,z);if(h!==null&&h<wlAt(x,z)-0.5){spot=[x,z];break}}
  if(!spot)return toast('Stań przodem do wody, żeby zarzucić wędkę','#ff8a7a');
  const b=new THREE.Mesh(boxes([[0,0.06,0,0.16,0.12,0.16,'#e8e6e0'],[0,0.15,0,0.12,0.08,0.12,'#c8302a'],[0,0.24,0,0.03,0.12,0.03,'#c8302a']]),decoMat);b.position.set(spot[0],wlAt(spot[0],spot[1])-0.32,spot[1]);scene.add(b);FISH.bob=b;
  const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(6),3));FISH.line=new THREE.Line(lg,new THREE.LineBasicMaterial({color:0xe8e6e0}));FISH.line.frustumCulled=false;scene.add(FISH.line);
  FISH.st=1;FISH.t=3+Math.random()*7;sfx('splash',0.35);toast('Zarzucono wędkę – czekaj na branie (U zwija)','#cfe8ff')}
function fishTick(dt){const ui=$('fishui');if(!FISH.st)return;const b=FISH.bob;if(!b){fishCancel();return}
  if(Math.hypot(b.position.x-player.p.x,b.position.z-player.p.z)>14||P2.dead){fishCancel('Żyłka się splątała.');return}
  const t=performance.now()/1000,fy=player.ry,tip=[player.p.x+Math.sin(fy)*1.6+Math.cos(fy)*0.35,player.p.y+2.4,player.p.z+Math.cos(fy)*1.6-Math.sin(fy)*0.35];
  const a=FISH.line.geometry.attributes.position.array;a[0]=tip[0];a[1]=tip[1];a[2]=tip[2];a[3]=b.position.x;a[4]=b.position.y+0.24;a[5]=b.position.z;FISH.line.geometry.attributes.position.needsUpdate=true;
  const u=meRef.userData;if(u.ra){u.ra.rotation.x=-1.0-(FISH.st===3?Math.sin(t*12)*0.15:0);u.ra.rotation.z=0.1}
  if(FISH.st===1){b.position.y=WATER-0.32+Math.sin(t*2)*0.02;FISH.t-=dt;if(FISH.t<=0){FISH.st=2;FISH.t=1.3;sfx('splash',0.7);PFX.emit(b.position.x,WATER-0.2,b.position.z,10,['#ffffff','#cfe8ff'],{sp:2,up:2,life:0.5,size:0.07});toast('Bierze! Naciśnij U!','#ffd34d')}}
  else if(FISH.st===2){b.position.y=WATER-0.5+Math.sin(t*25)*0.06;FISH.t-=dt;if(FISH.t<=0)fishCancel('Ryba zerwała się z haczyka.')}
  else if(FISH.st===3){const hold=keys.has('KeyU');FISH.ten+=dt*(hold?0.75:-0.6)+(Math.sin(t*3.7)+Math.sin(t*6.1))*dt*0.25;FISH.tl-=dt;const inZ=FISH.ten>0.35&&FISH.ten<0.75;FISH.prog+=dt*(inZ?0.26:-0.1);b.position.y=WATER-0.45+Math.sin(t*14)*0.05;
    b.position.x+=(player.p.x-b.position.x)*dt*0.08*(inZ?1:0);b.position.z+=(player.p.z-b.position.z)*dt*0.08*(inZ?1:0);
    ui.querySelector('.fz i').style.left=(Math.max(0,Math.min(1,FISH.ten))*100)+'%';ui.querySelector('.fp i').style.width=(Math.max(0,Math.min(1,FISH.prog))*100)+'%';
    if(FISH.ten>=1){fishCancel('Żyłka pękła! Trzymaj napięcie w zielonym polu.');return}if(FISH.prog<=0||FISH.tl<=0||FISH.ten<=0.02){fishCancel('Ryba uciekła.');return}
    if(FISH.prog>=1){const tot=FISHT.reduce((s,q)=>s+q[3],0);let r=Math.random()*tot,k=0;while(r>FISHT[k][3]){r-=FISHT[k][3];k++}const T=FISHT[k];
      if(T[0]==='skarb'){const it=genItem(Math.max(1,HERO.lvl),15);if(INV.bag.length<bagN()){INV.bag.push(it);toast('Wyłowiono skrzynkę: '+it.name,RAR[it.rar].c)}else toast('Wyłowiono skrzynkę, ale plecak jest pełny','#ff8a7a');INV.gold+=10+Math.floor(Math.random()*20)}
      else if(T[0]==='but'){toast('Wyłowiono… stary but. Może kiedyś się przyda.','#cfe8ff')}
      else{INV.fish=INV.fish||{};INV.fish[T[0]]=(INV.fish[T[0]]||0)+1;try{for(const q of W.quests)if(q.type==='fish'&&!q.done)questInc(q)}catch(_){}toast('Złowiono: '+T[1]+' (wartość '+T[2]+' zł)',T[0]==='zlota'?'#ffd34d':'#7dd87d');INV.food.mieso=(INV.food.mieso||0)+(Math.random()<0.3?1:0)}
      gainXp(8+T[2]);saveInv();updHud();sfx('coin',0.5);PFX.emit(b.position.x,WATER,b.position.z,16,['#ffffff','#cfe8ff','#7fd0ff'],{sp:3,up:3,life:0.6,size:0.08});fishCancel()}}}
function waterLifeTick(dt){const p=player.p,t=performance.now()/1000;
  // pogoda i pora: deszcz, burza, plankton, lód
  const wet=WX.k==='deszcz'||WX.k==='burza';WATER_U.uRain.value+=((wet?1:0)-WATER_U.uRain.value)*Math.min(1,dt*0.5);WATER_U.uStorm.value+=((WX.k==='burza'?1:0)-WATER_U.uStorm.value)*Math.min(1,dt*0.3);
  WATER_U.uNight.value+=(((hour>20.5||hour<5)?1:0)-WATER_U.uNight.value)*Math.min(1,dt*0.3);WATER_U.uIce.value+=((season===2?1:0)-WATER_U.uIce.value)*Math.min(1,dt*0.2);
  if(VH.boat&&WATER_U.uStorm.value>0.05){VH.boat.rotation.z=Math.sin(t*1.4)*0.08*WATER_U.uStorm.value;VH.boat.rotation.x=Math.sin(t*1.1+1)*0.06*WATER_U.uStorm.value;VH.boat.position.y+=Math.sin(t*1.6)*0.15*WATER_U.uStorm.value}
  WL.t-=dt;if(WL.t<=0){WL.t=2;if(!WL.c||Math.hypot(p.x-WL.c[0],p.z-WL.c[1])>20){WL.c=[p.x,p.z];try{wlRebuild()}catch(e){console.warn('woda',e)}}}
  if(WL.fim&&WL.sch&&WL.sch.length&&WL.ims.includes(WL.fim)){const t=performance.now()/1000,m=_fm4||(_fm4=new THREE.Matrix4()),e=_fe||(_fe=new THREE.Euler()),q=_fq||(_fq=new THREE.Quaternion()),pv=_fv||(_fv=new THREE.Vector3()),sv=_fs||(_fs=new THREE.Vector3());
    for(const S of WL.sch){const fl=Math.hypot(S.x-p.x,S.z-p.z)>60;for(let i=0;i<S.n;i++){const a=S.ph+t*S.sp+i*0.42,r=S.r+Math.sin(i*1.7)*0.45,y=S.y+Math.sin(t*1.3+i*0.9)*Math.min(0.25,S.dep*0.15)+((i%3)-1)*0.12;pv.set(S.x+Math.cos(a)*r,fl?-999:y,S.z+Math.sin(a)*r);e.set(0,Math.atan2(-Math.sin(a)*Math.sign(S.sp),Math.cos(a)*Math.sign(S.sp))+Math.sin(t*8+i)*0.12,0);q.setFromEuler(e);m.compose(pv,q,sv.setScalar(S.sc*(0.85+((i*0.29)%0.3))));WL.fim.setMatrixAt(S.o+i,m)}}WL.fim.instanceMatrix.needsUpdate=true}
  for(const f of WL.frogs){f.t-=dt;if(f.t<=0&&f.j<=0){f.j=0.6;f.t=3+Math.random()*7;f.a=Math.random()*6.28;f.m.rotation.y=f.a}if(f.j>0){f.j-=dt;const k=1-f.j/0.6;f.m.position.x+=Math.sin(f.a)*dt*1.6;f.m.position.z+=Math.cos(f.a)*dt*1.6;f.m.position.y=(f.wy||WATER)-0.25+Math.sin(k*Math.PI)*0.45;if(f.j<=0){const h=colAt(f.m.position.x,f.m.position.z);if(h!==null&&h>=(f.wy||WATER)-0.2){f.m.position.x=f.x;f.m.position.z=f.z}}}
    if(Math.hypot(f.m.position.x-p.x,f.m.position.z-p.z)<2.5&&f.j<=0){f.t=0}}
  // wieloryb daleko od brzegu
  WL.wT-=dt;if(!WL.whale&&WL.wT<=0&&!SPC){WL.wT=25+Math.random()*30;for(let k=0;k<6;k++){const a=Math.random()*6.28,d=60+Math.random()*50,x=p.x+Math.cos(a)*d,z=p.z+Math.sin(a)*d,h=colAt(x,z);if(h!==null&&h<WATER-8){const g=whaleMake();g.position.set(x,WATER-1.2,z);WL.whale={g,a:a+Math.PI/2,t:24,sp:4};break}}}
  if(WL.whale){const w=WL.whale;w.t-=dt;w.g.position.x+=Math.sin(w.a)*dt*2.2;w.g.position.z+=Math.cos(w.a)*dt*2.2;w.g.rotation.y=w.a;const k=Math.sin((24-w.t)/24*Math.PI);w.g.position.y=WATER-1.6+k*0.9+Math.sin(t*0.7)*0.15;w.sp-=dt;if(w.sp<=0&&k>0.5){w.sp=5+Math.random()*3;PFX.emit(w.g.position.x,WATER+1.2,w.g.position.z,26,['#ffffff','#dfefff'],{sp:1.5,up:7,life:1.2,size:0.12,g:-3})}if(w.t<=0){scene.remove(w.g);WL.whale=null}}
  // mgła nad wodą o świcie
  if(!WL.mist){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');for(let i=0;i<60;i++){const g2=x.createRadialGradient(0,0,0,0,0,30);g2.addColorStop(0,'rgba(255,255,255,.35)');g2.addColorStop(1,'rgba(255,255,255,0)');const bx=Math.random()*128,by=Math.random()*128;for(const ox of [-128,0,128])for(const oy of [-128,0,128]){x.save();x.translate(bx+ox,by+oy);x.fillStyle=g2;x.fillRect(-30,-30,60,60);x.restore()}}/* obłoczki zawijane na drugą stronę kafelka: tekstura bez szwów */const tx=new THREE.CanvasTexture(c);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(6,6);WL.mist=[];for(const y of [0.25,0.6,0.95,1.3,1.65,2.0]){const t2=tx.clone();t2.needsUpdate=true;const ms=new THREE.Mesh(new THREE.PlaneGeometry(260,260),mistMat(t2,y));ms.rotation.x=-Math.PI/2;ms.renderOrder=4;scene.add(ms);WL.mist.push([ms,y])}}
  {const dawn=hour>4.3&&hour<8?Math.sin((hour-4.3)/3.7*Math.PI):0;if(dawn>0.02&&!SPC){try{mistHUpdate(p.x,p.z)}catch(_){}}MISTH.U.uPC.value.set(Math.round(p.x),Math.round(p.z));for(const [ms,y] of WL.mist){ms.position.set(Math.round(p.x),WATER+y,Math.round(p.z));ms.material.opacity=dawn*0.2*(SPC?0:1)*(season===2?0.5:1);ms.material.map.offset.set(t*0.004*(1+y*0.3)+y*0.37+Math.round(p.x)*6/260,t*0.003+y*0.61-Math.round(p.z)*6/260);ms.visible=dawn>0.02}}
  // oddech pod wodą
  {const under=player.swim&&p.y+1.55<wlAt(p.x,p.z)-0.3&&VH.mode===0,el=$('airw');if(under){AIR=Math.max(0,AIR-dt);if(Math.random()<dt*2)PFX.emit(p.x,p.y+1.6,p.z,2,['#dff4ff','#ffffff'],{sp:0.4,up:1.6,life:1.2,size:0.06,g:-1.5});if(AIR<=0){airHurtT-=dt;if(airHurtT<=0){airHurtT=1;takeDamage(ST.hp*0.08,null);toast('Brakuje ci powietrza!','#ff8a7a')}}}else AIR=Math.min(12+(hasP('plywak')?8:0),AIR+dt*4);
    if(el){const mx=12+(hasP('plywak')?8:0);el.hidden=AIR>=mx-0.01;el.querySelector('i').style.width=(AIR/mx*100)+'%'}}
  // prąd rzeki: znosi pływaka i łódź w dół doliny
  {const b=biomeAt(p.x,p.z);if(b===13&&(player.swim||VH.mode===1)){const s=(x,z)=>colAt(x,z)??WATER;let gx=0,gz=0;for(const r of [12,24]){gx+=s(p.x+r,p.z)-s(p.x-r,p.z);gz+=s(p.x,p.z+r)-s(p.x,p.z-r)}const l=Math.hypot(gx,gz);if(l>0.5){const k=1.4*dt/l;p.x-=gx*k;p.z-=gz*k}}}
  fishTick(dt)}
// ---------- kamera ----------
let camY=null;
function camRay(ax,ay,az,bx,by,bz){let tmin=1;
  const box=(cx,cz,hw,hd,y0,y1,c,s)=>{const tr=(x,z)=>{const dx=x-cx,dz=z-cz;return[dx*c-dz*s,dx*s+dz*c]};const A=tr(ax,az),Bp=tr(bx,bz);
    if(Math.abs(A[0])<hw&&Math.abs(A[1])<hd&&ay>y0&&ay<y1)return;let t0=0,t1=1;for(const [p,q,lo,hi] of [[A[0],Bp[0],-hw,hw],[ay,by,y0,y1],[A[1],Bp[1],-hd,hd]]){const dd=q-p;if(Math.abs(dd)<1e-6){if(p<lo||p>hi)return;continue}let ta=(lo-p)/dd,tb=(hi-p)/dd;if(ta>tb){const t=ta;ta=tb;tb=t}t0=Math.max(t0,ta);t1=Math.min(t1,tb);if(t0>t1)return}if(t0<tmin)tmin=t0};
  for(const v of villages.values()){if(!v||Math.abs(v.x-ax)>60+(v.Hs||0)||Math.abs(v.z-az)>60+(v.Hs||0))continue;
    for(const h of v.houses){if(!h.core||Math.abs(h.x-ax)>34||Math.abs(h.z-az)>34)continue;const k=h.core;box(h.cx??h.x,h.cz??h.z,k.w/2,k.d/2,h.top-3,h.top+(h.castle?24:v.city?14:9),Math.cos(h.rot),Math.sin(h.rot))}
    if(v.cols)for(const [cx,cz,hw,hd,top] of v.cols)if(Math.abs(cx-ax)<40&&Math.abs(cz-az)<40)box(cx,cz,hw,hd,top-30,top,1,0)}
  for(const s of structs.values()){if(!s||!s.cols||Math.abs(s.x-ax)>60||Math.abs(s.z-az)>60)continue;for(const [cx,cz,hw,hd,top] of s.cols)box(cx,cz,hw,hd,top-30,top,1,0)}
  if(SPC){for(let i=1;i<=28;i++){const t=i/28,x=ax+(bx-ax)*t,z=az+(bz-az)*t,y=ay+(by-ay)*t,sh=spaceH(x,z,y);if(sh!==null&&sh>y){tmin=Math.min(tmin,(i-1)/28);break}}}
  return tmin}
let camDC=null;
// czy punkt (z promieniem r) dotyka ściany wnętrza lub mebla z kolizją
function camSolid(x,z,y,r){for(const [ox,oz] of [[0,0],[r,0],[-r,0],[0,r],[0,-r],[r*0.7,r*0.7],[-r*0.7,r*0.7],[r*0.7,-r*0.7],[-r*0.7,-r*0.7]]){const h=spaceH(x+ox,z+oz,y);if(h!==null&&h>y)return true}
  if(SPC&&SPC.cols)for(const c of SPC.cols){if(c[5]===1)continue;const [cx,cz,hw,hd,top]=c;if(y<top&&y>top-6&&Math.abs(x-cx)<hw+r*0.5&&Math.abs(z-cz)<hd+r*0.5)return true}return false}
function updateCamera(dt){
  const t=player.p,ty0=player.visY??t.y; if(camY===null)camY=ty0; camY+=(ty0-camY)*Math.min(1,9*dt);
  const cust=custOpen(),Y=cust?player.ry+custYaw:yaw,Pp=cust?custPit:pitch,sh=cust?0:Math.min(1.05,0.35+dist*0.05);
  const IN=SPC&&SPC.kind!=='arena'&&!cust;let shK=1;
  if(IN){/* ciasne wnętrza: ramię kamery nie może wejść w ścianę */const hy=camY+1.62;for(let i=1;i<=6;i++){const k=i/6,qx=t.x+Math.cos(Y)*sh*k,qz=t.z-Math.sin(Y)*sh*k;if(camSolid(qx,qz,hy,0.28)){shK=Math.max(0,(i-1)/6-0.08);break}}}
  const rx=Math.cos(Y),rz=-Math.sin(Y),tx=t.x+rx*sh*shK,ty=camY+(cust?1.1:1.62),tz=t.z+rz*sh*shK;   // kamera zza prawego ramienia: postać nie zasłania celownika
  let d=cust?custD:IN?Math.min(dist,4.6):dist; const cp=Math.cos(Pp);
  if(IN&&Pp>0.05){const cy=SPC.fy+SPC.ceil-0.45;if(ty+Math.sin(Pp)*d>cy)d=Math.max(0.5,(cy-ty)/Math.sin(Pp))}
  let x=tx+Math.sin(Y)*cp*d,y=ty+Math.sin(Pp)*d,z=tz+Math.cos(Y)*cp*d;
  for(let i=0;i<8;i++){const h=colAt(x,z,y);if(h===null||y>h+0.5)break;d*=0.8;x=tx+Math.sin(Y)*cp*d;y=ty+Math.sin(Pp)*d;z=tz+Math.cos(Y)*cp*d}
  if(!cust){const tt=camRay(tx,ty,tz,x,y,z);let want=tt<1?Math.max(0.6,d*tt-0.35):d;if(camDC===null||want<camDC)camDC=want;else camDC+=(want-camDC)*Math.min(1,4*dt);if(camDC<d-0.01){d=camDC;x=tx+Math.sin(Y)*cp*d;y=ty+Math.sin(Pp)*d;z=tz+Math.cos(Y)*cp*d}}
  if(IN){/* odstęp od ścian: kamera nie zagląda za ścianę ani nie przecina jej płaszczyzną bliską */for(let i=0;i<10&&d>0.35&&camSolid(x,z,y,0.32);i++){d=Math.max(0.3,d-0.25);x=tx+Math.sin(Y)*cp*d;y=ty+Math.sin(Pp)*d;z=tz+Math.cos(Y)*cp*d}camDC=Math.min(camDC??d,d)}
  const h=colAt(x,z,y); if(h!==null&&y<h+0.5)y=h+0.5;if(SPC)y=Math.min(y,SPC.fy+SPC.ceil-0.35);
  {const nr=IN?0.08:0.25;if(camera.near!==nr){camera.near=nr;camera.updateProjectionMatrix()}}
  if(meRef){const close=IN&&Math.hypot(x-t.x,z-t.z)<0.75&&Math.abs(y-(camY+1.5))<0.9;if(close!==!!meRef.userData.camHide){meRef.userData.camHide=close;meRef.visible=!close}}
  camera.position.set(x,y,z); camera.lookAt(tx,ty,tz);if(P2.shake>0&&!SET_G.shake)P2.shake=0;if(PHO.cam){camera.position.set(PHO.cam[0],PHO.cam[1],PHO.cam[2]);camera.lookAt(PHO.cam[3],PHO.cam[4],PHO.cam[5]);hour=12.5}if(P2.shake>0){const k=P2.shake;camera.position.x+=(Math.random()-0.5)*k;camera.position.y+=(Math.random()-0.5)*k;camera.position.z+=(Math.random()-0.5)*k;P2.shake=Math.max(0,k-dt*1.2)}
  { const ws=(S.rd*2+3)*C,sg=ws/160; water.position.set(Math.round(t.x/sg)*sg,WATER-0.3,Math.round(t.z/sg)*sg); water.scale.set(ws,ws,1);try{waterDepthTick(water.position.x,water.position.z,Math.min(ws,600))}catch(_){}const tt=performance.now()/1000;for(const R of WRIP){R.ms.position.set(water.position.x,WATER-0.3+R.dy,water.position.z);R.ms.scale.set(ws,ws,1);R.tx.repeat.set(ws/R.rep,ws/R.rep);R.tx.offset.set(water.position.x/R.rep+tt*R.sp[0],-water.position.z/R.rep+tt*R.sp[1]);R.ms.material.opacity=R.op+0.08*Math.sin(tt*0.6+R.rep);R.ms.visible=!SPC} }
  const under=y<wlAt(camera.position.x,camera.position.z)-0.15;
  lighting(t.x,t.y,t.z);
  if(SPC){if(SPC.kind==='interior'){const dl=Math.max(0,Math.min(1,(Math.min(hour-5.5,19.5-hour))/1.5));sun.intensity*=0.12;hemi.intensity=SPC.func==='zamek'?0.3+0.22*dl:0.2+0.08*dl}else if(SPC.kind==='arena'){sun.intensity=Math.min(0.9,Math.max(0.3,sun.intensity*0.85));hemi.intensity=Math.min(0.85,Math.max(0.5,hemi.intensity*1.05))}else{sun.intensity=0.03;hemi.intensity=0.07}}
  try{CLOUDS.tick(performance.now()/1000,camera.position.x,camera.position.z,1-Math.min(1,Math.max(0,(SKYC.b-0.06)/0.84)))}catch(e){}
  const far=S.rd*C*0.95*SET_G.fog,near=far*0.42; scene.fog.near=under?2:near; scene.fog.far=under?28:far; scene.fog.color.copy(under?UWC:SKYC);if(SPC&&SPC.kind==='arena'){scene.fog.near=60;scene.fog.far=160;scene.fog.color.copy(SKYC).lerp(_arenaSky,0.35)}else if(SPC&&SPC.kind!=='interior'){scene.fog.near=6;scene.fog.far=46;scene.fog.color.setHex(0x07060a)}else if(SPC){scene.fog.near=20;scene.fog.far=90;scene.fog.color.setHex(0x1a140e)} scene.background=scene.fog.color;
  {const wi=WX.k==='mgla'?WX.i:WX.k!=='jasno'?WX.i*0.5:0;if(!under&&!SPC&&wi>0){scene.fog.far=Math.max(55,far*(1-0.7*wi));scene.fog.near=Math.min(scene.fog.near,scene.fog.far*0.15)}}
  {const mi=(window.BFX&&BFX.mist)||0;if(!under&&!SPC&&mi>0.01){scene.fog.far=scene.fog.far+(Math.min(scene.fog.far,34)-scene.fog.far)*mi;scene.fog.near=Math.min(scene.fog.near,scene.fog.far*0.08);scene.fog.color.lerp(new THREE.Color(0.62,0.66,0.62),mi*0.6)}}
  /* v123: wysoko nad ziemią (lotnia, wieże, góry) mgła nie zasłania całkowicie terenu pod graczem */if(!under&&!SPC){const gh=colAt(camera.position.x,camera.position.z),wl=Math.max(gh==null?WATER:gh,WATER),alt=camera.position.y-wl;if(alt>8){const need=Math.min(far,alt*1.7+45);if(scene.fog.far<need){scene.fog.far=need;scene.fog.near=Math.min(scene.fog.near,need*0.35)}}}
  if(Math.abs(camera.far-(far+200))>1||camera.fov!==S.fov){camera.far=far+200;camera.fov=S.fov;camera.updateProjectionMatrix()}
}

// ---------- sterowanie ----------
const cv=renderer.domElement;
let dragging=false;
cv.addEventListener('click',()=>{if(document.pointerLockElement!==cv&&!uiOpen()&&cv.requestPointerLock){try{const r=cv.requestPointerLock();r&&r.catch&&r.catch(()=>{noLock=true;setTimeout(()=>{if(document.pointerLockElement!==cv&&!uiOpen())try{const r2=cv.requestPointerLock();r2&&r2.catch&&r2.catch(()=>{})}catch(_){}},1300)})}catch(e){noLock=true}}});
document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement===cv){noLock=false;return}/* v149: Esc zwalnia kursor bez zdarzenia klawisza — otwórz menu gry, jeśli nic innego nie jest otwarte */setTimeout(()=>{if(document.pointerLockElement===cv||anyWin()||uiOpen()||!player.ready||player.hold||P2.dead>0||(typeof FISH!=='undefined'&&FISH.st)||document.hidden)return;openGM()},160)});
// po zamknięciu dowolnego okna gry kursor wraca do sterowania kamerą (blokada wskaźnika), bez dodatkowego klikania
const WINIDS=['gmenu','menu','chatbox','clsel','chestui','perks','journal','dlg','inv','petsui','mapwrap','notepop','custom','dgmap'];let winWas=false,winT=0;
function anyWin(){for(const id of WINIDS){const el=document.getElementById(id);if(el&&!el.hidden&&el.style.display!=='none')return true}return !!dlg||custOpen()}
function relockTick(dt){const o=anyWin();if(o){winWas=true;winT=0;return}if(!winWas)return;winT+=dt;if(winT<0.05)return;winWas=false;if(P2.dead>0||document.pointerLockElement===cv||!player.ready||!cv.requestPointerLock)return;
  const tryL=n=>{try{const r=cv.requestPointerLock();r&&r.catch&&r.catch(()=>{if(n>0)setTimeout(()=>{if(!anyWin()&&document.pointerLockElement!==cv)tryL(n-1)},450)})}catch(_){}};tryL(3)}
setInterval(()=>{const c=uiOpen()?'':'none';if(cv.style.cursor!==c)cv.style.cursor=c},250);
document.addEventListener('pointerlockerror',()=>{noLock=true});
let noLock=false;
cv.addEventListener('mousedown',e=>{dragging=true;const locked=document.pointerLockElement===cv;if(e.button===0&&(locked||noLock))P2.mouse=true;if(e.button===2&&(locked||noLock))rmbDown()});
addEventListener('mouseup',e=>{dragging=false;if(e.button===0)P2.mouse=false;if(e.button===2)rmbUp()});
let custYaw=0,custPit=0.1,custD=3.3;/* v141: w kreatorze postaci kamerę obraca się przeciągając myszą, kółko przybliża */cv.addEventListener('wheel',e=>{if(custOn){custD=Math.max(1.8,Math.min(5.5,custD+Math.sign(e.deltaY)*0.3))}},{passive:true});
addEventListener('mousemove',e=>{if(custOn&&dragging){custYaw-=e.movementX*0.008;custPit=Math.max(-0.35,Math.min(1.0,custPit+e.movementY*0.005));return}if(document.pointerLockElement===cv||dragging){yaw-=e.movementX*0.0035;pitch=Math.max((P3&&P3.chg)||(typeof isBow==='function'&&isBow())?-1.1:-0.5,Math.min(1.35,pitch+e.movementY*0.0035))}});
cv.addEventListener('wheel',e=>{dist=Math.max(3.5,Math.min(30,dist*(e.deltaY>0?1.1:0.91)));e.preventDefault()},{passive:false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
const uiOpen=()=>!$('menu').hidden||!$('gmenu').hidden||!$('chatbox').hidden||!$('clsel').hidden||custOpen()||!$('chestui').hidden||!$('tradeui').hidden;
addEventListener('beforeunload',e=>{if(S.spawn&&player.ready&&!window.__noSave){e.preventDefault();e.returnValue=''}});
addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'){if(e.code==='Enter'&&e.target.id==='prenin'){const b=document.querySelector('[data-pact="rok"]');b&&b.click();return}if(e.code==='Enter'&&e.target.id==='chatin'){sendChat(e.target.value);e.target.value='';$('chatbox').hidden=true;cv.focus()}if(e.code==='Escape'&&e.target.id==='chatin'){$('chatbox').hidden=true}return}
  if((e.code==='Escape'||e.code==='KeyF')&&!$('chestui').hidden){chestUiClose();return}
  if((e.code==='Escape'||e.code==='KeyF')&&!$('tradeui').hidden){tradeClose();return}
  if(e.code==='Escape'&&!$('chatbox').hidden){$('chatbox').hidden=true;return}
  if(e.code==='Escape'&&FISH.st){fishCancel('Zwijasz żyłkę.');return}
  if(e.code==='Escape'&&custOpen()){closeCustom();return}
  if(e.code==='Escape'&&dlg){closeDialog();return}
  if(e.code==='Escape'&&petsOpen()){togglePets();return}
  if(e.code==='Escape'&&invOpen()){toggleInv();return}
  if(e.code==='Escape'&&!$('perks').hidden){togglePerks();return}
  if(e.code==='Escape'&&!$('clsel').hidden&&HERO.pas&&HERO.pas.length===3){$('clsel').hidden=true;return}
  if(e.code==='Escape'||e.code==='Tab'){escPress();e.preventDefault();return}
  if(e.code==='KeyE'||e.code==='KeyI'){if(petsOpen())togglePets();toggleInv();return}
  if(e.code==='ControlLeft'||e.code==='ControlRight'){e.preventDefault();if(VH.mode!==6&&!player.swim)roll();return}
  if(e.code==='AltLeft'||e.code==='AltRight'){e.preventDefault();if(VH.mode===0&&!player.swim){P3.sneak=!P3.sneak;toast(P3.sneak?'Skradanie: włączone (Alt)':'Skradanie: wyłączone','#cfe8ff')}return}
  if(e.code==='KeyX'&&!player.swim){dash();return}
  if(e.code==='KeyP'){togglePets();return}
  if(e.code==='KeyK'){togglePerks();return}
  if(e.code==='KeyQ'){useAbility('q');return}
  if(!dlg&&/^Digit[1-8]$/.test(e.code)){useHot(+e.code.slice(5)-1);return}
  if(!dlg&&e.code==='KeyZ'&&!e.repeat&&!invOpen()&&!uiOpen()){swapWeaponKind();return}
  if(dlg&&/^Digit[1-9]$/.test(e.code)){const o=dlg.opts[+e.code.slice(5)-1];if(o&&!o[2])o[1]();return}
  if(e.code==='KeyH'){$('help').classList.toggle('min');LS.set('helpmin',$('help').classList.contains('min'));return}
  if(e.code==='F3'){S.dbg=!S.dbg;e.preventDefault();return}
  if(e.code==='KeyN'){buildHut();return}
  if(e.code==='Digit0'&&!dlg){luckBurst();return}
  if((e.code==='KeyF'||e.code==='Space')&&P2.ride&&!dlg){rideOff();return}
  if(e.code==='KeyF'){if(window.REVT)return;if(!nearNpc&&nearTrav&&!dlg&&!nearLoot){openDialog(nearTrav);return}if(nearLoot&&!dlg){pickLoot=true;return}if(!nearNpc&&!dlg&&!nearDoor&&!nearChest&&window.hutAct&&hutAct())return;if(nearNpc&&!dlg)openDialog(nearNpc);else if(nearDoor&&!dlg)useDoor(nearDoor);else if(nearChest&&!dlg)openChest(nearChest);return}
  if(e.code==='KeyJ'){toggleJournal();return}
  if(e.code==='KeyM'){if(SPC&&(SPC.kind==='dungeon'||SPC.kind==='cave')){toggleDgMap();return}toggleMap();return}
  if(e.code==='KeyL'){toggleLamp();return}
  if(e.code==='Enter'){$('chatbox').hidden=false;$('chatin').focus();try{document.exitPointerLock()}catch(_){}e.preventDefault();return}
  if(e.code==='Space'&&!e.repeat){if(VH.mode===2){stopGlide();e.preventDefault();return}if(startGlide()){e.preventDefault();return}}
  if((e.code==='ShiftLeft'||e.code==='ShiftRight')&&!e.repeat&&(VH.mode===1||VH.mode===4)){/* v150: Shift — wyjście z łodzi */toggleBoat();return}
  if(e.code==='KeyB'){toggleBoat();return}
  if(e.code==='KeyT'){if(VH.mode===0)tryTame();return}
  if(e.code==='KeyR'){toggleMount();return}
  if(e.code==='KeyU'){if(!e.repeat)fishKey();return}
  if(e.code==='Backslash'||e.code==='IntlBackslash'){if(custOpen())closeCustom();else openCustom();return}
  if(e.code==='KeyC'&&INV.eq.tarcza&&VH.mode===0&&!player.swim){useAbility('e');return}
  if(e.code==='KeyG'){toggleOwnMount('kon');return}
  if(e.code==='KeyV'){toggleOwnMount('gryf');return}
  keys.add(e.code); if(e.code==='Space')e.preventDefault();
});
addEventListener('keyup',e=>{keys.delete(e.code);if(e.code.startsWith('Alt'))e.preventDefault()});
addEventListener('blur',()=>{keys.clear();P2.mouse=false});
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()});

// ---------- mapa / minimapa ----------
const mm=$('mini'), mx=mm.getContext('2d'), big=$('bigmap'), bx=big.getContext('2d');
// mapa: środek (cx,cz) w blokach, scale = piksele na blok; big = pełna mapa z opisami
const mapV={x:0,z:0,follow:true,drag:null};let mapScale=1.2;
// ===== mapa 3D w aksonometrii (bez postaci; miasta, osady i miejsca jako bryły) =====
const MAP3D={on:false,dirty:true};
function map3dInit(){if(MAP3D.r)return true;if(MAP3D.fail)return false;try{const cv=document.createElement('canvas');cv.id='map3d';const wrap=$('mapwrap');wrap.insertBefore(cv,big);
  const r=new THREE.WebGLRenderer({canvas:cv,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  const sc=new THREE.Scene();sc.background=new THREE.Color(0x15110c);sc.add(new THREE.HemisphereLight(0xe8eeff,0x3a2a1a,0.72));const dl=new THREE.DirectionalLight(0xfff0d8,0.9);dl.position.set(-0.5,1,0.3);sc.add(dl);
  const cam=new THREE.OrthographicCamera(-1,1,1,-1,-5000,5000);const ms=new THREE.Scene();ms.add(new THREE.HemisphereLight(0xe8eeff,0x3a2a1a,0.72));const dl2=new THREE.DirectionalLight(0xfff0d8,0.9);dl2.position.set(-0.5,1,0.3);ms.add(dl2);Object.assign(MAP3D,{r,scene:sc,cam,cv,miniScene:ms,mini:{},miniCam:new THREE.OrthographicCamera(-1,1,1,-1,-5000,5000)});return true}catch(e){console.warn('map3d',e);MAP3D.fail=1;return false}}
function mapHeightAt(x,z){const cx=Math.floor(x/C),cz=Math.floor(z/C),H=MAPH.get(K(cx,cz));if(!H)return null;const i=Math.min(15,Math.max(0,Math.floor((x-cx*C)/2))),j=Math.min(15,Math.max(0,Math.floor((z-cz*C)/2)));return H[j*16+i]}
let MAPMAT=null,MAPTM=null;const MAPSTR=new Map();
const MTREE={0:['#3f7a35',0],1:['#2f5a2e',1],2:['#5a9a4a',0],3:['#4a8a3a',2],8:['#dfe8ee',1],14:['#7a8a3a',3],15:['#6a7a3a',0],16:['#c8642a',0],17:['#f0a8c0',0]};
function mapMat(){return MAPMAT||(MAPMAT=new THREE.MeshLambertMaterial({vertexColors:true}))}
function mapCaptureStruct(s){if(!s||!s.g||MAPSTR.has(s.id))return;try{const g=new THREE.Group();s.g.updateWorldMatrix(true,true);s.g.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.attributes&&o.geometry.attributes.color&&(o.material===matB||o.material===decoMat)){const m=new THREE.Mesh(o.geometry,mapMat());m.matrixAutoUpdate=false;m.matrix.copy(o.matrixWorld);m.userData.keep=1;g.add(m)}});if(g.children.length)MAPSTR.set(s.id,g)}catch(e){}}
function map3dBuild(W,H,mini){const M0=MAP3D,M=mini?M0.mini:M0,sc=mini?M0.miniScene:M0.scene;if(M.grp){sc.remove(M.grp);M.grp.traverse(o=>{if(o.userData.keep)return;if(o.userData.keepMat)return;if(o.geometry)o.geometry.dispose();if(o.material&&o.material!==MAPMAT&&o.material!==MAPTM)o.material.dispose()})}
  const g=new THREE.Group();M.grp=g;sc.add(g);const cx=mini?player.p.x:mapV.x,cz=mini?player.p.z:mapV.z,R=mini?MINIR*1.6:Math.min(1500,Math.max(140,Math.hypot(W,H)/2/mapScale*1.35)),st=R<300?2:R<750?4:8;Object.assign(M,{bx:cx,bz:cz,bs:mapScale,bR:R,dirty:false,bt:performance.now()});
  const c0x=Math.floor((cx-R)/C),c1x=Math.floor((cx+R)/C),c0z=Math.floor((cz-R)/C),c1z=Math.floor((cz+R)/C),cells=[],BASE=WATER-12,trees=[],stp=st/2;
  // wysokość słupka mapy pod punktem (mapa jest zgrubna: obiekty stawiamy na tym, co widać, a nie na prawdziwym terenie)
  const dispH=(x,z)=>{const kx=Math.floor(x/C),kz=Math.floor(z/C),Hh=MAPH.get(K(kx,kz));if(!Hh)return null;const i=Math.min(15,Math.max(0,Math.floor((x-kx*C)/2))),j=Math.min(15,Math.max(0,Math.floor((z-kz*C)/2)));return Math.max(Math.round(Hh[Math.floor(j/stp)*stp*16+Math.floor(i/stp)*stp]),BASE+0.5)};
  for(let z=c0z;z<=c1z;z++)for(let x=c0x;x<=c1x;x++){const k=K(x,z),Hh=MAPH.get(k),T=thumbs.get(k);if(!Hh||!T)continue;const d=T._d,ts=T.width;
    for(let j=0;j<16;j+=stp)for(let i=0;i<16;i+=stp){const wx=x*C+i*2,wz=z*C+j*2;if(Math.hypot(wx-cx,wz-cz)>R)continue;const px=Math.min(ts-1,Math.floor((i*2+1)/C*ts)),pz=Math.min(ts-1,Math.floor((j*2+1)/C*ts)),o=(pz*ts+px)*4;cells.push(wx,wz,Hh[j*16+i],d?d[o]:120,d?d[o+1]:140,d?d[o+2]:90)}
    {const Tt=MAPT.get(k),sub=R<700?1:R<1000?2:R<1300?3:4;if(Tt)for(let i=((x*7+z*13)%sub+sub)%sub*5;i<Tt.length;i+=5*sub)if(Math.hypot(Tt[i]-cx,Tt[i+2]-cz)<R)trees.push(Tt[i],dispH(Tt[i],Tt[i+2])??Tt[i+1],Tt[i+2],Tt[i+3]*(sub>1?1+0.12*(sub-1):1),Tt[i+4])}}
  const n=cells.length/6;if(n){if(!MAPTM){MAPTM=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(MAPTM,true);const ob=MAPTM.onBeforeCompile;MAPTM.onBeforeCompile=sh=>{ob(sh);sh.fragmentShader=sh.fragmentShader.replace('float fade=1.-smoothstep(40.,120.,length(uCam-vWp));','float fade=.9;')};MAPTM.customProgramCacheKey=()=>'mapT'}const geo=new THREE.BoxGeometry(1,1,1);geo.translate(0.5,0.5,0.5);{const cc=new Float32Array(geo.attributes.position.count*3).fill(1);geo.setAttribute('color',new THREE.Float32BufferAttribute(cc,3))}
    const im=new THREE.InstancedMesh(geo,MAPTM,n),m4=new THREE.Matrix4(),col=new THREE.Color();
    for(let i=0;i<n;i++){const o=i*6,hh=Math.round(cells[o+2]),top=Math.max(hh,BASE+0.5);m4.makeScale(st,top-BASE,st);m4.setPosition(cells[o],BASE,cells[o+1]);im.setMatrixAt(i,m4);col.setRGB(cells[o+3]/255,cells[o+4]/255,cells[o+5]/255);im.setColorAt(i,col)}
    im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.frustumCulled=false;g.add(im)}
  const wp=new THREE.Mesh(new THREE.PlaneGeometry(R*2.2,R*2.2),new THREE.MeshLambertMaterial({color:0x3f7db5,transparent:true,opacity:0.74,depthWrite:false}));wp.rotation.x=-Math.PI/2;wp.position.set(cx,WATER-0.3,cz);g.add(wp);
  // drzewa
  if(trees.length){const by={},nt=trees.length/5,far=R>=700,thin=Math.max(1,Math.ceil(nt/40000));for(let i=0;i<nt;i+=thin){const o=i*5;let k=TK[trees[o+4]];if(!k||!OBJGEO[k])continue;if(far&&OBJGEO[k+'_l'])k=k+'_l';(by[k]=by[k]||[]).push(i)}const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),ax=new THREE.Vector3(0,1,0),pv=new THREE.Vector3(),sv=new THREE.Vector3();
    for(const k in by){const L=by[k],im=new THREE.InstancedMesh(OBJGEO[k],imMat(k),L.length);L.forEach((i,j)=>{const o=i*5,sc=trees[o+3]*(SCL[k]||SCL[k.replace('_l','')]||TS);q.setFromAxisAngle(ax,((trees[o]*7.13+trees[o+2]*3.7)%4|0)*Math.PI/2);m4.compose(pv.set(trees[o],trees[o+1],trees[o+2]),q,sv.set(sc,sc,sc));im.setMatrixAt(j,m4)});im.instanceMatrix.needsUpdate=true;im.frustumCulled=false;im.userData.keepMat=1;g.add(im)}}
  // drogi
  {const segs=[];for(const r of roads)for(const P of roadSeenSegs(r)){for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2;if(Math.hypot(mx-cx,mz-cz)>R)continue;segs.push(a,b)}}
    if(segs.length){const geo=new THREE.BoxGeometry(1,1,1);const im=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({color:0xc8a870}),segs.length/2),m4=new THREE.Matrix4(),q4=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),sv=new THREE.Vector3();
      for(let i=0;i<segs.length;i+=2){const a=segs[i],b=segs[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1])+1.5,mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2,y=Math.max(WATER,dispH(mx,mz)??WATER)+0.3;e.set(0,Math.atan2(b[0]-a[0],b[1]-a[1]),0);q4.setFromEuler(e);m4.compose(v.set(mx,y,mz),q4,sv.set(2.6,0.5,L));im.setMatrixAt(i/2,m4)}
      im.instanceMatrix.needsUpdate=true;g.add(im)}}
  // osady i miasta: prawdziwe modele domów, murów i dekoracji
  const mm=mapMat(),B=[],add=(x,y,z,w,h,d,c)=>B.push(x,y,z,w,h,d,c);let budget=mini?3:14;
  const put=(geo,x,y,z,ry)=>{const o=new THREE.Group();o.position.set(x,y,z);o.rotation.y=ry||0;const inner=new THREE.Group();inner.scale.setScalar(BS);const me=new THREE.Mesh(geo,mm);me.userData.keep=1;inner.add(me);o.add(inner);g.add(o)};
  for(const v of villages.values()){if(!v||!villSeen(v)||v.wander)continue;if(Math.hypot(v.x-cx,v.z-cz)>R+(v.Hs||40))continue;const vy=v.h??mapHeightAt(v.x,v.z)??WATER;
    try{if(v.city){if(!v._mapWall)v._mapWall=raceWall(cityWallGeo(v),v.race);put(v._mapWall,v.x,v.h,v.z,0)}if(v._mapDeco===undefined||v._dgMissM){v._mapDeco=decorGeo(v,true)||null;/* v144: mapa trzyma ozdoby najwyżej 8 miast (najdawniej użyte są zwalniane) */MAPDECO.push(v);while(MAPDECO.length>8){const o=MAPDECO.shift();if(o&&o!==v&&o._mapDeco){try{o._mapDeco.dispose()}catch(_){}o._mapDeco=undefined}}}if(v._mapDeco)put(v._mapDeco,v.x,v.h,v.z,0)}catch(e){}
    for(const h of v.houses){if(h.kcastle){const o=new THREE.Group();o.position.set(h.x,h.top-1.0*h.ksc,h.z);o.rotation.y=h.rot;o.scale.setScalar(h.ksc);const me=new THREE.Mesh(kcastleGeo(v.race,v.sty),mm);me.userData.keep=1;o.add(me);g.add(o);continue}if(h.arena){const o=new THREE.Group();o.position.set(h.x,h.top,h.z);o.rotation.y=h.rot;const me=new THREE.Mesh(arenaExtGeo(v.race,v.sty),mm);me.userData.keep=1;o.add(me);g.add(o);continue}if(h.big){const o=new THREE.Group();o.position.set(h.x,h.top,h.z);o.rotation.y=h.rot;const me=new THREE.Mesh(lmExtGeo(h.func,v.race,v.sty),mm);me.userData.keep=1;o.add(me);g.add(o);continue}const key=h.type+'|'+h.v+'|'+v.race;let Mh=houseCache.get(key);if(!Mh&&budget>0&&R<900){budget--;try{Mh=houseModel(h.type,h.v,v.race,h.sty!==undefined?h.sty:v.sty)}catch(e){}}
      if(Mh&&Mh.geo)put(Mh.geo,h.x,h.top,h.z,h.rot);else{const w=Math.max(5,(h.core?h.core.pw:8)*0.9),y0=h.top??vy,tall=h.castle?20:v.city?10:5.5,rh=Math.max(2,w*0.32);add(h.x,y0,h.z,w,tall,w,h.castle?0x8a8490:0xd8c49a);add(h.x,y0+tall,h.z,w*0.9,rh,w*0.9,h.castle?0x5a5a68:0xa8452c);M.dirty=true}}}
  if(budget<=0)M.dirty=true;
  for(const s of structs.values()){if(!strSeen(s)||s.friendly)continue;if(Math.hypot(s.x-cx,s.z-cz)>R+30)continue;const cap=MAPSTR.get(s.id);
    if(cap){for(const ch of cap.children){const me=new THREE.Mesh(ch.geometry,mm);me.matrixAutoUpdate=false;me.matrix.copy(ch.matrix);me.userData.keep=1;g.add(me)}continue}
    if(s.type==='zamczysko'||s.type==='grota'){try{if(!s._mapGeo)s._mapGeo=s.type==='zamczysko'?castleGeo(s):grotaGeo(s,rngOf('st'+s.id));put(s._mapGeo,s.x,s.h,s.z,0);continue}catch(e){}}
    const y=s.h??mapHeightAt(s.x,s.z)??WATER,c=new THREE.Color(STRC[s.type]||'#c84a2a').getHex();add(s.x,y,s.z,7,6,7,0x6a6670);add(s.x,y+6,s.z,5,3,5,0x7d7884);add(s.x,y+9,s.z,3,3,3,c)}
  if(B.length){const n2=B.length/7,geo=new THREE.BoxGeometry(1,1,1);geo.translate(0,0.5,0);const im=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial(),n2),m4=new THREE.Matrix4(),col=new THREE.Color();for(let i=0;i<n2;i++){const o=i*7;m4.makeScale(B[o+3],B[o+4],B[o+5]);m4.setPosition(B[o],B[o+1],B[o+2]);im.setMatrixAt(i,m4);col.setHex(B[o+6]);im.setColorAt(i,col)}im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;g.add(im)}
  M.border=null;if(!mini&&S.gen===2){const bl=[],stp=Math.max(8,R/70);for(let z=cz-R;z<cz+R;z+=stp)for(let x=cx-R;x<cx+R;x+=stp){const a=kingdomAtM(x,z),b=kingdomAtM(x+stp,z),c=kingdomAtM(x,z+stp);if(a&&((b&&b.id!==a.id)||(c&&c.id!==a.id)))bl.push([x,(mapHeightAt(x,z)??WATER)+2,z])}M.border=bl}}

function map3dRender(){const M=MAP3D,cv=M.cv,W=cv.clientWidth,H=cv.clientHeight;if(!W||!H)return;const pr=M.r.getPixelRatio();if(cv.width!==Math.round(W*pr)||cv.height!==Math.round(H*pr))M.r.setSize(W,H,false);
  if(M.dirty||!M.grp||Math.hypot(mapV.x-M.bx,mapV.z-M.bz)>M.bR*0.3||mapScale/M.bs>1.45||M.bs/mapScale>1.45){if(performance.now()-(M.lb||0)>250){M.lb=performance.now();map3dBuild(W,H)}}
  const cam=M.cam,hw=W/2/mapScale,hh=H/2/mapScale;cam.left=-hw;cam.right=hw;cam.top=hh;cam.bottom=-hh;cam.updateProjectionMatrix();const ty=WATER+4;cam.position.set(mapV.x+700,ty+780,mapV.z+700);cam.lookAt(mapV.x,ty,mapV.z);cam.updateMatrixWorld();M.r.render(M.scene,cam)}
const MINIR=72;
// kierunek patrzenia kamery (w konwencji player.ry) i wyraźna strzałka gracza ze stożkiem widzenia
function camViewYaw(){return (typeof custOpen==='function'&&custOpen())?player.ry:yaw+Math.PI}
function playerArrow(c,col,k){c.save();c.scale(k,k);const g=c.createRadialGradient(0,0,2,0,0,34);g.addColorStop(0,'rgba(255,240,190,.42)');g.addColorStop(1,'rgba(255,240,190,0)');c.fillStyle=g;c.beginPath();c.moveTo(0,0);c.arc(0,0,34,-Math.PI/2-0.55,-Math.PI/2+0.55);c.closePath();c.fill();
  c.shadowColor='rgba(0,0,0,.75)';c.shadowBlur=4;c.shadowOffsetY=1.5;c.fillStyle='#14100a';c.beginPath();c.moveTo(0,-13);c.lineTo(9.5,10);c.lineTo(0,5);c.lineTo(-9.5,10);c.closePath();c.fill();c.shadowColor='transparent';
  c.fillStyle=col;c.strokeStyle='#fff';c.lineWidth=2;c.lineJoin='round';c.beginPath();c.moveTo(0,-11);c.lineTo(7.5,8);c.lineTo(0,4);c.lineTo(-7.5,8);c.closePath();c.fill();c.stroke();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.moveTo(0,-9);c.lineTo(0,3.5);c.lineTo(-6,7);c.closePath();c.fill();c.restore()}
function meHalo(ctx,big){/* v125: wyraźny znacznik gracza — pulsujący złoty pierścień, stożek widzenia i napis TY */const t=performance.now()/1000,k=(t*0.9)%1,R=(big?16:11)+k*(big?22:14);ctx.save();ctx.strokeStyle='rgba(255,226,120,'+(0.85*(1-k)).toFixed(3)+')';ctx.lineWidth=big?3:2.2;ctx.beginPath();ctx.arc(0,0,R,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.45)';ctx.beginPath();ctx.arc(0,0,big?13:9.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffe27a';ctx.lineWidth=big?2.5:2;ctx.beginPath();ctx.arc(0,0,big?13:9.5,0,Math.PI*2);ctx.stroke();ctx.restore()}
function meCone(ctx,big){const L=big?60:36,g=ctx.createRadialGradient(0,0,2,0,0,L);g.addColorStop(0,'rgba(255,240,170,.45)');g.addColorStop(1,'rgba(255,240,170,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,L,-Math.PI/2-0.55,-Math.PI/2+0.55);ctx.closePath();ctx.fill()}
function meLabel(ctx,x,y,big){ctx.save();ctx.font='bold '+(big?14:11)+'px system-ui,sans-serif';ctx.textAlign='center';ctx.lineWidth=3.5;ctx.strokeStyle='rgba(0,0,0,.85)';const ty=y+(big?32:24);ctx.strokeText('TY',x,ty);ctx.fillStyle='#ffe27a';ctx.fillText('TY',x,ty);ctx.restore()}
function miniDraw(){const W=mm.width,H=mm.height;if(!$('mapwrap').hidden||MAP3D.fail||!map3dInit()){if($('mapwrap').hidden||MAP3D.fail)drawMap(mx,W,H,1.6);return}
  try{const M=MAP3D,mi=M.mini;if(!mi.grp||Math.hypot(player.p.x-mi.bx,player.p.z-mi.bz)>MINIR*0.35||performance.now()-mi.bt>6000)map3dBuild(W,H,true);
    const pr=M.r.getPixelRatio();if(M.cv.width!==Math.round(W*pr)||M.cv.height!==Math.round(H*pr))M.r.setSize(W,H,false);
    const sc=W/2/MINIR,cam=M.miniCam,hw=W/2/sc,hh=H/2/sc;cam.left=-hw;cam.right=hw;cam.top=hh;cam.bottom=-hh;cam.updateProjectionMatrix();const ty=player.p.y;cam.position.set(player.p.x+700,ty+780,player.p.z+700);cam.lookAt(player.p.x,ty,player.p.z);cam.updateMatrixWorld();
    M.miniScene.background=new THREE.Color(0x15110c);M.r.render(M.miniScene,cam);
    mx.save();mx.clearRect(0,0,W,H);mx.beginPath();mx.rect(0,0,W,H);mx.clip();mx.drawImage(M.cv,0,0,W,H);/* v124: kwadratowa minimapa w stylu dużej mapy (M): nazwy miejsc, kompas, wyraźni sojusznicy */
    const clampR=(a,m)=>{const dx=a[0]-W/2,dy=a[1]-H/2,k=Math.max(Math.abs(dx)/(W/2-m),Math.abs(dy)/(H/2-m),1);return[W/2+dx/k,H/2+dy/k,k>1]};
    {const lab=(t,x,y,sz,col)=>{mx.font=`600 ${sz}px "Pixelify Sans",monospace`;mx.textAlign='center';mx.textBaseline='middle';mx.lineWidth=3;mx.strokeStyle='rgba(16,11,6,.9)';mx.strokeText(t,x,y);mx.fillStyle=col;mx.fillText(t,x,y)};for(const v of villages.values()){if(!v||v.wander||!villSeen(v))continue;const a=P(v.x,(v.h??WATER)+(v.city?14:6),v.z);if(a[0]<10||a[0]>W-10||a[1]<10||a[1]>H-10)continue;lab(v.name||(v.city?'Miasto':'Osada'),a[0],a[1],v.city?11:9,v.city?'#ffe7a8':'#f3efe6')}}
    const P=(x,y,z)=>{const v=new THREE.Vector3(x,y,z).project(cam);return[(v.x+1)/2*W,(1-v.y)/2*H]};
    for(const [qx,qz,col] of questMarks()){let a=clampR(P(qx,player.p.y,qz),8);mx.fillStyle=col;mx.strokeStyle='#1d1a14';mx.lineWidth=2;mx.beginPath();mx.arc(a[0],a[1],5,0,6.283);mx.fill();mx.stroke()}
    for(const mk of MARKS.values()){let a=P(mk.x,(mapHeightAt(mk.x,mk.z)??player.p.y),mk.z);const cr=clampR(a,12),edge=cr[2];a=cr;mx.fillStyle=mk.col;mx.strokeStyle='#1d1a14';mx.lineWidth=2;mx.beginPath();mx.moveTo(a[0],a[1]);mx.lineTo(a[0]-5,a[1]-9);mx.arc(a[0],a[1]-11,5.5,Math.PI*0.8,Math.PI*0.2,false);mx.lineTo(a[0],a[1]);mx.closePath();mx.fill();mx.stroke();mx.fillStyle='#fff';mx.beginPath();mx.arc(a[0],a[1]-11,2,0,6.283);mx.fill()}
    for(const e of enemies.values()){if(e.st===2)continue;const a=P(e.p.x,e.p.y,e.p.z);if(a[0]<2||a[0]>W-2||a[1]<2||a[1]>H-2)continue;mx.fillStyle=EDEF[e.t].ally?'#7dd87d':e.pas?'#7dc8ff':EDEF[e.t].boss?'#b874ff':'#ff6b5b';mx.beginPath();mx.arc(a[0],a[1],EDEF[e.t].boss?4:2.2,0,6.283);mx.fill()}
    for(const r of remotes.values()){const a=clampR(P(r.g.position.x,r.g.position.y,r.g.position.z),9);const t=performance.now()/1000;mx.strokeStyle='rgba(255,255,255,'+(0.5+0.5*Math.sin(t*5))+')';mx.lineWidth=2;mx.beginPath();mx.arc(a[0],a[1],8+2*Math.sin(t*5),0,6.283);mx.stroke();mx.fillStyle=r.color;mx.strokeStyle='#fff';mx.lineWidth=2;mx.beginPath();mx.arc(a[0],a[1],5.5,0,6.283);mx.fill();mx.stroke();mx.font='700 10px "Pixelify Sans",monospace';mx.textAlign='center';mx.lineWidth=3;mx.strokeStyle='rgba(16,11,6,.95)';const ny=a[1]>18?a[1]-11:a[1]+15;mx.strokeText(r.name||'',a[0],ny);mx.fillStyle='#fff';mx.fillText(r.name||'',a[0],ny)}
    {/* strzałka gracza wskazuje kierunek kamery, ze stożkiem widzenia */const vy=camViewYaw(),a=P(player.p.x,player.p.y,player.p.z),b=P(player.p.x+Math.sin(vy)*10,player.p.y,player.p.z+Math.cos(vy)*10),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);mx.translate(a[0],a[1]);mx.rotate(ang+Math.PI/2);playerArrow(mx,S.color,1.25);mx.setTransform(1,0,0,1,0,0)}
    mx.restore();
    {const a=P(player.p.x,player.p.y,player.p.z),b=P(player.p.x,player.p.y,player.p.z-50),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),rx=W-20,ry=20;mx.save();mx.translate(rx,ry);mx.fillStyle='rgba(16,11,6,.75)';mx.beginPath();mx.arc(0,0,15,0,6.283);mx.fill();mx.strokeStyle='#c9a24a';mx.lineWidth=1.5;mx.stroke();mx.rotate(ang+Math.PI/2);mx.fillStyle='#e5483b';mx.beginPath();mx.moveTo(0,-11);mx.lineTo(4,0);mx.lineTo(-4,0);mx.closePath();mx.fill();mx.fillStyle='#e8dcc0';mx.beginPath();mx.moveTo(0,11);mx.lineTo(4,0);mx.lineTo(-4,0);mx.closePath();mx.fill();mx.rotate(-ang-Math.PI/2);mx.font='700 9px "Pixelify Sans",monospace';mx.textAlign='center';mx.textBaseline='middle';const nx=Math.cos(ang)*-0,ny=0;mx.restore();{const dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1;mx.font='700 10px "Pixelify Sans",monospace';mx.textAlign='center';mx.textBaseline='middle';mx.lineWidth=3;mx.strokeStyle='rgba(16,11,6,.95)';mx.strokeText('N',rx+dx/l*22,ry+dy/l*22);mx.fillStyle='#ffd34d';mx.fillText('N',rx+dx/l*22,ry+dy/l*22);mx.textBaseline='alphabetic'}}
  }catch(err){console.warn('minimapa',err);drawMap(mx,W,H,1.6)}}
function mapProj(x,y,z,W,H){const v=new THREE.Vector3(x,y,z).project(MAP3D.cam);return[(v.x+1)/2*W,(1-v.y)/2*H]}
function mapPick(e){const r=big.getBoundingClientRect();if(!MAP3D.on)return[mapV.x+(e.clientX-r.left-big.width/2)/mapScale,mapV.z+(e.clientY-r.top-big.height/2)/mapScale];
  const nx=(e.clientX-r.left)/r.width*2-1,ny=-((e.clientY-r.top)/r.height*2-1),cam=MAP3D.cam,p=new THREE.Vector3(nx,ny,-1).unproject(cam),d=new THREE.Vector3(0,0,-1).transformDirection(cam.matrixWorld),y0=WATER+4,t=(y0-p.y)/d.y;return[p.x+d.x*t,p.z+d.z*t]}
function drawMap3DOverlay(ctx,W,H){ctx.clearRect(0,0,W,H);const P=(x,y,z)=>mapProj(x,y,z,W,H),vis=(a,m)=>a[0]>-m&&a[1]>-m&&a[0]<W+m&&a[1]<H+m;
  const lab=(t,x,y,sz,col)=>{ctx.font=`600 ${sz+2}px "Pixelify Sans",monospace`;ctx.textAlign='center';ctx.lineWidth=4;ctx.lineJoin='miter';ctx.strokeStyle='rgba(16,11,6,.95)';ctx.strokeText(t,x,y);ctx.fillStyle=col||'#f3e6c4';ctx.fillText(t,x,y)};
  for(const v of villages.values()){if(!v||!villSeen(v)||v.wander)continue;const vy=(v.h??mapHeightAt(v.x,v.z)??WATER)+(v.city?24:10),a=P(v.x,vy,v.z);if(!vis(a,80))continue;lab(v.name||(v.city?'Miasto':'Osada'),a[0],a[1],v.city?Math.round(15+Math.min(6,mapScale*2)):12,v.city?'#ffe7a8':'#f3efe6')}
  if(S.gen===2){for(const k of KING.values()){const [x,z]=[k.x,k.z],a=P(x,(mapHeightAt(x,z)??WATER)+30,z);if(!vis(a,200))continue;lab(kName(k),a[0],a[1],Math.round(18+Math.min(10,mapScale*6)),KCOL[k.race])}
    if(MAP3D.border){ctx.fillStyle='rgba(255,230,160,.55)';for(const b of MAP3D.border){const a=P(b[0],b[1],b[2]);if(vis(a,2))ctx.fillRect(a[0]-1.5,a[1]-1.5,3,3)}}}
  if(mapScale>0.9)for(const v of villages.values()){if(!v||!v.districts||!villSeen(v))continue;for(const d of v.districts){const a=P(d.x,(v.h||WATER)+14,d.z);if(!vis(a,40))continue;lab(d.n,a[0],a[1],10,'#cfe0ff')}}
  for(const s of structs.values()){if(!strSeen(s)||s.friendly)continue;const y=(s.h??mapHeightAt(s.x,s.z)??WATER)+13,a=P(s.x,y,s.z);if(!vis(a,60))continue;const cl=strState.get(s.key||'')&&strState.get(s.key||'').cleared;if(mapScale>0.45)lab(s.name+(cl?' ✓':''),a[0],a[1],11,'#e8dcc0')}
  const pin=(x,z,col,txt)=>{const y=(mapHeightAt(x,z)??WATER)+1,a=P(x,y,z);const sx=Math.max(10,Math.min(W-10,a[0])),sy=Math.max(22,Math.min(H-6,a[1]));ctx.fillStyle=col;ctx.strokeStyle='#1d1a14';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-6,sy-11);ctx.arc(sx,sy-14,6.5,Math.PI*0.8,Math.PI*0.2,false);ctx.closePath();ctx.fill();ctx.stroke();if(txt)lab(txt,sx,sy-24,11,'#fff')};
  for(const [qx,qz,col] of questMarks())pin(qx,qz,col);
  for(const mk of MARKS.values())pin(mk.x,mk.z,mk.col,mk.n);
  for(const nt of wNotes()){const y=(mapHeightAt(nt.x,nt.z)??WATER)+1,a=P(nt.x,y,nt.z);if(!vis(a,30))continue;noteDraw(ctx,a[0],a[1],nt,lab)}
  for(const r of remotes.values()){const y=(mapHeightAt(r.g.position.x,r.g.position.z)??WATER)+1,a=P(r.g.position.x,y,r.g.position.z),sx=Math.max(16,Math.min(W-16,a[0])),sy=Math.max(30,Math.min(H-12,a[1])),t=performance.now()/1000;ctx.strokeStyle='rgba(255,255,255,'+(0.45+0.45*Math.sin(t*4))+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(sx,sy,14+4*Math.sin(t*4),0,6.283);ctx.stroke();ctx.fillStyle=r.color;ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(sx,sy,8,0,6.283);ctx.fill();ctx.stroke();lab('★ '+(r.name||'Sojusznik'),sx,sy-20,14,'#ffffff')}
  {const y=(mapHeightAt(player.p.x,player.p.z)??player.p.y),a=P(player.p.x,y,player.p.z),b=P(player.p.x+Math.sin(player.ry)*12,y,player.p.z+Math.cos(player.ry)*12),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);ctx.save();ctx.translate(a[0],a[1]);meHalo(ctx,true);ctx.rotate(ang+Math.PI/2);meCone(ctx,true);ctx.fillStyle=S.color;ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,-15);ctx.lineTo(11,12);ctx.lineTo(0,6);ctx.lineTo(-11,12);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();meLabel(ctx,a[0],a[1],true)}
  {const a=P(mapV.x,WATER,mapV.z),b=P(mapV.x,WATER,mapV.z-50),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),rx=W-60,ry=72;ctx.save();ctx.translate(rx,ry);ctx.fillStyle='rgba(16,11,6,.7)';ctx.beginPath();ctx.arc(0,0,34,0,6.283);ctx.fill();ctx.strokeStyle='#c9a24a';ctx.lineWidth=2;ctx.stroke();ctx.rotate(ang+Math.PI/2);ctx.fillStyle='#e5483b';ctx.beginPath();ctx.moveTo(0,-27);ctx.lineTo(6,0);ctx.lineTo(-6,0);ctx.closePath();ctx.fill();ctx.fillStyle='#e8dcc0';ctx.beginPath();ctx.moveTo(0,27);ctx.lineTo(6,0);ctx.lineTo(-6,0);ctx.closePath();ctx.fill();ctx.rotate(-(ang+Math.PI/2));const nx=Math.cos(ang)*44,ny=Math.sin(ang)*44;ctx.restore();lab('N',rx+nx,ry+ny+5,14,'#ffd34d')}
  ctx.font='600 13px "Alegreya Sans",sans-serif';ctx.textAlign='right';ctx.fillStyle='#e8dcc0';ctx.fillText(`X ${Math.round(mapV.x)}  Z ${Math.round(mapV.z)}  ·  ×${mapScale.toFixed(2)}`,W-16,H-14)}

function drawMap(ctx,W,H,scale,cx,cz,big){
  cx=cx??player.p.x;cz=cz??player.p.z;const px=player.p.x,pz=player.p.z,cs=C*scale,SX=x=>W/2+(x-cx)*scale,SZ=z=>H/2+(z-cz)*scale;
  ctx.save();ctx.fillStyle='#14110c';ctx.fillRect(0,0,W,H);
  ctx.imageSmoothingEnabled=scale<1.5;
  const c0x=Math.floor((cx-W/2/scale)/C)-1,c1x=Math.floor((cx+W/2/scale)/C)+1,c0z=Math.floor((cz-H/2/scale)/C)-1,c1z=Math.floor((cz+H/2/scale)/C)+1;
  for(let z=c0z;z<=c1z;z++)for(let x=c0x;x<=c1x;x++){const t=thumbs.get(K(x,z));if(t)ctx.drawImage(t,Math.floor(SX(x*C)),Math.floor(SZ(z*C)),Math.ceil(cs)+1,Math.ceil(cs)+1)}
  // siatka współrzędnych
  if(big){const step=scale>2?128:scale>0.6?256:512;ctx.strokeStyle='rgba(255,240,210,.08)';ctx.lineWidth=1;ctx.beginPath();
    for(let x=Math.floor((cx-W/2/scale)/step)*step;x<cx+W/2/scale;x+=step){ctx.moveTo(SX(x)+.5,0);ctx.lineTo(SX(x)+.5,H)}
    for(let z=Math.floor((cz-H/2/scale)/step)*step;z<cz+H/2/scale;z+=step){ctx.moveTo(0,SZ(z)+.5);ctx.lineTo(W,SZ(z)+.5)}ctx.stroke()}
  // drogi
  ctx.lineCap='round';ctx.lineJoin='round';
  for(const [lw,col] of [[Math.max(2.5,scale*3.4),'rgba(60,40,20,.55)'],[Math.max(1.4,scale*2.2),'rgba(214,180,120,.95)']]){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();for(const r of roads)for(const sg of roadSeenSegs(r)){sg.forEach((p,i)=>{i?ctx.lineTo(SX(p[0]),SZ(p[1])):ctx.moveTo(SX(p[0]),SZ(p[1]))})}ctx.stroke()}
  const lab=(t,x,y,sz,col)=>{ctx.font=`700 ${sz}px Cinzel,"Alegreya Sans",serif`;ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='rgba(20,14,8,.85)';ctx.strokeText(t,x,y);ctx.fillStyle=col||'#f3e6c4';ctx.fillText(t,x,y)};
  const vis=(x,y,mg)=>x>-mg&&y>-mg&&x<W+mg&&y<H+mg;
  // miasta: mury, wieże
  for(const v of villages.values()){if(!v||!v.city||!villSeen(v))continue;const sx=SX(v.x),sz=SZ(v.z),s=v.Hs*scale;if(!vis(sx,sz,s+60))continue;
    {/* obrys murów, ulice planu i domy pod swoim kątem */const pl=cityPlan(v);ctx.beginPath();pl.V.forEach((q,i)=>{const X=SX(v.x+q[0]),Y=SZ(v.z+q[1]);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)});ctx.closePath();ctx.fillStyle='rgba(196,170,130,.55)';ctx.fill();ctx.strokeStyle='#5d5a63';ctx.lineWidth=Math.max(2,scale*2.4);ctx.stroke();
      if(scale>0.5){ctx.strokeStyle='rgba(150,136,112,.95)';ctx.lineCap='round';ctx.lineJoin='round';for(const q of pl.ST){if(q.k>=4)continue;ctx.lineWidth=Math.max(1,q.w*scale*0.9);ctx.beginPath();q.p.forEach((pt,i)=>{const X=SX(v.x+pt[0]),Y=SZ(v.z+pt[1]);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)});ctx.stroke()}ctx.fillStyle='rgba(150,136,112,.95)';ctx.beginPath();ctx.arc(SX(v.x+pl.M[0]),SZ(v.z+pl.M[1]),pl.PR*scale,0,6.283);ctx.fill()}
      const tw=Math.max(3,scale*5);ctx.fillStyle='#8e8994';for(const t of (v.towers||[])){ctx.fillRect(SX(t[0])-tw/2,SZ(t[1])-tw/2,tw,tw)}}
    if(scale>1.2)for(const h of v.houses){ctx.fillStyle=h.castle?'#7a7480':'#a8452c';const hw=(h.core?h.core.pw:8)*scale/2,hd=(h.core?h.core.pd:8)*scale/2;ctx.save();ctx.translate(SX(h.x),SZ(h.z));ctx.rotate(-h.rot);ctx.fillRect(-hw,-hd,hw*2,hd*2);ctx.restore()}
    if(big||W>150)lab(v.name||'Miasto',sx,sz-s-8,big?Math.round(15+Math.min(6,scale*2)):11)}
  for(const v of villages.values()){if(!v||v.city||!villSeen(v))continue;const sx=SX(v.x),sz=SZ(v.z);if(!vis(sx,sz,60))continue;
    if(scale>1.5)for(const h of v.houses){ctx.fillStyle='#b8573a';const hw=4.2*scale;ctx.fillRect(SX(h.x)-hw,SZ(h.z)-hw,hw*2,hw*2)}
    else{ctx.fillStyle='#b8573a';ctx.strokeStyle='#1d1a14';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(sx-6,sz+5);ctx.lineTo(sx-6,sz-1);ctx.lineTo(sx,sz-7);ctx.lineTo(sx+6,sz-1);ctx.lineTo(sx+6,sz+5);ctx.closePath();ctx.fill();ctx.stroke()}
    if(big||W>150)lab(v.name||'Osada',sx,sz-12,big?13:10,'#f3efe6')}
  for(const s of structs.values()){if(!strSeen(s)||s.friendly)continue;const sx=SX(s.x),sz=SZ(s.z);if(!vis(sx,sz,60))continue;
    ctx.fillStyle=STRC[s.type];ctx.strokeStyle='#1d1a14';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx,sz-7);ctx.lineTo(sx+6,sz);ctx.lineTo(sx,sz+7);ctx.lineTo(sx-6,sz);ctx.closePath();ctx.fill();ctx.stroke();
    const cl=strState.get(s.key||'')&&strState.get(s.key||'').cleared;if(big&&scale>0.5)lab(s.name+(cl?' ✓':''),sx,sz-11,11,'#e8dcc0')}
  for(const [mx2,mz2,col] of questMarks()){const sx=Math.max(8,Math.min(W-8,SX(mx2))),sz=Math.max(8,Math.min(H-8,SZ(mz2)));ctx.fillStyle=col;ctx.strokeStyle='#1d1a14';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sz,6,0,6.283);ctx.fill();ctx.stroke();ctx.fillStyle='#1d1a14';ctx.font='900 10px Poppins,sans-serif';ctx.textAlign='center';ctx.fillText('!',sx,sz+3.5)}
  for(const mk of MARKS.values()){const sx=Math.max(10,Math.min(W-10,SX(mk.x))),sz=Math.max(14,Math.min(H-6,SZ(mk.z)));ctx.fillStyle=mk.col;ctx.strokeStyle='#1d1a14';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx,sz);ctx.lineTo(sx-6,sz-10);ctx.arc(sx,sz-12,6.3,Math.PI*0.85,Math.PI*0.15,false);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#1d1a14';ctx.beginPath();ctx.arc(sx,sz-12,2.2,0,6.283);ctx.fill();if(big||W>150)lab(mk.n,sx,sz-23,big?13:10,mk.col)}
  const arrow=(x,z,col,ry,me)=>{const sx=SX(x),sz=SZ(z);ctx.save();ctx.translate(sx,sz);ctx.rotate(-ry+Math.PI);const k=me?1.25:1;ctx.scale(k,k);ctx.fillStyle=col;ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(6.5,7);ctx.lineTo(0,3.5);ctx.lineTo(-6.5,7);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()};
  if(big)for(const e of enemies.values()){if(e.st===2)continue;const sx=SX(e.p.x),sz=SZ(e.p.z);if(!vis(sx,sz,4))continue;ctx.fillStyle=EDEF[e.t].ally?'#7dd87d':e.pas?'#7dc8ff':EDEF[e.t].boss?'#b874ff':'#ff6b5b';ctx.beginPath();ctx.arc(sx,sz,EDEF[e.t].boss?5:2.6,0,6.283);ctx.fill()}
  if(PET&&big){ctx.fillStyle='#7dd87d';ctx.beginPath();ctx.arc(SX(PET.p.x),SZ(PET.p.z),3.5,0,6.283);ctx.fill()}
  for(const nt of wNotes()){const sx=SX(nt.x),sz=SZ(nt.z);if(sx<-20||sz<-20||sx>W+20||sz>H+20)continue;if(!big&&Math.hypot(sx-W/2,sz-H/2)>W/2-6)continue;noteDraw(ctx,sx,sz,nt,big?lab:null)}
  for(const r of remotes.values()){arrow(r.g.position.x,r.g.position.z,r.color,r.g.rotation.y);if(big)lab(r.name,SX(r.g.position.x),SZ(r.g.position.z)-12,11,'#fff')}
  {const sx=SX(px),sz=SZ(pz);ctx.save();ctx.translate(sx,sz);meHalo(ctx,big);ctx.rotate(-camViewYaw()+Math.PI);meCone(ctx,big);playerArrow(ctx,S.color,big?1.8:1.45);ctx.restore();if(big)meLabel(ctx,sx,sz,big)}
  if(big){// róża wiatrów i podziałka
    const rx=W-58,ry=70;ctx.translate(rx,ry);ctx.fillStyle='rgba(20,14,8,.6)';ctx.beginPath();ctx.arc(0,0,34,0,6.283);ctx.fill();ctx.strokeStyle='#c9a24a';ctx.lineWidth=2;ctx.stroke();
    for(let k=0;k<4;k++){ctx.rotate(Math.PI/2);ctx.fillStyle=k===3?'#e5483b':'#e8dcc0';ctx.beginPath();ctx.moveTo(0,-28);ctx.lineTo(6,0);ctx.lineTo(-6,0);ctx.closePath();ctx.fill()}
    ctx.setTransform(1,0,0,1,0,0);lab('N',rx,ry-38,13,'#ffd34d');
    const nice=[10,25,50,100,250,500,1000,2500].find(v=>v*scale>70)||5000,bw=nice*scale;ctx.fillStyle='rgba(20,14,8,.6)';ctx.fillRect(14,H-58,bw+16,30);ctx.fillStyle='#e8dcc0';ctx.fillRect(22,H-36,bw,4);ctx.fillRect(22,H-42,2,10);ctx.fillRect(22+bw-2,H-42,2,10);
    ctx.font='600 12px "Alegreya Sans",sans-serif';ctx.textAlign='left';ctx.fillText(nice+' bloków',22,H-44);
    ctx.textAlign='right';ctx.fillStyle='#e8dcc0';ctx.fillText(`X ${Math.round(cx)}  Z ${Math.round(cz)}  ·  ×${scale.toFixed(2)}`,W-16,H-14)}
  else{// minimapa: okrągła, z literą N
    
    const g=ctx.createRadialGradient(W/2,H/2,W*0.32,W/2,H/2,W/2);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.45)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(W/2,H/2,W/2,0,6.283);ctx.fill();
    lab('N',W/2,15,12,'#ffd34d')}
  ctx.restore();
}
/* v141: mapa lochu/jaskini — odkrywa się w miarę zwiedzania; skrzynia, wyjście, zejście niżej, gracze i wrogowie w pobliżu */
const MAPDECO=[];
function toggleDgMap(){let el=document.getElementById('dgmap');if(!el){el=document.createElement('div');el.id='dgmap';el.innerHTML='<div class="dgh"><b></b><span>M — zamknij</span></div><canvas></canvas>';document.body.appendChild(el);el.onclick=()=>{el.hidden=true}}el.hidden=!el.hidden;if(!el.hidden){try{document.exitPointerLock()}catch(_){}drawDgMap()}}
function dgSeenTick(){const s=SPC;if(!s||(s.kind!=='dungeon'&&s.kind!=='cave'))return;s.seen=s.seen||new Uint8Array(s.W*s.D);const ci=Math.floor((player.p.x-s.x0)/s.cs),cj=Math.floor((player.p.z-s.z0)/s.cs),R=s.kind==='cave'?5:6;for(let j=cj-R;j<=cj+R;j++)for(let i=ci-R;i<=ci+R;i++){if(i<0||j<0||i>=s.W||j>=s.D)continue;if((i-ci)**2+(j-cj)**2<=R*R)s.seen[j*s.W+i]=1}const el=document.getElementById('dgmap');if(el&&!el.hidden)drawDgMap()}
setTimeout(()=>TICKS.push((()=>{let t=0;return dt=>{t-=dt;if(t>0)return;t=0.25;if(!SPC){const el=document.getElementById('dgmap');if(el&&!el.hidden)el.hidden=true;return}dgSeenTick()}})()),0);
function drawDgMap(){const s=SPC,el=document.getElementById('dgmap');if(!s||!el)return;const cv2=el.querySelector('canvas'),cave=s.kind==='cave',sz=Math.min(innerWidth*0.7,innerHeight*0.72),k=Math.floor(sz/Math.max(s.W,s.D));cv2.width=s.W*k;cv2.height=s.D*k;const x=cv2.getContext('2d');x.fillStyle='#120e0a';x.fillRect(0,0,cv2.width,cv2.height);
  el.querySelector('b').textContent=(cave?'Jaskinia':'Loch')+(s.lvl>1?' · poziom '+s.lvl:'');const seen=s.seen||new Uint8Array(s.W*s.D);
  for(let j=0;j<s.D;j++)for(let i=0;i<s.W;i++){const n=j*s.W+i;if(!seen[n])continue;if(s.solid[n]){let edge=false;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const q=(j+b)*s.W+i+a;if(i+a>=0&&j+b>=0&&i+a<s.W&&j+b<s.D&&!s.solid[q])edge=true}if(edge){x.fillStyle=cave?'#6a5a48':'#7d7884';x.fillRect(i*k,j*k,k,k)}}else{x.fillStyle=(s.pool&&s.pool.has(n))?'#2a5a7a':((i+j)&1?(cave?'#3a3026':'#3c3a42'):(cave?'#352b22':'#36343c'));x.fillRect(i*k,j*k,k,k)}}
  const P=(wx,wz,c,r,shape)=>{const px=(wx-s.x0)/s.cs*k,pz=(wz-s.z0)/s.cs*k;x.fillStyle=c;x.strokeStyle='#000';x.lineWidth=2;x.beginPath();if(shape==='sq')x.rect(px-r,pz-r,2*r,2*r);else x.arc(px,pz,r,0,6.283);x.fill();x.stroke()};const vis=(wx,wz)=>{const i=Math.floor((wx-s.x0)/s.cs),j=Math.floor((wz-s.z0)/s.cs);return i>=0&&j>=0&&i<s.W&&j<s.D&&seen[j*s.W+i]};
  if(s.exit&&vis(s.exit[0],s.exit[1]))P(s.exit[0],s.exit[1],'#7dd87d',k*0.7,'sq');if(s.down&&vis(s.down[0],s.down[1]))P(s.down[0],s.down[1],'#4ac8ff',k*0.7,'sq');if(s.chest&&vis(s.chest[0],s.chest[1]))P(s.chest[0],s.chest[1],'#ffd34d',k*0.6,'sq');
  for(const e of enemies.values()){if(e.st===2||e.p.y<s.fy-5||e.p.y>s.fy+20||!vis(e.p.x,e.p.z))continue;if(Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z)>30)continue;P(e.p.x,e.p.z,EDEF[e.t].boss?'#ff3a3a':'#e86a4a',k*(EDEF[e.t].boss?0.5:0.32))}
  for(const r of remotes.values()){const b=r.buf[r.buf.length-1];if(b)P(b.p[0],b.p[2],r.color||'#8fd0ff',k*0.42)}
  {const px=(player.p.x-s.x0)/s.cs*k,pz=(player.p.z-s.z0)/s.cs*k,a=player.ry;x.save();x.translate(px,pz);x.rotate(-a);x.fillStyle='#ffffff';x.strokeStyle='#000';x.lineWidth=2;x.beginPath();x.moveTo(0,k*0.8);x.lineTo(k*0.5,-k*0.5);x.lineTo(-k*0.5,-k*0.5);x.closePath();x.fill();x.stroke();x.restore()}}
function toggleMap(){const o=$('mapwrap');o.hidden=!o.hidden;MAP3D.dirty=true;if(!o.hidden){big.width=o.clientWidth;big.height=o.clientHeight;mapV.x=player.p.x;mapV.z=player.p.z;mapV.follow=true;try{document.exitPointerLock()}catch(e){}}}
big.addEventListener('wheel',e=>{if(MAP3D.on){mapScale=Math.max(0.08,Math.min(8,mapScale*(e.deltaY>0?0.85:1.18)));e.preventDefault();return}const r=big.getBoundingClientRect(),ox=e.clientX-r.left-big.width/2,oz=e.clientY-r.top-big.height/2,wx=mapV.x+ox/mapScale,wz=mapV.z+oz/mapScale;
  mapScale=Math.max(0.08,Math.min(8,mapScale*(e.deltaY>0?0.85:1.18)));mapV.x=wx-ox/mapScale;mapV.z=wz-oz/mapScale;mapV.follow=false;e.preventDefault()},{passive:false});
big.addEventListener('mousedown',e=>{if(e.button!==0)return;mapV.drag=[e.clientX,e.clientY,mapV.x,mapV.z];mapV.down=[e.clientX,e.clientY];big.style.cursor='grabbing'});
big.addEventListener('mouseup',e=>{if(e.button!==0||!mapV.down)return;const d=Math.hypot(e.clientX-mapV.down[0],e.clientY-mapV.down[1]);mapV.down=null;if(d>5)return;const [x,z]=mapPick(e);
  notePopup(e.clientX,e.clientY,x,z)});
big.addEventListener('contextmenu',e=>{e.preventDefault();const [x,z]=mapPick(e);const near=(W.notes||[]).map(n=>[n,Math.hypot(n.x-x,n.z-z)]).sort((a,b)=>a[1]-b[1])[0];
  if(near&&near[1]<14/mapScale+3){noteDel(near[0].id,true);toast('Notatka usunięta','#d2c29e');return}
  if(MARKS.delete('p'+NET.id)){sendFx({k:'unmark',id:NET.id});toast('Znacznik usunięty','#d2c29e')}});
// ===== NOTATKI I ZNACZNIKI NA MAPIE (wspólne dla drużyny, zapisywane w świecie) =====
function wNotes(){return (W&&W.notes)||[]}
const NOTE_IC=['⚑','⚔','☠','💰','⛺','❓','★','⚓','🏰','🌿'];
function noteDraw(ctx,sx,sy,nt,lab){ctx.save();ctx.fillStyle='rgba(20,14,8,.78)';ctx.strokeStyle=nt.col||'#ffd34d';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sy-10,10,0,6.283);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(sx-4,sy-2);ctx.lineTo(sx,sy+4);ctx.lineTo(sx+4,sy-2);ctx.fill();
  ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';ctx.fillText(nt.ic||'⚑',sx,sy-10);ctx.restore();if(lab&&nt.txt)lab(nt.txt,sx,sy-26,11,nt.col||'#ffe9b0')}
function noteAdd(n,send){W.notes=W.notes||[];if(W.notes.some(q=>q.id===n.id))return;W.notes.push(n);if(W.notes.length>120)W.notes.shift();saveW();MAP3D.dirty=true;if(send)sendFx({k:'note',n})}
function noteDel(id,send){W.notes=(W.notes||[]).filter(q=>q.id!==id);saveW();MAP3D.dirty=true;if(send)sendFx({k:'notedel',id})}
setTimeout(()=>{FXH.note=m=>{noteAdd(m.n,false);if(m.n.by!==S.name)toast((m.n.by||'Kompan')+' dodał(a) notatkę na mapie: '+m.n.ic+' '+(m.n.txt||''),m.n.col||'#ffd34d')};
FXH.notedel=m=>noteDel(m.id,false);
FXH.notes=m=>{if(isAuth())return;for(const n of m.list||[])noteAdd(n,false)};},0);
function notePopup(cx,cy,x,z){let el=document.getElementById('notepop');if(el)el.remove();el=document.createElement('div');el.id='notepop';el.className='pane';
  el.style.cssText=`position:fixed;left:${Math.min(innerWidth-270,cx+8)}px;top:${Math.min(innerHeight-190,cy+8)}px;z-index:60;padding:10px;width:250px;background:rgba(24,18,12,.95);border:1px solid #8a6a3a;border-radius:6px;color:#f2e6cc;font:13px Poppins,sans-serif`;
  el.innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:6px">${NOTE_IC.map((c,i)=>`<button data-ic="${i}" style="width:30px;height:28px;padding:0;font-size:15px${i?'':';outline:2px solid #ffd34d'}">${c}</button>`).join('')}</div><input id="notetxt" maxlength="40" placeholder="Treść notatki (np. Skarb, Boss, Obóz)" style="width:100%;box-sizing:border-box"><div style="display:flex;gap:6px;margin-top:8px"><button id="noteok" class="pri" style="flex:1">Dodaj notatkę</button><button id="notequick" style="flex:1">Szybki znacznik</button></div><div style="font-size:11px;opacity:.7;margin-top:6px">Notatki widzi drużyna i zostają w świecie. PPM na notatce — usuń.</div>`;
  document.body.appendChild(el);let ic=0;el.querySelectorAll('[data-ic]').forEach(b=>b.onclick=()=>{ic=+b.dataset.ic;el.querySelectorAll('[data-ic]').forEach(q=>q.style.outline='');b.style.outline='2px solid #ffd34d'});
  const inp=el.querySelector('#notetxt');setTimeout(()=>inp.focus(),0);inp.addEventListener('keydown',ev=>{ev.stopPropagation();if(ev.key==='Enter')el.querySelector('#noteok').click();if(ev.key==='Escape')el.remove()});
  el.querySelector('#noteok').onclick=()=>{const n={id:'n'+Date.now().toString(36)+Math.floor(Math.random()*1e4),x:Math.round(x),z:Math.round(z),ic:NOTE_IC[ic],txt:inp.value.trim().slice(0,40),col:S.color,by:S.name};noteAdd(n,true);sfx('coin',0.4);toast('Notatka dodana'+(NET.role!=='off'?' – widzi ją drużyna':''),S.color);el.remove()};
  el.querySelector('#notequick').onclick=()=>{const mk={x,z,n:S.name,col:S.color,t:180};MARKS.set('p'+NET.id,mk);sendFx({k:'mark',id:NET.id,x,z,n:S.name,col:S.color});sfx('coin',0.4);toast('Znacznik postawiony'+(NET.role!=='off'?' – widzi go drużyna':''),S.color);el.remove()};
  const off=ev=>{if(!el.contains(ev.target)){el.remove();removeEventListener('pointerdown',off,true)}};setTimeout(()=>addEventListener('pointerdown',off,true),0)}
addEventListener('mousemove',e=>{if(!mapV.drag)return;if(MAP3D.on&&MAP3D.cam){const cam=MAP3D.cam,r=new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld,0),uu=new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld,1),ug=new THREE.Vector3(uu.x,0,uu.z),hl=ug.length()||1;ug.normalize();const dx=e.clientX-mapV.drag[0],dy=e.clientY-mapV.drag[1];mapV.x=mapV.drag[2]-r.x*dx/mapScale+ug.x*dy/(mapScale*hl);mapV.z=mapV.drag[3]-r.z*dx/mapScale+ug.z*dy/(mapScale*hl);mapV.follow=false;return}mapV.x=mapV.drag[2]-(e.clientX-mapV.drag[0])/mapScale;mapV.z=mapV.drag[3]-(e.clientY-mapV.drag[1])/mapScale;mapV.follow=false});
addEventListener('mouseup',()=>{if(mapV.drag){mapV.drag=null;big.style.cursor='grab'}});

// ---------- sieć: host / klient ----------
// Topologia gwiazdy: klienci rozmawiają tylko z hostem. Własny ruch należy do gracza (bez opóźnienia),
// świat, wrogowie i łup (od etapu 2) będą liczone u hosta. Transport wymienny: BroadcastChannel (test w kartach) lub WebSocket (.exe przez Radmin VPN).
class BCTransport{constructor(room){this.ch=new BroadcastChannel('coop-gra:'+room);this.ch.onmessage=e=>this.on&&this.on(e.data)}send(m){this.ch.postMessage(m)}close(){this.ch.close()}}
class WSTransport{constructor(url){this.q=[];this.ws=new WebSocket(url);this.ws.onopen=()=>{this.q.forEach(m=>this.ws.send(m));this.q=[]};this.ws.onmessage=e=>this.on&&this.on(JSON.parse(e.data));this.ws.onclose=()=>this.onclose&&this.onclose()}send(m){const s=JSON.stringify(m);this.ws.readyState===1?this.ws.send(s):this.q.push(s)}close(){this.ws.close()}}
const NET={role:'off',id:Math.random().toString(36).slice(2,10),host:null,tr:null,peers:new Map(),lastSnap:0,joinT:0};
const remotes=new Map();
function remoteFor(id,name,color){
  let r=remotes.get(id); if(r)return r;
  const g=makeChar(null),tag=nameTag(name,color,30); g.add(tag); scene.add(g);
  r={g,tag,tk:'',buf:[],name,color,seen:performance.now(),last:new THREE.Vector3()}; remotes.set(id,r); refreshPlayers(); return r;
}
function dropRemote(id){const r=remotes.get(id);if(!r)return;scene.remove(r.g);if(r.boat)scene.remove(r.boat);if(r.pet)scene.remove(r.pet);remotes.delete(id);refreshPlayers()}
function myState(){return{id:NET.id,name:S.name,color:S.color,p:[+player.p.x.toFixed(2),+player.p.y.toFixed(2),+player.p.z.toFixed(2)],ry:+player.ry.toFixed(2),a:P2.dead>0?5:P2.roll>0?4:P2.bowT>0||P3.chg?6:P2.castT>0?7:P2.atkT>0?3:player.swim?2:player.ground?0:1,w:myWeapon(),fo:FOL.map(f=>[+f.p.x.toFixed(2),+f.p.y.toFixed(2),+f.p.z.toFixed(2),+f.ry.toFixed(2),f.d.w,f.d.id,f.atk>0?1:0,f.m.visible?1:0]),fl:INV.fol.map(d=>[d.id,d.look,d.ex,d.name]),ge:gearSig(S.shBack&&INV.eq.tarcza?Object.assign({},INV.eq,{tarcza:Object.assign({},INV.eq.tarcza,{bk:1})}):INV.eq),lo:INV.eq.latarnia&&lampOn?INV.eq.latarnia.rar+1:0,h:+(P2.hp/ST.hp).toFixed(3),c:P2.combo,bp:P2.bowT>0?+(1-P2.bowT/P2.bowD).toFixed(2):0,lk:S.look,lv:HERO.lvl,tb:pk('skarb')+(hasP('szczesciarz')?2:0),stl:P3.stealth>0?1:0,snk:P3.sneak?1:0,hc:MNT.koat||0,hb:herbStr(S.herb),sl:P2.sleep?1:0,veh:VH.mode,mk:VH.mnt?VH.mnt.kind:0,tt:(typeof titleName==='function'?titleName():''),bh:VH.mode===4?VH.host:0,bry:+VH.bry.toFixed(2),bs:+VH.spd.toFixed(1),pet:PET?[PET.t,+PET.p.x.toFixed(2),+PET.p.y.toFixed(2),+PET.p.z.toFixed(2),+PET.ry.toFixed(2),PET.st,((typeof petDef==='function'&&petDef())||{}).name||EDEF[PET.t].n]:0}}
function pushSample(st){const r=remoteFor(st.id,st.name,st.color);r.seen=performance.now();r.buf.push({...st,t:performance.now()});if(r.buf.length>30)r.buf.shift()}
function startNet(role){
  stopNet(); const room=$('room').value.trim()||'navro';
  const DESK=window.coopDesktop;if(DESK&&role==='join'&&!(($('ip')&&$('ip').value.trim()))){status('Wpisz IP hosta z Radmin VPN',true);return}
  try{NET.tr=DESK?new WSTransport('ws://'+(role==='host'?'127.0.0.1':$('ip').value.trim())+':'+(DESK.port||7777)):(location.protocol==='file:'&&$('ip')&&$('ip').value.trim())?new WSTransport('ws://'+$('ip').value.trim()+':7777'):new BCTransport(room)}catch(e){status('Nie udało się otworzyć połączenia: '+e.message,true);return}
  NET.role=role; NET.host=role==='host'?NET.id:null; NET.tr.on=onNet; NET.tr.onclose=()=>{if(NET.role!=='off'){status('Połączenie zamknięte',true);stopNet()}};
  status(role==='host'?'Hostujesz pokój „'+room+'”. Drugi gracz: Dołącz z tym samym kodem.':'Szukam hosta w pokoju „'+room+'”…');
  refreshPlayers();
}
function stopNet(){if(NET.tr){try{NET.tr.send({t:'bye',from:NET.id})}catch(e){}NET.tr.close()}NET.tr=null;NET.role='off';NET.host=null;NET.peers.clear();for(const id of [...remotes.keys()])dropRemote(id);clearEnemies();hcache.clear();refreshPlayers()}
function onNet(m){
  if(!m||m.from===NET.id)return;
  if(m.t==='chit'){if(m.to===NET.id&&m.from===NET.host){const ee=m.eid!=null?enemies.get(m.eid):null;if(m.cid==='pet'){if(PET&&PET.m.visible)compHurt({comp:'pet'},m.dmg,ee)}else{const f=FOL.find(q=>q.d.id===m.cid);if(f)compHurt({comp:f},m.dmg,ee)}}return}
  if(NET.role==='host'){
    if(m.t==='join'){NET.peers.set(m.from,{seen:performance.now()});NET.tr.send({t:'welcome',from:NET.id,to:m.from,seed:S.seed,gen:S.gen||1,kb:S.kb||0,spawn:myState().p,sp:S.spawn});chatLine('System',m.name+' dołączył(a)')}
    else if(m.t==='st'&&NET.peers.has(m.from)&&m.s&&Array.isArray(m.s.p)){NET.peers.get(m.from).seen=performance.now();m.s.id=m.from;pushSample(m.s)}
    else if(m.t==='chat'&&NET.peers.has(m.from)){m.text=String(m.text||'').slice(0,240);m.name=String(m.name||'Gracz').slice(0,24);chatLine(m.name,m.text);NET.tr.send({t:'chat',from:NET.id,name:m.name,text:m.text,relay:m.from})}
    else if(m.t==='bye'&&NET.peers.has(m.from)){NET.peers.delete(m.from);const r=remotes.get(m.from);chatLine('System',(r?r.name:'Gracz')+' wyszedł');dropRemote(m.from)}
    else if(m.t==='dot'&&NET.peers.has(m.from)){if(ENCH[m.k]&&isFinite(m.dps)&&isFinite(m.dur))dotApply(m.eid,m.k,m.dps,m.dur,m.from)}
    else if(m.t==='hit'&&NET.peers.has(m.from)){const e=enemies.get(m.eid),r=remotes.get(m.from),b=r&&r.buf[r.buf.length-1];if(e&&b&&Array.isArray(m.k)&&m.dmg>0&&Math.hypot(b.p[0]-e.p.x,b.p[2]-e.p.z)<48+eBody(e)&&m.dmg<20000)applyHit(m.eid,m.dmg,m.k[0],m.k[1],m.from,Math.min(6,m.slow||0),Math.min(3,m.stun||0),m.src||null)}
    else if(m.t==='fx'&&NET.peers.has(m.from)){showFx(m);NET.tr.send({...m,from:NET.id,relay:m.from})}
    else if(m.t==='qspawn'&&NET.peers.has(m.from)&&m.def){spawnQuestBoss(m.def)}
    else if(m.t==='tamek'&&NET.peers.has(m.from)){const e=enemies.get(m.eid);if(e&&!EDEF[e.t].boss&&!e.sid)removeEnemy(m.eid)}
    else if(m.t==='sspawn'&&NET.peers.has(m.from)&&m.def&&EDEF[m.def.boss||'szkielet']){spawnStructGuards(m.def)}
    else if(m.t==='snap'){status('Uwaga: w tym pokoju jest już inny host',true)}
    return;
  }
  if(NET.role==='client'){
    if(m.t==='welcome'&&m.to===NET.id&&!NET.host){NET.host=m.from;NET.lastSnap=performance.now();status('Połączono z hostem');clearEnemies();const oldSp=JSON.stringify(S.spawn);if(m.sp){S.spawn=m.sp;S.spawnSeed=m.seed;LS.set('spawn',{seed:m.seed,p:m.sp})}const spChanged=m.sp&&JSON.stringify(m.sp)!==oldSp;
      const sp=[m.spawn[0]+1.5,m.spawn[1]+1,m.spawn[2]+1.5];const gch=(m.gen&&m.gen!==S.gen)||(m.kb!=null&&m.kb!==(S.kb||0));if(m.gen)LS.set('gen_'+m.seed,m.gen);if(m.kb!=null)LS.set('kb_'+m.seed,m.kb);if(m.seed!==S.seed||spChanged||gch){newWorld(m.seed,sp)}else teleport(sp)}
    else if(m.from!==NET.host)return;
    else if(m.t==='dmg'){if(m.to===NET.id){takeDamage(m.dmg,m.src);if(m.src){let be=null,bd=5;for(const e of enemies.values()){const d=Math.hypot(e.p.x-m.src[0],e.p.z-m.src[1]);if(d<bd){bd=d;be=e}}if(be)be.hurtP=nowS()}}}
    else if(m.t==='fx'){if(m.relay!==NET.id)showFx(m)}
    else if(m.t==='drop'){if(m.to===NET.id)spawnDrop(m.L)}
    else if(m.t==='snap'){NET.lastSnap=performance.now();if(m.e)syncEnemies(m.e);if(m.hr!=null){hour=m.hr;if(m.se!==season)setSeason(m.se)}if(m.wt!=null)worldT=m.wt;const ids=new Set();for(const s of m.list){if(s.id===NET.id)continue;ids.add(s.id);pushSample(s)}for(const id of [...remotes.keys()])if(!ids.has(id))dropRemote(id)}
    else if(m.t==='chat'&&m.relay!==NET.id)chatLine(String(m.name||'').slice(0,24),String(m.text||'').slice(0,240));
    else if(m.t==='bye'){status('Host zakończył grę',true);stopNet()}
  }
}
let netAcc=0;
function netTick(dt){
  if(NET.role==='off')return; netAcc+=dt; if(netAcc<0.05)return; netAcc=0; const now=performance.now();
  if(NET.role==='host'){
    const list=[myState()];for(const [id] of NET.peers){const r=remotes.get(id);if(r&&r.buf.length){const b=r.buf[r.buf.length-1];list.push({...b,id,name:r.name,color:r.color,t:undefined})}}
    const pl=playersList(),el=[];for(const e of enemies.values()){if(pl.some(p=>Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)<75))el.push([e.id,e.t,e.lvl,(e.elite?1:0)+(e.rar||0)*2,+e.p.x.toFixed(2),+e.p.y.toFixed(2),+e.p.z.toFixed(2),+e.ry.toFixed(2),Math.ceil(e.hp),e.max,e.st,e.flash>0.5?1:0,e.stun>0?2:e.slow>0?1:0,e.qn||0,e.qid||0,e.sid||0,e.torch?1:0,e.tgId||0])}
    NET.tr.send({t:'snap',from:NET.id,list,e:el,hr:+hour.toFixed(3),se:season,wt:+worldT.toFixed(2)});
    for(const [id,pe] of NET.peers)if(now-pe.seen>5000){NET.peers.delete(id);chatLine('System',(remotes.get(id)||{name:'Gracz'}).name+' – utracono połączenie');dropRemote(id)}
  } else {
    if(!NET.host){if(now-NET.joinT>1000){NET.joinT=now;NET.tr.send({t:'join',from:NET.id,name:S.name})}return}
    NET.tr.send({t:'st',from:NET.id,s:myState()});
    if(now-NET.lastSnap>4000){status('Utracono połączenie z hostem',true);stopNet()}
  }
}
function interpRemotes(dt){
  const rt=performance.now()-120;
  for(const r of remotes.values()){
    const b=r.buf; if(!b.length)continue; let a=b[0],c=b[b.length-1];
    for(let i=0;i<b.length-1;i++)if(b[i].t<=rt&&b[i+1].t>=rt){a=b[i];c=b[i+1];break}
    const k=c.t>a.t?Math.min(1,Math.max(0,(rt-a.t)/(c.t-a.t))):1;
    const x=a.p[0]+(c.p[0]-a.p[0])*k,y=a.p[1]+(c.p[1]-a.p[1])*k,z=a.p[2]+(c.p[2]-a.p[2])*k;
    const sp=Math.hypot(x-r.g.position.x,z-r.g.position.z)/Math.max(dt,1e-3);
    r.g.position.set(x,y,z); let dr=c.ry-r.g.rotation.y; dr=Math.atan2(Math.sin(dr),Math.cos(dr)); r.g.rotation.y+=dr*Math.min(1,10*dt);
    r.g.visible=colAt(x,z)!==null; animChar(r.g,Math.min(sp,9),dt,c.a===1,c.a===2);r.g.scale.y=c.snk?0.86:1;
    {const lk=JSON.stringify(c.lk||null);if(r.lkKey!==lk){r.lkKey=lk;const pos=r.g.position.clone(),ry=r.g.rotation.y;scene.remove(r.g);r.g=makeChar(c.lk);r.g.add(r.tag);r.g.position.copy(pos);r.g.rotation.y=ry;scene.add(r.g);r.gl=null}}
    remoteVeh(r,c,dt);
    if(c.w)setWeapon(r.g,c.w[0],c.w[1],c.w[2],c.w[3],c.w[4]);remoteFols(r,c,dt);if(c.ge!==undefined){r.g.userData.herb=herbParse(c.hb);applyGear(r.g,parseSig(c.ge))}const u=r.g.userData;setGhost(r.g,!!c.stl);
    const tk=(c.cls||'')+(c.lv||'')+'|'+(c.tt||'');if(r.tk!==tk){r.tk=tk;r.g.remove(r.tag);r.tag=nameTag((c.tt?'«'+String(c.tt).slice(0,30)+'» ':'')+r.name+(c.lv?' · '+(CLS[c.cls]?CLS[c.cls].n+' ':'poz. ')+c.lv:''),r.color,30);r.g.add(r.tag)}
    if(c.a===5){r.g.rotation.z=Math.min(Math.PI/2,r.g.rotation.z+dt*5)}else r.g.rotation.z=0;
    if(c.a===4){u.rollT=(u.rollT||0)+dt;r.g.rotation.x=u.rollT/0.38*Math.PI*2;r.g.position.y+=0.4}else{u.rollT=0;r.g.rotation.x=0}
    const kind=weaponKind(c.w?c.w[0]:'');
    if(c.a===6)animCombat(r.g,'bow',0,c.bp||0);
    else if(c.a===7){u.atk=(u.atk||0)+dt;animCombat(r.g,'staff',0,Math.min(1,u.atk/0.5))}
    else if(c.a===3&&kind!=='bow'&&kind!=='staff'){if(u.lastC!==c.c){u.lastC=c.c;u.atk=0;u.slashed=false}u.atk=(u.atk||0)+dt;const k=Math.min(1,u.atk/(u.two?0.52:0.34));animCombat(r.g,kind,c.c||0,k);if(!u.slashed&&k>0.33&&kind==='melee'){u.slashed=true;slashFx(r.g,c.c||0,RAR[c.w[1]||0].c)}}
    else{u.atk=0;u.lastC=-1;bowDraw(r.g,0,false)}
  }
}
function sendChat(t){t=t.trim();if(!t)return;chatLine(S.name,t);if(NET.tr)NET.tr.send({t:'chat',from:NET.id,name:S.name,text:t})}
function chatLine(n,t){const d=document.createElement('div');d.innerHTML='<b></b> ';d.firstChild.textContent=n+':';d.appendChild(document.createTextNode(t));$('chatlog').appendChild(d);setTimeout(()=>d.classList.add('fade'),9000);while($('chatlog').children.length>8)$('chatlog').firstChild.remove()}
function status(t,bad){$('netstat').textContent=t;$('netstat').className=bad?'bad':'';$('netpill').textContent=NET.role==='off'?'Solo':NET.role==='host'?'Host · '+(NET.peers.size+1)+' graczy':NET.host?'Klient · połączono':'Klient · szukam…'}
function refreshPlayers(){const l=[`<li><i style="background:${S.color}"></i>${esc(S.name)} (ty)</li>`];for(const r of remotes.values())l.push(`<li><i style="background:${r.color}"></i>${esc(r.name)}</li>`);$('players').innerHTML=l.join('');status($('netstat').textContent,$('netstat').className==='bad')}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);

// ---------- świat: start / nowy seed ----------
// tryb przeglądu modeli (F9 — następny kadr, F10 — koniec): zamek, sala tronowa, arena, mapa
const PHO={i:-1,cam:null,c:null};
function photoStep(off){if(off){PHO.cam=null;PHO.i=-1;if(SPC)leaveSpace();if(!$('mapwrap').hidden)toggleMap();return}
  if(!PHO.c){const cs=[...villages.values()].filter(v=>v&&v.city&&v.houses);if(!cs.length){toast('Brak miasta w zasięgu');return}cs.sort((a,b)=>Math.hypot(a.x-player.p.x,a.z-player.p.z)-Math.hypot(b.x-player.p.x,b.z-player.p.z));PHO.c=cs[0]}
  const c=PHO.c,kc=c.houses.find(h=>h.kcastle),ah=c.houses.find(h=>h.arena);PHO.i=(PHO.i+1)%20;const i=PHO.i;
  const LW=(h,k,lx,ly,lz)=>{const cs=Math.cos(h.rot),sn=Math.sin(h.rot);return[h.x+(lx*cs+lz*sn)*k,h.top+ly*k,h.z+(-lx*sn+lz*cs)*k]};
  const K1=kc?kc.ksc:1,KC=(e,t)=>{PHO.cam=[...LW(kc,K1,e[0],e[1]-1,e[2]),...LW(kc,K1,t[0],t[1]-1,t[2])]},AC=(e,t)=>{PHO.cam=[...LW(ah,1,...e),...LW(ah,1,...t)]},SC=(s,e,t)=>{const x=s.x0+s.W*s.cs/2,z=s.z0+s.D*s.cs/2;PHO.cam=[x+e[0],s.fy+e[1],z+e[2],x+t[0],s.fy+t[1],z+t[2]]};
  if(SPC&&(i===0||i===6||i>=10))leaveSpace();if(!$('mapwrap').hidden)toggleMap();
  if(i<4&&kc){teleport(LW(kc,K1,0,0.2,i===3?14.5:31));[()=>KC([0,12,70],[0,13,0]),()=>KC([50,45,55],[0,10,0]),()=>KC([0,4,31],[0,8,17]),()=>KC([-13,3.5,15.5],[8,6,6])][i]()}
  else if(i<6&&kc){if(!SPC)enterSpace(genThrone(kc,c));i===4?SC(SPC,[0,2.6,16],[0,3.5,-10]):SC(SPC,[-3,2.4,-5],[0.5,3.4,-18])}
  else if(i<8&&ah){teleport(LW(ah,1,0,0.2,17));i===6?AC([0,7,32],[0,5,0]):AC([22,20,24],[0,4,0])}
  else if(i<10&&ah){if(!SPC)enterSpace(genArena(ah,c));i===8?SC(SPC,[0,2.6,17],[0,5,-20]):SC(SPC,[-8,3,-6],[20,6,16])}
  else if(i===10){teleport([c.x,c.h,c.z]);PHO.cam=[c.x+70,c.h+60,c.z+70,c.x,c.h,c.z]}
  else if(i===11){PHO.cam=null;mapScale=0.6;toggleMap()}
  else if(i===12){toggleMap();mapV.follow=false;mapV.x=c.x;mapV.z=c.z;mapScale=3.2;MAP3D.dirty=true}
  else if(i<16){const dd=q=>Math.hypot(q.x-c.x,q.z-c.z)-(q.type==='wyspy'?1e5:0),ss=[...structs.values()].filter(q=>q&&!q.friendly).sort((a,b)=>dd(a)-dd(b)),st=ss[(i-13)%Math.max(1,ss.length)];if(st){const y=st.h??c.h,sk=st.type==='wyspy';teleport([st.x+16,y+1,st.z+16]);PHO.cam=sk?(i===13?[st.x+62,y+30,st.z+66,st.x,y+30,st.z]:[st.x+26,y+66,st.z+30,st.x,y+46,st.z]):[st.x+24,y+16,st.z+24,st.x,y+2,st.z];toast(st.name+' ('+st.type+')')}}
  else if(i<19){const vs=[...villages.values()].filter(q=>q&&!q.city&&q.houses&&q.h!=null).sort((a,b)=>Math.hypot(a.x-c.x,a.z-c.z)-Math.hypot(b.x-c.x,b.z-c.z)),vv=vs[(i-16)%Math.max(1,vs.length)];if(vv){teleport([vv.x,vv.h+1,vv.z]);PHO.cam=[vv.x+34,vv.h+26,vv.z+34,vv.x,vv.h+1,vv.z];toast(vv.name||'osada')}}
  else{PHO.cam=null}
  toast('Kadr '+(i+1)+'/20','#9fb6c8')}
addEventListener('keydown',e=>{if(e.code==='F8'){e.preventDefault();PHO.i+=4;try{photoStep()}catch(_){}}else if(e.code==='F9'){e.preventDefault();try{photoStep()}catch(err){console.warn(err);toast('F9: '+err.message)}}else if(e.code==='F10'){e.preventDefault();try{photoStep(true)}catch(_){}}});
function teleport(p){player.p.set(p[0],p[1]+1,p[2]);player.v.set(0,0,0);camY=null}
// klawisz „=”: teleport na rynek najbliższego miasta (szuka też miast jeszcze niewczytanych)
let tpBusy=false;function tpNearestCity(){if(tpBusy)return;if(SPC){toast('Najpierw wyjdź na zewnątrz.','#ff9d6b');return}if(P2.dead||P2.ride)return;tpBusy=true;
  const p=player.p,gx=Math.floor(p.x/1300),gz=Math.floor(p.z/1300),cells=[];for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)cells.push([gx+a,gz+b]);
  const w=new Worker(wurl);const done=c=>{tpBusy=false;try{w.terminate()}catch(_){}if(!c){toast('Nie znaleziono miasta w okolicy.','#ff9d6b');return}
    const vc=villages.get(c.id)||c,M=cityPlan(vc).M,y=c.h+(c.lv?c.lv[0]:0);teleport([c.x+M[0]+0.5,y+1,c.z+M[1]+6.5]);player.ry=Math.PI;toast('Teleport: '+(villages.get(c.id)&&villages.get(c.id).name||'najbliższe miasto'),'#cfe8ff');sfx('magic',0.5)};
  const to=setTimeout(()=>done(null),8000);
  w.onmessage=e=>{if(e.data.type!=='city')return;clearTimeout(to);const L=(e.data.list||[]).filter(q=>q.c).map(q=>q.c).sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z));done(L[0]||null)};
  w.postMessage({type:'city',gen:S.gen||1,seed:S.seed,cells,sx:S.spawn[0],sz:S.spawn[2]})}
addEventListener('keydown',e=>{if((e.code==='Equal'||e.key==='=')&&!e.repeat&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))&&!dlg){e.preventDefault();tpNearestCity()}});
function clearWorld(){try{MAPH.clear();MAPT.clear();MAP3D.dirty=true;if(typeof mapV!=='undefined')mapV.dirty=true}catch(_){}KING.clear();kingReq.clear();kingCur=null;for(const [k,ch] of [...chunks])unload(k,ch);results.length=0;thumbs.clear();hcache.clear();clearEnemies();for(const d of drops)scene.remove(d.g);drops.length=0;clearVillages();clearStructs();if(typeof V!=='undefined'){if(VH.mode===1)exitBoat();if(VH.mode===2)stopGlide();VH.mode=0;despawnPet()}}
function newWorld(seed,spawnAt){
  {let g=LS.get('gen_'+seed,null),nw=false;if(g==null){const old=LS.get('world_'+seed,null)!=null||LS.get('posSeed',null)===seed||((LS.get('spawn',null)||{}).seed===seed);g=old?1:2;nw=!old;LS.set('gen_'+seed,g)}S.gen=g;
   /* v139: wyrównanie ras królestw (max ~25%) tylko w nowych światach — stare zapisy zachowują swoje królestwa */let kb=LS.get('kb_'+seed,null);if(kb==null){kb=nw?1:0;LS.set('kb_'+seed,kb)}S.kb=kb}
  S.seed=seed;LS.set('seed',seed);$('seed').value=seed;mapDbFlush();clearWorld();loadW();setTimeout(mapDbLoad,50);player.ready=false;$('loading').hidden=false;
  if(S.spawnSeed!==seed){const sv=LS.get('spawn',null);if(sv&&sv.seed===seed){S.spawn=sv.p;S.spawnSeed=seed}else if(spawnAt){S.spawn=null;S.spawnSeed=seed;const w=workers[workers.length-1];w.busy++;spawnCb2=true;w.postMessage({type:'spawn',seed,id:reqId++})}}
  if(spawnAt){player.p.set(spawnAt[0],spawnAt[1]+1,spawnAt[2]);player.v.set(0,0,0);camY=null;player.ready=true;waitReady();return}
  spawnCb=d=>{spawnCb=null;S.spawn=[d.x,d.h,d.z];S.spawnSeed=seed;LS.set('spawn',{seed,p:S.spawn});player.p.set(d.x,d.h+1,d.z);player.v.set(0,0,0);camY=null;player.ready=true;waitReady()};
  workers[0].busy++;workers[0].postMessage({type:'spawn',seed,id:reqId++});
}
function waitReady(){player.hold=true}
function holdIfUnloaded(){if(colAt(player.p.x,player.p.z)===null){waitReady();const el=$('loading');if(el){el.hidden=false;const sb=el.querySelector('.sub');if(sb)sb.textContent='Wczytywanie okolicy…'}}}
/* v149: menu gry pod Esc — Esc zamyka najpierw otwarte okno, a gdy nic nie jest otwarte, otwiera menu; w grze jednoosobowej menu zatrzymuje grę */
function gmFoot(){const f=$('gmfoot');if(f)f.textContent='Pintar v160 · świat '+S.seed+(NET.role==='host'?' · hostujesz':NET.role==='client'?' · połączony z hostem':'');const pz=$('gmpause');if(pz)pz.textContent=NET.role==='off'?'⏸ Pauza':'👥 Co-op — świat toczy się dalej'}
function openGM(){const g=$('gmenu');$('menu').hidden=true;$('gmconf').classList.remove('on');$('gmquit').hidden=false;gmFoot();g.hidden=false;try{document.exitPointerLock()}catch(_){}setTimeout(()=>{try{$('gmres').focus({preventScroll:true})}catch(_){}},0)}
function closeAllMenus(){$('gmenu').hidden=true;$('menu').hidden=true;try{document.activeElement&&document.activeElement.blur&&document.activeElement.blur()}catch(_){}}
function resumeGame(){closeAllMenus();if(player.ready&&!anyWin()&&cv.requestPointerLock){try{const r=cv.requestPointerLock();r&&r.catch&&r.catch(()=>{})}catch(_){}}}
function openSettings(sec){$('gmenu').hidden=true;const m=$('menu');m.hidden=false;try{document.exitPointerLock()}catch(_){}const card=m.querySelector('.card');if(card)card.scrollTop=0;if(sec==='coop'){const el=m.querySelectorAll('section')[1];if(el)setTimeout(()=>el.scrollIntoView({block:'start',behavior:'smooth'}),30)}}
function backToGM(){openGM()}
function gmPaused(){return NET.role==='off'&&player.ready&&!player.hold&&(!$('gmenu').hidden||!$('menu').hidden)}
function toggleMenu(){if(!$('gmenu').hidden||!$('menu').hidden)closeAllMenus();else openGM()}
function escPress(){
  if(!$('menu').hidden){backToGM();return}
  if(!$('gmenu').hidden){if($('gmconf').classList.contains('on')){$('gmconf').classList.remove('on');$('gmquit').hidden=false;return}resumeGame();return}
  if(!$('journal').hidden){toggleJournal();return}
  if(!$('mapwrap').hidden){toggleMap();return}
  const dg=document.getElementById('dgmap');if(dg&&!dg.hidden){toggleDgMap();return}
  const np=document.getElementById('notepop');if(np){np.remove();return}
  if(!$('clsel').hidden)return;
  openGM()}
whenReady(()=>{
  $('gmres').onclick=resumeGame;
  const act={alb:()=>openBook(),cook:()=>openCook(),inv:()=>toggleInv(),jour:()=>toggleJournal(),map:()=>toggleMap(),look:()=>openCustom(),set:()=>openSettings(),coop:()=>openSettings('coop'),
    save:()=>{try{saveAllNow()}catch(_){}try{saveInv();saveW()}catch(_){}toast('💾 Gra zapisana','#9be08a')}};
  for(const b of document.querySelectorAll('#gmenu [data-gm]'))b.onclick=()=>{const k=b.dataset.gm;if(k==='save'){act.save();return}if(k==='set'||k==='coop'){act[k]();return}closeAllMenus();act[k]()};
  $('gmquit').onclick=()=>{$('gmquit').hidden=true;$('gmconf').classList.add('on');setTimeout(()=>$('gmno').focus(),0)};
  $('gmno').onclick=()=>{$('gmconf').classList.remove('on');$('gmquit').hidden=false};
  $('gmyes').onclick=()=>{try{saveAllNow()}catch(_){}$('quitgame').click()};
  $('closemenu2').onclick=resumeGame;
  // strzałki w menu
  $('gmenu').addEventListener('keydown',e=>{if(e.code!=='ArrowDown'&&e.code!=='ArrowUp')return;const L=[...$('gmenu').querySelectorAll('button')].filter(b=>!b.hidden&&b.offsetParent);const i=L.indexOf(document.activeElement);const n=L[(i+(e.code==='ArrowDown'?1:-1)+L.length)%L.length];if(n){n.focus();e.preventDefault();e.stopPropagation()}});
  $('gmenu').addEventListener('click',e=>{if(e.target.id==='gmenu')resumeGame()});
});

// UI
$('rd').value=S.rd;$('rdv').textContent=S.rd;$('seed').value=S.seed;$('nick').value=S.name;$('col').value=S.color;$('shadow').checked=S.shadows;
$('rd').oninput=e=>{S.rd=+e.target.value;$('rdv').textContent=S.rd;LS.set('rd2',S.rd)};
setSeason(season);$('season').value=season;$('season').onchange=e=>{if(NET.role==='client')return status('Porę roku ustawia host',true);setSeason(+e.target.value);LS.set('season',season)};
$('pxr').value=OPT.pr;$('pxr').onchange=e=>{OPT.pr=+e.target.value;LS.set('pxr',OPT.pr);renderer.setPixelRatio(Math.min(devicePixelRatio||1,OPT.pr));renderer.setSize(innerWidth,innerHeight)};
$('shs').value=OPT.shadowSize;$('shs').onchange=e=>{OPT.shadowSize=+e.target.value;LS.set('shs',OPT.shadowSize);sun.shadow.mapSize.set(OPT.shadowSize,OPT.shadowSize);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}};
try{$('voxt').checked=SEAS_U.uVox.value>0.5;$('voxt').onchange=e=>{SEAS_U.uVox.value=e.target.checked?1:0;LS.set('voxT',SEAS_U.uVox.value)}}catch(_){}$('lodc').checked=OPT.lod;$('lodc').onchange=e=>{OPT.lod=e.target.checked;LS.set('lod',OPT.lod);instDirty=true};
$('shadow').onchange=e=>{S.shadows=e.target.checked;LS.set('sh',S.shadows);renderer.shadowMap.enabled=S.shadows;sun.castShadow=S.shadows;scene.traverse(o=>{if(o.material)o.material.needsUpdate=true})};
$('newseed').onclick=()=>{if(NET.role==='client')return status('Klient używa świata hosta',true);newWorld(Math.floor(Math.random()*1e9));toggleMenu()};
$('useseed').onclick=()=>{if(NET.role==='client')return;const v=parseInt($('seed').value,10);if(Number.isFinite(v)){newWorld(v);toggleMenu()}};
$('nick').onchange=e=>{S.name=e.target.value.slice(0,16)||'Gracz';LS.set('name',S.name);refreshPlayers()};
$('col').onchange=e=>{S.color=e.target.value;LS.set('color',S.color);rebuildMe();refreshPlayers()};
let meRef=me; function rebuildMe(){const ry=meRef.rotation.y;scene.remove(meRef);meRef=makeChar(S.look);meRef.rotation.y=ry;scene.add(meRef);if(VH.gl){VH.gl=null;if(VH.mode===2){VH.gl=makeGlider();meRef.add(VH.gl)}}const w=myWeapon();setWeapon(meRef,w[0],w[1],w[2],w[3],w[4])}
$('host').onclick=()=>startNet('host'); $('join').onclick=()=>startNet('client'); $('leave').onclick=()=>{stopNet();status('Rozłączono')};
$('closemenu').onclick=backToGM; $('menubtn').onclick=toggleMenu; $('mapbtn').onclick=toggleMap; $('mapwrap').onclick=e=>{if(e.target.id==='mapwrap'||e.target.id==='mapclose')toggleMap()};
$('mapcenter').onclick=()=>{mapV.follow=true};
if(typeof BroadcastChannel==='undefined')status('Ta przeglądarka nie obsługuje testu co-op w kartach',true); else status('Gra solo. Hostuj albo dołącz do pokoju.');
// wersja .exe (Electron): pole IP hosta, lista własnych adresów (Radmin VPN to zwykle 26.x.x.x), przekaźnik WebSocket na porcie 7777 działa w tle aplikacji
if(window.coopDesktop){try{$('ipbox').style.display='block';try{$('ip').value=localStorage.getItem('coop1.ip')||''}catch(_){}$('ip').addEventListener('change',()=>{try{localStorage.setItem('coop1.ip',$('ip').value.trim())}catch(_){}});
  const ips=window.coopDesktop.ips||[],rad=ips.filter(a=>a.startsWith('26.'));$('myip').textContent=ips.length?('Twoje IP: '+(rad.length?rad.join(', ')+' (Radmin VPN)':ips.join(', '))+' — podaj je drugiemu graczowi, gdy hostujesz.'):'';
  $('coopnote').textContent='Host klika Hostuj. Drugi gracz wpisuje IP hosta z Radmin VPN i klika Dołącz. Kod pokoju nie jest potrzebny. Przy pierwszym hostowaniu Windows może zapytać o zgodę zapory — zezwól.'}catch(e){}}

