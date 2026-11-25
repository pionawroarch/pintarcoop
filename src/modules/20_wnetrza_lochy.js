// =================== PRZESTRZENIE ZAMKNIĘTE: wnętrza budynków, lochy, jaskinie ===================
// Każda przestrzeń leży wysoko nad swoim miejscem na mapie (y≥560), ma siatkę ścian (solid) i własną podłogę.
const SPACES=new Map();let SPC=null;const ENTERABLE={zamek:'Zamek królewski — sala tronowa',karczma:'Karczma',kuznia:'Kuźnia',sklep:'Sklep',piekarnia:'Piekarnia',kaplica:'Kaplica',warsztat:'Warsztat',stajnia:'Stajnia',spichlerz:'Spichlerz',dom:'Dom'};
function spaceH(x,z,y){for(const s of SPACES.values()){if(y<s.fy-8||y>s.fy+s.ceil+6)continue;const i=Math.floor((x-s.x0)/s.cs),j=Math.floor((z-s.z0)/s.cs);if(i<0||j<0||i>=s.W||j>=s.D)continue;if(s.solid[j*s.W+i])return s.fy+60;if(s.pc&&y<s.fy+4){for(const q of s.pc)if(x>q[0]&&x<q[2]&&z>q[1]&&z<q[3])return s.fy+q[4]}return s.fy}return null}
const curSpaceKind=()=>SPC?SPC.kind:null;
function spaceIn(p){for(const s of SPACES.values()){if(p.y<s.fy-8||p.y>s.fy+s.ceil+6)continue;if(p.x>=s.x0&&p.z>=s.z0&&p.x<s.x0+s.W*s.cs&&p.z<s.z0+s.D*s.cs)return s}return null}
// --- wnętrza ---
function doorOf(h){if(h.big){const M=LMK[h.func],lx=M.dx||0,lz=M.dz+0.7,cs=Math.cos(h.rot),sn=Math.sin(h.rot);return[h.x+lx*cs+lz*sn,h.z-lx*sn+lz*cs]}const c=h.core,lx=c.ox,lz=c.oz+c.d/2+0.7,cs=Math.cos(h.rot),sn=Math.sin(h.rot);return[h.x+lx*cs+lz*sn,h.z-lx*sn+lz*cs]}
// ===== KRÓLEWSKI ZAMEK MIASTA: ogromna budowla na końcu głównej alei, architektura rasy i regionu =====
const KC_STY={ludzie:{w:'#9a948c',wd:'#7e7870',wl:'#b4aea4',rf:'#a8452f',rf2:'#8a3424',tr:'#c9a24a',bn:'#7a1f1f',tw:'cone',sq:0,hk:1},
  elfy:{w:'#ece6d4',wd:'#d6ceb8',wl:'#fbf7ea',rf:'#3f8a5a',rf2:'#2f6e46',tr:'#d9b23a',bn:'#2f6e46',tw:'spire',sq:0,hk:1.25},
  krasnoludy:{w:'#5d5a63',wd:'#4a4750',wl:'#77727c',rf:'#3a3640',rf2:'#2a2630',tr:'#c9a24a',bn:'#5a4a8a',tw:'flat',sq:1,hk:0.85},
  orkowie:{w:'#4e4640',wd:'#3a342e',wl:'#655a50',rf:'#5a3a22',rf2:'#3a2414',tr:'#a8452f',bn:'#8a2a1a',tw:'spike',sq:1,hk:0.9},
  niziolki:{w:'#d8c9a8',wd:'#bca984',wl:'#eadcbc',rf:'#5a8a3a',rf2:'#4a7a2e',tr:'#c9a24a',bn:'#5f7a3a',tw:'dome',sq:0,hk:0.7},
  drowy:{w:'#2e2836',wd:'#221d28',wl:'#3e3648',rf:'#4a2e6a',rf2:'#36204e',tr:'#c890ff',bn:'#4a2e6a',tw:'spike',sq:0,hk:1.15},
  saurianie:{w:'#6a8a6a',wd:'#557055',wl:'#86a486',rf:'#3a6a4a',rf2:'#2a5a3a',tr:'#d9b23a',bn:'#2a6a5a',tw:'zig',sq:1,hk:1}};
function kcStyle(race,sty){const S=Object.assign({},KC_STY[race]||KC_STY.ludzie);if(race==='ludzie'||race==='niziolki'){if(sty==='pustynia')Object.assign(S,{w:'#d8bf8a',wd:'#c0a674',wl:'#ead4a2',rf:'#c8743a',rf2:'#a85a2a',tw:'dome'});if(sty==='polnoc')Object.assign(S,{w:'#8a8e96',wd:'#6e727a',wl:'#a4a8b0',rf:'#3e4350',rf2:'#2e333e'});if(sty==='tropik')Object.assign(S,{w:'#efe8d4',wd:'#d8d0b8',wl:'#fbf6e6',rf:'#2a7a7a',rf2:'#1e6060',tw:'dome'});if(sty==='port')Object.assign(S,{w:'#e4e0d6',wd:'#ccc6b8',wl:'#f4f0e8',rf:'#2f5f8f',rf2:'#244c74'})}return S}
function kcastleList(race,sty){const S=kcStyle(race,sty),L=[],P=(...b)=>L.push(b),HK=S.hk,G='!#ffcf6a',GW=race==='drowy'?'!#c890ff':G,DK='#1a1612',WO='#4a2f1d',WO2='#6b4a2b',IR='#3a3a40',TW=S.tw;
  let sd=11;const rn=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
  const B=1,WH=9*HK,R2=17,PH=10*HK,KH=20*HK;
  // kamienie licowe: pojedyncze jaśniejsze i ciemniejsze bloki na ścianie (ax: 'z' = ściana wzdłuż X o normalnej ±Z)
  const stones=(ax,f,a0,a1,y0,y1,dens)=>{const n=Math.round((a1-a0)*(y1-y0)*dens);for(let i=0;i<n;i++){const a=a0+0.7+rn()*Math.max(0.1,a1-a0-1.4),y=y0+0.3+rn()*Math.max(0.1,y1-y0-0.6),w=0.7+rn()*0.8,h=0.34+rn()*0.16,c=rn()<0.55?S.wd:S.wl;if(ax==='z')P(a,y,f,w,h,0.1,c);else P(f,y,a,0.1,h,w,c)}};
  const oct=(x,y,z,r,h,c)=>{P(x,y,z,2*r,h,r*0.84,c);P(x,y,z,r*0.84,h,2*r,c);P(x,y,z,r*1.5,h,r*1.5,c)};
  const flag=(x,y,z,s)=>{s=s||1;P(x,y+0.9*s,z,0.12,1.8*s,0.12,S.tr);P(x+0.5*s,y+1.4*s,z,0.9*s,0.55*s,0.05,S.bn);P(x+1.05*s,y+1.4*s,z,0.3*s,0.3*s,0.05,S.bn);P(x,y+1.85*s,z,0.22,0.22,0.22,S.tr)};
  // dach wieży w stylu rasy
  const roof=(x,y,z,r,sq)=>{const t=TW,ring=(yy,rr,hh,c)=>{if(sq)P(x,yy,z,2*rr,hh,2*rr,c);else oct(x,yy,z,rr,hh,c)};
    if(t==='flat'){ring(y+0.1,r+0.35,0.2,S.wd);for(let a=0;a<8;a++){const c=Math.cos(a/8*6.283),s=Math.sin(a/8*6.283),q=sq?(a%2?1.3:1):1;P(x+c*(r+0.1)*q,y+0.75,z+s*(r+0.1)*q,0.9,1.1,0.9,S.wl)}P(x,y+0.5,z,1.1,0.6,1.1,IR);P(x,y+0.95,z,0.8,0.3,0.8,'!#ff8a2a');flag(x+r*0.5,y+0.2,z-r*0.5,1);return}
    if(t==='zig'){for(let k=0;k<3;k++){const w=2*r*(1-k*0.26)+0.6;P(x,y+0.55+k*1.1,z,w,1.1,w,k%2?S.wd:S.w);P(x,y+1.08+k*1.1,z,w+0.2,0.12,w+0.2,S.wl)}P(x,y+3.9,z,r*0.7,1,r*0.7,S.tr);P(x,y+4.6,z,r*0.4,0.5,r*0.4,'!#ffcf6a');return}
    if(t==='dome'){ring(y+0.45,r-0.15,0.9,S.wl);const n=6,H=r*1.25;for(let k=0;k<n;k++){const f=k/n,rr=(r+0.25)*Math.sqrt(1-f*f);ring(y+0.9+H*f+H/n/2,Math.max(0.3,rr),H/n+0.02,k%2?S.rf2:S.rf)}P(x,y+0.9+H+0.3,z,0.3,0.6,0.3,S.tr);P(x,y+0.9+H+0.8,z,0.5,0.5,0.5,S.tr);P(x,y+0.9+H+1.5,z,0.1,1,0.1,S.tr);return}
    const H=t==='spire'?r*5.4:t==='spike'?r*3.8:r*2.7,n=t==='spire'?12:9;ring(y+0.2,r+0.75,0.4,S.rf2);
    for(let k=0;k<n;k++){const f=k/n,rr=(r+0.6)*(t==='spire'?Math.pow(1-f,1.35):1-f);ring(y+0.4+H*f+H/n/2,Math.max(0.16,rr),H/n+0.02,k%2?S.rf2:S.rf)}
    if(t==='spike')for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){P(x+dx*(r+0.5),y+0.9,z+dz*(r+0.5),0.35,1.8,0.35,S.rf2);P(x+dx*(r+0.5),y+2.1,z+dz*(r+0.5),0.2,0.8,0.2,S.tr)}
    if(r>2.6&&t!=='spike')for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const ox=x+dx*(r*0.62),oz=z+dz*(r*0.62);P(ox,y+1.4,oz,dx?0.7:0.9,1.1,dz?0.7:0.9,S.wl);P(ox+dx*0.36,y+1.35,oz+dz*0.36,dx?0.06:0.45,0.6,dz?0.06:0.45,GW);P(ox,y+2.05,oz,dx?1.0:1.2,0.25,dz?1.0:1.2,S.rf2)}
    flag(x,y+0.4+H-0.2,z,r>3?1.5:1.1)};
  // wieża: cokół, opaski, strzelnice, wieniec machikuł, dach
  const tower=(x,z,r,h,sq,y0,noRoof)=>{y0=y0||0;const ring=(yy,rr,hh,c)=>{if(sq)P(x,yy,z,2*rr,hh,2*rr,c);else oct(x,yy,z,rr,hh,c)};
    ring(y0+h/2,r,h,S.w);ring(y0+0.8,r+0.3,1.6,S.wd);ring(y0+1.75,r+0.15,0.3,S.wl);const nb=Math.max(1,Math.round(h/6));for(let k=1;k<=nb;k++)ring(y0+h*k/(nb+1),r+0.07,0.28,S.wl);
    ring(y0+h-0.9,r+0.28,0.5,S.wd);ring(y0+h-0.3,r+0.5,0.7,S.wl);
    for(let a=0;a<8;a++){const c=Math.cos(a/8*6.283),s=Math.sin(a/8*6.283),q=(sq&&a%2)?1.38:1;P(x+c*(r+0.3)*q,y0+h-1.35,z+s*(r+0.3)*q,0.5,0.5,0.5,S.wd)}
    const nw=Math.max(2,Math.round((h-5)/3.2));for(let k=0;k<nw;k++){const yy=y0+3.2+k*(h-6)/Math.max(1,nw-1)*(nw>1?1:0);for(const [dx,dz] of [[0,1],[1,0],[0,-1],[-1,0]]){if((k+(dx?1:0))%2)continue;const lit=(k+Math.round(x+z))%3===0;P(x+dx*(r+0.03),yy,z+dz*(r+0.03),dx?0.08:0.4,1.3,dz?0.08:0.4,lit?GW:DK);P(x+dx*(r+0.05),yy-0.78,z+dz*(r+0.05),dx?0.14:0.7,0.16,dz?0.14:0.7,S.wl)}}
    for(let i=0;i<Math.round(h*r*0.22);i++){const a=Math.floor(rn()*4),yy=y0+2.2+rn()*(h-4.5),o=(rn()-0.5)*r*0.5,dx=[0,1,0,-1][a],dz=[1,0,-1,0][a],c=rn()<0.55?S.wd:S.wl;P(x+dx*(r+0.02)+(dz?o:0),yy,z+dz*(r+0.02)+(dx?o:0),dx?0.1:0.6,0.34,dz?0.1:0.6,c)}
    if(!noRoof)roof(x,y0+h,z,r,sq)};
  // odcinek muru kurtynowego: cokół, gzyms, chodnik straży, blanki, strzelnice, kamienie
  const curt=(ax,c,a0,a1,out)=>{const w=a1-a0,m=(a0+a1)/2,Q=(a,y,off,la,h,th,col)=>{if(ax==='z')P(a,y,c+off,la,h,th,col);else P(c+off,y,a,th,h,la,col)};
    Q(m,B+WH/2,0,w,WH,2,S.w);Q(m,B+0.7,out*0.2,w,1.4,2.2,S.wd);Q(m,B+1.5,out*0.12,w,0.25,2.1,S.wl);Q(m,B+WH-0.2,out*0.25,w,0.4,2.5,S.wl);Q(m,B+WH+0.08,-out*0.3,w,0.16,2.9,S.wd);
    for(let a=a0+0.8;a<a1-0.3;a+=1.7)Q(a,B+WH+0.7,out*1.05,1.0,1.2,0.6,S.wl);Q(m,B+WH+0.3,out*1.05,w,0.44,0.5,S.w);Q(m,B+WH+0.4,-out*1.55,w,0.5,0.25,WO2);for(let a=a0+1;a<a1;a+=2.4)Q(a,B+WH-0.5,-out*1.45,0.25,1.0,0.5,WO);
    for(let a=a0+1;a<a1-0.5;a+=1.5)Q(a,B+WH-0.7,out*1.3,0.5,0.6,0.5,S.wd);
    for(let a=a0+2.5;a<a1-2;a+=4)Q(a,B+WH*0.55,out*1.01,0.3,1.3,0.08,DK);
    stones(ax,c+out*1.02,a0,a1,B+1.8,B+WH-0.8,0.05);stones(ax,c-out*1.02,a0,a1,B+1.8,B+WH-0.8,0.03)};
  // ===== podest i schody =====
  P(0,-3.2,0,46,6.4,46,S.wd);P(0,0.5,0,46,1,46,S.w);P(0,0.86,0,46.5,0.3,46.5,S.wl);
  for(let k=-20;k<=20;k+=5)for(const [x,z,ax] of [[k,23.1,0],[k,-23.1,0],[23.1,k,1],[-23.1,k,1]]){if(!ax&&z>0&&Math.abs(x)<8)continue;P(x,-1.4,z,ax?0.9:1.6,4.4,ax?1.6:0.9,S.w);P(x,0.4,z,ax?0.6:1.3,0.9,ax?1.3:0.6,S.wl)}
  for(let i=-5;i<=5;i++)for(let j=-5;j<=5;j++){if((i+j)&1)continue;P(i*4.1,1.02,j*4.1,4.0,0.05,4.0,S.wl)}
  P(0,1.04,17,4.6,0.06,12.5,S.wl);for(let z=11.6;z<23;z+=1.3)P(0,1.07,z,4.6,0.04,0.12,S.wd);
  for(let i=0;i<6;i++)P(0,0.9-i*0.22,23.3+i*0.55,13-i*0.1,0.24,0.6,i%2?S.wd:S.wl);
  for(const sx of [-1,1]){P(sx*7.2,0.6,24.6,1.3,2.6,3.6,S.w);P(sx*7.2,1.95,24.6,1.6,0.25,3.9,S.wl);P(sx*7.2,2.5,25.6,1.0,0.9,1.0,S.wd);P(sx*7.2,3.1,25.6,0.7,0.35,0.7,IR);P(sx*7.2,3.4,25.6,0.5,0.3,0.5,'!#ff8a2a');
    P(sx*7.2,2.6,23.7,0.9,1.1,1.5,'#c8b878');P(sx*7.2,3.4,24.2,0.8,0.8,0.8,'#c8b878');P(sx*7.2,3.55,24.65,0.5,0.4,0.2,'#a89858');P(sx*7.2,2.3,24.3,0.6,0.5,0.6,'#c8b878')}
  // ===== mury =====
  curt('z',-R2,-R2+3.4,R2-3.4,-1);curt('x',-R2,-R2+3.4,R2-3.4,-1);curt('x',R2,-R2+3.4,R2-3.4,1);curt('z',R2,-R2+3.4,-7.6,1);curt('z',R2,7.6,R2-3.4,1);
  for(const [x,z] of [[-10.5,R2+1.12],[10.5,R2+1.12],[-R2-1.12,-8.5],[R2+1.12,-8.5],[-R2-1.12,8.5],[R2+1.12,8.5],[-8.5,-R2-1.12],[8.5,-R2-1.12]]){const ax=Math.abs(x)>R2;P(x,B+WH-3.0,z,ax?0.08:1.7,4.4,ax?1.7:0.08,S.bn);P(x,B+WH-0.75,z,ax?0.14:2.0,0.22,ax?2.0:0.14,S.tr);P(x,B+WH-2.6,z+(ax?0:0.03),ax?0.1:0.8,0.8,ax?0.8:0.1,S.tr);P(x,B+WH-5.3,z,ax?0.08:1.0,0.5,ax?1.0:0.08,S.bn)}
  // ===== brama: wieże, łuk, podniesiona krata, otwarte wrota, most =====
  for(const sx of [-1,1])tower(sx*5,R2+0.5,3,WH+5.5,S.sq,B);
  P(0,B+WH/2+3.0,R2+0.3,4.4,WH-4.6,3.0,S.w);P(0,B+5.9,R2+0.3,4.2,0.5,3.3,S.wl);
  for(const sx of [-1,1]){P(sx*1.75,B+5.1,R2+0.3,0.5,1.2,3.0,S.w);P(sx*1.35,B+5.45,R2+0.3,0.4,0.6,3.0,S.w);P(sx*2.05,B+2.2,R2+1.72,0.3,4.4,0.3,S.wl);P(sx*2.05,B+2.2,R2-1.12,0.3,4.4,0.3,S.wl)}
  for(let q=-1.6;q<=1.61;q+=0.4){P(q,B+4.9,R2+1.2,0.1,1.6,0.1,IR);P(q,B+4.0,R2+1.2,0.14,0.25,0.14,'#55555c')}for(const y of [4.5,5.2])P(0,B+y,R2+1.2,3.5,0.1,0.1,IR);
  for(const sx of [-1,1]){P(sx*1.9,B+2.3,R2-2.1,0.22,4.6,2.0,WO2);for(const y of [0.9,2.3,3.7])P(sx*1.78,B+y,R2-2.1,0.06,0.2,2.0,IR)}
  P(0,B+WH+0.2,R2+0.3,4.4,0.3,3.4,S.wd);for(let q=-1.7;q<=1.7;q+=1.13){P(q,B+WH+0.9,R2+1.75,0.8,1.1,0.5,S.wl);P(q,B+WH-0.5,R2+1.95,0.5,0.6,0.5,S.wd)}
  P(0,B+WH-2.0,R2+1.84,2.4,2.8,0.12,S.tr);P(0,B+WH-1.9,R2+1.92,1.9,2.2,0.08,S.bn);P(0,B+WH-1.6,R2+1.98,0.5,1.3,0.05,S.tr);P(0,B+WH-1.6,R2+1.98,1.3,0.4,0.05,S.tr);P(0,B+WH-3.3,R2+1.92,1.0,0.5,0.08,S.bn);
  for(const sx of [-1,1]){P(sx*2.75,B+3.4,R2+3.6,0.3,0.7,0.3,IR);P(sx*2.75,B+3.95,R2+3.6,0.26,0.45,0.26,'!#ff9a3a');P(sx*2.75,B+3.1,R2+3.75,0.12,0.12,0.5,IR)}
  P(0,B+0.1,R2+3.9,4.4,0.16,4.4,WO2);for(let z=R2+2;z<R2+6;z+=0.8)P(0,B+0.2,z,4.4,0.03,0.08,WO);for(const sx of [-1,1]){P(sx*2.3,B+0.5,R2+5.9,0.3,1.0,0.3,WO);P(sx*2.3,B+0.45,R2+3.9,0.12,0.12,4.2,WO)}
  // ===== wieże narożne i baszty =====
  for(const sx of [-1,1])for(const sz of [-1,1])tower(sx*R2,sz*R2,3.8,WH+8,S.sq,B);
  for(const [x,z] of [[-R2,0],[R2,0],[0,-R2]])tower(x,z,2.4,WH+4,S.sq,B);
  // ===== pałac i donżon =====
  const win=(x,y,z,w,h,lit,ax)=>{const d=0.12,Q=(dx,dy,ww,hh,c,o)=>{if(ax)P(x+(o||0)*ax,y+dy,z+dx,d,hh,ww,c);else P(x+dx,y+dy,z+(o||0),ww,hh,d,c)};Q(0,0,w+0.5,h+0.5,S.wl,0);Q(0,0,w,h,lit?GW:DK,0.04);Q(0,h/2+0.35,w*0.66,0.5,S.wl,0);Q(0,h/2+0.3,w*0.4,0.36,lit?GW:DK,0.04);Q(0,-h/2-0.3,w+0.9,0.2,S.wl,0.08);Q(0,0,0.1,h,S.wl,0.08);Q(0,h*0.12,w,0.1,S.wl,0.08)};
  // ogromne okno ostrołukowe z maswerkiem: rama, ościeża, laski, poprzeczki, witrażowa rozeta w łuku, parapet
  const bigWin=(x,y,z,w,h,ax,lit,fz)=>{const Q=(dx,dy,ww,hh,c,o)=>{if(ax)P(x+(o||0)*ax,y+dy,z+dx,0.12,hh,ww,c);else P(x+dx,y+dy,z+(o||0)*(fz||1),ww,hh,0.12,c)};
    Q(0,0,w+0.7,h+0.4,S.wd,0);Q(0,0,w,h,lit?GW:'#2a3448',0.05);for(const [k,ww] of [[0,w*0.82],[1,w*0.62],[2,w*0.4],[3,w*0.2]]){Q(0,h/2+0.25+k*0.42,ww+0.5,0.44,S.wd,0);Q(0,h/2+0.25+k*0.42,ww,0.44,lit?GW:'#2a3448',0.05)}
    for(const dx of [-w/3,w/3])Q(dx,0,0.14,h,S.wl,0.1);for(let k=1;k<4;k++)Q(0,-h/2+k*h/4,w,0.12,S.wl,0.1);
    const rc=h/2+0.85;Q(0,rc,w*0.42,w*0.42,'!#e8c84a',0.08);Q(0,rc,w*0.14,w*0.62,lit?'!#c84a4a':'#5a2a3a',0.09);Q(0,rc,w*0.62,w*0.14,lit?'!#4a7ac8':'#2a3a5a',0.09);
    Q(0,-h/2-0.3,w+1.1,0.28,S.wl,0.12);for(const dx of [-w/2-0.25,w/2+0.25])Q(dx,0.4,0.36,h+0.8,S.wl,0.06)};
  if(TW==='zig'){// piramida schodkowa ze świątynią na szczycie i schodami od frontu
    for(let k=0;k<6;k++){const w=26-k*3.6,d=w*0.85;P(0,B+k*3+1.5,-4,w,3,d,k%2?S.wd:S.w);P(0,B+k*3+2.9,-4,w+0.3,0.25,d+0.3,S.wl);if(k<5)for(let q=-w/2+1.2;q<w/2;q+=2.4){P(q,B+k*3+1.6,-4+d/2+0.05,0.9,1.3,0.12,k%2?S.w:S.wd);P(q,B+k*3+1.6,-4+d/2+0.1,0.3,0.5,0.1,S.tr)}}
    for(let k=0;k<30;k++)P(0,B+0.3+k*0.6,-4+11.05-k*0.306+0.9,4.2,0.6,1.0,k%2?S.wl:S.w);for(const sx of [-1,1])for(let k=0;k<6;k++)P(sx*2.5,B+k*3+2.2,-4+(26-k*3.6)*0.425+0.5,0.7,1.6,1.4,S.tr);
    P(0,B+20.2,-4,7,4.4,6,S.w);P(0,B+22.6,-4,7.8,0.5,6.8,S.wl);P(0,B+23.3,-4,5.6,1,4.8,S.rf);P(0,B+24.2,-4,3.4,0.8,3,S.rf2);P(0,B+25,-4,1.2,0.9,1.2,S.tr);P(0,B+25.7,-4,0.7,0.5,0.7,'!#ffcf6a');P(0,B+20,-0.95,2.2,3.6,0.14,DK);P(0,B+20.2,-0.9,1.4,2.6,0.1,GW);for(const sx of [-1,1]){P(sx*2.6,B+19.4,-0.6,0.9,2.8,0.9,S.tr);P(sx*2.6,B+21.1,-0.6,0.6,0.5,0.6,'!#ff8a2a')}
    for(const sx of [-1,1])for(const sz of [-1,1])tower(sx*11.5,-4+sz*9.5,1.6,6.5,1,B)}
  else{// wielka sala z przyporami i lancetowymi oknami
    P(0,B+KH/2,-6,16,KH,13,S.w);P(0,B+0.9,-6,16.5,1.8,13.5,S.wd);P(0,B+KH-0.3,-6,16.8,0.6,13.8,S.wl);P(0,B+KH*0.5,-6,16.2,0.3,13.2,S.wl);
    for(const sx of [-1,1])for(const z of [-9.4,-6,-2.6]){P(sx*8.5,B+KH*0.36,z,1.0,KH*0.72,1.1,S.w);P(sx*8.7,B+KH*0.2,z,1.4,KH*0.4,1.3,S.wd);P(sx*8.5,B+KH*0.74,z,0.8,0.5,1.3,S.wl)}
    for(const sx of [-1,1])for(const z of [-7.7,-4.3])bigWin(sx*8.03,B+KH*0.5,z,2.0,KH*0.5,sx,(z>-6)===(sx>0));
    for(const x of [-4.6,0,4.6]){P(x,B+KH*0.36,-12.9,1.1,KH*0.72,1.0,S.w);P(x,B+KH*0.74,-12.9,1.3,0.5,0.8,S.wl)}for(const x of [-2.3,2.3])bigWin(x,B+KH*0.48,-12.56,3.0,KH*0.5,0,x>0,-1);
    stones('x',8.03,-12,0,B+2,B+KH-1,0.035);stones('x',-8.03,-12,0,B+2,B+KH-1,0.035);stones('z',-12.53,-7.5,7.5,B+2,B+KH-1,0.035);stones('z',0.53,-7.5,7.5,B+PH+2,B+KH-1,0.05);
    for(const x of [-5.4,-1.8,1.8,5.4])win(x,B+PH+(KH-PH)*0.55,0.53,1.0,Math.min(3.2,(KH-PH)*0.42),Math.abs(x)<2,0);
    if(TW!=='flat'){for(let k=0;k<6;k++){const d=13.6-k*2.3;P(0,B+KH+0.3+k*0.95,-6,17.2,0.95,Math.max(0.8,d),k%2?S.rf:S.rf2)}P(0,B+KH+6.1,-6,17.4,0.3,0.5,S.tr);
      for(const sx of [-1,1])for(let k=0;k<6;k++){const d=13.9-k*2.3;P(sx*8.35,B+KH+0.4+k*0.95,-6,0.7,1.15,Math.max(1.0,d),S.wl)}}
    else{for(let q=-7.4;q<=7.4;q+=1.85){P(q,B+KH+0.55,0.3,0.95,1.1,0.6,S.wl);P(q,B+KH+0.55,-12.3,0.95,1.1,0.6,S.wl)}for(let q=-11.2;q<=-0.6;q+=1.76){P(7.8,B+KH+0.55,q,0.6,1.1,0.95,S.wl);P(-7.8,B+KH+0.55,q,0.6,1.1,0.95,S.wl)}}
    for(const sx of [-1,1])for(const sz of [-1,1])tower(sx*8,-6+sz*6.5,2.2,KH+5,S.sq,B);
    // donżon: wykusze narożne, wielkie okno-rozeta, galeria
    const DH=KH+11*HK;tower(0,-6,4,DH,S.sq,B,true);
    if(TW!=='flat'){oct(0,B+DH-3.2,-6,4.9,0.5,S.wd);oct(0,B+DH-2.6,-6,5.1,0.3,WO2);for(let a=0;a<8;a++){const c=Math.cos(a/8*6.283+0.39),s=Math.sin(a/8*6.283+0.39);P(c*5.0,B+DH-2.0,-6+s*5.0,0.18,1.0,0.18,WO)}oct(0,B+DH-1.5,-6,5.1,0.12,WO)}
    for(const [dx,dz] of [[1,1],[-1,1],[1,-1],[-1,-1]]){const bx=dx*3.3,bz=-6+dz*3.3,by=B+DH-8.5;oct(bx,by-0.9,bz,0.6,0.5,S.wd);oct(bx,by-0.4,bz,0.85,0.6,S.wl);oct(bx,by+1.6,bz,1.0,3.6,S.w);P(bx+dx*0.75,by+1.8,bz+dz*0.75,0.3,0.9,0.3,GW);
      if(TW==='flat'){oct(bx,by+3.6,bz,1.2,0.4,S.wl)}else{const hh=TW==='spire'?5:TW==='dome'?1.4:3;for(let k=0;k<5;k++){const f=k/5,rr=TW==='dome'?1.25*Math.sqrt(1-f*f):1.3*(1-f);oct(bx,by+3.4+hh*f+hh/10,bz,Math.max(0.14,rr),hh/5+0.02,k%2?S.rf2:S.rf)}P(bx,by+3.6+hh,bz,0.1,0.8,0.1,S.tr)}}
    {const y=B+KH+5.5*HK;for(let a=0;a<4;a++){const dx=[0,1,0,-1][a],dz=[1,0,-1,0][a],px=dx*4.03,pz=-6+dz*4.03,Q=(u,v,w,h,c,o)=>P(px+(dz?u:0)+dx*(o||0),y+v,pz+(dx?u:0)+dz*(o||0),dz?w:0.12,h,dx?w:0.12,c);Q(0,0,2.6,2.6,S.wl,0);Q(0,0,2.1,2.1,GW,0.05);Q(0,0,2.1,0.16,S.wl,0.09);Q(0,0,0.16,2.1,S.wl,0.09);for(const [u,v] of [[1,1],[-1,1],[1,-1],[-1,-1]])Q(u*0.85,v*0.85,0.5,0.5,S.wl,0.09);Q(0,0,0.6,0.6,S.tr,0.12)}}
    roof(0,B+DH,-6,4,S.sq)}
  // skrzydło frontowe pałacu: ryzalit z portalem, pilastry, dwa rzędy okien, gzyms, dach ze szczytami schodkowymi, lukarny, kominy
  P(0,B+PH/2,7,20,PH,8,S.w);P(0,B+0.8,7,20.5,1.6,8.5,S.wd);P(0,B+1.7,7,20.3,0.25,8.3,S.wl);P(0,B+PH-0.25,7,20.9,0.5,8.9,S.wl);P(0,B+PH-0.75,7,20.5,0.3,8.5,S.tr);P(0,B+PH*0.52,7,20.3,0.3,8.3,S.wl);
  for(const x of [-9.7,-5.6,5.6,9.7]){P(x,B+PH/2,11.1,0.8,PH,0.4,S.wl);P(x,B+1.0,11.2,1.1,2.0,0.6,S.wd);P(x,B+PH-1.3,11.2,1.1,0.5,0.6,S.wd)}
  {const rows=PH>8.6?[[B+3.4,2.2],[B+PH*0.52+2.4,Math.min(2.6,PH*0.24)]]:[[B+PH*0.5,Math.min(3,PH*0.42)]];for(const [yy,hh] of rows)for(const x of [-7.65,3.9+3.75,-3.9,3.9]){win(x,yy,11.03,1.3,hh,(Math.round(x*2)+Math.round(yy))%3!==0,0)}
    for(const sx of [-1,1])for(const z of [5,9])for(const [yy,hh] of rows)win(sx*10.03,yy,z,1.2,hh,(z+Math.round(yy))%2===0,sx)}
  stones('z',11.03,-9.2,9.2,B+2,B+PH-1.2,0.03);
  P(0,B+(PH+1.6)/2,11.5,5.6,PH+1.6,1.6,S.w);P(0,B+0.8,11.6,6.0,1.6,1.9,S.wd);P(0,B+PH+1.5,11.5,6.2,0.4,2.0,S.wl);for(const sx of [-1,1]){P(sx*2.55,B+(PH+1.6)/2,12.35,0.7,PH+1.6,0.3,S.wl);P(sx*2.55,B+PH+2.3,12.2,0.6,1.4,0.6,S.wl);P(sx*2.55,B+PH+3.2,12.2,0.3,0.6,0.3,S.tr)}
  if(TW!=='flat'&&TW!=='zig'){for(let k=0;k<4;k++)P(0,B+PH+1.9+k*0.7,11.5,5.0-k*1.3,0.7,1.7,S.wl);P(0,B+PH+4.7,11.5,0.3,1.2,0.3,S.tr)}else for(const q of [-1.7,0,1.7])P(q,B+PH+2.2,12.1,0.9,1.0,0.5,S.wl);
  P(0,B+2.25,12.34,2.8,4.5,0.14,S.tr);P(0,B+2.1,12.38,2.3,4.2,0.14,'#3a2414');P(0,B+2.1,12.46,0.08,4.2,0.06,DK);for(const y of [1.0,2.2,3.4])for(const sx of [-1,1])P(sx*0.6,B+y,12.46,0.9,0.12,0.06,IR);for(const sx of [-1,1])P(sx*0.2,B+2.1,12.5,0.12,0.3,0.08,S.tr);
  P(0,B+4.75,12.36,2.0,0.6,0.14,S.tr);P(0,B+5.2,12.36,1.2,0.4,0.14,S.tr);
  {const y=B+Math.min(PH-1.6,7.2),r=Math.min(1.25,PH*0.13);P(0,y,12.33,r*2+0.5,r*2+0.5,0.12,S.wl);P(0,y,12.36,r*2,r*1.2,0.12,GW);P(0,y,12.36,r*1.2,r*2,0.12,GW);P(0,y,12.4,r*2,0.12,0.1,S.wl);P(0,y,12.4,0.12,r*2,0.1,S.wl);P(0,y,12.42,0.45,0.45,0.1,S.tr)}
  {const y=B+PH+3.0;P(0,y-0.9,12.36,1.5,1.7,0.1,S.tr);P(0,y-0.9,12.4,1.1,1.3,0.08,S.bn);P(0,y-0.7,12.44,0.3,0.7,0.05,S.tr)}
  for(let i=0;i<4;i++)P(0,B+0.14+i*0.0,13.0+i*0.0,0,0,0,S.wl),L.pop();
  for(let i=0;i<3;i++)P(0,B+0.12+i*0.2,13.75-i*0.45,7.4-i*0.6,0.24,0.5,i%2?S.wd:S.wl);P(0,B+0.62,12.9,6.2,0.2,1.2,S.wl);
  for(const sx of [-1,1]){P(sx*3.5,B+3.0,13.2,0.55,4.6,0.55,S.wl);P(sx*3.5,B+0.95,13.2,0.85,0.5,0.85,S.wd);P(sx*3.5,B+5.35,13.2,0.9,0.3,0.9,S.wd);P(sx*3.5,B+5.65,13.0,0.7,0.3,1.3,S.wl)}P(0,B+5.95,13.0,8.0,0.3,1.5,S.wl);P(0,B+6.25,13.0,8.3,0.3,1.8,S.rf2);P(0,B+6.5,13.0,7.4,0.25,1.2,S.rf);
  for(const sx of [-1,1]){P(sx*4.9,B+1.5,13.6,0.7,1.2,0.7,S.wd);P(sx*4.9,B+2.25,13.6,0.5,0.3,0.5,IR);P(sx*4.9,B+2.55,13.6,0.4,0.3,0.4,'!#ff9a3a')}
  if(TW!=='flat'&&TW!=='zig'){for(let k=0;k<5;k++){const d=8.9-k*1.9;P(0,B+PH+0.45+k*0.9,7,20.6,0.9,Math.max(0.7,d),k%2?S.rf:S.rf2)}P(0,B+PH+4.95,7,20.8,0.28,0.45,S.tr);
    for(const sx of [-1,1])for(let k=0;k<5;k++){const d=9.2-k*1.9;P(sx*10.25,B+PH+0.55+k*0.9,7,0.8,1.1,Math.max(0.9,d),S.wl)}
    for(const x of [-6.5,6.5]){P(x,B+PH+1.5,10.4,1.4,1.5,1.4,S.wl);P(x,B+PH+1.5,11.12,0.8,0.9,0.08,GW);P(x,B+PH+2.4,10.4,1.8,0.3,1.8,S.rf2);P(x,B+PH+2.7,10.4,1.1,0.3,1.4,S.rf)}
    for(const x of [-8,4]){P(x,B+PH+3.6,5.6,1.0,4.6,1.0,S.wd);P(x,B+PH+6.0,5.6,1.3,0.3,1.3,S.wl);P(x,B+PH+6.3,5.6,0.6,0.4,0.6,DK)}}
  else{for(let q=-9.6;q<=9.6;q+=1.75)P(q,B+PH+0.55,10.75,0.95,1.1,0.6,S.wl);for(const sx of [-1,1])for(let q=3.6;q<=10.4;q+=1.7)P(sx*9.75,B+PH+0.55,q,0.6,1.1,0.95,S.wl);if(TW==='flat')for(const x of [-7,7]){P(x,B+PH+0.6,7,1.2,0.8,1.2,IR);P(x,B+PH+1.15,7,0.9,0.3,0.9,'!#ff8a2a')}}
  // ===== dziedziniec: koszary i stajnia z muru pruskiego, ogrody, studnia, plac ćwiczeń =====
  for(const sx of [-1,1]){const x=sx*13.4,f=x-sx*2.2;P(x,B+2.4,-6,4.4,4.8,13,sx<0?'#d8c9a8':'#cdbb96');P(x,B+0.5,-6,4.6,1.0,13.2,S.wd);
    for(const z of [-12.4,-9.2,-6,-2.8,0.4])P(f-sx*0.03,B+2.6,z,0.14,4.4,0.3,WO);for(const y of [1.2,3.0,4.7])P(f-sx*0.03,B+y,-6,0.14,0.26,13,WO);
    for(const z of [-10.8,-7.6,-4.4]){P(f-sx*0.05,B+3.7,z,0.12,1.0,1.1,sx<0?G:DK);P(f-sx*0.09,B+3.7,z,0.1,1.0,0.1,WO)}
    P(f-sx*0.06,B+1.4,-1.2,0.16,2.6,1.5,'#3a2414');P(f-sx*0.1,B+2.85,-1.2,0.18,0.3,1.9,WO);
    for(let k=0;k<4;k++)P(x,B+5.1+k*0.6,-6,5.4-k*1.4,0.6,13.8,k%2?S.rf:S.rf2);P(x,B+7.45,-6,0.5,0.25,14,S.tr);P(x+sx*1.0,B+6.6,-10,0.8,2.6,0.8,S.wd);P(x+sx*1.0,B+8.0,-10,1.0,0.25,1.0,S.wl);
    if(sx>0){for(const z of [-8,-5])P(f-sx*0.5,B+0.5,z,0.9,0.9,1.4,'#d8b850');P(f-sx*0.4,B+0.35,-11,0.5,0.7,1.6,WO2)}else{P(f-sx*0.4,B+0.45,-8.2,0.7,0.9,0.7,'#8a5a30');P(f-sx*0.4,B+0.45,-7.2,0.7,0.9,0.7,'#8a5a30');P(f-sx*0.35,B+0.4,-4.6,0.8,0.8,0.8,'#9a7048')}}
  for(const [x,z] of [[-9,-14.6],[-6.4,-14.9],[9,-14.6]]){P(x,B+0.8,z,0.2,1.6,0.2,WO2);P(x,B+1.5,z,1.0,0.22,0.2,WO2);P(x,B+1.75,z,0.55,0.7,0.45,'#c8b080');P(x,B+2.35,z,0.4,0.4,0.4,'#c8b080');P(x,B+0.1,z,0.8,0.2,0.8,WO)}
  for(const sx of [-1,1]){P(sx*3.4,B+0.9,-15.2,2.4,1.8,0.3,'#5a3a22');P(sx*3.4,B+1.85,-15.2,2.6,0.14,0.5,WO);for(let q=0;q<5;q++)P(sx*3.4-1.0+q*0.5,B+1.2,-14.98,0.07,1.7,0.07,['#c9cfd4','#8a6a44','#c9cfd4','#6b4a2b','#c9cfd4'][q])}
  P(0,B+0.3,-15,1.8,0.6,1.2,'#a8452f');P(0,B+0.65,-15,2.0,0.1,1.4,S.tr);
  // studnia
  P(7,B+0.5,13.5,1.7,1.0,1.7,S.wd);P(7,B+1.0,13.5,1.9,0.14,1.9,S.wl);P(7,B+0.95,13.5,1.2,0.12,1.2,'#2a4a6a');for(const sx of [-1,1])P(7+sx*0.85,B+1.9,13.5,0.16,1.9,0.16,WO);P(7,B+2.9,13.5,2.0,0.16,0.2,WO);P(7,B+2.6,13.5,0.5,0.3,0.3,WO2);P(7,B+3.15,13.5,2.4,0.2,1.6,S.rf);P(7,B+3.35,13.5,2.4,0.2,0.8,S.rf2);P(7.4,B+1.25,13.2,0.4,0.4,0.4,WO2);
  P(-7.2,B+0.45,14.2,1.5,0.9,1.0,'#d8b850');P(-7.6,B+1.2,14.2,0.9,0.7,0.9,'#c8a840');P(-6.0,B+0.4,14.4,0.7,0.8,0.7,'#8a5a30');
  // ogrody: żywopłot, rabaty, fontanna po lewej, posąg po prawej
  for(const sx of [-1,1]){const x=sx*12;P(x,B+0.2,10,3.2,0.4,8.2,'#5a4a34');P(x,B+0.42,10,2.8,0.1,7.8,'#4f8a3c');for(const z of [6.1,13.9])P(x,B+0.7,z,3.2,0.9,0.4,'#3f7a35');for(const q of [-1.5,1.5])P(x+q,B+0.7,10,0.4,0.9,8.2,'#3f7a35');
    for(let q=0;q<6;q++){const fz=7+q*1.2,fx=x+(q%2?0.8:-0.8);P(fx,B+0.62,fz,0.5,0.3,0.5,'#4f8a3c');P(fx,B+0.84,fz,0.3,0.16,0.3,['#e8c040','#c8302a','#d96bd0','#ffffff'][q%4])}
    if(sx<0){P(x,B+0.7,10,1.6,0.6,1.6,S.wl);P(x,B+1.02,10,1.2,0.06,1.2,'#4ac8d8');P(x,B+1.4,10,0.4,1.2,0.4,S.wl);P(x,B+2.05,10,0.9,0.14,0.9,S.wl);P(x,B+2.14,10,0.6,0.06,0.6,'#4ac8d8');P(x,B+2.5,10,0.2,0.6,0.2,S.tr)}
    else{P(x,B+0.9,10,1.0,1.0,1.0,S.wd);P(x,B+1.45,10,1.2,0.14,1.2,S.wl);P(x,B+2.2,10,0.6,1.4,0.4,'#c8b878');P(x,B+3.1,10,0.45,0.45,0.45,'#c8b878');P(x+0.45,B+2.6,10.1,0.14,1.9,0.14,'#c8b878');P(x,B+3.4,10,0.5,0.14,0.5,S.tr)}
    P(x,B+1.6,6.9,0.36,2.4,0.36,WO2);P(x,B+3.4,6.9,1.9,1.6,1.9,'#4a8a3a');P(x,B+4.4,6.9,1.2,0.8,1.2,'#5a9a46');
    P(sx*3.2,B+1.2,15.2,0.14,2.4,0.14,IR);P(sx*3.2,B+2.5,15.2,0.4,0.4,0.4,'!#ffd27a');P(sx*3.2,B+2.76,15.2,0.5,0.08,0.5,IR)}
  // ===== dopracowanie bryły: przypory, hurdycje, barbakan przed bramą, skały u podnóża =====
  {const QB=(ax,c,aa,y,off,la,h,th,col)=>{if(ax==='z')P(aa,y,c+off,la,h,th,col);else P(c+off,y,aa,th,h,la,col)};
   const buttress=(ax,c,aa,out)=>{QB(ax,c,aa,B+WH*0.34,out*1.45,1.1,WH*0.68,0.9,S.w);QB(ax,c,aa,B+WH*0.17,out*1.8,1.3,WH*0.34,0.8,S.wd);QB(ax,c,aa,B+WH*0.69,out*1.25,0.95,0.4,1.0,S.wl);QB(ax,c,aa,B+WH*0.35,out*2.22,1.32,0.2,0.06,S.wl)};
   for(const aa of [-12,-6,6,12]){buttress('z',-R2,aa,-1);buttress('x',-R2,aa,-1);buttress('x',R2,aa,1)}
   if(TW!=='flat'&&TW!=='zig'&&race!=='elfy'&&race!=='drowy'){/* drewniane hurdycje na tylnym murze i bokach */for(const [ax,c,a0,a1,out] of [['z',-R2,-13,-4,-1],['z',-R2,4,13,-1],['x',-R2,-13,-4,-1],['x',R2,4,13,1]]){const m=(a0+a1)/2,w=a1-a0;
       QB(ax,c,m,B+WH+1.45,out*1.75,w,1.5,1.1,WO2);for(let q=a0+0.6;q<a1;q+=1.1){QB(ax,c,q,B+WH+1.45,out*2.32,0.12,1.5,0.06,WO);QB(ax,c,q,B+WH-0.3,out*1.9,0.14,1.0,0.14,WO)}for(let q=a0+1.2;q<a1-0.6;q+=2.2)QB(ax,c,q,B+WH+1.5,out*2.34,0.3,0.5,0.04,DK);
       for(let k=0;k<3;k++)QB(ax,c,m,B+WH+2.35+k*0.32,out*(1.75-k*0.22),w+0.3,0.32,1.5-k*0.45,k%2?S.rf2:S.rf)}}
   // barbakan: dwie baszty na końcu mostu i ganek z blankami nad drogą
   for(const sx of [-1,1])tower(sx*4.5,R2+4.6,1.35,6.2,S.sq,B);
   P(0,B+5.2,R2+4.6,6.4,1.4,1.7,S.w);P(0,B+4.45,R2+4.6,6.0,0.2,1.9,S.wl);P(0,B+6.05,R2+4.6,6.6,0.3,2.0,S.wl);for(let q=-2.7;q<=2.71;q+=1.08)P(q,B+6.6,R2+5.35,0.62,0.8,0.4,S.wl);
   for(let q=-1.5;q<=1.51;q+=0.5)P(q,B+4.0,R2+5.4,0.08,0.7,0.08,IR);P(0,B+5.25,R2+5.48,1.2,1.0,0.08,S.tr);P(0,B+5.25,R2+5.53,0.8,0.7,0.06,S.bn);
   // skały i rumowisko u stóp podestu (z dala od schodów)
   for(let i=0;i<46;i++){const side=i%4,t=-21+rn()*42;if(side===0&&Math.abs(t)<9)continue;const off=23.3+rn()*0.9,x=side===0?t:side===1?t:side===2?off:-off,z=side===0?off:side===1?-off:t,w=1.2+rn()*2.4,h=1.0+rn()*2.6;P(x,-4.2+h/2+rn()*0.8,z,w,h,w*(0.7+rn()*0.5),rn()<0.5?S.wd:'#7a756e');if(rn()<0.35)P(x,-4.2+h+0.9,z,w*0.7,0.12,w*0.6,'#5a7a3a')}}
  // akcenty rasy
  if(race==='elfy'){for(let i=0;i<26;i++){const sx=rn()<0.5?-1:1,z=-14+rn()*28,y=B+1+rn()*(WH-2);P(sx*(R2+1.06),y,z,0.08,1.2+rn()*2,0.5+rn()*0.5,rn()<0.5?'#3f8a5a':'#5aa66a')}for(const sx of [-1,1]){P(sx*8.8,B+2.6,15.4,0.4,3.2,0.4,'#e8e0c8');P(sx*8.8,B+5.0,15.4,2.4,2.0,2.4,'#7ac08a');P(sx*8.8,B+6.3,15.4,1.5,1.0,1.5,'#9ad8a4')}}
  if(race==='krasnoludy'){for(const sx of [-1,1])for(const z of [-9,9]){P(sx*(R2+1.5),B+WH*0.35,z,1.4,WH*0.7,2.2,S.wd);P(sx*(R2+1.3),B+WH*0.72,z,1.0,0.4,2.0,S.wl)}for(let k=-14;k<=14;k+=4)P(k,B+WH*0.3,R2+1.04+(Math.abs(k)<4?-9:0),0.6,0.6,0.08,Math.abs(k)<4?S.w:S.tr)}
  if(race==='orkowie'){for(let k=-15;k<=15;k+=2.5){for(const [x,z] of [[k,-R2-1.2],[-R2-1.2,k],[R2+1.2,k]]){P(x,B+WH+1.9,z,0.25,1.6,0.25,WO)}}for(const sx of [-1,1]){P(sx*9.4,B+1.8,19.6,0.3,3.6,0.3,WO);P(sx*9.4,B+3.8,19.6,0.7,0.7,0.7,'#e8e0c8');P(sx*9.4,B+3.7,19.96,0.4,0.2,0.05,DK);P(sx*9.4,B+4.4,19.6,1.2,0.14,0.14,'#e8e0c8')}}
  if(race==='drowy'){for(const [x,z] of [[-12.5,19.5],[12.5,19.5],[-19.5,-12],[19.5,-12],[-19.5,12],[19.5,12]]){P(x,B+0.5,z,1.0,1.0,1.0,S.wd);P(x,B+1.8,z,0.6,1.8,0.6,'!#b070ff');P(x+0.3,B+1.4,z+0.2,0.35,1.0,0.35,'!#d8a0ff')}}
  if(race==='niziolki'){for(const x of [-7.65,-3.9,3.9,7.65]){P(x,B+2.05,11.25,1.7,0.3,0.4,WO2);for(let q=0;q<3;q++)P(x-0.5+q*0.5,B+2.3,11.25,0.3,0.24,0.3,['#e8c040','#c8302a','#d96bd0'][q])}}
  return L}

