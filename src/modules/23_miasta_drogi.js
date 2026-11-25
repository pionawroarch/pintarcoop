// =================== MIASTA, DROGI, RUCH NA DROGACH ===================
Object.assign(HT,{kamienica:[kamienicaGen,2,2,2,5,48,64],podcienia:[podcieniaGen,3,3,3,5,64,64],rez:[rezGen,2,2,16,24,96,96]});
const CITYN={niziolki:['Wielki Pagórek','Miodowa Dolina','Zielony Gród','Jabłoniec','Słoneczna Kotlina'],drowy:['Menzoberran','Zhaerith','Velkyndar','Ilphukiir','Shar\'Nethra'],saurianie:['Tlaxkoatl','Ssirakhar','Ixtlapan','Quetzhaal','Zhar-Tlan'],ludzie:['Złotogród','Mirogród','Białogród','Wilkogród','Dębogród','Srebrnogród','Lwigród'],elfy:['Aelthalor','Silvaneth','Lithmiriel','Caelandor'],krasnoludy:['Żelazna Twierdza','Kamienny Gród','Głębia Brokka','Miedziany Szczyt'],orkowie:['Gor-Mazgul','Ugrathak','Krag-Morok','Dhu-Zagash']};

// poziomy miasta (tarasy): pierścienie wokół centrum, zamek na najwyższym tarasie; ulice przechodzą między poziomami schodami
/*CITYPLAN*/
function cityLvl(c,dx,dz,street){return cityPlan(c).lvlAt(dx,dz,street)}
const CR=1300;
// scalanie siatek obróconych wokół osi Y (mury po skosie, wystrój domów stojących pod dowolnym kątem)
function geoRotMerge(base,parts){const G=[base,...parts.map(p=>p.g)].filter(Boolean);let n=0;for(const g of G)n+=g.attributes.position.count;
  const pos=new Float32Array(n*3),nor=new Float32Array(n*3),col=new Float32Array(n*3),aT=new Uint8Array(n*2);let o=0;
  const put=(g,ang,tx,tz)=>{const P=g.attributes.position.array,N=g.attributes.normal.array,C=g.attributes.color.array,A=g.attributes.aT?g.attributes.aT.array:null,c=Math.cos(ang||0),sn=Math.sin(ang||0),m=g.attributes.position.count;
    for(let i=0;i<m;i++){const x=P[i*3],z=P[i*3+2],nx=N[i*3],nz=N[i*3+2],q=(o+i)*3;pos[q]=x*c+z*sn+(tx||0);pos[q+1]=P[i*3+1];pos[q+2]=-x*sn+z*c+(tz||0);nor[q]=nx*c+nz*sn;nor[q+1]=N[i*3+1];nor[q+2]=-nx*sn+nz*c;col[q]=C[i*3];col[q+1]=C[i*3+1];col[q+2]=C[i*3+2];if(A){aT[(o+i)*2]=A[i*2];aT[(o+i)*2+1]=A[i*2+1]}}o+=m};
  if(base)put(base,0,0,0);for(const p of parts)if(p.g)put(p.g,p.ang,p.x,p.z);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.BufferAttribute(nor,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.setAttribute('aT',new THREE.BufferAttribute(aT,2));geo.computeBoundingSphere();geo.computeBoundingBox();
  for(const g of parts)if(g.g&&g.g!==base)g.g.dispose();return geo}
// prostokąty obrócone: czy nachodzą (twierdzenie o osi rozdzielającej)
function obbHit(a,b,m){const ax=[[Math.cos(a.r),-Math.sin(a.r)],[Math.sin(a.r),Math.cos(a.r)],[Math.cos(b.r),-Math.sin(b.r)],[Math.sin(b.r),Math.cos(b.r)]],dx=b.x-a.x,dz=b.z-a.z;
  for(const [ux,uz] of ax){const pa=a.hw*Math.abs(ux*Math.cos(a.r)-uz*Math.sin(a.r))+a.hd*Math.abs(ux*Math.sin(a.r)+uz*Math.cos(a.r)),pb=b.hw*Math.abs(ux*Math.cos(b.r)-uz*Math.sin(b.r))+b.hd*Math.abs(ux*Math.sin(b.r)+uz*Math.cos(b.r));if(Math.abs(dx*ux+dz*uz)>pa+pb+(m||0))return false}return true}
function setupCity(c){
  const r=rngOf('city'+c.id),Hs=c.Hs,pl=cityPlan(c);c.name=rpick(r,CITYN[c.race]);c.lvl=villLvl(c);c.houses=[];c.yards=[];
  c.sty=c.port!=null?'port':[4,15,28,8,31,16].includes(c.b)?'pustynia':[5,12,21,22,23,24].includes(c.b)?'polnoc':[9,26,30,7].includes(c.b)?'tropik':c.b===6?'gory':'';
  const K=pl.castle,LV0=c.lv?c.lv[0]:0;
  c.houses.push({x:c.x+K.x,z:c.z+K.z,rot:K.rot,top:c.h+LV0+1.0*K.ksc,bot:c.h-1,type:'rez',v:0,castle:1,kcastle:1,ksc:K.ksc,func:'zamek'});
  // zróżnicowanie architektury: pierścienie (centrum kamienice, przedmieścia chałupy), profil miasta, palety fasad
  const CRT=[['kamienica','kamienica','podcienia','wiezaDom','kamienica'],['kamienica','podcienia','dom','dom','wiezaDom'],['dom','dom','chalupa','chalupa','kamienica'],['chalupa','dom','chata','chalupa']],
    CPROF={shift:[0,0,-1,1][Math.floor(r()*4)]},human=c.race==='ludzie'||c.race==='niziolki',BIOALT={pustynia:['ochra','rozowy'],polnoc:['lupek','bialy'],tropik:['bialy','zielony','rozowy'],gory:['lupek','cegla'],port:['bialy','cegla','niebieski']},
    CPAL=human?(c.sty?{inner:c.sty,outer:c.sty,alt:BIOALT[c.sty]||[c.sty]}:(()=>{const A=['','cegla','bialy','ochra','zielony','lupek','rozowy','niebieski'],i=Math.floor(r()*A.length),j=(i+1+Math.floor(r()*(A.length-1)))%A.length;return{inner:A[i],outer:A[j],alt:A}})()):null;c.cprof=CPROF.shift;
  const ringOf=(x,z)=>{const p=pl.rhoN(x,z);return p<pl.BND[0]?0:p<pl.BND[1]?1:p<pl.BND[2]?2:3};
  // dzielnice o płynnych granicach: najbliższe „serce” dzielnicy (z lekkim zawirowaniem)
  const DS=[{k:'zamek',x:K.x,z:K.z,w:0.85},{k:'rynek',x:pl.M[0],z:pl.M[1],w:0.75}],ka=Math.atan2(K.z,K.x);
  {const kinds=[];if(c.port!=null)kinds.push(['port',[[0,-1],[0,1],[-1,0],[1,0]][c.port]]);for(const k of ['slumsy','rzem','rzem','slumsy'])kinds.push([k,null]);
   const n=Math.min(4,kinds.length);let a0=ka+Math.PI/n;for(let i=0;i<n;i++){let [k,dir]=kinds[i],a=dir?Math.atan2(dir[1],dir[0]):a0+i*(Math.PI*2-0.9)/n+(r()-0.5)*0.4;if(!dir&&Math.abs(((a-ka+Math.PI*3)%(Math.PI*2))-Math.PI)<0.5)a+=0.6;const rr=pl.R(a)*0.66;DS.push({k,x:Math.cos(a)*rr,z:Math.sin(a)*rr,w:1})}}
  const wph=r()*6.28,distAt=(x,z)=>{const wx=x+7*Math.sin(z*0.045+wph),wz=z+7*Math.sin(x*0.045-wph);let b=null,bd=1e9;for(const d of DS){const q=Math.hypot(wx-d.x,wz-d.z)*d.w;if(q<bd){bd=q;b=d}}return b.k};
  const DT={zamek:[['kamienica','dom'],['wiezaDom','dom'],['kamienica','kaplica'],['podcienia','dom']],rynek:[['kupiec','sklep'],['podcienia','sklep'],['karczma','karczma'],['kamienica','dom'],['podcienia','dom']],port:[['chata','spichlerz'],['chalupa','warsztat'],['kupiec','sklep'],['chata','spichlerz']],slumsy:[['chata','dom'],['chalupa','dom'],['chata','dom']],rzem:[['chalupa','kuznia'],['dom','warsztat'],['chalupa','piekarnia'],['kamienica','dom']]};
  // zajęte miejsca (obrócone prostokąty w układzie lokalnym miasta)
  const occ=[{x:K.x,z:K.z,hw:23*K.ksc+2,hd:23*K.ksc+2,r:0}];
  const footOK=(x,z,rot,hw,hd,needLv)=>{const cs=Math.cos(rot),sn=Math.sin(rot);let lv=null;
    for(let u=-1;u<=1.001;u+=0.5)for(let w=-1;w<=1.001;w+=0.5){const lx=u*hw*0.92,lz=w*hd*0.92,px=x+lx*cs+lz*sn,pz=z-lx*sn+lz*cs;if(pl.rho(px,pz)>0.935)return false;if(Math.hypot(px-pl.M[0],pz-pl.M[1])<pl.PR+1)return false;if(pl.streetAt(px,pz))return false;if(pl.inK(px,pz,3))return false;const l=cityLvl(c,px,pz,false);if(lv===null)lv=l;else if(l!==lv)return false}
    const R={x,z,hw,hd,r:rot};for(const o of occ)if(obbHit(R,o,0.3))return false;return lv};
  // arena przy ulicy (główna lub pierścień), wejściem do ulicy
  let ah=null;{const cand=[];for(const s of pl.ST){if(s.k<2)continue;for(let i=1;i<s.p.length-1;i+=1){const [x0,z0]=s.p[i],[x1,z1]=s.p[i+1],tx=x1-x0,tz=z1-z0,tl=Math.hypot(tx,tz)||1;for(const sd of [1,-1]){const nx=-tz/tl*sd,nz=tx/tl*sd,x=x0+nx*(s.w/2+11.5),z=z0+nz*(s.w/2+11.5),p=pl.rho(x,z);if(p<0.28||p>0.78)continue;cand.push([x,z,Math.atan2(-nx,-nz)])}}}
    for(let i=cand.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[cand[i],cand[j]]=[cand[j],cand[i]]}
    for(const [x,z,rot] of cand){const lv=footOK(x,z,rot,10.8,10.8);if(lv===false)continue;ah={x:c.x+Math.round(x*2)/2,z:c.z+Math.round(z*2)/2,rot,top:c.h+lv,bot:c.h+lv-1,type:'kupiec',func:'arena',arena:1};occ.push({x,z,hw:11.5,hd:11.5,r:rot});break}
    if(ah)c.houses.push(ah);c._ah=ah}
  try{if(c.gen===2)for(const h of lmPlace(c,pl,r,footOK,occ,distAt))c.houses.push(h)}catch(e){console.warn('budynki',e)}
  // domy wzdłuż ulic: fronty do ulicy, obie strony, odstępy zmienne
  const order=pl.ST.map((s,i)=>[s,i]).sort((a,b)=>b[0].k-a[0].k);let nH=0;const MAXH=Math.round(Hs*3.3);/* v154: gęstsza zabudowa (było 2,3) */
  for(const [s] of order){if(s.k>=4)continue;for(const sd of [1,-1]){let acc=2+r()*3;for(let i=0;i<s.p.length-1&&nH<MAXH;i++){const [x0,z0]=s.p[i],[x1,z1]=s.p[i+1],tx=x1-x0,tz=z1-z0,tl=Math.hypot(tx,tz);if(tl<0.01)continue;let t=acc;
      while(t<tl&&nH<MAXH){const px=x0+tx*t/tl,pz=z0+tz*t/tl,nx=-tz/tl*sd,nz=tx/tl*sd,dk=c.gen===2?distAt(px,pz):null,rg=Math.max(0,Math.min(3,ringOf(px,pz)+CPROF.shift));let ty,fn;
        if(dk){const q=rpick(r,DT[dk]);ty=q[0];fn=q[1];if(fn==='dom'){const T=CRT[rg];if(r()<0.6)ty=T[Math.floor(r()*T.length)]}}else{fn=rpick(r,['dom','dom','dom','dom','kuznia','piekarnia','warsztat','spichlerz','sklep','karczma','dom','kaplica']);ty=CFTYPE[fn](r);if(fn==='dom'){const T=CRT[rg];ty=T[Math.floor(r()*T.length)]}}
        const v=Math.floor(r()*5),h={type:ty,v},core=houseCore(h),back=s.w/2+1.25+core.pd/2+r()*0.5,hx=px+nx*back,hz=pz+nz*back,rot=Math.atan2(-nx,-nz)+(r()-0.5)*0.06;
        const lv=footOK(hx,hz,rot,core.pw/2,core.pd/2);
        if(lv!==false){if(r()<0.07){c.yards.push([c.x+hx,c.z+hz]);occ.push({x:hx,z:hz,hw:core.pw/2,hd:core.pd/2,r:rot});t+=core.pw+1.5;continue}
          const hsty=CPAL?(r()<0.18?CPAL.alt[Math.floor(r()*CPAL.alt.length)]:rg<=1?CPAL.inner:CPAL.outer):c.sty;
          c.houses.push({x:c.x+hx,z:c.z+hz,rot,top:c.h+lv,bot:c.h+lv-1,type:ty,func:fn,city:1,v,sty:hsty,dist:dk||undefined});occ.push({x:hx,z:hz,hw:core.pw/2,hd:core.pd/2,r:rot});nH++;t+=core.pw+0.6+r()*2.2}
        else t+=1.6}
      acc=t-tl}}}
  // zabudowa w głębi kwartałów: domy frontem do najbliższej ulicy (podwórza, tylne rzędy)
  {const DIRS=[];for(let k=0;k<16;k++){const a=k/16*Math.PI*2;DIRS.push([Math.cos(a),Math.sin(a)])}
   for(let gz=-Hs;gz<=Hs&&nH<MAXH;gz+=7)for(let gx=-Hs;gx<=Hs&&nH<MAXH;gx+=7){const px=gx+(r()-0.5)*4,pz=gz+(r()-0.5)*4;if(pl.rho(px,pz)>0.92||pl.streetAt(px,pz))continue;let best=null,bd=99;
     for(const [dx,dz] of DIRS){for(let d=2;d<=18;d+=1){if(pl.streetAt(px+dx*d,pz+dz*d)){if(d<bd){bd=d;best=[dx,dz]}break}}}if(!best)continue;
     const dk=c.gen===2?distAt(px,pz):null,rg=Math.max(0,Math.min(3,ringOf(px,pz)+CPROF.shift));let ty,fn;if(dk){const q=rpick(r,DT[dk]);ty=q[0];fn=q[1];if(fn==='dom'){const T=CRT[rg];if(r()<0.7)ty=T[Math.floor(r()*T.length)]}}else{fn=rpick(r,['dom','dom','dom','warsztat','spichlerz','dom']);ty=CFTYPE[fn](r);if(fn==='dom'){const T=CRT[rg];ty=T[Math.floor(r()*T.length)]}}
     const v=Math.floor(r()*5),core=houseCore({type:ty,v}),rot=Math.atan2(best[0],best[1])+(r()-0.5)*0.08;const lv=footOK(px,pz,rot,core.pw/2,core.pd/2);if(lv===false)continue;
     const hsty=CPAL?(r()<0.18?CPAL.alt[Math.floor(r()*CPAL.alt.length)]:rg<=1?CPAL.inner:CPAL.outer):c.sty;c.houses.push({x:c.x+px,z:c.z+pz,rot,top:c.h+lv,bot:c.h+lv-1,type:ty,func:fn,city:1,v,sty:hsty,dist:dk||undefined});occ.push({x:px,z:pz,hw:core.pw/2,hd:core.pd/2,r:rot});nH++}}
  /* v154: puste place w kwartałach — druga, gęstsza runda małych domów, potem ogrodzone podwórka (ogródki, studnie, kurniki, sady) */
  {const SM=['chalupa','chata','dom'];for(let gz=-Hs;gz<=Hs&&nH<MAXH;gz+=5)for(let gx=-Hs;gx<=Hs&&nH<MAXH;gx+=5){const px=gx+(r()-0.5)*3,pz=gz+(r()-0.5)*3;if(pl.rho(px,pz)>0.9||pl.streetAt(px,pz))continue;
      let best=null,bd=99;for(let k=0;k<16;k++){const a=k/16*Math.PI*2,dx=Math.cos(a),dz=Math.sin(a);for(let d=2;d<=26;d+=1){if(pl.streetAt(px+dx*d,pz+dz*d)){if(d<bd){bd=d;best=[dx,dz]}break}}}if(!best)continue;
      const ty=SM[Math.floor(r()*SM.length)],v=Math.floor(r()*5),core=houseCore({type:ty,v}),rot=Math.atan2(best[0],best[1])+(r()-0.5)*0.1,lv=footOK(px,pz,rot,core.pw/2,core.pd/2);if(lv===false)continue;
      const rg=Math.max(0,Math.min(3,ringOf(px,pz)+CPROF.shift)),hsty=CPAL?(r()<0.18?CPAL.alt[Math.floor(r()*CPAL.alt.length)]:rg<=1?CPAL.inner:CPAL.outer):c.sty;
      c.houses.push({x:c.x+px,z:c.z+pz,rot,top:c.h+lv,bot:c.h+lv-1,type:ty,func:r()<0.15?'warsztat':'dom',city:1,v,sty:hsty});occ.push({x:px,z:pz,hw:core.pw/2,hd:core.pd/2,r:rot});nH++}
   let ny=0;for(let gz=-Hs;gz<=Hs&&ny<220;gz+=6)for(let gx=-Hs;gx<=Hs&&ny<220;gx+=6){const px=gx+(r()-0.5)*2,pz=gz+(r()-0.5)*2;if(pl.rho(px,pz)>0.9)continue;const lv=footOK(px,pz,0,4.5,4.5);if(lv===false)continue;c.yards.push([c.x+px,c.z+pz]);occ.push({x:px,z:pz,hw:4.5,hd:4.5,r:0});ny++}}
  c.districts=DS.map(d=>({k:d.k,n:DNAME[d.k]||d.k,x:c.x+d.x,z:c.z+d.z}));
  if(c.gen===2&&c.port!=null){const ps=[[0,-1],[0,1],[-1,0],[1,0]][c.port];c.pier={a:[c.x+ps[0]*(Hs+2),c.z+ps[1]*(Hs+2)],b:[c.x+ps[0]*((c.portD||Hs+24)+8),c.z+ps[1]*((c.portD||Hs+24)+8)],y:WATER+1.35,w:2.0}}
  for(const h of c.houses){const k=h.kcastle?{w:20.9*h.ksc,d:25.2*h.ksc,ox:0,oz:-0.1*h.ksc,front:12.5*h.ksc,pw:46*h.ksc,pd:46*h.ksc}:h.arena?{w:19,d:19,ox:0,oz:0,front:9.5,pw:21,pd:21}:h.big?lmCore(h):houseCore(h);h.core=k;h.cx=h.x+k.ox*Math.cos(h.rot)+k.oz*Math.sin(h.rot);h.cz=h.z-k.ox*Math.sin(h.rot)+k.oz*Math.cos(h.rot)}
  // kolizje zamku: mury kurtynowe, wieże narożne i bramne (dziedziniec dostępny przez bramę; pałac+donżon to bryła rdzenia)
  {const kc=c.houses.find(h=>h.kcastle);if(kc){c.cols=c.cols||[];const k=kc.ksc,cs=Math.cos(kc.rot),sn=Math.sin(kc.rot),HK=(KC_STY[c.race]||KC_STY.ludzie).hk,top=kc.top+9*HK*k,ttop=kc.top+(9*HK+8)*k;
    const add=(lx,lz,w,d,t)=>{const x=kc.x+(lx*cs+lz*sn)*k,z=kc.z+(-lx*sn+lz*cs)*k,rw=Math.abs(cs)>0.5?w:d,rd=Math.abs(cs)>0.5?d:w;c.cols.push([x,z,rw/2*k,rd/2*k,t,1])};
    add(0,-17,34,2,top);add(-17,0,2,34,top);add(17,0,2,34,top);add(-10,17,14,2,top);add(10,17,14,2,top);
    for(const sx of [-1,1])for(const sz of [-1,1])add(sx*17,sz*17,7.6,7.6,ttop);for(const sx of [-1,1])add(sx*5,17.5,6,6,ttop);
    add(-12,10,3,8,kc.top+0.8*k);add(12,10,3,8,kc.top+0.8*k);add(-13.4,-6,4.4,13,kc.top+7*k);add(13.4,-6,4.4,13,kc.top+7*k);for(const [x,z] of [[-17,0],[17,0],[0,-17]])add(x,z,4.8,4.8,ttop);add(7,13.5,1.9,1.9,kc.top+3*k);for(const sx of [-1,1]){add(sx*7.2,24.6,1.6,3.9,kc.top+2.4*k);add(sx*3.5,13.2,0.8,0.8,kc.top+5*k);add(sx*12,6.9,0.5,0.5,kc.top+3*k);add(sx*4.5,21.6,2.9,2.9,kc.top+7*k)}}}
  // mury po nieregularnym obrysie: odcinki między wierzchołkami (przerwa na bramę na osiach), baszty co drugi wierzchołek, bramy z wieżami
  const T=9,th=2.4,NV=pl.V.length,WS=[];
  for(let k=0;k<NV;k++){const A=pl.V[k],B=pl.V[(k+1)%NV];let ax=A[0],az=A[1],bx=B[0],bz=B[1];const dx=bx-ax,dz=bz-az,L=Math.hypot(dx,dz),ux=dx/L,uz=dz/L;
    if(A[2]){ax+=ux*3.6;az+=uz*3.6}if(B[2]){bx-=ux*3.6;bz-=uz*3.6}const len=Math.hypot(bx-ax,bz-az);if(len<1)continue;
    const mx=(ax+bx)/2,mz=(az+bz)/2,onx=uz,onz=-ux,o=(onx*mx+onz*mz)>0?1:-1;const nx=onx*o,nz=onz*o;WS.push([c.x+mx,c.z+mz,len+(A[2]||B[2]?0:0.9),th,c.h+T,Math.atan2(nx,nz)])}
  c.wsegs=WS;c.walls=[];for(const [x,z,len,t2,top,ang] of WS){const ux=Math.cos(ang),uz=-Math.sin(ang),n=Math.max(1,Math.ceil(len/1.8));for(let i=0;i<n;i++){const a=-len/2+(i+0.5)*len/n;c.walls.push([x+ux*a,z+uz*a,1.35,1.35,top])}}
  c.towers=[];for(let k=0;k<NV;k++){const V=pl.V[k];if(V[2])continue;if(k%2===0)c.towers.push([c.x+V[0],c.z+V[1],k%(NV/8)===0?3.4:2.6,k%(NV/8)===0?3.4:2.6,c.h+(k%(NV/8)===0?16:14.5)])}
  c.towers=c.towers.concat([[0,-Hs],[0,Hs],[-Hs,0],[Hs,0]].flatMap(([x,z])=>x===0?[[c.x-5.4,c.z+z,2.2,2.2,c.h+13.5],[c.x+5.4,c.z+z,2.2,2.2,c.h+13.5]]:[[c.x+x,c.z-5.4,2.2,2.2,c.h+13.5],[c.x+x,c.z+5.4,2.2,2.2,c.h+13.5]]));
  c.cols=(c.cols||[]).concat(c.walls,c.towers);
  c.npcs=genCityNpcs(c);addFarms(c);
}
// targ na rynku miasta: 8 kramów na pierścieniu placu (z dala od dróg), sprzedawca za ladą twarzą do środka
const MKT_A=[0.55,1.02,2.12,2.59,3.69,4.16,5.26,5.73],MKT_R=11.5;
function mktM(c){if(!c.city)return[c.x,c.z];const M=cityPlan(c).M;return[c.x+M[0],c.z+M[1]]}
function mktSlot(c,i){const [mx,mz]=mktM(c),a=MKT_A[i],x=mx+Math.cos(a)*MKT_R,z=mz+Math.sin(a)*MKT_R;return[x,z,Math.atan2(mx-x,mz-z)]}
function stallBoxes(n){const mk=n.mk||(n.rare?'rare':['rozne','chleb','sery'][Math.abs(strHash(n.id||'x'))%3]);
  const AW={owoce:'#3f8a4a',sukno:'#3f6fa8',ziola:'#6a8a3a',garnki:'#a8452f',chleb:'#c88a2a',sery:'#d0a030',rozne:'#c0503a',rare:'#7a3a8a'}[mk]||'#c0503a',CR='#efe6d0',WD='#8f5a2a',WD2='#6b4528',WD3='#4a2f1d';
  const L=[[0,0.5,0,2.4,1.0,0.9,WD],[0,1.03,0,2.56,0.06,1.04,WD2],[0,0.12,0.46,2.42,0.1,0.02,WD3]];
  for(const y of [0.38,0.7])L.push([0,y,0.455,2.38,0.035,0.02,'#7a4a24']);for(const x of [-1.15,1.15])L.push([x,0.5,0.46,0.08,1.0,0.03,WD3]);
  // słupki i dwuspadowa markiza w pasy z falbanką
  for(const x of [-1.2,1.2]){L.push([x,1.3,-0.45,0.11,2.6,0.11,WD3],[x,1.17,0.5,0.1,2.34,0.1,WD3])}
  for(let k=0;k<6;k++){const x=-1.25+k*0.5+0.25,c=k%2?CR:AW;L.push([x,2.62,-0.2,0.5,0.07,0.75,c+'~'],[x,2.46,0.45,0.5,0.07,0.6,c+'~'])}
  for(let k=0;k<9;k++)L.push([-1.28+k*0.32+0.16,2.34,0.78,0.3,k%2?0.16:0.22,0.03,k%2?CR:AW]);L.push([0,2.67,-0.6,2.9,0.06,0.06,WD3]);
  // szyld na wysięgniku
  L.push([-1.5,2.0,0.5,0.6,0.05,0.05,WD3],[-1.62,1.75,0.5,0.5,0.36,0.05,'#7a5030'],[-1.62,1.75,0.53,0.32,0.22,0.02,AW],[-1.62,1.75,0.47,0.32,0.22,0.02,AW]);
  // drążek z towarem podwieszonym pod markizą
  L.push([0,2.12,0.5,2.3,0.04,0.04,WD3]);
  const hang=(x,c,h,w)=>{L.push([x,2.1-h/2,0.5,0.02,0.1,0.02,'#d8c8a0'],[x,2.06-h/2-0.04,0.5,w,h,w,c])};
  if(mk==='ziola')[-0.9,-0.5,-0.1,0.3,0.7].forEach((x,i)=>{hang(x,['#5a9a3e','#8ac060','#7a6a3a','#c8a8e0','#4a7a2e'][i],0.38,0.14)});
  else if(mk==='sukno')[-0.8,0,0.8].forEach((x,i)=>{const c=['#a8452f','#3f6fa8','#e8d8a8'][i];L.push([x,1.72,0.5,0.6,0.75,0.03,c],[x,1.36,0.5,0.62,0.05,0.035,darker(c,0.8)])});
  else if(mk==='garnki')[-0.85,-0.3,0.3,0.85].forEach((x,i)=>{L.push([x,2.0,0.5,0.02,0.18,0.02,'#2a2a30'],[x,1.82,0.5,0.24,0.2,0.24,['#b8683a','#8a8a92','#c87a4a','#6a6a72'][i]])});
  else if(mk==='owoce')[-0.9,-0.4,0.15,0.65].forEach((x,i)=>{for(let k=0;k<4;k++)L.push([x,1.95-k*0.1,0.5,0.1,0.09,0.1,i%2?'#e8e0c8':'#a8452f'])});
  else if(mk==='chleb'||mk==='sery'||mk==='rozne')[-0.85,-0.3,0.3,0.85].forEach((x,i)=>{for(let k=0;k<3;k++)L.push([x,1.96-k*0.13,0.5,0.08,0.12,0.08,mk==='sery'?'#e0b040':i%2?'#a8452f':'#8a3a2a'])});
  else [-0.6,0.6].forEach(x=>{L.push([x,1.85,0.5,0.18,0.24,0.18,'#3a3a40'],[x,1.85,0.5,0.12,0.16,0.12,'#ffd27a'])});
  // towar na ladzie
  const G={owoce:[['#d84a3a',-0.8],['#f0b030',-0.3],['#86c060',0.2],['#9a4ac0',0.7]],sukno:[['#a8452f',-0.75],['#3f6fa8',-0.25],['#e8d8a8',0.25],['#5a8a3a',0.75]],ziola:[['#5a9a3e',-0.7],['#8ac060',-0.2],['#c8a8e0',0.3],['#d8c050',0.75]],garnki:[['#b8683a',-0.7],['#8a5a3a',-0.15],['#c87a4a',0.4],['#e0d0b0',0.8]]}[mk];
  if(G)G.forEach(([c,x],i)=>{if(mk==='sukno')L.push([x,1.12,0,0.42,0.16,0.7,c],[x,1.26,0,0.4,0.12,0.66,darker(c,1.12)]);else if(mk==='garnki')L.push([x,1.25,0,0.3,0.42,0.3,c],[x,1.48,0,0.18,0.06,0.18,darker(c,0.85)]);else{L.push([x,1.1,0.1,0.42,0.14,0.42,'#a87a4a']);for(let k=0;k<3;k++)L.push([x+(k-1)*0.11,1.22,0.1+(k%2)*0.08,0.12,0.12,0.12,c])}
    if(mk==='ziola')L.push([x,1.75,-0.35,0.08,0.4,0.08,c])});
  else if(mk==='chleb'){for(let k=0;k<5;k++){const x=-0.95+k*0.45;L.push([x,1.13,0.05,0.36,0.14,0.22,'#c8883a'],[x,1.21,0.05,0.3,0.04,0.16,'#e0a858'])}L.push([0.6,1.14,-0.3,0.5,0.16,0.3,'#a87a4a'],[0.6,1.25,-0.3,0.12,0.12,0.12,'#d8a050'])}
  else if(mk==='sery'){for(let k=0;k<4;k++){const x=-0.85+k*0.55;L.push([x,1.13,0,0.4,0.14,0.4,k%2?'#f0c850':'#e0b040'],[x,1.21,0,0.36,0.02,0.36,'#c89a30'])}L.push([0.9,1.2,-0.3,0.1,0.28,0.1,'#e8e2cc'])}
  else L.push([-0.6,1.1,0,0.4,0.2,0.4,'#d8b24a'],[0.5,1.1,0,0.5,0.25,0.4,'#86c060'],[0.05,1.12,0.25,0.3,0.12,0.25,'#e8e2cc'],[-0.15,1.25,-0.25,0.14,0.3,0.14,'#6a8ab8'],[0.95,1.17,-0.1,0.2,0.22,0.2,'#a83a3a']);
  // kosze i skrzynki przed straganem, worki za plecami sprzedawcy
  for(const sx of [-0.85,0.85]){const c=G?G[sx<0?0:3][0]:mk==='chleb'?'#c8883a':mk==='sery'?'#e0b040':'#86c060';L.push([sx,0.2,0.82,0.52,0.4,0.42,'#a87a4a'],[sx,0.41,0.82,0.54,0.03,0.44,'#8a6a3a']);for(let k=0;k<4;k++)L.push([sx+((k%2)-0.5)*0.22,0.47,0.82+((k>>1)-0.5)*0.18,0.15,0.12,0.15,c])}
  L.push([0.9,0.25,-0.95,0.5,0.5,0.4,'#c8b088'],[0.9,0.52,-0.95,0.3,0.06,0.25,'#a89068'],[-0.95,0.3,-0.95,0.55,0.6,0.5,'#8a6440'],[-0.95,0.3,-0.95,0.57,0.06,0.52,'#6a4a2a']);
  return L}
function genCityNpcs(c){
  const R=RACES[c.race],r=rngOf('cnpc'+c.id),list=[],pool={m:R.m.slice(),f:R.f.slice()};
  const take=fem=>{let f=fem;if(!pool[f?'f':'m'].length)f=!f;if(!pool[f?'f':'m'].length){pool.m=R.m.slice();pool.f=R.f.slice()}const p=pool[f?'f':'m'];return[f,p.splice(Math.floor(r()*p.length),1)[0]]};
  const add=(role,x,z,ry,roleN)=>{const [fem,name]=take(r()<0.45);list.push({id:c.id+':'+role+list.length,vid:c.id,role,fem,name,roleN:roleN||ROLE[role][fem?1:0],x,z,ry,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth),race:c.race})};
  const S=i=>mktSlot(c,i);const [MX0,MZ0]=mktM(c);add('starszy',MX0+3,MZ0+2,r()*6,'Burmistrz');
  {const kc=c.houses.find(h=>h.kcastle);if(kc){const fx=Math.sin(kc.rot),fz=Math.cos(kc.rot),lx=fz,lz=-fx,d=26*kc.ksc;for(const [lat,dd] of [[-4.5,0],[4.5,0]])add('straz',kc.x+fx*(d+dd)+lx*lat,kc.z+fz*(d+dd)+lz*lat,kc.rot,'Straż zamkowa');for(const [lat,lz2] of [[-2.8,15.2],[2.8,15.2]])add('straz',kc.x+(fx*lz2+lx*lat)*kc.ksc,kc.z+(fz*lz2+lz*lat)*kc.ksc,kc.rot,'Gwardia zamkowa')}}add('kupiec',...S(0));add('kupiec',...S(4));add('kowal',...S(2));
  const hs=c.houses.filter(h=>!h.castle&&!h.arena&&!h.big&&!h.kcastle);const NW=Math.min(84,Math.round(hs.length*0.3)+20);for(let i=0;i<NW&&i<hs.length;i++){const h=hs[Math.floor(r()*hs.length)],k=h.core,f=k.pd/2+2.6,lat=(k.ox+3.6)*(r()<0.5?1:-1);add('mieszk',h.x+Math.sin(h.rot)*f+Math.cos(h.rot)*lat,h.z+Math.cos(h.rot)*f-Math.sin(h.rot)*lat,h.rot)}
  const Hs=c.Hs-3.5;add('straz',c.x+2.5,c.z-Hs,Math.PI);add('straz',c.x-2.5,c.z+Hs,0);add('straz',c.x-Hs,c.z+2.5,Math.PI/2);add('straz',c.x+Hs,c.z-2.5,-Math.PI/2);
  if(r()<0.6)add('wedr',c.x+(r()-0.5)*16,c.z+(r()-0.5)*16,r()*6);
  if(c.pier){const ps=[[0,-1],[0,1],[-1,0],[1,0]][c.port],d=c.Hs-6.5;add('portowy',c.x+ps[0]*d+(ps[1]?4.5:0),c.z+ps[1]*d+(ps[0]?4.5:0),Math.atan2(ps[0],ps[1]))}
  add('najemnik',MX0+10.5,MZ0+2.2,-Math.PI/2);add('najemnik',MX0-2.2,MZ0-10.5,0);
  /* v107: tłum na rynku i ludzie przed dużymi budynkami */for(let i=0;i<12;i++){const a2=r()*6.283,d=4+r()*9;add('mieszk',MX0+Math.cos(a2)*d,MZ0+Math.sin(a2)*d,r()*6.28)}
  for(const h of c.houses){if(!h.big)continue;const fx=Math.sin(h.rot),fz=Math.cos(h.rot),f=h.core.front+3.5;for(let k=0;k<2;k++){const lat=(k?2.2:-2.2)+(r()-0.5);add('mieszk',h.x+fx*f+fz*lat,h.z+fz*f-fx*lat,h.rot)}}
  {const MK=[['owoce','Przekupka owocami','Przekupień owoców'],['sukno','Handlarka suknem','Handlarz suknem'],['ziola','Zielarka','Zielarz'],['garnki','Garncarka','Garncarz']];[1,3,5,7].forEach((si,k)=>{const [x,z,ry]=S(si);add('kupiec',x,z,ry);const n=list[list.length-1];n.mk=MK[k][0];n.roleN=MK[k][n.fem?1:2];n.qg=false})}
  assignQG(list);for(const n of list)if(n.role==='najemnik')n.merc=mercOffer(n,c);
  /* v154: więcej życia — spacerowicze na rynku, przed zamkiem i na ulicach, grupki rozmawiających (bez zleceń) */
  try{const pl=cityPlan(c),n0=list.length,free=(x,z)=>{const dx0=x-c.x,dz0=z-c.z;if(pl.rho(dx0,dz0)>0.93||pl.inK(dx0,dz0,1.5))return false;for(const h of c.houses){if(!h.core||Math.abs(h.x-x)>40||Math.abs(h.z-z)>40)continue;const cs=Math.cos(h.rot),sn=Math.sin(h.rot),dx=x-h.x,dz=z-h.z,lx=dx*cs-dz*sn,lz=dx*sn+dz*cs;if(Math.abs(lx)<h.core.pw/2+0.9&&Math.abs(lz)<h.core.pd/2+0.9)return false}return true};
    const loop=(pts)=>{if(pts.length<3||!pts.every(q=>free(q[0],q[1])))return false;add('mieszk',pts[0][0],pts[0][1],0);list[list.length-1].pp=pts;return true};
    const PR=pl.PR||12;/* v160: tylko pierścień między fontanną a kramami (kramy na ~9,9 m i PR−2,2 m) */for(let i=0,ok=0;i<30&&ok<10;i++){const rr=3.8+r()*3.4,k=5+Math.floor(r()*3),a0=r()*6.283,dir=r()<0.5?1:-1,P=[];for(let j=0;j<k;j++){const a=a0+dir*j/k*6.283;P.push([MX0+Math.cos(a)*rr,MZ0+Math.sin(a)*rr])}if(loop(P))ok++}
    const kc=c.houses.find(h=>h.kcastle);if(kc){const fx=Math.sin(kc.rot),fz=Math.cos(kc.rot),lx=fz,lz=-fx,K=kc.ksc||1;
      for(let i=0,ok=0;i<40&&ok<9;i++){const f0=(27+r()*12)*K,l0=(r()-0.5)*20*K,P=[];for(let j=0;j<4;j++){const f=f0+(r()-0.5)*9*K,l=l0+(r()-0.5)*12*K;P.push([kc.x+fx*f+lx*l,kc.z+fz*f+lz*l])}if(loop(P))ok++}
      for(let g=0,ok=0;g<12&&ok<3;g++){const f=(28+r()*10)*K,l=(r()-0.5)*18*K,x=kc.x+fx*f+lx*l,z=kc.z+fz*f+lz*l;if(!free(x,z))continue;ok++;const m=2+Math.floor(r()*2);for(let j=0;j<m;j++){const a=j/m*6.283+r()*0.4,px=x+Math.cos(a)*1.1,pz=z+Math.sin(a)*1.1;add('mieszk',px,pz,Math.atan2(x-px,z-pz));list[list.length-1].path=null}}}
    for(let g=0,ok=0;g<16&&ok<4;g++){const a=r()*6.283,d=4+r()*3,x=MX0+Math.cos(a)*d,z=MZ0+Math.sin(a)*d;if(!free(x,z))continue;ok++;const m=2+Math.floor(r()*2);for(let j=0;j<m;j++){const b=j/m*6.283+r()*0.4,px=x+Math.cos(b)*1.1,pz=z+Math.sin(b)*1.1;add('mieszk',px,pz,Math.atan2(x-px,z-pz));list[list.length-1].path=null}}
    const NS=Math.min(26,8+Math.round(c.houses.length*0.08));for(let i=0;i<NS;i++)add('mieszk',c.x,c.z,0);
    for(let i=n0;i<list.length;i++){list[i].qg=false;list[i].owl=r()<0.4}
  }catch(e){window.__cnErr=String(e)}
  return list;
}
// ===== mury w stylu ras (elfy / krasnoludy / orkowie) — te same odcinki, wieże i bramy co u ludzi (kolizje bez zmian) =====
function raceCityWall(c){const race=c.race,L=[];let SINK=L;const PARTS=[],P=(x,y,z,w,h,d,col)=>SINK.push([x,y,z,w,h,d,col]),Hs=c.Hs,r=rngOf('rcw'+c.id);
  const seg=fn=>{let si=0;for(const [x,z,len,th,top,ang] of (c.wsegs||[])){SINK=[];PARTS.push({L:SINK,ang,x:x-c.x,z:z-c.z});const H=top-c.h,e=(si++%3)*0.008;/* drobne przesunięcie co odcinek: zachodzące na siebie końce sąsiednich odcinków nie migoczą teksturą */fn((a,y,o,la,h,w,col)=>P(a,y+e,o,la,h+e*0.5,w+e*2,col),H,len,th)}SINK=L};
  const gates=fn=>{for(const [x,z,ax] of [[0,-Hs,1],[0,Hs,1],[-Hs,0,0],[Hs,0,0]]){const out=ax?Math.sign(z):Math.sign(x);fn((a,y,o,la,h,w,col)=>ax?P(x+a,y,z+o*out,la,h,w,col):P(x+o*out,y,z+a,w,h,la,col))}};
  const towers=fn=>{for(const [x,z,hw,hd,top] of c.towers)fn(x-c.x,z-c.z,hw,top-c.h,hw>3)};
  if(race==='elfy'){const ST='#ece8e0',ST2='#d8d2c6',ST3='#f4f0e8',GD='#c8a85a',TR=['#6a5032','#7a6040','#5a4428'],LF=['#3f8a4a','#4a9a50','#5aa858','#367a3e','#6cb860'],GL='#a8f0ff',FL=['#f0a8c8','#fff4e0','#c8a8f0'];
    seg((A,H,len,th)=>{A(0,0.3,0,len,0.6,th+1.2,ST2);
      // smukłe arkady: filary + łuki, ażurowe prześwity wypełnione pnączami
      const n=Math.max(2,Math.round(len/3.2)),s=len/n;for(let i=0;i<=n;i++){const a=-len/2+i*s;A(a,H/2,0,0.8,H,th*0.7,ST);A(a,0.9,0,1.1,0.6,th*0.85,ST2);A(a,H*0.62,0,1.0,0.3,th*0.8,GD)}
      for(let i=0;i<n;i++){const a=-len/2+(i+0.5)*s;A(a,H*0.25,0,s-0.8,H*0.5,th*0.45,ST3);
        for(let k=0;k<4;k++){const q=(k+0.5)/4,ya=H*0.62+Math.sin(q*Math.PI)*1.1;A(a-s/2+0.4+q*(s-0.8),ya,0,(s-0.8)/4+0.05,0.5,th*0.7,ST)}
        A(a,H*0.84,0,s,H*0.32,th*0.7,ST);A(a,H*0.62+0.2,th*0.36,s-1,0.15,0.05,'#3a7a3a');
        for(let k=0;k<3;k++){const vx=a-s/2+0.6+r()*(s-1.2),vy=H*0.5+r()*H*0.3,vl=1.2+r()*1.8;A(vx,vy-vl/2,th*0.36,0.16,vl,0.1,'#4a8a3a');A(vx,vy-vl*r(),th*0.38,0.3,0.3,0.1,FL[k%3])}}
      // łagodny daszek z liści zamiast blanków
      A(0,H+0.15,0,len+0.4,0.35,th*0.95,GD);for(let a=-len/2;a<len/2;a+=1.2){A(a+0.6,H+0.55+((Math.round(a*3))%2)*0.12,0,1.3,0.45,th*1.05,LF[Math.abs(Math.round(a*7))%5]);if(Math.abs(Math.round(a*5))%4===0)A(a+0.6,H+1.0,0,0.7,0.5,0.7,LF[4])}
      for(let a=-len/2+3;a<len/2-2;a+=6){A(a,H-1.6,th*0.45,0.12,1.2,0.12,TR[0]);A(a,H-2.4,th*0.5,0.36,0.5,0.36,GL)}});
    towers((lx,lz,hw,H,big)=>{const s=hw*1.5;P(lx,0.4,lz,s+1.6,0.8,s+1.6,ST2);
      for(let y=0.8,k=0;y<H;y+=1.2,k++){const w2=s*(1-0.12*y/H);P(lx,y+0.6,lz,w2,1.2,w2,k%5===4?GD:ST)}
      for(const [ax,az] of [[1,1],[1,-1],[-1,1],[-1,-1]]){for(let y=0.8,k=0;y<H*0.9;y+=1.3,k++)P(lx+ax*s*0.5+Math.sin(k)*0.1,y+0.65,lz+az*s*0.5,0.5,1.3,0.5,TR[k%3])}
      for(const y of [H*0.4,H*0.7]){P(lx,y,lz+s*0.48,0.5,1.2,0.1,GL);P(lx+s*0.48,y,lz,0.1,1.2,0.5,GL);P(lx,y,lz-s*0.48,0.5,1.2,0.1,GL);P(lx-s*0.48,y,lz,0.1,1.2,0.5,GL)}
      P(lx,H+0.2,lz,s+1.4,0.4,s+1.4,GD);for(let a=0;a<12;a++){const an=a/12*Math.PI*2;P(lx+Math.cos(an)*(s/2+0.5),H+0.8,lz+Math.sin(an)*(s/2+0.5),0.25,1,0.25,ST)}
      let yy=H+1.3;const n=big?9:7;for(let i=0;i<n;i++){const w2=(s+1.8)*(1-i/n)+0.3;P(lx,yy+0.4,lz,w2,0.8,w2,LF[i%5]);if(i%2===0)P(lx,yy+0.15,lz,w2+0.5,0.3,w2+0.5,LF[3]);yy+=0.8}
      P(lx,yy+0.6,lz,0.5,1.2,0.5,GL);P(lx,yy+1.4,lz,0.25,0.5,0.25,'#ffffff');P(lx,H+1.0,lz,0.3,0.3,0.3,GL)});
    gates(G=>{// brama jako dwa splecione drzewa tworzące łuk
      for(const sg of [-1,1]){for(let y=0,k=0;y<9;y+=1,k++){const lean=Math.pow(y/9,2)*2.2;G(sg*(3.8-lean),y+0.5,0,1.3,1.05,1.5,TR[k%3])}G(sg*4.4,0.4,0.6,1.4,0.6,0.6,TR[2]);G(sg*4.6,0.4,-0.7,1,0.5,0.6,TR[2])}
      G(0,9.6,0,4.2,1,1.4,TR[1]);for(let i=0;i<14;i++){const a=(r()-0.5)*9,y=9+r()*2.8,o=(r()-0.5)*2.4;G(a,y,o,1.6+r(),1.0,1.6+r(),LF[i%5])}
      for(let i=0;i<6;i++)G(-2.5+i,8.6-Math.abs(i-2.5)*0.4,0.75,0.16,1.2,0.1,'#4a8a3a'),G(-2.5+i,8.0-Math.abs(i-2.5)*0.4,0.8,0.3,0.3,0.1,FL[i%3]);
      for(const sg of [-1,1]){G(sg*2.4,7.2,0.9,0.1,1.2,0.1,TR[0]);G(sg*2.4,6.4,0.9,0.4,0.5,0.4,GL)}G(0,10.5,0.85,0.9,0.9,0.12,GL)});
    P(0,0.3,0,5,0.6,5,ST2);P(0,0.75,0,4.4,0.3,4.4,ST);P(0,0.82,0,3.8,0.08,3.8,'#5aa8c8');for(let k=0;k<3;k++)P(0,1.4+k*0.9,0,0.9-k*0.2,0.9,0.9-k*0.2,ST3);P(0,4.3,0,0.6,0.9,0.6,GL);
    for(const [x,z] of [[-7,-7],[7,7],[-7,7],[7,-7]]){P(x,0.35,z,2.6,0.7,2.6,ST2);for(let k=0;k<6;k++)P(x-0.9+(k%3)*0.9,0.9,z-0.4+Math.floor(k/3)*0.8,0.6,0.5,0.6,k%2?LF[k%5]:FL[k%3]);P(x,1.6,z,0.2,2,0.2,TR[0]);P(x,2.8,z,1.4,1.0,1.4,LF[1])}}
  else if(race==='krasnoludy'){const S=['#76716e','#6a6670','#827c78','#5f5b63'],SD='#4a4750',DK='#34323a',GD='#d9b23a',RN='#ff9a3e',IR='#3a3a40',CU='#5a9a7a',RD='#8a2a22';
    seg((A,H,len,th)=>{const T=th+1.2;A(0,0.5,0.3,len,1.6,T+1.4,DK);A(0,1.6,0.2,len,0.6,T+0.8,SD);
      // ciosy kamienne w przesuniętych rzędach (lico zewnętrzne)
      for(let y=1.9,row=0;y<H-0.6;y+=1.1,row++){let a=-len/2+(row%2?0.9:0);while(a<len/2-0.1){const l=Math.min(len/2-a,1.4+((Math.round(a*3)+row)%3)*0.5);A(a+l/2,y+0.5,T/2-0.15,l-0.08,1.0,0.5,S[(Math.round(a*7)+row)%4]);a+=l}}
      A(0,H/2+0.8,0,len,H-1.6,T-0.4,S[1]);A(0,H*0.55,T/2+0.12,len,0.35,0.15,GD);
      for(let a=-len/2+2;a<len/2-1;a+=4){A(a,H*0.55,T/2+0.22,0.5,0.5,0.1,RD)}
      // runy świecące co kilka metrów
      for(let a=-len/2+4;a<len/2-3;a+=8){A(a,H*0.32,T/2+0.13,0.12,1.4,0.06,RN);A(a-0.3,H*0.32+0.4,T/2+0.13,0.6,0.12,0.06,RN);A(a+0.25,H*0.32-0.3,T/2+0.13,0.4,0.12,0.06,RN)}
      // masywne przypory schodkowe
      for(let a=-len/2+3;a<len/2-2;a+=5.5){A(a,2.2,T/2+0.9,1.6,4.4,1.8,S[2]);A(a,5,T/2+0.55,1.3,1.4,1.1,S[0]);A(a,6.2,T/2+0.3,1.0,1,0.6,SD)}
      // płaskie, prostokątne blanki krasnoludów + gzyms
      A(0,H-0.6,0.2,len+0.2,0.6,T+0.6,SD);A(0,H-0.15,0.25,len+0.3,0.3,T+0.8,S[2]);
      const nb=Math.max(2,Math.floor(len/2.2));for(let i=0;i<nb;i++){const a=-len/2+(i+0.5)*len/nb;A(a,H+0.6,T/2,len/nb*0.62,1.2,0.8,S[i%4]);A(a,H+1.25,T/2,len/nb*0.7,0.15,0.9,SD)}
      A(0,H+0.3,-T/2+0.3,len,0.6,0.6,S[3])});
    towers((lx,lz,hw,H,big)=>{const s=hw*2+0.8;P(lx,0.6,lz,s+2,1.2,s+2,DK);P(lx,1.5,lz,s+1.2,0.6,s+1.2,SD);
      for(let y=1.8,k=0;y<H-0.5;y+=1.1,k++)P(lx,y+0.55,lz,s+(k%2?0:0.12),1.1,s+(k%2?0.12:0),S[k%4]);
      for(const y of [H*0.35,H*0.7])P(lx,y,lz,s+0.4,0.4,s+0.4,GD);
      for(const [ax,az] of [[1,0],[-1,0],[0,1],[0,-1]]){const y=H*0.52;if(ax){P(lx+ax*(s/2+0.03),y,lz,0.06,1.6,0.9,IR);for(const q of [-0.3,0,0.3])P(lx+ax*(s/2+0.08),y,lz+q,0.06,1.6,0.08,IR)}else{P(lx,y,lz+az*(s/2+0.03),0.9,1.6,0.06,IR)}P(lx+ax*(s/2+0.06),H*0.2,lz+az*(s/2+0.06),ax?0.06:0.6,0.6,ax?0.6:0.06,RN)}
      P(lx,H+0.2,lz,s+1.4,0.6,s+1.4,SD);const m=big?5:3,st=(s+1.4)/(m*2-1);for(let i=0;i<m*2-1;i+=2){const o=-(s+1.4)/2+(i+0.5)*st;for(const sg of [-1,1]){P(lx+o,H+1.1,lz+sg*((s+1.4)/2-0.4),st,1.3,0.8,S[i%4]);P(lx+sg*((s+1.4)/2-0.4),H+1.1,lz+o,0.8,1.3,st,S[(i+1)%4])}}
      // kosz ognia na szczycie i miedziana kopułka
      P(lx,H+0.8,lz,1.6,0.8,1.6,IR);P(lx,H+1.4,lz,1.2,0.6,1.2,RN);if(big){P(lx,H+2.4,lz,0.2,1.2,0.2,CU);P(lx,H+3.2,lz,2.2,0.4,2.2,CU);P(lx,H+3.6,lz,1.2,0.4,1.2,CU);P(lx,H+4.1,lz,0.4,0.6,0.4,GD)}});
    gates(G=>{// brama w kształcie kamiennej twarzy przodka z okutymi wrotami
      G(0,8.4,0.3,8.4,4,4.2,S[0]);G(0,6.5,0.4,8.6,0.5,4.4,SD);for(const sg of [-1,1]){G(sg*3.3,5,0.3,1.6,3,3.8,S[2]);G(sg*2.7,6.1,0.3,0.9,0.8,3.8,S[1])}
      G(0,9.2,2.45,5.4,2.6,0.3,S[2]);G(-1.2,9.7,2.62,1.1,0.6,0.1,DK);G(1.2,9.7,2.62,1.1,0.6,0.1,DK);G(-1.2,9.7,2.66,0.4,0.3,0.06,RN);G(1.2,9.7,2.66,0.4,0.3,0.06,RN);G(0,9.0,2.7,0.6,1.0,0.3,S[3]);
      for(let i=-2;i<=2;i++)G(i*0.55,7.6-Math.abs(i)*0.12,2.62,0.5,1.4-Math.abs(i)*0.2,0.2,'#bab4ac');G(0,10.7,2.62,5.8,0.5,0.25,GD);
      for(let i=0;i<5;i++)G(-3.6+i*1.8,10.9,1.9,1.2,1.0,0.8,S[i%4]);
      for(const sg of [-1,1]){G(sg*3.3,2.7,2.1,0.5,5.2,1.6,'#4a2f1d');for(const y of [1,2.6,4.2])G(sg*3.3,y,2.1,0.58,0.3,1.64,IR);G(sg*4.8,1,2.6,1.2,2,1.2,DK);G(sg*4.8,2.2,2.6,1.6,0.4,1.6,IR);G(sg*4.8,2.7,2.6,1,0.6,1,RN)}});
    P(0,0.4,0,5,0.8,5,S[0]);P(0,0.9,0,4,0.2,4,SD);P(0,1.6,0,1.2,1.4,1.2,DK);P(0,2.5,0,2,0.4,2,IR);P(0,2.9,0,1.2,0.5,1.2,RN);
    for(const [x,z] of [[-7,-7],[7,7],[-7,7],[7,-7]]){P(x,0.6,z,2.4,1.2,1.4,S[2]);P(x,1.3,z,2.6,0.2,1.6,SD);P(x-0.6,1.55,z,0.6,0.3,0.6,GD);P(x+0.5,1.55,z,0.7,0.3,0.4,IR);P(x,1.6,z+0.3,0.4,0.4,0.4,CU)}}
  else if(race==='orkowie'){const LG=['#5a3a22','#4a2f1d','#6a4428','#553620'],BK='#3a2414',HD=['#8a6a4a','#7a5a3a','#9a7650','#6e5236'],BN='#e8e0c8',RD='#a8302a',FI='#ff8a2e',IR='#4a4448';
    seg((A,H,len,th)=>{A(0,0.15,0,len+0.5,0.3,th+1.5,'#5a4630');
      // palisada z zaostrzonych pali o nierównej wysokości
      for(let a=-len/2+0.45;a<len/2;a+=0.9){const k=Math.round(a*11),hh=H-0.5+((k*7)%5)*0.35,lean=((k*3)%3-1)*0.06;A(a,hh/2,lean,0.85,hh,0.85,LG[Math.abs(k)%4]);A(a,hh+0.25,lean,0.55,0.5,0.55,LG[Math.abs(k+1)%4]);A(a,hh+0.65,lean,0.25,0.4,0.25,'#9a7a5a')}
      for(const y of [H*0.28,H*0.72])A(0,y,0.47,len,0.3,0.12,BK);
      // ukośne kolce przed palisadą i pomost od środka
      for(let a=-len/2+1;a<len/2-0.5;a+=1.6){A(a,0.9,1.2,0.3,0.3,1.8,LG[1]);A(a,1.25,2.1,0.18,0.2,0.6,'#9a7a5a')}
      A(0,H-2.2,-1.1,len,0.25,1.3,HD[3]);for(let a=-len/2+1;a<len/2;a+=3)A(a,(H-2.2)/2,-1.6,0.35,H-2.2,0.35,BK);
      // czaszki na palach, skóry i czerwone tarcze
      for(let a=-len/2+2.5;a<len/2-1;a+=5){const k=Math.round(a);A(a,H+1.0,0,0.7,0.6,0.7,BN);A(a-0.17,H+1.05,0.36,0.18,0.16,0.04,'#141414');A(a+0.17,H+1.05,0.36,0.18,0.16,0.04,'#141414');
        if(k%3===0){A(a+1.6,H*0.55,0.5,1.4,1.2,0.12,RD);A(a+1.6,H*0.55,0.58,0.4,0.4,0.06,BN)}else{A(a+1.4,H*0.5,0.5,1.6,1.8,0.08,HD[k&3])}}});
    towers((lx,lz,hw,H,big)=>{const s=hw*1.8,TH=H+(big?1:0);
      for(const [ax,az] of [[1,1],[1,-1],[-1,1],[-1,-1]])P(lx+ax*s/2,TH/2,lz+az*s/2,0.7,TH,0.7,LG[(ax+az+2)%4]);
      for(const y of [TH*0.3,TH*0.6]){P(lx,y,lz+s/2,s,0.25,0.25,BK);P(lx,y,lz-s/2,s,0.25,0.25,BK);P(lx+s/2,y,lz,0.25,0.25,s,BK);P(lx-s/2,y,lz,0.25,0.25,s,BK)}
      for(const sg of [-1,1]){for(let k=0;k<6;k++){const y=TH*0.05+k*TH*0.1;P(lx+sg*s/2,y+0.4,lz-s/2+k*s/6+0.4,0.15,0.15,s/3,BK)}}
      P(lx,TH,lz,s+1.2,0.4,s+1.2,HD[3]);for(let a=-s/2-0.4;a<=s/2+0.5;a+=0.8){for(const sg of [-1,1]){P(lx+a,TH+0.9,lz+sg*(s/2+0.5),0.6,1.4+(Math.round(a*5)%2)*0.3,0.6,LG[Math.abs(Math.round(a*3))%4]);P(lx+sg*(s/2+0.5),TH+0.9,lz+a,0.6,1.4,0.6,LG[Math.abs(Math.round(a*7))%4])}}
      for(const [ax,az] of [[1,1],[1,-1],[-1,1],[-1,-1]])P(lx+ax*s/2,TH+2.4,lz+az*s/2,0.3,2.8,0.3,BK);
      for(let i=0;i<3;i++){const w2=s+1.4-i*1.2;P(lx,TH+3.6+i*0.6,lz,w2,0.6,w2,HD[i%4])}P(lx,TH+5.6,lz,0.3,1.6,0.3,BK);P(lx,TH+6.6,lz,0.9,0.8,0.9,BN);P(lx-0.7,TH+6.9,lz,0.6,0.3,0.3,BN);P(lx+0.7,TH+6.9,lz,0.6,0.3,0.3,BN);
      P(lx+0.5,TH+5.9,lz,0.06,1.2,0.8,RD);if(big){P(lx,TH+0.9,lz,1,0.5,1,IR);P(lx,TH+1.3,lz,0.7,0.4,0.7,FI)}});
    gates(G=>{// brama z wielkich bali z kłami i czaszką
      for(const sg of [-1,1]){for(const o of [-0.6,0.6])G(sg*4.1,6,o,1.3,12,1.3,LG[(o>0?1:0)+(sg>0?2:0)]);G(sg*4.1,12.4,0,1.0,0.8,1.0,'#9a7a5a')}
      G(0,10.4,0,10,1.3,1.6,LG[0]);G(0,11.6,0,9,0.8,1.2,LG[2]);for(let i=-3;i<=3;i++)G(i*1.3,12.4+(i%2?0:0.5),0,0.6,1,0.6,LG[Math.abs(i)%4]);
      for(let k=0;k<5;k++){for(const sg of [-1,1])G(sg*(3.2-k*0.35),9.9-k*0.85,1.0,0.5,0.9,0.5,BN)}
      G(0,10.6,1.0,1.8,1.6,1.2,BN);G(-0.4,10.8,1.62,0.4,0.36,0.06,'#141414');G(0.4,10.8,1.62,0.4,0.36,0.06,'#141414');G(-1.5,11.3,1.0,1.2,0.4,0.4,BN);G(1.5,11.3,1.0,1.2,0.4,0.4,BN);G(-2.1,11.8,1.0,0.4,0.8,0.4,BN);G(2.1,11.8,1.0,0.4,0.8,0.4,BN);
      for(const sg of [-1,1]){G(sg*3.25,2.7,2.1,0.6,5.4,1.6,LG[3]);G(sg*3.25,1.4,2.1,0.66,0.25,1.66,BK);G(sg*3.25,4.0,2.1,0.66,0.25,1.66,BK);G(sg*5.6,1.6,1.8,0.3,3.2,0.3,BK);G(sg*5.6,3.4,1.8,0.6,0.6,0.6,FI);G(sg*5.4,6,1.2,1.4,2.6,0.08,RD)}});
    for(let k=0;k<8;k++){const a=k/8*Math.PI*2;P(Math.cos(a)*1.8,0.35,Math.sin(a)*1.8,0.9,0.7,0.9,'#6a6670')}P(0,0.4,0,2.2,0.6,2.2,FI);P(0,1.6,0,0.25,2.4,0.25,BK);for(const sg of [-1,1])P(sg*1.6,1.6,0,0.2,3.2,0.2,BK);P(0,2.9,0,3.4,0.2,0.2,BK);
    for(const [x,z] of [[-7,-7],[7,7],[-7,7],[7,-7]]){for(let k=0;k<4;k++)P(x,0.6+k*1.1,z,0.9,1.1,0.9,k===2?RD:LG[k%4]);P(x,4.8,z,1,0.9,1,BN);P(x-0.25,4.9,z+0.52,0.22,0.2,0.04,'#141414');P(x+0.25,4.9,z+0.52,0.22,0.2,0.04,'#141414');P(x-0.9,4.4,z,0.8,0.3,0.3,BN);P(x+0.9,4.4,z,0.8,0.3,0.3,BN);P(x+1.4,0.4,z,1.6,0.8,1.2,HD[1])}}
  else return null;const g=geoRotMerge(kitB(L),PARTS.map(q=>({g:q.L.length?kitB(q.L):null,ang:q.ang,x:q.x/BS,z:q.z/BS})));g.userData.raced=1;return g}
