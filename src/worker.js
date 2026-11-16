// ===== Generator świata (Web Worker) =====
const C = 32, WATER = 24, MAXH = 200, B = 4; // B = margines próbek wokół chunka
let SEED = -1, perm = new Uint8Array(512);

function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function setSeed(s){
  if(s===SEED)return; SEED=s;
  const r=mulberry(s), p=new Uint8Array(256);
  for(let i=0;i<256;i++)p[i]=i;
  for(let i=255;i>0;i--){const j=Math.floor(r()*(i+1));const t=p[i];p[i]=p[j];p[j]=t}
  for(let i=0;i<512;i++)perm[i]=p[i&255];
}
const G=[[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
const F2=0.5*(Math.sqrt(3)-1), G2=(3-Math.sqrt(3))/6;
function simplex(x,y){
  const s=(x+y)*F2, i=Math.floor(x+s), j=Math.floor(y+s), t=(i+j)*G2;
  const x0=x-(i-t), y0=y-(j-t), i1=x0>y0?1:0, j1=x0>y0?0:1;
  const x1=x0-i1+G2, y1=y0-j1+G2, x2=x0-1+2*G2, y2=y0-1+2*G2;
  const ii=i&255, jj=j&255;
  let n=0, tt, g;
  tt=0.5-x0*x0-y0*y0; if(tt>0){g=G[perm[ii+perm[jj]]&7];tt*=tt;n+=tt*tt*(g[0]*x0+g[1]*y0)}
  tt=0.5-x1*x1-y1*y1; if(tt>0){g=G[perm[ii+i1+perm[jj+j1]]&7];tt*=tt;n+=tt*tt*(g[0]*x1+g[1]*y1)}
  tt=0.5-x2*x2-y2*y2; if(tt>0){g=G[perm[ii+1+perm[jj+1]]&7];tt*=tt;n+=tt*tt*(g[0]*x2+g[1]*y2)}
  return 70*n;
}
function fbm(x,y,o){let a=1,f=1,s=0,n=0;for(let i=0;i<o;i++){s+=a*simplex(x*f,y*f);n+=a;a*=0.5;f*=2}return s/n}
function hash(x,z,k){let h=(SEED^Math.imul(x,374761393)^Math.imul(z,668265263)^Math.imul(k,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296}
const sstep=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};

const TREES=new Set([0,1,2,3,4,8,14,15,16,17]);
const TP={15:0.04,1:0.15,2:0.09,3:0.85,4:0.1,5:0.3,6:0.3,7:0.4,8:0.14,9:0.95,10:0.8,11:0.5,12:0.05};
function treeFor(b,h,r2){switch(b){case 15:return r2<0.6?4:14;case 3:return r2<0.62?0:r2<0.84?2:1;case 2:return r2<0.8?0:2;case 4:return 4;case 5:return 8;case 6:return h>WATER+40?8:1;case 1:return 3;case 7:return 0;case 8:return 14;case 9:return r2<0.8?15:0;case 10:return r2<0.7?16:r2<0.85?2:0;case 11:return r2<0.85?17:2;case 12:return 2}return -1}
// Biomy: 0 ocean, 1 plaża, 2 równiny, 3 las, 4 pustynia, 5 tundra, 6 góry, 7 bagna
function base1(x,z,low){
  const cont=fbm(x/1100+11.3,z/1100-7.1,5)*1.35+0.12;
  const temp=fbm(x/1500+97,z/1500+13,3), hum=fbm(x/1200-311,z/1200+57,3);
  const det=low?0:fbm(x/90,z/90,3), mm=sstep(0.05,0.4,fbm(x/1300+501,z/1300-203,2));
  const ridge=1-Math.abs(simplex(x/360,z/360));
  let h=WATER+cont*30+det*3*sstep(-0.05,0.2,cont);
  const land=sstep(0.0,0.18,cont);
  h+=land*mm*(Math.pow(ridge,1.6)*30+sstep(0.55,1,ridge)*10);
  h+=land*sstep(0.1,0.5,cont)*Math.max(0,fbm(x/180-41,z/180+77,3))*14; // łagodne wzgórza
  if(!low&&temp>0.25&&hum<0) h+=land*Math.abs(simplex(x/40,z/55))*3; // wydmy
  // klify nad morzem (jak w Pintarze): płaskowyż urywający się stromo przy brzegu
  {const cl=fbm(x/160+7,z/160-3,2);if(cl>0.2)h+=sstep(0.2,0.38,cl)*sstep(0.015,0.07,cont)*(1-sstep(0.2,0.35,cont))*9}
  // jeziora leżą w łagodnej niecce: teren (i poziom rzek) schodzi do nich stopniowo zamiast urywać się ścianą
  const lk=fbm(x/430+101,z/430-17,2);let lakeK=0;
  if(lk>0.22&&h>WATER-1){lakeK=sstep(0.12,0.16,cont)*(1-sstep(0.35,0.45,mm));if(lakeK>0){const up=h-(WATER+1.5);if(up>0)h=WATER+1.5+up*(1-sstep(0.22,0.36,lk)*lakeK)}}
  return [h,cont,temp,hum,mm,lk,lakeK];
}
// ===== rzeki: izolinie szumu; poziom wody podąża za terenem (tarasy co 3 bloki → wodospady), w wysokich górach rzeka ma źródło =====
function rivF(x,z){const wx=x+fbm(x/320+5,z/320,2)*140,wz=z+fbm(x/320,z/320+9,2)*140;return fbm(wx/950+33,wz/950-71,3)}
const RIVQ=3;
function river(x,z,h,coast,rwK,base){ // -> [h, wet, wl]
  const F=rivF(x,z),rv=Math.abs(F),rw0=rwK*(1+coast*1.3)*(0.8+0.4*sstep(-0.3,0.3,fbm(x/500+3,z/500+3,1)));
  if(rv>rw0*6.4)return[h,0,0];
  // poziom wody = wysokość terenu bez drobnego szumu, w tarasach co 3 bloki (tarasy idą po warstwicach, więc woda zawsze spływa kaskadami w dół zbocza)
  // poziom liczony z punktu na osi rzeki (rzut wzdłuż gradientu F) -> progi wodospadów biegną w poprzek koryta, bez schodkowych ścianek
  let px=x,pz=z;for(let it=0,Fi=F;it<3;it++){const gx=(rivF(px+2,pz)-rivF(px-2,pz))/4,gz=(rivF(px,pz+2)-rivF(px,pz-2))/4,g2=gx*gx+gz*gz;if(g2<1e-12)break;let k=Fi/g2;const L=Math.hypot(gx*k,gz*k);if(L>25)k*=25/L;px-=gx*k;pz-=gz*k;if(Math.hypot(px-x,pz-z)>60)break;Fi=rivF(px,pz);if(Math.abs(Fi)<1e-5)break}
  px=Math.round(px/4)*4;pz=Math.round(pz/4)*4;
  const hc=base(px,pz,true)[0];let Lw=WATER;if(hc>WATER+3.2)Lw=WATER+RIVQ*Math.floor((hc-WATER-0.2)/RIVQ);
  const hi=sstep(WATER+12,WATER+42,hc),rw=rw0*(1-hi*0.4)*(1-sstep(WATER+40,WATER+52,hc));
  if(rw<1e-4)return[h,0,0];
  let wet=0;
  if(Lw>WATER){ // rzeka powyżej poziomu morza: wał brzegowy na Lw+1.5 w całej strefie koryta, dalej łagodne przejście do terenu
    const up=h-(Lw+1.5),gw=rw*(3.7+Math.min(12,Math.abs(up))*0.24),tv=1-sstep(rw*2.6,gw,rv);
    if(tv<=0)return[h,0,0];h=Lw+1.5+up*(1-sstep(0,1,tv));
    const t=1-sstep(rw*0.7,rw*2.4,rv);if(t>0){const bed=Lw-2-Math.round(t*1.5);h=h+(bed-h)*Math.min(1,t*1.15);if(h>=Lw&&h<Lw+1)h=Lw+1;if(t>0.55)wet=13}
    return[h,wet,t>0?Lw:0]}
  {const up=Math.max(0,h-(WATER+1.5));if(up>0){const gw=rw*(2.2+up*0.22),tv=1-sstep(rw*1.0,gw,rv);if(tv>0)h=WATER+1.5+up*(1-sstep(0,1,tv))}}
  const t=1-sstep(rw*0.7,rw*2.4,rv);if(t>0){const bed=WATER-2-Math.round(t*(1.5+coast));h=h+(bed-h)*Math.min(1,t*1.15);if(t>0.55)wet=13}
  return[h,wet,0]}
function sample1(x,z){
  let [h,cont,temp,hum,mm,lk,lakeK]=base1(x,z,false);
  let wet=0,wl=0;
  if(h>=WATER-1){const R=river(x,z,h,0,0.013,base1);h=R[0];wet=R[1];wl=R[2];
    // jeziora
    if(!wl&&lk>0.36&&lakeK>0){const tl=sstep(0.36,0.46,lk)*lakeK;const bed=WATER-2-Math.round(sstep(0.46,0.6,lk)*3);h=h+(bed-h)*tl;if(tl>0.6)wet=14}}
  h=Math.max(1,Math.min(MAXH-1,Math.floor(h)));
  let b;
  if(wl&&h>=wl)wl=0;
  if(h<WATER) b=wet||0;
  else if(wl) b=13;
  else if(wet&&h<=WATER+1) b=1;
  else if(h<=WATER+1&&cont<0.2) b=1;
  else if(mm>0.5&&h>WATER+22) b=6;
  else if(temp>0.22&&hum<0.02) b=4;
  else if(temp<-0.24) b=5;
  else if(hum>0.32&&h<WATER+5) b=7;
  else if(temp>0.2&&hum>0.26) b=9;
  else if(temp>0.12&&hum<0.16) b=8;
  else if(hum>0.08){const sk=fbm(x/520+71,z/520-33,2);b=sk>0.38?11:(temp<-0.06?10:3)}
  else if(temp<-0.1) b=12;
  else b=2;
  return [h,b,wl];
}

// ===== generator świata v2 (nowe światy): kaniony i płaskowyże, wąwozy rzeczne, wulkany z lawą =====
let GEN=1;
function sample(x,z){return GEN===2?sample2(x,z):sample1(x,z)}
function sH(x,z){const r=sample(x,z);return r[2]?WATER-5:r[0]}
function base2(x,z,low){
  const cont=fbm(x/1100+11.3,z/1100-7.1,5)*1.35+0.12;
  const temp=fbm(x/1500+97,z/1500+13,3), hum=fbm(x/1200-311,z/1200+57,3);
  const det=low?0:fbm(x/90,z/90,3), mm=sstep(0.05,0.4,fbm(x/1300+501,z/1300-203,2));
  const ridge=1-Math.abs(simplex(x/360,z/360));
  let h=WATER+cont*30+det*3*sstep(-0.05,0.2,cont);
  const land=sstep(0.0,0.18,cont);
  h+=land*mm*(Math.pow(ridge,1.6)*34+sstep(0.55,1,ridge)*12);
  h+=land*sstep(0.1,0.5,cont)*Math.max(0,fbm(x/180-41,z/180+77,3))*14;
  // badlands: tarasowe płaskowyże przecięte suchymi kanionami
  const bad=land*sstep(0.2,0.38,temp)*sstep(0.04,-0.2,hum)*(1-mm*0.7);let canyon=0;
  if(bad>0.04){const pl=WATER+9+Math.floor((fbm(x/240+51,z/240-9,2)*0.5+0.5)*5)*4;h=h+(pl-h)*sstep(0.04,0.5,bad);
    const cw=Math.abs(fbm(x/280+211+fbm(x/110,z/110,1)*0.5,z/280-17,2)),ct=1-sstep(0.025,0.08,cw);
    if(ct>0&&!low){canyon=ct*sstep(0.1,0.5,bad);const fl=WATER+2;h=h+(fl-h)*Math.min(1,canyon*1.4);h=fl+Math.floor(Math.max(0,h-fl)/3)*3}}
  if(!low&&temp>0.25&&hum<0&&bad<0.25) h+=land*Math.abs(simplex(x/40,z/55))*3; // wydmy
  // wulkany: rzadkie stożki z kraterem i lawą
  const vr=fbm(x/2600-91,z/2600+47,2),vol=fbm(x/650+777,z/650-333,2)-(1-sstep(0.02,0.25,vr))*0.7;let lava=0,volc=0;
  if(vol>0.48&&land>0.6){const k=sstep(0.48,0.64,vol);volc=k;h+=k*k*52;if(vol>0.64){const c=sstep(0.64,0.7,vol);h-=c*34;if(vol>0.69){lava=1;h=Math.max(h,WATER+9)}}}
  {const cl=fbm(x/160+7,z/160-3,2);if(cl>0.2)h+=sstep(0.2,0.38,cl)*sstep(0.015,0.07,cont)*(1-sstep(0.2,0.35,cont))*9}
  const lk=fbm(x/430+101,z/430-17,2);let lakeK=0;
  if(lk>0.22&&h>WATER-1&&!lava&&volc<0.3){lakeK=sstep(0.12,0.16,cont)*(1-sstep(0.35,0.45,mm))*(1-sstep(0.2,0.3,bad));if(lakeK>0){const up=h-(WATER+1.5);if(up>0)h=WATER+1.5+up*(1-sstep(0.22,0.36,lk)*lakeK)}}
  return [h,cont,temp,hum,mm,land,bad,canyon,lava,volc,lk,lakeK];
}
function sample2(x,z){
  let [h,cont,temp,hum,mm,land,bad,canyon,lava,volc,lk,lakeK]=base2(x,z,false);
  let wet=0,gorge=0,wl=0;
  if(h>=WATER-1&&!lava&&volc<0.3){const coast=sstep(0.16,0.0,cont),R=river(x,z,h,coast,0.012,base2);h=R[0];wet=R[1];wl=R[2];
    if(!wl&&lk>0.36&&lakeK>0){const tl=sstep(0.36,0.46,lk)*lakeK;const bed=WATER-2-Math.round(sstep(0.46,0.6,lk)*3);h=h+(bed-h)*tl;if(tl>0.6)wet=14}}
  const mg=fbm(x/1700+3131,z/1700-777,2);let fan=0,spire=0;
  if(mg>0.3&&land>0.7&&!lava&&volc<0.2&&h>=WATER+1&&!wet&&!wl&&bad<0.3){fan=temp<-0.15?21:(temp>0.18&&hum<0.05)?18:hum>0.12?19:20;
    if(fan===18||fan===21){const cs=7,gx=Math.floor(x/cs),gz=Math.floor(z/cs),rr=hash(gx,gz,951);if(rr<0.3){const px=(gx+0.25+hash(gx,gz,952)*0.5)*cs,pz=(gz+0.25+hash(gx,gz,953)*0.5)*cs,dd=Math.hypot(x-px,z-pz),rad=1.2+rr*3.5;if(dd<rad){const tall=(4+rr*48)*(1-dd/rad)*sstep(0.3,0.42,mg);h+=tall;if(tall>2)spire=1}}}
    if(fan===20)h-=sstep(0.3,0.5,mg)*2}
  h=Math.max(1,Math.min(MAXH-1,Math.floor(h)));
  let b;
  if(wl&&h>=wl)wl=0;
  if(lava) b=17;
  else if(h<WATER) b=wet||0;
  else if(wl) b=13;
  else if(volc>0.35&&h>WATER+6) b=16;
  else if(spire) b=fan===18?22:23;
  else if(fan&&h>WATER+1) b=fan;
  else if(wet&&h<=WATER+1) b=1;
  else if(h<=WATER+1&&cont<0.2) b=1;
  else if(bad>0.42||canyon>0.25) b=15;
  else if(gorge>0.3&&h>WATER+3) b=15;
  else if(mm>0.5&&h>WATER+22) b=6;
  else if(temp>0.22&&hum<0.02) b=4;
  else if(temp<-0.24) b=5;
  else if(hum>0.32&&h<WATER+5) b=7;
  else if(temp>0.2&&hum>0.26) b=9;
  else if(temp>0.12&&hum<0.16) b=8;
  else if(hum>0.08){const sk=fbm(x/520+71,z/520-33,2);b=sk>0.38?11:(temp<-0.06?10:3)}
  else if(temp<-0.1) b=12;
  else b=2;
  return [h,b,wl];
}
const STRATA=[[0.80,0.46,0.26],[0.70,0.36,0.20],[0.88,0.62,0.40],[0.62,0.30,0.18],[0.84,0.54,0.32],[0.92,0.74,0.52]];
// ===== królestwa ras (nowe światy) =====
const KR=2200,kcache=new Map();
const KSYL={niziolki:[['Zielo','Mięto','Jabło','Wierz','Kwiat','Miodo','Głogo','Leszczy'],['wzgórze','dół','łąka','sad','pagórek','dolina','zakątek','gaj']],drowy:[['Xal','Vel','Zyr','Ilph','Mal','Shar','Vor','Ryl'],['zarith','drach','thul','vrae','neth','ozz','yrr','lith']],saurianie:[['Ssa','Kha','Zix','Tlo','Qua','Ixa','Sek','Rha'],['ssik','tlan','koatl','zhar','pocha','xil','muun','thaa']],ludzie:[['Wis','Bor','Rad','Mir','Zbi','Dob','Sie','Lech','Gnie','Kra'],['lania','owia','gard','mierz','sława','nia','wice','gród']],elfy:[['El','Sil','Lor','Tha','Ael','Ith','Cael','Nim'],['arion','vanor','ethil','andor','wyn','iriel','oriel','dhel']],krasnoludy:[['Khaz','Bar','Thor','Dur','Kar','Mor','Gund','Bal'],['dum','akar','grim','gan','zek','dun','bad','heim']],orkowie:[['Gor','Mug','Zug','Grom','Ur','Kra','Bol','Gash'],['ash','tar','nak','gul','thar','rok','mog','dush']]};
function kwarp(x,z){return[x+160*Math.sin(z/510)+90*Math.sin(z/170+1.3),z+160*Math.sin(x/530+0.7)+90*Math.sin(x/190+2.1)]}
function kingdomCell(gx,gz){const key=SEED+':'+gx+','+gz;if(kcache.has(key))return kcache.get(key);const x=(gx+0.2+hash(gx,gz,901)*0.6)*KR,z=(gz+0.2+hash(gx,gz,902)*0.6)*KR,cnt={};
  for(let i=0;i<9;i++){const b=sample(x+((i%3)-1)*420,z+(Math.floor(i/3)-1)*420)[1];cnt[b]=(cnt[b]||0)+1}const c=k=>cnt[k]||0;
  const sc={ludzie:c(2)+c(7)*0.3+c(9)*0.3+1+hash(gx,gz,903)*2.5,elfy:c(3)+c(10)+c(11)*0.6+hash(gx,gz,904)*2.5,krasnoludy:c(5)+c(6)+c(12)+c(21)+hash(gx,gz,905)*2.5,orkowie:c(4)+c(8)+c(15)+c(16)+c(20)*0.5+hash(gx,gz,906)*2.5,niziolki:c(2)*0.55+c(11)*0.8+hash(gx,gz,907)*2.5,drowy:c(19)+c(20)+c(12)*0.4+hash(gx,gz,908)*2.2,saurianie:c(7)*1.2+c(9)*1.2+hash(gx,gz,909)*2.3};
  let race='ludzie',bs=-1;for(const k in sc)if(sc[k]>bs){bs=sc[k];race=k}const S=KSYL[race],nm=S[0][Math.floor(hash(gx,gz,910)*S[0].length)]+S[1][Math.floor(hash(gx,gz,911)*S[1].length)];
  const r={id:'K'+gx+'_'+gz,gx,gz,x,z,race,name:nm};kcache.set(key,r);return r}
function kingdomAt(x,z){const [wx,wz]=kwarp(x,z),gx=Math.floor(wx/KR),gz=Math.floor(wz/KR);let best=null,bd=1e18;for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const k=kingdomCell(gx+dx,gz+dz),dd=(k.x-wx)**2+(k.z-wz)**2;if(dd<bd){bd=dd;best=k}}return best}
// paleta Pintara: trawa #54843a, ziemia #806844, piasek [216,198,142], kamień #8e8994, ściany klifów brąz [.42,.29,.18]
const TOP=[[0.74,0.64,0.40],[0.92,0.80,0.50],[0.27,0.60,0.14],[0.20,0.50,0.10],[0.92,0.76,0.42],[0.92,0.95,0.98],[0.56,0.53,0.6],[0.30,0.45,0.13],[0.70,0.64,0.30],[0.12,0.46,0.12],[0.50,0.48,0.18],[0.36,0.62,0.24],[0.46,0.38,0.40],[0.58,0.52,0.36],[0.50,0.46,0.32],[0.80,0.48,0.27],[0.20,0.18,0.19],[1.0,0.45,0.08],[0.74,0.70,0.88],[0.30,0.52,0.50],[0.27,0.25,0.27],[0.82,0.92,0.98],[0.55,0.95,1.0],[0.9,0.97,1.0]];
const TOPSIDE=[[0.62,0.52,0.32],[0.72,0.58,0.32],[0.48,0.30,0.15],[0.46,0.29,0.14],[0.72,0.56,0.30],[0.46,0.30,0.16],[0.435,0.416,0.451],[0.40,0.28,0.15],[0.62,0.46,0.26],[0.40,0.27,0.14],[0.46,0.30,0.15],[0.46,0.30,0.15],[0.40,0.30,0.22],[0.50,0.42,0.28],[0.44,0.38,0.26],[0.72,0.38,0.22],[0.15,0.13,0.14],[0.9,0.3,0.05],[0.58,0.52,0.72],[0.30,0.24,0.28],[0.2,0.17,0.19],[0.62,0.78,0.9],[0.75,0.55,1.0],[0.7,0.88,1.0]];
const DIRT=TOPSIDE;
const STONE=[0.435,0.416,0.451];
const DIRTTOP=[0.502,0.408,0.267],ROADC=[0.6,0.47,0.3],ROADC2=[0.54,0.42,0.27],COBC=[0.56,0.54,0.52],COBC2=[0.47,0.45,0.44];
const SNOW=[0.95,0.97,0.99];

function build(cx,cz,lod,sx,sz,dig){
  const W=C+2*B, H=new Uint8Array(W*W), BI=new Uint8Array(W*W);
  const ox=cx*C-B, oz=cz*C-B;
  const WLm=new Uint8Array(W*W);
  for(let z=0;z<W;z++)for(let x=0;x<W;x++){const r=sample(ox+x,oz+z);H[z*W+x]=r[0];BI[z*W+x]=r[1];WLm[z*W+x]=r[2]||0}
  const RD=new Uint8Array(W*W);
  if(sx!=null){const mx=cx*C+16,mz=cz*C+16,cty=cityNear(mx,mz,sx,sz,30);
    if(cty)for(let z=0;z<W;z++)for(let x=0;x<W;x++){const dx=ox+x+0.5-cty.x,dz=oz+z+0.5-cty.z;if(Math.abs(dx)<=cty.Hs+4&&Math.abs(dz)<=cty.Hs+4){H[z*W+x]=cty.h;WLm[z*W+x]=0;
      const ax=Math.abs(dx),az=Math.abs(dz),sec=v=>(v>=23&&v<=27)||(v>=46&&v<=50&&v<cty.Hs-7);if(ax<cty.Hs+0.5&&az<cty.Hs+0.5&&(ax<3.2||az<3.2||(ax<12&&az<12)||sec(ax)||sec(az)||ax>cty.Hs-6||az>cty.Hs-6))RD[z*W+x]=2}
      else if((Math.abs(dx)<3.2&&Math.abs(dz)<cty.Hs+9)||(Math.abs(dz)<3.2&&Math.abs(dx)<cty.Hs+9))RD[z*W+x]=2}
    const rs=roadsNear(mx,mz,40,sx,sz);
    for(const r of rs)for(let i=0;i<r.pts.length-1;i++){const a=r.pts[i],b=r.pts[i+1];
      const x0=Math.max(0,Math.floor(Math.min(a[0],b[0])-2-ox)),x1=Math.min(W-1,Math.ceil(Math.max(a[0],b[0])+2-ox)),z0=Math.max(0,Math.floor(Math.min(a[1],b[1])-2-oz)),z1=Math.min(W-1,Math.ceil(Math.max(a[1],b[1])+2-oz));
      for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){if(RD[z*W+x])continue;const sd=segDist(ox+x+0.5,oz+z+0.5,a,b);if(WLm[z*W+x]&&H[z*W+x]<WLm[z*W+x])continue;if(sd<1.55){if(H[z*W+x]>=WATER)RD[z*W+x]=1}}}}
  // wyrównanie terenu pod działkami domów i placem wioski (deterministyczne, takie samo u wszystkich graczy)
  if(sx!=null){const mx=cx*C+16,mz=cz*C+16,rx=Math.floor(mx/VR),rz=Math.floor(mz/VR),vl=[];
    for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const v=villageAt(rx+dx,rz+dz,sx,sz);if(v&&Math.abs(v.x-mx)<75&&Math.abs(v.z-mz)<75)vl.push(v)}
    for(const v of vl)for(let z=0;z<W;z++)for(let x=0;x<W;x++){const wx=ox+x+0.5,wz=oz+z+0.5;if(Math.abs(wx-v.x)>32||Math.abs(wz-v.z)>32)continue;
      if(Math.hypot(wx-v.x,wz-v.z)<4.5){H[z*W+x]=v.h;WLm[z*W+x]=0;continue}
      for(let i=0;i<v.houses.length;i++){const h=v.houses[i],hw=(i===1?6.6:8.8)/2+0.9,hd=(i===1?13.2:8.8)/2+0.9,ddx=wx-h.x,ddz=wz-h.z,c=Math.cos(h.rot),s=Math.sin(h.rot),lx=ddx*c-ddz*s,lz=ddx*s+ddz*c;
        if(Math.abs(lx)<hw&&Math.abs(lz)<hd){H[z*W+x]=h.top;WLm[z*W+x]=0;break}}}}
  // woda nie może stać ponad niższym suchym brzegiem (np. po wyrównaniu terenu pod osadą): obniżamy taflę (3 przejścia < margines B)
  // wygładzenie poziomów: cienkie pasy/wysepki innego poziomu (dają pionowe płaty wody w tafli) dostają poziom większości sąsiadów
  for(let it=0;it<2;it++){const NW=WLm.slice();for(let z=1;z<W-1;z++)for(let x=1;x<W-1;x++){const j=z*W+x,w=WLm[j];if(!w||H[j]>=w)continue;const cnt={};let bl=0,bc=0;
      for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(!a&&!b)continue;const k=j+a*W+b,wk=WLm[k];if(!wk||H[k]>=wk||wk===w)continue;const c=(cnt[wk]=(cnt[wk]||0)+1);if(c>bc){bc=c;bl=wk}}
      let same=0;for(const k of [j-1,j+1,j-W,j+W])if(WLm[k]===w&&H[k]<w)same++;
      if(bl&&H[j]<bl&&(bc>=5||(same<=1&&bc>=3)))NW[j]=bl}WLm.set(NW)}
  for(let it=0;it<2;it++){const NW=WLm.slice();for(let z=1;z<W-1;z++)for(let x=1;x<W-1;x++){const j=z*W+x,w=WLm[j];if(!w)continue;if(H[j]>=w){NW[j]=0;continue}let m=w;for(const k of [j-1,j+1,j-W,j+W]){const hk=H[k];if((!WLm[k]||H[k]>=WLm[k])&&hk>=WATER&&hk<m-0.5)m=hk}if(m<w)NW[j]=m>H[j]?m:0}WLm.set(NW)}
  const FD=new Uint8Array(W*W),FR=new Uint8Array(W*W);const plotsHere=[];
  if(sx!=null){const mx=cx*C+16,mz=cz*C+16,rx=Math.floor(mx/VR),rz=Math.floor(mz/VR),SL=[];
    for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const v=villageAt(rx+dx,rz+dz,sx,sz);if(v&&Math.abs(v.x-mx)<90&&Math.abs(v.z-mz)<90)SL.push(v)}
    {const c=cityNear(mx,mz,sx,sz,80);if(c)SL.push(c)}
    for(const s of SL){const F=farmsOf(s);
      if(!s.city)for(const h of s.houses){const fx=h.x+Math.sin(h.rot)*5.6,fz=h.z+Math.cos(h.rot)*5.6,a=[s.x+(fx-s.x)*0.18,s.z+(fz-s.z)*0.18],b=[fx,fz];
        for(let z=0;z<W;z++)for(let x=0;x<W;x++){if(RD[z*W+x])continue;const px=ox+x+0.5,pz=oz+z+0.5;if(px<Math.min(a[0],b[0])-2||px>Math.max(a[0],b[0])+2||pz<Math.min(a[1],b[1])-2||pz>Math.max(a[1],b[1])+2)continue;if(segDist(px,pz,a,b)<0.95)RD[z*W+x]=1}}
      const rect=(x0,z0,hw,hd,fn)=>{const xa=Math.max(0,Math.floor(x0-hw-ox)),xb=Math.min(W-1,Math.ceil(x0+hw-ox)),za=Math.max(0,Math.floor(z0-hd-oz)),zb=Math.min(W-1,Math.ceil(z0+hd-oz));
        for(let z=za;z<=zb;z++)for(let x=xa;x<=xb;x++){const px=ox+x+0.5,pz=oz+z+0.5;if(Math.abs(px-x0)<hw&&Math.abs(pz-z0)<hd)fn(z*W+x,px,pz)}};
      for(const p of F.plots){if(Math.abs(p.x-mx)>60||Math.abs(p.z-mz)>60)continue;plotsHere.push(p);
        rect(p.x,p.z,p.hw+1,p.hd+1,(i)=>{if(!RD[i])H[i]=p.h});
        rect(p.x,p.z,p.hw,p.hd,(i,px,pz)=>{if(RD[i])return;const along=p.ax?px-p.x+p.hw:pz-p.z+p.hd;FD[i]=1;FR[i]=(Math.floor(along)%2===0)?p.crop:0})}
      for(const h of F.huts)rect(h.x,h.z,5.4,5.4,(i)=>{H[i]=h.h});
      for(const m of F.mills)rect(m.x,m.z,3.6,3.6,(i)=>{H[i]=m.h;FD[i]=2})}}
  if(sx!=null){const mx=cx*C+16,mz=cz*C+16,gx0=Math.floor(mx/SR),gz0=Math.floor(mz/SR);
    for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const s=structAt(gx0+dx,gz0+dz,sx,sz);if(!s||!s.fl)continue;const F=s.fl;if(Math.abs(s.x-mx)>F+24||Math.abs(s.z-mz)>F+24)continue;
      for(let z=0;z<W;z++)for(let x=0;x<W;x++){const ddx=Math.abs(ox+x+0.5-s.x),ddz=Math.abs(oz+z+0.5-s.z),dm=Math.max(ddx,ddz);if(dm<F){H[z*W+x]=s.h;if(s.type==='zamczysko'&&dm<27)RD[z*W+x]=2}else if(dm<F+4){const k=(dm-F)/4;H[z*W+x]=Math.round(s.h+(H[z*W+x]-s.h)*k)}}}}
  const DG=new Uint8Array(W*W);if(dig&&dig.length)for(let i=0;i<dig.length;i+=3){const x=dig[i]-ox,z=dig[i+1]-oz;if(x<0||z<0||x>=W||z>=W)continue;const j=z*W+x;if(dig[i+2]<H[j]){H[j]=Math.max(1,dig[i+2]);DG[j]=1}}
  const dgAt=(lx,lz)=>DG[(lz+B)*W+lx+B];
  const wAt=(lx,lz)=>{const j=(lz+B)*W+lx+B,w=WLm[j];return w&&H[j]<w?w:0};
  const hAt=(lx,lz)=>H[(lz+B)*W+lx+B], bAt=(lx,lz)=>BI[(lz+B)*W+lx+B], rdAt=(lx,lz)=>RD[(lz+B)*W+lx+B], fdAt=(lx,lz)=>FD[(lz+B)*W+lx+B], frAt=(lx,lz)=>FR[(lz+B)*W+lx+B];
  const P=[],N=[],Cc=[],I=[];
  const quad=(v,n,c)=>{const b=P.length/3;for(let k=0;k<4;k++){P.push(v[k*3],v[k*3+1],v[k*3+2]);N.push(n[0],n[1],n[2]);Cc.push(c[k][0],c[k][1],c[k][2])}I.push(b,b+1,b+2,b,b+2,b+3)};
  const sh=(c,f)=>[c[0]*f,c[1]*f,c[2]*f];
  const s=lod, wx0=cx*C, wz0=cz*C;
  // ściana pionowa od y0 do y1 wzdłuż krawędzi
  function side(dir,x,z,y0,y1,cT,cB,ins){
    if(y1<=y0)return;if(ins){if(dir===0)x-=0.03;else if(dir===1)x+=0.03;else if(dir===2)z-=0.03;else z+=0.03}
    const cb=[cB,cB,cT,cT];
    if(dir===0) quad([x+s,y0,z+s, x+s,y0,z, x+s,y1,z, x+s,y1,z+s],[1,0,0],cb);
    else if(dir===1) quad([x,y0,z, x,y0,z+s, x,y1,z+s, x,y1,z],[-1,0,0],cb);
    else if(dir===2) quad([x,y0,z+s, x+s,y0,z+s, x+s,y1,z+s, x,y1,z+s],[0,0,1],cb);
    else quad([x+s,y0,z, x,y0,z, x,y1,z, x+s,y1,z],[0,0,-1],cb);
  }
  const SLB=[];
  // półstopnie: przy uskoku o 1 blok dokłada się płytka 0,5 m (łagodniejsze zbocza w stylu voxel)
  function slab(d,lx,lz,y0,cT,cS){let x0,x1,z0,z1;if(d===0){x0=lx+1;x1=lx+1.5;z0=lz;z1=lz+1}else if(d===1){x0=lx-0.5;x1=lx;z0=lz;z1=lz+1}else if(d===2){z0=lz+1;z1=lz+1.5;x0=lx;x1=lx+1}else{z0=lz-0.5;z1=lz;x0=lx;x1=lx+1}const y1=y0+0.5;
    quad([x0,y1,z0, x0,y1,z1, x1,y1,z1, x1,y1,z0],[0,1,0],[cT,cT,cT,cT]);
    if(d!==1)quad([x1,y0,z1, x1,y0,z0, x1,y1,z0, x1,y1,z1],[1,0,0],[cS,cS,cT,cT]);
    if(d!==0)quad([x0,y0,z0, x0,y0,z1, x0,y1,z1, x0,y1,z0],[-1,0,0],[cS,cS,cT,cT]);
    if(d!==3)quad([x0,y0,z1, x1,y0,z1, x1,y1,z1, x0,y1,z1],[0,0,1],[cS,cS,cT,cT]);
    if(d!==2)quad([x1,y0,z0, x0,y0,z0, x0,y1,z0, x1,y1,z0],[0,0,-1],[cS,cS,cT,cT]);
    SLB.push(wx0+x0,wz0+z0,wx0+x1,wz0+z1,y0,y1)}
  const D=[[1,0],[-1,0],[0,1],[0,-1]];
  for(let lz=0;lz<C;lz+=s)for(let lx=0;lx<C;lx+=s){
    const h=hAt(lx,lz), b=bAt(lx,lz), v=0.92+hash(wx0+lx,wz0+lz,7)*0.16;
    const snowy=(b===6&&h>WATER+38)||b===5;
    let top=snowy?SNOW:TOP[b]; if(b===6&&!snowy&&h<WATER+26)top=TOP[2];
    if(!snowy&&b!==17&&b!==0&&b!==13&&b!==14){let n=0,r0=0,g0=0,b0=0,diff=false;for(let dz=-3;dz<=3;dz+=3)for(let dx=-3;dx<=3;dx+=3){const bb=bAt(lx+dx,lz+dz);if(bb!==b)diff=true;if(bb===0||bb===13||bb===14||bb===17)continue;const T=(bb===6&&hAt(lx+dx,lz+dz)<WATER+26)?TOP[2]:TOP[bb];r0+=T[0];g0+=T[1];b0+=T[2];n++}if(diff&&n){const k=0.55;top=[top[0]*(1-k)+r0/n*k,top[1]*(1-k)+g0/n*k,top[2]*(1-k)+b0/n*k]}}
    if(b===16){const pn=fbm((wx0+lx)/18,(wz0+lz)/18,2);top=pn>0.35?[0.34,0.31,0.30]:pn<-0.3?[0.12,0.10,0.11]:top;if(hash(wx0+lx,wz0+lz,91)<0.012)top=[0.95,0.4,0.08]}
    if(b===17){const pn=fbm((wx0+lx)/9+performance.now()*0,(wz0+lz)/9,2);top=pn>0.2?[1,0.78,0.25]:pn<-0.25?[0.75,0.18,0.04]:[1,0.45,0.08]}
    if(b===15){const pn=fbm((wx0+lx)/26,(wz0+lz)/26,2);if(pn>0.3)top=[0.88,0.64,0.40];else if(pn<-0.3)top=[0.66,0.34,0.20]}
    if(b===2||b===3||b===7){const pn=fbm((wx0+lx)/46,(wz0+lz)/46,2);if(pn>0.28)top=b===3?[0.24,0.55,0.12]:[0.40,0.66,0.18];else if(pn<-0.3)top=b===3?[0.16,0.42,0.09]:[0.22,0.52,0.12];
      if(fbm((wx0+lx)/14+9,(wz0+lz)/14,1)>0.55&&b===2)top=[0.58,0.66,0.22];}
    if(b>=8){const pn=fbm((wx0+lx)/30,(wz0+lz)/30,2);if(b===8&&pn>0.2)top=[0.80,0.72,0.40];if(b===8&&pn<-0.35)top=[0.52,0.56,0.24];if(b===10&&pn>0.15)top=hash(wx0+lx,wz0+lz,46)<0.5?[0.74,0.42,0.16]:[0.66,0.30,0.12];
      if(b===11&&pn>0.35)top=[0.92,0.70,0.78];if(b===12&&pn>0.0)top=[0.52,0.32,0.55];if(b===9&&pn>0.25)top=[0.18,0.40,0.10]}
    if((b===2||b===3)&&hash(wx0+lx,wz0+lz,41)<0.08)top=DIRTTOP;
    {const sl=Math.max(Math.abs(hAt(lx+s,lz)-h),Math.abs(hAt(lx-s,lz)-h),Math.abs(hAt(lx,lz+s)-h),Math.abs(hAt(lx,lz-s)-h))/s;if(sl>=3&&b!==0&&b!==1&&b!==4&&h>WATER+3)top=snowy&&sl<5?SNOW:(hash(wx0+lx,wz0+lz,45)<0.5?STONE:[0.5,0.48,0.54]);}
    if(b===6&&!snowy&&h>=WATER+26&&h<WATER+32)top=[0.42,0.48,0.3];
    if(dgAt(lx,lz))top=hash(wx0+lx,wz0+lz,61)<0.35?[0.24,0.2,0.17]:[0.36,0.27,0.18];
    const fd=fdAt(lx,lz);if(fd===1)top=frAt(lx,lz)?[0.44,0.31,0.18]:[0.34,0.23,0.13];
    const rd=rdAt(lx,lz);if(rd===3)top=[0.42,0.30,0.18];else if(rd===1)top=hash(wx0+lx,wz0+lz,43)<0.3?ROADC2:ROADC;else if(rd===2)top=hash(wx0+lx,wz0+lz,44)<0.35?COBC2:COBC;
    const mv=0.92+0.16*(fbm((wx0+lx)/23,(wz0+lz)/23,2)*0.5+0.5);const tc=sh(top,v*mv);
    const ao=(dx,dz)=>{const a1=hAt(lx+dx*s,lz)>h,a2=hAt(lx,lz+dz*s)>h,a3=hAt(lx+dx*s,lz+dz*s)>h;return 1-((a1&&a2)?3:(a1+a2+a3))*0.09};
    quad([lx,h,lz, lx,h,lz+s, lx+s,h,lz+s, lx+s,h,lz],[0,1,0],[sh(tc,ao(-1,-1)),sh(tc,ao(-1,1)),sh(tc,ao(1,1)),sh(tc,ao(1,-1))]);
    for(let d=0;d<4;d++){
      const nx=lx+D[d][0]*s, nz=lz+D[d][1]*s;
      const border=nx<0||nz<0||nx>=C||nz>=C;
      const nh=hAt(nx,nz);
      let bot;
      if(border) bot=Math.max(0,Math.min(nh,h)-(s>1?10:0)); else bot=nh;
      if(bot>=h)continue;
      if(s===1&&!border&&nh===h-1&&h>WATER+1&&!wAt(nx,nz)&&b!==0&&b!==13&&b!==14&&b!==16&&b!==17&&b!==15&&!fdAt(lx,lz)&&!rdAt(lx,lz)&&!fdAt(nx,nz)&&!rdAt(nx,nz)&&bAt(nx,nz)!==17&&hash(wx0+lx*3+d,wz0+lz*5,77)<0.85)slab(d,lx,lz,nh,sh(tc,0.95),snowy?sh(SNOW,0.9*v):sh(TOPSIDE[b],v));
      if(b===15&&!(border&&s>1)){for(let y=bot;y<h;y++){const sc=STRATA[((y>>1)+((wx0>>5)&1))%STRATA.length];side(d,lx,lz,y,y+1,sh(sc,v*(y===h-1?1.05:0.96)),sh(sc,v*0.9),false)}continue}
      const ts=snowy?sh(SNOW,0.9*v):sh(TOPSIDE[b],v);
      const dirt=b===6?STONE:DIRT[b];
      const ins=border&&s>1;side(d,lx,lz,h-1,h,ts,ts,ins);
      const yd=Math.max(bot,h-4);
      side(d,lx,lz,yd,h-1,sh(dirt,v),sh(dirt,v*(yd===bot&&!border?0.74:1)),ins);
      if(yd>bot)side(d,lx,lz,bot,yd,sh(STONE,v),sh(STONE,v*(border?0.94:0.7)),ins);
    }
  }
  // woda rzek powyżej poziomu morza: tafla na poziomie koryta + pionowe ściany wodospadów na uskokach
  const WP=[],WU=[],WI=[],FALLS=[];
  {const dAt=(lx,lz)=>{const w=wAt(lx,lz);return w?Math.min(1,(w-hAt(lx,lz))/3.5):0};
   const cl=v=>Math.max(-B,Math.min(C+B-1,v));
   const cd=(cx,cz)=>{let m=1,sum=0;for(const [a,b2] of [[0,0],[-s,0],[0,-s],[-s,-s]]){const d=dAt(cl(cx+a),cl(cz+b2));sum+=d;if(d<=0)m=0}return m?sum/4:0};
   const wq=(v,u)=>{const b0=WP.length/3;for(let k=0;k<4;k++){WP.push(v[k*3],v[k*3+1],v[k*3+2]);WU.push(u[k*2],u[k*2+1])}WI.push(b0,b0+1,b0+2,b0,b0+2,b0+3)};
   // wysokość wierzchołka tafli: średnia poziomów stykających się pól wody różniących się o ≤ RIVQ -> łagodne bystrza zamiast pionowych płatów
   const vy=(vx,vz,w)=>{let sm=0,n=0;for(const [a,b2] of [[0,0],[-s,0],[0,-s],[-s,-s]]){const q=wAt(cl(vx+a),cl(vz+b2));if(q&&Math.abs(q-w)<=RIVQ){sm+=q;n++}}return(n?sm/n:w)-0.3};
   for(let lz=0;lz<C;lz+=s)for(let lx=0;lx<C;lx+=s){const w=wAt(lx,lz);if(!w)continue;const y=w-0.3;
     wq([lx,vy(lx,lz,w),lz, lx,vy(lx,lz+s,w),lz+s, lx+s,vy(lx+s,lz+s,w),lz+s, lx+s,vy(lx+s,lz,w),lz],[0,cd(lx,lz), 0,cd(lx,lz+s), 0,cd(lx+s,lz+s), 0,cd(lx+s,lz)]);
     for(let d=0;d<4;d++){const nx=lx+D[d][0]*s,nz=lz+D[d][1]*s,nw=wAt(cl(nx),cl(nz));if(nw>=w||(nw&&w-nw<=RIVQ))continue;const nh=hAt(cl(nx),cl(nz));if(!nw&&nh>=w)continue;
       const yb=nw?nw-0.3:(nh<WATER?WATER-0.3:nh);if(yb>=y-0.2)continue;const o=0.04;
       if(d===0)wq([lx+s+o,yb,lz+s, lx+s+o,yb,lz, lx+s+o,y,lz, lx+s+o,y,lz+s],[1,yb,1,yb,1,y,1,y]);
       else if(d===1)wq([lx-o,yb,lz, lx-o,yb,lz+s, lx-o,y,lz+s, lx-o,y,lz],[1,yb,1,yb,1,y,1,y]);
       else if(d===2)wq([lx,yb,lz+s+o, lx+s,yb,lz+s+o, lx+s,y,lz+s+o, lx,y,lz+s+o],[1,yb,1,yb,1,y,1,y]);
       else wq([lx+s,yb,lz-o, lx,yb,lz-o, lx,y,lz-o, lx+s,y,lz-o],[1,yb,1,yb,1,y,1,y]);
       if(s===1&&y-yb>1.2)FALLS.push(wx0+lx+0.5+D[d][0]*0.6,y,wz0+lz+0.5+D[d][1]*0.6,yb)}}}
  // dane pełnej rozdzielczości do kolizji
  const heights=new Uint8Array(C*C), biomes=new Uint8Array(C*C), wlev=new Uint8Array(C*C);
  for(let z=0;z<C;z++)for(let x=0;x<C;x++){heights[z*C+x]=hAt(x,z);biomes[z*C+x]=bAt(x,z);wlev[z*C+x]=wAt(x,z)}
  // dekoracje (typy: 0 dąb,1 sosna,2 brzoza,3 palma,4 kaktus,5 krzak,6 skała,7 kwiat,8 sosna śnieżna)
  const DEC=[], avoid=sx!=null?avoidList(cx,cz,sx,sz):null;
  for(let z=0;z<C;z++)for(let x=0;x<C;x++){
    const h=hAt(x,z), wx=wx0+x, wz=wz0+z;let b=bAt(x,z);
    if(h<WATER||b===17||dgAt(x,z)||wAt(x,z))continue;
    if(GEN===2&&b!==1){const jx=Math.round((hash(wx,wz,81)-0.5)*6),jz=Math.round((hash(wx,wz,82)-0.5)*6),bj=bAt(Math.max(-B,Math.min(C+B-1,x+jx)),Math.max(-B,Math.min(C+B-1,z+jz)));if(bj!==0&&bj!==13&&bj!==14&&bj!==17&&bj!==1)b=bj}
    const flat=Math.abs(hAt(x+1,z)-h)<=1&&Math.abs(hAt(x-1,z)-h)<=1&&Math.abs(hAt(x,z+1)-h)<=1&&Math.abs(hAt(x,z-1)-h)<=1;
    if(!flat)continue;
    if(fdAt(x,z))continue;
    const r=hash(wx,wz,1), r2=hash(wx,wz,2);
    let t=-1;
    const mead=fbm(wx/60+3,wz/60-8,2)>0.25;
    if(b===3){ if(r<0.05)t=r2<0.62?0:(r2<0.84?2:1); else if(r<0.075)t=5; else if(r<0.085)t=7; else if(r<0.34)t=9; else if(r<0.38)t=13; else if(r<0.386)t=11; else if(r<0.388)t=12; }
    else if(b===2){ if(r<0.006)t=r2<0.8?0:2; else if(r<0.014)t=5; else if(r<(mead?0.07:0.03))t=r2<0.5?7:10; else if(r<0.034+(mead?0.04:0))t=-1; else if(r<0.46)t=9; else if(r<0.462)t=12; }
    else if(b===4){ if(r<0.006)t=4; else if(r<0.009)t=-1; else if(r<0.011)t=12; }
    else if(b===5){ if(r<0.02)t=8; else if(r<0.026)t=-1; else if(r<0.03)t=12; }
    else if(b===6){ if(r<0.012)t=h>WATER+40?8:1; else if(r<0.021)t=-1; else if(r<0.04)t=12; else if(r<0.1&&h<WATER+34)t=9; }
    else if(b===1){ if(r<0.012)t=3; else if(r<0.016)t=-1; }
    else if(b===7){ if(r<0.025)t=r2<0.6?0:5; else if(r<0.05)t=5; else if(r<0.16)t=13; else if(r<0.2)t=9; else if(r<0.21)t=11; }
    else if(b===8){ if(r<0.009)t=14; else if(r<0.016)t=5; else if(r<0.17)t=19; else if(r<0.173)t=-1; else if(r<0.175)t=12; }
    else if(b===9){ if(r<0.07)t=r2<0.8?15:0; else if(r<0.2)t=13; else if(r<0.25)t=5; else if(r<0.26)t=7; else if(r<0.265)t=11; }
    else if(b===10){ if(r<0.05)t=r2<0.7?16:(r2<0.85?2:0); else if(r<0.07)t=5; else if(r<0.08)t=11; else if(r<0.12)t=19; else if(r<0.14)t=13; }
    else if(b===11){ if(r<0.03)t=r2<0.85?17:2; else if(r<0.36)t=9; else if(r<0.2)t=10; else if(r<0.215)t=7; }
    else if(b===15){ if(r<0.004)t=4; else if(r<0.02)t=5; else if(r<0.12)t=19; }
    else if(b===16){ if(r<0.03)t=19; }
    else if(b===18){ if(r<0.01)t=7; }
    else if(b===19){ if(r<0.03)t=11; else if(r<0.22)t=13; else if(r<0.3)t=11; else if(r<0.34)t=9; }
    else if(b===20){ if(r<0.08)t=19; else if(r<0.1)t=11; else if(r<0.115)t=5; }
    else if(b===21){ if(r<0.006)t=8; }
    else if(b===12){ if(r<0.08)t=18; else if(r<0.086)t=-1; else if(r<0.088)t=12; else if(r<0.09)t=2; else if(r<0.16)t=19; }
    if(t>=0&&TREES.has(t))t=-1;
    {const gc=8,gx=Math.floor(wx/gc),gz=Math.floor(wz/gc);if(wx-gx*gc===3+Math.floor(hash(gx,gz,61)*2)&&wz-gz*gc===3+Math.floor(hash(gx,gz,62)*2)&&hash(gx,gz,63)<(TP[b]||0))t=treeFor(b,h,hash(gx,gz,64))}
    if(t===9&&r2<0.4)t=24;
    if(t===12)continue;   // bez dużych omszałych głazów
    if(t<0)continue;
    if(avoid&&avoid.some(q=>Math.hypot(q[0]-wx,q[1]-wz)<q[2]))continue;
    if(RD[(z+B)*W+x+B])continue;
    // drzewa nie przy krawędzi chunka obok siebie: odstęp przez siatkę 2x2
    if(t===12&&((wx%3)||(wz%3)))continue;
    let sc=t===7||t===10?1:TREES.has(t)?0.85+hash(wx,wz,3)*0.4:0.75+hash(wx,wz,3)*0.6;if(b===19&&t===11&&r<0.03)sc=2.8+hash(wx,wz,7)*2.6;if(b===20&&t===5)sc*=0.8;
    DEC.push(t,wx+0.5+(hash(wx,wz,4)-0.5)*0.4,h,wz+0.5+(hash(wx,wz,5)-0.5)*0.4,sc,hash(wx,wz,6)*Math.PI*2);
  }
  for(const p of plotsHere){for(let z=0;z<C;z++)for(let x=0;x<C;x++){const cr=frAt(x,z);if(!cr||fdAt(x,z)!==1)continue;const wx=wx0+x,wz=wz0+z;
      DEC.push(cr,wx+0.5,hAt(x,z),wz+0.5,0.9+hash(wx,wz,71)*0.25,(Math.floor(hash(wx,wz,72)*4))*Math.PI/2+0.01)}
    // płot: co 2 bloki po obwodzie (pole ma płot tylko na wsi lub z jednej strony)
    for(const [x0,z0,x1,z1,rot] of [[p.x-p.hw-0.5,p.z-p.hd-0.5,p.x+p.hw+0.5,p.z-p.hd-0.5,0],[p.x-p.hw-0.5,p.z+p.hd+0.5,p.x+p.hw+0.5,p.z+p.hd+0.5,0],[p.x-p.hw-0.5,p.z-p.hd-0.5,p.x-p.hw-0.5,p.z+p.hd+0.5,1],[p.x+p.hw+0.5,p.z-p.hd-0.5,p.x+p.hw+0.5,p.z+p.hd+0.5,1]]){
      const n=Math.round(Math.hypot(x1-x0,z1-z0)/2);for(let k=0;k<n;k++){if(hash(Math.round(p.x)+k,Math.round(p.z)+rot,73)<0.18)continue;const px=x0+(x1-x0)*(k+0.5)/n,pz=z0+(z1-z0)*(k+0.5)/n,lx=Math.floor(px)-wx0,lz=Math.floor(pz)-wz0;if(lx<0||lz<0||lx>=C||lz>=C||rdAt(lx,lz))continue;
        DEC.push(23,px,p.h,pz,1,rot*Math.PI/2+0.01)}}}
  // miniatura 32x32 do mapy: kolor biomu + cieniowanie rzeźby (światło z północnego zachodu), głębia wody, drogi
  const thumb=new Uint8ClampedArray(32*32*4);
  for(let z=0;z<32;z++)for(let x=0;x<32;x++){
    const h=hAt(x,z), b=bAt(x,z), i=(z*32+x)*4;
    let c; if(wAt(x,z)){c=[0.4,0.66,0.84]}else if(h<WATER){const d=Math.min(1,(WATER-h)/14);c=[0.34-d*0.17,0.6-d*0.24,0.82-d*0.2];if(WATER-h<=1)c=[0.5,0.72,0.86]}
    else {const snowy=(b===6&&h>WATER+38)||b===5,rd=rdAt(x,z);c=rd===1?ROADC:rd===2?COBC:(snowy?SNOW:TOP[b]);
      const sl=(hAt(x-1,z-1)-h)*0.07+(hAt(x-1,z)-h)*0.04;const lit=Math.max(0.62,Math.min(1.3,1.02-sl+Math.min(0.12,(h-WATER)/220)));c=sh(c,lit);
      if(h===WATER||h===WATER+1)c=sh(c,0.95)}
    thumb[i]=c[0]*255;thumb[i+1]=c[1]*255;thumb[i+2]=c[2]*255;thumb[i+3]=255;
  }
  return {pos:new Float32Array(P),nor:new Int8Array(N),col:new Float32Array(Cc),idx:new Uint32Array(I),heights,biomes,decos:new Float32Array(DEC),thumb,slabs:new Float32Array(SLB),wlev,wpos:new Float32Array(WP),wuv:new Float32Array(WU),widx:new Uint32Array(WI),falls:new Float32Array(FALLS)};
}


