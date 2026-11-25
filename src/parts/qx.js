// ===== v128: QX — nowe, dopracowane modele zwierząt (szkielet „parts”: tułów z klatką/talią/zadem, szyja, głowa z pyskiem i oczami, ogon, nogi z udem, goleniem i łapą/kopytem) =====
(function(){
const dk=(c,k)=>darker(c,k);
// wymiary obecnych modeli [wysokość, długość] — nowe modele dopasowujemy do nich, żeby nie zmieniać rozmiaru stworów i trafień
const FIT={"wilk":[1.162,1.895],"wilk_mrozny":[1.498,2.444],"krwawy_wilk":[1.317,2.255],"szakal":[0.66,1.021],"pies":[0.835,1.421],"pies_g":[1.122,1.47],"kosciany_ogar":[1.327,2.125],"lis":[0.602,1.467],"lis_og":[0.673,1.893],"szronolis":[0.645,1.762],"lodowy_lis":[0.876,1.695],"kitsune":[1.171,1.915],"tygrys":[1.269,2.373],"szablozab":[1.663,2.555],"gepard":[1.143,1.866],"rys":[0.797,0.925],"rosomak":[0.599,1.323],"grizli":[1.506,2.282],"panda":[1.041,1.52],"kapibara":[0.687,1.086],"jez":[0.36,0.804],"pancernik":[0.572,1.58],"kot":[0.549,0.838],"dzik":[1.166,1.891],"jelen":[2.397,1.763],"jelen_ks":[2.454,1.805],"zloty_jelen":[2.752,1.795],"renifer":[2.088,1.457],"los":[3.007,2.212],"kozica":[1.852,1.645],"pizmowol":[1.672,2.425],"nosorozec":[2.08,4.095]};
const hs=(a,k)=>{const s=Math.sin(a*12.9898+k*78.233)*43758.5453;return s-Math.floor(s)};
function quad(o){
  const P=[],B=(x,y,z,w,h,d,c)=>{P.push([x,y,z,w,h,d,c])},M=(x,y,z,w,h,d,c)=>{B(x,y,z,w,h,d,c);B(-x,y,z,w,h,d,c)};
  const L=o.L,W=o.W,H=o.H,lh=o.lh,c=o.c,c2=o.c2||dk(c,1.25),c3=o.c3||dk(c,0.75),by=lh+H*0.42,hoof=!!o.hoof;
  const cz=L*0.27,hz=-L*0.28,ch=o.chest||1.1;
  // tułów: klatka piersiowa (głębsza), talia (wcięta), zad
  B(0,by+H*0.02,cz,W,H*ch,L*0.44,c);
  B(0,by+H*0.08,-L*0.02,W*0.92,H*0.88*(o.waist||1),L*0.34,c);
  B(0,by+H*0.06,hz,W*0.98,H*(o.rump||1),L*0.4,c);
  B(0,by-H*0.4,cz*0.3,W*0.72,H*0.18,L*0.58,c2);
  if(o.chestC)B(0,by-H*0.05,cz+L*0.2,W*0.7,H*0.75,0.06,o.chestC);
  B(0,by+H*0.5,-L*0.02,W*0.5,0.05,L*0.82,c3);
  M(W*0.43,by+H*0.22,cz+L*0.06,W*0.2,H*0.62,L*0.2,dk(c,0.93));
  M(W*0.43,by+H*0.16,hz-L*0.03,W*0.22,H*0.74,L*0.26,dk(c,0.93));
  if(o.hump)B(0,by+H*0.55+H*o.hump/2,cz+L*0.04,W*0.82,H*o.hump,L*0.32,o.humpC||c3);
  if(o.mane)for(let i=0;i<5;i++)B(0,by+H*(0.58+0.05*(i%2)),cz+L*0.2-i*L*0.09,W*0.32,H*0.16,L*0.09,o.mane);
  if(o.skirt){for(let i=0;i<8;i++){const zz=-L*0.44+i*L*0.125;M(W*0.5,by-H*0.3,zz,0.05,H*0.75+hs(i,9)*H*0.15,L*0.13,i%2?o.skirt:dk(o.skirt,0.88))}B(0,by-H*0.62,0,W*0.8,H*0.16,L*0.8,o.skirt)}
  // wzory na sierści
  if(o.stripes){const n=o.stripes;for(let i=0;i<n;i++){const zz=-L*0.42+i*(L*0.8/(n-1));const hh=H*(0.55+0.25*hs(i,3));M(W*0.505,by+H*0.25-hh*0.3,zz,0.03,hh,L*0.045,o.sc||'#1a1410');B(0,by+H*0.565,zz,W*0.7,0.03,L*0.045,o.sc||'#1a1410')}}
  if(o.spots){const n=o.spots;for(let i=0;i<n;i++){const zz=(hs(i,1)-0.5)*L*0.86,yy=by+H*(hs(i,2)-0.35)*0.8,s=L*(0.03+hs(i,4)*0.025);B((i%2?1:-1)*W*0.505,yy,zz,0.03,s,s*1.1,o.sc||'#2a1a12');if(i%3===0)B((hs(i,5)-0.5)*W*0.6,by+H*0.565,zz,s,0.03,s,o.sc||'#2a1a12')}}
  if(o.saddle)B(0,by+H*0.42,-L*0.05,W*1.02,H*0.25,L*0.55,o.saddle);
  if(o.band)M(W*0.505,by+H*0.05,-L*0.05,0.03,H*0.3,L*0.75,o.band);
  if(o.ribs){for(let i=0;i<6;i++){const zz=cz+L*0.12-i*L*0.075;M(W*0.505,by+H*0.05,zz,0.03,H*0.8,L*0.03,o.ribs)}}
  if(o.spikes)for(let i=0;i<o.spikes.n;i++){const zz=cz+L*0.15-i*(L*0.72/o.spikes.n),hh=H*(0.22+0.14*Math.sin(i/o.spikes.n*Math.PI));B(0,by+H*0.55+hh/2,zz,W*0.14,hh,L*0.05,o.spikes.c);B(0,by+H*0.55+hh+0.02,zz,W*0.08,0.05,L*0.03,o.spikes.c2||o.spikes.c)}
  // szyja
  const na=o.neckA??0.6,nl=o.neckL??H*0.55,nw=o.neckW??W*0.62,ny0=by+H*0.3,nz0=cz+L*0.16;
  for(let i=0;i<3;i++){const t=(i+0.5)/3,yy=ny0+Math.sin(na)*nl*t,zz=nz0+Math.cos(na)*nl*t;B(0,yy,zz,nw*(1-0.12*t),nw*1.15,nw*1.1,c);if(o.neckC)B(0,yy-nw*0.35,zz+nw*0.5,nw*0.62,nw*0.75,0.05,o.neckC)}
  if(o.ruff){for(let i=0;i<3;i++)B(0,ny0+Math.sin(na)*nl*0.2-H*0.1+i*H*0.12,nz0+Math.cos(na)*nl*0.35+0.02,nw*1.25-i*0.04,H*0.2,nw*0.8,i%2?o.ruff:dk(o.ruff,0.93));M(nw*0.62,ny0+Math.sin(na)*nl*0.6,nz0+Math.cos(na)*nl*0.6,0.06,H*0.28,nw*0.7,o.ruff)}
  // głowa
  const s=o.hs,hy=ny0+Math.sin(na)*nl+s*0.18,hz0=nz0+Math.cos(na)*nl+s*0.18,hc=o.hc||c;
  B(0,hy,hz0,s*(o.hw||0.95),s*0.82,s*0.9,hc);
  B(0,hy+s*0.3,hz0+s*0.08,s*0.8,s*0.16,s*0.7,dk(hc,0.94));
  M(s*0.42,hy-s*0.12,hz0+s*0.1,s*0.18,s*0.42,s*0.55,o.cheek||hc);
  const ml=o.ml??s*0.6,mw=o.mw??s*0.5,mh=o.mh??s*0.42,mc=o.mc||c2,mz=hz0+s*0.45+ml/2;
  B(0,hy-s*0.16,mz,mw,mh,ml,mc);B(0,hy-s*0.04,mz-ml*0.15,mw*0.86,mh*0.5,ml*0.7,o.mtop||hc);
  B(0,hy-s*0.16-mh*0.42,mz-ml*0.08,mw*0.8,mh*0.3,ml*0.8,dk(mc,0.9));
  B(0,hy-s*0.16-mh*0.08,mz+ml*0.505,mw*0.7,0.02,0.02,'#2a1410');
  if(o.nose!==0)B(0,hy-s*0.16+mh*0.28,mz+ml/2+0.01,mw*0.58,mh*0.36,0.05,o.nose||'#1a1210');
  if(o.disc){B(0,hy-s*0.16,mz+ml/2+0.015,mw*0.72,mh*0.68,0.05,o.disc);M(mw*0.16,hy-s*0.16,mz+ml/2+0.03,mw*0.12,mh*0.2,0.02,'#5a3a30')}
  const ey=hy+s*0.1,ex=s*(o.ex||0.27),ez=hz0+s*0.455,es=s*(o.es||0.17),ec=o.eye||'#3a2a12';
  M(ex,ey,ez,es*1.15,es,0.03,'#f2ece0');M(ex,ey-es*0.04,ez+0.012,es*0.75,es*0.82,0.03,ec);M(ex,ey-es*0.04,ez+0.024,es*0.32,es*0.62,0.02,'#0a0806');M(ex-es*0.2,ey+es*0.22,ez+0.034,es*0.2,es*0.2,0.015,'#ffffff');
  M(ex,ey+es*0.62,ez-0.005,es*1.3,es*0.25,0.04,dk(hc,0.75));
  if(o.mask)M(ex,ey-es*0.2,ez-0.02,es*1.8,es*1.7,0.035,o.mask);
  if(o.tear)M(ex*0.75,ey-es*1.2,ez+0.01,es*0.22,es*1.6,0.03,o.tear);
  const er=o.earC||hc,ein=o.earIn||'#e8b4a0',eh=o.eh??s*0.42;
  if(o.ears==='pointy'||o.ears==='big'){const k=o.ears==='big'?1.35:1;M(s*0.3,hy+s*0.41+eh*k*0.3,hz0-s*0.12,s*0.24*k,eh*k*0.6,s*0.14,er);M(s*0.3,hy+s*0.41+eh*k*0.75,hz0-s*0.12,s*0.14*k,eh*k*0.4,s*0.12,o.earTip||er);M(s*0.3,hy+s*0.41+eh*k*0.35,hz0-s*0.04,s*0.13*k,eh*k*0.45,0.03,ein)}
  if(o.ears==='round'){M(s*0.34,hy+s*0.44,hz0-s*0.12,s*0.26,s*0.24,s*0.12,er);M(s*0.34,hy+s*0.44,hz0-s*0.05,s*0.14,s*0.13,0.03,ein)}
  if(o.ears==='lynx'){M(s*0.3,hy+s*0.41+eh*0.3,hz0-s*0.12,s*0.24,eh*0.6,s*0.14,er);M(s*0.3,hy+s*0.41+eh*0.68,hz0-s*0.12,s*0.12,eh*0.25,s*0.1,er);M(s*0.3,hy+s*0.41+eh*1.0,hz0-s*0.12,s*0.05,eh*0.45,s*0.05,'#1a1410');M(s*0.3,hy+s*0.41+eh*0.32,hz0-s*0.04,s*0.13,eh*0.4,0.03,ein)}
  if(o.ears==='down'){M(s*0.5,hy+s*0.05,hz0-s*0.02,s*0.1,s*0.62*(o.earL||1),s*0.32,er);M(s*0.52,hy-s*0.22*(o.earL||1),hz0-s*0.02,s*0.1,s*0.18,s*0.3,dk(er,0.85))}
  if(o.ears==='side'){M(s*0.6,hy+s*0.28,hz0-s*0.15,s*0.42,s*0.16,s*0.26,er);M(s*0.62,hy+s*0.28,hz0-s*0.08,s*0.3,s*0.08,0.03,ein)}
  if(o.ears==='tiny'){M(s*0.34,hy+s*0.42,hz0-s*0.1,s*0.14,s*0.12,s*0.1,er)}
  if(o.fangs){const fl=o.fangs;M(mw*0.28,hy-s*0.16-mh*0.45-fl/2+0.02,mz+ml*0.3,mw*0.13,fl,mw*0.13,'#f6efe0');M(mw*0.28,hy-s*0.16-mh*0.45-fl+0.02,mz+ml*0.33,mw*0.08,fl*0.25,mw*0.08,'#fffaf0')}
  if(o.tusks){M(mw*0.5,hy-s*0.12,mz+ml*0.2,mw*0.12,mh*0.2,ml*0.4,'#f2ead8');M(mw*0.56,hy-s*0.02,mz+ml*0.38,mw*0.1,mh*0.45,mw*0.1,'#f6efe0')}
  if(o.whisk)for(const sg of [1,-1]){B(sg*mw*0.62,hy-s*0.12,mz+ml*0.25,mw*0.55,0.015,0.015,'#f6f2ea');B(sg*mw*0.6,hy-s*0.2,mz+ml*0.25,mw*0.5,0.015,0.015,'#f6f2ea')}
  // poroże i rogi
  const A=o.antler,ac=o.antC||'#d8c8a0',ay=hy+s*0.42,az=hz0-s*0.05;
  if(A==='deer'||A==='reindeer'||A==='glow'){const k=o.antS||1,col=A==='glow'?'!'+(o.antGlow||'#bfe8ff'):ac;
    for(const sg of [1,-1]){const X=(v)=>sg*v;B(X(s*0.28),ay+s*0.25*k,az,s*0.12,s*0.5*k,s*0.12,col);B(X(s*0.42),ay+s*0.6*k,az-s*0.08,s*0.32*k,s*0.1,s*0.1,col);B(X(s*0.58),ay+s*0.85*k,az-s*0.12,s*0.1,s*0.6*k,s*0.1,col);
      B(X(s*0.58),ay+s*1.2*k,az-s*0.05,s*0.1,s*0.1,s*0.4*k,col);B(X(s*0.75),ay+s*1.0*k,az-s*0.15,s*0.3*k,s*0.09,s*0.09,col);B(X(s*0.88),ay+s*1.25*k,az-s*0.18,s*0.09,s*0.5*k,s*0.09,col);
      B(X(s*0.4),ay+s*1.05*k,az+s*0.08,s*0.09,s*0.38*k,s*0.09,col);B(X(s*0.64),ay+s*1.55*k,az-s*0.1,s*0.08,s*0.32*k,s*0.08,col);
      if(A==='reindeer'){B(X(s*0.16),ay+s*0.35*k,az+s*0.3,s*0.08,s*0.08,s*0.45*k,col);B(X(s*0.16),ay+s*0.15*k,az+s*0.55*k,s*0.22,s*0.3*k,s*0.06,col)}}}
  if(A==='moose'){for(const sg of [1,-1]){B(sg*s*0.4,ay+s*0.12,az,s*0.4,s*0.14,s*0.14,ac);B(sg*s*0.85,ay+s*0.28,az-s*0.05,s*0.6,s*0.12,s*0.75,ac);B(sg*s*1.0,ay+s*0.5,az-s*0.05,s*0.3,s*0.4,s*0.62,ac);for(let i=0;i<4;i++)B(sg*s*(1.12+i*0.02),ay+s*0.75,az-s*0.3+i*s*0.2,s*0.07,s*0.22,s*0.07,ac)}}
  if(A==='back'){for(const sg of [1,-1]){B(sg*s*0.22,ay+s*0.2,az,s*0.12,s*0.4,s*0.14,ac);B(sg*s*0.24,ay+s*0.42,az-s*0.14,s*0.11,s*0.14,s*0.3,ac);B(sg*s*0.26,ay+s*0.36,az-s*0.34,s*0.1,s*0.18,s*0.12,dk(ac,0.85))}}
  if(A==='down'){B(0,ay+s*0.02,az+s*0.05,s*0.95,s*0.14,s*0.32,ac);for(const sg of [1,-1]){B(sg*s*0.62,ay-s*0.1,az+s*0.05,s*0.22,s*0.32,s*0.2,ac);B(sg*s*0.7,ay-s*0.32,az+s*0.18,s*0.16,s*0.2,s*0.22,dk(ac,0.9));B(sg*s*0.66,ay-s*0.38,az+s*0.32,s*0.12,s*0.14,s*0.14,dk(ac,0.8))}}
  if(A==='rhino'){B(0,hy-s*0.0,mz+ml*0.3,mw*0.4,s*0.38,mw*0.4,ac);B(0,hy+s*0.28,mz+ml*0.28,mw*0.26,s*0.28,mw*0.26,ac);B(0,hy+s*0.5,mz+ml*0.22,mw*0.14,s*0.18,mw*0.14,dk(ac,1.1));B(0,hy+s*0.16,mz-ml*0.18,mw*0.3,s*0.22,mw*0.3,ac)}
  if(o.horn1)B(0,hy+s*0.55,hz0+s*0.25,s*0.12,s*0.5,s*0.12,o.horn1);
  // ogon
  const tc=o.tc||c,tt=o.tail,ty=by+H*0.32,tz0=-L/2-0.02;
  if(tt==='bushy'){const tl=o.tl||L*0.5;B(0,ty-tl*0.12,tz0-tl*0.18,W*0.34,W*0.34,tl*0.38,tc);B(0,ty-tl*0.28,tz0-tl*0.5,W*0.42,W*0.42,tl*0.36,tc);B(0,ty-tl*0.42,tz0-tl*0.82,W*0.36,W*0.36,tl*0.3,o.tip||tc);B(0,ty-tl*0.48,tz0-tl*1.0,W*0.22,W*0.22,tl*0.12,o.tip||tc)}
  if(tt==='long'){const tl=o.tl||L*0.6,n=6;for(let i=0;i<n;i++){const t=i/(n-1),yy=ty-tl*0.25*Math.sin(t*1.6)+(o.tailUp?tl*0.3*t*t:0),zz=tz0-tl*(t*0.95+0.06),w=W*(0.16-0.05*t)*(o.tailW||1);B(0,yy,zz,w,w,tl/n*1.15,(o.tailRings&&i%2)?o.tailRings:(i===n-1&&o.tip?o.tip:tc))}}
  if(tt==='short')B(0,ty,tz0-0.06,W*0.22,W*0.24,0.16,tc),o.tip&&B(0,ty-0.02,tz0-0.15,W*0.18,W*0.2,0.06,o.tip);
  if(tt==='curl'){B(0,ty+0.05,tz0-0.06,W*0.14,W*0.14,0.14,tc);B(0,ty+0.16,tz0-0.12,W*0.14,0.18,W*0.14,tc);B(0,ty+0.25,tz0-0.04,W*0.14,W*0.14,0.12,o.tip||tc)}
  if(tt==='tuft'){B(0,ty-0.1,tz0-0.04,W*0.08,0.3,W*0.08,tc);B(0,ty-0.28,tz0-0.05,W*0.16,0.14,W*0.16,o.tip||dk(tc,0.7))}
  if(tt==='multi'){const tl=o.tl||L*0.55;for(const [ax,ay2] of (o.tails||[[0,0],[-0.5,0.2],[0.5,0.2]])){for(let i=0;i<3;i++){const t=(i+0.5)/3;B(ax*W*t*1.2,ty+ay2*tl*t+tl*0.15*t,tz0-tl*t*0.85,W*(0.3+0.1*Math.sin(t*3)),W*(0.3+0.1*Math.sin(t*3)),tl*0.34,i===2&&o.tip?o.tip:tc)}}}
  if(o.extra)o.extra(B,M,{L,W,H,lh,by,cz,hz,hy,hz0,s,mz,ml,mw,mh,ty,tz0});
  // nogi: udo, goleń, łapa lub kopyto
  const lw=o.lw||W*0.26,lx=W/2-lw*0.55,lzF=cz+L*0.08,lzB=hz-L*0.04,lc=o.lc||c,pc=o.paw||(hoof?'#2a2018':dk(lc,0.85));
  const leg=(front)=>{const T=[];const th=front?lh*0.5:lh*0.55;T.push([0,-th/2+lh*0.1,front?0:-lw*0.08,lw*(front?1.25:1.45),th,lw*(front?1.3:1.6),front?lc:dk(lc,0.97)]);
    T.push([0,-lh*0.66,front?0.01:lw*0.1,lw*(hoof?0.72:0.85),lh*0.45,lw*(hoof?0.72:0.85),o.sock||lc]);
    if(hoof){T.push([0,-lh+0.06,front?0.02:lw*0.12,lw*0.85,0.12,lw*0.95,pc]);if(o.fetlock)T.push([0,-lh+0.16,front?0.0:lw*0.1,lw*0.95,0.12,lw*0.95,o.fetlock])}
    else{T.push([0,-lh+0.05,(front?0.04:lw*0.16)+lw*0.1,lw*1.08,0.1,lw*1.35,pc]);if(o.claws)for(const cx of [-0.3,0,0.3])T.push([cx*lw,-lh+0.03,(front?0.04:lw*0.16)+lw*0.82,lw*0.14,0.06,lw*0.22,o.claws])}
    return T};
  const LF=leg(true),LB=leg(false);
  return{parts:P,hd:{c:[0,hy,hz0],r:s*1.15},tz:tz0,ty,legs:[[lx,lh,lzF,0],[-lx,lh,lzF,1],[lx,lh,lzB,1],[-lx,lh,lzB,0]],lw,lh,lc,legP:(k)=>k<2?LF:LB,wingP:o.wingP||null,wingAt:o.wingAt||null,wingK:o.wingK||'flap'}
}
// dopasowanie do dotychczasowego rozmiaru (wysokość × długość) i podział przez d.sc
function fit(t,m){const f=FIT[t];if(!f)return m;let y0=1e9,y1=-1e9,z0=1e9,z1=-1e9;const acc=(p)=>{y0=Math.min(y0,p[1]-p[4]/2);y1=Math.max(y1,p[1]+p[4]/2);z0=Math.min(z0,p[2]-p[5]/2);z1=Math.max(z1,p[2]+p[5]/2)};m.parts.forEach(acc);m.legs.forEach((l,i)=>m.legP(i).forEach(p=>acc([0,p[1]+l[1],p[2]+l[2],0,p[4],p[5]])));if(m.wingP)m.wingP.forEach(p=>acc([0,p[1]+m.wingAt[1],p[2]+m.wingAt[2],0,p[4],p[5]]));y0=Math.min(y0,0);
  const sc=(EDEF[t]&&EDEF[t].sc)||1,k=Math.sqrt((f[0]/(y1-y0))*(f[1]/(z1-z0)))/sc;const S=p=>{const q=p.slice();for(let i=0;i<6;i++)q[i]*=k;return q};
  const LP=m.legs.map((_,i)=>m.legP(i).map(S));
  return{parts:m.parts.map(S),hd:{c:m.hd.c.map(v=>v*k),r:m.hd.r*k},tz:m.tz*k,ty:m.ty*k,legs:m.legs.map(l=>[l[0]*k,l[1]*k,l[2]*k,l[3]]),lw:m.lw*k,lh:m.lh*k,lc:m.lc,legP:(i)=>LP[i],wingP:m.wingP?m.wingP.map(S):null,wingAt:m.wingAt?m.wingAt.map(v=>v*k):null,wingK:m.wingK,wingMat:m.wingMat,hop:m.hop,flames:m.flames?m.flames.map(f=>({p:f.p.map(v=>v*k),b:f.b.map(S),h:f.h,r:f.r,s:f.s})):null}}
const GL='!';
const SPEC={
 wilk:{L:1.3,W:0.42,H:0.42,lh:0.52,c:'#76767c',c2:'#c9c9cd',c3:'#4c4c52',hs:0.36,ml:0.26,mw:0.18,mh:0.15,ears:'pointy',earIn:'#c8a8a0',eye:'#e8b830',tail:'bushy',tip:'#3a3a40',ruff:'#9a9aa0',chestC:'#c9c9cd',neckA:0.55},
 wilk_mrozny:{L:1.3,W:0.44,H:0.44,lh:0.52,c:'#cfdbe6',c2:'#ffffff',c3:'#8fa8c0',hs:0.37,ml:0.27,mw:0.19,mh:0.15,ears:'pointy',earTip:'#8fa8c0',earIn:'#b8d0e4',eye:GL+'#5ac8ff',tail:'bushy',tip:'#a8c8e0',ruff:'#ffffff',chestC:'#ffffff',spikes:{n:6,c:GL+'#bff4ff',c2:GL+'#ffffff'},nose:'#2a3a4a'},
 krwawy_wilk:{L:1.35,W:0.46,H:0.46,lh:0.54,c:'#5c2020',c2:'#8a3a32',c3:'#2a0c0c',hs:0.38,ml:0.27,mw:0.2,mh:0.16,ears:'pointy',earTip:'#2a0c0c',earIn:'#8a3a32',eye:GL+'#ff3a2a',tail:'bushy',tip:'#2a0c0c',ruff:'#3a1010',chestC:'#7a2a24',spikes:{n:7,c:'#e8dcc8',c2:'#ffffff'},fangs:0.07,claws:'#e8dcc8',
   extra:(B,M,g)=>{M(g.W*0.505,g.by+g.H*0.2,g.cz,0.03,g.H*0.5,0.03,'#e8c8b8');M(g.W*0.505,g.by+g.H*0.1,-g.L*0.1,0.03,0.03,g.L*0.18,'#e8c8b8')}},
 szakal:{L:1.0,W:0.3,H:0.32,lh:0.46,c:'#b88a52',c2:'#ecdcbc',c3:'#5a4a3a',hs:0.28,ml:0.22,mw:0.13,mh:0.12,ears:'big',earIn:'#e8c0a8',eye:'#c89830',tail:'bushy',tc:'#a87a48',tip:'#2a2018',saddle:'#4a4038',chestC:'#ecdcbc'},
 pies:{L:1.05,W:0.36,H:0.36,lh:0.4,c:'#9a6234',c2:'#ecd0a0',c3:'#7a4a24',hs:0.33,ml:0.2,mw:0.18,mh:0.16,ears:'down',earC:'#6a3e1e',eye:'#3a2010',tail:'curl',chestC:'#ecd0a0',mc:'#ecd0a0',
   extra:(B,M,g)=>{B(0,g.by+g.H*0.4,g.cz+g.L*0.27,g.W*0.68,0.07,0.16,'#c03a2a');B(0,g.by+g.H*0.28,g.cz+g.L*0.36,0.06,0.07,0.03,'#ffd34d')}},
 pies_g:{L:1.15,W:0.34,H:0.36,lh:0.62,c:'#6a4026',c2:'#d8b080',c3:'#3a2414',hs:0.34,ml:0.28,mw:0.17,mh:0.16,ears:'down',earL:1.5,earC:'#4a2a16',eye:'#2a1408',tail:'long',tl:0.45,tailUp:1,tip:'#f2e6cc',chestC:'#d8b080',waist:0.8,
   extra:(B,M,g)=>{B(0,g.by+g.H*0.42,g.cz+g.L*0.27,g.W*0.72,0.08,0.18,'#3a2a1a');for(const x of [-0.12,0,0.12])B(x,g.by+g.H*0.42,g.cz+g.L*0.37,0.03,0.04,0.03,'#c8c8c8')}},
 kosciany_ogar:{L:1.3,W:0.42,H:0.4,lh:0.56,c:'#d8ceb4',c2:'#b8ae94',c3:'#8a826c',hs:0.37,ml:0.28,mw:0.18,mh:0.15,ears:'pointy',earC:'#c8bea4',earIn:'#3a3428',eye:GL+'#7fffd0',tail:'long',tl:0.6,tc:'#d8ceb4',tailRings:'#a89e84',ribs:'#3a3428',waist:0.65,nose:'#2a2418',mc:'#e8e0c8',fangs:0.06,
   extra:(B,M,g)=>{for(let i=0;i<8;i++)B(0,g.by+g.H*0.55,g.cz+g.L*0.15-i*g.L*0.1,g.W*0.16,0.07,g.L*0.05,'#efe6cc');M(g.s*0.27,g.hy+g.s*0.1,g.hz0+g.s*0.44,g.s*0.26,g.s*0.24,0.03,'#1a1610')}},
 lis:{L:0.95,W:0.3,H:0.3,lh:0.3,c:'#d4682a',c2:'#f6f0e6',c3:'#b04a1a',hs:0.3,ml:0.24,mw:0.13,mh:0.12,ears:'big',earTip:'#2a1a14',earIn:'#f4dcc8',eye:'#c88a20',tail:'bushy',tl:0.62,tip:'#ffffff',chestC:'#f6f0e6',mc:'#f6f0e6',sock:'#2a1a14',paw:'#1a1210'},
 lis_og:{L:0.95,W:0.3,H:0.3,lh:0.3,c:'#e2481a',c2:'#ffd090',c3:'#a02a0a',hs:0.3,ml:0.24,mw:0.13,mh:0.12,ears:'big',earTip:GL+'#ffcf3a',earIn:'#ffb070',eye:GL+'#ffd34d',tail:'bushy',tl:0.75,tip:GL+'#ffcf3a',chestC:'#ffd090',mc:'#ffd090',sock:'#3a1a0a',paw:'#1a0a04',
   extra:(B,M,g)=>{for(let i=0;i<4;i++)B(0,g.by+g.H*0.6+0.04*(i%2),g.cz-i*g.L*0.18,g.W*0.2,0.06,g.L*0.08,GL+'#ff9a2a')}},
 szronolis:{L:0.95,W:0.3,H:0.3,lh:0.3,c:'#e6eef4',c2:'#ffffff',c3:'#9ab8d0',hs:0.3,ml:0.24,mw:0.13,mh:0.12,ears:'big',earTip:'#7a9ab8',earIn:'#d8e6f2',eye:GL+'#7fd8ff',tail:'bushy',tl:0.7,tip:GL+'#bfe8ff',chestC:'#ffffff',mc:'#ffffff',sock:'#b8cce0',nose:'#3a4a5a'},
 lodowy_lis:{L:1.0,W:0.32,H:0.32,lh:0.36,c:'#f2f6fa',c2:'#ffffff',c3:'#a8c8e0',hs:0.31,ml:0.24,mw:0.14,mh:0.12,ears:'big',earTip:'#a8c8e0',earIn:'#dce8f2',eye:'#3a8ad8',tail:'bushy',tl:0.65,tip:'#d8ecff',chestC:'#ffffff',sock:'#d8e6f0',nose:'#2a3a4a',spikes:{n:5,c:GL+'#bfe8ff'}},
 kitsune:{L:1.15,W:0.38,H:0.38,lh:0.48,c:'#f6f0e6',c2:'#ffffff',c3:'#e8dccc',hs:0.36,ml:0.27,mw:0.15,mh:0.13,ears:'big',earTip:'#d84a2a',earIn:'#f4b8a8',eye:GL+'#ff6a3a',tail:'multi',tl:0.75,tails:[[0,0.1],[-0.9,0.35],[0.9,0.35],[-0.45,0.6],[0.45,0.6]],tip:'#d84a2a',chestC:'#ffffff',sock:'#d84a2a',
   extra:(B,M,g)=>{M(g.s*0.27,g.hy+g.s*0.28,g.hz0+g.s*0.455,g.s*0.08,g.s*0.18,0.03,'#d84a2a');B(0,g.hy+g.s*0.36,g.hz0+g.s*0.455,g.s*0.1,g.s*0.1,0.03,'#d84a2a');B(0,g.by+g.H*0.38,g.cz+g.L*0.27,g.W*0.66,0.06,0.14,'#c8302a');B(0,g.by+g.H*0.2,g.cz+g.L*0.35,0.08,0.1,0.04,'#ffd34d')}},
 tygrys:{L:1.55,W:0.5,H:0.48,lh:0.5,c:'#e47a2a',c2:'#f6efe2',c3:'#c85a1a',hs:0.44,hw:1.05,ml:0.2,mw:0.28,mh:0.2,ears:'round',earC:'#e47a2a',earIn:'#2a1a12',eye:'#e8c040',tail:'long',tl:0.95,tailRings:'#1a1410',tip:'#1a1410',stripes:11,chestC:'#f6efe2',mc:'#f6efe2',cheek:'#f6efe2',whisk:1,nose:'#c86a5a',claws:'#f2ead8',
   extra:(B,M,g)=>{for(const [x,y] of [[0.16,0.3],[0.24,0.12],[0,0.42]])M(g.s*x,g.hy+g.s*y,g.hz0+g.s*0.455,g.s*0.06,g.s*0.16,0.03,'#1a1410')}},
 szablozab:{L:1.6,W:0.58,H:0.56,lh:0.56,c:'#c8a06a',c2:'#efe2c8',c3:'#9a7848',hs:0.48,hw:1.05,ml:0.22,mw:0.32,mh:0.22,ears:'round',earIn:'#5a4030',eye:'#d8a020',tail:'short',tc:'#b08850',tip:'#5a4030',spots:14,sc:'#9a7848',chestC:'#efe2c8',mc:'#efe2c8',cheek:'#efe2c8',fangs:0.26,whisk:1,nose:'#6a4030',claws:'#f2ead8',rump:0.9,chest:1.18,ruff:'#d8b880'},
 gepard:{L:1.45,W:0.36,H:0.4,lh:0.64,c:'#e4bc64',c2:'#f8eed4',c3:'#c89c48',hs:0.36,ml:0.16,mw:0.22,mh:0.17,ears:'round',earIn:'#2a1a12',eye:'#d8a020',tail:'long',tl:0.95,tailRings:'#1a1410',tip:'#ffffff',spots:34,sc:'#1a1410',chestC:'#f8eed4',mc:'#f8eed4',tear:'#1a1410',waist:0.7,whisk:1},
 rys:{L:1.0,W:0.36,H:0.38,lh:0.44,c:'#b8946e',c2:'#efe4d0',c3:'#94704e',hs:0.36,ml:0.14,mw:0.22,mh:0.17,ears:'lynx',earIn:'#efe4d0',eye:'#c8a030',tail:'short',tip:'#1a1410',spots:16,sc:'#6a4a30',chestC:'#efe4d0',mc:'#efe4d0',ruff:'#e8dcc4',cheek:'#efe4d0',whisk:1,paw:'#94704e'},
 rosomak:{L:1.1,W:0.42,H:0.36,lh:0.28,c:'#3a2a1e',c2:'#5a4430',c3:'#241810',hs:0.32,ml:0.16,mw:0.2,mh:0.15,ears:'round',eye:'#2a1a0a',tail:'bushy',tl:0.4,band:'#b0804c',mask:'#5a4430',claws:'#e8e0d0',chest:1.0,rump:1.05},
 grizli:{L:1.7,W:0.74,H:0.7,lh:0.56,c:'#6e4a2c',c2:'#8a6440',c3:'#4a301a',hs:0.5,hw:1.1,ml:0.26,mw:0.3,mh:0.24,mc:'#a07a52',ears:'round',earIn:'#3a2414',eye:'#1a1008',tail:'short',hump:0.24,humpC:'#7a5634',claws:'#e8e0d0',lw:0.24,neckA:0.25,neckL:0.3,chest:1.15},
 panda:{L:1.15,W:0.62,H:0.56,lh:0.36,c:'#f2f0ea',c2:'#e8e4dc',c3:'#e2ded4',hs:0.5,hw:1.1,ml:0.16,mw:0.28,mh:0.2,mc:'#f6f4ee',ears:'round',earC:'#1a1a1a',earIn:'#2a2a2a',eye:'#1a1a1a',mask:'#1a1a1a',tail:'short',lc:'#1a1a1a',paw:'#101010',neckA:0.3,neckL:0.22,
   extra:(B,M,g)=>{B(0,g.by+g.H*0.32,g.cz+g.L*0.02,g.W*1.04,g.H*0.4,g.L*0.24,'#1a1a1a')}},
 kapibara:{L:0.95,W:0.48,H:0.46,lh:0.2,c:'#8e6844',c2:'#a07a54',c3:'#6e4e30',hs:0.38,hw:1.0,ml:0.24,mw:0.3,mh:0.28,mc:'#7a5634',ears:'tiny',eye:'#1a1008',tail:0,nose:'#2a1a12',neckA:0.25,neckL:0.14,chest:1.0,waist:1.05,rump:1.05},
 kot:{L:0.66,W:0.22,H:0.24,lh:0.24,c:'#8a8a8e',c2:'#e8e8ea',c3:'#5a5a60',hs:0.24,ml:0.1,mw:0.14,mh:0.1,ears:'pointy',earIn:'#f0b8b0',eye:'#8ad040',tail:'long',tl:0.5,tailUp:1,tailRings:'#5a5a60',stripes:7,sc:'#4a4a50',chestC:'#e8e8ea',mc:'#e8e8ea',whisk:1,nose:'#e89a9a'},
 dzik:{L:1.35,W:0.5,H:0.52,lh:0.38,c:'#4e3e30',c2:'#6a5644',c3:'#2e2218',hs:0.42,ml:0.3,mw:0.26,mh:0.24,mc:'#5a4838',disc:'#c88a7a',nose:0,ears:'pointy',eh:0.2,earIn:'#8a6a5a',eye:'#1a1008',tail:'tuft',tusks:1,hoof:1,mane:'#2a1e14',chest:1.15,rump:0.95,neckA:0.15,neckL:0.18},
 jelen:{L:1.15,W:0.4,H:0.42,lh:0.78,c:'#9a6a40',c2:'#efe2cc',c3:'#7a5030',hs:0.32,ml:0.26,mw:0.17,mh:0.16,mc:'#7a5030',ears:'side',earIn:'#e8c8b0',eye:'#1a1008',tail:'short',tc:'#efe2cc',hoof:1,neckA:1.1,neckL:0.5,neckW:0.2,antler:'deer',neckC:'#efe2cc',
   extra:(B,M,g)=>{B(0,g.ty-0.05,g.tz0+0.01,g.W*0.5,g.H*0.5,0.04,'#ffffff')}},
 jelen_ks:{L:1.15,W:0.4,H:0.42,lh:0.78,c:'#b8c0e0',c2:'#eef0fa',c3:'#8a94c0',hs:0.32,ml:0.26,mw:0.17,mh:0.16,mc:'#9aa4cc',ears:'side',earIn:'#dce0f4',eye:GL+'#bfe0ff',tail:'short',tc:'#eef0fa',hoof:1,neckA:1.1,neckL:0.5,neckW:0.2,antler:'glow',antGlow:'#cfe8ff',antS:1.15,neckC:'#eef0fa',spots:10,sc:GL+'#dfeeff',
   extra:(B,M,g)=>{B(0,g.hy+g.s*0.3,g.hz0+g.s*0.455,g.s*0.18,g.s*0.18,0.03,GL+'#ffffff')}},
 zloty_jelen:{L:1.15,W:0.4,H:0.42,lh:0.78,c:'#e2b84a',c2:'#fff0c0',c3:'#b8902a',hs:0.32,ml:0.26,mw:0.17,mh:0.16,mc:'#c8a038',ears:'side',earIn:'#fff0c0',eye:'#3a2a10',tail:'short',tc:'#fff0c0',hoof:1,paw:'#8a6a1a',neckA:1.1,neckL:0.5,neckW:0.2,antler:'glow',antGlow:'#ffe070',antS:1.25,neckC:'#fff0c0',spots:10,sc:'#fff4d0'},
 renifer:{L:1.2,W:0.46,H:0.46,lh:0.68,c:'#8a6a4c',c2:'#efe6d8',c3:'#5e4430',hs:0.33,ml:0.26,mw:0.2,mh:0.17,mc:'#6a5038',ears:'side',earIn:'#d8c0a8',eye:'#1a1008',tail:'short',tc:'#efe6d8',hoof:1,paw:'#3a2a1e',neckA:0.9,neckL:0.42,neckW:0.24,antler:'reindeer',antC:'#d8c8a8',neckC:'#efe6d8',ruff:'#efe6d8',fetlock:'#efe6d8'},
 los:{L:1.6,W:0.62,H:0.7,lh:0.95,c:'#4a3424',c2:'#6a5040',c3:'#2e2016',hs:0.44,hw:0.9,ml:0.42,mw:0.26,mh:0.28,mc:'#3e2a1c',ears:'side',earIn:'#8a6a5a',eye:'#1a1008',tail:'short',hoof:1,paw:'#2a2018',neckA:0.55,neckL:0.42,neckW:0.32,antler:'moose',antC:'#c8b48c',hump:0.22,sock:'#a89070',
   extra:(B,M,g)=>{B(0,g.hy-g.s*0.62,g.hz0+g.s*0.05,g.s*0.18,g.s*0.5,g.s*0.18,'#3a2818')}},
 kozica:{L:1.05,W:0.4,H:0.44,lh:0.66,c:'#7a5a3a',c2:'#d8c4a4',c3:'#4a3420',hs:0.32,ml:0.22,mw:0.18,mh:0.16,mc:'#e8dcc4',ears:'side',earIn:'#d8b8a0',eye:'#c8a030',tail:'short',hoof:1,neckA:0.95,neckL:0.36,neckW:0.24,antler:'back',antC:'#3a2a1e',saddle:'#4a3420',
   extra:(B,M,g)=>{M(g.s*0.27,g.hy+g.s*0.02,g.hz0+g.s*0.455,g.s*0.14,g.s*0.62,0.035,'#2a1a10');B(0,g.hy-g.s*0.5,g.hz0+g.s*0.25,g.s*0.18,g.s*0.3,g.s*0.18,'#4a3420')}},
 pizmowol:{L:1.5,W:0.74,H:0.64,lh:0.4,c:'#3e2e22',c2:'#5a4636',c3:'#2a1e16',hs:0.46,hw:1.05,ml:0.24,mw:0.3,mh:0.26,mc:'#c8b8a0',ears:'tiny',eye:'#1a1008',tail:0,hoof:1,neckA:0.1,neckL:0.18,neckW:0.5,antler:'down',antC:'#d8ccb4',hump:0.3,humpC:'#6a5440',skirt:'#3a2a1e',sock:'#d8ccb4'},
 nosorozec:{L:2.4,W:1.0,H:0.95,lh:0.62,c:'#8a8a86',c2:'#9a9a94',c3:'#6a6a66',hs:0.62,hw:0.9,ml:0.5,mw:0.46,mh:0.42,mc:'#7a7a76',ears:'pointy',eh:0.26,earIn:'#a89a90',eye:'#1a1a1a',ex:0.42,tail:'tuft',hoof:1,paw:'#4a4a46',neckA:0.1,neckL:0.3,neckW:0.62,antler:'rhino',antC:'#c8bea8',chest:1.1,lw:0.3,
   extra:(B,M,g)=>{for(const z of [g.cz+0.1,g.hz+0.15])M(g.W*0.505,g.by+g.H*0.15,z,0.04,g.H*0.75,0.05,'#6a6a66');B(0,g.by+g.H*0.52,g.cz,g.W*0.85,0.06,0.05,'#6a6a66')}},
 jez:{L:0.6,W:0.42,H:0.3,lh:0.08,c:'#5a4030',c2:'#c8a888',c3:'#3a2818',hs:0.22,ml:0.16,mw:0.12,mh:0.1,mc:'#d8b898',hc:'#c8a888',ears:'tiny',earC:'#c8a888',eye:'#1a1008',tail:0,neckA:0,neckL:0.04,
   extra:(B,M,g)=>{for(let i=0;i<46;i++){const a=hs(i,7)*Math.PI,zz=(hs(i,8)-0.5)*g.L*0.9,r=g.H*0.55;const x=Math.cos(a)*g.W*0.55,y=g.by+Math.sin(a)*r;B(x,y+0.04,zz,0.05,0.12,0.05,i%3?'#3a2818':'#e8dcc8')}}},
 pancernik:{L:1.1,W:0.5,H:0.4,lh:0.16,c:'#9a8a6a',c2:'#c8b898',c3:'#6a5c44',hs:0.26,ml:0.3,mw:0.12,mh:0.1,mc:'#c8a898',hc:'#a89878',ears:'pointy',eh:0.14,earIn:'#d8b0a0',eye:'#1a1008',tail:'long',tl:0.55,tc:'#8a7a5a',tailRings:'#6a5c44',neckA:0.0,neckL:0.06,claws:'#e8e0d0',
   extra:(B,M,g)=>{for(let i=0;i<9;i++){const zz=-g.L*0.42+i*g.L*0.105;B(0,g.by+g.H*0.12,zz,g.W*1.12,g.H*1.08,g.L*0.08,i%2?'#8a7a5a':'#b0a07c');B(0,g.by+g.H*0.64,zz,g.W*0.8,0.04,g.L*0.08,'#c8b890')}}}
};
// ---- v128 cz.2: gady, płazy, żółwie, kraby, skorpiony, owady, pająki, węże ----
const MR=(P)=>({B:(x,y,z,w,h,d,c)=>{P.push([x,y,z,w,h,d,c])},M:(x,y,z,w,h,d,c)=>{P.push([x,y,z,w,h,d,c]);P.push([-x,y,z,w,h,d,c])}});
const eyesAt=(B,M,x,y,z,s,ec,side)=>{if(side){M(x,y,z,0.03,s,s*1.1,'#f2ece0');M(x+0.012,y,z+s*0.05,0.03,s*0.7,s*0.6,ec);M(x+0.022,y,z+s*0.05,0.02,s*0.55,s*0.22,'#0a0806');M(x+0.03,y+s*0.2,z+s*0.18,0.015,s*0.18,s*0.18,'#ffffff')}else{M(x,y,z,s,s,0.03,'#f2ece0');M(x,y,z+0.012,s*0.7,s*0.75,0.03,ec);M(x,y,z+0.022,s*0.28,s*0.6,0.02,'#0a0806');M(x-s*0.18,y+s*0.2,z+0.03,s*0.18,s*0.18,0.015,'#ffffff')}};
// noga „rozkraczona”: ramię w bok, przedramię w dół, stopa z pazurami (dla strony sg)
const splay=(sg,lw,lh,out,c,c2,claw)=>{const T=[[sg*out/2,-lw*0.2,0,out,lw*0.9,lw*1.05,c],[sg*out,-lh/2-lw*0.1,0,lw*0.85,lh,lw*0.85,c],[sg*out*1.05,-lh-lw*0.05,lw*0.35,lw*1.2,lw*0.4,lw*1.6,c2||c]];if(claw)for(const k of [-0.35,0,0.35])T.push([sg*out*1.05+k*lw,-lh-lw*0.12,lw*1.2,lw*0.16,lw*0.14,lw*0.3,claw]);return T};
// noga stawonoga: segment w górę i w bok, kolano, segment w dół
const seg=(T,a,b,th,c,n)=>{n=n||3;const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2];for(let k=0;k<n;k++){const f=(k+0.5)/n;T.push([a[0]+dx*f,a[1]+dy*f,a[2]+dz*f,Math.abs(dx)/n+th,Math.abs(dy)/n+th,Math.abs(dz)/n+th,c])}};
const arth=(sg,len,hgt,th,c,c2,tip,zo,kn)=>{zo=zo||0;kn=kn||0.3;const K=[sg*len*0.5,hgt*kn*2,zo*0.5],F=[sg*len*0.85,-hgt,zo],T=[];seg(T,[0,0,0],K,th,c,3);T.push([K[0],K[1],K[2],th*1.4,th*1.4,th*1.4,c2||c]);seg(T,K,[F[0],F[1]+th,F[2]],th*0.85,c,4);T.push([F[0],F[1]+th*0.4,F[2],th*0.8,th*0.8,th*1.1,tip||c2||c]);return T};
const BUILD={
 lizard(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,H=o.H,lh=o.lh,c=o.c,c2=o.c2||dk(c,1.3),c3=o.c3||dk(c,0.75),by=lh+H/2;
  B(0,by,L*0.22,W,H,L*0.42,c);B(0,by+H*0.04,-L*0.08,W*1.05,H*1.04,L*0.36,c);B(0,by,-L*0.36,W*0.86,H*0.9,L*0.26,c);B(0,by-H*0.42,0,W*0.78,H*0.2,L*0.86,c2);B(0,by+H*0.5,-L*0.05,W*0.45,0.04,L*0.9,c3);
  if(o.scales)for(let i=0;i<o.scales;i++){const zz=(hs(i,1)-0.5)*L*0.9,xx=(hs(i,2)-0.5)*W*0.8;B(xx,by+H*0.51,zz,W*0.12,0.03,W*0.12,i%2?c3:dk(c,1.12))}
  if(o.stripes)for(let i=0;i<o.stripes;i++){const zz=L*0.38-i*(L*0.8/o.stripes);B(0,by+H*0.505,zz,W*1.0,0.03,L*0.04,o.sc);M(W*0.505,by+H*0.15,zz,0.03,H*0.6,L*0.04,o.sc)}
  if(o.spines)for(let i=0;i<o.spines;i++){const zz=L*0.4-i*(L*0.95/o.spines),hh=H*(0.25+0.25*Math.sin((i/o.spines)*Math.PI));B(0,by+H*0.5+hh/2,zz,W*0.1,hh,L*0.035,o.spC||c3)}
  if(o.plates)for(let i=0;i<o.plates;i++){const zz=L*0.35-i*(L*0.85/o.plates);M(W*0.22,by+H*0.56,zz,W*0.22,H*0.12,L*0.07,o.plC||c3)}
  const nl=o.neckL??L*0.12,s=o.hs,hy=by+H*0.12+(o.headUp||0),hz0=L*0.43+nl+s*0.4;B(0,by+H*0.08,L*0.43+nl/2,W*0.7,H*0.75,nl+0.04,c);
  B(0,hy,hz0,s*1.05,s*0.62,s*0.8,o.hc||c);const sl=o.sl??s*0.9;B(0,hy-s*0.06,hz0+s*0.4+sl/2,s*0.78,s*0.42,sl,o.hc||c);B(0,hy-s*0.3,hz0+s*0.3+sl/2,s*0.72,s*0.18,sl*0.95,c2);
  B(0,hy-s*0.2,hz0+s*0.42+sl,s*0.6,0.02,0.02,'#1a0a08');M(s*0.16,hy+s*0.1,hz0+s*0.4+sl,s*0.06,s*0.06,0.02,'#1a1010');
  eyesAt(B,M,s*0.53,hy+s*0.14,hz0+s*0.1,s*0.24,o.eye||'#d8a020',true);M(s*0.5,hy+s*0.32,hz0+s*0.08,s*0.12,s*0.08,s*0.36,c3);
  if(o.teeth)for(let i=0;i<5;i++)M(s*0.36,hy-s*0.24,hz0+s*0.55+i*sl*0.17,s*0.05,s*0.12,s*0.05,'#f6efe0');
  if(o.horns)for(const sg of [1,-1]){B(sg*s*0.36,hy+s*0.36,hz0-s*0.25,s*0.12,s*0.12,s*0.4,o.hornC||'#e8dcc0');B(sg*s*0.4,hy+s*0.46,hz0-s*0.5,s*0.09,s*0.2,s*0.09,o.hornC||'#e8dcc0')}
  if(o.crest)for(let i=0;i<5;i++)B(0,hy+s*0.36+s*0.1*Math.sin(i),hz0+s*0.2-i*s*0.2,s*0.06,s*(0.24+0.12*(i%2)),s*0.14,o.crest);
  if(o.frill){for(let i=0;i<7;i++){const a=-1.3+i*(2.6/6);B(Math.sin(a)*s*0.85,hy+Math.cos(a)*s*0.65,hz0-s*0.4,s*0.3,s*0.3,0.05,i%2?o.frill:dk(o.frill,0.8))}}
  if(o.glowEye)M(s*0.56,hy+s*0.14,hz0+s*0.1,0.02,s*0.18,s*0.2,'!'+o.glowEye);
  const tl=o.tl||L,tz0=-L/2-0.01,ty=by+H*0.05,n=7;for(let i=0;i<n;i++){const t=i/(n-1),w=W*(0.62-0.5*t),hh=H*(0.68-0.5*t);B(0,ty-H*0.15*t,tz0-tl*(t*0.92+0.05),w,hh,tl/n*1.12,(o.tailRings&&i%2)?o.tailRings:c);if(o.spines&&i<n-1)B(0,ty-H*0.15*t+hh/2+H*0.08,tz0-tl*(t*0.92+0.05),w*0.18,H*0.16,tl/n*0.5,o.spC||c3)}
  if(o.club)B(0,ty-H*0.15,tz0-tl*1.0,W*0.42,H*0.4,tl*0.12,o.club);
  if(o.extra)o.extra(B,M,{L,W,H,lh,by,s,hy,hz0,sl,tz0,tl});
  const lw=o.lw||W*0.22,out=W*0.32;const LP=[0,1,2,3].map(i=>splay(i%2?-1:1,lw,lh,out,o.lc||c,o.lc?dk(o.lc,0.9):dk(c,0.9),o.claw||'#e8dcc8'));
  return{parts:P,hd:{c:[0,hy,hz0],r:s*1.15},tz:tz0,ty,legs:[[W*0.48,lh+lw*0.2,L*0.3,0],[-W*0.48,lh+lw*0.2,L*0.3,1],[W*0.48,lh+lw*0.2,-L*0.3,1],[-W*0.48,lh+lw*0.2,-L*0.3,0]],lw,lh,lc:c,legP:i=>LP[i]}},
 turtle(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,H=o.H,lh=o.lh,c=o.c,sh=o.shell,sh2=o.shell2||dk(sh,0.8),by=lh+H*0.3;
  B(0,lh+H*0.08,0,W*0.92,H*0.18,L*0.88,o.plast||'#d8c890');
  for(let k=0;k<4;k++){const f=1-k*0.2;B(0,by+k*H*0.2,0,W*f,H*0.24,L*f,k%2?sh:sh2)}
  for(let i=0;i<3;i++)for(let j=0;j<2;j++)B((j-0.5)*W*0.36,by+H*0.72,(i-1)*L*0.26,W*0.28,0.04,L*0.22,i%2===j%2?dk(sh,1.12):sh2);
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2;B(Math.cos(a)*W*0.48,by-H*0.02,Math.sin(a)*L*0.48,W*0.16,H*0.14,L*0.14,sh2)}
  if(o.crack)for(let i=0;i<7;i++)B((hs(i,3)-0.5)*W*0.7,by+H*0.2+hs(i,4)*H*0.55,(hs(i,5)-0.5)*L*0.7,W*0.05,0.05,L*0.2,'!'+o.crack);
  if(o.crystals)for(let i=0;i<7;i++){const x=(hs(i,6)-0.5)*W*0.6,z=(hs(i,7)-0.5)*L*0.6,hh=H*(0.4+hs(i,8)*0.5);B(x,by+H*0.7+hh/2,z,W*0.12,hh,W*0.12,i%2?'!'+o.crystals:o.crystals2||o.crystals);B(x,by+H*0.7+hh+0.04,z,W*0.07,0.1,W*0.07,'!#ffffff')}
  const s=o.hs,hy=lh+H*0.32,hz0=L*0.5+s*0.55;B(0,hy-s*0.1,L*0.47,s*0.6,s*0.6,s*0.7,c);B(0,hy,hz0,s*0.9,s*0.72,s*0.85,c);B(0,hy-s*0.12,hz0+s*0.5,s*0.7,s*0.42,s*0.3,dk(c,1.1));B(0,hy-s*0.24,hz0+s*0.66,s*0.5,0.02,0.02,'#1a0a08');
  eyesAt(B,M,s*0.46,hy+s*0.1,hz0+s*0.2,s*0.22,o.eye||'#2a1a0a',true);
  B(0,lh+H*0.25,-L*0.5-0.05,s*0.3,s*0.25,0.16,c);
  const lw=o.lw||W*0.2;const LP=[0,1,2,3].map(i=>{const sg=i%2?-1:1;return[[sg*lw*0.3,-lh*0.45,0,lw*1.15,lh*1.0,lw*1.2,c],[sg*lw*0.35,-lh+0.03,lw*0.3,lw*1.3,0.06,lw*1.5,dk(c,0.9)],[sg*lw*0.35,-lh+0.02,lw*1.0,lw*1.0,0.04,lw*0.2,'#e8dcc8']]});
  return{parts:P,hd:{c:[0,hy,hz0],r:s*1.0},tz:-L*0.5,ty:lh+H*0.25,legs:[[W*0.36,lh,L*0.3,0],[-W*0.36,lh,L*0.3,1],[W*0.36,lh,-L*0.3,1],[-W*0.36,lh,-L*0.3,0]],lw,lh,lc:c,legP:i=>LP[i]}},
 frog(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,H=o.H,c=o.c,c2=o.c2||dk(c,1.35),c3=o.c3||dk(c,0.75),by=H*0.55;
  B(0,by,-L*0.05,W,H,L*0.8,c);B(0,by-H*0.32,0,W*0.86,H*0.32,L*0.78,c2);B(0,by+H*0.05,L*0.28,W*1.02,H*0.88,L*0.35,c);B(0,by+H*0.52,-L*0.08,W*0.6,0.04,L*0.6,c3);
  B(0,by-H*0.05,L*0.47,W*0.98,0.03,0.03,'#2a1010');B(0,by-H*0.2,L*0.44,W*0.8,H*0.22,0.04,c2);
  M(W*0.3,by+H*0.55,L*0.3,W*0.28,H*0.3,W*0.28,c);
  M(W*0.3,by+H*0.6,L*0.3+W*0.141,W*0.22,W*0.22,0.03,o.eye||'#e8c020');M(W*0.3,by+H*0.6,L*0.3+W*0.153,W*0.2,W*0.08,0.02,'#0a0806');M(W*0.26,by+H*0.66,L*0.3+W*0.16,W*0.05,W*0.05,0.015,'#ffffff');
  if(o.warts)for(let i=0;i<o.warts;i++)B((hs(i,1)-0.5)*W*0.9,by+H*0.5,(hs(i,2)-0.5)*L*0.7,W*0.08,0.05,W*0.08,i%2?c3:dk(c,1.18));
  if(o.glowSpots)for(let i=0;i<9;i++)B((hs(i,3)-0.5)*W*0.8,by+H*0.51,(hs(i,4)-0.5)*L*0.7,W*0.1,0.04,W*0.1,'!'+o.glowSpots);
  if(o.extra)o.extra(B,M,{L,W,H,by});
  // przednie nogi małe, tylne duże zgięte
  const lw=W*0.16,F=sg=>[[sg*lw*0.4,-H*0.12,0,lw,H*0.42,lw,c],[sg*lw*0.6,-H*0.36,lw*0.5,lw*1.5,0.05,lw*1.6,c2]],
   R=sg=>[[sg*lw*0.6,0,-lw*0.6,lw*1.4,H*0.55,L*0.32,c],[sg*lw*0.8,-H*0.25,L*0.08,lw*1.1,H*0.25,L*0.26,dk(c,0.92)],[sg*lw*1.0,-H*0.36,L*0.2,lw*2.0,0.05,lw*2.4,c2]];
  const LP=[F(1),F(-1),R(1),R(-1)];
  return{parts:P,hd:{c:[0,by+H*0.3,L*0.38],r:W*0.6},tz:-L*0.6,ty:by,legs:[[W*0.38,H*0.36,L*0.25,0],[-W*0.38,H*0.36,L*0.25,1],[W*0.46,H*0.36,-L*0.22,1],[-W*0.46,H*0.36,-L*0.22,0]],lw,lh:H*0.36,lc:c,legP:i=>LP[i],hop:1}},
 crab(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,H=o.H,c=o.c,c2=o.c2||dk(c,1.3),c3=o.c3||dk(c,0.75),lh=o.lh,by=lh+H/2;
  B(0,by,0,W,H,L,c);B(0,by+H*0.42,0,W*0.86,H*0.25,L*0.82,dk(c,1.08));B(0,by-H*0.4,0,W*0.9,H*0.22,L*0.85,c2);for(const k of [-0.25,0,0.25])B(k*W,by+H*0.56,-L*0.05,W*0.18,0.04,L*0.5,c3);
  M(W*0.48,by,0,W*0.08,H*0.6,L*0.7,c3);
  if(o.spikesTop)for(let i=0;i<o.spikesTop;i++){const x=(hs(i,1)-0.5)*W*0.8,z=(hs(i,2)-0.5)*L*0.7,hh=H*(0.25+hs(i,3)*0.35);B(x,by+H*0.55+hh/2,z,W*0.07,hh,W*0.07,o.spC||c3)}
  if(o.crystals)for(let i=0;i<6;i++){const x=(hs(i,4)-0.5)*W*0.7,z=(hs(i,5)-0.5)*L*0.6,hh=H*(0.4+hs(i,6)*0.6);B(x,by+H*0.55+hh/2,z,W*0.08,hh,W*0.08,i%2?o.crystals:'!'+o.crystals);B(x,by+H*0.55+hh+0.03,z,W*0.05,0.06,W*0.05,'!#ffffff')}
  if(o.glowCrack)for(let i=0;i<6;i++)B((hs(i,7)-0.5)*W*0.8,by+H*0.56,(hs(i,8)-0.5)*L*0.7,W*0.18,0.03,0.04,'!'+o.glowCrack);
  // oczy na słupkach, szczypce (w grupie głowy — unoszą się przy ataku)
  const ey=by+H*0.5,ez=L*0.45;for(const sg of [1,-1]){B(sg*W*0.14,ey+H*0.25,ez,W*0.05,H*0.5,W*0.05,c3);B(sg*W*0.14,ey+H*0.55,ez,W*0.1,W*0.1,W*0.1,'#1a1410');B(sg*W*0.12,ey+H*0.58,ez+W*0.04,W*0.03,W*0.03,0.02,'#ffffff')}
  B(0,by-H*0.1,L*0.5+0.02,W*0.3,H*0.25,0.05,c3);
  for(const sg of [1,-1]){const cs=o.claw||1,x0=sg*W*0.42;B(x0,by-H*0.05,L*0.6,W*0.12*cs,H*0.3*cs,L*0.3,c);B(x0+sg*W*0.05,by,L*0.85,W*0.22*cs,H*0.55*cs,L*0.32*cs,c);B(x0+sg*W*0.05,by+H*0.12*cs,L*1.08,W*0.18*cs,H*0.25*cs,L*0.26*cs,dk(c,1.1));B(x0+sg*W*0.05,by-H*0.16*cs,L*1.05,W*0.15*cs,H*0.18*cs,L*0.22*cs,dk(c,0.9));B(x0+sg*W*0.05,by+H*0.12*cs,L*1.22,W*0.12*cs,H*0.15*cs,0.04,o.tip||c3)}
  if(o.extra)o.extra(B,M,{L,W,H,lh,by});
  const lc=o.lc||c,legs=[],LP=[];for(let k=0;k<3;k++)for(const sg of [1,-1]){legs.push([sg*W*0.45,lh+H*0.1,L*(0.25-k*0.25),(k+(sg>0?0:1))%2]);LP.push(arth(sg,W*0.7,lh,W*0.055,lc,dk(lc,0.85),c3,L*(0.35-k*0.35),0.45))}
  return{parts:P,hd:{c:[0,by,L*0.95],r:W*0.6},tz:-L*5,ty:-9,legs,lw:W*0.07,lh,lc,legP:i=>LP[i]}},
 scorp(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,H=o.H,c=o.c,c2=o.c2||dk(c,1.25),c3=o.c3||dk(c,0.72),lh=o.lh,by=lh+H/2;
  for(let i=0;i<5;i++){const z=L*0.35-i*L*0.19,w=W*(1-Math.abs(i-1.5)*0.08);B(0,by,z,w,H,L*0.17,i%2?c:dk(c,1.06));B(0,by+H*0.45,z,w*0.8,H*0.15,L*0.15,c3);B(0,by-H*0.4,z,w*0.85,H*0.2,L*0.16,c2)}
  if(o.glass)for(let i=0;i<5;i++)B(0,by+H*0.56,L*0.35-i*L*0.19,W*0.3,0.04,L*0.1,'!'+o.glass);
  const s=W*0.62,hy=by+H*0.05,hz0=L*0.55;B(0,hy,hz0,s,H*0.85,s*0.7,c);M(s*0.2,hy+H*0.4,hz0+s*0.2,s*0.1,s*0.1,0.03,'#0a0806');M(s*0.08,hy+H*0.42,hz0+s*0.28,s*0.07,s*0.07,0.03,'#0a0806');
  M(s*0.2,hy-H*0.3,hz0+s*0.42,s*0.12,H*0.25,s*0.2,c3);
  for(const sg of [1,-1]){const x0=sg*W*0.45;B(x0,hy,hz0+L*0.05,W*0.14,H*0.4,L*0.22,c);B(x0+sg*W*0.12,hy,hz0+L*0.22,W*0.14,H*0.4,L*0.16,c);B(x0+sg*W*0.15,hy+H*0.05,hz0+L*0.38,W*0.3,H*0.6,L*0.24,dk(c,1.08));B(x0+sg*W*0.08,hy+H*0.15,hz0+L*0.56,W*0.12,H*0.3,L*0.18,c3);B(x0+sg*W*0.24,hy-H*0.05,hz0+L*0.55,W*0.1,H*0.25,L*0.16,c3)}
  // ogon łukiem nad grzbiet
  const tz0=-L*0.5-0.01,ty=by;const R=L*0.36,n=9;let ly=0,lz=0;for(let i=0;i<n;i++){const a=i/(n-1)*Math.PI*0.93,y=ty+R-R*Math.cos(a),z=tz0-0.04-R*Math.sin(a)*0.95,w=W*(0.44-i*0.022);B(0,y,z,w,w*0.95,w*1.15,i%2?c:dk(c,1.07));B(0,y+w*0.42,z,w*0.7,w*0.18,w*1.1,c3);if(o.glass)B(0,y,z,w*0.4,w*0.4,w*1.17,'!'+o.glass);ly=y;lz=z}
  B(0,ly+W*0.12,lz-W*0.05,W*0.36,W*0.34,W*0.4,o.bulb||dk(c,1.15));B(0,ly+W*0.05,lz-W*0.2,W*0.08,W*0.18,W*0.08,'#1a1010');B(0,ly-W*0.04,lz-W*0.26,W*0.06,W*0.1,W*0.06,'#1a1010');
  if(o.extra)o.extra(B,M,{L,W,H,lh,by});
  const legs=[],LP=[];for(let k=0;k<4;k++)for(const sg of [1,-1]){legs.push([sg*W*0.45,lh+H*0.1,L*(0.25-k*0.17),(k+(sg>0?0:1))%2]);LP.push(arth(sg,W*0.75,lh,W*0.05,c,c3,c3,L*(0.25-k*0.17),0.4))}
  return{parts:P,hd:{c:[0,hy,hz0+L*0.3],r:L*0.32},tz:tz0,ty:ty-0.6+0.01,legs,lw:W*0.07,lh,lc:c,legP:i=>LP[i]}},
 bug(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,H=o.H,c=o.c,c2=o.c2||dk(c,1.25),c3=o.c3||dk(c,0.7),lh=o.lh,by=lh+H/2;
  if(o.type==='beetle'){B(0,by,-L*0.08,W,H,L*0.66,c);B(0,by+H*0.35,-L*0.08,W*0.92,H*0.4,L*0.62,dk(c,1.1));B(0,by+H*0.56,-L*0.08,0.03,0.03,L*0.64,c3);B(0,by-H*0.35,-L*0.06,W*0.8,H*0.3,L*0.6,c2);M(W*0.25,by+H*0.56,-L*0.12,W*0.18,0.03,L*0.35,dk(c,1.25));
   B(0,by-H*0.02,L*0.3,W*0.78,H*0.75,L*0.18,dk(c,0.92));if(o.amber){for(let i=0;i<5;i++)B((hs(i,1)-0.5)*W*0.7,by+H*0.58,(hs(i,2)-0.6)*L*0.5,W*0.14,0.04,W*0.14,'!'+o.amber)}}
  if(o.type==='bee'){for(let i=0;i<4;i++)B(0,by-H*0.05*i,-L*0.12-i*L*0.13,W*(0.95-i*0.12),H*(0.95-i*0.12),L*0.14,i%2?c3:c);B(0,by-H*0.2,-L*0.66,W*0.08,W*0.08,L*0.12,'#1a1010');B(0,by+H*0.12,L*0.14,W*0.7,H*0.72,L*0.24,o.thorax||'#e8b830');B(0,by+H*0.48,L*0.14,W*0.5,0.05,L*0.2,dk(o.thorax||'#e8b830',1.15))}
  if(o.type==='moth'){B(0,by,-L*0.2,W*0.7,H*0.7,L*0.55,c);for(let i=0;i<3;i++)B(0,by-H*0.05,-L*0.12-i*L*0.15,W*0.74,0.04,L*0.04,c3);B(0,by+H*0.1,L*0.18,W*0.78,H*0.8,L*0.24,o.thorax||dk(c,1.2));B(0,by+H*0.05,L*0.26,W*0.9,H*0.5,L*0.12,o.thorax||dk(c,1.2))}
  const s=o.hs||W*0.55,hy=by+H*0.05,hz0=L*0.42;B(0,hy,hz0,s,s*0.85,s*0.7,o.hc||c3);
  if(o.compound){M(s*0.42,hy+s*0.1,hz0+s*0.1,s*0.28,s*0.5,s*0.42,o.compound);M(s*0.5,hy+s*0.22,hz0+s*0.18,0.02,s*0.12,s*0.12,'#ffffff')}else{M(s*0.3,hy+s*0.15,hz0+s*0.36,s*0.16,s*0.16,0.03,o.eye||'#0a0806');M(s*0.26,hy+s*0.2,hz0+s*0.37,s*0.05,s*0.05,0.02,'#ffffff')}
  if(o.mand)for(const sg of [1,-1]){B(sg*s*0.25,hy-s*0.3,hz0+s*0.5,s*0.12,s*0.12,s*0.4,c3);B(sg*s*0.14,hy-s*0.3,hz0+s*0.72,s*0.18,s*0.1,s*0.1,c3)}
  if(o.horn){B(0,hy+s*0.2,hz0+s*0.45,s*0.18,s*0.18,s*0.5,c3);B(0,hy+s*0.45,hz0+s*0.7,s*0.14,s*0.5,s*0.14,c3);B(0,hy+s*0.7,hz0+s*0.6,s*0.1,s*0.1,s*0.2,c3)}
  for(const sg of [1,-1]){const fe=o.feather;B(sg*s*0.22,hy+s*0.55,hz0+s*0.2,s*0.06,s*0.5,s*0.06,'#1a1010');B(sg*s*0.32,hy+s*0.88,hz0+s*0.35,s*0.06,s*0.06,s*0.4,'#1a1010');if(fe){for(let i=0;i<3;i++)B(sg*s*0.32,hy+s*0.88,hz0+s*0.25+i*s*0.12,s*0.25,s*0.04,s*0.04,fe)}}
  if(o.sting)B(0,by-H*0.3,-L*0.72,W*0.06,W*0.06,L*0.14,'#1a1010');
  if(o.fuzz)for(let i=0;i<10;i++)B((hs(i,6)-0.5)*W*0.7,by+H*(0.3+hs(i,7)*0.2),L*(hs(i,8)*0.4-0.3),W*0.1,H*0.12,W*0.1,o.fuzz);
  if(o.extra)o.extra(B,M,{L,W,H,lh,by,s,hy,hz0});
  let wingP=null,wingAt=null,wingK='buzz',wingMat=null;
  if(o.type==='bee'){wingP=[[W*0.55,0,-L*0.05,W*1.1,0.03,L*0.4,'#e8f4ff'],[W*0.45,0,-L*0.3,W*0.8,0.03,L*0.25,'#e8f4ff'],[W*0.6,0.005,-L*0.08,W*0.9,0.02,0.02,'#8a9aa8']];wingAt=[W*0.2,by+H*0.48,L*0.1];wingMat='glass'}
  if(o.type==='moth'){const wc=o.wc||c,wc2=o.wc2||dk(c,0.7),wc3=o.wc3||'#f2e6c8';wingP=[[W*1.0,0,L*0.05,W*1.6,0.04,L*0.7,wc],[W*0.9,0.01,-L*0.42,W*1.3,0.04,L*0.45,wc2],[W*1.25,0.03,L*0.1,W*0.45,0.02,W*0.45,wc3],[W*1.25,0.04,L*0.1,W*0.22,0.02,W*0.22,'#1a1010'],[W*0.85,0.03,-L*0.42,W*0.35,0.02,W*0.35,wc3],[W*1.75,0.02,L*0.05,W*0.12,0.03,L*0.66,wc2]];if(o.wglow)wingP.push([W*1.25,0.05,L*0.1,W*0.12,0.02,W*0.12,'!'+o.wglow]);wingAt=[W*0.3,by+H*0.38,L*0.05];wingK='flap'}
  const legs=[],LP=[];for(let k=0;k<3;k++)for(const sg of [1,-1]){legs.push([sg*W*0.42,lh+H*0.05,L*(0.2-k*0.2),(k+(sg>0?0:1))%2]);LP.push(arth(sg,W*0.7,lh,W*0.045,o.lc||c3,o.lc||c3,'#1a1010',L*(0.3-k*0.3),0.4))}
  return{parts:P,hd:{c:[0,hy,hz0],r:s*1.0},tz:-L*5,ty:-9,legs,lw:W*0.06,lh,lc:c3,legP:i=>LP[i],wingP,wingAt,wingK,wingMat,hop:0}},
 spider(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,H=o.H,c=o.c,c2=o.c2||dk(c,1.3),c3=o.c3||dk(c,0.7),lh=o.lh,by=lh+H/2;
  B(0,by+H*0.2,-L*0.25,W,H*1.1,L*0.55,c);B(0,by+H*0.72,-L*0.25,W*0.8,0.05,L*0.48,dk(c,1.1));if(o.mark)for(let i=0;i<3;i++)B(0,by+H*0.77,-L*0.12-i*L*0.13,W*(0.5-i*0.1),0.03,L*0.08,o.mark);
  B(0,by,L*0.12,W*0.68,H*0.7,L*0.32,dk(c,0.9));
  const s=W*0.48,hy=by+H*0.05,hz0=L*0.35;B(0,hy,hz0,s,s*0.75,s*0.6,c);
  const ec=o.eye||'#c82a1a';for(const [x,y,sz] of [[0.18,0.2,0.16],[-0.18,0.2,0.16],[0.32,0.32,0.1],[-0.32,0.32,0.1],[0.1,0.36,0.08],[-0.1,0.36,0.08]])B(x*s,hy+y*s,hz0+s*0.31,sz*s,sz*s,0.03,o.glowEye?'!'+ec:ec);
  for(const sg of [1,-1]){B(sg*s*0.18,hy-s*0.35,hz0+s*0.35,s*0.14,s*0.4,s*0.14,c3);B(sg*s*0.18,hy-s*0.6,hz0+s*0.4,s*0.08,s*0.14,s*0.08,'#e8dcc8')}
  if(o.plates)for(let i=0;i<6;i++)B((hs(i,1)-0.5)*W*0.7,by+H*0.76,-L*0.25+(hs(i,2)-0.5)*L*0.4,W*0.2,0.04,W*0.2,o.plates);
  if(o.rivets)for(let i=0;i<10;i++){const a=i/10*Math.PI*2;B(Math.cos(a)*W*0.5,by+H*0.2,-L*0.25+Math.sin(a)*L*0.27,0.04,0.04,0.04,o.rivets)}
  if(o.core)B(0,by+H*0.2,-L*0.53,W*0.3,W*0.3,0.04,'!'+o.core);
  if(o.extra)o.extra(B,M,{L,W,H,lh,by,s,hy,hz0});
  const legs=[],LP=[];for(let k=0;k<4;k++)for(const sg of [1,-1]){legs.push([sg*W*0.32,lh+H*0.15,L*(0.2-k*0.1),(k+(sg>0?0:1))%2]);LP.push(arth(sg,W*1.5,lh,W*0.06,o.lc||c3,o.knee||c,o.tipC||c3,L*(0.55-k*0.36),0.75))}
  return{parts:P,hd:{c:[0,hy,hz0],r:s*1.0},tz:-L*5,ty:-9,legs,lw:W*0.08,lh,lc:c3,legP:i=>LP[i]}},
 snake(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,c=o.c,c2=o.c2||dk(c,1.3),c3=o.c3||dk(c,0.7),n=14;
  const s=o.hs,hy=W*0.6+s*0.2,hz0=L*0.45;
  for(let i=0;i<n;i++){const t=i/(n-1),z=hz0-s*0.5-t*L*0.95,x=Math.sin(t*Math.PI*2.2)*L*0.07,w=W*(1-0.7*t*t);B(x,w/2,z,w,w*0.95,L/n*1.15,(o.bands&&i%3===1)?o.bands:c);B(x,w*0.08,z,w*0.82,w*0.16,L/n*1.1,c2);if(o.diam&&i%2===0)B(x,w*0.97,z,w*0.45,0.03,L/n*0.6,o.diam)}
  B(0,hy,hz0,s*1.0,s*0.6,s*1.0,c);B(0,hy-s*0.05,hz0+s*0.65,s*0.8,s*0.45,s*0.45,c);B(0,hy-s*0.26,hz0+s*0.5,s*0.85,s*0.15,s*0.8,c2);B(0,hy-s*0.18,hz0+s*0.88,s*0.6,0.02,0.02,'#1a0a08');
  eyesAt(B,M,s*0.5,hy+s*0.12,hz0+s*0.25,s*0.22,o.eye||'#e8c020',true);B(0,hy-s*0.3,hz0+s*1.0,s*0.06,s*0.04,s*0.2,'#c82a2a');M(s*0.04,hy-s*0.3,hz0+s*1.12,s*0.04,s*0.03,s*0.1,'#c82a2a');
  if(o.extra)o.extra(B,M,{L,W,s,hy,hz0});
  return{parts:P,hd:{c:[0,hy,hz0+s*0.3],r:s*0.85},tz:hz0-s*0.55,ty:0.6,legs:[],lw:0.1,lh:0.1,lc:c,legP:()=>[]}}
};
Object.assign(FIT,{"bazyliszek":[1.062,3.998],"piskle_baz":[0.613,2.307],"krokodyl":[1.145,5.937],"waran":[0.712,3.717],"salamandra":[0.532,2.135],"skalny_jaszczur":[0.882,2.755],"teczowy_jaszczur":[0.882,2.755],"pradawny_bazyliszek":[4.778,17.989],"lawowy_zolw":[1.304,2.14],"zolw_kr":[1.673,1.94],"ropucha":[0.954,1.523],"swiecaca_zaba":[0.782,1.056],"dusiciel":[0.38,3.98],"krab":[1.0,1.394],"bazaltowy_krab":[1.377,1.445],"solny_krab":[1.131,1.105],"skorpion":[1.487,2.256],"szklany_skorpion":[1.487,2.256],"zuk":[1.155,2.16],"bursztynowy_zuk":[1.092,1.87],"pszczola":[1.282,1.42],"cma":[1.162,1.03],"mech_pajak":[1.528,2.072],"pajak_jadowy":[1.062,1.68]});
Object.assign(SPEC,{
 bazyliszek:{kind:'lizard',L:1.6,W:0.62,H:0.5,lh:0.28,c:'#3e7a3a',c2:'#c8c890',c3:'#2a4a24',hs:0.42,sl:0.38,eye:'#ffd030',glowEye:'#ffe060',spines:14,spC:'#8a2a1a',crest:'#c83a1a',horns:1,hornC:'#e8dcc0',teeth:1,scales:16,tl:1.7,claw:'#e8dcc0'},
 piskle_baz:{kind:'lizard',L:0.8,W:0.36,H:0.32,lh:0.18,c:'#5a9a4a',c2:'#e8e4b0',c3:'#3a6a30',hs:0.32,sl:0.18,eye:'#ffd030',spines:8,spC:'#c86a3a',crest:'#e86a3a',scales:8,tl:0.8,headUp:0.04},
 krokodyl:{kind:'lizard',L:2.2,W:0.8,H:0.42,lh:0.22,c:'#4a5a2e',c2:'#c8c090',c3:'#2e3a1c',hs:0.42,sl:0.9,eye:'#d8b020',teeth:1,plates:12,plC:'#3a4824',scales:20,tl:2.3,claw:'#2e3a1c'},
 waran:{kind:'lizard',L:1.4,W:0.5,H:0.34,lh:0.24,c:'#6a5a3e',c2:'#b8a880',c3:'#4a3e2a',hs:0.32,sl:0.36,eye:'#d8a020',scales:24,tl:1.8,stripes:6,sc:'#8a7a54',claw:'#2a2018',extra:(B,M,g)=>{B(0,g.hy-g.s*0.32,g.hz0+g.s*0.9,g.s*0.06,0.02,g.s*0.5,'#e8c040')}},
 salamandra:{kind:'lizard',L:0.85,W:0.28,H:0.2,lh:0.14,c:'#1a1a1a',c2:'#2a2a2a',c3:'#0a0a0a',hs:0.24,sl:0.12,eye:'#1a1a1a',tl:0.95,claw:'#1a1a1a',extra:(B,M,g)=>{for(let i=0;i<9;i++)B((hs(i,9)-0.5)*g.W*0.7,g.by+g.H*0.52,(hs(i,10)-0.5)*g.L*0.85,g.W*0.2,0.03,g.W*0.24,'!#ffb020');M(g.s*0.3,g.hy+g.s*0.33,g.hz0,g.s*0.25,0.03,g.s*0.3,'!#ffb020')}},
 skalny_jaszczur:{kind:'lizard',L:1.1,W:0.5,H:0.36,lh:0.26,c:'#7a7a72',c2:'#a8a89c',c3:'#5a5a52',hs:0.34,sl:0.26,eye:'#e8a020',plates:9,plC:'#6a6a62',spines:9,spC:'#8a8a80',tl:1.15,club:'#6a6a62',claw:'#3a3a34',extra:(B,M,g)=>{for(let i=0;i<5;i++)B((hs(i,11)-0.5)*g.W*0.6,g.by+g.H*0.56,(hs(i,12)-0.5)*g.L*0.6,g.W*0.15,0.05,g.W*0.15,'#5f7a3a')}},
 teczowy_jaszczur:{kind:'lizard',L:1.1,W:0.46,H:0.34,lh:0.26,c:'#2a8ac8',c2:'#e8f0ff',c3:'#1a5a8a',hs:0.34,sl:0.26,eye:'#ffd030',crest:'#e83a8a',frill:'#e8c020',tl:1.25,tailRings:'#e8402a',stripes:6,sc:'#7ad83a',claw:'#1a3a5a'},
 pradawny_bazyliszek:{kind:'lizard',L:1.6,W:0.66,H:0.54,lh:0.3,c:'#2a4a2a',c2:'#8a8a60',c3:'#1a2a18',hs:0.46,sl:0.42,eye:'#ff5a20',glowEye:'#ff7a30',spines:16,spC:'#5a1a10',crest:'#8a1a10',horns:1,hornC:'#c8bca0',teeth:1,scales:18,plates:10,plC:'#3a5a34',tl:1.8,claw:'#c8bca0'},
 lawowy_zolw:{kind:'turtle',L:1.3,W:1.1,H:0.62,lh:0.24,c:'#5a4a3a',shell:'#3a3430',shell2:'#2a2420',plast:'#4a3a2a',hs:0.38,eye:'#ff8a20',crack:'#ff7a1a',lw:0.22},
 zolw_kr:{kind:'turtle',L:1.25,W:1.05,H:0.6,lh:0.24,c:'#6a8a6a',shell:'#4a6a8a',shell2:'#3a5070',plast:'#c8d0b0',hs:0.36,eye:'#1a1a1a',crystals:'#9ae0ff',crystals2:'#c8a0ff',lw:0.22},
 ropucha:{kind:'frog',L:0.95,W:0.82,H:0.52,c:'#6a7a3a',c2:'#d8d0a0',c3:'#4a5428',eye:'#e8b020',warts:18},
 swiecaca_zaba:{kind:'frog',L:0.8,W:0.66,H:0.44,c:'#2a8a5a',c2:'#c8f0d8',c3:'#1a5a3a',eye:'#ffd030',glowSpots:'#7affd0'},
 dusiciel:{kind:'snake',L:3.2,W:0.3,hs:0.3,c:'#6a7a3a',c2:'#d8d0a0',c3:'#3a4a20',diam:'#3a2a18',bands:'#8a7a4a',eye:'#e8c020'},
 krab:{kind:'crab',L:0.75,W:1.0,H:0.38,lh:0.32,c:'#c8402a',c2:'#f2c8a0',c3:'#8a2414',tip:'#2a1410',lc:'#d8583a'},
 bazaltowy_krab:{kind:'crab',L:0.8,W:1.2,H:0.48,lh:0.38,c:'#3a3634',c2:'#5a5450',c3:'#1e1c1a',spikesTop:10,spC:'#2a2624',glowCrack:'#ff6a1a',claw:1.15,tip:'#ff7a2a',lc:'#2e2a28'},
 solny_krab:{kind:'crab',L:0.75,W:1.05,H:0.42,lh:0.34,c:'#e8e0d4',c2:'#ffffff',c3:'#b8aca0',crystals:'#ffffff',lc:'#d8cec0',tip:'#8a7a6a'},
 skorpion:{kind:'scorp',L:1.3,W:0.62,H:0.3,lh:0.3,c:'#3a2a1e',c2:'#6a5440',c3:'#1e140c',bulb:'#8a5a2a'},
 szklany_skorpion:{kind:'scorp',L:1.3,W:0.62,H:0.3,lh:0.3,c:'#a8d8e8',c2:'#e8f8ff',c3:'#6aa8c0',bulb:'#e8f8ff',glass:'#bff4ff'},
 zuk:{kind:'bug',type:'beetle',L:1.4,W:0.85,H:0.5,lh:0.32,c:'#2a3a5a',c2:'#1a2234',c3:'#0e1420',horn:1,eye:'#e8c020'},
 bursztynowy_zuk:{kind:'bug',type:'beetle',L:1.3,W:0.82,H:0.48,lh:0.3,c:'#c88a2a',c2:'#8a5a14',c3:'#3a2410',mand:1,amber:'#ffc040'},
 pszczola:{kind:'bug',type:'bee',L:1.2,W:0.6,H:0.58,lh:0.3,c:'#e8b830',c3:'#1a1410',thorax:'#5a4020',compound:'#1a1410',sting:1,fuzz:'#f2d070',hs:0.38},
 cma:{kind:'bug',type:'moth',L:0.8,W:0.36,H:0.34,lh:0.22,c:'#c8b898',c3:'#8a7a5a',thorax:'#e8dcc4',compound:'#2a1a10',feather:'#c8b898',wc:'#b8a88a',wc2:'#8a7a5c',wc3:'#efe2c4',wglow:'#bfe8ff',fuzz:'#efe6d0',hs:0.26},
 mech_pajak:{kind:'spider',L:1.3,W:0.95,H:0.5,lh:0.42,c:'#8a7a5a',c2:'#b8a880',c3:'#4a4034',eye:'#ff3a1a',glowEye:1,plates:'#c8a040',rivets:'#e8d080',core:'#ffb020',knee:'#c8a040',tipC:'#3a3430'},
 pajak_jadowy:{kind:'spider',L:1.1,W:0.85,H:0.46,lh:0.36,c:'#2a1a2a',c2:'#4a2a4a',c3:'#140c14',eye:'#c82a1a',mark:'#8aff3a',lc:'#1e121e',knee:'#5a3a5a',tipC:'#8aff3a'}
});

