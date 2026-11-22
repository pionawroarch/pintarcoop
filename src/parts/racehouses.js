// ===== v112: nowe domy niziołków, drowów i saurian + dopracowanie elfów, krasnoludów i orków =====
function hasGen2(race){return race==='niziolki'||race==='drowy'||race==='saurianie'}
function raceGen(type,v,race){
  if(hasGen2(race))return raceGen2(type,v,race);
  const res=raceGen0(type,v,race);if(!res)return res;
  try{raceAdd(type,v,race,res)}catch(e){console.warn('raceAdd',e)}return res}
function rgCtx(type,v,race){const [,iL,iR,iB,iF,W0,D0]=HT[type],x0=iL,z0=iB,w=W0-iL-iR,d=D0-iB-iF;return{W0,D0,x0,z0,w,d,x1:x0+w,z1:z0+d,cx:x0+w/2,cz:z0+d/2,fl:Math.max(1,(RFL[type]||1)+HFL),r:rngOf('rg2'+type+v+race)}}
// pierścień z prostopadłościanów wzdłuż elipsy (ściany okrągłych domów, kopce)
function rgRing(P,cx,cz,rx,rz,y,h,t,cols,skip){const n=Math.max(12,Math.round(Math.PI*(rx+rz)/2.2));for(let i=0;i<n;i++){const a=i/n*Math.PI*2,x=cx+Math.cos(a)*rx,z=cz+Math.sin(a)*rz;if(skip&&skip(a,x,z))continue;P(x-t/2,y,z-t/2,t,h,t,cols[i%cols.length],'d')}}
function raceGen2(type,v,race){const C=rgCtx(type,v,race),{x0,z0,w,d,x1,z1,cx,cz,fl,r}=C,B=[],win=[],holes=[],P=(...b)=>B.push(b),big=fl>=2||type==='rez';
  if(race==='niziolki'){// nora w pagórku: kamienna fasada z okrągłymi drzwiami, trawiasty kopiec, okrągłe okna, kominy, ogródek
    const GR=['#5f9a40','#6aa848','#4f8a36','#78b450'],ST=['#8e8a80','#9a958a','#827e74'],DR=['#3f7a3a','#c8a030','#a8452f','#3a5a8a'][v%4],WD='#7a5532',WDd='#5a3c22',BR='#d9b23a';
    const Hw=12+(fl-1)*5,rx=w/2-1,rz=d/2-1;
    P(x0-3,0,z0-3,w+6,2,d+6,'#6a8a3a');for(let k=0;k<3;k++)P(cx-5+k,0,z1+2+k*1.4,10-2*k,1.4-k*0.4,1.4,ST[k%3]);
    const fz0=z1-1.6;P(cx-w*0.36,2,cz-d*0.36,w*0.72,Hw,fz0-1.2-(cz-d*0.36),'#e8dcc0','d');
    // kopiec: warstwy coraz mniejszych elips, trawa z kwiatami
    let yy=2+Hw-3;const nL=Math.round(5+fl*1.5);for(let i=0;i<nL;i++){const s=Math.cos(i/nL*Math.PI/2),Rx=(rx+2)*s,Rz=(rz+2)*s;if(Rx<2)break;P(cx-Rx*0.72,yy,cz-Rz*0.72,Rx*1.44,2.2,Rz*1.44,GR[i%4]);rgRing(P,cx,cz,Rx,Rz,yy,2.2,2.6,GR,null);yy+=2}
    const top=yy;for(let i=0;i<14;i++){const a=r()*Math.PI*2,rr=r()*0.8,x=cx+Math.cos(a)*rx*rr,z=cz+Math.sin(a)*rz*rr;P(x,top-1-rr*nL*1.4,z,0.8,0.8,0.8,pick2(r,['#f4f0e6','#e8c84a','#d84a6a','#b06ad8']))}
    // ściany boczne z kamienia pod kopcem
    rgRing(P,cx,cz,rx-0.6,rz-0.6,2,Hw-1,2.4,ST,(a)=>Math.sin(a)>0.6);
    // fasada: kamień polny, łuk drzwi okrągły
    const fz=z1-1.6;P(cx-w*0.38,2,fz,w*0.76,Hw+1,1.2,ST[0],'d');for(let i=0;i<10;i++)P(cx-w*0.36+r()*w*0.66,2.5+r()*(Hw-2),fz+1.1,1.6+r()*1.8,1+r()*1.2,0.3,ST[i%3]);
    const dw=8,dh=10;for(let k=0;k<4;k++)P(cx-dw/2-1-k*0.3,0,z1+0.2+k*1.3,dw+2+k*0.6,2-k*0.45,1.3,ST[k%3]);holes.push([cx-dw/2,2,fz-0.1,dw,dh,1.4]);
    P(cx-dw/2,2,fz-1.2,dw,dh-1,0.6,DR);for(let k=1;k<4;k++)P(cx-dw/2+k*0.7,2+dh-1+ (k-1)*0.5,fz-1.2,dw-k*1.4,0.6,0.6,DR);P(cx-0.5,6.5,fz-0.7,1,1,0.4,BR);
    for(let k=0;k<7;k++){const a=Math.PI*k/6,ax=cx+Math.cos(a)*(dw/2+0.8),ay=2+dh-4.4+Math.sin(a)*4.6;P(ax-0.8,ay,fz+1,1.6,1.6,0.8,WD)}P(cx-dw/2-1.4,2,fz+1,1.4,dh-3.6,0.8,WD);P(cx+dw/2,2,fz+1,1.4,dh-3.6,0.8,WD);
    for(const s of [-1,1]){const wx=cx+s*w*0.26;if(Math.abs(wx-cx)<dw/2+3)continue;win.push([wx-2,6,fz,4,4,1.2]);for(let k=0;k<8;k++){const a=k/8*Math.PI*2;P(wx+Math.cos(a)*2.6-0.6,8+Math.sin(a)*2.6-0.6,fz+1,1.2,1.2,0.6,WD)}P(wx-2.6,4.6,fz+1.1,5.2,1,1.4,WDd);for(let k=0;k<4;k++)P(wx-2.2+k*1.2,5.6,fz+1.4,0.9,0.9,0.9,pick2(r,['#d84a6a','#e8c84a','#f4f0e6','#b06ad8']))}
    if(fl>=2)for(const s of [-1,1]){const zx=s<0?x0+1:x1-2.2;win.push([zx,7,cz-1.5,1.2,3,3])}
    if(big){win.push([cx-1.5,2+Hw+3,cz+rz*0.55,3,3,1.2]);P(cx-2.2,2+Hw+1.5,cz+rz*0.55+0.6,4.4,5.5,1,WD)}
    for(const [chx,chz] of big?[[cx+w*0.22,cz-d*0.15],[cx-w*0.25,cz-d*0.05]]:[[cx+w*0.2,cz-d*0.1]]){P(chx-1.2,top-6,chz-1.2,2.4,9,2.4,ST[1]);P(chx-1.5,top+3,chz-1.5,3,0.8,3,ST[2])}
    // płotek, skrzynka na listy, beczka deszczówki, grządka
    for(let x=x0-2;x<x1+2;x+=2){if(Math.abs(x-cx)<6)continue;P(x,2,z1+3.4,0.5,2.4,0.5,WD);}P(x0-2,3.6,z1+3.5,cx-6-x0+2,0.4,0.3,WD);P(cx+6,3.6,z1+3.5,x1+2-cx-6,0.4,0.3,WD);
    P(cx+dw/2+3,2,z1+1.6,0.5,4,0.5,WD);P(cx+dw/2+2.4,6,z1+1.2,1.8,1.4,1.4,'#c8302a');P(cx-dw/2-5,2,z1+0.6,2.4,3.2,2.4,WDd);P(cx-dw/2-4.9,5.2,z1+0.7,2.2,0.2,2.2,'#4a7aa0');
    for(let k=0;k<6;k++)P(x0+1+k*1.4,2,z1+1,1,1.2+r(),1,k%2?'#7aba50':'#d8a43a');
    return{B,win,holes}}
  if(race==='drowy'){// gotyckie domy z obsydianu: żebra, ostre łuki, smukłe okna, kryształy, iglice z grzybowymi latarniami
    const S=['#2e2a38','#363042','#28242f','#3e3750'],SL='#4a4260',CR=['#b06aff','#d08aff','#8a4ad8'],GLW='#7af0e0',PU='#5a2a7a',fh=17,H=fl*fh;
    P(x0-3,0,z0-3,w+6,2,d+6,S[2]);P(x0-2,2,z0-2,w+4,0.8,d+4,SL);for(let k=0;k<3;k++)P(cx-5+k,0,z1+3+k*1.3,10-2*k,2-k*0.6,1.3,S[k%3]);
    P(x0+1,2.8,z0+1,w-2,H,d-2,S[0],'d');
    for(let x=x0+1;x<=x1-2;x+=4){P(x,2.8,z1-0.6,1.2,H+2,1.2,S[3]);P(x,2.8,z0+0.4,1.2,H+2,1.2,S[3]);P(x+0.2,2.8+H+2,z1-0.4,0.8,2.4,0.8,SL)}
    for(let z=z0+1;z<=z1-2;z+=4){P(x0+0.4,2.8,z,1.2,H+2,1.2,S[3]);P(x1-1.6,2.8,z,1.2,H+2,1.2,S[3])}
    for(let f=0;f<fl;f++){const y=2.8+f*fh;P(x0+0.6,y+fh-1.2,z0+0.6,w-1.2,0.8,d-1.2,SL);
      for(let x=x0+3;x<x1-3;x+=4){if(f===0&&Math.abs(x+1-cx)<6)continue;win.push([x,y+4,z1-1.3,2,9,1]);P(x-0.4,y+13,z1-0.7,2.8,0.8,0.5,PU);P(x+0.4,y+13.8,z1-0.7,1.2,1,0.5,PU)}
      for(const s of [-1,1]){const zx=s<0?x0+0.6:x1-1.6;win.push([zx,y+4,cz-1,1,9,2])}}
    const dw=6,dh=12;holes.push([cx-dw/2,2.8,z1-1.4,dw,dh,1.4]);P(cx-dw/2,2.8,z1-2.2,dw,dh,0.6,'#1e1a24');for(let k=0;k<4;k++){P(cx-dw/2-1.2+k*0.5,2.8+dh+k*1.1,z1-0.6,1.2,1.2,1.2,S[3]);P(cx+dw/2-k*0.5,2.8+dh+k*1.1,z1-0.6,1.2,1.2,1.2,S[3])}P(cx-0.6,2.8+dh+4.4,z1-0.6,1.2,1.6,1.2,CR[0]);
    P(cx-dw/2-1.2,2.8,z1-0.6,1.2,dh,1.2,S[3]);P(cx+dw/2,2.8,z1-0.6,1.2,dh,1.2,S[3]);
    // stromy dach schodkowy z kolcami
    const RT=2.8+H+0.8;let yy=RT,i=0;for(;i<12;i++){const ins=i*Math.min(w,d)*0.045-1.5;if(w-2*ins<3||d-2*ins<3)break;P(x0+ins,yy,z0+ins,w-2*ins,1.6,d-2*ins,i%2?S[1]:SL);yy+=1.6}
    for(const [ax,az] of [[x0-1,z0-1],[x1-0.6,z0-1],[x0-1,z1-0.6],[x1-0.6,z1-0.6]]){P(ax-0.2,RT,az-0.2,2,4,2,S[3]);P(ax+0.2,RT+4,az+0.2,1.2,3,1.2,S[3]);P(ax+0.5,RT+7,az+0.5,0.6,2.5,0.6,CR[1])}
    P(cx-0.8,yy,cz-0.8,1.6,6,1.6,S[3]);P(cx-0.4,yy+6,cz-0.4,0.8,3,0.8,CR[0]);
    if(big){const tx=x0+4,tz=z0+4,TH=H+16;for(let y=2.8,k=0;y<TH;y+=3,k++)P(tx-3,y,tz-3,6,3,6,S[k%4]);for(let y=10;y<TH-4;y+=8)win.push([tx-0.8,y,tz+2.8,1.6,5,0.4]);let ty=TH;for(let k=0;k<6;k++){P(tx-2.8+k*0.45,ty,tz-2.8+k*0.45,5.6-k*0.9,1.6,5.6-k*0.9,k%2?SL:S[1]);ty+=1.6}P(tx-0.5,ty,tz-0.5,1,3,1,CR[2])}
    // kryształy przy ścianach, latarnie grzybowe przy wejściu
    for(let k=0;k<6;k++){const s=k%2?1:-1,x=s<0?x0-1.5:x1+0.3,z=z0+2+r()*(d-4),hh=2+r()*4;P(x,2,z,1.2,hh,1.2,CR[k%3]);P(x+0.3,2+hh,z+0.3,0.6,1.4,0.6,CR[(k+1)%3])}
    for(const s of [-1,1]){const lx=cx+s*(dw/2+4);P(lx-0.3,2,z1+2.2,0.6,6,0.6,'#3a3046');P(lx-1.8,8,z1+0.7,3.6,1.2,3.6,PU);P(lx-0.9,7,z1+1.6,1.8,1,1.8,GLW);win.push([lx-0.9,7,z1+1.6,1.8,1,1.8])}
    for(let k=0;k<5;k++){const x=x0+r()*w,y=2.8+r()*H;P(x,y,z1+0.1,0.15,3+r()*4,0.1,'#d8d0e8')}
    return{B,win,holes}}
  if(race==='saurianie'){// domy na schodkowych podestach: piaskowiec z nefrytowym fryzem, daszek z liści palmowych, totemy
    const SA=['#c8b080','#bca474','#d4bc8c','#b09868'],SD='#9a8258',JD=['#3aa88a','#2a8a70','#5ac0a0'],GD='#d9b23a',RD='#b8402a',LV=['#8aa040','#a0b450','#6e8a30','#b8c060'],WD='#6a4a2a',fh=16,H=fl*fh;
    for(let t=0;t<3;t++){const ins=t*1.6-3;P(x0+ins,t*1.4,z0+ins,w-2*ins,1.4,d-2*ins,t%2?SD:SA[t])}
    for(let k=0;k<4;k++)P(cx-4,k*1.05,z1+3-k*1.2+1.2,8,1.05,1.4,SA[k%4]);for(const s of [-1,1])P(cx+s*4.6-0.6,0,z1+1,1.2,4.2,4,SD);
    const y0=4.2;P(x0+1.2,y0,z0+1.2,w-2.4,H,d-2.4,SA[0],'d');for(let y=y0+2;y<y0+H;y+=2.2)P(x0+1.1,y,z0+1.1,w-2.2,0.3,d-2.2,SA[3]);
    for(let f=0;f<fl;f++){const y=y0+f*fh;P(x0+0.9,y+fh-3.2,z0+0.9,w-1.8,2,d-1.8,JD[1]);for(let x=x0+2;x<x1-2;x+=2.4){P(x,y+fh-2.8,z1-1,1.2,1.2,0.3,f%2?GD:JD[2]);P(x,y+fh-2.8,z0+0.8,1.2,1.2,0.3,GD)}
      for(const s of [-1,1]){const wx=cx+s*w*0.3;if(f===0&&Math.abs(wx-cx)<6)continue;win.push([wx-2,y+6,z1-1.3,4,4,1]);P(wx-2.6,y+10,z1-0.9,5.2,0.8,0.5,WD);P(wx-2.6,y+5.4,z1-0.9,5.2,0.6,0.5,WD)}
      for(const s of [-1,1]){const zx=s<0?x0+1:x1-2;win.push([zx,y+6,cz-2,1,4,4])}}
    const dw=7,dh=11;holes.push([cx-dw/2,y0,z1-1.4,dw,dh,1.4]);P(cx-dw/2,y0,z1-2.2,dw,dh,0.6,WD);P(cx-dw/2-1.4,y0,z1-1.2,1.4,dh+1.4,1.4,JD[0]);P(cx+dw/2,y0,z1-1.2,1.4,dh+1.4,1.4,JD[0]);P(cx-dw/2-1.4,y0+dh,z1-1.2,dw+2.8,1.4,1.4,JD[0]);
    P(cx-1.6,y0+dh+1.4,z1-1,3.2,2.4,0.6,GD);P(cx-0.9,y0+dh+2.2,z1-0.5,0.6,0.6,0.2,RD);P(cx+0.3,y0+dh+2.2,z1-0.5,0.6,0.6,0.2,RD);
    // daszek z liści na słupach (czterospadowy, wysunięty)
    const RT=y0+H;for(const [ax,az] of [[x0-1,z1+0.5],[x1-0.2,z1+0.5],[x0-1,z0-1.4],[x1-0.2,z0-1.4]])P(ax,y0,az,1.2,H,1.2,WD);
    let yy=RT;for(let i=0;i<7;i++){const ins=i*Math.min(w,d)*0.07-3;if(w-2*ins<3||d-2*ins<3)break;P(x0+ins,yy,z0+ins,w-2*ins,1.5,d-2*ins,LV[i%4]);for(let x=x0+ins;x<x1-ins;x+=1.6){P(x,yy-0.6,z0+ins-0.4,1.2,0.8,0.6,LV[(i+1)%4]);P(x,yy-0.6,z1-ins-0.2,1.2,0.8,0.6,LV[(i+2)%4])}yy+=1.4}
    P(cx-1,yy,cz-1,2,1.6,2,GD);P(cx-0.4,yy+1.6,cz-0.4,0.8,2,0.8,RD);
    if(big){const sx=x0+4,sz=z0+4;let ty=y0;for(let k=0;k<5;k++){const s=4-k*0.7;P(sx-s,ty,sz-s,2*s,3.5,2*s,k%2?SD:SA[k%4]);ty+=3.5}ty+=RT-y0-12>0?0:0;P(sx-1.2,ty,sz-1.2,2.4,2,2.4,JD[2]);P(sx-1.6,ty+2,sz-1.6,3.2,0.8,3.2,GD)}
    // totem z piórami i misy z ogniem
    const tx=cx+(v%2?-1:1)*(w/2+1.8),tz=z1+2;for(let k=0;k<4;k++)P(tx-0.9,4.2+k*2,tz-0.9,1.8,2,1.8,[RD,JD[0],GD,'#3a6a8a'][k]);P(tx-0.4,12.2,tz-0.4,0.8,0.8,0.8,GD);for(const [c,o] of [[RD,-1.4],[JD[2],0],[GD,1.4]])P(tx+o-0.3,12.6,tz-0.2,0.6,2.6,0.3,c);
    for(const s of [-1,1]){const bx=cx+s*5.4;P(bx-0.9,4.2,z1+0.6,1.8,1.4,1.8,SD);P(bx-0.6,5.6,z1+0.9,1.2,0.8,1.2,'#ff8a2e');win.push([bx-0.6,5.6,z1+0.9,1.2,0.8,1.2])}
    for(let k=0;k<8;k++){const x=x0+r()*w;P(x,y0+r()*H*0.6,z1-0.6,0.5,2+r()*3,0.3,'#4a8a3a')}
    return{B,win,holes}}
  return null}