// ===== wioski (deterministyczne z ziarna) =====
const VR=384, vcache=new Map();
function villageAt(rx,rz,sx,sz){
  const key=rx+','+rz+','+sx+','+sz; if(vcache.has(key))return vcache.get(key);
  const forced=Math.floor(sx/VR)===rx&&Math.floor(sz/VR)===rz;
  let res=null;
  if(forced||hash(rx,rz,91)<0.55){
    const cx=forced?sx+42:rx*VR+VR/2+(hash(rx,rz,92)-0.5)*VR*0.45, cz=forced?sz+26:rz*VR+VR/2+(hash(rx,rz,93)-0.5)*VR*0.45;
    for(let t=0;t<36&&!res;t++){
      const a=t*2.4,r=t*5,x=Math.round(cx+Math.cos(a)*r),z=Math.round(cz+Math.sin(a)*r);
      const [h,b]=sample(x,z); if(h<WATER+1||b===0||(b===6&&h>WATER+28))continue;
      let mn=h,mx=h,wet=false;
      for(let k=0;k<16;k++){const aa=k/16*Math.PI*2;for(const rr of [9,18]){const s=sH(x+Math.cos(aa)*rr,z+Math.sin(aa)*rr);if(s<WATER)wet=true;mn=Math.min(mn,s);mx=Math.max(mx,s)}}
      if(wet||mx-mn>5)continue;
      if(cityNear(x,z,sx,sz,150))continue;
      const KK=GEN===2?kingdomAt(x,z):null,race=KK?KK.race:(b===7||b===9)?'saurianie':(b===19||b===20)?'drowy':(b===3||b===10||b===11)?'elfy':(b===5||b===6||b===12)?'krasnoludy':(b===4||b===8)?'orkowie':(b===2&&hash(x,z,977)<0.3)?'niziolki':'ludzie';
      // organiczny układ: plac ze studnią w środku, kilka chat wokół placu, reszta wzdłuż 2–3 krętych dróżek
      const n=7+Math.floor(hash(x,z,94)*3), houses=[], nl=2+Math.floor(hash(x,z,96)*2), la0=hash(x,z,97)*6.283;
      const free=(hx,hz)=>houses.every(q=>Math.hypot(q.x-hx,q.z-hz)>=12.5);
      for(let i=0,t=0;houses.length<n&&t<140;t++,i++){
        let ang,rr;if(t<12&&houses.length<3){ang=la0+Math.PI/nl+t*2.1+hash(x,z,95+t)*0.5;rr=12.5+hash(x,z,100+t)*2}
        else{const li=t%nl,ring=Math.floor(t/nl)%3;ang=la0+li*6.283/nl+(hash(x,z,140+t)-0.5)*1.1+(ring%2?0.32:-0.32);rr=15+ring*8.5+hash(x,z,130+t)*3}const hx=Math.round(x+Math.cos(ang)*rr),hz=Math.round(z+Math.sin(ang)*rr);if(!free(hx,hz))continue;
        const ss=[];let bot=999,wet=false;for(let ox=-4.5;ox<=4.5;ox+=2.25)for(let oz=-4.5;oz<=4.5;oz+=2.25){const s=sH(hx+ox,hz+oz);if(s<WATER)wet=true;ss.push(s);bot=Math.min(bot,s)}if(wet)continue;ss.sort((a,b)=>a-b);if(ss[ss.length-1]-ss[0]>6)continue;const top=Math.max(WATER+1,ss[ss.length>>1]);
        const hw=5,hd=5;houses.push({x:hx,z:hz,w:hw,d:hd,top,bot,rot:Math.round(Math.atan2(x-hx,z-hz)/(Math.PI/2))*(Math.PI/2)});
      }
      res={id:rx+'_'+rz,rx,rz,x:x+0.5,z:z+0.5,h,b,race,kid:KK?KK.id:null,houses};farmsOf(res);
    }
  }
  vcache.set(key,res); return res;
}
function nearVillage(wx,wz,sx,sz){
  const rx=Math.floor(wx/VR),rz=Math.floor(wz/VR);
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const v=villageAt(rx+dx,rz+dz,sx,sz);if(v&&(Math.hypot(v.x-wx,v.z-wz)<16||v.houses.some(h=>Math.hypot(h.x-wx,h.z-wz)<9)))return true}
  return false;
}


