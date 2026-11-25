// =================== DŹWIĘK I MUZYKA (WebAudio, wszystko syntezowane) ===================
const AUD={ctx:null,on:false,mus:null,fx:null,rev:null,volM:LS.get('volM',0.55),volF:LS.get('volF',0.8),last:{}};
function audInit(){if(AUD.ctx){if(AUD.ctx.state==='suspended')AUD.ctx.resume();return}
  try{const C=new (window.AudioContext||window.webkitAudioContext)();AUD.ctx=C;const comp=C.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=3;comp.connect(C.destination);
    AUD.master=C.createGain();AUD.master.gain.value=0.9;AUD.master.connect(comp);
    AUD.mus=C.createGain();AUD.mus.gain.value=AUD.volM*0.5;AUD.mus.connect(AUD.master);AUD.fx=C.createGain();AUD.fx.gain.value=AUD.volF;AUD.fx.connect(AUD.master);AUD.amb=C.createGain();AUD.amb.gain.value=SET_G.amb;AUD.amb.connect(AUD.master);
    // pogłos: splot z wygenerowaną odpowiedzią impulsową (sala z kamienia)
    const len=C.sampleRate*2.6,ir=C.createBuffer(2,len,C.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)*(i<C.sampleRate*0.012?0.3:1)}
    AUD.rev=C.createConvolver();AUD.rev.buffer=ir;AUD.revG=C.createGain();AUD.revG.gain.value=0.32;AUD.rev.connect(AUD.revG);AUD.revG.connect(AUD.master);
    AUD.noise=C.createBuffer(1,C.sampleRate,C.sampleRate);{const d=AUD.noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
    AUD.on=true;MUS.next=C.currentTime+0.3;
  }catch(e){AUD.ctx=null}}