// znacznik „duży budynek” (aT.x=5): shader budynków rysuje na nim ciosy kamienne z fugami, cegły, mech u podstawy
// mur z ciosów tylko na kamiennych, pionowych i dość dużych ścianach (drewno, dachówki, latarnie i bruk bez zmian)
function bigTagSel(geo,tag){tag=tag||7;try{const P=geo.attributes.position,N=geo.attributes.normal,Cc=geo.attributes.color,A=geo.attributes.aT;if(!P||!N||!Cc)return geo;const n=P.count||P.array.length/3,na=N.array,ca=Cc.array,cs=Cc.itemSize||3,cm=ca instanceof Uint8Array?255:1,aa=A?A.array:null,a=new Float32Array(n*2),c=new THREE.Color(),hs={};
  for(let i=0;i<n;i++){const ox=aa?aa[i*2]:0,oy=aa?aa[i*2+1]:0;a[i*2]=ox;a[i*2+1]=oy;const fd=(ox&127);if(Math.abs(na[i*3+1])>0.5||(aa&&fd<6&&ox<128))continue;c.setRGB(ca[i*cs]/cm,ca[i*cs+1]/cm,ca[i*cs+2]/cm);c.getHSL(hs);if(hs.s<0.3&&hs.l>0.1&&hs.l<0.82)a[i*2]=tag}
  geo.setAttribute('aT',new THREE.BufferAttribute(a,2))}catch(e){console.warn('bigTagSel',e)}return geo}
// v107: ściany z kolorów muru danej rasy dostają znacznik 9 — shader rysuje na nich ciosy kamienne niezależnie od barwy (elfy, drowy, saurianie, orkowie...)
function raceStoneTag(geo,race,sty){try{if(!race||race==='ludzie')return geo;const S=kcStyle(race,sty),cs=[S.w,S.wd,S.wl].map(h=>new THREE.Color(h)),C=geo.attributes.color,N=geo.attributes.normal,A=geo.attributes.aT;if(!C||!A)return geo;const ca=C.array,cm=ca instanceof Uint8Array?255:1,k=C.itemSize||3,aa=A.array,n=C.count;
  for(let i=0;i<n;i++){const r=ca[i*k]/cm,g=ca[i*k+1]/cm,b=ca[i*k+2]/cm;for(const c of cs){if(Math.abs(r-c.r)+Math.abs(g-c.g)+Math.abs(b-c.b)<0.16){aa[i*2]=9;break}}}A.needsUpdate=true}catch(e){console.warn('raceStoneTag',e)}return geo}