// mury i wieże w skali domów z kitu (×BS), kolorami palet: kamień, ciemny kamień, dachówka, drewno — shader sam dorysowuje faktury
function kitB(list){return voxGeo(deZ(vb(list).map(b=>[b[0]/BS,b[1]/BS,b[2]/BS,b[3]/BS,b[4]/BS,b[5]/BS,b[6]]),.031),.06)}
// v122: duże zestawy ozdób (całe miasto) dzielone na kafle ~12 m — usuwanie migotania i składanie siatki działa na małych porcjach zamiast na tysiącach brył naraz
function kitBT(list){if(list.length<500)return kitB(list);const T=new Map();for(const b of list){const k=Math.floor(b[0]/12)+'_'+Math.floor(b[2]/12);let a=T.get(k);if(!a){a=[];T.set(k,a)}a.push(b)}
  const G=[...T.values()].map(kitB).filter(g=>g&&g.attributes.position.count);if(!G.length)return null;if(G.length===1)return G[0];
  const out=new THREE.BufferGeometry();for(const name of ['position','normal','color','aT']){const A0=G[0].attributes[name];if(!A0)continue;let n=0;for(const g of G)n+=g.attributes[name].array.length;const A=new A0.array.constructor(n);let o=0;for(const g of G){A.set(g.attributes[name].array,o);o+=g.attributes[name].array.length}out.setAttribute(name,new THREE.BufferAttribute(A,A0.itemSize,A0.normalized))}
  for(const g of G)g.dispose();out.computeBoundingSphere();out.computeBoundingBox();return out}