addEventListener('pointerdown',audInit);addEventListener('keydown',audInit);
// ---------- efekty ----------
function env(g,t,a,d,peak,sus){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(Math.max(0.0001,sus||0.0001),t+a+d)}
function nz(t,dur,f0,f1,q,vol,type,dest){const C=AUD.ctx,s=C.createBufferSource();s.buffer=AUD.noise;s.loop=true;const fl=C.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);fl.Q.value=q||1;const g=C.createGain();env(g,t,0.004,dur,vol);s.connect(fl);fl.connect(g);g.connect(dest||AUD.cur||AUD.fx);s.start(t,Math.random());s.stop(t+dur+0.05)}
function tn(t,dur,f0,f1,type,vol,dest,a){const C=AUD.ctx,o=C.createOscillator();o.type=type||'sine';o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=C.createGain();env(g,t,a||0.005,dur,vol);o.connect(g);g.connect(dest||AUD.cur||AUD.fx);o.start(t);o.stop(t+dur+0.05)}
const AMBN={chirp:1,cricket:1,frog:1,wind:1,wave:1,owl:1,pecker:1,stream:1,crowd:1,bell:1,leaves:1,gull:1,wolfd:1,crow:1};
const SFXGAP={step:0.12,eblade:0.05,eblunt:0.05,hit:0.04,crit:0.05,hurt:0.15,swing:0.06,coin:0.05};
function sfx(n,vol){if(!AUD.on)return;const C=AUD.ctx,t=C.currentTime,k=vol??1,r=0.92+Math.random()*0.16;if(AUD.last[n]&&t-AUD.last[n]<(SFXGAP[n]||0.03))return;AUD.last[n]=t;
  AUD.cur=AMBN[n]?AUD.amb:null;
  switch(n){
    case 'clang':tn(t,0.45,1800*r,1720,'square',0.04*k);tn(t,0.55,2650*r,2580,'triangle',0.07*k);nz(t,0.07,5200,2200,1.2,0.25*k);break;
    case 'thud':tn(t,0.2,95*r,40,'sine',0.6*k);nz(t,0.12,700,150,0.7,0.3*k,'lowpass');break;
    case 'whoosh':nz(t,0.26,420*r,2600,0.7,0.22*k);break;
    case 'kill':tn(t,0.38,230*r,70,'sawtooth',0.1*k);nz(t,0.3,900,200,0.6,0.22*k);break;
    case 'bite':nz(t,0.06,2600*r,900,1.5,0.35*k);tn(t,0.08,320*r,120,'square',0.07*k);break;
    case 'claw':nz(t,0.16,3600*r,1200,2,0.3*k);nz(t+0.06,0.14,4100*r,1500,2,0.2*k);break;
    case 'slam':tn(t,0.55,72*r,30,'sine',0.8*k);nz(t,0.45,420,60,0.5,0.45*k,'lowpass');break;
    case 'hiss':nz(t,0.65,5200*r,3600,0.8,0.16*k,'highpass');break;
    case 'squelch':tn(t,0.25,230*r,90,'sine',0.3*k);nz(t,0.2,700*r,300,3,0.18*k);break;
    case 'screech':tn(t,0.5,1400*r,880,'sawtooth',0.06*k);tn(t,0.5,1460*r,930,'square',0.035*k);break;
    case 'howl':tn(t,1.5,360*r,540,'sine',0.11*k,undefined,0.4);tn(t+0.9,1.1,540*r,300,'sine',0.09*k);break;
    case 'neigh':tn(t,0.55,700*r,1150,'sawtooth',0.05*k);tn(t+0.3,0.55,1050*r,480,'sawtooth',0.045*k);break;
    case 'moo':tn(t,1.0,145*r,108,'sawtooth',0.09*k,undefined,0.15);break;
    case 'baa':tn(t,0.6,430*r,380,'sawtooth',0.06*k);tn(t+0.05,0.5,445*r,390,'triangle',0.04*k);break;
    case 'oink':tn(t,0.14,310*r,200,'square',0.07*k);tn(t+0.18,0.12,290*r,185,'square',0.06*k);break;
    case 'cluck':tn(t,0.07,920*r,600,'square',0.05*k);tn(t+0.12,0.07,960*r,640,'square',0.045*k);break;
    case 'quack':tn(t,0.18,520*r,360,'sawtooth',0.08*k);nz(t,0.15,1200,800,4,0.09*k);break;
    case 'bark':tn(t,0.12,520*r,250,'sawtooth',0.1*k);nz(t,0.1,1500,700,2,0.14*k);break;
    case 'meow':tn(t,0.5,620*r,920,'triangle',0.07*k);break;
    case 'bearroar':tn(t,0.9,112*r,70,'sawtooth',0.16*k);nz(t,0.8,520,150,0.8,0.22*k);break;
    case 'snort':nz(t,0.25,900*r,400,1.5,0.28*k);break;
    case 'crackle':for(let i=0;i<6;i++)nz(t+i*0.05+Math.random()*0.03,0.03,2400+Math.random()*2400,1200,3,0.12*k);break;
    case 'rattle':for(let i=0;i<6;i++)tn(t+i*0.045,0.03,1200*r+i*90,900,'square',0.045*k);break;
    case 'grunt':tn(t,0.26,125*r,90,'sawtooth',0.13*k);break;
    case 'moan':tn(t,1.4,265*r,175,'sine',0.09*k,undefined,0.5);tn(t,1.4,268*r,178,'triangle',0.04*k,undefined,0.5);break;
    case 'chirp':for(let i=0;i<3;i++)tn(t+i*0.11,0.07,3200*r+i*300,4300*r,'sine',0.035*k);break;
    case 'cricket':for(let i=0;i<4;i++)tn(t+i*0.06,0.03,4800*r,4800,'square',0.01*k);break;
    case 'frog':tn(t,0.15,180*r,140,'square',0.05*k);tn(t+0.2,0.15,170*r,130,'square',0.045*k);break;
    case 'wind':nz(t,2.6,300*r,650,0.4,0.05*k);break;
    case 'wave':nz(t,1.9,520*r,200,0.5,0.06*k,'lowpass');break;
    case 'flap':nz(t,0.13,520*r,260,0.8,0.18*k);break;
    case 'hit':nz(t,0.12,1800*r,300,0.8,0.35*k);tn(t,0.12,140*r,60,'sine',0.4*k);break;
    case 'crit':nz(t,0.16,3200*r,500,0.9,0.4*k);tn(t,0.18,180*r,55,'triangle',0.45*k);tn(t+0.01,0.25,1400*r,900,'square',0.06*k);break;
    case 'swing':nz(t,0.18,900*r,3200,1.6,0.18*k,'bandpass');break;
    case 'bow':tn(t,0.25,220*r,200,'triangle',0.25*k);nz(t+0.02,0.22,2600,800,2,0.14*k);break;
    case 'magic':tn(t,0.45,400*r,1600,'sine',0.18*k,AUD.rev);tn(t+0.05,0.4,800*r,2400,'triangle',0.08*k,AUD.rev);nz(t,0.4,4000,6000,4,0.05*k,'bandpass',AUD.rev);break;
    case 'hurt':tn(t,0.22,240*r,110,'sawtooth',0.12*k);nz(t,0.1,700,300,1,0.2*k,'lowpass');break;
    case 'step':nz(t,0.07,420*r,200,0.7,0.09*k,'lowpass');break;
    case 'stepw':nz(t,0.16,900*r,300,0.6,0.1*k,'bandpass');break;
    case 'jump':nz(t,0.12,500,1200,1,0.08*k,'bandpass');break;
    case 'land':nz(t,0.1,300,120,0.7,0.16*k,'lowpass');break;
    case 'splash':nz(t,0.5,2400,300,0.6,0.28*k,'lowpass');nz(t+0.05,0.35,5000,1500,1.2,0.08*k);break;
    case 'coin':tn(t,0.09,1320*r,0,'square',0.06*k);tn(t+0.07,0.22,1760*r,0,'square',0.06*k);break;
    case 'lvl':[523,659,784,1047,1319].forEach((f,i)=>tn(t+i*0.09,0.5,f,0,'triangle',0.13*k,AUD.rev));break;
    case 'tame':[784,988,1175,1568].forEach((f,i)=>tn(t+i*0.12,0.7,f,0,'sine',0.12*k,AUD.rev));break;
    case 'open':nz(t,0.5,300,700,6,0.12*k);tn(t+0.3,0.3,880,0,'triangle',0.08*k,AUD.rev);break;
    case 'click':tn(t,0.05,900,600,'triangle',0.06*k);break;
    case 'death':tn(t,1.2,300,60,'sawtooth',0.12*k,AUD.rev);nz(t,0.6,600,100,0.6,0.15*k,'lowpass');break;
    case 'door':nz(t,0.35,180,90,3,0.22*k,'bandpass');tn(t+0.25,0.18,90,60,'sine',0.3*k);break;
    case 'roar':tn(t,0.9,110*r,55,'sawtooth',0.18*k,AUD.rev);nz(t,0.9,500,150,1.2,0.25*k,'lowpass',AUD.rev);break;
    case 'thunder':nz(t,0.25,2400,600,1,0.35*k);nz(t+0.05,2.2,500,40,1,0.55*k);nz(t+0.4,1.6,260,30,1,0.4*k);break;
    case 'growl':tn(t,0.4,160*r,90,'sawtooth',0.07*k);tn(t,0.4,163*r,92,'sawtooth',0.05*k);nz(t,0.35,400,200,2,0.08*k,'bandpass');{const C=AUD.ctx,o=C.createOscillator(),lg=C.createGain();o.frequency.value=28;lg.gain.value=40;o.connect(lg);o.start(t);o.stop(t+0.45)}break;
    // --- głosy wrogów wg typu ---
    case 'vhum':tn(t,0.32,180*r,120,'sawtooth',0.07*k,undefined,0.03);nz(t,0.3,900*r,500,3,0.07*k);nz(t,0.3,2200*r,1500,5,0.03*k);break;// okrzyk bojowy
    case 'vhumd':tn(t,0.6,220*r,90,'sawtooth',0.08*k,AUD.rev,0.02);nz(t,0.5,800,300,2,0.08*k);break;// jęk śmierci
    case 'vbone':for(let i=0;i<5;i++)nz(t+i*0.045,0.04,2800*r+i*200,1800,6,0.12*k);break;// klekot kości
    case 'vbeast':tn(t,0.55,95*r,60,'sawtooth',0.12*k);nz(t,0.5,320*r,140,1.5,0.18*k,'lowpass');nz(t+0.05,0.4,1400*r,700,3,0.05*k);break;
    case 'vsmall':tn(t,0.16,700*r,1100,'square',0.04*k);tn(t+0.12,0.14,900*r,600,'square',0.035*k);break;// gobliny, kobold
    case 'vbug':for(let i=0;i<8;i++)tn(t+i*0.03,0.025,2400*r,2000,'square',0.025*k);nz(t,0.25,5000,3000,8,0.04*k);break;
    case 'vghost':tn(t,1.1,520*r,380,'sine',0.06*k,AUD.rev,0.3);tn(t,1.1,527*r,384,'sine',0.05*k,AUD.rev,0.3);nz(t,1,1800,900,6,0.03*k,'bandpass',AUD.rev);break;
    case 'vstone':tn(t,0.7,55*r,35,'sine',0.35*k);nz(t,0.6,180,60,1,0.3*k,'lowpass');nz(t+0.1,0.3,2600,1200,2,0.06*k);break;
    case 'vslime':tn(t,0.3,140*r,260,'sine',0.18*k);tn(t+0.12,0.25,200*r,90,'sine',0.14*k);break;
    case 'vbird':tn(t,0.35,1800*r,1100,'sawtooth',0.05*k);tn(t,0.35,1850*r,1150,'square',0.03*k);break;
    // --- ataki ---
    case 'eblade':nz(t,0.07,6200*r,2600,3,0.18*k);nz(t+0.02,0.16,1400*r,500,1,0.22*k,'lowpass');tn(t,0.12,170*r,70,'sine',0.35*k);break;// cięcie w ciało
    case 'eblunt':tn(t,0.18,85*r,40,'sine',0.6*k);nz(t,0.12,500*r,140,0.8,0.35*k,'lowpass');nz(t,0.04,3000,1500,1,0.1*k);break;
    case 'gore':nz(t,0.22,900*r,250,2,0.25*k,'lowpass');tn(t,0.2,120*r,50,'sine',0.25*k);nz(t+0.08,0.3,2200*r,600,4,0.08*k);break;
    case 'whirl':nz(t,0.5,300*r,2800,1.8,0.22*k);nz(t+0.15,0.35,2600,400,1.8,0.16*k);break;
    case 'block':tn(t,0.3,1100*r,1050,'square',0.05*k);tn(t,0.4,1700*r,1650,'triangle',0.08*k);nz(t,0.06,4000,1800,1,0.25*k);tn(t,0.15,120,60,'sine',0.3*k);break;
    // --- ambient ---
    case 'owl':tn(t,0.35,380*r,340,'sine',0.06*k,AUD.rev,0.06);tn(t+0.55,0.6,400*r,330,'sine',0.07*k,AUD.rev,0.08);break;
    case 'pecker':for(let i=0;i<12;i++)nz(t+i*0.045,0.025,1600*r,900,3,0.08*k*(1-i/14));break;
    case 'stream':nz(t,3,1600*r,1200,0.5,0.03*k);nz(t,3,600*r,500,0.7,0.025*k,'lowpass');break;
    case 'crowd':for(let i=0;i<6;i++){const f=300+Math.random()*400;tn(t+Math.random()*1.5,0.3+Math.random()*0.4,f*r,f*0.85,'sawtooth',0.006*k)}nz(t,2,700,500,1.2,0.025*k);break;
    case 'cheer':for(let i=0;i<14;i++){const f=280+Math.random()*520;tn(t+Math.random()*0.35,0.4+Math.random()*0.5,f*r,f*(1.1+Math.random()*0.3),'sawtooth',0.012*k,AUD.rev,0.04)}nz(t,1.4,1400*r,900,0.9,0.12*k,'bandpass',AUD.rev);nz(t+0.1,1.0,3000,2000,1.4,0.05*k);for(let i=0;i<4;i++)nz(t+0.2+i*0.18,0.06,2200,1800,2,0.06*k);break;
    case 'bell':[0,1].forEach(i=>{tn(t+i*1.1,2.4,392*r,0,'sine',0.06*k,AUD.rev,0.003);tn(t+i*1.1,2,986*r,0,'sine',0.02*k,AUD.rev,0.003);tn(t+i*1.1,1.4,1568*r,0,'sine',0.01*k,AUD.rev)});break;
    case 'leaves':nz(t,2.2,3000*r,4200,0.5,0.03*k,'highpass');break;
    case 'gull':for(let i=0;i<3;i++)tn(t+i*0.22,0.18,1500*r,1100,'sawtooth',0.025*k);break;
    case 'wolfd':tn(t,2,330*r,520,'sine',0.04*k,AUD.rev,0.5);tn(t+1.2,1.2,520*r,300,'sine',0.03*k,AUD.rev);break;
    case 'crow':for(let i=0;i<2;i++){tn(t+i*0.3,0.2,560*r,420,'sawtooth',0.05*k);nz(t+i*0.3,0.2,1200,700,3,0.05*k)}break;
    case 'recruit':[392,494,587,784].forEach((f,i)=>tn(t+i*0.1,0.45,f,0,'square',0.05*k,AUD.rev));break;
  }}
