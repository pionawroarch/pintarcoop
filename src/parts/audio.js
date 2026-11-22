// =================== DŹWIĘK I MUZYKA (WebAudio, wszystko syntezowane) ===================
const AUD={ctx:null,on:false,mus:null,fx:null,rev:null,volM:LS.get('volM',0.55),volF:LS.get('volF',0.8),last:{}};
function audInit(){if(AUD.ctx){if(AUD.ctx.state==='suspended')AUD.ctx.resume();return}
  try{const C=new (window.AudioContext||window.webkitAudioContext)();AUD.ctx=C;const comp=C.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=3;comp.connect(C.destination);
    AUD.master=C.createGain();AUD.master.gain.value=0.9;AUD.master.connect(comp);
    AUD.mus=C.createGain();AUD.mus.gain.value=AUD.volM*0.5;AUD.mus.connect(AUD.master);AUD.fx=C.createGain();AUD.fx.gain.value=AUD.volF;AUD.fx.connect(AUD.master);
    // pogłos: splot z wygenerowaną odpowiedzią impulsową (sala z kamienia)
    const len=C.sampleRate*2.6,ir=C.createBuffer(2,len,C.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)*(i<C.sampleRate*0.012?0.3:1)}
    AUD.rev=C.createConvolver();AUD.rev.buffer=ir;AUD.revG=C.createGain();AUD.revG.gain.value=0.32;AUD.rev.connect(AUD.revG);AUD.revG.connect(AUD.master);
    AUD.noise=C.createBuffer(1,C.sampleRate,C.sampleRate);{const d=AUD.noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
    AUD.on=true;MUS.next=C.currentTime+0.3;
  }catch(e){AUD.ctx=null}}
addEventListener('pointerdown',audInit);addEventListener('keydown',audInit);
// ---------- efekty ----------
function env(g,t,a,d,peak,sus){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(Math.max(0.0001,sus||0.0001),t+a+d)}
function nz(t,dur,f0,f1,q,vol,type,dest){const C=AUD.ctx,s=C.createBufferSource();s.buffer=AUD.noise;s.loop=true;const fl=C.createBiquadFilter();fl.type=type||'bandpass';fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(Math.max(30,f1),t+dur);fl.Q.value=q||1;const g=C.createGain();env(g,t,0.004,dur,vol);s.connect(fl);fl.connect(g);g.connect(dest||AUD.fx);s.start(t,Math.random());s.stop(t+dur+0.05)}
function tn(t,dur,f0,f1,type,vol,dest,a){const C=AUD.ctx,o=C.createOscillator();o.type=type||'sine';o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=C.createGain();env(g,t,a||0.005,dur,vol);o.connect(g);g.connect(dest||AUD.fx);o.start(t);o.stop(t+dur+0.05)}
const SFXGAP={step:0.12,hit:0.04,crit:0.05,hurt:0.15,swing:0.06,coin:0.05};
function sfx(n,vol){if(!AUD.on)return;const C=AUD.ctx,t=C.currentTime,k=vol??1,r=0.92+Math.random()*0.16;if(AUD.last[n]&&t-AUD.last[n]<(SFXGAP[n]||0.03))return;AUD.last[n]=t;
  switch(n){
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
    case 'growl':tn(t,0.4,160*r,90,'sawtooth',0.07*k);nz(t,0.35,400,200,2,0.08*k,'bandpass');break;
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
function newSong(mood){const M=MOODS[mood];MUS.seed=(Math.random()*4294967296)>>>0;const R=mrng;
  const song={mood,root:45+Math.floor(R()*10),mode:MODES[M.modes[Math.floor(R()*M.modes.length)]],bpm:M.bpm[0]+R()*(M.bpm[1]-M.bpm[0]),inst:M.inst[Math.floor(R()*M.inst.length)],
    progs:[M.prog[Math.floor(R()*M.prog.length)],M.prog[Math.floor(R()*M.prog.length)]],form:['A','A','B','A','C','B','A'],sec:0,secBar:0,motifs:{},arp:Math.floor(R()*4),swing:R()<0.4?0.06:0,M};
  for(const s of ['A','B','C'])song.motifs[s]=makeMotif(song,s);MUS.song=song;MUS.bar=0;return song}
function makeMotif(song,sec){const R=mrng,RH=[[1,0.5,0.5,1,1],[0.5,0.5,1,0.5,0.5,1],[1.5,0.5,1,1],[0.5,0.5,0.5,0.5,1,1],[1,1,0.5,0.5,1],[0.75,0.25,1,0.75,0.25,1],[2,1,1],[1,0.5,0.5,0.5,0.5,1]];
  const rh=RH[Math.floor(R()*RH.length)];let deg=Math.floor(R()*5),notes=[];const up=sec==='B'?3:sec==='C'?5:0;
  for(const d of rh){deg+=Math.floor(R()*5)-2;if(R()<0.2)deg+=R()<0.5?3:-3;deg=Math.max(-2,Math.min(9,deg));notes.push([d,deg+up,R()<0.12])}return notes}
function midiHz(n){return 440*Math.pow(2,(n-69)/12)}
function degNote(song,deg,oct){const m=song.mode,L=m.length,o=Math.floor(deg/L),d=((deg%L)+L)%L;return song.root+12*(oct+o)+m[d]}
function playInst(name,t,f,dur,vol){const C=AUD.ctx,out=AUD.mus,rv=AUD.rev;
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
function musicMood(){if(typeof curSpaceKind==='function'){const k=curSpaceKind();if(k==='dungeon'||k==='cave')return 'podziemia';if(k==='interior')return 'karczma'}
  for(const e of enemies.values()){if(e.st===2||e.pas)continue;if(Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z)<15&&Math.abs(e.p.y-player.p.y)<8&&(e.mark||e.prov>0))return 'walka'}
  if(inVillage(player.p.x,player.p.z,10))return 'miasto';return hour<5.5||hour>20.5?'noc':'dzien'}
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
    if(!(sec==='A'&&s.secBar<2&&s.sec===0)){const mo=s.motifs[sec],lead=s.inst[1];let tt=t0,dsum=0;const shift=s.secBar%4===2?(mrng()<0.5?2:-1):0,last=s.secBar%4===3;
      for(let i=0;i<mo.length&&dsum<4;i++){const [d,deg,rest]=mo[i];if(!rest&&mrng()<0.92){let dg=deg+shift+(chord>3?chord-7:chord)*0.5|0;if(last&&i===mo.length-1)dg=7*Math.round(dg/7);playInst(lead,tt,midiHz(degNote(s,dg,1)),d*spb*0.95,0.7);
          if(mrng()<0.12&&d>=1)playInst(lead,tt+d*spb*0.5,midiHz(degNote(s,dg+1,1)),d*spb*0.4,0.5)}tt+=d*spb;dsum+=d}}
    MUS.next+=4*spb;MUS.bar++;s.secBar++;if(s.secBar>=8){s.secBar=0;s.sec++;if(s.sec===3)s.root+=mrng()<0.5?2:-2;if(s.sec>=s.form.length)s.done=true}}}
let musT=0;function audioTick(dt){if(!AUD.on)return;musT+=dt;if(musT>2){musT=0;MUS.wantMood=musicMood()}musicTick()}
