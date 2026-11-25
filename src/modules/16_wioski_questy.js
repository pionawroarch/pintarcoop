// =================== ETAP 4: wioski, NPC, dialogi, questy, renoma ===================
const VR=384;
const strHash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
function mulb(a){return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rngOf=s=>mulb(strHash(s+'|'+S.seed));
const rpick=(r,a)=>a[Math.floor(r()*a.length)];
const RACES={
 ludzie:{n:'Ludzie',skin:['#f1c9a5','#e0b08a','#c98f65'],hair:['#4a2f1d','#2b1d12','#c9a65a','#8a4a2a'],cloth:['#7a4b8a','#3f6fa8','#8a5a2f','#5f7a3a','#a8452f'],hs:1,ws:1,
   wall:'#d8c9a8',beam:'#6b4a2b',roof:'#a8452f',found:'#8b8b8e',
   m:['Borys','Mieszko','Zbyszko','Bolko','Radek','Wojsław','Dobromir','Lech'],f:['Jadwiga','Dobrawa','Wanda','Halina','Zofia','Bogna','Mirosława','Agata'],
   vA:['Stara','Nowa','Biała','Wilcza','Dębowa','Zielona','Cicha','Górna','Dolna','Sosnowa'],vB:['Wola','Łąka','Polana','Kłoda','Struga','Dolina','Górka','Przystań'],
   neutral:'Dzień dobry. Rzadko ktoś tu zagląda.',rum:['Mówią, że nocami po lesie krąży wilk wielki jak koń.','Kupiec z południa opowiadał o ruinach pełnych złota.','Stary młynarz przysięga, że widział w rzece srebrną rybę, która mówi.']},
 elfy:{n:'Elfy',skin:['#f6dcc4','#efd2b8'],hair:['#e8d8a0','#cfd6dc','#2b1d12'],cloth:['#3f8a5a','#6aa84f','#c9b48a','#4a7aa0'],hs:1.08,ws:0.92,ears:1,
   wall:'#e8e2c8',beam:'#b89a64',roof:'#4f9a3e',found:'#9aa58a',
   m:['Aelar','Thalion','Faelar','Ithar','Caelen','Naeril'],f:['Liriel','Eluna','Sylwen','Naeris','Aerin','Miriel'],
   vA:['Lith','Ael','Sil','Eren','Thal','Cael','Mir'],vB:['anor','ithil','wen','andel','oria','aryn'],
   neutral:'Las jest dziś niespokojny. Witaj, wędrowcze.',rum:['Drzewa pamiętają czasy, gdy w tych lasach nie było potworów.','Na zachodzie stoi kamień, który śpiewa przy pełni księżyca.','Nasi zwiadowcy widzieli gobliny, które nosiły elfie łuki. Ktoś je uzbraja.']},
 krasnoludy:{n:'Krasnoludy',skin:['#e8b894','#d9a27c'],hair:['#8a3a1a','#4a2f1d','#9a9a9a','#c9a65a'],cloth:['#5a5a6a','#7a3a2a','#3a4a5a','#6b5a3a'],hs:0.82,ws:1.25,beard:1,
   wall:'#8d8b88',beam:'#5a3d24',roof:'#4a4a55',found:'#6c6a67',
   m:['Borin','Tharn','Brokk','Rurik','Gundar','Halvar'],f:['Grimma','Hilda','Dagna','Odda','Brunla','Sigra'],
   vA:['Kamienna','Żelazna','Głęboka','Szara','Miedziana'],vB:['Brama','Kuźnia','Sztolnia','Twierdza','Grań'],
   neutral:'Hm. Witaj. Tylko nie dotykaj kowadła.',rum:['W górach golemy budzą się coraz częściej. Coś je wzywa.','Najlepsza ruda leży tam, gdzie śnieg nigdy nie topnieje.','Mój dziad wykuł topór, który przeciął głaz. Ten topór gdzieś zaginął.']},
 orkowie:{n:'Orkowie',skin:['#7aa05a','#6b8f4a','#8aa86a'],hair:['#1a1a1a','#3a2a1a'],cloth:['#6b4a2b','#8a3a2a','#4a3a2a','#7a6a3a'],hs:1.05,ws:1.15,tusks:1,
   wall:'#8a6a45',beam:'#e8e0cc',roof:'#6b5a3a',found:'#7a6a55',
   m:['Gruk','Throk','Zug','Krag','Mogar','Rasz'],f:['Mazga','Urga','Bharga','Yaza','Ghala','Szura'],
   vA:['Gor','Mor','Ugr','Kra','Dhu','Zag'],vB:['ash','gul','thak','rok','mog'],
   neutral:'Grr. Mów, czego chcesz, obcy.',rum:['Skorpiony z pustyni robią się coraz większe. Dobre mięso.','Słabi ludzie boją się piasku. My nie.','Szaman mówi, że pod wydmami śpi coś starego.']},
 niziolki:{n:'Niziołki',skin:['#f1c9a5','#e8b890','#d9a27c'],hair:['#7a4a26','#a8632e','#4a2f1d','#c9a05a'],cloth:['#5a8a3a','#7a5a3a','#c8a060','#6a8a4a','#a8652f'],hs:0.74,ws:0.86,
   wall:'#e8dcc0',beam:'#6b4a2b',roof:'#5a8a3a',found:'#8a8070',
   m:['Bilbo','Tobiasz','Fredek','Maryś','Pippo','Ignaś','Kubuś','Gerwazy'],f:['Różyczka','Lila','Prymula','Stokrotka','Malwa','Jaśminka','Bella','Hortensja'],
   vA:['Zielony','Wesoły','Miodowy','Słoneczny','Cichy','Jabłkowy','Okrągły'],vB:['Pagórek','Sad','Zakątek','Dołek','Gaj','Ogródek','Kopiec'],
   neutral:'Dzień dobry! Może kawałek placka? Właśnie wyjęłam z pieca.',rum:['Za wzgórzem widziano wilki. Dobrze, że mamy żywopłoty.','Najlepsze jabłka rosną tam, gdzie nikt nie zagląda.','Wujek Fredek przysięga, że w starej norze mieszka smok. Fredek dużo przysięga.']},
 drowy:{n:'Drowy',skin:['#4a4a5a','#3e3e4e','#55556a'],hair:['#f0f0f8','#e0e0ea','#c8c8d8'],cloth:['#2a1a3a','#1a1426','#3a1a4a','#2a2a3a'],hs:1.06,ws:0.92,ears:1,
   wall:'#3a3448',beam:'#2a2230',roof:'#4a2a5a',found:'#2a2830',
   m:['Zaknafein','Vel\'kyn','Ryld','Jarlaxx','Nalfein','Dinin','Kelnozz','Malagdorl'],f:['Viconia','Quenthel','Ilphrin','Sabal','Zesstra','Triel','Malice','Shyntlara'],
   vA:['Xal','Vel','Zyr','Ilph','Shar','Ryl'],vB:['zarith','drach','thul','vrae','neth','lith'],
   neutral:'Światło cię oślepia, powierzchniowcze? Mów szybko.',rum:['Pod przeklętymi ziemiami ciągną się korytarze dłuższe niż wasze drogi.','Pajęcza Matka nie lubi, gdy ktoś depcze jej sieci.','Grzyby świecą jaśniej, gdy zbliża się burza z głębin.']},
 saurianie:{n:'Saurianie',skin:['#4a8a3a','#3a7a4a','#5a8a2a','#3a6a5a'],hair:['#2a5a2a','#1f4a3a'],cloth:['#8a5a2a','#6a4a2a','#a8452f','#4a6a3a'],hs:1.02,ws:1.02,lizard:1,nohelm:1,
   wall:'#8a7a4a',beam:'#4a3a22',roof:'#6a7a3a',found:'#5a5a4a',
   m:['Ssirak','Tlakor','Zixxa','Khaarn','Quatl','Ixtoc','Sekhar','Rhazz'],f:['Ssethra','Ixa','Tlalli','Zhari','Quessa','Kssira','Nhaa','Sallith'],
   vA:['Ssa','Kha','Zix','Tlo','Qua','Ixa'],vB:['ssik','tlan','koatl','zhar','pocha','xil'],
   neutral:'Sssłońce grzeje dziś mocno. Czego szukasz, ciepłokrwisty?',rum:['W bagnie żyje wąż starszy niż nasze drzewa.','Ciepłokrwiści toną w błocie. My w nim pływamy.','Kapłanka mówi, że z morza przyjdzie Lewiatan.']},
};
const ROLE={krol:['Król','Królowa'],dworzanin:['Dworzanin','Dama dworu'],doradca:['Doradca królewski','Doradczyni królewska'],blazen:['Błazen','Błaznica'],portowy:['Kapitan portu','Kapitanka portu'],najemnik:['Najemnik','Najemniczka'],straz:['Strażnik','Strażniczka'],starszy:['Starszy wioski','Starsza wioski'],kupiec:['Kupiec','Kupcowa'],kowal:['Kowal','Kowalka'],mieszk:['Mieszkaniec','Mieszkanka'],wedr:['Wędrowiec','Wędrowczyni']};
const TIERS=[[-1e9,'Wrogi','#ff6b5b'],[-100,'Nieufny','#ff9d6b'],[-20,'Neutralny','#d8d8d8'],[50,'Przyjazny','#7dd87d'],[150,'Honorowany','#5fb8ff'],[300,'Uwielbiany','#ffd34d']];
const tierOf=v=>{let t=0;for(let i=0;i<TIERS.length;i++)if(v>=TIERS[i][0])t=i;return t};
const PRICE=[2,1.2,1,0.9,0.8,0.75];

// ---------- stan świata gracza (zapisywany per seed) ----------
let W={};
function loadW(){W=LS.get('world_'+S.seed,null)||{rep:{ludzie:0,elfy:0,krasnoludy:0,orkowie:0},karma:0,fame:0,quests:[],qdone:{},flags:{},seen:{}};W.opened=W.opened||{};W.huts=W.huts||[];W.quests=W.quests||[];W.qdone=W.qdone||{};try{typeof syncHuts==='function'&&syncHuts()}catch(_){}for(const k in RACES)if(W.rep[k]==null)W.rep[k]=0;try{digLoad()}catch(_){}}
function saveW(){LS.set('world_'+S.seed,W)}
loadW();setTimeout(()=>{try{mapDbLoad()}catch(_){}},200);
function addRep(race,v,silent){W.rep[race]=Math.max(-500,Math.min(600,(W.rep[race]||0)+v));if(v>0)W.fame+=v;if(!silent&&v)toast((v>0?'+':'')+v+' renomy: '+RACES[race].n,v>0?'#7dd87d':'#ff8a7a');saveW()}
function addKarma(v){W.karma+=v;saveW()}
function title(){const k=W.karma;return k<=-50?'Złoczyńca':k<-15?'Łotr':k<15?'Wędrowiec':k<60?'Obrońca':'Bohater'}

// ---------- wioski ----------
const villages=new Map(), villReq=new Set();
function villName(v){const R=RACES[v.race],r=rngOf('vn'+v.id);return v.race==='elfy'||v.race==='orkowie'||v.race==='drowy'||v.race==='saurianie'?rpick(r,R.vA)+rpick(r,R.vB):rpick(r,R.vA)+' '+rpick(r,R.vB)}
function villLvl(v){const sp=spawnPt();return Math.max(1,1+Math.floor(Math.hypot(v.x-sp[0],v.z-sp[2])/260))}
function villTick(){
  if(!S.spawn)return;const rx=Math.floor(player.p.x/VR),rz=Math.floor(player.p.z/VR),need=[];
  for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){const k=(rx+dx)+'_'+(rz+dz);if(!villages.has(k)&&!villReq.has(k)){need.push([rx+dx,rz+dz]);villReq.add(k)}}
  if(need.length){const w=workers[workers.length-1];w.busy++;w.postMessage({type:'vill',seed:S.seed,regions:need,sx:S.spawn[0],sz:S.spawn[2],id:reqId++})}
  {const gx=Math.floor(player.p.x/CR),gz=Math.floor(player.p.z/CR),cn=[];for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const k='C'+(gx+dx)+'_'+(gz+dz);if(!villages.has(k)&&!villReq.has(k)){cn.push([gx+dx,gz+dz]);villReq.add(k)}}
   if(cn.length){const w=workers[0];w.busy++;w.postMessage({type:'city',seed:S.seed,cells:cn,sx:S.spawn[0],sz:S.spawn[2],id:reqId++})}}
  roadsTick();
  const lim=S.rd*C+50;
  for(const v of villages.values()){if(!v)continue;const d=Math.hypot(v.x-player.p.x,v.z-player.p.z);
    const ext=v.city?v.Hs:0;if(d<lim+ext&&!v.g)buildVillage(v);else if(d>lim+ext+80&&v.g)unbuildVillage(v);
    if(v.g&&v._treeDirty&&!v._dgMiss&&performance.now()-(v._trT||0)>700){v._trT=performance.now();v._treeDirty=0;try{villageTrees(v,v.g)}catch(e){}}
    if(v.g&&v._dgMiss&&performance.now()-(v._dgT||0)>Math.min(8000,1500*Math.pow(1.6,v._dgTry||0))&&v._dgCN!==CHUNKN&&(villHeightsReady(v)||performance.now()-(v._dgT||0)>20000)){/* v122: przebudowa ozdób miasta tylko po wczytaniu nowych fragmentów terenu, coraz rzadziej */v._dgT=performance.now();v._dgCN=CHUNKN;v._dgTry=(v._dgTry||0)+1;try{const dg=decorGeo(v);if(v._decoM){v.g.remove(v._decoM);v._decoM.geometry.dispose();v._decoM=null}if(dg){const dm=new THREE.Mesh(dg,matB);dm.position.set(v.x,v.h+0.015,v.z);dm.scale.setScalar(BS);dm.castShadow=true;dm.receiveShadow=true;v.g.add(dm);v._decoM=dm}villageTrees(v,v.g);villageLights(v,v.g)}catch(e){}}
    if(!v.wander&&d<Math.max(v.city?(v.Hs||60)+55:75,S.rd*C*0.92+(v.city?v.Hs||0:0))&&!W.seen[v.id]){W.seen[v.id]=1;saveW();MAP3D.dirty=true;try{mapV.dirty=true}catch(_){}if(v.name)toast('Odkryto: '+v.name,'#ffe7a8')}}
  roadReveal();
}
function onVill(list){for(const {rx,rz,v} of list){const k=rx+'_'+rz;villReq.delete(k);if(v){v.name=villName(v);v.lvl=villLvl(v);setupHouses(v);v.npcs=genNpcs(v);addFarms(v)}villages.set(k,v)}}
function onCity(list){for(const {gx,gz,c} of list){const k='C'+gx+'_'+gz;villReq.delete(k);if(c)setupCity(c);villages.set(k,c)}try{bridgesUpdate()}catch(e){}}
function clearVillages(){for(const v of villages.values())if(v&&v.g)unbuildVillage(v);villages.clear();villReq.clear();closeDialog()}
const FTYPE={kuznia:()=> 'chalupa',piekarnia:()=> 'chalupa',spichlerz:()=> 'chata',kaplica:()=> 'chalupa',warsztat:()=> 'chata',dom:r=>['chata','chata','chalupa','chalupa','dom'][Math.floor(r()*5)],sklep:()=> 'kupiec',karczma:()=> 'karczma',stajnia:()=> 'dlugi'};
const CFTYPE={kuznia:()=> 'chalupa',piekarnia:()=> 'dom',spichlerz:()=> 'chata',kaplica:()=> 'wiezaDom',warsztat:()=> 'chalupa',dom:r=>['kamienica','kamienica','podcienia','dom'][Math.floor(r()*4)],sklep:()=> 'kupiec',karczma:()=> 'karczma'};
// chaty rolników i rolnicy (po wygenerowaniu NPC, żeby nie przesuwać ich miejsc)
function addFarms(v){const F=v.farm;if(!F)return;v.cols=v.cols||[];
  F.huts.forEach((q,i)=>{const r=rngOf(v.id+'farm'+i),h={x:q.x,z:q.z,top:q.h,bot:q.h-1,rot:q.rot,type:'chata',v:Math.floor(r()*5),func:'farma',farm:1};const c=houseCore(h);h.core=c;h.cx=h.x+c.ox*Math.cos(h.rot)+c.oz*Math.sin(h.rot);h.cz=h.z-c.ox*Math.sin(h.rot)+c.oz*Math.cos(h.rot);v.houses.push(h);
    const R=RACES[v.race],fem=r()<0.4,pool=fem?R.f:R.m,p=F.plots.reduce((a,b)=>Math.hypot(b.x-q.x,b.z-q.z)<Math.hypot(a.x-q.x,a.z-q.z)?b:a,F.plots[0]);
    v.npcs.push({id:v.id+':rolnik'+i,vid:v.id,role:'mieszk',fem,name:pool[Math.floor(r()*pool.length)],roleN:fem?'Rolniczka':'Rolnik',x:q.x+Math.sin(q.rot)*5.5,z:q.z+Math.cos(q.rot)*5.5,ry:q.rot,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,['#8a6a3a','#6a5a3a','#7a3a2a','#5a6a3a']),race:v.race,qg:false,plot:p,farmer:1})});
  for(const q of F.mills)v.cols.push([q.x,q.z,2.2,2.2,q.h+9])}
function setupHouses(v){
  const fr=rngOf(v.id+'fn'),FN=['kuznia','piekarnia','spichlerz','kaplica','warsztat','dom'].sort(()=>fr()-0.5);
  v.houses.forEach((h,i)=>{const r=rngOf(v.id+'h'+i);h.func=i===0?'sklep':i===1?'stajnia':i===2?'karczma':FN[(i-3)%FN.length];h.type=i===0?'kupiec':i===1?'dlugi':i===2?'karczma':FTYPE[h.func](r);h.v=Math.floor(r()*5);
    const c=houseCore(h);h.core=c;h.cx=h.x+c.ox*Math.cos(h.rot)+c.oz*Math.sin(h.rot);h.cz=h.z-c.ox*Math.sin(h.rot)+c.oz*Math.cos(h.rot)});
}
function wellGeo(R){const L=[],S='#8e8994',S2='#9a95a0',SD='#6f6a73',W=R.beam||'#4a2f1d',RF=R.roof||'#a8452c';
  L.push([0,0.08,0,3.0,0.16,3.0,SD]);
  for(const [x,z,w,d] of [[0,1.05,2.2,0.42],[0,-1.05,2.2,0.42],[1.05,0,0.42,2.2],[-1.05,0,0.42,2.2]])L.push([x,0.62,z,w,0.95,d,S],[x,1.13,z,w+0.08,0.1,d+0.08,S2]);
  for(const [x,z] of [[0.8,0.8],[-0.8,0.8],[0.8,-0.8],[-0.8,-0.8]])L.push([x,0.62,z,0.62,0.95,0.62,S]);
  L.push([0,0.7,0,1.7,0.04,1.7,'#3f6d9a'],[0,0.45,0,1.7,0.45,1.7,'#2c4f70']);
  for(const sg of [-1,1])L.push([sg*1.12,2.05,0,0.2,1.95,0.2,W],[sg*1.12,1.2,0,0.3,0.12,0.3,'#3a2414']);
  L.push([0,2.35,0,2.5,0.09,0.09,W],[1.4,2.35,0,0.08,0.4,0.08,W],[1.5,2.18,0.15,0.3,0.06,0.06,W],[0,1.95,0,0.025,0.75,0.025,'#d8c8a0'],[0,1.5,0,0.32,0.3,0.32,'#7a5532'],[0,1.66,0,0.36,0.04,0.36,'#3a3a40']);
  const steps=5;for(let i=0;i<steps;i++){const w=3.1-i*0.52,y=3.05+i*0.22;L.push([0,y,0,1.9-i*0.02,0.22,w,i%2?'#93391f':RF])}
  L.push([0,3.05+steps*0.22+0.06,0,2.0,0.1,0.18,'#6a2a1a'],[0,2.98,0,2.4,0.08,3.3,'#6a2a1a']);
  L.push([0.7,0.4,1.6,0.42,0.5,0.42,'#7a5532'],[0.7,0.66,1.6,0.46,0.04,0.46,'#3a3a40'],[0.7,0.62,1.6,0.34,0.04,0.34,'#3f6d9a']);
  const g=kitB(L);g.userData.kit=1;return g}
// ozdoby osad: atrybuty budynków wg funkcji, ławki, latarnie, beczki, skrzynie, siano, kwiaty, drzewka
function rotB(b,rot,ox,oz,oy){const q=((Math.round(rot/(Math.PI/2))%4)+4)%4,[x,y,z,w,h,d,c]=b;let X=x,Z=z,W=w,D=d;
  if(q===1){X=z;Z=-x;W=d;D=w}else if(q===2){X=-x;Z=-z}else if(q===3){X=-z;Z=x;W=d;D=w}return[ox+X,oy+y,oz+Z,W,h,D,c]}
const WD='#7a5030',WDD='#4a2f1d',ST1='#8e8994',IRON='#3a3a40';
function barrel(L,x,y,z){if(DGY)y+=DGY(x,z);L.push([x,y+0.42,z,0.62,0.84,0.62,'#8a5a30'],[x,y+0.2,z,0.66,0.06,0.66,IRON],[x,y+0.64,z,0.66,0.06,0.66,IRON])}
function crate(L,x,y,z,s){if(DGY)y+=DGY(x,z);s=s||0.7;L.push([x,y+s/2,z,s,s,s,'#9a7048'],[x,y+s/2,z,s+0.03,0.08,s+0.03,'#6b4a2b'])}
function hay(L,x,y,z){if(DGY)y+=DGY(x,z);L.push([x,y+0.42,z,1.1,0.84,0.75,'#d8b24a'],[x,y+0.42,z,1.13,0.08,0.78,'#a8803a'])}
function bench(L,x,y,z,ax){if(DGY)y+=DGY(x,z);L.push(ax?[x,y+0.45,z,1.6,0.1,0.45,WD]:[x,y+0.45,z,0.45,0.1,1.6,WD]);for(const s of [-0.6,0.6])L.push(ax?[x+s,y+0.2,z,0.1,0.4,0.4,WDD]:[x,y+0.2,z+s,0.4,0.4,0.1,WDD])}
function lamp(L,x,y,z){if(DGY)y+=DGY(x,z);if(DLAMP)DLAMP.push([x,y+3.08,z]);L.push([x,y+0.15,z,0.4,0.3,0.4,ST1],[x,y+1.8,z,0.14,3.3,0.14,IRON],[x,y+3.35,z,0.42,0.06,0.42,IRON],[x,y+3.08,z,0.3,0.42,0.3,'#ffd27a'],[x,y+2.85,z,0.36,0.05,0.36,IRON])}
let DTREE=null,DGY=null,DLAMP=null;
function smallTree(L,x,y,z,s,col){s=s||1;if(DTREE){DTREE.push([x,z,s,col]);return}if(DGY)y+=DGY(x,z);col=col||'#4a8a3a';L.push([x,y+0.9*s,z,0.32*s,1.8*s,0.32*s,'#6b4528'],[x,y+2.3*s,z,1.9*s,1.3*s,1.9*s,col],[x,y+3.1*s,z,1.2*s,0.8*s,1.2*s,darker(col,1.15)],[x,y+2.2*s,z,2.2*s,0.7*s,1.1*s,darker(col,0.9)])}
function flowers(L,x,y,z,w,ax){if(DGY)y+=DGY(x,z);L.push(ax?[x,y+0.15,z,w,0.3,0.36,'#6b4a2b']:[x,y+0.15,z,0.36,0.3,w,'#6b4a2b']);const C3=['#e8484b','#f2c534','#d96bd0','#ffffff'];const n=Math.max(2,Math.round(w/0.35));for(let i=0;i<n;i++){const o=-w/2+(i+0.5)*w/n;L.push(ax?[x+o,y+0.38,z,0.2,0.16,0.2,C3[i%4]]:[x,y+0.38,z+o,0.2,0.16,0.2,C3[i%4]])}}
function houseDecor(L,h,v,city){const dgS=DGY;DGY=null;try{houseDecor0(L,h,v,city,dgS)}finally{DGY=dgS}}
function houseDecor0(L,h,v,city,dgS){const c=h.core,yo=h.top-v.h,ox=h.x-v.x,oz=h.z-v.z,f=c.oz+c.d/2,sr=c.ox+c.w/2,sl=c.ox-c.w/2,r=rngOf('dec'+h.x+'_'+h.z),P=[];
  const SIGN={kuznia:'#3a3a40',piekarnia:'#d8a43a',spichlerz:'#d8b24a',kaplica:'#e6e0c8',warsztat:'#8a6240',sklep:'#d9b23a',karczma:'#a8452c',stajnia:'#6b4528',farma:'#5a8a3a'};
  if(SIGN[h.func]){P.push([sr-0.5,3.05,f+0.45,0.08,0.08,0.9,WDD],[sr-0.5,2.6,f+0.82,0.07,0.72,0.78,'#8a6240'],[sr-0.5,2.6,f+0.82,0.1,0.36,0.36,SIGN[h.func]])}
  const fr=city?0.55:1.2;
  if(h.func==='dom'||h.func==='kaplica'){P.push(...(()=>{const T=[];flowers(T,c.ox-c.w*0.25,1.3,f+0.2,1.1,1);flowers(T,c.ox+c.w*0.25,1.3,f+0.2,1.1,1);return T})());if(!city&&r()<0.6){const T=[];bench(T,sl+1.2,0,f+fr,1);P.push(...T)}if(!city&&r()<0.5)for(let k=0;k<3;k++)P.push([sl-0.45,0.22+k*0.36,c.oz-0.6+k*0.06,0.5,0.34,1.6,'#8a6240'])}
  if(h.func==='kuznia'){P.push([sl+1.2,0.55,f+fr,1.4,1.1,1.0,ST1],[sl+1.2,1.0,f+fr+0.52,0.8,0.36,0.04,'#ff8a2e'],[sl+1.2,1.6,f+fr,0.6,1.0,0.6,ST1],[c.ox+0.4,0.4,f+fr,0.5,0.8,0.4,WDD],[c.ox+0.4,0.86,f+fr,0.9,0.18,0.36,IRON]);if(!city)P.push([c.ox,2.3,f+1.1,3.6,0.12,2.0,'#7a5030'],[c.ox-1.7,1.15,f+2,0.14,2.3,0.14,WDD],[c.ox+1.7,1.15,f+2,0.14,2.3,0.14,WDD])}
  if(h.func==='piekarnia'){P.push([sl+1.1,0.65,f+fr,1.5,1.3,1.2,'#b8573a'],[sl+1.1,1.45,f+fr,1.1,0.4,0.9,'#a84a30'],[sl+1.1,2.0,f+fr-0.3,0.35,0.9,0.35,'#8a3a28']);const T=[];crate(T,sr-0.8,0,f+fr,0.6);P.push(...T,[sr-0.8,0.68,f+fr,0.4,0.12,0.25,'#d8a43a'])}
  if(h.func==='spichlerz'||h.func==='farma'){const T=[];hay(T,sl+0.9,0,f+fr);hay(T,sl+0.9,0.84,f+fr);for(let k=0;k<3;k++)T.push([sr-0.6-k*0.65,0.3,f+fr,0.55,0.6,0.5,'#d8c8a0']);P.push(...T)}
  if(h.func==='warsztat'){for(let k=0;k<4;k++)P.push([sl+1.2,0.2+k*0.38,f+fr,1.8,0.36,0.36+((k%2)*0.04),'#7a5532']);P.push([sr-1,0.5,f+fr,1.2,0.1,0.3,'#9a7048'],[sr-1.5,0.25,f+fr,0.1,0.5,0.5,WDD],[sr-0.5,0.25,f+fr,0.1,0.5,0.5,WDD])}
  if(h.func==='karczma'){const T=[];barrel(T,sl+0.7,0,f+fr);barrel(T,sl+1.45,0,f+fr);if(!city){T.push([c.ox+0.6,0.75,f+2.2,1.4,0.1,0.9,WD],[c.ox+0.6,0.37,f+2.2,0.14,0.74,0.14,WDD]);bench(T,c.ox+0.6,0,f+1.55,1);bench(T,c.ox+0.6,0,f+2.85,1)}P.push(...T)}
  if(h.func==='sklep'){const T=[];crate(T,sl+0.6,0,f+fr);crate(T,sl+1.4,0,f+fr,0.6);crate(T,sl+0.6,0.7,f+fr,0.5);barrel(T,sr-0.6,0,f+fr);P.push(...T)}
  if(h.func==='stajnia'&&!city){for(let k=0;k<5;k++)P.push([sl+k*1.5,0.5,f+2.6,0.14,1.0,0.14,WDD]);P.push([c.ox,0.75,f+2.6,c.w,0.1,0.08,WD],[c.ox,0.4,f+2.6,c.w,0.1,0.08,WD],[sr-1,0.3,f+1.2,1.6,0.5,0.5,'#6b4a2b'],[sr-1,0.5,f+1.2,1.4,0.06,0.36,'#3f6d9a']);const T=[];hay(T,sl+1,0,f+1.3);P.push(...T)}
  if(h.func==='kaplica'&&!city){P.push([sr+0.9,1.6,f-0.6,0.16,3.2,0.16,WDD],[sr+0.9,1.6,f+0.6,0.16,3.2,0.16,WDD],[sr+0.9,3.25,f,0.2,0.16,1.5,WDD],[sr+0.9,2.75,f,0.5,0.6,0.5,'#c9a24a'])}
  if(h.func==='farma'){P.push([sr+0.8,0.6,f+1.6,0.14,1.2,0.14,WDD]);const T=[];barrel(T,sr-0.6,0,f+fr);P.push(...T)}
  // przedmioty stojące na ziemi przed domem siadają na terenie (bez lewitowania), skrzynki na oknach zostają na ścianie
  // wystrój domu w jego własnym układzie (obracany razem z domem pod dowolnym kątem)
  const HL=[],RC=Math.cos(h.rot),RS=Math.sin(h.rot),W2=(lx,lz)=>[ox+lx*RC+lz*RS,oz-lx*RS+lz*RC];if(DROT)DROT.push({L:HL,ang:h.rot,x:ox,z:oz});
  const gCache={};for(const b of P){const q=[b[0],b[1]+yo,b[2],b[3],b[4],b[5],b[6]];const bot=b[1]-b[4]/2;if(dgS&&b[2]>f-0.2&&bot<1.0){const [wx,wz]=W2(b[0],b[2]),k=Math.round(wx/1.8)+','+Math.round(wz/1.8);if(gCache[k]==null){const gy=dgS(wx,wz);gCache[k]=Math.abs(gy-yo)<3.5?gy-yo:0}q[1]+=gCache[k]}(DROT?HL:L).push(DROT?q:rotB(b,h.rot,ox,oz,yo+(q[1]-b[1]-yo)))}
  // kamienna podmurówka: wypełnia szczelinę między domem a niższym terenem (dom nie wisi w powietrzu)
  if(dgS){const SK=city?'#77727c':'#6f6a73',SKD=darker(SK,0.85),seg=(lx,lz,w,d)=>{const [wx,wz]=W2(lx,lz);const g=dgS(wx,wz);const gap=yo-g;if(gap>0.08){const hh=Math.min(gap+0.3,8);HL.push([lx,yo-hh/2+0.05,lz,w,hh,d,gap>1.2?SKD:SK])}};
    for(let x=sl+0.5;x<sr;x+=1)seg(x,f+0.06,1.02,0.14),seg(x,c.oz-c.d/2-0.06,1.02,0.14);for(let z=c.oz-c.d/2+0.5;z<f;z+=1)seg(sl-0.06,z,0.14,1.02),seg(sr+0.06,z,0.14,1.02);
    // stopnie pod drzwiami, gdy teren przed wejściem jest niżej niż próg
    {const [wx,wz]=W2(c.ox,f+0.9),g=dgS(wx,wz),gap=yo-g;if(gap>0.25&&gap<3.5){const n=Math.min(6,Math.ceil(gap/0.3));for(let i=0;i<n;i++){const top=yo-(i+1)*gap/n;HL.push([c.ox,(top+g)/2,f+0.45+i*0.42,1.7,Math.max(0.1,top-g+gap/n),0.44,i%2?SKD:SK])}}}}}
