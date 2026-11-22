// ===== v104: nowe struktury świata (geometria: B(x,yDół,z,w,h,d,kolor), wysokości bezwzględne) =====
Object.assign(STRN,{wiezaczar:'Wieża czarnoksiężnika',piraci:'Piracka zatoka',gryf:'Gniazdo gryfa',widmo:'Miasto-widmo',klasztor:'Górski klasztor',cyrk:'Wędrowny cyrk',most:'Most-twierdza',zatopiona:'Zatopiona świątynia',smok:'Szkielet smoka',farma:'Farma na odludziu',portal:'Starożytny portal',latarnik:'Latarnia na skałach'});
Object.assign(STRC,{wiezaczar:'#b060ff',piraci:'#e5483b',gryf:'#d9b23a',widmo:'#9ab8c8',klasztor:'#7dd87d',cyrk:'#7dd87d',most:'#c8a870',zatopiona:'#3fb5c8',smok:'#e8e0c8',farma:'#7dd87d',portal:'#5ac8ff',latarnik:'#7dd87d'});
for(const k of ['klasztor','cyrk','farma','latarnik'])FRIENDLY.add(k);
const STRUCT2={
  wiezaczar(s,r,H){const {B,G,col,STN,SDK,WD,WDD,IR}=H,gy=s.h,DK=['#2e2a36','#3a3444','#24202c'],VI='#a050ff';
    // kamienna platforma z runami, skręcona wieża z nawisami, latająca kula, kolce i klatki z kośćmi
    for(let k=0;k<3;k++)B(0,gy-1+k*0.4,0,12-k*2,1+(k?0:0.4),12-k*2,DK[k%3]);for(let q=0;q<12;q++){const a=q/12*6.283;B(Math.cos(a)*5.3,gy+0.02,Math.sin(a)*5.3,0.6,0.06,0.6,'!#b870ff')}
    for(let y=0,k=0;y<20;y+=1.2,k++){const w=5.2-k*0.12,o=Math.sin(k*0.5)*0.4;B(o,gy+0.6+y,Math.cos(k*0.5)*0.4,w,1.2,w,DK[k%3]);if(k%3===1)for(const [fx,fz] of [[1,0],[-1,0],[0,1],[0,-1]])B(o+fx*(w/2+0.02),gy+0.6+y+0.2,Math.cos(k*0.5)*0.4+fz*(w/2+0.02),fx?0.1:0.7,0.9,fz?0.1:0.7,k%2?'!#c890ff':'#120e16')}
    for(let k=0;k<4;k++){const a=k/4*6.283+0.4;B(Math.cos(a)*3,gy+8+k*3,Math.sin(a)*3,2.2,0.4,2.2,DK[1]);B(Math.cos(a)*3.8,gy+6.4+k*3,Math.sin(a)*3.8,0.3,1.8,0.3,DK[0])}
    B(0,gy+20.6,0,6,0.5,6,DK[2]);for(let q=0;q<8;q++){const a=q/8*6.283;B(Math.cos(a)*2.8,gy+21.1,Math.sin(a)*2.8,0.4,1.6-(q%2)*0.6,0.4,DK[0])}for(let k=0;k<6;k++)B(0,gy+21.1+k*0.8,0,3-k*0.5,0.8,3-k*0.5,k%2?'#4a2e6a':DK[1]);
    for(const [y,w] of [[gy+28,0.6],[gy+28.6,1.2],[gy+29.4,1.4],[gy+30.2,1.2],[gy+30.8,0.6]])B(0,y,0,w,0.7,w,'!#d8a8ff');
    B(0,gy+0.6,2.62,1.6,2.6,0.1,'#0c0a10');B(0,gy+3.3,2.65,2.2,0.4,0.2,DK[0]);for(const sx of [-1.2,1.2])B(sx,gy+0.6,2.8,0.4,3,0.4,DK[2]),B(sx,gy+3.6,2.8,0.5,0.5,0.5,'!#b870ff');
    for(const [x,z] of [[-4.6,-4.6],[4.6,-4.6],[-4.6,4.6],[4.6,4.6]]){B(x,gy,z,0.5,4,0.5,DK[0]);B(x,gy+4,z,0.2,1.2,0.2,'#d8d0e0')}
    for(const [x,z] of [[-3.6,3.8],[3.8,3.2]]){B(x,gy+2.6,z,0.06,1.6,0.06,IR);for(let q=0;q<4;q++)B(x+(q%2?0.4:-0.4),gy+1.2,z+(q>1?0.4:-0.4),0.06,1.4,0.06,IR);B(x,gy+0.6,z,0.9,0.1,0.9,IR);B(x,gy+1.9,z,0.9,0.1,0.9,IR);B(x,gy+0.75,z,0.3,0.25,0.3,BN_(H))}
    col(0,0,2.7,2.7,gy+21);col(0,0,6,6,gy+0.5);return [2,3.4]},
  piraci(s,r,H){const {B,G,col,STN,WD,WDD,IR,crate,barrel}=H,gy=G(0,0);
    // przystań: pomost w stronę wody, statek piracki na kotwicy, namioty z żagli, ognisko, skrzynia ze skarbem
    let wx=0,wz=0;for(let k=0;k<16;k++){const a=k/16*6.283;if(G(Math.cos(a)*11,Math.sin(a)*11)<WATER){wx+=Math.cos(a);wz+=Math.sin(a)}}const wl=Math.hypot(wx,wz)||1;wx/=wl;wz/=wl;const ax=Math.abs(wx)>Math.abs(wz);
    for(let k=0;k<12;k++){const d=4+k*1.2,x=wx*d,z=wz*d;B(x,WATER+0.9,z,ax?1.3:3,0.2,ax?3:1.3,WD[k%3]);if(k%3===0)for(const s2 of [-1.4,1.4])B(x+(ax?0:s2),Math.min(G(x,z),WATER)-2,z+(ax?s2:0),0.3,WATER+3-Math.min(G(x,z),WATER),0.3,WDD)}
    {const sx=wx*21,sz=wz*21,L=12;const pt=(u,v)=>ax?[sx+v,sz+u]:[sx+u,sz+v];for(let i=0;i<L;i++){const u=-L/2+i+0.5,w=2.8*Math.sqrt(1-Math.pow(u/(L/2+0.6),2))+0.6,[x,z]=pt(u,0);B(x,WATER-1.2,z,ax?w*2:1,1.6,ax?1:w*2,'#3a2414');B(x,WATER+0.4,z,ax?w*2+0.2:1,0.7,ax?1:w*2+0.2,'#5a3a22');B(x,WATER+1.1,z,ax?w*2-0.4:1,0.12,ax?1:w*2-0.4,'#8a6240')}
      const [mx,mz]=pt(0,0),[m2x,m2z]=pt(-3.5,0);for(const [x,z,hh] of [[mx,mz,10],[m2x,m2z,7.5]]){B(x,WATER+1.2,z,0.35,hh,0.35,WDD);B(x,WATER+hh-1.5,z,ax?0.2:4.4,0.2,ax?4.4:0.2,WDD);B(x,WATER+3.4,z,ax?0.12:4,hh-5.4,ax?4:0.12,'#e8e0c8');B(x,WATER+hh+0.6,z,ax?0.05:0.9,0.6,ax?0.9:0.05,'#141414');B(x,WATER+hh+0.75,z,ax?0.06:0.3,0.25,ax?0.3:0.06,BN_(H))}
      const [rx,rz]=pt(5.4,0);B(rx,WATER+1.2,rz,ax?3.6:1.6,1.6,ax?1.6:3.6,'#5a3a22');const [qx,qz]=pt(6.8,0);B(qx,WATER+2,qz,ax?0.3:1,0.3,ax?1:0.3,WDD);for(let q=-2;q<=2;q++){const [cx,cz]=pt(q*1.8,0);B(cx+(ax?0:3.1),WATER+0.8,cz+(ax?3.1:0),0.3,0.3,0.3,'#1a1a1e')}}
    for(const [x,z,c] of [[-4,-3,'#a8352a'],[3.5,-4,'#e8e0c8'],[-5,3,'#3a5a8a']]){if(Math.hypot(x-wx*6,z-wz*6)<4)continue;const g=G(x,z);for(let k=0;k<4;k++)B(x,g+k*0.6,z,3.2-k*0.8,0.6,3-k*0.7,k%2?c:'#d8c8a8');B(x,g+2.4,z,0.12,0.8,0.12,WDD)}
    B(0,gy,0,1.4,0.3,1.4,'#4a4650');B(0,gy+0.3,0,0.8,0.5,0.8,'!#ff8a2e');B(0,gy+0.7,0,0.4,0.4,0.4,'!#ffd34d');for(const sx of [-1,1])B(sx*1.1,gy,0,0.15,1.6,0.15,WDD);B(0,gy+1.5,0,2.4,0.12,0.12,WDD);B(0,gy+1.1,0,0.6,0.5,0.6,'#2a2a30');
    for(let k=0;k<5;k++)barrel(-2+k*0.8,G(-2+k*0.8,2.4),2.4);crate(2.4,G(2.4,2.2),2.2,1);crate(3.2,G(3.2,2.6),2.6,0.8);B(-6,G(-6,-0.5),-0.5,0.2,4,0.2,WDD);B(-6,G(-6,-0.5)+3.4,-0.15,1.4,1,0.05,'#141414');B(-6,G(-6,-0.5)+3.5,-0.12,0.5,0.4,0.05,BN_(H));
    col(0,0,0.7,0.7,gy+0.5);return [1.6,-1.6]},
  gryf(s,r,H){const {B,G,col,STN,WD,WDD,rock}=H,gy=G(0,0),ST2=['#7a7470','#8a847c','#6a645e'];
    // skalna iglica z płaskim szczytem, wielkie gniazdo z gałęzi, jaja, pióra, kości ofiar
    for(let k=0;k<9;k++){const a=k/9*6.283;rock(Math.cos(a)*4.6,Math.sin(a)*4.6,G(Math.cos(a)*4.6,Math.sin(a)*4.6)-1,3,5+r()*3,3,ST2)}for(let y=0,k=0;y<9;y+=1,k++)B(0,gy+y,0,6.4-k*0.25,1,6.2-k*0.2,ST2[k%3]);const top=gy+9;
    for(let k=0;k<26;k++){const a=k/26*6.283,rr=3.2+(k%3)*0.3;B(Math.cos(a)*rr,top+(k%3)*0.25,Math.sin(a)*rr,1.6,0.35,0.35,WD[k%3]);B(Math.cos(a+0.2)*rr,top+0.5+(k%2)*0.25,Math.sin(a+0.2)*rr,0.35,0.35,1.6,WD[(k+1)%3])}
    B(0,top-0.1,0,5,0.4,5,'#8a6a40');B(0,top+0.2,0,3.6,0.2,3.6,'#c8a868');for(const [x,z] of [[-0.6,0.3],[0.5,-0.4],[0.2,0.8]]){B(x,top+0.3,z,0.7,0.9,0.6,'#efe6d0');B(x+0.15,top+0.75,z,0.2,0.2,0.62,'#c8a050')}
    for(let k=0;k<8;k++){const a=r()*6.28,rr=1+r()*2.4;B(Math.cos(a)*rr,top+0.3,Math.sin(a)*rr,0.08,0.05,0.7,['#d9b23a','#8a5a2a','#efe6d0'][k%3])}for(let k=0;k<6;k++){const x=(r()-0.5)*14,z=(r()-0.5)*14;if(Math.hypot(x,z)<6)continue;B(x,G(x,z),z,0.9,0.18,0.25,BN_(H));B(x+0.3,G(x,z),z+0.3,0.25,0.18,0.7,BN_(H))}
    for(let k=0;k<12;k++){const a=k/12*6.283;B(Math.cos(a)*3.2,gy+k*0.75,Math.sin(a)*3.2,1,0.3,1,ST2[0])}
    col(0,0,3,3,top);return [0.6,-0.8]},
  widmo(s,r,H){const {B,G,col,STN,WD,WDD,MOSS,deadTree,gable}=H,gy=s.h,RS=['#7a7680','#6a6670','#8a8690'],RT=['#3a3030','#4a3a32'];
    // zrujnowane domy przy błotnistej uliczce, studnia, przewrócony wóz, cmentarzyk, upiorna mgła (sprite) i świeczki
    for(let z=-11;z<=11;z+=0.8)B(0,gy-0.05,z,3.2,0.1,0.8,(z*5|0)%2?'#5a4a3a':'#4a3e30');
    const house=(x,z,w,d,hgt,rot)=>{const g=gy;for(const [dx,dz,ww,dd] of [[0,-d/2,w,0.5],[0,d/2,w,0.5],[-w/2,0,0.5,d],[w/2,0,0.5,d]]){const n=Math.round((dx?dd:ww)/0.8);for(let i=0;i<n;i++){const t=-((dx?dd:ww)/2)+(i+0.5)*(dx?dd:ww)/n,h2=Math.max(0.6,hgt*(0.4+r()*0.7));if((dz>0&&Math.abs(t)<0.7))continue;B(x+(dx?dx:t),g,z+(dx?t:dz),dx?0.5:(dx?dd:ww)/n,h2,dx?(dx?dd:ww)/n:0.5,RS[(i+n)%3])}}
      for(let k=0;k<5;k++)B(x+(r()-0.5)*w*0.8,g,z+(r()-0.5)*d*0.8,0.6+r()*0.6,0.3+r()*0.4,0.5+r()*0.5,RS[k%3]);for(let k=0;k<3;k++)B(x+(k-1)*w*0.3,g+hgt*0.8,z+(r()-0.5)*d*0.6,0.2,0.2,d*0.9,RT[k%2]);col(x,z-d/2,w/2,0.3,g+hgt*0.7);col(x,z+d/2,w/2,0.3,g+hgt*0.5)};
    for(const [x,z] of [[-5.5,-7],[-5.5,0],[-5.5,7],[5.5,-6],[5.5,2.5],[5.8,9]])house(x,z,5,5,3.2+r()*1.4,0);
    {const x=0,z=-3.5,g=gy;for(let q=0;q<8;q++){const a=q/8*6.283;B(x+Math.cos(a)*0.9,g,z+Math.sin(a)*0.9,0.5,0.9,0.5,RS[q%3])}B(x,g-0.2,z,1.2,0.25,1.2,'#0a0a10');for(const sx of [-0.9,0.9])B(x+sx,g,z,0.15,2.2,0.15,WDD);B(x,g+2.1,z,2,0.15,0.15,WDD)}
    B(1.2,gy,6,2.4,0.6,1.3,WD[0]);B(1.2,gy+0.6,6,2.4,0.1,1.3,WD[2]);B(2.2,gy,5.2,0.12,1.2,1.2,WDD);B(0.2,gy+0.3,6.8,0.9,0.9,0.12,WDD);
    for(let k=0;k<6;k++){const x=-2+(k%3)*2,z=-11+Math.floor(k/3)*1.6-1;B(x+9,gy,z,0.6,1.1+(k%2)*0.3,0.18,RS[k%3]);B(x+9,gy+0.8,z,0.9,0.15,0.18,RS[(k+1)%3])}
    for(let k=0;k<10;k++){const x=(r()-0.5)*8,z=(r()-0.5)*20;B(x,gy,z,0.12,0.25,0.12,'#e8e0c8');B(x,gy+0.25,z,0.07,0.08,0.07,'!#9ad8ff')}deadTree(-9,-11,5);deadTree(9,10,4.6);deadTree(-9.5,9,4.4);
    return [5.5,2.5]},
  klasztor(s,r,H){const {B,G,col,STN,WD,WDD,RF,gable,MOSS}=H,gy=s.h,W1='#e8e0cc',W2='#d8ceb4',W3='#c8bea4';
    // mury z bramą, kościół z dzwonnicą (dzwon), krużganek z ogrodem ziół i studnią, cele mnichów, ul i grządki
    for(const [x,z,w,d] of [[0,-10.5,22,0.8],[-10.6,0,0.8,21],[10.6,0,0.8,21],[-6.5,10.5,8.4,0.8],[6.5,10.5,8.4,0.8]]){B(x,gy,z,w,2.6,d,W2);B(x,gy+2.6,z,w+0.1,0.25,d+0.1,RF[0]);col(x,z,w/2,d/2,gy+2.8)}B(0,gy+2.4,10.5,4.6,1.2,1,W1);B(0,gy+3.6,10.5,2,1.1,0.9,W2);B(0,gy+3.4,11.0,0.3,0.6,0.1,'#d9b23a');
    {const cx=-3,cz=-5;B(cx,gy,cz,7,6,9,W1);gable(cx,cz,7.4,9.4,gy+6,3,RF,'z',W2);for(let k=-1;k<=1;k++){B(cx-3.52,gy+3,cz+k*2.6,0.1,2,0.8,'#5a7ab8');B(cx+3.52,gy+3,cz+k*2.6,0.1,2,0.8,'#b85a5a')}B(cx,gy,cz+4.52,1.6,2.8,0.1,'#4a2f1d');B(cx,gy+4.4,cz+4.53,1.2,1.2,0.1,'#d8c050');col(cx,cz,3.5,4.5,gy+6)
      const tx=cx+4.6,tz=cz-3;B(tx,gy,tz,3,11,3,W2);for(const [fx,fz] of [[1,0],[-1,0],[0,1],[0,-1]])B(tx+fx*1.52,gy+9,tz+fz*1.52,fx?0.1:1.2,1.6,fz?0.1:1.2,'#1a1410');B(tx,gy+8.6,tz,1,1.2,1,'#c9a24a');B(tx,gy+8.4,tz,0.3,0.4,0.3,'#8a6a2a');gable(tx,tz,3.4,3.4,gy+11,2.2,RF,'x',W2);B(tx,gy+13.4,tz,0.2,1.2,0.2,'#d9b23a');B(tx,gy+14,tz,0.8,0.2,0.2,'#d9b23a');col(tx,tz,1.5,1.5,gy+13)}
    {const ox=4.5,oz=2;for(let k=0;k<6;k++){const a=k/6;B(ox-4+k*1.6,gy,oz-3.5,0.4,2.4,0.4,W3);B(ox-4+k*1.6,gy,oz+3.5,0.4,2.4,0.4,W3)}B(ox,gy+2.4,oz-3.5,9,0.3,1.4,RF[1]);B(ox,gy+2.4,oz+3.5,9,0.3,1.4,RF[1]);
      for(let i=0;i<4;i++)for(let j=0;j<3;j++){B(ox-3+i*2,gy+0.05,oz-2+j*2,1.4,0.2,1.4,'#6a4a2a');for(let q=0;q<3;q++)B(ox-3.4+i*2+q*0.4,gy+0.25,oz-2+j*2,0.2,0.3+(q%2)*0.2,1.2,['#5a9a3a','#7aaa48','#9a7ac8','#d8c050'][(i+j)%4])}
      B(ox,gy,oz,1.4,0.8,1.4,STN[0]);B(ox,gy+0.8,oz,1,0.05,1,'#3a7aa8');for(const sx of [-0.6,0.6])B(ox+sx,gy+0.8,oz,0.12,1.4,0.12,WDD);B(ox,gy+2.2,oz,1.4,0.15,0.15,WDD)}
    for(let k=0;k<4;k++){const x=-8.6,z=-6+k*3.2;B(x,gy,z,3,2.6,2.6,W2);B(x+1.52,gy,z,0.1,1.9,0.9,'#4a2f1d');gable(x,z,3.2,2.8,gy+2.6,1,RF,'x',W2);col(x,z,1.5,1.3,gy+2.6)}
    for(const [x,z] of [[8,-8],[8.8,-6.6]]){B(x,gy,z,0.7,0.9,0.7,'#c8a050');B(x,gy+0.9,z,0.8,0.15,0.8,'#8a6a40')}
    return [8,7]},
  cyrk(s,r,H){const {B,G,col,WD,WDD,IR}=H,gy=s.h,CL=[['#c8302a','#f0e8d8'],['#2a5ac8','#f0d84a'],['#3a9a4a','#f0e8d8'],['#9a3ac8','#f0d84a']];
    // wielki namiot w pasy z masztem i chorągiewkami, wozy cyrkowe, scena, klatka z niedźwiedziem, girlandy lampionów
    for(let k=0;k<9;k++){const rr=7-k*0.78;ringStripe(B,0,0,rr,gy+k*0.75,0.75,CL[0])}B(0,gy+6.6,0,0.3,3,0.3,WDD);B(0,gy+9.2,0.5,0.06,0.6,1,'#d9b23a');for(let q=0;q<8;q++){const a=q/8*6.283;B(Math.cos(a)*7.1,gy,Math.sin(a)*7.1,0.2,1.2,0.2,WDD)}
    B(0,gy,7.0,2.6,2.4,0.3,'#1a1210');for(const sx of [-1.4,1.4])B(sx,gy,7.1,0.3,2.8,0.3,'#d9b23a');B(0,gy+2.7,7.1,3.4,0.6,0.2,'#c8302a');for(let q=0;q<5;q++)B(-1.2+q*0.6,gy+2.8,7.25,0.3,0.3,0.06,'#f0d84a');
    for(const [x,z,i] of [[-9.5,-3,1],[9.5,-3,2],[-9,5,3]]){const [c1,c2]=CL[i];B(x,gy+0.6,z,2.2,2.2,3.6,c1);B(x,gy+2.8,z,2.4,0.3,3.8,c2);for(const dz of [-1.2,1.2])for(const sx of [-1.15,1.15])B(x+sx,gy,z+dz,0.12,0.9,0.9,WDD);B(x+1.12,gy+1.7,z,0.06,0.8,1.2,'#ffcf6a');col(x,z,1.1,1.8,gy+3)}
    {const x=9,z=5;B(x,gy,z,3,0.3,2.4,WD[0]);for(let q=0;q<8;q++)B(x-1.4+q*0.4,gy+0.3,z+1.15,0.07,2,0.07,IR);for(let q=0;q<6;q++)B(x+1.45,gy+0.3,z-1+q*0.4,0.07,2,0.07,IR);B(x,gy+2.3,z,3,0.15,2.4,IR);B(x,gy+0.3,z,1.2,1,1.6,'#5a3a22');B(x,gy+1.2,z-0.6,0.7,0.6,0.6,'#5a3a22');col(x,z,1.5,1.2,gy+2.4)}
    B(0,gy,-10,6,0.8,3,WD[1]);B(0,gy+0.8,-10,6,0.08,3,WD[2]);for(const sx of [-3,3])B(sx,gy,-11.4,0.2,3.4,0.2,WDD);B(0,gy+3.3,-11.4,6.2,0.2,0.2,WDD);B(0,gy+2,-11.45,5.6,2.4,0.06,'#8a1a2a');col(0,-10,3,1.5,gy+0.8);
    for(let q=0;q<14;q++){const a=q/14*6.283,x=Math.cos(a)*11,z=Math.sin(a)*11;B(x,gy,z,0.12,2.6,0.12,WDD);B(x,gy+2.4,z,0.3,0.3,0.3,q%2?'#ffcf6a':'#ff8a6a')}
    return [-9,0]},
  most(s,r,H){const {B,G,col,STN,SDK,WD,WDD,IR,RF,gable}=H,gy=s.h,S1=['#8e8a90','#7a7680','#9a959c'];
    // fosa z wodą, kamienny most na łukach, dwie wieże bramne z kratą, kantor myta, chorągwie
    for(let x=-12;x<=12;x+=1)B(x,gy-0.3,0,1,0.42,7,'#4a7aa8');for(const sz of [-3.8,3.8])for(let x=-12;x<=12;x+=1)B(x,gy-0.3,sz,1,0.95,0.6,S1[(x+12)%3]);
    for(let z=-12;z<=12;z+=1.2){const up=Math.max(0,1-Math.max(0,Math.abs(z)-4.5)/4)*0.7;B(0,gy+up,z,4.4,0.35,1.2,S1[Math.abs(Math.round(z))%3]);if(up>0.05)B(0,gy,z,4.2,up,1.1,S1[2])}for(const sx of [-2.3,2.3])for(let z=-4.5;z<=4.5;z+=1)B(sx,gy+1.05,z,0.4,(Math.round(z)%2?0.8:1.1),1,S1[1]);
    for(const tz of [-6,6]){for(const sx of [-1,1]){B(sx*3.2,gy,tz,2.6,7,2.6,S1[0]);for(let q=0;q<4;q++)B(sx*3.2+(q%2?0.9:-0.9),gy+7,tz+(q>1?0.9:-0.9),0.7,0.8,0.7,S1[2]);B(sx*3.2,gy+3.6,tz+1.32*Math.sign(tz),0.3,1,0.1,'#141414');col(sx*3.2,tz,1.3,1.3,gy+7)}
      B(0,gy+3.4,tz,3.8,2.2,2,S1[1]);B(0,gy+5.6,tz,4,0.4,2.2,S1[2]);for(let q=-3;q<=3;q++)B(q*0.45,gy+2.3,tz+Math.sign(tz)*0.95,0.08,1.2,0.08,IR);B(0,gy+4.3,tz+Math.sign(tz)*1.02,1.6,1,0.1,H.BN);B(0,gy+4.3,tz+Math.sign(tz)*1.06,0.8,0.6,0.06,'#7a1f1f')}
    {const x=-6.5,z=-8.5,g=G(x,z);B(x,g,z,3.4,2.6,3,WD[0]);gable(x,z,3.6,3.2,g+2.6,1.4,RF,'x',WD[2]);B(x+1.72,g+0.8,z,0.08,1,1.4,'#ffcf6a');B(x+2.4,g,z,1.4,1,0.8,WD[1]);B(x+2.4,g+1.02,z,0.4,0.15,0.3,'#d9b23a');col(x,z,1.7,1.5,g+2.6)}
    return [-4.2,-8.5]},
  zatopiona(s,r,H){const {B,G,col,STN,MOSS}=H,gy=G(0,0),M1='#cfc8b2',M2='#b2aa96',M3='#9a927e',SW=['#3a7a4a','#2f6a3e','#4a8a52'],CO=['#e86a6a','#e8a84a','#6ac8a8','#c86ac8','#f0d060'];
    // zapadnięta w płyciznę świątynia morskiej bogini: przechylony stylobat, kolumnada z kanelurami (część złamana i leżąca), zawalony tympanon, cella z posągiem, schody w głąb wody, wodorosty i koralowce, skarb
    let wx=0,wz=0;for(let k=0;k<16;k++){const a=k/16*6.283;if(G(Math.cos(a)*9,Math.sin(a)*9)<WATER){wx+=Math.cos(a);wz+=Math.sin(a)}}const wl=Math.hypot(wx,wz)||1;wx/=wl;wz/=wl;const ax=Math.abs(wx)>Math.abs(wz);
    const cx=wx*6,cz=wz*6,fy=Math.min(gy,WATER)-1.4;const L=(u,v)=>ax?[cx+u*Math.sign(wx||1),cz+v]:[cx+v,cz+u*Math.sign(wz||1)];const tilt=u=>u*0.09;
    const Bp=(u,y,v,wu,h,wv,c)=>{const [x,z]=L(u,v);B(x,y,z,ax?wu:wv,h,ax?wv:wu,c)};
    for(let u=-7;u<=7;u+=1)Bp(u,fy-1.2-tilt(u),0,1.02,1.4,10,u%2?M2:M3);for(let q=0;q<3;q++)for(let u=-6.5+q*0.3;u<=6.5-q*0.3;u+=1)Bp(u,fy+0.2+q*0.28-tilt(u),0,1.02,0.28,9-q*0.6,q%2?M1:M2);
    for(let q=0;q<6;q++)Bp(-8.5-q*0.7,fy-0.4-q*0.45,0,0.8,0.4,4,M2);
    const colm=(u,v,hgt,lean)=>{const y0=fy+1.04-tilt(u);Bp(u,y0,v,0.95,0.3,0.95,M2);for(let y=0;y<hgt;y+=0.6){const ou=lean*y*0.15;Bp(u+ou,y0+0.3+y,v,0.7,0.6,0.7,M1);for(const d of [-0.36,0.36]){Bp(u+ou+d,y0+0.3+y,v,0.04,0.6,0.5,M3);Bp(u+ou,y0+0.3+y,v+d,0.5,0.6,0.04,M3)}}if(hgt>5){Bp(u+lean*hgt*0.15,y0+0.3+hgt,v,1.0,0.25,1.0,M2);Bp(u+lean*hgt*0.15,y0+0.55+hgt,v,1.1,0.25,1.1,M1)}else for(let q=0;q<3;q++)Bp(u+(r()-0.5)*0.4,y0+0.3+hgt+q*0.15,v+(r()-0.5)*0.4,0.5-q*0.12,0.18,0.5-q*0.12,M3);
      if(r()<0.6)for(let y=0;y<Math.min(hgt,3.6);y+=0.5)Bp(u+0.38,y0+0.4+y,v+(r()-0.5)*0.3,0.08,0.5,0.14,SW[(y*2|0)%3])};
    const H6=[6.4,6.4,2.2,6.6,4.0,6.5,1.4,6.4];for(let k=0;k<8;k++)for(const v of [-3.7,3.7])colm(-5.6+k*1.6,v,v>0?H6[k]:H6[7-k]*(k===3?0.4:1),k>5?0.4:0);
    for(const [u,v] of [[-0.8,5.6],[2.4,-5.8]]){for(let q=0;q<5;q++)Bp(u+q*0.82,fy+0.9,v,0.78,0.72,0.72,q%2?M1:M3);}
    Bp(-3.2,fy+8.2-tilt(-3.2),3.7,5,0.6,1.0,M2);Bp(-3.2,fy+8.8,3.7,5.2,0.3,1.1,M1);for(let q=0;q<5;q++)Bp(-3.2,fy+9.1+q*0.3,3.7,4.6-q*0.9,0.3,0.8,M1);
    for(let q=0;q<6;q++)Bp(4.6+q*0.25,fy+1.0+q*0.5,-1+q*0.2,1.2,0.4,3.6-q*0.5,q%2?M1:M2);
    // cella z posągiem
    for(const v of [-2.2,2.2])for(let u=-3.4;u<=2.6;u+=0.8){const h=1+Math.max(0,3.6-Math.abs(u+0.4)*0.8)*(r()*0.4+0.6);Bp(u,fy+1.04-tilt(u),v,0.8,h,0.6,(u*5|0)%2?M2:M1)}for(let v=-2;v<=2;v+=0.8)if(Math.abs(v)>0.7)Bp(-3.6,fy+1.04+tilt(3.6),v,0.6,2.6,0.8,M2);
    Bp(0.6,fy+1.04,0,1.6,0.8,1.6,M2);Bp(0.6,fy+1.84,0,1.0,1.8,0.8,'#7ab8b0');Bp(0.6,fy+3.64,0,0.8,0.9,0.8,'#8ac8c0');Bp(0.6,fy+4.6,0,1.0,0.3,0.9,'#d9b23a');Bp(0.05,fy+2.2,0.6,0.1,3.4,0.1,'#d9b23a');for(const dv of [-0.25,0,0.25])Bp(0.05,fy+5.7,0.6+dv,0.08,0.5,0.08,'#d9b23a');
    Bp(-1.8,fy+1.1,0,0.9,0.5,0.6,'#6b4528');Bp(-1.8,fy+1.6,0,0.92,0.12,0.62,'#e8c040');for(let k=0;k<14;k++)Bp(-1.8+(r()-0.5)*1.6,fy+1.1,(r()-0.5)*1.4,0.14,0.05,0.14,'#e8c040');for(const [u,v] of [[-2.8,1.4],[1.8,-1.5],[2.2,1.6]]){Bp(u,fy+1.1,v,0.4,0.6,0.4,'#b86a3a');Bp(u,fy+1.7,v,0.24,0.2,0.24,'#a85a2a')}
    for(let k=0;k<22;k++){const u=(r()-0.5)*16,v=(r()-0.5)*12,[x,z]=L(u,v);const g=Math.min(G(x,z),fy+1);B(x,g,z,0.3,0.5+r()*1.3,0.3,CO[k%5]);B(x+0.25,g,z,0.25,0.4+r()*0.7,0.25,CO[(k+2)%5]);if(k%3===0)for(let y=0;y<2;y+=0.5)B(x-0.3,g+y,z,0.08,0.5,0.12,SW[k%3])}
    const [tx,tz]=L(-1.8,0);return [tx,tz]},
  smok(s,r,H){const {B,G,col,STN}=H,gy=G(0,0),BO='#e8e0c8',BO2='#d8cfb4',BO3='#c4b898',DK='#14100c',MEM='#5a4a3e';
    // szkielet leżącego smoka: czaszka z otwartą paszczą (wejście do lochu), szyja w kształcie S, kręgosłup z kolcami, łukowate żebra, łapy ze szponami, skrzydła z resztkami błon, zwinięty ogon
    const bone=(x0,y0,z0,x1,y1,z1,w,c)=>{const n=Math.max(2,Math.ceil(Math.hypot(x1-x0,y1-y0,z1-z0)/(w*0.7)));for(let k=0;k<=n;k++){const t=k/n;B(x0+(x1-x0)*t,y0+(y1-y0)*t,z0+(z1-z0)*t,w,w,w,c||(k%2?BO:BO2))}};
    const claw=(x,z,ry)=>{for(let q=-1;q<=1;q++){const ox=x+q*0.35;bone(ox,gy+0.3,z,ox+q*0.15,gy+0.15,z+0.9,0.22,BO);B(ox+q*0.15,gy,z+1.05,0.16,0.3,0.25,BO3)}};
    // czaszka
    {const cz=2.2,cy=gy+0.4;B(0,cy+1.4,cz-1.6,3.4,2.6,3.2,BO);B(0,cy+2.8,cz-1.8,2.6,0.6,2.6,BO2);B(0,cy+1.6,cz+0.6,2.8,1.6,2.4,BO);B(0,cy+1.8,cz+2.2,2.2,1.2,1.6,BO2);B(0,cy+1.9,cz+3.2,1.6,0.9,0.8,BO);
      for(const sx of [-1,1]){B(sx*1.25,cy+2.2,cz-0.6,0.9,0.8,1.0,DK);B(sx*1.3,cy+2.75,cz-0.6,1.1,0.25,1.3,BO3);B(sx*0.4,cy+2.15,cz+3.62,0.3,0.3,0.1,DK);B(sx*1.75,cy+1.2,cz-2,0.3,1.4,1.8,BO3);
        bone(sx*1.2,cy+3.0,cz-2.6,sx*1.9,cy+4.4,cz-4.4,0.42);bone(sx*1.9,cy+4.4,cz-4.4,sx*2.1,cy+4.9,cz-5.8,0.3);bone(sx*1.6,cy+2.4,cz-2.9,sx*2.6,cy+2.9,cz-4.2,0.3)}
      for(let q=0;q<7;q++){const z=cz-0.2+q*0.55;for(const sx of [-1,1])B(sx*1.2,cy+0.75,z,0.22,0.5,0.22,'#f4efe0')}B(0,cy+0.9,cz+3.3,1.4,0.2,0.2,'#f4efe0');
      B(0,gy+0.15,cz+1.6,3,0.3,4.4,BO2);for(const sx of [-1,1])B(sx*1.35,gy+0.4,cz+1.6,0.35,0.6,4.4,BO);for(let q=0;q<7;q++){const z=cz-0.2+q*0.55;for(const sx of [-1,1])B(sx*1.2,gy+0.75,z,0.2,0.45,0.2,'#f4efe0')}
      B(0,gy+0.05,cz+1.4,2.2,0.12,3.6,DK);col(0,cz-1.6,1.7,1.6,cy+3.1)}
    // szyja S
    let px=0,py=gy+2.6,pz=-0.2;const neck=[];for(let k=0;k<9;k++){const t=k/8;const nx=Math.sin(t*Math.PI*1.2)*1.2,ny=gy+2.6+Math.sin(t*Math.PI)*2.4,nz=-0.2-k*0.95;neck.push([nx,ny,nz]);B(nx,ny,nz,1.0-t*0.1,0.9,0.8,k%2?BO:BO2);B(nx,ny+0.75,nz,0.22,0.7,0.22,BO3)}
    // kręgosłup i żebra
    const sp=[];for(let k=0;k<14;k++){const z=-8.6-k*1.15,y=gy+3.4+Math.sin(k*0.35)*0.5-Math.max(0,k-9)*0.35;sp.push([0,y,z]);B(0,y,z,1.1,1.0,1.0,k%2?BO:BO2);const sh=Math.max(0.4,1.6-Math.abs(k-4)*0.18);B(0,y+0.5+sh/2,z,0.26,sh,0.3,BO3);B(0,y+0.5+sh+0.1,z-0.1,0.18,0.25,0.22,BO2)}
    for(let k=1;k<11;k++){const [,y,z]=sp[k],w=Math.max(1.4,3.8-Math.abs(k-3.5)*0.32),h=y-gy-0.2;for(const sx of [-1,1]){let lx=sx*0.5,ly=y;for(let q=1;q<=12;q++){const a=q/12*Math.PI*0.9,nx=sx*(0.5+Math.sin(a)*w),ny=y+Math.cos(a)*h*0.55-q/12*h*0.45;bone(lx,ly,z,nx,ny,z+q*0.02,Math.max(0.2,0.42-q*0.016));lx=nx;ly=ny}}}
    // łapy przednie i tylne ze szponami
    for(const sx of [-1,1]){bone(sx*1.2,gy+3.0,-9.6,sx*2.6,gy+1.6,-8.6,0.5);bone(sx*2.6,gy+1.6,-8.6,sx*2.8,gy+0.3,-7.6,0.42);claw(sx*2.8,-7.6);
      bone(sx*1.1,gy+3.0,-17.6,sx*3.0,gy+2.0,-18.4,0.6);bone(sx*3.0,gy+2.0,-18.4,sx*3.2,gy+0.3,-17.2,0.5);claw(sx*3.2,-17.2)}
    // skrzydła: kość ramienna, przedramię, palce z poszarpaną błoną
    for(const sx of [-1,1]){const sh=[sx*1.0,gy+4.0,-10.4],el=[sx*4.2,gy+7.2,-11.6],wr=[sx*7.4,gy+8.4,-12.4];bone(...sh,...el,0.5);bone(...el,...wr,0.4);
      for(let f=0;f<4;f++){const tip=[sx*(8.4+f*0.6),gy+5.6-f*1.9,-13.6-f*1.6];bone(...wr,...tip,0.26);if(f<3){const n=6;for(let k=1;k<n;k++){if(r()<0.35)continue;const t=k/n,ax=wr[0]+(tip[0]-wr[0])*t,ay=wr[1]+(tip[1]-wr[1])*t,az=wr[2]+(tip[2]-wr[2])*t;B(ax-sx*0.4,ay-0.6,az-0.5,0.08,1.1,0.9,MEM)}}}}
    // ogon zwinięty
    {let a=0,x=0,y=sp[13][1],z=sp[13][2];for(let k=0;k<22;k++){const w=Math.max(0.25,0.95-k*0.032);a+=k>10?0.2:0.04;x+=Math.sin(a)*0.75;z-=Math.cos(a)*0.75;y=Math.max(gy+0.3,y-0.14);B(x,y,z,w,w,w,k%2?BO:BO2);if(k%2===0)B(x,y+w/2+0.15,z,0.14,0.3,0.14,BO3)}B(x+0.3,y+0.2,z-0.3,0.3,0.6,0.3,BO3);B(x+0.5,y+0.6,z-0.5,0.2,0.4,0.2,BO3)}
    // skarby i szczątki śmiałków
    for(let k=0;k<30;k++){const x=(r()-0.5)*3,z=-12+(r()-0.5)*4;B(x,G(x,z),z,0.18,0.06+r()*0.1,0.18,k%5?'#e8c040':'#c0c8d0')}B(0.6,gy+0.3,-12.4,0.5,0.4,0.4,'#6b4528');B(0.6,gy+0.55,-12.4,0.52,0.1,0.42,'#e8c040');
    B(-2.2,gy+0.7,-5,0.08,1.4,0.08,'#8a8f94');B(-2.2,gy+1.25,-5,0.4,0.08,0.08,'#6b4528');B(2.4,gy+0.2,-6.4,0.36,0.34,0.36,'#efe9d6');B(2.4,gy+0.2,-6.2,0.1,0.1,0.02,'#1a1a1a');B(2.1,gy+0.1,-6.2,0.6,0.15,0.3,'#8a8f94');
    for(let k=0;k<12;k++){const x=(r()-0.5)*16,z=-8+(r()-0.5)*22;B(x,G(x,z),z,0.6+r()*0.6,0.2,0.2,BO3)}col(0,-14,2,6,gy+3.5);return null},
  farma(s,r,H){const {B,G,col,STN,WD,WDD,RF,gable,crate,barrel}=H,gy=s.h;
    // dom gospodarza, stodoła z czerwonymi wrotami, kurnik, pole kapusty i zboża, płot, studnia z żurawiem, strach na wróble
    {const x=-5,z=-5;B(x,gy,z,6,3,5,'#e8dcc0');for(const dx of [-3,3])B(x+dx,gy+1.5,z,0.2,3,5.1,'#4a2f1d');gable(x,z,6.4,5.4,gy+3,2.4,RF,'x','#e8dcc0');B(x,gy,z+2.52,1.1,2,0.1,'#5a3a22');for(const dx of [-1.8,1.8])B(x+dx,gy+1.5,z+2.54,0.9,0.9,0.1,'#cfe6ff');B(x+1.8,gy+5,z-1,0.7,1.6,0.7,STN[0]);col(x,z,3,2.5,gy+3)}
    {const x=5,z=-5;B(x,gy,z,7,4.2,6,'#8a3a2a');for(let q=-3;q<=3;q++)B(x+q,gy+2,z+3.02,0.1,4,0.06,'#6a2a1e');B(x,gy,z+3.04,2.6,3,0.08,'#f0e8d8');B(x,gy+1.5,z+3.08,2.4,0.15,0.04,'#8a3a2a');gable(x,z,7.4,6.4,gy+4.2,2.8,['#4a3a2a','#5a4a3a'],'x','#8a3a2a');B(x,gy+5,z+3.05,1,1,0.08,'#2a1a10');col(x,z,3.5,3,gy+4.2)}
    for(let i=0;i<5;i++)for(let j=0;j<3;j++){const x=-7+i*1.6,z=4+j*1.6;B(x,gy,z,1.2,0.6,1.2,'#5f9a40');B(x,gy+0.6,z,0.8,0.3,0.8,'#a8d070')}for(let i=0;i<6;i++)for(let k=0;k<5;k++)B(2+i*1.2,gy,3+k*1.6,0.3,1.4,1.4,'#d8b850');
    for(let k=0;k<12;k++){B(-10+k*1.8,gy,11,0.2,1.1,0.2,WDD);B(-9.1+k*1.8,gy+0.7,11,1.8,0.12,0.1,WD[0])}for(let k=0;k<6;k++){B(10.5,gy,0+k*1.8,0.2,1.1,0.2,WDD);B(10.5,gy+0.7,0.9+k*1.8,0.1,0.12,1.8,WD[0])}
    {const x=-0.5,z=0;B(x,gy,z,1.4,0.9,1.4,STN[1]);B(x,gy+0.9,z,1,0.04,1,'#3a7aa8');B(x+1.6,gy,z,0.25,3.2,0.25,WDD);B(x+0.6,gy+3.0,z,3.6,0.15,0.15,WD[1]);B(x-1,gy+1.6,z,0.04,1.4,0.04,'#c8b080');B(x-1,gy+0.9,z,0.4,0.4,0.4,WD[0])}
    {const x=8.5,z=6;B(x,gy+0.6,z,2,1.4,1.6,WD[2]);for(const dx of [-0.9,0.9])for(const dz of [-0.7,0.7])B(x+dx,gy,z+dz,0.15,0.6,0.15,WDD);gable(x,z,2.2,1.8,gy+2,0.8,RF,'z',WD[2]);for(let k=0;k<4;k++)B(x-1.6+k*0.5,gy,z+1.6+(k%2)*0.4,0.3,0.35,0.4,k%2?'#f0ece0':'#a8452f')}
    for(let k=0;k<4;k++)barrel(-1.8+k*0.8,gy,-1.6);crate(1.4,gy,-2,1);B(0.5,gy,3,0.12,2.2,0.12,WDD);B(0.5,gy+1.6,3,1.6,0.1,0.1,WDD);B(0.5,gy+1.2,3,0.6,0.8,0.36,'#8a5a3a');B(0.5,gy+2,3,0.4,0.4,0.4,'#d8c070');B(0.5,gy+2.4,3,0.9,0.12,0.9,'#c8a858');
    return null},
  portal(s,r,H){const {B,G,col,STN}=H,gy=G(0,0),P1=['#8a8ca0','#7a7c90','#9a9cb0'],RU='!#5ac8ff';
    // starożytna brama: łuk z płyt z runami, wir światła w środku, schody, przewrócone kolumny, kryształy
    for(let k=0;k<3;k++)B(0,gy-0.6+k*0.35,0,9-k*1.6,0.6,7-k*1.4,P1[k]);
    for(const sx of [-1,1]){for(let y=0;y<6;y+=1)B(sx*2.6,gy+0.5+y,0,1.2,1,1.2,P1[y%3]);for(let y=1;y<6;y+=1.4)B(sx*2.6+sx*-0.62,gy+0.8+y,0,0.06,0.5,0.5,RU)}for(let q=0;q<7;q++){const a=q/6*Math.PI;B(Math.cos(a)*2.6,gy+6.4+Math.sin(a)*1.4,0,1.2,0.9,1.2,P1[q%3])}B(0,gy+8,0,0.8,0.8,1.3,RU);
    for(let y=0;y<6;y+=0.5)B(0,gy+0.6+y,0,4,0.5,0.15,(Math.round(y*2)%2)?'!#7ad8ff':'!#3a8aff');B(0,gy+0.6,0,4,0.05,2,'!#9ae8ff');
    for(const [x,z,rot] of [[-5,3.5,1],[5.5,-3,0]]){B(x,gy,z,rot?3.4:0.8,0.8,rot?0.8:3.4,P1[1]);B(x+(rot?1.5:0),gy,z+(rot?0:1.5),1,0.4,1,P1[2])}
    for(let k=0;k<6;k++){const a=k/6*6.283+0.3,x=Math.cos(a)*5,z=Math.sin(a)*4,g=G(x,z);B(x,g,z,0.5,1.2+(k%3)*0.4,0.5,'!#8ae8ff');B(x+0.3,g,z+0.2,0.3,0.7,0.3,'!#c8f4ff')}
    col(-2.6,0,0.6,0.6,gy+6.5);col(2.6,0,0.6,0.6,gy+6.5);return null},
  latarnik(s,r,H){const {B,G,col,STN,WD,WDD,RF,gable,rock}=H,gy=G(0,0),RK=['#6a6670','#5a5660','#7a7680'],LW='#efe8dc',LR='#b8352a';
    // skały nad wodą, smukła latarnia w biało-czerwone pasy z galerią i świecącą laterną, domek latarnika, łódka przy pomoście
    for(let k=0;k<10;k++){const a=k/10*6.283;rock(Math.cos(a)*5,Math.sin(a)*5,G(Math.cos(a)*5,Math.sin(a)*5)-2,3+r()*2,3+r()*2,3+r()*2,RK)}
    const tx=0,tz=-1;for(let k=0;k<13;k++)B(tx,gy+k*1.1,tz,3.2-k*0.08,1.1,3.2-k*0.08,Math.floor(k/2)%2?LR:LW);B(tx,gy+14.3,tz,3.6,0.3,3.6,'#3a3a40');for(let q=0;q<12;q++){const a=q/12*6.283;B(tx+Math.cos(a)*1.75,gy+14.9,tz+Math.sin(a)*1.75,0.08,0.9,0.08,'#3a3a40')}
    B(tx,gy+14.6,tz,1.8,1.6,1.8,'!#fff3c4');for(const [fx,fz] of [[1,1],[1,-1],[-1,1],[-1,-1]])B(tx+fx*0.85,gy+15.4,tz+fz*0.85,0.15,1.6,0.15,'#3a3a40');for(let k=0;k<4;k++)B(tx,gy+16.2+k*0.35,tz,2.2-k*0.5,0.35,2.2-k*0.5,LR);B(tx,gy,tz+1.62,0.9,2,0.1,'#3a2a1c');for(const y of [4,8,11])B(tx,gy+y,tz+1.55-y*0.04,0.5,0.8,0.1,'#cfe6ff');col(tx,tz,1.6,1.6,gy+14.3)
    {const x=3.8,z=2.2,g=G(x,z);B(x,g,z,3.2,2.4,2.8,LW);gable(x,z,3.4,3,g+2.4,1.4,RF,'z',LW);B(x,g,z+1.42,0.9,1.8,0.08,'#3a5a8a');B(x-1,g+1.2,z+1.42,0.6,0.6,0.08,'#ffcf6a');B(x+1,g+2.9,z-0.6,0.5,1.4,0.5,RK[0]);col(x,z,1.6,1.4,g+2.4)}
    return null}};