function kingBanners(c){const H=vHerb(c),L0=[],WDD='#4a2f1d',G='#c9a24a';let L=L0;const PARTS=[];if(!c.wsegs)return null;
  for(const [x0,z0,len,th,top,ang] of c.wsegs){L=[];PARTS.push({L,ang,x:x0-c.x,z:z0-c.z});const lx=0,lz=0,Hh=top-c.h,long=true,out=1,o=th/2+0.5;
    for(let i=1;i<Math.floor(len/14);i++){const a=-len/2+i*14,bx=long?lx+a:lx+o*out,bz=long?lz+o*out:lz+a,ax=long?'z':(out>0?'x':'x-'),A=(u,y,w,h,d,col)=>L.push(long?[bx+u,y,bz,w,h,d,col]:[bx,y,bz+u,d,h,w,col]);
      A(0,Hh-1.2,3.9,0.26,0.26,WDD);A(0,Hh-1.2,4.2,0.1,0.1,G);A(2.1,Hh-1.2,0.22,0.34,0.34,G);A(-2.1,Hh-1.2,0.22,0.34,0.34,G);
      for(const q of herbBoxes(H,ax,bx,Hh-3.6,bz,3.4,4.5,0.08))L.push(q);const c1=HTIN[H.c1][1];
      A(-0.95,Hh-6.3,1.3,1.0,0.08,c1);A(0.95,Hh-6.3,1.3,1.0,0.08,c1);A(0,Hh-1.4,3.5,0.14,0.1,G)}}
  const parts=PARTS.filter(q=>q.L.length).map(q=>({g:boxes(q.L),ang:q.ang,x:q.x,z:q.z}));return parts.length?geoRotMerge(null,parts):null}