// ---- v128 cz.3: golemy, szlamy, ptaki, latające i pozostałe ----
Object.assign(BUILD,{
 golem(o){const P=[],{B,M}=MR(P),c=o.c,c2=o.c2||dk(c,1.15),c3=o.c3||dk(c,0.78),W=o.W,H=o.H,lh=o.lh,D=o.D||W*0.55,by=lh+H/2;
  B(0,lh+H*0.12,0,W*0.7,H*0.3,D*0.85,c3);B(0,by+H*0.12,0,W,H*0.75,D,c);B(0,by+H*0.3,D*0.08,W*0.92,H*0.42,D*0.95,c2);B(0,by-H*0.02,D*0.5,W*0.5,H*0.3,0.06,c3);
  M(W*0.52,by+H*0.42,0,W*0.36,H*0.32,D*1.05,c2);M(W*0.56,by+H*0.6,0,W*0.24,H*0.12,D*0.8,dk(c2,1.08));
  if(o.cracks)for(let i=0;i<8;i++)B((hs(i,1)-0.5)*W*0.8,by+(hs(i,2)-0.4)*H*0.8,D*0.505,W*0.05+hs(i,3)*W*0.1,0.05,0.03,'!'+o.cracks);
  if(o.core)B(0,by+H*0.22,D*0.51,W*0.24,W*0.24,0.05,'!'+o.core);
  if(o.moss)for(let i=0;i<7;i++)B((hs(i,4)-0.5)*W*1.0,by+H*0.48+hs(i,5)*H*0.12,(hs(i,6)-0.5)*D*0.9,W*0.24,0.08,W*0.2,o.moss);
  if(o.rust)for(let i=0;i<10;i++)B((hs(i,7)-0.5)*W*0.95,by+(hs(i,8)-0.4)*H*0.9,(i%2?1:-1)*D*0.505,W*0.12,W*0.1,0.03,o.rust);
  if(o.rivets)for(let i=0;i<8;i++)M(W*(0.15+0.1*(i%4)),by+H*(0.4-0.2*Math.floor(i/4)),D*0.505,0.05,0.05,0.03,o.rivets);
  if(o.crystals)for(let i=0;i<6;i++){const x=(hs(i,9)-0.5)*W*0.9,hh=H*(0.25+hs(i,10)*0.3);B(x,by+H*0.55+hh/2,(hs(i,11)-0.5)*D*0.6,W*0.12,hh,W*0.12,i%2?o.crystals:'!'+o.crystals)}
  const s=o.hs||W*0.38,hy=by+H*0.5+s*0.2,hz0=D*0.15;B(0,hy,hz0,s,s*0.85,s*0.9,c2);B(0,hy+s*0.32,hz0+s*0.08,s*1.08,s*0.22,s*0.95,c3);B(0,hy-s*0.2,hz0+s*0.42,s*0.6,s*0.26,0.05,c3);
  M(s*0.22,hy+s*0.05,hz0+s*0.46,s*0.24,s*0.14,0.05,'!'+(o.eye||'#7fe3ff'));if(o.horns)M(s*0.45,hy+s*0.5,hz0,s*0.16,s*0.5,s*0.16,o.horns);
  if(o.extra)o.extra(B,M,{W,H,lh,D,by,s,hy,hz0});
  const lw=o.lw||W*0.3,aw=o.aw||W*0.32,al=o.al||H*1.05;
  const leg=sg=>[[0,-lh*0.45,0,lw,lh*0.95,lw*1.05,c],[0,-lh*0.2,0,lw*1.12,lh*0.25,lw*1.15,c3],[0,-lh+0.08,lw*0.15,lw*1.25,0.16,lw*1.45,c3]],
   arm=sg=>[[0,-al*0.22,0,aw*1.05,al*0.45,aw*1.05,c],[0,-al*0.55,0,aw*0.95,al*0.3,aw*0.95,c2],[0,-al*0.85,aw*0.05,aw*1.35,al*0.3,aw*1.35,o.fist||c3],...(o.armX?o.armX(sg,aw,al):[])];
  const sy=by+H*0.38;return{parts:P,hd:{c:[0,hy,hz0],r:s*1.05},tz:-99,ty:-99,legs:[[W*0.26,lh,0,0],[-W*0.26,lh,0,1],[W*0.5+aw*0.55,sy,0,1],[-W*0.5-aw*0.55,sy,0,0]],lw,lh,lc:c,legP:i=>i<2?leg(i?-1:1):arm(i===2?1:-1)}},
 blob(o){const P=[],{B,M}=MR(P),c=o.c,c2=o.c2||dk(c,1.25),c3=o.c3||dk(c,0.75),R=o.R;
  B(0,R*0.45,0,R*2,R*0.9,R*2,c);B(0,R*1.05,0,R*1.7,R*0.5,R*1.7,c2);B(0,R*1.42,0,R*1.1,R*0.3,R*1.1,dk(c2,1.08));B(0,R*0.06,0,R*2.15,R*0.12,R*2.15,c3);
  for(const [x,z] of [[0.95,0.4],[-0.9,-0.5],[0.3,-0.95],[-0.5,0.9]])B(x*R,R*0.25,z*R,R*0.4,R*0.5,R*0.4,c);
  B(R*0.45,R*1.4,R*0.3,R*0.25,R*0.12,R*0.25,'#ffffff');B(R*0.6,R*1.2,R*0.6,R*0.12,R*0.1,R*0.12,'#ffffff');
  M(R*0.38,R*1.0,R*0.99,R*0.36,R*0.42,0.04,'#f2ece0');M(R*0.38,R*0.97,R*1.005,R*0.2,R*0.3,0.03,o.eye||'#1a1a1a');M(R*0.32,R*1.08,R*1.01,R*0.08,R*0.08,0.02,'#ffffff');
  B(0,R*0.62,R*1.0,R*0.7,R*0.16,0.04,o.mouth||'#1a1010');B(0,R*0.68,R*1.005,R*0.5,R*0.06,0.03,'#c84a4a');
  if(o.bits)for(let i=0;i<6;i++)B((hs(i,1)-0.5)*R*1.2,R*(0.4+hs(i,2)*0.7),(hs(i,3)-0.5)*R*1.2,R*0.22,R*0.22,R*0.22,o.bits[i%o.bits.length]);
  if(o.drips)for(let i=0;i<8;i++){const a=i/8*Math.PI*2;B(Math.cos(a)*R*0.98,R*0.3,Math.sin(a)*R*0.98,R*0.14,R*0.45,R*0.14,o.drips)}
  if(o.glow)for(let i=0;i<5;i++)B((hs(i,4)-0.5)*R*1.5,R*(1.2+hs(i,5)*0.25),(hs(i,6)-0.5)*R*1.5,R*0.14,0.04,R*0.14,'!'+o.glow);
  return{parts:P,hd:{c:[0,9,9],r:0.01},tz:-99,ty:-99,legs:[],lw:0.1,lh:0.1,lc:c,legP:()=>[],hop:1}},
 bird(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,H=o.H,lh=o.lh,c=o.c,c2=o.c2||dk(c,1.25),c3=o.c3||dk(c,0.75),by=lh+H/2;
  B(0,by,0,W,H,L,c);B(0,by-H*0.1,L*0.18,W*0.92,H*0.9,L*0.45,o.breast||c2);B(0,by+H*0.42,-L*0.05,W*0.8,H*0.2,L*0.8,c3);
  const na=o.neckA??1.2,nl=o.neckL??H*0.35,nw=o.neckW??W*0.55,nn=Math.max(3,Math.ceil(nl/(nw*0.75)));for(let i=0;i<nn+1;i++){const t=i/nn;B(0,by+H*0.25+Math.sin(na)*nl*t,L*0.38+Math.cos(na)*nl*t,nw,nw*1.1,nw,o.neckC||o.hc||c)}
  const s=o.hs,hy=by+H*0.25+Math.sin(na)*nl+s*0.25,hz0=L*0.38+Math.cos(na)*nl+s*0.1,hc=o.hc||c;
  B(0,hy,hz0,s*0.9,s*0.85,s,hc);const bl=o.bl??s*0.6,bc=o.beak||'#e8b830';B(0,hy-s*0.02,hz0+s*0.5+bl*0.4,s*0.42,s*0.36,bl*0.8,bc);B(0,hy-s*0.12,hz0+s*0.5+bl*0.85,s*0.26,s*0.28,bl*0.3,dk(bc,0.85));if(o.duck)B(0,hy-s*0.12,hz0+s*0.5+bl*0.5,s*0.56,s*0.14,bl,bc);
  M(s*0.08,hy+s*0.06,hz0+s*0.5+bl*0.45,s*0.05,s*0.05,0.02,'#1a1010');
  eyesAt(B,M,s*0.455,hy+s*0.12,hz0+s*0.18,s*0.24,o.eye||'#e8a020',true);M(s*0.44,hy+s*0.3,hz0+s*0.15,s*0.12,s*0.08,s*0.35,dk(hc,0.7));
  if(o.crest)for(let i=0;i<3;i++)B(0,hy+s*0.5+i*s*0.12,hz0-s*0.1-i*s*0.1,s*0.06,s*0.2,s*0.06,o.crest);
  if(o.crestBall)for(const x of [-0.12,0,0.12])B(x*s,hy+s*0.8,hz0,s*0.1,s*0.1,s*0.1,o.crestBall);
  // ogon z piór
  const tz0=-L/2-0.01,ty=by+H*0.15;
  if(o.fan){const n=9;for(let i=0;i<n;i++){const a=-1.2+i*(2.4/(n-1)),r=o.fan;for(let k=0;k<3;k++){const rr=r*(0.4+k*0.3);B(Math.sin(a)*rr,ty+Math.cos(a)*rr*0.9+H*0.2,tz0-0.06-k*0.02,r*0.18,r*0.3,0.04,k===2?(o.fanC2||'#2a6ac8'):(o.fanC||'#2a8a4a'))}B(Math.sin(a)*r*1.0,ty+Math.cos(a)*r*0.9+H*0.2,tz0-0.09,r*0.1,r*0.1,0.03,'#e8c020')}}
  else{for(let i=0;i<3;i++)B((i-1)*W*0.2,ty-H*0.05,tz0-(o.tl||L*0.35)/2,W*0.22,H*0.1,o.tl||L*0.35,i===1?(o.tc||c3):dk(o.tc||c3,1.1))}
  if(o.extra)o.extra(B,M,{L,W,H,lh,by,s,hy,hz0,ty,tz0});
  let wingP=null;if(o.wing!==0){const ws=o.ws||1,wc=o.wc||c3,wl=L*0.85*ws;wingP=[[W*0.5*ws,0,0,W*1.0*ws,H*0.12,wl*0.75,wc],[W*1.3*ws,-0.01,-wl*0.06,W*0.9*ws,H*0.1,wl*0.6,dk(wc,0.95)],[W*2.0*ws,-0.02,-wl*0.12,W*0.7*ws,H*0.08,wl*0.42,o.tipC||dk(wc,0.75)]];for(let i=0;i<4;i++)wingP.push([W*(0.6+i*0.45)*ws,-0.03,-wl*0.42-i*0.01,W*0.32*ws,H*0.06,wl*0.22,o.tipC||dk(wc,0.75)])}
  const lw=o.lw||W*0.12,lc=o.lc||'#e8b830',leg=sg=>[[0,-lh*0.15,0,lw*1.6,lh*0.35,lw*1.8,c],[0,-lh*0.62,0,lw,lh*0.75,lw,lc],[0,-lh+0.03,lw*0.8,lw*0.7,0.05,lw*2.4,lc],[sg*lw*0.9,-lh+0.03,lw*0.6,lw*0.6,0.05,lw*1.8,lc],[-sg*lw*0.9,-lh+0.03,lw*0.6,lw*0.6,0.05,lw*1.8,lc],[0,-lh+0.03,-lw*0.8,lw*0.6,0.05,lw*1.2,lc]];
  return{parts:P,hd:{c:[0,hy,hz0],r:s*1.0},tz:tz0,ty:ty-0.4,legs:[[W*0.25,lh,0,0],[-W*0.25,lh,0,1]],lw,lh,lc,legP:i=>leg(i?-1:1),wingP,wingAt:wingP?[W*0.42,by+H*0.3,L*0.05]:null,wingK:o.wingK||'flap'}},
 bat(o){const P=[],{B,M}=MR(P),c=o.c,c2=o.c2||dk(c,1.25),c3=o.c3||dk(c,0.75),W=o.W,H=o.H,lh=o.lh,by=lh+H/2;
  B(0,by,0,W,H,W*1.1,c);B(0,by-H*0.1,W*0.3,W*0.8,H*0.7,W*0.5,c2);const s=o.hs,hy=by+H*0.5+s*0.3,hz0=W*0.15;B(0,hy,hz0,s,s*0.85,s*0.85,c);B(0,hy-s*0.15,hz0+s*0.5,s*0.5,s*0.36,s*0.3,c2);B(0,hy-s*0.08,hz0+s*0.66,s*0.3,s*0.16,0.04,'#c87a8a');
  M(s*0.3,hy+s*0.6,hz0-s*0.05,s*0.26,s*0.6,s*0.12,c);M(s*0.3,hy+s*0.6,hz0+0.02,s*0.14,s*0.42,0.03,'#c87a8a');M(s*0.22,hy+s*0.12,hz0+s*0.43,s*0.18,s*0.16,0.03,'!'+(o.eye||'#ff3a3a'));M(s*0.12,hy-s*0.36,hz0+s*0.55,s*0.07,s*0.16,s*0.07,'#f6efe0');
  const wc=o.wc||dk(c,1.15),wingP=[[W*0.7,0,0,W*1.4,0.04,W*0.9,wc],[W*1.8,0,-W*0.1,W*1.0,0.04,W*0.7,wc],[W*2.5,0,-W*0.2,W*0.6,0.04,W*0.45,wc],[W*0.9,0.03,W*0.3,W*1.8,0.06,0.06,c3],[W*2.3,0.03,W*0.1,0.06,0.06,W*0.9,c3],[W*1.5,0.03,-W*0.1,0.06,0.06,W*1.1,c3],[W*2.75,0.05,W*0.25,0.08,0.12,0.08,'#e8dcc8']];
  const leg=()=>[[0,-lh*0.5,0,W*0.12,lh,W*0.12,c3],[0,-lh+0.02,W*0.08,W*0.2,0.04,W*0.25,'#e8dcc8']];
  return{parts:P,hd:{c:[0,hy,hz0],r:s*1.0},tz:-99,ty:-99,legs:[[W*0.25,lh,-W*0.2,0],[-W*0.25,lh,-W*0.2,1]],lw:W*0.12,lh,lc:c3,legP:()=>leg(),wingP,wingAt:[W*0.4,by+H*0.25,0],wingK:'flap'}},
 manta(o){const P=[],{B,M}=MR(P),c=o.c,c2=o.c2||dk(c,1.25),c3=o.c3||dk(c,0.75),L=o.L,W=o.W,H=o.H,y=o.y;
  B(0,y,0,W*0.4,H,L*0.7,c);B(0,y-H*0.4,0,W*0.36,H*0.25,L*0.65,c2);B(0,y+H*0.45,-L*0.05,W*0.25,H*0.15,L*0.5,c3);M(W*0.12,y-H*0.05,L*0.42,W*0.08,H*0.6,L*0.2,c);M(W*0.16,y+H*0.15,L*0.32,0.03,H*0.2,H*0.2,'!'+(o.eye||'#bfe8ff'));
  for(let i=0;i<6;i++)B(0,y,-L*0.38-i*L*0.12,W*0.04,W*0.04,L*0.13,i===5?(o.tip||'!#bfe8ff'):c3);if(o.spots)for(let i=0;i<8;i++)M(W*(0.08+hs(i,1)*0.1),y+H*0.52,(hs(i,2)-0.5)*L*0.5,W*0.05,0.03,W*0.05,'!'+o.spots);
  const wingP=[[W*0.18,0,0,W*0.36,H*0.6,L*0.55,c],[W*0.45,0,-L*0.05,W*0.3,H*0.45,L*0.4,c],[W*0.7,0,-L*0.12,W*0.25,H*0.3,L*0.22,c3],[W*0.3,H*0.32,0,W*0.4,0.03,L*0.3,c3]];
  return{parts:P,hd:{c:[0,9,9],r:0.01},tz:-L*0.37,ty:y+0.59,legs:[],lw:0.1,lh:0.1,lc:c,legP:()=>[],wingP,wingAt:[W*0.18,y,0],wingK:'glide'}},
 fairy(o){const P=[],{B,M}=MR(P),c=o.c,sk=o.skin||'#f4dcc8',hr=o.hair||'#ffe080',s=0.2,lh=0.26,by=lh+0.14;
  B(0,by,0,0.16,0.26,0.12,c);B(0,by-0.12,0,0.24,0.12,0.18,dk(c,1.1));B(0,by-0.2,0,0.28,0.06,0.22,dk(c,0.9));
  const hy=by+0.25,hz0=0;B(0,hy,hz0,s,s,s*0.9,sk);B(0,hy+s*0.38,-s*0.05,s*1.1,s*0.35,s*1.0,hr);B(0,hy,-s*0.4,s*1.0,s*0.9,s*0.25,hr);M(s*0.45,hy-s*0.1,-s*0.1,s*0.15,s*0.7,s*0.6,hr);
  M(s*0.22,hy,hz0+s*0.455,s*0.18,s*0.2,0.03,'#ffffff');M(s*0.22,hy-0.005,hz0+s*0.465,s*0.12,s*0.15,0.02,o.eye||'#2a8a4a');B(0,hy-s*0.28,hz0+s*0.455,s*0.2,0.02,0.02,'#c85a5a');M(s*0.3,hy-s*0.15,hz0+s*0.45,s*0.12,s*0.06,0.02,'#f4a8a8');
  M(s*0.55,hy+s*0.25,-s*0.02,s*0.1,s*0.3,s*0.06,sk);B(0,hy+s*0.6,s*0.05,s*0.12,s*0.12,s*0.12,'!'+(o.glow||'#fff4a0'));
  M(0.12,by+0.02,0,0.06,0.2,0.06,sk);
  const wingP=[[0.18,0.08,-0.04,0.32,0.36,0.03,'!'+(o.wg||'#d8f8ff')],[0.16,-0.14,-0.04,0.22,0.22,0.03,'!'+(o.wg||'#d8f8ff')],[0.2,0.08,-0.03,0.2,0.24,0.02,'#ffffff']];
  const leg=()=>[[0,-lh*0.5,0,0.06,lh,0.07,sk],[0,-lh+0.02,0.02,0.07,0.04,0.1,dk(c,0.8)]];
  return{parts:P,hd:{c:[0,hy,hz0],r:s*1.2},tz:-99,ty:-99,legs:[[0.05,lh,0,0],[-0.05,lh,0,1]],lw:0.06,lh,lc:sk,legP:()=>leg(),wingP,wingAt:[0.06,by+0.05,-0.08],wingK:'buzz'}},
 worm(o){const P=[],{B,M}=MR(P),c=o.c,c2=o.c2||dk(c,1.2),c3=o.c3||dk(c,0.75),R=o.R,Hh=o.H,n=9;
  for(let i=0;i<n;i++){const t=i/(n-1),y=Hh*t*0.88,r=R*(1.0-0.25*t),z=Math.sin(t*1.8)*R*0.4;B(0,y+Hh/n/2,z,r*2,Hh/n*1.05,r*2,i%2?c:dk(c,1.08));B(0,y+Hh/n/2,z+r*0.95,r*1.3,Hh/n*0.8,0.06,c2);for(let k=0;k<4;k++){const a=k/4*Math.PI*2+i;B(Math.cos(a)*r*1.0,y+Hh/n*0.8,z+Math.sin(a)*r*1.0,r*0.25,Hh/n*0.25,r*0.25,c3)}}
  const ty=Hh*0.9,tz=Math.sin(1.8)*R*0.4+R*0.15;B(0,ty,tz,R*1.6,R*0.4,R*1.6,c3);for(let k=0;k<10;k++){const a=k/10*Math.PI*2;B(Math.cos(a)*R*0.6,ty+R*0.3,tz+Math.sin(a)*R*0.6,R*0.14,R*0.4,R*0.14,'#f2ead8')}B(0,ty+R*0.05,tz,R*1.0,R*0.12,R*1.0,'#5a1a1a');
  for(let k=0;k<4;k++){const a=k/4*Math.PI*2+0.4;B(Math.cos(a)*R*0.95,ty+R*0.45,tz+Math.sin(a)*R*0.95,R*0.35,R*0.8,R*0.35,c)}
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2;B(Math.cos(a)*R*1.25,0.08,Math.sin(a)*R*1.25,R*0.45,0.16,R*0.45,o.sand||'#d8c08a')}
  return{parts:P,hd:{c:[0,ty,tz],r:R*1.2},tz:-99,ty:-99,legs:[],lw:0.1,lh:0.1,lc:c,legP:()=>[]}},
 shark(o){const P=[],{B,M}=MR(P),c=o.c,c2=o.c2||'#e8e0d0',c3=o.c3||dk(c,0.75),L=o.L,W=o.W,H=o.H,y=o.y;
  B(0,y,0,W,H,L*0.5,c);B(0,y-H*0.05,L*0.3,W*0.85,H*0.85,L*0.25,c);B(0,y-H*0.4,L*0.1,W*0.8,H*0.2,L*0.7,c2);B(0,y-H*0.02,-L*0.3,W*0.7,H*0.75,L*0.22,c);
  B(0,y+H*0.5+H*0.35,-L*0.02,W*0.12,H*0.7,L*0.18,c3);B(0,y+H*0.5+H*0.75,-L*0.06,W*0.1,H*0.25,L*0.1,c3);M(W*0.6,y-H*0.3,L*0.1,W*0.7,H*0.08,L*0.14,c3);
  const s=W*0.9,hy=y-H*0.05,hz0=L*0.48;B(0,hy,hz0,s*0.9,H*0.75,s*0.7,c);B(0,hy-H*0.3,hz0+s*0.15,s*0.75,H*0.15,s*0.6,'#5a1a1a');for(let i=0;i<5;i++)M(s*(0.1+i*0.07),hy-H*0.24,hz0+s*0.36-i*0.02,s*0.05,H*0.12,s*0.05,'#ffffff');
  M(s*0.4,hy+H*0.15,hz0+s*0.1,0.03,H*0.14,H*0.14,'#0a0a0a');for(let i=0;i<3;i++)M(W*0.45,y,L*0.22-i*0.06,0.03,H*0.3,0.03,c3);
  for(let i=0;i<4;i++)B(0,y,-L*0.42-i*L*0.08,W*(0.4-i*0.08),H*(0.5-i*0.08),L*0.09,c);B(0,y+H*0.45,-L*0.74,W*0.1,H*0.8,L*0.08,c3);B(0,y-H*0.3,-L*0.72,W*0.1,H*0.45,L*0.08,c3);
  if(o.sand)for(let i=0;i<8;i++){const a=i/8*Math.PI*2;B(Math.cos(a)*W*0.9,0.06,L*0.1+Math.sin(a)*L*0.4,W*0.3,0.12,W*0.3,o.sand)}
  return{parts:P,hd:{c:[0,hy,hz0],r:s*0.7},tz:-L*0.4,ty:y+0.59,legs:[],lw:0.1,lh:0.1,lc:c,legP:()=>[]}}
});
// quad: skrzydła (mantikora, gryf, hipogryf)
const quad0=quad;
Object.assign(FIT,{"golem":[2.548,0.96],"lodowy_golem":[2.723,0.976],"golem_meteor":[3.18,0.984],"zardzewialy_golem":[3.231,1.213],"kolos":[4.84,1.825],"slime":[1.1,1.185],"gloop":[1.3,1.4],"smolowy_szlam":[1.404,1.4],"orzel":[1.353,1.756],"gryf":[2.55,2.67],"hipogryf":[1.966,2.058],"kaczka":[0.514,0.817],"paw":[1.467,0.872],"strus":[2.934,1.95],"nietoperz_w":[0.912,0.9],"plaszczka":[0.5,3.87],"wrozka":[0.817,0.3],"piaskowy_rekin":[1.18,3.285],"foka":[0.662,1.975],"mantikora":[3.038,3.745],"malpa":[1.212,1.06],"zywiolak":[3.661,0.769],"behemot":[6.993,11.343],"czerw":[4.55,2.2]});
Object.assign(SPEC,{
 golem:{kind:'golem',W:1.05,H:0.95,lh:0.6,c:'#7d7b78',c2:'#8f8d8a',c3:'#5e5c59',moss:'#5f7a3a',eye:'#7fe3ff',core:'#7fe3ff'},
 lodowy_golem:{kind:'golem',W:1.05,H:0.95,lh:0.6,c:'#a8d0e8',c2:'#d8f0ff',c3:'#7aa8c8',eye:'#bff4ff',crystals:'#bff4ff',core:'#e8fbff'},
 golem_meteor:{kind:'golem',W:1.1,H:1.0,lh:0.62,c:'#3a3436',c2:'#4a4446',c3:'#2a2426',eye:'#ff9a2a',cracks:'#ff7a1a',core:'#ffb040',horns:'#2a2426'},
 zardzewialy_golem:{kind:'golem',W:1.1,H:1.0,lh:0.62,c:'#7a6a5a',c2:'#8a7a68',c3:'#4a4038',eye:'#ffd040',rust:'#a8582a',rivets:'#c8b898',core:'#ffd040',fist:'#5a5048',armX:(sg,aw,al)=>[[0,-al*0.4,aw*0.53,aw*0.5,aw*0.5,0.04,'#c8b898']]},
 kolos:{kind:'golem',W:1.15,H:1.05,lh:0.62,c:'#5f5d5a',c2:'#6f6d6a',c3:'#45433f',moss:'#4a3a2a',eye:'#ff9d2e',cracks:'#ff9d2e',core:'#ffb84a',horns:'#45433f'},
 slime:{kind:'blob',R:0.5,c:'#5ac83a',c2:'#8ae86a',c3:'#3a8a2a',eye:'#1a2a10',bits:['#e8e2cc','#c8b048','#8a6a3a']},
 gloop:{kind:'blob',R:0.5,c:'#8a4ac8',c2:'#b07ae8',c3:'#5a2a8a',eye:'#1a0a2a',glow:'#e8b0ff',drips:'#6a3aa8'},
 smolowy_szlam:{kind:'blob',R:0.5,c:'#1e1a18',c2:'#2e2a26',c3:'#0e0a08',eye:'#ffb030',mouth:'#ff6a1a',drips:'#141010',glow:'#ff8a2a'},
 orzel:{kind:'bird',L:0.7,W:0.42,H:0.42,lh:0.34,c:'#5a3e24',c2:'#6a4a2c',c3:'#3e2814',hs:0.3,hc:'#f4f0e6',neckC:'#f4f0e6',beak:'#e8b830',bl:0.24,eye:'#e8a020',tc:'#f4f0e6',wc:'#4a3018',tipC:'#2a1a0c',ws:1.25,lc:'#e8b830',wingK:'flap'},
 kaczka:{kind:'bird',L:0.5,W:0.3,H:0.28,lh:0.12,c:'#8a7a5a',c2:'#c8b898',c3:'#5a4a3a',hs:0.2,hc:'#2a7a3a',neckC:'#2a7a3a',beak:'#e8c030',duck:1,bl:0.1,eye:'#1a1a1a',tc:'#3a3a3a',wc:'#7a6a4a',tipC:'#3a5ac8',lc:'#e88a20',ws:0.7,neckA:1.4,extra:(B,M,g)=>{B(0,g.by+g.H*0.32,g.L*0.38,g.W*0.6,0.04,0.08,'#ffffff')}},
 paw:{kind:'bird',L:0.55,W:0.34,H:0.38,lh:0.4,c:'#1a4aa8',c2:'#2a6ac8',c3:'#1a3a7a',hs:0.22,hc:'#1a5ac8',neckC:'#1a5ac8',beak:'#c8b898',bl:0.1,eye:'#1a1a1a',crestBall:'#2a8ac8',fan:0.75,fanC:'#2a8a4a',fanC2:'#1a5ac8',wc:'#a87a4a',tipC:'#6a4a2a',lc:'#a89880',ws:0.6,neckA:1.35,neckL:0.3},
 strus:{kind:'bird',L:0.75,W:0.55,H:0.55,lh:1.0,c:'#2a2420',c2:'#3a3430',c3:'#1a1410',hs:0.2,hc:'#d8b8a0',neckC:'#d8b8a0',neckL:0.75,neckW:0.13,neckA:1.45,beak:'#e8c890',bl:0.14,eye:'#2a1a0a',tc:'#f2ece4',wc:'#2a2420',tipC:'#f2ece4',ws:0.55,lc:'#c8a080',lw:0.09,wingK:'glide'},
 nietoperz_w:{kind:'bat',W:0.32,H:0.32,lh:0.18,c:'#2a2030',c2:'#4a3a50',c3:'#1a1420',hs:0.28,eye:'#ff3a3a',wc:'#3a2c40'},
 plaszczka:{kind:'manta',L:2.2,W:3.6,H:0.18,y:0.2,c:'#5a8ac8',c2:'#e8ecf4',c3:'#3a6aa8',eye:'#bfe8ff',spots:'#bfe8ff'},
 wrozka:{kind:'fairy',c:'#9ae8b0',hair:'#ffe080',eye:'#2a8a4a',glow:'#fff4a0',wg:'#d8f8ff'},
 czerw:{kind:'worm',R:0.85,H:4.0,c:'#c89a6a',c2:'#e8c8a0',c3:'#8a6440',sand:'#d8c08a'},
 piaskowy_rekin:{kind:'shark',L:3.0,W:0.7,H:0.6,y:0.35,c:'#c8a878',c2:'#efe2c8',c3:'#9a7a50',sand:'#d8c08a'},
 foka:{L:1.4,W:0.55,H:0.42,lh:0.12,c:'#6a7076',c2:'#a8b0b6',c3:'#4a5056',hs:0.38,ml:0.16,mw:0.24,mh:0.18,mc:'#8a9096',ears:'none',eye:'#0a0a0a',es:0.24,tail:'short',tc:'#4a5056',whisk:1,neckA:0.45,neckL:0.2,neckW:0.4,chest:1.05,rump:0.75,spots:12,sc:'#4a5056',lw:0.2,paw:'#3a4046'},
 malpa:{L:0.65,W:0.34,H:0.36,lh:0.42,c:'#6a4a30',c2:'#c8a888',c3:'#4a3020',hs:0.34,hw:1.0,ml:0.1,mw:0.24,mh:0.16,mc:'#e8c8a8',hc:'#6a4a30',cheek:'#e8c8a8',ears:'side',earC:'#d8b898',earIn:'#c89878',eye:'#3a2010',tail:'long',tl:0.6,tailUp:1,neckA:1.0,neckL:0.14,chest:1.15,rump:0.85,
   extra:(B,M,g)=>{B(0,g.hy-g.s*0.02,g.hz0+g.s*0.452,g.s*0.62,g.s*0.5,0.03,'#e8c8a8');B(0,g.by+g.H*0.3,g.cz+g.L*0.2,g.W*0.9,g.H*0.3,0.08,'#8a2a2a');B(0,g.by+g.H*0.1,g.L*0.4,0.08,0.1,0.05,'#ffd34d')}},
 mantikora:{L:1.6,W:0.62,H:0.58,lh:0.6,c:'#b8743a',c2:'#e8c890',c3:'#8a5428',hs:0.5,hw:1.05,ml:0.18,mw:0.3,mh:0.22,mc:'#d8a878',hc:'#d8a878',ears:'round',earC:'#b8743a',eye:'#ff4a2a',fangs:0.14,ruff:'#7a3a1a',mane:'#7a3a1a',tail:0,claws:'#f2ead8',
   wingP:[[0.35,0,0,0.7,0.06,0.9,'#7a3a3a'],[0.95,0,-0.1,0.6,0.06,0.75,'#6a2e2e'],[1.4,0,-0.2,0.4,0.06,0.5,'#5a2424'],[0.6,0.05,0.4,1.2,0.08,0.08,'#3a1a1a'],[1.2,0.05,0.15,0.08,0.08,0.7,'#3a1a1a']],wingAt:[0.28,1.35,0.25],
   extra:(B,M,g)=>{const R=g.L*0.32;let ly=0,lz=0;for(let i=0;i<8;i++){const a=i/7*Math.PI*0.9,y=g.ty+R-R*Math.cos(a),z=g.tz0-0.04-R*Math.sin(a)*0.95,w=g.W*(0.36-i*0.025);B(0,y,z,w,w,w*1.15,i%2?'#5a3a2a':'#6a4a32');ly=y;lz=z}B(0,ly+0.12,lz-0.05,0.24,0.24,0.28,'#3a2418');B(0,ly+0.06,lz-0.22,0.06,0.16,0.06,'#1a1010')}},
 gryf:{L:1.5,W:0.6,H:0.58,lh:0.62,c:'#c8a060',c2:'#efe2c4',c3:'#9a7848',hs:0.42,hw:0.95,ml:0.3,mw:0.2,mh:0.2,mc:'#e8b830',mtop:'#f4f0e6',hc:'#f4f0e6',nose:0,ears:'pointy',earC:'#e8e0d0',earIn:'#c8b8a0',eye:'#e8a020',ruff:'#f4f0e6',chestC:'#f4f0e6',tail:'tuft',tc:'#c8a060',tip:'#7a5428',claws:'#e8b830',neckA:0.9,neckL:0.42,
   wingP:[[0.4,0,0,0.8,0.1,0.9,'#7a5a38'],[1.1,-0.01,-0.08,0.7,0.09,0.75,'#6a4a2c'],[1.7,-0.02,-0.15,0.6,0.08,0.55,'#4a3018'],[0.6,-0.03,-0.5,0.3,0.06,0.3,'#3a2410'],[1.1,-0.03,-0.48,0.3,0.06,0.28,'#3a2410'],[1.6,-0.03,-0.42,0.3,0.06,0.26,'#3a2410']],wingAt:[0.28,1.45,0.3],
   extra:(B,M,g)=>{B(0,g.hy-g.s*0.2,g.mz+g.ml*0.55,g.mw*0.5,g.mh*0.6,g.ml*0.25,'#c89820');M(g.s*0.38,g.hy+g.s*0.32,g.hz0+g.s*0.1,g.s*0.1,g.s*0.08,g.s*0.36,'#c8a060')}},
 hipogryf:{L:1.45,W:0.56,H:0.56,lh:0.7,c:'#8a6a4a',c2:'#d8c8b0',c3:'#5e4430',hs:0.4,hw:0.95,ml:0.3,mw:0.2,mh:0.2,mc:'#e8c040',mtop:'#d8d0c0',hc:'#d8d0c0',nose:0,ears:'pointy',earC:'#d8d0c0',earIn:'#b8a890',eye:'#e8a020',ruff:'#e8e0d0',chestC:'#e8e0d0',tail:'long',tl:0.7,tc:'#3a2a1e',hoof:1,paw:'#2a2018',neckA:0.95,neckL:0.45,mane:'#3a2a1e',
   wingP:[[0.4,0,0,0.8,0.1,0.9,'#c8b8a0'],[1.1,-0.01,-0.08,0.7,0.09,0.75,'#a89880'],[1.7,-0.02,-0.15,0.6,0.08,0.55,'#6a5a48'],[0.6,-0.03,-0.5,0.3,0.06,0.3,'#4a3e30'],[1.1,-0.03,-0.48,0.3,0.06,0.28,'#4a3e30']],wingAt:[0.26,1.45,0.3]},
 behemot:{L:2.0,W:1.0,H:0.95,lh:0.55,c:'#4a3a32',c2:'#6a5448',c3:'#2a201a',hs:0.62,hw:1.05,ml:0.36,mw:0.4,mh:0.34,mc:'#5a4a40',disc:'#a86a5a',nose:0,ears:'pointy',eh:0.22,earIn:'#8a5a4a',eye:'#ff5a1a',tail:'tuft',tusks:1,hoof:1,paw:'#1a1410',hump:0.3,humpC:'#3a2c24',antler:'down',antC:'#d8ccb4',spikes:{n:9,c:'#c8bca0',c2:'#e8dcc0'},chest:1.15,neckA:0.15,neckL:0.22,lw:0.3,
   extra:(B,M,g)=>{for(let i=0;i<6;i++){const zz=g.cz+0.2-i*g.L*0.15;M(g.W*0.52,g.by+g.H*0.25,zz,0.06,g.H*0.5,g.L*0.12,i%2?'#5a4a40':'#3a2c24')}M(g.s*0.25,g.hy+g.s*0.1,g.hz0+g.s*0.46,g.s*0.14,g.s*0.12,0.03,'!#ff6a1a')}},
 zywiolak:{kind:'golem',W:0.95,H:0.95,lh:0.55,c:'#3a2420',c2:'#5a3420',c3:'#2a1814',eye:'#fff0a0',cracks:'#ff9a2a',core:'#ffe070',fist:'#5a2a18',
   extra:(B,M,g)=>{for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=g.W*0.45;B(Math.cos(a)*r,g.hy+g.s*0.4+hs(i,3)*g.s*0.6,g.hz0+Math.sin(a)*r*0.6,g.W*0.14,g.s*(0.4+hs(i,4)*0.6),g.W*0.14,'!'+(i%2?'#ff7a1a':'#ffcf3a'))}for(let i=0;i<6;i++)B((hs(i,5)-0.5)*g.W,g.by+g.H*0.6,(hs(i,6)-0.5)*g.D,g.W*0.12,g.H*0.3,g.W*0.12,'!#ff9a2a')},
   armX:(sg,aw,al)=>[[0,-al*0.85,aw*0.05,aw*0.9,al*0.32,aw*0.9,'!#ff9a2a']]}
});

