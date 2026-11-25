// ===== v158: animowane gorące źródła, gejzery, para z rur, bulgocząca smoła, żarzące się meteoryty i lawa =====
// miękkie kłęby pary/dymu (punkty z cieniowaniem), krople wody, iskry i bąble przez istniejący PFX (sześcienne cząstki)
const SMK=(()=>{const N=1600,pos=new Float32Array(N*3),pc=new Float32Array(N*3),sz=new Float32Array(N),al=new Float32Array(N);
  const X=new Float32Array(N*3),V=new Float32Array(N*3),L=new Float32Array(N*2),S=new Float32Array(N*3);let n=0;
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('pc',new THREE.BufferAttribute(pc,3));g.setAttribute('size',new THREE.BufferAttribute(sz,1));g.setAttribute('alpha',new THREE.BufferAttribute(al,1));
  const m=new THREE.ShaderMaterial({uniforms:{uScale:{value:400},uFar:{value:160},uFogC:{value:new THREE.Color(0xcfe0ee)}},transparent:true,depthWrite:false,
    vertexShader:`#include <common>
#include <logdepthbuf_pars_vertex>
attribute float size;attribute float alpha;attribute vec3 pc;varying vec3 vC;varying float vA;varying float vF;uniform float uScale,uFar;
void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;float d=-mv.z;gl_PointSize=clamp(size*uScale/max(d,0.5),1.,512.);vC=pc;vF=smoothstep(uFar*0.35,uFar,d);vA=alpha*(1.-smoothstep(uFar*0.75,uFar,d));
#include <logdepthbuf_vertex>
}`,
    fragmentShader:`#include <common>
#include <logdepthbuf_pars_fragment>
uniform vec3 uFogC;varying vec3 vC;varying float vA;varying float vF;
void main(){
#include <logdepthbuf_fragment>
vec2 p=gl_PointCoord-.5;float r=length(p);if(r>.5)discard;float k=smoothstep(.5,.12,r);gl_FragColor=vec4(mix(vC*(0.86+0.14*(0.5-p.y)),uFogC,vF*0.7),vA*k);}`});
  const pts=new THREE.Points(g,m);pts.frustumCulled=false;pts.renderOrder=4;scene.add(pts);
  return{get n(){return n},
    emit(x,y,z,vx,vy,vz,life,s0,s1,a,col){if(n>=N)return;if(SET_G.pfx<1&&Math.random()>SET_G.pfx)return;const i=n++;X[i*3]=x;X[i*3+1]=y;X[i*3+2]=z;V[i*3]=vx;V[i*3+1]=vy;V[i*3+2]=vz;L[i*2]=0;L[i*2+1]=life;S[i*3]=s0;S[i*3+1]=s1;S[i*3+2]=a;
      const c=col||[0.95,0.97,1];pc[i*3]=c[0];pc[i*3+1]=c[1];pc[i*3+2]=c[2]},
    tick(dt){for(let i=0;i<n;i++){L[i*2]+=dt;if(L[i*2]>=L[i*2+1]){const j=--n;if(i!==j){for(let k=0;k<3;k++){X[i*3+k]=X[j*3+k];V[i*3+k]=V[j*3+k];S[i*3+k]=S[j*3+k];pc[i*3+k]=pc[j*3+k]}L[i*2]=L[j*2];L[i*2+1]=L[j*2+1]}i--;continue}
        const dr=Math.max(0,1-0.35*dt);V[i*3]*=dr;V[i*3+2]*=dr;V[i*3+1]*=Math.max(0,1-0.12*dt);X[i*3]+=V[i*3]*dt;X[i*3+1]+=V[i*3+1]*dt;X[i*3+2]+=V[i*3+2]*dt;
        const t=L[i*2]/L[i*2+1];pos[i*3]=X[i*3];pos[i*3+1]=X[i*3+1];pos[i*3+2]=X[i*3+2];sz[i]=S[i*3]+(S[i*3+1]-S[i*3])*Math.sqrt(t);al[i]=S[i*3+2]*Math.min(1,t*6)*(1-t)*(1-t)}
      g.setDrawRange(0,n);for(const k of ['position','pc','size','alpha'])g.attributes[k].needsUpdate=true;
      m.uniforms.uScale.value=renderer.domElement.height/(2*Math.tan(camera.fov*Math.PI/360));if(scene.fog){m.uniforms.uFar.value=scene.fog.far;m.uniforms.uFogC.value.copy(scene.fog.color)}pts.visible=!SPC||SPC.kind!=='interior'}}})();

