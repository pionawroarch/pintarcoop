// =================== GRAFIKA PINTARA: dopasowanie do gry ===================
// Skala: 1 jednostka świata gry = 1 blok terenu. Modele z kitu są w voxelach (V=1/16),
// budynki skalujemy ×BS, drzewa ×TS, żeby pasowały do postaci (~1,8 j. ≈ 29 voxeli).
const BS=2.2, TS=2.0;
// moje modele (środek boxa w jednostkach świata) -> boxy kitu (narożnik w voxelach) -> voxGeo
const vb=list=>list.map(([x,y,z,w,h,d,c])=>[(x-w/2)*16,(y-h/2)*16,(z-d/2)*16,w*16,h*16,d*16,c]);
function freeCPU(g){for(const k in g.attributes)g.attributes[k].onUploadCallback=function(){this.array=null};if(g.index)g.index.onUploadCallback=function(){this.array=null};return g}

// (palma, kaktus, kwiat, sosna śnieżna: patrz ROŚLINNOŚĆ v2)
const TK=['oak','pine','birch','palm','cactus','bush','rock','flower','snowpine','grass','tulip','mushroom','boulder','fern','acacia','jtree','maple','sakura','heather','drygrass','wheat','cabbage','corn','fence','tallgrass','bamboo','sequoia','mangrove','lavender','saltc','baobab','reed','arch','obelisk','ribs','totem','menhir','wreck','bigcrystal','log','wagon','idol','termite','spring','shrine','ruinwall','icicle','skull','petree','bflag','bsword','bones','glassp','floatisle','deadtree','geyser','pumpkin','scarecrow','haystack','iceblock','voidrock','stilthut','ropepost','runestone','voidshard','deadbush','redarch','meteor','ambertree','bloodtree','glowshroom','giantflower','giantflower2','basaltcol','glowreed','hoodoo','titanskull','titanblade','stonetree','saltpillar','cloudpuff','rainbowrock','tarpit','lanterntree','frosttree','deadcoral','webtree','cocoon','stonelantern','gear','pipe'];
const SMALLT=new Set([7,9,10,11,13,18,19,20,21,22,23,24,28,29,31,50,51,52]);
const SCL={};for(const k of TK)SCL[k]=TS;SCL.baobab=TS*2.6;SCL.titanskull=TS*3.2;SCL.titanblade=TS*3.4;SCL.gear=TS*1.6;SCL.saltpillar=TS*1.5;SCL.rainbowrock=TS*1.6;/* baobab: ~18 m wysokości, pień ~5 m (postać 2 m) */
const SCLX=TK.map(k=>(SCL[k]||TS)/TS);
const DECO=TK.map(k=>[null,TRUNK[k]?TRUNK[k][0]:0]); // [_, promień pnia]
// bryły kolizji rekwizytów (z modelu, w wokselach) – zamiast samego walca: łuk, żebra, pień, ruina, wrak, kości, kolce, źródło…
const COLB=TK.map(k=>{const g=OBJGEO[k];return g&&g.userData&&g.userData.cb&&g.userData.cb.length?g.userData.cb:null}),COLR=COLB.map(L=>L?Math.max(...L.map(b=>Math.max(Math.abs(b[0]),Math.abs(b[0]+b[3]),Math.abs(b[2]),Math.abs(b[2]+b[5])))):0);

function decoBoxPush(p,D,i){const L=COLB[D[i]],xs=SCLX[D[i]]||1,s=D[i+4]*TS*xs/16,ex=p.x-D[i+1],ez=p.z-D[i+3],ro=COLR[D[i]]*s+1;if(Math.abs(ex)>ro||Math.abs(ez)>ro)return;const q=Math.floor(D[i+5]/(Math.PI/2))&3;
  let lx=ex/s,lz=ez/s;for(let k=0;k<q;k++){const t=lx;lx=-lz;lz=t}const ly=(p.y-D[i+2])/s,pr=PR/s,ph=PH/s,st=0.4/s;let mx=0,mz=0;
  for(const b of L){if(ly>=b[1]+b[4]-st||ly+ph<=b[1])continue;const x0=b[0]-pr,x1=b[0]+b[3]+pr,z0=b[2]-pr,z1=b[2]+b[5]+pr;if(lx<=x0||lx>=x1||lz<=z0||lz>=z1)continue;
    const dl=lx-x0,dr=x1-lx,dn=lz-z0,df=z1-lz,m=Math.min(dl,dr,dn,df);if(m===dl)lx=x0;else if(m===dr)lx=x1;else if(m===dn)lz=z0;else lz=z1}
  for(let k=0;k<q;k++){const t=lx;lx=lz;lz=-t}const nx=D[i+1]+lx*s,nz=D[i+3]+lz*s,mv=Math.abs(nx-p.x)+Math.abs(nz-p.z)>1e-4;p.x=nx;p.z=nz;return mv}
const CLIMBD=new Set(['mushroom','glowshroom','skull','titanskull','ribs'].map(k=>TK.indexOf(k)).filter(i=>i>=0));
function decoBoxTop(x,z,y,D,i){const L=COLB[D[i]],xs=SCLX[D[i]]||1,s=D[i+4]*TS*xs/16,ex=x-D[i+1],ez=z-D[i+3],ro=COLR[D[i]]*s+0.5;if(Math.abs(ex)>ro||Math.abs(ez)>ro)return null;const q=Math.floor(D[i+5]/(Math.PI/2))&3;
  let lx=ex/s,lz=ez/s;for(let k=0;k<q;k++){const t=lx;lx=-lz;lz=t}let best=null;for(const b of L){if(lx<b[0]||lx>b[0]+b[3]||lz<b[2]||lz>b[2]+b[5])continue;const top=D[i+2]+(b[1]+b[4])*s;if(top<=y+0.6&&top>y-3&&(best===null||top>best))best=top}return best}
const MAXD={lavender:150,saltc:130,reed:110,grass:85,tallgrass:85,drygrass:80,fern:90,mushroom:70,tulip:110,flower:120,heather:140,bush:200,wheat:150,corn:150,cabbage:120,fence:190};Object.assign(MAXD,{bsword:120,bones:110,glassp:140,pumpkin:120,deadbush:100,voidshard:130,glowreed:110});
const FLOWC=[0xe8484b,0xf2c534,0x7a8ae0,0xffffff,0xd96bd0,0xf08aa0];
const ICAP=30000,IMS={};
/* v137: kwiaty mają kolor na instancję — osobny materiał, bo wspólny z resztą (bez koloru instancji) dawał w r128 błąd rysowania „isInterleavedBufferAttribute” i znikanie części świata */
const flowerMat=(()=>{const m=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(m,false);m.customProgramCacheKey=()=>'flowerInst';return m})();
const imMat=k=>(k==='flower'||k==='flower_l')?flowerMat:k==='sequoia'?matVK:/^(oak|birch|palm|bush|grass|fern|tulip|acacia|jtree|maple|sakura|heather|drygrass|wheat|cabbage|corn|tallgrass|bamboo|mangrove|baobab|lavender|reed)/.test(k)?matVD:/^(pine|snowpine)/.test(k)?matVK:/^(bush|cabbage|wheat|corn)/.test(k)?matV:matVO;
for(const k of [...TK,'oak_l','pine_l','birch_l','maple_l','sakura_l']){const m=new THREE.InstancedMesh(OBJGEO[k],imMat(k),ICAP);m.count=0;m.frustumCulled=false;
  m.castShadow=!k.endsWith('_l')&&!/flower|grass|tulip|fern|mushroom|heather|wheat|cabbage|corn|lavender|saltc|reed/.test(k);m.receiveShadow=true;if(k==='flower'||k==='flower_l'){m.instanceColor=new THREE.InstancedBufferAttribute(new Float32Array(ICAP*3).fill(1),3)}scene.add(m);IMS[k]=m}