function cityWallGeo(c){
  if(RBASE[c.race]){const g0=cityWallGeo(Object.assign({},c,{race:RBASE[c.race]}));let g=g0;try{g=recolorShare(g0,RREC[c.race])}catch(_){}g.userData=g.userData||{};g.userData.raced=1;return g}
  if(c.race&&c.race!=='ludzie'){try{const g=raceCityWall(c);if(g)return raceStoneTag(g,c.race,c.sty)}catch(e){console.warn('mur rasy',e)}}
  const L=[],S='#8e8994',S2='#9a95a0',SD='#6f6a73',SDD='#5d5a63',RF=['#a8452c','#93391f'],RG='#6a2a1a',WD='#7a5030',WDD='#4a2f1d',SL='#2b2633',MOSS='#5b8f3a';
  const Hs=c.Hs;let SINK=L;const PARTS=[],P=(x,y,z,w,h,d,col)=>SINK.push([x,y,z,w,h,d,col]);
  // odcinki muru (po skosie: budowane prosto w układzie odcinka, potem obracane)
  let si=0;for(const [x,z,len,th,top,ang] of (c.wsegs||[])){SINK=[];const lx=0,lz=0,H=top-c.h,long=true,out=1,e=(si++%3)*0.008;PARTS.push({L:SINK,ang,x:x-c.x,z:z-c.z});
    const A=(a,y,o,la,h,w,col)=>long?P(lx+a,y+e,lz+o*out,la,h+e*0.5,w+e*2,col):P(lx+o*out,y+e,lz+a,w+e*2,h+e*0.5,la,col);   // a: wzdłuż muru, o: w poprzek (na zewnątrz +)
    A(0,0.4,0.15,len,2.6,th+0.9,SD);                 // cokół ze skosem
    A(0,-0.6,0.25,len+0.2,1.2,th+1.3,SDD);
    A(0,H/2+0.6,0,len,H-1.2,th,S);                   // lico muru
    A(0,H-1.15,0.05,len+0.05,0.45,th+0.35,S2);       // gzyms
    A(0,H-0.62,-0.05,len,0.25,th-0.5,WD);           // chodnik dla straży
    A(0,H-0.2,out>0?0:0,len,0.1,0.01,SD);
    // blanki i strzelnice po stronie zewnętrznej, niski murek od wewnątrz
    const nb=Math.max(2,Math.floor(len/1.5));for(let i=0;i<nb;i++){const a=-len/2+(i+0.5)*len/nb;if(i%2===0){A(a,H+0.15,th/2-0.3,len/nb*0.98,1.3,0.6,S);A(a,H+0.2,th/2+0.02,0.14,0.62,0.04,SL)}}
    A(0,H-0.35,th/2-0.3,len,0.7,0.62,S);
    A(0,H-0.05,-th/2+0.22,len,0.6,0.44,S2);
    // przypory co ~7 jednostek i mech u podstawy
    const np=Math.floor(len/7);for(let i=1;i<np;i++){const a=-len/2+i*len/np;A(a,1.6,th/2+0.45,0.9,4.2,0.9,SD);A(a,3.95,th/2+0.32,0.7,0.5,0.64,S2);
      A(a+0.9,2.6+(i%3)*0.9,th/2+0.03,0.14,0.55,0.04,SL)}
    for(let i=0;i<Math.floor(len/5);i++){const a=-len/2+2+i*5+((i*37)%7)*0.3;A(a,1.75,th/2+0.47,1.1+((i*13)%5)*0.2,0.18,0.06,MOSS)}
    const BN=['#a8302a','#2f5f8f'];if(!c.walls)for(let i=1;i<Math.floor(len/14);i++){const a=-len/2+i*14,bc=BN[(i+Math.round(c.x))&1];A(a,H-1.0,th/2+0.24,1.5,0.14,0.14,WDD);A(a,H-2.8,th/2+0.2,1.3,3.4,0.04,bc);A(a,H-4.6,th/2+0.2,0.6,0.35,0.04,bc);A(a,H-2.4,th/2+0.23,0.6,0.6,0.03,'#e6c25a');A(a,H-1.3,th/2+0.22,1.3,0.12,0.04,'#e6c25a')}}
  SINK=L;
  // wieże
  const tower=(lx,lz,hw,H,big)=>{const s=hw*2;
    P(lx,0.3,lz,s+1.1,2.6,s+1.1,SD);P(lx,-0.7,lz,s+1.5,1.2,s+1.5,SDD);
    P(lx,H/2+0.8,lz,s,H-1.6,s,S);
    for(const y of [H*0.33,H*0.66])P(lx,y,lz,s+0.25,0.35,s+0.25,S2);
    // strzelnice na 4 ścianach
    for(const [ax,az] of [[1,0],[-1,0],[0,1],[0,-1]])for(const y of [H*0.42,H*0.75]){if(ax)P(lx+ax*(hw+0.01),y,lz,0.04,0.9,0.18,SL);else P(lx,y,lz+az*(hw+0.01),0.18,0.9,0.04,SL)}
    // machikuły (wsporniki) i korona z blankami
    const ck=s+1.0;P(lx,H+0.25,lz,ck,0.7,ck,S2);
    const n=big?5:3;for(let i=0;i<n;i++){const o=-hw+(i+0.5)*s/n;for(const sg of [-1,1]){P(lx+o,H-0.3,lz+sg*(hw+0.25),0.42,0.5,0.5,SD);P(lx+sg*(hw+0.25),H-0.3,lz+o,0.5,0.5,0.42,SD)}}
    const m2=big?7:5,step=ck/m2;for(let i=0;i<m2;i++){if(i%2)continue;const o=-ck/2+(i+0.5)*step;for(const sg of [-1,1]){P(lx+o,H+1.15,lz+sg*(ck/2-0.25),step*0.98,1.1,0.5,S);P(lx+sg*(ck/2-0.25),H+1.15,lz+o,0.5,1.1,step*0.98,S)}}
    // dach namiotowy z dachówki: schodki zwężające się ku górze + kalenica i iglica z chorągwią
    const steps=big?7:6,rh=big?6.4:4.8,b0=s+0.2;
    for(let i=0;i<steps;i++){const w=b0*(1-i/steps)+0.18,y=H+0.75+i*rh/steps;P(lx,y+rh/steps/2,lz,w,rh/steps+0.06,w,RF[i%2]);P(lx,y+0.05,lz,w+0.28,0.12,w+0.28,RG)}
    P(lx,H+0.75+rh+0.5,lz,0.16,1.4,0.16,WDD);P(lx,H+0.75+rh+1.3,lz,0.36,0.36,0.36,'#c9a24a');
    P(lx,H+0.75+rh+1.95,lz+0.0,0.07,1.3,0.07,WDD);P(lx+0.55,H+0.75+rh+2.3,lz,1.0,0.55,0.05,'#b03a2a~');P(lx+0.55,H+0.75+rh+2.3,lz,0.4,0.18,0.06,'#e6c25a');
    // drzwi na chodnik
    P(lx,H-1.6,lz,0.9,1.6,s+0.06,WDD)};
  for(const [x,z,hw,hd,top] of c.towers){const lx=x-c.x,lz=z-c.z,H=top-c.h;tower(lx,lz,hw,H,hw>3)}
  // bramy: łuk, krata (podniesiona), wrota otwarte, herbowe chorągwie
  for(const [x,z,ax] of [[0,-Hs,1],[0,Hs,1],[-Hs,0,0],[Hs,0,0]]){const out=ax?Math.sign(z):Math.sign(x);
    const G=(a,y,o,la,h,w,col)=>ax?P(x+a,y,z+o*out,la,h,w,col):P(x+o*out,y,z+a,w,h,la,col);
    G(0,8.2,0,7.0,3.2,3.2,S);G(0,6.35,0,7.0,0.5,3.5,S2);
    for(const sg of [-1,1]){G(sg*3.0,5.6,0,1.0,1.0,3.0,S);G(sg*2.55,6.15,0,0.9,0.6,3.0,S)}
    G(0,9.95,1.42,7.4,0.35,0.5,S2);
    for(let i=0;i<5;i++){if(i%2)continue;G(-3.2+i*1.6,10.7,1.4,1.2,1.1,0.5,S)}
    for(let i=-3;i<=3;i++)G(i*0.9,6.75,1.75,0.09,1.4,0.09,'#3a3a40');G(0,6.2,1.75,6.6,0.12,0.12,'#3a3a40');G(0,7.3,1.75,6.6,0.12,0.12,'#3a3a40');
    for(const sg of [-1,1]){G(sg*3.25,2.7,2.1,0.5,5.2,1.6,WD);G(sg*3.25,1.6,2.1,0.56,0.14,1.62,'#3a3a40');G(sg*3.25,4.0,2.1,0.56,0.14,1.62,'#3a3a40')}
    for(const sg of [-1,1]){G(sg*1.9,7.6,1.65,1.1,2.6,0.06,'#a8352a~');G(sg*1.9,8.0,1.68,0.6,0.6,0.06,'#e6c25a');G(sg*1.9,6.15,1.65,1.1,0.24,0.08,'#e6c25a')}
    G(0,8.6,1.62,1.3,1.3,0.08,'#c9a24a');G(0,8.6,1.66,0.8,0.8,0.08,'#3f5a8a')}
  // rynek: studnia-fontanna z daszkiem i kramy z płóciennymi daszkami
  const nF0=L.length;
  P(0,0.35,0,4.6,0.7,4.6,S);P(0,0.8,0,4.0,0.2,4.0,S2);P(0,0.74,0,3.5,0.08,3.5,'#3f6d9a');P(0,1.5,0,0.9,1.6,0.9,S);P(0,2.35,0,1.8,0.3,1.8,S2);P(0,2.52,0,1.1,0.08,1.1,'#3f6d9a');P(0,2.9,0,0.4,0.6,0.4,S);
  for(const [x,z,cc] of [[-7,-7,'#c0503a~'],[7,7,'#3a6aa0~'],[-7,7,'#d8a43a~'],[7,-7,'#5a8a3a~']]){P(x,0.5,z,2.4,1.0,1.2,'#8f5a2a');P(x-1.1,1.3,z-0.5,0.14,1.6,0.14,WDD);P(x+1.1,1.3,z-0.5,0.14,1.6,0.14,WDD);P(x-1.1,1.1,z+0.5,0.14,1.2,0.14,WDD);P(x+1.1,1.1,z+0.5,0.14,1.2,0.14,WDD);
    P(x,2.1,z-0.2,2.8,0.12,1.0,cc);P(x,1.85,z+0.55,2.8,0.12,0.7,cc);P(x-0.5,1.08,z,0.5,0.16,0.5,'#d8b24a');P(x+0.5,1.08,z,0.5,0.16,0.5,'#86c060');P(x,1.12,z+0.2,0.35,0.24,0.35,'#b84a3a')}
  if(c.city){/* rynek stoi przed bramą zamku, na górnym tarasie */const M=cityPlan(c).M,ly=c.lv?c.lv[0]:0;for(let i=nF0;i<L.length;i++){L[i][0]+=M[0];L[i][1]+=ly;L[i][2]+=M[1]}}
  return geoRotMerge(kitB(L),PARTS.map(q=>({g:q.L.length?kitB(q.L):null,ang:q.ang,x:q.x/BS,z:q.z/BS})));
}
// ---------- drogi i ruch ----------
let roads=[],roadQ={x:1e9,z:1e9,t:0},worldT=LS.get('wt',0);
function roadsTick(){const now=performance.now();if(!S.spawn)return;if(Math.hypot(player.p.x-roadQ.x,player.p.z-roadQ.z)>200||now-roadQ.t>15000){roadQ={x:player.p.x,z:player.p.z,t:now};const w=workers[0];w.busy++;w.postMessage({type:'roads',seed:S.seed,x:player.p.x,z:player.p.z,r:700,sx:S.spawn[0],sz:S.spawn[2],id:reqId++})}}
// odkrywanie dróg: drogi dzielone na odcinki ~8 m; odcinek pojawia się na mapie, gdy gracz był w pobliżu (zapis w W.rs)
let _rrT=0;function roadReveal(){const now=performance.now();if(now-_rrT<500)return;_rrT=now;W.rs=W.rs||{};let ch=false;const px=player.p.x,pz=player.p.z;
  for(const r of roads){if(!r.fp)continue;let st=W.rs[r.id]||'';if(st.length<r.fp.length-1)st=st.padEnd(r.fp.length-1,'0');let a=null;
    for(let i=0;i<r.fp.length-1;i++){if(st[i]==='1')continue;const p=r.fp[i],q=r.fp[i+1],mx=(p[0]+q[0])/2,mz=(p[1]+q[1])/2;if(Math.abs(mx-px)<60&&Math.abs(mz-pz)<60&&Math.hypot(mx-px,mz-pz)<55){a=a||st.split('');a[i]='1'}}
    if(a){W.rs[r.id]=a.join('');ch=true}}if(ch){MAP3D.dirty=true;saveW()}}
