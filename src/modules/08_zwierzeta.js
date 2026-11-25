// =================== ZWIERZĘTA: modele, gatunki, jedzenie do oswajania ===================
// konstruktor czworonoga (jednostki świata; środki boxów); detale wystają ≥0,02 ponad powierzchnię (bez nachodzenia)
function Q(o){
  const L=o.L,W=o.W,Hb=o.Hb,ll=o.legL,y=ll+Hb/2,hs=o.hs,hy=o.hy??Hb*0.45,hz=o.hz??0,hf=L/2+hz+hs/2,c2=o.c2||o.c,P=[];
  P.push([0,y,0,W,Hb,L,o.c],[0,y-Hb/2+0.06,0.02,W*0.86,0.16,L*0.8,c2],[0,y+Hb*0.04,L*0.3,W+0.05,Hb*0.84,L*0.3,o.c],[0,y+Hb*0.02,-L*0.29,W+0.035,Hb*0.88,L*0.3,o.c],[0,y-Hb*0.12,L/2+0.012,W*0.55,Hb*0.42,0.05,c2,0]);
  if(o.neck)P.push([0,y+o.neck[1]/2,L/2-o.neck[2]/2+0.02,o.neck[0],o.neck[1],o.neck[2],o.c]);
  P.push([0,y+hy,L/2+hz,hs,hs,hs,o.hc||o.c]);
  const sn=o.snout;let sf=hf;if(sn){P.push([0,y+hy-hs*0.18,hf+sn[0]/2-0.01,sn[2],sn[1],sn[0],sn[3]]);sf=hf+sn[0]-0.01;if(o.nose)P.push([0,y+hy-hs*0.18+sn[1]*0.22,sf+0.015,sn[2]*0.62,sn[1]*0.36,0.04,o.nose])}
  const ey=y+hy+hs*0.14,ex=hs*0.3,ec=o.eye||'#1a1a1a',es=Math.max(0.07,hs*0.24);P.push([ex,ey,hf+0.012,es,es*1.05,0.03,'#f4f0e6',0],[-ex,ey,hf+0.012,es,es*1.05,0.03,'#f4f0e6',0],[ex,ey-es*0.08,hf+0.024,es*0.62,es*0.8,0.03,ec,0],[-ex,ey-es*0.08,hf+0.024,es*0.62,es*0.8,0.03,ec,0],[ex-es*0.18,ey+es*0.2,hf+0.036,es*0.24,es*0.24,0.02,'#ffffff',0],[-ex-es*0.18,ey+es*0.2,hf+0.036,es*0.24,es*0.24,0.02,'#ffffff',0]);
  const eh=o.eh||0.14,ecl=o.ec||o.hc||o.c;
  if(o.ears==='up')P.push([hs*0.32,y+hy+hs/2+eh/2-0.02,L/2+hz-hs*0.15,0.09,eh,0.07,ecl],[-hs*0.32,y+hy+hs/2+eh/2-0.02,L/2+hz-hs*0.15,0.09,eh,0.07,ecl]);
  if(o.ears==='side')P.push([hs/2+0.04,y+hy+hs*0.15,L/2+hz-hs*0.1,0.1,0.07,eh,ecl],[-hs/2-0.04,y+hy+hs*0.15,L/2+hz-hs*0.1,0.1,0.07,eh,ecl]);
  if(o.ears==='down')P.push([hs/2+0.03,y+hy+hs*0.02,L/2+hz,0.06,eh,0.12,ecl],[-hs/2-0.03,y+hy+hs*0.02,L/2+hz,0.06,eh,0.12,ecl]);
  if(o.ears==='round')P.push([hs*0.36,y+hy+hs/2+0.03,L/2+hz-hs*0.2,0.12,0.1,0.06,ecl],[-hs*0.36,y+hy+hs/2+0.03,L/2+hz-hs*0.2,0.12,0.1,0.06,ecl]);
  const tc=o.tc||o.c;
  if(o.tail==='short')P.push([0,y+Hb*0.22,-L/2-0.05,0.12,0.12,0.12,tc]);
  if(o.tail==='long')P.push([0,y+Hb*0.1,-L/2-0.24,0.08,0.08,0.5,tc]);
  if(o.tail==='hang')P.push([0,y-Hb*0.15,-L/2-0.06,0.12,Hb+0.25,0.12,tc]);
  if(o.tail==='fluffy')P.push([0,y+Hb*0.05,-L/2-0.22,0.2,0.2,0.46,tc],[0,y+Hb*0.05,-L/2-0.48,0.14,0.14,0.08,o.tip||tc]);
  if(o.tail==='up')P.push([0,y+Hb*0.35,-L/2-0.06,0.07,0.07,0.12,tc],[0,y+Hb*0.7,-L/2-0.1,0.07,0.4,0.07,tc]);
  {// v116: detale ogólne — grzbiet, łopatki i uda nad nogami, łuk brwiowy, nozdrza, pysk, wnętrze uszu, sierść
   const lx0=W/2-o.legW/2-0.03,lz0=L/2-o.legW/2-0.06,cD=darker(o.c,0.86),cL=darker(o.c,1.1),lw=o.legW;
   P.push([0,y+Hb/2+0.012,0,W*0.62,0.03,L*0.84,cL]);
   for(const sx of [1,-1])for(const sz of [1,-1])P.push([sx*(lx0+0.012),y-Hb*0.28,sz*lz0*0.96,lw*1.3,Hb*0.5,lw*1.7,sz>0?o.c:cD]);
   P.push([0,y+hy+hs*0.36,hf+0.006,hs*0.84,hs*0.1,0.035,darker(o.hc||o.c,0.8),0]);
   if(sn){const nz=sf+0.02,ny=y+hy-hs*0.18;P.push([sn[2]*0.22,ny+sn[1]*0.12,nz,sn[2]*0.14,sn[1]*0.16,0.02,'#1a1412',0],[-sn[2]*0.22,ny+sn[1]*0.12,nz,sn[2]*0.14,sn[1]*0.16,0.02,'#1a1412',0],[0,ny-sn[1]*0.32,nz-0.004,sn[2]*0.56,0.025,0.02,darker(sn[3],0.6),0])}
   else P.push([0,y+hy-hs*0.3,hf+0.008,hs*0.4,0.03,0.02,darker(o.hc||o.c,0.6),0]);
   if(o.ears==='up')P.push([hs*0.32,y+hy+hs/2+eh/2,L/2+hz-hs*0.15+0.036,0.05,eh*0.7,0.01,o.ein||'#d8a8a0',0],[-hs*0.32,y+hy+hs/2+eh/2,L/2+hz-hs*0.15+0.036,0.05,eh*0.7,0.01,o.ein||'#d8a8a0',0]);
   if(o.fur){const fc=o.fur===true?darker(o.c,0.8):o.fur,n=Math.max(4,Math.round(L/0.22));for(let k=0;k<n;k++){const z=-L/2+L*(k+0.5)/n,hh=0.12+((k*7)%3)*0.05;P.push([W/2+0.02,y-Hb/2+hh/2-0.06,z,0.06,hh+0.12,L/n*0.9,k%2?fc:o.c],[-W/2-0.02,y-Hb/2+hh/2-0.06,z,0.06,hh+0.12,L/n*0.9,k%2?o.c:fc],[0,y-Hb/2-hh/2+0.04,z,W*0.8,hh,L/n*0.9,fc])}P.push([0,y-Hb*0.15,L/2+0.04,W*0.7,Hb*0.7,0.08,fc])}}
  if(o.extra)P.push(...o.extra(y,hy,hf,L,W,Hb,hs));
  const lx=W/2-o.legW/2-0.03,lz=L/2-o.legW/2-0.06,ly=y-Hb/2+0.03;
  return{hd:{c:[0,y+hy,L/2+hz],r:hs},tz:-L/2,ty:y+Hb*0.1,parts:P,legs:[[lx,ly,lz,0],[-lx,ly,lz,1],[lx,ly,-lz,1],[-lx,ly,-lz,0]],lw:o.legW,lh:ll+0.03,lc:o.lc||o.c,lf:o.hoof||darker(o.lc||o.c,0.7)};
}
// dwunogi ptak
function BIRD(o){const y=o.legL+o.Hb/2,P=[[0,y,0,o.W,o.Hb,o.L,o.c],[0,y+o.Hb/2+o.hs/2-0.04,o.L/2-o.hs/2+0.02,o.hs,o.hs,o.hs,o.hc||o.c],
  [0,y+o.Hb/2+o.hs*0.42,o.L/2+0.06,o.bw||0.1,0.06,0.14,o.beak],[o.hs*0.32,y+o.Hb/2+o.hs*0.58,o.L/2-o.hs/2+0.02+o.hs*0.3,0.04,0.05,o.hs*0.6+0.02,'#1a1a1a'],[-o.hs*0.32,y+o.Hb/2+o.hs*0.58,o.L/2-o.hs/2+0.02+o.hs*0.3,0.04,0.05,o.hs*0.6+0.02,'#1a1a1a'],
  [o.W/2+0.03,y,-0.02,0.06,o.Hb*0.7,o.L*0.7,o.wc||o.c],[-o.W/2-0.03,y,-0.02,0.06,o.Hb*0.7,o.L*0.7,o.wc||o.c],[0,y+0.04,-o.L/2-0.05,o.W*0.6,o.Hb*0.4,0.12,o.tc||o.c]];
  {// v116: pierś, lotki, wachlarz ogona, oczy z refleksem
   const hyB=y+o.Hb/2+o.hs/2-0.04,hzB=o.L/2-o.hs/2+0.02,wc=o.wc||o.c,wD=darker(wc,0.7);P.push([0,y-o.Hb*0.05,o.L/2+0.012,o.W*0.7,o.Hb*0.7,0.03,o.chest||darker(o.c,1.15),0]);
   for(const sx of [1,-1]){P.push([sx*(o.W/2+0.05),y-o.Hb*0.18,-o.L*0.3,0.04,o.Hb*0.3,o.L*0.36,wD]);P.push([sx*o.hs*0.36,hyB+o.hs*0.12,hzB+o.hs*0.3,0.05,0.05,0.03,'#ffffff',0])}
   const tc=o.tc||o.c;for(const sx of [-1,0,1])P.push([sx*o.W*0.22,y+0.06+Math.abs(sx)*0.02,-o.L/2-0.14,o.W*0.18,0.04,0.16,sx?darker(tc,0.85):tc])}
  if(o.extra)P.push(...o.extra(y));return{hd:{c:[0,y+o.Hb/2+o.hs/2-0.04,o.L/2-o.hs/2+0.02],r:o.hs},tz:-o.L/2,ty:y,parts:P,legs:[[0.08,o.legL+0.02,0,0],[-0.08,o.legL+0.02,0,1]],lw:0.05,lh:o.legL+0.02,lc:o.lc,lf:o.lc}}