function bigTag(geo){try{const n=geo.attributes.position.count,a=new Float32Array(n*2);for(let i=0;i<n;i++)a[i*2]=8;geo.setAttribute('aT',new THREE.BufferAttribute(a,2))}catch(_){}return geo}
let KC_GEO=new Map();function kcastleGeo(race,sty){const k=race+'|'+(sty||'');if(!KC_GEO.has(k))KC_GEO.set(k,raceStoneTag(bigTag(boxes(structTex(kcastleList(race,sty),race.length*31+7,1.5))),race,sty));return KC_GEO.get(k)}
// ===== SALA TRONOWA: król/królowa na tronie, dwór, gwardia wzdłuż czerwonego dywanu =====
function genThrone(h,v){const key='in:'+Math.round(h.x)+'_'+Math.round(h.z);if(SPACES.has(key))return SPACES.get(key);
  const W=26,D=40,r=rngOf(key),S=kcStyle(v.race,v.sty),s={id:key,kind:'interior',func:'zamek',cs:1,W,D,x0:Math.round(h.x)-W/2,z0:Math.round(h.z)-D/2,fy:700+(Math.abs(Math.round(h.x)*7+Math.round(h.z)*13)%6)*24,ceil:11,solid:new Uint8Array(W*D),h,v,npcs:[],torches:[],lights:[],built:false};
  for(let j=0;j<D;j++)for(let i=0;i<W;i++)if(i===0||j===0||i===W-1||j===D-1)s.solid[j*W+i]=1;
  const SOL=(i0,j0,i1,j1)=>{for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(i>0&&j>0&&i<W-1&&j<D-1)s.solid[j*W+i]=1};
  const L=[],X=i=>i-W/2,Z=j=>j-D/2,P=(...b)=>L.push(b),C=s.ceil,WO='#4a2f1d',WO2='#6b4a2b',IR='#3a3640',DK='#1a1612',RED='#8a1a1a',GL=v.race==='drowy'?'!#c890ff':'!#ffd27a',HX=W/2-1,ZB=Z(1),ZF=Z(D-1);
  s.winL=[];
  // posadzka: szachownica w nawie, ciemniejsze płyty w nawach bocznych, złota opaska wokół nawy
  for(let j=1;j<D-1;j+=2)for(let i=1;i<W-1;i+=2){const nave=i>=7&&i<=17;P(X(i)+1,-0.1,Z(j)+1,2,0.2,2,nave?(((i>>1)+(j>>1))%2?S.wl:S.wd):(((i>>1)+(j>>1))%2?S.wd:S.w))}
  for(const sx of [-1,1])P(sx*5.6,0.012,2.5,0.3,0.03,D-9,S.tr);P(0,0.012,ZF-1.9,11.5,0.03,0.3,S.tr);
  // ściany: kamień, drewniana boazeria, gzyms, pilastry
  for(const [x,z,w,d] of [[0,Z(0.5),W,1],[0,Z(D-0.5),W,1],[X(0.5),0,1,D],[X(W-0.5),0,1,D]])P(x,C/2,z,w,C,d,S.w);P(0,C+0.25,0,W,0.5,D,S.wd);
  for(const sx of [-1,1]){P(sx*(HX-0.06),0.8,0,0.12,1.6,D-2,WO2);P(sx*(HX-0.1),1.66,0,0.2,0.14,D-2,WO);P(sx*(HX-0.1),0.12,0,0.2,0.24,D-2,WO);for(let z=ZB+1;z<ZF;z+=2)P(sx*(HX-0.13),0.85,z,0.08,1.1,0.12,WO);{const WJ=[9,15,21,27,33].map(j=>Z(j+0.5));let z0=ZB;for(const wz of WJ.concat([ZF+2.1])){const z1=wz-2.1;if(z1>z0)P(sx*(HX-0.08),8.3,(z0+z1)/2,0.16,0.3,z1-z0,S.wl);z0=wz+2.1}}P(sx*(HX-0.1),C-0.5,0,0.2,0.4,D-2,S.wd)}
  P(0,0.8,ZF-0.06,W-2,1.6,0.12,WO2);P(0,1.66,ZF-0.1,W-2,0.14,0.2,WO);P(0,8.3,ZF-0.08,W-2,0.3,0.16,S.wl);P(0,8.3,ZB+0.08,W-2,0.3,0.16,S.wl);
  {let sd=5;const rn=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};for(let i=0;i<70;i++){const sx=rn()<0.5?-1:1,z=ZB+1+rn()*(D-4),y=2.2+rn()*5.6;if([9,15,21,27,33].some(j=>Math.abs(z-Z(j+0.5))<2.2))continue;P(sx*(HX-0.03),y,z,0.06,0.36,0.8+rn()*0.6,rn()<0.5?S.wd:S.wl)}for(let i=0;i<24;i++){const x=-11+rn()*22,y=2.2+rn()*8;P(x,y,ZF-0.03,0.8+rn()*0.6,0.36,0.06,rn()<0.5?S.wd:S.wl)}}
  // sklepienie: żebra łuków nad nawą i nawami bocznymi, belki, kasetony
  for(let j=6;j<D-4;j+=6){const z=Z(j+0.5);P(0,C-0.35,z,W-2,0.7,0.7,S.wl);for(const sx of [-1,1]){P(sx*4.9,C-1.0,z,1.5,0.7,0.7,S.wl);P(sx*5.55,C-1.7,z,0.9,0.8,0.7,S.wl);P(sx*8.0,C-1.0,z,1.0,0.7,0.7,S.wl);P(sx*7.45,C-1.7,z,0.7,0.8,0.7,S.wl);P(sx*(HX-0.7),C-1.0,z,1.4,0.7,0.7,S.wl);P(sx*(HX-0.35),C-1.9,z,0.7,1.2,0.7,S.wl)}P(0,C-0.9,z,0.9,0.5,0.9,S.tr)}
  for(const x of [-3.2,0,3.2])P(x,C-0.12,0,0.35,0.26,D-2,WO);for(const sx of [-1,1])P(sx*9.4,C-0.12,0,0.3,0.26,D-2,WO);for(let j=3;j<D-2;j+=3)if((j-6)%6)P(0,C-0.1,Z(j+0.5),W-2,0.2,0.3,WO);
  // kolumny: baza, trzon z opaskami, głowica; chorągwie od strony nawy, kinkiety
  for(let j=6;j<D-4;j+=6)for(const i of [6,W-7]){SOL(i,j,i,j);const x=X(i+0.5),z=Z(j+0.5),sx=x<0?1:-1;P(x,C/2,z,1.0,C,1.0,S.w);P(x,C/2,z,1.16,C-3,0.7,S.w);P(x,C/2,z,0.7,C-3,1.16,S.w);P(x,0.2,z,1.7,0.4,1.7,S.wd);P(x,0.55,z,1.4,0.3,1.4,S.wl);P(x,C-0.9,z,1.7,0.5,1.7,S.wd);P(x,C-1.4,z,1.4,0.5,1.4,S.wl);P(x,C-1.75,z,1.2,0.2,1.2,S.tr);P(x,1.0,z,1.22,0.16,1.22,S.tr);
    P(x,2.6,z+0.62,0.34,0.5,0.3,IR);P(x,2.3,z+0.56,0.12,0.5,0.12,IR);s.torches.push([s.x0+i+0.5,s.fy+2.9,s.z0+j+0.5+0.66]);
    P(x+sx*0.62,6.6,z,0.06,3.4,0.9,(j/6)%2?S.bn:S.rf);P(x+sx*0.66,7.0,z,0.05,0.9,0.5,S.tr);P(x+sx*0.62,8.36,z,0.1,0.12,1.1,S.tr);P(x+sx*0.62,4.75,z,0.06,0.3,0.5,(j/6)%2?S.bn:S.rf)}
  // czerwony dywan ze złotym obszyciem
  P(0,0.02,Z(D/2)+3,4,0.04,D-10,RED);for(const sx of [-1,1])P(sx*1.85,0.03,Z(D/2)+3,0.22,0.04,D-10,S.tr);for(let z=-11;z<ZF-3;z+=3)P(0,0.035,z,0.7,0.035,0.7,S.tr);
  // podest: trzy stopnie na całą szerokość nawy, dywan, lwy
  for(let k=0;k<3;k++)P(0,0.15+k*0.3,(ZB-13.4+k*0.6+ZB)/2+0.0,14,0.3,(-13.4+k*0.0)-0+(0),S.wl),L.pop();
  for(let k=0;k<3;k++){const zf=Z(6.6)-k*0.6;P(0,0.15+k*0.3,(zf+ZB)/2,14-k*0.4,0.3,zf-ZB,k%2?S.wd:S.wl)}SOL(6,1,W-7,5);
  P(0,0.92,(Z(5.4)+ZB)/2,4,0.05,Z(5.4)-ZB,RED);for(const sx of [-1,1])P(sx*1.85,0.93,(Z(5.4)+ZB)/2,0.22,0.05,Z(5.4)-ZB,S.tr);for(let k=0;k<3;k++)P(0,0.32+k*0.3,Z(6.6)-k*0.6-0.28,4,0.03,0.62,RED);
  for(const sx of [-1,1]){const x=sx*5.6,z=Z(5.6);P(x,1.15,z,1.5,0.5,2.2,S.wd);P(x,1.9,z-0.1,1.0,1.0,1.7,'#c8b878');P(x,2.7,z+0.6,0.9,0.9,0.9,'#c8b878');P(x,2.95,z+1.08,0.5,0.4,0.2,'#a89858');P(x,2.2,z+0.75,1.2,0.9,0.5,'#b8a868');P(x-0.3,1.6,z+0.9,0.3,0.5,0.4,'#c8b878');P(x+0.3,1.6,z+0.9,0.3,0.5,0.4,'#c8b878');P(x,1.7,z-1.05,0.25,0.25,0.6,'#c8b878')}
  // tron pod baldachimem, tron małżonka, herb i rozeta witrażowa
  const TZ=Z(2.0),ty=0.9;P(0,ty+0.15,TZ+0.3,5.2,0.3,3.2,S.wd);P(0,ty+0.31,TZ+0.3,4.6,0.04,2.6,RED);
  P(0,ty+0.68,TZ,1.7,0.75,1.3,S.tr);P(0,ty+1.07,TZ+0.05,1.4,0.1,1.1,RED);P(0,ty+2.6,TZ-0.72,1.9,4.6,0.3,S.tr);P(0,ty+2.7,TZ-0.55,1.3,3.4,0.1,RED);P(0,ty+5.1,TZ-0.72,1.3,0.5,0.3,S.tr);P(0,ty+5.55,TZ-0.72,0.7,0.5,0.3,'#e8c84a');P(0,ty+5.95,TZ-0.72,0.3,0.36,0.3,'#c8302a');
  for(const sx of [-1,1]){P(sx*0.95,ty+1.2,TZ+0.05,0.3,0.9,1.3,S.tr);P(sx*0.95,ty+1.75,TZ+0.5,0.36,0.3,0.4,'#e8c84a');P(sx*1.05,ty+4.4,TZ-0.72,0.25,1.6,0.3,S.tr);P(sx*1.05,ty+5.35,TZ-0.72,0.3,0.4,0.3,'#e8c84a')}
  P(3.2,ty+0.6,TZ+0.1,1.3,0.6,1.1,S.tr);P(3.2,ty+0.93,TZ+0.15,1.05,0.08,0.9,S.bn);P(3.2,ty+2.0,TZ-0.5,1.4,3.2,0.25,S.tr);P(3.2,ty+2.1,TZ-0.36,0.9,2.3,0.08,S.bn);P(3.2,ty+3.75,TZ-0.5,0.5,0.4,0.25,'#e8c84a');for(const sx of [-1,1])P(3.2+sx*0.72,ty+1.0,TZ+0.15,0.22,0.7,1.0,S.tr);
  for(const sx of [-1,1])for(const dz of [-0.9,2.0]){P(sx*2.5,ty+3.4,TZ+dz,0.26,6.4,0.26,S.tr);P(sx*2.5,ty+0.45,TZ+dz,0.5,0.3,0.5,S.tr)}
  P(0,ty+6.75,TZ+0.55,5.8,0.3,3.6,S.bn);P(0,ty+6.95,TZ+0.55,6.2,0.16,4.0,S.tr);for(let q=-2.6;q<=2.6;q+=0.65)P(q,ty+6.35,TZ+2.33,0.5,0.6+(Math.round(q/0.65)%2?0.25:0),0.08,Math.round(q/0.65)%2?S.tr:S.bn);for(const sx of [-1,1]){P(sx*2.86,ty+6.3,TZ+0.55,0.08,0.7,3.5,S.bn);P(sx*2.7,ty+4.2,TZ-0.86,0.5,5.0,0.12,S.bn);P(sx*2.7,ty+1.9,TZ-0.86,0.6,0.3,0.14,S.tr)}
  {const y=7.9,z=ZB+0.06,rr=1.5;P(0,5.0,z,6.4,7.6,0.08,S.bn);P(0,5.0,z+0.03,5.6,7.0,0.06,S.rf2);P(0,y,z+0.06,rr*2+0.6,rr*2+0.6,0.1,S.wl);for(const [a,b,c] of [[rr*2,rr*1.2,'#c84a4a'],[rr*1.2,rr*2,'#4a7ac8']])(s.winC||L).push([0,y,z+0.1,a,b,0.08,c]);(s.winC||L).push([0,y,z+0.13,rr*1.1,rr*1.1,0.08,'#e8c84a']);P(0,y,z+0.16,rr*2,0.12,0.06,S.wl);P(0,y,z+0.16,0.12,rr*2,0.06,S.wl);P(0,y,z+0.18,0.5,0.5,0.06,S.tr)}
  for(const sx of [-1,1]){const x=sx*7.6,z=ZB+0.08;P(x,5.6,z,2.6,5.6,0.1,S.bn);P(x,8.5,z,3.0,0.2,0.16,S.tr);P(x,6.4,z+0.05,1.5,1.8,0.06,S.tr);P(x,6.4,z+0.09,1.0,1.3,0.05,S.bn);P(x,6.4,z+0.12,0.3,0.9,0.04,S.tr);P(x,6.4,z+0.12,0.9,0.3,0.04,S.tr);P(x,2.65,z,1.6,0.5,0.1,S.bn);
    P(x,1.9,ZB+0.5,0.9,2.0,0.9,S.wd);P(x,3.05,ZB+0.5,1.1,0.3,1.1,IR);P(x,3.4,ZB+0.5,0.7,0.5,0.7,'!#ff9a3a');P(x,3.8,ZB+0.5,0.4,0.4,0.4,'!#ffd27a');s.lights.push([s.x0+W/2+x,s.fy+3.8,s.z0+D/2+ZB+1.2,7,0.9,[1,0.65,0.32]])}
  // ogromne okna ostrołukowe (7,5 m) w każdym przęśle: rama, laskowanie, maswerk z witrażową rozetą, szyby wpuszczające światło dnia
  s.winC=[];for(let j=9;j<D-6;j+=6)for(const sx of [-1,1]){const x=sx*(HX-0.05),z=Z(j+0.5),cols=['#c84a4a','#4a7ac8','#e8c84a','#5aa04a','#b060c0'],xi=x-sx*0.06;
    P(x-sx*0.04,2.15,z,0.5,0.3,3.8,S.wl);P(x-sx*0.12,1.95,z,0.3,0.2,3.4,S.wd);for(const dz of [-1.62,1.62])P(xi,6.0,z+dz,0.2,7.6,0.36,S.wl);
    s.winL.push([x-sx*0.01,5.6,z,0.02,6.6,2.9]);for(const [yy,ww] of [[9.15,2.5],[9.55,2.0],[9.9,1.45],[10.2,0.9],[10.45,0.4]])s.winL.push([x-sx*0.01,yy,z,0.02,0.4,ww]);
    for(const [yy,ww] of [[9.15,3.3],[9.55,2.9],[9.9,2.4],[10.2,1.9],[10.45,1.4],[10.7,0.9]]){P(xi,yy,z+ww/2-0.2,0.2,0.4,0.4,S.wl);P(xi,yy,z-ww/2+0.2,0.2,0.4,0.4,S.wl)}
    for(const dz of [-0.82,0.82])P(xi+sx*0.02,5.9,z+dz,0.12,7.0,0.12,S.wl);for(const y of [3.9,5.9,7.9])P(xi+sx*0.02,y,z,0.12,0.1,2.9,S.wl);
    {const yc=9.6;s.winC.push([x-sx*0.03,yc,z,0.04,0.9,0.9,cols[j%5]]);for(let a=0;a<8;a++){const c=Math.cos(a/8*6.283),sn=Math.sin(a/8*6.283);s.winC.push([x-sx*0.03,yc+sn*0.62,z+c*0.62,0.04,0.34,0.34,cols[(a+j)%5]])}P(xi,yc,z,0.14,0.14,1.7,S.wl);P(xi,yc,z,0.14,1.7,0.14,S.wl)}
    for(let q=0;q<7;q++)for(const dz of [-1.33,1.33])s.winC.push([x-sx*0.03,2.65+q*0.95,z+dz,0.04,0.8,0.22,cols[(q+j+(dz>0?2:0))%5]]);
    for(let q=1;q<=3;q++)s.winL.push([x-sx*(1.4+q*1.4),0.045,z+0.35*q,1.2,0.01,2.2,1]);for(let q=0;q<3;q++)s.winL.push([x-sx*(2.2+q*1.6),0.05,z+0.5+q*0.35,0.5,0.01,0.5,1])}
  // żyrandole (świecą i oświetlają nawę)
  s.lights=s.lights||[];for(let j=9;j<D-4;j+=6){const z=Z(j+0.5);s.lights.push([s.x0+W/2,s.fy+C-2.3,s.z0+D/2+z,9,0.75,[1,0.8,0.5]]);P(0,C-1.5,z,0.1,2.2,0.1,IR);P(0,C-2.7,z,3.2,0.14,0.3,IR);P(0,C-2.7,z,0.3,0.14,3.2,IR);P(0,C-2.7,z,2.3,0.12,2.3,IR);P(0,C-2.9,z,0.5,0.4,0.5,S.tr);for(let a=0;a<8;a++){const c=Math.cos(a/8*6.283)*1.5,sn=Math.sin(a/8*6.283)*1.5;P(c,C-2.45,z+sn,0.16,0.4,0.16,'#efe6c8');P(c,C-2.12,z+sn,0.1,0.22,0.1,GL)}}
  // nawy boczne: stoły biesiadne z ławami, zbroje na postumentach, kominki, tarcze i skrzyżowane miecze na ścianach
  for(const sx of [-1,1]){const i=sx<0?3:W-4,x=X(i+0.5);for(const j of [12,22]){SOL(i,j-1,i,j+2);const z=Z(j+1);P(x,0.86,z,1.3,0.12,4.2,WO2);for(const dz of [-1.7,1.7]){P(x,0.4,z+dz,1.0,0.8,0.14,WO);P(x-sx*1.05,0.3,z+dz*0.9,0.4,0.6,0.1,WO)}P(x-sx*1.05,0.52,z,0.44,0.1,3.8,WO2);P(x,0.93,z,0.5,0.02,4.0,S.bn);
      for(let q=0;q<5;q++){const zz=z-1.6+q*0.8;P(x+(q%2?0.2:-0.2),1.0,zz,0.34,0.06,0.34,'#c8c8c8');if(q%2)P(x-0.25,1.08,zz,0.16,0.26,0.16,'#d9b23a');else P(x+0.2,1.08,zz,0.24,0.14,0.24,['#a8452f','#d8a040','#86c060'][q%3])}P(x,1.2,z,0.14,0.5,0.14,IR);P(x,1.52,z,0.1,0.16,0.1,GL)}
    SOL(sx<0?1:W-2,30,sx<0?1:W-2,32);{const x2=sx*(HX-0.55),z=Z(31.5);P(x2,1.5,z,1.1,3.0,3.6,S.wd);P(x2-sx*0.2,0.8,z,0.8,1.6,2.2,DK);P(x2-sx*0.35,0.35,z,0.5,0.3,1.6,'#3a2a1a');P(x2-sx*0.35,0.65,z,0.4,0.45,1.2,'!#ff8a2a');P(x2-sx*0.35,1.0,z+0.1,0.25,0.35,0.6,'!#ffd27a');s.lights.push([s.x0+W/2+x2-sx*1.2,s.fy+1.0,s.z0+D/2+z,8,1.1,[1,0.62,0.3]]);P(x2-sx*0.2,3.1,z,1.5,0.3,4.2,S.wl);P(x2,5.2,z,0.8,4.0,2.4,S.wd);P(x2-sx*0.42,4.2,z,0.08,1.4,1.2,S.tr);P(x2-sx*0.46,4.2,z,0.06,1.0,0.8,S.bn)}
    for(const j of [8,18,27]){const z=Z(j+0.5),x2=sx*(HX-0.6);SOL(sx<0?1:W-2,j,sx<0?1:W-2,j);P(x2,0.3,z,0.9,0.6,0.9,S.wd);P(x2,1.05,z,0.5,0.9,0.4,'#9aa0a8');P(x2,1.75,z,0.72,0.7,0.46,'#b4bac2');P(x2,2.3,z,0.4,0.42,0.4,'#b4bac2');P(x2-sx*0.21,2.3,z,0.05,0.1,0.26,DK);P(x2,2.62,z,0.1,0.3,0.4,S.bn);for(const dz of [-0.5,0.5])P(x2,1.6,z+dz,0.24,0.9,0.22,'#9aa0a8');P(x2-sx*0.3,1.3,z+0.62,0.08,2.6,0.08,WO2);P(x2-sx*0.3,2.75,z+0.62,0.1,0.5,0.24,'#c9cfd4')}
    for(const j of [15,24.5]){const z=Z(j+0.5),x2=sx*(HX-0.1);P(x2,3.2,z,0.1,1.3,1.0,S.bn);P(x2-sx*0.04,3.2,z,0.08,0.9,0.6,S.tr);for(const q of [-1,1]){for(let t=0;t<5;t++)P(x2-sx*0.03,2.5+t*0.38,z+q*(0.9-t*0.36),0.06,0.42,0.14,'#c9cfd4');P(x2-sx*0.03,2.35,z+q*1.0,0.08,0.14,0.4,WO2)}}}
  // kandelabry wzdłuż dywanu
  for(let j=11;j<D-6;j+=6)for(const sx of [-1,1]){const x=sx*2.9;SOL(Math.round(W/2+x-0.5),j,Math.round(W/2+x-0.5),j);const z=Z(j)+0.5;P(x,0.1,z,0.7,0.2,0.7,IR);P(x,1.0,z,0.15,1.8,0.15,IR);P(x,1.95,z,0.8,0.12,0.8,IR);for(const q of [-0.3,0,0.3]){P(x+q,2.15,z,0.1,0.3,0.1,'#efe6c8');P(x+q,2.38,z,0.07,0.15,0.07,GL)}}
  // stół z mapą królestwa, kącik minstrela, skrzynie skarbca
  SOL(W-6,D-12,W-4,D-10);{const x=X(W-4.5),z=Z(D-10.5);P(x,0.9,z,2.8,0.16,2.2,WO2);P(x,0.99,z,2.4,0.03,1.8,'#e8d8a8');for(const [dx,dz] of [[-1.2,-0.9],[1.2,-0.9],[-1.2,0.9],[1.2,0.9]])P(x+dx,0.42,z+dz,0.18,0.84,0.18,WO);P(x-0.5,1.02,z-0.2,0.9,0.03,0.6,'#6a9a4a');P(x+0.5,1.02,z+0.3,0.7,0.03,0.5,'#3f6fa8');P(x+0.4,1.08,z-0.3,0.14,0.16,0.14,'#a8452f');P(x-0.6,1.08,z+0.4,0.14,0.16,0.14,'#3f6fa8');P(x+0.9,1.1,z+0.6,0.1,0.2,0.1,'#d9b23a')}
  SOL(3,D-12,4,D-10);{const x=X(3.6),z=Z(D-10.5);P(x,0.3,z,1.8,0.2,1.8,S.bn);P(x-0.3,0.55,z,0.6,0.5,0.6,WO2);P(x+0.5,0.85,z-0.3,0.14,1.5,0.14,WO2);P(x+0.5,1.3,z-0.1,0.6,0.9,0.16,'#a87a4a');P(x+0.5,1.9,z-0.1,0.12,0.5,0.1,WO);P(x-0.5,0.5,z+0.6,0.5,0.6,0.5,'#8a5a30');P(x-0.5,0.82,z+0.6,0.52,0.05,0.52,'#e8dcc0')}
  for(const sx of [-1,1]){const x=sx*10.3,z=ZB+0.9;SOL(sx<0?2:W-4,1,sx<0?3:W-3,1);P(x,0.4,z,1.3,0.8,0.8,'#7a4b22');P(x,0.86,z,1.36,0.14,0.86,'#8f5a2a');P(x,0.5,z+0.42,0.2,0.24,0.06,S.tr);for(const q of [-0.5,0.5])P(x+q,0.45,z,0.08,0.92,0.84,IR);P(x+sx*0.9,0.2,z+0.2,0.4,0.4,0.4,'#d9b23a');P(x+sx*1.0,0.52,z+0.2,0.3,0.24,0.3,'#e8c84a')}
  // galeria nad wejściem, portal wyjścia
  P(0,C-3.4,ZF-1.3,W-2,0.3,2.6,WO2);P(0,C-3.65,ZF-2.5,W-2,0.3,0.3,WO);for(let x=-HX+0.8;x<HX;x+=1.1)P(x,C-2.8,ZF-2.5,0.12,0.9,0.12,WO);P(0,C-2.3,ZF-2.5,W-2.2,0.14,0.2,WO);for(const x of [-8,-4,4,8]){P(x,(C-3.5)/2,ZF-2.4,0.4,C-3.5,0.4,WO);P(x,C-3.9,ZF-2.0,0.3,0.4,1.0,WO)}
  for(const x of [-6,6]){P(x,C-2.2,ZF-0.12,2.0,1.6,0.08,S.bn);P(x,C-2.2,ZF-0.17,1.2,1.0,0.06,S.tr)}
  P(0,2.1,ZF-0.04,3.0,4.2,0.12,'#3a2414');P(0,2.1,ZF-0.12,0.08,4.2,0.06,DK);for(const sx of [-1,1]){P(sx*1.75,2.3,ZF-0.2,0.5,4.6,0.4,S.wl);for(const y of [1.0,2.2,3.4])P(sx*0.75,y,ZF-0.12,1.2,0.12,0.06,IR)}P(0,4.6,ZF-0.2,4.4,0.5,0.45,S.wl);P(0,5.0,ZF-0.2,3.0,0.4,0.4,S.tr);P(0,5.4,ZF-0.2,1.6,0.4,0.36,S.tr);
  s.exit=[s.x0+W/2,s.z0+D-1.6];s.spawn=[s.x0+W/2,s.z0+D-2.4];s.out=doorOf(h);s.outY=h.top;s.outRy=h.rot;
  // dwór
  const npc=(role,roleN,x,z,ry,o)=>s.npcs.push(Object.assign({role,roleN,x:s.x0+x,z:s.z0+z,ry:ry||0},o||{}));
  npc('krol',null,W/2,2.2,0,{y:ty+0.22,sit:1,reach:5.2});npc('dworzanin',r()<0.5?'Królowa':'Królewicz',W/2+3.2,2.3,0,{y:ty+0.08,sit:1,reach:5.2});npc('doradca',null,W/2-3.6,4.6,0.3,{y:ty,reach:4.4});
  /* mniej straży: dwóch przy tronie, dwóch przy wejściu — przechadzają się po swoim miejscu */npc('straz','Gwardzista królewski',W/2-4.2,7.5,Math.PI/2,{wan:2});npc('straz','Gwardzista królewski',W/2+4.2,7.5,-Math.PI/2,{wan:2});npc('straz','Gwardzista królewski',W/2-3,D-4.5,Math.PI,{wan:2.5});npc('straz','Gwardzista królewski',W/2+3,D-4.5,Math.PI,{wan:2.5});
  /* liczny dwór: przechadza się po sali i plotkuje w grupkach */{const DW=['Dama dworu','Hrabina','Baron','Szambelan','Kronikarz','Kapelan','Paź','Rycerz','Skarbnik','Dwórka','Podczaszy','Ochmistrzyni','Książę z prowincji','Poseł zza gór','Astrolog','Łowczy'];const n=12+Math.floor(r()*4);for(let k=0;k<n;k++){const side=k%3,x=side===0?5.4+r()*2:side===1?W-5.4-r()*2:W/2+(r()-0.5)*5,z=10+((k*5.3)%Math.max(6,D-18))+r()*2;npc('dworzanin',DW[k%DW.length],x,z,r()*6.28,{wan:side===2?6:4.5})}}npc('blazen',null,W/2+5,8.4,-0.6,{wan:5});npc('mieszk','Herold',W/2-1.4,D-6,Math.PI);npc('mieszk','Minstrel',6.2,D-9.4,Math.PI/2);
  s.geoL=L;SPACES.set(key,s);return s}