const ENVK=(()=>{const o={};for(const k of ['spring','geyser','pipe','tarpit','meteor'])o[TK.indexOf(k)]=k;return o})();
let ENVE=[],ENVscan=0;const ENVW={x:0.35,z:0.18};
function envFxScan(){ENVE=[];const p=player.p,R=Math.min(170,(scene.fog&&scene.fog.far)||150),cx=Math.floor(p.x/C),cz=Math.floor(p.z/C),cr=Math.ceil(R/C);
  for(let dz=-cr;dz<=cr;dz++)for(let dx=-cr;dx<=cr;dx++){const ch=chunks.get(K(cx+dx,cz+dz));if(!ch||!ch.decos)continue;const D=ch.decos;
    if(!D.__fx){D.__fx=[];for(let i=0;i<D.length;i+=6)if(ENVK[D[i]])D.__fx.push(i)}
    for(const i of D.__fx){const k=ENVK[D[i]],x=D[i+1],z=D[i+3],d=Math.hypot(x-p.x,z-p.z);if(d>R)continue;const s=D[i+4]*(SCL[k]||TS)/16/* jednostki modelu wokselowego: 1/16 */,a=Math.floor(D[i+5]/(Math.PI/2))*Math.PI/2;
      ENVE.push({k,x,y:D[i+2],z,s,c:Math.cos(a),sn:Math.sin(a),d,ph:Math.abs(Math.sin(x*12.9898+z*78.233))*1000})}}}
// punkt modelu (jednostki modelu) → świat
const envL=(e,lx,ly,lz)=>[e.x+(lx*e.c+lz*e.sn)*e.s,e.y+ly*e.s,e.z+(-lx*e.sn+lz*e.c)*e.s];
const RNf=(a,b)=>a+Math.random()*(b-a);
function envSteam(e,lx,ly,lz,r,rate,dt,sMul,up){const n=rate*dt;let c=Math.floor(n)+(Math.random()<n%1?1:0);while(c-->0){const q=envL(e,lx+RNf(-r,r),ly,lz+RNf(-r,r)),u=e.s;
  SMK.emit(q[0],q[1],q[2],ENVW.x*RNf(0.5,1.5)+RNf(-0.2,0.2),(up||1)*RNf(0.9,1.8),ENVW.z*RNf(0.5,1.5)+RNf(-0.2,0.2),RNf(2.6,4.8),u*6*sMul,u*18*sMul,RNf(0.32,0.5))}}