// ===== struktury (ruiny, obozy, wieże, kurhany) =====
const SR=192, scache=new Map();
function structAt(gx,gz,sx,sz){
  const key=gx+','+gz+','+sx+','+sz;if(scache.has(key))return scache.get(key);
  let res=null;
  if(hash(gx,gz,201)<0.75){
    const x=Math.round(gx*SR+SR/2+(hash(gx,gz,203)-0.5)*SR*0.6),z=Math.round(gz*SR+SR/2+(hash(gx,gz,204)-0.5)*SR*0.6);
    const [h,b]=sample(x,z);
    if(h<WATER-4&&hash(gx,gz,211)<0.35&&Math.hypot(x-sx,z-sz)>80){const hs=[];for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++)hs.push(sample(x+i*3,z+j*3)[0]);res={id:'s'+gx+'_'+gz,type:'wrak',x:x+0.5,z:z+0.5,h,b,hs,fl:0};scache.set(key,res);return res}
    let ok=h>=WATER+1&&Math.hypot(x-sx,z-sz)>60;
    if(ok){let mn=h,mx=h;for(let k=0;k<12&&ok;k++){const a=k/12*Math.PI*2;for(const r of [5,10]){const s=sH(x+Math.cos(a)*r,z+Math.sin(a)*r);if(s<WATER)ok=false;mn=Math.min(mn,s);mx=Math.max(mx,s)}}if(mx-mn>8)ok=false}
    if(ok){const vx=Math.floor(x/VR),vz=Math.floor(z/VR);for(let dz=-1;dz<=1&&ok;dz++)for(let dx=-1;dx<=1&&ok;dx++){const v=villageAt(vx+dx,vz+dz,sx,sz);if(v&&Math.hypot(v.x-x,v.z-z)<80)ok=false}}
    if(ok&&cityNear(x,z,sx,sz,70))ok=false;
    if(ok){
      const r=hash(gx,gz,202);let type=r<0.1?'kurhan':r<0.26&&b!==5&&b!==6?'oboz':r<0.35?'wieza':r<0.43?'ruiny':r<0.47?(Math.hypot(x-sx,z-sz)>320?'legowisko':'ruiny'):r<0.56?'krag':r<0.66?'gniazdo':r<0.76?'kopalnia':r<0.86?'oltarz':r<0.94&&b!==4?'wiatrak':'ruiny';
      const r3=hash(gx,gz,207);
      if(r3<0.1){let mn=h,mx=h,ok2=true;for(let k=0;k<16&&ok2;k++){const a=k/16*Math.PI*2;for(const rr of [12,20,28,36]){const s=sH(x+Math.cos(a)*rr,z+Math.sin(a)*rr);if(s<WATER+1)ok2=false;mn=Math.min(mn,s);mx=Math.max(mx,s)}}if(ok2&&mx-mn<=10&&Math.hypot(x-sx,z-sz)>300)type='zamczysko'}
      else if(r3<0.16&&(b===4||b===5||b===6||b===8||b===12)&&Math.hypot(x-sx,z-sz)>350)type='grota';
      else if(r3<0.34)type=['gospoda','kupcy','pustelnia','swiatynia'][Math.floor(hash(gx,gz,208)*4)];
      else if(r3<0.46)type=(b===6||b===5||b===12||b===3||b===10||h>WATER+18)?'jaskinia':'loch';
      {let wc=0;for(let k=0;k<12;k++){const a=k/12*Math.PI*2;if(sH(x+Math.cos(a)*45,z+Math.sin(a)*45)<WATER-1)wc++}if(wc>=9&&type!=='zamczysko')type=hash(gx,gz,212)<0.5?'loch':'kurhan'}
      const hs=[];for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++)hs.push(sample(x+i*3,z+j*3)[0]);
      const FL={zamczysko:38,gospoda:10,kupcy:10,pustelnia:9,swiatynia:10}[type]||0;let fh=h;if(FL){const ss=[];for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++)ss.push(sample(x+i*FL/2,z+j*FL/2)[0]);ss.sort((a,b)=>a-b);fh=Math.max(WATER+1,ss[12])}
      res={id:'s'+gx+'_'+gz,type,x:x+0.5,z:z+0.5,h:FL?fh:h,b,hs,fl:FL};
    }
  }
  scache.set(key,res);return res;
}
function avoidList(cx,cz,sx,sz){
  const l=[],wx=cx*C+16,wz=cz*C+16,rx=Math.floor(wx/VR),rz=Math.floor(wz/VR),gx=Math.floor(wx/SR),gz=Math.floor(wz/SR);
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const v=villageAt(rx+dx,rz+dz,sx,sz);if(v){l.push([v.x,v.z,15]);for(const h of v.houses)l.push([h.x,h.z,8])}const s=structAt(gx+dx,gz+dz,sx,sz);if(s)l.push([s.x,s.z,s.type==='zamczysko'?54:s.type==='grota'?18:s.fl?15:s.type==='kurhan'?15:13])}
  {const c=cityNear(wx,wz,sx,sz,60);if(c)l.push([c.x,c.z,c.Hs*1.5])}
  return l;
}