function decorGeo(v,forMap){DTREE=[];DLAMP=[];const mk=forMap?'_dgMissM':'_dgMiss';v[mk]=0;DGY=(x,z)=>{let h=colAt(v.x+x,v.z+z);if(h==null){h=mapHeightAt(v.x+x,v.z+z);if(h==null||!forMap)v[mk]=1}return h==null?0:Math.max(-12,Math.min(12,h-v.h))};/* dekoracje w jednostkach świata (kitB dzieli przez BS, siatka ×BS) */try{return decorGeo0(v)}finally{try{const Z=doorZones(v);if(DTREE)DTREE=DTREE.filter(([x,z])=>!v.houses.some(h=>{if(!h.core)return false;const dx=x-(h.x-v.x),dz=z-(h.z-v.z),c=Math.cos(h.rot),sn=Math.sin(h.rot),lx=dx*c-dz*sn,lz=dx*sn+dz*c,m=h.kcastle?4:2.2;return Math.abs(lx)<h.core.pw/2+m&&Math.abs(lz)<h.core.pd/2+m+(h.kcastle?4:0)}));if(DTREE)DTREE=DTREE.filter(([x,z])=>!Z.some(([zx,zz,fx,fz,lat,fw])=>{const rx=x-zx,rz=z-zz,f=rx*fx+rz*fz;return f>-1&&f<fw+1.5&&Math.abs(rx*fz-rz*fx)<lat+1.6}))}catch(_){}v._trees=DTREE;v._lamps=DLAMP;DTREE=null;DGY=null;DLAMP=null}}
function doorZones(v){const Z=[];for(const h of v.houses){if(!h.core||h.castle)continue;const [dx,dz]=doorOf(h),fx=Math.sin(h.rot),fz=Math.cos(h.rot);Z.push([dx-v.x-fx*0.4,dz-v.z-fz*0.4,fx,fz,h.arena||h.big?2.1:1.05,h.arena||h.big?4.5:3.0,h.top-v.h+2.1])}return Z}
let DROT=null;
function decorGeo0(v){DROT=[];try{return decorGeo00(v)}finally{DROT=null}}
/* v140: drobne detale terenu w osadach — kępy trawy, kwiaty, kamienie, krzaki, skrzynki i worki */
function settleDetail(L,v,n,R,ok,seed){const gr=rngOf(seed+v.id),GC=['#5a9a3c','#4f8e36','#66a646','#72b04e','#5f9a40'],FC=['#e8484b','#f2c534','#7a8ae0','#ffffff','#d96bd0','#f08aa0'],Y=(x,z)=>DGY?DGY(x,z):0;
  const tuft=(x,z,k,big)=>{const y=Y(x,z),S=big?1.6:1;for(let i=0;i<k;i++){const ox=(gr()-.5)*0.9*S,oz=(gr()-.5)*0.9*S,h=(0.32+gr()*0.45)*S,w=0.09+gr()*0.05;L.push([x+ox,y+h/2,z+oz,w,h,w,GC[(i+(gr()*5|0))%5]])}};
  for(let i=0;i<n;i++){const a=gr()*Math.PI*2,rr=Math.sqrt(gr())*R,x=Math.cos(a)*rr,z=Math.sin(a)*rr;if(!ok(x,z))continue;const t=gr(),y=Y(x,z);
    if(t<0.36)tuft(x,z,5+(gr()*5|0));
    else if(t<0.48)tuft(x,z,8+(gr()*6|0),1);
    else if(t<0.52)smallTree(L,x,0,z,0.75+gr()*0.35,GC[(gr()*5)|0]);
    else if(t<0.66){tuft(x,z,3);for(let k=0;k<3;k++){const ox=(gr()-.5)*0.7,oz=(gr()-.5)*0.7;L.push([x+ox,y+0.42,z+oz,0.14,0.1,0.14,FC[(gr()*6)|0]])}}
    else if(t<0.76){const w=0.35+gr()*0.5;L.push([x,y+0.1,z,w,0.2+gr()*0.15,w*(0.7+gr()*0.5),gr()<0.5?'#8e8994':'#7e7984']);if(gr()<0.5)tuft(x+0.4,z,2)}
    else if(t<0.88){const s2=0.7+gr()*0.6;L.push([x,y+0.32*s2,z,0.95*s2,0.64*s2,0.9*s2,'#3f7834'],[x+0.12*s2,y+0.62*s2,z-0.08*s2,0.62*s2,0.36*s2,0.6*s2,'#4a8a3a'],[x-0.2*s2,y+0.5*s2,z+0.2*s2,0.4*s2,0.3*s2,0.4*s2,'#5a9a3e'])}
    else if(t<0.93){L.push([x,y+0.22,z,0.5,0.44,0.42,'#b89a6a'],[x,y+0.47,z,0.3,0.06,0.26,'#8a6a40']);if(gr()<0.6)L.push([x+0.45,y+0.18,z+0.1,0.42,0.36,0.36,'#c8aa78'])}
    else if(t<0.97)crate(L,x,0,z,0.6+gr()*0.3);
    else barrel(L,x,0,z)}}
function decorGeo00(v){const L=[],r=rngOf('decor'+v.id);
  // mury oporowe tarasów miasta (kamienne lico uskoku z niskim parapetem) — wszędzie, gdzie sąsiednie pola leżą na różnych poziomach (bez ulic: tam rampy)
  if(v.city&&v.lv){const dgS=DGY;DGY=null;const pl=cityPlan(v),E=Math.ceil(v.Hs*0.99),NN=2*E+1,LV=new Int8Array(NN*NN).fill(-99);
    for(let z=-E;z<=E;z++)for(let x=-E;x<=E;x++){if(pl.rho(x,z)<0.975&&!pl.streetAt(x,z))LV[(z+E)*NN+x+E]=cityLvl(v,x,z,false)}
    for(let z=-E;z<E;z++)for(let x=-E;x<E;x++){const a=LV[(z+E)*NN+x+E];if(a===-99)continue;for(const [dx,dz] of [[1,0],[0,1]]){const b=LV[(z+dz+E)*NN+x+dx+E];if(b===-99||a===b)continue;const hi=Math.max(a,b),lo=Math.min(a,b),sg=a>b?1:-1,hh=hi-lo+0.55,wx=x+dx*(0.5+0.23*sg),wz=z+dz*(0.5+0.23*sg),ln=1.0+((x+z)&1)*0.012;/* v107: lico muru nie leży w płaszczyźnie ścianki terenu (migotanie tekstur) */
      L.push([wx,lo+hh/2-0.01,wz,dx?0.34:ln,hh,dx?ln:0.34,((x+z)&3)?'#8e8994':'#7e7984']);if(((x*7+z*3)%3+3)%3===0)L.push([wx,lo+hh-0.08,wz,dx?0.44:ln+0.03,0.16,dx?ln+0.03:0.44,'#a8a2a8'])}}
    DGY=dgS}
  if(v.city&&v.pier){const dgS=DGY;DGY=null;const U=1,ps=[[0,-1],[0,1],[-1,0],[1,0]][v.port],yd=(WATER+1.2-v.h)*U,ax=ps[0],az=ps[1];
    const PL=(v.portD||v.Hs+24)+8;for(let d=v.Hs+2,k=0;d<PL;d+=1.4,k++)L.push([ax*d*U,yd,az*d*U,(az?4:1.3)*U,0.3*U,(ax?4:1.3)*U,k%2?'#8a6240':'#7a5532']);
    for(let d=v.Hs+4;d<PL;d+=4.5)for(const s of [-1.7,1.7])L.push([(ax*d+(az?s:0))*U,yd-1.6*U,(az*d+(ax?s:0))*U,0.4*U,3.4*U,0.4*U,'#4a2f1d']);
    for(const s of [-1,1]){const d=PL-8,bx=ax*d+(az?s*4.2:0),bz=az*d+(ax?s*4.2:0);L.push([bx*U,(WATER-0.1-v.h)*U,bz*U,(az?2:6)*U,0.7*U,(ax?2:6)*U,'#6e4a2c'],[bx*U,(WATER+0.4-v.h)*U,bz*U,(az?1.6:5.4)*U,0.3*U,(ax?1.6:5.4)*U,'#8a6240'])}
    crate(L,(ax*(PL-2)+(az?1:0))*U,yd,(az*(PL-2)+(ax?1:0))*U);barrel(L,(ax*(PL-4)-(az?1:0))*U,yd,(az*(PL-4)-(ax?1:0))*U);DGY=dgS}
  for(const h of v.houses)if(h.core&&!h.castle&&!h.arena&&!h.big)houseDecor(L,h,v,!!v.city);
  if(v.inCity)return null;
  if(v.small){const r2=rngOf('sm'+v.id);if(v.camp){for(const [x,z] of [[-6,-4],[6,-4],[0,-7]]){for(let k=0;k<4;k++){const s2=3.2-k*0.75;L.push([x,0.35+k*0.6,z,s2,0.6,s2,k%2?'#c8b89a':'#3f6a8a'])}}L.push([0,0.15,2,1.4,0.3,1.4,'#4a4a4a'],[0,0.5,2,0.8,0.5,0.8,'#ff8a2e']);crate(L,-2,0,-2);crate(L,2.6,0,-2.4);barrel(L,-5,0,1);hay(L,5,0,1)}
    if(v.temple){for(const x of [-4,4])L.push([x,0.3,4,1.2,0.6,1.2,'#d8d0c0'],[x,1.6,4,0.6,2.0,0.6,'#e8e2d6'],[x,2.75,4,0.8,0.3,0.8,'#c9a24a']);flowers(L,-2,0,7,2.2,1);flowers(L,2,0,7,2.2,1);smallTree(L,-6.5,0,0,1.1,'#5a9a3e');smallTree(L,6.5,0,0,1.1,'#5a9a3e')}
    if(!v.camp&&!v.temple){bench(L,-3,0,4,1);barrel(L,4,0,3);smallTree(L,-6,0,-1,1,'#4a8a3a');smallTree(L,6,0,-2,1.1,'#3f7834')}
    lamp(L,3.5,0,6);lamp(L,-3.5,0,6)}
  else if(!v.city){for(let k=0;k<4;k++){const a=k/4*Math.PI*2+0.4;lamp(L,Math.cos(a)*6.5,0,Math.sin(a)*6.5)}
    for(let k=0;k<3;k++){const a=k/3*Math.PI*2+1.2;bench(L,Math.cos(a)*4.6,0,Math.sin(a)*4.6,Math.abs(Math.cos(a))<0.7)}
    for(let k=0;k<4;k++){const a=k/4*Math.PI*2+0.95+r()*0.3,rr=10+r()*3;smallTree(L,Math.cos(a)*rr,0,Math.sin(a)*rr,0.9+r()*0.4,rpick(r,['#4a8a3a','#5a9a3e','#3f7834']))}
    for(let k=0;k<5;k++){const a=r()*6.28,rr=8+r()*6,x=Math.cos(a)*rr,z=Math.sin(a)*rr;const t=r();if(t<0.35)barrel(L,x,0,z);else if(t<0.6)crate(L,x,0,z);else if(t<0.8)hay(L,x,0,z);else flowers(L,x,0,z,1.2,1)}
    {const HO=v.houses.filter(h=>h.core).map(h=>[h.x-v.x,h.z-v.z,Math.max(h.core.pw,h.core.pd)/2+1.2]);settleDetail(L,v,320,30,(x,z)=>Math.hypot(x,z)>7.5&&!HO.some(([hx,hz,rr])=>Math.hypot(x-hx,z-hz)<rr),'vdet')}}
  else{const Hs=v.Hs,pl=cityPlan(v);
    const nP0=L.length;
    for(const [x,z] of [[10,4.5],[-10,-4.5],[4.5,-10],[-4.5,10]])smallTree(L,x,0,z,1.15,'#4a8a3a');
    for(const [x,z,ax] of [[3.6,0,0],[-3.6,0,0],[0,3.6,1],[0,-3.6,1]])bench(L,x,0,z,ax);
    MKT_A.forEach((an,i)=>{const R1=MKT_R+1.5,cx=Math.cos(an),cz=Math.sin(an),tx=-cz,tz=cx;if(i===6)return;const t=i%3;if(t===0){crate(L,cx*R1+tx*0.9,0,cz*R1+tz*0.9);barrel(L,cx*R1-tx*0.9,0,cz*R1-tz*0.9)}else if(t===1){hay(L,cx*R1+tx*1.0,0,cz*R1+tz*1.0);crate(L,cx*R1-tx*0.8,0,cz*R1-tz*0.8)}else{barrel(L,cx*R1+tx*0.8,0,cz*R1+tz*0.8);barrel(L,cx*R1+tx*1.3,0,cz*R1+tz*1.25)}});
    for(const [x,z] of [[11,11],[-11,11],[11,-11],[-11,-11]])flowers(L,x,0,z,1.6,1);
    {const TY=DGY?DGY(0,0):0,LP=(...a)=>{for(const q of a){q[1]+=TY;L.push(q)}};// targ: obramowanie placu z jaśniejszych płyt, maszty z girlandami proporczyków, wóz z towarem, koryto, waga, klatki z kurami
     const PV=['#9a948c','#a8a298','#8e887f'];for(let k=0;k<32;k++){const a=k/32*Math.PI*2,c=Math.cos(a),sn=Math.sin(a);for(const [rr,w] of [[8.6,0.5],[14.6,0.6]])LP([c*rr,0.035,sn*rr,Math.abs(sn)*w+Math.abs(c)*2.95*rr/14.6,0.05,Math.abs(c)*w+Math.abs(sn)*2.95*rr/14.6,PV[k%3]])}
     const PA=[0.785,2.356,3.927,5.498],PR=15.2,PC=['#c83a2a','#e8c040','#3f6fa8','#4a8a3a','#efe6d0','#8a3a8a'],pole=a=>[Math.cos(a)*PR,Math.sin(a)*PR];
     PA.forEach(a=>{const [x,z]=pole(a);LP([x,2.4,z,0.18,4.8,0.18,'#5a3c24'],[x,0.15,z,0.5,0.3,0.5,'#7e7984'],[x,4.85,z,0.3,0.1,0.3,'#c9a24a'],[x+0.25,4.5,z,0.5,0.32,0.03,PC[0]])});
     for(let i=0;i<4;i++){const [x0,z0]=pole(PA[i]),[x1,z1]=pole(PA[(i+1)%4]),N=18;for(let k=1;k<N;k++){const t=k/N,x=x0+(x1-x0)*t,z=z0+(z1-z0)*t,y=4.55-Math.sin(t*Math.PI)*1.1;LP([x,y,z,0.06,0.03,0.06,'#d8c8a0']);{const c=PC[(k+i)%PC.length],ax=Math.abs(x1-x0)>=Math.abs(z1-z0);LP([x,y-0.16,z,ax?0.3:0.03,0.24,ax?0.03:0.3,c],[x,y-0.33,z,ax?0.14:0.03,0.12,ax?0.03:0.14,c])}}
       /* sznur ciągnięty prosto — dorysowane łączniki między proporczykami */for(let k=0;k<N;k++){const t0=k/N,t1=(k+1)/N,xa=x0+(x1-x0)*t0,za=z0+(z1-z0)*t0,xb=x0+(x1-x0)*t1,zb=z0+(z1-z0)*t1,ya=4.55-Math.sin(t0*Math.PI)*1.1,yb=4.55-Math.sin(t1*Math.PI)*1.1,len=Math.hypot(xb-xa,zb-za);LP([(xa+xb)/2,(ya+yb)/2,(za+zb)/2,Math.abs(xb-xa)+0.03,Math.abs(yb-ya)+0.03,Math.abs(zb-za)+0.03,'#d8c8a0'])}}
     {const [x,z]=pole(PA[0]),ox=x-1.6,oz=z-1.6;/* wóz z workami i beczką */LP([ox,0.75,oz,1.5,0.12,2.4,'#7a5232'],[ox-0.72,0.95,oz,0.06,0.35,2.4,'#6a4628'],[ox+0.72,0.95,oz,0.06,0.35,2.4,'#6a4628'],[ox,0.95,oz-1.17,1.5,0.35,0.06,'#6a4628']);for(const [wx,wz] of [[-0.82,-0.8],[0.82,-0.8],[-0.82,0.8],[0.82,0.8]])LP([ox+wx,0.45,oz+wz,0.1,0.9,0.9,'#4a2f1d'],[ox+wx,0.45,oz+wz,0.12,0.2,0.2,'#3a3a40']);LP([ox,0.65,oz+1.7,0.08,0.08,1.3,'#5a3c24']);for(let k=0;k<4;k++)LP([ox+((k%2)-0.5)*0.6,1.05,oz+((k>>1)-0.5)*0.9,0.5,0.45,0.42,k%3?'#c8b088':'#b8a078']);barrel(L,ox,0.81,oz+0.6)}
     {const [x,z]=pole(PA[1]),ox=x+1.5,oz=z-1.4;/* koryto z wodą */LP([ox,0.3,oz,0.8,0.6,2.0,'#6a4628'],[ox,0.58,oz,0.6,0.04,1.8,'#4a7aa0'],[ox,0.05,oz,1.0,0.1,2.2,'#7e7984'])}
     {const [x,z]=pole(PA[2]),ox=x+1.5,oz=z+1.5;/* waga kupiecka na stole */LP([ox,0.75,oz,1.2,0.08,0.7,'#8f5a2a']);for(const [a2,b2] of [[-0.5,-0.25],[0.5,-0.25],[-0.5,0.25],[0.5,0.25]])LP([ox+a2,0.37,oz+b2,0.08,0.74,0.08,'#6b4528']);LP([ox,1.15,oz,0.06,0.75,0.06,'#c9a24a'],[ox,1.5,oz,0.9,0.04,0.04,'#c9a24a'],[ox-0.42,1.3,oz,0.02,0.4,0.02,'#c9a24a'],[ox+0.42,1.3,oz,0.02,0.4,0.02,'#c9a24a'],[ox-0.42,1.1,oz,0.3,0.04,0.3,'#c9a24a'],[ox+0.42,1.05,oz,0.3,0.04,0.3,'#c9a24a'],[ox+0.42,1.12,oz,0.14,0.1,0.14,'#d84a3a'])}
     {const [x,z]=pole(PA[3]),ox=x-1.4,oz=z+1.5;/* klatki z drobiem */for(let k=0;k<3;k++){const cx=ox+(k-1)*0.75,cy=k===1?0.95:0.3;LP([cx,cy,oz,0.65,0.6,0.6,'#a87a4a']);for(const q of [-0.22,0,0.22])LP([cx+q,cy,oz+0.31,0.03,0.58,0.02,'#5a3c24']);LP([cx,cy-0.12,oz,0.22,0.22,0.3,k===2?'#a8452f':'#f4f0e6'],[cx+0.1,cy+0.02,oz+0.1,0.06,0.08,0.06,'#d84a3a'])}}
    }
    for(let i=nP0;i<L.length;i++){L[i][0]+=pl.M[0];L[i][2]+=pl.M[1]}/* plac targowy przesunięty przed bramę zamku */
    // wystrój ulic według planu: latarnie na przemian po obu stronach, chorągwie przy głównych ulicach, wozy, kwiaty przy bramach
    {const HO=v.houses.filter(h=>h.core).map(h=>[h.x-v.x,h.z-v.z,h.core.pw/2,h.core.pd/2,Math.cos(h.rot),Math.sin(h.rot)]),
       inH=(x,z,m)=>HO.some(([hx,hz,hw,hd,c2,s2])=>{const dx=x-hx,dz=z-hz;return Math.abs(dx*c2-dz*s2)<hw+m&&Math.abs(dx*s2+dz*c2)<hd+m}),
       free=(x,z,m)=>!inH(x,z,m)&&!pl.inK(x,z,2)&&pl.rho(x,z)<0.975&&Math.hypot(x-pl.M[0],z-pl.M[1])>pl.PR+2;
     const cr=rngOf('cty+'+v.id),BC=[v.race==='elfy'?'#3f7a4a':v.race==='krasnoludy'?'#5a4a8a':v.race==='orkowie'?'#8a2a1a':'#7a1f1f','#e8c84a'];
     const banner=(x,z,ax)=>{const y=DGY?DGY(x,z):0;L.push([x,y+0.12,z,0.3,0.24,0.3,'#5d5a63'],[x,y+2.2,z,0.1,4.2,0.1,'#4a2f1d'],[x,y+4.35,z,0.18,0.18,0.18,'#c9a24a']);const o=ax?[0,0.2]:[0.2,0];L.push([x+o[0]*0.6,y+3.5,z+o[1]*0.6,ax?0.04:0.9,1.6,ax?0.9:0.04,BC[0]],[x+o[0]*0.6,y+3.5,z+o[1]*0.6,ax?0.05:0.2,1.6,ax?0.2:0.05,BC[1]],[x+o[0]*0.6,y+2.62,z+o[1]*0.6,ax?0.04:0.5,0.18,ax?0.5:0.04,BC[0]])};
     const cart=(x,z,ax)=>{const y=DGY?DGY(x,z):0,w=ax?0.9:1.6,d=ax?1.6:0.9;L.push([x,y+0.75,z,w,0.12,d,'#7a5532'],[x,y+0.95,z,w,0.3,d,'#8a6240'],[x,y+1.15,z,w*0.8,0.18,d*0.8,cr()<0.5?'#c8302a':'#e8c040'],[x,y+1.15,z,w*0.4,0.2,d*0.4,'#86c060']);for(const sg of [-1,1])L.push(ax?[x+sg*0.5,y+0.4,z,0.1,0.8,0.8,'#4a2f1d']:[x,y+0.4,z+sg*0.5,0.8,0.8,0.1,'#4a2f1d']);L.push(ax?[x,y+0.5,z+1.2,0.06,0.06,1,'#6b4528']:[x+1.2,y+0.5,z,1,0.06,0.06,'#6b4528'])};
     let nl=0;for(const s2 of pl.ST){if(s2.k>=4)continue;const step=s2.k===3?12:s2.k===2?14:17;let acc=5,side=1,cnt=0;for(let i=0;i<s2.p.length-1&&nl<300;i++){const [x0,z0]=s2.p[i],[x1,z1]=s2.p[i+1],tx=x1-x0,tz=z1-z0,tl=Math.hypot(tx,tz);if(tl<0.01)continue;let t=acc;
         while(t<tl&&nl<300){const px=x0+tx*t/tl,pz=z0+tz*t/tl,nx=-tz/tl*side,nz=tx/tl*side,o=s2.w/2+0.5,lx=px+nx*o,lz=pz+nz*o;if(free(lx,lz,0.35)){lamp(L,lx,0,lz);nl++;cnt++;if(s2.k===3&&cnt%3===0){const bx=lx+tx/tl*2.5,bz=lz+tz/tl*2.5;if(free(bx,bz,0.4))banner(bx,bz,Math.abs(tx)>Math.abs(tz)?0:1)}}side=-side;t+=step}acc=t-tl}}
     for(let k=0;k<Math.round(Hs/14);k++){const s2=pl.ST[Math.floor(cr()*pl.ST.length)];if(s2.k<2||s2.k>3)continue;const i=1+Math.floor(cr()*(s2.p.length-3)),[x0,z0]=s2.p[i],[x1,z1]=s2.p[i+1],tx=x1-x0,tz=z1-z0,tl=Math.hypot(tx,tz)||1,sd=cr()<0.5?1:-1,x=x0-tz/tl*sd*(s2.w/2-1.0),z=z0+tx/tl*sd*(s2.w/2-1.0);if(free(x,z,0.8)&&Math.min(Math.abs(x),Math.abs(z))>4)cart(x,z,Math.abs(tz)>Math.abs(tx)?1:0)}
     for(const [gx,gz,ax] of [[0,-1,0],[0,1,0],[-1,0,1],[1,0,1]]){const d=Hs-9;for(const sg of [-1,1]){const x=gx*d+(ax?0:sg*4.6),z=gz*d+(ax?sg*4.6:0);if(free(x,z,0.5))flowers(L,x,0,z,1.6,ax?0:1)}}
     // v111: szpalery drzew wzdłuż ulic i drzewa na wolnych skrawkach między domami
     if(v.city){const tr=rngOf('ctree'+v.id),TC=['#4a8a3a','#5a9a3e','#3f7a34'],near=(x,z,r)=>DTREE&&DTREE.some(q=>Math.abs(q[0]-x)<r&&Math.abs(q[1]-z)<r);let nt=0;
       for(const s2 of pl.ST){if(s2.k>=4||s2.k<1)continue;const step=s2.k===3?9:11;let acc=6.5,side=-1;for(let i=0;i<s2.p.length-1&&nt<260;i++){const [x0,z0]=s2.p[i],[x1,z1]=s2.p[i+1],tx=x1-x0,tz=z1-z0,tl=Math.hypot(tx,tz);if(tl<0.01)continue;let t=acc;
         while(t<tl&&nt<260){const px=x0+tx*t/tl,pz=z0+tz*t/tl,o=s2.w/2+1.7,x=px-tz/tl*side*o,z=pz+tx/tl*side*o;if(free(x,z,1.5)&&!pl.streetAt(x,z)&&!near(x,z,3.5)){smallTree(L,x,0,z,0.8+tr()*0.35,TC[nt%3]);nt++}side=-side;t+=step}acc=t-tl}}
       for(let k=0;k<Math.round(Hs*2.2)&&nt<380;k++){const a=tr()*Math.PI*2,rr=(0.25+tr()*0.7)*Hs,x=Math.cos(a)*rr,z=Math.sin(a)*rr;if(free(x,z,2.4)&&!pl.streetAt(x,z)&&!pl.streetAt(x+2,z)&&!pl.streetAt(x-2,z)&&!pl.streetAt(x,z+2)&&!pl.streetAt(x,z-2)&&!near(x,z,5)){smallTree(L,x,0,z,0.9+tr()*0.5,TC[k%3]);nt++}}}
     // przy murach: składy, kukły treningowe, stojaki z bronią, namioty straży, drzewka
     const wr=rngOf('wall'+v.id);for(const [wx0,wz0,len,th2,top,ang] of (v.wsegs||[])){const cx=wx0-v.x,cz=wz0-v.z,ux=Math.cos(ang),uz=-Math.sin(ang),nx=Math.sin(ang),nz=Math.cos(ang),ax=Math.abs(ux)>Math.abs(uz)?0:1;
       for(let a=-len/2+3;a<=len/2-3;a+=6.5){const x=cx+ux*a-nx*3.0,z=cz+uz*a-nz*3.0,t=wr();if(!free(x,z,0.8)||pl.streetAt(x,z))continue;
         if(t<0.18){crate(L,x,0,z);crate(L,x+(ax?0:0.75),0,z+(ax?0.75:0),0.6);crate(L,x,0.7,z,0.55)}
         else if(t<0.32){barrel(L,x,0,z);barrel(L,x+(ax?0:0.7),0,z+(ax?0.7:0))}
         else if(t<0.44){hay(L,x,0,z);hay(L,x,0.84,z)}
         else if(t<0.56){const y=DGY?DGY(x,z):0;L.push([x,y+0.2,z,0.12,0.4,0.12,WDD],[x,y+1.0,z,0.22,1.3,0.22,'#b8925a'],[x,y+1.9,z,0.34,0.34,0.34,'#c9a46a'],[x,y+1.35,z,ax?0.14:0.9,0.12,ax?0.9:0.14,'#b8925a'],[x,y+0.06,z,0.7,0.12,0.7,WDD])}
         else if(t<0.68){const y=DGY?DGY(x,z):0;L.push([x,y+0.9,z,ax?0.16:1.8,1.8,ax?1.8:0.16,WDD],[x,y+1.5,z,ax?0.3:1.8,0.08,ax?1.8:0.3,WDD]);for(let k=-1;k<=1;k++)L.push(ax?[x+0.12,y+1.1,z+k*0.5,0.06,1.6,0.06,'#c9cfd4']:[x+k*0.5,y+1.1,z+0.12,0.06,1.6,0.06,'#c9cfd4'])}
         else if(t<0.78){const y=DGY?DGY(x,z):0;for(let k=0;k<4;k++){const s2=2.6-k*0.6;L.push([x,y+0.3+k*0.5,z,s2,0.5,s2,k%2?'#a8452f':'#c8b89a'])}}
         else if(t<0.9){smallTree(L,x,0,z,0.85+wr()*0.3,rpick(wr,['#4a8a3a','#5a9a3e']))}}}}
    {const HO=v.houses.filter(h=>h.core).map(h=>[h.x-v.x,h.z-v.z,h.core.pw/2,h.core.pd/2,Math.cos(h.rot),Math.sin(h.rot)]),inH=(x,z,m)=>HO.some(([hx,hz,hw,hd,c2,s2])=>{const dx=x-hx,dz=z-hz;return Math.abs(dx*c2-dz*s2)<hw+m&&Math.abs(dx*s2+dz*c2)<hd+m}),free=(x,z,m)=>!inH(x,z,m)&&!pl.inK(x,z,2)&&pl.rho(x,z)<0.975&&Math.hypot(x-pl.M[0],z-pl.M[1])>pl.PR+2;
    settleDetail(L,v,Math.min(2600,Math.round(Hs*Hs*0.22)),Hs*0.96,(x,z)=>free(x,z,0.5)&&!pl.streetAt(x,z)&&!pl.streetAt(x+0.8,z)&&!pl.streetAt(x-0.8,z)&&!pl.streetAt(x,z+0.8)&&!pl.streetAt(x,z-0.8),'cdet');
    {const gr2=rngOf('sedge'+v.id);let ne=0;for(const s2 of pl.ST){if(s2.k>=4)continue;for(let i=0;i<s2.p.length-1&&ne<450;i++){const [x0,z0]=s2.p[i],[x1,z1]=s2.p[i+1],tx=x1-x0,tz=z1-z0,tl=Math.hypot(tx,tz);if(tl<0.01)continue;for(let t=gr2()*3;t<tl&&ne<450;t+=2+gr2()*4){const sd=gr2()<0.5?1:-1,o=s2.w/2+0.15+gr2()*0.4,x=x0+tx*t/tl-tz/tl*sd*o,z=z0+tz*t/tl+tx/tl*sd*o;if(!free(x,z,0.2)||pl.streetAt(x,z))continue;const y=DGY?DGY(x,z):0;for(let k=0;k<3;k++){const h=0.18+gr2()*0.25;L.push([x+(gr2()-.5)*0.4,y+h/2,z+(gr2()-.5)*0.4,0.06,h,0.06,k%2?'#5a9a3c':'#6aa846'])}ne++}}}}}
    // podwórka między domami: ogródki, studnie, kurniki, place z drzewem
    /* v154: wypełnienie pustych skrawków między domami: drzewa, krzewy, sągi drewna, beczki, grządki, stogi, wozy, ławki */
    if(v.city){const HO=v.houses.filter(h=>h.core).map(h=>[h.x-v.x,h.z-v.z,h.core.pw/2,h.core.pd/2,Math.cos(h.rot),Math.sin(h.rot)]),free=(x,z,m)=>!HO.some(([hx,hz,hw,hd,c2,s2])=>{const dx=x-hx,dz=z-hz;return Math.abs(dx*c2-dz*s2)<hw+m&&Math.abs(dx*s2+dz*c2)<hd+m})&&!pl.inK(x,z,2)&&Math.hypot(x-pl.M[0],z-pl.M[1])>pl.PR+2,fr=rngOf('cfill'+v.id),YD=(v.yards||[]).map(q=>[q[0]-v.x,q[1]-v.z]),nearY=(x,z)=>YD.some(q=>Math.abs(q[0]-x)<5.6&&Math.abs(q[1]-z)<5.6),stN=(x,z)=>pl.streetAt(x,z)||pl.streetAt(x+1.7,z)||pl.streetAt(x-1.7,z)||pl.streetAt(x,z+1.7)||pl.streetAt(x,z-1.7);let nf=0;
      const CND=[];for(let gz=-Hs;gz<=Hs;gz+=3.6)for(let gx=-Hs;gx<=Hs;gx+=3.6){const x=gx+(fr()-0.5)*1.4,z=gz+(fr()-0.5)*1.4;if(pl.rho(x,z)>0.9||!free(x,z,1.1)||stN(x,z)||nearY(x,z))continue;CND.push([x,z])}for(let i=CND.length-1;i>0;i--){const j=Math.floor(fr()*(i+1));const q=CND[i];CND[i]=CND[j];CND[j]=q}v._nc=CND.length;
      for(const [x,z] of CND){if(nf>=1300)break;
        const t=fr(),ax=fr()<0.5,y=DGY?DGY(x,z):0;nf++;
        if(t<0.38)smallTree(L,x,0,z,0.75+fr()*0.45,rpick(fr,['#4a8a3a','#5a9a3e','#3f7a34','#6a9a3a']));
        else if(t<0.48){for(let k=0;k<3;k++){const s2=0.6+fr()*0.5;L.push([x+(fr()-0.5)*1.4,y+s2/2,z+(fr()-0.5)*1.4,s2*1.2,s2,s2*1.1,rpick(fr,['#3f7a34','#4f8e36','#5a9a3c'])])}}
        else if(t<0.57){for(let k=0;k<3;k++)for(let m=0;m<3-k;m++)L.push(ax?[x+(m-(2-k)/2)*0.34,y+0.17+k*0.3,z,0.3,0.3,1.5,m%2?'#8a6240':'#9a7048']:[x,y+0.17+k*0.3,z+(m-(2-k)/2)*0.34,1.5,0.3,0.3,m%2?'#8a6240':'#9a7048']);L.push([x+(ax?0:1.2),y+0.25,z+(ax?1.2:0),0.5,0.5,0.5,'#7a5532'],[x+(ax?0:1.2),y+0.56,z+(ax?1.2:0),0.08,0.3,0.5,'#c9cfd4'])}
        else if(t<0.65){barrel(L,x,0,z);barrel(L,x+0.75,0,z+0.3);crate(L,x-0.4,0,z+0.85,0.65)}
        else if(t<0.74){for(let k=-1;k<=1;k++){const ox=ax?k*0.9:0,oz=ax?0:k*0.9;L.push([x+ox,y+0.1,z+oz,ax?0.6:2.4,0.2,ax?2.4:0.6,'#6b4a2b']);for(let m=-2;m<=2;m++)L.push([x+ox+(ax?0:m*0.45),y+0.32,z+oz+(ax?m*0.45:0),0.26,0.26,0.26,fr()<0.3?'#d8a43a':'#5f9a40'])}}
        else if(t<0.78){hay(L,x,0,z);hay(L,x+(ax?1.2:0),0,z+(ax?0:1.2));if(fr()<0.5)hay(L,x,0.84,z)}
        else if(t<0.87){L.push([x,y+0.75,z,ax?2.2:1.2,0.5,ax?1.2:2.2,'#9a7048'],[x,y+1.05,z,ax?2.2:1.2,0.12,ax?1.2:2.2,'#7a5532'],[x+(ax?1.9:0),y+0.55,z+(ax?0:1.9),ax?1.6:0.1,0.1,ax?0.1:1.6,'#6b4a2b']);for(const sd of [-1,1])L.push([x+(ax?-0.3:sd*0.66),y+0.45,z+(ax?sd*0.66:-0.3),ax?0.9:0.12,0.9,ax?0.12:0.9,'#5a3a20']);if(fr()<0.6)L.push([x,y+1.25,z,ax?1.4:0.8,0.3,ax?0.8:1.4,'#d8b24a'])}
        else{bench(L,x,0,z,ax?1:0);flowers(L,x+(ax?0:1.1),0,z+(ax?1.1:0),1.4,ax?1:0)}}v._nf=nf}
    for(const [yx,yz] of (v.yards||[])){const x=yx-v.x,z=yz-v.z,yr=rngOf('yard'+yx+'_'+yz),t=yr(),yo=DGY?DGY(x,z):0,LP=(...a)=>{for(const q of a){q[1]+=yo;L.push(q)}};
      for(let k=0;k<4;k++){const a=k*Math.PI/2;LP([x+Math.cos(a)*4.2,0.45,z+Math.sin(a)*4.2,Math.abs(Math.cos(a))>0.5?0.12:8.2,0.9,Math.abs(Math.cos(a))>0.5?8.2:0.12,'#7a5532'])}
      if(t<0.35){smallTree(L,x,0,z,1.3,'#4a8a3a');bench(L,x+2.2,0,z,0);flowers(L,x-2.6,0,z+2.4,2,1);flowers(L,x-2.6,0,z-2.4,2,1)}
      else if(t<0.6){LP([x,0.45,z,2.2,0.9,2.2,ST1],[x,0.92,z,1.6,0.06,1.6,'#3f6d9a'],[x-0.95,1.6,z,0.16,1.5,0.16,WDD],[x+0.95,1.6,z,0.16,1.5,0.16,WDD],[x,2.45,z,2.4,0.14,1.4,'#a8452c']);smallTree(L,x+2.8,0,z+2.8,0.9);bench(L,x-2.6,0,z,0)}
      else if(t<0.8){LP([x,0.6,z,2.4,1.2,1.6,'#8a6240'],[x,1.35,z,2.6,0.25,1.8,'#a8452c'],[x+1.4,0.25,z,0.5,0.5,0.6,'#6b4a2b']);for(let k=0;k<6;k++)LP([x-2+yr()*4,0.15,z+1.5+yr()*1.5,0.22,0.3,0.32,'#f4f0e6']);hay(L,x-2.4,0,z-2.2)}
      else{for(let row=-3;row<=3;row+=1.5)for(let col=-3;col<=3;col+=1.2)LP([x+col,0.2,z+row,0.5,0.4,0.5,yr()<0.5?'#5f9a40':'#d8a43a']);smallTree(L,x+3,0,z-3,0.8,'#5a9a3e')}}}
  // wejścia do budynków zawsze wolne: usuń dekoracje stojące w pasie przed drzwiami (poza stopniami)
  // nic nie stoi w obrysie zamku i areny (w tym schody przed nimi)
  for(const h of v.houses){if(!h.kcastle&&!h.arena&&!h.big)continue;const hx=h.x-v.x,hz=h.z-v.z,c=Math.cos(h.rot),sn=Math.sin(h.rot),hw=h.kcastle?23*h.ksc+0.6:h.big?h.core.pw/2+0.6:11,fr=h.kcastle?26.5*h.ksc:h.big?h.core.pd/2+2.5:14;
    for(let i=L.length-1;i>=0;i--){const b=L[i],dx=b[0]-hx,dz=b[2]-hz,lx=dx*c-dz*sn,lz=dx*sn+dz*c;if(Math.abs(lx)<hw+b[3]*0.5&&lz>-hw-b[5]*0.5&&lz<fr)L.splice(i,1)}}
  {const Z=doorZones(v);
    if(Z.length)for(let i=L.length-1;i>=0;i--){const b=L[i];if(b[7]==='st')continue;const bot=b[1]-b[4]/2;for(const [zx,zz,fx,fz,lat,fw,top] of Z){const rx=b[0]-zx,rz=b[2]-zz,f=rx*fx+rz*fz,l=Math.abs(rx*fz-rz*fx);if(f>-0.2&&f<fw&&l<lat+Math.max(b[3],b[5])*0.3&&bot<top){L.splice(i,1);break}}}}
  if(DTREE&&DTREE.length){const Z=doorZones(v);DTREE=DTREE.filter(([x,z])=>{for(const [zx,zz,fx,fz,lat,fw] of Z){const rx=x-zx,rz=z-zz,f=rx*fx+rz*fz,l=Math.abs(rx*fz-rz*fx);if(f>-0.5&&f<fw+1.5&&l<lat+1.6)return false}
    for(const h of v.houses){if(!h.kcastle&&!h.arena&&!h.big)continue;const dx=x-(h.x-v.x),dz=z-(h.z-v.z),c=Math.cos(h.rot),sn=Math.sin(h.rot),lx=dx*c-dz*sn,lz=dx*sn+dz*c,hw=(h.kcastle?23*h.ksc:h.big?h.core.pw/2:11)+1.5,fr=h.kcastle?26.5*h.ksc:h.big?h.core.pd/2+3:14;if(Math.abs(lx)<hw&&lz>-hw&&lz<fr)return false}return true})}
  const parts=DROT.filter(q=>q.L.length).map(q=>({g:kitB(q.L),ang:q.ang,x:q.x/BS,z:q.z/BS}));if(!L.length&&!parts.length)return null;return parts.length?geoRotMerge(L.length?kitBT(L):null,parts):kitBT(L)}
