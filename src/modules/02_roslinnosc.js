// =================== ROŚLINNOŚĆ v2: wyższe drzewa, korony bez nachodzenia ścian, korony do stania ===================
// TREETOP[typ] = [[cx,cz,półszerokość,wierzch]] w voxelach (1/16 bloku przed skalą TS) — po tych płaszczyznach można chodzić
const TREETOP={},TRUNK={};
function vegGeo(list,eps){const bk=list.__bk;const B=deZ(list,eps||.55);if(!bk)return voxGeo(B,.06);
  /* kora dokładana po deZ pnia (żeby pień już się nie przesuwał), listwy kory mają własne, drobne deZ */
  const S=[];for(const k of bk)barkify(B,k[0],k[1],k[2],S);const all=B.concat(deZ(S));all.__dz=1;return voxGeo(all,.06)}
// ===== kora drzew (v85): wypukłe listwy i płytki kory na pniach, inny wzór dla każdego gatunku =====
// ===== faktura powierzchni struktur (v86): kamień, kość, drewno, lód, kryształ, glina, metal =====
function surfTex(G,cols,st,seed,cap){cap=cap||260;const r=mulb(seed||9),R=(a,b)=>a+r()*(b-a),out=[],sh=(c,k,h)=>barkShade(c,k,h);
  for(const b of G.slice()){const [x,y,z,w,h,d,c]=b;if(typeof c!=='string'||!cols.includes(c))continue;
    for(let f=0;f<5;f++){// 0:+x 1:-x 2:+z 3:-z 4:+y
      const U=f<2?d:w,V=f<4?h:d,u0=f<2?z:x,v0=f<4?y:z;if(U<1.6||V<1.6||U*V<8)continue;
      const put=(u,v,uw,vh,t,col)=>{uw=Math.min(uw,U-0.2);vh=Math.min(vh,V-0.2);if(uw<0.12||vh<0.12)return;u=Math.max(u0+0.1,Math.min(u0+U-0.1-uw,u));v=Math.max(v0+0.1,Math.min(v0+V-0.1-vh,v));
        if(f===0)out.push([x+w-0.05,v,u,t+0.05,vh,uw,col]);else if(f===1)out.push([x-t,v,u,t+0.05,vh,uw,col]);else if(f===2)out.push([u,v,z+d-0.05,uw,vh,t+0.05,col]);else if(f===3)out.push([u,v,z-t,uw,vh,t+0.05,col]);else out.push([u,y+h-0.05,v,uw,t+0.05,vh,col])};
      const A=U*V,n=k=>Math.min(k*3,Math.max(1,Math.round(A/k)));
      if(st==='stone'){for(let i=0;i<n(9);i++){const uw=R(0.8,Math.min(3.5,U*0.5)),vh=R(0.6,Math.min(2.6,V*0.4));put(R(u0,u0+U),R(v0,v0+V),uw,vh,R(0.14,0.3),sh(c,r()<0.55?R(1.06,1.16):R(0.82,0.92)))}
        if(f<4&&V>6)for(let i=0;i<Math.max(1,Math.round(U/8));i++){let u=R(u0+1,u0+U-1),v=R(v0,v0+V*0.4);for(let s=0;s<4&&v<v0+V-1;s++){const l=R(1.5,4);put(u,v,0.3,l,0.1,sh(c,0.55));u+=R(-0.8,0.8);v+=l}}
        if(f===4&&r()<0.5)put(R(u0,u0+U),R(v0,v0+V),R(1,3),R(1,3),0.3,r()<0.5?'#5a7a3a':'#6a8a42')}
      else if(st==='bone'){for(let i=0;i<n(5);i++){const s2=R(0.25,0.55);put(R(u0,u0+U),R(v0,v0+V),s2,s2,0.08,sh(c,0.72))}
        for(let i=0;i<n(16);i++)put(R(u0,u0+U),R(v0,v0+V),R(1,3),R(0.8,2.4),0.12,sh(c,R(0.88,0.94),[1.02,1,0.9]));
        if(V>4&&r()<0.7){let u=R(u0+0.5,u0+U-0.5),v=R(v0,v0+V*0.5);for(let s=0;s<3;s++){const l=R(1,3);put(u,v,0.18,l,0.08,sh(c,0.5));u+=R(-0.6,0.6);v+=l}}}
      else if(st==='wood'){const along=f<4?(V>=U):(d>=w);const nL=Math.max(1,Math.round((along?U:V)/1.1));
        for(let i=0;i<nL;i++){let p=R(0,2);const L2=along?V:U;while(p<L2-0.5){const l=R(L2/6,L2/2.5),dk=r()<0.5,pos=(i+0.5)*(along?U:V)/nL;
          if(along)put(u0+pos-0.15,v0+p,0.3,l,dk?0.08:0.14,sh(c,dk?0.72:1.14));else put(u0+p,v0+pos-0.15,l,0.3,dk?0.08:0.14,sh(c,dk?0.72:1.14));p+=l+R(0.4,2)}}
        if(A>20&&r()<0.6){const s2=R(0.6,1);put(R(u0,u0+U),R(v0,v0+V),s2,s2,0.16,sh(c,0.6))}}
      else if(st==='ice'){if(f<4)for(let i=0;i<Math.max(1,Math.round(U/1.6));i++)put(R(u0,u0+U),R(v0,v0+V*0.3),R(0.2,0.45),R(V*0.3,V*0.8),R(0.08,0.16),r()<0.6?'#f8fdff':'#b8dcee');
        for(let i=0;i<n(10);i++)put(R(u0,u0+U),R(v0,v0+V),R(0.6,1.6),R(0.6,1.6),0.1,'#ffffff')}
      else if(st==='crystal'){if(f<4){put(u0+0.12,v0+0.4,Math.max(0.25,U*0.12),V-0.8,0.12,sh(c,1.35));put(u0+U*0.35,v0+V*0.15,U*0.3,V*0.55,0.08,sh(c,0.82));for(let i=0;i<Math.round(V/7);i++)put(u0+0.2,R(v0,v0+V),U-0.4,0.18,0.06,'#ffffff')}}
      else if(st==='clay'){for(let i=0;i<n(6);i++){const s2=R(0.4,0.9);put(R(u0,u0+U),R(v0,v0+V),s2,s2*R(0.6,1),0.1,'#3a2014')}for(let i=0;i<n(8);i++)put(R(u0,u0+U),R(v0,v0+V),R(1,2.6),R(0.8,1.8),R(0.2,0.45),sh(c,R(0.9,1.12)))}
      else if(st==='metal'){for(let i=0;i<n(3);i++){const s2=R(0.15,0.4);put(R(u0,u0+U),R(v0,v0+V),s2*R(1,2),s2,0.04,r()<0.6?'#8a4a24':'#a8603a')}if(r()<0.6)put(R(u0,u0+U),R(v0,v0+V),R(0.1,0.2),R(1,3),0.03,sh(c,1.25))}}}
  while(out.length>cap)out.splice(Math.floor(r()*out.length),1);G.push(...out);return G}
function barkShade(hex,k,hue){const c=new THREE.Color(hex);c.r=Math.min(1,c.r*k*(hue?hue[0]:1));c.g=Math.min(1,c.g*k*(hue?hue[1]:1));c.b=Math.min(1,c.b*k*(hue?hue[2]:1));return '#'+c.getHexString()}
function barkify(L,cols,st,seed,dst){if(!dst){(L.__bk=L.__bk||[]).push([cols,st,seed]);return L}const r=mulb(seed||7),out=dst,R=(a,b)=>a+r()*(b-a);
  for(const b of L){const [x,y,z,w,h,d,c]=b;if(!cols.includes(c)||Math.min(w,d)<2.2||h<Math.max(w,d)*(st==='smooth'?0.6:1.05))continue;
    for(let f=0;f<4;f++){const W=f<2?d:w,a0=f<2?z:x;
      // listwa na ścianie f: u = pozycja wzdłuż ściany, v = wysokość, t = grubość (na zewnątrz), uw = szerokość
      const put=(u,uw,v,vh,t,col)=>{u=Math.max(a0+0.15,Math.min(a0+W-0.15-uw,u));v=Math.max(y+0.4,v);vh=Math.min(vh,y+h-0.3-v);if(vh<0.25||uw<0.15)return;
        if(f===0)out.push([x+w-0.06,v,u,t+0.06,vh,uw,col]);else if(f===1)out.push([x-t,v,u,t+0.06,vh,uw,col]);else if(f===2)out.push([u,v,z+d-0.06,uw,vh,t+0.06,col]);else out.push([u,v,z-t,uw,vh,t+0.06,col])};
      if(st==='furrow'){// dąb, klon, akacja, drzewa dżungli: pionowe bruzdy (ciemne) i grzbiety (jasne)
        const n=Math.max(2,Math.round(W/1.5));for(let i=0;i<n;i++){const u=a0+(i+0.5)*W/n+R(-0.3,0.3);let v=y+R(0.4,2.5);while(v<y+h-1.5){const sl=R(h/9,h/4.5),dark=r()<0.5;
          put(u-(dark?0.25:0.38),dark?0.5:0.76,v,sl,dark?0.18:0.4,dark?barkShade(c,0.68):barkShade(c,r()<0.5?1.14:1.24));v+=sl+R(0.6,h/10)}}}
      else if(st==='plate'){// sosna, sekwoja: łuskowate płyty kory przesunięte rzędami
        const ph=Math.max(2.4,Math.min(9,h/13));let row=0;for(let v=y+R(0.2,1);v<y+h-1;v+=ph,row++){const n=Math.max(2,Math.round(W/(W>8?3:1.9))),pw=W/n;
          for(let i=0;i<n;i++){if(r()<0.18)continue;const u=a0+i*pw+(row%2?pw*0.5:0)-(row%2&&i===n-1?pw*0.5:0);put(u+0.18,pw-0.36,v+0.15,ph*R(0.7,0.92),R(0.25,0.45),barkShade(c,R(1.05,1.3),[1.06,1,0.92]))}}}
      else if(st==='birch'||st==='lent'){// brzoza: czarne poziome przetchlinki; wiśnia: jasne paski przetchlinek na ciemnej, lśniącej korze
        for(let v=y+R(0.5,1.5);v<y+h-0.8;v+=R(1.4,2.6)){const k=1+(r()<0.45?1:0);for(let j=0;j<k;j++){const uw=R(0.7,Math.min(2.2,W*0.5));put(R(a0,a0+W-uw),uw,v,R(0.18,0.3),0.12,st==='birch'?(r()<0.7?'#3a3836':'#6a6660'):barkShade(c,r()<0.6?1.7:0.7,[1,0.95,0.92]))}}
        if(st==='lent')for(let v=y+R(3,6);v<y+h-2;v+=R(7,12))put(a0+0.1,W-0.2,v,0.35,0.16,barkShade(c,1.25));
        else for(let k=0;k<2;k++)if(r()<0.6){const uw=R(0.8,1.6);put(R(a0,a0+W-uw),uw,R(y+2,y+h-4),R(1,2.4),0.2,'#f8f4ec')}}
      else if(st==='palm'){// palma: blizny po liściach – romby przy każdym pierścieniu
        const k=Math.max(1,Math.round(W/2.4));for(let i=0;i<k;i++){const u=a0+(i+0.5)*W/k;put(u-0.7,1.4,y+h*0.35,0.5,0.2,barkShade(c,0.75));put(u-0.4,0.8,y+h*0.35+0.5,0.5,0.25,barkShade(c,1.18));put(u-0.4,0.8,y+h*0.35-0.5,0.5,0.25,barkShade(c,0.88))}}
      else if(st==='smooth'){// baobab: gładka kora w szerokich, miękkich fałdach i zmarszczkach
        const n=Math.max(2,Math.round(W/3));for(let i=0;i<n;i++){const u=a0+(i+0.5)*W/n+R(-0.6,0.6),uw=R(1.2,2.4);put(u-uw/2,uw,y+R(0,1.5),h*R(0.55,0.95),R(0.2,0.4),barkShade(c,r()<0.5?1.08:0.9))}
        for(let k=0;k<2;k++){const uw=R(2,W*0.6);put(R(a0,a0+W-uw),uw,R(y+1,y+h-2),0.3,0.18,barkShade(c,0.8))}}}}
  return L}
