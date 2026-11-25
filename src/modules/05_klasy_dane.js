// =================== ETAP 3: klasy, doświadczenie, poziomy, perki (dane) ===================
const CLS={
 wojownik:{n:'Wojownik',rola:'Walka wręcz, dużo zdrowia',col:'#e0625a',weapons:['miecz','topor','mlot'],start:'miecz',pas:'+20% zdrowia i +3 obrony',
   q:{n:'Szarża',cd:6,d:'Pęd naprzód, który rani i odrzuca wrogów na drodze'},e:{n:'Okrzyk bojowy',cd:18,d:'+30% obrażeń i +20% obrony przez 8 s'}},
 lucznik:{n:'Łucznik',rola:'Walka z dystansu',col:'#62c46b',weapons:['luk'],start:'luk',pas:'+8% szansy na trafienie krytyczne',
   q:{n:'Strzała przebijająca',cd:2,d:'Potężna strzała, która przelatuje przez wszystkich wrogów na linii'},e:{n:'Salwa',cd:2,d:'Trzy strzały wypuszczone jedna po drugiej. Jeśli wszystkie trafią ten sam cel, zostaje ogłuszony na 2,5 s'}},
 mag:{n:'Mag',rola:'Magia obszarowa',col:'#6a9bff',weapons:['kostur'],start:'kostur',pas:'Umiejętności odnawiają się 15% szybciej',
   q:{n:'Kula ognia',cd:5,d:'Pocisk, który wybucha i rani wszystkich w promieniu'},e:{n:'Fala mrozu',cd:12,d:'Mróz wokół ciebie: rani i spowalnia wrogów na 4 s'}},
 lotrzyk:{n:'Łotrzyk',rola:'Szybkie ciosy i krytyki',col:'#b07ad6',weapons:['sztylet','miecz'],start:'sztylet',pas:'+15% szybkości ruchu i +4% krytyka',
   q:{n:'Skok cienia',cd:8,d:'Teleport za plecy najbliższego wroga i cios krytyczny'},e:{n:'Zasłona dymna',cd:20,d:'Niewidzialność na 5 s, wrogowie cię gubią; następny cios zadaje podwójne obrażenia'}},
};
const GENPERKS=[['wytrz','Wytrzymałość','+6% zdrowia'],['sila','Siła','+5% obrażeń'],['zrecz','Zręczność','+4% szybkości ataku'],['prec','Precyzja','+2% szansy na krytyk'],['odp','Odporność','+3 obrony'],['regen','Regeneracja','+0,6 zdrowia na sekundę'],['nogi','Szybkie nogi','+3% szybkości ruchu'],['skarb','Łowca skarbów','+8% złota i szansy na przedmiot'],['odnowa','Odpoczynek','Poza walką odzyskujesz 1% zdrowia na sekundę'],['wampir','Wampiryzm','2% zadanych obrażeń wraca jako zdrowie'],['cios','Miażdżący cios','+10% obrażeń krytycznych'],['tarcza','Twarda skóra','−3% otrzymywanych obrażeń'],['unik','Wyczucie','+2% szansy na uniknięcie ciosu'],['opiekun','Opiekun zwierząt','Kompan zadaje +8% obrażeń'],['sokol','Sokole oko','Strzały lecą o 8% dalej i szybciej'],['lotnik','Lotnik','Lotnia opada o 10% wolniej'],['mistrz','Mistrz umiejętności','−5% czasu odnowienia umiejętności'],['madrosc','Mądrość','+4% punktów doświadczenia']];
const PMAX=5, LMAX=500;
const HERO=LS.get('hero',null)||{lvl:1,xp:0,pts:0,perks:{}};
if(HERO.cls){delete HERO.cls}
const PASS=[['twardziel','Twardziel','+20% zdrowia i +3 obrony'],['oko','Bystre oko','+8% szansy na trafienie krytyczne'],['uczony','Uczony','Umiejętności odnawiają się 15% szybciej'],['zwinnosc','Zwinność','+15% szybkości ruchu'],
 ['silacz','Siłacz','+12% obrażeń w walce wręcz'],['strzelec','Strzelec','+12% obrażeń z łuku i kostura'],['regen','Szybkie gojenie','+1,5 zdrowia na sekundę'],['lowca','Łowca','+15% punktów doświadczenia'],
 ['handlarz','Handlarz','Kupcy sprzedają o 15% taniej i płacą więcej'],['przyjaciel','Przyjaciel zwierząt','+25% szansy na oswojenie, zwierzaki zadają +30% obrażeń'],['plywak','Wodniak','Pływanie o 60% szybsze, łódź o 25% szybsza'],['szczesciarz','Szczęściarz','Więcej złota i lepsze przedmioty z łupów']];
