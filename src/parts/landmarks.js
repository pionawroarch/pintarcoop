// ===== v102: duże budynki miejskie — bryły zewnętrzne (metry, front +z, y=0 = poziom działki) =====
// pw/pd: działka, w/d: rdzeń kolizji, ceil/W/D: wnętrze
const LMK={
  katedra:{dz:10.7,n:'Katedra',pw:17,pd:31,w:15,d:28,W:14,D:24,ceil:9,hgt:30,stone:1},
  ratusz:{dz:3.3,n:'Ratusz',pw:15,pd:13,w:14,d:11,W:16,D:12,ceil:5.6,hgt:24,stone:1},
  gildia:{dz:3.1,n:'Gildia kupiecka i bank',pw:15,pd:13,w:13.5,d:11,W:16,D:12,ceil:6,hgt:13,stone:1},
  koszary:{dz:2.75,n:'Koszary',pw:19,pd:15,w:18,d:10,W:16,D:14,ceil:4.8,hgt:10,stone:1},
  zajazd:{dz:5.4,n:'Zajazd „Pod Wielkim Kuflem”',pw:15,pd:13,w:14,d:11.5,W:18,D:14,ceil:5,hgt:16},
  wiezamaga:{dz:3.6,n:'Wieża maga',pw:11,pd:11,w:9,d:9,W:10,D:10,ceil:7,hgt:28,stone:1},
  wiezienie:{dz:3.55,n:'Więzienie',pw:13,pd:11,w:12,d:10,W:14,D:10,ceil:4.4,hgt:12,stone:1},
  stocznia:{dz:6,n:'Stocznia',pw:17,pd:15,w:16,d:13,W:16,D:14,ceil:7,hgt:12},
  wkuznia:{dz:4.2,n:'Wielka Kuźnia',pw:15,pd:15,w:14,d:13,W:16,D:14,ceil:6,hgt:20,stone:1},
  drzewo:{dz:3.4,cb:-3.2,n:'Drzewo-pałac',pw:17,pd:17,w:7,d:7,W:14,D:14,ceil:7,hgt:34},
  zigurat:{dx:5,dz:8.6,n:'Zigurat',pw:19,pd:19,w:17,d:17,W:14,D:14,ceil:6,hgt:15,stone:1},
  pajecza:{dz:6.4,n:'Pajęcza świątynia',pw:15,pd:15,w:13,d:13,W:14,D:14,ceil:7,hgt:22,stone:1},
  mlyn:{dx:-2.5,dz:2.7,cb:-4.6,n:'Wielki młyn i spichlerz',pw:15,pd:13,w:13,d:11,W:14,D:12,ceil:5,hgt:22},
  namiot:{dz:6.6,n:'Namiot wodza',pw:17,pd:17,w:14,d:14,W:14,D:14,ceil:6,hgt:12}};
const LMK_RACE={ludzie:'ratusz',krasnoludy:'wkuznia',elfy:'drzewo',saurianie:'zigurat',drowy:'pajecza',niziolki:'mlyn',orkowie:'namiot'};
for(const k in LMK)ENTERABLE[k]=LMK[k].n;
// pomocnicze: dach dwuspadowy schodkowy (kalenica wzdłuż z gdy ax==='z'), okno z ramą, wieża okrągła, stożek
function lmRoof(P,x,y,z,w,d,h,c1,c2,ax){const n=Math.max(3,Math.round(h/0.35)),lh=h/n;for(let i=0;i<n;i++){const t=1-i/n;if(ax==='z')P(x,y+lh*(i+0.5),z,Math.max(0.3,w*t),lh,d,i%2?c2:c1);else P(x,y+lh*(i+0.5),z,w,lh,Math.max(0.3,d*t),i%2?c2:c1)}
  if(ax==='z')P(x,y+h+0.08,z,0.35,0.16,d+0.1,c2);else P(x,y+h+0.08,z,w+0.1,0.16,0.35,c2)}
function lmWin(P,x,y,z,w,h,face,glass,frame,arch){const fx=face==='x',s=0.14;P(x,y,z,fx?s:w,h,fx?w:s,glass);
  P(x,y-h/2-0.08,z,fx?s+0.16:w+0.24,0.12,fx?w+0.24:s+0.16,frame);P(x,y+h/2+0.06,z,fx?s+0.08:w+0.16,0.1,fx?w+0.16:s+0.08,frame);
  P(x,y,z,fx?s+0.04:0.08,h,fx?0.08:s+0.04,frame);if(arch)for(let q=1;q<=2;q++)P(x,y+h/2+0.12*q,z,fx?s:w*(1-q*0.3),0.12,fx?w*(1-q*0.3):s,glass)}
function ringXZ(P,x,y,z,r,c){for(let q=0;q<20;q++){const a=q/20*Math.PI*2;P(x,y+Math.sin(a)*r,z+Math.cos(a)*r,0.2,0.45,0.45,c)}}
function lmCone(P,x,y,z,r,h,c1,c2){const n=Math.max(4,Math.round(h/0.4));for(let i=0;i<n;i++){const rr=r*(1-i/n);if(rr<0.2){P(x,y+h*i/n,z,0.3,h/n,0.3,c1);continue}ringBoxes(P,x,z,0,rr,y+h*i/n,y+h*(i+1)/n,i%2?c2:c1,0.5)}P(x,y+h+0.4,z,0.12,0.9,0.12,'#c9a24a')}
function lmBanner(P,x,y,z,c,tr,ax){P(x,y+0.9,z,ax?0.06:1,0.08,ax?1:0.06,'#3a2414');P(x,y,z,ax?0.04:0.9,1.7,ax?0.9:0.04,c);P(x,y-0.2,z,ax?0.05:0.4,0.4,ax?0.4:0.05,tr);P(x,y-0.95,z,ax?0.04:0.5,0.2,ax?0.5:0.04,c)}
function lmDoor(P,x,z,w,h,S,DK){P(x,h/2,z+0.05,w,h,0.1,'#4a2f1d');for(let q=-1;q<=1;q++)P(x+q*w/3.2,h/2,z+0.11,0.05,h-0.1,0.04,'#2e1d12');for(const y of [h*0.25,h*0.75])P(x,y,z+0.12,w-0.1,0.07,0.04,'#3a3a40');
  P(x,h+0.25,z+0.15,w+0.6,0.4,0.3,S.wl);for(const sx of [-1,1])P(x+sx*(w/2+0.25),h/2,z+0.15,0.4,h+0.2,0.35,S.wl);P(x,0.06,z+0.7,w+1.2,0.12,1.2,S.wd)}