// ---- v129: przerobione golemy, żywiołak, ropucha, jeż, panda + nowe stworzenia ----
Object.assign(BUILD,{
 golem2(o){const P=[],{B,M}=MR(P),c=o.c,c2=o.c2||dk(c,1.15),c3=o.c3||dk(c,0.75),W=o.W,lh=o.lh,j=(i,k)=>(hs(i,k)-0.5);
  const hip=lh,ab=hip+0.32*W,ch=ab+0.5*W,sh=ch+0.34*W;
  // miednica i brzuch
  B(0,hip+0.08*W,0,W*0.62,W*0.26,W*0.46,c3);B(0,ab,0.02*W,W*0.58,W*0.34,W*0.5,c);
  // klatka — rozszerzająca się ku górze, z garbem z tyłu
  B(0,ch-0.12*W,0.04*W,W*0.78,W*0.3,W*0.6,c);B(0,ch+0.1*W,0.05*W,W*0.95,W*0.32,W*0.66,c2);B(0,ch+0.28*W,0.02*W,W*1.0,W*0.2,W*0.62,c);B(0,ch+0.22*W,-0.3*W,W*0.7,W*0.42,W*0.26,c3);
  B(0,ch+0.08*W,0.37*W,W*0.62,W*0.38,0.05,dk(c,0.9));
  // barki — głazy
  for(const sg of [1,-1]){B(sg*0.52*W,sh,0,W*0.4,W*0.36,W*0.5,c2);B(sg*0.56*W,sh+0.17*W,-0.02*W,W*0.3,W*0.12,W*0.4,dk(c2,1.08));B(sg*0.62*W,sh-0.08*W,0.12*W,W*0.18,W*0.16,W*0.24,c)}
  // runy / świecące linie
  if(o.rune){const R='!'+o.rune;B(0,ch+0.1*W,0.4*W,W*0.06,W*0.3,0.03,R);B(0,ch+0.24*W,0.4*W,W*0.32,W*0.05,0.03,R);M(0.14*W,ch-0.02*W,0.4*W,W*0.05,W*0.16,0.03,R);M(0.5*W,sh+0.02*W,0.26*W,W*0.12,W*0.04,0.03,R)}
  if(o.core){B(0,ch+0.08*W,0.405*W,W*0.18,W*0.18,0.04,'!'+o.core);B(0,ch+0.08*W,0.42*W,W*0.08,W*0.08,0.03,'!#ffffff')}
  if(o.moss){for(let i=0;i<10;i++)B(j(i,1)*W*0.9,sh+0.12*W+hs(i,2)*0.08*W,j(i,3)*W*0.5,W*(0.16+hs(i,4)*0.14),0.06*W,W*0.16,i%3?o.moss:dk(o.moss,1.2));if(o.flowers)for(let i=0;i<6;i++)B(j(i,5)*W*0.8,sh+0.2*W,j(i,6)*W*0.4,W*0.06,W*0.06,W*0.06,o.flowers[i%o.flowers.length])}
  if(o.cracks)for(let i=0;i<10;i++){const x=j(i,7)*W*0.8,y=ab+hs(i,8)*(sh-ab);B(x,y,0.335*W+0.01,W*(0.05+hs(i,9)*0.16),0.04*W,0.03,'!'+o.cracks);B(x+0.05*W,y-0.05*W,0.335*W+0.01,0.03*W,0.1*W,0.03,'!'+o.cracks)}
  if(o.ice)for(let i=0;i<8;i++){const x=j(i,10)*W*1.1,hh=W*(0.18+hs(i,11)*0.32);B(x,sh+0.15*W+hh/2,j(i,12)*W*0.4,W*0.09,hh,W*0.09,i%2?o.ice:'!'+o.ice);B(x,sh+0.15*W+hh+0.02,j(i,12)*W*0.4,W*0.05,0.06,W*0.05,'!#ffffff')}
  if(o.rust){for(let i=0;i<12;i++)B(j(i,13)*W*0.9,ab+hs(i,14)*(sh-ab),(i%2?1:-1)*0.33*W,W*0.12,W*0.1,0.03,o.rust);for(let i=0;i<10;i++)M((0.12+0.09*(i%5))*W,ch+(i<5?0.24:-0.04)*W,0.33*W,0.05*W,0.05*W,0.03,o.rivets||'#c8b898');B(0,ch+0.2*W,-0.44*W,W*0.12,W*0.5,W*0.12,'#5a4a3a');B(0.2*W,ch+0.42*W,-0.44*W,W*0.1,W*0.25,W*0.1,'#5a4a3a');B(0.2*W,ch+0.58*W,-0.44*W,W*0.14,W*0.06,W*0.14,'#3a3028')}
  if(o.embers)for(let i=0;i<6;i++)B(j(i,15)*W*1.3,sh+0.3*W+hs(i,16)*0.4*W,j(i,17)*W*0.8,0.06*W,0.06*W,0.06*W,'!'+o.embers);
  if(o.runeStones)for(let i=0;i<4;i++){const a=i/4*Math.PI*2;B(Math.cos(a)*W*0.9,sh+0.4*W+(i%2)*0.1*W,Math.sin(a)*W*0.6,W*0.14,W*0.18,W*0.14,c2);B(Math.cos(a)*W*0.9,sh+0.4*W+(i%2)*0.1*W,Math.sin(a)*W*0.6+W*0.072,W*0.06,W*0.08,0.02,'!'+(o.rune||'#7fe3ff'))}
  // głowa nisko między barkami
  const s=W*0.34,hy=sh+0.02*W,hz0=0.22*W;B(0,hy,hz0,s,s*0.82,s*0.85,c2);B(0,hy+s*0.38,hz0+s*0.1,s*1.15,s*0.2,s*0.9,c3);B(0,hy-s*0.34,hz0+s*0.18,s*0.82,s*0.24,s*0.7,c3);
  M(s*0.22,hy+s*0.08,hz0+s*0.43,s*0.28,s*0.1,0.04,'!'+(o.eye||'#7fe3ff'));B(0,hy-s*0.18,hz0+s*0.43,s*0.36,0.04,0.03,o.mouth||'#1a1612');
  if(o.horns)for(const sg of [1,-1]){B(sg*s*0.52,hy+s*0.4,hz0-s*0.05,s*0.2,s*0.3,s*0.2,o.horns);B(sg*s*0.62,hy+s*0.68,hz0-s*0.12,s*0.14,s*0.3,s*0.14,o.horns)}
  if(o.extra)o.extra(B,M,{W,lh,hip,ab,ch,sh,s,hy,hz0});
  const lw=W*0.3,aw=W*0.3,al=sh-lh*0.25;
  const leg=()=>[[0,-lh*0.18,0,lw*1.2,lh*0.42,lw*1.15,c2],[0,-lh*0.5,0.02*W,lw*1.05,lh*0.22,lw*1.05,c3],[0,-lh*0.74,0,lw*0.95,lh*0.36,lw*0.95,c],[0,-lh+0.07,lw*0.2,lw*1.25,0.14,lw*1.5,c3],[lw*0.38,-lh+0.05,lw*0.88,lw*0.28,0.1,lw*0.28,c3],[-lw*0.38,-lh+0.05,lw*0.88,lw*0.28,0.1,lw*0.28,c3],[0,-lh+0.05,lw*0.92,lw*0.28,0.1,lw*0.3,c3]];
  const arm=(sg)=>{const A=[[0,-al*0.16,0,aw*0.95,al*0.36,aw*0.95,c],[0,-al*0.4,0,aw*0.8,al*0.14,aw*0.8,c3],[0,-al*0.6,0.02*W,aw*1.15,al*0.32,aw*1.12,c2],[0,-al*0.86,0.06*W,aw*1.3,al*0.22,aw*1.3,o.fist||c3]];for(const k of [-0.32,0,0.32])A.push([k*aw,-al*0.96,0.06*W+aw*0.6,aw*0.3,al*0.12,aw*0.25,o.fist||c3]);A.push([-sg*aw*0.62,-al*0.84,0.06*W+aw*0.35,aw*0.22,al*0.14,aw*0.3,o.fist||c3]);if(o.armX)A.push(...o.armX(sg,aw,al));return A};
  return{parts:P,hd:{c:[0,hy,hz0],r:s*0.95},tz:-99,ty:-99,legs:[[W*0.22,lh,0,0],[-W*0.22,lh,0,1],[W*0.72,sh,0.02*W,1],[-W*0.72,sh,0.02*W,0]],lw,lh,lc:c,legP:i=>i<2?leg():arm(i===2?1:-1)}},
 flame(o){const P=[],{B,M}=MR(P),W=o.W,y0=o.y0,O1='!'+o.c1,O2='!'+o.c2,O3='!'+o.c3,R=o.rock,R2=dk(R,1.3),j=(i,k)=>(hs(i,k)-0.5);
  // ogon płomieni u dołu, zwężający się
  for(let i=0;i<5;i++){const t=i/4,w=W*(0.2+0.6*t);B(j(i,1)*W*0.08,y0+t*W*0.9,0,w,W*0.22,w*0.8,i%2?O1:O2)}
  // tułów z płomieni + płyty magmy
  const ty=y0+W*1.05;B(0,ty,0,W*0.9,W*0.6,W*0.7,O1);B(0,ty+W*0.05,0.02*W,W*0.7,W*0.5,W*0.6,O2);B(0,ty,0.06*W,W*0.36,W*0.32,W*0.62,O3);
  for(const [x,y,z,w,h] of [[0.32,0.15,0.3,0.36,0.3],[-0.3,-0.05,0.32,0.3,0.36],[0.05,0.25,-0.36,0.6,0.34],[-0.38,0.2,-0.1,0.2,0.4],[0.4,-0.12,-0.12,0.18,0.3],[0.0,-0.25,0.34,0.28,0.18]])B(x*W,ty+y*W,z*W,w*W,h*W,Math.min(w,0.22)*W,y>0.1?R:R2);
  for(let i=0;i<6;i++)B(j(i,2)*W*0.7,ty+j(i,3)*W*0.5,0.36*W,0.04*W,0.14*W,0.03,O3);
  // ramiona-barki z kamienia
  for(const sg of [1,-1]){B(sg*0.48*W,ty+0.28*W,0,0.3*W,0.24*W,0.36*W,R);B(sg*0.52*W,ty+0.42*W,-0.02*W,0.2*W,0.1*W,0.26*W,R2)}
  // głowa: płonący łeb z oczami
  const hy=ty+0.62*W,s=W*0.42;B(0,hy,0.04*W,s,s*0.9,s*0.85,O2);B(0,hy,0.06*W,s*0.7,s*0.7,s*0.8,O3);M(s*0.22,hy+s*0.05,0.04*W+s*0.43,s*0.24,s*0.12,0.03,'#2a0a04');M(s*0.22,hy+s*0.05,0.04*W+s*0.445,s*0.1,s*0.06,0.02,'!#ffffff');B(0,hy-s*0.22,0.04*W+s*0.43,s*0.3,s*0.06,0.03,'#2a0a04');
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2,hh=s*(0.5+hs(i,4)*0.9);B(Math.cos(a)*s*0.32,hy+s*0.45+hh/2,0.04*W+Math.sin(a)*s*0.3,s*0.18,hh,s*0.18,i%3===0?O3:(i%2?O1:O2))}
  B(0,hy+s*1.5,0.04*W,s*0.14,s*0.5,s*0.14,O3);
  for(let i=0;i<8;i++)B(j(i,5)*W*1.6,ty+hs(i,6)*W*1.2,j(i,7)*W*1.2,0.05*W,0.05*W,0.05*W,i%2?O3:O1);
  const al=W*0.95,arm=(sg)=>[[0,-al*0.18,0,0.24*W,al*0.36,0.24*W,R],[0,-al*0.5,0,0.2*W,al*0.32,0.2*W,O1],[0,-al*0.5,0,0.12*W,al*0.34,0.12*W,O3],[0,-al*0.82,0.04*W,0.3*W,al*0.26,0.3*W,O2],[0,-al*0.82,0.04*W,0.18*W,al*0.2,0.18*W,O3],[sg*0.05*W,-al*1.02,0.06*W,0.08*W,al*0.16,0.08*W,O1]];
  return{parts:P,hd:{c:[0,hy,0.04*W],r:s*1.1},tz:-99,ty:-99,legs:[[0.66*W,ty+0.28*W,0,0],[-0.66*W,ty+0.28*W,0,1]],lw:0.2*W,lh:al,lc:R,legP:i=>arm(i?-1:1)}},
 frog2(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,H=o.H,c=o.c,c2=o.c2||dk(c,1.35),c3=o.c3||dk(c,0.75),by=H*0.5,j=(i,k)=>(hs(i,k)-0.5);
  // tułów — szeroki, opadający ku tyłowi
  B(0,by,-L*0.1,W*0.92,H*0.82,L*0.62,c);B(0,by-H*0.06,-L*0.38,W*0.78,H*0.66,L*0.2,c);B(0,by-H*0.33,-L*0.05,W*0.82,H*0.24,L*0.66,c2);B(0,by+H*0.42,-L*0.12,W*0.5,H*0.08,L*0.5,dk(c,1.08));
  // głowa — płaska i szeroka, z szerokim pyskiem
  const hz=L*0.3,hy=by+H*0.02;B(0,hy,hz,W*1.0,H*0.6,L*0.36,c);B(0,hy+H*0.26,hz-L*0.02,W*0.8,H*0.16,L*0.3,dk(c,1.06));B(0,hy-H*0.24,hz+L*0.02,W*0.92,H*0.16,L*0.34,c2);
  B(0,hy-H*0.11,hz+L*0.181,W*0.96,0.025,0.025,'#2a1010');M(W*0.48,hy-H*0.1,hz+L*0.08,0.025,0.025,L*0.2,'#2a1010');
  B(0,hy-H*0.32,hz-L*0.02,W*0.6,H*0.18,L*0.24,o.throat||dk(c2,1.05));
  M(W*0.1,hy+H*0.12,hz+L*0.181,W*0.04,W*0.03,0.02,'#1a1010');
  // oczy wypukłe na wierzchu, z łukiem brwiowym
  for(const sg of [1,-1]){const ex=sg*W*0.3,ey=hy+H*0.36,ez=hz+L*0.06,es=W*0.24;B(ex,ey-es*0.1,ez,es*1.1,es*0.7,es*1.1,c);B(ex,ey+es*0.08,ez+es*0.05,es*0.92,es*0.8,es*0.92,o.eye||'#e8b020');B(ex,ey+es*0.08,ez+es*0.52,es*0.62,es*0.2,0.03,'#0a0806');B(ex-sg*es*0.15,ey+es*0.3,ez+es*0.5,es*0.16,es*0.16,0.03,'#ffffff');B(ex,ey+es*0.5,ez-es*0.05,es*1.0,es*0.14,es*0.8,dk(c,0.85))}
  if(o.parotoid)M(W*0.36,hy+H*0.22,hz-L*0.2,W*0.2,H*0.16,L*0.18,dk(c,1.15));
  if(o.warts)for(let i=0;i<o.warts;i++){const x=j(i,1)*W*0.85,z=j(i,2)*L*0.75-L*0.05;B(x,by+H*0.42+hs(i,3)*0.03,z,W*(0.05+hs(i,4)*0.05),0.05,W*(0.05+hs(i,4)*0.05),i%3?dk(c,1.2):c3)}
  if(o.blotch)for(let i=0;i<9;i++)B(j(i,5)*W*0.8,by+H*0.415,j(i,6)*L*0.6-L*0.08,W*0.16,0.03,W*0.14,o.blotch);
  if(o.glowSpots){for(let i=0;i<12;i++)B(j(i,7)*W*0.8,by+H*0.43,j(i,8)*L*0.6-L*0.05,W*0.08,0.04,W*0.08,'!'+o.glowSpots);M(W*0.47,by,-L*0.1,0.03,H*0.08,L*0.5,'!'+o.glowSpots)}
  if(o.extra)o.extra(B,M,{L,W,H,by,hy,hz});
  const lw=W*0.12,F=sg=>[[sg*lw*0.3,-H*0.08,0,lw*1.1,H*0.3,lw*1.1,c],[sg*lw*0.5,-H*0.25,lw*0.4,lw*0.9,H*0.14,lw*0.9,c],[sg*lw*0.6,-H*0.33,lw*1.0,lw*1.8,0.04,lw*1.4,c2],[sg*lw*1.3,-H*0.33,lw*1.6,lw*0.35,0.04,lw*0.6,c2],[sg*lw*0.1,-H*0.33,lw*1.75,lw*0.35,0.04,lw*0.6,c2]],
   R=sg=>[[sg*lw*0.9,0.02,-lw*0.4,lw*1.9,H*0.5,L*0.3,c],[sg*lw*1.4,-H*0.18,L*0.06,lw*1.2,H*0.22,L*0.28,dk(c,0.94)],[sg*lw*1.2,-H*0.3,-L*0.1,lw*1.0,H*0.14,L*0.18,c],[sg*lw*1.4,-H*0.33,L*0.24,lw*2.4,0.04,lw*1.8,c2],[sg*lw*2.4,-H*0.33,L*0.32,lw*0.5,0.04,lw*1.2,c2],[sg*lw*0.6,-H*0.33,L*0.34,lw*0.5,0.04,lw*1.2,c2]];
  const LP=[F(1),F(-1),R(1),R(-1)];
  return{parts:P,hd:{c:[0,hy+H*0.1,hz+L*0.06],r:W*0.55},tz:-L*0.7,ty:by,legs:[[W*0.42,H*0.34,L*0.22,0],[-W*0.42,H*0.34,L*0.22,1],[W*0.42,H*0.34,-L*0.28,1],[-W*0.42,H*0.34,-L*0.28,0]],lw,lh:H*0.34,lc:c,legP:i=>LP[i],hop:1}},
 hedgehog(o){const P=[],{B,M}=MR(P),L=o.L,W=o.W,H=o.H,lh=o.lh,c=o.c,sp=o.sp,tip=o.tip,j=(i,k)=>(hs(i,k)-0.5),by=lh+H*0.45;
  B(0,by,-L*0.04,W*0.9,H*0.8,L*0.78,c);B(0,by-H*0.32,0,W*0.8,H*0.2,L*0.74,o.belly||dk(c,1.3));
  // kolce: rzędy wzdłuż kopuły, pochylone do tyłu (dwie kostki: trzon + jasny czubek)
  const rows=o.rows||7,per=o.per||9;for(let r=0;r<rows;r++){const a=-1.25+r*(2.5/(rows-1));for(let k=0;k<per;k++){const t=k/(per-1),z=L*0.32-t*L*0.74+j(r*9+k,1)*0.03,yy=by+Math.cos(a)*H*0.48,xx=Math.sin(a)*W*0.5,len=H*(0.3+0.14*Math.sin(t*Math.PI))*(o.spL||1);
    B(xx*1.02,yy+len*0.3*Math.cos(a),z-len*0.18,W*0.07,len*0.62,W*0.07+len*0.3,sp);B(xx*1.08+Math.sin(a)*len*0.3,yy+len*0.62*Math.cos(a),z-len*0.42,W*0.05,len*0.25,W*0.06,tip)}}
  // pyszczek
  const s=o.hs,hy=lh+H*0.32,hz0=L*0.36;B(0,hy,hz0,s*0.95,s*0.8,s*0.7,o.face||'#d8b898');B(0,hy-s*0.08,hz0+s*0.5,s*0.6,s*0.5,s*0.4,o.face||'#d8b898');B(0,hy-s*0.14,hz0+s*0.8,s*0.36,s*0.32,s*0.3,o.face||'#d8b898');B(0,hy-s*0.1,hz0+s*1.0,s*0.2,s*0.18,s*0.12,'#1a1010');B(0,hy-s*0.06,hz0+s*1.06,s*0.06,s*0.06,0.02,'#ffffff');
  M(s*0.26,hy+s*0.12,hz0+s*0.36,s*0.16,s*0.18,0.03,'#0a0806');M(s*0.23,hy+s*0.17,hz0+s*0.375,s*0.05,s*0.05,0.02,'#ffffff');M(s*0.38,hy+s*0.38,hz0+s*0.05,s*0.16,s*0.16,s*0.08,o.face||'#d8b898');M(s*0.38,hy+s*0.38,hz0+s*0.1,s*0.08,s*0.08,0.02,'#c88a7a');M(s*0.28,hy-s*0.12,hz0+s*0.33,s*0.14,s*0.08,0.02,'#e8a8a0');
  const lw=W*0.12,leg=()=>[[0,-lh*0.5,0,lw,lh*1.1,lw,o.face||'#d8b898'],[0,-lh+0.02,lw*0.3,lw*1.2,0.04,lw*1.4,'#3a2818']];
  return{parts:P,hd:{c:[0,hy,hz0+s*0.2],r:s*0.95},tz:-99,ty:-99,legs:[[W*0.3,lh,L*0.22,0],[-W*0.3,lh,L*0.22,1],[W*0.3,lh,-L*0.22,1],[-W*0.3,lh,-L*0.22,0]],lw,lh,lc:c,legP:()=>leg()}}
});
// panda — od nowa na szkielecie quad, z łatami, białym pyskiem i bambusem
SPEC.panda={L:1.1,W:0.64,H:0.58,lh:0.34,c:'#f4f2ec',c2:'#ecebe4',c3:'#e6e4dc',hs:0.5,hw:1.12,ml:0.15,mw:0.3,mh:0.2,mc:'#fbfaf6',ears:'round',earC:'#141414',earIn:'#262626',eye:'#141414',es:0.13,tail:'short',tc:'#f4f2ec',lc:'#161616',paw:'#0c0c0c',neckA:0.3,neckL:0.2,neckW:0.5,chest:1.08,rump:1.05,cheek:'#f8f7f2',
 extra:(B,M,g)=>{const S=g.s;B(0,g.by+g.H*0.3,g.cz+g.L*0.04,g.W*1.04,g.H*0.36,g.L*0.26,'#161616');B(0,g.by+g.H*0.05,g.cz+g.L*0.17,g.W*0.9,g.H*0.6,g.L*0.14,'#161616');
  for(const sg of [1,-1]){B(sg*S*0.26,g.hy+S*0.06,g.hz0+S*0.448,S*0.22,S*0.26,0.03,'#161616');B(sg*S*0.31,g.hy-S*0.06,g.hz0+S*0.448,S*0.16,S*0.16,0.03,'#161616');B(sg*S*0.24,g.hy+S*0.09,g.hz0+S*0.462,S*0.1,S*0.1,0.02,'#2a1a10');B(sg*S*0.22,g.hy+S*0.12,g.hz0+S*0.47,S*0.04,S*0.04,0.015,'#ffffff')}
  B(0,g.hy-S*0.12,g.mz+g.ml*0.5+0.015,g.mw*0.4,g.mh*0.3,0.04,'#141414');B(0.12,g.hy-S*0.24,g.mz+g.ml*0.3,0.55,0.07,0.07,'#7aa83a');B(0.36,g.hy-S*0.24,g.mz+g.ml*0.3,0.06,0.09,0.09,'#5a8a2a');B(0.42,g.hy-S*0.18,g.mz+g.ml*0.36,0.04,0.12,0.12,'#8ac84a')}};
