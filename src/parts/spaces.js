// =================== PRZESTRZENIE ZAMKNIĘTE: wnętrza budynków, lochy, jaskinie ===================
// Każda przestrzeń leży wysoko nad swoim miejscem na mapie (y≥560), ma siatkę ścian (solid) i własną podłogę.
const SPACES=new Map();let SPC=null,spcLeaveT=0;const ENTERABLE={karczma:'Karczma',kuznia:'Kuźnia',sklep:'Sklep',piekarnia:'Piekarnia',kaplica:'Kaplica',warsztat:'Warsztat',stajnia:'Stajnia',spichlerz:'Spichlerz'};
function spaceH(x,z,y){for(const s of SPACES.values()){if(y<s.fy-8||y>s.fy+s.ceil+6)continue;const i=Math.floor((x-s.x0)/s.cs),j=Math.floor((z-s.z0)/s.cs);if(i<0||j<0||i>=s.W||j>=s.D)continue;return s.solid[j*s.W+i]?s.fy+60:s.fy}return null}
const curSpaceKind=()=>SPC?SPC.kind:null;
function spaceIn(p){for(const s of SPACES.values()){if(p.y<s.fy-8||p.y>s.fy+s.ceil+6)continue;if(p.x>=s.x0&&p.z>=s.z0&&p.x<s.x0+s.W*s.cs&&p.z<s.z0+s.D*s.cs)return s}return null}
// --- wnętrza ---
function doorOf(h){const c=h.core,lx=c.ox,lz=c.oz+c.d/2+0.7,cs=Math.cos(h.rot),sn=Math.sin(h.rot);return[h.x+lx*cs+lz*sn,h.z-lx*sn+lz*cs]}
function genInterior(h,v){const key='in:'+Math.round(h.x)+'_'+Math.round(h.z);if(SPACES.has(key))return SPACES.get(key);
  const r=rngOf(key),f=h.func,W=f==='karczma'?14:f==='kaplica'?10:f==='stajnia'?14:12,D=f==='kaplica'?14:f==='karczma'?12:10;
  const s={id:key,kind:'interior',func:f,cs:1,W,D,x0:Math.round(h.x)-W/2,z0:Math.round(h.z)-D/2,fy:700+(Math.abs(Math.round(h.x)*7+Math.round(h.z)*13)%6)*24,ceil:4.6,solid:new Uint8Array(W*D),h,v,npcs:[],torches:[],built:false};
  for(let j=0;j<D;j++)for(let i=0;i<W;i++)if(i===0||j===0||i===W-1||j===D-1)s.solid[j*W+i]=1;
  const SOL=(i0,j0,i1,j1)=>{for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)if(i>0&&j>0&&i<W-1&&j<D-1)s.solid[j*W+i]=1};
  s.exit=[s.x0+W/2,s.z0+D-1.6];s.spawn=[s.x0+W/2,s.z0+D-2.4];s.out=doorOf(h);s.outY=h.top;s.outRy=h.rot;
  const L=[],X=i=>i-W/2,Z=j=>j-D/2,WD='#7a5030',WDD='#4a2f1d',PL='#ece2c6',ST='#8e8994',P=(...b)=>L.push(b);
  // podłoga z desek, ściany z tynku z belkami, sufit z belkami
  for(let j=1;j<D-1;j++)P(0,-0.1,Z(j)+0.5,W-2,0.2,1,j%2?'#8a6240':'#7e5838');
  for(const [x,z,w,d] of [[0,Z(0.5),W,1],[0,Z(D-0.5),W,1],[X(0.5),0,1,D],[X(W-0.5),0,1,D]])P(x,s.ceil/2,z,w,s.ceil,d,PL);
  for(let i=2;i<W-1;i+=3){P(X(i),s.ceil/2,Z(1)+0.03,0.25,s.ceil,0.06,WDD);P(X(i),s.ceil/2,Z(D-1)-0.03,0.25,s.ceil,0.06,WDD)}
  for(let j=2;j<D-1;j+=3){P(X(1)+0.03,s.ceil/2,Z(j),0.06,s.ceil,0.25,WDD);P(X(W-1)-0.03,s.ceil/2,Z(j),0.06,s.ceil,0.25,WDD)}
  P(0,s.ceil+0.15,0,W,0.3,D,'#5a3a22');for(let i=2;i<W-1;i+=2)P(X(i),s.ceil-0.15,0,0.3,0.3,D-2,WDD);
  P(0,1.2,Z(D-1)-0.02,1.4,2.4,0.08,'#5a3a22');P(0,2.5,Z(D-1)-0.05,1.8,0.2,0.12,WDD);   // drzwi
  for(const x of [X(3),X(W-3)])P(x,2.1,Z(D-1)-0.02,1,0.8,0.06,'#ffd27a');for(const z of [Z(3),Z(D-4)])P(X(1)+0.02,2.1,z,0.06,0.8,1,'#ffd27a');
  const torch=(x,z)=>{P(x,2.2,z,0.12,0.5,0.12,WDD);s.torches.push([s.x0+W/2+x,s.fy+2.6,s.z0+D/2+z])};
  const npc=(role,roleN,i,j,ry)=>s.npcs.push({role,roleN,x:s.x0+i+0.5,z:s.z0+j+0.5,ry:ry||0});
  const table=(i,j)=>{SOL(i,j,i+1,j);P(X(i+1),0.8,Z(j+0.5),2,0.12,1,WD);P(X(i+1),0.4,Z(j+0.5),0.2,0.8,0.2,WDD);P(X(i+1)-0.5,0.95,Z(j+0.5),0.2,0.2,0.2,'#c9a24a');P(X(i+1)+0.4,0.92,Z(j+0.5)+0.2,0.25,0.12,0.25,'#d8d0b8');P(X(i+1),0.45,Z(j-0.2),2,0.1,0.4,WD);P(X(i+1),0.45,Z(j+1.2),2,0.1,0.4,WD)};
  const barrel=(i,j)=>{SOL(i,j,i,j);P(X(i+0.5),0.45,Z(j+0.5),0.7,0.9,0.7,'#8a5a30');P(X(i+0.5),0.25,Z(j+0.5),0.74,0.06,0.74,'#3a3a40');P(X(i+0.5),0.7,Z(j+0.5),0.74,0.06,0.74,'#3a3a40')};
  const fire=(i,j,wide)=>{SOL(i,j,i+(wide?1:0),j);const x=X(i+(wide?1:0.5)),z=Z(j+0.5);P(x,0.9,z,wide?2.4:1.4,1.8,1,ST);P(x,0.5,z+0.2,wide?1.6:0.8,0.8,0.62,'#1a1210');P(x,0.4,z+0.25,wide?1.2:0.6,0.4,0.5,'#ff8a2e');P(x,0.6,z+0.25,0.5,0.3,0.4,'#ffd34d');P(x,2.8,z,wide?1.4:0.9,s.ceil-1.4,0.9,ST);s.torches.push([s.x0+W/2+x,s.fy+0.8,s.z0+D/2+z+0.6])};
  if(f==='karczma'){SOL(2,1,W-3,2);P(0,0.55,Z(2.5),W-5,1.1,1,'#6b4528');P(0,1.12,Z(2.5),W-4.8,0.08,1.1,'#8a6240');for(let i=3;i<W-3;i+=2)barrel(i,1);
    for(let k=0;k<4;k++)P(X(2+k*2.6),2.4,Z(1)+0.15,0.6,0.1,0.25,'#d8d0b8');table(2,5);table(W-4,5);table(2,8);table(W-4,8);fire(W-3,3,false);torch(X(1)+0.2,Z(6));torch(X(W-1)-0.2,Z(7));
    P(0,s.ceil-0.6,0,1.6,0.1,1.6,'#3a2414');for(const [a,b] of [[-0.6,-0.6],[0.6,-0.6],[-0.6,0.6],[0.6,0.6]])P(a,s.ceil-0.8,b,0.12,0.3,0.12,'#fff2c0');
    npc('kupiec','Karczmarz',W/2,3.2,0);npc('mieszk','Gość',3,6.5,Math.PI);npc('najemnik',null,W-3,7.6,Math.PI*1.2);if(r()<0.6)npc('najemnik',null,4,9.4,0)}
  else if(f==='kuznia'){fire(1,1,true);P(X(2),0.7,Z(3),1,0.5,0.6,'#4a3020');SOL(5,4,6,4);P(X(6),0.4,Z(4.5),0.8,0.8,0.6,WDD);P(X(6),0.9,Z(4.5),1.6,0.25,0.6,'#4a4a52');
    for(let k=0;k<4;k++){P(X(W-1)-0.15,1.6,Z(2+k*1.6),0.1,1.4,0.1,'#aeb6bd');P(X(W-1)-0.15,2.2,Z(2+k*1.6),0.1,0.4,0.4,'#8a8f94')}P(X(W-1)-0.1,1.4,Z(5),0.08,0.1,6,WDD);
    barrel(1,D-3);barrel(2,D-3);SOL(W-4,1,W-2,1);P(X(W-2.5),0.5,Z(1.5),3,1,1,WD);torch(X(W/2),Z(1)+0.2);npc('kowal',null,4,3,0)}
  else if(f==='sklep'||f==='piekarnia'){for(let i=1;i<W-1;i++){SOL(i,1,i,1);P(X(i+0.5),1.3,Z(1.5),1,2.6,0.9,WD);for(const y of [0.8,1.5,2.2])P(X(i+0.5),y,Z(1.8),0.6,0.3,0.25,['#c9a24a','#a8452f','#3f6d9a','#86c060','#d8c8a0'][(i+Math.round(y*3))%5])}
    SOL(3,4,W-4,4);P(0,0.55,Z(4.5),W-7,1.1,1,'#6b4528');if(f==='piekarnia'){fire(1,D-3,true);for(let k=0;k<5;k++)P(X(3+k),1.15,Z(4.5),0.4,0.15,0.3,'#d8a43a')}
    for(let k=0;k<3;k++)barrel(W-2,D-3-k);torch(X(1)+0.2,Z(5));npc('kupiec',f==='piekarnia'?'Piekarz':null,W/2,3.4,0)}
  else if(f==='kaplica'){for(let j=4;j<D-3;j+=2){SOL(2,j,3,j);SOL(W-4,j,W-3,j);P(X(3),0.45,Z(j+0.5),2,0.12,0.8,WD);P(X(W-3),0.45,Z(j+0.5),2,0.12,0.8,WD);P(X(3),0.8,Z(j+0.9),2,0.6,0.1,WD);P(X(W-3),0.8,Z(j+0.9),2,0.6,0.1,WD)}
    SOL(3,1,W-4,2);P(0,0.5,Z(1.8),4,1,1.6,'#e8e2d6');P(0,1.04,Z(1.8),4.2,0.08,1.8,'#a8352a');for(const x of [-1.6,1.6])P(x,1.3,Z(1.6),0.12,0.5,0.12,'#fff6d8');P(0,2.6,Z(1)+0.05,0.2,1.6,0.1,'#d9b23a');P(0,3.0,Z(1)+0.05,0.9,0.2,0.1,'#d9b23a');
    for(const x of [X(1)+0.02,X(W-1)-0.02])for(const z of [Z(4),Z(8)])P(x,2.4,z,0.06,1.4,0.8,['#3f5a8a','#a8352a'][Math.abs(Math.round(z))%2]);torch(X(3),Z(1)+0.2);torch(X(W-3),Z(1)+0.2);npc('starszy','Kapłan',W/2,3.4,0);s.heal=1}
  else if(f==='stajnia'){for(let k=0;k<3;k++){const i=2+k*4;SOL(i,1,i,4);P(X(i+0.5),0.7,Z(2.5),0.2,1.4,4,WD);P(X(i+2.5),0.3,Z(1.8),1.6,0.6,0.8,'#6b4a2b');P(X(i+2.5),0.35,Z(3.4),1.4,0.7,1,'#d8b24a');s.npcs.push({horse:1,x:s.x0+i+2.5,z:s.z0+3,ry:Math.PI})}
    torch(X(W/2),Z(D-1)-0.2);npc('mieszk','Stajenny',W/2,D-3,Math.PI)}
  else{for(let k=0;k<5;k++){const i=1+k*2;SOL(i,1,i+1,2);for(let q=0;q<3;q++)P(X(i+1),0.35+q*0.6,Z(2),1.6,0.6,1.6,q%2?'#d8c8a0':'#d8b24a')}
    SOL(W-4,4,W-2,5);P(X(W-3),0.45,Z(5),3,0.9,2,'#7a5532');torch(X(W/2),Z(D-1)-0.2);npc('mieszk',f==='warsztat'?'Cieśla':'Zarządca',W/2,5,0)}
  s.geoL=L;SPACES.set(key,s);return s}