const _fr=new THREE.Frustum(),_pm=new THREE.Matrix4(),_sph=new THREE.Sphere(),_dm=new THREE.Object3D(),_cc=new THREE.Color();
let instDirty=true,instTotal=0;const lastCam={x:1e9,y:0,z:0,yaw:0,pitch:0};
// instancje przebudowujemy tylko po ruchu kamery albo zmianie zestawu chunków (zasada 4)
const TREEMAX=520;
function rebuildInst(){
  const cnt={};for(const k in IMS)cnt[k]=0;
  camera.updateMatrixWorld();_pm.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);_fr.setFromProjectionMatrix(_pm);
  const px=player.p.x,pz=player.p.z,RF=S.rd*C+20,RF2=RF*RF,Dm2=OPT.lodD*OPT.lodD;
  for(const ch of chunks.values()){if(!ch.decos||!ch.mesh)continue;const cx=ch.cx*C+16,cz=ch.cz*C+16;const cdist=Math.hypot(cx-px,cz-pz);if(cdist>Math.min(RF,TREEMAX)+24)continue;
    _sph.center.set(cx,WATER+18,cz);_sph.radius=70;if(!_fr.intersectsSphere(_sph))continue;
    for(const D of (cdist<200&&ch.decoS?[ch.decos,ch.decoS]:[ch.decos])){/* v119: macierze dekoracji liczone raz na fragment mapy */let MX=D.__mx;if(!MX){MX=D.__mx=new Float32Array(D.length/6*16);for(let i=0,j=0;i<D.length;i+=6,j++){const k0=TK[D[i]];_dm.position.set(D[i+1],D[i+2],D[i+3]);_dm.rotation.set(0,Math.floor(D[i+5]/(Math.PI/2))*Math.PI/2,0);_dm.scale.setScalar(D[i+4]*(SCL[k0]||TS));_dm.updateMatrix();MX.set(_dm.matrix.elements,j*16)}}
      for(let i=0;i<D.length;i+=6){const t=D[i],k0=TK[t],dx=D[i+1]-px,dz=D[i+3]-pz,d2=dx*dx+dz*dz;if(d2>RF2)continue;const md=MAXD[k0];if(md&&d2>md*md)continue;if(d2>TREEMAX*TREEMAX)continue;
      const k=(OPT.lod&&IMS[k0+'_l']&&d2>Dm2)?k0+'_l':k0,n=cnt[k];if(!IMS[k]||n>=ICAP)continue;cnt[k]++;
      {const IM=IMS[k],ar=IM.instanceMatrix&&IM.instanceMatrix.array;if(ar)ar.set(MX.subarray(i/6*16,i/6*16+16),n*16);else{const el=_dm.matrix.elements,o=i/6*16;for(let q=0;q<16;q++)el[q]=MX[o+q];IM.setMatrixAt(n,_dm.matrix)}}
      if(t===7)IMS[k].setColorAt(n,_cc.setHex(FLOWC[Math.floor(D[i+5]*10)%FLOWC.length]))}}}
  instTotal=0;for(const k in IMS){const M=IMS[k],c=cnt[k]||0;M.count=c;instTotal+=c;M.visible=c>0;/* v121: wysyłamy do karty tylko użyte macierze, nie cały bufor 30 000 */if(c>0){const im=M.instanceMatrix;if(im.updateRange){im.updateRange.offset=0;im.updateRange.count=c*16}im.needsUpdate=true;if(M.instanceColor){if(M.instanceColor.updateRange){M.instanceColor.updateRange.offset=0;M.instanceColor.updateRange.count=c*3}M.instanceColor.needsUpdate=true}}}
  instDirty=false;
}
let camMoved=false,shF=0;
function instFrame(){
  const c=camera.position;camMoved=Math.abs(c.x-lastCam.x)>2||Math.abs(c.y-lastCam.y)>2||Math.abs(c.z-lastCam.z)>2||Math.abs(yaw-lastCam.yaw)>0.04||Math.abs(pitch-lastCam.pitch)>0.04;
  if(camMoved||instDirty){lastCam.x=c.x;lastCam.y=c.y;lastCam.z=c.z;lastCam.yaw=yaw;lastCam.pitch=pitch;rebuildInst()}
  shF++;renderer.shadowMap.needsUpdate=S.shadows&&(camMoved||P2.atkT>0?shF%3===0:shF%6===0);   // cienie co 2 klatki w ruchu, co 4 w bezruchu
}

// --- pora dnia i roku (cykl z kitu) ---
const CLOUDS=(()=>{const N=46,geo=new THREE.BoxGeometry(1,1,1),mat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.82,fog:false,depthWrite:false});const im=new THREE.InstancedMesh(geo,mat,N*5);im.frustumCulled=false;im.renderOrder=-1;
  const cl=[];let s=1234;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<N;i++){const parts=[];const n=3+Math.floor(r()*3);for(let k=0;k<5;k++)parts.push(k<n?[(r()-0.5)*40,(r()-0.5)*4,(r()-0.5)*26,22+r()*30,5+r()*4,16+r()*20]:null);cl.push({x:(r()-0.5)*1600,z:(r()-0.5)*1600,y:150+r()*40,parts})}
  scene.add(im);const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),P=new THREE.Vector3(),Sc=new THREE.Vector3();
  return{im,mat,tick(t,cx,cz,dk){let j=0;const wind=t*2.2;for(const c of cl){let x=c.x+wind,z=c.z;x=((x-cx+800)%1600+1600)%1600-800+cx;z=((z-cz+800)%1600+1600)%1600-800+cz;
    for(const p of c.parts){if(p){P.set(x+p[0],c.y+p[1],z+p[2]);Sc.set(p[3],p[4],p[5])}else Sc.set(0,0,0);M.compose(P,Q,Sc);im.setMatrixAt(j++,M)}}im.instanceMatrix.needsUpdate=true;
    mat.color.setRGB(1-dk*0.82,1-dk*0.8,1-dk*0.72);mat.opacity=0.82-dk*0.35;im.visible=!(SPC)}}})();