function lmExtList(kind,race,sty){const S=kcStyle(race||'ludzie',sty),L=[],P=(...b)=>L.push(b),M=LMK[kind],DK='#1c1612',GL='#3a5a7a',WO='#4a2f1d',WO2='#6b4528',IR='#3a3a40',r=rngOf('lm'+kind+race+(sty||''));
  const GLOW='!#ffcf6a',VIT=['#c83a3a','#3a5ac8','#d9b23a','#3a9a5a','#8a3ac8'];
  P(0,-1.6,0,M.pw,3.2,M.pd,S.wd);P(0,0.05,0,M.pw,0.1,M.pd,kind==='drzewo'?'#5a8a3e':kind==='namiot'?'#6a5a40':S.wl);
  if(kind==='katedra'){const NW=9.6,NL=20,NH=13,z0=0.5,fz=z0+NL/2,AW=2.6,AH=7.2,LEAD=S.rf,LEAD2=S.rf2,PIN=S.wl;
    const pinn=(x,y,z,s,h)=>{P(x,y+h*0.3,z,s,h*0.6,s,S.w);P(x,y+h*0.6+0.1,z,s+0.12,0.2,s+0.12,PIN);for(let q=0;q<4;q++)P(x,y+h*0.6+0.2+q*h*0.1+h*0.05,z,s*(0.8-q*0.18),h*0.1,s*(0.8-q*0.18),q%2?PIN:S.w);P(x,y+h+0.15,z,0.08,0.3,0.08,S.tr);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])P(x+dx*s*0.42,y+h*0.72,z+dz*s*0.42,0.08,0.12,0.08,PIN)};
    const statue=(x,y,z,c,fx)=>{P(x,y+0.12,z,0.5,0.24,0.5,PIN);P(x,y+0.6,z,0.32,0.75,0.24,c);P(x,y+1.1,z,0.2,0.22,0.2,c);P(x,y+1.25,z,0.26,0.05,0.26,S.tr)};
    // cokół i schody
    P(0,0.25,0,15.4,0.5,29.4,S.wd);for(let q=0;q<3;q++)P(0,0.12+q*0.24,fz+3.6-q*0.4,8.4-q*0.6,0.24,1.4,S.wl);
    // nawa główna: ściana z pilastrami, triforium, okna claristorium z maswerkiem, gzyms, dach ołowiany z grzebieniem
    P(0,NH/2,z0,NW,NH,NL,S.w);for(let k=0;k<=6;k++){const z=z0-NL/2+k*NL/6;for(const sx of [-1,1])P(sx*(NW/2+0.1),NH/2,z,0.3,NH,0.5,S.wl)}
    for(const y of [AH+0.2,NH-0.2])P(0,y,z0,NW+0.3,0.25,NL+0.1,S.wl);
    for(let k=0;k<6;k++){const z=z0-NL/2+NL/12+k*NL/6;for(const sx of [-1,1]){lmWin(P,sx*(NW/2+0.02),AH+3,z,1.6,4,'x',VIT[(k+(sx>0?2:0))%5],S.wl,1);P(sx*(NW/2+0.1),AH+3,z,0.12,4,0.1,S.wl);P(sx*(NW/2+0.1),AH+4.2,z,0.12,0.1,1.5,S.wl);P(sx*(NW/2+0.1),AH+5.4,z,0.14,0.5,0.5,S.wl);for(let q=0;q<3;q++)P(sx*(NW/2+0.06),AH+0.9,z-0.5+q*0.5,0.1,0.9,0.3,'#1a1612')}}
    lmRoof(P,0,NH+0.1,z0,NW+0.8,NL+0.3,6.4,LEAD,LEAD2,'z');for(let z=z0-NL/2+0.5;z<z0+NL/2;z+=0.8)P(0,NH+6.65,z,0.12,0.3+((z*5|0)%2)*0.2,0.12,S.tr);
    // nawy boczne z dachem pulpitowym, okna, przypory z pinaklami i łukami przyporowymi, rzygacze
    for(const sx of [-1,1]){const ax=sx*(NW/2+AW/2);P(ax,AH/2,z0,AW,AH,NL,S.w);for(let q=0;q<5;q++)P(ax+sx*(-AW/2+q*AW/5+AW/10),AH+0.15+(4-q)*0.32,z0,AW/5+0.05,0.32,NL+0.2,q%2?LEAD:LEAD2);
      for(let k=0;k<6;k++){const z=z0-NL/2+NL/12+k*NL/6,bx=sx*(NW/2+AW+0.9),py=AH+2.6;lmWin(P,sx*(NW/2+AW+0.02),3.6,z,1.1,3,'x',VIT[(k+1)%5],S.wl,1);
        P(bx,py/2,z-NL/12,1.1,py,1.3,S.wl);P(bx,0.6,z-NL/12,1.5,1.2,1.7,S.wd);pinn(bx,py,z-NL/12,0.8,3.2);
        for(let q=0;q<7;q++){const t=q/6,x=bx-sx*(t*(AW+0.9-0.2)),y=py-0.2+Math.sin(t*Math.PI*0.5)*(NH-1.4-py)+0.2;P(x,y,z-NL/12,0.6,0.42,0.5,S.wl)}
        P(bx+sx*0.65,py-0.6,z-NL/12,0.6,0.28,0.3,S.wd);P(bx+sx*0.98,py-0.55,z-NL/12,0.22,0.22,0.24,S.wd)}}
    // transept z rozetami, wieżyczka nad skrzyżowaniem z iglicą z żabkami
    const tz=z0-NL/2+5;P(0,NH/2,tz,16.4,NH,5,S.w);lmRoof(P,0,NH,tz,16.8,5.4,5,LEAD,LEAD2,'x');for(const sx of [-1,1]){const x=sx*8.22;for(let q=0;q<10;q++){const a=q/10*Math.PI*2;P(x,8+Math.sin(a)*1.4,tz+Math.cos(a)*1.4,0.12,0.5,0.5,VIT[q%5])}P(x,8,tz,0.14,0.7,0.7,GLOW);ringXZ(P,x,8,tz,1.8,S.wl);lmWin(P,x,3.4,tz,1.2,3.2,'x',VIT[sx>0?1:3],S.wl,1);pinn(sx*8.1,NH,tz-2.4,0.6,2.6);pinn(sx*8.1,NH,tz+2.4,0.6,2.6)}
    P(0,NH+3,tz,4.2,6,4.2,S.w);for(const [fx,fz2] of [[1,0],[-1,0],[0,1],[0,-1]])lmWin(P,fx*2.12,NH+3.4,tz+fz2*2.12,0.9,3,fx?'x':'z',DK,S.wl,1);P(0,NH+6.1,tz,4.6,0.3,4.6,S.wl);for(const sx of [-1,1])for(const sz of [-1,1])pinn(sx*2,NH+6.2,tz+sz*2,0.5,2.2);
    lmCone(P,0,NH+6.3,tz,1.9,9,LEAD,LEAD2);for(let q=0;q<6;q++){const y=NH+7+q*1.3,rr=1.8*(1-(q*1.3+0.7)/9);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])P(dx*(rr+0.1),y,tz+dz*(rr+0.1),0.16,0.16,0.16,S.tr)}
    // absyda z wieńcem kaplic
    const az=z0-NL/2;ringBoxes(P,0,az,0,4.8,0,NH,S.w,0.5);lmCone(P,0,NH,az,5,4.2,LEAD,LEAD2);for(let q=0;q<5;q++){const a=Math.PI*(0.15+q*0.175),cx=Math.cos(a)*5.2,cz=az-Math.sin(a)*5.2;ringBoxes(P,cx,cz,0,1.7,0,5,S.w,0.5);lmCone(P,cx,5,cz,1.9,2.2,LEAD,LEAD2);lmWin(P,cx+Math.cos(a)*1.72,2.8,cz-Math.sin(a)*1.72,0.6,2,Math.abs(Math.cos(a))>0.7?'x':'z',VIT[q%5],S.wl,1)}
    // fasada zachodnia: wieże z przyporami narożnymi, dzwonnice z dzwonami, balustrady, iglice z żabkami, galeria królów, rozeta, trzy portale
    for(const sx of [-1,1]){const tx=sx*4.6,tzz=fz+1.2,TH=22;P(tx,TH/2,tzz,4.4,TH,4.4,S.w);for(const cx of [-1,1])for(const cz of [-1,1]){for(let y=0;y<TH;y+=TH/4){const s=0.9-y/TH*0.4;P(tx+cx*2.15,y+TH/8,tzz+cz*2.15,s,TH/4,s,S.wl)}}
      for(const y of [6,11.5])P(tx,y,tzz,4.6,0.25,4.6,S.wl);for(const y of [3.4,8.6])lmWin(P,tx,y,tzz+2.22,1.0,2.6,'z',y>5?GL:DK,S.wl,1);
      for(const [fx,fz2] of [[0,1],[1,0],[-1,0],[0,-1]]){const wx=tx+fx*2.22,wz=tzz+fz2*2.22;P(wx,15.6,wz,fx?0.12:1.6,4.4,fz2?0.12:1.6,'#1a1612');for(let q=0;q<5;q++)P(wx+fx*0.05,13.8+q*0.8,wz+fz2*0.05,fx?0.14:1.5,0.12,fz2?0.14:1.5,WO2);P(wx,18.1,wz,fx?0.16:1.9,0.5,fz2?0.16:1.9,S.wl)}
      P(tx,15.2,tzz,1.3,1.3,1.3,'#c9a24a');P(tx,15.95,tzz,0.6,0.4,0.6,'#a8862e');
      P(tx,TH+0.15,tzz,4.8,0.3,4.8,S.wl);for(let q=-2;q<=2;q++)for(const [fx,fz2] of [[0,1],[1,0],[-1,0],[0,-1]])P(tx+(fz2?q*0.9:fx*2.3),TH+0.6,tzz+(fx?q*0.9:fz2*2.3),0.2,0.6,0.2,S.wl);for(const cx of [-1,1])for(const cz of [-1,1])pinn(tx+cx*2.2,TH+0.3,tzz+cz*2.2,0.6,2.4);
      if(race==='krasnoludy'||race==='orkowie'||race==='saurianie'){P(tx,TH+1.6,tzz,3.4,2.6,3.4,S.wd);P(tx,TH+3.1,tzz,2.2,0.6,2.2,S.tr);P(tx,TH+3.6,tzz,1.2,0.5,1.2,S.wd)}else{lmCone(P,tx,TH+0.3,tzz,2.0,race==='elfy'||race==='drowy'?11:9,LEAD,LEAD2);for(let q=0;q<6;q++){const y=TH+1+q*1.3,rr=1.9*(1-(q*1.3+0.7)/9.5);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])P(tx+dx*(rr+0.1),y,tzz+dz*(rr+0.1),0.16,0.16,0.16,S.tr)}}
      lmDoor(P,tx,tzz+2.2,1.4,2.8,S,DK);for(let q=1;q<=2;q++)P(tx,2.8+q*0.3,tzz+2.25+q*0.1,1.4+q*0.6,0.3,0.2,q%2?S.wl:S.wd)}
    P(0,NH-0.4,fz+0.2,4.8,1.6,0.4,S.w);P(0,(NH-1)/2,fz+0.2,4.8,NH-1,0.4,S.w);lmRoof(P,0,NH+0.4,fz+0.5,4.8,0.8,3.6,S.wl,S.w,'z');statue(0,NH+3.9,fz+0.5,S.wl);
    for(let k=0;k<5;k++){P(-1.8+k*0.9,7.2,fz+0.62,0.7,1.5,0.1,'#1a1612');statue(-1.8+k*0.9,6.4,fz+0.72,k===2?'#d9b23a':'#cfc8b8')}P(0,6.35,fz+0.75,4.8,0.15,0.4,S.wl);P(0,8.1,fz+0.75,4.8,0.15,0.4,S.wl);
    const ry=NH-2.4,rz=fz+0.62;for(let q=0;q<12;q++){const a=q/12*Math.PI*2;P(Math.cos(a)*1.25,ry+Math.sin(a)*1.25,rz,0.6,0.6,0.1,VIT[q%5]);P(Math.cos(a)*0.62,ry+Math.sin(a)*0.62,rz+0.02,0.12,0.12,0.1,S.wl)}P(0,ry,rz+0.02,0.7,0.7,0.1,GLOW);for(let q=0;q<24;q++){const a=q/24*Math.PI*2;P(Math.cos(a)*1.95,ry+Math.sin(a)*1.95,rz+0.06,0.4,0.4,0.18,S.wl)}for(let q=0;q<12;q++){const a=q/12*Math.PI*2;P(Math.cos(a)*0.9,ry+Math.sin(a)*0.9,rz+0.04,0.06,0.9*0.95,0.08,S.wl)}
    lmDoor(P,0,fz+0.2,2.4,4.4,S,DK);for(let q=1;q<=4;q++){P(0,4.4+q*0.3,fz+0.25+q*0.13,2.4+q*0.7,0.3,0.24,q%2?S.wl:S.wd);for(const sx of [-1,1]){P(sx*(1.2+q*0.35),2.3,fz+0.25+q*0.13,0.3,4.6,0.24,q%2?S.wl:S.wd);statue(sx*(1.2+q*0.35),0.5,fz+0.5+q*0.13,'#cfc8b8')}}
    P(0,5.0,fz+0.32,2.2,0.9,0.1,'#d9b23a');P(0,5.05,fz+0.38,0.5,0.6,0.08,'#f4ecd0');for(const sx of [-1,1])P(sx*0.6,5.0,fz+0.38,0.3,0.4,0.08,'#e8dcb0');
    for(const sx of [-1,1]){P(sx*5.6,0.9,fz+4.4,0.9,1.2,0.9,S.wd);statue(sx*5.6,1.5,fz+4.4,'#d8d0b8')}}
  else if(kind==='ratusz'){const H1=4.2,H2=3.6;
    // parter z podcieniami (arkady), piętro reprezentacyjne z balkonem, attyka, wieża zegarowa
    P(0,H1/2,-1,13,H1,8.5,S.w);P(0,H1+H2/2,0,13.6,H2,10.4,S.wl);P(0,H1+0.1,0,14,0.2,10.8,S.wd);P(0,H1+H2+0.15,0,14,0.3,10.8,S.wd);
    for(let k=-4;k<=3;k++){const x=(k+0.5)*1.95;P(x,H1/2,4.6,0.55,H1,0.55,S.wd);P(x,H1-0.35,4.6,0.8,0.3,0.8,S.wl);if(k<3){for(let q=0;q<3;q++)P(x+0.975,H1-0.6-q*0.12,4.6,1.4-q*0.4,0.14,0.4,S.wd)}}
    P(0,0.08,4,13.4,0.16,1.6,S.wl);for(let k=-2;k<=2;k++)if(k)lmWin(P,k*2.4,2.3,3.28,1,1.6,'z',GL,WO);lmDoor(P,0,3.2,1.8,3,S,DK);
    for(let k=-3;k<=3;k++){lmWin(P,k*1.9,H1+1.8,5.25,0.9,1.8,'z',k%2?GL:VIT[1],S.tr,1)}for(const sx of [-1,1])for(let k=-1;k<=1;k++)lmWin(P,sx*6.82,H1+1.8,k*3,0.9,1.8,'x',GL,S.tr,1);
    P(0,H1+0.3,5.9,5,0.15,1.4,S.wd);for(let q=-6;q<=6;q++)P(q*0.4,H1+0.75,6.5,0.1,0.8,0.1,S.wl);P(0,H1+1.2,6.5,5,0.12,0.16,S.wl);
    lmRoof(P,0,H1+H2+0.3,0,14,10.8,3.6,S.rf,S.rf2,'z');for(let k=-3;k<=3;k++)P(k*2,H1+H2+0.75,5.45,0.8,0.9,0.3,S.wl);
    for(const sx of [-1,1])lmBanner(P,sx*4.2,H1+H2-1.1,5.4,S.bn,S.tr,0);
    const tz=1.2;P(0,(H1+H2)+5,tz,3.6,10,3.6,S.w);P(0,H1+H2+10.2,tz,4.2,0.4,4.2,S.wd);
    for(const [fx,fz] of [[0,1],[1,0],[-1,0],[0,-1]]){const cx=fx*1.86,cz=tz+fz*1.86;for(let q=0;q<12;q++){const a=q/12*Math.PI*2,u=Math.cos(a)*1.25,v=Math.sin(a)*1.25;if(fz)P(u,H1+H2+7+v,cz+fz*0.06,0.2,0.2,0.1,DK);else P(cx+fx*0.06,H1+H2+7+v,tz+u,0.1,0.2,0.2,DK)}
      if(fz)P(0,H1+H2+7,cz+fz*0.04,2.9,2.9,0.06,'#efe8d0');else P(cx+fx*0.04,H1+H2+7,tz,0.06,2.9,2.9,'#efe8d0');if(fz)P(0,H1+H2+7,cz+fz*0.0,3.3,3.3,0.06,S.tr);else P(cx+fx*0.0,H1+H2+7,tz,0.06,3.3,3.3,S.tr)}
    for(const sx of [-1,1])for(const sz of [-1,1])P(sx*1.6,H1+H2+11,tz+sz*1.6,0.4,1.4,0.4,S.wl);P(0,H1+H2+11.2,tz,2.4,1.6,2.4,S.wd);P(0,H1+H2+11.2,tz,1.2,1.0,2.6,DK);P(0,H1+H2+11.2,tz,2.6,1.0,1.2,DK);P(0,H1+H2+11.2,tz,0.6,0.7,0.6,'#c9a24a');
    lmCone(P,0,H1+H2+12,tz,2.2,6,S.rf,S.rf2)}
  else if(kind==='gildia'){const H=7.5;
    // klasycystyczny gmach: stylobat ze schodami, portyk z kolumnami, tympanon, kopuła ze złotą latarnią
    for(let q=0;q<3;q++)P(0,0.15+q*0.3,4.4-q*0.35,12-q*0.2,0.3,3-q*0.7,S.wl);P(0,H/2+0.9,-1,12.4,H,8,S.w);P(0,1.1,-1,12.8,0.4,8.4,S.wd);
    for(let y=1.6;y<H+0.9;y+=0.9)P(0,y,-1,12.46,0.06,8.06,S.wd);
    for(let k=0;k<6;k++){const x=-5+k*2;P(x,1.05,4.2,0.95,0.3,0.95,S.wl);P(x,H/2+1,4.2,0.7,H-0.4,0.7,S.wl);for(const dz of [-0.36,0.36])P(x,H/2+1,4.2+dz,0.12,H-0.6,0.04,S.wd);P(x,H+0.95,4.2,1.0,0.35,1.0,S.wl);P(x,H+0.75,4.2,0.85,0.12,0.85,S.tr)}
    P(0,H+1.3,3.4,12.6,0.5,2.4,S.wl);P(0,H+1.62,3.4,12.8,0.16,2.6,S.wd);for(let q=0;q<8;q++){const w=12.4*(1-q/8);P(0,H+1.8+q*0.28,4.4,w,0.28,0.4,S.wl)}P(0,H+2.4,4.62,2.2,0.9,0.1,S.tr);P(0,H+2.4,4.68,1.2,0.6,0.08,S.bn);
    lmRoof(P,0,H+1.3,-1,12.6,8.2,2.6,S.wd,S.w,'x');lmDoor(P,0,3,2.2,3.6,S,DK);for(const sx of [-1,1])for(const x of [2.8,4.6])lmWin(P,sx*x,4.2,3.05,1,2.2,'z',GL,S.wl,1);
    for(const sx of [-1,1])for(let k=-1;k<=1;k++)lmWin(P,sx*6.25,4.4,-1+k*2.4,1,2.2,'x',GL,S.wl,1);
    ringBoxes(P,0,-1.5,0,2.8,H+1.3,H+3.2,S.wl,0.5);for(let q=0;q<7;q++)ringBoxes(P,0,-1.5,0,2.7*Math.cos(q/7*Math.PI/2),H+3.2+q*0.42,H+3.62+q*0.42,q%2?S.rf:S.rf2,0.5);
    P(0,H+6.4,-1.5,0.7,0.9,0.7,S.tr);P(0,H+7.2,-1.5,0.3,0.8,0.3,'#e8c040');for(const sx of [-1,1])P(sx*6.6,1.4,4.6,0.9,0.9,1.6,S.wl),P(sx*6.6,2.2,4.6,0.7,0.7,1.2,'#c9a24a')}
  else if(kind==='koszary'){const H=6.5,bz=-2.2;
    // długi blok z blankami, wieżyczki narożne, brama, plac ćwiczeń z manekinami i tarczami strzelniczymi
    P(0,H/2,bz,18,H,9.6,S.w);P(0,0.6,bz,18.3,1.2,9.9,S.wd);for(let x=-8.6;x<=8.7;x+=1.2)P(x,H+0.45,bz+4.7,0.7,0.9,0.5,S.wl),P(x,H+0.45,bz-4.7,0.7,0.9,0.5,S.wl);P(0,H+0.1,bz,18.2,0.2,9.8,S.wd);
    for(const sx of [-1,1]){for(let k=0;k<4;k++)lmWin(P,sx*(2.2+k*1.8),4.3,bz+4.86,0.4,1.2,'z',DK,S.wd),lmWin(P,sx*(2.2+k*1.8),1.9,bz+4.86,0.9,1.2,'z',GL,WO);
      ringBoxes(P,sx*8.8,bz+4.6,0,1.8,0,H+2.6,S.w,0.5);for(let q=0;q<8;q++){const a=q/8*Math.PI*2;P(sx*8.8+Math.cos(a)*1.6,H+3,bz+4.6+Math.sin(a)*1.6,0.6,0.8,0.6,S.wl)}lmWin(P,sx*8.8,H,bz+6.42,0.3,1,'z',DK,S.wd);
      ringBoxes(P,sx*8.8,bz-4.6,0,1.6,0,H+2,S.wd,0.5);lmBanner(P,sx*1.8,H-1.3,bz+4.9,S.bn,S.tr,0)}
    P(0,1.6,bz+4.85,2.4,3.2,0.3,DK);P(0,3.5,bz+4.9,3.4,0.6,0.5,S.wl);for(let q=-1;q<=1;q++)P(q*0.7,2.1,bz+5.0,0.08,2.2,0.08,IR);P(0,H+1.6,bz+4.9,1.4,1.4,0.2,S.tr);P(0,H+1.6,bz+4.95,1.0,1.0,0.2,S.bn);
    P(0,0.13,4.6,17,0.06,4.8,'#b8a070');for(let x=-8.3;x<=8.4;x+=0.6)if(Math.abs(x)>1.7)P(x,0.5,7.1,0.12,0.9,0.12,WO);for(const sx of [-1,1])for(const y of [0.9,0.55])P(sx*5.05,y,7.1,6.6,0.1,0.1,WO);
    for(const x of [-5.5,-3.5]){P(x,0.75,4.6,0.14,1.5,0.14,WO);P(x,1.3,4.6,0.9,0.12,0.12,WO);P(x,1.5,4.6,0.6,0.7,0.4,'#c8a868');P(x,2.05,4.6,0.4,0.4,0.4,'#d8b880')}
    for(const x of [4,6]){P(x,0.6,5.8,0.12,1.2,0.12,WO);P(x,1.4,5.6,1.1,1.1,0.12,'#e8e0c8');P(x,1.4,5.55,0.7,0.7,0.12,'#a8352a');P(x,1.4,5.5,0.3,0.3,0.12,'#e8e0c8')}
    P(-0.5,0.5,5.5,1.2,0.9,0.6,WO2);for(let q=0;q<4;q++)P(-0.9+q*0.25,1.25,5.5,0.05,0.8,0.05,'#aeb6bd')}
  else if(kind==='zajazd'){const H1=3.6,H2=3.2,TW='#3a2414',PL=S.wl;
    // kamienny parter, dwa piętra szachulcowe z nadwieszeniem, balkon, wysoki dach z lukarnami, dwa kominy, wielki szyld z kuflem
    P(0,H1/2,0,13,H1,10.6,S.wd);for(let y=0.45;y<H1;y+=0.45)P(0,y,0,13.06,0.05,10.66,S.w);
    P(0,H1+H2/2,0.2,13.6,H2,11.2,PL);P(0,H1+H2*1.5,0.4,14,H2,11.6,PL);
    for(const [y,w,d] of [[H1,13.6,11.2],[H1+H2,14,11.6],[H1+H2*2,14,11.6]])P(0,y,0.3,w+0.2,0.25,d+0.2,TW);
    for(const [y,w,dd] of [[H1+H2/2,13.6,11.2],[H1+H2*1.5,14,11.6]]){for(let x=-w/2;x<=w/2+0.01;x+=1.7){P(x,y,0.3+dd/2,0.22,H2,0.1,TW);P(x,y,0.3-dd/2,0.22,H2,0.1,TW)}for(let z=-dd/2;z<=dd/2+0.01;z+=1.9){P(w/2,y,0.3+z,0.1,H2,0.22,TW);P(-w/2,y,0.3+z,0.1,H2,0.22,TW)}
      for(let x=-w/2+0.85;x<w/2;x+=3.4){P(x,y,0.36+dd/2,0.16,H2*1.05,0.06,TW)}}
    for(const y of [H1+H2/2,H1+H2*1.5])for(let k=-3;k<=3;k++)if(k)lmWin(P,k*1.7+0.85*Math.sign(k),y+0.2,y>H1+H2?6.25:6.05,0.8,1.3,'z',k%2?GL:'#ffcf6a',TW);
    for(const sx of [-1,1])for(let k=-2;k<=2;k++)lmWin(P,sx*7.05,H1+H2*1.5+0.2,0.3+k*1.9,0.8,1.3,'x',GL,TW);
    for(let k=-2;k<=2;k++)if(k)lmWin(P,k*2.4,1.9,5.35,1.2,1.4,'z',k%2?'#ffcf6a':GL,TW);lmDoor(P,0,5.3,2,2.8,S,DK);
    P(0,H1+0.15,6.6,6,0.2,1.6,WO2);for(let q=-7;q<=7;q++)P(q*0.4,H1+0.65,7.3,0.08,0.8,0.08,WO2);P(0,H1+1.1,7.3,6,0.1,0.12,TW);for(const sx of [-2.8,2.8])P(sx,H1/2,7.2,0.25,H1,0.25,TW);
    lmRoof(P,0,H1+H2*2+0.12,0.4,14.6,12,5,S.rf,S.rf2,'z');for(const x of [-3.6,3.6]){P(x,H1+H2*2+1.4,6,1.8,1.8,1.6,PL);lmRoof(P,x,H1+H2*2+2.3,6,2.2,1.8,1,S.rf2,S.rf,'z');lmWin(P,x,H1+H2*2+1.4,6.82,0.7,0.9,'z','#ffcf6a',TW)}
    for(const [x,z] of [[-4.6,-2.5],[4.2,-3.2]]){P(x,H1+H2*2+3.4,z,1.1,6,1.1,S.wd);P(x,H1+H2*2+6.5,z,1.4,0.3,1.4,S.w)}
    P(5.5,H1+0.9,6.4,0.12,0.12,2.4,IR);P(5.5,H1+0.0,7.3,1.6,1.4,0.12,WO2);P(5.5,H1+0.0,7.37,1.2,1.0,0.06,'#d9b23a');P(5.5,H1-0.05,7.42,0.5,0.6,0.06,'#f4f0e0');P(5.85,H1,7.42,0.18,0.35,0.06,'#d9b23a');
    for(const x of [-5.6,-4.6])P(x,0.45,6.2,0.8,0.9,0.8,'#8a5a30'),P(x,0.45,6.2,0.84,0.08,0.84,IR);P(4.2,0.4,6.4,1.8,0.1,0.8,WO2);P(4.2,0.2,6.4,0.15,0.4,0.6,TW)}
  else if(kind==='wiezamaga'){const H=20,PU=race==='drowy'?'#7a3aaa':'#4a3a8a',PU2=race==='drowy'?'#5a2a8a':'#3a2a6a';
    // smukła okrągła wieża na cokole, spiralnie rozmieszczone okna, balkon, hełm, świecący kryształ unoszący się nad szczytem
    ringBoxes(P,0,0,0,4.4,0,1.6,S.wd,0.5);ringBoxes(P,0,0,0,3.6,1.6,H,S.w,0.5);for(const y of [5,10,15])ringBoxes(P,0,0,0,3.75,y,y+0.3,S.wl,0.5);
    for(let k=0;k<9;k++){const a=k*1.9,y=3+k*1.85,c=Math.cos(a),s=Math.sin(a),ax=Math.abs(c)>Math.abs(s);lmWin(P,c*3.62,y,s*3.62,0.7,1.3,ax?'x':'z',k%3===1?'!#b890ff':GL,S.wl,1)}
    ringBoxes(P,0,0,0,4.6,H,H+0.4,S.wd,0.5);for(let q=0;q<16;q++){const a=q/16*Math.PI*2;P(Math.cos(a)*4.4,H+0.8,Math.sin(a)*4.4,0.18,0.8,0.18,S.wl)}ringBoxes(P,0,0,4.25,4.55,H+1.2,H+1.32,S.wl,0.5);
    ringBoxes(P,0,0,0,2.9,H+0.4,H+3.4,S.w,0.5);for(let q=0;q<4;q++){const a=q/4*Math.PI*2+0.4;lmWin(P,Math.cos(a)*2.92,H+1.9,Math.sin(a)*2.92,0.6,1.4,Math.abs(Math.cos(a))>0.7?'x':'z','!#b890ff',S.wl,1)}
    lmCone(P,0,H+3.4,0,3.6,6.5,PU,PU2);for(const [y,s] of [[H+11.2,0.5],[H+11.7,0.9],[H+12.4,1.1],[H+13.1,0.9],[H+13.6,0.5]])P(0,y,0,s,0.5,s,'!#a8e8ff');
    lmDoor(P,0,3.5,1.6,2.8,S,DK);P(0,3.4,4.6,0.3,0.3,0.3,'!#b890ff');for(let q=0;q<6;q++)P(-1.6+q*0.64,0.25+q*0.25,4.6-q*0.18,0.6,0.25,1.2,S.wl);
    for(const sx of [-1,1]){P(sx*3.4,0.9,3.4,0.9,1.8,0.9,S.wd);P(sx*3.4,2.1,3.4,0.5,0.6,0.5,'!#a8e8ff')}}
  else if(kind==='wiezienie'){const H=5.5;
    // przysadzisty blok z grubego kamienia, okna z kratami, wieża strażnicza, okuta brama, szubienica i dyby przed wejściem
    P(0,H/2,-0.8,11.6,H,8.4,S.wd);for(let y=0.6;y<H;y+=0.6)P(0,y,-0.8,11.66,0.05,8.46,S.w);P(0,H+0.15,-0.8,12,0.3,8.8,S.w);for(let x=-5.6;x<=5.7;x+=1.4)P(x,H+0.6,3.3,0.8,0.7,0.5,S.wl);
    for(const sx of [-1,1])for(let k=0;k<2;k++){const x=sx*(2.4+k*2.1);P(x,3.6,3.42,0.8,0.6,0.1,DK);for(let q=-1;q<=1;q++)P(x+q*0.25,3.6,3.48,0.06,0.7,0.06,IR);P(x,3.6,3.48,0.9,0.06,0.06,IR)}
    for(const sx of [-1,1])for(let k=-1;k<=1;k++){const z=-0.8+k*2.6;P(sx*5.82,3.6,z,0.1,0.6,0.8,DK);for(let q=-1;q<=1;q++)P(sx*5.86,3.6,z+q*0.25,0.06,0.7,0.06,IR)}
    P(4.4,4.8,-3.6,3.2,9.6,3.2,S.w);for(let q=0;q<4;q++)P(4.4+(q<2?-1.4:1.4),10,-3.6+(q%2?-1.4:1.4),0.7,0.9,0.7,S.wl);lmRoof(P,4.4,10.2,-3.6,3.4,3.4,2.4,S.rf,S.rf2,'z');P(4.4,8,-1.98,0.4,1,0.1,DK);
    P(0,1.5,3.42,2,3,0.14,'#3a2a1c');for(let q=-2;q<=2;q++)P(q*0.4,1.5,3.5,0.08,3,0.06,IR);for(const y of [0.6,1.5,2.4])P(0,y,3.5,2,0.1,0.06,IR);P(0,3.25,3.5,2.8,0.5,0.4,S.w);
    P(-4.2,1.9,4.9,0.2,3.8,0.2,WO);P(-3.4,3.75,4.9,1.8,0.2,0.2,WO);P(-2.7,3.2,4.9,0.04,0.9,0.04,'#c8a868');P(-2.7,2.7,4.9,0.2,0.2,0.2,'#c8a868');P(-4.2,0.1,4.9,1.6,0.2,1.6,WO2);
    P(3.4,0.55,4.9,0.15,1.1,0.15,WO);P(3.4,1.05,4.9,1.6,0.3,0.2,WO2);for(const dx of [-0.45,0,0.45])P(3.4+dx,1.05,4.98,0.12,0.12,0.06,DK);lmBanner(P,-1.8,H-1.5,3.45,S.bn,S.tr,0);lmBanner(P,1.8,H-1.5,3.45,S.bn,S.tr,0)}
  else if(kind==='stocznia'){
    // otwarta hala na słupach z dachem dwuspadowym, kadłub statku w budowie na pochylni, żuraw drewniany, sterty desek
    for(let k=0;k<5;k++)for(const sx of [-1,1]){const z=-5.5+k*2.75;P(sx*7.6,4,z,0.5,8,0.5,WO);P(sx*7.2,7.4,z,1.2,0.3,0.3,WO2)}P(0,8.1,-0,15.8,0.3,0.4,WO);
    P(0,4,-6.3,15.6,8,0.4,WO2);for(let x=-7.5;x<7.6;x+=0.5)P(x,4,-6.1,0.06,8,0.04,WO);lmRoof(P,0,8.2,0,16.8,13.6,4,S.rf,S.rf2,'z');
    for(let z=-5.5;z<=5.5;z+=0.9)P(0,0.12,z,4,0.12,0.25,WO2);P(0,0.25,0,0.6,0.3,12,WO);
    for(let k=-5;k<=4;k++){const z=k*1.1,s=1-Math.pow(Math.abs(k+0.5)/5.4,2);const w=3.2*s+0.4;P(0,0.6,z,0.4,0.6,0.5,WO);for(let q=0;q<5;q++){const y=0.9+q*0.55,ww=w*(0.55+q*0.11);P(ww/2,y,z,0.18,0.6,0.25,WO);P(-ww/2,y,z,0.18,0.6,0.25,WO)}}
    for(let q=0;q<3;q++)for(let z=-4.5;z<0;z+=0.25)P(0,1.1+q*0.55,z,(1.6+q*0.5)*(1-Math.pow(Math.abs(z+0.5)/5.4,2))+0.4,0.5,0.25,q%2?'#8f5a2a':'#7a4b22');
    P(0,4.5,-3.5,0.25,6,0.25,WO2);P(0,6.5,-3.5,1.8,0.12,0.12,WO2);
    P(-6,4.5,4,0.4,9,0.4,WO);P(-4.3,8.6,4,3.6,0.3,0.3,WO);P(-2.7,6.8,4,0.04,3.6,0.04,'#c8b080');P(-2.7,4.8,4,0.8,0.5,0.6,'#8a6a40');P(-6,1,4,1.6,0.3,1.6,WO2);P(-5.6,1.4,4.6,0.8,0.8,0.12,WO2);
    for(let q=0;q<5;q++)P(5.4,0.2+q*0.18,4,1.6,0.16,3,q%2?'#b88a5a':'#a87a4a');for(let q=0;q<3;q++)P(5.4,0.35+q*0.3,-4,0.4,0.3,3.6-q*0.4,'#7a4b22');P(-5.2,0.45,-3,0.9,0.9,0.9,'#8a5a30');P(-5.2,0.45,-3,0.94,0.08,0.94,IR)}
  else if(kind==='wkuznia'){const H=7,LV='!#ff7a1a';
    // kamienna hala z masywnymi przyporami, trzy kominy z żarem, kanał z lawą przy wejściu, kowadło-pomnik i wielkie wrota z runami
    P(0,H/2,-1,13.4,H,10,S.w);P(0,0.8,-1,13.8,1.6,10.4,S.wd);for(let x=-6;x<=6.1;x+=2.4){P(x,H/2,4.3,1,H,1.2,S.wd);P(x,H+0.4,4.3,1.3,0.8,1.5,S.wl)}
    P(0,H+0.2,-1,14,0.4,10.6,S.wd);lmRoof(P,0,H+0.4,-1,13.6,10.4,3,S.rf,S.rf2,'z');
    for(const [x,z,h] of [[-4,-3,11],[0,-4,13],[4,-3,10]]){P(x,H+h/2,z,1.8,h,1.8,S.wd);P(x,H+h+0.2,z,2.2,0.4,2.2,S.wl);P(x,H+h+0.45,z,1.2,0.12,1.2,LV)}
    P(0,2.6,4.05,3.6,5.2,0.2,'#3a2a1c');P(0,5.4,4.1,4.4,0.6,0.5,S.wl);for(let q=-3;q<=3;q++)P(q*0.5,2.6,4.18,0.1,5,0.05,IR);for(let q=0;q<6;q++)P(-1.5+q*0.6,4.4,4.2,0.3,0.3,0.05,'!#5ac8ff');
    for(const sx of [-1,1])lmWin(P,sx*3.6,3.4,4.1,1,1.6,'z',LV,S.wd);for(const sx of [-1,1])for(let k=-1;k<=1;k++)lmWin(P,sx*6.74,3.6,-1+k*3,0.8,1.6,'x','!#ffa040',S.wd);
    P(0,0.12,6.0,9,0.2,1.2,S.wd);P(0,0.2,6.0,8.4,0.1,0.6,LV);for(let x=-4;x<=4;x+=2)P(x,0.35,6,0.5,0.2,1.4,S.wl);
    P(5.4,0.6,6.2,1.6,1.2,1.2,S.wd);P(5.4,1.5,6.2,2.2,0.6,1,'#4a4a52');P(5.4,1.9,6.2,2.6,0.2,0.9,'#5a5a62');P(-5.4,1.2,6.2,0.8,2.4,0.8,S.wl);P(-5.4,2.6,6.2,1.6,0.4,0.4,'#8a8f94');P(-5.4,2.6,6.2,0.4,1.2,0.4,'#6a4a2a')}
  else if(kind==='drzewo'){const TR='#5a3a22',TR2='#4a2f1d',TR3='#6b4a2e',LF=['#3f8a3a','#4a9a42','#2f7a32','#5aa848','#6ab850'],GOLD='#d9b23a',PLT='#c8a878',WH=S.w;
    const leaf=(x,y,z,s)=>{for(let q=0;q<7;q++){const a=q*2.39,rr=s*0.45*(q?1:0),yy=q?((q*37)%5-2)*s*0.12:s*0.15;P(x+Math.cos(a)*rr,y+yy,z+Math.sin(a)*rr,s*(q?0.75:1),s*0.55,s*(q?0.75:1),LF[q%5])}P(x,y+s*0.42,z,s*0.6,s*0.3,s*0.6,LF[4])};
    const limb=(x0,y0,z0,dx,dy,dz,n,w)=>{let x=x0,y=y0,z=z0;for(let k=0;k<n;k++){const t=k/n,ww=w*(1-t*0.6);P(x,y,z,ww,ww,ww,k%2?TR:TR3);x+=dx;y+=dy;z+=dz}return [x,y,z]};
    // korzenie: łukowate, grubsze przy pniu
    for(let q=0;q<10;q++){const a=q/10*Math.PI*2+0.2,c=Math.cos(a),s=Math.sin(a);for(let k=0;k<6;k++){const d=2.6+k*0.95,w=1.7-k*0.22,h=Math.max(0.3,1.8-k*0.32);P(c*d,h/2-0.1,s*d,w,h,w,k%2?TR2:TR)}}
    // pień: zwężający się, z bruzdami kory i sękami
    for(let y=0;y<26;y+=1){const r=3.3-y*0.05,ox=Math.sin(y*0.15)*0.3;ringBoxes(P,ox,0,0,r,y,y+1,y%3?TR:TR2,0.5);if(y%2===0)for(let q=0;q<10;q++){const a=q/10*Math.PI*2+y*0.05;P(ox+Math.cos(a)*(r+0.05),y+0.5,Math.sin(a)*(r+0.05),0.22,1.05,0.22,TR2)}}
    for(const [a,y] of [[1.2,5],[3.8,9],[5.4,16]])P(Math.cos(a)*3.2,y,Math.sin(a)*3.2,0.9,0.9,0.9,'#3a2414');
    // wejście: łukowa brama z filigranem
    P(0,1.7,3.25,1.8,3.2,0.4,'#2a1810');for(let q=0;q<4;q++)P(0,3.3+q*0.16,3.38,1.8-q*0.45,0.16,0.4,GOLD);for(const sx of [-1,1])P(sx*1.05,1.7,3.4,0.16,3.4,0.2,GOLD);P(0,3.9,3.45,0.4,0.4,0.1,'#ffe8a0');
    // wodospad z dziupli do sadzawki
    P(-2.4,6.5,2.2,1.2,1,1,'#1a1008');for(let y=0;y<6.4;y+=0.5)P(-2.6-Math.min(1.6,y*0.4)*0,y+0.2,2.75+Math.min(1.2,(6.4-y)*0.12),0.7,0.55,0.25,y%1?'#a8d8f8':'#d8f0ff');ringBoxes(P,-3.2,4.4,0,1.8,0,0.25,'#c8c0b0',0.5);ringBoxes(P,-3.2,4.4,0,1.5,0.2,0.3,'#4a8ac8',0.5);
    // schody spiralne wokół pnia z balustradą
    for(let k=0;k<36;k++){const a=k*0.32+0.6,y=0.4+k*0.27,rr=3.7;P(Math.cos(a)*rr,y,Math.sin(a)*rr,1.0,0.16,1.0,PLT);if(k%3===0)P(Math.cos(a)*(rr+0.45),y+0.45,Math.sin(a)*(rr+0.45),0.08,0.8,0.08,GOLD)}
    // konary z pawilonami, pomostami i lampionami
    const PAV=[];for(const [a,y,len] of [[0.5,10,6],[2.6,13,6],[4.5,16,5],[1.6,20,5],[3.7,22,4]]){const c=Math.cos(a),s=Math.sin(a);const e=limb(c*2.6,y,s*2.6,c*0.85,0.22,s*0.85,len,1.5);const px=e[0]+c*1.2,pz=e[2]+s*1.2,py=e[1];PAV.push([px,py,pz]);
      ringBoxes(P,px,pz,0,2.2,py+0.2,py+0.5,PLT,0.5);for(let q=0;q<12;q++){const b=q/12*Math.PI*2;P(px+Math.cos(b)*2.1,py+0.9,pz+Math.sin(b)*2.1,0.08,0.8,0.08,GOLD)}ringBoxes(P,px,pz,1.95,2.15,py+1.28,py+1.36,GOLD,0.5);
      ringBoxes(P,px,pz,0,1.4,py+0.5,py+3,WH,0.5);for(let q=0;q<4;q++){const b=q/4*Math.PI*2+a;lmWin(P,px+Math.cos(b)*1.42,py+1.8,pz+Math.sin(b)*1.42,0.6,1.3,Math.abs(Math.cos(b))>0.7?'x':'z','!#ffe8a0',GOLD,1)}
      for(let q=0;q<6;q++){const rr=1.9-q*0.33;ringBoxes(P,px,pz,0,Math.max(0.2,rr),py+3+q*0.45,py+3.45+q*0.45,q%2?S.rf:S.rf2,0.5)}P(px+0.2,py+5.9,pz,0.15,0.5,0.15,S.rf);P(px+0.45,py+6.2,pz,0.3,0.12,0.12,S.rf);
      leaf(e[0]-c*1.5,py+6.6,e[2]-s*1.5,3.4);leaf(px+c*1.8,py+4.6,pz+s*1.8,2.8);
      for(let q=0;q<3;q++){const lx=e[0]-c*(1+q*1.4),lz=e[2]-s*(1+q*1.4);P(lx,py-0.8,lz,0.04,1.2,0.04,'#d8c8a0');P(lx,py-1.5,lz,0.32,0.4,0.32,'!#ffe08a')}}
    for(let i=0;i<PAV.length-1;i++){const [x0,y0,z0]=PAV[i],[x1,y1,z1]=PAV[i+1],n=Math.ceil(Math.hypot(x1-x0,z1-z0)/0.7);for(let k=1;k<n;k++){const t=k/n,sag=Math.sin(t*Math.PI)*0.8;P(x0+(x1-x0)*t,y0+(y1-y0)*t+0.3-sag,z0+(z1-z0)*t,0.7,0.12,0.7,k%2?PLT:'#a8865a')}}
    // korona: warstwowe obłoki liści, pnącza
    for(let q=0;q<14;q++){const a=q*2.39,rr=2+((q*37)%6)*0.9,y=25+((q*13)%7)*1.1;leaf(Math.cos(a)*rr,y,Math.sin(a)*rr,3.6)}leaf(0,32.5,0,4.4);
    for(let q=0;q<16;q++){const a=q*1.13,rr=5+((q*17)%5)*0.8,y0=23+((q*11)%5);for(let k=0;k<4+(q%4);k++)P(Math.cos(a)*rr,y0-k*0.7,Math.sin(a)*rr,0.18,0.7,0.18,k%3?'#3f8a3a':'#6ab850');P(Math.cos(a)*rr,y0-(4+(q%4))*0.7,Math.sin(a)*rr,0.3,0.3,0.3,['#f0a8c8','#fff0a0','#c8a8f0'][q%3])}
    for(let q=0;q<8;q++){const a=q/8*Math.PI*2+0.3;P(Math.cos(a)*7,0.45,Math.sin(a)*7,0.9,0.9,0.9,'#5a9a4a');P(Math.cos(a)*7,1.0,Math.sin(a)*7,0.45,0.3,0.45,['#f0a8c8','#fff0a0','#c8a8f0'][q%3])}}
  else if(kind==='zigurat'){const T=['#c8b07a','#b89e68','#d8c28a'];
    // schodkowa piramida z szerokimi schodami frontowymi, świątynka na szczycie z ogniem, posągi węży, kanały wodne
    for(let k=0;k<5;k++){const w=17-k*3.2,y=k*2.6;P(0,y+1.3,-k*0.3,w,2.6,w,T[k%2]);P(0,y+2.65,-k*0.3,w+0.2,0.1,w+0.2,T[2]);for(let x=-w/2+0.6;x<w/2;x+=1.2)P(x,y+1.6,-k*0.3+w/2+0.03,0.6,0.5,0.06,'#a88a5a')}
    for(let q=0;q<26;q++)P(0,0.25+q*0.5,8.6-q*0.36,3.2,0.5,0.7,q%2?T[0]:T[2]);for(const sx of [-1,1])for(let q=0;q<13;q++)P(sx*1.9,0.6+q*1,8.4-q*0.72,0.6,1.2,0.8,T[1]);
    P(0,14.2,-1.5,4.6,3,4.6,T[2]);P(0,15.9,-1.5,5.2,0.4,5.2,T[0]);P(0,14,0.82,1.6,2.4,0.1,'#2a1c10');P(0,16.4,-1.5,1.8,0.6,1.8,'#5a4a3a');P(0,17,-1.5,1.2,0.8,1.2,'!#ff8a2e');P(0,17.6,-1.5,0.6,0.5,0.6,'!#ffd34d');
    for(const sx of [-1,1])for(const sz of [-1,1])P(sx*2.4,16.4,-1.5+sz*2.4,0.5,0.8,0.5,S.tr);
    for(const sx of [-1,1]){P(sx*3.2,1.4,8.8,1,2.8,1,'#4a8a6a');P(sx*3.2,3.1,9.2,0.9,0.7,1.6,'#4a8a6a');P(sx*3.2,3.2,10.05,0.2,0.2,0.1,'#ffd34d');P(sx*3.2,0.15,8.8,1.6,0.3,1.6,T[1])}
    for(const sx of [-1,1])P(sx*8.8,0.1,0,0.8,0.15,17.4,'#3a7aa8');P(5,1.4,8.56,1.8,2.8,0.12,'#2a1c10');P(5,3.0,8.6,2.6,0.4,0.2,T[2]);for(const sx of [-1,1])P(5+sx*1.1,1.5,8.62,0.4,3,0.2,T[2]);P(5,3.4,8.62,0.8,0.5,0.1,S.tr);P(0,0.1,-8.8,17.4,0.15,0.8,'#3a7aa8')}
  else if(kind==='pajecza'){const D1='#221d28',D2='#2e2836',VI='!#c890ff',WEB='#d8d0e8';
    // ośmiokątna świątynia z ośmioma „odnóżami”-przyporami, kopuła-odwłok, iglice, pajęczyny i fioletowe płomienie
    ringBoxes(P,0,0,0,6.2,0,7,D2,0.5);ringBoxes(P,0,0,0,6.5,7,7.4,D1,0.5);for(let q=0;q<8;q++){const a=q/8*Math.PI*2+Math.PI/8,c=Math.cos(a),s=Math.sin(a);
      for(let k=0;k<12;k++){const d=6+k*0.27,y=8.4-Math.pow(Math.abs(k-3)/3,1.6)*2.6-(k>3?(k-3)*0.55:0);P(c*d,Math.max(0.5,y),s*d,0.55,1.4,0.55,D1)}P(c*9.1,0.5,s*9.1,0.8,1,0.8,D1);P(c*9.1,1.1,s*9.1,0.3,0.4,0.3,VI)}
    for(let q=0;q<9;q++)ringBoxes(P,0,-0.5,0,5.6*Math.cos(q/9*Math.PI/2)+0.4,7.4+q*0.7,8.1+q*0.7,q%3===1?'#4a2e6a':D2,0.5);for(let q=0;q<5;q++)P(0,14.3+q*0.6,-0.5,0.8-q*0.14,0.6,0.8-q*0.14,q%2?D1:'#4a2e6a');P(0,17.6,-0.5,0.4,0.5,0.4,VI);
    for(let q=0;q<8;q++){const a=q/8*Math.PI*2,c=Math.cos(a),s=Math.sin(a);if(s>0.9)continue;lmWin(P,c*6.22,4,s*6.22,0.6,2.2,Math.abs(c)>0.6?'x':'z',VI,'#4a2e6a',1)}
    for(const sx of [-1,1]){P(sx*4.4,6,-4.4,0.8,12,0.8,D1);lmCone(P,sx*4.4,12,-4.4,0.9,5,D2,'#4a2e6a')}
    P(0,1.6,6.2,2.2,3.2,0.3,'#0e0a12');for(let q=1;q<=3;q++)P(0,3.2+q*0.3,6.25,2.2+q*0.6,0.3,0.25,D1);for(const sx of [-1,1]){P(sx*1.5,1.8,6.4,0.4,3.6,0.4,D1);P(sx*1.5,3.8,6.4,0.5,0.5,0.5,VI)}
    for(let q=0;q<6;q++){const y=4.4+q*0.5;P(0,y,6.45,2.6-q*0.38,0.04,0.04,WEB)}for(let q=-2;q<=2;q++)P(q*0.5,5.6,6.45,0.04,2.6,0.04,WEB);P(0,5.2,6.5,0.7,0.5,0.6,'#1a1420');for(const dx of [-0.2,0.2])P(dx,5.3,6.82,0.1,0.1,0.06,'!#ff3a3a')}
  else if(kind==='mlyn'){const H=6;
    // kamienny młyn z drewnianą wieżą i obracającymi się skrzydłami (osobna siatka), spichlerz na palach, worki i wozy
    ringBoxes(P,-2.5,-1,0,3.6,0,H,S.w,0.5);for(let q=0;q<10;q++)ringBoxes(P,-2.5,-1,0,3.1-q*0.07,H+q*0.9,H+(q+1)*0.9,q%2?'#bca984':'#a89070',0.5);for(let q=0;q<10;q++){const a=q*0.63;P(-2.5+Math.cos(a)*(3.1-q*0.07),H+q*0.9+0.45,-1+Math.sin(a)*(3.1-q*0.07),0.2,0.9,0.2,'#6b4528')}ringBoxes(P,-2.5,-1,0,3.6,H-0.1,H+0.3,'#6b4528',0.5);lmCone(P,-2.5,H+9,-1,1.8,3,S.rf,S.rf2);
    P(-2.5,H+10.3,1.0,1.2,1.2,1.4,'#6b4528');P(-2.5,1.3,2.6,1.4,2.6,0.2,'#3a2414');for(const y of [3.4,8,11])lmWin(P,-2.5,y,2.5-(y-3)*0.12,0.6,0.9,'z','#ffcf6a','#4a2f1d');
    for(let k=0;k<4;k++)for(const sx of [-1,1])P(4+sx*2.2,1,-3+k*2,0.4,2,0.4,WO);P(4,2.2,0,5.2,0.3,8.2,WO2);P(4,3.9,0,5,3.2,8,'#c8a060');for(let x=1.6;x<6.5;x+=0.5)P(x,3.9,4.02,0.06,3.2,0.04,WO);
    lmRoof(P,4,5.5,0,5.8,8.8,2.6,S.rf,S.rf2,'z');P(4,3.6,4.05,1.6,2,0.1,'#6b4528');for(let q=0;q<5;q++)P(4,0.3+q*0.4,5+q*-0.18,1.4,0.15,0.4,WO2);
    for(let q=0;q<8;q++)P(-0.5+(q%4)*0.7,0.35+Math.floor(q/4)*0.5,4.4,0.6,0.55,0.5,'#d8c8a0');P(-5.5,0.7,4,2,0.9,1.4,WO2);for(const sx of [-1,1])P(-5.5+sx*0.9,0.45,4,0.12,0.9,0.9,'#3a2414');P(-5.5,1.3,4,1.8,0.4,1.2,'#d8b24a')}
  else if(kind==='namiot'){const SK='#8a6a48',SK2='#a8865a',BN='#3a2414',RD='#8a2a1a';
    // wielki namiot ze skór na drzewcach, palisada z czaszkami, totemy, ognisko, rogi wodza nad wejściem
    for(let q=0;q<10;q++){const rr=6.6-q*0.62;ringBoxes(P,0,0,0,Math.max(0.6,rr),q*0.9,(q+1)*0.9,q%3===1?RD:q%2?SK:SK2,0.5)}for(let q=0;q<6;q++){const a=q/6*Math.PI*2;P(Math.cos(a)*0.4,9.6,Math.sin(a)*0.4,0.18,2.2,0.18,BN)}
    for(let q=0;q<12;q++){const a=q/12*Math.PI*2;for(let k=0;k<9;k++)P(Math.cos(a)*(6.6-k*0.62),k*0.9+0.45,Math.sin(a)*(6.6-k*0.62),0.14,0.95,0.14,BN)}
    P(0,1.5,6.4,2.4,3,0.4,'#1a1210');for(const sx of [-1,1])P(sx*1.4,1.8,6.5,0.3,3.6,0.3,BN);P(0,3.9,6.6,3.6,0.3,0.3,BN);for(const sx of [-1,1]){P(sx*1.5,4.3,6.6,0.3,0.5,0.3,'#e8e2cc');P(sx*1.9,4.8,6.6,0.25,0.6,0.25,'#e8e2cc');P(sx*2.1,5.4,6.6,0.2,0.5,0.2,'#e8e2cc')}P(0,4.2,6.75,0.7,0.6,0.3,'#e8e2cc');
    for(let q=0;q<28;q++){const a=q/28*Math.PI*2,c=Math.cos(a),s=Math.sin(a);if(s>0.93)continue;P(c*8,1.1,s*8,0.4,2.2+(q%3)*0.3,0.4,BN);if(q%4===0)P(c*8,2.6,s*8,0.4,0.4,0.4,'#e8e2cc')}
    for(const sx of [-1,1]){const x=sx*4.6;P(x,2.5,6.8,0.6,5,0.6,'#5a3a22');P(x,3.6,6.8,0.9,0.7,0.8,RD);P(x,4.4,6.8,0.8,0.6,0.8,'#3f6a4a');P(x,5.1,6.8,1,0.7,0.8,'#d8b24a');for(const dx of [-0.2,0.2])P(x+dx,3.7,7.22,0.14,0.14,0.06,'#ffd34d');P(x,5.7,6.8,1.6,0.3,0.3,'#e8e2cc')}
    P(4.6,0.3,9,1.4,0.4,1.4,'#4a4650');P(4.6,0.6,9,0.8,0.4,0.8,'!#ff8a2e');P(4.6,0.95,9,0.4,0.4,0.4,'!#ffd34d')}
  return L}