function roadSeenSegs(r){const st=(W.rs&&W.rs[r.id])||'';const out=[];if(!r.fp||st.indexOf('1')<0)return out;let cur=null;for(let i=0;i<r.fp.length-1;i++){if(st[i]==='1'){if(!cur){cur=[r.fp[i]];out.push(cur)}cur.push(r.fp[i+1])}else cur=null}return out}
function onRoads(list){roads=list.map(r=>{let L=0;const seg=[];for(let i=0;i<r.pts.length-1;i++){const l=Math.hypot(r.pts[i+1][0]-r.pts[i][0],r.pts[i+1][1]-r.pts[i][1]);seg.push(l);L+=l}
  const fp=[r.pts[0]];for(let i=0;i<r.pts.length-1;i++){const a=r.pts[i],b=r.pts[i+1],n=Math.max(1,Math.round(seg[i]/8));for(let k=1;k<=n;k++)fp.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n])}return{...r,seg,L,fp}});try{bridgesUpdate()}catch(e){console.warn(e)}}
// ===== mosty na drogach i pomosty w portach =====
const BRS=[],BRM=new Map();
function bridgeMesh(sp){const [x0,z0,x1,z1]=sp,dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz),y=(sp[4]||WATER)+1.5,EL=[];
  for(let s=-L/2;s<L/2;s+=1.2)EL.push([0,y,s+0.6,4,0.35,1.15,((s*10|0)&1)?'#8a6240':'#7a5532']);
  for(const sd of [-1.85,1.85]){EL.push([sd,y+0.9,0,0.18,0.18,L,'#5a3a22']);for(let s=-L/2;s<=L/2;s+=2.4)EL.push([sd,y+0.5,s,0.2,0.9,0.2,'#5a3a22'])}
  for(let s=-L/2+1.5;s<L/2;s+=4.5)for(const sd of [-1.6,1.6])EL.push([sd,y-1.8,s,0.45,3.6,0.45,'#4a2f1d']);
  const m=new THREE.Mesh(boxes(EL),matB);m.position.set((x0+x1)/2,0,(z0+z1)/2);m.rotation.y=Math.atan2(dx,dz);m.castShadow=true;m.receiveShadow=true;return m}
