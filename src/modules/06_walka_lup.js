// =================== ETAP 2: walka, wrogowie, łup, ekwipunek ===================
const RAR=[{n:'Zwykły',c:'#e9e6df'},{n:'Niezwykły',c:'#62d26d'},{n:'Rzadki',c:'#4ea3ff'},{n:'Epicki',c:'#b874ff'},{n:'Legendarny',c:'#ff9d2e'}];
const RMUL=[1,1.22,1.5,1.85,2.3];
const WEAP={luk:{n:'Łuk',dmg:9,spd:0.9,rng:30,proj:'arrow'},kostur:{n:'Kostur',dmg:11,spd:0.75,rng:26,proj:'bolt'},miecz:{n:'Miecz',dmg:10,spd:1.0,rng:2.4},topor:{n:'Topór',dmg:14,spd:0.78,rng:2.4},mlot:{n:'Młot',dmg:19,spd:0.6,rng:2.5},sztylet:{n:'Sztylety',dmg:6.2,spd:1.65,rng:2.0},wlocznia:{n:'Włócznia',dmg:12,spd:0.9,rng:3.0},buzdygan:{n:'Buzdygan',dmg:15,spd:0.75,rng:2.3},szabla:{n:'Szabla',dmg:9,spd:1.25,rng:2.3},halabarda:{n:'Halabarda',dmg:20,spd:0.55,rng:3.2},kusza:{n:'Kusza',dmg:14,spd:0.6,rng:34,proj:'arrow'},rozdzka:{n:'Różdżka',dmg:8,spd:1.2,rng:24,proj:'bolt'}};
const ARM={tarcza:{n:'Tarcza',def:3,hp:14},latarnia:{n:'Latarnia',def:0,hp:0},helm:{n:'Hełm',def:2,hp:10},zbroja:{n:'Napierśnik',def:4,hp:25},rekawice:{n:'Rękawice',def:1.5,hp:8},buty:{n:'Buty',def:1.5,hp:8},pierscien:{n:'Pierścień',def:0,hp:6},amulet:{n:'Amulet',def:0,hp:10}};
const SLOTS=[['bron','Broń'],['dyst','Broń dystansowa'],['tarcza','Tarcza'],['helm','Hełm'],['zbroja','Napierśnik'],['rekawice','Rękawice'],['buty','Buty'],['pierscien','Pierścień'],['amulet','Amulet'],['latarnia','Latarnia']];
const LAMPR=[10,14,19,25,33];
const ARMT=[{k:'skora',m:'skórzany',p:'skórzane',x:0.8,c:'#7a5030'},{k:'kolcz',m:'kolczy',p:'kolcze',x:1.0,c:'#9aa0a6'},{k:'plyt',m:'płytowy',p:'płytowe',x:1.25,c:'#c9cfd4'},{k:'elf',m:'elfi',p:'elfie',x:1.1,c:'#6aa07a'},{k:'krasn',m:'krasnoludzki',p:'krasnoludzkie',x:1.35,c:'#b8873a'},{k:'smok',m:'smoczy',p:'smocze',x:1.6,c:'#9a2a22'}];
const WEAPV={
 miecz:[['krotki','Krótki miecz',0.9,1.15,0.75],['dlugi','Długi miecz',1.1,0.92,1.1],['poltora','Miecz półtoraręczny',1.25,0.82,1.3],['tasak','Tasak',1.05,1.0,0.8]],
 topor:[['toporek','Toporek',0.85,1.2,0.8],['bojowy','Topór bojowy',1,1,1],['brodaty','Topór brodaty',1.1,0.92,1.05],['dwureczny','Topór dwuręczny',1.35,0.75,1.3]],
 mlot:[['kowalski','Młot kowalski',0.9,1.1,0.85],['bojowy','Młot bojowy',1,1,1],['wielki','Wielki młot',1.35,0.72,1.3]],
 sztylet:[['sztylety','Sztylety',1,1,1],['kordziki','Kordziki',1.1,0.95,1.15],['mizerykordie','Mizerykordie',0.9,1.15,0.9]],
 kostur:[['laska','Laska',0.9,1.15,0.9],['kostur','Kostur',1,1,1],['arcymaga','Kostur arcymaga',1.25,0.85,1.15]],
 luk:[['krotki','Krótki łuk',0.85,1.25,0.82,0.85],['mysliwski','Łuk myśliwski',1,1,1,1],['dlugi','Długi łuk',1.2,0.85,1.25,1.3],['refleks','Łuk refleksyjny',1.1,1.05,1.0,1.12],['elfi','Elfi łuk',1.15,1.15,1.1,1.18],['kosciany','Kościany łuk',1.3,0.8,1.05,1.05]],
 wlocznia:[['oszczep','Oszczep',0.9,1.1,0.85],['wlocznia','Włócznia',1,1,1],['pika','Pika',1.2,0.85,1.25]],
 buzdygan:[['maczuga','Maczuga',0.9,1.05,0.9],['buzdygan','Buzdygan',1,1,1],['morgenstern','Morgenstern',1.2,0.85,1.1]],
 szabla:[['szabla','Szabla',1,1,1],['sejmitar','Sejmitar',1.1,0.95,1.05],['karabela','Karabela',1.05,1.1,1]],
 halabarda:[['halabarda','Halabarda',1,1,1],['glewia','Glewia',1.05,1.05,1],['kosa','Kosa bojowa',1.2,0.85,1.1]],
 kusza:[['lekka','Lekka kusza',0.85,1.2,0.85,0.9],['kusza','Kusza',1,1,1,1],['ciezka','Ciężka kusza',1.35,0.75,1.2,1.2]],
 rozdzka:[['rozdzka','Różdżka',1,1,1],['berlo','Berło',1.15,0.95,1.1]]};