const _arenaSky=new THREE.Color(0x4a3a2a);const WX={k:'jasno',i:0,t:90,flash:0,thT:25,sync:0};const WXN={jasno:'Pogodnie',deszcz:'Deszcz',burza:'Burza',mgla:'Mgła',snieg:'Śnieg'},_grey=new THREE.Color(0x6f7a84),_white=new THREE.Color(0xe8f0ff);
const SKY_DAY=new THREE.Color(0x9cc7e6),SKY_NIGHT=new THREE.Color(0x0b1220),SKYC=SKY_DAY.clone(),SV=new THREE.Vector3(),_moon=new THREE.Color(0x8fa0ff);
let hour=LS.get('hour',9.5),season=LS.get('season',0),nightOn=false;const winMeshes=[];
function setSeason(v){season=v;SEAS_U.uAut.value=v===1?1:0;SEAS_U.uSnow.value=v===2?1:0;SEAS_U.uSpr.value=v===3?1:0;SEAS_U.uFall.value=v===1?.5:v===2?1:0}
function lighting(tx,ty,tz){
  const a=(hour-6)/12*Math.PI,el=Math.sin(a),aq=Math.round(a/0.0035)*0.0035;/* kierunek słońca w krokach 0,2° — cienie nie drgają w każdej klatce */
  SV.set(Math.cos(aq)*.85,Math.max(.05,Math.sin(aq)),-.5).normalize();
  const dk=1-Math.min(1,Math.max(0,el*3+.3)),sI=.24+.76*Math.min(1,Math.max(0,el)*1.8),mI=.13;
  sun.intensity=mI+(sI-mI)*(1-dk);sun.color.set(el<.25?0xffc890:0xfff1d6).lerp(_moon,dk*.6);
  hemi.intensity=.2+.38*(1-dk);SKYC.copy(SKY_NIGHT).lerp(SKY_DAY,1-dk);
  {const wi=WX.i*(WX.k==='mgla'?0.45:WX.k==='snieg'?0.6:1);sun.intensity*=1-0.55*wi;hemi.intensity*=1-0.2*wi;SKYC.lerp(_grey.clone().multiplyScalar(1-dk*0.85),0.6*wi);if(WX.flash>0){hemi.intensity+=WX.flash*1.4;SKYC.lerp(_white,WX.flash*0.7)}}
  const night=dk>.55,wb=night?(hour>=17||hour<0.5?0:hour<3?1:hour<5?2:3):-1;if(night!==nightOn||wb!==lighting.wb){nightOn=night;lighting.wb=wb;const fr=[0.7,0.4,0.15,0.35][wb]||0;for(const w of winMeshes)w.material=night&&(w.userData.k??0.5)<fr?winOn:winOff}
  {/* środek kamery cienia na siatce tekseli w układzie światła — krawędzie cieni nie pełzają przy ruchu gracza */
    const sc=sun.shadow.camera,ts=(sc.right-sc.left)/Math.max(256,OPT.shadowSize);let rx=SV.z,rz=-SV.x;const rl=Math.hypot(rx,rz)||1;rx/=rl;rz/=rl;
    const ux=SV.y*rz,uy=SV.z*rx-SV.x*rz,uz=-SV.y*rx;const pr=tx*rx+tz*rz,pu=tx*ux+ty*uy+tz*uz,pl=tx*SV.x+ty*SV.y+tz*SV.z,qr=Math.round(pr/ts)*ts,qu=Math.round(pu/ts)*ts;
    tx=rx*qr+ux*qu+SV.x*pl;ty=uy*qu+SV.y*pl;tz=rz*qr+uz*qu+SV.z*pl}
  sun.position.set(tx+SV.x*110,ty+SV.y*110,tz+SV.z*110);sun.target.position.set(tx,ty,tz);SEAS_U.uSunW.value.copy(SV);SEAS_U.uCam.value.copy(camera.position);SEAS_U.uTime.value=(performance.now()/1000)%3600;
}
const clockTxt=()=>{const h=Math.floor(hour),m=Math.floor((hour-h)*60);return h+':'+String(m).padStart(2,'0')};

// --- budynki z generatorów kitu ---
const HT={kupiec:[kupiecGen,4,8,4,12,64,64],dlugi:[dlugiGen,4,4,4,6,48,96],karczma:[karczmaGen,4,8,4,18,64,64],chata:[chataGen,5,5,5,12,48,48],
  chalupa:[chalupaGen,4,4,4,12,48,64],dom:[domGen,4,4,4,9,64,64],wiezaDom:[wiezaDomGen,10,4,4,9,64,64]};   // [gen, iL,iR,iB,iF, W,D] w voxelach
const RACEPAL={
  ludzie:P=>P,
  krasnoludy:P=>Object.assign(P,SLATE,{wall:'#cfc8bc',wallD:'#b6ae9f',timber:'#3a2a20',door:'#4a3a2a',shut:'#5a5a6a',cloth:'#6a5a8a'}),
  elfy:P=>Object.assign(P,{wall:'#f2ecd6',wallD:'#ded6bc',timber:'#8a6a3a',roofA:'#4f8a3e',roofB:'#457a36',ridge:'#33602a',door:'#5a7a3a',shut:'#6a8a4a',cloth:'#4a8a6a'}),
  orkowie:P=>Object.assign(P,THATCH,{wall:'#bc9e78',wallD:'#a48862',timber:'#3a2416',door:'#4a2a1a',shut:'#6a3a2a',cloth:'#8a3a2a'})};
const houseCache=new Map();
const RBASE={niziolki:'ludzie',drowy:'elfy',saurianie:'orkowie'};
const RREC={niziolki:(r,g,b)=>{const mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=(mx-mn)/(mx+.001);if(r>g*1.35&&r>b*1.5&&sat>0.45&&r>0.42)return[0.26+0.3*g,0.44+0.4*g,0.16+0.12*g];if(sat<0.18&&mx>0.62)return[mx*0.99,mx*0.92,mx*0.76];return null},
  drowy:(r,g,b)=>{const l=(r+g+b)/3,mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=(mx-mn)/(mx+.001);if(g>r*1.12&&g>b*1.05)return[0.18+0.3*l,0.08+0.12*l,0.26+0.4*l];if(sat<0.2)return[0.14+0.3*l,0.13+0.27*l,0.18+0.36*l];return[r*0.48+0.04,g*0.4+0.02,b*0.58+0.08]},
  saurianie:(r,g,b)=>{const l=(r+g+b)/3,mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=(mx-mn)/(mx+.001);if(r>=g&&g>=b&&sat>0.22&&l>0.36)return[0.2+0.5*l,0.3+0.55*l,0.12+0.22*l];if(r>=g&&g>=b&&sat>0.22)return[r*0.85,g*0.95,b*0.8];return null}};
function recolorShare(geo,fn){const g=new THREE.BufferGeometry();for(const k of ['position','normal','uv'])if(geo.attributes[k])g.setAttribute(k,geo.attributes[k]);const c=geo.attributes.color,src=c.array,a=new Float32Array(src.length),nm=src instanceof Uint8Array?255:1;
  for(let i=0;i<src.length;i+=3){const r=src[i]/nm,gg=src[i+1]/nm,b=src[i+2]/nm,o=fn(r,gg,b);if(o){a[i]=o[0];a[i+1]=o[1];a[i+2]=o[2]}else{a[i]=r;a[i+1]=gg;a[i+2]=b}}g.setAttribute('color',new THREE.BufferAttribute(a,3));if(geo.index)g.setIndex(geo.index);for(const k in geo.attributes)if(!g.attributes[k])g.setAttribute(k,geo.attributes[k]);g.userData=Object.assign({},geo.userData||{});try{g.computeBoundingSphere()}catch(_){}return g}