// ===== miasta z murami =====
// pola, chaty rolników i wiatraki wokół osad (deterministyczne)
const CROPS=[20,21,22,20];
function farmsOf(s){if(s.farm)return s.farm;const plots=[],huts=[],mills=[],rects=[];const city=!!s.city;
  const ok=(x,z,hw,hd)=>{for(const r of rects)if(Math.abs(r[0]-x)<r[2]+hw+2.5&&Math.abs(r[1]-z)<r[3]+hd+2.5)return false;return true};
  const flat=(x,z,hw,hd)=>{const ss=[];for(const ax of [-1,0,1])for(const az of [-1,0,1]){const [h,b]=sample(Math.round(x+ax*hw),Math.round(z+az*hd));if(h<WATER+1||b===0)return null;ss.push(h)}ss.sort((a,b)=>a-b);if(ss[8]-ss[0]>2)return null;return ss[4]};
  if(city)rects.push([s.x,s.z,s.Hs+6,s.Hs+6]);else{rects.push([s.x,s.z,14,14]);for(const h of (s.houses||[]))rects.push([h.x,h.z,6.5,6.5])}
  const N=city?40:30,maxP=city?14:9,R0=city?s.Hs+12:30,RR=city?36:26;
  for(let k=0;k<N&&plots.length<maxP;k++){const a=k/N*Math.PI*2+hash(Math.round(s.x),k,401)*0.4,r=R0+hash(Math.round(s.z),k,402)*RR;
    const x=Math.round(s.x+Math.cos(a)*r)+0.5,z=Math.round(s.z+Math.sin(a)*r)+0.5;if(city&&(Math.abs(x-s.x)<10||Math.abs(z-s.z)<10))continue;
    const hw=4+Math.floor(hash(k,Math.round(s.x),403)*3),hd=5+Math.floor(hash(k,Math.round(s.z),404)*3);if(!ok(x,z,hw,hd))continue;const h=flat(x,z,hw,hd);if(h==null)continue;
    rects.push([x,z,hw,hd]);plots.push({x,z,hw,hd,h,crop:CROPS[Math.floor(hash(k,7,405)*4)],ax:hash(k,9,406)<0.5?0:1})}
  // chaty rolników przy co drugim polu, wiatraki (miasto max 2, wieś 1)
  plots.forEach((p,i)=>{const dir=Math.atan2(p.z-s.z,p.x-s.x),far=[Math.cos(dir),Math.sin(dir)];
    if(i%2===0){for(const sg of [1,-1]){const ax=Math.abs(far[0])>Math.abs(far[1]),x=ax?p.x:p.x+sg*(p.hw+8.5),z=ax?p.z+sg*(p.hd+8.5):p.z;if(!ok(x,z,5,5))continue;const h=flat(x,z,4,4);if(h==null)continue;rects.push([x,z,5,5]);
      const rot=Math.round(Math.atan2(p.x-x,p.z-z)/(Math.PI/2))*(Math.PI/2);huts.push({x,z,h,rot});break}}
    if(mills.length<(city?2:1)&&(i%3===1||(!city&&i===plots.length-1))){const x=p.x+far[0]*(Math.max(p.hw,p.hd)+8),z=p.z+far[1]*(Math.max(p.hw,p.hd)+8);if(ok(x,z,3.5,3.5)){const h=flat(x,z,3,3);if(h!=null){rects.push([x,z,3.5,3.5]);mills.push({x:Math.round(x)+0.5,z:Math.round(z)+0.5,h})}}}});
  s.farm={plots,huts,mills};return s.farm}