function genInterior(h,v){if(h.func==='zamek')return genThrone(h,v);const key='in:'+Math.round(h.x)+'_'+Math.round(h.z);if(SPACES.has(key))return SPACES.get(key);
  const r=rngOf(key),f=h.func,LM=LMK[f],W=LM?LM.W:f==='karczma'?14:f==='kaplica'?10:f==='stajnia'?14:12,D=LM?LM.D:f==='kaplica'?14:f==='karczma'?12:10;
  const s={id:key,kind:'interior',func:f,cs:1,W,D,x0:Math.round(h.x)-W/2,z0:Math.round(h.z)-D/2,fy:700+(Math.abs(Math.round(h.x)*7+Math.round(h.z)*13)%6)*24,ceil:LM?LM.ceil:4.6,solid:new Uint8Array(W*D),h,v,npcs:[],torches:[],lights:[],built:false};
  for(let j=0;j<D;j++)for(let i=0;i<W;i++)if(i===0||j===0||i===W-1||j===D-1)s.solid[j*W+i]=1;
  const SOL=(i0,j0,i1,j1)=>{for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(i>0&&j>0&&i<W-1&&j<D-1)s.solid[j*W+i]=1};
  s.exit=[s.x0+W/2,s.z0+D-1.6];s.spawn=[s.x0+W/2,s.z0+D-2.4];s.out=doorOf(h);s.outY=h.top;s.outRy=h.rot;
  // wnętrze nawiązuje do wyglądu domu z zewnątrz: kolory tynku, belek, drzwi, okiennic i tkanin z palety budynku i rasy
  const RC=(v&&(RBASE[v.race]||v.race))||'ludzie',EP=(()=>{try{const b=palFor(h.type||'dom',h.v||0);return RACEPAL[RC]?RACEPAL[RC](b):b}catch(_){return{}}})();
  const LMS=LM&&LM.stone&&v?kcStyle(v.race,v.sty):null,PL=LMS?LMS.wl:EP.wall||'#ece2c6',PLD=EP.wallD||darker(PL,0.9),WDD=EP.timber||'#4a2f1d',WD=darker(WDD,1.55),ST=EP.stone||'#8e8994',CLO=EP.cloth||'#7a2a22',SHU=EP.shut||'#4a3a2a',DOOR=EP.door||'#5a3a22';
  const L=[],X=i=>i-W/2,Z=j=>j-D/2,P=(...b)=>L.push(b);
  const FL=RC==='krasnoludy'?['#77727a','#6c6770','#4a4650']:RC==='elfy'?['#c8a878','#bc9c6c','#8a6a44']:RC==='orkowie'?['#7a6448','#6e5a40','#3a2a1a']:['#8a6240','#7e5838','#4a2f1d'];
  // podłoga: deski (ludzie), kamienne płyty (krasnoludy), jasne deski (elfy), ubita ziemia ze słomą (orkowie)
  for(let j=1;j<D-1;j++){P(0,-0.1,Z(j)+0.5,W-2,0.2,1,j%2?FL[0]:FL[1]);P(0,0.004,Z(j)+0.02,W-2,0.01,0.04,FL[2]);let x=X(1)+(j%3)*0.9+0.8;while(x<X(W-1)-0.4){P(x,0.004,Z(j)+0.5,0.04,0.01,0.96,FL[2]);x+=(RC==='krasnoludy'?1.1:1.6)+((j*7+Math.round(x*3))%5)*0.35}}
  if(RC==='orkowie')for(let k=0;k<26;k++)P(X(1+r()*(W-2)),0.012,Z(1+r()*(D-2)),0.5+r()*0.6,0.015,0.06,'#c8a85a');
  for(const [x,z,w,d] of [[0,Z(0.5),W,1],[0,Z(D-0.5),W,1],[X(0.5),0,1,D],[X(W-0.5),0,1,D]])P(x,s.ceil/2,z,w,s.ceil,d,PL);
  for(const [x,z,w,d] of [[0,Z(1)+0.03,W-2,0.06],[0,Z(D-1)-0.03,W-2,0.06],[X(1)+0.03,0,0.06,D-2],[X(W-1)-0.03,0,0.06,D-2]]){P(x,0.55,z,w,1.1,d,RC==='krasnoludy'?ST:WD);P(x,1.12,z,w+(d>w?0.04:0),0.08,d+(w>d?0.04:0),WDD);P(x,0.06,z,w+(d>w?0.03:0),0.12,d+(w>d?0.03:0),WDD)}
  // faktura tynku/kamienia: nieregularne plamy i bloki
  for(let k=0;k<Math.round((W+D)*1.6);k++){const side=k%4,t=r(),y=1.4+r()*(s.ceil-1.8),c=r()<0.5?PLD:darker(PL,1.04),w=0.3+r()*0.7,h=0.2+r()*0.4;if(side===0)P(X(1)+t*(W-2),y,Z(1)+0.035,w,h,0.012,c);else if(side===1)P(X(1)+t*(W-2),y,Z(D-1)-0.035,w,h,0.012,c);else if(side===2)P(X(1)+0.035,y,Z(1)+t*(D-2),0.012,h,w,c);else P(X(W-1)-0.035,y,Z(1)+t*(D-2),0.012,h,w,c)}
  for(let i=2;i<W-1;i+=3){P(X(i),s.ceil/2,Z(1)+0.03,0.25,s.ceil,0.06,WDD);P(X(i),s.ceil/2,Z(D-1)-0.03,0.25,s.ceil,0.06,WDD)}
  for(let j=2;j<D-1;j+=3){P(X(1)+0.03,s.ceil/2,Z(j),0.06,s.ceil,0.25,WDD);P(X(W-1)-0.03,s.ceil/2,Z(j),0.06,s.ceil,0.25,WDD)}
  P(0,s.ceil+0.15,0,W,0.3,D,'#5a3a22');for(let i=2;i<W-1;i+=2)P(X(i),s.ceil-0.15,0,0.3,0.3,D-2,WDD);
  P(0,1.2,Z(D-1)-0.02,1.4,2.4,0.08,DOOR);P(0,2.5,Z(D-1)-0.05,1.8,0.2,0.12,WDD);for(const x of [-0.4,0,0.4])P(x,1.2,Z(D-1)-0.07,0.05,2.3,0.02,darker(DOOR,0.8));P(0.5,1.15,Z(D-1)-0.09,0.08,0.08,0.05,'#3a3a40');P(0,0.65,Z(D-1)-0.07,1.3,0.06,0.02,'#3a3a40');P(0,1.8,Z(D-1)-0.07,1.3,0.06,0.02,'#3a3a40');   // drzwi z okuciami
  // okna jak na fasadzie: rama w kolorze okiennic, szyby świecące światłem dnia, smuga światła na podłodze
  s.winL=[];{const wy=2.0,win=(x,z,ax)=>{const fw=ax?0.08:1.0,fd=ax?1.0:0.08;P(x,wy,z,fw+(ax?0:0.24),1.3,fd+(ax?0.24:0),SHU);P(x,wy,z,ax?0.1:0.18,1.34,ax?0.18:0.1,WDD);P(x,wy-0.72,z,ax?0.3:1.3,0.08,ax?1.3:0.3,WDD);s.winL.push([x,wy,z,ax?0.02:0.82,1.1,ax?0.82:0.02]);
      const dir=ax?(x<0?1:-1):(z<0?1:-1);for(let q=1;q<=3;q++){const o=q*0.55;s.winL.push([ax?x+dir*o:x,0.03,ax?z:z+dir*o,ax?0.5:0.85,0.01,ax?0.85:0.5,1])}};
    for(let i=3;i<W-3;i+=4)win(X(i)+0.5,Z(1)+0.06,0);for(let j=3;j<D-3;j+=4){win(X(1)+0.06,Z(j)+0.5,1);win(X(W-1)-0.06,Z(j)+0.5,1)}}
  // dywan w kolorze tkanin domu, półka z naczyniami, wiązki ziół pod belkami
  {const rw=Math.min(4,W-6),rd=Math.min(2.6,D-6);P(0,0.012,Z(D/2+1.2),rw,0.012,rd,CLO);P(0,0.016,Z(D/2+1.2),rw-0.4,0.012,rd-0.4,darker(CLO,1.25));P(0,0.02,Z(D/2+1.2),rw-1.2,0.012,rd-1.2,CLO);for(const sx of [-1,1])for(let q=0;q<5;q++)P(sx*(rw/2+0.06),0.014,Z(D/2+1.2)-rd/2+0.3+q*(rd-0.6)/4,0.12,0.012,0.04,'#e8dcc0')}
  if(f!=='kaplica'&&f!=='stajnia'){const sx=X(W-1)-0.2,sz=Z(D-3);P(sx,1.75,sz,0.3,0.05,1.6,WD);P(sx,1.2,sz,0.3,0.05,1.6,WD);for(let q=0;q<4;q++){P(sx,1.84,sz-0.6+q*0.4,0.14,0.14,0.14,['#c9a24a','#8a5a30','#d8d0b8','#5a7a8a'][q]);P(sx,1.3,sz-0.6+q*0.4,0.16,0.12,0.18,['#a8452f','#e8e2cc','#6b4a2b','#86c060'][q])}
    for(let q=0;q<3;q++){const hx=X(2+q*3)+0.5;P(hx,s.ceil-0.5,Z(D/2),0.03,0.4,0.03,'#6b4a2b');P(hx,s.ceil-0.8,Z(D/2),0.18,0.3,0.12,['#6a8a3a','#8a7a3a','#7a5a8a'][q])}}
  const torch=(x,z)=>{P(x,2.2,z,0.12,0.5,0.12,WDD);s.torches.push([s.x0+W/2+x,s.fy+2.6,s.z0+D/2+z])};
  const npc=(role,roleN,i,j,ry)=>s.npcs.push({role,roleN,x:s.x0+i+0.5,z:s.z0+j+0.5,ry:ry||0});
  const table=(i,j)=>{SOL(i,j,i+1,j);P(X(i+1),0.8,Z(j+0.5),2,0.12,1,WD);P(X(i+1),0.4,Z(j+0.5),0.2,0.8,0.2,WDD);P(X(i+1)-0.5,0.95,Z(j+0.5),0.2,0.2,0.2,'#c9a24a');P(X(i+1)+0.4,0.92,Z(j+0.5)+0.2,0.25,0.12,0.25,'#d8d0b8');P(X(i+1),0.45,Z(j-0.2),2,0.1,0.4,WD);P(X(i+1),0.45,Z(j+1.2),2,0.1,0.4,WD)};
  const barrel=(i,j)=>{SOL(i,j,i,j);P(X(i+0.5),0.45,Z(j+0.5),0.7,0.9,0.7,'#8a5a30');P(X(i+0.5),0.25,Z(j+0.5),0.74,0.06,0.74,'#3a3a40');P(X(i+0.5),0.7,Z(j+0.5),0.74,0.06,0.74,'#3a3a40')};
  const fire=(i,j,wide)=>{SOL(i,j,i+(wide?1:0),j);const x=X(i+(wide?1:0.5)),z=Z(j+0.5);P(x,0.9,z,wide?2.4:1.4,1.8,1,ST);P(x,0.5,z+0.2,wide?1.6:0.8,0.8,0.62,'#1a1210');P(x,0.4,z+0.25,wide?1.2:0.6,0.4,0.5,'!#ff8a2e');P(x,0.6,z+0.25,0.5,0.3,0.4,'!#ffd34d');P(x,0.3,z+0.42,wide?1.3:0.7,0.12,0.12,'!#c83a1a');P(x,2.8,z,wide?1.4:0.9,s.ceil-1.4,0.9,ST);s.lights.push([s.x0+W/2+x,s.fy+0.8,s.z0+D/2+z+0.9,7.5,1.25,[1,0.58,0.26]])};
  if(f==='karczma'){SOL(2,1,W-3,2);P(0,0.55,Z(2.5),W-5,1.1,1,'#6b4528');P(0,1.12,Z(2.5),W-4.8,0.08,1.1,'#8a6240');for(let i=3;i<W-3;i+=2)barrel(i,1);
    for(let k=0;k<4;k++)P(X(2+k*2.6),2.4,Z(1)+0.15,0.6,0.1,0.25,'#d8d0b8');table(2,5);table(W-4,5);table(2,8);table(W-4,8);fire(W-3,3,false);torch(X(1)+0.2,Z(6));torch(X(W-1)-0.2,Z(7));
    P(0,s.ceil-0.6,0,1.6,0.1,1.6,'#3a2414');for(const [a,b] of [[-0.6,-0.6],[0.6,-0.6],[-0.6,0.6],[0.6,0.6]])P(a,s.ceil-0.8,b,0.12,0.3,0.12,'#fff2c0');
    npc('kupiec','Karczmarz',W/2,3.2,0);npc('mieszk','Gość',3,6.5,Math.PI);npc('najemnik',null,W-3,7.6,Math.PI*1.2);if(r()<0.6)npc('najemnik',null,4,9.4,0)}
  else if(f==='kuznia'){fire(1,1,true);P(X(2),0.7,Z(3),1,0.5,0.6,'#4a3020');SOL(5,4,6,4);P(X(6),0.4,Z(4.5),0.8,0.8,0.6,WDD);P(X(6),0.9,Z(4.5),1.6,0.25,0.6,'#4a4a52');
    for(let k=0;k<4;k++){P(X(W-1)-0.15,1.6,Z(2+k*1.6),0.1,1.4,0.1,'#aeb6bd');P(X(W-1)-0.15,2.2,Z(2+k*1.6),0.1,0.4,0.4,'#8a8f94')}P(X(W-1)-0.1,1.4,Z(5),0.08,0.1,6,WDD);
    barrel(1,D-3);barrel(2,D-3);SOL(W-4,1,W-2,1);P(X(W-2.5),0.5,Z(1.5),3,1,1,WD);torch(X(W/2),Z(1)+0.2);npc('kowal',null,4,3,0)}
  else if(f==='sklep'||f==='piekarnia'){for(let i=1;i<W-1;i++){SOL(i,1,i,1);P(X(i+0.5),1.3,Z(1.5),1,2.6,0.9,WD);for(const y of [0.8,1.5,2.2])P(X(i+0.5),y,Z(1.8),0.6,0.3,0.25,['#c9a24a','#a8452f','#3f6d9a','#86c060','#d8c8a0'][(i+Math.round(y*3))%5])}
    SOL(3,4,W-4,4);P(0,0.55,Z(4.5),W-7,1.1,1,'#6b4528');if(f==='piekarnia'){fire(1,D-3,true);for(let k=0;k<5;k++)P(X(3+k),1.15,Z(4.5),0.4,0.15,0.3,'#d8a43a')}
    for(let k=0;k<3;k++)barrel(W-2,D-3-k);torch(X(1)+0.2,Z(5));npc('kupiec',f==='piekarnia'?'Piekarz':null,W/2,3.4,0)}
  else if(f==='kaplica'){for(let j=4;j<D-3;j+=2){SOL(2,j,3,j);SOL(W-4,j,W-3,j);P(X(3),0.45,Z(j+0.5),2,0.12,0.8,WD);P(X(W-3),0.45,Z(j+0.5),2,0.12,0.8,WD);P(X(3),0.8,Z(j+0.9),2,0.6,0.1,WD);P(X(W-3),0.8,Z(j+0.9),2,0.6,0.1,WD)}
    SOL(3,1,W-4,2);P(0,0.5,Z(1.8),4,1,1.6,'#e8e2d6');P(0,1.04,Z(1.8),4.2,0.08,1.8,'#a8352a');for(const x of [-1.6,1.6])P(x,1.3,Z(1.6),0.12,0.5,0.12,'#fff6d8');P(0,2.6,Z(1)+0.05,0.2,1.6,0.1,'#d9b23a');P(0,3.0,Z(1)+0.05,0.9,0.2,0.1,'#d9b23a');
    for(const x of [X(1)+0.02,X(W-1)-0.02])for(const z of [Z(4),Z(8)])P(x,2.4,z,0.06,1.4,0.8,['#3f5a8a','#a8352a'][Math.abs(Math.round(z))%2]);torch(X(3),Z(1)+0.2);torch(X(W-3),Z(1)+0.2);npc('starszy','Kapłan',W/2,3.4,0);s.heal=1}
  else if(f==='stajnia'){for(let k=0;k<3;k++){const i=2+k*4;SOL(i,1,i,4);P(X(i+0.5),0.7,Z(2.5),0.2,1.4,4,WD);P(X(i+2.5),0.3,Z(1.8),1.6,0.6,0.8,'#6b4a2b');P(X(i+2.5),0.35,Z(3.4),1.4,0.7,1,'#d8b24a');s.npcs.push({horse:1,x:s.x0+i+2.5,z:s.z0+3,ry:Math.PI})}
    torch(X(W/2),Z(D-1)-0.2);npc('mieszk','Stajenny',W/2,D-3,Math.PI)}
  else if(LM){lmFurnish(f,s,{P,X,Z,SOL,npc,torch,table,barrel,fire,r,W,D,WD,WDD,ST,CLO})}
  else if(f==='dom'){// izba mieszkalna: łóżko, szafa, palenisko z kociołkiem, stół z ławami, kredens, skrzynia
    SOL(1,1,2,3);P(X(2),0.25,Z(2.5),2,0.5,3,WD);P(X(2),0.55,Z(2.6),1.8,0.18,2.6,'#e8e2d0');P(X(2),0.66,Z(3.1),1.86,0.08,1.7,['#a8352a','#3f6a8a','#5a8a3a'][Math.floor(r()*3)]);P(X(2),0.7,Z(1.6),1.2,0.16,0.5,'#f4efe4');P(X(2),0.9,Z(1)+0.12,2,1.0,0.12,WDD);
    SOL(1,4,1,4);P(X(1.5),0.35,Z(4.5),0.9,0.7,0.7,'#7a4b22');P(X(1.5),0.72,Z(4.5),0.94,0.06,0.74,'#3a3a40');
    SOL(W-3,1,W-2,1);P(X(W-2),1.2,Z(1.45),1.9,2.4,0.8,WD);P(X(W-2)-0.47,1.2,Z(1.87),0.9,2.2,0.04,'#8a6240');P(X(W-2)+0.47,1.2,Z(1.87),0.9,2.2,0.04,'#8a6240');for(const x of [-0.08,0.08])P(X(W-2)+x,1.25,Z(1.9),0.05,0.14,0.04,'#c9a24a');
    fire(5,1,true);P(X(6),0.95,Z(1.75),0.06,0.06,0.9,'#3a3a40');P(X(6),0.6,Z(1.9),0.6,0.4,0.6,'#2a2a30');P(X(6),0.82,Z(1.9),0.5,0.04,0.5,'#6a8a4a');
    table(4,5);for(const x of [X(4.6),X(5.4)])P(x,0.94,Z(5.5),0.12,0.16,0.12,'#f0e8d0'),P(x,1.06,Z(5.5),0.06,0.08,0.06,'#ffd38a');
    SOL(W-2,4,W-2,6);P(X(W-1.5),1.0,Z(5.5),0.7,2,2.8,WD);for(const y of [0.7,1.3,1.9])P(X(W-1.5)-0.05,y,Z(5.5),0.62,0.05,2.7,WDD);for(let k=0;k<6;k++)P(X(W-1.5)-0.15,0.85+Math.floor(k/3)*0.6,Z(4.4+(k%3)*0.9),0.2,0.25,0.25,['#d8d0b8','#c9a24a','#8a5a30','#3f6d9a'][k%4]);
    barrel(1,D-3);npc('mieszk','Gospodarz',W/2-2,7.5,0);torch(X(1)+0.2,Z(6));s.pets=[r()<0.5?'kot':'pies']}
  else if(f==='warsztat'){SOL(2,1,5,1);P(X(4),0.9,Z(1.5),4,0.15,0.9,'#8a6240');P(X(4),0.45,Z(1.5),3.8,0.9,0.7,WD);for(let k=0;k<6;k++)P(X(2.4+k*0.6),1.6,Z(1)+0.08,0.08,0.4+(k%3)*0.1,0.05,k%2?'#8a8f94':'#6b4528');P(X(4),1.4,Z(1)+0.05,3.6,0.06,0.06,WDD);
    SOL(W-4,3,W-3,3);P(X(W-3),0.45,Z(3.5),1.8,0.12,0.4,WD);for(const x of [-0.7,0.7])P(X(W-3)+x,0.25,Z(3.5),0.12,0.5,0.6,WDD);P(X(W-3),0.75,Z(3.5),1.6,0.4,0.4,'#a87a4a');
    SOL(1,4,1,6);for(let k=0;k<6;k++)P(X(1.5),0.1+k*0.14,Z(5),0.7,0.12,2.6,k%2?'#b88a5a':'#a87a4a');for(let k=0;k<12;k++)P(X(3+r()*6),0.02,Z(3+r()*4),0.2,0.02,0.1,'#d8b07a');
    barrel(W-2,D-3);barrel(W-2,D-4);torch(X(W/2),Z(D-1)-0.2);npc('mieszk','Cieśla',W/2,4.2,0);s.pets=r()<0.4?['kot']:[]}
  else{for(let k=0;k<5;k++){const i=1+k*2;SOL(i,1,i+1,2);for(let q=0;q<3;q++)P(X(i+1),0.35+q*0.6,Z(2),1.6,0.6,1.6,q%2?'#d8c8a0':'#d8b24a')}
    SOL(W-4,4,W-2,5);P(X(W-3),0.45,Z(5),3,0.9,2,'#7a5532');for(let k=0;k<8;k++)P(X(2+r()*7),0.03,Z(4+r()*3),0.12,0.04,0.12,'#d8b24a');torch(X(W/2),Z(D-1)-0.2);npc('mieszk','Zarządca',W/2,5,0);s.pets=r()<0.5?['kot']:[]}
  // ===== detale każdego wnętrza: dywan, żyrandol ze świecami, półki, obrazy, zioła, pajęczyny, rośliny =====
  {const free=(i,j)=>i>0&&j>0&&i<W-1&&j<D-1&&!s.solid[j*W+i],cx=Math.floor(W/2),cz=Math.floor(D/2);
    if(free(cx,cz)&&free(cx-1,cz)&&f!=='stajnia'){const rc=['#8a2a2a','#2f4f7f','#5a3a6a','#6a5a2a'][Math.floor(r()*4)];P(0,0.01,Z(cz+0.5),3.2,0.03,2.2,rc);P(0,0.025,Z(cz+0.5),2.8,0.02,1.8,'#d8b24a');P(0,0.035,Z(cz+0.5),2.5,0.02,1.5,rc)}
    if(f!=='karczma'){P(0,s.ceil-0.35,0,0.08,0.6,0.08,'#3a3a40');P(0,s.ceil-0.7,0,1.3,0.08,1.3,'#3a2414');for(const [a,b] of [[-0.55,0],[0.55,0],[0,-0.55],[0,0.55]]){P(a,s.ceil-0.58,b,0.1,0.22,0.1,'#f0e8d0');P(a,s.ceil-0.43,b,0.06,0.08,0.06,'!#ffd27a')}s.lights.push([s.x0+W/2,s.fy+s.ceil-0.6,s.z0+D/2,6,0.7,[1,0.78,0.5]])}
    // okna: rama z krzyżem, szyby, parapet i plama światła na podłodze
    const WIN=new Set(),WALL=new Set(),wb=(sd,j)=>WALL.has(sd+':'+j)||WIN.has(sd+':'+j);
    // ściany zajęte przez stałe wyposażenie (stojak kowala, chorągwie kaplicy) — tam nie wieszamy okien ani ozdób
    if(f==='kuznia')for(let j=1;j<D-1;j++)WALL.add('1:'+j);if(f==='kaplica')for(const j of [3,4,7,8])WALL.add('0:'+j),WALL.add('1:'+j);
    const GL='#cfe6ff',win=(side,c)=>{const sx=side===0?X(1):side===1?X(W-1):0,dir=side===0?1:side===1?-1:0;
      if(side<2){const z=Z(c+0.5),x=sx+dir*0.06;P(x,2.1,z,0.04,1.1,0.9,GL);for(const dz of [-0.5,0.5])P(x+dir*0.03,2.1,z+dz,0.12,1.24,0.1,'#4a2f1d');for(const dy of [-0.6,0.6])P(x+dir*0.03,2.1+dy,z,0.12,0.1,1.1,'#4a2f1d');P(x+dir*0.05,2.1,z,0.08,1.1,0.06,'#4a2f1d');P(x+dir*0.05,2.15,z,0.08,0.06,0.9,'#4a2f1d');P(sx+dir*0.14,1.44,z,0.28,0.07,1.2,'#7a5030');if(free(side?W-2:1,c))P(sx+dir*1.4,0.013,z+0.15,1.9,0.01,0.85,'#efdca0');WIN.add(side+':'+c)}
      else{const x=X(c+0.5),z=Z(D-1)-0.06;P(x,2.1,z,0.9,1.1,0.04,GL);for(const dx of [-0.5,0.5])P(x+dx,2.1,z-0.03,0.1,1.24,0.12,'#4a2f1d');for(const dy of [-0.6,0.6])P(x,2.1+dy,z-0.03,1.1,0.1,0.12,'#4a2f1d');P(x,2.1,z-0.05,0.06,1.1,0.08,'#4a2f1d');P(x,2.15,z-0.05,0.9,0.06,0.08,'#4a2f1d');P(x,1.44,Z(D-1)-0.14,1.2,0.07,0.28,'#7a5030');if(free(c,D-2))P(x+0.15,0.013,Z(D-1)-1.4,0.85,0.01,1.9,'#efdca0')}};
    for(const c of [Math.max(2,Math.round(W*0.22)),W-1-Math.max(2,Math.round(W*0.22))])if(c>1&&c<W-2&&Math.abs(c+0.5-W/2)>1.6)win(2,c);
    for(let j=2;j<D-2;j+=3)for(const sd of [0,1]){const wx=sd?W-2:1;if(r()<0.25)continue;if(!free(wx,j)||wb(sd,j)||wb(sd,j-1)||wb(sd,j+1))continue;win(sd,j)}
    for(let j=2;j<D-2;j+=3){for(const [x,wx] of [[X(1)+0.18,1],[X(W-1)-0.18,W-2]]){const sd=wx===1?0:1;if(wb(sd,j)||wb(sd,j+1)||wb(sd,j-1))continue;if(!free(wx,j)||!free(wx,j+1)||r()<0.35)continue;WALL.add(sd+':'+j);WALL.add(sd+':'+(j+1));P(x,1.85,Z(j+0.5),0.3,0.06,1.4,WD);for(let k=0;k<4;k++)P(x,2.0,Z(j)+0.25+k*0.3,0.18,0.24-(k%2)*0.06,0.14,['#a8452f','#3f6d9a','#d8d0b8','#5a8a3a','#c9a24a'][(k+j)%5])}}
    for(const [x,z,rot,sd,cj] of [[X(1)+0.04,Z(D/2-1.5),1,0,Math.floor(D/2-1.5)],[X(W-1)-0.04,Z(D/2+1),1,1,Math.floor(D/2+1)],[X(W/2+2),Z(1)+0.04,0,-1,0]]){if(r()<0.4)continue;if(sd>=0&&(wb(sd,cj)||wb(sd,cj-1)||wb(sd,cj+1)||!free(sd?W-2:1,cj)))continue;if(sd<0&&(!free(Math.floor(W/2+2),1)||!free(Math.floor(W/2+1),1)||['sklep','piekarnia','karczma','kaplica'].includes(f)))continue;if(sd>=0){WALL.add(sd+':'+cj);WALL.add(sd+':'+(cj-1));WALL.add(sd+':'+(cj+1))}const pc=['#3f6a8a','#8a5a3a','#5a7a4a','#7a3a5a'][Math.floor(r()*4)];if(rot){P(x,2.4,z,0.04,0.9,1.2,'#c9a24a');P(x,2.4,z,0.06,0.74,1.04,pc);P(x,2.3,z,0.07,0.3,0.4,'#e8d8a8')}else{P(x,2.4,z,1.2,0.9,0.04,'#c9a24a');P(x,2.4,z,1.04,0.74,0.06,pc)}}
    for(const [i,j] of [[1,D-2],[W-2,D-2]])if(free(i,j)&&r()<0.7){SOL(i,j,i,j);P(X(i+0.5),0.25,Z(j+0.5),0.5,0.5,0.5,'#8a5a3a');P(X(i+0.5),0.7,Z(j+0.5),0.7,0.5,0.7,'#4a8a3a');P(X(i+0.5),1.05,Z(j+0.5),0.45,0.3,0.45,'#5aa04a')}
    for(let k=0;k<3;k++){const x=X(2+r()*(W-4)),z=Z(2+r()*(D-4));P(x,s.ceil-0.5,z,0.04,0.5,0.04,'#6a4a2a');P(x,s.ceil-0.85,z,0.22,0.3,0.12,['#6a8a3a','#8a7a3a','#a87a4a'][k])}
    for(const [x,z] of [[X(1)+0.15,Z(1)+0.15],[X(W-1)-0.15,Z(1)+0.15]])P(x,s.ceil-0.25,z,0.5,0.5,0.03,'#e8e6e0');
    for(const k of WALL)WIN.add(k);interiorExtras(P,SOL,free,s,f,r,X,Z,W,D,WIN)}
  try{raceInterior(L,v&&v.race)}catch(e){}s.geoL=L;SPACES.set(key,s);return s}
// dodatkowe wyposażenie wnętrz: stołki, skrzynie, świeczniki, worki, trofea, narzędzia (tylko na wolnych polach)
function interiorExtras(P,SOL,free0,s,f,r,X,Z,W,D,WIN){const free=(i,j)=>free0(i,j)&&!(s.npcs||[]).some(n=>Math.abs(n.x-(s.x0+i+0.5))<1.2&&Math.abs(n.z-(s.z0+j+0.5))<1.2)&&!(s.exit&&Math.abs(s.exit[0]-(s.x0+i+0.5))<1.5&&Math.abs(s.exit[1]-(s.z0+j+0.5))<2.2);const WD='#7a5030',WDD='#4a2f1d',pick=a=>a[Math.floor(r()*a.length)];
  const wallSpots=[];for(let j=2;j<D-2;j++)for(const sd of [0,1]){const i=sd?W-2:1;if(free(i,j)&&!WIN.has(sd+':'+j)&&!WIN.has(sd+':'+(j-1))&&!WIN.has(sd+':'+(j+1)))wallSpots.push([sd,i,j])}
  const take=()=>{if(!wallSpots.length)return null;const k=Math.floor(r()*wallSpots.length),q=wallSpots[k];wallSpots.splice(k,1);for(let m=wallSpots.length-1;m>=0;m--)if(wallSpots[m][0]===q[0]&&Math.abs(wallSpots[m][2]-q[2])<2)wallSpots.splice(m,1);return q};
  const stool=(x,z)=>{P(x,0.45,z,0.42,0.07,0.42,WD);for(const [a,b] of [[-0.15,-0.15],[0.15,-0.15],[-0.15,0.15],[0.15,0.15]])P(x+a,0.21,z+b,0.06,0.42,0.06,WDD)};
  const chest=(sd,i,j)=>{SOL(i,j,i,j);const x=X(i+0.5)+(sd?0.1:-0.1),z=Z(j+0.5);P(x,0.3,z,0.7,0.6,1.0,'#7a4b22');P(x,0.62,z,0.72,0.08,1.02,'#5a3416');for(const dz of [-0.35,0.35])P(x,0.33,z+dz,0.74,0.62,0.06,'#3a3a40');P(x+(sd?-0.37:0.37),0.45,z,0.04,0.12,0.12,'#c9a24a')};
  const sacks=(sd,i,j)=>{SOL(i,j,i,j);const x=X(i+0.5),z=Z(j+0.5);P(x,0.3,z-0.2,0.5,0.6,0.45,'#c8b48a');P(x,0.62,z-0.2,0.3,0.1,0.3,'#a8946a');P(x+0.05,0.26,z+0.28,0.45,0.52,0.42,'#bca67a');P(x+0.05,0.55,z+0.28,0.26,0.08,0.26,'#9a8660')};
  const candle=(sd,i,j)=>{const x=X(i+0.5)+(sd?0.15:-0.15),z=Z(j+0.5);SOL(i,j,i,j);P(x,0.45,z,0.5,0.9,0.5,WD);P(x,0.92,z,0.56,0.05,0.56,WDD);P(x,1.05,z,0.08,0.22,0.08,'#f0e8d0');P(x,1.19,z,0.05,0.07,0.05,'!#ffd38a');s.lights.push([s.x0+W/2+x,s.fy+1.3,s.z0+D/2+z,3.2,0.45,[1,0.75,0.45]]);P(x+0.15,1.0,z+0.1,0.06,0.14,0.06,'#f0e8d0')};
  const trophy=(sd,j)=>{const x=sd?X(W-1)-0.06:X(1)+0.06,z=Z(j+0.5),dx=sd?-1:1;P(x,2.6,z,0.06,0.5,0.4,WDD);P(x+dx*0.18,2.6,z,0.3,0.22,0.2,'#8a6a4a');for(const g of [-1,1]){P(x+dx*0.2,2.85,z+g*0.18,0.06,0.3,0.06,'#e8dcc0');P(x+dx*0.2,3.0,z+g*0.3,0.06,0.06,0.25,'#e8dcc0')}};
  const rack=(sd,j)=>{const x=sd?X(W-1)-0.1:X(1)+0.1,z=Z(j+0.5);P(x,1.6,z,0.08,0.08,1.4,WDD);P(x,1.0,z,0.08,0.08,1.4,WDD);for(let k=0;k<3;k++){const zz=z-0.45+k*0.45;P(x+(sd?-0.06:0.06),1.35,zz,0.05,1.4,0.05,'#6b4528');P(x+(sd?-0.06:0.06),2.1,zz,0.05,0.25,0.12,'#aeb6bd')}};
  const pots=(sd,j)=>{const x=sd?X(W-1)-0.15:X(1)+0.15,z=Z(j+0.5);P(x,2.2,z,0.06,0.06,1.3,'#3a3a40');for(let k=0;k<3;k++){const zz=z-0.45+k*0.45;P(x,2.0,zz,0.02,0.3,0.02,'#3a3a40');P(x,1.75,zz,0.28,0.22,0.28,k%2?'#8a5a3a':'#5a5a62')}};
  const n=f==='stajnia'?1:2+Math.floor(r()*2);for(let k=0;k<n;k++){const q=take();if(!q)break;const [sd,i,j]=q,t=r();if(t<0.35)chest(sd,i,j);else if(t<0.6)candle(sd,i,j);else sacks(sd,i,j)}
  {const q=take();if(q&&f!=='kaplica'){const [sd,,j]=q;(f==='kuznia'?rack:(f==='karczma'||f==='dom')?(r()<0.5?trophy:pots):pick([rack,pots,trophy]))(sd,j)}}
  for(let k=0;k<6;k++){const i=2+Math.floor(r()*(W-4)),j=2+Math.floor(r()*(D-5));if(free(i,j)&&free(i+1,j)&&free(i,j+1)&&f!=='kaplica'&&f!=='stajnia'){stool(X(i+0.5),Z(j+0.5));break}}
  if(f==='karczma')for(const [ti,tj] of [[2,5],[W-4,5],[2,8],[W-4,8]])for(const dx of [-0.5,0.45]){const x=X(ti+1)+dx,z=Z(tj+0.5)+(dx>0?-0.2:0.15);P(x,0.95,z,0.14,0.2,0.14,'#a8803a');P(x,1.06,z,0.12,0.03,0.12,'#f4efe4')}
  if(f==='sklep'){P(0.9,1.18,Z(4.5),0.5,0.06,0.3,'#c9a24a');P(0.9,1.4,Z(4.5),0.05,0.4,0.05,'#c9a24a');P(0.9,1.58,Z(4.5),0.7,0.04,0.04,'#c9a24a')}}
// --- lochy i jaskinie: pokoje + korytarze (loch) albo automat komórkowy (jaskinia) ---
// ===== arena z zewnątrz: okrągły amfiteatr z arkadami, bramą i chorągwiami =====