const LMK_GEOS=new Map();function lmExtGeo(kind,race,sty){const k=kind+'|'+(race||'ludzie')+'|'+(sty||'');if(!LMK_GEOS.has(k))LMK_GEOS.set(k,raceStoneTag(bigTag(boxes(structTex(lmExtList(kind,race||'ludzie',sty),kind.length*31+(race||'').length*7,1.2))),race||'ludzie',sty));return LMK_GEOS.get(k)}
// świecące elementy (prefiks !) jako osobna siatka bez cieniowania
function lmGlowGeo(kind,race,sty){const k='g|'+kind+'|'+race+'|'+(sty||'');if(!LMK_GEOS.has(k)){const L=lmExtList(kind,race||'ludzie',sty).filter(b=>typeof b[6]==='string'&&b[6][0]==='!').map(b=>[b[0],b[1],b[2],b[3]+0.04,b[4]+0.04,b[5]+0.04,b[6].slice(1)]);LMK_GEOS.set(k,L.length?boxes(L):null)}return LMK_GEOS.get(k)}
// mesh budynku: bryła + świecące elementy + ruchome części (wskazówki zegara, skrzydła młyna)
function lmBuild(h,v){const hg=new THREE.Group();hg.position.set(h.x,h.top,h.z);hg.rotation.y=h.rot;const m=new THREE.Mesh(lmExtGeo(h.func,v.race,v.sty),matB);m.castShadow=true;m.receiveShadow=true;m.userData.keep=1;hg.add(m);
  const gg=lmGlowGeo(h.func,v.race,v.sty);if(gg){const gm=new THREE.Mesh(gg,GLOWMAT);gm.userData.keep=1;hg.add(gm)}
  if(h.func==='ratusz'){const sty=v.sty,S=kcStyle(v.race,sty),y=4.2+3.6+7,tz=1.2;h._clk=[];for(const [fx,fz] of [[0,1],[1,0],[-1,0],[0,-1]]){const o=new THREE.Group();o.position.set(fx*1.95,y,tz+fz*1.95);o.rotation.y=Math.atan2(fx,fz);
      const hh=new THREE.Mesh(boxes([[0,0.42,0,0.14,0.84,0.06,'#1a1410']]),matB),mm=new THREE.Mesh(boxes([[0,0.6,0,0.09,1.2,0.05,'#1a1410']]),matB);mm.position.z=0.04;hh.userData.keep=mm.userData.keep=1;o.add(hh,mm);hg.add(o);h._clk.push([hh,mm])}
    (v._clocks=v._clocks||[]).push(h)}
  if(h.func==='mlyn'){const o=new THREE.Group();o.position.set(-2.5,6+10.3,1.75);const L=[[0,0,0,0.6,0.6,0.6,'#4a2f1d']];for(let q=0;q<4;q++){const a=q*Math.PI/2,c=Math.cos(a),s=Math.sin(a);for(let k=1;k<=6;k++){L.push([c*k*0.9,s*k*0.9,0,0.25,0.25,0.12,'#4a2f1d']);if(k>1)L.push([c*k*0.9-s*0.6,s*k*0.9+c*0.6,0.02,0.9,0.9,0.04,'#efe6d0'])}}
    const sm=new THREE.Mesh(boxes(L),matB);sm.castShadow=true;sm.userData.keep=1;o.add(sm);hg.add(o);h._sail=o;(v._mills=v._mills||[]).push(h)}
  if(h.func==='wiezamaga'){const o=new THREE.Mesh(boxes([[0,0,0,1.1,1.1,1.1,'#a8e8ff']]),GLOWMAT);o.position.set(0,20+15.5,0);o.userData.keep=1;hg.add(o);h._orb=o;(v._orbs=v._orbs||[]).push(h)}
  return hg}