function windmill(){const S='#8e8994',SD='#77727c',P='#ece2c6',PD='#d8ccb0',T='#4a2f1d',W='#7a5532',R1='#a8452c',R2='#93391f',L=[];
  // kamienna podstawa (ośmiokąt z dwóch krzyżujących się brył), wieża z desek zwężająca się ku górze, galeria z balustradą, czapa z gontu
  L.push([0,0.8,0,4.8,1.6,3.6,S],[0,0.8,0,3.6,1.6,4.8,S],[0,1.66,0,5.0,0.14,3.8,SD],[0,1.66,0,3.8,0.14,5.0,SD]);
  for(let i=0;i<5;i++){const y=1.7+i*1.1,w=4.0-i*0.28,c=i%2?P:PD;L.push([0,y+0.55,0,w,1.1,w*0.74,c],[0,y+0.55,0,w*0.74,1.1,w,c]);L.push([0,y+1.08,0,w+0.06,0.06,w*0.74+0.06,T],[0,y+1.08,0,w*0.74+0.06,0.06,w+0.06,T])}
  for(const sg of [-1,1]){L.push([sg*1.55,4.2,0,0.08,5.0,0.12,T],[0,4.2,sg*1.55,0.12,5.0,0.08,T])}
  L.push([0,3.62,0,5.6,0.14,5.6,W]);for(let k=0;k<16;k++){const a=k/16*Math.PI*2,x=Math.cos(a)*2.7,z=Math.sin(a)*2.7;L.push([x,4.1,z,0.1,0.9,0.1,T])}for(const [x,z,w,d] of [[0,2.7,5.4,0.08],[0,-2.7,5.4,0.08],[2.7,0,0.08,5.4],[-2.7,0,0.08,5.4]])L.push([x,4.5,z,w,0.08,d,T]);
  L.push([0,0.9,2.42,1.1,1.8,0.06,T],[0,1.85,2.44,1.3,0.12,0.06,'#3a2414'],[0,2.9,1.45,0.55,0.75,0.06,'#2b2633'],[0,5.2,1.25,0.5,0.6,0.06,'#2b2633'],[1.4,4.3,0,0.06,0.6,0.5,'#2b2633'],[-1.25,6.0,0,0.06,0.5,0.45,'#2b2633']);
  for(let i=0;i<5;i++){const w=3.3-i*0.6;L.push([0,7.25+i*0.36,-0.15,w,0.36,w+0.6,i%2?R2:R1])}L.push([0,9.1,-0.15,0.5,0.2,1.6,R2]);
  L.push([0,7.8,1.7,0.5,0.5,1.4,T],[0,7.8,2.45,0.7,0.7,0.2,'#3a3a40']);
  // śmigło: 4 skrzydła z dźwigarem, kratownicą i płótnem (symetria obrotowa co 90°)
  const S2=[];const rot=(b,k)=>{let [x,y,z,w,h,d,c]=b;for(let q=0;q<k;q++){[x,y]=[-y,x];[w,h]=[h,w]}return[x,y,z,w,h,d,c]};
  for(let k=0;k<4;k++){const A=[[3.1,0,0,6.0,0.24,0.18,T],[3.9,0.28,0.05,4.8,0.08,0.08,W],[3.9,1.48,0.05,4.8,0.08,0.08,W],[6.25,0.88,0.05,0.1,1.3,0.08,W]];for(let q=0;q<9;q++)A.push([1.6+q*0.58,0.88,0.05,0.07,1.24,0.07,W]);A.push([3.9,0.88,0.1,4.6,1.12,0.03,'#efe8d6']);for(const b of A)S2.push(rot(b,k))}
  S2.push([0,0,0,0.7,0.7,0.3,'#3a3a40']);
  return [kitB(L),kitB(S2)]}

// ===== MIASTA PORTOWE: nabrzeże, statki przy molo, latarnia morska, dźwig, sieci; kapitan portu (prom, żaglówka, wędka) =====
function shipGeo(sail){const L=[],P=(...b)=>L.push(b),WD=['#6b4528','#7a5030','#5a3a22'],n=14;
  for(let i=0;i<n;i++){const z=-6+i*12/(n-1),t=z/6.2,w=4*Math.sqrt(Math.max(0.06,1-t*t)),rise=0.8*t*t;P(0,-0.6,z,w*0.45,0.4,0.95,WD[2]);for(let k=0;k<4;k++)for(const sg of [-1,1])P(sg*(w/2-0.12-(3-k)*0.12*(1-k/3)),-0.4+k*0.55+rise*k/3,z,0.22,0.58,0.92,WD[(i+k)%3]);P(0,1.0+rise*0.4,z,w-0.4,0.12,0.92,'#8a6240')}
  P(0,1.5,-4.6,3.4,1.1,2.6,WD[1]);P(0,2.1,-4.6,3.6,0.12,2.8,'#4a2f1d');P(0,1.4,4.9,2.4,0.8,1.6,WD[1]);for(const sg of [-1,1])P(sg*1.75,2.35,-4.6,0.1,0.4,2.6,'#4a2f1d');
  P(0,5.5,0.5,0.32,9,0.32,'#5a3a22');P(0,9.0,0.5,5.6,0.18,0.2,'#4a2f1d');P(0,4.2,0.5,5.4,0.16,0.18,'#4a2f1d');
  for(let k=0;k<6;k++)P(0,4.5+k*0.75,0.75,5.2,0.76,0.06,k%2?sail:'#efe6d0');P(0,10.4,0.5,0.06,1.2,0.06,'#4a2f1d');P(0.45,10.7,0.5,0.9,0.5,0.04,sail);
  P(0,1.2,7.0,0.18,0.18,2.4,'#4a2f1d');for(const sg of [-1,1])P(sg*1.6,1.5,2.5,0.5,0.5,0.5,'#3a3a40');return boxes(L)}
function portExtras(v,g){if(!v.pier||v._portG)return;const pg=new THREE.Group();g.add(pg);v._portG=pg;v._ships=[];const ps=[[0,-1],[0,1],[-1,0],[1,0]][v.port],ax=ps[0],az=ps[1],PL=(v.portD||v.Hs+24)+8,yd=WATER+1.2,L=[],P=(x,y,z,w,h,d,c)=>L.push([x,y,z,w,h,d,c]);
  const at=(d,lat)=>[v.x+ax*d+(az?lat:0),v.z+az*d+(ax?lat:0)],wz=(w,d)=>ax?[d,w]:[w,d];
  // platforma na końcu molo w kształcie T
  {const [x,z]=at(PL+1,0),[w,d]=wz(14,5);P(x,yd,z,w,0.3,d,'#7a5532');for(const s of [-6,-2,2,6]){const [px,pz]=at(PL+1,s);P(px,yd-1.6,pz,0.4,3.4,0.4,'#4a2f1d')}for(let k=-6;k<=6;k+=1.5){const [bx,bz]=at(PL+3.3,k);P(bx,yd+0.45,bz,0.3,0.6,0.3,'#3a2414')}}
  // latarnia morska na skale
  {const [x,z]=at(PL+9,0);for(let k=0;k<5;k++)P(x+(k%2?1.2:-1),WATER-1.5+k*0.4,z+(k%3-1)*1.1,4-k*0.4,2,4-k*0.5,['#6c6a67','#7d7b78','#5f5d5a'][k%3]);
    for(let k=0;k<10;k++)P(x,WATER+0.8+k*1.2,z,2.8-k*0.08,1.2,2.8-k*0.08,k%2?'#e8e2d6':'#a8302a');P(x,WATER+12.35,z,3.4,0.3,3.4,'#3a3a40');P(x,WATER+13.35,z,2,1.8,2,'#ffe7a0');for(const [a,b] of [[1,1],[1,-1],[-1,1],[-1,-1]])P(x+a*0.95,WATER+13.35,z+b*0.95,0.12,1.8,0.12,'#3a3a40');P(x,WATER+14.55,z,2.6,0.6,2.6,'#a8302a');P(x,WATER+15.15,z,1.2,0.6,1.2,'#a8302a');
    v._portLights=[[x,WATER+13.35,z,0,0,'big']];const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffe0a0,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.position.set(x,WATER+13.35,z);s.scale.set(8,8,1);pg.add(s);v._beacon=s;
    /* latarnia morska nocą: świecąca laterna i obracające się snopy światła */const lens=new THREE.Mesh(boxes([[x,WATER+13.35,z,1.8,1.55,1.8,'#fff3c4']]),new THREE.MeshBasicMaterial({vertexColors:true}));lens.visible=false;lens.userData.noVox=1;pg.add(lens);v._lens=lens;
    const bm=new THREE.MeshBasicMaterial({color:0xfff0b8,transparent:true,opacity:0.16,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),bg=new THREE.Group();bg.position.set(x,WATER+13.35,z);for(const sg of [-1,1]){for(const [len,w,o] of [[46,1.1,0.16],[30,2.4,0.08]]){const m2=new THREE.Mesh(new THREE.BoxGeometry(len,w*0.7,w),bm.clone());m2.material.opacity=o;m2.position.x=sg*(len/2+0.9);bg.add(m2)}}bg.visible=false;bg.userData.noVox=1;pg.add(bg);v._beam=bg}
  // dźwig portowy i skrzynie na nabrzeżu
  {const [x,z]=at(v.Hs+8,4.5);for(const s of [-0.8,0.8]){const [a,b]=wz(s,0);P(x+a,yd+2,z+b,0.25,4,0.25,'#5a3a22')}P(x,yd+4.1,z,0.3,0.3,0.3,'#4a2f1d');{const [a,b]=wz(0,2);P(x+a*0.5,yd+4.2,z+b*0.5+0,ax?2.6:0.2,0.2,ax?0.2:2.6,'#5a3a22')}{const [a,b]=wz(0,2.4);P(x+a,yd+3,z+b,0.04,2.2,0.04,'#c8b080');P(x+a,yd+1.6,z+b,0.8,0.8,0.8,'#9a7048')}}
  for(let k=0;k<6;k++){const [x,z]=at(v.Hs+5+k*1.1,-4.2+(k%2)*0.9);P(x,yd+0.4,z,0.8,0.8,0.8,k%2?'#9a7048':'#8a5a30')}
  {const [x,z]=at(v.Hs+14,-4.5);for(const s of [-1.5,1.5]){const [a,b]=wz(0,s);P(x+a,yd+1,z+b,0.15,2,0.15,'#4a2f1d')}{const [w,d]=wz(0.1,3.2);P(x,yd+1.9,z,w,0.1,d,'#4a2f1d')}{const [w,d]=wz(0.05,3);P(x,yd+1.2,z,w,1.3,d,'#c8b890')}}
  const lm=new THREE.Mesh(boxes(L),matB);lm.castShadow=true;lm.receiveShadow=true;pg.add(lm);
  // statki przy molo
  const SC=['#a8302a','#2f5f9f','#3a7a3a','#d9b23a'];[[PL-4,7.8],[PL-15,-7.8]].forEach(([d,lat],i)=>{if(d<v.Hs+3)return;const [x,z]=at(d,lat);const sm=new THREE.Mesh(shipGeo(SC[(i+Math.abs(Math.round(v.x)))%4]),matB);sm.position.set(x,WATER-0.15,z);sm.rotation.y=Math.atan2(ax,az);sm.castShadow=true;pg.add(sm);v._ships.push({m:sm,ph:i*1.7})})}
TICKS.push(()=>{const t=performance.now()/1000;for(const v of villages.values()){if(!v||!v._ships)continue;for(const s of v._ships){s.m.position.y=WATER-0.15+Math.sin(t*0.8+s.ph)*0.08;s.m.rotation.z=Math.sin(t*0.6+s.ph)*0.025}if(v._beacon){const n=hour>=17.5||hour<6.6;v._beacon.visible=n;v._beacon.material.opacity=0.7+0.3*Math.sin(t*2);if(v._lens)v._lens.visible=n;if(v._beam){v._beam.visible=n;if(n)v._beam.rotation.y=t*0.55}}}});
function villageLights(v,g){if(v._lightG){g.remove(v._lightG);v._lightG.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material.map)o.material.dispose()})}const lg=new THREE.Group();g.add(lg);v._lightG=lg;const pts=[],LB=[];
  for(const [x,y,z] of (v._lamps||[]))pts.push([v.x+x,v.h+0.015+y,v.z+z]);/* wystrój jest już w metrach (kitB ÷BS, siatka ×BS) */for(const q of (v._portLights||[]))pts.push(q);
  const POSTL=['orkowie','saurianie','elfy','drowy'].includes(v.race);
  for(const h of v.houses){if(!h.core||h.arena)continue;const [dx,dz]=doorOf(h),fx=Math.sin(h.rot),fz=Math.cos(h.rot),rx=fz,rz=-fx;
    if(POSTL){/* chaty, namioty i domy na drzewach nie mają płaskiej ściany — latarnia na słupku obok drzwi, zawsze stoi na ziemi */const px=dx+rx*1.7+fx*0.9,pz=dz+rz*1.7+fz*0.9,gy=h.top,ly=gy+2.05,WD=v.race==='drowy'?'#3a3048':'#5a3e26';
      pts.push([px,ly,pz,0.25,0.3]);LB.push([px,gy+1,pz,0.14,2,0.14,WD],[px,gy+0.08,pz,0.36,0.16,0.36,'#4a4a50'],[px,ly,pz,0.28,0.34,0.28,'#3a3a40'],[px,ly,pz,0.22,0.26,0.22,'#ffd27a'],[px,ly+0.21,pz,0.36,0.07,0.36,'#2a2a30']);continue}
    const lx=dx+rx*1.35-fx*0.5,lz=dz+rz*1.35-fz*0.5,ly=h.top+2.5;
    pts.push([lx+fx*0.35,ly,lz+fz*0.35,0.23,0.3]);LB.push([lx+fx*0.18,ly+0.35,lz+fz*0.18,Math.abs(fz)*0.08+Math.abs(fx)*0.4,0.08,Math.abs(fx)*0.08+Math.abs(fz)*0.4,'#3a3a40'],[lx+fx*0.35,ly,lz+fz*0.35,0.26,0.34,0.26,'#3a3a40'],[lx+fx*0.35,ly,lz+fz*0.35,0.2,0.26,0.2,'#ffd27a'],[lx+fx*0.35,ly+0.2,lz+fz*0.35,0.32,0.06,0.32,'#2a2a30'])}
  if(v.city&&v.gen!==1){try{const pl=cityPlan(v),[mx,mz]=pl.M,R=pl.PR-2.2;for(let k=0;k<8;k++){const a=k/8*Math.PI*2+0.39,x=v.x+mx+Math.cos(a)*R,z=v.z+mz+Math.sin(a)*R;let gy=colAt(x,z);if(gy==null)gy=v.h;
      LB.push([x,gy+0.15,z,0.6,0.3,0.6,'#3a3a40'],[x,gy+2.2,z,0.18,4.2,0.18,'#2a2a30'],[x,gy+4.3,z,1.5,0.1,0.1,'#2a2a30'],[x,gy+4.3,z,0.1,0.1,1.5,'#2a2a30']);for(const [ox,oz] of [[0.7,0],[-0.7,0],[0,0.7],[0,-0.7]]){LB.push([x+ox,gy+3.95,z+oz,0.34,0.44,0.34,'#3a3a40'],[x+ox,gy+4.22,z+oz,0.42,0.08,0.42,'#2a2a30']);pts.push([x+ox,gy+3.95,z+oz,0.28,0.38])}pts[pts.length-1][6]=1}}catch(e){}}
  if(LB.length){const lm=new THREE.Mesh(boxes(LB),decoMat);lm.castShadow=true;lg.add(lm)}
  v._lw=pts;v._glow=[];for(const p of pts){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffc877,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0.95}));s.position.set(p[0],p[1],p[2]);s.scale.set(2.6,2.6,1);s.visible=false;lg.add(s);v._glow.push(s)}
  // świecące szybki latarni w nocy (materiał bez cieniowania)
  if(pts.length){const gm=new THREE.Mesh(boxes(pts.map(p=>[p[0],p[1],p[2],p[3]||0.33,p[4]||0.45,p[3]||0.33,'#ffe2a0'])),GLOWMAT);gm.visible=false;gm.userData.noVox=1;lg.add(gm);v._glow.push(gm)}}
