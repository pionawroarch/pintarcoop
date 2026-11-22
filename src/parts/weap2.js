function weaponV(base,rar,vr){const V=(WEAPV[base]||[]).find(v=>v[0]===vr);if(!V)return null;
  const c=RAR[rar].c,y=-0.3,M=WMET[rar],MD=darker(M,0.72),ML=darker(M,1.18),MF=darker(M,0.86),RU=WRUNE[rar],GOLD='#d9b23a',GOLDD='#a8822a',
    WOOD='#6b4a2b',WOODD='#4a2f1d',WOODL='#8a6238',LEA=rar>=4?'#5a2a10':'#3a2414',LEAL=rar>=4?'#7a3a18':'#5a3a22',FIT=rar>=4?GOLD:rar>=2?'#8a8f96':'#5a5a62',FITD=darker(FIT,0.75),L=[],P=(x,yy,z,w,h,d,col)=>L.push([x,yy,z,w,h,d,col]),len=V[4]||1;
  // --- wspólne części ---
  const grip=(z0,gl,gw)=>{P(0,y,z0+gl/2,gw,gw,gl,LEA);const n=Math.max(2,Math.round(gl/0.05));for(let i=0;i<n;i++)P(0,y,z0+(i+0.5)*gl/n,gw+0.012,gw+0.012,gl/n*0.4,LEAL)};
  const pommel=(z,s,kind)=>{if(kind==='disc'){P(0,y,z,s*0.55,s,s,FIT);P(0,y,z,s*0.62,s*0.7,s*0.7,FITD)}else if(kind==='scent'){P(0,y,z,s,s,s*0.7,FIT);P(0,y,z-s*0.45,s*0.6,s*0.6,s*0.3,FITD)}else{P(0,y,z,s,s,s,FIT);P(0,y,z,s*1.1,s*0.6,s*0.6,FITD);P(0,y,z-s*0.55,s*0.4,s*0.4,s*0.2,FIT)}if(rar>=2)P(0,y,z,s*0.4,s*1.06,s*0.4,c)};
  const blade=(z0,bl,w,t,o={})=>{const body=bl*(o.tip??0.8),tl=bl-body;
    P(0,y,z0+body/2,w,t,body,M);                                   // płaz
    P(w/2-0.008,y,z0+body/2,0.016,t*0.6,body,ML);P(-w/2+0.008,y,z0+body/2,0.016,t*0.6,body,ML);   // zbrocze krawędzi
    if(!o.nofuller){P(0,y,z0+body*0.42,w*0.24,t+0.006,body*0.7,MF);P(0,y,z0+body*0.42,w*0.1,t+0.01,body*0.66,MD)}   // zbrocze środkowe
    const st=o.steps||4;for(let k=0;k<st;k++){const f=1-(k+1)/(st+1);P(o.clip&&k<2?w*0.12:0,y,z0+body+tl*(k+0.5)/st,w*f,t*(0.6+0.4*f),tl/st+0.002,k===st-1?ML:M)}
    if(RU)for(let k=0;k<4;k++)P(0,y,z0+body*(0.2+k*0.16),w*0.12,t+0.014,body*0.08,RU)};
  const guard=(z,w,kind)=>{P(0,y,z,w,0.07,0.06,FIT);P(0,y,z,w*0.4,0.1,0.08,FITD);
    if(kind==='down')for(const s of [1,-1]){P(s*(w/2+0.02),y,z+0.04,0.05,0.06,0.08,FIT);P(s*(w/2+0.03),y,z+0.09,0.04,0.05,0.05,FITD)}
    if(kind==='fin')for(const s of [1,-1])P(s*(w/2+0.03),y,z,0.07,0.09,0.09,FITD);
    if(rar>=3)P(0,y,z,0.05,0.12,0.05,c)};
  const haft=(z0,hl,hw,col)=>{P(0,y,z0+hl/2,hw,hw,hl,col||WOOD);P(hw*0.3,y,z0+hl/2,hw*0.25,hw+0.004,hl*0.98,WOODD)};
  const wraps=(z0,zl,hw)=>{for(let i=0;i<3;i++)P(0,y,z0+i*zl/3,hw+0.014,hw+0.014,zl/6,LEA)};
  // --- miecze ---
  if(base==='miecz'){
    const S={krotki:[0.64,0.1,0.2,0.26,'none','disc'],dlugi:[0.98,0.088,0.22,0.36,'down','scent'],poltora:[1.08,0.098,0.32,0.44,'fin','scent'],tasak:[0.74,0.17,0.2,0.24,'none','disc']}[vr];
    const [bl0,bw,gl,gw,gk,pk]=S,bl=bl0*len;grip(-gl*0.35,gl,0.065);pommel(-gl*0.35-0.04,0.09,pk);guard(gl*0.65+0.03,gw,gk);
    P(0,y,gl*0.65+0.09,bw*0.85,0.04,0.06,MD);   // ricasso
    if(vr==='tasak'){P(0,y,gl*0.65+0.12+bl*0.45,bw,0.035,bl*0.9,M);P(-bw/2+0.01,y,gl*0.65+0.12+bl*0.45,0.02,0.025,bl*0.9,ML);P(0.03,y,gl*0.65+0.12+bl*0.94,bw*0.65,0.035,bl*0.1,M);P(bw*0.2,y,gl*0.65+0.12+bl*0.45,0.025,0.04,0.025,MD)}
    else blade(gl*0.65+0.12,bl,bw,0.035);
    if(rar>=4)P(0,y,gl*0.65+0.03,gw*0.6,0.03,0.07,GOLD)}
  // --- topory ---
  else if(base==='topor'){const hl={toporek:0.7,bojowy:0.92,brodaty:0.98,dwureczny:1.3}[vr]*len,zh=hl*0.8,big=vr==='dwureczny';haft(-0.12,hl,0.07);wraps(-0.1,0.24,0.07);P(0,y,-0.14,0.085,0.085,0.05,FIT);
    P(0,y,zh,0.11,0.12,0.16,MD);P(0,y,zh+0.1,0.09,0.09,0.04,FIT);   // tuleja
    const sides=big?[1,-1]:[1],n=6,reach=(vr==='toporek'?0.24:0.32)*(big?1.05:1);
    for(const sd of sides)for(let i=0;i<n;i++){const t=i/(n-1),yy=y+sd*(0.07+t*reach),span=(vr==='toporek'?0.12:0.14)+t*t*(big?0.34:vr==='brodaty'?0.32:0.26),off=vr==='brodaty'?-t*t*0.12:0;
      P(0,yy,zh+off,0.055-t*0.025,reach/n+0.004,span,i===n-1?ML:i>=n-2?M:MF)}
    if(vr==='brodaty')P(0,y+0.2,zh-0.22,0.03,0.05,0.06,M);
    if(!big)P(0,y-0.08,zh,0.06,0.06,0.1,MD);
    if(rar>=2)P(0.03,y+0.12,zh,0.02,0.05,0.05,c);if(RU)P(0.032,y+0.2,zh,0.012,0.12,0.03,RU);if(rar>=4)P(0,y,zh+0.1,0.1,0.1,0.02,GOLD)}
  // --- młoty ---
  else if(base==='mlot'){const hl={kowalski:0.62,bojowy:1.0,wielki:1.22}[vr]*len,zh=hl*0.86;haft(-0.12,hl,0.08);wraps(-0.1,0.3,0.08);
    for(const s of [1,-1])P(s*0.046,y,zh-0.14,0.012,0.06,0.26,FIT);   // okucia
    if(vr==='kowalski'){P(0,y,zh,0.12,0.36,0.14,MD);P(0,y+0.18,zh,0.11,0.04,0.13,M);P(0,y-0.17,zh,0.06,0.06,0.08,M)}
    else if(vr==='bojowy'){P(0,y,zh,0.14,0.16,0.16,MD);P(0,y+0.12,zh,0.13,0.1,0.13,M);P(0,y+0.18,zh,0.15,0.03,0.15,ML);for(let k=0;k<3;k++)P(0,y-0.1-k*0.06,zh,0.08-k*0.022,0.06,0.08-k*0.022,k===2?ML:M);P(0,y,zh+0.12,0.06,0.06,0.1,M);P(0,y,zh+0.19,0.03,0.03,0.05,ML)}
    else{P(0,y,zh,0.26,0.44,0.26,MD);for(const s of [1,-1]){P(0,y+s*0.24,zh,0.24,0.04,0.24,M);P(0,y+s*0.27,zh,0.2,0.03,0.2,ML)}P(0,y,zh,0.27,0.06,0.27,FIT);P(0,y,zh,0.27,0.3,0.03,FITD);for(const s of [1,-1])for(const t of [1,-1])P(s*0.135,y+t*0.12,zh+s*0.0,0.02,0.04,0.04,FIT)}
    if(rar>=2)P(0.075,y,zh,0.01,0.06,0.06,c);if(RU)P(0,y,zh-0.09,0.1,0.14,0.012,RU);if(rar>=4)P(0,y,zh,0.03,0.2,0.29,GOLD)}
  // --- sztylety ---
  else if(base==='sztylet'){const bl={sztylety:0.38,kordziki:0.44,mizerykordie:0.46}[vr]*len;grip(-0.04,0.14,0.055);pommel(-0.07,0.07,vr==='kordziki'?'disc':'ball');guard(0.12,vr==='mizerykordie'?0.1:0.16,vr==='sztylety'?'down':'none');
    if(vr==='mizerykordie'){for(let k=0;k<5;k++)P(0,y,0.17+k*bl/5+bl/10,0.035-k*0.005,0.035-k*0.005,bl/5+0.002,k===4?ML:M);P(0,y,0.17+bl*0.4,0.012,0.04,bl*0.7,ML)}
    else blade(0.16,bl,vr==='kordziki'?0.085:0.06,0.03,{tip:0.7,steps:3})}
  // --- kostury ---
  else if(base==='kostur'){const hl={laska:1.5,kostur:1.55,arcymaga:1.75}[vr]*len,top=-0.2+hl;
    if(vr==='laska'){haft(-0.2,hl,0.065,'#8a6a44');P(0,y,-0.22,0.08,0.08,0.06,FIT);P(0,y,top,0.09,0.09,0.06,FIT);P(0,y,top+0.07,0.1,0.1,0.1,c);wraps(0.35,0.2,0.065)}
    else if(vr==='kostur'){const n=10;for(let i=0;i<n;i++){const o=Math.sin(i*1.7)*0.012;P(o,y+Math.cos(i*1.3)*0.01,-0.2+(i+0.5)*hl/n,0.075-(i%2)*0.008,0.075,hl/n+0.004,i%3?WOOD:WOODD)}
      P(0,y+0.07,top-0.05,0.07,0.08,0.08,WOOD);P(0,y+0.12,top+0.02,0.06,0.07,0.1,WOODD);P(0,y+0.08,top+0.1,0.06,0.06,0.07,WOOD);P(0,y+0.02,top+0.06,0.13,0.13,0.13,c);P(0,y+0.02,top+0.06,0.08,0.15,0.08,'#ffffff');wraps(0.4,0.22,0.075)}
    else{haft(-0.2,hl,0.075,WOODD);for(const z of [0.3,0.9,top-0.15])P(0,y,z,0.095,0.095,0.04,GOLD);P(0,y,top,0.12,0.12,0.06,GOLD);
      for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){P(a*0.1,y+b*0.1,top+0.14,0.03,0.03,0.18,GOLDD);P(a*0.07,y+b*0.07,top+0.26,0.025,0.025,0.06,GOLD)}
      P(0,y,top+0.16,0.16,0.16,0.2,c);P(0,y,top+0.16,0.1,0.1,0.26,'#ffffff');P(0,y,top+0.3,0.06,0.06,0.06,c)}
    if(RU)for(let k=0;k<3;k++)P(0,y,0.55+k*0.12,0.085,0.085,0.03,RU)}
  // --- włócznie ---
  else if(base==='wlocznia'){const hl={oszczep:1.35,wlocznia:1.75,pika:2.15}[vr]*len,zt=-0.3+hl;haft(-0.3,hl,0.06,WOODL);wraps(-0.05,0.24,0.06);P(0,y,-0.32,0.07,0.07,0.06,FIT);
    P(0,y,zt+0.04,0.075,0.075,0.12,MD);for(const s of [1,-1])P(s*0.04,y,zt-0.06,0.01,0.03,0.14,FIT);
    if(vr==='pika'){for(let k=0;k<5;k++)P(0,y,zt+0.12+k*0.06,0.045-k*0.007,0.045-k*0.007,0.062,k===4?ML:M)}
    else{const hw=vr==='oszczep'?0.08:0.12,hb=vr==='oszczep'?0.2:0.32;for(let k=0;k<6;k++){const t=k/5,w=hw*(t<0.35?0.5+t*1.4:1-(t-0.35)*1.4);P(0,y,zt+0.1+k*hb/6+hb/12,Math.max(0.02,w),0.026,hb/6+0.003,k>=4?ML:M)}P(0,y,zt+0.1+hb*0.45,0.018,0.036,hb*0.85,MD)}
    if(vr==='wlocznia')P(0,y-0.05,zt-0.02,0.02,0.07,0.1,'#a8352a');
    if(RU)P(0,y,zt+0.22,0.016,0.04,0.12,RU);if(rar>=2)P(0,y,zt-0.02,0.08,0.08,0.025,c)}
  // --- buzdygany ---
  else if(base==='buzdygan'){const hl=0.82*len,zh=hl*0.94;
    if(vr==='maczuga'){for(let k=0;k<6;k++){const w=0.06+k*0.022;P(0,y,-0.12+k*hl/6+hl/12,w,w,hl/6+0.004,k%2?WOOD:WOODL)}grip(-0.12,0.22,0.065);for(let k=0;k<8;k++){const a=k*0.785,r=0.075+((k%3)*0.08+0.42)/hl*0.05;P(Math.cos(a)*(0.07+(k%3)*0.012),y+Math.sin(a)*(0.07+(k%3)*0.012),0.42+(k%3)*0.09,0.035,0.035,0.035,'#9aa0a6')}}
    else{haft(-0.12,hl,0.065,vr==='morgenstern'?WOODD:WOOD);grip(-0.12,0.22,0.07);P(0,y,-0.15,0.08,0.08,0.05,FIT);P(0,y,zh-0.16,0.085,0.085,0.06,FIT);
      if(vr==='buzdygan'){P(0,y,zh,0.11,0.11,0.24,MD);for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1],[0.7,0.7],[-0.7,0.7],[0.7,-0.7],[-0.7,-0.7]]){const d=Math.abs(a)>0.5&&Math.abs(b)>0.5?0.07:0.09;P(a*d,y+b*d,zh,a&&b?0.05:a?0.07:0.03,a&&b?0.05:b?0.07:0.03,0.22,M);P(a*d*1.15,y+b*d*1.15,zh,0.025,0.025,0.16,ML)}P(0,y,zh+0.14,0.06,0.06,0.05,FIT)}
      else{P(0,y,zh,0.2,0.2,0.2,MD);P(0,y,zh,0.22,0.16,0.16,M);P(0,y,zh,0.16,0.22,0.16,M);P(0,y,zh,0.16,0.16,0.22,M);for(const [a,b,cz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0.7,0.7,0.4],[-0.7,0.7,-0.4],[0.7,-0.7,-0.4],[-0.7,-0.7,0.4]]){P(a*0.14,y+b*0.14,zh+cz*0.14,0.05,0.05,0.05,'#e8e2cc');P(a*0.18,y+b*0.18,zh+cz*0.18,0.025,0.025,0.025,'#f4f0e0')}}}
    if(rar>=2)P(0,y,zh-0.16,0.09,0.09,0.02,c);if(RU)P(0,y,zh,0.13,0.012,0.13,RU)}
  // --- szable ---
  else if(base==='szabla'){const cv={szabla:0.07,sejmitar:0.11,karabela:0.08}[vr],n=9,bl=0.92*len,bw=vr==='sejmitar'?0.1:0.08;grip(-0.06,0.2,0.06);
    if(vr==='karabela'){P(0,y,-0.1,0.07,0.1,0.07,FIT);P(0,y+0.06,-0.14,0.06,0.06,0.06,FITD)}else pommel(-0.09,0.07,'ball');
    P(0,y,0.15,0.18,0.06,0.05,FIT);for(const s of [1,-1])P(s*0.1,y+0.02,0.17,0.04,0.05,0.04,FITD);
    if(vr==='karabela'){P(0,y+0.07,0.04,0.025,0.025,0.24,FIT);P(0,y+0.05,-0.08,0.025,0.05,0.025,FIT)}
    for(let i=0;i<n;i++){const t=i/(n-1),z=0.2+t*bl,off=cv*t*t*1.6,w=vr==='sejmitar'?bw*(0.8+t*0.5)*(i===n-1?0.6:1):bw*(i>=n-2?0.7-(i-n+2)*0.25:1);P(0,y+off,z,w,0.034,bl/n+0.008,M);P(0,y+off-0.006,z,w*0.4,0.04,bl/n+0.006,ML)}
    P(0,y+cv*1.6+0.01,0.2+bl+0.04,bw*0.35,0.03,0.06,ML);if(RU)P(0,y+0.02,0.5,0.014,0.044,0.3,RU)}
  // --- halabardy ---
  else if(base==='halabarda'){const hl=1.95*len,zt=-0.3+hl;haft(-0.3,hl,0.065);wraps(0.0,0.28,0.065);P(0,y,-0.32,0.075,0.075,0.06,FIT);P(0,y,zt-0.2,0.078,0.078,0.3,MD);for(const s of [1,-1])P(s*0.042,y,zt-0.42,0.012,0.04,0.2,FIT);
    if(vr==='halabarda'){for(let i=0;i<5;i++){const t=i/4;P(0,y+0.06+t*0.26,zt-0.2+t*0.05,0.04-t*0.015,0.056,0.2+t*0.26,i===4?ML:i>2?M:MF)}for(let k=0;k<3;k++)P(0,y-0.07-k*0.05,zt-0.18+k*0.03,0.035,0.05,0.06-k*0.01,k===2?ML:M);for(let k=0;k<5;k++)P(0,y,zt+0.0+k*0.06,0.045-k*0.007,0.045-k*0.007,0.062,k===4?ML:M)}
    else if(vr==='glewia'){for(let k=0;k<7;k++){const t=k/6;P(0,y+0.02+t*t*0.06,zt+0.0+k*0.08,0.03,0.11-t*0.06,0.085,k>=5?ML:M);P(0,y-0.03+t*t*0.06,zt+k*0.08,0.034,0.02,0.085,ML)}P(0,y-0.06,zt-0.05,0.03,0.06,0.05,M)}
    else{for(let k=0;k<7;k++){const t=k/6;P(0,y+0.1+t*0.32,zt+0.08+Math.sin(t*2.6)*0.12,0.03,0.07,0.12-t*0.06,k===6?ML:M);P(0,y+0.1+t*0.32,zt+0.08+Math.sin(t*2.6)*0.12-0.05,0.032,0.06,0.02,ML)}}
    if(rar>=2)P(0,y,zt-0.36,0.085,0.085,0.025,c);if(RU)P(0.022,y+0.15,zt-0.15,0.01,0.12,0.03,RU)}
  // --- kusze ---
  else if(base==='kusza'){const s=len,heavy=vr==='ciezka',light=vr==='lekka';
    P(0,y,0.28*s,0.075,0.09,0.74*s,WOOD);P(0,y-0.02,-0.05,0.09,0.16,0.18,WOODD);P(0,y+0.05,0.36*s,0.03,0.012,0.6*s,'#3a2414');   // łoże i rowek
    P(0,y-0.08,0.1,0.02,0.1,0.03,FITD);P(0,y+0.05,0.12,0.05,0.04,0.05,FIT);   // spust i orzech
    const pw=heavy?0.92:light?0.66:0.8,pc=heavy||vr==='kusza'?M:WOODL,n=6;
    for(let i=0;i<n;i++){const t=i/(n-1);for(const sd of [1,-1])P(sd*(0.05+t*pw/2),y+0.02,0.62*s-t*t*0.12,pw/n*0.55+0.02,heavy?0.06:0.045,heavy?0.07:0.05,i===n-1?MD:pc)}
    P(0,y+0.02,0.62*s,0.12,0.08,0.09,FIT);P(0,y+0.02,0.7*s,0.12,0.03,0.03,FITD);for(const sd of [1,-1])P(sd*0.06,y+0.02,0.74*s,0.02,0.03,0.08,FITD);   // strzemię
    P(0,y+0.06,0.36*s,0.012,0.012,0.52*s,'#e8e2cc');for(const sd of [1,-1])P(sd*(pw/4+0.03),y+0.06,0.56*s-0.06,pw/2-0.04,0.01,0.01,'#e8e2cc');
    P(0,y+0.075,0.42*s,0.025,0.025,0.42*s,'#7a5230');P(0,y+0.075,0.66*s,0.04,0.04,0.06,'#b8bec4');   // bełt
    if(heavy){P(0,y-0.02,-0.16,0.16,0.05,0.05,FIT);for(const sd of [1,-1])P(sd*0.1,y-0.02,-0.16,0.03,0.12,0.03,FITD)}
    if(rar>=2)P(0.04,y-0.02,0.2,0.012,0.05,0.05,c);if(RU)P(0.04,y,0.4,0.01,0.03,0.2,RU)}
  // --- różdżki ---
  else if(base==='rozdzka'){if(vr==='berlo'){P(0,y,0.24,0.05,0.05,0.62,GOLDD);for(const z of [0,0.18,0.36,0.5])P(0,y,z,0.07,0.07,0.03,GOLD);P(0,y,0.58,0.1,0.1,0.06,GOLD);for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])P(a*0.07,y+b*0.07,0.67,0.03,0.03,0.12,GOLD);P(0,y,0.68,0.13,0.13,0.13,c);P(0,y,0.77,0.04,0.04,0.06,GOLD)}
    else{for(let k=0;k<6;k++)P(0,y,-0.02+k*0.1+0.05,0.05-k*0.004,0.05-k*0.004,0.104,k%2?'#e8dcc0':'#d8c8a8');for(const z of [0.12,0.3])P(0,y,z,0.06,0.06,0.02,'#8a6a44');P(0,y,0.6,0.06,0.06,0.04,'#c9a64a');P(0,y,0.66,0.09,0.09,0.1,c);P(0,y,0.66,0.05,0.11,0.05,'#ffffff')}
    if(RU)P(0,y,0.3,0.06,0.06,0.12,RU)}
  else return null;return L}