SPEC.jez={kind:'hedgehog',L:0.62,W:0.46,H:0.32,lh:0.08,c:'#6a4a32',sp:'#4a3020',tip:'#efe2c8',hs:0.2,face:'#d8b898',belly:'#c8a888',rows:7,per:10};
SPEC.ropucha={kind:'frog2',L:0.95,W:0.84,H:0.5,c:'#6a7438',c2:'#d8cc9a',c3:'#4a5226',eye:'#e8a020',warts:30,blotch:'#4a5226',parotoid:1,throat:'#e8dcb0'};
SPEC.swiecaca_zaba={kind:'frog2',L:0.8,W:0.66,H:0.42,c:'#2a8a5a',c2:'#c8f0d8',c3:'#1a5a3a',eye:'#ffd030',glowSpots:'#7affd0',throat:'#9ae8c0'};
SPEC.golem={kind:'golem2',W:1.0,lh:0.66,c:'#7d7b76',c2:'#8f8d88',c3:'#5e5c57',moss:'#5f7a3a',flowers:['#e8d040','#e86a8a','#ffffff'],eye:'#7fe3ff',rune:'#7fe3ff',core:'#7fe3ff'};
SPEC.lodowy_golem={kind:'golem2',W:1.0,lh:0.66,c:'#9cc8e2',c2:'#c8e8fa',c3:'#6a9ac0',eye:'#dffaff',ice:'#bff4ff',rune:'#bff4ff',core:'#ffffff',mouth:'#3a6a8a'};
SPEC.golem_meteor={kind:'golem2',W:1.05,lh:0.68,c:'#3a3436',c2:'#4c4648',c3:'#262022',eye:'#ffb040',cracks:'#ff7a1a',core:'#ffcf5a',horns:'#262022',embers:'#ff9a2a',fist:'#2a2224'};
SPEC.zardzewialy_golem={kind:'golem2',W:1.05,lh:0.68,c:'#7a6a58',c2:'#8c7c68',c3:'#4c4238',eye:'#ffd040',rust:'#a8582a',rivets:'#d8c8a8',core:'#ffd040',fist:'#5a5048',mouth:'#2a2420',armX:(sg,aw,al)=>[[0,-al*0.6,aw*0.6,aw*0.5,aw*0.5,0.04,'#d8c8a8'],[0,-al*0.6,aw*0.62,aw*0.2,aw*0.2,0.03,'#5a4a3a']]};
SPEC.kolos={kind:'golem2',W:1.1,lh:0.68,c:'#605e5a',c2:'#72706b',c3:'#46443f',moss:'#4e6a30',eye:'#ff9d2e',rune:'#ff9d2e',core:'#ffb84a',horns:'#46443f',runeStones:1,cracks:'#ff9d2e'};
SPEC.zywiolak={kind:'flame',W:0.95,y0:0.0,c1:'#ff6a1a',c2:'#ffa830',c3:'#ffe890',rock:'#3a2420'};
// ---- nowe stworzenia ----
const NEWE={
 jezozwierz:{n:'Kolczasty jeżozwierz',hp:55,dmg:10,spd:3.4,aggro:9,rng:1.6,cd:1.3,bh:0.7},
 kretoszczur:{n:'Olbrzymi kretoszczur',hp:62,dmg:11,spd:4.6,aggro:13,rng:1.6,cd:1.1,bh:0.6},
 kamienny_skarabeusz:{n:'Kamienny skarabeusz',hp:95,dmg:13,spd:3.2,aggro:12,rng:2.0,cd:1.6,bh:1.0},
 krysztalowy_pajak:{n:'Kryształowy pająk',hp:70,dmg:14,spd:5.2,aggro:15,rng:1.8,cd:1.2,bh:0.8},
 sowa_cienia:{n:'Sowa cienia',hp:48,dmg:12,spd:6.4,aggro:18,rng:1.6,cd:1.1,bh:0.9},
 magmowy_szlam:{n:'Magmowy szlam',hp:80,dmg:14,spd:3.0,aggro:12,rng:1.8,cd:1.5,bh:1.0,hop:1},
 mchowy_golem:{n:'Mchowy golem',hp:180,dmg:20,spd:2.6,aggro:12,rng:2.4,cd:2.0,bh:2.4},
 blotny_rak:{n:'Błotny rak',hp:66,dmg:12,spd:3.6,aggro:11,rng:1.9,cd:1.4,bh:0.8}};