// ---------- muzyka proceduralna: utwory z sekcjami, zmienne tonacje, skale, tempa, instrumenty ----------
const MODES={jonski:[0,2,4,5,7,9,11],miksolidyjski:[0,2,4,5,7,9,10],dorycki:[0,2,3,5,7,9,10],eolski:[0,2,3,5,7,8,10],frygijski:[0,1,3,5,7,8,10],harm:[0,2,3,5,7,8,11]};
const MOODS={
 dzien:{modes:['jonski','miksolidyjski','dorycki'],bpm:[92,112],inst:[['lutnia','flet'],['harfa','flet'],['lutnia','skrzypki'],['harfa','skrzypki']],drum:0.55,dens:0.75,prog:[[0,3,4,0],[0,5,3,4],[0,4,5,3],[0,3,0,4],[0,6,3,0]]},
 noc:{modes:['eolski','dorycki'],bpm:[64,78],inst:[['harfa','flet'],['harfa','dzwon'],['lutnia','flet']],drum:0,dens:0.45,prog:[[0,5,6,0],[0,3,5,4],[0,6,5,6]],drone:1},
 miasto:{modes:['miksolidyjski','jonski','dorycki'],bpm:[104,124],inst:[['lutnia','skrzypki'],['lutnia','flet'],['harfa','skrzypki']],drum:0.9,dens:0.85,prog:[[0,6,3,0],[0,3,4,0],[0,4,3,4],[0,6,0,4]]},
 walka:{modes:['frygijski','harm','eolski'],bpm:[128,150],inst:[['skrzypki','lutnia'],['skrzypki','dzwon']],drum:1,dens:0.95,prog:[[0,1,0,6],[0,5,6,4],[0,6,5,6],[0,3,6,4]],drone:1},
 podziemia:{modes:['frygijski','harm'],bpm:[58,70],inst:[['dzwon','flet'],['harfa','dzwon']],drum:0.25,dens:0.3,prog:[[0,1,0,6],[0,5,0,1]],drone:1},
 karczma:{modes:['miksolidyjski','dorycki','jonski'],bpm:[120,138],inst:[['lutnia','skrzypki'],['lutnia','flet']],drum:1,dens:1,prog:[[0,6,3,0],[0,3,6,4],[0,4,0,6]]}};