function streetLights(){const night=hour>=17.5||hour<6.6,p=player.p,cand=[];
  if(night&&!SPC&&W.huts)for(const h of W.huts){const d=Math.hypot(h.x-p.x,h.z-p.z);if(d<120){const fx=h.x+Math.sin(h.ry)*1.95,fz=h.z+Math.cos(h.ry)*1.95;cand.push([d,[fx,h.y+1.3,fz],11,1.5])}}
  if(SPC&&SPC.kind!=='arena'){const day=Math.max(0,Math.min(1,(Math.min(hour-5.5,19.5-hour))/1.5));for(const t of (SPC.torches||[]))cand.push([Math.hypot(t[0]-p.x,t[2]-p.z),[t[0],t[1]+0.4,t[2]],SPC.kind==='interior'?7:9,SPC.kind==='interior'?0.5:1.0]);
    for(const l of (SPC.lights||[]))cand.push([Math.hypot(l[0]-p.x,l[2]-p.z),l,l[3],l[4],l[5]]);
    if(SPC.winW){const big=SPC.func==='zamek';for(const q of SPC.winW)cand.push([Math.hypot(q[0]-p.x,q[2]-p.z)+2,q,big?9:6.5,(big?0.16:0.2)+(big?0.5:0.55)*day,day>0.2?[0.98,0.95,0.86]:[0.4,0.5,0.78]])}
    if(SPC.winCM){const k=0.25+0.75*day;SPC.winCM.material.color.setRGB(k,k,k*1.05)}if(SPC.beam){SPC.beam.visible=day>0.15;SPC.beam.material.opacity=0.03+0.05*day}
    if(SPC.winG){const on=day>0.2;if(SPC._wd!==on){SPC._wd=on;SPC.winG.material.color.set(on?(SPC.func==='zamek'?'#c4d8ec':'#e8f4ff'):'#2a3450');if(SPC.shaft)SPC.shaft.visible=on}if(SPC.shaft)SPC.shaft.material.opacity=0.06+0.06*day}}
  if(SPC&&SPC.kind==='arena'){/* ogień świeci mocno dopiero o zmierzchu — w dzień nie prześwietla piasku i murów */const dk=1-Math.max(0,Math.min(1,(Math.min(hour-5.5,19.5-hour))/1.5));for(const t of SPC.torches)cand.push([Math.hypot(t[0]-p.x,t[2]-p.z),[t[0],t[1]+1,t[2]],9+5*dk,0.22+0.9*dk]);if(SPC.braz)for(const t of SPC.braz)cand.push([Math.hypot(t[0]-p.x,t[2]-p.z)*0.5,t,10+10*dk,0.25+1.1*dk])}
  for(const v of villages.values()){if(!v||!v.g||!v._glow)continue;const on=night&&!SPC;if(v._glowOn!==on||v._glowA!==v._glow||v._glowL!==v._glow.length){/* v148: osada dobudowana w nocy — nowe latarnie zostawały zgaszone */v._glowOn=on;v._glowA=v._glow;v._glowL=v._glow.length;for(const s of v._glow)s.visible=on}if(!on)continue;if(Math.abs(v.x-p.x)>200||Math.abs(v.z-p.z)>200)continue;for(const q of v._lw){const d=Math.hypot(q[0]-p.x,q[2]-p.z);if(d<(q[5]?320:220))cand.push(q[5]?[Math.max(0,d-80),q,48,4.5]:q[6]?[Math.max(0,d-40),q,24,3.2]:[d,q,15,1.7])}}
  cand.sort((a,b)=>a[0]-b[0]);
  // dalsze latarnie łączymy w grupy (jedno światło na kwartał), żeby świeciło całe miasto, nie tylko 48 najbliższych lamp
  if(cand.length>28){const near=cand.slice(0,16),cell=new Map();for(let i=16;i<cand.length;i++){const c=cand[i],q=c[1];const k=Math.floor(q[0]/20)+','+Math.floor(q[2]/20);let e=cell.get(k);if(!e){e={x:0,y:0,z:0,n:0,d:c[0],r:c[2],I:c[3]};cell.set(k,e)}e.x+=q[0];e.y+=q[1];e.z+=q[2];e.n++;e.r=Math.max(e.r,c[2]);e.I=Math.max(e.I,c[3])}
    const far=[...cell.values()].sort((a,b)=>a.d-b.d).slice(0,12).map(e=>[e.d,[e.x/e.n,e.y/e.n,e.z/e.n],e.r+6+Math.min(10,e.n*1.5),Math.min(3.2,e.I*(0.8+Math.sqrt(e.n)*0.35))]);cand.length=0;cand.push(...near,...far)}const fl=1+Math.sin(performance.now()*0.011)*0.04;
  /* v121: 28 świateł ulicznych zamiast 48 i pętla w shaderze tylko po użytych */SEAS_U.uLampN.value=12+Math.min(28,cand.length);
  for(let k=0;k<28;k++){const U=SEAS_U.uLamp.value[12+k],c=cand[k];if(c){U.set(c[1][0],c[1][1]-0.6,c[1][2],c[2]||14);SEAS_U.uLampI.value[12+k]=(c[3]||1.5)*fl;if(c[4])SEAS_U.uLampC.value[12+k].set(c[4][0],c[4][1],c[4][2]);else SEAS_U.uLampC.value[12+k].set(1,.76,.42)}else{U.w=0;SEAS_U.uLampI.value[12+k]=0}}}
function villageTrees(v,g){if(v._treeG){g.remove(v._treeG);try{v._treeG.traverse(o=>{if(o.isInstancedMesh&&o.dispose)o.dispose()})}catch(_){}v._treeG=null}const T=v._trees;if(!T||!T.length)return;const tg=new THREE.Group();g.add(tg);v._treeG=tg;g=tg;v.props=(v.props||[]).filter(p=>!p.tree);const KS={niziolki:['oak','maple','oak','birch'],drowy:['pine','pine','oak'],saurianie:['palm','acacia','palm','oak'],ludzie:['oak','maple','birch','oak'],elfy:['birch','sakura','maple','birch'],krasnoludy:['pine','pine','oak','birch'],orkowie:['oak','acacia','pine','oak']}[v.race]||['oak'];
  const by={},m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),pv=new THREE.Vector3(),sv=new THREE.Vector3();v.props=(v.props||[]).filter(q=>!q.tree);v._pg=null;/* v118: bez dublowania drzew przy każdej przebudowie */
  T.forEach(([x,z,s],i)=>{const k=KS[(Math.abs(Math.round(x*7+z*13))+i)%KS.length];if(!OBJGEO[k])return;const wx=v.x+x*BS,wz=v.z+z*BS;let gy=colAt(wx,wz);if(gy==null){v._treeDirty=1;return}/* v127: żadnych drzew w wodzie ani na brzegu tuż przy wodzie */if(gy<WATER+0.25||wetAt(wx,wz,gy)||wlAt(wx,wz)>gy-0.2)return;{let wet=0;for(const [ax,az] of [[1.2,0],[-1.2,0],[0,1.2],[0,-1.2]]){const hh=colAt(wx+ax,wz+az);if(hh!=null&&(hh<WATER+0.1||wetAt(wx+ax,wz+az,hh)))wet++}if(wet>=2)return}const sc=(0.72+0.22*s)*(SCL[k]||TS);(by[k]=by[k]||[]).push([wx,gy,wz,sc,((i*2.4)%6.28)]);v.props.push({x:wx,z:wz,r:0.5,tree:1})});
  for(const k in by){const L=by[k],im=new THREE.InstancedMesh(OBJGEO[k],imMat(k),L.length);L.forEach(([x,y,z,sc,ry],i)=>{e.set(0,ry,0);q.setFromEuler(e);m4.compose(pv.set(x,y,z),q,sv.set(sc,sc,sc));im.setMatrixAt(i,m4)});im.instanceMatrix.needsUpdate=true;im.castShadow=true;im.receiveShadow=true;im.userData.keep=1;im.frustumCulled=false;g.add(im)}}
function buildVillage(v){
  const R=RACES[v.race],g=new THREE.Group();v.g=g;v.wins=[];v.bgen=(v.bgen||0)+1;
  if(v.city){const wm=new THREE.Mesh(bigTagSel(raceWall(cityWallGeo(v),v.race),7),matB);wm.position.set(v.x,v.h,v.z);wm.scale.setScalar(BS);wm.castShadow=true;wm.receiveShadow=true;g.add(wm);v._voxWall=wm}
  if(v.city)try{const bg=kingBanners(v);if(bg){const bm=new THREE.Mesh(bg,matB);bm.position.set(v.x,v.h,v.z);bm.castShadow=true;g.add(bm)}}catch(e){console.warn('chorągwie',e)}
  for(const h of v.houses)BQ.push([v,h,v.bgen]);/* znacznik generacji: wpisy z poprzedniego budowania (osada rozebrana i postawiona ponownie) są pomijane — inaczej każdy dom stał w scenie podwójnie */
  {const dg=decorGeo(v);if(dg){const dm=new THREE.Mesh(dg,matB);dm.position.set(v.x,v.h+0.015,v.z);dm.scale.setScalar(BS);dm.castShadow=true;dm.receiveShadow=true;g.add(dm);v._decoM=dm}v._dgT=performance.now();villageTrees(v,g);try{portExtras(v,g)}catch(e){console.warn('port',e)}villageLights(v,g);voxQueue(g,v.id)}
  v.millS=[];for(const q of (v.farm?v.farm.mills:[])){const [mg,sg]=windmill();const mm=new THREE.Mesh(mg,matB);mm.position.set(q.x,q.h,q.z);mm.scale.setScalar(BS);mm.rotation.y=Math.round(Math.atan2(v.x-q.x,v.z-q.z)/(Math.PI/2))*(Math.PI/2);mm.castShadow=true;g.add(mm);const s=new THREE.Mesh(sg,matB);s.position.set(0,7.8/BS,2.62/BS);s.castShadow=true;mm.add(s);v.millS.push(s)}
  if(false)for(const h of v.houses){const M=houseModel(h.type,h.v,v.race);if(!M)continue;const c=h.core;
    const hg=new THREE.Group();hg.position.set(h.x,h.top,h.z);hg.rotation.y=h.rot;
    const inner=new THREE.Group();inner.scale.setScalar(BS);const mesh=new THREE.Mesh(M.geo,matB);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.keep=1;inner.add(mesh);
    for(const wg of M.wins){const w=new THREE.Mesh(wg,winOff);w.userData.k=Math.random();w.userData.keep=1;inner.add(w);lighting.wb=-9;winMeshes.push(w);v.wins.push(w)}
    hg.add(inner);
    const ph=h.top-h.bot+2.4,pad=new THREE.Mesh(boxes([[0,-ph/2+0.03,0,c.pw,ph,c.pd,'#6f6a73']]),matB);pad.receiveShadow=true;pad.castShadow=true;hg.add(pad);
    g.add(hg)}
  const ph=v.h;
  if(!v.city&&!v.small){const plaza=v.race==='orkowie'?boxes([[0,0.2,0,1.8,0.4,1.8,'#5a4a3a'],[0,0.6,0,1.0,0.5,1.0,'#ff8a2e'],[0,1.0,0,0.55,0.5,0.55,'#ffd34d'],[1.6,0.3,0,1.6,0.5,0.5,'#6b4528'],[-1.6,0.3,0.4,0.5,0.5,1.6,'#6b4528']]):
    wellGeo(R)||boxes([[0,0.55,0,2.4,1.1,2.4,'#8e8994'],[0,1.05,0,1.7,0.12,1.7,'#3f6d9a'],[1.05,1.9,0,0.2,1.9,0.2,R.beam],[-1.05,1.9,0,0.2,1.9,0.2,R.beam],[0,2.95,0,3.0,0.3,1.6,R.roof],[0,3.2,0,2.2,0.25,1.0,R.roof],[0,2.2,0,2.3,0.12,0.12,'#4a2f1d']]);
  const pm=new THREE.Mesh(plaza,matB);pm.position.set(v.x,ph,v.z);if(plaza.userData.kit)pm.scale.setScalar(BS);pm.castShadow=true;g.add(pm)}
  v.props=[{x:v.x,z:v.z,r:v.city?2.3:1.4}];
  for(const n of v.npcs){n.m=makeNpc(n);n.m.userData.noVox=1;n.m.position.set(n.x,ph,n.z);n.m.rotation.y=n.ry;n.m.add(nameTag(n.name+' · '+n.roleN,n.role==='starszy'?'#ffd34d':n.role==='kupiec'?'#7dd87d':n.role==='kowal'?'#ff9d6b':'#9fb6c8'));g.add(n.m);
    if(n.role==='kupiec'){const s=new THREE.Mesh(boxes(stallBoxes(n)),matB);s.userData.stall=1;n.stall=s;g.add(s)}
    if(n.role==='kowal'){const a=new THREE.Mesh(boxes([[0,0.35,0,0.5,0.7,0.5,'#5a3d24'],[0,0.8,0,1.0,0.25,0.45,'#4a4a52'],[0.6,0.8,0,0.3,0.12,0.25,'#4a4a52']]),matB);n.anvil=a;g.add(a)}}
  g.position.set(0.0071,0,0.0093);/* ściany osady nie leżą w płaszczyznach ścian klifów terenu (siatka świata) */
  scene.add(g);
}
const BQ=[];
function buildTick(){let n=0;while(BQ.length&&n<1){const [v,h,gen]=BQ.shift();if(!v.g||(gen!=null&&gen!==v.bgen))continue;if(h.kcastle){n++;const hg=new THREE.Group();hg.position.set(h.x,h.top-1.0*h.ksc,h.z);hg.rotation.y=h.rot;hg.scale.setScalar(h.ksc);const km=new THREE.Mesh(kcastleGeo(v.race,v.sty),matB);km.castShadow=true;km.receiveShadow=true;km.userData.keep=1;hg.add(km);v.g.add(hg);voxQueue(hg,v.id);continue}if(h.big){n++;const hg=lmBuild(h,v);v.g.add(hg);voxQueue(hg,v.id);continue}if(h.arena){n++;const hg=new THREE.Group();hg.position.set(h.x,h.top,h.z);hg.rotation.y=h.rot;const am=new THREE.Mesh(arenaExtGeo(v.race,v.sty),matB);am.castShadow=true;am.receiveShadow=true;am.userData.keep=1;hg.add(am);v.g.add(hg);voxQueue(hg,v.id);continue}const M=houseModel(h.type,h.v,v.race,h.sty!==undefined?h.sty:v.sty);n++;if(!M)continue;const c=h.core;
  const hg=new THREE.Group();hg.position.set(h.x,h.top+0.004,h.z);hg.rotation.y=h.rot;
  const inner=new THREE.Group();inner.scale.setScalar(BS);const mesh=new THREE.Mesh(M.geo,matB);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.keep=1;inner.add(mesh);
  for(const wg of M.wins){const w=new THREE.Mesh(wg,winOff);w.userData.k=Math.random();w.userData.keep=1;inner.add(w);lighting.wb=-9;winMeshes.push(w);v.wins.push(w)}
  hg.add(inner);const ph=h.top-h.bot+2.4,pad=new THREE.Mesh(boxes([[0,-ph/2-0.01,0,c.pw-0.06,ph,c.pd-0.06,'#6f6a73']]),matB);pad.receiveShadow=true;hg.add(pad);v.g.add(hg);voxQueue(inner,v.id)}}
function unbuildVillage(v){voxRemove(v.id);v._voxQ=0;v.life=null;v._portG=null;v._ships=null;v._beacon=null;scene.remove(v.g);v.g.traverse(o=>{if(o.geometry&&!o.userData.keep)o.geometry.dispose();if(o.isSprite&&o.material){freeTagTex(o.material);o.material.dispose()}});for(const w of v.wins){const i=winMeshes.indexOf(w);if(i>=0)winMeshes.splice(i,1)}v.wins=[];v.g=null;for(const n of v.npcs){/* v148: uproszczony model z daleka był przypięty do starej postaci — po ponownym zbudowaniu osady NPC znikał z daleka */if(n._imp){try{n._imp.traverse(o=>{if(o.geometry)o.geometry.dispose()})}catch(_){}}n.m=null;n._imp=null;n._impOn=0;n._G=null;n.stall=null;n.anvil=null;n.pet=null}/* v148: listy ozdób odbudowują się przy budowie; stary stan (_glowOn, _hdetN) blokował latarnie i LOD detali domów po powrocie do osady */v._hdet=null;v._hdetN=-1;v._glow=null;v._glowOn=undefined;v._glowA=null;v.millS=null;v.kids=null;/* v144: zwolnij odwołania do siatek rozebranej osady (inaczej geometrie ozdób zostawały w pamięci) */for(const k in v){if(k==='_mapDeco'||k==='_mapWall')continue;const o=v[k];if(o&&typeof o==='object'&&(o.isObject3D||o.isBufferGeometry))v[k]=null}}
function genNpcs(v){
  const R=RACES[v.race],r=rngOf('npc'+v.id),list=[];
  const roles=['starszy','kupiec','kowal','mieszk','mieszk'];if(r()<0.6)roles.push('mieszk');if(r()<0.35)roles.push('wedr');
  const pool={m:R.m.slice(),f:R.f.slice()};
  roles.forEach((role,i)=>{
    let fem=r()<0.45;if(!pool[fem?'f':'m'].length)fem=!fem;const pl=pool[fem?'f':'m'],name=pl.splice(Math.floor(r()*pl.length),1)[0];let x,z;
    if(role==='starszy'){x=v.x+2.4;z=v.z+0.6}
    else if(role==='wedr'){const a=r()*6.28;x=v.x+Math.cos(a)*6;z=v.z+Math.sin(a)*6}
    else{const hi=(i-1)%v.houses.length,h=v.houses[hi],c=h.core,lat=(c.ox+3.6+(Math.floor((i-1)/v.houses.length)?2.4:0))*(i%2?1:-1),f=c.pd/2+2.6;x=h.x+Math.sin(h.rot)*f+Math.cos(h.rot)*lat;z=h.z+Math.cos(h.rot)*f-Math.sin(h.rot)*lat}
    list.push({id:v.id+':'+role+i,vid:v.id,role,fem,name,roleN:ROLE[role][fem?1:0],x,z,ry:r()*6.28,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth),race:v.race});
  });
  assignQG(list);return list;
}
function assignQG(list){for(const n of list){n.qg=n.role!=='kupiec'&&n.role!=='kowal'&&rngOf('qg'+n.id)()<0.2}if(!list.some(n=>n.qg)){const s=list.find(n=>n.role==='starszy')||list[0];if(s)s.qg=true}}
// cechy ras na modelu postaci: jaszczuroludzie (pysk, grzebień, ogon), niziołki (bose stopy)
const race0bare=n=>n.race==='niziolki';
function raceDeco(g,race){const R=RACES[race];if(!R)return;const u=g.userData;const A=(p,l)=>{if(p&&l.length){const m=new THREE.Mesh(boxes(l),decoMat);m.castShadow=true;p.add(m)}};
  if(R.lizard){const sk=u.skinC||'#4a8a3a';A(u.head,[[0,0.28,0.34,0.36,0.2,0.2,darker(sk,1.05)],[0,0.21,0.42,0.3,0.05,0.1,'#d8e8b0'],[0.11,0.34,0.44,0.04,0.03,0.02,'#1a2a1a'],[-0.11,0.34,0.44,0.04,0.03,0.02,'#1a2a1a'],[0,0.68,-0.04,0.07,0.16,0.46,'#c84a3a'],[0,0.64,0.16,0.05,0.1,0.1,'#c84a3a'],[0.14,0.6,-0.2,0.05,0.12,0.05,'#c84a3a'],[-0.14,0.6,-0.2,0.05,0.12,0.05,'#c84a3a']]);
    A(u.torso,[[0,0.1,-0.28,0.24,0.22,0.3,darker(sk,0.95)],[0,0.0,-0.52,0.18,0.16,0.3,darker(sk,0.85)],[0,-0.08,-0.74,0.11,0.11,0.26,darker(sk,0.95)],[0,0.4,0.188,0.32,0.3,0.02,darker(sk,1.3)]])}}
// dziecko rasy osady (kolory i cechy rasy, mniejsza skala)
function kidChar(v,r,i){const R=RACES[v.race]||RACES.ludzie,o=makeNpc({id:v.id+':kid'+i,vid:v.id,race:v.race,role:'dziecko',fem:r()<0.5,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth)});const g=o.userData.g;g.userData.noVox=1;o.scale.setScalar(0.62);v.g.add(o);return{m:o,g}}
function makeNpc(n){
  const R=RACES[n.race],r=rngOf('look'+n.id);
  const look={fem:n.fem&&n.role!=='straz',skin:n.skin,hairC:n.hair,hair:n.fem?rpick(r,['dlugie','warkocze','kucyk']):rpick(r,['krotkie','krotkie','dlugie','lysy']),beard:n.fem?'brak':R.beard?'dluga':R.tusks?rpick(r,['brak','zarost','brak']):rpick(r,['brak','zarost','krotka','wasy','dluga']),eyes:Math.floor(r()*5),tunic:n.cloth,pants:darker(n.cloth,0.55),boots:'#4a3020',cape:n.role==='starszy'||n.role==='krol'||n.role==='dworzanin'||n.role==='doradca'?1:0,capeC:n.role==='krol'?'#8a1a1a':n.role==='dworzanin'?'#3a3f7a':n.role==='doradca'?'#2a2a30':'#6a2a3a',build:R.ws>1.1?1:0};
  const hr=r();const ex={ears:R.ears,tusks:R.tusks,hat:n.role==='krol'||n.roleN==='Królowa'||n.roleN==='Królewicz'?'korona':n.role==='blazen'?'kaptur':n.role==='doradca'?'kaptur':n.role==='kupiec'?'kupiec':n.role==='straz'?'helm':n.role==='wedr'?'kaptur':n.roleN==='Burmistrz'?'korona':n.role==='mieszk'?(hr<0.3?'slomkowy':hr<0.5&&n.fem?'chusta':undefined):undefined,apron:n.role==='kowal'||(n.role==='mieszk'&&hr>0.8),pack:n.role==='wedr',armor:n.role==='straz'&&!villages.get(n.vid)?'#8a8f94':undefined,gloves:n.role==='kowal'?'#5a3a22':n.role==='straz'?'#6a6f74':undefined,robe:(n.role==='starszy'&&!n.fem)||n.role==='krol'||n.role==='doradca'};if(n.role==='krol'||n.role==='dworzanin'){look.tunic=n.role==='krol'?'#7a1f1f':rpick(r,['#3a3f7a','#5a2a5a','#2f5f4f','#7a5a2a']);look.pants=darker(look.tunic,0.5)}if(n.role==='blazen'){look.tunic='#c8302a';look.pants='#e8c040'}
  if(R.nohelm&&ex.hat==='helm')ex.hat=undefined;if(R.lizard){look.hair='lysy';look.beard='brak';ex.hat=undefined}if(n.race==='niziolki'||n.role==='dziecko')look.beard='brak';if(n.role==='dziecko')look.hair=n.fem?rpick(r,['warkocze','kucyk','dlugie']):rpick(r,['krotkie','krotkie','dlugie']);if(race0bare(n))look.boots=n.skin;
  const g=makeChar(look,ex);const o=new THREE.Group();o.add(g);g.scale.set(R.ws,R.hs,R.ws);const u=g.userData;u.skinC=n.skin;try{raceDeco(g,n.race)}catch(_){}
  if(n.role==='straz'){const vv=villages.get(n.vid);if(vv)soldierGear(g,vHerb(vv),n.race,!!vv.city)}
  if(n.role==='straz'){const sp=new THREE.Mesh(boxes([[0,-0.3,0.2,0.05,0.05,2.0,'#6b4a2b'],[0,-0.3,1.25,0.1,0.06,0.25,'#c9cfd4']]),decoMat);sp.rotation.x=-Math.PI/2;u.re.add(sp)}
  o.userData={head:u.head,la:u.la,ra:u.ra,re:u.re,ph:Math.random()*6,g};return o;
}
let nearNpc=null;
// spacery NPC: deterministyczna pętla punktów (u wszystkich graczy w tym samym miejscu, liczona z czasu świata)
function npcPath(n,v){
  if(n.path!==undefined)return n.path;n.path=null;if(v.small)return null;
  const walk=n.role==='mieszk'||n.role==='wedr'||(n.role==='straz'&&!(v.city&&!n.id.endsWith('1')&&!n.id.endsWith('3')));if(!walk)return null;
  const r=rngOf('walk'+n.id),P=[];
  if(n.pp){for(const q of n.pp)P.push([q[0]-v.x,q[1]-v.z])}
  else if(n.plot){const p=n.plot,e=1.3;for(const [a,b] of [[-1,-1],[1,-1],[1,1],[-1,1]])P.push([p.x-v.x+a*(p.hw+e),p.z-v.z+b*(p.hd+e)]);if(r()<0.5)P.reverse()}
  else if(v.city){/* spacer wzdłuż ulic planu: odcinek kilku zakrętów tam i z powrotem, po swojej stronie ulicy */const pl=cityPlan(v);let ok=false;
    for(let tr=0;tr<14&&!ok;tr++){const s=pl.ST[Math.floor(r()*pl.ST.length)];if(s.k>=4||s.p.length<4)continue;const m=Math.min(s.p.length-1,3+Math.floor(r()*5)),i0=Math.floor(r()*(s.p.length-m)),lane=(r()<0.5?-1:1)*Math.max(0.6,s.w/2-0.9),Q=[];
      for(let i=i0;i<=i0+m;i++){const a=s.p[Math.max(0,i-1)],b=s.p[Math.min(s.p.length-1,i+1)],tx=b[0]-a[0],tz=b[1]-a[1],tl=Math.hypot(tx,tz)||1,x=s.p[i][0]-tz/tl*lane,z=s.p[i][1]+tx/tl*lane;if(pl.inK(x,z,1)||pl.rho(x,z)>0.97){Q.length=0;break}Q.push([x,z])}
      if(Q.length>=3){ok=true;for(const q of Q)P.push(q);for(let i=Q.length-2;i>0;i--)P.push([Q[i][0]+(lane>0?-0.01:0.01),Q[i][1]])}}
    if(!ok){for(let i=0;i<6;i++){const a=i/6*6.28;P.push([pl.M[0]+Math.cos(a)*14,pl.M[1]+Math.sin(a)*14])}}
  } else {const k=4+Math.floor(r()*3),a0=r()*6.28;for(let i=0;i<k;i++){const a=a0+i/k*6.28+(r()-0.5)*0.6,rr=6.5+r()*6;P.push([Math.cos(a)*rr,Math.sin(a)*rr])}}
  const pts=P.map(p=>[v.x+p[0],v.z+p[1]]),seg=[];let T=0;
  for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],l=Math.hypot(b[0]-a[0],b[1]-a[1]),pause=r()<0.6?2+r()*5:0;seg.push({a,b,l,t0:T,tw:l/1.25,pause});T+=l/1.25+pause}
  n.path={seg,T,off:r()*T};return n.path;
}
function npcWalkPos(n,t){const P=n.path,tt=((t+P.off)%P.T+P.T)%P.T;for(const s of P.seg){if(tt<s.t0+s.tw+s.pause){const k=Math.min(1,(tt-s.t0)/s.tw);return[s.a[0]+(s.b[0]-s.a[0])*k,s.a[1]+(s.b[1]-s.a[1])*k,Math.atan2(s.b[0]-s.a[0],s.b[1]-s.a[1]),k<1]}}const s=P.seg[0];return[s.a[0],s.a[1],0,false]}
// v119: uproszczony model dalekiego mieszkańca — wszystkie części postaci scalone w 1–3 siatki (zamiast ~25), bez animacji
function npcImpostor(n){const root=n.m,G=root.userData.g||n._G||(root.userData.head?root.children.find(c=>c.isGroup||c.type==='Group')||root:null);if(!G)return null;root.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(root.matrixWorld).invert(),by=new Map();
  G.traverse(o=>{if(!o.isMesh||!o.visible||!o.geometry||!o.geometry.attributes.position)return;let q=o,vis=true;while(q&&q!==root){if(!q.visible){vis=false;break}q=q.parent}if(!vis)return;const m=o.material;if(Array.isArray(m)||(m&&m.transparent))return;let a=by.get(m);if(!a){a=[];by.set(m,a)}a.push(o)});
  const out=new THREE.Group(),M=new THREE.Matrix4();
  for(const [mat,L] of by){let nv=0;const geos=L.map(o=>{const g=o.geometry.index?o.geometry.toNonIndexed():o.geometry;nv+=g.attributes.position.count;return [o,g]});
    const pos=new Float32Array(nv*3),nor=new Float32Array(nv*3),col=new Float32Array(nv*3).fill(1),uv=new Float32Array(nv*2);let off=0,hasUV=false,hasC=false;
    for(const [o,g] of geos){M.multiplyMatrices(inv,o.matrixWorld);const P=g.attributes.position,N=g.attributes.normal,C=g.attributes.color,U=g.attributes.uv;
      const e=M.elements,PA=P.array,NA=N&&N.array;for(let i=0;i<P.count;i++){const x=PA[i*3],y=PA[i*3+1],z=PA[i*3+2],j=(off+i)*3;pos[j]=e[0]*x+e[4]*y+e[8]*z+e[12];pos[j+1]=e[1]*x+e[5]*y+e[9]*z+e[13];pos[j+2]=e[2]*x+e[6]*y+e[10]*z+e[14];if(NA){const a=NA[i*3],b=NA[i*3+1],c=NA[i*3+2];let nx=e[0]*a+e[4]*b+e[8]*c,ny=e[1]*a+e[5]*b+e[9]*c,nz=e[2]*a+e[6]*b+e[10]*c;const l=Math.hypot(nx,ny,nz)||1;nor[j]=nx/l;nor[j+1]=ny/l;nor[j+2]=nz/l}
        if(C){hasC=true;col[j]=C.array[i*C.itemSize];col[j+1]=C.array[i*C.itemSize+1];col[j+2]=C.array[i*C.itemSize+2]}if(U){hasUV=true;uv[(off+i)*2]=U.array[i*2];uv[(off+i)*2+1]=U.array[i*2+1]}}off+=P.count}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('normal',new THREE.BufferAttribute(nor,3));if(hasC)g.setAttribute('color',new THREE.BufferAttribute(col,3));if(hasUV)g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
    for(const k of ['aT','aPart','aW']){const a0=geos[0][1].attributes[k];if(a0){const isz=a0.itemSize,A=new Float32Array(nv*isz);let o2=0;for(const [,gg] of geos){const a=gg.attributes[k];if(a)A.set(a.array.subarray(0,gg.attributes.position.count*isz),o2*isz);o2+=gg.attributes.position.count}g.setAttribute(k,new THREE.BufferAttribute(A,isz))}}
    g.computeBoundingSphere();const mm=new THREE.Mesh(g,mat);mm.castShadow=true;mm.receiveShadow=true;out.add(mm)}
  out.userData.noVox=1;out.visible=false;root.add(out);return out}
