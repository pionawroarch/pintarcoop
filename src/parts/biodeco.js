    // ===== v103: dekoracje nowych biomów (8 vox = 1 m) =====
    // 53 pływająca wyspa: odwrócony stożek skalny z darnią, drzewkiem, pnączami i wodospadem — unosi się ~14 m nad ziemią
    {const Y=112,RK='#7a7068',RK2='#8a8076',DR='#5a3a22',GRS='#5aa03a',GR2='#6ab048';for(let k=0;k<7;k++){const r=30-k*4.2,y=Y-k*6;P(-r,y,-r*0.9,r*2,6,r*1.8,k%2?RK:RK2)}P(-31,Y+6,-28,62,3,56,DR);P(-31,Y+9,-28,62,2,56,GRS);for(const [x,z,w,d] of [[-20,-14,14,10],[6,4,16,12],[-8,12,10,8]])P(x,Y+11,z,w,1,d,GR2);
     P(-2,Y+11,-10,4,22,4,'#5a3a22');P(-12,Y+30,-20,24,10,22,'#3f8a3a');P(-7,Y+40,-15,14,6,12,'#4a9a42');P(14,Y+11,10,6,5,6,'#4a8a32');P(-22,Y+11,6,4,3,4,'#e8c040');P(18,Y+11,-16,3,3,3,'#d870c0');
     for(const [x,z,l] of [[-24,-6,26],[20,-12,34],[8,22,22],[-10,-24,30],[26,8,18]])for(let k=0;k<l;k+=3)P(x+(k%6?1:0),Y-k,z,1.4,3,1.4,k%9?'#3a7a2a':'#5aa03a');
     for(let k=0;k<Y+8;k+=4){const bb=[28,Y+8-k,-2,3,4,6,k%8?'#a8d8f8':'#d8f0ff'];bb.nc=1;G.push(bb)}P(24,0,-6,14,1,14,'#a8d8f8');OBJGEO.floatisle=mk([[[RK,RK2,'#6a6058'],'stone']])}
    // 54 martwe drzewo: szary skręcony pień, nagie konary, dziupla
    {const A='#4a4440',B='#5a544e',C2='#3a3430';P(-3,0,-3,6,4,6,C2);P(-2.4,4,-2.4,4.8,26,4.8,A);P(-2,30,-2,4,10,4,B);P(2,18,-1,10,2.4,2.4,A);P(10,18,-1,2.4,10,2.4,B);P(10,28,-1,6,2,2,A);P(-12,24,-1,10,2.4,2.4,A);P(-12,26,-1,2.4,8,2.4,B);P(-16,33,-1,5,2,2,A);P(-1,36,1,2,2,10,A);P(-1,37,10,2,7,2,B);P(-1,34,-10,2,2,9,A);P(-1,36,-11,2,6,2,B);P(-1,12,2.3,2,3,0.4,'#120e0c');
     for(const [x,z] of [[4,3],[-4,-3],[3,-4]])P(x,0,z,3,1.4,2,C2);OBJGEO.deadtree=mk([[[A,B,C2],'wood']])}
    // 55 gejzer: stożek z osadów mineralnych, kolorowe baseny tarasowe, kolumna pary
    {const M1='#e8dcc0',M2='#d8a860',M3='#c87a3a',W1='#5ac0c8';P(-26,0,-26,52,1,52,M2);P(-20,1,-20,40,1.4,40,M1);P(-14,2.4,-14,28,2,28,M2);P(-9,4.4,-9,18,3,18,M1);P(-5,7.4,-5,10,3,10,M3);P(-3,10.4,-3,6,0.6,6,'#3a8a9a');
     for(const [x,z,w] of [[-22,-4,8],[14,8,9],[-6,16,7],[6,-20,8]]){P(x,1,z,w,1.2,w,M3);P(x+1,1.5,z+1,w-2,0.8,w-2,W1)}/* v158: kolumna pary/wody animowana cząstkami (27_efekty) */OBJGEO.geyser=mk([[[M1,M2,M3],'stone']])}
    // 56 dynia z liśćmi i wąsem
    {P(-4,0,-4,8,6,8,'#e07a1a');P(-4.4,1,-2,8.8,4,4,'#d06a10');P(-2,1,-4.4,4,4,8.8,'#d06a10');P(-0.6,6,-0.6,1.2,2.4,1.2,'#5a7a2a');P(1,6,-1,4,0.6,3,'#4a8a32');P(-6,0,2,4,0.6,3,'#4a8a32');OBJGEO.pumpkin=mk()}
    // 57 strach na wróble: krzyż z kijów, słomiany kapelusz, łachmany, wrona
    {P(-0.6,0,-0.6,1.2,18,1.2,'#6b4a2b');P(-8,13,-0.5,16,1,1,'#6b4a2b');P(-3,9,-1.6,6,7,3.2,'#8a5a3a');P(-3.6,10,-1.8,1.2,6,3.6,'#6a7a3a');P(-2,16,-2,4,4,4,'#d8c070');P(-4,20,-4,8,0.8,8,'#c8a858');P(-2,20.8,-2,4,2.4,4,'#b89848');P(-9,12,-0.8,2,3,1.6,'#d8c070');P(7,12,-0.8,2,3,1.6,'#d8c070');for(const dx of [-1,0.6])P(dx,17.4,2,0.6,0.6,0.2,'#1a1410');P(5,14,-0.8,2.4,1.6,1.6,'#1a1a1e');P(6.6,14.6,-0.4,1,0.6,0.6,'#d8a020');OBJGEO.scarecrow=mk()}
    // 58 stóg siana z widłami
    {const H1='#d8b850',H2='#c8a840',H3='#e8c860';for(let k=0;k<6;k++){const r=14-k*2.2;P(-r,k*4,-r,r*2,4,r*2,k%2?H1:H2)}P(-2,24,-2,4,2,4,H3);P(10,0,6,0.8,16,0.8,'#6b4a2b');P(9.4,15,5.4,2,0.4,2,'#8a8f94');OBJGEO.haystack=mk([[[H1,H2,H3],'wood']])}
    // 59 bryła lodu z zamrożonym stworem w środku
    {const I1='#bfe4f4',I2='#a8d4ec',I3='#d8f0fa';P(-14,0,-12,28,20,24,I2);P(-12,20,-10,22,8,20,I1);P(-6,28,-6,10,6,10,I3);P(-5,4,-13,10,12,0.6,'#3a3a40');P(-3,6,-13.2,6,6,0.6,'#6a5a4a');P(-1,13,-13.3,2,1,0.4,'#ff4a4a');P(2,13,-13.3,2,1,0.4,'#ff4a4a');for(const [x,z,h] of [[16,4,14],[-18,-6,10],[8,14,18]])P(x,0,z,4,h,4,I3);OBJGEO.iceblock=mk([[[I1,I2,I3],'stone']])}
    // 60 skała otchłani: czarny monolit z fioletowymi żyłami, lewitujące odłamki
    {const D1='#1a1220',D2='#2a1a34';P(-8,0,-8,16,30,16,D1);P(-6,30,-6,12,14,12,D2);P(-3,44,-3,6,10,6,D1);for(const [x,y,z,w,h,d] of [[-8.4,6,-2,0.6,18,1.2],[7.8,12,3,0.6,22,1.2],[-2,20,7.8,1.2,16,0.6],[3,4,-8.4,1.2,20,0.6]])P(x,y,z,w,h,d,'#b860ff');for(const [x,y,z,s] of [[-14,40,4,4],[12,52,-6,5],[2,64,10,3],[-6,58,-12,3]]){P(x,y,z,s,s,s,D2);P(x+s/4,y+s/4,z+s/4,s/2,s/2,s/2,'#d898ff')}OBJGEO.voidrock=mk([[[D1,D2],'stone']])}
    // 61 chata na palach w delcie: pomost, trzcinowy dach, sieci i łódka
    {const WD2='#7a5a38',WD3='#5a4028',TH='#b8a060';for(const [x,z] of [[-12,-10],[12,-10],[-12,10],[12,10],[0,-10],[0,10]])P(x-1,0,z-1,2,16,2,WD3);P(-16,16,-14,32,1.6,28,WD2);P(-12,17.6,-10,24,14,20,'#8a6a44');P(-16,31.6,-14,32,2,28,TH);P(-13,33.6,-11,26,2,22,'#c8b070');P(-10,35.6,-8,20,2,16,TH);P(-6,37.6,-4,12,2,8,'#c8b070');
     P(-2,17.6,9.6,4,8,0.6,'#3a2414');P(-9,23,9.6,4,4,0.6,'#ffcf6a');P(5,23,9.6,4,4,0.6,'#ffcf6a');P(-3,4,14,6,0.8,14,WD2);for(let k=0;k<6;k++)P(-3,4+k*2.2,14+k*0.4,6,0.8,1.2,WD3);P(10,0,16,4,2,14,'#8a5a30');P(10.6,1.6,17,2.8,0.4,12,'#5a3a22');for(let k=0;k<5;k++)P(-16,18+k*2,-14.2,0.3,2,8,'#c8b890');OBJGEO.stilthut=mk([[[WD2,WD3,'#8a6a44'],'wood']])}
    // 62 słup mostu linowego z liną i deskami urwanymi nad krawędzią wąwozu
    {P(-6,0,-1,2,22,2,'#5a4028');P(4,0,-1,2,22,2,'#5a4028');P(-6,22,-1.2,12,1.4,2.4,'#6b4a2b');for(let k=0;k<6;k++)P(-4,1+k*0.15,2+k*4,8,0.8,3.4,k%2?'#8a6240':'#7a5532');for(const x of [-5,5])for(let k=0;k<6;k++)P(x-0.3,8-k*0.6,2+k*4,0.6,0.6,4,'#c8b080');OBJGEO.ropepost=mk([[[ '#5a4028','#6b4a2b'],'wood']])}
    // 63 kamień runiczny: menhir z wyrytymi świecącymi runami i mchem
    {const R1='#6e6a70',R2='#5a565c';P(-5,0,-3,10,26,6,R1);P(-4,26,-2.5,8,6,5,R2);P(-3,32,-2,5,3,4,R1);for(let k=0;k<6;k++)P(-2+(k%2)*2,4+k*4,3,1.4,2.4,0.4,'#7ad8ff');P(-6,0,-4,12,2,8,'#5a7a3a');P(3,6,-3.4,3,5,0.6,'#5a7a3a');OBJGEO.runestone=mk([[[R1,R2],'stone']])}
    // 64 odłamek otchłani (mały, świecący)
    {P(-1.5,0,-1.5,3,9,3,'#2a1a34');P(-0.8,9,-0.8,1.6,4,1.6,'#c890ff');P(2,0,1,2,5,2,'#1a1220');P(2.4,5,1.4,1.2,2,1.2,'#b860ff');OBJGEO.voidshard=mk()}
    // 65 suchy krzak z kolcami
    {for(const [x,z,h] of [[-3,0,8],[2,-2,10],[0,3,7],[3,2,6],[-2,-3,9]]){P(x-0.4,0,z-0.4,0.8,h,0.8,'#5a4a3a');P(x-2,h-2,z-0.3,4,0.6,0.6,'#4a3a2a')}OBJGEO.deadbush=mk()}
    // ===== v105: dekoracje kolejnych biomów =====
    // 66 łuk skalny z czerwonego piaskowca (warstwy)
    {const R=['#b8552e','#c8663a','#a84a28','#d87a48'];for(const sx of [-1,1])for(let y=0;y<56;y+=4){const w=14-Math.abs(y-20)*0.12;P(sx*26-w/2+(y>40?-sx*(y-40)*0.4:0),y,-7,w,4,14,R[(y/4)%4])}for(let x=-30;x<=30;x+=4){const yy=56+Math.cos(x/30*1.4)*6;P(x-2,yy,-6,4,6,12,R[((x+30)/4)%4])}OBJGEO.redarch=mk([[R,'stone']])}
    // 67 meteoryt: czarna bryła z żarzącymi się szczelinami w odłamkach
    {const M1='#2a2422',M2='#3a302c';P(-14,0,-12,28,16,24,M1);P(-10,16,-9,20,8,18,M2);P(-6,24,-5,10,4,10,M1);for(const [x,y,z,w,h,d] of [[-14.4,4,-2,0.6,9,1.4],[13.8,6,3,0.6,7,1.4],[-3,3,11.8,1.4,10,0.6],[4,10,-12.4,1.4,6,0.6],[-2,16.2,-2,6,0.6,1.4]])P(x,y,z,w,h,d,'#ff7a1a');for(const [x,z] of [[-22,8],[18,-14],[20,12],[-18,-16]]){P(x,0,z,5,4,5,M2);P(x+1,4,z+1,2,1,2,'#ff9a3a')}OBJGEO.meteor=mk([[[M1,M2],'stone']])}
    // 68 drzewo bursztynowe: jasny pień, złoto-pomarańczowa korona z kroplami żywicy
    {const T1='#7a5a3a',T2='#8a6a48',L1='#e0a030',L2='#f0c048',L3='#c87a20';P(-2.5,0,-2.5,5,30,5,T1);P(-1.5,10,1.6,3,3,1,'#f4b030');P(1.6,18,-1,1,3,2,'#f4b030');P(2,20,-1,10,2.6,2.6,T2);P(-11,23,-1,10,2.6,2.6,T2);P(-14,28,-14,28,12,28,L1);P(-11,40,-11,22,8,22,L2);P(-6,48,-6,12,5,12,L1);P(10,24,-6,10,8,10,L3);P(-18,26,0,10,8,10,L2);P(-4,24,8,10,8,10,L3);for(const [x,z] of [[-12,-12],[10,10],[12,-10],[-10,10]])P(x,30,z,3,2,3,'#ffd060');OBJGEO.ambertree=mk([[[T1,T2],'wood']])}
    // 69 drzewo krwawe: czarny pień, karmazynowe liście, czerwony sok spływający po korze
    {const T1='#2a1a18',T2='#3a2420',L1='#8a1a1a',L2='#a82a22',L3='#6a1010';P(-2.5,0,-2.5,5,26,5,T1);P(-0.5,8,2.5,1,8,0.4,'#7a0a0a');P(2.5,12,0,0.4,6,1,'#7a0a0a');P(2,16,-1,12,2.4,2.4,T2);P(12,16,-1,2.4,8,2.4,T1);P(-13,20,-1,12,2.4,2.4,T2);P(-13,20,-1,2.4,8,2.4,T1);P(-12,24,-12,24,10,24,L1);P(-9,34,-9,18,7,18,L2);P(-5,41,-5,10,4,10,L1);P(9,22,-5,9,7,9,L3);P(-18,24,-4,9,7,9,L3);for(let k=0;k<6;k++)P(-10+k*4,22,(k%2?8:-10),0.8,3+k%3,0.8,L2);OBJGEO.bloodtree=mk([[[T1,T2],'wood']])}
    // 70 olbrzymi świecący grzyb: biały trzon, turkusowy kapelusz z kropkami, blaszki
    {const GP={st:'#e4e6f0',st2:'#c4ccd8',ring:'#f2f6fc',ring2:'#d8e0ea',gill:'#7af4f4',gill2:'#c8ffff',c1:'#24c0c4',c2:'#1aa2aa',c3:'#14808a',sp:'#d8ffff',sp2:'#a8fcff'},A=shroomL(4.7,GP,{sh:5.4,sw:0.95,seed:21});G.push(...A.L);for(const [x,z,kk,sd] of [[13,7,1.5,2],[-15,8,1.1,4],[8,-15,1.3,6]])G.push(...shroomL(kk,GP,{x,z,sh:4.6,sw:1.1,seed:sd}).L);OBJGEO.glowshroom=mk();OBJGEO.glowshroom.userData.cb=A.CB}
    // 71 olbrzymi kwiat (różowy) i 72 (słonecznik)
    {P(-1,0,-1,2,40,2,'#4a8a32');P(1,14,-1,8,1,4,'#5aa040');P(-9,24,-1,8,1,4,'#5aa040');const C='#e86a9a',C2='#f08ab0';for(let q=0;q<8;q++){const a=q/8*Math.PI*2,x=Math.cos(a)*7,z=Math.sin(a)*7;P(x-4,40,z-4,8,1.5,8,q%2?C:C2)}P(-4,40.5,-4,8,3,8,'#f0d040');P(-2,43,-2,4,1,4,'#e8a020');OBJGEO.giantflower=mk()}
    {P(-1.2,0,-1.2,2.4,46,2.4,'#5a9a3a');P(1,18,-1,10,1,5,'#4a8a32');P(-11,28,-1,10,1,5,'#4a8a32');for(let q=0;q<12;q++){const a=q/12*Math.PI*2,x=Math.cos(a)*8.5,z=Math.sin(a)*8.5;P(x-2.5,44,z-2.5,5,1.2,5,q%2?'#f0c020':'#f8d840')}P(-6,44.4,-6,12,2.4,12,'#5a3a1a');for(let k=0;k<6;k++)P(-5+(k%3)*4,46.8,-4+Math.floor(k/3)*6,2,0.6,2,'#3a2410');OBJGEO.giantflower2=mk()}
    // 73 kolumny bazaltowe (sześciokątne słupy różnej wysokości)
    {const B1='#2a2a2e',B2='#36363c',B3='#22222a';for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const h=6+((i*7+j*13+50)%6)*4;const x=i*5+(j%2?2.5:0),z=j*4.4;P(x-2.3,0,z-2,4.6,h,4,[B1,B2,B3][(i+j+6)%3]);P(x-2.3,h,z-2,4.6,0.4,4,'#4a4a52')}OBJGEO.basaltcol=mk([[[B1,B2,B3],'stone']])}
    // 74 świecąca trzcina, 75 czerwona iglica skalna (hoodoo)
    {for(const [x,z,h] of [[-2,0,14],[1,-2,18],[2,2,12],[-1,3,16],[3,0,10]]){P(x-0.4,0,z-0.4,0.8,h,0.8,'#1a5a5a');P(x-0.8,h,z-0.8,1.6,3,1.6,'#4ae8d8')}OBJGEO.glowreed=mk()}
    {const R=['#b8552e','#c8663a','#a84a28'];for(let y=0;y<60;y+=5){const w=10-y*0.09+Math.sin(y)*1.2;P(-w/2,y,-w/2,w,5,w,R[(y/5)%3])}P(-7,60,-7,14,4,14,'#7a6a5a');OBJGEO.hoodoo=mk([[R,'stone']])}
    // ===== v113: dekoracje 12 nowych biomów =====
    // 76 czaszka tytana: sklepienie czaszki z szwami, głębokie oczodoły, łuki brwiowe, nos, szczęka z zębami, skręcony róg, pęknięcia, mech i pnącza, żebro i kręgi obok
    {const SK='#d8d0bc',SK2='#c8bea8',SK3='#b8ae98',SK4='#e4dccA'.toLowerCase(),DK='#1a1612',DK2='#2a221c',MS='#5a7a3a',MS2='#6a8a42',CR='#8a8070';
     P(-38,0,-34,76,3,68,'#8a8070');for(const [x,z,w,d] of [[-36,-30,18,10],[18,-32,16,12],[-30,26,12,10],[24,20,14,12]])P(x,2,z,w,2.4,d,CR);
     for(let k=0;k<7;k++){const s2=1-k*0.11,w=60*s2,d=52*s2;P(-w/2,3+k*6,-d/2-2,w,6,d,k%2?SK:SK2)}P(-16,45,-14,32,5,24,SK4);P(-10,50,-9,20,3,14,SK);
     for(const [x,y,z,w,h,d] of [[-1,30,-26,2,22,0.6],[-1,44,-14,2,0.6,24],[-22,24,-20,0.6,18,16],[21.4,24,-20,0.6,18,16],[-12,40,-24,24,0.6,1]])P(x,y,z,w,h,d,SK3);
     for(const sx of [-1,1]){const ex=sx<0?-24:6;P(ex-1,27,21,20,4,5,SK2);P(ex,14,22.6,18,13,3,DK);P(ex+2,12,22.4,14,2,3,DK);P(ex+3,16,24.8,12,9,0.6,DK2);P(ex+6,18,25.2,6,5,0.4,'#3a1a10')}
     P(-5,6,22.6,10,8,3,DK);P(-3,4,22.6,6,2,3,DK);P(-6,14,22,12,2,4,SK2);P(-28,0,20,56,6,7,SK3);for(let k=0;k<11;k++){const x=-25+k*4.8,tall=k%3===1?7.6:6;P(x,6-tall+6,26.4,3.4,tall,2.4,k%2?'#efe8d6':'#e4dcc8')}
     P(-26,-1,30,52,5,6,SK3);for(let k=0;k<10;k++)P(-23+k*4.8,3.6,30.6,3.2,4,2,'#e8e0cc');
     let hx=26,hy=34,hz=-6;for(let k=0;k<14;k++){const w=9-k*0.55;P(hx,hy,hz,w,5.6,w,k%3===2?SK3:k%2?SK2:SK);hx+=3.2+k*0.1;hy+=4.6-k*0.3;hz+=Math.sin(k*0.7)*1.6}P(hx,hy,hz,2,4,2,'#f4eedc');
     P(-34,22,-8,10,8,10,SK3);P(-40,26,-6,7,6,7,SK2);P(-44,30,-5,5,4,5,SK);
     for(const [x,y,z,w,h,d] of [[-20,49,-12,18,1.6,14],[8,40,-26,12,2,8],[24,8,-22,10,10,1.4],[-30,8,14,1.4,12,8],[2,47,4,8,1.2,10]])P(x,y,z,w,h,d,MS);for(let k=0;k<8;k++){const x=-24+k*7;P(x,30-k%3*4,24.6,1.2,10+k%4*3,1.2,MS2);P(x-1,24-k%3*4,25,3,2,1,'#e8c84a')}
     for(let k=0;k<6;k++)P(34+k*5,0,10+Math.sin(k)*3,5,7-k*0.6,6,k%2?SK:SK2);for(let k=0;k<5;k++){const a=0.5+k*0.22;P(-46-k*2,0,-28+k*12,3.4,20+k*2,3.4,SK2);P(-46-k*2,20+k*2,-28+k*12,12,3,3.4,SK3)}
     OBJGEO.titanskull=mk([[[SK,SK2,SK3,SK4,'#efe8d6','#e4dcc8','#e8e0cc','#f4eedc'],'bone']])}
    // 77 miecz tytana: szeroka głownia ze zbroczem i wyszczerbieniami, rdza, jelec z czaszkami, owinięta rękojeść, głowica z klejnotem, gruz, porzucony hełm i chorągiew
    {const ST='#8a8e94',ST2='#a8aeb4',ST3='#6e7278',RS='#8a4a2a',RS2='#a85a30',GD='#b8902a',GD2='#d8b040',LT='#4a3020',LT2='#2a1a10';
     P(-18,0,-16,36,3,32,'#7a7068');for(const [x,z,w,h] of [[-14,6,7,6],[8,-12,6,5],[11,8,5,7],[-10,-12,8,4],[2,12,4,3]])P(x,0,z,w,h,w,'#6a6058');for(let k=0;k<6;k++)P(-6+k*2.2,3,-4.6+(k%2)*8.4,2,1.4-k*0.15,1.6,'#5a5048');
     for(let y=3;y<66;y+=3){const nk=(y*7)%11<2?1.2:0;P(-5+nk,y,-1.6,10-nk,3,3.2,(y/3)%4===1?ST2:ST)}P(-1,3,-1.9,2,60,3.8,ST3);P(-0.4,3,-2.1,0.8,58,4.2,'#55595e');
     for(const [y,h,x] of [[10,5,-5.2],[22,7,2.6],[36,4,-5.2],[48,6,2.8],[58,3,-4]])P(x,y,-1.7,2.6,h,3.4,y%2?RS:RS2);for(let k=0;k<5;k++)P(-5.4,8+k*11,-1.7,0.6,2,3.4,'#5a5048');
     P(-20,66,-3.4,40,4,6.8,GD);P(-22,65,-3.8,4,7,7.6,GD2);P(18,65,-3.8,4,7,7.6,GD2);for(const sx of [-1,1]){P(sx*24-2.4,64.6,-2.6,4.8,4.8,5.2,'#d8d0bc');P(sx*24-1.6,66,2.6,1.2,1.2,0.3,'#1a1612');P(sx*24+0.4,66,2.6,1.2,1.2,0.3,'#1a1612')}P(-3,64,-3.6,6,8,7.2,GD2);P(-1.2,66.4,3.6,2.4,2.4,0.4,'#c8302a');
     P(-2.2,70,-2.2,4.4,22,4.4,LT);for(let y=71;y<92;y+=2.4){P(-2.6,y,-2.6,5.2,1,5.2,LT2);P(-2.5,y+1.2,-2.5,5,0.6,5,'#6a4a2a')}P(-4.4,92,-4.4,8.8,6,8.8,GD);P(-3.4,98,-3.4,6.8,2,6.8,GD2);P(-1.4,94,4.4,2.8,2.8,0.6,'#3a8ac8');P(-1.4,94,-5,2.8,2.8,0.6,'#3a8ac8');P(-0.8,100,-0.8,1.6,1.6,1.6,'#c8302a');
     P(9,3,6,6,4,6,'#7a7e84');P(9.5,7,6.5,5,1.6,5,'#6a6e74');P(10,5,12.1,4,1,0.3,'#1a1612');P(-14,3,-8,0.8,22,0.8,'#4a3020');P(-14,16,-8,0.4,7,6,'#7a1f1f');P(-14,17,-8,0.5,3,6,'#c9a24a');
     OBJGEO.titanblade=mk([[[ST,ST2,ST3,'#55595e','#7a7e84'],'metal'],[[GD,GD2],'metal']])}
    // 78 skamieniałe drzewo: spękany kamienny pień z korzeniami, rozgałęzienia, kryształowe kiście w trzech barwach ze szpicami, odłamki u stóp
    {const T1='#6e6c72',T2='#7e7c82',T3='#5e5c62',C1='#9ae0e8',C2='#c8a8f0',C3='#e8f8ff',C4='#7ac8e0';
     P(-3,0,-3,6,30,6,T1);P(-4,0,-4,8,5,8,T2);for(const [x,z,w,d] of [[3,-1,6,2],[-9,-1,6,2],[-1,3,2,6],[-1,-9,2,6]])P(x,0,z,w,2.4,d,T3);for(let y=4;y<28;y+=5)P(-3.2,y,-1+(y%3),6.4,0.5,0.4,T3);
     P(2,14,-1,10,2.6,2.6,T2);P(10,14,-1,2.6,9,2.6,T1);P(10,22,-1,6,2,2,T2);P(-12,18,-1,10,2.6,2.6,T2);P(-12,18,-1,2.6,8,2.6,T1);P(-16,25,-1,5,2,2,T2);P(-1,26,1,2.6,2.6,10,T2);P(-1,26,10,2.6,7,2.6,T1);P(-1,30,-10,2.6,2.6,9,T2);
     for(const [x,y,z,s,c] of [[-6,30,-6,12,C1],[-4,40,-4,8,C3],[13,22,-4,8,C2],[-19,26,-4,8,C1],[-4,32,10,8,C2],[12,30,3,6,C4],[-11,35,4,6,C2],[-4,32,-14,7,C4]]){P(x,y,z,s,s*0.6,s,c);P(x+s*0.2,y+s*0.6,z+s*0.2,s*0.6,s*0.4,s*0.6,C3);for(const [ax,az] of [[0.1,0.1],[0.75,0.2],[0.3,0.75]])P(x+s*ax,y+s*0.9,z+s*az,s*0.18,s*0.5,s*0.18,c);P(x+s*0.4,y-s*0.25,z+s*0.4,s*0.15,s*0.3,s*0.15,c)}
     for(const [x,z,h,c] of [[6,5,4,C1],[-7,6,3,C2],[5,-7,5,C4]]){P(x,0,z,1.4,h,1.4,c);P(x+0.3,h,z+0.3,0.8,1.4,0.8,C3)}OBJGEO.stonetree=mk([[[T1,T2,T3],'stone'],[[C1,C2,C3,C4],'crystal']])}
    // 79 solny filar
    {const W1='#f4f2ee',W2='#e8e4dc',P1='#f0d8d8',B1='#d8e8f0';let y=0;for(let k=0;k<9;k++){const w=12-k*0.9+Math.sin(k*1.7)*1.6,ox=Math.sin(k*2.1)*1.4,h=3+(k%3);P(ox-w/2,y,-w/2+Math.cos(k)*1.2,w,h,w,[W1,W2,P1,W1,B1][k%5]);y+=h}P(-8,0,-8,16,1,16,W2);for(const [x,z] of [[7,3],[-8,-5],[3,-8]])P(x,0,z,3,4,3,W1);OBJGEO.saltpillar=mk([[[W1,W2,P1,B1],'crystal']])}
    // 80 kłąb chmury (bez kolizji)
    {for(const [x,y,z,w,h,d,c] of [[-14,0,-8,28,6,16,'#f4f6fa'],[-10,5,-6,18,6,12,'#ffffff'],[-2,3,-10,14,7,14,'#eef2f8'],[-18,2,-2,10,5,10,'#e8ecf4'],[6,1,2,12,5,10,'#f8faff'],[-4,9,-4,8,4,8,'#ffffff']]){const bb=[x,y,z,w,h,d,c];bb.nc=1;G.push(bb)}OBJGEO.cloudpuff=mk()}
    // 81 tęczowa skała w pasy
    {const R=['#c84a3a','#e07a3a','#e8b84a','#d8d0a0','#5aa88a','#6a7ac8','#a86ab8'];let y=0;for(let k=0;k<14;k++){const w=16-k*0.8+Math.sin(k*1.3)*1.4,h=3;P(-w/2,y,-w/2*0.8,w,h,w*0.8,R[k%7]);y+=h}P(-6,y,-5,12,3,10,R[0]);OBJGEO.rainbowrock=mk([[R,'stone']])}
    // 82 smołowa kałuża z bąblami i zatopioną gałęzią
    {const K1='#141210',K2='#1e1a16',K3='#2a2420';P(-14,0,-12,28,1.2,24,K1);P(-10,1.2,-8,20,1,16,K2);for(const [x,z,s] of [[-4,-2,3],[3,3,2.4],[6,-4,1.8],[-7,4,2],[0,6,1.4]])P(x,1.6,z,s,s*0.7,s,K3);P(8,0,6,2,12,2,'#3a2e24');P(8,10,6,6,1.6,1.6,'#3a2e24');P(-12,0,-10,4,3,3,'#3a2e24');OBJGEO.tarpit=mk([[[K1,K2,K3],'stone']])}
    // 83 drzewo latarni: skręcony pień z korzeniami, warstwowa korona z prześwitami, latarnie z daszkami i ramkami na łańcuszkach, świetliki
    {const T1='#3a2a1e',T2='#4a3626',T3='#2e2018',L1='#2a4a24',L2='#34582c',L3='#3e6634',L4='#24401e',LA='#ffc850',LB='#ff9a3a',FR='#2a2420';
     for(let y=0;y<30;y+=3){const o=Math.sin(y*0.15)*0.8;P(-3+o,y,-3,6,3,6,y%6?T1:T3)}for(const [x,z,w,d] of [[3,-1,6,2],[-9,-1,6,2],[-1,3,2,7],[-1,-10,2,7]])P(x,0,z,w,2,d,T2);
     P(2,18,-1,11,2.4,2.4,T2);P(12,18,-1,2.4,6,2.4,T1);P(-13,22,-1,11,2.4,2.4,T2);P(-13,22,-1,2.4,5,2.4,T1);P(-1,24,2,2.4,2.4,10,T2);P(-1,26,-12,2.4,2.4,11,T2);
     P(-17,28,-17,34,6,34,L4);P(-16,34,-16,32,7,32,L1);P(-12,41,-12,24,7,24,L2);P(-7,48,-7,14,5,14,L3);P(-3,53,-3,6,3,6,L2);for(const [x,z,w] of [[10,-10,10],[-22,-4,10],[-6,12,11],[8,8,9],[-14,-18,9]])P(x,26,z,w,8,w,[L2,L3,L1][Math.abs(x+z)%3]);
     for(const [x,z] of [[-17,-6],[17,4],[-2,-17],[4,17],[-12,15],[13,-14]])P(x,30,z,1,1,1,L4);
     for(const [x,z,l] of [[-14,-14,6],[12,-12,8],[-12,12,5],[13,12,7],[0,-15,9],[-15,0,6],[15,0,5],[2,15,8],[-6,-8,4],[7,6,5]]){const c=(Math.abs(x)+Math.abs(z))%2?LA:LB;P(x+0.35,28-l,z+0.35,0.3,l,0.3,FR);P(x-0.8,28-l-0.6,z-0.8,2.2,0.6,2.2,'#3a2a1e');P(x-0.4,28-l-1.2,z-0.4,1.4,0.6,1.4,'#3a2a1e');P(x-0.6,28-l-4,z-0.6,1.8,3,1.8,c);for(const [ax,az] of [[-0.7,-0.7],[0.9,-0.7],[-0.7,0.9],[0.9,0.9]])P(x+ax,28-l-4.2,z+az,0.25,3.4,0.25,FR);P(x-0.7,28-l-4.6,z-0.7,2,0.6,2,'#3a2a1e')}
     for(let k=0;k<6;k++)P(-12+k*5,10+k*3,(k%2?9:-9),0.5,0.5,0.5,'#fff4a0');OBJGEO.lanterntree=mk([[[T1,T2,T3],'wood']])}
    // 84 szronowe drzewo: srebrzysta kora, gałęzie, warstwy szronu z nawisami śniegu i soplami, lodowe kryształki, zaspy
    {const T1='#c8d4dc',T2='#a8b8c4',T3='#98a8b4',F1='#e8f4fc',F2='#c8e4f4',F3='#ffffff',IC='#b8e0f8';P(-2.5,0,-2.5,5,26,5,T2);for(let y=3;y<24;y+=4)P(-2.7,y,-1,5.4,0.6,2,T3);P(-4,0,-4,8,2.4,8,F3);for(const [x,z] of [[4,2],[-6,3],[2,-6]])P(x,0,z,4,1.6,3,F1);
     P(2,14,-1,9,2,2,T1);P(9,14,-1,2,6,2,T2);P(-11,18,-1,9,2,2,T1);P(-11,18,-1,2,5,2,T2);P(-1,20,2,2,2,8,T1);
     for(let k=0;k<7;k++){const s2=28-k*3.8,y=12+k*5.4;P(-s2/2,y,-s2/2,s2,3.6,s2,k%2?F1:F2);P(-s2/2-1,y+3.4,-s2/2-1,s2+2,1,s2+2,F3);for(let q=0;q<8;q++){const a=q*Math.PI/4+k*0.4,r=s2/2+0.2;P(Math.cos(a)*r-0.4,y-2.4-(q%3),Math.sin(a)*r-0.4,0.8,2.4+(q%3),0.8,IC)}}
     P(-1,50,-1,2,5,2,F3);P(-0.5,55,-0.5,1,2,1,IC);for(const [x,y,z] of [[8,22,6],[-9,30,-5],[5,36,-6],[-6,18,8]])P(x,y,z,1.2,1.2,1.2,'#e0f4ff');OBJGEO.frosttree=mk([[[T1,T2,T3],'wood'],[[F1,F2,F3,IC],'crystal']])}
    // 85 wybielony martwy koral i muszle
    {const C1='#f0ece0',C2='#e8d8d0',C3='#d8c8b8';P(-10,0,-8,20,2,16,'#c8b898');for(const [x,z,h] of [[-4,-2,14],[3,2,10],[0,-4,8],[5,-3,12]]){P(x-1,2,z-1,2,h,2,C1);P(x,2+h*0.5,z-1,5,1.4,1.4,C2);P(x+4,2+h*0.5,z-1,1.4,5,1.4,C1);P(x-5,2+h*0.7,z-1,5,1.4,1.4,C3);P(x-5,2+h*0.7,z-1,1.4,4,1.4,C2)}for(const [x,z] of [[-8,5],[7,6]])P(x,2,z,2.4,1.2,2,'#e8b8a0');OBJGEO.deadcoral=mk([[[C1,C2,C3],'bone']])}
    // 86 drzewo oplecione pajęczyną z kokonami, 87 kokony i jaja pająków
    {const T1='#2a2420',T2='#3a322a',WB='#e8e4ec',WB2='#d4d0dc';P(-2.5,0,-2.5,5,32,5,T1);P(2,16,-1,12,2.4,2.4,T2);P(12,16,-1,2.4,10,2.4,T1);P(-13,20,-1,11,2.4,2.4,T2);P(-13,20,-1,2.4,10,2.4,T1);P(-1,28,1,2.4,2.4,10,T2);
     for(const [x,y,z,w,h,d] of [[2,6,-0.2,12,12,0.2],[-12,10,0.4,12,12,0.2],[-0.2,14,2,0.2,12,10]]){const bb=[x,y,z,w,h,d,WB];bb.nc=1;G.push(bb)}
     for(const [x,y,z] of [[12,10,-0.4],[-13,12,-0.4],[-1,20,10]]){P(x-1.2,y,z-1.2,2.4,4,2.4,WB);P(x-0.2,y+4,z-0.2,0.4,2,0.4,WB2)}OBJGEO.webtree=mk([[[T1,T2],'wood']])}
    {const WB='#e8e4ec',WB2='#d4d0dc',GN='#b8c8a0';P(-8,0,-8,16,0.6,16,'#c8c4cc');for(const [x,z,s] of [[-3,-2,4],[2,2,3],[3,-4,2.6],[-4,4,3.2],[0,0,2]]){P(x-s/2,0.6,z-s/2,s,s*1.3,s,WB);P(x-s/3,0.6+s*1.3,z-s/3,s*0.66,s*0.3,s*0.66,WB2)}P(6,0,6,1,10,1,'#3a322a');P(5,4,5,3,5,3,WB);{const bb=[-8,0.6,6,14,6,0.2,WB2];bb.nc=1;G.push(bb)}OBJGEO.cocoon=mk([[[WB,WB2],'cloth']])}
    // 88 kamienna latarnia (tōrō)
    {const S1='#9a968c',S2='#8a867c',S3='#aaa69c';P(-4,0,-4,8,2,8,S2);P(-1.6,2,-1.6,3.2,8,3.2,S1);P(-3.4,10,-3.4,6.8,1.6,6.8,S2);P(-2.6,11.6,-2.6,5.2,4,5.2,S3);P(-1.6,12.4,2.62,3.2,2.4,0.1,'#ffc860');P(-1.6,12.4,-2.72,3.2,2.4,0.1,'#ffc860');P(-5,15.6,-5,10,1.6,10,S2);P(-3.6,17.2,-3.6,7.2,1.4,7.2,S1);P(-1.4,18.6,-1.4,2.8,2,2.8,S3);P(-4,0,3,4,0.8,3,'#5a8a3a');OBJGEO.stonelantern=mk([[[S1,S2,S3],'stone']])}
    // 89 olbrzymie zardzewiałe koło zębate: obręcz z zębami, piasta z nitami, sześć szprych, drugie mniejsze koło, łańcuch, piasek nawiany na dół
    {/* v151: barwy rdzy i miedzi dobrane tak, by shader nie malował na nich słojów drewna */const R1='#a24a2c',R2='#c47a44',R3='#7a3424',R4='#d08a50',MT='#5a5a5e',MT2='#4a4a50',Rr=24,cy=Rr*0.6;
     for(let i=0;i<40;i++){const a=i/40*Math.PI*2,x=Math.cos(a)*Rr,y=cy+Math.sin(a)*Rr;if(y<-2)continue;P(x-2.6,Math.max(0,y-2.6),-2.4,5.2,5.2,4.8,i%4===0?R4:i%3?R1:R2);if(i%2===0){const tx=Math.cos(a)*(Rr+4),ty=cy+Math.sin(a)*(Rr+4);if(ty>0)P(tx-2,ty-2,-1.8,4,4,3.6,R3)}}
     for(let i=0;i<6;i++){const a=i/6*Math.PI*2+0.3;for(let r=5;r<Rr-2;r+=2.6){const x=Math.cos(a)*r,y=cy+Math.sin(a)*r;if(y>0)P(x-1.3,y-1.3,-1.4,2.6,2.6,2.8,R3)}}
     P(-5,cy-5,-3.4,10,10,6.8,MT);P(-3,cy-3,-4.4,6,6,8.8,MT2);for(let k=0;k<8;k++){const a=k/8*Math.PI*2;P(Math.cos(a)*4-0.5,cy+Math.sin(a)*4-0.5,3.4,1,1,0.6,'#8a8a90')}
     const r2=10,cx2=Rr+12,cy2=r2*0.5;for(let i=0;i<20;i++){const a=i/20*Math.PI*2,x=cx2+Math.cos(a)*r2,y=cy2+Math.sin(a)*r2;if(y<-1)continue;P(x-2,Math.max(0,y-2),4,4,4,3.6,i%2?R1:R3);if(i%2===0&&y>1)P(cx2+Math.cos(a)*(r2+3)-1.4,cy2+Math.sin(a)*(r2+3)-1.4,4.4,2.8,2.8,2.8,R2)}P(cx2-2.4,cy2-2.4,3.4,4.8,4.8,5,MT);
     for(let k=0;k<10;k++)P(-Rr-14+k*2.4,0.6+(k%2)*0.4,8+Math.sin(k)*1.5,2.2,1,1.4,k%2?MT:MT2);
     P(-Rr-8,0,-10,Rr*2+28,2,20,'#6a5a46');P(-Rr-4,2,-6,14,3,12,'#7a6a52');P(Rr-4,2,-8,10,2.4,14,'#7a6a52');for(const [x,z] of [[-20,8],[18,-8],[10,9]])P(x,0,z,5,3,4,'#4a3a2a');
     OBJGEO.gear=mk([[[R1,R2,R3,R4,MT,MT2],'metal']])}
    // 90 rury: dwa pionowe kominy z kołnierzami, poziomy przewód z kolanami, manometr, koło zaworu, nity, kałuża oleju, para (bez kolizji)
    {const R1='#b86a3a',R2='#c47a44',R3='#7a3424',MT='#4a4a50',MT2='#5a5a62',VR='#c8302a';
     for(const sx of [-1,1]){for(let y=0;y<26;y+=6.5)P(sx*10-2,y,-2,4,6.5,4,y%13?R1:R2);for(let y=0;y<26;y+=6.5)P(sx*10-2.5,y,-2.5,5,0.8,5,MT2);P(sx*10-3,0,-3,6,2,6,MT)}
     P(-12,24,-2,24,4,4,R1);for(let x=-10;x<10;x+=4)P(x,23.6,-2.5,0.8,4.8,5,MT2);P(-12.6,23,-2.6,4.2,6,5.2,MT);P(8.4,23,-2.6,4.2,6,5.2,MT);
     P(-1,28,-1,2,4,2,MT);P(-3.4,32,-0.5,6.8,0.8,1,VR);P(-0.5,29.6,-3.4,1,5.6,0.8,VR);P(-0.6,32,-0.6,1.2,0.8,1.2,'#e8c040');
     P(4,18,1.8,3,3,1,'#2a2a2e');P(4.3,18.3,2.6,2.4,2.4,0.3,'#f4f0e6');P(5.3,19.2,2.95,0.3,1.2,0.1,'#c8302a');P(4.8,21,1.9,1,1.6,0.8,MT);
     P(-8,8,-6,2,2,4,R3);P(-8,0,-10,2,10,2,R3);P(-14,0,-8,28,0.6,14,'#5a4a3a');P(2,0.6,4,8,0.2,5,'#141210');
     /* v151: para jako nieregularne kłęby zamiast schodkowej kolumny */{const PU=(x,y,z,r,c)=>{for(const [ox,oy,oz,k] of [[0,0,0,1],[r*0.45,r*0.25,r*0.2,0.7],[-r*0.4,r*0.35,-r*0.25,0.65],[r*0.1,r*0.6,-r*0.35,0.55]]){const w=r*k;const bb=[x+ox-w/2,y+oy,z+oz-w/2,w,w*0.8,w,c];bb.nc=1;G.push(bb)}};/* v158: para animowana cząstkami */void PU}OBJGEO.pipe=mk([[[R1,R2,R3,MT,MT2],'metal']])}