TICKS.push(()=>{const t=performance.now()/1000;for(const v of villages.values()){if(!v||!v.g)continue;
  if(v._clocks)for(const h of v._clocks){if(!h._clk)continue;const hr=(typeof hour==='number'?hour:12)%12,mn=((typeof hour==='number'?hour:12)%1)*60;for(const [hh,mm] of h._clk){hh.rotation.z=-hr/12*Math.PI*2;mm.rotation.z=-mn/60*Math.PI*2}}
  if(v._mills)for(const h of v._mills)if(h._sail)h._sail.rotation.z=t*0.6;
  if(v._orbs)for(const h of v._orbs)if(h._orb){h._orb.rotation.y=t*0.8;h._orb.rotation.x=t*0.5;h._orb.position.y=35.5+Math.sin(t*1.3)*0.4}}});
// rozmieszczenie w mieście: przy ulicach, frontem do ulicy; preferencje odległości od rynku/zamku
function lmPlace(c,pl,r,footOK,occ,distAt){const kinds=['ratusz','katedra','gildia','zajazd','koszary','wiezamaga','wiezienie'];const rk=LMK_RACE[c.race];if(rk&&rk!=='ratusz')kinds.splice(2,0,rk);if(c.port!=null)kinds.push('stocznia');
  const cand=[];for(const s of pl.ST){if(s.k>=4)continue;for(let i=0;i<s.p.length-1;i++){const [x0,z0]=s.p[i],[x1,z1]=s.p[i+1],tx=x1-x0,tz=z1-z0,tl=Math.hypot(tx,tz)||1;for(let t=0;t<tl;t+=3)for(const sd of [1,-1]){const nx=-tz/tl*sd,nz=tx/tl*sd,px=x0+tx*t/tl,pz=z0+tz*t/tl;cand.push({px,pz,nx,nz,w:s.w,p:pl.rho(px,pz),dm:Math.hypot(px-pl.M[0],pz-pl.M[1]),dist:c.gen===2?distAt(px,pz):null})}}}
  const PREF={ratusz:q=>q.dm,katedra:q=>Math.abs(q.p-0.38)*200,gildia:q=>q.dm*1.2,zajazd:q=>Math.abs(q.p-0.5)*160,koszary:q=>Math.abs(q.p-0.8)*160,wiezamaga:q=>Math.abs(q.p-0.6)*160,wiezienie:q=>Math.abs(q.p-0.7)*160,stocznia:q=>(q.dist==='port'?0:200)+Math.abs(q.p-0.82)*100};
  const out=[];for(const k of kinds){const M=LMK[k],f=PREF[k]||(q=>Math.abs(q.p-0.45)*160);const list=cand.map(q=>[f(q)+r()*25,q]).sort((a,b)=>a[0]-b[0]);
    for(const [,q] of list){const back=q.w/2+1.2+M.pd/2,x=q.px+q.nx*back,z=q.pz+q.nz*back,rot=Math.atan2(-q.nx,-q.nz);if(q.p>0.86)continue;const lv=footOK(x,z,rot,M.pw/2,M.pd/2);if(lv===false)continue;
      const h={x:c.x+Math.round(x*2)/2,z:c.z+Math.round(z*2)/2,rot,top:c.h+lv,bot:c.h+lv-1,type:'kupiec',func:k,big:1,city:1};occ.push({x,z,hw:M.pw/2+0.6,hd:M.pd/2+0.6,r:rot});out.push(h);break}}
  return out}