function BN_(H){return H.BN||'#e8e2cc'}
// pasiasty pierścień namiotu (paski wzdłuż obwodu)
function ringStripe(B,cx,cz,rr,y,h,C){const n=24;for(let q=0;q<n;q++){const a=q/n*6.283,a2=(q+1)/n*6.283,x=cx+Math.cos((a+a2)/2)*rr,z=cz+Math.sin((a+a2)/2)*rr,len=rr*2*Math.sin(Math.PI/n)+0.12,ax=Math.abs(Math.cos((a+a2)/2))>0.7;B(x,y,z,ax?0.4:len,h,ax?len:0.4,C[q%2])}if(rr<2.6)B(cx,y,cz,rr*1.6,h,rr*1.6,C[0])}
// ===== v105: struktury bez wnętrz =====
Object.assign(STRN,{obelisk:'Runiczny obelisk',akwedukt:'Ruiny akweduktu',kolos:'Upadły kolos',cmentarz:'Stary cmentarz',rozdroze:'Rozdroże wisielców',kamieniolom:'Kamieniołom',gaj:'Święty gaj druidów',sterowiec:'Wrak sterowca',ul:'Olbrzymi ul',meteoryt:'Krater meteorytu',totemy:'Pole totemów',sygnal:'Wieża sygnałowa'});
Object.assign(STRC,{obelisk:'#5ac8ff',akwedukt:'#c8b898',kolos:'#a8a8b0',cmentarz:'#9ab8c8',rozdroze:'#c8a870',kamieniolom:'#a89878',gaj:'#7dd87d',sterowiec:'#c8a060',ul:'#f0c020',meteoryt:'#ff7a1a',totemy:'#c84a3a',sygnal:'#ffb040'});
FRIENDLY.add('gaj');
Object.assign(STRUCT2,{
  obelisk(s,r,H){const {B,G,col}=H,gy=G(0,0),O1='#3a3a48',O2='#2e2e3a',RU='!#5ac8ff';
    // smukły obelisk z płyt, wijące się runy, krąg menhirów, świecący szczyt
    for(let q=0;q<3;q++)B(0,gy-0.4+q*0.35,0,5-q*1.2,0.45,5-q*1.2,q%2?O2:O1);for(let y=0;y<12;y+=0.8){const w=1.7-y*0.06;B(0,gy+0.9+y,0,w,0.8,w,(y*5|0)%2?O1:O2);const a=y*0.9;for(const [fx,fz] of [[1,0],[-1,0],[0,1],[0,-1]])if(((y*1.25|0)+fx+fz*2)%3===0)B(fx*(w/2+0.02),gy+1.3+y,fz*(w/2+0.02),fx?0.06:0.5,0.5,fz?0.06:0.5,RU)}
    for(let q=0;q<4;q++)B(0,gy+12.9+q*0.4,0,1-q*0.24,0.4,1-q*0.24,O1);B(0,gy+14.7,0,0.45,0.45,0.45,'!#a8f0ff');
    for(let q=0;q<7;q++){const a=q/7*6.283,x=Math.cos(a)*5.5,z=Math.sin(a)*5.5,g=G(x,z);B(x,g,z,0.9,2.2+(q%3)*0.6,0.7,O2);B(x,g+1.2,z+0.36*Math.sign(z||1),0.3,0.3,0.06,RU)}col(0,0,0.85,0.85,gy+13);return null},
  akwedukt(s,r,H){const {B,G,col,MOSS}=H,A1='#c8b898',A2='#b8a888',A3='#a89878',ax=r()<0.5;const P2=(u,y,v,wu,h,wv,c)=>B(ax?u:v,y,ax?v:u,ax?wu:wv,h,ax?wv:wu,c);
    // dwupiętrowy łukowy akwedukt z rynną wodną, część przęseł zawalona, gruz i bluszcz
    const base=Math.min(G(-12,0),G(12,0),G(0,0));const top=base+11;for(let k=-3;k<=3;k++){const u=k*4;const broken=k===2;const g=G(ax?u:0,ax?0:u);P2(u,g-1,0,1.4,(broken?5:top-g+1),2,k%2?A1:A2);if(broken){for(let q=0;q<6;q++){const x=u+(r()-0.5)*4,z=(r()-0.5)*4;P2(x,G(ax?x:z,ax?z:x),z,0.6+r(),0.5+r()*0.5,0.6+r(),A3)}continue}
      if(k<3&&k!==1){for(let q=0;q<8;q++){const a=q/7*Math.PI,uu=u+2+Math.cos(a)*1.3,yy=base+5.4+Math.sin(a)*1.2;P2(uu,yy,0,0.6,0.6,2,A2)}P2(u+2,base+6.6,0,4,0.7,2,A1);for(let q=0;q<8;q++){const a=q/7*Math.PI,uu=u+2+Math.cos(a)*1.3,yy=base+9+Math.sin(a)*0.9;P2(uu,yy,0,0.6,0.5,2,A2)}P2(u+2,top-0.6,0,4,0.8,2,A1);P2(u+2,top+0.2,0,4,0.5,0.4,A3);P2(u+2,top+0.2,0.8,4,0.5,0.4,A3);P2(u+2,top+0.24,0.4,4,0.2,0.4,'#4a8ac8')}
      if(r()<0.6)for(let y=0;y<5;y+=0.6)P2(u+0.72,G(ax?u:0,ax?0:u)+y,(r()-0.5)*1.4,0.1,0.6,0.3,MOSS[0])}
    for(let k=-3;k<=3;k++){const u=k*4;col(ax?u:0,ax?0:u,ax?0.7:1,ax?1:0.7,top)}return null},
  kolos(s,r,H){const {B,G,col,MOSS}=H,gy=G(0,0),S1='#a8a8b0',S2='#9898a0',S3='#b8b8c0';
    // przewrócony kamienny posąg wojownika: głowa w hełmie leżąca na boku, tułów w kawałkach, dłoń z mieczem wbita w ziemię, cokół ze stopami
    B(-6,gy-0.5,-6,5,2,4,S2);for(const sx of [-1,1])B(-6+sx*1.1,gy+1.5,-6,1.6,2.6,2.4,S1),B(-6+sx*1.1,gy+1.5,-5,1.6,0.8,1.2,S3);
    {const hx=4,hz=3;B(hx,gy,hz,4.2,3.8,4.6,S1);B(hx,gy+3.8,hz,4.4,0.4,4.8,S2);B(hx+2.2,gy+1.6,hz,0.3,1.6,3.6,S2);B(hx+2.25,gy+2.1,hz+1,0.2,0.4,0.8,'#2a2a30');B(hx+2.25,gy+2.1,hz-1,0.2,0.4,0.8,'#2a2a30');B(hx+2.25,gy+1.0,hz,0.2,0.3,1.4,'#6a6a72');for(let q=0;q<6;q++)B(hx-0.5+q*0.25,gy+4.2+q*0.5,hz,0.4,0.5,0.4,'#8a2a22');B(hx,gy,hz,4.4,0.5,4.8,MOSS[0]);col(hx,hz,2.2,2.4,gy+3.8)}
    for(const [x,z,w] of [[-1,-1,3.6],[-2.6,1.8,3],[0.8,-3.8,2.6]]){B(x,gy,z,w,2.4,w*0.8,S2);B(x,gy+2.4,z,w*0.9,0.3,w*0.7,MOSS[1]);col(x,z,w/2,w*0.4,gy+2.4)}
    B(-5,gy,4,1.6,1.4,2.2,S1);for(let q=0;q<4;q++)B(-5.6+q*0.4,gy+1.4,4.9,0.32,0.5,0.6,S3);B(-5,gy+1,4.6,0.4,9,0.5,'#8a8f94');B(-5,gy+5.5,4.6,0.4,0.4,0.5,S3);B(-5,gy+5.2,4.6,2.2,0.3,0.5,'#8a8f94');for(let k=0;k<14;k++){const x=(r()-0.5)*16,z=(r()-0.5)*16;B(x,G(x,z),z,0.4+r()*0.8,0.3+r()*0.5,0.4+r()*0.8,S2)}col(-5,4.6,0.3,0.3,gy+9);return null},
  cmentarz(s,r,H){const {B,G,col,WDD,IR,deadTree}=H,gy=s.h,S1=['#8a8690','#7a7680','#9a96a0'],GR='#3a4a2a';
    // kamienny mur z kutą bramą, rzędy nagrobków i krzyży, mauzoleum z kolumnami, kaplica-ruina, latarnie, kruki
    for(const [x,z,w,d] of [[0,-10,20,0.6],[-10,0,0.6,20],[10,0,0.6,20],[-6,10,8,0.6],[6,10,8,0.6]]){B(x,gy,z,w,1.4,d,S1[1]);B(x,gy+1.4,z,w+0.1,0.15,d+0.15,S1[2]);col(x,z,w/2,d/2,gy+1.5)}for(const sx of [-1.9,1.9]){B(sx,gy,10,0.8,2.6,0.8,S1[0]);B(sx,gy+2.6,10,1,0.3,1,S1[2])}for(let q=-4;q<=4;q++)B(q*0.36,gy+1.2,10,0.06,2+Math.abs(q)*-0.12+0.6,0.06,IR);B(0,gy+2.7,10,3,0.1,0.08,IR);
    for(let i=0;i<5;i++)for(let j=0;j<3;j++){const x=-7.5+i*2.4+(j%2)*0.6,z=-1+j*3;if(Math.abs(x)<1.3)continue;const t=(i*3+j)%4;B(x,gy,z+0.7,0.9,0.12,1.8,GR);if(t===0){B(x,gy,z,0.8,1.1,0.2,S1[i%3]);B(x,gy+1.1,z,0.6,0.15,0.2,S1[2])}else if(t===1){B(x,gy,z,0.16,1.4,0.16,S1[0]);B(x,gy+1.0,z,0.7,0.16,0.16,S1[0])}else if(t===2){B(x,gy,z,0.7,0.8,0.25,S1[1]);B(x+0.1,gy,z,0.5,0.3,0.4,S1[2])}else{B(x,gy,z,0.9,0.4,1.6,S1[2]);B(x,gy+0.4,z,0.7,0.2,1.4,S1[0])}}
    {const mx=0,mz=-6.5;B(mx,gy,mz,5,0.4,4,S1[2]);B(mx,gy+0.4,mz-0.4,4,3.2,3,S1[0]);for(const sx of [-1.8,-0.6,0.6,1.8])B(mx+sx,gy+0.4,mz+1.5,0.45,3,0.45,S1[2]);B(mx,gy+3.5,mz+0.2,5,0.4,4,S1[1]);for(let q=0;q<4;q++)B(mx,gy+3.9+q*0.4,mz+0.2,4.6-q*1.2,0.4,3.6,S1[q%2?0:2]);B(mx,gy+0.4,mz+1.12,1.4,2.2,0.1,'#1a1612');B(mx,gy+5.6,mz+0.2,0.2,0.9,0.2,S1[2]);B(mx,gy+5.9,mz+0.2,0.6,0.15,0.2,S1[2]);col(mx,mz,2.5,2,gy+3.9)}
    {const cx=7,cz=-6.5;for(const [x,z,w,d,h] of [[cx,cz-1.5,3,0.4,3.2],[cx-1.5,cz,0.4,3,2.4],[cx+1.5,cz,0.4,3,1.6]])B(x,gy,z,w,h,d,S1[1]);B(cx-0.4,gy+3.2,cz-1.5,1,0.6,0.4,S1[2]);col(cx,cz-1.5,1.5,0.2,gy+3.2)}
    for(const [x,z] of [[-8.6,-8.6],[8.6,8.6],[-8.6,8.6]]){B(x,gy,z,0.12,2.2,0.12,IR);B(x,gy+2.2,z,0.3,0.36,0.3,'!#9ad8ff')}deadTree(-7,-7.5,4.6);deadTree(5,6,4);return null},
  rozdroze(s,r,H){const {B,G,col,WD,WDD,IR,deadTree}=H,gy=s.h;
    // skrzyżowanie traktów, drogowskaz z tablicami, szubienica z klatką, kapliczka przydrożna, przewrócony wóz, ognisko kupieckie
    for(let k=-10;k<=10;k++){B(k,gy-0.04,0,1,0.1,2.4,(k%2)?'#8a7a5a':'#7a6a4a');B(0,gy-0.04,k,2.4,0.1,1,(k%2)?'#7a6a4a':'#8a7a5a')}
    B(1.8,gy,1.8,0.25,3.4,0.25,WDD);for(const [y,ax,dir,c] of [[2.9,1,1,'#c8a870'],[2.5,0,-1,'#b89860'],[2.1,1,-1,'#a88850']]){B(1.8+(ax?dir*0.6:0),gy+y,1.8+(ax?0:dir*0.6),ax?1.3:0.08,0.3,ax?0.08:1.3,c);B(1.8+(ax?dir*1.3:0),gy+y,1.8+(ax?0:dir*1.3),ax?0.3:0.08,0.24,ax?0.08:0.3,c)}
    {const x=-4,z=-4;B(x-1,gy,z,0.3,5,0.3,WDD);B(x+1,gy,z,0.3,5,0.3,WDD);B(x,gy+4.9,z,2.6,0.3,0.3,WDD);B(x-0.6,gy+4.5,z,0.6,0.15,0.15,WDD);B(x+0.4,gy+3.9,z,0.03,1.0,0.03,'#c8b080');B(x+0.4,gy+2.6,z,0.9,1.3,0.9,IR);for(let q=0;q<4;q++)B(x+0.4+(q%2?0.42:-0.42),gy+2.6,z+(q>1?0.42:-0.42),0.06,1.3,0.06,IR);B(x+0.4,gy+2.7,z,0.4,0.4,0.4,'#e8e2cc');B(x,gy,z,3.2,0.3,1.4,WD[0]);col(x,z,1.2,0.3,gy+5)}
    {const x=4,z=-4;B(x,gy,z,1.2,1.2,1.2,'#8a8690');B(x,gy+1.2,z,0.9,1.2,0.8,'#9a96a0');B(x,gy+1.4,z+0.42,0.5,0.7,0.06,'#2a2a3a');B(x,gy+1.6,z+0.44,0.2,0.4,0.04,'#d9b23a');B(x,gy+2.4,z,1.2,0.3,1.0,'#7a2a22');B(x,gy+2.7,z,0.6,0.3,0.6,'#7a2a22');B(x+0.3,gy+1.0,z+0.6,0.12,0.25,0.12,'!#ffcf6a');col(x,z,0.6,0.6,gy+2.5)}
    {const x=-4.5,z=4.5;B(x,gy+0.6,z,2.4,0.6,1.4,WD[1]);B(x+1,gy,z+0.75,0.12,1.1,1.1,WDD);B(x-1.4,gy,z-0.2,1.1,1.1,0.12,WDD);for(let q=0;q<5;q++)B(x+(r()-0.5)*3,gy,z+1.4+r(),0.5,0.4,0.5,q%2?'#8a6a40':'#6b4528');col(x,z,1.2,0.7,gy+1.2)}
    B(4.5,gy,4.5,1.2,0.3,1.2,'#4a4650');B(4.5,gy+0.3,4.5,0.6,0.4,0.6,'!#ff8a2e');B(5.6,gy,4.5,0.4,0.4,1.4,WD[0]);deadTree(-7,1.5,5);return null},
  kamieniolom(s,r,H){const {B,G,col,WD,WDD,IR,crate}=H,gy=G(0,0),Q1=['#b8b0a0','#a8a090','#c8c0b0'];
    // tarasowe wyrobisko ze stopniami skały, żuraw drewniany z blokiem na linie, bloki kamienia, szałas, taczki
    for(let k=0;k<5;k++){const z=-8+k*1.6,h=8-k*1.6;for(let x=-8;x<=8;x+=2)B(x,gy,z,2,h,1.6,Q1[(k+x/2+8)%3]);col(0,z,8,0.8,gy+h)}
    for(let k=0;k<12;k++){const x=(r()-0.5)*12,z=1+r()*7;B(x,G(x,z),z,1.2,0.8,0.8,Q1[k%3]);if(k%3===0)B(x,G(x,z)+0.8,z,1.2,0.8,0.8,Q1[(k+1)%3])}
    {const x=5,z=3;B(x,gy,z,0.4,7,0.4,WDD);B(x-1.6,gy+6.8,z,4,0.3,0.3,WDD);for(const d of [-1,1])B(x+d*0.7,gy+3.4,z+0.7,0.12,7,0.12,WD[0]);B(x-3.4,gy+4.4,z,0.04,2.4,0.04,'#c8b080');B(x-3.4,gy+2.6,z,1.2,1.2,1.2,Q1[2]);B(x+0.4,gy+1,z,1.4,1.4,0.3,WD[1]);col(x,z,0.3,0.3,gy+7)}
    {const x=-5,z=5;B(x,gy,z,2.6,2,2.2,WD[0]);for(let q=0;q<4;q++)B(x,gy+2+q*0.3,z,2.8-q*0.7,0.3,2.4,q%2?'#8a6a40':'#6b4528');col(x,z,1.3,1.1,gy+2)}
    B(-1.5,gy+0.25,6,1.2,0.4,0.7,WD[1]);B(-0.8,gy+0.15,6,0.3,0.3,0.3,'#3a3a40');for(const [x,z] of [[1.5,6.5],[2.4,6.2]]){B(x,gy,z,0.06,0.9,0.06,'#8a8f94');B(x,gy+0.8,z,0.3,0.12,0.12,'#3a3a40')}crate(-3,gy,2.6,1);return null},
  gaj(s,r,H){const {B,G,col,WD,MOSS}=H,gy=s.h,T1='#5a3a22',L1=['#3f8a3a','#4a9a42','#2f7a32'];
    // krąg starych dębów z koronami, kamienny ołtarz z misą, kamienie z wyrytymi spiralami, świetliki, wieńce z jemioły
    for(let q=0;q<8;q++){const a=q/8*6.283,x=Math.cos(a)*8,z=Math.sin(a)*8;for(let y=0;y<7;y+=1)B(x,gy+y,z,1.4-y*0.05,1,1.4-y*0.05,y%2?T1:'#4a2f1d');for(let k=0;k<4;k++)B(x+Math.cos(a+k*1.6)*1.4,gy+7+(k%2)*0.8,z+Math.sin(a+k*1.6)*1.4,3.2,2.2,3.2,L1[(q+k)%3]);B(x,gy+9,z,2.6,1.6,2.6,L1[q%3]);col(x,z,0.7,0.7,gy+7);B(x-Math.cos(a)*0.72,gy+3,z-Math.sin(a)*0.72,0.3,0.3,0.3,'#d8e8a0')}
    B(0,gy,0,2.4,0.9,1.4,'#8a8690');B(0,gy+0.9,0,2.6,0.2,1.6,'#9a96a0');B(0,gy+1.1,0,1,0.2,1,'#6a6a70');B(0,gy+1.3,0,0.6,0.08,0.6,'!#7affb0');
    for(let q=0;q<5;q++){const a=q/5*6.283+0.3,x=Math.cos(a)*4.2,z=Math.sin(a)*4.2;B(x,gy,z,0.8,1.6,0.6,'#7a7680');B(x,gy+1,z+0.31*Math.sign(z||1),0.4,0.4,0.04,'!#7affb0')}
    for(let q=0;q<20;q++)B((r()-0.5)*14,gy+1+r()*5,(r()-0.5)*14,0.08,0.08,0.08,'!#e8ff8a');for(let q=0;q<12;q++){const a=q/12*6.283;B(Math.cos(a)*2,gy+0.05,Math.sin(a)*2,0.4,0.1,0.4,['#f0a8c8','#fff0a0','#c8a8f0'][q%3])}col(0,0,1.2,0.7,gy+1.1);return null},
  sterowiec(s,r,H){const {B,G,col,WD,WDD,IR}=H,gy=G(0,0),CL='#c8b898',CL2='#b8a888';
    // rozbity sterowiec: rozdarta powłoka balonu na żebrach, gondola wbita w ziemię, śmigło, liny, rozsypany ładunek
    const ax=r()<0.5;const P2=(u,y,v,wu,h,wv,c)=>B(ax?u:v,y,ax?v:u,ax?wu:wv,h,ax?wv:wu,c);
    for(let k=-8;k<=8;k++){const rr=3.4*Math.sqrt(Math.max(0.05,1-(k/9)*(k/9)));const g=G(ax?k:0,ax?0:k);for(let q=0;q<14;q++){const a=q/13*Math.PI,v=Math.cos(a)*rr,y=gy+0.4+Math.sin(a)*rr*0.8;if(k%3===0)P2(k,y,v,0.14,0.3,0.3,WDD);else if(!(k>2&&q>4&&q<10)&&r()<0.8)P2(k,y,v,1,0.3,0.6,q%2?CL:CL2)}}
    P2(-1,gy-0.6,4.4,5,2,2.2,WD[1]);P2(-1,gy+1.4,4.4,5.2,0.2,2.4,WD[2]);for(let q=0;q<4;q++)P2(-3+q*1.4,gy+0.6,5.52,0.7,0.6,0.06,'#cfe6ff');P2(2,gy+0.6,4.4,0.3,0.3,1.4,IR);P2(2.3,gy+0.6,4.4,0.1,2.2,0.3,WD[0]);P2(2.3,gy+0.6,4.4,0.1,0.3,2.2,WD[0]);
    for(let q=0;q<5;q++)P2(-3+q*1.3,gy+1.6,4.4-q*0.3,0.04,1.8+q*0.2,0.04,'#c8b080');for(let k=0;k<10;k++){const u=(r()-0.5)*14,v=4+r()*5;P2(u,G(ax?u:v,ax?v:u),v,0.6,0.5,0.6,k%2?'#8a5a30':'#6b4528')}
    P2(9,gy,0,1.4,1.4,0.6,WD[0]);P2(9.5,gy+0.7,0,0.1,2.6,0.4,WD[1]);col(0,0,ax?8:3,ax?3:8,gy+2.8);return null},
  ul(s,r,H){const {B,G,col,WD}=H,gy=G(0,0),HY=['#e8b020','#d8a018','#f0c040'],DK='#5a3a10';
    // wielki ul zwisający z martwego drzewa: plaster z komórkami, kapiący miód, kałuże miodu, kwiaty dookoła
    for(let y=0;y<10;y++)B(0,gy+y,-3,1.6-y*0.04,1,1.6-y*0.04,'#5a3a22');B(0,gy+9,0,1,1,6,'#5a3a22');B(0,gy+9,3,1,3,1,'#5a3a22');
    for(let q=0;q<9;q++){const y=gy+8-q*0.7,w=1+Math.sin(q/8*Math.PI)*3.4;B(0,y,1.2,w,0.7,w*0.9,HY[q%3]);for(let k=0;k<4;k++){const a=k/4*6.283+q;B(Math.cos(a)*w/2,y,1.2+Math.sin(a)*w*0.45,0.3,0.3,0.06,DK)}}B(0,gy+3.4,1.2+1.6,0.6,0.6,0.1,'#1a1008');
    for(let q=0;q<5;q++){const x=(r()-0.5)*2.4,z=1.2+(r()-0.5)*2;B(x,gy+1.5+r()*1.4,z,0.12,0.6,0.12,'#f0a020');B(x,G(x,z),z,0.8,0.06,0.8,'#e8a020')}
    for(let q=0;q<16;q++){const a=q/16*6.283,rr=5+r()*3,x=Math.cos(a)*rr,z=Math.sin(a)*rr;B(x,G(x,z),z,0.14,0.8,0.14,'#4a8a32');B(x,G(x,z)+0.8,z,0.4,0.2,0.4,['#f08ab0','#f8d840','#c8a8f0','#ffffff'][q%4])}col(0,-3,0.8,0.8,gy+9);return null},
  meteoryt(s,r,H){const {B,G,col}=H,gy=G(0,0),M1='#2a2422',M2='#3a302c',LV='!#ff7a1a';
    // wbity w ziemię meteoryt z żarzącymi się pęknięciami, wał krateru z wyrzuconych skał, kryształy, dym
    for(let q=0;q<22;q++){const a=q/22*6.283,rr=9+r()*1.5,x=Math.cos(a)*rr,z=Math.sin(a)*rr;B(x,G(x,z)-0.3,z,1.6+r(),1+r()*1.2,1.6+r(),q%2?'#6a6058':'#5a5048')}
    B(0,gy-1.6,0,7,4.6,6,M1);B(0.4,gy+3,-0.3,5,2.6,4.4,M2);B(0.6,gy+5.6,-0.4,2.6,1.4,2.4,M1);for(const [x,y,z,w,h,d] of [[-3.52,gy,0,0.1,3,1.2],[3.52,gy+1,1,0.1,2.2,1.4],[0,gy+0.5,3.02,1.6,2.6,0.1],[0.4,gy+4.2,2.22,1.2,0.8,0.1],[-1,gy+5.62,-0.4,1.4,0.1,0.8]])B(x,y,z,w,h,d,LV);
    for(let k=0;k<8;k++){const a=k/8*6.283,x=Math.cos(a)*5,z=Math.sin(a)*5,g=G(x,z);B(x,g,z,0.4,1.2+(k%3)*0.5,0.4,'!#ff9a3a');B(x+0.3,g,z+0.2,0.3,0.6,0.3,'#2a2422')}for(let q=0;q<6;q++)B(0.6+(r()-0.5),gy+7+q*1.1,-0.4+(r()-0.5),0.9+q*0.25,0.8,0.9+q*0.25,q%2?'#4a4440':'#5a544e');
    col(0.2,0,3.5,3,gy+6.3);return [3.6,4]},
  totemy(s,r,H){const {B,G,col,WD,WDD}=H,gy=s.h,C=['#a8352a','#2a6a8a','#d9b23a','#3a7a3a','#e8e2cc'];
    // pole rzeźbionych totemów z twarzami, rogi i czaszki, krąg ogniska, bębny wojenne, skóry na stelażach
    for(let k=0;k<7;k++){const a=k/7*6.283,x=Math.cos(a)*6,z=Math.sin(a)*6,hh=5+(k%3)*1.5;for(let y=0;y<hh;y+=1.2){const c=C[(k+y|0)%4];B(x,gy+y,z,1.1,1.2,1.1,c);B(x-Math.cos(a)*0.56,gy+y+0.75,z-Math.sin(a)*0.56,0.6,0.15,0.06,'#1a1210');B(x-Math.cos(a)*0.58,gy+y+0.4,z-Math.sin(a)*0.58,0.3,0.2,0.08,'#e8e2cc')}B(x,gy+hh,z,1.8,0.25,0.4,C[2]);for(const sd of [-1,1])B(x+sd*0.9,gy+hh+0.4,z,0.2,0.8,0.2,'#e8e2cc');col(x,z,0.55,0.55,gy+hh)}
    B(0,gy,0,1.6,0.3,1.6,'#4a4650');B(0,gy+0.3,0,0.8,0.6,0.8,'!#ff8a2e');B(0,gy+0.9,0,0.4,0.4,0.4,'!#ffd34d');for(let q=0;q<10;q++){const a=q/10*6.283;B(Math.cos(a)*1.3,gy,Math.sin(a)*1.3,0.4,0.3,0.4,'#6a6670')}
    for(const [x,z] of [[2.6,-2],[-2.6,2.2]]){B(x,gy,z,0.9,0.9,0.9,'#8a5a30');B(x,gy+0.9,z,0.9,0.06,0.9,'#e8dcc0')}B(-3,gy,-3,0.12,2.4,0.12,WDD);B(-1.8,gy,-3,0.12,2.4,0.12,WDD);B(-2.4,gy+2.3,-3,1.4,0.1,0.1,WDD);B(-2.4,gy+1.5,-3,1,1.4,0.06,'#a8865a');return null},
  sygnal(s,r,H){const {B,G,col,WD,WDD,STN}=H,gy=G(0,0),S1=['#8e8a90','#7a7680','#9a959c'];
    // kamienna wieża z żeleznym koszem ogniowym na szczycie, drabina, stos drewna, róg sygnałowy
    for(let y=0;y<9;y+=1)B(0,gy+y,0,3.2-y*0.08,1,3.2-y*0.08,S1[y%3]);B(0,gy+9,0,3.6,0.3,3.6,S1[2]);for(let q=0;q<4;q++)B((q%2?1.5:-1.5),gy+9.6,(q>1?1.5:-1.5),0.5,0.9,0.5,S1[0]);
    B(0,gy+9.3,0,1.4,0.2,1.4,'#3a3a40');for(const [dx,dz] of [[0.6,0.6],[-0.6,0.6],[0.6,-0.6],[-0.6,-0.6]])B(dx,gy+9.9,dz,0.08,1,0.08,'#3a3a40');B(0,gy+9.6,0,1,0.5,1,'#6b4528');B(0,gy+10.1,0,0.9,0.7,0.9,'!#ff8a2e');B(0,gy+10.7,0,0.5,0.6,0.5,'!#ffd34d');
    for(let y=0;y<9;y+=0.5)B(0,gy+y+0.25,1.72,0.9,0.08,0.08,WD[0]);for(const sx of [-0.45,0.45])B(sx,gy,1.72,0.08,9,0.08,WDD);B(0,gy,1.6,1.2,2.2,0.1,'#3a2a1c');
    for(let q=0;q<4;q++)B(3,gy+0.3+q*0.35,0,1.6,0.3,1.4-q*0.3,q%2?'#8a5a30':'#6b4528');B(-1.75,gy+9.6,0,0.2,0.2,0.9,'#e8e2cc');col(0,0,1.6,1.6,gy+9.3);return null}});
