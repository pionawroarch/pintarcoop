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
  for(let i=0;i<C.length;i++)for(let j=i+1;j<C.length;j++){const a=C[i],b=C[j];if(a.chat||b.chat)continue;const d=Math.hypot(a.x-b.x,a.z-b.z);if(d>3.6||d<0.5)continue;if(Math.random()>0.35){CHAT.cd.set(a.id,now+4);continue}
    const L=pickChat(a,b);if(!L)continue;const c={p:[a,b],L,i:0,next:now+0.3};a.chat=c;b.chat=c;CHAT.on.push(c);if(CHAT.on.length>=4)return}
  // w spokojnych miejscach mieszkańcy sami podchodzą do siebie, żeby pogadać
  if(SPC&&SPC.live){const W2=C.filter(n=>n.wan&&!n.chat&&n.wan.tx==null&&n.wan.t<=0.5);if(W2.length&&Math.random()<0.5){const a=W2[Math.floor(Math.random()*W2.length)];let best=null,bd=a.wan.r||7;for(const b of C){if(b===a||b.chat)continue;const d=Math.hypot(b.x-a.x,b.z-a.z);if(d<bd&&d>2){bd=d;best=b}}if(best){const ang=Math.random()*6.28;a.wan.tx=best.x+Math.sin(ang)*1.4;a.wan.tz=best.z+Math.cos(ang)*1.4}}}}