function npcLOD(n,far){const G=n.m&&(n.m.userData.g||n._G);if(!G)return;if(n._imp&&n._imp.parent!==n.m){n._imp=null;n._impOn=0}if(far){if(n._imp==null){try{n._imp=npcImpostor(n)}catch(e){n._imp=false;window.__impErr=String(e&&e.stack||e).slice(0,400)}}if(n._imp&&!n._impOn){n._impOn=1;n._imp.visible=true;G.visible=false}}
  else if(n._impOn){n._impOn=0;if(n._imp)n._imp.visible=false;G.visible=true}}
// inne postacie w osadzie (strażnicy na murach, kupcy przy straganach) — ten sam uproszczony model z daleka
function staticCharLOD(v){const t=performance.now();if(v._sclT&&t-v._sclT<500)return;v._sclT=t;if(!v._scl){const npcM=new Set(v.npcs.map(n=>n.m));v._scl=v.g.children.filter(c=>c.userData&&c.userData.head&&!npcM.has(c)).map(c=>{const G=c.children.find(q=>q.isGroup||q.type==='Group');return G?{m:c,_G:G}:null}).filter(Boolean)}
  for(const o of v._scl){const wx=o.m.position.x+v.g.position.x,wz=o.m.position.z+v.g.position.z,far=Math.abs(wx-player.p.x)>26||Math.abs(wz-player.p.z)>26;npcLOD(o,far)}}
// v119: statyczne części osady (domy, ozdoby, mury) nie przeliczają macierzy w każdej klatce
function freezeVillage(v){const t=performance.now();if(v._frzT&&t-v._frzT<1000)return;v._frzT=t;const skip=new Set();for(const n of v.npcs){if(n.m)skip.add(n.m);if(n.stall)skip.add(n.stall);if(n.anvil)skip.add(n.anvil);if(n.pet)skip.add(n.pet)}for(const m of (v.millS||[]))skip.add(m);if(v.life){for(const q of v.life.g)if(q.m)skip.add(q.m);for(const q of v.life.k)if(q.m)skip.add(q.m)}
  const fr=o=>{if(skip.has(o)||(o.userData&&(o.userData.head||o.userData.anim)))return;if(o.matrixAutoUpdate){o.updateMatrix();o.matrixAutoUpdate=false}for(const c of o.children)fr(c)};for(const c of v.g.children)fr(c)
  // v121: drobne detale domów (okiennice, skrzynki, szyldy, kominy itp.) chowane, gdy dom jest dalej niż ~75 m
  if(!v._hdet||v._hdetN!==v.g.children.length){v._hdetN=v.g.children.length;v._hdet=[];for(const c of v.g.children){if(skip.has(c)||!c.isMesh||!c.children.length||(c.userData&&c.userData.head))continue;const parts=[];c.traverse(o=>{if(o!==c&&o.isMesh&&o.geometry&&o.geometry.attributes.position&&o.geometry.attributes.position.count<700&&!skip.has(o)&&!(o.userData&&o.userData.anim))parts.push(o)});if(parts.length)v._hdet.push({h:c,parts,hid:false})}}
  const gx=v.g.position.x,gz=v.g.position.z;for(const d of v._hdet){const far=Math.abs(d.h.position.x+gx-player.p.x)>75||Math.abs(d.h.position.z+gz-player.p.z)>75;if(far!==d.hid){d.hid=far;for(const o of d.parts){if(far){o.userData._vis0=o.visible;o.visible=false}else o.visible=o.userData._vis0!==false}}}}
function npcTick(dt){
  nearNpc=null;let nd=3.2;
  for(const v of villages.values()){if(!v||!v.g)continue;
    for(const s of (v.millS||[]))s.rotation.z+=dt*0.7;
    if(v.temple&&!P2.dead&&Math.hypot(player.p.x-v.x,player.p.z-v.z)<11&&P2.hp<ST.hp){P2.hp=Math.min(ST.hp,P2.hp+ST.hp*0.05*dt);if(!v.blT||performance.now()-v.blT>6000){v.blT=performance.now();toast('Błogosławieństwo świątyni leczy rany','#cfe8ff')}}
    /* v107: mieszkańcy chowają się tylko przed groźnym wrogiem w pobliżu (nie przed każdym stworem w okolicy miasta) */
    {const DG=[];const rr=(v.city?v.Hs:30)+AIP.npcPad;for(const e of enemies.values()){if(e.pas||e.st===2||e.car)continue;const d=EDEF[e.t];if(!d||d.passive||d.ally||!(d.aggro>0))continue;if(Math.abs(e.p.x-v.x)<rr&&Math.abs(e.p.z-v.z)<rr)DG.push(e)}v._dgL=DG;
      let dg=false;if(DG.length)for(const n of v.npcs){if(n.role==='straz')continue;for(const e of DG)if(Math.abs(e.p.x-n.x)<14&&Math.abs(e.p.z-n.z)<14&&Math.hypot(e.p.x-n.x,e.p.z-n.z)<14){dg=true;break}if(dg)break}
      if(dg&&!v._dg&&Math.hypot(player.p.x-v.x,player.p.z-v.z)<rr+20)toast('Mieszkańcy w pobliżu wroga chowają się do domów!','#ff9d6b');v._dg=dg}
    try{staticCharLOD(v)}catch(_){}
    try{freezeVillage(v)}catch(_){}
    const night=hour>=21.5||hour<5.3,dt0=dt;
    for(const n of v.npcs){if(!n.m)continue;let dt=dt0;
      {/* v118: dalecy mieszkańcy liczeni co 4. klatkę, bardzo dalecy ukryci */const fx=Math.abs(n.x-player.p.x),fz=Math.abs(n.z-player.p.z),far=fx>55||fz>55;
        if(fx>110||fz>110){if(!n.hid&&n.m.visible){n.m.visible=false;n._farH=1}}else if(n._farH){n._farH=0;if(!n.hid)n.m.visible=true}
        npcLOD(n,(fx>26||fz>26)&&!(dlg&&dlg.n===n));
        if(far&&!(dlg&&dlg.n===n)){n._acc=(n._acc||0)+dt;n._fi=((n._fi||0)+1)&3;if(n._fi)continue;dt=Math.min(n._acc,0.5);n._acc=0}}
      {const talk=dlg&&dlg.n===n;if(talk){n.run=null;if(n.hid){n.hid=false;n.m.visible=true}n.m.rotation.y=Math.atan2(player.p.x-n.x,player.p.z-n.z)}const nearE=v._dg&&n.role!=='straz'&&(v._dgL||[]).some(e=>Math.abs(e.p.x-n.x)<14&&Math.abs(e.p.z-n.z)<14&&Math.hypot(e.p.x-n.x,e.p.z-n.z)<14);if(nearE)n._hideT=performance.now();const want=!talk&&!v.wander&&((night&&!(n.owl&&hour<23.6&&hour>4.2)&&(n.role==='mieszk'||n.role==='wedr'||n.farmer))||nearE||(n._hideT&&performance.now()-n._hideT<6000));
        if(want&&!n.hid){if(v._dg&&!n.inside){if(!n.run){let hb=null,hd=1e9;for(const h of v.houses){const d=Math.hypot((h.cx??h.x)-n.x,(h.cz??h.z)-n.z);if(d<hd){hd=d;hb=h}}n.run=hb?[hb.cx??hb.x,hb.cz??hb.z]:[v.x,v.z]}
            const dx=n.run[0]-n.x,dz=n.run[1]-n.z,d=Math.hypot(dx,dz);if(d>1.4){const s=Math.min(d,AIP.npcRun*dt);n.x+=dx/d*s;n.z+=dz/d*s;n.m.position.x=n.x;n.m.position.z=n.z;n.m.rotation.y=Math.atan2(dx,dz);const G=n.m.userData.g;if(G)animChar(G,4,dt,false,false);if(dlg&&dlg.n===n)closeDialog();continue}}
          n.hid=true;n.m.visible=false;n.run=null;if(dlg&&dlg.n===n)closeDialog()}
        else if(!want&&n.hid){n.hid=false;n.m.visible=true;n.run=null}else if(!want)n.run=null;
        if(n.hid)continue}
      {const dx=player.p.x-n.x,dz=player.p.z-n.z,dd=Math.hypot(dx,dz),mn=0.4+PR;if(dd<mn&&dd>1e-3&&!SPC&&Math.abs(player.p.y-n.m.position.y)<1.8){player.p.x=n.x+dx/dd*mn;player.p.z=n.z+dz/dd*mn}}
      const pth=npcPath(n,v);let moving=false;
      if(pth){const near=Math.hypot(player.p.x-n.x,player.p.z-n.z)<4.2||(dlg&&dlg.n===n)||!!n.chat;if(near)n.hold=(n.hold||0)+dt;
        const [wx,wz,wr,mv]=npcWalkPos(n,worldT-(n.hold||0));
        if(!near){const dx=wx-n.x,dz=wz-n.z,dd=Math.hypot(dx,dz);if(dd>3){n.x=wx;n.z=wz}else if(dd>0.01){const st=Math.min(dd,2.2*dt*(dd>0.4?1.6:1));n.x+=dx/dd*st;n.z+=dz/dd*st}n.ry=wr;moving=mv;n.m.position.x=n.x;n.m.position.z=n.z}}
      const gu=n.m.userData.g&&n.m.userData.g.userData;if(gu&&pth&&!n._impOn)animChar(n.m.userData.g,moving?1.25:0,dt,false,false);
      {if(!v._doors){v._doors=v.houses.filter(q=>q.core).map(q=>{const [dx,dz]=doorOf(q);return[dx,dz,Math.sin(q.rot),Math.cos(q.rot)]});const DG2=new Map();for(const d of v._doors){const k=Math.floor(d[0]/8)*65536+Math.floor(d[1]/8);let a=DG2.get(k);if(!a){a=[];DG2.set(k,a)}a.push(d)}v._dgr=DG2}
        const DN=[];{const cx=Math.floor(n.x/8),cz=Math.floor(n.z/8);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=v._dgr.get((cx+i)*65536+cz+j);if(a)for(const d of a)DN.push(d)}}for(const [dx,dz,fx,fz] of DN){const ex=n.x-dx,ez=n.z-dz;if(Math.abs(ex)>4||Math.abs(ez)>4)continue;const fw=ex*fx+ez*fz,lt=ex*fz-ez*fx;if(fw>-1.2&&fw<2.6&&Math.abs(lt)<2){const nl=(lt>=0?2:-2);n.x=dx+fx*fw+fz*nl;n.z=dz+fz*fw-fx*nl;n.m.position.x=n.x;n.m.position.z=n.z}}}
      let h=colAt(n.x,n.z);const vg=villageGround(n.x,n.z,999);if(vg!==null&&(h===null||vg>h))h=vg;if(h!==null)n.m.position.y=h+0.003;/* +3 mm: podeszwy nie leżą w płaszczyźnie podłoża */
      const dx=player.p.x-n.x,dz=player.p.z-n.z,d=Math.hypot(dx,dz);const u=n.m.userData;u.ph+=dt;
      let tr=n.ry;if(n.chat&&n.chatFace!=null)tr=n.chatFace;else if(d<(pth?4.2:7))tr=Math.atan2(dx,dz);let dr=tr-n.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));n.m.rotation.y+=dr*Math.min(1,(moving?8:5)*dt);
      if(!pth||!moving){u.head.rotation.x=Math.sin(u.ph*0.7)*0.05;if(!pth)u.ra.rotation.x=n.role==='kowal'?-0.6+Math.abs(Math.sin(u.ph*3))*-1.2:Math.sin(u.ph*0.9)*0.06}
      const q=W.quests.find(q=>q.giver===n.id&&q.done||(q.type==='deliver'&&q.to===n.id&&!q.done));const avail=!q&&canOfferQuest(n);
      if(n.stall){n.stall.position.set(n.x+Math.sin(n.ry)*1.3,n.m.position.y,n.z+Math.cos(n.ry)*1.3);n.stall.rotation.y=n.ry}
      if(n.anvil){n.anvil.position.set(n.x+Math.sin(n.ry+1.2)*1.2,n.m.position.y,n.z+Math.cos(n.ry+1.2)*1.2)}
      n.mark=q?'?':avail?'!':({kowal:'⚒',kupiec:'💰',portowy:'⚓',najemnik:'⚔',starszy:'📜',krol:'👑',karczmarz:'🍺'})[n.role]||'';/* v153: ikony usług */
      if(d<nd&&Math.abs(player.p.y-n.m.position.y)<3){nd=d;nearNpc=n}}}
  const pr=$('prompt');if(nearNpc&&!dlg){pr.hidden=false;pr.innerHTML='<kbd>F</kbd> Rozmowa: <b></b>';pr.querySelector('b').textContent=nearNpc.name+' ('+nearNpc.roleN+')'}else pr.hidden=true;
  if(dlg&&Math.hypot(player.p.x-dlg.n.x,player.p.z-dlg.n.z)>5.5)closeDialog();
}
// ===== ROZMOWY OSADNIKÓW: mieszkańcy zatrzymują się przy sobie i wymieniają kwestie (dymki nad głowami) =====
// każda rozmowa: lista kwestii na przemian A, B, A, … ; {k:[role]} zawęża do ról (dowolny z pary)
const CHATS=[
 ['Słyszałeś? Podobno w lochu za lasem siedzi smok.','To nie smok, to teściowa młynarza.','Tak czy owak, nie zaglądam.'],
 ['Znowu pada.','Przecież świeci słońce.','No to zaraz zacznie. Zawsze tak jest, jak pranie wywieszę.'],
 ['Wiesz, ile kosztuje teraz bochenek chleba?','Ile?','Też nie wiem, dlatego pytam.'],
 ['Moja koza dziś znowu zjadła mi kapelusz.','Ten z piórkiem?','Z piórkiem, wstążką i resztką mojej godności.'],
 ['Widziałeś tego bohatera z mieczem większym niż on sam?','Widziałem. Wpadł do studni.','Ale z jaką gracją!'],
 ['Czemu kury przechodzą przez drogę?','Żeby dostać się na drugą stronę?','Nie. Uciekają przed tym nowym w zbroi.'],
 ['Żona kazała mi kupić jajka.','I co?','Kupiłem kurę. Niech sama robi.'],
 ['Podobno król się żeni.','Znowu?','Mówi, że tym razem z miłości. Do posagu.'],
 ['Masz może pożyczyć trzy srebrniki?','Mam.','Świetnie, to pożycz.','Mam… na myśli, że mam brata, który ma.'],
 ['Ten nowy przybysz zbiera każdą szyszkę z ziemi.','Może kolekcjoner?','A może po prostu nie ma porządnego plecaka.'],
 ['Mój dziadek walczył z goblinami.','Wygrał?','Przegrał w kości. Ale walczył dzielnie.'],
 ['Czujesz ten zapach?','To z karczmy.','Nie, to od ciebie. Kiedyś się kąpałeś?','W zeszłym roku. Na święto plonów.'],
 ['Wczoraj widziałem ducha na cmentarzu!','Naprawdę?','Tak. Pożyczył ode mnie ogień i poszedł.'],
 ['Mówią, że za górami ludzie jedzą ślimaki.','Fuj.','I płacą za to krocie!','Zacznę je zbierać od jutra.'],
 ['Kiedy skończysz ten dach?','Jutro.','Mówiłeś tak w zeszłym miesiącu.','No i jutro wciąż jest jutro.'],
 ['Nie mogę spać, wilki wyją pod oknem.','Rzuć im kość.','Rzuciłem. Teraz wyją o drugą.'],
 ['Kupiłem miksturę młodości!','I jak?','Mam teraz pryszcze jak piętnastolatek. Reszta bez zmian.'],
 ['Gdzie twój osioł?','Poszedł szukać lepszego życia.','Pewnie wróci na obiad.'],
 ['Mój syn chce zostać rycerzem.','Ambitnie.','Na razie atakuje kury patykiem.'],
 ['Słyszałem, że w mieście sprzedają magiczne fasolki.','I co z nich wyrasta?','Długi.'],
 ['Kto ukradł mi rzepę z grządki?!','Nie patrz na mnie.','Masz liście za uchem.','To… nowa moda.'],
 ['Wiesz, że ziemia jest okrągła?','Bzdura, chodzę po niej codziennie i jest płaska.','Pod górę trochę mniej.'],
 ['Zazdroszczę ptakom.','Bo latają?','Bo nie płacą podatków.'],
 ['Najlepszy sposób na trolla?','Miecz?','Zagadka. Trolle nie znoszą myślenia.','Tak jak mój szwagier.'],
 ['Znowu ten bard śpiewa pod moim oknem.','Ładnie śpiewa?','Jak koza w kołowrotku. Ale z uczuciem.'],
 ['Pożyczysz mi drabinę?','Po co?','Kot wlazł na dach.','Mój kot?','Teraz już mój.'],
 ['Podobno nad jeziorem widziano syrenę.','Ładną?','Śpiewała jak mój teść po trzecim kuflu.'],
 ['Jak się czujesz?','Jak ziemniak w deszczu.','Czyli dobrze?','Czyli mokro i bez perspektyw.'],
 ['Mój pies nauczył się liczyć!','Do ilu?','Do jednej kiełbasy. Potem traci zainteresowanie.'],
 ['Ten nowy kowal robi miecze z gwarancją.','Jaką?','Że się złamią dopiero po walce.'],
 ['Wiesz, czemu elfy mają spiczaste uszy?','Czemu?','Bo słuchają plotek z dwóch wiosek naraz.'],
 ['Ile trzeba krasnoludów, żeby wymienić świecę?','Ilu?','Ani jednego. Krasnoludy lubią ciemność i swoje brody.'],
 ['Ork zapukał wczoraj do mnie i pytał o drogę.','I co?','Dałem mu mapę. Zjadł ją.'],
 ['Podatki znowu wzrosły.','O ile?','O tyle, że zostało mi tylko na podatki.'],
 ['Zaczynam nowe życie od poniedziałku.','Który poniedziałek?','Jeszcze nie zdecydowałem.'],
 ['Masz jakieś plany na święta?','Uciec przed rodziną.','Gdzie?','Do lochu. Tam przynajmniej szkielety nie zadają pytań.'],
 ['Moja żona mówi, że chrapię jak niedźwiedź.','A chrapiesz?','Nie wiem, wtedy śpię. Ale niedźwiedź z lasu się obraził.'],
 ['Widziałeś jak ten wędrowiec skacze po dachach?','Widziałem.','Pewnie szuka czegoś w kominach.','Albo zgubił rozum.'],
 ['Słyszałem, że jak się wypowie imię lisza trzy razy…','Co wtedy?','Język się plącze. Spróbuj: Lisz, lisz, lisz…','Liszlisz… lisssz. Faktycznie.'],
 ['Dzień dobry!','Dla kogo dobry, dla tego dobry.','Co się stało?','Nic. Po prostu lubię narzekać.'],
 ['Czemu nosisz garnek na głowie?','Bo hełm był za drogi.','Działa?','Odbija deszcz i złe myśli.'],
 ['Sąsiad kupił sobie konia.','I co z tego?','Teraz chodzi pieszo i prowadzi konia, bo boi się na nim jechać.'],
 ['Gdybyś mógł mieć jedną magiczną moc?','Niewidzialność.','Po co?','Żeby żona nie znalazła mnie, kiedy trzeba rąbać drewno.'],
 ['Mówią, że w górach mieszka olbrzym.','Wielki?','Większy niż twoje ego.','To naprawdę wielki.'],
 ['Wczoraj w karczmie ktoś wypił beczkę miodu.','Sam?','Z pomocą kufla.'],
 ['Masz ładne buty.','Dziękuję, zdjąłem je z pewnego goblina.','Nie śmierdzą?','Teraz śmierdzą mną, to postęp.'],
 // role
 {k:['straz'],l:['Nuda na tej warcie.','Lepiej nuda niż smok.','Smok przynajmniej coś by się działo.','Uważaj, czego sobie życzysz.']},
 {k:['straz'],l:['Widziałeś coś podejrzanego?','Tylko twoją fryzurę.','Bardzo śmieszne. Wracaj na posterunek.']},
 {k:['straz'],l:['Kapitan każe nam wypolerować zbroje.','Znowu?','Mówi, że wróg oślepi się blaskiem.','Albo my od tego wiecznego polerowania.']},
 {k:['straz'],l:['Ile jeszcze do końca warty?','Trzy godziny.','A ile już stoimy?','Dziesięć minut.']},
 {k:['kupiec'],l:['Jak interesy?','Kwitną! Sprzedałem dziś miotłę.','Jedną?','Ale za cenę trzech!']},
 {k:['kupiec'],l:['Ten kupiec z naprzeciwka obniżył ceny.','Szaleniec.','Klienci walą do niego drzwiami i oknami.','Mówiłem, szaleniec. Genialny szaleniec.']},
 {k:['kupiec'],l:['Mam towar prosto z południa!','Co to?','Piasek.','Kto kupuje piasek?','Ci, którym zabrakło piasku, oczywiście!']},
 {k:['kowal'],l:['Głośno u ciebie od rana.','To kucie żelaza, nie hałas.','Mój kot wyprowadził się na drugi koniec wsi.','Kot nie docenia sztuki.']},
 {k:['kowal'],l:['Zrobisz mi miecz?','Jaki?','Taki, żeby wyglądał groźnie, ale nie był ciężki.','To weź patyk i pomaluj na szaro.']},
 {k:['starszy'],l:['Starszy, kiedy naprawicie most?','Jak tylko przyjdą pieniądze z podatków.','Przecież płaciliśmy w zeszłym roku!','No właśnie. Poszły na naprawę mostu w zeszłym roku.']},
 {k:['dworzanin','doradca','krol'],l:['Czy król już zjadł śniadanie?','Trzy razy.','To dobry humor?','Najlepszy. Może dziś nikogo nie wtrąci do lochu.']},
 {k:['dworzanin','doradca','krol'],l:['Widziałaś nową suknię hrabiny?','Ta z pawimi piórami?','Paw do dziś szuka swoich piór.']},
 {k:['dworzanin','doradca','krol'],l:['Na balu podano pieczonego łabędzia.','Smakował?','Smakował jak kaczka, która myślała, że jest lepsza.']},
 {k:['dworzanin','doradca','krol'],l:['Ambasador z północy znowu przysnął na audiencji.','Głośno chrapał?','Tak, że minstrel zaczął grać do rytmu.']},
 {k:['dworzanin','doradca','krol'],l:['Kto wymyślił, że korona ma być złota?','Ktoś, kto nie musiał jej nosić cały dzień.','Biedny król. Ma od tego sztywny kark.','I pełny skarbiec. Jakoś to znosi.']},
 {k:['dworzanin','doradca','krol'],l:['Podobno błazen powiedział królowi prawdę.','Odważny.','Albo głupi.','W jego zawodzie to jedno i to samo.']},
 {k:['dworzanin','doradca','krol'],l:['Ta intryga z kanclerzem…','Ciii! Ściany mają uszy.','A te ściany również obrazy z oczami.','Dlatego mówię szeptem do gobelinu.']},
 {k:['dworzanin','doradca','krol'],l:['Czy wiesz, że dzisiejsza uczta ma czternaście dań?','A nas zaproszono?','Zaproszono nas do sprzątania po czternastu daniach.']},
 {k:['blazen'],l:['Błaźnie, opowiedz coś śmiesznego!','Podatki!','To nie było śmieszne.','Dla skarbnika było!']},
 {k:['blazen'],l:['Czemu masz dzwoneczki na czapce?','Żeby wszyscy wiedzieli, kiedy idę.','Po co?','Żeby mieli czas schować wino.']},
 {k:['mieszk','wedr'],l:['Wybierasz się na targ?','Tak, kupić nową miskę.','Co się stało ze starą?','Mąż w niej zupę gotował. Na ognisku. Drewnianą.']},
 {k:['mieszk','wedr'],l:['Ładnie dziś w mieście.','Bo deszczu nie ma.','I błota mniej.','I strażnika, który zawsze mnie pyta, czemu się uśmiecham.']},
 {k:['najemnik'],l:['Ile bierzesz za dzień?','Dziesięć srebrników.','Za dzień walki?','Za dzień udawania, że walczę. Walka jest dodatkowo płatna.']},
];
const CHATR={orkowie:[['Ork lubi bić.','Ork lubi jeść.','Ork lubi bić, potem jeść.','Dobry plan.'],['Czemu elfy takie chude?','Bo jedzą liście.','Ork nie je liści. Ork je tych, co jedzą liście.']],
  krasnoludy:[['Ta broda rośnie mi krzywo.','Krzywa broda, prosta dusza.','A prosta broda?','Elf przebrany za krasnoluda!'],['Ile dziś wykopałeś?','Trzy złote samorodki i jednego śpiącego trolla.','I co z trollem?','Zasypałem. Niech śpi.']],
  elfy:[['Czy słyszysz, jak śpiewają drzewa?','Słyszę tylko, jak burczy mi w brzuchu.','Brak ci duchowości.','Brak mi śniadania.'],['Mój łuk ma trzysta lat.','Mój kubek też.','Ale łuk wciąż strzela.','A kubek wciąż przecieka.']],
  niziolki:[['Drugie śniadanie już było?','Dopiero pierwsze.','Szkoda. Myślałem, że już czas na podwieczorek.'],['Upiekłam ciasto z siedmioma rodzajami owoców!','Czemu siedmioma?','Bo w spiżarni było osiem, a jeden zjadłam po drodze.']],
  drowy:[['Za jasno dziś.','Przecież jesteśmy pod ziemią.','No właśnie. Ktoś zapalił drugą świecę.'],['Słyszałeś o spisku matrony?','Którym?','Tym, w którym spiskuje przeciwko spiskowi.']],
  saurianie:[['Ssssłońce dziś dobre.','Dobre na grzanie łussssek.','I na jajka.','Twoje czy kurze?']]};