const CR=1300, ccache=new Map();
function cityAt(gx,gz,sx,sz){
  const key=gx+','+gz+','+sx+','+sz;if(ccache.has(key))return ccache.get(key);let res=null;
  if(hash(gx,gz,301)<0.8){
    const cx=gx*CR+CR/2+(hash(gx,gz,302)-0.5)*CR*0.5,cz=gz*CR+CR/2+(hash(gx,gz,303)-0.5)*CR*0.5;
    for(let t=0;t<30&&!res;t++){
      const a=t*2.4,r=t*14,x=Math.round(cx+Math.cos(a)*r),z=Math.round(cz+Math.sin(a)*r);
      if(Math.hypot(x-sx,z-sz)<320)continue;
      const [h,b]=sample(x,z);if(h<WATER+2||h>WATER+26||b===0)continue;
      const Hs=52+Math.floor(hash(gx,gz,304)*14);let ok=true;const ss=[];
      for(let k=0;k<20&&ok;k++){const aa=k/20*Math.PI*2;for(const rr of [Hs*0.5,Hs,Hs*1.12]){const s=sH(x+Math.cos(aa)*rr,z+Math.sin(aa)*rr);if(s<WATER+1)ok=false;ss.push(s)}}
      if(!ok)continue;ss.sort((p,q)=>p-q);if(ss[ss.length-3]-ss[2]>12)continue;
      const KK=GEN===2?kingdomAt(x,z):null,race=KK?KK.race:(b===7||b===9)?'saurianie':(b===19||b===20)?'drowy':(b===3||b===10||b===11)?'elfy':(b===5||b===6||b===12)?'krasnoludy':(b===4||b===8)?'orkowie':(b===2&&hash(x,z,977)<0.3)?'niziolki':'ludzie';
      res={id:'C'+gx+'_'+gz,city:1,gx,gz,x:x+0.5,z:z+0.5,h:Math.max(WATER+2,ss[ss.length>>1]),b,race,kid:KK?KK.id:null,Hs,houses:[]};
      if(GEN===2){res.gen=2;let best=-1,bd=1e9;[[0,-1],[0,1],[-1,0],[1,0]].forEach(([ax,az],si)=>{for(let rr=Hs+8;rr<=Hs+100;rr+=4){const px=x+ax*rr,pz=z+az*rr;if(sample(px,pz)[0]<WATER-1){if(rr<bd){bd=rr;best=si}break}}});if(best>=0){res.port=best;res.portD=bd}}
      farmsOf(res);
    }
  }
  ccache.set(key,res);return res;
}
function cityNear(wx,wz,sx,sz,pad){const gx=Math.floor(wx/CR),gz=Math.floor(wz/CR);for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const c=cityAt(gx+dx,gz+dz,sx,sz);if(c&&Math.abs(c.x-wx)<c.Hs+pad&&Math.abs(c.z-wz)<c.Hs+pad)return c}return null}
// ===== drogi: każda osada łączy się z 2 najbliższymi (deterministycznie) =====
function settlementsAround(wx,wz,R,sx,sz){const out=[],rx0=Math.floor((wx-R)/VR),rx1=Math.floor((wx+R)/VR),rz0=Math.floor((wz-R)/VR),rz1=Math.floor((wz+R)/VR);
  for(let rz=rz0;rz<=rz1;rz++)for(let rx=rx0;rx<=rx1;rx++){const v=villageAt(rx,rz,sx,sz);if(v&&Math.abs(v.x-wx)<R&&Math.abs(v.z-wz)<R)out.push(v)}
  const g0=Math.floor((wx-R)/CR),g1=Math.floor((wx+R)/CR),h0=Math.floor((wz-R)/CR),h1=Math.floor((wz+R)/CR);
  for(let gz=h0;gz<=h1;gz++)for(let gx=g0;gx<=g1;gx++){const c=cityAt(gx,gz,sx,sz);if(c&&Math.abs(c.x-wx)<R&&Math.abs(c.z-wz)<R)out.push(c)}
  return out}