const SUFF=['Wilka','Burzy','Świtu','Zmierzchu','Olbrzyma','Mrozu','Płomienia','Pustyni','Puszczy','Króla','Wędrowca','Gromu'];
const BONUS={crit:['Trafienie krytyczne','%'],haste:['Szybkość ataku','%'],hpb:['Zdrowie','']};
const rnd=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
let itemSeq=Date.now()%1e6;
function rollRarity(boost){const r=Math.random()*100-(boost+(LUCK.t>0?18:0))*0.4;return r<0.35?4:r<2.2?3:r<8?2:r<28?1:0}
function genItem(lvl,boost=0,forceSlot,cls){
  const rar=rollRarity(boost), slot=forceSlot||pick(['bron','bron','helm','zbroja','rekawice','buty','pierscien','amulet','latarnia','tarcza']);
  const sc=(1+0.13*(lvl-1))*RMUL[rar]*rnd(0.9,1.1);
  const it={id:'i'+(itemSeq++),slot,rar,lvl};
  if(slot==='bron'){const WB=['miecz','miecz','topor','mlot','sztylet','kostur','luk','luk','luk','wlocznia','buzdygan','szabla','halabarda','kusza','rozdzka'];it.base=pick(WB);const w=WEAP[it.base],V=pick(WEAPV[it.base]);it.var=V[0];it.dmg=+(w.dmg*sc*V[2]).toFixed(1);it.spd=+(w.spd*V[3]).toFixed(2);if(V[5])it.rngM=V[5];it.name=V[1]+' '+pick(SUFF)}
  else {it.base=slot;const a=ARM[slot];let mx=1,adj='';if(['helm','zbroja','rekawice','buty'].includes(slot)){const w=[3,3,2,1+rar*0.5,rar>=1?1+rar*0.4:0.2,rar>=2?rar*0.5:0],tot=w.reduce((p,q)=>p+q,0);let r=Math.random()*tot,i=0;while(r>w[i]){r-=w[i];i++}const T=ARMT[Math.min(5,i)];it.mat=T.k;mx=T.x;adj=' '+(slot==='rekawice'||slot==='buty'?T.p:T.m)}it.def=+(a.def*sc*mx).toFixed(1);it.hp=Math.round(a.hp*sc*mx);it.name=a.n+adj+' '+pick(SUFF)}
  if(slot==='tarcza'){const TV=[['puklerz','Puklerz',0.75],['okuta','Tarcza okuta',1],['herbowa','Tarcza herbowa',1.15],['wiezowa','Tarcza wieżowa',1.4]],tv=TV[Math.min(3,Math.floor(Math.random()*(2+rar*0.6)))];it.var=tv[0];it.def=+(ARM.tarcza.def*sc*tv[2]).toFixed(1);it.hp=Math.round(ARM.tarcza.hp*sc*tv[2]);it.block=+(10+rar*3+tv[2]*4).toFixed(0);it.name=tv[1]+' '+pick(SUFF);it.mat=rar>=3?'plyt':rar>=1?'krasn':undefined;if(!it.mat)delete it.mat}
  if(slot==='pierscien'||slot==='amulet')it.lk=Math.floor(Math.random()*6);if(slot==='latarnia')it.lk=Math.floor(Math.random()*5);
  it.sd=1+Math.floor(Math.random()*99999);
  if(slot==='bron'||['helm','zbroja','rekawice','buty'].includes(slot)){it.lk=Math.random()<[0.06,0.12,0.3,0.55,0.75][rar]?5+Math.floor(Math.random()*5):Math.floor(Math.random()*5);if(slot!=='bron'&&it.lk<5&&Math.random()<0.65){const q=Math.floor(Math.random()*16);it.lk=q<8?10+q:18+q}if(slot!=='bron'&&rar>=3&&Math.random()<(rar>=4?0.6:0.3))it.lk=18+Math.floor(Math.random()*7)}
  const bk=Object.keys(BONUS);for(let i=0;i<rar;i++){const k=pick(bk);const v=k==='crit'?rnd(2,5):k==='haste'?rnd(3,8):k==='regen'?rnd(0.4,1.2)*(1+0.1*lvl):rnd(8,16)*(1+0.12*lvl);it[k]=+((it[k]||0)+v).toFixed(1)}
  return it;
}
// ---------- stan gracza ----------
const INV=LS.get('inv',null)||{eq:{bron:{id:'start',slot:'bron',base:'miecz',rar:0,lvl:1,dmg:10,spd:1,name:'Miecz Wędrowca'}},bag:[],gold:0,pot:3};
const bagN=()=>INV.bagN||30;
const ACCN={pierscien:['klasyczny','sygnet','skręcony','podwójny','z czaszką','wężowy'],amulet:['klasyczny','półksiężyc','kieł','krzyż','oko','gwiazda'],latarnia:['żelazna','papierowa','mosiężna','czaszka','kryształowa']};
const CAPEC=['#7a2a22','#2a3a6a','#3a5a2a','#4a2a5a','#2a2a2e','#8a6a2a'];const CAPEOF=it=>(it.lk>=5&&it.lk<10)?darker(FTH[it.lk].m,0.75):it.sd&&it.sd%3===0?CAPEC[Math.floor(it.sd/3)%6]:null;
const FNAME=['demoniczny','kryształowy','płomienny','lodowy','arkaniczny'];
const EPCOL={18:'#8a1a14',19:'#ece8dc',20:'#2a2224',21:'#9ac8e8',22:'#2a1e3a',23:'#b8c8dc',24:'#5a3e24'};
const LKNEW=['turniejowy','wikiński','templariusza','brygantyna z saladą','gotycki','łowcy','husarski','królewski','★ smoczego rycerza','★ anielski','★ piekielny','★ lodowego tytana','★ pustki','★ burzy','★ prastarej puszczy','★ (dawny złoty lew)','gambeson z kapalinem','strażnika miejskiego','najemnika z barbutą','pikiniera','łucznika','z psim pyskiem','normandzki','wilczej skóry'];
const LKNAME={bron:['klasyczny','wschodni','barbarzyński','rycerski','zdobiony',...FNAME],helm:['klasyczny','rogaty','z nosalem','garnczkowy','szyszak z czepcem',...FNAME],zbroja:['klasyczny','z tabardem','ćwiekowany','łuskowy','z futrzanym kołnierzem',...FNAME],rekawice:['klasyczne','z kolcami','z futrem','długie mankiety','zdobione','demoniczne','kryształowe','płomienne','lodowe','arkaniczne'],buty:['klasyczne','z futrem','z ostrogami','z nakolannikami','zdobione','demoniczne','kryształowe','płomienne','lodowe','arkaniczne']};
const FTH={5:{m:'#33302f',g:'#ff3030',a:'#b08a4a',r:'#b08a4a'},6:{m:'#b4bcc4',g:'#d8f8ff',a:'#d8dde2',r:'#8a9096'},7:{m:'#7a5228',g:'#ffb030',a:'#c99a4a',r:'#5a3a1a'},8:{m:'#cfd3d7',g:'#e8faff',a:'#ffffff',r:'#9aa0a6'},9:{m:'#3a3a42',g:'#c890ff',a:'#c9a24a',r:'#c9a24a'}};
const GEMS={rubin:['Rubin','#e0404a','Zdrowie'],szafir:['Szafir','#4a8af0','Obrona'],szmaragd:['Szmaragd','#3ac070','Krytyk'],topaz:['Topaz','#f0c040','Szybkość ataku'],onyks:['Onyks','#9a7ad8','Obrażenia']};
const gemVal=it=>{const g=it.gem,l=it.lvl||1;return g==='rubin'?Math.round(l*3+10):g==='szafir'?+(l*0.25+1).toFixed(1):g==='szmaragd'?3:g==='topaz'?6:g==='onyks'?6:0};
const gemTxt=it=>{const v=gemVal(it);return it.gem==='rubin'?'+'+v+' zdrowia':it.gem==='szafir'?'+'+v+' obrony':it.gem==='szmaragd'?'+'+v+'% krytyka':it.gem==='topaz'?'+'+v+'% szybkości ataku':'+'+v+'% obrażeń'};
const SETB={skora:['Zestaw skórzany',[[2,'+8% szybkości ruchu'],[4,'+10% krytyka']]],kolcz:['Zestaw kolczy',[[2,'+4 obrony'],[4,'+12% zdrowia']]],plyt:['Zestaw płytowy',[[2,'+12% obrony'],[4,'+15% zdrowia, +6 obrony']]],
 elf:['Zestaw elfi',[[2,'+10% szybkości ataku'],[4,'+8% krytyka, +6% ruchu']]],krasn:['Zestaw krasnoludzki',[[2,'+10% zdrowia'],[4,'+15% obrony, +5% obrażeń']]],smok:['Zestaw smoczy',[[2,'+8% obrażeń'],[4,'+10% obrażeń i zdrowia']]]};