// --- lochy i jaskinie: pokoje + korytarze (loch) albo automat komórkowy (jaskinia) ---
function genDungeon(st){const key='dg:'+st.id;if(SPACES.has(key))return SPACES.get(key);const cave=st.type==='jaskinia',r=rngOf(key),W=cave?40:34,D=cave?40:34,cs=2;
  const s={id:key,kind:cave?'cave':'dungeon',cs,W,D,x0:Math.round(st.x)-W,z0:Math.round(st.z)-D,fy:cave?600:640,ceil:cave?6:4.8,solid:new Uint8Array(W*D).fill(1),st,torches:[],rooms:[],npcs:[],built:false};
  const carve=(i,j)=>{if(i>0&&j>0&&i<W-1&&j<D-1)s.solid[j*W+i]=0};
  if(!cave){const rooms=[];for(let t=0;t<200&&rooms.length<9;t++){const w=3+Math.floor(r()*4),d=3+Math.floor(r()*4),i=1+Math.floor(r()*(W-w-2)),j=1+Math.floor(r()*(D-d-2));if(rooms.some(q=>i<q.i+q.w+1&&i+w+1>q.i&&j<q.j+q.d+1&&j+d+1>q.j))continue;rooms.push({i,j,w,d,cx:i+(w>>1),cz:j+(d>>1)})}
    rooms.sort((a,b)=>Math.hypot(a.cx-W/2,a.cz-D-4)-Math.hypot(b.cx-W/2,b.cz-D-4));
    for(const q of rooms)for(let j=q.j;j<q.j+q.d;j++)for(let i=q.i;i<q.i+q.w;i++)carve(i,j);
    for(let k=1;k<rooms.length;k++){const a=rooms[k-1],b=rooms[k];let i=a.cx,j=a.cz;while(i!==b.cx){carve(i,j);i+=Math.sign(b.cx-i)}while(j!==b.cz){carve(i,j);j+=Math.sign(b.cz-j)}carve(i,j)}
    s.rooms=rooms}
  else{for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++)s.solid[j*W+i]=r()<0.44?1:0;
    for(let it=0;it<5;it++){const n=new Uint8Array(s.solid);for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){let c=0;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++)if(a||b)c+=s.solid[(j+b)*W+i+a];n[j*W+i]=c>=5?1:c<=3?0:s.solid[j*W+i]}s.solid=n}
    // tylko obszar połączony z wejściem
    const st0=[W>>1,D-3];for(let j=D-6;j<D-1;j++)for(let i=(W>>1)-2;i<=(W>>1)+2;i++)carve(i,j);const seen=new Uint8Array(W*D),q=[st0];seen[st0[1]*W+st0[0]]=1;
    while(q.length){const [i,j]=q.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=i+a,y=j+b;if(x<1||y<1||x>=W-1||y>=D-1)continue;const k=y*W+x;if(!seen[k]&&!s.solid[k]){seen[k]=1;q.push([x,y])}}}
    for(let k=0;k<W*D;k++)if(!seen[k])s.solid[k]=1;
    const free=[];for(let j=2;j<D-2;j+=4)for(let i=2;i<W-2;i+=4)if(!s.solid[j*W+i])free.push({cx:i,cz:j,i:i-1,j:j-1,w:3,d:3});
    free.sort((a,b)=>Math.hypot(a.cx-st0[0],a.cz-st0[1])-Math.hypot(b.cx-st0[0],b.cz-st0[1]));s.rooms=free.filter((_,k)=>k%2===0).slice(0,10);if(!s.rooms.length)s.rooms=[{cx:st0[0],cz:st0[1]-2,i:st0[0]-1,j:st0[1]-3,w:3,d:3}]}
  const R0=s.rooms[0],RL=s.rooms[s.rooms.length-1],cw=i=>s.x0+(i+0.5)*cs,cz=j=>s.z0+(j+0.5)*cs;
  s.spawn=cave?[cw(W>>1),cz(D-3)]:[cw(R0.cx),cz(R0.cz)];s.exit=s.spawn.slice();s.out=[st.x,st.z+(cave?6.5:4.6)];s.outY=null;s.outRy=0;s.chest=[cw(RL.cx),cz(RL.cz)];
  for(const q of s.rooms)if(q!==R0)s.torches.push([cw(q.cx),s.fy+2.4,cz(q.cz)]);
  SPACES.set(key,s);return s}