const nbCache=new Map();
function neighbours(s,sx,sz){if(nbCache.has(s.id))return nbCache.get(s.id);const l=settlementsAround(s.x,s.z,760,sx,sz).filter(o=>o.id!==s.id).map(o=>[Math.hypot(o.x-s.x,o.z-s.z),o]).filter(q=>q[0]<760).sort((a,b)=>a[0]-b[0]).slice(0,GEN===2?(s.city?4:3):(s.city?3:2)).map(q=>q[1]);nbCache.set(s.id,l);return l}
function gateOf(s,tx,tz){if(!s.city)return[s.x,s.z];const dx=tx-s.x,dz=tz-s.z;return Math.abs(dx)>Math.abs(dz)?[s.x+Math.sign(dx)*(s.Hs+3),s.z]:[s.x,s.z+Math.sign(dz)*(s.Hs+3)]}
const roadCache=new Map();
function roadPts(a,b){const key=a.id<b.id?a.id+'|'+b.id:b.id+'|'+a.id;if(roadCache.has(key))return roadCache.get(key);
  const A=a.id<b.id?a:b,Bb=a.id<b.id?b:a,p0=gateOf(A,Bb.x,Bb.z),p2=gateOf(Bb,A.x,A.z),dx=p2[0]-p0[0],dz=p2[1]-p0[1],L=Math.hypot(dx,dz)||1,h=(hash(Math.round(A.x),Math.round(Bb.z),411)-0.5)*L*0.28;
  // wybór przebiegu omijającego wodę: kilka łuków, wygrywa ten z najkrótszym odcinkiem po wodzie; zbyt długa przeprawa = brak drogi
  const mk=hh=>{const p1=[(p0[0]+p2[0])/2-dz/L*hh,(p0[1]+p2[1])/2+dx/L*hh],P=[];for(let i=0;i<=14;i++){const t=i/14,u=1-t;P.push([u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0],u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1]])}return P};
  const wetLen=P=>{let w=0,run=0,mx=0;for(let i=0;i<P.length-1;i++){const a=P[i],c=P[i+1],l=Math.hypot(c[0]-a[0],c[1]-a[1]),n=Math.max(1,Math.ceil(l/3));for(let k=0;k<n;k++){const t=k/n,sr=sample(a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t);if(sr[0]<WATER||sr[2]){w+=l/n;run+=l/n;if(run>mx)mx=run}else run=0}}return[w,mx]};
  let pts=null,bw=1e9,bm=0;for(const hh of [h,0,-h,L*0.42,-L*0.42,L*0.7,-L*0.7]){const P=mk(hh),[w,m]=wetLen(P);if(w<bw-0.5){bw=w;bm=m;pts=P}if(w===0)break}
  if(bm>28){roadCache.set(key,null);return null}
  const r={id:key,pts,a:A.id,b:Bb.id,an:A.city?1:0,bn:Bb.city?1:0};
  {const br=[];let run=null;for(let i=0;i<pts.length-1;i++){const a=pts[i],c=pts[i+1],L=Math.hypot(c[0]-a[0],c[1]-a[1]),n=Math.max(1,Math.ceil(L/1.5));for(let k=0;k<n;k++){const t=k/n,px=a[0]+(c[0]-a[0])*t,pz=a[1]+(c[1]-a[1])*t,sr=sample(px,pz),wet=sr[0]<WATER||!!sr[2];if(wet&&!run)run=[px,pz,px,pz,sr[2]||0];else if(wet)run[2]=px,run[3]=pz;else if(run){if(Math.hypot(run[2]-run[0],run[3]-run[1])>1.5)br.push([run[0]-(c[0]-a[0])/L*3,run[1]-(c[1]-a[1])/L*3,run[2]+(c[0]-a[0])/L*3,run[3]+(c[1]-a[1])/L*3,run[4]]);run=null}}}if(br.length)r.br=br}
  roadCache.set(key,r);return r}