// pierścień z prostopadłościanów ułożonych rzędami (wokselowe koło): r0..r1, wysokość y0..y1
function ringBoxes(P,cx,cz,r0,r1,y0,y1,col,st,skip){st=st||1;for(let z=-Math.ceil(r1/st)*st;z<r1;z+=st){const zc=z+st/2,a=Math.abs(zc);if(a>=r1)continue;const xo=Math.round(Math.sqrt(r1*r1-a*a)/st*2)*st/2,xi=a<r0?Math.round(Math.sqrt(r0*r0-a*a)/st*2)*st/2:0;if(xo-xi<0.05)continue;const c=typeof col==='function'?col(zc):col;
    if(xi>0){for(const sg of [-1,1]){if(skip&&skip(sg*(xi+xo)/2,zc))continue;P(cx+sg*(xi+xo)/2,(y0+y1)/2,cz+zc,xo-xi,y1-y0,st,c)}}else if(!(skip&&skip(0,zc)))P(cx,(y0+y1)/2,cz+zc,2*xo,y1-y0,st,c)}}
function arenaExtList(race,sty){const S=kcStyle(race||'ludzie',sty),L=[],P=(...b)=>L.push(b),R=9.2,DK='#1a1410',WO='#4a2f1d',IR='#3a3a40',TW=S.tw;
  const gate=(x,z)=>z>7.6&&Math.abs(x)<2.2;
  P(0,-1.9,0,19.5,4.0,19.5,S.wd);P(0,0.06,0,19.5,0.12,19.5,S.w);for(let i=-4;i<=4;i++)for(let j=-4;j<=4;j++)if((i+j)&1)P(i*2.1,0.13,j*2.1,2.0,0.03,2.0,S.wl);
  // amfiteatr: cokół, dwie kondygnacje arkad z półkolumnami, attyka z oknami i masztami żaglowymi, gzymsy
  ringBoxes(P,0,0,8.3,10.25,0.1,1.0,S.wd,0.5,gate);ringBoxes(P,0,0,8.4,9.8,1.0,9.9,S.w,0.5,gate);
  for(const [y,c,ro] of [[1.0,S.wl,10.3],[4.05,S.wl,10.2],[4.3,S.wd,10.05],[7.05,S.wl,10.15],[9.9,S.wl,10.2],[10.2,S.wd,10.05]])ringBoxes(P,0,0,8.5,ro,y,y+0.28,c,0.5,gate);
  const N=28,RR=R+0.62;for(let k=0;k<N;k++){const a=(k+0.5)/N*Math.PI*2,c=Math.cos(a),s=Math.sin(a);const ax=Math.abs(c)>Math.abs(s),x=c*RR,z=s*RR,o=(u,v)=>ax?[u,v]:[v,u];
    const hole=(y,w,h,col,dep)=>{const [ww,dd]=o(0.36,w);P(x+c*(dep||0),y,z+s*(dep||0),ww,h,dd,col)};
    if(!(s>0.86)){// parter: wysoki łuk z kluczem, w głębi jaśniejsze sklepienie korytarza
      hole(2.3,1.5,2.4,DK);for(let q=0;q<3;q++){const ww=1.5-q*0.42;hole(3.6+q*0.17,ww,0.18,DK)}hole(1.5,1.2,1.4,'#4a3c30',-0.12);
      {const [ww,dd]=o(0.4,0.32);P(c*(RR+0.06),4.0,s*(RR+0.06),ww,0.22,dd,S.wl)}
      // piętro: łuk niższy, tralki balustrady
      hole(5.55,1.3,1.9,DK);for(let q=0;q<2;q++){const ww=1.3-q*0.5;hole(6.6+q*0.16,ww,0.17,DK)}
      for(let q=-1;q<=1;q++){const [ww,dd]=o(0.38,0.12);P(x+(ax?0:q*0.4),4.75,z+(ax?q*0.4:0),ww,0.55,dd,S.wl)}{const [ww,dd]=o(0.4,1.4);P(x,5.05,z,ww,0.1,dd,S.wl)}
      // attyka: małe prostokątne okno, co trzecie oświetlone
      hole(8.5,0.7,0.8,k%3?DK:'!#ffcf6a');
      if(k%4===1){const [ww,dd]=o(0.1,0.6);P(c*(RR+0.1),5.7,s*(RR+0.1),ww,1.5,dd,S.bn);P(c*(RR+0.14),5.9,s*(RR+0.14),ww*0.6,0.4,dd*0.45,S.tr)}}
    // półkolumny między łukami: baza, trzon, kapitel — na obu kondygnacjach i pilaster attyki
    const a2=k/N*Math.PI*2,c2=Math.cos(a2),s2=Math.sin(a2);if(s2<=0.9){const X=c2*(R+0.78),Z=s2*(R+0.78);P(X,1.3,Z,0.95,0.4,0.95,S.wd);P(X,2.55,Z,0.62,2.3,0.62,S.wl);P(X,3.8,Z,0.85,0.3,0.85,S.wd);P(X,4.75,Z,0.85,0.35,0.85,S.wd);P(X,5.85,Z,0.56,2.0,0.56,S.wl);P(X,6.9,Z,0.78,0.28,0.78,S.wd);P(c2*(R+0.7),8.5,s2*(R+0.7),0.5,2.6,0.5,S.w);
      P(c2*(R+0.95),9.9,s2*(R+0.95),0.36,0.3,0.36,S.wd);/* wsporniki masztów żaglowych */if(k%2===0){P(c2*(R+0.85),10.9,s2*(R+0.85),0.14,2.4,0.14,WO);P(c2*(R+0.85),9.85,s2*(R+0.85),0.3,0.25,0.3,S.wd)}}
    // blanki/zwieńczenie attyki zależnie od rasy
    {const tx=c*(R+0.45),tz=s*(R+0.45);if(!(s>0.86)){if(TW==='spike'){P(tx,10.95,tz,0.22,1.1,0.22,WO);P(tx,11.6,tz,0.12,0.4,0.12,'#d8d0b8')}else if(TW==='flat'||race==='krasnoludy'){const [ww,dd]=o(0.6,0.9);P(tx,10.75,tz,ww,0.7,dd,S.wl)}else{const [ww,dd]=o(0.5,0.5);P(tx,10.55,tz,ww,0.3,dd,S.wl)}}}}
  // żagle (velarium) rozpięte nad górnymi rzędami trybun — pasy w barwach miasta
  {/* żagiel (velarium) nad górnymi rzędami: pasy w barwach miasta, opada ku środkowi */const st=0.5;for(let z=-9.25;z<9.3;z+=st){let run=null;const flush=()=>{if(run){P((run.x0+run.x1)/2,run.y,z,run.x1-run.x0,0.08,st,run.c);run=null}};
     for(let x=-9.25;x<9.3;x+=st){const r=Math.hypot(x,z),ok=r>6.5&&r<9.3&&!(z>6.2&&Math.abs(x)<4.6);if(!ok){flush();continue}const sc=Math.floor((Math.atan2(z,x)+Math.PI)/(Math.PI*2)*18)%2,c=sc?S.bn:'#ece4cc',y=+(10.95+Math.round((r-6.5)*0.25/0.08)*0.08).toFixed(2);
       if(run&&run.c===c&&run.y===y){run.x1=x+st/2}else{flush();run={x0:x-st/2,x1:x+st/2,c,y}}}flush()}}
  for(let t=0;t<4;t++)ringBoxes(P,0,0,3.4+t*1.25,4.65+t*1.25+(t===3?0.2:0),0.2,2.2+t*1.7,t%2?S.wd:S.w,0.5);for(let t=0;t<4;t++)ringBoxes(P,0,0,3.5+t*1.25,4.1+t*1.25,2.2+t*1.7,2.32+t*1.7,'#6b4a2b',0.5);
  ringBoxes(P,0,0,0,3.4,0.2,0.5,'#d8c08a',0.5);P(0,0.52,0,1.6,0.04,1.6,S.bn);P(0,0.54,0,0.9,0.04,0.9,S.tr);
  for(let k=0;k<40;k++){const a=k*2.399,t=k%4,rr=4.0+t*1.25;P(Math.cos(a)*rr,2.6+t*1.7,Math.sin(a)*rr,0.4,0.6,0.4,['#a8352a','#2f5f8f','#3f7a35','#d9b23a','#6a3a8a'][k%5])}
  // brama triumfalna: ryzalit z wielkim łukiem, kolumny, fryz z herbem, tympanon, posągi, krata
  P(0,5.1,9.6,7.4,10.2,2.6,S.w);P(0,0.55,9.6,7.8,1.1,3.0,S.wd);P(0,10.35,9.6,7.9,0.4,3.0,S.wl);P(0,10.75,9.6,7.4,0.4,2.7,S.wd);
  for(const sx of [-1,1]){for(const x of [sx*2.45,sx*3.45]){P(x,0.9,10.95,0.85,0.7,0.85,S.wd);P(x,4.0,10.95,0.6,5.6,0.6,S.wl);P(x,7.0,10.95,0.85,0.4,0.85,S.wd)}
    P(sx*2.95,8.3,10.92,1.5,1.8,0.12,DK);P(sx*2.95,8.3,10.98,1.0,1.3,0.06,'!#ffcf6a');P(sx*2.95,9.35,10.92,1.7,0.2,0.18,S.wl);
    P(sx*3.0,11.5,10.3,0.9,0.5,0.9,S.wd);P(sx*3.0,12.4,10.3,0.5,1.3,0.45,'#c8b878');P(sx*3.0,13.25,10.3,0.4,0.4,0.4,'#c8b878');P(sx*(3.0+0.35),12.9,10.3,0.1,1.8,0.1,'#c9cfd4');
    P(sx*2.95,4.6,11.0,0.9,1.6,0.08,S.bn);P(sx*2.95,4.9,11.04,0.45,0.5,0.05,S.tr)}
  P(0,3.0,10.9,3.4,6.0,0.14,DK);for(let q=0;q<4;q++)P(0,6.1+q*0.24,10.9,3.4-q*0.8,0.24,0.14,DK);P(0,3.0,9.0,3.4,6.0,1.4,'#2a2018');
  for(let q=0;q<5;q++)P(0,6.15+q*0.26,10.98,3.9-q*0.85+0.4,0.26,0.12,S.wl);P(0,7.6,10.98,0.5,0.5,0.14,S.tr);
  for(let x=-1.4;x<=1.41;x+=0.4)P(x,4.9,10.7,0.1,1.6,0.1,IR);P(0,4.5,10.7,3.2,0.1,0.1,IR);P(0,5.3,10.7,3.2,0.1,0.1,IR);
  P(0,9.7,10.95,6.6,0.9,0.14,S.wd);P(0,9.7,11.0,2.0,0.7,0.1,S.tr);P(0,9.7,11.04,1.5,0.5,0.06,S.bn);for(const sx of [-1,1])for(let q=0;q<4;q++)P(sx*(1.6+q*0.55),9.7,11.0,0.3,0.4,0.06,q%2?S.tr:S.wl);
  for(let q=0;q<4;q++)P(0,11.15+q*0.42,9.6,6.8-q*1.75,0.42,2.4,q%2?S.wl:S.w);P(0,13.0,9.6,0.12,1.4,0.12,S.tr);P(0,13.5,9.6,0.9,0.45,0.05,S.bn);
  P(0,0.1,11.8,4.4,0.2,3.2,S.wl);for(let i=0;i<4;i++)P(0,-0.15-i*0.35,13.2+i*0.55,6.4+i*0.6,0.35,0.6,i%2?S.wd:S.w);
  for(const sx of [-1,1]){P(sx*5.0,0.6,12.2,0.9,1.2,0.9,S.wd);P(sx*5.0,1.3,12.2,1.1,0.25,1.1,IR);P(sx*5.0,1.6,12.2,0.8,0.4,0.8,'!#ff8a2a');P(sx*5.0,1.95,12.2,0.45,0.35,0.45,'!#ffd27a');
    P(sx*6.6,1.4,11.3,0.14,2.8,0.14,WO);P(sx*6.6,2.3,11.38,1.6,1.1,0.08,'#6b4a2b');P(sx*6.6,2.35,11.44,1.3,0.8,0.04,'#e8dcc0');P(sx*6.6,2.6,11.47,0.9,0.12,0.02,S.bn);P(sx*6.6,2.25,11.47,0.7,0.08,0.02,'#3a3a40');
    P(sx*3.9,1.6,11.6,0.8,1.2,0.6,'#c8b878');P(sx*3.9,2.5,11.6,0.5,0.6,0.45,'#c8b878');P(sx*3.9,0.5,11.6,1.1,1.0,0.9,S.wd);P(sx*(3.9+0.4),2.2,11.75,0.1,2.0,0.1,'#c9cfd4')}
  return L}

const ARENA_GEOS=new Map();function arenaExtGeo(race,sty){const k=(race||'ludzie')+'|'+(sty||'');if(!ARENA_GEOS.has(k))ARENA_GEOS.set(k,raceStoneTag(bigTag(boxes(structTex(arenaExtList(race,sty),race.length*17+3,1.2))),race,sty));return ARENA_GEOS.get(k)}
// ===== ARENA w mieście: fale wrogów =====
ENTERABLE.arena='Arena';
/*LANDMARKS*/
function genArena(h,v){const key='ar:'+v.id;if(SPACES.has(key))return SPACES.get(key);const W=26,D=26,cs=2,cx=W/2,cz=D/2;
  const s={id:key,kind:'arena',cs,W,D,x0:Math.round(h.x)-W,z0:Math.round(h.z)-D,fy:900,ceil:12,solid:new Uint8Array(W*D),torches:[],rooms:[],npcs:[],v,built:false};
  for(let j=0;j<D;j++)for(let i=0;i<W;i++){const r=Math.hypot(i+0.5-cx,j+0.5-cz);if(r>11.9||i===0||j===0||i===W-1||j===D-1)s.solid[j*W+i]=1}
  const wx=i=>s.x0+i*cs,wz=j=>s.z0+j*cs;s.cx=wx(cx);s.cz=wz(cz);s.spawn=[s.cx,s.cz+18];s.exit=[s.cx,s.cz+20.5];s.gong=[s.cx+4.5,s.cz+18.5];
  const [dx,dz]=doorOf(h);s.out=[dx,dz];s.outY=h.top;
  for(let k=0;k<10;k++){const a=k/10*Math.PI*2+0.3;s.torches.push([s.cx+Math.cos(a)*20.5,s.fy+2.6,s.cz+Math.sin(a)*20.5])}
  s.braz=[];for(let k=0;k<4;k++){const a=k/4*Math.PI*2+Math.PI/4;const bx=s.cx+Math.cos(a)*15.5,bz=s.cz+Math.sin(a)*15.5;s.braz.push([bx,s.fy+1.3,bz])}
  SPACES.set(key,s);return s}
// widz areny: osadnik rasy królestwa (kolory skóry/włosów/strojów + cechy: uszy, kły, brody, pyski)
function crowdFig(P,r,R,x,y,z,fx,fz){const pk=a=>a[Math.floor(r()*a.length)],hs=(R.hs||1)*(0.92+r()*0.12),sk=pk(R.skin),hr=pk(R.hair),cl=pk(R.cloth),kid=r()<0.12?0.72:1,S=hs*kid,bh=0.8*S,hd=0.42*S;
  const ws=(R.ws||1);P(x,y+bh/2+0.15,z,0.55*ws*kid,bh,0.45*ws*kid,cl);if(r()<0.5)P(x,y+bh*0.62+0.15,z,0.57*ws*kid,0.1*S,0.47*ws*kid,pk(R.cloth));
  const hy=y+bh+0.15+hd/2;P(x,hy,z,hd,hd,hd,sk);const ox=fx*hd*0.5,oz=fz*hd*0.5,sx=-fz,sz=fx;
  if(R.lizard){P(x+ox*1.4,hy-hd*0.12,z+oz*1.4,hd*0.5,hd*0.42,hd*0.5,sk);P(x-ox*0.2,hy+hd*0.58,z-oz*0.2,hd*0.16,hd*0.3,hd*0.9,hr)}
  else{if(r()<0.85)P(x-ox*0.2,hy+hd*0.5,z-oz*0.2,hd*1.06,hd*0.18,hd*1.06,hr);if(R.beard&&(kid===1)&&r()<0.8)P(x+ox*1.02,hy-hd*0.45,z+oz*1.02,hd*0.8,hd*0.7,hd*0.3,hr)}
  if(R.ears)for(const g of [1,-1])P(x+sx*g*hd*0.62,hy+hd*0.18,z+sz*g*hd*0.62,hd*0.16+Math.abs(sx)*hd*0.22,hd*0.22,hd*0.16+Math.abs(sz)*hd*0.22,sk);
  if(R.tusks)for(const g of [1,-1])P(x+ox*1.05+sx*g*hd*0.22,hy-hd*0.28,z+oz*1.05+sz*g*hd*0.22,hd*0.1,hd*0.2,hd*0.1,'#efe8d0');
  if(r()<0.28){const up=r()<0.5;P(x+sx*0.36*ws,y+bh+(up?0.55:0.1),z+sz*0.36*ws,0.14,up?0.6:0.5,0.14,up?sk:cl);if(up&&r()<0.4)P(x+sx*0.36*ws,y+bh+0.98,z+sz*0.36*ws,0.04,0.5,0.32,pk(['#a8352a','#2f5f8f','#d9b23a',cl]))}}
function arenaGeo(s){s.seats=[];const race=(s.v&&s.v.race)||'ludzie',S=kcStyle(race,s.v&&s.v.sty),L=[],P=(...b)=>L.push(b),r=rngOf(s.id+'g'),cx=s.cx-(s.x0+s.W*s.cs/2),cz=s.cz-(s.z0+s.D*s.cs/2),DK='#1a1410',WO='#4a2f1d',WO2='#6b4a2b',IR='#3a3a40',TW=S.tw,SAND='#cbb07a';
  // piasek: plamy, grabione kręgi, godło pośrodku
  ringBoxes(P,cx,cz,0,23,-0.2,0,SAND,1);for(let k=0;k<70;k++){const a=r()*6.283,d=r()*19;P(cx+Math.cos(a)*d,0.02,cz+Math.sin(a)*d,1+r()*2,0.04,1+r()*2,r()<0.5?'#d8c08a':'#bfa26c')}
  for(let k=0;k<5;k++){const R=6+k*3;for(let q=0;q<48;q++){const a=q/48*6.283;if(r()<0.4)P(cx+Math.cos(a)*R,0.03,cz+Math.sin(a)*R,0.9,0.03,0.25,'#c2a46c')}}
  ringBoxes(P,cx,cz,3.4,4.0,0.02,0.06,S.bn,0.5);ringBoxes(P,cx,cz,0,3.4,0.02,0.05,'#d8c08a',0.5);P(cx,0.06,cz,3.4,0.03,0.7,S.tr);P(cx,0.06,cz,0.7,0.03,3.4,S.tr);P(cx,0.07,cz,1.4,0.03,1.4,S.bn);
  for(let k=0;k<7;k++){const a=r()*6.283,d=5+r()*14,x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d;P(x,0.03,z,1.2+r(),0.02,0.9+r(),'#8a4a3a');if(k<3){P(x+0.5,0.08,z,0.9,0.06,0.1,'#c9cfd4');P(x+0.2,0.08,z,0.1,0.06,0.4,WO2)}}
  // mur podium: cokół, płyciny, gzyms, chorągwie, bramy bestii
  const PW=3.6;ringBoxes(P,cx,cz,22.4,24.0,0,PW,z=>S.w,1);ringBoxes(P,cx,cz,22.2,24.0,0,0.7,S.wd,1);ringBoxes(P,cx,cz,22.15,24.2,PW,PW+0.35,S.wl,1);ringBoxes(P,cx,cz,22.3,22.6,PW+0.35,PW+0.95,WO2,1);
  for(let k=0;k<48;k++){const a=(k+0.5)/48*Math.PI*2,c=Math.cos(a),sn=Math.sin(a),ax=Math.abs(c)>Math.abs(sn),x=cx+c*22.2,z=cz+sn*22.2;if(k%12===6)continue;
    P(x,1.9,z,ax?0.2:1.8,1.9,ax?1.8:0.2,S.wd);if(k%3===0){P(cx+c*22.05,2.0,cz+sn*22.05,ax?0.08:1.3,2.6,ax?1.3:0.08,k%6?S.bn:S.rf);P(cx+c*22.0,2.3,cz+sn*22.0,ax?0.06:0.6,0.6,ax?0.6:0.06,S.tr);P(cx+c*22.05,3.4,cz+sn*22.05,ax?0.14:1.5,0.14,ax?1.5:0.14,S.tr)}}
  for(let k=0;k<4;k++){const a=k/4*Math.PI*2+Math.PI/4,x=cx+Math.cos(a)*21.7,z=cz+Math.sin(a)*21.7;P(x,1.7,z,4.0,3.4,4.0,S.wd);P(x-Math.cos(a)*1.6,1.5,z-Math.sin(a)*1.6,2.6,3.0,2.6,DK);for(let q=-1;q<=1;q+=0.5){P(x-Math.cos(a)*2.9+Math.sin(a)*q*1.1,1.5,z-Math.sin(a)*2.9-Math.cos(a)*q*1.1,0.14,3.0,0.14,IR)}P(x-Math.cos(a)*2.4,3.3,z-Math.sin(a)*2.4,3.0,0.5,3.0,S.wl);P(x-Math.cos(a)*2.9,3.9,z-Math.sin(a)*2.9,0.9,0.7,0.9,'#c8b878')}
  // trybuny: osiem rzędów z ławami, widzowie
  const NT=8,TW0=1.75,TH=1.2,seat=[];for(let t=0;t<NT;t++){const r0=24.0+t*TW0,top=PW+0.5+(t+1)*TH-0.5;ringBoxes(P,cx,cz,r0,r0+TW0+(t===NT-1?0.4:0),-0.2,top,t%2?S.w:S.wd,1);ringBoxes(P,cx,cz,r0+0.15,r0+0.85,top,top+0.12,t%2?WO2:'#7a5a3a',1);
    const n=Math.round(r0*1.5);for(let k=0;k<n;k++){const a=k/n*Math.PI*2+t*0.37;if(Math.abs(Math.sin(a)+1)<0.05&&t<4)continue;if(r()<0.5)seat.push([cx+Math.cos(a)*(r0+0.9),top+0.1,cz+Math.sin(a)*(r0+0.9),a,t])}}
  // najpierw najniższe rzędy (najlepiej widoczne z piasku), równomiernie wokół
  {const lo=seat.filter(q=>q[4]<3),hi=seat.filter(q=>q[4]>=3);const pickN=(A,n)=>{const o=[];const st=A.length/Math.max(1,n);for(let i=0;i<n&&i<A.length;i++)o.push(A[Math.floor(i*st)]);return o};s.seats=pickN(lo,70).concat(pickN(hi,26)).map(q=>q.slice(0,4));
    const RC=(typeof RACES!=='undefined'&&RACES[race])||null;if(RC&&typeof crowdFig==='function'){const used=new Set(s.seats.map(q=>q[0].toFixed(1)+q[2].toFixed(1)));for(const q of seat){if(used.has(q[0].toFixed(1)+q[2].toFixed(1))||r()<0.35)continue;crowdFig(P,r,RC,q[0],q[1]-0.1,q[2],-Math.cos(q[3]),-Math.sin(q[3]))}}}
  // schody między sektorami
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2+Math.PI/8;for(let t=0;t<NT;t++){const rr=24.0+t*TW0+0.9,top=PW+(t+1)*TH;P(cx+Math.cos(a)*rr,top+0.08,cz+Math.sin(a)*rr,1.3,0.16,1.3,S.wl);P(cx+Math.cos(a)*(rr+0.85),top+0.6,cz+Math.sin(a)*(rr+0.85),1.3,0.6,0.9,S.wl)}}
  // arkada na koronie: filary, łuki, gzyms, maszty z żaglami velarium
  const RT=24.0+NT*TW0,YT=PW+NT*TH;ringBoxes(P,cx,cz,RT+0.4,RT+2.0,-0.2,YT+0.4,S.w,1);ringBoxes(P,cx,cz,RT+0.3,RT+2.2,YT+5.2,YT+6.0,S.wl,1);ringBoxes(P,cx,cz,RT+0.5,RT+2.0,YT+4.4,YT+5.2,S.w,1);ringBoxes(P,cx,cz,RT+1.3,RT+2.0,YT+0.4,YT+4.4,S.wd,1);
  for(let k=0;k<64;k++){const a=k/64*Math.PI*2,c=Math.cos(a),sn=Math.sin(a),x=cx+c*(RT+0.9),z=cz+sn*(RT+0.9);P(x,YT+2.4,z,1.0,4.0,1.0,S.wl);P(x,YT+0.65,z,1.3,0.5,1.3,S.wd);P(x,YT+4.2,z,1.3,0.4,1.3,S.wd);if(k%2===0)P(cx+c*(RT+1.2),YT+6.5,cz+sn*(RT+1.2),0.9,1.0,0.9,S.wl);
    if(k%4===0){P(cx+c*(RT+1.2),YT+8.2,cz+sn*(RT+1.2),0.2,5.2,0.2,WO);P(cx+c*(RT+1.2)+0.5,YT+10.2,cz+sn*(RT+1.2),0.9,0.6,0.06,(k/4)%2?S.bn:S.tr)}
    if(k%2){const rr=RT-2.2;P(cx+c*rr,YT+5.6+(k%4===1?0.06:0),cz+sn*rr,4.4,0.1,4.4,(k%4===1)?'#efe6d0':S.bn)}}
  // loża królewska z baldachimem nad bramą bestii po stronie północnej
  {const z=cz-25.2,y=PW+0.4;P(cx,y-0.6,z,9,1.4,5.2,S.w);P(cx,y+0.15,z,9.4,0.3,5.6,S.wl);P(cx,y+0.32,z,8.4,0.06,4.6,S.bn);P(cx,y+0.8,z+2.7,9.4,1.0,0.3,S.wl);for(let q=-4;q<=4;q+=1)P(cx+q,y+1.45,z+2.7,0.5,0.3,0.34,S.tr);P(cx,y-0.4,z+2.86,3.0,2.0,0.1,S.bn);P(cx,y-0.3,z+2.92,1.6,1.3,0.06,S.tr);
    for(const sx of [-4.3,4.3])for(const sz of [-2.3,2.3])P(cx+sx,y+3.0,z+sz,0.36,5.6,0.36,S.tr);P(cx,y+5.9,z,9.6,0.3,5.8,S.bn);P(cx,y+6.15,z,10,0.2,6.2,S.tr);if(TW!=='flat'&&TW!=='zig')for(let k=0;k<4;k++)P(cx,y+6.5+k*0.5,z,9.6-k*2.2,0.5,5.6-k*1.3,k%2?S.rf:S.rf2);for(let q=-4.4;q<=4.4;q+=1.1)P(cx+q,y+5.45,z+2.95,0.8,0.7+(Math.round(q/1.1)%2?0.3:0),0.08,Math.round(q/1.1)%2?S.tr:S.bn);
    P(cx,y+1.1,z-0.6,1.5,1.5,1.2,S.tr);P(cx,y+2.6,z-1.1,1.6,2.6,0.3,S.tr);P(cx,y+1.9,z-0.5,1.1,0.1,0.9,S.bn);P(cx,y+4.1,z-1.1,0.7,0.5,0.3,'#e8c84a');for(const sx of [-2.4,2.4]){P(cx+sx,y+0.9,z-0.5,1.1,1.1,1.0,S.tr);P(cx+sx,y+2.0,z-0.95,1.2,1.7,0.25,S.tr)}
    P(cx,y+1.2,z+0.0,0.5,1.5,0.4,'#7a1f6a');P(cx,y+2.2,z+0.0,0.42,0.42,0.42,'#e8c8a8');P(cx,y+2.5,z+0.0,0.46,0.14,0.46,'#e8c84a');
    for(const sx of [-3.6,3.6]){P(cx+sx,y+1.3,z+1.6,0.5,1.9,0.4,'#9aa0a8');P(cx+sx,y+2.5,z+1.6,0.4,0.4,0.4,'#b4bac2');P(cx+sx+0.4,y+1.8,z+1.6,0.08,3.2,0.08,WO2);P(cx+sx+0.4,y+3.5,z+1.6,0.12,0.5,0.3,'#c9cfd4')}}
  // stojaki z bronią, gong, pochodnie, kosze z ogniem, brama wyjściowa
  for(let k=0;k<6;k++){const a=k/6*Math.PI*2+0.5,x=cx+Math.cos(a)*21.2,z=cz+Math.sin(a)*21.2;P(x,0.8,z,1.6,1.6,0.3,'#5a3a22');for(let q=0;q<4;q++)P(x-0.6+q*0.4,1.3,z+0.18,0.06,1.4,0.06,['#c9cfd4','#8a6a44','#c9cfd4','#6b4a2b'][q])}
  {const gx=s.gong[0]-(s.x0+s.W*s.cs/2),gz=s.gong[1]-(s.z0+s.D*s.cs/2);P(gx-1.1,1.4,gz,0.25,2.8,0.25,WO);P(gx+1.1,1.4,gz,0.25,2.8,0.25,WO);P(gx,2.8,gz,2.5,0.25,0.25,WO);P(gx,1.7,gz,1.7,1.7,0.18,'#d9b23a');P(gx,1.7,gz+0.1,1.0,1.0,0.1,'#b8892e');P(gx,1.7,gz+0.16,0.3,0.3,0.06,'#d9b23a')}
  for(const [x,y,z] of s.torches){const ax=x-(s.x0+s.W*s.cs/2),az=z-(s.z0+s.D*s.cs/2);P(ax,1.2,az,0.5,2.4,0.5,S.wd);P(ax,2.5,az,0.9,0.3,0.9,IR);P(ax,0.2,az,0.9,0.4,0.9,S.w)}
  for(const [x,y,z] of (s.braz||[])){const ax=x-(s.x0+s.W*s.cs/2),az=z-(s.z0+s.D*s.cs/2);P(ax,0.35,az,0.9,0.7,0.9,'#4a4650');P(ax,0.8,az,0.35,0.5,0.35,'#3a3640');P(ax,1.15,az,1.3,0.25,1.3,'#2e2a30');P(ax,1.3,az,1.0,0.12,1.0,'#ff8a2a')}
  {const ex=s.exit[0]-(s.x0+s.W*s.cs/2),ez=s.exit[1]-(s.z0+s.D*s.cs/2);P(ex,2.6,ez+1.9,7.0,5.2,2.6,S.w);P(ex,5.4,ez+1.9,7.4,0.5,3.0,S.wl);P(ex,1.9,ez+0.62,3.4,3.8,0.3,'#3a2a1a');P(ex,1.9,ez+0.45,0.1,3.8,0.08,DK);for(const y of [0.9,1.9,2.9])P(ex,y,ez+0.44,3.2,0.14,0.08,IR);P(ex,4.0,ez+0.5,4.2,0.5,0.4,S.wl);P(ex,4.5,ez+0.5,2.6,0.4,0.36,S.tr);P(ex,6.2,ez+0.7,2.0,1.2,0.1,S.bn);P(ex,6.2,ez+0.64,1.2,0.7,0.06,S.tr);
    for(const sx of [-3.2,3.2]){P(ex+sx,0.4,ez,1.2,0.8,1.2,S.wd);P(ex+sx,2.0,ez,0.8,2.4,0.8,S.wl);P(ex+sx,3.5,ez,1.0,0.6,1.0,S.wd);P(ex+sx,4.1,ez,0.6,0.5,0.6,IR);P(ex+sx,4.5,ez,0.45,0.35,0.45,'!#ff9a3a')}}
  // tło: wieże miasta i sylwetka zamku ponad koroną areny, wzgórza na horyzoncie
  {for(let k=0;k<14;k++){const a=k/14*Math.PI*2+r()*0.3,R=50+r()*10,x=cx+Math.cos(a)*R,z=cz+Math.sin(a)*R,h=30+r()*14,w=3+r()*2;P(x,h/2-2,z,w,h,w,r()<0.5?S.w:S.wl);P(x,h-2.3,z,w+0.6,0.6,w+0.6,S.wl);if(TW==='flat'){for(const [dx,dz] of [[-1,-1],[1,-1],[-1,1],[1,1]])P(x+dx*w*0.4,h-1.4,z+dz*w*0.4,0.9,1,0.9,S.wl)}else for(let q=0;q<5;q++)P(x,h-1.6+q*1.4,z,(w+1)*(TW==='dome'?Math.sqrt(1-q*q/25):1-q/5)+0.3,1.4,(w+1)*(TW==='dome'?Math.sqrt(1-q*q/25):1-q/5)+0.3,q%2?S.rf:S.rf2);P(x+w*0.3,h*0.7,z+(z<cz?1:-1)*w*0.51,0.7,1.0,0.06,'!#ffcf6a')}
    {const a=-Math.PI/2+0.35,x=cx+Math.cos(a)*72,z=cz+Math.sin(a)*72;P(x,14,z,30,32,12,S.w);P(x,30.5,z,31,1,13,S.wl);for(const sx of [-14,14,-5,5]){P(x+sx,22,z,5,48,5,S.w);if(TW==='flat')P(x+sx,46.6,z,5.8,1.2,5.8,S.wl);else for(let q=0;q<6;q++)P(x+sx,46.6+q*1.8,z,5.8*(1-q/6)+0.3,1.8,5.8*(1-q/6)+0.3,q%2?S.rf:S.rf2)}P(x,40,z+6.1,3,2,0.1,S.bn);for(const sx of [-9.5,0,9.5])P(x+sx,24,z+6.05,1.2,3,0.1,'!#ffcf6a')}
    for(let k=0;k<36;k++){const a=k/36*Math.PI*2,R=120,x=cx+Math.cos(a)*R,z=cz+Math.sin(a)*R,h=30+Math.abs(Math.sin(k*1.7))*16;P(x,h/2-6,z,24,h,24,k%2?'#4a6a3a':'#56763e')}}
  return L}