function envFxTick(dt){if(SPC)return;ENVscan-=dt;if(ENVscan<=0){ENVscan=0.6;try{envFxScan()}catch(err){ENVE=[]}}
  const p=player.p,T=(typeof worldT==='number'?worldT:performance.now()/1000);
  for(const e of ENVE){const d=Math.hypot(e.x-p.x,e.z-p.z);const lod=d<55?1:d<100?0.55:0.3,u=e.s;
    if(e.k==='spring'){/* 3 kominki pary nad wodą, bąbelki na tafli, okresowe wybulgnięcie */
      for(const [x,z] of [[0,0],[-6,4],[5,-5]])envSteam(e,x,2,z,1.5,2.2*lod,dt,0.8,0.8);
      if(d<70&&Math.random()<dt*7){const a=Math.random()*6.283,r=Math.random()*12,q=envL(e,Math.cos(a)*r,1.9,Math.sin(a)*r);PFX.emit(q[0],q[1],q[2],1,['#ffffff','#dff6fa','#bfeaf0'],{sp:0.3,up:0.9,life:0.45,size:Math.max(0.05,u*0.6),g:3})}
      const cyc=(T*0.25+e.ph)%6;if(d<80&&cyc<0.06){const q=envL(e,0,2,0);PFX.emit(q[0],q[1],q[2],10,['#ffffff','#cfeff5'],{sp:1.2,up:2.2,life:0.7,size:Math.max(0.06,u*0.7),g:6})}}
    else if(e.k==='geyser'){/* cykl: spokojna para → narastanie → wybuch kolumny wody i pary → opadanie */
      const P=16+(e.ph%9),t=(T+e.ph)%P,H=Math.min(26,120*u),v0=Math.sqrt(2*9.8*H),top=envL(e,0,10.8,0);
      if(t<P-6)envSteam(e,0,10.8,0,1.4,2.5*lod,dt,0.7,0.8);
      else if(t<P-4.5){envSteam(e,0,10.8,0,1.6,9*lod,dt,0.8,1.6);if(d<80&&Math.random()<dt*10)PFX.emit(top[0],top[1],top[2],2,['#ffffff','#d8f2f8'],{sp:1,up:3,life:0.4,size:Math.max(0.06,u*0.8),g:9})}
      else{const k=t-(P-4.5),pw=k<0.6?k/0.6:k>3.6?Math.max(0,(4.5-k)/0.9):1,n=(70*lod)*pw*dt;let c=Math.floor(n)+(Math.random()<n%1?1:0);
        if(k<0.05&&!e.boom&&d<90){e.boom=1;try{sfx('splash',Math.max(0.15,1-d/90))}catch(_){}}if(k>1)e.boom=0;
        while(c-->0){const vv=v0*RNf(0.75,1.05)*pw,sp=v0*0.06;PFX.emit(top[0]+RNf(-0.3,0.3)*u*4,top[1],top[2]+RNf(-0.3,0.3)*u*4,1,['#ffffff','#e8f8fc','#c8ecf4','#9ad8e8'],{sp:0,up:vv,dx:RNf(-sp,sp)+ENVW.x,dz:RNf(-sp,sp)+ENVW.z,life:2*vv/9.8*0.95,size:Math.max(0.1,u*RNf(1.2,2.2)),g:9.8})}
        envSteam(e,0,10.8,0,2,16*lod*pw,dt,1.3,v0*0.35);if(Math.random()<dt*14*pw){const q=envL(e,0,10.8,0);SMK.emit(q[0],q[1]+H*RNf(0.5,0.95),q[2],ENVW.x*2,RNf(1,2.5),ENVW.z*2,RNf(3,5),u*8,u*22,0.45)}}}
    else if(e.k==='pipe'){/* syk pary z kominów: stały strumień + co kilka sekund mocny wyrzut */
      const burst=((T*0.33+e.ph)%4)<0.5;for(const [x,y] of [[0.3,33],[-10,27]])envSteam(e,x,y,0,0.6,(burst?14:3)*lod,dt,burst?0.9:0.6,burst?2.6:1.1)}
    else if(e.k==='tarpit'){/* czarne bąble smoły: rosną i pękają, rzadki dym */
      if(d<70&&Math.random()<dt*5){const q=envL(e,RNf(-10,10),2.3,RNf(-8,8));PFX.emit(q[0],q[1],q[2],1,['#141210','#22201c','#3a342c'],{sp:0.15,up:0.7,life:0.6,size:Math.max(0.12,u*1.6),g:2})}
      if(Math.random()<dt*0.8*lod){const q=envL(e,RNf(-8,8),2,RNf(-6,6));SMK.emit(q[0],q[1],q[2],ENVW.x,RNf(0.4,0.8),ENVW.z,RNf(3,5),u*3,u*9,0.3,[0.22,0.2,0.18])}}
    else if(e.k==='meteor'){/* żar ze szczelin i ciemny dym */
      if(d<80&&Math.random()<dt*6){const q=envL(e,RNf(-12,12),RNf(4,22),RNf(-10,10));PFX.emit(q[0],q[1],q[2],1,['#ff7a1a','#ffb040','#ffd060'],{sp:0.4,up:1.6,life:1.1,size:Math.max(0.05,u*0.5),g:-0.4})}
      envSteam(e,0,28,0,4,1.6*lod,dt,0.9,0.7);}}
  // fontanna-studnia na rynku: tryskająca woda i strugi spadające z górnej czaszy
  for(const v of villages.values()){if(!v||!v.g||!v.city||(RBASE[v.race]||v.race)!=='ludzie')continue;/* v160: fontanna jest tylko na rynku miast w stylu ludzi */if(Math.abs(v.x-p.x)>140||Math.abs(v.z-p.z)>140)continue;if(!v._fxM){try{v._fxM=v.city?cityPlan(v).M:[0,0]}catch(_){v._fxM=[0,0]}}
    const fx=v.x+v._fxM[0],fz=v.z+v._fxM[1],fy=v.h+(v.city&&v.lv?v.lv[0]:0),d=Math.hypot(fx-p.x,fz-p.z);if(d>60)continue;
    if(Math.random()<dt*9)PFX.emit(fx,fy+3.25,fz,1,['#ffffff','#d8f0fa','#9ad0ec'],{sp:0.9,up:2.6,life:0.75,size:0.07,g:9.8});
    if(Math.random()<dt*14){const a=Math.random()*6.283;PFX.emit(fx+Math.cos(a)*0.95,fy+2.5,fz+Math.sin(a)*0.95,1,['#e8f6ff','#bfe2f4','#8cc4e4'],{sp:0,up:0,dx:Math.cos(a)*0.5,dz:Math.sin(a)*0.5,life:0.55,size:0.06,g:9.8})}}
  // lawa (biom 17): iskry i kłęby dymu nad płynącą lawą wokół gracza
  if(biomeAt(p.x,p.z)===17||biomeAt(p.x+30,p.z)===17||biomeAt(p.x-30,p.z)===17||biomeAt(p.x,p.z+30)===17||biomeAt(p.x,p.z-30)===17){
    for(let k=0;k<3;k++){if(Math.random()>dt*14)continue;const a=Math.random()*6.283,r=RNf(4,45),x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;if(biomeAt(x,z)!==17)continue;const h=colAt(x,z);if(h===null)continue;
      PFX.emit(x,h+0.3,z,1+(Math.random()<0.3?2:0),['#ff5a10','#ff8a20','#ffc040','#fff0a0'],{sp:0.8,up:RNf(2,4.5),life:RNf(0.9,1.8),size:RNf(0.05,0.11),g:-0.6,drag:0.4})}
    if(Math.random()<dt*2.2){const a=Math.random()*6.283,r=RNf(10,60),x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;if(biomeAt(x,z)===17){const h=colAt(x,z);if(h!==null)SMK.emit(x,h+0.5,z,ENVW.x*1.5,RNf(0.8,1.6),ENVW.z*1.5,RNf(4,7),2.5,8,0.32,[0.32,0.28,0.26])}}
    if(Math.random()<dt*0.7){const a=Math.random()*6.283,r=RNf(5,30),x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;if(biomeAt(x,z)===17){const h=colAt(x,z);if(h!==null)PFX.emit(x,h+0.2,z,8,['#ff6a10','#ffa030','#ffe080'],{sp:2.4,up:4,life:0.9,size:0.1,g:9})}}}}
TICKS.push(dt=>{try{envFxTick(Math.min(dt,0.1))}catch(err){if(!window.__fxErr){window.__fxErr=String(err&&err.stack||err).slice(0,300);console.warn('fx',err)}}SMK.tick(Math.min(dt,0.1))});