const BOWV={krotki:[0.82,'#8a6238','#9a7248',0.06],mysliwski:[1,'#7a5230','#8a6238',0.055],dlugi:[1.28,'#6b4a2b','#7a5532',0.05],refleks:[1.0,'#3a2414','#5a3a22',0.058],elfi:[1.12,'#e8e2cc','#d8d0b8',0.05],kosciany:[1.05,'#e8e0c8','#cfc4a8',0.062]};
function bowGroup(rar,vr){
  const c=RAR[rar].c,b=new THREE.Group(),y=-0.3,V=BOWV[vr]||BOWV.mysliwski,w1=rar>=4?'#c9a24a':V[1],w2=rar>=4?'#e0b84a':V[2],th=V[3],L=[],P=(...q)=>L.push(q),LEA=rar>=3?'#2a1c12':'#4a3020';
  // rękojeść z owijką i podstawką pod strzałę
  P(0,y,0,th+0.025,th+0.035,0.18,LEA);for(let k=0;k<4;k++)P(0,y,-0.07+k*0.047,th+0.035,th+0.045,0.018,'#6a4a2a');P(0,y+0.04,0.1,0.03,0.025,0.03,'#8a6a44');
  const n=8;for(const sg of [1,-1])for(let i=0;i<n;i++){const t=(i+0.5)/n,z=sg*(0.09+t*0.56),yy=y+0.17*t*t-(vr==='refleks'&&t>0.75?(t-0.75)*0.5:0),w=th*(1-t*0.45);
    P(0,yy,z,w,w*1.15,0.56/n+0.012,i%2?w1:w2);if(vr==='kosciany'&&i%2===1)P(0,yy,z,w+0.016,w*1.15+0.016,0.02,'#5a4a3a')}
  for(const sg of [1,-1]){const yy=y+0.17-(vr==='refleks'?0.12:0);P(0,yy,sg*0.67,th*0.6,th*0.8,0.04,'#efe6cc');P(0,yy+0.012,sg*0.69,th*0.4,th*0.5,0.02,'#2a1c12')}
  if(vr==='refleks')for(const sg of [1,-1]){P(0,y+0.08,sg*0.7,th*0.6,0.05,0.05,w2);P(0,y+0.04,sg*0.72,th*0.55,0.04,0.04,'#efe6cc')}
  if(vr==='elfi')for(const sg of [1,-1]){for(const t of [0.3,0.6]){const z=sg*(0.09+t*0.56),yy=y+0.17*t*t;P(0.03,yy,z,0.012,0.08,0.06,'#5a9a4a');P(-0.03,yy,z,0.012,0.08,0.06,'#5a9a4a');P(0.035,yy+0.03,z+sg*0.03,0.01,0.04,0.04,'#86c060')}P(0,y+0.1,sg*0.45,th*0.7,0.012,0.12,'#d9b23a')}
  if(vr==='dlugi')for(const sg of [1,-1])P(0,y+0.05,sg*0.3,th+0.01,th+0.01,0.02,'#a8352a');
  if(rar>=2)for(const sg of [1,-1])P(0,y+0.02,sg*0.11,th+0.02,th+0.03,0.025,c);if(rar>=3)for(const sg of [1,-1])P(0,y+0.07,sg*0.4,th*0.7,0.012,0.14,WRUNE[rar]);
  b.add(new THREE.Mesh(boxes(L),decoMat));b.scale.z=V[0];
  const half=sg=>{const p=new THREE.Group();p.position.set(0,y+0.17-(vr==='refleks'?0.12:0),sg*0.68);p.add(new THREE.Mesh(boxes([[0,0,-sg*0.34,0.012,0.012,0.68,'#efe8d6']]),decoMat));b.add(p);return p};
  b.userData={sU:half(1),sD:half(-1),L:L.concat([[0,y+0.17-(vr==='refleks'?0.12:0),0,0.024,0.024,1.36,'#efe8d6']]),sz:V[0]};b.traverse(o=>{if(o.isMesh)o.castShadow=true});return b;
}
function itemBoxes(it){const c=RAR[it.rar||0].c,mt=it.mat,MATC=mt?ARMT.find(a=>a.k===mt).c:MET[it.rar||0],M=MATC,M2=darker(M,0.78),M3=darker(M,1.15),metal=!mt||mt==='kolcz'||mt==='plyt'||mt==='krasn'||mt==='smok',
  Lt='#6b4528',LtD='#4a2f1d',RV=metal?'#d8dde2':'#c9a24a',ST=metal?darker(M,0.6):'#e8d8b0',r=it.rar||0,L=[],P=(...q)=>L.push(q);
  switch(it.base){
    case 'helm':{if(mt==='skora'||mt==='elf'){P(0,0.22,0,0.5,0.3,0.5,M);P(0,0.4,0,0.4,0.1,0.4,M3);P(0,0.47,0,0.26,0.05,0.26,M3);P(0,0.1,0,0.54,0.06,0.54,M2);for(let k=0;k<6;k++)P(-0.2+k*0.08,0.2,0.252,0.02,0.18,0.01,ST);P(0.255,0.05,0.04,0.02,0.22,0.24,M2);P(-0.255,0.05,0.04,0.02,0.22,0.24,M2);if(mt==='elf'){P(0,0.36,0.25,0.18,0.08,0.02,'#d9b23a');P(0.18,0.44,-0.1,0.04,0.2,0.06,'#5a9a4a');P(-0.18,0.44,-0.1,0.04,0.2,0.06,'#5a9a4a')}}
      else{P(0,0.2,0,0.52,0.34,0.52,M);P(0,0.4,0,0.44,0.08,0.44,M3);P(0,0.46,0,0.32,0.06,0.32,M3);P(0,0.5,0,0.16,0.04,0.16,M3);P(0,0.06,0,0.56,0.05,0.56,M2);
        P(0,0.18,0.262,0.42,0.04,0.012,'#141414');P(0,0.12,0.262,0.08,0.18,0.012,M2);for(const s of [1,-1]){P(s*0.08,0.25,0.262,0.06,0.02,0.012,'#141414');P(s*0.27,0.1,0.06,0.03,0.22,0.3,M2)}
        for(let k=0;k<5;k++)P(-0.2+k*0.1,0.06,0.282,0.025,0.025,0.012,RV);if(mt==='krasn')for(const s of [1,-1])P(s*0.3,0.34,0,0.08,0.06,0.06,'#e8e0c8'),P(s*0.36,0.42,0,0.05,0.12,0.05,'#e8e0c8');if(mt==='smok')for(let k=0;k<4;k++)P(0,0.48-k*0.05,-0.12-k*0.06,0.04,0.08,0.06,'#d8a040')}
      if(r>=2)P(0,0.54,-0.02,0.07,0.1,0.38,c);if(r>=3)P(0,0.6,-0.24,0.08,0.18,0.12,c);if(r>=4)P(0,0.44,0.22,0.14,0.08,0.02,'#d9b23a');return L}
    case 'zbroja':{P(0,0.3,0,0.58,0.58,0.3,M);P(0,0.36,0.152,0.5,0.4,0.012,M3);P(0,0.36,0.158,0.04,0.42,0.01,M2);
      for(const s of [1,-1]){for(let k=0;k<3;k++)P(s*(0.36+k*0.03),0.56-k*0.07,0,0.24-k*0.03,0.06,0.36,k%2?M2:M);P(s*0.36,0.58,0.12,0.04,0.04,0.02,RV)}
      P(0,0.62,0,0.4,0.06,0.32,M2);P(0,0.06,0,0.6,0.07,0.32,Lt);P(0,0.06,0.162,0.1,0.08,0.012,'#d9b23a');
      if(metal){for(let k=0;k<4;k++)P(0,-0.03-k*0.04,0,0.56-k*0.02,0.035,0.29,mt==='kolcz'?'#9aa0a6':k%2?M2:M);for(const s of [1,-1])for(const yy of [0.2,0.32,0.44])P(s*0.24,yy,0.158,0.025,0.025,0.012,RV)}
      else{for(let k=0;k<4;k++)P(-0.21+k*0.14,-0.06,0.1,0.12,0.12,0.04,Lt);for(const yy of [0.18,0.3,0.42])P(0,yy,0.159,0.46,0.012,0.01,ST)}
      if(mt==='elf'){P(0,0.36,0.162,0.06,0.3,0.01,'#d9b23a');P(0.1,0.42,0.162,0.12,0.04,0.01,'#5a9a4a');P(-0.1,0.3,0.162,0.12,0.04,0.01,'#5a9a4a')}
      if(mt==='smok')for(let k=0;k<5;k++)P(-0.2+k*0.1,0.24+(k%2)*0.06,0.162,0.08,0.08,0.012,'#d8a040');
      P(0,0.36,0.168,0.12,0.12,0.012,c);if(r>=4)P(0,0.62,0.16,0.42,0.04,0.012,'#d9b23a');return L}
    case 'rekawice':{P(0,0.08,0.02,0.26,0.2,0.24,metal?M:Lt);for(let k=0;k<4;k++)P(-0.09+k*0.06,0.0,0.15,0.05,0.08,0.06,k%2?M2:M);P(0.15,0.12,0.06,0.07,0.14,0.08,M);
      P(0,0.3,0.02,0.24,0.22,0.2,M);P(0,0.44,0.02,0.28,0.08,0.24,M2);P(0,0.48,0.02,0.3,0.03,0.26,c);if(metal){for(let k=0;k<3;k++)P(0,0.16+k*0.05,0.14,0.26,0.025,0.02,M3);P(0,0.3,0.112,0.03,0.03,0.01,RV)}else for(const yy of [0.24,0.36])P(0,yy,0.112,0.24,0.01,0.01,ST);return L}
    case 'buty':{P(0,0.32,-0.06,0.24,0.42,0.26,metal?M:Lt);P(0,0.08,0.1,0.25,0.16,0.48,Lt);P(0,0.0,0.11,0.27,0.04,0.5,'#2a1c12');P(0,0.0,-0.12,0.2,0.06,0.12,'#1a120c');P(0,0.54,-0.06,0.28,0.07,0.3,c);
      if(metal){P(0,0.34,0.075,0.22,0.36,0.02,M3);P(0,0.13,0.25,0.22,0.12,0.12,M);P(0,0.2,0.18,0.2,0.06,0.06,M2);for(const yy of [0.2,0.32,0.44])P(0.125,yy,-0.06,0.012,0.03,0.03,RV)}
      else{for(const yy of [0.22,0.38])P(0,yy,-0.06,0.25,0.04,0.27,LtD),P(0.13,yy,0.02,0.02,0.05,0.05,'#c9a24a');P(0,0.14,0.345,0.2,0.06,0.012,ST)}return L}
    case 'pierscien':{for(let k=0;k<8;k++){const a=k/8*6.283;P(Math.cos(a)*0.16,0.04+Math.sin(a)*0.16,0,0.075,0.075,0.07,r>=2?'#d9b23a':'#c4ccd2')}P(0,0.24,0,0.16,0.06,0.12,r>=2?'#e0b84a':'#d8dde2');for(const s of [1,-1])P(s*0.06,0.3,0,0.025,0.06,0.025,'#d9b23a');P(0,0.31,0,0.12,0.1,0.1,c);P(0.02,0.34,0.03,0.04,0.03,0.03,'#ffffff');return L}
    case 'amulet':{for(let k=0;k<7;k++){const t=k/6,x=-0.18+t*0.36,yy=0.46-Math.sin(t*Math.PI)*-0.06+0.06*(1-Math.sin(t*Math.PI));P(x,yy,0,0.05,0.035,0.035,k%2?'#a8822a':'#c9a24a')}for(const s of [1,-1])P(s*0.18,0.34,0,0.035,0.2,0.035,'#c9a24a');
      P(0,0.12,0,0.26,0.28,0.05,'#d9b23a');P(0,0.12,0.01,0.2,0.22,0.05,'#a8822a');P(0,0.12,0.03,0.13,0.15,0.04,c);P(0.03,0.16,0.05,0.04,0.04,0.02,'#ffffff');P(0,-0.04,0,0.06,0.06,0.04,'#d9b23a');P(0,0.28,0,0.05,0.05,0.05,'#d9b23a');return L}
    case 'latarnia':{const fr=r>=3?'#a8822a':'#3a3a40';P(0,0.02,0,0.32,0.05,0.32,fr);P(0,0.06,0,0.28,0.03,0.28,darker(fr,1.3));P(0,0.25,0,0.25,0.36,0.25,c+'~');P(0,0.24,0,0.12,0.18,0.12,'#ffe6a0');P(0,0.15,0,0.05,0.06,0.05,'#e8e2cc');
      for(const [a,b] of [[1,1],[-1,1],[1,-1],[-1,-1]])P(a*0.135,0.25,b*0.135,0.035,0.42,0.035,fr);for(const s of [1,-1]){P(0,0.25,s*0.135,0.2,0.02,0.012,fr);P(s*0.135,0.25,0,0.012,0.02,0.2,fr)}
      P(0,0.47,0,0.32,0.05,0.32,fr);for(let k=0;k<3;k++)P(0,0.52+k*0.04,0,0.24-k*0.07,0.04,0.24-k*0.07,fr);P(0,0.66,0,0.03,0.06,0.03,fr);P(0,0.71,0,0.16,0.03,0.03,'#5a5a62');P(0,0.69,0,0.03,0.02,0.1,'#5a5a62');return L}
    case 'potion':return [[0,0.18,0,0.3,0.32,0.3,'#c8303a'],[0,0.38,0,0.14,0.1,0.14,'#cfe0e8'],[0,0.47,0,0.1,0.08,0.1,'#8a6a44'],[0.08,0.24,0.152,0.06,0.12,0.01,'#ff9a9a']];
  }return null}