function bridgesUpdate(){const keep=new Set();BRS.length=0;
  for(const r of roads){if(!r.br)continue;r.br.forEach((sp,k)=>{const id=r.id+'#'+k;keep.add(id);BRS.push({a:[sp[0],sp[1]],b:[sp[2],sp[3]],y:(sp[4]||WATER)+1.68,w:2.1});if(!BRM.has(id)){const m=bridgeMesh(sp);scene.add(m);BRM.set(id,m)}})}
  for(const [id,m] of BRM)if(!keep.has(id)){scene.remove(m);m.geometry.dispose();BRM.delete(id)}
  for(const v of villages.values())if(v&&v.pier)BRS.push(v.pier)}
function bridgeGround(x,z,y){let best=null;for(const B of BRS){const ax=B.a[0],az=B.a[1],dx=B.b[0]-ax,dz=B.b[1]-az,l2=dx*dx+dz*dz||1;let t=((x-ax)*dx+(z-az)*dz)/l2;if(t<0||t>1)continue;const d=Math.hypot(x-ax-t*dx,z-az-t*dz);if(d<B.w&&y>=B.y-1.3&&(best===null||B.y>best))best=B.y}return best}
// ===== lawa parzy =====
function lavaTick(dt){if(P2.dead||!player.ready||VH.mode===6||VH.mode===2)return;if(biomeAt(player.p.x,player.p.z)!==17||!player.ground)return;P2.lavaT=(P2.lavaT||0)-dt;if(P2.lavaT<=0){P2.lavaT=0.5;try{takeDamage(14*(1-0.15*pk('ogien')),'lawa')}catch(e){}if(typeof PFX!=='undefined')PFX.emit(player.p.x,player.p.y+0.4,player.p.z,8,['#ff7a1a','#ffb030','#ffe080'],{sp:2,up:3,life:0.6,size:0.09});sfx('crackle',0.8);if(!P2.lavaMsg){P2.lavaMsg=1;toast('Lawa parzy! Uciekaj!','#ff7a3a')}}}
const DNAME={zamek:'Dzielnica zamkowa',rynek:'Dzielnica kupiecka',port:'Port',slumsy:'Slumsy',rzem:'Dzielnica rzemieślnicza'};
function districtAt(x,z){for(const v of villages.values()){if(!v||!v.city||!v.districts)continue;if(Math.abs(x-v.x)>v.Hs||Math.abs(z-v.z)>v.Hs)continue;const pl=cityPlan(v);if(pl.rho(x-v.x,z-v.z)>1)continue;if(Math.hypot(x-v.x-pl.M[0],z-v.z-pl.M[1])<pl.PR)return (v.name||'Miasto')+' · Rynek';let d=null,bd=1e9;for(const q of v.districts){const e=Math.hypot(q.x-x,q.z-z)*(q.k==='rynek'?0.75:q.k==='zamek'?0.85:1);if(e<bd){bd=e;d=q}}return (v.name||'Miasto')+(d?' · '+d.n:'')}return null}