const MUS={next:0,mood:'dzien',song:null,bar:0,beat:0};
function mrng(){MUS.seed=(MUS.seed*1664525+1013904223)>>>0;return MUS.seed/4294967296}
var newSong=function(mood){const M=MOODS[mood];MUS.seed=(Math.random()*4294967296)>>>0;const R=mrng;
  const song={mood,root:45+Math.floor(R()*10),mode:MODES[M.modes[Math.floor(R()*M.modes.length)]],bpm:M.bpm[0]+R()*(M.bpm[1]-M.bpm[0]),inst:M.inst[Math.floor(R()*M.inst.length)],
    progs:[M.prog[Math.floor(R()*M.prog.length)],M.prog[Math.floor(R()*M.prog.length)]],form:['A','A','B','A','C','B','A'],sec:0,secBar:0,motifs:{},arp:Math.floor(R()*4),swing:R()<0.4?0.06:0,M};
  for(const s of ['A','B','C'])song.motifs[s]=makeMotif(song,s);MUS.song=song;MUS.bar=0;return song}
function makeMotif(song,sec){const R=mrng,RH=[[1,0.5,0.5,1,1],[0.5,0.5,1,0.5,0.5,1],[1.5,0.5,1,1],[0.5,0.5,0.5,0.5,1,1],[1,1,0.5,0.5,1],[0.75,0.25,1,0.75,0.25,1],[2,1,1],[1,0.5,0.5,0.5,0.5,1]];
  const rh=RH[Math.floor(R()*RH.length)];let deg=Math.floor(R()*5),notes=[];const up=sec==='B'?3:sec==='C'?5:0;
  for(const d of rh){deg+=Math.floor(R()*5)-2;if(R()<0.2)deg+=R()<0.5?3:-3;deg=Math.max(-2,Math.min(9,deg));notes.push([d,deg+up,R()<0.12])}return notes}