const hasP=k=>(HERO.pas||[]).includes(k);
const ABW={miecz:'wojownik',topor:'topornik',mlot:'mlotnik',luk:'lucznik',kostur:'mag',sztylet:'lotrzyk',wlocznia:'wlocznik',buzdygan:'mlotnik',halabarda:'halabardnik',szabla:'szermierz',kusza:'kusznik',rozdzka:'czarodziej'};
const E_OF={halabardnik:'wojownik',wlocznik:'wojownik',mlotnik:'wojownik',topornik:'wojownik',szermierz:'lotrzyk',kusznik:'lotrzyk',czarodziej:'mag'};
Object.assign(CLS,{
 halabardnik:{n:'Halabardnik',col:'#d8a84a',hidden:1,q:{n:'Zamach dookoła',cd:5,d:'Szeroki zamach: rani i odrzuca wszystkich wrogów wokół'}},
 wlocznik:{n:'Włócznik',col:'#c9b070',hidden:1,q:{n:'Pchnięcie',cd:4,d:'Długie pchnięcie, które przebija wszystkich wrogów na linii'}},
 mlotnik:{n:'Młotnik',col:'#c88050',hidden:1,q:{n:'Uderzenie w ziemię',cd:7,d:'Wstrząs, który rani i ogłusza wrogów wokół na 1,5 s'}},
 topornik:{n:'Topornik',col:'#d06a4a',hidden:1,q:{n:'Wir',cd:6,d:'Wirujesz z toporem przez 1,2 s, raniąc wszystkich obok'}},
 szermierz:{n:'Szermierz',col:'#b07ad6',hidden:1,q:{n:'Cięcie w biegu',cd:5,d:'Błyskawiczny wypad naprzód, który tnie wszystkich na drodze'}},
 kusznik:{n:'Kusznik',col:'#7ab08a',hidden:1,q:{n:'Bełt przebijający',cd:4,d:'Ciężki bełt o dużej sile, przebija wrogów na linii'}},
 czarodziej:{n:'Czarodziej',col:'#7aa8ff',hidden:1,q:{n:'Błyskawica łańcuchowa',cd:5,d:'Piorun przeskakuje między maksymalnie 5 wrogami'}}});
for(const k in E_OF)CLS[k].e=CLS[E_OF[k]].e;
const abilSet=()=>{const w=INV.eq.bron;return w?ABW[w.base]||null:null};
// ===== „Wystrzał szczęścia” (klawisz 0): radosny wystrzał złotych iskier i konfetti — jak strzelający korek, ale bez butelki =====
const LUCK={t:0,cd:0};
function luckFx(x,y,z,ry){const C=['#ffffff','#f4f4f4','#e8eef2','#ffffff'];
  sfx('crit',0.9);setTimeout(()=>sfx('coin',0.8),120);setTimeout(()=>sfx('lvl',0.5),300);
  // konfetti strzela poziomo: najpierw snop w kierunku patrzenia (jak z szampana), potem pierścień dookoła
  const fa=Math.PI/2-(ry??player.ry);for(let k=0;k<7;k++)setTimeout(()=>{try{PFX.emit(x+Math.cos(fa)*0.5,y+1.3+k*0.01,z+Math.sin(fa)*0.5,18,k<5?['#ffffff','#f8f8f8']:C,{sp:11,up:0.6,flat:1,fan:fa,fw:0.7,life:1.5,size:k<5?0.09:0.12,g:1.4,drag:1.3,r:0.2})}catch(_){}},k*70);/* tylko snop w kierunku patrzenia — bez poziomego okręgu */}
function luckBurst(){if(P2.dead||!player.ready)return;if(LUCK.cd>0)return toast('Wystrzał szczęścia gotowy za '+Math.ceil(LUCK.cd)+' s','#cfe8ff');
  LUCK.cd=300;LUCK.t=60;const p=player.p;luckFx(p.x,p.y,p.z,player.ry);sendFx({k:'luck',p:[p.x,p.y,p.z],ry:player.ry,nm:S.name});
  toast('🎉 Wystrzał szczęścia! Przez 60 s: +10% krytyków i lepsze łupy','#ffd34d')}