function roadAt(r,u){let a=u;for(let i=0;i<r.seg.length;i++){if(a<=r.seg[i]||i===r.seg.length-1){const t=Math.min(1,a/r.seg[i]),p=r.pts[i],q=r.pts[i+1];return[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,Math.atan2(q[0]-p[0],q[1]-p[1])]}a-=r.seg[i]}return[r.pts[0][0],r.pts[0][1],0]}
const TRAV=new Map();
function makeTraveler(kind,seed,px,pz){
  const g=new THREE.Group(),r=mulb(seed),parts=[];
  const person=(x,z,o)=>{const m=makeChar({skin:rpick(r,SKINS),hair:rpick(r,['krotkie','dlugie','kucyk','lysy']),hairC:rpick(r,HAIRC),beard:rpick(r,['brak','krotka','zarost']),tunic:rpick(r,CLOTHC),pants:rpick(r,CLOTHC),boots:'#4a3020'},o);m.position.set(x,0,z);g.add(m);parts.push(m);return m};
  const beast=(t,x,z)=>{const m=makeEnemy(t,false);m.position.set(x,0,z);g.add(m);parts.push(m);return m};
  let spd=1.4;
  if(kind==='woz'){spd=2.6;const hb=beast('kon',0,2.2);
    // wóz kryty: koła ze szprychami (tył Ø1,2 m, przód Ø1,0 m), plandeka na pałąkach, dyszel do konia, ładunek
    const cart=new THREE.Group(),WD='#8a6a44',WDD='#5a3a22',CL='#e6dcc2';
    const E=[[0,1.0,0,1.7,0.14,2.8,WD],[0.83,1.3,0,0.08,0.48,2.8,'#7a5a3a'],[-0.83,1.3,0,0.08,0.48,2.8,'#7a5a3a'],[0,1.3,-1.36,1.7,0.48,0.08,'#7a5a3a'],[0,1.22,1.36,1.7,0.32,0.08,'#7a5a3a'],
      [0,0.6,-0.8,2.0,0.1,0.1,'#3a3a3a'],[0,0.5,0.95,1.8,0.1,0.1,'#3a3a3a'],[0,0.86,0.1,0.14,0.14,2.4,WDD],
      [0,1.62,1.2,1.5,0.1,0.42,'#6b4528'],[0.6,1.32,1.2,0.08,0.5,0.08,WDD],[-0.6,1.32,1.2,0.08,0.5,0.08,WDD],
      [0.42,0.92,2.45,0.07,0.07,2.3,'#6b4528'],[-0.42,0.92,2.45,0.07,0.07,2.3,'#6b4528'],[0,0.92,3.5,0.9,0.07,0.07,'#6b4528'],
      [0.35,1.45,-0.85,0.5,0.62,0.5,'#7a5030'],[0.35,1.45,-0.85,0.54,0.06,0.54,'#3a3a3a'],[-0.35,1.36,-0.95,0.52,0.42,0.48,'#c9b07a'],[-0.3,1.66,-0.75,0.4,0.3,0.4,'#b89a62'],[0.05,1.3,-0.2,0.9,0.3,0.6,'#a8452f~']];
    for(const z of [-1.2,-0.4,0.4,1.0]){E.push([0.8,1.98,z,0.06,1.2,0.06,WDD],[-0.8,1.98,z,0.06,1.2,0.06,WDD],[0.55,2.66,z,0.6,0.06,0.06,WDD],[-0.55,2.66,z,0.6,0.06,0.06,WDD],[0,2.8,z,0.6,0.06,0.06,WDD])}
    cart.add(new THREE.Mesh(boxes(E),decoMat));
    const cv=new THREE.Group();cv.add(new THREE.Mesh(boxes([[0.84,2.0,-0.1,0.04,1.1,2.4,CL],[-0.84,2.0,-0.1,0.04,1.1,2.4,CL],[0.56,2.69,-0.1,0.58,0.04,2.4,CL],[-0.56,2.69,-0.1,0.58,0.04,2.4,CL],[0,2.83,-0.1,0.62,0.04,2.4,CL],[0,2.3,-1.3,1.66,0.9,0.04,'#d8ccb0']]),decoMat));cart.add(cv);
    const wheel=(x,z,D)=>{const w=new THREE.Group(),r=D/2,t=Math.max(0.08,D*0.08);
      for(const rx of [0,Math.PI/4]){const f=new THREE.Mesh(boxes([[0,r-t/2,0,0.1,t,D*0.42,'#4a2f1d'],[0,-r+t/2,0,0.1,t,D*0.42,'#4a2f1d'],[0,0,r-t/2,0.1,D*0.42,t,'#4a2f1d'],[0,0,-r+t/2,0.1,D*0.42,t,'#4a2f1d'],[0,0,0,0.06,D-t,0.05,'#6b4528'],[0,0,0,0.06,0.05,D-t,'#6b4528']]),decoMat);f.rotation.x=rx;w.add(f)}
      w.add(new THREE.Mesh(boxes([[0,0,0,0.16,0.2,0.2,'#3a3a3a']]),decoMat));w.position.set(x,r,z);w.userData.r=r;cart.add(w);return w};
    g.userData.wheels=[wheel(0.98,-0.8,1.2),wheel(-0.98,-0.8,1.2),wheel(0.9,0.95,1.0),wheel(-0.9,0.95,1.0)];
    cart.position.z=-1.4;g.add(cart);g.userData.cart=cart;g.userData.canvas=cv;g.userData.seat=[0.4,1.67,-0.2];
    const d=person(-0.35,-0.2,{hat:r()<0.5?'kaptur':undefined});d.position.y=0.72;d.userData.sit=1;d.userData.reins=1}
  else if(kind==='karawana'){spd=2.0;const t=r()<0.5?'wielblad':'kon',cam=t==='wielblad';const BW=[];
    for(let i=0;i<3;i++){const b=beast(t,0,-i*3.0);BW.push(b);const y=cam?1.85:1.45;
      b.add(new THREE.Mesh(boxes([[0,y+0.08,0,0.9,0.1,0.9,'#7a2a22'],[0.5,y-0.25,0,0.26,0.6,0.7,'#8a5a30'],[-0.5,y-0.25,0,0.26,0.6,0.7,'#6b4a2b'],[0.5,y-0.25,0,0.3,0.08,0.74,'#4a2f1d'],[-0.5,y-0.25,0,0.3,0.08,0.74,'#4a2f1d'],
        [0,y+0.3,0,0.36,0.36,1.1,i===1?'#3f6fa8~':'#c0503a~'],[0,y+0.3,0,0.4,0.06,0.2,'#c9a24a'],[0.32,y+0.5,-0.2,0.3,0.3,0.3,'#c9b07a'],[0,y-0.1,0.55,0.05,0.05,0.4,'#5a3a22']]),decoMat));
      if(i>0){const rope=new THREE.Mesh(boxes([[0,cam?1.6:1.3,1.5,0.04,0.04,1.5,'#b89a62']]),decoMat);b.add(rope)}}
    g.userData.bob=BW;
    const lead=person(0.75,1.6,{hat:'kaptur'});lead.userData.lead=1;const st=new THREE.Mesh(boxes([[0,-0.25,0.15,0.06,0.06,1.9,'#6b4528']]),decoMat);st.rotation.x=-Math.PI/2+0.15;if(lead.userData.re)lead.userData.re.add(st);
    const gd=person(-0.85,-8.6,{hat:'helm'});const H=herbNear(px||0,pz||0);try{soldierGear(gd,H,'ludzie',true)}catch(_){}const sp=new THREE.Mesh(boxes([[0,-0.3,0.2,0.05,0.05,2.0,'#6b4a2b'],[0,-0.3,1.25,0.1,0.06,0.25,'#c9cfd4']]),decoMat);sp.rotation.x=-Math.PI/2;if(gd.userData.re)gd.userData.re.add(sp);
    person(0.9,-5.2,{pack:1})}
  else if(kind==='konny'){spd=4.2;const hb=beast('kon',0,0);try{horseCoat(hb,Math.floor(r()*10))}catch(_){}const d=person(0,0.12,{hat:r()<0.5?'kaptur':undefined,cape:1});d.position.y=1.0;d.userData.sit=1;d.userData.reins=1}
  else if(kind==='patrol'){spd=1.6;const H=herbNear(px||0,pz||0);for(const [x,z] of [[0.5,0],[-0.5,-1.2]]){const m=person(x,z,{hat:'helm'});soldierGear(m,H,'ludzie',true);const sp=new THREE.Mesh(boxes([[0,-0.3,0.2,0.05,0.05,2.0,'#6b4a2b'],[0,-0.3,1.25,0.1,0.06,0.25,'#c9cfd4']]),decoMat);sp.rotation.x=-Math.PI/2;if(m.userData.re)m.userData.re.add(sp)}}
  else{spd=1.3;person(0,0,{pack:1,hat:r()<0.5?'kaptur':undefined});if(r()<0.4)person(0.7,-0.9,{})}
  g.userData.parts=parts;g.userData.spd=spd;return g;
}
const TRAVN={woz:'Woźnica',karawana:'Kupiec karawany',patrol:'Strażnik szlaku',piechur:'Wędrowiec',konny:'Posłaniec konny'};let nearTrav=null;
function travNpc(t,kind,sd,x,z){if(t.n)return t.n;const r=mulb(sd^0x5f3),fem=kind==='piechur'&&r()<0.4,R=RACES.ludzie,v=nearVillage?nearVillage(x,z,600):null;
  t.n={id:'trav'+t.key,name:rpick(r,fem?R.f:R.m),fem,roleN:TRAVN[kind],race:'ludzie',role:kind==='woz'||kind==='karawana'?'kupiec':kind==='patrol'?'straz':'wedr',trav:t,kind,rare:kind==='karawana'?1:0,vid:v?v.id:null,x,z,m:t.g};return t.n}