for(const k in NEWE)if(!EDEF[k])EDEF[k]=Object.assign({parts:[],legs:[]},NEWE[k]);
const NEWP={tapir:['Tapir',60,3.6,'Liście bananowca',[9,30]],wydra:['Wydra',26,4.8,'Świeża rybka',[13,43,14]],motyl:['Olbrzymi motyl',18,3.4,'Kropla nektaru',[54,11,34]]};
for(const k in NEWP){const [n,hp,spd,food,bs]=NEWP[k];if(!EDEF[k])EDEF[k]=Object.assign({parts:[],legs:[]},{n,hp,dmg:Math.max(2,hp/12),spd,aggro:0,rng:1.4,cd:1.4,passive:1,food:k+'_k',pb:bs});try{FOODS[k+'_k']=[food,k,5];FOODOF[k]=k+'_k'}catch(_){}}
const addTo=(T,o)=>{for(const k in o)for(const b of o[k]){T[b]=T[b]||[];if(!T[b].includes(k))T[b].push(k)}};
try{addTo(BIOME_E,{jezozwierz:[3,25,10],kretoszczur:[2,25,45],kamienny_skarabeusz:[4,15,46],krysztalowy_pajak:[18,22],sowa_cienia:[42,20,58],magmowy_szlam:[17,16],mchowy_golem:[36,27,58],blotny_rak:[7,33,30]});addTo(BIOME_P,{tapir:[9,30],wydra:[13,43,14],motyl:[54,11,34]});Object.assign(HERD,{tapir:2,wydra:2,motyl:3})}catch(e){console.warn('QX nowe',e)}
Object.assign(SPEC,{
 jezozwierz:{kind:'hedgehog',L:1.0,W:0.6,H:0.46,lh:0.16,c:'#3a2a20',sp:'#2a1a12',tip:'#f2ead8',hs:0.28,face:'#4a3a2e',belly:'#5a4a3a',rows:8,per:12,spL:1.7},
 kretoszczur:{L:1.0,W:0.5,H:0.42,lh:0.16,c:'#4a3e3a',c2:'#d8a8a0',c3:'#2e2624',hs:0.32,ml:0.28,mw:0.18,mh:0.16,mc:'#e8b0a8',ears:'tiny',eye:'#1a0a0a',es:0.08,tail:'long',tl:0.45,tc:'#d8a8a0',nose:'#e88a8a',claws:'#f2ead8',paw:'#d8a8a0',neckA:0.1,neckL:0.1,chest:1.05,rump:1.1,
   extra:(B,M,g)=>{M(g.mw*0.18,g.hy-g.s*0.32,g.mz+g.ml*0.48,g.mw*0.14,g.mh*0.5,0.04,'#f6efe0');for(let i=0;i<5;i++)B((hs(i,1)-0.5)*g.W*0.8,g.by+g.H*0.52,(hs(i,2)-0.5)*g.L*0.8,g.W*0.18,0.03,g.W*0.2,'#5a4e48')}},
 kamienny_skarabeusz:{kind:'bug',type:'beetle',L:1.5,W:1.0,H:0.6,lh:0.32,c:'#8a7a5e',c2:'#5a4e3c',c3:'#3a3226',mand:1,amber:'#7fe3ff',eye:'#1a1010',
   extra:(B,M,g)=>{for(let i=0;i<6;i++)B((hs(i,3)-0.5)*g.W*0.7,g.by+g.H*0.6,(hs(i,4)-0.6)*g.L*0.5,g.W*0.2,0.06,g.W*0.2,'#a8987a');B(0,g.by+g.H*0.59,-g.L*0.08,g.W*0.6,0.03,0.05,'!#7fe3ff')}},
 krysztalowy_pajak:{kind:'spider',L:1.2,W:0.9,H:0.48,lh:0.4,c:'#6a5a8a',c2:'#9a8aba',c3:'#3a2e54',eye:'#e8b0ff',glowEye:1,knee:'#c8a8ff',tipC:'#e8d8ff',
   extra:(B,M,g)=>{for(let i=0;i<7;i++){const x=(hs(i,5)-0.5)*g.W*0.7,z=-g.L*0.25+(hs(i,6)-0.5)*g.L*0.4,hh=g.H*(0.4+hs(i,7)*0.6);B(x,g.by+g.H*0.75+hh/2,z,g.W*0.1,hh,g.W*0.1,i%2?'#c8a8ff':'!#e8d0ff');B(x,g.by+g.H*0.75+hh+0.03,z,g.W*0.06,0.06,g.W*0.06,'!#ffffff')}}},
 sowa_cienia:{kind:'bird',L:0.55,W:0.5,H:0.6,lh:0.22,c:'#2a2434',c2:'#3a3446',c3:'#1a1622',hs:0.44,hc:'#3a3446',neckL:0.04,neckA:1.4,neckW:0.4,beak:'#c8b898',bl:0.1,eye:'#bfa0ff',tc:'#1a1622',wc:'#24202e',tipC:'#14101a',ws:1.0,lc:'#5a5068',wingK:'flap',
   extra:(B,M,g)=>{const S=g.s;for(const sg of [1,-1]){B(sg*S*0.24,g.hy+S*0.05,g.hz0+S*0.48,S*0.38,S*0.38,0.03,'#4a4458');B(sg*S*0.24,g.hy+S*0.05,g.hz0+S*0.5,S*0.24,S*0.24,0.03,'!#bfa0ff');B(sg*S*0.24,g.hy+S*0.05,g.hz0+S*0.515,S*0.1,S*0.1,0.02,'#0a0612');B(sg*S*0.32,g.hy+S*0.52,g.hz0+S*0.05,S*0.12,S*0.3,S*0.12,'#1a1622')}for(let i=0;i<4;i++)B(0,g.by-g.H*0.05-i*0.08,g.L*0.38,g.W*0.5,0.03,0.04,'#4a4458')}},
 magmowy_szlam:{kind:'blob',R:0.55,c:'#5a2a1a',c2:'#ff7a1a',c3:'#2a1410',eye:'#ffe070',mouth:'#ffcf3a',glow:'#ffb030',drips:'#ff5a1a'},
 mchowy_golem:{kind:'golem2',W:1.0,lh:0.66,c:'#6a6a58',c2:'#7c7c68',c3:'#4a4a3c',moss:'#4e7a2c',flowers:['#e86a8a','#ffffff','#e8d040','#8ac8ff'],eye:'#b8ff7a',rune:'#b8ff7a',core:'#d8ff9a',
   extra:(B,M,g)=>{for(let i=0;i<8;i++)B((hs(i,8)-0.5)*g.W*1.0,g.ab+hs(i,9)*(g.sh-g.ab),0.34*g.W,g.W*0.08,g.W*(0.2+hs(i,10)*0.3),0.03,'#4e7a2c');B(0.3*g.W,g.sh+0.3*g.W,0,0.06*g.W,0.4*g.W,0.06*g.W,'#5a3a20');B(0.3*g.W,g.sh+0.55*g.W,0,0.3*g.W,0.24*g.W,0.3*g.W,'#5a9a3a')},
   armX:(sg,aw,al)=>[[aw*0.5*sg,-al*0.3,0,0.04,al*0.35,aw*0.6,'#4e7a2c']]},
 blotny_rak:{kind:'crab',L:0.9,W:0.9,H:0.38,lh:0.32,c:'#5a4a2a',c2:'#8a7a4a',c3:'#3a2e18',claw:1.25,tip:'#c84a2a',lc:'#4a3e22',
   extra:(B,M,g)=>{for(let i=0;i<6;i++)B((hs(i,11)-0.5)*g.W*0.8,g.by+g.H*0.56,(hs(i,12)-0.5)*g.L*0.7,g.W*0.2,0.05,g.W*0.16,'#4a5a2a');for(let i=0;i<4;i++)B(0,g.by,-g.L*0.5-0.1-i*0.14,g.W*(0.45-i*0.08),g.H*0.6,0.14,i%2?'#5a4a2a':'#4a3a20');B(0,g.by-0.02,-g.L*0.5-0.68,g.W*0.6,g.H*0.15,0.14,'#4a3a20')}},
 tapir:{L:1.3,W:0.56,H:0.56,lh:0.46,c:'#2a2628',c2:'#3a3638',c3:'#1a1618',hs:0.4,ml:0.32,mw:0.22,mh:0.2,mc:'#2a2628',ears:'round',earC:'#2a2628',earIn:'#f2ece4',eye:'#1a1010',tail:'short',hoof:1,paw:'#1a1618',neckA:0.25,neckL:0.22,neckW:0.42,saddle:'#f2ece4',nose:'#3a3034',
   extra:(B,M,g)=>{B(0,g.hy-g.s*0.28,g.mz+g.ml*0.6,g.mw*0.5,g.mh*0.5,g.ml*0.35,'#2a2628');B(0,g.hy-g.s*0.42,g.mz+g.ml*0.72,g.mw*0.3,g.mh*0.5,g.ml*0.15,'#3a3034');M(g.s*0.38,g.hy+g.s*0.46,g.hz0-g.s*0.06,g.s*0.06,g.s*0.06,g.s*0.06,'#f2ece4')}},
 wydra:{L:0.95,W:0.3,H:0.28,lh:0.12,c:'#6a4a2e',c2:'#c8a880',c3:'#4a3020',hs:0.26,ml:0.12,mw:0.18,mh:0.12,mc:'#d8b890',ears:'tiny',eye:'#0a0806',es:0.14,tail:'long',tl:0.5,tailW:1.6,neckA:0.5,neckL:0.18,neckW:0.24,whisk:1,paw:'#3a2818',chestC:'#c8a880',
   extra:(B,M,g)=>{B(0.05,g.hy-g.s*0.4,g.mz+g.ml*0.2,0.12,0.06,0.18,'#8ab8d8');B(0.05,g.hy-g.s*0.4,g.mz+g.ml*0.2-0.12,0.08,0.08,0.05,'#6a9ab8')}},
 motyl:{kind:'bug',type:'moth',L:0.42,W:0.34,H:0.2,lh:0.14,lc:'#2a1a2a',c:'#2a1a2a',c3:'#1a101a',thorax:'#3a2a3a',compound:'#1a101a',wc:'#e86a2a',wc2:'#2a1a1a',wc3:'#ffd040',wglow:'#8affff',hs:0.14}
});