// regionalne odmiany domów: tynki, dachy i drewno dopasowane do biomu miasta
const STYREC={pustynia:{w:[0.86,0.76,0.56],r:[0.78,0.45,0.24],t:[0.55,0.42,0.28]},polnoc:{w:[0.70,0.72,0.76],r:[0.26,0.28,0.33],t:[0.18,0.14,0.11]},tropik:{w:[0.94,0.92,0.84],r:[0.62,0.54,0.30],t:[0.36,0.29,0.17]},gory:{w:[0.66,0.64,0.60],r:[0.36,0.25,0.17],t:[0.25,0.18,0.12]},port:{w:[0.93,0.92,0.88],r:[0.24,0.40,0.58],t:[0.34,0.26,0.18]},
  cegla:{w:[0.70,0.40,0.31],r:[0.30,0.30,0.34],t:[0.24,0.16,0.11]},bialy:{w:[0.95,0.94,0.90],r:[0.27,0.37,0.55],t:[0.20,0.15,0.11]},ochra:{w:[0.86,0.70,0.44],r:[0.62,0.30,0.18],t:[0.34,0.24,0.15]},
  zielony:{w:[0.70,0.78,0.64],r:[0.24,0.38,0.30],t:[0.28,0.20,0.13]},lupek:{w:[0.64,0.64,0.66],r:[0.22,0.24,0.30],t:[0.20,0.16,0.13]},rozowy:{w:[0.92,0.74,0.70],r:[0.55,0.25,0.20],t:[0.30,0.20,0.14]},niebieski:{w:[0.70,0.80,0.90],r:[0.36,0.22,0.16],t:[0.22,0.16,0.12]}};
function styFn(sty,race){const S=STYREC[sty];return (r,g,b)=>{const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(r+g+b)/3,sat=(mx-mn)/(mx+.001);
  if(sat<0.22&&l>0.6){const k=l/0.8;return[S.w[0]*k,S.w[1]*k,S.w[2]*k]}
  if(r>g*1.3&&r>b*1.5&&sat>0.4&&(race==='ludzie'||race==='niziolki')){const k=l/0.4;return[Math.min(1,S.r[0]*k),Math.min(1,S.r[1]*k),Math.min(1,S.r[2]*k)]}
  if(r>=g&&g>=b&&l<0.38&&sat>0.25){const k=l/0.3;return[S.t[0]*k,S.t[1]*k,S.t[2]*k]}return null}}
// zróżnicowanie wysokości: wariant domu dodaje lub odejmuje piętro (wszystkie rasy) — [v0..v4]
const FLD={chata:[0,0,0,1,0],chalupa:[0,1,0,0,0],dlugi:[0,0,0,1,0],dom:[0,1,-1,0,1],kupiec:[0,1,-1,0,1],karczma:[0,-1,1,0,1],wiezaDom:[0,1,0,-1,2],podcienia:[0,1,-1,0,1],kamienica:[0,-1,1,-2,2]};let HFL=0;
function houseModel(type,v,race,sty){
  if(sty&&STYREC[sty]){const key2=type+'|'+v+'|'+race+'|'+sty;if(houseCache.has(key2))return houseCache.get(key2);const b=houseModel(type,v,race);let res=b;if(b)try{res={geo:recolorShare(b.geo,styFn(sty,race)),wins:b.wins}}catch(e){res=b}houseCache.set(key2,res);return res}
  const key=type+'|'+v+'|'+race;if(houseCache.has(key))return houseCache.get(key);
  if(RBASE[race]&&!hasGen2(race)){const b=houseModel(type,v,RBASE[race]);let res=null;if(b){try{res={geo:recolorShare(b.geo,RREC[race]),wins:b.wins}}catch(e){console.warn('kolor rasy',e);res=b}}houseCache.set(key,res);return res}
  const [gen,,,,,W0,D0]=HT[type];const P=(RACEPAL[race]||RACEPAL[RBASE[race]]||RACEPAL.ludzie)(palFor(type,v));WG=0;GENTYPE=type;HFL=(FLD[type]||[])[v%5]||0;
  let res=null;
  try{const r=(race&&race!=='ludzie'&&raceGen(type,v,race))||gen(P,v),win=r.win||[],B=deZ(cutHoles(r.B,win.concat(r.holes||[])));if(window.__zfHook)window.__zfHook(B,type);const geo=voxGeo(B,.06);geo.translate(-W0/2*V,0,-D0/2*V);
    let wins=[];if(win.length){const gs=[[],[],[],[]];win.forEach((w,i)=>{const e=Math.min(0.04,w[3]*0.2,w[4]*0.2,w[5]*0.2);gs[(w[6]!=null?w[6]:i)%4].push([w[0]+e,w[1]+e,w[2]+e,w[3]-2*e,w[4]-2*e,w[5]-2*e,'#ffffff'])});wins=gs.filter(g=>g.length).map(g=>{const q=voxGeo(g,0);q.translate(-W0/2*V,0,-D0/2*V);return q})}
    res={geo,wins}}catch(e){console.warn('dom',type,v,e)}
  HFL=0;houseCache.set(key,res);return res;
}
// ===== style budynków ras: elfy, krasnoludy, orkowie (ludzie bez zmian) =====
const RHH={chata:3.2,chalupa:3.6,dom:4,kupiec:4.4,karczma:4.6,dlugi:3.8,kamienica:6.4,podcienia:5.4,wiezaDom:5,rez:8.5};
const RHBIG=new Set(['kupiec','karczma','kamienica','wiezaDom','rez','podcienia']);