const P3={dash:0,salvo:null,q:0,e:0,buff:0,charge:0,chargeSet:null,chargeDir:[0,1],haste:0,leap:0,stealth:0,sneak:false};let HIT_SRC=null;
const pk=k=>HERO.perks[k]||0;
const SKILLS=[['sprint','Sprint','+0,6% szybkości biegu na poziom'],['walka','Walka wręcz','+0,8% obrażeń w zwarciu na poziom'],['strzel','Strzelanie','+0,8% obrażeń z dystansu na poziom'],['wytrz','Wytrzymałość','+1% zdrowia na poziom'],['wspin','Wspinaczka','+4% wytrzymałości i +1% szybkości wspinania na poziom'],['plyw','Pływanie','+1% szybkości pływania na poziom']];
const skL=k=>{const x=(HERO.sk&&HERO.sk[k])||0;return Math.min(50,Math.floor(Math.sqrt(x/12)))};
function skGain(k,v){HERO.sk=HERO.sk||{};const l0=skL(k);HERO.sk[k]=(HERO.sk[k]||0)+v;const l1=skL(k);if(l1>l0){toast('Umiejętność '+SKILLS.find(s=>s[0]===k)[1]+': poziom '+l1,'#a7e0ff');sfx('lvl',0.5);ST=stats();saveHero()}else if(Math.random()<0.02)saveHero()}
const need=l=>Math.round(130*Math.pow(l,1.55)+120*l);
function saveHero(){LS.set('hero',HERO)}
// v120: eksport i import postaci (wygląd, poziom, perki, pasywki, ekwipunek, wierzchowce) do pliku — np. żeby przenieść ją na inny komputer albo do gry u kolegi
let DLS=null;try{if(window.claude&&window.claude.use)window.claude.use('downloads').then(d=>{DLS=d}).catch(()=>{})}catch(_){}
const CHARKEYS=['name','look','looks','color','hero','inv','mounts','herb','lamp','arenaBest'];
function charExport(){try{saveHero();saveInv()}catch(_){}const o={pintarChar:1,v:1,date:new Date().toISOString()};for(const k of CHARKEYS){const x=LS.get(k,undefined);if(x!==undefined)o[k]=x}
  const nm=(o.name||'postac').toString().replace(/[^\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ-]+/g,'_').slice(0,30),txt=JSON.stringify(o);
  const fname='Pintar-postac-'+nm+'.json',plain=()=>{try{const b=new Blob([txt],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=fname;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},1500);toast('Zapisano plik postaci','#bfe7a8')}catch(e){toast('Nie udało się zapisać pliku postaci','#ff9d6b')}};
  /* v144: w podglądzie Claude zwykłe pobieranie jest zablokowane — używamy usługi pobierania artefaktu, a w wersji .exe zwykłego linku */
  if(DLS)DLS.save({filename:fname,data:txt}).then(()=>toast('Zapisano plik postaci','#bfe7a8')).catch(()=>toast('Zapisywanie pliku anulowane — postać skopiowano do schowka','#ffd27a'));else plain()
  try{navigator.clipboard&&navigator.clipboard.writeText(txt).catch(()=>{})}catch(_){}}
function charImport(txt){let o;try{o=JSON.parse(txt)}catch(e){toast('To nie jest plik postaci Pintar','#ff9d6b');return}if(!o||!o.pintarChar||!o.hero){toast('To nie jest plik postaci Pintar','#ff9d6b');return}
  if(!confirm('Wczytać postać'+(o.name?' „'+o.name+'”':'')+'? Obecna postać zostanie zastąpiona (wyeksportuj ją wcześniej, jeśli chcesz ją zachować). Gra uruchomi się ponownie.'))return;
  if(o.inv&&(typeof o.inv!=='object'||typeof o.inv.eq!=='object'||!o.inv.eq))delete o.inv;if(typeof o.hero!=='object')delete o.hero;
  for(const k of CHARKEYS)if(o[k]!==undefined)LS.set(k,o[k]);window.__noSave=1;toast('Wczytano postać — ponowne uruchamianie…','#bfe7a8');setTimeout(()=>location.reload(),700)}
try{$('charexp').onclick=charExport;$('charimp').onclick=()=>{const f=$('charfile');f.value='';f.click()};$('charfile').onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>charImport(String(r.result));r.readAsText(f)}}catch(e){console.warn('eksport postaci',e)}