const AR={s:null,on:false,wave:0,ids:[],t:0,best:LS.get('arenaBest',0)};
const AR_POOL=[['goblin','szkielet','bandyta','wilk','slime','dzik'],['ork','lucznik_s','upior','pajak','kultysta','wilkolak'],['troll','mroczny_rycerz','golem','lodowy_golem','mumia','zywiolak','bazyliszek','wiwerna']],AR_BOSS=['krol_troll','krol_s','lich','faraon','prastary'];
// ===== widownia areny: prawdziwe modele osadników rasy miasta (jak NPC w mieście), wypiekane do 2 siatek na osobę: ciało + ramiona =====
function mergeMeshes(list,inv,off){const parts=[];let n=0;const M=new THREE.Matrix4(),v=new THREE.Vector3();
  for(const me of list){const gg=me.geometry;if(!gg||!gg.attributes||!gg.attributes.position||!gg.attributes.color)continue;M.multiplyMatrices(inv,me.matrixWorld);parts.push([gg,M.clone()]);n+=gg.index?gg.index.count:gg.attributes.position.count}
  const P=new Float32Array(n*3),N=new Float32Array(n*3),Cc=new Float32Array(n*3);let o=0;
  for(const [gg,Mx] of parts){const pa=gg.attributes.position.array,na=gg.attributes.normal?gg.attributes.normal.array:null,ca=gg.attributes.color.array,ix=gg.index?gg.index.array:null,cnt=ix?ix.length:pa.length/3;
    for(let i=0;i<cnt;i++){const j=ix?ix[i]:i;v.set(pa[j*3],pa[j*3+1],pa[j*3+2]).applyMatrix4(Mx);if(off)v.sub(off);P[o*3]=v.x;P[o*3+1]=v.y;P[o*3+2]=v.z;if(na){v.set(na[j*3],na[j*3+1],na[j*3+2]).transformDirection(Mx);N[o*3]=v.x;N[o*3+1]=v.y;N[o*3+2]=v.z}Cc[o*3]=ca[j*3];Cc[o*3+1]=ca[j*3+1];Cc[o*3+2]=ca[j*3+2];o++}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(P,3));g.setAttribute('normal',new THREE.BufferAttribute(N,3));g.setAttribute('color',new THREE.BufferAttribute(Cc,3));g.computeBoundingSphere&&g.computeBoundingSphere();return g}
function arenaFans(s,g){const v=s.v||{},race=v.race||'ludzie',R=RACES[race]||RACES.ludzie,r=rngOf(s.id+'fans'),cx=s.x0+s.W*s.cs/2,cz=s.z0+s.D*s.cs/2;s.fans=[];
  const seats=s.seats.slice(0,96);for(let i=0;i<seats.length;i++){const [x,y,z,a]=seats[i],fem=r()<0.45,n={id:s.id+'f'+i,race,fem,role:r()<0.1?'dziecko':'mieszk',roleN:'Widz',skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth),vid:null};
    const o=makeNpc(n),u=o.userData.g.userData;u.la.rotation.set(-2.75,0,-0.28);u.ra.rotation.set(-2.75,0,0.28);if(u.le)u.le.rotation.x=-0.35;if(u.re)u.re.rotation.x=-0.35;if(n.role==='dziecko')o.scale.setScalar(0.75);
    o.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(o.matrixWorld).invert(),arms=[],body=[];const armSet=new Set();for(const k of ['la','ra'])if(u[k])u[k].traverse(q=>armSet.add(q));
    o.traverse(q=>{if(!q.isMesh)return;(armSet.has(q)?arms:body).push(q)});const pv=new THREE.Vector3(),t2=new THREE.Vector3();u.la.getWorldPosition(pv);u.ra.getWorldPosition(t2);pv.add(t2).multiplyScalar(0.5).applyMatrix4(inv);
    const fg=new THREE.Group();fg.position.set(cx+x,s.fy+y+0.12,cz+z);fg.rotation.y=Math.atan2(-Math.cos(a),-Math.sin(a));const bm=new THREE.Mesh(mergeMeshes(body,inv),decoMat),am=new THREE.Mesh(mergeMeshes(arms,inv,pv),decoMat);am.position.copy(pv);fg.add(bm,am);g.add(fg);
    s.fans.push({g:fg,a:am,y:fg.position.y,ph:r()*6.283,sp:4+r()*3,k:r()});try{o.traverse(q=>{if(q.isMesh&&q.geometry&&!q.geometry.userData.vb)q.geometry.dispose()})}catch(_){}}}
function fansTick(s,dt){if(!s.fans)return;const t=performance.now()/1000;let alive=0;if(AR.on)for(const id of AR.ids){const e=enemies.get(id);if(e&&e.st!==2)alive++}
  if(s._alive!=null&&alive<s._alive){s.hype=1;if(Math.random()<0.8)sfx('cheer',0.8)}s._alive=alive;s.hype=Math.max(0,(s.hype||0)-dt*0.35);
  const base=AR.on?0.55:0.18,I=Math.min(1,base+s.hype);s._mt=(s._mt||0)-dt;if(s._mt<=0){s._mt=1.6+Math.random();sfx('crowd',0.5+I*0.8);if(I>0.6&&Math.random()<0.5)sfx('cheer',0.35+I*0.4)}
  for(const f of s.fans){const act=I>f.k*0.85;const w=Math.sin(t*f.sp+f.ph);f.g.position.y=f.y+(act?Math.max(0,w)*0.22*I:0);f.a.rotation.x=act?(0.35+0.35*w)*(1-I*0.5):2.45+0.08*w;f.a.rotation.z=act?Math.sin(t*f.sp*0.5+f.ph)*0.25:0;f.g.rotation.z=act?Math.sin(t*f.sp*0.5+f.ph)*0.04:0}}
function arenaStart(s){if(AR.on)return toast('Walka już trwa!','#ff8a7a');if(!isAuth()){sendFx({k:'arstart',sid:s.id,vid:s.v&&s.v.id});toast('Gong! Walka się zaczyna…','#ffd27a');return}
  AR.s=s;AR.on=true;AR.wave=0;AR.t=3;AR.ids=[];AR.rew=0;sfx('thunder',0.4);sendFx({k:'armsg',txt:'Gong! Walka na arenie się zaczyna!'});toast('Gong! Walka na arenie się zaczyna!','#ffd27a')}
function arenaSpawn(s,w){const boss=w%5===0,n=Math.min(10,2+Math.floor(w*0.8)),lvl=Math.max(1,HERO.lvl-1)+Math.floor(w/2),tier=w<4?0:w<8?1:2,pool=AR_POOL[tier].filter(t=>EDEF[t]).concat(tier?AR_POOL[tier-1].filter(t=>EDEF[t]):[]);
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+Math.random(),d=9+Math.random()*7,x=s.cx+Math.cos(a)*d,z=s.cz-2+Math.sin(a)*d;const e=makeE(pick(pool),lvl,w>=4&&Math.random()<0.15,x,s.fy+0.05,z,{sid:'ar:'+s.id,home:[s.cx,s.cz],prov:60,evt:1});AR.ids.push(e.id)}
  if(boss){const t=AR_BOSS[(w/5-1)%AR_BOSS.length];if(EDEF[t]){const e=makeE(t,lvl,true,s.cx,s.fy+0.05,s.cz-8,{sid:'ar:'+s.id,home:[s.cx,s.cz],prov:60,evt:1});AR.ids.push(e.id)}}
  const txt=boss?`Fala ${w} — BOSS!`:`Fala ${w}`;toast(txt,'#ffd34d');sfx('roar',0.6);sendFx({k:'armsg',txt});AR.cur=w}
function arenaGive(w){const tour=Date.now()<TOURN.until,g=25*w*(tour?2:1);if(tour&&w%3===0)try{const it=genItem(HERO.lvl+1,w>=6?20:10);if(INV.bag.length<bagN()){INV.bag.push(it);toast('Nagroda turniejowa: '+it.name,RAR[it.rar].c)}}catch(_){}if(tour&&w===5){INV.gold+=300;toast('🏆 Zwycięzca turnieju! +300 zł i sława w mieście','#ffd34d');try{const v=villages.get(TOURN.vid);if(v&&W.rep)W.rep[v.race]=(W.rep[v.race]||0)+15}catch(_){}}INV.gold+=g;try{gainXp(40*w)}catch(e){}let it=null;if(w%5===0)try{it=genItem(HERO.lvl+2,1);if(INV.bag.length<bagN())INV.bag.push(it);else it=null}catch(e){}
  saveInv();updHud();sfx('coin');toast(`Fala ${w} pokonana! +${g} zł`+(it?' · nagroda: '+it.name:''),'#7dd87d');if(w>AR.best){AR.best=w;LS.set('arenaBest',w);toast('Nowy rekord areny: '+w+' fal!','#ffd34d')}}
function arenaEnd(){if(!AR.on)return;AR.on=false;for(const id of AR.ids)if(enemies.has(id))removeEnemy(id);const w=Math.max(0,AR.wave-1);AR.ids=[];const txt='Koniec walki na arenie — fale: '+w+' (rekord: '+Math.max(AR.best,w)+')';toast(txt,'#d2c29e');sendFx({k:'armsg',txt})}
function arenaTick(dt){if(!AR.on||!isAuth())return;const s=AR.s,inA=p=>!p.dead&&p.p.y>s.fy-8&&p.p.y<s.fy+30&&p.p.x>=s.x0&&p.p.x<s.x0+s.W*s.cs&&p.p.z>=s.z0&&p.p.z<s.z0+s.D*s.cs;
  if(!playersList().some(inA)){AR.lost=(AR.lost||0)+dt;if(AR.lost>4)arenaEnd();return}AR.lost=0;
  const alive=AR.ids.some(id=>{const e=enemies.get(id);return e&&e.st!==2});
  if(!alive){if(AR.wave>0&&!AR.rew){AR.rew=1;if(SPC&&SPC.kind==='arena')arenaGive(AR.wave);sendFx({k:'arrew',w:AR.wave});AR.t=6}AR.t-=dt;if(AR.t<=0){AR.rew=0;AR.wave++;AR.ids=AR.ids.filter(id=>enemies.has(id));arenaSpawn(s,AR.wave)}}}
function arenaHud(){const el=document.getElementById('arenabar');if(!el)return;const s=SPC;if(!s||s.kind!=='arena'){el.hidden=true;return}el.hidden=false;let n=0;for(const e of enemies.values())if(e.st!==2&&!e.pas&&e.p.y>s.fy-8&&e.p.y<s.fy+30&&Math.hypot(e.p.x-s.cx,e.p.z-s.cz)<26)n++;
  el.innerHTML=(AR.on||n?`<b>ARENA</b> · Fala ${AR.cur||AR.wave||1} · wrogów: ${n}`:'<b>ARENA</b> · uderz w gong (<kbd>F</kbd>), aby rozpocząć')+` · rekord: ${AR.best}`}

function genDungeon(st,lvl){lvl=lvl||1;const key='dg:'+st.id+(lvl>1?':'+lvl:'');if(SPACES.has(key))return SPACES.get(key);const cave=st.type==='jaskinia',r=rngOf(key),W=cave?40:34,D=cave?40:34,cs=2;
  const s={id:key,lvl,maxL:cave?2:st.isl?4:3,kind:cave?'cave':'dungeon',cs,W,D,x0:Math.round(st.x)-W,z0:Math.round(st.z)-D,fy:cave?600-(lvl-1)*30:640+(lvl-1)*30,ceil:cave?6:4.8,solid:new Uint8Array(W*D).fill(1),st,torches:[],rooms:[],npcs:[],built:false};
  const carve=(i,j)=>{if(i>0&&j>0&&i<W-1&&j<D-1)s.solid[j*W+i]=0};
  if(!cave){const rooms=[];for(let t=0;t<200&&rooms.length<9;t++){const w=3+Math.floor(r()*4),d=3+Math.floor(r()*4),i=1+Math.floor(r()*(W-w-2)),j=1+Math.floor(r()*(D-d-2));if(rooms.some(q=>i<q.i+q.w+1&&i+w+1>q.i&&j<q.j+q.d+1&&j+d+1>q.j))continue;rooms.push({i,j,w,d,cx:i+(w>>1),cz:j+(d>>1)})}
    rooms.sort((a,b)=>Math.hypot(a.cx-W/2,a.cz-D-4)-Math.hypot(b.cx-W/2,b.cz-D-4));
    for(const q of rooms)for(let j=q.j;j<q.j+q.d;j++)for(let i=q.i;i<q.i+q.w;i++)carve(i,j);
    for(let k=1;k<rooms.length;k++){const a=rooms[k-1],b=rooms[k];let i=a.cx,j=a.cz;while(i!==b.cx){carve(i,j);i+=Math.sign(b.cx-i)}while(j!==b.cz){carve(i,j);j+=Math.sign(b.cz-j)}carve(i,j)}
    s.rooms=rooms}
  else{for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++)s.solid[j*W+i]=r()<0.44?1:0;
    for(let it=0;it<5;it++){const n=new Uint8Array(s.solid);for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){let c=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++)if(a||b)c+=s.solid[(j+b)*W+i+a];n[j*W+i]=c>=5?1:c<=3?0:s.solid[j*W+i]}s.solid=n}
    // tylko obszar połączony z wejściem
    const st0=[W>>1,D-3];for(let j=D-6;j<D-1;j++)for(let i=(W>>1)-2;i<=(W>>1)+2;i++)carve(i,j);const seen=new Uint8Array(W*D),q=[st0];seen[st0[1]*W+st0[0]]=1;
    while(q.length){const [i,j]=q.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=i+a,y=j+b;if(x<1||y<1||x>=W-1||y>=D-1)continue;const k=y*W+x;if(!seen[k]&&!s.solid[k]){seen[k]=1;q.push([x,y])}}}
    for(let k=0;k<W*D;k++)if(!seen[k])s.solid[k]=1;
    const free=[];for(let j=2;j<D-2;j+=4)for(let i=2;i<W-2;i+=4)if(!s.solid[j*W+i])free.push({cx:i,cz:j,i:i-1,j:j-1,w:3,d:3});
    free.sort((a,b)=>Math.hypot(a.cx-st0[0],a.cz-st0[1])-Math.hypot(b.cx-st0[0],b.cz-st0[1]));
    s.pool=new Set();for(const q of free.slice(-6).filter((_,k)=>k%3===1)){const stk=[[q.cx,q.cz]];let n=0;while(stk.length&&n<18){const [i,j]=stk.shift(),k=j*W+i;if(s.solid[k]||s.pool.has(k))continue;s.pool.add(k);n++;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(r()<0.8)stk.push([i+a,j+b])}}
    s.crys=[];for(let j=2;j<D-2;j++)for(let i=2;i<W-2;i++){const k=j*W+i;if(s.solid[k]||s.pool.has(k))continue;let wall=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])wall+=s.solid[(j+b)*W+i+a];if(wall&&r()<0.07)s.crys.push([i,j,Math.floor(r()*3),r()])}s.rooms=free.filter((_,k)=>k%2===0).slice(0,10);if(!s.rooms.length)s.rooms=[{cx:st0[0],cz:st0[1]-2,i:st0[0]-1,j:st0[1]-3,w:3,d:3}]}
  const R0=s.rooms[0],RL=s.rooms[s.rooms.length-1],cw=i=>s.x0+(i+0.5)*cs,cz=j=>s.z0+(j+0.5)*cs;
  s.spawn=cave?[cw(W>>1),cz(D-3)]:[cw(R0.cx),cz(R0.cz)];s.exit=s.spawn.slice();s.out=[st.x,st.z+(cave?6.5:4.6)];s.outY=null;s.outRy=0;s.chest=[cw(RL.cx),cz(RL.cz)];
  for(const q of s.rooms)if(q!==R0){if(cave){s.torches.push([cw(q.cx),s.fy+2.4,cz(q.cz)]);continue}
    /* lochy: pochodnie w uchwytach na ścianach komnaty, nie na słupku na środku */let n=0;for(const [a,b,i,j] of [[-1,0,q.i,q.cz],[1,0,q.i+q.w-1,q.cz],[0,-1,q.cx,q.j],[0,1,q.cx,q.j+q.d-1]]){if(n>=(q.w*q.d>=20?2:1))break;if(!s.solid[(j+b)*W+(i+a)])continue;s.torches.push([cw(i)+a*(cs/2-0.25),s.fy+2.4,cz(j)+b*(cs/2-0.25),a,b]);n++}
    if(!n)s.torches.push([cw(q.cx),s.fy+2.4,cz(q.cz)])}
  if(!cave)dgPuzzle(s,r);if(lvl<s.maxL){s.down=s.chest;s.chest=null}
  if(cave){s.mush=[];for(let j=2;j<D-2;j++)for(let i=2;i<W-2;i++){const k=j*W+i;if(s.solid[k]||s.pool.has(k))continue;let wall=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])wall+=s.solid[(j+b)*W+i+a];const q=r();if(wall&&q<0.16)s.mush.push([i,j,Math.floor(r()*3),r(),1]);else if(!wall&&q<0.012)s.mush.push([i,j,Math.floor(r()*3),r(),0])}}
  SPACES.set(key,s);return s}
// ===== lochy wielopoziomowe: dźwignie, krata, kolce =====
function dgPuzzle(s,r){const W=s.W,D=s.D,R=s.rooms;if(s.kind!=='dungeon'||R.length<4)return;const cs=s.cs,cw=i=>s.x0+(i+0.5)*cs,cz=j=>s.z0+(j+0.5)*cs,inRoom=(i,j)=>R.some(q=>i>=q.i&&i<q.i+q.w&&j>=q.j&&j<q.j+q.d);
  const RL=R[R.length-1];s.gate=[];for(let j=RL.j-1;j<=RL.j+RL.d;j++)for(let i=RL.i-1;i<=RL.i+RL.w;i++){const ring=i===RL.i-1||i===RL.i+RL.w||j===RL.j-1||j===RL.j+RL.d,corner=(i===RL.i-1||i===RL.i+RL.w)&&(j===RL.j-1||j===RL.j+RL.d);if(!ring||corner||i<1||j<1||i>=W-1||j>=D-1)continue;if(!s.solid[j*W+i]&&!inRoom(i,j))s.gate.push([i,j])}
  if(!s.gate.length){s.gate=null;return}for(const [i,j] of s.gate)s.solid[j*W+i]=1;
  const P=R[R.length-2],Q=R.length>=5?R[R.length-3]:P,far=Math.hypot(P.cx-Q.cx,P.cz-Q.cz)>14;
  s.levers=[[cw(P.i),cz(P.cz)],far||Q===P?[cw(P.i+P.w-1),cz(P.cz)]:[cw(Q.i+Q.w-1),cz(Q.cz)]];if(!far&&Q!==P)s.levers[1]=[cw(Q.i+Q.w-1),cz(Q.cz)];
  s.levT=[0,0];s.gateOpen=false;
  const cand=[];for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){if(s.solid[j*W+i]||inRoom(i,j))continue;if(Math.hypot(i-R[0].cx,j-R[0].cz)<5)continue;cand.push([i,j])}
  s.spikes=[];for(let k=0;k<6&&cand.length;k++){const t=cand.splice(Math.floor(r()*cand.length),1)[0];s.spikes.push([cw(t[0]),cz(t[1]),r()*2.4])}}
function dgBuildExtras(s,g){if(s.kind!=='dungeon')return;const ox=s.x0+s.W*s.cs/2,oz=s.z0+s.D*s.cs/2;
  if(s.gate){const L=[];for(const [i,j] of s.gate){const x=s.x0+(i+0.5)*s.cs-ox,z=s.z0+(j+0.5)*s.cs-oz;for(let k=-2;k<=2;k++){L.push([x+k*0.4,1.6,z,0.12,3.2,0.12,'#3a3a40'],[x,1.6,z+k*0.4,0.12,3.2,0.12,'#3a3a40'])}L.push([x,0.4,z,1.96,0.15,1.96,'#4a4a52'],[x,2.6,z,1.96,0.15,1.96,'#4a4a52'])}/* węższe od otworu: boki listew nie leżą w płaszczyźnie ościeży */
    const m=new THREE.Mesh(boxes(L),decoMat);m.position.set(ox,s.fy,oz);g.add(m);s.gateM=m;if(s.gateOpen)m.position.y=s.fy+3.4}
  if(s.levers){s.levM=[];for(const [x,z] of s.levers){const grp=new THREE.Group();grp.position.set(x,s.fy,z);grp.add(new THREE.Mesh(boxes([[0,0.35,0,0.8,0.7,0.6,'#5d5a63'],[0,0.75,0,0.6,0.1,0.4,'#3a3a40']]),decoMat));const h=new THREE.Group();h.position.y=0.75;h.add(new THREE.Mesh(boxes([[0,0.45,0,0.12,0.9,0.12,'#6b4a2b'],[0,0.95,0,0.24,0.24,0.24,'#c8302a']]),decoMat));h.rotation.x=0.6;grp.add(h);const gl=new THREE.Mesh(boxes([[0,0.95,0,0.3,0.3,0.3,'#ffd34d']]),GLOWMAT);gl.visible=false;h.add(gl);g.add(grp);s.levM.push({h,gl})}}
  if(s.spikes){s.spM=[];for(const [x,z] of s.spikes){const base=new THREE.Mesh(boxes([[0,0.03,0,1.8,0.06,1.8,'#3a3a40']]),decoMat);base.position.set(x,s.fy,z);g.add(base);const L=[];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)L.push([a*0.55,0.35,b*0.55,0.14,0.7,0.14,'#c8ccd2'],[a*0.55,0.75,b*0.55,0.07,0.15,0.07,'#e8eef2']);const sp=new THREE.Mesh(boxes(L),decoMat);sp.position.set(x,s.fy-0.8,z);g.add(sp);s.spM.push(sp)}}}
function pullLever(s,k,remote){if(!s||!s.levers||s.gateOpen)return;s.levT[k]=performance.now();if(!remote){sendFx({k:'lever',sid:s.id,i:k});sfx('door',0.6)}if(s.levM&&s.levM[k]){s.levM[k].h.rotation.x=-0.6;s.levM[k].gl.visible=true}
  const o=s.levT[1-k];if(o&&performance.now()-o<8000){openGate(s,remote)}else if(!remote)toast('Dźwignia przestawiona! Druga dźwignia musi zostać pociągnięta w ciągu 8 sekund.','#ffd27a')}
function openGate(s,remote){if(s.gateOpen)return;s.gateOpen=true;for(const [i,j] of (s.gate||[]))s.solid[j*s.W+i]=0;sfx('thunder',0.25);toast('Krata się podnosi!','#7dd87d');if(!remote)sendFx({k:'gate',sid:s.id})}
function dgTick(s,dt){if(!s||s.kind!=='dungeon')return;const now=performance.now(),p=player.p;
  if(s.levers&&!s.gateOpen)s.levers.forEach((_,k)=>{if(s.levT[k]&&now-s.levT[k]>8000){s.levT[k]=0;if(s.levM&&s.levM[k]){s.levM[k].h.rotation.x=0.6;s.levM[k].gl.visible=false}}});
  if(s.gateM&&s.gateOpen&&s.gateM.position.y<s.fy+3.4)s.gateM.position.y=Math.min(s.fy+3.4,s.gateM.position.y+dt*1.5);
  if(s.spikes){const t=now/1000;s.spikes.forEach((q,k)=>{const ph=(t+q[2])%2.4,up=ph>1.4&&ph<2.2,m=s.spM&&s.spM[k];if(m){const ty=s.fy+(up?0:-0.8);m.position.y+=(ty-m.position.y)*Math.min(1,dt*(up?30:6))}
    if(up&&Math.abs(p.x-q[0])<1&&Math.abs(p.z-q[1])<1&&p.y<s.fy+0.6&&!P2.dead){P2.spkT=(P2.spkT||0)-dt;if(P2.spkT<=0){P2.spkT=0.8;try{takeDamage((18+4*(s.lvl||1))*(1-0.15*pk('ogien')),'kolce')}catch(e){}sfx('claw',0.7)}}})}}
function goDown(s){const nx=genDungeon(s.st,(s.lvl||1)+1);nx.up=s;enterSpace(nx);toast('Poziom '+nx.lvl+' lochu','#ffd27a')}
function goUp(){const s=SPC;if(!s||!s.up)return leaveSpace();const P=s.up;buildSpace(P);player.p.set(P.down[0]+1.6,P.fy+0.05,P.down[1]);player.v.set(0,0,0);camY=null;SPC=P;sfx('door');if(PET)PET.p.copy(player.p);for(const f of FOL)f.p.copy(player.p);setTimeout(()=>{if(SPC!==s)unbuildSpace(s)},1500)}