function dungeonGeo(s){const L=[],cs=s.cs,cave=s.kind==='cave',r=rngOf(s.id+'g'),W=s.W,D=s.D,P=(...b)=>L.push(b),lx=i=>(i+0.5)*cs-W*cs/2,lz=j=>(j+0.5)*cs-D*cs/2;
  const C1=cave?['#6a5a4a','#5a4a3c','#7a6a58','#4a3e34']:['#6f6a73','#5d5a63','#7d7884','#66636d'];
  P(0,-0.1,0,W*cs,0.2,D*cs,cave?'#4a3e34':'#5d5a63');P(0,s.ceil+0.4,0,W*cs,0.8,D*cs,cave?'#3a3028':'#4a4750');
  for(let j=0;j<D;j++)for(let i=0;i<W;i++){if(!s.solid[j*W+i])continue;let edge=false;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=i+a,y=j+b;if(x>=0&&y>=0&&x<W&&y<D&&!s.solid[y*W+x])edge=true}if(!edge)continue;
    const h=s.ceil+(cave?(r()-0.5)*0.6:0);P(lx(i),h/2,lz(j),cs,h,cs,C1[(i*7+j*3)%4]);if(cave&&r()<0.15)P(lx(i),0.3,lz(j),cs+0.3,0.6,cs+0.3,C1[3])}
  if(!cave)for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){if(s.solid[j*W+i])continue;if((i+j)%2)P(lx(i),0.02,lz(j),cs-0.1,0.04,cs-0.1,'#66636d');if(r()<0.03)P(lx(i)+0.3,0.12,lz(j)-0.2,0.5,0.14,0.16,'#e8e2cc')}
  else for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){if(s.solid[j*W+i])continue;const t=r();if(t<0.05){const hh=0.6+r()*1.4;P(lx(i)+(r()-0.5),hh/2,lz(j)+(r()-0.5),0.4,hh,0.4,'#7a6a58')}else if(t<0.09){const hh=0.5+r()*1.2;P(lx(i),s.ceil-hh/2,lz(j),0.35,hh,0.35,'#6a5a4a')}else if(t<0.12)P(lx(i),0.25,lz(j),0.3,0.5,0.3,['#7fe3ff','#c87aff','#7dff8a'][Math.floor(r()*3)])}
  for(const [x,y,z] of s.torches){const ax=x-(s.x0+W*cs/2),az=z-(s.z0+D*cs/2);P(ax,1.4,az,0.16,2.6,0.16,'#4a2f1d');P(ax,2.75,az,0.36,0.3,0.36,'#3a3a40')}
  // schody wyjścia
  {const ax=s.exit[0]-(s.x0+W*cs/2),az=s.exit[1]-(s.z0+D*cs/2);for(let k=0;k<4;k++)P(ax,0.15+k*0.3,az+0.6+k*0.5,2,0.3,0.6,'#8e8994')}
  return L}