function setCounts(){const c={};for(const k of ['helm','zbroja','rekawice','buty']){const it=INV.eq[k];if(it&&it.mat)c[it.mat]=(c[it.mat]||0)+1}return c}
function saveInv(){LS.set('inv',INV)}
function stats(){
  const L=HERO,s={hp:100+12*(L.lvl-1),def:0,dmg:4,spd:1.2,rng:1.8,crit:5,haste:0,regen:0,move:1,ranged:null};
  for(const [k] of SLOTS){const it=INV.eq[k];if(!it||k==='dyst')continue;/* druga broń nie liczy się do statystyk, dopóki jej nie wyciągniesz (Z) */
    const u=1+0.1*(it.up||0);if(k==='bron'){s.dmg=it.dmg*u;s.spd=it.spd;s.rng=WEAP[it.base].rng;s.ranged=WEAP[it.base].proj||null}
    s.def+=(it.def||0)*u;s.hp+=(it.hp||0)*u+(it.hpb||0);s.crit+=it.crit||0;s.haste+=it.haste||0;
    if(it.gem){const v=gemVal(it);if(it.gem==='rubin')s.hp+=v;else if(it.gem==='szafir')s.def+=v;else if(it.gem==='szmaragd')s.crit+=v;else if(it.gem==='topaz')s.haste+=v;else s.gemD=(s.gemD||0)+v}}
  if(s.gemD)s.dmg*=1+s.gemD/100;
  {const sc=setCounts();for(const mt in sc){const n=sc[mt];if(n>=2){if(mt==='skora')s.move*=1.08;if(mt==='kolcz')s.def+=4;if(mt==='plyt')s.def*=1.12;if(mt==='elf')s.haste+=10;if(mt==='krasn')s.hp*=1.1;if(mt==='smok')s.dmg*=1.08}
    if(n>=4){if(mt==='skora')s.crit+=10;if(mt==='kolcz')s.hp*=1.12;if(mt==='plyt'){s.hp*=1.15;s.def+=6}if(mt==='elf'){s.crit+=8;s.move*=1.06}if(mt==='krasn'){s.def*=1.15;s.dmg*=1.05}if(mt==='smok'){s.dmg*=1.1;s.hp*=1.1}}}}
  s.dmg*=(1+0.04*(L.lvl-1))*(1+0.05*pk('sila'));try{s.hp*=1+0.01*skL('wytrz');s.dmg*=1+0.008*(s.ranged?skL('strzel'):skL('walka'))}catch(e){}s.hp*=1+0.06*pk('wytrz');s.haste+=4*pk('zrecz');s.crit+=2*pk('prec');s.def+=3*pk('odp');s.regen+=0.6*pk('regen');s.move*=1+0.03*pk('nogi');
  if(hasP('twardziel')){s.hp*=1.2;s.def+=3}if(hasP('oko'))s.crit+=8;if(hasP('zwinnosc'))s.move*=1.15;if(hasP('regen'))s.regen+=1.5;
  if(s.ranged){if(hasP('strzelec'))s.dmg*=1.12}else if(hasP('silacz'))s.dmg*=1.12;
  if(P3.buff>0){s.dmg*=1.3;s.def*=1.2}if(P3.haste>0)s.move*=1.3;
  try{if(PET){const pd=petDef();s.def+=2*ppk(pd,'aura');s.regen+=0.3*ppk(pd,'opieka');if(PET.m&&PET.m.visible&&Math.hypot(PET.p.x-player.p.x,PET.p.z-player.p.z)<14){s.dmg*=1+0.02*ppk(pd,'wsparcie')+(pms(pd,20)?0.05:0)}if(pms(pd,50)){s.def+=3;s.regen+=0.5}}
   for(const f of FOL){if(!f.m.visible||Math.hypot(f.p.x-player.p.x,f.p.z-player.p.z)>14)continue;s.def+=2*fpk(f.d,'oslona')+(pms(f.d,50)?3:0);s.regen+=0.2*fpk(f.d,'medyk')}}catch(e){}
  return s;
}
let ST=stats();
const P2={hp:ST.hp,dead:0,atkCd:0,atkT:0,bowT:0,castT:0,bowD:1,castD:1,atkD:0.3,combo:0,roll:0,rollCd:0,rollDir:[0,0],lastHurt:-99,iframe:0,mouse:false};
const nowS=()=>performance.now()/1000;