function lmCore(h){const M=LMK[h.func],b=M.cb!=null?M.cb:-M.pd/2+0.5,f=M.dz-0.15;return{w:M.w,d:f-b,ox:0,oz:(f+b)/2,front:f,pw:M.pw,pd:M.pd}}
// ===== wnętrza dużych budynków (siatka 1 m, wejście od dołu planu, środek przy drzwiach wolny) =====
function lmFurnish(f,s,C){const {P,X,Z,SOL,npc,torch,table,barrel,fire,r,W,D,WD,WDD,ST,CLO}=C,ce=s.ceil,GOLD='#d9b23a',VIT=['#c83a3a','#3a5ac8','#d9b23a','#3a9a5a','#8a3ac8'];
  const candle=(x,y,z)=>{P(x,y,z,0.08,0.22,0.08,'#f0e8d0');P(x,y+0.15,z,0.05,0.08,0.05,'!#ffd27a')};
  const pillar=(i,j,c)=>{SOL(i,j,i,j);P(X(i+0.5),ce/2,Z(j+0.5),0.8,ce,0.8,c||ST);P(X(i+0.5),0.15,Z(j+0.5),1.05,0.3,1.05,darker(c||ST,0.85));P(X(i+0.5),ce-0.2,Z(j+0.5),1.05,0.4,1.05,darker(c||ST,0.85))};
  const shelf=(i,j,len,ax)=>{SOL(i,j,ax?i:i+len-1,ax?j+len-1:j);const cx=ax?X(i+0.5):X(i+len/2),cz=ax?Z(j+len/2):Z(j+0.5);P(cx,1.3,cz,ax?0.6:len,2.6,ax?len:0.6,WD);for(const y of [0.5,1.1,1.7,2.3])for(let q=0;q<len*3;q++){const o=-len/2+0.17+q*0.33;P(ax?cx:cx+o,y+0.16,ax?cz+o:cz,ax?0.45:0.22,0.3,ax?0.22:0.45,['#7a2a22','#2f4f7f','#5a7a3a','#8a6a2a','#5a3a6a'][(q+Math.round(y*7))%5])}};
  const bed=(i,j)=>{SOL(i,j,i,j+1);P(X(i+0.5),0.3,Z(j+1),0.9,0.3,1.9,WD);P(X(i+0.5),0.5,Z(j+1),0.8,0.12,1.8,'#d8d0b8');P(X(i+0.5),0.58,Z(j+1.3),0.82,0.06,1.1,CLO);P(X(i+0.5),0.6,Z(j+0.3),0.6,0.1,0.35,'#f0ece0')};
  const rack=(x,z,ax)=>{P(x,1.1,z,ax?0.2:1.6,0.1,ax?1.6:0.2,WDD);for(let q=0;q<4;q++){const o=-0.6+q*0.4;P(ax?x:x+o,1.2,ax?z+o:z,0.06,1.6,0.06,q%2?'#aeb6bd':'#8a8f94');P(ax?x:x+o,2.0,ax?z+o:z,0.2,0.16,0.06,'#6b4528')}};
  const chand=(x,z,big)=>{const y=ce-(big?1.6:0.9);P(x,(y+ce)/2,z,0.06,ce-y,0.06,'#3a3a40');P(x,y,z,big?2.2:1.3,0.1,big?2.2:1.3,'#3a2a1a');for(let q=0;q<(big?8:4);q++){const a=q/(big?8:4)*Math.PI*2,rr=big?1.0:0.55;candle(x+Math.cos(a)*rr,y+0.1,z+Math.sin(a)*rr)}s.lights.push([s.x0+W/2+x,s.fy+y,s.z0+D/2+z,big?11:7,big?1.1:0.8,[1,0.8,0.5]])};
  if(f==='katedra'){// nawa z kolumnadą, ławy, ołtarz w prezbiterium, witraże, organy, żyrandole
    for(let j=3;j<D-3;j+=4){pillar(3,j);pillar(W-4,j)}for(let j=7;j<D-3;j+=2){for(const [a,b] of [[4,5],[W-6,W-5]]){SOL(a,j,b,j);P(X(a+1),0.45,Z(j+0.5),2,0.1,0.6,WD);P(X(a+1),0.75,Z(j+0.85),2,0.5,0.08,WD)}}
    for(let q=0;q<D-6;q++)P(0,0.015,Z(4+q+0.5),2,0.02,1,q%2?'#8a2a2a':'#a83a2a');
    SOL(4,1,W-5,3);P(0,0.2,Z(2),W-8,0.4,3.6,'#c8c0b0');P(0,0.55,Z(2),W-9,0.3,3,'#d8d0c0');P(0,1.2,Z(2),3,1,1.2,'#e8e2d6');P(0,1.73,Z(2),3.2,0.06,1.4,'#a8352a');for(const x of [-1.2,-0.4,0.4,1.2])candle(x,1.76,Z(2));
    P(0,3.6,Z(1)+0.1,0.3,3.2,0.12,GOLD);P(0,4.4,Z(1)+0.1,1.6,0.3,0.12,GOLD);P(0,4.4,Z(1)+0.14,0.6,0.6,0.1,'!#fff0c0');
    for(let q=0;q<5;q++)P(X(1)+0.06,ce-2.6,Z(4+q*4),0.06,3.4,1,VIT[q%5]),P(X(W-1)-0.06,ce-2.6,Z(4+q*4),0.06,3.4,1,VIT[(q+2)%5]);
    for(let q=0;q<7;q++){const a=q/7*Math.PI;P(Math.cos(a)*1.6,ce-2.4+Math.sin(a)*1.0,Z(1)+0.06,0.6,0.6,0.06,VIT[q%5])}
    SOL(1,1,2,3);P(X(2),1.6,Z(2),1.8,3.2,2.6,WDD);for(let q=0;q<8;q++)P(X(1.4)+(q%2)*0.4,3.4+q*0.25,Z(1)+0.4+q*0.28,0.12,1.6+q*0.3,0.12,'#c9b070');
    for(let j=6;j<D-3;j+=6)chand(0,Z(j),1);for(const [i,j] of [[W-3,D-4],[2,D-4]]){SOL(i,j,i,j);P(X(i+0.5),0.6,Z(j+0.5),0.6,1.2,0.6,ST);P(X(i+0.5),1.25,Z(j+0.5),0.8,0.1,0.8,'#6a8ab8')}
    for(let k=0;k<12;k++)candle(X(W-2.5)+(k%4)*0.2,0.9,Z(4)+Math.floor(k/4)*0.25);P(X(W-2.2),0.45,Z(4.3),0.9,0.9,0.9,ST);
    npc('starszy','Biskup',W/2,3.8,0);npc('mieszk','Mnich',3,D-6,Math.PI*0.5);npc('mieszk','Wierny',W/2-2,9,Math.PI);s.heal=1}
  else if(f==='ratusz'){// sala rady: długi stół, krzesło burmistrza na podeście, mapy, chorągwie, tablica ogłoszeń, mechanizm zegara
    SOL(4,4,W-5,6);P(0,0.8,Z(5.5),W-8,0.12,2.6,'#5a3a22');for(const x of [X(4.5),X(W-4.5)])for(const z of [Z(4.4),Z(6.6)])P(x,0.4,z,0.2,0.8,0.2,WDD);P(0,0.81,Z(5.5),W-9,0.02,1.6,'#2f5f3f');
    for(let i=5;i<W-5;i+=2){P(X(i+0.5),0.45,Z(3.5),0.6,0.1,0.6,WD);P(X(i+0.5),0.9,Z(3.2),0.6,0.8,0.08,WD);P(X(i+0.5),0.45,Z(7.5),0.6,0.1,0.6,WD);P(X(i+0.5),0.9,Z(7.8),0.6,0.8,0.08,WD)}
    SOL(W/2-1,1,W/2,2);P(0,0.15,Z(1.8),4,0.3,2.4,'#7a2a22');P(0,0.9,Z(1.5),1.2,0.12,1,'#6b4528');P(0,1.6,Z(1.1),1.2,1.6,0.12,'#6b4528');P(0,2.5,Z(1.1),0.9,0.3,0.1,GOLD);
    for(const sx of [-1,1]){P(sx*3,ce-1.6,Z(1)+0.06,1,2.4,0.06,s.v&&s.v.race==='elfy'?'#2f6e46':'#7a1f1f');P(sx*3,ce-2.6,Z(1)+0.08,0.5,0.5,0.06,GOLD)}
    P(X(1)+0.05,2.4,Z(D/2),0.06,1.8,3,'#e8dcb8');P(X(1)+0.07,2.4,Z(D/2),0.04,1.4,2.6,'#c8b888');for(let q=0;q<6;q++)P(X(1)+0.09,1.9+(q%3)*0.45,Z(D/2)-1+Math.floor(q/3)*1.2+(q%3)*0.2,0.03,0.3,0.4,'#3a5a7a');
    P(X(W-1)-0.05,2,Z(D/2),0.08,1.6,2.6,'#6b4528');for(let q=0;q<8;q++)P(X(W-1)-0.1,1.6+Math.floor(q/4)*0.7,Z(D/2)-1+(q%4)*0.66,0.03,0.5,0.4,['#efe6d0','#e8dcb8','#f4f0e0'][q%3]);
    for(let q=0;q<5;q++){const gx=X(W-2.5),gy=ce-1.2,gz=Z(2.5);P(gx+(q-2)*0.4,gy,gz,0.06,0.5+q*0.1,0.5+q*0.1,q%2?'#c9a24a':'#8a6a3a')}chand(0,Z(5.5),1);
    npc('starszy','Burmistrz',W/2,2.8,0);npc('mieszk','Pisarz miejski',3,8.5,Math.PI*0.5);npc('straz','Strażnik ratusza',W-3,D-3,Math.PI)}
  else if(f==='gildia'){// sala bankowa: lada z kratą, skarbiec z okrągłymi drzwiami, skrzynie złota, księgi rachunkowe
    SOL(2,3,W-3,3);P(0,0.55,Z(3.5),W-4,1.1,0.9,'#5a3a22');P(0,1.12,Z(3.5),W-3.8,0.08,1,'#8a6240');for(let x=X(2.2);x<X(W-2);x+=0.3)P(x,1.7,Z(3.5),0.04,1.1,0.04,'#c9a24a');P(0,2.28,Z(3.5),W-4,0.08,0.1,'#c9a24a');
    for(const x of [-4,0,4]){P(x,1.2,Z(3.4),0.6,0.06,0.4,'#efe6d0');P(x+0.2,1.25,Z(3.4),0.12,0.12,0.12,GOLD)}
    SOL(W/2-2,1,W/2+1,1);P(0,1.7,Z(1)+0.12,3.4,3.4,0.2,'#5a5a62');P(0,1.7,Z(1)+0.24,2.8,2.8,0.08,'#8a8f94');for(let q=0;q<8;q++){const a=q/8*Math.PI*2;P(Math.cos(a)*1.1,1.7+Math.sin(a)*1.1,Z(1)+0.3,0.22,0.22,0.06,'#c9a24a')}P(0,1.7,Z(1)+0.32,0.5,0.5,0.06,'#3a3a40');for(const a of [0,1.57])P(0,1.7,Z(1)+0.36,a?0.1:1.2,a?1.2:0.1,0.04,'#c9a24a');
    for(const [i,j] of [[1,1],[2,1],[W-2,1],[W-3,1]]){SOL(i,j,i,j);P(X(i+0.5),0.35,Z(j+0.5),0.8,0.7,0.6,'#6b4528');P(X(i+0.5),0.72,Z(j+0.5),0.6,0.12,0.4,GOLD);P(X(i+0.5),0.35,Z(j+0.8),0.82,0.08,0.02,'#3a3a40')}
    for(let q=0;q<10;q++)P(X(1.5)+(q%3)*0.15,0.05+Math.floor(q/3)*0.05,Z(2.4)+(q%2)*0.1,0.12,0.04,0.12,GOLD);shelf(1,6,3,1);shelf(W-2,6,3,1);
    for(const x of [-3,3]){SOL(Math.floor(W/2+x)-1,7,Math.floor(W/2+x),7);P(x,0.45,Z(7.5),1.6,0.1,0.5,WD)}chand(0,Z(6),1);
    npc('kupiec','Bankier',W/2-3,2.4,0);npc('kupiec','Mistrz gildii',W/2+3,2.4,0);npc('mieszk','Klient banku',W/2,6,Math.PI);npc('straz','Strażnik skarbca',W/2+2.2,1.9,0)}
  else if(f==='koszary'){// sala sypialna z pryczami, stojaki z bronią, stół kwatermistrza, manekin, zbroje na stojakach
    for(let i=1;i<6;i+=2)bed(i,1),bed(i,4);for(let i=W-2;i>W-7;i-=2)bed(i,1),bed(i,4);
    for(const x of [X(W/2-2),X(W/2+2)])rack(x,Z(1)+0.2,0);rack(X(1)+0.2,Z(9),1);rack(X(W-1)-0.2,Z(9),1);
    SOL(W/2-2,7,W/2+1,8);P(0,0.8,Z(8),4,0.12,2,'#6b4528');P(0,0.4,Z(8),3.6,0.8,1.6,WDD);P(-0.8,0.9,Z(8),1,0.04,0.8,'#e8dcb8');P(0.9,0.95,Z(7.8),0.3,0.16,0.3,'#aeb6bd');
    for(const [i,j] of [[2,D-4],[W-3,D-4]]){SOL(i,j,i,j);P(X(i+0.5),0.8,Z(j+0.5),0.12,1.6,0.12,WDD);P(X(i+0.5),1.3,Z(j+0.5),0.6,0.7,0.36,'#8a8f94');P(X(i+0.5),1.82,Z(j+0.5),0.34,0.34,0.34,'#aeb6bd');P(X(i+0.5),1.3,Z(j+0.5)+0.2,0.5,0.5,0.04,s.v&&s.v.race?'#7a1f1f':'#7a1f1f')}
    torch(X(1)+0.2,Z(6));torch(X(W-1)-0.2,Z(6));npc('kupiec','Kwatermistrz',W/2,6.4,0);npc('najemnik',null,3,D-3,Math.PI*1.2);npc('najemnik',null,W-4,D-5,Math.PI*0.8);npc('straz','Sierżant',W/2+3,9,Math.PI);s.pets=['pies']}
  else if(f==='zajazd'){// duża gospoda: długi bar z beczkami, kominek, stoły, scena dla barda, schody na piętro, poroża
    SOL(2,1,W-3,2);P(0,0.55,Z(2.5),W-5,1.1,1,'#6b4528');P(0,1.12,Z(2.5),W-4.8,0.08,1.1,'#8a6240');for(let i=3;i<W-3;i+=2)barrel(i,1);for(let k=0;k<6;k++)P(X(2+k*2.6),2.4,Z(1)+0.15,0.6,0.1,0.25,'#d8d0b8'),P(X(2+k*2.6),2.55,Z(1)+0.15,0.2,0.2,0.2,'#c9a24a');
    fire(W-3,4,false);table(2,5);table(6,5);table(W-8,5);table(2,9);table(6,9);table(W-8,9);
    SOL(W-4,D-5,W-2,D-3);P(X(W-2.5),0.25,Z(D-4),3,0.5,3,'#5a3a22');P(X(W-2.5),0.85,Z(D-4.6),0.5,0.7,0.4,'#a8723a');P(X(W-2.5),0.85,Z(D-4.6)+0.3,0.1,0.6,0.08,'#3a2414');
    for(let q=0;q<6;q++){SOL(1,D-8+q,1,D-8+q);P(X(1.5),0.2+q*0.4,Z(D-8+q+0.5),0.9,0.4+q*0.8,1,WD)}
    for(const x of [-3,3]){P(x,ce-0.9,Z(1)+0.12,0.4,0.4,0.2,'#6b4528');for(const sx of [-1,1])P(x+sx*0.4,ce-0.5,Z(1)+0.15,0.5,0.1,0.1,'#e8e2cc'),P(x+sx*0.65,ce-0.25,Z(1)+0.15,0.1,0.4,0.1,'#e8e2cc')}
    chand(-3,Z(6),0);chand(3,Z(6),0);chand(0,Z(10),0);torch(X(1)+0.2,Z(4));
    npc('kupiec','Karczmarz',W/2,3.2,0);npc('mieszk','Bard',W-2.5,D-4,Math.PI*1.25);npc('mieszk','Gość',3,6.5,Math.PI);npc('mieszk','Podróżna',7,10.4,0);npc('najemnik',null,W-7,6.5,Math.PI);npc('najemnik',null,3,10.4,0);s.pets=['kot']}
  else if(f==='wiezamaga'){// pracownia maga: krąg runiczny ze świecącą kulą, regały z księgami, stół alchemiczny, teleskop, schody spiralne
    for(let q=0;q<16;q++){const a=q/16*Math.PI*2;P(Math.cos(a)*2,0.02,Math.sin(a)*2,0.4,0.02,0.4,'!#9a7aff')}for(let q=0;q<8;q++){const a=q/8*Math.PI*2;P(Math.cos(a)*1.3,0.03,Math.sin(a)*1.3,0.25,0.02,0.25,'!#a8e8ff')}
    SOL(W/2-1,D/2-1,W/2,D/2);P(0,0.5,0,0.8,1,0.8,'#3a2a4a');P(0,1.6,0,0.7,0.7,0.7,'!#a8e8ff');s.lights.push([s.x0+W/2,s.fy+1.8,s.z0+D/2,8,1.2,[0.6,0.7,1]]);
    shelf(1,1,4,0);shelf(W-5,1,4,0);shelf(1,3,4,1);shelf(W-2,3,4,1);
    SOL(1,D-4,2,D-3);P(X(2),0.8,Z(D-3.5),1.8,0.1,1.8,'#4a2f1d');for(let q=0;q<6;q++)P(X(1.4)+(q%3)*0.4,1.0,Z(D-4)+0.3+Math.floor(q/3)*0.6,0.16,0.3,0.16,['!#7aff9a','!#ff7a9a','!#7ab8ff','!#ffd27a','#d8d0b8','!#c890ff'][q]);
    SOL(W-3,D-4,W-2,D-3);for(let q=0;q<8;q++){const a=q*0.8;P(X(W-2)+Math.cos(a)*0.6,0.3+q*0.6,Z(D-3.5)+Math.sin(a)*0.6,0.8,0.12,0.5,WD)}P(X(W-2),ce/2,Z(D-3.5),0.2,ce,0.2,WDD);
    P(X(W/2+2),1.3,Z(2.5),0.12,1.4,0.12,WDD);P(X(W/2+2.2),2.1,Z(2.5),0.25,0.25,1.2,'#c9a24a');for(let q=0;q<10;q++)P(Math.cos(q)*3,ce-0.3,Math.sin(q*1.3)*3,0.08,0.08,0.08,'!#ffffff');
    npc('kupiec','Arcymag',W/2+2,D/2+1.6,Math.PI);npc('mieszk','Uczeń maga',2.5,D-5,Math.PI*0.5);s.pets=['kot']}
  else if(f==='wiezienie'){// cele z kratami i pryczami, strażnicy przy stole z kośćmi, klucze na ścianie, dyby
    for(let k=0;k<3;k++){const i0=1+k*4;for(let j=1;j<=4;j++)SOL(i0+3,j,i0+3,j);for(let i=i0;i<i0+3;i++)SOL(i,4,i,4);for(let q=0;q<10;q++)P(X(i0)+0.2+q*0.3,1.4,Z(4.5),0.08,2.8,0.08,'#3a3a40');P(X(i0+1.5),2.7,Z(4.5),3,0.1,0.1,'#3a3a40');for(let q=0;q<10;q++)P(X(i0+3.5),1.4,Z(1)+0.2+q*0.35,0.08,2.8,0.08,'#3a3a40');
      P(X(i0+1),0.25,Z(1.8),1.6,0.2,0.8,'#8a6a40');P(X(i0+1),0.4,Z(1.8),1.4,0.08,0.6,'#c8a868');P(X(i0+2.3),0.2,Z(3.3),0.4,0.4,0.4,'#6b4a2b');for(let q=0;q<5;q++)P(X(i0+0.2+r()*2.5),0.02,Z(1.4+r()*2.6),0.4,0.02,0.1,'#c8a85a')}
    s.npcs.push({role:'mieszk',roleN:'Więzień',x:s.x0+2.5,z:s.z0+2.5,ry:0});s.npcs.push({role:'mieszk',roleN:'Więźniarka',x:s.x0+10.5,z:s.z0+2.5,ry:0});
    SOL(W/2-1,6,W/2,6);P(0,0.75,Z(6.5),2,0.1,1,WD);P(0,0.37,Z(6.5),1.8,0.74,0.8,WDD);for(const [x,c] of [[-0.3,'#efe6d0'],[0.2,'#efe6d0'],[0.6,'#c9a24a']])P(x,0.86,Z(6.5),0.12,0.12,0.12,c);P(-0.7,0.9,Z(6.4),0.2,0.25,0.2,'#8a5a30');
    P(X(W-1)-0.06,2,Z(7),0.06,0.8,1.2,'#6b4528');for(let q=0;q<5;q++)P(X(W-1)-0.12,1.85,Z(6.5)+q*0.25,0.04,0.3,0.04,'#c9a24a');torch(X(1)+0.2,Z(7));torch(X(W-1)-0.2,Z(5.5));
    npc('straz','Strażnik więzienny',W/2-2,7.2,0);npc('straz','Klucznik',W/2+2,7.2,Math.PI)}
  else if(f==='stocznia'){// hala stoczni od środka: kadłub łodzi, kozły, liny, smoła, narzędzia
    for(let k=2;k<D-4;k++){const sc=1-Math.pow(Math.abs(k-(D-4)/2)/((D-4)/2+1),2),w=Math.max(1,Math.round(4*sc));SOL(Math.floor(W/2-w/2),k,Math.ceil(W/2+w/2)-1,k);for(let q=0;q<4;q++)P(0,0.5+q*0.55,Z(k+0.5),(w-0.4)*(0.6+q*0.13),0.5,1,q%2?'#8f5a2a':'#7a4b22')}
    P(0,4.2,Z(D/2-1),0.25,4.4,0.25,WDD);for(let q=0;q<5;q++)P(X(1)+0.15,1.5+q*0.3,Z(3+q*1.2),0.1,0.25,0.9,'#c8b080');
    for(const [i,j] of [[1,D-4],[2,D-4],[W-2,2],[W-2,3]])barrel(i,j);SOL(W-4,D-4,W-2,D-3);for(let q=0;q<5;q++)P(X(W-2.5),0.15+q*0.16,Z(D-3.5),3,0.14,1.2,q%2?'#b88a5a':'#a87a4a');
    SOL(1,1,4,1);P(X(2.5),0.9,Z(1.5),4,0.12,0.9,'#8a6240');for(let k=0;k<6;k++)P(X(1.3+k*0.6),1.6,Z(1)+0.08,0.08,0.5,0.05,k%2?'#8a8f94':'#6b4528');chand(0,Z(D/2),1);
    npc('kupiec','Szkutnik',3,4,Math.PI*0.5);npc('mieszk','Cieśla okrętowy',W-4,6,Math.PI*1.5);npc('mieszk','Smołownik',W/2+3,D-5,Math.PI)}
  else if(f==='wkuznia'){// wielka kuźnia: trzy paleniska, kanał lawy, kowadła, młot wodny, stojaki z gotową bronią
    fire(1,1,true);fire(W/2-1,1,true);fire(W-3,1,true);for(let i=2;i<W-2;i++){SOL(i,4,i,4);P(X(i+0.5),0.05,Z(4.5),1,0.1,0.8,'!#ff6a1a')}P(0,0.12,Z(4.5),W-4,0.04,1,'!#ffb04a');
    for(const x of [-4,0,4]){const i=Math.floor(W/2+x);SOL(i,6,i,6);P(x+0.5,0.4,Z(6.5),0.6,0.8,0.5,WDD);P(x+0.5,0.9,Z(6.5),1.2,0.25,0.5,'#4a4a52');P(x+0.5,1.08,Z(6.5),1.3,0.1,0.4,'#5a5a62')}
    rack(X(1)+0.2,Z(8),1);rack(X(W-1)-0.2,Z(8),1);for(const [i,j] of [[1,D-3],[2,D-3],[W-2,D-3]])barrel(i,j);
    for(let k=0;k<6;k++)P(X(W/2-3+k),0.35,Z(D-3),0.4,0.7,0.12,['#aeb6bd','#8a8f94'][k%2]);torch(X(1)+0.2,Z(6));torch(X(W-1)-0.2,Z(6));
    npc('kowal','Mistrz kowalski',W/2,7.6,0);npc('kowal','Czeladnik',3,6.6,Math.PI*0.5);npc('kupiec','Płatnerz',W-4,8.6,Math.PI*1.5)}
  else if(f==='drzewo'){// sala w pniu: żywe ściany z korzeni, fontanna, tron z gałęzi, świetliki, rośliny
    for(let q=0;q<16;q++){const a=q/16*Math.PI*2;P(Math.cos(a)*(W/2-1.4),ce/2,Math.sin(a)*(D/2-1.4),0.9,ce,0.9,'#5a3a22')}for(let q=0;q<10;q++){const a=q*0.6;P(Math.cos(a)*3,ce-0.6,Math.sin(a)*3,4,0.3,0.5,'#4a2f1d')}
    SOL(W/2-1,D/2-1,W/2,D/2);ringBoxes(P,0,0,0,1.4,0,0.6,'#c8c0b0',0.5);ringBoxes(P,0,0,0,1.1,0.4,0.62,'#4a8ac8',0.5);P(0,1.0,0,0.3,0.8,0.3,'#c8c0b0');P(0,1.5,0,0.2,0.3,0.2,'#7ac8ff');
    SOL(W/2-1,1,W/2,2);P(0,0.6,Z(2),1.6,1.2,1.2,'#6b4528');P(0,1.8,Z(1.5),1.4,2.4,0.3,'#5a3a22');for(let q=0;q<5;q++)P(-0.8+q*0.4,3.1+Math.abs(q-2)*-0.2,Z(1.5),0.12,0.6,0.12,'#3f8a3a');
    for(let q=0;q<20;q++)P(X(1+r()*(W-2)),1+r()*(ce-2),Z(1+r()*(D-2)),0.08,0.08,0.08,'!#e8ff8a');
    for(const [i,j] of [[2,2],[W-3,2],[2,D-4],[W-3,D-4]]){SOL(i,j,i,j);P(X(i+0.5),0.4,Z(j+0.5),0.7,0.8,0.7,'#8a6a4a');P(X(i+0.5),1.2,Z(j+0.5),1,1,1,'#4a9a42');P(X(i+0.5),1.6,Z(j+0.5),0.3,0.3,0.3,['#f0a8c8','#fff0a0','#c8a8f0','#a8f0c8'][(i+j)%4])}
    s.lights.push([s.x0+W/2,s.fy+3,s.z0+D/2,9,0.9,[0.8,1,0.7]]);npc('starszy','Strażniczka Drzewa',W/2,3.2,0);npc('kupiec','Zielarz',3,7,Math.PI*0.5);npc('mieszk','Śpiewaczka',W-4,7,Math.PI*1.5)}
  else if(f==='zigurat'){// komnata kapłanów: ołtarz ofiarny z ogniem, posągi węży, baseny, płaskorzeźby
    SOL(W/2-1,1,W/2,2);P(0,0.5,Z(2),2.4,1,1.6,'#b89e68');P(0,1.1,Z(2),1.4,0.2,1,'#8a6a3a');P(0,1.4,Z(2),0.8,0.5,0.6,'!#ff8a2e');P(0,1.8,Z(2),0.4,0.4,0.4,'!#ffd34d');s.lights.push([s.x0+W/2,s.fy+1.6,s.z0+2,8,1.1,[1,0.6,0.3]]);
    for(const sx of [-1,1]){const i=Math.floor(W/2+sx*4);SOL(i,2,i,2);P(sx*4+0.5,1.2,Z(2.5),0.8,2.4,0.8,'#4a8a6a');P(sx*4+0.5,2.7,Z(2.8),0.7,0.6,1.3,'#4a8a6a');P(sx*4+0.5,2.8,Z(3.45),0.15,0.15,0.1,'#ffd34d')}
    for(const sx of [-1,1]){const i0=sx<0?2:W-5;SOL(i0,6,i0+2,8);P(sx*(W/2-3.5),0.1,Z(7.5),3,0.2,3,'#b89e68');P(sx*(W/2-3.5),0.15,Z(7.5),2.6,0.1,2.6,'#3a8ac8')}
    for(let q=0;q<10;q++)P(X(1)+0.05,1.2+(q%2)*1.2,Z(2+q*1.1),0.06,0.8,0.8,['#a88a5a','#4a8a6a','#d9b23a'][q%3]),P(X(W-1)-0.05,1.2+(q%2)*1.2,Z(2+q*1.1),0.06,0.8,0.8,['#4a8a6a','#d9b23a','#a88a5a'][q%3]);
    torch(X(1)+0.2,Z(5));torch(X(W-1)-0.2,Z(5));npc('starszy','Arcykapłan Słońca',W/2,3.6,0);npc('mieszk','Akolita',W/2-3,5,Math.PI*0.3);s.heal=1}
  else if(f==='pajecza'){// świątynia drowów: ośmioramienny ołtarz-pająk, pajęczyny, fioletowe płomienie, kokony
    SOL(W/2-1,1,W/2,2);P(0,0.5,Z(2),2,1,1.4,'#221d28');P(0,1.4,Z(2),1.2,0.8,1,'#2e2836');for(const dx of [-0.25,0.25])P(dx,1.6,Z(2)+0.52,0.12,0.12,0.06,'!#ff3a3a');for(let q=0;q<8;q++){const a=q/8*Math.PI*2;P(Math.cos(a)*1.3,0.8,Z(2)+Math.sin(a)*0.9,0.9,0.15,0.15,'#221d28')}
    for(const [x,z] of [[X(2),Z(2)],[X(W-2),Z(2)],[X(2),Z(D-4)],[X(W-2),Z(D-4)]]){P(x,0.6,z,0.6,1.2,0.6,'#2e2836');P(x,1.4,z,0.5,0.5,0.5,'!#c890ff');s.lights.push([s.x0+W/2+x,s.fy+1.6,s.z0+D/2+z,6,0.9,[0.7,0.4,1]])}
    for(let q=0;q<14;q++){const a=q/14*Math.PI*2;P(Math.cos(a)*(W/2-1.5)*0.5,ce-0.2-Math.abs(Math.sin(a*2))*0.6,Math.sin(a)*(D/2-1.5)*0.5,0.04,0.04,(D/2-1.5),'#d8d0e8')}for(let q=0;q<6;q++){const x=X(2+r()*(W-4)),z=Z(2+r()*4);P(x,ce-1.2,z,0.5,1.1,0.5,'#e8e2f0');P(x,ce-0.5,z,0.04,0.5,0.04,'#d8d0e8')}
    npc('starszy','Matrona Kapłanka',W/2,3.6,0);npc('straz','Strażniczka świątyni',W/2-3,D-4,Math.PI);npc('straz','Strażniczka świątyni',W/2+3,D-4,Math.PI)}
  else if(f==='mlyn'){// młyn od środka: kamienie młyńskie, przekładnia, worki mąki, skrzynie, spichlerz z ziarnem
    SOL(W/2-2,2,W/2+1,4);ringBoxes(P,0,Z(3),0,1.8,0,0.6,'#8a8a8e',0.5);ringBoxes(P,0,Z(3),0,1.7,0.6,0.9,'#9a9aa0',0.5);P(0,ce/2+0.5,Z(3),0.3,ce-1,0.3,WDD);for(let q=0;q<12;q++){const a=q/12*Math.PI*2;P(Math.cos(a)*0.8,ce-1,Z(3)+Math.sin(a)*0.8,0.25,0.25,0.25,WD)}P(0,0.95,Z(3),3.6,0.06,0.06,'#e8e2d0');
    for(let q=0;q<12;q++){SOL(1+(q%3),D-5+Math.floor(q/6),1+(q%3),D-5+Math.floor(q/6));P(X(1.5+(q%3)),0.3+Math.floor((q%6)/3)*0.55,Z(D-4.5+Math.floor(q/6)),0.7,0.55,0.6,'#e8dcc0')}
    SOL(W-4,1,W-2,3);P(X(W-2.5),0.6,Z(2),3,1.2,3,'#8a6a40');P(X(W-2.5),1.25,Z(2),2.8,0.1,2.8,'#d8b24a');for(let q=0;q<10;q++)P(X(W-4+r()*3),0.02,Z(1+r()*3),0.1,0.02,0.06,'#d8b24a');
    barrel(W-2,D-4);barrel(W-2,D-5);torch(X(1)+0.2,Z(5));npc('kupiec','Młynarz',W/2+2,5.6,Math.PI);npc('mieszk','Pomocnik młynarza',3,7,Math.PI*0.5);s.pets=['kot']}
  else if(f==='namiot'){// namiot wodza: tron z kości, palenisko pośrodku, skóry na ziemi, trofea, bębny
    SOL(W/2-1,D/2-1,W/2,D/2);P(0,0.15,0,1.8,0.3,1.8,'#4a4650');P(0,0.4,0,1,0.4,1,'!#ff8a2e');P(0,0.8,0,0.5,0.5,0.5,'!#ffd34d');s.lights.push([s.x0+W/2,s.fy+1,s.z0+D/2,9,1.3,[1,0.55,0.25]]);
    SOL(W/2-1,1,W/2,2);P(0,0.4,Z(2),1.8,0.8,1.4,'#5a3a22');P(0,1.5,Z(1.5),1.6,2.2,0.3,'#e8e2cc');for(let q=0;q<5;q++)P(-0.8+q*0.4,2.8+(q%2)*0.3,Z(1.5),0.2,0.6,0.2,'#e8e2cc');P(0,0.85,Z(2),1.4,0.1,1,'#8a2a1a');
    for(let q=0;q<6;q++){const a=q/6*Math.PI*2+0.5;P(Math.cos(a)*3.2,0.03,Math.sin(a)*3.2,1.8,0.04,1.2,['#8a6a48','#a8865a','#6a4a30'][q%3])}
    for(const [i,j] of [[2,D-4],[W-3,D-4]]){SOL(i,j,i,j);P(X(i+0.5),0.45,Z(j+0.5),0.8,0.9,0.8,'#6b4528');P(X(i+0.5),0.92,Z(j+0.5),0.84,0.06,0.84,'#e8dcc0')}
    for(let q=0;q<6;q++)P(X(1)+0.1,2+(q%2)*0.6,Z(3+q*1.5),0.12,0.5,0.6,'#e8e2cc'),P(X(W-1)-0.1,2+(q%2)*0.6,Z(3+q*1.5),0.12,0.5,0.6,'#e8e2cc');
    npc('starszy','Wódz',W/2,2.8,0);npc('najemnik',null,3,D-5,Math.PI*0.5);npc('najemnik',null,W-4,D-5,Math.PI*1.5);npc('mieszk','Szaman',W/2+3,5,Math.PI*1.2)}
}