function leafBlob(L,tops,cx,cy,cz,r,h,cA,cB,cT,cU){
  const q=r*.62;
  L.push([cx-r,cy,cz-r,2*r,h,2*r,cA]);
  L.push([cx-r-2.3,cy+1.4,cz-q,2*r+4.6,h-2.9,2*q,cB]);
  L.push([cx-q,cy+1.7,cz-r-2.3,2*q,h-3.3,2*r+4.6,cB]);
  L.push([cx-q-.4,cy+h,cz-q-.4,2*q+.8,2.4,2*q+.8,cT]);
  L.push([cx-r*.7,cy-1.7,cz-r*.7,1.4*r,1.7,1.4*r,cU]);
  tops.push([cx,cz,r,cy+h],[cx,cz,q+.4,cy+h+2.4]);
}
{
  const G1='#356a2c',G2='#3f7834',G3='#4a8a3a',G4='#62a447',GU='#2a5225';
  // dąb
  let L=[],T=[];
  L.push([-3.6,0,-3.6,7.2,47,7.2,'#6b4528'],[-6.4,0,-1.7,12.8,2.7,3.4,'#5a3a22'],[-1.7,0,-6.4,3.4,2.7,12.8,'#5a3a22'],[-5,0,-5,10,1.4,10,'#4d3220'],
    [-3.9,7,-1.1,.5,7,2.2,'#4a2f1d'],[3.4,15,.6,.5,6,2,'#4a2f1d'],[-1.2,21,3.4,2.4,6,.5,'#4a2f1d'],[1,30,-3.9,2,5,.5,'#4a2f1d'],
    [3.1,27,-1.3,10.5,2.6,2.6,'#6b4528'],[11,27.5,-1.4,2.8,8.5,2.8,'#62402a'],[-13.4,31,-1.2,10.2,2.4,2.4,'#6b4528'],[-1.3,23.5,3.1,2.6,2.6,9.6,'#62402a'],[-1.1,33,-12.6,2.2,2.2,9.4,'#6b4528']);
  leafBlob(L,T,0,37,0,17,13,G1,G2,G3,GU);
  leafBlob(L,T,13.3,33.4,4.2,9.2,9.3,G2,G3,G4,GU);
  leafBlob(L,T,-14.2,36.3,-5.3,10.1,9.1,G1,G2,G3,GU);
  leafBlob(L,T,3.4,32.6,-14.1,8.9,8.4,G2,G3,G4,GU);
  leafBlob(L,T,-4.3,34.8,13.2,9.3,8.2,G2,G3,G4,GU);
  leafBlob(L,T,1.1,51.6,-.9,12.2,9.6,G3,G3,G4,G2);
  leafBlob(L,T,-.8,62.4,1.3,7.1,6.8,G4,G4,'#7cbc58',G3);
  L.push([7.3,49.2,6.1,4.3,2.1,4.4,'#86c75a'],[-11.2,46.7,-9.6,5.2,2,4.6,'#86c75a'],[-15.3,45.8,4.4,4.1,2.1,5.3,'#62a447']);
  barkify(L,['#6b4528','#62402a'],'furrow',11);OBJGEO.oak=vegGeo(L);TREETOP.oak=T;TRUNK.oak=[0.45,47,72];
  // sosna
  L=[];T=[];L.push([-2.3,0,-2.3,4.6,26,4.6,'#5a3a22'],[-4.2,0,-1.3,8.4,2.2,2.6,'#4d3220'],[-1.3,0,-4.2,2.6,2.2,8.4,'#4d3220']);
  const PC=['#1f4a2a','#245230','#2a5c36','#30663c','#377244','#3e7e4c','#4a8c56','#5c9e64'];
  [[17.2,12],[15.1,19.6],[13,27.1],[11.1,34.7],[9.1,42.2],[7.2,49.8],[5.1,57.3],[3.1,64.9]].forEach(([r,y],k)=>{
    L.push([-r,y,-r,2*r,8.7,2*r,PC[k]]);const q=r*.55;L.push([-r-1.9,y+1.3,-q,2*r+3.8,3.1,2*q,PC[Math.min(7,k+1)]],[-q,y+1.5,-r-1.9,2*q,3.3,2*r+3.8,PC[Math.min(7,k+1)]]);
    L.push([-r+.6,y-1.2,-r+.6,2*r-1.2,1.2,2*r-1.2,'#183d22']);T.push([0,0,r,y+8.7])});
  L.push([-1.4,73.4,-1.4,2.8,4.5,2.8,'#6bb070']);T.push([0,0,1.4,77.9]);
  barkify(L,['#5a3a22'],'plate',12);OBJGEO.pine=vegGeo(L);TREETOP.pine=T;TRUNK.pine=[0.36,30,78];
  // sosna w śniegu
  L=L.slice();barkify(L,["#5a3a22"],"plate",12);const ST=T.slice();
  [[17.2,12],[15.1,19.6],[13,27.1],[11.1,34.7],[9.1,42.2],[7.2,49.8],[5.1,57.3],[3.1,64.9]].forEach(([r,y])=>{L.push([-r+.3,y+8.7,-r+.3,2*r-.6,1.3,2*r-.6,'#eef3f6~'])});
  L.push([-1.1,77.9,-1.1,2.2,1.6,2.2,'#f4f8fa~']);
  OBJGEO.snowpine=vegGeo(L);TREETOP.snowpine=ST.map(t=>[t[0],t[1],t[2],t[3]+1.3]);TRUNK.snowpine=TRUNK.pine;
  // brzoza
  L=[];T=[];L.push([-1.9,0,-1.9,3.8,52,3.8,'#ece8e0'],[-2.4,0,-2.4,4.8,1.6,4.8,'#c9c2b4']);
  for(let k=0;k<9;k++){const y=3+k*5.4,s=k%4;L.push(s===0?[-2.05,y,-.9,.3,1.3,1.8,'#2a2a2a']:s===1?[1.75,y,-1.2,.3,1.1,2.1,'#2a2a2a']:s===2?[-1,y,1.75,2,1.2,.3,'#2a2a2a']:[-.6,y,-2.05,1.7,1.1,.3,'#2a2a2a'])}
  L.push([1.6,30,-.9,8.5,1.8,1.8,'#e2ddd2'],[-9.6,36,-.8,8.1,1.6,1.6,'#e2ddd2']);
  const B1='#6fa844',B2='#7ab04a',B3='#86bc56',B4='#9ccc66';
  leafBlob(L,T,.4,33.2,-.3,11.4,10.3,B1,B2,B3,'#557f35');
  leafBlob(L,T,8.3,40.4,2.6,7.3,8.2,B2,B3,B4,B1);
  leafBlob(L,T,-7.6,43.3,-3.4,7.6,8.1,B2,B3,B4,B1);
  leafBlob(L,T,-.6,51.1,.7,7.2,8.6,B3,B3,B4,B2);
  leafBlob(L,T,.3,61.6,-.4,4.1,5.2,B4,B4,'#b2dc7a',B3);
  barkify(L,['#ece8e0'],'birch',13);OBJGEO.birch=vegGeo(L);TREETOP.birch=T;TRUNK.birch=[0.3,52,69];
  // palma (v151): smukły wygięty pień z pierścieniami, gęsta korona opadających pierzastych liści, suche liście pod koroną, kokosy
  L=[];T=[];{const NS=9;let px=0;for(let k=0;k<NS;k++){const t=k/(NS-1),w=5.0-t*1.5,x=-2.6+3.6*t*t,y=k*6.6;px=x;L.push([x-w/2+2.3,y,-w/2,w,6.7,w,k%2?'#8a6a44':'#7a5a3a'],[x-w/2+2.05,y+5.9,-w/2-0.25,w+0.5,0.9,w+0.5,'#5e4630'])}
  const tx=px+2.3,ty=NS*6.6-1;L.push([tx-2.9,ty-1.2,-2.9,5.8,3.6,5.8,'#5a3a22'],[tx-2.2,ty+2.2,-2.2,4.4,1.6,4.4,'#4a7a30']);
  for(const [cx,cz] of [[1.6,1.2],[-1.8,0.9],[0.3,-2.0],[-0.4,1.9]])L.push([tx+cx-1.1,ty-3.2,cz-1.1,2.2,2.2,2.2,'#6b4a26']);
  const FR=['#2f6a2c','#3a7a32','#468a3a','#559a42','#68ac4c'],DRY='#9a7a42';
  const blk=(x,y,z,w,h,d,c)=>L.push([x-w/2,y,z-d/2,w,h,d,c]);
  for(let a=0;a<11;a++){const an=a*2*Math.PI/11+(a%2)*0.12,dx=Math.sin(an),dz=Math.cos(an),lift=(a%3)*0.8,len=20+(a%4)*1.6;
    for(let st=0;st<9;st++){const d=2+st*len/8,f=st/8,y=ty+2.4+lift+5.2*Math.sin(Math.min(1,f*1.6)*Math.PI*0.5)-f*f*11,x=tx+dx*d,z=dz*d,c=FR[Math.min(4,Math.floor(f*5))];
      blk(x,y,z,1.7,1.0,1.7,darker(c,0.85));const lw=(1-Math.abs(f-0.45)*1.3)*4.8;if(lw>0.8){const px2=-dz,pz2=dx;for(const sg of [-1,1])for(let q=1;q<=Math.min(3,Math.ceil(lw/1.5));q++){const o=q*1.45;blk(x+px2*o*sg+dx*0.6,y-0.3-q*0.42,z+pz2*o*sg+dz*0.6,2.3,0.6,2.3,c)}}}}
  for(let a=0;a<5;a++){const an=a*1.26+0.4,dx=Math.sin(an),dz=Math.cos(an);for(let st=0;st<5;st++){const d=2+st*1.8;blk(tx+dx*d,ty-1.5-st*2.2,dz*d,1.4,2.2,1.4,st%2?DRY:darker(DRY,0.85))}}
  T.push([tx,0,3.4,ty+2.6]);barkify(L,['#8a6a44','#7a5a3a'],'palm',14);OBJGEO.palm=vegGeo(L,0.07);TREETOP.palm=T;TRUNK.palm=[0.3,58,61];}
  // kaktus: żebrowany pień, ramiona, kolce, kwiat
  L=[];{const G1='#3f7034',G2='#4f8a3e',G3='#5e9a48',SP='#f0e8c8';
    const col=(x0,y0,z0,w,h,ribs)=>{L.push([x0,y0,z0,w,h,w,G2]);for(let k=0;k<ribs;k++){const t=(k+0.5)/ribs*w;L.push([x0+t-0.35,y0,z0-0.4,0.7,h,0.5,k%2?G3:G1],[x0+t-0.35,y0,z0+w-0.1,0.7,h,0.5,k%2?G1:G3],[x0-0.4,y0,z0+t-0.35,0.5,h,0.7,k%2?G3:G1],[x0+w-0.1,y0,z0+t-0.35,0.5,h,0.7,k%2?G1:G3])}
      for(let y=y0+2;y<y0+h-1;y+=3.2)for(let k=0;k<ribs;k++){const t=(k+0.5)/ribs*w,o=(Math.floor(y)+k)%2?1.2:0;L.push([x0+t-0.15,y+o,z0-0.75,0.3,0.3,0.4,SP],[x0+t-0.15,y+o+1.6,z0+w+0.35,0.3,0.3,0.4,SP],[x0-0.75,y+o+0.8,z0+t-0.15,0.4,0.3,0.3,SP],[x0+w+0.35,y+o+2.4,z0+t-0.15,0.4,0.3,0.3,SP])}};
    col(-3,0,-3,6,40,3);L.push([-2.4,40,-2.4,4.8,2.2,4.8,G3],[-1.6,42,-1.6,3.2,1,3.2,G2]);
    L.push([3,13,-1.8,6,3.6,3.6,G2],[3,12.6,-1.4,6,0.4,2.8,G1]);col(6.2,13,-1.8,3.6,15,2);L.push([6.6,28,-1.4,2.8,1.2,2.8,G3],[7,29.2,-1,2,1.4,2,'#f07a90'],[7.5,30.4,-.5,1,0.8,1,'#ffd34d']);
    L.push([-9.6,9,-1.8,6.6,3.6,3.6,G2]);col(-10.4,9,-1.8,3.6,12,2);L.push([-10,21,-1.4,2.8,1.2,2.8,G3]);
    L.push([-1.4,43,-1.4,2.8,1.6,2.8,'#f07a90'],[-0.8,44.4,-0.8,1.6,1,1.6,'#ffb0c0'],[-0.4,45.2,-0.4,0.8,0.6,0.8,'#ffd34d'])}
  OBJGEO.cactus=vegGeo(L);TREETOP.cactus=[[0,0,3.4,43.6]];TRUNK.cactus=[0.45,43,44];
  // krzak (z owocami)
  L=[];T=[];leafBlob(L,T,0,1.6,0,7.4,6.6,'#3c7432','#447e38','#549b41','#2b5426');leafBlob(L,T,5.1,.8,3.3,4.2,4.6,'#447e38','#4a8a3a','#5ea045','#2b5426');
  L.push([-7.9,5.2,1.1,1.2,1.2,1.2,'#d8323a'],[3.3,8.9,-4.1,1.2,1.2,1.2,'#d8323a'],[-2.3,8.6,6.6,1.2,1.2,1.2,'#e84a4a'],[7.6,4.4,-1.4,1.1,1.1,1.1,'#d8323a']);
  OBJGEO.bush=vegGeo(L);
  // skała
  L=[[-8.2,0,-7.1,16.4,9.3,14.2,'#7a7782'],[-6.1,9.3,-4.9,11.3,4.4,9.6,'#8e8b96'],[-3.4,13.7,-2.8,6.3,2.1,5.1,'#9a97a2'],[-9.6,0,1.9,5.6,5.6,6.9,'#5d5a63'],[3.7,0,-9.4,6.1,3.6,4.6,'#6f6a73'],
     [-6.4,9.3,-5.1,7.1,.9,6.4,'#5b8f3a'],[-3.2,15.8,-2.4,4.1,.7,3.7,'#6aa048'],[5.9,0,3.8,3.6,2.4,3.3,'#7a7782']];
  OBJGEO.rock=vegGeo(L);TREETOP.rock=[[0,0,7,9.3],[-.4,0,5.4,13.7],[0,0,3,15.8]];TRUNK.rock=[0.75,9,16];
  // głaz omszały
  L=[[-11.3,0,-10.2,22.6,15.4,20.4,'#6f6c76'],[-9.1,15.4,-8.2,17.4,6.6,15.6,'#7d7a85'],[-5.4,22,-4.6,10.6,3.4,8.8,'#8b8893'],[-13.1,0,-4.4,4.3,9.6,10.2,'#5d5a63'],
     [-8.6,15.4,-7.7,13.6,1.2,10.8,'#4f8434'],[-4.9,25.4,-4.1,7.5,1,6.3,'#5f9a40'],[8.7,0,4.1,6.2,4.4,6.6,'#6f6c76'],[-2.2,0,10.1,7.4,6.1,3.4,'#66636d']];
  OBJGEO.boulder=vegGeo(L);TREETOP.boulder=[[0,0,10,15.4],[0,0,8,22],[0,0,4.6,25.4]];TRUNK.boulder=[1.3,15,26];
  // kwiat (kolor z instancji), tulipany, trawa, grzyb, paproć/trzcina
  OBJGEO.flower=voxGeo([[-.45,0,-.45,.9,6,.9,'#3c7432'],[-2.3,6,-.8,4.6,1.4,1.6,'#ffffff'],[-.8,6,-2.3,1.6,1.4,4.6,'#ffffff'],[-1.4,5.6,-1.4,2.8,2.2,2.8,'#f4f0ea'],[-.7,7.8,-.7,1.4,.9,1.4,'#f0d060'],[.4,2,-.6,2.8,.7,1.2,'#4a8a3a'],[-3,3.4,-.5,2.6,.7,1,'#4a8a3a']],0);
  OBJGEO.tulip=voxGeo([[-3.4,0,-1.2,.7,5.5,.7,'#3c7432'],[-4,5.5,-1.8,1.9,2.6,1.9,'#e8484b'],[1.6,0,1.4,.7,6.6,.7,'#3c7432'],[1,6.6,.8,1.9,2.6,1.9,'#f2c534'],
     [.2,0,-3.3,.7,4.8,.7,'#3c7432'],[-.4,4.8,-3.9,1.9,2.4,1.9,'#d96bd0'],[-2.6,0,2.4,.7,5,.7,'#3c7432'],[-3.2,5,1.8,1.9,2.4,1.9,'#ffffff'],[-1.6,0,-.6,4.4,1.2,2.4,'#4a8a3a']],0);
  OBJGEO.grass=voxGeo([[-3.1,0,-.3,.6,4.4,.6,'#5a9a3c'],[-1.6,0,1.4,.6,6.2,.6,'#4f8e36'],[.4,0,-1.8,.6,5.3,.6,'#66a646'],[2.2,0,.9,.6,3.8,.6,'#5a9a3c'],[-.4,0,.2,.6,7.1,.6,'#72b04e'],[1.3,0,2.6,.6,4.9,.6,'#4f8e36'],[-2.4,0,-2.3,.6,3.6,.6,'#66a646']],0);
/* v139: duży grzyb — kopulasty kapelusz z warstw, blaszki od spodu, pierścień i włókna na trzonie, kropki; zwraca też bryły kolizji (po nich da się wspinać i chodzić) */
function shroomL(k,P,o){o=o||{};const L=[],CB=[],ox=o.x||0,oz=o.z||0,sh=o.sh||3.55,sw=o.sw||1.7,r=mulb(o.seed||7),B=(x,y,z,w,h,d,c,cb)=>{const b=[ox+x*k,y*k,oz+z*k,w*k,h*k,d*k,c];L.push(b);if(cb)CB.push(b.slice(0,6))};
  const hw=sw/2;B(-hw-0.25,0,-hw-0.25,sw+0.5,0.6,sw+0.5,P.st2,1);B(-hw,0.6,-hw,sw,sh-0.6,sw,P.st,1);
  for(let f=0;f<4;f++)for(let i=0;i<3;i++){const t=-hw+sw*(0.2+i*0.3),y0=0.7+r()*0.8,h=Math.min(sh-0.8-y0,1+r()*1.6);if(h<0.3)continue;if(f===0)B(hw,y0,t,0.05,h,0.14,P.st2);else if(f===1)B(-hw-0.05,y0,t,0.05,h,0.14,P.st2);else if(f===2)B(t,y0,hw,0.14,h,0.05,P.st2);else B(t,y0,-hw-0.05,0.14,h,0.05,P.st2)}
  const ry=sh*0.72;B(-hw-0.35,ry,-hw-0.35,sw+0.7,0.22,sw+0.7,P.ring);B(-hw-0.25,ry-0.25,-hw-0.25,sw+0.5,0.25,sw+0.5,P.ring2||P.ring);
  const y=sh;B(-2.7,y-0.1,-2.7,5.4,0.1,5.4,P.gill);for(let zz=-2.3;zz<=2.31;zz+=0.46){const x0=Math.max(hw+0.05,Math.abs(zz)+0.05),l=2.65-x0;if(l<0.2)continue;B(x0,y-0.16,zz-0.04,l,0.08,0.08,P.gill2);B(-x0-l,y-0.16,zz-0.04,l,0.08,0.08,P.gill2);B(zz-0.04,y-0.16,x0,0.08,0.08,l,P.gill2);B(zz-0.04,y-0.16,-x0-l,0.08,0.08,l,P.gill2)}
  const LY=[[2.9,0,0.35,P.c2],[3.0,0.35,0.5,P.c1],[2.75,0.85,0.5,P.c1],[2.35,1.35,0.45,P.c1],[1.85,1.8,0.4,P.c2],[1.2,2.2,0.3,P.c2]];
  for(const [rr,yy,hh,c] of LY)B(-rr,y+yy,-rr,rr*2,hh,rr*2,c,1);
  for(let i=0;i<26;i++){const li=1+Math.floor(r()*5),[rr,yy,hh]=LY[li],nx=LY[li+1]?LY[li+1][0]:0,a=r()*Math.PI*2,s2=0.35+r()*0.35;
    if(r()<0.55&&nx<rr-0.4){const d=nx+0.15+r()*(rr-nx-0.3-s2);B(Math.cos(a)*d-s2/2,y+yy+hh,Math.sin(a)*d-s2/2,s2,0.1,s2,r()<0.7?P.sp:P.sp2)}
    else{const side=Math.floor(r()*4),t=(r()*2-1)*(rr-s2),hh2=Math.min(hh-0.08,s2*0.8);if(side===0)B(rr,y+yy+0.04,t,0.08,hh2,s2,P.sp);else if(side===1)B(-rr-0.08,y+yy+0.04,t,0.08,hh2,s2,P.sp);else if(side===2)B(t,y+yy+0.04,rr,s2,hh2,0.08,P.sp);else B(t,y+yy+0.04,-rr-0.08,s2,hh2,0.08,P.sp)}}
  for(let i=0;i<14;i++){const li=Math.floor(r()*4)+1,[rr,yy,hh]=LY[li],a=r()*Math.PI*2,d=r()*rr*0.8,s2=0.15+r()*0.2;B(Math.cos(a)*d,y+yy+hh,Math.sin(a)*d,s2,0.05,s2*1.5,P.c3)}
  return{L,CB}}
const SHR_RED={st:'#efe8da',st2:'#d8cfbd',ring:'#f8f3e8',ring2:'#e6ddcc',gill:'#ead8c2',gill2:'#c9b094',c1:'#d23a2e',c2:'#b92e26',c3:'#9a221c',sp:'#ffffff',sp2:'#f0e8d8'};
  OBJGEO._mushroomOld=voxGeo([[-.9,0,-.9,1.8,3.6,1.8,'#efe8da'],[-2.8,3.6,-2.8,5.6,1.6,5.6,'#d23a2e'],[-1.9,5.2,-1.9,3.8,1,3.8,'#c0302a'],[-1.6,6.2,-.5,.8,.25,.8,'#ffffff'],[.6,5.5,1.1,.7,.25,.7,'#ffffff'],[2.2,4.5,-.9,.25,.6,.7,'#ffffff'],
     [3.2,0,1.8,1.1,2.2,1.1,'#efe8da'],[2.1,2.2,.7,3.3,1,3.3,'#b8862e']],0);
  {const A=shroomL(1,SHR_RED,{seed:11}),S2=shroomL(0.36,{...SHR_RED,c1:'#b8862e',c2:'#a2742a',c3:'#7a5420',sp:'#e8d8b0',sp2:'#d8c8a0'},{x:3.4,z:1.9,sh:4.2,seed:5}),S3=shroomL(0.22,SHR_RED,{x:-3.3,z:-2.4,sh:4,seed:3});
   OBJGEO.mushroom=voxGeo(A.L.concat(S2.L,S3.L),0);OBJGEO.mushroom.userData.cb=A.CB;OBJGEO._mushroomOld.dispose();delete OBJGEO._mushroomOld}
  OBJGEO.fern=voxGeo([[-.5,0,-.5,1,3,1,'#3c7432'],[.5,2.4,-.7,6.4,.8,1.4,'#4a8a3a'],[-6.9,2.6,-.7,6.4,.8,1.4,'#447e38'],[-.7,2.8,.5,1.4,.8,6.4,'#3f7834'],[-.7,2.2,-6.9,1.4,.8,6.4,'#4a8a3a'],
     [4.8,1.6,-.6,3.1,.8,1.2,'#549b41'],[-8.1,1.8,-.6,3.1,.8,1.2,'#549b41'],[-.6,2,5,1.2,.8,3.1,'#549b41'],[-.6,1.4,-8.2,1.2,.8,3.1,'#549b41'],[-.4,3,-.4,.8,5.4,.8,'#6a8a3a'],[-.6,8.4,-.6,1.2,2,1.2,'#7a5a3a']],0);
  // nowe biomy: akacja, drzewo dżungli, klon, wiśnia, wrzos, sucha trawa
  L=[];T=[];L.push([-2.1,0,-2.1,4.2,22,4.2,'#6b4a2e'],[-1.2,20,-1.6,3.4,10,3.4,'#6b4a2e'],[0.8,28,-1.4,3,6,3,'#62422a'],[-5.4,26,-1.2,4.6,2.6,2.6,'#62422a'],[2.6,32,-1.3,8,2.4,2.6,'#62422a'],[-9,29,-1.2,4,4,2.4,'#62422a']);
  leafBlob(L,T,1.2,36.5,0.4,20.5,4.6,'#6b8a35','#7a9a3e','#8aaa48','#566f2a');leafBlob(L,T,12.4,34.2,7.1,9.6,3.9,'#7a9a3e','#86a644','#94b452','#566f2a');leafBlob(L,T,-12.6,33.3,-6.4,10.4,3.8,'#6b8a35','#7a9a3e','#8aaa48','#566f2a');
  barkify(L,['#6b4a2e','#62422a'],'furrow',15);OBJGEO.acacia=vegGeo(L);TREETOP.acacia=T;TRUNK.acacia=[0.3,34,46];
  L=[];T=[];L.push([-4,0,-4,8,84,8,'#5e4a32'],[-8.5,0,-1.8,17,9,3.6,'#54402a'],[-1.8,0,-8.5,3.6,9,17,'#54402a'],[-4.3,10,-1,.5,30,2,'#3a6a2a'],[3.8,18,1,.5,26,2,'#3a6a2a'],[-1,30,3.8,2,24,.5,'#3a6a2a']);
  const JG=['#1e5420','#245e26','#2c6a2c','#3a7a34'];
  leafBlob(L,T,0,70,0,19,11,JG[0],JG[1],JG[2],'#16401a');leafBlob(L,T,14.5,63,5,10.5,8.5,JG[1],JG[2],JG[3],'#16401a');leafBlob(L,T,-15,65,-6,11,8.4,JG[0],JG[1],JG[2],'#16401a');leafBlob(L,T,1,84,-1,12.5,9.5,JG[1],JG[2],JG[3],JG[0]);leafBlob(L,T,-1,96,1,6.5,6,JG[2],JG[3],'#4a8a3e',JG[1]);
  for(const [x,z,h] of [[16,8,18],[-14,-10,20],[6,-17,16],[-9,15,22],[19,-4,14]])L.push([x,64-h,z,1,h,1,'#2f6a2a']);
  barkify(L,['#5e4a32','#54402a'],'furrow',16);OBJGEO.jtree=vegGeo(L);TREETOP.jtree=T;TRUNK.jtree=[0.6,84,104];
  const autumn=(name,C1,C2,C3,C4,CU,trunk)=>{const L=[],T=[];L.push([-3.4,0,-3.4,6.8,44,6.8,trunk],[-6,0,-1.6,12,2.6,3.2,darker(trunk,0.85)],[-1.6,0,-6,3.2,2.6,12,darker(trunk,0.85)],[3,26,-1.2,10,2.4,2.4,trunk],[-12.6,30,-1.1,9.6,2.2,2.2,trunk]);
    leafBlob(L,T,0,35,0,16,12.4,C1,C2,C3,CU);leafBlob(L,T,12.6,31.5,4,8.8,8.8,C2,C3,C4,CU);leafBlob(L,T,-13.4,34.3,-5,9.6,8.6,C1,C2,C3,CU);leafBlob(L,T,3.2,30.6,-13.3,8.4,8,C2,C3,C4,CU);leafBlob(L,T,1,48.6,-0.8,11.6,9.2,C2,C3,C4,C1);leafBlob(L,T,-0.7,59,1.2,6.8,6.4,C3,C4,C4,C2);
    barkify(L,[trunk],name==='sakura'?'lent':'furrow',name.length*7);OBJGEO[name]=vegGeo(L);TREETOP[name]=T;TRUNK[name]=[0.42,44,68]};
  autumn('maple','#c24e1c','#d4621f','#e0832c','#f0a83a','#8e3a16','#5a3a24');
  autumn('sakura','#e892b0','#f0a8c0','#f6bccd','#ffd4e2','#c87896','#4a3028');
  OBJGEO.heather=voxGeo([[-6,0,-5,12,2.6,10,'#4a6a32'],[-5,2.4,-4,4,2.6,3.6,'#8a4a8a'],[1,2.4,-3.2,4.4,3.2,3.4,'#a05aa0'],[-3.2,2.4,1.4,3.8,2.8,3.6,'#7a3e7a'],[2.4,2.4,2,3,2.2,3,'#b46ab4'],[-1,4.6,-1,2.4,1.6,2.4,'#c27ac2']],0);
  // ===== nowe biomy v2: bambus, sekwoja, namorzyn, lawenda, kryształy soli, baobab, trzcina =====
  {let L=[],T=[];const BC=['#7aa83a','#6a9a30','#86b444'];// kępa bambusa: 7 łodyg z kolankami, liście na szczytach
    for(const [x,z,h,k] of [[0,0,86,0],[4,1.5,74,1],[-3.5,2.5,80,2],[1.5,-4,68,1],[-2,-3.2,90,0],[5,-3,60,2],[-5.5,-1,64,1]]){L.push([x-0.8,0,z-0.8,1.6,h,1.6,BC[k]]);for(let y=10;y<h;y+=11)L.push([x-0.95,y,z-0.95,1.9,0.8,1.9,'#4e7a22']);
      for(const [lx,lz,ly] of [[3,0,-6],[-3,1,-12],[0,3,-18],[2,-3,-3]])L.push([x+lx-1.6,h+ly,z+lz-0.6,3.2,0.5,1.2,'#5a9a2a'],[x+lx-0.6,h+ly-0.4,z+lz-1.6,1.2,0.5,3.2,'#4e8a24'])}
    OBJGEO.bamboo=vegGeo(L);TREETOP.bamboo=[];TRUNK.bamboo=[0.25,80,92]}
  {let L=[],T=[];// sekwoja: potężny czerwony pień, korzenie przyporowe, rzadkie piętra igliwia
    L.push([-6,0,-6,12,118,12,'#8a3a22'],[-6.4,0,-6.4,12.8,3,12.8,'#6e2c18']);for(const [x,z,w,d] of [[-9,0,6,4],[6,-1,5,4],[-1,-9,4,5],[-1,6,4,5]])L.push([x-w/2+ (x?0:0),0,z-d/2,w,8,d,'#7a3220']);
    for(let y=6;y<110;y+=9)L.push([-6.2,y,-1,0.6,5,2,'#6e2c18'],[5.6,y+4,-2,0.6,4,2,'#6e2c18']);
    const G=['#1e4a22','#245426','#2c5e2c','#163a1a'];for(const [y,r] of [[70,20],[86,17],[100,14],[112,11],[124,8],[134,5]])leafBlob(L,T,0,y,0,r,7,G[0],G[1],G[2],G[3]);
    barkify(L,['#8a3a22','#7a3220'],'plate',18);OBJGEO.sequoia=vegGeo(L);TREETOP.sequoia=T;TRUNK.sequoia=[0.75,118,142]}
  {let L=[],T=[];// namorzyn: łukowate korzenie szczudłowe, krótki pień, szeroka płaska korona
    for(let k=0;k<7;k++){const a=k/7*6.283,R=10;for(let s2=0;s2<5;s2++){const t=s2/4,rr=R*(1-t),y=Math.sin(t*Math.PI*0.5)*12;L.push([Math.cos(a)*rr-0.9,y,Math.sin(a)*rr-0.9,1.8,2.6,1.8,'#5a4a32'])}}
    L.push([-2.6,10,-2.6,5.2,26,5.2,'#5e4a30'],[2,24,-1,9,2,2,'#5e4a30'],[-10,28,-1,9,2,2,'#5e4a30']);
    leafBlob(L,T,0,36,0,17,6,'#2e5e2a','#386a30','#447a38','#1e4a1e');leafBlob(L,T,9,33,6,9,5,'#386a30','#447a38','#4e8a3e','#1e4a1e');leafBlob(L,T,-9,34,-5,9,5,'#2e5e2a','#386a30','#447a38','#1e4a1e');
    barkify(L,['#5e4a30'],'furrow',19);OBJGEO.mangrove=vegGeo(L);TREETOP.mangrove=T;TRUNK.mangrove=[0.35,36,42]}
  OBJGEO.lavender=voxGeo([[-5,0,-4,10,3,8,'#6a8a5a'],[-4,3,-3,8,1.4,6,'#7a9a68'],...[[-3.5,-2],[-1,-2.4],[1.6,-1.8],[3.4,-0.6],[-3,0.6],[-0.6,0.2],[2,1],[-2,2.4],[0.8,2.6],[3,2.6]].flatMap(([x,z],i)=>[[x-0.25,3,z-0.25,0.5,4.5+(i%3),0.5,'#6a8a5a'],[x-0.6,7+(i%3),z-0.6,1.2,2.6,1.2,i%2?'#8a6ac8':'#9a7ad8'],[x-0.4,9.4+(i%3),z-0.4,0.8,1,0.8,'#b29ae6']])],0);
  OBJGEO.saltc=voxGeo([[-4,0,-3,8,0.8,6,'#e8e6e0'],[-2,0,-1.5,2,6,2,'#f6f6f2'],[0.5,0,0,1.6,4,1.6,'#dfe8ea'],[-3.4,0,1,1.4,3,1.4,'#f0f0ec'],[1.8,0,-2,1.2,2.4,1.2,'#e4ecee'],[-1.6,6,-1.1,1.2,1.2,1.2,'#ffffff']],0);
  {let L=[],T=[];// baobab: gruby pień-butelka, krótkie grube konary, małe kępki liści
    L.push([-7,0,-7,14,10,14,'#9a8470'],[-7.6,10,-7.6,15.2,14,15.2,'#a08a74'],[-6.6,24,-6.6,13.2,10,13.2,'#9a8470'],[-5,34,-5,10,6,10,'#8e7864']);
    for(const [x,z,dx,dz] of [[0,0,1,0],[0,0,-1,0.3],[0,0,0.2,1],[0,0,-0.3,-1],[0,0,0.8,-0.8]]){for(let k=0;k<4;k++)L.push([dx*(4+k*3.4)-1.6,38+k*2.4,dz*(4+k*3.4)-1.6,3.2,3,3.2,'#8a7460']);leafBlob(L,T,dx*18,50,dz*18,5.5,4,'#5e7e30','#6a8a3a','#7a9a44','#46602a')}
    barkify(L,['#9a8470','#a08a74','#8e7864'],'smooth',20);OBJGEO.baobab=vegGeo(L);TREETOP.baobab=T;TRUNK.baobab=[0.8,40,56]}
  OBJGEO.reed=voxGeo([[-3,0,-0.3,0.6,13,0.6,'#6a8a3a'],[-0.5,0,1.4,0.6,15,0.6,'#5e7e34'],[1.8,0,-1.2,0.6,12,0.6,'#6a8a3a'],[-1.8,0,-2.2,0.6,11,0.6,'#76964a'],[2.6,0,1.6,0.6,10,0.6,'#5e7e34'],[-3.3,9.5,-0.6,1.2,3,1.2,'#6a4a2a'],[-0.8,11.5,1.1,1.2,3,1.2,'#5a3e22'],[1.5,8.5,-1.5,1.2,3,1.2,'#6a4a2a'],[-0.3,0,-0.3,3.4,5,0.4,'#7a9a4a'],[-2,0,0.5,0.4,6,3,'#6a8a3a']],0);
  // ===== nietypowe elementy biomów (8 vox = 1 m) =====
  {const ST='#9a948c',SD='#7e7870',SL='#b4aea4',MOSS='#5a7a3a',BONE='#e8e0c8',BD='#c8bea4',WD='#6b4a2b',WDD='#4a301c',G=[];const R2=(a,b)=>(a+b)/2,P=(...b)=>G.push(b),mk=T=>{const CB=G.filter(b=>Math.min(b[3],b[5])>=1.6&&b[4]>=2.4&&b[3]*b[5]>=4&&!b.nc&&!(typeof b[6]==='string'&&b[6][0]==='!')).map(b=>[b[0],b[1],b[2],b[3],b[4],b[5]]).sort((a,b)=>b[3]*b[4]*b[5]-a[3]*a[4]*a[5]).slice(0,48);if(T)T.forEach((t,i)=>surfTex(G,t[0],t[1],(t[2]||7)+i*13,t[3]));const g=voxGeo(G.splice(0),0);g.userData.cb=CB;return g};
    // 32 łuk ruin
    P(-24,0,-5,9,44,10,ST);P(15,0,-5,9,30,10,ST);P(-26,0,-7,13,4,14,SD);P(13,0,-7,13,4,14,SD);P(-24,44,-5,30,8,10,SL);P(-6,40,-5,12,4,10,ST);P(-24,40,-5,9,4,10,SD);for(const [x,z,w,h] of [[20,8,8,6],[8,10,6,4],[-4,-12,7,5],[26,-8,5,3]])P(x,0,z,w,h,w,SD);P(-24,30,-5.6,9,6,0.6,MOSS);P(15,22,4.6,9,6,0.6,MOSS);OBJGEO.arch=mk([[[ST,SD,SL],'stone']]);
    // 33 obelisk z hieroglifami
    P(-12,0,-12,24,6,24,SD);P(-10,6,-10,20,4,20,ST);P(-12.4,5.6,-12.4,24.8,0.8,24.8,SL);for(let k=0;k<9;k++){const w=10-k*0.5;P(-w/2,10+k*8,-w/2,w,8,w,k%3===1?'#8a8070':'#c8b898')}
    P(-3,82,-3,6,4,6,'#d9b23a');P(-1.5,86,-1.5,3,3,3,'#e8c84a');P(-0.6,89,-0.6,1.2,1.4,1.2,'#f8e070');
    {const HG='#5a4a3a',HR='#8a3a2a',HB='#2f5a7a';for(let k=0;k<7;k++){const y=14+k*10,w=10-((y-10)/8|0)*0.5,e=w/2;const g=k%3;
      for(const f of [0,1,2,3]){const Q=(a,b,ww,hh,c)=>{if(f===0)P(e-0.05,y+b,a-ww/2,0.4,hh,ww,c);else if(f===1)P(-e-0.35,y+b,a-ww/2,0.4,hh,ww,c);else if(f===2)P(a-ww/2,y+b,e-0.05,ww,hh,0.4,c);else P(a-ww/2,y+b,-e-0.35,ww,hh,0.4,c)};
        if(g===0){Q(-2,0.5,0.6,4,HG);Q(-2,4.5,2,0.6,HG);Q(1.6,1,1.6,1.6,HR);Q(1.6,3.2,0.5,2,HG)}else if(g===1){Q(-1.6,1,2.4,0.6,HG);Q(-1.6,2.4,0.6,2.4,HG);Q(1.4,1.4,1.2,3,HB);Q(1.4,4.6,2,0.5,HG)}else{Q(0,0.6,3.6,0.5,HG);Q(-1.2,1.6,1,1,HR);Q(1.2,1.6,1,1,HR);Q(0,3,0.6,2.2,HG)}}}}
    OBJGEO.obelisk=mk([[[SD,ST,SL,'#c8b898','#8a8070'],'stone']]);
    // 34 żebra olbrzymiej bestii
    P(-3,4,-44,6,6,88,BONE);for(let z=-42;z<42;z+=6){P(-3.6,3.6,z,7.2,6.8,2,BD);P(-0.8,10,z+0.4,1.6,4,1.2,BD);P(-6,6,z+0.3,12,1.4,1.4,BD)}
    for(let k=0;k<8;k++){const z=-36+k*9,h=40-Math.abs(k-3)*4;for(const sx of [-1,1]){for(let q=0;q<6;q++){const t=q/5,x=sx*(4+Math.sin(t*Math.PI*0.9)*18),y=4+t*h;P(x-1.5,y,z-1.5,3,h/5+1,3,q%2?BONE:BD)}if(k%3===1)P(sx*(4+Math.sin(0.9*Math.PI*0.6)*18)-1.6,4+h*0.6,z-1.6,3.2,1,3.2,'#a89a7a')}}
    P(-11,0,44,22,18,24,BONE);P(-12,10,46,24,6,18,BD);P(-9,10,67.6,6,5,0.8,'#1a1612');P(3,10,67.6,6,5,0.8,'#1a1612');P(-8,6,58,6,6,10,BD);P(2,6,58,6,6,10,BD);P(-6,8,66,12,4,6,'#3a3028');for(let k=0;k<5;k++)P(-5+k*2.2,4,67.6,1.2,4,1,'#efe8d6');
    P(-14,0,40,4,2,30,'#d8c8a0');P(10,0,40,4,2,30,'#d8c8a0');OBJGEO.ribs=mk([[[BONE,BD],'bone']]);
    // 35 totem
    const TC=['#a8452f','#3f6fa8','#d9b23a','#5f7a3a'],TW='#f0e8d8',TK='#151515';P(-6,0,-6,12,2,12,'#5a4a34');P(-5,2,-5,10,3,10,WDD);
    for(let k=0;k<5;k++){const y=5+k*11,c=TC[k%4];P(-4,y,-4,8,11,8,k%2?WD:'#8a6240');P(-4.3,y,-4.3,8.6,0.8,8.6,TK);
      P(-3.6,y+7.4,4,7.2,1.2,1.4,k%2?'#4a301c':'#6b4a2b');P(-3,y+5.6,4,2.4,1.8,0.5,TW);P(0.6,y+5.6,4,2.4,1.8,0.5,TW);P(-2.2,y+5.9,4.4,1,1.2,0.4,TK);P(1.2,y+5.9,4.4,1,1.2,0.4,TK);
      if(k%2===0){P(-1,y+2.6,4,2,3,3,'#d9b23a');P(-1,y+1.6,6.4,2,1.2,0.8,'#c89a2a')}else{P(-1,y+3.2,4,2,2.6,1.6,k%2?WD:'#8a6240');P(-0.8,y+3.2,5.5,0.6,0.6,0.3,TK);P(0.2,y+3.2,5.5,0.6,0.6,0.3,TK)}
      P(-3,y+0.8,4,6,1.8,0.8,c);for(let t=0;t<4;t++)P(-2.4+t*1.4,y+1.9,4.5,0.6,0.7,0.4,TW);
      for(const sx of [-1,1]){P(sx>0?4:-5.2,y+3,-2,1.2,6,4,c);P(sx>0?4.6:-5.4,y+4.4,-1,0.8,3,2,TW)}
      P(-4.2,y+9.6,-4.2,8.4,0.5,0.4,c);P(-4.2,y+9.6,3.8,8.4,0.5,0.4,c)}
    for(const sx of [-1,1])for(let t=0;t<4;t++){const x0=sx>0?4:-4-(14-t*2.6);P(x0,60-t*1.2,-1.4,14-t*2.6,3,2.8,TC[t%4]);P(sx>0?x0+14-t*2.6-1:x0,57-t*1.2,-1.2,1,3,2.4,TW)}
    P(-3.4,60,-3.4,6.8,6.4,6.8,TC[1]);P(-3.4,66.4,-3.4,6.8,1.2,6.8,TC[0]);for(let t=0;t<5;t++)P(-2.6+t*1.2,67.6,-1,0.6,2+((t+1)%3),0.6,t%2?TC[2]:TC[0]);
    P(-1,62,3.4,2,2.2,3.4,'#d9b23a');P(-1,60.6,6,2,1.6,0.9,'#c89a2a');P(-3,63.6,3.4,2,1.4,0.4,TW);P(1,63.6,3.4,2,1.4,0.4,TW);P(-2.4,63.8,3.8,0.9,1,0.3,TK);P(1.5,63.8,3.8,0.9,1,0.3,TK);
    OBJGEO.totem=mk([[[WD,'#8a6240',WDD],'wood']]);
    // 36 menhiry
    P(-14,0,-3,9,34,6,ST);P(-13,34,-2,7,4,4,SL);P(-14.6,4,-2.4,1,22,4.8,SD);P(4,0,-8,7,24,6,SD);P(4.6,24,-7.4,5.6,3,4.8,ST);P(8,0,8,8,28,6,ST);P(9,28,8.6,6,3,4.8,SL);P(-2,0,12,6,16,5,SD);P(-1.4,16,12.6,4.6,2,3.6,ST);
    // ryte spirale i runy (płytkie rowki), porosty, mech u podstawy
    for(const [x,y,w,h] of [[-12,24,5,0.6],[-12,19,0.6,5.6],[-12,19,5,0.6],[-7.6,19,0.6,3],[-10,21,2.4,0.6],[-12,8,1,6],[-10,11,3,0.6],[-8,8,1,6]])P(x,y,2.94,w,h,0.36,'#5e5952');
    for(const [x,y] of [[9.6,6],[11.6,10],[9.6,14],[11.6,18]])P(x,y,13.94,1.4,0.6,0.36,'#5e5952');
    for(const [x,y,z,w,h] of [[-14,20,2.94,9,6],[8,14,13.94,8,5],[-2,8,16.94,4,3],[4,4,-2.06,5,4]])P(x,y,z,w,h,0.6,MOSS);
    for(const [x,y,z,c] of [[-9,28,2.98,'#c8c060'],[-13,12,2.98,'#d8d4c8'],[10,22,13.98,'#c8c060'],[5,18,-2.02,'#d8d4c8'],[0,12,16.98,'#c8c060']])P(x,y,z,2,1.6,0.3,c);
    for(const [x,z,w] of [[-18,6,4],[0,-6,3],[14,2,3],[-6,6,2.5],[12,20,3]])P(x,0,z,w,w*0.6,w,SD);OBJGEO.menhir=mk([[[ST,SD,SL],'stone']]);
    // 37 wrak statku
    for(let k=0;k<12;k++){const z=-44+k*8,w=26-Math.abs(k-5.5)*3.2;P(-w/2,0,z,w,4,8,'#5a4028');for(const sx of [-1,1])P(sx*w/2-2,4,z,4,10+(k%3),8,k%2?'#6b4a2b':'#5a3e24')}for(let k=1;k<11;k+=2)P(-14,14,-44+k*8,28,2,2,'#4a301c');P(-2,4,-6,4,52,4,'#5a3e24');P(-2,44,-6,22,3,3,'#5a3e24');P(-16,28,-8,14,12,1,'#c8bca0');P(-30,0,30,10,4,6,'#5a4028');OBJGEO.wreck=mk([[['#5a4028','#6b4a2b','#5a3e24'],'wood']]);
    // 38 kryształy
    {const CC=[];for(const [x,z,w,h,c] of [[0,0,10,60,'#7ae0ff'],[10,-6,7,38,'#a890ff'],[-11,4,8,44,'#9ae8ff'],[4,12,6,28,'#c8b0ff'],[-6,-12,6,24,'#7ae0ff'],[12,8,4,16,'#9ae8ff'],[-13,-6,4,14,'#c8b0ff']]){CC.push(c);P(x-w/2,0,z-w/2,w,h,w,c);P(x-w*0.36,h,z-w*0.36,w*0.72,w*0.6,w*0.72,c);P(x-w*0.2,h+w*0.6,z-w*0.2,w*0.4,w*0.5,w*0.4,'#e8fbff');P(x-w*0.08,h+w*1.1,z-w*0.08,w*0.16,w*0.3,w*0.16,'!#ffffff')}
     P(-14,0,-14,28,3,28,'#6a6474');P(-17,0,-8,6,4,8,'#5a5464');P(12,0,-15,7,5,6,'#5a5464');P(-6,0,13,9,3.6,5,'#5a5464');for(const [x,z] of [[-9,-1],[6,4],[2,-9]])P(x,3,z,1.6,3,1.6,'!#c8f4ff');
     OBJGEO.bigcrystal=mk([[[...new Set(CC)],'crystal'],[['#6a6474','#5a5464'],'stone']])}
    // 39 zwalony olbrzymi pień
    {const BK='#5e4a32',r=mulb(39),R=(a,b)=>a+r()*(b-a);P(-7,0,-46,14,14,92,BK);
     // kora: podłużne bruzdy i grzbiety na bokach, płaty na wierzchu
     for(const sx of [-1,1])for(let y=0.6;y<13;y+=1.5){let z=-45+R(0,4);while(z<44){const l=R(6,18),dk=r()<0.5;P(sx>0?7-0.06:-7-(dk?0.2:0.42),y,z,(dk?0.2:0.42)+0.06,dk?0.5:0.8,Math.min(l,44-z),dk?'#3e2e1e':(r()<0.5?'#6e5640':'#7a6048'));z+=l+R(1,4)}}
     for(let z=-44;z<42;z+=R(5,10)){const w=R(4,10);P(-w/2+R(-2,2),14-0.06,z,w,0.36,R(3,7),r()<0.5?'#4a3828':'#6e5640')}
     // mech w płatach i zwisający po bokach
     for(let z=-40;z<40;z+=R(6,13)){const w=R(5,12),l=R(6,14);P(-w/2+R(-2,2),14.3,z,w,R(0.8,1.6),l,r()<0.5?MOSS:'#6a8a42');if(r()<0.6)P(r()<0.5?6.94:-7.5,R(9,12),z+R(0,l-3),0.56,R(2,5),R(2,4),MOSS)}
     // ścięty koniec: słoje; drugi koniec złamany, z drzazgami
     P(-6.4,0.6,-46.5,12.8,12.8,0.6,'#a8885a');P(-4.6,2.4,-46.8,9.2,9.2,0.4,'#8e6c42');P(-2.8,4.2,-47,5.6,5.6,0.3,'#b8986a');P(-1,6,-47.1,2,2,0.2,'#6e5232');P(-7.4,-0.2,-46.6,14.8,1.2,1.4,'#4a3828');
     P(-6,1,46,12,12,0.6,'#8e6c42');for(const [x,y,w,h,l] of [[-5,2,3,7,4],[-1,7,4,6,6],[3,3,3,9,3],[-4,9,5,4,2.5],[1,1,4,4,5]])P(x,y,46,w,h,l,r()<0.5?'#a8885a':'#7a5a3a');
     P(5,10,-10,12,4,4,BK);P(16,10,-10.4,1,4.4,4.8,'#a8885a');P(-18,8,16,11,4,4,BK);P(-18.6,8,15.6,1,4.8,4.8,'#a8885a');
     for(const [x,z] of [[-8,-20],[7,0],[-8,24],[6,36]]){P(x-1.5,8,z-1.5,3,4,3,'#e8e0c8');P(x-4,12,z-4,8,2,8,'#c8302a');P(x-2.6,14,z-2.6,5.2,1,5.2,'#b0281e');P(x-1,13.4,z+3.8,1,0.8,1,'#f4f0e8')}
     for(let k=0;k<6;k++){P(-6+k*2,15.4,-30+k*12,1,4,1,'#5a8a34');P(-7+k*2,19,-31+k*12,3,1,3,'#6aa040')}}
    OBJGEO.log=mk();
    // 40 porzucony wóz
    P(-10,6,-18,20,3,36,'#7a5532');for(const sx of [-1,1])P(sx*10-1,9,-18,2,8,36,'#6b4528');P(-11,0,-14,2,12,12,WDD);P(9,0,10,2,12,12,WDD);P(12,0,-16,12,2,12,WDD);for(let k=0;k<4;k++)P(-10,17,-14+k*9,20,1.5,1.5,'#4a301c');P(-10,20,-14,20,1,18,'#d8ccb0');P(-4,9,-8,8,8,8,'#8a6240');P(-2,9,4,6,6,6,'#a87a4a');P(-1,4,18,2,2,16,'#6b4528');OBJGEO.wagon=mk([[['#7a5532','#6b4528','#8a6240','#a87a4a'],'wood']]);
    // 41 kamienna głowa bożka
    {const I='#8a8a7a',I2='#7a7a6a',I3='#9a9a88',DK='#2a2a24';P(-15,0,-13,30,40,26,I);P(-16,40,-14,32,6,28,I2);P(-17,46,-15,34,3,30,I3);for(let k=0;k<7;k++)P(-15+k*5,49,-13,3,5,3,k%2?I2:I3);
     P(-14,28,13,28,4,2.6,I3);P(-11,21,12.4,7,6,1.2,DK);P(4,21,12.4,7,6,1.2,DK);P(-9,22.4,13.2,3,2.6,0.4,'#c8a040');P(6,22.4,13.2,3,2.6,0.4,'#c8a040');
     P(-3,12,13,6,12,4,I2);P(-4,12,16.6,8,3,1.4,I2);P(-2.4,13,17.6,1.6,1.4,0.4,DK);P(0.8,13,17.6,1.6,1.4,0.4,DK);
     P(-10,3,13,20,6,1.6,I2);P(-8,4.4,14,16,3,0.8,DK);for(let k=0;k<6;k++)P(-7.4+k*2.6,6.2,14.4,1.4,1.2,0.6,'#d8d0b8');for(let k=0;k<6;k++)P(-7.4+k*2.6,4.4,14.4,1.4,1.1,0.6,'#d8d0b8');
     for(const sx of [-1,1]){P(sx>0?15:-17.6,14,-2,2.6,14,6,I2);P(sx>0?15.4:-17.4,18,-0.6,1.6,6,3,DK)}
     for(const [x,y,w,h] of [[6,30,0.6,9],[6.6,30,3,0.6],[-12,8,0.6,10],[-12,8,4,0.6],[10,6,0.6,6]])P(x,y,13.94,w,h,0.4,'#4a4a40');
     P(-15,30,-13.6,30,8,0.6,MOSS);P(-15.6,10,-6,0.6,20,12,MOSS);P(-15,40.6,-12,10,1.2,24,MOSS);P(10,0,13,5,6,1.4,MOSS);for(let k=0;k<4;k++)P(-13+k*1.2,20-k*5,13.94,1,5,0.6,'#4a7a2e');
     P(-20,0,8,10,8,10,'#6a6a5a');P(17,0,-8,7,5,7,'#6a6a5a');P(14,0,12,4,3,4,'#7a7a6a')}OBJGEO.idol=mk([[['#8a8a7a','#7a7a6a','#9a9a88','#6a6a5a'],'stone']]);
    // 42 kopiec termitów
    for(let k=0;k<8;k++){const w=26-k*3;P(-w/2+(k%2),k*6,-w/2,w,6,w,k%2?'#a8643a':'#b8744a')}P(-1.5,48,-1.5,3,5,3,'#b8744a');P(-0.8,52,-0.8,1.6,0.4,1.6,'#3a2014');
    for(const [x,z,h] of [[12,6,22],[-12,-8,16],[9,-11,12]]){P(x-3,0,z-3,6,h,6,'#a8643a');P(x-2,h,z-2,4,3,4,'#b8744a');P(x-0.8,h+3,z-0.8,1.6,0.4,1.6,'#3a2014')}
    P(-16,0,-15,32,1.2,30,'#9a6a40');OBJGEO.termite=mk([[['#a8643a','#b8744a'],'clay']]);
    // 43 gorące źródło
    for(let k=0;k<14;k++){const a=k/14*6.283,R=18;P(Math.cos(a)*R-3,0,Math.sin(a)*R-3,6+(k%3)*2,4+(k%2)*3,6,k%2?ST:SD)}P(-16,0.5,-16,32,1,32,'#4ac8d8');P(-10,1.2,-10,20,0.6,20,'#8ae8f0');P(-6,1.8,-4,3,0.3,3,'#ffffff');P(4,1.8,2,2,0.3,2,'#ffffff');/* v158: para nad źródłem animowana cząstkami */OBJGEO.spring=mk([[[ST,SD,SL],'stone']]);
    // 44 przydrożna kapliczka
    P(-1.5,0,-1.5,3,26,3,WD);P(-5,24,-4,10,10,8,'#8a6240');P(-3,26,4,6,6,0.6,'#e8dcc0');P(-1,27,4.4,2,3,0.4,'#3f6fa8');P(-7,34,-6,14,2,12,WDD);P(-5,36,-4,10,2,8,WDD);P(-0.5,38,-0.5,1,6,1,'#d9b23a');P(-3,41,-0.5,6,1,1,'#d9b23a');P(-4,0,2,8,2,6,'#8a6a8a');P(-4.6,30,4.2,0.6,4,0.4,'#d9b23a');P(4,30,4.2,0.6,4,0.4,'#d9b23a');P(-5.4,33.6,-4.4,10.8,0.6,8.8,'#3a2414');for(const [x,c] of [[-3,'#e04060'],[1.6,'#f0d040']])P(x,2,4,1.4,1.4,1.4,c);OBJGEO.shrine=mk([[[WD,'#8a6240',WDD],'wood']]);
    // 45 ruina muru
    for(let x=-30;x<30;x+=6){const h=10+((x*7+40)%22);P(x,0,-3,6,h,6,(x/6)%2?ST:SD)}P(-18,10,-3.4,6,8,0.6,'#2a2420');P(6,8,-3.4,6,8,0.6,'#2a2420');for(const [x,z] of [[8,8],[-12,10],[20,-10]])P(x,0,z,6,4,6,SD);P(-30,12,2.6,24,4,0.6,MOSS);OBJGEO.ruinwall=mk([[[ST,SD,SL],'stone']]);
    // 46 lodowe kolce
    {const IC=['#cfeaf6','#e8f8ff','#bfe0f0','#dff2fb'];P(-15,0,-13,30,1.4,28,'#d8eef8');P(-11,1.4,-9,20,0.4,18,'#f4fbff');
     for(const [x,z,w,h,lx,lz] of [[0,0,10,56,0.4,0.1],[9,5,6,36,0.5,0.3],[-8,-4,7,42,-0.4,-0.2],[3,-9,5,24,0.2,-0.5],[-6,8,5,30,-0.3,0.4],[12,-6,3,14,0.3,-0.2],[-12,4,3,12,-0.3,0]]){
      for(let k=0;k<6;k++){const t=k/6,ww=w*(1-t*0.82),yy=t*h;P(x-ww/2+lx*yy*0.12,yy,z-ww/2+lz*yy*0.12,ww,h/6+0.05,ww,IC[k%4])}const tx=x+lx*h*0.12,tz=z+lz*h*0.12;P(tx-w*0.06,h,tz-w*0.06,w*0.12,h*0.08,w*0.12,'#ffffff')}
     for(const [x,z,s2] of [[-13,-10,2],[11,10,1.6],[14,-11,1.4],[-3,12,1.8]])P(x,1.4,z,s2,s2*1.6,s2,'#e8f8ff');OBJGEO.icicle=mk([[IC,'ice']])}
    // 47 olbrzymia czaszka-skała
    {const SK='#d8d0bc',SK2='#cfc6b0',SK3='#c8beaa',DK='#1a1612';P(-20,4,-18,40,26,36,SK);P(-18,30,-16,36,8,30,SK2);P(-14,38,-12,28,4,22,'#d4ccb6');P(-21,10,-14,1.2,16,24,SK2);P(19.8,10,-14,1.2,16,24,SK2);
     P(-18,23,17.4,16,3.4,3,SK2);P(2,23,17.4,16,3.4,3,SK2);P(-15,12,17.6,11,11,1.6,DK);P(4,12,17.6,11,11,1.6,DK);P(-12,15,18.8,5,5,0.6,'!#7a2a1a');P(7,15,18.8,5,5,0.6,'!#7a2a1a');
     P(-3,7,17.6,6,4,1.6,DK);P(-2,11,17.6,4,2.4,1.6,DK);P(-1,13.4,17.6,2,1,1.6,DK);for(const sx of [-1,1])P(sx>0?14:-20,6,14,6,5,6,SK3);
     P(-16,4,17,32,3,4,SK3);for(let k=0;k<8;k++)P(-14+k*3.6,0.6,19.6,2.4,3.6,1.6,'#efe8d6');P(-17,0,14,34,4,6,SK3);for(let k=0;k<8;k++)P(-13+k*3.6,3.6,20.2,2.2,2.6,1.2,'#e4dcc8');
     P(-6,38.5,-8,10,4.2,1,DK);P(-1,30,17.6,0.6,8,0.6,DK);P(-14,42,-6,12,1.6,10,'#5a7a3a');P(8,36,-14,8,6,1,'#5a7a3a');
     P(-26,0,-22,52,1.6,48,'#c8b080');P(-24,0,18,10,3,8,'#c0a878');P(14,0,-24,12,3.4,10,'#c0a878');P(-22,0,-20,8,2.6,12,'#c0a878')}
    OBJGEO.skull=mk([[['#d8d0bc','#cfc6b0','#d4ccb6','#c8beaa'],'bone']]);
    // 48 skamieniałe drzewo: kamienny pień z konarami, bez liści
    {const A='#8a8278',B='#a49c90',C2='#6e675e';P(-4,0,-4,8,6,8,C2);P(-3,6,-3,6,30,6,A);P(-2.6,36,-2.6,5.2,14,5.2,B);P(2,22,-1,12,3,3,A);P(11,22,-1,3,12,3,B);P(-14,30,-1,12,3,3,A);P(-14,33,-1,3,10,3,B);P(-1,40,2,3,3,10,A);P(-1,43,10,3,8,3,B);P(-1,44,-12,3,3,10,A);P(-1.5,10,3,3,4,1,'#c8bea8');P(-5,2,-6,3,3,3,C2);P(4,0,3,4,2,3,C2);{const Sx=[];barkify(G.slice(),[A,B],'furrow',48,Sx);for(const b of Sx){const k=b[6];b[6]=k}G.push(...Sx);
     for(const [x,y,z] of [[3,14,2.95],[-3.4,24,0],[1,30,-3.4],[-2.9,40,1]])P(x,y,z,0.5,2.4,0.5,'#e8d8f0');P(-1.6,46,-1.6,3.2,4,0.4,'#c8bea8');P(-5,0,-6,10,0.6,12,'#7a746a')}OBJGEO.petree=mk()}
    // 49 podarta chorągiew na złamanym drzewcu
    {P(-0.6,0,-0.6,1.2,40,1.2,WD);P(-0.5,40,-0.5,1,6,1,WDD);P(0.6,22,-0.3,12,16,0.6,'#8a2a22');P(0.6,26,-0.3,10,4,0.6,'#d9b23a');P(6,18,-0.3,6,4,0.6,'#8a2a22');P(9,14,-0.3,3,4,0.6,'#6a1a16');P(-3,0,-3,6,2,6,'#5a4a34');for(let k=0;k<4;k++)P(0.6+k*3,14-k*1.2,-0.35,1.4,2.4,0.7,'#6a1a16');P(3,30,-0.34,4,4,0.68,'#2a2420');OBJGEO.bflag=mk([[[WD,WDD],'wood']])}
    // 50 miecz wbity w ziemię
    {P(-0.4,0,-0.15,0.8,16,0.3,'#b8bcc4');P(-0.3,1,-0.1,0.6,14,0.2,'#d8dce4');P(-3,16,-0.5,6,1,1,'#7a6a4a');P(-0.5,17,-0.5,1,5,1,'#4a301c');P(-0.8,22,-0.8,1.6,1.6,1.6,'#d9b23a');P(-2,0,-2,4,0.8,4,'#5a4a34');P(-0.15,1,-0.2,0.3,13,0.4,'#9aa0a8');for(let k=0;k<5;k++)P(-0.55,17.5+k,-0.55,1.1,0.3,1.1,'#2a1a10');P(-3.4,15.8,-0.6,0.8,1.4,1.2,'#d9b23a');P(2.6,15.8,-0.6,0.8,1.4,1.2,'#d9b23a');P(-2.6,0,-2.6,5.2,0.5,5.2,'#6a5a40');OBJGEO.bsword=mk([[['#b8bcc4','#d8dce4'],'metal']])}
    // 51 kości i rdzewiejąca zbroja
    {P(-4,0,-2,8,1.2,4,'#6a6a6a');P(-3,1.2,-1.5,6,2.4,3,'#7a7470');P(4.5,0,0,3.4,3,3.4,BONE);P(5,1,3.2,1,1,0.4,'#1a1612');P(6.6,1,3.2,1,1,0.4,'#1a1612');for(const [x,z,w,d] of [[-8,3,6,1],[-6,-4,1,6],[1,5,7,1],[-2,-6,5,1]])P(x,0,z,w,1,d,BD);P(-1,0,3,2.4,2.4,2.4,'#8a5a3a');P(-3.6,3.6,-1.2,7.2,0.4,2.4,'#8a5a3a');P(4.6,3,0.3,3.2,0.6,2.8,'#d8d0b8');P(-5,0,-1,1.2,1.8,2,'#6a6a6a');OBJGEO.bones=mk([[[BONE,BD],'bone'],[['#6a6a6a','#7a7470'],'metal']])}
    // 52 szklane kolce (stopiony piasek)
    {const GC=['#bfe8e8','#d8f8f6','#a8dcd8','#e8fffc'];P(-4,0,-4,8,0.4,8,'#d8c890');for(const [x,z,w,h,c] of [[0,0,2.4,12,'#bfe8e8'],[3,1,1.6,7,'#d8f8f6'],[-2.4,1.6,1.4,6,'#a8dcd8'],[1,-2.6,1.2,5,'#e8fffc'],[-1.4,-1.6,1,4,'#bfe8e8'],[2.6,-1.6,0.8,3,'#a8dcd8']]){for(let k=0;k<4;k++){const ww=w*(1-k*0.22);P(x-ww/2,k*h/4,z-ww/2,ww,h/4+0.02,ww,k%2?c:GC[(k+1)%4])}P(x-w*0.12,h,z-w*0.12,w*0.24,h*0.12,w*0.24,'!#f4ffff')}OBJGEO.glassp=mk([[GC,'crystal']])}
/*BIODECO*/
    Object.assign(TRUNK,{floatisle:[0,1,1],deadtree:[0.35,40,40],geyser:[1.6,12,12],scarecrow:[0.15,18,18],haystack:[1.4,24,24],iceblock:[1.6,28,28],voidrock:[1.0,54,54],stilthut:[0.3,16,16],ropepost:[0.3,22,22],runestone:[0.6,30,30],voidshard:[0.2,9,9],redarch:[1.6,56,56],meteor:[1.8,20,20],ambertree:[0.32,30,30],bloodtree:[0.32,26,26],glowshroom:[0.3,26,26],giantflower:[0.15,40,40],giantflower2:[0.18,46,46],basaltcol:[1.6,24,24],glowreed:[0,1,1],hoodoo:[0.7,60,60]});
    Object.assign(TRUNK,{titanskull:[3.4,50,50],titanblade:[0.6,90,90],stonetree:[0.35,30,30],saltpillar:[1.1,34,34],cloudpuff:[0,1,1],rainbowrock:[1.2,44,44],tarpit:[0,1,1],lanterntree:[0.35,30,30],frosttree:[0.3,26,26],deadcoral:[0.5,14,14],webtree:[0.32,32,32],cocoon:[0.4,6,6],stonelantern:[0.45,20,20],gear:[2.8,50,50],pipe:[1.4,30,30]});
    Object.assign(TRUNK,{petree:[0.45,48,48],bflag:[0.12,40,40],obelisk:[1.4,90,90],totem:[0.7,62,62],menhir:[1.6,34,34],wreck:[2.8,24,30],bigcrystal:[1.8,60,60],wagon:[1.3,20,20],idol:[2.4,46,46],termite:[1.7,50,50],shrine:[0.35,44,44],icicle:[1.3,56,56],skull:[2.6,38,38]})}
  OBJGEO.drygrass=voxGeo([[-3.1,0,-.3,.6,5.4,.6,'#c9b45a'],[-1.6,0,1.4,.6,7.2,.6,'#b8a048'],[.4,0,-1.8,.6,6.3,.6,'#d8c46a'],[2.2,0,.9,.6,4.8,.6,'#c9b45a'],[-.4,0,.2,.6,8.1,.6,'#e0cc78'],[1.3,0,2.6,.6,5.9,.6,'#b8a048'],[-2.4,0,-2.3,.6,4.6,.6,'#d8c46a']],0);
  OBJGEO.maple_l=voxGeo([[-3.4,0,-3.4,6.8,38,6.8,'#5a3a24'],[-18,33,-18,36,16,36,'#d0601f'],[-11,49,-11,22,11,22,'#e0832c'],[-6,60,-6,12,6,12,'#f0a83a']],0);
  OBJGEO.sakura_l=voxGeo([[-3.4,0,-3.4,6.8,38,6.8,'#4a3028'],[-18,33,-18,36,16,36,'#f0a8c0'],[-11,49,-11,22,11,22,'#f6bccd'],[-6,60,-6,12,6,12,'#ffd4e2']],0);
  // uprawy, płot, wysoka trawa
  {const L=[];for(const [x,z,h] of [[-3,-3,7],[0,-2.5,8],[3,-3.2,6.5],[-2.5,0.5,7.5],[1,0.6,8.2],[3.4,1,7],[-3.2,3.4,6.8],[0.4,3.6,7.6],[3,3.8,7.2]]){L.push([x-0.3,0,z-0.3,0.6,h,0.6,'#b89a3a'],[x-0.55,h,z-0.55,1.1,2.4,1.1,'#e0b84a'],[x+0.3,h-2,z-0.25,1.4,0.4,0.5,'#c9a84a'])}OBJGEO.wheat=voxGeo(L,0)}
  OBJGEO.cabbage=voxGeo([[-2.8,0,-2.8,5.6,3.4,5.6,'#5f9a40'],[-1.9,3.2,-1.9,3.8,1.6,3.8,'#a8d070'],[-3.6,0.4,-1.4,0.8,2.6,2.8,'#4f8a36'],[2.8,0.4,-1.4,0.8,2.6,2.8,'#4f8a36'],[-1.4,0.4,-3.6,2.8,2.6,0.8,'#4f8a36'],[-1.4,0.4,2.8,2.8,2.6,0.8,'#4f8a36']],0);
  OBJGEO.corn=voxGeo([[-0.5,0,-0.5,1,15,1,'#6a9a3a'],[0.5,5,-0.4,4,0.6,0.8,'#5f9a40'],[-4.5,8,-0.4,4,0.6,0.8,'#5f9a40'],[-0.4,10.5,0.5,0.8,0.6,3.6,'#6aa848'],[0.5,8,-0.6,1.2,3.2,1.2,'#e8c84a'],[-0.8,15,-0.8,1.6,1.6,1.6,'#c9a84a'],[-3,0,-3,1,11,1,'#6a9a3a'],[-3.4,11,-3.4,1.8,1.4,1.8,'#c9a84a'],[2.2,0,2,1,12,1,'#6a9a3a'],[1.8,12,1.6,1.8,1.4,1.8,'#c9a84a']],0);
  OBJGEO.fence=voxGeo([[-8.6,0,-0.65,1.3,8.4,1.3,'#6b4a2b'],[-8.8,8.4,-0.85,1.7,0.6,1.7,'#5a3a22'],[-7.3,5,-0.35,15.3,1,0.7,'#8a6240'],[-7.3,2.2,-0.3,15.3,1,0.6,'#7a5532']],0);
  OBJGEO.tallgrass=voxGeo([[-2.8,0,-.3,.6,9,.6,'#4f8e36'],[-1.2,0,1.4,.6,11.5,.6,'#5a9a3c'],[.6,0,-1.6,.6,8.4,.6,'#66a646'],[2.2,0,.8,.6,10.2,.6,'#4f8e36'],[-.3,0,.1,.6,12.6,.6,'#72b04e'],[1,0,2.6,.6,7.6,.6,'#5a9a3c'],[-2.1,0,-2.4,.6,8.8,.6,'#66a646'],[-.6,12.6,-.1,1,1.2,1,'#c9b45a']],0);
  // dalekie LOD
  OBJGEO.oak_l=voxGeo([[-3.6,0,-3.6,7.2,40,7.2,'#6b4528'],[-19,35,-19,38,16,38,'#3f7a35'],[-12,51,-12,24,11,24,'#4f8f3e'],[-6.5,62,-6.5,13,7,13,'#62a447']],0);
  OBJGEO.pine_l=voxGeo([[-2.3,0,-2.3,4.6,14,4.6,'#5a3a22'],[-17,12,-17,34,16,34,'#245230'],[-12,28,-12,24,16,24,'#30663c'],[-7,44,-7,14,16,14,'#3e7e4c'],[-3,60,-3,6,14,6,'#4a8c56']],0);
  OBJGEO.birch_l=voxGeo([[-1.9,0,-1.9,3.8,34,3.8,'#ece8e0'],[-12,32,-12,24,13,24,'#7ab04a'],[-8,45,-8,16,13,16,'#86bc56'],[-4,58,-4,8,8,8,'#9ccc66']],0);
}
// ---------- renderer / scena (ustawienia z kitu Pintara) ----------
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',logarithmicDepthBuffer:true});
try{const gl=renderer.getContext(),sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera();const gg=new THREE.BoxGeometry(1,1,1);gg.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(gg.attributes.position.count*3).fill(1),3));
 for(const k in CRT){const mm=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(mm,false);crTex(mm,k);sc.add(new THREE.Mesh(gg,mm))}renderer.compile(sc,cam);
 for(const p of (renderer.info.programs||[])){const mk=/crt(\d+)/.exec(p.cacheKey||'');if(mk&&p.program&&!gl.getProgramParameter(p.program,gl.LINK_STATUS)){CRT_BAD[mk[1]]=1;console.warn('crTex off',mk[1])}}}catch(e){console.warn('crt test',e)}