const PAS=(def,n,hp,spd,food,biomes)=>Object.assign(def,{n,hp,dmg:Math.max(2,hp/12),spd,aggro:0,rng:1.4,cd:1.4,passive:1,food,pb:biomes});
const ANIM={
 owca:PAS(Q({L:0.95,W:0.62,Hb:0.56,legL:0.34,legW:0.13,c:'#efe9dc',c2:'#e4ddcc',hs:0.32,hc:'#3a3330',snout:[0.12,0.16,0.2,'#3a3330'],ears:'side',ec:'#3a3330',eh:0.14,tail:'short',lc:'#3a3330',hoof:'#2a2420',
   extra:(y,hy,hf,L,W,Hb,hs)=>[[0,y+Hb/2+0.04,0,W*0.8,0.08,L*0.72,'#f7f2e8'],[0,y+hy+hs/2+0.04,L/2-0.02,0.26,0.08,0.24,'#f7f2e8'],[W/2+0.03,y+0.02,0.1,0.04,Hb*0.6,L*0.5,'#f2ecdf'],[-W/2-0.03,y+0.02,0.1,0.04,Hb*0.6,L*0.5,'#f2ecdf']]}),'Owca',24,2.6,'koniczyna',[2]),
 krowa:PAS(Q({L:1.5,W:0.76,Hb:0.72,legL:0.52,legW:0.17,c:'#f2ede4',c2:'#e9e2d6',hs:0.42,snout:[0.14,0.22,0.3,'#e8b8a8'],nose:'#c8887a',ears:'side',eh:0.18,tail:'hang',tc:'#2a2420',lc:'#f2ede4',hoof:'#2a2420',
   extra:(y,hy,hf,L,W,Hb,hs)=>[[W/2+0.02,y+0.06,0.24,0.04,0.34,0.4,'#2a2420'],[-W/2-0.02,y-0.02,-0.3,0.04,0.3,0.36,'#2a2420'],[0,y+Hb/2+0.02,-0.2,0.34,0.04,0.3,'#2a2420'],[hs*0.42,y+hy+hs/2+0.05,L/2-0.05,0.06,0.1,0.06,'#e8e0cc'],[-hs*0.42,y+hy+hs/2+0.05,L/2-0.05,0.06,0.1,0.06,'#e8e0cc'],[0,y-Hb/2-0.06,-0.3,0.24,0.12,0.24,'#e8a8a0']]}),'Krowa',40,2.4,'siano',[2]),
 swinia:PAS(Q({L:1.0,W:0.64,Hb:0.52,legL:0.24,legW:0.15,c:'#eab0a0',c2:'#e4a494',hs:0.38,snout:[0.1,0.18,0.24,'#e09a8a'],nose:'#c0706a',ears:'down',ec:'#e4a090',eh:0.14,tail:'short',lc:'#e4a494',hoof:'#8a5a4a'}),'Świnia',28,2.8,'jablko',[2,3]),
 kon:PAS(Q({L:1.55,W:0.56,Hb:0.66,legL:0.8,legW:0.15,c:'#7a4a2a',c2:'#6a3e22',hs:0.32,hy:0.78,hz:0.04,neck:[0.3,0.62,0.4],snout:[0.32,0.24,0.24,'#6a3a20'],nose:'#2a1a12',ears:'up',eh:0.12,tail:'hang',tc:'#2a1a10',lc:'#6a3e22',hoof:'#2a2420',
   extra:(y,hy,hf,L)=>[[0,y+0.72,L/2-0.18,0.08,0.5,0.24,'#2a1a10'],[0,y+0.36,L/2-0.36,0.08,0.4,0.22,'#2a1a10'],[0,y+hy+0.2,L/2+0.02,0.08,0.06,0.2,'#2a1a10']]}),'Koń',46,3.4,'owies',[2]),
 krolik:PAS(Object.assign(Q({L:0.42,W:0.3,Hb:0.3,legL:0.08,legW:0.08,c:'#c9b49a',c2:'#efe6d6',hs:0.24,hy:0.14,ears:'up',eh:0.28,tail:'short',tc:'#f7f2e8',lc:'#c9b49a'}),{hop:1}),'Królik',10,3.2,'marchew',[2,3]),
 jelen:PAS(Q({L:1.3,W:0.5,Hb:0.6,legL:0.82,legW:0.12,c:'#9a6a3e',c2:'#e8d8c0',hs:0.3,hy:0.66,hz:0.02,neck:[0.26,0.5,0.32],snout:[0.18,0.18,0.18,'#8a5a32'],nose:'#2a1a12',ears:'side',eh:0.16,tail:'short',tc:'#f2ece0',lc:'#8a5a32',hoof:'#2a2420',
   extra:(y,hy,hf,L,W,Hb,hs)=>{const a='#d8c8a8',t=y+hy+hs/2,z=L/2+0.02;return[[0.12,t+0.18,z,0.05,0.36,0.05,a],[-0.12,t+0.18,z,0.05,0.36,0.05,a],[0.24,t+0.32,z-0.04,0.24,0.05,0.05,a],[-0.24,t+0.32,z-0.04,0.24,0.05,0.05,a],[0.14,t+0.42,z+0.06,0.05,0.2,0.05,a],[-0.14,t+0.42,z+0.06,0.05,0.2,0.05,a],[0.34,t+0.44,z-0.04,0.05,0.2,0.05,a],[-0.34,t+0.44,z-0.04,0.05,0.2,0.05,a]]}}),'Jeleń',34,4.2,'jagody',[3]),
 lis:PAS(Q({L:0.8,W:0.32,Hb:0.32,legL:0.28,legW:0.08,c:'#d0662a',c2:'#f2ece0',hs:0.3,snout:[0.2,0.12,0.14,'#f2ece0'],nose:'#1a1a1a',ears:'up',eh:0.16,ec:'#a84a1a',tail:'fluffy',tc:'#d0662a',tip:'#f7f2e8',lc:'#3a2418'}),'Lis',16,4.4,'kurczak',[3]),
 niedzwiedz:PAS(Q({L:1.6,W:0.92,Hb:0.86,legL:0.44,legW:0.24,c:'#5a3a22',c2:'#4a2e1a',hs:0.52,snout:[0.2,0.24,0.28,'#8a6a4a'],nose:'#1a1a1a',ears:'round',tail:'short',lc:'#4a2e1a'}),'Niedźwiedź',70,3.6,'miod',[3,5]),
 wielblad:PAS(Q({L:1.6,W:0.62,Hb:0.7,legL:1.0,legW:0.14,c:'#c9a46a',c2:'#b8925a',hs:0.32,hy:0.98,hz:0.36,neck:[0.26,0.86,0.3],snout:[0.3,0.2,0.22,'#b8925a'],nose:'#3a2a1a',ears:'up',eh:0.08,tail:'hang',tc:'#8a6a3a',lc:'#b8925a',hoof:'#5a4a3a',
   extra:(y,hy,hf,L,W,Hb)=>[[0,y+Hb/2+0.16,0,0.46,0.34,0.6,'#c49c60'],[0,y+Hb/2+0.36,0,0.3,0.1,0.36,'#c49c60'],[0,y+0.55,L/2+0.2,0.24,0.18,0.5,'#c9a46a']]}),'Wielbłąd',50,3.0,'daktyle',[4]),
 jaszczurka:PAS({n:'',parts:[[0,0.17,0,0.28,0.16,0.7,'#6a8a3a'],[0,0.26,0,0.2,0.04,0.5,'#8aa84a'],[0,0.18,0.44,0.22,0.14,0.22,'#6a8a3a'],[0.08,0.24,0.52,0.05,0.05,0.04,'#e8c040'],[-0.08,0.24,0.52,0.05,0.05,0.04,'#e8c040'],[0,0.12,-0.55,0.1,0.08,0.5,'#5a7a32'],[0,0.1,-0.85,0.06,0.05,0.2,'#5a7a32']],
   legs:[[0.18,0.14,0.22,0],[-0.18,0.14,0.22,1],[0.18,0.14,-0.2,1],[-0.18,0.14,-0.2,0]],lw:0.07,lh:0.14,lc:'#5a7a32'},'Jaszczurka',12,4.0,'szarancza',[4]),
 pingwin:PAS(BIRD({L:0.36,W:0.38,Hb:0.56,legL:0.06,hs:0.28,c:'#1e2228',hc:'#1e2228',beak:'#e8a03a',wc:'#1e2228',lc:'#e8a03a',extra:y=>[[0,y-0.02,0.2,0.28,0.46,0.04,'#f2f2ee']]}),'Pingwin',14,1.8,'sledz',[5]),
 renifer:PAS(Q({L:1.3,W:0.52,Hb:0.6,legL:0.78,legW:0.13,c:'#8a7a68',c2:'#e8e2d6',hs:0.3,hy:0.64,neck:[0.28,0.5,0.32],snout:[0.18,0.18,0.18,'#6a5a48'],nose:'#2a2420',ears:'side',eh:0.14,tail:'short',tc:'#f2ece0',lc:'#6a5a48',hoof:'#2a2420',
   extra:(y,hy,hf,L,W,Hb,hs)=>{const a='#cfc2a8',t=y+hy+hs/2,z=L/2;return[[0,y+0.3,L/2-0.12,0.32,0.3,0.12,'#efe9df'],[0.13,t+0.2,z,0.05,0.4,0.05,a],[-0.13,t+0.2,z,0.05,0.4,0.05,a],[0.25,t+0.38,z-0.06,0.26,0.05,0.05,a],[-0.25,t+0.38,z-0.06,0.26,0.05,0.05,a],[0.16,t+0.46,z+0.1,0.05,0.24,0.05,a],[-0.16,t+0.46,z+0.1,0.05,0.24,0.05,a],[0.36,t+0.52,z-0.06,0.05,0.24,0.05,a],[-0.36,t+0.52,z-0.06,0.05,0.24,0.05,a],[0,t-0.2,z+0.32,0.12,0.06,0.04,'#efe9df']]}}),'Renifer',36,4.0,'porost',[5]),
 koza:PAS(Q({L:0.9,W:0.42,Hb:0.46,legL:0.44,legW:0.11,c:'#d8d0c0',c2:'#c8c0b0',hs:0.28,hy:0.4,snout:[0.12,0.14,0.16,'#c8c0b0'],nose:'#3a3330',ears:'side',eh:0.12,tail:'up',lc:'#b8b0a0',hoof:'#3a3330',
   extra:(y,hy,hf,L,W,Hb,hs)=>[[0,y+hy-hs/2-0.08,L/2+0.1,0.08,0.16,0.08,'#f2eee6'],[0.09,y+hy+hs/2+0.1,L/2-0.08,0.05,0.18,0.05,'#8a8070'],[-0.09,y+hy+hs/2+0.1,L/2-0.08,0.05,0.18,0.05,'#8a8070'],[0.09,y+hy+hs/2+0.2,L/2-0.18,0.05,0.05,0.16,'#8a8070'],[-0.09,y+hy+hs/2+0.2,L/2-0.18,0.05,0.05,0.16,'#8a8070']]}),'Koza górska',22,3.4,'sol',[6]),
 kaczka:PAS(BIRD({L:0.46,W:0.3,Hb:0.26,legL:0.12,hs:0.2,c:'#8a7a62',hc:'#2f6a3a',beak:'#e8b03a',bw:0.12,wc:'#6a5a48',tc:'#3a3a3a',lc:'#e8903a',extra:y=>[[0,y+0.16,0.16,0.22,0.04,0.06,'#f2f2ee']]}),'Kaczka',8,2.4,'chleb',[7,1]),
 zolw:PAS({n:'',parts:[[0,0.2,0,0.66,0.24,0.8,'#4a6a3a'],[0,0.34,0,0.5,0.1,0.6,'#5a7a42'],[0,0.4,0,0.26,0.06,0.3,'#6a8a4a'],[0,0.1,0,0.72,0.06,0.86,'#8a7a4a'],[0,0.2,0.5,0.2,0.18,0.24,'#8a9a5a'],[0.06,0.25,0.63,0.04,0.04,0.03,'#1a1a1a'],[-0.06,0.25,0.63,0.04,0.04,0.03,'#1a1a1a']],
   legs:[[0.28,0.12,0.28,0],[-0.28,0.12,0.28,1],[0.28,0.12,-0.28,1],[-0.28,0.12,-0.28,0]],lw:0.12,lh:0.12,lc:'#8a9a5a'},'Żółw',30,0.9,'wodorosty',[1]),
 kura:PAS(BIRD({L:0.36,W:0.26,Hb:0.26,legL:0.16,hs:0.18,c:'#f4f0e6',hc:'#f4f0e6',beak:'#e8b03a',lc:'#e8b03a',extra:y=>[[0,y+0.32,0.1,0.04,0.08,0.12,'#d0302a'],[0,y+0.17,0.21,0.04,0.06,0.04,'#d0302a']]}),'Kura',6,2.6,'ziarno',[]),
 kot:PAS(Q({L:0.56,W:0.24,Hb:0.26,legL:0.2,legW:0.07,c:'#8a7a6a',c2:'#c8b8a4',hs:0.24,hy:0.16,ears:'up',eh:0.09,tail:'up',lc:'#8a7a6a',eye:'#7ab040',
   extra:(y,hy,hf,L,W,Hb)=>[[0,y+Hb/2+0.02,0.1,W*0.7,0.04,0.06,'#5a4a3a'],[0,y+Hb/2+0.02,-0.08,W*0.7,0.04,0.06,'#5a4a3a']]}),'Kot',8,3.6,'ryba',[]),
 pies:PAS(Q({L:0.8,W:0.34,Hb:0.36,legL:0.34,legW:0.1,c:'#a8783a',c2:'#d8c0a0',hs:0.3,snout:[0.16,0.14,0.16,'#d8c0a0'],nose:'#1a1a1a',ears:'down',ec:'#7a5426',eh:0.16,tail:'up',lc:'#a8783a'}),'Pies',20,4.2,'kielbasa',[]),
};
for(const k in ANIM)ANIM[k].n=ANIM[k].n||k;
// ulepszone modele wrogów (ten sam format)
Object.assign(EDEF.wilk,Q({L:1.15,W:0.5,Hb:0.5,legL:0.52,legW:0.13,c:'#8a8a90',c2:'#c8c8cc',hs:0.38,snout:[0.24,0.17,0.2,'#a8a8ae'],nose:'#1a1a1a',eye:'#e8c040',ears:'up',eh:0.16,tail:'fluffy',tc:'#77777d',tip:'#c8c8cc',lc:'#77777d',
  extra:(y,hy,hf,L,W,Hb)=>[[0,y+Hb/2+0.03,L/2-0.25,W*0.7,0.08,0.4,'#6a6a70']]}));
