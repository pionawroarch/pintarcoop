{
window.__mainOK=true;function whenReady(f,d){setTimeout(function g(){if(!window.__mainReady)return setTimeout(g,150);f()},d||0)}
const C=32, WATER=24, STEP=1.05, PR=0.32, PH=1.75;
const BIOMES=['Ocean','Plaża','Równiny','Las','Pustynia','Tundra','Góry','Bagna','Sawanna','Dżungla','Jesienny las','Kwitnący gaj','Wrzosowisko','Rzeka','Jezioro','Kanion','Wulkaniczne pustkowie','Lawa','Kryształowe pustkowia','Grzybowy las','Przeklęte ziemie','Lodowe iglice','Kryształowa iglica','Lodowa iglica','Tajga','Step','Bambusowy gaj','Las sekwoi','Solnisko','Lawendowe pola','Namorzyny','Sawanna baobabów','Zorzowa tundra','Torfowisko','Wiśniowy sad','Szklana pustynia','Skamieniały las','Rafa koralowa','Pole dawnej bitwy','Podniebne łąki','Wielki wąwóz','Gorące źródła','Martwy las','Delta rzeki','Fiordy','Żniwne pola','Pustynia oaz','Lodowiec','Otchłań','Czerwone wydmy','Pole kraterów','Bursztynowy las','Skalny las','Świecące bagno','Ogród olbrzymich kwiatów','Bazaltowe wybrzeże','Krwawy las','Cmentarzysko tytanów','Skamieniała puszcza','Solne lustro','Morze chmur','Tęczowe góry','Smołowe bagno','Las latarni','Szronowy las','Wyschnięte morze','Las pajęczyn','Kaskadowe tarasy','Mechaniczne pustkowie'];
const $=id=>document.getElementById(id);
const SET_G=Object.assign({blood:true,pfx:1,shake:true,nums:true,bright:1,sat:1,fps:0,fog:1,amb:0.7},(()=>{try{return JSON.parse(localStorage.getItem('coop1.setg')||'{}')}catch(_){return{}}})());
function saveSetG(){try{localStorage.setItem('coop1.setg',JSON.stringify(SET_G))}catch(_){}}
const LS={get(k,d){try{const v=localStorage.getItem('coop1.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('coop1.'+k,JSON.stringify(v))}catch(e){/* v145: brak miejsca na zapis — raz ostrzegamy zamiast tracić postęp po cichu */if(!LS._warn){LS._warn=1;console.warn('zapis',k,e);setTimeout(()=>{try{toast('Uwaga: przeglądarka odmówiła zapisu gry ('+k+'). Wyeksportuj postać w menu.','#ff8a7a')}catch(_){}},0)}}}};

// ---------- ustawienia ----------
const S={fov:LS.get('fov',55),look:LS.get('look',null),rd:Math.min(24,LS.get('rd2',14)),shadows:LS.get('sh',true),seed:LS.get('seed',Math.floor(Math.random()*1e9)),name:LS.get('name','Gracz'+Math.floor(Math.random()*90+10)),color:LS.get('color','#d9534f')};

const OPT={lod:LS.get('lod',true),lodD:150,shadowSize:LS.get('shs',2048),pr:LS.get('pxr',1.5)};
/* v145: kod gry podzielony na moduły w katalogu src/ (build.sh wkleja je w to miejsce, w tej kolejności):
   01 rdzeń świata · 02 roślinność · 03 grafika · 04 postać i animacje · 05/15 klasy i perki · 06 walka i łup · 07–10 stwory i zwierzęta · 11 zachowania · 12 życie świata, krew, obrażenia
   13 nawigacja i taktyka wrogów · 14 herby, zbroje, broń · 16 wioski, NPC, zadania · 17 struktury · 18 pojazdy i kompani · 19 dźwięk · 20 wnętrza i lochy · 21 najemnicy · 22 bandy i jeźdźcy · 23 miasta i drogi · 24 edytor wyglądu */
/*@inc:01_rdzen*/
/*@inc:02_roslinnosc*/
/*@inc:03_grafika*/
/*@inc:04_postac*/
/*@inc:05_klasy_dane*/
/*@inc:06_walka_lup*/
/*@inc:07_wrogowie_dane*/
/*@inc:08_zwierzeta*/
/*@inc:09_stwory_fantastyczne*/
/*@inc:10_zwierzeta_modele*/
/*@inc:11_zachowania*/
/*@inc:12_zycie_krew_obrazenia*/
/*@inc:13_nawigacja_taktyka*/
/*@inc:14_herb_zbroja*/
/*@inc:15_klasy_logika*/
/*@inc:16_wioski_questy*/
/*@inc:17_struktury*/
/*@inc:18_pojazdy_kompani*/
/*@inc:19_dzwiek*/
/*@inc:20_wnetrza_lochy*/
/*@inc:21_najemnicy*/
/*@inc:22_bandy_jezdzcy*/
/*@inc:23_miasta_drogi*/
/*@inc:24_edytor_wygladu*/
/*@inc:25_przygoda*/
/*@inc:26_slawa*/
/*@inc:27_efekty*/
}
window.__mainReady=true;