// ===== wystrój lochów: mur z ciosów, belki, posadzka z płyt, komnaty o różnym przeznaczeniu, świece i kolizje mebli =====
function dgDress(s,P,r,lx,lz){const W=s.W,D=s.D,cs=s.cs,C=s.ceil,sol=(i,j)=>i<0||j<0||i>=W||j>=D||!!s.solid[j*W+i],OX=s.x0+W*cs/2,OZ=s.z0+D*cs/2;
  const BR=['#77727b','#6b6670','#837e88','#615d67','#7c756b','#6f6a64'],MOR='#3e3b42',MOSS=['#4f6a32','#5f7a3a','#3f5a2a'],WD='#5a3c24',WD2='#4a301c',IRON='#3a3a40',GOLD='#d9b23a';
  const reserve=new Set(),key=(i,j)=>j*W+i,cell=(x,z)=>[Math.floor((x-s.x0)/cs),Math.floor((z-s.z0)/cs)];
  for(const q of s.rooms)reserve.add(key(q.cx,q.cz));for(const L of (s.levers||[])){const [i,j]=cell(L[0],L[1]);reserve.add(key(i,j))}for(const q of [s.down,s.exit,s.spawn,s.chest])if(q){const [i,j]=cell(q[0],q[1]);for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++)reserve.add(key(i+a,j+b))}
  const col=(x,z,hw,hd,top)=>s.pc.push([x+OX-hw,z+OZ-hd,x+OX+hw,z+OZ+hd,top]);
  const candle=(x,y,z,lit)=>{P(x,y+0.11,z,0.08,0.22,0.08,'#efe6cc');P(x,y+0.02,z,0.13,0.04,0.13,'#d8cfb4');P(x,y+0.27,z,0.05,0.09,0.05,'!#ffd27a');if(lit)s.lights.push([x+OX,s.fy+y+0.5,z+OZ,5.5,0.55,[1,0.72,0.42]])};
  // 1) mur z ciosów: na każdej ścianie widocznej z korytarza lub komnaty
  for(let j=0;j<D;j++)for(let i=0;i<W;i++){if(!sol(i,j))continue;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){if(sol(i+a,j+b))continue;const fx=lx(i)+a*cs/2,fz=lz(j)+b*cs/2,X=a!==0;
      for(let k=0;k<8;k++){const y0=k*0.6,segs=(k+i+j)%2?[0.5,1,0.5]:[1,1];let u=-cs/2;for(const w of segs){const uc=u+w/2;u+=w;const miss=r()<0.018,d=miss?0.01:0.05+r()*0.04,c=miss?'#45424a':BR[Math.floor(r()*BR.length)];
          if(X)P(fx+a*d/2,y0+0.3,lz(j)+uc,d,0.54,w-0.06,c);else P(lx(i)+uc,y0+0.3,fz+b*d/2,w-0.06,0.54,d,c)}}
      // listwa cokołu i mech u podstawy
      if(X)P(fx+a*0.11,0.12,lz(j),0.22,0.24,cs,MOR);else P(lx(i),0.12,fz+b*0.11,cs,0.24,0.22,MOR);
      if(r()<0.32){const m=MOSS[Math.floor(r()*3)],w=0.6+r()*1.1,o=(r()-0.5)*0.8;if(X)P(fx+a*0.15,0.3+r()*0.2,lz(j)+o,0.05,0.25+r()*0.35,w,m);else P(lx(i)+o,0.3+r()*0.2,fz+b*0.15,w,0.25+r()*0.35,0.05,m)}
      const t=r(),nx=fx+a*0.12,nz=fz+b*0.12;
      if(t<0.035){/* łańcuchy z okowami */for(const o of [-0.35,0.35]){const cx=X?nx:lx(i)+o,cz=X?lz(j)+o:nz;for(let y=C-0.2;y>1.3;y-=0.22)P(cx,y,cz,X?0.05:0.09,0.16,X?0.09:0.05,IRON);P(cx,1.2,cz,X?0.08:0.2,0.12,X?0.2:0.08,'#4a4a52')}}
      else if(t<0.06){/* żelazne kółko */const cx=X?nx:lx(i),cz=X?lz(j):nz;P(cx,1.7,cz,X?0.06:0.3,0.3,X?0.3:0.06,IRON);P(cx,1.62,cz,X?0.07:0.18,0.12,X?0.18:0.07,'#2a2a30')}
      else if(t<0.085){/* podarty sztandar */const cx=X?nx:lx(i),cz=X?lz(j):nz,c=r()<0.5?'#6a1f1f':'#2a3a5a';P(cx,C-0.35,cz,X?0.08:1.1,0.08,X?1.1:0.08,WD2);P(cx,C-1.25,cz,X?0.04:0.9,1.7,X?0.9:0.04,c);P(cx,C-0.5,cz,X?0.045:0.92,0.08,X?0.92:0.045,GOLD);P(cx+(X?0:0.25),C-2.2,cz+(X?0.25:0),X?0.04:0.35,0.3,X?0.35:0.04,c)}
      else if(t<0.15){/* pajęczyna pod sklepieniem */const cx=X?fx+a*0.3:lx(i)+(r()-0.5)*1.2,cz=X?lz(j)+(r()-0.5)*1.2:fz+b*0.3;P(cx,C-0.22,cz,X?0.03:0.8,0.36,X?0.8:0.03,'#b4b4ac');P(cx,C-0.12,cz,X?0.5:0.6,0.03,X?0.6:0.5,'#b4b4ac')}
      else if(t<0.2){/* pęknięcie */const cx=X?fx+a*0.1:lx(i)+(r()-0.5)*1.2,cz=X?lz(j)+(r()-0.5)*1.2:fz+b*0.1,y=1+r()*2.6;P(cx,y,cz,X?0.03:0.05,0.9,X?0.05:0.03,'#1e1c22');P(cx+(X?0:0.12),y-0.5,cz+(X?0.12:0),X?0.03:0.05,0.4,X?0.05:0.03,'#1e1c22')}}}
  // 2) posadzka z płyt, kałuże, gruz, kości
  for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){if(sol(i,j))continue;const x=lx(i),z=lz(j);
    for(const [a,b] of [[-0.5,-0.5],[0.5,-0.5],[-0.5,0.5],[0.5,0.5]]){const v=r(),c=v<0.25?'#5f5b64':v<0.5?'#686470':v<0.75?'#615e68':'#57545c';P(x+a,0.015+r()*0.025,z+b,0.94,0.04,0.94,c)}
    const t=r();let wall=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])wall+=sol(i+a,j+b);
    if(t<0.022)P(x+(r()-0.5)*0.6,0.055,z+(r()-0.5)*0.6,0.9+r()*0.5,0.012,0.6+r()*0.4,'#26303a');
    else if(t<0.06&&wall){for(let k=0;k<4;k++)P(x+(r()-0.5)*1.4,0.08+r()*0.08,z+(r()-0.5)*1.4,0.15+r()*0.25,0.12+r()*0.15,0.15+r()*0.25,BR[Math.floor(r()*BR.length)])}
    else if(t<0.085){P(x+0.2,0.08,z-0.1,0.55,0.08,0.1,'#e8e2cc');P(x-0.15,0.08,z+0.2,0.1,0.08,0.45,'#e0dac4');if(r()<0.4){P(x-0.3,0.14,z-0.3,0.22,0.2,0.24,'#ece6d0');P(x-0.3,0.13,z-0.19,0.14,0.06,0.03,'#2a2420')}}
    else if(t<0.1)P(x+(r()-0.5),0.07,z+(r()-0.5),0.04,0.04,0.7,'#2a2830')}
  // 3) komnaty: belki stropowe, filary, wystrój wg przeznaczenia
  const ROLES=['cela','magazyn','krypta','kaplica','biblioteka','zbrojownia','magazyn','cela'];const R=s.rooms,RL=R[R.length-1];
  R.forEach((q,k)=>{const x0=lx(q.i)-cs/2,x1=lx(q.i+q.w-1)+cs/2,z0=lz(q.j)-cs/2,z1=lz(q.j+q.d-1)+cs/2,mx=(x0+x1)/2,mz=(z0+z1)/2;
    for(let z=z0+cs;z<z1-0.5;z+=cs*1.5){P(mx,C-0.2,z,x1-x0,0.34,0.38,WD);P(mx,C-0.39,z,x1-x0-0.2,0.04,0.3,WD2)}
    if(q.w>=5&&q.d>=5)for(const [a,b] of [[q.i+1,q.j+1],[q.i+q.w-2,q.j+1],[q.i+1,q.j+q.d-2],[q.i+q.w-2,q.j+q.d-2]]){if(reserve.has(key(a,b)))continue;const x=lx(a),z=lz(b);P(x,C/2,z,0.75,C,0.75,BR[2]);P(x,0.2,z,1.05,0.4,1.05,BR[3]);P(x,C-0.25,z,1.05,0.5,1.05,BR[3]);for(let y=0.7;y<C-0.6;y+=0.9)P(x,y,z,0.8,0.08,0.8,MOR);col(x,z,0.52,0.52,C);reserve.add(key(a,b))}
    // komórki przy ścianach (bez przejść)
    const spots=[];for(let j=q.j;j<q.j+q.d;j++)for(let i=q.i;i<q.i+q.w;i++){if(reserve.has(key(i,j)))continue;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const oi=i+a,oj=j+b,inR=oi>=q.i&&oi<q.i+q.w&&oj>=q.j&&oj<q.j+q.d;if(inR||!sol(oi,oj))continue;let door=false;for(const [c,d] of [[b,a],[-b,-a]]){const si=i+c,sj=j+d;if(!(si>=q.i&&si<q.i+q.w&&sj>=q.j&&sj<q.j+q.d)&&!sol(si,sj))door=true}if(!door)spots.push([i,j,a,b])}}
    for(let n=spots.length-1;n>0;n--){const m=Math.floor(r()*(n+1));[spots[n],spots[m]]=[spots[m],spots[n]]}
    const used=new Set(),take=()=>{for(const sp of spots){const kk=key(sp[0],sp[1])+'_'+sp[2]+'_'+sp[3];if(used.has(kk)||used.has(key(sp[0],sp[1])))continue;used.add(key(sp[0],sp[1]));return sp}return null};
    const at=(sp,off)=>[lx(sp[0])+sp[2]*(cs/2-off),lz(sp[1])+sp[3]*(cs/2-off)];
    if(k===0){const sp=take();if(sp){const [x,z]=at(sp,0.3);P(x,0.45,z,0.5,0.9,0.5,'#5a5560');P(x,0.95,z,0.6,0.1,0.6,'#4a4650');candle(x-0.12,1.0,z,1);candle(x+0.12,1.0,z+0.1,0)}return}
    if(q===RL){/* skarbiec: kopce złota, puchary, kandelabry */for(let n=0;n<3;n++){const sp=take();if(!sp)break;const [x,z]=at(sp,0.75);for(let m=0;m<7;m++){const hh=0.1+r()*0.25;P(x+(r()-0.5)*0.9,hh/2,z+(r()-0.5)*0.9,0.3+r()*0.4,hh,0.3+r()*0.4,m%3?GOLD:'#e8c860')}P(x+0.3,0.22,z,0.12,0.16,0.12,'#c8a040');P(x+0.3,0.34,z,0.18,0.08,0.18,'#d9b23a');P(x-0.3,0.1,z+0.3,0.2,0.2,0.2,'#a83a8a')}
      for(let n=0;n<2;n++){const sp=take();if(!sp)break;const [x,z]=at(sp,0.45);P(x,0.06,z,0.5,0.12,0.5,IRON);P(x,0.9,z,0.08,1.7,0.08,'#8a7a5a');P(x,1.75,z,0.7,0.06,0.08,'#8a7a5a');for(const o of [-0.3,0,0.3])candle(x+o,1.78,z,o===0);col(x,z,0.28,0.28,1.8)}return}
    const role=ROLES[(k*3+Math.floor(r()*3))%ROLES.length];
    if(role==='cela'){for(let n=0;n<3;n++){const sp=take();if(!sp)break;const [x,z]=at(sp,0.6);P(x,0.08,z,1.2,0.16,0.9,'#b8a050');P(x+0.2,0.17,z-0.1,0.6,0.06,0.4,'#c8b060')}
      {const sp=take();if(sp){const [x,z]=at(sp,0.35);P(x,0.22,z,0.36,0.44,0.36,WD);P(x,0.36,z,0.38,0.05,0.38,IRON);P(x,0.12,z,0.38,0.05,0.38,IRON)}}
      {const sp=take();if(sp){const [x,z]=at(sp,0.5);P(x,0.1,z,0.5,0.1,0.15,'#e8e2cc');P(x+0.25,0.14,z+0.15,0.22,0.2,0.24,'#ece6d0');P(x+0.25,0.13,z+0.26,0.14,0.06,0.03,'#2a2420')}}}
    else if(role==='magazyn'){for(let n=0;n<8;n++){const sp=take();if(!sp)break;const [x,z]=at(sp,0.55),t=r();
        if(t<0.45){for(const [o1,o2] of [[0,0],[0.5,0.15]].slice(0,r()<0.5?1:2)){const bx=x+(sp[2]?0:o1),bz=z+(sp[3]?0:o1);P(bx,0.45,bz,0.66,0.9,0.66,'#7a5232');P(bx,0.45,bz,0.72,0.8,0.56,'#6a4628');for(const y of [0.18,0.72])P(bx,y,bz,0.7,0.06,0.7,IRON);P(bx,0.91,bz,0.56,0.03,0.56,'#5a3c24');col(bx,bz,0.36,0.36,0.92)}}
        else if(t<0.8){const sz=0.7+r()*0.3;P(x,sz/2,z,sz,sz,sz,'#8a6440');for(const e of [-1,1]){P(x+e*sz/2,sz/2,z,0.06,sz+0.02,sz+0.02,'#6a4a2a');P(x,sz/2,z+e*sz/2,sz+0.02,sz+0.02,0.06,'#6a4a2a')}P(x,sz/2,z,sz+0.02,0.08,sz+0.02,'#6a4a2a');col(x,z,sz/2,sz/2,sz);if(r()<0.5){P(x+0.05,sz+0.25,z,0.5,0.5,0.5,'#9a7448');col(x,z,sz/2,sz/2,sz+0.5)}}
        else{for(let m=0;m<3;m++)P(x+(m-1)*0.38,0.25,z+(r()-0.5)*0.2,0.36,0.5,0.32,m%2?'#c8b088':'#b8a078')}}}
    else if(role==='krypta'){const [x,z]=[mx,mz+(q.d>3?0:0)];const sp=take();const ax=sp?at(sp,0.9):[x,z];const X=sp?sp[3]!==0:true;
      P(ax[0],0.42,ax[1],X?2.2:1.0,0.84,X?1.0:2.2,'#8a8590');P(ax[0],0.9,ax[1],X?2.3:1.1,0.14,X?1.1:2.3,'#9a95a0');P(ax[0],0.99,ax[1],X?1.6:0.4,0.06,X?0.4:1.6,'#7a7580');P(ax[0]+(X?-0.75:0),1.02,ax[1]+(X?0:-0.75),0.3,0.08,0.3,'#7a7580');col(ax[0],ax[1],X?1.15:0.55,X?0.55:1.15,1.0);
      for(const [o1,o2] of [[-1,-1],[1,-1],[-1,1],[1,1]])candle(ax[0]+o1*(X?1.25:0.7),0,ax[1]+o2*(X?0.7:1.25),o1===1&&o2===1);
      for(let n=0;n<2;n++){const sp2=take();if(!sp2)break;const [x2,z2]=at(sp2,0.3);P(x2,0.6,z2,0.5,1.2,0.5,'#6a6570');P(x2,1.3,z2,0.44,0.3,0.44,'#ece6d0');P(x2,1.3,z2+0.18*(sp2[3]||1),0.1,0.08,0.05,'#1a1614')}}
    else if(role==='kaplica'){const sp=take();if(sp){const [x,z]=at(sp,0.55),X=sp[2]!==0;P(x,0.5,z,X?0.8:1.8,1.0,X?1.8:0.8,'#77727b');P(x,1.02,z,X?0.9:1.9,0.06,X?1.9:0.9,'#6a1f1f');P(x,0.75,z+(X?0:-0.41*sp[3]),X?0.06:1.2,0.4,X?1.2:0.06,'#c9a24a');col(x,z,X?0.42:0.92,X?0.92:0.42,1.05);
        for(const o of [-0.6,-0.2,0.2,0.6])candle(x+(X?0:o),1.05,z+(X?o:0),Math.abs(o)<0.3&&o<0);P(x+(X?0.1:0)*sp[2],1.3,z,0.3,0.5,0.3,'#d9b23a');
        const wx=lx(sp[0])+sp[2]*(cs/2-0.06),wz=lz(sp[1])+sp[3]*(cs/2-0.06);P(wx,2.4,wz,X?0.06:0.2,1.2,X?0.2:0.06,'#c9a24a');P(wx,2.6,wz,X?0.06:0.7,0.2,X?0.7:0.06,'#c9a24a')}
      for(let n=0;n<2;n++){const sp2=take();if(!sp2)break;const [x2,z2]=at(sp2,0.6);P(x2,0.25,z2,sp2[2]?0.5:1.4,0.5,sp2[2]?1.4:0.5,WD);col(x2,z2,sp2[2]?0.25:0.7,sp2[2]?0.7:0.25,0.5)}}
    else if(role==='biblioteka'){for(let n=0;n<6;n++){const sp=take();if(!sp)break;const [x,z]=at(sp,0.3),X=sp[2]!==0;P(x,1.2,z,X?0.5:1.8,2.4,X?1.8:0.5,WD2);for(let y=0.35;y<2.3;y+=0.55){P(x-(X?0.02*sp[2]:0),y-0.2,z-(X?0:0.02*sp[3]),X?0.46:1.7,0.05,X?1.7:0.46,WD);let u=-0.78;while(u<0.75){const bw=0.07+r()*0.07,bh=0.3+r()*0.14,c=['#7a2a2a','#2a4a6a','#3a5a2a','#6a5a2a','#4a2a5a','#8a6a3a'][Math.floor(r()*6)];if(r()>0.12)P(x+(X?-sp[2]*0.03:u+bw/2),y-0.15+bh/2,z+(X?u+bw/2:-sp[3]*0.03),X?0.34:bw,bh,X?bw:0.34,c);u+=bw+0.01}}col(x,z,X?0.27:0.92,X?0.92:0.27,2.4)}
      const sp=take();if(sp){const [x,z]=at(sp,0.8);P(x,0.4,z,1.1,0.08,0.7,WD);for(const [a,b] of [[-0.48,-0.28],[0.48,-0.28],[-0.48,0.28],[0.48,0.28]])P(x+a,0.2,z+b,0.08,0.4,0.08,WD2);P(x,0.46,z,0.5,0.04,0.36,'#e8dcc0');candle(x+0.4,0.44,z-0.2,1);col(x,z,0.56,0.36,0.45)}}
    else if(role==='zbrojownia'){for(let n=0;n<3;n++){const sp=take();if(!sp)break;const [x,z]=at(sp,0.3),X=sp[2]!==0;P(x,0.06,z,X?0.4:1.6,0.12,X?1.6:0.4,WD2);P(x,1.55,z,X?0.1:1.6,0.1,X?1.6:0.1,WD2);
        for(let u=-0.6;u<=0.61;u+=0.3){const kind=r();const px=x+(X?0:u),pz=z+(X?u:0);if(kind<0.5){P(px,1.0,pz,0.05,1.9,0.05,'#6b4a2b');P(px,1.98,pz,0.07,0.18,0.07,'#c8ccd2')}else{P(px,0.8,pz,0.07,1.2,0.07,'#c8ccd2');P(px,0.22,pz,X?0.06:0.24,0.05,X?0.24:0.06,'#8a7a5a');P(px,0.12,pz,0.05,0.16,0.05,'#4a3020')}}col(x,z,X?0.22:0.82,X?0.82:0.22,2)}
      const sp=take();if(sp){const [x,z]=at(sp,0.45);P(x,0.32,z,0.5,0.64,0.5,'#5a5a62');P(x,0.68,z,0.7,0.08,0.4,'#3a3a40');col(x,z,0.35,0.25,0.72)}}
    // stół ze stołkami po skosie od środka (poza linią korytarzy) w większych komnatach
    if(q.w>=4&&q.d>=4&&role!=='krypta'&&role!=='kaplica'){for(const [a,b] of [[1,1],[-1,1],[1,-1],[-1,-1]]){const ti=q.cx+a,tj=q.cz+b;if(ti<q.i||tj<q.j||ti>=q.i+q.w||tj>=q.j+q.d||reserve.has(key(ti,tj))||used.has(key(ti,tj)))continue;used.add(key(ti,tj));const x=lx(ti),z=lz(tj);
        P(x,0.78,z,1.5,0.08,0.9,WD);for(const [c,d] of [[-0.65,-0.35],[0.65,-0.35],[-0.65,0.35],[0.65,0.35]])P(x+c,0.38,z+d,0.09,0.76,0.09,WD2);col(x,z,0.78,0.48,0.82);
        for(const [c,d] of [[0,-0.75],[0,0.75],[0.95,0]]){if(r()<0.3)continue;P(x+c,0.42,z+d,0.36,0.06,0.36,WD);for(const [e,f] of [[-0.13,-0.13],[0.13,-0.13],[-0.13,0.13],[0.13,0.13]])P(x+c+e,0.2,z+d+f,0.05,0.4,0.05,WD2)}
        candle(x+0.4,0.82,z-0.15,1);P(x-0.3,0.88,z+0.1,0.14,0.12,0.14,'#8a8a92');P(x-0.05,0.84,z-0.2,0.3,0.04,0.22,'#e8dcc0');break}}
    // drobiazgi: beczka, skrzynie, kości, worki, połamane krzesło
    for(let n=0;n<3;n++){const sp=take();if(!sp)break;const [x,z]=at(sp,0.5),t=r();
      if(t<0.3){P(x,0.45,z,0.66,0.9,0.66,'#7a5232');P(x,0.45,z,0.72,0.8,0.56,'#6a4628');for(const y of [0.18,0.72])P(x,y,z,0.7,0.06,0.7,IRON);col(x,z,0.36,0.36,0.92)}
      else if(t<0.55){P(x,0.3,z,0.6,0.6,0.6,'#8a6440');P(x,0.3,z,0.62,0.07,0.62,'#6a4a2a');col(x,z,0.3,0.3,0.6)}
      else if(t<0.75){for(let m=0;m<5;m++)P(x+(r()-0.5)*0.8,0.05+m*0.02,z+(r()-0.5)*0.8,m%2?0.5:0.1,0.07,m%2?0.1:0.5,'#e4dec8');P(x,0.15,z,0.22,0.2,0.24,'#ece6d0')}
      else if(t<0.88){for(let m=0;m<2;m++)P(x+(m-0.5)*0.4,0.24,z,0.36,0.48,0.32,'#b8a078')}
      else{P(x,0.2,z,0.4,0.05,0.4,WD);P(x+0.15,0.1,z+0.1,0.05,0.2,0.05,WD2);P(x-0.25,0.06,z-0.1,0.45,0.05,0.06,WD2)}}
  });
  // pochodnie: uchwyt ścienny zamiast słupka tam, gdzie stoi przy ścianie
}
// ===== wystrój grot: świecący mech, korzenie, kości, pajęczyny, kałuże =====
function caveDress(s,P,r,lx,lz){const W=s.W,D=s.D,cs=s.cs,C=s.ceil,sol=(i,j)=>i<0||j<0||i>=W||j>=D||!!s.solid[j*W+i],OX=s.x0+W*cs/2,OZ=s.z0+D*cs/2;
  for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){if(sol(i,j)||(s.pool&&s.pool.has(j*W+i)))continue;const x=lx(i),z=lz(j);let wa=null;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(sol(i+a,j+b)){wa=[a,b];break}const t=r();
    if(wa&&t<0.06){/* świecący mech na ścianie */const [a,b]=wa,fx=x+a*(cs/2-0.06),fz=z+b*(cs/2-0.06),c=r()<0.5?'!#5affc8':'!#8affa0';for(let m=0;m<3;m++)P(fx,1.2+r()*3,fz+(a?(r()-0.5)*1.4:0)+(b?0:0),a?0.05:0.3+r()*0.4,0.2+r()*0.3,a?0.3+r()*0.4:0.05,c);if(r()<0.35)s.lights.push([fx+OX,s.fy+2.2,fz+OZ,4.5,0.35,[0.4,1,0.8]])}
    else if(wa&&t<0.12){/* zwisające korzenie */const [a,b]=wa,fx=x+a*0.6,fz=z+b*0.6;for(let m=0;m<4;m++){const hh=0.6+r()*1.8;P(fx+(r()-0.5)*0.8,C-hh/2,fz+(r()-0.5)*0.8,0.06,hh,0.06,m%2?'#5a4030':'#4a3424')}}
    else if(t<0.15){P(x+0.2,0.08,z-0.1,0.55,0.08,0.1,'#e8e2cc');P(x-0.15,0.08,z+0.2,0.1,0.08,0.45,'#e0dac4');if(r()<0.5){P(x-0.3,0.14,z-0.3,0.22,0.2,0.24,'#ece6d0');P(x-0.3,0.13,z-0.19,0.14,0.06,0.03,'#2a2420')}}
    else if(wa&&t<0.19){const [a,b]=wa;P(x+a*0.7,C-0.4,z+b*0.7,a?0.5:1.0,0.6,a?1.0:0.5,'#cfcfc8')}
    else if(t<0.22)P(x+(r()-0.5)*0.6,0.03,z+(r()-0.5)*0.6,0.8+r()*0.5,0.012,0.6+r()*0.4,'#24303a');
    else if(t<0.27){for(let m=0;m<3;m++)P(x+(r()-0.5)*1.4,0.1,z+(r()-0.5)*1.4,0.2+r()*0.3,0.15+r()*0.2,0.2+r()*0.3,['#6a5a4a','#5a4a3c','#7a6a58'][m])}}
}
function dungeonGeo(s){const L=[],cs=s.cs,cave=s.kind==='cave',r=rngOf(s.id+'g'),W=s.W,D=s.D,P=(...b)=>L.push(b),lx=i=>(i+0.5)*cs-W*cs/2,lz=j=>(j+0.5)*cs-D*cs/2;
  const C1=cave?['#6a5a4a','#5a4a3c','#7a6a58','#4a3e34']:['#6f6a73','#5d5a63','#7d7884','#66636d'];
  P(0,-0.1,0,W*cs,0.2,D*cs,cave?'#4a3e34':'#5d5a63');P(0,s.ceil+0.4,0,W*cs,0.8,D*cs,cave?'#3a3028':'#4a4750');
  for(let j=0;j<D;j++)for(let i=0;i<W;i++){if(!s.solid[j*W+i])continue;let edge=false;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=i+a,y=j+b;if(x>=0&&y>=0&&x<W&&y<D&&!s.solid[y*W+x])edge=true}if(!edge)continue;
    const h=s.ceil+(cave?(r()-0.5)*0.6:0);P(lx(i),h/2,lz(j),cs,h,cs,C1[(i*7+j*3)%4]);if(cave&&r()<0.15)P(lx(i),0.3,lz(j),cs+0.3,0.6,cs+0.3,C1[3])}
  s.lights=[];s.pc=[];s.glowL=[];
  if(!cave)try{dgDress(s,P,rngOf(s.id+'d'),lx,lz)}catch(e){console.warn('loch',e)}
  else try{caveDress(s,P,rngOf(s.id+'c'),lx,lz)}catch(e){console.warn('grota',e)}
  /* v141: detale lochów — listwa i mech u podstawy murów, filary przyścienne, łańcuchy, gruz, kości, kałuże, pęknięte płyty */
  {const r2=rngOf(s.id+'x'),SOL=(i,j)=>i<0||j<0||i>=W||j>=D||s.solid[j*W+i];const TR=cave?'#4a3e34':'#4f4c55',MS='#3f5a2c';
   for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){if(SOL(i,j))continue;const x=lx(i),z=lz(j);
     for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){if(!SOL(i+a,j+b))continue;const wx=x+a*cs/2,wz=z+b*cs/2,ax=a!==0;
       if(!cave){P(wx-a*0.06,0.18,wz-b*0.06,ax?0.14:cs,0.36,ax?cs:0.14,TR);if(r2()<0.35)P(wx-a*0.05,0.42,wz-b*0.05,ax?0.1:cs*(0.3+r2()*0.6),0.14,ax?cs*(0.3+r2()*0.6):0.1,MS);
         if(r2()<0.12){P(wx-a*0.18,s.ceil/2,wz-b*0.18,ax?0.36:0.5,s.ceil,ax?0.5:0.36,'#7d7884');P(wx-a*0.2,0.25,wz-b*0.2,ax?0.44:0.6,0.5,ax?0.6:0.44,'#6f6a73');P(wx-a*0.2,s.ceil-0.2,wz-b*0.2,ax?0.44:0.6,0.4,ax?0.6:0.44,'#6f6a73')}
         else if(r2()<0.06){for(let k=0;k<6;k++)P(wx-a*0.08,s.ceil-0.5-k*0.22,wz-b*0.08,0.06,0.16,0.06,k%2?'#3a3a40':'#4a4a52');P(wx-a*0.08,s.ceil-1.9,wz-b*0.08,0.16,0.16,0.16,'#2a2a30')}}
       else if(r2()<0.3)P(wx-a*0.15,0.2+r2()*0.3,wz-b*0.15,ax?0.3:0.6+r2()*0.6,0.4+r2()*0.6,ax?0.6+r2()*0.6:0.3,C1[(i+j)%4])}
     const t=r2();
     if(t<0.05){for(let k=0;k<3;k++){const w=0.2+r2()*0.35;P(x+(r2()-.5)*1.4,w*0.3,z+(r2()-.5)*1.4,w,w*0.6,w*(0.7+r2()*0.6),C1[(k+i)%4])}}
     else if(t<0.075&&!cave){P(x+(r2()-.5),0.06,z+(r2()-.5),0.5,0.1,0.12,'#e0d8c4');P(x+(r2()-.5),0.06,z+(r2()-.5),0.12,0.1,0.42,'#d8d0bc');if(r2()<0.4)P(x+(r2()-.5)*0.6,0.13,z+(r2()-.5)*0.6,0.24,0.22,0.24,'#e8e0cc')}
     else if(t<0.1){const w=0.6+r2()*0.9;P(x+(r2()-.5)*0.6,0.012,z+(r2()-.5)*0.6,w,0.02,w*(0.6+r2()*0.6),cave?'#2a3a44':'#2e3440')}
     else if(t<0.16&&!cave){P(x+(r2()-.5)*0.8,0.005,z+(r2()-.5)*0.8,0.9+r2()*0.6,0.012,0.06,'#3a3840')}}}
  if(cave)for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){if(s.solid[j*W+i]||(s.pool&&s.pool.has(j*W+i)))continue;const t=r();if(t<0.05){const hh=0.6+r()*1.4;P(lx(i)+(r()-0.5),hh/2,lz(j)+(r()-0.5),0.4,hh,0.4,'#7a6a58')}else if(t<0.09){const hh=0.5+r()*1.2;P(lx(i),s.ceil-hh/2,lz(j),0.35,hh,0.35,'#6a5a4a')}else if(t<0.12)P(lx(i),0.25,lz(j),0.3,0.5,0.3,['#7fe3ff','#c87aff','#7dff8a'][Math.floor(r()*3)])}
  for(const [x,y,z,a,b] of s.torches){const ax=x-(s.x0+W*cs/2),az=z-(s.z0+D*cs/2);if(a!=null){/* uchwyt ścienny */P(ax+a*0.15,2.45,az+b*0.15,a?0.32:0.08,0.08,a?0.08:0.32,'#2a2a30');P(ax+a*0.24,2.45,az+b*0.24,a?0.06:0.24,0.3,a?0.24:0.06,'#3a3a40');P(ax,2.45,az,0.12,0.6,0.12,'#4a2f1d');P(ax,2.75,az,0.3,0.24,0.3,'#3a3a40')}else{P(ax,1.4,az,0.16,2.6,0.16,'#4a2f1d');P(ax,2.75,az,0.36,0.3,0.36,'#3a3a40')}}
  if(s.down){const ax=s.down[0]-(s.x0+W*cs/2),az=s.down[1]-(s.z0+D*cs/2);P(ax,0.02,az,3,0.04,3,'#1a1614');for(let k=0;k<4;k++)P(ax,-0.1-k*0.25,az-1+k*0.6,2.4,0.2,0.6,'#5d5a63');P(ax-1.6,0.6,az,0.3,1.2,3,'#7d7884');P(ax+1.6,0.6,az,0.3,1.2,3,'#7d7884')}
  // schody wyjścia
  {const ax=s.exit[0]-(s.x0+W*cs/2),az=s.exit[1]-(s.z0+D*cs/2);for(let k=0;k<4;k++)P(ax,0.15+k*0.3,az+0.6+k*0.5,2,0.3,0.6,'#8e8994')}
  return L}