renderer.setPixelRatio(Math.min(devicePixelRatio||1,OPT.pr));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=S.shadows;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
$('view').appendChild(renderer.domElement);renderer.domElement.style.filter='saturate(1.1) contrast(1.06)';{const vg=document.createElement('div');vg.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at center,transparent 58%,rgba(10,6,20,.34) 100%)';$('view').appendChild(vg)}
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9cc7e6);scene.fog=new THREE.Fog(0x9cc7e6,150,520);
const camera=new THREE.PerspectiveCamera(S.fov,innerWidth/innerHeight,0.25,4000);
const hemi=new THREE.HemisphereLight(0xcfe6ff,0x5a5030,.55);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff1d6,.95);sun.castShadow=true;sun.shadow.mapSize.set(OPT.shadowSize,OPT.shadowSize);
sun.shadow.bias=-.0006;sun.shadow.normalBias=.065;
const sc=sun.shadow.camera;sc.left=-50;sc.right=50;sc.top=50;sc.bottom=-50;sc.near=1;sc.far=300;
scene.add(sun,sun.target);
const WATER_U={uT:{value:0},uSky:{value:new THREE.Color(0x9cc7e6)}};
const water=new THREE.Mesh(new THREE.PlaneGeometry(1,1,160,160),new THREE.MeshLambertMaterial({color:0x3f7db5,transparent:true,opacity:.74}));
// woda jak w Pintarze: kolor od głębokości (turkus przy brzegu, granat w głębi), przezroczystość od głębokości, piana przy brzegu, błyski słońca, zmarszczki
const WDN=256,WDEP=new THREE.DataTexture(new Uint8Array(WDN*WDN*4),WDN,WDN,THREE.RGBAFormat);WDEP.magFilter=WDEP.minFilter=THREE.LinearFilter;WDEP.generateMipmaps=false;WDEP.wrapS=WDEP.wrapT=THREE.ClampToEdgeWrapping;
Object.assign(WATER_U,{uDep:{value:WDEP},uDC:{value:new THREE.Vector2(0,0)},uDS:{value:512},uRain:{value:0},uStorm:{value:0},uNight:{value:0},uIce:{value:0}});
water.material.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{uT:WATER_U.uT,uSky:WATER_U.uSky,uDep:WATER_U.uDep,uDC:WATER_U.uDC,uDS:WATER_U.uDS,uSunW:SEAS_U.uSunW,uRain:WATER_U.uRain,uStorm:WATER_U.uStorm,uNight:WATER_U.uNight,uIce:WATER_U.uIce});
  sh.vertexShader='uniform float uT;uniform float uStorm;uniform float uIce;varying vec3 vWw;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec4 wq=modelMatrix*vec4(transformed,1.0);transformed.z+=(sin(wq.x*0.21+uT*1.3)*0.03+sin(wq.z*0.17-uT*1.1)*0.025+uStorm*(sin(wq.x*0.09+uT*1.6)*0.16+sin(wq.z*0.07+wq.x*0.03-uT*1.2)*0.12))*(1.-uIce*0.9);vWw=wq.xyz;');
  sh.fragmentShader='uniform float uT;uniform vec3 uSky;uniform sampler2D uDep;uniform vec2 uDC;uniform float uDS;uniform vec3 uSunW;uniform float uRain;uniform float uStorm;uniform float uNight;uniform float uIce;varying vec3 vWw;float h21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}\n'+sh.fragmentShader
   .replace('#include <color_fragment>','#include <color_fragment>\nvec2 wuv=(vWw.xz-uDC)/uDS+.5;float dd=(wuv.x<0.||wuv.y<0.||wuv.x>1.||wuv.y>1.)?1.:texture2D(uDep,wuv).r;\nvec3 wc=mix(vec3(.46,.76,.7),vec3(.1,.34,.5),smoothstep(0.,1.,dd));float r1=sin(vWw.x*0.9+uT*1.7)*sin(vWw.z*0.8-uT*1.3)+0.5*sin(vWw.x*2.3-vWw.z*1.9+uT*2.6);wc*=0.94+0.06*r1;\nvec3 vdw=normalize(cameraPosition-vWw);float frw=pow(1.0-clamp(vdw.y,0.0,1.0),3.0);wc=mix(wc,uSky*0.92,frw*0.45);\nfloat shore=1.-smoothstep(0.,.09,dd);float fw=sin(dd*95.-uT*2.1+h21(floor(vWw.xz*1.5))*5.)*.5+.5;float lace=step(.35,h21(floor(vWw.xz*4.+vec2(uT*.6,0.))));float foam=shore*smoothstep(.55,.92,fw)*(.55+.45*lace)+(1.-smoothstep(0.,.025,dd))*.75;\nwc=mix(wc,vec3(.95,.98,1.),clamp(foam,0.,1.)*.85);\nif(uRain>0.){vec2 rc=floor(vWw.xz*1.2);vec2 rf=fract(vWw.xz*1.2)-.5;float ph=fract(uT*1.4+h21(rc)*7.);float rr=length(rf+vec2(h21(rc+3.)-.5,h21(rc+7.)-.5)*.5);float ring=smoothstep(.05,0.,abs(rr-ph*.45))*(1.-ph)*step(h21(rc+floor(uT*1.4+h21(rc)*7.)),.55);wc+=vec3(.5,.55,.6)*ring*uRain;}\nif(uStorm>0.){float cap=smoothstep(.75,1.,sin(vWw.x*.09+uT*1.6)*.5+sin(vWw.z*.07+vWw.x*.03-uT*1.2)*.5+.3);wc=mix(wc*0.8,vec3(.92,.95,.97),cap*uStorm*.6);}\nfloat icef=uIce*(1.-smoothstep(.35,.55,dd));if(icef>0.){vec2 ic=floor(vWw.xz*.35);float cr=smoothstep(.04,0.,min(abs(fract(vWw.x*.35+h21(ic)*.3)-.5),abs(fract(vWw.z*.35+h21(ic+2.)*.3)-.5)));vec3 icec=mix(vec3(.82,.9,.96),vec3(.68,.8,.9),h21(ic))-cr*.18;wc=mix(wc,icec,icef);}\ndiffuseColor.rgb=wc;diffuseColor.a=max(mix(.4,.74,smoothstep(0.,.8,dd)),foam*.9);diffuseColor.a=mix(diffuseColor.a,.95,frw*.6);diffuseColor.a=mix(diffuseColor.a,.96,icef);')
   .replace('#include <dithering_fragment>','#include <dithering_fragment>\n{vec3 V=normalize(cameraPosition-vWw);vec2 cell=floor(vWw.xz*3.);float tw=floor(uT*1.3+h21(cell)*7.);float r=h21(cell+tw*1.37);vec3 Rr=reflect(-V,vec3(0.,1.,0.));vec3 sd=normalize(uSunW);float al=max(dot(Rr,sd),0.);float gl=clamp(sd.y*3.,0.,1.);float sp=step(.955,r)*pow(al,10.)*.75;float band=pow(al,22.)*.14;gl_FragColor.rgb+=vec3(1.,.93,.75)*(sp+band)*gl*(1.-uIce*.7);gl_FragColor.a=min(1.,gl_FragColor.a+(sp+band)*gl*.4);if(uNight>0.&&uIce<.5){vec2 pc=floor(vWw.xz*4.);float pf=h21(pc+floor(uT*.7+h21(pc)*5.));float pl=step(.975,pf)*(.5+.5*sin(uT*3.+h21(pc)*20.));gl_FragColor.rgb+=vec3(.15,.85,.75)*pl*uNight*.9;}}')};