// ---------- definicje wrogów ----------
// parts: bryły ciała; legs: [x,yGórne,z,faza] kończyny bujające się; hop: skacze zamiast chodzić
const EDEF={
 rekin:{n:'Rekin',hp:90,dmg:16,spd:6.4,aggro:18,rng:2.1,cd:1.4,swim:1,parts:[[0,0.5,0,0.7,0.6,2.6,'#6a7a88'],[0,0.28,0.1,0.6,0.2,2.3,'#d8dde2'],[0,0.5,1.55,0.6,0.5,0.6,'#6a7a88'],[0,0.45,1.95,0.42,0.36,0.3,'#5a6a78'],[0,0.3,1.88,0.38,0.06,0.24,'#f4efe4'],[0.24,0.58,1.7,0.04,0.08,0.08,'#101010'],[-0.24,0.58,1.7,0.04,0.08,0.08,'#101010'],[0,1.0,0.15,0.12,0.5,0.7,'#5a6a78'],[0,1.3,0.0,0.1,0.3,0.4,'#5a6a78'],[0,0.6,-1.55,0.14,0.5,0.5,'#5a6a78'],[0,0.95,-1.85,0.12,0.6,0.32,'#5a6a78'],[0,0.3,-1.8,0.12,0.4,0.3,'#5a6a78'],[0.55,0.32,0.55,0.55,0.08,0.42,'#5a6a78'],[-0.55,0.32,0.55,0.55,0.08,0.42,'#5a6a78']],legs:[]},
 waz_morski:{n:'Wąż morski',hp:260,dmg:24,spd:5.2,aggro:22,rng:3.0,cd:1.8,swim:1,sc:1.6,parts:[[0,0.6,2.6,0.9,0.8,1.1,'#2f7a6a'],[0,0.45,3.15,0.7,0.4,0.5,'#2a6a5a'],[0,0.3,3.2,0.6,0.1,0.4,'#f4efe4'],[0.35,0.85,2.9,0.06,0.12,0.12,'#ffd34d'],[-0.35,0.85,2.9,0.06,0.12,0.12,'#ffd34d'],[0.3,1.15,2.3,0.12,0.5,0.12,'#d8c890'],[-0.3,1.15,2.3,0.12,0.5,0.12,'#d8c890'],[0,1.1,2.2,0.08,0.4,0.9,'#c84a3a'],[0,0.5,1.4,0.8,0.75,1.2,'#36887a'],[0,0.95,1.3,0.08,0.35,1.0,'#c84a3a'],[0,0.2,1.4,0.7,0.12,1.1,'#d8e8c8'],[0,0.35,0.1,0.75,0.7,1.3,'#2f7a6a'],[0,0.75,0.1,0.08,0.35,1.1,'#c84a3a'],[0,0.15,-1.2,0.7,0.65,1.3,'#36887a'],[0,0.5,-1.2,0.08,0.3,1.0,'#c84a3a'],[0,0.3,-2.5,0.6,0.55,1.3,'#2f7a6a'],[0,0.45,-3.6,0.4,0.4,1.0,'#36887a'],[0,0.6,-4.3,0.1,0.7,0.6,'#c84a3a']],legs:[]},
 slime:{n:'Szlam',hp:30,dmg:6,spd:3.0,aggro:9,rng:1.5,cd:1.5,hop:1,parts:[[0,0.45,0,0.9,0.9,0.9,'#7ad15a'],[0,0.2,0,1.0,0.25,1.0,'#68bf4b'],[0.2,0.62,0.46,0.12,0.18,0.02,'#173016'],[-0.2,0.62,0.46,0.12,0.18,0.02,'#173016']],legs:[]},
 wilk:{n:'Wilk',hp:40,dmg:8,spd:6.2,aggro:15,rng:1.8,cd:1.1,parts:[[0,0.78,0,0.55,0.5,1.2,'#8a8a90'],[0,0.98,0.75,0.46,0.44,0.5,'#9a9aa0'],[0,0.88,1.07,0.24,0.2,0.26,'#77777d'],[0.13,1.26,0.66,0.1,0.18,0.1,'#77777d'],[-0.13,1.26,0.66,0.1,0.18,0.1,'#77777d'],[0,0.9,-0.78,0.14,0.14,0.5,'#77777d'],[0.12,1.04,1.01,0.07,0.06,0.02,'#ffd34d'],[-0.12,1.04,1.01,0.07,0.06,0.02,'#ffd34d']],legs:[[0.17,0.55,0.42,0],[-0.17,0.55,0.42,1],[0.17,0.55,-0.42,1],[-0.17,0.55,-0.42,0]],lw:0.16,lh:0.55,lc:'#77777d'},
 dzik:{n:'Dzik',hp:55,dmg:10,spd:5.2,aggro:0,rng:1.8,cd:1.3,parts:[[0,0.75,0,0.75,0.65,1.25,'#6b4a33'],[0,0.75,0.75,0.55,0.5,0.4,'#5b3d29'],[0,0.68,1.0,0.3,0.25,0.15,'#d9a28a'],[0.22,0.62,0.95,0.06,0.2,0.06,'#f2ead8'],[-0.22,0.62,0.95,0.06,0.2,0.06,'#f2ead8'],[0,1.12,0,0.12,0.12,1.0,'#3e2a1c']],legs:[[0.24,0.45,0.42,0],[-0.24,0.45,0.42,1],[0.24,0.45,-0.42,1],[-0.24,0.45,-0.42,0]],lw:0.18,lh:0.45,lc:'#4e3424'},
 goblin:{n:'Gobliński zbój',hp:48,dmg:9,spd:5.0,aggro:13,rng:1.9,cd:1.2,parts:[[0,0.95,0,0.5,0.55,0.32,'#8a5a2f'],[0,1.45,0,0.46,0.42,0.42,'#6fae3e'],[0.3,1.5,0,0.18,0.1,0.06,'#6fae3e'],[-0.3,1.5,0,0.18,0.1,0.06,'#6fae3e'],[0.1,1.48,0.215,0.07,0.07,0.01,'#d33'],[-0.1,1.48,0.215,0.07,0.07,0.01,'#d33']],legs:[[0.13,0.68,0,0],[-0.13,0.68,0,1],[0.36,1.18,0,1],[-0.36,1.18,0,0]],lw:0.16,lh:0.62,lc:'#4f7f2c'},
 skorpion:{n:'Skorpion',hp:45,dmg:10,spd:4.6,aggro:11,rng:1.9,cd:1.2,parts:[[0,0.45,0,0.8,0.32,1.1,'#b0702e'],[0,0.55,0.62,0.5,0.25,0.35,'#9a5f24'],[0.55,0.45,0.9,0.3,0.2,0.4,'#b0702e'],[-0.55,0.45,0.9,0.3,0.2,0.4,'#b0702e'],[0,0.7,-0.65,0.22,0.22,0.4,'#9a5f24'],[0,1.05,-0.8,0.2,0.4,0.2,'#9a5f24'],[0,1.35,-0.6,0.18,0.18,0.35,'#9a5f24'],[0,1.3,-0.35,0.1,0.1,0.2,'#2a1a10']],legs:[[0.42,0.35,0.3,0],[-0.42,0.35,0.3,1],[0.42,0.35,0,1],[-0.42,0.35,0,0],[0.42,0.35,-0.3,0],[-0.42,0.35,-0.3,1]],lw:0.1,lh:0.35,lc:'#7a4a1c'},
 krab:{n:'Krab',hp:34,dmg:7,spd:3.6,aggro:8,rng:1.6,cd:1.3,parts:[[0,0.45,0,1.0,0.35,0.7,'#d9533e'],[0.62,0.55,0.35,0.35,0.3,0.3,'#e0654f'],[-0.62,0.55,0.35,0.35,0.3,0.3,'#e0654f'],[0.15,0.72,0.3,0.07,0.18,0.07,'#222'],[-0.15,0.72,0.3,0.07,0.18,0.07,'#222']],legs:[[0.4,0.32,-0.1,0],[-0.4,0.32,-0.1,1],[0.4,0.32,-0.3,1],[-0.4,0.32,-0.3,0]],lw:0.1,lh:0.32,lc:'#b8432f'},
 yeti:{n:'Yeti',hp:95,dmg:14,spd:4.3,aggro:14,rng:2.3,cd:1.6,parts:[[0,1.45,0,1.0,1.0,0.7,'#eef3f6'],[0,2.15,0.05,0.65,0.55,0.6,'#e2e9ee'],[0,2.1,0.36,0.4,0.3,0.02,'#8fb0c0'],[0.12,2.2,0.37,0.08,0.07,0.01,'#123'],[-0.12,2.2,0.37,0.08,0.07,0.01,'#123']],legs:[[0.24,0.95,0,0],[-0.24,0.95,0,1],[0.65,1.85,0,1],[-0.65,1.85,0,0]],lw:0.32,lh:0.95,lc:'#dfe7ec'},
 golem:{n:'Golem skalny',hp:130,dmg:17,spd:3.0,aggro:12,rng:2.4,cd:1.9,parts:[[0,1.6,0,1.3,1.1,0.8,'#7d7b78'],[0,2.4,0.1,0.6,0.5,0.55,'#8d8b88'],[0.15,2.45,0.38,0.12,0.08,0.01,'#7fe3ff'],[-0.15,2.45,0.38,0.12,0.08,0.01,'#7fe3ff'],[0.4,1.9,0.41,0.3,0.25,0.02,'#5fa04a']],legs:[[0.32,1.05,0,0],[-0.32,1.05,0,1],[0.85,2.0,0,1],[-0.85,2.0,0,0]],lw:0.42,lh:1.05,lc:'#6c6a67'},
 ropucha:{n:'Ropucha bagienna',hp:42,dmg:9,spd:4.0,aggro:10,rng:1.7,cd:1.3,hop:1,parts:[[0,0.45,0,0.9,0.55,0.95,'#5f7a3a'],[0,0.62,0.4,0.75,0.35,0.35,'#6d8a44'],[0.25,0.85,0.45,0.18,0.18,0.18,'#e2d15a'],[-0.25,0.85,0.45,0.18,0.18,0.18,'#e2d15a'],[0,0.3,0.42,0.7,0.12,0.2,'#c8c08a']],legs:[]},
};
const BIOME_E={1:['krab'],2:['slime','dzik','goblin','wilk'],3:['wilk','dzik','goblin'],4:['skorpion','goblin'],5:['yeti','wilk'],6:['golem','yeti'],7:['ropucha','slime']};