Object.assign(EDEF.dzik,Q({L:1.2,W:0.7,Hb:0.64,legL:0.4,legW:0.16,c:'#5a3e2a',c2:'#4a3220',hs:0.44,snout:[0.16,0.2,0.26,'#7a5a44'],nose:'#2a1a12',eye:'#e04a2a',ears:'up',eh:0.12,tail:'short',lc:'#3e2a1c',hoof:'#1a1410',
  extra:(y,hy,hf,L,W,Hb,hs)=>[[0,y+Hb/2+0.06,0,0.16,0.12,L*0.8,'#2e2014'],[0.15,y+hy-hs*0.2,hf+0.1,0.05,0.18,0.05,'#f2ead8'],[-0.15,y+hy-hs*0.2,hf+0.1,0.05,0.18,0.05,'#f2ead8']]}));
// jedzenie: każdy gatunek ma własne, w opisie przedmiotu widać dla kogo
const FOODS={koniczyna:['Koniczyna','owca',5],siano:['Snop siana','krowa',6],jablko:['Jabłko','swinia',5],ziarno:['Garść ziarna','kura',3],owies:['Worek owsa','kon',14],marchew:['Marchewka','krolik',3],
  jagody:['Jagody leśne','jelen',10],kurczak:['Pieczony kurczak','lis',7],miod:['Plaster miodu','niedzwiedz',16],daktyle:['Daktyle','wielblad',12],szarancza:['Szarańcza','jaszczurka',4],sledz:['Śledź','pingwin',5],
  porost:['Porost','renifer',10],sol:['Bryłka soli','koza',6],chleb:['Okruchy chleba','kaczka',2],wodorosty:['Wodorosty','zolw',4],ryba:['Ryba','kot',4],kielbasa:['Kiełbasa','pies',6],
  mieso:['Surowe mięso','wilk',8],zoledzie:['Żołędzie','dzik',6],galareta:['Galaretka','slime',5],malze:['Małże','krab',5],muchy:['Słoik much','ropucha',4],jajo:['Pajęcze jajo','pajak',12],
  skarabeusz:['Skarabeusz','skorpion',12],zlote_jablko:['Złote jabłko','gryf',45],lod:['Lodowy kryształ','yeti',20],krysztal:['Rubinowy kryształ','golem',24]};
Object.assign(FOODS,{ziola:['Snop ziół stepowych','zubr',9],galazki:['Gałązki wierzby','bobr',4],robaki:['Garść dżdżownic','jez',3],krewetki:['Krewetki','flaming',6],mrozne_serce:['Mroźne serce','lodowy_golem',26],zatrute_mieso:['Zatrute mięso','wiwerna',22]});
const FOODOF={};for(const k in FOODS)FOODOF[FOODS[k][1]]=k;
const foodName=k=>FOODS[k][0], foodFor=k=>(EDEF[FOODS[k][1]]||ANIM[FOODS[k][1]]||{n:FOODS[k][1]}).n;
Object.assign(EDEF,ANIM);
