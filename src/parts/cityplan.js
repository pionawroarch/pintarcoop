// ===== PLAN MIASTA (wspólny dla generatora terenu i gry): nieregularny obrys murów, kręte ulice, tarasy, zamek =====
// Układ lokalny: (0,0) = środek miasta. Bramy na osiach w odległości Hs (zgodność z drogami, portem i oblężeniami).
function cpRng(seed){let h=2166136261;for(let i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619)}let a=h>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const CPLC=new WeakMap();
function cityPlan(c){{const q=CPLC.get(c);if(q)return q}const r=cpRng('plan'+c.id),Hs=c.Hs,TAU=Math.PI*2;
  // obrys: promień murów zależny od kąta; na osiach (bramy) dokładnie Hs, pomiędzy cofnięty i falujący
  const ph=[r()*TAU,r()*TAU,r()*TAU],am=[0.5+r()*0.5,0.3+r()*0.4,0.2+r()*0.3];
  const Rf=a=>{const q=((a%(Math.PI/2))+Math.PI/2)%(Math.PI/2),gd=Math.min(q,Math.PI/2-q),near=Math.max(0,1-gd/0.2),bl=near*near*(3-2*near);const n=0.5+0.5*(am[0]*Math.sin(3*a+ph[0])+am[1]*Math.sin(5*a+ph[1])+am[2]*Math.sin(9*a+ph[2]))/(am[0]+am[1]+am[2]);return Hs*(bl+(1-bl)*(0.84+0.13*n))};
  const tp=[r()*TAU,r()*TAU];const rho=(x,z)=>{const a=Math.atan2(z,x);return Math.hypot(x,z)/Rf(a)};
  const rhoN=(x,z)=>{const a=Math.atan2(z,x);return Math.hypot(x,z)/Rf(a)+0.035*Math.sin(3*a+tp[0])+0.02*Math.sin(7*a+tp[1])};
  // wieloboczny mur (wierzchołki co ~11 m, bramy na osiach)
  const NV=Math.max(24,Math.round(TAU*Hs*0.9/11/4)*4),V=[];for(let k=0;k<NV;k++){const a=k/NV*TAU,rr=Rf(a);V.push([Math.cos(a)*rr,Math.sin(a)*rr,k%(NV/4)===0?1:0])}
  // zamek: w ćwiartce cq, w połowie drogi do muru, frontem (wielokrotność 90°) do środka
  // zamek w samym środku miasta; rynek przed jego bramą (kierunek wg miasta), główne ulice dochodzą do rynku pierścieniem
  const ksc=1,kx=0,kz=0,KR=23*ksc+1.5,PD=[[0,1],[1,0],[0,-1],[-1,0]][Math.floor(r()*4)],krot=Math.atan2(PD[0],PD[1]),kf=[PD[0],PD[1]];
  const castle={x:kx,z:kz,rot:krot,ksc,R:KR,fx:kf[0],fz:kf[1]};
  const inK=(x,z,m)=>Math.abs(x-kx)<KR+(m||0)&&Math.abs(z-kz)<KR+(m||0);
  // ulice jako łamane: główne od bram do rynku, pierścienie, przecznice, zaułki, ulica przymurna
  const ST=[],PR=17,MX=Math.round(kf[0]*(KR+PR+5)),MZ=Math.round(kf[1]*(KR+PR+5)),M=[MX,MZ];
  const wob=(p0,p1,amp,n,seed)=>{const rr=cpRng(seed),P=[],dx=p1[0]-p0[0],dz=p1[1]-p0[1],L=Math.hypot(dx,dz)||1,nx=-dz/L,nz=dx/L,f1=rr()*TAU,f2=rr()*TAU,a1=(rr()-0.5)*2*amp,a2=(rr()-0.5)*amp;
    for(let i=0;i<=n;i++){const t=i/n,e=Math.sin(t*Math.PI),o=e*(a1*Math.sin(t*Math.PI*1.0+f1*0.1)+a2*Math.sin(t*Math.PI*3+f2));P.push([p0[0]+dx*t+nx*o,p0[1]+dz*t+nz*o])}return P};
  for(let g=0;g<4;g++){const a=g*Math.PI/2,ga=[Math.cos(a)*(Hs+1),Math.sin(a)*(Hs+1)],toM=Math.abs(Math.cos(a)-kf[0])<0.1&&Math.abs(Math.sin(a)-kf[1])<0.1,aa=a+(r()-0.5)*0.3,
      pa=toM?[MX+Math.cos(a)*(PR-2),MZ+Math.sin(a)*(PR-2)]:[Math.cos(aa)*Rf(aa)*0.38,Math.sin(aa)*Rf(aa)*0.38];
    const P=wob(ga,pa,Hs*0.07,Math.max(10,Math.round(Hs/9)),'m'+g+c.id);P.splice(1,0,[Math.cos(a)*(Hs-8),Math.sin(a)*(Hs-8)]);ST.push({p:P,w:6.2,k:3})}
  {const P=[[kx+kf[0]*(KR-1.5),kz+kf[1]*(KR-1.5)],[MX-kf[0]*(PR-3),MZ-kf[1]*(PR-3)]];ST.push({p:P,w:5.6,k:3})}
  const ring=(f,amp,w,k,n,seed)=>{const rr=cpRng(seed),q1=rr()*TAU,q2=rr()*TAU,P=[];for(let i=0;i<=n;i++){const a=i/n*TAU,rf=f+amp*(Math.sin(3*a+q1)*0.6+Math.sin(5*a+q2)*0.4),R=Rf(a)*rf;P.push([Math.cos(a)*R,Math.sin(a)*R])}ST.push({p:P,w,k})};
  ring(0.38,0.03,4.6,2,72,'r1'+c.id);ring(0.64,0.025,4.2,2,96,'r2'+c.id);ring(0.945,0.006,3.6,2,120,'r3'+c.id);
  // przecznice promieniste: w każdym pasie między pierścieniami, mniej więcej co 34 m wzdłuż zewnętrznego pierścienia pasa
  {const BANDS=[[0.08,0.38],[0.38,0.64],[0.64,0.945]];let qi=0;for(const [f0,f1] of BANDS){const n=Math.max(6,Math.round(TAU*f1*Hs*0.9/(f1>0.9?42:36))),off=r();for(let i=0;i<n;i++){let a=(i+off+(r()-0.5)*0.5)/n*TAU;const gq=((a%(Math.PI/2))+Math.PI/2)%(Math.PI/2);if(Math.min(gq,Math.PI/2-gq)<0.05)continue;
      const a2=a+(r()-0.5)*0.12,p0=[Math.cos(a)*Rf(a)*(f0+0.004),Math.sin(a)*Rf(a)*(f0+0.004)],p1=[Math.cos(a2)*Rf(a2)*(f1-0.004),Math.sin(a2)*Rf(a2)*(f1-0.004)];if(f0<0.1){const l=Math.hypot(p0[0],p0[1])||1;p0[0]=p0[0]/l*(KR*1.3+2);p0[1]=p0[1]/l*(KR*1.3+2)}if(Math.hypot(p0[0]-MX,p0[1]-MZ)<PR+2||Math.hypot(p1[0]-MX,p1[1]-MZ)<PR+2)continue;ST.push({p:wob(p0,p1,Math.min(5,(f1-f0)*Hs*0.08),6,'q'+(qi++)+c.id),w:3.4,k:1})}}}
  // zaułki: krótkie odnogi od pierścieni
  const nAl=Math.round(Hs/5);for(let i=0;i<nAl;i++){const a=r()*TAU,f=[0.38,0.64,0.64][i%3],sgn=r()<0.5?1:-1,len=12+r()*16,R0=Rf(a)*f,p0=[Math.cos(a)*R0,Math.sin(a)*R0],tx=-Math.sin(a),tz=Math.cos(a),dir=[Math.cos(a)*sgn+tx*(r()-0.5)*0.8,Math.sin(a)*sgn+tz*(r()-0.5)*0.8],dl=Math.hypot(dir[0],dir[1]);
    const p1=[p0[0]+dir[0]/dl*len,p0[1]+dir[1]/dl*len];if(rho(p1[0],p1[1])>0.88||Math.hypot(p1[0]-MX,p1[1]-MZ)<PR+4||inK(p1[0],p1[1],4))continue;ST.push({p:wob(p0,p1,2.5,5,'a'+i+c.id),w:2.6,k:1})}
  // raster ulic co 1 m (klasa: 0 brak, 1 zaułek/przecznica, 2 pierścień, 3 główna, 4 plac)
  const E=Math.ceil(Hs*1.2)+3,N=2*E+1,G=new Uint8Array(N*N);
  const mark=(x,z,k)=>{const i=Math.round(x)+E,j=Math.round(z)+E;if(i<0||j<0||i>=N||j>=N)return;const q=j*N+i;if(G[q]<k)G[q]=k};
  for(const s of ST){const hw=s.w/2;for(let i=0;i<s.p.length-1;i++){const [x0,z0]=s.p[i],[x1,z1]=s.p[i+1],L=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.ceil(L/0.5));
      for(let t=0;t<=n;t++){const x=x0+(x1-x0)*t/n,z=z0+(z1-z0)*t/n;for(let oz=-Math.ceil(hw);oz<=Math.ceil(hw);oz++)for(let ox=-Math.ceil(hw);ox<=Math.ceil(hw);ox++){if(ox*ox+oz*oz>hw*hw+0.25)continue;const px=x+ox,pz=z+oz;if(inK(px,pz,-0.5)&&!(s===ST[4]))continue;if(rho(px,pz)>0.985)continue;mark(px,pz,s.k)}}}}
  for(let z=-PR;z<=PR;z++)for(let x=-PR;x<=PR;x++)if(x*x+z*z<=PR*PR&&!inK(MX+x,MZ+z,0.5))mark(MX+x,MZ+z,4);
  const streetAt=(x,z)=>{const i=Math.round(x)+E,j=Math.round(z)+E;if(i<0||j<0||i>=N||j>=N)return 0;return G[j*N+i]};
  // tarasy: organiczne pierścienie; zamek na najwyższym poziomie; ulice przechodzą rampami
  const BND=[0.42,0.63,0.82],T=c.lv;
  const lvlAt=(x,z,street)=>{if(!T)return 0;if(inK(x,z))return T[0];const p=rhoN(x,z);let k=BND.length;for(let i=0;i<BND.length;i++)if(p<BND[i]){k=i;break}
    if(street){const Rl=Rf(Math.atan2(z,x));for(let i=0;i<BND.length;i++){const d=(p-BND[i])*Rl;if(Math.abs(d)<4){const t=(d+4)/8;return Math.round(T[i]+(T[i+1]-T[i])*t)}}}
    return T[Math.min(k,T.length-1)]};
  const PLN={Hs,R:Rf,rho,rhoN,V,castle,inK,ST,PR,M,E,N,G,streetAt,lvlAt,BND};CPLC.set(c,PLN);return PLN}