function roadsNear(wx,wz,R,sx,sz){const S=settlementsAround(wx,wz,R+800,sx,sz),seen=new Map();
  for(const s of S)for(const o of neighbours(s,sx,sz)){const r=roadPts(s,o);if(!r||seen.has(r.id))continue;
    let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(const p of r.pts){x0=Math.min(x0,p[0]);x1=Math.max(x1,p[0]);z0=Math.min(z0,p[1]);z1=Math.max(z1,p[1])}
    if(x1<wx-R||x0>wx+R||z1<wz-R||z0>wz+R)continue;seen.set(r.id,r)}
  return[...seen.values()]}
function segDist(px,pz,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],l2=dx*dx+dz*dz||1;let t=((px-a[0])*dx+(pz-a[1])*dz)/l2;t=t<0?0:t>1?1:t;return Math.hypot(px-a[0]-t*dx,pz-a[1]-t*dz)}

function findSpawn(){
  for(let r=0;r<4000;r+=24)for(let a=0;a<Math.PI*2;a+=0.35){
    const x=Math.round(Math.cos(a)*r), z=Math.round(Math.sin(a)*r), [h,b]=sample(x,z);
    if(b===2||b===3){return {x:x+0.5,z:z+0.5,h}}
  }
  return {x:0.5,z:0.5,h:sample(0,0)[0]};
}