function buildSpace(s){if(s.g)return;const g=new THREE.Group();let L=s.geoL;if(s.kind!=='interior')L=dungeonGeo(s);
  const m=new THREE.Mesh(kitB(L),matB);m.position.set(s.x0+s.W*s.cs/2,s.fy,s.z0+s.D*s.cs/2);m.scale.setScalar(BS);m.receiveShadow=true;g.add(m);
  // płomienie (świecą bez światła)
  const FL=[];for(const [x,y,z] of s.torches)FL.push([x-(s.x0+s.W*s.cs/2),y-s.fy+(s.kind==='interior'?-0.2:0.45),z-(s.z0+s.D*s.cs/2),0.26,0.42,0.26,'#ffb030'],[x-(s.x0+s.W*s.cs/2),y-s.fy+(s.kind==='interior'?0.05:0.72),z-(s.z0+s.D*s.cs/2),0.14,0.22,0.14,'#fff2a0']);
  if(FL.length){const fm=new THREE.Mesh(boxes(FL),new THREE.MeshBasicMaterial({vertexColors:true}));fm.position.set(s.x0+s.W*s.cs/2,s.fy,s.z0+s.D*s.cs/2);g.add(fm);s.flames=fm}
  // NPC wnętrza
  s.live=[];const v=s.v;if(s.kind==='interior'&&v){const R=RACES[v.race];s.npcs.forEach((q,k)=>{if(q.horse){const hm=makeEnemy('kon',false);hm.position.set(q.x,s.fy,q.z);hm.rotation.y=q.ry;g.add(hm);s.live.push({horse:hm});return}
      const rr=rngOf(s.id+'n'+k),fem=rr()<0.4,pool=fem?R.f:R.m,n={id:s.id+':'+q.role+k,vid:v.id,role:q.role,fem,name:pool[Math.floor(rr()*pool.length)],roleN:q.roleN||(ROLE[q.role]||['Najemnik','Najemniczka'])[fem?1:0],x:q.x,z:q.z,ry:q.ry,skin:rpick(rr,R.skin),hair:rpick(rr,R.hair),cloth:rpick(rr,R.cloth),race:v.race,qg:false,inside:s.id};
      if(q.role==='najemnik')n.merc=mercOffer(n,v);n.m=makeNpc(n);n.m.position.set(n.x,s.fy,n.z);n.m.rotation.y=n.ry;n.m.add(nameTag(n.name+' · '+n.roleN,q.role==='najemnik'?'#ff9d6b':q.role==='kupiec'?'#7dd87d':'#9fb6c8'));g.add(n.m);s.live.push(n)})}
  if(s.chest&&s.kind!=='interior'){const c=new THREE.Group(),base=new THREE.Mesh(boxes([[0,0.35,0,1.2,0.7,0.8,'#7a4b22'],[0,0.35,0.41,1.22,0.12,0.02,'#d9b23a']]),decoMat),lid=new THREE.Group();lid.position.set(0,0.7,-0.4);lid.add(new THREE.Mesh(boxes([[0,0.12,0.4,1.24,0.26,0.84,'#8f5a2a'],[0,0.12,0.82,1.26,0.08,0.02,'#d9b23a']]),decoMat));c.add(base,lid);c.position.set(s.chest[0],s.fy,s.chest[1]);g.add(c);s.lid=lid;if(W.opened[s.id])lid.rotation.x=-1.9}
  scene.add(g);s.g=g}