function pick2(r,a){return a[Math.floor(r()*a.length)]}
// dodatki do istniejących domów: elfy, krasnoludy, orkowie
function raceAdd(type,v,race,res){const C=rgCtx(type,v,race),{x0,z0,w,d,x1,z1,cx,cz,fl,r}=C,B=res.B,P=(...b)=>B.push(b),win=res.win;
  if(race==='elfy'){const fh=19,H=fl*fh,GL='#a8f0ff',TR='#6a5032',GD='#c8a85a',LF=['#3f8a4a','#5aa858','#8ccc72'];
    // łukowy daszek nad drzwiami w kształcie liścia, latarnie, pnącza z kwiatami, balkon z donicami
    for(let k=0;k<7;k++){const a=Math.PI*k/6;P(cx+Math.cos(a)*6.5-0.8,15+Math.sin(a)*4.5,z1+0.6,1.6,1.6,1.2,k%2?GD:TR)}P(cx-0.8,20,z1+0.6,1.6,2.4,1.2,LF[2]);
    for(const s of [-1,1]){const lx=cx+s*7.5;P(lx-0.25,10,z1+1.2,0.5,4,0.5,TR);P(lx-0.9,8.2,z1+0.9,1.8,1.8,1.8,GL);win.push([lx-0.9,8.2,z1+0.9,1.8,1.8,1.8]);P(lx-1.1,10,z1+0.7,2.2,0.5,2.2,GD)}
    for(let k=0;k<10;k++){const x=x0+1+r()*(w-2),y=3+r()*H*0.8;P(x,y,z1+0.2,0.7,0.7,0.5,pick2(r,['#f0a8c8','#f4f0e6','#c8a8f0','#f4d060']))}
    if(fl>=2){const by=2+fh;for(let x=x0+3;x<x1-3;x+=3)P(x,by+0.5,z1+1.2,2.2,1.2,1.4,TR),P(x+0.3,by+1.7,z1+1.4,1.6,1,1,LF[k2(x)%3])}
    // wysoki łukowy szczyt dachu z pędem
    const ry=2+H+2+ (fl>=2?5.4:6.75);P(cx-1.2,ry,cz-1.2,2.4,3,2.4,LF[0]);P(cx-0.6,ry+3,cz-0.6,1.2,3,1.2,LF[1]);P(cx-0.3,ry+6,cz-0.3,0.6,2,0.6,GL)}
  else if(race==='krasnoludy'){const fh=Math.round((RFL[type]||1)>=2?18:18),S=['#76716e','#6a6670','#827c78','#5f5b63'],SL=['#4f5a6a','#5a6678','#465060'],GD='#d9b23a',RD='#8a2a22',FI='#ff8a2e',big=fl>=2||type==='rez';
    const H=B.length?Math.max(...B.filter(b=>b[7]==='d').map(b=>b[1]+b[4]))-4:fl*fh;
    if(!big&&v!==2){// stromy łupkowy dach czterospadowy w miejsce płaskiego
      const y0=6.5+H+2.2;let yy=y0;for(let i=0;i<9;i++){const ins=i*Math.min(w,d)*0.06-1.6;if(w-2*ins<3||d-2*ins<3)break;P(x0+ins,yy,z0+ins,w-2*ins,1.6,d-2*ins,SL[i%3]);yy+=1.6}P(cx-w*0.25,yy,cz-0.6,w*0.5,1,1.2,GD)}
    // runiczny fryz, chorągwie klanowe, latarnie, kowadło przed domem
    for(let x=x0+1;x<x1-1;x+=2.2)P(x,4+H*0.35,z1+0.45,1.2,1.2,0.25,(Math.round(x)%3)?'#9a96a0':GD);
    for(const s of [-1,1]){const bx=s<0?x0+2:x1-3.4;P(bx,4+H*0.4,z1+0.7,1.4,H*0.45,0.2,RD);P(bx+0.2,4+H*0.55,z1+0.92,1,1,0.1,GD)}
    for(const s of [-1,1]){const lx=cx+s*6;P(lx-0.4,4+13,z1+0.5,0.8,0.8,1.6,'#2a2830');P(lx-0.6,4+11.4,z1+1.5,1.2,1.4,1.2,FI);win.push([lx-0.6,4+11.4,z1+1.5,1.2,1.4,1.2])}
    P(x0+3,4,z1+4,3,1.6,1.6,'#3a3840');P(x0+2.4,5.6,z1+4,4.2,1,1.6,'#4a4850');P(x0+6.8,4,z1+4,2,2.4,2,'#6a4628')}
  else if(race==='orkowie'){const LG='#4a2f1d',BN='#e8e0c8',RD='#a8302a',fh=0;
    // palisada z zaostrzonych pali wokół (z przerwą przy wejściu), czaszki, kły na dachu, czerwone malunki
    const rx=w/2+5,rz=d/2+5;rgRing(P,cx,cz,rx,rz,1.5,5,1.1,[LG,'#5a3a22','#3a2414'],(a,x,z)=>Math.sin(a)>0.82||x<-1||x>C.W0+1||z<-1||z>C.D0+1);
    const n=Math.max(12,Math.round(Math.PI*(rx+rz)/2.2));for(let i=0;i<n;i+=3){const a=i/n*Math.PI*2;if(Math.sin(a)>0.82)continue;const x=cx+Math.cos(a)*rx,z=cz+Math.sin(a)*rz;if(x<-1||x>C.W0+1||z<-1||z>C.D0+1)continue;P(x-0.3,6.5,z-0.3,0.6,1.4,0.6,LG);if(i%6===0)P(x-0.6,7.9,z-0.6,1.2,1.2,1.2,BN)}
    for(let k=0;k<6;k++){const x=x0+3+r()*(w-6);P(x,3+r()*6,z1-2.2,0.6,2.6,0.2,RD)}
    const ry=B.reduce((m,b)=>b[6]==='#e8e0c8'?m:Math.max(m,b[1]+b[4]),0);for(const s of [-1,1]){P(cx+s*3-0.6,ry-6,cz-0.6,1.2,3,1.2,BN);P(cx+s*3.6-0.5,ry-3,cz-0.5,1,2,1,BN);P(cx+s*4.4-0.4,ry-1.4,cz-0.4,0.8,1.4,0.8,BN)}}}