// bierze rozmowę pasującą do pary NPC
function pickChat(a,b){const roles=[a.role,b.role],pool=[];for(const c of CHATS){if(Array.isArray(c))pool.push(c);else if(c.k.some(k=>roles.includes(k))){pool.push(c.l,c.l,c.l)}}
  const rc=CHATR[a.race||b.race];if(rc)for(const c of rc)pool.push(c,c);return pool[Math.floor(Math.random()*pool.length)]}
// dymek z tekstem nad głową NPC (zawijany, znika z odległością)
function chatBubble(n,text,t){if(!n.m)return;if(n._bub){n.m.remove(n._bub);n._bub.material.map.dispose();n._bub.material.dispose();n._bub=null}if(!text)return;
  const cv=document.createElement('canvas');cv.width=512;cv.height=160;const x=cv.getContext('2d');x.font='600 26px "Alegreya Sans", sans-serif';
  const words=text.split(' '),lines=[];let cur='';for(const w of words){const tt=cur?cur+' '+w:w;if(x.measureText(tt).width>440&&cur){lines.push(cur);cur=w}else cur=tt}if(cur)lines.push(cur);while(lines.length>3){lines[2]+=' '+lines.pop()}
  const lw=Math.max(...lines.map(l=>x.measureText(l).width))+30,lh=30,hh=lines.length*lh+18,y0=(130-hh);
  x.fillStyle='rgba(250,244,228,.94)';x.strokeStyle='rgba(60,40,20,.85)';x.lineWidth=3;const rx=256-lw/2;x.beginPath();x.moveTo(rx+12,y0);x.lineTo(rx+lw-12,y0);x.quadraticCurveTo(rx+lw,y0,rx+lw,y0+12);x.lineTo(rx+lw,y0+hh-12);x.quadraticCurveTo(rx+lw,y0+hh,rx+lw-12,y0+hh);x.lineTo(268,y0+hh);x.lineTo(256,y0+hh+18);x.lineTo(248,y0+hh);x.lineTo(rx+12,y0+hh);x.quadraticCurveTo(rx,y0+hh,rx,y0+hh-12);x.lineTo(rx,y0+12);x.quadraticCurveTo(rx,y0,rx+12,y0);x.closePath();x.fill();x.stroke();
  x.fillStyle='#2a1c10';x.textAlign='center';lines.forEach((l,i)=>x.fillText(l,256,y0+9+lh*(i+0.8)));
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false,transparent:true}));sp.scale.set(3.6,1.125,1);sp.position.y=3.05;sp.renderOrder=6;sp.userData.far=18;TAGS.push(sp);n.m.add(sp);n._bub=sp;n._bubT=t}
const CHAT={on:[],t:0,cd:new Map()};
function chatCands(){const out=[],p=player.p;
  if(SPC){if(SPC.live)for(const n of SPC.live)if(n.m&&n.role&&!n.horse&&!n.pet)out.push(n)}
  else for(const v of villages.values()){if(!v||!v.g||Math.abs(v.x-p.x)>110||Math.abs(v.z-p.z)>110)continue;for(const n of v.npcs)if(n.m&&!n.hid&&n.m.visible)out.push(n)}
  return out.filter(n=>Math.hypot(n.x-p.x,n.z-p.z)<40&&!(dlg&&dlg.n===n))}
function chatTick(dt){const now=performance.now()/1000;
  // trwające rozmowy
  for(let i=CHAT.on.length-1;i>=0;i--){const c=CHAT.on[i],[a,b]=c.p;const bad=!a.m||!b.m||(dlg&&(dlg.n===a||dlg.n===b))||Math.hypot(a.x-b.x,a.z-b.z)>6||a.hid||b.hid;
    if(bad||now>c.next&&c.i>=c.L.length){chatBubble(a,null);chatBubble(b,null);a.chat=b.chat=null;CHAT.cd.set(a.id,now+20+Math.random()*30);CHAT.cd.set(b.id,now+20+Math.random()*30);CHAT.on.splice(i,1);continue}
    if(now>=c.next){const sp=c.i%2?b:a,ls=c.i%2?a:b;chatBubble(ls,null);chatBubble(sp,c.L[c.i],now);const len=c.L[c.i].length;c.i++;c.next=now+Math.max(2.6,Math.min(6,1.4+len*0.055))}
    for(const [m,o] of [[a,b],[b,a]]){m.chatFace=Math.atan2(o.x-m.x,o.z-m.z)}}
  CHAT.t-=dt;if(CHAT.t>0)return;CHAT.t=0.8;if(CHAT.on.length>=4)return;
  const C=chatCands().filter(n=>!n.chat&&(CHAT.cd.get(n.id)||0)<now);
  for(let i=0;i<C.length;i++)for(let j=i+1;j<C.length;j++){const a=C[i],b=C[j];if(a.chat||b.chat)continue;const d=Math.hypot(a.x-b.x,a.z-b.z);if(d>4.5||d<0.5)continue;if(Math.random()>0.4){CHAT.cd.set(a.id,now+4);continue}
    const L=pickChat(a,b);if(!L)continue;const c={p:[a,b],L,i:0,next:now+0.3};a.chat=c;b.chat=c;CHAT.on.push(c);if(CHAT.on.length>=4)return}
  // w spokojnych miejscach mieszkańcy sami podchodzą do siebie, żeby pogadać
  if(SPC&&SPC.live){const W2=C.filter(n=>n.wan&&!n.chat&&n.wan.tx==null&&n.wan.t<=0.5);if(W2.length&&Math.random()<0.5){const a=W2[Math.floor(Math.random()*W2.length)];let best=null,bd=a.wan.r||7;for(const b of C){if(b===a||b.chat)continue;const d=Math.hypot(b.x-a.x,b.z-a.z);if(d<bd&&d>2){bd=d;best=b}}if(best){const ang=Math.random()*6.28;a.wan.tx=best.x+Math.sin(ang)*1.4;a.wan.tz=best.z+Math.cos(ang)*1.4}}}}
// ===== KOLIZJE Z KSZTAŁTU MODELI: woksele 0,5 m z geometrii budynków, murów, dekoracji i struktur =====
const VOXC=0.5,VOX=new Map(),VQ=[],VOWN=new Map();
const vkey=(ix,iz)=>(ix+1048576)*2097152+(iz+1048576);
function voxQueue(obj,owner){if(!obj)return;const meshes=[];
  const walk=(o,ch)=>{if(!o||o.visible===false||o.isSprite===true||o.isInstancedMesh===true||(o.userData&&(o.userData.noVox||o.userData.ll||o.userData.legs)))return;ch=ch.concat([o]);const g=o.geometry;
    if(o.isMesh===true&&g&&g.attributes&&g.attributes.position&&o.material!==GLOWMAT&&o.material!==winOff&&!(o.material&&o.material.transparent===true))meshes.push([o,ch]);for(const c of (o.children||[]))walk(c,ch)};
  const chain=[];let q=obj.parent,lim=0;while(q&&q!==scene&&q.isObject3D===true&&q.position&&q.scale&&lim++<12){chain.unshift(q);q=q.parent}walk(obj,chain);for(const [m,ch] of meshes)VQ.push({owner,m,ch,st:0})}
function voxRemove(owner){for(let i=VQ.length-1;i>=0;i--)if(VQ[i].owner===owner)VQ.splice(i,1);const ks=VOWN.get(owner);if(!ks)return;for(const k of ks){const L=VOX.get(k);if(!L)continue;const f=L.filter(e=>e.o!==owner);if(f.length)VOX.set(k,f);else VOX.delete(k)}VOWN.delete(owner)}
let _vqSort=0;const _vqV=new THREE.Vector3();
function voxTick(){const t0=performance.now(),BUD=VQ.length>40?3.5:VQ.length>10?2.5:1.8;
  // najpierw to, co najbliżej gracza (zamki, budowle, domy obok nas mają kolizje od razu)
  if(VQ.length>1&&t0-_vqSort>400&&typeof player!=='undefined'){_vqSort=t0;const p=player.p;for(const J of VQ){if(J.T){J._d=-1;continue}try{J.m.getWorldPosition(_vqV);J._d=(_vqV.x-p.x)**2+(_vqV.z-p.z)**2}catch(_){J._d=1e12}}VQ.sort((a,b)=>a._d-b._d)}
  while(VQ.length&&performance.now()-t0<BUD){const J=VQ[0];
    if(!J.T&&!J.M){/* v122: macierz łańcucha liczona raz, wierzchołki przeliczane porcjami (bez alokacji na każdy wierzchołek) */const ch=J.ch;
      const rot=(r,v)=>{const cx=Math.cos(r.x||0),sx=Math.sin(r.x||0),cy=Math.cos(r.y||0),sy=Math.sin(r.y||0),cz=Math.cos(r.z||0),sz=Math.sin(r.z||0);let [x,y,z]=v;const x1=x*cz-y*sz,y1=x*sz+y*cz,z1=z;if(r.order==='YXZ'){const y2=y1*cx-z1*sx,z2=y1*sx+z1*cx;return[x1*cy+z2*sy,y2,-x1*sy+z2*cy]}const x2=x1*cy+z1*sy,z2=-x1*sy+z1*cy;return[x2,y1*cx-z2*sx,y1*sx+z2*cx]};
      let M=[1,0,0,0,0,1,0,0,0,0,1,0];const mul=(A,B)=>[A[0]*B[0]+A[1]*B[4]+A[2]*B[8],A[0]*B[1]+A[1]*B[5]+A[2]*B[9],A[0]*B[2]+A[1]*B[6]+A[2]*B[10],A[0]*B[3]+A[1]*B[7]+A[2]*B[11]+A[3],A[4]*B[0]+A[5]*B[4]+A[6]*B[8],A[4]*B[1]+A[5]*B[5]+A[6]*B[9],A[4]*B[2]+A[5]*B[6]+A[6]*B[10],A[4]*B[3]+A[5]*B[7]+A[6]*B[11]+A[7],A[8]*B[0]+A[9]*B[4]+A[10]*B[8],A[8]*B[1]+A[9]*B[5]+A[10]*B[9],A[8]*B[2]+A[9]*B[6]+A[10]*B[10],A[8]*B[3]+A[9]*B[7]+A[10]*B[11]+A[11]];
      for(let k=0;k<ch.length;k++){const t=ch[k],cx=rot(t.rotation,[t.scale.x,0,0]),cy=rot(t.rotation,[0,t.scale.y,0]),cz=rot(t.rotation,[0,0,t.scale.z]);M=mul(M,[cx[0],cy[0],cz[0],t.position.x,cx[1],cy[1],cz[1],t.position.y,cx[2],cy[2],cz[2],t.position.z])}
      const g=J.m.geometry;J.M=M;J.P=g.attributes.position.array;J.Tb=new Float32Array(J.P.length);J.vi=0;const IA=g.index&&g.index.array;J.I=IA&&typeof IA.length==='number'&&IA.length>0?IA:null}
    if(!J.T){const M=J.M,P=J.P,T=J.Tb,nv=P.length/3;let i=J.vi;while(i<nv){const e=Math.min(nv,i+4096);for(;i<e;i++){const x=P[i*3],y=P[i*3+1],z=P[i*3+2];T[i*3]=M[0]*x+M[1]*y+M[2]*z+M[3];T[i*3+1]=M[4]*x+M[5]*y+M[6]*z+M[7];T[i*3+2]=M[8]*x+M[9]*y+M[10]*z+M[11]}if(performance.now()-t0>BUD)break}J.vi=i;if(i<nv)break;
      J.T=T;J.P=J.Tb=null;J.n=J.I?J.I.length:nv;J.tmp=new Map();J.q=0;if(!(J.n>0)){VQ.shift();continue}}
    const T=J.T,I=J.I,tmp=J.tmp,st=VOXC*0.7;let c=0;
    while(J.q+2<J.n&&c<60000&&performance.now()-t0<BUD){const a=(I?I[J.q]:J.q)*3,b=(I?I[J.q+1]:J.q+1)*3,d=(I?I[J.q+2]:J.q+2)*3;J.q+=3;c++;
      const ex=T[b]-T[a],ey=T[b+1]-T[a+1],ez=T[b+2]-T[a+2],fx=T[d]-T[a],fy=T[d+1]-T[a+1],fz=T[d+2]-T[a+2];const L=Math.max(Math.hypot(ex,ey,ez),Math.hypot(fx,fy,fz),Math.hypot(fx-ex,fy-ey,fz-ez));
      if(L<1e-4)continue;const ny0=Math.abs(ex*fz-ez*fx)/(Math.hypot(ey*fz-ez*fy,ez*fx-ex*fz,ex*fy-ey*fx)||1),n=Math.min(160,Math.max(1,Math.ceil(L/(ny0>0.9?VOXC*0.95:st))));c+=n*n/2;
      for(let i=0;i<=n;i++)for(let j=0;j<=n-i;j++){const u=i/n,w=j/n,x=T[a]+ex*u+fx*w,y=T[a+1]+ey*u+fy*w,z=T[a+2]+ez*u+fz*w,k=vkey(Math.floor(x/VOXC),Math.floor(z/VOXC));let A=tmp.get(k);if(!A){A=[];tmp.set(k,A)}A.push(y)}}
    if(J.q+2>=J.n){if(!J.E){J.E=[...tmp.entries()];J.ei=0}let ks=VOWN.get(J.owner);if(!ks){ks=new Set();VOWN.set(J.owner,ks)}
      const E2=J.E;let ei=J.ei;for(;ei<E2.length;ei++){if((ei&255)===0&&ei>J.ei&&performance.now()-t0>BUD)break;const [k,A]=E2[ei];A.sort((p,q)=>p-q);const L=VOX.get(k)||[];let a0=A[0],b0=A[0];for(let i=1;i<=A.length;i++){const y=A[i];if(i<A.length&&y-b0<=0.45){b0=y;continue}L.push({o:J.owner,a:a0-0.08,b:b0+0.08});if(i<A.length){a0=y;b0=y}}VOX.set(k,L);ks.add(k)}
      J.ei=ei;if(ei<E2.length)break;VQ.shift();
      J.T=J.tmp=null}}}
// sonda: najwyższa „podłoga” do wejścia (top) i czy coś blokuje ciało (block) w punkcie x,z dla stóp na wysokości y
function voxProbe(x,z,y,rad,hgt){let top=null,block=false,topC=null;if(!VOX.size)return{top,block,topC};const P=rad>0?[[0,0],[rad,0],[-rad,0],[0,rad],[0,-rad]]:[[0,0]];
  for(const [ox,oz] of P){const L=VOX.get(vkey(Math.floor((x+ox)/VOXC),Math.floor((z+oz)/VOXC)));if(!L)continue;
    for(const e of L){if(e.b<=y+STEP+0.02){if(e.b>y-2.5&&(top===null||e.b>top))top=e.b}else if(e.a<y+hgt){block=true;if(topC===null||e.b>topC)topC=e.b}}}
  return{top,block,topC}}
function voxPoint(x,y,z){const L=VOX.get(vkey(Math.floor(x/VOXC),Math.floor(z/VOXC)));if(!L)return false;for(const e of L)if(y>e.a&&y<e.b)return true;return false}
TICKS.push(()=>{try{voxTick()}catch(e){console.warn('vox',e);VQ.shift()}});
// czy punkt jest wewnątrz bryły budynku / muru / struktury (bez przesuwania) — dla pocisków
function solidAt(x,y,z){if(voxPoint(x,y,z))return true;for(const v of villages.values()){if(!v||Math.abs(v.x-x)>45+(v.Hs||0)||Math.abs(v.z-z)>45+(v.Hs||0))continue;
    for(const h of v.houses){if(!h.core||Math.abs(h.x-x)>(h.big?20:14)||Math.abs(h.z-z)>(h.big?20:14))continue;if(y>h.top+(h.big?LMK[h.func].hgt:6.5)||y<h.top-0.5)continue;const k=h.core,c=Math.cos(h.rot),s=Math.sin(h.rot),dx=x-h.cx,dz=z-h.cz,lx=dx*c-dz*s,lz=dx*s+dz*c;if(Math.abs(lx)<k.w/2&&Math.abs(lz)<k.d/2)return true}
    if(v.cols)for(const [cx,cz,hw,hd,top] of v.cols)if(y<top-0.05&&Math.abs(x-cx)<hw&&Math.abs(z-cz)<hd)return true}
  for(const s of structs.values()){if(!s||!s.cols||Math.abs(s.x-x)>48||Math.abs(s.z-z)>48)continue;for(const [cx,cz,hw,hd,top] of s.cols)if(y<top-0.05&&Math.abs(x-cx)<hw&&Math.abs(z-cz)<hd)return true}
  return false}
function villageCollide(p){const me=p===player.p;
  for(const v of villages.values()){if(!v||Math.abs(v.x-p.x)>45+(v.Hs||0)||Math.abs(v.z-p.z)>45+(v.Hs||0))continue;
    // gracz: gdy domy osady mają już kolizję wokselową, ściany i dachy obsługuje ona (można się wspinać i chodzić po dachach)
    const vox=me&&VOWN.has(v.id)&&!VQ.some(j=>j.owner===v.id);
    if(!v._bigH||v._bigHN!==v.houses.length){v._bigH=v.houses.filter(q=>q.kcastle||q.big||q.arena);v._bigHN=v.houses.length}
    for(const h of housesNear(v,p.x,p.z).concat(v._bigH)){if(!h.core)continue;const ext=h.kcastle||h.big?h.core.pw/2+3:14;if(Math.abs(h.x-p.x)>ext||Math.abs(h.z-p.z)>ext)continue;const k=h.core,c=Math.cos(h.rot),s=Math.sin(h.rot);
      // podest działki: niski można wejść, wysoki blokuje
      {const dx=p.x-h.x,dz=p.z-h.z;let lx=dx*c-dz*s,lz=dx*s+dz*c;const ex=k.pw/2+PR-Math.abs(lx),ez=k.pd/2+PR-Math.abs(lz);
       if(ex>0&&ez>0&&p.y<h.top-0.05){if(h.top-p.y<=1.05&&player.ground)p.y=h.top;else{if(ex<ez)lx+=Math.sign(lx||1)*ex;else lz+=Math.sign(lz||1)*ez;p.x=h.x+lx*c+lz*s;p.z=h.z-lx*s+lz*c}}}
      if(p.y>h.top+(h.kcastle?30:h.big?LMK[h.func].hgt:7)||vox)continue;
      {const dx=p.x-h.cx,dz=p.z-h.cz;let lx=dx*c-dz*s,lz=dx*s+dz*c;const ex=k.w/2+PR-Math.abs(lx),ez=k.d/2+PR-Math.abs(lz);
       if(ex>0&&ez>0){if(ex<ez)lx+=Math.sign(lx||1)*ex;else lz+=Math.sign(lz||1)*ez;p.x=h.cx+lx*c+lz*s;p.z=h.cz-lx*s+lz*c}}}
    if(v.props&&(!v._pg||v._pgN!==v.props.length)){const G=new Map();for(const q of v.props){const k=Math.floor(q.x/8)*65536+Math.floor(q.z/8);let a=G.get(k);if(!a){a=[];G.set(k,a)}a.push(q)}v._pg=G;v._pgN=v.props.length}
    const PN=[];if(v._pg){const cx=Math.floor(p.x/8),cz=Math.floor(p.z/8);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=v._pg.get((cx+i)*65536+cz+j);if(a)for(const q of a)PN.push(q)}}
    for(const q of PN){const dx=p.x-q.x,dz=p.z-q.z,d=Math.hypot(dx,dz),mn=q.r+PR;if(d<mn&&d>1e-4&&p.y<v.h+3){p.x=q.x+dx/d*mn;p.z=q.z+dz/d*mn}}
    if(v.cols)for(const [cx,cz,hw,hd,top,kc] of v.cols){if(p.y>=top-0.05||(kc&&vox))continue;const ex=hw+PR-Math.abs(p.x-cx),ez=hd+PR-Math.abs(p.z-cz);if(ex>0&&ez>0){if(ex<ez)p.x+=Math.sign(p.x-cx||1)*ex;else p.z+=Math.sign(p.z-cz||1)*ez}}}
}
function housesNear(v,x,z){/* v118: siatka domów 16 m — zamiast przeglądać wszystkie domy miasta */if(!v._hg||v._hgN!==v.houses.length){const G=new Map();for(const h of v.houses){const k=Math.floor(h.x/16)*65536+Math.floor(h.z/16);let a=G.get(k);if(!a){a=[];G.set(k,a)}a.push(h)}v._hg=G;v._hgN=v.houses.length}
  const cx=Math.floor(x/16),cz=Math.floor(z/16),out=[];for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const a=v._hg.get((cx+i)*65536+cz+j);if(a)for(const h of a)out.push(h)}return out}
function villageGround(x,z,y){let best=null;
  for(const v of villages.values()){if(!v||Math.abs(v.x-x)>45+(v.Hs||0)||Math.abs(v.z-z)>45+(v.Hs||0))continue;
    for(const h of housesNear(v,x,z)){if(!h.core||h.top>y+0.3||Math.abs(h.x-x)>14||Math.abs(h.z-z)>14)continue;const c=Math.cos(h.rot),s=Math.sin(h.rot),dx=x-h.x,dz=z-h.z,lx=dx*c-dz*s,lz=dx*s+dz*c;
      if(Math.abs(lx)<h.core.pw/2&&Math.abs(lz)<h.core.pd/2&&(best===null||h.top>best))best=h.top}}
  return best}
function inVillage(x,z,r){for(const v of villages.values())if(v&&Math.hypot(v.x-x,v.z-z)<r+(v.city?v.Hs*1.2:0))return v;return null}

// ---------- questy ----------
const COLLECT={2:['Zioła lecznicze','#7dd87d'],3:['Grzyby leśne','#d9a27c'],4:['Kwiaty pustyni','#ffd34d'],5:['Kryształy mrozu','#8fe9ff'],6:['Bryłki rudy','#c9a64a'],7:['Bagienne lilie','#d96bd0'],1:['Perłowe muszle','#f2ead8']};
const QMAX=8;function canOfferQuest(n){return n.qg&&!!villages.get(n.vid)&&tierOf(W.rep[n.race])>0&&!W.quests.some(q=>q.giver===n.id)&&W.quests.length<QMAX}
// v127: genQuest nie może się wysypać — wtedy NPC „miał zadanie”, ale okno się nie otwierało
function genQuest(n){try{return genQuest0(n)}catch(err){console.warn('genQuest',err);const v=villages.get(n.vid)||{lvl:1,id:n.vid,name:'osada',race:n.race,b:2},cnt=W.qdone[n.id]||0,et=(BIOME_E[v.b]||['wilk'])[0];
  return{id:n.id+'#'+cnt,giver:n.id,gname:n.name,vid:v.id,vname:v.name,race:v.race||n.race,type:'kill',lvl:v.lvl||1,have:0,done:false,et,n:6,title:'Polowanie: '+EDEF[et].n,desc:`${n.name} prosi o przetrzebienie stworzeń w okolicy. Ubij: ${EDEF[et].n} ×6.`,rw:{xp:45*(v.lvl||1),gold:9*(v.lvl||1),rep:18,item:false}}}}
const QLOST=[['Zgubiona sakwa','#c9a064'],['Rodowy amulet','#ffd34d'],['Porwany list','#f2ead8'],['Zaginiona kozica','#d8d0c0'],['Złamany miecz ojca','#b8c4d0']];
function landPts(r,v,n,d0,d1){const out=[];for(let k=0;k<n*8&&out.length<n;k++){const a=r()*6.283,d=d0+r()*(d1-d0),x=v.x+Math.cos(a)*d,z=v.z+Math.sin(a)*d;let h=null;try{h=colAt(x,z)}catch(_){}
  if(h!==null&&(h<WATER+0.3||(typeof wetAt==='function'&&wetAt(x,z,h))))continue;if(inVillage(x,z,8))continue;out.push([x,z,0])}while(out.length<n){const a=r()*6.283,d=d0+r()*(d1-d0);out.push([v.x+Math.cos(a)*d,v.z+Math.sin(a)*d,0])}return out}