function midiHz(n){return 440*Math.pow(2,(n-69)/12)}
function degNote(song,deg,oct){const m=song.mode,L=m.length,o=Math.floor(deg/L),d=((deg%L)+L)%L;return song.root+12*(oct+o)+m[d]}
var playInst=function(name,t,f,dur,vol){const C=AUD.ctx,out=AUD.mus,rv=AUD.rev;
  if(name==='lutnia'||name==='harfa'){const o=C.createOscillator(),o2=C.createOscillator(),fl=C.createBiquadFilter(),g=C.createGain();o.type=name==='lutnia'?'sawtooth':'triangle';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f*2.003;
    fl.type='lowpass';fl.frequency.setValueAtTime(name==='lutnia'?3200:4200,t);fl.frequency.exponentialRampToValueAtTime(name==='lutnia'?500:900,t+Math.min(1.4,dur*1.4));fl.Q.value=name==='lutnia'?2:0.7;
    const d=name==='harfa'?Math.max(1.2,dur*2):Math.max(0.6,dur*1.2);env(g,t,0.003,d,vol*(name==='lutnia'?0.5:0.6));const g2=C.createGain();g2.gain.value=0.25;o.connect(fl);o2.connect(g2);g2.connect(fl);fl.connect(g);g.connect(out);g.connect(rv);o.start(t);o2.start(t);o.stop(t+d+0.1);o2.stop(t+d+0.1)}
  else if(name==='flet'||name==='skrzypki'){const o=C.createOscillator(),lfo=C.createOscillator(),lg=C.createGain(),g=C.createGain(),fl=C.createBiquadFilter();o.type=name==='flet'?'sine':'sawtooth';o.frequency.value=f;lfo.frequency.value=5+Math.random();lg.gain.value=f*(name==='flet'?0.006:0.009);lfo.connect(lg);lg.connect(o.frequency);
    fl.type=name==='flet'?'lowpass':'bandpass';fl.frequency.value=name==='flet'?2600:f*2.2;fl.Q.value=name==='flet'?0.5:0.9;
    const a=name==='flet'?0.06:0.09;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol*(name==='flet'?0.32:0.22),t+a);g.gain.setValueAtTime(vol*(name==='flet'?0.28:0.2),t+Math.max(a,dur*0.8));g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.18);
    o.connect(fl);fl.connect(g);g.connect(out);g.connect(rv);o.start(t);lfo.start(t);o.stop(t+dur+0.25);lfo.stop(t+dur+0.25);
    if(name==='flet')nz(t,0.08,2200,1800,1,vol*0.03,'bandpass',out)}
  else if(name==='dzwon'){for(const [m,v,d] of [[1,0.3,2.5],[2.76,0.12,1.4],[5.4,0.06,0.8]])tn(t,d,f*m,0,'sine',vol*v,rv,0.002);tn(t,1.5,f,0,'sine',vol*0.15,out,0.002)}
  else if(name==='bas'){const o=C.createOscillator(),g=C.createGain(),fl=C.createBiquadFilter();o.type='triangle';o.frequency.value=f;fl.type='lowpass';fl.frequency.value=600;env(g,t,0.01,dur,vol*0.45);o.connect(fl);fl.connect(g);g.connect(out);o.start(t);o.stop(t+dur+0.1)}
  else if(name==='dron'){for(const det of [-4,4]){const o=C.createOscillator(),g=C.createGain(),fl=C.createBiquadFilter();o.type='sawtooth';o.frequency.value=f;o.detune.value=det;fl.type='lowpass';fl.frequency.value=380;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol*0.07,t+dur*0.3);g.gain.exponentialRampToValueAtTime(0.0001,t+dur+0.4);o.connect(fl);fl.connect(g);g.connect(out);g.connect(rv);o.start(t);o.stop(t+dur+0.5)}}
  else if(name==='beben'){tn(t,0.35,f||110,45,'sine',vol*0.55,out,0.002);nz(t,0.06,900,300,1,vol*0.08,'lowpass',out)}
  else if(name==='tamburyn'){nz(t,0.09,9000,6000,1.5,vol*0.07,'highpass',out)}}