function k2(x){return Math.abs(Math.round(x*3))}

// v114: własne wnętrza niziołków, drowów i saurian (pokój ~12×10 m, środek w 0,0; tylna ściana z=-5)
function raceInterior2(L,race){
  const M={niziolki:{'#ece2c6':'#efe0bc','#8a6240':'#a8784a','#7e5838':'#9a6c40','#4a2f1d':'#6a4428','#5a3a22':'#3f7a3a','#7a5030':'#c8a060'},
    drowy:{'#ece2c6':'#3a3446','#8a6240':'#2e2a38','#7e5838':'#28242f','#4a2f1d':'#1e1a24','#5a3a22':'#5a2a7a','#7a5030':'#4a4260'},
    saurianie:{'#ece2c6':'#d4bc8c','#8a6240':'#bca474','#7e5838':'#b09868','#4a2f1d':'#6a4a2a','#5a3a22':'#2a8a70','#7a5030':'#c8b080'}}[race];
  for(const b of L)if(M[b[6]])b[6]=M[b[6]];const P=(...b)=>L.push(b);
  if(race==='niziolki'){// okrągłe belki stropu, spiżarnia ze słojami, kominek z kociołkiem, okrągły dywan, fotel, zegar, półki z książkami, wiszące zioła
    for(const x of [-4,0,4])P(x,3.1,0,0.3,0.3,10,'#6a4428');P(0,0.02,1,3.2,0.04,3.2,'#c8402a');P(0,0.03,1,2.4,0.04,2.4,'#e8c040');P(0,0.04,1,1.2,0.04,1.2,'#3f7a3a');
    P(-4.8,1.1,-4.6,2.2,2.2,0.6,'#8a8680');P(-4.8,0.5,-4.3,1.2,0.9,0.2,'#2a1a10');P(-4.8,0.5,-4.25,0.8,0.5,0.1,'#ff8a2e');P(-4.8,0.55,-4.1,0.5,0.5,0.5,'#2a2a2e');P(-4.8,2.4,-4.6,2.6,0.2,0.8,'#6a4428');
    for(const y of [0.6,1.2,1.8])P(4.6,y,-4.6,2.4,0.08,0.5,'#8a5a32');for(let k=0;k<6;k++)for(const y of [0.72,1.32,1.92])P(3.6+k*0.4,y+0.04,-4.55,0.22,0.22,0.22,['#d8a43a','#c8402a','#7aba50','#e8e0c8'][(k+y*10|0)%4]);
    P(2.2,0.45,-0.6,0.9,0.9,0.9,'#3f7a3a');P(2.2,1.1,-1.0,0.9,0.8,0.15,'#3f7a3a');P(-2,1.2,-4.8,0.5,2.4,0.3,'#6a4428');P(-2,2,-4.62,0.36,0.36,0.04,'#f4f0e6');
    for(let k=0;k<5;k++)P(-1+k*0.5,2.7,-2,0.12,0.5,0.12,['#5a8a3a','#a87a3a','#7a9a4a'][k%3]);P(0,2.3,-4.95,1.4,1.4,0.1,'#a8d8f0');P(0,2.3,-4.98,1.6,1.6,0.06,'#6a4428')}
  if(race==='drowy'){// fioletowe kryształy, świecące grzyby, zasłony z pajęczego jedwabiu, ołtarzyk pajęczycy, kamienne łoże z baldachimem
    for(const [x,z,h] of [[-5,-4.4,1.6],[5,-4.4,2],[-5,3.6,1.2],[5,3.4,1.4]]){P(x,h/2,z,0.4,h,0.4,'#b06aff');P(x+0.3,h*0.35,z,0.25,h*0.6,0.25,'#d08aff')}
    for(const [x,z] of [[-3.5,-4.2],[3,-4.3],[-4.6,0],[4.6,1]]){P(x,0.3,z,0.12,0.6,0.12,'#d8d0e8');P(x,0.65,z,0.5,0.14,0.5,'#7af0e0')}
    for(const x of [-2.5,2.5]){P(x,1.6,-4.9,1.6,3,0.04,'#e0dce8');P(x,1.6,-4.85,0.04,3,0.02,'#c8c0d8')}P(0,0.6,-4.4,1.4,1.2,0.6,'#2e2a38');P(0,1.4,-4.4,0.6,0.4,0.4,'#1a1820');for(const sx of [-1,1])P(sx*0.4,1.4,-4.4,0.5,0.06,0.06,'#1a1820');P(0,1.7,-4.4,0.16,0.16,0.16,'#b06aff');
    P(3.6,0.35,-2.6,2.2,0.7,3.2,'#28242f');P(3.6,0.75,-2.6,2,0.15,3,'#5a2a7a');for(const [a,b] of [[-1,-1.5],[1,-1.5],[-1,1.5],[1,1.5]])P(3.6+a,1.4,-2.6+b,0.12,2.8,0.12,'#1e1a24');P(3.6,2.8,-2.6,2.2,0.1,3.2,'#3a1a4a')}
  if(race==='saurianie'){// plecione maty, misa z ogniem, totem z piórami, nefrytowe naczynia, hamak, malowidła ścienne
    P(0,0.02,0.5,4,0.04,3,'#c8a050');for(let k=-3;k<=3;k++)P(k*0.5,0.03,0.5,0.12,0.04,3,'#8a6a30');P(0,0.35,0.5,0.9,0.5,0.9,'#9a8258');P(0,0.65,0.5,0.6,0.2,0.6,'#ff8a2e');
    P(-4.8,1.2,-4.5,0.6,2.4,0.6,'#6a4a2a');for(const [y,c] of [[0.6,'#b8402a'],[1.2,'#3aa88a'],[1.8,'#d9b23a']])P(-4.8,y,-4.5,0.7,0.5,0.7,c);for(const [x,c] of [[-0.25,'#b8402a'],[0,'#3aa88a'],[0.25,'#d9b23a']])P(-4.8+x,2.7,-4.5,0.12,0.7,0.06,c);
    for(let k=0;k<4;k++)P(3+k*0.6,0.3,-4.5,0.4,0.6,0.4,k%2?'#3aa88a':'#2a8a70');P(3.9,1.6,-1,0.06,0.06,3,'#6a4a2a');P(3.9,1.3,-1,0.6,0.08,2.6,'#c8a050');
    for(let k=0;k<6;k++)P(-3+k*1.2,2,-4.96,0.8,0.8,0.04,['#b8402a','#3aa88a','#d9b23a'][k%3]);P(0,2.8,-4.96,8,0.2,0.05,'#2a8a70')}}