function buildSpace(s){if(s.g)return;const g=new THREE.Group();let L=s.geoL;if(s.kind==='arena')L=arenaGeo(s);else if(s.kind!=='interior')L=dungeonGeo(s);if(s.kind==='arena'||s.func==='zamek'||s.kind==='dungeon'||s.kind==='cave')try{L=structTex(L.slice(),7,s.kind==='dungeon'||s.kind==='cave'?1.2:1.5)}catch(e){console.warn(e)}
  /* elementy świecące ('!#kolor': świece, płomienie, kryształy, okna) — osobna siatka bez cieniowania, żeby naprawdę świeciły */
  const isG=b=>typeof b[6]==='string'&&b[6][0]==='!',GL=L.filter(isG);if(GL.length)L=L.filter(b=>!isG(b));
  const m=new THREE.Mesh((s.kind==='arena'||s.kind==='dungeon'||s.func==='zamek'||LMK[s.func])?bigTag(kitB(L)):kitB(L),matB);m.position.set(s.x0+s.W*s.cs/2,s.fy,s.z0+s.D*s.cs/2);m.scale.setScalar(BS);m.receiveShadow=true;g.add(m);
  if(GL.length){const gm=new THREE.Mesh(boxes(GL.map(b=>[b[0],b[1],b[2],b[3],b[4],b[5],b[6].slice(1)])),new THREE.MeshBasicMaterial({vertexColors:true}));gm.position.copy(m.position);gm.userData.noVox=1;g.add(gm);s.glowM=gm}
  if(s.kind==='arena'&&s.seats)try{arenaFans(s,g)}catch(e){console.warn('fans',e)}
  // płomienie (świecą bez światła)
  const FL=[];for(const [x,y,z] of s.torches)FL.push([x-(s.x0+s.W*s.cs/2),y-s.fy+(s.kind==='interior'?-0.2:0.45),z-(s.z0+s.D*s.cs/2),0.26,0.42,0.26,'#ffb030'],[x-(s.x0+s.W*s.cs/2),y-s.fy+(s.kind==='interior'?0.05:0.72),z-(s.z0+s.D*s.cs/2),0.14,0.22,0.14,'#fff2a0']);
  for(const [x,y,z] of (s.braz||[])){const ax=x-(s.x0+s.W*s.cs/2),az=z-(s.z0+s.D*s.cs/2),ay=y-s.fy;FL.push([ax,ay+0.35,az,0.8,0.6,0.8,'#ff7a1a'],[ax+0.1,ay+0.75,az-0.1,0.45,0.55,0.45,'#ffb030'],[ax-0.05,ay+1.05,az,0.22,0.35,0.22,'#fff2a0'])}
  if(FL.length){const fm=new THREE.Mesh(boxes(FL),new THREE.MeshBasicMaterial({vertexColors:true}));fm.position.set(s.x0+s.W*s.cs/2,s.fy,s.z0+s.D*s.cs/2);g.add(fm);s.flames=fm}
  if(s.winL&&s.winL.length){const cx=s.x0+s.W*s.cs/2,cz=s.z0+s.D*s.cs/2,G=s.winL.filter(q=>!q[6]).map(q=>[q[0],q[1],q[2],q[3],q[4],q[5],'#ffffff']),SH=s.winL.filter(q=>q[6]).map(q=>[q[0],q[1],q[2],q[3],q[4],q[5],'#fff6dc']);
    const gm=new THREE.Mesh(kitB(G),new THREE.MeshBasicMaterial({color:'#e8f4ff'}));gm.position.set(cx,s.fy,cz);gm.scale.setScalar(BS);g.add(gm);s.winG=gm;
    if(SH.length){const sm=new THREE.Mesh(kitB(SH),new THREE.MeshBasicMaterial({color:'#fff2d0',transparent:true,opacity:0.16,blending:THREE.AdditiveBlending,depthWrite:false}));sm.position.set(cx,s.fy+0.02,cz);sm.scale.setScalar(BS);g.add(sm);s.shaft=sm}
    if(s.winC&&s.winC.length){const cm=new THREE.Mesh(kitB(s.winC),new THREE.MeshBasicMaterial({vertexColors:true}));cm.position.set(cx,s.fy,cz);cm.scale.setScalar(BS);g.add(cm);s.winCM=cm}
    {// ukośna smuga światła od każdej szyby w głąb wnętrza (zanika ku podłodze)
     const B=[];for(const q of s.winL){if(q[6]||q[1]<1||q[4]<1)continue;const thinX=q[3]<=q[5],dx=thinX?-Math.sign(q[0]||1):0,dz=thinX?0:-Math.sign(q[2]||1),w=thinX?q[5]:q[3],hh=q[4],n=7,Lr=Math.min(thinX?s.W*0.42:s.D*0.42,q[1]*1.25+1.2);
       for(let k=0;k<n;k++){const t=(k+0.5)/n,o=0.25+t*Lr,y=Math.max(hh*0.25,q[1]-t*(q[1]-0.25)),h2=Math.max(0.2,hh*(1-t*0.7));B.push([q[0]+dx*o,y,q[2]+dz*o,thinX?Lr/n*1.02:w*0.9,h2,thinX?w*0.9:Lr/n*1.02,'#fff6dc'])}}
     if(B.length){const bm=new THREE.Mesh(kitB(B),new THREE.MeshBasicMaterial({color:'#fff0c8',transparent:true,opacity:0.05,blending:THREE.AdditiveBlending,depthWrite:false}));bm.position.set(cx,s.fy,cz);bm.scale.setScalar(BS);bm.userData.noVox=1;g.add(bm);s.beam=bm}}
    s.winW=s.winL.filter(q=>!q[6]&&q[4]>=1).map(q=>{const ix=q[0]+cx,iz=q[2]+cz,dx=cx-ix,dz=cz-iz,l=Math.hypot(dx,dz)||1;return[ix+dx/l*1.6,s.fy+q[1],iz+dz/l*1.6]});s._wd=null}
  if(s.kind==='cave'){const cx0=s.x0+s.W*s.cs/2,cz0=s.z0+s.D*s.cs/2,lx=i=>s.x0+(i+0.5)*s.cs-cx0,lz=j=>s.z0+(j+0.5)*s.cs-cz0,CC=[['#7fe3ff','#c8f6ff'],['#c87aff','#ecd0ff'],['#7dff8a','#d8ffd8']];
    if(s.crys&&s.crys.length){const CL=[];for(const [i,j,c,q] of s.crys){const [a,b]=CC[c],x=lx(i)+(q-0.5)*0.8,z=lz(j)+(q*7%1-0.5)*0.8,h=0.8+q*1.2;CL.push([x,h/2,z,0.32,h,0.32,a],[x+0.3,h*0.3,z+0.15,0.24,h*0.6,0.24,b],[x-0.25,h*0.25,z-0.2,0.22,h*0.5,0.22,a],[x,0.05,z,0.9,0.1,0.9,b])}
      const cm=new THREE.Mesh(boxes(CL),new THREE.MeshBasicMaterial({vertexColors:true}));cm.position.set(cx0,s.fy,cz0);g.add(cm)}
    if(s.mush&&s.mush.length){const ML=[],SL=[],MC=[['#3ad8c0','#b8fff0'],['#b070ff','#e8d0ff'],['#ffb040','#fff0c0']];for(const [i,j,c,q,w] of s.mush){const [a,b]=MC[c],x=lx(i)+(q-0.5)*1.0,z=lz(j)+((q*7)%1-0.5)*1.0;if(w){const h=0.5+q*1.3;SL.push([x,h/2,z,0.16,h,0.16,'#d8d0c0']);ML.push([x,h+0.1,z,0.7+q*0.5,0.2,0.7+q*0.5,a],[x,h+0.26,z,0.4+q*0.3,0.14,0.4+q*0.3,b]);if(q>0.5){SL.push([x+0.4,0.2,z+0.3,0.1,0.4,0.1,'#d8d0c0']);ML.push([x+0.4,0.46,z+0.3,0.36,0.14,0.36,a])}}else{const h=1.2+q*2.6;SL.push([x,h/2,z,0.5,h,0.5,'#6c6a67'],[x+0.3,h*0.3,z+0.2,0.36,h*0.6,0.36,'#7d7b78'],[x,s.ceil-h*0.4,z,0.44,h*0.8,0.44,'#6c6a67'],[x-0.25,s.ceil-h*0.2,z-0.2,0.3,h*0.4,0.3,'#7d7b78'])}}
      if(SL.length){const sm=new THREE.Mesh(boxes(SL),matB);sm.position.set(cx0,s.fy,cz0);g.add(sm)}if(ML.length){const mm=new THREE.Mesh(boxes(ML),new THREE.MeshBasicMaterial({vertexColors:true}));mm.position.set(cx0,s.fy,cz0);g.add(mm)}}
    if(s.pool&&s.pool.size){const PL=[];for(const k of s.pool){const i=k%s.W,j=Math.floor(k/s.W);PL.push([lx(i),0.14,lz(j),s.cs+0.02,0.06,s.cs+0.02,'#2d6a9a'])}const pm=new THREE.Mesh(boxes(PL),new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,opacity:0.82,emissive:0x0a2a40}));pm.position.set(cx0,s.fy,cz0);g.add(pm)}}
  // NPC wnętrza
  s.live=[];const v=s.v;if(s.kind==='interior'&&v){const R=RACES[v.race];s.npcs.forEach((q,k)=>{if(q.horse){const hm=makeEnemy('kon',false);hm.position.set(q.x,s.fy,q.z);hm.rotation.y=q.ry;g.add(hm);s.live.push({horse:hm});return}
      const rr=rngOf(s.id+'n'+k),fem=rr()<0.4,pool=fem?R.f:R.m,n={id:s.id+':'+q.role+k,vid:v.id,role:q.role,fem,name:pool[Math.floor(rr()*pool.length)],roleN:q.roleN||(ROLE[q.role]||['Najemnik','Najemniczka'])[fem?1:0],x:q.x,z:q.z,ry:q.ry,skin:rpick(rr,R.skin),hair:rpick(rr,R.hair),cloth:rpick(rr,R.cloth),race:v.race,qg:false,inside:s.id};
      if(q.role==='najemnik')n.merc=mercOffer(n,v);if(q.role==='mieszk'||q.role==='wedr'||q.wan)n.wan={t:1+rr()*3,hx:q.x,hz:q.z,r:q.wan||5};n.reach=q.reach;n.fix=q.sit;n.m=makeNpc(n);n.m.position.set(n.x,s.fy+(q.y||0)+0.003,n.z);n.m.rotation.y=n.ry;if(q.sit)try{seatPose(n.m.userData.g.userData)}catch(_){}n.m.add(nameTag(n.name+' · '+n.roleN,q.role==='najemnik'?'#ff9d6b':q.role==='kupiec'?'#7dd87d':'#9fb6c8'));g.add(n.m);s.live.push(n)})}
  if(s.kind==='interior')for(const t of (s.pets||[])){if(!EDEF[t])continue;try{const pm=makeEnemy(t,false),x=s.x0+s.W/2+(Math.random()-0.5)*3,z=s.z0+s.D/2+(Math.random()-0.5)*2;pm.position.set(x,s.fy,z);g.add(pm);s.live.push({pet:pm,x,z,ry:0,t:2})}catch(_){}}
  try{dgBuildExtras(s,g)}catch(e){console.warn(e)}
  if(s.chest&&s.kind!=='interior'){const CM=chestModel(true),c=new THREE.Group(),base=new THREE.Mesh(boxes(CM[0]),decoMat),lid=new THREE.Group();lid.position.set(0,CM[2],-CM[3]/2);lid.add(new THREE.Mesh(boxes(CM[1]),decoMat));c.add(base,lid);c.position.set(s.chest[0],s.fy,s.chest[1]);g.add(c);s.lid=lid;if(W.opened[s.id])lid.rotation.x=-1.9}
  scene.add(g);s.g=g}
function unbuildSpace(s){if(!s.g)return;scene.remove(s.g);s.g.traverse(o=>{if(o.geometry&&o.geometry.userData&&!o.userData.keep&&o.geometry!==ringGeo)o.geometry.dispose()});s.g=null;s.live=null}
function enterSpace(s){buildSpace(s);s.backFrom=[player.p.x,player.p.y,player.p.z];player.p.set(s.spawn[0],s.fy+0.05,s.spawn[1]);player.v.set(0,0,0);camY=null;SPC=s;sfx('door');
  if(PET)PET.p.copy(player.p);for(const f of FOL)f.p.set(player.p.x+1,player.p.y,player.p.z+1);
  if(s.kind==='dungeon'||s.kind==='cave'){const def={id:s.id,type:s.kind==='cave'?'jaskinia':'loch',x:s.st.x,z:s.st.z,lvl:(s.st.lvl||1)+((s.lvl||1)-1)*2,b:s.st.b,space:1};if(isAuth())spawnStructGuards(def);else NET.tr&&NET.tr.send({t:'sspawn',from:NET.id,def})}
  toast(s.kind==='interior'?ENTERABLE[s.func]:s.kind==='arena'?'Arena — uderz w gong, by zacząć walkę':s.kind==='cave'?'Jaskinia':'Loch','#ffd27a')}
function leaveSpace(){const s=SPC;if(!s)return;const y=s.outY??(colAt(s.out[0],s.out[1])??player.p.y);player.p.set(s.out[0],y+0.1,s.out[1]);player.v.set(0,0,0);camY=null;SPC=null;sfx('door');if(PET)PET.p.copy(player.p);for(const f of FOL)f.p.copy(player.p);setTimeout(()=>{if(SPC!==s)unbuildSpace(s)},1500)}
let nearDoor=null,SPLAST=null;
function spaceTick(dt){if(SPC&&SPC.kind==='arena')try{fansTick(SPC,dt)}catch(_){}
  nearDoor=null;const p=player.p;SPC=spaceIn(p);
  // siatka bezpieczeństwa: wypadnięcie z przestrzeni (loch/jaskinia/wnętrze) bez wyjścia drzwiami → powrót na ostatnie bezpieczne pole
  if(SPC){const s=SPC,i=Math.floor((p.x-s.x0)/s.cs),j=Math.floor((p.z-s.z0)/s.cs);if(i>0&&j>0&&i<s.W-1&&j<s.D-1&&!s.solid[j*s.W+i]&&p.y<s.fy+3)SPLAST={s,x:p.x,z:p.z};if(p.y<s.fy-1.5){p.y=s.fy+0.05;player.v.y=0}}
  else if(SPLAST&&SPACES.get(SPLAST.s.id)===SPLAST.s&&p.y>450){const s=SPLAST.s,m=8;if(p.x>s.x0-m&&p.z>s.z0-m&&p.x<s.x0+s.W*s.cs+m&&p.z<s.z0+s.D*s.cs+m){p.set(SPLAST.x,s.fy+0.05,SPLAST.z);player.v.set(0,0,0);camY=null;SPC=s}else SPLAST=null}
  else SPLAST=null;
  if(SPC){const s=SPC;if(Math.hypot(p.x-s.exit[0],p.z-s.exit[1])<1.6)nearDoor={exit:1};dgTick(s,dt);if(s.kind==='arena'&&s.gong&&Math.hypot(p.x-s.gong[0],p.z-s.gong[1])<2.4)nearDoor={arena:s};
    if(s.down&&Math.hypot(p.x-s.down[0],p.z-s.down[1])<2)nearDoor={down:s};if(s.levers&&!s.gateOpen)s.levers.forEach((q,k)=>{if(Math.hypot(p.x-q[0],p.z-q[1])<1.6)nearDoor={lever:k+1,s}});
    if(s.live)for(const n of s.live){if(n.horse){animEnemy(n.horse,0,dt,0,0,0);continue}
      if(n.pet||n.wan){const freeAt=(x,z)=>{const i=Math.floor((x-s.x0)/s.cs),j=Math.floor((z-s.z0)/s.cs);return i>0&&j>0&&i<s.W-1&&j<s.D-1&&!s.solid[j*s.W+i]};const W2=n.pet?n:n.wan;let sp=0;
        if(W2.t>0){W2.t-=dt}else if(W2.tx==null){for(let k=0;k<12;k++){const tx=s.x0+1.5+Math.random()*(s.W-3),tz=s.z0+1.5+Math.random()*(s.D-3.5);if(freeAt(tx,tz)&&(!n.wan||Math.hypot(tx-W2.hx,tz-W2.hz)<(W2.r||5))){W2.tx=tx;W2.tz=tz;break}}if(W2.tx==null)W2.t=2}
        else{const dx=W2.tx-n.x,dz=W2.tz-n.z,dd=Math.hypot(dx,dz),near=n.wan&&(dlg&&dlg.n===n||Math.hypot(p.x-n.x,p.z-n.z)<1.8||!!n.chat);if(dd<0.3||near){if(dd<0.3){W2.tx=null;W2.t=2+Math.random()*(n.pet?5:6)}}else{sp=n.pet?1.1:0.9;const st=Math.min(dd,sp*dt),nx=n.x+dx/dd*st,nz=n.z+dz/dd*st;if(freeAt(nx,nz)){n.x=nx;n.z=nz}else{W2.tx=null;W2.t=1}n.ry=Math.atan2(dx,dz)}}
        if(n.pet){n.pet.position.set(n.x,s.fy,n.z);let dr=n.ry-n.pet.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));n.pet.rotation.y+=dr*Math.min(1,6*dt);animEnemy(n.pet,sp,dt,0,0,0);continue}
        n.m.position.x=n.x;n.m.position.z=n.z;const G=n.m.userData.g;if(G)animChar(G,sp>0?1.2:0,dt,false,false);if(sp>0){let dr=n.ry-n.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));n.m.rotation.y+=dr*Math.min(1,6*dt);continue}}const dx=p.x-n.x,dz=p.z-n.z,d=Math.hypot(dx,dz);const tr=n.fix?n.ry:n.chat&&n.chatFace!=null?n.chatFace:d<5?Math.atan2(dx,dz):n.ry;let dr=tr-n.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));n.m.rotation.y+=dr*Math.min(1,5*dt);if(d<(n.reach||2.6)&&(!nearNpc||d<Math.hypot(p.x-nearNpc.x,p.z-nearNpc.z)))nearNpc=n}
    if(s.heal&&P2.hp<ST.hp&&!P2.dead)P2.hp=Math.min(ST.hp,P2.hp+ST.hp*0.05*dt);
    if(s.lid&&(!W.opened[s.id]||chestLeft(s.id))&&Math.hypot(p.x-s.chest[0],p.z-s.chest[1])<2.2)nearDoor={chest:s};if(s.lid&&W.opened[s.id])s.lid.rotation.x+=(-1.9-s.lid.rotation.x)*Math.min(1,6*dt)}
  else{// drzwi budynków i wejścia do lochów
    for(const v of villages.values()){if(!v||!v.g||Math.abs(v.x-p.x)>90+(v.Hs||0)||Math.abs(v.z-p.z)>90+(v.Hs||0))continue;for(const h of v.houses){if(!ENTERABLE[h.func]||h.farm||!h.core)continue;const [dx,dz]=doorOf(h);if(Math.hypot(p.x-dx,p.z-dz)<1.8&&Math.abs(p.y-h.top)<2.2){nearDoor={house:h,v};break}}if(nearDoor)break}
    if(!nearDoor)for(const st of structs.values()){if(!st)continue;if(st.type==='portal'&&Math.hypot(p.x-st.x,p.z-st.z)<2.2){nearDoor={portal:st};break}if(st.type!=='loch'&&st.type!=='jaskinia'&&st.type!=='smok')continue;const ex=st.x,ez=st.z+(st.type==='jaskinia'?6.5:st.type==='smok'?5.4:4.6);if(Math.hypot(p.x-ex,p.z-ez)<2.4){nearDoor={st};break}}}
  if(nearNpc&&nearNpc.inside&&!dlg){const pr=$('prompt');pr.hidden=false;pr.innerHTML='<kbd>F</kbd> Rozmowa: <b></b>';pr.querySelector('b').textContent=nearNpc.name+' ('+nearNpc.roleN+')'}
  if(nearDoor&&!nearNpc&&!dlg){const pr=$('prompt');pr.hidden=false;pr.innerHTML=nearDoor.arena?(AR.on?'Walka trwa…':'<kbd>F</kbd> Uderz w gong — rozpocznij walkę'):nearDoor.lever?'<kbd>F</kbd> Pociągnij dźwignię':nearDoor.down?'<kbd>F</kbd> Zejdź niżej (poziom '+((nearDoor.down.lvl||1)+1)+')':nearDoor.exit?(SPC&&SPC.up?'<kbd>F</kbd> Wejdź poziom wyżej':'<kbd>F</kbd> Wyjdź na zewnątrz'):nearDoor.chest?'<kbd>F</kbd> Otwórz skrzynię':nearDoor.portal?'<kbd>F</kbd> Wejdź w portal (do najbliższego miasta)':nearDoor.st?'<kbd>F</kbd> '+(nearDoor.st.type==='jaskinia'?'Wejdź do jaskini':nearDoor.st.type==='smok'?'Wejdź w paszczę smoka':'Zejdź do lochu'):'<kbd>F</kbd> Wejdź: '+ENTERABLE[nearDoor.house.func]}
  // światła: latarnie graczy w slotach 0–3, pochodnie najbliżej gracza w 4–7
  const T=[];if(SPC&&SPC.torches)for(const t of SPC.torches)T.push(t);if(SPC&&SPC.braz)for(const t of SPC.braz)T.push([t[0],t[1]+0.15,t[2]]);if(!SPC)for(const h of (W.huts||[]))T.push([h.x+Math.sin(h.ry)*1.3,h.y+1.2,h.z+Math.cos(h.ry)*1.3]);for(const e of enemies.values())if(e.torch&&e.st!==2&&e.m)T.push([e.p.x,e.p.y+2.2,e.p.z]);
  T.sort((a,b)=>Math.hypot(a[0]-p.x,a[2]-p.z)-Math.hypot(b[0]-p.x,b[2]-p.z));const fl=1+Math.sin(performance.now()*0.017)*0.06;
  for(let k=0;k<4;k++){const U=SEAS_U.uLamp.value[4+k],t=T[k];if(t&&Math.hypot(t[0]-p.x,t[2]-p.z)<60){U.set(t[0],t[1],t[2],SPC&&SPC.kind==='interior'?9:11);SEAS_U.uLampI.value[4+k]=(SPC&&SPC.kind==="interior"?0.6:SPC?1.0:0.9)*fl}else{U.w=0;SEAS_U.uLampI.value[4+k]=0}}
}
function useDoor(d){if(d.exit)return SPC&&SPC.up?goUp():leaveSpace();if(d.down){if(guardsAlive({id:d.down.id}))return toast('Najpierw pokonaj strażników tego poziomu','#ff8a7a');return goDown(d.down)}if(d.lever)return pullLever(d.s,d.lever-1);if(d.chest)return openSpaceChest(d.chest);if(d.portal){try{PFX.emit(player.p.x,player.p.y+1,player.p.z,30,['#5ac8ff','#9ae8ff','#ffffff'],{sp:3,up:2,life:1.2,size:0.12})}catch(_){}sfx('coin',0.5);return tpNearestCity()}if(d.st)return enterSpace(genDungeon(d.st));if(d.arena)return arenaStart(d.arena);if(d.house)return enterSpace(d.house.func==='arena'?genArena(d.house,d.v):genInterior(d.house,d.v))}
function openSpaceChest(s,remote){if(s.lvl>1&&!remote)toast('Skarb z '+s.lvl+'. poziomu lochu!','#ffd34d');if(!remote&&guardsAlive({id:s.id}))return toast('Najpierw pokonaj obrońców lochu','#ff8a7a');W.opened[s.id]=W.opened[s.id]||Date.now();if(!remote)sendFx({k:'wopen',id:s.id,at:W.opened[s.id],nm:S.name});sfx('open');const lv=(s.st.lvl||1)+2+((s.lvl||1)-1)*2;if(remote){INV.gold+=Math.round(lv*rnd(4,8)*2);INV.pot+=2;saveInv();updHud();return}W.chestLoot=W.chestLoot||{};if(!W.chestLoot[s.id]){const items=[];for(let i=0;i<3;i++)items.push(genItem(lv,20));W.chestLoot[s.id]={gold:Math.round(lv*rnd(4,8)*2),pot:2,food:0,items};gainXp(60*lv)}saveW();chestUiOpen(s.id,'Skarb lochu')}
function spaceSpawnList(def){const mm2=/^dg:(.+?)(?::(\d+))?$/.exec(def.id)||[0,def.id.slice(3)];const s=SPACES.get(def.id)||(def.type==='jaskinia'||def.type==='loch'?genDungeon({id:mm2[1],type:def.type,x:def.x,z:def.z,lvl:def.lvl,b:def.b},+mm2[2]||1):null);if(!s)return[];
  const cave=s.kind==='cave',out=[],R=s.rooms,mob=cave?['pajak','gloop','nietoperz_w','slepy_lowca','gloop','nietoperz_w','bazyliszek']:['szkielet','lucznik_s','szkielet','upior','mumia'],boss=cave?(strHash(s.id)%3===0?(def.b===6||def.b===5?'troll':'matka'):'krolowa_g'):(strHash(s.id)%2?'lich':'krol_s');
  R.forEach((q,k)=>{if(k===0)return;const last=k===R.length-1,n=last?2:1+(k%2);for(let i=0;i<n;i++)out.push([mob[(k+i)%mob.length],s.x0+(q.cx+0.5+(i-0.5)*1.2)*s.cs,s.fy,s.z0+(q.cz+0.5)*s.cs,false]);if(last)out.push([(s.lvl||1)<(s.maxL||1)?mob[(k+2)%mob.length]:boss,s.x0+(q.cx+0.5)*s.cs,s.fy,s.z0+(q.cz-0.3)*s.cs,true])});
  {const free=(i,j)=>i>0&&j>0&&i<s.W-1&&j<s.D-1&&!s.solid[j*s.W+i];
   if(!out.length){let best=null,bd=-1;for(let j=1;j<s.D-1;j++)for(let i=1;i<s.W-1;i++)if(free(i,j)){const d=Math.hypot(s.x0+(i+0.5)*s.cs-s.spawn[0],s.z0+(j+0.5)*s.cs-s.spawn[1]);if(d>bd){bd=d;best=[i,j]}}if(best)for(let k=0;k<2;k++)out.push([mob[k],s.x0+(best[0]+0.5)*s.cs,s.fy,s.z0+(best[1]+0.5)*s.cs,false])}
   for(const o of out){const ci=Math.floor((o[1]-s.x0)/s.cs),cj=Math.floor((o[3]-s.z0)/s.cs);if(free(ci,cj))continue;let f=null;for(let r=1;r<6&&!f;r++)for(let dj=-r;dj<=r&&!f;dj++)for(let di=-r;di<=r;di++)if(Math.max(Math.abs(di),Math.abs(dj))===r&&free(ci+di,cj+dj)){f=[ci+di,cj+dj];break}if(f){o[1]=s.x0+(f[0]+0.5)*s.cs;o[3]=s.z0+(f[1]+0.5)*s.cs}}}
  return out}