function raceWall(g,race){if(race==='ludzie'||!g||(g.userData&&g.userData.raced)||RBASE[race])return g;const fn=race==='elfy'?(r,gg,b)=>{if(Math.max(r,gg,b)-Math.min(r,gg,b)>0.1)return null;const l=(r+gg+b)/3;return[0.72+0.3*l,0.7+0.3*l,0.62+0.3*l]}:race==='krasnoludy'?(r,gg,b)=>{const l=(r+gg+b)/3;return Math.max(r,gg,b)-Math.min(r,gg,b)>0.15?null:[l*0.62,l*0.6,l*0.66]}:(r,gg,b)=>{if(Math.max(r,gg,b)-Math.min(r,gg,b)>0.12)return null;const l=(r+gg+b)/3;return[0.3+0.35*l,0.2+0.24*l,0.12+0.14*l]};return PANIM.__rec(g,fn)}
// ===== szczegółowe generatory budynków ras (format jak ludzkie: woksele, prawdziwe otwory, świecące okna) =====
const RFL={chata:1,chalupa:1,dom:1,kupiec:2,karczma:2,dlugi:1,kamienica:3,podcienia:2,wiezaDom:2,rez:3};
function raceGen0(type,v,race){if(!HT[type])return null;const [,iL,iR,iB,iF,W0,D0]=HT[type],x0=iL,z0=iB,w=W0-iL-iR,d=D0-iB-iF,x1=x0+w,z1=z0+d,cx=x0+w/2,cz=z0+d/2,fl=Math.max(1,(RFL[type]||1)+HFL),big=fl>=2||type==='rez',r=rngOf('rg'+type+v+race),B=[],win=[],holes=[],P=(...b)=>B.push(b),pick=a=>a[Math.floor(r()*a.length)];
  if(race==='elfy'){const ST='#ece8e0',ST2='#d6d0c6',PL=[['#ece2c8','#e2d4b0','#f2e8d2'],['#e8e4d8','#dcd6c6','#f0ece2'],['#f0e0c0','#e6d0a8','#f6eacc']][v%3],TR=['#6a5032','#7a6040','#5a4428'],GD='#c8a85a',LF=[['#3f8a4a','#4a9a50','#5aa858','#367a3e','#6cb860'],['#4a8a6a','#5a9a7a','#3a7a5a','#6aaa8a','#4a9a6a'],['#5a9a3a','#6aaa4a','#4a8a2a','#7aba5a','#5aa04a']][v%3],GL='#a8f0ff',fh=19,H=fl*fh;
    P(x0-4,0,z0-4,w+8,2,d+8,ST);P(x0-4.5,1.4,z0-4.5,w+9,0.6,d+9,ST2);for(let k=0;k<3;k++)P(cx-6+k,0,z1+4+k*1.4,12-2*k,1.6-k*0.5,1.4,ST2);
    P(x0+1,2,z0+1,w-2,H,d-2,PL[0],'d');
    for(let f=0;f<fl;f++){const y=2+f*fh;for(let x=x0+1;x<x1-1;x+=2){const c=PL[(x*7+f)%3];P(x,y,z1-1.6,2,fh,0.7,c,'d');P(x,y,z0+0.9,2,fh,0.7,PL[(x*5+f+1)%3],'d')}for(let z=z0+1;z<z1-1;z+=2){const c=PL[(z*3+f)%3];P(x0+0.9,y,z,0.7,fh,2,c,'d');P(x1-1.6,y,z,0.7,fh,2,PL[(z*11+f)%3],'d')}P(x0+0.4,y+fh-1.2,z0+0.4,w-0.8,1.4,d-0.8,GD);P(x0+0.2,y+fh-1.6,z0+0.2,w-0.4,0.5,d-0.4,TR[1])}
    const pil=(px,pz,hh)=>{for(let y=2,k=0;y<hh;y+=2.6,k++){const o=Math.sin(k*1.3)*0.3;P(px-1.5+o,y,pz-1.5,3,2.6,3,TR[k%3]);if(k%3===1)P(px-1.7+o,y+1,pz-0.4,0.4,0.8,0.8,'#8a7050')}P(px-2.4,2,pz-2.4,4.8,1.4,4.8,TR[2]);P(px-3,2,pz-0.6,1.4,0.8,1.2,TR[2]);P(px+1.6,2,pz-0.6,1.4,0.8,1.2,TR[2]);P(px-2.5,hh,pz-0.5,5,1,1,TR[0]);P(px-0.5,hh,pz-2.5,1,1,5,TR[0]);P(px-3,hh+1,pz-3,2,1.2,2,LF[4]);P(px+1,hh+1,pz+1,2,1.2,2,LF[1])};
    for(const [px,pz] of [[x0+1,z0+1],[x1-1,z0+1],[x0+1,z1-1],[x1-1,z1-1]])pil(px,pz,H+3);if(w>40){pil(cx-12,z1-1,H+2);pil(cx+12,z1-1,H+2)}
    const dw=6,dh=12;holes.push([cx-dw/2,2,z1-1.2,dw,dh,1]);P(cx-dw/2,2,z1-2,dw,dh,0.6,'#6a4a2a');P(cx-0.3,2,z1-1.45,0.6,dh,0.1,'#4a3220');for(const yy of [5,9])P(cx-dw/2,2+yy,z1-1.45,dw,0.4,0.1,'#4a3220');
    P(cx-dw/2-1.2,2,z1-1.5,1.2,dh+1,1.4,TR[1]);P(cx+dw/2,2,z1-1.5,1.2,dh+1,1.4,TR[1]);P(cx-dw/2,2+dh,z1-1.5,dw,1,1.4,TR[1]);P(cx-dw/2+1,3+dh,z1-1.5,dw-2,1,1.4,TR[0]);P(cx-1.2,4+dh,z1-1.5,2.4,1,1.4,GD);P(cx-0.5,5+dh,z1-1.2,1,1,1,GL);
    for(const s of [-1,1]){P(cx+s*(dw/2+3)-0.3,9,z1+1.5,0.6,4,0.6,TR[0]);P(cx+s*(dw/2+3)-0.9,8,z1+1.2,1.8,0.4,1.2,TR[1]);win.push([cx+s*(dw/2+3)-0.75,6,z1+2,1.5,2,1.5]);P(cx+s*(dw/2+3)-0.75,6,z1+2,1.5,2,1.5,GL)}
    for(let f=0;f<fl;f++){const y=2+f*fh;for(const s of (w>34?[-1,1]:[1])){const wx=cx+s*w*(w>34?0.3:0.28);if(f===0&&Math.abs(wx-cx)<dw)continue;win.push([wx-2.5,y+6,z1-1.2,5,6,1]);
        for(const [ax,ay,aw,ah] of [[-3.5,5,7,1],[-3.5,12,7,1],[-3.5,6,1,6],[2.5,6,1,6],[-2.5,4,5,1],[-2.5,13,5,1]])P(wx+ax,y+ay,z1-1.9,aw,ah,1,ay>11?GD:TR[1]);P(wx-0.25,y+6,z1-1.15,0.5,6,0.15,TR[0]);P(wx-2.5,y+8.75,z1-1.15,5,0.5,0.15,TR[0])}
      for(const s of [-1,1]){const zx=s<0?x0+0.2:x1-1.2;win.push([zx,y+6,cz-2.5,1,6,5]);P(s<0?zx-0.8:zx+0.2,y+5,cz-3.5,1.6,1,7,TR[1]);P(s<0?zx-0.8:zx+0.2,y+12,cz-3.5,1.6,1,7,GD)}}
    for(let i=0;i<12;i++){const onF=r()<0.6,x=onF?x0+3+r()*(w-6):(r()<0.5?x0-0.2:x1-0.6),z=onF?z1-0.9:z0+3+r()*(d-6),y=2+r()*H*0.6,len=4+r()*H*0.4;if(onF&&Math.abs(x-cx)<dw)continue;P(x,y,z,onF?0.7:0.8,len,onF?0.5:0.7,'#4a8a3a');for(let k=0;k<3;k++)P(x-0.2+(r()-0.5),y+r()*len,z+(onF?0.3:0),0.8,0.8,0.5,k%2?'#f0a8c8':'#fff4e0')}
    const roof=(rx0,rz0,rw,rd,y,n)=>{let yy=y;for(let i=0;i<n;i++){const ins=i*Math.min(rw,rd)*0.11-4.5;P(rx0+ins+0.5,yy-0.3,rz0+ins+0.5,rw-2*ins-1,1.2,rd-2*ins-1,LF[3]);for(let x=rx0+ins;x<rx0+rw-ins;x+=3)for(let z=rz0+ins;z<rz0+rd-ins;z+=3)P(x,yy+((Math.round(x)*13+Math.round(z)*7)%3)*0.25,z,3.4,1.25,3.4,LF[(Math.round(x)*3+Math.round(z)*5+i)%5]);
        for(const [ax,az] of [[rx0+ins,rz0+ins],[rx0+rw-ins-2,rz0+ins],[rx0+ins,rz0+rd-ins-2],[rx0+rw-ins-2,rz0+rd-ins-2]])P(ax,yy+1,az,2.2,1.8+(n-i)*0.3,2.2,LF[4]);yy+=1.35}
      const tx=rx0+rw/2,tz=rz0+rd/2;P(tx-2.5,yy,tz-2.5,5,1.6,5,LF[2]);P(tx-1.2,yy+1.6,tz-1.2,2.4,1.4,2.4,LF[4]);P(tx-0.5,yy+3,tz-0.5,1,1,1,'#f0a8c8');return yy};
    roof(x0,z0,w,d,H+2,big?4:5);
    if(v===1||v===4){const by=2+fh;P(cx-9,by-1,z1-1,18,1,5,TR[1]);for(let x=cx-9;x<=cx+9;x+=2)P(x,by,z1+3.2,0.6,3,0.6,TR[0]);P(cx-9,by+3,z1+3.2,18,0.6,0.8,GD);for(const s of [-1,1])P(cx+s*8.6-0.5,2,z1+3.2,1,by-3,1,TR[2])}
    if(big||v===3){const tx=v===3?x1-6:x0+5,tz=z0+5,TH=H+(big?24:14);for(let y=2,k=0;y<TH;y+=2.6,k++)for(const [ax,az,aw,ad] of [[-4,-4,8,1.2],[-4,2.8,8,1.2],[-4,-4,1.2,8],[2.8,-4,1.2,8]])P(tx+ax,y,tz+az,aw,2.6,ad,PL[(k+ax*3)%3&3]||PL[0]);P(tx-3,2,tz-3,6,TH-2,6,PL[1]);
      for(let y=10;y<TH-6;y+=10){win.push([tx-1,y,tz+3.6,2,4,1]);P(tx-1.8,y-1,tz+3.4,3.6,1,1.4,GD)}P(tx-4.6,TH,tz-4.6,9.2,1.2,9.2,GD);
      let yy=TH+1.2;for(let i=0;i<7;i++){const s=5-i*0.7;for(let x=-s;x<s;x+=2.4)for(let z=-s;z<s;z+=2.4)P(tx+x,yy,tz+z,2.6,1.4,2.6,LF[(i+Math.round(x+z))%5]);yy+=1.4}P(tx-0.7,yy,tz-0.7,1.4,3,1.4,GL);win.push([tx-0.7,yy,tz-0.7,1.4,3,1.4])}}
  else if(race==='krasnoludy'){const S=[['#76716e','#6a6670','#827c78','#5f5b63'],['#7a746c','#6e685f','#857e74','#625c54'],['#6c6a74','#605e68','#78767f','#56545e']][v%3],SD='#4a4750',DK='#34323a',GD='#d9b23a',RD='#8a2a22',CU='#5a9a7a',FI='#ff8a2e',IR='#3a3a40',WDd='#4a2f1d',fh=17,H=fl*fh;
    P(x0-3,0,z0-3,w+6,3,d+6,DK);P(x0-2.4,3,z0-2.4,w+4.8,1,d+4.8,SD);for(let k=0;k<3;k++)P(cx-6+k,0,z1+3+k*1.4,12-2*k,3-k,1.4,SD);
    P(x0,4,z0,w,H,d,S[0],'d');
    for(let y=4,row=0;y<4+H-0.1;y+=3,row++){let x=x0+(row%2?2.5:0);while(x<x1-0.2){const L2=Math.min(x1-x,4+((Math.round(x)*7+row*3)%4));P(x,y,z1-0.6,L2-0.35,2.65,1,S[(Math.round(x)+row)%4],'d');P(x,y,z0-0.4,L2-0.35,2.65,1,S[(Math.round(x)*3+row)%4],'d');x+=L2}
      let z=z0+(row%2?2:0);while(z<z1-0.2){const L2=Math.min(z1-z,4+((Math.round(z)*5+row)%4));P(x0-0.4,y,z,1,2.65,L2-0.35,S[(Math.round(z)+row*2)%4],'d');P(x1-0.6,y,z,1,2.65,L2-0.35,S[(Math.round(z)*7+row)%4],'d');z+=L2}}
    for(let bx=x0+5;bx<x1-3;bx+=12){if(Math.abs(bx-cx)<7)continue;for(const [zz,dz] of [[z1,1],[z0-3,-1]]){P(bx-2,4,zz,4,H*0.55,3,SD);P(bx-1.5,4+H*0.55,zz+(dz>0?0:1),3,H*0.3,2,SD);P(bx-2.3,4,zz-0.3,4.6,1.2,3.6,DK)}}
    P(x0-1.5,4+H,z0-1.5,w+3,1.5,d+3,SD);P(x0-2.2,5.5+H,z0-2.2,w+4.4,1,d+4.4,S[2]);
    for(let x=x0-2.2;x<x1+2;x+=3){P(x,6.5+H,z0-2.2,2,2.2,1.4,S[1]);P(x,6.5+H,z1+0.8,2,2.2,1.4,S[1])}for(let z=z0;z<z1;z+=3){P(x0-2.2,6.5+H,z,1.4,2.2,2,S[1]);P(x1+0.8,6.5+H,z,1.4,2.2,2,S[1])}
    if(v===2){for(let i=0;i<8;i++){const ins=i*2;if(w-2*ins<4||d-2*ins<4)break;for(let x=x0+ins;x<x1-ins;x+=3)P(x,6.5+H+i*1.6,z0+ins,3.1,1.6,d-2*ins,(i+Math.round(x))%2?SD:S[3])}}
    else for(let x=x0;x<x1;x+=4)for(let z=z0;z<z1;z+=4)P(x,5.9+H,z,3.8,0.5,3.8,((Math.round(x)+Math.round(z))/4)%2?S[3]:SD);
    if(big){const ux=x0+w*0.2,uz=z0+d*0.2,uw=w*0.6,ud=d*0.6,uy=6.5+H,UH=fh*0.8;P(ux,uy,uz,uw,UH,ud,S[1],'d');for(let y=uy;y<uy+UH-1;y+=3)P(ux-0.3,y,uz-0.3,uw+0.6,0.4,ud+0.6,SD);P(ux-1,uy+UH,uz-1,uw+2,1.4,ud+2,S[2]);for(let x=ux-1;x<ux+uw+1;x+=3)P(x,uy+UH+1.4,uz-1,2,2,1.2,S[1]);
      win.push([cx-1,uy+5,uz+ud-0.9,2,6,1]);P(cx-3,uy+UH+3.4,cz-3,6,2,6,S[0]);P(cx-2,uy+UH+5.4,cz-2,4,1,4,GD);P(cx-0.6,uy+UH+6.4,cz-0.6,1.2,2.4,1.2,GD)}
    const dw=8,dh=13;holes.push([cx-dw/2,4,z1-1,dw,dh,1]);P(cx-dw/2,4,z1-1.6,dw,dh,0.6,WDd);for(const yy of [2,6,10])P(cx-dw/2,4+yy,z1-1.05,dw,0.7,0.2,IR);for(let x=cx-dw/2+1;x<cx+dw/2;x+=2)for(const yy of [2.2,6.2,10.2])P(x,4+yy+0.1,z1-0.95,0.4,0.4,0.2,'#8e8994');
    P(cx-dw/2-1.6,4,z1-0.3,1.6,dh,1.6,SD);P(cx+dw/2,4,z1-0.3,1.6,dh,1.6,SD);for(let k=-6;k<=6;k++)P(cx+k-0.5,4+dh+(Math.abs(k)<4?1:Math.abs(k)<6?0.5:0),z1-0.3,1,2,1.6,k%2?S[2]:SD);P(cx-1,4+dh+1,z1+0.4,2,2.6,1.2,GD);
    P(cx-2,4+dh+3.2,z1-0.1,4,4,1.2,S[2]);P(cx-1.3,4+dh+5.4,z1+1.05,0.8,0.6,0.2,DK);P(cx+0.5,4+dh+5.4,z1+1.05,0.8,0.6,0.2,DK);P(cx-1.6,4+dh+3,z1+0.9,3.2,1.8,0.6,S[0]);P(cx-0.4,4+dh+4.6,z1+1.05,0.8,0.8,0.3,S[3]);
    P(x0,4+H*0.72,z1+0.4,w,0.8,0.3,GD);for(let x=x0+2;x<x1-1;x+=4)P(x,4+H*0.72,z1+0.65,0.8,0.8,0.2,RD);
    for(let f=0;f<fl;f++){const y=4+f*fh;for(const s of [-1,1]){const wx=cx+s*w*0.3;win.push([wx-1,y+5,z1-1,2,6,1]);for(let k=0;k<3;k++)P(wx-1+k*0.8,y+5,z1+0.45,0.25,6,0.25,IR);P(wx-1.8,y+11,z1+0.4,3.6,1,0.8,GD);P(wx-1.8,y+4.2,z1+0.4,3.6,0.8,0.8,SD)}
      for(const s of [-1,1]){const zx=s<0?x0-0.2:x1-0.8;win.push([zx,y+5,cz-1,1,6,2])}}
    for(const s of [-1,1])P(s<0?x0-1.2:x1+0.2,4,z1+0.2,1,H+2,1,CU),P(s<0?x0-1.6:x1-0.2,4+H+1,z1-0.2,1.8,1,1.8,CU);
    const chx=x0+w*0.75,chz=z0+d*0.3;P(chx,6.5+H,chz,4,10,4,DK);P(chx-0.4,16.5+H,chz-0.4,4.8,0.8,4.8,SD);P(chx+0.8,16.6+H,chz+0.8,2.4,0.6,2.4,FI);win.push([chx+0.8,16.6+H,chz+0.8,2.4,0.6,2.4]);
    for(const s of [-1,1]){P(cx+s*8-1.2,4,z1+3.5,2.4,3,2.4,DK);P(cx+s*8-1.5,7,z1+3.2,3,0.6,3,IR);P(cx+s*8-0.8,7.6,z1+3.9,1.6,1,1.6,FI);win.push([cx+s*8-0.8,7.6,z1+3.9,1.6,1,1.6])}
    if(v===4||type==='kupiec'){P(x1-6,4,z1+3,4,2.4,2,IR);P(x1-6.6,6.4,z1+3,5.2,0.8,2,IR);P(x1-4.5,4,z1+2.4,1.2,2.4,3.2,DK)}
    if(v===1){const tx=x0+3,tz=z1-3;for(let y=4,k=0;y<4+H+12;y+=3,k++)P(tx-4,y,tz-4,8,3,8,S[k%4]);P(tx-5,4+H+12,tz-5,10,1.4,10,SD);for(const [a,b] of [[-5,-5],[3.6,-5],[-5,3.6],[3.6,3.6]])P(tx+a,5.4+H+12,tz+b,1.4,2,1.4,S[1]);win.push([tx-1,H*0.6,tz+3.8,2,5,1])}}
  else if(race==='orkowie'){const LG=['#5a3a22','#4a2f1d','#6a4428','#553620'],BK='#3a2414',HD=['#8a6a4a','#7a5a3a','#9a7650','#6e5236','#a88a62'],SW=['#7a5a30','#8a6a38','#6a4a26','#94743e'],BN='#e8e0c8',RD='#a8302a',FI='#ff8a2e',fh=16,H=fl*fh*0.8,rx=w/2,rz=d/2;
    P(x0-3,0,z0-3,w+6,1.5,d+6,'#5a4630');for(let i=0;i<10;i++)P(x0-3+r()*(w+4),1.4,z0-3+r()*(d+4),1+r()*2,0.3,1+r()*2,'#4a3a26');
    P(x0+2,1.5,z0+2,w-4,H,d-4,HD[0],'d');
    for(let i=0;i<22;i++){const front=r()<0.55,pw=4+r()*4,ph=3+r()*4,px=x0+3+r()*(w-6-pw),py=2+r()*(H-ph-1),pz=r()<0.5?z1-2.6:z0+2;if(front&&Math.abs(px+pw/2-cx)<6&&py<12&&pz>cz)continue;P(px,py,pz,pw,ph,0.6,HD[i%5],'d');P(px,py+ph-0.3,pz+(pz>cz?0.45:-0.05),pw,0.3,0.2,BK);for(let s2=px+0.6;s2<px+pw;s2+=1.2)P(s2,py+ph/2,pz+(pz>cz?0.5:-0.1),0.3,0.6,0.15,BK)}
    const n=Math.round(Math.PI*(rx+rz)/2.6);for(let i=0;i<n;i++){const a=i/n*Math.PI*2,px=cx+Math.cos(a)*rx,pz=cz+Math.sin(a)*rz;if(Math.sin(a)>0.93)continue;const hh=H+2+((i*5)%3)*1.2;P(px-1.2,1.5,pz-1.2,2.4,hh,2.4,LG[i%4]);P(px-1.35,1.5+hh*0.3,pz-1.35,2.7,0.6,2.7,BK);P(px-1.35,1.5+hh*0.75,pz-1.35,2.7,0.5,2.7,BK);P(px-0.7,1.5+hh,pz-0.7,1.4,1.2,1.4,LG[(i+1)%4]);P(px-0.3,2.7+hh,pz-0.3,0.6,0.8,0.6,'#9a7a5a');if(i%3===0)P(px-1.3,1.5+hh*0.5,pz-0.3,0.3,0.6,0.6,'#2a1a10')}
    const RT=H+1.5;for(let i=0;i<6;i++){const s=1-i*0.16,R1=(rx+3.5)*s,R2=(rz+3.5)*s,m=Math.max(8,Math.round(2*Math.PI*Math.max(R1,R2)/2.4)),y=RT+i*2.1;P(cx-R1*0.78,y,cz-R2*0.78,R1*1.56,2.2,R2*1.56,SW[i%4]);for(let j=0;j<m;j++){const a=j/m*Math.PI*2;P(cx+Math.cos(a)*R1-1.4,y-((j*7)%3)*0.3,cz+Math.sin(a)*R2-1.4,2.8,2.5,2.8,SW[(i+j)%4])}P(cx-R1*0.8,y+1.9,cz-R2*0.8,R1*1.6,0.35,R2*1.6,BK)}
    const top=RT+12.6;P(cx-0.5,top,cz-0.5,1,7,1,BK);P(cx+1,top,cz-0.2,0.6,5,0.6,BK);P(cx-1.3,top+6.5,cz-1.3,2.6,2.3,2.6,BN);P(cx-0.9,top+7.6,cz+1.25,0.7,0.6,0.1,'#141414');P(cx+0.2,top+7.6,cz+1.25,0.7,0.6,0.1,'#141414');P(cx-3.4,top+7.8,cz-0.4,2.2,0.8,0.8,BN);P(cx+1.2,top+7.8,cz-0.4,2.2,0.8,0.8,BN);P(cx-3.8,top+8.4,cz-0.3,0.6,1.2,0.6,BN);P(cx+3.2,top+8.4,cz-0.3,0.6,1.2,0.6,BN);
    for(const c2 of ['#d8302a','#3a3a3a','#e8e0c8'])P(cx+1.2+r(),top+4,cz+0.2,0.25,1.6,0.8,c2);
    holes.push([cx-3.5,1.5,z1-2.5,7,11,1]);P(cx-3.5,1.5,z1-3,3.4,11,0.4,HD[3]);P(cx-3.6,12.2,z1-2.6,7.2,0.6,0.6,BK);
    for(let k=0;k<6;k++){const off=4.8-k*0.62,yy=1.5+k*2.3;P(cx-off-0.7,yy,z1+0.4,1.4,2.5,1.4,BN);P(cx+off-0.7,yy,z1+0.4,1.4,2.5,1.4,BN)}P(cx-1.6,15.3,z1+0.2,3.2,2.6,2.6,BN);P(cx-1.1,16.2,z1+2.75,0.8,0.7,0.1,'#141414');P(cx+0.3,16.2,z1+2.75,0.8,0.7,0.1,'#141414');P(cx-3.2,16.8,z1+1,1.8,0.7,0.7,BN);P(cx+1.4,16.8,z1+1,1.8,0.7,0.7,BN);
    for(const s of [-1,1]){const sx=cx+s*w*0.32,sy=H*0.55;P(sx-2,sy-1.5,z1+0.2,4,3,0.5,RD);P(sx-1.5,sy-2,z1+0.2,3,4,0.5,RD);P(sx-0.4,sy-0.4,z1+0.7,0.8,0.8,0.3,BN);P(sx-2,sy-0.2,z1+0.65,4,0.4,0.15,'#e8e0c8')}
    const fx=cx+(v%2?-10:10),fz=z1+6;if(fx>-2&&fx<W0+2){for(let k=0;k<6;k++){const a=k/6*Math.PI*2;P(fx+Math.cos(a)*2-0.6,1.5,fz+Math.sin(a)*2-0.6,1.2,0.9,1.2,'#6a6670')}P(fx-1.2,1.6,fz-1.2,2.4,0.8,2.4,FI);win.push([fx-1.2,1.6,fz-1.2,2.4,0.8,2.4]);P(fx-0.2,2.4,fz-0.8,0.4,2,0.4,BK)}
    {const rx2=cx+(v%2?10:-10),rz2=z1+5;if(rx2>0&&rx2<W0){for(const s of [-1,1])P(rx2+s*2.5-0.3,1.5,rz2-0.3,0.6,6,0.6,BK);P(rx2-3,7,rz2-0.3,6,0.5,0.6,BK);P(rx2-2.2,3.2,rz2-0.1,4.4,3.8,0.2,HD[4])}}
    if(big||v===2){const tx=x0+3,tz=z0+3;for(let y=1.5,k=0;y<RT+16;y+=3,k++){P(tx-1.6,y,tz-1.6,3.2,3,3.2,k%3===1?RD:LG[k%4]);if(k%3===1){P(tx-0.9,y+1.6,tz+1.55,0.6,0.5,0.1,'#f0e8d8');P(tx+0.3,y+1.6,tz+1.55,0.6,0.5,0.1,'#f0e8d8');P(tx-0.8,y+0.5,tz+1.55,1.6,0.4,0.1,'#141414')}}P(tx-5,RT+15,tz-0.5,10,1,1,LG[0]);P(tx-6,RT+14,tz-0.6,1.6,2.4,1.2,RD);P(tx+4.4,RT+14,tz-0.6,1.6,2.4,1.2,RD)}
    win.push([cx-1.5,H*0.6,z0+1.5,3,1.2,1])}
  else return null;return{B,win,holes}}