/*MUSIC2*/

function musicTick(){if(!AUD.on||AUD.volM<=0.001)return;const C=AUD.ctx;
  if(!MUS.song||(MUS.wantMood&&MUS.wantMood!==MUS.song.mood&&MUS.bar%2===0)||MUS.song.done)newSong(MUS.wantMood||'dzien');
  while(MUS.next<C.currentTime+0.6){const s=MUS.song,spb=60/s.bpm,t0=MUS.next,sec=s.form[s.sec],prog=s.progs[sec==='B'?1:0],chord=prog[s.secBar%4]+(sec==='C'&&s.secBar%4===3?1:0),M=s.M;
    // akompaniament: arpeggio / akordy
    const acc=s.inst[0],pat=[[0,2,4,2],[0,4,2,4],[0,2,4,7],[0,4,7,4]][s.arp];
    for(let b=0;b<4;b++){const sub=M.dens>0.6?2:1;for(let q=0;q<sub;q++){if(mrng()>M.dens+0.2)continue;const deg=chord+pat[(b*sub+q)%4],tt=t0+(b+q/sub)*spb+(q===1?s.swing*spb:0);playInst(acc,tt,midiHz(degNote(s,deg,0)),spb/sub*0.9,0.6)}}
    playInst('bas',t0,midiHz(degNote(s,chord,-1)),spb*1.8,0.8);if(M.dens>0.5)playInst('bas',t0+2*spb,midiHz(degNote(s,chord+4,-1)),spb*1.6,0.6);
    if(M.drone&&s.secBar%2===0)playInst('dron',t0,midiHz(degNote(s,0,-1)),spb*8,1);
    // perkusja
    if(M.drum>0&&mrng()<M.drum+0.2){const dp=s.bar%4===3?[0,1,1.5,2,2.5,3,3.5]:[0,1.5,2,3];for(const b of dp)playInst('beben',t0+b*spb,b%2===0?95:150,0,b===0?1:0.6);if(M.drum>0.6)for(let b=0;b<8;b++)if(b%2===1||mrng()<0.3)playInst('tamburyn',t0+b*spb/2+s.swing*spb,0,0,0.8)}
    // melodia: motyw sekcji z wariacjami (przesunięcie do akordu, ozdobniki, odpowiedź kończąca na tonice)
    if(M.kotly&&s.secBar%2===0){playInst('kotly',t0,midiHz(degNote(s,0,-2)),0,1);playInst('kotly',t0+2*spb,midiHz(degNote(s,4,-2)),0,0.8)}
    if(s.tune||!(sec==='A'&&s.secBar<2&&s.sec===0)){const mo=MOTIF_HOOK(s,sec)||s.motifs[sec],lead=s.inst[1];let tt=t0,dsum=0;const shift=s.secBar%4===2?(mrng()<0.5?2:-1):0,last=s.secBar%4===3;
      for(let i=0;i<mo.length&&dsum<4;i++){const [d,deg,rest]=mo[i];if(!rest&&(s.tune||mrng()<0.92)){let dg=s.tune?deg:deg+shift+(chord>3?chord-7:chord)*0.5|0;if(!s.tune&&last&&i===mo.length-1)dg=7*Math.round(dg/7);playInst(lead,tt,midiHz(degNote(s,dg,1)),d*spb*0.95,0.7);if(s.tune&&d>=1&&s.harm)playInst(s.harm,tt,midiHz(degNote(s,dg-2,1)),d*spb*0.9,0.32);
          if(mrng()<0.12&&d>=1)playInst(lead,tt+d*spb*0.5,midiHz(degNote(s,dg+1,1)),d*spb*0.4,0.5)}tt+=d*spb;dsum+=d}}
    MUS.next+=4*spb;MUS.bar++;s.secBar++;if(s.secBar>=8){s.secBar=0;s.sec++;if(s.sec===3)s.root+=mrng()<0.5?2:-2;if(s.sec>=s.form.length)s.done=true}}}