water.material.customProgramCacheKey=()=>'waterP4';
function rippleTex(seed,sz){sz=sz||128;const c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d');g.lineCap='round';const hh=(i,k)=>{const x=Math.sin(i*127.1+seed*311.7+k*74.7)*43758.5453;return x-Math.floor(x)};
  for(let i=0;i<54;i++){const x=hh(i,1)*sz,y=hh(i,2)*sz,L=5+hh(i,3)*12,a=.2+hh(i,4)*.45;g.strokeStyle=`rgba(236,249,255,${a})`;g.lineWidth=1.4;for(const ox of [-sz,0,sz])for(const oy of [-sz,0,sz]){g.beginPath();g.moveTo(x+ox-L/2,y+oy);g.quadraticCurveTo(x+ox,y+oy-2.6,x+ox+L/2,y+oy);g.stroke()}}
  for(let i=0;i<26;i++){g.fillStyle=`rgba(255,255,255,${.35+hh(i,6)*.5})`;g.fillRect(hh(i,7)*sz|0,hh(i,8)*sz|0,2,2)}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;return t}
const WRIP=[[rippleTex(1),6,0.42,0.02,[.011,.006]],[rippleTex(2),9.5,0.32,0.04,[-.007,.012]]].map(([tx,rep,op,dy,sp])=>{const ms=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshLambertMaterial({map:tx,transparent:true,opacity:op,depthWrite:false}));ms.rotation.x=-Math.PI/2;ms.renderOrder=3;scene.add(ms);return{ms,tx,rep,op,dy,sp}});
let wdepC=null,wdepT=0,wdepN=-1;
function waterDepthTick(cx,cz,ws){const now=performance.now();if(wdepC&&Math.hypot(cx-wdepC[0],cz-wdepC[1])<ws*0.12&&(now-wdepT<4000||wdepN===CHUNKN))return;/* v144: mapa głębokości liczona tylko po ruchu albo nowych fragmentach terenu */wdepT=now;wdepN=CHUNKN;wdepC=[cx,cz];const a=WDEP.image.data,st=ws/WDN,x0=cx-ws/2,z0=cz-ws/2;
  let lcx=1e9,lcz=1e9,lch=null;const hAt=(x,z)=>{const cx=Math.floor(x/C),cz=Math.floor(z/C);if(cx!==lcx||cz!==lcz){lcx=cx;lcz=cz;let ch=chunks.get(K(cx,cz));if(!ch||!ch.heights)ch=hcache.get(K(cx,cz));lch=ch&&ch.heights?ch.heights:null}if(!lch)return null;return lch[(Math.floor(z)-cz*C)*C+Math.floor(x)-cx*C]};
  for(let j=0;j<WDN;j++)for(let i=0;i<WDN;i++){const h=hAt(x0+(i+0.5)*st,z0+(j+0.5)*st);const d=h==null?1:h>=WATER?0:Math.min(1,(WATER-h)/8);const o=(j*WDN+i)*4;a[o]=a[o+1]=a[o+2]=Math.round(d*255);a[o+3]=255}
  WDEP.needsUpdate=true;WATER_U.uDC.value.set(cx,cz);WATER_U.uDS.value=ws}