function unbuildSpace(s){if(!s.g)return;scene.remove(s.g);s.g.traverse(o=>{if(o.geometry&&o.geometry.userData&&!o.userData.keep&&o.geometry!==ringGeo)o.geometry.dispose()});s.g=null;s.live=null}
function enterSpace(s){buildSpace(s);s.backFrom=[player.p.x,player.p.y,player.p.z];player.p.set(s.spawn[0],s.fy+0.05,s.spawn[1]);player.v.set(0,0,0);camY=null;SPC=s;sfx('door');
  if(PET)PET.p.copy(player.p);for(const f of FOL)f.p.set(player.p.x+1,player.p.y,player.p.z+1);
  if(s.kind!=='interior'){const def={id:s.id,type:s.kind==='cave'?'jaskinia':'loch',x:s.st.x,z:s.st.z,lvl:s.st.lvl||1,b:s.st.b,space:1};if(isAuth())spawnStructGuards(def);else NET.tr&&NET.tr.send({t:'sspawn',from:NET.id,def})}
  toast(s.kind==='interior'?ENTERABLE[s.func]:s.kind==='cave'?'Jaskinia':'Loch','#ffd27a')}
function leaveSpace(){const s=SPC;if(!s)return;const y=s.outY??(colAt(s.out[0],s.out[1])??player.p.y);player.p.set(s.out[0],y+0.1,s.out[1]);player.v.set(0,0,0);camY=null;SPC=null;sfx('door');if(PET)PET.p.copy(player.p);for(const f of FOL)f.p.copy(player.p);setTimeout(()=>{if(SPC!==s)unbuildSpace(s)},1500)}
let nearDoor=null;
function spaceTick(dt){
  nearDoor=null;const p=player.p;SPC=spaceIn(p);
  if(SPC){const s=SPC;if(Math.hypot(p.x-s.exit[0],p.z-s.exit[1])<1.6)nearDoor={exit:1};
    if(s.live)for(const n of s.live){if(n.horse){animEnemy(n.horse,0,dt,0,0,0);continue}const dx=p.x-n.x,dz=p.z-n.z,d=Math.hypot(dx,dz);const tr=d<5?Math.atan2(dx,dz):n.ry;let dr=tr-n.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));n.m.rotation.y+=dr*Math.min(1,5*dt);if(d<2.6&&(!nearNpc||d<Math.hypot(p.x-nearNpc.x,p.z-nearNpc.z)))nearNpc=n}
    if(s.heal&&P2.hp<ST.hp&&!P2.dead)P2.hp=Math.min(ST.hp,P2.hp+ST.hp*0.05*dt);
    if(s.lid&&!W.opened[s.id]&&Math.hypot(p.x-s.chest[0],p.z-s.chest[1])<2.2)nearDoor={chest:s};if(s.lid&&W.opened[s.id])s.lid.rotation.x+=(-1.9-s.lid.rotation.x)*Math.min(1,6*dt)}
  else{// drzwi budynków i wejścia do lochów
    for(const v of villages.values()){if(!v||!v.g||Math.abs(v.x-p.x)>90||Math.abs(v.z-p.z)>90)continue;for(const h of v.houses){if(!ENTERABLE[h.func]||h.farm||!h.core)continue;const [dx,dz]=doorOf(h);if(Math.hypot(p.x-dx,p.z-dz)<1.8&&Math.abs(p.y-h.top)<2.2){nearDoor={house:h,v};break}}if(nearDoor)break}
    if(!nearDoor)for(const st of structs.values()){if(!st||(st.type!=='loch'&&st.type!=='jaskinia'))continue;const ex=st.x,ez=st.z+(st.type==='jaskinia'?6.5:4.6);if(Math.hypot(p.x-ex,p.z-ez)<2.4){nearDoor={st};break}}}
  if(nearDoor&&!nearNpc&&!dlg){const pr=$('prompt');pr.hidden=false;pr.innerHTML=nearDoor.exit?'<kbd>F</kbd> Wyjdź na zewnątrz':nearDoor.chest?'<kbd>F</kbd> Otwórz skrzynię':nearDoor.st?'<kbd>F</kbd> '+(nearDoor.st.type==='jaskinia'?'Wejdź do jaskini':'Zejdź do lochu'):'<kbd>F</kbd> Wejdź: '+ENTERABLE[nearDoor.house.func]}
  // światła: latarnie graczy w slotach 0–3, pochodnie najbliżej gracza w 4–7
  const T=[];if(SPC&&SPC.torches)for(const t of SPC.torches)T.push(t);for(const e of enemies.values())if(e.torch&&e.st!==2&&e.m)T.push([e.p.x,e.p.y+2.2,e.p.z]);
  T.sort((a,b)=>Math.hypot(a[0]-p.x,a[2]-p.z)-Math.hypot(b[0]-p.x,b[2]-p.z));const fl=1+Math.sin(performance.now()*0.017)*0.06;
  for(let k=0;k<4;k++){const U=SEAS_U.uLamp.value[4+k],t=T[k];if(t&&Math.hypot(t[0]-p.x,t[2]-p.z)<60){U.set(t[0],t[1],t[2],SPC&&SPC.kind==='interior'?9:11);SEAS_U.uLampI.value[4+k]=(SPC?1.05:0.9)*fl}else{U.w=0;SEAS_U.uLampI.value[4+k]=0}}
}
function useDoor(d){if(d.exit)return leaveSpace();if(d.chest)return openSpaceChest(d.chest);if(d.st)return enterSpace(genDungeon(d.st));if(d.house)return enterSpace(genInterior(d.house,d.v))}
function openSpaceChest(s){if(guardsAlive({id:s.id}))return toast('Najpierw pokonaj obrońców lochu','#ff8a7a');W.opened[s.id]=Date.now();sfx('open');const lv=(s.st.lvl||1)+2;INV.gold+=Math.round(lv*rnd(4,8)*2);INV.pot+=2;toast('Skarb lochu!','#ffd34d');for(let i=0;i<3;i++){const it=genItem(lv,40);if(INV.bag.length<BAGN){INV.bag.push(it);toast(it.name,RAR[it.rar].c)}}gainXp(60*lv);saveInv();saveW();updHud()}
function spaceSpawnList(def){const s=SPACES.get(def.id)||(def.type==='jaskinia'||def.type==='loch'?genDungeon({id:def.id.slice(3),type:def.type,x:def.x,z:def.z,lvl:def.lvl,b:def.b}):null);if(!s)return[];
  const cave=s.kind==='cave',out=[],R=s.rooms,mob=cave?['pajak','slime','ropucha','pajak','bazyliszek']:['szkielet','lucznik_s','szkielet','upior','mumia'],boss=cave?(def.b===6||def.b===5?'troll':'matka'):(strHash(s.id)%2?'lich':'krol_s');
  R.forEach((q,k)=>{if(k===0)return;const last=k===R.length-1,n=last?2:1+(k%2);for(let i=0;i<n;i++)out.push([mob[(k+i)%mob.length],s.x0+(q.cx+0.5+(i-0.5)*1.2)*s.cs,s.fy,s.z0+(q.cz+0.5)*s.cs,false]);if(last)out.push([boss,s.x0+(q.cx+0.5)*s.cs,s.fy,s.z0+(q.cz-0.3)*s.cs,true])});
  return out}