// v130: żywiołak od nowa — skalne ciało z żarzącymi się szczelinami, wir ognia zamiast nóg, migoczące języki płomieni
BUILD.flame3=function(o){const P=[],{B,M}=MR(P),R=o.rock||'#3a2622',R2=dk(R,0.78),R3=dk(R,1.25),Y='!#fff2b0',Yy='!#ffd050',Or='!#ff8a1a',Rd='!#ff4a12',j=(i,k)=>(hs(i,k)-0.5);
  // tułów z płyt skalnych
  B(0,1.5,0,0.62,0.5,0.44,R);B(0,1.72,0.02,0.78,0.26,0.48,R3);M(0.19,1.58,0.22,0.3,0.32,0.08,R3);B(0,1.16,0.02,0.42,0.3,0.34,R);M(0.13,1.22,0.18,0.16,0.2,0.06,R3);B(0,1.56,-0.24,0.58,0.48,0.08,R2);B(0,0.96,0,0.34,0.16,0.28,R2);
  for(const sg of [1,-1]){B(sg*0.46,1.84,0,0.34,0.3,0.38,R);B(sg*0.5,2.0,-0.01,0.24,0.1,0.28,R3);B(sg*0.56,1.74,0.12,0.18,0.14,0.18,R2)}
  // żarzące się szczeliny i serce
  B(0,1.52,0.262,0.045,0.5,0.02,Yy);B(0,1.4,0.255,0.46,0.035,0.02,Or);M(0.2,1.74,0.262,0.22,0.03,0.02,Or);M(0.13,1.12,0.215,0.03,0.18,0.02,Or);M(0.38,1.84,0.192,0.03,0.2,0.02,Or);B(0,1.62,0.27,0.17,0.17,0.03,Y);B(0,1.62,0.29,0.08,0.08,0.02,'!#ffffff');
  for(let i=0;i<6;i++)B(j(i,1)*0.5,1.1+hs(i,2)*0.7,-0.285,0.03,0.12,0.02,Or);
  // wir ognia zamiast nóg
  B(0,0.82,0,0.4,0.22,0.34,Yy);B(0,0.62,0,0.3,0.22,0.26,Or);B(0,0.42,0,0.2,0.22,0.18,Or);B(0,0.22,0,0.11,0.2,0.11,Rd);
  for(let i=0;i<14;i++){const t=i/13,a=t*10,r=0.34*(1-t*0.75),y=0.92-0.78*t,sz=0.15*(1-t*0.55);B(Math.cos(a)*r,y,Math.sin(a)*r,sz,sz*1.2,sz,i%3===0?Yy:(i%2?Or:Rd))}
  // głowa — skalna czaszka z płonącymi oczami
  const hy=2.17;B(0,hy,0.05,0.38,0.34,0.36,R);B(0,hy-0.17,0.1,0.32,0.1,0.28,R2);B(0,hy+0.12,0.18,0.42,0.07,0.12,R3);M(0.17,hy,0.2,0.08,0.22,0.16,R2);
  M(0.09,hy+0.03,0.234,0.11,0.05,0.02,Y);M(0.09,hy+0.03,0.246,0.05,0.03,0.015,'!#ffffff');B(0,hy-0.12,0.24,0.18,0.035,0.02,Yy);M(0.12,hy-0.06,0.236,0.025,0.08,0.015,Or);
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2+0.3,r=0.5+hs(i,3)*0.25;B(Math.cos(a)*r,0.9+hs(i,4)*1.6,Math.sin(a)*r*0.7,0.045,0.045,0.045,i%2?Yy:Or)}
  for(let i=0;i<4;i++){const a=i/4*Math.PI*2+0.8;B(Math.cos(a)*0.66,1.3+hs(i,5)*0.6,Math.sin(a)*0.5,0.1,0.08,0.1,R2)}
  // języki płomieni (osobne grupy — migoczą)
  const tongue=(h,w)=>[[0,h*0.14,0,w,h*0.3,w,Yy],[0,h*0.42,0,w*0.78,h*0.3,w*0.78,Or],[0,h*0.68,0,w*0.52,h*0.26,w*0.52,Or],[0,h*0.88,0,w*0.3,h*0.18,w*0.3,Rd],[0,h*1.0,0,w*0.14,h*0.1,w*0.14,Rd]];
  const flames=[];const F=(x,y,z,h,w,hd,r)=>flames.push({p:[x,y,z],b:tongue(h,w),h:hd,r,s:0.8+((x*7+z*3)%1+1)%1*0.5});
  for(const [x,z,h,w] of [[0,0,0.75,0.24],[0.13,-0.06,0.55,0.18],[-0.13,-0.06,0.6,0.18],[0.08,0.1,0.42,0.14],[-0.09,0.1,0.45,0.14],[0,-0.14,0.5,0.16]])F(x,hy+0.18,0.05+z,h,w,1);
  for(const sg of [1,-1]){F(sg*0.46,1.98,-0.02,0.5,0.2,0,[0,0,-sg*0.15]);F(sg*0.56,1.95,-0.12,0.36,0.14,0,[0,0,-sg*0.3])}
  F(0,1.84,-0.24,0.7,0.26,0,[-0.25,0,0]);F(0.18,1.7,-0.26,0.5,0.18,0,[-0.35,0,-0.1]);F(-0.18,1.7,-0.26,0.52,0.18,0,[-0.35,0,0.1]);
  // ramiona: skała + płonące dłonie
  const arm=(sg)=>[[0,-0.18,0,0.2,0.36,0.2,R],[sg*0.02,-0.22,0.1,0.12,0.18,0.03,R3],[0,-0.4,0,0.13,0.08,0.13,Or],[0,-0.6,0.02,0.27,0.32,0.27,R2],[sg*0.137,-0.6,0.02,0.02,0.24,0.03,Or],[0,-0.85,0.04,0.26,0.2,0.26,Yy],[0,-0.95,0.05,0.16,0.14,0.16,Y],[0.08,-1.06,0.07,0.05,0.12,0.05,Or],[-0.08,-1.06,0.07,0.05,0.12,0.05,Or],[0,-1.08,0.1,0.05,0.14,0.05,Rd]];
  return{parts:P,hd:{c:[0,hy,0.05],r:0.4},tz:-99,ty:-99,legs:[[0.64,1.86,0,0],[-0.64,1.86,0,1]],lw:0.2,lh:1.0,lc:R,legP:i=>arm(i?-1:1),flames}};