$('quitgame').onclick=()=>{try{saveInv();saveW()}catch(_){}try{if(NET.tr)NET.tr.send({t:'fx',from:NET.id,k:'toast',txt:(S.name||'Gracz')+' wyszedł z gry',col:'#d2c29e'})}catch(_){}
  setTimeout(()=>{try{window.close()}catch(_){}setTimeout(()=>{document.body.innerHTML='<div style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#140c06;color:#f2e6cc;font:18px Poppins,sans-serif;gap:10px"><b style="font-size:26px">Gra zapisana</b><span>Możesz zamknąć tę kartę lub okno.</span><button onclick="location.reload()" style="margin-top:10px;padding:8px 18px">Wróć do gry</button></div>'},300)},150)};
{const ap=()=>{renderer.domElement.style.filter=(SET_G.bright!==1||(SET_G.sat??1)!==1)?`brightness(${SET_G.bright}) saturate(${SET_G.sat??1})`:''};ap();
  const bind=(id,k,num,cb)=>{const el=$(id);if(!el)return;if(el.type==='checkbox')el.checked=!!SET_G[k];else el.value=SET_G[k]??1;el.oninput=el.onchange=()=>{SET_G[k]=el.type==='checkbox'?el.checked:+el.value;saveSetG();cb&&cb()}};
  bind('vola','amb',1,()=>{if(AUD.amb)AUD.amb.gain.value=SET_G.amb});bind('gpfx','pfx');bind('gfps','fps');bind('gfog','fog');bind('gblood','blood');bind('gshake','shake');bind('gnums','nums');
  bind('gbr','bright',1,()=>{$('gbrv').textContent=Math.round(SET_G.bright*100);ap()});bind('gsat','sat',1,()=>{$('gsatv').textContent=Math.round(SET_G.sat*100);ap()});$('gbrv').textContent=Math.round(SET_G.bright*100);$('gsatv').textContent=Math.round((SET_G.sat??1)*100)}
$('volm').value=AUD.volM;$('volf').value=AUD.volF;$('volm').oninput=e=>{AUD.volM=+e.target.value;LS.set('volM',AUD.volM);if(AUD.mus)AUD.mus.gain.value=AUD.volM*0.5};$('volf').oninput=e=>{AUD.volF=+e.target.value;LS.set('volF',AUD.volF);if(AUD.fx)AUD.fx.gain.value=AUD.volF};
let musT=0;function audioTick(dt){if(!AUD.on)return;musT+=dt;if(musT>2){musT=0;MUS.wantMood=musicMood()}musicTick()}