function travPose(t){const g=t.g,ry=g.rotation.y,c=Math.cos(ry),sn=Math.sin(ry),st=g.userData.seat||[0.4,1.67,-0.2];return[g.position.x+c*st[0]+sn*st[2],g.position.y+st[1]-0.95,g.position.z-sn*st[0]+c*st[2],ry]}
function rideOff(){const R=P2.ride;P2.ride=null;if(!R)return;const t=R.t,g=t&&t.g;if(g){const ry=g.rotation.y,x=g.position.x+Math.cos(ry)*2.2,z=g.position.z-Math.sin(ry)*2.2,h=colAt(x,z);player.p.set(x,Math.max(h??g.position.y,wlAt(x,z)-1.2)+0.2,z)}player.v.set(0,0,0);camY=null;toast('Zsiadasz z wozu.','#cfe8ff')}
function dlgTrav(n){const t=n.trav,o=[];
  if(n.kind==='woz'&&!P2.ride)o.push(['Podwieziesz mnie kawałek? — 8 zł',()=>{if((INV.gold||0)<8)return dlgRoot('Bez grosza nie podwiozę, wybacz.');INV.gold-=8;saveInv();updHud();sfx('coin');closeDialog();P2.ride={key:t.key,t};toast('Siadasz na koźle obok woźnicy. F lub Spacja — zsiądź.','#ffd27a')}]);
  if(n.kind==='woz'||n.kind==='karawana'){const dir=t.fw?'naprzód':'z powrotem',r=roads.find(q=>q.id===t.rid);let dest='';if(r&&r.pts){const e=t.fw?r.pts[r.pts.length-1]:r.pts[0],v=nearVillage?nearVillage(e[0],e[1],120):null;dest=v&&v.name?v.name:''}
    o.push(['Dokąd zmierzacie?',()=>dlgShow(dest?`Wieziemy towar do: ${dest}. Droga długa, ale szlak bezpieczniejszy niż las.`:`Jedziemy ${dir} tym traktem, aż do następnej osady.`,[['Wróć.',()=>dlgRoot()]])])}
  if(n.kind==='woz'||n.kind==='karawana')o.push(['Napadnij na karawanę!',()=>dlgShow('Woźnica sięga po pałkę, strażnicy już na ciebie patrzą. Napad zrujnuje twoją renomę u ludzi. Na pewno?',[['Tak — oddawać towar!',()=>robCaravan(n)],['Nie, żartowałem.',()=>dlgRoot()]])]);
  if(n.kind==='patrol')o.push(['Jak bezpiecznie na szlaku?',()=>{let best=null,bd=1e9;for(const e of enemies.values()){if(e.st===2||EDEF[e.t].passive||EDEF[e.t].ally)continue;const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d<bd){bd=d;best=e}}
    dlgShow(best&&bd<160?`Uważaj — jakieś ${Math.round(bd/10)*10} kroków na ${dirName(best.p.x-player.p.x,best.p.z-player.p.z)} widzieliśmy: ${EDEF[best.t].n||best.t}.`:'Spokojnie dziś na trakcie. Oby tak zostało.',[['Dzięki.',()=>dlgRoot()]])}]);
  if(n.kind==='konny')o.push(['Jakie wieści z traktu?',()=>{let h=null;for(const e of enemies.values())if(e.hero&&e.st!==2){h=e;break}dlgShow(h?`Strzeż się! Na trakcie grasuje ${h.hero} — widziałem go jakieś ${Math.round(Math.hypot(h.p.x-player.p.x,h.p.z-player.p.z)/10)*10} kroków na ${dirName(h.p.x-player.p.x,h.p.z-player.p.z)}.`:rpick(Math.random,['Wiozę list do zamku — król zwołuje turniej. Mówią, że błędni rycerze wyzywają każdego śmiałka na pojedynek.','Na trakcie grasują rozbójnicy na koniach. Jeźdź ostrożnie i trzymaj się straży.','W mieście gwardia konna patroluje ulice — tam jesteś bezpieczny.']),[['Dzięki.',()=>dlgRoot()]])}]);
  if(n.kind==='piechur')o.push(['Daj kilka monet (5 zł).',()=>{if((INV.gold||0)<5)return dlgRoot('Nie masz nawet tyle…');INV.gold-=5;saveInv();updHud();sfx('coin');try{addKarma(1)}catch(_){}dlgRoot(n.fem?'Niech ci się darzy, dobry człowieku!':'Bóg zapłać, wędrowcze!')}]);
  return o}
function trafficTick(dt){
  try{riderTick(dt)}catch(e){console.warn('jezdzcy',e)}
  if(isAuth())worldT+=dt;const seen=new Set();nearTrav=null;let nd=3.6;
  for(const r of roads){const n=Math.max(1,Math.floor(r.L/380));
    for(let j=0;j<n;j++){const key=r.id+'#'+j,sd=strHash(key+S.seed),kindR=(sd%100)/100,kind=kindR<0.33?'woz':kindR<0.52?'karawana':kindR<0.64?'patrol':kindR<0.8?'konny':'piechur',spd=kind==='woz'?2.6:kind==='karawana'?2.0:kind==='patrol'?1.6:kind==='konny'?4.2:1.3;
      let t=TRAV.get(key);const talk=t&&t.n&&dlg&&dlg.n===t.n;if(t&&talk)t.hold=(t.hold||0)+dt;
      const ph=((sd>>>7)%1000)/1000,L2=2*r.L,s=(((worldT-((t&&t.hold)||0))*spd+ph*L2)%L2+L2)%L2,fw=s<r.L,u=fw?s:L2-s,[x,z,ang]=roadAt(r,u);
      if(Math.hypot(x-player.p.x,z-player.p.z)>170&&!(P2.ride&&P2.ride.key===key))continue;const h=colAt(x,z);if(h===null)continue;seen.add(key);
      if(!t&&ROBBED.has(key)&&ROBBED.get(key)>worldT)continue;
      if(!t){t={g:makeTraveler(kind,sd,x,z),ph:0,key,kind};scene.add(t.g);TRAV.set(key,t)}t.fw=fw;t.rid=r.id;
      // przeprawa: most → po moście; woda → bród/płynięcie (konie i wóz zanurzone, wóz unosi się na wodzie)
      let y=h,wet=false;{const bg=bridgeGround(x,z,1e4);if(bg!==null&&bg>y-0.05)y=bg-0.18;else{const wl=Math.max(WATER,wlAt(x,z));if(h<wl-0.6){y=wl-(kind==='woz'?0.75:0.95);wet=true}}}
      const g=t.g,ry=fw?ang:ang+Math.PI;g.position.set(x,y+(wet?Math.sin(t.ph*1.7)*0.06:0),z);let dr=ry-g.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));g.rotation.y+=dr*Math.min(1,4*dt);
      const vs=talk?0:spd;t.ph+=dt;if(wet&&Math.random()<dt*3&&typeof PFX!=='undefined')PFX.emit(x+(Math.random()-0.5)*2,y+0.7,z+(Math.random()-0.5)*2,2,['#e6f2ff','#bcd8ee'],{sp:1.2,up:1.5,life:0.5,size:0.06});
      for(const p of g.userData.parts){if(p.userData.ll&&!p.userData.sit)animChar(p,wet?vs*0.7:vs,dt,false,wet);else if(p.userData.legs)animEnemy(p,vs,dt,0,0,wet);
        if(p.userData.sit){p.userData.ll.rotation.x=-1.4;p.userData.rl.rotation.x=-1.4;if(p.userData.la){p.userData.la.rotation.x=-0.9;p.userData.ra.rotation.x=-0.9}}
        if(p.userData.lead&&p.userData.ra)p.userData.ra.rotation.x=-0.5}
      if(g.userData.wheels)for(const w of g.userData.wheels)w.rotation.x+=vs*dt/(w.userData.r||0.4);
      if(g.userData.cart){const c=g.userData.cart;c.position.y=wet?0:Math.abs(Math.sin(t.ph*vs*2.1))*0.025;c.rotation.z=wet?Math.sin(t.ph*1.3)*0.03:Math.sin(t.ph*vs*1.3)*0.012;if(g.userData.canvas)g.userData.canvas.rotation.z=Math.sin(t.ph*2.3)*0.008*vs}
      if(g.userData.bob)g.userData.bob.forEach((b,k)=>{const rp=b.children[b.children.length-1];if(rp&&rp!==b.children[0])rp.rotation.x=Math.sin(t.ph*2+k)*0.04});
      if(P2.ride&&P2.ride.key===key){const q=travPose(t);player.p.set(q[0],q[1],q[2]);player.v.set(0,0,0);player.ground=true;player.ry=q[3];P2.ride.t=t}
      else{// nie wchodź w wóz
        const dx=player.p.x-x,dz=player.p.z-z,dd=Math.hypot(dx,dz),rr=kind==='woz'?1.6:1.3;if(dd<rr&&dd>1e-3&&Math.abs(player.p.y-y)<2){player.p.x=x+dx/dd*rr;player.p.z=z+dz/dd*rr}
        if(dd<nd&&Math.abs(player.p.y-y)<3){nd=dd;nearTrav=travNpc(t,kind,sd,x,z)}}
      if(t.n){t.n.x=x;t.n.z=z}}}
  for(const [k,t] of TRAV)if(!seen.has(k)){if(P2.ride&&P2.ride.key===k)rideOff();scene.remove(t.g);t.g.traverse(o=>{if(o.material&&o.material!==decoMat&&o.material.dispose)o.material.dispose()});TRAV.delete(k)}
  if(nearTrav&&!dlg&&!nearNpc&&!P2.ride){const pr=$('prompt');pr.hidden=false;pr.innerHTML='<kbd>F</kbd> Rozmowa: <b></b>';pr.querySelector('b').textContent=nearTrav.name+' ('+nearTrav.roleN+')'}
}