delete FIT.zywiolak;SPEC.zywiolak={kind:'flame3',rock:'#3a2622'};

const old={};
window.__QX={apply(){for(const t in SPEC){const d=EDEF[t];if(!d)continue;try{const sp=SPEC[t],m=fit(t,(BUILD[sp.kind]||quad)(sp));old[t]={pm:PMAP[t]};delete PMAP[t];if(typeof PVAR!=='undefined')delete PVAR[t];Object.assign(d,{parts:m.parts,hd:m.hd,tz:m.tz,ty:m.ty,legs:m.legs,lw:m.lw,lh:m.lh,lc:m.lc,legP:m.legP,lf:null,_ext:[],hop:(m.hop!=null?m.hop:d.hop),wingP:m.wingP||null,wingAt:m.wingAt||null,wingK:m.wingK,wingMat:m.wingMat,flames:m.flames||null});if(d.bh)d.bh=Math.max(d.bh,0)}catch(e){console.warn('QX',t,e)}}},SPEC,quad,fit};
window.__QX.apply();
// ---- v128 cz.4: harpia, syrena, meduza, żabnica, murena ----
try{
 HDECO.harpia=(u)=>{const F1='#6a4a8a',F2='#8a6aaa',F3='#c8a8e0',TL='#d8a030';
  for(const a of [u.la,u.ra]){if(!a)continue;const L=[];for(let i=0;i<6;i++){const y=-0.08-i*0.14,len=0.42+i*0.07;L.push([0,y,-0.12-len/2,0.05,0.16,len,i%2?F1:F2]);L.push([0,y-0.05,-0.14-len,0.04,0.1,0.16,F3])}L.push([0,-0.5,-0.06,0.14,0.9,0.12,F2]);HD(a,L)}
  HD(u.torso,[[0,0.3,0.17,0.42,0.42,0.06,F3],[0,0.05,0.17,0.36,0.14,0.05,F2],[0,-0.22,0,0.5,0.22,0.36,F1],[0,-0.36,0,0.56,0.1,0.42,F2],[0,0.5,-0.18,0.4,0.2,0.1,F2],[0,-0.1,-0.24,0.26,0.6,0.06,F1],[0,-0.42,-0.28,0.34,0.24,0.05,F3]]);
  for(const l of [u.ll,u.rl]){if(!l)continue;HD(l,[[0,-0.18,0,0.26,0.32,0.26,F1],[0,-0.56,0,0.12,0.5,0.12,TL],[0,-0.8,0.12,0.12,0.06,0.3,TL],[0.09,-0.8,0.1,0.07,0.06,0.26,TL],[-0.09,-0.8,0.1,0.07,0.06,0.26,TL],[0,-0.84,0.3,0.06,0.08,0.08,'#2a1a10'],[0.1,-0.84,0.25,0.05,0.08,0.07,'#2a1a10'],[-0.1,-0.84,0.25,0.05,0.08,0.07,'#2a1a10'],[0,-0.8,-0.12,0.07,0.06,0.16,TL]])}
  HD(u.head,[[0,0.58,-0.1,0.5,0.14,0.46,F1],[0,0.72,-0.2,0.1,0.26,0.1,F3],[0.1,0.7,-0.26,0.08,0.2,0.08,F2],[-0.1,0.7,-0.26,0.08,0.2,0.08,F2],[0,0.36,-0.28,0.5,0.56,0.12,F1],[0,0.05,-0.3,0.36,0.3,0.1,F2],[0.26,0.36,0,0.08,0.36,0.3,F1],[-0.26,0.36,0,0.08,0.36,0.3,F1]])};
 HDECO.syrena=(u)=>{const T1='#2a8a7a',T2='#3aaa9a',T3='#1e6a5e',FIN='#5ad8c8';
  for(const l of [u.ll,u.rl]){if(!l)continue;const L=[[0,-0.32,0,0.32,0.66,0.32,T1]];for(let i=0;i<5;i++)for(const x of [-0.08,0.08])L.push([x,-0.1-i*0.13,0.165,0.1,0.07,0.02,i%2?T2:T3]);HD(l,L)}
  if(u.ll)HD(u.ll,[[0.12,-0.72,-0.05,0.56,0.08,0.36,T2],[0.12,-0.78,-0.32,0.7,0.05,0.26,FIN],[0.38,-0.8,-0.46,0.2,0.04,0.18,FIN],[-0.14,-0.8,-0.46,0.2,0.04,0.18,FIN],[0.12,-0.8,-0.42,0.5,0.03,0.08,'!#8affff']]);
  HD(u.torso,[[0.1,0.42,0.18,0.15,0.13,0.05,'#e8d8a8'],[-0.1,0.42,0.18,0.15,0.13,0.05,'#e8d8a8'],[0.1,0.43,0.205,0.06,0.06,0.02,'#c89878'],[-0.1,0.43,0.205,0.06,0.06,0.02,'#c89878'],[0,-0.2,0,0.5,0.3,0.36,T1],[0,-0.05,0.18,0.44,0.06,0.04,T2],[0.16,0.12,0.18,0.06,0.06,0.03,'#f4efe4'],[-0.05,0.08,0.18,0.05,0.05,0.03,'#f4efe4'],[0.06,0.16,0.18,0.04,0.04,0.03,'#f4efe4']]);
  HD(u.head,[[0,0.62,-0.12,0.54,0.14,0.44,'#2a8a8a'],[0,0.28,-0.3,0.44,0.7,0.1,'#2a8a8a'],[0,-0.05,-0.32,0.36,0.3,0.08,'#2a7a7a'],[0.26,0.3,-0.02,0.08,0.5,0.3,'#2a8a8a'],[-0.26,0.3,-0.02,0.08,0.5,0.3,'#2a8a8a'],[0.2,0.6,0.12,0.12,0.12,0.04,'#ff9a5a'],[0.2,0.6,0.14,0.04,0.2,0.02,'#ff9a5a'],[0.2,0.6,0.14,0.2,0.04,0.02,'#ff9a5a']])};
 const P=(L,...b)=>L.push(b),M=(L,x,y,z,w,h,d,c)=>{L.push([x,y,z,w,h,d,c],[-x,y,z,w,h,d,c])};
 if(SEA.meduza){SEA.meduza._b=null;SEA.meduza.build=function(){const C='#c8b0e8',C2='#b898e0',C3='#a888d8',s0=[];
   P(s0,0,1.3,0,1.44,0.38,1.44,C);P(s0,0,1.56,0,1.16,0.3,1.16,C2);P(s0,0,1.76,0,0.76,0.2,0.76,C);P(s0,0,1.88,0,0.4,0.1,0.4,C2);P(s0,0,1.1,0,1.56,0.12,1.56,C3);
   for(let i=0;i<16;i++){const a=i/16*6.283;P(s0,Math.cos(a)*0.78,1.04,Math.sin(a)*0.78,0.2,0.1,0.2,i%2?C2:C3)}
   for(let i=0;i<8;i++){const a=i/8*6.283+0.2;P(s0,Math.cos(a)*0.45,1.5,Math.sin(a)*0.45,0.08,0.3,0.08,'!#e8a8ff')}
   P(s0,0,1.36,0,0.56,0.34,0.56,'!#e080ff');P(s0,0,1.62,0,0.26,0.14,0.26,'!#ffb0ff');for(const [x,z] of [[0.18,0.1],[-0.15,-0.12],[0.05,-0.2]])P(s0,x,1.25,z,0.14,0.12,0.14,'!#ff8af0');
   for(let i=0;i<12;i++){const a=i/12*6.283;P(s0,Math.cos(a)*0.74,1.08,Math.sin(a)*0.74,0.07,0.06,0.07,'!#c890ff')}
   const tents=[];for(let i=0;i<12;i++){const a=i/12*6.283+0.3;tents.push({x:Math.cos(a)*0.64,y:1.04,z:Math.sin(a)*0.64,rx:1.5708,ry:0,n:7,len:0.34,w:0.055,c:'#d8c8f0',c2:'#c0a8e8',tip:'!#e0a0ff',ph:i})}
   for(let i=0;i<5;i++){const a=i/5*6.283;tents.push({x:Math.cos(a)*0.2,y:1.0,z:Math.sin(a)*0.2,rx:1.5708,ry:0,n:5,len:0.34,w:0.17,c:C2,c2:C3,su:'#e8d8ff',ph:i*1.7})}
   return{segs:[{L:s0,len:0}],tents}}}
 if(SEA.zabnica){SEA.zabnica._b=null;const ob=SEA.zabnica.build;SEA.zabnica.build=function(){const r=ob();const s0=r.segs[0].L,s1=r.segs[1].L;
   for(let i=0;i<12;i++){const a=i*1.7;P(s0,Math.cos(a)*0.6,0.7+Math.sin(a*1.3)*0.35,-0.2+Math.sin(a)*0.45,0.05,0.05,0.05,'!#7affe0')}
   for(let k=0;k<5;k++)P(s0,0,1.38+Math.sin(k)*0.03,0.1-k*0.18,0.05,0.22-k*0.03,0.08,'#5a4a50');M(s0,0.62,0.95,-0.35,0.06,0.3,0.4,'#3a3038');M(s0,0.66,0.98,-0.5,0.04,0.36,0.16,'#5a4a50');
   P(s1,0,1.28,-0.35,0.05,0.24,0.4,'#3a3038');for(let i=0;i<4;i++)P(s1,0,0.82,-0.92-i*0.02,0.04,0.7-i*0.12,0.06,i%2?'#3a3038':'#5a4a50');P(s1,0,0.82,-0.95,0.03,0.08,0.08,'!#7affe0');
   return r}}
 if(SEA.murena){SEA.murena._b=null;const ob=SEA.murena.build;SEA.murena.build=function(){const r=ob();for(let i=1;i<r.segs.length;i++){const L=r.segs[i].L,w=0.5-i*0.045;for(let k=0;k<4;k++)P(L,(k%2?1:-1)*w*0.505,0.6+((k*37)%5)*w*0.12,-0.2-k*0.18,0.02,0.07,0.07,'#d8c850');P(L,0,0.7-w*0.55,-0.4,0.04,0.1,0.75,'#3e5a1c')}return r}}
}catch(e){console.warn('QX cz.4',e)}

})();