self.onmessage=e=>{
  const m=e.data; if((m.gen||1)!==GEN){GEN=m.gen||1;SEED=-1;vcache.clear();scache.clear();ccache.clear();nbCache.clear();roadCache.clear()} setSeed(m.seed);
  if(m.type==='spawn'){self.postMessage({type:'spawn',id:m.id,seed:m.seed,...findSpawn()});return}
  if(m.type==='city'){self.postMessage({type:'city',list:m.cells.map(([gx,gz])=>({gx,gz,c:cityAt(gx,gz,m.sx,m.sz)}))});return}
  if(m.type==='roads'){self.postMessage({type:'roads',list:roadsNear(m.x,m.z,m.r,m.sx,m.sz)});return}
  if(m.type==='str'){self.postMessage({type:'str',list:m.cells.map(([gx,gz])=>({gx,gz,s:structAt(gx,gz,m.sx,m.sz)}))});return}
  if(m.type==='kingdoms'){self.postMessage({type:'kingdoms',list:m.cells.map(([gx,gz])=>kingdomCell(gx,gz))});return}
  if(m.type==='vill'){self.postMessage({type:'vill',list:m.regions.map(([rx,rz])=>({rx,rz,v:villageAt(rx,rz,m.sx,m.sz)}))});return}
  const r=build(m.cx,m.cz,m.lod,m.sx,m.sz,m.dig);
  if(m.type==='hmap'){self.postMessage({type:'hmap',cx:m.cx,cz:m.cz,seed:m.seed,heights:r.heights,biomes:r.biomes,wlev:r.wlev},[r.heights.buffer,r.biomes.buffer,r.wlev.buffer]);return}
  self.postMessage({type:'chunk',id:m.id,cx:m.cx,cz:m.cz,lod:m.lod,seed:m.seed,dg:m.dig&&m.dig.length?1:0,...r},[r.pos.buffer,r.nor.buffer,r.col.buffer,r.idx.buffer,r.heights.buffer,r.biomes.buffer,r.decos.buffer,r.thumb.buffer,r.slabs.buffer,r.wlev.buffer,r.wpos.buffer,r.wuv.buffer,r.widx.buffer,r.falls.buffer]);
};