function raceInterior(L,race){if(race==='niziolki'||race==='drowy'||race==='saurianie'){try{raceInterior2(L,race)}catch(e){console.warn('wnętrze',e)}return}if(RBASE[race])race=RBASE[race];if(!race||race==='ludzie')return;const M={elfy:{'#ece2c6':'#e8dcbc','#8a6240':'#d8c8a0','#7e5838':'#cbb890','#4a2f1d':'#7a6040','#5a3a22':'#4a8a4a','#7a5030':'#b8a070'},krasnoludy:{'#ece2c6':'#6f6a73','#8a6240':'#5d5a63','#7e5838':'#55525a','#4a2f1d':'#3a3840','#5a3a22':'#4a4750','#7a5030':'#6a6670'},orkowie:{'#ece2c6':'#8a6a4a','#8a6240':'#6a5030','#7e5838':'#5e4628','#4a2f1d':'#3a2414','#5a3a22':'#7a5a30','#7a5030':'#5a3a22'}}[race];if(!M)return;for(const b of L)if(M[b[6]])b[6]=M[b[6]];
  const W=12,Dd=10;if(race==='elfy')for(const [x,z] of [[-4.6,-3.6],[4.6,-3.6]])L.push([x,0.4,z,0.8,0.8,0.8,'#6a4a2a'],[x,1.2,z,1.2,1,1.2,'#4a9a50'],[x,2.6,z,0.3,0.4,0.3,'#a8f0ff']);
  if(race==='krasnoludy')L.push([-4.6,0.5,-3.6,1,1,1,'#34323a'],[-4.6,1.1,-3.6,0.7,0.3,0.7,'#ff8a2e'],[4,0.4,-3.6,1.4,0.8,0.7,'#3a3a40'],[4,0.9,-3.6,1.8,0.3,0.7,'#3a3a40']);
  if(race==='orkowie')L.push([-4.6,2.4,-4.3,1,1,0.6,'#e8e0c8'],[-5.2,2.7,-4.3,0.6,0.3,0.3,'#e8e0c8'],[-4,2.7,-4.3,0.6,0.3,0.3,'#e8e0c8'],[4.4,1.6,-4.4,2,2.4,0.15,'#8a6a4a'],[0,0.05,-2,2.4,0.1,1.6,'#6a4a2a'])}
// rdzeń budynku (do kolizji i drzwi) w jednostkach świata, względem środka działki
function houseCore(h){const [,iL,iR,iB,iF,W0,D0]=HT[h.type],k=V*BS;return{w:(W0-iL-iR)*k,d:(D0-iB-iF)*k,ox:(iL-iR)/2*k,oz:(iB-iF)/2*k,front:(D0/2-iF)*k,pw:W0*k,pd:D0*k}}

const decoMat=matV;


// ---------- postać ----------