function genQuest0(n){
  const v=villages.get(n.vid),cnt=W.qdone[n.id]||0,r=rngOf('q'+n.id+'#'+cnt),lvl=v.lvl;
  let type=rpick(r,n.role==='starszy'?['kill','boss','deliver','collect','clear','trophy','elite','rescue','lost','scout','defend','nest','night']:['kill','collect','deliver','clear','trophy','game','lost','scout','fish','defend','night']);
  /* v139: trudne zadania (★) — częściej u starszych i przy kolejnych zleceniach */if(r()<(n.role==='starszy'?0.38:0.2)+Math.min(0.2,cnt*0.03))type=rpick(r,n.role==='starszy'?['champion','cull','siege','bounty','deep','champion']:['cull','siege','champion']);
  const deepS=type==='deep'?[...structs.values()].filter(s=>s&&!s.friendly&&s.type!=='kurhan'&&s.type!=='wyspy'&&!/wysp/i.test(s.name||'')&&!W.opened[s.id]&&Math.hypot(s.x-v.x,s.z-v.z)>250&&Math.hypot(s.x-v.x,s.z-v.z)<1300).sort((a,b)=>(b.lvl||1)-(a.lvl||1))[0]:null;if(type==='deep'&&!deepS)type='champion';
  const tgtS=[...structs.values()].filter(s=>s&&s.type!=='kurhan'&&!s.friendly&&s.type!=='zamczysko'&&s.type!=='grota'&&!W.opened[s.id]&&Math.hypot(s.x-v.x,s.z-v.z)<500).sort((a,b)=>Math.hypot(a.x-v.x,a.z-v.z)-Math.hypot(b.x-v.x,b.z-v.z))[0];
  if(type==='clear'&&!tgtS)type='kill';
  const others=[...villages.values()].filter(o=>o&&o.id!==v.id&&o.npcs&&o.npcs.some(x=>x.role==='starszy')).sort((a,b)=>Math.hypot(a.x-v.x,a.z-v.z)-Math.hypot(b.x-v.x,b.z-v.z));
  if(type==='deliver'&&!others.length)type='kill';
  const q={id:n.id+'#'+cnt,giver:n.id,gname:n.name,vid:v.id,vname:v.name,race:v.race,type,lvl,have:0,done:false};
  const types=(BIOME_E[v.b]||['slime','wilk','goblin']).filter(t=>EDEF[t]&&!EDEF[t].boss&&!EDEF[t].giant&&!EDEF[t].swim);if(!types.length)types.push('wilk');
  const gameT=(BIOME_P[v.b]||['jelen','dzik','krolik']).filter(t=>EDEF[t]&&!EDEF[t].swim);if(!gameT.length)gameT.push('krolik');
  if(type==='nest'&&!NESTS.size)type='trophy';
  if(type==='champion'){const big=types.filter(t=>!EDEF[t].passive&&(EDEF[t].hp||0)>=(EDEF[types[0]].hp||0)*0.8);q.et=rpick(r,big.length?big:types);const a=r()*6.28,d=130+r()*90;q.mark=[v.x+Math.cos(a)*d,v.z+Math.sin(a)*d];q.n=1;q.bname='Czempion '+rpick(r,['Żelazny Kieł','Pożeracz Tarcz','Stary Łamignat','Szara Śmierć','Krwawa Korona','Burzowy Ryk']);q.guards=2+Math.floor(r()*3);q.lvl=lvl+3;q.hard=1;q.title='★ '+q.bname;q.desc=`Na ${dirName(q.mark[0]-v.x,q.mark[1]-v.z)} od osady zebrała się sfora: ${q.bname} (${EDEF[q.et].n}, poziom wyższy o 3) i ${q.guards} elitarnych strażników. Pokonaj czempiona.`;type=q.type='boss'}
  else if(type==='cull'){q.et=rpick(r,types);q.n=20+Math.floor(r()*11);q.hard=1;q.title='★ Plaga: '+EDEF[q.et].n;q.desc=`${EDEF[q.et].n} rozmnażają się bez opamiętania i niszczą okolicę. ${n.name} prosi o wybicie ${q.n} sztuk.`;type=q.type='kill'}
  else if(type==='siege'){q.n=12+Math.floor(r()*6);q.mark=[v.x,v.z];q.hard=1;q.title='★ Nocne oblężenie: '+v.name;q.desc=`Po zmroku bestie szturmują ${v.name}. Pokonaj ${q.n} wrogów w promieniu 200 m od osady, między zmierzchem a świtem.`}
  else if(type==='bounty'){q.n=1;q.hard=1;q.title='★ Łowca głów';q.desc=`${n.name} wyznaczył nagrodę za głowę potwora. Pokonaj dowolnego bossa lochu albo olbrzyma.`}
  else if(type==='deep'){q.sid=deepS.id;q.mark=[deepS.x,deepS.z];q.n=1;q.lvl=Math.max(lvl+2,deepS.lvl||1);q.hard=1;q.title='★ Wyprawa: '+deepS.name;q.desc=`Daleko na ${dirName(deepS.x-v.x,deepS.z-v.z)} leży ${deepS.name.toLowerCase()}. ${n.name} prosi o jej oczyszczenie — pokonaj strażników i otwórz skrzynię. Wyprawa jest niebezpieczna.`;type=q.type='clear'}
  if(type==='trophy'){q.et=rpick(r,types);const TR={wilk:'Wilcze kły',goblin:'Goblińskie uszy',szkielet:'Stare kości',pajak:'Pajęcze gruczoły',slime:'Galareta szlamu',niedzwiedz:'Niedźwiedzie pazury'};q.item=TR[q.et]||(EDEF[q.et].n+' — trofea');q.n=4+Math.floor(r()*3);q.title='Trofea: '+q.item;q.desc=`${n.name} skupuje trofea. Przynieś: ${q.item} ×${q.n} (wypadają z: ${EDEF[q.et].n}, nie z każdego).`}
  else if(type==='game'){q.et=rpick(r,gameT);q.n=3+Math.floor(r()*3);q.title='Zwierzyna: '+EDEF[q.et].n;q.desc=`Spiżarnia świeci pustkami. ${n.name} prosi o upolowanie: ${EDEF[q.et].n} ×${q.n}.`;type=q.type='kill'}
  else if(q.hard){}
  else if(type==='elite'){q.n=2+Math.floor(r()*2);q.title='Pogromca elit';q.desc=`${n.name} słyszy o groźnych, wyjątkowych bestiach. Pokonaj ${q.n} elitarne lub rzadkie (★) stwory gdziekolwiek.`}
  else if(type==='night'){q.n=5+Math.floor(r()*4);q.title='Nocna warta';q.desc=`Nocą coś wychodzi z ciemności. Pokonaj ${q.n} wrogów między zmierzchem a świtem.`}
  else if(type==='defend'){q.n=8+Math.floor(r()*5);q.mark=[v.x,v.z];q.title='Obrona okolicy: '+v.name;q.desc=`Bestie podchodzą coraz bliżej osady. Pokonaj ${q.n} dowolnych wrogów w promieniu 180 m od ${v.name}.`}
  else if(type==='fish'){q.n=4+Math.floor(r()*4);q.title='Ryby dla osady';q.desc=`${n.name} potrzebuje świeżych ryb. Złów ${q.n} ryb (wędka: kupiec lub port, klawisz U nad wodą).`}
  else if(type==='nest'){q.n=1;q.title='Zniszcz gniazdo';q.desc=`W okolicy gnieżdżą się bestie. Zniszcz dowolne gniazdo stworów (stosy gałęzi z jajami).`}
  else if(type==='lost'){const L=rpick(r,QLOST);q.item=L[0];q.col=L[1];q.n=1;q.pts=landPts(r,v,1,70,130);q.mark=[q.pts[0][0],q.pts[0][1]];q.title='Zguba: '+q.item;q.desc=`${n.name} zgubił(a) coś cennego: ${q.item}. Ostatnio widziane na ${dirName(q.mark[0]-v.x,q.mark[1]-v.z)} od osady — szukaj świecącego znaku.`;type=q.type='collect'}
  else if(type==='scout'){q.item='Punkt zwiadu';q.col='#8fd0ff';q.n=3;q.pts=landPts(r,v,3,80,160);q.title='Zwiad wokół: '+v.name;q.desc=`Straż chce wiedzieć, co dzieje się wokół osady. Dotrzyj do 3 punktów zwiadu (świecące znaki).`;type=q.type='collect'}
  else if(type==='rescue'){const a=r()*6.28,d=80+r()*50;q.et=types.includes('bandyta')?'bandyta':rpick(r,types);q.mark=[v.x+Math.cos(a)*d,v.z+Math.sin(a)*d];q.n=1;q.bname='Porywacz '+rpick(r,['Szczurzy Pysk','Rudy Wąs','Bezzębny','Kruczy Łeb']);q.title='Ratunek';q.desc=`Ktoś z osady został porwany. ${q.bname} (${EDEF[q.et].n}) przetrzymuje jeńca na ${dirName(q.mark[0]-v.x,q.mark[1]-v.z)}. Pokonaj go.`;q.lvl=lvl+1;type=q.type='boss'}
  else if(type==='kill'){q.et=rpick(r,types);q.n=6+Math.floor(r()*6);q.title='Polowanie: '+EDEF[q.et].n;q.desc=`${n.name} prosi o przetrzebienie stworzeń w okolicy. Ubij: ${EDEF[q.et].n} ×${q.n}.`}
  else if(type==='collect'){const c=COLLECT[v.b]||COLLECT[2];q.item=c[0];q.col=c[1];q.n=5;q.pts=landPts(r,v,5,45,100);q.title='Zbieranie: '+q.item;q.desc=`${n.name} potrzebuje: ${q.item} ×5. Rosną w okolicy osady, świecą z daleka.`}
  else if(type==='deliver'){const o=others[Math.min(others.length-1,Math.floor(r()*Math.min(2,others.length)))],tn=o.npcs.find(x=>x.role==='starszy');q.to=tn.id;q.toName=tn.name;q.toVid=o.id;q.toV=o.name;q.mark=[o.x,o.z];q.n=1;q.title='Przesyłka do: '+o.name;q.desc=`Zanieś list od ${n.name} do ${tn.name} w osadzie ${o.name}.`}
  else if(type==='clear'){q.sid=tgtS.id;q.mark=[tgtS.x,tgtS.z];q.n=1;q.lvl=tgtS.lvl;q.title='Oczyść: '+tgtS.name;q.desc=`${n.name} prosi o rozprawienie się z zagrożeniem: ${tgtS.name.toLowerCase()} niedaleko osady. Pokonaj strażników i otwórz skrzynię.`}
  else {q.et=rpick(r,types);const a=r()*6.28,d=75+r()*45;q.mark=[v.x+Math.cos(a)*d,v.z+Math.sin(a)*d];q.n=1;q.bname='Herszt '+rpick(r,['Kłoponóg','Szczerbaty','Krwawy Kieł','Kamienne Oko','Czarny Pazur','Ostatni Wyjec']);q.title='Łowy na herszta';q.desc=`Groźny przywódca stworzeń, ${q.bname} (${EDEF[q.et].n}), grasuje niedaleko osady. Pokonaj go.`;q.lvl=lvl+1}
  const mult=q.hard?({boss:3,kill:2.2,siege:2.4,bounty:3.2,clear:2.6}[type]||2.5):({kill:1,collect:0.9,deliver:1.1,boss:1.8,clear:1.5,trophy:1.1,elite:1.7,night:1.2,defend:1.3,fish:0.9,nest:1.4}[type]||1);
  q.rw={xp:Math.round(45*lvl*mult),gold:Math.round(9*lvl*mult),rep:Math.round(18*mult),item:!!q.hard||type==='boss'||r()<0.35};
  return q;
}
// ===== współdzielone zadania w co-op: przyjęcie, postęp, porzucenie i ukończenie trafiają do wszystkich graczy =====
const qNet=(o)=>{if(NET.role!=='off')sendFx(o)};

function qApplyDone(q){if(!q.done&&q.have>=q.n){q.done=true;toast('Zadanie wykonane: '+q.title+' — wróć do: '+q.gname,'#ffd34d')}}
FXH.luck=m=>{luckFx(m.p[0],m.p[1],m.p[2],m.ry);if(Math.hypot(m.p[0]-player.p.x,m.p[2]-player.p.z)<18){LUCK.t=Math.max(LUCK.t,60);toast('🎉 '+(m.nm||'Kompan')+' dzieli się szczęściem: +10% krytyków i lepsze łupy przez 60 s','#ffd34d')}};
FXH.qadd=m=>{if(!m.q||W.quests.some(q=>q.id===m.q.id))return;W.quests.push(JSON.parse(JSON.stringify(m.q)));saveW();renderJournalIfOpen();toast((m.nm||'Kompan')+' przyjął(a) zadanie: '+m.q.title,'#ffd34d')};
FXH.qinc=m=>{const q=W.quests.find(q=>q.id===m.id);if(!q||q.done)return;q.have=Math.min(q.n,q.have+(m.by||1));if(m.pt!=null&&q.pts&&q.pts[m.pt])q.pts[m.pt][2]=1;toast(q.title+': '+q.have+'/'+q.n+' ('+(m.nm||'kompan')+')','#d8d8d8');qApplyDone(q);saveW();renderJournalIfOpen()};
FXH.qdone=m=>{const q=W.quests.find(q=>q.id===m.id);if(!q||q.done)return;q.have=q.n||1;q.done=true;toast('Zadanie wykonane: '+q.title+' — wróć do: '+q.gname,'#ffd34d');saveW();renderJournalIfOpen()};
FXH.qdel=m=>{const i=W.quests.findIndex(q=>q.id===m.id);if(i<0)return;const q=W.quests[i];W.quests.splice(i,1);saveW();renderJournalIfOpen();toast((m.nm||'Kompan')+' porzucił(a) zadanie: '+q.title,'#ff8a7a')};
FXH.qfin=m=>{const q=W.quests.find(q=>q.id===m.id);if(!q)return;W.quests.splice(W.quests.indexOf(q),1);W.qdone[q.giver]=(W.qdone[q.giver]||0)+1;addRep(q.race,m.gen?q.rw.rep*2:q.rw.rep);if(!m.gen){INV.gold+=q.rw.gold}gainXp(q.rw.xp);
  if(q.rw.item&&!m.gen){const it=genItem(q.lvl+(q.hard?2:0),q.hard?45:20);if(INV.bag.length<bagN()){INV.bag.push(it);toast(it.name,RAR[it.rar].c)}}toast('Wspólne zadanie ukończone ('+(m.nm||'kompan')+'): '+q.title+(m.gen?'':' · +'+q.rw.gold+' złota'),'#ffd34d');saveInv();saveW();updHud();renderJournalIfOpen()};
FXH.qall=m=>{let ch=0;for(const q of m.qs||[]){const o=W.quests.find(x=>x.id===q.id);if(!o){if(!(W.qdoneIds||{})[q.id]){W.quests.push(JSON.parse(JSON.stringify(q)));ch=1}}else{if(q.have>o.have){o.have=q.have;ch=1}if(q.done&&!o.done){o.done=true;ch=1}if(q.pts&&o.pts)q.pts.forEach((pt,i)=>{if(pt[2]&&o.pts[i]&&!o.pts[i][2]){o.pts[i][2]=1;ch=1}})}}if(ch){saveW();renderJournalIfOpen();toast('Zadania zsynchronizowane z drużyną','#ffd34d')}};
function questInc(q,by){q.have=Math.min(q.n,q.have+(by||1));qNet({k:'qinc',id:q.id,by:by||1,nm:S.name});if(q.have>=q.n){q.done=true;toast('Zadanie wykonane: '+q.title+' — wróć do: '+q.gname,'#ffd34d')}else toast(q.title+': '+q.have+'/'+q.n,'#d8d8d8');saveW();renderJournalIfOpen()}
function questKill(L){
  for(const q of W.quests){if(q.done)continue;
    if(q.type==='kill'&&L.et===q.et){q.have++;qNet({k:'qinc',id:q.id,by:1,nm:S.name});if(q.have>=q.n){q.done=true;toast('Zadanie wykonane: '+q.title+' — wróć do: '+q.gname,'#ffd34d')}else toast(q.title+': '+q.have+'/'+q.n,'#d8d8d8')}
    if(q.type==='boss'&&L.qid===q.id){q.have=1;q.done=true;qNet({k:'qdone',id:q.id});toast((q.title==='Ratunek'?'Jeniec uwolniony!':'Herszt pokonany!')+' Wróć do: '+q.gname,'#ffd34d')}
    const pas=EDEF[L.et]&&EDEF[L.et].passive;let inc=0;
    if(q.type==='trophy'&&L.et===q.et&&Math.random()<0.6)inc=1;
    if(q.type==='elite'&&L.el)inc=1;
    if(q.type==='night'&&!pas&&(hour<5.5||hour>20.5))inc=1;
    if(q.type==='defend'&&!pas&&Math.hypot(L.p[0]-q.mark[0],L.p[2]-q.mark[1])<180)inc=1;
    if(q.type==='siege'&&!pas&&(hour<5.5||hour>20.5)&&Math.hypot(L.p[0]-q.mark[0],L.p[2]-q.mark[1])<200)inc=1;
    if(q.type==='bounty'&&EDEF[L.et]&&(EDEF[L.et].boss||EDEF[L.et].giant))inc=1;
    if(inc)questInc(q)}
  const v=inVillage(L.p[0],L.p[2],75);if(v&&(!W.flags['prot'+v.id]||Date.now()-W.flags['prot'+v.id]>20000)){W.flags['prot'+v.id]=Date.now();addRep(v.race,1,true)}
  saveW();renderJournalIfOpen();
}
const qPick=[];let qspawnT=0;
function questTick(dt){
  // znajdźki do zbierania
  for(const q of W.quests){if(q.type!=='collect'||q.done)continue;
    q.pts.forEach((pt,i)=>{const key=q.id+':'+i;let o=qPick.find(x=>x.key===key);
      if(pt[2]){if(o){scene.remove(o.m);qPick.splice(qPick.indexOf(o),1)}return}
      const d=Math.hypot(pt[0]-player.p.x,pt[1]-player.p.z);
      if(!o&&d<S.rd*C){const h=colAt(pt[0],pt[1]);if(h===null)return;const m=new THREE.Mesh(boxes([[0,0.25,0,0.1,0.5,0.1,'#3c7a2e'],[0,0.55,0,0.4,0.3,0.4,q.col],[0.2,0.35,0,0.25,0.12,0.25,'#4f9a3e']]),new THREE.MeshLambertMaterial({vertexColors:true,emissive:new THREE.Color(q.col),emissiveIntensity:0.5}));const b=new THREE.Mesh(new THREE.BoxGeometry(0.06,2.5,0.06),new THREE.MeshBasicMaterial({color:q.col,transparent:true,opacity:0.5}));b.position.y=1.6;m.add(b);m.position.set(pt[0],h,pt[1]);scene.add(m);o={key,m};qPick.push(o)}
      if(o&&d<1.6&&!P2.dead){pt[2]=1;q.have++;qNet({k:'qinc',id:q.id,by:1,pt:i,nm:S.name});scene.remove(o.m);qPick.splice(qPick.indexOf(o),1);toast(q.item+': '+q.have+'/'+q.n,q.col);if(q.have>=q.n){q.done=true;toast('Zebrane! Wróć do: '+q.gname,'#ffd34d')}saveW();renderJournalIfOpen()}});
  }
  for(let i=qPick.length-1;i>=0;i--){const o=qPick[i];o.m.rotation.y+=dt;if(!W.quests.some(q=>o.key.startsWith(q.id+':'))){scene.remove(o.m);qPick.splice(i,1)}}
  // herszt: poproś hosta o pojawienie się, gdy jesteś blisko
  qspawnT-=dt;
  for(const q of W.quests){if(q.type!=='boss'||q.done||qspawnT>0)continue;
    if(Math.hypot(q.mark[0]-player.p.x,q.mark[1]-player.p.z)<55&&![...enemies.values()].some(e=>e.qid===q.id)){qspawnT=4;const def={id:q.id,et:q.et,lvl:q.lvl,x:q.mark[0],z:q.mark[1],name:q.bname,guards:q.guards||0};
      if(isAuth())spawnQuestBoss(def);else NET.tr.send({t:'qspawn',from:NET.id,def})}}
}
function spawnQuestBoss(def){
  if([...enemies.values()].some(e=>e.qid===def.id))return;
  let x=def.x,z=def.z,h=colAt(x,z);
  for(let i=0;i<24&&(h===null||h<WATER);i++){x=def.x+Math.cos(i)*i;z=def.z+Math.sin(i)*i;h=colAt(x,z)}
  if(h===null||h<WATER)return;
  const qlv=Math.max(def.lvl,partyLvlAt(x,z)+1),d0=EDEF[def.et]||EDEF.wilk,max=Math.round(HPM*d0.hp*(1+0.38*(qlv-1))*5);
  const e={id:eSeq++,t:def.et,lvl:qlv,elite:true,p:new THREE.Vector3(x,h,z),vx:0,vz:0,ry:0,hp:max,max,st:0,cd:0,wind:0,tgt:null,prov:0,wan:null,dieT:0,flash:0,speed:0,qid:def.id,qn:def.name};
  addEnemyModel(e);enemies.set(e.id,e);
  /* v139: czempion ma elitarnych strażników */for(let g=0;g<(def.guards||0);g++){const a=g/(def.guards)*6.28,gx=x+Math.cos(a)*4,gz=z+Math.sin(a)*4,gh=colAt(gx,gz);if(gh===null||gh<WATER)continue;const gl=qlv-1,gm=Math.round(HPM*d0.hp*(1+0.38*(gl-1))*1.8);const ge={id:eSeq++,t:def.et,lvl:gl,elite:true,p:new THREE.Vector3(gx,gh,gz),vx:0,vz:0,ry:a,hp:gm,max:gm,st:0,cd:0,wind:0,tgt:null,prov:0,wan:null,dieT:0,flash:0,speed:0,qg:def.id};addEnemyModel(ge);enemies.set(ge.id,ge)}
}

// ---------- dialogi ----------
let dlg=null;
function closeDialog(){dlg=null;$('dlg').hidden=true}
function openDialog(n){dlg={n};try{document.exitPointerLock()}catch(e){}dlgRoot()}
function dlgShow(text,opts){
  const n=dlg.n,t=tierOf(W.rep[n.race]);
  $('dlgname').textContent=n.name;$('dlgrole').textContent=n.roleN+' · '+RACES[n.race].n+' · ';const s=document.createElement('span');s.textContent=TIERS[t][1]+' ('+Math.round(W.rep[n.race])+')';s.style.color=TIERS[t][2];$('dlgrole').appendChild(s);
  $('dlgtext').textContent=text;dlg.opts=opts;
  $('dlgopts').innerHTML=opts.map((o,i)=>`<button data-o="${i}" ${o[2]?'disabled':''}><kbd>${i+1}</kbd> ${esc(o[0])}</button>`).join('');$('dlg').hidden=false;/* v140: kursor widoczny w rozmowie */try{if(document.pointerLockElement)document.exitPointerLock()}catch(_){}
}
$('dlgopts').onclick=e=>{const b=e.target.closest('[data-o]');if(b&&dlg)dlg.opts[+b.dataset.o][1]()};
function greet(n){const t=tierOf(W.rep[n.race]),R=RACES[n.race],r=rngOf('g'+n.id+Math.floor(Date.now()/60000));
  return [['Odejdź. Nie chcemy tu takich jak ty.'],['Czego chcesz? Mów szybko.','Mam na ciebie oko, obcy.'],[R.neutral,'Witaj, wędrowcze.','Bezpiecznej drogi. Czym mogę służyć?'],['O, znowu ty! Miło cię widzieć.','Witaj, przyjacielu.'],['Nasz obrońca! Zawsze jesteś tu mile widziany.'],['To zaszczyt, że do nas zaglądasz, bohaterze!']][t].map(x=>x)[Math.floor(r()*([1,2,3,2,1,1][t]))]}
const bye=['Do widzenia.',closeDialog];

function portList(){return [...villages.values()].filter(v=>v&&v.city&&v.pier&&W.seen[v.id])}
function dlgFerry(){const here=dlg.n,me=villages.get(here.vid),L=portList().filter(v=>v!==me);const o=L.slice(0,8).map(v=>{const d=Math.hypot(v.x-player.p.x,v.z-player.p.z),pr=Math.round(20+d/18);return[`${v.name} (${Math.round(d)} kroków) — ${pr} zł`,()=>{if((INV.gold||0)<pr)return dlgRoot('Na prom brakuje ci złota.');INV.gold-=pr;saveInv();updHud();closeDialog();ferryTo(v)}]});
  o.unshift(['⚓ Wyprawa na wyspę z lochami…',()=>dlgExpedition()]);
  if(o.length<2)return dlgShow('Nie znam jeszcze innych portów, do których mógłbyś popłynąć promem. Mogę ci jednak sprzedać mapę wysp.',[o[0],['Wróć.',()=>dlgRoot()]]);o.push(['Wróć.',()=>dlgRoot()]);dlgShow('Prom odpływa, kiedy tylko zechcesz. Dokąd płyniemy?',o)}
const ISLE={list:[],cb:null};function isleQuery(cb){ISLE.cb=cb;const w=workers[0];w.busy++;w.postMessage({type:'isl',seed:S.seed,x:player.p.x,z:player.p.z,sx:S.spawn[0],sz:S.spawn[2]})}
// wyprawa: kapitan wskazuje najbliższą wyspę z lochami — oznaczenie na mapie dla całej drużyny, płyniecie łodzią (B), dwuosobowa łódź mieści kompana
function dlgExpedition(){isleQuery(list=>{if(!list.length)return dlgShow('Nie słyszałem o żadnej wyspie z lochami w tej okolicy. Popytaj w innym porcie.',[['Wróć.',()=>dlgRoot()]]);
  const o=list.slice(0,4).map(([x,z])=>{const d=Math.hypot(x-player.p.x,z-player.p.z),cost=Math.round(30+d/40);return[`Wyspa ${Math.round(d)} kroków stąd (${dirName(x-player.p.x,z-player.p.z)}) — mapa za ${cost} zł`,()=>{if((INV.gold||0)<cost)return dlgRoot('Za mało złota na mapę.');INV.gold-=cost;saveInv();updHud();
    const n={id:'isl'+Math.round(x)+'_'+Math.round(z),x:Math.round(x),z:Math.round(z),ic:'⚓',txt:'Wyspa z lochami',col:'#4ac8ff',by:S.name};noteAdd(n,true);toast('⚓ Wyspa zaznaczona na mapie. Zwoduj łódź (B) — kompan może się dosiąść jako pasażer.','#4ac8ff');closeDialog()}]});
  o.push(['Wróć.',()=>dlgRoot()]);dlgShow('Za morzem leżą wyspy, na których stoją stare lochy — pełne skarbów i potworów. Sprzedam ci mapę, a łódź zwodujesz sam.',o)})}