water.rotation.x=-Math.PI/2; water.renderOrder=2; scene.add(water);
const terrainMat=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});seasonPatch(terrainMat,true);
// woda rzek powyżej poziomu morza i wodospady (uv.x: 0 = tafla, 1 = wodospad; uv.y: głębokość 0..1 albo wysokość)
const RIVMAT=new THREE.MeshLambertMaterial({color:0x4f93c4,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false});
RIVMAT.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{uT:WATER_U.uT,uSky:WATER_U.uSky});
  sh.vertexShader='attribute vec2 aW;varying vec2 vW;varying vec3 vWw;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvW=aW;vWw=(modelMatrix*vec4(transformed,1.0)).xyz;');
  sh.fragmentShader='uniform float uT;uniform vec3 uSky;varying vec2 vW;varying vec3 vWw;float h21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}\n'+sh.fragmentShader
   .replace('#include <color_fragment>','#include <color_fragment>\nif(vW.x<.5){float dd=clamp(vW.y,0.,1.);vec3 wc=mix(vec3(.5,.8,.76),vec3(.16,.42,.6),smoothstep(0.,1.,dd));float r1=sin(vWw.x*1.1+uT*2.3)*sin(vWw.z*1.0-uT*1.9)+.5*sin(vWw.x*2.6-vWw.z*2.1+uT*3.2);wc*=.94+.07*r1;vec3 vdw=normalize(cameraPosition-vWw);float frw=pow(1.-clamp(vdw.y,0.,1.),3.);wc=mix(wc,uSky*.92,frw*.4);float lace=step(.4,h21(floor(vWw.xz*4.+vec2(uT*.9,uT*.4))));float foam=(1.-smoothstep(0.,.22,dd))*(.5+.5*lace);float st=step(.93,h21(floor(vWw.xz*vec2(2.,5.)+vec2(uT*1.6,0.))));wc=mix(wc,vec3(.95,.98,1.),clamp(foam*.8+st*.25,0.,1.));diffuseColor.rgb=wc;diffuseColor.a=max(mix(.5,.9,smoothstep(0.,.8,dd)),foam*.9);}\nelse{float fh=max(vW.x-1.,.5),ft=clamp(vW.y,0.,1.),uu=(vWw.x+vWw.z);float col=floor(uu*4.);float s1=h21(vec2(col,3.));float sp=1.6+s1*1.1;float v1=fract(vWw.y*.22+uT*sp+s1*9.);float st1=smoothstep(.5,.05,abs(v1-.5))*(.4+.6*h21(vec2(col,floor(vWw.y*.22+uT*sp+s1*9.))));float col2=floor(uu*9.+3.);float s2=h21(vec2(col2,7.));float v2=fract(vWw.y*.6+uT*(2.4+s2)+s2*5.);float st2=smoothstep(.5,.15,abs(v2-.5))*.5;float sheet=.5+.5*sin(uu*2.1+vWw.y*.8+uT*4.);vec3 deep=vec3(.2,.48,.66),lt=vec3(.55,.8,.9);vec3 wc=mix(deep,lt,.35+.3*sheet);wc=mix(wc,vec3(.96,.99,1.),clamp(st1*.85+st2*.5,0.,1.));float lip=smoothstep(.88,1.,ft);wc=mix(wc,vec3(.8,.93,.98),lip*.6);float foam=1.-smoothstep(0.,min(.45,1.6/fh),ft);float fn=h21(floor(vec2(uu*6.,vWw.y*6.)+vec2(0.,uT*8.)));wc=mix(wc,vec3(.97,.99,1.),clamp(foam*(.6+.4*fn),0.,1.));diffuseColor.rgb=wc;diffuseColor.a=clamp(.72+.2*st1+.2*foam+.1*lip,0.,.97);}')};
{const ob=RIVMAT.onBeforeCompile;RIVMAT.onBeforeCompile=sh=>{ob(sh);sh.fragmentShader=sh.fragmentShader.replace(/\(\s*gl_FrontFacing\s*\)\s*\?\s*vLightFront\s*:\s*vLightBack/g,'vLightFront').replace(/\(\s*gl_FrontFacing\s*\)\s*\?\s*vIndirectFront\s*:\s*vIndirectBack/g,'vIndirectFront')}}
RIVMAT.customProgramCacheKey=()=>'riverP3';
const FALLS=[];

const UWC=new THREE.Color(0x24607f);

// ---------- geometria wokselowa ----------
// v119: pamięć gotowych brył dla powtarzalnych części (stwory, konie, ozdoby) — bez ponownego składania przy każdym pojawieniu się
const BXC=new Map();function boxesC(list){if(list.length>600)return boxes(list);const k=JSON.stringify(list);let g=BXC.get(k);if(!g){g=boxes(list);g.userData.keep=1;BXC.set(k,g);if(BXC.size>1500){const f=BXC.keys().next().value;BXC.delete(f)}}return g}
function boxes(list){return voxGeo(deZ(vb(list.map(b=>typeof b[6]==='string'&&b[6][0]==='!'?[b[0],b[1],b[2],b[3],b[4],b[5],b[6].slice(1)].concat(b.slice(7)):b))),.06)}
const GLOWMAT=new THREE.MeshBasicMaterial({vertexColors:true});   // wszystkie modele gry idą przez voxGeo z kitu