function dirName(dx,dz){const a=(Math.atan2(dx,-dz)*180/Math.PI+360)%360;return['północ','północny wschód','wschód','południowy wschód','południe','południowy zachód','zachód','północny zachód'][Math.round(a/45)%8]}
function ferryTo(v){if(VH.mode===1)exitBoat();const ps=[[0,-1],[0,1],[-1,0],[1,0]][v.port],d=v.Hs-8,x=v.x+ps[0]*d,z=v.z+ps[1]*d;player.p.set(x,(colAt(x,z)??v.h)+1.2,z);player.v.set(0,0,0);camY=null;holdIfUnloaded();toast('⛵ Prom przybija do portu: '+v.name,'#cfe8ff');sfx('splash',0.6);for(const f of FOL)f.p.set(x+1.5,player.p.y,z+1.5);if(PET)PET.p.set(x-1.5,player.p.y,z-1.5)}
function buyRod(){if(INV.rod)return dlgRoot();if((INV.gold||0)<40)return dlgRoot('Wędka kosztuje 40 złota.');INV.gold-=40;INV.rod=1;saveInv();updHud();sfx('coin');dlgRoot('Proszę, wędka. Stań nad wodą albo w łodzi i naciśnij U, żeby zarzucić.')}
function dlgRoot(msg){
  if(dlg.n&&dlg.n.pret)return dlgPret(dlg.n);
  const n=dlg.n,t=tierOf(W.rep[n.race]),opts=[];
  if(t===0){dlgShow(greet(n),[bye]);return}
  const dq=W.quests.find(q=>q.type==='deliver'&&q.to===n.id&&!q.done);
  if(dq)opts.push(['Mam dla ciebie list od: '+dq.gname,()=>{dq.done=true;finishQuest(dq,n,false)}]);
  const mine=W.quests.find(q=>q.giver===n.id);
  if(mine&&mine.done)opts.push(['Zadanie wykonane.',()=>dlgReward(mine)]);
  else if(mine)opts.push(['O moim zadaniu…',()=>dlgShow(mine.desc+(mine.n>1?` Postęp: ${mine.have}/${mine.n}.`:''),[['Porzucam to zadanie.',()=>{qNet({k:'qdel',id:mine.id,nm:S.name});W.quests.splice(W.quests.indexOf(mine),1);addRep(n.race,-3);saveW();dlgRoot(n.fem?'Szkoda. Myślałam, że można na tobie polegać.':'Szkoda. Myślałem, że można na tobie polegać.')}],['Wracam do pracy.',()=>dlgRoot()]])]);
  if(canOfferQuest(n))opts.push(['Masz dla mnie jakieś zadanie?',()=>dlgOffer()]);
  else if(n.qg&&!mine&&W.quests.length>=QMAX)opts.push(['Masz dla mnie jakieś zadanie?',()=>dlgShow('Widzę, że masz pełne ręce roboty ('+W.quests.length+' zadań). Ukończ albo porzuć któreś w dzienniku (J), wtedy wróć.',[['Dobrze.',()=>dlgRoot()]])]);
  if(n.role==='krol'){const v=villages.get(n.vid),kn=(v&&v.name)||'miasta',kk=v&&kingdomAtM?kingdomAtM(v.x,v.z,true):null,realm=kk&&kk.name?kk.name:'królestwo '+kn;W.oath=W.oath||{};
    opts.unshift(['Wasza Wysokość… (pokłoń się)',()=>dlgShow(`Witaj w ${realm}. ${n.fem?'Moje':'Moje'} miasto ${kn} pamięta tych, którzy mu służą. Mów, czego chcesz od korony.`,[['Opowiedz o królestwie.',()=>dlgShow(rpick(rngOf('kr'+Date.now()),[`Granice ${realm} sięgają dalej, niż sięga wzrok z najwyższej wieży. Na rubieżach grasują bandy — korona płaci za każdą rozbitą.`,`Nasi przodkowie wznieśli te mury z kamienia wydobytego w górach. Póki stoją, ${kn} nie upadnie.`,`Na arenie walczą najlepsi z całego królestwa. Zwycięzcy turnieju zasiadają przy moim stole.`]),[['Dziękuję, Wasza Wysokość.',()=>dlgRoot()]])],
      ...(W.oath[n.vid]?[]:[['Przysięgam wierność koronie.',()=>{W.oath[n.vid]=Date.now();addRep(n.race,12);INV.gold+=150;saveInv();saveW();updHud();sfx('cheer',0.5);toast('Złożyłeś przysięgę wierności. +150 zł, reputacja wśród: '+RACES[n.race].n,'#ffd34d');dlgRoot('Powstań, rycerzu '+kn+'. Od dziś drzwi zamku stoją przed tobą otworem.')}]]),
      ['Wrócę później.',()=>dlgRoot()]])])}
  if(n.trav)opts.push(...dlgTrav(n));
  if(n.role==='kupiec')opts.push(['Pokaż towary.',()=>dlgShop()],['Chcę coś sprzedać.',()=>dlgSell()],['Na czym tu można zarobić w handlu?',()=>dlgShow(tradeRumor(n),[['Dzięki, pokaż towary.',()=>dlgShop()],['Wróć.',()=>dlgRoot()]])]);if(n.role==='kupiec'&&(!n.trav||n.kind==='karawana'))opts.push([n.trav?'Sprzedacie zwierzę juczne lub wierzchowca?':'Chcę kupić wierzchowca.',()=>dlgMounts()]);
  if(n.role==='kowal')opts.push(['Ulepsz mój ekwipunek.',()=>dlgSmith()]);
  if(n.role==='starszy'){try{opts.push(...dlgVillageSvc(n))}catch(_){}opts.push(['📜 Tablica zleceń drużynowych',()=>dlgBoard()]);opts.push([myHome()?'🏠 O moim domu…':'🏠 Chcę kupić działkę i dom',()=>dlgBuyHome()])}
  if(n.role==='kupiec'&&!n.trav){const vv=villages.get(n.vid);if(vv&&vv.city)opts.push(['🐎 Dyliżans do innego miasta',()=>dlgCoach()]);if(!PRZ.warm)opts.push(['Ciepły płaszcz podróżny — 60 zł (chroni przed zimnem)',()=>{if((INV.gold||0)<60)return dlgRoot('Płaszcz kosztuje 60 złota.');INV.gold-=60;PRZ.warm=1;przSave();saveInv();updHud();sfx('coin');dlgRoot('Ciepły i porządny. Zima ci niestraszna.')}])}
  if(n.role==='portowy')opts.push(['Chcę popłynąć promem.',()=>dlgFerry()],[MNT.sail?'(Twoja łódź ma już żagiel)':'Żagiel do mojej łodzi — 900 zł',()=>{if(MNT.sail)return dlgRoot();if((INV.gold||0)<900)return dlgRoot('Żagiel kosztuje 900 złota.');INV.gold-=900;MNT.sail=1;LS.set('mounts',MNT);saveInv();updHud();sfx('coin');dlgRoot('Dobry wiatr! Twoja łódź pływa teraz o połowę szybciej.')}],[INV.rod?'(Masz już wędkę)':'Wędka — 40 zł',()=>buyRod()]);
  if((n.role==='portowy'||n.role==='kupiec')&&fishCount()>0)opts.push([`Sprzedaj ryby (${fishCount()} szt. — ${fishValue()} zł)`,()=>sellFish()]);
  if(n.role==='kupiec'&&!n.trav&&!INV.rod)opts.push(['Wędka — 40 zł',()=>buyRod()]);
  if(n.role==='wedr'&&!n.trav)opts.push(['Kim jesteś?',()=>dlgBeggar()]);
  if(n.role==='najemnik'){if(n.merc)opts.push([`Dołącz do mnie (${n.merc.lvl} poz., ${WEAP[n.merc.w].n.toLowerCase()}) — ${n.merc.price} zł`,()=>hireMerc(n)]);else opts.push(['Jak się sprawujesz?',()=>dlgShow('Służę już innemu. Ale dzięki za pamięć.',[bye])])}
  opts.push(['Co słychać w okolicy?',()=>dlgRumor()]);
  opts.push(bye);
  dlgShow(msg||greet(n),opts);
}
function dlgOffer(){
  const n=dlg.n,q=genQuest(n);
  dlgShow(q.desc+` Nagroda: ${q.rw.gold} złota, ${q.rw.xp} PD${q.rw.item?' i przedmiot':''}.`,[
    ['Zajmę się tym.',()=>{W.quests.push(q);qNet({k:'qadd',q,nm:S.name});saveW();toast('Nowe zadanie: '+q.title,'#ffd34d');dlgRoot('Dziękuję. Wracaj, gdy skończysz.')}],
    ['Zrobię to, ale za podwójną stawkę.',()=>{q.rw.gold=Math.round(q.rw.gold*1.6);q.rw.rep=Math.round(q.rw.rep/2);q.greedy=1;W.quests.push(q);qNet({k:'qadd',q,nm:S.name});addKarma(-1);addRep(n.race,-3);toast('Nowe zadanie: '+q.title,'#ffd34d');dlgRoot('Chciwość to ciężki grzech… Niech będzie.')}],
    ['Może później.',()=>dlgRoot()]]);
}
function dlgReward(q){
  const n=dlg.n;
  dlgShow(`Dobra robota! Obiecana nagroda: ${q.rw.gold} złota i ${q.rw.xp} PD${q.rw.item?', do tego przedmiot':''}.`,[
    ['Przyjmuję nagrodę.',()=>finishQuest(q,n,false)],
    ['Zatrzymajcie złoto dla wioski.',()=>finishQuest(q,n,true)]]);
}
function finishQuest(q,n,gen){
  qNet({k:'qfin',id:q.id,gen:!!gen,nm:S.name});W.qdoneIds=W.qdoneIds||{};W.qdoneIds[q.id]=1;W.quests.splice(W.quests.indexOf(q),1);W.qdone[q.giver]=(W.qdone[q.giver]||0)+1;
  const rep=gen?q.rw.rep*2:q.rw.rep;addRep(q.race,rep);if(gen)addKarma(3);else{INV.gold+=q.rw.gold;toast('+'+q.rw.gold+' złota','#ffd34d')}
  if(!q.greedy)addKarma(1);gainXp(q.rw.xp);
  if(q.rw.item){const it=genItem(q.lvl+(q.hard?2:0),q.hard?45:20);if(INV.bag.length<bagN()){INV.bag.push(it);toast(it.name,RAR[it.rar].c)}}
  saveInv();saveW();updHud();renderJournalIfOpen();
  dlgRoot(gen?'Twoja hojność nie zostanie zapomniana. Cała wioska będzie o tym mówić.':q.type==='deliver'?(n.fem?'List? Dziękuję, czekałam na wieści. Proszę, to za fatygę.':'List? Dziękuję, czekałem na wieści. Proszę, to za fatygę.'):'Należy ci się. Dziękujemy.');
}
function dlgRumor(){
  const n=dlg.n,v=villages.get(n.vid),R=RACES[n.race],r=rngOf('rum'+n.id+Math.floor(Date.now()/120000)),lines=[];
  if(!v)return dlgShow(rpick(r,R.rum),[['Wróć.',()=>dlgRoot()]]);
  lines.push(rpick(r,R.rum));
  const others=[...villages.values()].filter(o=>o&&o.id!==v.id).sort((a,b)=>Math.hypot(a.x-v.x,a.z-v.z)-Math.hypot(b.x-v.x,b.z-v.z));
  if(others.length){const o=others[0],a=Math.atan2(o.x-v.x,-(o.z-v.z)),dirs=['północ','północny wschód','wschód','południowy wschód','południe','południowy zachód','zachód','północny zachód'];
    lines.push(`Jakieś ${Math.round(Math.hypot(o.x-v.x,o.z-v.z)/10)*10} kroków stąd, w kierunku: ${dirs[(Math.round(a/(Math.PI/4))+8)%8]}, leży osada ${o.name} (${RACES[o.race].n}).`)}
  lines.push(`Stwory wokół osady ${v.name} są mniej więcej na poziomie ${v.lvl}.`);
  dlgShow(lines.join(' '),[['Dzięki.',()=>dlgRoot()],bye]);
}
function dlgBeggar(){
  const n=dlg.n,f='beg'+n.id;
  if(W.flags[f])return dlgShow(W.flags[f]===1?'Dzięki tobie zjadłem ciepły posiłek. Niech ci się szczęści.':'Idź swoją drogą.',[['Bywaj.',()=>dlgRoot()]]);
  dlgShow(n.fem?'Kiedyś byłam kupcową, ale bandyci zabrali mi wszystko. Nie masz paru monet dla starej wędrowczyni?':'Kiedyś byłem kupcem, ale bandyci zabrali mi wszystko. Nie masz paru monet dla starego wędrowca?',[
    ['Daj 10 złota.',()=>{if(INV.gold<10)return dlgShow('Sam nie masz grosza przy duszy… Rozumiem.',[['Przykro mi.',()=>dlgRoot()]]);INV.gold-=10;W.flags[f]=1;addKarma(2);addRep(n.race,6);saveInv();updHud();dlgRoot('Niech bogowie ci to wynagrodzą!')}],
    ['Nie mam nic.',()=>dlgRoot('Rozumiem… Bywaj.')],
    ['Idź do roboty, darmozjadzie!',()=>{W.flags[f]=2;addKarma(-2);addRep(n.race,-5);dlgRoot('…Pamiętaj, los lubi się odwracać.')}]]);
}
// sklep i kowal
const itemVal=it=>Math.round((10+it.lvl*8)*[1,2.6,6.5,16,42][it.rar||0]*(1+0.3*(it.up||0)));
const pmod=n=>PRICE[tierOf(W.rep[n.race])]*(hasP('handlarz')?0.85:1)*(Date.now()<FAIR.until?0.8:1)*(typeof vGrowMod==='function'?vGrowMod(n):1);
const SHOPST=new Map();function shopStock(n){const v=villages.get(n.vid),k=n.id+'|'+Math.floor(Date.now()/600000);let st=SHOPST.get(k);if(!st){st=(n.rare?[0,1,2,3,4,5]:[0,1,2,3]).map(i=>genItem(Math.max(v?v.lvl:1,HERO.lvl-1),n.rare?8:i===3?4:0));SHOPST.set(k,st);if(SHOPST.size>40)SHOPST.delete(SHOPST.keys().next().value)}return st}
// ===== okno handlu: towary kupca i plecak gracza jako siatki przedmiotów z ikonami 3D, jak w ekwipunku =====
let TRADE=null;
function shopOffers(n){const pm=pmod(n),st=shopStock(n),O=[];
  const bn=bagN();if(bn<60){const bc=Math.round(160*Math.pow((bn-24)/6,1.7)*pm);O.push({k:'bag',pr:bc,ic:'<span class="cic">🎒</span>',name:'Większy plecak',tip:`Plecak: ${bn} → ${bn+6} miejsc`})}
  const pot=Math.round(12*Math.max(1,HERO.lvl*0.6)*pm);O.push({k:'pot',pr:pot,ic:icHTML({base:'potion',rar:0}),name:'Mikstura leczenia',tip:`Leczy rany. Masz: ${INV.pot}`,cnt:'∞'});
  const v=villages.get(n.vid),fr=rngOf('food'+n.id+Math.floor(Date.now()/600000)),near=[...new Set([...(BIOME_P[v&&v.b]||[]),...VILLAGE_P,'kon','owca'])].map(t=>FOODOF[t]).filter(Boolean),others=Object.keys(FOODS).filter(k=>!near.includes(k));
  const sel=[...near.slice(0,4),rpick(fr,others),rpick(fr,others)].filter((k,i,a)=>a.indexOf(k)===i);
  for(const f of sel){const pr=Math.round(FOODS[f][2]*pm*(1+HERO.lvl*0.04));O.push({k:'food',f,pr,ic:icHTML({base:'food',var:f,rar:0}),name:foodName(f),tip:`Do oswajania: ${foodFor(f)}. Masz: ${INV.food[f]||0}`})}
  st.forEach(it=>O.push({k:'it',it,st,pr:Math.round(itemVal(it)*5*pm)}));return O}
function dlgShop(){tradeOpen(dlg.n,'buy')}
function tradeOpen(n,tab){TRADE={n,tab:tab||'buy'};closeDialog();$('tradeui').hidden=false;try{document.exitPointerLock()}catch(e){}tradeRender()}
function tradeClose(){TRADE=null;$('tradeui').hidden=true;$('itip').hidden=true}
function tradeRender(){if(!TRADE)return;const n=TRADE.n,pm=pmod(n);TRADE.off=shopOffers(n);
  const pg=(o,i)=>{const it=o.it,cant=INV.gold<o.pr;return `<button class="slot tslot r${it?it.rar:'x'}${cant?' dim':''}" data-tbuy="${i}">${it?icHTML(it)+`<small>${it.lvl}</small>`:o.ic+(o.cnt?'':'')}<em class="tpr">${o.pr} zł</em></button>`};
  const buy=TRADE.off.map(pg).join('');
  const sell=INV.bag.map((it,i)=>it?`<button class="slot tslot r${it.rar}" data-tsell="${i}">${icHTML(it)}<small>${it.lvl}${it.up?'+'+it.up:''}</small><em class="tpr">${Math.round(itemVal(it)*0.45/pm)} zł</em></button>`:'').join('');
  $('tradegold').textContent=INV.gold+' zł';$('tradename').textContent=(n.name||'Kupiec')+(pm<1?' · ceny dla przyjaciół':pm>1?' · ceny dla obcych':'');
  $('tradebuy').innerHTML=buy||'<p class="sub2">Kupiec nie ma nic na sprzedaż.</p>';$('tradesell').innerHTML=sell||'<p class="sub2">Twój plecak jest pusty.</p>';
  $('tradebag').textContent=`Plecak ${INV.bag.length}/${bagN()}`;try{goodsRender()}catch(e){console.warn('towary',e)}}
function tradeBuy(i){const o=TRADE&&TRADE.off[i];if(!o)return;if(INV.gold<o.pr)return toast('Za mało złota','#ff8a7a');
  if(o.k==='bag'){INV.gold-=o.pr;INV.bagN=bagN()+6;toast('Plecak powiększony: '+INV.bagN+' miejsc','#ffd34d')}
  else if(o.k==='pot'){INV.gold-=o.pr;INV.pot++;toast('Mikstura leczenia','#7dff8a')}
  else if(o.k==='food'){INV.gold-=o.pr;INV.food[o.f]=(INV.food[o.f]||0)+1;toast(foodName(o.f),'#d9a27c')}
  else if(o.k==='it'){if(INV.bag.length>=bagN())return toast('Plecak pełny','#ff8a7a');INV.gold-=o.pr;INV.bag.push(o.it);const j=o.st.indexOf(o.it);if(j>=0)o.st.splice(j,1);toast('Kupiono: '+o.it.name,RAR[o.it.rar].c)}
  sfx('coin');saveInv();updHud();tradeRender()}
function tradeSell(i){if(!TRADE)return;const it=INV.bag[i];if(!it)return;const pr=Math.round(itemVal(it)*0.45/pmod(TRADE.n));INV.bag.splice(i,1);INV.gold+=pr;sfx('coin');toast('Sprzedano: '+it.name+' (+'+pr+' zł)','#ffd34d');saveInv();updHud();tradeRender()}
$('tradebuy').onclick=e=>{const b=e.target.closest('[data-tbuy]');if(b)tradeBuy(+b.dataset.tbuy)};
/*TRADE2*/
$('tradesell').onclick=e=>{const b=e.target.closest('[data-tsell]');if(b)tradeSell(+b.dataset.tsell)};
$('tradeclose').onclick=()=>tradeClose();
function dlgSell(pg){tradeOpen(dlg.n,'sell')}

function dlgSmith(){
  const n=dlg.n,pm=pmod(n),opts=[];
  for(const [k,nm] of SLOTS){const it=INV.eq[k];if(!it)continue;const up=it.up||0;
    if(up>=10){opts.push([`${it.name} +10 — maksymalnie ulepszone`,()=>{},true]);continue}
    const cost=Math.round(25*it.lvl*Math.pow(up+1,1.5)*(it.rar+1)*0.6*pm);
    opts.push([`${it.name}${up?' +'+up:''} → +${up+1} — ${cost} zł`,()=>{if(INV.gold<cost)return toast('Za mało złota','#ff8a7a');INV.gold-=cost;it.up=up+1;afterInv();toast(it.name+' +'+it.up,RAR[it.rar].c);dlgSmith()}])}
  opts.push(['⚜ Zbroje frakcji (dla przyjaciół ludu)…',()=>dlgRaceArmor()]);
  opts.push(['🔥 Przetop zbędne łupy na materiały…',()=>dlgSalvage()],['⚒ Ulepsz za materiały (sztaby, esencja)…',()=>dlgUpMat()]);
  opts.push(['⚒ Przekuj przedmiot na wyższą rzadkość…',()=>dlgReforge()],['💎 Osadź klejnot…',()=>dlgGem()],['✨ Zaczaruj broń (ogień, wybuch, mróz, trucizna, burza)…',()=>dlgEnchant()]);
  opts.push(['Wróć.',()=>dlgRoot()]);
  dlgShow(`Każde ulepszenie to +10% obrażeń, obrony i zdrowia przedmiotu, do +10. Masz ${INV.gold} złota i ${matTxt()}.`,opts);
}
function dlgReforge(){const n=dlg.n,pm=pmod(n),opts=[];
  for(const [k] of SLOTS){const it=INV.eq[k];if(!it||it.base==='latarnia')continue;if(it.rar>=4){opts.push([`${it.name} — już legendarny`,()=>{},true]);continue}
    const cost=Math.round(60*it.lvl*Math.pow(it.rar+1,2)*pm);
    opts.push([`${it.name}: ${RAR[it.rar].n} → ${RAR[it.rar+1].n} — ${cost} zł`,()=>{if(INV.gold<cost)return toast('Za mało złota','#ff8a7a');INV.gold-=cost;it.rar++;for(const s of ['dmg','def','hp'])if(it[s])it[s]=+(it[s]*1.22).toFixed(1);sfx('lvl');afterInv();toast('Przekuto: '+it.name+' ('+RAR[it.rar].n+')',RAR[it.rar].c);dlgReforge()}])}
  opts.push(['Wróć.',()=>dlgSmith()]);dlgShow(`Przekucie podnosi rzadkość przedmiotu o jeden poziom i wzmacnia go o 22%. Wygląd broni też się zmienia. Masz ${INV.gold} złota.`,opts)}
function dlgGem(sel){const n=dlg.n,pm=pmod(n),opts=[];
  if(!sel){for(const [k,nm] of SLOTS){const it=INV.eq[k];if(!it||it.base==='latarnia')continue;opts.push([`${it.name}${it.gem?' (ma: '+GEMS[it.gem][0]+')':''}`,()=>dlgGem(k)])}opts.push(['Wróć.',()=>dlgSmith()]);return dlgShow('W który przedmiot osadzić klejnot? Przedmiot mieści jeden klejnot; nowy zastępuje stary.',opts)}
  const it=INV.eq[sel];const cost=Math.round(40*it.lvl*pm);
  for(const g in GEMS){const tmp={gem:g,lvl:it.lvl};opts.push([`${GEMS[g][0]}: ${gemTxt(tmp)} — ${cost} zł`,()=>{if(INV.gold<cost)return toast('Za mało złota','#ff8a7a');INV.gold-=cost;it.gem=g;sfx('coin');afterInv();toast(GEMS[g][0]+' osadzony w: '+it.name,GEMS[g][1]);dlgGem()}])}
  opts.push(['Wróć.',()=>dlgGem()]);dlgShow(`Wybierz klejnot dla: ${it.name}. Masz ${INV.gold} złota.`,opts)
}

// ---------- dziennik (zadania i renoma) ----------
let jtab='q';
function renderJournal(){
  $('jtabq').classList.toggle('pri',jtab==='q');$('jtabr').classList.toggle('pri',jtab==='r');
  if(jtab==='q'){$('jbody').innerHTML=W.quests.length?W.quests.map((q,i)=>`<div class="jq${q.done?' done':''}"><b>${esc(q.title)}</b><span>${esc(q.desc)}</span><span class="jm">${q.done?(q.type==='deliver'?'Dostarczone':'Gotowe — wróć do: '+esc(q.gname)+' ('+esc(q.vname)+')'):(q.n>1?'Postęp: '+q.have+'/'+q.n:'W toku')} · nagroda ${q.rw.gold} zł, ${q.rw.xp} PD</span>${q.done&&q.type==='deliver'?'':`<button data-tq="${i}">${trackedQ()===q?'✓ Śledzone':'Śledź'}</button>`}<button data-ab="${i}">Porzuć</button></div>`).join(''):'<p class="sub2">Brak zadań. Porozmawiaj z mieszkańcami wiosek — nad tymi, którzy mają zadanie, wisi wykrzyknik na mapie.</p>'}
  else{$('jbody').innerHTML=`<p>Tytuł: <b>${title()}</b> · Karma: ${W.karma} · Sława: ${W.fame}</p>`+Object.entries(RACES).map(([k,R])=>{const v=W.rep[k]||0,t=tierOf(v);return `<div class="jr"><span>${R.n}</span><i><b style="width:${Math.max(0,Math.min(100,(v+100)/400*100))}%;background:${TIERS[t][2]}"></b></i><span style="color:${TIERS[t][2]}">${TIERS[t][1]} (${Math.round(v)})</span></div>`}).join('')+'<p class="sub2">Renomę zdobywasz zadaniami, obroną wiosek i dobrymi uczynkami. Chciwość i okrucieństwo ją obniżają. Wyższa renoma to lepsze ceny; przy „Wrogi” mieszkańcy nie chcą z tobą rozmawiać.</p>'}
}
function renderJournalIfOpen(){if(!$('journal').hidden)renderJournal()}
function toggleJournal(){const j=$('journal');j.hidden=!j.hidden;if(!j.hidden){try{document.exitPointerLock()}catch(e){}renderJournal()}}
$('jbody').onclick=e=>{{const t=e.target.closest('[data-tq]');if(t){const q=W.quests[+t.dataset.tq];if(q){W.trackQ=q.id;saveW();qtrT=0;renderJournal()}return}}const b=e.target.closest('[data-ab]');if(!b)return;const q=W.quests[+b.dataset.ab];qNet({k:'qdel',id:q.id,nm:S.name});W.quests.splice(+b.dataset.ab,1);addRep(q.race,-3);saveW();renderJournal()};
$('jtabq').onclick=()=>{jtab='q';renderJournal()};$('jtabr').onclick=()=>{jtab='r';renderJournal()};$('jclose').onclick=toggleJournal;$('jbtn').onclick=toggleJournal;
/* v138: śledzone zadanie pod nazwą biomu — postęp i strzałka kierunku */
function qTarget(q){if(q.done){if(q.type==='deliver')return null;const v=villages.get(q.vid);return v?[v.x,v.z,'Wróć do: '+q.gname]:null}
  if(q.pts){let b=null,bd=1e9;for(const p of q.pts){if(p[2])continue;const d=Math.hypot(p[0]-player.p.x,p[1]-player.p.z);if(d<bd){bd=d;b=p}}if(b)return[b[0],b[1],null]}
  if(q.mark)return[q.mark[0],q.mark[1],null];return null}
function trackedQ(){if(!W||!W.quests||!W.quests.length)return null;const vis=W.quests.filter(q=>!(q.done&&q.type==='deliver'));if(!vis.length)return null;return vis.find(q=>q.id===W.trackQ)||vis[0]}
let qtrT=0;function qTrackTick(dt){qtrT-=dt;if(qtrT>0)return;qtrT=0.05;const el=$('qtrack');if(!el)return;const q=trackedQ();if(!q){if(!el.hidden)el.hidden=true;const w=document.getElementById('qwp');if(w)w.hidden=true;return}
  const t=qTarget(q),prog=q.done?(t&&t[2]||'Gotowe'):(q.n>1?q.have+' / '+q.n:'w toku');let arr='',dist='';
  if(t){const fw=Math.atan2(player.p.x-camera.position.x,player.p.z-camera.position.z),tg=Math.atan2(t[0]-player.p.x,t[1]-player.p.z),rel=tg-fw,d=Math.hypot(t[0]-player.p.x,t[1]-player.p.z);
    arr=d<12?'<i class="qok">●</i>':`<i class="qarr"><svg viewBox="0 0 24 24" width="30" height="30" style="transform:rotate(${Math.round(-rel*180/Math.PI/4)*4}deg)"><path d="M12 2 L21 20 L12 15 L3 20 Z" fill="#ffd34d" stroke="#2a1a0c" stroke-width="2" stroke-linejoin="round"/></svg></i>`;dist=d<12?'na miejscu':(d>=1000?(d/1000).toFixed(1)+' km':Math.round(d)+' m');
    /* v141: znacznik celu na ekranie (romb z odległością), przy krawędzi ekranu gdy cel jest poza kadrem */{let w=document.getElementById('qwp');if(!w){w=document.createElement('div');w.id='qwp';w.innerHTML='<b></b><span></span>';document.body.appendChild(w)}const h=colAt(t[0],t[1]);const sp=project(t[0],(h??player.p.y)+3,t[1]);let x,y,edge=false;
      if(sp&&sp[0]>40&&sp[0]<innerWidth-40&&sp[1]>60&&sp[1]<innerHeight-60){x=sp[0];y=sp[1]}else{const ang=rel;x=innerWidth/2-Math.sin(ang)*innerWidth*0.42;y=innerHeight/2-Math.cos(ang)*innerHeight*0.4;x=Math.max(40,Math.min(innerWidth-40,x));y=Math.max(70,Math.min(innerHeight-70,y));edge=true}
      w.hidden=d<12||anyWin();w.className=edge?'edge':'';w.style.transform=`translate(${x.toFixed(0)}px,${y.toFixed(0)}px) translate(-50%,-100%)`;w.firstChild.style.transform=edge?`rotate(${(-rel*180/Math.PI).toFixed(0)}deg)`:'';w.lastChild.textContent=dist}}else{const w=document.getElementById('qwp');if(w)w.hidden=true}
  const vis=W.quests.filter(x=>!(x.done&&x.type==='deliver')),rest=vis.filter(x=>x!==q).slice(0,2);
  const QH=`<div class="qt1">${arr}<span><b>${esc(q.title)}</b><small>${esc(prog)}${dist?' · '+dist:''}</small></span></div>`+rest.map(x=>`<div class="qt2${x.done?' ok':''}">${x.done?'✓':'•'} ${esc(x.title)} <em>${x.done?'wróć po nagrodę':(x.n>1?x.have+'/'+x.n:'w toku')}</em></div>`).join('')+(vis.length>3?`<div class="qt2">+${vis.length-3} w dzienniku [J]</div>`:'');/* v145: DOM przebudowywany tylko przy zmianie treści */if(el._h!==QH){el._h=QH;el.innerHTML=QH}el.hidden=false}
TICKS.push(qTrackTick);TICKS.push(dt=>{try{if(pitch<-0.5&&!P3.chg&&!isBow())pitch+=(-0.5-pitch)*Math.min(1,dt*6)}catch(_){}});
function questMarks(){const l=[];for(const q of W.quests){if(q.done&&q.type!=='deliver'){const v=villages.get(q.vid);if(v)l.push([v.x,v.z,'#ffd34d'])}else if(!q.done&&q.mark)l.push([q.mark[0],q.mark[1],'#ffd34d']);else if(!q.done&&q.pts)for(const p of q.pts)if(!p[2])l.push([p[0],p[1],q.col])}return l}

function villSeen(v){return v&&!!W.seen[v.id]}
function npcMarks(){
  for(const v of villages.values()){if(!v||!v.g)continue;for(const n of v.npcs){if(!n.m||!n.mark)continue;const d=Math.hypot(n.x-player.p.x,n.z-player.p.z);if(d>80)continue;
    const s=project(n.x,n.m.position.y+2.75*RACES[n.race].hs,n.z);if(!s)continue;const b=barFor('n'+n.id,'mk');if(b.firstChild.textContent!==n.mark){b.firstChild.textContent=n.mark;b.classList.toggle('qdone',n.mark==='?');b.classList.toggle('svc',n.mark!=='?'&&n.mark!=='!')}const sc=Math.max(0.6,Math.min(1.25,14/Math.max(6,d)+0.45));b.style.transform=`translate(${s[0]}px,${s[1]}px) translate(-50%,-100%) scale(${sc.toFixed(2)})`}}
}

Object.assign(PROJ,{poison:{spd:22,g:5,life:2,geo:()=>boxes([[0,0,0,0.34,0.34,0.34,'#7dff8a'],[0,0,-0.22,0.2,0.2,0.3,'#3f9a3a']])},curse:{spd:18,g:0,life:2.2,geo:()=>boxes([[0,0,0,0.36,0.36,0.36,'#c48aff'],[0,0,-0.25,0.2,0.2,0.34,'#7a3ad0']])}});
