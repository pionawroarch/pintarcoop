{
window.__mainOK=true;function whenReady(f,d){setTimeout(function g(){if(!window.__mainReady)return setTimeout(g,150);f()},d||0)}
const C=32, WATER=24, STEP=1.05, PR=0.32, PH=1.75;
const BIOMES=['Ocean','Plaża','Równiny','Las','Pustynia','Tundra','Góry','Bagna','Sawanna','Dżungla','Jesienny las','Kwitnący gaj','Wrzosowisko','Rzeka','Jezioro','Kanion','Wulkaniczne pustkowie','Lawa','Kryształowe pustkowia','Grzybowy las','Przeklęte ziemie','Lodowe iglice','Kryształowa iglica','Lodowa iglica'];
const $=id=>document.getElementById(id);
const LS={get(k,d){try{const v=localStorage.getItem('coop1.'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('coop1.'+k,JSON.stringify(v))}catch(e){}}};

// ---------- ustawienia ----------
const S={fov:LS.get('fov',55),look:LS.get('look',null),rd:Math.min(24,LS.get('rd2',14)),shadows:LS.get('sh',true),seed:LS.get('seed',Math.floor(Math.random()*1e9)),name:LS.get('name','Gracz'+Math.floor(Math.random()*90+10)),color:LS.get('color','#d9534f')};

const OPT={lod:LS.get('lod',true),lodD:150,shadowSize:LS.get('shs',2048),pr:LS.get('pxr',1.5)};
// =================== RDZEŃ PINTARA (skopiowany bez zmian z pintar_kit.html) ===================
function hash(x,y,z=0){let h=(x*374761393+y*668265263+z*2147483647)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}
const V=1/16;
const SEAS_U={uVox:{value:LS.get('voxT',1)},uSnow:{value:0},uAut:{value:0},uSpr:{value:0},uFall:{value:0},uPat:{value:1},uCam:{value:new THREE.Vector3()},uWet:{value:0},uSunW:{value:new THREE.Vector3(0,1,0)},uLamp:{value:Array.from({length:28},()=>new THREE.Vector4(0,-999,0,0))},uLampI:{value:new Array(28).fill(0)},uLampC:{value:Array.from({length:28},()=>new THREE.Vector3(1,.74,.42))}};
const CRT={0:'float s=crH(floor(vLp*vec3(55.,18.,55.)));float b=crN(vLp*7.);diffuseColor.rgb*=0.86+0.11*s+0.13*b;',
 1:'vec2 p=vec2(vLp.x+vLp.y,vLp.z+vLp.y*.5)*26.;p.x+=step(1.,mod(floor(p.y),2.))*.5;vec2 f=fract(p)-.5;float e=max(abs(f.x),abs(f.y));diffuseColor.rgb*=mix(1.07,0.76,smoothstep(.3,.5,e))*(0.93+0.12*crN(vLp*6.));',
 2:'float b=crN(vLp*5.)*.6+crN(vLp*13.)*.4;float cr=1.-smoothstep(0.,.022,abs(crN(vLp*4.+7.)-.5));diffuseColor.rgb*=(0.84+0.26*b)*(1.-cr*.45);',
 3:'float sp=step(.94,crH(floor(vLp*48.)));float bd=crN(vLp*vec3(3.,9.,3.));diffuseColor.rgb*=0.86+0.24*bd;diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*1.5+.05,sp*.55);',
 4:'float b=crN(vLp*9.);float bub=smoothstep(.72,.8,crN(vLp*22.));diffuseColor.rgb*=0.9+0.16*b;diffuseColor.rgb+=bub*.1;',
 5:'diffuseColor.rgb*=0.95+0.06*crH(floor(vLp*70.))+0.05*crN(vLp*9.);',
 6:'diffuseColor.rgb*=0.82+0.38*crN(vLp*10.);',
 7:'vec2 p=vec2(vLp.x*18.,(vLp.y+vLp.z)*30.);p.x+=step(1.,mod(floor(p.y),2.))*.5;vec2 f=fract(p);diffuseColor.rgb*=(1.03-smoothstep(.72,1.,f.y)*.2)*(0.95+0.08*crN(vLp*8.));',
 8:'float st=crH(floor(vLp*vec3(38.,5.,38.)));float b=crN(vLp*vec3(9.,2.,9.));diffuseColor.rgb*=0.8+0.14*st+0.14*b;'};
const CRFN='float crH(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}\nfloat crN(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(crH(i),crH(i+vec3(1.,0.,0.)),f.x),mix(crH(i+vec3(0.,1.,0.)),crH(i+vec3(1.,1.,0.)),f.x),f.y),mix(mix(crH(i+vec3(0.,0.,1.)),crH(i+vec3(1.,0.,1.)),f.x),mix(crH(i+vec3(0.,1.,1.)),crH(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}\n';
const CRT_BAD={};
function crTex(m,k){if(CRT[k]==null||CRT_BAD[k])return m;const o=m.onBeforeCompile,ok=m.customProgramCacheKey;m.onBeforeCompile=sh=>{if(o)o(sh);sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n{'+CRT[k]+'}');const i=sh.fragmentShader.indexOf('void main');sh.fragmentShader=sh.fragmentShader.slice(0,i)+CRFN+sh.fragmentShader.slice(i)};m.customProgramCacheKey=()=>(ok?ok.call(m):'')+'crt'+k;return m}
const CRK={cow:0,sheep:0,pig:5,dog:0,cat:0,fox:0,rabbit:0,deer:0,wolf:0,boar:0,bear:0,camel:0,reindeer:0,goat:0,chicken:7,duck:7,penguin:7,turtle:1,lizard:1,slime:4,toad:4,scorpion:3,crab:3,spider:3,spiderq:3,yeti:0,golem:2,colossus:2,werewolf:0,basilisk:1,griffin:7,elemental:2,dragon:1};
const CRKH={wilkolak:0,szkielet:2,lucznik_s:2,krol_s:2,drzewiec:8,prastary:8,mumia:8};
function seasonPatch(m,terrain,dec,bld,clo,con){
 const PB=!!bld,PT=!!terrain,PD=!!(dec||con),PC=!!(bld||clo);
 m.onBeforeCompile=sh=>{for(const k of ['uVox','uSnow','uAut','uSpr','uFall','uPat','uCam','uWet','uSunW','uLamp','uLampI','uLampC'])sh.uniforms[k]=SEAS_U[k];
  sh.vertexShader='varying float vUp;varying vec3 vWp;varying vec3 vNw;varying float vBy;varying vec2 vT;varying vec3 vLp;varying vec3 vNl;'+(PC?'attribute vec2 aT;':'')+'\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\n{vec4 wp=vec4(transformed,1.);vec4 o4=vec4(0.,0.,0.,1.);\n#ifdef USE_INSTANCING\nwp=instanceMatrix*wp;o4=instanceMatrix*o4;\n#endif\nvWp=(modelMatrix*wp).xyz;vBy=(modelMatrix*o4).y;vLp=transformed;vT='+(PC?'aT':'vec2(0.)')+';}').replace('#include <defaultnormal_vertex>','#include <defaultnormal_vertex>\nvNl=objectNormal;vUp=dot(normalize(transformedNormal),normalize((viewMatrix*vec4(0.,1.,0.,0.)).xyz));vNw=normalize((vec4(transformedNormal,0.)*viewMatrix).xyz);');
  sh.fragmentShader='varying float vUp;varying vec3 vWp;varying vec3 vNw;varying float vBy;varying vec2 vT;varying vec3 vLp;varying vec3 vNl;uniform float uSnow;uniform float uAut;uniform float uSpr;uniform float uFall;uniform float uPat;uniform float uVox;uniform float uWet;uniform vec3 uCam;uniform vec3 uSunW;uniform vec4 uLamp[28];uniform float uLampI[28];uniform vec3 uLampC[28];float ph2(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}\n'+sh.fragmentShader.replace('#include <aomap_fragment>','#include <aomap_fragment>\n{vec3 lsum=vec3(0.);for(int li=0;li<28;li++){vec4 L=uLamp[li];if(L.w>0.){vec3 dv=L.xyz-vWp;float d=length(dv);float a=pow(clamp(1.-d/L.w,0.,1.),1.5);float nd=max(dot(normalize(vNw),dv/max(d,.001)),0.)*.7+.3;lsum+=a*nd*uLampI[li]*uLampC[li];}}totalEmissiveRadiance+=diffuseColor.rgb*lsum;reflectedLight.directDiffuse+=vec3(0.);}').replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
  {vec3 c0=diffuseColor.rgb;float gd=c0.g-max(c0.r,c0.b);float leaf=smoothstep(.015,.1,gd)*smoothstep(.28,.42,c0.g);
   bool tg=${PC?'vT.y>2.5':'false'};float vr=fract(sin(dot(floor(vWp.xz*1.3+vWp.y*.7),vec2(12.9,78.2)))*43758.5);
   ${dec?'float vr2=fract(sin(dot(floor(vWp*7.+.37),vec3(12.9,78.2,37.7)))*43758.5);if(leaf>.45&&vr2<uFall*1.3)discard;':''}
   vec3 au=mix(vec3(c0.g*1.55,c0.g*.82,c0.g*.28),vec3(c0.g*1.35,c0.g*.5,c0.g*.2),vr);
   ${terrain?'au=c0*mix(vec3(1.7,.85,.3),vec3(1.25,.62,.28),vr);':'if(tg)au=c0*mix(vec3(1.7,.85,.3),vec3(1.25,.62,.28),vr);'}
   diffuseColor.rgb=mix(c0,au,leaf*uAut*${terrain?'.85':'(tg?.85:1.0)'});
   diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.04,1.1,.96)+vec3(.0,.03,.0),leaf*uSpr);
   {float gz=smoothstep(.01,.07,diffuseColor.g-max(diffuseColor.r,diffuseColor.b));float lm=dot(diffuseColor.rgb,vec3(.3,.55,.15));diffuseColor.rgb=mix(diffuseColor.rgb,mix(vec3(lm),diffuseColor.rgb,.58)*vec3(1.04,1.0,.93),gz);}
   float sj=0.,pj=0.;
   ${(PC||PT||PD)?`{const bool PB=${PB},PT=${PT},PD=${PD},PC=${PC};
    float ny=vNw.y,wall=1.-smoothstep(.3,.65,abs(ny)),top=smoothstep(.5,.8,ny);    float mx=max(c0.r,max(c0.g,c0.b)),mn=min(c0.r,min(c0.g,c0.b)),dl=mx-mn,sat=dl/(mx+.001),val=mx,hh=0.;
    if(dl>.001){if(mx==c0.r)hh=mod((c0.g-c0.b)/dl,6.);else if(mx==c0.g)hh=(c0.b-c0.r)/dl+2.;else hh=(c0.r-c0.g)/dl+4.;}hh*=60.;
    bool greyC=sat<.16&&val>.2,redC=sat>.4&&(hh<17.||hh>340.)&&val>.3,brownC=sat>.35&&hh>=17.&&hh<48.&&val<.62&&val>.15,strawC=sat>.35&&hh>=24.&&hh<55.&&val>=.62;
    bool plastC=sat>=.16&&sat<.4&&val>.6&&hh>15.&&hh<70.,blueC=sat>.22&&hh>180.&&hh<265.&&val>.25,slateC=sat>=.1&&sat<=.22&&hh>190.&&hh<260.&&val>.2,greenC=hh>=70.&&hh<=170.&&sat>.25;
    float aFr=${PC?'vT.x':'0.'},aLong=step(128.,aFr),aF=aFr-128.*aLong,aM=${PC?'vT.y':'0.'};bool cloth=PC&&aM>.5&&aM<1.5,big=aF>=5.;bool stoneC=greyC&&val<.8,plasterG=greyC&&val>=.8;
    bool loc=PD||cloth;vec3 pp=(loc?vLp:vWp)*16.;vec3 an=abs(loc?vNl:vNw);float hu=an.x>an.z?pp.z:pp.x,hy=pp.y,m=1.;vec2 tp=pp.xz;
    float fade=1.-smoothstep(40.,120.,length(uCam-vWp));
    float mossA=0.;vec3 mossC=vec3(.35,.4,.2);
    if(uPat>.5&&fade>.01&&(aM<1.5||aM>2.5)){
     if(cloth){vec2 q=(an.y>an.x&&an.y>an.z)?pp.xz:(an.x>an.z?pp.zy:pp.xy);q*=1.5;
      m=1.-.11*step(fract(q.x),.34)-.09*step(fract(q.y),.34)+(ph2(floor(q))-.5)*.06;}
     else if(PB){
      if(wall>.01){
       if(big&&redC){float row=floor(hy/3.),bu=hu+mod(row,2.)*2.5+ph2(vec2(row,7.))*5.,fu=fract(bu/5.),fv=fract(hy/3.);
        float mort=max(step(fu,.2),step(fv,.34)),bv=ph2(vec2(floor(bu/5.),row));
        m=mix(1.+(bv-.5)*.5+step(.67,fv)*.08,.55,mort);}
       else if(big&&stoneC){float row=floor(hy/3.),bu=hu+mod(row,2.)*3.+ph2(vec2(row,3.))*6.,fu=fract(bu/6.),fv=fract(hy/3.);
        float mort=max(step(fu,.17),step(fv,.34)),bv=ph2(vec2(floor(bu/6.),row));
        m=mix(1.+(bv-.5)*.42+(ph2(floor(vec2(hu,hy)/2.))-.5)*.1,.55,mort);}
       else if(big&&(brownC||blueC)){float pl=floor(hu/4.),seam=step(fract(hu/4.),.13);
        m=1.-.5*seam+(ph2(vec2(pl,floor(hy/9.)))-.5)*.34+sin(hy*.8+ph2(vec2(pl,1.))*6.)*.07;}
       else if(big&&(plastC||plasterG)){m=1.+(ph2(floor(vec2(hu,hy)/2.))-.5)*.18+(ph2(floor(vec2(hu,hy)/8.))-.5)*.14+step(.86,ph2(floor(vec2(hu,hy)/5.)))*-.07;}
       else if(!big&&aLong>.5&&(redC||blueC||slateC)){float row=floor(hy/3.),o=mod(row,2.)*1.5,fu=fract((hu+o)/3.),fv=fract(hy/3.);
        m=1.-.4*step(fv,.2)-.28*step(fu,.15)+(ph2(vec2(floor((hu+o)/3.),row))-.5)*.3;}
       else if(strawC){m=1.+(ph2(vec2(floor(hu),floor(hy/6.)))-.5)*.3-.2*step(fract(hy/3.),.2);}
       else if(!big&&brownC){float gc=ph2(floor(vec2(hu,hy)/8.));float a1=gc>.5?hu:hy,a2=gc>.5?hy:hu;
        m=1.+(ph2(vec2(floor(a1*1.5),floor(a2/12.)+gc*9.))-.5)*.4-.18*step(.8,ph2(vec2(floor(a1*.7),floor(a2/5.))));}
       else if(greenC){m=1.+(ph2(floor(pp.xz*2.)+floor(pp.y*2.)*17.)-.5)*.26;}
       if(big&&(stoneC||redC)){float mh=(vWp.y-vBy)*16.;float thr=2.+ph2(vec2(floor(hu*.5),3.))*5.;
        mossA=(1.-smoothstep(thr-1.5,thr,mh))*(.55+.45*step(.3,ph2(floor(vec2(hu,hy)))));
        mossC=vec3(.26,.4,.14)*(.75+.5*ph2(floor(vec2(hu,hy)/2.)));
        float lich=step(.955,ph2(floor(vec2(hu,hy)/2.+7.)))*smoothstep(4.,9.,mh)*step(.5,ph2(floor(vec2(hu,hy)/9.)));
        if(lich>mossA){mossA=lich*.7;mossC=vec3(.62,.68,.34);}}}
      if(top>.01){float mt=1.;
       if(redC||blueC||slateC){float row=floor(tp.y/3.),o=mod(row,2.)*1.5,fu=fract((tp.x+o)/3.),fv=fract(tp.y/3.);
        mt=1.-.45*step(fv,.2)-.3*step(fu,.15)+(ph2(vec2(floor((tp.x+o)/3.),row))-.5)*.34+.08*step(.7,fv);sj=max(step(fv,.2),step(fu,.15))*top;pj=top;}
       else if(strawC){float st=floor(tp.y/2.);mt=1.+(ph2(vec2(st,floor(tp.x/6.)))-.5)*.34-.25*step(fract(tp.x*.5+ph2(vec2(st,2.))*3.),.1);sj=step(fract(tp.x*.5+ph2(vec2(st,2.))*3.),.1)*top;pj=top;}
       else if(brownC){if(big){float pl=floor(tp.y/4.),seam=step(fract(tp.y/4.),.13);mt=1.-.5*seam+(ph2(vec2(pl,floor(tp.x/9.)))-.5)*.34;sj=seam*top;pj=top;}
        else{float gc=ph2(floor(tp/8.));float a1=gc>.5?tp.x:tp.y,a2=gc>.5?tp.y:tp.x;mt=1.+(ph2(vec2(floor(a1*1.5),floor(a2/12.)+gc*9.))-.5)*.4;}}
       else if(big&&stoneC){float row=floor(tp.y/4.),bu=tp.x+mod(row,2.)*2.,fu=fract(bu/4.),fv=fract(tp.y/4.);float jn=max(step(fu,.2),step(fv,.2));mt=mix(1.+(ph2(vec2(floor(bu/4.),row))-.5)*.4,.55,jn);sj=jn*top;pj=top;}
       else if(greenC){mt=1.+(ph2(floor(tp*2.))-.5)*.24+(ph2(floor(tp*.5))-.5)*.12;}
       else if(big&&plastC){mt=1.+(ph2(floor(tp*2.))-.5)*.12+sin(tp.x*.9+tp.y*.5)*.03;}
       m=mix(m,mt,top);}}
     else if(PT){
      {
      if(wall>.01&&val<.97){
       if(greenC||brownC){float cl=floor(hy/2.);m=1.+(ph2(floor(vec2(hu,hy)/2.))-.5)*.3+(ph2(vec2(floor(hu/6.),cl))-.5)*.14-.26*step(.9,ph2(floor(vec2(hu,hy)/3.)+11.))+.18*step(.95,ph2(floor(vec2(hu,hy)/2.)+5.));
        if(greenC&&mod(hy,16.)>12.){m=1.+(ph2(floor(vec2(hu*1.5,hy)))-.5)*.3;}}
       else if(strawC||plastC){float l=floor(hy/3.+ph2(vec2(floor(hu/14.),1.))*.9);m=1.+(ph2(vec2(l,2.))-.5)*.24+(ph2(floor(vec2(hu,hy)))-.5)*.1-.1*step(fract(hy/3.+ph2(vec2(floor(hu/14.),1.))*.9),.12);}
       else if(redC){float l=floor(hy/2.5);m=1.+(ph2(vec2(l,4.))-.5)*.34+(ph2(floor(vec2(hu/3.,hy)))-.5)*.1-.14*step(fract(hy/2.5),.1);}
       else{float st=floor(hy/5.);m=1.+(ph2(vec2(floor(hu/7.)+st*3.,st))-.5)*.3+(ph2(floor(vec2(hu,hy)/2.))-.5)*.16-.24*step(.92,ph2(floor(vec2(hu,hy)/3.)))-.16*step(fract(hy/5.+ph2(vec2(floor(hu/9.),st))*.3),.1);}}
      if(top>.01){float mt=1.;
       if(greenC){float n1=ph2(floor(tp*2.)),n2=ph2(floor(tp*.5)),bl=ph2(floor(vec2(tp.x*4.,tp.y*1.3)+floor(tp.y*1.3)*3.));
        mt=1.+(n1-.5)*.24+(n2-.5)*.14+(bl-.5)*.14+(ph2(floor(tp/6.))-.5)*.1;
        float fl=step(.988,ph2(floor(tp*1.)+3.));if(fl>0.){float fc=ph2(floor(tp)+9.);mossA=max(mossA,fl);mossC=fc<.33?vec3(.95,.92,.85):fc<.66?vec3(.95,.8,.25):vec3(.85,.35,.45);}}
       else if(strawC||plastC){float rp=sin(tp.x*.55+tp.y*.22+ph2(floor(tp/16.))*6.)*.5+.5;mt=1.+(rp-.5)*.14+(ph2(floor(tp*2.))-.5)*.12-.14*step(.975,ph2(floor(tp*2.)+9.))+.08*step(.985,ph2(floor(tp*2.)+21.));}
       else if(greyC&&val>=.85){mt=1.+(ph2(floor(tp*.5))-.5)*.05+(ph2(floor(tp*2.))-.5)*.04-.05*smoothstep(.4,1.,sin(tp.x*.3+tp.y*.2+ph2(floor(tp/12.))*5.));float sp2=step(.993,ph2(floor(tp*2.)+5.));if(sp2>0.){mossA=max(mossA,sp2*.7);mossC=vec3(1.,1.,1.05);}}
       else if(greyC){float cr=step(.9,ph2(floor(tp)+floor(tp.yx/3.)*5.));mt=1.+(ph2(floor(tp*.5))-.5)*.34+(ph2(floor(tp/3.))-.5)*.2-.28*cr+(ph2(floor(tp*2.))-.5)*.08;sj=cr*top;}
       else if(brownC){mt=1.+(ph2(floor(tp*2.))-.5)*.28+(ph2(floor(tp*.5))-.5)*.16;float pb=step(.93,ph2(floor(tp*1.5)+4.));if(pb>0.){mossA=max(mossA,pb*.65);mossC=vec3(.52,.48,.44)*(.8+.4*ph2(floor(tp*1.5)));}}
       else if(redC){mt=1.+(ph2(floor(tp*.7))-.5)*.3-.2*step(.94,ph2(floor(tp*1.5)+2.));}
       else mt=1.+(ph2(floor(tp*2.))-.5)*.2+(ph2(floor(tp*.5))-.5)*.12;
       m=mix(m,mt,top);}}
      if(uVox>.5){vec3 bw=vWp;vec3 bc=floor(bw-vNw*.02);float h3=ph2(bc.xz*1.31+bc.y*7.13);float k=1.+(h3-.5)*.08;
       vec3 f3=fract(bw);vec2 e2=an.y>.5?f3.xz:(an.x>an.z?f3.zy:f3.xy);float ed=min(min(e2.x,1.-e2.x),min(e2.y,1.-e2.y));
       if(top>.5){k*=mix(1.12,1.,smoothstep(0.,.07,ed));k*=1.+clamp((bw.y-34.)/70.,0.,.1);}
       else{float fy=fract(bw.y);k*=(.82+.18*smoothstep(0.,.65,fy))*mix(.8,1.,smoothstep(0.,.06,ed));if(greyC||brownC)k*=1.+(ph2(vec2(floor(bw.y/1.5),floor(bw.x/9.+bw.z/9.)))-.5)*.12;}
       m*=k;}}
     else if(PD){
      if(wall>.01&&brownC){float cu=floor(hu);m=1.+(ph2(vec2(floor(hu/3.),floor(hy/24.)))-.5)*.28-.3*step(.55,ph2(vec2(floor(hu/2.),1.)))*step(.22,ph2(vec2(cu,floor(hy/6.))));}
       else if(wall>.01&&sat<.12&&val>.6){m=1.-.65*step(.88,ph2(vec2(floor(hu/2.),floor(hy/3.))));}
       else if(greenC){
        if(val<.4){m=1.+(ph2(floor(vec2(hu*.8+hy*.4,hy*.9)))-.5)*.44-.16*step(fract(hy/3.),.3);m=mix(m,1.+(ph2(floor(tp*1.5))-.5)*.4,top);}
        else{m=1.+(ph2(floor(pp.xz*2.)+floor(pp.y*2.)*17.)-.5)*.26+(ph2(floor(pp.xz/3.)+floor(pp.y/3.)*11.)-.5)*.2;}}
       else if(sat>.18&&val>.25){m=1.+(ph2(floor(pp.xz*2.)+floor(pp.y*2.)*17.)-.5)*.3+(ph2(floor(pp.xz/3.)+floor(pp.y/3.)*11.)-.5)*.18-.14*step(.86,ph2(floor(pp.xz)+floor(pp.y)*7.));}
       else if(wall>.01&&val<=.6){m=1.+(ph2(vec2(floor(hu/2.),floor(hy/8.)))-.5)*.32-.22*step(.78,ph2(vec2(floor(hu),floor(hy/4.))));}
       else if(val>.75){m=1.+(ph2(floor(pp.xz*2.)+floor(pp.y*2.)*13.)-.5)*.07;}
       else{m=1.+(ph2(floor(pp.xz*2.)+floor(pp.y*2.)*17.)-.5)*.2;}}
     diffuseColor.rgb*=mix(1.,m,fade);
     diffuseColor.rgb=mix(diffuseColor.rgb,mossC,mossA*.8*fade*(1.-uSnow*.7));}
    if(uWet>.01&&(PB||PT)){vec3 Vv=normalize(uCam-vWp),Nn=normalize(vNw);float wf=uWet*(PB?(.3*top+.1*wall):.16*top);
     diffuseColor.rgb*=1.-wf;
     float fr=pow(1.-max(dot(Vv,Nn),0.),3.),sp=pow(max(dot(reflect(-Vv,Nn),uSunW),0.),14.)*step(0.,uSunW.y);
     float gl=PB?1.:((greyC||redC)?1.:0.);
     totalEmissiveRadiance+=uWet*top*gl*(vec3(.95,.92,.8)*sp*.5+vec3(.5,.58,.68)*fr*.3);}
   }`:''}
   float up=vUp;float pz=ph2(floor(vWp.xz*${terrain?'6.':'10.'}+floor(vWp.y*8.)));
   float cover=${terrain?'smoothstep(.1,.35,uSnow*1.4-pz*.9)':'smoothstep(.0,.28,uSnow*1.7-(1.-sj)*.55-pz*.3)'};
   float sn=${terrain?'cover*smoothstep(.35,.7,up)':'smoothstep(.5,.88,up)*cover'};sn*=1.0-step(c0.r*1.08,c0.b)*${terrain?'1.0':'0.0'};sn*=mix(1.,mix(.74,1.,sj),pj);
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.93,.96,1.)*(.8+.2*vr),sn*.92);}`)};m.customProgramCacheKey=()=>'seas'+(terrain?'T':'V')+(dec?'D':'')+(bld?'B':'')+(clo?'C':'')+(con?'K':'')};
const matV=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matV,false);
const matVD=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matVD,false,true);
const matVK=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matVK,false,false,false,false,true);
const matB=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matB,false,false,true);
const matC=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matC,false,false,false,true);
const CONK=['pine','cis','bush','bushB'];const isCon=k=>CONK.indexOf(k.replace(/_[ml]$/,''))>=0;const DECIDK=['oak','birch','willow','lipa','jesion','buk','modrzew'];const isDec=k=>DECIDK.indexOf(k.replace(/_[ml]$/,''))>=0;
const HFC={on:(function(){try{return localStorage.getItem('hf')!=='0'}catch(e){return true}})(),total:0,removed:0};
/* pamięć: kopie CPU atrybutów geometrii zbędne po wgraniu na GPU; wybieranie klikiem przez AABB */
const MEMOPT=(function(){try{return localStorage.getItem('memopt')!=='0'}catch(e){return true}})();
/* ułatwienia: wzorce materiałów można wyłączyć dla wybranych kolorów/modeli */
function noRay(){}
const NOPATC={'#f4f0e8':1,'#f0ead6':1,'#f0ece0':1,'#e6dcc0':1};
var VOXNP=false;const NOPATB={pomnik:1,posag:1};
function voxGeo(boxes,jit=.06,tagFn){
  const pos=[],nor=[],col=[],prt=[],aTt=[],c=new THREE.Color();
  const n=boxes.length,E=1e-4,lo=new Float32Array(n*3),hi=new Float32Array(n*3),ok=new Uint8Array(n);
  for(let i=0;i<n;i++){const b=boxes[i];if(b[3]>0&&b[4]>0&&b[5]>0){ok[i]=1;lo[i*3]=b[0];lo[i*3+1]=b[1];lo[i*3+2]=b[2];hi[i*3]=b[0]+b[3];hi[i*3+1]=b[1]+b[4];hi[i*3+2]=b[2]+b[5]}}
  /* ściana f boxa i jest ukryta, gdy inny box zasłania ją w całości (przecina płaszczyznę ściany i obejmuje jej prostokąt) */
  const hidden=(i,f)=>{const a=f>>1,pl=(f&1)?lo[i*3+a]:hi[i*3+a],u=(a+1)%3,w=(a+2)%3,sg=(f&1)?-1:1;
    const u0=lo[i*3+u]-E,u1=hi[i*3+u]+E,w0=lo[i*3+w]-E,w1=hi[i*3+w]+E;
    for(let j=0;j<n;j++){if(j===i||!ok[j])continue;
      if(lo[j*3+u]>u0||hi[j*3+u]<u1-2*E||lo[j*3+w]>w0||hi[j*3+w]<w1-2*E)continue;
      if(sg>0){if(lo[j*3+a]<=pl+E&&hi[j*3+a]>pl+E)return true}else{if(hi[j*3+a]>=pl-E&&lo[j*3+a]<pl-E)return true}}
    return false};
  boxes.forEach((b,bi)=>{
    if(!ok[bi])return;
    const g=new THREE.BoxGeometry(b[3]*V,b[4]*V,b[5]*V).toNonIndexed();
    g.translate((b[0]+b[3]/2)*V,(b[1]+b[4]/2)*V,(b[2]+b[5]/2)*V);
    const cs6=typeof b[6]==='string'&&b[6].charCodeAt(b[6].length-1)===126,mnD=Math.min(b[3],b[4],b[5]),sh2=b[3]+b[4]+b[5]-mnD-Math.max(b[3],b[4],b[5]);let cm=cs6?1:(VOXNP?2:(mnD<=1.2&&sh2>=5?2:(NOPATC[b[6]]?2:0)));c.set(cs6?b[6].slice(0,-1):b[6]);
    if(!cs6&&!VOXNP&&b[1]<.05&&b[4]<=1.01&&b[3]>=2.5&&b[5]>=2.5){const hs={};c.getHSL(hs);if(hs.h>.17&&hs.h<.45&&hs.s>.22&&hs.l>.18&&hs.l<.6){cm=3;if(b[3]>=8&&b[5]>=8)c.set('#5b8f3a')}}
    const k=(cm===3?1:1+(hash(bi,boxes.length,(b[3]*7)|0)-.5)*jit);
    const p=g.attributes.position.array,nn=g.attributes.normal.array;
    for(let f=0;f<6;f++){HFC.total++;if(HFC.on&&n>1&&hidden(bi,f)){HFC.removed++;continue}
      const fa=f>>1,fd=Math.min(120,Math.round(Math.min(b[3+(fa+1)%3],b[3+(fa+2)%3])))+(Math.max(b[3+(fa+1)%3],b[3+(fa+2)%3])>=9?128:0);for(let i=f*18;i<f*18+18;i+=3){aTt.push(fd,cm);pos.push(p[i],p[i+1],p[i+2]);nor.push(nn[i],nn[i+1],nn[i+2]);col.push(c.r*k,c.g*k,c.b*k);if(tagFn)prt.push(tagFn(b))}}
    g.dispose();
  });
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geo.setAttribute('aT',new THREE.Uint8BufferAttribute(aTt,2));if(tagFn)geo.setAttribute('aPart',new THREE.Float32BufferAttribute(prt,1));
  if(!tagFn&&boxes.length<=400){geo.userData.vb=boxes;geo.userData.vj=jit}
  geo.computeBoundingSphere();geo.computeBoundingBox();return geo;
}
/* ---------- palettes ---------- */
const PBASE={wall:'#ece2c6',wallD:'#d8ccae',timber:'#4a2f1d',roofA:'#a8452c',roofB:'#93391f',ridge:'#6a2a1a',stone:'#8e8994',stoneD:'#6f6a73',wood:'#7a5030',woodL:'#8a5c36',
  door:'#4a2f1d',shut:'#3e6a8a',flower:'#d04a6a',style:'timber',cloth:'#c0503a',brick:'#9e4a34',brick2:'#b85c42',chimney:'#8a5040',quoin:'#c9c0b0',cornice:'#f4efe6',found:'#6f6a73'};
const PAL=[
  {...PBASE},
  {...PBASE,wall:'#f4f0e6',timber:'#5a3a22',roofA:'#4a4f5c',roofB:'#5a606e',ridge:'#33363e',door:'#3a5a7a',shut:'#3c6a3a',flower:'#e8c040',cloth:'#3a6aa0',brick:'#b05a38',brick2:'#c46a48',stone:'#a39fa8',stoneD:'#77727d'},
  {...PBASE,wall:'#e2c890',timber:'#3a2416',roofA:'#7a4a2c',roofB:'#6a3e24',ridge:'#4a2a18',door:'#6a2a1e',shut:'#8a3b2a',flower:'#c05ac0',cloth:'#d8a43a',brick:'#8a3a2a',brick2:'#a04a36',stone:'#8a8590',stoneD:'#5d5a63'},
  {...PBASE,wall:'#f2e8d8',timber:'#3a2a20',roofA:'#9a3a28',roofB:'#86321f',ridge:'#5a2214',door:'#2f5a3a',shut:'#2f6a4a',flower:'#e05a3a',cloth:'#5a8a3a',brick:'#a24e36',brick2:'#ba6448',stone:'#8a8580',stoneD:'#6a6560'},
  {...PBASE,wall:'#ead6c8',timber:'#3e3a3a',roofA:'#b0502e',roofB:'#9a4426',ridge:'#6a2a18',door:'#5a4a3a',shut:'#5a4a8a',flower:'#f08aa0',cloth:'#8a4a8a',brick:'#c08a5a',brick2:'#d09a6a',stone:'#9a948c',stoneD:'#7a746c'},
];
const THATCH={roofA:'#b8923e',roofB:'#a8823a',ridge:'#7a6028'},SHINGLE={roofA:'#6b4a30',roofB:'#5a3e28',ridge:'#3e2a1a'},SLATE={roofA:'#4a4f5c',roofB:'#5a606e',ridge:'#33363e'};
function palFor(type,v){const P={...PAL[v%5]};
  if(type==='chalupa'){Object.assign(P,v%2?THATCH:SHINGLE);P.style=['log','log','plank','whitelog','plank'][v];P.wall='#f0ebe0';P.wallD='#ddd6c8'}
  if(type==='koszary'||type==='koszary_w'||type==='zbrojownia'||type==='koszary_lucznikow'||type==='mennica'||type==='huta'){Object.assign(P,v%3===1?SHINGLE:SLATE)}
  if(type==='stajnia'||type==='spichlerz'||type==='kamieniolom')Object.assign(P,v%2?THATCH:SHINGLE);
  if(type==='drwalnia'||type==='tartak'||type==='magazyn'){Object.assign(P,v%2?SHINGLE:{})}
  if(type==='dlugi'){if(v<5&&(v===1||v===3))Object.assign(P,THATCH)}
  if(type==='dworek'){Object.assign(P,v%2?SLATE:SHINGLE);P.wall=['#f6f2ea','#f2e2a8','#f6f2ea','#eedcc0','#f4ecd8'][v];P.style='plaster';P.quoin='#e2d8c4'}
  if(type==='kamienica'&&v<5){P.brick=['#9e4a34','#b0582f','#8a3a2a','#a24e36','#c08a5a'][v];P.brick2=['#b85c42','#c66a3c','#a04a36','#ba6448','#d4a070'][v];P.timber=['#3a2416','#1e1a18','#5a3a22','#2a2620','#3e3a3a'][v];
    Object.assign(P,[{},SLATE,{roofA:'#7a4a2c',roofB:'#6a3e24',ridge:'#4a2a18'},{},{}][v])}
  return P}
const CLOTHS=['#c0503a','#3a6aa0','#d8a43a','#5a8a3a','#8a4a8a'];
const FLOWERS=['#d04a6a','#e8c040','#f08aa0','#c05ac0','#ffffff','#e05a3a','#7a8ae0'];

/* ---------- building helpers (vox; 16 per tile; front = +z) ---------- */
const ROOFK=.78;
function gableX(B,x0,z0,w,d,y0,o,sh,step,cA,cB){sh*=ROOFK;let i=0;for(let z1=z0-o,z2=z0+d+o;z2-z1>2;z1+=step,z2-=step,i++)B.push([x0-o,y0+i*sh,z1,w+2*o,sh,z2-z1,i%2?cB:cA]);return y0+i*sh}
function gableZ(B,x0,z0,w,d,y0,o,sh,step,cA,cB){sh*=ROOFK;let i=0;for(let x1=x0-o,x2=x0+w+o;x2-x1>2;x1+=step,x2-=step,i++)B.push([x1,y0+i*sh,z0-o,x2-x1,sh,d+2*o,i%2?cB:cA]);return y0+i*sh}
function gableRoof(B,x0,z0,w,d,y0,P,o){
  const ax=o.ridge||'x',ov=o.ov??3,sh=(o.sh??3)*ROOFK,st=o.st??2.2,ox=o.ox??2.4;
  const L=ax==='x'?w:d,Wd=ax==='x'?d:w;
  const bx=(a,y,b,la,hh,wb,c)=>{if(ax==='x')B.push([x0+a,y,z0+b,la,hh,wb,c]);else B.push([x0+b,y,z0+a,wb,hh,la,c])};
  let i=0,b1=-ov,b2=Wd+ov;
  for(;b2-b1>2*st+1.2;b1+=st,b2-=st,i++){
    const y=y0+i*sh,c=i%2?P.roofB:P.roofA;
    bx(-ox,y,b1,L+2*ox,sh,st+.6,c);bx(-ox,y,b2-st-.6,L+2*ox,sh,st+.6,c);
    const i1=Math.max(0,b1+st),i2=Math.min(Wd,b2-st);if(i2>i1)bx(.3,y,i1,L-.6,sh,i2-i1,o.gable||P.wall);
  }
  const yt=y0+i*sh;bx(-ox,yt,b1,L+2*ox,sh*.8,b2-b1,P.roofA);bx(-ox-.3,yt+sh*.8,(b1+b2)/2-1.4,L+2*ox+.6,1.3,2.8,P.ridge);
  if(o.gtimber){const T=P.timber,mid=Wd/2;for(const e of [0,L]){
    for(const off of [-Wd*.3,-Wd*.12,Wd*.12,Wd*.3]){const hb=Math.min((Wd/2-Math.abs(off))/st*sh-sh*.6,(Wd/2)/st*sh*.5);if(hb<2)continue;bx(e-.6,y0,mid+off-.7,1.2,hb,1.4,T)}
    const yc=y0+Math.min(sh*2.6,(Wd/2)/st*sh*.42);bx(e-.6,yc,Wd*.16,1.2,1.2,Wd*.68,T)}}
  if(Wd>=16){const T=P.timber,mid=Wd/2,pk=(Wd/2)/st*sh,vy=y0+pk*.56,hw=y=>Wd/2-((y-y0)/sh)*st;for(const e of [0,L]){
    bx(e-.7,vy,mid-1.5,1.4,3.6,3,T);bx(e-.9,vy+.5,mid-1,1.8,2.6,2,'#2a2420');bx(e-.8,vy+1.7,mid-1.2,1.6,.4,2.4,T);
    const ky=vy+3.6;if(hw(ky+3)>1.6)bx(e-.6,ky,mid-.5,1.2,Math.max(1.2,Math.min(pk*.3,hw(ky)*sh/st-2)),1,T);
    for(const sg of [-1,1])for(let k=0;k<3;k++){const yy=ky+.6+k*1.3,off=1.6+k*1.3;if(off+1<hw(yy)-.8)bx(e-.6,yy,mid+sg*off-.6,1.2,1.2,1.2,T)}
    if(Wd>=24){const ly=y0+pk*.3;if(hw(ly)>5){bx(e-.8,ly+.5,mid-3.6,1.6,2.4,1.2,'#2a2420');bx(e-.8,ly+.5,mid+2.4,1.6,2.4,1.2,'#2a2420')}}}}
  return {top:yt+sh*.8+1.3,y0,peak:(Wd/2)/st*sh};
}
function frameFace(B,ax,c,a0,a1,y,h,T,o){
  const len=a1-a0,n=Math.max(2,Math.round(len/(o.sp||8)));
  const put=(a,yy,aw,hh,col=T,th=1.2,off=-.5)=>{if(ax==='z')B.push([a,yy,c+off,aw,hh,th,col,'d']);else B.push([c+off,yy,a,th,hh,aw,col,'d'])};
  for(let i=0;i<=n;i++){const a=a0+(len-1.4)*i/n;put(a,y,1.4,h)}
  put(a0,y,len,1.2);put(a0,y+h-1.2,len,1.2);put(a0,y+h*.5-.6,len,1.2);
  if(o.br){const pw=(len-1.4)/n,steps=Math.max(3,Math.round(h*.45/1.6));
    for(let k=0;k<steps;k++){const f=k/steps;const yy=y+1.2+k*(h*.5-1.8)/steps;put(a0+1.4+f*(pw-3),yy,1.6,1.8);put(a1-3-f*(pw-3),yy,1.6,1.8);
      if(o.cross&&n>3){const m=a0+(len-1.4)*Math.floor(n/2)/n;put(m+1.4+f*(pw-3),y+h*.5+.6+k*(h*.5-1.8)/steps,1.6,1.8);put(m+pw-1.6-f*(pw-3),y+h*.5+.6+k*(h*.5-1.8)/steps,1.6,1.8)}}}
  if(o.brick){for(let yy=y+1.8,r=0;yy<y+h-1.6;yy+=1.6,r++){if(Math.abs(yy-(y+h*.5))<1.4)continue;const off=r%2?1.7:0;for(let a=a0+2+off;a<a1-3.6;a+=3.4){if(hash((a*7)|0,(yy*7)|0,o.seed||0)<.4)put(a,yy,2.6,1,o.brick2,.4,ax==='z'?(c>0?.45:-.65):(c>0?.45:-.65))}}}
}
function wallBox(B,style,X,y,Z,w,h,d,P,seed){const n0=B.length;wallBox0(B,style,X,y,Z,w,h,d,P,seed);for(let i=n0;i<B.length;i++){const b=B[i];if(!(b[0]===X&&b[2]===Z&&b[3]===w&&b[5]===d))b[7]='d'}}
function wallBox0(B,style,X,y,Z,w,h,d,P,seed){
  if(style==='log'||style==='whitelog'){const c1=style==='log'?P.woodL:P.wall,c2=style==='log'?P.wood:P.wallD;
    for(let i=0,yy=y;yy<y+h-.1;i++,yy+=2.6)B.push([X,yy,Z,w,Math.min(2.6,y+h-yy),d,i%2?c2:c1]);
    for(const [cx,cz] of [[X-1,Z-1],[X+w-2,Z-1],[X-1,Z+d-2],[X+w-2,Z+d-2]])B.push([cx,y,cz,3,h,3,style==='log'?P.timber:P.wood]);
    B.push([X-.6,y+h-1,Z-.6,w+1.2,1,d+1.2,style==='log'?P.timber:P.wood]);return}
  if(style==='plank'){B.push([X,y,Z,w,h,d,P.woodL]);for(let x=X+2;x<X+w-1;x+=4)B.push([x,y,Z+d-.4,.8,h,.8,P.wood],[x,y,Z-.4,.8,h,.8,P.wood]);for(let z=Z+2;z<Z+d-1;z+=4)B.push([X-.4,y,z,.8,h,.8,P.wood],[X+w-.4,y,z,.8,h,.8,P.wood]);
    B.push([X-.6,y+h-1.2,Z-.6,w+1.2,1.2,d+1.2,P.timber]);return}
  if(style==='stone'){B.push([X,y,Z,w,h,d,P.stone]);let k=0;
    for(let yy=y+1;yy<y+h-2;yy+=3.2)for(let x=X+1;x<X+w-4;x+=5.5){k++;if(hash(k,seed,3)<.4)B.push([x+hash(k,seed)*1.5,yy,Z+d-.3,4,2.4,.6,hash(k,seed,9)<.5?P.stoneD:'#b0aab4'])}
    for(let yy=y;yy<y+h-1;yy+=4.4)B.push([X-.5,yy,Z+d-2.5,3,2.4,3,P.stoneD],[X+w-2.5,yy,Z+d-2.5,3,2.4,3,P.stoneD]);return}
  if(style==='plaster'){B.push([X,y,Z,w,h,d,P.wall]);for(let yy=y,k=0;yy<y+h-1.5;yy+=2.6,k++){const q=k%2?3.2:2.2;for(const [qx,qz] of [[X-.4,Z+d-q+.4],[X+w-q+.4,Z+d-q+.4],[X-.4,Z-.4],[X+w-q+.4,Z-.4]])B.push([qx,yy,qz,q,2.2,q,P.quoin])}
    B.push([X-.8,y+h-1.2,Z-.8,w+1.6,1.2,d+1.6,P.cornice],[X-.4,y,Z-.4,w+.8,1.6,d+.8,P.stoneD]);return}
  const pr=style==='prussian';
  B.push([X,y,Z,w,h,d,pr?P.brick:P.wall]);
  const o={sp:pr?7:9,br:true,cross:pr,brick:pr,brick2:P.brick2,seed};
  frameFace(B,'z',Z+d,X,X+w,y,h,P.timber,o);frameFace(B,'z',Z,X,X+w,y,h,P.timber,{...o,brick:false});
  frameFace(B,'x',X+w,Z,Z+d,y,h,P.timber,{...o,brick:false,cross:false});frameFace(B,'x',X,Z,Z+d,y,h,P.timber,{...o,brick:false,cross:false});
}
let WG=0;
function cutHoles(B,win){const holes=[];for(const w of win){if(w[5]<=1.5&&w[5]<=w[3])holes.push({z:1,u0:w[0]-1,u1:w[0]+w[3]+1,y0:w[1]-1,y1:w[1]+w[4]+1,n0:w[2]-1.3,n1:w[2]+w[5]+1.3});else if(w[3]<=1.5)holes.push({z:0,u0:w[2]-1,u1:w[2]+w[5]+1,y0:w[1]-1,y1:w[1]+w[4]+1,n0:w[0]-1.3,n1:w[0]+w[3]+1.3})}
  if(!holes.length)return B;const out=[];
  for(const b of B){if(b[7]!=='d'){out.push(b);continue}let L=[b];
    for(const h of holes){const nL=[];for(const q of L){const U0=h.z?q[0]:q[2],UW=h.z?q[3]:q[5],N0=h.z?q[2]:q[0],NW=h.z?q[5]:q[3];
        if(U0>=h.u1||U0+UW<=h.u0||q[1]>=h.y1||q[1]+q[4]<=h.y0||N0>=h.n1||N0+NW<=h.n0){nL.push(q);continue}
        const mk=(u,uw,y,yh)=>{if(uw<.25||yh<.25)return;const c=q.slice();if(h.z){c[0]=u;c[3]=uw}else{c[2]=u;c[5]=uw}c[1]=y;c[4]=yh;nL.push(c)};
        const a0=Math.max(U0,h.u0),a1=Math.min(U0+UW,h.u1);mk(U0,h.u0-U0,q[1],q[4]);mk(h.u1,U0+UW-h.u1,q[1],q[4]);mk(a0,a1-a0,q[1],h.y0-q[1]);mk(a0,a1-a0,h.y1,q[1]+q[4]-h.y1)}
      L=nL}
    out.push(...L)}
  return out}
function fB(B,face,c,u,y,n0,du,dy,dn,col){const n=face[1]==='+'?c+n0:c-n0-dn;B.push(face[0]==='z'?[u,y,n,du,dy,dn,col]:[n,y,u,dn,dy,du,col])}
function addWin(B,win,face,a,y,c,P,o){
  const W=o.ww||5,H=o.wh||8,id=WG++,z=face[0]==='z',pn=face[1]==='+'?c-.6:c-.75;
  win.push(z?[a,y,pn,W,H,1.35,id]:[pn,y,a,1.35,H,W,id]);
  fB(B,face,c,a-.6,y-.6,-.5,W+1.2,H+1.2,1.2,P.timber);fB(B,face,c,a+W/2-.3,y,-.7,.6,H,1.55,P.timber);fB(B,face,c,a,y+H*.62-.3,-.7,W,.6,1.55,P.timber);
  if(o.shut){fB(B,face,c,a-2.4,y,.2,1.8,H,.8,P.shut);fB(B,face,c,a+W+.6,y,.2,1.8,H,.8,P.shut)}
  if(o.flow){const f1=FLOWERS[id%FLOWERS.length],f2=FLOWERS[(id*3+2)%FLOWERS.length];
    fB(B,face,c,a-.6,y-2.4,.1,W+1.2,1.9,2.2,P.wood);fB(B,face,c,a-.2,y-.5,.3,W+.4,.5,1.8,'#3c7432');
    for(let k=0;k<W-.4;k+=1.5)fB(B,face,c,a+k,y-.1,.4+hash(id,k*3|0,5)*.6,1.2,1+hash(id,k*5|0,6)*.6,1.1,(k/1.5|0)%2?f1:f2);
    if(hash(id,3,9)>.4)for(let k=0;k<3;k++){const h=1.4+hash(id,k,4)*2;fB(B,face,c,a+.3+k*(W-1.2)/2,y-2.4-h,1.6,.9,h,.7,k%2?'#4a8a3a':'#3c7432')}}
  else fB(B,face,c,a-1,y-1.5,-.5,W+2,.9,1.9,P.stoneD||P.timber);
}
function pHang(B,face,c,u,y,seed){const f=FLOWERS[(seed*5+1)%FLOWERS.length];
  fB(B,face,c,u-.3,y,0,.6,.6,3.2,'#2a2a2a');fB(B,face,c,u-.3,y-.6,0,.6,1.6,.5,'#2a2a2a');fB(B,face,c,u-.15,y-2.2,2.6,.3,2.2,.3,'#2a2a2a');
  fB(B,face,c,u-1.4,y-4.4,1.6,2.8,2.2,2.4,'#b0603a');fB(B,face,c,u-1.6,y-2.6,1.4,3.2,.6,2.8,'#c27048');
  fB(B,face,c,u-1.5,y-2.1,1.5,3,1,2.6,'#3c7432');fB(B,face,c,u-1,y-1.6,1.7,1,1,1,f);fB(B,face,c,u+.4,y-1.4,2.4,1,1,1,f);
  for(let k=0;k<4;k++){const h=2+hash(seed,k,7)*4;fB(B,face,c,u-1.6+k*.95,y-4.2-h,k%2?1.4:3.6,.8,h+.4,.7,k%2?'#4a8a3a':'#3c7432')}}
function ivyB(B,face,c,u0,len,yTop,seed){for(let u=0;u<len;u+=1.5){const hc=yTop*(.4+.6*hash(seed,u*10|0,81))*(1-u/len*.5);
  for(let yy=1;yy<hc;yy+=1.9){if(hash(seed,(u*10|0)+(yy*31|0),82)<.2)continue;const g=hash(seed,(u*7+yy)|0,83);fB(B,face,c,u0+u-.3,yy,-.2,2.1,2.3,.8+g*.6,g<.33?'#2f6a2a':g<.66?'#3c7432':'#4f8f3c')}}}
function oriel(B,win,a,y,c,P,W,H,flow){const ow=W+6;
  fB(B,'z+',c,a-3,y-2.5,0,ow,H+5,4,P.wall);for(const px of [a-3.4,a+W+2.6])fB(B,'z+',c,px,y-2.5,3.4,.8,H+5,.8,P.timber);
  fB(B,'z+',c,a-3.4,y-3.3,0,ow+.8,.9,4.6,P.timber);fB(B,'z+',c,a-2,y-5,0,W+4,1.7,3.2,P.timber);fB(B,'z+',c,a-.5,y-6.4,0,W+1,1.4,1.8,P.timber);
  fB(B,'z+',c,a-3.8,y+H+2.5,0,ow+1.6,1.2,5.2,P.roofB);fB(B,'z+',c,a-2.8,y+H+3.7,0,ow-.4,1.2,3.8,P.roofA);fB(B,'z+',c,a-1.6,y+H+4.9,0,ow-2.8,1,2.2,P.roofB);
  addWin(B,win,'z+',a,y,c+4,P,{ww:W,wh:H,flow})}
function groundBay(B,win,cx,y,front,P,fh,flow){const W=12,a=cx-W/2,h=fh-1.4;
  B.push([a-.5,0,front-.2,W+1,y,4.6,P.stoneD],[a,y,front,W,h,4,P.wall],[a-.6,y,front,.8,h,4.6,P.timber],[a+W-.2,y,front,.8,h,4.6,P.timber],[a-.8,y+h,front-.2,W+1.6,1.1,5.2,P.timber],[a-.4,y+h+1.1,front+.4,W+.8,.9,4.2,P.roofB]);
  addWin(B,win,'z+',cx-3,y+3.6,front+4,P,{ww:6,wh:Math.min(9,h*.5),flow});
  B.push([a+.6,y+3.6,front+.1,.8,Math.min(9,h*.5),4.2,P.timber],[a+W-1.4,y+3.6,front+.1,.8,Math.min(9,h*.5),4.2,P.timber])}
function cornerBox(B,win,P,bx,sg,y,h,front,deck){const [x1,x2]=bx,fz=front-8,dp=front+4-fz,hh=h-1.4;
  if(deck)B.push([x1-.5,0,fz-.5,x2-x1+1,y,dp+.5,P.stoneD]);else B.push([x1+1.5,y-1.4,fz+1.5,x2-x1-3,1.4,dp-3,P.timber],[x1+3,y-2.6,fz+3,x2-x1-6,1.2,dp-6,P.timber]);
  B.push([x1,y,fz,x2-x1,hh,dp,P.wall]);
  const fxs=sg>0?[x1-.3,x2-.5]:[x1-.5+.2,x2-.3];
  B.push([x1-.4,y,front+4-.5,1,hh,1.2,P.timber],[x2-.6,y,front+4-.5,1,hh,1.2,P.timber],[sg>0?x2-.5:x1-.5,y,fz-.2,1.2,hh,1,P.timber]);
  B.push([x1-.8,y+hh,fz-.8,x2-x1+1.6,1.1,dp+1.6,P.timber]);
  const wh=Math.min(9,hh*.5),wy=y+Math.max(3.2,hh*.27);
  addWin(B,win,'z+',(x1+x2)/2-2.5,wy,front+4,P,{ww:5,wh});
  addWin(B,win,sg>0?'x+':'x-',front-4.5,wy,sg>0?x2:x1,P,{ww:5,wh});
  if(deck){const t=y+hh+1.1,z2=front+4;
    B.push([x1-.8,t,z2-.2,x2-x1+1.6,.6,.6,P.timber]);B.push([sg>0?x2:x1-.2,t,fz-.8,.6,.6,dp+.8,P.timber]);
    for(let u=x1;u<=x2-.5;u+=3.8)B.push([u,t,z2-.2,.6,2.2,.6,P.timber]);for(let u=fz;u<=z2-.5;u+=3.8)B.push([sg>0?x2:x1-.2,t,u,.6,2.2,.6,P.timber])}}
function ptWin(B,win,face,a,y,c,W,H,frame){const id=WG++;
  if(face[0]==='z'){win.push([a,y,c-.6,W,H,1.35,id],[a+1,y+H,c-.6,W-2,1.5,1.35,id],[a+2,y+H+1.5,c-.6,W-4,1.3,1.35,id]);B.push([a-.8,y-.8,c-.5,W+1.6,H+3.6,1.1,frame],[a+W/2-.3,y,c-.75,.6,H+2,1.6,frame])}
  else{win.push([c-.6,y,a,1.35,H,W,id],[c-.6,y+H,a+1,1.35,1.5,W-2,id],[c-.6,y+H+1.5,a+2,1.35,1.3,W-4,id]);B.push([c-.5,y-.8,a-.8,1.1,H+3.6,W+1.6,frame],[c-.75,y,a+W/2-.3,1.6,H+2,.6,frame])}
}
/* props */
function pBarrel(B,x,z,y=0){B.push([x,y,z,4,6,4,'#8a5a30'],[x-.2,y+1,z-.2,4.4,.6,4.4,'#4a4a4a'],[x-.2,y+4.4,z-.2,4.4,.6,4.4,'#4a4a4a'],[x+.4,y+6,z+.4,3.2,.2,3.2,'#6b4528'])}
function pCrate(B,x,z,y=0,c='#a37a48'){B.push([x,y,z,5,5,5,c],[x-.1,y+2.2,z-.1,5.2,.6,5.2,'#7a5530'],[x-.1,y,z+2.2,5.2,5,.6,'#7a5530'])}
function pSack(B,x,z,c='#d8c8a0'){B.push([x,0,z,3.6,4,3,c],[x+.8,4,z+.6,2,1,1.8,c],[x+1.3,5,z+1.1,1,.6,.8,'#8a6a2e'])}
function pBench(B,x,z,ax,P){if(ax==='x')B.push([x,2.6,z,9,.8,3,P.woodL],[x+.5,0,z+.5,1,2.6,2,P.wood],[x+7.5,0,z+.5,1,2.6,2,P.wood],[x,3.4,z-.4,9,3,.8,P.wood]);else B.push([x,2.6,z,3,.8,9,P.woodL],[x+.5,0,z+.5,2,2.6,1,P.wood],[x+.5,0,z+7.5,2,2.6,1,P.wood],[x-.4,3.4,z,.8,3,9,P.wood])}
function pWoodpile(B,x,z,len,ax){for(let r=0;r<3;r++)for(let k=0;k<Math.floor(len/3.2);k++){const c=(r+k)%2?'#8a5a30':'#7a5030';if(ax==='x')B.push([x+k*3.2,r*2.6,z,3,2.6,5,c],[x+k*3.2+.5,r*2.6+.5,z+5,2,1.6,.3,'#d8aa68']);else B.push([x,r*2.6,z+k*3.2,5,2.6,3,c],[x+5,r*2.6+.5,z+k*3.2+.5,.3,1.6,2,'#d8aa68'])}
  B.push(ax==='x'?[x-.5,7.8,z-.5,len+1,1,6,'#6b4528']:[x-.5,7.8,z-.5,6,1,len+1,'#6b4528'])}
function pFence(B,x,z,len,ax,c){for(let k=0;k<=len;k+=6){const q=Math.min(k,len-1);B.push(ax==='x'?[x+q,0,z,1,5,1,c]:[x,0,z+q,1,5,1,c])}B.push(ax==='x'?[x,1.6,z+.2,len,.8,.6,c]:[x+.2,1.6,z,.6,.8,len,c],ax==='x'?[x,3.6,z+.2,len,.8,.6,c]:[x+.2,3.6,z,.6,.8,len,c])}
function pFlowers(B,x,z,w,d,seed){B.push([x,0,z,w,1.4,d,'#5a3d24']);let k=0;for(let i=1;i<w-1;i+=2.4)for(let j=1;j<d-1;j+=2.4){k++;B.push([x+i,1.4,z+j,.8,1.6,.8,'#3c7432'],[x+i-.4,3,z+j-.4,1.6,1.2,1.6,FLOWERS[(k+seed)%FLOWERS.length]])}}
function pLantern(B,lamps,x,z,h=13){B.push([x,0,z,1.2,h,1.2,'#3a3a3a'],[x-.9,h,z-.9,3,.6,3,'#2a2a2a'],[x-.7,h+3.4,z-.7,2.6,.8,2.6,'#2a2a2a'],[x-.6,h+.6,z-.6,.4,2.8,.4,'#2a2a2a'],[x+1.4,h+.6,z+1.4,.4,2.8,.4,'#2a2a2a']);lamps.push([x+.6,h+2,z+.6])}
function pHay(B,x,z){B.push([x,0,z,7,5,6,'#d8c060'],[x+.5,5,z+.5,6,1,5,'#e6d070'],[x,1.5,z-.1,7,.4,.3,'#b89a40'],[x,3.5,z-.1,7,.4,.3,'#b89a40'])}
function pCart(B,x,z){B.push([x,3,z,8,1,12,'#8a6a44'],[x,4,z,.8,3,12,'#7a5a3a'],[x+7.2,4,z,.8,3,12,'#7a5a3a'],[x-1,1,z+3,1,5,5,'#4a2f1d'],[x+8,1,z+3,1,5,5,'#4a2f1d'],[x+3.5,3,z+12,1,1,8,'#6b4528'],[x+1,4,z+2,6,3,5,'#d8b24a'])}
function pBush(B,x,z,s=1){B.push([x,0,z,5*s,4*s,5*s,'#3c7432'],[x+s,3*s,z+s,3*s,2*s,3*s,'#549b41'])}
function pLaundry(B,x,z,len){B.push([x,0,z,1,12,1,'#6b4528'],[x+len,0,z,1,12,1,'#6b4528'],[x,11,z+.3,len+1,.3,.3,'#e8e0cc']);const cs=['#f4f0e8','#6a8ab0','#c0503a','#e8d8a0'];for(let k=2;k<len-2;k+=4)B.push([x+k,7,z+.2,3,4,.4,cs[(k/4|0)%4]])}
function pTable(B,x,z,P){B.push([x,4,z,12,1,6,P.woodL],[x+.5,0,z+.5,1,4,1,P.wood],[x+10.5,0,z+.5,1,4,1,P.wood],[x+.5,0,z+4.5,1,4,1,P.wood],[x+10.5,0,z+4.5,1,4,1,P.wood],[x+1,2.4,z-3,10,.8,2.4,P.woodL],[x+1,2.4,z+6.6,10,.8,2.4,P.woodL],[x+3,5,z+2,1.6,2,1.6,'#a87a48'],[x+7,5,z+2.6,1.6,2,1.6,'#a87a48'])}

/* ---------- house generator ---------- */
function plotB(B,W,D,v){B.push([0,0,0,W,.5,D,'#8e887e']);const n=Math.floor(W*D/45);
  for(let i=0;i<n;i++){const x=hash(i,v,11)*(W-4),z=hash(i,v,12)*(D-4);B.push([x,.5,z,2+hash(i,v,13)*2.4,.25,2+hash(i,v,14)*1.8,hash(i,v,15)<.5?'#a8a296':'#77716a'])}
  for(let i=0;i<14;i++){const e=hash(i,v,16),r=hash(i,v,17);let x,z;if(e<.5){x=r*(W-3);z=hash(i,v,19)<.5?0:D-2.5}else{z=r*(D-3);x=hash(i,v,18)<.5?0:W-2.5}B.push([x,.5,z,2.5,1+hash(i,v,20),2.5,hash(i,v,21)<.5?'#5a9a3a':'#4a8a32'])}}
function archDoor(B,dx,fz,dw,dh,P,st){
  B.push([dx,2,fz-.6,dw,dh,1.5,P.door],[dx+1,2+dh,fz-.6,dw-2,1.3,1.5,P.door],[dx+2.2,2+dh+1.3,fz-.6,dw-4.4,.9,1.5,P.door],
    [dx-1.4,2,fz-.5,1.4,dh+1,1.9,st],[dx+dw,2,fz-.5,1.4,dh+1,1.9,st],[dx-.6,2+dh+.4,fz-.5,1.8,1.6,1.9,st],[dx+dw-1.2,2+dh+.4,fz-.5,1.8,1.6,1.9,st],
    [dx+.6,2+dh+1.4,fz-.5,2,1.4,1.9,st],[dx+dw-2.6,2+dh+1.4,fz-.5,2,1.4,1.9,st],[dx+2,2+dh+2.2,fz-.5,dw-4,1.4,1.9,st],
    [dx+dw/2-.3,2,fz+.85,.6,dh+1.5,.25,P.timber],[dx+dw-2.2,2+dh*.5,fz+.9,1,1,.6,'#c9a05a'],[dx+1,2+dh*.62,fz+.9,dw-2,.6,.3,'#3a3a3a'],[dx+1,2+dh*.25,fz+.9,dw-2,.6,.3,'#3a3a3a'],[dx-2,0,fz,dw+4,2,3,P.stoneD])}
function archWin(B,win,a,y,c,P,W,H,st){const id=WG++;win.push([a,y,c-.6,W,H,1.35,id],[a+1,y+H,c-.6,W-2,1.2,1.35,id]);
  B.push([a-1,y-1,c-.5,W+2,1.2,1.9,st],[a-1,y,c-.5,1,H+.6,1.9,st],[a+W,y,c-.5,1,H+.6,1.9,st],[a-.4,y+H,c-.5,1.4,1.4,1.9,st],[a+W-1,y+H,c-.5,1.4,1.4,1.9,st],[a+.6,y+H+1.2,c-.5,W-1.2,1.2,1.9,st],[a+W/2-.3,y,c-.7,.6,H+1,1.55,P.timber])}

/* grupowanie rekwizytów: każde wywołanie pXxx to grupa, którą można odsunąć od wejścia */
function pgw(f){return function(B,...a){const n=B.length;const r=f(B,...a);if(B.__g)B.__g.push([n,B.length]);return r}}
pBench=pgw(pBench);pFlowers=pgw(pFlowers);pBush=pgw(pBush);pBarrel=pgw(pBarrel);pCrate=pgw(pCrate);pSack=pgw(pSack);
if(typeof pWoodpile==='function')pWoodpile=pgw(pWoodpile);if(typeof pHay==='function')pHay=pgw(pHay);if(typeof pCart==='function')pCart=pgw(pCart);if(typeof pLaundry==='function')pLaundry=pgw(pLaundry);
function pgClear(B,zx0,zx1,zz0,zz1,W,ex){const ZS=[[zx0,zx1],...(ex||[])];const G=B.__g||[];B.__g=null;const dead=[];
  for(const [a,b] of G){let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(let i=a;i<b;i++){const q=B[i];x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]+q[3]);z0=Math.min(z0,q[2]);z1=Math.max(z1,q[2]+q[5])}
    const hit=(sx)=>ZS.some(q=>x1+sx>q[0]&&x0+sx<q[1])&&z1>zz0&&z0<zz1;if(!hit(0))continue;
    let ok=false;for(let k=1;k<=12&&!ok;k++)for(const sg of [1,-1]){const sx=sg*k*2;if(x0+sx<0||x1+sx>W)continue;if(!hit(sx)){for(let i=a;i<b;i++)B[i][0]+=sx;ok=true;break}}
    if(!ok)dead.push([a,b])}
  for(let k=dead.length-1;k>=0;k--)B.splice(dead[k][0],dead[k][1]-dead[k][0]);return B}
function houseGen(o,P,v){
  if(o.tower&&!/wiez|baszt|donjon|koszary|brama|zamek|ratusz|latarnia|mur/.test(GENTYPE||''))o={...o,tower:false};
  const B=[],win=[],chim=[],lamps=[],flags=[];const W=o.W,D=o.D;const SC=P.stone;
  if(o.plot!==false)plotB(B,W,D,v);
  const iL=o.iL??3,iR=o.iR??3,iB=o.iB??3,iF=o.iF??4;const x0=iL,z0=iB,w=W-iL-iR,d=D-iB-iF;
  B.push([x0-2,0,z0-2,w+4,2,d+4,P.found]);
  let ridge=o.ridge||'x';if(!o.wing&&!o.dormers&&!o.keepRidge&&Math.abs(w-d)>=6)ridge=w>d?'x':'z';const wg=ridge==='x'?o.wing:null;
  const wx0=wg?(wg.flush==='r'?x0+w-wg.w:wg.flush==='l'?x0:Math.max(x0+2,Math.min(x0+w-wg.w-2,x0+w/2+(wg.off||0)-wg.w/2))):0,wz0=z0+d-3,wdep=wg?wg.dep+3:0;
  if(wg)B.push([wx0-2,0,wz0,wg.w+4,2,wdep+2,P.found]);
  const arcD=o.arcade?(o.arcD||15):0;const dw=o.dw||10;const doorCx=wg?wx0+wg.w/2:x0+w/2+(o.doorOff||0);
  let y=2,J=0;const wo={shut:o.shut,flow:o.flow};const blkX=[];const FY=[],FJ=[];
  const useOriel=o.oriel??(!o.bays&&!o.cornerUp&&!o.corner&&o.floors>1&&!o.arcade&&hash(v,7,51)<.6),orF=o.floors>2&&hash(v,8,52)<.5?2:1;
  const useIvy=!o.vines&&(o.ivy??hash(v,o.W+o.D,71)<.4),ivF=o.jetty?1:o.floors;
  const sdS0=o.sideDoor==='r'?1:o.sideDoor==='l'?-1:0;const shopM=!!P.shopMode,bays=o.bays||[],zones=[],shopBlock=[],topOri=[];
  const balF=o.balcony&&o.floors>1?(o.balcAt??(wg?.22:.62)):null,bcx=balF!==null?x0+w*balF:-99;
  const csO=o.corner==='r'?1:o.corner==='l'?-1:0,cs=shopM?0:csO,aS=o.arcade?(o.arcSide==='r'?1:o.arcSide==='l'?-1:0):0,cuS=o.cornerUp==='r'?1:o.cornerUp==='l'?-1:0,cuF=o.cornerUpF??1;
  const cBox=cs?(cs>0?[x0+w-8,x0+w+4]:[x0-4,x0+8]):null,cuBox=cuS?(cuS>0?[x0+w-9,x0+w+3]:[x0-3,x0+9]):null;
  let wrapSg=o.arcade?0:(sdS0||(shopM?csO:0));if(wg){const fs=wg.flush==='r'?1:wg.flush==='l'?-1:0;if(fs&&!wrapSg)wrapSg=fs;if(wrapSg!==fs)wrapSg=0}
  if(wrapSg&&wrapSg===cuS)wrapSg=0;if(!shopM&&wrapSg&&wrapSg===csO)wrapSg=0;
  const bw=o.bwing||null,bwx0=bw?(bw.flush==='r'?x0+w-bw.w:bw.flush==='l'?x0:x0+w/2-bw.w/2+(bw.off||0)):0;if(bw)B.push([bwx0-2,0,z0-bw.dep-2,bw.w+4,2,bw.dep+4,P.found]);
  const TW=o.towerW||14,Jt=o.jetty?(o.jetStep||1.5)*(o.floors-1):0,ovT=Math.max(o.ov??3.2,o.ox??2.4);
  const TWX=o.tower?(o.turret==='r'?x0+w+Jt+ovT+1.2-TW:o.turret==='l'?x0-Jt-ovT-1.2:(o.towerRight?Math.min(W-TW,x0+w-6):Math.max(0,x0-8))):0;
  if(cBox){zones.push([cBox[0]-1,cBox[1]+1]);shopBlock.push([cBox[0]-1,cBox[1]+1])}
  if(o.tower){zones.push([TWX-1,TWX+TW+1]);shopBlock.push([TWX-1.5,TWX+TW+1.5])}
  if(cuBox)shopBlock.push([cuBox[0]-1,cuBox[1]+1]);if(balF!==null)shopBlock.push([bcx-8.5,bcx+8.5]);
  for(let f=0;f<o.floors;f++){
    const jet=o.jetty&&f>0?(o.jetStep||1.5)*f:0;J=jet;const fh=f===0&&o.fh0?o.fh0:o.fh;FY.push(y);FJ.push(jet);
    const style=(o.styles&&o.styles[f])||o.style||P.style;const arc=f===0?arcD:0;
    const X0=x0-jet,ww0=w+2*jet,sa=f===0?aS:0,X=X0+(sa<0?arcD:0),Z=z0-jet,ww=ww0-(sa?arcD:0),dd=d+2*jet-arc;
    wallBox(B,style,X,y,Z,ww,fh,dd,P,v*7+f);
    const wy=y+Math.max(3.5,fh*.27),wh=Math.min(10,fh*.5),front=Z+dd;
    const nf=Math.max(1,Math.round(ww/(o.wsp||20)));const oi=f>0&&useOriel&&f===orF?Math.floor(nf/2):-1;
    for(let i=0;i<nf;i++){const cx=X+ww*(i+.5)/nf;
      if(wg&&cx>wx0-4&&cx<wx0+wg.w+4)continue;
      if(o.noWin&&o.noWin.some(q=>cx>q[0]&&cx<q[1]&&(q[2]===undefined||q[2]===f)))continue;
      if(f===0&&!wg&&Math.abs(cx-doorCx)<dw/2+4)continue;
      if(f===1&&balF!==null&&Math.abs(cx-bcx)<9)continue;
      if(cBox&&f===0&&cx+4>cBox[0]&&cx-4<cBox[1])continue;
      if(cuBox&&f===cuF&&cx+4>cuBox[0]&&cx-4<cuBox[1])continue;
      if(o.tower&&f<2&&cx+4>TWX&&cx-4<TWX+TW)continue;
      if(f===0)blkX.push([cx-(o.shop?6.2:5.2),cx+(o.shop?6.2:5.2)]);
      if(f===0&&o.shop){addWin(B,win,'z+',cx-5,y+4,front,P,{ww:10,wh:8});if(o.awning!==false)for(let k=0;k<5;k++)B.push([cx-6+k*2.4,y+13,front+.6,2.4,1,4.4,k%2?'#f4efe4~':P.cloth+'~'],[cx-6+k*2.4,y+11.8,front+4.6,2.4,1.4,.4,k%2?'#f4efe4~':P.cloth+'~']);continue}
      const bay=bays.find(q=>q[0]===f&&(q[1]<0?nf+q[1]:q[1])===i);
      if(bay){if(f===0){groundBay(B,win,cx,y,front,P,fh,!!o.flow);blkX.push([cx-9,cx+9]);zones.push([cx-9,cx+9]);shopBlock.push([cx-9,cx+9])}else{oriel(B,win,cx-2.5,wy,front,P,5,wh,!!o.flow);if(f===1)shopBlock.push([cx-7.5,cx+7]);if(f===o.floors-1)topOri.push(cx)}continue}
      if(i===oi){oriel(B,win,cx-2.5,wy,front,P,5,wh,!!o.flow);if(f===1)shopBlock.push([cx-7.5,cx+7]);if(f===o.floors-1)topOri.push(cx);continue}
      if(f===0&&o.archWin&&style==='stone')archWin(B,win,cx-2.5,y+4,front,P,5,Math.min(9,wh),P.stoneD);else addWin(B,win,'z+',cx-2.5,wy,front,P,{...wo,flow:wo.flow&&hash(v*13+f,i,44)<.7,wh})}
    const nb=Math.max(1,Math.round(ww/30));if(!o.noBack&&hash(v,f,41)>.2)for(let i=0;i<nb;i++){const cx=X+ww*(i+.5)/nb;if(bw&&cx>bwx0-4&&cx<bwx0+bw.w+4)continue;addWin(B,win,'z-',cx-2.5,wy,Z,P,{wh})}
    const ns=Math.max(1,Math.round(dd/(o.wsp2||26)));const sdS=o.sideDoor==='r'?1:o.sideDoor==='l'?-1:0;const csk=(sg,cz)=>(((cs===sg&&f===0)||(cuS===sg&&f===cuF))&&cz+3.5>z0+d-8)||(sdS===sg&&f===0&&Math.abs(cz-(z0+d*.4))<9)||(o.shop&&!shopM&&!wg&&wrapSg===sg&&f===0&&cz>z0+d*(o.sideDoor?.4:.2)+(o.sideDoor?8:0)-6);for(let i=0;i<ns;i++){const cz=Z+dd*(i+.5)/ns;if(!csk(1,cz)&&!(o.sideChim&&f<2&&Math.abs(cz-(z0+d*.3+3.5))<6)&&hash(v*5+f,i,46)>.3)addWin(B,win,'x+',cz-2.5,wy,X+ww,P,{...wo,flow:wo.flow&&hash(v,f*9+i,47)<.5,wh});if(!csk(-1,cz)&&!(useIvy&&f<ivF)&&hash(v*5+f,i,48)>.3)addWin(B,win,'x-',cz-2.5,wy,X,P,{...wo,flow:wo.flow&&hash(v,f*9+i,49)<.5,wh})}
    if(f===0&&o.shop&&wrapSg&&!shopM&&!wg){const sg=wrapSg,xf=sg>0?X+ww:X,c0=P.cloth+'~',c1='#f4efe4~',lim=z0+d*(o.sideDoor?.4:.2)+(o.sideDoor?8:0);
      for(let i=0;i<3;i++){const cz=front-6-12*i;if(cz-6<lim)break;addWin(B,win,sg>0?'x+':'x-',cz-5,y+4,xf,P,{ww:10,wh:8});
        for(let k=0;k<5;k++){const c=k%2?c1:c0;B.push([sg>0?xf+.6:xf-5,y+13,cz-6+k*2.4,4.4,1,2.4,c],[sg>0?xf+4.6:xf-5,y+11.8,cz-6+k*2.4,.4,1.4,2.4,c])}}
      const c=c0;B.push([sg>0?xf+.6:xf-5,y+13,front+.6,4.4,1,4.4,c],[sg>0?xf+.6:xf-5,y+11.8,front+4.6,4.4,1.4,.4,c],[sg>0?xf+4.6:xf-5,y+11.8,front+.6,.4,1.4,4.4,c])}
    if(arc){const fzA=z0+d,n=Math.max(2,Math.round(w/15));B.push([x0,2,fzA-arcD,w,.3,arcD,'#a8a296']);
      for(let i=0;i<=n;i++){const px=x0+(w-3.4)*i/n;B.push([px,y,fzA-3.4,3.4,fh,3.4,SC],[px-.4,y,fzA-3.8,4.2,1.2,4.2,P.stoneD],[px-.4,y+fh-1.2,fzA-3.8,4.2,1.2,4.2,P.stoneD])}
      for(let i=0;i<n;i++){const ax=x0+(w-3.4)*i/n+3.4,aw=(w-3.4)/n-3.4;B.push([ax,y+fh-2.6,fzA-3.4,aw,2.6,3.4,SC],[ax,y+fh-4.2,fzA-3.4,1.8,1.6,3.4,SC],[ax+aw-1.8,y+fh-4.2,fzA-3.4,1.8,1.6,3.4,SC],[ax,y+fh-5.4,fzA-3.4,.9,1.2,3.4,SC],[ax+aw-.9,y+fh-5.4,fzA-3.4,.9,1.2,3.4,SC])}
      B.push([x0,y+fh-1,fzA-arcD,w,1,arcD,P.timber],[x0+w/2-.3,y+fh-3,fzA-5.3,.6,2.4,.6,'#2a2a2a'],[x0+w/2-1,y+fh-5.2,fzA-6,2,2.2,2,'#2a2a2a']);lamps.push([x0+w/2,y+fh-4.1,fzA-5]);
      if(aS){const xs0=aS>0?x0+w-arcD:x0,px=aS>0?x0+w-3.4:x0,n2=Math.max(2,Math.round((d-3.4)/15));B.push([xs0,2,z0,arcD,.3,d-arcD+.1,'#a8a296']);
        for(let i=0;i<n2;i++){const pz=z0+(d-3.4)*i/n2;B.push([px,y,pz,3.4,fh,3.4,SC],[px-.4,y,pz-.4,4.2,1.2,4.2,P.stoneD],[px-.4,y+fh-1.2,pz-.4,4.2,1.2,4.2,P.stoneD]);
          const az=pz+3.4,al=(d-3.4)/n2-3.4;B.push([px,y+fh-2.6,az,3.4,2.6,al,SC],[px,y+fh-4.2,az,3.4,1.6,1.8,SC],[px,y+fh-4.2,az+al-1.8,3.4,1.6,1.8,SC],[px,y+fh-5.4,az,3.4,1.2,.9,SC],[px,y+fh-5.4,az+al-.9,3.4,1.2,.9,SC])}
        B.push([xs0,y+fh-1,z0,arcD,1,d-arcD+.1,P.timber],[xs0+arcD/2-.3,y+fh-3,z0+d*.62,.6,2.4,.6,'#2a2a2a'],[xs0+arcD/2-1,y+fh-5.2,z0+d*.62-.7,2,2.2,2,'#2a2a2a']);lamps.push([xs0+arcD/2,y+fh-4.1,z0+d*.62+.3]);
        pBarrel(B,aS>0?xs0+3:xs0+arcD-8,z0+d*.25);shopBlock.push([xs0-2,xs0+arcD+2]);zones.push([xs0-2,xs0+arcD+2])}
      pBarrel(B,aS<0?x0+w-8:x0+2,fzA-8);pBench(B,aS>0?x0+6:x0+w-12,fzA-7.5,'x',P)}
    if(bw){const bz=z0-bw.dep;wallBox(B,style,bwx0,y,bz,bw.w,fh,bw.dep+3,P,v*17+f);const sw=Math.min(5,bw.dep-2);addWin(B,win,'x+',bz+(bw.dep)/2-sw/2,wy,bwx0+bw.w,P,{wh,ww:sw});addWin(B,win,'x-',bz+(bw.dep)/2-sw/2,wy,bwx0,P,{wh,ww:sw});addWin(B,win,'z-',bwx0+bw.w/2-2.5,wy,bz,P,{wh})}
    if(wg){const wf=wz0+wdep+jet;wallBox(B,style,wx0,y,wz0,wg.w,fh,wf-wz0,P,v*11+f);
      if(f>0)addWin(B,win,'z+',wx0+wg.w/2-3,wy,wf,P,{...wo,wh});
      const sw=Math.min(5,wdep-2);addWin(B,win,'x+',wz0+(wf-wz0)/2-sw/2,wy,wx0+wg.w,P,{wh,ww:sw});addWin(B,win,'x-',wz0+(wf-wz0)/2-sw/2,wy,wx0,P,{wh,ww:sw})}
    if(cBox&&f===0){cornerBox(B,win,P,cBox,cs,y,fh,front,true);if(o.cornerRoof){const [x1,x2]=cBox,fz1=front-8,t=y+fh-1.4+1.1,TB=P.timber;
      for(const [px,pz] of [[cs>0?x2-1.2:x1-.2,front+3.2],[cs>0?x2-1.2:x1-.2,fz1-.4],[cs>0?x1-.4:x2-1,front+3.2]])B.push([px,t,pz,1,10.5,1,TB]);
      B.push([x1-1.6,t+10.4,fz1-1.6,x2-x1+3.2,1,front+4-fz1+3.2,TB]);
      gableRoof(B,x1-2,fz1-2,x2-x1+4,front+4-fz1+4,t+11.4,P,{ridge:'z',ov:.6,sh:2,st:1.8,ox:.6,gtimber:true})}}
    if(cuBox&&f===cuF){const bb=cuS>0?[X+ww-9,X+ww+3]:[X-3,X+9];cornerBox(B,win,P,bb,cuS,y,fh,front,false)}
    if(f<o.floors-1){B.push([X0-.8,y+fh,Z-.8,ww0+1.6,1.2,dd+arc+1.6,P.timber]);if(o.jetty)for(let bx=X0+2;bx<X0+ww0-1;bx+=5)B.push([bx,y+fh-1.1,Z+dd+arc,1.2,1.2,1.6,P.timber])}
    y+=fh+(f<o.floors-1?1.2:0);
  }
  const fz=wg?wz0+wdep:z0+d-arcD;const dh=Math.min(o.dh||14,(o.fh0||o.fh)-4),dx=doorCx-dw/2;
  if(useIvy){const top=ivF<o.floors?FY[ivF]-1:y-1;const len=Math.min(18,d*.5);ivyB(B,'x-',x0,z0+d-len,len,top,v*17+o.W)}
  const freeX=(a,b)=>!blkX.some(q=>b>q[0]&&a<q[1])&&(!o.porch||(b<dx-5.2||a>dx+dw+5.2))&&a>=x0+1&&b<=x0+w-1;
  if(!shopM&&(o.pots??hash(v,o.D,61)<.65)){const pl=[dx-4.5,dx-8.5,dx-12.5].find(u=>freeX(u-2.4,u+2.4));if(pl!==undefined)pHang(B,'z+',fz,pl,2+dh-1,v+o.W);
    if(o.lamp===false||hash(v,2,62)<.4){const pr=[dx+dw+(o.lamp===false?4.5:7.5),dx+dw+11.5,dx+dw+15.5].find(u=>freeX(u-2.4,u+2.4));if(pr!==undefined)pHang(B,'z+',fz,pr,2+dh-1,v+3)}}
  if(o.arch!==false&&dw<16)archDoor(B,dx,fz,dw,dh,P,P.stoneD);
  else{B.push([dx,2,fz-.6,dw,dh,1.5,P.door],[dx+dw/2-.3,2,fz+.85,.6,dh,.25,P.timber],[dx-1,2+dh,fz-.8,dw+2,1.4,1.9,P.timber],[dx+dw-2,2+dh*.5,fz+.9,1,1,.6,'#c9a05a'],[dx-2,0,fz,dw+4,2,3,P.stoneD]);
    if(dw>=16)for(let k=0;k<3;k++)B.push([dx+1+k*(dw-2)/3,2+dh*.3+k*dh*.2,fz+.85,(dw-2)/3,1,.3,P.timber])}
  if(!shopM&&o.lamp!==false&&freeX(dx+dw+1.2,dx+dw+4.2)){B.push([dx+dw+2,dh-1,fz+.5,.8,.8,2,'#2a2a2a'],[dx+dw+1.6,dh-4.4,fz+1.9,2.2,3.4,2.2,'#2a2a2a']);lamps.push([dx+dw+2.7,dh-2.7,fz+3])}
  if(o.sideDoor){const sg=o.sideDoor==='r'?1:-1,cz=z0+d*.4,aSd=aS===sg,xw=sg>0?x0+w-(aSd?arcD:0):x0+(aSd?arcD:0),bx=(off,ww)=>sg>0?xw+off:xw-off-ww;
    B.push([bx(-.6,1.5),2,cz-4,1.5,13,8,P.door],[bx(-.8,1.9),2,cz-5.2,1.9,14.6,1.2,P.stoneD],[bx(-.8,1.9),2,cz+4,1.9,14.6,1.2,P.stoneD],[bx(-.8,1.9),15,cz-5.2,1.9,1.6,10.4,P.stoneD],[bx(0,3.4),0,cz-5,3.4,2,10,P.stoneD],[bx(.7,.6),8,cz+2,.6,1,.6,'#c9a05a'],
      ...(aSd?[]:[[bx(-.4,4.4),17.4,cz-6.4,4.4,.8,12.8,P.roofB],[bx(-.4,3.2),18.2,cz-5.6,3.2,.8,11.2,P.roofA],[bx(.2,.8),13,cz-6.2,.8,4.4,.8,P.timber],[bx(.2,.8),13,cz+5.4,.8,4.4,.8,P.timber]]));
    lamps.push([sg>0?xw+1.2:xw-1.2,12,cz+7.4]);B.push([bx(.2,1.4),9,cz+6.9,1.4,3,1.4,'#2a2a2a'])}
  if(o.sign&&!shopM){const sx=dx-6;B.push([sx+.8,dh+1,fz+.5,.6,.6,5,'#2a2a2a'],[sx,dh-5,fz+3.2,2.4,5,.4,'#6b4528'],[sx+.4,dh-4,fz+3.7,1.6,3,.2,'#e8c040'])}
  const rs={ov:o.ov??3.2,sh:o.rsh??3,st:o.rst??2.1,ox:o.ox??2.4,gtimber:o.gtimber,gable:o.gableC};
  const R=gableRoof(B,x0-J,z0-J,w+2*J,d+2*J,y,P,{ridge,...rs});
  if(o.flag){const fx=x0+w/2,fz2=z0+d/2;B.push([fx-.7,R.top,fz2-.7,1.4,10,1.4,P.timber],[fx-1.2,R.top+9.4,fz2-1.2,2.4,1,2.4,'#c9a24a']);flags.push([fx+.7,R.top+8,fz2,P.cloth])}
  if(bw)gableRoof(B,bwx0,z0-bw.dep,bw.w,bw.dep+3+J,y,P,{ridge:'z',...rs,ox:1.8,ov:Math.min(rs.ov,2.4)});
  if(wg){gableRoof(B,wx0,wz0,wg.w,wdep+J,y,P,{ridge:'z',...rs,ox:1.8,ov:Math.min(rs.ov,2.4)});addWin(B,win,'z+',wx0+wg.w/2-2.5,y+2.5,wz0+wdep+J+.3,P,{ww:5,wh:5,flow:o.flow})}
  if(o.gwin){const yy=y+2.5;const g2=o.gwin2;
    if(ridge==='x'){for(const [face,c] of [['x+',x0+w+J+.3],['x-',x0-J-.3]]){if(o.sideChim&&face==='x+')continue;addWin(B,win,face,z0+d/2-2.5,yy,c,P,{ww:4,wh:7});if(g2)addWin(B,win,face,z0+d/2-2,yy+9,c,P,{ww:4,wh:4})}}
    else{for(const [face,c] of [['z+',z0+d+J+.3],['z-',z0-J-.3]]){if(g2){addWin(B,win,face,x0+w*.3-2.5,yy,c,P,{ww:5,wh:6,flow:face==='z+'&&o.flow});addWin(B,win,face,x0+w*.7-2.5,yy,c,P,{ww:5,wh:6,flow:face==='z+'&&o.flow});addWin(B,win,face,x0+w/2-2,yy+10,c,P,{ww:4,wh:5})}else addWin(B,win,face,x0+w/2-2.5,yy,c,P,{ww:4,wh:7})}}}
  const dAt=o.dormAt||(o.dormers?Array.from({length:o.dormers},(_,k)=>(k+1)/(o.dormers+1)):[]);
  if(dAt.length&&ridge==='x'){for(const fr of dAt){const cx=x0+w*fr;if(wg&&cx>wx0-6&&cx<wx0+wg.w+6)continue;if(topOri.some(q=>Math.abs(q-cx)<11))continue;if(o.tower&&cx>TWX-8&&cx<TWX+TW+8)continue;const dz=z0+d-9,dyy=y+1;
    B.push([cx-5,dyy,dz,10,8,10,P.wall],[cx-5.4,dyy,dz+9.4,.8,8,.8,P.timber],[cx+4.6,dyy,dz+9.4,.8,8,.8,P.timber]);
    gableRoof(B,cx-5,dz,10,10.5,dyy+8,P,{ridge:'z',ov:1,sh:2,st:1.7,ox:.8});addWin(B,win,'z+',cx-2,dyy+1.2,dz+10,P,{ww:4,wh:6})}}
  if(o.sdorm&&ridge==='z'){for(const fr of o.sdorm){const cz=z0+d*fr,dyy=y+1;for(const sd of (o.sdormSide==='both'?[1,-1]:o.sdormSide==='x-'?[-1]:[1])){const bx0=sd>0?x0+w-9:x0-1,fx=sd>0?x0+w+1:x0-1;
    B.push([bx0,dyy,cz-5,10,8,10,P.wall],[sd>0?fx-.4:fx-.4,dyy,cz-5.4,.8,8,.8,P.timber],[sd>0?fx-.4:fx-.4,dyy,cz+4.6,.8,8,.8,P.timber]);
    gableRoof(B,bx0,cz-5,10.5,10,dyy+8,P,{ridge:'x',ov:1,sh:2,st:1.7,ox:.8});addWin(B,win,sd>0?'x+':'x-',cz-2,dyy+1.2,fx,P,{ww:4,wh:6})}}}
  const roofAt=(px,pz)=>{const b=ridge==='x'?pz-(z0-J):px-(x0-J),Wd=ridge==='x'?d+2*J:w+2*J;const e=Math.min(b,Wd-b)+rs.ov;return Math.min(R.top-1.3,y+(Math.floor(Math.max(0,e)/rs.st)+1)*rs.sh*ROOFK)};
  for(const [fx,fz2] of (o.chim||[])){const cx=x0+w*fx,cz=z0+d*fz2;const ct=Math.max(roofAt(cx+(ridge==='z'?(fx<.5?2.6:-2.6):0),cz+(ridge==='x'?(fz2<.5?2.6:-2.6):0)),y+3)+3;B.push([cx-2.4,y-3,cz-2.4,4.8,ct-y+3,4.8,P.chimney],[cx-2.8,ct,cz-2.8,5.6,1,5.6,P.stoneD]);chim.push([cx,ct+1,cz])}
  if(o.sideChim){const cx=x0+w+J,cz=z0+d*.3;const ct=Math.max(roofAt(cx,cz+7),y+3)+3.5;B.push([cx-.5,0,cz,6.5,y-4,7.5,SC],[cx-.5,y-4,cz+.5,5.5,ct-y+4,6.5,SC],[cx-1,ct,cz,6.5,1,7.5,P.stoneD],[cx-1.2,y-6,cz-.5,7.7,1.2,8.5,P.stoneD]);chim.push([cx+2.25,ct+1,cz+3.75])}
  if(o.tower){const T=TW,tx=TWX,tz=z0+d+(o.towerF??(J+rs.ov+1.5))-T,H=y+12;
    B.push([tx,0,tz+3,T,H,T-6,SC],[tx+3,0,tz,T-6,H,T,SC],[tx+1.5,0,tz+1.5,T-3,H,T-3,SC]);
    for(const yy of [12,26,40])if(yy<H-3)B.push([tx-.4,yy,tz+2.6,T+.8,1,T-5.2,P.stoneD],[tx+2.6,yy,tz-.4,T-5.2,1,T+.8,P.stoneD]);
    win.push([tx+T/2-1,9,tz+T-.6,2,5,1.35],[tx+T/2-1.5,H-11,tz+T-.6,3,6,1.35],[((o.towerRight||o.turret==='r')?tx+T-.75:tx-.6),H-11,tz+T/2-1.5,1.35,6,3]);for(let yy=31;yy<H-14;yy+=22)win.push([tx+T/2-1,yy,tz+T-.6,2,5,1.35]);
    for(let i=0;i<12;i++){const s=T+3-i*1.45;if(s<1)break;B.push([tx+T/2-s/2,H+i*2.8,tz+T/2-s/2,s,2.8,s,i%2?P.roofB:P.roofA])}
    B.push([tx+T/2-.4,H+33,tz+T/2-.4,.8,6,.8,'#c9a24a']);flags.push([tx+T/2+.4,H+37,tz+T/2,P.cloth])}
  if(o.balcony&&o.floors>1){const y1=FY[1],f1=z0+d+FJ[1],bx=x0+w*balF-7;
    B.push([bx,y1-1,f1,14,1,5,P.wood],[bx,y1+3,f1+4.4,14,.8,.8,P.wood],[bx,y1+3,f1,.8,.8,5,P.wood],[bx+13.2,y1+3,f1,.8,.8,5,P.wood],[bx+1,y1-4,f1,1,3,1.2,P.timber],[bx+12,y1-4,f1,1,3,1.2,P.timber],[bx+5,y1,f1-.6,4,10,1.5,P.door]);
    for(let k=0;k<14;k+=2.3)B.push([bx+k,y1,f1+4.5,.6,3,.6,P.wood]);B.push([bx+1,y1,f1+3.2,3,2,1.4,'#8a5a30'],[bx+1.2,y1+2,f1+3.4,2.6,1,1,P.flower])}
  if(o.porch){const pd=Math.max(4,iF-2);B.push([dx-4,2,fz+pd-1.6,1.4,dh+2,1.4,P.timber],[dx+dw+2.6,2,fz+pd-1.6,1.4,dh+2,1.4,P.timber],[dx-5,dh+4,fz-1,dw+10,1.2,pd+1,P.roofB],[dx-4.5,dh+5.2,fz-1,dw+9,1,pd-1,P.roofA],[dx-4,0,fz,dw+8,1.6,pd,P.woodL]);B.push([dx-3.2,2,fz+pd-3.6,2.6,2.2,2.6,'#8a5a30'],[dx-3,4.2,fz+pd-3.4,2.2,1.4,2.2,P.flower||'#c43a3a'],[dx+dw+.8,2,fz+pd-3.6,2.6,2.2,2.6,'#8a5a30'],[dx+dw+1,4.2,fz+pd-3.4,2.2,1.4,2.2,P.flower||'#e8c040'])}
  if(o.annex){const ax=x0+w,aw=iR-1;B.push([ax,2,z0+4,aw,12,d-8,P.wood],[ax,14,z0+2,aw+1,1.6,d-4,P.roofA],[ax+aw-1,2,z0+6,1.2,8,6,P.door])}
  if(o.vines){for(let i=0;i<9;i++){const k=hash(i,v,31);B.push([x0-1.2+k*2,2+i*2.1,z0+d-.4+(o.arcade?-arcD:0),1.4+k*1.5,2.3,1.3,i%3?'#3c7432':'#4a8a3a'])}for(let i=0;i<6;i++)B.push([x0-1.4,2+i*2.3,z0+d-3-hash(i,v,33)*4,1.3,2.4,1.6+hash(i,v,34),'#3c7432'])}
  if(o.props){B.__g=[];o.props(B,lamps,{x0,z0,w,d,fz,dx,dw,W,D,flags});pgClear(B,dx-(shopM?18:8),dx+dw+(shopM?18:8),fz-3,D+6,W,zones)}
  return {B,win,chim,lamps,flags,shopBlock,zones,wingX:wg?[wx0,wx0+wg.w]:null,wrap:wrapSg?{sg:wrapSg,xw:wrapSg>0?x0+w:x0,zend:o.sideDoor?z0+d*.4+9:z0+d*.42}:null,holes:[[dx-.6,1,fz-.6,dw+1.2,dh+2.4,1.35]]};
}
/* ---------- type generators ---------- */
function chataGen(P,v){const rz=v===1||v===3;
  const r=houseGen({W:48,D:48,iL:5,iR:5,iB:5,iF:12,floors:1,fh:20,styles:[['timber','plaster','timber','stone','plaster'][v]],ridge:rz?'z':'x',rsh:3.3,rst:1.9,ov:3.2,ox:2.4,
    gtimber:true,gwin:true,shut:v!==2,flow:true,chim:[[v<3?.75:.28,.4]],lamp:v%2===0,porch:v===4,ivy:v===2,pots:v!==2,
    props:(B,L,g)=>{pFence(B,1,45.5,13,'x',P.wood);pFence(B,34,45.5,13,'x',P.wood);pFlowers(B,3,39,9,4,v);pFlowers(B,36,39,9,4,v+2);
      if(v!==4)pBench(B,v===2?33:6,g.fz+.2,'x',P);if(v===2)pWoodpile(B,1,8,24,'z');if(v===4)pLaundry(B,30,2,14);if(v===0||v===3)pBarrel(B,41,31)}},P,v);
  return r}
function chalupaGen(P,v){const r=houseGen({arch:false,W:48,D:64,iL:4,iR:v===2||v===4?14:4,iB:4,iF:12,floors:1,fh:20,ridge:'z',rsh:3.1,rst:2,ov:4,porch:true,annex:v===2||v===4,shut:v!==3,flow:v===0||v===1,chim:[[.5,.3]],gwin:true},P,v);const B=r.B;
  if(v===1)pCart(B,38,6);if(v===3)pHay(B,38,8);pFlowers(B,4,56,8,5,v);pBarrel(B,v===2||v===4?3:39,40);if(v===0)pWoodpile(B,42,6,20,'z');
  return r}
function domGen(P,v){return houseGen({W:64,D:64,iL:4,iR:v>=3?8:4,iB:4,iF:9,floors:2,fh0:19,fh:17,styles:['stone','timber'],jetty:true,ridge:'x',rsh:3.3,rst:1.9,ov:3.4,
  wing:v===1?null:{w:v===2?22:24,dep:6,off:v===2?-12:v===4?10:0},archWin:true,dormers:v===1?2:1,gtimber:true,gwin:true,shut:v===1||v===3,flow:true,sideChim:v>=3,chim:v<3?[[.2,.3]]:[],vines:v===4,
  props:(B,L,g)=>{pBench(B,g.x0+1,g.D-6,'x',P);pBarrel(B,g.W-7,g.D-6);pBarrel(B,g.W-11.5,g.D-6);pFlowers(B,g.x0+12,g.D-6,9,4,v)}},P,v)}
function kupiecGen(P,v){return houseGen({W:64,D:64,iL:4,iR:8,iB:4,iF:12,floors:2,fh0:19,fh:17,styles:['stone','timber'],jetty:true,ridge:v%2?'z':'x',rsh:3.3,rst:1.9,ov:3.2,
  wing:v%2?null:{w:22,dep:5,off:12},shop:true,sign:true,sideChim:v%2===0,chim:v%2?[[.8,.3]]:[],gtimber:true,gwin:true,shut:true,flow:v!==2,dormers:1,
  props:(B,L,g)=>{const sx=g.x0+3,sz=g.D-9;B.push([sx,0,sz,16,6,4,'#8a6a44'],[sx-.5,6,sz-.5,17,.8,5,'#a37a48'],[sx+1,6.8,sz+.5,3.4,1.6,3,'#d8b24a'],[sx+5,6.8,sz+.5,3.4,1.6,3,'#c07a3a'],[sx+9,6.8,sz+.5,3.4,1.6,3,'#86c060'],[sx+13,6.8,sz+.5,2.4,1.6,3,'#a8303a']);
    pCrate(B,g.W-14,g.D-8);pCrate(B,g.W-14,g.D-8,5,'#8a6a44');pBarrel(B,g.W-8,g.D-7);pSack(B,sx+17,sz+1,'#d8b24a')}},P,v)}
function wiezaDomGen(P,v){return houseGen({W:64,D:64,iL:10,iR:4,iB:4,iF:9,floors:2,fh0:19,fh:17,styles:[v===1?'timber':'stone','timber'],jetty:true,ridge:'x',rsh:3.3,rst:1.9,ov:3.2,
  tower:true,dormers:v%2?1:2,doorOff:6,gtimber:true,gwin:true,shut:v!==2,flow:true,chim:[[.75,.3]],vines:v===3,balcony:v===4,
  props:(B,L,g)=>{pFlowers(B,g.W-14,g.D-6,10,4,v);pBarrel(B,1,g.D-6);pLantern(B,L,g.W-3,g.D-3,12)}},P,v)}
function podcieniaGen(P,v){return houseGen({W:64,D:64,iL:3,iR:3,iB:3,iF:5,floors:3,fh0:18,fh:15,styles:['stone','timber','timber'],arcade:true,jetty:v%2===0,jetStep:1,ridge:'x',rsh:3.3,rst:1.9,ov:3,
  dormers:2,gtimber:true,gwin:true,gwin2:true,shut:true,flow:true,balcony:v!==2,chim:[[.15,.3],[.85,.3]],wsp:20,lamp:false,vines:v===1},P,v)}
function blizniakGen(P,v){const P2={...PAL[(v+2)%5],style:'timber'};const B=[],win=[],chim=[],lamps=[],flags=[];plotB(B,96,64,v);
  const r1=houseGen({W:48,D:64,iL:3,iR:0,iB:4,iF:8,floors:2,fh0:19,fh:17,styles:['stone','timber'],jetty:true,ridge:'z',rsh:3.4,rst:1.9,ov:1.8,ox:1.8,gtimber:true,gwin:true,gwin2:false,archWin:true,shut:true,flow:true,chim:[[.85,.3]],plot:false},P,v);
  const r2=houseGen({W:48,D:64,iL:0,iR:3,iB:4,iF:8,floors:2,fh0:19,fh:17,styles:[v%2?'stone':'timber','timber'],jetty:true,ridge:'z',rsh:3.6,rst:1.8,ov:1.8,ox:1.8,gtimber:true,gwin:true,gwin2:true,shut:v!==3,flow:v!==1,plot:false,sign:v===4},P2,(v+3)%5);
  const sh=a=>{const c=a.slice();c[0]+=48;return c};B.push(...r1.B,...r2.B.map(sh));win.push(...r1.win,...r2.win.map(sh));chim.push(...r1.chim,...r2.chim.map(sh));lamps.push(...r1.lamps,...r2.lamps.map(sh));
  pFence(B,47.5,58,6,'z','#7a5a3a');pBench(B,4,57,'x',P);pBarrel(B,88,56);pFlowers(B,60,57,10,4,v);
  return {B,win,chim,lamps,flags,holes:[...r1.holes,...r2.holes.map(sh)]}}
function dlugiGen(P,v){const r=houseGen({styles:v===2?['stone']:null,W:48,D:96,iL:4,iR:4,iB:4,iF:6,floors:1,fh:21,ridge:'z',rsh:3,rst:2,ov:4,style:v===4?'log':'timber',gtimber:true,gwin:true,gwin2:false,dw:18,dh:16,chim:[[.5,.25]],shut:v%2===1,flow:v===0,lamp:true},P,v);const B=r.B;
  B.push([2,0,40,2,6,10,P.wood],[1,0,62,3,6,4,'#d8c060']);pHay(B,39,88);pCart(B,1,74);pBarrel(B,40,40);
  return r}
function kamienicaGen(P,v){return houseGen({arcade:v===2||v===4,W:48,D:64,iL:2,iR:2,iB:2,iF:5,floors:4,fh0:18,fh:15,styles:['stone','prussian','prussian','prussian'],jetty:true,jetStep:.9,ridge:'z',rsh:3.6,rst:1.9,ov:1.6,ox:1.6,gtimber:true,gableC:P.brick,gwin:true,gwin2:true,shop:true,shut:v!==1,flow:v!==2,chim:[[.15,.3],[.85,.7]],wsp:22,lamp:true,sign:true,dw:9},P,v)}
function dworekGen(P,v){const r=houseGen({arch:false,W:80,D:80,iL:8,iR:8,iB:14,iF:18,floors:1,fh:24,style:'plaster',ridge:'x',rsh:2.7,rst:2.9,ov:4,ox:3,dormers:v===1||v===3?2:0,shut:true,flow:v!==4,chim:[[.25,.5],[.75,.5]],lamp:false,dw:10,wsp:16},P,v);const B=r.B,lamps=r.lamps,win=r.win;
  const fz=14+48;B.push([22,0,fz,36,2.4,12,P.stone],[24,0,fz+12,32,1.2,3,P.stoneD]);
  for(const cx of [24,32,45.5,53.5])B.push([cx,2.4,fz+8,2.6,22,2.6,'#f8f4ec'],[cx-.6,24,fz+7.4,3.8,1,3.8,P.quoin],[cx-.6,2.4,fz+7.4,3.8,1,3.8,P.quoin]);
  B.push([21,25.6,fz-1,38,2.4,13.4,P.cornice]);for(let i=0;i<9;i++)B.push([22+i*2,28+i*1.6,fz+10.5,36-i*4,1.6,1.6,P.wall],[21.4+i*2,28+i*1.6,fz-1,37.2-i*4,1.2,13,i%2?P.roofB:P.roofA]);
  win.push([38,31,fz+11.6,4,4,1]);pLantern(B,lamps,18,fz+8,13);pLantern(B,lamps,60,fz+8,13);pFlowers(B,8,fz+2,12,8,v);pFlowers(B,60,fz+2,12,8,v+3);B.push([32,0,fz+15,16,.3,3,'#c9b890']);
  if(v===2||v===4){B.push([0,2,26,8,18,26,P.wall],[0,20,25,9,1.6,28,P.roofA]);B.push([72,2,26,8,18,26,P.wall],[71,20,25,9,1.6,28,P.roofA])}
  return r}
function rezGen(P,v){
  const B=[[0,0,0,96,3,96,P.stoneD]],win=[],lamps=[],flags=[];const wallC=v%2?P.wall:P.stone;
  B.push([14,3,16,68,46,44,wallC],[13,25,15,70,2,46,P.stoneD],[13,48,15,70,2,46,P.stoneD]);
  for(let x=18;x<80;x+=10){if(x>38&&x<54)continue;addWin(B,win,'z+',x,9,60,P,{wh:9,shut:v===1})}
  for(let x=18;x<80;x+=10)addWin(B,win,'z+',x,32,60,P,{wh:9,flow:v!==2});
  B.push([43,3,59.4,10,20,1.2,P.door],[42,23,59.2,12,2,1.6,P.timber],[36,0,60,24,3,8,P.stone],[40,3,60.5,2.5,22,2.5,'#d8d2c4'],[53.5,3,60.5,2.5,22,2.5,'#d8d2c4'],[38,25,59,20,2,8,P.stoneD]);
  const top=gableX(B,14,16,68,44,50,3,2.6,3,P.roofA,P.roofB);B.push([11,top,36,74,1.6,4,P.ridge]);
  B.push([22,46,22,6,top-46+8,6,P.stone],[70,46,22,6,top-46+8,6,P.stone]);
  for(const tx of [2,74]){B.push([tx,3,52,20,68,20,P.stone],[tx-1,71,51,22,3,22,P.stoneD]);for(let i=0;i<4;i++)B.push([tx-1+i*6.3,74,51,3,3,2,P.stoneD],[tx-1+i*6.3,74,71,3,3,2,P.stoneD]);
    for(let i=0;i<10;i++){const s=22-i*2.2;B.push([tx-1+i*1.1,77+i*3.4,51+i*1.1,s,3.4,s,i%2?P.roofB:P.roofA])}
    B.push([tx+9.3,111,61.3,1.4,8,1.4,'#c9a24a']);flags.push([tx+10.7,116,62,P.cloth]);
    addWin(B,win,'z+',tx+7,20,72,P,{wh:9});addWin(B,win,'z+',tx+7,46,72,P,{wh:9})}
  B.push([2,3,88,36,8,3,P.stone],[58,3,88,36,8,3,P.stone],[38,3,86,3,15,5,P.stoneD],[55,3,86,3,15,5,P.stoneD],[37,18,86,22,2,5,P.stoneD]);
  B.push([26,3,66,14,5,14,'#3c6a2e'],[56,3,66,14,5,14,'#3c6a2e'],[44,3,70,8,4,8,P.stone],[45,7,71,6,.5,6,'#4a7ab0'],[47,7,73,2,7,2,P.stone]);
  pLantern(B,lamps,34,62,14);pLantern(B,lamps,60,62,14);
  return {B,win,chim:[[25,top+9,25],[73,top+9,25]],lamps,flags};
}
function karczmaGen(P,v){const r=houseGen({W:64,D:64,iL:4,iR:v%2?4:12,iB:4,iF:18,floors:2,fh:19,ridge:v%2?'z':'x',jetty:v<3,styles:v>=2?['stone','timber']:['timber','timber'],gtimber:true,gwin:true,shut:true,flow:true,chim:[[.15,.3],[.85,.3]],dormers:v%2?0:1,sign:true},P,v);const B=r.B;
  pTable(B,6,50,P);pTable(B,24,50,P);pBarrel(B,42,48);pBarrel(B,46.5,48);pBarrel(B,44,48,6);pLantern(B,r.lamps,2,60,13);
  if(v%2===0){B.push([54,2,8,8,8,8,'#8a5a30'],[54,10,8,8,8,8,'#7a5030'],[54,2,20,8,8,8,'#8a5a30']);pCrate(B,54,34)}
  return r}
function deZ(B,EPS=.05){const M=new Map();
  for(let i=0;i<B.length;i++){const q=B[i];
    for(let a=0;a<3;a++){const a1=(a+1)%3,a2=(a+2)%3,s0=a===0?3:a===1?4:5,s1=a1===0?3:a1===1?4:5,s2=a2===0?3:a2===1?4:5;
      for(let sd=0;sd<2;sd++){const c=sd?q[a]+q[s0]:q[a],key=a*2+sd+'|'+Math.round(c*20),L=M.get(key);
        if(L){const area=q[s1]*q[s2];
          for(const o of L){if(o[6]===q[6])continue;const c2=sd?o[a]+o[s0]:o[a];if(Math.abs(c2-c)>.03)continue;
            const ox=Math.min(q[a1]+q[s1],o[a1]+o[s1])-Math.max(q[a1],o[a1]),oz=Math.min(q[a2]+q[s2],o[a2]+o[s2])-Math.max(q[a2],o[a2]);if(ox<=.02||oz<=.02)continue;
            const oa=o[s1]*o[s2];const t=(oa<area-.01)?o:q;const tg='g'+a+sd;if(t[tg])continue;t[tg]=1;
            if(sd){t[s0]+=EPS}else{t[a]-=EPS;t[s0]+=EPS}}}
        (L||(M.set(key,[]),M.get(key))).push(q)}}}
  return B}var GENTYPE='';
/* materiały okien (jak w grze): zgaszone Lambert, zapalone Basic */
const winOff=new THREE.MeshLambertMaterial({color:0x2b2633}),winOn=new THREE.MeshBasicMaterial({color:0xffd27a});

/* --- model budynku: generator -> boxy -> deZ(cutHoles()) -> voxGeo (+ okna jako osobne geometrie) --- */
function mkModel(gen,type,v){
  const P=palFor(type,v);WG=0;const r=gen(P,v);
  const win=r.win||[],B=deZ(cutHoles(r.B,win.concat(r.holes||[])));
  const geo=voxGeo(B,.06);
  let wins=null;if(win.length){const key=(w,i)=>w[6]!=null?w[6]:100000+i;const ids=[...new Set(win.map(key))].sort((p,q)=>hash(p,v,77)-hash(q,v,77));const rk=new Map(ids.map((id,j)=>[id,j]));
    const gs=[[],[],[],[]];win.forEach((w,i)=>gs[rk.get(key(w,i))%4].push([w[0],w[1],w[2],w[3],w[4],w[5],'#ffffff']));wins=gs.filter(g=>g.length).map(g=>voxGeo(g,0))}
  return {geo,wins,W:geo.boundingBox.max.x-geo.boundingBox.min.x,D:geo.boundingBox.max.z-geo.boundingBox.min.z}}
/* --- drzewa z kitu (bez zmian) --- */
const OBJGEO={
  oak:voxGeo([[-2.5,0,-2.5,5,19,5,'#6b4528'],[-4,0,-1,8,2,2,'#5a3a22'],[-1,0,-4,2,2,8,'#5a3a22'],[1.5,12,-1,7,2,2,'#6b4528'],[-8,14,-1,7,2,2,'#6b4528'],
    [-14,16,-14,28,10,28,'#3a7030'],[-16.5,19,-10,33,7,20,'#3c7432'],[-10,19,-16.5,20,7,33,'#3f7834'],[-11,26,-11,22,8,22,'#4a8a3a'],[-7,33,-7,14,5,14,'#5ea045'],[-4,37,-4,8,2.5,8,'#6fb04e'],
    [5,27,4,6,2,6,'#86c75a'],[-9,24,-12,6,2,5,'#86c75a'],[-13,21,4,4,2,6,'#5ea045'],[8,17,-14,5,2,4,'#5ea045']]),
  pine:voxGeo([[-1.6,0,-1.6,3.2,10,3.2,'#5a3a22'],[-12,8,-12,24,7,24,'#1f4a2a'],[-10,15,-10,20,7,20,'#275a33'],[-8,22,-8,16,7,16,'#2f6a3a'],[-6,29,-6,12,6,12,'#3a7a44'],[-4,35,-4,8,6,8,'#438a4c'],[-2,41,-2,4,5,4,'#4f9a58'],[-1,46,-1,2,3,2,'#6bb070'],
    [-12.5,10,-4,1,3,8,'#2f6a3a'],[11.5,10,-3,1,3,7,'#275a33'],[-4,17,9.5,8,3,1,'#3a7a44']]),
  birch:voxGeo([[-1.5,0,-1.5,3,26,3,'#ece8e0'],[-1.6,4,-1.6,3.2,1,1.2,'#2a2a2a'],[-1.6,10,.4,3.2,1,1.2,'#2a2a2a'],[.4,16,-1.6,1.2,1,3.2,'#2a2a2a'],[-1.6,21,-1.6,1.2,1,3.2,'#2a2a2a'],
    [-9,16,-9,18,8,18,'#7ab04a'],[-11,19,-6,22,6,12,'#86bc56'],[-6,19,-11,12,6,22,'#80b650'],[-7,24,-7,14,8,14,'#92c860'],[-4,32,-4,8,5,8,'#a2d470']]),
  bush:voxGeo([[-6,0,-6,12,6,12,'#3c7432'],[-4,5,-4,8,4,8,'#549b41'],[-7,1,-3,14,4,6,'#2b5426']]),
  rock:voxGeo([[-7,0,-6,14,8,12,'#7a7782'],[-5,8,-4,9,4,8,'#8e8b96'],[-8,0,2,5,5,6,'#5d5a63'],[3,0,-8,5,3,4,'#6f6a73']],.1)
};
OBJGEO.oak_l=voxGeo([[-2.5,0,-2.5,5,16,5,'#6b4528'],[-12,13,-12,24,10,24,'#3f7a35'],[-8,22,-8,16,8,16,'#5ea04a']],0);
OBJGEO.pine_l=voxGeo([[-1.6,0,-1.6,3.2,10,3.2,'#5a3a22'],[-12,8,-12,24,12,24,'#1f4a2a'],[-8,19,-8,16,12,16,'#275a33'],[-4,30,-4,8,12,8,'#2f6a3a']],0);
OBJGEO.birch_l=voxGeo([[-1.5,0,-1.5,3,24,3,'#ece8e0'],[-8,20,-8,16,12,16,'#86bc56'],[-4,30,-4,8,6,8,'#a2d470']],0);

// =================== ROŚLINNOŚĆ v2: wyższe drzewa, korony bez nachodzenia ścian, korony do stania ===================
// TREETOP[typ] = [[cx,cz,półszerokość,wierzch]] w voxelach (1/16 bloku przed skalą TS) — po tych płaszczyznach można chodzić
const TREETOP={},TRUNK={};
function vegGeo(list,eps){return voxGeo(deZ(list,eps||.55),.06)}
function leafBlob(L,tops,cx,cy,cz,r,h,cA,cB,cT,cU){
  const q=r*.62;
  L.push([cx-r,cy,cz-r,2*r,h,2*r,cA]);
  L.push([cx-r-2.3,cy+1.4,cz-q,2*r+4.6,h-2.9,2*q,cB]);
  L.push([cx-q,cy+1.7,cz-r-2.3,2*q,h-3.3,2*r+4.6,cB]);
  L.push([cx-q-.4,cy+h,cz-q-.4,2*q+.8,2.4,2*q+.8,cT]);
  L.push([cx-r*.7,cy-1.7,cz-r*.7,1.4*r,1.7,1.4*r,cU]);
  tops.push([cx,cz,r,cy+h],[cx,cz,q+.4,cy+h+2.4]);
}
{
  const G1='#356a2c',G2='#3f7834',G3='#4a8a3a',G4='#62a447',GU='#2a5225';
  // dąb
  let L=[],T=[];
  L.push([-3.6,0,-3.6,7.2,47,7.2,'#6b4528'],[-6.4,0,-1.7,12.8,2.7,3.4,'#5a3a22'],[-1.7,0,-6.4,3.4,2.7,12.8,'#5a3a22'],[-5,0,-5,10,1.4,10,'#4d3220'],
    [-3.9,7,-1.1,.5,7,2.2,'#4a2f1d'],[3.4,15,.6,.5,6,2,'#4a2f1d'],[-1.2,21,3.4,2.4,6,.5,'#4a2f1d'],[1,30,-3.9,2,5,.5,'#4a2f1d'],
    [3.1,27,-1.3,10.5,2.6,2.6,'#6b4528'],[11,27.5,-1.4,2.8,8.5,2.8,'#62402a'],[-13.4,31,-1.2,10.2,2.4,2.4,'#6b4528'],[-1.3,23.5,3.1,2.6,2.6,9.6,'#62402a'],[-1.1,33,-12.6,2.2,2.2,9.4,'#6b4528']);
  leafBlob(L,T,0,37,0,17,13,G1,G2,G3,GU);
  leafBlob(L,T,13.3,33.4,4.2,9.2,9.3,G2,G3,G4,GU);
  leafBlob(L,T,-14.2,36.3,-5.3,10.1,9.1,G1,G2,G3,GU);
  leafBlob(L,T,3.4,32.6,-14.1,8.9,8.4,G2,G3,G4,GU);
  leafBlob(L,T,-4.3,34.8,13.2,9.3,8.2,G2,G3,G4,GU);
  leafBlob(L,T,1.1,51.6,-.9,12.2,9.6,G3,G3,G4,G2);
  leafBlob(L,T,-.8,62.4,1.3,7.1,6.8,G4,G4,'#7cbc58',G3);
  L.push([7.3,49.2,6.1,4.3,2.1,4.4,'#86c75a'],[-11.2,46.7,-9.6,5.2,2,4.6,'#86c75a'],[-15.3,45.8,4.4,4.1,2.1,5.3,'#62a447']);
  OBJGEO.oak=vegGeo(L);TREETOP.oak=T;TRUNK.oak=[0.45,47,72];
  // sosna
  L=[];T=[];L.push([-2.3,0,-2.3,4.6,26,4.6,'#5a3a22'],[-4.2,0,-1.3,8.4,2.2,2.6,'#4d3220'],[-1.3,0,-4.2,2.6,2.2,8.4,'#4d3220']);
  const PC=['#1f4a2a','#245230','#2a5c36','#30663c','#377244','#3e7e4c','#4a8c56','#5c9e64'];
  [[17.2,12],[15.1,19.6],[13,27.1],[11.1,34.7],[9.1,42.2],[7.2,49.8],[5.1,57.3],[3.1,64.9]].forEach(([r,y],k)=>{
    L.push([-r,y,-r,2*r,8.7,2*r,PC[k]]);const q=r*.55;L.push([-r-1.9,y+1.3,-q,2*r+3.8,3.1,2*q,PC[Math.min(7,k+1)]],[-q,y+1.5,-r-1.9,2*q,3.3,2*r+3.8,PC[Math.min(7,k+1)]]);
    L.push([-r+.6,y-1.2,-r+.6,2*r-1.2,1.2,2*r-1.2,'#183d22']);T.push([0,0,r,y+8.7])});
  L.push([-1.4,73.4,-1.4,2.8,4.5,2.8,'#6bb070']);T.push([0,0,1.4,77.9]);
  OBJGEO.pine=vegGeo(L);TREETOP.pine=T;TRUNK.pine=[0.36,30,78];
  // sosna w śniegu
  L=L.slice();const ST=T.slice();
  [[17.2,12],[15.1,19.6],[13,27.1],[11.1,34.7],[9.1,42.2],[7.2,49.8],[5.1,57.3],[3.1,64.9]].forEach(([r,y])=>{L.push([-r+.3,y+8.7,-r+.3,2*r-.6,1.3,2*r-.6,'#eef3f6~'])});
  L.push([-1.1,77.9,-1.1,2.2,1.6,2.2,'#f4f8fa~']);
  OBJGEO.snowpine=vegGeo(L);TREETOP.snowpine=ST.map(t=>[t[0],t[1],t[2],t[3]+1.3]);TRUNK.snowpine=TRUNK.pine;
  // brzoza
  L=[];T=[];L.push([-1.9,0,-1.9,3.8,52,3.8,'#ece8e0'],[-2.4,0,-2.4,4.8,1.6,4.8,'#c9c2b4']);
  for(let k=0;k<9;k++){const y=3+k*5.4,s=k%4;L.push(s===0?[-2.05,y,-.9,.3,1.3,1.8,'#2a2a2a']:s===1?[1.75,y,-1.2,.3,1.1,2.1,'#2a2a2a']:s===2?[-1,y,1.75,2,1.2,.3,'#2a2a2a']:[-.6,y,-2.05,1.7,1.1,.3,'#2a2a2a'])}
  L.push([1.6,30,-.9,8.5,1.8,1.8,'#e2ddd2'],[-9.6,36,-.8,8.1,1.6,1.6,'#e2ddd2']);
  const B1='#6fa844',B2='#7ab04a',B3='#86bc56',B4='#9ccc66';
  leafBlob(L,T,.4,33.2,-.3,11.4,10.3,B1,B2,B3,'#557f35');
  leafBlob(L,T,8.3,40.4,2.6,7.3,8.2,B2,B3,B4,B1);
  leafBlob(L,T,-7.6,43.3,-3.4,7.6,8.1,B2,B3,B4,B1);
  leafBlob(L,T,-.6,51.1,.7,7.2,8.6,B3,B3,B4,B2);
  leafBlob(L,T,.3,61.6,-.4,4.1,5.2,B4,B4,'#b2dc7a',B3);
  OBJGEO.birch=vegGeo(L);TREETOP.birch=T;TRUNK.birch=[0.3,52,69];
  // palma
  L=[];T=[];for(let k=0;k<7;k++){const x=k*1.25-2.4;L.push([x,k*8.1,-2.3+k*.12,4.6-k*.1,8.4,4.6-k*.1,k%2?'#8a6a44':'#7a5a3a'],[x-.25,k*8.1+7.6,-2.5+k*.12,5.1-k*.1,.9,5.1-k*.1,'#5e4630'])}
  const tx=6*1.25-.2,ty=58;L.push([tx-2.6,ty-.6,-2.6,5.2,3.4,5.2,'#5a3a22'],[tx+1.9,ty-2.6,-.9,2,2,2,'#6b4a26'],[tx-3.4,ty-2.2,.6,2,2,2,'#6b4a26'],[tx-.4,ty-2.9,1.9,2,2,2,'#6b4a26']);
  const FR=['#3f7834','#4a8a3a','#3c7432','#5ea045'];
  for(let a=0;a<8;a++){const an=a*Math.PI/4,dx=Math.round(Math.sin(an)),dz=Math.round(Math.cos(an)),c=FR[a%4],o=a*.17;
    const seg=(d0,len,y,h)=>{const x0=tx+dx*d0,z0=dz*d0;const w=dx?len:2.6+o,d=dz?len:2.6+o;L.push([dx>0?x0:dx<0?x0-len:x0-1.3-o/2,y,dz>0?z0:dz<0?z0-len:z0-1.3-o/2,w,h,d,c])};
    seg(2.3,9.5,ty+1.7+o,1.4);seg(11.3,7.2,ty-1.1+o,1.4);seg(18,4.6,ty-4.6+o,1.3)}
  T.push([tx,0,3.2,ty+2.8]);OBJGEO.palm=vegGeo(L);TREETOP.palm=T;TRUNK.palm=[0.3,58,61];
  // kaktus: żebrowany pień, ramiona, kolce, kwiat
  L=[];{const G1='#3f7034',G2='#4f8a3e',G3='#5e9a48',SP='#f0e8c8';
    const col=(x0,y0,z0,w,h,ribs)=>{L.push([x0,y0,z0,w,h,w,G2]);for(let k=0;k<ribs;k++){const t=(k+0.5)/ribs*w;L.push([x0+t-0.35,y0,z0-0.4,0.7,h,0.5,k%2?G3:G1],[x0+t-0.35,y0,z0+w-0.1,0.7,h,0.5,k%2?G1:G3],[x0-0.4,y0,z0+t-0.35,0.5,h,0.7,k%2?G3:G1],[x0+w-0.1,y0,z0+t-0.35,0.5,h,0.7,k%2?G1:G3])}
      for(let y=y0+2;y<y0+h-1;y+=3.2)for(let k=0;k<ribs;k++){const t=(k+0.5)/ribs*w,o=(Math.floor(y)+k)%2?1.2:0;L.push([x0+t-0.15,y+o,z0-0.75,0.3,0.3,0.4,SP],[x0+t-0.15,y+o+1.6,z0+w+0.35,0.3,0.3,0.4,SP],[x0-0.75,y+o+0.8,z0+t-0.15,0.4,0.3,0.3,SP],[x0+w+0.35,y+o+2.4,z0+t-0.15,0.4,0.3,0.3,SP])}};
    col(-3,0,-3,6,40,3);L.push([-2.4,40,-2.4,4.8,2.2,4.8,G3],[-1.6,42,-1.6,3.2,1,3.2,G2]);
    L.push([3,13,-1.8,6,3.6,3.6,G2],[3,12.6,-1.4,6,0.4,2.8,G1]);col(6.2,13,-1.8,3.6,15,2);L.push([6.6,28,-1.4,2.8,1.2,2.8,G3],[7,29.2,-1,2,1.4,2,'#f07a90'],[7.5,30.4,-.5,1,0.8,1,'#ffd34d']);
    L.push([-9.6,9,-1.8,6.6,3.6,3.6,G2]);col(-10.4,9,-1.8,3.6,12,2);L.push([-10,21,-1.4,2.8,1.2,2.8,G3]);
    L.push([-1.4,43,-1.4,2.8,1.6,2.8,'#f07a90'],[-0.8,44.4,-0.8,1.6,1,1.6,'#ffb0c0'],[-0.4,45.2,-0.4,0.8,0.6,0.8,'#ffd34d'])}
  OBJGEO.cactus=vegGeo(L);TREETOP.cactus=[[0,0,3.4,43.6]];TRUNK.cactus=[0.45,43,44];
  // krzak (z owocami)
  L=[];T=[];leafBlob(L,T,0,1.6,0,7.4,6.6,'#3c7432','#447e38','#549b41','#2b5426');leafBlob(L,T,5.1,.8,3.3,4.2,4.6,'#447e38','#4a8a3a','#5ea045','#2b5426');
  L.push([-7.9,5.2,1.1,1.2,1.2,1.2,'#d8323a'],[3.3,8.9,-4.1,1.2,1.2,1.2,'#d8323a'],[-2.3,8.6,6.6,1.2,1.2,1.2,'#e84a4a'],[7.6,4.4,-1.4,1.1,1.1,1.1,'#d8323a']);
  OBJGEO.bush=vegGeo(L);
  // skała
  L=[[-8.2,0,-7.1,16.4,9.3,14.2,'#7a7782'],[-6.1,9.3,-4.9,11.3,4.4,9.6,'#8e8b96'],[-3.4,13.7,-2.8,6.3,2.1,5.1,'#9a97a2'],[-9.6,0,1.9,5.6,5.6,6.9,'#5d5a63'],[3.7,0,-9.4,6.1,3.6,4.6,'#6f6a73'],
     [-6.4,9.3,-5.1,7.1,.9,6.4,'#5b8f3a'],[-3.2,15.8,-2.4,4.1,.7,3.7,'#6aa048'],[5.9,0,3.8,3.6,2.4,3.3,'#7a7782']];
  OBJGEO.rock=vegGeo(L);TREETOP.rock=[[0,0,7,9.3],[-.4,0,5.4,13.7],[0,0,3,15.8]];TRUNK.rock=[0.75,9,16];
  // głaz omszały
  L=[[-11.3,0,-10.2,22.6,15.4,20.4,'#6f6c76'],[-9.1,15.4,-8.2,17.4,6.6,15.6,'#7d7a85'],[-5.4,22,-4.6,10.6,3.4,8.8,'#8b8893'],[-13.1,0,-4.4,4.3,9.6,10.2,'#5d5a63'],
     [-8.6,15.4,-7.7,13.6,1.2,10.8,'#4f8434'],[-4.9,25.4,-4.1,7.5,1,6.3,'#5f9a40'],[8.7,0,4.1,6.2,4.4,6.6,'#6f6c76'],[-2.2,0,10.1,7.4,6.1,3.4,'#66636d']];
  OBJGEO.boulder=vegGeo(L);TREETOP.boulder=[[0,0,10,15.4],[0,0,8,22],[0,0,4.6,25.4]];TRUNK.boulder=[1.3,15,26];
  // kwiat (kolor z instancji), tulipany, trawa, grzyb, paproć/trzcina
  OBJGEO.flower=voxGeo([[-.45,0,-.45,.9,6,.9,'#3c7432'],[-2.3,6,-.8,4.6,1.4,1.6,'#ffffff'],[-.8,6,-2.3,1.6,1.4,4.6,'#ffffff'],[-1.4,5.6,-1.4,2.8,2.2,2.8,'#f4f0ea'],[-.7,7.8,-.7,1.4,.9,1.4,'#f0d060'],[.4,2,-.6,2.8,.7,1.2,'#4a8a3a'],[-3,3.4,-.5,2.6,.7,1,'#4a8a3a']],0);
  OBJGEO.tulip=voxGeo([[-3.4,0,-1.2,.7,5.5,.7,'#3c7432'],[-4,5.5,-1.8,1.9,2.6,1.9,'#e8484b'],[1.6,0,1.4,.7,6.6,.7,'#3c7432'],[1,6.6,.8,1.9,2.6,1.9,'#f2c534'],
     [.2,0,-3.3,.7,4.8,.7,'#3c7432'],[-.4,4.8,-3.9,1.9,2.4,1.9,'#d96bd0'],[-2.6,0,2.4,.7,5,.7,'#3c7432'],[-3.2,5,1.8,1.9,2.4,1.9,'#ffffff'],[-1.6,0,-.6,4.4,1.2,2.4,'#4a8a3a']],0);
  OBJGEO.grass=voxGeo([[-3.1,0,-.3,.6,4.4,.6,'#5a9a3c'],[-1.6,0,1.4,.6,6.2,.6,'#4f8e36'],[.4,0,-1.8,.6,5.3,.6,'#66a646'],[2.2,0,.9,.6,3.8,.6,'#5a9a3c'],[-.4,0,.2,.6,7.1,.6,'#72b04e'],[1.3,0,2.6,.6,4.9,.6,'#4f8e36'],[-2.4,0,-2.3,.6,3.6,.6,'#66a646']],0);
  OBJGEO.mushroom=voxGeo([[-.9,0,-.9,1.8,3.6,1.8,'#efe8da'],[-2.8,3.6,-2.8,5.6,1.6,5.6,'#d23a2e'],[-1.9,5.2,-1.9,3.8,1,3.8,'#c0302a'],[-1.6,6.2,-.5,.8,.25,.8,'#ffffff'],[.6,5.5,1.1,.7,.25,.7,'#ffffff'],[2.2,4.5,-.9,.25,.6,.7,'#ffffff'],
     [3.2,0,1.8,1.1,2.2,1.1,'#efe8da'],[2.1,2.2,.7,3.3,1,3.3,'#b8862e']],0);
  OBJGEO.fern=voxGeo([[-.5,0,-.5,1,3,1,'#3c7432'],[.5,2.4,-.7,6.4,.8,1.4,'#4a8a3a'],[-6.9,2.6,-.7,6.4,.8,1.4,'#447e38'],[-.7,2.8,.5,1.4,.8,6.4,'#3f7834'],[-.7,2.2,-6.9,1.4,.8,6.4,'#4a8a3a'],
     [4.8,1.6,-.6,3.1,.8,1.2,'#549b41'],[-8.1,1.8,-.6,3.1,.8,1.2,'#549b41'],[-.6,2,5,1.2,.8,3.1,'#549b41'],[-.6,1.4,-8.2,1.2,.8,3.1,'#549b41'],[-.4,3,-.4,.8,5.4,.8,'#6a8a3a'],[-.6,8.4,-.6,1.2,2,1.2,'#7a5a3a']],0);
  // nowe biomy: akacja, drzewo dżungli, klon, wiśnia, wrzos, sucha trawa
  L=[];T=[];L.push([-2.1,0,-2.1,4.2,22,4.2,'#6b4a2e'],[-1.2,20,-1.6,3.4,10,3.4,'#6b4a2e'],[0.8,28,-1.4,3,6,3,'#62422a'],[-5.4,26,-1.2,4.6,2.6,2.6,'#62422a'],[2.6,32,-1.3,8,2.4,2.6,'#62422a'],[-9,29,-1.2,4,4,2.4,'#62422a']);
  leafBlob(L,T,1.2,36.5,0.4,20.5,4.6,'#6b8a35','#7a9a3e','#8aaa48','#566f2a');leafBlob(L,T,12.4,34.2,7.1,9.6,3.9,'#7a9a3e','#86a644','#94b452','#566f2a');leafBlob(L,T,-12.6,33.3,-6.4,10.4,3.8,'#6b8a35','#7a9a3e','#8aaa48','#566f2a');
  OBJGEO.acacia=vegGeo(L);TREETOP.acacia=T;TRUNK.acacia=[0.3,34,46];
  L=[];T=[];L.push([-4,0,-4,8,84,8,'#5e4a32'],[-8.5,0,-1.8,17,9,3.6,'#54402a'],[-1.8,0,-8.5,3.6,9,17,'#54402a'],[-4.3,10,-1,.5,30,2,'#3a6a2a'],[3.8,18,1,.5,26,2,'#3a6a2a'],[-1,30,3.8,2,24,.5,'#3a6a2a']);
  const JG=['#1e5420','#245e26','#2c6a2c','#3a7a34'];
  leafBlob(L,T,0,70,0,19,11,JG[0],JG[1],JG[2],'#16401a');leafBlob(L,T,14.5,63,5,10.5,8.5,JG[1],JG[2],JG[3],'#16401a');leafBlob(L,T,-15,65,-6,11,8.4,JG[0],JG[1],JG[2],'#16401a');leafBlob(L,T,1,84,-1,12.5,9.5,JG[1],JG[2],JG[3],JG[0]);leafBlob(L,T,-1,96,1,6.5,6,JG[2],JG[3],'#4a8a3e',JG[1]);
  for(const [x,z,h] of [[16,8,18],[-14,-10,20],[6,-17,16],[-9,15,22],[19,-4,14]])L.push([x,64-h,z,1,h,1,'#2f6a2a']);
  OBJGEO.jtree=vegGeo(L);TREETOP.jtree=T;TRUNK.jtree=[0.6,84,104];
  const autumn=(name,C1,C2,C3,C4,CU,trunk)=>{const L=[],T=[];L.push([-3.4,0,-3.4,6.8,44,6.8,trunk],[-6,0,-1.6,12,2.6,3.2,darker(trunk,0.85)],[-1.6,0,-6,3.2,2.6,12,darker(trunk,0.85)],[3,26,-1.2,10,2.4,2.4,trunk],[-12.6,30,-1.1,9.6,2.2,2.2,trunk]);
    leafBlob(L,T,0,35,0,16,12.4,C1,C2,C3,CU);leafBlob(L,T,12.6,31.5,4,8.8,8.8,C2,C3,C4,CU);leafBlob(L,T,-13.4,34.3,-5,9.6,8.6,C1,C2,C3,CU);leafBlob(L,T,3.2,30.6,-13.3,8.4,8,C2,C3,C4,CU);leafBlob(L,T,1,48.6,-0.8,11.6,9.2,C2,C3,C4,C1);leafBlob(L,T,-0.7,59,1.2,6.8,6.4,C3,C4,C4,C2);
    OBJGEO[name]=vegGeo(L);TREETOP[name]=T;TRUNK[name]=[0.42,44,68]};
  autumn('maple','#c24e1c','#d4621f','#e0832c','#f0a83a','#8e3a16','#5a3a24');
  autumn('sakura','#e892b0','#f0a8c0','#f6bccd','#ffd4e2','#c87896','#4a3028');
  OBJGEO.heather=voxGeo([[-6,0,-5,12,2.6,10,'#4a6a32'],[-5,2.4,-4,4,2.6,3.6,'#8a4a8a'],[1,2.4,-3.2,4.4,3.2,3.4,'#a05aa0'],[-3.2,2.4,1.4,3.8,2.8,3.6,'#7a3e7a'],[2.4,2.4,2,3,2.2,3,'#b46ab4'],[-1,4.6,-1,2.4,1.6,2.4,'#c27ac2']],0);
  OBJGEO.drygrass=voxGeo([[-3.1,0,-.3,.6,5.4,.6,'#c9b45a'],[-1.6,0,1.4,.6,7.2,.6,'#b8a048'],[.4,0,-1.8,.6,6.3,.6,'#d8c46a'],[2.2,0,.9,.6,4.8,.6,'#c9b45a'],[-.4,0,.2,.6,8.1,.6,'#e0cc78'],[1.3,0,2.6,.6,5.9,.6,'#b8a048'],[-2.4,0,-2.3,.6,4.6,.6,'#d8c46a']],0);
  OBJGEO.maple_l=voxGeo([[-3.4,0,-3.4,6.8,38,6.8,'#5a3a24'],[-18,33,-18,36,16,36,'#d0601f'],[-11,49,-11,22,11,22,'#e0832c'],[-6,60,-6,12,6,12,'#f0a83a']],0);
  OBJGEO.sakura_l=voxGeo([[-3.4,0,-3.4,6.8,38,6.8,'#4a3028'],[-18,33,-18,36,16,36,'#f0a8c0'],[-11,49,-11,22,11,22,'#f6bccd'],[-6,60,-6,12,6,12,'#ffd4e2']],0);
  // uprawy, płot, wysoka trawa
  {const L=[];for(const [x,z,h] of [[-3,-3,7],[0,-2.5,8],[3,-3.2,6.5],[-2.5,0.5,7.5],[1,0.6,8.2],[3.4,1,7],[-3.2,3.4,6.8],[0.4,3.6,7.6],[3,3.8,7.2]]){L.push([x-0.3,0,z-0.3,0.6,h,0.6,'#b89a3a'],[x-0.55,h,z-0.55,1.1,2.4,1.1,'#e0b84a'],[x+0.3,h-2,z-0.25,1.4,0.4,0.5,'#c9a84a'])}OBJGEO.wheat=voxGeo(L,0)}
  OBJGEO.cabbage=voxGeo([[-2.8,0,-2.8,5.6,3.4,5.6,'#5f9a40'],[-1.9,3.2,-1.9,3.8,1.6,3.8,'#a8d070'],[-3.6,0.4,-1.4,0.8,2.6,2.8,'#4f8a36'],[2.8,0.4,-1.4,0.8,2.6,2.8,'#4f8a36'],[-1.4,0.4,-3.6,2.8,2.6,0.8,'#4f8a36'],[-1.4,0.4,2.8,2.8,2.6,0.8,'#4f8a36']],0);
  OBJGEO.corn=voxGeo([[-0.5,0,-0.5,1,15,1,'#6a9a3a'],[0.5,5,-0.4,4,0.6,0.8,'#5f9a40'],[-4.5,8,-0.4,4,0.6,0.8,'#5f9a40'],[-0.4,10.5,0.5,0.8,0.6,3.6,'#6aa848'],[0.5,8,-0.6,1.2,3.2,1.2,'#e8c84a'],[-0.8,15,-0.8,1.6,1.6,1.6,'#c9a84a'],[-3,0,-3,1,11,1,'#6a9a3a'],[-3.4,11,-3.4,1.8,1.4,1.8,'#c9a84a'],[2.2,0,2,1,12,1,'#6a9a3a'],[1.8,12,1.6,1.8,1.4,1.8,'#c9a84a']],0);
  OBJGEO.fence=voxGeo([[-8.6,0,-0.65,1.3,8.4,1.3,'#6b4a2b'],[-8.8,8.4,-0.85,1.7,0.6,1.7,'#5a3a22'],[-7.3,5,-0.35,15.3,1,0.7,'#8a6240'],[-7.3,2.2,-0.3,15.3,1,0.6,'#7a5532']],0);
  OBJGEO.tallgrass=voxGeo([[-2.8,0,-.3,.6,9,.6,'#4f8e36'],[-1.2,0,1.4,.6,11.5,.6,'#5a9a3c'],[.6,0,-1.6,.6,8.4,.6,'#66a646'],[2.2,0,.8,.6,10.2,.6,'#4f8e36'],[-.3,0,.1,.6,12.6,.6,'#72b04e'],[1,0,2.6,.6,7.6,.6,'#5a9a3c'],[-2.1,0,-2.4,.6,8.8,.6,'#66a646'],[-.6,12.6,-.1,1,1.2,1,'#c9b45a']],0);
  // dalekie LOD
  OBJGEO.oak_l=voxGeo([[-3.6,0,-3.6,7.2,40,7.2,'#6b4528'],[-19,35,-19,38,16,38,'#3f7a35'],[-12,51,-12,24,11,24,'#4f8f3e'],[-6.5,62,-6.5,13,7,13,'#62a447']],0);
  OBJGEO.pine_l=voxGeo([[-2.3,0,-2.3,4.6,14,4.6,'#5a3a22'],[-17,12,-17,34,16,34,'#245230'],[-12,28,-12,24,16,24,'#30663c'],[-7,44,-7,14,16,14,'#3e7e4c'],[-3,60,-3,6,14,6,'#4a8c56']],0);
  OBJGEO.birch_l=voxGeo([[-1.9,0,-1.9,3.8,34,3.8,'#ece8e0'],[-12,32,-12,24,13,24,'#7ab04a'],[-8,45,-8,16,13,16,'#86bc56'],[-4,58,-4,8,8,8,'#9ccc66']],0);
}
// ---------- renderer / scena (ustawienia z kitu Pintara) ----------
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance',logarithmicDepthBuffer:true});
try{const gl=renderer.getContext(),sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera();const gg=new THREE.BoxGeometry(1,1,1);gg.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(gg.attributes.position.count*3).fill(1),3));
 for(const k in CRT){const mm=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(mm,false);crTex(mm,k);sc.add(new THREE.Mesh(gg,mm))}renderer.compile(sc,cam);
 for(const p of (renderer.info.programs||[])){const mk=/crt(\d+)/.exec(p.cacheKey||'');if(mk&&p.program&&!gl.getProgramParameter(p.program,gl.LINK_STATUS)){CRT_BAD[mk[1]]=1;console.warn('crTex off',mk[1])}}}catch(e){console.warn('crt test',e)}
renderer.setPixelRatio(Math.min(devicePixelRatio||1,OPT.pr));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=S.shadows;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
$('view').appendChild(renderer.domElement);renderer.domElement.style.filter='saturate(1.1) contrast(1.06)';{const vg=document.createElement('div');vg.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at center,transparent 58%,rgba(10,6,20,.34) 100%)';$('view').appendChild(vg)}
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x9cc7e6);scene.fog=new THREE.Fog(0x9cc7e6,150,520);
const camera=new THREE.PerspectiveCamera(S.fov,innerWidth/innerHeight,0.25,4000);
const hemi=new THREE.HemisphereLight(0xcfe6ff,0x5a5030,.55);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff1d6,.95);sun.castShadow=true;sun.shadow.mapSize.set(OPT.shadowSize,OPT.shadowSize);
sun.shadow.bias=-.0005;sun.shadow.normalBias=.03;
const sc=sun.shadow.camera;sc.left=-50;sc.right=50;sc.top=50;sc.bottom=-50;sc.near=1;sc.far=300;
scene.add(sun,sun.target);
const WATER_U={uT:{value:0},uSky:{value:new THREE.Color(0x9cc7e6)}};
const water=new THREE.Mesh(new THREE.PlaneGeometry(1,1,160,160),new THREE.MeshLambertMaterial({color:0x3f7db5,transparent:true,opacity:.74}));
// woda jak w Pintarze: kolor od głębokości (turkus przy brzegu, granat w głębi), przezroczystość od głębokości, piana przy brzegu, błyski słońca, zmarszczki
const WDN=256,WDEP=new THREE.DataTexture(new Uint8Array(WDN*WDN*4),WDN,WDN,THREE.RGBAFormat);WDEP.magFilter=WDEP.minFilter=THREE.LinearFilter;WDEP.generateMipmaps=false;WDEP.wrapS=WDEP.wrapT=THREE.ClampToEdgeWrapping;
Object.assign(WATER_U,{uDep:{value:WDEP},uDC:{value:new THREE.Vector2(0,0)},uDS:{value:512},uRain:{value:0},uStorm:{value:0},uNight:{value:0},uIce:{value:0}});
water.material.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{uT:WATER_U.uT,uSky:WATER_U.uSky,uDep:WATER_U.uDep,uDC:WATER_U.uDC,uDS:WATER_U.uDS,uSunW:SEAS_U.uSunW,uRain:WATER_U.uRain,uStorm:WATER_U.uStorm,uNight:WATER_U.uNight,uIce:WATER_U.uIce});
  sh.vertexShader='uniform float uT;uniform float uStorm;uniform float uIce;varying vec3 vWw;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvec4 wq=modelMatrix*vec4(transformed,1.0);transformed.z+=(sin(wq.x*0.21+uT*1.3)*0.03+sin(wq.z*0.17-uT*1.1)*0.025+uStorm*(sin(wq.x*0.09+uT*1.6)*0.16+sin(wq.z*0.07+wq.x*0.03-uT*1.2)*0.12))*(1.-uIce*0.9);vWw=wq.xyz;');
  sh.fragmentShader='uniform float uT;uniform vec3 uSky;uniform sampler2D uDep;uniform vec2 uDC;uniform float uDS;uniform vec3 uSunW;uniform float uRain;uniform float uStorm;uniform float uNight;uniform float uIce;varying vec3 vWw;float h21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}\n'+sh.fragmentShader
   .replace('#include <color_fragment>','#include <color_fragment>\nvec2 wuv=(vWw.xz-uDC)/uDS+.5;float dd=(wuv.x<0.||wuv.y<0.||wuv.x>1.||wuv.y>1.)?1.:texture2D(uDep,wuv).r;\nvec3 wc=mix(vec3(.46,.76,.7),vec3(.1,.34,.5),smoothstep(0.,1.,dd));float r1=sin(vWw.x*0.9+uT*1.7)*sin(vWw.z*0.8-uT*1.3)+0.5*sin(vWw.x*2.3-vWw.z*1.9+uT*2.6);wc*=0.94+0.06*r1;\nvec3 vdw=normalize(cameraPosition-vWw);float frw=pow(1.0-clamp(vdw.y,0.0,1.0),3.0);wc=mix(wc,uSky*0.92,frw*0.45);\nfloat shore=1.-smoothstep(0.,.09,dd);float fw=sin(dd*95.-uT*2.1+h21(floor(vWw.xz*1.5))*5.)*.5+.5;float lace=step(.35,h21(floor(vWw.xz*4.+vec2(uT*.6,0.))));float foam=shore*smoothstep(.55,.92,fw)*(.55+.45*lace)+(1.-smoothstep(0.,.025,dd))*.75;\nwc=mix(wc,vec3(.95,.98,1.),clamp(foam,0.,1.)*.85);\nif(uRain>0.){vec2 rc=floor(vWw.xz*1.2);vec2 rf=fract(vWw.xz*1.2)-.5;float ph=fract(uT*1.4+h21(rc)*7.);float rr=length(rf+vec2(h21(rc+3.)-.5,h21(rc+7.)-.5)*.5);float ring=smoothstep(.05,0.,abs(rr-ph*.45))*(1.-ph)*step(h21(rc+floor(uT*1.4+h21(rc)*7.)),.55);wc+=vec3(.5,.55,.6)*ring*uRain;}\nif(uStorm>0.){float cap=smoothstep(.75,1.,sin(vWw.x*.09+uT*1.6)*.5+sin(vWw.z*.07+vWw.x*.03-uT*1.2)*.5+.3);wc=mix(wc*0.8,vec3(.92,.95,.97),cap*uStorm*.6);}\nfloat icef=uIce*(1.-smoothstep(.35,.55,dd));if(icef>0.){vec2 ic=floor(vWw.xz*.35);float cr=smoothstep(.04,0.,min(abs(fract(vWw.x*.35+h21(ic)*.3)-.5),abs(fract(vWw.z*.35+h21(ic+2.)*.3)-.5)));vec3 icec=mix(vec3(.82,.9,.96),vec3(.68,.8,.9),h21(ic))-cr*.18;wc=mix(wc,icec,icef);}\ndiffuseColor.rgb=wc;diffuseColor.a=max(mix(.42,.9,smoothstep(0.,.8,dd)),foam*.9);diffuseColor.a=mix(diffuseColor.a,.95,frw*.6);diffuseColor.a=mix(diffuseColor.a,.96,icef);')
   .replace('#include <dithering_fragment>','#include <dithering_fragment>\n{vec3 V=normalize(cameraPosition-vWw);vec2 cell=floor(vWw.xz*3.);float tw=floor(uT*1.3+h21(cell)*7.);float r=h21(cell+tw*1.37);vec3 Rr=reflect(-V,vec3(0.,1.,0.));vec3 sd=normalize(uSunW);float al=max(dot(Rr,sd),0.);float gl=clamp(sd.y*3.,0.,1.);float sp=step(.955,r)*pow(al,10.)*.75;float band=pow(al,22.)*.14;gl_FragColor.rgb+=vec3(1.,.93,.75)*(sp+band)*gl*(1.-uIce*.7);gl_FragColor.a=min(1.,gl_FragColor.a+(sp+band)*gl*.4);if(uNight>0.&&uIce<.5){vec2 pc=floor(vWw.xz*4.);float pf=h21(pc+floor(uT*.7+h21(pc)*5.));float pl=step(.975,pf)*(.5+.5*sin(uT*3.+h21(pc)*20.));gl_FragColor.rgb+=vec3(.15,.85,.75)*pl*uNight*.9;}}')};
water.material.customProgramCacheKey=()=>'waterP3';
function rippleTex(seed,sz){sz=sz||128;const c=document.createElement('canvas');c.width=c.height=sz;const g=c.getContext('2d');g.lineCap='round';const hh=(i,k)=>{const x=Math.sin(i*127.1+seed*311.7+k*74.7)*43758.5453;return x-Math.floor(x)};
  for(let i=0;i<54;i++){const x=hh(i,1)*sz,y=hh(i,2)*sz,L=5+hh(i,3)*12,a=.2+hh(i,4)*.45;g.strokeStyle=`rgba(236,249,255,${a})`;g.lineWidth=1.4;for(const ox of [-sz,0,sz])for(const oy of [-sz,0,sz]){g.beginPath();g.moveTo(x+ox-L/2,y+oy);g.quadraticCurveTo(x+ox,y+oy-2.6,x+ox+L/2,y+oy);g.stroke()}}
  for(let i=0;i<26;i++){g.fillStyle=`rgba(255,255,255,${.35+hh(i,6)*.5})`;g.fillRect(hh(i,7)*sz|0,hh(i,8)*sz|0,2,2)}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.magFilter=THREE.NearestFilter;t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;return t}
const WRIP=[[rippleTex(1),6,0.42,0.02,[.011,.006]],[rippleTex(2),9.5,0.32,0.04,[-.007,.012]]].map(([tx,rep,op,dy,sp])=>{const ms=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshLambertMaterial({map:tx,transparent:true,opacity:op,depthWrite:false}));ms.rotation.x=-Math.PI/2;ms.renderOrder=3;scene.add(ms);return{ms,tx,rep,op,dy,sp}});
let wdepC=null,wdepT=0;
function waterDepthTick(cx,cz,ws){const now=performance.now();if(wdepC&&Math.hypot(cx-wdepC[0],cz-wdepC[1])<ws*0.12&&now-wdepT<4000)return;wdepT=now;wdepC=[cx,cz];const a=WDEP.image.data,st=ws/WDN,x0=cx-ws/2,z0=cz-ws/2;
  let lcx=1e9,lcz=1e9,lch=null;const hAt=(x,z)=>{const cx=Math.floor(x/C),cz=Math.floor(z/C);if(cx!==lcx||cz!==lcz){lcx=cx;lcz=cz;let ch=chunks.get(K(cx,cz));if(!ch||!ch.heights)ch=hcache.get(K(cx,cz));lch=ch&&ch.heights?ch.heights:null}if(!lch)return null;return lch[(Math.floor(z)-cz*C)*C+Math.floor(x)-cx*C]};
  for(let j=0;j<WDN;j++)for(let i=0;i<WDN;i++){const h=hAt(x0+(i+0.5)*st,z0+(j+0.5)*st);const d=h==null?1:h>=WATER?0:Math.min(1,(WATER-h)/8);const o=(j*WDN+i)*4;a[o]=a[o+1]=a[o+2]=Math.round(d*255);a[o+3]=255}
  WDEP.needsUpdate=true;WATER_U.uDC.value.set(cx,cz);WATER_U.uDS.value=ws}
water.rotation.x=-Math.PI/2; water.renderOrder=2; scene.add(water);
const terrainMat=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});seasonPatch(terrainMat,true);
// woda rzek powyżej poziomu morza i wodospady (uv.x: 0 = tafla, 1 = wodospad; uv.y: głębokość 0..1 albo wysokość)
const RIVMAT=new THREE.MeshLambertMaterial({color:0x4f93c4,transparent:true,opacity:.8,side:THREE.DoubleSide,depthWrite:false});
RIVMAT.onBeforeCompile=sh=>{Object.assign(sh.uniforms,{uT:WATER_U.uT,uSky:WATER_U.uSky});
  sh.vertexShader='attribute vec2 aW;varying vec2 vW;varying vec3 vWw;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvW=aW;vWw=(modelMatrix*vec4(transformed,1.0)).xyz;');
  sh.fragmentShader='uniform float uT;uniform vec3 uSky;varying vec2 vW;varying vec3 vWw;float h21(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}\n'+sh.fragmentShader
   .replace('#include <color_fragment>','#include <color_fragment>\nif(vW.x<.5){float dd=clamp(vW.y,0.,1.);vec3 wc=mix(vec3(.5,.8,.76),vec3(.16,.42,.6),smoothstep(0.,1.,dd));float r1=sin(vWw.x*1.1+uT*2.3)*sin(vWw.z*1.0-uT*1.9)+.5*sin(vWw.x*2.6-vWw.z*2.1+uT*3.2);wc*=.94+.07*r1;vec3 vdw=normalize(cameraPosition-vWw);float frw=pow(1.-clamp(vdw.y,0.,1.),3.);wc=mix(wc,uSky*.92,frw*.4);float lace=step(.4,h21(floor(vWw.xz*4.+vec2(uT*.9,uT*.4))));float foam=(1.-smoothstep(0.,.22,dd))*(.5+.5*lace);float st=step(.93,h21(floor(vWw.xz*vec2(2.,5.)+vec2(uT*1.6,0.))));wc=mix(wc,vec3(.95,.98,1.),clamp(foam*.8+st*.25,0.,1.));diffuseColor.rgb=wc;diffuseColor.a=max(mix(.5,.9,smoothstep(0.,.8,dd)),foam*.9);}\nelse{float col=floor((vWw.x+vWw.z)*3.);float s1=h21(vec2(col,3.));float v=fract(vWw.y*.3+uT*(1.1+s1*.9)+s1*9.);float streak=smoothstep(.5,.1,abs(v-.5))*(.45+.55*h21(vec2(col,floor(vWw.y*.3+uT*(1.1+s1*.9)+s1*9.))));vec3 wc=mix(vec3(.42,.72,.86),vec3(.96,.99,1.),clamp(streak+.25*step(.6,s1),0.,1.));diffuseColor.rgb=wc;diffuseColor.a=.9;}')};
RIVMAT.customProgramCacheKey=()=>'riverP1';
const FALLS=[];

const UWC=new THREE.Color(0x24607f);

// ---------- geometria wokselowa ----------
function boxes(list){return voxGeo(deZ(vb(list.map(b=>typeof b[6]==='string'&&b[6][0]==='!'?[b[0],b[1],b[2],b[3],b[4],b[5],b[6].slice(1)].concat(b.slice(7)):b))),.06)}
const GLOWMAT=new THREE.MeshBasicMaterial({vertexColors:true});   // wszystkie modele gry idą przez voxGeo z kitu
// =================== GRAFIKA PINTARA: dopasowanie do gry ===================
// Skala: 1 jednostka świata gry = 1 blok terenu. Modele z kitu są w voxelach (V=1/16),
// budynki skalujemy ×BS, drzewa ×TS, żeby pasowały do postaci (~1,8 j. ≈ 29 voxeli).
const BS=2.2, TS=2.0;
// moje modele (środek boxa w jednostkach świata) -> boxy kitu (narożnik w voxelach) -> voxGeo
const vb=list=>list.map(([x,y,z,w,h,d,c])=>[(x-w/2)*16,(y-h/2)*16,(z-d/2)*16,w*16,h*16,d*16,c]);
function freeCPU(g){for(const k in g.attributes)g.attributes[k].onUploadCallback=function(){this.array=null};if(g.index)g.index.onUploadCallback=function(){this.array=null};return g}

// (palma, kaktus, kwiat, sosna śnieżna: patrz ROŚLINNOŚĆ v2)
const TK=['oak','pine','birch','palm','cactus','bush','rock','flower','snowpine','grass','tulip','mushroom','boulder','fern','acacia','jtree','maple','sakura','heather','drygrass','wheat','cabbage','corn','fence','tallgrass'];
const SMALLT=new Set([7,9,10,11,13,18,19,20,21,22,23,24]);
const SCL={};for(const k of TK)SCL[k]=TS;
const DECO=TK.map(k=>[null,TRUNK[k]?TRUNK[k][0]:0]); // [_, promień pnia]
const MAXD={grass:85,tallgrass:85,drygrass:80,fern:90,mushroom:70,tulip:110,flower:120,heather:140,bush:200,wheat:150,corn:150,cabbage:120,fence:190};
const FLOWC=[0xe8484b,0xf2c534,0x7a8ae0,0xffffff,0xd96bd0,0xf08aa0];
const ICAP=30000,IMS={};
const imMat=k=>/^(oak|birch|palm|bush|grass|fern|tulip|acacia|jtree|maple|sakura|heather|drygrass|wheat|cabbage|corn|tallgrass)/.test(k)?matVD:/^(pine|snowpine)/.test(k)?matVK:matV;
for(const k of [...TK,'oak_l','pine_l','birch_l','maple_l','sakura_l']){const m=new THREE.InstancedMesh(OBJGEO[k],imMat(k),ICAP);m.count=0;m.frustumCulled=false;
  m.castShadow=!k.endsWith('_l')&&!/flower|grass|tulip|fern|mushroom|heather|wheat|cabbage|corn/.test(k);m.receiveShadow=true;if(k==='flower')m.setColorAt(0,new THREE.Color(1,1,1));scene.add(m);IMS[k]=m}
const _fr=new THREE.Frustum(),_pm=new THREE.Matrix4(),_sph=new THREE.Sphere(),_dm=new THREE.Object3D(),_cc=new THREE.Color();
let instDirty=true,instTotal=0;const lastCam={x:1e9,y:0,z:0,yaw:0,pitch:0};
// instancje przebudowujemy tylko po ruchu kamery albo zmianie zestawu chunków (zasada 4)
const TREEMAX=520;
function rebuildInst(){
  const cnt={};for(const k in IMS)cnt[k]=0;
  camera.updateMatrixWorld();_pm.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);_fr.setFromProjectionMatrix(_pm);
  const px=player.p.x,pz=player.p.z,RF=S.rd*C+20,RF2=RF*RF,Dm2=OPT.lodD*OPT.lodD;
  for(const ch of chunks.values()){if(!ch.decos||!ch.mesh)continue;const cx=ch.cx*C+16,cz=ch.cz*C+16;const cdist=Math.hypot(cx-px,cz-pz);if(cdist>Math.min(RF,TREEMAX)+24)continue;
    _sph.center.set(cx,WATER+18,cz);_sph.radius=70;if(!_fr.intersectsSphere(_sph))continue;
    for(const D of (cdist<200&&ch.decoS?[ch.decos,ch.decoS]:[ch.decos]))for(let i=0;i<D.length;i+=6){const t=D[i],k0=TK[t],dx=D[i+1]-px,dz=D[i+3]-pz,d2=dx*dx+dz*dz;if(d2>RF2)continue;const md=MAXD[k0];if(md&&d2>md*md)continue;if(d2>TREEMAX*TREEMAX)continue;
      const k=(OPT.lod&&IMS[k0+'_l']&&d2>Dm2)?k0+'_l':k0,n=cnt[k];if(n>=ICAP)continue;cnt[k]++;
      _dm.position.set(D[i+1],D[i+2],D[i+3]);_dm.rotation.set(0,Math.floor(D[i+5]/(Math.PI/2))*Math.PI/2,0);_dm.scale.setScalar(D[i+4]*SCL[k0]);_dm.updateMatrix();IMS[k].setMatrixAt(n,_dm.matrix);
      if(t===7)IMS[k].setColorAt(n,_cc.setHex(FLOWC[Math.floor(D[i+5]*10)%FLOWC.length]))}}
  instTotal=0;for(const k in IMS){IMS[k].count=cnt[k];instTotal+=cnt[k];IMS[k].instanceMatrix.needsUpdate=true;if(IMS[k].instanceColor)IMS[k].instanceColor.needsUpdate=true}
  instDirty=false;
}
let camMoved=false,shF=0;
function instFrame(){
  const c=camera.position;camMoved=Math.abs(c.x-lastCam.x)>2||Math.abs(c.y-lastCam.y)>2||Math.abs(c.z-lastCam.z)>2||Math.abs(yaw-lastCam.yaw)>0.04||Math.abs(pitch-lastCam.pitch)>0.04;
  if(camMoved||instDirty){lastCam.x=c.x;lastCam.y=c.y;lastCam.z=c.z;lastCam.yaw=yaw;lastCam.pitch=pitch;rebuildInst()}
  shF++;renderer.shadowMap.needsUpdate=S.shadows&&(camMoved||P2.atkT>0?shF%2===0:shF%4===0);   // cienie co 2 klatki w ruchu, co 4 w bezruchu
}

// --- pora dnia i roku (cykl z kitu) ---
const CLOUDS=(()=>{const N=46,geo=new THREE.BoxGeometry(1,1,1),mat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.82,fog:false,depthWrite:false});const im=new THREE.InstancedMesh(geo,mat,N*5);im.frustumCulled=false;im.renderOrder=-1;
  const cl=[];let s=1234;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<N;i++){const parts=[];const n=3+Math.floor(r()*3);for(let k=0;k<5;k++)parts.push(k<n?[(r()-0.5)*40,(r()-0.5)*4,(r()-0.5)*26,22+r()*30,5+r()*4,16+r()*20]:null);cl.push({x:(r()-0.5)*1600,z:(r()-0.5)*1600,y:150+r()*40,parts})}
  scene.add(im);const M=new THREE.Matrix4(),Q=new THREE.Quaternion(),P=new THREE.Vector3(),Sc=new THREE.Vector3();
  return{im,mat,tick(t,cx,cz,dk){let j=0;const wind=t*2.2;for(const c of cl){let x=c.x+wind,z=c.z;x=((x-cx+800)%1600+1600)%1600-800+cx;z=((z-cz+800)%1600+1600)%1600-800+cz;
    for(const p of c.parts){if(p){P.set(x+p[0],c.y+p[1],z+p[2]);Sc.set(p[3],p[4],p[5])}else Sc.set(0,0,0);M.compose(P,Q,Sc);im.setMatrixAt(j++,M)}}im.instanceMatrix.needsUpdate=true;
    mat.color.setRGB(1-dk*0.82,1-dk*0.8,1-dk*0.72);mat.opacity=0.82-dk*0.35;im.visible=!(SPC)}}})();
const _arenaSky=new THREE.Color(0x4a3a2a);const WX={k:'jasno',i:0,t:90,flash:0,thT:25,sync:0};const WXN={jasno:'Pogodnie',deszcz:'Deszcz',burza:'Burza',mgla:'Mgła',snieg:'Śnieg'},_grey=new THREE.Color(0x6f7a84),_white=new THREE.Color(0xe8f0ff);
const SKY_DAY=new THREE.Color(0x9cc7e6),SKY_NIGHT=new THREE.Color(0x0b1220),SKYC=SKY_DAY.clone(),SV=new THREE.Vector3(),_moon=new THREE.Color(0x8fa0ff);
let hour=LS.get('hour',9.5),season=LS.get('season',0),nightOn=false;const winMeshes=[];
function setSeason(v){season=v;SEAS_U.uAut.value=v===1?1:0;SEAS_U.uSnow.value=v===2?1:0;SEAS_U.uSpr.value=v===3?1:0;SEAS_U.uFall.value=v===1?.5:v===2?1:0}
function lighting(tx,ty,tz){
  const a=(hour-6)/12*Math.PI,el=Math.sin(a);
  SV.set(Math.cos(a)*.85,Math.max(.05,el),-.5).normalize();
  const dk=1-Math.min(1,Math.max(0,el*3+.3)),sI=.24+.76*Math.min(1,Math.max(0,el)*1.8),mI=.13;
  sun.intensity=mI+(sI-mI)*(1-dk);sun.color.set(el<.25?0xffc890:0xfff1d6).lerp(_moon,dk*.6);
  hemi.intensity=.2+.38*(1-dk);SKYC.copy(SKY_NIGHT).lerp(SKY_DAY,1-dk);
  {const wi=WX.i*(WX.k==='mgla'?0.45:WX.k==='snieg'?0.6:1);sun.intensity*=1-0.55*wi;hemi.intensity*=1-0.2*wi;SKYC.lerp(_grey.clone().multiplyScalar(1-dk*0.85),0.6*wi);if(WX.flash>0){hemi.intensity+=WX.flash*1.4;SKYC.lerp(_white,WX.flash*0.7)}}
  const night=dk>.55,wb=night?(hour>=17||hour<0.5?0:hour<3?1:hour<5?2:3):-1;if(night!==nightOn||wb!==lighting.wb){nightOn=night;lighting.wb=wb;const fr=[0.7,0.4,0.15,0.35][wb]||0;for(const w of winMeshes)w.material=night&&(w.userData.k??0.5)<fr?winOn:winOff}
  sun.position.set(tx+SV.x*110,ty+SV.y*110,tz+SV.z*110);sun.target.position.set(tx,ty,tz);SEAS_U.uSunW.value.copy(SV);SEAS_U.uCam.value.copy(camera.position);
}
const clockTxt=()=>{const h=Math.floor(hour),m=Math.floor((hour-h)*60);return h+':'+String(m).padStart(2,'0')};

// --- budynki z generatorów kitu ---
const HT={kupiec:[kupiecGen,4,8,4,12,64,64],dlugi:[dlugiGen,4,4,4,6,48,96],karczma:[karczmaGen,4,8,4,18,64,64],chata:[chataGen,5,5,5,12,48,48],
  chalupa:[chalupaGen,4,4,4,12,48,64],dom:[domGen,4,4,4,9,64,64],wiezaDom:[wiezaDomGen,10,4,4,9,64,64]};   // [gen, iL,iR,iB,iF, W,D] w voxelach
const RACEPAL={
  ludzie:P=>P,
  krasnoludy:P=>Object.assign(P,SLATE,{wall:'#cfc8bc',wallD:'#b6ae9f',timber:'#3a2a20',door:'#4a3a2a',shut:'#5a5a6a',cloth:'#6a5a8a'}),
  elfy:P=>Object.assign(P,{wall:'#f2ecd6',wallD:'#ded6bc',timber:'#8a6a3a',roofA:'#4f8a3e',roofB:'#457a36',ridge:'#33602a',door:'#5a7a3a',shut:'#6a8a4a',cloth:'#4a8a6a'}),
  orkowie:P=>Object.assign(P,THATCH,{wall:'#bc9e78',wallD:'#a48862',timber:'#3a2416',door:'#4a2a1a',shut:'#6a3a2a',cloth:'#8a3a2a'})};
const houseCache=new Map();
const RBASE={niziolki:'ludzie',drowy:'elfy',saurianie:'orkowie'};
const RREC={niziolki:(r,g,b)=>{const mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=(mx-mn)/(mx+.001);if(r>g*1.35&&r>b*1.5&&sat>0.45&&r>0.42)return[0.26+0.3*g,0.44+0.4*g,0.16+0.12*g];if(sat<0.18&&mx>0.62)return[mx*0.99,mx*0.92,mx*0.76];return null},
  drowy:(r,g,b)=>{const l=(r+g+b)/3,mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=(mx-mn)/(mx+.001);if(g>r*1.12&&g>b*1.05)return[0.18+0.3*l,0.08+0.12*l,0.26+0.4*l];if(sat<0.2)return[0.14+0.3*l,0.13+0.27*l,0.18+0.36*l];return[r*0.48+0.04,g*0.4+0.02,b*0.58+0.08]},
  saurianie:(r,g,b)=>{const l=(r+g+b)/3,mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=(mx-mn)/(mx+.001);if(r>=g&&g>=b&&sat>0.22&&l>0.36)return[0.2+0.5*l,0.3+0.55*l,0.12+0.22*l];if(r>=g&&g>=b&&sat>0.22)return[r*0.85,g*0.95,b*0.8];return null}};
function recolorShare(geo,fn){const g=new THREE.BufferGeometry();for(const k of ['position','normal','uv'])if(geo.attributes[k])g.setAttribute(k,geo.attributes[k]);const c=geo.attributes.color,src=c.array,a=new Float32Array(src.length),nm=src instanceof Uint8Array?255:1;
  for(let i=0;i<src.length;i+=3){const r=src[i]/nm,gg=src[i+1]/nm,b=src[i+2]/nm,o=fn(r,gg,b);if(o){a[i]=o[0];a[i+1]=o[1];a[i+2]=o[2]}else{a[i]=r;a[i+1]=gg;a[i+2]=b}}g.setAttribute('color',new THREE.BufferAttribute(a,3));if(geo.index)g.setIndex(geo.index);for(const k in geo.attributes)if(!g.attributes[k])g.setAttribute(k,geo.attributes[k]);g.userData=Object.assign({},geo.userData||{});try{g.computeBoundingSphere()}catch(_){}return g}
function houseModel(type,v,race){
  const key=type+'|'+v+'|'+race;if(houseCache.has(key))return houseCache.get(key);
  if(RBASE[race]){const b=houseModel(type,v,RBASE[race]);let res=null;if(b){try{res={geo:recolorShare(b.geo,RREC[race]),wins:b.wins}}catch(e){console.warn('kolor rasy',e);res=b}}houseCache.set(key,res);return res}
  const [gen,,,,,W0,D0]=HT[type];const P=RACEPAL[race](palFor(type,v));WG=0;GENTYPE=type;
  let res=null;
  try{const r=(race&&race!=='ludzie'&&raceGen(type,v,race))||gen(P,v),win=r.win||[],B=deZ(cutHoles(r.B,win.concat(r.holes||[])));const geo=voxGeo(B,.06);geo.translate(-W0/2*V,0,-D0/2*V);
    let wins=[];if(win.length){const gs=[[],[],[],[]];win.forEach((w,i)=>gs[(w[6]!=null?w[6]:i)%4].push([w[0],w[1],w[2],w[3],w[4],w[5],'#ffffff']));wins=gs.filter(g=>g.length).map(g=>{const q=voxGeo(g,0);q.translate(-W0/2*V,0,-D0/2*V);return q})}
    res={geo,wins}}catch(e){console.warn('dom',type,v,e)}
  houseCache.set(key,res);return res;
}
// ===== style budynków ras: elfy, krasnoludy, orkowie (ludzie bez zmian) =====
const RHH={chata:3.2,chalupa:3.6,dom:4,kupiec:4.4,karczma:4.6,dlugi:3.8,kamienica:6.4,podcienia:5.4,wiezaDom:5,rez:8.5};
const RHBIG=new Set(['kupiec','karczma','kamienica','wiezaDom','rez','podcienia']);
function raceHouse(type,vv,race){if(!HT[type])return null;const [,iL,iR,iB,iF,W0,D0]=HT[type],k=V*BS,w=(W0-iL-iR)*k,d=(D0-iB-iF)*k,ox=(iL-iR)/2*k,oz=(iB-iF)/2*k,fz=oz+d/2,bz=oz-d/2,H=RHH[type]||4,big=RHBIG.has(type),r=rngOf('rh'+type+vv+race),L=[],Wn=[],P=(...b)=>L.push(b),WIN=(...b)=>Wn.push(b);
  if(race==='elfy'){const WD=['#ece2c8','#e4d6b4','#f2ead6'][vv%3],WD2='#d2c29c',TR='#7a6040',RF=['#3f8a4a','#4a8a6a','#5a9a3a'][vv%3],RF2='#5aa858',RFL='#8ccc72',ST='#ece8e0',GL='#a8f0ff';
    P(ox,0.2,oz,w+1,0.4,d+1,ST);P(ox,0.43,oz,w+1.3,0.06,d+1.3,'#c8c0b0');for(const sx of [-1,1])P(ox,0.15,fz+0.9,1.8,0.3,0.8,ST);
    const H1=big?H*0.62:H;P(ox,H1/2+0.4,oz,w-0.8,H1,d-0.8,WD);P(ox,H1/2+0.4,oz,w-0.2,H1*0.86,d*0.55,WD2);P(ox,H1/2+0.4,oz,w*0.55,H1*0.86,d-0.2,WD2);
    for(const sx of [-1,1])for(const sz of [-1,1]){P(ox+sx*(w/2-0.45),H1/2+0.4,oz+sz*(d/2-0.45),0.7,H1+0.5,0.7,TR);P(ox+sx*(w/2-0.45),H1+0.9,oz+sz*(d/2-0.45),0.45,0.6,0.45,RFL)}
    for(let x=-w/2+1;x<=w/2-1;x+=1.3)P(ox+x,H1/2+0.4,fz-0.38,0.12,H1*0.9,0.1,TR);
    P(ox,1.45,fz-0.36,1.3,2.3,0.1,'#5a4a2a');P(ox,2.75,fz-0.36,0.9,0.35,0.1,'#5a4a2a');P(ox,2.98,fz-0.34,0.5,0.2,0.1,'#5a4a2a');P(ox+1.1,1.9,fz-0.1,0.22,0.32,0.22,GL);P(ox-1.1,1.9,fz-0.1,0.22,0.32,0.22,GL);
    for(const sx of [-1,1]){WIN(ox+sx*w*0.28,H1*0.62+0.4,fz-0.36,0.7,0.7,0.07,'#ffffff');P(ox+sx*w*0.28,H1*0.62+0.4,fz-0.37,0.9,0.9,0.05,TR)}
    const roof=(y,ww,dd,n)=>{for(let i=0;i<n;i++){const s=1.18-i*(0.9/n);P(ox,y+i*0.5,oz,ww*s,0.5,dd*s,i%2?RF:RF2)}for(const sx of [-1,1])for(const sz of [-1,1])P(ox+sx*ww*0.62,y+0.35,oz+sz*dd*0.62,0.45,0.45,0.45,RFL)};
    roof(H1+0.4,w+0.8,d+0.8,5);
    if(big){const H2=H*0.5;P(ox,H1+2.9+H2/2,oz,w*0.6,H2,d*0.6,WD);for(const sx of [-1,1])WIN(ox+sx*w*0.15,H1+2.9+H2*0.55,oz+d*0.3+0.02,0.5,0.6,0.06,'#ffffff');roof(H1+2.9+H2,w*0.75,d*0.75,4);
      const tx=ox+w*0.32,tz=oz-d*0.22,TH=H1+H2+5;P(tx,TH/2,tz,1.3,TH,1.3,ST);for(let i=0;i<6;i++)P(tx,TH+0.4+i*0.5,tz,1.9-i*0.3,0.5,1.9-i*0.3,i%2?RF:RFL);P(tx,TH+3.6,tz,0.35,0.7,0.35,GL)}
    for(let i=0;i<5;i++){const x=ox+(r()-0.5)*w,z=r()<0.5?fz-0.3:bz+0.3;P(x,0.6+r()*H1*0.7,z,0.18,1.2+r()*1.4,0.12,'#4a8a3a')}}
  else if(race==='krasnoludy'){const S1=['#6f6a73','#76706a','#66626c'][vv%3],S2='#5d5a63',DK='#3a3840',GD='#d9b23a',RD='#8a2a22',FI='#ff8a2e';const H1=H*0.82;
    P(ox,0.3,oz,w+0.8,0.6,d+0.8,DK);P(ox,H1/2+0.5,oz,w,H1,d,S1);for(let y=1.4;y<H1;y+=1.1)P(ox,y+0.5,oz,w+0.04,0.08,d+0.04,S2);
    for(let x=-w/2;x<=w/2+0.01;x+=Math.max(1.8,w/4))for(const z of [fz,bz])P(ox+x,H1*0.4+0.3,z+(z===fz?0.25:-0.25),0.8,H1*0.8,0.6,S2);
    for(let z=-d/2;z<=d/2+0.01;z+=Math.max(1.8,d/4))for(const sx of [-1,1])P(ox+sx*(w/2+0.25),H1*0.4+0.3,oz+z,0.6,H1*0.8,0.8,S2);
    P(ox,H1+0.7,oz,w+0.6,0.45,d+0.6,S2);for(let x=-w/2;x<=w/2+0.01;x+=1.1){P(ox+x,H1+1.2,fz+0.2,0.55,0.55,0.45,S1);P(ox+x,H1+1.2,bz-0.2,0.55,0.55,0.45,S1)}for(let z=-d/2+1.1;z<d/2;z+=1.1)for(const sx of [-1,1])P(ox+sx*(w/2+0.2),H1+1.2,oz+z,0.45,0.55,0.55,S1);
    P(ox,1.45,fz+0.03,1.9,2.7,0.12,'#2a2018');P(ox,2.95,fz+0.1,2.5,0.32,0.18,GD);for(const sx of [-1,1])P(ox+sx*1.1,1.45,fz+0.1,0.28,2.9,0.18,GD);P(ox,3.25,fz+0.12,0.6,0.3,0.1,RD);
    P(ox,H1*0.72+0.5,fz+0.07,w*0.92,0.18,0.06,GD);for(let x=-w*0.4;x<=w*0.4;x+=1.4)P(ox+x,H1*0.72+0.5,fz+0.1,0.18,0.18,0.05,RD);
    for(const sx of [-1,1]){WIN(ox+sx*w*0.3,H1*0.5+0.5,fz+0.02,0.28,1,0.06,'#ffffff');P(ox+sx*w*0.3,H1*0.5+1.1,fz+0.06,0.5,0.15,0.06,GD)}
    const cx=ox+w*0.3,cz=oz-d*0.25;P(cx,H1+1.8,cz,0.95,2.2,0.95,DK);P(cx,H1+2.95,cz,0.62,0.25,0.62,FI);
    for(const sx of [-1,1]){P(ox+sx*1.75,0.55,fz+0.85,0.55,0.9,0.55,DK);P(ox+sx*1.75,1.1,fz+0.85,0.45,0.28,0.45,FI)}
    if(big){P(ox,H1+2.2,oz,w*0.6,2.2,d*0.6,S1);P(ox,H1+3.45,oz,w*0.66,0.35,d*0.66,S2);P(ox,H1+4.2,oz,w*0.3,1.2,d*0.3,S1);P(ox,H1+5,oz,w*0.34,0.3,d*0.34,GD);P(ox,H1+5.5,oz,0.5,0.8,0.5,GD)}}
  else if(race==='orkowie'){const LG='#5a3a22',LG2='#4a2f1d',HD=['#8a6a4a','#7a5a3a','#9a7650'][vv%3],HD2='#a07a52',SW='#7a5a30',BN='#e8e0c8',RD='#a8302a';const H1=H*0.72,rx=w/2,rz=d/2;
    P(ox,H1/2,oz,w-0.4,H1,d-0.4,HD);for(let i=0;i<8;i++)P(ox+(r()-0.5)*(w-1),0.6+r()*(H1-1),r()<0.5?fz-0.18:bz+0.18,0.9,0.7,0.06,HD2);
    for(let i=0;i<14;i++){const a=i/14*Math.PI*2,x=ox+Math.cos(a)*rx,z=oz+Math.sin(a)*rz;if(Math.sin(a)>0.9)continue;P(x,(H1+0.6)/2,z,0.42,H1+0.6,0.42,i%2?LG:LG2);P(x,H1+0.75,z,0.26,0.4,0.26,LG2)}
    for(let i=0;i<5;i++){const s=1-i*0.19;P(ox,H1+0.3+i*0.6,oz,(w+0.9)*s,0.62,(d+0.9)*s,i%2?SW:HD)}
    for(const sx of [-1,1])P(ox+sx*0.35,H1+3.6,oz,0.14,1.7,0.14,LG2);P(ox,H1+3.4,oz,0.9,0.12,0.12,LG2);
    P(ox,1.15,fz-0.12,1.4,2.2,0.1,'#3a2414');for(const sx of [-1,1]){P(ox+sx*0.95,1.4,fz+0.45,0.26,2.8,0.26,BN);P(ox+sx*0.62,2.85,fz+0.55,0.22,0.5,0.22,BN);P(ox+sx*0.3,3.1,fz+0.6,0.18,0.25,0.18,BN)}
    const px=ox+w*0.48,pz=fz+1;P(px,1.6,pz,0.15,3.2,0.15,LG2);P(px,3.3,pz,0.42,0.42,0.42,BN);P(px,3.33,pz+0.21,0.28,0.12,0.02,'#141414');P(px,3.12,pz+0.21,0.12,0.08,0.02,'#141414');
    const bx=ox-w*0.48;P(bx,2.6,pz,0.13,5.2,0.13,LG2);P(bx+0.5,4.3,pz,0.9,1.4,0.08,RD);P(bx+0.5,4.3,pz+0.05,0.4,0.4,0.04,'#141414');
    for(const sx of [-1,1])for(let k2=0;k2<3;k2++){P(ox+sx*(rx+0.7),0.9,oz-1+k2*1,0.3,1.8,0.3,LG);P(ox+sx*(rx+0.7),1.95,oz-1+k2*1,0.18,0.3,0.18,'#c8b8a0')}
    WIN(ox,H1*0.7,bz+0.17,0.6,0.3,0.06,'#ffffff');
    if(big){P(ox,H1+3.9,oz,w*0.4,1.8,d*0.4,HD);for(let i=0;i<3;i++)P(ox,H1+4.8+i*0.5,oz,w*0.5*(1-i*0.3),0.5,d*0.5*(1-i*0.3),SW);for(const sx of [-1,1])for(const sz of [-1,1])P(ox+sx*w*0.22,H1+5.5,oz+sz*d*0.22,0.2,1,0.2,BN)}}
  else return null;
  const geo=kitB(L);let wins=[];if(Wn.length)wins=[kitB(Wn)];return{geo,wins}}
function raceWall(g,race){if(race==='ludzie'||!g||(g.userData&&g.userData.raced)||RBASE[race])return g;const fn=race==='elfy'?(r,gg,b)=>{if(Math.max(r,gg,b)-Math.min(r,gg,b)>0.1)return null;const l=(r+gg+b)/3;return[0.72+0.3*l,0.7+0.3*l,0.62+0.3*l]}:race==='krasnoludy'?(r,gg,b)=>{const l=(r+gg+b)/3;return Math.max(r,gg,b)-Math.min(r,gg,b)>0.15?null:[l*0.62,l*0.6,l*0.66]}:(r,gg,b)=>{if(Math.max(r,gg,b)-Math.min(r,gg,b)>0.12)return null;const l=(r+gg+b)/3;return[0.3+0.35*l,0.2+0.24*l,0.12+0.14*l]};return PANIM.__rec(g,fn)}
// ===== szczegółowe generatory budynków ras (format jak ludzkie: woksele, prawdziwe otwory, świecące okna) =====
const RFL={chata:1,chalupa:1,dom:1,kupiec:2,karczma:2,dlugi:1,kamienica:3,podcienia:2,wiezaDom:2,rez:3};
function raceGen(type,v,race){if(!HT[type])return null;const [,iL,iR,iB,iF,W0,D0]=HT[type],x0=iL,z0=iB,w=W0-iL-iR,d=D0-iB-iF,x1=x0+w,z1=z0+d,cx=x0+w/2,cz=z0+d/2,fl=RFL[type]||1,big=fl>=2||type==='rez',r=rngOf('rg'+type+v+race),B=[],win=[],holes=[],P=(...b)=>B.push(b),pick=a=>a[Math.floor(r()*a.length)];
  if(race==='elfy'){const ST='#ece8e0',ST2='#d6d0c6',PL=[['#ece2c8','#e2d4b0','#f2e8d2'],['#e8e4d8','#dcd6c6','#f0ece2'],['#f0e0c0','#e6d0a8','#f6eacc']][v%3],TR=['#6a5032','#7a6040','#5a4428'],GD='#c8a85a',LF=[['#3f8a4a','#4a9a50','#5aa858','#367a3e','#6cb860'],['#4a8a6a','#5a9a7a','#3a7a5a','#6aaa8a','#4a9a6a'],['#5a9a3a','#6aaa4a','#4a8a2a','#7aba5a','#5aa04a']][v%3],GL='#a8f0ff',fh=19,H=fl*fh;
    P(x0-4,0,z0-4,w+8,2,d+8,ST);P(x0-4.5,1.4,z0-4.5,w+9,0.6,d+9,ST2);for(let k=0;k<3;k++)P(cx-6+k,0,z1+4+k*1.4,12-2*k,1.6-k*0.5,1.4,ST2);
    P(x0+1,2,z0+1,w-2,H,d-2,PL[0],'d');
    for(let f=0;f<fl;f++){const y=2+f*fh;for(let x=x0+1;x<x1-1;x+=2){const c=PL[(x*7+f)%3];P(x,y,z1-1.6,2,fh,0.7,c,'d');P(x,y,z0+0.9,2,fh,0.7,PL[(x*5+f+1)%3],'d')}for(let z=z0+1;z<z1-1;z+=2){const c=PL[(z*3+f)%3];P(x0+0.9,y,z,0.7,fh,2,c,'d');P(x1-1.6,y,z,0.7,fh,2,PL[(z*11+f)%3],'d')}P(x0+0.4,y+fh-1.2,z0+0.4,w-0.8,1.4,d-0.8,GD);P(x0+0.2,y+fh-1.6,z0+0.2,w-0.4,0.5,d-0.4,TR[1])}
    const pil=(px,pz,hh)=>{for(let y=2,k=0;y<hh;y+=2.6,k++){const o=Math.sin(k*1.3)*0.3;P(px-1.5+o,y,pz-1.5,3,2.6,3,TR[k%3]);if(k%3===1)P(px-1.7+o,y+1,pz-0.4,0.4,0.8,0.8,'#8a7050')}P(px-2.4,2,pz-2.4,4.8,1.4,4.8,TR[2]);P(px-3,2,pz-0.6,1.4,0.8,1.2,TR[2]);P(px+1.6,2,pz-0.6,1.4,0.8,1.2,TR[2]);P(px-2.5,hh,pz-0.5,5,1,1,TR[0]);P(px-0.5,hh,pz-2.5,1,1,5,TR[0]);P(px-3,hh+1,pz-3,2,1.2,2,LF[4]);P(px+1,hh+1,pz+1,2,1.2,2,LF[1])};
    for(const [px,pz] of [[x0+1,z0+1],[x1-1,z0+1],[x0+1,z1-1],[x1-1,z1-1]])pil(px,pz,H+3);if(w>40){pil(cx-12,z1-1,H+2);pil(cx+12,z1-1,H+2)}
    const dw=6,dh=12;holes.push([cx-dw/2,2,z1-1.2,dw,dh,1]);P(cx-dw/2,2,z1-2,dw,dh,0.6,'#6a4a2a');P(cx-0.3,2,z1-1.45,0.6,dh,0.1,'#4a3220');for(const yy of [5,9])P(cx-dw/2,2+yy,z1-1.45,dw,0.4,0.1,'#4a3220');
    P(cx-dw/2-1.2,2,z1-1.5,1.2,dh+1,1.4,TR[1]);P(cx+dw/2,2,z1-1.5,1.2,dh+1,1.4,TR[1]);P(cx-dw/2,2+dh,z1-1.5,dw,1,1.4,TR[1]);P(cx-dw/2+1,3+dh,z1-1.5,dw-2,1,1.4,TR[0]);P(cx-1.2,4+dh,z1-1.5,2.4,1,1.4,GD);P(cx-0.5,5+dh,z1-1.2,1,1,1,GL);
    for(const s of [-1,1]){P(cx+s*(dw/2+3)-0.3,9,z1+1.5,0.6,4,0.6,TR[0]);P(cx+s*(dw/2+3)-0.9,8,z1+1.2,1.8,0.4,1.2,TR[1]);win.push([cx+s*(dw/2+3)-0.75,6,z1+2,1.5,2,1.5]);P(cx+s*(dw/2+3)-0.75,6,z1+2,1.5,2,1.5,GL)}
    for(let f=0;f<fl;f++){const y=2+f*fh;for(const s of (w>34?[-1,1]:[1])){const wx=cx+s*w*(w>34?0.3:0.28);if(f===0&&Math.abs(wx-cx)<dw)continue;win.push([wx-2.5,y+6,z1-1.2,5,6,1]);
        for(const [ax,ay,aw,ah] of [[-3.5,5,7,1],[-3.5,12,7,1],[-3.5,6,1,6],[2.5,6,1,6],[-2.5,4,5,1],[-2.5,13,5,1]])P(wx+ax,y+ay,z1-1.9,aw,ah,1,ay>11?GD:TR[1]);P(wx-0.25,y+6,z1-1.15,0.5,6,0.15,TR[0]);P(wx-2.5,y+8.75,z1-1.15,5,0.5,0.15,TR[0])}
      for(const s of [-1,1]){const zx=s<0?x0+0.2:x1-1.2;win.push([zx,y+6,cz-2.5,1,6,5]);P(s<0?zx-0.8:zx+0.2,y+5,cz-3.5,1.6,1,7,TR[1]);P(s<0?zx-0.8:zx+0.2,y+12,cz-3.5,1.6,1,7,GD)}}
    for(let i=0;i<12;i++){const onF=r()<0.6,x=onF?x0+3+r()*(w-6):(r()<0.5?x0-0.2:x1-0.6),z=onF?z1-0.9:z0+3+r()*(d-6),y=2+r()*H*0.6,len=4+r()*H*0.4;if(onF&&Math.abs(x-cx)<dw)continue;P(x,y,z,onF?0.7:0.8,len,onF?0.5:0.7,'#4a8a3a');for(let k=0;k<3;k++)P(x-0.2+(r()-0.5),y+r()*len,z+(onF?0.3:0),0.8,0.8,0.5,k%2?'#f0a8c8':'#fff4e0')}
    const roof=(rx0,rz0,rw,rd,y,n)=>{let yy=y;for(let i=0;i<n;i++){const ins=i*Math.min(rw,rd)*0.11-4.5;P(rx0+ins+0.5,yy-0.3,rz0+ins+0.5,rw-2*ins-1,1.2,rd-2*ins-1,LF[3]);for(let x=rx0+ins;x<rx0+rw-ins;x+=3)for(let z=rz0+ins;z<rz0+rd-ins;z+=3)P(x,yy+((Math.round(x)*13+Math.round(z)*7)%3)*0.25,z,3.4,1.25,3.4,LF[(Math.round(x)*3+Math.round(z)*5+i)%5]);
        for(const [ax,az] of [[rx0+ins,rz0+ins],[rx0+rw-ins-2,rz0+ins],[rx0+ins,rz0+rd-ins-2],[rx0+rw-ins-2,rz0+rd-ins-2]])P(ax,yy+1,az,2.2,1.8+(n-i)*0.3,2.2,LF[4]);yy+=1.35}
      const tx=rx0+rw/2,tz=rz0+rd/2;P(tx-2.5,yy,tz-2.5,5,1.6,5,LF[2]);P(tx-1.2,yy+1.6,tz-1.2,2.4,1.4,2.4,LF[4]);P(tx-0.5,yy+3,tz-0.5,1,1,1,'#f0a8c8');return yy};
    roof(x0,z0,w,d,H+2,big?4:5);
    if(v===1||v===4){const by=2+fh;P(cx-9,by-1,z1-1,18,1,5,TR[1]);for(let x=cx-9;x<=cx+9;x+=2)P(x,by,z1+3.2,0.6,3,0.6,TR[0]);P(cx-9,by+3,z1+3.2,18,0.6,0.8,GD);for(const s of [-1,1])P(cx+s*8.6-0.5,2,z1+3.2,1,by-3,1,TR[2])}
    if(big||v===3){const tx=v===3?x1-6:x0+5,tz=z0+5,TH=H+(big?24:14);for(let y=2,k=0;y<TH;y+=2.6,k++)for(const [ax,az,aw,ad] of [[-4,-4,8,1.2],[-4,2.8,8,1.2],[-4,-4,1.2,8],[2.8,-4,1.2,8]])P(tx+ax,y,tz+az,aw,2.6,ad,PL[(k+ax*3)%3&3]||PL[0]);P(tx-3,2,tz-3,6,TH-2,6,PL[1]);
      for(let y=10;y<TH-6;y+=10){win.push([tx-1,y,tz+3.6,2,4,1]);P(tx-1.8,y-1,tz+3.4,3.6,1,1.4,GD)}P(tx-4.6,TH,tz-4.6,9.2,1.2,9.2,GD);
      let yy=TH+1.2;for(let i=0;i<7;i++){const s=5-i*0.7;for(let x=-s;x<s;x+=2.4)for(let z=-s;z<s;z+=2.4)P(tx+x,yy,tz+z,2.6,1.4,2.6,LF[(i+Math.round(x+z))%5]);yy+=1.4}P(tx-0.7,yy,tz-0.7,1.4,3,1.4,GL);win.push([tx-0.7,yy,tz-0.7,1.4,3,1.4])}}
  else if(race==='krasnoludy'){const S=[['#76716e','#6a6670','#827c78','#5f5b63'],['#7a746c','#6e685f','#857e74','#625c54'],['#6c6a74','#605e68','#78767f','#56545e']][v%3],SD='#4a4750',DK='#34323a',GD='#d9b23a',RD='#8a2a22',CU='#5a9a7a',FI='#ff8a2e',IR='#3a3a40',WDd='#4a2f1d',fh=17,H=fl*fh;
    P(x0-3,0,z0-3,w+6,3,d+6,DK);P(x0-2.4,3,z0-2.4,w+4.8,1,d+4.8,SD);for(let k=0;k<3;k++)P(cx-6+k,0,z1+3+k*1.4,12-2*k,3-k,1.4,SD);
    P(x0,4,z0,w,H,d,S[0],'d');
    for(let y=4,row=0;y<4+H-0.1;y+=3,row++){let x=x0+(row%2?2.5:0);while(x<x1-0.2){const L2=Math.min(x1-x,4+((Math.round(x)*7+row*3)%4));P(x,y,z1-0.6,L2-0.35,2.65,1,S[(Math.round(x)+row)%4],'d');P(x,y,z0-0.4,L2-0.35,2.65,1,S[(Math.round(x)*3+row)%4],'d');x+=L2}
      let z=z0+(row%2?2:0);while(z<z1-0.2){const L2=Math.min(z1-z,4+((Math.round(z)*5+row)%4));P(x0-0.4,y,z,1,2.65,L2-0.35,S[(Math.round(z)+row*2)%4],'d');P(x1-0.6,y,z,1,2.65,L2-0.35,S[(Math.round(z)*7+row)%4],'d');z+=L2}}
    for(let bx=x0+5;bx<x1-3;bx+=12){if(Math.abs(bx-cx)<7)continue;for(const [zz,dz] of [[z1,1],[z0-3,-1]]){P(bx-2,4,zz,4,H*0.55,3,SD);P(bx-1.5,4+H*0.55,zz+(dz>0?0:1),3,H*0.3,2,SD);P(bx-2.3,4,zz-0.3,4.6,1.2,3.6,DK)}}
    P(x0-1.5,4+H,z0-1.5,w+3,1.5,d+3,SD);P(x0-2.2,5.5+H,z0-2.2,w+4.4,1,d+4.4,S[2]);
    for(let x=x0-2.2;x<x1+2;x+=3){P(x,6.5+H,z0-2.2,2,2.2,1.4,S[1]);P(x,6.5+H,z1+0.8,2,2.2,1.4,S[1])}for(let z=z0;z<z1;z+=3){P(x0-2.2,6.5+H,z,1.4,2.2,2,S[1]);P(x1+0.8,6.5+H,z,1.4,2.2,2,S[1])}
    if(v===2){for(let i=0;i<8;i++){const ins=i*2;if(w-2*ins<4||d-2*ins<4)break;for(let x=x0+ins;x<x1-ins;x+=3)P(x,6.5+H+i*1.6,z0+ins,3.1,1.6,d-2*ins,(i+Math.round(x))%2?SD:S[3])}}
    else for(let x=x0;x<x1;x+=4)for(let z=z0;z<z1;z+=4)P(x,5.9+H,z,3.8,0.5,3.8,((Math.round(x)+Math.round(z))/4)%2?S[3]:SD);
    if(big){const ux=x0+w*0.2,uz=z0+d*0.2,uw=w*0.6,ud=d*0.6,uy=6.5+H,UH=fh*0.8;P(ux,uy,uz,uw,UH,ud,S[1],'d');for(let y=uy;y<uy+UH-1;y+=3)P(ux-0.3,y,uz-0.3,uw+0.6,0.4,ud+0.6,SD);P(ux-1,uy+UH,uz-1,uw+2,1.4,ud+2,S[2]);for(let x=ux-1;x<ux+uw+1;x+=3)P(x,uy+UH+1.4,uz-1,2,2,1.2,S[1]);
      win.push([cx-1,uy+5,uz+ud-0.9,2,6,1]);P(cx-3,uy+UH+3.4,cz-3,6,2,6,S[0]);P(cx-2,uy+UH+5.4,cz-2,4,1,4,GD);P(cx-0.6,uy+UH+6.4,cz-0.6,1.2,2.4,1.2,GD)}
    const dw=8,dh=13;holes.push([cx-dw/2,4,z1-1,dw,dh,1]);P(cx-dw/2,4,z1-1.6,dw,dh,0.6,WDd);for(const yy of [2,6,10])P(cx-dw/2,4+yy,z1-1.05,dw,0.7,0.2,IR);for(let x=cx-dw/2+1;x<cx+dw/2;x+=2)for(const yy of [2.2,6.2,10.2])P(x,4+yy+0.1,z1-0.95,0.4,0.4,0.2,'#8e8994');
    P(cx-dw/2-1.6,4,z1-0.3,1.6,dh,1.6,SD);P(cx+dw/2,4,z1-0.3,1.6,dh,1.6,SD);for(let k=-6;k<=6;k++)P(cx+k-0.5,4+dh+(Math.abs(k)<4?1:Math.abs(k)<6?0.5:0),z1-0.3,1,2,1.6,k%2?S[2]:SD);P(cx-1,4+dh+1,z1+0.4,2,2.6,1.2,GD);
    P(cx-2,4+dh+3.2,z1-0.1,4,4,1.2,S[2]);P(cx-1.3,4+dh+5.4,z1+1.05,0.8,0.6,0.2,DK);P(cx+0.5,4+dh+5.4,z1+1.05,0.8,0.6,0.2,DK);P(cx-1.6,4+dh+3,z1+0.9,3.2,1.8,0.6,S[0]);P(cx-0.4,4+dh+4.6,z1+1.05,0.8,0.8,0.3,S[3]);
    P(x0,4+H*0.72,z1+0.4,w,0.8,0.3,GD);for(let x=x0+2;x<x1-1;x+=4)P(x,4+H*0.72,z1+0.65,0.8,0.8,0.2,RD);
    for(let f=0;f<fl;f++){const y=4+f*fh;for(const s of [-1,1]){const wx=cx+s*w*0.3;win.push([wx-1,y+5,z1-1,2,6,1]);for(let k=0;k<3;k++)P(wx-1+k*0.8,y+5,z1+0.45,0.25,6,0.25,IR);P(wx-1.8,y+11,z1+0.4,3.6,1,0.8,GD);P(wx-1.8,y+4.2,z1+0.4,3.6,0.8,0.8,SD)}
      for(const s of [-1,1]){const zx=s<0?x0-0.2:x1-0.8;win.push([zx,y+5,cz-1,1,6,2])}}
    for(const s of [-1,1])P(s<0?x0-1.2:x1+0.2,4,z1+0.2,1,H+2,1,CU),P(s<0?x0-1.6:x1-0.2,4+H+1,z1-0.2,1.8,1,1.8,CU);
    const chx=x0+w*0.75,chz=z0+d*0.3;P(chx,6.5+H,chz,4,10,4,DK);P(chx-0.4,16.5+H,chz-0.4,4.8,0.8,4.8,SD);P(chx+0.8,16.6+H,chz+0.8,2.4,0.6,2.4,FI);win.push([chx+0.8,16.6+H,chz+0.8,2.4,0.6,2.4]);
    for(const s of [-1,1]){P(cx+s*8-1.2,4,z1+3.5,2.4,3,2.4,DK);P(cx+s*8-1.5,7,z1+3.2,3,0.6,3,IR);P(cx+s*8-0.8,7.6,z1+3.9,1.6,1,1.6,FI);win.push([cx+s*8-0.8,7.6,z1+3.9,1.6,1,1.6])}
    if(v===4||type==='kupiec'){P(x1-6,4,z1+3,4,2.4,2,IR);P(x1-6.6,6.4,z1+3,5.2,0.8,2,IR);P(x1-4.5,4,z1+2.4,1.2,2.4,3.2,DK)}
    if(v===1){const tx=x0+3,tz=z1-3;for(let y=4,k=0;y<4+H+12;y+=3,k++)P(tx-4,y,tz-4,8,3,8,S[k%4]);P(tx-5,4+H+12,tz-5,10,1.4,10,SD);for(const [a,b] of [[-5,-5],[3.6,-5],[-5,3.6],[3.6,3.6]])P(tx+a,5.4+H+12,tz+b,1.4,2,1.4,S[1]);win.push([tx-1,H*0.6,tz+3.8,2,5,1])}}
  else if(race==='orkowie'){const LG=['#5a3a22','#4a2f1d','#6a4428','#553620'],BK='#3a2414',HD=['#8a6a4a','#7a5a3a','#9a7650','#6e5236','#a88a62'],SW=['#7a5a30','#8a6a38','#6a4a26','#94743e'],BN='#e8e0c8',RD='#a8302a',FI='#ff8a2e',fh=16,H=fl*fh*0.8,rx=w/2,rz=d/2;
    P(x0-3,0,z0-3,w+6,1.5,d+6,'#5a4630');for(let i=0;i<10;i++)P(x0-3+r()*(w+4),1.4,z0-3+r()*(d+4),1+r()*2,0.3,1+r()*2,'#4a3a26');
    P(x0+2,1.5,z0+2,w-4,H,d-4,HD[0],'d');
    for(let i=0;i<22;i++){const front=r()<0.55,pw=4+r()*4,ph=3+r()*4,px=x0+3+r()*(w-6-pw),py=2+r()*(H-ph-1),pz=r()<0.5?z1-2.6:z0+2;if(front&&Math.abs(px+pw/2-cx)<6&&py<12&&pz>cz)continue;P(px,py,pz,pw,ph,0.6,HD[i%5],'d');P(px,py+ph-0.3,pz+(pz>cz?0.45:-0.05),pw,0.3,0.2,BK);for(let s2=px+0.6;s2<px+pw;s2+=1.2)P(s2,py+ph/2,pz+(pz>cz?0.5:-0.1),0.3,0.6,0.15,BK)}
    const n=Math.round(Math.PI*(rx+rz)/2.6);for(let i=0;i<n;i++){const a=i/n*Math.PI*2,px=cx+Math.cos(a)*rx,pz=cz+Math.sin(a)*rz;if(Math.sin(a)>0.93)continue;const hh=H+2+((i*5)%3)*1.2;P(px-1.2,1.5,pz-1.2,2.4,hh,2.4,LG[i%4]);P(px-1.35,1.5+hh*0.3,pz-1.35,2.7,0.6,2.7,BK);P(px-1.35,1.5+hh*0.75,pz-1.35,2.7,0.5,2.7,BK);P(px-0.7,1.5+hh,pz-0.7,1.4,1.2,1.4,LG[(i+1)%4]);P(px-0.3,2.7+hh,pz-0.3,0.6,0.8,0.6,'#9a7a5a');if(i%3===0)P(px-1.3,1.5+hh*0.5,pz-0.3,0.3,0.6,0.6,'#2a1a10')}
    const RT=H+1.5;for(let i=0;i<6;i++){const s=1-i*0.16,R1=(rx+3.5)*s,R2=(rz+3.5)*s,m=Math.max(8,Math.round(2*Math.PI*Math.max(R1,R2)/2.4)),y=RT+i*2.1;P(cx-R1*0.78,y,cz-R2*0.78,R1*1.56,2.2,R2*1.56,SW[i%4]);for(let j=0;j<m;j++){const a=j/m*Math.PI*2;P(cx+Math.cos(a)*R1-1.4,y-((j*7)%3)*0.3,cz+Math.sin(a)*R2-1.4,2.8,2.5,2.8,SW[(i+j)%4])}P(cx-R1*0.8,y+1.9,cz-R2*0.8,R1*1.6,0.35,R2*1.6,BK)}
    const top=RT+12.6;P(cx-0.5,top,cz-0.5,1,7,1,BK);P(cx+1,top,cz-0.2,0.6,5,0.6,BK);P(cx-1.3,top+6.5,cz-1.3,2.6,2.3,2.6,BN);P(cx-0.9,top+7.6,cz+1.25,0.7,0.6,0.1,'#141414');P(cx+0.2,top+7.6,cz+1.25,0.7,0.6,0.1,'#141414');P(cx-3.4,top+7.8,cz-0.4,2.2,0.8,0.8,BN);P(cx+1.2,top+7.8,cz-0.4,2.2,0.8,0.8,BN);P(cx-3.8,top+8.4,cz-0.3,0.6,1.2,0.6,BN);P(cx+3.2,top+8.4,cz-0.3,0.6,1.2,0.6,BN);
    for(const c2 of ['#d8302a','#3a3a3a','#e8e0c8'])P(cx+1.2+r(),top+4,cz+0.2,0.25,1.6,0.8,c2);
    holes.push([cx-3.5,1.5,z1-2.5,7,11,1]);P(cx-3.5,1.5,z1-3,3.4,11,0.4,HD[3]);P(cx-3.6,12.2,z1-2.6,7.2,0.6,0.6,BK);
    for(let k=0;k<6;k++){const off=4.8-k*0.62,yy=1.5+k*2.3;P(cx-off-0.7,yy,z1+0.4,1.4,2.5,1.4,BN);P(cx+off-0.7,yy,z1+0.4,1.4,2.5,1.4,BN)}P(cx-1.6,15.3,z1+0.2,3.2,2.6,2.6,BN);P(cx-1.1,16.2,z1+2.75,0.8,0.7,0.1,'#141414');P(cx+0.3,16.2,z1+2.75,0.8,0.7,0.1,'#141414');P(cx-3.2,16.8,z1+1,1.8,0.7,0.7,BN);P(cx+1.4,16.8,z1+1,1.8,0.7,0.7,BN);
    for(const s of [-1,1]){const sx=cx+s*w*0.32,sy=H*0.55;P(sx-2,sy-1.5,z1+0.2,4,3,0.5,RD);P(sx-1.5,sy-2,z1+0.2,3,4,0.5,RD);P(sx-0.4,sy-0.4,z1+0.7,0.8,0.8,0.3,BN);P(sx-2,sy-0.2,z1+0.65,4,0.4,0.15,'#e8e0c8')}
    const fx=cx+(v%2?-10:10),fz=z1+6;if(fx>-2&&fx<W0+2){for(let k=0;k<6;k++){const a=k/6*Math.PI*2;P(fx+Math.cos(a)*2-0.6,1.5,fz+Math.sin(a)*2-0.6,1.2,0.9,1.2,'#6a6670')}P(fx-1.2,1.6,fz-1.2,2.4,0.8,2.4,FI);win.push([fx-1.2,1.6,fz-1.2,2.4,0.8,2.4]);P(fx-0.2,2.4,fz-0.8,0.4,2,0.4,BK)}
    {const rx2=cx+(v%2?10:-10),rz2=z1+5;if(rx2>0&&rx2<W0){for(const s of [-1,1])P(rx2+s*2.5-0.3,1.5,rz2-0.3,0.6,6,0.6,BK);P(rx2-3,7,rz2-0.3,6,0.5,0.6,BK);P(rx2-2.2,3.2,rz2-0.1,4.4,3.8,0.2,HD[4])}}
    if(big||v===2){const tx=x0+3,tz=z0+3;for(let y=1.5,k=0;y<RT+16;y+=3,k++){P(tx-1.6,y,tz-1.6,3.2,3,3.2,k%3===1?RD:LG[k%4]);if(k%3===1){P(tx-0.9,y+1.6,tz+1.55,0.6,0.5,0.1,'#f0e8d8');P(tx+0.3,y+1.6,tz+1.55,0.6,0.5,0.1,'#f0e8d8');P(tx-0.8,y+0.5,tz+1.55,1.6,0.4,0.1,'#141414')}}P(tx-5,RT+15,tz-0.5,10,1,1,LG[0]);P(tx-6,RT+14,tz-0.6,1.6,2.4,1.2,RD);P(tx+4.4,RT+14,tz-0.6,1.6,2.4,1.2,RD)}
    win.push([cx-1.5,H*0.6,z0+1.5,3,1.2,1])}
  else return null;return{B,win,holes}}
function raceInterior(L,race){if(RBASE[race])race=RBASE[race];if(!race||race==='ludzie')return;const M={elfy:{'#ece2c6':'#e8dcbc','#8a6240':'#d8c8a0','#7e5838':'#cbb890','#4a2f1d':'#7a6040','#5a3a22':'#4a8a4a','#7a5030':'#b8a070'},krasnoludy:{'#ece2c6':'#6f6a73','#8a6240':'#5d5a63','#7e5838':'#55525a','#4a2f1d':'#3a3840','#5a3a22':'#4a4750','#7a5030':'#6a6670'},orkowie:{'#ece2c6':'#8a6a4a','#8a6240':'#6a5030','#7e5838':'#5e4628','#4a2f1d':'#3a2414','#5a3a22':'#7a5a30','#7a5030':'#5a3a22'}}[race];if(!M)return;for(const b of L)if(M[b[6]])b[6]=M[b[6]];
  const W=12,Dd=10;if(race==='elfy')for(const [x,z] of [[-4.6,-3.6],[4.6,-3.6]])L.push([x,0.4,z,0.8,0.8,0.8,'#6a4a2a'],[x,1.2,z,1.2,1,1.2,'#4a9a50'],[x,2.6,z,0.3,0.4,0.3,'#a8f0ff']);
  if(race==='krasnoludy')L.push([-4.6,0.5,-3.6,1,1,1,'#34323a'],[-4.6,1.1,-3.6,0.7,0.3,0.7,'#ff8a2e'],[4,0.4,-3.6,1.4,0.8,0.7,'#3a3a40'],[4,0.9,-3.6,1.8,0.3,0.7,'#3a3a40']);
  if(race==='orkowie')L.push([-4.6,2.4,-4.3,1,1,0.6,'#e8e0c8'],[-5.2,2.7,-4.3,0.6,0.3,0.3,'#e8e0c8'],[-4,2.7,-4.3,0.6,0.3,0.3,'#e8e0c8'],[4.4,1.6,-4.4,2,2.4,0.15,'#8a6a4a'],[0,0.05,-2,2.4,0.1,1.6,'#6a4a2a'])}
// rdzeń budynku (do kolizji i drzwi) w jednostkach świata, względem środka działki
function houseCore(h){const [,iL,iR,iB,iF,W0,D0]=HT[h.type],k=V*BS;return{w:(W0-iL-iR)*k,d:(D0-iB-iF)*k,ox:(iL-iR)/2*k,oz:(iB-iF)/2*k,front:(D0/2-iF)*k,pw:W0*k,pd:D0*k}}

const decoMat=matV;


// ---------- postać ----------
// =================== POSTAĆ: model, wygląd, animacje walki ===================
const SKINS=['#f6d7bd','#efc6a0','#e0ac80','#c98e60','#a46a42','#7a4a2c'];
const HAIRC=['#2a1c12','#4a2f1d','#7a4a26','#a8632e','#c9a05a','#e6d29a','#8a8a8a','#e9e6df','#6a2a1a','#2b2f45'];
const CLOTHC=['#7a3a2a','#3f5f8a','#3f6a3a','#6a4a8a','#8a6a3a','#5a5a62','#a8452f','#2f4a4a','#c9a24a','#d8ccb0'];
const EYEC=['#3a6aa0','#4a7a3a','#5a3a20','#6a6a6a','#2a2a2a'];
const HAIRS=[['krotkie','Krótkie'],['dlugie','Długie'],['kucyk','Kucyk'],['warkocze','Warkocze'],['irokez','Irokez'],['lysy','Łysy'],['kok','Kok'],['loki','Loki'],['grzywka','Grzywka'],['boki','Wygolone boki']];
const BEARDS=[['brak','Brak'],['zarost','Zarost'],['krotka','Krótka broda'],['dluga','Długa broda'],['wasy','Wąsy'],['bokobrody','Bokobrody'],['kozia','Kozia bródka'],['warkocz','Broda z warkoczem']];
const PAINTC=['#2a4a8a','#a8302a','#1a1a1a','#e8e2cc','#3a7a3a'],BELTC=['#4a3020','#2a1c12','#7a5230','#5a2a2a','#2b2f45'],ACCC=['#d9b23a','#c4ccd2','#b8302a','#3a8ac0','#5a9a4a'];
const DEFLOOK={skin:1,hair:'krotkie',hairC:1,beard:'brak',eyes:0,tunic:1,pants:5,boots:4,cape:0,capeC:0,build:0,brows:0,scar:'brak',paint:'brak',paintC:0,patch:0,ears:'ludzkie',ht:1,acc:'brak',accC:0,belt:0};
const lookOf=l=>Object.assign({},DEFLOOK,l||{});
function darker(hex,k){return '#'+new THREE.Color(hex).multiplyScalar(k).getHexString()}
// look: indeksy kolorów albo wprost kolory (NPC); extra: ears, tusks, hat, apron, pack
// zaokrąglanie brył: box -> 3 przenikające się boxy (ścięte krawędzie), tylko dla większych brył; detale zostają ostre
function roundify(list,k){const out=[];for(const b of list){const [x,y,z,w,h,d,c]=b,mn=Math.min(w,h,d);if(mn<0.13||b[7]===0){out.push(b.length>7?b.slice(0,7):b);continue}
  const e=Math.min(0.075,mn*(k||0.2));out.push([x,y,z,w,h-2*e,d-2*e,c],[x,y,z,w-2*e,h,d-2*e,c],[x,y,z,w-2*e,h-2*e,d,c])}return out}
function rboxes(list,k){return boxes(roundify(list,k))}
// look: indeksy kolorów albo wprost kolory (NPC); extra: ears, tusks, hat, apron, pack, armor, gloves
function makeChar(look,extra){
  const L=lookOf(look),E=extra||{};
  const col=(arr,v)=>typeof v==='string'?v:arr[v%arr.length];
  const skin=col(SKINS,L.skin),hair=col(HAIRC,L.hairC),tun=col(CLOTHC,L.tunic),pan=col(CLOTHC,L.pants),boo=col(CLOTHC,L.boots),eye=col(EYEC,L.eyes);
  const tunD=darker(tun,0.74),tunL=darker(tun,1.15),panD=darker(pan,0.78),booD=darker(boo,0.72),hairD=darker(hair,0.8),skinD=darker(skin,0.9),bw=L.build===2?1.24:L.build?1.12:1,fem=!!L.fem,belt=col(BELTC,L.belt||0);
  const part=(list,mat)=>{const m=new THREE.Mesh(E.pint?boxes(list.map(b=>b.slice(0,7))):rboxes(list),mat||E.mat||decoMat);m.castShadow=true;return m};
  const g=new THREE.Group();
  // nogi (biodro na 0,74)
  const leg=x=>{const p=new THREE.Group();p.position.set(x,0.74,0);p.add(part([[0,-0.2,0,0.21,0.38,0.24,pan],[0,-0.47,0,0.19,0.2,0.215,pan],[0,-0.35,0.118,0.11,0.09,0.012,panD,0],
    [0,-0.6,0.025,0.225,0.25,0.3,boo],[0,-0.475,0.005,0.245,0.065,0.265,booD],[0,-0.715,0.035,0.235,0.05,0.32,'#2a1c12'],[0,-0.6,0.176,0.1,0.05,0.012,booD,0],[0,-0.42,0.13,0.12,0.03,0.012,panD,0],[0.07,-0.52,0.163,0.05,0.04,0.012,'#b8963a',0],[0,-0.52,0.162,0.235,0.025,0.012,booD,0],[0,-0.7,0.19,0.2,0.03,0.012,booD,0],[0.11,-0.2,0,0.012,0.34,0.2,panD,0]]));return p};
  const ll=leg(-0.135*bw),rl=leg(0.135*bw);
  // tułów
  const torso=new THREE.Group();torso.position.y=0.74;
  const tl=[[0,0.33,0,0.55*bw,0.54,0.31,tun],[0,0.46,0,0.64*bw,0.2,0.32,tun],[0.17*bw,0.6,0,0.2,0.07,0.27,tunD],[-0.17*bw,0.6,0,0.2,0.07,0.27,tunD],[0,0.36,0.158,0.34*bw,0.18,0.012,tunL,0],[0,0.005,0,0.555*bw,0.2,0.325,tun],[0,0.105,0,0.585*bw,0.085,0.35,belt],[0,0.105,0.177,0.1,0.075,0.02,'#d9b23a',0],
    [0.2*bw,0.015,0.17,0.12,0.14,0.07,darker(belt,1.3)],[0,0.585,0.015,0.39,0.075,0.32,tunD],[0,0.53,0.152,0.12,0.08,0.012,skin,0],[0,0.41,0.153,0.022,0.17,0.012,'#e6dcc4',0],
    [0,-0.085,0,0.565*bw,0.035,0.335,tunD],[0,0.47,0.155,0.012,0.11,0.01,'#4a3020',0],[0.025,0.5,0.156,0.04,0.012,0.008,'#4a3020',0],[-0.025,0.44,0.156,0.04,0.012,0.008,'#4a3020',0],
    [0.255*bw,0.3,0,0.012,0.44,0.29,tunD,0],[-0.255*bw,0.3,0,0.012,0.44,0.29,tunD,0],[0,0.585,-0.16,0.36,0.06,0.012,tunD,0],[0,0.25,0.152,0.4*bw,0.01,0.008,tunL,0]];
  if(L.acc==='naszyjnik')tl.push([0,0.54,0.16,0.3,0.03,0.02,col(ACCC,L.accC||0),0],[0,0.47,0.165,0.07,0.08,0.02,col(ACCC,L.accC||0),0]);if(L.acc==='szal')tl.push([0,0.6,0.02,0.44,0.1,0.36,col(ACCC,L.accC||0)],[0.12,0.42,0.17,0.1,0.26,0.03,col(ACCC,L.accC||0),0]);
  if(fem||E.dress)tl.push([0,-0.17,0,0.64*bw,0.52,0.43,tun],[0,-0.42,0,0.665*bw,0.065,0.455,tunD],[0,0.0,0.217,0.3,0.12,0.012,tunL,0]);
  if(E.apron)tl.push([0,0.13,0.19,0.44,0.56,0.035,'#5a3a22'],[0,0.45,0.19,0.3,0.03,0.04,'#3a2412',0]);
  if(E.pack)tl.push([0,0.34,-0.255,0.44,0.5,0.2,'#6b4a2b'],[0,0.64,-0.255,0.48,0.12,0.14,'#8a6a3a'],[0.14,0.36,0.157,0.05,0.48,0.012,'#4a3020',0],[-0.14,0.36,0.157,0.05,0.48,0.012,'#4a3020',0]);
  if(E.armor)tl.push([0,0.35,0,0.58*bw,0.44,0.36,E.armor],[0,0.57,0,0.62*bw,0.09,0.38,darker(E.armor,0.8)],[0,0.2,0.188,0.3,0.48,0.02,'#a8352a',0],[0,0.3,0.2,0.12,0.12,0.012,'#d9b23a',0]);
  if(E.ribs)for(let k=0;k<4;k++)tl.push([0,0.48-k*0.1,0.153,0.4,0.035,0.012,'#5a5246',0]);
  if(E.wraps)for(let k=0;k<5;k++)tl.push([0,0.52-k*0.11,0.153,0.5,0.03,0.012,darker(tun,0.82),0],[0.25,0.47-k*0.11,0,0.012,0.03,0.28,darker(tun,0.82),0]);
  if(E.robe)tl.push([0,-0.2,0,0.6*bw,0.58,0.4,tun],[0,-0.47,0,0.62*bw,0.06,0.42,'#d9b23a'],[0,0.3,0.162,0.06,0.5,0.012,'#d9b23a',0]);
  torso.add(part(tl));
  // głowa (szyja na 0,6 od tułowia) — duża jak w Cube World
  const head=new THREE.Group();head.position.y=0.6;
  const hl=E.pint?[[0,0.04,0,0.18,0.1,0.18,skin],[0,0.3,0,0.5,0.48,0.46,skin],[0.11,0.31,0.235,0.08,0.09,0.02,E.skull?(E.glow||'#ff5a2a'):'#101010'],[-0.11,0.31,0.235,0.08,0.09,0.02,E.skull?(E.glow||'#ff5a2a'):'#101010'],[0.11,0.385,0.236,0.13,0.03,0.02,hairD],[-0.11,0.385,0.236,0.13,0.03,0.02,hairD],[0,0.2,0.245,0.06,0.07,0.04,skinD],[0,0.13,0.236,0.1,0.025,0.02,E.skull?'#3a3228':'#6a3a2a']]:[[0,0.04,0,0.18,0.1,0.18,skin],[0,0.31,0,0.5,0.5,0.48,skin],
    [0.115,0.3,0.245,0.13,0.115,0.02,'#f8f6f0',0],[-0.115,0.3,0.245,0.13,0.115,0.02,'#f8f6f0',0],[0.105,0.293,0.257,0.075,0.095,0.02,eye,0],[-0.105,0.293,0.257,0.075,0.095,0.02,eye,0],
    [0.1,0.288,0.268,0.035,0.05,0.01,'#141414',0],[-0.1,0.288,0.268,0.035,0.05,0.01,'#141414',0],[0.084,0.318,0.274,0.026,0.026,0.01,'#ffffff',0],[-0.116,0.318,0.274,0.026,0.026,0.01,'#ffffff',0],
    [0.115,0.39,0.249,0.15,0.035,0.02,hairD,0],[-0.115,0.39,0.249,0.15,0.035,0.02,hairD,0],[0,0.215,0.256,0.07,0.085,0.04,skinD,0],[0,0.14,0.245,0.11,0.026,0.014,'#8a4a3a',0],
    [0.18,0.2,0.243,0.07,0.04,0.01,'#e8a090',0],[-0.18,0.2,0.243,0.07,0.04,0.01,'#e8a090',0],[0,0.09,0.238,0.22,0.03,0.01,skinD,0],[0.022,0.18,0.276,0.016,0.016,0.008,darker(skin,0.7),0],[-0.022,0.18,0.276,0.016,0.016,0.008,darker(skin,0.7),0],[0,0.158,0.247,0.08,0.012,0.01,darker(skin,0.8),0],[0,0.02,0.05,0.2,0.06,0.16,skinD,0]];
  if(E.skull&&E.pint){for(const sg of [-1,1])hl.push([sg*0.11,0.31,0.232,0.14,0.13,0.012,'#141414'])}
  if(E.skull&&!E.pint){for(const sg of [-1,1])hl.push([sg*0.115,0.3,0.247,0.14,0.13,0.02,'#141414',0],[sg*0.105,0.29,0.259,0.06,0.06,0.012,E.glow||'#ff5a2a',0]);hl.push([0,0.14,0.247,0.22,0.06,0.012,'#e8e2cc',0],[0,0.14,0.252,0.2,0.012,0.012,'#3a3228',0],[0,0.215,0.257,0.06,0.06,0.02,'#1a1a1a',0])}
  if(fem&&!E.pint)hl.push([0.115,0.364,0.257,0.15,0.018,0.012,'#1a1a1a',0],[-0.115,0.364,0.257,0.15,0.018,0.012,'#1a1a1a',0],[0,0.14,0.247,0.12,0.03,0.014,'#c0505a',0]);
  if(!E.ears&&E.hat!=='helm'&&E.hat!=='kaptur')hl.push([0.258,0.28,0,0.04,0.11,0.08,skinD,0],[-0.258,0.28,0,0.04,0.11,0.08,skinD,0]);
  const H=L.hair,hh=[];
  if(H!=='lysy'&&H!=='irokez')hh.push([0,0.585,0,0.54,0.1,0.52,hair],[0,0.42,-0.255,0.54,0.34,0.065,hair],[0.268,0.44,-0.03,0.05,0.24,0.44,hair,0],[-0.268,0.44,-0.03,0.05,0.24,0.44,hair,0],
    [0,0.535,0.25,0.52,0.08,0.05,hair,0],[0.13,0.482,0.262,0.1,0.075,0.03,hair,0],[-0.07,0.49,0.262,0.15,0.065,0.03,hair,0]);
  if(H==='lysy')hh.push([0.27,0.36,-0.04,0.03,0.12,0.36,hair,0],[-0.27,0.36,-0.04,0.03,0.12,0.36,hair,0],[0,0.36,-0.255,0.5,0.12,0.03,hair,0]);
  if(H==='dlugie')hh.push([0,0.2,-0.275,0.54,0.5,0.08,hair],[0.272,0.24,-0.08,0.06,0.4,0.3,hair,0],[-0.272,0.24,-0.08,0.06,0.4,0.3,hair,0]);
  if(H==='kucyk')hh.push([0,0.45,-0.3,0.14,0.14,0.08,hair],[0,0.26,-0.325,0.12,0.32,0.08,hair],[0,0.44,-0.33,0.15,0.04,0.02,'#c9a24a',0]);
  if(H==='warkocze')hh.push([0.245,0.13,0.05,0.09,0.44,0.09,hair],[-0.245,0.13,0.05,0.09,0.44,0.09,hair],[0.245,-0.11,0.05,0.1,0.05,0.1,'#c9a24a',0],[-0.245,-0.11,0.05,0.1,0.05,0.1,'#c9a24a',0]);
  if(H==='irokez')hh.push([0,0.62,0,0.12,0.16,0.5,hair]);
  if(H==='kok')hh.push([0,0.68,-0.12,0.2,0.16,0.2,hair],[0,0.63,-0.12,0.22,0.03,0.22,'#c9a24a',0]);
  if(H==='loki')for(const [x,y,z] of [[0.27,0.3,-0.1],[-0.27,0.3,-0.1],[0.2,0.2,-0.22],[-0.2,0.2,-0.22],[0,0.22,-0.28],[0.28,0.5,0.1],[-0.28,0.5,0.1],[0.15,0.64,0.1],[-0.15,0.64,-0.1]])hh.push([x,y,z,0.14,0.14,0.14,hair,0]);
  if(H==='grzywka')hh.push([0.05,0.47,0.265,0.42,0.13,0.04,hair,0],[0.2,0.4,0.265,0.12,0.08,0.03,hair,0]);
  if(H==='boki'){hh.length=0;hh.push([0,0.6,-0.02,0.24,0.12,0.5,hair],[0,0.44,-0.26,0.24,0.3,0.05,hair],[0.265,0.42,-0.04,0.03,0.2,0.4,hairD,0],[-0.265,0.42,-0.04,0.03,0.2,0.4,hairD,0])}
  const B=L.beard;
  if(B==='zarost')hl.push([0,0.15,0.236,0.42,0.14,0.016,hairD,0]);
  if(B==='krotka')hl.push([0,0.11,0.225,0.44,0.2,0.08,hair],[0.21,0.25,0.2,0.06,0.2,0.1,hair,0],[-0.21,0.25,0.2,0.06,0.2,0.1,hair,0]);
  if(B==='dluga')hl.push([0,0.06,0.225,0.44,0.3,0.08,hair],[0,-0.14,0.225,0.32,0.18,0.07,hair],[0,-0.27,0.215,0.18,0.1,0.06,hair],[0.21,0.25,0.2,0.06,0.2,0.1,hair,0],[-0.21,0.25,0.2,0.06,0.2,0.1,hair,0]);
  if(B==='bokobrody')hl.push([0.235,0.26,0.17,0.07,0.24,0.14,hair,0],[-0.235,0.26,0.17,0.07,0.24,0.14,hair,0],[0.2,0.14,0.2,0.1,0.08,0.1,hair,0],[-0.2,0.14,0.2,0.1,0.08,0.1,hair,0]);
  if(B==='kozia')hl.push([0,0.07,0.24,0.14,0.14,0.06,hair],[0,0.16,0.254,0.2,0.03,0.02,hairD,0]);
  if(B==='warkocz')hl.push([0,0.08,0.225,0.44,0.24,0.08,hair],[0,-0.12,0.23,0.12,0.2,0.08,hair],[0,-0.25,0.23,0.1,0.08,0.08,'#c9a24a',0],[0,-0.32,0.23,0.08,0.08,0.07,hair],[0.21,0.25,0.2,0.06,0.2,0.1,hair,0],[-0.21,0.25,0.2,0.06,0.2,0.1,hair,0]);
  if(B==='kozia'||B==='warkocz')hl.push([0.08,0.175,0.262,0.13,0.04,0.02,hair,0],[-0.08,0.175,0.262,0.13,0.04,0.02,hair,0]);
  if(!E.pint){if(L.brows===1)hl.push([0.115,0.415,0.252,0.17,0.05,0.02,hairD,0],[-0.115,0.415,0.252,0.17,0.05,0.02,hairD,0]);if(L.brows===2)hl.push([0.12,0.405,0.252,0.15,0.035,0.02,hairD,0],[-0.12,0.405,0.252,0.15,0.035,0.02,hairD,0],[0.06,0.39,0.253,0.05,0.03,0.02,hairD,0],[-0.06,0.39,0.253,0.05,0.03,0.02,hairD,0]);
    const pc=col(PAINTC,L.paintC||0);if(L.paint==='pasy')hl.push([0.12,0.27,0.248,0.16,0.035,0.012,pc,0],[-0.12,0.27,0.248,0.16,0.035,0.012,pc,0],[0.12,0.23,0.248,0.12,0.03,0.012,pc,0],[-0.12,0.23,0.248,0.12,0.03,0.012,pc,0]);
    if(L.paint==='maska')hl.push([0,0.31,0.247,0.48,0.12,0.01,pc,0]);if(L.paint==='kropki')for(const [x,y] of [[0.15,0.25],[0.2,0.22],[-0.15,0.25],[-0.2,0.22],[0,0.45]])hl.push([x,y,0.249,0.04,0.04,0.012,pc,0]);
    if(L.scar==='policzek')hl.push([-0.15,0.24,0.249,0.03,0.14,0.012,'#b0605a',0],[-0.15,0.24,0.25,0.09,0.02,0.012,'#b0605a',0]);if(L.scar==='oko')hl.push([0.115,0.33,0.252,0.03,0.24,0.012,'#b0605a',0]);
    if(L.patch)hl.push([-0.115,0.31,0.256,0.13,0.12,0.02,'#1a1a1a',0],[0,0.4,0.25,0.5,0.025,0.02,'#1a1a1a',0],[0.25,0.4,0,0.02,0.025,0.48,'#1a1a1a',0],[-0.25,0.4,0,0.02,0.025,0.48,'#1a1a1a',0]);
    if(L.ears==='elfie')hl.push([0.28,0.33,-0.01,0.05,0.14,0.08,skin,0],[-0.28,0.33,-0.01,0.05,0.14,0.08,skin,0],[0.31,0.43,-0.04,0.04,0.12,0.05,skin,0],[-0.31,0.43,-0.04,0.04,0.12,0.05,skin,0]);
    if(L.ears==='orcze')hl.push([0.29,0.32,-0.01,0.07,0.16,0.12,skin,0],[-0.29,0.32,-0.01,0.07,0.16,0.12,skin,0],[0.1,0.13,0.262,0.05,0.09,0.02,'#f2ead8',0],[-0.1,0.13,0.262,0.05,0.09,0.02,'#f2ead8',0]);
    const ac=col(ACCC,L.accC||0);if(L.acc==='kolczyki')hl.push([0.27,0.22,0.02,0.04,0.06,0.04,ac,0],[-0.27,0.22,0.02,0.04,0.06,0.04,ac,0]);if(L.acc==='opaska')hh.push([0,0.5,0,0.555,0.06,0.535,ac,0]);}
  if(B==='wasy'||B==='dluga')hl.push([0.08,0.175,0.262,0.13,0.04,0.02,hair,0],[-0.08,0.175,0.262,0.13,0.04,0.02,hair,0]);
  if(E.ears)for(const sg of [1,-1])hl.push([sg*0.275,0.31,0,0.05,0.15,0.13,skin,0],[sg*0.31,0.38,-0.04,0.05,0.13,0.11,skin,0],[sg*0.35,0.46,-0.08,0.045,0.12,0.09,skin,0],[sg*0.385,0.54,-0.12,0.04,0.1,0.07,skin,0],[sg*0.41,0.61,-0.15,0.035,0.07,0.05,skin,0],[sg*0.3,0.34,0.01,0.012,0.09,0.07,skinD,0]);
  if(E.tusks){hl.push([0,0.1,0.25,0.42,0.09,0.06,skinD,0],[0,0.415,0.258,0.44,0.05,0.035,skinD,0],[0,0.3,0.27,0.13,0.08,0.05,skinD,0]);for(const sg of [1,-1])hl.push([sg*0.12,0.17,0.285,0.06,0.15,0.05,'#f2ead8',0],[sg*0.13,0.25,0.29,0.045,0.06,0.04,'#e8dcc0',0],[sg*0.27,0.34,-0.02,0.05,0.12,0.1,skin,0],[sg*0.31,0.41,-0.05,0.04,0.09,0.07,skin,0])}
  if(E.hat==='kupiec')hl.push([0,0.62,0,0.62,0.07,0.62,'#a8452f'],[0,0.72,0,0.4,0.16,0.4,'#a8452f'],[0,0.67,0.21,0.42,0.05,0.04,'#d9b23a',0],[0.17,0.82,-0.06,0.04,0.22,0.04,'#f2efe6',0]);
  if(E.hat==='helm')hl.push([0,0.57,0,0.58,0.16,0.56,'#8a8f94'],[0,0.67,0,0.42,0.1,0.42,'#9aa0a6'],[0,0.4,0.29,0.07,0.24,0.04,'#8a8f94',0],[0.285,0.36,0.06,0.05,0.28,0.3,'#7f848a',0],[-0.285,0.36,0.06,0.05,0.28,0.3,'#7f848a',0],[0,0.75,0,0.06,0.08,0.4,'#a8352a',0]);
  if(E.hat==='kaptur')hl.push([0,0.6,-0.02,0.58,0.1,0.56,tunD],[0,0.38,-0.285,0.58,0.46,0.065,tunD],[0.29,0.38,-0.02,0.045,0.44,0.52,tunD,0],[-0.29,0.38,-0.02,0.045,0.44,0.52,tunD,0],[0,0.52,-0.34,0.18,0.18,0.08,tunD]);
  if(E.hat==='korona')hl.push([0,0.6,0,0.52,0.07,0.5,'#d9b23a'],[0.2,0.67,0.2,0.07,0.09,0.07,'#d9b23a',0],[-0.2,0.67,0.2,0.07,0.09,0.07,'#d9b23a',0],[0,0.67,0.23,0.07,0.09,0.05,'#d9b23a',0],[0,0.62,0.255,0.06,0.04,0.02,'#b8302a',0]);
  if(E.hat==='slomkowy')hl.push([0,0.6,0,0.8,0.05,0.8,'#d8b24a'],[0,0.68,0,0.44,0.12,0.44,'#c9a24a'],[0,0.635,0,0.46,0.04,0.46,'#a8452f',0]);
  if(E.hat==='nemes')hl.push([0,0.6,0,0.58,0.12,0.56,'#2f5f8f'],[0,0.6,0.005,0.6,0.04,0.58,'#d9b23a',0],[0.3,0.32,-0.02,0.06,0.52,0.42,'#2f5f8f'],[-0.3,0.32,-0.02,0.06,0.52,0.42,'#2f5f8f'],[0.3,0.32,0.0,0.07,0.04,0.44,'#d9b23a',0],[-0.3,0.32,0.0,0.07,0.04,0.44,'#d9b23a',0],[0,0.7,0.24,0.08,0.12,0.06,'#d9b23a',0]);
  if(E.hat==='chusta')hl.push([0,0.595,0,0.56,0.1,0.54,tunL],[0,0.44,-0.27,0.56,0.3,0.06,tunL],[0,0.3,-0.31,0.12,0.14,0.06,tunL,0]);
  if(E.hat&&E.hat!=='korona')hh.length=0;
  hl.push([0,0.03,0,0.27,0.14,0.25,skin],[0,0.0,0.06,0.22,0.06,0.16,skinD,0]);head.add(part(hl));if(hh.length){const hm=part(hh);hm.userData.hair=1;head.add(hm);head.userData.hairM=hm}torso.add(head);
  // ręce: bark -> łokieć -> dłoń z kciukiem
  const hand=E.gloves||skin;
  const arm=sg=>{const sh=new THREE.Group();sh.position.set(sg*0.385*bw,0.53,0);
    const ul=[[0,-0.13,0,0.205,0.3,0.225,tun],[0,-0.005,0,0.25,0.15,0.265,tunD],[0,0.04,0,0.22,0.06,0.24,tun]];if(E.armor)ul.push([0,0.03,0,0.27,0.13,0.28,E.armor]);sh.add(part(ul));
    const el=new THREE.Group();el.position.y=-0.28;el.add(part([[0,-0.1,0,0.16,0.22,0.18,tun],[0,-0.2,0,0.18,0.06,0.2,tunD],[0,-0.29,0.01,0.15,0.13,0.16,hand],[-sg*0.085,-0.27,0.06,0.05,0.07,0.06,hand,0],[0,-0.215,0,0.175,0.03,0.195,tunL,0],[0,-0.335,0.065,0.13,0.025,0.035,darker(hand,0.85),0],[0,-0.355,0.02,0.14,0.03,0.12,hand,0]]));sh.add(el);torso.add(sh);return[sh,el]};
  const [ra,re]=arm(1),[la,le]=arm(-1);
  // peleryna
  let cape=null;if(L.cape){const cc=col(CLOTHC,L.capeC),cs=L.cape;cape=new THREE.Group();cape.position.set(0,0.58,-0.17);
    if(cs===3)cape.add(part([[0,-0.22,-0.02,0.62*bw,0.44,0.045,cc],[0,-0.44,-0.02,0.64*bw,0.05,0.05,darker(cc,0.7)],[0,0,-0.01,0.66*bw,0.12,0.12,darker(cc,0.75)],[0.2,0.0,0.06,0.07,0.07,0.04,'#c4ccd2',0]]));
    else if(cs===2)cape.add(part([[0,-0.5,-0.03,0.66*bw,1.0,0.05,cc],[0,-1.0,-0.03,0.68*bw,0.05,0.06,darker(cc,0.7)],[0,0.02,-0.01,0.6*bw,0.1,0.12,darker(cc,0.8)],[0,0.1,-0.06,0.44,0.22,0.1,darker(cc,0.85)],[0.2,0.0,0.06,0.07,0.07,0.04,'#d9b23a',0],[-0.2,0.0,0.06,0.07,0.07,0.04,'#d9b23a',0]]));
    else cape.add(part([[0,-0.44,-0.02,0.6*bw,0.88,0.045,cc],[0,-0.86,-0.02,0.62*bw,0.05,0.05,darker(cc,0.7)],[0,0,-0.01,0.62*bw,0.09,0.09,darker(cc,0.75)],[0.2,0.0,0.06,0.07,0.07,0.04,'#d9b23a',0]]));torso.add(cape)}
  g.add(ll,rl,torso);
  g.userData={ll,rl,la,ra,le,re,torso,head,cape,phase:0,look:L};if(L.ht!==1&&L.ht!=null)g.scale.setScalar([0.92,1,1.08][L.ht]||1);
  return g;
}
// ---------- chód / bieg / pływanie ----------
function wmPivot(m,th,dz){m.rotation.x=th;m.position.set(0,-0.3+0.3*Math.cos(th),0.3*Math.sin(th)+(dz||0))}// obrót broni wokół dłoni (y=-0.3)
function animChar(g,speed,dt,air,swim){animChar0(g,speed,dt,air,swim);const u=g.userData;
  // postawa gotowości z bronią dwuręczną: obie dłonie przy środku tułowia, broń skośnie w górę
  if(u.two&&u.wm&&!swim&&!air&&u.ra&&u.re){u.rdy=Math.min(1,(u.rdy||0)+dt*5);const k=u.rdy,s=Math.sin(u.phase||0)*Math.min(1,speed/6)*0.12,L=(a,b)=>a+(b-a)*k;u.ra.rotation.set(L(u.ra.rotation.x,-0.55+s),L(u.ra.rotation.y,0.1),L(u.ra.rotation.z,-0.95));u.re.rotation.x=L(u.re.rotation.x,-0.15)}else if(u.rdy)u.rdy=0}
function animChar0(g,speed,dt,air,swim){
  {const u0=g.userData;if(u0._kb){u0._kb=0;u0.ikOff=false;if(u0.wm)wmPivot(u0.wm,u0.wm.rotation.x*0.4,0)}else if(u0.wm&&u0.wm.rotation.x){const r=u0.wm.rotation.x*0.7;wmPivot(u0.wm,Math.abs(r)<0.01?0:r,0)}}
  const u=g.userData,k=Math.min(1,dt*14),R=(o,x,y,z)=>{if(!o)return;o.rotation.x+=(x-o.rotation.x)*k;o.rotation.y+=((y||0)-o.rotation.y)*k;o.rotation.z+=((z||0)-o.rotation.z)*k};
  const run=Math.min(1,Math.max(0,(speed-3.5)/4));u.phase+=dt*(speed>0.3?(2.4+speed*1.15):1.2);
  const s=Math.sin(u.phase),c=Math.cos(u.phase);
  if(swim){const a=Math.sin(u.phase*0.6);R(u.la,-2.4+a*0.5,0,-0.3);R(u.ra,-2.4-a*0.5,0,0.3);R(u.ll,a*0.6);R(u.rl,-a*0.6);R(u.torso,0.55,0,0);R(u.le,-0.3);R(u.re,-0.3);u.torso.position.y=0.74;if(u.cape)u.cape.rotation.x=0.3;return}
  if(air){u.wasAir=1;const vy=u.vy??-1;
    if(vy>1.5){R(u.la,-2.3,0,-0.3);R(u.ra,-2.0,0,0.3);R(u.ll,-1.05);R(u.rl,0.45);R(u.le,-0.45);R(u.re,-0.6);R(u.torso,0.14,0,0)}
    else{R(u.la,-0.8,0,-0.95);R(u.ra,-0.8,0,0.95);R(u.ll,-0.45);R(u.rl,-0.1);R(u.le,-0.5);R(u.re,-0.5);R(u.torso,-0.06,0,0)}
    u.torso.position.y+=(0.74-u.torso.position.y)*k;if(u.cape)u.cape.rotation.x+=((vy>0?0.2:0.9)-u.cape.rotation.x)*k;if(u.head)R(u.head,vy>0?-0.1:0.15,0,0);return}
  if(u.wasAir){u.wasAir=0;u.land=0.2}
  let dip=0;if(u.land>0){u.land-=dt;dip=Math.sin(Math.max(0,u.land)/0.2*Math.PI)*0.1}
  if(speed>0.3){const legA=0.5+run*0.55,armA=0.35+run*0.6;
    R(u.ll,-s*legA);R(u.rl,s*legA);R(u.la,s*armA,0,-0.07-run*0.06);R(u.ra,-s*armA,0,0.07+run*0.06);
    R(u.le,-0.15-run*1.0-Math.max(0,s)*0.25*run);R(u.re,-0.15-run*1.0-Math.max(0,-s)*0.25*run);
    u.torso.position.y=0.74+Math.abs(c)*(0.025+run*0.055)-dip;R(u.torso,0.03+run*0.22,s*(0.05+run*0.07),-c*0.02*(1-run));if(u.head)R(u.head,-run*0.14,-s*0.04,0)}
  else{const b=Math.sin(u.phase*1.4);R(u.ll,0);R(u.rl,0);R(u.la,b*0.03,0,-0.08);R(u.ra,-b*0.03,0,0.08);R(u.le,-0.16-dip);R(u.re,-0.16-dip);u.torso.position.y=0.74+b*0.008-dip;R(u.torso,dip*1.5,0,0);if(u.head)R(u.head,Math.sin(u.phase*0.37)*0.03,Math.sin(u.phase*0.21)*0.12,0)}
  if(u.cape)u.cape.rotation.x+=((0.12+run*0.5+Math.sin(u.phase*0.8)*0.05)-u.cape.rotation.x)*k;
}
// ---------- walka ----------
const ease=t=>t<0?0:t>1?1:t*t*(3-2*t);
const L3=(a,b,t)=>a+(b-a)*t;
function weaponKind(base){return base==='luk'?'bow':base==='kostur'||base==='kusza'||base==='rozdzka'?'staff':base==='sztylet'?'dagger':base?'melee':'fist'}
// k: 0..1 postęp ataku; combo 0,1,2
function animCombat(g,kind,combo,k){
  const u=g.userData,T=u.torso;
  if(kind==='melee'||kind==='fist'){
    let shx,shz,elx,ty,tx,lunge=0;
    if(combo===2){const w=ease(k/0.4),st=ease((k-0.4)/0.25),rc=ease((k-0.7)/0.3);
      shx=L3(L3(0,-2.9,w),-0.5,st);elx=L3(L3(-0.2,-1.3,w),-0.1,st);shz=0.15;tx=L3(L3(0,-0.18,w),0.35,st);ty=0;lunge=st;
      shx=L3(shx,-0.1,rc);elx=L3(elx,-0.2,rc);tx=L3(tx,0,rc);lunge*=1-rc;T.position.y=0.74+Math.sin(Math.min(1,k/0.65)*Math.PI)*0.12}
    else{const sg=combo===0?1:-1,w=ease(k/0.35),st=ease((k-0.35)/0.3),rc=ease((k-0.72)/0.28);
      shx=L3(L3(0,-1.45,w),-1.5,st);shz=L3(L3(0,sg>0?1.15:-0.55,w),sg>0?-0.65:1.2,st);elx=L3(L3(-0.2,-0.7,w),-0.08,st);ty=L3(L3(0,sg>0?-0.55:0.5,w),sg>0?0.65:-0.6,st);tx=0.08;lunge=st;
      shx=L3(shx,-0.1,rc);shz=L3(shz,0.05,rc);elx=L3(elx,-0.2,rc);ty=L3(ty,0,rc);lunge*=1-rc}
    u.ra.rotation.set(shx,0,shz);u.re.rotation.x=elx;T.rotation.set(tx,ty,0);u.la.rotation.set(-0.4-lunge*0.4,0,-0.25);u.le.rotation.x=-0.9;
    u.ll.rotation.x=-0.45*lunge;u.rl.rotation.x=0.35*lunge;return}
  if(kind==='dagger'){const R=combo%2===0,a=R?u.ra:u.la,e=R?u.re:u.le,o=R?u.la:u.ra,oe=R?u.le:u.re,w=ease(k/0.3),st=ease((k-0.3)/0.25),rc=ease((k-0.6)/0.4);
    a.rotation.set(L3(L3(-0.3,-1.2,w),-1.65,st)*(1-rc)+(-0.2)*rc,0,(R?0.1:-0.1));e.rotation.x=L3(L3(-0.4,-1.6,w),0,st)*(1-rc)+(-0.3)*rc;o.rotation.set(-0.9,0,R?-0.2:0.2);oe.rotation.x=-1.3;T.rotation.set(0.1,(R?-0.35:0.35)*st*(1-rc),0);return}
  if(kind==='staff'&&u.wkey&&u.wkey.startsWith('kusza')){const up=ease(k/0.18),fire=k>=0.42?Math.exp(-(k-0.42)*26):0,rl=k>0.55?Math.sin(Math.min(1,(k-0.55)/0.4)*Math.PI):0,sw=k<0.42?Math.sin(k*38)*0.012:0;
    u.ra.rotation.set(L3(-0.2,-1.52,up)-fire*0.38+rl*0.95+sw,0,L3(0.05,0.2,up)-rl*0.12);u.re.rotation.x=L3(-0.2,-0.12,up)-rl*1.65;
    u.la.rotation.set(L3(-0.3,-1.44,up)-fire*0.32+rl*0.5-sw,0,L3(-0.1,-0.42,up)+rl*0.22);u.le.rotation.x=L3(-0.4,-0.48,up)-rl*0.45;
    u._kb=1;u.ikOff=rl>0.08;if(u.wm)wmPivot(u.wm,L3(0,1.5,up)+fire*0.3-rl*1.05,-fire*0.06)
    T.rotation.set(-fire*0.13+rl*0.22,L3(0,0.17,up)*(1-rl*0.6),fire*0.03);if(u.head)u.head.rotation.set(0.07*up-fire*0.09+rl*0.16,-0.15*up*(1-rl),0);u.ll.rotation.x=-0.18*up-rl*0.22;u.rl.rotation.x=0.14*up+fire*0.1;return}
  if(kind==='staff'){const wand=u.wkey&&u.wkey.startsWith('rozdzka');
    if(wand){// różdżka: zakręcenie nadgarstkiem, energiczne pchnięcie w cel, druga dłoń prowadzi gest
      const w=ease(k/0.3),st=ease((k-0.3)/0.16),rc=ease((k-0.62)/0.38),ci=Math.sin(Math.min(1,k/0.3)*Math.PI*2)*0.25*(1-st);
      u.ra.rotation.set(L3(L3(-0.2,-2.05,w),-1.5,st)*(1-rc)-0.2*rc,ci,L3(L3(0.05,0.45,w),-0.08,st)*(1-rc));u.re.rotation.x=L3(L3(-0.3,-1.25,w),-0.05,st)*(1-rc)-0.3*rc;
      u.la.rotation.set(L3(L3(-0.2,-0.9,w),-0.35,st)*(1-rc),0,L3(-0.2,-0.55,w)*(1-rc));u.le.rotation.x=L3(-0.6,-1.2,w)*(1-rc);T.rotation.set(0.04,L3(L3(0,0.22,w),-0.18,st)*(1-rc),0);return}
    // kostur: oba chwyty, uniesienie nad głowę ze skrętem tułowia, mocne pchnięcie z wykrokiem, powrót
    const w=ease(k/0.36),st=ease((k-0.36)/0.18),rc=ease((k-0.6)/0.4);
    u.ra.rotation.set(L3(L3(-0.3,-2.5,w),-1.25,st)*(1-rc)-0.25*rc,0,L3(L3(0.1,-0.25,w),0.05,st)*(1-rc)+0.1*rc);u.re.rotation.x=L3(L3(-0.3,-0.5,w),-0.08,st)*(1-rc)-0.3*rc;
    u.la.rotation.set(L3(L3(-0.3,-2.2,w),-1.45,st)*(1-rc)-0.2*rc,0,L3(L3(-0.2,0.55,w),0.35,st)*(1-rc));u.le.rotation.x=L3(L3(-0.5,-0.7,w),-0.15,st)*(1-rc)-0.5*rc;
    T.rotation.set(L3(L3(0.04,-0.12,w),0.14,st)*(1-rc),L3(L3(0,0.38,w),-0.22,st)*(1-rc),0);u.ll.rotation.x=-0.35*st*(1-rc);u.rl.rotation.x=0.28*st*(1-rc);return}
  if(kind==='bow'){
    // 0-0,25 sięga do kołczanu, 0,25-0,45 nakłada strzałę, 0,45-0,9 naciąga, 0,9+ zwolnienie
    T.rotation.set(0.04,0.45*ease(k/0.3),0);
    u.la.rotation.set(L3(-0.3,-1.52,ease((k-0.15)/0.3)),0,-0.12);u.le.rotation.x=L3(-0.4,0,ease((k-0.15)/0.3));
    if(k<0.25){const s=ease(k/0.25);u.ra.rotation.set(-2.85*s,0,-0.35*s);u.re.rotation.x=-1.5*s}
    else if(k<0.45){const s=ease((k-0.25)/0.2);u.ra.rotation.set(L3(-2.85,-1.5,s),0,L3(-0.35,-0.25,s));u.re.rotation.x=L3(-1.5,-1.0,s)}
    else if(k<0.9){const s=ease((k-0.45)/0.45);u.ra.rotation.set(-1.5,0,L3(-0.25,0.25,s));u.re.rotation.x=L3(-1.0,-2.45,s)}
    else{const s=ease((k-0.9)/0.1);u.ra.rotation.set(-1.4,0,L3(0.25,0.75,s));u.re.rotation.x=L3(-2.45,-0.6,s)}
    {const tw=ease(k/0.3)*(k>0.9?1-ease((k-0.9)/0.1)*0.4:1);T.rotation.y=0.75*tw;if(u.head)u.head.rotation.set(0,-0.6*tw,0);u.ll.rotation.x=-0.28*tw;u.rl.rotation.x=0.22*tw;if(k>0.9){const s=ease((k-0.9)/0.1);u.la.rotation.x=-1.52+0.15*s;T.rotation.x=0.04-0.05*s}}
    {const dr=k<0.45?0:k<0.9?ease((k-0.45)/0.45):0;bowDraw(g,dr,k>=0.25&&k<0.9);if(k>=0.4&&k<0.9){u.bowIK={d:dr,arrow:true};BOWSET.add(g)}else if(k>=0.9&&k<0.97){u.bowIK={d:0,arrow:false};BOWSET.add(g)}}return}
}
function resetCombat(g){const u=g.userData;if(u.torso){u.torso.rotation.set(0,0,0);u.torso.position.y=0.74}bowDraw(g,0,false)}
// ---------- broń, łuk, kołczan, strzała na cięciwie ----------
const WMET=['#aeb6bd','#c4ccd2','#c8d4e2','#cfc4e6','#f0d890'],WRUNE=[null,null,null,'#7fe3ff','#ffb030'];
function weaponGeo(base,rar,vr,lk,all,sd){const L=weaponV(base,rar,vr,lk,sd);if(!L)return weaponGeoOld(base,rar);if(all)return boxes(L);const N=L.filter(b=>b[6][0]!=='!'),G=L.filter(b=>b[6][0]==='!');const g=boxes(N);if(G.length)g.userData.glowGeo=boxes(G);return g}
const WLK=[{},{lea:'#6a1414',leal:'#c8302a',wood:'#5a1a14',woodd:'#3a0e0a',woodl:'#7a2a1a',fit:'#2a2a30',pom:'disc',guard:'disc',tas:'#c8302a'},{lea:'#4a3a2a',leal:'#e8e0c8',wood:'#3a2a1c',woodd:'#2a1c12',woodl:'#4a3a2a',fit:'#5e5e64',pom:'ball',guard:'none',serr:1,spike:1},{lea:'#1a2a5a',leal:'#c9a24a',wood:'#4a3020',woodd:'#2a1c12',woodl:'#5a3a22',fit:'#c9a24a',pom:'scent',guard:'fin',band:1},{lea:'#2a5a3a',leal:'#d8e8d0',wood:'#d8d0b8',woodd:'#b8b098',woodl:'#e8e0c8',fit:'#c8d0d8',pom:'disc',guard:'down',leaf:1},
 {fx:'demon',met:'#2e262c',edge:'#8a1a1a',glow:'#ff3030',lea:'#1a1014',leal:'#5a1a1a',wood:'#1e1418',woodd:'#120a0e',woodl:'#2a1c20',fit:'#3a2a30',pom:'ball',guard:'down'},
 {fx:'crystal',met:'#8fd8f0',edge:'#d8f8ff',glow:'#c8f8ff',lea:'#2a4a6a',leal:'#c8e8f8',wood:'#c8d8e0',woodd:'#a8b8c0',woodl:'#e0eef4',fit:'#e0e8f0',pom:'scent',guard:'fin'},
 {fx:'flame',met:'#8a3010',edge:'#ff8a20',glow:'#ffb030',lea:'#3a1a0a',leal:'#c8501a',wood:'#3a1a10',woodd:'#2a1008',woodl:'#5a2a14',fit:'#d9a030',pom:'disc',guard:'down'},
 {fx:'ice',met:'#b8dcee',edge:'#ffffff',glow:'#e0f8ff',lea:'#2a4a6a',leal:'#e8f4ff',wood:'#9ab8c8',woodd:'#7a98a8',woodl:'#c8e0ec',fit:'#e8f4ff',pom:'ball',guard:'fin'},
 {fx:'arcane',met:'#3a2a5a',edge:'#8a6ac8',glow:'#c890ff',lea:'#1a1030',leal:'#6a4aa8',wood:'#2a1e3a',woodd:'#1a1228',woodl:'#3a2a50',fit:'#d9b23a',pom:'scent',guard:'fin'}];
const VLEA=['#3a2414','#5a2a10','#2a2a30','#4a3a20','#3a1a1a','#2a3a2a'],VFIT=['#5a5a62','#a8743a','#c8ccd4','#3a3a40','#8a6a3a'];
function weaponV(base,rar,vr,lk,sd){const V=(WEAPV[base]||[]).find(v=>v[0]===vr);if(!V)return null;let SL=WLK[lk||0]||{};const VR=sd?mulb(sd):null;if(VR){SL=Object.assign({},SL);if(!SL.lea){SL.lea=VLEA[Math.floor(VR()*VLEA.length)];SL.leal=darker(SL.lea,1.5)}else VR();if(!SL.fit&&rar<4)SL.fit=VFIT[Math.floor(VR()*VFIT.length)];else VR();if(!SL.wood&&VR()<0.5){const wb=['#5a3a20','#7a5232','#4a2a18','#8a6a44'][Math.floor(VR()*4)];SL.wood=wb;SL.woodd=darker(wb,0.7);SL.woodl=darker(wb,1.25)}}
  const c=RAR[rar].c,y=-0.3,M=SL.met||WMET[rar],MD=darker(M,0.72),ML=SL.edge||darker(M,1.18),MF=darker(M,0.86),GW='!'+(SL.glow||'#ffffff'),RU=WRUNE[rar],GOLD='#d9b23a',GOLDD='#a8822a',
    WOOD=SL.wood||'#6b4a2b',WOODD=SL.woodd||'#4a2f1d',WOODL=SL.woodl||'#8a6238',LEA=SL.lea||(rar>=4?'#5a2a10':'#3a2414'),LEAL=SL.leal||(rar>=4?'#7a3a18':'#5a3a22'),FIT=rar>=4?GOLD:SL.fit||(rar>=2?'#8a8f96':'#5a5a62'),FITD=darker(FIT,0.75),L=[],P=(x,yy,z,w,h,d,col)=>L.push([x,yy,z,w,h,d,col]),len=(V[4]||1)*(VR?0.9+VR()*0.2:1),wv=VR?0.88+VR()*0.26:1;
  const SR=sd?mulb(sd*31+7):null,SH=SR?{bs:Math.floor(SR()*7),gs:['straight','up','down','disc','ring','swept'][Math.floor(SR()*6)],ps:['ball','disc','scent','spike','ring','crescent'][Math.floor(SR()*6)],ax:Math.floor(SR()*6),hm:Math.floor(SR()*5),sp:Math.floor(SR()*6),fl:[4,6,8][Math.floor(SR()*3)],st:Math.floor(SR()*5),cv:0.6+SR()*0.9,hb:Math.floor(SR()*4),cb:Math.floor(SR()*3)}:null;
  // --- wspólne części ---
  const grip=(z0,gl,gw)=>{P(0,y,z0+gl/2,gw,gw,gl,LEA);const n=Math.max(2,Math.round(gl/0.05));for(let i=0;i<n;i++)P(0,y,z0+(i+0.5)*gl/n,gw+0.012,gw+0.012,gl/n*0.4,LEAL)};
  const pommel=(z,s,kind)=>{if(SH&&!SL.pom)kind=SH.ps;if(kind==='spike'){P(0,y,z,s*0.8,s*0.8,s*0.6,FIT);P(0,y,z-s*0.5,s*0.5,s*0.5,s*0.4,FITD);P(0,y,z-s*0.85,s*0.25,s*0.25,s*0.3,FIT);if(rar>=2)P(0,y,z,s*0.3,s*0.86,s*0.3,c);return}if(kind==='ring'){for(const [a,b] of [[0,1],[0,-1]])P(0,y+b*s*0.4,z-s*0.3,s*0.3,s*0.25,s*0.9,FIT);P(0,y,z-s*0.75,s*0.3,s*1.05,s*0.25,FIT);P(0,y,z+0.0,s*0.6,s*0.6,s*0.3,FITD);return}if(kind==='crescent'){P(0,y,z,s*0.6,s*0.6,s*0.5,FIT);for(const b of [1,-1]){P(0,y+b*s*0.45,z-s*0.25,s*0.5,s*0.35,s*0.45,FIT);P(0,y+b*s*0.65,z-s*0.05,s*0.35,s*0.25,s*0.3,FITD)}return}if(kind==='disc'){P(0,y,z,s*0.55,s,s,FIT);P(0,y,z,s*0.62,s*0.7,s*0.7,FITD)}else if(kind==='scent'){P(0,y,z,s,s,s*0.7,FIT);P(0,y,z-s*0.45,s*0.6,s*0.6,s*0.3,FITD)}else{P(0,y,z,s,s,s,FIT);P(0,y,z,s*1.1,s*0.6,s*0.6,FITD);P(0,y,z-s*0.55,s*0.4,s*0.4,s*0.2,FIT)}if(rar>=2)P(0,y,z,s*0.4,s*1.06,s*0.4,c)};
  const blade=(z0,bl,w,t,o={})=>{const bs=SH?SH.bs:0;if(bs===3)o=Object.assign({},o,{clip:1});if(bs===6)w*=0.78;const body=bl*(o.tip??(bs===2?0.88:0.8)),tl=bl-body;
    if(bs===4){const n=8;for(let i=0;i<n;i++)P((i%2?1:-1)*w*0.12,y,z0+(i+0.5)*body/n,w*(i%2?0.9:1.05),t,body/n+0.004,M)}else P(0,y,z0+body/2,w,t,body,M);
    if(bs===1){P(0,y,z0+body*0.6,w*1.35,t*0.9,body*0.36,M);P(w*0.66,y,z0+body*0.6,0.016,t*0.6,body*0.32,ML);P(-w*0.66,y,z0+body*0.6,0.016,t*0.6,body*0.32,ML)}
    if(bs===2){P(0,y,z0+body*0.82,w*1.3,t*0.9,body*0.28,M);P(w*0.64,y,z0+body*0.82,0.016,t*0.6,body*0.26,ML);P(-w*0.64,y,z0+body*0.82,0.016,t*0.6,body*0.26,ML)}
    if(bs===5)for(let k=0;k<3;k++)P(-w/2+0.006,y,z0+0.06+k*0.07,0.02,t*1.1,0.035,MD);
    if(bs===6)for(const s of [1,-1])P(s*w*0.22,y,z0+body*0.42,w*0.08,t+0.008,body*0.66,MD);                                   // płaz
    P(w/2-0.008,y,z0+body/2,0.016,t*0.6,body,ML);P(-w/2+0.008,y,z0+body/2,0.016,t*0.6,body,ML);   // zbrocze krawędzi
    if(!o.nofuller){P(0,y,z0+body*0.42,w*0.24,t+0.006,body*0.7,MF);P(0,y,z0+body*0.42,w*0.1,t+0.01,body*0.66,MD)}   // zbrocze środkowe
    const st=o.steps||4;for(let k=0;k<st;k++){const f=1-(k+1)/(st+1);P(o.clip&&k<2?w*0.12:0,y,z0+body+tl*(k+0.5)/st,w*f,t*(0.6+0.4*f),tl/st+0.002,k===st-1?ML:M)}
    if(SL.serr)for(let z=z0+0.06;z<z0+body-0.02;z+=0.075){P(w/2+0.012,y,z,0.026,t*0.55,0.035,MD);P(-w/2-0.012,y,z+0.035,0.026,t*0.55,0.035,MD)}
    if(SL.leaf){P(0,y,z0+body*0.62,w*1.4,t*0.85,body*0.32,M);P(w*0.7-0.01,y,z0+body*0.62,0.018,t*0.6,body*0.3,ML);P(-w*0.7+0.01,y,z0+body*0.62,0.018,t*0.6,body*0.3,ML);P(0,y,z0+body*0.62,w*0.3,t+0.012,body*0.28,'#d9b23a')}
    if(SL.band)P(0,y,z0+body*0.35,w*0.14,t+0.016,body*0.5,'#d9b23a');
    if(SL.fx==='demon'){for(let z=z0+0.1;z<z0+body-0.05;z+=0.14)for(const s of [1,-1]){P(s*(w/2+0.03),y,z,0.06,t*0.6,0.05,MD);P(s*(w/2+0.06),y,z+0.03,0.03,t*0.5,0.04,ML)}for(let k=0;k<4;k++)P(0,y,z0+body*(0.15+k*0.2),w*0.18,t+0.016,body*0.1,GW)}
    if(SL.fx==='crystal'){P(0,y,z0+body*0.45,w*0.3,t+0.012,body*0.85,GW);for(const s of [1,-1])P(s*(w/2+0.02),y,z0+0.06,0.04,0.06,0.1,ML)}
    if(SL.fx==='flame'){P(0,y,z0+body*0.45,w*0.2,t+0.012,body*0.8,GW);for(let z=z0+0.05,i=0;z<z0+body;z+=0.09,i++)for(const s of [1,-1])P(s*(w/2+0.02),y,z+(i%2)*0.04,0.035,t*0.5,0.06,i%2?GW:'!#ffe080')}
    if(SL.fx==='ice'){P(0,y,z0+body*0.45,w*0.2,t+0.012,body*0.8,GW);for(let z=z0+0.12;z<z0+body-0.05;z+=0.16)for(const s of [1,-1]){P(s*(w/2+0.025),y,z,0.05,t*0.5,0.03,'#ffffff');P(s*(w/2+0.055),y,z+0.02,0.025,t*0.4,0.02,'#e0f4ff')}}
    if(SL.fx==='arcane'){for(let k=0;k<5;k++)P(0,y,z0+body*(0.12+k*0.17),w*(k%2?0.3:0.16),t+0.016,body*0.06,GW);P(0,y,z0+bl+0.12,0.06,0.06,0.06,GW);P(0,y,z0+bl+0.12,0.08,0.03,0.03,'!#e8d0ff')}
    if(RU)for(let k=0;k<4;k++)P(0,y,z0+body*(0.2+k*0.16),w*0.12,t+0.014,body*0.08,RU)};
  const adorn=(z,hw)=>{hw=hw||0.07;if(SL.tas){P(0,y-hw/2-0.02,z-0.1,0.025,0.1,0.025,SL.tas);P(0,y-hw/2-0.06,z-0.16,0.05,0.06,0.05,SL.tas);P(0,y-hw/2-0.06,z-0.21,0.035,0.06,0.035,'#e05040')}
    if(SL.spike){P(0,y,z+0.12,0.035,0.035,0.08,MD);P(0,y,z+0.18,0.02,0.02,0.05,ML);for(const s of [1,-1])P(s*(hw/2+0.03),y,z-0.25,0.04,0.025,0.025,'#e8e0c8')}
    if(SL.band)for(const dz of [-0.3,-0.55])P(0,y,z+dz,hw+0.02,hw+0.02,0.03,'#d9b23a');
    if(SL.leaf)for(const s of [1,-1]){P(s*(hw/2+0.03),y,z-0.2,0.012,0.05,0.09,'#5a9a4a');P(s*(hw/2+0.04),y+0.02,z-0.26,0.01,0.04,0.05,'#86c060')}
    if(SL.fx){for(const dz of [-0.18,-0.42])P(0,y,z+dz,hw+0.024,hw+0.024,0.028,GW);
      if(SL.fx==='demon'){for(const s of [1,-1]){P(s*(hw/2+0.04),y,z-0.08,0.06,0.03,0.03,MD);P(s*(hw/2+0.08),y,z-0.04,0.03,0.03,0.05,ML)}P(0,y,z+0.14,0.04,0.04,0.1,MD);P(0,y,z+0.2,0.02,0.02,0.05,ML)}
      if(SL.fx==='crystal'||SL.fx==='ice'){P(0,y,z+0.16,0.07,0.07,0.12,GW);P(0.03,y+0.02,z+0.12,0.04,0.04,0.08,ML);P(-0.03,y-0.02,z+0.13,0.035,0.035,0.07,ML)}
      if(SL.fx==='flame'){for(let k=0;k<3;k++)P((k-1)*0.03,y,z+0.12+(k%2)*0.04,0.03,0.03,0.08,k%2?GW:'!#ffe080')}
      if(SL.fx==='arcane'){P(0,y+0.14,z+0.08,0.05,0.05,0.05,GW);P(0,y-0.14,z-0.02,0.04,0.04,0.04,GW);P(0.14,y,z+0.03,0.04,0.04,0.04,'!#e8d0ff')}}};
  const guard=(z,w,kind)=>{if(SH&&!SL.guard&&kind!=='none')kind=SH.gs;
    if(kind==='disc'){P(0,y,z,w*0.6,w*0.6,0.04,FIT);P(0,y,z,w*0.45,w*0.45,0.05,FITD);if(rar>=3)P(0,y,z,0.05,0.12,0.05,c);return}
    if(kind==='ring'){P(0,y,z,w,0.06,0.05,FIT);for(const s of [1,-1]){P(s*(w/2+0.02),y,z+0.03,0.03,0.1,0.03,FIT);P(s*(w/2+0.02),y,z+0.1,0.03,0.03,0.08,FITD)}P(0,y,z,w*0.4,0.1,0.08,FITD);return}
    if(kind==='swept'){P(0,y,z,w,0.06,0.05,FIT);for(const s of [1,-1]){P(s*(w/2+0.01),y,z-0.05,0.04,0.05,0.1,FIT);P(s*(w/2-0.02),y,z-0.13,0.035,0.045,0.06,FITD)}P(w*0.18,y,z-0.11,0.03,0.04,0.2,FIT);P(0,y,z,w*0.4,0.1,0.08,FITD);return}
    if(kind==='up'){P(0,y,z,w*0.85,0.07,0.06,FIT);for(const s of [1,-1]){P(s*(w*0.45),y,z+0.05,0.05,0.06,0.08,FIT);P(s*(w*0.48),y,z+0.11,0.04,0.05,0.06,FITD)}P(0,y,z,w*0.4,0.1,0.08,FITD);return}
    P(0,y,z,w,0.07,0.06,FIT);P(0,y,z,w*0.4,0.1,0.08,FITD);
    if(kind==='down')for(const s of [1,-1]){P(s*(w/2+0.02),y,z+0.04,0.05,0.06,0.08,FIT);P(s*(w/2+0.03),y,z+0.09,0.04,0.05,0.05,FITD)}
    if(kind==='fin')for(const s of [1,-1])P(s*(w/2+0.03),y,z,0.07,0.09,0.09,FITD);
    if(rar>=3)P(0,y,z,0.05,0.12,0.05,c)};
  const haft=(z0,hl,hw,col)=>{P(0,y,z0+hl/2,hw,hw,hl,col||WOOD);P(hw*0.3,y,z0+hl/2,hw*0.25,hw+0.004,hl*0.98,WOODD)};
  const wraps=(z0,zl,hw)=>{for(let i=0;i<3;i++)P(0,y,z0+i*zl/3,hw+0.014,hw+0.014,zl/6,LEA)};
  // --- miecze ---
  if(base==='miecz'){
    const S={krotki:[0.64,0.1,0.2,0.26,'none','disc'],dlugi:[0.98,0.088,0.22,0.36,'down','scent'],poltora:[1.08,0.098,0.32,0.44,'fin','scent'],tasak:[0.74,0.17,0.2,0.24,'none','disc']}[vr];
    const [bl0,bw0,gl,gw0,gk0,pk0]=S,bw=bw0*wv,gw=gw0*(VR?0.85+VR()*0.35:1),gk=SL.guard||gk0,pk=SL.pom||pk0,bl=bl0*len;grip(-gl*0.35,gl,0.065);pommel(-gl*0.35-0.04,0.09,pk);guard(gl*0.65+0.03,gk==='disc'?gw*0.55:gw,gk==='disc'?'none':gk);if(gk==='disc'){P(0,y,gl*0.65+0.03,0.16,0.16,0.04,FIT);P(0,y,gl*0.65+0.03,0.12,0.12,0.05,darker(FIT,0.75))}
    P(0,y,gl*0.65+0.09,bw*0.85,0.04,0.06,MD);   // ricasso
    if(vr==='tasak'){P(0,y,gl*0.65+0.12+bl*0.45,bw,0.035,bl*0.9,M);P(-bw/2+0.01,y,gl*0.65+0.12+bl*0.45,0.02,0.025,bl*0.9,ML);P(0.03,y,gl*0.65+0.12+bl*0.94,bw*0.65,0.035,bl*0.1,M);P(bw*0.2,y,gl*0.65+0.12+bl*0.45,0.025,0.04,0.025,MD)}
    else blade(gl*0.65+0.12,bl,bw,0.035);
    if(rar>=4)P(0,y,gl*0.65+0.03,gw*0.6,0.03,0.07,GOLD)}
  // --- topory ---
  else if(base==='topor'){const hl={toporek:0.7,bojowy:0.92,brodaty:0.98,dwureczny:1.3}[vr]*len,zh=hl*0.8,big=vr==='dwureczny';haft(-0.12,hl,0.07);wraps(-0.1,0.24,0.07);P(0,y,-0.14,0.085,0.085,0.05,FIT);
    P(0,y,zh,0.11,0.12,0.16,MD);P(0,y,zh+0.1,0.09,0.09,0.04,FIT);   // tuleja
    const sides=big?[1,-1]:[-1],n=6,reach=(vr==='toporek'?0.24:0.32)*(big?1.05:1);
    const ax=SH?SH.ax:0;
    for(const sd of sides)for(let i=0;i<n;i++){const t=i/(n-1),yy=y+sd*(0.07+t*reach*(ax===5?1.15:1)),span=ax===1?0.16+t*0.06:(vr==='toporek'?0.12:0.14)+t*t*(big?0.34:vr==='brodaty'||ax===2?0.32:ax===5?0.4:0.26),off=vr==='brodaty'||ax===2?-t*t*0.12:ax===4?t*t*0.06:0;
      P(0,yy,zh+off,0.055-t*0.025,reach/n+0.004,span,i===n-1?ML:i>=n-2?M:MF)}
    if(vr==='brodaty')P(0,y-0.2,zh-0.22,0.03,0.05,0.06,M);
    if(ax===3&&!big){for(let k=0;k<3;k++)P(0,y-0.1-k*0.05,zh,0.04-k*0.01,0.05,0.06-k*0.012,k===2?ML:M)}if(ax===4)P(0,y+0.12,zh+0.17,0.04,0.12,0.04,M),P(0,y+0.18,zh+0.22,0.035,0.05,0.04,ML);if(ax===1)P(0,y+0.07+reach,zh,0.04,0.02,0.2,ML);
    if(!big&&!(SH&&SH.ax===3))P(0,y-0.08,zh,0.06,0.06,0.1,MD);
    if(rar>=2)P(0.03,y+0.12,zh,0.02,0.05,0.05,c);if(RU)P(0.032,y+0.2,zh,0.012,0.12,0.03,RU);if(rar>=4)P(0,y,zh+0.1,0.1,0.1,0.02,GOLD);adorn(zh,0.07)}
  // --- młoty ---
  else if(base==='mlot'){const hl={kowalski:0.62,bojowy:1.0,wielki:1.22}[vr]*len,zh=hl*0.86;haft(-0.12,hl,0.08);wraps(-0.1,0.3,0.08);
    for(const s of [1,-1])P(s*0.046,y,zh-0.14,0.012,0.06,0.26,FIT);   // okucia
    if(vr==='kowalski'){P(0,y,zh,0.12,0.36,0.14,MD);P(0,y+0.18,zh,0.11,0.04,0.13,M);P(0,y-0.17,zh,0.06,0.06,0.08,M)}
    else if(vr==='bojowy'){P(0,y,zh,0.14,0.16,0.16,MD);P(0,y+0.12,zh,0.13,0.1,0.13,M);P(0,y+0.18,zh,0.15,0.03,0.15,ML);for(let k=0;k<3;k++)P(0,y-0.1-k*0.06,zh,0.08-k*0.022,0.06,0.08-k*0.022,k===2?ML:M);P(0,y,zh+0.12,0.06,0.06,0.1,M);P(0,y,zh+0.19,0.03,0.03,0.05,ML)}
    else{P(0,y,zh,0.26,0.44,0.26,MD);for(const s of [1,-1]){P(0,y+s*0.24,zh,0.24,0.04,0.24,M);P(0,y+s*0.27,zh,0.2,0.03,0.2,ML)}P(0,y,zh,0.27,0.06,0.27,FIT);P(0,y,zh,0.27,0.3,0.03,FITD);for(const s of [1,-1])for(const t of [1,-1])P(s*0.135,y+t*0.12,zh+s*0.0,0.02,0.04,0.04,FIT)}
    if(SH){const hm=SH.hm;if(hm===1)for(const s of [1,-1])for(let k=0;k<2;k++)P(0,y+s*(0.2+k*0.05),zh,0.1-k*0.03,0.05,0.1-k*0.03,k?ML:M);
      if(hm===2){P(0,y-0.2,zh,0.12,0.08,0.04,M);P(0,y-0.25,zh,0.12,0.04,0.02,ML)}
      if(hm===3)for(const s of [1,-1])for(const a of [-0.03,0.03])for(const b of [-0.03,0.03])P(a,y+s*0.2,zh+b,0.02,0.04,0.02,ML);
      if(hm===4){for(let k=0;k<4;k++)P(0,y-0.18-k*0.06,zh-k*0.02,0.05-k*0.01,0.07,0.05-k*0.01,k===3?ML:M)}}
    if(rar>=2)P(0.075,y,zh,0.01,0.06,0.06,c);if(RU)P(0,y,zh-0.09,0.1,0.14,0.012,RU);if(rar>=4)P(0,y,zh,0.03,0.2,0.29,GOLD);adorn(zh-0.1,0.08)}
  // --- sztylety ---
  else if(base==='sztylet'){const bl={sztylety:0.38,kordziki:0.44,mizerykordie:0.46}[vr]*len;grip(-0.04,0.14,0.055);pommel(-0.07,0.07,vr==='kordziki'?'disc':'ball');guard(0.12,vr==='mizerykordie'?0.1:0.16,SL.guard&&SL.guard!=='disc'?SL.guard:vr==='sztylety'?'down':'none');
    if(vr==='mizerykordie'){for(let k=0;k<5;k++)P(0,y,0.17+k*bl/5+bl/10,0.035-k*0.005,0.035-k*0.005,bl/5+0.002,k===4?ML:M);P(0,y,0.17+bl*0.4,0.012,0.04,bl*0.7,ML)}
    else blade(0.16,bl,vr==='kordziki'?0.085:0.06,0.03,{tip:0.7,steps:3})}
  // --- kostury ---
  else if(base==='kostur'){const hl={laska:1.5,kostur:1.55,arcymaga:1.75}[vr]*len,top=-0.2+hl;
    if(vr==='laska'){haft(-0.2,hl,0.065,'#8a6a44');P(0,y,-0.22,0.08,0.08,0.06,FIT);P(0,y,top,0.09,0.09,0.06,FIT);P(0,y,top+0.07,0.1,0.1,0.1,c);wraps(0.35,0.2,0.065)}
    else if(SH&&SH.st>0&&vr!=='arcymaga'){haft(-0.2,hl,0.07,vr==='laska'?'#8a6a44':WOOD);wraps(0.4,0.22,0.07);const st=SH.st;
      if(st===1){for(let i=0;i<8;i++){const a=i/8*6.283;P(0,y+Math.cos(a)*0.12,top+0.1+Math.sin(a)*0.12,0.04,0.04,0.04,GOLD)}P(0,y,top+0.1,0.1,0.1,0.1,c)}
      if(st===2){for(const s of [1,-1]){P(0,y+s*0.08,top+0.06,0.04,0.04,0.12,WOODD);P(0,y+s*0.06,top+0.16,0.035,0.035,0.06,WOODD)}P(0,y,top+0.12,0.11,0.11,0.11,c)}
      if(st===3)for(const [a,b,h] of [[0,0,0.2],[0.05,0.04,0.14],[-0.05,0.03,0.12],[0.02,-0.05,0.13]])P(a,y+b,top+0.04+h/2,0.06,0.06,h,c);
      if(st===4){P(0,y+0.06,top+0.04,0.06,0.08,0.06,WOOD);P(0,y+0.13,top+0.1,0.06,0.06,0.08,WOOD);P(0,y+0.1,top+0.18,0.06,0.06,0.06,WOODD);P(0,y+0.04,top+0.12,0.02,0.02,0.06,'#c9a24a');P(0,y+0.04,top+0.05,0.09,0.09,0.09,c)}}
    else if(vr==='kostur'){const n=10;for(let i=0;i<n;i++){const o=Math.sin(i*1.7)*0.012;P(o,y+Math.cos(i*1.3)*0.01,-0.2+(i+0.5)*hl/n,0.075-(i%2)*0.008,0.075,hl/n+0.004,i%3?WOOD:WOODD)}
      P(0,y+0.07,top-0.05,0.07,0.08,0.08,WOOD);P(0,y+0.12,top+0.02,0.06,0.07,0.1,WOODD);P(0,y+0.08,top+0.1,0.06,0.06,0.07,WOOD);P(0,y+0.02,top+0.06,0.13,0.13,0.13,c);P(0,y+0.02,top+0.06,0.08,0.15,0.08,'#ffffff');wraps(0.4,0.22,0.075)}
    else{haft(-0.2,hl,0.075,WOODD);for(const z of [0.3,0.9,top-0.15])P(0,y,z,0.095,0.095,0.04,GOLD);P(0,y,top,0.12,0.12,0.06,GOLD);
      for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){P(a*0.1,y+b*0.1,top+0.14,0.03,0.03,0.18,GOLDD);P(a*0.07,y+b*0.07,top+0.26,0.025,0.025,0.06,GOLD)}
      P(0,y,top+0.16,0.16,0.16,0.2,c);P(0,y,top+0.16,0.1,0.1,0.26,'#ffffff');P(0,y,top+0.3,0.06,0.06,0.06,c)}
    if(RU)for(let k=0;k<3;k++)P(0,y,0.55+k*0.12,0.085,0.085,0.03,RU);adorn(top-0.1,0.075)}
  // --- włócznie ---
  else if(base==='wlocznia'){const hl={oszczep:1.35,wlocznia:1.75,pika:2.15}[vr]*len,zt=-0.3+hl;haft(-0.3,hl,0.06,WOODL);wraps(-0.05,0.24,0.06);P(0,y,-0.32,0.07,0.07,0.06,FIT);
    P(0,y,zt+0.04,0.075,0.075,0.12,MD);for(const s of [1,-1])P(s*0.04,y,zt-0.06,0.01,0.03,0.14,FIT);
    if(vr==='pika'){for(let k=0;k<5;k++)P(0,y,zt+0.12+k*0.06,0.045-k*0.007,0.045-k*0.007,0.062,k===4?ML:M)}
    else if(SH&&SH.sp===3){for(const x of [-0.07,0,0.07])for(let k=0;k<4;k++)P(x,y,zt+0.14+k*0.06,0.022,0.022,0.064,k===3?ML:M);P(0,y,zt+0.12,0.18,0.03,0.04,M)}
    else if(SH&&SH.sp===4){for(let k=0;k<6;k++)P(0,y,zt+0.12+k*0.06,0.035-k*0.004,0.035-k*0.004,0.062,k===5?ML:M)}
    else if(SH&&SH.sp===1){const hb=vr==='oszczep'?0.2:0.3;for(let k=0;k<5;k++)P(0,y,zt+0.1+k*hb/5+hb/10,0.13*(1-k/5)+0.02,0.026,hb/5+0.003,k>=3?ML:M)}
    else if(SH&&SH.sp===5){const hb=0.36;for(let k=0;k<6;k++){const t=k/5;P(0,y,zt+0.1+k*hb/6+hb/12,0.17*(t<0.6?1:1-(t-0.6)*2)+0.02,0.026,hb/6+0.003,k>=4?ML:M)}P(0,y,zt+0.1+hb*0.4,0.018,0.036,hb*0.7,MD)}
    else{const hw=vr==='oszczep'?0.08:0.12,hb=vr==='oszczep'?0.2:0.32;if(SH&&SH.sp===2)for(const s of [1,-1])P(s*0.07,y,zt+0.06,0.06,0.03,0.03,MD);for(let k=0;k<6;k++){const t=k/5,w=hw*(t<0.35?0.5+t*1.4:1-(t-0.35)*1.4);P(0,y,zt+0.1+k*hb/6+hb/12,Math.max(0.02,w),0.026,hb/6+0.003,k>=4?ML:M)}P(0,y,zt+0.1+hb*0.45,0.018,0.036,hb*0.85,MD)}
    if(vr==='wlocznia')P(0,y-0.05,zt-0.02,0.02,0.07,0.1,'#a8352a');
    if(RU)P(0,y,zt+0.22,0.016,0.04,0.12,RU);if(rar>=2)P(0,y,zt-0.02,0.08,0.08,0.025,c);adorn(zt,0.06)}
  // --- buzdygany ---
  else if(base==='buzdygan'){const hl=0.82*len,zh=hl*0.94;
    if(vr==='maczuga'){for(let k=0;k<6;k++){const w=0.06+k*0.022;P(0,y,-0.12+k*hl/6+hl/12,w,w,hl/6+0.004,k%2?WOOD:WOODL)}grip(-0.12,0.22,0.065);for(let k=0;k<8;k++){const a=k*0.785,r=0.075+((k%3)*0.08+0.42)/hl*0.05;P(Math.cos(a)*(0.07+(k%3)*0.012),y+Math.sin(a)*(0.07+(k%3)*0.012),0.42+(k%3)*0.09,0.035,0.035,0.035,'#9aa0a6')}}
    else{haft(-0.12,hl,0.065,vr==='morgenstern'?WOODD:WOOD);grip(-0.12,0.22,0.07);P(0,y,-0.15,0.08,0.08,0.05,FIT);P(0,y,zh-0.16,0.085,0.085,0.06,FIT);
      if(vr==='buzdygan'){P(0,y,zh,0.11,0.11,0.24,MD);for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1],[0.7,0.7],[-0.7,0.7],[0.7,-0.7],[-0.7,-0.7]].slice(0,SH?SH.fl:8)){const d=Math.abs(a)>0.5&&Math.abs(b)>0.5?0.07:0.09;P(a*d,y+b*d,zh,a&&b?0.05:a?0.07:0.03,a&&b?0.05:b?0.07:0.03,0.22,M);P(a*d*1.15,y+b*d*1.15,zh,0.025,0.025,0.16,ML)}P(0,y,zh+0.14,0.06,0.06,0.05,FIT)}
      else{P(0,y,zh,0.2,0.2,0.2,MD);P(0,y,zh,0.22,0.16,0.16,M);P(0,y,zh,0.16,0.22,0.16,M);P(0,y,zh,0.16,0.16,0.22,M);for(const [a,b,cz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0.7,0.7,0.4],[-0.7,0.7,-0.4],[0.7,-0.7,-0.4],[-0.7,-0.7,0.4]]){P(a*0.14,y+b*0.14,zh+cz*0.14,0.05,0.05,0.05,'#e8e2cc');P(a*0.18,y+b*0.18,zh+cz*0.18,0.025,0.025,0.025,'#f4f0e0')}}}
    if(rar>=2)P(0,y,zh-0.16,0.09,0.09,0.02,c);if(RU)P(0,y,zh,0.13,0.012,0.13,RU);adorn(zh-0.1,0.065)}
  // --- szable ---
  else if(base==='szabla'){const cv={szabla:0.07,sejmitar:0.11,karabela:0.08}[vr]*(SH?SH.cv:1),n=9,bl=0.92*len,bw=vr==='sejmitar'?0.1:0.08;grip(-0.06,0.2,0.06);
    if(vr==='karabela'){P(0,y,-0.1,0.07,0.1,0.07,FIT);P(0,y+0.06,-0.14,0.06,0.06,0.06,FITD)}else pommel(-0.09,0.07,'ball');
    P(0,y,0.15,0.18,0.06,0.05,FIT);for(const s of [1,-1])P(s*0.1,y+0.02,0.17,0.04,0.05,0.04,FITD);
    if(vr==='karabela'){P(0,y+0.07,0.04,0.025,0.025,0.24,FIT);P(0,y+0.05,-0.08,0.025,0.05,0.025,FIT)}
    for(let i=0;i<n;i++){const t=i/(n-1),z=0.2+t*bl,off=cv*t*t*1.6,w=vr==='sejmitar'?bw*(0.8+t*0.5)*(i===n-1?0.6:1):bw*(i>=n-2?0.7-(i-n+2)*0.25:1);P(0,y+off,z,w,0.034,bl/n+0.008,M);P(0,y+off-0.006,z,w*0.4,0.04,bl/n+0.006,ML)}
    P(0,y+cv*1.6+0.01,0.2+bl+0.04,bw*0.35,0.03,0.06,ML);if(RU)P(0,y+0.02,0.5,0.014,0.044,0.3,RU);if(SL.serr)for(let i=1;i<n-1;i+=1){const t=i/(n-1);P(0,y+cv*t*t*1.6+0.05,0.2+t*bl,0.03,0.03,0.04,MD)}if(SL.tas){P(0,y-0.05,-0.12,0.025,0.08,0.025,SL.tas);P(0,y-0.08,-0.17,0.05,0.05,0.05,SL.tas)}if(SL.band)P(0,y+0.02,0.4,0.03,0.045,0.25,'#d9b23a');if(SL.leaf)P(0,y,0.15,0.22,0.08,0.03,'#5a9a4a')}
  // --- halabardy ---
  else if(base==='halabarda'){const hl=1.95*len,zt=-0.3+hl;haft(-0.3,hl,0.065);wraps(0.0,0.28,0.065);P(0,y,-0.32,0.075,0.075,0.06,FIT);P(0,y,zt-0.2,0.078,0.078,0.3,MD);for(const s of [1,-1])P(s*0.042,y,zt-0.42,0.012,0.04,0.2,FIT);
    if(vr==='halabarda'){for(let i=0;i<5;i++){const t=i/4;P(0,y+0.06+t*0.26,zt-0.2+t*0.05,0.04-t*0.015,0.056,0.2+t*0.26,i===4?ML:i>2?M:MF)}for(let k=0;k<3;k++)P(0,y-0.07-k*0.05,zt-0.18+k*0.03,0.035,0.05,0.06-k*0.01,k===2?ML:M);for(let k=0;k<5;k++)P(0,y,zt+0.0+k*0.06,0.045-k*0.007,0.045-k*0.007,0.062,k===4?ML:M)}
    else if(vr==='glewia'){for(let k=0;k<7;k++){const t=k/6;P(0,y+0.02+t*t*0.06,zt+0.0+k*0.08,0.03,0.11-t*0.06,0.085,k>=5?ML:M);P(0,y-0.03+t*t*0.06,zt+k*0.08,0.034,0.02,0.085,ML)}P(0,y-0.06,zt-0.05,0.03,0.06,0.05,M)}
    else{for(let k=0;k<7;k++){const t=k/6;P(0,y+0.1+t*0.32,zt+0.08+Math.sin(t*2.6)*0.12,0.03,0.07,0.12-t*0.06,k===6?ML:M);P(0,y+0.1+t*0.32,zt+0.08+Math.sin(t*2.6)*0.12-0.05,0.032,0.06,0.02,ML)}}
    if(SH&&vr!=='kosa'){if(SH.hb===1)for(let k=0;k<4;k++)P(0,y-0.08-k*0.05,zt-0.2+k*0.04,0.03,0.05,0.05,k===3?ML:M);if(SH.hb===2)for(const s of [1,-1])P(0,y+s*0.06,zt-0.3,0.03,0.08,0.03,M);if(SH.hb===3){P(0,y,zt+0.3,0.03,0.03,0.08,ML);P(0,y+0.04,zt+0.24,0.03,0.06,0.03,M)}}
    if(rar>=2)P(0,y,zt-0.36,0.085,0.085,0.025,c);if(RU)P(0.022,y+0.15,zt-0.15,0.01,0.12,0.03,RU);adorn(zt-0.3,0.065)}
  // --- kusze ---
  else if(base==='kusza'){const s=len,heavy=vr==='ciezka',light=vr==='lekka';
    P(0,y,0.28*s,0.075,0.09,0.74*s,WOOD);P(0,y-0.02,-0.05,0.09,0.16,0.18,WOODD);P(0,y+0.05,0.36*s,0.03,0.012,0.6*s,'#3a2414');   // łoże i rowek
    P(0,y-0.08,0.1,0.02,0.1,0.03,FITD);P(0,y+0.05,0.12,0.05,0.04,0.05,FIT);   // spust i orzech
    const pw=(heavy?0.92:light?0.66:0.8)*(SH?0.85+SH.cb*0.12:1),pc=heavy||vr==='kusza'?M:WOODL,n=6,pcv=SH?[0.12,0.04,0.2][SH.cb]:0.12;
    for(let i=0;i<n;i++){const t=i/(n-1);for(const sd of [1,-1])P(sd*(0.05+t*pw/2),y+0.02,0.62*s-t*t*pcv,pw/n*0.55+0.02,heavy?0.06:0.045,heavy?0.07:0.05,i===n-1?MD:pc)}
    P(0,y+0.02,0.62*s,0.12,0.08,0.09,FIT);P(0,y+0.02,0.7*s,0.12,0.03,0.03,FITD);for(const sd of [1,-1])P(sd*0.06,y+0.02,0.74*s,0.02,0.03,0.08,FITD);   // strzemię
    P(0,y+0.06,0.36*s,0.012,0.012,0.52*s,'#e8e2cc');for(const sd of [1,-1])P(sd*(pw/4+0.03),y+0.06,0.56*s-0.06,pw/2-0.04,0.01,0.01,'#e8e2cc');
    P(0,y+0.075,0.42*s,0.025,0.025,0.42*s,'#7a5230');P(0,y+0.075,0.66*s,0.04,0.04,0.06,'#b8bec4');   // bełt
    if(heavy){P(0,y-0.02,-0.16,0.16,0.05,0.05,FIT);for(const sd of [1,-1])P(sd*0.1,y-0.02,-0.16,0.03,0.12,0.03,FITD)}
    if(rar>=2)P(0.04,y-0.02,0.2,0.012,0.05,0.05,c);if(RU)P(0.04,y,0.4,0.01,0.03,0.2,RU);adorn(0.4*s,0.08)}
  // --- różdżki ---
  else if(base==='rozdzka'){if(vr==='berlo'){P(0,y,0.24,0.05,0.05,0.62,GOLDD);for(const z of [0,0.18,0.36,0.5])P(0,y,z,0.07,0.07,0.03,GOLD);P(0,y,0.58,0.1,0.1,0.06,GOLD);for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])P(a*0.07,y+b*0.07,0.67,0.03,0.03,0.12,GOLD);P(0,y,0.68,0.13,0.13,0.13,c);P(0,y,0.77,0.04,0.04,0.06,GOLD)}
    else{for(let k=0;k<6;k++)P(0,y,-0.02+k*0.1+0.05,0.05-k*0.004,0.05-k*0.004,0.104,k%2?'#e8dcc0':'#d8c8a8');for(const z of [0.12,0.3])P(0,y,z,0.06,0.06,0.02,'#8a6a44');P(0,y,0.6,0.06,0.06,0.04,'#c9a64a');P(0,y,0.66,0.09,0.09,0.1,c);P(0,y,0.66,0.05,0.11,0.05,'#ffffff')}
    if(RU)P(0,y,0.3,0.06,0.06,0.12,RU);adorn(0.45,0.05)}
  else return null;if(base==='mlot')for(const b of L)b[1]=2*y-b[1];return L}
const BOWV={krotki:[0.82,'#8a6238','#9a7248',0.06],mysliwski:[1,'#7a5230','#8a6238',0.055],dlugi:[1.28,'#6b4a2b','#7a5532',0.05],refleks:[1.0,'#3a2414','#5a3a22',0.058],elfi:[1.12,'#e8e2cc','#d8d0b8',0.05],kosciany:[1.05,'#e8e0c8','#cfc4a8',0.062]};
const BLK=[null,['#7a1a14','#a8302a','#c8302a'],['#2a1c12','#3a2a1c','#e8e0c8'],['#3a2a20','#4a3828','#1a2a5a'],['#e8e2cc','#cfe0c0','#2a5a3a'],['#2e262c','#3a2a30','#5a1a1a','#ff3030'],['#8fd8f0','#b8e8f8','#2a4a6a','#d8f8ff'],['#8a3010','#a84018','#3a1a0a','#ffb030'],['#b8dcee','#d8eef8','#2a4a6a','#ffffff'],['#3a2a5a','#4a3a6a','#1a1030','#c890ff']];
function bowGroup(rar,vr,lk,sd){const VB=sd?mulb(sd):null;
  const c=RAR[rar].c,b=new THREE.Group(),y=-0.3,V=BOWV[vr]||BOWV.mysliwski,BS2=BLK[lk||0],w1=rar>=4?'#c9a24a':BS2?BS2[0]:V[1],w2=rar>=4?'#e0b84a':BS2?BS2[1]:V[2],th=V[3],L=[],P=(...q)=>L.push(q),LEA=BS2?BS2[2]:rar>=3?'#2a1c12':'#4a3020';
  // rękojeść z owijką i podstawką pod strzałę
  P(0,y,0,th+0.025,th+0.035,0.18,LEA);for(let k=0;k<4;k++)P(0,y,-0.07+k*0.047,th+0.035,th+0.045,0.018,'#6a4a2a');P(0,y+0.04,0.1,0.03,0.025,0.03,'#8a6a44');
  const BSR=sd?mulb(sd*13+5):null,bcv=BSR?0.1+BSR()*0.16:0.17,btip=BSR?Math.floor(BSR()*3):0;
  const n=8;for(const sg of [1,-1])for(let i=0;i<n;i++){const t=(i+0.5)/n,z=sg*(0.09+t*0.56),yy=y+bcv*t*t-(vr==='refleks'&&t>0.75?(t-0.75)*0.5:0),w=th*(1-t*0.45);
    P(0,yy,z,w,w*1.15,0.56/n+0.012,i%2?w1:w2);if(vr==='kosciany'&&i%2===1)P(0,yy,z,w+0.016,w*1.15+0.016,0.02,'#5a4a3a')}
  for(const sg of [1,-1]){const yy=y+bcv-(vr==='refleks'?0.12:0);P(0,yy,sg*0.67,th*0.6,th*0.8,0.04,'#efe6cc');P(0,yy+0.012,sg*0.69,th*0.4,th*0.5,0.02,'#2a1c12')}
  if(btip===1&&vr!=='refleks')for(const sg of [1,-1]){P(0,y+bcv-0.03,sg*0.71,th*0.6,0.05,0.05,w2);P(0,y+bcv-0.07,sg*0.73,th*0.5,0.04,0.04,'#efe6cc')}
  if(btip===2)for(const sg of [1,-1])P(0,y+0.04,sg*0.36,th+0.03,0.03,0.08,w2);
  if(vr==='refleks')for(const sg of [1,-1]){P(0,y+0.08,sg*0.7,th*0.6,0.05,0.05,w2);P(0,y+0.04,sg*0.72,th*0.55,0.04,0.04,'#efe6cc')}
  if(vr==='elfi')for(const sg of [1,-1]){for(const t of [0.3,0.6]){const z=sg*(0.09+t*0.56),yy=y+bcv*t*t;P(0.03,yy,z,0.012,0.08,0.06,'#5a9a4a');P(-0.03,yy,z,0.012,0.08,0.06,'#5a9a4a');P(0.035,yy+0.03,z+sg*0.03,0.01,0.04,0.04,'#86c060')}P(0,y+0.1,sg*0.45,th*0.7,0.012,0.12,'#d9b23a')}
  if(vr==='dlugi')for(const sg of [1,-1])P(0,y+0.05,sg*0.3,th+0.01,th+0.01,0.02,'#a8352a');
  if(lk===1)for(const sg of [1,-1]){P(0,y+0.13,sg*0.6,0.02,0.1,0.02,'#c8302a');P(0,y+0.08,sg*0.6,0.04,0.04,0.04,'#e05040')}
  if(lk===2)for(const sg of [1,-1]){P(0,y+0.2,sg*0.66,th*0.7,0.07,0.05,'#e8e0c8');P(0,y-0.02,sg*0.05,th+0.05,th+0.05,0.08,'#6a5a48')}
  if(lk===3)for(const sg of [1,-1])for(const t of [0.25,0.55])P(0,y+bcv*t*t,sg*(0.09+t*0.56),th+0.014,th*1.15+0.014,0.025,'#d9b23a');
  if(lk>=5){const gc='!'+BS2[3];for(const sg of [1,-1]){for(const t of [0.3,0.6,0.9])P(0,y+bcv*t*t,sg*(0.09+t*0.56),th+0.012,th*1.15+0.012,0.02,gc);P(0,y+0.19,sg*0.68,th*0.8,th,0.06,gc)}if(lk===5)for(const sg of [1,-1])P(0,y+0.24,sg*0.62,0.03,0.08,0.03,BS2[0]);if(lk===6||lk===8)for(const sg of [1,-1])P(0.03,y+0.1,sg*0.4,0.03,0.08,0.03,BS2[1])}
  if(lk===4)for(const sg of [1,-1])for(const t of [0.2,0.45,0.7]){const z=sg*(0.09+t*0.56),yy=y+bcv*t*t;P(0.028,yy,z,0.01,0.06,0.05,'#5a9a4a');P(-0.028,yy,z,0.01,0.06,0.05,'#5a9a4a')}
  if(rar>=2)for(const sg of [1,-1])P(0,y+0.02,sg*0.11,th+0.02,th+0.03,0.025,c);if(rar>=3)for(const sg of [1,-1])P(0,y+0.07,sg*0.4,th*0.7,0.012,0.14,WRUNE[rar]);
  if(VB&&!(lk>0)){const sh=0.85+VB()*0.3;for(const q of L)if(q[6]===w1||q[6]===w2)q[6]=darker(q[6],sh)}
  b.add(new THREE.Mesh(boxes(L),decoMat));{const G=L.filter(q=>typeof q[6]==='string'&&q[6][0]==='!');if(G.length)b.add(new THREE.Mesh(boxes(G.map(q=>[q[0]*1.03,q[1],q[2],q[3]*1.06,q[4]*1.06,q[5]*1.02,q[6]])),GLOWMAT))}b.scale.z=V[0]*(VB?0.94+VB()*0.12:1);
  const half=sg=>{const p=new THREE.Group();p.position.set(0,y+bcv-(vr==='refleks'?0.12:0),sg*0.68);p.add(new THREE.Mesh(boxes([[0,0,-sg*0.34,0.012,0.012,0.68,'#efe8d6']]),decoMat));b.add(p);return p};
  b.userData={sU:half(1),sD:half(-1),L:L.concat([[0,y+bcv-(vr==='refleks'?0.12:0),0,0.024,0.024,1.36,'#efe8d6']]),sz:V[0]};b.traverse(o=>{if(o.isMesh)o.castShadow=true});return b;
}
function accBoxes(it){const c=RAR[it.rar||0].c,r=it.rar||0,k=it.lk,L=[],P=(...q)=>L.push(q),GD=r>=2?'#d9b23a':'#c4ccd2',GD2=darker(GD,0.78);
  if(it.base==='pierscien'){const ring=(rad,th,col,cy=0.04)=>{for(let i=0;i<10;i++){const a=i/10*6.283;P(Math.cos(a)*rad,cy+Math.sin(a)*rad,0,th,th,0.07,col)}};
    if(k===1){ring(0.16,0.07,GD);P(0,0.25,0,0.2,0.08,0.13,GD);P(0,0.29,0,0.16,0.02,0.1,GD2);P(0,0.3,0,0.06,0.012,0.06,c)}
    if(k===2){for(let i=0;i<12;i++){const a=i/12*6.283;P(Math.cos(a)*0.16,0.04+Math.sin(a)*0.16,(i%2)*0.03-0.015,0.06,0.06,0.04,i%2?GD:GD2)}P(0,0.26,0,0.08,0.08,0.08,c)}
    if(k===3){ring(0.15,0.05,GD,0.04);for(let i=0;i<10;i++){const a=i/10*6.283;P(Math.cos(a)*0.15,0.04+Math.sin(a)*0.15,0.05,0.05,0.05,0.03,GD2)}P(0,0.24,0.03,0.08,0.06,0.14,c)}
    if(k===4){ring(0.16,0.07,'#c4ccd2');P(0,0.26,0,0.14,0.12,0.12,'#e8e2cc');P(0.04,0.27,0.06,0.03,0.03,0.012,'#141414');P(-0.04,0.27,0.06,0.03,0.03,0.012,'#141414');P(0,0.22,0.06,0.06,0.015,0.012,'#141414')}
    if(k===5){for(let i=0;i<14;i++){const a=i/14*6.283*1.15;P(Math.cos(a)*0.16,0.04+Math.sin(a)*0.16,i*0.004,0.06,0.06,0.06,i%3?'#5a9a4a':'#3a7a3a')}P(0.1,0.18,0.04,0.07,0.05,0.05,'#5a9a4a');P(0.13,0.2,0.07,0.02,0.02,0.012,c)}
    return L}
  if(it.base==='amulet'){for(let i=0;i<7;i++){const t=i/6;P(-0.18+t*0.36,0.46+0.06*(1-Math.sin(t*Math.PI)),0,0.045,0.03,0.03,i%2?GD2:GD)}for(const s of [1,-1])P(s*0.18,0.34,0,0.03,0.2,0.03,GD);P(0,0.27,0,0.05,0.04,0.04,GD);
    if(k===1){for(let i=0;i<7;i++){const a=-1.2+i*0.4;P(Math.cos(a)*0.12,0.12+Math.sin(a)*0.12,0,0.06,0.06,0.05,GD)}P(0.06,0.12,0.03,0.05,0.05,0.03,c)}
    if(k===2){P(0,0.14,0,0.08,0.1,0.06,'#e8e0c8');P(0,0.06,0,0.06,0.08,0.05,'#e8e0c8');P(0,0.0,0,0.04,0.06,0.04,'#d8d0b8');P(0,0.2,0,0.1,0.03,0.07,GD);P(0,0.12,0.035,0.03,0.03,0.012,c)}
    if(k===3){P(0,0.12,0,0.06,0.28,0.05,GD);P(0,0.16,0,0.22,0.06,0.05,GD);P(0,0.16,0.03,0.06,0.06,0.03,c);for(const s of [1,-1])P(s*0.11,0.16,0,0.03,0.08,0.05,GD2)}
    if(k===4){P(0,0.12,0,0.26,0.16,0.05,GD);P(0,0.12,0.02,0.2,0.1,0.04,'#f2ead8');P(0,0.12,0.04,0.08,0.08,0.03,c);P(0,0.12,0.05,0.04,0.04,0.02,'#141414')}
    if(k===5){P(0,0.12,0,0.1,0.1,0.05,c);for(const [a,b] of [[0,1],[0,-1],[1,0],[-1,0]])P(a*0.1,0.12+b*0.1,0,a?0.1:0.05,b?0.1:0.05,0.04,GD);for(const [a,b] of [[1,1],[-1,1],[1,-1],[-1,-1]])P(a*0.07,0.12+b*0.07,0,0.04,0.04,0.04,GD2)}
    return L}
  if(it.base==='latarnia'){const fr=r>=3?'#a8822a':'#3a3a40';
    if(k===1){P(0,0.04,0,0.2,0.06,0.2,'#3a2a20');for(const [y,w] of [[0.12,0.26],[0.2,0.34],[0.28,0.36],[0.36,0.32],[0.43,0.24]])P(0,y,0,w,0.08,w,'#e84a3a');for(const y of [0.16,0.24,0.32,0.4])P(0,y,0,0.37,0.012,0.37,'#a8302a');P(0,0.5,0,0.2,0.05,0.2,'#3a2a20');P(0,0.58,0,0.03,0.1,0.03,'#3a2a20');P(0,0.0,0,0.06,0.06,0.06,'#d9b23a');P(0,0.28,0,0.14,0.14,0.14,'!#ffe6a0')}
    if(k===2){P(0,0.03,0,0.3,0.06,0.3,'#c9a24a');P(0,0.27,0,0.24,0.36,0.24,c+'~');P(0,0.26,0,0.12,0.18,0.12,'!#ffe6a0');for(const [a,b] of [[1,1],[-1,1],[1,-1],[-1,-1]])P(a*0.13,0.27,b*0.13,0.04,0.42,0.04,'#c9a24a');for(let i=0;i<4;i++)P(0,0.5+i*0.04,0,0.3-i*0.07,0.04,0.3-i*0.07,'#d9b23a');P(0,0.68,0,0.05,0.05,0.05,'#d9b23a');for(const s of [1,-1])P(0,0.27,s*0.13,0.02,0.36,0.012,'#a8822a')}
    if(k===3){P(0,0.04,0,0.26,0.06,0.26,'#3a3a40');P(0,0.2,0,0.28,0.24,0.26,'#e8e2cc');P(0,0.36,0,0.24,0.12,0.22,'#e8e2cc');P(0.07,0.24,0.131,0.07,0.08,0.012,'!#ffb030');P(-0.07,0.24,0.131,0.07,0.08,0.012,'!#ffb030');P(0,0.14,0.131,0.12,0.03,0.012,'#3a3228');P(0,0.46,0,0.1,0.06,0.1,'#3a3a40');P(0,0.54,0,0.14,0.03,0.03,'#5a5a62')}
    if(k===4){P(0,0.03,0,0.24,0.06,0.24,'#c8d0d8');for(const [x,h] of [[0,0.4],[0.08,0.3],[-0.08,0.28],[0.04,0.22],[-0.05,0.2]])P(x,0.06+h/2,x*0.6,0.07,h,0.07,'!#bfe8ff');P(0,0.3,0,0.06,0.3,0.06,'!#ffffff');P(0,0.5,0,0.03,0.08,0.03,'#c8d0d8')}
    return L}
  return null}
function itemBoxes(it){if(it.lk&&(it.base==='pierscien'||it.base==='amulet'||it.base==='latarnia')){const a=accBoxes(it);if(a)return a}const L=itemBoxesS(it);
  if(L&&it.sd&&['helm','zbroja','rekawice','buty'].includes(it.base)){const T=TRIMC[Math.floor(it.sd/9)%TRIMC.length],P=(...q)=>L.push(q);
    if(it.base==='helm')P(0,0.085,0,0.575,0.03,0.575,T);if(it.base==='zbroja'){P(0,0.6,0.16,0.42,0.025,0.012,T);P(0,0.12,0.164,0.56,0.025,0.012,T)}if(it.base==='rekawice')P(0,0.42,0.02,0.29,0.025,0.25,T);if(it.base==='buty')P(0,0.5,-0.06,0.27,0.025,0.29,T);
    const Q=mulb(it.sd*17+3),M=gMat(it),M2=darker(M,0.8),M3=darker(M,1.15),s1=Math.floor(Q()*5),s2=Math.floor(Q()*4),s3=Q()<0.5;
    if(it.base==='helm'){if(s1===1)for(let k=0;k<4;k++)P(0,0.52+k*0.05,0,0.3-k*0.08,0.05,0.3-k*0.08,k===3?M3:M);if(s1===2){P(0,0.1,0,0.8,0.04,0.8,M);P(0,0.08,0,0.84,0.02,0.84,M2)}if(s1===3)P(0,0.55,0,0.05,0.1,0.5,M3),P(0,0.6,-0.05,0.04,0.06,0.36,M3);if(s1===4){P(0,0.52,0,0.36,0.1,0.36,M);P(0,0.6,0,0.22,0.08,0.22,M3);for(const s of [1,-1])P(s*0.28,0.12,0.1,0.04,0.26,0.24,M2)}}
    if(it.base==='zbroja'){for(const s of [1,-1]){if(s2===1)for(let k=0;k<3;k++)P(s*(0.42+k*0.03),0.6-k*0.07,0,0.3-k*0.04,0.07,0.42,k%2?M2:M3);if(s2===2){P(s*0.4,0.6,0,0.3,0.06,0.4,M3);P(s*0.42,0.66,0,0.26,0.04,0.36,M2)}if(s2===3)for(const z of [-0.1,0.1])P(s*0.44,0.66,z,0.04,0.12,0.04,M3)}if(s3){P(0,0.68,0,0.36,0.1,0.32,M2);P(0,0.74,0,0.3,0.04,0.28,M3)}}
    if(it.base==='rekawice'){if(s2===1){P(0,0.5,0.02,0.38,0.1,0.34,M2);P(0,0.56,0.02,0.42,0.03,0.38,M3)}if(s2===2)for(let i=0;i<4;i++)P(-0.09+i*0.06,0.03,0.17,0.05,0.05,0.04,M3);if(s2===3)P(0,0.6,0.02,0.24,0.14,0.2,M)}
    if(it.base==='buty'){if(s2===1){P(0,0.07,0.37,0.18,0.1,0.12,M);P(0,0.06,0.45,0.1,0.07,0.08,M3)}if(s2===2){P(0,0.58,-0.06,0.34,0.08,0.36,M2);P(0,0.63,-0.06,0.36,0.03,0.38,M3)}if(s2===3){P(0,0.6,0.1,0.24,0.12,0.06,M3);P(0,0.6,0.13,0.1,0.06,0.03,M2)}}}
  if(L&&it.base==='zbroja'){const cc=CAPEOF(it);if(cc){L.push([0,0.12,-0.2,0.6,0.74,0.04,cc],[0,-0.24,-0.2,0.62,0.04,0.05,darker(cc,0.65)],[0,0.52,-0.18,0.62,0.07,0.07,darker(cc,0.75)])}}
  return L}
function itemBoxesS(it){const L=itemBoxes0(it);if(!L||!it.lk||!['helm','zbroja','rekawice','buty'].includes(it.base))return L;
  const M=it.lk>=5?FTH[it.lk].m:it.mat?ARMT.find(a=>a.k===it.mat).c:MET[it.rar||0],M2=darker(M,0.78),M3=darker(M,1.15),FUR='#8a6a4a',FUR2='#a8886a',G='#d9b23a',RV='#d8dde2',P=(...q)=>L.push(q),k=it.lk;
  if(k>=5){const T=FTH[k],GW='!'+T.g,A=T.a;
    if(it.base==='helm'){P(0.115,0.24,0.285,0.1,0.04,0.012,GW);P(-0.115,0.24,0.285,0.1,0.04,0.012,GW);
      if(k===5)for(const s of [1,-1])P(s*0.3,0.36,0,0.1,0.08,0.1,A),P(s*0.38,0.46,-0.04,0.07,0.12,0.08,A),P(s*0.4,0.58,-0.1,0.05,0.1,0.06,'#1a1014'),P(s*0.38,0.66,-0.16,0.04,0.06,0.04,'#1a1014');
      if(k===6||k===8)for(const [x,h] of [[0,0.22],[0.14,0.16],[-0.14,0.16],[0.26,0.1],[-0.26,0.1]])P(x,0.5+h/2,0,0.06,h,0.06,k===6?GW:'#ffffff');
      if(k===7)for(let i=0;i<5;i++)P(0,0.54+i*0.05,-0.08*i+0.1,0.08,0.08,0.1,i%2?GW:'!#ffe080');
      if(k===9){P(0,0.72,0,0.5,0.03,0.5,GW);P(0,0.72,0,0.42,0.035,0.42,'#3a2a5a');P(0,0.36,0.27,0.08,0.08,0.012,GW)}}
    if(it.base==='zbroja'){P(0,0.36,0.17,0.14,0.14,0.012,GW);P(0,0.36,0.175,0.08,0.08,0.01,'!#ffffff');for(const s of [1,-1]){P(s*0.24,0.36,0.165,0.02,0.4,0.01,GW)}
      for(const s of [1,-1]){if(k===5)P(s*0.42,0.66,0,0.06,0.14,0.06,A),P(s*0.46,0.76,0,0.04,0.08,0.04,'#1a1014');if(k===6||k===8)P(s*0.4,0.66,0,0.07,0.16,0.07,k===6?GW:'#ffffff'),P(s*0.44,0.62,0.08,0.05,0.1,0.05,M3);if(k===7)P(s*0.38,0.66,0,0.1,0.08,0.1,GW),P(s*0.38,0.72,0,0.06,0.06,0.06,'!#ffe080');if(k===9)P(s*0.5,0.7,0,0.07,0.07,0.07,GW)}}
    if(it.base==='rekawice'){P(0,0.3,0.113,0.25,0.025,0.012,GW);P(0,0.44,0.13,0.08,0.08,0.02,GW);if(k===5)for(let i=0;i<3;i++)P(-0.06+i*0.06,0.62,0.02,0.03,0.08,0.03,A)}
    if(it.base==='buty'){P(0,0.4,0.075,0.2,0.025,0.012,GW);P(0,0.15,0.25,0.12,0.04,0.012,GW);if(k===5)P(0,0.66,0.1,0.04,0.1,0.04,A);if(k===6||k===8)P(0.13,0.5,-0.06,0.04,0.12,0.04,k===6?GW:'#ffffff')}
    return L}
  if(it.base==='helm'){if(k===1)for(const s of [1,-1])P(s*0.3,0.32,0,0.1,0.08,0.08,'#e8e0c8'),P(s*0.38,0.4,0,0.07,0.1,0.07,'#e8e0c8'),P(s*0.42,0.51,-0.02,0.05,0.1,0.05,'#d8d0b8'),P(s*0.43,0.6,-0.04,0.035,0.06,0.035,'#a89a80');
    if(k===2){P(0,0.15,0.27,0.06,0.26,0.03,M2);for(let i=0;i<7;i++)P(-0.24+i*0.08,0.12,0.285,0.025,0.025,0.012,RV);P(0,0.42,0.27,0.3,0.03,0.012,M3)}
    if(k===3){P(0,0.22,0,0.58,0.46,0.58,M);P(0,0.46,0,0.5,0.04,0.5,M2);P(0,0.29,0.292,0.44,0.035,0.01,'#141414');P(0,0.17,0.294,0.05,0.28,0.012,M3);P(0,0.21,0.294,0.32,0.03,0.012,M3);for(let i=0;i<4;i++)P(-0.09+i*0.06,0.1,0.294,0.02,0.02,0.012,'#141414')}
    if(k===4){P(0,0.5,0,0.32,0.06,0.32,M);P(0,0.56,0,0.2,0.06,0.2,M);P(0,0.62,0,0.1,0.06,0.1,M3);P(0,0.67,0,0.04,0.08,0.04,M3);P(0,0.15,0.27,0.05,0.26,0.03,M2);P(0,0.0,-0.06,0.6,0.14,0.48,'#9aa0a6');P(0,-0.04,-0.06,0.62,0.04,0.5,'#7a8086')}}
  if(it.base==='zbroja'){if(k===1){P(0,0.22,0.166,0.36,0.52,0.012,'#2f5f8f');P(0,0.22,0.172,0.08,0.52,0.01,G);P(0,0.34,0.176,0.13,0.13,0.01,G);P(0,0.34,0.18,0.07,0.07,0.01,'#a8302a');P(0,-0.08,0.155,0.34,0.16,0.02,'#2f5f8f')}
    if(k===2)for(let r=0;r<4;r++)for(let q=-2;q<=2;q++)P(q*0.1,0.14+r*0.12,0.163,0.03,0.03,0.012,RV);
    if(k===3)for(let r=0;r<6;r++)for(let q=-3;q<=3;q++)if(Math.abs(q*0.075+(r%2)*0.037)<0.26)P(q*0.075+(r%2)*0.037,0.1+r*0.08,0.163,0.065,0.055,0.012,r%2?M2:M3);
    if(k===4){P(0,0.64,0,0.68,0.12,0.4,FUR);P(0,0.7,0,0.52,0.06,0.34,FUR2);for(const s of [1,-1])P(s*0.3,0.58,0.12,0.08,0.08,0.12,FUR2);P(0,0.6,0.2,0.06,0.06,0.02,G)}}
  if(it.base==='rekawice'){if(k===1)for(let i=0;i<4;i++)P(-0.09+i*0.06,0.06,0.2,0.025,0.025,0.06,RV);if(k===2){P(0,0.5,0.02,0.34,0.1,0.3,FUR);P(0,0.55,0.02,0.3,0.04,0.26,FUR2)}if(k===3){P(0,0.54,0.02,0.36,0.14,0.32,M2);P(0,0.62,0.02,0.4,0.04,0.36,M3)}if(k===4){P(0,0.3,0.113,0.25,0.02,0.01,G);P(0,0.44,0.13,0.06,0.06,0.02,G);P(0,0.2,0.113,0.25,0.02,0.01,G)}}
  if(it.base==='buty'){if(k===1){P(0,0.57,-0.06,0.32,0.1,0.34,FUR);P(0,0.62,-0.06,0.28,0.04,0.3,FUR2)}if(k===2){P(0,0.1,-0.22,0.04,0.04,0.08,'#c9a24a');P(0,0.1,-0.28,0.07,0.07,0.02,G)}if(k===3){P(0,0.6,0.1,0.24,0.12,0.06,M3);P(0,0.66,0.12,0.14,0.06,0.04,M2)}if(k===4){P(0,0.4,-0.06,0.26,0.03,0.28,G);P(0.13,0.4,0.0,0.02,0.05,0.05,G);P(0,0.2,0.2,0.18,0.02,0.02,G)}}
  return L}
function itemBoxes0(it){const c=RAR[it.rar||0].c,mt=it.mat,MATC0=it.lk>=5&&FTH[it.lk]?FTH[it.lk].m:mt?ARMT.find(a=>a.k===mt).c:MET[it.rar||0],MATC=it.sd?darker(MATC0,0.86+(it.sd%9)/9*0.28):MATC0,M=MATC,M2=darker(M,0.78),M3=darker(M,1.15),metal=!mt||mt==='kolcz'||mt==='plyt'||mt==='krasn'||mt==='smok',
  Lt='#6b4528',LtD='#4a2f1d',RV=metal?'#d8dde2':'#c9a24a',ST=metal?darker(M,0.6):'#e8d8b0',r=it.rar||0,L=[],P=(...q)=>L.push(q);
  switch(it.base){
    case 'tarcza':{const v=it.var||'okuta',W='#7a5030';if(v==='puklerz'){for(let i=0;i<12;i++){const a=i/12*Math.PI*2;P(Math.cos(a)*0.32,0.4+Math.sin(a)*0.32,0,0.16,0.16,0.08,M2)}P(0,0.4,0,0.56,0.56,0.06,M);P(0,0.4,0.05,0.18,0.18,0.08,c)}
      else if(v==='wiezowa'){P(0,0.45,0,0.6,1.0,0.06,W);for(const y of [0.0,0.9])P(0,y,0.01,0.64,0.06,0.08,M);for(const x of [-0.3,0.3])P(x,0.45,0.01,0.06,1.0,0.08,M);P(0,0.45,0.05,0.16,0.2,0.04,c)}
      else if(v==='herbowa'){for(let i=0;i<6;i++){const w=0.62-i*0.09;P(0,0.75-i*0.12,0,w,0.13,0.06,i%2?c:M)}P(0,0.45,0.04,0.07,0.66,0.02,'#f0e8d0');P(0,0.55,0.04,0.44,0.07,0.02,'#f0e8d0')}
      else{for(let i=0;i<5;i++)P(-0.24+i*0.12,0.45,0,0.115,0.74,0.06,i%2?W:'#8a5a30');P(0,0.8,0.01,0.64,0.06,0.08,M);P(0,0.1,0.01,0.64,0.06,0.08,M);P(0,0.45,0.05,0.16,0.16,0.06,c)}if(r>=3&&(v==='okuta'||v==='wiezowa'))for(const [x,y] of [[-0.22,0.72],[0.22,0.72],[-0.22,0.18],[0.22,0.18]])P(x,y,0.05,0.05,0.05,0.04,'#d8dde2');if(r>=4)P(0,0.45,0.08,0.08,0.08,0.03,'#ffffff');return L}
    case 'helm':{if(mt==='skora'||mt==='elf'){P(0,0.22,0,0.5,0.3,0.5,M);P(0,0.4,0,0.4,0.1,0.4,M3);P(0,0.47,0,0.26,0.05,0.26,M3);P(0,0.1,0,0.54,0.06,0.54,M2);for(let k=0;k<6;k++)P(-0.2+k*0.08,0.2,0.252,0.02,0.18,0.01,ST);P(0.255,0.05,0.04,0.02,0.22,0.24,M2);P(-0.255,0.05,0.04,0.02,0.22,0.24,M2);if(mt==='elf'){P(0,0.36,0.25,0.18,0.08,0.02,'#d9b23a');P(0.18,0.44,-0.1,0.04,0.2,0.06,'#5a9a4a');P(-0.18,0.44,-0.1,0.04,0.2,0.06,'#5a9a4a')}}
      else{P(0,0.2,0,0.52,0.34,0.52,M);P(0,0.4,0,0.44,0.08,0.44,M3);P(0,0.46,0,0.32,0.06,0.32,M3);P(0,0.5,0,0.16,0.04,0.16,M3);P(0,0.06,0,0.56,0.05,0.56,M2);
        P(0,0.18,0.262,0.42,0.04,0.012,'#141414');P(0,0.12,0.262,0.08,0.18,0.012,M2);for(const s of [1,-1]){P(s*0.08,0.25,0.262,0.06,0.02,0.012,'#141414');P(s*0.27,0.1,0.06,0.03,0.22,0.3,M2)}
        for(let k=0;k<5;k++)P(-0.2+k*0.1,0.06,0.282,0.025,0.025,0.012,RV);if(mt==='krasn')for(const s of [1,-1])P(s*0.3,0.34,0,0.08,0.06,0.06,'#e8e0c8'),P(s*0.36,0.42,0,0.05,0.12,0.05,'#e8e0c8');if(mt==='smok')for(let k=0;k<4;k++)P(0,0.48-k*0.05,-0.12-k*0.06,0.04,0.08,0.06,'#d8a040')}
      if(r>=2)P(0,0.11,0,0.57,0.035,0.57,c);if(r>=3)P(0,0.36,0.27,0.07,0.07,0.012,c);if(r>=4)P(0,0.44,0.22,0.14,0.08,0.02,'#d9b23a');return L}
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
    case 'potion':{const LQ='#d0303e',LQD='#8e1f26',LQL='#ff6a74',GL='#d8eef4',GLD='#a8c8d4';
      // kulista kolba z warstw
      for(const [y,w,col] of [[0.03,0.2,GLD],[0.08,0.32,LQD],[0.14,0.4,LQ],[0.21,0.42,LQ],[0.28,0.38,LQ],[0.33,0.3,LQL]])P(0,y,0,w,0.07,w*0.86,col),P(0,y,0,w*0.86,0.07,w,col);
      P(0,0.37,0,0.22,0.03,0.22,GL+'~');P(0,0.36,0,0.24,0.02,0.24,'#ff9aa2');
      P(0,0.43,0,0.12,0.1,0.12,GL);P(0,0.49,0,0.15,0.03,0.15,GLD);P(0,0.535,0,0.1,0.06,0.1,'#8a6a44');P(0,0.57,0,0.12,0.03,0.12,'#a8302a');P(0,0.555,0,0.13,0.012,0.13,'#7a1a1a');
      P(0,0.45,0,0.135,0.02,0.135,'#c9a24a');P(0.07,0.42,0.06,0.02,0.08,0.02,'#c9a24a');
      P(0.13,0.24,0.15,0.05,0.12,0.012,'#ffffff');P(0.15,0.16,0.14,0.03,0.05,0.012,'#ffd0d4');for(const [x,y] of [[-0.06,0.12],[-0.02,0.2],[0.04,0.1]])P(x,y,0.19,0.025,0.025,0.012,'#ff9aa2');
      P(0,0.2,0.2,0.18,0.12,0.012,'#e8dcb8');P(0,0.2,0.206,0.14,0.08,0.01,'#f2ead8');P(0,0.2,0.21,0.04,0.06,0.008,'#a8302a');P(0,0.2,0.21,0.08,0.02,0.008,'#a8302a');return L}
    case 'food':{const k=it.var;const ap=(c1,c2,s=1)=>{P(0,0.16*s,0,0.3*s,0.26*s,0.3*s,c1);P(0,0.16*s,0,0.34*s,0.18*s,0.24*s,c1);P(0,0.16*s,0,0.24*s,0.18*s,0.34*s,c1);P(0,0.31*s,0,0.04,0.08,0.04,'#5a3b22');P(0.05,0.33*s,0,0.1,0.03,0.06,'#5a9a4a');P(-0.08,0.22*s,0.13*s,0.06,0.06,0.03,c2)};
      switch(k){
      case 'koniczyna':for(const [a,b] of [[0.1,0],[-0.06,0.08],[-0.06,-0.08]])P(a,0.3,b,0.14,0.04,0.14,'#5aae4a'),P(a,0.32,b,0.06,0.02,0.06,'#86c870');P(0,0.15,0,0.03,0.3,0.03,'#4a8a3a');return L;
      case 'siano':P(0,0.15,0,0.42,0.3,0.32,'#d8b24a');P(0,0.15,0,0.44,0.04,0.34,'#8a6a3a');P(0.12,0.15,0,0.04,0.32,0.34,'#8a6a3a');P(-0.12,0.15,0,0.04,0.32,0.34,'#8a6a3a');for(let i=0;i<6;i++)P(-0.18+i*0.07,0.31+(i%2)*0.02,0.05,0.02,0.04,0.2,'#e8c860');return L;
      case 'jablko':ap('#c8302a','#ff8a7a');P(0.1,0.24,0.12,0.04,0.08,0.02,'#ffb0a0');P(0,0.06,0,0.18,0.04,0.18,'#8a1a14');P(0.11,0.3,0,0.08,0.02,0.05,'#6aae4a');return L;
      case 'zlote_jablko':ap('#e0b030','#fff0a0');P(0,0.16,0,0.36,0.04,0.36,'#ffe080');return L;
      case 'ziarno':P(0,0.06,0,0.36,0.1,0.36,'#8a6a3a');for(let i=0;i<9;i++)P(-0.12+(i%3)*0.12,0.13+(i%2)*0.02,-0.12+Math.floor(i/3)*0.12,0.07,0.05,0.05,'#e0c060');return L;
      case 'owies':P(0,0.18,0,0.32,0.34,0.28,'#c8b080');P(0,0.36,0,0.2,0.06,0.18,'#a89060');P(0,0.4,0,0.1,0.04,0.1,'#6b4a2b');P(0,0.2,0.145,0.16,0.12,0.01,'#8a6a3a');for(let i=0;i<4;i++)P(-0.06+i*0.04,0.46,0,0.02,0.1,0.02,'#e0c870');return L;
      case 'marchew':for(let k2=0;k2<5;k2++)P(0,0.04+k2*0.08,0,0.06+k2*0.025,0.09,0.06+k2*0.025,k2%2?'#e87a20':'#f08a30');P(0.03,0.45,0,0.03,0.12,0.03,'#4a9a3a');P(-0.03,0.45,0.02,0.03,0.1,0.03,'#5aae4a');return L;
      case 'jagody':P(0,0.05,0,0.38,0.08,0.32,'#8a6a3a');for(const x of [-0.12,-0.04,0.04,0.12])P(x,0.05,0.165,0.03,0.08,0.012,'#6a4a2a');for(const [a,b,cc] of [[0.14,-0.08,'#3a2a7a'],[-0.14,-0.06,'#4a2a6a'],[0.03,0.08,'#2a2a6a'],[-0.03,-0.12,'#5a2a8a']])P(a,0.17,b,0.07,0.07,0.07,cc),P(a+0.015,0.2,b+0.015,0.02,0.02,0.02,'#c8c0f0');for(const [a,b,cc] of [[0,0,'#3a3a8a'],[0.1,0.06,'#4a2a6a'],[-0.1,0.05,'#2a2a6a'],[0.05,-0.08,'#5a2a8a'],[-0.06,-0.07,'#3a3a8a'],[0,0.1,'#a8302a']])P(a,0.14,b,0.08,0.08,0.08,cc);P(0.12,0.2,-0.06,0.08,0.02,0.05,'#4a8a3a');return L;
      case 'kurczak':P(0,0.04,0,0.46,0.04,0.36,'#d8d0c0');P(0,0.12,0,0.34,0.2,0.26,'#b8702a');P(0,0.2,0,0.28,0.1,0.2,'#d08a3a');P(0,0.25,0,0.2,0.03,0.12,'#e8a050');P(-0.1,0.17,0.12,0.06,0.04,0.02,'#8a4a1a');P(0.08,0.2,-0.1,0.05,0.03,0.02,'#8a4a1a');for(const s of [1,-1])P(s*0.14,0.08,0.14,0.08,0.08,0.16,'#b8702a'),P(s*0.14,0.08,0.24,0.04,0.04,0.06,'#f2ead8');return L;
      case 'miod':P(0,0.06,0,0.38,0.1,0.32,'#c88a10');for(let r=0;r<3;r++)for(let q=0;q<4;q++){const x=-0.14+q*0.09+(r%2)*0.045,z=-0.09+r*0.09;if(Math.abs(x)<0.18){P(x,0.12,z,0.075,0.03,0.075,'#f8c840');P(x,0.13,z,0.045,0.02,0.045,'#e09010')}}P(0.14,0.06,0.17,0.04,0.08,0.03,'#e0a020');P(0.14,0.0,0.17,0.03,0.04,0.03,'#f0b030');P(-0.1,0.16,-0.05,0.04,0.02,0.04,'#ffe080');return L;
      case 'daktyle':for(const [a,b] of [[0,0],[0.1,0.05],[-0.1,0.04],[0.04,-0.09],[-0.06,-0.08]])P(a,0.08,b,0.08,0.08,0.16,'#6a3a1a'),P(a,0.11,b,0.05,0.03,0.12,'#8a5a2a');return L;
      case 'szarancza':P(0,0.1,0,0.1,0.1,0.36,'#7a9a3a');P(0,0.13,0.17,0.1,0.1,0.08,'#6a8a2a');for(const s of [1,-1])P(s*0.08,0.14,-0.04,0.04,0.16,0.06,'#5a7a2a'),P(s*0.06,0.16,0.04,0.02,0.06,0.2,'#a8c870');return L;
      case 'sledz':case 'ryba':{const c1=k==='sledz'?'#9ab0c0':'#a88a5a',c2=darker(c1,0.75),c3=darker(c1,1.2);P(0,0.13,0,0.12,0.16,0.44,c1);P(0,0.13,0.04,0.13,0.2,0.24,c1);P(0,0.13,0.2,0.11,0.12,0.08,c1);P(0,0.13,0.25,0.09,0.08,0.04,c2);P(0,0.19,0,0.122,0.04,0.4,c2);P(0,0.08,0.02,0.122,0.04,0.36,c3);for(const z of [-0.12,-0.04,0.04,0.12])P(0,0.14,z,0.124,0.12,0.012,c2);P(0,0.13,-0.27,0.03,0.24,0.06,c2);P(0,0.13,-0.3,0.025,0.3,0.03,c1);P(0,0.25,-0.02,0.02,0.06,0.18,c2);P(0,0.03,0.0,0.02,0.04,0.1,c2);P(0.062,0.16,0.18,0.012,0.04,0.04,'#f2ead8');P(0.068,0.16,0.185,0.008,0.022,0.022,'#141414');return L}
      case 'porost':for(const [a,b,cc] of [[0,0,'#8a9a6a'],[0.1,0.05,'#a8b080'],[-0.08,0.06,'#7a8a5a'],[0.03,-0.1,'#98a870']])P(a,0.08,b,0.14,0.12,0.14,cc);return L;
      case 'sol':P(0,0.12,0,0.3,0.24,0.26,'#f2eee6');P(0.06,0.2,0.04,0.16,0.16,0.16,'#ffffff');P(-0.08,0.08,-0.06,0.12,0.12,0.12,'#e0dcd4');return L;
      case 'chleb':P(0,0.1,0,0.4,0.18,0.26,'#c88a3a');P(0,0.12,0,0.44,0.12,0.2,'#c88a3a');P(0,0.2,0,0.34,0.06,0.2,'#a86a2a');P(0,0.235,0,0.26,0.02,0.14,'#8a5420');for(const x of [-0.1,0,0.1])P(x,0.245,0,0.03,0.015,0.16,'#f0d090');P(0,0.04,0,0.42,0.04,0.28,'#7a4a18');P(0.26,0.07,0.12,0.09,0.08,0.09,'#d8a050');P(0.26,0.11,0.12,0.06,0.02,0.06,'#f2d8a0');return L;
      case 'wodorosty':for(let i=0;i<4;i++)P(-0.09+i*0.06,0.18,0,0.04,0.36-(i%2)*0.08,0.06,i%2?'#3a7a4a':'#2a6a3a');P(0,0.04,0,0.3,0.06,0.16,'#5a8a5a');return L;
      case 'kielbasa':for(let i=0;i<5;i++)P(-0.16+i*0.08,0.1+Math.sin(i*0.8)*0.05,0,0.09,0.1,0.1,i%2?'#a8402a':'#b8503a');P(0.22,0.14,0,0.03,0.04,0.03,'#d8c8a0');return L;
      case 'mieso':P(-0.04,0.1,0,0.34,0.16,0.28,'#c84a4a');P(-0.04,0.12,0,0.38,0.12,0.22,'#c84a4a');P(-0.04,0.19,0,0.3,0.02,0.2,'#e06a6a');for(const [x,z] of [[-0.12,0.06],[0.02,-0.06],[-0.06,-0.02]])P(x,0.2,z,0.08,0.01,0.025,'#f2d8d0');P(-0.04,0.1,0.14,0.34,0.14,0.012,'#f2e0d4');P(0.18,0.1,0,0.14,0.06,0.06,'#f2ead8');P(0.27,0.1,0,0.06,0.11,0.11,'#f2ead8');P(0.27,0.1,0,0.08,0.06,0.06,'#e8dcc8');return L;
      case 'zoledzie':for(const [a,b] of [[0,0],[0.12,0.05],[-0.1,0.06]])P(a,0.08,b,0.1,0.12,0.1,'#a87a3a'),P(a,0.16,b,0.12,0.05,0.12,'#6a4a2a'),P(a,0.2,b,0.02,0.04,0.02,'#4a2f1d');return L;
      case 'galareta':P(0,0.12,0,0.3,0.24,0.3,'#7ad15a~');P(0,0.12,0,0.2,0.16,0.2,'#a8f080');P(0.06,0.2,0.08,0.05,0.05,0.05,'#ffffff');return L;
      case 'malze':for(const [a,b] of [[0,0],[0.12,0.06],[-0.11,0.05]])P(a,0.06,b,0.12,0.08,0.09,'#3a3a5a'),P(a,0.1,b,0.1,0.02,0.07,'#5a5a7a');return L;
      case 'muchy':P(0,0.16,0,0.26,0.3,0.26,'#cfe6ee~');P(0,0.33,0,0.28,0.05,0.28,'#8a6a3a');for(const [a,b,cc] of [[0.05,0.12,0],[-0.05,0.2,0.05],[0,0.08,-0.06]])P(a,b,cc,0.04,0.03,0.04,'#1a1a1a');return L;
      case 'jajo':P(0,0.16,0,0.24,0.3,0.24,'#e8e0c8');P(0,0.16,0,0.28,0.2,0.28,'#e8e0c8');P(0,0.32,0,0.14,0.04,0.14,'#f2ead8');P(0.08,0.2,0.13,0.04,0.04,0.02,'#8a2a8a');P(-0.05,0.1,0.14,0.03,0.03,0.02,'#8a2a8a');return L;
      case 'skarabeusz':P(0,0.08,0,0.26,0.12,0.32,'#2a6a7a');P(0,0.14,0,0.02,0.02,0.32,'#1a3a4a');P(0,0.1,0.18,0.14,0.08,0.08,'#1a4a5a');for(const s of [1,-1])P(s*0.15,0.04,0,0.06,0.03,0.24,'#1a2a2a');P(0.06,0.15,0.04,0.04,0.02,0.06,'#d9b23a');return L;
      case 'lod':P(0,0.14,0,0.2,0.28,0.2,'#bfe8ff');P(0.1,0.1,0.05,0.1,0.2,0.1,'#dff4ff');P(-0.08,0.08,-0.06,0.1,0.16,0.1,'#9fd8f8');P(0,0.3,0,0.08,0.08,0.08,'#ffffff');return L;
      case 'ziola':P(0,0.12,0,0.34,0.22,0.26,'#8aa04a');P(0,0.12,0,0.36,0.04,0.28,'#6a4a2a');for(let i=0;i<5;i++)P(-0.12+i*0.06,0.28,0.02,0.03,0.12,0.03,i%2?'#c8d070':'#a8c060');return L;
      case 'galazki':for(let i=0;i<5;i++)P(-0.12+i*0.06,0.06+(i%2)*0.03,0,0.04,0.04,0.44,i%2?'#8a6a3a':'#6a4a2a');P(0.1,0.14,0.12,0.1,0.04,0.06,'#6aae4a');return L;
      case 'robaki':P(0,0.05,0,0.36,0.08,0.36,'#5a3a22');for(let i=0;i<4;i++)P(-0.1+i*0.07,0.11,-0.08+(i%2)*0.14,0.04,0.04,0.16,'#d88a8a');return L;
      case 'krewetki':for(const [a,b] of [[0,0],[0.1,0.08],[-0.1,-0.06]])P(a,0.08,b,0.08,0.08,0.22,'#f08a6a'),P(a,0.1,b+0.1,0.06,0.06,0.06,'#e86a4a');return L;
      case 'mrozne_serce':P(0,0.16,0,0.24,0.24,0.18,'#7fd8ff');P(0,0.2,0,0.3,0.12,0.2,'#a8e8ff');P(0,0.06,0,0.1,0.1,0.1,'#5ab8e8');P(0.05,0.24,0.1,0.05,0.05,0.02,'#ffffff');return L;
      case 'zatrute_mieso':P(0,0.1,0,0.36,0.16,0.26,'#7a3a3a');P(0,0.18,0,0.3,0.04,0.2,'#6aae3a');P(0.1,0.2,0.06,0.06,0.04,0.06,'#9ae05a');return L;
      case 'krysztal':P(0,0.14,0,0.2,0.28,0.2,'#e0303a');P(0.1,0.1,0.05,0.1,0.2,0.1,'#ff6a6a');P(-0.08,0.08,-0.06,0.1,0.16,0.1,'#b0202a');P(0,0.3,0,0.08,0.08,0.08,'#ffd0d0');return L;
      default:ap('#8a6a3a','#c8a060');return L}}
  }return null}

function weaponGeoOld(base,rar){
  const c=RAR[rar].c,y=-0.3;
  if(base==='kostur')return boxes([[0,y,0.25,0.07,0.07,1.5,'#5a3b22'],[0,y,1.03,0.13,0.13,0.06,'#c9a64a'],[0,y,1.14,0.22,0.22,0.22,c],[0,y,0.0,0.09,0.09,0.12,'#3a2416']]);
  if(base==='topor')return boxes([[0,y,0.33,0.07,0.07,0.95,'#6b4a2b'],[0,y+0.15,0.68,0.05,0.36,0.26,'#c9cfd4'],[0,y+0.15,0.57,0.06,0.3,0.06,'#8a8f94'],[0,y-0.05,0.68,0.06,0.07,0.09,c],[0,y,0.0,0.08,0.08,0.08,'#3a2416']]);
  if(base==='mlot')return boxes([[0,y,0.38,0.08,0.08,1.05,'#6b4a2b'],[0,y,0.9,0.36,0.26,0.26,'#8a8f94'],[0,y+0.14,0.9,0.18,0.03,0.18,c],[0.19,y,0.9,0.03,0.18,0.18,'#6f747a'],[-0.19,y,0.9,0.03,0.18,0.18,'#6f747a']]);
  if(base==='wlocznia')return boxes([[0,y,0.55,0.06,0.06,1.75,'#7a5230'],[0,y,1.5,0.1,0.03,0.3,'#d7dde2'],[0,y,1.36,0.12,0.06,0.06,c],[0,y,1.12,0.07,0.07,0.1,'#3a2416']]);
  if(base==='buzdygan')return boxes([[0,y,0.3,0.07,0.07,0.8,'#5a3b22'],[0,y,0.78,0.24,0.24,0.24,'#8a8f94'],[0,y+0.14,0.78,0.06,0.06,0.18,'#aeb6bd'],[0,y-0.14,0.78,0.06,0.06,0.18,'#aeb6bd'],[0.14,y,0.78,0.06,0.18,0.06,'#aeb6bd'],[-0.14,y,0.78,0.06,0.18,0.06,'#aeb6bd'],[0,y,0.92,0.08,0.08,0.06,c]]);
  if(base==='szabla')return boxes([[0,y,0.03,0.06,0.06,0.2,'#5a3b22'],[0,y,0.15,0.22,0.06,0.05,c],[0,y+0.02,0.5,0.09,0.035,0.6,'#d7dde2'],[0,y+0.06,0.88,0.08,0.035,0.25,'#d7dde2'],[0,y+0.1,1.04,0.06,0.03,0.14,'#c8cdd2']]);
  if(base==='halabarda')return boxes([[0,y,0.6,0.07,0.07,1.9,'#6b4a2b'],[0,y+0.14,1.4,0.04,0.34,0.3,'#c9cfd4'],[0,y-0.08,1.4,0.04,0.12,0.14,'#c9cfd4'],[0,y,1.65,0.05,0.05,0.34,'#d7dde2'],[0,y,1.28,0.09,0.09,0.06,c]]);
  if(base==='kusza')return boxes([[0,y,0.3,0.08,0.1,0.7,'#6b4a2b'],[0,y+0.02,0.6,0.7,0.06,0.06,'#5a3b22'],[0.34,y+0.02,0.55,0.04,0.04,0.12,'#3a2416'],[-0.34,y+0.02,0.55,0.04,0.04,0.12,'#3a2416'],[0,y+0.06,0.4,0.02,0.02,0.5,'#e8e2cc'],[0,y-0.08,0.15,0.05,0.12,0.05,c]]);
  if(base==='rozdzka')return boxes([[0,y,0.25,0.05,0.05,0.6,'#e8dcc0'],[0,y,0.58,0.08,0.08,0.06,'#c9a64a'],[0,y,0.66,0.12,0.12,0.12,c]]);
  if(base==='sztylet')return boxes([[0,y,0.05,0.06,0.06,0.16,'#4a3020'],[0,y,0.15,0.18,0.04,0.04,c],[0,y,0.36,0.06,0.03,0.38,'#d7dde2'],[0,y,0.36,0.02,0.035,0.34,'#aeb6bd']]);
  return boxes([[0,y,0.03,0.07,0.07,0.22,'#5a3b22'],[0,y,-0.1,0.09,0.09,0.06,c],[0,y,0.17,0.34,0.07,0.07,'#8f949a'],[0,y,0.66,0.1,0.04,0.86,'#d7dde2'],[0,y,0.66,0.03,0.045,0.8,'#aeb6bd'],[0,y,1.12,0.06,0.04,0.08,'#d7dde2']]);
}
const arrowNockGeo=()=>boxes([[0,0,0,0.035,0.035,0.78,'#8a6a44'],[0,0,0.4,0.06,0.06,0.09,'#b8bec4'],[0,0.04,-0.33,0.01,0.06,0.12,'#f2efe6'],[0.04,0,-0.33,0.06,0.01,0.12,'#e04a3a']]);
function bowDraw(g,draw,showArrow){const u=g.userData;if(!u.bow)return;const s=u.bow.userData,a=Math.atan2(draw*0.56,0.64);s.sU.rotation.x=a;s.sD.rotation.x=-a;
  if(u.nock){u.nock.visible=showArrow;if(showArrow){u.nock.position.set(-0.05,1.34,0.62-draw*0.32)}}}
// ===== broń dwuręczna: lewa dłoń chwyta drzewce/łoże (IK dwóch kości w układzie tułowia) =====
const TWOSET=new Set(),_ik={a:new THREE.Vector3(),b:new THREE.Vector3(),c:new THREE.Vector3(),d:new THREE.Vector3(),q:new THREE.Quaternion(),q2:new THREE.Quaternion(),dn:new THREE.Vector3(0,-1,0),m:new THREE.Matrix4()};
function ikGrip(u){if(u.ikGrip)return u.ikGrip;if(u.wkey&&u.wkey.startsWith('kusza'))return u.ikGrip=[0,-0.31,0.34];const g=u.wm.geometry,P=g.attributes.position.array,H=[0,-0.3,0.02];let far=0,fx=0,fy=0,fz=1;
  for(let i=0;i<P.length;i+=3){const dx=P[i]-H[0],dy=P[i+1]-H[1],dz=P[i+2]-H[2],d=dx*dx+dy*dy+dz*dz;if(d>far){far=d;fx=dx;fy=dy;fz=dz}}
  const L=Math.sqrt(far)||1,k=u.wkey&&u.wkey.startsWith('kusza')?Math.min(0.42,L*0.55):Math.min(0.34,L*0.32);return u.ikGrip=[H[0]+fx/L*k,H[1]+fy/L*k,H[2]+fz/L*k]}
function twoHandIK(g){const u=g.userData;if(!u||!u.two||!u.wm||!u.la||!u.le||!u.ra||!u.re||u.ikOff||u.blockPose){if(u&&u._ik&&u.la){u.la.rotation.y=0;u.la.rotation.z=0;u.le.rotation.y=0;u.le.rotation.z=0;u._ik=0}return}
  const I=_ik,G=ikGrip(u);u.ra.updateMatrix();u.re.updateMatrix();u.wm.updateMatrix();I.m.multiplyMatrices(u.ra.matrix,u.re.matrix).multiply(u.wm.matrix);
  // oś drzewca: od dłoni (0,-0.3,0.02) w stronę punktu chwytu; lewa dłoń łapie najbliższy lewemu barkowi punkt drzewca
  I.c.set(0,-0.3,0.02).applyMatrix4(I.m);I.d.set(G[0],G[1],G[2]).applyMatrix4(I.m).sub(I.c);const gl=I.d.length()||1;I.d.multiplyScalar(1/gl);
  const S=u.la.position,sc=u.la.scale.y||1,L1=0.28*sc,L2=0.3*sc;I.b.copy(S).sub(I.c);const tt=Math.max(u.wkey&&u.wkey.startsWith('kusza')?0.18:-0.22,Math.min(gl*1.3,I.b.dot(I.d)));const t2=Math.abs(tt)<0.13?(tt<0?-0.13:0.13):tt;I.a.copy(I.c).addScaledVector(I.d,t2);
  I.b.copy(I.a).sub(S);let D=I.b.length();if(D<1e-4)return;if(D>L1+L2+0.35){if(u._ik){u.la.rotation.y=0;u.la.rotation.z=0;u.le.rotation.y=0;u.le.rotation.z=0;u._ik=0}return}const t=I.b.multiplyScalar(1/D);D=Math.min(L1+L2-0.005,Math.max(Math.abs(L1-L2)+0.02,D));
  const ca=Math.max(-1,Math.min(1,(L1*L1+D*D-L2*L2)/(2*L1*D))),sa=Math.sqrt(1-ca*ca);I.c.set(-0.45,-0.55,-0.7);I.c.addScaledVector(t,-I.c.dot(t));if(I.c.lengthSq()<1e-6)I.c.set(0,0,-1);I.c.normalize();
  const uX=t.x*ca+I.c.x*sa,uY=t.y*ca+I.c.y*sa,uZ=t.z*ca+I.c.z*sa;I.d.set(uX,uY,uZ);I.q.setFromUnitVectors(I.dn,I.d);u.la.quaternion.copy(I.q);
  I.c.set(S.x+uX*L1,S.y+uY*L1,S.z+uZ*L1);I.b.copy(I.a).sub(I.c).normalize();I.q2.setFromUnitVectors(I.dn,I.b);u.le.quaternion.copy(I.q.invert()).multiply(I.q2);u._ik=1}
const _bk={a:new THREE.Vector3(),b:new THREE.Vector3(),c:new THREE.Vector3(),m:new THREE.Matrix4(),m2:new THREE.Matrix4(),q:new THREE.Quaternion(),z:new THREE.Vector3(0,0,1)},BOWSET=new Set();
function armIK(sh,el,T,pole){const I=_ik,S=sh.position,sc=sh.scale.y||1,L1=0.28*sc,L2=0.3*sc;I.b.copy(T).sub(S);let D=I.b.length();if(D<1e-4)return;const t=I.b.multiplyScalar(1/D);D=Math.min(L1+L2-0.005,Math.max(Math.abs(L1-L2)+0.02,D));
  const ca=Math.max(-1,Math.min(1,(L1*L1+D*D-L2*L2)/(2*L1*D))),sa=Math.sqrt(1-ca*ca);I.c.copy(pole);I.c.addScaledVector(t,-I.c.dot(t));if(I.c.lengthSq()<1e-6)I.c.set(0,0,-1);I.c.normalize();
  I.d.set(t.x*ca+I.c.x*sa,t.y*ca+I.c.y*sa,t.z*ca+I.c.z*sa);I.q.setFromUnitVectors(I.dn,I.d);sh.quaternion.copy(I.q);I.c.copy(S).addScaledVector(I.d,L1);I.b.copy(T).sub(I.c).normalize();I.q2.setFromUnitVectors(I.dn,I.b);el.quaternion.copy(I.q.invert()).multiply(I.q2)}
function bowIK(g){const u=g.userData,B=u.bowIK;if(!B||!u.bow||!u.la||!u.le||!u.ra||!u.re||!u.torso)return;const K=_bk;u.la.updateMatrix();u.le.updateMatrix();u.torso.updateMatrix();
  K.m.multiplyMatrices(u.la.matrix,u.le.matrix);K.a.set(0,-0.3,0.02).applyMatrix4(K.m);// chwyt łuku (torso)
  K.b.set(0,-0.13,0).applyMatrix4(K.m);K.c.set(0.06,0.6,0.16);K.b.lerp(K.c,B.d*0.92);// cięciwa / nasada strzały (torso)
  armIK(u.ra,u.re,K.b,new THREE.Vector3(0.35,0.3,-1));u._bik=1;
  if(u.nock&&B.arrow){K.c.copy(K.a).sub(K.b);const L=K.c.length()||1;K.c.multiplyScalar(1/L);const P=K.b.clone().addScaledVector(K.c,0.39).applyMatrix4(u.torso.matrix);u.nock.position.copy(P);K.q.setFromUnitVectors(K.z,K.c);const tq=new THREE.Quaternion().setFromRotationMatrix(K.m2.extractRotation(u.torso.matrix));u.nock.quaternion.copy(tq.multiply(K.q));u.nock.visible=true}}
function ikTick(){for(const g of BOWSET){const u=g.userData;if(!u||!u.bowIK){if(u&&u._bik){u._bik=0;u.ra.rotation.y=0;u.re.rotation.y=0;u.re.rotation.z=0}BOWSET.delete(g);continue}let o=g,ok=false;for(let i=0;i<14&&o;i++){if(o===scene){ok=true;break}o=o.parent}if(ok&&g.visible)try{bowIK(g)}catch(_){}u.bowIK=null}
  for(const g of TWOSET){const u=g.userData;if(!u||!u.two){TWOSET.delete(g);continue}let o=g,ok=false;for(let i=0;i<14&&o;i++){if(o===scene){ok=true;break}o=o.parent}if(!ok)continue;if(!g.visible)continue;try{twoHandIK(g)}catch(_){}}}
function setWeapon(g,base,rar,vr,lk,sd){
  if(base&&!vr&&WEAPV[base]){const d=WEAPV[base].find(v=>v[2]===1&&v[3]===1)||WEAPV[base][0];vr=d[0]}
  const u=g.userData;const wk=base+rar+(vr||'')+(lk||0)+'.'+(sd||0);if(u.wkey===wk)return;u.wkey=wk;
  for(const k of ['wm','wm2','bow','quiver','nock']){if(u[k]){u[k].parent&&u[k].parent.remove(u[k]);u[k]=null}}u.two=false;
  if(!base)return;
  if(base==='luk'){u.bow=bowGroup(rar,vr,lk,sd);u.le.add(u.bow);
    u.quiver=new THREE.Mesh(boxes([[0.12, 0.36, -0.26, 0.24, 0.74, 0.2, '#7a4e2c'], [0.12, 0.36, -0.37, 0.2, 0.68, 0.02, '#5e3a20'], [0.12, 0.03, -0.26, 0.27, 0.07, 0.23, '#3e2716'], [0.12, 0.7, -0.26, 0.27, 0.07, 0.23, '#3e2716'], [0.12, 0.36, -0.26, 0.27, 0.05, 0.23, '#c9a24a'], [0.24, 0.36, -0.26, 0.02, 0.4, 0.1, '#a5432f'], [0.06, 0.82, -0.21, 0.025, 0.18, 0.025, '#8a6a44'], [0.06, 0.9299999999999999, -0.21, 0.02, 0.09, 0.08, '#e04a3a'], [0.15, 0.84, -0.2, 0.025, 0.22, 0.025, '#8a6a44'], [0.15, 0.97, -0.2, 0.02, 0.09, 0.08, '#f2efe6'], [0.09, 0.86, -0.3, 0.025, 0.26, 0.025, '#8a6a44'], [0.09, 1.01, -0.3, 0.02, 0.09, 0.08, '#4a8ad8'], [0.17, 0.82, -0.31, 0.025, 0.18, 0.025, '#8a6a44'], [0.17, 0.9299999999999999, -0.31, 0.02, 0.09, 0.08, '#f2efe6'], [0.12, 0.84, -0.25, 0.025, 0.22, 0.025, '#8a6a44'], [0.12, 0.97, -0.25, 0.02, 0.09, 0.08, '#e0b03a'], [0.05, 0.86, -0.32, 0.025, 0.26, 0.025, '#8a6a44'], [0.05, 1.01, -0.32, 0.02, 0.09, 0.08, '#e04a3a']]),decoMat);
    u.quiver.rotation.z=-0.35;u.torso.add(u.quiver);u.nock=new THREE.Mesh(arrowNockGeo(),decoMat);u.nock.visible=false;g.add(u.nock);return}
  {const gg=weaponGeo(base,rar,vr,lk,false,sd);u.wm=new THREE.Mesh(gg,decoMat);u.wm.castShadow=true;u.re.add(u.wm);u.two=['mlot','halabarda','wlocznia','kusza','kostur'].includes(base)||vr==='dwureczny'||vr==='poltora'||vr==='wielki';u.ikGrip=null;if(u.two)TWOSET.add(g);if(gg.userData.glowGeo)u.wm.add(new THREE.Mesh(gg.userData.glowGeo,GLOWMAT))}
  if(base==='sztylet'){u.wm2=new THREE.Mesh(weaponGeo(base,rar,vr,lk,false,sd),decoMat);u.le.add(u.wm2)}
}
// ---------- smuga cięcia ----------
const slashes=[];
function slashFx(g,combo,color){
  const geo=combo===2?new THREE.RingGeometry(0.9,1.6,20,1,Math.PI/2-0.3,1.7):new THREE.RingGeometry(0.85,1.55,20,1,-Math.PI/2-1.1,2.2);
  const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:new THREE.Color(color),transparent:true,opacity:0.55,side:THREE.DoubleSide,depthWrite:false}));
  const h=new THREE.Group();h.position.copy(g.position);h.position.y+=combo===2?0.5:1.15;h.rotation.y=g.rotation.y;
  if(combo===2){m.rotation.y=Math.PI/2}else{m.rotation.x=-Math.PI/2;if(combo===1)m.scale.x=-1}
  h.add(m);scene.add(h);slashes.push({h,m,t:0});
}
function slashTick(dt){for(let i=slashes.length-1;i>=0;i--){const s=slashes[i];s.t+=dt;s.m.material.opacity=0.55*(1-s.t/0.2);if(s.t>=0.2){scene.remove(s.h);s.m.geometry.dispose();s.m.material.dispose();slashes.splice(i,1)}}}

function nameTag(text,hex){
  const cv=document.createElement('canvas');cv.width=512;cv.height=64;const x=cv.getContext('2d');
  x.font='700 30px "Alegreya Sans", sans-serif';x.textAlign='center';x.fillStyle='rgba(0,0,0,.45)';const w=x.measureText(text).width+28;x.fillRect(256-w/2,10,w,44);
  x.fillStyle=hex;x.fillRect(256-w/2,50,w,4);x.fillStyle='#fff';x.fillText(text,256,43);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false}));sp.scale.set(4,0.5,1);sp.position.y=2.35;sp.renderOrder=5;return sp;
}

// ---------- chunki ----------
const chunks=new Map(), K=(x,z)=>x+','+z;
const hcache=new Map(); // wysokości terenu wokół zdalnych graczy (host)
const thumbs=new Map(); // odkryte chunki: miniatury
// ===== królestwa (nowe światy) =====
const KR=2200,KING=new Map(),kingReq=new Set();let kingCur=null;
const KTITLE={ludzie:'Królestwo',elfy:'Królestwo elfów',krasnoludy:'Królestwo krasnoludów',orkowie:'Horda orków',niziolki:'Kraina niziołków',drowy:'Imperium drowów',saurianie:'Plemiona Saurian'},KCOL={niziolki:'#d8f0a0',drowy:'#d0a8ff',saurianie:'#9ae8a8',ludzie:'#ffe7a8',elfy:'#b8f0a0',krasnoludy:'#ffc890',orkowie:'#ff9a8a'};
const kName=k=>k?KTITLE[k.race]+' '+k.name:'';
function kwarp(x,z){return[x+160*Math.sin(z/510)+90*Math.sin(z/170+1.3),z+160*Math.sin(x/530+0.7)+90*Math.sin(x/190+2.1)]}
function kingRequest(cells){const need=cells.filter(c=>!kingReq.has(c[0]+','+c[1]));if(!need.length)return;for(const c of need)kingReq.add(c[0]+','+c[1]);const w=workers[0];w.busy++;w.postMessage({type:'kingdoms',seed:S.seed,cells:need,id:reqId++})}
function kingdomAtM(x,z,noReq){if(S.gen!==2)return null;const [wx,wz]=kwarp(x,z),gx=Math.floor(wx/KR),gz=Math.floor(wz/KR);let best=null,bd=1e18;const miss=[];for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const k=KING.get((gx+dx)+','+(gz+dz));if(!k){miss.push([gx+dx,gz+dz]);continue}const dd=(k.x-wx)**2+(k.z-wz)**2;if(dd<bd){bd=dd;best=k}}if(miss.length){if(!noReq)kingRequest(miss);return null}return best}
let kherbT=0;function kherbShow(k){const el=document.getElementById('kherb');if(!el)return;try{herbDraw(el.querySelector('canvas'),kHerb(k))}catch(e){}el.querySelector('b').textContent=kName(k);el.querySelector('b').style.color=KCOL[k.race];el.classList.add('on');clearTimeout(kherbT);kherbT=setTimeout(()=>el.classList.remove('on'),6500)}
function kingTick(){if(S.gen!==2){kingCur=null;return}const k=kingdomAtM(player.p.x,player.p.z);if(k&&(!kingCur||kingCur.id!==k.id)){if(kingCur)toast('Wkraczasz: '+kName(k),KCOL[k.race]);else toast(kName(k),KCOL[k.race]);kingCur=k;kherbShow(k)}}

const MAPH=new Map(),MAPT=new Map(); // odkryte chunki: wysokości 16x16 i drzewa do mapy 3D
let reqId=1;
const NW=Math.max(2,Math.min(6,(navigator.hardwareConcurrency||4)-1));
const wsrc=document.getElementById('wk').textContent;
const wurl=URL.createObjectURL(new Blob([wsrc],{type:'text/javascript'}));
const workers=[]; const results=[];
let spawnCb=null,spawnCb2=false;
for(let i=0;i<NW;i++){const w=new Worker(wurl);{const _pm=w.postMessage.bind(w);w.postMessage=(msg,tr)=>_pm(Object.assign({gen:S.gen||1},msg),tr)}w.busy=0;w.onerror=e=>window.__err('worker: '+(e.message||'?')+' l.'+e.lineno);w.onmessage=e=>{w.busy--;const d=e.data;if(d.type==='kingdoms'){for(const k of d.list)KING.set(k.gx+','+k.gz,k);return}if(d.type==='spawn'){if(spawnCb2&&!spawnCb){spawnCb2=false;S.spawn=[d.x,d.h,d.z];LS.set('spawn',{seed:d.seed,p:S.spawn});return}spawnCb&&spawnCb(d);return}if(d.type==='vill'){onVill(d.list);return}if(d.type==='city'){onCity(d.list);return}if(d.type==='roads'){onRoads(d.list);return}if(d.type==='str'){onStr(d.list);return}if(d.type==='hmap'){hreq.delete(K(d.cx,d.cz));if(d.seed===S.seed)hcache.set(K(d.cx,d.cz),{heights:d.heights,biomes:d.biomes,wlev:d.wlev,cx:d.cx,cz:d.cz});return}results.push(d)};workers.push(w)}
const lodFor=d=>d<=3.2?1:d<=6.5?2:d<=12.5?4:8;
function wantLod(cx,cz){const d=Math.hypot(cx-pc.x,cz-pc.z);return lodFor(d)}
const pc={x:0,z:0};
function updateChunks(){
  if(!player.ready||!S.spawn)return;
  pc.x=Math.floor(player.p.x/C); pc.z=Math.floor(player.p.z/C);
  const r=S.rd, need=[];
  for(let dz=-r;dz<=r;dz++)for(let dx=-r;dx<=r;dx++){
    const d=Math.hypot(dx,dz); if(d>r+0.5)continue;
    const cx=pc.x+dx, cz=pc.z+dz, k=K(cx,cz), ch=chunks.get(k), lod=lodFor(d);
    if(!ch) need.push([d,cx,cz,lod]);
    else if(ch.lod!==lod&&ch.pend!==lod) need.push([d+0.3,cx,cz,lod]);
  }
  need.sort((a,b)=>a[0]-b[0]);
  for(const [d,cx,cz,lod] of need){
    const w=workers.reduce((a,b)=>a.busy<=b.busy?a:b); if(w.busy>=2)break;
    let ch=chunks.get(K(cx,cz)); if(!ch){ch={cx,cz,lod:0,mesh:null,heights:null,decos:null,pend:0};chunks.set(K(cx,cz),ch)}
    ch.pend=lod; w.busy++; {const dg=digFor(cx,cz);w.postMessage({type:'chunk',seed:S.seed,id:reqId++,cx,cz,lod,sx:S.spawn[0],sz:S.spawn[2],dig:dg.length?dg:null})}
  }
  for(const [k,ch] of chunks){ if(Math.hypot(ch.cx-pc.x,ch.cz-pc.z)>r+1.6) unload(k,ch) }
}
function unload(k,ch){voxRemove('T'+k);if(ch.micro){scene.remove(ch.micro);ch.micro=null}if(ch.wmesh){scene.remove(ch.wmesh);ch.wmesh.geometry.dispose();ch.wmesh=null}
  if(ch.mesh){scene.remove(ch.mesh);ch.mesh.geometry.dispose()}
  instDirty=true;
  chunks.delete(k);
}
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_v=new THREE.Vector3(),_s=new THREE.Vector3(),_c=new THREE.Color(),_up=new THREE.Vector3(0,1,0);
// drobne voxele na terenie: kamyki, kępki trawy, kwiatki (tylko bliskie chunki)
const MICRO_GEO=new THREE.BoxGeometry(1,1,1);MICRO_GEO.translate(0,0.5,0);const MICRO_MAT=new THREE.MeshLambertMaterial({color:0xffffff});try{seasonPatch(MICRO_MAT,false)}catch(_){}
function microVox(ch,m,mesh){if(ch.micro){scene.remove(ch.micro);ch.micro=null}if(m.lod!==1||!m.heights||!m.biomes)return;const H=m.heights,Bi=m.biomes,list=[],x0=m.cx*C,z0=m.cz*C;
  const hh=(a,b,k)=>{const v=Math.sin(a*12.9898+b*78.233+k*37.719)*43758.5453;return v-Math.floor(v)};
  const GR={2:['#5a9a3a','#6aaa42','#4a8a32'],3:['#3a7a2a','#4a8a32'],7:['#5a7a2a','#6a8a32'],9:['#2a6a1a','#3a7a22'],10:['#8a7a2a','#a8902a'],11:['#6aaa52','#7aba5a'],12:['#6a5a6a','#7a6a5a'],8:['#a89a4a','#b8aa5a'],19:['#5a4a6a','#6a5a7a']};
  const FL=['#f2ead8','#f0c040','#e05a6a','#9a7ad8','#f08a4a','#5a9af0'];
  for(let i=0;i<220;i++){const lx=Math.floor(hh(m.cx,m.cz,i*3)*C),lz=Math.floor(hh(m.cz,m.cx,i*3+1)*C),h=H[lz*C+lx],b=Bi[lz*C+lx];if(h<WATER+0.5||(m.wlev&&m.wlev[lz*C+lx])||b===0||b===13||b===14||b===17||b===16)continue;
    if(lx>0&&lz>0&&lx<C-1&&lz<C-1){if(H[lz*C+lx+1]!==h||H[lz*C+lx-1]!==h||H[(lz+1)*C+lx]!==h||H[(lz-1)*C+lx]!==h)continue}else continue;
    const wx=x0+lx+0.15+hh(lx,lz,5)*0.7,wz=z0+lz+0.15+hh(lz,lx,6)*0.7;if(typeof inVillage==='function'&&inVillage(wx,wz,42))continue;const r=hh(wx,wz,7);
    const G=GR[b];if(G&&r<0.55){const c=G[Math.floor(hh(wx,wz,8)*G.length)];const n=3+Math.floor(hh(wx,wz,9)*3);for(let k=0;k<n;k++){const ox=(hh(wx,k,1)-0.5)*0.35,oz=(hh(wz,k,2)-0.5)*0.35;list.push([wx+ox,h,wz+oz,0.07,0.16+hh(wx+k,wz,3)*0.22,0.07,c])}}
    else if(G&&r<0.75){const c=FL[Math.floor(hh(wx,wz,10)*FL.length)];list.push([wx,h,wz,0.05,0.22,0.05,'#4a8a32'],[wx,h+0.22,wz,0.13,0.11,0.13,c],[wx,h+0.25,wz,0.06,0.06,0.06,'#f0d040'])}
    else{const g=b===4||b===1||b===15?['#c8a878','#b89868','#d8b888']:b===5||b===21||b===6?['#9a98a0','#8a8890','#e8eef2']:['#8a8890','#7a7880','#9a98a0','#6a6458'];const n=1+Math.floor(hh(wx,wz,11)*3);for(let k=0;k<n;k++){const s=0.1+hh(wx+k,wz,12)*0.16;list.push([wx+(hh(k,wx,4)-0.5)*0.4,h,wz+(hh(k,wz,5)-0.5)*0.4,s*1.2,s*0.7,s,g[Math.floor(hh(wx,k,6)*g.length)]])}}}
  if(!list.length)return;const im=new THREE.InstancedMesh(MICRO_GEO,MICRO_MAT,list.length),M4=new THREE.Matrix4(),col=new THREE.Color();
  list.forEach((q,i)=>{M4.makeScale(q[3],q[4],q[5]);M4.setPosition(q[0],q[1],q[2]);im.setMatrixAt(i,M4);im.setColorAt(i,col.set(q[6]))});im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.receiveShadow=true;im.frustumCulled=false;scene.add(im);ch.micro=im}
function processResults(){
  let n=0;
  while(results.length&&n<4){
    const m=results.shift(); if(m.seed!==S.seed)continue;
    const ch=chunks.get(K(m.cx,m.cz)); if(!ch||ch.pend!==m.lod)continue;
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.BufferAttribute(m.pos,3));
    g.setAttribute('normal',new THREE.BufferAttribute(m.nor,3,true));
    g.setAttribute('color',new THREE.BufferAttribute(m.col,3));
    g.setIndex(new THREE.BufferAttribute(m.idx,1)); g.computeBoundingSphere(); freeCPU(g);
    if(ch.mesh){scene.remove(ch.mesh);ch.mesh.geometry.dispose()}
    const mesh=new THREE.Mesh(g,terrainMat); mesh.position.set(m.cx*C,0,m.cz*C); mesh.receiveShadow=true; mesh.castShadow=m.lod===1; mesh.matrixAutoUpdate=false; mesh.updateMatrix();
    scene.add(mesh); ch.mesh=mesh; ch.lod=m.lod; ch.pend=0;
    {const ok='T'+K(m.cx,m.cz);voxRemove(ok);if(m.slabs&&m.slabs.length&&m.lod===1){const ks=new Set();const S2=m.slabs;for(let i=0;i<S2.length;i+=6){for(let x=S2[i]+0.25;x<S2[i+2];x+=0.5)for(let z=S2[i+1]+0.25;z<S2[i+3];z+=0.5){const k=vkey(Math.floor(x/VOXC),Math.floor(z/VOXC));const L=VOX.get(k)||[];L.push({o:ok,a:S2[i+4],b:S2[i+5]});VOX.set(k,L);ks.add(k)}}VOWN.set(ok,ks)}}
    try{microVox(ch,m,mesh)}catch(e){console.warn('micro',e)}
    if(ch.wmesh){scene.remove(ch.wmesh);ch.wmesh.geometry.dispose();ch.wmesh=null}
    if(m.wpos&&m.wpos.length){const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.BufferAttribute(m.wpos,3));wg.setAttribute('aW',new THREE.BufferAttribute(m.wuv,2));const nn=new Float32Array(m.wpos.length);for(let i=1;i<nn.length;i+=3)nn[i]=1;wg.setAttribute('normal',new THREE.BufferAttribute(nn,3));wg.setIndex(new THREE.BufferAttribute(m.widx,1));wg.computeBoundingSphere();
      const wm=new THREE.Mesh(wg,RIVMAT);wm.position.set(m.cx*C,0,m.cz*C);wm.renderOrder=2;wm.matrixAutoUpdate=false;wm.updateMatrix();scene.add(wm);ch.wmesh=wm}
    if(m.wlev)ch.wlev=m.wlev;ch.falls=m.falls&&m.falls.length?m.falls:null;
    {const first=!ch.heights;if(first||m.dg){
      ch.heights=m.heights; ch.biomes=m.biomes;{const A=[],Bs=[];const D=m.decos;for(let i=0;i<D.length;i+=6){(SMALLT.has(D[i])?Bs:A).push(D[i],D[i+1],D[i+2],D[i+3],D[i+4],D[i+5])}ch.decos=new Float32Array(A);ch.decoS=new Float32Array(Bs)}instDirty=true;
      if(!thumbs.has(K(m.cx,m.cz))){const TS2=Math.round(Math.sqrt(m.thumb.length/4)),cv=document.createElement('canvas');cv.width=cv.height=TS2;cv.getContext('2d').putImageData(new ImageData(m.thumb,TS2,TS2),0,0);cv._d=new Uint8ClampedArray(m.thumb);thumbs.set(K(m.cx,m.cz),cv)}
      if(!MAPH.has(K(m.cx,m.cz))){const Hm=new Float32Array(256);for(let j=0;j<16;j++)for(let i=0;i<16;i++)Hm[j*16+i]=m.heights[(j*2+1)*C+i*2+1];MAPH.set(K(m.cx,m.cz),Hm);const D=m.decos,Tl=[];for(let i=0;i<D.length&&Tl.length<900;i+=6){const tk=TK[D[i]];if((MTREE[D[i]]||/^(oak|pine|birch|palm|snowpine|acacia|jtree|maple|sakura|cactus)$/.test(tk))&&D[i+4]>0.3)Tl.push(D[i+1],D[i+2],D[i+3],D[i+4],D[i])}MAPT.set(K(m.cx,m.cz),new Float32Array(Tl))}
    }}
    n++;
  }
}
function colAt(x,z,y){if(y!==undefined&&y>450){const sh=spaceH(x,z,y);if(sh!==null)return sh}const cx=Math.floor(x/C),cz=Math.floor(z/C);let ch=chunks.get(K(cx,cz));if(!ch||!ch.heights)ch=hcache.get(K(cx,cz));if(!ch||!ch.heights)return null;const lx=Math.floor(x)-cx*C,lz=Math.floor(z)-cz*C;return ch.heights[lz*C+lx]}
// poziom wody w danej kolumnie: rzeki górskie mają własny poziom (ch.wlev), reszta świata — WATER
function wlAt(x,z){const cx=Math.floor(x/C),cz=Math.floor(z/C);let ch=chunks.get(K(cx,cz));if(!ch||!ch.heights)ch=hcache.get(K(cx,cz));if(!ch||!ch.wlev)return WATER;return ch.wlev[(Math.floor(z)-cz*C)*C+Math.floor(x)-cx*C]||WATER}
const wetAt=(x,z,h)=>h<WATER||h<wlAt(x,z);
function biomeAt(x,z){const cx=Math.floor(x/C),cz=Math.floor(z/C);let ch=chunks.get(K(cx,cz));if(!ch||!ch.biomes)ch=hcache.get(K(cx,cz));if(!ch||!ch.biomes)return -1;return ch.biomes[(Math.floor(z)-cz*C)*C+Math.floor(x)-cx*C]}
function maxH(x,z){let m=-1;for(const ox of [-PR,PR])for(const oz of [-PR,PR]){const h=colAt(x+ox,z+oz,player.p.y);if(h===null)return null;if(h>m)m=h}return m}

// ---------- gracz ----------
const player={p:new THREE.Vector3(0,80,0),v:new THREE.Vector3(),ry:0,ground:false,swim:false,ready:false,anim:0};
const me=makeChar(S.look); scene.add(me);
const keys=new Set(); let yaw=LS.get('yaw',0.6), pitch=0.32, dist=Math.min(12,LS.get('dist',7.5));
function physics(dt){
  if(!player.ready)return;
  if(VH.mode===1){boatPhysics(dt);return}
  if(VH.mode===4){passengerTick();return}
  const f=[0,0];
  if(keys.has('KeyW'))f[1]+=1; if(keys.has('KeyS'))f[1]-=1; if(keys.has('KeyA'))f[0]-=1; if(keys.has('KeyD'))f[0]+=1;
  const wantS=keys.has('ShiftLeft')||keys.has('ShiftRight');
  const p=player.p, v=player.v;
  if(maxH(p.x,p.z)===null){v.set(0,0,0);return} // teren jeszcze się nie wczytał
  const WLp=wlAt(p.x,p.z),surf=WLp-0.15; player.swim=p.y<surf-1.15;if(VH.mode===6)player.swim=false;
  if(P2.wlPrev!=null&&WLp<P2.wlPrev-1.5&&p.y>WLp+0.5&&VH.mode===0&&P2.wasSwim){sfx('splash',0.8);v.y=Math.min(v.y,-2)}P2.wlPrev=WLp;P2.wasSwim=player.swim;
  if(season===2&&VH.mode===0&&WATER_U.uIce.value>0.5){const gh=colAt(p.x,p.z);if(gh!==null&&gh<WATER&&WATER-gh<4.2&&p.y>WATER-1.3){player.swim=false;if(p.y<=WATER-0.28){p.y=WATER-0.28;if(v.y<0)v.y=0;player.ground=true}}}
  const sprint=(VH.mode===3||VH.mode===5||VH.mode===6)?wantS:staTick(dt,wantS&&VH.mode===0,!!(f[0]||f[1]));
  let sp=(player.swim?3.2*(hasP('plywak')?1.6:1)*(1+0.01*skL('plyw'))*(sprint?1.8:1):VH.mode===5?(sprint?24:15)*(1+0.06*pk('galop')):VH.mode===6?(sprint?36:22)*(1+0.06*pk('galop')):VH.mode===3?(sprint?16:12)*(PET?MSPD[PET.t]||1:1):(P3.block&&VH.mode===0)?2.4:P3.sneak&&VH.mode===0?2.6:sprint?12.5*(1+0.006*skL('sprint')):5.8)*ST.move;if(P3.sneak&&(player.swim||VH.mode!==0))P3.sneak=false;
  let mx=0,mz=0;
  if(P2.dead>0){f[0]=f[1]=0}
  if(P2.atkT>0)sp*=0.45;
  if(f[0]||f[1]){const l=Math.hypot(f[0],f[1]);const fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);mx=(fx*f[1]+rx*f[0])/l;mz=(fz*f[1]+rz*f[0])/l;player.ry=Math.atan2(mx,mz)}
  const acc=VH.mode===6?3:player.ground||player.swim?14:4;
  if(P2.roll<=0&&!(P3.charge>0)&&!(P3.leap>0)&&VH.mode!==2){v.x+=(mx*sp-v.x)*Math.min(1,acc*dt); v.z+=(mz*sp-v.z)*Math.min(1,acc*dt);}
  if(VH.mode===2){gliderVel(v,dt)}
  else if(VH.mode===6){const up=keys.has('Space'),dn=keys.has('ControlLeft')||keys.has('KeyC');v.y+=(((up?11:0)-(dn?11:0))-v.y)*Math.min(1,4*dt);if(p.y>WATER+260)v.y=Math.min(v.y,0)}
  else if(player.swim){
    const target=surf-1.35; v.y+=((target-p.y)*4-v.y)*Math.min(1,3*dt);
    if(keys.has('Space'))v.y=Math.max(v.y,keys.has('Space')&&p.y>target-0.2?6:3);
    if(keys.has('KeyC')||keys.has('ControlLeft'))v.y=-3;
  } else {
    v.y-=30*dt; if(v.y<-50)v.y=-50;
    if(keys.has('Space')&&player.ground&&!P2.dead){v.y=11.7;player.ground=false;sfx('jump')}
  }
  // oś X i Z osobno, z auto-wchodzeniem na 1 blok (jak w Cube World)
  for(const ax of ['x','z']){
    const np=ax==='x'?[p.x+v.x*dt,p.z]:[p.x,p.z+v.z*dt];
    let h=maxH(np[0],np[1]);
    if(h===null){v[ax]=0;continue}
    if(!SPC&&VOX.size){const vp=voxProbe(np[0],np[1],p.y,PR,PH-0.1);if(vp.block){if(P2.climbing>0&&vp.topC!==null&&vp.topC-p.y<=1.9&&!voxProbe(np[0],np[1],vp.topC,PR,PH-0.1).block){p.y=vp.topC+0.02;p[ax]=ax==='x'?np[0]:np[1];v.y=Math.max(0,v.y);player.ground=true;P2.climbing=0;continue}v[ax]=0;P2.wallHit=0.12;continue}if(vp.top!==null&&vp.top>h)h=vp.top}
    if(h<=p.y+0.01){p[ax]=ax==='x'?np[0]:np[1]}
    else if(h-p.y<=STEP&&(player.ground||player.swim)){p.y=h;p[ax]=ax==='x'?np[0]:np[1]}
    else if(P2.climbing>0&&h-p.y<=1.9){p.y=h+0.02;p[ax]=ax==='x'?np[0]:np[1];v.y=Math.max(0,v.y);player.ground=true;P2.climbing=0}
    else{v[ax]=0;if(h-p.y>STEP)P2.wallHit=0.12}
  }
  P2.wallHit=(P2.wallHit||0)-dt;P2.climbing=(P2.climbing||0)-dt;const cmax=6*(1+0.04*skL('wspin'));if(P2.cst==null)P2.cst=cmax;
  if(P2.wallHit>0&&f[1]>0&&!player.swim&&VH.mode===0&&!P2.dead){const tired=P2.cst<=0;v.y=Math.max(v.y,3.2*(1+0.01*skL('wspin'))*(tired?0.45:1));P2.cst=Math.max(0,P2.cst-dt);P2.climbing=0.15}
  else if(player.ground)P2.cst=Math.min(cmax,P2.cst+dt*2.5);
  {const cb=document.getElementById('climbbar');if(cb){const show=P2.cst<cmax-0.01;cb.hidden=!show;if(show)cb.firstChild.style.width=Math.max(0,P2.cst/cmax*100)+'%'}}
  // pnie drzew i skały
  const cx=Math.floor(p.x/C),cz=Math.floor(p.z/C);
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const ch=chunks.get(K(cx+dx,cz+dz));if(!ch||!ch.decos)continue;const D=ch.decos;
    for(let i=0;i<D.length;i+=6){const r=DECO[D[i]][1]*D[i+4];if(!r)continue;const ex=p.x-D[i+1],ez=p.z-D[i+3];if(Math.abs(ex)>3||Math.abs(ez)>3)continue;const tr=TRUNK[TK[D[i]]],s=D[i+4]*TS/16,dd=Math.hypot(ex,ez),min=r+PR;
      if(dd<min+0.22&&dd>1e-4&&(-ex*Math.sin(player.ry)-ez*Math.cos(player.ry))/dd>0.35&&D[i]!==6&&D[i]!==12&&D[i]!==4&&keys.has('KeyW')&&!P2.dead&&VH.mode===0&&p.y>=D[i+2]-0.2&&p.y<D[i+2]+tr[2]*s){v.y=Math.max(v.y,5.2);player.climb=0.2}
      if(p.y>D[i+2]+tr[1]*s)continue;if(dd<min&&dd>1e-4){p.x+=ex/dd*(min-dd);p.z+=ez/dd*(min-dd)}}}
  villageCollide(p);structCollide(p);
  p.y+=v.y*dt;
  let g=maxH(p.x,p.z);{const sg=structGround(p.x,p.z,p.y);if(sg!==null&&(g===null||sg>g))g=sg}{const vg=villageGround(p.x,p.z,p.y);if(vg!==null&&(g===null||vg>g))g=vg}{const tg=treeGround(p.x,p.z,p.y);if(tg!==null&&(g===null||tg>g))g=tg}if(!SPC&&VOX.size){const vp=voxProbe(p.x,p.z,p.y,0,0.1);if(vp.top!==null&&vp.top<=p.y+0.35&&(g===null||vp.top>g))g=vp.top}{const bg=BRS.length?bridgeGround(p.x,p.z,p.y):null;if(bg!==null&&(g===null||bg>g)){g=bg;if(player.swim&&p.y>bg-1.3)player.swim=false}}
  if(g!==null&&p.y<=g){p.y=g;if(v.y<0)v.y=0;player.ground=true}
  else if(g!==null&&P2.wasG&&v.y<=0.01&&p.y-g<=STEP+0.2&&!player.swim&&VH.mode!==2&&!(P3.leap>0)){p.y=g;v.y=0;player.ground=true}
  else player.ground=false;
  if(VH.mode===2&&(player.ground||p.y<WATER-0.9))stopGlide();
  {const sp=Math.hypot(v.x,v.z);if((player.ground||player.swim)&&sp>1){P2.stepD=(P2.stepD||0)+sp*dt;if(P2.stepD>(sp>7?2.1:1.6)){P2.stepD=0;sfx(player.swim||p.y<WATER+0.1?'stepw':'step',0.8)}}if(player.ground&&!P2.wasG&&P2.fallV<-9)sfx('land');P2.wasG=player.ground;P2.fallV=v.y}
  if(p.y<-20){p.y=120;v.y=0}
  {const hs=Math.hypot(v.x,v.z);if(sprint&&hs>6&&player.ground&&VH.mode===0)skGain('sprint',dt);if(player.swim&&hs>1)skGain('plyw',dt);if(P2.climbing>0)skGain('wspin',dt*1.5)}
}

// korony drzew, skały i głazy, po których można chodzić
function treeGround(x,z,y){
  const cx=Math.floor(x/C),cz=Math.floor(z/C);let best=null;
  for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const ch=chunks.get(K(cx+dx,cz+dz));if(!ch||!ch.decos)continue;const D=ch.decos;
    for(let i=0;i<D.length;i+=6){const tt=TREETOP[TK[D[i]]];if(!tt)continue;const ex=x-D[i+1],ez=z-D[i+3];if(Math.abs(ex)>4.5||Math.abs(ez)>4.5)continue;
      const s=D[i+4]*TS/16,q=Math.floor(D[i+5]/(Math.PI/2))&3;
      // obrót o -q*90° do układu modelu
      let lx=ex/s,lz=ez/s;for(let k=0;k<q;k++){const t=lx;lx=-lz;lz=t}
      for(const c of tt){const top=D[i+2]+c[3]*s;if(top>y+0.55||top<y-3)continue;if(Math.abs(lx-c[0])<c[2]+1.2&&Math.abs(lz-c[1])<c[2]+1.2&&(best===null||top>best))best=top}}}
  return best;
}

// ===== WODA ŻYJE: lilie i żaby, wodorosty i koralowce, wieloryby, mgła o świcie, prąd rzek, lód zimą, oddech pod wodą, wędkowanie =====
const WL={c:null,t:0,ims:[],frogs:[],whale:null,wT:20,mist:null};
function wlBox(n,col,sway){const geo=new THREE.BoxGeometry(1,1,1);geo.translate(0,0.5,0);const mat=new THREE.MeshLambertMaterial({color:0xffffff});if(sway){mat.onBeforeCompile=sh=>{sh.uniforms.uT=WATER_U.uT;sh.vertexShader='uniform float uT;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat ph=instanceMatrix[3].x*0.7+instanceMatrix[3].z*0.3;\n#else\nfloat ph=0.;\n#endif\ntransformed.x+=sin(uT*1.3+ph)*0.35*position.y*position.y;transformed.z+=cos(uT*1.1+ph)*0.2*position.y;')};mat.customProgramCacheKey=()=>'kelp'}const im=new THREE.InstancedMesh(geo,mat,Math.max(1,n));im.frustumCulled=false;im.count=0;scene.add(im);return im}
function wlPads(n){const geo=new THREE.CircleGeometry(0.5,18,0.3,Math.PI*2-0.6);geo.rotateX(-Math.PI/2);const P=geo.attributes.position,C=new Float32Array(P.count*3);for(let i=0;i<P.count;i++){const r=Math.hypot(P.getX(i),P.getZ(i))*2,v=0.82+0.3*(1-r)+(r>0.9?-0.12:0);C[i*3]=v;C[i*3+1]=v;C[i*3+2]=v}geo.setAttribute('color',new THREE.BufferAttribute(C,3));
  const mat=new THREE.MeshLambertMaterial({color:0xffffff,vertexColors:true,side:THREE.DoubleSide});const im=new THREE.InstancedMesh(geo,mat,Math.max(1,n));im.frustumCulled=false;im.count=0;scene.add(im);return im}
function wlGeo(geo,n,sway){const mat=new THREE.MeshLambertMaterial({vertexColors:true});if(sway){mat.onBeforeCompile=sh=>{sh.uniforms.uT=WATER_U.uT;sh.vertexShader='uniform float uT;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat ph=instanceMatrix[3].x*0.9+instanceMatrix[3].z*0.4;\n#else\nfloat ph=0.;\n#endif\ntransformed.x+=sin(uT*1.6+ph)*'+sway.toFixed(3)+'*position.y*position.y;transformed.z+=cos(uT*1.2+ph)*'+(sway*0.6).toFixed(3)+'*position.y*position.y;')};mat.customProgramCacheKey=()=>'sway'+sway}
  const im=new THREE.InstancedMesh(geo,mat,Math.max(1,n));im.frustumCulled=false;im.count=0;im.castShadow=!!sway;im.userData.kg=1;scene.add(im);return im}
const LILYG=[];function lilyFlower(k){if(LILYG[k])return LILYG[k];const PC=[[['#fbf6ec','#efe4d0'],['#fffaf2','#f4ecd8']],[['#f6b8d0','#e888b0'],['#f8c8dc','#f0a0c0']],[['#fff0f4','#f4d0dc'],['#f0b0c8','#e890b0']]][k],L=[];
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,c=Math.cos(a),s=Math.sin(a);L.push([c*0.13,0.05,s*0.13,0.1+Math.abs(c)*0.04,0.05,0.1+Math.abs(s)*0.04,i%2?PC[0][0]:PC[0][1]])}
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2+0.3,c=Math.cos(a),s=Math.sin(a);L.push([c*0.08,0.11,s*0.08,0.07,0.1,0.07,i%2?PC[1][0]:PC[1][1]])}
  L.push([0,0.15,0,0.09,0.08,0.09,'#f0c830'],[0,0.2,0,0.05,0.04,0.05,'#e8a820'],[0,0.01,0,0.24,0.02,0.24,'#3a7a34']);return LILYG[k]=boxes(L)}
const CATG={};function cattailGeo(dry){const k=dry?1:0;if(CATG[k])return CATG[k];const ST=dry?'#9a8a4a':'#5a8a3a',LF=dry?'#a89850':'#4a8a34',LF2=dry?'#8a7a40':'#5a9a3e',HD=dry?'#5a3a22':'#6a4426',L=[];
  for(const [x,z,h] of [[0,0,2.0],[0.18,0.1,1.7],[-0.15,0.14,1.85],[0.06,-0.18,1.5],[-0.2,-0.12,1.35]]){L.push([x,h/2,z,0.035,h,0.035,ST],[x,h-0.32,z,0.1,0.42,0.1,HD],[x,h-0.31,z,0.115,0.36,0.085,darker(HD,0.9)],[x,h+0.06,z,0.02,0.14,0.02,'#b8a878'])}
  for(const [x,z,h,w,c] of [[0.1,-0.05,1.6,0.07,LF],[-0.1,0.02,1.9,0.06,LF2],[0.02,0.2,1.4,0.06,LF],[-0.22,0.0,1.2,0.05,LF2],[0.24,-0.06,1.1,0.06,LF],[0.0,-0.24,1.3,0.05,LF2],[0.14,0.26,0.9,0.05,LF]]){L.push([x,h/2,z,w,h,0.015,c],[x+0.02,h*0.85,z,w*0.7,h*0.3,0.016,darker(c,1.12)])}
  return CATG[k]=boxes(L)}
function wlRebuild(){for(const im of WL.ims){scene.remove(im);if(!im.userData.kg)im.geometry.dispose();im.material.dispose()}WL.ims=[];for(const f of WL.frogs)scene.remove(f.m);WL.frogs=[];
  const px=Math.round(player.p.x/2.5)*2.5,pz=Math.round(player.p.z/2.5)*2.5,R=55,pad=[],kelp=[],cor=[],hh=(x,z,k)=>{const s=Math.sin(x*12.9898+z*78.233+k*37.719)*43758.5453;return s-Math.floor(s)};
  const cat=[],CATNO=[0,1,4,5,6,15,16,17,18,20,21,22,23];for(let z=pz-R;z<=pz+R;z+=2.5)for(let x=px-R;x<=px+R;x+=2.5){if(Math.hypot(x-px,z-pz)>R)continue;const h=colAt(x,z);if(h==null)continue;if(h>=WATER){if(h<WATER+0.7&&hh(x,z,11)<0.24){const b=biomeAt(x,z);const near=[[2.5,0],[-2.5,0],[0,2.5],[0,-2.5]].some(([ox,oz])=>(colAt(x+ox,z+oz)??99)<WATER);if(near&&!CATNO.includes(b))cat.push([x+(hh(x,z,12)-0.5)*2,h,z+(hh(x,z,13)-0.5)*2,0.75+hh(x,z,14)*0.4,hh(x,z,15)])}continue}const d=WATER-h,b=biomeAt(x,z),jx=x+(hh(x,z,1)-0.5)*2,jz=z+(hh(x,z,2)-0.5)*2;
    if([7,14,3,19,11,10,2,13].includes(b)&&d>=0.5&&d<=2.8&&hh(x,z,3)<(b===7||b===14?0.2:0.1)){pad.push([jx,jz,0.7+hh(x,z,4)*0.6,hh(x,z,5)]);if(hh(x,z,16)<0.6)pad.push([jx+(hh(x,z,17)-0.5)*1.6,jz+(hh(x,z,18)-0.5)*1.6,0.45+hh(x,z,19)*0.35,hh(x,z,20)])}
    if(d<=1.15&&!CATNO.includes(b)&&hh(x,z,11)<([7,14,19,3,11,10,2].includes(b)?0.38:0.15))cat.push([jx,h,jz,(d+1.6)/2,hh(x,z,15)]);
    if(d>=2.5&&hh(x,z,6)<0.17)kelp.push([jx,h,jz,Math.min(d-0.6,5)*(0.45+hh(x,z,7)*0.55),hh(x,z,8)]);
    if([9,8,4,1,0,15].includes(b)&&d>=1.6&&d<=7&&hh(x,z,9)<0.12)cor.push([jx,h,jz,hh(x,z,10)])}
  const m4=new THREE.Matrix4(),col=new THREE.Color();
  if(season===2&&WATER_U.uIce.value>0.5)pad.length=0;if(pad.length){const im=wlPads(pad.length);const fl=[[],[],[]];let q=0;const e=new THREE.Euler(),qq=new THREE.Quaternion(),pv=new THREE.Vector3(),sv=new THREE.Vector3();
    for(const [x,z,s,f] of pad){e.set(0,f*31.4,0);qq.setFromEuler(e);m4.compose(pv.set(x,WATER-0.255+f*0.004,z),qq,sv.set(s,1,s));im.setMatrixAt(q,m4);im.setColorAt(q++,col.set(f<0.33?'#3f8a3a':f<0.66?'#4a9a42':'#3a7a34'));if(f>0.62)fl[f>0.9?0:f>0.78?1:2].push([x+Math.sin(f*31.4)*s*0.15,z+Math.cos(f*31.4)*s*0.15,0.75+f*0.4,f])}
    im.count=q;im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;WL.ims.push(im);
    fl.forEach((L,k)=>{if(!L.length)return;const fm=wlGeo(lilyFlower(k),L.length,0);L.forEach(([x,z,sc,f],i)=>{e.set(0,f*17,0);qq.setFromEuler(e);m4.compose(pv.set(x,WATER-0.25,z),qq,sv.set(sc,sc,sc));fm.setMatrixAt(i,m4)});fm.count=L.length;fm.instanceMatrix.needsUpdate=true;WL.ims.push(fm)})
    for(let k=0;k<Math.min(4,Math.floor(pad.length/5));k++){const p=pad[Math.floor(Math.random()*pad.length)],fm=new THREE.Mesh(boxes([[0,0.07,0,0.16,0.12,0.2,'#4a8a3a'],[0,0.15,0.06,0.13,0.08,0.1,'#5a9a4a'],[0.05,0.19,0.09,0.03,0.03,0.02,'#141414'],[-0.05,0.19,0.09,0.03,0.03,0.02,'#141414'],[0.08,0.03,-0.06,0.05,0.04,0.12,'#3a7a2a'],[-0.08,0.03,-0.06,0.05,0.04,0.12,'#3a7a2a']]),decoMat);fm.scale.setScalar(1.6);fm.position.set(p[0],WATER-0.25,p[1]);fm.rotation.y=Math.random()*6.28;scene.add(fm);WL.frogs.push({m:fm,x:p[0],z:p[1],t:2+Math.random()*6,j:0})}}
  if(cat.length){const cm=wlGeo(cattailGeo(season===1||season===2),cat.length,0.035);const e=new THREE.Euler(),qq=new THREE.Quaternion(),pv=new THREE.Vector3(),sv=new THREE.Vector3();cat.forEach(([x,y,z,sc,f],i)=>{e.set(0,f*40,0);qq.setFromEuler(e);m4.compose(pv.set(x,y,z),qq,sv.set(sc*(0.9+f*0.2),sc,sc*(0.9+f*0.2)));cm.setMatrixAt(i,m4)});cm.count=cat.length;cm.instanceMatrix.needsUpdate=true;WL.ims.push(cm)}
  if(kelp.length){const im=wlBox(kelp.length*2,0,true);let q=0;for(const [x,y,z,h,f] of kelp){m4.makeScale(0.22,h,0.08);m4.setPosition(x,y,z);im.setMatrixAt(q,m4);im.setColorAt(q++,col.set(f<0.33?'#2f6a3a':f<0.66?'#3a7a3a':'#4a7a2a'));m4.makeScale(0.16,h*0.7,0.06);m4.setPosition(x+0.15,y,z+0.1);im.setMatrixAt(q,m4);im.setColorAt(q++,col.set('#285a30'))}im.count=q;im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;WL.ims.push(im)}
  if(cor.length){const im=wlBox(cor.length*3,0);let q=0;const CC=['#e86a8a','#f08a4a','#b86ad8','#f0d050','#e8e0d0'];for(const [x,y,z,f] of cor)for(let k=0;k<3;k++){const s=0.25+((f*7+k)%1)*0.35;m4.makeScale(s,s*(1.2+k*0.5),s);m4.setPosition(x+(k-1)*0.35,y,z+((k*3)%2-0.5)*0.4);im.setMatrixAt(q,m4);im.setColorAt(q++,col.set(CC[Math.floor(f*5+k)%5]))}im.count=q;im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;WL.ims.push(im)}}
// wodospady: mgiełka u podstawy, szum, prąd wciągający w dół rzeki
let fallsT=0,fallSnd=0;
function fallsTick(dt){const p=player.p;fallsT-=dt;if(fallsT<=0){fallsT=1;FALLS.length=0;const cx=Math.floor(p.x/C),cz=Math.floor(p.z/C);for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++){const ch=chunks.get(K(cx+dx,cz+dz));if(!ch||!ch.falls)continue;const F=ch.falls;for(let i=0;i<F.length;i+=4){const d=Math.hypot(F[i]-p.x,F[i+2]-p.z);if(d<55)FALLS.push([F[i],F[i+1],F[i+2],F[i+3],d])}}FALLS.sort((a,b)=>a[4]-b[4]);if(FALLS.length>60)FALLS.length=60}
  if(!FALLS.length||SPC)return;for(const f of FALLS){if(Math.random()<dt*5){PFX.emit(f[0]+(Math.random()-0.5)*0.8,f[3]+0.25,f[2]+(Math.random()-0.5)*0.8,1,['#ffffff','#e6f4ff','#cfe8f8'],{sp:1.4,up:1.8,life:0.8,size:0.12,g:2.5});if(Math.random()<0.5)PFX.emit(f[0],f[1]-Math.random()*(f[1]-f[3]),f[2],1,['#ffffff','#dff0ff'],{sp:0.5,up:-1.5,life:0.5,size:0.07,g:9})}}
  fallSnd-=dt;if(fallSnd<=0&&FALLS[0][4]<26){fallSnd=2.2+Math.random()*1.5;try{sfx('wave',Math.max(0.15,0.8*(1-FALLS[0][4]/26)))}catch(_){}}
  if(player.swim&&VH.mode===0&&!P2.dead){const w=wlAt(p.x,p.z);if(w>WATER){let gx=0,gz=0;for(const [ox,oz] of [[3,0],[-3,0],[0,3],[0,-3],[6,0],[-6,0],[0,6],[0,-6]]){const x=p.x+ox,z=p.z+oz,h=colAt(x,z),w2=wlAt(x,z);if(h!==null&&h<w2&&w2<w||(h!==null&&w2===WATER&&h<WATER)){gx+=Math.sign(ox);gz+=Math.sign(oz)}}const l=Math.hypot(gx,gz);if(l>0){p.x+=gx/l*2.4*dt;p.z+=gz/l*2.4*dt}}}}
function whaleMake(){const g=new THREE.Group(),L=[];for(let k=0;k<8;k++)L.push([0,0.15+Math.sin(k/7*Math.PI)*0.5,-3+k*0.9,1.4-Math.abs(k-3.5)*0.15,0.6,0.95,k%2?'#3a4a5a':'#45566a']);L.push([0,0.9,0.2,0.18,0.8,0.7,'#2e3c4a'],[0,1.2,-0.05,0.14,0.4,0.4,'#2e3c4a'],[0,0.3,-4,1.8,0.12,0.5,'#3a4a5a']);g.add(new THREE.Mesh(boxes(L),decoMat));scene.add(g);return g}
let AIR=12,airHurtT=0;
const FISH={st:0,t:0,bob:null,line:null,ten:0,prog:0,tl:0};
const FISHT=[['plotka','Płotka',6,35],['okon','Okoń',9,25],['karp','Karp',14,15],['szczupak','Szczupak',22,10],['losos','Łosoś',30,7],['wegorz','Węgorz',40,3],['zlota','Złota rybka',150,1],['skarb','Skrzynka',0,2],['but','Stary but',0,2]];
function fishCount(){let n=0;for(const k in (INV.fish||{}))n+=INV.fish[k];return n}
function fishValue(){let v=0;for(const k in (INV.fish||{})){const t=FISHT.find(q=>q[0]===k);if(t)v+=t[2]*INV.fish[k]}return v}
function sellFish(){const v=fishValue();INV.gold+=v;INV.fish={};saveInv();updHud();sfx('coin');dlgRoot('Świeże ryby zawsze się sprzedadzą. Masz '+v+' zł.')}
function fishCancel(msg){if(FISH.bob){scene.remove(FISH.bob);FISH.bob=null}if(FISH.line){scene.remove(FISH.line);FISH.line=null}FISH.st=0;$('fishui').hidden=true;if(msg)toast(msg,'#cfe8ff')}
function fishKey(){if(FISH.st===2){FISH.st=3;FISH.ten=0.5;FISH.prog=0.2;FISH.tl=12;$('fishui').hidden=false;sfx('splash',0.5);return}if(FISH.st===1||FISH.st===3){if(FISH.st===1)fishCancel('Zwijasz żyłkę.');return}
  if(!INV.rod)return toast('Potrzebujesz wędki. Kupisz ją u kupca albo u kapitana portu.','#ff8a7a');if(P2.dead||(VH.mode!==0&&VH.mode!==1))return;
  let spot=null;const fy=player.ry;for(const d of [6,5,7,4,8]){const x=player.p.x+Math.sin(fy)*d,z=player.p.z+Math.cos(fy)*d,h=colAt(x,z);if(h!==null&&h<wlAt(x,z)-0.5){spot=[x,z];break}}
  if(!spot)return toast('Stań przodem do wody, żeby zarzucić wędkę','#ff8a7a');
  const b=new THREE.Mesh(boxes([[0,0.06,0,0.16,0.12,0.16,'#e8e6e0'],[0,0.15,0,0.12,0.08,0.12,'#c8302a'],[0,0.24,0,0.03,0.12,0.03,'#c8302a']]),decoMat);b.position.set(spot[0],wlAt(spot[0],spot[1])-0.32,spot[1]);scene.add(b);FISH.bob=b;
  const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(6),3));FISH.line=new THREE.Line(lg,new THREE.LineBasicMaterial({color:0xe8e6e0}));FISH.line.frustumCulled=false;scene.add(FISH.line);
  FISH.st=1;FISH.t=3+Math.random()*7;sfx('splash',0.35);toast('Zarzucono wędkę – czekaj na branie (U zwija)','#cfe8ff')}
function fishTick(dt){const ui=$('fishui');if(!FISH.st)return;const b=FISH.bob;if(!b){fishCancel();return}
  if(Math.hypot(b.position.x-player.p.x,b.position.z-player.p.z)>14||P2.dead){fishCancel('Żyłka się splątała.');return}
  const t=performance.now()/1000,fy=player.ry,tip=[player.p.x+Math.sin(fy)*1.6+Math.cos(fy)*0.35,player.p.y+2.4,player.p.z+Math.cos(fy)*1.6-Math.sin(fy)*0.35];
  const a=FISH.line.geometry.attributes.position.array;a[0]=tip[0];a[1]=tip[1];a[2]=tip[2];a[3]=b.position.x;a[4]=b.position.y+0.24;a[5]=b.position.z;FISH.line.geometry.attributes.position.needsUpdate=true;
  const u=meRef.userData;if(u.ra){u.ra.rotation.x=-1.0-(FISH.st===3?Math.sin(t*12)*0.15:0);u.ra.rotation.z=0.1}
  if(FISH.st===1){b.position.y=WATER-0.32+Math.sin(t*2)*0.02;FISH.t-=dt;if(FISH.t<=0){FISH.st=2;FISH.t=1.3;sfx('splash',0.7);PFX.emit(b.position.x,WATER-0.2,b.position.z,10,['#ffffff','#cfe8ff'],{sp:2,up:2,life:0.5,size:0.07});toast('Bierze! Naciśnij U!','#ffd34d')}}
  else if(FISH.st===2){b.position.y=WATER-0.5+Math.sin(t*25)*0.06;FISH.t-=dt;if(FISH.t<=0)fishCancel('Ryba zerwała się z haczyka.')}
  else if(FISH.st===3){const hold=keys.has('KeyU');FISH.ten+=dt*(hold?0.75:-0.6)+(Math.sin(t*3.7)+Math.sin(t*6.1))*dt*0.25;FISH.tl-=dt;const inZ=FISH.ten>0.35&&FISH.ten<0.75;FISH.prog+=dt*(inZ?0.26:-0.1);b.position.y=WATER-0.45+Math.sin(t*14)*0.05;
    b.position.x+=(player.p.x-b.position.x)*dt*0.08*(inZ?1:0);b.position.z+=(player.p.z-b.position.z)*dt*0.08*(inZ?1:0);
    ui.querySelector('.fz i').style.left=(Math.max(0,Math.min(1,FISH.ten))*100)+'%';ui.querySelector('.fp i').style.width=(Math.max(0,Math.min(1,FISH.prog))*100)+'%';
    if(FISH.ten>=1){fishCancel('Żyłka pękła! Trzymaj napięcie w zielonym polu.');return}if(FISH.prog<=0||FISH.tl<=0||FISH.ten<=0.02){fishCancel('Ryba uciekła.');return}
    if(FISH.prog>=1){const tot=FISHT.reduce((s,q)=>s+q[3],0);let r=Math.random()*tot,k=0;while(r>FISHT[k][3]){r-=FISHT[k][3];k++}const T=FISHT[k];
      if(T[0]==='skarb'){const it=genItem(Math.max(1,HERO.lvl),15);if(INV.bag.length<bagN()){INV.bag.push(it);toast('Wyłowiono skrzynkę: '+it.name,RAR[it.rar].c)}else toast('Wyłowiono skrzynkę, ale plecak jest pełny','#ff8a7a');INV.gold+=10+Math.floor(Math.random()*20)}
      else if(T[0]==='but'){toast('Wyłowiono… stary but. Może kiedyś się przyda.','#cfe8ff')}
      else{INV.fish=INV.fish||{};INV.fish[T[0]]=(INV.fish[T[0]]||0)+1;toast('Złowiono: '+T[1]+' (wartość '+T[2]+' zł)',T[0]==='zlota'?'#ffd34d':'#7dd87d');INV.food.mieso=(INV.food.mieso||0)+(Math.random()<0.3?1:0)}
      gainXp(8+T[2]);saveInv();updHud();sfx('coin',0.5);PFX.emit(b.position.x,WATER,b.position.z,16,['#ffffff','#cfe8ff','#7fd0ff'],{sp:3,up:3,life:0.6,size:0.08});fishCancel()}}}
function waterLifeTick(dt){const p=player.p,t=performance.now()/1000;
  // pogoda i pora: deszcz, burza, plankton, lód
  const wet=WX.k==='deszcz'||WX.k==='burza';WATER_U.uRain.value+=((wet?1:0)-WATER_U.uRain.value)*Math.min(1,dt*0.5);WATER_U.uStorm.value+=((WX.k==='burza'?1:0)-WATER_U.uStorm.value)*Math.min(1,dt*0.3);
  WATER_U.uNight.value+=(((hour>20.5||hour<5)?1:0)-WATER_U.uNight.value)*Math.min(1,dt*0.3);WATER_U.uIce.value+=((season===2?1:0)-WATER_U.uIce.value)*Math.min(1,dt*0.2);
  if(VH.boat&&WATER_U.uStorm.value>0.05){VH.boat.rotation.z=Math.sin(t*1.4)*0.08*WATER_U.uStorm.value;VH.boat.rotation.x=Math.sin(t*1.1+1)*0.06*WATER_U.uStorm.value;VH.boat.position.y+=Math.sin(t*1.6)*0.15*WATER_U.uStorm.value}
  WL.t-=dt;if(WL.t<=0){WL.t=2;if(!WL.c||Math.hypot(p.x-WL.c[0],p.z-WL.c[1])>20){WL.c=[p.x,p.z];try{wlRebuild()}catch(e){console.warn('woda',e)}}}
  for(const f of WL.frogs){f.t-=dt;if(f.t<=0&&f.j<=0){f.j=0.6;f.t=3+Math.random()*7;f.a=Math.random()*6.28;f.m.rotation.y=f.a}if(f.j>0){f.j-=dt;const k=1-f.j/0.6;f.m.position.x+=Math.sin(f.a)*dt*1.6;f.m.position.z+=Math.cos(f.a)*dt*1.6;f.m.position.y=WATER-0.25+Math.sin(k*Math.PI)*0.45;if(f.j<=0){const h=colAt(f.m.position.x,f.m.position.z);if(h!==null&&h>=WATER-0.2){f.m.position.x=f.x;f.m.position.z=f.z}}}
    if(Math.hypot(f.m.position.x-p.x,f.m.position.z-p.z)<2.5&&f.j<=0){f.t=0}}
  // wieloryb daleko od brzegu
  WL.wT-=dt;if(!WL.whale&&WL.wT<=0&&!SPC){WL.wT=25+Math.random()*30;for(let k=0;k<6;k++){const a=Math.random()*6.28,d=60+Math.random()*50,x=p.x+Math.cos(a)*d,z=p.z+Math.sin(a)*d,h=colAt(x,z);if(h!==null&&h<WATER-8){const g=whaleMake();g.position.set(x,WATER-1.2,z);WL.whale={g,a:a+Math.PI/2,t:24,sp:4};break}}}
  if(WL.whale){const w=WL.whale;w.t-=dt;w.g.position.x+=Math.sin(w.a)*dt*2.2;w.g.position.z+=Math.cos(w.a)*dt*2.2;w.g.rotation.y=w.a;const k=Math.sin((24-w.t)/24*Math.PI);w.g.position.y=WATER-1.6+k*0.9+Math.sin(t*0.7)*0.15;w.sp-=dt;if(w.sp<=0&&k>0.5){w.sp=5+Math.random()*3;PFX.emit(w.g.position.x,WATER+1.2,w.g.position.z,26,['#ffffff','#dfefff'],{sp:1.5,up:7,life:1.2,size:0.12,g:-3})}if(w.t<=0){scene.remove(w.g);WL.whale=null}}
  // mgła nad wodą o świcie
  if(!WL.mist){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');for(let i=0;i<60;i++){const g2=x.createRadialGradient(0,0,0,0,0,30);g2.addColorStop(0,'rgba(255,255,255,.35)');g2.addColorStop(1,'rgba(255,255,255,0)');x.save();x.translate(Math.random()*128,Math.random()*128);x.fillStyle=g2;x.fillRect(-30,-30,60,60);x.restore()}const tx=new THREE.CanvasTexture(c);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(6,6);WL.mist=[];for(const y of [0.5,1.4]){const ms=new THREE.Mesh(new THREE.PlaneGeometry(260,260),new THREE.MeshBasicMaterial({map:tx,transparent:true,opacity:0,depthWrite:false,fog:false}));ms.rotation.x=-Math.PI/2;ms.renderOrder=4;scene.add(ms);WL.mist.push([ms,y])}}
  {const dawn=hour>4.3&&hour<8?Math.sin((hour-4.3)/3.7*Math.PI):0;for(const [ms,y] of WL.mist){ms.position.set(Math.round(p.x),WATER+y,Math.round(p.z));ms.material.opacity=dawn*0.55*(SPC?0:1)*(season===2?0.5:1);ms.material.map.offset.set(t*0.004+y,t*0.003);ms.visible=dawn>0.02}}
  // oddech pod wodą
  {const under=player.swim&&p.y+1.55<wlAt(p.x,p.z)-0.3&&VH.mode===0,el=$('airw');if(under){AIR=Math.max(0,AIR-dt);if(Math.random()<dt*2)PFX.emit(p.x,p.y+1.6,p.z,2,['#dff4ff','#ffffff'],{sp:0.4,up:1.6,life:1.2,size:0.06,g:-1.5});if(AIR<=0){airHurtT-=dt;if(airHurtT<=0){airHurtT=1;takeDamage(ST.hp*0.08,null);toast('Brakuje ci powietrza!','#ff8a7a')}}}else AIR=Math.min(12+(hasP('plywak')?8:0),AIR+dt*4);
    if(el){const mx=12+(hasP('plywak')?8:0);el.hidden=AIR>=mx-0.01;el.querySelector('i').style.width=(AIR/mx*100)+'%'}}
  // prąd rzeki: znosi pływaka i łódź w dół doliny
  {const b=biomeAt(p.x,p.z);if(b===13&&(player.swim||VH.mode===1)){const s=(x,z)=>colAt(x,z)??WATER;let gx=0,gz=0;for(const r of [12,24]){gx+=s(p.x+r,p.z)-s(p.x-r,p.z);gz+=s(p.x,p.z+r)-s(p.x,p.z-r)}const l=Math.hypot(gx,gz);if(l>0.5){const k=1.4*dt/l;p.x-=gx*k;p.z-=gz*k}}}
  fishTick(dt)}
// ---------- kamera ----------
let camY=null;
function camRay(ax,ay,az,bx,by,bz){let tmin=1;
  const box=(cx,cz,hw,hd,y0,y1,c,s)=>{const tr=(x,z)=>{const dx=x-cx,dz=z-cz;return[dx*c-dz*s,dx*s+dz*c]};const A=tr(ax,az),Bp=tr(bx,bz);
    if(Math.abs(A[0])<hw&&Math.abs(A[1])<hd&&ay>y0&&ay<y1)return;let t0=0,t1=1;for(const [p,q,lo,hi] of [[A[0],Bp[0],-hw,hw],[ay,by,y0,y1],[A[1],Bp[1],-hd,hd]]){const dd=q-p;if(Math.abs(dd)<1e-6){if(p<lo||p>hi)return;continue}let ta=(lo-p)/dd,tb=(hi-p)/dd;if(ta>tb){const t=ta;ta=tb;tb=t}t0=Math.max(t0,ta);t1=Math.min(t1,tb);if(t0>t1)return}if(t0<tmin)tmin=t0};
  for(const v of villages.values()){if(!v||Math.abs(v.x-ax)>60+(v.Hs||0)||Math.abs(v.z-az)>60+(v.Hs||0))continue;
    for(const h of v.houses){if(!h.core||Math.abs(h.x-ax)>34||Math.abs(h.z-az)>34)continue;const k=h.core;box(h.cx??h.x,h.cz??h.z,k.w/2,k.d/2,h.top-3,h.top+(h.castle?24:v.city?14:9),Math.cos(h.rot),Math.sin(h.rot))}
    if(v.cols)for(const [cx,cz,hw,hd,top] of v.cols)if(Math.abs(cx-ax)<40&&Math.abs(cz-az)<40)box(cx,cz,hw,hd,top-30,top,1,0)}
  for(const s of structs.values()){if(!s||!s.cols||Math.abs(s.x-ax)>60||Math.abs(s.z-az)>60)continue;for(const [cx,cz,hw,hd,top] of s.cols)box(cx,cz,hw,hd,top-30,top,1,0)}
  if(SPC){for(let i=1;i<=28;i++){const t=i/28,x=ax+(bx-ax)*t,z=az+(bz-az)*t,y=ay+(by-ay)*t,sh=spaceH(x,z,y);if(sh!==null&&sh>y){tmin=Math.min(tmin,(i-1)/28);break}}}
  return tmin}
let camDC=null;
function updateCamera(dt){
  const t=player.p,ty0=player.visY??t.y; if(camY===null)camY=ty0; camY+=(ty0-camY)*Math.min(1,9*dt);
  const cust=custOpen(),Y=cust?player.ry:yaw,Pp=cust?0.1:pitch,sh=cust?0:Math.min(1.05,0.35+dist*0.05);
  const rx=Math.cos(Y),rz=-Math.sin(Y),tx=t.x+rx*sh,ty=camY+(cust?1.1:1.62),tz=t.z+rz*sh;   // kamera zza prawego ramienia: postać nie zasłania celownika
  let d=cust?3.3:dist; const cp=Math.cos(Pp);
  let x=tx+Math.sin(Y)*cp*d,y=ty+Math.sin(Pp)*d,z=tz+Math.cos(Y)*cp*d;
  for(let i=0;i<8;i++){const h=colAt(x,z,y);if(h===null||y>h+0.5)break;d*=0.8;x=tx+Math.sin(Y)*cp*d;y=ty+Math.sin(Pp)*d;z=tz+Math.cos(Y)*cp*d}
  if(!cust){const tt=camRay(tx,ty,tz,x,y,z);let want=tt<1?Math.max(0.6,d*tt-0.35):d;if(camDC===null||want<camDC)camDC=want;else camDC+=(want-camDC)*Math.min(1,4*dt);if(camDC<d-0.01){d=camDC;x=tx+Math.sin(Y)*cp*d;y=ty+Math.sin(Pp)*d;z=tz+Math.cos(Y)*cp*d}}
  const h=colAt(x,z,y); if(h!==null&&y<h+0.5)y=h+0.5;if(SPC)y=Math.min(y,SPC.fy+SPC.ceil-0.35);
  camera.position.set(x,y,z); camera.lookAt(tx,ty,tz);if(P2.shake>0){const k=P2.shake;camera.position.x+=(Math.random()-0.5)*k;camera.position.y+=(Math.random()-0.5)*k;camera.position.z+=(Math.random()-0.5)*k;P2.shake=Math.max(0,k-dt*1.2)}
  { const ws=(S.rd*2+3)*C,sg=ws/160; water.position.set(Math.round(t.x/sg)*sg,WATER-0.3,Math.round(t.z/sg)*sg); water.scale.set(ws,ws,1);try{waterDepthTick(water.position.x,water.position.z,Math.min(ws,600))}catch(_){}const tt=performance.now()/1000;for(const R of WRIP){R.ms.position.set(water.position.x,WATER-0.3+R.dy,water.position.z);R.ms.scale.set(ws,ws,1);R.tx.repeat.set(ws/R.rep,ws/R.rep);R.tx.offset.set(water.position.x/R.rep+tt*R.sp[0],-water.position.z/R.rep+tt*R.sp[1]);R.ms.material.opacity=R.op+0.08*Math.sin(tt*0.6+R.rep);R.ms.visible=!SPC} }
  const under=y<wlAt(camera.position.x,camera.position.z)-0.15;
  lighting(t.x,t.y,t.z);
  if(SPC){if(SPC.kind==='interior'){sun.intensity*=0.25;hemi.intensity=0.32}else if(SPC.kind==='arena'){sun.intensity=Math.max(0.35,sun.intensity);hemi.intensity=Math.max(0.5,hemi.intensity)}else{sun.intensity=0.03;hemi.intensity=0.07}}
  try{CLOUDS.tick(performance.now()/1000,camera.position.x,camera.position.z,1-Math.min(1,Math.max(0,(SKYC.b-0.06)/0.84)))}catch(e){}
  const far=S.rd*C*0.95,near=far*0.42; scene.fog.near=under?2:near; scene.fog.far=under?28:far; scene.fog.color.copy(under?UWC:SKYC);if(SPC&&SPC.kind==='arena'){scene.fog.near=60;scene.fog.far=160;scene.fog.color.copy(SKYC).lerp(_arenaSky,0.35)}else if(SPC&&SPC.kind!=='interior'){scene.fog.near=6;scene.fog.far=46;scene.fog.color.setHex(0x07060a)}else if(SPC){scene.fog.near=20;scene.fog.far=90;scene.fog.color.setHex(0x1a140e)} scene.background=scene.fog.color;
  {const wi=WX.k==='mgla'?WX.i:WX.k!=='jasno'?WX.i*0.5:0;if(!under&&!SPC&&wi>0){scene.fog.far=Math.max(55,far*(1-0.7*wi));scene.fog.near=Math.min(scene.fog.near,scene.fog.far*0.15)}}
  if(Math.abs(camera.far-(far+200))>1||camera.fov!==S.fov){camera.far=far+200;camera.fov=S.fov;camera.updateProjectionMatrix()}
}

// ---------- sterowanie ----------
const cv=renderer.domElement;
let dragging=false;
cv.addEventListener('click',()=>{if(document.pointerLockElement!==cv&&!uiOpen()&&!noLock){try{const r=cv.requestPointerLock();r&&r.catch&&r.catch(()=>{noLock=true})}catch(e){noLock=true}}});
document.addEventListener('pointerlockerror',()=>{noLock=true});
let noLock=false;
cv.addEventListener('mousedown',e=>{dragging=true;const locked=document.pointerLockElement===cv;if(e.button===0&&(locked||noLock))P2.mouse=true;if(e.button===2&&(locked||noLock))rmbDown()});
addEventListener('mouseup',e=>{dragging=false;if(e.button===0)P2.mouse=false;if(e.button===2)rmbUp()});
addEventListener('mousemove',e=>{if(document.pointerLockElement===cv||dragging){yaw-=e.movementX*0.0035;pitch=Math.max(-0.5,Math.min(1.35,pitch+e.movementY*0.0035))}});
cv.addEventListener('wheel',e=>{dist=Math.max(3.5,Math.min(30,dist*(e.deltaY>0?1.1:0.91)));e.preventDefault()},{passive:false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
const uiOpen=()=>!$('menu').hidden||!$('chatbox').hidden||!$('clsel').hidden||custOpen()||!$('chestui').hidden;
addEventListener('beforeunload',e=>{if(S.spawn&&player.ready){e.preventDefault();e.returnValue=''}});
addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'){if(e.code==='Enter'&&e.target.id==='prenin'){const b=document.querySelector('[data-pact="rok"]');b&&b.click();return}if(e.code==='Enter'&&e.target.id==='chatin'){sendChat(e.target.value);e.target.value='';$('chatbox').hidden=true;cv.focus()}if(e.code==='Escape'&&e.target.id==='chatin'){$('chatbox').hidden=true}return}
  if((e.code==='Escape'||e.code==='KeyF')&&!$('chestui').hidden){chestUiClose();return}
  if(e.code==='Escape'&&!$('chatbox').hidden){$('chatbox').hidden=true;return}
  if(e.code==='Escape'&&FISH.st){fishCancel('Zwijasz żyłkę.');return}
  if(e.code==='Escape'&&custOpen()){closeCustom();return}
  if(e.code==='Escape'&&dlg){closeDialog();return}
  if(e.code==='Escape'&&petsOpen()){togglePets();return}
  if(e.code==='Escape'&&invOpen()){toggleInv();return}
  if(e.code==='Escape'&&!$('perks').hidden){togglePerks();return}
  if(e.code==='Escape'&&!$('clsel').hidden&&HERO.pas&&HERO.pas.length===3){$('clsel').hidden=true;return}
  if(e.code==='Escape'||e.code==='Tab'){toggleMenu();e.preventDefault();return}
  if(e.code==='KeyE'||e.code==='KeyI'){if(petsOpen())togglePets();toggleInv();return}
  if(e.code==='AltLeft'||e.code==='AltRight'){e.preventDefault();roll();return}
  if(e.code==='ControlLeft'||e.code==='ControlRight'){e.preventDefault();if(VH.mode===0&&!player.swim){P3.sneak=!P3.sneak;toast(P3.sneak?'Skradanie: włączone (Ctrl)':'Skradanie: wyłączone','#cfe8ff')}return}
  if(e.code==='KeyX'&&!player.swim){dash();return}
  if(e.code==='KeyP'){togglePets();return}
  if(e.code==='KeyK'){togglePerks();return}
  if(e.code==='KeyQ'){useAbility('q');return}
  if(!dlg&&/^Digit[1-8]$/.test(e.code)){useHot(+e.code.slice(5)-1);return}
  if(dlg&&/^Digit[1-9]$/.test(e.code)){const o=dlg.opts[+e.code.slice(5)-1];if(o&&!o[2])o[1]();return}
  if(e.code==='KeyH'){$('help').classList.toggle('min');LS.set('helpmin',$('help').classList.contains('min'));return}
  if(e.code==='F3'){S.dbg=!S.dbg;e.preventDefault();return}
  if(e.code==='KeyN'){buildHut();return}
  if(e.code==='KeyF'){if(nearLoot&&!dlg){pickLoot=true;return}if(!nearNpc&&!dlg&&!nearDoor&&!nearChest&&window.hutAct&&hutAct())return;if(nearNpc&&!dlg)openDialog(nearNpc);else if(nearDoor&&!dlg)useDoor(nearDoor);else if(nearChest&&!dlg)openChest(nearChest);return}
  if(e.code==='KeyJ'){toggleJournal();return}
  if(e.code==='KeyM'){toggleMap();return}
  if(e.code==='KeyL'){toggleLamp();return}
  if(e.code==='Enter'){$('chatbox').hidden=false;$('chatin').focus();try{document.exitPointerLock()}catch(_){}e.preventDefault();return}
  if(e.code==='Space'&&!e.repeat){if(VH.mode===2){stopGlide();e.preventDefault();return}if(startGlide()){e.preventDefault();return}}
  if(e.code==='KeyB'){toggleBoat();return}
  if(e.code==='KeyT'){if(VH.mode===0)tryTame();return}
  if(e.code==='KeyR'){toggleMount();return}
  if(e.code==='KeyU'){if(!e.repeat)fishKey();return}
  if(e.code==='Backslash'||e.code==='IntlBackslash'){if(custOpen())closeCustom();else openCustom();return}
  if(e.code==='KeyC'&&INV.eq.tarcza&&VH.mode===0&&!player.swim){useAbility('e');return}
  if(e.code==='KeyG'){toggleOwnMount('kon');return}
  if(e.code==='KeyV'){toggleOwnMount('gryf');return}
  keys.add(e.code); if(e.code==='Space')e.preventDefault();
});
addEventListener('keyup',e=>{keys.delete(e.code);if(e.code.startsWith('Alt'))e.preventDefault()});
addEventListener('blur',()=>{keys.clear();P2.mouse=false});
addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()});

// ---------- mapa / minimapa ----------
const mm=$('mini'), mx=mm.getContext('2d'), big=$('bigmap'), bx=big.getContext('2d');
// mapa: środek (cx,cz) w blokach, scale = piksele na blok; big = pełna mapa z opisami
const mapV={x:0,z:0,follow:true,drag:null};let mapScale=1.2;
// ===== mapa 3D w aksonometrii (bez postaci; miasta, osady i miejsca jako bryły) =====
const MAP3D={on:false,dirty:true};
function map3dInit(){if(MAP3D.r)return true;if(MAP3D.fail)return false;try{const cv=document.createElement('canvas');cv.id='map3d';const wrap=$('mapwrap');wrap.insertBefore(cv,big);
  const r=new THREE.WebGLRenderer({canvas:cv,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
  const sc=new THREE.Scene();sc.background=new THREE.Color(0x15110c);sc.add(new THREE.HemisphereLight(0xe8eeff,0x3a2a1a,0.72));const dl=new THREE.DirectionalLight(0xfff0d8,0.9);dl.position.set(-0.5,1,0.3);sc.add(dl);
  const cam=new THREE.OrthographicCamera(-1,1,1,-1,-5000,5000);const ms=new THREE.Scene();ms.add(new THREE.HemisphereLight(0xe8eeff,0x3a2a1a,0.72));const dl2=new THREE.DirectionalLight(0xfff0d8,0.9);dl2.position.set(-0.5,1,0.3);ms.add(dl2);Object.assign(MAP3D,{r,scene:sc,cam,cv,miniScene:ms,mini:{},miniCam:new THREE.OrthographicCamera(-1,1,1,-1,-5000,5000)});return true}catch(e){console.warn('map3d',e);MAP3D.fail=1;return false}}
function mapHeightAt(x,z){const cx=Math.floor(x/C),cz=Math.floor(z/C),H=MAPH.get(K(cx,cz));if(!H)return null;const i=Math.min(15,Math.max(0,Math.floor((x-cx*C)/2))),j=Math.min(15,Math.max(0,Math.floor((z-cz*C)/2)));return H[j*16+i]}
let MAPMAT=null,MAPTM=null;const MAPSTR=new Map();
const MTREE={0:['#3f7a35',0],1:['#2f5a2e',1],2:['#5a9a4a',0],3:['#4a8a3a',2],8:['#dfe8ee',1],14:['#7a8a3a',3],15:['#6a7a3a',0],16:['#c8642a',0],17:['#f0a8c0',0]};
function mapMat(){return MAPMAT||(MAPMAT=new THREE.MeshLambertMaterial({vertexColors:true}))}
function mapCaptureStruct(s){if(!s||!s.g||MAPSTR.has(s.id))return;try{const g=new THREE.Group();s.g.updateWorldMatrix(true,true);s.g.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.attributes&&o.geometry.attributes.color&&(o.material===matB||o.material===decoMat)){const m=new THREE.Mesh(o.geometry,mapMat());m.matrixAutoUpdate=false;m.matrix.copy(o.matrixWorld);m.userData.keep=1;g.add(m)}});if(g.children.length)MAPSTR.set(s.id,g)}catch(e){}}
function map3dBuild(W,H,mini){const M0=MAP3D,M=mini?M0.mini:M0,sc=mini?M0.miniScene:M0.scene;if(M.grp){sc.remove(M.grp);M.grp.traverse(o=>{if(o.userData.keep)return;if(o.userData.keepMat)return;if(o.geometry)o.geometry.dispose();if(o.material&&o.material!==MAPMAT&&o.material!==MAPTM)o.material.dispose()})}
  const g=new THREE.Group();M.grp=g;sc.add(g);const cx=mini?player.p.x:mapV.x,cz=mini?player.p.z:mapV.z,R=mini?MINIR*1.6:Math.min(1500,Math.max(140,Math.hypot(W,H)/2/mapScale*1.35)),st=R<300?2:R<750?4:8;Object.assign(M,{bx:cx,bz:cz,bs:mapScale,bR:R,dirty:false,bt:performance.now()});
  const c0x=Math.floor((cx-R)/C),c1x=Math.floor((cx+R)/C),c0z=Math.floor((cz-R)/C),c1z=Math.floor((cz+R)/C),cells=[],BASE=WATER-12,trees=[],stp=st/2;
  for(let z=c0z;z<=c1z;z++)for(let x=c0x;x<=c1x;x++){const k=K(x,z),Hh=MAPH.get(k),T=thumbs.get(k);if(!Hh||!T)continue;const d=T._d,ts=T.width;
    for(let j=0;j<16;j+=stp)for(let i=0;i<16;i+=stp){const wx=x*C+i*2,wz=z*C+j*2;if(Math.hypot(wx-cx,wz-cz)>R)continue;const px=Math.min(ts-1,Math.floor((i*2+1)/C*ts)),pz=Math.min(ts-1,Math.floor((j*2+1)/C*ts)),o=(pz*ts+px)*4;cells.push(wx,wz,Hh[j*16+i],d?d[o]:120,d?d[o+1]:140,d?d[o+2]:90)}
    {const Tt=MAPT.get(k),sub=R<700?1:R<1000?2:R<1300?3:4;if(Tt)for(let i=((x*7+z*13)%sub+sub)%sub*5;i<Tt.length;i+=5*sub)if(Math.hypot(Tt[i]-cx,Tt[i+2]-cz)<R)trees.push(Tt[i],Tt[i+1],Tt[i+2],Tt[i+3]*(sub>1?1+0.12*(sub-1):1),Tt[i+4])}}
  const n=cells.length/6;if(n){if(!MAPTM){MAPTM=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(MAPTM,true);const ob=MAPTM.onBeforeCompile;MAPTM.onBeforeCompile=sh=>{ob(sh);sh.fragmentShader=sh.fragmentShader.replace('float fade=1.-smoothstep(40.,120.,length(uCam-vWp));','float fade=.9;')};MAPTM.customProgramCacheKey=()=>'mapT'}const geo=new THREE.BoxGeometry(1,1,1);geo.translate(0.5,0.5,0.5);{const cc=new Float32Array(geo.attributes.position.count*3).fill(1);geo.setAttribute('color',new THREE.Float32BufferAttribute(cc,3))}
    const im=new THREE.InstancedMesh(geo,MAPTM,n),m4=new THREE.Matrix4(),col=new THREE.Color();
    for(let i=0;i<n;i++){const o=i*6,hh=Math.round(cells[o+2]),top=Math.max(hh,BASE+0.5);m4.makeScale(st,top-BASE,st);m4.setPosition(cells[o],BASE,cells[o+1]);im.setMatrixAt(i,m4);col.setRGB(cells[o+3]/255,cells[o+4]/255,cells[o+5]/255);im.setColorAt(i,col)}
    im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.frustumCulled=false;g.add(im)}
  const wp=new THREE.Mesh(new THREE.PlaneGeometry(R*2.2,R*2.2),new THREE.MeshLambertMaterial({color:0x3f7db5,transparent:true,opacity:0.74,depthWrite:false}));wp.rotation.x=-Math.PI/2;wp.position.set(cx,WATER-0.3,cz);g.add(wp);
  // drzewa
  if(trees.length){const by={},nt=trees.length/5,far=R>=700,thin=Math.max(1,Math.ceil(nt/40000));for(let i=0;i<nt;i+=thin){const o=i*5;let k=TK[trees[o+4]];if(!k||!OBJGEO[k])continue;if(far&&OBJGEO[k+'_l'])k=k+'_l';(by[k]=by[k]||[]).push(i)}const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),ax=new THREE.Vector3(0,1,0),pv=new THREE.Vector3(),sv=new THREE.Vector3();
    for(const k in by){const L=by[k],im=new THREE.InstancedMesh(OBJGEO[k],imMat(k),L.length);L.forEach((i,j)=>{const o=i*5,sc=trees[o+3]*(SCL[k]||SCL[k.replace('_l','')]||TS);q.setFromAxisAngle(ax,((trees[o]*7.13+trees[o+2]*3.7)%4|0)*Math.PI/2);m4.compose(pv.set(trees[o],trees[o+1],trees[o+2]),q,sv.set(sc,sc,sc));im.setMatrixAt(j,m4)});im.instanceMatrix.needsUpdate=true;im.frustumCulled=false;im.userData.keepMat=1;g.add(im)}}
  // drogi
  {const segs=[];for(const r of roads)for(const P of roadSeenSegs(r)){for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2;if(Math.hypot(mx-cx,mz-cz)>R)continue;segs.push(a,b)}}
    if(segs.length){const geo=new THREE.BoxGeometry(1,1,1);const im=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial({color:0xc8a870}),segs.length/2),m4=new THREE.Matrix4(),q4=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),sv=new THREE.Vector3();
      for(let i=0;i<segs.length;i+=2){const a=segs[i],b=segs[i+1],L=Math.hypot(b[0]-a[0],b[1]-a[1])+1.5,mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2,y=Math.max(WATER,mapHeightAt(mx,mz)??WATER)+0.45;e.set(0,Math.atan2(b[0]-a[0],b[1]-a[1]),0);q4.setFromEuler(e);m4.compose(v.set(mx,y,mz),q4,sv.set(2.6,0.5,L));im.setMatrixAt(i/2,m4)}
      im.instanceMatrix.needsUpdate=true;g.add(im)}}
  // osady i miasta: prawdziwe modele domów, murów i dekoracji
  const mm=mapMat(),B=[],add=(x,y,z,w,h,d,c)=>B.push(x,y,z,w,h,d,c);let budget=mini?3:14;
  const put=(geo,x,y,z,ry)=>{const o=new THREE.Group();o.position.set(x,y,z);o.rotation.y=ry||0;const inner=new THREE.Group();inner.scale.setScalar(BS);const me=new THREE.Mesh(geo,mm);me.userData.keep=1;inner.add(me);o.add(inner);g.add(o)};
  for(const v of villages.values()){if(!v||!villSeen(v)||v.wander)continue;if(Math.hypot(v.x-cx,v.z-cz)>R+(v.Hs||40))continue;const vy=v.h??mapHeightAt(v.x,v.z)??WATER;
    try{if(v.city){if(!v._mapWall)v._mapWall=raceWall(cityWallGeo(v),v.race);put(v._mapWall,v.x,v.h,v.z,0)}if(v._mapDeco===undefined)v._mapDeco=decorGeo(v)||null;if(v._mapDeco)put(v._mapDeco,v.x,v.h,v.z,0)}catch(e){}
    for(const h of v.houses){if(h.arena){const o=new THREE.Group();o.position.set(h.x,h.top,h.z);o.rotation.y=h.rot;const me=new THREE.Mesh(arenaExtGeo(),mm);me.userData.keep=1;o.add(me);g.add(o);continue}const key=h.type+'|'+h.v+'|'+v.race;let Mh=houseCache.get(key);if(!Mh&&budget>0&&R<900){budget--;try{Mh=houseModel(h.type,h.v,v.race)}catch(e){}}
      if(Mh&&Mh.geo)put(Mh.geo,h.x,h.top,h.z,h.rot);else{const w=Math.max(5,(h.core?h.core.pw:8)*0.9),y0=h.top??vy,tall=h.castle?20:v.city?10:5.5,rh=Math.max(2,w*0.32);add(h.x,y0,h.z,w,tall,w,h.castle?0x8a8490:0xd8c49a);add(h.x,y0+tall,h.z,w*0.9,rh,w*0.9,h.castle?0x5a5a68:0xa8452c);M.dirty=true}}}
  if(budget<=0)M.dirty=true;
  for(const s of structs.values()){if(!strSeen(s)||s.friendly)continue;if(Math.hypot(s.x-cx,s.z-cz)>R+30)continue;const cap=MAPSTR.get(s.id);
    if(cap){for(const ch of cap.children){const me=new THREE.Mesh(ch.geometry,mm);me.matrixAutoUpdate=false;me.matrix.copy(ch.matrix);me.userData.keep=1;g.add(me)}continue}
    if(s.type==='zamczysko'||s.type==='grota'){try{if(!s._mapGeo)s._mapGeo=s.type==='zamczysko'?castleGeo(s):grotaGeo(s,rngOf('st'+s.id));put(s._mapGeo,s.x,s.h,s.z,0);continue}catch(e){}}
    const y=s.h??mapHeightAt(s.x,s.z)??WATER,c=new THREE.Color(STRC[s.type]||'#c84a2a').getHex();add(s.x,y,s.z,7,6,7,0x6a6670);add(s.x,y+6,s.z,5,3,5,0x7d7884);add(s.x,y+9,s.z,3,3,3,c)}
  if(B.length){const n2=B.length/7,geo=new THREE.BoxGeometry(1,1,1);geo.translate(0,0.5,0);const im=new THREE.InstancedMesh(geo,new THREE.MeshLambertMaterial(),n2),m4=new THREE.Matrix4(),col=new THREE.Color();for(let i=0;i<n2;i++){const o=i*7;m4.makeScale(B[o+3],B[o+4],B[o+5]);m4.setPosition(B[o],B[o+1],B[o+2]);im.setMatrixAt(i,m4);col.setHex(B[o+6]);im.setColorAt(i,col)}im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;g.add(im)}
  M.border=null;if(!mini&&S.gen===2){const bl=[],stp=Math.max(8,R/70);for(let z=cz-R;z<cz+R;z+=stp)for(let x=cx-R;x<cx+R;x+=stp){const a=kingdomAtM(x,z),b=kingdomAtM(x+stp,z),c=kingdomAtM(x,z+stp);if(a&&((b&&b.id!==a.id)||(c&&c.id!==a.id)))bl.push([x,(mapHeightAt(x,z)??WATER)+2,z])}M.border=bl}}

function map3dRender(){const M=MAP3D,cv=M.cv,W=cv.clientWidth,H=cv.clientHeight;if(!W||!H)return;const pr=M.r.getPixelRatio();if(cv.width!==Math.round(W*pr)||cv.height!==Math.round(H*pr))M.r.setSize(W,H,false);
  if(M.dirty||!M.grp||Math.hypot(mapV.x-M.bx,mapV.z-M.bz)>M.bR*0.3||mapScale/M.bs>1.45||M.bs/mapScale>1.45){if(performance.now()-(M.lb||0)>250){M.lb=performance.now();map3dBuild(W,H)}}
  const cam=M.cam,hw=W/2/mapScale,hh=H/2/mapScale;cam.left=-hw;cam.right=hw;cam.top=hh;cam.bottom=-hh;cam.updateProjectionMatrix();const ty=WATER+4;cam.position.set(mapV.x+700,ty+780,mapV.z+700);cam.lookAt(mapV.x,ty,mapV.z);cam.updateMatrixWorld();M.r.render(M.scene,cam)}
const MINIR=72;
function miniDraw(){const W=mm.width,H=mm.height;if(!$('mapwrap').hidden||MAP3D.fail||!map3dInit()){if($('mapwrap').hidden||MAP3D.fail)drawMap(mx,W,H,1.6);return}
  try{const M=MAP3D,mi=M.mini;if(!mi.grp||Math.hypot(player.p.x-mi.bx,player.p.z-mi.bz)>MINIR*0.35||performance.now()-mi.bt>6000)map3dBuild(W,H,true);
    const pr=M.r.getPixelRatio();if(M.cv.width!==Math.round(W*pr)||M.cv.height!==Math.round(H*pr))M.r.setSize(W,H,false);
    const sc=W/2/MINIR,cam=M.miniCam,hw=W/2/sc,hh=H/2/sc;cam.left=-hw;cam.right=hw;cam.top=hh;cam.bottom=-hh;cam.updateProjectionMatrix();const ty=player.p.y;cam.position.set(player.p.x+700,ty+780,player.p.z+700);cam.lookAt(player.p.x,ty,player.p.z);cam.updateMatrixWorld();
    M.miniScene.background=new THREE.Color(0x15110c);M.r.render(M.miniScene,cam);
    mx.save();mx.clearRect(0,0,W,H);mx.beginPath();mx.arc(W/2,H/2,W/2,0,6.283);mx.clip();mx.drawImage(M.cv,0,0,W,H);
    const P=(x,y,z)=>{const v=new THREE.Vector3(x,y,z).project(cam);return[(v.x+1)/2*W,(1-v.y)/2*H]};
    for(const [qx,qz,col] of questMarks()){let a=P(qx,player.p.y,qz);const dx=a[0]-W/2,dy=a[1]-H/2,l=Math.hypot(dx,dy),mr=W/2-8;if(l>mr)a=[W/2+dx/l*mr,H/2+dy/l*mr];mx.fillStyle=col;mx.strokeStyle='#1d1a14';mx.lineWidth=2;mx.beginPath();mx.arc(a[0],a[1],5,0,6.283);mx.fill();mx.stroke()}
    for(const mk of MARKS.values()){let a=P(mk.x,(mapHeightAt(mk.x,mk.z)??player.p.y),mk.z);const dx=a[0]-W/2,dy=a[1]-H/2,l=Math.hypot(dx,dy),mr=W/2-12,edge=l>mr;if(edge)a=[W/2+dx/l*mr,H/2+dy/l*mr];mx.fillStyle=mk.col;mx.strokeStyle='#1d1a14';mx.lineWidth=2;mx.beginPath();mx.moveTo(a[0],a[1]);mx.lineTo(a[0]-5,a[1]-9);mx.arc(a[0],a[1]-11,5.5,Math.PI*0.8,Math.PI*0.2,false);mx.lineTo(a[0],a[1]);mx.closePath();mx.fill();mx.stroke();mx.fillStyle='#fff';mx.beginPath();mx.arc(a[0],a[1]-11,2,0,6.283);mx.fill()}
    for(const e of enemies.values()){if(e.st===2)continue;const a=P(e.p.x,e.p.y,e.p.z);if(Math.hypot(a[0]-W/2,a[1]-H/2)>W/2-3)continue;mx.fillStyle=e.pas?'#7dc8ff':EDEF[e.t].boss?'#b874ff':'#ff6b5b';mx.beginPath();mx.arc(a[0],a[1],EDEF[e.t].boss?4:2.2,0,6.283);mx.fill()}
    for(const r of remotes.values()){const a=P(r.g.position.x,r.g.position.y,r.g.position.z);mx.fillStyle=r.color;mx.beginPath();mx.arc(a[0],a[1],4,0,6.283);mx.fill()}
    {const a=P(player.p.x,player.p.y,player.p.z),b=P(player.p.x+Math.sin(player.ry)*10,player.p.y,player.p.z+Math.cos(player.ry)*10),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);mx.translate(a[0],a[1]);mx.rotate(ang+Math.PI/2);mx.fillStyle=S.color;mx.strokeStyle='#fff';mx.lineWidth=2;mx.beginPath();mx.moveTo(0,-10);mx.lineTo(7,8);mx.lineTo(0,4);mx.lineTo(-7,8);mx.closePath();mx.fill();mx.stroke();mx.setTransform(1,0,0,1,0,0)}
    const g=mx.createRadialGradient(W/2,H/2,W*0.34,W/2,H/2,W/2);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.5)');mx.fillStyle=g;mx.fillRect(0,0,W,H);mx.restore();
    {const a=P(player.p.x,player.p.y,player.p.z),b=P(player.p.x,player.p.y,player.p.z-50),dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=W/2+dx/l*(W/2-12),ny=H/2+dy/l*(H/2-12);mx.font='700 13px "Pixelify Sans",monospace';mx.textAlign='center';mx.textBaseline='middle';mx.lineWidth=4;mx.strokeStyle='rgba(16,11,6,.95)';mx.strokeText('N',nx,ny);mx.fillStyle='#ffd34d';mx.fillText('N',nx,ny);mx.textBaseline='alphabetic'}
  }catch(err){console.warn('minimapa',err);drawMap(mx,W,H,1.6)}}
function mapProj(x,y,z,W,H){const v=new THREE.Vector3(x,y,z).project(MAP3D.cam);return[(v.x+1)/2*W,(1-v.y)/2*H]}
function mapPick(e){const r=big.getBoundingClientRect();if(!MAP3D.on)return[mapV.x+(e.clientX-r.left-big.width/2)/mapScale,mapV.z+(e.clientY-r.top-big.height/2)/mapScale];
  const nx=(e.clientX-r.left)/r.width*2-1,ny=-((e.clientY-r.top)/r.height*2-1),cam=MAP3D.cam,p=new THREE.Vector3(nx,ny,-1).unproject(cam),d=new THREE.Vector3(0,0,-1).transformDirection(cam.matrixWorld),y0=WATER+4,t=(y0-p.y)/d.y;return[p.x+d.x*t,p.z+d.z*t]}
function drawMap3DOverlay(ctx,W,H){ctx.clearRect(0,0,W,H);const P=(x,y,z)=>mapProj(x,y,z,W,H),vis=(a,m)=>a[0]>-m&&a[1]>-m&&a[0]<W+m&&a[1]<H+m;
  const lab=(t,x,y,sz,col)=>{ctx.font=`600 ${sz+2}px "Pixelify Sans",monospace`;ctx.textAlign='center';ctx.lineWidth=4;ctx.lineJoin='miter';ctx.strokeStyle='rgba(16,11,6,.95)';ctx.strokeText(t,x,y);ctx.fillStyle=col||'#f3e6c4';ctx.fillText(t,x,y)};
  for(const v of villages.values()){if(!v||!villSeen(v)||v.wander)continue;const vy=(v.h??mapHeightAt(v.x,v.z)??WATER)+(v.city?24:10),a=P(v.x,vy,v.z);if(!vis(a,80))continue;lab(v.name||(v.city?'Miasto':'Osada'),a[0],a[1],v.city?Math.round(15+Math.min(6,mapScale*2)):12,v.city?'#ffe7a8':'#f3efe6')}
  if(S.gen===2){for(const k of KING.values()){const [x,z]=[k.x,k.z],a=P(x,(mapHeightAt(x,z)??WATER)+30,z);if(!vis(a,200))continue;lab(kName(k),a[0],a[1],Math.round(18+Math.min(10,mapScale*6)),KCOL[k.race])}
    if(MAP3D.border){ctx.fillStyle='rgba(255,230,160,.55)';for(const b of MAP3D.border){const a=P(b[0],b[1],b[2]);if(vis(a,2))ctx.fillRect(a[0]-1.5,a[1]-1.5,3,3)}}}
  if(mapScale>0.9)for(const v of villages.values()){if(!v||!v.districts||!villSeen(v))continue;for(const d of v.districts){const a=P(d.x,(v.h||WATER)+14,d.z);if(!vis(a,40))continue;lab(d.n,a[0],a[1],10,'#cfe0ff')}}
  for(const s of structs.values()){if(!strSeen(s)||s.friendly)continue;const y=(s.h??mapHeightAt(s.x,s.z)??WATER)+13,a=P(s.x,y,s.z);if(!vis(a,60))continue;const cl=strState.get(s.key||'')&&strState.get(s.key||'').cleared;if(mapScale>0.45)lab(s.name+(cl?' ✓':''),a[0],a[1],11,'#e8dcc0')}
  const pin=(x,z,col,txt)=>{const y=(mapHeightAt(x,z)??WATER)+1,a=P(x,y,z);const sx=Math.max(10,Math.min(W-10,a[0])),sy=Math.max(22,Math.min(H-6,a[1]));ctx.fillStyle=col;ctx.strokeStyle='#1d1a14';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(sx-6,sy-11);ctx.arc(sx,sy-14,6.5,Math.PI*0.8,Math.PI*0.2,false);ctx.closePath();ctx.fill();ctx.stroke();if(txt)lab(txt,sx,sy-24,11,'#fff')};
  for(const [qx,qz,col] of questMarks())pin(qx,qz,col);
  for(const mk of MARKS.values())pin(mk.x,mk.z,mk.col,mk.n);
  for(const r of remotes.values())pin(r.g.position.x,r.g.position.z,r.color,r.name);
  {const y=(mapHeightAt(player.p.x,player.p.z)??player.p.y),a=P(player.p.x,y,player.p.z),b=P(player.p.x+Math.sin(player.ry)*12,y,player.p.z+Math.cos(player.ry)*12),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);ctx.save();ctx.translate(a[0],a[1]);ctx.rotate(ang+Math.PI/2);ctx.fillStyle=S.color;ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(0,-11);ctx.lineTo(8,9);ctx.lineTo(0,4);ctx.lineTo(-8,9);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
  {const a=P(mapV.x,WATER,mapV.z),b=P(mapV.x,WATER,mapV.z-50),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),rx=W-60,ry=72;ctx.save();ctx.translate(rx,ry);ctx.fillStyle='rgba(16,11,6,.7)';ctx.beginPath();ctx.arc(0,0,34,0,6.283);ctx.fill();ctx.strokeStyle='#c9a24a';ctx.lineWidth=2;ctx.stroke();ctx.rotate(ang+Math.PI/2);ctx.fillStyle='#e5483b';ctx.beginPath();ctx.moveTo(0,-27);ctx.lineTo(6,0);ctx.lineTo(-6,0);ctx.closePath();ctx.fill();ctx.fillStyle='#e8dcc0';ctx.beginPath();ctx.moveTo(0,27);ctx.lineTo(6,0);ctx.lineTo(-6,0);ctx.closePath();ctx.fill();ctx.rotate(-(ang+Math.PI/2));const nx=Math.cos(ang)*44,ny=Math.sin(ang)*44;ctx.restore();lab('N',rx+nx,ry+ny+5,14,'#ffd34d')}
  ctx.font='600 13px "Alegreya Sans",sans-serif';ctx.textAlign='right';ctx.fillStyle='#e8dcc0';ctx.fillText(`X ${Math.round(mapV.x)}  Z ${Math.round(mapV.z)}  ·  ×${mapScale.toFixed(2)}`,W-16,H-14)}

function drawMap(ctx,W,H,scale,cx,cz,big){
  cx=cx??player.p.x;cz=cz??player.p.z;const px=player.p.x,pz=player.p.z,cs=C*scale,SX=x=>W/2+(x-cx)*scale,SZ=z=>H/2+(z-cz)*scale;
  ctx.save();ctx.fillStyle='#14110c';ctx.fillRect(0,0,W,H);
  ctx.imageSmoothingEnabled=scale<1.5;
  const c0x=Math.floor((cx-W/2/scale)/C)-1,c1x=Math.floor((cx+W/2/scale)/C)+1,c0z=Math.floor((cz-H/2/scale)/C)-1,c1z=Math.floor((cz+H/2/scale)/C)+1;
  for(let z=c0z;z<=c1z;z++)for(let x=c0x;x<=c1x;x++){const t=thumbs.get(K(x,z));if(t)ctx.drawImage(t,Math.floor(SX(x*C)),Math.floor(SZ(z*C)),Math.ceil(cs)+1,Math.ceil(cs)+1)}
  // siatka współrzędnych
  if(big){const step=scale>2?128:scale>0.6?256:512;ctx.strokeStyle='rgba(255,240,210,.08)';ctx.lineWidth=1;ctx.beginPath();
    for(let x=Math.floor((cx-W/2/scale)/step)*step;x<cx+W/2/scale;x+=step){ctx.moveTo(SX(x)+.5,0);ctx.lineTo(SX(x)+.5,H)}
    for(let z=Math.floor((cz-H/2/scale)/step)*step;z<cz+H/2/scale;z+=step){ctx.moveTo(0,SZ(z)+.5);ctx.lineTo(W,SZ(z)+.5)}ctx.stroke()}
  // drogi
  ctx.lineCap='round';ctx.lineJoin='round';
  for(const [lw,col] of [[Math.max(2.5,scale*3.4),'rgba(60,40,20,.55)'],[Math.max(1.4,scale*2.2),'rgba(214,180,120,.95)']]){ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();for(const r of roads)for(const sg of roadSeenSegs(r)){sg.forEach((p,i)=>{i?ctx.lineTo(SX(p[0]),SZ(p[1])):ctx.moveTo(SX(p[0]),SZ(p[1]))})}ctx.stroke()}
  const lab=(t,x,y,sz,col)=>{ctx.font=`700 ${sz}px Cinzel,"Alegreya Sans",serif`;ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='rgba(20,14,8,.85)';ctx.strokeText(t,x,y);ctx.fillStyle=col||'#f3e6c4';ctx.fillText(t,x,y)};
  const vis=(x,y,mg)=>x>-mg&&y>-mg&&x<W+mg&&y<H+mg;
  // miasta: mury, wieże
  for(const v of villages.values()){if(!v||!v.city||!villSeen(v))continue;const sx=SX(v.x),sz=SZ(v.z),s=v.Hs*scale;if(!vis(sx,sz,s+60))continue;
    ctx.fillStyle='rgba(196,170,130,.55)';ctx.fillRect(sx-s,sz-s,s*2,s*2);ctx.strokeStyle='#5d5a63';ctx.lineWidth=Math.max(2,scale*2.4);ctx.strokeRect(sx-s,sz-s,s*2,s*2);
    const tw=Math.max(4,scale*6);ctx.fillStyle='#8e8994';for(const [ax,az] of [[-1,-1],[1,-1],[-1,1],[1,1]]){ctx.fillRect(sx+ax*s-tw/2,sz+az*s-tw/2,tw,tw);ctx.fillStyle='#a8452c';ctx.fillRect(sx+ax*s-tw/4,sz+az*s-tw/4,tw/2,tw/2);ctx.fillStyle='#8e8994'}
    if(scale>1.2)for(const h of v.houses){ctx.fillStyle=h.castle?'#7a7480':'#a8452c';const hw=(h.core?h.core.pw:8)*scale/2;ctx.fillRect(SX(h.x)-hw,SZ(h.z)-hw,hw*2,hw*2)}
    if(big||W>150)lab(v.name||'Miasto',sx,sz-s-8,big?Math.round(15+Math.min(6,scale*2)):11)}
  for(const v of villages.values()){if(!v||v.city||!villSeen(v))continue;const sx=SX(v.x),sz=SZ(v.z);if(!vis(sx,sz,60))continue;
    if(scale>1.5)for(const h of v.houses){ctx.fillStyle='#b8573a';const hw=4.2*scale;ctx.fillRect(SX(h.x)-hw,SZ(h.z)-hw,hw*2,hw*2)}
    else{ctx.fillStyle='#b8573a';ctx.strokeStyle='#1d1a14';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(sx-6,sz+5);ctx.lineTo(sx-6,sz-1);ctx.lineTo(sx,sz-7);ctx.lineTo(sx+6,sz-1);ctx.lineTo(sx+6,sz+5);ctx.closePath();ctx.fill();ctx.stroke()}
    if(big||W>150)lab(v.name||'Osada',sx,sz-12,big?13:10,'#f3efe6')}
  for(const s of structs.values()){if(!strSeen(s)||s.friendly)continue;const sx=SX(s.x),sz=SZ(s.z);if(!vis(sx,sz,60))continue;
    ctx.fillStyle=STRC[s.type];ctx.strokeStyle='#1d1a14';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx,sz-7);ctx.lineTo(sx+6,sz);ctx.lineTo(sx,sz+7);ctx.lineTo(sx-6,sz);ctx.closePath();ctx.fill();ctx.stroke();
    const cl=strState.get(s.key||'')&&strState.get(s.key||'').cleared;if(big&&scale>0.5)lab(s.name+(cl?' ✓':''),sx,sz-11,11,'#e8dcc0')}
  for(const [mx2,mz2,col] of questMarks()){const sx=Math.max(8,Math.min(W-8,SX(mx2))),sz=Math.max(8,Math.min(H-8,SZ(mz2)));ctx.fillStyle=col;ctx.strokeStyle='#1d1a14';ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sz,6,0,6.283);ctx.fill();ctx.stroke();ctx.fillStyle='#1d1a14';ctx.font='900 10px Poppins,sans-serif';ctx.textAlign='center';ctx.fillText('!',sx,sz+3.5)}
  for(const mk of MARKS.values()){const sx=Math.max(10,Math.min(W-10,SX(mk.x))),sz=Math.max(14,Math.min(H-6,SZ(mk.z)));ctx.fillStyle=mk.col;ctx.strokeStyle='#1d1a14';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(sx,sz);ctx.lineTo(sx-6,sz-10);ctx.arc(sx,sz-12,6.3,Math.PI*0.85,Math.PI*0.15,false);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#1d1a14';ctx.beginPath();ctx.arc(sx,sz-12,2.2,0,6.283);ctx.fill();if(big||W>150)lab(mk.n,sx,sz-23,big?13:10,mk.col)}
  const arrow=(x,z,col,ry,me)=>{const sx=SX(x),sz=SZ(z);ctx.save();ctx.translate(sx,sz);ctx.rotate(-ry+Math.PI);const k=me?1.25:1;ctx.scale(k,k);ctx.fillStyle=col;ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(6.5,7);ctx.lineTo(0,3.5);ctx.lineTo(-6.5,7);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()};
  if(big)for(const e of enemies.values()){if(e.st===2)continue;const sx=SX(e.p.x),sz=SZ(e.p.z);if(!vis(sx,sz,4))continue;ctx.fillStyle=e.pas?'#7dc8ff':EDEF[e.t].boss?'#b874ff':'#ff6b5b';ctx.beginPath();ctx.arc(sx,sz,EDEF[e.t].boss?5:2.6,0,6.283);ctx.fill()}
  if(PET&&big){ctx.fillStyle='#7dd87d';ctx.beginPath();ctx.arc(SX(PET.p.x),SZ(PET.p.z),3.5,0,6.283);ctx.fill()}
  for(const r of remotes.values()){arrow(r.g.position.x,r.g.position.z,r.color,r.g.rotation.y);if(big)lab(r.name,SX(r.g.position.x),SZ(r.g.position.z)-12,11,'#fff')}
  arrow(px,pz,S.color,player.ry,true);
  if(big){// róża wiatrów i podziałka
    const rx=W-58,ry=70;ctx.translate(rx,ry);ctx.fillStyle='rgba(20,14,8,.6)';ctx.beginPath();ctx.arc(0,0,34,0,6.283);ctx.fill();ctx.strokeStyle='#c9a24a';ctx.lineWidth=2;ctx.stroke();
    for(let k=0;k<4;k++){ctx.rotate(Math.PI/2);ctx.fillStyle=k===3?'#e5483b':'#e8dcc0';ctx.beginPath();ctx.moveTo(0,-28);ctx.lineTo(6,0);ctx.lineTo(-6,0);ctx.closePath();ctx.fill()}
    ctx.setTransform(1,0,0,1,0,0);lab('N',rx,ry-38,13,'#ffd34d');
    const nice=[10,25,50,100,250,500,1000,2500].find(v=>v*scale>70)||5000,bw=nice*scale;ctx.fillStyle='rgba(20,14,8,.6)';ctx.fillRect(14,H-58,bw+16,30);ctx.fillStyle='#e8dcc0';ctx.fillRect(22,H-36,bw,4);ctx.fillRect(22,H-42,2,10);ctx.fillRect(22+bw-2,H-42,2,10);
    ctx.font='600 12px "Alegreya Sans",sans-serif';ctx.textAlign='left';ctx.fillText(nice+' bloków',22,H-44);
    ctx.textAlign='right';ctx.fillStyle='#e8dcc0';ctx.fillText(`X ${Math.round(cx)}  Z ${Math.round(cz)}  ·  ×${scale.toFixed(2)}`,W-16,H-14)}
  else{// minimapa: okrągła, z literą N
    
    const g=ctx.createRadialGradient(W/2,H/2,W*0.32,W/2,H/2,W/2);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.45)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(W/2,H/2,W/2,0,6.283);ctx.fill();
    lab('N',W/2,15,12,'#ffd34d')}
  ctx.restore();
}
function toggleMap(){const o=$('mapwrap');o.hidden=!o.hidden;MAP3D.dirty=true;if(!o.hidden){big.width=o.clientWidth;big.height=o.clientHeight;mapV.x=player.p.x;mapV.z=player.p.z;mapV.follow=true;try{document.exitPointerLock()}catch(e){}}}
big.addEventListener('wheel',e=>{if(MAP3D.on){mapScale=Math.max(0.08,Math.min(8,mapScale*(e.deltaY>0?0.85:1.18)));e.preventDefault();return}const r=big.getBoundingClientRect(),ox=e.clientX-r.left-big.width/2,oz=e.clientY-r.top-big.height/2,wx=mapV.x+ox/mapScale,wz=mapV.z+oz/mapScale;
  mapScale=Math.max(0.08,Math.min(8,mapScale*(e.deltaY>0?0.85:1.18)));mapV.x=wx-ox/mapScale;mapV.z=wz-oz/mapScale;mapV.follow=false;e.preventDefault()},{passive:false});
big.addEventListener('mousedown',e=>{if(e.button!==0)return;mapV.drag=[e.clientX,e.clientY,mapV.x,mapV.z];mapV.down=[e.clientX,e.clientY];big.style.cursor='grabbing'});
big.addEventListener('mouseup',e=>{if(e.button!==0||!mapV.down)return;const d=Math.hypot(e.clientX-mapV.down[0],e.clientY-mapV.down[1]);mapV.down=null;if(d>5)return;const [x,z]=mapPick(e);
  const mk={x,z,n:S.name,col:S.color,t:180};MARKS.set('p'+NET.id,mk);sendFx({k:'mark',id:NET.id,x,z,n:S.name,col:S.color});sfx('coin',0.4);toast('Znacznik postawiony'+(NET.role!=='off'?' – widzi go drużyna':''),S.color)});
big.addEventListener('contextmenu',e=>{e.preventDefault();if(MARKS.delete('p'+NET.id)){sendFx({k:'unmark',id:NET.id});toast('Znacznik usunięty','#d2c29e')}});
addEventListener('mousemove',e=>{if(!mapV.drag)return;if(MAP3D.on&&MAP3D.cam){const cam=MAP3D.cam,r=new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld,0),uu=new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld,1),ug=new THREE.Vector3(uu.x,0,uu.z),hl=ug.length()||1;ug.normalize();const dx=e.clientX-mapV.drag[0],dy=e.clientY-mapV.drag[1];mapV.x=mapV.drag[2]-r.x*dx/mapScale+ug.x*dy/(mapScale*hl);mapV.z=mapV.drag[3]-r.z*dx/mapScale+ug.z*dy/(mapScale*hl);mapV.follow=false;return}mapV.x=mapV.drag[2]-(e.clientX-mapV.drag[0])/mapScale;mapV.z=mapV.drag[3]-(e.clientY-mapV.drag[1])/mapScale;mapV.follow=false});
addEventListener('mouseup',()=>{if(mapV.drag){mapV.drag=null;big.style.cursor='grab'}});

// ---------- sieć: host / klient ----------
// Topologia gwiazdy: klienci rozmawiają tylko z hostem. Własny ruch należy do gracza (bez opóźnienia),
// świat, wrogowie i łup (od etapu 2) będą liczone u hosta. Transport wymienny: BroadcastChannel (test w kartach) lub WebSocket (.exe przez Radmin VPN).
class BCTransport{constructor(room){this.ch=new BroadcastChannel('coop-gra:'+room);this.ch.onmessage=e=>this.on&&this.on(e.data)}send(m){this.ch.postMessage(m)}close(){this.ch.close()}}
class WSTransport{constructor(url){this.q=[];this.ws=new WebSocket(url);this.ws.onopen=()=>{this.q.forEach(m=>this.ws.send(m));this.q=[]};this.ws.onmessage=e=>this.on&&this.on(JSON.parse(e.data));this.ws.onclose=()=>this.onclose&&this.onclose()}send(m){const s=JSON.stringify(m);this.ws.readyState===1?this.ws.send(s):this.q.push(s)}close(){this.ws.close()}}
const NET={role:'off',id:Math.random().toString(36).slice(2,10),host:null,tr:null,peers:new Map(),lastSnap:0,joinT:0};
const remotes=new Map();
function remoteFor(id,name,color){
  let r=remotes.get(id); if(r)return r;
  const g=makeChar(null),tag=nameTag(name,color); g.add(tag); scene.add(g);
  r={g,tag,tk:'',buf:[],name,color,seen:performance.now(),last:new THREE.Vector3()}; remotes.set(id,r); refreshPlayers(); return r;
}
function dropRemote(id){const r=remotes.get(id);if(!r)return;scene.remove(r.g);if(r.boat)scene.remove(r.boat);if(r.pet)scene.remove(r.pet);remotes.delete(id);refreshPlayers()}
function myState(){return{id:NET.id,name:S.name,color:S.color,p:[+player.p.x.toFixed(2),+player.p.y.toFixed(2),+player.p.z.toFixed(2)],ry:+player.ry.toFixed(2),a:P2.dead>0?5:P2.roll>0?4:P2.bowT>0||P3.chg?6:P2.castT>0?7:P2.atkT>0?3:player.swim?2:player.ground?0:1,w:myWeapon(),fo:FOL.map(f=>[+f.p.x.toFixed(2),+f.p.y.toFixed(2),+f.p.z.toFixed(2),+f.ry.toFixed(2),f.d.w,f.d.id,f.atk>0?1:0,f.m.visible?1:0]),fl:INV.fol.map(d=>[d.id,d.look,d.ex,d.name]),ge:gearSig(INV.eq),lo:INV.eq.latarnia&&lampOn?INV.eq.latarnia.rar+1:0,h:+(P2.hp/ST.hp).toFixed(3),c:P2.combo,bp:P2.bowT>0?+(1-P2.bowT/P2.bowD).toFixed(2):0,lk:S.look,lv:HERO.lvl,tb:pk('skarb')+(hasP('szczesciarz')?2:0),stl:P3.stealth>0?1:0,snk:P3.sneak?1:0,hc:MNT.koat||0,hb:herbStr(S.herb),sl:P2.sleep?1:0,veh:VH.mode,bh:VH.mode===4?VH.host:0,bry:+VH.bry.toFixed(2),bs:+VH.spd.toFixed(1),pet:PET?[PET.t,+PET.p.x.toFixed(2),+PET.p.y.toFixed(2),+PET.p.z.toFixed(2),+PET.ry.toFixed(2),PET.st]:0}}
function pushSample(st){const r=remoteFor(st.id,st.name,st.color);r.seen=performance.now();r.buf.push({...st,t:performance.now()});if(r.buf.length>30)r.buf.shift()}
function startNet(role){
  stopNet(); const room=$('room').value.trim()||'navro';
  try{NET.tr=(location.protocol==='file:'&&$('ip')&&$('ip').value.trim())?new WSTransport('ws://'+$('ip').value.trim()+':7777'):new BCTransport(room)}catch(e){status('Nie udało się otworzyć połączenia: '+e.message,true);return}
  NET.role=role; NET.host=role==='host'?NET.id:null; NET.tr.on=onNet; NET.tr.onclose=()=>{if(NET.role!=='off'){status('Połączenie zamknięte',true);stopNet()}};
  status(role==='host'?'Hostujesz pokój „'+room+'”. Drugi gracz: Dołącz z tym samym kodem.':'Szukam hosta w pokoju „'+room+'”…');
  refreshPlayers();
}
function stopNet(){if(NET.tr){try{NET.tr.send({t:'bye',from:NET.id})}catch(e){}NET.tr.close()}NET.tr=null;NET.role='off';NET.host=null;NET.peers.clear();for(const id of [...remotes.keys()])dropRemote(id);clearEnemies();hcache.clear();refreshPlayers()}
function onNet(m){
  if(!m||m.from===NET.id)return;
  if(m.t==='chit'){if(m.to===NET.id&&m.from===NET.host){const ee=m.eid!=null?enemies.get(m.eid):null;if(m.cid==='pet'){if(PET&&PET.m.visible)compHurt({comp:'pet'},m.dmg,ee)}else{const f=FOL.find(q=>q.d.id===m.cid);if(f)compHurt({comp:f},m.dmg,ee)}}return}
  if(NET.role==='host'){
    if(m.t==='join'){NET.peers.set(m.from,{seen:performance.now()});NET.tr.send({t:'welcome',from:NET.id,to:m.from,seed:S.seed,gen:S.gen||1,spawn:myState().p,sp:S.spawn});chatLine('System',m.name+' dołączył(a)')}
    else if(m.t==='st'&&NET.peers.has(m.from)){NET.peers.get(m.from).seen=performance.now();pushSample(m.s)}
    else if(m.t==='chat'&&NET.peers.has(m.from)){chatLine(m.name,m.text);NET.tr.send({t:'chat',from:NET.id,name:m.name,text:m.text,relay:m.from})}
    else if(m.t==='bye'&&NET.peers.has(m.from)){NET.peers.delete(m.from);const r=remotes.get(m.from);chatLine('System',(r?r.name:'Gracz')+' wyszedł');dropRemote(m.from)}
    else if(m.t==='dot'&&NET.peers.has(m.from)){if(ENCH[m.k]&&isFinite(m.dps)&&isFinite(m.dur))dotApply(m.eid,m.k,m.dps,m.dur,m.from)}
    else if(m.t==='hit'&&NET.peers.has(m.from)){const e=enemies.get(m.eid),r=remotes.get(m.from),b=r&&r.buf[r.buf.length-1];if(e&&b&&Math.hypot(b.p[0]-e.p.x,b.p[2]-e.p.z)<48+eBody(e)&&m.dmg<20000)applyHit(m.eid,m.dmg,m.k[0],m.k[1],m.from,Math.min(6,m.slow||0),Math.min(3,m.stun||0),m.src||null)}
    else if(m.t==='fx'&&NET.peers.has(m.from)){showFx(m);NET.tr.send({...m,from:NET.id,relay:m.from})}
    else if(m.t==='qspawn'&&NET.peers.has(m.from)&&m.def){spawnQuestBoss(m.def)}
    else if(m.t==='tamek'&&NET.peers.has(m.from)){const e=enemies.get(m.eid);if(e&&!EDEF[e.t].boss&&!e.sid)removeEnemy(m.eid)}
    else if(m.t==='sspawn'&&NET.peers.has(m.from)&&m.def&&EDEF[m.def.boss||'szkielet']){spawnStructGuards(m.def)}
    else if(m.t==='snap'){status('Uwaga: w tym pokoju jest już inny host',true)}
    return;
  }
  if(NET.role==='client'){
    if(m.t==='welcome'&&m.to===NET.id&&!NET.host){NET.host=m.from;NET.lastSnap=performance.now();status('Połączono z hostem');clearEnemies();const oldSp=JSON.stringify(S.spawn);if(m.sp){S.spawn=m.sp;S.spawnSeed=m.seed;LS.set('spawn',{seed:m.seed,p:m.sp})}const spChanged=m.sp&&JSON.stringify(m.sp)!==oldSp;
      const sp=[m.spawn[0]+1.5,m.spawn[1]+1,m.spawn[2]+1.5];const gch=m.gen&&m.gen!==S.gen;if(m.gen)LS.set('gen_'+m.seed,m.gen);if(m.seed!==S.seed||spChanged||gch){newWorld(m.seed,sp)}else teleport(sp)}
    else if(m.from!==NET.host)return;
    else if(m.t==='dmg'){if(m.to===NET.id)takeDamage(m.dmg,m.src)}
    else if(m.t==='fx'){if(m.relay!==NET.id)showFx(m)}
    else if(m.t==='drop'){if(m.to===NET.id)spawnDrop(m.L)}
    else if(m.t==='snap'){NET.lastSnap=performance.now();if(m.e)syncEnemies(m.e);if(m.hr!=null){hour=m.hr;if(m.se!==season)setSeason(m.se)}if(m.wt!=null)worldT=m.wt;const ids=new Set();for(const s of m.list){if(s.id===NET.id)continue;ids.add(s.id);pushSample(s)}for(const id of [...remotes.keys()])if(!ids.has(id))dropRemote(id)}
    else if(m.t==='chat'&&m.relay!==NET.id)chatLine(m.name,m.text);
    else if(m.t==='bye'){status('Host zakończył grę',true);stopNet()}
  }
}
let netAcc=0;
function netTick(dt){
  if(NET.role==='off')return; netAcc+=dt; if(netAcc<0.05)return; netAcc=0; const now=performance.now();
  if(NET.role==='host'){
    const list=[myState()];for(const [id] of NET.peers){const r=remotes.get(id);if(r&&r.buf.length){const b=r.buf[r.buf.length-1];list.push({...b,id,name:r.name,color:r.color,t:undefined})}}
    const pl=playersList(),el=[];for(const e of enemies.values()){if(pl.some(p=>Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)<75))el.push([e.id,e.t,e.lvl,(e.elite?1:0)+(e.rar||0)*2,+e.p.x.toFixed(2),+e.p.y.toFixed(2),+e.p.z.toFixed(2),+e.ry.toFixed(2),Math.ceil(e.hp),e.max,e.st,e.flash>0.5?1:0,e.stun>0?2:e.slow>0?1:0,e.qn||0,e.qid||0,e.sid||0,e.torch?1:0,e.tgId||0])}
    NET.tr.send({t:'snap',from:NET.id,list,e:el,hr:+hour.toFixed(3),se:season,wt:+worldT.toFixed(2)});
    for(const [id,pe] of NET.peers)if(now-pe.seen>5000){NET.peers.delete(id);chatLine('System',(remotes.get(id)||{name:'Gracz'}).name+' – utracono połączenie');dropRemote(id)}
  } else {
    if(!NET.host){if(now-NET.joinT>1000){NET.joinT=now;NET.tr.send({t:'join',from:NET.id,name:S.name})}return}
    NET.tr.send({t:'st',from:NET.id,s:myState()});
    if(now-NET.lastSnap>4000){status('Utracono połączenie z hostem',true);stopNet()}
  }
}
function interpRemotes(dt){
  const rt=performance.now()-120;
  for(const r of remotes.values()){
    const b=r.buf; if(!b.length)continue; let a=b[0],c=b[b.length-1];
    for(let i=0;i<b.length-1;i++)if(b[i].t<=rt&&b[i+1].t>=rt){a=b[i];c=b[i+1];break}
    const k=c.t>a.t?Math.min(1,Math.max(0,(rt-a.t)/(c.t-a.t))):1;
    const x=a.p[0]+(c.p[0]-a.p[0])*k,y=a.p[1]+(c.p[1]-a.p[1])*k,z=a.p[2]+(c.p[2]-a.p[2])*k;
    const sp=Math.hypot(x-r.g.position.x,z-r.g.position.z)/Math.max(dt,1e-3);
    r.g.position.set(x,y,z); let dr=c.ry-r.g.rotation.y; dr=Math.atan2(Math.sin(dr),Math.cos(dr)); r.g.rotation.y+=dr*Math.min(1,10*dt);
    r.g.visible=colAt(x,z)!==null; animChar(r.g,Math.min(sp,9),dt,c.a===1,c.a===2);r.g.scale.y=c.snk?0.86:1;
    {const lk=JSON.stringify(c.lk||null);if(r.lkKey!==lk){r.lkKey=lk;const pos=r.g.position.clone(),ry=r.g.rotation.y;scene.remove(r.g);r.g=makeChar(c.lk);r.g.add(r.tag);r.g.position.copy(pos);r.g.rotation.y=ry;scene.add(r.g);r.gl=null}}
    remoteVeh(r,c,dt);
    if(c.w)setWeapon(r.g,c.w[0],c.w[1],c.w[2],c.w[3],c.w[4]);remoteFols(r,c,dt);if(c.ge!==undefined){r.g.userData.herb=herbParse(c.hb);applyGear(r.g,parseSig(c.ge))}const u=r.g.userData;setGhost(r.g,!!c.stl);
    const tk=(c.cls||'')+(c.lv||'');if(r.tk!==tk){r.tk=tk;r.g.remove(r.tag);r.tag=nameTag(r.name+(c.lv?' · '+(CLS[c.cls]?CLS[c.cls].n+' ':'poz. ')+c.lv:''),r.color);r.g.add(r.tag)}
    if(c.a===5){r.g.rotation.z=Math.min(Math.PI/2,r.g.rotation.z+dt*5)}else r.g.rotation.z=0;
    if(c.a===4){u.rollT=(u.rollT||0)+dt;r.g.rotation.x=u.rollT/0.38*Math.PI*2;r.g.position.y+=0.4}else{u.rollT=0;r.g.rotation.x=0}
    const kind=weaponKind(c.w?c.w[0]:'');
    if(c.a===6)animCombat(r.g,'bow',0,c.bp||0);
    else if(c.a===7){u.atk=(u.atk||0)+dt;animCombat(r.g,'staff',0,Math.min(1,u.atk/0.5))}
    else if(c.a===3&&kind!=='bow'&&kind!=='staff'){if(u.lastC!==c.c){u.lastC=c.c;u.atk=0;u.slashed=false}u.atk=(u.atk||0)+dt;const k=Math.min(1,u.atk/0.34);animCombat(r.g,kind,c.c||0,k);if(!u.slashed&&k>0.33&&kind==='melee'){u.slashed=true;slashFx(r.g,c.c||0,RAR[c.w[1]||0].c)}}
    else{u.atk=0;u.lastC=-1;bowDraw(r.g,0,false)}
  }
}
function sendChat(t){t=t.trim();if(!t)return;chatLine(S.name,t);if(NET.tr)NET.tr.send({t:'chat',from:NET.id,name:S.name,text:t})}
function chatLine(n,t){const d=document.createElement('div');d.innerHTML='<b></b> ';d.firstChild.textContent=n+':';d.appendChild(document.createTextNode(t));$('chatlog').appendChild(d);setTimeout(()=>d.classList.add('fade'),9000);while($('chatlog').children.length>8)$('chatlog').firstChild.remove()}
function status(t,bad){$('netstat').textContent=t;$('netstat').className=bad?'bad':'';$('netpill').textContent=NET.role==='off'?'Solo':NET.role==='host'?'Host · '+(NET.peers.size+1)+' graczy':NET.host?'Klient · połączono':'Klient · szukam…'}
function refreshPlayers(){const l=[`<li><i style="background:${S.color}"></i>${esc(S.name)} (ty)</li>`];for(const r of remotes.values())l.push(`<li><i style="background:${r.color}"></i>${esc(r.name)}</li>`);$('players').innerHTML=l.join('');status($('netstat').textContent,$('netstat').className==='bad')}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);

// ---------- świat: start / nowy seed ----------
function teleport(p){player.p.set(p[0],p[1]+1,p[2]);player.v.set(0,0,0);camY=null}
function clearWorld(){KING.clear();kingReq.clear();kingCur=null;for(const [k,ch] of [...chunks])unload(k,ch);results.length=0;thumbs.clear();hcache.clear();clearEnemies();for(const d of drops)scene.remove(d.g);drops.length=0;clearVillages();clearStructs();if(typeof V!=='undefined'){if(VH.mode===1)exitBoat();if(VH.mode===2)stopGlide();VH.mode=0;despawnPet()}}
function newWorld(seed,spawnAt){
  {let g=LS.get('gen_'+seed,null);if(g==null){const old=LS.get('world_'+seed,null)!=null||LS.get('posSeed',null)===seed||((LS.get('spawn',null)||{}).seed===seed);g=old?1:2;LS.set('gen_'+seed,g)}S.gen=g}
  S.seed=seed;LS.set('seed',seed);$('seed').value=seed;clearWorld();loadW();player.ready=false;$('loading').hidden=false;
  if(S.spawnSeed!==seed){const sv=LS.get('spawn',null);if(sv&&sv.seed===seed){S.spawn=sv.p;S.spawnSeed=seed}else if(spawnAt){S.spawn=null;S.spawnSeed=seed;const w=workers[workers.length-1];w.busy++;spawnCb2=true;w.postMessage({type:'spawn',seed,id:reqId++})}}
  if(spawnAt){player.p.set(spawnAt[0],spawnAt[1]+1,spawnAt[2]);player.v.set(0,0,0);camY=null;player.ready=true;waitReady();return}
  spawnCb=d=>{spawnCb=null;S.spawn=[d.x,d.h,d.z];S.spawnSeed=seed;LS.set('spawn',{seed,p:S.spawn});player.p.set(d.x,d.h+1,d.z);player.v.set(0,0,0);camY=null;player.ready=true;waitReady()};
  workers[0].busy++;workers[0].postMessage({type:'spawn',seed,id:reqId++});
}
function waitReady(){player.hold=true}
function holdIfUnloaded(){if(colAt(player.p.x,player.p.z)===null){waitReady();const el=$('loading');if(el){el.hidden=false;const sb=el.querySelector('.sub');if(sb)sb.textContent='Wczytywanie okolicy…'}}}
function toggleMenu(){const m=$('menu');m.hidden=!m.hidden;if(!m.hidden){try{document.exitPointerLock()}catch(e){}}}

// UI
$('rd').value=S.rd;$('rdv').textContent=S.rd;$('seed').value=S.seed;$('nick').value=S.name;$('col').value=S.color;$('shadow').checked=S.shadows;
$('rd').oninput=e=>{S.rd=+e.target.value;$('rdv').textContent=S.rd;LS.set('rd2',S.rd)};
setSeason(season);$('season').value=season;$('season').onchange=e=>{if(NET.role==='client')return status('Porę roku ustawia host',true);setSeason(+e.target.value);LS.set('season',season)};
$('pxr').value=OPT.pr;$('pxr').onchange=e=>{OPT.pr=+e.target.value;LS.set('pxr',OPT.pr);renderer.setPixelRatio(Math.min(devicePixelRatio||1,OPT.pr));renderer.setSize(innerWidth,innerHeight)};
$('shs').value=OPT.shadowSize;$('shs').onchange=e=>{OPT.shadowSize=+e.target.value;LS.set('shs',OPT.shadowSize);sun.shadow.mapSize.set(OPT.shadowSize,OPT.shadowSize);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}};
try{$('voxt').checked=SEAS_U.uVox.value>0.5;$('voxt').onchange=e=>{SEAS_U.uVox.value=e.target.checked?1:0;LS.set('voxT',SEAS_U.uVox.value)}}catch(_){}$('lodc').checked=OPT.lod;$('lodc').onchange=e=>{OPT.lod=e.target.checked;LS.set('lod',OPT.lod);instDirty=true};
$('shadow').onchange=e=>{S.shadows=e.target.checked;LS.set('sh',S.shadows);renderer.shadowMap.enabled=S.shadows;sun.castShadow=S.shadows;scene.traverse(o=>{if(o.material)o.material.needsUpdate=true})};
$('newseed').onclick=()=>{if(NET.role==='client')return status('Klient używa świata hosta',true);newWorld(Math.floor(Math.random()*1e9));toggleMenu()};
$('useseed').onclick=()=>{if(NET.role==='client')return;const v=parseInt($('seed').value,10);if(Number.isFinite(v)){newWorld(v);toggleMenu()}};
$('nick').onchange=e=>{S.name=e.target.value.slice(0,16)||'Gracz';LS.set('name',S.name);refreshPlayers()};
$('col').onchange=e=>{S.color=e.target.value;LS.set('color',S.color);rebuildMe();refreshPlayers()};
let meRef=me; function rebuildMe(){const ry=meRef.rotation.y;scene.remove(meRef);meRef=makeChar(S.look);meRef.rotation.y=ry;scene.add(meRef);if(VH.gl){VH.gl=null;if(VH.mode===2){VH.gl=makeGlider();meRef.add(VH.gl)}}const w=myWeapon();setWeapon(meRef,w[0],w[1],w[2],w[3],w[4])}
$('host').onclick=()=>startNet('host'); $('join').onclick=()=>startNet('client'); $('leave').onclick=()=>{stopNet();status('Rozłączono')};
$('closemenu').onclick=toggleMenu; $('menubtn').onclick=toggleMenu; $('mapbtn').onclick=toggleMap; $('mapwrap').onclick=e=>{if(e.target.id==='mapwrap'||e.target.id==='mapclose')toggleMap()};
$('mapcenter').onclick=()=>{mapV.follow=true};
if(typeof BroadcastChannel==='undefined')status('Ta przeglądarka nie obsługuje testu co-op w kartach',true); else status('Gra solo. Hostuj albo dołącz do pokoju.');

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
const P3={dash:0,salvo:null,q:0,e:0,buff:0,charge:0,chargeSet:null,chargeDir:[0,1],haste:0,leap:0,stealth:0,sneak:false};let HIT_SRC=null;
const pk=k=>HERO.perks[k]||0;
const SKILLS=[['sprint','Sprint','+0,6% szybkości biegu na poziom'],['walka','Walka wręcz','+0,8% obrażeń w zwarciu na poziom'],['strzel','Strzelanie','+0,8% obrażeń z dystansu na poziom'],['wytrz','Wytrzymałość','+1% zdrowia na poziom'],['wspin','Wspinaczka','+4% wytrzymałości i +1% szybkości wspinania na poziom'],['plyw','Pływanie','+1% szybkości pływania na poziom']];
const skL=k=>{const x=(HERO.sk&&HERO.sk[k])||0;return Math.min(50,Math.floor(Math.sqrt(x/12)))};
function skGain(k,v){HERO.sk=HERO.sk||{};const l0=skL(k);HERO.sk[k]=(HERO.sk[k]||0)+v;const l1=skL(k);if(l1>l0){toast('Umiejętność '+SKILLS.find(s=>s[0]===k)[1]+': poziom '+l1,'#a7e0ff');sfx('lvl',0.5);ST=stats();saveHero()}else if(Math.random()<0.02)saveHero()}
const need=l=>Math.round(130*Math.pow(l,1.55)+120*l);
function saveHero(){LS.set('hero',HERO)}

// =================== ETAP 2: walka, wrogowie, łup, ekwipunek ===================
const RAR=[{n:'Zwykły',c:'#e9e6df'},{n:'Niezwykły',c:'#62d26d'},{n:'Rzadki',c:'#4ea3ff'},{n:'Epicki',c:'#b874ff'},{n:'Legendarny',c:'#ff9d2e'}];
const RMUL=[1,1.22,1.5,1.85,2.3];
const WEAP={luk:{n:'Łuk',dmg:9,spd:0.9,rng:30,proj:'arrow'},kostur:{n:'Kostur',dmg:11,spd:0.75,rng:26,proj:'bolt'},miecz:{n:'Miecz',dmg:10,spd:1.0,rng:2.4},topor:{n:'Topór',dmg:14,spd:0.78,rng:2.4},mlot:{n:'Młot',dmg:19,spd:0.6,rng:2.5},sztylet:{n:'Sztylety',dmg:6.2,spd:1.65,rng:2.0},wlocznia:{n:'Włócznia',dmg:12,spd:0.9,rng:3.0},buzdygan:{n:'Buzdygan',dmg:15,spd:0.75,rng:2.3},szabla:{n:'Szabla',dmg:9,spd:1.25,rng:2.3},halabarda:{n:'Halabarda',dmg:20,spd:0.55,rng:3.2},kusza:{n:'Kusza',dmg:14,spd:0.6,rng:34,proj:'arrow'},rozdzka:{n:'Różdżka',dmg:8,spd:1.2,rng:24,proj:'bolt'}};
const ARM={tarcza:{n:'Tarcza',def:3,hp:14},latarnia:{n:'Latarnia',def:0,hp:0},helm:{n:'Hełm',def:2,hp:10},zbroja:{n:'Napierśnik',def:4,hp:25},rekawice:{n:'Rękawice',def:1.5,hp:8},buty:{n:'Buty',def:1.5,hp:8},pierscien:{n:'Pierścień',def:0,hp:6},amulet:{n:'Amulet',def:0,hp:10}};
const SLOTS=[['bron','Broń'],['tarcza','Tarcza'],['helm','Hełm'],['zbroja','Napierśnik'],['rekawice','Rękawice'],['buty','Buty'],['pierscien','Pierścień'],['amulet','Amulet'],['latarnia','Latarnia']];
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
function rollRarity(boost){const r=Math.random()*100-boost*0.4;return r<0.35?4:r<2.2?3:r<8?2:r<28?1:0}
function genItem(lvl,boost=0,forceSlot,cls){
  const rar=rollRarity(boost), slot=forceSlot||pick(['bron','bron','helm','zbroja','rekawice','buty','pierscien','amulet','latarnia','tarcza']);
  const sc=(1+0.13*(lvl-1))*RMUL[rar]*rnd(0.9,1.1);
  const it={id:'i'+(itemSeq++),slot,rar,lvl};
  if(slot==='bron'){const WB=['miecz','miecz','topor','mlot','sztylet','kostur','luk','luk','luk','wlocznia','buzdygan','szabla','halabarda','kusza','rozdzka'];it.base=pick(WB);const w=WEAP[it.base],V=pick(WEAPV[it.base]);it.var=V[0];it.dmg=+(w.dmg*sc*V[2]).toFixed(1);it.spd=+(w.spd*V[3]).toFixed(2);if(V[5])it.rngM=V[5];it.name=V[1]+' '+pick(SUFF)}
  else {it.base=slot;const a=ARM[slot];let mx=1,adj='';if(['helm','zbroja','rekawice','buty'].includes(slot)){const w=[3,3,2,1+rar*0.5,rar>=1?1+rar*0.4:0.2,rar>=2?rar*0.5:0],tot=w.reduce((p,q)=>p+q,0);let r=Math.random()*tot,i=0;while(r>w[i]){r-=w[i];i++}const T=ARMT[Math.min(5,i)];it.mat=T.k;mx=T.x;adj=' '+(slot==='rekawice'||slot==='buty'?T.p:T.m)}it.def=+(a.def*sc*mx).toFixed(1);it.hp=Math.round(a.hp*sc*mx);it.name=a.n+adj+' '+pick(SUFF)}
  if(slot==='tarcza'){const TV=[['puklerz','Puklerz',0.75],['okuta','Tarcza okuta',1],['herbowa','Tarcza herbowa',1.15],['wiezowa','Tarcza wieżowa',1.4]],tv=TV[Math.min(3,Math.floor(Math.random()*(2+rar*0.6)))];it.var=tv[0];it.def=+(ARM.tarcza.def*sc*tv[2]).toFixed(1);it.hp=Math.round(ARM.tarcza.hp*sc*tv[2]);it.block=+(10+rar*3+tv[2]*4).toFixed(0);it.name=tv[1]+' '+pick(SUFF);it.mat=rar>=3?'plyt':rar>=1?'krasn':undefined;if(!it.mat)delete it.mat}
  if(slot==='pierscien'||slot==='amulet')it.lk=Math.floor(Math.random()*6);if(slot==='latarnia')it.lk=Math.floor(Math.random()*5);
  it.sd=1+Math.floor(Math.random()*99999);
  if(slot==='bron'||['helm','zbroja','rekawice','buty'].includes(slot))it.lk=Math.random()<[0.06,0.12,0.3,0.55,0.75][rar]?5+Math.floor(Math.random()*5):Math.floor(Math.random()*5);
  const bk=Object.keys(BONUS);for(let i=0;i<rar;i++){const k=pick(bk);const v=k==='crit'?rnd(2,5):k==='haste'?rnd(3,8):k==='regen'?rnd(0.4,1.2)*(1+0.1*lvl):rnd(8,16)*(1+0.12*lvl);it[k]=+((it[k]||0)+v).toFixed(1)}
  return it;
}
// ---------- stan gracza ----------
const INV=LS.get('inv',null)||{eq:{bron:{id:'start',slot:'bron',base:'miecz',rar:0,lvl:1,dmg:10,spd:1,name:'Miecz Wędrowca'}},bag:[],gold:0,pot:3};
const bagN=()=>INV.bagN||30;
const ACCN={pierscien:['klasyczny','sygnet','skręcony','podwójny','z czaszką','wężowy'],amulet:['klasyczny','półksiężyc','kieł','krzyż','oko','gwiazda'],latarnia:['żelazna','papierowa','mosiężna','czaszka','kryształowa']};
const CAPEC=['#7a2a22','#2a3a6a','#3a5a2a','#4a2a5a','#2a2a2e','#8a6a2a'];const CAPEOF=it=>it.lk>=5?darker(FTH[it.lk].m,0.75):it.sd&&it.sd%3===0?CAPEC[Math.floor(it.sd/3)%6]:null;
const FNAME=['demoniczny','kryształowy','płomienny','lodowy','arkaniczny'];
const LKNAME={bron:['klasyczny','wschodni','barbarzyński','rycerski','zdobiony',...FNAME],helm:['klasyczny','rogaty','z nosalem','garnczkowy','szyszak z czepcem',...FNAME],zbroja:['klasyczny','z tabardem','ćwiekowany','łuskowy','z futrzanym kołnierzem',...FNAME],rekawice:['klasyczne','z kolcami','z futrem','długie mankiety','zdobione','demoniczne','kryształowe','płomienne','lodowe','arkaniczne'],buty:['klasyczne','z futrem','z ostrogami','z nakolannikami','zdobione','demoniczne','kryształowe','płomienne','lodowe','arkaniczne']};
const FTH={5:{m:'#2e262c',g:'#ff3030',a:'#8a1a1a'},6:{m:'#8fd8f0',g:'#d8f8ff',a:'#e0e8f0'},7:{m:'#8a3010',g:'#ffb030',a:'#d9a030'},8:{m:'#b8dcee',g:'#e8faff',a:'#ffffff'},9:{m:'#3a2a5a',g:'#c890ff',a:'#d9b23a'}};
const GEMS={rubin:['Rubin','#e0404a','Zdrowie'],szafir:['Szafir','#4a8af0','Obrona'],szmaragd:['Szmaragd','#3ac070','Krytyk'],topaz:['Topaz','#f0c040','Szybkość ataku'],onyks:['Onyks','#9a7ad8','Obrażenia']};
const gemVal=it=>{const g=it.gem,l=it.lvl||1;return g==='rubin'?Math.round(l*3+10):g==='szafir'?+(l*0.25+1).toFixed(1):g==='szmaragd'?3:g==='topaz'?6:g==='onyks'?6:0};
const gemTxt=it=>{const v=gemVal(it);return it.gem==='rubin'?'+'+v+' zdrowia':it.gem==='szafir'?'+'+v+' obrony':it.gem==='szmaragd'?'+'+v+'% krytyka':it.gem==='topaz'?'+'+v+'% szybkości ataku':'+'+v+'% obrażeń'};
const SETB={skora:['Zestaw skórzany',[[2,'+8% szybkości ruchu'],[4,'+10% krytyka']]],kolcz:['Zestaw kolczy',[[2,'+4 obrony'],[4,'+12% zdrowia']]],plyt:['Zestaw płytowy',[[2,'+12% obrony'],[4,'+15% zdrowia, +6 obrony']]],
 elf:['Zestaw elfi',[[2,'+10% szybkości ataku'],[4,'+8% krytyka, +6% ruchu']]],krasn:['Zestaw krasnoludzki',[[2,'+10% zdrowia'],[4,'+15% obrony, +5% obrażeń']]],smok:['Zestaw smoczy',[[2,'+8% obrażeń'],[4,'+10% obrażeń i zdrowia']]]};
function setCounts(){const c={};for(const k of ['helm','zbroja','rekawice','buty']){const it=INV.eq[k];if(it&&it.mat)c[it.mat]=(c[it.mat]||0)+1}return c}
function saveInv(){LS.set('inv',INV)}
function stats(){
  const L=HERO,s={hp:100+12*(L.lvl-1),def:0,dmg:4,spd:1.2,rng:1.8,crit:5,haste:0,regen:0,move:1,ranged:null};
  for(const [k] of SLOTS){const it=INV.eq[k];if(!it)continue;
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
  try{if(PET){const pd=petDef();s.def+=2*ppk(pd,'aura');s.regen+=0.3*ppk(pd,'opieka')}}catch(e){}
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
const ETYPES=Object.keys(EDEF);
// =================== ETAP 5: nowi wrogowie i bossowie (dane) ===================
Object.assign(EDEF,{
 szkielet:{n:'Szkielet',hp:38,dmg:9,spd:4.6,aggro:14,rng:1.9,cd:1.2,parts:[[0,0.95,0,0.42,0.5,0.24,'#e8e2cc'],[0,1.1,0,0.5,0.06,0.26,'#cfc8b0'],[0,0.95,0,0.5,0.06,0.26,'#cfc8b0'],[0,1.42,0,0.42,0.4,0.42,'#efe9d6'],[0.09,1.44,0.215,0.1,0.1,0.01,'#1a1a1a'],[-0.09,1.44,0.215,0.1,0.1,0.01,'#1a1a1a'],[0.5,1.0,0.3,0.06,0.06,0.8,'#8a8f94']],legs:[[0.12,0.7,0,0],[-0.12,0.7,0,1],[0.32,1.18,0,1],[-0.32,1.18,0,0]],lw:0.1,lh:0.65,lc:'#e0dac4'},
 lucznik_s:{n:'Szkielet łucznik',hp:30,dmg:8,spd:4.2,aggro:20,rng:1.7,cd:1.4,ranged:{rng:17,proj:'arrow',cd:2.1},parts:[[0,0.95,0,0.42,0.5,0.24,'#e8e2cc'],[0,1.42,0,0.42,0.4,0.42,'#efe9d6'],[0.09,1.44,0.215,0.1,0.1,0.01,'#1a1a1a'],[-0.09,1.44,0.215,0.1,0.1,0.01,'#1a1a1a'],[0,1.0,-0.2,0.3,0.5,0.12,'#6b4a2b'],[-0.42,1.1,0.25,0.05,0.9,0.05,'#7a5230']],legs:[[0.12,0.7,0,0],[-0.12,0.7,0,1],[0.32,1.18,0,1],[-0.32,1.18,0,0]],lw:0.1,lh:0.65,lc:'#e0dac4'},
 bandyta:{n:'Bandyta',hp:52,dmg:10,spd:5.2,aggro:15,rng:2.0,cd:1.15,parts:[[0,1.0,0,0.56,0.62,0.34,'#5a4a3a'],[0,0.72,0,0.58,0.12,0.36,'#3a2a1a'],[0,1.5,0,0.46,0.46,0.46,'#e0b08a'],[0,1.62,-0.02,0.54,0.4,0.54,'#3a3f45'],[0,1.42,0.235,0.42,0.14,0.02,'#2a2a2a'],[0.42,0.95,0.35,0.07,0.07,0.9,'#cfd6dc']],legs:[[0.14,0.68,0,0],[-0.14,0.68,0,1],[0.38,1.25,0,1],[-0.38,1.25,0,0]],lw:0.18,lh:0.66,lc:'#3a3f45'},
 szaman:{n:'Gobliński szaman',hp:36,dmg:11,spd:4.4,aggro:18,rng:1.7,cd:1.4,ranged:{rng:15,proj:'curse',cd:2.4},parts:[[0,0.9,0,0.5,0.55,0.34,'#6a3a8a'],[0,1.4,0,0.46,0.42,0.42,'#6fae3e'],[0,1.7,0,0.5,0.25,0.5,'#4a2a6a'],[0,1.92,0,0.24,0.25,0.24,'#4a2a6a'],[0.1,1.43,0.215,0.07,0.07,0.01,'#ffd34d'],[-0.1,1.43,0.215,0.07,0.07,0.01,'#ffd34d'],[0.38,1.2,0.2,0.07,1.2,0.07,'#5a3b22'],[0.38,1.85,0.2,0.18,0.18,0.18,'#b874ff']],legs:[[0.13,0.64,0,0],[-0.13,0.64,0,1]],lw:0.16,lh:0.6,lc:'#4f7f2c'},
 pajak:{n:'Pająk olbrzymi',hp:44,dmg:9,spd:6.0,aggro:13,rng:1.8,cd:1.1,parts:[[0,0.55,-0.3,0.9,0.6,0.9,'#3a2f2a'],[0,0.5,0.35,0.55,0.4,0.5,'#4a3a32'],[0.12,0.6,0.61,0.08,0.08,0.02,'#e5483b'],[-0.12,0.6,0.61,0.08,0.08,0.02,'#e5483b'],[0.06,0.38,0.62,0.06,0.16,0.06,'#222'],[-0.06,0.38,0.62,0.06,0.16,0.06,'#222'],[0,0.86,-0.3,0.4,0.05,0.4,'#c9a64a']],legs:[[0.45,0.5,0.35,0],[-0.45,0.5,0.35,1],[0.5,0.5,0.1,1],[-0.5,0.5,0.1,0],[0.5,0.5,-0.15,0],[-0.5,0.5,-0.15,1],[0.45,0.5,-0.4,1],[-0.45,0.5,-0.4,0]],lw:0.09,lh:0.5,lc:'#2a221e'},
 mumia:{n:'Mumia',hp:60,dmg:11,spd:3.6,aggro:12,rng:1.9,cd:1.4,parts:[[0,1.0,0,0.56,0.66,0.34,'#d8cfa8'],[0,1.05,0.175,0.5,0.06,0.01,'#b8ad86'],[0,0.85,0.175,0.5,0.06,0.01,'#b8ad86'],[0,1.52,0,0.46,0.46,0.46,'#e0d6b0'],[0.1,1.54,0.235,0.08,0.06,0.01,'#7fe3ff'],[-0.1,1.54,0.235,0.08,0.06,0.01,'#7fe3ff']],legs:[[0.14,0.68,0,0],[-0.14,0.68,0,1],[0.38,1.25,0.2,1],[-0.38,1.25,0.2,0]],lw:0.18,lh:0.66,lc:'#cfc6a0'},
 krol_s:{n:'Król Szkieletów',boss:'krol',sc:2.2,hp:420,dmg:18,spd:3.8,aggro:26,rng:2.0,cd:1.6,parts:[[0,0.95,0,0.46,0.5,0.26,'#e8e2cc'],[0,1.42,0,0.44,0.42,0.44,'#efe9d6'],[0,1.7,0,0.5,0.14,0.5,'#d9b23a'],[0.17,1.82,0,0.08,0.14,0.08,'#d9b23a'],[-0.17,1.82,0,0.08,0.14,0.08,'#d9b23a'],[0.09,1.44,0.225,0.1,0.1,0.01,'#ff3b2e'],[-0.09,1.44,0.225,0.1,0.1,0.01,'#ff3b2e'],[0,1.0,-0.2,0.7,0.9,0.06,'#7a1f2a'],[0.5,1.1,0.4,0.08,0.08,1.1,'#9aa0a6']],legs:[[0.12,0.7,0,0],[-0.12,0.7,0,1],[0.34,1.2,0,1],[-0.34,1.2,0,0]],lw:0.11,lh:0.66,lc:'#e0dac4'},
 matka:{n:'Matka Pająków',boss:'matka',sc:2.4,hp:380,dmg:15,spd:4.6,aggro:24,rng:1.9,cd:1.3,parts:[[0,0.55,-0.3,0.95,0.65,0.95,'#2a1f2a'],[0,0.5,0.35,0.6,0.42,0.52,'#3a2a3a'],[0.12,0.62,0.62,0.09,0.09,0.02,'#7dff8a'],[-0.12,0.62,0.62,0.09,0.09,0.02,'#7dff8a'],[0,0.9,-0.3,0.5,0.05,0.5,'#7dff8a']],legs:[[0.45,0.5,0.35,0],[-0.45,0.5,0.35,1],[0.5,0.5,0.1,1],[-0.5,0.5,0.1,0],[0.5,0.5,-0.15,0],[-0.5,0.5,-0.15,1],[0.45,0.5,-0.4,1],[-0.45,0.5,-0.4,0]],lw:0.09,lh:0.5,lc:'#1e161e'},
 kolos:{n:'Kamienny Kolos',boss:'kolos',sc:1.9,hp:520,dmg:22,spd:3.2,aggro:24,rng:2.5,cd:2.0,parts:[[0,1.6,0,1.3,1.1,0.8,'#6f6d6a'],[0,2.4,0.1,0.6,0.5,0.55,'#7d7b78'],[0.15,2.45,0.38,0.12,0.08,0.01,'#ff9d2e'],[-0.15,2.45,0.38,0.12,0.08,0.01,'#ff9d2e'],[0,1.7,0.41,0.5,0.4,0.02,'#ff7a1a'],[0.5,2.2,0,0.3,0.3,0.3,'#5a5856']],legs:[[0.32,1.05,0,0],[-0.32,1.05,0,1],[0.85,2.0,0,1],[-0.85,2.0,0,0]],lw:0.44,lh:1.05,lc:'#5f5d5a'},
 faraon:{n:'Przeklęty Faraon',boss:'faraon',sc:2.1,hp:400,dmg:17,spd:3.6,aggro:24,rng:2.0,cd:1.5,parts:[[0,1.0,0,0.56,0.66,0.34,'#d8cfa8'],[0,1.52,0,0.46,0.46,0.46,'#e0d6b0'],[0,1.62,0,0.6,0.5,0.5,'#2f5f8f'],[0,1.62,0,0.62,0.1,0.52,'#d9b23a'],[0.1,1.54,0.235,0.08,0.06,0.01,'#b874ff'],[-0.1,1.54,0.235,0.08,0.06,0.01,'#b874ff'],[0,1.0,0.18,0.3,0.4,0.02,'#d9b23a']],legs:[[0.14,0.68,0,0],[-0.14,0.68,0,1],[0.38,1.25,0.2,1],[-0.38,1.25,0.2,0]],lw:0.18,lh:0.66,lc:'#cfc6a0'},
});
BIOME_E[3].push('pajak');BIOME_E[7].push('pajak');BIOME_E[2].push('bandyta');
Object.assign(BIOME_E,{8:['skorpion','bandyta','dzik','goblin','ork','gryf'],9:['pajak','ropucha','goblin','szaman','bazyliszek','drzewiec'],10:['wilk','dzik','goblin','bandyta','wilkolak','drzewiec'],11:['slime','goblin','wilk','drzewiec'],12:['wilk','bandyta','dzik','slime','upior','troll']});
BIOME_E[15]=['skorpion','bandyta','ork','zywiolak'];BIOME_E[18]=['zywiolak','golem','kultysta'];BIOME_E[19]=['pajak','ropucha','slime','drzewiec'];BIOME_E[20]=['szkielet','upior','mumia','kultysta','mroczny_rycerz','wilkolak'];BIOME_E[21]=['lodowy_golem','yeti','upior'];BIOME_E[16]=['zywiolak','golem','zywiolak'];BIOME_E[3].push('wilkolak','drzewiec');BIOME_E[4].push('zywiolak','ork');BIOME_E[5].push('troll','upior');BIOME_E[6].push('troll','gryf','zywiolak');BIOME_E[7].push('bazyliszek','upior');BIOME_E[2].push('ork');
const BOSS_BY_BIOME={3:'matka',7:'matka',4:'faraon',5:'kolos',6:'kolos',8:'faraon',9:'matka',10:'matka',12:'kolos'};
EDEF.woz=Object.assign({},EDEF.kon,{n:'Karawana kupiecka',hp:9999,spd:2.6,passive:1});
const eSc=e=>EDEF[e.t].sc||(e.elite?1.35:1);
const eReach=e=>{const d=EDEF[e.t],s=eSc(e);return d.huge||d.giant?Math.min(d.rng*s,1.4+s*0.75):d.rng*s};
const eBody=e=>{const s=eSc(e),dB=EDEF[e.t];if(dB&&dB.bodyR)return dB.bodyR*s/(dB.sc||1);return s<=2.5?(s-1)*0.9:1.35+(s-2.5)*0.6};
// ===== olbrzymy (ok. 5× wyżsi od gracza) i weryfikacja zdrowia wszystkich stworzeń =====
const GIANT={tytan:{b:'troll',k:3.2,n:'Tytan górski',hp:1500,dmg:44},lodowy_olbrzym:{b:'yeti',k:3.6,n:'Lodowy olbrzym',hp:1300,dmg:40},lesny_olbrzym:{b:'drzewiec',k:3.0,n:'Leśny olbrzym',hp:1700,dmg:42}};
const HUGEB={wladca_plomieni:{b:'zywiolak',k:4.2,n:'Władca Płomieni',hp:3200,dmg:48,st:'smok',m:['zywiolak','zywiolak']},krol_olbrzymow:{b:'troll',k:4.0,n:'Król Olbrzymów',hp:3600,dmg:52,st:'troll',m:['troll','ork','ork']},
  pradawna_pajeczyca:{b:'pajak',k:6,n:'Pradawna Pajęczyca',hp:3000,dmg:40,st:'matka',m:['pajak','pajak','pajak']},lodowy_tytan:{b:'lodowy_golem',k:4.2,n:'Lodowy Tytan',hp:3800,dmg:50,st:'kolos',m:['yeti','lodowy_golem']},
  kosciany_kolos:{b:'szkielet',k:5,n:'Kościany Kolos',hp:3000,dmg:46,st:'krol',m:['szkielet','szkielet','lucznik_s','upior']},mroczny_wladca:{b:'mroczny_rycerz',k:4.3,n:'Mroczny Władca',hp:3400,dmg:50,st:'faraon',m:['mroczny_rycerz','kultysta','kultysta']},
  behemot:{b:'dzik',k:6,n:'Behemot',hp:3500,dmg:46,st:'kolos',m:['dzik','dzik','wilk']},krolowa_wiwern:{b:'wiwerna',k:3.2,n:'Królowa Wiwern',hp:3300,dmg:48,st:'smok',m:['wiwerna','ropucha']},pradawny_bazyliszek:{b:'bazyliszek',k:4.5,n:'Pradawny Bazyliszek',hp:3100,dmg:45,st:'faraon',m:['skorpion','skorpion','bazyliszek']}};
const HTINT={pradawna_pajeczyca:[0.95,0.7,1.15],kosciany_kolos:[0.85,0.78,0.62],behemot:[0.62,0.46,0.42],krolowa_wiwern:[1.35,0.6,0.5],pradawny_bazyliszek:[1.3,1.1,0.5],lodowy_tytan:[0.82,1.0,1.3],mroczny_wladca:[0.8,0.7,0.9]},HTC=new Map();
function hugeLook(g,t){const T=HTINT[t];if(T)g.traverse(o=>{if(!o.isMesh||!o.geometry||!o.geometry.attributes||!o.geometry.attributes.color||o.material===GLOWMAT)return;let mp=HTC.get(t);if(!mp){mp=new WeakMap();HTC.set(t,mp)}const key=o.geometry;let ng=mp.get(key);if(!ng){ng=o.geometry.clone();const a=ng.attributes.color.array;for(let i=0;i<a.length;i+=3){a[i]=Math.min(1,a[i]*T[0]);a[i+1]=Math.min(1,a[i+1]*T[1]);a[i+2]=Math.min(1,a[i+2]*T[2])}ng.attributes.color.needsUpdate=true;mp.set(key,ng)}o.geometry=ng});
  if(t==='krol_olbrzymow'){let head=null;g.traverse(o=>{if(!head&&o.userData&&o.userData.head&&o.userData.head.isObject3D)head=o.userData.head});if(head){const C=t==='krol_olbrzymow'?'#d9b23a':t==='mroczny_wladca'?'#8a1a2a':'#5a4a6a',G=t==='krol_olbrzymow'?'#e04a3a':'!#c890ff',L=[[0,0.66,0,0.62,0.1,0.6,C]];for(const [x,z] of [[-0.26,-0.25],[0,-0.27],[0.26,-0.25],[-0.28,0],[0.28,0],[-0.26,0.25],[0,0.27],[0.26,0.25]])L.push([x,0.78,z,0.1,0.18,0.1,C]);L.push([0,0.72,0.3,0.1,0.1,0.04,G]);const cm=new THREE.Mesh(boxes(L),decoMat);head.add(cm)}}}
function hugeFor(b){return [5,21,23].includes(b)?'lodowy_tytan':[6,12].includes(b)?'krol_olbrzymow':[4,15].includes(b)?'pradawny_bazyliszek':[16,17].includes(b)?'wladca_plomieni':[3,9,10,11,19].includes(b)?'pradawna_pajeczyca':b===7?'krolowa_wiwern':b===20?'kosciany_kolos':b===18||b===22?'mroczny_wladca':'behemot'}
Object.assign(GIANT,Object.fromEntries(Object.entries(HUGEB).map(([k,v])=>[k,{b:v.b,k:v.k,n:v.n,hp:v.hp,dmg:v.dmg}])));
function giantFor(b){return [5,8,21,23].includes(b)?'lodowy_olbrzym':[3,9,10,11,19].includes(b)?'lesny_olbrzym':[2,4,6,12,15,16,18,20].includes(b)?'tytan':null}
whenReady(()=>{
  const HPF={slime:34,krab:40,skorpion:50,szaman:40,lucznik_s:34,mumia:70,ork:85,zywiolak:80,yeti:130,golem:170,troll:190,drzewiec:210,wilkolak:110,bazyliszek:120,gryf:120,mroczny_rycerz:140,lodowy_golem:190,wiwerna:170,
    krol_s:900,matka:800,kolos:1100,faraon:850,smok:2600,krol_troll:1700,lich:1400,prastary:1800,zubr:90};
  for(const k in HPF)if(EDEF[k])EDEF[k].hp=HPF[k];
  for(const k in GIANT){const G=GIANT[k],B=EDEF[G.b];if(!B)continue;const H=HUGEB[k];EDEF[k]=Object.assign({},B,{n:G.n,hp:G.hp,dmg:G.dmg,sc:(B.sc||1)*G.k,spd:B.spd*0.85,aggro:24,giant:1},H?{hp:Math.round(G.hp*0.72),boss:H.st,huge:1,passive:0,aggro:30,rng:Math.max(B.rng||1.6,2.2),cd:Math.max(B.cd||1.4,1.7),spd:Math.max(3.2,B.spd*0.8)}:{});if(HUM[G.b])HUM[k]=HUM[G.b];if(typeof CRS!=='undefined'&&CRS[G.b])CRS[k]=CRS[G.b];if(FOODOF[G.b])FOODOF[k]=FOODOF[G.b]}
});
// =================== ZWIERZĘTA: modele, gatunki, jedzenie do oswajania ===================
// konstruktor czworonoga (jednostki świata; środki boxów); detale wystają ≥0,02 ponad powierzchnię (bez nachodzenia)
function Q(o){
  const L=o.L,W=o.W,Hb=o.Hb,ll=o.legL,y=ll+Hb/2,hs=o.hs,hy=o.hy??Hb*0.45,hz=o.hz??0,hf=L/2+hz+hs/2,c2=o.c2||o.c,P=[];
  P.push([0,y,0,W,Hb,L,o.c],[0,y-Hb/2+0.06,0.02,W*0.86,0.16,L*0.8,c2],[0,y+Hb*0.04,L*0.3,W+0.05,Hb*0.84,L*0.3,o.c],[0,y+Hb*0.02,-L*0.29,W+0.035,Hb*0.88,L*0.3,o.c],[0,y-Hb*0.12,L/2+0.012,W*0.55,Hb*0.42,0.05,c2,0]);
  if(o.neck)P.push([0,y+o.neck[1]/2,L/2-o.neck[2]/2+0.02,o.neck[0],o.neck[1],o.neck[2],o.c]);
  P.push([0,y+hy,L/2+hz,hs,hs,hs,o.hc||o.c]);
  const sn=o.snout;let sf=hf;if(sn){P.push([0,y+hy-hs*0.18,hf+sn[0]/2-0.01,sn[2],sn[1],sn[0],sn[3]]);sf=hf+sn[0]-0.01;if(o.nose)P.push([0,y+hy-hs*0.18+sn[1]*0.22,sf+0.015,sn[2]*0.62,sn[1]*0.36,0.04,o.nose])}
  const ey=y+hy+hs*0.14,ex=hs*0.3,ec=o.eye||'#1a1a1a',es=Math.max(0.07,hs*0.24);P.push([ex,ey,hf+0.012,es,es*1.05,0.03,'#f4f0e6',0],[-ex,ey,hf+0.012,es,es*1.05,0.03,'#f4f0e6',0],[ex,ey-es*0.08,hf+0.024,es*0.62,es*0.8,0.03,ec,0],[-ex,ey-es*0.08,hf+0.024,es*0.62,es*0.8,0.03,ec,0],[ex-es*0.18,ey+es*0.2,hf+0.036,es*0.24,es*0.24,0.02,'#ffffff',0],[-ex-es*0.18,ey+es*0.2,hf+0.036,es*0.24,es*0.24,0.02,'#ffffff',0]);
  const eh=o.eh||0.14,ecl=o.ec||o.hc||o.c;
  if(o.ears==='up')P.push([hs*0.32,y+hy+hs/2+eh/2-0.02,L/2+hz-hs*0.15,0.09,eh,0.07,ecl],[-hs*0.32,y+hy+hs/2+eh/2-0.02,L/2+hz-hs*0.15,0.09,eh,0.07,ecl]);
  if(o.ears==='side')P.push([hs/2+0.04,y+hy+hs*0.15,L/2+hz-hs*0.1,0.1,0.07,eh,ecl],[-hs/2-0.04,y+hy+hs*0.15,L/2+hz-hs*0.1,0.1,0.07,eh,ecl]);
  if(o.ears==='down')P.push([hs/2+0.03,y+hy+hs*0.02,L/2+hz,0.06,eh,0.12,ecl],[-hs/2-0.03,y+hy+hs*0.02,L/2+hz,0.06,eh,0.12,ecl]);
  if(o.ears==='round')P.push([hs*0.36,y+hy+hs/2+0.03,L/2+hz-hs*0.2,0.12,0.1,0.06,ecl],[-hs*0.36,y+hy+hs/2+0.03,L/2+hz-hs*0.2,0.12,0.1,0.06,ecl]);
  const tc=o.tc||o.c;
  if(o.tail==='short')P.push([0,y+Hb*0.22,-L/2-0.05,0.12,0.12,0.12,tc]);
  if(o.tail==='long')P.push([0,y+Hb*0.1,-L/2-0.24,0.08,0.08,0.5,tc]);
  if(o.tail==='hang')P.push([0,y-Hb*0.15,-L/2-0.06,0.12,Hb+0.25,0.12,tc]);
  if(o.tail==='fluffy')P.push([0,y+Hb*0.05,-L/2-0.22,0.2,0.2,0.46,tc],[0,y+Hb*0.05,-L/2-0.48,0.14,0.14,0.08,o.tip||tc]);
  if(o.tail==='up')P.push([0,y+Hb*0.35,-L/2-0.06,0.07,0.07,0.12,tc],[0,y+Hb*0.7,-L/2-0.1,0.07,0.4,0.07,tc]);
  if(o.extra)P.push(...o.extra(y,hy,hf,L,W,Hb,hs));
  const lx=W/2-o.legW/2-0.03,lz=L/2-o.legW/2-0.06,ly=y-Hb/2+0.03;
  return{hd:{c:[0,y+hy,L/2+hz],r:hs},tz:-L/2,ty:y+Hb*0.1,parts:P,legs:[[lx,ly,lz,0],[-lx,ly,lz,1],[lx,ly,-lz,1],[-lx,ly,-lz,0]],lw:o.legW,lh:ll+0.03,lc:o.lc||o.c,lf:o.hoof||darker(o.lc||o.c,0.7)};
}
// dwunogi ptak
function BIRD(o){const y=o.legL+o.Hb/2,P=[[0,y,0,o.W,o.Hb,o.L,o.c],[0,y+o.Hb/2+o.hs/2-0.04,o.L/2-o.hs/2+0.02,o.hs,o.hs,o.hs,o.hc||o.c],
  [0,y+o.Hb/2+o.hs*0.42,o.L/2+0.06,o.bw||0.1,0.06,0.14,o.beak],[o.hs*0.32,y+o.Hb/2+o.hs*0.58,o.L/2-o.hs/2+0.02+o.hs*0.3,0.04,0.05,o.hs*0.6+0.02,'#1a1a1a'],[-o.hs*0.32,y+o.Hb/2+o.hs*0.58,o.L/2-o.hs/2+0.02+o.hs*0.3,0.04,0.05,o.hs*0.6+0.02,'#1a1a1a'],
  [o.W/2+0.03,y,-0.02,0.06,o.Hb*0.7,o.L*0.7,o.wc||o.c],[-o.W/2-0.03,y,-0.02,0.06,o.Hb*0.7,o.L*0.7,o.wc||o.c],[0,y+0.04,-o.L/2-0.05,o.W*0.6,o.Hb*0.4,0.12,o.tc||o.c]];
  if(o.extra)P.push(...o.extra(y));return{hd:{c:[0,y+o.Hb/2+o.hs/2-0.04,o.L/2-o.hs/2+0.02],r:o.hs},tz:-o.L/2,ty:y,parts:P,legs:[[0.08,o.legL+0.02,0,0],[-0.08,o.legL+0.02,0,1]],lw:0.05,lh:o.legL+0.02,lc:o.lc,lf:o.lc}}
const PAS=(def,n,hp,spd,food,biomes)=>Object.assign(def,{n,hp,dmg:Math.max(2,hp/12),spd,aggro:0,rng:1.4,cd:1.4,passive:1,food,pb:biomes});
const ANIM={
 owca:PAS(Q({L:0.95,W:0.62,Hb:0.56,legL:0.34,legW:0.13,c:'#efe9dc',c2:'#e4ddcc',hs:0.32,hc:'#3a3330',snout:[0.12,0.16,0.2,'#3a3330'],ears:'side',ec:'#3a3330',eh:0.14,tail:'short',lc:'#3a3330',hoof:'#2a2420',
   extra:(y,hy,hf,L,W,Hb,hs)=>[[0,y+Hb/2+0.04,0,W*0.8,0.08,L*0.72,'#f7f2e8'],[0,y+hy+hs/2+0.04,L/2-0.02,0.26,0.08,0.24,'#f7f2e8'],[W/2+0.03,y+0.02,0.1,0.04,Hb*0.6,L*0.5,'#f2ecdf'],[-W/2-0.03,y+0.02,0.1,0.04,Hb*0.6,L*0.5,'#f2ecdf']]}),'Owca',24,2.6,'koniczyna',[2]),
 krowa:PAS(Q({L:1.5,W:0.76,Hb:0.72,legL:0.52,legW:0.17,c:'#f2ede4',c2:'#e9e2d6',hs:0.42,snout:[0.14,0.22,0.3,'#e8b8a8'],nose:'#c8887a',ears:'side',eh:0.18,tail:'hang',tc:'#2a2420',lc:'#f2ede4',hoof:'#2a2420',
   extra:(y,hy,hf,L,W,Hb,hs)=>[[W/2+0.02,y+0.06,0.24,0.04,0.34,0.4,'#2a2420'],[-W/2-0.02,y-0.02,-0.3,0.04,0.3,0.36,'#2a2420'],[0,y+Hb/2+0.02,-0.2,0.34,0.04,0.3,'#2a2420'],[hs*0.42,y+hy+hs/2+0.05,L/2-0.05,0.06,0.1,0.06,'#e8e0cc'],[-hs*0.42,y+hy+hs/2+0.05,L/2-0.05,0.06,0.1,0.06,'#e8e0cc'],[0,y-Hb/2-0.06,-0.3,0.24,0.12,0.24,'#e8a8a0']]}),'Krowa',40,2.4,'siano',[2]),
 swinia:PAS(Q({L:1.0,W:0.64,Hb:0.52,legL:0.24,legW:0.15,c:'#eab0a0',c2:'#e4a494',hs:0.38,snout:[0.1,0.18,0.24,'#e09a8a'],nose:'#c0706a',ears:'down',ec:'#e4a090',eh:0.14,tail:'short',lc:'#e4a494',hoof:'#8a5a4a'}),'Świnia',28,2.8,'jablko',[2,3]),
 kon:PAS(Q({L:1.55,W:0.56,Hb:0.66,legL:0.8,legW:0.15,c:'#7a4a2a',c2:'#6a3e22',hs:0.32,hy:0.78,hz:0.04,neck:[0.3,0.62,0.4],snout:[0.32,0.24,0.24,'#6a3a20'],nose:'#2a1a12',ears:'up',eh:0.12,tail:'hang',tc:'#2a1a10',lc:'#6a3e22',hoof:'#2a2420',
   extra:(y,hy,hf,L)=>[[0,y+0.72,L/2-0.18,0.08,0.5,0.24,'#2a1a10'],[0,y+0.36,L/2-0.36,0.08,0.4,0.22,'#2a1a10'],[0,y+hy+0.2,L/2+0.02,0.08,0.06,0.2,'#2a1a10']]}),'Koń',46,3.4,'owies',[2]),
 krolik:PAS(Object.assign(Q({L:0.42,W:0.3,Hb:0.3,legL:0.08,legW:0.08,c:'#c9b49a',c2:'#efe6d6',hs:0.24,hy:0.14,ears:'up',eh:0.28,tail:'short',tc:'#f7f2e8',lc:'#c9b49a'}),{hop:1}),'Królik',10,3.2,'marchew',[2,3]),
 jelen:PAS(Q({L:1.3,W:0.5,Hb:0.6,legL:0.82,legW:0.12,c:'#9a6a3e',c2:'#e8d8c0',hs:0.3,hy:0.66,hz:0.02,neck:[0.26,0.5,0.32],snout:[0.18,0.18,0.18,'#8a5a32'],nose:'#2a1a12',ears:'side',eh:0.16,tail:'short',tc:'#f2ece0',lc:'#8a5a32',hoof:'#2a2420',
   extra:(y,hy,hf,L,W,Hb,hs)=>{const a='#d8c8a8',t=y+hy+hs/2,z=L/2+0.02;return[[0.12,t+0.18,z,0.05,0.36,0.05,a],[-0.12,t+0.18,z,0.05,0.36,0.05,a],[0.24,t+0.32,z-0.04,0.24,0.05,0.05,a],[-0.24,t+0.32,z-0.04,0.24,0.05,0.05,a],[0.14,t+0.42,z+0.06,0.05,0.2,0.05,a],[-0.14,t+0.42,z+0.06,0.05,0.2,0.05,a],[0.34,t+0.44,z-0.04,0.05,0.2,0.05,a],[-0.34,t+0.44,z-0.04,0.05,0.2,0.05,a]]}}),'Jeleń',34,4.2,'jagody',[3]),
 lis:PAS(Q({L:0.8,W:0.32,Hb:0.32,legL:0.28,legW:0.08,c:'#d0662a',c2:'#f2ece0',hs:0.3,snout:[0.2,0.12,0.14,'#f2ece0'],nose:'#1a1a1a',ears:'up',eh:0.16,ec:'#a84a1a',tail:'fluffy',tc:'#d0662a',tip:'#f7f2e8',lc:'#3a2418'}),'Lis',16,4.4,'kurczak',[3]),
 niedzwiedz:PAS(Q({L:1.6,W:0.92,Hb:0.86,legL:0.44,legW:0.24,c:'#5a3a22',c2:'#4a2e1a',hs:0.52,snout:[0.2,0.24,0.28,'#8a6a4a'],nose:'#1a1a1a',ears:'round',tail:'short',lc:'#4a2e1a'}),'Niedźwiedź',70,3.6,'miod',[3,5]),
 wielblad:PAS(Q({L:1.6,W:0.62,Hb:0.7,legL:1.0,legW:0.14,c:'#c9a46a',c2:'#b8925a',hs:0.32,hy:0.98,hz:0.36,neck:[0.26,0.86,0.3],snout:[0.3,0.2,0.22,'#b8925a'],nose:'#3a2a1a',ears:'up',eh:0.08,tail:'hang',tc:'#8a6a3a',lc:'#b8925a',hoof:'#5a4a3a',
   extra:(y,hy,hf,L,W,Hb)=>[[0,y+Hb/2+0.16,0,0.46,0.34,0.6,'#c49c60'],[0,y+Hb/2+0.36,0,0.3,0.1,0.36,'#c49c60'],[0,y+0.55,L/2+0.2,0.24,0.18,0.5,'#c9a46a']]}),'Wielbłąd',50,3.0,'daktyle',[4]),
 jaszczurka:PAS({n:'',parts:[[0,0.17,0,0.28,0.16,0.7,'#6a8a3a'],[0,0.26,0,0.2,0.04,0.5,'#8aa84a'],[0,0.18,0.44,0.22,0.14,0.22,'#6a8a3a'],[0.08,0.24,0.52,0.05,0.05,0.04,'#e8c040'],[-0.08,0.24,0.52,0.05,0.05,0.04,'#e8c040'],[0,0.12,-0.55,0.1,0.08,0.5,'#5a7a32'],[0,0.1,-0.85,0.06,0.05,0.2,'#5a7a32']],
   legs:[[0.18,0.14,0.22,0],[-0.18,0.14,0.22,1],[0.18,0.14,-0.2,1],[-0.18,0.14,-0.2,0]],lw:0.07,lh:0.14,lc:'#5a7a32'},'Jaszczurka',12,4.0,'szarancza',[4]),
 pingwin:PAS(BIRD({L:0.36,W:0.38,Hb:0.56,legL:0.06,hs:0.28,c:'#1e2228',hc:'#1e2228',beak:'#e8a03a',wc:'#1e2228',lc:'#e8a03a',extra:y=>[[0,y-0.02,0.2,0.28,0.46,0.04,'#f2f2ee']]}),'Pingwin',14,1.8,'sledz',[5]),
 renifer:PAS(Q({L:1.3,W:0.52,Hb:0.6,legL:0.78,legW:0.13,c:'#8a7a68',c2:'#e8e2d6',hs:0.3,hy:0.64,neck:[0.28,0.5,0.32],snout:[0.18,0.18,0.18,'#6a5a48'],nose:'#2a2420',ears:'side',eh:0.14,tail:'short',tc:'#f2ece0',lc:'#6a5a48',hoof:'#2a2420',
   extra:(y,hy,hf,L,W,Hb,hs)=>{const a='#cfc2a8',t=y+hy+hs/2,z=L/2;return[[0,y+0.3,L/2-0.12,0.32,0.3,0.12,'#efe9df'],[0.13,t+0.2,z,0.05,0.4,0.05,a],[-0.13,t+0.2,z,0.05,0.4,0.05,a],[0.25,t+0.38,z-0.06,0.26,0.05,0.05,a],[-0.25,t+0.38,z-0.06,0.26,0.05,0.05,a],[0.16,t+0.46,z+0.1,0.05,0.24,0.05,a],[-0.16,t+0.46,z+0.1,0.05,0.24,0.05,a],[0.36,t+0.52,z-0.06,0.05,0.24,0.05,a],[-0.36,t+0.52,z-0.06,0.05,0.24,0.05,a],[0,t-0.2,z+0.32,0.12,0.06,0.04,'#efe9df']]}}),'Renifer',36,4.0,'porost',[5]),
 koza:PAS(Q({L:0.9,W:0.42,Hb:0.46,legL:0.44,legW:0.11,c:'#d8d0c0',c2:'#c8c0b0',hs:0.28,hy:0.4,snout:[0.12,0.14,0.16,'#c8c0b0'],nose:'#3a3330',ears:'side',eh:0.12,tail:'up',lc:'#b8b0a0',hoof:'#3a3330',
   extra:(y,hy,hf,L,W,Hb,hs)=>[[0,y+hy-hs/2-0.08,L/2+0.1,0.08,0.16,0.08,'#f2eee6'],[0.09,y+hy+hs/2+0.1,L/2-0.08,0.05,0.18,0.05,'#8a8070'],[-0.09,y+hy+hs/2+0.1,L/2-0.08,0.05,0.18,0.05,'#8a8070'],[0.09,y+hy+hs/2+0.2,L/2-0.18,0.05,0.05,0.16,'#8a8070'],[-0.09,y+hy+hs/2+0.2,L/2-0.18,0.05,0.05,0.16,'#8a8070']]}),'Koza górska',22,3.4,'sol',[6]),
 kaczka:PAS(BIRD({L:0.46,W:0.3,Hb:0.26,legL:0.12,hs:0.2,c:'#8a7a62',hc:'#2f6a3a',beak:'#e8b03a',bw:0.12,wc:'#6a5a48',tc:'#3a3a3a',lc:'#e8903a',extra:y=>[[0,y+0.16,0.16,0.22,0.04,0.06,'#f2f2ee']]}),'Kaczka',8,2.4,'chleb',[7,1]),
 zolw:PAS({n:'',parts:[[0,0.2,0,0.66,0.24,0.8,'#4a6a3a'],[0,0.34,0,0.5,0.1,0.6,'#5a7a42'],[0,0.4,0,0.26,0.06,0.3,'#6a8a4a'],[0,0.1,0,0.72,0.06,0.86,'#8a7a4a'],[0,0.2,0.5,0.2,0.18,0.24,'#8a9a5a'],[0.06,0.25,0.63,0.04,0.04,0.03,'#1a1a1a'],[-0.06,0.25,0.63,0.04,0.04,0.03,'#1a1a1a']],
   legs:[[0.28,0.12,0.28,0],[-0.28,0.12,0.28,1],[0.28,0.12,-0.28,1],[-0.28,0.12,-0.28,0]],lw:0.12,lh:0.12,lc:'#8a9a5a'},'Żółw',30,0.9,'wodorosty',[1]),
 kura:PAS(BIRD({L:0.36,W:0.26,Hb:0.26,legL:0.16,hs:0.18,c:'#f4f0e6',hc:'#f4f0e6',beak:'#e8b03a',lc:'#e8b03a',extra:y=>[[0,y+0.32,0.1,0.04,0.08,0.12,'#d0302a'],[0,y+0.17,0.21,0.04,0.06,0.04,'#d0302a']]}),'Kura',6,2.6,'ziarno',[]),
 kot:PAS(Q({L:0.56,W:0.24,Hb:0.26,legL:0.2,legW:0.07,c:'#8a7a6a',c2:'#c8b8a4',hs:0.24,hy:0.16,ears:'up',eh:0.09,tail:'up',lc:'#8a7a6a',eye:'#7ab040',
   extra:(y,hy,hf,L,W,Hb)=>[[0,y+Hb/2+0.02,0.1,W*0.7,0.04,0.06,'#5a4a3a'],[0,y+Hb/2+0.02,-0.08,W*0.7,0.04,0.06,'#5a4a3a']]}),'Kot',8,3.6,'ryba',[]),
 pies:PAS(Q({L:0.8,W:0.34,Hb:0.36,legL:0.34,legW:0.1,c:'#a8783a',c2:'#d8c0a0',hs:0.3,snout:[0.16,0.14,0.16,'#d8c0a0'],nose:'#1a1a1a',ears:'down',ec:'#7a5426',eh:0.16,tail:'up',lc:'#a8783a'}),'Pies',20,4.2,'kielbasa',[]),
};
for(const k in ANIM)ANIM[k].n=ANIM[k].n||k;
// ulepszone modele wrogów (ten sam format)
Object.assign(EDEF.wilk,Q({L:1.15,W:0.5,Hb:0.5,legL:0.52,legW:0.13,c:'#8a8a90',c2:'#c8c8cc',hs:0.38,snout:[0.24,0.17,0.2,'#a8a8ae'],nose:'#1a1a1a',eye:'#e8c040',ears:'up',eh:0.16,tail:'fluffy',tc:'#77777d',tip:'#c8c8cc',lc:'#77777d',
  extra:(y,hy,hf,L,W,Hb)=>[[0,y+Hb/2+0.03,L/2-0.25,W*0.7,0.08,0.4,'#6a6a70']]}));
Object.assign(EDEF.dzik,Q({L:1.2,W:0.7,Hb:0.64,legL:0.4,legW:0.16,c:'#5a3e2a',c2:'#4a3220',hs:0.44,snout:[0.16,0.2,0.26,'#7a5a44'],nose:'#2a1a12',eye:'#e04a2a',ears:'up',eh:0.12,tail:'short',lc:'#3e2a1c',hoof:'#1a1410',
  extra:(y,hy,hf,L,W,Hb,hs)=>[[0,y+Hb/2+0.06,0,0.16,0.12,L*0.8,'#2e2014'],[0.15,y+hy-hs*0.2,hf+0.1,0.05,0.18,0.05,'#f2ead8'],[-0.15,y+hy-hs*0.2,hf+0.1,0.05,0.18,0.05,'#f2ead8']]}));
// jedzenie: każdy gatunek ma własne, w opisie przedmiotu widać dla kogo
const FOODS={koniczyna:['Koniczyna','owca',5],siano:['Snop siana','krowa',6],jablko:['Jabłko','swinia',5],ziarno:['Garść ziarna','kura',3],owies:['Worek owsa','kon',14],marchew:['Marchewka','krolik',3],
  jagody:['Jagody leśne','jelen',10],kurczak:['Pieczony kurczak','lis',7],miod:['Plaster miodu','niedzwiedz',16],daktyle:['Daktyle','wielblad',12],szarancza:['Szarańcza','jaszczurka',4],sledz:['Śledź','pingwin',5],
  porost:['Porost','renifer',10],sol:['Bryłka soli','koza',6],chleb:['Okruchy chleba','kaczka',2],wodorosty:['Wodorosty','zolw',4],ryba:['Ryba','kot',4],kielbasa:['Kiełbasa','pies',6],
  mieso:['Surowe mięso','wilk',8],zoledzie:['Żołędzie','dzik',6],galareta:['Galaretka','slime',5],malze:['Małże','krab',5],muchy:['Słoik much','ropucha',4],jajo:['Pajęcze jajo','pajak',12],
  skarabeusz:['Skarabeusz','skorpion',12],zlote_jablko:['Złote jabłko','gryf',45],lod:['Lodowy kryształ','yeti',20],krysztal:['Rubinowy kryształ','golem',24]};
Object.assign(FOODS,{ziola:['Snop ziół stepowych','zubr',9],galazki:['Gałązki wierzby','bobr',4],robaki:['Garść dżdżownic','jez',3],krewetki:['Krewetki','flaming',6],mrozne_serce:['Mroźne serce','lodowy_golem',26],zatrute_mieso:['Zatrute mięso','wiwerna',22]});
const FOODOF={};for(const k in FOODS)FOODOF[FOODS[k][1]]=k;
const foodName=k=>FOODS[k][0], foodFor=k=>(EDEF[FOODS[k][1]]||ANIM[FOODS[k][1]]||{n:FOODS[k][1]}).n;
Object.assign(EDEF,ANIM);
// =================== FANTASTYCZNE STWORY I NOWI BOSSOWIE ===================
const HB=(o)=>Object.assign({parts:[],legs:[],lw:0.1,lh:0.1,lc:'#000'},o);
Object.assign(EDEF,{
 troll:HB({n:'Troll górski',hp:140,dmg:18,spd:3.6,aggro:14,rng:2.6,cd:1.8,bh:3.4}),
 ork:HB({n:'Orkowy wojownik',hp:72,dmg:13,spd:4.8,aggro:16,rng:2.2,cd:1.2,bh:2.4}),
 upior:HB({n:'Upiór',hp:55,dmg:12,spd:4.4,aggro:18,rng:1.8,cd:1.4,ranged:{rng:15,proj:'curse',cd:2.6},bh:2.3}),
 drzewiec:HB({n:'Drzewiec',hp:160,dmg:16,spd:2.8,aggro:12,rng:2.6,cd:1.9,bh:3.7}),
 wilkolak:Object.assign({n:'Wilkołak',hp:88,dmg:15,spd:6.8,aggro:18,rng:2.0,cd:1.0,bh:2.3},Q({L:1.45,W:0.7,Hb:0.78,legL:0.72,legW:0.17,c:'#4a3f3a',c2:'#6a5a50',hs:0.5,snout:[0.28,0.2,0.24,'#5a4a42'],nose:'#1a1a1a',eye:'#ff3a2a',ears:'up',eh:0.2,ec:'#3a302a',tail:'fluffy',tc:'#3a302a',tip:'#6a5a50',lc:'#3a302a',
   extra:(y,hy,hf,L,W,Hb)=>[[0,y+Hb/2+0.06,L/2-0.3,W*0.86,0.16,0.6,'#2e2622'],[0,y+Hb/2+0.04,-0.1,W*0.6,0.1,0.5,'#2e2622']]})),
 bazyliszek:Object.assign({n:'Bazyliszek',hp:95,dmg:14,spd:4.2,aggro:14,rng:2.0,cd:1.4,ranged:{rng:12,proj:'poison',cd:3},bh:1.6},Q({L:2.0,W:0.72,Hb:0.5,legL:0.3,legW:0.16,c:'#3f5a32',c2:'#c8b060',hs:0.46,hy:0.12,snout:[0.3,0.18,0.3,'#4a6a3a'],eye:'#ffd23a',tail:'long',tc:'#3f5a32',lc:'#34482a',
   extra:(y,hy,hf,L,W,Hb)=>{const a=[];for(let k=0;k<6;k++)a.push([0,y+Hb/2+0.1,L/2-0.3-k*0.32,0.06,0.2-k*0.015,0.16,'#c84a2a']);a.push([0,y-0.02,-L/2-0.8,0.18,0.14,0.9,'#3f5a32'],[0,y-0.06,-L/2-1.35,0.1,0.1,0.3,'#c84a2a']);return a}})),
 gryf:Object.assign({n:'Gryf',hp:90,dmg:14,spd:6.5,aggro:16,rng:2.0,cd:1.2,bh:2.3},Q({L:1.5,W:0.66,Hb:0.68,legL:0.66,legW:0.15,c:'#c9a46a',c2:'#e8d8b0',hs:0.42,hy:0.6,hz:0.06,neck:[0.36,0.5,0.38],hc:'#f2efe6',snout:[0.18,0.14,0.16,'#e8b03a'],eye:'#1a1a1a',tail:'long',tc:'#a8844a',lc:'#e8b03a',hoof:'#3a2a1a',
   extra:(y,hy,hf,L,W,Hb)=>[[W/2+0.5,y+Hb/2-0.02,0.05,1.0,0.1,0.9,'#d8c8a0'],[-W/2-0.5,y+Hb/2-0.02,0.05,1.0,0.1,0.9,'#d8c8a0'],[W/2+1.15,y+Hb/2-0.08,-0.05,0.5,0.08,0.7,'#b8a070'],[-W/2-1.15,y+Hb/2-0.08,-0.05,0.5,0.08,0.7,'#b8a070'],[0,y+hy+0.28,L/2-0.06,0.24,0.1,0.3,'#f2efe6']]})),
 zywiolak:{n:'Ognisty żywiołak',hp:65,dmg:13,spd:4.4,aggro:16,rng:1.8,cd:1.5,hop:1,ranged:{rng:14,proj:'fire',cd:2.8},bh:2.4,
   parts:[[0,0.5,0,0.9,0.9,0.9,'#ff6a1a'],[0,1.2,0,0.7,0.8,0.7,'#ff8a2e'],[0,1.8,0,0.48,0.5,0.48,'#ffd34d'],[0,2.15,0,0.24,0.3,0.24,'#fff2a0'],[0.5,1.1,0,0.3,0.5,0.3,'#ff5a1a'],[-0.5,1.0,0.1,0.3,0.6,0.3,'#ff5a1a'],[0.16,1.38,0.36,0.12,0.12,0.02,'#2a0a00'],[-0.16,1.38,0.36,0.12,0.12,0.02,'#2a0a00']],legs:[],lw:0.1,lh:0.1,lc:'#000'},
 smok:Object.assign({n:'Smok Pradawny',boss:'smok',sc:2.6,hp:950,dmg:30,spd:4.6,aggro:30,rng:3.0,cd:1.8,bh:3.6},Q({L:3.0,W:1.25,Hb:1.15,legL:0.9,legW:0.32,c:'#8a2a22',c2:'#d8a040',hs:0.8,hy:0.95,hz:0.25,neck:[0.55,1.0,0.7],snout:[0.5,0.36,0.5,'#7a221c'],nose:'#2a0a08',eye:'#ffd23a',ears:'up',eh:0.3,ec:'#e8d8a8',tail:'long',tc:'#7a221c',lc:'#6a1e18',hoof:'#2a2a2a',
   extra:(y,hy,hf,L,W,Hb,hs)=>{const a=[[W/2+1.5,y+Hb/2+0.1,0,2.8,0.12,1.8,'#a8342a'],[-W/2-1.5,y+Hb/2+0.1,0,2.8,0.12,1.8,'#a8342a'],[W/2+3.1,y+Hb/2+0.3,-0.3,0.6,0.1,1.2,'#8a2a22'],[-W/2-3.1,y+Hb/2+0.3,-0.3,0.6,0.1,1.2,'#8a2a22'],[W/2+0.2,y+Hb/2+0.15,0,0.4,0.2,0.3,'#6a1e18'],[-W/2-0.2,y+Hb/2+0.15,0,0.4,0.2,0.3,'#6a1e18'],
     [0,y-0.1,-L/2-1.0,0.4,0.36,1.6,'#8a2a22'],[0,y-0.2,-L/2-2.1,0.24,0.24,0.8,'#7a221c'],[0,y-0.15,-L/2-2.6,0.5,0.12,0.4,'#d8a040']];for(let k=0;k<8;k++)a.push([0,y+Hb/2+0.18,L/2-0.35-k*0.36,0.12,0.36-k*0.02,0.24,'#d8a040']);return a}})),
 krol_troll:HB({n:'Król Trolli',boss:'troll',sc:1.0,hp:760,dmg:26,spd:3.8,aggro:26,rng:3.2,cd:1.8,bh:4.4}),
 lich:HB({n:'Lisz',boss:'lich',sc:1.0,hp:640,dmg:22,spd:3.6,aggro:28,rng:2.0,cd:1.5,ranged:{rng:18,proj:'curse',cd:2.2},bh:2.9}),
 prastary:HB({n:'Prastary Drzewiec',boss:'ent',sc:1.0,hp:820,dmg:24,spd:3.0,aggro:24,rng:3.2,cd:2.0,bh:5.2}),
});
EDEF.lich.ranged=null;

const MOUNT_X={},FANT_P=new Set();
const BIOME_P={};for(const k in ANIM)for(const b of ANIM[k].pb){(BIOME_P[b]=BIOME_P[b]||[]).push(k)}
Object.assign(BIOME_P,{8:['kon','wielblad','krolik','jaszczurka'],9:['jaszczurka','kaczka','zolw','kot'],10:['jelen','lis','niedzwiedz','krolik','dzik'],11:['krolik','jelen','kaczka','owca'],12:['owca','koza','krolik','renifer']});
const VILLAGE_P=['kura','kura','kot','pies','owca'];
const HERD={owca:3,krowa:2,jelen:2,renifer:3,kura:3,swinia:2,kaczka:2,pingwin:3,koza:2};



// =================== ZWIERZĘTA Z PINTARA (modele 1:1 z paczki pintar_swiat_i_zwierzeta) ===================
const PANIM={};
/* ANIM – bazowe modele zwierząt (ciało, głowa, nogi). Format opisany w README. Te definicje są potem NADPISYWANE przez plik 02. */
function legGeo(L){const w=L.w,h=L.h,c=L.c,hf=L.hoof||darker(c,0.8),hb=Math.min(1,h*.25);
  if(L.splay){return voxGeo([[-w*.6,-h*.45,-w*.6,w*1.2,h*.45,w*1.2,c],[-w*.55,-h*.52,-w*.55,w*1.1,h*.1,w*1.1,darker(c,0.7)],[-w*.42,-h*.92,-w*.42,w*.84,h*.42,w*.84,c],[-w*.3,-h,-w*.3,w*.6,h*.1,w*.6,darker(c,0.6)],[-w*.62,-h*.12,-w*.62,w*1.24,.12,w*1.24,darker(c,1.2)]],0)}
  if(h<2.2)return voxGeo([[-w/2,-h,-w/2,w,h,w,c],[-w/2-.1,-h,-w/2-.1,w+.2,hb,w+.4,hf]],0);
  return voxGeo([[-w*.58,-h*.48,-w*.58,w*1.16,h*.48,w*1.16,c],[-w*.5,-h*.58,-w*.48,w,h*.14,w*1.02,darker(c,0.88)],[-w*.42,-h+hb*.9,-w*.42,w*.84,h*.5,w*.84,c],[-w*.44,-h*.5,-w*.62,w*.88,h*.12,w*.3,darker(c,1.08)],
   [-w/2-.1,-h,-w/2-.1,w+.2,hb,w+.45,hf],[-w/2-.05,-h+hb*.82,-w/2-.05,w+.1,.16,w+.25,darker(hf,1.25)]],0)}
Object.assign(PANIM,{
  cow:{body:voxGeo([[-4,6,-7,8,7,14,'#f4f0e8'],[-4.2,8,-3,1,4,5,'#2a2a2a'],[1,12.6,-6,3.4,.6,5,'#2a2a2a'],[3.2,7,2,1,4,4,'#2a2a2a'],[-3.6,12.4,-6.6,7.2,.8,13,'#ece6da'],[-1.5,4.6,1,3,1.6,3,'#e8a0a0'],[-1.1,4.2,1.6,.5,.6,.5,'#d88a8a'],[.6,4.2,1.6,.5,.6,.5,'#d88a8a'],[-3.4,10.6,-3.6,6.8,.4,.4,'#d8d0c0'],[-.4,5,-7.6,.8,7,.8,'#f4f0e8'],[-.6,3.6,-7.9,1.2,1.8,1.2,'#2a2a2a'],[-3.4,12,5,6.8,1.2,1.6,'#e4ded0']]),
    head:voxGeo([[-2.5,-3,0,5,5,6,'#f4f0e8'],[-2.2,-3.2,5,4.4,2.6,1.6,'#e8a0a0'],[-1.2,-2.6,6.5,.8,.8,.3,'#b86a70'],[.4,-2.6,6.5,.8,.8,.3,'#b86a70'],[-2.6,.4,1.4,.6,.8,.6,'#1d1410'],[2,.4,1.4,.6,.8,.6,'#1d1410'],[-4.2,1.4,.4,1.8,1.2,1.4,'#e8e0c8'],[2.4,1.4,.4,1.8,1.2,1.4,'#e8e0c8'],[-4.4,2.4,.4,.8,1.6,.8,'#e8dcb0'],[3.6,2.4,.4,.8,1.6,.8,'#e8dcb0'],[-1.4,1.8,1,2.8,.8,2,'#2a2a2a'],[-1.8,-.6,3.8,1.2,1.6,.4,'#2a2a2a']]),neck:[0,11,6.6],
    leg:{w:2,h:6,c:'#f0ece4',hoof:'#3a3a3a',hips:[[-2.6,-5],[2.6,-5],[-2.6,4.4],[2.6,4.4]],amp:.45},gait:5},
  sheep:{body:voxGeo([[-4,4,-5.5,8,7,11,'#f4f2ec'],[-3,10.6,-4,6,1.4,8,'#ffffff'],[-4.4,5,-3,1,4,6,'#ebe7de'],[3.4,5,-2,1,4,6,'#ebe7de'],[-3.4,6.4,5.2,6.8,4,1.2,'#ffffff'],[-3.4,4.4,-6.4,6.8,5.6,1,'#ffffff'],[-4.6,7,-4,1.2,2,2,'#ffffff'],[3.4,7,-4,1.2,2,2,'#ffffff'],[-.8,7,-6.6,1.6,1.6,1,'#f4f2ec']]),
    head:voxGeo([[-2,-2.6,0,4,4.4,4.6,'#3a3a3a'],[-2.4,1.2,-.4,4.8,1.8,3.2,'#ffffff'],[-3.4,.2,.8,1.6,.8,1.8,'#2a2a2a'],[1.8,.2,.8,1.6,.8,1.8,'#2a2a2a'],[-1.4,-1.8,4.4,2.8,1.6,.6,'#4a4a4a'],[-1.2,-.2,3.2,.6,.6,.6,'#f0f0f0'],[.6,-.2,3.2,.6,.6,.6,'#f0f0f0']]),neck:[0,8.6,5.4],
    leg:{w:1.6,h:4.4,c:'#3a3a3a',hips:[[-2.2,-3.2],[2.2,-3.2],[-2.2,3.8],[2.2,3.8]],amp:.55},gait:7},
  chicken:{body:voxGeo([[-1.6,1.8,-2.2,3.2,3,4.4,'#ffffff'],[-1.2,3.6,-3,2.4,2.4,1.4,'#f0f0f0'],[-1.9,2.4,-1.2,.4,1.6,2.6,'#ece8e0'],[1.5,2.4,-1.2,.4,1.6,2.6,'#ece8e0'],[-.3,4.6,-3.8,.6,2.2,1.2,'#d8d0c0'],[-.3,5.4,-4.6,.6,1.8,1,'#4a5a3a'],[-1.2,1.6,1.8,2.4,1.4,.8,'#f4f0e8']]),
    head:voxGeo([[-1,-.4,-.4,2,2.4,2,'#ffffff'],[-.3,2,-.2,.6,1.2,1.8,'#e03a2a'],[-.4,.6,1.6,.8,.6,1,'#e8a020'],[-.3,-.4,1.2,.6,.9,.5,'#e03a2a'],[-1.1,1,.6,.3,.4,.4,'#1d1410'],[.8,1,.6,.3,.4,.4,'#1d1410']]),neck:[0,4.4,1.8],
    leg:{w:.5,h:1.9,c:'#e8a020',hips:[[-.75,-.15],[.75,-.15]],amp:.7},gait:16},
  pig:{body:voxGeo([[-3.6,3,-6,7.2,6,12,'#e8a0a0'],[-3.8,4,-2,7.6,4,4,'#e49a9a'],[-3.4,8.6,-5.6,6.8,.6,11,'#eeaaaa'],[-.6,6,-6.8,1.2,1.2,1,'#d07a80'],[-.4,7.2,-7.2,.8,.8,.8,'#d07a80'],[-.4,7.4,-7.8,.8,.8,.8,'#d07a80'],[-2.8,3.4,-6.4,5.6,3,.6,'#e8a0a0'],[-3,3.2,-.8,.5,2,.8,'#d88a8a']]),
    head:voxGeo([[-2.6,-2.6,0,5.2,5,4.4,'#e8a0a0'],[-1.8,-2.2,4.2,3.6,2.6,1.6,'#d07a80'],[-1,-1.4,5.8,.6,.6,.2,'#5a2a2a'],[.4,-1.4,5.8,.6,.6,.2,'#5a2a2a'],[-3,2,.4,2,1.8,1,'#d88a8a'],[1,2,.4,2,1.8,1,'#d88a8a'],[-1.8,.6,4.2,.6,.6,.3,'#1d1410'],[1.2,.6,4.2,.6,.6,.3,'#1d1410']]),neck:[0,6.4,6],
    leg:{w:1.8,h:3.2,c:'#d88a8a',hoof:'#7a4a4a',hips:[[-2.1,-4.1],[2.1,-4.1],[-2.1,3.9],[2.1,3.9]],amp:.6},gait:9},
  dog:{body:voxGeo([[-1.8,3,-4,3.6,3.4,8,'#8a5a30'],[-1.2,3.4,1,2.4,2,2.6,'#c9a070'],[-.4,5.4,-5.6,.8,.8,3,'#8a5a30']]),
    head:voxGeo([[-1.8,-1.4,0,3.6,3.4,3.4,'#8a5a30'],[-1.2,-1.4,3.2,2.4,1.8,2,'#c9a070'],[-.5,-.2,5.1,1,.8,.4,'#1d1410'],[-2.4,-.4,.8,.8,2.6,1.6,'#5a3a20'],[1.6,-.4,.8,.8,2.6,1.6,'#5a3a20'],[-1.2,.8,3.3,.5,.5,.2,'#1d1410'],[.7,.8,3.3,.5,.5,.2,'#1d1410']]),neck:[0,5.6,3.8],
    leg:{w:1.2,h:3.1,c:'#7a4a28',hips:[[-1,-2.6],[1,-2.6],[-1,3],[1,3]],amp:.7},gait:10},
  cat:{body:voxGeo([[-1.2,1.9,-3,2.4,2.4,6,'#d88a3a'],[-1.3,2.9,-1.8,2.6,.5,.6,'#b06a28'],[-1.3,2.9,.2,2.6,.5,.6,'#b06a28'],[-.4,3.3,-5.6,.8,.8,3,'#d88a3a'],[-.4,4.1,-6.4,.8,3,.8,'#d88a3a']]),
    head:voxGeo([[-1.4,-1,0,2.8,2.6,2.4,'#d88a3a'],[-1.3,1.6,.4,.9,1.2,.9,'#d88a3a'],[.4,1.6,.4,.9,1.2,.9,'#d88a3a'],[-.9,.4,2.4,.5,.5,.2,'#3a8a3a'],[.4,.4,2.4,.5,.5,.2,'#3a8a3a'],[-.6,-.6,2.4,1.2,.8,.4,'#f4efe4']]),neck:[0,3.7,2.8],
    leg:{w:.9,h:2,c:'#c87a30',hips:[[-.75,-1.95],[.75,-1.95],[-.75,2.25],[.75,2.25]],amp:.65},gait:14},
  deer:{body:voxGeo([[-2.6,8,-6,5.2,5,12,'#9a6a3a'],[-2.2,8,-4,4.4,1.6,8,'#c9a070'],[-2.4,12,-5,4.8,.6,10,'#8a5a30'],[-1,11,-6.6,2,2.2,1,'#f4efe4'],[-1.8,8.4,5.4,3.6,3,.8,'#f0e8d8']]),
    head:voxGeo([[-1.2,0,-.4,2.4,5,2.4,'#9a6a3a'],[-1.6,4.4,0,3.2,2.6,4.4,'#9a6a3a'],[-1,4.4,4,2,1.6,1.2,'#5a3a20'],[-.5,5.2,5.1,1,.5,.3,'#1d1410'],[-2.4,6.6,.4,1,.5,1.6,'#9a6a3a'],[1.4,6.6,.4,1,.5,1.6,'#9a6a3a'],[-1.4,7,.6,.6,4,.6,'#d8c8a8'],[.8,7,.6,.6,4,.6,'#d8c8a8'],[-2.8,9.6,.6,2,.6,.6,'#d8c8a8'],[1.2,9.6,.6,2,.6,.6,'#d8c8a8'],[-3.2,10.6,.6,.6,2,.6,'#d8c8a8'],[2.6,10.6,.6,.6,2,.6,'#d8c8a8'],[-1.4,10,1.6,.6,1.6,.6,'#d8c8a8'],[.8,10,1.6,.6,1.6,.6,'#d8c8a8']]),neck:[0,11.6,5],
    leg:{w:1.2,h:8,c:'#7a5030',hoof:'#2a2a2a',hips:[[-1.4,-4],[1.4,-4],[-1.4,4.4],[1.4,4.4]],amp:.5},gait:5},
  rabbit:{body:voxGeo([[-1.4,0,-2,2.8,2.6,4,'#8a7a62'],[-.6,1.4,-2.6,1.2,1.2,.8,'#f4efe4'],[-1.4,0,1,1,.8,1.6,'#7a6a52'],[.4,0,1,1,.8,1.6,'#7a6a52']]),
    head:voxGeo([[-1.1,0,0,2.2,2.2,2.2,'#8a7a62'],[-.9,2.2,.4,.6,2.6,.6,'#8a7a62'],[.3,2.2,.4,.6,2.6,.6,'#8a7a62'],[-.9,1.2,2.2,.4,.4,.2,'#1d1410'],[.5,1.2,2.2,.4,.4,.2,'#1d1410']]),neck:[0,2,1.6]},
  fox:{body:voxGeo([[-1.6,2.6,-3.6,3.2,3,7.2,'#d06a2a'],[-1.2,2.6,-1,2.4,1,4,'#f4efe4'],[-1,3,-7.8,2,2,4.2,'#d06a2a'],[-.8,3.2,-8.8,1.6,1.6,1,'#f4efe4']]),
    head:voxGeo([[-1.6,-1,0,3.2,2.8,2.8,'#d06a2a'],[-.8,-1,2.6,1.6,1.4,1.8,'#f4efe4'],[-.4,-.4,4.3,.8,.6,.4,'#1d1410'],[-1.5,1.8,.6,1,1.4,.8,'#d06a2a'],[.5,1.8,.6,1,1.4,.8,'#d06a2a']]),neck:[0,4.6,3.6],
    leg:{w:1,h:2.8,c:'#2a2a2a',hips:[[-.9,-2.5],[.9,-2.5],[-.9,2.9],[.9,2.9]],amp:.7},gait:11},
  duck:{body:voxGeo([[-1.5,0,-2.4,3,2.2,4.6,'#8a6a44'],[-1.6,1,-2,.4,1,3,'#4a5a7a'],[1.2,1,-2,.4,1,3,'#4a5a7a'],[-.8,1.4,-3,1.6,1.4,1,'#6a5a44']]),
    head:voxGeo([[-1,0,0,2,2,2,'#2f7a4a'],[-.6,.4,2,1.2,.6,1.2,'#e8a020'],[-1,0,-.6,2,.6,.6,'#f4f4f4']]),neck:[0,2.2,1.8]},
  bird:{body:voxGeo([[-.6,-.4,-1,1.2,.9,2.2,'#4a3a30'],[-.4,-.2,1.1,.8,.6,.6,'#d8a040']]),head:voxGeo([[-2.8,0,-.6,5.6,.2,1.4,'#3a2a20']]),neck:[0,0,0],wing:1},
  gull:{body:voxGeo([[-.9,-.6,-2.4,1.8,1.6,4.8,'#f6f6f2'],[-.8,.5,-2.2,1.6,.6,4.4,'#bfc4cc'],[-.7,.6,2.2,1.4,1.4,1.6,'#f6f6f2'],[-.3,.7,3.7,.6,.5,1.2,'#e8b83a'],[-.9,.2,-3.8,1.8,.4,1.6,'#ececE8'],[-.6,-1.4,.2,.3,.9,.3,'#e08030'],[.3,-1.4,.2,.3,.9,.3,'#e08030']]),
    head:voxGeo([[-6,0,-.9,12,.25,2.6,'#f4f4f0'],[-6,0,-.9,2,.3,2.6,'#5a5e66'],[4,0,-.9,2,.3,2.6,'#5a5e66']]),neck:[0,.2,0],wing:1},
  pigeon:{body:voxGeo([[-.8,-.3,-1.5,1.6,1.4,3,'#8c919c'],[-.7,.2,-.9,1.4,.9,1.8,'#a4aab8'],[-.6,.6,1.3,1.2,1.1,1.2,'#7a6a96'],[-.45,.9,2.3,.9,1,1,'#8c919c'],[-.2,.95,3.2,.4,.4,.7,'#d8b8a0'],[-.7,-.1,-2.6,1.4,.5,1.4,'#4a4e5a'],[-.5,-1.2,.1,.25,.9,.25,'#d89090'],[.25,-1.2,.1,.25,.9,.25,'#d89090']]),
    head:voxGeo([[-4,0,-.7,8,.22,2,'#9aa0ac'],[-4,0,-.7,1.3,.26,2,'#4a4e5a'],[2.7,0,-.7,1.3,.26,2,'#4a4e5a'],[-1.2,.05,-.4,2.4,.24,1.2,'#b4bac6']]),neck:[0,.2,0],wing:1},
  butterfly:{body:voxGeo([[-.2,-.2,-.6,.4,.4,1.2,'#2a2a2a']]),head:voxGeo([[-1.6,0,-.9,3.2,.1,1.8,'#e8c040'],[-1.4,0,.2,1,.12,.6,'#ffffff'],[.4,0,.2,1,.12,.6,'#ffffff']]),neck:[0,0,0],wing:1},
});

/* Ulepszone wersje (cow, sheep, pig, chicken, dog, fox, rabbit, duck, cat, deer) – nadpisują bazowe PANIM. To jest FINALNY wygląd w grze. */
/* ---------- ulepszone zwierzęta (nadpisują PANIM z v10_models) ---------- */
(function(){const EY=(hw,y,z,s)=>[[-hw-.25,y,z,.5,s,s,'#f6f2e8'],[hw-.25,y,z,.5,s,s,'#f6f2e8'],[-hw-.45,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010'],[hw+.05,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010']];const W='#f4f0e8',K='#2a2a2a',PK='#e8a0a0';
PANIM.cow.body=voxGeo([[-4,6,-7,8,7,14,W],[-3.6,12.6,-6.4,7.2,.8,13,'#ece6da'],[-4.2,8,-3,1,4,5,K],[1,12.6,-6,3.4,.6,5,K],[3.2,7,2,1,4,4,K],[-3.9,6.6,3.6,7.8,2.4,3.4,'#e6dfd0'],[-1.6,4.2,1.4,3.2,2,3.2,PK],[-1.2,3.6,1.8,.7,.8,.7,'#d88890'],[.5,3.6,1.8,.7,.8,.7,'#d88890'],[-.5,5.4,-7.7,1,7,.9,W],[-.6,2.4,-7.9,1.2,3,1.2,K],[-.8,.2,-8,1.6,2.4,1.4,'#1d1410'],[-2.8,13.4,-1,5.6,.5,3,'#d8d2c4']]);
PANIM.cow.head=voxGeo([...EY(2.5,0.4,1.6,1.3),[-2.5,-3,0,5,5,6,W],[-2.2,-3.4,5,4.4,2.8,1.8,PK],[-1.6,-2.8,6.5,.7,.7,.3,'#7a3a40'],[.9,-2.8,6.5,.7,.7,.3,'#7a3a40'],[-2.6,.4,1.4,.7,.9,.7,'#1d1410'],[2,.4,1.4,.7,.9,.7,'#1d1410'],[-4.2,.8,-.2,2,1,1.8,'#e8e0c8'],[2.3,.8,-.2,2,1,1.8,'#e8e0c8'],[-1.8,2,.6,.8,2,.8,'#efe6cc'],[1,2,.6,.8,2,.8,'#efe6cc'],[-2.4,1.8,.8,.8,.8,.8,'#d8d0b8'],[1.6,1.8,.8,.8,.8,.8,'#d8d0b8'],[-1.4,1.8,1.6,2.8,.7,2,K],[-1.5,-1.4,2.6,1,1.2,.6,K]]);
const WL='#f6f3ec',WS='#e6e1d4';
PANIM.sheep.body=voxGeo([[-4,4,-5.5,8,7,11,WL],[-4.4,5,-4.5,.8,5,9,WS],[3.6,5,-4.5,.8,5,9,WS],[-3.4,10.8,-5,6.8,1.2,10,'#ffffff'],[-3,3.6,-4.5,6,1,9,WS],[-2,11.6,-3,4,.8,6,'#ffffff'],[-3.6,6,-6.2,7.2,4,1,WL],[-1,7.6,5.4,2,2,1.2,WL],[-1.2,8.6,5.8,2.4,.6,.8,'#ffffff'],[-3,9,-6,2,2,1,'#ffffff'],[1,9,-6,2,2,1,'#ffffff']]);
PANIM.sheep.head=voxGeo([...EY(1.9,0.2,2.2,1.1),[-1.9,-2.6,.2,3.8,4.4,4.2,'#4a4040'],[-1.5,-2.6,3.8,3,2.4,1.4,'#3e3636'],[-.9,-1.2,5.2,.6,.5,.2,'#a07070'],[.3,-1.2,5.2,.6,.5,.2,'#a07070'],[-2,1.4,-.2,4,1.8,3,WL],[-3.4,.2,.8,1.6,.9,1.6,'#3a3030'],[1.8,.2,.8,1.6,.9,1.6,'#3a3030'],[-1.5,.4,3.4,.6,.6,.3,'#f0f0e0'],[.9,.4,3.4,.6,.6,.3,'#f0f0e0']]);
PANIM.sheep.leg={w:1.4,h:4.4,c:'#3e3636',hoof:'#262020',hips:[[-2.2,-3.2],[2.2,-3.2],[-2.2,3.8],[2.2,3.8]],amp:.55};
const PI='#eeaaa6',PD='#d88890';
PANIM.pig.body=voxGeo([[-3.6,3,-6,7.2,6,12,PI],[-3.8,4,-2,7.6,4.4,4.2,'#e8a0a0'],[-3,9,-5.4,6,.8,10.8,'#f4b8b4'],[-3.2,2.6,-3,6.4,1,8,'#d89a98'],[-.6,5.6,-6.8,1.2,1.2,1,PD],[-1.1,6.8,-7.4,1,1,.8,PD],[.1,7.6,-7.4,1,1,.8,PD],[-.5,8.6,-7,1,.8,.8,PD],[-2.4,3.6,5.4,1.4,1.6,.8,'#b87878'],[1,3.6,5.4,1.4,1.6,.8,'#b87878']]);
PANIM.pig.head=voxGeo([...EY(2.6,0.6,2.4,1.1),[-2.6,-2.6,0,5.2,5,4.4,PI],[-1.8,-2.4,4.2,3.6,2.8,1.6,PD],[-1.1,-1.6,5.7,.7,.7,.2,'#5a2a2a'],[.4,-1.6,5.7,.7,.7,.2,'#5a2a2a'],[-3.2,1.8,.4,1.8,2,1,PD],[1.4,1.8,.4,1.8,2,1,PD],[-3,2,.2,.6,1.4,.6,'#c07880'],[-1.8,.8,4,.7,.7,.3,'#1d1410'],[1.1,.8,4,.7,.7,.3,'#1d1410']]);
const CR='#d02a2a',BK='#e8a020';
PANIM.chicken.body=voxGeo([[-1.6,1.8,-2.2,3.2,3.2,4.4,'#ffffff'],[-1.2,3.4,-3,2.4,2.6,1.6,'#f4f4f0'],[-.6,4.6,-3.8,1.2,2.4,1,'#f0ece4'],[-.6,6,-4.4,1.2,1.6,1.2,'#e8e4dc'],[-1.9,2.4,-1.2,.5,2,2.8,'#e6e2d8'],[1.4,2.4,-1.2,.5,2,2.8,'#e6e2d8'],[-1.4,1.6,-1.6,2.8,.5,3.4,'#d8d4c8']]);
PANIM.chicken.head=voxGeo([...EY(1,1,0.5,0.9),[-1,-.4,-.4,2,2.4,2,'#ffffff'],[-.35,2,-.4,.7,1.2,1.8,CR],[-.3,-.6,1.2,.6,1.2,.5,CR],[-.5,.5,1.6,1,.7,1,BK],[-1.1,1,.6,.3,.4,.4,'#1d1410'],[.8,1,.6,.3,.4,.4,'#1d1410'],[-1.1,.2,.2,.2,.6,.6,'#f0f0f0']]);
/* ---- warianty umaszczenia zwierząt hodowlanych (kind_N); wybór po id zwierzęcia ---- */
function geoRecolor(geo,fn){const g=geo.clone(),c=g.attributes.color,a=c.array;for(let i=0;i<a.length;i+=3){const r=a[i],gg=a[i+1],b=a[i+2];const o=fn(r,gg,b);if(o){a[i]=o[0];a[i+1]=o[1];a[i+2]=o[2]}}c.needsUpdate=true;return g}
function geoMerge(A,B){const g=new THREE.BufferGeometry();for(const k of ['position','normal','color']){const x=A.attributes[k].array,y=B.attributes[k].array,z=new Float32Array(x.length+y.length);z.set(x);z.set(y,x.length);g.setAttribute(k,new THREE.Float32BufferAttribute(z,3))}g.computeBoundingSphere();return g}
const _hx=h=>{const c=new THREE.Color(h);return [c.r,c.g,c.b]};
const _lum=(r,g,b)=>r*.3+g*.55+b*.15,_neu=(r,g,b)=>Math.abs(r-g)<.07&&Math.abs(g-b)<.13;
function mkVariant(kind,id,fnB,fnH,legC,extraB,extraH){const A=PANIM[kind],V2={...A};V2.body=geoRecolor(A.body,fnB);if(extraB)V2.body=geoMerge(V2.body,extraB);V2.head=geoRecolor(A.head,fnH||fnB);if(extraH)V2.head=geoMerge(V2.head,extraH);if(A.leg&&legC)V2.leg={...A.leg,c:legC};PANIM[id]=V2}
{ /* krowy: 1 brązowa z jasnymi łatami, 2 czarna z białymi łatami, 3 rudo-biała, 4 płowa */
  const mk=(base,patch)=>{const B=_hx(base),P=_hx(patch);return (r,g,b)=>{if(!_neu(r,g,b))return null;const L=_lum(r,g,b);if(L>.7)return [B[0]*Math.min(1.1,L/.95),B[1]*Math.min(1.1,L/.95),B[2]*Math.min(1.1,L/.95)];if(L<.3)return P;return null}};
  mkVariant('cow','cow_1',mk('#b8723c','#f0e4cc'),null,'#8a5a30');mkVariant('cow','cow_2',mk('#2a2624','#f4f0e8'),null,'#2a2a2a');mkVariant('cow','cow_3',mk('#f4ece0','#b4502c'),null,'#e8dcc8');mkVariant('cow','cow_4',mk('#d0a064','#8a5a30'),null,'#c09058');
  /* owce: 1 czarna, 2 szaro-brązowa, 3 kremowa z brązową głową */
  const mkS=(wool,face)=>{const W=_hx(wool),F=_hx(face);return (r,g,b)=>{if(!_neu(r,g,b))return null;const L=_lum(r,g,b);if(L>.7)return [W[0]*Math.min(1.05,L/.95),W[1]*Math.min(1.05,L/.95),W[2]*Math.min(1.05,L/.95)];if(L<.5)return F;return null}};
  mkVariant('sheep','sheep_1',mkS('#3a3634','#241f1d'),null,'#241f1d');mkVariant('sheep','sheep_2',mkS('#b0a088','#5a4838'),null,'#5a4838');mkVariant('sheep','sheep_3',mkS('#f2e8d4','#8a6a48'),null,'#8a6a48');
  /* świnie: 1 czarna, 2 rudo-brązowa, 3 dzika szaro-brązowa */
  const mkP=(base)=>{const B=_hx(base);return (r,g,b)=>{const L=_lum(r,g,b);if(r>g+.06&&L>.5){const k=L/.8;return [B[0]*k,B[1]*k,B[2]*k]}return null}};
  mkVariant('pig','pig_1',mkP('#3c3638'),null,'#2a2426');mkVariant('pig','pig_2',mkP('#a66a46'),null,'#7a4630');mkVariant('pig','pig_3',mkP('#6a5e50'),null,'#4a4036');
  /* kury: 1 brązowa, 2 czarna z zielonym połyskiem, 3 kogut z kolorowym ogonem */
  const mkC=(base)=>{const B=_hx(base);return (r,g,b)=>{if(!_neu(r,g,b))return null;const L=_lum(r,g,b);if(L>.75){const k=L/.95;return [B[0]*k,B[1]*k,B[2]*k]}return null}};
  mkVariant('chicken','chicken_1',mkC('#a8683a'),null,null);mkVariant('chicken','chicken_2',mkC('#34302e'),null,null);
  const RB=_hx('#c0662a');mkVariant('chicken','chicken_3',(r,g,b)=>{if(!_neu(r,g,b))return null;const L=_lum(r,g,b);if(L>.75){const k=L/.95;return [RB[0]*k,RB[1]*k,RB[2]*k]}return null},null,null,
    voxGeo([[-.4,4.4,-4.6,.8,3.2,1,'#1f3a2e'],[-.4,6.4,-5.4,.8,2.6,1,'#2e5a44'],[-.4,8,-5.8,.8,1.8,.8,'#b8402a'],[-.7,3.6,-4.2,.4,2.4,1,'#c8742a'],[.3,3.6,-4.2,.4,2.4,1,'#c8742a']],0),
    voxGeo([[-.4,2.6,-.2,.8,1.8,2.4,'#d02a2a'],[-.3,-1.2,1,.6,1.8,.5,'#d02a2a']],0));
}
const VARN={cow:4,sheep:3,pig:3,chicken:3},VARW={cow:[0,1,2,3,4,0],sheep:[0,1,2,3,0,0],pig:[0,1,2,3,0,0],chicken:[0,0,1,2,0,3]};
const varKind=a=>{const w=VARW[a.kind];if(!w)return a.kind;const v=a.vr!=null?a.vr:w[Math.abs(a.id|0)%w.length];return v?a.kind+'_'+v:a.kind};
const DG='#8a5a30',DL='#c9a070';
PANIM.dog.body=voxGeo([[-1.8,3,-4,3.6,3.4,8,DG],[-1.9,4.6,-3.4,3.8,1.2,5,'#7a4a28'],[-1.2,3.4,1,2.4,2.2,2.8,DL],[-1,2.8,-3,2,.8,6,DL],[-.5,5.8,-5.6,1,.9,3,DG],[-.5,6.4,-6.8,1,1.2,1.4,DL]]);
PANIM.dog.leg={w:1.2,h:3.1,c:'#7a4a28',hoof:DL,hips:[[-1,-2.6],[1,-2.6],[-1,3],[1,3]],amp:.7};
const FX='#d46a24',FW='#f4efe4';
PANIM.fox.body=voxGeo([[-1.6,2.6,-3.6,3.2,3,7.2,FX],[-1.2,2.6,-1,2.4,1,4,FW],[-1.2,3,-6,2.4,2.4,3,FX],[-1.6,2.8,-8.6,3.2,2.8,3.4,FX],[-1,3.2,-10.4,2,2,1.8,FW],[-.8,5.8,-3.4,1.6,.8,6,'#c05a1c']]);
PANIM.rabbit.body=voxGeo([[-1.4,0,-2,2.8,2.8,4,'#8a7a62'],[-1.2,1.8,-1.6,2.4,.8,3,'#9a8a72'],[-.8,1.2,-3,1.6,1.6,1.2,'#fbf8f0'],[-1.6,0,.8,1.2,1.2,2,'#7a6a52'],[.4,0,.8,1.2,1.2,2,'#7a6a52']]);
PANIM.rabbit.head=voxGeo([...EY(1.1,1.1,1.2,0.8),[-1.1,0,0,2.2,2.2,2.4,'#8a7a62'],[-.5,.2,2.2,1,.8,.4,'#e8c0c0'],[-.9,2.2,.4,.6,3,.6,'#8a7a62'],[.3,2.2,.4,.6,3,.6,'#8a7a62'],[-.7,2.4,.5,.2,2.4,.3,'#e8b8b8'],[.5,2.4,.5,.2,2.4,.3,'#e8b8b8'],[-1,1.2,1.9,.4,.4,.3,'#1d1410'],[.6,1.2,1.9,.4,.4,.3,'#1d1410']]);
PANIM.duck.body=voxGeo([[-1.5,0,-2.4,3,2.4,4.8,'#8a6a44'],[-1.2,1.8,-2.2,2.4,.8,4,'#9a7a54'],[-1.7,.8,-1.6,.4,1.4,3.2,'#6a5238'],[1.3,.8,-1.6,.4,1.4,3.2,'#6a5238'],[-.8,1.4,-3.3,1.6,1.6,1,'#4a5a7a'],[-1.5,0,2,3,1,.6,'#f4f4f4']]);
PANIM.duck.head=voxGeo([...EY(1,1.1,0.8,0.7),[-1,0,0,2,2.2,2,'#2f7a4a'],[-.7,.4,1.9,1.4,.7,1.4,'#e8a020'],[-1,0,-.6,2,.6,.6,'#f4f4f4'],[-1.1,1.2,.8,.3,.3,.3,'#1d1410'],[.8,1.2,.8,.3,.3,.3,'#1d1410']]);
PANIM.cat.head=voxGeo([[-1.4,-1,0,2.8,2.6,2.4,'#d88a3a'],[-1.3,1.6,.4,.9,1.2,.9,'#d88a3a'],[.4,1.6,.4,.9,1.2,.9,'#d88a3a'],[-.6,-.6,2.4,1.2,.8,.4,'#f4efe4'],[-.3,.2,2.4,.6,.5,.3,'#d88aa0'],...EY(1.4,.4,1.1,.8)]);
PANIM.deer.head=voxGeo([[-1.2,0,-.4,2.4,5,2.4,'#9a6a3a'],[-1.6,4.4,0,3.2,2.6,4.4,'#9a6a3a'],[-1,4.4,4,2,1.6,1.2,'#5a3a20'],[-1.4,7,.6,.6,4,.6,'#d8c8a8'],[.8,7,.6,.6,4,.6,'#d8c8a8'],[-2.8,9.6,.6,2,.6,.6,'#d8c8a8'],[1.2,9.6,.6,2,.6,.6,'#d8c8a8'],[-1.4,10,1.6,.6,1.6,.6,'#d8c8a8'],[.8,10,1.6,.6,1.6,.6,'#d8c8a8'],...EY(1.6,5.6,2.4,.9)]);
PANIM.dog.head=voxGeo([[-1.8,-1.4,0,3.6,3.4,3.4,'#8a5a30'],[-1.2,-1.4,3.2,2.4,1.8,2,'#c9a070'],[-.5,-.2,5.1,1,.8,.4,'#1d1410'],[-2.4,-.4,.8,.8,2.6,1.6,'#5a3a20'],[1.6,-.4,.8,.8,2.6,1.6,'#5a3a20'],...EY(1.8,.7,1.9,1)]);
PANIM.fox.head=voxGeo([[-1.6,-1,0,3.2,2.8,2.8,'#d06a2a'],[-.8,-1,2.6,1.6,1.4,1.8,'#f4efe4'],[-.4,-.4,4.3,.8,.6,.4,'#1d1410'],[-1.5,1.8,.6,1,1.4,.8,'#d06a2a'],[.5,1.8,.6,1,1.4,.8,'#d06a2a'],...EY(1.6,.5,1.5,.8)]);
PANIM.__VARW=VARW;PANIM.__rec=geoRecolor;})();

/* wolf, boar, crane, owl, bat – dodawane do ANIM później */
Object.assign(PANIM,{
  wolf:{body:voxGeo([[-2,4.6,-5.4,4,4.2,10.4,'#74747a'],[-1.6,4.6,-3,3.2,1.2,6,'#a8a8ac'],[-1.2,8.4,-4.6,2.4,.8,8,'#5a5a60'],[-.8,6,-9.6,1.6,1.8,4.6,'#6a6a70'],[-.6,5.8,-11,1.2,1.4,1.8,'#c8c8cc']]),
    head:voxGeo([[-1.8,-1.2,0,3.6,3.4,3.2,'#74747a'],[-1.1,-1.2,3,2.2,1.8,2.4,'#8a8a90'],[-.5,-.6,5.2,1,.8,.5,'#1d1410'],[-1.7,2,.4,1,1.6,.9,'#5a5a60'],[.7,2,.4,1,1.6,.9,'#5a5a60'],[-1.4,.6,2.8,.6,.5,.2,'#e8c040'],[.8,.6,2.8,.6,.5,.2,'#e8c040']]),neck:[0,7.4,4],
    leg:{w:1.2,h:4.6,c:'#5a5a60',hips:[[-1.2,-4.2],[1.2,-4.2],[-1.2,3.8],[1.2,3.8]],amp:.6},gait:9},
  boar:{body:voxGeo([[-3,3.6,-6,6,5.4,12,'#4a3a2e'],[-.8,9,-5.6,1.6,1,11,'#2a2018'],[-2.6,3.8,2,5.2,4.6,4,'#3e3026'],[-.5,6.4,-7,1,1.4,1.2,'#2a2018']]),
    head:voxGeo([[-2.4,-2.2,0,4.8,4.6,4.4,'#4a3a2e'],[-1.5,-1.8,4.2,3,2.4,1.8,'#6a5040'],[-1.8,-1.4,5,.4,1.4,.4,'#f0ead0'],[1.4,-1.4,5,.4,1.4,.4,'#f0ead0'],[-1.6,.8,3.6,.5,.5,.3,'#1d1410'],[1.1,.8,3.6,.5,.5,.3,'#1d1410'],[-2.6,2,.6,1.4,1.6,.8,'#3a2c22'],[1.2,2,.6,1.4,1.6,.8,'#3a2c22']]),neck:[0,6.8,5.6],
    leg:{w:1.5,h:3.6,c:'#3a2c22',hoof:'#1a1410',hips:[[-2,-4.4],[2,-4.4],[-2,4],[2,4]],amp:.6},gait:8},
  crane:{body:voxGeo([[-1.4,9,-3,2.8,3.4,6.6,'#c8ccd0'],[-1,9.6,-5,2,1.4,2.6,'#2a2a30'],[-1.6,9.6,-2,.4,2.4,4,'#aeb2b8'],[1.2,9.6,-2,.4,2.4,4,'#aeb2b8']]),
    head:voxGeo([[-.4,0,-.4,.8,6,.8,'#e8e8ec'],[-.6,6,-.4,1.2,1.2,2,'#e8e8ec'],[-.4,7,0,.8,.3,.8,'#d03030'],[-.3,6.3,1.6,.6,.6,3,'#c0a860']]),neck:[0,12,2.6],
    leg:{w:.6,h:9,c:'#3a3a3a',hips:[[-.8,0],[.8,0]],amp:.45},gait:7},
  owl:{body:voxGeo([[-1.4,-1.6,-1.4,2.8,3.4,2.8,'#8a6a44'],[-1,-1.4,1.3,2,2.6,.3,'#d8c8a0'],[-1.5,1.8,-1.2,3,2.6,2.6,'#8a6a44'],[-1.1,2.6,1.3,.8,.8,.3,'#f0c030'],[.3,2.6,1.3,.8,.8,.3,'#f0c030'],[-.3,2,1.4,.6,.6,.4,'#c89a30'],[-1,-1.6,-3,2,.6,2,'#6a4a2c']]),
    head:voxGeo([[-5,.4,-.8,10,.3,2.6,'#6a4a2c'],[-5,.4,-.8,1.6,.35,2.6,'#4a3420'],[3.4,.4,-.8,1.6,.35,2.6,'#4a3420']]),neck:[0,0,0],wing:1},
  bat:{body:voxGeo([[-.5,-.5,-.8,1,1,1.6,'#2a2228'],[-.5,.4,.6,.35,.6,.3,'#2a2228'],[.15,.4,.6,.35,.6,.3,'#2a2228']]),
    head:voxGeo([[-3.2,0,-.6,6.4,.2,1.4,'#1e1a22']]),neck:[0,0,0],wing:1}
});

const HARNGEO=voxGeo([[-3,8.4,6.55,6,5,1.5,'#6a3a1c'],[-3.3,8.4,5.15,.8,5.4,1.9,'#6a3a1c'],[2.5,8.4,5.15,.8,5.4,1.9,'#6a3a1c'],[-3,13.2,5.25,6,.8,2.1,'#6a3a1c'],[-3.4,13,5.85,.6,2.2,.6,'#c9a24a'],[2.8,13,5.85,.6,2.2,.6,'#c9a24a'],[-3.1,13.9,6.05,6.2,.6,1.2,'#a02a2a'],
  [-2.7,13.3,-.8,5.4,.7,3.4,'#5a3a22'],[-2,14,.2,.8,1,.8,'#c9a24a'],[1.2,14,.2,.8,1,.8,'#c9a24a'],[-2.95,7.8,-2.2,.5,5,1.2,'#4a2a14'],[2.45,7.8,-2.2,.5,5,1.2,'#4a2a14'],[-2.7,10,-6.45,5.4,.5,.8,'#4a2a14'],
  [-2.9,10.4,-5.25,.5,.5,11.9,'#3a2412'],[2.4,10.4,-5.25,.5,.5,11.9,'#3a2412'],[-.3,13.3,-5.85,.6,.4,7.6,'#4a2a14']],0);
const HORSE=(()=>{const BR='#6a3a22',BT='#835230',BD='#4a2a16',MN='#2e1a0e',WH='#e8e2d6',GR='#8c9094';
  const body=[[-2.5,7.4,-6.25,5,5.4,14.5,BR],[-2.4,12.8,-6.05,4.8,.5,14.1,BT],[-2.3,7,-5.85,4.6,.5,13.7,BD],
    [-2.65,7.8,1.2,.5,4.8,1.5,'#3a2012'],[2.15,7.8,1.2,.5,4.8,1.5,'#3a2012'],[-2.72,9.6,.95,.4,1.8,1.8,GR],[2.32,9.6,.95,.4,1.8,1.8,GR],[-2.78,10.1,1.4,.3,.8,.8,'#3a2012'],[2.48,10.1,1.4,.3,.8,.8,'#3a2012'],
    [-1.3,10.2,-7.45,2.6,3.2,1.2,MN]];
  const H=[];
  for(let k=0;k<6;k++){const t=k/5,w=4.4-1.2*t,d=4.4-1.2*t,y=-1.8+k*.8,z=-2.6+k*1.0;H.push([-w/2,y,z,w,3.4,d,k<4?BR:'#704022']);H.push([-.7,y+2.6,z-.8,1.4,1.7,1.7,MN])}
  H.push([-1.7,3.4,3.2,3.4,3.2,3.2,'#6e3e22'],[-1.5,2.2,5.6,3,3.2,2.8,'#6a3a22'],[-1.4,1.2,8,2.8,3,2.6,'#5a3018'],[-1.45,.5,10.2,2.9,3,.9,GR],[-1.2,.9,6,2.4,1,3.6,'#4a2814'],
    [-1.5,6.5,3.1,.9,1.9,.9,'#5a3018'],[.6,6.5,3.1,.9,1.9,.9,'#5a3018'],[-1.4,8.2,3.7,.8,.5,.8,'#4a2814'],[.6,8.2,3.7,.8,.5,.8,'#4a2814'],[-.7,6.5,3.2,1.4,.9,1.6,MN],
    [-1.82,4.7,5,.2,1.1,1.3,'#9fb0bc'],[1.62,4.7,5,.2,1.1,1.3,'#9fb0bc'],[-1.86,4.8,5.5,.2,.7,.6,'#101010'],[1.66,4.8,5.5,.2,.7,.6,'#101010'],[-1.88,5.3,5.1,.16,.35,.4,'#ffffff'],[1.7,5.3,5.1,.16,.35,.4,'#ffffff'],
    [-1.4,.7,10.9,.5,.5,.2,'#202020'],[.9,.7,10.9,.5,.5,.2,'#202020']);
  const tail=[[-1.4,-2.6,-1.4,2.8,2.8,2.8,MN],[-1.5,-4.6,-1.9,3,2.3,3.2,MN],[-1.4,-6.4,-2.5,2.8,2.1,3.4,'#241408'],[-1.1,-7.6,-3,1.1,1.6,2.6,'#241408'],[.2,-8,-3.2,1.1,2,2.6,MN],[-.4,-7.8,-3.4,.7,1.6,2.2,'#241408'],[1.1,-7.4,-2.8,.5,1.2,2,MN]];
  return {body:voxGeo(body),head:voxGeo(H),
  legU:voxGeo([[-1.1,-3.8,-1.1,2.2,3.8,2.2,BR],[-1.15,-4.1,-1.15,2.3,.8,2.3,BD]]),legL:voxGeo([[-.95,-1.4,-.95,1.9,1.4,1.9,BD],[-1.05,-2.8,-1.05,2.1,1.5,2.1,WH],[-.95,-3.5,-.95,1.9,.8,1.9,BD],[-1,-4,-1,2,.5,2,GR]]),leg:voxGeo([[-.8,-7.6,-.8,1.6,7.6,1.6,BR],[-.9,-8,-.9,1.8,1.2,1.8,'#2a1a10']]),
  tail:voxGeo(tail)}})();
/* koń od zera: szyja to jeden prostopadłościan obrócony o 45°, głowa to klocki pochylone w dół */
function hrsNeckHead(){const BR='#6a3a22',MN='#2e1a0e',GR='#8c9094',BXM=(x,y,z,w,h,d,c)=>{const m=new THREE.Mesh(voxGeo([[x,y,z,w,h,d,c]],0),matV);m.castShadow=true;return m};
  const head=new THREE.Group(),nk=new THREE.Group();nk.rotation.x=.6;
  nk.add(BXM(-1.8,0,-1.9,3.6,6.4,3.8,BR));for(let i=0;i<5;i++){const dp=i%2?2.2:2.7;nk.add(BXM(-1,.2+i*1.2,-1.9-dp+.5,2,2.3,dp,i%3?MN:'#3c2414'))}nk.add(BXM(-1.1,5.9,-1.8,2.2,1.6,3,MN));head.add(nk);
  const hp=new THREE.Group();hp.position.set(0,5.28*V,3.61*V);hp.scale.setScalar(.88);head.add(hp);
  const hg=new THREE.Group();hg.rotation.x=.72;hp.add(hg);
  hg.add(BXM(-2,-1.9,-1.8,4,3.8,4.6,'#6e3e22'),BXM(-1.95,-2.5,-1.1,3.9,1.2,3.4,'#5e3320'),BXM(-2.1,-1.45,2.4,4.2,2.9,2.2,'#5a3018'),BXM(-2.05,-1.4,4.5,4.1,2.8,1.1,'#4e2a16'),BXM(-2.1,-1.55,5.5,4.2,2.9,1.1,'#6e5a4c'),BXM(-2.15,-1.65,6.5,4.3,3,.4,GR),BXM(-1.75,-1.8,2.4,3.5,.7,3.6,'#3a2010'),BXM(-1.6,.05,6.85,.7,.5,.25,'#101010'),BXM(.9,.05,6.85,.7,.5,.25,'#101010'),BXM(-1.8,-.9,6.9,3.6,.25,.2,'#2a1a10'),
    BXM(-2.15,.5,.5,.2,1.1,1.3,'#9fb0bc'),BXM(1.95,.5,.5,.2,1.1,1.3,'#9fb0bc'),BXM(-2.19,.6,.9,.2,.7,.6,'#101010'),BXM(1.99,.6,.9,.2,.7,.6,'#101010'),BXM(-2.2,1.05,.55,.16,.3,.4,'#ffffff'),BXM(2.04,1.05,.55,.16,.3,.4,'#ffffff'),
    BXM(-1.1,1.7,-2.4,2.2,1.5,4.6,MN),BXM(-.6,.9,.8,1.2,1.2,.9,MN),BXM(-.45,.1,1.2,.9,1.1,.8,'#3c2414'));
  for(const sx of [-1,1]){const e=new THREE.Group();e.position.set(sx*1.3*V,1.2*V,-1.3*V);e.rotation.x=.3;e.add(BXM(-.45,0,-.45,.9,2.1,.9,'#5a3018'),BXM(-.3,1.5,-.3,.6,.7,.6,'#2e1a0e'));hp.add(e)}
  hp.add(BXM(-1.1,.2,-2.8,2.2,3.4,4.4,MN),BXM(-1.1,1.9,-3.4,2.2,1.9,3.2,'#3c2414'),BXM(-1.1,2.6,-.4,2.2,1.5,2.6,MN));
  return head}
let HORSE_K=1;
function makeHorse(){const g=new THREE.Group(),root=new THREE.Group();root.scale.setScalar(HORSE_K);g.add(root);const body=new THREE.Mesh(HORSE.body,matV);body.castShadow=true;root.add(body);
  const head=hrsNeckHead();head.position.set(0,12.3*V,5.45*V);root.add(head);
  const legs=[[-1.8,7.6,6.7],[1.8,7.6,6.7],[-1.8,7.6,-4.7],[1.8,7.6,-4.7]].map(([x,y,z])=>{const lg=new THREE.Group();lg.position.set(x*V,y*V,z*V);
    const up=new THREE.Mesh(HORSE.legU,matV);up.castShadow=true;lg.add(up);
    const knee=new THREE.Group();knee.position.y=-3.8*V;lg.add(knee);
    const lo=new THREE.Mesh(HORSE.legL,matV);lo.castShadow=true;knee.add(lo);
    lo.onBeforeRender=()=>{const th=lg.rotation.x;knee.rotation.x=Math.min(1.25,Math.max(0,-th)*1.9+Math.max(0,th-.12)*.35)};
    root.add(lg);return lg});
  const tail=new THREE.Mesh(HORSE.tail,matV);tail.position.set(0,12.8*V,-5.95*V);root.add(tail);return {g,root,head,legs,tail}}
/* rycerz konny do turnieju: kapparka, zbroja, hełm z pióropuszem, tarcza, kopia (osobne bryły, by dało się ją złamać) */
const FISHK=[[['#9aa8b0','#c8d4d8'],['#7a8a90']],[['#d8802a','#f0a850'],['#b86018']],[['#6a8a5a','#a8c08a'],['#4a6a3a']]].map(([c,t])=>voxGeo([[-3,-.6,-.7,5,1.5,1.4,c[0]],[-3.4,-.4,-.5,1,1,1,c[1]],[2,-.5,-.3,1.4,1.1,.6,t[0]],[3.2,-.9,-.4,.8,2,.8,t[0]],[-1,.8,-.2,2,.7,.4,t[0]],[-2.8,.1,.75,.5,.5,.2,'#101010'],[-2.8,.1,-.95,.5,.5,.2,'#101010']],0));

// --- gatunki gry dorobione w stylu Pintara (format PANIM: body/head/neck/leg/gait) ---
{const EY=(hw,y,z,s)=>[[-hw-.25,y,z,.5,s,s,'#f6f2e8'],[hw-.25,y,z,.5,s,s,'#f6f2e8'],[-hw-.45,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010'],[hw+.05,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010']];
 const BR='#5a3a22',BD='#4a2e1a';
 PANIM.bear={body:voxGeo([[-3.4,4.6,-6,6.8,6.4,12,BR],[-2.8,10.6,1,5.6,1.6,4.4,BD],[-3,4.2,-5,6,1,10,BD],[-3.6,6,2.4,7.2,4.6,3,'#62422a'],[-.6,8,-6.8,1.2,1.2,1,BD],[-3.5,8.2,-5,7,1.2,8,'#6a4a30']]),
  head:voxGeo([...EY(2.6,.8,2.6,1.1),[-2.6,-2.4,0,5.2,4.6,4.4,BR],[-1.4,-2.4,4.2,2.8,2.2,2,'#8a6a4a'],[-.6,-1,6.1,1.2,.8,.4,'#1a1a1a'],[-2.8,1.8,.6,1.4,1.4,1,BD],[1.4,1.8,.6,1.4,1.4,1,BD],[-2,2.2,1.4,4,.6,2,'#62422a']]),neck:[0,9,5.6],
  leg:{w:2.2,h:4.6,c:BD,hoof:'#2a1a10',hips:[[-2.4,-4.4],[2.4,-4.4],[-2.4,4.2],[2.4,4.2]],amp:.5},gait:6};
 const CM='#c9a46a',CD='#b8925a';
 PANIM.camel={body:voxGeo([[-2.6,10,-6,5.2,4.6,12,CM],[-2,14.4,-3.4,4,2.8,3.6,'#c49c60'],[-2,14.4,1.2,4,2.4,3.2,'#c49c60'],[-1.4,17,-2.6,2.8,.8,2,'#b8925a'],[-2.4,9.8,-5,4.8,.8,10,CD],[-.5,10.6,-6.8,1,4,1,CD],[-.6,7.6,-7,1.2,3,1.2,'#8a6a3a']]),
  head:voxGeo([...EY(1.4,7.2,2.4,.8),[-1.1,0,-.6,2.2,7.4,2.4,CM],[-1.5,6.2,-.2,3,2.6,4.6,CM],[-1.2,6,4.2,2.4,1.8,1.8,CD],[-.6,7,5.9,1.2,.5,.3,'#3a2a1a'],[-1.6,8.6,.2,.8,1,.8,CD],[.8,8.6,.2,.8,1,.8,CD],[-1.2,-.4,1.6,2.4,4,.8,'#d4b078']]),neck:[0,12.2,5.6],
  leg:{w:1.3,h:10,c:CD,hoof:'#5a4a3a',hips:[[-1.6,-4.4],[1.6,-4.4],[-1.6,4.4],[1.6,4.4]],amp:.42},gait:4};
 PANIM.penguin={body:voxGeo([[-1.8,1.2,-1.6,3.6,5.6,3.2,'#1e2228'],[-1.3,1.4,1.5,2.6,4.6,.5,'#f2f2ee'],[-2.3,2.6,-.8,.5,3.2,1.6,'#1e2228'],[1.8,2.6,-.8,.5,3.2,1.6,'#1e2228'],[-1,1.2,-2.2,2,.8,1,'#1e2228'],[-1.4,5.6,1.2,2.8,1,.5,'#e8c040']]),
  head:voxGeo([...EY(1.4,.9,1.1,.7),[-1.4,0,-1.2,2.8,2.6,2.6,'#1e2228'],[-.4,.5,1.4,.8,.6,1.4,'#e8a03a'],[-1.1,-.2,1.3,2.2,1,.3,'#f2f2ee']]),neck:[0,6.6,.2],
  leg:{w:.9,h:1.2,c:'#e8a03a',hips:[[-.8,0],[.8,0]],amp:.45},gait:12};
 PANIM.reindeer={...PANIM.deer,body:PANIM.__rec(PANIM.deer.body,(r,g,b)=>r>g+.05&&r>.45?[r*.8,g*.86,b*.95]:null),head:voxGeo([[-1.2,0,-.4,2.4,5,2.4,'#8a7a68'],[-1.6,4.4,0,3.2,2.6,4.4,'#8a7a68'],[-1,4.4,4,2,1.6,1.2,'#5a4a3a'],[-.5,5.2,5.1,1,.5,.3,'#2a2420'],[-1.8,-.2,1.6,3.6,3,1.2,'#efe9df'],
   [-1.4,7,.6,.6,4.6,.6,'#cfc2a8'],[.8,7,.6,.6,4.6,.6,'#cfc2a8'],[-3.6,10.2,.4,2.8,.6,.6,'#cfc2a8'],[1.4,10.2,.4,2.8,.6,.6,'#cfc2a8'],[-3.8,10.8,.4,.6,2.4,.6,'#cfc2a8'],[3.2,10.8,.4,.6,2.4,.6,'#cfc2a8'],[-1.6,10.6,1.8,.6,2,.6,'#cfc2a8'],[1,10.6,1.8,.6,2,.6,'#cfc2a8'],[-.8,7.2,2.2,.6,1.6,1.8,'#cfc2a8'],...EY(1.6,5.6,2.4,.9)]),
  leg:{...PANIM.deer.leg,c:'#6a5a48'}};
 const GT='#d8d0c0';
 PANIM.goat={body:voxGeo([[-2.4,5,-4.4,4.8,4.6,8.8,GT],[-2,9.4,-4,4,.8,8,'#e8e2d6'],[-2.6,5.4,-2,5.2,3.6,4,'#cfc6b4'],[-.5,8.4,-5.2,1,1.6,.8,GT]]),
  head:voxGeo([...EY(1.5,.6,1.8,.8),[-1.5,-2,0,3,3.6,3.6,GT],[-1.1,-2.2,3.4,2.2,1.8,1.4,'#c8c0b0'],[-.5,-1.4,4.7,1,.5,.3,'#3a3330'],[-.5,-3.6,2.6,1,2,1,'#f2eee6'],[-1.4,1.6,-.2,.7,2.4,.7,'#8a8070'],[.7,1.6,-.2,.7,2.4,.7,'#8a8070'],[-1.4,3.6,-1.4,.7,.7,1.6,'#8a8070'],[.7,3.6,-1.4,.7,.7,1.6,'#8a8070'],[-2.6,.2,.6,1.2,.7,1.4,GT],[1.4,.2,.6,1.2,.7,1.4,GT]]),neck:[0,8.4,4.2],
  leg:{w:1.1,h:5,c:'#b8b0a0',hoof:'#3a3330',hips:[[-1.6,-3.2],[1.6,-3.2],[-1.6,3.2],[1.6,3.2]],amp:.55},gait:8};
 PANIM.turtle={body:voxGeo([[-3.2,1.2,-3.6,6.4,2.6,7.2,'#4a6a3a'],[-2.6,3.8,-3,5.2,1.2,6,'#5a7a42'],[-1.4,5,-1.6,2.8,.6,3.2,'#6a8a4a'],[-3.6,.8,-4,7.2,.6,8,'#8a7a4a'],[-.5,1.4,-4.6,1,.8,1,'#8a9a5a']]),
  head:voxGeo([...EY(1,.6,1.2,.6),[-1,-.4,0,2,1.8,2.4,'#8a9a5a']]),neck:[0,2,3.6],
  leg:{w:1.4,h:1.4,c:'#8a9a5a',hips:[[-2.6,-2.6],[2.6,-2.6],[-2.6,2.6],[2.6,2.6]],amp:.3},gait:4};
 PANIM.lizard={body:voxGeo([[-1.8,1.4,-4,3.6,1.8,8,'#6a8a3a'],[-1.2,3.2,-3.6,2.4,.4,7,'#8aa84a'],[-.8,1.6,-8.6,1.6,1.2,4.6,'#5a7a32'],[-.4,1.7,-11,.8,.8,2.4,'#5a7a32'],[-1.4,1.2,-3,2.8,.4,6,'#c8c070']]),
  head:voxGeo([...EY(1.3,.8,1.2,.6),[-1.3,-.6,0,2.6,1.6,3.2,'#6a8a3a'],[-.9,-.7,3,1.8,1,1,'#5a7a32']]),neck:[0,2.4,4],
  leg:{w:.9,h:1.4,c:'#5a7a32',hips:[[-2.2,-2.6],[2.2,-2.6],[-2.2,2.6],[2.2,2.6]],amp:.6},gait:12};
}
const PMAP={krowa:'cow',owca:'sheep',swinia:'pig',kura:'chicken',pies:'dog',kot:'cat',lis:'fox',krolik:'rabbit',kaczka:'duck',jelen:'deer',wilk:'wolf',dzik:'boar',niedzwiedz:'bear',wielblad:'camel',pingwin:'penguin',renifer:'reindeer',koza:'goat',zolw:'turtle',jaszczurka:'lizard'};
const PSC={wilk:2.5,dzik:2.4,niedzwiedz:2.5,kura:2.3,kaczka:2.3,krolik:2.4,kot:2.3,lis:2.3,pingwin:2.2};const PSC0=2.1;
const legCache={};
// ===== nowe zwierzęta na bazie dopracowanych modeli Pintara: przemalowanie (paleta + wzory) i własne dodatki =====
const PVC=new Map();
function pvRecolor(key,geo,pal,fn,all){const k=key+'|'+geo.uuid;if(PVC.has(k))return PVC.get(k);const g=geo.clone(),c=g.attributes.color;if(!c){PVC.set(k,geo);return geo}
  const a=c.array=new Float32Array(c.array),it=c.itemSize,P=g.attributes.position.array,H=pal.map(h=>{const q=new THREE.Color(h);return[q.r,q.g,q.b]});const nm=geo.attributes.color.array instanceof Uint8Array?255:1;
  g.setAttribute('color',new THREE.BufferAttribute(a,it));for(let i=0;i<a.length;i++)a[i]/=nm;
  for(let v=0;v<a.length/it;v++){const i=v*it,r=a[i],gg=a[i+1],b=a[i+2],l=r*.3+gg*.55+b*.15,mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);if(l<0.1||(!all&&mx-mn<0.07&&l>0.8))continue;
    const x=P[v*3]*16,y=P[v*3+1]*16,z=P[v*3+2]*16;let o=fn?fn(x,y,z,l,r,gg,b):null;if(o){a[i]=o[0];a[i+1]=o[1];a[i+2]=o[2];continue}
    const t=Math.min(1,Math.max(0,(l-0.12)/0.7)),A=t<0.5?H[0]:H[1],B=t<0.5?H[1]:H[2],q=t<0.5?t*2:(t-0.5)*2;a[i]=A[0]+(B[0]-A[0])*q;a[i+1]=A[1]+(B[1]-A[1])*q;a[i+2]=A[2]+(B[2]-A[2])*q}
  PVC.set(k,g);return g}
const hx3=h=>{const q=new THREE.Color(h);return[q.r,q.g,q.b]};
const PVAR={
 wilk_mrozny:{b:'wolf',sc:2.7,pal:['#7d93ab','#d6e2ee','#ffffff'],hg:[[-1.4,1.6,4.4,.8,.5,.3,'#5ac8ff'],[.6,1.6,4.4,.8,.5,.3,'#5ac8ff']],bx:[[-.4,10,-6,.8,.5,9,'#bff4ff']],glow:1},
 hiena:{b:'wolf',sc:2.3,pal:['#4a3a26','#b0925e','#dccca2'],fn:(x,y,z,l)=>l>0.25&&(Math.sin(x*2.1+z*1.3)+Math.sin(y*1.9-z*2.2))>1.15?hx3('#4a3820'):null,bx:[[-.5,9.6,-4,1,1.4,9,'#3a2a18']]},
 lis_og:{b:'fox',sc:2.4,pal:['#7a240c','#e8682a','#ffd890'],bx:[[-.7,5.2,-12.6,1.4,1.4,1.6,'#ffd34d'],[-.4,6.2,-13.2,.8,1,1,'#fff2a0']],glow:1},
 szronolis:{b:'fox',sc:2.3,pal:['#92a8c2','#e6f0fa','#ffffff'],bx:[[-.7,5.2,-12.6,1.4,1.4,1.6,'#bff4ff']],glow:1},
 jelen_ks:{b:'deer',sc:2.15,pal:['#4c6a98','#94b0d6','#eaf2fc'],fn:(x,y,z,l,r,g,b,part)=>null,head:(x,y,z,l)=>l>0.6&&y>5?hx3('#a8f0ff'):null,bx:[[1.2,13.2,-2,.6,.2,.6,'#d8f8ff'],[-1.6,13.2,1,.6,.2,.6,'#d8f8ff'],[.4,13.2,3.5,.6,.2,.6,'#d8f8ff']],glow:1},
 los:{b:'deer',sc:2.7,pal:['#24170e','#4a3424','#77583c'],head:(x,y,z,l)=>l>0.6&&y>5?hx3('#cfc0a0'):null,hx:[[1.4,9.2,-.8,4.4,.8,3.4,'#d6c8a8'],[-5.8,9.2,-.8,4.4,.8,3.4,'#d6c8a8'],[5.0,9.6,-.8,.9,1.8,.9,'#c8b898'],[5.0,9.6,1.6,.9,1.6,.9,'#c8b898'],[-5.9,9.6,-.8,.9,1.8,.9,'#c8b898'],[-5.9,9.6,1.6,.9,1.6,.9,'#c8b898'],[3.2,9.8,2.4,.8,1.4,.8,'#c8b898'],[-4,9.8,2.4,.8,1.4,.8,'#c8b898'],[-.8,-1.8,3,1.6,2.4,1.4,'#2a1a10']]},
 kapibara:{b:'pig',sc:1.8,pal:['#3e2a1a','#7e5a3a','#a07e56']},
 grzybolak:{b:'pig',sc:2.0,pal:['#8a7a66','#cdbca0','#ece0c8'],bx:[[-5,10.2,-6.4,10,2.4,11,'#b8302e'],[-3.8,12.6,-5,7.6,1.6,8.4,'#c83a36'],[-2,14.2,-3,4,.8,4.4,'#c83a36'],[-1,9.4,-1,2,1.2,2,'#e8dcc8']],gx:[[2,12.7,1,1.2,.3,1.2,'#f4f0e0'],[-3,12.7,-3,1.2,.3,1.2,'#f4f0e0'],[0,14.3,-1.2,1,.3,1,'#f4f0e0'],[-4.5,12.4,1.5,1,.3,1,'#f4f0e0'],[3,11.8,-4,1,.3,1,'#f4f0e0']]},
 szablozab:{b:'cat',sc:5.2,pal:['#7a4214','#d8a050','#f4ead4'],fn:(x,y,z,l)=>l>0.3&&l<0.75&&Math.sin(z*2.4+Math.sin(y*1.3)*0.8)>0.55?hx3('#2e1c10'):null,hx:[[-.8,-2.2,2.2,.42,1.5,.42,'#f2ead8'],[.38,-2.2,2.2,.42,1.5,.42,'#f2ead8']]},
 mantikora:{b:'cat',sc:5.0,pal:['#6a2c12','#b8683a','#e0a878'],hx:[[-2.6,-1.6,-1.2,5.2,5.2,1.6,'#5a2414'],[-2.2,3.2,-.8,4.4,1,1.2,'#4a1c10']],bx:[[-.4,7,-7.6,.8,4.5,.8,'#3a1a10'],[-.4,11,-7.2,.8,.8,3.2,'#3a1a10'],[-.25,10.4,-4.2,.5,1,.5,'#e8d040'],[1.3,6.6,-2,6,.4,4.4,'#8a3a2a'],[-7.3,6.6,-2,6,.4,4.4,'#8a3a2a'],[5.8,6.9,-2.6,3.4,.3,3.2,'#6a2a1a'],[-9.2,6.9,-2.6,3.4,.3,3.2,'#6a2a1a']]},
 krokodyl:{b:'lizard',sc:4.4,pal:['#24321a','#46603a','#b8b484'],bx:(()=>{const r=[];for(let k=0;k<9;k++)r.push([-.35,3.6,-10+k*1.5,.7,.5,.8,'#2c3e20']);return r})(),hx:[[-1.4,-.9,3.2,.3,.4,.3,'#f2ead8'],[1.1,-.9,3.2,.3,.4,.3,'#f2ead8'],[-1.4,-.9,1.8,.3,.4,.3,'#f2ead8'],[1.1,-.9,1.8,.3,.4,.3,'#f2ead8']]},
 zolw_kr:{b:'turtle',sc:2.7,pal:['#3a4656','#5e6e82','#9aaabc'],gx:[[-.6,5.6,-.6,1.2,3.4,1.2,'#9fe8ff'],[1.6,5.2,1,1,2.4,1,'#c8a8ff'],[-2.4,5.0,-1.6,.9,2.2,.9,'#9fe8ff'],[1.4,5.0,-2.6,.8,1.8,.8,'#a8ffd8'],[-2,5.0,1.8,.9,2,.9,'#c8a8ff'],[-.3,9,-.3,.6,.8,.6,'#e8fbff']],glow:1},
 strus:{b:'crane',sc:2.9,all:1,pal:['#1e1a18','#3a3430','#f0e8e0'],fn:(x,y,z,l)=>y<8.6?hx3(l>0.4?'#d8b0a0':'#b89080'):hx3(l>0.6?'#2e2824':'#1c1816'),head:(x,y,z,l)=>l<0.2?null:hx3(y>5.5&&z>1.5?'#e8c8a0':l>0.5?'#f0d0c0':'#d8b8a8'),bx:[[-1.8,10.6,-5.6,3.6,2,2.4,'#f4f0ea'],[-1.9,10,-2,.5,2.2,3.6,'#f4f0ea'],[1.4,10,-2,.5,2.2,3.6,'#f4f0ea']]},
 zyrafa:{b:'camel',sc:2.5,bcut:(x,y,z)=>y>14.7,pal:['#8a5a24','#e0b060','#f6e2b0'],all:1,fn:(x,y,z,l)=>l<0.13?null:(Math.sin(x*1.3+z*0.8+1)*Math.sin(y*1.2-z*0.9+x*0.5))>0.3?hx3('#8a4a1e'):hx3(l>0.72?'#f2dca6':'#e2b464'),head:(x,y,z,l)=>l<0.13?null:y<6.8&&(Math.sin(x*1.6+z*1.1)*Math.sin(y*1.5-z*1.2))>0.3?hx3('#8a4a1e'):hx3(l>0.72?'#f2dca6':'#e2b464'),
  bx:(()=>{const r=[[-2.6,14.5,-6,5.2,.3,12,'#e2b464'],[-.5,14.8,-5,1,.5,9,'#6a3a1a']];let q=7;const rn=()=>(q=(q*9301+49297)%233280)/233280;for(let zz=-5.6;zz<5.4;zz+=2.1)for(let yy=10.3;yy<14.2;yy+=1.9){const oz=rn()*0.4,oy=rn()*0.3,w=Math.min(1.3+rn()*0.5,5.9-(zz+oz)-0.3),h=Math.min(1.1+rn()*0.5,14.5-(yy+oy)-0.3);if(w<0.5||h<0.5)continue;r.push([2.6,yy+oy,zz+oz,.08,h,w,'#8a4a1e'],[-2.68,yy+oy,zz+oz,.08,h,w,'#8a4a1e'])}for(let zz=-5.4;zz<4.2;zz+=2.2)for(const xx of [-2.2,0.1]){const w=1.4+rn()*0.4;r.push([xx,14.8,zz+rn()*0.4,w,.06,1.4,'#8a4a1e'])}return r})(),hx:[[-1.2,9.4,1.2,.6,1.4,.6,'#d8a858'],[.6,9.4,1.2,.6,1.4,.6,'#d8a858'],[-1.3,10.7,1.1,.8,.5,.8,'#5a3a1a'],[.5,10.7,1.1,.8,.5,.8,'#5a3a1a'],[-.5,2,-.9,1,7,.8,'#6a3a1a']]},
 alpaka:{b:'goat',sc:2.2,pal:['#b8a888','#efe4cc','#fffaf0'],cut:(x,y,z)=>y>3.4,hx:[[-2,3.2,.4,4,1.6,3.4,'#fffaf0']],bx:[[-3,9.8,-5,6,1.2,9.6,'#fffaf0']]}};
for(const t in PVAR){PMAP[t]=PVAR[t].b;PSC[t]=PVAR[t].sc}
function pvCut(key,geo,cut){const k=key+'|cut|'+geo.uuid;if(PVC.has(k))return PVC.get(k);const g=geo.index?geo.toNonIndexed():geo.clone(),P=g.attributes.position.array,keep=[];const n=P.length/9;
  for(let f=0;f<n;f++){const o=f*9,cy=(P[o+1]+P[o+4]+P[o+7])/3*16;if(!cut(0,cy,0))keep.push(f)}const out=new THREE.BufferGeometry();for(const nm in g.attributes){const at=g.attributes[nm],is=at.itemSize,src=at.array,dst=new src.constructor(keep.length*3*is);keep.forEach((f,j)=>{for(let q=0;q<3*is;q++)dst[j*3*is+q]=src[f*3*is+q]});out.setAttribute(nm,new THREE.BufferAttribute(dst,is,at.normalized))}
  PVC.set(k,out);return out}
let panimSeq=0;
function makePanim(t,elite){
  const base=PMAP[t],id=panimSeq++,w=PANIM.__VARW[base],kind=w&&w[id%w.length]?base+'_'+w[id%w.length]:base,A=PANIM[kind]||PANIM[base];
  const d=EDEF[t],mat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});seasonPatch(mat,false);crTex(mat,CRK[base]);
  const PV=PVAR[t],RB=PV?pvRecolor(t+'b',PV.bcut?pvCut(t+'B',A.body,PV.bcut):A.body,PV.pal,PV.fn,PV.all):A.body;let RH=A.head;if(PV){if(PV.cut)RH=pvCut(t,RH,PV.cut);RH=pvRecolor(t+'h',RH,PV.pal,PV.head||PV.fn,PV.all)}
  const S=(PSC[t]||PSC0),root=new THREE.Group();root.scale.setScalar(S);
  const body=new THREE.Mesh(RB,mat);body.castShadow=true;root.add(body);
  const head=new THREE.Group();head.position.set(A.neck[0]*V,A.neck[1]*V,A.neck[2]*V);const hm=new THREE.Mesh(RH,mat);hm.castShadow=true;head.add(hm);if(PV){if(PV.hx){const x=new THREE.Mesh(voxGeo(PV.hx,0),mat);x.castShadow=true;head.add(x)}if(PV.hg)head.add(new THREE.Mesh(voxGeo(PV.hg,0),GLOWMAT))}if(A.glow&&!d.passive)head.add(new THREE.Mesh(A.glow,GLOWMAT));{const hsc={duck:.8,chicken:.9,rabbit:.9,cat:.9,penguin:.9,lizard:.9,wolf:.86,werewolf:.9,bear:.82,boar:.86,spider:.9,spiderq:.9,golem:.86,colossus:.86,yeti:.86,dog:.9,fox:.9,cow:.9,pig:.9,sheep:.9,deer:.92,reindeer:.92,goat:.9,camel:.9}[base];if(hsc)head.scale.setScalar(hsc)}root.add(head);
  const legs=[];if(A.leg&&A.leg.arach)legs.push(...buildArachLegs(A,kind,root,mat));else if(A.leg){const key=(PV?t:kind)+'|leg';const lg=legCache[key]||(legCache[key]=PV?pvRecolor(t+'l',legGeo(A.leg),PV.pal,PV.fn,PV.all):legGeo(A.leg));A.leg.hips.forEach((hp,k)=>{const p=new THREE.Group(),sp=A.leg.splay||0;p.position.set(hp[0]*V,A.leg.h*Math.cos(sp)*V,hp[1]*V);if(sp)p.rotation.z=(hp[0]<0?1:-1)*sp;const m=new THREE.Mesh(lg,mat);m.castShadow=true;p.add(m);p.userData.off=(k%4===0||k%4===3)?0:Math.PI;root.add(p);legs.push(p)})}
  if(base==='slime'){mat.transparent=true;mat.opacity=0.8;const core=new THREE.Mesh(voxGeo([[-1.6,1.6,-1.6,3.2,3,3.2,'#2a6a1a'],[-.9,2.2,-.4,1.8,.4,.5,'#e8e2cc'],[-1.2,2,-.6,.5,.7,.8,'#e8e2cc'],[.7,2,-.6,.5,.7,.8,'#e8e2cc'],[.6,3.6,.8,.7,.7,.7,'#c8b048'],[-1.4,4.2,-1,.5,.5,.5,'#b8ff90']],0),new THREE.MeshLambertMaterial({vertexColors:true}));root.add(core)}
  let WINGS=null;if(A.wing){WINGS=[];for(const sg of [1,-1]){const wm=new THREE.Mesh(A.wing,mat);wm.castShadow=true;wm.position.set(sg*A.wingP[0]*V,A.wingP[1]*V,A.wingP[2]*V);const ws=A.wingS||1;wm.scale.set(ws*sg,ws,ws);root.add(wm);WINGS.push(wm)}}
  if(PV){if(PV.bx){const x=new THREE.Mesh(voxGeo(PV.bx,0),PV.glow?GLOWMAT:mat);x.castShadow=!PV.glow;root.add(x)}if(PV.gx)root.add(new THREE.Mesh(voxGeo(PV.gx,0),GLOWMAT))}
  const FIRE=A.fire?A.fire(root,head):null;
  const g=new THREE.Group();g.add(root);const inner=new THREE.Group();inner.add(g);inner.scale.setScalar(d.sc||(elite?1.35:1));
  inner.userData={wings:WINGS,fire:FIRE,g,root,legs:[],plegs:legs,mat,ph:Math.random()*6,body,head,pan:A,pk:base,S,pas:!!d.passive,amt:0,str:0,pit:0,yaw:0,idt:Math.random()*100,graze:0,grT:2+Math.random()*4,hop:false};
  return inner;
}
const HCOATS=[['Gniady',null,null],['Kary','#2a2422','#141010'],['Siwy','#a9a9a6','#6a6a68'],['Biały','#e6e2d8','#d4ccbc'],['Kasztanowaty','#9a4a1e','#8a3a16'],['Izabelowaty','#d8b878','#f2ead6'],['Bułany','#b89048','#2a1a10'],['Srokaty','#6a3a22','#2e1a0e',1],['Dereszowaty','#8a6a66','#3a2420'],['Myszaty','#7a7468','#2a2622']];
HCOATS.push(['Jednorożec','#f4f1f8','#c8a8f0',0,['#f0a8d8','#c8a8f0','#a8d8f0','#f0e0a8','#a8f0c8']],['Pegaz','#eef1f6','#b8c6dc']);const HCN=10;
const HCC=new Map(),hlum=(r,g,b)=>r*.3+g*.55+b*.15,hhx=h=>{const c=new THREE.Color(h);return[c.r,c.g,c.b]};
function horseCoatGeo(geo,ci){let mp=HCC.get(ci);if(!mp){mp=new WeakMap();HCC.set(ci,mp)}if(mp.has(geo))return mp.get(geo);const key=geo;const C=HCOATS[ci];if(!C||!C[1]||!geo.attributes.color){mp.set(key,geo);return geo}
  const g=geo.clone(),c=g.attributes.color,a=c.array,P=g.attributes.position.array,L0=hlum(...hhx('#6a3a22')),LM=hlum(...hhx('#2e1a0e')),nc=hhx(C[1]),nm=hhx(C[2]);
  for(let i=0;i<a.length;i+=3){const r=a[i],gg=a[i+1],b=a[i+2],l=hlum(r,gg,b);if(!(r>b+0.03&&r>=gg-0.01))continue;let src=nc,ref=L0;if(l<LM*1.25){src=nm;ref=LM;if(C[4]){const q=C[4][Math.abs(Math.floor(P[i+1]*9+P[i+2]*5))%C[4].length];src=hhx(q);ref=LM*0.85}}else if(C[3]){const x=P[i],y=P[i+1],z=P[i+2];if(Math.sin(x*0.9+z*0.5)+Math.sin(y*0.8-z*0.7)+Math.sin(x*0.4+y*0.6)>0.6){a[i]=0.92;a[i+1]=0.9;a[i+2]=0.86;continue}}
    const k=Math.min(1.5,l/ref);a[i]=Math.min(1,src[0]*k);a[i+1]=Math.min(1,src[1]*k);a[i+2]=Math.min(1,src[2]*k)}c.needsUpdate=true;mp.set(key,g);return g}
function horseCoat(grp,ci){if(!ci)return grp;const cart=grp.userData&&grp.userData.cart,under=o=>{let p=o;for(let i=0;i<30&&p;i++,p=p.parent)if(p===cart)return true;return false};grp.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.attributes&&o.geometry.attributes.color&&!(cart&&under(o)))o.geometry=horseCoatGeo(o.geometry,ci)});grp.userData.coat=ci;return grp}
// jednorożec i pegaz: pełny model konia + własne atrybuty (róg / skrzydła, maść, grzywa)
function makeHorseF(t,elite){const g=horseCoat(makeHorseE(t,elite),t==='jednorozec'?HCN:HCN+1),u=g.userData,mat=u.mat,hp=u.head&&u.head.children[1],hg=hp&&hp.children[0];
  const M=(L,m)=>{const me=new THREE.Mesh(voxGeo(L,0),m||mat);me.castShadow=true;return me};
  if(t==='jednorozec'){if(hg){const P='#f6eed8',G='#e8c860',L=[[-.5,1.8,.55,1,1.3,1,P],[-.4,3.0,.65,.8,1.3,.8,P],[-.3,4.2,.75,.6,1.2,.6,P],[-.2,5.3,.85,.4,1,.4,P],[-.55,2.3,.5,1.1,.22,1.1,G],[-.45,3.45,.6,.9,.2,.9,G],[-.35,4.55,.7,.7,.18,.7,G]];hg.add(M(L));hg.add(M([[-.12,6.2,.95,.24,.5,.24,'#fff4c8']],GLOWMAT))}
    // pęciny z długim, perłowym włosem i złote kopyta
    for(const lg of (u.plegs||[]))lg.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.attributes.color){const c=o.geometry.attributes.color,a=c.array;o.geometry=o.geometry.clone();const a2=o.geometry.attributes.color.array;for(let i=0;i<a2.length;i+=3){const l=a2[i]*.3+a2[i+1]*.55+a2[i+2]*.15;if(Math.abs(a2[i]-a2[i+2])<0.04&&l>0.45&&l<0.6){a2[i]=0.91;a2[i+1]=0.78;a2[i+2]=0.38}}o.geometry.attributes.color.needsUpdate=true}});
    u.root.add(M([[-.3,12.6,-7.6,.6,1,.6,'#f0a8d8'],[-.4,11.4,-7.9,.8,1.2,.8,'#c8a8f0']]))}
  else{const W=[];const F=['#ffffff','#f2f5fa','#e4eaf2','#d6dee9'];W.push([0,-.6,-1.4,7.5,1.2,3.4,F[0]],[0,-.4,1.6,6,.8,1.0,F[1]]);for(let i=0;i<5;i++)W.push([.6+i*1.45,-.45,-5.6+i*.15,1.4,.7,4.4-i*.2,F[1+(i%2)]]);for(let i=0;i<4;i++)W.push([7.5+i*1.35,-.35,-6.6-i*.55,1.3,.6,6.4+i*.35,F[i%2?3:2]]);W.push([12.8,-.3,-8.7,1.2,.5,7.2,F[3]]);
    const geo=voxGeo(W,0);u.pwings=[];for(const sg of [1,-1]){const wg=new THREE.Group();wg.position.set(sg*2.3*V,12.9*V,3.4*V);const me=new THREE.Mesh(geo,mat);me.castShadow=true;me.scale.x=sg;wg.add(me);u.root.add(wg);u.pwings.push([wg,sg])}}
  return g}
function makeHorseE(t,elite){
  const d=EDEF[t],mat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});seasonPatch(mat,false);
  const H=makeHorse();H.g.traverse(o=>{if(o.isMesh)o.material=mat});H.root.scale.setScalar(2.1);
  const g=new THREE.Group();g.add(H.g);const inner=new THREE.Group();inner.add(g);inner.scale.setScalar(d.sc||(elite?1.35:1));
  inner.userData={g,root:H.root,legs:[],plegs:H.legs,mat,ph:0,body:H.root,head:H.head,tail:H.tail,horse:1,S:2.1,pas:true,amt:0,str:0,pit:0,yaw:0,idt:Math.random()*100,graze:0,grT:3,pan:{gait:2.2,leg:{amp:.55}}};
  return inner;
}
// animacja jak w syncAnimals Pintara: krok po przekątnej, bujanie, pasienie, rozglądanie, przechył
function animPan(u,speed,dt,st){
  const A=u.pan,k=Math.min(1,dt*6);u.idt+=dt;
  const tgt=speed>0.25?Math.min(1,speed/(1.4*u.S)):0;u.amt+=(tgt-u.amt)*Math.min(1,k*1.3);
  u.str+=speed*dt/u.S;const ph=u.str*(A.gait||8)*(u.horse?2.6:1),amt=u.amt;
  const w=u.wind||0,sk=u.strike>0?Math.sin((1-u.strike/0.32)*Math.PI):0,hk=u.hit>0?Math.sin(u.hit/0.22*Math.PI):0;
  if(st===2)return;
  if(u.pas&&amt<0.05){u.grT-=dt;if(u.grT<=0){u.graze=u.graze>0?0:2+Math.random()*4;u.grT=u.graze>0?u.graze:3+Math.random()*6}}else u.graze=0;
  const hopK=u.pk==='rabbit'&&amt>0.1;
  let bob=hopK?Math.abs(Math.sin(ph*1.6))*0.14:Math.abs(Math.sin(ph))*0.025*amt+Math.sin(u.idt*1.7)*0.004;
  if(A.hop){const hh=Math.abs(Math.sin(ph*1.2))*amt,sq=(1-hh)*0.12*amt+w*0.15-sk*0.1+Math.sin(u.idt*3)*0.02;bob=hh*0.3+sk*0.25;u.root.scale.set(u.S*(1+sq),u.S*(1-sq*1.4),u.S*(1+sq))}
  if(A.float)bob=0.25+Math.sin(u.idt*2.2)*0.08;
  u.root.position.y=bob*u.S-w*0.05*u.S+sk*0.05*u.S;u.root.position.z=(sk*0.12-w*0.06-hk*0.05)*u.S;
  u.root.rotation.z=Math.sin(ph)*0.03*amt;u.root.rotation.x=-w*0.08+sk*0.1-hk*0.12;const atkP=atkStyle(u,w,sk);
  const amp=(A.leg?A.leg.amp:0.5)*(u.horse?1:1);
  if(u.horse){const offs=[0,Math.PI,Math.PI,0];u.plegs.forEach((l,i)=>{l.rotation.x=Math.sin(ph+offs[i])*0.55*amt})}
  else for(const l of u.plegs){if(l.userData.ar){const s=Math.sin(ph+l.userData.off);l.rotation.y=l.userData.y0+s*0.32*amt;l.position.y=l.userData.yb+Math.max(0,Math.cos(ph+l.userData.off))*0.05*amt;l.userData.fm.rotation.z=0.75+Math.max(0,Math.cos(ph+l.userData.off))*0.25*amt+sk*0.2;continue}l.rotation.x=Math.sin(ph+l.userData.off)*amp*amt+sk*0.3*(l.position.z>0?-1:1)}
  if(u.wings){const t=u.idt,big=Math.pow(Math.max(0,Math.sin(t*0.45+u.ph)),10),a=0.14+Math.sin(t*1.7)*0.06+Math.sin(ph*0.55)*0.55*amt+big*Math.sin(t*7)*0.55+w*0.95-sk*1.0-hk*0.2,sw=0.4*(1-amt)*(1-w)*(1-big);u.wings[0].rotation.set(0,sw,a);u.wings[1].rotation.set(0,-sw,-a)}
  let tp=u.graze>0?(u.pk==='chicken'?0.35+Math.max(0,Math.sin(u.idt*7))*0.9:0.8+Math.sin(u.idt*2.3)*0.1):Math.sin(u.idt*0.7)*0.08-0.05*amt;
  tp+=-w*0.45+sk*0.7-hk*0.35+atkP;
  u.pit+=(tp-u.pit)*Math.min(1,(u.pk==='chicken'?k*3:k));
  const yt=u.graze>0||amt>0.1?0:Math.sin(u.idt*0.5+u.ph)*0.45;u.yaw+=(yt-u.yaw)*k;
  if(u.horse){u.head.rotation.x=(u.graze>0?1.05:0.1+Math.sin(ph*2)*0.06*amt)+u.pit*0.3;u.head.rotation.y=u.yaw*0.6;u.tail.rotation.x=0.15+0.4*amt;u.tail.rotation.z=Math.sin(u.idt*(amt>0.1?6:2.3))*0.35}
  else{u.head.rotation.x=u.pit;u.head.rotation.y=u.yaw}
}
// ---------- zwierzęta tła: ptaki, motyle, mewy, gołębie, sowy, nietoperze, ryby ----------
const AMB=[];let ambT=0;
// --- v32: zwierzęta tła z prawdziwymi skrzydłami (dwa skrzydła, machanie w stawie barkowym) ---
const AMBW={
 bird:{body:[[-.55,-.45,-1,1.1,.95,2,'#6a4a34'],[-.45,-.5,-.5,.9,.5,1.5,'#d8b890'],[-.45,.1,.85,.9,.85,.9,'#5a3e2c'],[-.46,.75,.85,.92,.2,.8,'#7a3a20'],[-.12,.3,1.75,.24,.22,.4,'#e0a030'],[-.47,.45,1.3,.08,.16,.16,'#101010'],[.39,.45,1.3,.08,.16,.16,'#101010'],[-.47,.35,1.1,.06,.1,.5,'#f0e8d8'],[.41,.35,1.1,.06,.1,.5,'#f0e8d8'],[-.35,-.2,-1.9,.7,.18,1,'#3a2a20'],[-.3,-.7,0,.12,.25,.12,'#c89060'],[.18,-.7,0,.12,.25,.12,'#c89060']],
  wing:[[0,0,-.7,1.4,.16,1.3,'#6a4a34'],[1.3,0,-.9,1,.14,1.1,'#3a2a20'],[0,.01,.3,1.2,.17,.3,'#a07a5a'],[2.2,0,-1,.6,.12,.8,'#2a1c14'],[.3,.01,-.3,.8,.17,.15,'#e8dcc8']],sh:[.5,.3,0]},
 gull:{body:[[-.8,-.6,-2.2,1.6,1.5,4.4,'#f6f6f2'],[-.75,.6,-2,1.5,.4,3.6,'#c8ccd2'],[-.6,.3,2,1.2,1.2,1.3,'#f6f6f2'],[-.15,.5,3.2,.3,.3,.8,'#f0c030'],[-.15,.5,3.8,.3,.12,.2,'#d03020'],[-.62,.9,2.6,.08,.22,.22,'#101010'],[.54,.9,2.6,.08,.22,.22,'#101010'],[-.6,-.1,-3,1.2,.3,.9,'#f6f6f2'],[-.6,0,-3.3,1.2,.25,.4,'#2a2a2a'],[-.4,-.9,0,.18,.35,.4,'#e8a040'],[.22,-.9,0,.18,.35,.4,'#e8a040']],
  wing:[[0,0,-1,2.6,.2,2,'#bfc4cc'],[2.5,0,-1.2,2.2,.18,1.6,'#aeb4bc'],[4.6,0,-1.3,1.2,.16,1.2,'#1e1e22'],[4.7,.01,-.5,.4,.17,.3,'#ffffff'],[0,.01,.9,4.6,.21,.3,'#e0e4e8']],sh:[.75,.6,.3]},
 pigeon:{body:[[-.8,-.3,-1.5,1.6,1.4,3,'#8c919c'],[-.7,-.35,-1,1.4,.6,2,'#a4aab8'],[-.65,.6,1.1,1.3,1.1,1.3,'#7a7f8c'],[-.67,.5,1.2,1.34,.5,1.15,'#5a8a7a'],[-.55,1.4,1.5,1.1,.9,1.1,'#8c919c'],[-.15,1.65,2.6,.3,.25,.45,'#3a3a40'],[-.15,1.85,2.55,.3,.12,.2,'#f0f0f0'],[-.57,1.8,2.2,.08,.2,.2,'#e86a1a'],[.49,1.8,2.2,.08,.2,.2,'#e86a1a'],[-.6,-.05,-2.4,1.2,.25,1.2,'#6a6f7a'],[-.6,0,-2.6,1.2,.2,.3,'#2a2a30'],[-.35,-.6,.2,.2,.3,.35,'#d87878'],[.15,-.6,.2,.2,.3,.35,'#d87878']],
  wing:[[0,0,-1.2,1.6,.18,2.2,'#a4aab8'],[1.5,0,-1.3,1.2,.16,1.8,'#9098a6'],[0,.01,-.7,1.5,.19,.22,'#3a3a44'],[0,.01,-.2,1.5,.19,.22,'#3a3a44'],[2.6,0,-1.4,.6,.14,1.2,'#2a2a30']],sh:[.75,.7,.1],fold:1},
 owl:{body:[[-1.4,-1.8,-1.2,2.8,3.4,2.6,'#8a6a44'],[-1.1,-1.6,1.3,2.2,2.6,.3,'#e8dcc0'],[-1.1,-1.2,1.55,2.2,.15,.06,'#8a6a44'],[-1.1,-.4,1.55,2.2,.15,.06,'#8a6a44'],[-1.6,1.5,-1.3,3.2,2.6,2.8,'#8a6a44'],[-1.45,1.7,1.45,2.9,2.2,.2,'#e8dcc0'],[-1.15,2.5,1.6,1,1,.12,'#f0c020'],[.15,2.5,1.6,1,1,.12,'#f0c020'],[-.85,2.75,1.7,.45,.5,.08,'#101010'],[.4,2.75,1.7,.45,.5,.08,'#101010'],[-.2,2.1,1.6,.4,.6,.35,'#4a3a2a'],[-1.5,4,-.2,.6,.9,.6,'#6a4a2a'],[.9,4,-.2,.6,.9,.6,'#6a4a2a'],[-.8,-2,-1.7,1.6,.6,.8,'#6a4a2a'],[-.8,-2.2,.4,.5,.4,.6,'#d8b030'],[.3,-2.2,.4,.5,.4,.6,'#d8b030']],
  wing:[[0,0,-1.2,2.4,.3,2.6,'#7a5a3a'],[2.3,0,-1.4,1.8,.25,2.4,'#6a4a2a'],[0,.01,-.6,3.8,.31,.2,'#d8c8a0'],[0,.01,.4,3.8,.31,.2,'#d8c8a0'],[4,0,-1.5,.8,.2,1.8,'#4a3020']],sh:[1.4,.8,0]},
 bat:{body:[[-.5,-.6,-.8,1,1.1,1.6,'#3a3036'],[-.45,.4,.5,.9,.8,.8,'#4a3e44'],[-.45,1.1,.6,.3,.6,.25,'#3a3036'],[.15,1.1,.6,.3,.6,.25,'#3a3036'],[-.35,.7,1.3,.22,.2,.08,'#ff3a2a'],[.13,.7,1.3,.22,.2,.08,'#ff3a2a'],[-.2,.45,1.3,.4,.2,.1,'#2a2228'],[-.15,.3,1.32,.08,.12,.05,'#ffffff'],[.07,.3,1.32,.08,.12,.05,'#ffffff']],
  wing:[[0,-.05,-.8,1.6,.1,1.6,'#2a2228'],[1.5,-.05,-1,1.6,.08,1.8,'#2a2228'],[0,0,.7,3.4,.14,.15,'#4a3e44'],[1.6,0,-.9,.1,.12,1.7,'#4a3e44'],[2.6,0,-1,.1,.12,1.8,'#4a3e44'],[3.1,-.05,-1.2,.6,.08,1.4,'#2a2228']],sh:[.5,.2,.2]},
 butterfly:{body:[[-.15,-.2,-.7,.3,.35,1.4,'#2a2a2a'],[-.13,-.1,.7,.26,.26,.3,'#2a2a2a'],[-.3,.1,.95,.05,.05,.6,'#2a2a2a'],[.25,.1,.95,.05,.05,.6,'#2a2a2a']],
  wing:[[0,0,0,1.8,.08,1.3,'#e8a030'],[0,0,-1.1,1.5,.08,1.1,'#d88020'],[1.2,.01,.6,.5,.09,.5,'#1a1a1a'],[.9,.01,.1,.3,.09,.3,'#ffffff'],[0,.01,1.2,1.8,.09,.12,'#1a1a1a'],[1.7,.01,-.4,.12,.09,1.6,'#1a1a1a'],[.4,.01,-.8,.4,.09,.4,'#ffffff']],sh:[.15,0,0],up:1}};
for(const k in AMBW){AMBW[k].bg=voxGeo(AMBW[k].body,0.04);AMBW[k].wg=voxGeo(AMBW[k].wing,0.03)}
function ambModel(kind){const A=AMBW[kind],g=new THREE.Group();g.add(new THREE.Mesh(A.bg,matV));const W=[];for(const s of [1,-1]){const m=new THREE.Mesh(A.wg,matV);m.position.set(s*A.sh[0]*V,A.sh[1]*V,A.sh[2]*V);if(s<0)m.scale.x=-1;g.add(m);W.push(m)}return{g,W,A}}
function ambWing(a,wing){if(!a.W)return;const A=a.A;if(A.fold&&wing<0.3){a.W[0].rotation.set(0,1.35,-0.15);a.W[1].rotation.set(0,-1.35,0.15);return}
  const ang=A.up?-(1-wing)*1.3:(0.55-wing)*1.25;a.W[0].rotation.set(0,0,-ang);a.W[1].rotation.set(0,0,ang)}

Object.assign(PANIM,{
  bird:{body:voxGeo([[-.55,-.45,-1,1.1,.9,2,'#5a4232'],[-.5,-.5,-.6,1,.6,1.4,'#c89a6a'],[-.45,.05,.9,.9,.85,.85,'#4a3428'],[-.15,.2,1.7,.3,.25,.45,'#e0a030'],[-.5,.4,1.35,.18,.18,.1,'#101010'],[.32,.4,1.35,.18,.18,.1,'#101010'],[-.4,-.25,-1.8,.8,.25,.9,'#3a2a20'],[-.3,-.3,-2.4,.6,.2,.7,'#2a1c14']]),
    head:voxGeo([[-2.8,0,-.7,2.3,.2,1.4,'#4a3428'],[.5,0,-.7,2.3,.2,1.4,'#4a3428'],[-3.4,0,-.9,.9,.18,1.1,'#2a1c14'],[2.5,0,-.9,.9,.18,1.1,'#2a1c14'],[-2,0,-.2,1.2,.22,.8,'#8a6a4a'],[.8,0,-.2,1.2,.22,.8,'#8a6a4a']]),neck:[0,0,0],wing:1},
  butterfly:{body:voxGeo([[-.15,-.2,-.7,.3,.35,1.4,'#2a2a2a'],[-.12,-.1,.7,.24,.24,.3,'#2a2a2a'],[-.35,.1,.95,.05,.05,.5,'#2a2a2a'],[.3,.1,.95,.05,.05,.5,'#2a2a2a']]),
    head:voxGeo([[-1.9,0,0,1.7,.08,1.2,'#e8a030'],[.2,0,0,1.7,.08,1.2,'#e8a030'],[-1.6,0,-1.1,1.4,.08,1,'#d88020'],[.2,0,-1.1,1.4,.08,1,'#d88020'],[-1.7,.01,.6,.5,.09,.4,'#1a1a1a'],[1.2,.01,.6,.5,.09,.4,'#1a1a1a'],[-1.3,.02,.1,.3,.09,.3,'#ffffff'],[1,.02,.1,.3,.09,.3,'#ffffff'],[-1.9,.01,1.1,1.7,.09,.12,'#1a1a1a'],[.2,.01,1.1,1.7,.09,.12,'#1a1a1a']]),neck:[0,0,0],wing:1}});
function ambMake(kind,sc){if(AMBW[kind]){const M=ambModel(kind);M.g.scale.setScalar(sc*2.1);scene.add(M.g);return{g:M.g,W:M.W,A:M.A,w:{scale:{x:1}},kind,sc}}const A=PANIM[kind],g=new THREE.Group(),b=new THREE.Mesh(A.body,matV),w=new THREE.Mesh(A.head,matV);g.add(b,w);g.scale.setScalar(sc*2.1);scene.add(g);return{g,w,kind,sc}}
let ambS=2;
function ambTick(dt){
  ambT+=dt;
  ambS-=dt;if(ambS<=0&&AUD.on){ambS=1.8+Math.random()*3.2;const dy=hour>6&&hour<20,nt=hour<5.5||hour>20.5,pp=player.p;let wet=0;for(let k=0;k<6;k++){const a=k/6*6.283,h=colAt(pp.x+Math.cos(a)*18,pp.z+Math.sin(a)*18);if(h!==null&&h<WATER)wet++}
    if(!SPC){if(dy&&pp.y<WATER+55&&Math.random()<0.55)sfx('chirp',0.55);if(nt&&Math.random()<0.7)sfx('cricket',0.7);if(nt&&wet>=1&&Math.random()<0.35)sfx('frog',0.5);if(wet>=2&&Math.random()<0.5)sfx('wave',0.7);if((pp.y>WATER+45||VH.mode===6)&&Math.random()<0.6)sfx('wind',0.8)}}const px=player.p.x,pz=player.p.z,day=hour>6&&hour<20,night=hour<5.5||hour>20.5;
  const want={bird:day?8:0,butterfly:day?6:0,owl:0,bat:night?6:0,gull:0,pigeon:0,fish:5};
  {let wet=0;for(let k=0;k<8;k++){const a=k/8*6.283,h=colAt(px+Math.cos(a)*30,pz+Math.sin(a)*30);if(h!==null&&h<WATER)wet++}if(wet>=2&&day)want.gull=5;const v=inVillage(px,pz,20);if(v&&day)want.pigeon=6}
  const cnt={};for(const a of AMB)cnt[a.kind]=(cnt[a.kind]||0)+1;
  for(const k in want){while((cnt[k]||0)<want[k]){cnt[k]=(cnt[k]||0)+1;const a=k==='fish'?{fish:1,kind:'fish',sch:[]}:ambMake(k,{bird:1.4,butterfly:1,owl:1.5,bat:1.2,gull:1.5,pigeon:1.15}[k]);
      a.cx=px+(Math.random()-0.5)*70;a.cz=pz+(Math.random()-0.5)*70;a.ph=Math.random()*6.28;a.r=k==='butterfly'?2+Math.random()*3:k==='pigeon'?1+Math.random()*2:8+Math.random()*14;a.alt=k==='butterfly'?0.8+Math.random()*1.2:k==='pigeon'?0:k==='bat'?5+Math.random()*5:12+Math.random()*12;a.sp=(k==='butterfly'?0.6:k==='bat'?1.1:0.35)*(Math.random()<0.5?1:-1);
      if(k==='fish'){a.k=Math.floor(Math.random()*3);for(let i=0;i<6+Math.floor(Math.random()*5);i++){const m=new THREE.Mesh(FISHK[a.k],matV);m.scale.setScalar(2.1);scene.add(m);a.sch.push({m,o:Math.random()*6.28,r:0.4+Math.random()*1.4,y:Math.random()*0.5})}}
      AMB.push(a)}}
  for(let i=AMB.length-1;i>=0;i--){const a=AMB[i],far=Math.hypot(a.cx-px,a.cz-pz)>95;
    if(far||(cnt[a.kind]>(want[a.kind]||0))){cnt[a.kind]--;if(a.fish)for(const f of a.sch)scene.remove(f.m);else scene.remove(a.g);AMB.splice(i,1);continue}
    a.ph+=dt*a.sp;
    if(a.fish){const h=colAt(a.cx,a.cz);if(h===null||h>WATER-1.5){a.cx=px+(Math.random()-0.5)*60;a.cz=pz+(Math.random()-0.5)*60;for(const f of a.sch)f.m.visible=false;continue}
      {const dx=a.cx-px,dz=a.cz-pz,dd=Math.hypot(dx,dz)||1,thr=VH.mode===1?9:6;if(dd<thr){a.cx+=dx/dd*dt*(thr-dd)*1.6;a.cz+=dz/dd*dt*(thr-dd)*1.6;a.ph+=dt*3}}
      const x=a.cx+Math.cos(a.ph*0.3)*4,z=a.cz+Math.sin(a.ph*0.3)*4;
      for(const f of a.sch){f.m.visible=true;const ang=a.ph*0.3+f.o;f.m.position.set(x+Math.cos(ang*2+f.o)*f.r,WATER-0.65-f.y+Math.sin(ambT*2+f.o)*0.05,z+Math.sin(ang*2+f.o)*f.r);f.m.rotation.y=Math.atan2(-Math.sin(a.ph*0.3),Math.cos(a.ph*0.3))+Math.PI/2+Math.sin(ambT*6+f.o)*0.15}continue}
    const x=a.cx+Math.cos(a.ph)*a.r,z=a.cz+Math.sin(a.ph)*a.r,gh=colAt(x,z);const base=gh===null?WATER:Math.max(gh,WATER);
    let y=base+a.alt,wing=1;
    if(a.kind==='bird'){y+=Math.sin(ambT*2+a.ph)*0.6;wing=0.3+Math.abs(Math.sin(ambT*12+a.ph))*0.7}
    else if(a.kind==='butterfly'){y+=Math.sin(ambT*5+a.ph)*0.3;wing=0.15+Math.abs(Math.sin(ambT*20+a.ph))*0.85;if(Math.random()<dt*0.2){a.cx+=(Math.random()-0.5)*6;a.cz+=(Math.random()-0.5)*6}}
    else if(a.kind==='gull'){y+=Math.sin(ambT*1.1+a.ph)*1.2;wing=Math.sin(ambT*0.5+a.ph)>0.15?0.9+Math.sin(ambT*1.4)*0.08:0.35+Math.abs(Math.sin(ambT*6))*0.65}
    else if(a.kind==='owl'){y+=Math.sin(ambT*1.3)*0.5;wing=0.35+Math.abs(Math.sin(ambT*5+a.ph))*0.65}
    else if(a.kind==='bat'){y+=Math.sin(ambT*3+a.ph)*0.8;wing=0.2+Math.abs(Math.sin(ambT*18+a.ph))*0.8}
    else if(a.kind==='pigeon'){const v=inVillage(a.cx,a.cz,20);const vg=v?villageGround(x,z,999):null;y=Math.max(base,vg??base)+0.05+Math.abs(Math.sin(ambT*7+a.ph))*0.05;wing=0.24;a.ph-=dt*a.sp*0.7}
    a.g.position.set(x,y,z);a.g.rotation.y=Math.atan2(-Math.sin(a.ph)*Math.sign(a.sp),Math.cos(a.ph)*Math.sign(a.sp));a.w.scale.x=wing;ambWing(a,wing)}
}

// --- wrogowie w stylu Pintara (format PANIM; voxele 1/16, przodem do +z) ---
{const E2=(x,y,z,s,c)=>[[x-s/2,y,z,s,s*1.1,.4,'#f6f2e8'],[x-s*.3,y+s*.1,z+.3,s*.6,s*.7,.3,c||'#101010']];
 const R=PANIM.__rec;
 PANIM.slime={body:voxGeo([[-4,0,-4,8,1.2,8,'#68bf4b'],[-3.6,1,-3.6,7.2,5.4,7.2,'#7ad15a'],[-3,6.2,-3,6,1,6,'#8ae06a'],[-2,7,-2,4,.6,4,'#a0ec80'],[-1.4,2,-1.4,2.8,2.4,2.8,'#4a9a32'],[-2.2,1.2,3.6,4.4,.8,.3,'#3a7a2a']]),
  head:voxGeo([...E2(-1.3,0,0,1.4,'#173016'),...E2(1.3,0,0,1.4,'#173016'),[-1,-1.6,0,2,.5,.3,'#173016']]),neck:[0,3.8,3.6],hop:1,gait:6};
 PANIM.toad={body:voxGeo([[-3.4,1,-3.6,6.8,3.8,7.2,'#5f7a3a'],[-3,.6,-3,6,1,6,'#c8c070'],[-1.8,4.6,-2.4,1,.6,1,'#4a6a2a'],[1,4.6,-.6,1,.6,1,'#4a6a2a'],[-2.6,4.6,1,1,.6,1,'#4a6a2a'],[-4.2,1,-3,1.2,2.4,3.6,'#55702f'],[3,1,-3,1.2,2.4,3.6,'#55702f']]),
  head:voxGeo([[-3,-1.2,0,6,3,3.6,'#6d8a44'],[-2.8,1.2,.6,1.9,1.9,1.9,'#e2d15a'],[.9,1.2,.6,1.9,1.9,1.9,'#e2d15a'],[-2.4,1.7,2.4,.9,1,.3,'#101010'],[1.4,1.7,2.4,.9,1,.3,'#101010'],[-2.6,-.9,3.5,5.2,.4,.3,'#3a4a22'],[-2.8,-1.4,.4,5.6,.6,3,'#c8c070']]),neck:[0,3.4,3.2],
  leg:{w:1.6,h:1.4,c:'#5a7234',hips:[[-3.2,-2.4],[3.2,-2.4],[-2.6,2.4],[2.6,2.4]],amp:.4},hop:1,gait:6};
 PANIM.scorpion={body:voxGeo([[-3,2,-3,6,2.4,6,'#b0702e'],[-2.6,4.4,-2.6,5.2,.6,5.2,'#c8843a'],[-2.4,2.2,-5,4.8,2,2.2,'#9a5f24'],[-1,3,-6.4,2,2,2,'#b0702e'],[-.9,4.8,-7.4,1.8,1.8,1.8,'#9a5f24'],[-.8,6.6,-7.6,1.6,1.8,1.6,'#b0702e'],[-.7,8.2,-6.6,1.4,1.6,1.4,'#9a5f24'],[-.5,9.2,-5.2,1,1,1.6,'#2a1a0a'],[-.25,8.6,-3.9,.5,1,.6,'#2a1a0a'],
   [3,2.2,2,1.4,1.2,3.4,'#b0702e'],[-4.4,2.2,2,1.4,1.2,3.4,'#b0702e'],[2.8,2,5.2,2.2,1.6,1.8,'#c8843a'],[-5,2,5.2,2.2,1.6,1.8,'#c8843a'],[3.6,2,6.9,.6,1.2,1.2,'#9a5f24'],[-4.2,2,6.9,.6,1.2,1.2,'#9a5f24']]),
  head:voxGeo([[-1.6,-.8,0,3.2,1.6,2,'#9a5f24'],[-1.2,.8,.6,.6,.6,.6,'#101010'],[.6,.8,.6,.6,.6,.6,'#101010'],[-.9,-1,1.8,.6,.8,.6,'#3a2a1a'],[.3,-1,1.8,.6,.8,.6,'#3a2a1a']]),neck:[0,3.2,3],
  leg:{w:.6,h:2.2,c:'#8a5020',hips:[[-3.2,-2],[3.2,-2],[-3.2,0],[3.2,0],[-3.2,2],[3.2,2]],amp:.6,splay:.55},gait:12};
 PANIM.crab={body:voxGeo([[-4,1.6,-2.6,8,2.6,5.2,'#d9533e'],[-3.4,4.2,-2,6.8,.6,4,'#e8705a'],[-3.6,1.4,-2.2,7.2,.4,4.4,'#f0c0a0'],[4,2,1,1.6,1.4,2.4,'#d9533e'],[-5.6,2,1,1.6,1.4,2.4,'#d9533e'],[4.4,1.6,3.2,2.6,2.2,2.4,'#e0654f'],[-7,1.6,3.2,2.6,2.2,2.4,'#e0654f'],[5.6,1.6,5.4,1,1.6,1,'#c04030'],[-6.6,1.6,5.4,1,1.6,1,'#c04030']]),
  head:voxGeo([[-1.6,0,0,.6,2,.6,'#d9533e'],[1,0,0,.6,2,.6,'#d9533e'],[-1.8,2,-.1,1,1,1,'#101010'],[.8,2,-.1,1,1,1,'#101010'],[-1,-.6,.2,2,.6,.6,'#a83a2a']]),neck:[0,4,2.2],
  leg:{w:.6,h:1.8,c:'#c04030',hips:[[-3.6,-1.6],[3.6,-1.6],[-3.8,0],[3.8,0],[-3.6,1.4],[3.6,1.4]],amp:.6,splay:.7},gait:14};
 const spider=(c1,c2,mk,eye)=>({body:voxGeo([[-3,3,-7,6,5,6.4,c1],[-2.4,7.8,-6.4,4.8,.8,5.2,c2],[-1,6,-7.4,2,2,.6,mk],[-2.2,3,-.6,4.4,3,4,c2],[-.8,8.2,-4.4,1.6,.4,1.6,mk]]),
   head:voxGeo([[-1.6,-1,0,3.2,2.4,2.2,c2],[-1.3,.6,2,.6,.6,.3,eye],[.7,.6,2,.6,.6,.3,eye],[-.6,1,2,.5,.5,.3,eye],[.1,1,2,.5,.5,.3,eye],[-.9,-1.6,1.6,.6,1.2,.6,'#e8e2cc'],[.3,-1.6,1.6,.6,1.2,.6,'#e8e2cc']]),neck:[0,4.6,3.4],
   leg:{w:.7,h:5.4,c:c2,hips:[[-2.2,-.2],[2.2,-.2],[-2.4,1],[2.4,1],[-2.4,2.2],[2.4,2.2],[-2.2,3.2],[2.2,3.2]],amp:.55,splay:.85},gait:13});
 PANIM.spider=spider('#3a2f2a','#4a3a32','#c83a2a','#e5483b');PANIM.spiderq=spider('#2a1f2a','#3a2a3a','#7dff8a','#7dff8a');
 PANIM.yeti={body:voxGeo([[-3.6,6,-2.6,7.2,8,5.2,'#eef3f6'],[-3.8,9,-2.8,7.6,4,5.6,'#f6f9fb'],[-3,6,2.4,6,5,.6,'#d8e4ea'],[-5.6,7,-1.2,2,6.6,2.4,'#e2e9ee'],[3.6,7,-1.2,2,6.6,2.4,'#e2e9ee'],[-5.8,5.6,-1.2,2.2,1.6,2.6,'#8fb0c0'],[3.6,5.6,-1.2,2.2,1.6,2.6,'#8fb0c0']]),
  head:voxGeo([[-2.4,0,-2,4.8,4.4,4.2,'#e2e9ee'],[-1.8,.4,2.1,3.6,2.6,.4,'#8fb0c0'],[-1.4,1.8,2.4,.8,.8,.3,'#123'],[.6,1.8,2.4,.8,.8,.3,'#123'],[-1,.5,2.4,2,.5,.3,'#5a7a8a'],[-2.6,3.6,-2.2,5.2,1.2,4.6,'#ffffff']]),neck:[0,14,0],
  leg:{w:2.4,h:6,c:'#e2e9ee',hoof:'#8fb0c0',hips:[[-1.8,0],[1.8,0]],amp:.5},gait:6};
 const golem=(c1,c2,eye,moss)=>({body:voxGeo([[-4,7,-2.6,8,7,5.2,c1],[-4.4,12,-3,8.8,2.4,6,c2],[-6.4,8,-1.4,2.4,6,2.8,c2],[4,8,-1.4,2.4,6,2.8,c2],[-6.6,6.4,-1.6,2.8,2,3.2,c1],[3.8,6.4,-1.6,2.8,2,3.2,c1],[-3,11,2.6,2.4,2,.4,moss],[1,8.6,2.6,1.6,1.4,.4,moss],[-4.2,14.4,-2.4,3,.6,3,moss],[-1.2,9.6,2.62,2.4,1.6,.2,eye]]),
   head:voxGeo([[-1.8,0,-1.6,3.6,3,3.4,c2],[-1.3,1.2,1.8,1,.6,.3,eye],[.3,1.2,1.8,1,.6,.3,eye],[-2,2.8,-1.8,4,.6,3.8,c1]]),neck:[0,14.4,.2],
   leg:{w:3,h:7,c:c1,hoof:c2,hips:[[-2,0],[2,0]],amp:.4},gait:5});
 PANIM.golem=golem('#7d7b78','#8d8b88','#7fe3ff','#5f7a3a');PANIM.colossus=golem('#5f5d5a','#6f6d6a','#ff9d2e','#4a3a2a');
 PANIM.werewolf={...PANIM.wolf,body:R(PANIM.wolf.body,(r,g,b)=>[r*0.62,g*0.55,b*0.5]),head:voxGeo([[-1.8,-1.2,0,3.6,3.4,3.2,'#4a3f3a'],[-1.1,-1.2,3,2.2,1.8,2.6,'#5a4a42'],[-.5,-.6,5.4,1,.8,.5,'#1d1410'],[-1.9,2,.4,1.1,1.9,.9,'#3a302a'],[.8,2,.4,1.1,1.9,.9,'#3a302a'],[-1.4,.6,2.8,.6,.5,.2,'#ff3a2a'],[.8,.6,2.8,.6,.5,.2,'#ff3a2a'],[-.9,-1.6,4,.4,.8,.4,'#f2ead8'],[.5,-1.6,4,.4,.8,.4,'#f2ead8'],[-2.2,-.6,-.6,4.4,2.6,1.4,'#3a302a']]),
  leg:{...PANIM.wolf.leg,c:'#3a302a',w:1.5}};
 PANIM.basilisk={body:voxGeo([[-2.6,1.6,-5,5.2,2.8,10,'#3f5a32'],[-2.2,1.2,-4.4,4.4,.6,8.8,'#c8b060'],[-1.2,1.8,-9.6,2.4,1.8,4.8,'#3f5a32'],[-.6,1.9,-13,1.2,1.2,3.6,'#34482a'],[-.3,2,-14.6,.6,.8,1.8,'#c84a2a'],
   [-.3,4.4,3,.6,1.6,1.4,'#c84a2a'],[-.3,4.4,.8,.6,2,1.4,'#c84a2a'],[-.3,4.4,-1.4,.6,1.8,1.4,'#c84a2a'],[-.3,4.4,-3.6,.6,1.4,1.4,'#c84a2a'],[-.3,3.4,-6.6,.6,1.2,1.2,'#c84a2a']]),
  head:voxGeo([[-1.8,-.8,0,3.6,2.2,3.6,'#3f5a32'],[-1.4,-.9,3.4,2.8,1.4,1.6,'#4a6a3a'],[-2.2,.4,1,.6,.8,.8,'#ffd23a'],[1.6,.4,1,.6,.8,.8,'#ffd23a'],[-1.6,1.4,.2,3.2,.6,2,'#c84a2a'],[-1.2,-1.1,4.6,2.4,.3,.3,'#7a1a1a']]),neck:[0,3,5],
  leg:{w:1.3,h:1.8,c:'#34482a',hips:[[-2.8,-3],[2.8,-3],[-2.8,3],[2.8,3]],amp:.6,splay:.35},gait:10};
 PANIM.griffin={body:voxGeo([[-2.6,7,-5.6,5.2,5,10.4,'#c9a46a'],[-2.2,6.6,-4.6,4.4,1,8,'#e8d8b0'],[-2.8,10,1,5.6,3,4.4,'#f2efe6'],[-.6,9,-6.8,1.2,1.2,1.4,'#a8844a'],[-.6,7,-7.6,1.2,3,1,'#a8844a'],[-1,5.6,-8,2,1.8,1.2,'#6a4a2a'],
   [2.6,10.6,-3,6,.8,6,'#d8c8a0'],[-8.6,10.6,-3,6,.8,6,'#d8c8a0'],[8.2,10.8,-2.4,3,.6,4.6,'#b8a070'],[-11.2,10.8,-2.4,3,.6,4.6,'#b8a070'],[2.6,11.2,-2,1.4,.6,4,'#f2efe6'],[-4,11.2,-2,1.4,.6,4,'#f2efe6']]),
  head:voxGeo([[-1.8,0,-.8,3.6,3.6,3.6,'#f2efe6'],[-.9,.4,2.6,1.8,1.6,2.2,'#e8b03a'],[-.6,-.4,4.4,1.2,1.2,.8,'#c88a20'],[-2.1,2,1.2,.5,.9,.9,'#101010'],[1.6,2,1.2,.5,.9,.9,'#101010'],[-1.4,3.4,-1.4,.8,1.6,1.2,'#f2efe6'],[.6,3.4,-1.4,.8,1.6,1.2,'#f2efe6']]),neck:[0,12,4.6],
  leg:{w:1.5,h:7,c:'#c9a46a',hoof:'#e8b03a',hips:[[-1.6,-4],[1.6,-4],[-1.6,3.6],[1.6,3.6]],amp:.5},gait:6};
 PANIM.elemental={body:voxGeo([[-3,2,-3,6,6,6,'#ff6a1a'],[-2.4,7.6,-2.4,4.8,4,4.8,'#ff8a2e'],[-1.8,11.4,-1.8,3.6,3,3.6,'#ffd34d'],[-1,14.2,-1,2,2,2,'#fff2a0'],[3,6,-1,2,4,2,'#ff5a1a'],[-5,5.4,-1,2,4.6,2,'#ff5a1a'],[-2,0,-2,4,2.2,4,'#e04a10'],[-4.2,9,-1,1.4,2.4,1.4,'#ffb030'],[3.4,9.6,-.4,1.2,2,1.2,'#ffb030']]),
  head:voxGeo([[-1.6,0,0,1.2,1.2,.3,'#2a0a00'],[.4,0,0,1.2,1.2,.3,'#2a0a00'],[-1,-1.6,0,2,.6,.3,'#2a0a00']]),neck:[0,9.6,2.5],float:1,gait:6};
 const DR='#8a2a22',DD='#6a1e18',DG='#d8a040';
 PANIM.dragon={body:voxGeo([[-4,7,-8,8,6,16,DR],[-3.4,6.6,-7,6.8,1,14,DG],[-3.6,12.6,-7.4,7.2,.8,14.6,'#a8342a'],[-1.6,8,-12,3.2,3.2,4.4,DR],[-1.1,8.4,-16.4,2.2,2.2,4.6,DD],[-.7,8.6,-20.6,1.4,1.4,4.4,DD],[-1.6,8.4,-22.4,3.2,.6,2.2,DG],
   [4,11,-4,13,1,10,'#a8342a'],[-17,11,-4,13,1,10,'#a8342a'],[16,11.6,-3,4,.8,6,DR],[-20,11.6,-3,4,.8,6,DR],[4,12,-3.6,2,1,9,DD],[-6,12,-3.6,2,1,9,DD],[8.6,11.8,-4,.8,.6,10,DD],[-9.4,11.8,-4,.8,.6,10,DD],[13,11.8,-4,.8,.6,8,DD],[-13.8,11.8,-4,.8,.6,8,DD],
   ...[0,1,2,3,4,5,6,7].map(k=>[-.6,13.4,6-k*2.2,1.2,1.8-k*.12,1.2,DG]),[-2.4,9,7.6,4.8,3.6,3,DR]]),
  head:voxGeo([[-2.4,-1,-1,4.8,4,5.4,DR],[-2,-1.6,4.4,4,2,4,DR],[-1.8,-2.6,4.4,3.6,1,3.8,DD],[-1.6,-1.8,8.2,1,.6,.4,'#2a0a08'],[.6,-1.8,8.2,1,.6,.4,'#2a0a08'],[-2.7,1.4,1.6,.6,1,1.2,'#ffd23a'],[2.1,1.4,1.6,.6,1,1.2,'#ffd23a'],[-2,2.8,-1.8,1,1,3,'#e8d8a8'],[1,2.8,-1.8,1,1,3,'#e8d8a8'],[-2,3.2,-3.6,.8,.8,1.8,'#e8d8a8'],[1.2,3.2,-3.6,.8,.8,1.8,'#e8d8a8'],
   [-1.6,-2.8,5,.5,.8,.5,'#f2ead8'],[1.1,-2.8,5,.5,.8,.5,'#f2ead8'],[-1.6,-2.8,7,.5,.8,.5,'#f2ead8'],[1.1,-2.8,7,.5,.8,.5,'#f2ead8'],[-.4,3,0,.8,1.4,4,DG]]),neck:[0,12.6,9.6],
  leg:{w:2.6,h:7,c:DD,hoof:'#2a2a2a',hips:[[-3.2,-5.4],[3.2,-5.4],[-3.2,5],[3.2,5]],amp:.45},gait:5};
}
// --- oczy dla każdego stworzenia: biała gałka + źrenica (boczne EY lub przednie FE) ---
{const EY=(hw,y,z,s)=>[[-hw-.25,y,z,.5,s,s,'#f6f2e8'],[hw-.25,y,z,.5,s,s,'#f6f2e8'],[-hw-.45,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010'],[hw+.05,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010']];
 const FE=(x,y,z,s,p)=>[[x-s/2,y,z,s,s*1.1,.3,'#f6f2e8'],[x-s*.3,y+s*.15,z+.3,s*.6,s*.65,.25,p||'#101010']];
 const gm=(A,list)=>{const B=voxGeo(list,0),g=new THREE.BufferGeometry();for(const k of ['position','normal','color']){const x=A.attributes[k].array,y=B.attributes[k].array,z=new Float32Array(x.length+y.length);z.set(x);z.set(y,x.length);g.setAttribute(k,new THREE.Float32BufferAttribute(z,3))}g.computeBoundingSphere();return g};
 const addH=(k,list)=>{if(PANIM[k])PANIM[k].head=gm(PANIM[k].head,list)},addB=(k,list)=>{if(PANIM[k])PANIM[k].body=gm(PANIM[k].body,list)};
 addH('wolf',EY(1.8,.5,1.4,.9));addH('werewolf',EY(1.8,.5,1.4,.9).map((b,i)=>i>1?[...b.slice(0,6),'#ff3a2a']:b));addH('boar',EY(2.4,.4,2.2,1));
 addH('yeti',[...FE(-1,1.6,2.2,1.2),...FE(1,1.6,2.2,1.2)]);addH('scorpion',[...FE(-.8,.1,2,.8),...FE(.8,.1,2,.8)]);
 addH('crab',[...FE(-1.3,2.05,.9,.9),...FE(1.3,2.05,.9,.9)]);for(const k of ['spider','spiderq'])addH(k,[...FE(-.85,-.1,2.2,.85,k==='spiderq'?'#1a3a1a':'#5a0a0a'),...FE(.85,-.1,2.2,.85,k==='spiderq'?'#1a3a1a':'#5a0a0a')]);
 addH('griffin',EY(1.8,1.7,.9,.9));addH('basilisk',EY(1.8,.3,1.2,.8).map((b,i)=>i>1?[...b.slice(0,6),'#7a1a1a']:b));addH('dragon',EY(2.4,1.1,1.2,1.2).map((b,i)=>i>1?[...b.slice(0,6),'#5a1a00']:b));
 addH('elemental',[...FE(-1,0,.3,1.2,'#2a0a00'),...FE(1,0,.3,1.2,'#2a0a00')]);addH('golem',[...FE(-.8,1.1,1.8,1,'#2a8aa8'),...FE(.8,1.1,1.8,1,'#2a8aa8')]);addH('colossus',[...FE(-.8,1.1,1.8,1,'#a84a10'),...FE(.8,1.1,1.8,1,'#a84a10')]);
 addH('crane',EY(.4,6.3,.3,.5));addH('turtle',[]);
 addB('bird',[[-.68,.05,.7,.12,.24,.24,'#101010'],[.56,.05,.7,.12,.24,.24,'#101010']]);
 addB('gull',[[-.82,1.3,3,.14,.36,.36,'#101010'],[.68,1.3,3,.14,.36,.36,'#101010']]);
 addB('pigeon',[[-.57,1.35,2.8,.14,.3,.3,'#e86a1a'],[.43,1.35,2.8,.14,.3,.3,'#e86a1a'],[-.6,1.42,2.88,.08,.16,.16,'#101010'],[.52,1.42,2.88,.08,.16,.16,'#101010']]);
 addB('bat',[[-.38,.05,.8,.24,.24,.12,'#ff3a2a'],[.14,.05,.8,.24,.24,.12,'#ff3a2a']]);
 addB('butterfly',[[-.25,0,.6,.12,.12,.12,'#101010'],[.13,0,.6,.12,.12,.12,'#101010']]);
}
// --- dodatkowe detale stworzeń (v28) ---
{const gm=(A,list)=>{const B=voxGeo(list,0.04),g=new THREE.BufferGeometry();for(const k of ['position','normal','color']){const x=A.attributes[k].array,y=B.attributes[k].array,z=new Float32Array(x.length+y.length);z.set(x);z.set(y,x.length);g.setAttribute(k,new THREE.Float32BufferAttribute(z,3))}g.computeBoundingSphere();return g};
 const aB=(k,l)=>{if(PANIM[k]&&l.length)PANIM[k].body=gm(PANIM[k].body,l)},aH=(k,l)=>{if(PANIM[k]&&l.length)PANIM[k].head=gm(PANIM[k].head,l)};
 const bb=(G)=>{const p=G.attributes.position.array;let a=[1e9,1e9,1e9],b=[-1e9,-1e9,-1e9];for(let i=0;i<p.length;i+=3)for(let j=0;j<3;j++){const v=p[i+j]/V;if(v<a[j])a[j]=v;if(v>b[j])b[j]=v}return{a,b}};
 const hs=(i,k)=>{const s=Math.sin(i*12.9898+k*78.233)*43758.5453;return s-Math.floor(s)};
 // pająki: pasy, włoski, kądziołki, wzór klepsydry
 for(const [k,c1,c2,mk] of [['spider','#3a2f2a','#4a3a32','#c83a2a'],['spiderq','#2a1f2a','#3a2a3a','#7dff8a']]){const L=[[-3.08,3.4,-5.6,6.16,4.2,.5,c2],[-3.08,3.4,-3.4,6.16,4.2,.5,c2],[-.7,3.6,-7.6,1.4,1.2,.7,c2],[-.3,3.8,-7.9,.6,.6,.4,mk],[-3.12,5,-4.8,.2,1.4,1,mk],[2.92,5,-4.8,.2,1.4,1,mk],[-3.12,5.4,-4.5,.2,.6,.4,'#101010'],[2.92,5.4,-4.5,.2,.6,.4,'#101010'],[-1.6,8.6,-6,3.2,.2,.5,mk],[-1,8.6,-2.8,2,.2,.5,mk],[-2.3,6,-.4,4.6,.35,3.6,c1]];
  for(let i=0;i<14;i++)L.push([-2.6+hs(i,1)*5,8.4,-6.6+hs(i,2)*5.6,.25,.7+hs(i,3)*.5,.25,i%3?c2:'#8a7a6a']);
  for(let i=0;i<6;i++)L.push([-2+hs(i,4)*3.8,6,-.4+hs(i,5)*3.4,.22,.6,.22,'#8a7a6a']);
  if(k==='spiderq'){for(let i=0;i<5;i++)L.push([-1.8+i*.8,8.6,-4.2,.5,1+(i%2)*.8,.5,mk]);L.push([-2,3,-8.2,4,3.6,1.6,'#e8e2d0'],[-1.6,3.4,-8.6,3.2,2.8,.5,'#d8d0bc'])}
  aB(k,L);aH(k,k==='spiderq'?[[-1.4,1.4,-.2,2.8,.4,2,'#c9a64a'],[-1.4,1.8,1.4,.5,.8,.5,'#c9a64a'],[.9,1.8,1.4,.5,.8,.5,'#c9a64a'],[-.25,1.8,1.5,.5,1.1,.5,'#c9a64a'],[-.15,2.5,1.85,.3,.3,.3,mk]]:[[-1.5,1.4,0,3,.3,1.8,'#2a221e'],[-.9,-1.9,1.9,.4,.5,.4,'#c8302a'],[.5,-1.9,1.9,.4,.5,.4,'#c8302a']])}
 // golemy: runa, pęknięcia, pas, głazy na barkach, kolce, mech, kryształy
 for(const [k,c1,c2,eye,moss] of [['golem','#7d7b78','#8d8b88','#7fe3ff','#5f7a3a'],['colossus','#5f5d5a','#6f6d6a','#ff9d2e','#4a3a2a']]){const dk=darker(c1,0.6);
  aB(k,[[-1.3,9.6,2.62,2.6,2.6,.3,dk],[-.9,10,2.8,1.8,1.8,.25,eye],[-.25,9.2,2.8,.5,3.4,.25,eye],[-2.8,7.6,2.62,.35,3.2,.2,dk],[-2.8,10.4,2.62,1.4,.35,.2,dk],[2.4,8.2,2.62,.35,2.4,.2,dk],[-4.15,7,-2.75,8.3,.9,5.5,darker(c1,0.75)],[-1,6.95,2.7,2,1,.3,c2],
   [-7,13.2,-2,3.2,1.8,4,c1],[3.8,13.2,-2,3.2,1.8,4,c1],[-6.6,15,-1.4,2.2,.5,2.6,moss],[4.2,15,-1.2,2,.5,2.2,moss],[-2.2,13.6,-3.6,1.2,2.6,1.2,c2],[.8,14,-3.6,1.2,2.2,1.2,c2],[-.6,12.6,-3.9,1.2,1.6,.8,eye],
   [-7,5,-1.9,3.4,1.6,3.8,c2],[3.6,5,-1.9,3.4,1.6,3.8,c2],[-6.9,4.8,1.3,.8,.6,.8,dk],[5.1,4.8,1.3,.8,.6,.8,dk],[-3.6,11.4,2.62,1.4,1,.3,moss],[2.2,12.6,-3.1,1.8,.8,.4,moss]]);
  aH(k,[[-2.2,2.2,1.4,4.4,.7,.6,c1],[-2.1,3.4,-1.2,1,1.4,1,moss],[-.4,3.4,-.6,.8,.9,.8,c2],[-1.8,-.4,1.75,3.6,.5,.2,dk]])}
 // slime: połysk, krople, zjedzone kości
 aB('slime',[[1,5,3.62,1.8,1.2,.2,'#d8ffc8'],[1.6,4.2,3.62,.6,.5,.2,'#d8ffc8'],[-2.8,7.2,-2.6,1.4,.3,1.4,'#c8ffb0'],[-4,0,-1.2,.8,1.8,.8,'#68bf4b'],[3.4,0,1.4,.7,1.3,.7,'#68bf4b'],[-1,0,-4.1,.8,1.1,.6,'#68bf4b'],[-.8,7.5,.6,1.8,.35,.45,'#e8e2cc'],[-1.1,7.4,.5,.5,.55,.65,'#e8e2cc'],[.9,7.4,.5,.5,.55,.65,'#e8e2cc'],[1.2,7.4,-1.6,.8,.6,.8,'#c8b048']]);
 // ropucha: brodawki, pręga, plamy
 {const L=[[-.4,4.8,-3.2,.8,.2,6.2,'#9ab04a'],[-3.55,2.4,-1.2,.2,1,1.2,'#3a5a22'],[3.35,2.6,.6,.2,.8,1,'#3a5a22'],[-3.55,2.2,1.4,.2,.7,.8,'#3a5a22']];for(let i=0;i<10;i++)L.push([-3+hs(i,6)*5.6,4.8,-3.3+hs(i,7)*6.4,.6,.35,.6,i%2?'#7a9a4a':'#3e5a26']);aB('toad',L)}
 // skorpion: segmenty, zęby szczypiec, kolce
 aB('scorpion',[[-2.7,5,-1.2,5.4,.25,.35,'#7a4818'],[-2.7,5,.9,5.4,.25,.35,'#7a4818'],[-2.7,5,-2.4,5.4,.25,.3,'#7a4818'],[2.9,3.6,5.5,.3,.4,1.4,'#f0e0c0'],[-4.2,3.6,5.5,.3,.4,1.4,'#f0e0c0'],[-2,5,-.2,.6,.6,.6,'#5a3a14'],[1.4,5,-.2,.6,.6,.6,'#5a3a14'],[-.3,5,1.6,.6,.8,.6,'#5a3a14'],[-1.6,2,-2.6,3.2,.3,4.4,'#e0b070']]);
 // krab: kolce brzegu, plamy, pąkle
 aB('crab',[[-4.4,3.4,-1.6,.6,.8,.6,'#b03828'],[3.8,3.4,-1.6,.6,.8,.6,'#b03828'],[-4.4,3.4,.6,.6,.8,.6,'#b03828'],[3.8,3.4,.6,.6,.8,.6,'#b03828'],[-2.2,4.8,-1,1,.2,1,'#f09080'],[1,4.8,.2,.8,.2,.8,'#f09080'],[-.4,4.8,-1.6,.6,.2,.6,'#f09080'],[1.8,4.8,-1.6,.9,.5,.9,'#d8d0c0'],[2,5.3,-1.4,.5,.2,.5,'#a8a090'],[4.4,3.6,3.4,.4,.6,1.8,'#f0d0b0'],[-7,3.6,3.4,.4,.6,1.8,'#f0d0b0']]);
 // yeti: kudły, frędzle, lodowe kryształy
 {const L=[[-4.2,13,-2.9,1.8,1.6,5.8,'#ffffff'],[2.4,13,-2.9,1.8,1.6,5.8,'#ffffff'],[-1,12,-3.3,1,2.2,.8,'#a8d8f0'],[.6,11.2,-3.3,.8,1.6,.7,'#c8ecff'],[-1.8,10.6,-3.2,.7,1.2,.6,'#a8d8f0']];for(let i=0;i<7;i++)L.push([-3.4+i*1,5.4-(i%2)*.5,2.3,.8,1,.5,i%2?'#e2e9ee':'#f6f9fb']);for(let i=0;i<6;i++)L.push([-6+(i%2)*9.8,8+Math.floor(i/2)*1.8,-1.4,.6,1,.6,'#ffffff']);aB('yeti',L);aH('yeti',[[-2.8,3.2,-2.4,1,1.6,1,'#ffffff'],[1.8,3.2,-2.4,1,1.6,1,'#ffffff'],[-1.2,-.4,2.3,.5,.7,.4,'#f6f2e8'],[.7,-.4,2.3,.5,.7,.4,'#f6f2e8']])}
 // ogniste żywiołaki: języki ognia, rdzeń, iskry
 {const L=[[-1.2,4,3.05,2.4,2.4,.2,'#fff2a0'],[-.6,4.6,3.2,1.2,1.2,.2,'#ffffff'],[-.5,16.2,-.5,1,1.6,1,'#ffffff']];for(let i=0;i<10;i++){const a=i/10*6.283,r=3.2+hs(i,8)*.6;L.push([Math.cos(a)*r-.4,3+hs(i,9)*8,Math.sin(a)*r-.4,.8,1.2+hs(i,10)*1.6,.8,i%3?'#ffb030':'#ffe080'])}for(let i=0;i<8;i++)L.push([-4+hs(i,11)*8,12+hs(i,12)*5,-3+hs(i,13)*6,.4,.4,.4,'#ffd34d']);aB('elemental',L)}
 // bazyliszek: łuski po bokach, plamy
 {const L=[];for(let i=0;i<8;i++){L.push([-2.72,2.2+(i%2)*.8,-4.6+i*1.2,.2,.7,1,'#2c4022']);L.push([2.52,2.2+(i%2)*.8,-4.6+i*1.2,.2,.7,1,'#2c4022'])}for(let i=0;i<7;i++)L.push([-2+hs(i,14)*3.4,4.4,-4.6+hs(i,15)*9,.8,.2,.8,'#6a8a4a']);aB('basilisk',L)}
 // gryf: pióra piersi i skrzydeł, pazury
 {const L=[[-2.4,8.2,4.75,4.8,.8,.4,'#f2efe6'],[-2,9.2,4.85,4,.8,.4,'#e8e2d0'],[-1.6,7.4,4.6,3.2,.8,.4,'#f2efe6']];for(let i=0;i<5;i++){L.push([2.8+i*1.3,10.2,2.6,1.1,.6,1.4,i%2?'#f2efe6':'#b8a070']);L.push([-3.9-i*1.3,10.2,2.6,1.1,.6,1.4,i%2?'#f2efe6':'#b8a070'])}for(let i=0;i<4;i++){L.push([8.4,10.4,-2.4+i*1.2,3.4,.4,1,'#8a6a3a']);L.push([-11.8,10.4,-2.4+i*1.2,3.4,.4,1,'#8a6a3a'])}aB('griffin',L)}
 // smok: płytki brzucha, łuski boków, brwi, pazury skrzydeł, kolce
 {const L=[];for(let i=0;i<7;i++)L.push([-3.5,6.5,-6.6+i*2,7,.2,.5,'#b08030']);for(let i=0;i<7;i++){L.push([-4.12,8.6+(i%2)*1.4,-7+i*2.2,.2,1.1,1.4,'#6a1e18']);L.push([3.92,8.6+(i%2)*1.4,-7+i*2.2,.2,1.1,1.4,'#6a1e18'])}
  L.push([19.6,11,2.6,.6,.8,1.4,'#e8d8a8'],[-20.2,11,2.6,.6,.8,1.4,'#e8d8a8'],[-.5,9.2,-24.2,1,.6,2,'#d8a040'],[-2.4,9.6,-23.4,1,.4,1.2,'#d8a040'],[1.4,9.6,-23.4,1,.4,1.2,'#d8a040']);for(let i=0;i<4;i++){L.push([-1.4-i*.2,13,8.4+i*.4,.6,1+i*.2,.6,'#d8a040'])}aB('dragon',L);
  aH('dragon',[[-2.7,2.6,2.6,1.6,.5,1.8,'#6a1e18'],[1.1,2.6,2.6,1.6,.5,1.8,'#6a1e18'],[-2.2,2.6,-2.6,.7,.7,2.4,'#e8d8a8'],[1.5,2.6,-2.6,.7,.7,2.4,'#e8d8a8'],[-2.6,-1.2,-.6,.6,.8,.6,'#d8a040'],[2,-1.2,-.6,.6,.8,.6,'#d8a040'],[-1.4,-1,8.5,.6,.3,.3,'#ff8a2e'],[.8,-1,8.5,.6,.3,.3,'#ff8a2e']])}
 // wilkołak / wilk / dzik / niedźwiedź: grzywa i szczecina wzdłuż grzbietu (z obrysu modelu)
 for(const [k,c,n,w2,col2] of []){if(!PANIM[k])continue;const {a,b}=bb(PANIM[k].body),L=[],zl=b[2]-a[2];
  for(let i=0;i<n;i++){const z=a[2]+zl*(0.3+0.6*i/n),hh=(k==='boar'?1.2:0.8)*(1-Math.abs(i/n-0.6));L.push([-w2/2,b[1]-.2,z,w2,.6+hh,zl/n*.9,i%2?c:darker(c,1.25)])}
  if(col2)L.push([-(b[0]-a[0])*0.25,a[1]+.1,b[2]-zl*0.28,(b[0]-a[0])*0.5,1.2,zl*0.22,col2]);aB(k,L)}
 aH('werewolf',[[-1.95,2.6,.2,.9,.8,.5,'#1d1410'],[1.05,2.6,.2,.9,.8,.5,'#1d1410'],[-.9,-1.6,4.6,.4,.6,.4,'#f2ead8'],[.5,-1.6,4.6,.4,.6,.4,'#f2ead8'],[-1.9,-1.4,-.4,3.8,1.4,1,'#3a302a']]);
}
// --- groźny wygląd wrogów (v29): świecące oczy ze źrenicą-szparą, gniewne brwi, kły, pazury ---
{const gm=(A,list)=>{const B=voxGeo(list,0.03),g=new THREE.BufferGeometry();for(const k of ['position','normal','color']){const x=A.attributes[k].array,y=B.attributes[k].array,z=new Float32Array(x.length+y.length);z.set(x);z.set(y,x.length);g.setAttribute(k,new THREE.Float32BufferAttribute(z,3))}g.computeBoundingSphere();return g};
 const FEG=(x,y,z,s,col,br,dz=.56)=>{const G=[[x-s/2,y,z+dz,s,s*0.95,.06,col]],H=[[x-s*.1,y+s*.08,z+dz+.06,s*.2,s*.75,.06,'#120806']];
   if(x<=0)H.push([x-s/2-.15,y+s*.88,z+dz-.02,s*.62,s*.32,.28,br],[x,y+s*.7,z+dz-.02,s*.65,s*.3,.28,br]);else H.push([x-s/2-.15+s*.03,y+s*.7,z+dz-.02,s*.65,s*.3,.28,br],[x-.05,y+s*.88,z+dz-.02,s*.62,s*.32,.28,br]);return {G,H}};
 const EYG=(hw,y,z,s,col,br)=>{const G=[[-hw-.52,y,z,.06,s*.95,s,col],[hw+.46,y,z,.06,s*.95,s,col]],H=[[-hw-.58,y+s*.08,z+s*.4,.06,s*.75,s*.2,'#120806'],[hw+.52,y+s*.08,z+s*.4,.06,s*.75,s*.2,'#120806'],
   [-hw-.66,y+s*.66,z+s*.5,.45,s*.32,s*.55,br],[-hw-.66,y+s*.86,z-.1,.45,s*.32,s*.6,br],[hw+.21,y+s*.66,z+s*.5,.45,s*.32,s*.55,br],[hw+.21,y+s*.86,z-.1,.45,s*.32,s*.6,br]];return {G,H}};
 const SET=(k,parts,extraH)=>{const A=PANIM[k];if(!A)return;let G=[],H=[];for(const p of parts){G=G.concat(p.G);H=H.concat(p.H)}if(extraH)H=H.concat(extraH);A.head=gm(A.head,H);A.glow=voxGeo(G,0)};
 const F2=(x,y,z,s,c,b,dz)=>FEG(x,y,z,s,c,b,dz);
 SET('spider',[F2(-.85,-.1,2.2,.85,'#ff2a1a','#2a1e1a'),F2(.85,-.1,2.2,.85,'#ff2a1a','#2a1e1a'),{G:[[-1.3,.6,2.3,.6,.6,.06,'#ff4a2a'],[.7,.6,2.3,.6,.6,.06,'#ff4a2a'],[-.6,1,2.3,.5,.5,.06,'#ff4a2a'],[.1,1,2.3,.5,.5,.06,'#ff4a2a']],H:[]}],[[-1,-2.4,1.7,.5,.9,.5,'#e8e2cc'],[.5,-2.4,1.7,.5,.9,.5,'#e8e2cc']]);
 SET('spiderq',[F2(-.85,-.1,2.2,.85,'#7dff4a','#1a121a'),F2(.85,-.1,2.2,.85,'#7dff4a','#1a121a'),{G:[[-1.3,.6,2.3,.6,.6,.06,'#9aff6a'],[.7,.6,2.3,.6,.6,.06,'#9aff6a'],[-.6,1,2.3,.5,.5,.06,'#9aff6a'],[.1,1,2.3,.5,.5,.06,'#9aff6a']],H:[]}],[[-1,-2.4,1.7,.5,.9,.5,'#e8e2cc'],[.5,-2.4,1.7,.5,.9,.5,'#e8e2cc']]);
 SET('slime',[F2(-1.3,0,0,1.4,'#ff3a2a','#2a5a1a',.62),F2(1.3,0,0,1.4,'#ff3a2a','#2a5a1a',.62)],[[-1.1,-2.2,.1,2.2,.7,.4,'#173016'],[-1,-1.75,.42,.35,.4,.12,'#f2ead8'],[-.3,-1.75,.42,.35,.4,.12,'#f2ead8'],[.4,-1.75,.42,.35,.4,.12,'#f2ead8'],[-.65,-2.2,.42,.3,.35,.12,'#f2ead8'],[.1,-2.2,.42,.3,.35,.12,'#f2ead8']]);
 SET('toad',[{G:[[-2.8,1.2,2.5,1.9,1.5,.06,'#ffb020'],[.9,1.2,2.5,1.9,1.5,.06,'#ffb020']],H:[[-2.05,1.3,2.56,.4,1.3,.06,'#120806'],[1.65,1.3,2.56,.4,1.3,.06,'#120806'],[-3,2.6,.4,2.1,.6,2.3,'#3e5a26'],[.8,2.6,.4,2.1,.6,2.3,'#3e5a26']]}],[[-2.2,-1.2,3.55,.4,.5,.2,'#f2ead8'],[1.8,-1.2,3.55,.4,.5,.2,'#f2ead8'],[-.8,-1.2,3.55,.3,.4,.2,'#f2ead8'],[.5,-1.2,3.55,.3,.4,.2,'#f2ead8']]);
 SET('scorpion',[F2(-.8,.1,2,.8,'#ff3a2a','#5a3a14'),F2(.8,.1,2,.8,'#ff3a2a','#5a3a14')]);
 SET('crab',[F2(-1.3,2.05,.9,.9,'#ffcf3a','#8a2a1a'),F2(1.3,2.05,.9,.9,'#ffcf3a','#8a2a1a')]);
 SET('yeti',[F2(-1,1.6,2.2,1.2,'#5ad8ff','#8fb0c0'),F2(1,1.6,2.2,1.2,'#5ad8ff','#8fb0c0')],[[-1.2,-.1,2.45,.5,.9,.35,'#ffffff'],[.7,-.1,2.45,.5,.9,.35,'#ffffff'],[-1.3,.3,2.45,2.6,.3,.3,'#2a3a4a']]);
 SET('golem',[F2(-.8,1.1,1.8,1,'#7fe3ff','#5a5856'),F2(.8,1.1,1.8,1,'#7fe3ff','#5a5856')]);
 SET('colossus',[F2(-.8,1.1,1.8,1,'#ff9d2e','#3a3836'),F2(.8,1.1,1.8,1,'#ff9d2e','#3a3836')]);
 SET('elemental',[F2(-1,0,.3,1.2,'#ffffff','#5a1a00'),F2(1,0,.3,1.2,'#ffffff','#5a1a00')]);
 SET('werewolf',[EYG(1.8,.5,1.4,.9,'#ff2a1a','#1d1410')]);SET('wolf',[EYG(1.8,.5,1.4,.9,'#ffcf3a','#3a3a40')]);
 SET('boar',[EYG(2.4,.4,2.2,1,'#ff3a2a','#1d1410')]);SET('bear',[EYG(2.6,.8,2.6,1.1,'#ffb020','#2a1a10')],[[-1,-3.1,5.4,.45,.8,.45,'#f2ead8'],[.55,-3.1,5.4,.45,.8,.45,'#f2ead8']]);
 SET('griffin',[EYG(1.8,1.7,.9,.9,'#ffb020','#8a6a3a')]);SET('basilisk',[EYG(1.8,.3,1.2,.8,'#e8ff3a','#1e2e16')]);SET('dragon',[EYG(2.4,1.1,1.2,1.2,'#ffb020','#4a120e')]);
 // pazury yeti
 if(PANIM.yeti){const L=[];for(const sx of [-5.6,3.8])for(let i=0;i<3;i++)L.push([sx+i*.7,4.6,.6,.35,1.1,.4,'#f2ead8']);PANIM.yeti.body=gm(PANIM.yeti.body,L)}
}
// --- żywiołak ognia (v31): kamienny pancerz z magmą, płonące języki ognia, pływające pięści ---
{const RK='#2a1a14',RK2='#3a2418',RK3='#22140f';
 const FIREMAT=new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:0.88,blending:THREE.AdditiveBlending,depthWrite:false});
 const TONG=voxGeo([[-.8,0,-.8,1.6,1.2,1.6,'#c83a10'],[-.65,1.1,-.65,1.3,1.2,1.3,'#ff5a14'],[-.5,2.2,-.5,1,1.1,1,'#ff8a24'],[-.34,3.2,-.34,.68,1,.68,'#ffb83a'],[-.18,4.1,-.18,.36,.8,.36,'#ffe080']],0);
 const TONGI=voxGeo([[-.45,0,-.45,.9,1.4,.9,'#ffb030'],[-.3,1.3,-.3,.6,1.2,.6,'#ffe080'],[-.14,2.4,-.14,.28,.9,.28,'#fff6c8']],0);
 const body=voxGeo([[-2.2,5.4,-1.6,4.4,2,3.2,RK],[-3.2,8,-2.2,6.4,4.2,.9,RK2],[-3.2,8,1.3,2.7,4.2,.9,RK2],[.5,8,1.3,2.7,4.2,.9,RK2],[-3.5,8.4,-1.5,.9,3.6,2.9,RK],[2.6,8.4,-1.5,.9,3.6,2.9,RK],
   [-3,12,-1.8,6,1,3.6,RK3],[-2.4,7.2,-1.4,4.8,1,2.8,RK3],[-5.6,10.6,-1.7,2.8,2.6,3.4,RK2],[2.8,10.6,-1.7,2.8,2.6,3.4,RK2],[-5.2,13,-1.2,1.6,.8,2.2,RK],[3.6,13,-1.2,1.6,.8,2.2,RK],
   [-6,7.6,-.9,1.7,2.6,1.8,RK],[4.3,7.6,-.9,1.7,2.6,1.8,RK],[-1.6,12.9,-1.2,3.2,.8,2.4,RK2],[-3.4,9.6,1.9,1.2,1,.5,RK3],[2.3,10.4,1.9,1,1.2,.5,RK3]],0.05);
 const bglow=voxGeo([[-2.8,7.6,-1.4,5.6,4.6,2.8,'#ff8a24'],[-.55,8.4,1.2,1.1,3,.3,'#fff2a0'],[-.3,9.2,1.45,.6,1.4,.2,'#ffffff'],[-2.2,7.25,1.32,.22,1.6,.06,'#ffb030'],[2,9,1.32,.22,1.4,.06,'#ffb030'],[-1.3,10.6,2.22,.8,.18,.06,'#ffb030'],
   [-5.2,11.2,1.72,.2,1.4,.06,'#ff9a2a'],[4.4,11,1.72,.2,1.6,.06,'#ff9a2a'],[-1.8,5.6,1.62,3.6,.2,.06,'#ff9a2a'],
   [-2,3,-1.4,4,2.6,2.8,'#ff6a1a'],[-1.4,1,-1,2.8,2.2,2,'#e84a10'],[-.8,-.3,-.6,1.6,1.5,1.2,'#c83a10']],0);
 const head=voxGeo([[-1.8,0,-1.6,3.6,3.2,3.2,RK],[-1.4,-1.1,-1.2,2.8,1,2.6,RK3],[-1.95,2.1,1.3,3.9,.7,.6,RK2],[-2.1,.6,-1,.5,1.6,2,RK2],[1.6,.6,-1,.5,1.6,2,RK2],[-.3,2.3,1.6,.6,1,.4,RK3]],0.05);
 const hglow=voxGeo([[-1.35,1.2,1.62,1,.45,.08,'#fff2a0'],[.35,1.2,1.62,1,.45,.08,'#fff2a0'],[-1.2,1.25,1.66,.5,.3,.06,'#ffffff'],[.7,1.25,1.66,.5,.3,.06,'#ffffff'],[-1,-.7,1.42,2,.35,.06,'#ff9a2a'],[-1.6,-.1,-1.4,3.2,.15,2.8,'#ff6a1a']],0);
 const fist=voxGeo([[-1.3,-1.2,-1.4,2.6,2.4,2.8,RK2],[-1.1,-1.5,-1.1,2.2,.4,2.2,RK],[-1.35,.6,-1.45,2.7,.4,2.9,RK3],[-1.4,-.4,.9,.6,.8,.6,RK],[.8,-.4,.9,.6,.8,.6,RK]],0.05);
 const fglow=voxGeo([[-1.36,-.4,1.42,2.72,.16,.06,'#ffb030'],[-.1,-1.2,1.42,.16,1.6,.06,'#ffb030'],[-1.2,1,-1.2,2.4,.3,2.4,'#ff8a24']],0);
 PANIM.elemental={body,head,neck:[0,12.6,.2],float:1,gait:6,glow:hglow,
  fire(root,hd){const fl=[],T=(par,x,y,z,s,inner)=>{const mm=new THREE.Mesh(inner?TONGI:TONG,FIREMAT);mm.position.set(x*V,y*V,z*V);mm.userData.s=s;mm.userData.ph=Math.random()*6;mm.scale.setScalar(s);par.add(mm);fl.push(mm)};
   root.add(new THREE.Mesh(bglow,GLOWMAT));try{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffa040,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0.6}));sp.scale.set(1.7,1.7,1);sp.position.set(0,9*V,0);root.add(sp)}catch(e){}
   for(const [x,y,z,s] of [[0,3.1,-.2,1.35],[-1,2.9,-.7,.95],[1,2.9,-.6,.95],[0,2.6,-1.3,1.1],[-.5,3,.6,.7],[.6,3,.5,.7]])T(hd,x,y,z,s);T(hd,0,3,0,1.1,1);
   for(const [x,y,z,s] of [[-4.2,13.4,0,1],[4.2,13.4,0,1],[0,12.4,-2,1.4],[-1.8,12.6,-1.4,.9],[1.8,12.6,-1.4,.9],[-4,12.8,-1.2,.7],[4,12.8,-1.2,.7],[0,1.5,0,-1.1],[0,4,-1.6,.8],[-2.6,6,-1,.6],[2.6,6,-1,.6]])T(root,x,y,z,s);
   T(root,0,12.5,-1.6,1.1,1);T(root,-4.2,13.5,0,.8,1);T(root,4.2,13.5,0,.8,1);
   const fists=[];for(const sx of [-1,1]){const g=new THREE.Group();g.position.set(sx*5.6*V,6*V,.6*V);g.userData.base=[sx*5.6*V,6*V,.6*V];const m=new THREE.Mesh(fist,root.children[0].material);m.castShadow=true;g.add(m);g.add(new THREE.Mesh(fglow,GLOWMAT));T(g,0,1,0,.8);T(g,0,.9,0,.6,1);root.add(g);fists.push(g)}
   return{fl,fists,emT:0}}};
}
function fireAnim(u,dt,m){const F=u.fire,t=u.idt;
  for(const mm of F.fl){const s=mm.userData.s,p=mm.userData.ph,f=0.72+0.38*Math.abs(Math.sin(t*8.5+p))+0.14*Math.sin(t*21+p*2);mm.scale.set(s*(1+0.1*Math.sin(t*13+p)),s*f,s*(1+0.1*Math.cos(t*11+p)));mm.rotation.y=Math.sin(t*3+p)*0.4;mm.rotation.z=Math.sin(t*5+p)*0.12}
  const sk=u.strike>0?Math.sin((1-u.strike/0.32)*Math.PI):0;F.fists.forEach((g,i)=>{const b=g.userData.base;g.position.set(b[0]-(i?1:-1)*sk*0.02,b[1]+Math.sin(t*2.4+i*2)*0.04+(u.wind||0)*0.06,b[2]+(i===(u.combo||0)%2?sk*0.45:0)-(u.wind||0)*0.08);g.rotation.y=t*0.6*(i?1:-1)});
  F.emT-=dt;if(F.emT<=0&&m&&m.parent&&typeof PFX!=='undefined'){F.emT=0.12+Math.random()*0.15;const wp=new THREE.Vector3();m.getWorldPosition(wp);PFX.emit(wp.x+(Math.random()-0.5)*0.9,wp.y+1.2+Math.random()*1.4,wp.z+(Math.random()-0.5)*0.9,1,['#ff7a1a','#ffb030','#ffe080'],{sp:0.5,up:1.8,g:-0.6,life:0.9,size:0.07})}}
// --- v32: nowe sylwetki wilka, dzika, niedźwiedzia; pajęcze nogi ---
{const gm=(A,list)=>{const B=voxGeo(list,0.03),g=new THREE.BufferGeometry();for(const k of ['position','normal','color']){const x=A.attributes[k].array,y=B.attributes[k].array,z=new Float32Array(x.length+y.length);z.set(x);z.set(y,x.length);g.setAttribute(k,new THREE.Float32BufferAttribute(z,3))}g.computeBoundingSphere();return g};
 const G='#74747a',GD='#56565c',GL='#d4d4d8',GM='#86868c';
 PANIM.wolf.body=voxGeo([[-2.1,4.4,.8,4.2,4.8,4.4,G],[-1.8,5,-3.2,3.6,3.8,4.2,G],[-2,4.8,-5.8,4,4.2,2.8,G],[-1.5,4.5,-3,3,.5,7.5,'#b8b8bc'],[-1.5,4.8,5,3,3.4,.5,GL],[-2.4,7.2,2.2,4.8,2.8,3.4,GM],[-2.2,8.4,.4,4.4,1.4,2.4,GM],
  [-1.6,8.7,-5.6,3.2,.5,8.4,GD],[-1.8,8.2,-5.7,3.6,.6,2.6,GD],[-.6,7.6,-7,1.2,1.2,1.6,G],[-.75,6,-8.4,1.5,2,1.8,'#6a6a70'],[-.6,4.4,-9.2,1.2,1.8,1.4,GL],[-2.15,5.4,-1,.1,2.4,4,'#6a6a70'],[2.05,5.4,-1,.1,2.4,4,'#6a6a70']],0.05);
 PANIM.wolf.head=gm(PANIM.wolf.head,[[-1.5,3.6,.6,.6,.7,.5,GD],[.9,3.6,.6,.6,.7,.5,GD],[-1,-1.7,3,2,.5,2.2,GD],[-2.1,-1,-.4,.5,2.2,1.2,GM],[1.6,-1,-.4,.5,2.2,1.2,GM],[-1.12,.6,3,2.24,.4,2.2,'#6a6a70'],[-.8,-1.75,4.6,.3,.5,.3,'#f2ead8'],[.5,-1.75,4.6,.3,.5,.3,'#f2ead8']]);
 PANIM.wolf.leg={...PANIM.wolf.leg,w:1.1,c:'#64646a',hoof:'#3a3a40'};
 const D='#4a3a2e',DD='#2a2018',DL='#5e4a3a';
 PANIM.boar.body=voxGeo([[-2.8,3.6,-.4,5.6,5.8,5.4,D],[-2.5,3.8,-5.8,5,4.8,5.6,D],[-2.2,3.4,-4.5,4.4,.6,9,DL],[-.9,9.2,-1,1.8,1.3,6,DD],[-.6,10.3,0,1.2,.8,4,DD],[-.7,8.4,-5.6,1.4,.8,4.8,DD],[-.5,6.6,-6.6,1,1,.9,DD],[-.3,5.4,-6.9,.6,1.4,.6,DD],
  [-2.9,5,.2,.15,3,4,'#3e3026'],[2.75,5,.2,.15,3,4,'#3e3026'],[-2.6,3.6,3.6,5.2,3,1.6,'#3e3026']],0.06);
 PANIM.boar.head=gm(PANIM.boar.head,[[-2.1,-.3,5.1,.45,.7,.45,'#f0ead0'],[1.65,-.3,5.1,.45,.7,.45,'#f0ead0'],[-2.4,.3,4.9,.45,.45,.45,'#e8e0c0'],[1.95,.3,4.9,.45,.45,.45,'#e8e0c0'],[-1.3,-1.7,5.95,2.6,2,.35,'#7a5a4a'],[-.8,-1.1,6.3,.5,.6,.1,'#2a1a14'],[.3,-1.1,6.3,.5,.6,.1,'#2a1a14'],[-.6,2.4,-.2,1.2,1.2,3,DD]]);
 const BR='#5a3a22',BD='#3e2616';
 PANIM.bear.body=voxGeo([[-3.4,4.4,-6.2,6.8,6,7,BR],[-3.6,4.4,.4,7.2,6.8,5.6,BR],[-2.6,10.6,0,5.2,1.8,4.6,BD],[-2,12.2,1,4,.6,2.6,BD],[-3,4.2,-5,6,.8,10,BD],[-.8,7.6,-6.8,1.6,1.4,.8,BD],[-3.65,5,1,.15,4,4,'#4a2e1a'],[3.5,5,1,.15,4,4,'#4a2e1a'],[-3.2,4.6,5.9,6.4,4.8,.3,'#4a2e1a']],0.06);
 PANIM.bear.head=gm(PANIM.bear.head,[[-2.9,2,.4,1.6,1.6,1.2,BD],[1.3,2,.4,1.6,1.6,1.2,BD],[-2.4,2.3,.7,.8,.8,.3,'#8a6a4a'],[1.6,2.3,.7,.8,.8,.3,'#8a6a4a'],[-1.1,-2.6,4.2,2.2,.4,1.8,BD]]);
 PANIM.bear.leg={...PANIM.bear.leg,w:2.4};
 for(const k of ['spider','spiderq','scorpion','crab'])if(PANIM[k]&&PANIM[k].leg)PANIM[k].leg={...PANIM[k].leg,arach:1};
}
// pajęcza noga: udo w górę i na zewnątrz, kolano wyżej niż ciało, goleń w dół do ziemi
function buildArachLegs(A,kind,root,mat){const L=A.leg,legs=[],hips=L.hips,zs=hips.map(h=>h[1]),zmin=Math.min(...zs),zmax=Math.max(...zs),hy=L.h*Math.cos(L.splay||0);
  const key=kind+'|arach';let geo=legCache[key];
  const Lf=Math.max(2.2,L.h*0.8),a1=0.75,a2=2.05,Lt=(hy+Lf*Math.sin(a1))/Math.sin(a2-a1)*1.0;
  if(!geo){const w=L.w,c=L.c,dk=darker(c,0.65),lt=darker(c,1.25);
    geo=legCache[key]={f:voxGeo([[0,-w*.55,-w*.55,Lf,w*1.1,w*1.1,c],[Lf*.3,w*.45,-w*.3,Lf*.5,.12,w*.6,lt],[Lf-.15,-w*.6,-w*.6,w*1.2,w*1.2,w*1.2,dk]],0),
      t:voxGeo([[0,-w*.4,-w*.4,Lt,w*.8,w*.8,c],[Lt*.25,w*.3,-w*.2,Lt*.4,.1,w*.4,lt],[Lt-.4,-w*.3,-w*.3,.5,w*.6,w*.6,dk]],0),Lf,Lt}}
  hips.forEach((hp,k)=>{const side=hp[0]<0?-1:1,f=zmax>zmin?(hp[1]-zmin)/(zmax-zmin):0.5,fan=(f-0.5)*1.7; // przód (f=1) do przodu
    const p=new THREE.Group();p.position.set(hp[0]*V,hy*V,hp[1]*V);const y0=side>0?-fan:Math.PI+fan;p.rotation.y=y0;
    const fm=new THREE.Mesh(geo.f,mat);fm.castShadow=true;fm.rotation.z=a1;p.add(fm);const kn=new THREE.Group();kn.position.set(geo.Lf*V,0,0);fm.add(kn);
    const tm=new THREE.Mesh(geo.t,mat);tm.castShadow=true;tm.rotation.z=-a2;kn.add(tm);
    p.userData={off:(k%4===0||k%4===3)?0:Math.PI,ar:1,y0,fm,yb:hy*V};root.add(p);legs.push(p)});
  return legs}
// --- skrzydła smoka jako osobne, animowane części (v37) ---
{const stripWings=(G,lim)=>{if(G.index)G=G.toNonIndexed();const P=G.attributes.position.array,N=G.attributes.normal.array,Cc=G.attributes.color.array,keepP=[],keepN=[],keepC=[],L=lim*V;
  for(let t=0;t<P.length;t+=9){if(Math.abs(P[t])>L&&Math.abs(P[t+3])>L&&Math.abs(P[t+6])>L)continue;if(Math.max(Math.abs(P[t]),Math.abs(P[t+3]),Math.abs(P[t+6]))>L&&P[t+1]>10.6*V)continue;for(let k=0;k<9;k++){keepP.push(P[t+k]);keepN.push(N[t+k]);keepC.push(Cc[t+k])}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(keepP,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(keepN,3));g.setAttribute('color',new THREE.Float32BufferAttribute(keepC,3));g.computeBoundingSphere();return g};
 PANIM.dragon.body=stripWings(PANIM.dragon.body,4.3);
 const DD='#6a1e18',M1='#a8342a',M2='#93281f',M3='#7a221c',CL='#e8d8a8';
 PANIM.dragon.wing=voxGeo([[0,-0.45,-0.55,6,0.9,1.1,DD],[5.6,-0.35,-0.45,6.6,0.7,0.9,DD],[11.8,0,0.3,0.7,0.6,1.3,CL],[12,-0.3,-0.9,4.6,0.5,0.5,DD],[16.2,-0.3,-4.8,0.5,0.5,4.2,DD],[16.4,-0.2,-5.4,0.4,0.4,0.8,CL],
   [5.8,-0.28,-8,0.5,0.5,7.6,DD],[9,-0.28,-8.6,0.5,0.5,8.2,DD],[11.9,-0.28,-7.2,0.5,0.5,6.8,DD],
   [0.4,-0.18,-6.6,5.5,0.3,6.2,M1],[6.3,-0.18,-8,2.7,0.3,7.6,M2],[9.5,-0.18,-8.4,2.4,0.3,8,M1],[12.4,-0.18,-6.8,3.8,0.3,5.9,M2],
   [0.6,-0.18,-7.4,5,0.3,0.8,M3],[6.6,-0.18,-8.8,2.2,0.3,0.8,M3],[9.8,-0.18,-9.2,1.9,0.3,0.8,M3],[12.6,-0.18,-7.6,3.2,0.3,0.8,M3],
   [1.5,0.0,-4,3.6,0.08,0.2,DD],[7,0.0,-5,1.4,0.08,0.2,DD],[13,0.0,-4,2.4,0.08,0.2,DD]],0.04);
 PANIM.dragon.wingP=[4,12.3,0.6];
 // realistyczny smok: smukły tułów, długa szyja i ogon z segmentów, rogi, zęby
 {const DR='#8a2a22',DR2='#7a241c',DD='#5a1a14',DG='#d8a040',DG2='#c08a30',HN='#e8d8a8',Lb=[];const B=(...b)=>Lb.push(b);
  B(-3.4,7.6,0.6,6.8,5.6,7.2,DR);B(-3.6,8.4,1.4,7.2,4.2,5.6,DR2);B(-3,7.9,-5.2,6,5,6.2,DR);B(-2.6,8.1,-9.4,5.2,4.4,4.6,DR);
  for(let z=-8.6;z<7.4;z+=1.5)B(-2.3,7.25,z,4.6,0.5,1.3,z%3<1.5?DG:DG2);
  for(let z=-9;z<7.2;z+=1.6){const hh=1+Math.sin((z+9)/16*Math.PI)*1.1;B(-0.35,13.1,z,0.7,hh,0.9,DG);B(-0.2,13.1+hh,z+0.2,0.4,0.5,0.5,HN)}
  for(let z=-8;z<7;z+=2.2)for(const sx of [-1,1])B(sx>0?3.3:-3.5,9.4+((z*7)|0)%2*0.8,z,0.2,1.2,1.6,DD);
  const NK=[[-1.9,10.6,7.4,3.8,3.4,2.6],[-1.7,12,9.4,3.4,3.2,2.4],[-1.5,13.4,11.2,3,3,2.2],[-1.35,14.7,12.8,2.7,2.8,2]];NK.forEach((q,i)=>{B(...q,i%2?DR:DR2);B(q[0]+0.5,q[1]-0.25,q[2]+0.2,q[3]-1,0.5,q[5]-0.4,DG);B(-0.3,q[1]+q[4],q[2]+0.4,0.6,0.9,0.8,DG)});
  const TL=[[-2.2,8.4,-13.4,4.4,3.6,4],[-1.75,8.5,-17.2,3.5,2.9,3.9],[-1.3,8.4,-20.9,2.6,2.3,3.8],[-0.9,8.2,-24.5,1.8,1.7,3.7],[-0.55,8,-27.9,1.1,1.2,3.5]];TL.forEach((q,i)=>{B(...q,i%2?DR2:DR);B(-0.25,q[1]+q[4],q[2]+1,0.5,0.8-i*0.08,1,DG);B(q[0]+0.4,q[1]-0.25,q[2],q[3]-0.8,0.3,q[5],DG2)});
  B(-1.9,7.9,-30.4,3.8,0.5,2.6,DG);B(-1.1,7.95,-31.6,2.2,0.45,1.4,DG);B(-0.5,8,-32.4,1,0.4,0.9,DG2);
  PANIM.dragon.body=voxGeo(Lb,0.05);
  PANIM.dragon.head=voxGeo([[-1.8,-1,-0.6,3.6,2.8,3.4,DR],[-1.35,-1.1,2.7,2.7,1.8,3.5,DR],[-1.45,0.6,2.5,2.9,0.45,3.2,DD],[-1.25,-2.05,2.4,2.5,0.8,3.3,DD],[-1.2,-2.6,0.2,2.4,0.7,2.6,DG],
    ...[0,1,2,3,4].flatMap(i=>[[-1.2,-1.35,3+i*0.62,0.28,0.45,0.28,'#f6f0e0'],[0.92,-1.35,3+i*0.62,0.28,0.45,0.28,'#f6f0e0']]),[-0.9,-0.4,6.15,0.5,0.35,0.15,'#1a0806'],[0.4,-0.4,6.15,0.5,0.35,0.15,'#1a0806'],
    [-2,1.5,1.2,0.9,0.5,1.4,DD],[1.1,1.5,1.2,0.9,0.5,1.4,DD],[-1.7,1.7,-1.4,0.65,0.65,2.4,HN],[1.05,1.7,-1.4,0.65,0.65,2.4,HN],[-1.85,2.1,-3.4,0.5,0.5,2.2,HN],[1.35,2.1,-3.4,0.5,0.5,2.2,HN],[-1.9,2.5,-4.4,0.4,0.4,1,'#d0c090'],[1.5,2.5,-4.4,0.4,0.4,1,'#d0c090'],
    [-2.3,-0.6,0,0.5,1.4,0.5,DG],[1.8,-0.6,0,0.5,1.4,0.5,DG],[-2.4,0.2,-0.4,0.4,0.9,0.4,DG],[2,0.2,-0.4,0.4,0.9,0.4,DG],[-0.3,1.8,0.2,0.6,0.7,2,DG],
    [-1.92,0.35,1.3,0.12,0.55,0.9,'#2a0a04'],[1.8,0.35,1.3,0.12,0.55,0.9,'#2a0a04']],0.04);
  PANIM.dragon.glow=voxGeo([[-1.98,0.4,1.4,0.06,0.42,0.75,'#ffb020'],[1.92,0.4,1.4,0.06,0.42,0.75,'#ffb020'],[-1.99,0.45,1.65,0.05,0.32,0.12,'#1a0400'],[1.94,0.45,1.65,0.05,0.32,0.12,'#1a0400']],0);
  PANIM.dragon.neck=[0,15.6,14.4];PANIM.dragon.wingP=[3.4,12.6,3];PANIM.dragon.wingS=1.25;PANIM.dragon.leg={...PANIM.dragon.leg,w:2.4,h:7,hips:[[-2.9,4.6],[2.9,4.6],[-2.7,-6.4],[2.7,-6.4]]};}
}

// ===== nowe stworzenia (v36): lodowy golem, wiwerna, żubr, bóbr, jeż, flaming =====
{const R=PANIM.__rec,EYb=(hw,y,z,s)=>[[-hw-.25,y,z,.5,s,s,'#f6f2e8'],[hw-.25,y,z,.5,s,s,'#f6f2e8'],[-hw-.45,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010'],[hw+.05,y+s*.2,z+s*.25,.4,s*.6,s*.6,'#101010']];
 // lodowy golem: lód z kryształami i niebieskim rdzeniem
 const IC='#a8d0e8',IC2='#c8e4f4',IC3='#e8f6ff',IB='#5ad8ff';
 PANIM.icegolem={...PANIM.golem,body:R(PANIM.golem.body,(r,g,b)=>{const l=(r+g+b)/3;return[l*0.72+0.18,l*0.86+0.2,l*0.95+0.28]}),head:R(PANIM.golem.head,(r,g,b)=>{const l=(r+g+b)/3;return b>r+0.2?null:[l*0.72+0.18,l*0.86+0.2,l*0.95+0.28]})};
 {const gm=(A,list)=>{const B=voxGeo(list,0.03),g=new THREE.BufferGeometry();for(const k of ['position','normal','color']){const x=A.attributes[k].array,y=B.attributes[k].array,z=new Float32Array(x.length+y.length);z.set(x);z.set(y,x.length);g.setAttribute(k,new THREE.Float32BufferAttribute(z,3))}g.computeBoundingSphere();return g};
  const L=[];for(const [x,y,z,h] of [[-5.4,15,-0.4,3],[-4.4,15.4,0.6,2],[4.2,15,-0.6,3.2],[5.2,15.2,0.4,2.2],[-1.2,14.6,-3.4,2.6],[0.6,14.8,-3.6,3.4],[-2.6,13.2,-3.2,1.8],[2.2,13.4,-3.2,2]])L.push([x,y,z,0.9,h,0.9,IC3],[x+0.2,y+h,z+0.2,0.5,0.8,0.5,'#ffffff']);
  L.push([-1.5,9.4,2.65,3,3,0.3,IB],[-0.8,10.1,2.9,1.6,1.6,0.3,'#e8ffff'],[-4.1,7.1,-2.7,8.2,0.4,5.4,IC2]);PANIM.icegolem.body=gm(PANIM.icegolem.body,L);
  PANIM.icegolem.head=gm(PANIM.icegolem.head,[[-1.6,3.4,-1,0.7,1.4,0.7,IC3],[0.9,3.4,-1,0.7,1.6,0.7,IC3],[-0.3,3.6,-1.4,0.6,1.8,0.6,'#ffffff']]);
  PANIM.icegolem.glow=voxGeo([[-1.1,1.2,2.36,0.8,0.55,0.06,'#9ff0ff'],[0.3,1.2,2.36,0.8,0.55,0.06,'#9ff0ff']],0)}
 // wiwerna: mniejszy, zielono-turkusowy smok z trującym kolcem
 PANIM.wyvern={...PANIM.dragon,body:R(PANIM.dragon.body,(r,g,b)=>r>g+0.08?[g*0.5+0.08,r*0.62+0.12,b*0.7+0.18]:null),head:R(PANIM.dragon.head,(r,g,b)=>r>g+0.08&&r<0.95?[g*0.5+0.08,r*0.62+0.12,b*0.7+0.18]:null)};
 if(PANIM.dragon.glow)PANIM.wyvern.glow=PANIM.dragon.glow;PANIM.wyvern.wing=R(PANIM.dragon.wing,(r,g,b)=>r>g+0.08&&r<0.95?[g*0.5+0.08,r*0.62+0.12,b*0.7+0.18]:null);PANIM.wyvern.wingP=[3.4,12.4,1];PANIM.wyvern.wingS=1.35;PANIM.wyvern.leg={...PANIM.dragon.leg,c:'#2a5a3a',hoof:'#14281a',w:2.6,hips:[[-2.8,-1.6],[2.8,-1.6]]};PANIM.icegolem.leg={...PANIM.golem.leg,c:'#9ac4dc',hoof:'#c8e4f4'};
 // żubr
 PANIM.bison={body:voxGeo([[-3.4,5,-6.2,6.8,6,7,'#5a3e2a'],[-3.8,4.6,0.4,7.6,8,6,'#3e2a1c'],[-2.8,12.4,0.8,5.6,1.8,4.4,'#33231a'],[-3.9,4.2,0.6,7.8,2.6,5.8,'#4a3424'],[-3.2,4.6,-5.6,6.4,0.6,6,'#4a3424'],[-0.4,7.6,-7,0.8,3,0.8,'#2a1e14'],[-0.6,6.2,-7.2,1.2,1.4,1.2,'#1e140c'],[-3.95,6,1,0.15,5,4.6,'#4a3424'],[3.8,6,1,0.15,5,4.6,'#4a3424'],[-3.5,10.8,-5.8,7,0.4,6,'#4e3624']],0.06),
  head:voxGeo([...EYb(2.4,0,2.4,0.9),[-2.4,-3,0,4.8,4.8,4,'#2e2016'],[-2.6,-1,-0.6,5.2,3.6,1.6,'#3e2a1c'],[-1.6,-3.2,3.8,3.2,2.4,1.2,'#1e140c'],[-1,-2.4,5,0.6,0.5,0.1,'#0a0605'],[0.4,-2.4,5,0.6,0.5,0.1,'#0a0605'],[-1.2,-4.6,2,2.4,1.8,1.6,'#2a1e14'],[-3.4,1.2,1,1.2,0.8,0.8,'#e8e0c8'],[-3.8,1.8,1.4,0.6,1,0.6,'#d8d0b8'],[2.2,1.2,1,1.2,0.8,0.8,'#e8e0c8'],[3.2,1.8,1.4,0.6,1,0.6,'#d8d0b8'],[-2,1.8,0,4,1,3,'#4a3424']],0.05),
  neck:[0,8.4,6.2],leg:{w:1.9,h:5,c:'#3a2a1e',hoof:'#1a120c',hips:[[-2.6,-4.6],[2.6,-4.6],[-2.6,4.4],[2.6,4.4]],amp:0.45},gait:5};
 // bóbr
 PANIM.beaver={body:voxGeo([[-1.6,0.6,-2.2,3.2,2.6,4.4,'#6a4a2e'],[-1.3,0.5,-1.8,2.6,0.4,3.6,'#8a6a4a'],[-1.1,0.7,-4.8,2.2,0.4,2.8,'#3a2a1e'],[-1,1.11,-4.6,2,0.06,2.4,'#2a1e14'],[-1.7,1.4,-1.6,0.1,1.4,3,'#5a3e26'],[1.6,1.4,-1.6,0.1,1.4,3,'#5a3e26'],[-1.4,3.1,-1.8,2.8,0.2,3.4,'#7a5a3a']],0.05),
  head:voxGeo([...EYb(1.3,0.2,1.2,0.6),[-1.3,-1,0,2.6,2.2,2.2,'#6a4a2e'],[-0.8,-1,2,1.6,1.2,0.8,'#5a3e26'],[-0.4,-0.2,2.75,0.8,0.4,0.15,'#1a1210'],[-0.35,-1.3,2.6,0.7,0.5,0.12,'#f0b050'],[-1.4,1,0.4,0.5,0.5,0.4,'#4a3220'],[0.9,1,0.4,0.5,0.5,0.4,'#4a3220'],[-0.9,-0.6,2.75,0.3,0.06,0.3,'#e8e0c8'],[0.6,-0.6,2.75,0.3,0.06,0.3,'#e8e0c8']],0.04),
  neck:[0,2.4,2.2],leg:{w:0.9,h:1.1,c:'#4a3220',hoof:'#2a1e14',hips:[[-1.2,-1.4],[1.2,-1.4],[-1.1,1.4],[1.1,1.4]],amp:0.6},gait:10};
 // jeż: kopułka z kolcami skierowanymi do tyłu, jasna mordka
 {const L=[[-1.5,0.4,-1.9,3,1.3,3.6,'#7a6050'],[-1.3,0.3,-1.5,2.6,0.4,2.8,'#c8a888']];
  for(let i=0;i<7;i++)for(let j=0;j<8;j++){const x=-1.5+i*0.5,z=-2+j*0.5,e=1-Math.pow(x/1.75,2)-Math.pow((z+0.1)/2.2,2);if(e<=0.02)continue;const y=1.3+1.2*Math.sqrt(e);const c=['#3a2e24','#4e3e30','#2a2018','#5a4838'][(i*3+j)%4];
    L.push([x,y-0.25,z,0.42,0.5,0.42,'#4a3a2c'],[x+0.04,y+0.05,z-0.25,0.24,0.24,0.75,c],[x+0.08,y+0.1,z-0.68,0.14,0.14,0.22,'#ead8c0'])}
  for(const s of [-1,1])for(let j=0;j<6;j++)L.push([s>0?1.3:-1.65,0.9+(j%2)*0.2,-1.9+j*0.6,0.35,0.6,0.7,'#3a2e24'],[s>0?1.45:-1.7,1.1,-2.2+j*0.6,0.2,0.2,0.3,'#ead8c0']);
  L.push([-0.9,0.1,0.9,0.5,0.35,0.6,'#8a6a5a'],[0.4,0.1,0.9,0.5,0.35,0.6,'#8a6a5a']);
  PANIM.hedgehog={body:voxGeo(L,0.04),head:voxGeo([[-0.75,-0.55,0,1.5,1.1,1.1,'#d8b898'],[-0.5,-0.5,1,1,0.75,0.6,'#e0c0a0'],[-0.28,-0.42,1.55,0.56,0.5,0.4,'#e8c8a8'],[-0.18,-0.25,1.9,0.36,0.3,0.15,'#1a1210'],[-0.62,0.05,0.85,0.22,0.24,0.14,'#101010'],[0.4,0.05,0.85,0.22,0.24,0.14,'#101010'],[-0.56,0.18,0.95,0.07,0.07,0.06,'#ffffff'],[0.46,0.18,0.95,0.07,0.07,0.06,'#ffffff'],[-0.75,0.4,0.15,0.3,0.32,0.22,'#b89878'],[0.45,0.4,0.15,0.3,0.32,0.22,'#b89878'],[-0.8,0.45,-0.3,1.6,0.4,0.6,'#4a3a2c']],0.03),neck:[0,1.0,1.7],leg:{w:0.45,h:0.45,c:'#8a6a5a',hips:[[-0.8,-1],[0.8,-1],[-0.8,1],[0.8,1]],amp:0.7},gait:14}}
 // flaming
 PANIM.flamingo={body:voxGeo([[-1.4,7,-2.4,2.8,2.4,4.2,'#f4a0b0'],[-1.5,7.6,-2.2,0.2,1.6,3.4,'#e88898'],[1.3,7.6,-2.2,0.2,1.6,3.4,'#e88898'],[-1.2,8.4,-2.8,2.4,1,1,'#e88898'],[-1.1,8.3,-3.3,2.2,0.9,0.6,'#1a1a1a'],[-1.2,6.8,-1.8,2.4,0.4,3,'#f8b8c4']],0.04),
  head:voxGeo([[-0.3,0,0,0.6,2,0.6,'#f4a0b0'],[-0.3,1.8,0.3,0.6,1.8,0.6,'#f4a0b0'],[-0.6,3.4,0.4,1.2,1,1.4,'#f4a0b0'],[-0.25,3.3,1.7,0.5,0.5,0.9,'#f0f0f0'],[-0.25,2.9,2.4,0.5,0.6,0.5,'#1a1a1a'],[-0.65,3.9,1.1,0.08,0.24,0.24,'#f0c020'],[0.57,3.9,1.1,0.08,0.24,0.24,'#f0c020'],[-0.7,3.95,1.15,0.06,0.12,0.12,'#101010'],[0.64,3.95,1.15,0.06,0.12,0.12,'#101010']],0.03),
  neck:[0,9,1.6],leg:{w:0.38,h:7,c:'#e8a0a8',hoof:'#c8707a',hips:[[-0.6,0],[0.6,0]],amp:0.5},gait:7};
 Object.assign(EDEF,{
  kultysta:HB({n:'Kultysta',hp:48,dmg:12,spd:4.4,aggro:18,rng:1.8,cd:1.4,ranged:{rng:16,proj:'curse',cd:2.3},bh:2.2}),
  mroczny_rycerz:HB({n:'Mroczny rycerz',hp:110,dmg:17,spd:4.2,aggro:16,rng:2.3,cd:1.3,bh:2.5}),
  lodowy_golem:Object.assign({},EDEF.golem,{n:'Lodowy golem',hp:150,dmg:18,spd:3.0,aggro:13}),
  wiwerna:Object.assign({},EDEF.gryf,{n:'Wiwerna',hp:120,dmg:16,spd:5.6,aggro:18,rng:2.2,cd:1.3,ranged:{rng:13,proj:'poison',cd:3},bh:2.4}),
  zubr:Object.assign({},EDEF.krowa,{n:'Żubr',hp:70,dmg:6,spd:3.0,food:null,pb:[2,3,12]}),
  bobr:Object.assign({},EDEF.krolik,{n:'Bóbr',hp:14,spd:2.6,hop:0,food:null,pb:[3,7,10]}),
  jez:Object.assign({},EDEF.krolik,{n:'Jeż',hp:8,spd:1.8,hop:0,food:null,pb:[2,3,10,11]}),
  flaming:Object.assign({},EDEF.kaczka,{n:'Flaming',hp:12,spd:3.0,food:null,pb:[1,7,9]})});
 for(const k of ['zubr','bobr','jez','flaming'])for(const b of EDEF[k].pb)(BIOME_P[b]=BIOME_P[b]||[]).push(k);
 Object.assign(HERD,{zubr:3,flaming:4,bobr:2});
 // ===== fantastyczne stworzenia pasywne (oswajalne; większe można dosiadać) =====
 Object.assign(EDEF,{
  jednorozec:PAS(Q({L:1.5,W:0.54,Hb:0.64,legL:0.84,legW:0.14,c:'#f6f3fa',c2:'#e8e2f2',hs:0.32,hy:0.8,hz:0.04,neck:[0.3,0.64,0.4],snout:[0.3,0.22,0.22,'#ece6f4'],nose:'#c8a8d8',ears:'up',eh:0.12,eye:'#7a4ab8',tail:'hang',tc:'#d8a8f0',lc:'#efeaf6',hoof:'#d9b23a',
    extra:(y,hy,hf,L,W,Hb,hs)=>{const t=y+hy+hs/2,z=L/2+0.04,M=['#f0a8d8','#c8a8f0','#a8d8f0','#f0e0a8'],a=[[0,t+0.16,z+0.08,0.08,0.3,0.08,'!#ffe28a'],[0,t+0.34,z+0.12,0.05,0.16,0.05,'!#fff4c8']];for(let k=0;k<5;k++)a.push([0,y+0.78-k*0.13,L/2-0.12-k*0.07,0.1,0.18,0.2,M[k%4]]);a.push([0,y+Hb/2+0.03,-L/2+0.1,0.12,0.12,0.16,M[1]]);return a}}),'Jednorożec',60,3.8,'tecza',[11,2]),
  pegaz:PAS(Q({L:1.55,W:0.56,Hb:0.66,legL:0.82,legW:0.15,c:'#e8ecf2',c2:'#d8dee8',hs:0.32,hy:0.78,hz:0.04,neck:[0.3,0.62,0.4],snout:[0.32,0.24,0.24,'#dfe4ec'],nose:'#8a8f9a',ears:'up',eh:0.12,eye:'#2a4a8a',tail:'hang',tc:'#b8c4d8',lc:'#e0e5ee',hoof:'#8a8f9a',
    extra:(y,hy,hf,L,W)=>{const a=[[0,y+0.72,L/2-0.18,0.08,0.5,0.24,'#b8c4d8'],[0,y+0.36,L/2-0.36,0.08,0.4,0.22,'#b8c4d8']];for(const sg of [1,-1])a.push([sg*(W/2+0.35),y+0.42,0.08,0.7,0.08,0.7,'#f4f6fa'],[sg*(W/2+0.85),y+0.52,-0.05,0.5,0.06,0.56,'#eaeef6'],[sg*(W/2+1.2),y+0.6,-0.18,0.32,0.05,0.4,'#dde4ee']);return a}}),'Pegaz',58,4.0,'chmurka',[6,11]),
  jelen_ks:PAS(Q({L:1.3,W:0.5,Hb:0.6,legL:0.84,legW:0.12,c:'#9ab4d8',c2:'#e8f0fa',hs:0.3,hy:0.66,hz:0.02,neck:[0.26,0.5,0.32],snout:[0.18,0.18,0.18,'#8aa4c8'],nose:'#2a3a5a',eye:'#bff4ff',ears:'side',eh:0.16,tail:'short',tc:'#f2f6fc',lc:'#7a94b8',hoof:'#3a4a6a',
    extra:(y,hy,hf,L,W,Hb,hs)=>{const a='!#9fe8ff',t=y+hy+hs/2,z=L/2+0.02,r=[[0.12,t+0.2,z,0.05,0.4,0.05,a],[-0.12,t+0.2,z,0.05,0.4,0.05,a],[0.26,t+0.36,z-0.04,0.26,0.05,0.05,a],[-0.26,t+0.36,z-0.04,0.26,0.05,0.05,a],[0.16,t+0.48,z+0.06,0.05,0.22,0.05,a],[-0.16,t+0.48,z+0.06,0.05,0.22,0.05,a],[0.36,t+0.5,z-0.06,0.05,0.24,0.05,a],[-0.36,t+0.5,z-0.06,0.05,0.24,0.05,a]];for(let k=0;k<5;k++)r.push([(k%2?0.18:-0.2),y+Hb/2+0.005,0.35-k*0.18,0.08,0.02,0.08,'!#d8f8ff']);return r}}),'Księżycowy jeleń',40,4.2,'ksiezycowe_jagody',[3,10,5]),
  slimak:PAS({n:'',parts:[[0,0.14,0.05,0.42,0.22,1.3,'#c8b088'],[0,0.08,0.05,0.46,0.06,1.36,'#a8906a'],[0,0.24,0.62,0.3,0.26,0.24,'#c8b088'],[0.08,0.48,0.66,0.03,0.24,0.03,'#a8906a'],[-0.08,0.48,0.66,0.03,0.24,0.03,'#a8906a'],[0.08,0.61,0.66,0.07,0.07,0.07,'#2a1a10'],[-0.08,0.61,0.66,0.07,0.07,0.07,'#2a1a10'],
    [0,0.62,-0.12,0.5,0.74,0.74,'#a8642e'],[0,0.62,-0.12,0.54,0.56,0.56,'#c8823a'],[0,0.64,-0.1,0.58,0.36,0.36,'#e8a85a'],[0,0.66,-0.08,0.62,0.16,0.16,'#f4d08a'],[0,0.98,-0.14,0.36,0.08,0.5,'#8a4a22']],legs:[],lw:0.1,lh:0.1,lc:'#c8b088'},'Olbrzymi ślimak',34,0.7,'liscie',[7,19,3]),
  zolw_kr:PAS({n:'',parts:[[0,0.26,0,0.86,0.3,1.04,'#4a5a6a'],[0,0.44,0,0.66,0.14,0.8,'#5a6a7a'],[0,0.12,0,0.94,0.08,1.1,'#7a8a9a'],[0,0.26,0.64,0.26,0.22,0.3,'#8a9aaa'],[0.07,0.32,0.8,0.05,0.05,0.03,'#bff4ff'],[-0.07,0.32,0.8,0.05,0.05,0.03,'#bff4ff'],
    [0,0.66,0,0.14,0.4,0.14,'!#9fe8ff'],[0.22,0.6,0.2,0.1,0.28,0.1,'!#c8a8ff'],[-0.22,0.6,-0.18,0.1,0.3,0.1,'!#9fe8ff'],[0.2,0.58,-0.26,0.08,0.22,0.08,'!#a8ffd8'],[-0.2,0.58,0.24,0.09,0.24,0.09,'!#c8a8ff'],[0,0.84,0,0.08,0.12,0.08,'!#e8fbff']],
    legs:[[0.34,0.16,0.34,0],[-0.34,0.16,0.34,1],[0.34,0.16,-0.34,1],[-0.34,0.16,-0.34,0]],lw:0.16,lh:0.16,lc:'#8a9aaa'},'Kryształowy żółw',80,1.0,'okruch',[18,22,6]),
  lis_og:PAS(Q({L:0.78,W:0.32,Hb:0.32,legL:0.28,legW:0.08,c:'#e8803a',c2:'#ffe0b0',hs:0.3,snout:[0.2,0.12,0.14,'#ffe0b0'],nose:'#1a1a1a',eye:'#ffd23a',ears:'up',eh:0.22,ec:'#c84a1a',tail:'fluffy',tc:'#ff7a2a',tip:'!#ffd34d',lc:'#5a2a18',
    extra:(y,hy,hf,L)=>[[0,y+0.12,-L/2-0.42,0.12,0.2,0.14,'!#ff9a3a'],[0,y+0.26,-L/2-0.52,0.08,0.18,0.08,'!#ffe08a']]}),'Ognisty lisek',22,4.6,'wegielek',[16,4]),
  szronolis:PAS(Q({L:0.8,W:0.34,Hb:0.34,legL:0.3,legW:0.08,c:'#e8f2fa',c2:'#ffffff',hs:0.3,snout:[0.2,0.12,0.14,'#ffffff'],nose:'#2a3a4a',eye:'#5ac8ff',ears:'up',eh:0.17,ec:'#c8dcf0',tail:'fluffy',tc:'#d8ecfa',tip:'!#bff4ff',lc:'#a8c0d8',
    extra:(y,hy,hf,L,W,Hb)=>[[0,y+Hb/2+0.03,0.05,0.08,0.06,0.4,'!#bff4ff']]}),'Szronolis',20,4.4,'szron',[5,21,23]),
  grzybolak:PAS(Q({L:0.9,W:0.56,Hb:0.48,legL:0.24,legW:0.14,c:'#d8c8b0',c2:'#c8b8a0',hs:0.36,snout:[0.1,0.16,0.22,'#c8a890'],nose:'#8a5a4a',ears:'down',ec:'#c8b8a0',eh:0.12,eye:'#3a2a20',tail:'short',lc:'#b8a890',
    extra:(y,hy,hf,L,W,Hb)=>[[0,y+Hb/2+0.16,-0.05,0.86,0.2,0.8,'#c03a3a'],[0,y+Hb/2+0.3,-0.05,0.6,0.12,0.56,'#c03a3a'],[0.22,y+Hb/2+0.27,0.15,0.1,0.04,0.1,'!#f4f0e0'],[-0.2,y+Hb/2+0.27,-0.2,0.1,0.04,0.1,'!#f4f0e0'],[0.05,y+Hb/2+0.37,0,0.1,0.04,0.1,'!#f4f0e0'],[-0.28,y+Hb/2+0.2,0.22,0.08,0.04,0.08,'!#f4f0e0'],[0,y+Hb/2+0.03,-0.05,0.26,0.1,0.26,'#e8dcc8']]}),'Grzybołak',30,2.2,'zarodniki',[19,7]),
 });
 for(const k of ['jednorozec','pegaz','jelen_ks','slimak','zolw_kr','lis_og','szronolis','grzybolak']){EDEF[k].n=EDEF[k].n||k;for(const b of EDEF[k].pb)(BIOME_P[b]=BIOME_P[b]||[]).push(k)}
 Object.assign(HERD,{jelen_ks:2,jednorozec:2,grzybolak:3});
 for(const k of ['jednorozec','pegaz','jelen_ks','zolw_kr'])FANT_P.add(k);
 Object.assign(FOODS,{tecza:['Tęczowa koniczyna','jednorozec',40],chmurka:['Obłoczny owies','pegaz',40],ksiezycowe_jagody:['Księżycowe jagody','jelen_ks',24],liscie:['Soczyste liście','slimak',4],okruch:['Okruch kryształu','zolw_kr',22],wegielek:['Żarzący węgielek','lis_og',12],szron:['Szronowa jagoda','szronolis',12],zarodniki:['Garść zarodników','grzybolak',8]});
 for(const k of ['tecza','chmurka','ksiezycowe_jagody','liscie','okruch','wegielek','szron','zarodniki'])FOODOF[FOODS[k][1]]=k;
 Object.assign(MOUNT_X,{jednorozec:1.02,pegaz:1.02,jelen_ks:0.92});
 // słoń: masywne ciało, duża kopulasta głowa, wielkie uszy, długa trąba z pierścieniami, ciosy, grube nogi z paznokciami
 function slonDef(){const G='#8b8b93',GD='#76767e',GL='#9c9ca4',P=[];const y=1.05+0.72;
  P.push([0,y,0,1.42,1.44,2.3,G],[0,y+0.74,-0.15,1.3,0.14,1.9,GL],[0,y-0.7,0.05,1.2,0.12,1.9,GD],[0,y+0.1,1.05,1.46,1.3,0.3,G],[0,y+0.05,-1.08,1.44,1.32,0.26,GD]);
  for(let k=0;k<5;k++)P.push([0.715,y-0.2+k*0.1,-0.8+k*0.4,0.02,0.5,0.04,GD],[-0.715,y-0.2+k*0.1,-0.8+k*0.4,0.02,0.5,0.04,GD]);
  const hy=y+0.42,hz=1.48;P.push([0,hy,hz,1.08,1.12,0.86,G],[0,hy+0.62,hz-0.1,0.92,0.18,0.7,GL],[0,hy+0.76,hz-0.15,0.6,0.12,0.5,GL],[0,hy-0.4,hz+0.3,0.8,0.36,0.4,GD]);
  for(const sg of [1,-1]){P.push([sg*0.6,hy+0.02,hz-0.1,0.07,1.08,1.0,GD],[sg*0.64,hy+0.0,hz-0.12,0.03,0.9,0.82,'#a08c94'],[sg*0.68,hy-0.5,hz-0.25,0.06,0.3,0.6,GD],[sg*0.68,hy+0.48,hz-0.32,0.06,0.2,0.5,GD]);
    P.push([sg*0.45,hy+0.18,hz+0.435,0.12,0.12,0.03,'#1a1a1a'],[sg*0.42,hy+0.21,hz+0.448,0.04,0.04,0.02,'#ffffff'],[sg*0.45,hy+0.28,hz+0.43,0.18,0.04,0.03,GD]);
    P.push([sg*0.24,hy-0.42,hz+0.5,0.12,0.12,0.36,'#efe6d0'],[sg*0.25,hy-0.5,hz+0.74,0.11,0.11,0.24,'#efe6d0'],[sg*0.26,hy-0.48,hz+0.9,0.1,0.14,0.12,'#f6eedc'],[sg*0.26,hy-0.4,hz+0.97,0.08,0.12,0.08,'#f6eedc'])}
  const T=[[0.38,0.4,0.42],[0.34,0.34,0.36],[0.31,0.3,0.32],[0.28,0.28,0.29],[0.25,0.26,0.26],[0.22,0.22,0.23],[0.2,0.18,0.2]];let ty=hy-0.15,tz=hz+0.55;
  T.forEach(([w,h,d],k)=>{ty-=h*0.95;tz+=k<4?0.03:0.06;P.push([0,ty,tz,w,h,d,k%2?G:GL],[0,ty+h*0.45,tz,w+0.02,0.03,d+0.02,GD])});P.push([0,ty-0.14,tz+0.1,0.18,0.1,0.28,GD],[0,ty-0.12,tz+0.25,0.14,0.08,0.06,'#5a4a50']);
  P.push([0,y+0.4,-1.25,0.08,0.08,0.12,GD],[0,y-0.05,-1.28,0.06,0.8,0.06,GD],[0,y-0.52,-1.28,0.12,0.22,0.12,'#3a3a40']);
  const lx=0.43,lz=0.78;return{parts:P,hd:{c:[0,hy,hz],r:0.6},tz:-1.2,ty:y,legs:[[lx,1.08,lz,0],[-lx,1.08,lz,1],[lx,1.08,-lz,1],[-lx,1.08,-lz,0]],lw:0.44,lh:1.08,lc:'#86868e',lf:'#e8e0cc',sc:1.15}}
 // ===== kolejne zwierzęta: pasywne i drapieżne =====
 const AG=(o,q)=>Object.assign(o,Q(q));
 Object.assign(EDEF,{
  alpaka:PAS(Q({L:0.95,W:0.46,Hb:0.5,legL:0.6,legW:0.11,c:'#efe4d0',c2:'#e4d8c0',hs:0.26,hy:0.78,hz:0.02,neck:[0.24,0.72,0.26],snout:[0.12,0.14,0.16,'#e0d2b8'],nose:'#3a2a20',ears:'up',eh:0.14,tail:'short',lc:'#e4d8c0',hoof:'#3a2a20',
    extra:(y,hy,hf,L,W,Hb,hs)=>[[0,y+hy+hs/2+0.06,L/2-0.02,hs*0.9,0.1,hs*0.8,'#f7f0e2'],[0,y+Hb/2+0.04,0,W*0.86,0.08,L*0.76,'#f7f0e2']]}),'Alpaka',26,2.8,'trawa_gorska',[6,12]),
  kapibara:PAS(Q({L:0.9,W:0.5,Hb:0.46,legL:0.18,legW:0.13,c:'#8a6440',c2:'#7a5634',hs:0.36,hy:0.18,snout:[0.16,0.24,0.28,'#7a5634'],nose:'#2a1a12',ears:'round',tail:'short',lc:'#6a4a2c'}),'Kapibara',22,2.4,'trzcina',[7,9]),
  strus:PAS(BIRD({L:0.7,W:0.5,Hb:0.5,legL:0.9,hs:0.2,c:'#2a2420',hc:'#d8b8a0',beak:'#e8c890',wc:'#f2ece4',tc:'#f2ece4',lc:'#c8a080',extra:y=>[[0,y+0.55,0.32,0.1,0.6,0.1,'#d8b8a0'],[0,y+0.88,0.38,0.2,0.2,0.24,'#d8b8a0'],[0,y+0.86,0.52,0.1,0.06,0.12,'#e8c890']]}),'Struś',30,5.2,'nasiona',[8,4]),
  slon:PAS(slonDef(),'Słoń',140,2.6,'banany',[8]),
  los:PAS(Q({L:1.6,W:0.62,Hb:0.78,legL:1.0,legW:0.15,c:'#4a3424',c2:'#3a281a',hs:0.36,hy:0.72,hz:0.08,neck:[0.32,0.5,0.36],snout:[0.3,0.26,0.24,'#3a281a'],nose:'#1a1210',ears:'side',eh:0.16,tail:'short',lc:'#3a281a',hoof:'#2a2018',
    extra:(y,hy,hf,L,W,Hb,hs)=>{const a='#cfc0a0',t=y+hy+hs/2,z=L/2+0.08;return[[0.28,t+0.08,z,0.36,0.06,0.3,a],[-0.28,t+0.08,z,0.36,0.06,0.3,a],[0.46,t+0.2,z,0.06,0.2,0.3,a],[-0.46,t+0.2,z,0.06,0.2,0.3,a],[0,y+hy-hs*0.6,z+0.1,0.12,0.2,0.08,'#2a1a10']]}}),'Łoś',80,3.4,'pedy_los',[3,5,10]),
  zyrafa:PAS(Q({L:1.4,W:0.56,Hb:0.7,legL:1.5,legW:0.13,c:'#e0b060',c2:'#f0d8a0',hs:0.28,hy:1.75,hz:0.3,neck:[0.2,1.75,0.24],snout:[0.22,0.18,0.18,'#d8a858'],nose:'#3a2a1a',ears:'side',eh:0.12,tail:'hang',tc:'#3a2a1a',lc:'#d8a858',hoof:'#3a2a1a',
    extra:(y,hy,hf,L,W,Hb,hs)=>{const r=[[0.08,y+hy+hs/2+0.08,L/2+0.28,0.05,0.14,0.05,'#5a3a1a'],[-0.08,y+hy+hs/2+0.08,L/2+0.28,0.05,0.14,0.05,'#5a3a1a']];for(let k=0;k<7;k++)r.push([(k%2?0.29:-0.29),y-0.1+((k*37)%5)*0.08,0.5-k*0.16,0.02,0.16,0.16,'#9a5a2a']);for(let k=0;k<4;k++)r.push([0.105,y+0.4+k*0.35,L/2-0.1,0.02,0.14,0.14,'#9a5a2a']);return r}}),'Żyrafa',70,3.6,'akacja',[8]),
  hiena:AG({n:'Hiena',hp:42,dmg:9,spd:6.0,aggro:16,rng:1.8,cd:1.0,bh:1.3},{L:1.0,W:0.42,Hb:0.5,legL:0.48,legW:0.11,c:'#b89a6a',c2:'#d8c8a0',hs:0.36,snout:[0.2,0.18,0.2,'#4a3a2a'],nose:'#1a1a1a',eye:'#e8c040',ears:'round',ec:'#4a3a2a',tail:'short',tc:'#4a3a2a',lc:'#a88a5a',
    extra:(y,hy,hf,L,W,Hb)=>{const r=[[0,y+Hb/2+0.06,L/2-0.25,0.12,0.14,0.5,'#4a3a2a']];for(let k=0;k<6;k++)r.push([(k%2?W/2:-W/2),y+((k*13)%3)*0.08-0.04,0.35-k*0.14,0.02,0.1,0.1,'#5a4a32']);return r}}),
  krokodyl:AG({n:'Krokodyl',hp:90,dmg:15,spd:3.8,aggro:12,rng:2.2,cd:1.5,bh:0.9},{L:2.2,W:0.76,Hb:0.36,legL:0.2,legW:0.16,c:'#4a6a3a',c2:'#c8c090',hs:0.4,hy:0.02,hz:0.1,snout:[0.6,0.18,0.34,'#4a6a3a'],nose:'#2a3a20',eye:'#e8d040',tail:'hang',tc:'#3f5a32',lc:'#3f5a32',
    extra:(y,hy,hf,L,W,Hb,hs)=>{const r=[[0,y-0.06,-L/2-0.6,0.36,0.24,1.2,'#4a6a3a'],[0,y-0.08,-L/2-1.4,0.2,0.16,0.6,'#3f5a32']];for(let k=0;k<9;k++)r.push([0,y+Hb/2+0.04,L/2-0.2-k*0.3,0.18,0.08,0.12,'#3a5228']);for(let k=0;k<5;k++)r.push([(k%2?0.12:-0.12),y+hy-0.12,hf+0.12+k*0.1,0.03,0.06,0.03,'#f2ead8']);return r}}),
  szablozab:AG({n:'Tygrys szablozębny',hp:110,dmg:17,spd:6.6,aggro:18,rng:2.1,cd:1.1,bh:1.6},{L:1.7,W:0.62,Hb:0.66,legL:0.6,legW:0.17,c:'#d8a050',c2:'#f2e8d0',hs:0.46,snout:[0.2,0.2,0.24,'#f2e8d0'],nose:'#3a2418',eye:'#e8c040',ears:'round',ec:'#a87830',tail:'up',tc:'#d8a050',lc:'#c89040',
    extra:(y,hy,hf,L,W,Hb,hs)=>{const r=[[0.08,y+hy-hs*0.42,hf+0.12,0.05,0.3,0.05,'#f2ead8'],[-0.08,y+hy-hs*0.42,hf+0.12,0.05,0.3,0.05,'#f2ead8']];for(let k=0;k<6;k++)r.push([0,y+Hb/2+0.005,0.6-k*0.24,W*0.9,0.02,0.06,'#3a2418'],[W/2+0.005,y+0.05,0.6-k*0.24,0.02,Hb*0.6,0.06,'#3a2418'],[-W/2-0.005,y+0.05,0.6-k*0.24,0.02,Hb*0.6,0.06,'#3a2418']);return r}}),
  wilk_mrozny:AG({n:'Mroźny wilk',hp:58,dmg:11,spd:6.4,aggro:17,rng:1.9,cd:1.0,bh:1.3},{L:1.2,W:0.52,Hb:0.52,legL:0.54,legW:0.13,c:'#dfe8f2',c2:'#ffffff',hs:0.4,snout:[0.24,0.17,0.2,'#c8d8e8'],nose:'#2a3a4a',eye:'#5ac8ff',ears:'up',eh:0.16,tail:'fluffy',tc:'#c8d8e8',tip:'#ffffff',lc:'#b8c8d8',
    extra:(y,hy,hf,L,W,Hb)=>[[0,y+Hb/2+0.04,L/2-0.25,W*0.7,0.1,0.4,'!#bff4ff'],[0,y+Hb/2+0.03,-0.1,0.1,0.06,0.5,'!#bff4ff']]}),
  zuk:{n:'Olbrzymi żuk',hp:70,dmg:12,spd:4.0,aggro:13,rng:2.0,cd:1.4,bh:1.1,parts:[[0,0.55,-0.1,1.1,0.5,1.4,'#2a3a4a'],[0,0.82,-0.1,0.96,0.12,1.24,'#3a5a7a'],[0,0.84,-0.1,0.04,0.1,1.26,'#1a2430'],[0,0.5,0.72,0.6,0.36,0.4,'#1a2430'],[0.16,0.56,0.94,0.08,0.08,0.03,'#e84a2a'],[-0.16,0.56,0.94,0.08,0.08,0.03,'#e84a2a'],[0,0.62,1.1,0.12,0.36,0.12,'#1a2430'],[0,0.86,1.2,0.1,0.12,0.24,'#1a2430']],
    legs:[[0.5,0.4,0.45,0],[-0.5,0.4,0.45,1],[0.56,0.4,0,1],[-0.56,0.4,0,0],[0.5,0.4,-0.5,0],[-0.5,0.4,-0.5,1]],lw:0.08,lh:0.4,lc:'#1a2430'},
  mantikora:AG({n:'Mantikora',hp:150,dmg:19,spd:5.4,aggro:18,rng:2.4,cd:1.3,bh:2.0,ranged:{rng:13,proj:'poison',cd:3.2}},{L:1.8,W:0.7,Hb:0.72,legL:0.66,legW:0.18,c:'#b86a3a',c2:'#d89a6a',hs:0.5,hc:'#d8a070',snout:[0.16,0.2,0.26,'#c88a5a'],nose:'#2a1a12',eye:'#ff3a2a',ears:'round',ec:'#6a2a1a',tail:'up',tc:'#3a1a10',lc:'#a85a2a',
    extra:(y,hy,hf,L,W,Hb,hs)=>{const r=[[0,y+hy+0.05,L/2-0.08,hs*1.5,hs*1.3,0.3,'#6a2a1a'],[0,y+Hb/2+0.4,-L/2+0.05,0.14,0.6,0.14,'#3a1a10'],[0,y+Hb/2+0.82,-L/2+0.25,0.12,0.14,0.4,'#3a1a10'],[0,y+Hb/2+0.78,-L/2+0.5,0.06,0.18,0.06,'#e8d040']];for(const sg of [1,-1])r.push([sg*(W/2+0.5),y+Hb/2+0.15,0.1,0.9,0.06,0.8,'#8a3a2a'],[sg*(W/2+1.0),y+Hb/2+0.3,0,0.4,0.05,0.6,'#6a2a1a']);return r}}),
 });
 for(const [k,b] of Object.entries({alpaka:[6,12],kapibara:[7,9],strus:[8,4],slon:[8],los:[3,5,10],zyrafa:[8]}))for(const bb of b)(BIOME_P[bb]=BIOME_P[bb]||[]).push(k);
 for(const [k,b] of Object.entries({hiena:[8,4],krokodyl:[7,9],szablozab:[5,21,6],wilk_mrozny:[5,21,23],zuk:[4,15,19],mantikora:[15,4,16]}))for(const bb of b)(BIOME_E[bb]=BIOME_E[bb]||[]).push(k);
 Object.assign(HERD,{alpaka:3,kapibara:3,strus:2,slon:2,zyrafa:2});
 Object.assign(FOODS,{trawa_gorska:['Górska trawa','alpaka',5],trzcina:['Słodka trzcina','kapibara',4],nasiona:['Garść nasion','strus',5],banany:['Kiść bananów','slon',18],'pedy_los':['Młode pędy','los',10],akacja:['Liście akacji','zyrafa',12]});
 for(const k of ['trawa_gorska','trzcina','nasiona','banany','pedy_los','akacja'])FOODOF[FOODS[k][1]]=k;
 Object.assign(MOUNT_X,{slon:2.0,los:1.25,strus:1.05});
 BIOME_E[5].push('lodowy_golem');BIOME_E[6].push('lodowy_golem');BIOME_E[7].push('wiwerna');if(BIOME_E[15])BIOME_E[15].push('wiwerna');BIOME_E[9]=BIOME_E[9]||[];BIOME_E[9].push('wiwerna');
 BIOME_E[3].push('kultysta');BIOME_E[12]=BIOME_E[12]||[];BIOME_E[12].push('kultysta','mroczny_rycerz');BIOME_E[2].push('mroczny_rycerz');
 whenReady(()=>{Object.assign(CRS,{lodowy_golem:[null,'grunt','slam'],wiwerna:['screech','screech','bite'],zubr:['moo'],flaming:['quack'],kultysta:['moan','moan',null],mroczny_rycerz:[null,'grunt','whoosh']});
 Object.assign(ATKS,{icegolem:'slam',wyvern:'rear',bison:'charge'});MOUNT.zubr=1.15;MSPD.zubr=1.15;
 GLOWL.lodowy_golem=[0.5,0.9,1,5,1.0];GLOWL.kultysta=[0.75,0.4,1,4,0.9]});
}
Object.assign(PMAP,{lodowy_golem:'icegolem',wiwerna:'wyvern',zubr:'bison',bobr:'beaver',jez:'hedgehog',flaming:'flamingo'});Object.assign(PSC,{lodowy_golem:2.2,wiwerna:1.45,zubr:2.2,bobr:2.0,jez:2.0,flaming:1.8});
Object.assign(PMAP,{slime:'slime',ropucha:'toad',skorpion:'scorpion',krab:'crab',pajak:'spider',matka:'spiderq',yeti:'yeti',golem:'golem',kolos:'colossus',bazyliszek:'basilisk',gryf:'griffin',zywiolak:'elemental',smok:'dragon'});
Object.assign(PSC,{slime:2.2,ropucha:2.3,skorpion:2.3,krab:2.2,pajak:2.3,matka:2.3,yeti:2.2,golem:2.2,kolos:2.2,wilkolak:3.2,bazyliszek:2.6,gryf:2.4,zywiolak:2.2,smok:2.2});

// humanoidalni wrogowie: pełna postać z kończynami i bronią (animacje walki jak u gracza)
const HUM={
 kultysta:{sc:1.05,look:{skin:'#c8b0a0',hairC:'#1a1a1a',hair:'lysy',beard:'brak',eyes:'#c890ff',tunic:'#2a1a30',pants:'#1a1020',boots:'#140a14'},ex:{pint:1,hat:'kaptur',robe:1},w:'kostur'},
 mroczny_rycerz:{sc:1.15,look:{skin:'#3a3a40',hairC:'#1a1a1a',hair:'lysy',beard:'brak',eyes:'#ff3a2a',tunic:'#2a2a30',pants:'#2a2a30',boots:'#1a1a20',build:2},ex:{pint:1},w:'miecz',rar:3},
 wilkolak:{sc:1.3,look:{skin:'#3a302a',hairC:'#2a221e',hair:'dlugie',beard:'brak',eyes:'#ff3a2a',tunic:'#3a302a',pants:'#4a3a32',boots:'#2a221e',build:2},ex:{pint:1},w:null},
 troll:{sc:1.55,look:{skin:'#6a8a5a',hairC:'#3a3a2a',hair:'irokez',beard:'brak',eyes:'#e8c040',tunic:'#5a4a3a',pants:'#4a3a2a',boots:'#3a2a1a',build:1},ex:{pint:1,tusks:1,ears:1},w:'mlot'},
 ork:{sc:1.1,look:{skin:'#7a9a4a',hairC:'#1a1a1a',hair:'kucyk',beard:'brak',eyes:'#e04a2a',tunic:'#4a3a2a',pants:'#3a3028',boots:'#2a1c12',build:1},ex:{pint:1,tusks:1,armor:'#5a5048',gloves:'#3a2a1a'},w:'topor'},
 upior:{sc:1.05,look:{skin:'#c8d8e0',hairC:'#c8d8e0',hair:'lysy',beard:'brak',tunic:'#2a2f3a',pants:'#20242c',boots:'#20242c'},ex:{pint:1,skull:1,glow:'#9ae8ff',hat:'kaptur',robe:1},w:'kostur'},
 drzewiec:{sc:1.75,look:{skin:'#6b4a2e',hairC:'#4a8a3a',hair:'dlugie',beard:'dluga',eyes:'#e8e040',tunic:'#5a3a22',pants:'#4a3020',boots:'#3a2416',build:1},ex:{pint:1},w:null},
 krol_troll:{sc:2.0,look:{skin:'#5a7a4a',hairC:'#2a2a1a',hair:'irokez',beard:'brak',eyes:'#ff5a2a',tunic:'#6a2a2a',pants:'#4a3a2a',boots:'#3a2a1a',cape:1,capeC:'#a8352a',build:1},ex:{pint:1,tusks:1,ears:1,hat:'korona',armor:'#6a6f74'},w:'mlot',rar:4},
 lich:{sc:1.25,look:{skin:'#e8e2cc',hairC:'#e8e2cc',hair:'lysy',beard:'brak',tunic:'#3a2a5a',pants:'#2a1e40',boots:'#2a1e40',cape:1,capeC:'#2a1e40'},ex:{pint:1,skull:1,glow:'#c87aff',hat:'korona',robe:1},w:'kostur',rar:4},
 prastary:{sc:2.5,look:{skin:'#5a3e26',hairC:'#3f7834',hair:'dlugie',beard:'dluga',eyes:'#ffd34d',tunic:'#4a3020',pants:'#3a2416',boots:'#2a1c12',build:1},ex:{pint:1},w:null},
 goblin:{sc:0.82,look:{skin:'#6fae3e',hairC:'#2a1c12',hair:'irokez',beard:'brak',eyes:'#d8b030',tunic:'#8a5a2f',pants:'#5a3a22',boots:'#3a2a1a'},ex:{pint:1,ears:1,tusks:1},w:'sztylet'},
 szaman:{sc:0.85,look:{skin:'#6fae3e',hairC:'#2a1c12',hair:'lysy',beard:'brak',eyes:'#b874ff',tunic:'#6a3a8a',pants:'#4a2a6a',boots:'#2a1a2a'},ex:{pint:1,ears:1,tusks:1,hat:'kaptur',robe:1},w:'kostur'},
 szkielet:{sc:1,look:{skin:'#efe9d6',hairC:'#efe9d6',hair:'lysy',beard:'brak',tunic:'#e2dcc8',pants:'#d8d0b8',boots:'#cfc8b0'},ex:{pint:1,skull:1,ribs:1},w:'miecz'},
 lucznik_s:{sc:1,look:{skin:'#efe9d6',hairC:'#efe9d6',hair:'lysy',beard:'brak',tunic:'#6a5a46',pants:'#d8d0b8',boots:'#cfc8b0'},ex:{pint:1,skull:1,hat:'kaptur'},w:'luk'},
 bandyta:{sc:1.02,look:{skin:'#e0b08a',hairC:'#2a1c12',hair:'krotkie',beard:'zarost',eyes:'#4a3a2a',tunic:'#5a4a3a',pants:'#3a3028',boots:'#2a1c12',cape:1,capeC:'#3a3f45'},ex:{pint:1,hat:'kaptur',gloves:'#3a2a1a'},w:'topor'},
 mumia:{sc:1,look:{skin:'#d8cfa8',hairC:'#d8cfa8',hair:'lysy',beard:'brak',tunic:'#d8cfa8',pants:'#cfc6a0',boots:'#b8ad86'},ex:{pint:1,skull:1,glow:'#7fe3ff',wraps:1},w:null},
 krol_s:{sc:1,look:{skin:'#efe9d6',hairC:'#efe9d6',hair:'lysy',beard:'brak',tunic:'#7a2a2a',pants:'#d8d0b8',boots:'#3a3a40',cape:1,capeC:'#a8352a'},ex:{pint:1,skull:1,ribs:1,hat:'korona',armor:'#6a6f74',glow:'#ff3a2a'},w:'miecz',rar:4},
 faraon:{sc:1,look:{skin:'#d8cfa8',hairC:'#d8cfa8',hair:'lysy',beard:'brak',tunic:'#d8cfa8',pants:'#cfc6a0',boots:'#d9b23a',cape:1,capeC:'#2f5f8f'},ex:{pint:1,skull:1,glow:'#7fe3ff',wraps:1,hat:'nemes'},w:'kostur',rar:4},
};
const HD=(p,l,glow)=>{if(!p)return;const G=l.filter(b=>typeof b[6]==='string'&&b[6][0]==='!'),N=l.filter(b=>!(typeof b[6]==='string'&&b[6][0]==='!'));if(N.length){const mm=new THREE.Mesh(boxes(N),decoMat);mm.castShadow=true;p.add(mm)}if(G.length)p.add(new THREE.Mesh(boxes(G),GLOWMAT))};
const HDECO={
 troll:(u,H)=>{const s=H.look.skin,sd=darker(s,0.8);HD(u.torso,[[0,0.18,0.17,0.46,0.3,0.1,s],[0,0.06,0.2,0.3,0.12,0.06,sd],[0,-0.12,0.17,0.4,0.22,0.06,'#6b4a2b'],[0,0.5,0.17,0.32,0.03,0.02,'#e8e0c8'],[0.08,0.46,0.18,0.05,0.07,0.03,'#e8e0c8'],[-0.08,0.46,0.18,0.05,0.07,0.03,'#e8e0c8']]);HD(u.head,[[0,0.24,0.27,0.13,0.13,0.08,sd],[0.15,0.42,0.24,0.05,0.05,0.02,sd],[-0.12,0.18,0.245,0.04,0.04,0.02,sd],[0,0.12,0.245,0.18,0.03,0.012,'#2a1a10']])},
 ork:(u,H)=>{HD(u.head,[[0.13,0.25,0.246,0.1,0.025,0.01,'#a8302a'],[-0.13,0.25,0.246,0.1,0.025,0.01,'#a8302a'],[0,0.36,0.246,0.025,0.12,0.01,'#a8302a'],[0,0.2,0.27,0.05,0.03,0.03,'#c9a24a'],[-0.16,0.3,0.247,0.03,0.14,0.01,'#4a2a1a']]);for(const a of [u.la,u.ra])HD(a,[[0,0.12,0,0.06,0.12,0.06,'#d8d0b8'],[0,0.2,0,0.035,0.06,0.035,'#e8e0c8']])},
 goblin:(u,H)=>{const s=H.look.skin;HD(u.head,[[0,0.22,0.3,0.07,0.07,0.14,s],[0,0.2,0.38,0.05,0.05,0.06,darker(s,0.85)],[0,0.52,0,0.54,0.08,0.52,'#8a3a2a'],[0.2,0.5,-0.25,0.08,0.06,0.16,'#8a3a2a']]);HD(u.torso,[[0.22,0.02,0.12,0.14,0.16,0.1,'#6b4a2b'],[0.22,0.11,0.12,0.15,0.03,0.11,'#4a2f1d']])},
 szaman:(u,H)=>{const F=['#c8302a','#e8c040','#3a8ac0','#5a9a4a','#e8e2cc'];HD(u.head,[[0,0.56,0,0.56,0.08,0.54,'#6b4a2b']].concat(F.map((c,i)=>[(i-2)*0.1,0.72+Math.abs(i-2)*-0.03,-0.1-Math.abs(i-2)*0.02,0.05,0.26,0.04,c])).concat([[0.12,0.27,0.247,0.12,0.03,0.01,'#e8e2cc'],[-0.12,0.27,0.247,0.12,0.03,0.01,'#e8e2cc']]));HD(u.torso,[[0,0.5,0.17,0.3,0.03,0.02,'#e8e0c8'],[0,0.4,0.18,0.1,0.1,0.04,'#e8e2cc'],[0.03,0.42,0.2,0.025,0.025,0.01,'#141414'],[-0.03,0.42,0.2,0.025,0.025,0.01,'#141414']])},
 szkielet:(u,H)=>{const l=[];for(let i=0;i<4;i++)l.push([0,0.2+i*0.09,0.153,0.4,0.03,0.012,'#3a3228']);l.push([0,0.3,0.156,0.04,0.38,0.012,'#cfc8b0']);HD(u.torso,l);HD(u.head,[[0,0.1,0.236,0.2,0.04,0.012,'#e8e2cc'],[0,0.1,0.24,0.18,0.008,0.012,'#3a3228'],[0.14,0.45,0.24,0.03,0.1,0.01,'#3a3228']])},
 lucznik_s:(u,H)=>{HDECO.szkielet(u,H);HD(u.torso,[[0.12,0.36,-0.26,0.2,0.62,0.18,'#5a3a22'],[0.12,0.7,-0.26,0.22,0.06,0.2,'#3a2414'],[0.06,0.78,-0.22,0.02,0.16,0.02,'#8a6a44'],[0.14,0.8,-0.24,0.02,0.18,0.02,'#8a6a44'],[0.06,0.87,-0.22,0.04,0.05,0.01,'#e8e0c8']])},
 bandyta:(u,H)=>{HD(u.head,[[0,0.17,0.25,0.52,0.17,0.04,'#2a2a2e'],[0,0.17,0.15,0.54,0.17,0.2,'#2a2a2e'],[0,0.56,0,0.55,0.1,0.53,'#3a3a40'],[0.22,0.54,-0.25,0.06,0.06,0.16,'#3a3a40']]);HD(u.torso,[[-0.2,0.02,0.16,0.04,0.2,0.04,'#c4ccd2'],[-0.2,0.13,0.16,0.08,0.03,0.05,'#5a3a22'],[0.12,0.02,0.18,0.1,0.1,0.06,'#6b4a2b']])},
 mumia:(u,H)=>{const B='#efe6c8',B2='#c8bc98',l=[];for(let i=0;i<6;i++)l.push([0,0.06+i*0.1,0.153,0.54,0.03,0.012,i%2?B:B2]);HD(u.torso,l.concat([[0.25,-0.2,0.1,0.06,0.3,0.03,B]]));HD(u.head,[[0,0.4,0.247,0.5,0.03,0.012,B2],[0,0.22,0.247,0.5,0.03,0.012,B2],[0.11,0.3,0.25,0.07,0.05,0.012,'!#ffd34d'],[-0.11,0.3,0.25,0.07,0.05,0.012,'!#ffd34d']])},
 krol_s:(u,H)=>{HDECO.szkielet(u,H);HD(u.head,[[0.11,0.3,0.25,0.07,0.05,0.012,'!#ff3030'],[-0.11,0.3,0.25,0.07,0.05,0.012,'!#ff3030']])},
 faraon:(u,H)=>{HD(u.torso,[[0,0.54,0.12,0.5,0.1,0.14,'#d9b23a'],[0,0.5,0.17,0.4,0.04,0.04,'#2f5f8f'],[0,0.46,0.18,0.3,0.03,0.04,'#c8302a']]);HD(u.head,[[0.11,0.3,0.25,0.07,0.05,0.012,'!#7fe3ff'],[-0.11,0.3,0.25,0.07,0.05,0.012,'!#7fe3ff']])},
 upior:(u,H)=>{const l=[];for(let i=0;i<6;i++)l.push([(i-2.5)*0.1,-0.58-(i%2)*0.08,0.15,0.08,0.14,0.02,'#2a2f3a']);HD(u.torso,l.concat([[0,0.3,0.17,0.3,0.04,0.012,'!#9ae8ff'],[0,0.15,0.17,0.2,0.03,0.012,'!#9ae8ff']]))},
 lich:(u,H)=>{HD(u.head,[[0,0.6,0,0.52,0.08,0.5,'#d9b23a'],[0.2,0.68,0.2,0.07,0.1,0.07,'#d9b23a'],[-0.2,0.68,0.2,0.07,0.1,0.07,'#d9b23a'],[0,0.7,0.24,0.07,0.12,0.05,'#d9b23a'],[0,0.7,0.27,0.04,0.05,0.01,'!#c890ff'],[0.11,0.3,0.25,0.07,0.05,0.012,'!#c890ff'],[-0.11,0.3,0.25,0.07,0.05,0.012,'!#c890ff']]);HD(u.torso,[[0.36,0.75,0.25,0.1,0.1,0.1,'!#c890ff'],[-0.36,0.7,-0.2,0.08,0.08,0.08,'!#c890ff']])},
 drzewiec:(u,H)=>{const s=H.look.skin,l=[];for(let i=0;i<5;i++)l.push([-0.2+i*0.1,0.3,0.155,0.03,0.5,0.012,darker(s,0.7)]);HD(u.torso,l.concat([[0.3,0.62,0,0.18,0.12,0.2,'#4a8a3a'],[-0.3,0.62,0,0.18,0.12,0.2,'#5a9a4a'],[0.22,0.2,0.16,0.08,0.06,0.06,'#d8c8a0'],[0.22,0.25,0.16,0.12,0.03,0.08,'#c8302a']]));HD(u.head,[[0,0.6,0,0.6,0.16,0.56,'#4a8a3a'],[0.18,0.72,0.1,0.22,0.14,0.22,'#5a9a4a'],[-0.16,0.7,-0.1,0.24,0.12,0.24,'#3a7a2a'],[0.05,0.82,-0.05,0.04,0.2,0.04,'#5a3a22']])},
 krol_troll:(u,H)=>{HDECO.troll(u,H);HD(u.head,[[0,0.62,0,0.5,0.08,0.5,'#d9b23a'],[0.2,0.7,0.2,0.07,0.1,0.07,'#d9b23a'],[-0.2,0.7,0.2,0.07,0.1,0.07,'#d9b23a']]);HD(u.torso,[[0,0.62,0,0.66,0.12,0.42,'#8a6a4a'],[0,0.67,0,0.5,0.06,0.36,'#a8886a']])}};
{const D0=HDECO.drzewiec;HDECO.drzewiec=(u,H)=>{D0(u,H);const B='#5a3a22',B2='#4a3020',LF='#4a8a3a',LF2='#6aaa4a';
  HD(u.head,[[0.2,0.82,-0.05,0.06,0.4,0.06,B],[0.3,1.0,-0.05,0.2,0.05,0.05,B],[0.42,1.08,-0.05,0.05,0.16,0.05,B],[-0.2,0.8,0.02,0.06,0.34,0.06,B],[-0.3,0.95,0.02,0.18,0.05,0.05,B],[-0.38,1.04,0.02,0.05,0.14,0.05,B],
   [0.42,1.2,-0.05,0.2,0.14,0.2,LF2],[-0.38,1.14,0.02,0.18,0.14,0.18,LF],[0.05,0.9,-0.2,0.05,0.28,0.05,B],[0.05,1.06,-0.2,0.16,0.12,0.16,LF2]]);
  for(const a of [u.la,u.ra])HD(a,[[0,-0.6,0.05,0.045,0.2,0.045,B],[0.05,-0.66,-0.04,0.04,0.16,0.04,B],[0,-0.72,0.07,0.12,0.09,0.12,LF2],[0.06,-0.76,-0.06,0.1,0.08,0.1,LF],[0.12,0.1,0,0.04,0.2,0.04,B],[0.16,0.22,0,0.1,0.08,0.1,LF]]);
  for(const l of [u.ll,u.rl])HD(l,[[0.09,-0.71,0.12,0.06,0.05,0.22,B2],[-0.1,-0.71,0.1,0.05,0.04,0.2,B2],[0.12,-0.71,-0.1,0.18,0.05,0.05,B2],[-0.12,-0.71,-0.06,0.16,0.04,0.05,B2],[0,-0.4,0.1,0.14,0.08,0.02,'#3a6a2a']])}}
HDECO.prastary=HDECO.drzewiec;
HDECO.kultysta=(u,H)=>{HD(u.torso,[[0,0.35,0.165,0.16,0.16,0.01,'!#c890ff'],[0,0.35,0.17,0.06,0.24,0.01,'!#c890ff'],[0,0.35,0.17,0.24,0.06,0.01,'!#c890ff'],[0,-0.05,0.16,0.5,0.04,0.012,'#6a3a8a'],[0.22,0.05,0.14,0.1,0.12,0.08,'#e8e2cc'],[0.22,0.07,0.19,0.03,0.03,0.01,'#141414']]);HD(u.head,[[0,0.62,-0.05,0.58,0.16,0.56,'#1e1024'],[0,0.5,0.24,0.56,0.08,0.06,'#1e1024']])};
HDECO.mroczny_rycerz=(u,H)=>{HD(u.torso,[[0,0.3,-0.2,0.6,0.9,0.06,'#4a0e12'],[0,0.75,-0.2,0.62,0.08,0.08,'#2a2a30']]);HD(u.head,[[0,0.62,0,0.08,0.18,0.5,'#1a1a20']])};
HDECO.wilkolak=(u,H)=>{const F='#3a302a',F2='#4a3f3a',FL='#6a5a50';HD(u.head,[[0,0.17,0.34,0.26,0.18,0.24,F2],[0,0.12,0.36,0.22,0.06,0.2,F],[0,0.25,0.47,0.09,0.06,0.03,'#111111'],[-0.07,0.09,0.46,0.035,0.06,0.02,'#f2ead8'],[0.07,0.09,0.46,0.035,0.06,0.02,'#f2ead8'],[-0.17,0.66,-0.02,0.1,0.2,0.08,F],[0.17,0.66,-0.02,0.1,0.2,0.08,F],[-0.17,0.64,0.025,0.05,0.12,0.02,'#8a5a5a'],[0.17,0.64,0.025,0.05,0.12,0.02,'#8a5a5a'],[0,0.5,-0.2,0.5,0.25,0.2,F],[-0.27,0.25,0,0.06,0.3,0.4,F2],[0.27,0.25,0,0.06,0.3,0.4,F2]]);
  HD(u.torso,[[0,0.62,0,0.66,0.16,0.36,F2],[0,0.5,-0.13,0.5,0.2,0.1,F],[0,0.3,0.155,0.3,0.3,0.02,FL],[0,-0.05,-0.2,0.12,0.12,0.16,F],[0,-0.18,-0.32,0.14,0.14,0.14,F2],[0,-0.32,-0.4,0.12,0.14,0.12,F]]);
  for(const a of [u.la,u.ra])HD(a,[[0,-0.62,0.08,0.03,0.08,0.06,'#e8e0c8'],[0.05,-0.62,0.08,0.03,0.08,0.06,'#e8e0c8'],[-0.05,-0.62,0.08,0.03,0.08,0.06,'#e8e0c8'],[0,0.05,0,0.2,0.14,0.2,F2]]);
  for(const l of [u.ll,u.rl])HD(l,[[0,-0.72,0.15,0.03,0.04,0.06,'#e8e0c8'],[0.06,-0.72,0.15,0.03,0.04,0.06,'#e8e0c8'],[-0.06,-0.72,0.15,0.03,0.04,0.06,'#e8e0c8']])};
const EYEM={kultysta:'#c890ff',wilkolak:'#ff2a1a',troll:'#ffcf3a',krol_troll:'#ff3a2a',ork:'#ff3a2a',goblin:'#ffe040',szaman:'#7dff8a',szkielet:'#ff5a2a',lucznik_s:'#ff5a2a',drzewiec:'#ffcf3a',prastary:'#9aff5a'};
function MENACE(u,t,H){const br=darker(H.look.hair||H.look.skin||'#3a2a1a',0.45),sk=H.look.skin||'#c8a080',L=[];
  // gniewne brwi (V) nad oczami
  L.push([-0.16,0.36,0.252,0.08,0.03,0.02,br],[-0.08,0.335,0.252,0.08,0.03,0.02,br],[0.16,0.36,0.252,0.08,0.03,0.02,br],[0.08,0.335,0.252,0.08,0.03,0.02,br]);
  if(EYEM[t])L.push([-0.11,0.297,0.254,0.045,0.04,0.008,"!"+EYEM[t]],[0.11,0.297,0.254,0.045,0.04,0.008,"!"+EYEM[t]]);
  if(['troll','krol_troll','ork','goblin','wilkolak'].includes(t)&&t!=='wilkolak')L.push([-0.09,0.16,0.255,0.035,0.07,0.02,'#f2ead8'],[0.09,0.16,0.255,0.035,0.07,0.02,'#f2ead8'],[0,0.13,0.251,0.16,0.025,0.01,'#2a0a08']);
  if(t==='bandyta'||t==='ork')L.push([0.155,0.3,0.253,0.015,0.15,0.01,'#7a2a2a'],[0.145,0.27,0.254,0.05,0.012,0.01,'#7a2a2a']);
  HD(u.head,L);
  if(['ork','krol_troll','bandyta','krol_s','szkielet','troll'].includes(t)){const c=t==='bandyta'?'#3a3a40':'#2a2a30';for(const a of [u.la,u.ra])HD(a,[[0,0.02,0,0.2,0.07,0.2,c],[0,0.1,0,0.035,0.1,0.035,'#c4ccd2'],[0,0.04,0.09,0.03,0.06,0.04,'#c4ccd2'],[0,0.04,-0.09,0.03,0.06,0.04,'#c4ccd2']])}
}
const GI=(base,mat,rar,lk,sd)=>({base,slot:base,mat,rar,lk,sd});
const HGEAR={mroczny_rycerz:e=>({helm:GI('helm','plyt',3,5,77),zbroja:GI('zbroja','plyt',3,5,78),rekawice:GI('rekawice','plyt',3,5,79),buty:GI('buty','plyt',3,5,80)}),kultysta:e=>({zbroja:GI('zbroja','skora',1,9,31)}),bandyta:e=>({zbroja:GI('zbroja','skora',e?2:0,e?2:0,e?7:0),buty:GI('buty','skora',0,1,0)}),
 ork:e=>({zbroja:GI('zbroja','krasn',e?2:1,e?3:2,e?12:9),helm:GI('helm','kolcz',e?2:0,1,0),rekawice:GI('rekawice','skora',0,1,0)}),
 krol_troll:e=>({zbroja:GI('zbroja','krasn',4,5,3),rekawice:GI('rekawice','plyt',3,1,0)}),
 szkielet:e=>({helm:GI('helm','kolcz',e?2:0,e?4:0,0),zbroja:e?GI('zbroja','kolcz',2,3,0):undefined}),
 lucznik_s:e=>({zbroja:GI('zbroja','skora',0,0,6)}),
 krol_s:e=>({zbroja:GI('zbroja','plyt',4,5,3),rekawice:GI('rekawice','plyt',4,5,0),buty:GI('buty','plyt',4,5,0)}),
 lich:e=>({zbroja:GI('zbroja','plyt',4,9,3),rekawice:GI('rekawice','plyt',4,9,0)}),
 goblin:e=>({zbroja:GI('zbroja','skora',0,2,0)}),
 mumia:e=>({}),faraon:e=>({zbroja:GI('zbroja','plyt',4,7,0)}),upior:e=>({rekawice:GI('rekawice','elf',3,8,0)})};
// ===== STWORY MORSKIE: segmentowe ciała z falowaniem, szczęki, macki (rekin, wąż morski, lewiatan, kraken, żabnica, meduza, topielec) =====
const SEA={};
{const M=(L,x,y,z,w,h,d,c)=>{L.push([x,y,z,w,h,d,c],[-x,y,z,w,h,d,c])},P=(L,...b)=>L.push(b);
 // --- REKIN ---
 SEA.rekin={y:0,z:-0.6,amp:0.24,k:0.9,f:1.15,build(){const T='#5d6d7a',T2='#687886',B='#e2e5e7',D='#4a5864',TE='#f4efe4',MO='#5a1e22',EY='#0c0c0e',LN='#9aa6ae';
  const s0=[],s1=[],s2=[],s3=[],j=[];
  P(s0,0,0.9,0.1,0.78,0.66,1.2,T);P(s0,0,0.6,0.1,0.66,0.12,1.15,B);P(s0,0,0.88,0.95,0.62,0.52,0.6,T);P(s0,0,0.88,1.36,0.44,0.36,0.36,T2);P(s0,0,0.86,1.6,0.26,0.22,0.16,T2);
  P(s0,0,0.66,0.9,0.5,0.05,0.55,B);P(s0,0,0.71,1.1,0.4,0.04,0.5,MO);M(s0,0.12,0.9,1.68,0.04,0.03,0.02,'#1a1a1a');
  for(let i=0;i<6;i++)P(s0,-0.2+i*0.08,0.66,1.36-Math.abs(i-2.5)*0.03,0.035,0.09,0.035,TE);for(const z of [0.95,1.05,1.15,1.25])M(s0,0.21,0.66,z,0.035,0.08,0.035,TE);
  M(s0,0.3,0.95,1.08,0.02,0.12,0.12,'#2a3038');M(s0,0.315,0.95,1.08,0.02,0.08,0.08,EY);M(s0,0.32,0.97,1.1,0.01,0.025,0.025,'#c8d0d8');
  for(let k=0;k<5;k++)M(s0,0.395,0.86,0.52-k*0.1,0.02,0.32-k*0.02,0.025,'#34414c');
  M(s0,0.62,0.62,0.22,0.5,0.06,0.44,D);M(s0,0.92,0.57,0.08,0.22,0.05,0.26,D);M(s0,0.395,0.74,0.1,0.01,0.05,1.2,LN);
  P(s0,0.392,1.02,-0.12,0.012,0.03,0.34,'#c8ccd0');P(s0,0.392,0.97,-0.2,0.012,0.03,0.2,'#c8ccd0');P(s0,-0.392,1.05,0.25,0.012,0.03,0.25,'#c8ccd0');
  P(j,0,-0.05,0.35,0.5,0.12,0.7,B);P(j,0,0.02,0.3,0.34,0.03,0.5,MO);for(let i=0;i<5;i++)P(j,-0.16+i*0.08,0.06,0.66,0.035,0.08,0.035,TE);for(const z of [0.3,0.4,0.5])M(j,0.2,0.05,z,0.035,0.07,0.035,TE);
  P(s1,0,0.92,-0.45,0.72,0.62,1.0,T);P(s1,0,0.62,-0.45,0.6,0.1,0.95,B);M(s1,0.365,0.74,-0.45,0.01,0.05,1.0,LN);
  P(s1,0,1.3,-0.35,0.1,0.2,0.78,D);P(s1,0,1.48,-0.45,0.09,0.2,0.56,D);P(s1,0,1.64,-0.56,0.08,0.16,0.36,D);P(s1,0,1.77,-0.66,0.06,0.12,0.18,D);P(s1,0,1.3,-0.05,0.11,0.06,0.2,'#3e4a55');
  P(s2,0,0.92,-0.4,0.56,0.48,0.8,T);P(s2,0,0.7,-0.4,0.44,0.08,0.75,B);P(s2,0,1.22,-0.5,0.06,0.16,0.26,D);M(s2,0.3,0.68,-0.3,0.26,0.05,0.26,D);P(s2,0,0.6,-0.6,0.06,0.14,0.22,D);
  P(s3,0,0.93,-0.25,0.32,0.3,0.55,T);M(s3,0.17,0.93,-0.3,0.04,0.08,0.4,D);
  P(s3,0,1.15,-0.55,0.07,0.32,0.26,D);P(s3,0,1.4,-0.7,0.06,0.3,0.2,D);P(s3,0,1.62,-0.82,0.05,0.22,0.16,D);P(s3,0,0.72,-0.6,0.07,0.26,0.2,D);P(s3,0,0.55,-0.7,0.06,0.18,0.15,D);
  return{segs:[{L:s0,len:0.5},{L:s1,len:1.0},{L:s2,len:0.8},{L:s3,len:0.5}],jaw:{L:j,y:0.66,z:0.75}}}};
 // --- WĄŻ MORSKI ---
 SEA.waz_morski={y:0,z:-0.7,amp:0.3,k:0.72,f:0.8,vert:0.13,lift:0.42,gape:0.16,build(){const G='#2f7a6a',G2='#36887a',GD='#245f52',BL='#d8e8c8',R='#c84a3a',S='#d8c890',TE='#f4efe4';
  const s0=[],j=[],segs=[];
  P(s0,0,0.55,-0.45,0.82,0.76,1.0,G);P(s0,0,0.18,-0.45,0.66,0.05,0.95,BL);P(s0,0,0.76,0.45,0.92,0.6,0.92,G2);P(s0,0,0.72,1.1,0.62,0.42,0.52,G);P(s0,0,0.7,1.42,0.42,0.3,0.18,G2);
  M(s0,0.3,1.08,0.72,0.18,0.12,0.52,GD);M(s0,0.465,0.96,0.86,0.04,0.13,0.17,'!#ffd34d');M(s0,0.488,0.96,0.86,0.012,0.13,0.035,'#1a1a10');M(s0,0.15,0.86,1.5,0.06,0.04,0.04,'#102a24');
  M(s0,0.28,1.2,0.25,0.1,0.36,0.1,S);M(s0,0.32,1.42,0.05,0.08,0.26,0.08,S);M(s0,0.34,1.55,-0.12,0.06,0.16,0.06,'#a89a70');
  M(s0,0.58,0.85,0.05,0.04,0.62,0.38,R);M(s0,0.6,1.17,0.05,0.05,0.06,0.44,S);M(s0,0.6,0.54,0.05,0.05,0.06,0.4,S);M(s0,0.61,0.85,0.05,0.03,0.6,0.04,S);
  P(s0,0,1.14,0.15,0.08,0.3,0.85,R);for(let k=0;k<4;k++)P(s0,0,1.2+k*0.02,0.5-k*0.25,0.05,0.42-k*0.05,0.05,S);
  P(s0,0,0.5,0.9,0.5,0.05,0.8,'#5a1a22');M(s0,0.22,0.36,1.25,0.06,0.24,0.06,TE);M(s0,0.12,0.4,1.42,0.05,0.17,0.05,TE);for(const z of [0.72,0.86,1.0,1.12])M(s0,0.27,0.43,z,0.04,0.11,0.04,TE);
  M(s0,0.42,0.6,-0.1,0.012,0.14,0.3,'#1f5a4a');M(s0,0.42,0.65,-0.6,0.012,0.12,0.22,'#1f5a4a');
  P(j,0,-0.08,0.45,0.66,0.16,0.95,G);P(j,0,-0.17,0.45,0.56,0.04,0.9,BL);M(j,0.2,0.1,0.85,0.05,0.2,0.05,TE);M(j,0.26,0.07,0.6,0.04,0.12,0.04,TE);P(j,0,0.01,0.5,0.14,0.03,0.6,'#a83040');M(j,0.05,0.01,0.95,0.04,0.03,0.22,'#a83040');
  segs.push({L:s0,len:1.0});const N=10;
  for(let i=1;i<=N;i++){const L=[],t=i/N,w=0.82-0.5*t,len=0.95,c=i%2?G:G2;P(L,0,0.5,-len/2,w,w*0.92,len*1.05,c);P(L,0,0.5-w*0.46,-len/2,w*0.8,0.05,len*0.95,BL);
   for(const q of [0.25,0.5,0.75])P(L,0,0.5-w*0.475,-len*q,w*0.82,0.02,0.04,'#a8b898');
   const sh=(0.36+0.14*Math.sin(i*0.9))*(1-t*0.5);P(L,0,0.5+w*0.46+sh/2,-len/2,0.07,sh,len*0.85,R);P(L,0,0.5+w*0.46+sh*0.55,-len*0.3,0.05,sh*1.2,0.05,S);P(L,0,0.5+w*0.46+sh*0.5,-len*0.7,0.05,sh*1.1,0.05,S);
   M(L,w/2+0.005,0.55,-len/2,0.012,0.12,0.26,'#1f5a4a');if(i%3===1)M(L,w/2+0.006,0.42,-len*0.3,0.012,0.06,0.06,'!#7fe3d0');
   if(i===N){P(L,0,0.5,-len-0.25,0.06,1.0,0.6,R);for(const y of [-0.35,0,0.35])P(L,0,0.5+y,-len-0.3,0.05,0.05,0.62,S)}
   segs.push({L,len})}
  return{segs,jaw:{L:j,y:0.46,z:0.45}}}};
 // --- LEWIATAN ---
 SEA.lewiatan={y:0,z:-1.0,amp:0.15,k:0.55,f:0.55,vert:0.07,lift:0.18,gape:0.14,build(){const A='#1f2a33',A2='#2a3844',PL='#3a4a56',BE='#5a6a64',GL='!#5ff0ff',GV='!#9a6aff',TE='#e8e0c8',BO='#c8c0a8',GU='#4a0e18';
  const s0=[],j=[],segs=[];
  P(s0,0,0.72,0.55,1.5,1.0,1.6,A2);P(s0,0,1.26,0.5,1.3,0.12,1.4,PL);M(s0,0.5,1.28,1.1,0.42,0.22,0.52,A);P(s0,0,0.64,1.6,1.1,0.72,0.62,A2);P(s0,0,0.56,1.98,0.82,0.52,0.2,A);
  P(s0,0,0.37,1.05,0.96,0.07,1.7,GU);P(s0,0,0.42,0.1,0.6,0.3,0.3,'#120206');
  for(let i=0;i<7;i++)P(s0,-0.45+i*0.15,0.2,2.02,0.07,0.32-Math.abs(i-3)*0.02,0.07,TE);for(let z=0.5;z<=1.85;z+=0.19)M(s0,0.52,0.2,z,0.07,0.3,0.07,TE);for(let z=0.6;z<=1.7;z+=0.22)M(s0,0.36,0.24,z,0.05,0.2,0.05,'#d8d0b8');
  M(s0,0.64,0.98,1.32,0.06,0.15,0.2,GL);M(s0,0.68,0.8,1.06,0.06,0.11,0.15,GL);M(s0,0.67,0.98,1.32,0.03,0.15,0.05,'#05080a');M(s0,0.71,0.8,1.06,0.03,0.11,0.04,'#05080a');
  for(const z of [-0.12,0.05,0.22]){M(s0,0.79,0.72,z,0.06,0.92,0.14,PL);M(s0,0.825,0.72,z,0.01,0.72,0.03,GL)}
  M(s0,0.45,1.48,0.1,0.15,0.48,0.15,BO);M(s0,0.5,1.78,-0.12,0.1,0.3,0.1,BO);M(s0,0.52,1.94,-0.26,0.06,0.16,0.06,'#a8a088');P(s0,0,1.34,0.2,0.1,0.3,0.12,BO);P(s0,0,1.36,0.6,0.1,0.26,0.12,BO);
  for(let k=0;k<5;k++)M(s0,0.3+k*0.06,1.33,1.6-k*0.25,0.05,0.02,0.05,GL);
  P(j,0,-0.15,0.85,1.3,0.32,1.75,A2);P(j,0,-0.32,0.85,1.1,0.04,1.6,BE);for(let i=0;i<6;i++)P(j,-0.38+i*0.15,0.12,1.66,0.07,0.28,0.07,TE);for(let z=0.25;z<=1.5;z+=0.2)M(j,0.48,0.1,z,0.07,0.26,0.07,TE);P(j,0,-0.35,1.6,0.08,0.2,0.08,BO);P(j,0,0.03,0.8,0.8,0.03,1.4,GU);
  segs.push({L:s0,len:1.2});const N=9;
  for(let i=1;i<=N;i++){const L=[],t=i/N,w=1.5-1.0*t,len=1.3;P(L,0,0.6,-len/2,w,w*0.86,len*1.04,A);P(L,0,0.6+w*0.43+0.05,-len/2,w*0.74,0.12,len*0.82,PL);P(L,0,0.6-w*0.43,-len/2,w*0.8,0.05,len*0.92,BE);
   const sp=0.2+0.42*(1-t);P(L,0,0.6+w*0.43+0.1+sp/2,-len*0.35,0.13,sp,0.22,BO);P(L,0,0.6+w*0.43+0.12+sp*0.95,-len*0.4,0.08,0.12,0.12,'#a8a088');
   for(const q of [0.25,0.65]){M(L,w/2+0.012,0.62,-len*q,0.02,0.1,0.12,i%2?GL:GV)}M(L,w/2+0.02,0.78,-len/2,0.04,0.28,len*0.7,PL);
   if(i===2||i===3){M(L,w/2+0.5,0.4,-0.5,1.0,0.1,0.72,A2);M(L,w/2+1.05,0.36,-0.72,0.5,0.08,0.46,A);M(L,w/2+0.75,0.4,-0.12,1.3,0.02,0.04,GL)}
   if(i===N){P(L,0,0.6,-len-0.3,2.3,0.12,0.6,A2);M(L,0.95,0.6,-len-0.62,0.62,0.1,0.5,A);M(L,1.2,0.6,-len-0.3,0.02,0.04,0.5,GL)}
   segs.push({L,len})}
  const tents=[];for(const [x,z,ph] of [[0.35,1.75,0],[-0.35,1.75,1.3],[0.6,1.25,2.1],[-0.6,1.25,0.7]])tents.push({x,y:0.05,z,rx:2.5,ry:x>0?0.25:-0.25,n:6,len:0.34,w:0.12,c:A,c2:A2,tip:GL,ph});
  return{segs,jaw:{L:j,y:0.3,z:0.2},tents}}};
 // --- KRAKEN ---
 SEA.kraken={y:0,amp:0,k:0,f:0.7,build(){const K='#7a2a3a',K2='#8a3444',SP='#5a1a28',SU='#e8c8b8';const s0=[];
  P(s0,0,1.2,-0.3,1.12,1.0,1.3,K);P(s0,0,1.55,-0.9,0.92,0.86,1.0,K2);P(s0,0,1.82,-1.42,0.62,0.6,0.6,K);P(s0,0,2.02,-1.72,0.32,0.3,0.3,K2);
  M(s0,0.5,1.85,-1.5,0.3,0.06,0.45,K2);for(let i=0;i<9;i++){const a=i*2.4,r=0.3+(i%3)*0.12;P(s0,Math.cos(a)*r*1.4,1.3+Math.sin(a*1.7)*0.3+(i%3)*0.2,-0.4-(i%4)*0.3+0.01,0.12,0.1,0.06,SP)}
  P(s0,0,0.86,0.35,1.22,0.76,0.82,K2);M(s0,0.6,1.0,0.35,0.06,0.3,0.32,'!#ffc030');M(s0,0.635,1.0,0.35,0.02,0.07,0.27,'#100808');M(s0,0.6,1.2,0.35,0.12,0.08,0.36,K);M(s0,0.6,0.8,0.36,0.1,0.06,0.3,SP);
  P(s0,0,0.48,0.72,0.26,0.2,0.22,'#2a2018');P(s0,0,0.4,0.8,0.12,0.1,0.12,'#1a140e');
  const tents=[];const n8=8;for(let i=0;i<n8;i++){const a=-2.6+i*(5.2/(n8-1));tents.push({x:Math.sin(a)*0.45,y:0.55,z:0.45+Math.cos(a)*0.4,ry:a,rx:0.2,n:7,len:0.44,w:0.3,c:K,c2:K2,su:SU,ph:i*0.8})}
  for(const s of [-1,1])tents.push({x:s*0.2,y:0.6,z:0.8,ry:s*0.22,rx:0.05,n:10,len:0.46,w:0.18,c:K2,c2:K,su:SU,club:1,ph:s});
  return{segs:[{L:s0,len:0}],tents}}};
 // --- ŻABNICA GŁĘBIN ---
 SEA.zabnica={y:0,z:-0.3,amp:0.2,k:1,f:1.4,gape:0.38,build(){const B1='#2a2228',B2='#3a3038',TE='#e8e8f0';const s0=[],s1=[],j=[];
  P(s0,0,0.8,0,1.2,1.1,1.3,B1);P(s0,0,0.85,-0.56,0.92,0.86,0.5,B2);P(s0,0,0.62,0.55,1.0,0.5,0.26,'#14060c');P(s0,0,0.96,0.68,1.16,0.14,0.22,B2);
  for(let i=0;i<7;i++)P(s0,-0.45+i*0.15,0.76,0.73,0.035,i%2?0.22:0.34,0.035,TE);for(const z of [0.35,0.5])M(s0,0.5,0.76,z,0.035,0.26,0.035,TE);
  M(s0,0.42,1.12,0.45,0.1,0.11,0.11,'#d8e0d8');M(s0,0.47,1.12,0.48,0.02,0.035,0.035,'#202020');
  P(s0,0,1.45,0.25,0.05,0.3,0.05,B2);P(s0,0,1.63,0.45,0.05,0.05,0.42,B2);P(s0,0,1.58,0.68,0.04,0.12,0.04,B2);P(s0,0,1.48,0.7,0.17,0.17,0.17,'!#9affea');P(s0,0,1.48,0.7,0.07,0.24,0.07,'!#d8fff4');
  for(let i=0;i<14;i++){const a=i*2.39,u=Math.cos(a),v=Math.sin(a*1.3);P(s0,u*0.52,0.85+v*0.4,-0.1+Math.sin(a)*0.5,0.08,0.06,0.08,i%2?B2:'#4a3a44')}
  for(let k=0;k<3;k++)P(s0,0,1.42,-0.15-k*0.22,0.04,0.28-k*0.05,0.04,'#5a4a50');M(s0,0.66,0.66,-0.2,0.28,0.26,0.06,B2);M(s0,0.66,0.56,-0.25,0.24,0.02,0.04,'#5a4a50');
  P(j,0,0,0.45,1.22,0.2,0.92,B2);P(j,0,0.11,0.5,1.0,0.03,0.7,'#14060c');for(let i=0;i<6;i++)P(j,-0.4+i*0.16,0.25,0.86,0.035,i%2?0.26:0.38,0.035,TE);for(const z of [0.35,0.55])M(j,0.52,0.22,z,0.035,0.28,0.035,TE);
  P(s1,0,0.82,-0.25,0.5,0.55,0.6,B1);P(s1,0,0.82,-0.72,0.06,0.82,0.42,B2);for(const y of [-0.3,0,0.3])P(s1,0,0.82+y,-0.75,0.05,0.04,0.46,'#5a4a50');
  return{segs:[{L:s0,len:0.6},{L:s1,len:0.6}],jaw:{L:j,y:0.48,z:0.05}}}};
 // --- UPIORNA MEDUZA ---
 SEA.meduza={y:0.2,amp:0,k:0,f:0.9,pulse:1,bob:0.3,build(){const C='#c8b0e8',C2='#b898e0',C3='#a888d8';const s0=[];
  P(s0,0,1.3,0,1.4,0.36,1.4,C);P(s0,0,1.56,0,1.12,0.3,1.12,C2);P(s0,0,1.76,0,0.72,0.2,0.72,C);P(s0,0,1.1,0,1.52,0.12,1.52,C3);
  P(s0,0,1.35,0,0.5,0.32,0.5,'!#e080ff');P(s0,0,1.6,0,0.22,0.12,0.22,'!#ffb0ff');for(let i=0;i<10;i++){const a=i/10*6.283;P(s0,Math.cos(a)*0.74,1.08,Math.sin(a)*0.74,0.07,0.06,0.07,'!#c890ff')}
  const tents=[];for(let i=0;i<10;i++){const a=i/10*6.283+0.3;tents.push({x:Math.cos(a)*0.62,y:1.04,z:Math.sin(a)*0.62,rx:1.5708,ry:0,n:6,len:0.36,w:0.06,c:'#d8c8f0',c2:'#c0a8e8',tip:'!#e0a0ff',ph:i})}
  for(let i=0;i<4;i++){const a=i/4*6.283;tents.push({x:Math.cos(a)*0.18,y:1.0,z:Math.sin(a)*0.18,rx:1.5708,ry:0,n:4,len:0.34,w:0.16,c:C2,c2:C3,ph:i*1.7})}
  return{segs:[{L:s0,len:0}],tents}}};
}
function seaMesh(L,mat,par){const G=L.filter(b=>typeof b[6]==='string'&&b[6][0]==='!'),N=L.filter(b=>!(typeof b[6]==='string'&&b[6][0]==='!'));if(N.length){const m=new THREE.Mesh(rboxes(N,0.12),mat);m.castShadow=true;par.add(m)}if(G.length)par.add(new THREE.Mesh(boxes(G),GLOWMAT))}
function makeSeaE(t,elite){const D=SEA[t],d=EDEF[t],mat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});seasonPatch(mat,false);
  const g=new THREE.Group(),B=D._b||(D._b=D.build()),segs=[];let par=g;
  B.segs.forEach((s,i)=>{const sg=new THREE.Group();if(i>0)sg.position.z=-B.segs[i-1].len;seaMesh(s.L,mat,sg);par.add(sg);segs.push(sg);par=sg});
  let jaw=null;if(B.jaw){jaw=new THREE.Group();jaw.position.set(0,B.jaw.y,B.jaw.z);seaMesh(B.jaw.L,mat,jaw);segs[0].add(jaw)}
  const tents=[];for(const T of (B.tents||[])){let p=new THREE.Group();p.position.set(T.x,T.y,T.z);p.rotation.order='YXZ';p.rotation.x=T.rx||0;p.rotation.y=T.ry||0;segs[0].add(p);const ch=[];
    for(let k=0;k<T.n;k++){const s=new THREE.Group();if(k>0)s.position.z=T.len;const w=T.w*(1-k/T.n*0.68),L=[[0,0,T.len/2,w,w,T.len*1.08,k%2?T.c:T.c2]];
      if(T.su)L.push([0,-w/2-0.012,T.len/2,w*0.55,0.025,T.len*0.6,T.su]);if(T.club&&k>=T.n-2)L.push([0,0,T.len/2,w*1.8,w*1.3,T.len,T.c2],[0,-w*0.65-0.01,T.len/2,w*1.2,0.03,T.len*0.8,T.su]);
      if(T.tip&&k===T.n-1)L.push([0,0,T.len,w*1.3,w*1.3,w*1.3,T.tip]);seaMesh(L,mat,s);p.add(s);ch.push(s);p=s}
    tents.push({ch,ph:T.ph||0,rx:T.rx||0,down:(T.rx||0)>1})}
  g.position.y=D.y||0;g.position.z=D.z||0;const inner=new THREE.Group();inner.add(g);inner.scale.setScalar((d.sc||1)*(elite&&!d.boss?1.25:1));
  inner.userData={g,legs:[],mat,ph:Math.random()*6,body:segs[0],sea:{segs,jaw,tents,D},head:null,tail:null};return inner}
function animSea(u,speed,dt,st){if(st===2)return;const S=u.sea,D=S.D,run=Math.min(1,speed/3),w=u.wind||0,sk=u.strike>0?Math.sin((1-u.strike/0.32)*Math.PI):0,hk=u.hit>0?Math.sin(u.hit/0.22*Math.PI):0,ph=u.ph*(D.f||1),n=S.segs.length;
  S.segs.forEach((s,i)=>{if(i===0){s.rotation.y=Math.sin(ph)*0.07*(0.4+run)+hk*0.2;s.rotation.x=-(D.lift||0)-w*0.25+sk*0.35;return}
    s.rotation.y=Math.sin(ph-i*(D.k||0.8))*(D.amp||0.18)*(0.35+0.65*run)*(0.5+i/n);s.rotation.x=(i===1?(D.lift||0):0)+(D.vert?Math.sin(ph*0.6-i*0.7)*D.vert:0)});
  if(S.jaw)S.jaw.rotation.x=(D.gape||0)+Math.max(w*0.7,sk*1.0)+Math.sin(u.ph*0.35)*0.05;
  for(const T of S.tents)T.ch.forEach((c,k)=>{if(T.down){c.rotation.x=k?Math.sin(u.ph*0.8+k*0.7+T.ph)*0.16:0;c.rotation.y=k?Math.cos(u.ph*0.6+k*0.6+T.ph)*0.14:0}
    else{c.rotation.x=(k?0.1+Math.sin(u.ph*0.7+k*0.6+T.ph)*0.2:0)-sk*(k?0.18:0.5)+w*(k?0.08:0.2);c.rotation.y=k?Math.cos(u.ph*0.5+k*0.5+T.ph)*0.2:0}});
  let y=(D.y||0)+Math.sin(u.ph*0.4)*0.05;if(D.bob)y+=Math.sin(u.ph*0.6)*D.bob;u.g.position.y=y;u.g.position.z=(D.z||0)+sk*0.6-w*0.2-hk*0.2;
  if(D.pulse){const p=1+Math.sin(u.ph*0.9)*0.1;S.segs[0].scale.set(p,1/p,p)}}
// topielec: utopiec wynurzający się z wody (humanoid)
HUM.topielec={sc:1.1,look:{skin:'#8aa898',hairC:'#1a2420',hair:'dlugie',beard:'brak',eyes:'#bfffe8',tunic:'#3a4a44',pants:'#2a3430',boots:'#1a2220'},ex:{pint:1},w:null};
HDECO.topielec=(u,H)=>{HD(u.torso,[[0.12,0.2,0.19,0.06,0.5,0.03,'#3a6a3a'],[-0.16,0.1,0.19,0.05,0.4,0.03,'#4a7a3a'],[0.2,0.3,-0.19,0.05,0.6,0.03,'#3a6a3a'],[0,0.5,0.19,0.4,0.05,0.02,'#2a3a34'],[-0.1,0.0,0.19,0.18,0.12,0.02,'#2a3a34']]);
  HD(u.head,[[0.12,0.35,0.29,0.08,0.05,0.02,'!#bfffe8'],[-0.12,0.35,0.29,0.08,0.05,0.02,'!#bfffe8'],[0,0.12,0.29,0.22,0.06,0.02,'#1a0a0a'],[0.25,0.1,0.05,0.04,0.5,0.04,'#3a6a3a'],[-0.27,0.0,0.0,0.04,0.6,0.04,'#3a6a3a']]);
  for(const a of [u.la,u.ra])HD(a,[[0,-0.45,0.04,0.12,0.1,0.06,'#a8c0b0'],[0.05,-0.5,0.08,0.03,0.12,0.03,'#d8e0d0'],[-0.05,-0.5,0.08,0.03,0.12,0.03,'#d8e0d0']])};
Object.assign(EDEF,{
  rekin:Object.assign(EDEF.rekin,{sea:1}),waz_morski:Object.assign(EDEF.waz_morski,{sea:1,sc:1.6,hp:280}),
  zabnica:HB({n:'Żabnica głębin',hp:130,dmg:20,spd:5.0,aggro:16,rng:2.3,cd:1.5,swim:1,sea:1,sc:1.3}),
  meduza:HB({n:'Upiorna meduza',hp:60,dmg:13,spd:2.6,aggro:10,rng:2.4,cd:1.6,swim:1,sea:1,sc:1.5,stun:1}),
  topielec:HB({n:'Topielec',hp:95,dmg:15,spd:3.8,aggro:16,rng:1.9,cd:1.3,swim:1,bh:2.2}),
  kraken:HB({n:'Kraken',hp:1500,dmg:30,spd:3.6,aggro:26,rng:3.2,cd:1.8,swim:1,sea:1,sc:2.2,boss:'troll',bodyR:3.0,mins:['zabnica','rekin','meduza']}),
  lewiatan:HB({n:'Lewiatan',hp:3600,dmg:50,spd:4.4,aggro:34,rng:3.4,cd:2.0,swim:1,sea:1,sc:3.2,boss:'matka',huge:1,bodyR:4.6,mins:['rekin','rekin','zabnica']})});
whenReady(()=>{try{Object.assign(CRS,{zabnica:['hiss','hiss','bite'],meduza:[null,null,'squelch'],topielec:['moan','moan','claw'],kraken:['bearroar','bearroar','slam'],lewiatan:['bearroar','bearroar','bite']});
  Object.assign(GLOWL,{zabnica:[0.6,1,0.92,6,1.2],meduza:[0.85,0.5,1,6,1.1],lewiatan:[0.4,0.95,1,14,1.6],topielec:[0.6,1,0.9,3,0.6]})}catch(e){console.warn(e)}});
// stwór morski pasujący do miejsca: głębokość, odległość od startu, pora dnia
function seaPick(depth,dist,night){const r=Math.random();if(depth>9&&dist>900&&r<0.035)return 'lewiatan';if(depth>7&&dist>500&&r<0.09)return 'kraken';
  if(night&&r<0.35)return Math.random()<0.5?'meduza':'topielec';if(depth>6&&r<0.3)return Math.random()<0.6?'zabnica':'waz_morski';if(depth<5&&r<0.25)return 'topielec';return r<0.75?'rekin':'meduza'}

function makeEnemy(t,elite){const m0=makeEnemy0(t,elite);m0.userData.et=t;try{m0.traverse(o=>{const g=o.geometry;if(!o.isMesh||!g||!g.attributes||!g.attributes.color||g.userData.shd||!g.attributes.position)return;g.userData.shd=1;const P=g.attributes.position.array,Cc=g.attributes.color,A=Cc.array,s=Cc.itemSize;let mn=1e9,mx=-1e9;for(let i=1;i<P.length;i+=3){mn=Math.min(mn,P[i]);mx=Math.max(mx,P[i])}const span=mx-mn||1;for(let i=0;i<P.length/3;i++){const t2=(P[i*3+1]-mn)/span,f=0.8+0.3*t2;for(let k=0;k<3;k++)A[i*s+k]=Math.min(A instanceof Uint8Array?255:1,A[i*s+k]*f)}Cc.needsUpdate=true})}catch(e){}return m0}
const MX={slime:{core:1},skorpion:{ridge:1,spots:1,belly:1,seg:1},krab:{spots:1,belly:1},yeti:{fur:1,belly:1},golem:{moss:1,cracks:1},kolos:{moss:1,cracks:1},ropucha:{spots:1,belly:1,warts:1},pajak:{stripes:1,hair:1},matka:{stripes:1,hair:1},wilkolak:{fur:1,belly:1},bazyliszek:{ridge:1,spots:1,belly:1},gryf:{feathers:1,belly:1},zywiolak:{flames:1},smok:{ridge:1,belly:1,scales:1}};
function monExtra(t,d){if(d._ext)return d._ext;const F=MX[t]||{belly:1},L=[];let b=null,bv=0;for(const p of d.parts){const v=p[3]*p[4]*p[5];if(v>bv){bv=v;b=p}}if(!b)return d._ext=L;
  const [x,y,z,w,h,dd,c]=b,D1=darker(c,0.72),D2=darker(c,0.85),L1=darker(c,1.18),L2=darker(c,1.35),hs=(a,k)=>{const s=Math.sin(a*12.9898+k*78.233)*43758.5453;return s-Math.floor(s)},P=(...q)=>L.push(q);
  if(F.belly)P(x,y-h/2+0.012,z,w*0.7,0.03,dd*0.75,L1);
  if(F.spots)for(let i=0;i<7;i++){const u=hs(i,1)-0.5,v=hs(i,2)-0.5,s=0.06+hs(i,3)*0.08;P(x+u*w*0.8,y+h/2+0.008,z+v*dd*0.85,s,0.02,s*1.3,i%2?D1:L1)}
  if(F.ridge){const n=Math.max(4,Math.round(dd/0.22));for(let i=0;i<n;i++){const zz=z-dd/2+(i+0.5)*dd/n,hh=0.08+0.06*Math.sin(i/n*Math.PI);P(x,y+h/2+hh/2,zz,0.05,hh,0.08,D1);P(x,y+h/2+hh+0.02,zz,0.03,0.04,0.05,L2)}}
  if(F.seg)for(let i=1;i<4;i++)P(x,y+h/2+0.005,z-dd/2+i*dd/4,w*0.95,0.02,0.03,D1);
  if(F.scales)for(let r=0;r<3;r++)for(let i=0;i<8;i++)P(x+(r-1)*w*0.32,y+h/2+0.01,z-dd/2+(i+0.5+(r%2)*0.5)*dd/8.5,w*0.22,0.02,dd/12,i%2?D2:D1);
  if(F.fur){for(let i=0;i<10;i++){const u=hs(i,4)-0.5,v=hs(i,5)-0.5;P(x+u*w*0.9,y+h/2+0.04,z+v*dd*0.9,0.1,0.08,0.1,i%2?L1:D2)}for(const s of [1,-1])P(x+s*(w/2+0.02),y+h*0.2,z,0.05,h*0.5,dd*0.7,D2)}
  if(F.moss){for(let i=0;i<5;i++){const u=hs(i,6)-0.5,v=hs(i,7)-0.5;P(x+u*w*0.8,y+h/2+0.02,z+v*dd*0.8,0.2,0.05,0.2,i%2?'#5a8a3a':'#4a7a2a')}P(x+w*0.3,y+h*0.1,z+dd/2+0.01,0.25,0.18,0.02,'#5a8a3a')}
  if(F.cracks){P(x-w*0.2,y+h*0.1,z+dd/2+0.012,0.03,h*0.6,0.012,'!#7fe3ff');P(x-w*0.1,y-h*0.05,z+dd/2+0.012,0.25,0.03,0.012,'!#7fe3ff');P(x+w*0.25,y+h*0.25,z+dd/2+0.012,0.03,h*0.4,0.012,'!#7fe3ff');for(const s of [1,-1])P(x+s*(w/2+0.08),y+h/2-0.1,z,0.2,0.2,0.3,D2)}
  if(F.stripes)for(let i=0;i<4;i++)P(x,y+h/2+0.008,z-dd*0.35+i*dd*0.23,w*0.9,0.02,0.05,i%2?'#a8302a':L2);
  if(F.hair)for(let i=0;i<12;i++){const u=hs(i,8)-0.5,v=hs(i,9)-0.5;P(x+u*w,y+h/2+0.03,z+v*dd,0.02,0.07,0.02,L2)}
  if(F.warts)for(let i=0;i<9;i++){const u=hs(i,10)-0.5,v=hs(i,11)-0.5;P(x+u*w*0.85,y+h/2+0.015,z+v*dd*0.85,0.05,0.04,0.05,i%3?'#7a9a4a':'#3a5a2a')}
  if(F.feathers){for(let i=0;i<6;i++)for(const s of [1,-1])P(x+s*(w/2+0.015),y+h*0.25-i*0.03,z-dd*0.3+i*0.12,0.03,0.12,0.14,i%2?L1:'#f2ead8');for(let i=0;i<5;i++)P(x,y+h/2+0.02,z-dd*0.4+i*0.18,w*0.6,0.03,0.12,i%2?L1:D2)}
  if(F.flames){for(let i=0;i<7;i++){const a=i/7*6.283;P(x+Math.cos(a)*w*0.38,y+h/2+0.1+hs(i,12)*0.15,z+Math.sin(a)*dd*0.38,0.12,0.2+hs(i,13)*0.15,0.12,i%2?'!#ffb030':'!#ffe080')}P(x,y+h/2+0.3,z,0.18,0.3,0.18,'!#ffe080');P(x,y,z,w*0.6,h*0.6,dd*0.6,'!#fff0a0')}
  if(F.core){P(x,y-h*0.05,z,w*0.45,h*0.45,dd*0.45,darker(c,0.55));P(x+w*0.22,y+h*0.32,z+dd*0.3,0.14,0.08,0.03,'#e8ffd8');for(let i=0;i<4;i++)P(x+(hs(i,14)-0.5)*w*0.6,y+(hs(i,15)-0.5)*h*0.6,z+(hs(i,16)-0.5)*dd*0.6,0.07,0.07,0.07,L2)}
  return d._ext=L}
function makeEnemy0(t,elite){
  if(SEA[t])return makeSeaE(t,elite);
  if(GIANT[t]){const gm=makeEnemy0(GIANT[t].b,elite);gm.scale.multiplyScalar(GIANT[t].k);if(HUGEB[t])try{hugeLook(gm,t)}catch(_){}return gm}
  if(t==='woz'){const g=makeHorseE('kon',false),k=1/(g.scale.x||1),cart=new THREE.Group();cart.scale.setScalar(k);cart.position.z=-3.15*k;g.add(cart);
    const W1='#7a5030',W2='#8a5a30',W3='#5a3a22',IRN='#3a3a40',CL='#e8dcc0',CL2='#d8ccb0',L=[],P=(...b)=>L.push(b);
    P(0,0.98,0,1.8,0.16,2.9,W1);for(const s of [-1,1]){P(s*0.92,1.32,0,0.1,0.56,2.9,W2);for(const y of [1.12,1.32,1.52])P(s*0.975,y,0,0.02,0.04,2.92,W3);for(const z of [-1.4,-0.5,0.5,1.4])P(s*0.98,1.32,z,0.04,0.6,0.08,IRN)}
    P(0,1.32,1.43,1.84,0.56,0.1,W2);P(0,1.3,-1.43,1.84,0.5,0.1,W2);P(0,0.88,0,0.2,0.12,2.6,W3);for(const z of [-0.85,0.85])P(0,0.62,z,2.1,0.1,0.1,IRN);
    for(let i=0;i<9;i++){const a=i/8*Math.PI,x=Math.cos(a)*0.93,y=1.62+Math.sin(a)*0.92;P(x,y,0.05,0.36,0.36,2.6,i%2?CL:CL2+'~');for(const z of [-1.05,-0.2,0.65,1.3])P(x*1.02,y*1.0+0.01,z,0.38,0.38,0.06,W3)}
    P(0,1.75,-1.38,1.6,0.9,0.04,'#3a2a1a');P(0.4,1.25,-0.9,0.6,0.5,0.6,'#9a7048');P(-0.4,1.2,-1.0,0.55,0.45,0.55,'#8a6a3a');P(-0.1,1.28,-0.2,0.5,0.6,0.5,'#c8b080');P(0.45,1.22,0.2,0.5,0.5,0.5,'#8a5a30');
    P(0,1.15,1.75,1.5,0.1,0.5,W1);P(0,1.4,1.95,1.5,0.4,0.08,W2);for(const s of [-0.55,0.55]){P(s,1.0,2.6,0.08,0.08,2.0,W3)}P(0,0.95,3.5,1.2,0.08,0.08,W3);
    P(0.8,2.1,1.55,0.05,0.4,0.05,IRN);P(0.8,1.85,1.55,0.18,0.24,0.18,'!#ffcc66');
    const body=new THREE.Mesh(boxes(L),decoMat);body.castShadow=true;cart.add(body);
    const wheelGeo=(()=>{const W=[],r=0.55;for(let i=0;i<14;i++){const a=i/14*Math.PI*2;W.push([0,Math.cos(a)*r,Math.sin(a)*r,0.1,0.13,0.27,i%2?'#4a2f1d':'#5a3a22']);W.push([0,Math.cos(a)*(r+0.03),Math.sin(a)*(r+0.03),0.12,0.06,0.25,IRN])}for(let i=0;i<6;i++){const a=i/6*Math.PI;W.push([0,0,0,0.05,Math.abs(Math.cos(a))*r*2+0.05,Math.abs(Math.sin(a))*r*2+0.05,'#6b4528'])}W.push([0,0,0,0.16,0.16,0.16,IRN]);return boxes(W)})();
    const wh=[];for(const [x,z] of [[1.0,0.85],[-1.0,0.85],[1.0,-0.85],[-1.0,-0.85]]){const w=new THREE.Mesh(wheelGeo,decoMat);w.position.set(x,0.58,z);w.castShadow=true;cart.add(w);wh.push(w)}
    try{const dr=makeChar({skin:'#e0b08a',hairC:'#5a3a22',hair:'krotkie',beard:'krotka',tunic:'#3f6a8a',pants:'#4a3a2a',boots:'#2a1c12'},{hat:'kaptur'});dr.position.set(0,1.18,1.7);dr.scale.setScalar(0.95);const du=dr.userData;if(du.ll)du.ll.rotation.x=-1.4;if(du.rl)du.rl.rotation.x=-1.4;if(du.la)du.la.rotation.x=-0.9;if(du.ra)du.ra.rotation.x=-0.9;cart.add(dr);g.userData.drv=dr}catch(_){}
    Object.assign(g.userData,{cartW:wh,cart,cartBody:body});return g}
  if(t==='kon')return makeHorseE(t,elite);
  if(t==='jednorozec'||t==='pegaz')return makeHorseF(t,elite);
  if(PMAP[t])return makePanim(t,elite);
  if(HUM[t]){const H=HUM[t],d=EDEF[t],mat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});seasonPatch(mat,false);crTex(mat,CRKH[t]??5);
    const ch=makeChar(H.look,Object.assign({mat},H.ex));ch.scale.setScalar(H.sc);if(H.w)setWeapon(ch,H.w,H.rar||(elite?3:0));
    if(HGEAR[t])try{applyGear(ch,HGEAR[t](elite))}catch(e){}
    if(HDECO[t])try{HDECO[t](ch.userData,H)}catch(e){console.error(e)}
    try{MENACE(ch.userData,t,H)}catch(e){console.error(e)}
    const BP={wilkolak:[1.3,1.05,1.2,.92,1.32,1.25,.38],troll:[1.32,1.06,1.25,.78,1.32,1.3,.3],krol_troll:[1.35,1.08,1.28,.76,1.34,1.32,.26],drzewiec:[1.22,1.16,1.12,.9,1.36,1.4,.12],prastary:[1.25,1.2,1.15,.88,1.4,1.45,.14],ork:[1.16,1.02,1.12,.92,1.12,1.15,.12],goblin:[.92,.92,.9,1.18,1.08,.9,.22]}[t];
    let hunch=0;if(BP){const c=ch.userData;c.torso.scale.set(BP[0],BP[1],BP[2]);c.head.scale.set(BP[3]/BP[0],BP[3]/BP[1],BP[3]/BP[2]);for(const a of [c.la,c.ra])if(a)a.scale.set(1.08,BP[4]/BP[1],1.08);for(const l of [c.ll,c.rl])if(l)l.scale.set(BP[5],1,BP[5]);hunch=BP[6]}
    ch.traverse(o=>{if(o.isMesh&&o.material===decoMat)o.material=mat});
    const g=new THREE.Group();g.add(ch);const inner=new THREE.Group();inner.add(g);inner.scale.setScalar(d.sc||(elite?1.35:1));
    inner.userData={g,legs:[],mat,ph:Math.random()*6,body:ch,hum:1,ch,hunch,wk:weaponKind(H.w||''),combo:0};return inner}
  const d=EDEF[t], g=new THREE.Group(), mat=new THREE.MeshLambertMaterial({vertexColors:true,emissive:0x000000});seasonPatch(mat,false);
  let BP=d.parts.concat(monExtra(t,d)),head=null,tail=null;
  if(d.hd){const hc=d.hd.c,hs=d.hd.r,HP=[],TP=[],RP=[];
    for(const p of d.parts){if(p[2]>hc[2]-hs*0.5&&p[1]>hc[1]-hs*0.7)HP.push(p);else if(d.tz!=null&&p[2]<d.tz+0.01&&p[1]>d.ty-0.6)TP.push(p);else RP.push(p)}
    if(HP.length){const jy=hc[1]-hs*0.3,jz=hc[2]-hs*0.5;head=new THREE.Group();head.position.set(0,jy,jz);const hm=new THREE.Mesh(rboxes(HP.map(p=>{const q=p.slice();q[1]-=jy;q[2]-=jz;return q}),0.18),mat);hm.castShadow=true;head.add(hm);BP=RP.concat(TP)}
    if(TP.length&&head){tail=new THREE.Group();tail.position.set(0,d.ty,d.tz);const tm=new THREE.Mesh(rboxes(TP.map(p=>{const q=p.slice();q[1]-=d.ty;q[2]-=d.tz;return q}),0.18),mat);tm.castShadow=true;tail.add(tm);BP=RP}}
  const GLW=BP.filter(p=>typeof p[6]==='string'&&p[6][0]==='!');BP=BP.filter(p=>!(typeof p[6]==='string'&&p[6][0]==='!'));
  const body=new THREE.Mesh(rboxes(BP,0.18),mat);body.castShadow=true;g.add(body);if(GLW.length)body.add(new THREE.Mesh(boxes(GLW),GLOWMAT));if(head)g.add(head);if(tail)g.add(tail);
  const legs=[];for(const [x,y,z,ph] of (d.legs||[])){const p=new THREE.Group();p.position.set(x,y,z);p.userData.y0=y;const m=new THREE.Mesh(rboxes([[0,-d.lh/2,0,d.lw,d.lh,d.lw,d.lc]].concat(d.lf?[[0,-d.lh+0.05,0.012,d.lw+0.025,0.1,d.lw+0.035,d.lf]]:[])),mat);m.castShadow=true;p.add(m);p.userData.ph=ph;g.add(p);legs.push(p)}
  const inner=new THREE.Group();inner.add(g);inner.scale.setScalar(d.sc||(elite?1.35:1));
  inner.userData={g,legs,mat,ph:Math.random()*6,body,hop:d.hop,head,tail,pas:!!d.passive,look:0,lookT:0,graze:0};
  return inner;
}
function animEnemy(m,speed,dt,st,flash,slowed){
  const u=m.userData;if(u.pwings){const tt=performance.now()*0.001,run=Math.min(1,speed/5),fl=run>0.3?Math.sin(tt*7)*0.55*run:Math.sin(tt*1.3)*0.05;for(const [w,sg] of u.pwings){w.rotation.z=sg*(0.32+fl+run*0.15);w.rotation.y=sg*(1.15-run*0.85)}}if(u.cartW){for(const w of u.cartW)w.rotation.x+=speed*dt/0.58;const bb=Math.min(1,speed/2);u.cart.rotation.z=Math.sin(performance.now()*0.006)*0.018*bb;u.cart.position.y=Math.abs(Math.sin(performance.now()*0.009))*0.03*bb/(m.scale.x||1);if(u.drv&&u.drv.userData.head)u.drv.userData.head.rotation.y=Math.sin(performance.now()*0.0007)*0.4}u.ph+=dt*(3+speed*1.6);const g=u.g;
  // stan ataku: zamach (st=1) -> uderzenie przy przejściu 1->0 -> powrót
  if(st===1){u.wind=Math.min(1,(u.wind||0)+dt*2.4)}else{if(u.lastSt===1&&st===0)u.strike=0.32;u.wind=Math.max(0,(u.wind||0)-dt*6)}
  try{enemySounds(m,u,st,dt);if(u.lastSt===1&&st===0)enemyStrikeSound(m,u)}catch(e){}
  if(flash>0.85&&!(u.lastFl>0.85))u.hit=0.22;u.lastFl=flash;u.lastSt=st;
  u.strike=Math.max(0,(u.strike||0)-dt);u.hit=Math.max(0,(u.hit||0)-dt);
  if(u.sea){animSea(u,speed,dt,st);return finishEnemy(m,u,dt,st,flash,slowed)}
  if(u.hum){animHumEnemy(u,speed,dt,st);return finishEnemy(m,u,dt,st,flash,slowed)}
  if(u.root){animPan(u,speed,dt,st);if(u.fire)fireAnim(u,dt,m);return finishEnemy(m,u,dt,st,flash,slowed)}
  const w=u.wind,sk=u.strike>0?Math.sin((1-u.strike/0.32)*Math.PI):0,hk=u.hit>0?Math.sin(u.hit/0.22*Math.PI):0;
  if(u.hop){const h=speed>0.3?Math.abs(Math.sin(u.ph*0.8))*0.45:Math.abs(Math.sin(u.ph*0.3))*0.05;const sq=w*0.25;
    g.position.y=st===2?g.position.y:h+sk*0.6;g.scale.set(1+(0.45-h)*0.15+sq,1-(0.45-h)*0.15+0.07-sq*1.4+sk*0.25,1+(0.45-h)*0.15+sq);g.position.z=sk*0.55}
  else{const run=Math.min(1,speed/3);
    for(const l of u.legs){const ph=u.ph+(l.userData.ph?Math.PI:0);l.rotation.x=Math.sin(ph)*run*0.75-(w*0.35)*(l.position.z>0?-1:1)+sk*0.5*(l.position.z>0?-1:1);l.position.y=l.userData.y0+Math.max(0,Math.cos(ph))*0.05*run}
    if(st!==2){g.position.y=(speed>0.3?Math.abs(Math.cos(u.ph))*0.045*run:0)-w*0.08+sk*0.1;g.rotation.z=Math.sin(u.ph*0.5)*0.035*run-hk*0.1;
      g.rotation.x=-w*0.22+sk*0.42-hk*0.25;g.position.z=-w*0.18+sk*0.45-hk*0.15}}
  if(!u.hop&&st!==2)u.body.scale.y=1+Math.sin(u.ph*0.45)*0.018;
  if(u.head&&st!==2){const run=Math.min(1,speed/3);u.lookT-=dt;
    if(u.lookT<=0){u.lookT=1.5+Math.random()*3;u.lookTo=speed>0.3?0:(Math.random()-0.5)*1.1;u.graze=u.pas&&speed<0.2&&Math.random()<0.35?2+Math.random()*2:0}
    u.graze=Math.max(0,u.graze-dt);u.look+=((u.lookTo||0)-u.look)*Math.min(1,3*dt);
    const tx=Math.sin(u.ph*2)*0.07*run-w*0.35+sk*0.6-hk*0.3+(u.graze>0?0.75:0)+Math.sin(u.ph*0.6)*0.03*(1-run);
    u.head.rotation.x+=(tx-u.head.rotation.x)*Math.min(1,10*dt);u.head.rotation.y=u.look*(1-run)*(1-w);}
  if(u.tail&&st!==2){const run=Math.min(1,speed/3);u.tail.rotation.y=Math.sin(u.ph*(run>0.1?2.4:1.3))*(0.25+0.25*run);u.tail.rotation.x=-0.1*run+Math.sin(u.ph*0.9)*0.05}
  finishEnemy(m,u,dt,st,flash,slowed);
}
function animHumEnemy(u,speed,dt,st){const c=u.ch;if(st===2)return;
  if(u.hunch){c.userData.torso.rotation.x-=u._hA||0;c.userData.head.rotation.x+=(u._hA||0)*0.85}
  animChar(c,speed,dt,false,false);if(u.hunch){c.userData.torso.rotation.x+=u.hunch;c.userData.head.rotation.x-=u.hunch*0.85;u._hA=u.hunch}
  if(u.strike>0.31&&!u.cnt){u.combo=(u.combo+1)%3;u.cnt=1}if(u.strike<=0)u.cnt=0;
  const bow=u.wk==='bow'||u.wk==='staff';let k=-1;
  if(u.strike>0)k=bow?0.9+0.1*(1-u.strike/0.32):0.33+0.67*(1-u.strike/0.32);else if(u.wind>0)k=bow?u.wind*0.88:u.wind*0.33;
  if(k>=0)animCombat(c,u.wk==='fist'?'melee':u.wk,u.combo,k);else if(c.userData.nock)c.userData.nock.visible=false;
  if(u.hit>0){c.userData.torso.rotation.x-=Math.sin(u.hit/0.22*Math.PI)*0.25}
  {const sk=u.strike>0?Math.sin((1-u.strike/0.32)*Math.PI):0,w=u.wind||0;u.g.position.z=sk*0.32-w*0.08;u.g.rotation.x=-w*0.06+sk*0.12;u.g.rotation.y=-w*0.25+sk*0.3}
}
function finishEnemy(m,u,dt,st,flash,slowed){const g=u.g;
  if(st===2){u.dt2=(u.dt2||0)+dt;g.rotation.z=Math.min(Math.PI/2,g.rotation.z+dt*5);g.position.y=-0.15-Math.max(0,u.dt2-0.6)*0.8;if(u.dt2>0.7)g.scale.multiplyScalar(Math.max(0.6,1-dt*1.5))}else u.dt2=0;
  if(slowed===2){if(!u.stars){u.stars=new THREE.Mesh(STARGEO||(STARGEO=boxes([[0.55,0,0,0.16,0.16,0.16,'#ffe066'],[-0.28,0.05,0.48,0.14,0.14,0.14,'#fff3a0'],[-0.28,-0.04,-0.48,0.15,0.15,0.15,'#ffd34d'],[0,0,0.55,0.08,0.08,0.08,'#ffffff']])),projMat);m.add(u.stars)}u.stars.visible=true;u.stars.position.y=u.hum?2.05:1.75;u.stars.rotation.y+=dt*5;g.rotation.z=Math.sin(u.ph*0.7)*0.12}else if(u.stars)u.stars.visible=false;
  if(slowed===1&&flash<=0)u.mat.emissive.setRGB(0.06,0.18,0.42);else if(slowed===2&&flash<=0)u.mat.emissive.setRGB(0.22,0.18,0.02);else u.mat.emissive.setScalar(Math.max(0,flash)*0.8);
}

// ---------- wrogowie: symulacja u hosta (lub solo), interpolacja u klienta ----------
const enemies=new Map(); let eSeq=1;
const spawnPt=()=>S.spawn||[0,0,0];
function playersList(){const l=[{id:NET.id,sl:P2.sleep?1:0,p:player.p,dead:P2.dead>0,lv:HERO.lvl,tb:pk('skarb')+(hasP('szczesciarz')?2:0),stl:P3.stealth>0,snk:P3.sneak}];for(const [id,r] of remotes){const b=r.buf[r.buf.length-1];if(b)l.push({id,sl:b.sl,p:{x:b.p[0],y:b.p[1],z:b.p[2]},dead:b.a===5,lv:b.lv||1,cls:b.cls,tb:b.tb||0,stl:!!b.stl,snk:!!b.snk})}return l}
const AIP={alertR:18.857,flankK:0.433,flankMax:0.787,flankR:13.398,fleeHP:0.3,fleeH:0.942,fleeA:0.515,dodgeP:0.45,circleK:0.749,backK:0.302,strafeK:0.335,kiteR:10,herdR:8.875,shyR:2.039,shySp:0.826,pasFlee:1.056,cohD:6.815,npcPad:10,npcRun:4.5};
function isAuth(){return NET.role!=='client'}
// ---- wyrzucanie przedmiotów, wspólny zapis świata, szałasy, garderoba ----
const GD=new Map();
const PID=LS.get('pid',null)||(()=>{const p='p'+Math.random().toString(36).slice(2,10);LS.set('pid',p);return p})();
function dropItemById(id){let it=null;const bi=INV.bag.findIndex(x=>x.id===id);if(bi>=0){it=INV.bag[bi];INV.bag.splice(bi,1)}else for(const k in INV.eq)if(INV.eq[k]&&INV.eq[k].id===id){it=INV.eq[k];delete INV.eq[k]}
  if(!it)return;for(let k=0;k<8;k++)if(INV.hot[k]&&INV.hot[k].id===id)INV.hot[k]=null;selItem=null;afterInv();
  const fy=player.ry,x=player.p.x+Math.sin(fy)*1.6,z=player.p.z+Math.cos(fy)*1.6;const gid=PID+':'+Date.now();spawnDrop({p:[x,player.p.y,z],items:[it],gold:0,pot:0,xp:0,dropped:1,gid});if(isAuth())GD.set(gid,1);sendFx({k:'gdrop',gid,p:[x,player.p.y,z],it,nm:S.name});toast('Wyrzucono: '+it.name+' (leży na ziemi, możesz go podnieść)',RAR[it.rar].c);sfx('swing')}
whenReady(()=>{
  const inv=$('inv');inv.addEventListener('dragover',e=>{if(!e.target.closest('.card')){e.preventDefault();inv.classList.add('dropout')}else inv.classList.remove('dropout')});
  inv.addEventListener('dragleave',e=>{if(e.target===inv)inv.classList.remove('dropout')});
  inv.addEventListener('drop',e=>{inv.classList.remove('dropout');if(e.target.closest('.card'))return;e.preventDefault();const id=e.dataTransfer.getData('text/iid');if(id)dropItemById(id)});
  document.addEventListener('dragend',()=>inv.classList.remove('dropout'));
  // wspólny zapis świata: skrzynie, oczyszczone miejsca, szałasy
  W.huts=W.huts||[];
  const wsync=()=>({k:'wsync',opened:W.opened,dig:W.dig||{},huts:W.huts,cl:[...strState].filter(([k,v])=>v&&v.cleared)});
  FXH.dig=m=>{try{if(Array.isArray(m.c))digApply(m.c,true)}catch(_){}};FXH.wopen=m=>{const was=W.opened[m.id];W.opened[m.id]=was||m.at||Date.now();saveW();if(was||P2.dead)return;
    for(const s of structs.values())if(s&&s.id===m.id&&s.chest&&Math.hypot(s.chest.x-player.p.x,s.chest.z-player.p.z)<45){openChest(s,m.nm||'Kompan');return}
    if(SPC&&SPC.id===m.id&&SPC.chest)openSpaceChest(SPC,m.nm||'Kompan')};
  FXH.wsync=m=>{if(isAuth())return;let ch=0;try{if(m.dig){const c=[];for(const k in m.dig){const [x,z]=k.split(',').map(Number);c.push(x,z,m.dig[k])}if(c.length)digApply(c,false)}}catch(_){}for(const k in m.opened)if(!W.opened[k]){W.opened[k]=m.opened[k];ch=1}for(const [k,v] of m.cl||[]){const o=strState.get(k);if(!o||!o.cleared||o.cleared<v.cleared)strState.set(k,v)}
    const mine=W.huts.filter(h=>h.pid===PID);W.huts=(m.huts||[]).filter(h=>h.pid!==PID).concat(mine);saveW();syncHuts()};
  FXH.hut=m=>{W.huts=W.huts.filter(h=>h.pid!==m.h.pid);W.huts.push(m.h);saveW();syncHuts();if(m.h.pid!==PID)toast(m.h.n+' rozbił(a) szałas','#d9a27c')};
  FXH.gdrop=m=>{if(isAuth())GD.set(m.gid,1);spawnDrop({p:m.p,items:[m.it],gold:0,pot:0,xp:0,gid:m.gid});toast(m.nm+' wyrzucił(a): '+m.it.name,RAR[m.it.rar].c)};
  const rmDrop=gid=>{const i=drops.findIndex(d=>d.L.gid===gid);if(i<0)return null;const d=drops[i];scene.remove(d.g);try{freeObj(d.g)}catch(_){}drops.splice(i,1);return d};
  window.grantDrop=d=>{const it=d.L.items[0];if(!it)return;if(INV.bag.length>=bagN()){toast('Plecak pełny – przedmiot przepadłby, zostaw miejsce','#ff8a7a');return false}INV.bag.push(it);toast('Podniesiono: '+it.name,RAR[it.rar].c);saveInv();if(invOpen())renderInv();return true};
  FXH.gpickreq=m=>{if(!isAuth()||!GD.has(m.gid))return;GD.delete(m.gid);rmDrop(m.gid);sendFx({k:'gpick',gid:m.gid,to:m.to})};
  FXH.gpick=m=>{const d=rmDrop(m.gid);if(m.to===NET.id&&d){if(!grantDrop(d)){/* pełny plecak: odłóż z powrotem */const gid=m.gid;spawnDrop({p:[player.p.x,player.p.y,player.p.z],items:d.L.items,gold:0,pot:0,xp:0,gid,dropped:1});sendFx({k:'gdrop',gid,p:[player.p.x,player.p.y,player.p.z],it:d.L.items[0],nm:S.name});if(isAuth())GD.set(gid,1)}}};
  FXH.wreq=m=>{if(isAuth())sendFx(wsync())};
  let wsT=3,wasNet='off';TICKS.push(dt=>{if(NET.role==='off'){wasNet='off';return}if(NET.role==='client'&&wasNet!=='client'){wasNet='client';setTimeout(()=>{sendFx({k:'wreq'});for(const h of W.huts.filter(h=>h.pid===PID))sendFx({k:'hut',h})},2500)}
    if(isAuth()){wasNet='host';wsT-=dt;if(wsT<=0){wsT=20;sendFx(wsync())}}});
  // szałas
  const hutM=new Map();
  window.syncHuts=function(){for(const h of W.huts){if(hutM.has(h.id))continue;const g=new THREE.Group();
      g.add(new THREE.Mesh(boxes([[-1.2,0.9,-0.6,0.18,1.8,0.18,'#5a3b22'],[1.2,0.9,-0.6,0.18,1.8,0.18,'#5a3b22'],[0,1.8,-0.6,2.7,0.16,0.16,'#5a3b22'],[0,0.08,0,2.6,0.16,2.2,'#6b4a2b'],[-0.6,0.22,0.1,0.9,0.14,1.9,'#8a3a2a'],[0.5,0.22,0.1,0.9,0.14,1.9,'#3f5f8a'],[-0.6,0.32,-0.6,0.8,0.2,0.4,'#e8dcc0'],[0,0.25,2.2,1.2,0.5,0.4,'#6b4a2b'],[1.6,0.2,1.2,0.5,0.4,0.5,'#8a6a3a'],[0,0.12,1.3,1.1,0.24,1.1,'#6c6a67'],[0,0.3,1.3,0.7,0.2,0.2,'#4a2f1d'],[0,0.3,1.3,0.2,0.2,0.7,'#4a2f1d']]),decoMat));
      const roof=new THREE.Group();roof.position.set(0,1.8,-0.6);roof.rotation.x=1.05;roof.add(new THREE.Mesh(boxes([[0,0,1.1,2.9,0.14,2.3,'#4f6a2c'],[0.6,0.08,0.6,1.0,0.1,0.9,'#3f5a22'],[-0.7,0.08,1.5,1.1,0.1,0.8,'#5f7a34'],[0,0.1,2.1,2.9,0.12,0.25,'#6b4a2b'],[-1.1,0.12,1.1,0.12,0.12,2.3,'#5a3b22'],[1.1,0.12,1.1,0.12,0.12,2.3,'#5a3b22']]),decoMat));g.add(roof);
      const fl=new THREE.Mesh(boxes([[0,0.45,1.3,0.45,0.4,0.45,'#ff8a2e'],[0,0.7,1.3,0.25,0.3,0.25,'#ffe08a']]),new THREE.MeshBasicMaterial({vertexColors:true}));g.add(fl);g.userData.fl=fl;
      g.add(nameTag('Szałas · '+h.n,'#d9a27c'));g.children[g.children.length-1].position.y=3.2;
      g.position.set(h.x,h.y,h.z);g.rotation.y=h.ry;g.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(g);hutM.set(h.id,g)}
    for(const [id,g] of hutM)if(!W.huts.some(h=>h.id===id)){scene.remove(g);hutM.delete(id)}};
  syncHuts();
  window.buildHut=function(){if(SPC||P2.dead||VH.mode)return toast('Nie możesz tu rozbić szałasu','#ff8a7a');const fy=player.ry,x=player.p.x+Math.sin(fy)*3.2,z=player.p.z+Math.cos(fy)*3.2,h=colAt(x,z);
    if(h===null||h<WATER+0.3)return toast('Tu jest za mokro na szałas','#ff8a7a');if(inVillage(x,z,10))return toast('W osadzie śpij w karczmie – szałas rozbij poza nią','#ff8a7a');
    for(const [a,b] of [[1.4,1.4],[-1.4,1.4],[1.4,-1.4],[-1.4,-1.4]]){const q=colAt(x+a,z+b);if(q===null||Math.abs(q-h)>1.3)return toast('Teren jest za nierówny','#ff8a7a')}
    if(enemies.size&&[...enemies.values()].some(e=>!e.pas&&e.st!==2&&Math.hypot(e.p.x-x,e.p.z-z)<18))return toast('Wrogowie są za blisko','#ff8a7a');
    const hut={id:PID+':'+Date.now(),pid:PID,n:S.name,x,y:h,z,ry:fy+Math.PI};W.huts=W.huts.filter(q=>q.pid!==PID);W.huts.push(hut);saveW();syncHuts();sendFx({k:'hut',h:hut});setHome(hut);toast('Rozbito szałas. To twój nowy punkt odrodzenia.','#d9a27c');sfx('door')};
  window.setHome=function(h){LS.set('home_'+S.seed,[h.x+Math.sin(h.ry)*1.6,h.y+0.5,h.z+Math.cos(h.ry)*1.6])};
  // sen
  const night=()=>hour>=19.5||hour<5.8;let nearHut=null;
  TICKS.push(dt=>{nearHut=null;if(!SPC)for(const h of W.huts)if(Math.hypot(h.x-player.p.x,h.z-player.p.z)<3.2&&Math.abs(h.y-player.p.y)<2.5){nearHut=h;break}
    for(const g of hutM.values()){g.userData.fl.scale.y=0.85+Math.sin(performance.now()/90+g.position.x)*0.15}
    const pr=$('prompt');
    if(P2.sleep){if(P2.dead||keys.has('KeyW')||keys.has('KeyA')||keys.has('KeyS')||keys.has('KeyD')||keys.has('Space')){wake('Obudziłeś się.')}else{P2.hp=Math.min(ST.hp,P2.hp+ST.hp*0.08*dt);
      const all=playersList().filter(p=>!p.dead),sl=all.filter(p=>p.id===NET.id?P2.sleep:p.sl).length;$('sleepov').hidden=false;$('sleeptx').textContent=night()?(sl<all.length?`Czekasz, aż zasną wszyscy (${sl}/${all.length})…`:'Śpisz… noc mija'):'Świta!';
      if(isAuth()&&sl===all.length&&night())hour=(hour+dt*2.4)%24;if(!night()){wake('Dzień dobry! Wypoczęty.');P2.hp=ST.hp}}return}
    if(nearHut&&!nearNpc&&!dlg&&!nearDoor){pr.hidden=false;pr.innerHTML=night()?'<kbd>F</kbd> Prześpij noc w szałasie':'<kbd>F</kbd> Ustaw punkt odrodzenia (szałas)'}});
  window.wake=function(t){P2.sleep=false;$('sleepov').hidden=true;if(t)toast(t,'#ffd34d')};
  window.hutAct=function(){if(!nearHut)return false;setHome(nearHut);if(night()){if([...enemies.values()].some(e=>!e.pas&&e.st!==2&&Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z)<22)){toast('Nie zaśniesz, wrogowie są w pobliżu!','#ff8a7a');return true}
      P2.sleep=true;player.v.set(0,0,0);toast('Kładziesz się spać… (ruch budzi)','#cfe8ff')}else toast('Punkt odrodzenia ustawiony przy szałasie','#d9a27c');return true};
},0);
setTimeout(()=>{if(LS.get('helpmin',false))$('help').classList.add('min');else setTimeout(()=>{$('help').classList.add('min')},innerHeight<760||innerWidth<1100?15000:60000)},0);
// ---- pogoda, fale, życie w mieście ----
whenReady(()=>{
  FXH.arstart=m=>{let s=SPACES.get(m.sid)||null;if(!s){const v=villages.get(m.vid),h=v&&v.houses.find(q=>q.func==='arena');if(h)s=genArena(h,v)}if(s&&isAuth())arenaStart(s)};FXH.armsg=m=>{toast(m.txt,'#ffd34d')};FXH.arrew=m=>{AR.cur=m.w;if(SPC&&SPC.kind==='arena')arenaGive(m.w)};FXH.lever=m=>{const s=SPACES.get(m.sid);if(s)pullLever(s,m.i,1)};FXH.gate=m=>{const s=SPACES.get(m.sid);if(s)openGate(s,1)};FXH.wx=m=>{if(m.w!==WX.k){WX.k=m.w;toast('Pogoda: '+WXN[WX.k],'#cfe8ff')}};FXH.thun=m=>{WX.flash=1;setTimeout(()=>sfx('thunder'),400+Math.random()*900)};
  const NR=1600,rg=new THREE.BufferGeometry(),rp=new Float32Array(NR*6);rg.setAttribute('position',new THREE.BufferAttribute(rp,3));const rain=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xaabfd8,transparent:true,opacity:0.45,fog:false}));rain.frustumCulled=false;scene.add(rain);
  const NS=1400,sg=new THREE.BufferGeometry(),sp=new Float32Array(NS*3);sg.setAttribute('position',new THREE.BufferAttribute(sp,3));const snow=new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:0.18,transparent:true,opacity:0.9,fog:false}));snow.frustumCulled=false;scene.add(snow);
  const RB=36,RH=26;for(let i=0;i<NR;i++){rp[i*6]=(Math.random()-0.5)*RB*2;rp[i*6+1]=Math.random()*RH;rp[i*6+2]=(Math.random()-0.5)*RB*2}for(let i=0;i<NS;i++){sp[i*3]=(Math.random()-0.5)*RB*2;sp[i*3+1]=Math.random()*RH;sp[i*3+2]=(Math.random()-0.5)*RB*2}
  const pickW=()=>{const r=Math.random(),win=season===2;if(hour>4&&hour<8.5&&r<0.35)return 'mgla';if(r<0.42)return 'jasno';if(r<0.6)return win?'snieg':'deszcz';if(r<0.65)return win?'snieg':'burza';if(r<0.84)return 'mgla';return 'jasno'};
  let ox=0,oz=0;
  TICKS.push(dt=>{const t=performance.now()/1000;WATER_U.uT.value=t;WATER_U.uSky.value.copy(SKYC);
    if(isAuth()){WX.t-=dt;WX.sync-=dt;if(WX.t<=0){const nw=pickW();WX.t=nw==='jasno'?rnd(150,300):rnd(90,200);if(nw!==WX.k){WX.k=nw;toast('Pogoda: '+WXN[nw],'#cfe8ff');WX.sync=0}}if(WX.sync<=0){WX.sync=15;sendFx({k:'wx',w:WX.k})}
      if(WX.k==='burza'&&WX.i>0.6){WX.thT-=dt;if(WX.thT<=0){WX.thT=rnd(40,90);WX.flash=1;setTimeout(()=>sfx('thunder'),400+Math.random()*900);sendFx({k:'thun'})}}}
    WX.flash=Math.max(0,WX.flash-dt*3.5);
    const tgt=WX.k==='jasno'?0:1;WX.i+=(tgt-WX.i)*Math.min(1,dt*0.25);
    const p=camera.position,b=biomeAt(player.p.x,player.p.z),dry=b===4||b===8,cold=season===2||b===5||(b===6&&player.p.y>WATER+34);
    const wet=(WX.k==='deszcz'||WX.k==='burza'||WX.k==='snieg')&&!SPC&&!dry,isSnow=wet&&(cold||WX.k==='snieg'),isRain=wet&&!isSnow,amt=WX.i*(WX.k==='burza'?1:0.7);
    SEAS_U.uWet.value+=((isRain?WX.i*0.9:0)-SEAS_U.uWet.value)*Math.min(1,dt*0.15);
    rain.visible=isRain&&amt>0.05;snow.visible=isSnow&&amt>0.05;
    if(rain.visible){const n=Math.floor(NR*amt),sl=WX.k==='burza'?0.18:0.06;for(let i=0;i<NR;i++){const k=i*6;if(i>=n){rp[k+1]=-999;rp[k+4]=-999;continue}let x=rp[k],y=rp[k+1],z=rp[k+2];if(y<-500)y=Math.random()*RH;y-=dt*(26+(i%5));x+=dt*sl*30;
        if(y<0){y+=RH;x=(Math.random()-0.5)*RB*2;z=(Math.random()-0.5)*RB*2}if(x>RB)x-=RB*2;rp[k]=x;rp[k+1]=y;rp[k+2]=z;rp[k+3]=x-sl*1.2;rp[k+4]=y+1.1;rp[k+5]=z}rain.position.set(p.x,p.y-8,p.z);rg.attributes.position.needsUpdate=true}
    if(snow.visible){const n=Math.floor(NS*amt);for(let i=0;i<NS;i++){const k=i*3;if(i>=n){sp[k+1]=-999;continue}let y=sp[k+1];if(y<-500)y=Math.random()*RH;y-=dt*(2.2+(i%4)*0.4);sp[k]+=Math.sin(t*0.8+i)*dt*0.6;if(y<0){y+=RH;sp[k]=(Math.random()-0.5)*RB*2;sp[k+2]=(Math.random()-0.5)*RB*2}sp[k+1]=y}snow.position.set(p.x,p.y-8,p.z);sg.attributes.position.needsUpdate=true}});
  // życie w mieście: straże na murach, biegające dzieci
  TICKS.push(dt=>{for(const v of villages.values()){if(!v||!v.city||!v.g)continue;
      if(v.life){const a=v.life.g[0]||v.life.k[0];if(a&&a.m.parent!==v.g)v.life=null}
      if(!v.life){v.life={g:[],k:[]};const r=rngOf('life'+v.id);for(const [x,z,hw,hd,top] of v.walls){if(r()<0.4)continue;const long=hw>hd,len=(long?hw:hd)*2,out=long?Math.sign(z-v.z):Math.sign(x-v.x);
          const R=RACES[v.race]||RACES.ludzie,o=makeNpc({id:v.id+':wg'+v.life.g.length,vid:v.id,race:v.race,role:'straz',fem:false,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth)});o.userData.g.userData.noVox=1;v.g.add(o);v.life.g.push({m:o,a:o.userData.g,x,z,long,out,len,top,ph:r()*6.28,sp:0.04+r()*0.03})}
        for(let i=0;i<3+Math.floor(r()*3);i++)v.life.k.push(Object.assign(kidChar(v,r,i),{a:r()*6.28,r:6+r()*5,sp:(r()<0.5?1:-1)*(0.35+r()*0.25),cx:v.x+(r()-0.5)*6,cz:v.z+(r()-0.5)*6,ph:r()*9}))}
      if(Math.hypot(v.x-player.p.x,v.z-player.p.z)>140)continue;
      for(const q of v.life.g){const s=Math.sin(worldT*q.sp+q.ph),a=s*(q.len/2-2.5),dir=Math.cos(worldT*q.sp+q.ph)>0?1:-1;const x=q.long?q.x+a:q.x-q.out*0.5,z=q.long?q.z-q.out*0.5:q.z+a;q.m.position.set(x,q.top-0.5,z);q.m.rotation.y=q.long?(dir>0?Math.PI/2:-Math.PI/2):(dir>0?0:Math.PI);if(Math.abs(s)>0.97){q.m.rotation.y=q.long?(q.out>0?0:Math.PI):(q.out>0?Math.PI/2:-Math.PI/2);animChar(q.a||q.m,0,dt,false,false)}else animChar(q.a||q.m,1.4,dt,false,false)}
      {const hk=hour>=20.5||hour<6||v._dg;for(const k of v.life.k)k.m.visible=!hk}
      for(const k of v.life.k){k.ph+=dt;const run=Math.sin(k.ph*0.3)>-0.4;if(run)k.a+=dt*k.sp*(5/k.r);const x=k.cx+Math.cos(k.a)*k.r,z=k.cz+Math.sin(k.a)*k.r;let h=villageGround(x,z,999);if(h===null)h=colAt(x,z);k.m.position.set(x,(h??v.h)+(run?Math.abs(Math.sin(k.ph*9))*0.12:0),z);k.m.rotation.y=Math.atan2(-Math.sin(k.a)*k.sp,Math.cos(k.a)*k.sp);animChar(k.g||k.m,run?3.2:0,dt,false,false)}}});
  // dzieci w wioskach (rasy osady)
  TICKS.push(dt=>{for(const v of villages.values()){if(!v||v.city||v.small||v.wander||!v.g)continue;if(v.kids&&v.kids.length&&v.kids[0].m.parent!==v.g)v.kids=null;if(!v.kids){const r=rngOf('vkid'+v.id);v.kids=[];const n=r()<0.25?0:1+Math.floor(r()*3);for(let i=0;i<n;i++)v.kids.push(Object.assign(kidChar(v,r,i),{a:r()*6.28,r:4+r()*4,sp:(r()<0.5?1:-1)*(0.3+r()*0.25),cx:v.x+(r()-0.5)*4,cz:v.z+(r()-0.5)*4,ph:r()*9}))}
    if(Math.hypot(v.x-player.p.x,v.z-player.p.z)>110)continue;const hk=hour>=20.5||hour<6||v._dg;
    for(const k of v.kids){k.m.visible=!hk;if(hk)continue;k.ph+=dt;const run=Math.sin(k.ph*0.3)>-0.4;if(run)k.a+=dt*k.sp*(5/k.r);const x=k.cx+Math.cos(k.a)*k.r,z=k.cz+Math.sin(k.a)*k.r;let h=villageGround(x,z,999);if(h===null)h=colAt(x,z);k.m.position.set(x,(h??v.h)+(run?Math.abs(Math.sin(k.ph*9))*0.12:0),z);k.m.rotation.y=Math.atan2(-Math.sin(k.a)*k.sp,Math.cos(k.a)*k.sp);animChar(k.g,run?3.2:0,dt,false,false)}}});
},0);
// ---- co-op: znaczniki, podnoszenie kompana ----
whenReady(()=>{
  FXH.mark=m=>{MARKS.set('p'+m.id,{x:m.x,z:m.z,n:m.n,col:m.col,t:180});toast(m.n+' postawił(a) znacznik na mapie',m.col)};
  FXH.unmark=m=>{MARKS.delete('p'+m.id)};
  FXH.rev=m=>{if(m.to!==NET.id||!(P2.dead>0))return;P2.dead=0;P2.down=0;P2.hp=ST.hp*0.5;P2.iframe=2;$('dead').hidden=true;toast('Podniósł cię: '+m.nm+'!','#7dd87d');sfx('lvl')};
  const beams=new Map(),bGeo=new THREE.CylinderGeometry(0.35,0.35,60,8,1,true);
  TICKS.push(dt=>{for(const [k,mk] of MARKS){if(mk.t!=null){mk.t-=dt;if(mk.t<=0){MARKS.delete(k);continue}}let b=beams.get(k);if(!b){b=new THREE.Mesh(bGeo,new THREE.MeshBasicMaterial({color:mk.col,transparent:true,opacity:0.35,depthWrite:false,fog:false}));scene.add(b);beams.set(k,b)}
      b.material.color.set(mk.col);const h=colAt(mk.x,mk.z);b.position.set(mk.x,(h??player.p.y)+30,mk.z);b.visible=!SPC;b.material.opacity=0.25+Math.sin(performance.now()/300)*0.08}
    for(const [k,b] of beams)if(!MARKS.has(k)){scene.remove(b);b.material.dispose();beams.delete(k)}});
  let rv=0;TICKS.push(dt=>{if(P2.dead>0){$('deadt').textContent=Math.ceil(Math.max(0,P2.dead));return}let tgt=null;for(const [id,r] of remotes){const b=r.buf[r.buf.length-1];if(b&&b.a===5&&Math.hypot(b.p[0]-player.p.x,b.p[2]-player.p.z)<2.8&&Math.abs(b.p[1]-player.p.y)<2.5){tgt=[id,r];break}}
    const pr=$('prompt');if(!tgt){rv=0;return}if(keys.has('KeyF'))rv+=dt;else rv=Math.max(0,rv-dt*2);pr.hidden=false;pr.innerHTML='Przytrzymaj <kbd>F</kbd>: podnieś <b></b> <span class="revbar"><i style="width:'+Math.round(rv/2.5*100)+'%"></i></span>';pr.querySelector('b').textContent=tgt[1].name;
    if(rv>=2.5){rv=0;sendFx({k:'rev',to:tgt[0],nm:S.name});toast('Podnosisz: '+tgt[1].name,'#7dd87d');sfx('lvl')}});
  $('deadnow').onclick=()=>{if(P2.dead>0)respawn()};
},0);
const MARKS=new Map(),FXH={},TICKS=[];setTimeout(()=>TICKS.push(dt=>PFX.tick(dt)),0);
const SKYDOME=(()=>{const mat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,depthTest:false,fog:false,uniforms:{uH:{value:new THREE.Color(0x9cc7e6)},uZ:{value:new THREE.Color(0x4a7ac8)},uS:{value:new THREE.Vector3(0,1,0)},uSC:{value:new THREE.Color(0xfff0c0)}},
  vertexShader:'varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform vec3 uH;uniform vec3 uZ;uniform vec3 uS;uniform vec3 uSC;varying vec3 vD;void main(){vec3 d=normalize(vD);float h=clamp(d.y,0.0,1.0);vec3 c=mix(uH,uZ,pow(h,0.5));float s=max(dot(d,normalize(uS)),0.0);c+=uSC*(pow(s,90.0)*1.2+pow(s,8.0)*0.22);if(d.y<0.0)c=uH;gl_FragColor=vec4(c,1.0);}'});
  const m=new THREE.Mesh(new THREE.SphereGeometry(1,32,16),mat);m.renderOrder=-10;m.frustumCulled=false;scene.add(m);return{m,mat}})();
setTimeout(()=>TICKS.push(dt=>{const U=SKYDOME.mat.uniforms;SKYDOME.m.position.copy(camera.position);SKYDOME.m.scale.setScalar(camera.far*0.85);U.uH.value.copy(scene.fog.color);
  const br=(SKYC.r+SKYC.g+SKYC.b)/3;U.uZ.value.copy(SKYC).multiplyScalar(0.62).lerp(new THREE.Color(0.18*br*2,0.36*br*2,0.82*br*1.6),0.45);U.uS.value.copy(SV);U.uSC.value.setRGB(1,0.92,0.72).multiplyScalar(Math.min(1,br*1.6)*(1-WX.i*0.7));
  SKYDOME.m.visible=!SPC&&player.p.y>=WATER-1.15}),0);
function evMsg(txt,col,mk){toast(txt,col);if(mk)MARKS.set('evt',{x:mk[0],z:mk[1],n:mk[2],col:'#ffd34d',evt:1});else MARKS.delete('evt');sendFx({k:'evt',txt,col,mk:mk||null})}
const EVT={cur:null,next:150};
function evPlayers(x,z,r){return playersList().filter(p=>Math.hypot(p.p.x-x,p.p.z-z)<r)}
function evReward(c,x,z,r){for(const p of evPlayers(x,z,r)){const gold=Math.round(c.lvl*22+40),xp=Math.round(c.lvl*70+80),txt='Nagroda za wydarzenie „'+c.name+'”';if(p.id===NET.id)giveEvReward(gold,xp,txt);else sendFx({k:'evrw',to:p.id,gold,xp,txt})}}
function giveEvReward(gold,xp,txt){INV.gold+=gold;gainXp(xp);saveInv();updHud();toast(txt+': +'+gold+' zł','#ffd34d');sfx('coin');if(Math.random()<0.6){const it=genItem(HERO.lvl,30);if(INV.bag.length<bagN()){INV.bag.push(it);saveInv();toast('Otrzymano: '+it.name,RAR[it.rar].c)}}}
function evLvl(x,z){const sp=spawnPt();return Math.max(1,1+Math.floor(Math.hypot(x-sp[0],z-sp[2])/260))}
function nearVillage(x,z,maxd,skip){let best=null,bd=maxd;for(const v of villages.values()){if(!v||v===skip||v.wander)continue;const d=Math.hypot(v.x-x,v.z-z);if(d<bd){bd=d;best=v}}return best}
function startEvent(kind,pp){
  if(kind==='napad'){const v=nearVillage(pp.p.x,pp.p.z,170);if(!v)return false;const a=Math.random()*6.283,x=v.x+Math.cos(a)*55,z=v.z+Math.sin(a)*55,h=colAt(x,z);if(h===null||h<WATER)return false;
    const lvl=evLvl(v.x,v.z),kinds=['bandyta','ork','bandyta','ork','szaman','bandyta','ork','kusznik','bandyta','ork'].filter(k=>EDEF[k]),np=evPlayers(v.x,v.z,220).length,allMem=[],groups=v.city?3:2,per=6+Math.min(4,np*2);
    for(let gi=0;gi<groups;gi++){const a2=a+gi*(Math.PI*2/groups)+rnd(-0.3,0.3),gx=v.x+Math.cos(a2)*55,gz=v.z+Math.sin(a2)*55,gh=colAt(gx,gz);if(gh===null||gh<WATER)continue;const id=bandSeq++,B={id,tx:v.x,tz:v.z,t:99,mem:[],raid:[v.x,v.z]};BANDS.set(id,B);
      for(let i=0;i<per;i++){const xx=gx+rnd(-3,3),zz=gz+rnd(-3,3),hh=colAt(xx,zz);if(hh===null)continue;const kk=kinds[(i+gi)%kinds.length];const e=makeE(kk,lvl,i===0,xx,hh,zz,{band:id,evt:1,torch:HUM[kk]&&i%2===0,bo:[(i%3-1)*1.8,-Math.floor(i/3)*1.8-(i?1.4:0)]});B.mem.push(e.id);allMem.push(e.id)}}
    if(!allMem.length)return false;
    EVT.cur={kind,name:'Napad na '+(v.name||'osadę'),t:300,lvl,mem:allMem,vx:v.x,vz:v.z};evMsg('⚔ Bandyci napadają na: '+(v.name||'osadę')+'! Obroń mieszkańców.','#ff9d6b',[v.x,v.z,'Napad']);return true}
  if(kind==='karawana'){const A=nearVillage(pp.p.x,pp.p.z,140);if(!A)return false;const B2=nearVillage(A.x,A.z,420,A);if(!B2||Math.hypot(B2.x-A.x,B2.z-A.z)<90)return false;
    const dx=B2.x-A.x,dz=B2.z-A.z,l=Math.hypot(dx,dz),x=A.x+dx/l*14,z=A.z+dz/l*14,h=colAt(x,z);if(h===null)return false;const lvl=evLvl(A.x,A.z);
    const e=makeE('woz',lvl,false,x,h,z,{pas:1,evt:1,car:{tx:B2.x,tz:B2.z,sx:x,sz:z,amb:null,best:1e9,stuck:0}});
    EVT.cur={kind,name:'Karawana do: '+(B2.name||'osady'),t:420,lvl,eid:e.id,tx:B2.x,tz:B2.z};evMsg('🐎 Kupiecka karawana wyrusza z: '+(A.name||'osady')+' do: '+(B2.name||'osady')+'. Eskortuj ją!','#7dd87d',[x,z,'Karawana']);return true}
  if(kind==='kupiec'){// wędrowny kupiec rozkłada kram tylko na targu najbliższego miasta
    let cty=null,bd=700;for(const v of villages.values()){if(!v||!v.city||v.wander)continue;const dd=Math.hypot(v.x-pp.p.x,v.z-pp.p.z);if(dd<bd){bd=dd;cty=v}}if(!cty)return false;
    for(const v of villages.values())if(v&&v.wander&&v.inCity===cty.id)return false;
    const [x,z,ry]=mktSlot(cty,6),h=cty.h;
    const d={id:'wk'+Math.floor(Math.random()*1e9),x,z,h,ry,inCity:cty.id,b:biomeAt(x,z),lvl:evLvl(x,z)};addWanderer(d);sendFx({k:'wkup',d});EVT.cur={kind,name:'Wędrowny kupiec',t:420,wid:d.id,done:false};
    evMsg('💰 Na targu w mieście '+(cty.name||'')+' rozłożył kram wędrowny kupiec z rzadkimi towarami!','#ffd34d',[x,z,'Kupiec']);return true}
  return false}
function addWanderer(d){if(villages.has(d.id))return;const R=RACES.ludzie,r=rngOf(d.id),fem=r()<0.3,pool=fem?R.f:R.m;
  const v={id:d.id,x:d.x,z:d.z,h:d.h,b:d.b,race:'ludzie',small:1,wander:1,inCity:d.inCity||null,houses:[],npcs:[],lvl:d.lvl,name:'Wędrowny kupiec',cols:[]};
  v.npcs.push({id:d.id+':kupiec',vid:d.id,role:'kupiec',rare:1,fem,name:pool[Math.floor(r()*pool.length)],roleN:fem?'Wędrowna kupcowa':'Wędrowny kupiec',x:d.x,z:d.z,ry:d.ry||0,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth),race:'ludzie',qg:false});villages.set(d.id,v)}
function removeWanderer(id){const v=villages.get(id);if(!v)return;if(dlg&&dlg.n&&dlg.n.vid===id)closeDialog();if(v.g)unbuildVillage(v);villages.delete(id)}
function caravanMove(e,dt){const c=e.car,dx=c.tx-e.p.x,dz=c.tz-e.p.z,d=Math.hypot(dx,dz);
  if(d<8){e.carDone=1;return[0,0,0]}
  const tot=Math.hypot(c.tx-c.sx,c.tz-c.sz)||1;
  if(!c.amb&&d<tot*0.6){c.amb=[];const a=Math.atan2(dx,dz),x=e.p.x+Math.sin(a)*18,z=e.p.z+Math.cos(a)*18,lvl=e.lvl;for(let i=0;i<5;i++){const xx=x+rnd(-5,5),zz=z+rnd(-5,5),hh=colAt(xx,zz);if(hh===null)continue;const q=makeE(i%3===2?'lucznik_s':'bandyta',lvl,i===0,xx,hh,zz,{evt:1,prov:20});c.amb.push(q.id)}
    toast('Zasadzka na karawanę!','#ff6b5b');sendFx({k:'toast',txt:'Zasadzka na karawanę!',col:'#ff6b5b'})}
  if(c.amb&&c.amb.some(id=>{const q=enemies.get(id);return q&&q.st!==2&&Math.hypot(q.p.x-e.p.x,q.p.z-e.p.z)<26}))return[0,0,0];
  if(!playersList().some(p=>!p.dead&&Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)<28))return[0,0,0];
  if(d<c.best-0.5){c.best=d;c.stuck=0}else{c.stuck+=dt;if(c.stuck>8){const nx=e.p.x+dx/d*6,nz=e.p.z+dz/d*6,h=colAt(nx,nz);if(h!==null){e.p.set(nx,h,nz)}c.stuck=0}}
  e.ry=Math.atan2(dx,dz);return[dx/d,dz/d,1]}
function eventTick(dt){if(!isAuth())return;const c=EVT.cur;EVT.next-=dt;
  if(c){c.t-=dt;
    if(c.kind==='napad'){if(c.mem.every(id=>{const q=enemies.get(id);return !q||q.st===2})){const alive=c.mem.some(id=>enemies.has(id));if(!c.mem.some(id=>{const q=enemies.get(id);return q&&q.st!==2})){evReward(c,c.vx,c.vz,220);evMsg('Napad odparty! Mieszkańcy dziękują.','#7dd87d');c.done=1}}}
    if(c.kind==='karawana'){const e=enemies.get(c.eid);if(!e){if(!c.done){evMsg('Karawana przepadła…','#ff8a7a');c.done=1}}else if(e.carDone){evReward(c,e.p.x,e.p.z,60);evMsg('Karawana dotarła bezpiecznie!','#7dd87d');removeEnemy(e.id);c.done=1}}
    if(c.kind==='kupiec'&&c.t<=0){removeWanderer(c.wid);sendFx({k:'wkupx',id:c.wid});evMsg('Wędrowny kupiec ruszył w dalszą drogę.','#d2c29e');c.done=1}
    if(c.t<=0&&!c.done){evMsg('Wydarzenie „'+c.name+'” przepadło.','#ff8a7a');if(c.kind==='karawana')removeEnemy(c.eid);c.done=1}
    if(c.done){EVT.cur=null;EVT.next=rnd(200,340)}return}
  if(EVT.next>0||SPC)return;const pl=playersList().filter(p=>!p.dead&&p.p.y<450);if(!pl.length)return;const pp=pick(pl);
  if(!startEvent(Math.random()<0.1?'kupiec':pick(['napad','karawana']),pp))EVT.next=20}
const HBQ=[];setInterval(()=>{let n=0;while(HBQ.length&&n<1){const e=HBQ.shift();if(e&&e.m&&!HBG.has(e.t+(e.elite?'e':''))){try{hbGrid(e)}catch(_){}n++}}},120);
function addEnemyModel(e){HBQ.push(e);e.m=makeEnemy(e.t,e.elite);if(e.rar)e.m.scale.multiplyScalar(ERAR[e.rar].sc);if(e.t==='kon'||e.t==='woz')horseCoat(e.m,e.id%HCOATS.length);if(e.torch)torchModel(e.m);scene.add(e.m)}
function freeGeos(o){o.traverse(q=>{const g=q.geometry;if(g&&g.dispose&&!(q.userData&&q.userData.keep)&&!(g.userData&&g.userData.keep)&&(typeof ringGeo==='undefined'||g!==ringGeo)&&(typeof discGeo==='undefined'||g!==discGeo))g.dispose()})}
function freeObj(o){const SH=new Set([decoMat,GLOWMAT,typeof projMat!=='undefined'?projMat:null,...Object.values(ARMATS)]);freeGeos(o);o.traverse(q=>{const m=q.material;if(m&&!Array.isArray(m)&&m.dispose&&!SH.has(m)&&!(m.userData&&m.userData.keep)){freeTagTex(m);m.dispose()}})}
function freeTagTex(m){const t=m&&m.map;if(t&&t.isCanvasTexture&&m.isSpriteMaterial&&(typeof glowTex==='undefined'||t!==glowTex)&&(typeof heartTex==='undefined'||t!==heartTex))t.dispose()}
function removeEnemy(id){const e=enemies.get(id);if(!e)return;scene.remove(e.m);e.m.userData.mat.dispose();try{freeGeos(e.m);e.m.traverse(o=>{if(o.isSprite&&o.material&&o.material.map&&o.material.map.isCanvasTexture){freeTagTex(o.material);o.material.dispose()}})}catch(_){}enemies.delete(id)}
function clearEnemies(){for(const id of [...enemies.keys()])removeEnemy(id)}
let spawnT=0;
// wędrówka: idzie do losowego punktu wokół swojego miejsca, chwilę stoi, rozgląda się i idzie dalej
function wanderStep(e,dt,R,spd){spd=spd||0.4;if(!e.anc)e.anc=e.home?[e.home[0],e.home[1]]:[e.p.x,e.p.z];const W=e.wan;
  if(!W||W.t<=0){if(W&&W.w){e.wan={t:rnd(0.8,2.6),w:0}}else{const a=Math.random()*6.283,r=rnd(R*0.3,R);e.wan={t:rnd(4,9),w:1,tx:e.anc[0]+Math.cos(a)*r,tz:e.anc[1]+Math.sin(a)*r}}return null}
  W.t-=dt;if(!W.w)return null;const dx=W.tx-e.p.x,dz=W.tz-e.p.z,l=Math.hypot(dx,dz);if(l<0.8){W.t=0;return null}return[dx/l,dz/l,spd]}
function passiveAI(e,dt){
  if(e.prov>0&&!e.herdA){e.herdA=1;for(const o of enemies.values())if(o!==e&&o.t===e.t&&o.pas&&Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z)<AIP.herdR)o.prov=Math.max(o.prov,5)}if(e.prov<=0)e.herdA=0;
  if(e.prov<=0){for(const p of playersList()){const dd=Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z);if(dd<AIP.shyR&&!p.dead){const dx=e.p.x-p.p.x,dz=e.p.z-p.p.z,l=dd||1;e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,AIP.shySp]}}}
  if(e.prov>0){let best=null,bd=1e9;for(const p of playersList()){const d=Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z);if(d<bd){bd=d;best=p}}
    if(best&&bd<30){const dx=e.p.x-best.p.x,dz=e.p.z-best.p.z,l=Math.hypot(dx,dz)||1;e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,AIP.pasFlee]}}
  {let cx=0,cz=0,n=0;if(!e.wan||e.wan.t<=0)for(const o of enemies.values())if(o!==e&&o.t===e.t&&EDEF[o.t].passive&&Math.abs(o.p.x-e.p.x)<20&&Math.abs(o.p.z-e.p.z)<20){cx+=o.p.x;cz+=o.p.z;n++}
   if(n){cx/=n;cz/=n;if(Math.hypot(cx-e.p.x,cz-e.p.z)>AIP.cohD)e.anc=[cx,cz]}}
  const W2=wanderStep(e,dt,10,0.32);if(W2){e.ry=Math.atan2(W2[0],W2[1]);return W2}return[0,0,0];
}
function spawnTick(){
  const pl=playersList().filter(p=>!p.dead);
  for(const pp of pl){if(pp.p.y>450)continue;
    if(Math.random()<0.012&&BANDS.size<1)spawnBand(pp);
    let near=0,pas=0;for(const e of enemies.values()){const dd=Math.hypot(e.p.x-pp.p.x,e.p.z-pp.p.z);if(dd<60){if(e.pas)pas++;else near++}}
    if(pas<4){const a=Math.random()*Math.PI*2,d=rnd(24,48),x=pp.p.x+Math.cos(a)*d,z=pp.p.z+Math.sin(a)*d,h=colAt(x,z),b=biomeAt(x,z),vv=inVillage(x,z,30);
      const list=vv?VILLAGE_P:BIOME_P[b];
      if(h!==null&&!wetAt(x,z,h)&&list&&!pl.some(q=>Math.hypot(q.p.x-x,q.p.z-z)<16)){let t=pick(list);if(FANT_P.has(t)&&Math.random()<0.55)t=pick(list);const n=1+Math.floor(Math.random()*(HERD[t]||1));
        for(let i=0;i<n;i++){const xx=x+rnd(-3,3),zz=z+rnd(-3,3),hh=colAt(xx,zz);if(hh!==null&&hh>=WATER-0.5&&Math.abs(hh-h)<2)makeE(t,1,false,xx,hh,zz,{pas:1})}}}
    {const ph=colAt(pp.p.x,pp.p.z);if(ph!==null&&ph<WATER-0.5&&pp.p.y<WATER+2&&Math.random()<0.18){let sw=0;for(const o of enemies.values())if(EDEF[o.t].swim&&o.st!==2)sw++;if(sw<3)for(let k=0;k<6;k++){const a=Math.random()*6.28,dd=rnd(24,40),x=pp.p.x+Math.cos(a)*dd,z=pp.p.z+Math.sin(a)*dd,h=colAt(x,z);if(h!==null&&h<WATER-3.5&&!(season===2&&WATER_U.uIce.value>0.5&&h>WATER-4.2)){const sp=spawnPt(),dist=Math.hypot(x-sp[0],z-sp[2]),lv=Math.max(1,1+Math.floor(dist/260));let t=seaPick(WATER-h,dist,hour>=19.5||hour<5.8);if((t==='lewiatan'||t==='kraken')&&[...enemies.values()].some(o=>(o.t==='lewiatan'||o.t==='kraken')&&o.st!==2))t='rekin';if(t==='waz_morski'&&h>WATER-6)t='rekin';makeE(t,lv,false,x,WATER-1.15,z,{});if(t==='lewiatan'){toast('Woda drży… Z głębin wynurza się LEWIATAN!','#7fe3ff')}else if(t==='kraken')toast('Coś ogromnego porusza się pod powierzchnią… KRAKEN!','#ff9a8a');break}}}}
    if(near>=2||Math.random()<0.5)continue;
    for(let tries=0;tries<4;tries++){
      const a=Math.random()*Math.PI*2,d=rnd(28,52),x=pp.p.x+Math.cos(a)*d,z=pp.p.z+Math.sin(a)*d;
      const h=colAt(x,z),b=biomeAt(x,z);if(h===null||h<WATER||!BIOME_E[b])continue;
      if(pl.some(q=>Math.hypot(q.p.x-x,q.p.z-z)<20)||inVillage(x,z,48))continue;
      let t=pick(BIOME_E[b]);const sp=spawnPt(),dist=Math.hypot(x-sp[0],z-sp[2]);
      if(dist>350&&Math.random()<0.035){const gt=giantFor(b);if(gt&&EDEF[gt]){let gn=0;for(const o of enemies.values())if(EDEF[o.t].giant&&o.st!==2)gn++;if(!gn){t=gt;toast('Ziemia drży… w pobliżu krąży '+EDEF[gt].n+'!','#ff9d6b')}}}
      const lvl=Math.max(1,1+Math.floor(dist/260)+(Math.random()<0.3?1:0)),elite=!EDEF[t].giant&&Math.random()<0.07;
      makeE(t,lvl,elite,x,h,z,{});break;
    }
  }
  for(const e of [...enemies.values()]){const dmin=Math.min(...pl.concat(playersList()).map(p=>Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)));if(dmin>(e.qid||e.evt?260:95)||colAt(e.p.x,e.p.z)===null)removeEnemy(e.id)}
}
// ===== NAWIGACJA WROGÓW: siatka 1 m z pamięcią podręczną, A* wokół budynków, murów, wody i urwisk =====
const NAV={c:new Map(),cs:new Map(),t:0,budget:0,R:26};
const NAVN=(NAV.R*2+1)*(NAV.R*2+1),NAVG=new Float32Array(NAVN),NAVF=new Float32Array(NAVN),NAVP=new Int32Array(NAVN),NAVS=new Uint8Array(NAVN),NAVH=new Int32Array(NAVN+8);
function navCell(ix,iz,y){const sp=y>450,M=sp?NAV.cs:NAV.c,k=vkey(ix,iz);let v=M.get(k);if(v!==undefined)return v;const x=ix+0.5,z=iz+0.5,h=colAt(x,z,sp?y:undefined);
  if(h===null)v=-1;else if(sp)v=h>y+6?-1:h;else if(wetAt(x,z,h))v=-1;else if(VOX.size&&voxProbe(x,z,h,0.3,1.6).block)v=-1;else if(solidAt(x,h+0.9,z))v=-1;else v=h;
  M.set(k,v);return v}
const NDI=[1,-1,0,0,1,1,-1,-1],NDJ=[0,0,1,-1,1,-1,1,-1];
const navStep=(ha,hb)=>hb>=0&&hb-ha<=1.05&&ha-hb<=3.6;
// czy da się przejść po prostej (próbkowanie co 0,5 m)
function navLine(x0,z0,x1,z1,y,maxD){const dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz);if(L<0.6)return true;const D=Math.min(L,maxD||16),n=Math.ceil(D/0.5);let pi=Math.floor(x0),pj=Math.floor(z0),ph=navCell(pi,pj,y);if(ph<0)ph=colAt(x0,z0,y>450?y:undefined)??y;
  for(let k=1;k<=n;k++){const t=k/n*D/L,ix=Math.floor(x0+dx*t),iz=Math.floor(z0+dz*t);if(ix===pi&&iz===pj)continue;const h=navCell(ix,iz,y);if(!navStep(ph,h))return false;
    if(ix!==pi&&iz!==pj){if(navCell(ix,pj,y)<0||navCell(pi,iz,y)<0)return false}pi=ix;pj=iz;ph=h}return true}
// A* w oknie 53×53 m wokół startu; zwraca listę punktów [x,z] (po wygładzeniu) albo null
function navPath(sx,sz,tx,tz,y,maxN){const R=NAV.R,W=R*2+1,ox=Math.floor(sx)-R,oz=Math.floor(sz)-R,six=R,siz=R;let tix=Math.floor(tx)-ox,tiz=Math.floor(tz)-oz;
  NAVS.fill(0);let hn=0;const push=(i,f)=>{let c=hn++;NAVF[i]=f;while(c>0){const p2=(c-1)>>1;if(NAVF[NAVH[p2]]<=f)break;NAVH[c]=NAVH[p2];c=p2}NAVH[c]=i},pop=()=>{const top=NAVH[0],last=NAVH[--hn];if(hn>0){const f=NAVF[last];let c=0;for(;;){let ch=c*2+1;if(ch>=hn)break;if(ch+1<hn&&NAVF[NAVH[ch+1]]<NAVF[NAVH[ch]])ch++;if(NAVF[NAVH[ch]]>=f)break;NAVH[c]=NAVH[ch];c=ch}NAVH[c]=last}return top};
  const hh=(i,j)=>{const a=Math.abs(i-tix),b=Math.abs(j-tiz);return Math.max(a,b)+0.414*Math.min(a,b)};
  const s0=siz*W+six;NAVG[s0]=0;NAVP[s0]=-1;NAVS[s0]=1;push(s0,hh(six,siz));let best=s0,bh=hh(six,siz),exp=0;
  let sh=navCell(six+ox,siz+oz,y);if(sh<0)sh=colAt(sx,sz,y>450?y:undefined)??y;const HT=new Map();HT.set(s0,sh);
  while(hn>0&&exp<maxN){const cur=pop();if(NAVS[cur]===2)continue;NAVS[cur]=2;exp++;const ci=cur%W,cj=(cur-ci)/W,ch=HT.get(cur),hd=hh(ci,cj);if(hd<bh){bh=hd;best=cur}if(ci===tix&&cj===tiz){best=cur;break}
    for(let d=0;d<8;d++){const di=NDI[d],dj=NDJ[d],ni=ci+di,nj=cj+dj;if(ni<0||nj<0||ni>=W||nj>=W)continue;const nk=nj*W+ni;if(NAVS[nk]===2)continue;const nh=navCell(ni+ox,nj+oz,y);if(!navStep(ch,nh))continue;
      if(d>3){const a=navCell(ci+di+ox,cj+oz,y),b=navCell(ci+ox,cj+dj+oz,y);if(!navStep(ch,a)||!navStep(ch,b))continue}
      const g=NAVG[cur]+(d>3?1.414:1)+(nh>ch?0.4:0);if(NAVS[nk]===1&&g>=NAVG[nk])continue;NAVG[nk]=g;NAVP[nk]=cur;NAVS[nk]=1;HT.set(nk,nh);push(nk,g+hh(ni,nj)*1.05)}}
  if(best===s0)return null;const pts=[];for(let c=best;c!==-1;c=NAVP[c]){const ci=c%W,cj=(c-ci)/W;pts.push([ci+ox+0.5,cj+oz+0.5])}pts.reverse();pts[0]=[sx,sz];
  // wygładzanie: pomijaj punkty, do których da się dojść po prostej
  const out=[pts[0]];let a=0;while(a<pts.length-1){let b=Math.min(pts.length-1,a+12);while(b>a+1&&!navLine(pts[a][0],pts[a][1],pts[b][0],pts[b][1],y,40))b--;out.push(pts[b]);a=b}
  out.done=best===(tiz*W+tix);return out}
// kierunek ruchu do celu z omijaniem przeszkód; null = idź prosto
function navSteer(e,gx,gz,dt){const d=EDEF[e.t];if(d.fly||d.swim||e.car||d.passive||eSc(e)>=2.6)return null;const dist=Math.hypot(gx-e.p.x,gz-e.p.z);if(dist<1.2){e.path=null;return null}
  e.nt=(e.nt||0)-dt;e.stT=(e.stT||0)+dt;if(e.stT>0.7){const mv=Math.hypot(e.p.x-(e.sx??e.p.x+9),e.p.z-(e.sz??e.p.z));e.stuck=mv<0.3;e.sx=e.p.x;e.sz=e.p.z;e.stT=0;if(e.stuck){e.nt=0;e.path=null}}
  if(e.path){const P=e.path.p;while(e.path.i<P.length&&Math.hypot(P[e.path.i][0]-e.p.x,P[e.path.i][1]-e.p.z)<0.75)e.path.i++;
    if(e.path.i>=P.length)e.path=null;else if(e.nt<=0||Math.hypot(gx-e.path.gx,gz-e.path.gz)>3.5){if(navLine(e.p.x,e.p.z,gx,gz,e.p.y,16)&&!e.stuck){e.path=null;e.nt=0.3+Math.random()*0.2}else if(NAV.budget>0){NAV.budget--;const N=navPath(e.p.x,e.p.z,gx,gz,e.p.y,e.p.y>450?1600:700);e.nt=0.8+Math.random()*0.5;e.path=N&&N.length>1?{p:N,i:1,gx,gz}:null}else e.nt=0.15}}
  if(!e.path){if(e.nt>0&&!e.stuck)return e.blk?[0,0]:null;
    if(!e.stuck&&navLine(e.p.x,e.p.z,gx,gz,e.p.y,16)){e.nt=0.3+Math.random()*0.2;e.blk=0;return null}
    if(NAV.budget<=0){e.nt=0.1;return null}NAV.budget--;const N=navPath(e.p.x,e.p.z,gx,gz,e.p.y,e.p.y>450?1600:700);e.nt=0.8+Math.random()*0.5;e.stuck=false;
    if(!N||N.length<2){e.blk=1;return[0,0]}e.blk=0;e.path={p:N,i:1,gx,gz}}
  const w=e.path.p[e.path.i],wx=w[0]-e.p.x,wz=w[1]-e.p.z,l=Math.hypot(wx,wz)||1;return[wx/l,wz/l]}
// czy strzelec widzi cel (ściany, teren)
function losClear(e,tg){const x0=e.p.x,y0=e.p.y+1.3*eSc(e),z0=e.p.z,x1=tg.p.x,y1=tg.p.y+1.1,z1=tg.p.z,L=Math.hypot(x1-x0,y1-y0,z1-z0),n=Math.ceil(L/0.9);for(let k=1;k<n;k++){const t=k/n,x=x0+(x1-x0)*t,y=y0+(y1-y0)*t,z=z0+(z1-z0)*t,h=colAt(x,z,y);if(h!==null&&h>y+0.2)return false;if(y<450&&solidAt(x,y,z))return false}return true}
// ===== TAKTYKA GRUPOWA: okrążanie celu (miejsca wokół celu), drugi szereg czeka, ataki na zmianę =====
const TAC={t:0,clk:0,atk:new Map()};
function tacticsTick(dt,pl){TAC.t-=dt;if(TAC.t>0)return;TAC.t=0.4;const G=new Map();
  for(const e of enemies.values()){if(e.st===2||!e.tgId||e.car)continue;const d=EDEF[e.t];if(d.passive||d.swim||d.fly||d.boss||d.ranged||eSc(e)>=2.6){e.slot=null;continue}let L=G.get(e.tgId);if(!L){L=[];G.set(e.tgId,L)}L.push(e)}
  const comps=compTargets();
  for(const [id,L] of G){const tg=pl.find(p=>p.id===id)||comps.find(c=>c.id===id);if(!tg||L.length<2){for(const e of L)e.slot=null;continue}
    for(const e of L)e._td=Math.hypot(e.p.x-tg.p.x,e.p.z-tg.p.z);L.sort((a,b)=>a._td-b._td);const near=L.filter(e=>e._td<14),inner=near.slice(0,6),outer=near.slice(6);for(const e of L)if(e._td>=14)e.slot=null;
    const ring=(M,rad,out)=>{const n=M.length;if(!n)return;for(const e of M)e._a=Math.atan2(e.p.x-tg.p.x,e.p.z-tg.p.z);M.sort((a,b)=>a._a-b._a);let sx=0,sy=0;M.forEach((e,i)=>{const o=e._a-i*6.2832/n;sx+=Math.cos(o);sy+=Math.sin(o)});const a0=Math.atan2(sy,sx);M.forEach((e,i)=>{e.slot={id,a:a0+i*6.2832/n,r:rad(e),out}})};
    ring(inner,e=>Math.max(1.1,eReach(e)*0.82),0);ring(outer,e=>eReach(e)+2.8,1)}}
function sepOk(e,x,z){if(e.st===2||e.car)return false;const d=EDEF[e.t];if(d.fly)return true;const h=colAt(x,z,e.p.y);if(h===null)return false;if(d.swim)return h<WATER-1.6;return !wetAt(x,z,h)&&Math.abs(h-e.p.y)<=1.05}
function simEnemies(dt){
  const pl=playersList().filter(p=>!p.dead);
  NAV.budget=3;NAV.t-=dt;if(NAV.t<=0||NAV.c.size>90000){NAV.t=4;NAV.c.clear();NAV.cs.clear()}
  TAC.clk+=dt;try{tacticsTick(dt,pl)}catch(err){console.warn('taktyka',err)}
  for(const e of enemies.values()){
    const d=EDEF[e.t]; e.flash-=dt*4; e.cd-=dt;if(e.dot&&e.st!==2)dotTick(e,dt);
    if(e.st===2){e.dieT-=dt;if(e.dieT<=0)removeEnemy(e.id);continue}
    let tg=null,td=1e9;const ag=e.prov>0?28:d.aggro*(e.elite?1.3:1),night=hour<5.5||hour>20.5;let seeS=false;
    if(e.aggro&&e.aggro.t>0){e.aggro.t-=dt;const p=pl.find(q=>q.id===e.aggro.id);let ok=p&&!p.sl&&!p.stl;if(ok&&d.swim){const ph=colAt(p.p.x,p.p.z);ok=p.p.y<WATER+1.8&&ph!==null&&ph<WATER-0.4}if(ok){tg=p;td=Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)}else e.aggro=null}
    if(!tg)for(const p of pl){if(p.stl)continue;if(d.swim){const ph=colAt(p.p.x,p.p.z);if(!(p.p.y<WATER+1.8&&ph!==null&&ph<WATER-0.4))continue}if(e.home&&Math.hypot(p.p.x-e.home[0],p.p.z-e.home[1])>(d.boss?28:34))continue;const dd=Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z);if(Math.abs(p.p.y-e.p.y)>=8)continue;
      if(p.snk&&!d.boss){const fx=Math.sin(e.ry),fz=Math.cos(e.ry),cs=dd>0.01?((p.p.x-e.p.x)*fx+(p.p.z-e.p.z)*fz)/dd:1,eff=ag*0.45*(cs<-0.2?0.55:1)*(night?0.75:1);
        if(dd<eff){seeS=true;e.det=Math.min(1.2,(e.det||0)+dt*(0.5+2.2*(1-dd/eff)));if(e.det<1)continue}else continue}
      if(dd<ag&&dd<td){tg=p;td=dd}}
    if(!seeS&&e.det)e.det=Math.max(0,e.det-dt*0.35);
    if(!d.passive&&!d.swim&&isAuth()&&!(e.aggro&&e.aggro.t>0)){let forced=null;for(const c of compTargets()){const dd=Math.hypot(c.p.x-e.p.x,c.p.z-e.p.z);if(Math.abs(c.p.y-e.p.y)>=8)continue;if(e.aggroC&&e.aggroC.t>0&&e.aggroC.id===c.id&&dd<40){forced=[c,dd];break}if(e.home&&Math.hypot(c.p.x-e.home[0],c.p.z-e.home[1])>34)continue;
        if(dd<ag&&(!tg||dd*0.8<td||(e.tgId===c.id&&dd<td*1.3))){tg=c;td=dd}}if(forced){tg=forced[0];td=forced[1]}if(e.aggroC)e.aggroC.t-=dt}
    e.tgId=tg?tg.id:null;
    if(!tg&&e.alert&&e.alert.t>0&&!d.passive){e.alert.t-=dt}
    e.prov-=dt;
    if(tg&&!d.passive){if(!e.seen){e.seen=1;for(const o of enemies.values())if(o!==e&&o.st!==2&&!EDEF[o.t].passive&&!o.car&&Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z)<AIP.alertR)o.prov=Math.max(o.prov,6)}
      if(!d.boss&&!e.fled&&e.hp/e.max<AIP.fleeHP){e.fled=1;if(Math.random()<(HUM[e.t]?AIP.fleeH:AIP.fleeA)){e.flee=rnd(2.5,4);e.fleeTo=null;let bd=0;for(const o of enemies.values()){if(o===e||o.st===2||EDEF[o.t].passive||o.car||EDEF[o.t].swim)continue;const de=Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z);if(de>30||de<3)continue;const dt2=Math.hypot(o.p.x-tg.p.x,o.p.z-tg.p.z);if(dt2>bd&&dt2>td){bd=dt2;e.fleeTo=o}}if(e.fleeTo){const o=e.fleeTo;for(const q of enemies.values())if(q.st!==2&&!EDEF[q.t].passive&&Math.hypot(q.p.x-o.p.x,q.p.z-o.p.z)<10){q.prov=Math.max(q.prov||0,10);if(!q.tgId)q.alert={x:tg.p.x,z:tg.p.z,t:9}}}}}}else if(!tg)e.seen=0;
    let mx=0,mz=0,sp=d.spd*(e.elite?1.1:1)*(e.slow>0?0.45:1);e.slow=(e.slow||0)-dt;
    if(e.stun>0){e.stun-=dt;e.vx*=Math.max(0,1-6*dt);e.vz*=Math.max(0,1-6*dt);const h=colAt(e.p.x+e.vx*dt,e.p.z+e.vz*dt,e.p.y);if(h!==null&&Math.abs(h-e.p.y)<1.1){e.p.x+=e.vx*dt;e.p.z+=e.vz*dt;e.p.y+=(h-e.p.y)*Math.min(1,14*dt)}e.speed=0;continue}
    if(e.enraged)sp*=1.3;
    const B=d.boss&&e.wind<=0?bossAI(e,d,tg,td,dt):null;
    const PA=e.car?caravanMove(e,dt):d.passive?passiveAI(e,dt):null;
    if(PA){mx=PA[0];mz=PA[1];sp*=PA[2]}
    else if(B){mx=B[0];mz=B[1];sp=B[2]}
    else if(e.wind>0){e.wind-=dt;e.st=1;
      if(e.wind<=0){e.st=0;
        if(e.rw){e.rw=0;e.cd=d.ranged.cd;if(tg&&tg.comp){compHurt(tg,eDmg(e),e);sfx('bow',0.4)}else if(tg)enemyShoot(e,tg,d.ranged.proj,eDmg(e))}
        else{e.cd=d.cd;if(tg&&td<eReach(e)+0.6&&Math.abs(tg.p.y-e.p.y)<2.6+eSc(e)*(d.swim?1.2:0.8)){if(tg.comp)compHurt(tg,eDmg(e),e);else hurtPlayer(tg.id,eDmg(e),e)}}}
    } else if(e.flee>0&&tg){e.flee-=dt;let dx=e.p.x-tg.p.x,dz=e.p.z-tg.p.z,l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const fo=e.fleeTo;if(fo&&fo.st!==2){const ax=fo.p.x-e.p.x,az=fo.p.z-e.p.z,al=Math.hypot(ax,az);if(al>2.5){const S2=navSteer(e,fo.p.x,fo.p.z,dt);if(S2){dx=dx*0.3+S2[0];dz=dz*0.3+S2[1]}else{dx=dx*0.5+ax/al;dz=dz*0.5+az/al}}else e.flee=Math.min(e.flee,0.3)}l=Math.hypot(dx,dz)||1;mx=dx/l;mz=dz/l;sp*=1.15;e.ry=Math.atan2(mx,mz);if(e.flee<=0){e.prov=10;e.hp=Math.min(e.max,e.hp+e.max*0.1)}
    } else if(tg){
      const dx=tg.p.x-e.p.x,dz=tg.p.z-e.p.z;e.ry=Math.atan2(dx,dz);const px=-dz/td,pz=dx/td,side=e.id%2?1:-1;
      // unik przed ciosem gracza (elity i humanoidy)
      e.dgc=(e.dgc||0)-dt;if(tg.id===NET.id&&P2.atkT>0.18&&td<2.8&&e.dgc<=0&&(e.elite||HUM[e.t])&&e.cd>0.2){e.dgc=2.2;if(Math.random()<AIP.dodgeP){e.vx-=dx/td*7;e.vz-=dz/td*7}}
      if(d.ranged){e.losT=(e.losT||0)-dt;if(e.losT<=0){e.losT=0.35+Math.random()*0.2;e.los=td<d.ranged.rng+4?losClear(e,tg):true}}
      if(d.ranged&&td<d.ranged.rng&&td>3.2&&e.los===false){const S2=navSteer(e,tg.p.x,tg.p.z,dt);if(S2){mx=S2[0];mz=S2[1]}else{mx=dx/td;mz=dz/td}if(mx||mz)e.ry=Math.atan2(mx,mz)}
      else if(d.ranged&&td<d.ranged.rng&&td>3.2){if(td<AIP.kiteR){mx=-dx/td+px*side*0.5;mz=-dz/td+pz*side*0.5;sp*=0.6}else{e.strT=(e.strT||0)-dt;if(e.strT<=0){e.strT=rnd(0.9,2.2);e.strS=Math.random()<0.5?1:-1}mx=px*e.strS;mz=pz*e.strS;sp*=AIP.strafeK}if(e.cd<=0){e.wind=0.6;e.st=1;e.rw=1}}
      else{const SL=e.slot&&e.slot.id===tg.id?e.slot:null,rch=eReach(e);let gx=tg.p.x,gz=tg.p.z;if(SL&&td<11){gx=tg.p.x+Math.sin(SL.a)*SL.r;gz=tg.p.z+Math.cos(SL.a)*SL.r}
       if(td>rch||(SL&&SL.out&&td>rch*0.9)){const S2=navSteer(e,gx,gz,dt);
        if(S2){mx=S2[0];mz=S2[1];if(mx||mz)e.ry=Math.atan2(mx,mz)}
        else if(SL&&td<11){const sx=gx-e.p.x,sz=gz-e.p.z,sl=Math.hypot(sx,sz);if(sl>0.5){mx=sx/sl;mz=sz/sl;if(SL.out)sp*=0.55}}
        else{let c=0;for(const o of enemies.values())if(o!==e&&o.st!==2&&!EDEF[o.t].passive&&Math.hypot(o.p.x-tg.p.x,o.p.z-tg.p.z)<5)c++;const fl=td<AIP.flankR&&c>0?Math.min(AIP.flankMax,AIP.flankK*c):0;mx=dx/td+px*side*fl;mz=dz/td+pz*side*fl;const l=Math.hypot(mx,mz)||1;mx/=l;mz/=l}}
       else if(e.cd<=0){const la=TAC.atk.get(tg.id)??-9,nw=TAC.clk;if(nw-la>=0.3||!SL){TAC.atk.set(tg.id,nw);e.wind=0.45;e.st=1;if(td<12&&Math.random()<0.5)sfx('growl',0.5)}}
       else if(e.cd>0.35){if(SL){const sx=gx-e.p.x,sz=gz-e.p.z,sl=Math.hypot(sx,sz);if(sl>0.6){mx=sx/sl;mz=sz/sl;sp*=0.45}}else{mx=px*side*AIP.circleK-dx/td*AIP.backK;mz=pz*side*AIP.circleK-dz/td*AIP.backK;sp*=0.32}}}
    } else if(e.alert&&e.alert.t>0&&!d.passive){const dx=e.alert.x-e.p.x,dz=e.alert.z-e.p.z,l=Math.hypot(dx,dz);if(l>1.5){const S2=navSteer(e,e.alert.x,e.alert.z,dt);if(S2){mx=S2[0];mz=S2[1]}else{mx=dx/l;mz=dz/l}sp*=0.55;if(mx||mz)e.ry=Math.atan2(mx,mz)}
    } else if(e.home&&Math.hypot(e.home[0]-e.p.x,e.home[1]-e.p.z)>9){const dx=e.home[0]-e.p.x,dz=e.home[1]-e.p.z,l=Math.hypot(dx,dz);const S2=navSteer(e,e.home[0],e.home[1],dt);if(S2){mx=S2[0];mz=S2[1]}else{mx=dx/l;mz=dz/l}sp*=0.7;if(mx||mz)e.ry=Math.atan2(mx,mz);if(e.hp<e.max)e.hp=Math.min(e.max,e.hp+e.max*0.1*dt)
    } else {
      const BM=e.band?bandMove(e,dt):null;if(BM){mx=BM[0];mz=BM[1];sp*=BM[2]}else{
      const W2=wanderStep(e,dt,d.boss?6:12);if(W2){mx=W2[0];mz=W2[1];sp*=W2[2];e.ry=Math.atan2(mx,mz)}}
    }
    // odrzut + ruch po terenie
    e.vx+=(mx*sp-e.vx)*Math.min(1,8*dt);e.vz+=(mz*sp-e.vz)*Math.min(1,8*dt);
    const nx=e.p.x+e.vx*dt,nz=e.p.z+e.vz*dt,h=colAt(nx,nz,e.p.y);
    if(d.swim){if(h!==null&&h<WATER-1.6){e.p.x=nx;e.p.z=nz}else{e.vx*=-0.4;e.vz*=-0.4;if(e.wan)e.wan.t=0}
      // stwory morskie krążą w głębinie; wynurzają się dopiero, gdy ruszają do ataku
      const eng=(tg&&td<eReach(e)+5)||(e.wind>0)||(e.hurtT>0)||e.st===2;if(e.hurtT>0)e.hurtT-=dt;const gr=colAt(e.p.x,e.p.z,WATER),sc=eSc(e),deep=Math.max((gr??WATER-8)+0.6+sc*0.5,WATER-1.15-Math.min(7,2.5+sc*1.6));
      const ty=eng?WATER-1.15+Math.sin(performance.now()*0.002+e.id)*0.08:deep;e.p.y+=(ty-e.p.y)*Math.min(1,dt*(eng?3.2:1.2))}
    else if(h!==null&&!wetAt(nx,nz,h)&&h-e.p.y<=1.05&&e.p.y-h<4&&!(VOX.size&&!d.fly&&eSc(e)<2.6&&voxProbe(nx,nz,e.p.y,0.3*Math.min(1.6,eSc(e)),1.5*eSc(e)).block)){e.p.x=nx;e.p.z=nz;e.p.y+=(h-e.p.y)*Math.min(1,14*dt)}else{e.vx*=-0.3;e.vz*=-0.3;if(e.wan)e.wan.t=0}
    if(!d.fly&&!e.car&&!d.swim&&!e.sid){try{villageCollide(e.p)}catch(_){}}
    if(!d.fly&&!e.car&&!d.swim){const c0=colAt(e.p.x,e.p.z,e.p.y),s0=e.sid?structGround(e.p.x,e.p.z,e.p.y):null,g0=Math.max(c0??-1e9,s0??-1e9);if(g0>-1e8&&g0>=WATER-0.6&&e.p.y>g0+0.04)e.p.y=Math.max(g0,e.p.y-16*dt)}
    e.speed=Math.hypot(e.vx,e.vz);
  }
  // rozpychanie
  const arr=[...enemies.values()];for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++){const a=arr[i],b=arr[j],dx=a.p.x-b.p.x,dz=a.p.z-b.p.z,dd=Math.hypot(dx,dz),mn=Math.max(1.1,(EDEF[a.t].huge||EDEF[a.t].giant?eSc(a)*0.45:0.55)+(EDEF[b.t].huge||EDEF[b.t].giant?eSc(b)*0.45:0.55));if(dd<mn&&dd>1e-3&&Math.abs(a.p.y-b.p.y)<3){const k=(mn-dd)/2/dd;if(sepOk(a,a.p.x+dx*k,a.p.z+dz*k)){a.p.x+=dx*k;a.p.z+=dz*k}if(sepOk(b,b.p.x-dx*k,b.p.z-dz*k)){b.p.x-=dx*k;b.p.z-=dz*k}}}
}
function renderEnemies(dt){
  const rt=performance.now()-120;
  for(const e of enemies.values()){
    {const dv=e.dot||e.dotVis;if(dv&&e.st!==2&&ENCH[dv.k]){if(e.dotVis){e.dotVis.t-=dt;if(e.dotVis.t<=0)e.dotVis=null}if(Math.random()<dt*14)PFX.emit(e.p.x+(Math.random()-0.5)*eSc(e),e.p.y+(0.4+Math.random()*1.2)*eSc(e),e.p.z+(Math.random()-0.5)*eSc(e),1,ENCH[dv.k].fx,{sp:0.5,up:1.6,life:0.6,size:0.11,g:-1.5})}}
    if(!isAuth()&&e.buf){const b=e.buf;let a=b[0],c=b[b.length-1];for(let i=0;i<b.length-1;i++)if(b[i].t<=rt&&b[i+1].t>=rt){a=b[i];c=b[i+1];break}
      const k=c.t>a.t?Math.min(1,Math.max(0,(rt-a.t)/(c.t-a.t))):1;const ox=e.p.x,oz=e.p.z;
      e.p.set(a.p[0]+(c.p[0]-a.p[0])*k,a.p[1]+(c.p[1]-a.p[1])*k,a.p[2]+(c.p[2]-a.p[2])*k);e.ry=c.ry;e.st=c.st;e.hp=c.hp;e.max=c.max;
      e.speed=Math.hypot(e.p.x-ox,e.p.z-oz)/Math.max(dt,1e-3);e.flash-=dt*4}
    if(e.st===2&&!e.dfx){e.dfx=1;PFX.emit(e.p.x,e.p.y+0.8*eSc(e),e.p.z,20,['#c8c0b0','#a89a88','#e8e0d0'],{sp:2.5,up:1.5,life:0.8,size:0.14,g:-0.6,drag:2,r:0.8});PFX.emit(e.p.x,e.p.y+1,e.p.z,10,BLOODC(e.t),{sp:4,life:0.6})}
    e.m.position.copy(e.p);if(EDEF[e.t].swim){const dv=e.p.y<WATER-2.6&&e.st!==2;e.m.visible=!dv||(player.swim&&player.p.y<WATER-1.2&&Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z)<12);if(e.lbl)e.lbl.visible=e.m.visible}let dr=e.ry-e.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));e.m.rotation.y+=dr*Math.min(1,10*dt);
    animEnemy(e.m,Math.min(e.speed,8),dt,e.st,e.flash,isAuth()?(e.stun>0?2:e.slow>0?1:0):(e.sl||0));
  }
}
// trafienie wroga (host stosuje; klient wysyła prośbę)
function applyHit(eid,dmg,kx,kz,fromId,slow,stun,src){
  const e=enemies.get(eid);if(!e||e.st===2||e.car)return;if(slow)e.slow=slow;if(stun){e.stun=EDEF[e.t].boss?stun*0.5:stun;e.wind=0;e.rw=0;e.st=0}
  e.hp-=dmg;e.flash=1;e.hurtT=6;
  if(src){e.aggroC={id:(fromId!=null&&fromId!==NET.id?'r:'+fromId+':':'c:')+src,t:15};e.prov=8}else if(fromId!=null){const p=playersList().find(q=>q.id===fromId);if(p&&p.snk&&!(e.det>=1)&&!(e.snkT&&nowS()-e.snkT<20)&&e.tgId!==fromId){e.snkT=nowS();e.det=Math.max(0.5,(e.det||0)+0.5);e.alert={x:p.p.x+rnd(-4,4),z:p.p.z+rnd(-4,4),t:7}}else{e.aggro={id:fromId,t:25};e.prov=8;e.det=1.2}}else e.prov=8;e.vx+=kx*6;e.vz+=kz*6;
  if(e.hp<=0){e.hp=0;e.st=2;e.dieT=1.1;dropLoot(e);if(e.sid){let alive=false;for(const o of enemies.values())if(o!==e&&o.sid===e.sid&&o.st!==2)alive=true;if(!alive)strState.set(e.sid,{cleared:Date.now()})}}
}
function dropLoot(e){
  for(const p of playersList()){if(Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)>45)continue;
    const rr=e.rar||0;if(EDEF[e.t].passive){const L={p:[e.p.x,EDEF[e.t].swim?WATER+0.05:e.p.y,e.p.z],items:rr>=2&&Math.random()<0.25*rr?[genItem(e.lvl,rr*10,undefined,p.cls)]:[],gold:rr?Math.round(e.lvl*rr*2):0,pot:0,xp:Math.round(3*ERAR[rr].xp),et:e.t,food:Math.random()<0.5+rr*0.15?(e.t==='kura'?'kurczak':'mieso'):0};if(p.id===NET.id)spawnDrop(L);else NET.tr&&NET.tr.send({t:'drop',from:NET.id,to:p.id,L});continue}
    const boss=!!EDEF[e.t].boss,tb=1+0.08*(p.tb||0),items=[];
    if(boss){for(let i=0;i<(EDEF[e.t].huge?3:2);i++)items.push(genItem(e.lvl,EDEF[e.t].huge?40:30,undefined,p.cls))}
    else{if(Math.random()<(e.elite?0.4:0.065)*tb*(1+rr*0.45))items.push(genItem(e.lvl,(e.elite?25:0)+rr*12,undefined,p.cls));if((e.elite||rr>=3)&&Math.random()<0.1*tb*(1+rr*0.3))items.push(genItem(e.lvl,10+rr*8,undefined,p.cls))}
    const L={p:[e.p.x,EDEF[e.t].swim?WATER+0.05:e.p.y,e.p.z],items,gold:Math.random()<(boss||e.elite?1:0.45)?Math.round(e.lvl*rnd(0.6,1.6)*(e.elite?3:1)*(boss?8:1)*tb*(1+rr*0.6)):0,pot:boss?2:Math.random()<(e.elite?0.6:0.14)?1:0,xp:Math.round(xpFor(e,p.lv)*(boss?4:1)*ERAR[rr].xp),et:e.t,qid:e.qid||0,boss:boss?EDEF[e.t].n:0,food:FOODOF[e.t]&&Math.random()<0.1?FOODOF[e.t]:0};
    if(p.id===NET.id)spawnDrop(L);else NET.tr&&NET.tr.send({t:'drop',from:NET.id,to:p.id,L});}
}
function hurtPlayer(pid,dmg,e){if(pid===NET.id)takeDamage(dmg,e.p);else NET.tr&&NET.tr.send({t:'dmg',from:NET.id,to:pid,dmg,src:[e.p.x,e.p.z]})}

// ---------- obrażenia gracza ----------
function takeDamage(raw,src){let blk=false;if(P3.block&&INV.eq.tarcza&&raw>0&&P2.sta>0){let ok=true;if(src){const sx=src.x??src[0],sz=src.z??src[1];if(sx!=null){const dx=sx-player.p.x,dz=sz-player.p.z,l=Math.hypot(dx,dz)||1;ok=(dx*Math.sin(player.ry)+dz*Math.cos(player.ry))/l>-0.25}}if(ok){raw*=Math.max(0.12,0.32-(INV.eq.tarcza.rar||0)*0.04);P2.sta=Math.max(0,P2.sta-10);P2.staT=1;fxNum(player.p.x,player.p.y+2.2,player.p.z,'Zablokowano','#cfe8ff');sfx('clang',0.7);blk=true}}if(!blk&&INV.eq.tarcza&&raw>0&&Math.random()*100<(INV.eq.tarcza.block||12)*0.5){raw*=0.35;fxNum(player.p.x,player.p.y+2.2,player.p.z,'Blok!','#cfe8ff');sfx('clang',0.6)}
  if(custOn||(SPC&&SPC.func==='garderoba'))return;
  if(P2.dead||P2.roll>0||P2.iframe>0)return;
  if(Math.random()<0.02*pk('unik')){fxNum(player.p.x,player.p.y+2,player.p.z,'unik','#cfe8ff');return}
  const dmg=raw*(1-ST.def/(ST.def+60))*(1-0.03*pk('tarcza'));sfx('hurt');PFX.emit(player.p.x,player.p.y+1.2,player.p.z,9,['#b8202a','#8a1018','#d8303a'],{sp:3,life:0.5});skGain('wytrz',0.5+dmg/20);
  if(src){const sx=src.x??src[0],sz=src.z??src[1];let be=null,bd=4;for(const e of enemies.values()){if(e.st===2)continue;const d=Math.hypot(e.p.x-sx,e.p.z-sz);if(d<bd){bd=d;be=e}}if(be){be.mark=nowS();be.hurtP=nowS()}}P2.hp-=dmg;P2.lastHurt=nowS();P2.iframe=0.2;
  fxNum(player.p.x,player.p.y+2,player.p.z,'-'+Math.round(dmg),'#ff6b5b');$('hurt').style.opacity=0.55;
  if(src){const dx=player.p.x-(src.x??src[0]),dz=player.p.z-(src.z??src[1]),l=Math.hypot(dx,dz)||1;player.v.x+=dx/l*5;player.v.z+=dz/l*5;player.v.y=Math.max(player.v.y,4)}
  if(P2.hp<=0){P2.hp=0;const co=NET.role!=='off'&&[...remotes.values()].some(r=>{const b=r.buf[r.buf.length-1];return b&&b.a!==5});P2.dead=co?30:5;P2.down=co;sfx('death');if(VH.mode===1)exitBoat();if(VH.mode===2)stopGlide();if(VH.mode===3)VH.mode=0;if(VH.mode===5||VH.mode===6)dismountOwn(1);$('dead').hidden=false;$('deadhint').textContent=co?'Kompan może cię podnieść: niech podejdzie i przytrzyma F.':'';$('deadnow').hidden=!co;toast(co?'Jesteś powalony! Czekaj na pomoc kompana.':'Poległeś. Powrót za 5 s','#ff8a7a')}
}
function respawn(){P2.dead=0;P2.down=0;P2.hp=ST.hp;$('dead').hidden=true;const sp=spawnPt();
  let tgt=LS.get('home_'+S.seed,null);if(tgt){tgt=tgt.slice();tgt[0]-=1;tgt[2]-=1;tgt[1]-=1}if(!tgt&&NET.role!=='off')for(const r of remotes.values()){const b=r.buf[r.buf.length-1];if(b&&b.a!==5){tgt=b.p;break}}
  const p=tgt||[sp[0],sp[1]+1,sp[2]];player.p.set(p[0]+1,p[1]+1,p[2]+1);player.v.set(0,0,0);camY=null;holdIfUnloaded()}

// ---------- atak gracza ----------
function attack(){
  if(P3.block)return;if(P2.dead||P2.atkCd>0||P2.roll>0||P3.charge>0||!player.ready||invOpen()||uiOpen()||VH.mode===1||VH.mode===2||VH.mode===6)return;
  if(VH.mode===3)VH.mode=0;if(VH.mode===5||VH.mode===6)dismountOwn(1);
  const fy=facing();player.ry=fy;meRef.rotation.y=fy;
  const kind=weaponKind(INV.eq.bron?INV.eq.bron.base:''),spd=ST.spd*(1+ST.haste/100);
  if(kind==='bow'){P2.bowD=Math.max(0.34,0.62/spd);P2.bowT=P2.bowD;P2.bowShot=false;P2.atkCd=P2.bowD+0.05;P2.atkT=P2.bowD;return}
  if(kind==='staff'){P2.castD=Math.max(0.3,0.5/spd);P2.castT=P2.castD;P2.castShot=false;P2.atkCd=P2.castD+0.08;P2.atkT=P2.castD;return}
  sfx('swing');P2.combo=(P2.combo+1)%3;P2.atkD=Math.max(0.22,0.36/Math.max(0.7,spd));P2.atkT=P2.atkD;P2.atkCd=Math.max(P2.atkD*0.92,0.55/spd);P2.hitDone=false;P2.slashDone=false;
}
// ===== HITBOXY: obrys modelu wroga (prostopadłościan w układzie wroga), liczony raz na typ =====
const HBC=new Map();
function hbLocal(m){const B=[1e9,1e9,1e9,-1e9,-1e9,-1e9];
  const rot=(r,v)=>{const cx=Math.cos(r.x||0),sx=Math.sin(r.x||0),cy=Math.cos(r.y||0),sy=Math.sin(r.y||0),cz=Math.cos(r.z||0),sz=Math.sin(r.z||0);let [x,y,z]=v;const x1=x*cz-y*sz,y1=x*sz+y*cz,z1=z;
    if(r.order==='YXZ'){const y2=y1*cx-z1*sx,z2=y1*sx+z1*cx;return[x1*cy+z2*sy,y2,-x1*sy+z2*cy]}const x2=x1*cy+z1*sy,z2=-x1*sy+z1*cy;return[x2,y1*cx-z2*sx,y1*sx+z2*cx]};
  const walk=(o,ch)=>{if(o.isSprite===true||o.visible===false)return;ch=ch.concat([o]);const g=o.geometry;
    if(o.isMesh===true&&g&&g.attributes&&g.attributes.position&&o.isInstancedMesh!==true){const P=g.attributes.position.array,st=3*Math.max(1,Math.floor(P.length/3/2500));
      for(let i=0;i+2<P.length;i+=st){let v=[P[i],P[i+1],P[i+2]];for(let k=ch.length-1;k>=0;k--){const t=ch[k];v=[v[0]*t.scale.x,v[1]*t.scale.y,v[2]*t.scale.z];v=rot(t.rotation,v);v=[v[0]+t.position.x,v[1]+t.position.y,v[2]+t.position.z]}
        if(v[0]<B[0])B[0]=v[0];if(v[1]<B[1])B[1]=v[1];if(v[2]<B[2])B[2]=v[2];if(v[0]>B[3])B[3]=v[0];if(v[1]>B[4])B[4]=v[1];if(v[2]>B[5])B[5]=v[2]}}
    for(const c of (o.children||[]))walk(c,ch)};
  for(const c of (m.children||[]))walk(c,[]);return B[3]>B[0]?B:null}
function eBox(e){if(!e.m)return null;const k=e.t+(e.elite?'e':'');let B=HBC.get(k);if(B===undefined){try{B=hbLocal(e.m)}catch(_){B=null}const SD=SEA[e.t];if(B&&SD&&SD.amp){const w=(B[5]-B[2])*SD.amp*0.35;B[0]-=w;B[3]+=w}if(B&&SD&&SD.vert){const v=(B[5]-B[2])*SD.vert*0.3;B[1]-=v;B[4]+=v}HBC.set(k,B)}if(!B)return null;const s=e.m.scale.x||1;return[B[0]*s,B[1]*s,B[2]*s,B[3]*s,B[4]*s,B[5]*s]}
// siatka zajętości ciała (tylko tam, gdzie jest model), w układzie wroga bez skali
const HBG=new Map();
function hbGrid(e){if(!e.m)return null;const key=e.t+(e.elite?'e':'');if(HBG.has(key))return HBG.get(key);let G=null;
  try{const tris=[];const rot=(r,v)=>{const cx=Math.cos(r.x||0),sx=Math.sin(r.x||0),cy=Math.cos(r.y||0),sy=Math.sin(r.y||0),cz=Math.cos(r.z||0),sz=Math.sin(r.z||0);let [x,y,z]=v;const x1=x*cz-y*sz,y1=x*sz+y*cz,z1=z;
      if(r.order==='YXZ'){const y2=y1*cx-z1*sx,z2=y1*sx+z1*cx;return[x1*cy+z2*sy,y2,-x1*sy+z2*cy]}const x2=x1*cy+z1*sy,z2=-x1*sy+z1*cy;return[x2,y1*cx-z2*sx,y1*sx+z2*cx]};
    const walk=(o,ch)=>{if(o.isSprite===true||o.visible===false)return;ch=ch.concat([o]);const g=o.geometry;
      if(o.isMesh===true&&g&&g.attributes&&g.attributes.position&&o.isInstancedMesh!==true&&o.material!==GLOWMAT){const P=g.attributes.position.array,I=g.index?(g.index.array||null):null,nv=P.length/3,T=new Float32Array(P.length);
        for(let i=0;i<nv;i++){let v=[P[i*3],P[i*3+1],P[i*3+2]];for(let k=ch.length-1;k>=0;k--){const t=ch[k];v=[v[0]*t.scale.x,v[1]*t.scale.y,v[2]*t.scale.z];v=rot(t.rotation,v);v=[v[0]+t.position.x,v[1]+t.position.y,v[2]+t.position.z]}T[i*3]=v[0];T[i*3+1]=v[1];T[i*3+2]=v[2]}
        const n=I?I.length:nv;for(let q=0;q+2<n;q+=3)tris.push(T,I?I[q]:q,I?I[q+1]:q+1,I?I[q+2]:q+2)}
      for(const c of (o.children||[]))walk(c,ch)};
    for(const c of (e.m.children||[]))walk(c,[]);if(!tris.length)throw 0;
    let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(let q=0;q<tris.length;q+=4){const T=tris[q];for(let k=1;k<4;k++){const b=tris[q+k]*3;for(let a=0;a<3;a++){const v=T[b+a];if(v<mn[a])mn[a]=v;if(v>mx[a])mx[a]=v}}}
    const cs=Math.max(0.1,Math.max(mx[0]-mn[0],mx[1]-mn[1],mx[2]-mn[2])/30),pad=2,ox=mn[0]-pad*cs,oy=mn[1]-pad*cs,oz=mn[2]-pad*cs,nx=Math.ceil((mx[0]-mn[0])/cs)+pad*2+1,ny=Math.ceil((mx[1]-mn[1])/cs)+pad*2+1,nz=Math.ceil((mx[2]-mn[2])/cs)+pad*2+1,ID=(x,y,z)=>(y*nz+z)*nx+x,A=new Uint8Array(nx*ny*nz);
    for(let q=0;q<tris.length;q+=4){const T=tris[q];let a0=1e9,a1=-1e9,b0=1e9,b1=-1e9,c0=1e9,c1=-1e9;for(let k=1;k<4;k++){const b=tris[q+k]*3;a0=Math.min(a0,T[b]);a1=Math.max(a1,T[b]);b0=Math.min(b0,T[b+1]);b1=Math.max(b1,T[b+1]);c0=Math.min(c0,T[b+2]);c1=Math.max(c1,T[b+2])}
      const x0=Math.floor((a0-ox)/cs),x1=Math.floor((a1-ox)/cs),y0=Math.floor((b0-oy)/cs),y1=Math.floor((b1-oy)/cs),z0=Math.floor((c0-oz)/cs),z1=Math.floor((c1-oz)/cs);
      for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++)A[ID(x,y,z)]=1}
    // wypełnienie wnętrza brył: komórka w środku, jeśli jest ograniczona powierzchnią w osiach X, Y i Z
    const F=A.slice(),fx=new Int16Array(ny*nz*2).fill(-1),fz=new Int16Array(ny*nx*2).fill(-1),fy=new Int16Array(nz*nx*2).fill(-1);
    for(let y=0;y<ny;y++)for(let z=0;z<nz;z++)for(let x=0;x<nx;x++)if(A[ID(x,y,z)]){const r=(y*nz+z)*2;if(fx[r]<0)fx[r]=x;fx[r+1]=x;const c=(y*nx+x)*2;if(fz[c]<0)fz[c]=z;fz[c+1]=z;const w=(z*nx+x)*2;if(fy[w]<0)fy[w]=y;fy[w+1]=y}
    for(let y=0;y<ny;y++)for(let z=0;z<nz;z++)for(let x=0;x<nx;x++){const id=ID(x,y,z);if(A[id])continue;const r=(y*nz+z)*2,c=(y*nx+x)*2,w=(z*nx+x)*2;if(fx[r]>=0&&x>fx[r]&&x<fx[r+1]&&fz[c]>=0&&z>fz[c]&&z<fz[c+1]&&fy[w]>=0&&y>fy[w]&&y<fy[w+1])F[id]=1}
    // tolerancja na animację: poszerzenie o 1 komórkę (u stworów morskich bardziej w bok)
    const SD=SEA[e.t],dx=1+(SD&&SD.amp?Math.ceil((mx[2]-mn[2])*SD.amp*0.3/cs):0),dy=1+(SD&&SD.vert?Math.ceil((mx[2]-mn[2])*SD.vert*0.25/cs):0),D=new Uint8Array(F.length),pts=[];
    for(let y=0;y<ny;y++)for(let z=0;z<nz;z++)for(let x=0;x<nx;x++)if(F[ID(x,y,z)]){pts.push(ox+(x+0.5)*cs,oy+(y+0.5)*cs,oz+(z+0.5)*cs);for(let yy=Math.max(0,y-dy);yy<=Math.min(ny-1,y+dy);yy++)for(let zz=Math.max(0,z-1);zz<=Math.min(nz-1,z+1);zz++)for(let xx=Math.max(0,x-dx);xx<=Math.min(nx-1,x+dx);xx++)D[ID(xx,yy,zz)]=1}
    G={cs,ox,oy,oz,nx,ny,nz,D,pts:new Float32Array(pts),dx,dy}}catch(_){G=null}
  HBG.set(key,G);return G}
function eLoc(e,x,z){const t=e.m?e.m.rotation.y:(e.ry||0),c=Math.cos(t),sn=Math.sin(t),dx=x-e.p.x,dz=z-e.p.z;return[dx*c-dz*sn,dx*sn+dz*c,c,sn]}
// najbliższa komórka ciała wroga (w poziomie), z uwzględnieniem wysokości [y0,y1]
function eNearCell(e,x,z,y0,y1){const G=hbGrid(e);if(!G)return null;const s=e.m.scale.x||1,[lx,lz,c,sn]=eLoc(e,x,z),qx=lx/s,qz=lz/s,a=(y0==null?-1e9:(y0-e.p.y)/s-G.cs*G.dy),b=(y1==null?1e9:(y1-e.p.y)/s+G.cs*G.dy),P=G.pts;let bd=1e18,bx=0,bz=0;
  for(let i=0;i<P.length;i+=3){const py=P[i+1];if(py<a||py>b)continue;const ddx=Math.max(0,Math.abs(P[i]-qx)-G.cs*(G.dx-0.5)),ddz=Math.max(0,Math.abs(P[i+2]-qz)-G.cs*0.5),d=ddx*ddx+ddz*ddz;if(d<bd){bd=d;bx=P[i];bz=P[i+2]}}
  if(bd>1e17)return null;return{d:Math.sqrt(bd)*s,x:e.p.x+(bx*s)*c+(bz*s)*sn,z:e.p.z-(bx*s)*sn+(bz*s)*c}}
// odległość w poziomie od punktu do ciała wroga (0 = dotyka ciała); y0/y1 = zakres wysokości atakującego
function eDist(e,x,z,y0,y1){const B=eBox(e);if(!B)return Math.max(0,Math.hypot(x-e.p.x,z-e.p.z)-0.5-eBody(e));const [lx,lz]=eLoc(e,x,z),cx=Math.min(B[3],Math.max(B[0],lx)),cz=Math.min(B[5],Math.max(B[2],lz)),bd=Math.hypot(lx-cx,lz-cz);if(bd>8)return bd;const r=eNearCell(e,x,z,y0,y1);return r?r.d:(y0!=null?99:bd)}
function eNear(e,x,z,y0,y1){const r=eNearCell(e,x,z,y0,y1);if(r)return[r.x,r.z];const B=eBox(e);if(!B)return[e.p.x,e.p.z];const [lx,lz,c,sn]=eLoc(e,x,z),cx=Math.min(B[3],Math.max(B[0],lx)),cz=Math.min(B[5],Math.max(B[2],lz));return[e.p.x+cx*c+cz*sn,e.p.z-cx*sn+cz*c]}
function eYR(e){const B=eBox(e);return B?[e.p.y+B[1],e.p.y+B[4]]:[e.p.y-0.3,e.p.y+1.9*eSc(e)]}
// czy punkt (np. pocisk) trafia w ciało wroga (z zapasem m)
function eHitPt(e,x,y,z,m){const G=hbGrid(e);if(!G){const B=eBox(e);if(!B)return null;const [lx,lz]=eLoc(e,x,z),yy=y-e.p.y;return lx>B[0]-m&&lx<B[3]+m&&lz>B[2]-m&&lz<B[5]+m&&yy>B[1]-m&&yy<B[4]+m}
  const s=e.m.scale.x||1,[lx,lz]=eLoc(e,x,z),gx=Math.floor((lx/s-G.ox)/G.cs),gy=Math.floor(((y-e.p.y)/s-G.oy)/G.cs),gz=Math.floor((lz/s-G.oz)/G.cs),r=Math.max(0,Math.ceil(m/(s*G.cs))-1);
  for(let yy=gy-r;yy<=gy+r;yy++){if(yy<0||yy>=G.ny)continue;for(let zz=gz-r;zz<=gz+r;zz++){if(zz<0||zz>=G.nz)continue;for(let xx=gx-r;xx<=gx+r;xx++){if(xx<0||xx>=G.nx)continue;if(G.D[(yy*G.nz+zz)*G.nx+xx])return true}}}return false}
// odcinek lotu pocisku (poprzednia → obecna pozycja) przecina ciało wroga
function eHitSeg(e,x0,y0,z0,x1,y1,z1,m){const B=eBox(e);if(!B)return null;const R=Math.max(Math.abs(B[0]),Math.abs(B[3]),Math.abs(B[2]),Math.abs(B[5]))+m,L=Math.hypot(x1-x0,y1-y0,z1-z0);if(Math.hypot(x1-e.p.x,z1-e.p.z)>R+L+0.5)return false;if(y1<e.p.y+B[1]-m-L&&y0<e.p.y+B[1]-m-L)return false;
  const G=hbGrid(e),st=G?Math.max(0.06,Math.min(0.25,G.cs*(e.m.scale.x||1)*0.8)):0.25,n=Math.min(40,Math.max(1,Math.ceil(L/st)));for(let k=1;k<=n;k++){const t=k/n,r=eHitPt(e,x0+(x1-x0)*t,y0+(y1-y0)*t,z0+(z1-z0)*t,m);if(r===null)return null;if(r)return true}return false}
// czy pionowo się pokrywa z ciałem gracza (stopy y, wysokość h) z zapasem
function eYOk(e,y,h,m){const [a,b]=eYR(e);return y<b+m&&y+h>a-m}
// ===== ZAKLĘCIA BRONI (kowal) i wybuchy =====
const ENCH={ogien:{n:'Ognia',c:'#ff8a2e',fx:['#ff7a1a','#ffb030','#ffe080'],d:'podpala wroga: obrażenia od ognia przez 4 s'},
  wybuch:{n:'Wybuchu',c:'#ffb030',fx:['#ffb030','#ff6a1a','#fff2a0'],d:'strzały i bełty wybuchają przy trafieniu (obrażenia obszarowe)',bow:1},
  mroz:{n:'Mrozu',c:'#9fe8ff',fx:['#bfe8ff','#ffffff','#7fd0ff'],d:'spowalnia trafionego wroga'},
  trucizna:{n:'Trucizny',c:'#7ad15a',fx:['#7ad15a','#3a8a2a','#b8f080'],d:'zatruwa: obrażenia przez 6 s'},
  piorun:{n:'Burzy',c:'#c8d8ff',fx:['#c8d8ff','#ffffff','#8ab0ff'],d:'piorun przeskakuje na pobliskiego wroga'}};
const STUCK=[];
// ===== NISZCZENIE TERENU: kratery po wybuchach i zaklęciach (zapisywane w świecie, synchronizowane w co-op) =====
const DIG=new Map(),DIGC=new Map();
function digIdx(x,z,k){for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const cx=Math.floor((x+dx*4)/C),cz=Math.floor((z+dz*4)/C),ck=K(cx,cz);let a=DIGC.get(ck);if(!a){a=new Set();DIGC.set(ck,a)}a.add(k)}}
function digLoad(){DIG.clear();DIGC.clear();const D=(W&&W.dig)||{};for(const k in D){DIG.set(k,D[k]);const [x,z]=k.split(',').map(Number);digIdx(x,z,k)}}
function digBase(x,z,cur){const k=x+','+z;W.digB=W.digB||{};if(W.digB[k]==null)W.digB[k]=cur;return W.digB[k]}
function digFor(cx,cz){const a=DIGC.get(K(cx,cz));if(!a)return[];const out=[];for(const k of a){const [x,z]=k.split(',').map(Number);if(x>=cx*C-4&&x<cx*C+C+4&&z>=cz*C-4&&z<cz*C+C+4)out.push(x,z,DIG.get(k))}return out}
function digApply(cells,save){const touched=new Set();for(let i=0;i<cells.length;i+=3){const x=cells[i],z=cells[i+1],h=cells[i+2],k=x+','+z;const old=DIG.get(k);if(old!=null&&old<=h)continue;DIG.set(k,h);W.dig=W.dig||{};W.dig[k]=h;digIdx(x,z,k);
    const cx=Math.floor(x/C),cz=Math.floor(z/C),ch=chunks.get(K(cx,cz));if(ch&&ch.heights){const j=(z-cz*C)*C+(x-cx*C);if(ch.heights[j]>h)ch.heights[j]=h}
    for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++)touched.add(K(Math.floor((x+dx*4)/C),Math.floor((z+dz*4)/C)))}
  for(const ck of touched){const ch=chunks.get(ck);if(ch&&ch.mesh&&!ch.pend)ch.lod=-1}NAV.c.clear();if(save)saveW()}
function terrainBlast(x,y,z,r,send){if(SPC||P2.dead&&0)return;if(typeof inVillage==='function'&&inVillage(x,z,10+r))return;for(const s of structs.values())if(s&&Math.hypot(s.x-x,s.z-z)<(s.fl||14)+10+r)return;
  const cells=[];for(let cz=Math.floor(z-r);cz<=Math.floor(z+r);cz++)for(let cx=Math.floor(x-r);cx<=Math.floor(x+r);cx++){const d=Math.hypot(cx+0.5-x,cz+0.5-z);if(d>r)continue;const cur=colAt(cx+0.5,cz+0.5);if(cur==null||Math.abs(y-cur)>2.6||cur<WATER-1||wlAt(cx+0.5,cz+0.5)!==WATER)continue;
    const dep=Math.round((1-d/r)*r*0.7+0.45);if(dep<1)continue;const base0=digBase(cx,cz,cur),nh=Math.max(2,WATER-5,base0-5,cur-dep);if(nh<cur)cells.push(cx,cz,nh)}
  if(!cells.length)return;digApply(cells,true);PFX.emit(x,y+0.3,z,Math.round(12+r*8),['#6b5034','#8a7a64','#5a4a38','#3a3028'],{sp:4+r,up:6,life:1.1,size:0.16,g:14,r:r*0.6});if(send)sendFx({k:'dig',c:cells})}
function boomFx(x,y,z,r){r=r||3;const k=r/3;PFX.emit(x,y+0.4,z,Math.round(50*k)+10,['#ff7a1a','#ffb030','#ffe080','#ff4a1a'],{sp:7*k+2,up:2.5,life:0.7,size:0.18,g:-1,r:0.6*k});PFX.emit(x,y+0.6,z,Math.round(26*k)+6,['#3a3430','#5a5048','#2a2624','#6a6058'],{sp:2.6*k+1,up:3.5,life:1.7,size:0.3,g:-2.2,r:0.8*k});
  PFX.emit(x,y+0.3,z,Math.round(24*k)+6,['#ffd34d','#fff2a0','#ffffff'],{sp:10*k+3,up:6,life:0.9,size:0.05,g:9});PFX.emit(x,y+0.2,z,Math.round(18*k)+4,['#6b5034','#8a7a64','#5a5a5a','#4a3a28'],{sp:5*k+2,up:7,life:1.2,size:0.13,g:16});
  try{const d=Math.hypot(x-player.p.x,z-player.p.z);if(d<40){sfx('thud',Math.max(0.2,1-d/40));if(d<14)P2.shake=Math.max(P2.shake||0,0.35*(1-d/14))}}catch(_){}}
function encHit(e,dmg,en){if(!e||e.st===2)return;const E=ENCH[en];if(!E)return;PFX.emit(e.p.x,e.p.y+1.1*eSc(e),e.p.z,8,E.fx,{sp:2.5,up:1.5,life:0.5,size:0.09});
  if(en==='ogien'||en==='trucizna'){const dur=en==='ogien'?4:6,dps=dmg*(en==='ogien'?0.25:0.16);e.dotVis={k:en,t:dur};if(isAuth())dotApply(e.id,en,dps,dur,NET.id);else NET.tr&&NET.tr.send({t:'dot',from:NET.id,eid:e.id,k:en,dps,dur})}
  else if(en==='mroz'){if(isAuth())applyHit(e.id,0,0,0,NET.id,2.5,0);else NET.tr&&NET.tr.send({t:'hit',from:NET.id,eid:e.id,dmg:0,k:[0,0],slow:2.5,stun:0})}
  else if(en==='piorun'&&Math.random()<0.35){let b=null,bd=7;for(const o of enemies.values()){if(o===e||o.st===2||EDEF[o.t].passive)continue;const d=Math.hypot(o.p.x-e.p.x,o.p.z-e.p.z);if(d<bd){bd=d;b=o}}if(b){try{boltFx([[e.p.x,e.p.y+1.2,e.p.z],[b.p.x,b.p.y+1.2,b.p.z]]);sendFx({k:'bolt',pts:[[e.p.x,e.p.y+1.2,e.p.z],[b.p.x,b.p.y+1.2,b.p.z]]})}catch(_){}const[dm]=rollDmg(dmg*0.5);dealHit(b,dm,false,0,0)}}}
function dotApply(eid,k,dps,dur,from){const e=enemies.get(eid);if(!e||e.st===2)return;e.dot={k,dps:Math.min(dps,4000),t:Math.min(dur,8),tick:0.5,from}}
function dotTick(e,dt){const D=e.dot;if(!D)return;D.t-=dt;D.tick-=dt;if(D.tick<=0){D.tick=0.5;const dm=D.dps*0.5;try{fxNum(e.p.x,e.p.y+2*eSc(e),e.p.z,Math.round(dm),D.k==='ogien'?'#ffb030':'#9ae86a')}catch(_){}applyHit(e.id,dm,0,0,D.from,0,0,null)}if(D.t<=0)e.dot=null}
function dlgEnchant(){const n=dlg.n,pm=pmod(n),it=INV.eq.bron,opts=[];if(!it){dlgShow('Najpierw załóż broń, którą mam zaczarować.',[['Wróć.',()=>dlgSmith()]]);return}
  const bow=it.base==='luk'||it.base==='kusza',cost=Math.round((150+itemVal(it)*1.2)*pm);
  for(const k in ENCH){const E=ENCH[k];if(E.bow&&!bow)continue;opts.push([`${it.ench===k?'✓ ':''}Zaklęcie ${E.n}: ${E.d} — ${cost} zł`,()=>{if(it.ench===k)return toast('Ta broń ma już to zaklęcie','#cfe8ff');if(INV.gold<cost)return toast('Za mało złota','#ff8a7a');INV.gold-=cost;it.ench=k;sfx('lvl');afterInv();toast('Zaklęto: '+it.name+' ('+E.n+')',E.c);dlgEnchant()}])}
  opts.push(['Wróć.',()=>dlgSmith()]);dlgShow(`Zaklęcie dla: ${it.name}${it.ench?' (teraz: '+ENCH[it.ench].n+')':''}. Nowe zaklęcie zastępuje stare. Masz ${INV.gold} złota.`,opts)}
function enchGlow(dt){const it=INV.eq.bron;if(!it||!it.ench||!ENCH[it.ench]||VH.mode===3||custOn)return;if(Math.random()<dt*9){const ry=player.ry,c=Math.cos(ry),sn=Math.sin(ry),lx=-0.38,lz=0.35;PFX.emit(player.p.x+lx*c+lz*sn,player.p.y+0.95+Math.random()*0.5,player.p.z-lx*sn+lz*c,1,ENCH[it.ench].fx,{sp:0.3,up:0.6,life:0.45,size:0.06,g:-1})}}
function meleeHits(){
  const fy=player.ry,fx=Math.sin(fy),fz=Math.cos(fy);
  for(const e of enemies.values()){if(e.st===2)continue;
    if(!eYOk(e,player.p.y,1.9,0.9))continue;const de=eDist(e,player.p.x,player.p.z,player.p.y-0.6,player.p.y+2.6);if(de>ST.rng+0.45)continue;
    const np=eNear(e,player.p.x,player.p.z,player.p.y-0.6,player.p.y+2.6),dx=np[0]-player.p.x,dz=np[1]-player.p.z,dd=Math.hypot(dx,dz);
    if(dd>0.6&&(dx*fx+dz*fz)/dd<0.2)continue;
    const[dmg,crit]=rollDmg(ST.dmg*rnd(0.9,1.1)*(P2.combo===2?1.5:1));
    dealHit(e,dmg,crit,dd>0?dx/dd:fx,dd>0?dz/dd:fz);
    {const en=INV.eq.bron&&INV.eq.bron.ench;if(en&&en!=='wybuch')encHit(e,dmg,en)}
  }
}
let STARGEO=null;

// ===== HERB: własny herb gracza (tarcza, tunika i wapenrok na zbroi) =====
const HTIN=[['Złoto','#d9b23a'],['Srebro','#e8e6e0'],['Czerwień','#b8302a'],['Błękit','#2f5f9f'],['Zieleń','#3a7a3a'],['Czerń','#1e1e22'],['Purpura','#6a3a8a'],['Pomarańcz','#d86a1a'],['Lazur','#5a9ad8'],['Brąz','#7a4a2a']];
const HDIV=['Jednolite','W słup','W pas','W krzyż','W skos','Krokiew','Pas','Słup','Szachownica'];
const HCH=[['Brak',''],['Krzyż','0001000000100000010001111111000100000010000001000'],['Gwiazda','0001000001110011111110111110001110001101100100010'],['Korona','1010101101010111111111111111011111000000000000000'],['Wieża','1010101111111101111100101000111110011111001010100'],['Miecz','0001000000100000010000010000111110000100000010000'],['Księżyc','0011100011000001100000110000011000000110000001110'],['Drzewo','0111110111111111111110111110001000000100001111100'],['Orzeł','1001001110111011111110111110001110001010100100010'],['Lew','0110000111100001110001111110111111001101100100010'],['Róża','0010100011111011111110111110001110000010000011000'],['Kotwica','0001000001110000010001001001100100110111100011100'],['Topór','0110000111000011111001100100000010000001000000100'],['Smok','1100000111001001111100111110001111100010110000011']];
function herbOf(h){h=h||{};return{d:h.d|0,c1:h.c1??3,c2:h.c2??0,ch:h.ch??1,cc:h.cc??0,sh:h.sh??1,tu:h.tu??1}}
const herbStr=h=>{h=herbOf(h);return [h.d,h.c1,h.c2,h.ch,h.cc,h.sh,h.tu].join('.')};
const herbParse=s=>{if(!s)return null;const a=String(s).split('.').map(Number);return herbOf({d:a[0],c1:a[1],c2:a[2],ch:a[3],cc:a[4],sh:a[5],tu:a[6]})};
const HGW=9,HGH=11;
function herbGrid(h){h=herbOf(h);const A=HTIN[h.c1][1],B=HTIN[h.c2][1],C=HTIN[h.cc][1],g=[];
  for(let j=0;j<HGH;j++){const row=[];for(let i=0;i<HGW;i++){const u=(i+0.5)/HGW,v=(j+0.5)/HGH;let s=0;
    switch(h.d){case 1:s=u>0.5;break;case 2:s=v>0.5;break;case 3:s=(u>0.5)!==(v>0.5);break;case 4:s=u>v;break;case 5:s=v>0.35+Math.abs(u-0.5)*1.1&&v<0.62+Math.abs(u-0.5)*1.1;break;case 6:s=v>0.36&&v<0.64;break;case 7:s=u>0.36&&u<0.64;break;case 8:s=((i>>1)+(j>>1))%2===1;break}
    row.push(s?B:A)}g.push(row)}
  const M=HCH[h.ch]&&HCH[h.ch][1];if(M){const cc=(h.cc===h.c1&&h.d===0)?HTIN[(h.c1+1)%HTIN.length][1]:C;for(let y=0;y<7;y++)for(let x=0;x<7;x++)if(M[y*7+x]==='1')g[y+2][x+1]=cc}
  return g}
// panel herbu z kostek: oś normalna 'x' lub 'z', środek (cx,cy,cz), rozmiar w,h; mask(u,v) -> false = poza kształtem
function herbBoxes(h,ax,cx,cy,cz,w,ht,t,mask){const g=herbGrid(h),L=[],cw=w/HGW,chh=ht/HGH;
  for(let j=0;j<HGH;j++)for(let i=0;i<HGW;i++){const u=(i+0.5)/HGW,v=(j+0.5)/HGH;if(mask&&!mask(u,v))continue;const a=(u-0.5)*w,b=(0.5-v)*ht;
    if(ax==='z')L.push([cx+a,cy+b,cz,cw+0.001,chh+0.001,t,g[j][i]]);else L.push([cx,cy+b,cz+(ax==='x-'?-a:a),t,chh+0.001,cw+0.001,g[j][i]])}return L}
function herbDraw(cv,h){const g=herbGrid(h),x=cv.getContext('2d'),W=cv.width,H=cv.height;x.clearRect(0,0,W,H);x.save();x.beginPath();x.moveTo(4,4);x.lineTo(W-4,4);x.lineTo(W-4,H*0.55);x.quadraticCurveTo(W-4,H-10,W/2,H-3);x.quadraticCurveTo(4,H-10,4,H*0.55);x.closePath();x.clip();
  const cw=(W-8)/HGW,chh=(H-7)/HGH;for(let j=0;j<HGH;j++)for(let i=0;i<HGW;i++){x.fillStyle=g[j][i];x.fillRect(4+i*cw,4+j*chh,cw+0.5,chh+0.5)}x.restore();
  x.strokeStyle='#c9a24a';x.lineWidth=3;x.beginPath();x.moveTo(4,4);x.lineTo(W-4,4);x.lineTo(W-4,H*0.55);x.quadraticCurveTo(W-4,H-10,W/2,H-3);x.quadraticCurveTo(4,H-10,4,H*0.55);x.closePath();x.stroke()}
S.herb=herbOf(LS.get('herb',null));
// herby królestw: każde królestwo (a bez królestw każde miasto/wioska) ma własny herb w stylu swojej rasy
const KHCH={niziolki:[7,10,6,2,9],drowy:[6,2,5,13,3],saurianie:[13,2,7,12,6],ludzie:[1,3,4,5,8,9,10,11],elfy:[2,6,7,10,8],krasnoludy:[3,4,12,5,2],orkowie:[12,13,6,5,9]},KHC={niziolki:[4,0,9,7,1],drowy:[5,6,1,8],saurianie:[4,2,5,0,9],ludzie:[0,1,2,3,6,4],elfy:[4,1,0,8,6],krasnoludy:[0,2,5,9,7,1],orkowie:[5,2,9,7,0]};
function factionHerb(id,race){const r=rngOf('kh'+id),cs=KHC[race]||KHC.ludzie,ch=KHCH[race]||KHCH.ludzie,met=c=>c===0||c===1;const c1=cs[Math.floor(r()*cs.length)];let c2=cs[Math.floor(r()*cs.length)];
  if(c2===c1||met(c2)===met(c1))c2=met(c1)?[2,3,5,4,6][Math.floor(r()*5)]:[0,1][Math.floor(r()*2)];const d=Math.floor(r()*HDIV.length);let cc=met(c1)?[5,2,3][Math.floor(r()*3)]:[0,1][Math.floor(r()*2)];if(d!==0&&cc===c2)cc=met(cc)?(cc^1):5;
  return herbOf({d,c1,c2,ch:ch[Math.floor(r()*ch.length)],cc,sh:1,tu:1})}
const vHerb=v=>v._herb||(v._herb=factionHerb(v.kid||v.id,v.race));
const kHerb=k=>k._herb||(k._herb=factionHerb(k.id,k.race));
const GMAT={elfy:'elf',krasnoludy:'krasn',orkowie:'skora',niziolki:'skora',drowy:'elf',saurianie:'skora'};
function soldierGear(g,herb,race,city){g.userData.herb=herb;try{applyGear(g,{zbroja:{base:'zbroja',rar:0,mat:GMAT[race]||'kolcz'},tarcza:{base:'tarcza',rar:0,var:city?'herbowa':'okuta',mat:'plyt'}})}catch(e){console.warn('herb straży',e)}}
function herbNear(x,z,race){const k=kingdomAtM(x,z,true);if(k)return kHerb(k);let b=null,bd=1e18;for(const v of villages.values()){if(!v||v.camp)continue;const d=(v.x-x)**2+(v.z-z)**2;if(d<bd){bd=d;b=v}}return b?vHerb(b):factionHerb('r'+Math.round(x/500)+'_'+Math.round(z/500),race||'ludzie')}
// ---------- założone przedmioty na modelu postaci ----------
const MET2=['#8a8f94','#9aa0a6','#a8b4c4','#9a8cc0','#d9b23a'];
function gearSig(eq){return ['helm','zbroja','rekawice','buty','amulet','pierscien','latarnia','tarcza'].map(k=>eq[k]?k+':'+eq[k].rar+':'+(eq[k].mat||'')+':'+(eq[k].lk||0)+':'+(eq[k].sd||0)+':'+(eq[k].var||''):'').filter(Boolean).join(',')}
function parseSig(s){const o={};if(s)for(const p of s.split(',')){const [k,r,mt,lk,sd,vr]=p.split(':');o[k]={base:k,rar:+r,mat:mt||undefined,lk:+(lk||0),sd:+(sd||0),var:vr||undefined}}return o}
const gMat0=it=>it.lk>=5&&FTH[it.lk]?FTH[it.lk].m:it.mat?ARMT.find(a=>a.k===it.mat).c:MET2[it.rar];
const gMat=it=>{const c=gMat0(it);return it.sd?darker(c,0.86+(it.sd%9)/9*0.28):c};const TRIMC=['#d9b23a','#c8ccd4','#a8743a','#a8302a','#2f5f8f','#3a7a3a'];
// ===== faktury zbroi (kolczuga, płyty z nitami, skóra ze szwami, łuski smocze, elfie żyłkowanie, metal szczotkowany) =====
const ARMATS={};
const ARMPAT=['m=1.+(aph(vec2(floor(q.y*60.),1.))-.5)*.07-.12*step(.93,fract(q.y*6.));',
 'vec2 s=q*vec2(16.,21.);s.x+=.5*mod(floor(s.y),2.);float r=length(fract(s)-.5);m=.8+.2*smoothstep(.08,.22,abs(r-.3))+(aph(floor(s))-.5)*.05;',
 'm=1.-.22*step(fract(q.y*6.5),.06)+(aph(vec2(floor(q.y*70.),3.))-.5)*.05;vec2 rv=fract(q*vec2(7.,6.5))-vec2(.5,.15);m+=.22*step(length(rv),.09);',
 'm=1.+(aph(floor(q*36.))-.5)*.1+(aph(floor(q*9.))-.5)*.07;m-=.2*step(fract(q.x*12.),.5)*step(abs(fract(q.y*4.)-.5),.03);',
 'vec2 s=q*vec2(10.,13.);s.x+=.5*mod(floor(s.y),2.);vec2 fz=fract(s)-vec2(.5,0.);float d=length(fz*vec2(1.,1.5));m=.82+.26*smoothstep(.62,.3,d)+.08*smoothstep(.2,0.,abs(d-.55));',
 'm=1.+.08*sin(q.x*36.+sin(q.y*18.)*2.5)+(aph(floor(q*20.))-.5)*.04-.1*step(abs(fract(q.y*4.+sin(q.x*7.)*.2)-.5),.03);'];
function armorMat(k){const K={kolcz:1,plyt:2,krasn:2,skora:3,smok:4,elf:5}[k]||0;if(ARMATS[K])return ARMATS[K];const mat=new THREE.MeshLambertMaterial({vertexColors:true});
  mat.onBeforeCompile=sh=>{sh.vertexShader='varying vec3 vAp;varying vec3 vAn;\n'+sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvAp=position;vAn=normal;');
    sh.fragmentShader='varying vec3 vAp;varying vec3 vAn;float aph(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}\n'+sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n{vec3 an=abs(vAn);vec2 q=an.x>an.y&&an.x>an.z?vAp.zy:an.y>an.z?vAp.xz:vAp.xy;float m=1.;'+ARMPAT[K]+'vec3 c0=diffuseColor.rgb;float mx=max(c0.r,max(c0.g,c0.b)),mn=min(c0.r,min(c0.g,c0.b)),sat=(mx-mn)/(mx+.001);float w=1.-smoothstep(.22,.5,sat);'+(K===3?'w=max(w,step(c0.b,c0.g)*step(c0.g,c0.r)*(1.-smoothstep(.55,.8,sat)));':'')+'diffuseColor.rgb*=mix(1.,clamp(m,.55,1.3),w);}')};
  mat.customProgramCacheKey=()=>'arm'+K;return ARMATS[K]=mat}
let CURM=null;
const TWOH=it=>!!it&&(['mlot','halabarda','wlocznia','luk','kusza','kostur'].includes(it.base)||it.var==='dwureczny');
// lamówki zbroi: kolor metalu/skóry zamiast jaskrawych pasów rzadkości (rzadkość zostaje jako klejnot)
function armTrim(M,rar){return rar>=4?'#d9b23a':rar>=3?'#c9a24a':darker(M,1.22)}
// dodatkowe elementy zbroi: rękawy/naramienniki, karwasze, nagolenniki, faktura kolczugi, nity, sprzączka pasa
function armorExtra(u,mt,M,M2,c,bw,add,gl){const hard=mt==='plyt'||mt==='krasn'||mt==='smok',D=darker(M,0.72),HI=darker(M,1.18);
  add(u.torso,[[0,0.17,0.186,0.09,0.09,0.012,'#c9a24a',0],[0,0.17,0.19,0.04,0.05,0.008,darker(M2,0.7),0]]);
  for(const [s,e,sg] of [[u.la,u.le,-1],[u.ra,u.re,1]]){if(!s)continue;
    if(hard){add(s,[[0,-0.14,0,0.235,0.2,0.245,M],[0,-0.06,0,0.245,0.03,0.255,D],[0,-0.22,0,0.245,0.03,0.255,D],[0,0.09,0,0.33,0.07,0.34,HI],[0,0.15,0,0.26,0.05,0.27,M2]]);if(mt==='smok')add(s,[[sg*0.12,0.2,-0.04,0.05,0.12,0.05,'#e8d8a8'],[sg*0.13,0.29,-0.07,0.035,0.08,0.035,'#e8d8a8']])}
    else if(mt==='kolcz')add(s,[[0,-0.12,0,0.232,0.2,0.242,M2],[0,-0.05,0.122,0.2,0.008,0.004,D,0],[0,-0.11,0.122,0.2,0.008,0.004,D,0],[0,-0.17,0.122,0.2,0.008,0.004,D,0]]);
    else if(mt==='elf')add(s,[[0,-0.1,0,0.226,0.18,0.236,M],[0,0.07,0.02,0.3,0.05,0.24,HI],[0,0.04,-0.06,0.24,0.04,0.2,M2]]);
    else add(s,[[0,-0.11,0,0.228,0.18,0.238,M],[0,0.06,0,0.3,0.06,0.31,M2],[0,-0.03,0.121,0.03,0.12,0.004,'#3a2414',0]]);
    if(e&&!gl)add(e,[[0,-0.1,0,0.212,0.12,0.222,hard?M:M2],[0,-0.05,0,0.22,0.025,0.23,D]])}
  if(mt==='kolcz'){const L=[];for(let k=0;k<5;k++)L.push([0,0.2+k*0.075,0.1805,0.54*bw,0.008,0.004,D,0],[0,0.2+k*0.075,-0.1805,0.54*bw,0.008,0.004,D,0]);add(u.torso,L)}
  if(hard){const L=[];for(const sx of [-0.22,0.22])for(const y of [0.5,0.26])L.push([sx*bw,y,0.185,0.025,0.025,0.01,HI,0]);add(u.torso,L)}
  for(const l of [u.ll,u.rl]){if(!l)continue;if(hard)add(l,[[0,-0.17,0.005,0.25,0.22,0.27,M],[0,-0.06,0.005,0.255,0.03,0.275,D],[0,-0.33,0.13,0.17,0.1,0.06,HI],[0,-0.33,0.155,0.07,0.05,0.02,M2,0]]);
    else if(mt==='kolcz')add(l,[[0,-0.1,0,0.252,0.14,0.268,M2]]);else if(mt==='skora')add(l,[[0,-0.12,0.13,0.18,0.18,0.03,M],[0,-0.12,0.147,0.03,0.16,0.006,'#3a2414',0]]);else if(mt==='elf')add(l,[[0,-0.1,0.13,0.2,0.16,0.025,M],[0,-0.03,0.14,0.21,0.03,0.02,'#d9b23a',0]])}}
function applyGear(g,eq){CURM=null;const u=g.userData;const sig=gearSig(eq)+'|'+(u.herb?herbStr(u.herb):'');if(u.gsig===sig)return;u.gsig=sig;if(u.acape){if(u.cape===u.acape)u.cape=null;u.acape=null}
  for(const m of (u.gear||[]))m.parent&&m.parent.remove(m);u.gear=[];const add=(parent,list,mat)=>{const m=new THREE.Mesh(rboxes(list),mat||CURM||decoMat);m.castShadow=true;parent.add(m);u.gear.push(m);return m};
  const bw=u.look&&u.look.build?1.12:1;
  if(u.head&&u.head.userData.hairM)u.head.userData.hairM.visible=!eq.helm;
  CURM=eq.helm?armorMat(eq.helm.mat):null;if(eq.helm){const gem=RAR[eq.helm.rar].c,M=gMat(eq.helm),c=armTrim(M,eq.helm.rar),M2=darker(M,0.8),mt=eq.helm.mat;const L=mt==='skora'?[[0,0.5,0,0.57,0.2,0.55,M],[0,0.62,0,0.4,0.06,0.4,M2],[0,0.41,0,0.59,0.05,0.57,c],[0,0.36,-0.25,0.55,0.24,0.08,M]]:mt==='kolcz'?[[0,0.5,0,0.58,0.22,0.56,M],[0,0.33,-0.26,0.58,0.42,0.07,M],[0.29,0.3,-0.02,0.05,0.42,0.48,M],[-0.29,0.3,-0.02,0.05,0.42,0.48,M],[0,0.1,0.2,0.48,0.12,0.12,M],[0,0.62,0,0.4,0.05,0.4,c]]:mt==='plyt'?[[0,0.42,0,0.6,0.42,0.58,M],[0,0.65,0,0.48,0.08,0.46,M2],[0,0.33,0.296,0.46,0.04,0.02,'#141414',0],[0,0.24,0.29,0.08,0.16,0.04,M2,0],[0,0.72,-0.04,0.06,0.1,0.42,c]]:mt==='krasn'?[[0,0.5,0,0.58,0.24,0.56,M],[0,0.65,0,0.46,0.08,0.44,M2],[0,0.41,0,0.6,0.06,0.58,c],[0.32,0.62,0,0.12,0.1,0.12,'#e8e0c8'],[-0.32,0.62,0,0.12,0.1,0.12,'#e8e0c8'],[0.38,0.74,0,0.08,0.18,0.08,'#e8e0c8'],[-0.38,0.74,0,0.08,0.18,0.08,'#e8e0c8']]:mt==='elf'?[[0,0.5,0,0.57,0.2,0.55,M],[0,0.64,-0.04,0.36,0.1,0.42,M2],[0,0.76,-0.1,0.2,0.12,0.3,M2],[0,0.42,0.285,0.5,0.06,0.02,'#d9d9c0',0],[0,0.86,-0.16,0.05,0.16,0.2,c]]:mt==='smok'?[[0,0.5,0,0.6,0.26,0.58,M],[0,0.66,0,0.46,0.08,0.44,M2],[0,0.33,0.296,0.4,0.04,0.02,'#ffb030',0],[0.26,0.72,-0.1,0.08,0.22,0.08,'#e8d8a8'],[-0.26,0.72,-0.1,0.08,0.22,0.08,'#e8d8a8'],[0,0.68,-0.2,0.06,0.12,0.4,c]]:[[0,0.5,0,0.58,0.24,0.56,M],[0,0.65,0,0.46,0.08,0.44,M2],[0,0.4,0,0.6,0.06,0.58,c],[0,0.33,-0.27,0.56,0.3,0.06,M],[0,0.33,0.29,0.07,0.2,0.04,M2,0],[0.29,0.33,0.06,0.05,0.24,0.3,M2,0],[-0.29,0.33,0.06,0.05,0.24,0.3,M2,0]];
    if(eq.helm.rar>=2)L.push([0,0.4,0,0.61,0.035,0.59,c]);if(eq.helm.rar>=3)L.push([0,0.5,0.3,0.07,0.07,0.012,gem,0]);if(eq.helm.rar>=4)L.push([0,0.62,0.27,0.14,0.06,0.02,'#d9b23a',0]);for(let i=0;i<L.length;i++)if(L[i][6]===c&&L[i][1]>0.68)L.splice(i--,1);add(u.head,L)}
  CURM=eq.zbroja?armorMat(eq.zbroja.mat):null;if(eq.zbroja){const gem=RAR[eq.zbroja.rar].c,M=gMat(eq.zbroja),c=armTrim(M,eq.zbroja.rar),M2=darker(M,0.8),mt=eq.zbroja.mat;if(mt==='plyt'||mt==='krasn'||mt==='smok')add(u.torso,[[0,0.46,0,0.6*bw,0.04,0.37,M2,0],[0,0.3,0,0.6*bw,0.04,0.37,M2,0]]);if(mt==='skora')add(u.torso,[[0.15,0.36,0.18,0.02,0.36,0.012,'#3a2414',0],[-0.15,0.36,0.18,0.02,0.36,0.012,'#3a2414',0]]);if(mt==='smok')for(let k=0;k<4;k++)add(u.torso,[[0,0.2+k*0.1,-0.19,0.12,0.06,0.04,'#e8d8a8',0]]);add(u.torso,[[0,0.36,0,0.58*bw,0.44,0.355,M],[0,0.57,0,0.44,0.06,0.37,M2],[0,0.17,0,0.6*bw,0.08,0.36,M2],[0,0.38,0.18,0.14,0.14,0.012,gem,0],[0,0.36,0.183,0.03,0.4,0.012,M2,0]]);
    for(const s of [u.la,u.ra])add(s,[[0,0.03,0,0.27,0.13,0.28,M],[0,-0.05,0,0.25,0.05,0.26,c]])}
  CURM=eq.zbroja?armorMat(eq.zbroja.mat):null;if(eq.zbroja){const gem=RAR[eq.zbroja.rar].c,M=gMat(eq.zbroja),c=armTrim(M,eq.zbroja.rar),M2=darker(M,0.8),mt=eq.zbroja.mat;
    if(mt==='kolcz'||mt==='plyt'||mt==='krasn')add(u.torso,[[0,-0.03,0,0.6*bw,0.24,0.37,mt==='kolcz'?M2:'#8a8f94']]);
    if(mt==='plyt'||mt==='smok'||mt==='krasn'){add(u.torso,[[0,0.6,0.01,0.34,0.08,0.36,M2],[0,0.4,0.186,0.05,0.38,0.012,darker(M,1.15),0]]);for(const sg of [-1,1])add(u.torso,[[sg*0.15,-0.06,0.19,0.2,0.24,0.03,M,0]]);for(const s of [u.la,u.ra])add(s,[[0,0.0,0,0.29,0.08,0.3,M2],[0,-0.08,0,0.26,0.06,0.28,M]])}
    if(mt==='skora')add(u.torso,[[0.2,0.35,0.181,0.05,0.5,0.012,'#3a2414',0],[0,0.05,0.18,0.12,0.08,0.02,'#c9a24a',0]]);
    if(mt==='elf'){add(u.torso,[[0,0.36,0.183,0.06,0.42,0.012,'#d9b23a',0],[0.12,0.48,0.182,0.1,0.06,0.012,'#5a9a4a',0],[-0.12,0.3,0.182,0.1,0.06,0.012,'#5a9a4a',0],[0.2,0.1,0,0.08,0.06,0.38,'#5a9a4a']])}
    if(eq.zbroja.rar>=3)add(u.torso,[[0,0.62,-0.17,0.5,0.06,0.04,c,0]]);
    armorExtra(u,mt,M,M2,c,bw,add,!!eq.rekawice)}
  CURM=eq.rekawice?armorMat(eq.rekawice.mat):null;if(eq.rekawice){const M=gMat(eq.rekawice),c=armTrim(M,eq.rekawice.rar),mt=eq.rekawice.mat;if(mt==='plyt'||mt==='smok'||mt==='krasn')for(const e of [u.le,u.re])add(e,[[0,-0.12,0,0.2,0.08,0.22,darker(M,0.85)]]);if(mt==='skora')for(const e of [u.le,u.re])add(e,[[0,-0.1,0,0.18,0.03,0.2,'#3a2414',0]]);for(const e of [u.le,u.re])add(e,[[0,-0.28,0.01,0.18,0.16,0.19,M],[0,-0.18,0,0.2,0.07,0.21,c]])}
  CURM=eq.buty?armorMat(eq.buty.mat):null;if(eq.buty&&(eq.buty.mat==='plyt'||eq.buty.mat==='smok'||eq.buty.mat==='krasn')){const M=gMat(eq.buty);for(const l of [u.ll,u.rl])add(l,[[0,-0.35,0.13,0.14,0.12,0.04,M],[0,-0.42,0.02,0.22,0.12,0.25,darker(M,0.85)]])}
  CURM=eq.buty?armorMat(eq.buty.mat):null;if(eq.buty){const M=eq.buty.mat?gMat(eq.buty):eq.buty.rar>=2?MET2[eq.buty.rar]:'#6a4428',c=armTrim(M,eq.buty.rar);for(const l of [u.ll,u.rl])add(l,[[0,-0.58,0.028,0.25,0.29,0.325,M],[0,-0.45,0.005,0.265,0.06,0.285,c],[0,-0.72,0.04,0.26,0.04,0.34,'#2a1c12']])}
  CURM=eq.tarcza?armorMat(eq.tarcza.mat):null;if(eq.tarcza&&(u.le||u.la)){const it=eq.tarcza,c=RAR[it.rar].c,M=gMat(it),M2=darker(M,0.75),v=it.var||'okuta',W='#7a5030',par=u.le||u.la;const L=[];
    if(v==='puklerz'){for(let i=0;i<10;i++){const a=i/10*Math.PI*2;L.push([-0.13,-0.25+Math.cos(a)*0.17,0.04+Math.sin(a)*0.17,0.04,0.09,0.09,M2])}L.push([-0.12,-0.25,0.04,0.04,0.3,0.3,M],[-0.16,-0.25,0.04,0.06,0.1,0.1,c])}
    else if(v==='wiezowa'){L.push([-0.13,-0.2,0.04,0.05,1.0,0.5,W],[-0.155,-0.2,0.04,0.01,0.96,0.04,M2],[-0.155,-0.2,0.04,0.01,0.04,0.46,M2]);for(const y of [0.28,-0.68])L.push([-0.14,y,0.04,0.06,0.05,0.52,M]);for(const z of [-0.23,0.31])L.push([-0.14,-0.2,z,0.06,1.0,0.05,M]);L.push([-0.165,-0.2,0.04,0.02,0.18,0.14,c])}
    else if(v==='herbowa'){for(let i=0;i<6;i++){const w=0.52-i*0.07;L.push([-0.13,0.05-i*0.11,0.04,0.05,0.11,w,i%2?c:M])}L.push([-0.155,-0.2,0.04,0.01,0.66,0.06,'#f0e8d0'],[-0.155,-0.12,0.04,0.01,0.06,0.4,'#f0e8d0']);for(const s of [-1,1])L.push([-0.14,-0.2,0.04+s*0.27,0.06,0.66,0.04,M2])}
    else{for(let i=0;i<5;i++)L.push([-0.13,-0.2,0.04-0.2+i*0.1,0.05,0.62,0.095,i%2?W:'#8a5a30']);L.push([-0.14,0.11,0.04,0.06,0.05,0.52,M],[-0.14,-0.51,0.04,0.06,0.05,0.52,M],[-0.14,-0.2,0.31,0.06,0.62,0.04,M],[-0.14,-0.2,-0.23,0.06,0.62,0.04,M],[-0.165,-0.2,0.04,0.04,0.14,0.14,c])}
    add(par,L);if(u.herb&&herbOf(u.herb).sh){const H=u.herb,T=-0.178;let hb=null;if(v==='puklerz')hb=herbBoxes(H,'x-',T,-0.25,0.04,0.24,0.24,0.012,(a,b)=>Math.hypot(a-0.5,b-0.5)<0.5);else if(v==='wiezowa')hb=herbBoxes(H,'x-',T,-0.2,0.04,0.42,0.86,0.012);else if(v==='herbowa')hb=herbBoxes(H,'x-',T,-0.14,0.04,0.46,0.6,0.012,(a,b)=>b<0.55||Math.abs(a-0.5)<(1-b)*1.05);else hb=herbBoxes(H,'x-',T,-0.2,0.04,0.44,0.52,0.012);CURM=null;add(par,hb)}}
  CURM=null;
  if(u.herb&&herbOf(u.herb).tu&&u.torso){const H=herbOf(u.herb),zf=eq.zbroja?0.205:0.192;add(u.torso,herbBoxes(H,'z',0,0.36,zf,0.36*bw,0.44,0.012,(a,b)=>b<0.8||Math.abs(a-0.5)<(1-b)*2.6));add(u.torso,[[0,0.36,-zf,0.36*bw,0.44,0.012,HTIN[H.c1][1]],[0,0.6,zf+0.004,0.38*bw,0.03,0.012,'#c9a24a'],[0,0.6,-zf-0.004,0.38*bw,0.03,0.012,'#c9a24a']])}
  {const G='#d9b23a',FUR='#8a6a4a',FUR2='#a8886a',RV='#d8dde2';
   const GL=(p,l)=>add(p,l.map(b=>[b[0],b[1],b[2],b[3],b[4],b[5],b[6],0]),GLOWMAT);
   for(const [slot,part] of [['helm',u.head],['zbroja',u.torso]]){const it=eq[slot];if(!it||!(it.lk>=5))continue;const T=FTH[it.lk],k=it.lk;
     if(slot==='helm'){GL(u.head,[[0.115,0.32,0.31,0.12,0.04,0.012,T.g],[-0.115,0.32,0.31,0.12,0.04,0.012,T.g]]);
       if(k===5)for(const s of [1,-1])add(u.head,[[s*0.31,0.55,0,0.12,0.09,0.1,T.a],[s*0.41,0.68,-0.04,0.07,0.12,0.08,T.a],[s*0.43,0.8,-0.1,0.05,0.1,0.06,'#1a1014']]);
       if(k===6||k===8){add(u.head,[[0,0.64,0,0.38,0.06,0.12,darker(gMat(it),0.85)]]);const l=[[0,0.77,0,0.06,0.22,0.06,T.g],[0.14,0.73,0,0.06,0.16,0.06,T.g],[-0.14,0.73,0,0.06,0.16,0.06,T.g]];if(k===6)GL(u.head,l);else add(u.head,l.map(b=>{b[6]='#ffffff';return b}))}
       if(k===7)GL(u.head,[[0,0.68,0.06,0.08,0.1,0.1,T.g],[0,0.74,-0.04,0.08,0.1,0.1,'#ffe080'],[0,0.78,-0.14,0.07,0.08,0.1,T.g]]);
       if(k===9)GL(u.head,[[0,1.0,0,0.5,0.03,0.5,T.g]])}
     else{GL(u.torso,[[0,0.38,0.19,0.14,0.14,0.012,T.g],[0.24*bw,0.36,0.185,0.02,0.4,0.01,T.g],[-0.24*bw,0.36,0.185,0.02,0.4,0.01,T.g]]);
       for(const s of [u.la,u.ra]){if(k===5)add(s,[[0,0.14,0,0.06,0.16,0.06,T.a],[0,0.24,0,0.04,0.08,0.04,'#1a1014']]);if(k===6||k===8){const l=[[0,0.14,0,0.07,0.16,0.07,T.g]];if(k===6)GL(s,l);else add(s,[[0,0.14,0,0.07,0.16,0.07,'#ffffff']])}if(k===7)GL(s,[[0,0.12,0,0.1,0.08,0.1,T.g]]);if(k===9)GL(s,[[0,0.2,0,0.07,0.07,0.07,T.g]])}}}
   for(const [slot,parts] of [['rekawice',[u.le,u.re]],['buty',[u.ll,u.rl]]]){const it=eq[slot];if(!it||!(it.lk>=5))continue;const T=FTH[it.lk];for(const p of parts)GL(p,slot==='rekawice'?[[0,-0.26,0.1,0.19,0.025,0.012,T.g]]:[[0,-0.5,0.172,0.2,0.025,0.012,T.g]])}
   if(eq.helm&&eq.helm.lk&&eq.helm.lk<5){const k=eq.helm.lk,M=gMat(eq.helm),M2=darker(M,0.8);
     if(k===1)for(const s of [1,-1])add(u.head,[[s*0.33,0.56,0,0.1,0.08,0.08,'#e8e0c8'],[s*0.41,0.64,0,0.07,0.1,0.07,'#e8e0c8'],[s*0.45,0.75,-0.02,0.05,0.1,0.05,'#d8d0b8'],[s*0.46,0.84,-0.04,0.035,0.06,0.035,'#a89a80']]);
     if(k===2)add(u.head,[[0,0.27,0.3,0.06,0.26,0.035,M2],[0,0.47,0.3,0.32,0.03,0.012,darker(M,1.15),0],[0.2,0.41,0.3,0.025,0.025,0.012,'#d8dde2',0],[-0.2,0.41,0.3,0.025,0.025,0.012,'#d8dde2',0]]);
     if(k===3)add(u.head,[[0,0.42,0,0.63,0.52,0.61,M],[0,0.69,0,0.55,0.04,0.53,M2],[0,0.44,0.308,0.48,0.04,0.012,'#141414',0],[0,0.33,0.31,0.05,0.24,0.012,darker(M,1.15),0],[0,0.37,0.31,0.3,0.03,0.012,darker(M,1.15),0]]);
     if(k===4)add(u.head,[[0,0.63,0,0.4,0.08,0.4,M],[0,0.7,0,0.24,0.07,0.24,M],[0,0.77,0,0.09,0.09,0.09,darker(M,1.15)],[0,0.28,0.3,0.05,0.26,0.03,M2],[0,0.14,-0.08,0.58,0.2,0.46,'#9aa0a6']])}
   if(eq.zbroja&&eq.zbroja.lk&&eq.zbroja.lk<5){const k=eq.zbroja.lk,M=gMat(eq.zbroja),M2=darker(M,0.8),M3=darker(M,1.15);
     if(k===1)add(u.torso,[[0,0.22,0.188,0.36*bw,0.66,0.012,'#2f5f8f',0],[0,0.22,0.194,0.08,0.66,0.008,G,0],[0,0.38,0.197,0.15,0.15,0.008,G,0],[0,0.38,0.2,0.08,0.08,0.006,'#a8302a',0],[0,0.22,-0.188,0.36*bw,0.66,0.012,'#2f5f8f',0]]);
     if(k===2){const l=[];for(let r=0;r<4;r++)for(let q=-2;q<=2;q++)l.push([q*0.1*bw,0.14+r*0.12,0.19,0.03,0.03,0.012,RV,0]);add(u.torso,l)}
     if(k===3){const l=[];for(let r=0;r<6;r++)for(let q=-3;q<=3;q++){const x=q*0.075+(r%2)*0.037;if(Math.abs(x)<0.27*bw)l.push([x,0.12+r*0.08,0.19,0.066,0.056,0.012,r%2?M2:M3,0])}add(u.torso,l)}
     if(k===4)add(u.torso,[[0,0.62,0,0.66*bw,0.12,0.42,FUR],[0,0.68,0,0.5,0.06,0.36,FUR2],[0.3*bw,0.57,0.14,0.08,0.08,0.12,FUR2],[-0.3*bw,0.57,0.14,0.08,0.08,0.12,FUR2]])}
   if(eq.rekawice&&eq.rekawice.lk&&eq.rekawice.lk<5){const k=eq.rekawice.lk,M=gMat(eq.rekawice);for(const e of [u.le,u.re]){
     if(k===1)add(e,[[0,-0.34,0.11,0.12,0.025,0.05,RV],[0.05,-0.34,0.13,0.025,0.025,0.05,RV],[-0.05,-0.34,0.13,0.025,0.025,0.05,RV]]);if(k===2)add(e,[[0,-0.17,0,0.25,0.09,0.26,FUR]]);if(k===3)add(e,[[0,-0.15,0,0.27,0.11,0.28,darker(M,0.8)],[0,-0.1,0,0.29,0.03,0.3,darker(M,1.15)]]);if(k===4)add(e,[[0,-0.27,0.101,0.06,0.05,0.012,G,0],[0,-0.2,0.106,0.19,0.02,0.01,G,0]])}}
   if(eq.buty&&eq.buty.lk&&eq.buty.lk<5){const k=eq.buty.lk,M=eq.buty.mat?gMat(eq.buty):'#6a4428';for(const l of [u.ll,u.rl]){
     if(k===1)add(l,[[0,-0.43,0.005,0.3,0.09,0.32,FUR]]);if(k===2)add(l,[[0,-0.68,-0.16,0.04,0.04,0.08,'#c9a24a'],[0,-0.68,-0.21,0.06,0.06,0.02,G]]);if(k===3)add(l,[[0,-0.3,0.13,0.18,0.13,0.05,darker(M,1.15)],[0,-0.26,0.15,0.1,0.06,0.03,M]]);if(k===4)add(l,[[0,-0.5,0.172,0.2,0.03,0.012,G,0],[0.1,-0.5,0.1,0.012,0.04,0.04,G,0]])}}}
  for(const slot of ['helm','zbroja','rekawice','buty']){const it=eq[slot];if(!it||!it.sd)continue;const Q=mulb(it.sd*17+3),M=gMat(it),M2=darker(M,0.8),M3=darker(M,1.15),s1=Math.floor(Q()*5),s2=Math.floor(Q()*4),s3=Q()<0.5;
    if(slot==='helm'){const H=u.head;if(s1===1)add(H,[0,1,2,3].map(k=>[0,0.72+k*0.05,0,0.32-k*0.08,0.05,0.32-k*0.08,k===3?M3:M]));if(s1===2)add(H,[[0,0.4,0,0.86,0.04,0.84,M],[0,0.38,0,0.9,0.02,0.88,M2]]);if(s1===3)add(H,[[0,0.75,0,0.05,0.12,0.52,M3]]);if(s1===4)add(H,[[0,0.72,0,0.38,0.1,0.38,M],[0,0.8,0,0.24,0.08,0.24,M3],[0.3,0.3,0.1,0.04,0.26,0.24,M2],[-0.3,0.3,0.1,0.04,0.26,0.24,M2]])}
    if(slot==='zbroja'){for(const s of [u.la,u.ra]){if(s2===1)add(s,[[0,0.06,0,0.32,0.08,0.33,M3],[0,0.12,0,0.28,0.06,0.3,M2]]);if(s2===2)add(s,[[0,0.06,0,0.33,0.05,0.34,M3],[0.04,0.11,0,0.06,0.06,0.34,M2]]);if(s2===3)add(s,[[0,0.14,0.06,0.04,0.12,0.04,M3],[0,0.14,-0.06,0.04,0.12,0.04,M3]])}if(s3)add(u.torso,[[0,0.66,0,0.38,0.1,0.34,M2],[0,0.72,0,0.32,0.04,0.3,M3]])}
    if(slot==='rekawice')for(const e of [u.le,u.re]){if(s2===1)add(e,[[0,-0.13,0,0.27,0.08,0.28,M2]]);if(s2===2)add(e,[[0,-0.34,0.09,0.15,0.04,0.04,M3]]);if(s2===3)add(e,[[0,-0.06,0,0.22,0.12,0.23,M]])}
    if(slot==='buty')for(const l of [u.ll,u.rl]){if(s2===1)add(l,[[0,-0.68,0.22,0.15,0.08,0.1,M],[0,-0.69,0.28,0.08,0.06,0.06,M3]]);if(s2===2)add(l,[[0,-0.42,0.005,0.31,0.07,0.33,M2]]);if(s2===3)add(l,[[0,-0.3,0.13,0.18,0.13,0.05,M3]])}}
  for(const [slot,parts,fn] of [['helm',[u.head],()=>[[0,0.35,0,0.6,0.03,0.58,0]]],['zbroja',[u.torso],()=>[[0,0.585,0.18,0.42,0.025,0.012,0],[0,0.14,0.185,0.58*bw,0.025,0.012,0]]],['rekawice',[u.le,u.re],()=>[[0,-0.15,0,0.21,0.025,0.22,0]]],['buty',[u.ll,u.rl],()=>[[0,-0.43,0.005,0.27,0.025,0.29,0]]]]){const it=eq[slot];if(!it||!it.sd)continue;const T=TRIMC[Math.floor(it.sd/9)%TRIMC.length];for(const p of parts)add(p,fn().map(b=>[b[0],b[1],b[2],b[3],b[4],b[5],T,0]))}
  {const z=eq.zbroja;if(z){add(u.torso,[[0,0.105,0,0.6*bw,0.08,0.375,'#3a2414'],[0,0.105,0.19,0.1,0.075,0.02,'#c9a24a',0],[0.22*bw,0.02,0.17,0.1,0.14,0.05,'#5a3a22']]);
    const cc=CAPEOF(z);if(cc&&!u.cape){const cg=new THREE.Group();cg.position.set(0,0.58,-0.19);add(cg,[[0,-0.46,-0.02,0.62*bw,0.92,0.045,cc],[0,-0.92,-0.02,0.64*bw,0.05,0.05,darker(cc,0.65)],[0,0,-0.01,0.64*bw,0.09,0.09,darker(cc,0.75)]]);if(z.lk>=5)add(cg,[[0,-0.9,-0.04,0.6*bw,0.03,0.02,FTH[z.lk].g,0]],GLOWMAT);u.torso.add(cg);u.gear.push(cg);u.cape=cg;u.acape=cg}}}
  if(eq.amulet){const c=RAR[eq.amulet.rar].c;add(u.torso,[[0,0.565,0.16,0.3,0.025,0.02,'#c9a24a',0],[0,0.47,0.17,0.1,0.12,0.03,'#d9b23a',0],[0,0.47,0.188,0.06,0.07,0.012,c,0]])}
  if(eq.pierscien){const c=RAR[eq.pierscien.rar].c;add(u.re,[[-0.08,-0.29,0.06,0.03,0.05,0.05,'#d9b23a',0],[-0.095,-0.29,0.06,0.012,0.03,0.03,c,0]])}
  if(eq.latarnia){const r=eq.latarnia.rar,lg=new THREE.Group();lg.position.set(-0.31*bw,0.04,0.06);lg.rotation.z=0.12;
    add(lg,[[0,-0.02,0,0.03,0.12,0.03,'#3a3a40',0],[0,-0.1,0,0.15,0.03,0.15,'#3a3a40',0],[0.065,-0.21,0.065,0.025,0.2,0.025,'#3a3a40',0],[-0.065,-0.21,0.065,0.025,0.2,0.025,'#3a3a40',0],[0.065,-0.21,-0.065,0.025,0.2,0.025,'#3a3a40',0],[-0.065,-0.21,-0.065,0.025,0.2,0.025,'#3a3a40',0],[0,-0.32,0,0.17,0.03,0.17,'#3a3a40',0]]);
    const glass=new THREE.Mesh(boxes([[0,-0.21,0,0.12,0.18,0.12,'#e8d8a8']]),new THREE.MeshBasicMaterial({vertexColors:true}));lg.add(glass);u.gear.push(glass);u.lampGlass=glass;u.torso.add(lg);u.gear.push(lg)}else u.lampGlass=null;
}
// latarnie: pula świateł utworzona od razu (stała liczba świateł = brak przebudowy shaderów)
const LAMPS=[0,1,2,3].map(()=>{const l=new THREE.PointLight(0xffc070,0,10,1);l.castShadow=false;return l});
const glowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,220,150,1)');g.addColorStop(0.35,'rgba(255,180,90,.45)');g.addColorStop(1,'rgba(255,160,60,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const LGLOW=[0,1,2,3].map(()=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.scale.set(1.6,1.6,1);s.visible=false;scene.add(s);return s});
let lampOn=LS.get('lamp',false);
function lampTick(){
  const mine=INV.eq.latarnia;const u=meRef.userData;
  const on=!!mine&&lampOn,fl=1+Math.sin(performance.now()*0.013)*0.04+Math.sin(performance.now()*0.031)*0.03;LAMPS[0].intensity=on?(3.2+0.6*(mine?mine.rar:0))*fl:0;LGLOW[0].visible=on;if(on){LAMPS[0].distance=LAMPR[mine.rar]*1.25;LAMPS[0].position.set(player.p.x,player.p.y+1.6,player.p.z);const gp=new THREE.Vector3();(u.lampGlass||meRef).getWorldPosition(gp);LGLOW[0].position.copy(gp);LGLOW[0].scale.setScalar(1.4+0.25*mine.rar)}
  if(u.lampGlass)u.lampGlass.material.color.setHex(on?0xffffff:0x5a5040);
  let i=1;for(const r of remotes.values()){const b=r.buf[r.buf.length-1];if(i>3)break;const L=LAMPS[i];
    if(b&&b.lo>0&&r.g.visible){L.intensity=3.2+0.6*(b.lo-1);L.distance=(LAMPR[b.lo-1]||10)*1.25;L.position.set(r.g.position.x,r.g.position.y+1.6,r.g.position.z);LGLOW[i].visible=true;LGLOW[i].position.set(r.g.position.x,r.g.position.y+0.8,r.g.position.z)}else{L.intensity=0;LGLOW[i].visible=false}
    if(r.g.userData.lampGlass)r.g.userData.lampGlass.material.color.setHex(b&&b.lo>0?0xffffff:0x5a5040);i++}
  for(;i<4;i++){LAMPS[i].intensity=0;LGLOW[i].visible=false}
  glowLights();try{streetLights()}catch(_){}
  for(let k=0;k<4;k++){const L=LAMPS[k],U=SEAS_U.uLamp.value[k];if(L.intensity>0){U.set(L.position.x,L.position.y,L.position.z,L.distance);SEAS_U.uLampI.value[k]=L.intensity*0.32}else{U.w=0;SEAS_U.uLampI.value[k]=0}}
}
function toggleLamp(){if(!INV.eq.latarnia)return toast('Nie masz założonej latarni','#ff8a7a');lampOn=!lampOn;LS.set('lamp',lampOn);toast(lampOn?'Latarnia zapalona':'Latarnia zgaszona','#ffd27a')}
const isBow=()=>weaponKind(INV.eq.bron?INV.eq.bron.base:'')==='bow';
function rmbDown(){if(INV.eq.tarcza&&!isBow()&&!P2.dead&&!invOpen()&&!uiOpen()&&VH.mode===0){P3.block=true;return}if(isBow()){if(P3.e>0||P3.salvo||P2.dead||!player.ready||invOpen()||uiOpen()||VH.mode===1||VH.mode===2||VH.mode===6)return;P3.chg={t:0};P2.bowT=0;return}useAbility('e')}
function rmbUp(){if(P3.block){P3.block=false;return}if(!P3.chg)return;const k=Math.min(1,P3.chg.t/1.1);P3.chg=null;P3.salvoK=k;useAbility('e')}
function dash(){
  if(P2.dead||P3.dash>0||!player.ready||VH.mode===1||VH.mode===2||P2.roll>0)return;if(VH.mode===3)VH.mode=0;if(VH.mode===5||VH.mode===6)dismountOwn(1);
  const fy=facing(),fx=Math.sin(fy),fz=Math.cos(fy);player.ry=fy;player.v.x=fx*17;player.v.z=fz*17;player.v.y=Math.max(player.v.y,6.5);player.ground=false;P3.leap=0.42;P3.dash=2.2;P2.iframe=Math.max(P2.iframe,0.18);
}
function roll(){
  if(P2.dead||P2.rollCd>0||!player.ready||VH.mode)return;
  let mx=0,mz=0;const f=[(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0),(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0)];
  if(f[0]||f[1]){const l=Math.hypot(f[0],f[1]);mx=(-Math.sin(yaw)*f[1]+Math.cos(yaw)*f[0])/l;mz=(-Math.cos(yaw)*f[1]-Math.sin(yaw)*f[0])/l}else{mx=Math.sin(player.ry);mz=Math.cos(player.ry)}
  P2.roll=0.38;P2.rollCd=0.9;P2.rollDir=[mx,mz];player.ry=Math.atan2(mx,mz);
}
function drinkPotion(){if(P2.dead||INV.pot<=0||P2.hp>=ST.hp)return;INV.pot--;const h=ST.hp*0.45;P2.hp=Math.min(ST.hp,P2.hp+h);fxNum(player.p.x,player.p.y+2,player.p.z,'+'+Math.round(h),'#7dff8a');saveInv();updHud()}
function combatTick(dt){
  {const r=P2.hp/ST.hp;ST=stats();if(P2.hp>ST.hp)P2.hp=ST.hp}classTick(dt);
  P2.atkCd-=dt;P2.atkT-=dt;P2.rollCd-=dt;P2.iframe-=dt;
  if(P2.roll>0){P2.roll-=dt;player.v.x=P2.rollDir[0]*13;player.v.z=P2.rollDir[1]*13}
  if(P2.mouse&&!uiOpen())attack();
  if(P2.bowT>0){P2.bowT-=dt;if(!P2.bowShot&&1-P2.bowT/P2.bowD>=0.9){P2.bowShot=true;sfx('bow');const rm=INV.eq.bron&&INV.eq.bron.rngM||1;const en=INV.eq.bron&&INV.eq.bron.ench;if(P2.sv)shootFromMe('arrow',P2.sv.dmg*rnd(0.9,1.1),0,{sv:P2.sv,sm:P2.sv.sm*rm,ench:en});else shootFromMe('arrow',ST.dmg*rnd(0.9,1.1),0,{sm:rm,ench:en})}}
  if(P2.castT>0){P2.castT-=dt;if(!P2.castShot&&1-P2.castT/P2.castD>=0.45){P2.castShot=true;try{const fy=player.ry;PFX.emit(player.p.x+Math.sin(fy)*0.9,player.p.y+1.45,player.p.z+Math.cos(fy)*0.9,12,['#9fd8ff','#ffffff','#c890ff'],{sp:3.2,life:0.4,size:0.08,up:0.6})}catch(_){}const xb=INV.eq.bron&&INV.eq.bron.base==='kusza';shootFromMe(xb?'arrow':'bolt',ST.dmg*rnd(0.9,1.1),0,{sm:xb?1.15:1,ench:INV.eq.bron&&INV.eq.bron.ench});sfx(xb?'bow':'magic')}}
  if(P2.atkT>0&&P2.atkD&&P2.bowT<=0&&P2.castT<=0){const k=1-P2.atkT/P2.atkD,kind=weaponKind(INV.eq.bron?INV.eq.bron.base:'');
    if(!P2.slashDone&&k>=0.33){P2.slashDone=true;if(kind==='melee')slashFx(meRef,P2.combo,RAR[INV.eq.bron.rar].c)}
    if(!P2.hitDone&&k>=0.42){P2.hitDone=true;meleeHits()}}
  if(P2.dead>0){P2.dead-=dt;$('deadt').textContent=Math.ceil(Math.max(0,P2.dead));if(P2.dead<=0)respawn()}
  else if(nowS()-P2.lastHurt>4)P2.hp=Math.min(ST.hp,P2.hp+(ST.hp*0.01*pk('odnowa')+ST.regen)*dt);
  else P2.hp=Math.min(ST.hp,P2.hp+ST.regen*dt);
  const ho=$('hurt');ho.style.opacity=Math.max(0,parseFloat(ho.style.opacity||0)-dt*1.5);
}
function animMe(dt){
  const u=meRef.userData;const dressing=custOn||(SPC&&SPC.func==='garderoba');{const w=dressing?['',0]:myWeapon();setWeapon(meRef,w[0],w[1],w[2],w[3],w[4])}meRef.userData.herb=S.herb;applyGear(meRef,dressing?{}:INV.eq);lampTick();
  if(P2.dead>0){meRef.rotation.x=0;meRef.rotation.z=Math.min(Math.PI/2,meRef.rotation.z+dt*5);return}
  meRef.rotation.z=0;
  if(P2.roll>0){meRef.rotation.x=(1-P2.roll/0.38)*Math.PI*2;meRef.position.y+=0.4}else meRef.rotation.x=0;
  const kind=weaponKind(INV.eq.bron?INV.eq.bron.base:'');
  if(P2.bowT>0)animCombat(meRef,'bow',0,1-P2.bowT/P2.bowD);
  else if(P3.chg)animCombat(meRef,'bow',0,Math.min(0.86,0.12+P3.chg.t/1.1*0.74));
  else if(P2.castT>0)animCombat(meRef,'staff',0,1-P2.castT/P2.castD);
  else if(P2.atkT>0&&kind==='bow')animCombat(meRef,'bow',0,0.93);
  else if(P2.atkT>0&&kind!=='staff')animCombat(meRef,kind,P2.combo,1-P2.atkT/(P2.atkD||0.3));
  else bowDraw(meRef,0,false);
  if(P2.climbing>0&&!(P2.atkT>0)){const t=performance.now()/180;u.la.rotation.set(-2.7+Math.sin(t)*0.35,0,-0.15);u.ra.rotation.set(-2.7-Math.sin(t)*0.35,0,0.15);u.ll.rotation.x=-0.6-Math.sin(t)*0.4;u.rl.rotation.x=-0.6+Math.sin(t)*0.4;u.le.rotation.x=-0.3;u.re.rotation.x=-0.3;u.torso.rotation.set(-0.1,0,0)}
  if(P3.charge>0){u.ra.rotation.set(-1.4,0,0.2);u.la.rotation.set(-1.4,0,-0.2);u.torso.rotation.x=0.3}
}

// ---------- łup na ziemi ----------
const drops=[];
function spawnDrop(L){
  if(L.xp){gainXp(L.xp);L.xp=0}
  if(L.et){questKill(L);L.et=0}
  if(L.boss){toast('Pokonano: '+L.boss+'!','#ffd34d');L.boss=0}
  const best=L.items.reduce((m,i)=>Math.max(m,i.rar),-1);
  const col=best>=0?RAR[best].c:'#ffd34d';
  const g=new THREE.Group();const fb=best<0&&L.food&&!L.gold?itemBoxes({base:'food',var:L.food,rar:0}).map(b=>[b[0]*1.6,b[1]*1.6,b[2]*1.6,b[3]*1.6,b[4]*1.6,b[5]*1.6,b[6]]):null;const m=new THREE.Mesh(boxes(fb||(best>=0?[[0,0.3,0,0.55,0.4,0.4,'#7a4b22'],[0,0.55,0,0.6,0.14,0.45,'#8f5a2a'],[0,0.5,0.23,0.12,0.14,0.04,col]]:[[0,0.15,0,0.3,0.3,0.06,'#ffd34d']])),new THREE.MeshLambertMaterial({vertexColors:true,emissive:new THREE.Color(col),emissiveIntensity:best>=0?0.25:0.6}));
  m.castShadow=true;g.add(m);
  if(L.items.length===1){try{const it=L.items[0],b=itemBoxes(it);let ig=null,wp=false;if(b)ig=boxes(b);else if(WEAP[it.base]&&it.base!=='luk'){ig=weaponGeo(it.base,it.rar||0,it.var,it.lk,true,it.sd);wp=true}
    if(ig){g.remove(m);const im=new THREE.Mesh(ig,decoMat);ig.computeBoundingBox();const bb=ig.boundingBox,sz=Math.max(bb.max.x-bb.min.x,bb.max.y-bb.min.y,bb.max.z-bb.min.z)||1,k=Math.min(2.2,0.9/sz);const piv=new THREE.Group();im.scale.setScalar(k);im.position.set(-(bb.min.x+bb.max.x)/2*k,-(bb.min.y+bb.max.y)/2*k,-(bb.min.z+bb.max.z)/2*k);if(wp)piv.rotation.z=0.6;piv.add(im);const hold=new THREE.Group();hold.position.y=0.75;hold.add(piv);im.castShadow=true;g.add(hold);g.children.unshift(g.children.pop())}}catch(_){}}
  {const rc=best>=0?col:'#ffd34d',ring=new THREE.Mesh(new THREE.RingGeometry(0.45,0.62,24),new THREE.MeshBasicMaterial({color:rc,transparent:true,opacity:0.7,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));ring.rotation.x=-Math.PI/2;ring.position.y=0.06;g.add(ring);
   const gs=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:new THREE.Color(rc),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0.8}));gs.scale.set(1.6+Math.max(0,best)*0.3,1.6+Math.max(0,best)*0.3,1);gs.position.y=0.75;g.add(gs);
   const lbl=L.items.length===1?L.items[0].name:L.items.length>1?L.items.length+' przedmioty':L.gold?L.gold+' zł':L.pot?'Mikstura':L.food?foodName(L.food):'';if(lbl){const t=nameTag(lbl,rc);t.position.y=1.75;t.visible=false;t.userData.dropLbl=1;g.add(t);g.userData.lbl=t}}
  const beam=new THREE.Mesh(new THREE.BoxGeometry(0.08,4,0.08),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.35+0.08*Math.max(0,best),depthWrite:false,blending:THREE.AdditiveBlending}));beam.position.y=2.2;if(best>=0)g.add(beam);
  g.position.set(L.p[0]+rnd(-0.6,0.6),L.p[1],L.p[2]+rnd(-0.6,0.6));scene.add(g);drops.push({g,L,t:0});
}
let nearLoot=null,pickLoot=false;
function dropsTick(dt){
  const wasPick=pickLoot;nearLoot=null;
  for(let i=drops.length-1;i>=0;i--){const d=drops[i];d.t+=dt;d.g.rotation.y+=dt*1.5;d.g.children[0].position.y=(d.g.children[0].children.length?0.75:0)+Math.sin(d.t*3)*0.1;if(d.g.userData.lbl)d.g.userData.lbl.visible=Math.hypot(d.g.position.x-player.p.x,d.g.position.z-player.p.z)<14;
    const h=colAt(d.g.position.x,d.g.position.z,d.g.position.y+1.5);if(h!==null)d.g.position.y=h;
    if(d.L.dropped&&!d.L.away){if(Math.hypot(d.g.position.x-player.p.x,d.g.position.z-player.p.z)>2.8)d.L.away=1;continue}
    {let dd=Math.hypot(d.g.position.x-player.p.x,d.g.position.z-player.p.z);const onlyG=d.L.gold&&!(d.L.items.length||d.L.pot||d.L.food||d.L.gid);if(onlyG&&!P2.dead&&dd<5.5&&dd>0.3&&Math.abs(d.g.position.y-player.p.y)<3){const k=Math.min(1,dt*(4+(5.5-dd)*2.2))/dd;d.g.position.x+=(player.p.x-d.g.position.x)*k*dd*0.9;d.g.position.z+=(player.p.z-d.g.position.z)*k*dd*0.9;dd=Math.hypot(d.g.position.x-player.p.x,d.g.position.z-player.p.z)}// złoto przyciągane do gracza
    if(d.L.gold&&!P2.dead&&dd<(onlyG?1.9:4.2)&&Math.abs(d.g.position.y-player.p.y)<2.5){INV.gold+=d.L.gold;toast('+'+d.L.gold+' złota','#ffd34d');d.L.gold=0;sfx('coin');saveInv();updHud();if(!(d.L.items.length||d.L.pot||d.L.food)){scene.remove(d.g);try{freeObj(d.g)}catch(_){}drops.splice(i,1);continue}}
      if(P2.dead||dd>2.2||Math.abs(d.g.position.y-player.p.y)>2.5)continue;if(!nearLoot||dd<nearLoot.dd)nearLoot={d,dd};if(!(pickLoot&&nearLoot.d===d))continue}
    if(d.L.gid){const L=d.L;if(INV.bag.length>=bagN()){if(!d.full){toast('Plecak pełny','#ff8a7a');d.full=1}continue}
      if(isAuth()){if(NET.role==='off'||GD.has(L.gid)){GD.delete(L.gid);scene.remove(d.g);try{freeObj(d.g)}catch(_){}drops.splice(i,1);grantDrop(d);if(NET.role!=='off')sendFx({k:'gpick',gid:L.gid,to:NET.id})}continue}
      if(!L.req||performance.now()-L.req>1500){L.req=performance.now();sendFx({k:'gpickreq',gid:L.gid,to:NET.id})}continue}
    const L=d.L;if(L.gold){INV.gold+=L.gold;toast('+'+L.gold+' złota','#ffd34d');L.gold=0;sfx('coin')}
    if(L.pot){INV.pot+=L.pot;toast('Mikstura leczenia','#7dff8a');L.pot=0}
    if(L.food){INV.food[L.food]=(INV.food[L.food]||0)+1;toast(foodName(L.food)+' (dla: '+foodFor(L.food)+')','#d9a27c');L.food=0}
    while(L.items.length&&INV.bag.length<bagN()){const it=L.items.shift();INV.bag.push(it);toast(it.name,RAR[it.rar].c)}
    if(L.items.length){if(!d.full){toast('Plecak pełny','#ff8a7a');d.full=1}continue}
    scene.remove(d.g);try{freeObj(d.g)}catch(_){}drops.splice(i,1);saveInv();updHud();if(invOpen())renderInv();pickLoot=false;nearLoot=null;
  }
  if(wasPick)pickLoot=false;
  if(nearLoot&&!dlg){const L=nearLoot.d.L,pr=$('prompt'),nm=L.items.length?L.items[0].name+(L.items.length>1?' (+'+(L.items.length-1)+')':''):L.food?foodName(L.food):L.pot?'Mikstura leczenia':'łup';pr.hidden=false;pr.innerHTML='<kbd>F</kbd> Zbierz: <b></b>';pr.querySelector('b').textContent=nm;if(L.items.length)pr.querySelector('b').style.color=RAR[L.items[0].rar].c}
}

function myWeapon(){const w=INV.eq.bron;return w?[w.base,w.rar,w.var||'',w.lk||0,w.sd||0]:['',0,'',0,0]}

// ---------- efekty: liczby obrażeń, paski HP ----------
const fx=$('fx');const fxs=[];const _p=new THREE.Vector3();
function fxNum(x,y,z,text,col){const el=document.createElement('div');el.className='num';el.textContent=text;el.style.color=col;fx.appendChild(el);fxs.push({el,x:x+rnd(-0.3,0.3),y,z:z+rnd(-0.3,0.3),t:0})}
const bars=new Map();
function barFor(key,cls){let b=bars.get(key);if(!b){b=document.createElement('div');b.className='ebar '+(cls||'');b.innerHTML='<span></span><i><b></b></i>';fx.appendChild(b);bars.set(key,b)}b.used=1;return b}
function project(x,y,z){_p.set(x,y,z).project(camera);if(_p.z>1)return null;return[(_p.x+1)/2*innerWidth,(1-_p.y)/2*innerHeight]}
function fxTick(dt){
  for(let i=fxs.length-1;i>=0;i--){const f=fxs[i];f.t+=dt;f.y+=dt*1.2;const s=project(f.x,f.y,f.z);if(!s||f.t>1){if(f.t>1){f.el.remove();fxs.splice(i,1);continue}f.el.style.display='none';continue}
    f.el.style.display='';f.el.style.transform=`translate(${s[0]}px,${s[1]}px) translate(-50%,-50%) scale(${1+Math.max(0,0.3-f.t)})`;f.el.style.opacity=1-Math.max(0,f.t-0.6)/0.4}
  for(const b of bars.values())b.used=0;
  for(const e of enemies.values()){if(e.st===2)continue;const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d>(e.pas?20:26))continue;
    const s=project(e.p.x,e.p.y+(EDEF[e.t].bh||(e.t==='golem'||e.t==='yeti'||e.t==='kolos'?2.9:1.9))*eSc(e),e.p.z);if(!s)continue;
    const b=barFor('e'+e.id,(e.pas?'pas':e.elite?'elite':'')+(e.rar?' er'+e.rar:''));const rn=e.rar?'★'.repeat(e.rar)+' '+ERAR[e.rar].n+' ':'';b.firstChild.textContent=rn+(e.pas?EDEF[e.t].n:(e.qn?e.qn:(e.elite?'Elitarny ':'')+EDEF[e.t].n)+' · poz. '+e.lvl);b.querySelector('b').style.width=(e.hp/e.max*100)+'%';b.style.transform=`translate(${s[0]}px,${s[1]}px) translate(-50%,-100%)`}
  for(const [id,r] of remotes){const lb=r.buf[r.buf.length-1];if(!lb||lb.h==null||!r.g.visible)continue;const s=project(r.g.position.x,r.g.position.y+2.15,r.g.position.z);if(!s)continue;
    const b=barFor('p'+id,'pl');b.firstChild.textContent='';b.querySelector('b').style.width=(lb.h*100)+'%';b.style.transform=`translate(${s[0]}px,${s[1]}px) translate(-50%,0)`}
  {const cl=[];if(PET&&PET.m.visible&&PET.max&&VH.mode!==3)cl.push(['cpet',PET,1.9*(EDEF[PET.t].sc||1)]);for(const f of FOL)if(f.m.visible&&f.max)cl.push(['c'+f.d.id,f,2.35]);for(const [k,o,hy] of cl){if(o.hp>=o.max-0.5&&nowS()-(o.hurtT||0)>4)continue;const s=project(o.p.x,o.p.y+hy,o.p.z);if(!s)continue;const b=barFor(k,'pl comp');b.firstChild.textContent='';b.querySelector('b').style.width=(Math.max(0,o.hp)/o.max*100)+'%';b.style.transform=`translate(${s[0]}px,${s[1]}px) translate(-50%,0)`}}
  npcMarks();
  for(const [k,b] of bars)if(!b.used){b.remove();bars.delete(k)}
}

// ---------- HUD, powiadomienia, ekwipunek ----------
function toast(t,c){const d=document.createElement('div');d.textContent=t;d.style.color=c||'#fff';$('toasts').appendChild(d);setTimeout(()=>d.remove(),3200);while($('toasts').children.length>5)$('toasts').firstChild.remove()}
function updHud(){updHud3();if(INV.pot!==renderHot.p){renderHot.p=INV.pot;renderHot()}$('hpb').style.width=(P2.hp/ST.hp*100)+'%';$('hpt').textContent=Math.ceil(P2.hp)+' / '+Math.round(ST.hp);$('pot').textContent=INV.pot;$('gold').textContent=INV.gold}
const invOpen=()=>!$('inv').hidden||!$('petsui').hidden;
let selItem=null;
// ---------- ikony przedmiotów: model 3D renderowany do obrazka (cache) ----------
const ICONS={};const MET=['#8a8f94','#9aa0a6','#a8b4c4','#9a8cc0','#d9b23a'];
function itemIcon(it){if(!it)return '';const key=it.base+'|'+(it.rar||0)+'|'+(it.mat||'')+'|'+(it.var||'')+'|'+(it.lk||0)+'|'+(it.sd||0);if(ICONS[key]!==undefined)return ICONS[key];
  let geo=null,weap=false;try{const b=itemBoxes(it);if(b)geo=boxes(b);else if(it.base==='luk'){const bg=bowGroup(it.rar||0,it.var,it.lk,it.sd);geo=bg.children[0].geometry;weap=true}else if(WEAP[it.base]){geo=weaponGeo(it.base,it.rar||0,it.var,it.lk,true,it.sd);weap=true}}catch(e){}
  const res=geo?renderIcon(geo,weap):'';if(res||!geo)ICONS[key]=res;return res}
function renderIcon(geo,weap){
  try{const S2=96;if(!portrRT)portrRT=new THREE.WebGLRenderTarget(128,128);
    const piv=new THREE.Group(),mesh=new THREE.Mesh(geo,decoMat);piv.add(mesh);geo.computeBoundingBox();const bb=geo.boundingBox,cx=(bb.min.x+bb.max.x)/2,cy=(bb.min.y+bb.max.y)/2,cz=(bb.min.z+bb.max.z)/2;
    mesh.position.set(-cx,-cy,-cz);const sz=Math.max(bb.max.x-bb.min.x,bb.max.y-bb.min.y,bb.max.z-bb.min.z);
    if(weap){piv.rotation.set(0,Math.PI/2,0);const o=new THREE.Group();o.add(piv);o.rotation.set(0.25,0,-0.78);portrScene.add(o);piv.userData.o=o}else{piv.rotation.set(0.35,-0.6,0);portrScene.add(piv)}
    portrCam.position.set(0,0,sz*2.1+0.3);portrCam.lookAt(0,0,0);const bg=portrScene.background;portrScene.background=null;
    renderer.setRenderTarget(portrRT);renderer.setClearColor(0x000000,0);renderer.clear();renderer.render(portrScene,portrCam);const px=new Uint8Array(128*128*4);renderer.readRenderTargetPixels(portrRT,0,0,128,128,px);renderer.setRenderTarget(null);renderer.setClearColor(0x000000,1);
    portrScene.remove(piv.userData.o||piv);portrScene.background=bg;
    const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),id=x.createImageData(128,128);for(let y=0;y<128;y++)id.data.set(px.subarray((127-y)*512,(128-y)*512),y*512);x.putImageData(id,0,0);
    const o2=document.createElement('canvas');o2.width=o2.height=S2;const y2=o2.getContext('2d');y2.shadowColor='rgba(0,0,0,.7)';y2.shadowBlur=4;y2.shadowOffsetY=2;y2.drawImage(c,0,0,S2,S2);return o2.toDataURL();
  }catch(e){return ''}}
// ---------- pasek szybkiego dostępu (1–8) ----------
function findItem(id){for(const k in INV.eq)if(INV.eq[k]&&INV.eq[k].id===id)return {it:INV.eq[k],eq:k};const i=INV.bag.findIndex(b=>b&&b.id===id);return i>=0?{it:INV.bag[i],bag:i}:null}
function useHot(i){const h=INV.hot[i];if(!h)return;
  if(h.k==='pot'){drinkPotion();renderHot();return}
  const f=findItem(h.id);if(!f){INV.hot[i]=null;renderHot();return}
  if(f.bag!=null){const it=f.it;if(it.slot==='tarcza'&&TWOH(INV.eq.bron)){toast('Tarczy nie użyjesz z bronią dwuręczną','#ff8a7a');return}const old=INV.eq[it.slot];INV.eq[it.slot]=it;INV.bag.splice(f.bag,1);if(old)INV.bag.push(old);if(it.slot==='bron'&&TWOH(it)&&INV.eq.tarcza){INV.bag.push(INV.eq.tarcza);delete INV.eq.tarcza;toast('Broń dwuręczna – tarcza wraca do plecaka','#cfe8ff')}toast('Założono: '+it.name,RAR[it.rar].c);afterInv()}
  renderHot()}
function renderHot(){const el=$('hotbar');if(!el||!INV.hot)return;let h='';
  for(let i=0;i<8;i++){const s=INV.hot[i];let inner='',cls='',tip='';
    if(s&&s.k==='pot'){inner=icHTML({base:'potion',rar:0})+`<small>${INV.pot}</small>`;tip='Mikstura leczenia';if(!INV.pot)cls=' dim'}
    else if(s){const f=findItem(s.id);if(f){inner=icHTML(f.it)+`<small>${f.it.lvl}</small>`;cls=' r'+f.it.rar+(f.eq?' on':'');tip=f.it.name}}
    h+=`<button class="hot${cls}" data-hot="${i}" title="${esc(tip)}"><kbd>${i+1}</kbd>${inner}</button>`}
  el.innerHTML=h;if(h.includes('class="ic ic-')&&(renderHot.n=(renderHot.n||0)+1)<8)setTimeout(renderHot,1500)}

function statLines(it){const l=[],u=1+0.1*(it.up||0);if(it.base==='latarnia')l.push(['Zasięg światła',LAMPR[it.rar]+' bl.']);if(it.dmg!=null)l.push(['Obrażenia',+(it.dmg*u).toFixed(1)]);if(it.spd!=null)l.push(['Szybkość',it.spd]);if(it.def)l.push(['Obrona',+(it.def*u).toFixed(1)]);if(it.hp)l.push(['Zdrowie',Math.round(it.hp*u)]);for(const k in BONUS)if(it[k])l.push([BONUS[k][0],it[k]+BONUS[k][1]]);if(it.gem)l.push([GEMS[it.gem][0],gemTxt(it)]);if(it.ench&&ENCH[it.ench])l.push(['Zaklęcie',ENCH[it.ench].n+' – '+ENCH[it.ench].d]);if(it.lk!=null&&LKNAME[it.slot])l.push(['Wygląd',LKNAME[it.slot][it.lk||0]]);if(it.lk!=null&&ACCN[it.slot])l.push(['Wygląd',ACCN[it.slot][it.lk||0]]);return l}
function itemHTML(it,cmp){
  const c=cmp?Object.fromEntries(statLines(cmp)):{};
  const sb=it.mat&&SETB[it.mat],sc=sb?setCounts()[it.mat]||0:0;
  return `<h3 style="color:${RAR[it.rar].c}">${esc(it.name)}${it.up?' +'+it.up:''}${it.gem?` <span class="gem" style="background:${GEMS[it.gem][1]}"></span>`:''}</h3><p class="sub2">${RAR[it.rar].n} · poziom ${it.lvl}${it.slot==='bron'?' · '+WEAP[it.base].n+(TWOH(it)?' · <b style="color:#ffb050">dwuręczna</b>':' · jednoręczna'):''}</p><table>`+statLines(it).map(([k,v])=>{const o=parseFloat(c[k]);const dv=cmp&&!isNaN(o)?parseFloat(v)-o:null;return `<tr><td>${k}</td><td>${v}${dv?` <em class="${dv>0?'up':'dn'}">${dv>0?'▲ +':'▼ '}${dv.toFixed(1)}</em>`:''}</td></tr>`}).join('')+'</table>'+
   (sb?`<div class="setinfo"><b>${sb[0]}</b> (${sc}/4)${sb[1].map(([n,t])=>`<div class="${sc>=n?'on':''}">${n} cz.: ${t}</div>`).join('')}</div>`:'')+(cmp===undefined?'':'');
}
function icHTML(it){const s=itemIcon(it);return s?`<img class="icimg" src="${s}" alt="" draggable="false">`:`<span class="ic ic-${it.base}"></span>`}
function slotBox(it,attrs){return `<button class="slot r${it?it.rar:'x'}" ${attrs}${it?` draggable="true" data-iid="${it.id}"`:''}>${it?`${icHTML(it)}<small>${it.lvl}</small>${it.slot==='bron'&&TWOH(it)?'<i class="h2">2H</i>':''}`:''}</button>`}
function renderInv(){
  ST=stats();
  $('eqs').innerHTML=SLOTS.map(([k,n])=>`<div class="eqrow">${slotBox(INV.eq[k],`data-eq="${k}" aria-label="${n}"`)}<span>${n}</span></div>`).join('');
  let g='';for(let i=0;i<bagN();i++)g+=slotBox(INV.bag[i],`data-bag="${i}"`);$('bag').innerHTML=g;$('bagn').textContent=INV.bag.length+'/'+bagN();
  $('sumstats').innerHTML=[['Pasywki',(HERO.pas||[]).map(k=>PASS.find(p=>p[0]===k)[1]).join(', ')||'–'],['Poziom',HERO.lvl],['Zdrowie',Math.round(ST.hp)],['Obrona',ST.def.toFixed(1)],['Obrażenia',ST.dmg.toFixed(1)],['Szybkość ataku',(ST.spd*(1+ST.haste/100)).toFixed(2)],['Krytyk',ST.crit.toFixed(1)+'%'],['Regeneracja',ST.regen.toFixed(1)+'/s'],...Object.entries(setCounts()).filter(([k,n])=>n>=2).map(([k,n])=>[SETB[k][0],n+'/4 · '+SETB[k][1].filter(b=>n>=b[0]).map(b=>b[1]).join(', ')])].map(([a,b])=>`<tr><td>${a}</td><td>${b}</td></tr>`).join('');
  $('invgold').textContent=INV.gold;$('invpot').textContent=INV.pot;$('pets').innerHTML=petsHTML();
  const d=$('detail');
  if(!selItem){d.innerHTML='<p class="sub2">Kliknij przedmiot, żeby zobaczyć szczegóły.</p>';return}
  const it=selItem.src==='eq'?INV.eq[selItem.k]:INV.bag[selItem.k];if(!it){selItem=null;return renderInv()}
  const cmp=selItem.src==='bag'?INV.eq[it.slot]:null;
  d.innerHTML=itemHTML(it,cmp)+(cmp?`<p class="sub2">Porównanie z: <span style="color:${RAR[cmp.rar].c}">${esc(cmp.name)}</span></p>`:'')+
   `<div class="btns">${selItem.src==='bag'?'<button class="pri" id="iequip">Załóż</button>':'<button id="iunequip">Zdejmij</button>'}<button id="isell">Rozbierz (+${Math.round(it.lvl*1.2*(it.rar+1))} zł.)</button></div><p class="sub2" style="margin-top:10px">Na pasek szybkiego dostępu:</p><div class="hotasg">${[1,2,3,4,5,6,7,8].map(i=>`<button data-hasg="${i-1}"${INV.hot[i-1]&&INV.hot[i-1].id===it.id?' class="on"':''}>${i}</button>`).join('')}</div>`;
  const q=id=>document.getElementById(id);
  q('iequip')&&(q('iequip').onclick=()=>{if(it.slot==='tarcza'&&TWOH(INV.eq.bron)){toast('Tarczy nie użyjesz z bronią dwuręczną','#ff8a7a');return}const old=INV.eq[it.slot];INV.eq[it.slot]=it;INV.bag.splice(selItem.k,1);if(old)INV.bag.push(old);if(it.slot==='bron'&&TWOH(it)&&INV.eq.tarcza){INV.bag.push(INV.eq.tarcza);delete INV.eq.tarcza;toast('Broń dwuręczna – tarcza wraca do plecaka','#cfe8ff')}selItem={src:'eq',k:it.slot};afterInv()});
  q('iunequip')&&(q('iunequip').onclick=()=>{if(INV.bag.length>=bagN())return toast('Plecak pełny','#ff8a7a');INV.bag.push(it);delete INV.eq[selItem.k];selItem=null;afterInv()});
  d.querySelectorAll('[data-hasg]').forEach(b=>b.onclick=()=>{const i=+b.dataset.hasg;for(let k=0;k<8;k++)if(INV.hot[k]&&INV.hot[k].id===it.id)INV.hot[k]=null;INV.hot[i]={k:'item',id:it.id};saveInv();renderHot();renderInv()});
  q('isell').onclick=()=>{INV.gold+=Math.round(it.lvl*1.2*(it.rar+1));if(selItem.src==='eq')delete INV.eq[selItem.k];else INV.bag.splice(selItem.k,1);selItem=null;afterInv()};
}
function afterInv(){setTimeout(renderHot,0);const hpR=P2.hp/ST.hp;ST=stats();P2.hp=Math.min(ST.hp,Math.max(1,hpR*ST.hp));saveInv();const w=myWeapon();setWeapon(meRef,w[0],w[1],w[2],w[3],w[4]);renderInv();updHud()}
$('eqs').onclick=e=>{const b=e.target.closest('[data-eq]');if(b&&INV.eq[b.dataset.eq]){selItem={src:'eq',k:b.dataset.eq};renderInv()}};
$('bag').onclick=e=>{const b=e.target.closest('[data-bag]');if(b&&INV.bag[+b.dataset.bag]){selItem={src:'bag',k:+b.dataset.bag};renderInv()}};
$('bag').ondblclick=e=>{const b=e.target.closest('[data-bag]');if(b&&INV.bag[+b.dataset.bag]){selItem={src:'bag',k:+b.dataset.bag};renderInv();const q=document.getElementById('iequip');q&&q.click()}};
function toggleInv(){const v=$('inv');v.hidden=!v.hidden;if(!v.hidden){try{document.exitPointerLock()}catch(e){}renderInv()}}
$('bagsort').onclick=()=>{const so=SLOTS.map(s=>s[0]);INV.bag.sort((a,b)=>so.indexOf(a.slot)-so.indexOf(b.slot)||b.rar-a.rar||b.lvl-a.lvl);selItem=null;saveInv();renderInv()};
$('bagjunk').onclick=()=>{const isHot=it=>INV.hot.some(h=>h&&h.id===it.id);let n=0,g=0;INV.bag=INV.bag.filter(it=>{if(it.rar===0&&!isHot(it)){n++;g+=Math.round(it.lvl*1.2);return false}return true});INV.gold+=g;selItem=null;saveInv();renderInv();updHud();toast(n?`Rozebrano ${n} zwykłych przedmiotów: +${g} zł`:'Brak zwykłych przedmiotów w plecaku',n?'#ffd34d':'#ff8a7a');if(n)sfx('coin')};
// podpowiedź z porównaniem po najechaniu
{const tip=$('itip');const show=(it,cmp,e)=>{tip.innerHTML=itemHTML(it,cmp)+(cmp?`<p class="sub2">▲▼ względem założonego: <span style="color:${RAR[cmp.rar].c}">${esc(cmp.name)}</span></p>`:'');tip.hidden=false;const r=tip.getBoundingClientRect();let x=e.clientX+18,y=e.clientY+12;if(x+r.width>innerWidth-8)x=e.clientX-r.width-18;if(y+r.height>innerHeight-8)y=innerHeight-r.height-8;tip.style.left=x+'px';tip.style.top=Math.max(8,y)+'px'};
  addEventListener('mousemove',e=>{const b=e.target.closest&&e.target.closest('[data-bag],[data-eq],[data-shop]');if(!b){tip.hidden=true;return}let it=null,cmp=null;if(b.dataset.bag!=null){it=INV.bag[+b.dataset.bag];if(it)cmp=INV.eq[it.slot]||null}else if(b.dataset.eq!=null)it=INV.eq[b.dataset.eq];if(!it){tip.hidden=true;return}show(it,cmp,e)})}
$('invbtn').onclick=toggleInv;$('invclose').onclick=toggleInv;

function syncEnemies(list){
  const ids=new Set(),t=performance.now();
  for(const a of list){const [id,ty,lvl,el,x,y,z,ry,hp,max,st,fl,sl,qn,qid,sid,tr,tgi]=a;ids.add(id);let e=enemies.get(id);
    if(e)e.tgId=tgi;if(!e){e={id,t:ty,lvl,elite:!!(el&1),rar:el>>1,tgId:tgi,p:new THREE.Vector3(x,y,z),ry,hp,max,st,flash:0,speed:0,buf:[],torch:!!tr};addEnemyModel(e);enemies.set(id,e)}
    e.buf.push({t,p:[x,y,z],ry,hp,max,st});if(e.buf.length>20)e.buf.shift();if(fl)e.flash=Math.max(e.flash,0.6);e.sl=sl;e.qn=qn||null;e.qid=qid||null;e.sid=sid||null}
  for(const id of [...enemies.keys()])if(!ids.has(id))removeEnemy(id);
}
const hreq=new Set();
function hostHmaps(){
  if(NET.role!=='host')return;const need=new Set();
  for(const r of remotes.values()){const b=r.buf[r.buf.length-1];if(!b)continue;const cx=Math.floor(b.p[0]/C),cz=Math.floor(b.p[2]/C);
    for(let dz=-2;dz<=2;dz++)for(let dx=-2;dx<=2;dx++)need.add(K(cx+dx,cz+dz))}
  for(const k of need){if(chunks.has(k)&&chunks.get(k).heights)continue;if(hcache.has(k)||hreq.has(k))continue;const [cx,cz]=k.split(',').map(Number);
    const w=workers.reduce((a,b)=>a.busy<=b.busy?a:b);if(w.busy>=3)break;w.busy++;hreq.add(k);w.postMessage({type:'hmap',seed:S.seed,id:reqId++,cx,cz,lod:4})}
  for(const k of [...hcache.keys()])if(!need.has(k))hcache.delete(k);
}
{const w=myWeapon();setWeapon(meRef,w[0],w[1],w[2],w[3],w[4]);updHud()}
// =================== ETAP 3: klasy, doświadczenie, poziomy, perki (logika) ===================
function cdFor(s){const c=CLS[abilSet()];if(!c)return 1;let cd=c[s].cd*(1-0.08*pk(s))*(1-0.05*pk('mistrz'));if(hasP('uczony'))cd*=0.85;return cd}
const abilMul=s=>1+0.12*pk(s);
const facing=()=>Math.atan2(-Math.sin(yaw),-Math.cos(yaw));
function rollDmg(base){const crit=Math.random()*100<ST.crit;let d=base*(crit?2+0.1*pk('cios'):1);if(P3.stealth>0){d*=2;P3.stealth=0;setGhost(meRef,false)}return[d,crit]}
function dealHit(e,dmg,crit,kx,kz,slow,stun){const src=HIT_SRC;if(!src&&P3.sneak&&!EDEF[e.t].boss&&(isAuth()?e.tgId!==NET.id:!(e.cHit>nowS()-6))){dmg*=2.5;crit=true;fxNum(e.p.x,e.p.y+2.4*eSc(e),e.p.z,'Z ukrycia!','#b8e0ff');sfx('crit',0.7)}try{if(HGEAR[e.t]&&Math.random()<0.7)sfx('clang',0.45);else if(e.t==='golem'||e.t==='kolos')sfx('thud',0.6)}catch(_){}
  if(e.car||e.t==='woz')return;
  {const hy=e.p.y+1.1*eSc(e);PFX.emit(e.p.x,hy,e.p.z,crit?16:8,BLOODC(e.t),{sp:crit?5:3.5,life:0.55,size:crit?0.12:0.09,dx:kx*2,dz:kz*2});PFX.emit(e.p.x,hy,e.p.z,crit?10:4,crit?['#fff2a0','#ffd34d','#ffffff']:['#ffffff','#fff2c0'],{sp:crit?7:5,life:0.22,size:0.05,g:2,up:0.5})}
  if(!EDEF[e.t].passive)skGain(ST.ranged?'strzel':'walka',1);
  e.mark=nowS();sfx(crit?'crit':'hit');
  if(pk('wampir')&&!P2.dead)P2.hp=Math.min(ST.hp,P2.hp+dmg*0.02*pk('wampir'));
  fxNum(e.p.x,e.p.y+1.8*eSc(e),e.p.z,(crit?'✦':'')+Math.round(dmg),crit?'#ffd34d':'#fff');e.flash=1;
  if(stun)e.stunV=stun;if(isAuth())applyHit(e.id,dmg,kx,kz,NET.id,slow,stun,src);else{e.cHit=nowS();NET.tr.send({t:'hit',from:NET.id,eid:e.id,dmg,k:[kx,kz],slow:slow||0,stun:stun||0,src})}
  P2.lastHurt=Math.max(P2.lastHurt,nowS()-2);
}
function sendFx(o){if(NET.tr)NET.tr.send({t:'fx',from:NET.id,...o})}
function showFx(m){
  if(m.k==='bolt'){boltFx(m.pts);return}
  if(m.k==='toast'){toast(m.txt,m.col);return}
  if(m.k==='evt'){toast(m.txt,m.col);if(m.mk)MARKS.set('evt',{x:m.mk[0],z:m.mk[1],n:m.mk[2],col:'#ffd34d',evt:1});else MARKS.delete('evt');return}
  if(m.k==='evrw'){if(m.to===NET.id)giveEvReward(m.gold,m.xp,m.txt);return}
  if(m.k==='wkup'){addWanderer(m.d);return}
  if(m.k==='wkupx'){removeWanderer(m.id);return}
  if(m.k&&FXH[m.k]){FXH[m.k](m);return}if(m.k==='proj')spawnProj(m.kind,m.o,m.d,false,0,{aoe:m.aoe,h:m.h,sm:m.sm||1,ench:m.en||0});else if(m.k==='ring')ringFx(m.p[0],m.p[1],m.p[2],m.r,m.kind);else if(m.k==='tele')teleFx(m.p[0],m.p[1],m.p[2],m.r,m.t)}

// ---------- pociski ----------
const PROJ={
 arrow:{spd:80,g:4.2,life:4.2,geo:()=>boxes([[0,0,0,0.05,0.05,0.75,'#7a5a3a'],[0,0,0.38,0.08,0.08,0.1,'#cfd6dc'],[0,0,-0.33,0.14,0.02,0.14,'#f2f2f2']])},
 bolt:{spd:42,g:0,life:2.6,geo:()=>boxes([[0,0,0,0.32,0.32,0.32,'#a8d8ff'],[0,0,-0.25,0.16,0.16,0.3,'#5aa6ff']])},
 fire:{spd:32,g:1.6,life:3.2,geo:()=>boxes([[0,0,0,0.52,0.52,0.52,'#ff8a2e'],[0,0,0,0.32,0.66,0.32,'#ffd34d'],[0,0,-0.35,0.25,0.25,0.4,'#ff5a1a']])},
};
const EBIG={golem:1.15,yeti:1.05};
const projGeo={}, projMat=new THREE.MeshBasicMaterial({vertexColors:true}), projs=[];
function spawnProj(kind,o,d,mine,dmg,opt){
  const P=PROJ[kind];if(!P)return;const m=new THREE.Mesh(projGeo[kind]||(projGeo[kind]=P.geo()),projMat);
  m.position.set(o[0],o[1],o[2]);scene.add(m);const sm=(opt&&opt.sm)||1;projs.push({m,kind,v:[d[0]*P.spd*sm,d[1]*P.spd*sm,d[2]*P.spd*sm],life:P.life,mine,dmg,opt:opt||{},hit:new Set()});
}
function aimDir(){
  const cp=Math.cos(pitch),fx=-Math.sin(yaw)*cp,fy=-Math.sin(pitch),fz=-Math.cos(yaw)*cp,c=camera.position;
  const o=[player.p.x,player.p.y+1.35,player.p.z];let dx=c.x+fx*120-o[0],dy=c.y+fy*120-o[1],dz=c.z+fz*120-o[2];const l=Math.hypot(dx,dy,dz)||1;
  return{o,d:[dx/l,dy/l,dz/l]};
}
function shootFromMe(kind,dmg,spread,opt){
  if(kind==='arrow'&&pk('sokol')){opt=Object.assign({},opt||{});opt.sm=(opt.sm||1)*(1+0.08*pk('sokol'))}
  const a=aimDir();const cs=Math.cos(spread),sn=Math.sin(spread);const d=[a.d[0]*cs+a.d[2]*sn,a.d[1],-a.d[0]*sn+a.d[2]*cs];
  player.ry=Math.atan2(d[0],d[2]);meRef.rotation.y=player.ry;
  spawnProj(kind,a.o,d,true,dmg,opt);sendFx({k:'proj',kind,o:a.o,d,aoe:opt&&opt.aoe||0,sm:opt&&opt.sm||1,en:opt&&opt.ench||0});
}
function projTick(dt){
  for(let i=projs.length-1;i>=0;i--){const pr=projs[i],P=PROJ[pr.kind],p=pr.m.position;
    pr.v[1]-=P.g*dt;p.x+=pr.v[0]*dt;p.y+=pr.v[1]*dt;p.z+=pr.v[2]*dt;pr.life-=dt;
    pr.m.rotation.y=Math.atan2(pr.v[0],pr.v[2]);pr.m.rotation.x=-Math.atan2(pr.v[1],Math.hypot(pr.v[0],pr.v[2]));
    {const tc={arrow:['#e8e0c8','#c8c0a8'],bolt:['#8ab0ff','#c8d8ff','#ffffff'],fire:['#ff7a1a','#ffb030','#ffe080'],frost:['#bfe8ff','#ffffff'],curse:['#a060ff','#6a2aa8'],poison:['#7ad15a','#3a8a2a']}[pr.kind]||['#ffffff'];if(Math.random()<(pr.kind==='arrow'?0.5:1))PFX.emit(p.x,p.y,p.z,pr.kind==='arrow'?1:2,tc,{sp:0.4,up:0.2,life:pr.kind==='arrow'?0.25:0.4,size:pr.kind==='arrow'?0.04:0.08,g:pr.kind==='arrow'?1:-0.5})}
    let done=pr.life<=0,stick=false;const h=colAt(p.x,p.z,p.y);if(h!==null&&p.y<h){done=true;stick=!done||pr.life>0}else if(!done&&!SPC&&solidAt(p.x,p.y,p.z)){done=true;stick=true;PFX.emit(p.x,p.y,p.z,4,['#c8b89a','#8a7a64'],{sp:1.5,life:0.3,size:0.05})}
    if(pr.opt.ench&&ENCH[pr.opt.ench]&&Math.random()<0.8)PFX.emit(p.x,p.y,p.z,pr.opt.ench==='ogien'||pr.opt.ench==='wybuch'?3:1,ENCH[pr.opt.ench].fx,{sp:0.6,up:0.5,life:0.35,size:0.09,g:-1});
    if(!done&&pr.opt.h){for(const pp of playersList()){if(pp.dead)continue;if(Math.hypot(pp.p.x-p.x,pp.p.z-p.z)<0.75&&p.y>pp.p.y-0.2&&p.y<pp.p.y+2.1){if(pr.opt.dmg&&isAuth())hurtPlayer(pp.id,pr.opt.dmg,{p:{x:pr.opt.src[0],z:pr.opt.src[1]}});done=true;break}}}
    else if(!done)for(const e of enemies.values()){if(e.st===2||pr.hit.has(e.id))continue;const r=EDEF[e.t].bodyR?Math.max(1,eBody(e)*0.8):EDEF[e.t].huge||EDEF[e.t].giant?Math.max(1,eSc(e)*0.55):eSc(e)*(EBIG[e.t]||0.7);
      {const ih=eHitSeg(e,p.x-pr.v[0]*dt,p.y-pr.v[1]*dt,p.z-pr.v[2]*dt,p.x,p.y,p.z,0.22);if(!(ih===null?(Math.hypot(e.p.x-p.x,e.p.z-p.z)<r+0.25&&p.y>e.p.y-0.3&&p.y<e.p.y+r*2.6+0.4):ih))continue}{
        if(pr.mine&&!pr.opt.aoe){const[dm,cr]=rollDmg(pr.dmg);const l=Math.hypot(pr.v[0],pr.v[2])||1;let stun=0;const sv=pr.opt.sv;if(sv){const n=(sv.hits.get(e.id)||0)+1;sv.hits.set(e.id,n);if(n>=3){stun=2.5;fxNum(e.p.x,e.p.y+2.6*eSc(e),e.p.z,'OGŁUSZENIE','#ffe066')}}if(pr.opt.src&&!pr.opt.src.startsWith)HIT_SRC=null;HIT_SRC=pr.opt.src||null;const[dm2,cr2]=pr.opt.src?[pr.dmg,false]:[dm,cr];dealHit(e,dm2,cr2,pr.v[0]/l,pr.v[2]/l,0,stun);HIT_SRC=null;if(pr.opt.ench&&!pr.opt.src&&pr.opt.ench!=='wybuch')encHit(e,dm2,pr.opt.ench)}
        pr.hit.add(e.id);if(!pr.opt.pierce){done=true;break}}}
    if(done){if(pr.opt.aoe){if(pr.mine)aoe(p.x,p.y,p.z,pr.opt.aoe,pr.dmg,0,'fire');else ringFx(p.x,p.y,p.z,pr.opt.aoe,'fire');if(pr.kind==='fire'){boomFx(p.x,Math.max(p.y,(h??p.y)),p.z,pr.opt.aoe);if(pr.mine)terrainBlast(p.x,Math.max(p.y,(h??p.y)),p.z,pr.opt.aoe*0.8,true)}}
      else if(pr.kind==='fire'&&pr.life>0){boomFx(p.x,Math.max(p.y,(h??p.y)),p.z,1.6);if(pr.mine)terrainBlast(p.x,Math.max(p.y,(h??p.y)),p.z,1.6,true)}
      else if(pr.kind==='bolt'&&pr.mine&&stick)terrainBlast(p.x,Math.max(p.y,(h??p.y)),p.z,1.15,true);
      if(pr.opt.ench==='wybuch'&&pr.life>0){boomFx(p.x,p.y,p.z,2.6);if(pr.mine){aoe(p.x,p.y,p.z,2.8,pr.dmg*0.7,0,'fire');terrainBlast(p.x,p.y,p.z,2.0,true)}}else if(pr.opt.ench==='ogien'&&stick)PFX.emit(p.x,p.y,p.z,10,ENCH.ogien.fx,{sp:1.5,up:1.5,life:0.6,size:0.1,g:-2});
      if(stick&&pr.kind==='arrow'&&pr.opt.ench!=='wybuch'){const l=Math.hypot(pr.v[0],pr.v[1],pr.v[2])||1;p.x-=pr.v[0]/l*0.22;p.y-=pr.v[1]/l*0.22;p.z-=pr.v[2]/l*0.22;STUCK.push(pr.m);if(STUCK.length>20)scene.remove(STUCK.shift())}else scene.remove(pr.m);projs.splice(i,1)}
  }
}
function aoe(x,y,z,r,dmg,slow,kind){
  ringFx(x,y,z,r,kind);sendFx({k:'ring',p:[x,y,z],r,kind});
  for(const e of enemies.values()){if(e.st===2)continue;const dx=e.p.x-x,dz=e.p.z-z,d=Math.hypot(dx,dz);if(eDist(e,x,z)>r+0.3||!eYOk(e,y-1,2,3))continue;
    const[dm,cr]=rollDmg(dmg*rnd(0.9,1.1));dealHit(e,dm,cr,d>0.1?dx/d:0,d>0.1?dz/d:0,slow)}
}
const PFX=(()=>{const N=1400,im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xffffff}),N);im.frustumCulled=false;im.renderOrder=3;scene.add(im);
  const P=[],M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),V=new THREE.Vector3(),C=new THREE.Color();for(let i=0;i<N;i++){P.push({life:0,vis:1});C.set('#ffffff');im.setColorAt(i,C)}let nx=0;
  return{emit(x,y,z,n,col,o){o=o||{};for(let k=0;k<n;k++){const p=P[nx];nx=(nx+1)%N;const sp=o.sp??4,a=Math.random()*6.283,b=Math.random()*1.3-0.25;p.x=x+(Math.random()-0.5)*(o.r||0.2);p.y=y+(Math.random()-0.5)*(o.r||0.2);p.z=z+(Math.random()-0.5)*(o.r||0.2);
      p.vx=Math.cos(a)*Math.cos(b)*sp*(0.3+Math.random()*0.7)+(o.dx||0);p.vy=Math.sin(b)*sp*(0.4+Math.random()*0.8)+(o.up??1.2);p.vz=Math.sin(a)*Math.cos(b)*sp*(0.3+Math.random()*0.7)+(o.dz||0);p.max=p.life=(o.life||0.5)*(0.6+Math.random()*0.7);p.s=(o.size||0.09)*(0.6+Math.random()*0.8);p.g=o.g??9;p.dr=o.drag||0;
      C.set(Array.isArray(col)?col[Math.floor(Math.random()*col.length)]:col);im.setColorAt(nx===0?N-1:nx-1,C);if(im.instanceColor)im.instanceColor.needsUpdate=true}},
    tick(dt){for(let i=0;i<N;i++){const p=P[i];if(p.life<=0){if(p.vis){p.vis=0;S.set(0,0,0);M.compose(V.set(0,-999,0),Q,S);im.setMatrixAt(i,M)}continue}p.vis=1;p.life-=dt;p.vy-=p.g*dt;if(p.dr){const k=Math.max(0,1-p.dr*dt);p.vx*=k;p.vy*=k;p.vz*=k}p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;
      const k=Math.max(0,p.life/p.max);S.setScalar(p.s*(0.25+0.75*k));M.compose(V.set(p.x,p.y,p.z),Q,S);im.setMatrixAt(i,M)}im.instanceMatrix.needsUpdate=true}}})();
const BLOODC=t=>/szkielet|lucznik_s|krol_s|lich|upior|mumia|faraon/.test(t)?['#e8e2cc','#cfc8b0','#a8a090']:/slime/.test(t)?['#7ad15a','#a8f080']:/golem|kolos/.test(t)?['#8a8a90','#6a6a70','#b0b0b8']:/zywiolak/.test(t)?['#ffb030','#ff6a1a']:/drzewiec|prastary/.test(t)?['#6b4a2b','#5a9a4a']:['#b8202a','#8a1018','#d8303a'];
const ringGeo=new THREE.RingGeometry(0.82,1,48), rings=[];
function boltFx(pts){for(const p of pts.slice(1))PFX.emit(p[0],p[1],p[2],10,['#cfefff','#ffffff','#8fd8ff'],{sp:5,life:0.3,size:0.06,g:1});const P=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];for(let k=0;k<6;k++){const t0=k/6,t1=(k+1)/6,j=k?0.45:0,j1=k<5?0.45:0;P.push(a[0]+(b[0]-a[0])*t0+(Math.random()-0.5)*j,a[1]+(b[1]-a[1])*t0+(Math.random()-0.5)*j,a[2]+(b[2]-a[2])*t0+(Math.random()-0.5)*j);P.push(a[0]+(b[0]-a[0])*t1+(Math.random()-0.5)*j1,a[1]+(b[1]-a[1])*t1+(Math.random()-0.5)*j1,a[2]+(b[2]-a[2])*t1+(Math.random()-0.5)*j1)}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));const l=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:0xcfefff,transparent:true,opacity:1,fog:false}));scene.add(l);
  for(const p of pts.slice(1))ringFx(p[0],p[1]-1.2,p[2],1.2,'frost');setTimeout(()=>{scene.remove(l);g.dispose();l.material.dispose()},260)}
const RINGC={fire:0xff7a1a,frost:0x8fe9ff,war:0xff5040,lvl:0xffd34d,smoke:0x9a8fb0};
function ringFx(x,y,z,r,kind){{const col={fire:['#ff7a1a','#ffb030','#ffe080'],frost:['#bfe8ff','#ffffff','#8fd8ff'],war:['#ff6040','#ffd0a0','#c8c0b0'],lvl:['#ffd34d','#fff2a0','#ffffff'],smoke:['#9a8fb0','#6a6070','#c8c0d8']}[kind]||['#ffffff'];const n=Math.min(48,Math.round(r*8));for(let i=0;i<n;i++){const a=i/n*6.283;PFX.emit(x+Math.cos(a)*r*0.8,y+0.3,z+Math.sin(a)*r*0.8,1,col,{sp:1.5,up:kind==='smoke'?1:2.2,life:0.6,size:0.1,g:kind==='smoke'?-0.5:4,dx:Math.cos(a)*2,dz:Math.sin(a)*2})}}const m=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:RINGC[kind]||0xffffff,transparent:true,opacity:0.85,side:THREE.DoubleSide,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,y+0.2,z);scene.add(m);rings.push({m,r,t:0})}
function ringTick(dt){for(let i=rings.length-1;i>=0;i--){const g=rings[i];g.t+=dt;const k=Math.min(1,g.t/(g.dur||0.45));if(g.tele){g.tele.scale.setScalar(Math.max(0.01,k*g.r));if(k>=1){scene.remove(g.m);g.m.traverse(o=>o.material&&o.material.dispose());rings.splice(i,1)}continue}g.m.scale.setScalar(0.3+k*g.r);g.m.material.opacity=0.85*(1-k);if(k>=1){scene.remove(g.m);g.m.material.dispose();rings.splice(i,1)}}}

// ---------- niewidzialność (wygląd) ----------
const ghostMat=new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,opacity:0.28,depthWrite:false});
function setGhost(g,on){if(!g||!!g.userData.ghost===on)return;g.userData.ghost=on;g.traverse(o=>{if(!o.isMesh)return;if(on){o.userData.m0=o.material;o.material=ghostMat}else if(o.userData.m0){o.material=o.userData.m0;o.userData.m0=null}})}

// ---------- umiejętności ----------
function useAbility(s){
  const set=abilSet(),c=CLS[set];if(!c||P2.dead||!player.ready||P3[s]>0||invOpen()||uiOpen())return;
  if(VH.mode===3)VH.mode=0;if(VH.mode===5||VH.mode===6)dismountOwn(1);if(VH.mode===1)return;
  const fy=facing(),fx=Math.sin(fy),fz=Math.cos(fy),base=ST.dmg*abilMul(s);let ok=true;
  const hitAround=(r,mult,kb,stun)=>{let n=0;for(const e of enemies.values()){if(e.st===2||e.car)continue;const dx=e.p.x-player.p.x,dz=e.p.z-player.p.z,d=Math.hypot(dx,dz);if(eDist(e,player.p.x,player.p.z)>r+0.3||!eYOk(e,player.p.y,1.9,1.2))continue;const[dm,cr]=rollDmg(base*mult*rnd(0.9,1.1));dealHit(e,dm,cr,(d?dx/d:0)*kb,(d?dz/d:0)*kb,0,stun);n++}return n};
  const fxR=(r,k)=>{ringFx(player.p.x,player.p.y,player.p.z,r,k);sendFx({k:'ring',p:[player.p.x,player.p.y,player.p.z],r,kind:k})};
  switch(s==='e'&&E_OF[set]?E_OF[set]+'e':set+s){
    case 'halabardnikq':player.ry=fy;hitAround(4.2,1.7,3,0);fxR(4.2,'war');sfx('swing');P2.atkT=0.35;break;
    case 'wlocznikq':{player.ry=fy;for(const e of enemies.values()){if(e.st===2||e.car)continue;const np=eNear(e,player.p.x+fx*3.5,player.p.z+fz*3.5),dx=np[0]-player.p.x,dz=np[1]-player.p.z,al=dx*fx+dz*fz,pp=Math.abs(dx*fz-dz*fx);if(al>-0.5&&al<7.5&&pp<1.4&&eYOk(e,player.p.y,1.9,1.2)){const[dm,cr]=rollDmg(base*2.0);dealHit(e,dm,cr,fx*1.5,fz*1.5)}}
      for(let k=1;k<=4;k++){const x=player.p.x+fx*k*1.6,z=player.p.z+fz*k*1.6;ringFx(x,player.p.y,z,0.7,'war');sendFx({k:'ring',p:[x,player.p.y,z],r:0.7,kind:'war'})}sfx('swing');P2.atkT=0.3;break}
    case 'mlotnikq':player.ry=fy;hitAround(4.5,1.6,1.5,1.5);fxR(4.5,'war');fxR(2.5,'smoke');sfx('crit');P2.atkT=0.4;break;
    case 'topornikq':P3.wir={t:1.2,tick:0};break;
    case 'szermierzq':P3.lunge={t:0.22,dir:[fx,fz],set:new Set()};player.ry=fy;sfx('swing');break;
    case 'kusznikq':player.ry=fy;shootFromMe('arrow',base*2.8,0,{pierce:1,sm:1.4});sfx('bow');P2.atkT=0.3;break;
    case 'czarodziejq':{const pts=[[player.p.x,player.p.y+1.4,player.p.z]],hit=new Set();let cur={p:player.p},mul=1.8,rng=16;
      for(let j=0;j<5;j++){let best=null,bd=rng;for(const e of enemies.values()){if(e.st===2||e.car||hit.has(e.id))continue;const d=Math.hypot(e.p.x-cur.p.x,e.p.z-cur.p.z);if(d<bd&&Math.abs(e.p.y-cur.p.y)<5){bd=d;best=e}}
        if(!best)break;hit.add(best.id);const[dm,cr]=rollDmg(base*mul);dealHit(best,dm,cr,0,0,1.2);pts.push([best.p.x,best.p.y+1.2,best.p.z]);cur=best;mul*=0.85;rng=8}
      if(pts.length<2){toast('Brak wroga w zasięgu','#ff8a7a');ok=false;break}boltFx(pts);sendFx({k:'bolt',pts});sfx('crit');P2.atkT=0.28;break}
    case 'wojownikq':P3.charge=0.36;P3.chargeSet=new Set();P3.chargeDir=[fx,fz];player.ry=fy;break;
    case 'wojownike':P3.buff=8*(1+0.1*pk('e'));ringFx(player.p.x,player.p.y,player.p.z,3,'war');sendFx({k:'ring',p:[player.p.x,player.p.y,player.p.z],r:3,kind:'war'});toast('Okrzyk bojowy!',c.col);break;
    case 'lucznikq':shootFromMe('arrow',base*2.2,0,{pierce:1});P2.bowD=0.3;P2.bowT=0.03;P2.bowShot=true;P2.atkT=0.3;break;
    case 'lucznike':{const k=P3.salvoK??1;P3.salvoK=null;P3.salvo={left:3,hits:new Map(),dmg:base*0.95*(0.3+0.7*k),sm:0.4+0.6*k,id:Math.random()};P2.bowT=0;if(k>=0.98)toast('Pełne naciągnięcie!','#ffd34d');break}
    case 'magq':shootFromMe('fire',base*2.2,0,{aoe:3.5});P2.atkT=0.28;break;
    case 'mage':aoe(player.p.x,player.p.y,player.p.z,6,base*1.2,4*(1+0.1*pk('e')),'frost');break;
    case 'lotrzykq':{let best=null,bd=14;for(const e of enemies.values()){if(e.st===2)continue;const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d<bd&&Math.abs(e.p.y-player.p.y)<5){bd=d;best=e}}
      if(!best){toast('Brak wroga w pobliżu','#ff8a7a');ok=false;break}
      const ry=best.ry,nx=best.p.x-Math.sin(ry)*1.3,nz=best.p.z-Math.cos(ry)*1.3,h=colAt(nx,nz);
      ringFx(player.p.x,player.p.y,player.p.z,1.5,'smoke');player.p.set(nx,(h??best.p.y)+0.05,nz);player.v.set(0,0,0);player.ry=ry;
      const[dm]=rollDmg(base*2.5);dealHit(best,dm,true,Math.sin(ry),Math.cos(ry));P2.atkT=0.28;break}
    case 'lotrzyke':P3.stealth=5*(1+0.1*pk('e'));setGhost(meRef,true);ringFx(player.p.x,player.p.y,player.p.z,2.5,'smoke');sendFx({k:'ring',p:[player.p.x,player.p.y,player.p.z],r:2.5,kind:'smoke'});toast('Zasłona dymna','#c9b8e8');break;
  }
  if(ok)P3[s]=cdFor(s);
}
function classTick(dt){
  P3.q-=dt;P3.e-=dt;P3.dash-=dt;
  {const cb=$('chgbar');if(P3.chg){if(!isBow()||P2.dead){P3.chg=null}else{P3.chg.t+=dt;player.ry=facing();P2.atkT=0.1}}if(P3.chg){cb.hidden=false;const k=Math.min(1,P3.chg.t/1.1);cb.firstChild.style.width=(k*100)+'%';cb.classList.toggle('full',k>=1)}else cb.hidden=true}
  if(P3.salvo&&P2.bowT<=0&&!P2.dead){const sv=P3.salvo;if(sv.left>0){sv.left--;P2.bowD=0.21;P2.bowT=P2.bowD;P2.bowShot=false;P2.sv=sv;P2.atkT=0.21;P2.atkCd=0.25}else{P3.salvo=null;P2.sv=null}}P3.buff-=dt;P3.haste-=dt;P3.leap-=dt;
  if(P3.stealth>0){P3.stealth-=dt;if(P3.stealth<=0)setGhost(meRef,false)}
  if(P3.wir){const w=P3.wir;w.t-=dt;w.tick-=dt;player.ry+=dt*16;if(w.tick<=0){w.tick=0.3;sfx('swing');for(const e of enemies.values()){if(e.st===2||e.car)continue;const dx=e.p.x-player.p.x,dz=e.p.z-player.p.z,d=Math.hypot(dx,dz);if(eDist(e,player.p.x,player.p.z)<3.4&&eYOk(e,player.p.y,1.9,1.2)){const[dm,cr]=rollDmg(ST.dmg*0.8*abilMul('q'));dealHit(e,dm,cr,(d?dx/d:0)*1.2,(d?dz/d:0)*1.2)}}ringFx(player.p.x,player.p.y,player.p.z,3.2,'war')}if(w.t<=0)P3.wir=null}
  if(P3.lunge){const L=P3.lunge;L.t-=dt;player.v.x=L.dir[0]*22;player.v.z=L.dir[1]*22;for(const e of enemies.values()){if(e.st===2||e.car||L.set.has(e.id))continue;const dx=e.p.x-player.p.x,dz=e.p.z-player.p.z,d=Math.hypot(dx,dz);if(eDist(e,player.p.x,player.p.z)<1.4&&eYOk(e,player.p.y,1.9,0.9)){L.set.add(e.id);const[dm,cr]=rollDmg(ST.dmg*1.6*abilMul('q'));dealHit(e,dm,cr,L.dir[0]*1.5,L.dir[1]*1.5)}}if(L.t<=0){P3.lunge=null;player.v.x*=0.3;player.v.z*=0.3}}
  if(P3.charge>0){P3.charge-=dt;player.v.x=P3.chargeDir[0]*16;player.v.z=P3.chargeDir[1]*16;
    for(const e of enemies.values()){if(e.st===2||P3.chargeSet.has(e.id))continue;const dx=e.p.x-player.p.x,dz=e.p.z-player.p.z,d=Math.hypot(dx,dz);
      if(eDist(e,player.p.x,player.p.z)<1.4&&eYOk(e,player.p.y,1.9,0.9)){P3.chargeSet.add(e.id);const[dm,cr]=rollDmg(ST.dmg*1.4*abilMul('q'));dealHit(e,dm,cr,(d?dx/d:0)*2.5,(d?dz/d:0)*2.5)}}}
  projTick(dt);ringTick(dt);
}

// ---------- doświadczenie i poziomy ----------
function xpFor(e,plv){return 12*e.lvl*(e.elite?3:1)*Math.min(1.6,Math.max(0.2,1+0.15*(e.lvl-(plv||1))))}
function gainXp(x){
  if(HERO.lvl>=LMAX)return;x=Math.round(x*(hasP('lowca')?1.15:1)*(1+0.04*pk('madrosc')));HERO.xp+=x;fxNum(player.p.x,player.p.y+2.4,player.p.z,'+'+x+' PD','#a7e0ff');
  while(HERO.lvl<LMAX&&HERO.xp>=need(HERO.lvl)){HERO.xp-=need(HERO.lvl);HERO.lvl++;HERO.pts++;ST=stats();P2.hp=ST.hp;
    toast('Awans! Poziom '+HERO.lvl+' · +1 punkt perku','#ffd34d');sfx('lvl');ringFx(player.p.x,player.p.y,player.p.z,3.5,'lvl');sendFx({k:'ring',p:[player.p.x,player.p.y,player.p.z],r:3.5,kind:'lvl'})}
  if(HERO.lvl>=LMAX)HERO.xp=0;saveHero();if(!$('perks').hidden)renderPerks();
}

// ---------- perki ----------
// ---------- drzewko umiejętności (zastępuje listę perków; klucze zgodne z dawnymi perkami) ----------
const NEWP=[['kondycja','Kondycja','Sprint zużywa 12% mniej kondycji, a ta wraca 15% szybciej'],['ogien','Żaroodporność','−15% obrażeń od lawy i kolców w pułapkach'],['galop','Jeździec','Wierzchowce poruszają się 6% szybciej']];
const PMAXK={kondycja:3,ogien:3,galop:3};const pmaxOf=k=>PMAXK[k]||PMAX;
const TREE=[{n:'Walka',c:'#e8644e',nodes:[['sila',0,1,null],['zrecz',1,0,'sila'],['prec',1,2,'sila'],['q',2,0,'zrecz'],['cios',2,2,'prec'],['mistrz',3,0,'q'],['wampir',3,2,'cios'],['e',4,1,'mistrz']]},
 {n:'Przetrwanie',c:'#6cc46d',nodes:[['wytrz',0,1,null],['odp',1,0,'wytrz'],['regen',1,2,'wytrz'],['tarcza',2,0,'odp'],['odnowa',2,2,'regen'],['unik',3,0,'tarcza'],['kondycja',3,2,'odnowa'],['ogien',4,1,'unik']]},
 {n:'Wędrowiec',c:'#5aa6ff',nodes:[['nogi',0,1,null],['skarb',1,0,'nogi'],['sokol',1,2,'nogi'],['opiekun',2,0,'skarb'],['lotnik',2,2,'sokol'],['madrosc',3,0,'opiekun'],['galop',3,2,'lotnik']]}];
const TIER_REQ=[0,2,5,9,14];let treeSel=null;
const perkInfo=k=>perkList().concat(NEWP).find(p=>p[0]===k)||[k,k,''];
const branchPts=B=>B.nodes.reduce((a,n)=>a+pk(n[0]),0);
function nodeState(B,n){const [k,t,,par]=n;if(pk(k)>=pmaxOf(k))return 'max';if(branchPts(B)<TIER_REQ[t])return 'lock';if(par&&pk(par)<1)return 'lock';return HERO.pts>0?'open':'wait'}
function renderTree(){const el=$('perklist');
  el.innerHTML='<div class="tree">'+TREE.map((B,bi)=>{const bp=branchPts(B);let lines='';for(const n of B.nodes){if(!n[3])continue;const p=B.nodes.find(q=>q[0]===n[3]);const on=pk(n[3])>0;lines+=`<line x1="${p[2]*100+50}" y1="${p[1]*100+50}" x2="${n[2]*100+50}" y2="${n[1]*100+50}" stroke="${on?B.c:'#4a3a28'}" stroke-width="${on?6:4}" stroke-dasharray="${on?'':'6 6'}"/>`}
    return `<div class="tbr" style="--bc:${B.c}"><div class="tbh"><b>${B.n}</b><span>${bp} pkt</span></div><div class="tgrid"><svg viewBox="0 0 300 500" preserveAspectRatio="none">${lines}</svg>`+
      [0,1,2,3,4].map(t=>`<div class="ttier" style="top:${t*20}%"><i>${TIER_REQ[t]?TIER_REQ[t]+'+':''}</i></div>`).join('')+
      B.nodes.map(n=>{const [k,t,c]=n,st=nodeState(B,n),r=pk(k),mx=pmaxOf(k),info=perkInfo(k);return `<button class="tnode ${st}${treeSel===k?' sel':''}" data-tn="${k}" data-b="${bi}" style="left:${c*33.33}%;top:${t*20}%"><b>${info[1]}</b><span class="tp">${'■'.repeat(r)}${'□'.repeat(mx-r)}</span></button>`}).join('')+'</div></div>'}).join('')+'</div><div id="tdet"></div>';
  renderTreeDet()}
function renderTreeDet(){const d=$('tdet');if(!d)return;if(!treeSel){d.innerHTML='<p class="sub2">Kliknij umiejętność, żeby zobaczyć opis. Dwuklik dodaje punkt. Kolejne rzędy odblokowujesz, wydając punkty w danej gałęzi (liczba po lewej), a każda umiejętność wymaga punktu w tej, z której wychodzi linia.</p>';return}
  const bi=TREE.findIndex(B=>B.nodes.some(n=>n[0]===treeSel)),B=TREE[bi],n=B.nodes.find(q=>q[0]===treeSel),info=perkInfo(treeSel),st=nodeState(B,n),r=pk(treeSel),mx=pmaxOf(treeSel);
  let req='';if(st==='lock'){const par=n[3]?perkInfo(n[3])[1]:null;req=branchPts(B)<TIER_REQ[n[1]]?`Wymaga ${TIER_REQ[n[1]]} pkt w gałęzi „${B.n}” (masz ${branchPts(B)}).`:`Wymaga co najmniej 1 punktu w: ${par}.`}
  d.innerHTML=`<div class="tdc" style="--bc:${B.c}"><div><h3>${info[1]} <small>${r}/${mx}</small></h3><p>${info[2]} <em>(za każdy punkt)</em></p>${req?`<p class="treq">🔒 ${req}</p>`:''}</div><button class="pri" id="tadd" ${st==='open'?'':'disabled'}>${st==='max'?'Maksimum':'+ Dodaj punkt'}</button></div>`;
  const b=$('tadd');if(b)b.onclick=()=>treeAdd(treeSel)}
function treeAdd(k){const bi=TREE.findIndex(B=>B.nodes.some(n=>n[0]===k));if(bi<0)return;const B=TREE[bi],n=B.nodes.find(q=>q[0]===k);if(nodeState(B,n)!=='open')return;HERO.perks[k]=pk(k)+1;HERO.pts--;saveHero();ST=stats();sfx('lvl',0.4);renderPerks()}

function perkList(){const l=GENPERKS.slice();{l.push(['q','Pierwsza umiejętność (Q)','−8% czasu odnowienia i +12% obrażeń']);l.push(['e','Druga umiejętność (E)','−8% czasu odnowienia i +10% dłuższe działanie'])}return l}
function renderPerks(){
  setTimeout(()=>{const box=document.getElementById('skillbox');if(!box)return;box.innerHTML='<h2 style="margin-top:14px">Umiejętności (rosną same od używania)</h2>'+SKILLS.map(([k,n,d])=>{const l=skL(k),x=(HERO.sk&&HERO.sk[k])||0,a=12*l*l,b=12*(l+1)*(l+1),pr=l>=50?100:Math.round((x-a)/(b-a)*100);return `<div class="perk"><div><b>${n} · poz. ${l}</b><span>${d}</span></div><div class="skbar"><i style="width:${pr}%"></i></div><div></div></div>`}).join('')},0);
  $('perkhead').innerHTML='Poziom <b>'+HERO.lvl+'</b> · punkty do rozdania: <b class="tpts">'+HERO.pts+'</b>';
  renderTree();
}
$('perklist').onclick=e=>{const b=e.target.closest('[data-tn]');if(!b)return;treeSel=b.dataset.tn;renderTree()};$('perklist').ondblclick=e=>{const b=e.target.closest('[data-tn]');if(!b)return;treeSel=b.dataset.tn;treeAdd(treeSel)};
$('perkreset').onclick=()=>{HERO.pts+=Object.values(HERO.perks).reduce((a,b)=>a+b,0);HERO.perks={};saveHero();ST=stats();P2.hp=Math.min(P2.hp,ST.hp);renderPerks()};
function togglePerks(){const v=$('perks');v.hidden=!v.hidden;if(!v.hidden){try{document.exitPointerLock()}catch(e){}renderPerks()}}
$('perkbtn').onclick=togglePerks;$('perkclose').onclick=togglePerks;

// ---------- wybór pasywek ----------
let PSEL=[];
function renderClsel(){
  $('clcards').innerHTML=PASS.map(([k,n,d])=>`<button class="clcard${PSEL.includes(k)?' sel':''}" data-pas="${k}"><b>${n}</b><span>${d}</span></button>`).join('');
  $('pascount').textContent='Wybrano: '+PSEL.length+' / 3';$('pasok').disabled=PSEL.length!==3;$('clclose').hidden=!(HERO.pas&&HERO.pas.length===3);
}
function openClsel(){PSEL=(HERO.pas||[]).slice();renderClsel();$('clsel').hidden=false;try{document.exitPointerLock()}catch(e){}}
$('clcards').onclick=e=>{const b=e.target.closest('[data-pas]');if(!b)return;const k=b.dataset.pas,i=PSEL.indexOf(k);if(i>=0)PSEL.splice(i,1);else if(PSEL.length<3)PSEL.push(k);renderClsel()};
$('pasok').onclick=()=>{if(PSEL.length!==3)return;const first=!HERO.pas;setTimeout(()=>{if(!S.look)openCustom()},50);HERO.pas=PSEL.slice();saveHero();ST=stats();$('clsel').hidden=true;toast(first?'Pasywki wybrane. Powodzenia!':'Pasywki zmienione','#ffd34d');renderInv&&invOpen()&&renderInv()};
$('clclose').onclick=()=>$('clsel').hidden=true;
$('chgcls').onclick=()=>{toggleMenu();openClsel()};
function setClass(){}
function poseExtra(g,w,block,sh){const u=g.userData;if(!u||!u.la)return;
  u.blockPose=!!(block&&sh);if(block&&sh){u.la.rotation.x=-1.45;u.la.rotation.z=0.45;u.la.rotation.y=0.3;if(u.le)u.le.rotation.x=-0.35;return}}
function sneakHud(){{const k=$('abe')&&$('abe').querySelector('kbd'),t=INV.eq.tarcza?'C':'PPM';if(k&&k.textContent!==t)k.textContent=t}const el=$('snk');if(!el)return;if(!P3.sneak){if(!el.hidden)el.hidden=true;return}el.hidden=false;let det=0,seen=false;for(const e of enemies.values()){if(e.st===2||e.pas)continue;if(e.tgId===NET.id){seen=true;break}if(Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z)<30)det=Math.max(det,e.det||0)}
  el.className=seen?'seen':det>0.05?'warn':'';el.querySelector('b').textContent=seen?'Wykryty!':det>0.05?'Ktoś coś słyszy…':'Ukryty';el.querySelector('i').style.width=(seen?100:Math.min(100,det*100))+'%'}
function updHud3(){
  const c=CLS[abilSet()];$('lvl').textContent=HERO.lvl;$('xpb').style.width=(HERO.lvl>=LMAX?100:HERO.xp/need(HERO.lvl)*100)+'%';
  $('xpt').textContent=HERO.lvl>=LMAX?'Maks. poziom':HERO.xp+' / '+need(HERO.lvl)+' PD';
  $('pts').textContent=HERO.pts;$('pts').hidden=HERO.pts<=0;
  {const el=$('abd'),cd=Math.max(0,P3.dash);el.querySelector('i').style.height=(cd>0?cd/2.2*100:0)+'%';el.querySelector('em').textContent=cd>0?Math.ceil(cd):'';el.classList.toggle('ready',cd<=0)}
  for(const s of ['q','e']){const el=$('ab'+s);if(!c){el.hidden=true;continue}el.hidden=false;el.querySelector('span').textContent=c[s].n;
    const cd=Math.max(0,P3[s]),tot=cdFor(s);el.querySelector('i').style.height=(cd>0?cd/tot*100:0)+'%';el.querySelector('em').textContent=cd>0?Math.ceil(cd):'';el.classList.toggle('ready',cd<=0)}
  $('buffs').textContent=[P3.buff>0?'Okrzyk '+Math.ceil(P3.buff)+' s':'',P3.haste>0?'Pęd '+Math.ceil(P3.haste)+' s':'',P3.stealth>0?'Niewidzialny '+Math.ceil(P3.stealth)+' s':''].filter(Boolean).join(' · ');
}
$('abq').onclick=()=>useAbility('q');$('abe').onclick=()=>useAbility('e');
$('abd').onclick=()=>dash();
{const k=$('abe').querySelector('kbd');if(k)k.textContent='PPM'}


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
const ROLE={portowy:['Kapitan portu','Kapitanka portu'],najemnik:['Najemnik','Najemniczka'],straz:['Strażnik','Strażniczka'],starszy:['Starszy wioski','Starsza wioski'],kupiec:['Kupiec','Kupcowa'],kowal:['Kowal','Kowalka'],mieszk:['Mieszkaniec','Mieszkanka'],wedr:['Wędrowiec','Wędrowczyni']};
const TIERS=[[-1e9,'Wrogi','#ff6b5b'],[-100,'Nieufny','#ff9d6b'],[-20,'Neutralny','#d8d8d8'],[50,'Przyjazny','#7dd87d'],[150,'Honorowany','#5fb8ff'],[300,'Uwielbiany','#ffd34d']];
const tierOf=v=>{let t=0;for(let i=0;i<TIERS.length;i++)if(v>=TIERS[i][0])t=i;return t};
const PRICE=[2,1.2,1,0.9,0.8,0.75];

// ---------- stan świata gracza (zapisywany per seed) ----------
let W={};
function loadW(){W=LS.get('world_'+S.seed,null)||{rep:{ludzie:0,elfy:0,krasnoludy:0,orkowie:0},karma:0,fame:0,quests:[],qdone:{},flags:{},seen:{}};W.opened=W.opened||{};for(const k in RACES)if(W.rep[k]==null)W.rep[k]=0;try{digLoad()}catch(_){}}
function saveW(){LS.set('world_'+S.seed,W)}
loadW();
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
    if(v.g&&v._dgMiss&&performance.now()-(v._dgT||0)>1500){v._dgT=performance.now();try{const dg=decorGeo(v);if(v._decoM){v.g.remove(v._decoM);v._decoM.geometry.dispose();v._decoM=null}if(dg){const dm=new THREE.Mesh(dg,matB);dm.position.set(v.x,v.h,v.z);dm.scale.setScalar(BS);dm.castShadow=true;dm.receiveShadow=true;v.g.add(dm);v._decoM=dm}villageTrees(v,v.g);villageLights(v,v.g)}catch(e){}}
    if(!v.wander&&d<(v.city?(v.Hs||60)+55:75)&&!W.seen[v.id]){W.seen[v.id]=1;saveW();if(v.name)toast('Odkryto: '+v.name,'#ffe7a8')}}
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
function houseDecor(L,h,v,city){const c=h.core,yo=h.top-v.h,ox=h.x-v.x,oz=h.z-v.z,f=c.oz+c.d/2,sr=c.ox+c.w/2,sl=c.ox-c.w/2,r=rngOf('dec'+h.x+'_'+h.z),P=[];
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
  for(const b of P)L.push(rotB(b,h.rot,ox,oz,yo))}
function decorGeo(v){DTREE=[];DLAMP=[];v._dgMiss=0;DGY=(x,z)=>{const h=colAt(v.x+x*BS,v.z+z*BS);if(h==null)v._dgMiss=1;return h==null?0:Math.max(-4,Math.min(4,h-v.h))/BS};try{return decorGeo0(v)}finally{v._trees=DTREE;v._lamps=DLAMP;DTREE=null;DGY=null;DLAMP=null}}
function decorGeo0(v){const L=[],r=rngOf('decor'+v.id);
  if(v.city&&v.pier){const dgS=DGY;DGY=null;const U=1/BS,ps=[[0,-1],[0,1],[-1,0],[1,0]][v.port],yd=(WATER+1.2-v.h)*U,ax=ps[0],az=ps[1];
    const PL=(v.portD||v.Hs+24)+8;for(let d=v.Hs+2,k=0;d<PL;d+=1.4,k++)L.push([ax*d*U,yd,az*d*U,(az?4:1.3)*U,0.3*U,(ax?4:1.3)*U,k%2?'#8a6240':'#7a5532']);
    for(let d=v.Hs+4;d<PL;d+=4.5)for(const s of [-1.7,1.7])L.push([(ax*d+(az?s:0))*U,yd-1.6*U,(az*d+(ax?s:0))*U,0.4*U,3.4*U,0.4*U,'#4a2f1d']);
    for(const s of [-1,1]){const d=PL-8,bx=ax*d+(az?s*4.2:0),bz=az*d+(ax?s*4.2:0);L.push([bx*U,(WATER-0.1-v.h)*U,bz*U,(az?2:6)*U,0.7*U,(ax?2:6)*U,'#6e4a2c'],[bx*U,(WATER+0.4-v.h)*U,bz*U,(az?1.6:5.4)*U,0.3*U,(ax?1.6:5.4)*U,'#8a6240'])}
    crate(L,(ax*(PL-2)+(az?1:0))*U,yd,(az*(PL-2)+(ax?1:0))*U);barrel(L,(ax*(PL-4)-(az?1:0))*U,yd,(az*(PL-4)-(ax?1:0))*U);DGY=dgS}
  for(const h of v.houses)if(h.core&&!h.castle&&!h.arena)houseDecor(L,h,v,!!v.city);
  if(v.inCity)return null;
  if(v.small){const r2=rngOf('sm'+v.id);if(v.camp){for(const [x,z] of [[-6,-4],[6,-4],[0,-7]]){for(let k=0;k<4;k++){const s2=3.2-k*0.75;L.push([x,0.35+k*0.6,z,s2,0.6,s2,k%2?'#c8b89a':'#3f6a8a'])}}L.push([0,0.15,2,1.4,0.3,1.4,'#4a4a4a'],[0,0.5,2,0.8,0.5,0.8,'#ff8a2e']);crate(L,-2,0,-2);crate(L,2.6,0,-2.4);barrel(L,-5,0,1);hay(L,5,0,1)}
    if(v.temple){for(const x of [-4,4])L.push([x,0.3,4,1.2,0.6,1.2,'#d8d0c0'],[x,1.6,4,0.6,2.0,0.6,'#e8e2d6'],[x,2.75,4,0.8,0.3,0.8,'#c9a24a']);flowers(L,-2,0,7,2.2,1);flowers(L,2,0,7,2.2,1);smallTree(L,-6.5,0,0,1.1,'#5a9a3e');smallTree(L,6.5,0,0,1.1,'#5a9a3e')}
    if(!v.camp&&!v.temple){bench(L,-3,0,4,1);barrel(L,4,0,3);smallTree(L,-6,0,-1,1,'#4a8a3a');smallTree(L,6,0,-2,1.1,'#3f7834')}
    lamp(L,3.5,0,6);lamp(L,-3.5,0,6)}
  else if(!v.city){for(let k=0;k<4;k++){const a=k/4*Math.PI*2+0.4;lamp(L,Math.cos(a)*6.5,0,Math.sin(a)*6.5)}
    for(let k=0;k<3;k++){const a=k/3*Math.PI*2+1.2;bench(L,Math.cos(a)*4.6,0,Math.sin(a)*4.6,Math.abs(Math.cos(a))<0.7)}
    for(let k=0;k<4;k++){const a=k/4*Math.PI*2+0.95+r()*0.3,rr=10+r()*3;smallTree(L,Math.cos(a)*rr,0,Math.sin(a)*rr,0.9+r()*0.4,rpick(r,['#4a8a3a','#5a9a3e','#3f7834']))}
    for(let k=0;k<5;k++){const a=r()*6.28,rr=8+r()*6,x=Math.cos(a)*rr,z=Math.sin(a)*rr;const t=r();if(t<0.35)barrel(L,x,0,z);else if(t<0.6)crate(L,x,0,z);else if(t<0.8)hay(L,x,0,z);else flowers(L,x,0,z,1.2,1)}}
  else{const Hs=v.Hs;for(let z=-Hs+8;z<=Hs-8;z+=11){if(Math.abs(z)<13)continue;lamp(L,2.8,0,z);lamp(L,-2.8,0,z+5.5);lamp(L,z,0,2.8);lamp(L,z+5.5,0,-2.8)}
    for(const [x,z] of [[10,4.5],[-10,-4.5],[4.5,-10],[-4.5,10]])smallTree(L,x,0,z,1.15,'#4a8a3a');
    for(const [x,z,ax] of [[3.6,0,0],[-3.6,0,0],[0,3.6,1],[0,-3.6,1]])bench(L,x,0,z,ax);
    MKT_A.forEach((an,i)=>{const R1=(MKT_R+1.5)/BS,cx=Math.cos(an),cz=Math.sin(an),tx=-cz,tz=cx;if(i===6)return;const t=i%3;if(t===0){crate(L,cx*R1+tx*0.9,0,cz*R1+tz*0.9);barrel(L,cx*R1-tx*0.9,0,cz*R1-tz*0.9)}else if(t===1){hay(L,cx*R1+tx*1.0,0,cz*R1+tz*1.0);crate(L,cx*R1-tx*0.8,0,cz*R1-tz*0.8)}else{barrel(L,cx*R1+tx*0.8,0,cz*R1+tz*0.8);barrel(L,cx*R1+tx*1.3,0,cz*R1+tz*1.25)}});
    for(const [x,z] of [[11,11],[-11,11],[11,-11],[-11,-11]])flowers(L,x,0,z,1.6,1);
    for(const l of [25,48])if(l<Hs-8)for(let a=-Hs+10;a<=Hs-10;a+=12){if(Math.abs(a)<14)continue;for(const sg of [-1,1]){lamp(L,sg*l+1.6,0,a);lamp(L,a,0,sg*l-1.6)}}
    // przy murach: składy, wozy, kukły treningowe, stojaki z bronią, namioty straży
    const wr=rngOf('wall'+v.id);
    for(const [ax,sg] of [[0,1],[0,-1],[1,1],[1,-1]])for(let a=-Hs+8;a<=Hs-8;a+=6.5){if(Math.abs(a)<7)continue;const o=Hs-2.3,x=ax?sg*o:a,z=ax?a:sg*o,t=wr();
      if(t<0.18){crate(L,x,0,z);crate(L,x+(ax?0:0.75),0,z+(ax?0.75:0),0.6);crate(L,x,0.7,z,0.55)}
      else if(t<0.32){barrel(L,x,0,z);barrel(L,x+(ax?0:0.7),0,z+(ax?0.7:0))}
      else if(t<0.44){hay(L,x,0,z);hay(L,x,0.84,z)}
      else if(t<0.56){L.push([x,0.2,z,0.12,0.4,0.12,WDD],[x,1.0,z,0.22,1.3,0.22,'#b8925a'],[x,1.9,z,0.34,0.34,0.34,'#c9a46a'],[x,1.35,z,ax?0.14:0.9,0.12,ax?0.9:0.14,'#b8925a'],[x,0.06,z,0.7,0.12,0.7,WDD])}
      else if(t<0.68){L.push([x,0.9,z,ax?0.16:1.8,1.8,ax?1.8:0.16,WDD],[x,1.5,z,ax?0.3:1.8,0.08,ax?1.8:0.3,WDD]);for(let k=-1;k<=1;k++)L.push(ax?[x+0.12,1.1,z+k*0.5,0.06,1.6,0.06,'#c9cfd4']:[x+k*0.5,1.1,z+0.12,0.06,1.6,0.06,'#c9cfd4'])}
      else if(t<0.78){for(let k=0;k<4;k++){const s2=2.6-k*0.6;L.push([x,0.3+k*0.5,z,s2,0.5,s2,k%2?'#a8452f':'#c8b89a'])}}
      else if(t<0.88){smallTree(L,x,0,z,0.85+wr()*0.3,rpick(wr,['#4a8a3a','#5a9a3e']))}
      else{L.push([x,0.55,z,ax?1.3:2.2,0.16,ax?2.2:1.3,'#8a6a44'],[x,0.85,z,ax?1.2:2.0,0.5,ax?2.0:1.2,'#a8803a']);for(const s3 of [-0.8,0.8])L.push(ax?[x+0.7,0.4,z+s3,0.1,0.8,0.8,'#4a2f1d']:[x+s3,0.4,z+0.7,0.8,0.8,0.1,'#4a2f1d'])}}
    // podwórka między domami: ogródki, studnie, kurniki, place z drzewem
    for(const [yx,yz] of (v.yards||[])){const x=yx-v.x,z=yz-v.z,yr=rngOf('yard'+yx+'_'+yz),t=yr();
      for(let k=0;k<4;k++){const a=k*Math.PI/2;L.push([x+Math.cos(a)*4.2,0.45,z+Math.sin(a)*4.2,Math.abs(Math.cos(a))>0.5?0.12:8.2,0.9,Math.abs(Math.cos(a))>0.5?8.2:0.12,'#7a5532'])}
      if(t<0.35){smallTree(L,x,0,z,1.3,'#4a8a3a');bench(L,x+2.2,0,z,0);flowers(L,x-2.6,0,z+2.4,2,1);flowers(L,x-2.6,0,z-2.4,2,1)}
      else if(t<0.6){L.push([x,0.45,z,2.2,0.9,2.2,ST1],[x,0.92,z,1.6,0.06,1.6,'#3f6d9a'],[x-0.95,1.6,z,0.16,1.5,0.16,WDD],[x+0.95,1.6,z,0.16,1.5,0.16,WDD],[x,2.45,z,2.4,0.14,1.4,'#a8452c']);smallTree(L,x+2.8,0,z+2.8,0.9);bench(L,x-2.6,0,z,0)}
      else if(t<0.8){L.push([x,0.6,z,2.4,1.2,1.6,'#8a6240'],[x,1.35,z,2.6,0.25,1.8,'#a8452c'],[x+1.4,0.25,z,0.5,0.5,0.6,'#6b4a2b']);for(let k=0;k<6;k++)L.push([x-2+yr()*4,0.15,z+1.5+yr()*1.5,0.22,0.3,0.32,'#f4f0e6']);hay(L,x-2.4,0,z-2.2)}
      else{for(let row=-3;row<=3;row+=1.5)for(let col=-3;col<=3;col+=1.2)L.push([x+col,0.2,z+row,0.5,0.4,0.5,yr()<0.5?'#5f9a40':'#d8a43a']);smallTree(L,x+3,0,z-3,0.8,'#5a9a3e')}}}
  return L.length?kitB(L):null}
function windmill(){const S='#8e8994',P='#ece2c6',T='#4a2f1d',R1='#a8452c',R2='#93391f',L=[];
  L.push([0,0.9,0,4.4,1.8,4.4,S],[0,3.2,0,3.9,2.8,3.9,P],[0,5.7,0,3.4,2.2,3.4,P],[0,1.85,0,4.5,0.12,4.5,'#6f6a73'],[0,4.62,0,3.95,0.14,3.95,T],[0,6.85,0,3.45,0.14,3.45,T]);
  for(const s of [-1,1])L.push([s*1.96,3.2,0,0.08,2.8,0.16,T],[0,3.2,s*1.96,0.16,2.8,0.08,T]);
  L.push([0,1.0,2.21,1.0,1.6,0.04,T],[0,3.4,1.96,0.6,0.7,0.04,'#2b2633'],[1.71,5.8,0,0.04,0.6,0.5,'#2b2633']);
  for(let i=0;i<5;i++){const w=3.8-i*0.68;L.push([0,7.1+i*0.38,0,w,0.4,w+0.3,i%2?R2:R1])}
  L.push([0,7.8,1.8,0.4,0.4,1.0,T]);
  const S2=[];for(let k=0;k<4;k++){const a=k*Math.PI/2,ca=Math.round(Math.cos(a)),sa=Math.round(Math.sin(a));
    const arm=(o,len,w,dz,col)=>S2.push(ca?[ca*(o+len/2),0,dz,len,w,0.12,col]:[0,sa*(o+len/2),dz,w,len,0.12,col]);
    arm(0.2,5.6,0.2,0,T);const sail=(o)=>S2.push(ca?[ca*(o),sa*0+0.55*ca*0+(ca?0.55:0),0.06,1.0,0.9,0.04,'#efe8d6']:[(sa? -0.55:0),sa*o,0.06,0.9,1.0,0.04,'#efe8d6']);
    for(let j=0;j<4;j++)sail(1.3+j*1.05)}
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
    for(let k=0;k<10;k++)P(x,WATER+0.8+k*1.2,z,2.8-k*0.08,1.2,2.8-k*0.08,k%2?'#e8e2d6':'#a8302a');P(x,WATER+13,z,3.4,0.3,3.4,'#3a3a40');P(x,WATER+14,z,2,1.8,2,'#ffe7a0');for(const [a,b] of [[1,1],[1,-1],[-1,1],[-1,-1]])P(x+a*0.95,WATER+14,z+b*0.95,0.12,1.8,0.12,'#3a3a40');P(x,WATER+15.2,z,2.6,0.6,2.6,'#a8302a');P(x,WATER+15.8,z,1.2,0.6,1.2,'#a8302a');
    v._portLights=[[x,WATER+14,z]];const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffe0a0,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));s.position.set(x,WATER+14,z);s.scale.set(8,8,1);pg.add(s);v._beacon=s}
  // dźwig portowy i skrzynie na nabrzeżu
  {const [x,z]=at(v.Hs+8,4.5);for(const s of [-0.8,0.8]){const [a,b]=wz(s,0);P(x+a,yd+2,z+b,0.25,4,0.25,'#5a3a22')}P(x,yd+4.1,z,0.3,0.3,0.3,'#4a2f1d');{const [a,b]=wz(0,2);P(x+a*0.5,yd+4.2,z+b*0.5+0,ax?2.6:0.2,0.2,ax?0.2:2.6,'#5a3a22')}{const [a,b]=wz(0,2.4);P(x+a,yd+3,z+b,0.04,2.2,0.04,'#c8b080');P(x+a,yd+1.6,z+b,0.8,0.8,0.8,'#9a7048')}}
  for(let k=0;k<6;k++){const [x,z]=at(v.Hs+5+k*1.1,-4.2+(k%2)*0.9);P(x,yd+0.4,z,0.8,0.8,0.8,k%2?'#9a7048':'#8a5a30')}
  {const [x,z]=at(v.Hs+14,-4.5);for(const s of [-1.5,1.5]){const [a,b]=wz(0,s);P(x+a,yd+1,z+b,0.15,2,0.15,'#4a2f1d')}{const [w,d]=wz(0.1,3.2);P(x,yd+1.9,z,w,0.1,d,'#4a2f1d')}{const [w,d]=wz(0.05,3);P(x,yd+1.2,z,w,1.3,d,'#c8b890')}}
  const lm=new THREE.Mesh(boxes(L),matB);lm.castShadow=true;lm.receiveShadow=true;pg.add(lm);
  // statki przy molo
  const SC=['#a8302a','#2f5f9f','#3a7a3a','#d9b23a'];[[PL-4,7.8],[PL-15,-7.8]].forEach(([d,lat],i)=>{if(d<v.Hs+3)return;const [x,z]=at(d,lat);const sm=new THREE.Mesh(shipGeo(SC[(i+Math.abs(Math.round(v.x)))%4]),matB);sm.position.set(x,WATER-0.15,z);sm.rotation.y=Math.atan2(ax,az);sm.castShadow=true;pg.add(sm);v._ships.push({m:sm,ph:i*1.7})})}
TICKS.push(()=>{const t=performance.now()/1000;for(const v of villages.values()){if(!v||!v._ships)continue;for(const s of v._ships){s.m.position.y=WATER-0.15+Math.sin(t*0.8+s.ph)*0.08;s.m.rotation.z=Math.sin(t*0.6+s.ph)*0.025}if(v._beacon){const n=hour>=19||hour<6.5;v._beacon.visible=n;v._beacon.material.opacity=0.7+0.3*Math.sin(t*2)}}});
function villageLights(v,g){if(v._lightG){g.remove(v._lightG);v._lightG.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&o.material.map)o.material.dispose()})}const lg=new THREE.Group();g.add(lg);v._lightG=lg;const pts=[],LB=[];
  for(const [x,y,z] of (v._lamps||[]))pts.push([v.x+x*BS,v.h+y*BS,v.z+z*BS]);for(const q of (v._portLights||[]))pts.push(q);
  for(const h of v.houses){if(!h.core||h.arena)continue;const [dx,dz]=doorOf(h),fx=Math.sin(h.rot),fz=Math.cos(h.rot),rx=fz,rz=-fx,lx=dx+rx*1.35-fx*0.5,lz=dz+rz*1.35-fz*0.5,ly=h.top+2.5;
    pts.push([lx+fx*0.35,ly,lz+fz*0.35]);LB.push([lx+fx*0.18,ly+0.35,lz+fz*0.18,Math.abs(fz)*0.08+Math.abs(fx)*0.4,0.08,Math.abs(fx)*0.08+Math.abs(fz)*0.4,'#3a3a40'],[lx+fx*0.35,ly,lz+fz*0.35,0.26,0.34,0.26,'#3a3a40'],[lx+fx*0.35,ly,lz+fz*0.35,0.2,0.26,0.2,'#ffd27a'],[lx+fx*0.35,ly+0.2,lz+fz*0.35,0.32,0.06,0.32,'#2a2a30'])}
  if(LB.length){const lm=new THREE.Mesh(boxes(LB),decoMat);lm.castShadow=true;lg.add(lm)}
  v._lw=pts;v._glow=[];for(const p of pts){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color:0xffc877,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:0.9}));s.position.set(p[0],p[1],p[2]);s.scale.set(1.7,1.7,1);s.visible=false;lg.add(s);v._glow.push(s)}}
function streetLights(){const night=hour>=18.8||hour<6.4,p=player.p,cand=[];
  if(SPC&&SPC.kind==='arena'){for(const t of SPC.torches)cand.push([Math.hypot(t[0]-p.x,t[2]-p.z),[t[0],t[1]+1,t[2]],16,1.3]);if(SPC.braz)for(const t of SPC.braz)cand.push([Math.hypot(t[0]-p.x,t[2]-p.z)*0.5,t,24,1.6])}
  for(const v of villages.values()){if(!v||!v.g||!v._glow)continue;const on=night&&!SPC;if(v._glowOn!==on){v._glowOn=on;for(const s of v._glow)s.visible=on}if(!on)continue;if(Math.abs(v.x-p.x)>140||Math.abs(v.z-p.z)>140)continue;for(const q of v._lw){const d=Math.hypot(q[0]-p.x,q[2]-p.z);if(d<90)cand.push([d,q,15,1.6])}}
  cand.sort((a,b)=>a[0]-b[0]);const fl=1+Math.sin(performance.now()*0.011)*0.04;
  for(let k=0;k<16;k++){const U=SEAS_U.uLamp.value[12+k],c=cand[k];if(c){U.set(c[1][0],c[1][1]-0.6,c[1][2],c[2]||14);SEAS_U.uLampI.value[12+k]=(c[3]||1.5)*fl;SEAS_U.uLampC.value[12+k].set(1,.76,.42)}else{U.w=0;SEAS_U.uLampI.value[12+k]=0}}}
function villageTrees(v,g){if(v._treeG){g.remove(v._treeG);v._treeG=null}const T=v._trees;if(!T||!T.length)return;const tg=new THREE.Group();g.add(tg);v._treeG=tg;g=tg;v.props=(v.props||[]).filter(p=>!p.tree);const KS={niziolki:['oak','maple','oak','birch'],drowy:['pine','pine','oak'],saurianie:['palm','acacia','palm','oak'],ludzie:['oak','maple','birch','oak'],elfy:['birch','sakura','maple','birch'],krasnoludy:['pine','pine','oak','birch'],orkowie:['oak','acacia','pine','oak']}[v.race]||['oak'];
  const by={},m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),pv=new THREE.Vector3(),sv=new THREE.Vector3();v.props=v.props||[];
  T.forEach(([x,z,s],i)=>{const k=KS[(Math.abs(Math.round(x*7+z*13))+i)%KS.length];if(!OBJGEO[k])return;const wx=v.x+x*BS,wz=v.z+z*BS;let gy=colAt(wx,wz);if(gy==null)gy=v.h;const sc=(0.72+0.22*s)*(SCL[k]||TS);(by[k]=by[k]||[]).push([wx,gy,wz,sc,((i*2.4)%6.28)]);v.props.push({x:wx,z:wz,r:0.5,tree:1})});
  for(const k in by){const L=by[k],im=new THREE.InstancedMesh(OBJGEO[k],imMat(k),L.length);L.forEach(([x,y,z,sc,ry],i)=>{e.set(0,ry,0);q.setFromEuler(e);m4.compose(pv.set(x,y,z),q,sv.set(sc,sc,sc));im.setMatrixAt(i,m4)});im.instanceMatrix.needsUpdate=true;im.castShadow=true;im.receiveShadow=true;im.userData.keep=1;im.frustumCulled=false;g.add(im)}}
function buildVillage(v){
  const R=RACES[v.race],g=new THREE.Group();v.g=g;v.wins=[];
  if(v.city){const wm=new THREE.Mesh(raceWall(cityWallGeo(v),v.race),matB);wm.position.set(v.x,v.h,v.z);wm.scale.setScalar(BS);wm.castShadow=true;wm.receiveShadow=true;g.add(wm);v._voxWall=wm}
  if(v.city)try{const bl=kingBanners(v);if(bl.length){const bm=new THREE.Mesh(boxes(bl),matB);bm.position.set(v.x,v.h,v.z);bm.castShadow=true;g.add(bm)}}catch(e){console.warn('chorągwie',e)}
  for(const h of v.houses)BQ.push([v,h]);
  {const dg=decorGeo(v);if(dg){const dm=new THREE.Mesh(dg,matB);dm.position.set(v.x,v.h,v.z);dm.scale.setScalar(BS);dm.castShadow=true;dm.receiveShadow=true;g.add(dm);v._decoM=dm}v._dgT=performance.now();villageTrees(v,g);try{portExtras(v,g)}catch(e){console.warn('port',e)}villageLights(v,g);voxQueue(g,v.id)}
  v.millS=[];for(const q of (v.farm?v.farm.mills:[])){const [mg,sg]=windmill();const mm=new THREE.Mesh(mg,matB);mm.position.set(q.x,q.h,q.z);mm.scale.setScalar(BS);mm.rotation.y=Math.round(Math.atan2(v.x-q.x,v.z-q.z)/(Math.PI/2))*(Math.PI/2);mm.castShadow=true;g.add(mm);const s=new THREE.Mesh(sg,matB);s.position.set(0,7.8/BS,2.25/BS);s.castShadow=true;mm.add(s);v.millS.push(s)}
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
  scene.add(g);
}
const BQ=[];
function buildTick(){let n=0;while(BQ.length&&n<1){const [v,h]=BQ.shift();if(!v.g)continue;if(h.arena){n++;const hg=new THREE.Group();hg.position.set(h.x,h.top,h.z);hg.rotation.y=h.rot;const am=new THREE.Mesh(arenaExtGeo(),matB);am.castShadow=true;am.receiveShadow=true;am.userData.keep=1;hg.add(am);v.g.add(hg);continue}const M=houseModel(h.type,h.v,v.race);n++;if(!M)continue;const c=h.core;
  const hg=new THREE.Group();hg.position.set(h.x,h.top,h.z);hg.rotation.y=h.rot;
  const inner=new THREE.Group();inner.scale.setScalar(BS);const mesh=new THREE.Mesh(M.geo,matB);mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.keep=1;inner.add(mesh);
  for(const wg of M.wins){const w=new THREE.Mesh(wg,winOff);w.userData.k=Math.random();w.userData.keep=1;inner.add(w);lighting.wb=-9;winMeshes.push(w);v.wins.push(w)}
  hg.add(inner);const ph=h.top-h.bot+2.4,pad=new THREE.Mesh(boxes([[0,-ph/2+0.03,0,c.pw,ph,c.pd,'#6f6a73']]),matB);pad.receiveShadow=true;hg.add(pad);v.g.add(hg);voxQueue(inner,v.id)}}
function unbuildVillage(v){voxRemove(v.id);v._voxQ=0;v.life=null;v._portG=null;v._ships=null;v._beacon=null;scene.remove(v.g);v.g.traverse(o=>{if(o.geometry&&!o.userData.keep)o.geometry.dispose();if(o.isSprite&&o.material){freeTagTex(o.material);o.material.dispose()}});for(const w of v.wins){const i=winMeshes.indexOf(w);if(i>=0)winMeshes.splice(i,1)}v.wins=[];v.g=null;for(const n of v.npcs)n.m=null}
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
  const look={fem:n.fem&&n.role!=='straz',skin:n.skin,hairC:n.hair,hair:n.fem?rpick(r,['dlugie','warkocze','kucyk']):rpick(r,['krotkie','krotkie','dlugie','lysy']),beard:n.fem?'brak':R.beard?'dluga':R.tusks?rpick(r,['brak','zarost','brak']):rpick(r,['brak','zarost','krotka','wasy','dluga']),eyes:Math.floor(r()*5),tunic:n.cloth,pants:darker(n.cloth,0.55),boots:'#4a3020',cape:n.role==='starszy'?1:0,capeC:'#6a2a3a',build:R.ws>1.1?1:0};
  const hr=r();const ex={ears:R.ears,tusks:R.tusks,hat:n.role==='kupiec'?'kupiec':n.role==='straz'?'helm':n.role==='wedr'?'kaptur':n.roleN==='Burmistrz'?'korona':n.role==='mieszk'?(hr<0.3?'slomkowy':hr<0.5&&n.fem?'chusta':undefined):undefined,apron:n.role==='kowal'||(n.role==='mieszk'&&hr>0.8),pack:n.role==='wedr',armor:n.role==='straz'&&!villages.get(n.vid)?'#8a8f94':undefined,gloves:n.role==='kowal'?'#5a3a22':n.role==='straz'?'#6a6f74':undefined,robe:n.role==='starszy'&&!n.fem};
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
  if(n.plot){const p=n.plot,e=1.3;for(const [a,b] of [[-1,-1],[1,-1],[1,1],[-1,1]])P.push([p.x-v.x+a*(p.hw+e),p.z-v.z+b*(p.hd+e)]);if(r()<0.5)P.reverse()}
  else if(v.city){const arm=Math.floor(r()*4),lane=(r()<0.5?-1:1)*(1.2+r()*1.0),far=Math.max(16,(v.Hs-6)*(0.55+r()*0.45)),near=12.5;
    const rot=(a,b)=>arm===0?[a,b]:arm===1?[b,-a]:arm===2?[-a,-b]:[-b,a];
    const nxt=(arm+(r()<0.5?1:3))%4,rot2=(a,b)=>nxt===0?[a,b]:nxt===1?[b,-a]:nxt===2?[-a,-b]:[-b,a];
    const d1=rot(0,1),d2=rot2(0,1),cor=[10.6*(d1[0]+d2[0]),10.6*(d1[1]+d2[1])];
    P.push(rot(lane,far),rot(lane,near),cor);const c2=rot2(lane,near),c3=rot2(lane,far*0.8);P.push(c2,c3,c2,cor,rot(lane,near));
  } else {const k=4+Math.floor(r()*3),a0=r()*6.28;for(let i=0;i<k;i++){const a=a0+i/k*6.28+(r()-0.5)*0.6,rr=6.5+r()*6;P.push([Math.cos(a)*rr,Math.sin(a)*rr])}}
  const pts=P.map(p=>[v.x+p[0],v.z+p[1]]),seg=[];let T=0;
  for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length],l=Math.hypot(b[0]-a[0],b[1]-a[1]),pause=r()<0.6?2+r()*5:0;seg.push({a,b,l,t0:T,tw:l/1.25,pause});T+=l/1.25+pause}
  n.path={seg,T,off:r()*T};return n.path;
}
function npcWalkPos(n,t){const P=n.path,tt=((t+P.off)%P.T+P.T)%P.T;for(const s of P.seg){if(tt<s.t0+s.tw+s.pause){const k=Math.min(1,(tt-s.t0)/s.tw);return[s.a[0]+(s.b[0]-s.a[0])*k,s.a[1]+(s.b[1]-s.a[1])*k,Math.atan2(s.b[0]-s.a[0],s.b[1]-s.a[1]),k<1]}}const s=P.seg[0];return[s.a[0],s.a[1],0,false]}
function npcTick(dt){
  nearNpc=null;let nd=3.2;
  for(const v of villages.values()){if(!v||!v.g)continue;
    for(const s of (v.millS||[]))s.rotation.z+=dt*0.7;
    if(v.temple&&!P2.dead&&Math.hypot(player.p.x-v.x,player.p.z-v.z)<11&&P2.hp<ST.hp){P2.hp=Math.min(ST.hp,P2.hp+ST.hp*0.05*dt);if(!v.blT||performance.now()-v.blT>6000){v.blT=performance.now();toast('Błogosławieństwo świątyni leczy rany','#cfe8ff')}}
    {let dg=false;const rr=(v.city?v.Hs:30)+AIP.npcPad;for(const e of enemies.values())if(!e.pas&&e.st!==2&&!e.car&&Math.abs(e.p.x-v.x)<rr&&Math.abs(e.p.z-v.z)<rr){dg=true;break}
      if(dg&&!v._dg&&Math.hypot(player.p.x-v.x,player.p.z-v.z)<rr+20)toast('Mieszkańcy chowają się przed wrogami!','#ff9d6b');v._dg=dg}
    const night=hour>=21.5||hour<5.3;
    for(const n of v.npcs){if(!n.m)continue;
      {const talk=dlg&&dlg.n===n;if(talk){n.run=null;if(n.hid){n.hid=false;n.m.visible=true}n.m.rotation.y=Math.atan2(player.p.x-n.x,player.p.z-n.z)}const want=!talk&&!v.wander&&((night&&(n.role==='mieszk'||n.role==='wedr'||n.farmer))||(v._dg&&n.role!=='straz'));
        if(want&&!n.hid){if(v._dg&&!n.inside){if(!n.run){let hb=null,hd=1e9;for(const h of v.houses){const d=Math.hypot((h.cx??h.x)-n.x,(h.cz??h.z)-n.z);if(d<hd){hd=d;hb=h}}n.run=hb?[hb.cx??hb.x,hb.cz??hb.z]:[v.x,v.z]}
            const dx=n.run[0]-n.x,dz=n.run[1]-n.z,d=Math.hypot(dx,dz);if(d>1.4){const s=Math.min(d,AIP.npcRun*dt);n.x+=dx/d*s;n.z+=dz/d*s;n.m.position.x=n.x;n.m.position.z=n.z;n.m.rotation.y=Math.atan2(dx,dz);const G=n.m.userData.g;if(G)animChar(G,4,dt,false,false);if(dlg&&dlg.n===n)closeDialog();continue}}
          n.hid=true;n.m.visible=false;n.run=null;if(dlg&&dlg.n===n)closeDialog()}
        else if(!want&&n.hid){n.hid=false;n.m.visible=true;n.run=null}else if(!want)n.run=null;
        if(n.hid)continue}
      const pth=npcPath(n,v);let moving=false;
      if(pth){const near=Math.hypot(player.p.x-n.x,player.p.z-n.z)<4.2||(dlg&&dlg.n===n);if(near)n.hold=(n.hold||0)+dt;
        const [wx,wz,wr,mv]=npcWalkPos(n,worldT-(n.hold||0));
        if(!near){const dx=wx-n.x,dz=wz-n.z,dd=Math.hypot(dx,dz);if(dd>3){n.x=wx;n.z=wz}else if(dd>0.01){const st=Math.min(dd,2.2*dt*(dd>0.4?1.6:1));n.x+=dx/dd*st;n.z+=dz/dd*st}n.ry=wr;moving=mv;n.m.position.x=n.x;n.m.position.z=n.z}}
      const gu=n.m.userData.g&&n.m.userData.g.userData;if(gu&&pth)animChar(n.m.userData.g,moving?1.25:0,dt,false,false);
      {if(!v._doors)v._doors=v.houses.filter(q=>q.core).map(q=>{const [dx,dz]=doorOf(q);return[dx,dz,Math.sin(q.rot),Math.cos(q.rot)]});for(const [dx,dz,fx,fz] of v._doors){const ex=n.x-dx,ez=n.z-dz;if(Math.abs(ex)>4||Math.abs(ez)>4)continue;const fw=ex*fx+ez*fz,lt=ex*fz-ez*fx;if(fw>-1.2&&fw<2.6&&Math.abs(lt)<2){const nl=(lt>=0?2:-2);n.x=dx+fx*fw+fz*nl;n.z=dz+fz*fw-fx*nl;n.m.position.x=n.x;n.m.position.z=n.z}}}
      let h=colAt(n.x,n.z);const vg=villageGround(n.x,n.z,999);if(vg!==null&&(h===null||vg>h))h=vg;if(h!==null)n.m.position.y=h;
      const dx=player.p.x-n.x,dz=player.p.z-n.z,d=Math.hypot(dx,dz);const u=n.m.userData;u.ph+=dt;
      let tr=n.ry;if(d<(pth?4.2:7))tr=Math.atan2(dx,dz);let dr=tr-n.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));n.m.rotation.y+=dr*Math.min(1,(moving?8:5)*dt);
      if(!pth||!moving){u.head.rotation.x=Math.sin(u.ph*0.7)*0.05;if(!pth)u.ra.rotation.x=n.role==='kowal'?-0.6+Math.abs(Math.sin(u.ph*3))*-1.2:Math.sin(u.ph*0.9)*0.06}
      const q=W.quests.find(q=>q.giver===n.id&&q.done||(q.type==='deliver'&&q.to===n.id&&!q.done));const avail=!q&&canOfferQuest(n);
      if(n.stall){n.stall.position.set(n.x+Math.sin(n.ry)*1.3,n.m.position.y,n.z+Math.cos(n.ry)*1.3);n.stall.rotation.y=n.ry}
      if(n.anvil){n.anvil.position.set(n.x+Math.sin(n.ry+1.2)*1.2,n.m.position.y,n.z+Math.cos(n.ry+1.2)*1.2)}
      n.mark=q?'?':avail?'!':'';
      if(d<nd&&Math.abs(player.p.y-n.m.position.y)<3){nd=d;nearNpc=n}}}
  const pr=$('prompt');if(nearNpc&&!dlg){pr.hidden=false;pr.innerHTML='<kbd>F</kbd> Rozmowa: <b></b>';pr.querySelector('b').textContent=nearNpc.name+' ('+nearNpc.roleN+')'}else pr.hidden=true;
  if(dlg&&Math.hypot(player.p.x-dlg.n.x,player.p.z-dlg.n.z)>5.5)closeDialog();
}
// ===== KOLIZJE Z KSZTAŁTU MODELI: woksele 0,5 m z geometrii budynków, murów, dekoracji i struktur =====
const VOXC=0.5,VOX=new Map(),VQ=[],VOWN=new Map();
const vkey=(ix,iz)=>(ix+1048576)*2097152+(iz+1048576);
function voxQueue(obj,owner){if(!obj)return;const meshes=[];
  const walk=(o,ch)=>{if(!o||o.visible===false||o.isSprite===true||o.isInstancedMesh===true||(o.userData&&(o.userData.noVox||o.userData.ll||o.userData.legs)))return;ch=ch.concat([o]);const g=o.geometry;
    if(o.isMesh===true&&g&&g.attributes&&g.attributes.position&&o.material!==GLOWMAT&&o.material!==winOff&&!(o.material&&o.material.transparent===true))meshes.push([o,ch]);for(const c of (o.children||[]))walk(c,ch)};
  const chain=[];let q=obj.parent,lim=0;while(q&&q!==scene&&q.isObject3D===true&&q.position&&q.scale&&lim++<12){chain.unshift(q);q=q.parent}walk(obj,chain);for(const [m,ch] of meshes)VQ.push({owner,m,ch,st:0})}
function voxRemove(owner){for(let i=VQ.length-1;i>=0;i--)if(VQ[i].owner===owner)VQ.splice(i,1);const ks=VOWN.get(owner);if(!ks)return;for(const k of ks){const L=VOX.get(k);if(!L)continue;const f=L.filter(e=>e.o!==owner);if(f.length)VOX.set(k,f);else VOX.delete(k)}VOWN.delete(owner)}
function voxTick(){const t0=performance.now();while(VQ.length&&performance.now()-t0<3.5){const J=VQ[0];
    if(!J.T){const g=J.m.geometry,P=g.attributes.position.array,nv=P.length/3,T=new Float32Array(P.length),ch=J.ch;
      const rot=(r,v)=>{const cx=Math.cos(r.x||0),sx=Math.sin(r.x||0),cy=Math.cos(r.y||0),sy=Math.sin(r.y||0),cz=Math.cos(r.z||0),sz=Math.sin(r.z||0);let [x,y,z]=v;const x1=x*cz-y*sz,y1=x*sz+y*cz,z1=z;if(r.order==='YXZ'){const y2=y1*cx-z1*sx,z2=y1*sx+z1*cx;return[x1*cy+z2*sy,y2,-x1*sy+z2*cy]}const x2=x1*cy+z1*sy,z2=-x1*sy+z1*cy;return[x2,y1*cx-z2*sx,y1*sx+z2*cx]};
      for(let i=0;i<nv;i++){let v=[P[i*3],P[i*3+1],P[i*3+2]];for(let k=ch.length-1;k>=0;k--){const t=ch[k];v=[v[0]*t.scale.x,v[1]*t.scale.y,v[2]*t.scale.z];v=rot(t.rotation,v);v=[v[0]+t.position.x,v[1]+t.position.y,v[2]+t.position.z]}T[i*3]=v[0];T[i*3+1]=v[1];T[i*3+2]=v[2]}
      const IA=g.index&&g.index.array;J.T=T;J.I=IA&&typeof IA.length==='number'&&IA.length>0?IA:null;J.n=J.I?J.I.length:nv;J.tmp=new Map();J.q=0;if(!(J.n>0)){VQ.shift();continue}}
    const T=J.T,I=J.I,tmp=J.tmp,st=VOXC*0.7;let c=0;
    while(J.q+2<J.n&&c<60000&&performance.now()-t0<3.5){const a=(I?I[J.q]:J.q)*3,b=(I?I[J.q+1]:J.q+1)*3,d=(I?I[J.q+2]:J.q+2)*3;J.q+=3;c++;
      const ex=T[b]-T[a],ey=T[b+1]-T[a+1],ez=T[b+2]-T[a+2],fx=T[d]-T[a],fy=T[d+1]-T[a+1],fz=T[d+2]-T[a+2];const L=Math.max(Math.hypot(ex,ey,ez),Math.hypot(fx,fy,fz),Math.hypot(fx-ex,fy-ey,fz-ez));
      if(L<1e-4)continue;const ny0=Math.abs(ex*fz-ez*fx)/(Math.hypot(ey*fz-ez*fy,ez*fx-ex*fz,ex*fy-ey*fx)||1),n=Math.min(160,Math.max(1,Math.ceil(L/(ny0>0.9?VOXC*0.95:st))));c+=n*n/2;
      for(let i=0;i<=n;i++)for(let j=0;j<=n-i;j++){const u=i/n,w=j/n,x=T[a]+ex*u+fx*w,y=T[a+1]+ey*u+fy*w,z=T[a+2]+ez*u+fz*w,k=vkey(Math.floor(x/VOXC),Math.floor(z/VOXC));let A=tmp.get(k);if(!A){A=[];tmp.set(k,A)}A.push(y)}}
    if(J.q+2>=J.n){VQ.shift();let ks=VOWN.get(J.owner);if(!ks){ks=new Set();VOWN.set(J.owner,ks)}
      for(const [k,A] of tmp){A.sort((p,q)=>p-q);const L=VOX.get(k)||[];let a0=A[0],b0=A[0];for(let i=1;i<=A.length;i++){const y=A[i];if(i<A.length&&y-b0<=0.45){b0=y;continue}L.push({o:J.owner,a:a0-0.08,b:b0+0.08});if(i<A.length){a0=y;b0=y}}VOX.set(k,L);ks.add(k)}
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
    for(const h of v.houses){if(!h.core||Math.abs(h.x-x)>14||Math.abs(h.z-z)>14)continue;if(y>h.top+6.5||y<h.top-0.5)continue;const k=h.core,c=Math.cos(h.rot),s=Math.sin(h.rot),dx=x-h.cx,dz=z-h.cz,lx=dx*c-dz*s,lz=dx*s+dz*c;if(Math.abs(lx)<k.w/2&&Math.abs(lz)<k.d/2)return true}
    if(v.cols)for(const [cx,cz,hw,hd,top] of v.cols)if(y<top-0.05&&Math.abs(x-cx)<hw&&Math.abs(z-cz)<hd)return true}
  for(const s of structs.values()){if(!s||!s.cols||Math.abs(s.x-x)>48||Math.abs(s.z-z)>48)continue;for(const [cx,cz,hw,hd,top] of s.cols)if(y<top-0.05&&Math.abs(x-cx)<hw&&Math.abs(z-cz)<hd)return true}
  return false}
function villageCollide(p){
  for(const v of villages.values()){if(!v||Math.abs(v.x-p.x)>45+(v.Hs||0)||Math.abs(v.z-p.z)>45+(v.Hs||0))continue;
    for(const h of v.houses){if(!h.core||Math.abs(h.x-p.x)>14||Math.abs(h.z-p.z)>14)continue;const k=h.core,c=Math.cos(h.rot),s=Math.sin(h.rot);
      // podest działki: niski można wejść, wysoki blokuje
      {const dx=p.x-h.x,dz=p.z-h.z;let lx=dx*c-dz*s,lz=dx*s+dz*c;const ex=k.pw/2+PR-Math.abs(lx),ez=k.pd/2+PR-Math.abs(lz);
       if(ex>0&&ez>0&&p.y<h.top-0.05){if(h.top-p.y<=1.05&&player.ground)p.y=h.top;else{if(ex<ez)lx+=Math.sign(lx||1)*ex;else lz+=Math.sign(lz||1)*ez;p.x=h.x+lx*c+lz*s;p.z=h.z-lx*s+lz*c}}}
      if(p.y>h.top+7)continue;
      {const dx=p.x-h.cx,dz=p.z-h.cz;let lx=dx*c-dz*s,lz=dx*s+dz*c;const ex=k.w/2+PR-Math.abs(lx),ez=k.d/2+PR-Math.abs(lz);
       if(ex>0&&ez>0){if(ex<ez)lx+=Math.sign(lx||1)*ex;else lz+=Math.sign(lz||1)*ez;p.x=h.cx+lx*c+lz*s;p.z=h.cz-lx*s+lz*c}}}
    for(const q of (v.props||[])){const dx=p.x-q.x,dz=p.z-q.z,d=Math.hypot(dx,dz),mn=q.r+PR;if(d<mn&&d>1e-4&&p.y<v.h+3){p.x=q.x+dx/d*mn;p.z=q.z+dz/d*mn}}
    if(v.cols)for(const [cx,cz,hw,hd,top] of v.cols){if(p.y>=top-0.05)continue;const ex=hw+PR-Math.abs(p.x-cx),ez=hd+PR-Math.abs(p.z-cz);if(ex>0&&ez>0){if(ex<ez)p.x+=Math.sign(p.x-cx||1)*ex;else p.z+=Math.sign(p.z-cz||1)*ez}}}
}
function villageGround(x,z,y){let best=null;
  for(const v of villages.values()){if(!v||Math.abs(v.x-x)>45+(v.Hs||0)||Math.abs(v.z-z)>45+(v.Hs||0))continue;
    for(const h of v.houses){if(!h.core||h.top>y+0.3||Math.abs(h.x-x)>14||Math.abs(h.z-z)>14)continue;const c=Math.cos(h.rot),s=Math.sin(h.rot),dx=x-h.x,dz=z-h.z,lx=dx*c-dz*s,lz=dx*s+dz*c;
      if(Math.abs(lx)<h.core.pw/2&&Math.abs(lz)<h.core.pd/2&&(best===null||h.top>best))best=h.top}}
  return best}
function inVillage(x,z,r){for(const v of villages.values())if(v&&Math.hypot(v.x-x,v.z-z)<r+(v.city?v.Hs*1.2:0))return v;return null}

// ---------- questy ----------
const COLLECT={2:['Zioła lecznicze','#7dd87d'],3:['Grzyby leśne','#d9a27c'],4:['Kwiaty pustyni','#ffd34d'],5:['Kryształy mrozu','#8fe9ff'],6:['Bryłki rudy','#c9a64a'],7:['Bagienne lilie','#d96bd0'],1:['Perłowe muszle','#f2ead8']};
function canOfferQuest(n){return n.qg&&tierOf(W.rep[n.race])>0&&!W.quests.some(q=>q.giver===n.id)&&W.quests.length<6}
function genQuest(n){
  const v=villages.get(n.vid),cnt=W.qdone[n.id]||0,r=rngOf('q'+n.id+'#'+cnt),lvl=v.lvl;
  let type=rpick(r,n.role==='starszy'?['kill','boss','deliver','collect','clear']:['kill','collect','deliver','kill','clear']);
  const tgtS=[...structs.values()].filter(s=>s&&s.type!=='kurhan'&&!s.friendly&&s.type!=='zamczysko'&&s.type!=='grota'&&!W.opened[s.id]&&Math.hypot(s.x-v.x,s.z-v.z)<500).sort((a,b)=>Math.hypot(a.x-v.x,a.z-v.z)-Math.hypot(b.x-v.x,b.z-v.z))[0];
  if(type==='clear'&&!tgtS)type='kill';
  const others=[...villages.values()].filter(o=>o&&o.id!==v.id).sort((a,b)=>Math.hypot(a.x-v.x,a.z-v.z)-Math.hypot(b.x-v.x,b.z-v.z));
  if(type==='deliver'&&!others.length)type='kill';
  const q={id:n.id+'#'+cnt,giver:n.id,gname:n.name,vid:v.id,vname:v.name,race:v.race,type,lvl,have:0,done:false};
  const types=BIOME_E[v.b]||['slime','wilk','goblin'];
  if(type==='kill'){q.et=rpick(r,types);q.n=6+Math.floor(r()*6);q.title='Polowanie: '+EDEF[q.et].n;q.desc=`${n.name} prosi o przetrzebienie stworzeń w okolicy. Ubij: ${EDEF[q.et].n} ×${q.n}.`}
  else if(type==='collect'){const c=COLLECT[v.b]||COLLECT[2];q.item=c[0];q.col=c[1];q.n=5;q.pts=[];for(let i=0;i<5;i++){const a=r()*6.28,d=45+r()*55;q.pts.push([v.x+Math.cos(a)*d,v.z+Math.sin(a)*d,0])}q.title='Zbieranie: '+q.item;q.desc=`${n.name} potrzebuje: ${q.item} ×5. Rosną w okolicy osady, świecą z daleka.`}
  else if(type==='deliver'){const o=others[Math.min(others.length-1,Math.floor(r()*Math.min(2,others.length)))],tn=o.npcs.find(x=>x.role==='starszy');q.to=tn.id;q.toName=tn.name;q.toVid=o.id;q.toV=o.name;q.mark=[o.x,o.z];q.n=1;q.title='Przesyłka do: '+o.name;q.desc=`Zanieś list od ${n.name} do ${tn.name} w osadzie ${o.name}.`}
  else if(type==='clear'){q.sid=tgtS.id;q.mark=[tgtS.x,tgtS.z];q.n=1;q.lvl=tgtS.lvl;q.title='Oczyść: '+tgtS.name;q.desc=`${n.name} prosi o rozprawienie się z zagrożeniem: ${tgtS.name.toLowerCase()} niedaleko osady. Pokonaj strażników i otwórz skrzynię.`}
  else {q.et=rpick(r,types);const a=r()*6.28,d=75+r()*45;q.mark=[v.x+Math.cos(a)*d,v.z+Math.sin(a)*d];q.n=1;q.bname='Herszt '+rpick(r,['Kłoponóg','Szczerbaty','Krwawy Kieł','Kamienne Oko','Czarny Pazur','Ostatni Wyjec']);q.title='Łowy na herszta';q.desc=`Groźny przywódca stworzeń, ${q.bname} (${EDEF[q.et].n}), grasuje niedaleko osady. Pokonaj go.`;q.lvl=lvl+1}
  const mult={kill:1,collect:0.9,deliver:1.1,boss:1.8,clear:1.5}[type];
  q.rw={xp:Math.round(45*lvl*mult),gold:Math.round(9*lvl*mult),rep:Math.round(18*mult),item:type==='boss'||r()<0.35};
  return q;
}
function questKill(L){
  for(const q of W.quests){if(q.done)continue;
    if(q.type==='kill'&&L.et===q.et){q.have++;if(q.have>=q.n){q.done=true;toast('Zadanie wykonane: '+q.title+' — wróć do: '+q.gname,'#ffd34d')}else toast(q.title+': '+q.have+'/'+q.n,'#d8d8d8')}
    if(q.type==='boss'&&L.qid===q.id){q.have=1;q.done=true;toast('Herszt pokonany! Wróć do: '+q.gname,'#ffd34d')}}
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
      if(o&&d<1.6&&!P2.dead){pt[2]=1;q.have++;scene.remove(o.m);qPick.splice(qPick.indexOf(o),1);toast(q.item+': '+q.have+'/'+q.n,q.col);if(q.have>=q.n){q.done=true;toast('Zebrane! Wróć do: '+q.gname,'#ffd34d')}saveW();renderJournalIfOpen()}});
  }
  for(let i=qPick.length-1;i>=0;i--){const o=qPick[i];o.m.rotation.y+=dt;if(!W.quests.some(q=>o.key.startsWith(q.id+':'))){scene.remove(o.m);qPick.splice(i,1)}}
  // herszt: poproś hosta o pojawienie się, gdy jesteś blisko
  qspawnT-=dt;
  for(const q of W.quests){if(q.type!=='boss'||q.done||qspawnT>0)continue;
    if(Math.hypot(q.mark[0]-player.p.x,q.mark[1]-player.p.z)<55&&![...enemies.values()].some(e=>e.qid===q.id)){qspawnT=4;const def={id:q.id,et:q.et,lvl:q.lvl,x:q.mark[0],z:q.mark[1],name:q.bname};
      if(isAuth())spawnQuestBoss(def);else NET.tr.send({t:'qspawn',from:NET.id,def})}}
}
function spawnQuestBoss(def){
  if([...enemies.values()].some(e=>e.qid===def.id))return;
  let x=def.x,z=def.z,h=colAt(x,z);
  for(let i=0;i<24&&(h===null||h<WATER);i++){x=def.x+Math.cos(i)*i;z=def.z+Math.sin(i)*i;h=colAt(x,z)}
  if(h===null||h<WATER)return;
  const d0=EDEF[def.et]||EDEF.wilk,max=Math.round(HPM*d0.hp*(1+0.38*(def.lvl-1))*5);
  const e={id:eSeq++,t:def.et,lvl:def.lvl,elite:true,p:new THREE.Vector3(x,h,z),vx:0,vz:0,ry:0,hp:max,max,st:0,cd:0,wind:0,tgt:null,prov:0,wan:null,dieT:0,flash:0,speed:0,qid:def.id,qn:def.name};
  addEnemyModel(e);enemies.set(e.id,e);
}

// ---------- dialogi ----------
let dlg=null;
function closeDialog(){dlg=null;$('dlg').hidden=true}
function openDialog(n){dlg={n};try{document.exitPointerLock()}catch(e){}dlgRoot()}
function dlgShow(text,opts){
  const n=dlg.n,t=tierOf(W.rep[n.race]);
  $('dlgname').textContent=n.name;$('dlgrole').textContent=n.roleN+' · '+RACES[n.race].n+' · ';const s=document.createElement('span');s.textContent=TIERS[t][1]+' ('+Math.round(W.rep[n.race])+')';s.style.color=TIERS[t][2];$('dlgrole').appendChild(s);
  $('dlgtext').textContent=text;dlg.opts=opts;
  $('dlgopts').innerHTML=opts.map((o,i)=>`<button data-o="${i}" ${o[2]?'disabled':''}><kbd>${i+1}</kbd> ${esc(o[0])}</button>`).join('');$('dlg').hidden=false;
}
$('dlgopts').onclick=e=>{const b=e.target.closest('[data-o]');if(b&&dlg)dlg.opts[+b.dataset.o][1]()};
function greet(n){const t=tierOf(W.rep[n.race]),R=RACES[n.race],r=rngOf('g'+n.id+Math.floor(Date.now()/60000));
  return [['Odejdź. Nie chcemy tu takich jak ty.'],['Czego chcesz? Mów szybko.','Mam na ciebie oko, obcy.'],[R.neutral,'Witaj, wędrowcze.','Bezpiecznej drogi. Czym mogę służyć?'],['O, znowu ty! Miło cię widzieć.','Witaj, przyjacielu.'],['Nasz obrońca! Zawsze jesteś tu mile widziany.'],['To zaszczyt, że do nas zaglądasz, bohaterze!']][t].map(x=>x)[Math.floor(r()*([1,2,3,2,1,1][t]))]}
const bye=['Do widzenia.',closeDialog];

function portList(){return [...villages.values()].filter(v=>v&&v.city&&v.pier&&W.seen[v.id])}
function dlgFerry(){const here=dlg.n,me=villages.get(here.vid),L=portList().filter(v=>v!==me);const o=L.slice(0,8).map(v=>{const d=Math.hypot(v.x-player.p.x,v.z-player.p.z),pr=Math.round(20+d/18);return[`${v.name} (${Math.round(d)} kroków) — ${pr} zł`,()=>{if((INV.gold||0)<pr)return dlgRoot('Na prom brakuje ci złota.');INV.gold-=pr;saveInv();updHud();closeDialog();ferryTo(v)}]});
  if(!o.length)return dlgShow('Nie znam jeszcze innych portów, do których mógłbyś popłynąć. Odkryj inne miasta portowe, a zabiorę cię tam promem.',[['Wróć.',()=>dlgRoot()]]);o.push(['Wróć.',()=>dlgRoot()]);dlgShow('Prom odpływa, kiedy tylko zechcesz. Dokąd płyniemy?',o)}
function ferryTo(v){if(VH.mode===1)exitBoat();const ps=[[0,-1],[0,1],[-1,0],[1,0]][v.port],d=v.Hs-8,x=v.x+ps[0]*d,z=v.z+ps[1]*d;player.p.set(x,(colAt(x,z)??v.h)+1.2,z);player.v.set(0,0,0);camY=null;holdIfUnloaded();toast('⛵ Prom przybija do portu: '+v.name,'#cfe8ff');sfx('splash',0.6);for(const f of FOL)f.p.set(x+1.5,player.p.y,z+1.5);if(PET)PET.p.set(x-1.5,player.p.y,z-1.5)}
function buyRod(){if(INV.rod)return dlgRoot();if((INV.gold||0)<40)return dlgRoot('Wędka kosztuje 40 złota.');INV.gold-=40;INV.rod=1;saveInv();updHud();sfx('coin');dlgRoot('Proszę, wędka. Stań nad wodą albo w łodzi i naciśnij U, żeby zarzucić.')}
function dlgRoot(msg){
  const n=dlg.n,t=tierOf(W.rep[n.race]),opts=[];
  if(t===0){dlgShow(greet(n),[bye]);return}
  const dq=W.quests.find(q=>q.type==='deliver'&&q.to===n.id&&!q.done);
  if(dq)opts.push(['Mam dla ciebie list od: '+dq.gname,()=>{dq.done=true;finishQuest(dq,n,false)}]);
  const mine=W.quests.find(q=>q.giver===n.id);
  if(mine&&mine.done)opts.push(['Zadanie wykonane.',()=>dlgReward(mine)]);
  else if(mine)opts.push(['O moim zadaniu…',()=>dlgShow(mine.desc+(mine.n>1?` Postęp: ${mine.have}/${mine.n}.`:''),[['Porzucam to zadanie.',()=>{W.quests.splice(W.quests.indexOf(mine),1);addRep(n.race,-3);saveW();dlgRoot(n.fem?'Szkoda. Myślałam, że można na tobie polegać.':'Szkoda. Myślałem, że można na tobie polegać.')}],['Wracam do pracy.',()=>dlgRoot()]])]);
  if(canOfferQuest(n))opts.push(['Masz dla mnie jakieś zadanie?',()=>dlgOffer()]);
  if(n.role==='kupiec')opts.push(['Pokaż towary.',()=>dlgShop()],['Chcę coś sprzedać.',()=>dlgSell()],['Chcę kupić wierzchowca.',()=>dlgMounts()]);
  if(n.role==='kowal')opts.push(['Ulepsz mój ekwipunek.',()=>dlgSmith()]);
  if(n.role==='portowy')opts.push(['Chcę popłynąć promem.',()=>dlgFerry()],[MNT.sail?'(Twoja łódź ma już żagiel)':'Żagiel do mojej łodzi — 900 zł',()=>{if(MNT.sail)return dlgRoot();if((INV.gold||0)<900)return dlgRoot('Żagiel kosztuje 900 złota.');INV.gold-=900;MNT.sail=1;LS.set('mounts',MNT);saveInv();updHud();sfx('coin');dlgRoot('Dobry wiatr! Twoja łódź pływa teraz o połowę szybciej.')}],[INV.rod?'(Masz już wędkę)':'Wędka — 40 zł',()=>buyRod()]);
  if((n.role==='portowy'||n.role==='kupiec')&&fishCount()>0)opts.push([`Sprzedaj ryby (${fishCount()} szt. — ${fishValue()} zł)`,()=>sellFish()]);
  if(n.role==='kupiec'&&!INV.rod)opts.push(['Wędka — 40 zł',()=>buyRod()]);
  if(n.role==='wedr')opts.push(['Kim jesteś?',()=>dlgBeggar()]);
  if(n.role==='najemnik'){if(n.merc)opts.push([`Dołącz do mnie (${n.merc.lvl} poz., ${WEAP[n.merc.w].n.toLowerCase()}) — ${n.merc.price} zł`,()=>hireMerc(n)]);else opts.push(['Jak się sprawujesz?',()=>dlgShow('Służę już innemu. Ale dzięki za pamięć.',[bye])])}
  opts.push(['Co słychać w okolicy?',()=>dlgRumor()]);
  opts.push(bye);
  dlgShow(msg||greet(n),opts);
}
function dlgOffer(){
  const n=dlg.n,q=genQuest(n);
  dlgShow(q.desc+` Nagroda: ${q.rw.gold} złota, ${q.rw.xp} PD${q.rw.item?' i przedmiot':''}.`,[
    ['Zajmę się tym.',()=>{W.quests.push(q);saveW();toast('Nowe zadanie: '+q.title,'#ffd34d');dlgRoot('Dziękuję. Wracaj, gdy skończysz.')}],
    ['Zrobię to, ale za podwójną stawkę.',()=>{q.rw.gold=Math.round(q.rw.gold*1.6);q.rw.rep=Math.round(q.rw.rep/2);q.greedy=1;W.quests.push(q);addKarma(-1);addRep(n.race,-3);toast('Nowe zadanie: '+q.title,'#ffd34d');dlgRoot('Chciwość to ciężki grzech… Niech będzie.')}],
    ['Może później.',()=>dlgRoot()]]);
}
function dlgReward(q){
  const n=dlg.n;
  dlgShow(`Dobra robota! Obiecana nagroda: ${q.rw.gold} złota i ${q.rw.xp} PD${q.rw.item?', do tego przedmiot':''}.`,[
    ['Przyjmuję nagrodę.',()=>finishQuest(q,n,false)],
    ['Zatrzymajcie złoto dla wioski.',()=>finishQuest(q,n,true)]]);
}
function finishQuest(q,n,gen){
  W.quests.splice(W.quests.indexOf(q),1);W.qdone[q.giver]=(W.qdone[q.giver]||0)+1;
  const rep=gen?q.rw.rep*2:q.rw.rep;addRep(q.race,rep);if(gen)addKarma(3);else{INV.gold+=q.rw.gold;toast('+'+q.rw.gold+' złota','#ffd34d')}
  if(!q.greedy)addKarma(1);gainXp(q.rw.xp);
  if(q.rw.item){const it=genItem(q.lvl,20);if(INV.bag.length<bagN()){INV.bag.push(it);toast(it.name,RAR[it.rar].c)}}
  saveInv();saveW();updHud();renderJournalIfOpen();
  dlgRoot(gen?'Twoja hojność nie zostanie zapomniana. Cała wioska będzie o tym mówić.':q.type==='deliver'?(n.fem?'List? Dziękuję, czekałam na wieści. Proszę, to za fatygę.':'List? Dziękuję, czekałem na wieści. Proszę, to za fatygę.'):'Należy ci się. Dziękujemy.');
}
function dlgRumor(){
  const n=dlg.n,v=villages.get(n.vid),R=RACES[n.race],r=rngOf('rum'+n.id+Math.floor(Date.now()/120000)),lines=[];
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
const pmod=n=>PRICE[tierOf(W.rep[n.race])]*(hasP('handlarz')?0.85:1);
function shopStock(n){const r=rngOf('shop'+n.id+Math.floor(Date.now()/600000)),v=villages.get(n.vid);if(!dlg.stock||dlg.stockKey!==n.id){dlg.stock=(n.rare?[0,1,2,3,4,5]:[0,1,2,3]).map(i=>{const it=genItem(Math.max(v?v.lvl:1,HERO.lvl-1),n.rare?8:i===3?4:0);return it});dlg.stockKey=n.id}return dlg.stock}
function dlgShop(){
  const n=dlg.n,pm=pmod(n),pot=Math.round(12*Math.max(1,HERO.lvl*0.6)*pm),st=shopStock(n);
  const bn=bagN(),bc=Math.round(160*Math.pow((bn-24)/6,1.7)*pm);const opts=bn<60?[[`🎒 Większy plecak: ${bn} → ${bn+6} miejsc — ${bc} zł`,()=>{if(INV.gold<bc)return toast('Za mało złota','#ff8a7a');INV.gold-=bc;INV.bagN=bn+6;saveInv();updHud();toast('Plecak powiększony: '+INV.bagN+' miejsc','#ffd34d');sfx('coin');dlgShop()}]]:[];opts.push([`Mikstura leczenia — ${pot} zł`,()=>{if(INV.gold<pot)return toast('Za mało złota','#ff8a7a');INV.gold-=pot;INV.pot++;saveInv();updHud();dlgShop()}]);
  const v=villages.get(n.vid),fr=rngOf('food'+n.id+Math.floor(Date.now()/600000)),near=[...new Set([...(BIOME_P[v&&v.b]||[]),...VILLAGE_P,'kon','owca'])].map(t=>FOODOF[t]).filter(Boolean),others=Object.keys(FOODS).filter(k=>!near.includes(k));
  const sel=[...near.slice(0,4),rpick(fr,others),rpick(fr,others)].filter((k,i,a)=>a.indexOf(k)===i);
  for(const k of sel){const pr=Math.round(FOODS[k][2]*pm*(1+HERO.lvl*0.04));opts.push([`${foodName(k)} (dla: ${foodFor(k)}) — ${pr} zł · masz ${INV.food[k]||0}`,()=>{if(INV.gold<pr)return toast('Za mało złota','#ff8a7a');INV.gold-=pr;INV.food[k]=(INV.food[k]||0)+1;saveInv();updHud();dlgShop()}])}
  st.forEach((it,i)=>{const pr=Math.round(itemVal(it)*5*pm);opts.push([`${it.name} (${RAR[it.rar].n}, poz. ${it.lvl}) — ${pr} zł`,()=>{if(INV.gold<pr)return toast('Za mało złota','#ff8a7a');if(INV.bag.length>=bagN())return toast('Plecak pełny','#ff8a7a');INV.gold-=pr;INV.bag.push(it);st.splice(i,1);saveInv();updHud();toast('Kupiono: '+it.name,RAR[it.rar].c);dlgShop()}])});
  opts.push(['Wróć.',()=>dlgRoot()]);
  dlgShow(`Masz ${INV.gold} złota.${pm<1?' Dla przyjaciół mam lepsze ceny.':pm>1?' Obcym sprzedaję drożej.':''}`,opts);
}
function dlgSell(pg){
  const n=dlg.n,pm=pmod(n),opts=[],PP=9,np=Math.max(1,Math.ceil(INV.bag.length/PP));pg=Math.min(Math.max(0,pg|0),np-1);
  INV.bag.slice(pg*PP,pg*PP+PP).forEach((it,j)=>{const i=pg*PP+j,pr=Math.round(itemVal(it)*0.45/pm);opts.push([`Sprzedaj: ${it.name}${it.up?' +'+it.up:''} — ${pr} zł`,()=>{if(INV.bag[i]!==it)return dlgSell(pg);INV.bag.splice(i,1);INV.gold+=pr;saveInv();updHud();sfx('coin');dlgSell(pg)}])});
  if(np>1){if(pg<np-1)opts.push([`Następne → (strona ${pg+2}/${np})`,()=>dlgSell(pg+1)]);if(pg>0)opts.push([`← Poprzednie (strona ${pg}/${np})`,()=>dlgSell(pg-1)])}
  opts.push(['Wróć.',()=>dlgRoot()]);
  dlgShow(INV.bag.length?`Pokaż, co masz. (Masz ${INV.gold} złota.)`:'Twój plecak jest pusty.',opts);
}
function dlgSmith(){
  const n=dlg.n,pm=pmod(n),opts=[];
  for(const [k,nm] of SLOTS){const it=INV.eq[k];if(!it)continue;const up=it.up||0;
    if(up>=10){opts.push([`${it.name} +10 — maksymalnie ulepszone`,()=>{},true]);continue}
    const cost=Math.round(25*it.lvl*Math.pow(up+1,1.5)*(it.rar+1)*0.6*pm);
    opts.push([`${it.name}${up?' +'+up:''} → +${up+1} — ${cost} zł`,()=>{if(INV.gold<cost)return toast('Za mało złota','#ff8a7a');INV.gold-=cost;it.up=up+1;afterInv();toast(it.name+' +'+it.up,RAR[it.rar].c);dlgSmith()}])}
  opts.push(['⚒ Przekuj przedmiot na wyższą rzadkość…',()=>dlgReforge()],['💎 Osadź klejnot…',()=>dlgGem()],['✨ Zaczaruj broń (ogień, wybuch, mróz, trucizna, burza)…',()=>dlgEnchant()]);
  opts.push(['Wróć.',()=>dlgRoot()]);
  dlgShow(`Każde ulepszenie to +10% obrażeń, obrony i zdrowia przedmiotu, do +10. Masz ${INV.gold} złota.`,opts);
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
  if(jtab==='q'){$('jbody').innerHTML=W.quests.length?W.quests.map((q,i)=>`<div class="jq${q.done?' done':''}"><b>${esc(q.title)}</b><span>${esc(q.desc)}</span><span class="jm">${q.done?(q.type==='deliver'?'Dostarczone':'Gotowe — wróć do: '+esc(q.gname)+' ('+esc(q.vname)+')'):(q.n>1?'Postęp: '+q.have+'/'+q.n:'W toku')} · nagroda ${q.rw.gold} zł, ${q.rw.xp} PD</span><button data-ab="${i}">Porzuć</button></div>`).join(''):'<p class="sub2">Brak zadań. Porozmawiaj z mieszkańcami wiosek — nad tymi, którzy mają zadanie, wisi wykrzyknik na mapie.</p>'}
  else{$('jbody').innerHTML=`<p>Tytuł: <b>${title()}</b> · Karma: ${W.karma} · Sława: ${W.fame}</p>`+Object.entries(RACES).map(([k,R])=>{const v=W.rep[k]||0,t=tierOf(v);return `<div class="jr"><span>${R.n}</span><i><b style="width:${Math.max(0,Math.min(100,(v+100)/400*100))}%;background:${TIERS[t][2]}"></b></i><span style="color:${TIERS[t][2]}">${TIERS[t][1]} (${Math.round(v)})</span></div>`}).join('')+'<p class="sub2">Renomę zdobywasz zadaniami, obroną wiosek i dobrymi uczynkami. Chciwość i okrucieństwo ją obniżają. Wyższa renoma to lepsze ceny; przy „Wrogi” mieszkańcy nie chcą z tobą rozmawiać.</p>'}
}
function renderJournalIfOpen(){if(!$('journal').hidden)renderJournal()}
function toggleJournal(){const j=$('journal');j.hidden=!j.hidden;if(!j.hidden){try{document.exitPointerLock()}catch(e){}renderJournal()}}
$('jbody').onclick=e=>{const b=e.target.closest('[data-ab]');if(!b)return;const q=W.quests[+b.dataset.ab];W.quests.splice(+b.dataset.ab,1);addRep(q.race,-3);saveW();renderJournal()};
$('jtabq').onclick=()=>{jtab='q';renderJournal()};$('jtabr').onclick=()=>{jtab='r';renderJournal()};$('jclose').onclick=toggleJournal;$('jbtn').onclick=toggleJournal;
function questMarks(){const l=[];for(const q of W.quests){if(q.done&&q.type!=='deliver'){const v=villages.get(q.vid);if(v)l.push([v.x,v.z,'#ffd34d'])}else if(!q.done&&q.mark)l.push([q.mark[0],q.mark[1],'#ffd34d']);else if(!q.done&&q.pts)for(const p of q.pts)if(!p[2])l.push([p[0],p[1],q.col])}return l}

function villSeen(v){return v&&!!W.seen[v.id]}
function npcMarks(){
  for(const v of villages.values()){if(!v||!v.g)continue;for(const n of v.npcs){if(!n.m||!n.mark)continue;const d=Math.hypot(n.x-player.p.x,n.z-player.p.z);if(d>40)continue;
    const s=project(n.x,n.m.position.y+2.75*RACES[n.race].hs,n.z);if(!s)continue;const b=barFor('n'+n.id,'mk');b.firstChild.textContent=n.mark;b.style.transform=`translate(${s[0]}px,${s[1]}px) translate(-50%,-100%)`}}
}

Object.assign(PROJ,{poison:{spd:22,g:5,life:2,geo:()=>boxes([[0,0,0,0.34,0.34,0.34,'#7dff8a'],[0,0,-0.22,0.2,0.2,0.3,'#3f9a3a']])},curse:{spd:18,g:0,life:2.2,geo:()=>boxes([[0,0,0,0.36,0.36,0.36,'#c48aff'],[0,0,-0.25,0.2,0.2,0.34,'#7a3ad0']])}});
// =================== ETAP 5: struktury, bossowie (logika) ===================
const SR=192, structs=new Map(), strReq=new Set(), strState=new Map();
const STRN={ruiny:'Ruiny',oboz:'Obóz bandytów',wieza:'Wieża strażnicza',kurhan:'Kurhan',zamczysko:'Mroczne zamczysko',grota:'Smocza grota',gospoda:'Gospoda przy trakcie',kupcy:'Obóz kupców',pustelnia:'Pustelnia',swiatynia:'Świątynia'};
const STRC={ruiny:'#b0aaa0',oboz:'#e5483b',wieza:'#9fb6c8',kurhan:'#b874ff',zamczysko:'#ff3a5a',grota:'#ff8a2e',gospoda:'#7dd87d',kupcy:'#7dd87d',pustelnia:'#7dd87d',swiatynia:'#7dd87d'};
Object.assign(STRN,{wrak:'Zatopiony wrak',legowisko:'Leże olbrzyma',krag:'Kamienny krąg',gniazdo:'Pajęcze gniazdo',kopalnia:'Opuszczona kopalnia',oltarz:'Ołtarz kultystów',wiatrak:'Opuszczony wiatrak'});Object.assign(STRC,{wrak:'#3f7db5',legowisko:'#ff6b3a',krag:'#8ad8ff',gniazdo:'#d8d0b8',kopalnia:'#d9b23a',oltarz:'#c82a3a',wiatrak:'#c8a870'});
const FRIENDLY=new Set(['gospoda','kupcy','pustelnia','swiatynia']);Object.assign(STRN,{loch:'Wejście do lochu',jaskinia:'Jaskinia'});Object.assign(STRC,{loch:'#c87aff',jaskinia:'#a08060'});
const BOSSKEY={krol:'krol_s',matka:'matka',kolos:'kolos',faraon:'faraon'};
function hsAt(s,x,z){if(!s.fl){let mn=null;for(const [a,b] of [[-0.45,-0.45],[0.45,-0.45],[-0.45,0.45],[0.45,0.45]]){const h=colAt(x+a,z+b);if(h===null){mn=null;break}mn=mn===null?h:Math.min(mn,h)}if(mn!==null)return mn}const i=Math.max(0,Math.min(8,Math.round((x-s.x)/3)+4)),j=Math.max(0,Math.min(8,Math.round((z-s.z)/3)+4));return s.hs[j*9+i]}
function friendlyVillage(s){const b=s.b,race=(b===7||b===9)?'saurianie':(b===19||b===20)?'drowy':(b===3||b===10||b===11)?'elfy':(b===5||b===6||b===12)?'krasnoludy':(b===4||b===8)?'orkowie':'ludzie',R=RACES[race],r=rngOf('fv'+s.id);
  const v={id:s.id,x:s.x,z:s.z,h:s.h,b,race,small:1,houses:[],npcs:[],lvl:s.lvl,name:STRN[s.type],cols:[]};
  const H=(type,func,dz)=>{const h={x:s.x,z:s.z+(dz||0),rot:0,top:s.h,bot:s.h-1,type,func,v:Math.floor(r()*5)};const c=houseCore(h);h.core=c;h.cx=h.x+c.ox;h.cz=h.z+c.oz;v.houses.push(h);return h};
  const N=(role,roleN,dx,dz,qg)=>{const fem=r()<0.45,pool=fem?R.f:R.m;v.npcs.push({id:s.id+':'+role+v.npcs.length,vid:s.id,role,fem,name:pool[Math.floor(r()*pool.length)],roleN:roleN||ROLE[role][fem?1:0],x:s.x+dx,z:s.z+dz,ry:0,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth),race,qg:!!qg})};
  if(s.type==='gospoda'){H('karczma','karczma',-3);N('kupiec','Karczmarz',2.5,4.5);N('wedr',null,-3,5.5);N('mieszk','Gość',4,6.5,r()<0.5)}
  if(s.type==='kupcy'){v.camp=1;N('kupiec',null,-3.5,0);N('kupiec',null,3.5,0);N('straz',null,0,-4);N('wedr',null,0,4.5,true)}
  if(s.type==='pustelnia'){H('chata','dom',-2);N('starszy','Pustelnik',1.5,4.2,true)}
  if(s.type==='swiatynia'){H('wiezaDom','kaplica',-3);v.temple=1;N('starszy','Kapłan',2,4.5,true);N('mieszk','Pielgrzym',-2.5,5)}
  return v}
function onStr(list){for(const {gx,gz,s} of list){const k=gx+'_'+gz;strReq.delete(k);if(s){const sp=spawnPt();s.lvl=Math.max(1,1+Math.floor(Math.hypot(s.x-sp[0],s.z-sp[2])/260));
  if(s.type==='kurhan'){s.bossT=BOSSKEY[BOSS_BY_BIOME[s.b]||'krol'];s.name='Kurhan: '+EDEF[s.bossT].n}else s.name=STRN[s.type];
  if(s.type==='zamczysko'){s.bossT=[3,9,10,11].includes(s.b)?'prastary':strHash(s.id)%2?'lich':'krol_troll';s.name='Zamczysko: '+EDEF[s.bossT].n}
  if(s.type==='grota'){s.bossT='smok';s.name=STRN.grota}
  if(s.type==='legowisko'){s.bossT=hugeFor(s.b);s.name='Leże: '+((EDEF[s.bossT]&&EDEF[s.bossT].n)||HUGEB[s.bossT].n)}
  if(FRIENDLY.has(s.type)){s.friendly=1;const fv=friendlyVillage(s);villages.set(s.id,fv)}s.cols=[]}structs.set(k,s)}}
function clearStructs(){for(const s of structs.values())if(s&&s.g)unbuildStruct(s);structs.clear();strReq.clear()}
const strSeen=s=>s&&(W.seen[s.id]||s.g&&Math.hypot(s.x-player.p.x,s.z-player.p.z)<150);
let sreqT={};
function strTick(){
  if(!S.spawn)return;const gx=Math.floor(player.p.x/SR),gz=Math.floor(player.p.z/SR),need=[];
  for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){const k=(gx+dx)+'_'+(gz+dz);if(!structs.has(k)&&!strReq.has(k)){need.push([gx+dx,gz+dz]);strReq.add(k)}}
  if(need.length){const w=workers[0];w.busy++;w.postMessage({type:'str',seed:S.seed,cells:need,sx:S.spawn[0],sz:S.spawn[2],id:reqId++})}
  const lim=S.rd*C+40,now=Date.now();
  for(const s of structs.values()){if(!s)continue;const d=Math.hypot(s.x-player.p.x,s.z-player.p.z);
    if(d<lim&&!s.g){buildStruct(s);mapCaptureStruct(s)}else if(d>lim+80&&s.g)unbuildStruct(s);
    if(d<150&&!W.seen[s.id]){W.seen[s.id]=1;saveW();toast('Odkryto: '+s.name,STRC[s.type])}
    // strażnicy / boss: prośba do hosta
    if(s.friendly||s.type==='loch'||s.type==='jaskinia'||s.type==='wrak')continue;const trig=s.type==='kurhan'?20:s.type==='grota'?30:s.type==='zamczysko'?55:s.type==='legowisko'?38:45;
    if(d<trig&&!P2.dead&&!guardsAlive(s)&&(!sreqT[s.id]||now-sreqT[s.id]>5000)){sreqT[s.id]=now;const def={id:s.id,type:s.type,x:s.x,z:s.z,lvl:s.lvl,b:s.b,boss:s.bossT||null};
      if(isAuth())spawnStructGuards(def);else NET.tr.send({t:'sspawn',from:NET.id,def})}}
}
const guardsAlive=s=>{for(const e of enemies.values())if(e.sid===s.id&&e.st!==2)return true;return false};
const ERAR=[{n:'',hp:1,dmg:1,xp:1,sc:1},{n:'Niezwykły',hp:1.3,dmg:1.12,xp:1.5,sc:1.04},{n:'Rzadki',hp:1.7,dmg:1.28,xp:2.2,sc:1.08},{n:'Epicki',hp:2.4,dmg:1.5,xp:3.5,sc:1.13},{n:'Legendarny',hp:3.4,dmg:1.8,xp:6,sc:1.2}];
function rollERar(){const q=Math.random();return q<0.012?4:q<0.045?3:q<0.12?2:q<0.3?1:0}
function makeE(t,lvl,elite,x,y,z,extra){const d0=EDEF[t],rar=(d0.boss||(extra&&(extra.car||extra.qid||extra.rar===0))||t==='woz')?0:rollERar(),max=Math.round((d0.passive?1:HPM)*d0.hp*(1+0.38*(lvl-1))*(elite&&!d0.boss?3:1)*ERAR[rar].hp);
  const e={id:eSeq++,t,lvl,elite,rar,p:new THREE.Vector3(x,y,z),vx:0,vz:0,ry:Math.random()*6,hp:max,max,st:0,cd:0,wind:0,tgt:null,prov:0,wan:null,dieT:0,flash:0,speed:0,...extra};
  addEnemyModel(e);enemies.set(e.id,e);return e}
function spawnStructGuards(def){
  for(const e of enemies.values())if(e.sid===def.id&&e.st!==2)return;
  const st=strState.get(def.id);if(st&&st.cleared&&Date.now()-st.cleared<(def.type==='legowisko'||def.type==='kurhan'||def.type==='zamczysko'||def.type==='grota'?900e3:600e3))return;
  let list;
  if(def.space){for(const [t,x,y,z,boss] of spaceSpawnList(def))makeE(t,def.lvl+(boss?2:0),boss,x,y+0.05,z,{sid:def.id,home:[x,z]});strState.set(def.id,{cleared:0});return}
  if(def.type==='kurhan')list=[def.boss].concat(def.boss==='krol_s'?['szkielet','szkielet']:[]);
  else if(def.type==='zamczysko')list=[def.boss].concat(def.boss==='lich'?['upior','upior','szkielet','lucznik_s','szkielet','lucznik_s']:def.boss==='prastary'?['drzewiec','wilkolak','drzewiec','wilk','wilk']:['ork','ork','troll','ork','lucznik_s','ork']);
  else if(def.type==='grota')list=[def.boss];
  else if(def.type==='legowisko'){const H=HUGEB[def.boss]||HUGEB.behemot;list=[def.boss].concat(H.m.filter(t=>EDEF[t]))}
  else if(def.type==='oboz')list=['bandyta','bandyta','bandyta','szaman'];
  else if(def.type==='wieza')list=['lucznik_s','lucznik_s','szkielet','szkielet'];
  else if(def.type==='krag')list=['upior','upior','kultysta','mag'].filter(t=>EDEF[t]);
  else if(def.type==='gniazdo')list=['pajak','pajak','pajak','pajak','pajak'];
  else if(def.type==='kopalnia')list=['goblin','goblin','goblin','szaman','goblin'];
  else if(def.type==='oltarz')list=['kultysta','kultysta','kultysta','mroczny_rycerz'].filter(t=>EDEF[t]);
  else if(def.type==='wiatrak')list=['bandyta','bandyta','bandyta','kusznik'].filter(t=>EDEF[t]);
  else list=def.b===4?['mumia','szkielet','lucznik_s','mumia']:['szkielet','szkielet','szkielet','lucznik_s'];
  if(list.some(t=>EDEF[t].boss))sfx('roar');
  list.forEach((t,i)=>{const boss=!!EDEF[t].boss,a=i/list.length*6.28+0.4,r=boss?(def.type==='grota'?-6:0):(def.type==='zamczysko'?5+(i%3)*3:4+(i%2)*2.5),x=def.x+Math.cos(a)*r,z=def.z+Math.sin(a)*r,h=colAt(x,z);if(h===null)return;
    makeE(t,def.lvl+(boss?2:0),boss||(i===0&&Math.random()<0.4),x,h,z,{sid:def.id,home:[def.x,def.z]})});
  strState.set(def.id,{cleared:0});
}
function summon(e){
  {const D=EDEF[e.t];if(D.mins){for(let i=0;i<3;i++){const a=i*2.1+Math.random(),x=e.p.x+Math.cos(a)*7,z=e.p.z+Math.sin(a)*7,h=colAt(x,z);if(h!==null&&h<WATER-2)makeE(D.mins[i%D.mins.length],Math.max(1,e.lvl-2),false,x,WATER-1.15,z,{home:e.home,prov:10})}ringFx(e.p.x,WATER,e.p.z,5,'frost');sendFx({k:'ring',p:[e.p.x,WATER,e.p.z],r:5,kind:'frost'});toast('Z głębin przybywają sługi: '+D.n+'!','#7fe3ff');return}}
  const bk=EDEF[e.t].boss,t=bk==='krol'||bk==='lich'?'szkielet':bk==='matka'?'pajak':bk==='faraon'?'mumia':bk==='troll'?'ork':bk==='ent'?'wilk':bk==='lich2'?'upior':null;
  if(!t){e.enraged=1;return}
  for(let i=0;i<3;i++){const a=i*2.1,x=e.p.x+Math.cos(a)*3,z=e.p.z+Math.sin(a)*3,h=colAt(x,z);if(h!==null)makeE(t,Math.max(1,e.lvl-2),false,x,h,z,{sid:e.sid,home:e.home,prov:10})}
  ringFx(e.p.x,e.p.y,e.p.z,4,'smoke');sendFx({k:'ring',p:[e.p.x,e.p.y,e.p.z],r:4,kind:'smoke'});
}
const HPM=2.7,DMGM=1.5;
const eDmg=e=>DMGM*EDEF[e.t].dmg*(1+0.27*(e.lvl-1))*(e.elite&&!EDEF[e.t].boss?1.6:1)*ERAR[e.rar||0].dmg*rnd(0.9,1.1);
function enemyShoot(e,tg,kind,dmg,spread){
  const s=eSc(e),o=[e.p.x,e.p.y+1.25*s,e.p.z];let dx=tg.p.x-o[0],dy=tg.p.y+1.0-o[1],dz=tg.p.z-o[2];const dist=Math.hypot(dx,dz)||1;
  const P=PROJ[kind];dy+=0.5*P.g*Math.pow(dist/P.spd,2);let l=Math.hypot(dx,dy,dz);let d=[dx/l,dy/l,dz/l];
  if(spread){const c=Math.cos(spread),sn=Math.sin(spread);d=[d[0]*c+d[2]*sn,d[1],-d[0]*sn+d[2]*c]}
  spawnProj(kind,o,d,false,0,{h:1,dmg,src:[e.p.x,e.p.z]});sendFx({k:'proj',kind,o,d,h:1});
}
function bossAI(e,d,tg,td,dt){
  const A=e.ab||(e.ab={slam:3,vol:4,ch:5,sum:[0.66,0.33],tele:0,charge:0,tr:5});
  A.slam-=dt;A.vol-=dt;A.ch-=dt;
  {const hp=e.hp/e.max,ph=hp<0.3?3:hp<0.6?2:1;if(!A.ph)A.ph=1;if(ph>A.ph){A.ph=ph;if(ph===3)e.enraged=1;const tx=EDEF[e.t].n+(ph===2?' wpada w szał! (faza 2)':' walczy resztkami sił! (faza 3)');toast(tx,'#ff6b5b');sendFx({k:'toast',txt:tx,col:'#ff6b5b'});sfx('growl',1);A.zone=1.2;A.slam=Math.min(A.slam,1)}
    if(A.ph>=2){A.zone=(A.zone??4)-dt;if(A.zone<=0&&!A.zs){A.zone=A.ph===3?5:7.5;A.zs=[];for(const p of playersList())if(!p.dead&&Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)<32)A.zs.push([p.p.x,p.p.y,p.p.z]);for(let k=0;k<(A.ph===3?4:2);k++){const a=Math.random()*6.28,r=rnd(3,10);const x=e.p.x+Math.cos(a)*r,z=e.p.z+Math.sin(a)*r,h=colAt(x,z,e.p.y+3);A.zs.push([x,d.swim?Math.max(WATER,h??WATER):(h??e.p.y),z])}
        A.zt=1.4;for(const q of A.zs){teleFx(q[0],q[1],q[2],3.2,1.4);sendFx({k:'tele',p:q,r:3.2,t:1.4})}}
      if(A.zs){A.zt-=dt;if(A.zt<=0){const kind=d.boss==='lich'||d.boss==='faraon'?'smoke':d.boss==='matka'?'frost':'fire';for(const q of A.zs){ringFx(q[0],q[1],q[2],3.2,kind);sendFx({k:'ring',p:q,r:3.2,kind});for(const p of playersList())if(!p.dead&&Math.hypot(p.p.x-q[0],p.p.z-q[2])<3.2&&Math.abs(p.p.y-q[1])<4)hurtPlayer(p.id,eDmg(e)*1.4,e)}A.zs=null}}}}
  if(A.tele>0){A.tele-=dt;e.st=1;if(A.tele<=0){e.st=0;for(const p of playersList())if(!p.dead&&Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)<A.tr)hurtPlayer(p.id,eDmg(e)*1.7,e);
      {const ty=d.swim?WATER+0.05:e.p.y;ringFx(e.p.x,ty,e.p.z,A.tr,'war');sendFx({k:'ring',p:[e.p.x,ty,e.p.z],r:A.tr,kind:'war'})}}return[0,0,0]}
  if(A.charge>0){A.charge-=dt;for(const p of playersList())if(!p.dead&&!A.hit.has(p.id)&&Math.hypot(p.p.x-e.p.x,p.p.z-e.p.z)<2.4){A.hit.add(p.id);hurtPlayer(p.id,eDmg(e)*1.3,e)}return[A.cdir[0],A.cdir[1],15]}
  if(A.sum.length&&e.hp/e.max<A.sum[0]){A.sum.shift();summon(e)}
  if(!tg)return null;
  if(A.slam<=0&&td<7){A.slam=6.5+rnd(0,2);A.tr=(d.boss==='kolos'||d.boss==='smok'||d.boss==='ent'?7.5:d.boss==='troll'?6.5:5.5)*(d.huge?Math.max(1,eSc(e)/2.8):1);A.tele=1.1;{const ty=d.swim?WATER+0.05:e.p.y;teleFx(e.p.x,ty,e.p.z,A.tr,1.1);sendFx({k:'tele',p:[e.p.x,ty,e.p.z],r:A.tr,t:1.1})}return[0,0,0]}
  if(A.vol<=0&&(d.boss==='matka'||d.boss==='faraon'||d.boss==='smok'||d.boss==='lich')&&td>3.5&&td<26){A.vol=d.boss==='smok'?4:5;const kind=d.boss==='matka'?'poison':d.boss==='smok'?'fire':'curse';for(let i=-2;i<=2;i++){if((d.boss==='faraon'||d.boss==='lich')&&Math.abs(i)>1)continue;enemyShoot(e,tg,kind,eDmg(e)*0.7,i*0.2)}e.cd=Math.max(e.cd,0.8);return null}
  if(A.ch<=0&&(d.boss==='kolos'||d.boss==='krol'||d.boss==='troll'||d.boss==='smok'||d.boss==='ent')&&td>5&&td<18){A.ch=7.5;A.charge=0.7;A.cdir=[(tg.p.x-e.p.x)/td,(tg.p.z-e.p.z)/td];A.hit=new Set();e.ry=Math.atan2(A.cdir[0],A.cdir[1]);return[A.cdir[0],A.cdir[1],15]}
  if(e.enraged)return null;
  return null;
}
// ---------- efekt zapowiedzi uderzenia ----------
const discGeo=new THREE.CircleGeometry(1,40);
function teleFx(x,y,z,r,t){
  const g=new THREE.Group();const o=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:0xff3b2e,transparent:true,opacity:0.7,side:THREE.DoubleSide,depthWrite:false}));o.scale.setScalar(r);
  const i=new THREE.Mesh(discGeo,new THREE.MeshBasicMaterial({color:0xff3b2e,transparent:true,opacity:0.3,side:THREE.DoubleSide,depthWrite:false}));g.add(o,i);g.rotation.x=-Math.PI/2;g.position.set(x,y+0.25,z);scene.add(g);rings.push({m:g,r,t:0,dur:t,tele:i});
}
// ---------- budowa struktur ----------
function castleGeo(s){const L=[],D='#6f6a73',D2='#5d5a63',D3='#7d7884',SL='#4a4f5a',SL2='#3e4350',WD='#3a2414',P=(...b)=>L.push(b);const A=21,Hw=12;
  const wall=(x,z,w,d)=>{P(x,Hw/2-1,z,w,Hw+2,d,D);P(x,Hw-0.4,z,w+0.3,0.5,d+0.3,D3);const long=w>d,len=long?w:d,n=Math.floor(len/1.6);for(let i=0;i<n;i+=2){const o=-len/2+0.8+i*1.6;P(long?x+o:x,Hw+0.6,long?z:z+o,long?0.9:d,1.4,long?d:0.9,D2)}P(x,1.2,z,w+0.8,2.4,d+0.8,D2)};
  wall(0,-A,2*A,3);wall(A,0,3,2*A);wall(-A,0,3,2*A);wall(-12.25,A,17.5,3);wall(12.25,A,17.5,3);
  const tower=(x,z,s,h,roof)=>{P(x,h/2-1,z,s,h+2,s,D);P(x,1.2,z,s+1.2,2.4,s+1.2,D2);for(const y of [h*0.4,h*0.75])P(x,y,z,s+0.3,0.4,s+0.3,D3);
    for(const [ax,az] of [[1,0],[-1,0],[0,1],[0,-1]])for(const y of [h*0.3,h*0.55,h*0.8])P(x+ax*(s/2+0.01),y,z+az*(s/2+0.01),ax?0.04:0.25,1.1,az?0.04:0.25,'#1a1a1a');
    P(x,h+0.3,z,s+1,0.6,s+1,D3);const st=7,rh=s*1.1;for(let i=0;i<st;i++){const w=(s+0.4)*(1-i/st)+0.2;P(x,h+0.6+i*rh/st+rh/st/2,z,w,rh/st+0.05,w,i%2?SL2:roof)}
    P(x,h+0.6+rh+0.6,z,0.12,1.2,0.12,WD);P(x+0.5,h+0.6+rh+0.9,z,1.0,0.6,0.05,'#1a1a1a~');P(x+0.5,h+0.6+rh+0.9,z,0.4,0.3,0.06,'#a8352a')};
  for(const [x,z] of [[A,A],[-A,A],[A,-A],[-A,-A]])tower(x,z,8,18,SL);
  for(const x of [-6,6])tower(x,A,5,15,SL);
  P(0,13.6,A,7.5,3.2,3.2,D);for(let i=-3;i<=3;i++)P(i*0.9,9.4,A+1.6,0.1,4.4,0.1,'#2a2a30');P(0,11.4,A+1.7,7,0.12,0.12,'#2a2a30');
  // donżon
  P(0,9,-12,16,20,14,D);P(0,1.2,-12,17,2.4,15,D2);for(const y of [6,12,17])P(0,y,-12,16.3,0.4,14.3,D3);
  for(const xx of [-5,-1.7,1.7,5])for(const y of [8,13,17.5])P(xx,y,-4.99,0.5,1.4,0.04,y>12?'#ffb04a':'#1a1a1a');
  P(0,2,-4.95,3,4,0.1,WD);P(0,4.4,-4.9,3.4,0.6,0.15,D3);
  for(const [x,z] of [[8,-5],[-8,-5],[8,-19],[-8,-19]])tower(x,z,4,25,SL);
  {const st=8;for(let i=0;i<st;i++){const w=14*(1-i/st)+0.4,d=12*(1-i/st)+0.4;P(0,19.3+i*0.9,-12,w,0.95,d,i%2?SL2:SL)}}
  // dziedziniec: koksowniki, sztandary, kości
  for(const [x,z] of [[-6,4],[6,4],[-6,14],[6,14]])P(x,0.5,z,0.8,1.0,0.8,'#2a2a30'),P(x,1.15,z,0.6,0.3,0.6,'#ff6a1a'),P(x,1.4,z,0.3,0.3,0.3,'#ffd34d');
  for(const x of [-14,-8,8,14])P(x,8,A-1.55,1.4,4,0.08,'#1a1a1a~'),P(x,8.6,A-1.6,0.6,0.6,0.08,'#a8352a');
  for(let i=0;i<6;i++)P(-10+i*4,0.1,8+((i*37)%5),0.6,0.12,0.18,'#e8e2cc');
  return kitB(L)}
function grotaGeo(s,r){const L=[],S1='#6c6a67',S2='#7d7b78',S3='#5a5856';
  for(let i=0;i<26;i++){const a=i/26*Math.PI*2,rr=6+r()*4,x=Math.cos(a)*rr,z=Math.sin(a)*rr;if(Math.sin(a)>0.82&&Math.abs(Math.cos(a))<0.5)continue;const h=3+r()*6*(1-Math.max(0,Math.sin(a))*0.4);L.push([x,h/2-2,z,2.6+r()*2,h+4,2.6+r()*2,[S1,S2,S3][i%3]])}
  L.push([0,4,-1,10,10,8,S3],[0,8.5,-1.5,7,3,6,S1],[0,10.5,-2,4,2,4,S2]);
  L.push([0,1.6,5.2,3.4,3.6,0.4,'#120c0a'],[0,3.6,5.3,4.2,0.6,0.8,S2]);
  for(let i=0;i<10;i++){const x=(r()-0.5)*9,z=6+r()*5;L.push([x,0.08,z,1.6+r(),0.08,1.4+r(),'#2a221c'])}
  for(let i=0;i<8;i++)L.push([(r()-0.5)*8,0.15,6+r()*5,0.7,0.14,0.18,'#e8e2cc']);
  for(let i=0;i<5;i++){const x=-2+i,z=4.2+(i%2)*0.5;L.push([x,0.2+(i%3)*0.1,z,0.8,0.4+(i%3)*0.2,0.7,'#e0b84a'])}
  return kitB(L)}
// ===== szczegółowe struktury (poziom detalu jak budynki ludzi: ciosy kamienne, belki, dachówki, otwory, rekwizyty) =====
function structDetail(s,r){const T=s.type,L=[],cols=[],B=(x,y,z,w,h,d,c)=>L.push([x,y+h/2,z,w,h,d,c]),G=(x,z)=>hsAt(s,s.x+x,s.z+z),col=(x,z,hw,hd,top)=>cols.push([s.x+x,s.z+z,hw,hd,top]);
  const pc=(p,a,b,c)=>p[Math.abs(Math.floor(a*7.31+b*13.17+c*3.71))%p.length],desert=s.b===4;
  const STN=desert?['#d9c79a','#cfbb8a','#e2d2a8','#c4ae7c']:['#8e8a90','#83808a','#9a959c','#77737d'],SDK=desert?'#b49a68':'#5d5a63',MOSS=['#5f7a3a','#6b8a40','#4f6a32'],WD=['#6a4428','#5a3a22','#7a5030'],WDD='#3a2414',RF=['#a8452c','#93391f','#b5532f'],CV=['#c8b89a','#b8a888','#d6c8aa'],IR='#3a3a40',BN='#e8e2cc',FIRE='!#ff8a2e',GLOWP='!#c890ff';
  // mur z ciosów: ax 'x' (wzdłuż X na z=o) lub 'z'; holes: [a0,a1,y0,y1]
  const cw=(ax,a0,a1,o,y0,h,th,pal,q={})=>{const n=Math.max(1,Math.round((a1-a0)/(q.bl||1))),st=(a1-a0)/n,hs=[],holes=q.holes||[];
    for(let i=0;i<n;i++){let hc=h;if(q.jag){const e=Math.min(i,n-1-i);hc=h*Math.min(1,(q.min||0.3)+r()*0.5+e*0.12)}hs.push(Math.max(0.5,Math.round(hc*2)/2))}
    const put=(a,y,o2,la,hg,t,c)=>ax==='x'?B(a,y,o2,la,hg,t,c):B(o2,y,a,t,hg,la,c);
    const inH=(a,y)=>holes.some(k=>a>k[0]&&a<k[1]&&y>k[2]&&y<k[3]);
    for(let i=0;i<n;i++){const a=a0+(i+0.5)*st;let cuts=[[0,hs[i]]];for(const k of holes)if(a>k[0]&&a<k[1]){const nc=[];for(const [u,v] of cuts){if(k[2]>u)nc.push([u,Math.min(v,k[2])]);if(k[3]<v)nc.push([Math.max(u,k[3]),v])}cuts=nc}
      if(!q.nocore)for(const [u,v] of cuts)if(v-u>0.05)put(a,y0+u,o,st,v-u,th,q.core||SDK);if(q.moss&&r()<0.35)put(a,y0+hs[i],o,st*0.9,0.18,th+0.1,MOSS[i%3])}
    const mh=Math.max(...hs);const rh=q.rh||0.5;for(let y=0,row=0;y<mh-0.2;y+=rh,row++)for(let a=a0-(row%2?0.5*st:0);a<a1;a+=st){const s0=Math.max(a,a0),s1=Math.min(a+st,a1);if(s1-s0<0.3)continue;
      const i0=Math.max(0,Math.floor((s0-a0)/st)),i1=Math.min(n-1,Math.floor((s1-a0-0.01)/st));let m=1e9;for(let i=i0;i<=i1;i++)m=Math.min(m,hs[i]);if(y+rh>m+0.01)continue;const mid=(s0+s1)/2;if(inH(mid,y+rh/2)||inH(s0+0.05,y+rh/2)||inH(s1-0.05,y+rh/2))continue;
      const c=pc(pal,mid,y,o+row);for(const f of (q.one?[q.one]:[-1,1]))put(mid,y0+y+0.02,o+f*(th/2+0.04),s1-s0-0.07,rh-0.04,0.09,c)}
    for(const k of holes){const am=(k[0]+k[1])/2,wd=k[1]-k[0];if(k[3]<h-0.3){put(am,y0+k[3],o,wd+0.6,0.5,th+0.2,pal[2]);if(wd>1.2)put(am,y0+k[3]+0.5,o,wd*0.5,0.3,th+0.2,pal[0])}if(k[2]>0.1)put(am,y0+k[2]-0.18,o,wd+0.3,0.2,th+0.25,pal[3])}
    return hs};
  // ściany ciosów wokół bryły (prostopadłościan)
  const blockFaces=(x,z,w,d,y0,h,pal,q={})=>{B(x,y0,z,w-0.1,h,d-0.1,q.core||SDK);const o2={nocore:1,bl:q.bl,rh:q.rh};cw('x',x-w/2,x+w/2,z+d/2-0.05,y0,h,0.02,pal,{...o2,one:1,holes:q.hz||[]});cw('x',x-w/2,x+w/2,z-d/2+0.05,y0,h,0.02,pal,{...o2,one:-1,holes:q.hz2||[]});cw('z',z-d/2,z+d/2,x+w/2-0.05,y0,h,0.02,pal,{...o2,one:1});cw('z',z-d/2,z+d/2,x-w/2+0.05,y0,h,0.02,pal,{...o2,one:-1})};
  const gable=(x,z,w,d,y,h,pal,ax,end)=>{const n=Math.max(4,Math.round(h/0.45)),dh=h/n;for(let i=0;i<n;i++){const k=1-i/n,c=pal[i%pal.length];if(ax==='x'){B(x,y+i*dh,z,w+0.7,dh+0.02,d*k+0.5,c);if(end)for(const s2 of [-1,1])B(x+s2*(w/2-0.05),y+i*dh,z,0.15,dh,d*k-0.2,end)}else{B(x,y+i*dh,z,d*k+0.5,dh+0.02,w+0.7,c);if(end)for(const s2 of [-1,1])B(x,y+i*dh,z+s2*(w/2-0.05),d*k-0.2,dh,0.15,end)}}
    if(ax==='x')B(x,y+h,z,w+0.9,0.22,0.35,WDD);else B(x,y+h,z,0.35,0.22,w+0.9,WDD)};
  const pyr=(x,z,s2,y,h,pal)=>{const n=Math.max(4,Math.round(h/0.5)),dh=h/n;for(let i=0;i<n;i++){const k=(s2+0.6)*(1-i/n)+0.2;B(x,y+i*dh,z,k,dh+0.02,k,pal[i%pal.length]);B(x,y+i*dh,z,k+0.25,0.08,k+0.25,WDD)}B(x,y+h,z,0.12,1.2,0.12,WDD)};
  const torch=(x,y,z)=>{B(x,y,z,0.12,0.6,0.12,WDD);B(x,y+0.6,z,0.22,0.22,0.22,FIRE)};
  const crate=(x,y,z,k)=>{B(x,y,z,k,k,k,WD[0]);B(x,y+k*0.45,z,k+0.04,0.08,k+0.04,WDD);B(x,y,z,k+0.04,0.08,k+0.04,WDD)};
  const barrel=(x,y,z)=>{B(x,y,z,0.7,0.9,0.7,WD[2]);B(x,y+0.15,z,0.76,0.08,0.76,IR);B(x,y+0.68,z,0.76,0.08,0.76,IR);B(x,y+0.9,z,0.56,0.05,0.56,WD[1])};
  const deadTree=(x,z,h)=>{const g=G(x,z);B(x,g-0.5,z,0.5,h+0.5,0.5,'#4a3a2c');B(x+0.6,g+h*0.6,z,1.2,0.25,0.25,'#4a3a2c');B(x-0.3,g+h*0.8,z+0.4,0.25,0.25,0.9,'#4a3a2c');B(x+1.1,g+h*0.6,z,0.2,0.8,0.2,'#4a3a2c')};
  const rubble=(x,z,n,pal)=>{for(let i=0;i<n;i++){const a=r()*6.28,rr=r()*1.6,px=x+Math.cos(a)*rr,pz=z+Math.sin(a)*rr,k=0.3+r()*0.5;B(px,G(px,pz)-0.1,pz,k*1.3,k,k,pal[i%pal.length])}};
  const rock=(x,z,y0,w,h,d,pal)=>{const n=Math.max(3,Math.round(h/0.9));let cx=x,cz=z;for(let i=0;i<n;i++){const k=1-0.55*Math.pow(i/n,1.4),ww=w*k*(0.85+r()*0.3),dd=d*k*(0.85+r()*0.3),y=y0+i*h/n;B(cx,y,cz,ww,h/n+0.05,dd,pal[(i+Math.round(x+z))%pal.length]);if(r()<0.5)B(cx+(r()-0.5)*ww*0.6,y,cz+(r()-0.5)*dd*0.6,ww*0.5,h/n*0.6,dd*0.5,pal[(i+1)%pal.length]);B(cx,y+h/n-0.06,cz,ww+0.08,0.08,dd+0.08,pal[pal.length-1]);cx+=(r()-0.5)*0.5;cz+=(r()-0.5)*0.5}};
  let chest=[0,0];
  if(T==='ruiny'){const gy=G(0,0),ang=r()<0.5;const W2=14,D2=10;B(0,gy-3,0,W2+1,3,D2+1,SDK);
    for(let x=-W2/2+1;x<W2/2;x+=1.5)for(let z=-D2/2+1;z<D2/2;z+=1.5)if(r()<0.8)B(x,gy-0.05,z,1.4,0.12,1.4,pc(STN,x,z,1));
    cw('x',-W2/2,W2/2,-D2/2,gy,6,0.9,STN,{jag:1,min:0.45,moss:!desert,holes:[[-4.2,-2.8,2.4,4.2],[2.8,4.2,2.4,4.2]]});
    cw('x',-W2/2,W2/2,D2/2,gy,5,0.9,STN,{jag:1,min:0.15,moss:!desert,holes:[[-1,1,0,3.4]]});
    cw('z',-D2/2,D2/2,-W2/2,gy,5.5,0.9,STN,{jag:1,min:0.3,moss:!desert,holes:[[-1,0.4,2.2,4]]});
    cw('z',-D2/2,D2/2,W2/2,gy,4,0.9,STN,{jag:1,min:0.05});
    // portal z łukiem i resztkami wrót
    for(const sx of [-1.3,1.3]){B(sx,gy,D2/2+0.5,0.6,3.6,0.6,STN[2]);B(sx,gy,D2/2+0.5,0.8,0.4,0.8,STN[3])}for(let k=-2;k<=2;k++)B(k*0.5,gy+3.4+(2-Math.abs(k))*0.15,D2/2+0.5,0.5,0.4,0.7,STN[k&1?0:2]);B(-0.6,gy,D2/2+0.1,0.9,2.4,0.12,WD[1]);B(-0.6,gy+0.6,D2/2+0.18,0.95,0.1,0.06,IR);B(-0.6,gy+1.8,D2/2+0.18,0.95,0.1,0.06,IR);
    // narożna baszta – złamana
    {const tx=-W2/2,tz=-D2/2,th=9;blockFaces(tx,tz,3.4,3.4,gy-1,th,STN);for(let i=0;i<5;i++)B(tx-1.2+r()*2.4,gy+th-1,tz-1.2+r()*2.4,0.8,0.5+r()*1.3,0.8,STN[i%4]);B(tx+1.72,gy+4,tz,0.06,1,0.25,'#1a1a1a');B(tx,gy+6,tz+1.72,0.25,1,0.06,'#1a1a1a');col(tx,tz,1.7,1.7,gy+th)}
    // kolumny, bębny, posąg
    for(const [cx,cz,hc] of [[-3,-1,4.5],[3,-1,2.2],[-3,2,1.2],[3,2,3.4]]){B(cx,gy,cz,1,0.4,1,STN[3]);for(let y=0.4,k=0;y<hc;y+=0.6,k++)B(cx,gy+y,cz,0.7,0.58,0.7,STN[k%3]);if(hc>4)B(cx,gy+hc,cz,1.1,0.35,1.1,STN[2]);col(cx,cz,0.45,0.45,gy+hc)}
    for(let k=0;k<3;k++)B(4.6+k*0.65,gy+0.05,-3.4+k*0.3,0.6,0.7,0.7,STN[k%3]);
    B(0,gy,-3,1.6,0.6,1.2,STN[3]);B(-0.9,gy+0.05,-1.6,2.2,0.6,0.7,STN[2]);B(-1.7,gy+0.3,-1.6,0.55,0.55,0.55,STN[0]);B(0.1,gy+0.1,-1.65,0.3,0.4,0.9,STN[1]);
    if(!desert)for(let i=0;i<10;i++){const x=-W2/2+r()*W2,side=r()<0.5?-1:1;B(x,gy+0.5+r()*2,side*(D2/2+0.48),0.16,1.4+r()*1.8,0.06,MOSS[i%3]);B(x,gy+1+r()*2,side*(D2/2+0.5),0.4,0.3,0.06,'#7a9a4a')}
    rubble(-5,3,8,STN);rubble(5.5,4,6,STN);rubble(W2/2+1,0,7,STN);
    for(const [x,z,hw,hd] of [[0,-D2/2,W2/2,0.5],[-W2/2,0,0.5,D2/2],[W2/2,0,0.5,D2/2],[-4,D2/2,3,0.5],[4,D2/2,3,0.5]])col(x,z,hw,hd,gy+2.5);
    chest=[0,-2.2]}
  else if(T==='oboz'){const gy=G(0,0);
    // palisada z bramą
    const R0=11;for(let i=0;i<44;i++){const a=i/44*Math.PI*2;if(Math.abs(Math.sin(a)-1)<0.06)continue;const x=Math.cos(a)*R0,z=Math.sin(a)*R0,g=G(x,z),hh=3+((i*7)%3)*0.35;B(x,g-0.6,z,0.55,hh+0.6,0.55,WD[i%3]);B(x,g+hh,z,0.3,0.4,0.3,'#9a7a5a');if(i%2)B(x,g+hh*0.65,z,0.6,0.16,0.6,WDD)}
    for(let i=0;i<22;i++){const a=(i+0.5)/22*Math.PI*2;if(Math.abs(Math.sin(a)-1)<0.12)continue;col(Math.cos(a)*R0,Math.sin(a)*R0,1.2,1.2,G(Math.cos(a)*R0,Math.sin(a)*R0)+3)}
    for(const sx of [-1.6,1.6]){B(sx,G(sx,R0)-0.5,R0,0.7,5.4,0.7,WD[0]);B(sx,G(sx,R0)+4.6,R0+0.4,0.08,1.2,0.6,'#8a2a22~')}B(0,G(0,R0)+4.4,R0,4,0.5,0.6,WD[1]);B(0,G(0,R0)+4.9,R0+0.3,0.8,0.7,0.6,BN);
    // namioty: płótno, maszty, liny, kołki
    const tent=(x,z,w,d,h,c,rot)=>{const g=G(x,z);const n=7,dh=h/n;for(let i=0;i<n;i++){const k=1-i/n;if(rot)B(x,g+i*dh,z,w*k+0.2,dh+0.02,d,i%2?c[0]:c[1]);else B(x,g+i*dh,z,d,dh+0.02,w*k+0.2,i%2?c[0]:c[1])}
      if(rot){B(x,g+h,z,0.15,0.15,d+0.6,WDD);for(const s2 of [-1,1]){B(x,g,z+s2*(d/2+0.25),0.15,h+0.2,0.15,WDD);B(x+w*0.7,g,z+s2*(d/2+0.6),0.1,0.3,0.1,WDD)}B(x,g,z+d/2+0.02,w*0.3,h*0.6,0.06,'#2a2018')}
      else{B(x,g+h,z,d+0.6,0.15,0.15,WDD);for(const s2 of [-1,1]){B(x+s2*(d/2+0.25),g,z,0.15,h+0.2,0.15,WDD)}B(x+d/2+0.02,g,z,0.06,h*0.6,w*0.3,'#2a2018')}col(x,z,rot?w/2:d/2,rot?d/2:w/2,g+h*0.7)};
    tent(-6,-3,4,4.5,2.8,CV,1);tent(5.5,-4,3.6,4,2.6,['#8a3a2a','#9a4a32'],1);tent(-3,-7,3.4,3.8,2.4,['#6b5a3a','#7a6a48'],0);tent(4,4,3.2,3.6,2.3,CV,0);
    // ognisko z rożnem
    {for(let k=0;k<8;k++){const a=k/8*6.28;B(Math.cos(a)*1.1,gy,Math.sin(a)*1.1,0.5,0.35,0.5,'#6a6670')}B(0,gy,0,1.2,0.3,1.2,'#3a2a1c');B(0,gy+0.2,0,0.8,0.5,0.8,FIRE);B(0,gy+0.4,0,0.4,0.5,0.4,'!#ffd34d');for(const s2 of [-1,1])B(s2*1.2,gy,0,0.12,1.6,0.12,WDD);B(0,gy+1.5,0,2.6,0.1,0.1,WDD);B(0,gy+1.2,0,0.9,0.4,0.4,'#8a4a2a');
      for(const [x,z,ro] of [[-2.4,0.4,0],[2.4,-0.6,0],[0.3,2.4,1]])B(x,G(x,z),z,ro?1.8:0.5,0.45,ro?0.5:1.8,WD[1])}
    // wieżyczka obserwacyjna
    {const tx=-7,tz=5,g=G(tx,tz);for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])B(tx+a,g,tz+b,0.3,5,0.3,WD[0]);for(const y of [1.6,3.2])for(const s2 of [-1,1]){B(tx,g+y,tz+s2,2.2,0.15,0.15,WDD);B(tx+s2,g+y,tz,0.15,0.15,2.2,WDD)}B(tx,g+5,tz,2.8,0.2,2.8,WD[1]);for(const s2 of [-1,1]){B(tx,g+5.2,tz+s2*1.35,2.8,0.7,0.12,WD[2]);B(tx+s2*1.35,g+5.2,tz,0.12,0.7,2.8,WD[2])}gable(tx,tz,2.6,2.6,g+6.6,1,CV,'x',WD[1]);for(const [a,b] of [[-1.2,-1.2],[1.2,1.2],[-1.2,1.2],[1.2,-1.2]])B(tx+a,g+5.2,tz+b,0.15,1.4,0.15,WDD);for(let y=0;y<5;y+=0.5)B(tx+1.25,g+y,tz,0.08,0.08,0.7,WDD);col(tx,tz,1.2,1.2,g+5.2)}
    // skrzynie, beczki, stojak z bronią, łup
    crate(6,G(6,1),1,0.9);crate(6.2,G(6,1)+0.9,1.1,0.7);barrel(7,G(7,2.2),2.2);barrel(6.4,G(6.4,3),3);
    {const x=-2,z=6,g=G(x,z);B(x,g,z,2.4,0.15,0.4,WDD);B(x,g+1.4,z,2.4,0.15,0.4,WDD);for(const s2 of [-1.1,1.1])B(x+s2,g,z,0.15,1.6,0.4,WDD);for(let k=0;k<4;k++){B(x-0.8+k*0.5,g+0.2,z+0.25,0.07,1.5,0.07,'#8a8a90');B(x-0.8+k*0.5,g+1.7,z+0.25,0.18,0.25,0.05,'#a0a0a8')}}
    for(let i=0;i<5;i++){const x=1+r()*3,z=-1-r()*2;B(x,G(x,z),z,0.35,0.15,0.35,'#d9b23a')}
    chest=[Math.cos(0.5)*6+2.3,Math.sin(0.5)*6]}
  else if(T==='wieza'){const tx=-3,tz=0,gy=G(tx,tz),S=6,H=15;B(tx,gy-3,tz,S+1.2,3.2,S+1.2,SDK);
    cw('x',tx-S/2,tx+S/2,tz+S/2,gy,H,1,STN,{holes:[[tx-0.8,tx+0.8,0,2.6],[tx-0.2,tx+0.2,5,6.4],[tx-0.2,tx+0.2,10,11.4]]});cw('x',tx-S/2,tx+S/2,tz-S/2,gy,H,1,STN,{holes:[[tx-0.2,tx+0.2,6,7.4],[tx-0.2,tx+0.2,11,12.4]]});
    cw('z',tz-S/2+0.5,tz+S/2-0.5,tx-S/2+0.5,gy,H,1,STN,{holes:[[tz-0.2,tz+0.2,8,9.4]]});cw('z',tz-S/2+0.5,tz+S/2-0.5,tx+S/2-0.5,gy,H,1,STN,{holes:[[tz-0.2,tz+0.2,4,5.4],[tz-0.2,tz+0.2,12,13.4]]});
    for(const y of [5,10])B(tx,gy+y,tz,S+0.3,0.3,S+0.3,STN[2]);for(let y=0.5;y<H;y+=2.5)B(tx,gy+y,tz,S-1.2,0.2,S-1.2,WD[0]);
    // drewniane hurdycje na szczycie
    B(tx,gy+H,tz,S+2,0.3,S+2,WD[1]);for(const [a,b] of [[1,1],[1,-1],[-1,1],[-1,-1]])B(tx+a*(S/2+0.6),gy+H-1.4,tz+b*(S/2+0.6),0.2,1.4,0.2,WDD);
    for(let k=-3;k<=3;k++)for(const s2 of [-1,1]){B(tx+k*(S+2)/7,gy+H+0.3,tz+s2*(S/2+0.92),(S+2)/7-0.06,1.3,0.15,WD[(k+3)%3]);B(tx+s2*(S/2+0.92),gy+H+0.3,tz+k*(S+2)/7,0.15,1.3,(S+2)/7-0.06,WD[(k+4)%3])}
    for(const [a,b] of [[1,1],[1,-1],[-1,1],[-1,-1]])B(tx+a*(S/2+0.8),gy+H+0.3,tz+b*(S/2+0.8),0.25,2.3,0.25,WDD);pyr(tx,tz,S+2,gy+H+2.5,4.2,RF);B(tx+0.5,gy+H+7.3,tz,0.9,0.5,0.05,'#7a2a22~');
    // drzwi, schody, pochodnie, przybudówka-szopa
    B(tx,gy,tz+S/2+0.02,1.5,2.5,0.1,WD[1]);for(const y of [0.6,1.8])B(tx,gy+y,tz+S/2+0.1,1.55,0.1,0.06,IR);for(let k=0;k<3;k++)B(tx,gy-0.6+k*0.2,tz+S/2+0.8+(2-k)*0.45,2,0.25,0.5,STN[k]);torch(tx-1.3,gy+1.8,tz+S/2+0.3);torch(tx+1.3,gy+1.8,tz+S/2+0.3);
    {const ax=tx+S/2+2,g=G(ax,tz);B(ax,g,tz,3.2,2.6,4,WD[2]);for(let z=-1.6;z<=1.6;z+=0.8)B(ax+1.62,g,tz+z,0.08,2.6,0.7,WD[(z*5|0)&1]);for(let i=0;i<5;i++)B(ax+0.2-i*0.3,g+2.6+i*0.25,tz,3.4-i*0.6,0.25,4.4,RF[i%2]);B(ax+1.2,g+0.2,tz-2.6,0.8,0.9,0.4,WD[0]);col(ax,tz,1.6,2,g+2.6)}
    for(let i=0;i<4;i++){const x=1+r()*4,z=(r()-0.5)*7;crate(x,G(x,z),z,0.8)}rubble(tx-4,3,5,STN);
    col(tx,tz,S/2,S/2,gy+H+1.6);chest=[tx,tz+S/2+1.2]}
  else if(T==='kurhan'){const gy=G(0,0);
    // kopiec warstwowy z darnią
    for(let i=0;i<9;i++){const k=1-i/9,w=13*k+1,d=10*k+1;B(0,gy-1+i*0.6,-4.5,w,0.62,d,i>5?'#5f7a3a':i%2?'#5a6a4a':'#647a50');if(i<7)B(0,gy-1+i*0.6+0.55,-4.5,w+0.1,0.08,d+0.1,'#4f6a32')}
    for(let i=0;i<12;i++){const x=(r()-0.5)*10,z=-4.5+(r()-0.5)*7;B(x,gy+2.2+r()*2,z,0.5,0.4,0.5,'#7a8a50')}
    // korytarz z ciosów i nadproża
    for(let k=0;k<4;k++){const z=0.3-k*1.2;for(const sx of [-1.25,1.25])blockFaces(sx,z,0.8,1.2,gy-0.5,3.2,STN);B(0,gy+2.7,z,3.4,0.6,1.3,STN[k%3])}B(0,gy,-1.6,1.7,2.6,3.2,'#0e0a08');B(0,gy+3.3,0.4,4,0.5,0.8,STN[2]);
    for(let k=-1;k<=1;k++)B(k*0.6,gy+3.8,0.7,0.12,0.5,0.06,GLOWP);
    // krąg kamieni z runami
    for(let i=0;i<10;i++){const a=i/10*6.28+0.3,x=Math.cos(a)*10,z=Math.sin(a)*8-2.5,g=G(x,z),hh=2.6+((i*37)%4)*0.6;B(x,g-0.5,z,1.1,hh+0.5,0.8,STN[i%4]);B(x,g+hh,z,0.9,0.3,0.6,STN[3]);if(!desert)B(x,g+hh+0.3,z,0.7,0.12,0.5,MOSS[i%3]);B(x,g+hh*0.5,z+0.41,0.1,0.8,0.04,GLOWP);B(x,g+hh*0.5+0.2,z+0.41,0.4,0.1,0.04,GLOWP);col(x,z,0.55,0.4,g+hh)}
    for(let i=0;i<10;i+=3){const a=(i+0.5)/10*6.28+0.3,x=Math.cos(a)*10,z=Math.sin(a)*8-2.5;B(x,G(x,z)+3.6,z,2.4,0.5,0.9,STN[1])}
    // ołtarz ofiarny, czaszki, świece, martwe drzewa
    B(0,gy,1.8,2.4,0.8,1.3,STN[0]);B(0,gy+0.8,1.8,2.6,0.15,1.5,STN[2]);B(0,gy+0.95,1.8,0.5,0.4,0.5,BN);B(-0.12,gy+1.1,2.06,0.12,0.1,0.02,'#141414');B(0.12,gy+1.1,2.06,0.12,0.1,0.02,'#141414');for(const s2 of [-1,1]){B(s2*0.9,gy+0.95,1.8,0.12,0.35,0.12,'#f0e8d0');B(s2*0.9,gy+1.3,1.8,0.08,0.12,0.08,'!#ffd38a')}
    for(let i=0;i<6;i++){const x=-3+r()*6,z=2.5+r()*2;B(x,G(x,z),z,0.4,0.35,0.4,BN)}deadTree(-7,4,4.5);deadTree(7.5,3,3.8);deadTree(6,-11,4);
    col(0,-4.5,6,4.5,gy+2.6);col(0,1.8,1.2,0.7,gy+0.95);chest=[0,-1.6]}
  else if(T==='krag'){const gy=G(0,0);
    for(let i=0;i<12;i++){const a=i/12*6.28,x=Math.cos(a)*8,z=Math.sin(a)*8,g=G(x,z),hh=4.2+((i*13)%3)*0.5;blockFaces(x,z,1.2,0.9,g-0.6,hh+0.6,STN);B(x,g+hh*0.4,z+0.47,0.12,1.4,0.03,'!#8ad8ff');B(x-0.2,g+hh*0.4+0.5,z+0.47,0.5,0.12,0.03,'!#8ad8ff');col(x,z,0.6,0.45,g+hh);if(i%2===0){const a2=(i+1)/12*6.28;B(Math.cos(a+0.26)*8,g+hh,Math.sin(a+0.26)*8,3.6,0.7,1,STN[2])}}
    for(let i=0;i<5;i++){const a=i/5*6.28,x=Math.cos(a)*3.4,z=Math.sin(a)*3.4,g=G(x,z);blockFaces(x,z,0.8,0.7,g-0.4,2.4,STN)}
    B(0,gy-0.2,0,3,0.6,3,STN[2]);B(0,gy+0.4,0,2.2,0.6,2.2,STN[0]);B(0,gy+1,0,0.6,1.6,0.6,'!#8ad8ff');B(0,gy+2.7,0,0.3,0.4,0.3,'!#ffffff');for(let k=0;k<16;k++){const a=k/16*6.28;B(Math.cos(a)*5.5,G(Math.cos(a)*5.5,Math.sin(a)*5.5)+0.02,Math.sin(a)*5.5,0.8,0.06,0.3,'!#5aa8d8')}
    for(let i=0;i<14;i++){const a=r()*6.28,rr=9+r()*3,x=Math.cos(a)*rr,z=Math.sin(a)*rr;B(x,G(x,z),z,0.15,0.4,0.15,'#4a8a3a');B(x,G(x,z)+0.4,z,0.3,0.25,0.3,i%2?'#c8a8f0':'#fff4e0')}
    col(0,0,1.5,1.5,gy+1);chest=[0,2.6]}
  else if(T==='gniazdo'){const gy=G(0,0);const WEB='#e8e6e0',SAC='#d8d0b8';
    for(let i=0;i<7;i++){const a=i/7*6.28,x=Math.cos(a)*7,z=Math.sin(a)*7;deadTree(x,z,4+r()*2)}
    for(let i=0;i<9;i++){const a=i/9*6.28,x=Math.cos(a)*5,z=Math.sin(a)*5,g=G(x,z);B(x,g,z,1.6+r(),0.9+r()*1.2,1.4+r(),'#5a5048')}
    // pajęczyny między drzewami (cienkie płaty z nitek)
    for(let i=0;i<7;i++){const a0=i/7*6.28,a1=(i+1)/7*6.28,x0=Math.cos(a0)*7,z0=Math.sin(a0)*7,x1=Math.cos(a1)*7,z1=Math.sin(a1)*7,mx=(x0+x1)/2,mz=(z0+z1)/2,g=G(mx,mz),ln=Math.hypot(x1-x0,z1-z0);for(let k=0;k<4;k++){const y=g+1.2+k*0.8;if(Math.abs(x1-x0)>Math.abs(z1-z0))B(mx,y,mz,ln,0.04,0.04,WEB+'~');else B(mx,y,mz,0.04,0.04,ln,WEB+'~')}for(let k=0;k<5;k++){const t=(k+0.5)/5;B(x0+(x1-x0)*t,g+1,z0+(z1-z0)*t,0.04,3.2,0.04,WEB+'~')}}
    for(let k=-3;k<=3;k++){B(k,gy+0.02,0,0.05,0.04,6,WEB);B(0,gy+0.02,k,6,0.04,0.05,WEB)}for(let k=1;k<4;k++)for(const [a,b] of [[1,1],[-1,1],[1,-1],[-1,-1]])B(a*k*0.7,gy+0.03,b*k*0.7,k*1.4,0.04,0.05,WEB);for(let k=0;k<8;k++){const a=k/8*6.28;B(Math.cos(a)*2.4,gy+0.15,Math.sin(a)*2.4,0.05,2.2,0.05,WEB)}for(let k=-2;k<=2;k++){B(k*0.9,gy+2.2,0,0.04,0.04,4.6,WEB+'~');B(0,gy+2.25,k*0.9,4.6,0.04,0.04,WEB+'~')}
    for(let i=0;i<10;i++){const x=(r()-0.5)*7,z=(r()-0.5)*7,g=G(x,z);B(x,g,z,0.6,0.7,0.6,SAC);B(x,g+0.7,z,0.4,0.2,0.4,'#c8bea0')}
    for(let i=0;i<3;i++){const x=(r()-0.5)*6,z=(r()-0.5)*6,g=G(x,z);B(x,g+0.2,z,0.6,1.8,0.6,WEB);B(x,g+0.5,z,0.66,0.12,0.66,'#c8c0a8');B(x,g+1.4,z,0.66,0.12,0.66,'#c8c0a8')}
    for(let i=0;i<8;i++){const x=(r()-0.5)*9,z=(r()-0.5)*9;B(x,G(x,z),z,0.5,0.12,0.15,BN)}chest=[0,-1]}
  else if(T==='kopalnia'){const gy=G(0,-3);
    // skalne wzgórze z wejściem w drewnianej obudowie
    for(let i=0;i<16;i++){const a=Math.PI+i/15*Math.PI,x=Math.cos(a)*6,z=Math.sin(a)*4-4,g=G(x,z),hh=3+r()*3;rock(x,z,g-1,3+r()*2,hh+1,3+r()*1.5,STN)}rock(0,-6,gy-1,10,9,6,STN);if(!desert){B(0,gy+8,-6.5,6,0.3,3.6,MOSS[0]);B(-2,gy+5,-3.6,3,0.25,1,MOSS[1])}
    B(0,gy,-3.1,2.6,3,0.6,'#0e0a08');for(const s2 of [-1.45,1.45]){B(s2,gy,-2.8,0.4,3.2,0.4,WD[0]);B(s2,gy,-2,0.3,3.2,0.3,WD[1])}B(0,gy+3.2,-2.8,3.6,0.4,0.5,WD[2]);B(0,gy+3.2,-2,3.4,0.35,0.4,WD[0]);B(0,gy+3.6,-2.4,1.6,0.6,0.08,WD[1]);B(0.75,gy+2.2,-2.6,0.3,0.3,0.3,'!#ffcc66');B(0.75,gy+2.5,-2.6,0.12,0.4,0.12,IR);
    // tory, wózek, urobek, szopa
    for(let z=-2.6;z<6;z+=0.7)B(0,G(0,z),z,1.6,0.12,0.25,WD[1]);for(const s2 of [-0.55,0.55])B(s2,G(0,1.5)+0.12,1.5,0.1,0.1,8.6,IR);
    {const z=2.5,g=G(0,z)+0.2;B(0,g+0.3,z,1.2,0.8,1.6,'#5a5a60');B(0,g+0.3,z,1.3,0.1,1.7,IR);for(const s2 of [-0.55,0.55])for(const z2 of [-0.5,0.5])B(s2,g,z+z2,0.12,0.36,0.36,IR);B(0,g+1.1,z,1,0.35,1.3,'#7a6a5a');B(0.2,g+1.4,z,0.3,0.2,0.3,'#d9b23a')}
    for(let i=0;i<4;i++){const x=3+r()*2,z=1+r()*3,g=G(x,z);B(x,g,z,1.4,0.6+r()*0.6,1.2,i%2?'#6a6670':'#7a7480');B(x+0.2,g+0.8,z,0.3,0.3,0.3,i%2?'#d9b23a':'#a8d8f0')}
    {const hx=-5,hz=2,g=G(hx,hz);B(hx,g-0.5,hz,4,3.2,3.4,WD[0]);for(let x=-1.8;x<=1.8;x+=0.6)B(hx+x,g,hz+1.72,0.55,2.7,0.08,WD[(x*5|0)&1]);B(hx,g,hz+1.76,1,2,0.08,WD[1]);gable(hx,hz,4,3.4,g+2.7,1.6,RF,'x',WD[2]);B(hx+1.2,g+1.4,hz+1.78,0.8,0.6,0.06,'!#ffcc66');col(hx,hz,2,1.7,g+2.7)}
    crate(4,G(4,-1),-1,0.8);barrel(3.2,G(3.2,-1.6),-1.6);for(let k=0;k<3;k++)B(-2.6,G(-2.6,0)+k*0.25,0.2+k*0.1,1.6,0.25,0.3,WD[k%3]);B(2.4,G(2.4,-2),-2,0.08,1.2,0.08,WDD);B(2.4,G(2.4,-2)+1.1,-2,0.6,0.15,0.1,'#8a8a90');
    col(0,-6,5,3,gy+6);chest=[2,0.5]}
  else if(T==='oltarz'){const gy=G(0,0),OB=['#2a2633','#33303d','#24212b'],RD='#8a1a2a';
    for(let k=0;k<3;k++){const w=9-k*2.4;B(0,gy-0.8+k*0.5,0,w,0.5+(k===0?0.8:0),w,OB[k%3]);for(let x=-w/2+0.4;x<w/2;x+=0.9)B(x,gy-0.3+k*0.5+0.48,w/2-0.2,0.85,0.04,0.3,OB[(k+1)%3])}
    B(0,gy+0.7,0,2.6,1.1,1.4,OB[1]);B(0,gy+1.8,0,2.9,0.2,1.7,OB[0]);B(0,gy+2,0,1.8,0.04,0.8,'!#c82a3a');B(0,gy+2,0,0.6,0.5,0.6,BN);
    for(const [x,z] of [[-3.4,-3.4],[3.4,-3.4],[-3.4,3.4],[3.4,3.4]]){const g=G(x,z);for(let y=0,k=0;y<5;y+=0.9,k++)B(x,g+y,z,0.9-k*0.05,0.9,0.9-k*0.05,OB[k%3]);B(x,g+5,z,1.2,0.3,1.2,IR);B(x,g+5.3,z,0.8,0.5,0.8,'!#c84a3a');B(x,g+5.6,z,0.4,0.5,0.4,'!#ffaa55');col(x,z,0.45,0.45,g+5)}
    for(const sx of [-2,2]){const g=G(sx,-4.4);B(sx,g,-4.4,0.15,5,0.15,WDD);B(sx,g+4.8,-4.4,1.6,0.1,0.1,WDD);B(sx,g+2.6,-4.36,1.3,2.2,0.05,RD+'~');B(sx,g+3.4,-4.33,0.6,0.6,0.05,'#141414')}
    for(let k=0;k<24;k++){const a=k/24*6.28;B(Math.cos(a)*6.4,G(Math.cos(a)*6.4,Math.sin(a)*6.4)+0.02,Math.sin(a)*6.4,1.8,0.05,0.25,'!#a82a3a')}for(let k=0;k<5;k++){const a=k/5*6.28,b=(k+2)/5*6.28;const x0=Math.cos(a)*6.2,z0=Math.sin(a)*6.2,x1=Math.cos(b)*6.2,z1=Math.sin(b)*6.2;for(let t=0;t<1;t+=0.1)B(x0+(x1-x0)*t,gy+0.06,z0+(z1-z0)*t,0.5,0.04,0.5,'!#a82a3a')}
    for(let i=0;i<8;i++){const x=(r()-0.5)*12,z=(r()-0.5)*12;if(Math.abs(x)<5&&Math.abs(z)<5)continue;B(x,G(x,z),z,0.15,0.4,0.15,'#f0e8d0');B(x,G(x,z)+0.4,z,0.1,0.12,0.1,'!#ffd38a')}
    deadTree(-8,6,5);deadTree(8,-6,4.6);col(0,0,1.4,0.8,gy+1.8);col(0,0,4.5,4.5,gy+0.5);chest=[0,-2.2]}
  else if(T==='wiatrak'){const tx=0,tz=-2,gy=G(tx,tz);B(tx,gy-3,tz,6,3.2,6,SDK);
    // kamienna podstawa + drewniana wieża z łamanymi skrzydłami
    blockFaces(tx,tz,5.4,5.4,gy,3.4,STN,{hz:[[tx-0.7,tx+0.7,0,2.4]]});B(tx,gy,tz+2.75,1.4,2.4,0.1,'#0e0a08');
    for(let y=3.4,k=0;y<10;y+=0.6,k++){const w=5-k*0.25;B(tx,gy+y,tz,w,0.62,w,WD[k%3]);B(tx,gy+y,tz,w+0.06,0.06,w+0.06,WDD)}
    gable(tx,tz,3.2,3.6,gy+10,2.2,['#5a5048','#4a4038'],'x',WD[1]);B(tx,gy+8,tz+2.1,0.6,0.6,0.8,WDD);
    const arm=(ang,len,broken)=>{const L2=broken?len*0.5:len;for(let t=0.6;t<L2;t+=0.5){const x=tx+Math.cos(ang)*t,y=gy+8.3+Math.sin(ang)*t;B(x,y,tz+2.6,0.3,0.3,0.15,WD[0]);if(t>1.5){const nx=-Math.sin(ang)*0.7,ny=Math.cos(ang)*0.7;B(x+nx,y+ny,tz+2.7,0.5,0.5,0.06,broken?'#8a7a60':'#c8b89a~')}}};
    arm(0.4,5.4,0);arm(0.4+Math.PI/2,5.4,1);arm(0.4+Math.PI,5.4,0);arm(0.4+3*Math.PI/2,5.4,1);
    for(let i=0;i<5;i++){const x=3+r()*3,z=(r()-0.5)*5;B(x,G(x,z),z,0.9,0.5,0.6,'#d8c08a')}{const x=-4,z=3,g=G(x,z);B(x,g,z,2.2,0.12,1.2,WD[1]);B(x,g+0.12,z,0.9,0.7,0.9,'#c8b89a');B(x+0.8,g+0.12,z,0.8,0.6,0.8,'#d0c098')}
    for(let i=0;i<10;i++){const a=i/10*6.28,x=Math.cos(a)*8,z=Math.sin(a)*8-1,g=G(x,z);if(i%3===2)continue;B(x,g,z,0.15,1.1,0.15,WD[0]);B(x+Math.sin(a)*1.1,g+0.8,z-Math.cos(a)*1.1,Math.abs(Math.sin(a))*2+0.1,0.1,Math.abs(Math.cos(a))*2+0.1,WD[1])}
    col(tx,tz,2.7,2.7,gy+10);chest=[2.6,2.4]}
  else if(T==='loch'){const gy=G(0,0),K=['#7d7884','#6f6a73','#8a8590','#64606a'];B(0,gy-3,0,8,3,8,SDK);
    blockFaces(0,0,6,6,gy,4.4,K,{hz:[[-1.1,1.1,0,3]]});B(0,gy,3.02,2.2,3,0.1,'#100c0a');for(let k=-3;k<=3;k++)B(k*0.32,gy+0.1,3.15,0.06,2.6,0.06,IR);B(0,gy+1.6,3.15,2.2,0.08,0.08,IR);
    for(const sx of [-1.7,1.7]){B(sx,gy,3.4,0.7,0.4,0.7,K[3]);for(let y=0.4,k=0;y<3.6;y+=0.55,k++)B(sx,gy+y,3.4,0.5,0.53,0.5,K[k%3]);B(sx,gy+3.6,3.4,0.8,0.3,0.8,K[2])}
    for(let i=0;i<5;i++){const w=4.2-i*0.9;B(0,gy+3.9+i*0.35,3.5,w,0.36,0.8,K[i%3])}B(0,gy+4.4,0,6.6,0.4,6.6,K[2]);pyr(0,0,6,gy+4.8,2.4,['#5d5a63','#6f6a73']);B(0,gy+7.4,0,0.4,1,0.4,K[0]);B(0,gy+8.1,0,1.2,0.3,0.3,K[0]);
    for(let k=0;k<3;k++)B(0,gy-0.45+k*0.15,3.6+(2-k)*0.5,2.6,0.2,0.55,K[k]);torch(-2.6,gy+1.6,3.2);torch(2.6,gy+1.6,3.2);for(const x of [-2.6,2.6]){B(x,gy,4,0.8,0.6,0.8,K[1]);B(x,gy+0.6,4,0.5,0.4,0.5,BN)}
    for(let i=0;i<5;i++){const a=r()*6.28,x=Math.cos(a)*6,z=Math.sin(a)*6;B(x,G(x,z),z,0.9,1.4+r(),0.3,K[i%4]);B(x,G(x,z)+1,z,0.6,0.12,0.32,K[2])}
    s.cols=[[s.x,s.z,3,3,gy+4.4]];chest=null}
  else if(T==='jaskinia'){const gy=G(0,0),R=['#6c6a67','#7d7b78','#5f5d5a','#888580'];
    for(let i=0;i<20;i++){const a=i/20*Math.PI*2,rx=4.8,rz=3.8,x=Math.cos(a)*rx,z=Math.sin(a)*rz;if(Math.sin(a)>0.75)continue;const hh=3+((i*37)%5)*0.7;rock(x,z,gy-1.5,2.6+((i*7)%3)*0.5,hh+2,2.6,R)}
    rock(0,-0.5,gy-1,7,7.4,5.5,R);if(!desert){B(0,gy+6.6,-1,4.6,0.2,3.6,MOSS[0]);for(let i=0;i<6;i++)B(-2+i*0.8,gy+3.6-((i*3)%3)*0.4,2.32,0.12,1.4,0.06,MOSS[i%3])}
    B(0,gy,2.2,2.4,2.8,0.4,'#120c0a');for(const s2 of [-1.3,1.3])B(s2,gy,2.4,0.32,3,0.32,WD[0]);B(0,gy+3,2.4,3,0.35,0.4,WD[1]);B(-1.3,gy+2.2,2.62,0.25,0.25,0.25,'!#ffcc66');
    for(let i=0;i<4;i++){const x=-2+i*1.3,z=3.4+(i%2)*0.6;B(x,G(x,z),z,0.9,0.5+(i%2)*0.4,0.8,R[i%4])}for(let k=0;k<3;k++)B(-0.8+k*0.8,gy+2.6,2.3,0.25,0.5-k%2*0.2,0.25,R[2]);
    s.cols=[[s.x,s.z-0.5,3.5,2.8,gy+5]];chest=null}
  else if(T==='zamczysko'){const gy=s.h,A=30,Hw=12,TH=3,K=['#6f6a73','#64606a','#7a7580','#5d5a63'],K2='#4f4c55',SL=['#4a4f5a','#3e4350'],q={bl:1.6,rh:0.8};
    const curtain=(ax,a0,a1,o,out)=>{const mid=(a0+a1)/2,len=a1-a0;if(ax==='x')B(mid,gy-4,o,len,4+Hw,TH,K2);else B(o,gy-4,mid,TH,4+Hw,len,K2);
      cw(ax,a0,a1,o,gy,Hw,TH,K,{...q,nocore:1,one:out});cw(ax,a0,a1,o,gy,Hw,TH,K,{...q,nocore:1,one:-out});
      const put=(a,y,oo,la,h,t,c)=>ax==='x'?B(a,y,o+oo*out,la,h,t,c):B(o+oo*out,y,a,t,h,la,c);
      put(mid,gy-0.2,TH/2+0.6,len,1.2,1.2,K2);put(mid,gy+Hw,0,len,0.15,TH-0.6,'#5a4a3a');
      put(mid,gy+Hw,TH/2-0.3,len,1.1,0.6,K[2]);const nb=Math.floor(len/1.8);for(let i=0;i<nb;i+=2)put(a0+(i+0.5)*len/nb,gy+Hw+1.1,TH/2-0.3,len/nb*0.96,1.1,0.6,K[i%4]);
      put(mid,gy+Hw,-TH/2+0.25,len,0.9,0.5,K[1]);for(let a=a0+2;a<a1-1;a+=3){put(a,gy+Hw-0.9,TH/2+0.3,0.6,0.9,0.6,K[3]);put(a+1.5,gy+Hw-0.5,TH/2+0.05,0.12,0.6,0.04,'#1a1a1a')}
      for(let a=a0+5;a<a1-3;a+=9){put(a,gy,TH/2+0.9,1.6,6,1.8,K[0]);put(a,gy+6,TH/2+0.6,1.3,1.2,1.2,K[2])}
      for(let a=a0+7;a<a1-5;a+=14){put(a,gy+Hw-4.8,TH/2+0.08,1.6,3.6,0.06,'#1a1a1a~');put(a,gy+Hw-3.6,TH/2+0.12,0.7,0.7,0.06,'#a8352a')}
      cols.push(ax==='x'?[s.x+mid,s.z+o,len/2,TH/2,gy+Hw]:[s.x+o,s.z+mid,TH/2,len/2,gy+Hw])};
    curtain('x',-A,A,-A,-1);curtain('z',-A,A,-A,-1);curtain('z',-A,A,A,1);curtain('x',-A,-4,A,1);curtain('x',4,A,A,1);
    const tower=(x,z,S,h,roof)=>{B(x,gy-4,z,S+1,4.4,S+1,K2);blockFaces(x,z,S,S,gy,h,K,{...q,core:K2});for(const y of [h*0.33,h*0.66])B(x,gy+y,z,S+0.35,0.4,S+0.35,K[2]);
      for(const [ax,az] of [[1,0],[-1,0],[0,1],[0,-1]])for(const y of [h*0.25,h*0.5,h*0.75]){const hot=y>h*0.6;B(x+ax*(S/2+0.04),gy+y,z+az*(S/2+0.04),ax?0.06:0.35,1.4,az?0.06:0.35,hot?'!#ffb04a':'#1a1a1a')}
      const ck=S+1.4;B(x,gy+h,z,ck,0.8,ck,K[2]);const n=Math.max(3,Math.round(S/1.6));for(let i=0;i<n;i++){const o=-S/2+(i+0.5)*S/n;for(const sg of [-1,1]){B(x+o,gy+h-0.7,z+sg*(S/2+0.35),0.5,0.7,0.6,K[3]);B(x+sg*(S/2+0.35),gy+h-0.7,z+o,0.6,0.7,0.5,K[3])}}
      const m2=n*2-1,stp=ck/m2;for(let i=0;i<m2;i+=2){const o=-ck/2+(i+0.5)*stp;for(const sg of [-1,1]){B(x+o,gy+h+0.8,z+sg*(ck/2-0.3),stp*0.96,1.2,0.6,K[i%4]);B(x+sg*(ck/2-0.3),gy+h+0.8,z+o,0.6,1.2,stp*0.96,K[(i+1)%4])}}
      if(roof)pyr(x,z,S,gy+h+0.8,S*1.15,SL);B(x+0.6,gy+h+0.8+S*1.15+0.6,z,1.2,0.7,0.06,'#1a1a1a~');B(x+0.6,gy+h+0.8+S*1.15+0.7,z,0.4,0.35,0.07,'#a8352a');cols.push([s.x+x,s.z+z,S/2,S/2,gy+h])};
    for(const [x,z] of [[A,A],[-A,A],[A,-A],[-A,-A]])tower(x,z,9,20,1);for(const [x,z] of [[A,0],[-A,0],[0,-A]])tower(x,z,6,16,1);for(const x of [-6.5,6.5])tower(x,A,5,17,1);
    // brama: łuk, krata, most nad fosą
    B(0,gy+7,A,8,Hw-7+1.2,TH,K2);cw('x',-4,4,A,gy+7,Hw-7,TH,K,{...q,nocore:1,one:1});for(let k=-4;k<=4;k++)B(k*0.85,gy+6.4+(4-Math.abs(k))*0.16,A+TH/2,0.8,0.7,0.6,K[(k+4)%4]);
    for(let i=-4;i<=4;i++)B(i*0.85,gy+3.5,A+TH/2+0.3,0.12,3.6,0.12,'#2a2a30');for(const y of [4,5.5,6.6])B(0,gy+y,A+TH/2+0.3,7.4,0.14,0.14,'#2a2a30');
    for(const sg of [-1,1]){B(sg*3.6,gy,A+TH/2+1,0.3,4.8,0.3,'#4a2f1d');B(sg*3.8,gy+4.6,A+TH/2+0.7,0.12,3,0.12,'#2a2a30')}for(let z=A+2;z<A+9;z+=0.6)B(0,gy-0.25,z,7,0.25,0.55,(z*3|0)%2?WD[0]:WD[1]);
    for(const sg of [-1,1])for(let k=0;k<2;k++)B(sg*2.6,gy+8.5+k*1.6,A+TH/2+0.1,1.2,1.4,0.06,'#a8352a~');
    // donżon z przyporami i narożnymi wieżyczkami
    {const dx=0,dz=-16,W3=18,D3=14,H3=22;B(dx,gy-4,dz,W3+1,4.6,D3+1,K2);blockFaces(dx,dz,W3,D3,gy,H3,K,{...q,core:K2,hz:[[-1.5,1.5,0,4]]});for(const y of [7,14,20])B(dx,gy+y,dz,W3+0.4,0.45,D3+0.4,K[2]);
      for(const xx of [-6,-2,2,6])for(const y of [9,15.5])B(xx,gy+y,dz+D3/2+0.05,0.7,1.8,0.06,y>12?'!#ffb04a':'#141414');for(const zz of [-4,0,4])for(const sg of [-1,1])B(dx+sg*(W3/2+0.05),gy+12,dz+zz,0.06,1.8,0.7,'#141414');
      B(0,gy,dz+D3/2+0.06,3,4,0.12,'#3a2414');for(const y of [1,2.6])B(0,gy+y,dz+D3/2+0.14,3.05,0.12,0.06,IR);for(let k=0;k<5;k++)B(0,gy-0.4+k*0.08,dz+D3/2+1+k*0.0,4.4-k*0.4,0.2,2.2-k*0.35,K[k%3]);
      for(const xx of [-W3/2+2,W3/2-2])for(const sg of [-1,1])B(xx,gy,dz+sg*(D3/2+0.7),1.6,7,1.4,K[0]);
      B(dx,gy+H3,dz,W3+1,0.7,D3+1,K[2]);for(let i=0;i<10;i+=2){const o=-W3/2+(i+0.5)*W3/10;for(const sg of [-1,1])B(dx+o,gy+H3+0.7,dz+sg*(D3/2+0.2),W3/10*0.96,1.2,0.6,K[i%4])}
      {const st=8;for(let i=0;i<st;i++){const w=(W3-2)*(1-i/st)+0.4,d=(D3-2)*(1-i/st)+0.4;B(dx,gy+H3+0.7+i*0.9,dz,w,0.92,d,SL[i%2])}}
      for(const [x,z] of [[W3/2,D3/2],[-W3/2,D3/2],[W3/2,-D3/2],[-W3/2,-D3/2]])tower(dx+x,dz+z,4,H3+5,1);cols.push([s.x+dx,s.z+dz,W3/2,D3/2,gy+H3])}
    // koszary i kaplica przy murach
    {const bx=-A+5.5,bz=6,g=gy;B(bx,g,bz,7,4.5,14,K[1]);cw('z',bz-7,bz+7,bx+3.5,g,4.5,0.05,K,{...q,nocore:1,one:1,holes:[[bz-1,bz+1,0,2.8],[bz-5,bz-4,2,3.4],[bz+4,bz+5,2,3.4]]});B(bx+3.52,g,bz,0.1,2.8,2,'#3a2414');gable(bx,bz,14,7,g+4.5,3.2,SL,'z',WD[1]);B(bx+3.56,g+2.4,bz-4.5,0.06,1.4,1,'!#ffb04a');cols.push([s.x+bx,s.z+bz,3.5,7,g+4.5])}
    {const cx=A-6,cz=6,g=gy;B(cx,g,cz,7,6,10,K[2]);cw('z',cz-5,cz+5,cx-3.5,g,6,0.05,K,{...q,nocore:1,one:-1,holes:[[cz-0.9,cz+0.9,0,3],[cz-3.4,cz-2.6,2.6,4.8],[cz+2.6,cz+3.4,2.6,4.8]]});for(const zz of [-3,3])B(cx-3.55,g+2.6,cz+zz,0.06,2.2,0.8,'!#b08aff');B(cx-3.52,g,cz,0.1,3,1.8,'#3a2414');gable(cx,cz,10,7,g+6,3.4,SL,'z',K[1]);B(cx,g+9.4,cz-3,0.2,2,0.2,'#c9a24a');B(cx,g+10.4,cz-3,0.9,0.2,0.2,'#c9a24a');cols.push([s.x+cx,s.z+cz,3.5,5,g+6])}
    // dziedziniec: bruk, studnia, koksowniki, manekiny, kości
    for(let x=-A+3;x<A-2;x+=3)for(let z=-7;z<A-2;z+=3)if(Math.abs(x)>A-10&&z>-2&&z<14){}else B(x,gy-0.06,z,2.9,0.08,2.9,((x+z)/3&1)?'#6a6670':'#76727c');
    B(0,gy,6,3,1,3,K[0]);B(0,gy+0.95,6,2.4,0.1,2.4,'#2a4a6a');for(const sg of [-1,1])B(sg*1.2,gy+1,6,0.25,2.4,0.25,WD[0]);B(0,gy+3.3,6,2.8,0.25,0.25,WD[1]);gable(0,6,3,2.6,gy+3.4,1,SL,'x',null);cols.push([s.x,s.z+6,1.5,1.5,gy+1]);
    for(const [x,z] of [[-8,0],[8,0],[-8,16],[8,16],[-4,24],[4,24]]){B(x,gy,z,0.9,1.1,0.9,'#2a2a30');B(x,gy+1.1,z,0.7,0.35,0.7,'!#ff6a1a');B(x,gy+1.4,z,0.35,0.35,0.35,'!#ffd34d')}
    for(const x of [12,15,18]){B(x,gy,18,0.2,1.6,0.2,WD[0]);B(x,gy+1.2,18,1,0.2,0.2,WD[0]);B(x,gy+1.4,18,0.5,0.6,0.4,'#c8b89a')}
    for(let i=0;i<10;i++)B(-12+r()*24,gy+0.02,10+r()*10,0.6,0.12,0.18,BN);
    chest=[0,-6.5]}
  else if(T==='wrak'){const gy=G(0,0),WD2=['#4a3a2a','#3e3022','#56432f'],AL=['#2f5a3a','#3a6a42','#285030'];
    for(let i=0;i<14;i++){const z=-5+i*0.8,t=(z)/5.6,w=2.6*Math.sqrt(Math.max(0.05,1-t*t)),g=G(0,z)-0.4;B(0,g,z,w*0.5,0.3,0.82,WD2[i%3]);for(const sg of [-1,1]){const br=sg>0&&i>4&&i<10;if(br)continue;for(let k=0;k<3;k++)B(sg*(w/2-0.1),g+0.3+k*0.45,z,0.18,0.42,0.78,WD2[(i+k)%3])}}
    for(let k=0;k<6;k++){const z=-3.5+k*1.4,g=G(0,z)-0.3;for(const sg of [-1,1])B(sg*1.15,g+0.7,z,0.16,1.6,0.16,'#2e2418')}
    {const g=G(1.5,1)-0.2;for(let k=0;k<9;k++)B(1.2+k*0.55,g+0.25,1.2+k*0.3,0.3,0.3,0.4,'#3a2a1a');B(5.4,g+0.3,3.4,2.4,0.06,1.6,'#9a8a6a')}
    for(let i=0;i<8;i++){const x=(r()-0.5)*8,z=(r()-0.5)*10,g=G(x,z);if(i%2)B(x,g,z,0.6,0.8,0.6,'#5a4030');else{B(x,g,z,0.7,0.5,0.7,'#4a3a2a');B(x,g+0.5,z,0.72,0.06,0.72,'#2a2a2a')}}
    for(let i=0;i<18;i++){const x=(r()-0.5)*9,z=(r()-0.5)*12,g=G(x,z),hh=0.8+r()*2.2;B(x,g,z,0.12,hh,0.06,AL[i%3]);B(x+0.08,g+hh*0.5,z,0.1,hh*0.5,0.05,AL[(i+1)%3])}
    for(let i=0;i<10;i++){const x=(r()-0.5)*7,z=(r()-0.5)*9;B(x,G(x,z),z,0.3,0.12,0.3,['#d8b24a','#e0c06a','#c8a040'][i%3])}
    cols.push([s.x,s.z,1.3,5,gy+0.6]);chest=[0,0.5]}
  else if(T==='legowisko'){const gy=G(0,0),BO=['#e8e0c8','#d8ceb0','#c8bc98'],RK=['#6c6a67','#7d7b78','#5f5d5a','#888580'],SC='#2a221c';
    for(let i=0;i<40;i++){const a=r()*6.28,rr=r()*15,x=Math.cos(a)*rr,z=Math.sin(a)*rr;B(x,G(x,z)+0.01,z,1.6+r()*2,0.05,1.4+r()*2,i%3?SC:'#3a2e24')}
    for(let i=0;i<9;i++){const a=i/9*6.28+0.2,x=Math.cos(a)*17,z=Math.sin(a)*17;if(Math.abs(a-Math.PI/2)<0.45)continue;const h=3+r()*4;rock(x,z,G(x,z)-1,3+r()*2,h+1,3+r()*2,RK);cols.push([s.x+x,s.z+z,1.6,1.6,G(x,z)+h])}
    // ogromny szkielet: kręgosłup i żebra łukami
    for(let k=0;k<9;k++){const z=-8+k*1.6,g=G(0,z);B(0,g+0.1,z,0.9,0.7,1.2,BO[k%3]);if(k>1&&k<8){const span=3.2+Math.sin(k/9*Math.PI)*2.2;for(const sg of [-1,1])for(let t=0;t<7;t++){const an=t/6*Math.PI*0.62,x=sg*Math.sin(an)*span,y=Math.cos(an)*-0+Math.sin(an*1.6)*span*0.9;B(x,g+0.1+y,z,0.45,0.45,0.4,BO[(t+k)%3])}}}
    {const z=8,g=G(0,z);B(0,g,z,3.2,2.2,3,BO[0]);B(0,g+2.2,z-0.3,2.8,0.8,2.4,BO[1]);for(const sg of [-1,1]){B(sg*0.8,g+1.2,z+1.52,0.8,0.7,0.06,'#141414');B(sg*1.9,g+2.4,z+0.4,0.7,0.6,0.7,BO[2]);B(sg*2.5,g+3.2,z+0.2,0.5,1.4,0.5,BO[0]);B(sg*2.6,g+4.4,z,0.35,0.9,0.35,BO[1])}B(0,g+0.3,z+1.6,2.2,0.5,0.6,BO[2]);for(let t=-3;t<=3;t++)B(t*0.3,g+0.6,z+1.85,0.15,0.4,0.12,'#f4efe4');cols.push([s.x,s.z+z,1.6,1.5,g+2.6])}
    for(let i=0;i<14;i++){const x=(r()-0.5)*20,z=(r()-0.5)*20;if(Math.hypot(x,z)<4)continue;const g=G(x,z);B(x,g,z,0.25,0.18,1.3+r(),BO[i%3]);if(i%3==0)B(x+0.5,g,z,0.6,0.5,0.6,BO[0])}
    for(let i=0;i<16;i++){const x=-2+r()*4,z=-2+r()*3;B(x,G(x,z)+(i%3)*0.15,z,0.5+r()*0.4,0.25,0.5,i%4?'#e0b84a':'#c8a030')}
    for(const [x,z] of [[-6,-6],[6,-6],[-6,5],[6,5]]){const g=G(x,z);B(x,g,z,0.2,2.6,0.2,'#3a2414');B(x,g+2.4,z,0.7,0.6,0.7,BO[0]);B(x,g+2.2,z,0.5,0.3,0.5,FIRE)}
    chest=[0,-2.5]}
  else if(T==='grota'){const gy=G(0,0),R=['#6c6a67','#7d7b78','#5a5856','#4e4c4a'],GO='#e0b84a';
    for(let i=0;i<26;i++){const a=i/26*Math.PI*2,rr=7+r()*3.5,x=Math.cos(a)*rr,z=Math.sin(a)*rr;if(Math.sin(a)>0.8&&Math.abs(Math.cos(a))<0.5)continue;const h=4+r()*6*(1-Math.max(0,Math.sin(a))*0.4);rock(x,z,gy-2,3+r()*2,h+2,3+r()*2,R)}
    rock(0,-1.5,gy-1,12,12,9,R);rock(-3,-2,gy+8,5,5,5,R);rock(3,-1,gy+7,4,4,4,R);
    B(0,gy,5.4,4.4,4.4,0.5,'#120c0a');for(let k=-3;k<=3;k++)B(k*0.75,gy+4.2+(3-Math.abs(k))*0.25,5.6,0.8,0.9,1,R[(k+3)%4]);for(let k=-2;k<=2;k++)B(k*0.9,gy+3.6-((k*7)%3)*0.2,5.75,0.25,0.6,0.25,R[1]);
    for(let i=0;i<14;i++){const x=(r()-0.5)*10,z=5.5+r()*6;B(x,G(x,z)+0.02,z,1.6+r(),0.06,1.4+r(),'#2a221c')}
    for(let i=0;i<8;i++){const x=-3+r()*6,z=6+r()*4;B(x,G(x,z),z,0.8,0.14,0.2,BN);if(i%3==0)B(x+0.4,G(x,z),z,0.3,0.25,0.3,BN)}
    {const x=4,z=7,g=G(x,z);B(x,g,z,1.6,0.9,2.2,'#d8d0b8');B(x,g+0.3,z+1.3,1.2,0.5,0.8,'#d8d0b8');B(x-0.5,g+0.6,z+0.6,0.3,0.25,0.06,'#141414');B(x+0.5,g+0.6,z+0.6,0.3,0.25,0.06,'#141414');for(const s2 of [-1,1])B(x+s2*0.6,g+0.9,z-0.8,0.25,0.9,0.25,'#d8d0b8')}
    for(let i=0;i<12;i++){const x=-2.5+r()*5,z=4.4+r()*1.6;B(x,G(x,z)+(i%3)*0.15,z,0.6+r()*0.4,0.25,0.5,i%4?GO:'#c8a030')}B(-1,gy,4.6,0.9,0.7,0.6,'#7a4b22');B(-1,gy+0.7,4.6,0.95,0.1,0.65,GO);
    for(let i=0;i<5;i++){const x=-5+r()*10,z=8+r()*4;B(x,G(x,z),z,0.4,1+r()*1.4,0.4,R[i%4])}
    cols.push([s.x,s.z-1.5,6,4.5,gy+9]);chest=[1.5,4.5]}
  else return null;
  return{L,cols,chest}}
function buildStruct(s){
  const r=rngOf('st'+s.id),g=new THREE.Group(),L=[],cols=[];
  if(s.friendly){s.g=g;s.cols=[];scene.add(g);return}
  let SD=null;try{SD=structDetail(s,r)}catch(e){console.warn('struktura',s.type,e)}
  if(SD){const m0=new THREE.Mesh(boxes(SD.L),matB);m0.position.set(s.x,0,s.z);m0.castShadow=true;m0.receiveShadow=true;g.add(m0);cols.push(...SD.cols);s._ch=SD.chest;if(!SD.chest){if(!(s.cols&&s.cols.length))s.cols=cols;s.g=g;scene.add(g);voxQueue(g,'S'+s.id);return}}
  if(!SD&&(s.type==='loch'||s.type==='jaskinia')){const gr=hsAt(s,s.x,s.z),EL=[];
    if(s.type==='loch'){const S1='#7d7884',S2='#6f6a73';EL.push([0,gr+1.6,0,6,4.2,6,S1],[0,gr+3.9,0,6.6,0.5,6.6,S2],[0,gr+4.4,0,5,0.5,5,S1],[0,gr+4.9,0,3,0.5,3,S2],[0,gr+5.6,0,0.5,1.2,0.5,S1],[0,gr+5.9,0,1.4,0.4,0.4,S1],[0,gr-1,0,7,2,7,S2]);
      EL.push([0,gr+1.3,3.02,2.2,2.8,0.1,'#100c0a'],[-1.4,gr+1.6,3.05,0.5,3.2,0.3,S2],[1.4,gr+1.6,3.05,0.5,3.2,0.3,S2],[0,gr+3.2,3.05,3.3,0.5,0.3,S2]);for(const x of [-2.4,2.4])EL.push([x,gr+0.6,3.6,0.9,1.2,0.9,S2],[x,gr+1.6,3.6,0.4,0.8,0.4,'#e8e2cc']);s.cols=[[s.x,s.z,3,3,gr+5]]}
    else{const R1='#6c6a67',R2='#7d7b78';for(let i=0;i<14;i++){const a=i/14*Math.PI*2;if(Math.sin(a)>0.8)continue;const x=Math.cos(a)*4.5,z=Math.sin(a)*3.5,h=3+((i*37)%5)*0.7;EL.push([x,gr+h/2-1,z,2.8,h+2,2.8,i%2?R1:R2])}EL.push([0,gr+3,0,7,5,6,R1],[0,gr+5.6,-0.5,5,2,4,R2],[0,gr+1.3,3.1,2.6,2.8,0.4,'#0c0a08'],[0,gr+3.1,3.2,3.4,0.8,0.8,R2]);s.cols=[[s.x,s.z-0.5,3.5,3,gr+5]]}
    const mm=new THREE.Mesh(boxes(EL),matB);mm.position.set(s.x,0,s.z);mm.castShadow=true;mm.receiveShadow=true;g.add(mm);s.g=g;scene.add(g);voxQueue(g,'S'+s.id);return}
  if(!SD&&(s.type==='zamczysko'||s.type==='grota')){const geo=s.type==='zamczysko'?castleGeo(s):grotaGeo(s,r),mm=new THREE.Mesh(geo,matB);mm.position.set(s.x,s.h,s.z);mm.scale.setScalar(BS);mm.castShadow=true;mm.receiveShadow=true;g.add(mm);
    const H=s.h;if(s.type==='zamczysko'){const A=21;cols.push([s.x,s.z-A,22.5,1.5,H+12],[s.x+A,s.z,1.5,22.5,H+12],[s.x-A,s.z,1.5,22.5,H+12],[s.x-12.25,s.z+A,8.75,1.5,H+12],[s.x+12.25,s.z+A,8.75,1.5,H+12],[s.x,s.z-12,8,7,H+20]);for(const [x,z] of [[A,A],[-A,A],[A,-A],[-A,-A]])cols.push([s.x+x,s.z+z,4,4,H+18]);for(const x of [-6,6])cols.push([s.x+x,s.z+A,2.5,2.5,H+15])}
    else cols.push([s.x,s.z-1,5,4,H+9]);
    const cx=0,cz=s.type==='zamczysko'?-3.5:4.5,cy=H;const chest=new THREE.Group(),base=new THREE.Mesh(boxes([[0,0.35,0,1.2,0.7,0.8,'#7a4b22'],[0,0.35,0.41,1.22,0.12,0.02,'#d9b23a'],[0,0.55,0.41,0.18,0.22,0.03,'#ffd34d']]),decoMat);
    const lid=new THREE.Group();lid.position.set(0,0.7,-0.4);lid.add(new THREE.Mesh(boxes([[0,0.12,0.4,1.24,0.26,0.84,'#8f5a2a'],[0,0.12,0.82,1.26,0.08,0.02,'#d9b23a']]),decoMat));chest.add(base,lid);chest.position.set(s.x+cx,cy,s.z+cz);g.add(chest);if(W.opened[s.id])lid.rotation.x=-1.9;
    s.chest={x:s.x+cx,z:s.z+cz,y:cy,lid};s.cols=cols;s.g=g;scene.add(g);voxQueue(g,'S'+s.id);return}
  const box=(x,z,w,hgt,d,col,base,solid=true)=>{const gr=base!=null?base:hsAt(s,s.x+x,s.z+z);L.push([x,gr-1+(hgt+1)/2,z,w,hgt+1,d,col]);if(solid)cols.push([s.x+x,s.z+z,w/2,d/2,gr+hgt])};
  const STONE='#8b8b8e',MOSS='#5f7a3a',DSTONE='#6c6a67';
  if(SD){}else if(s.type==='ruiny'){
    const st=s.b===4?'#d9c79a':STONE;
    for(let i=0;i<9;i++){const a=i/9*6.28+r()*0.4,rr=4+r()*4.5,x=Math.cos(a)*rr,z=Math.sin(a)*rr,len=2+Math.floor(r()*4),hgt=1+Math.floor(r()*3.5),ax=r()<0.5;
      box(x,z,ax?len:1,hgt,ax?1:len,st);if(r()<0.5&&s.b!==4)L.push([x,hsAt(s,s.x+x,s.z+z)+hgt+0.05,z,ax?len:1,0.12,ax?1:len,MOSS])}
    for(let i=0;i<3;i++){const a=r()*6.28,x=Math.cos(a)*3,z=Math.sin(a)*3;box(x,z,1.1,4+Math.floor(r()*3),1.1,st)}
    for(let i=0;i<6;i++){const x=(r()-0.5)*8,z=(r()-0.5)*8;L.push([x,hsAt(s,s.x+x,s.z+z)+0.05,z,1.6,0.12,1.6,DSTONE])}
    {const ax=r()*6.28,x=Math.cos(ax)*2,z=Math.sin(ax)*2,g0=hsAt(s,s.x+x,s.z+z);box(x-1.6,z,0.9,5,0.9,st);box(x+1.6,z,0.9,5,0.9,st);L.push([x,g0+4.6,z,4.1,0.9,1,st],[x,g0+4.05,z,2.3,0.25,0.9,st],[x-1.6,g0+5.15,z,1.1,0.2,1.1,DSTONE],[x+1.6,g0+5.15,z,1.1,0.2,1.1,DSTONE]);if(s.b!==4)L.push([x-1.6,g0+2.5,z+0.47,0.3,3.5,0.06,MOSS],[x+0.4,g0+4.1,z+0.52,1.2,0.6,0.06,MOSS])}
    for(let i=0;i<4;i++){const x=(r()-0.5)*9,z=(r()-0.5)*9,g0=hsAt(s,s.x+x,s.z+z);L.push([x,g0+0.25,z,1.2,0.5,0.7,st],[x+0.3,g0+0.62,z,0.6,0.3,0.6,DSTONE])}
  } else if(s.type==='oboz'){
    const cl=['#8a3a2a','#6b5a3a','#7a6a55','#5a4a3a'];
    for(let i=0;i<4;i++){const a=i/4*6.28+0.5,x=Math.cos(a)*6,z=Math.sin(a)*6,gr=hsAt(s,s.x+x,s.z+z),c=cl[i];
      for(let k=0;k<4;k++){const sz=3.4-k*0.8;L.push([x,gr+0.4+k*0.6,z,sz,0.6,sz,c])}L.push([x,gr+2.9,z,0.15,0.8,0.15,'#5a3b22']);cols.push([s.x+x,s.z+z,1.7,1.7,gr+2.6])}
    const gr=hsAt(s,s.x,s.z);L.push([0,gr+0.15,0,1.4,0.3,1.4,'#4a4a4a'],[0,gr+0.5,0,0.8,0.5,0.8,'#ff8a2e'],[0,gr+0.85,0,0.4,0.4,0.4,'#ffd34d']);cols.push([s.x,s.z,0.7,0.7,gr+0.5]);
    L.push([2.2,gr+0.25,0,2.4,0.5,0.5,'#6b4a2b'],[-2.2,gr+0.25,0.5,0.5,0.5,2.4,'#6b4a2b']);
    for(let i=0;i<22;i++){const a=i/22*6.28;if(i%11===0)continue;const x=Math.cos(a)*10,z=Math.sin(a)*10,g0=hsAt(s,s.x+x,s.z+z),h=2.2+(i%3)*0.3;L.push([x,g0+h/2-0.2,z,0.5,h,0.5,'#6b4a2b'],[x,g0+h,z,0.3,0.4,0.3,'#8a6a44']);cols.push([s.x+x,s.z+z,0.3,0.3,g0+h])}
    for(const sg of [-1,1]){const x=9.8,z=sg*1.2,g0=hsAt(s,s.x+x,s.z+z);L.push([x,g0+2,z,0.14,4,0.14,'#4a2f1d'],[x+sg*0.45,g0+3.3,z,0.8,1.3,0.04,'#7a2a22'],[x+sg*0.45,g0+3.2,z,0.3,0.3,0.05,'#e8e2cc'])}
    {const x=-3.5,z=-2,g0=hsAt(s,s.x+x,s.z+z);L.push([x,g0+0.9,z,1.6,0.12,0.2,'#5a3b22'],[x-0.7,g0+0.6,z,0.12,1.2,0.12,'#5a3b22'],[x+0.7,g0+0.6,z,0.12,1.2,0.12,'#5a3b22'],[x-0.3,g0+0.8,z+0.1,0.06,1.3,0.06,'#aeb6bd'],[x+0.2,g0+0.8,z+0.1,0.06,1.3,0.06,'#7a5230'],[x+0.2,g0+1.5,z+0.1,0.14,0.2,0.04,'#aeb6bd'])}
  } else if(s.type==='wieza'){
    const gr=Math.min(...[-2,0,2].flatMap(a=>[-2,0,2].map(b=>hsAt(s,s.x-3+a,s.z+b))));
    for(let k=0;k<11;k++)L.push([-3,gr-1+k+0.5,0,5-(k%3===2?0.2:0),1,5-(k%3===2?0.2:0),k%2?STONE:DSTONE]);
    for(const [a,b] of [[-1,-1],[1,-1],[-1,1],[1,1]])L.push([-3+a*2,gr+10.5,b*2,1,1.2,1,STONE]);
    L.push([-3,gr+1.1,2.52,1.2,2.2,0.08,'#2a2018'],[-3,gr+6,2.52,0.6,1,0.08,'#1a1a1a'],[-0.48,gr+4,0,0.08,1,0.6,'#1a1a1a']);
    cols.push([s.x-3,s.z,2.5,2.5,gr+11]);
    for(let i=0;i<5;i++)L.push([-3+(i-2)*0.95,gr+0.15+i*0.0,2.9+i*0.0,0.9,0.3,0.6,DSTONE]);
    L.push([-3,gr+2.35,2.55,1.6,0.3,0.2,DSTONE],[-3.7,gr+1.1,2.55,0.25,2.4,0.2,DSTONE],[-2.3,gr+1.1,2.55,0.25,2.4,0.2,DSTONE]);
    for(let k=0;k<5;k++){const w=5.2-k*1.05;L.push([-3,gr+11.2+k*0.55,0,w,0.55,w,k%2?'#93391f':'#a8452c'])}L.push([-3,gr+14.2,0,0.12,1.3,0.12,'#4a2f1d'],[-2.6,gr+14.5,0,0.8,0.45,0.04,'#7a2a22']);
    if(s.b!==4)for(let k=0;k<3;k++)L.push([-0.47,gr+1.5+k*2.2,(k-1)*0.9,0.06,1.6,0.6,MOSS]);
    for(let i=0;i<4;i++){const x=1+r()*4,z=(r()-0.5)*7;box(x,z,1,1,1,STONE)}
  } else {
    for(let i=0;i<8;i++){const a=i/8*6.28,x=Math.cos(a)*9,z=Math.sin(a)*9;box(x,z,1,3+Math.floor(r()*2),0.9,DSTONE);L.push([x,hsAt(s,s.x+x,s.z+z)+0.2,z,1.4,0.4,1.3,MOSS])}
    const gr=hsAt(s,s.x,s.z);
    for(let k=0;k<3;k++)L.push([0,gr+k*0.7,-4.5,7-k*2,0.7,4-k*1,k===2?MOSS:'#5a6a4a']);cols.push([s.x,s.z-4.5,3.5,2,gr+1.5]);
    L.push([0,gr+0.5,0,2.2,1,1.2,STONE],[0,gr+1.05,0,2.4,0.1,1.4,'#b874ff']);cols.push([s.x,s.z,1.1,0.6,gr+1]);
    for(let i=0;i<8;i+=2){const a=i/8*6.28,x=Math.cos(a)*9,z=Math.sin(a)*9,g0=hsAt(s,s.x+x,s.z+z);L.push([x,g0+4.4,z,1.3,0.5,1.2,DSTONE],[x,g0+2.2,z+0.46,0.3,0.3,0.02,'#b874ff'])}
    L.push([0,gr+0.6,-2.45,1.4,1.2,0.1,'#2a2420'],[0,gr+1.35,-2.45,1.8,0.3,0.3,STONE],[-0.75,gr+0.6,-2.45,0.3,1.4,0.3,STONE],[0.75,gr+0.6,-2.45,0.3,1.4,0.3,STONE]);
    for(const sg of [-1,1])L.push([sg*1.6,gr+0.3,0.8,0.3,0.6,0.3,'#3a3a3a'],[sg*1.6,gr+0.75,0.8,0.2,0.3,0.2,'#9a7aff']);
  }
  if(L.length){const m=new THREE.Mesh(boxes(L),matB);m.position.set(s.x,0,s.z);m.castShadow=true;m.receiveShadow=true;g.add(m)}
  // skrzynia
  const cx=s._ch?s._ch[0]:s.type==='wieza'?-3:s.type==='oboz'?Math.cos(0.5)*6+2.3:s.type==='kurhan'?0:0,cz=s._ch?s._ch[1]:s.type==='wieza'?3.6:s.type==='oboz'?Math.sin(0.5)*6:s.type==='kurhan'?-1.6:0;
  const cy=hsAt(s,s.x+cx,s.z+cz)+(s.type==='kurhan'?0:0);
  const CM=chestModel(s.type==='zamczysko'||s.type==='grota'||s.type==='kurhan'),chest=new THREE.Group(),base=new THREE.Mesh(boxes(CM[0]),decoMat);base.castShadow=true;
  const lid=new THREE.Group();lid.position.set(0,CM[2],-CM[3]/2);lid.add(new THREE.Mesh(boxes(CM[1]),decoMat));
  chest.add(base,lid);chest.position.set(s.x+cx,cy,s.z+cz);g.add(chest);if(W.opened[s.id])lid.rotation.x=-1.9;
  s.chest={x:s.x+cx,z:s.z+cz,y:cy,lid};s.cols=cols;s.g=g;scene.add(g);voxQueue(g,'S'+s.id);
}
function unbuildStruct(s){voxRemove('S'+s.id);scene.remove(s.g);s.g.traverse(o=>{if(o.geometry&&o.geometry!==ringGeo)o.geometry.dispose()});s.g=null;s.chest=null}
function structCollide(p){
  for(const s of structs.values()){if(!s||!s.cols||Math.abs(s.x-p.x)>48||Math.abs(s.z-p.z)>48)continue;
    for(const [cx,cz,hw,hd,top] of s.cols){if(p.y>=top-0.05)continue;const ex=hw+PR-Math.abs(p.x-cx),ez=hd+PR-Math.abs(p.z-cz);
      if(ex>0&&ez>0){if(top-p.y<=1.05&&player.ground){p.y=top;continue}if(ex<ez)p.x+=Math.sign(p.x-cx||1)*ex;else p.z+=Math.sign(p.z-cz||1)*ez}}}
}
function structGround(x,z,y){let best=null;for(const s of structs.values()){if(!s||!s.cols||Math.abs(s.x-x)>48||Math.abs(s.z-z)>48)continue;for(const [cx,cz,hw,hd,top] of s.cols)if(Math.abs(x-cx)<hw+0.05&&Math.abs(z-cz)<hd+0.05&&top<=y+0.3&&(best===null||top>best))best=top}return best}
let nearChest=null;
function strFrame(dt){
  nearChest=null;
  for(const e of enemies.values()){const d=EDEF[e.t];if(!(d.huge||d.giant)||e.st===2)continue;const rr=eSc(e)*0.45,dx=player.p.x-e.p.x,dz=player.p.z-e.p.z,dd=Math.hypot(dx,dz);if(dd<rr&&dd>1e-3&&Math.abs(player.p.y-e.p.y)<eSc(e)*1.5){player.p.x=e.p.x+dx/dd*rr;player.p.z=e.p.z+dz/dd*rr}}
  for(const s of structs.values()){if(!s||!s.chest)continue;const c=s.chest;
    if(W.opened[s.id]){c.lid.rotation.x+=(-1.9-c.lid.rotation.x)*Math.min(1,6*dt);if(!chestLeft(s.id))continue}
    if(Math.hypot(c.x-player.p.x,c.z-player.p.z)<2.2&&Math.abs(c.y-player.p.y)<2.5)nearChest=s}
  if(nearChest&&!nearNpc&&!dlg){const pr=$('prompt');pr.hidden=false;pr.innerHTML=guardsAlive(nearChest)?'Skrzynia zamknięta: najpierw pokonaj strażników':(W.opened[nearChest.id]?'<kbd>F</kbd> Przeszukaj skrzynię':'<kbd>F</kbd> Otwórz skrzynię')}
  // pasek bossa
  let bb=null,bd=55;for(const e of enemies.values()){if(!EDEF[e.t].boss||e.st===2)continue;const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d<bd){bd=d;bb=e}}
  const el=$('bossbar');if(bb){el.hidden=false;{const hp=bb.hp/bb.max,ph=hp<0.3?3:hp<0.6?2:1;$('bossname').textContent=EDEF[bb.t].n+' · poziom '+bb.lvl+(ph>1?' · faza '+ph:'');$('bossbar').classList.toggle('rage',ph>1)}$('bossfill').style.width=(bb.hp/bb.max*100)+'%'}else el.hidden=true;
}
function chestModel(big){const k=big?1.25:1,W=0.95*k,H=0.55*k,D=0.62*k,WD='#7a4b22',WD2='#8f5a2a',WD3='#6a3e1a',IR='#3a3a40',GD='#d9b23a',B=[],Lb=[];
  for(let i=0;i<4;i++)B.push([0,0.07+i*H/4,0,W,H/4-0.01,D,i%2?WD:WD3]);for(const x of [-W/2+0.05,W/2-0.05])for(const z of [-D/2+0.05,D/2-0.05])B.push([x,H/2,z,0.1,H+0.02,0.1,IR]);
  for(const x of [-W*0.3,W*0.3])B.push([x,H/2,0,0.08,H+0.03,D+0.03,IR]);B.push([0,0.03,0,W+0.04,0.06,D+0.04,IR]);for(const x of [-W*0.3,W*0.3])for(const y of [H*0.25,H*0.75])B.push([x,y,D/2+0.03,0.05,0.05,0.02,'#8a8f94']);
  B.push([0,H*0.72,D/2+0.035,0.16,0.2,0.05,GD],[0,H*0.68,D/2+0.065,0.05,0.07,0.02,'#141414']);
  Lb.push([0,0.05,D/2,W+0.02,0.1,D+0.02,WD],[0,0.15,D/2,W,0.1,D-0.08,WD2],[0,0.23,D/2,W-0.02,0.06,D-0.26,WD]);for(const x of [-W*0.3,W*0.3])Lb.push([x,0.12,D/2,0.09,0.26,D+0.05,IR]);for(const x of [-W/2+0.04,W/2-0.04])Lb.push([x,0.1,D/2,0.07,0.2,D+0.04,IR]);Lb.push([0,0.0,D+0.02,0.16,0.14,0.04,GD]);
  return[B,Lb,H,D]}
function openChest(s,remote){
  if(!remote&&guardsAlive(s))return toast('Najpierw pokonaj strażników','#ff8a7a');
  sfx('open');W.opened[s.id]=W.opened[s.id]||Date.now();if(!remote)sendFx({k:'wopen',id:s.id,at:W.opened[s.id],nm:S.name});else toast(remote+' otworzył(a) skrzynię – twój łup:','#ffd34d');const big=s.type==='zamczysko'||s.type==='grota',k=s.type==='kurhan'||big,lv=s.lvl+(k?2:0);
  const n=big?4:k?2:s.type==='ruiny'?1:1+(Math.random()<0.5?1:0);
  if(remote){INV.gold+=Math.round(lv*rnd(3,6)*(k?3:1));INV.pot+=1;for(let i=0;i<n;i++){const it=genItem(lv,k?20:6);if(INV.bag.length<bagN()){INV.bag.push(it);toast(it.name,RAR[it.rar].c)}}gainXp(30*lv*(k?3:1))}
  else{W.chestLoot=W.chestLoot||{};if(!W.chestLoot[s.id]){const items=[];for(let i=0;i<n;i++)items.push(genItem(lv,k?20:6));W.chestLoot[s.id]={gold:Math.round(lv*rnd(3,6)*(k?3:1)),pot:1,food:pick(Object.keys(FOODS)),items};gainXp(30*lv*(k?3:1))}chestUiOpen(s.id,s.name||'Skrzynia')}
  for(const q of W.quests)if(q.type==='clear'&&q.sid===s.id&&!q.done){q.done=true;q.have=1;toast('Zadanie wykonane: '+q.title+' — wróć do: '+q.gname,'#ffd34d')}
  saveInv();saveW();updHud();renderJournalIfOpen();
}


// ===== okno skrzyni: wybór, co zabrać =====
let CHEST_ID=null;
function chestLeft(id){const c=W.chestLoot&&W.chestLoot[id];return !!c&&(c.gold>0||c.pot>0||c.food||c.items.length>0)}
function chestUiOpen(id,title){CHEST_ID=id;const el=$('chestui');el.hidden=false;el.querySelector('h2').textContent=title;try{document.exitPointerLock()}catch(e){}chestUiRender()}
function chestUiClose(){CHEST_ID=null;$('chestui').hidden=true;saveW()}
function chestUiRender(){const c=W.chestLoot&&W.chestLoot[CHEST_ID],box=$('chestlist');if(!c){chestUiClose();return}let h='';
  if(c.gold>0)h+=`<div class="crow"><span class="cic gold">🪙</span><b style="color:#ffd34d">${c.gold} zł</b><button data-ct="gold">Weź</button></div>`;
  if(c.pot>0)h+=`<div class="crow">${icHTML({base:'potion',rar:0})}<b style="color:#7dff8a">Mikstura leczenia ×${c.pot}</b><button data-ct="pot">Weź</button></div>`;
  if(c.food)h+=`<div class="crow">${icHTML({base:'food',var:c.food,rar:0})}<b style="color:#d9a27c">${foodName(c.food)}</b><small>dla: ${foodFor(c.food)}</small><button data-ct="food">Weź</button></div>`;
  c.items.forEach((it,i)=>{const cur=INV.eq[it.slot];h+=`<div class="crow r${it.rar}" data-ctip="${i}">${icHTML(it)}<b style="color:${RAR[it.rar].c}">${esc(it.name)}</b><small>${RAR[it.rar].n} · poz. ${it.lvl}${it.slot==='bron'&&TWOH(it)?' · dwuręczna':''}${cur?'':' · wolny slot'}</small><button data-ct="i${i}">Weź</button></div>`});
  box.innerHTML=h||'<p class="sub2">Skrzynia jest pusta.</p>';$('chestall').disabled=!h}
function chestTake(k){const c=W.chestLoot&&W.chestLoot[CHEST_ID];if(!c)return false;
  if(k==='gold'){INV.gold+=c.gold;toast('+'+c.gold+' złota','#ffd34d');sfx('coin');c.gold=0}
  else if(k==='pot'){INV.pot+=c.pot;toast('Mikstura leczenia','#7dff8a');c.pot=0}
  else if(k==='food'){INV.food[c.food]=(INV.food[c.food]||0)+1;toast(foodName(c.food),'#d9a27c');c.food=0}
  else if(k[0]==='i'){const i=+k.slice(1),it=c.items[i];if(!it)return false;if(INV.bag.length>=bagN()){toast('Plecak pełny','#ff8a7a');return false}INV.bag.push(it);c.items.splice(i,1);toast(it.name,RAR[it.rar].c)}
  saveInv();saveW();updHud();return true}
$('chestlist').onclick=e=>{const b=e.target.closest('[data-ct]');if(!b)return;if(chestTake(b.dataset.ct))chestUiRender()};
$('chestall').onclick=()=>{const c=W.chestLoot&&W.chestLoot[CHEST_ID];if(!c)return;for(const k of ['gold','pot','food'])if(c[k])chestTake(k);while(c.items.length&&INV.bag.length<bagN())chestTake('i0');if(c.items.length)toast('Plecak pełny – część zostaje w skrzyni','#ff8a7a');chestUiRender();if(!chestLeft(CHEST_ID))chestUiClose()};
$('chestclose').onclick=()=>chestUiClose();
// =================== ETAP 6: łódź, lotnia, zwierzaki, wierzchowce ===================
const VH={mode:0,bry:0,spd:0,push:0,boat:null,gl:null};
// ===== wierzchowce: koń (G) i gryf (V) =====
let MNT=LS.get('mounts',{});
function toggleOwnMount(kind){
  if(VH.mode===5||VH.mode===6){dismountOwn();return}
  if(VH.mode!==0||P2.dead)return;
  if(!MNT[kind])return toast(kind==='gryf'?'Nie masz gryfa. Kupisz go u kupca w osadzie (od 12 poziomu).':'Nie masz konia. Kupisz go u kupca w osadzie.','#ff8a7a');
  if(player.swim)return toast('Nie w wodzie','#ff8a7a');
  const m=kind==='kon'?horseCoat(makeHorseE('kon',false),MNT.koat||0):makeEnemy('gryf',false);m.position.copy(player.p);m.rotation.y=player.ry;scene.add(m);
  VH.mnt={m,kind};VH.mode=kind==='kon'?5:6;sfx(kind==='kon'?'neigh':'screech');
  toast(kind==='kon'?'Jazda konna · Shift galop · G zsiada':'Lot na gryfie · Spacja w górę · Ctrl w dół · V zsiada (przy ziemi)','#cfe8ff')}
function dismountOwn(force){if(!VH.mnt){if(VH.mode===5||VH.mode===6)VH.mode=0;return}
  if(VH.mode===6&&!force){const h=colAt(player.p.x,player.p.z);if(h!==null&&player.p.y-h>3)return toast('Najpierw zniż lot przy ziemi (Ctrl)','#ff8a7a')}
  scene.remove(VH.mnt.m);VH.mnt=null;VH.mode=0;player.p.y+=0.2;meRef.rotation.x=0;meRef.rotation.z=0}
function dlgCoat(buy){const o=HCOATS.slice(0,HCN).map(([n],i)=>[n+(buy?'':(i===(MNT.koat||0)?' (obecna)':'')),()=>{if(buy){MNT.koat=i;buyMount('kon',250,1)}else{if((INV.gold||0)<60)return dlgRoot('Przefarbowanie… znaczy zamiana konia na innej maści kosztuje 60 zł.');INV.gold-=60;MNT.koat=i;LS.set('mounts',MNT);saveInv();updHud();if(VH.mnt&&VH.mode===5){dismountOwn(1)}toast('Twój koń ma teraz maść: '+n,'#7dd87d');dlgRoot('Proszę bardzo, '+n.toLowerCase()+' rumak czeka.')}}]);o.push(['Wróć',()=>dlgMounts()]);dlgShow(buy?'Jakiej maści konia szukasz? Mam w stajni wszystkie.':'Na jaką maść chcesz zamienić konia? Koszt: 60 zł.',o)}
function dlgMounts(){const o=[];if(!MNT.kon)o.push(['Koń wierzchowy — 250 zł (wybierz maść)',()=>dlgCoat(true)]);else{o.push(['(Masz już konia — przywołasz go klawiszem G)',()=>dlgMounts()]);o.push(['Zamień konia na inną maść — 60 zł',()=>dlgCoat(false)])}
  if(!MNT.gryf)o.push(['Gryf do latania — 2500 zł (od 12 poziomu)',()=>buyMount('gryf',2500,12)]);else o.push(['(Masz już gryfa — przywołasz go klawiszem V)',()=>dlgMounts()]);
  o.push(['Wróćmy do rozmowy.',()=>dlgRoot()]);dlgShow('Mam w stajni konia pod siodło, a od czasu do czasu trafia mi się oswojony gryf. Na koniu przemierzysz krainę dwa razy szybciej, a gryf zabierze cię w przestworza.',o)}
function buyMount(k,price,lvl){if(HERO.lvl<lvl)return dlgRoot('Gryf nie posłucha nowicjusza. Wróć, gdy osiągniesz '+lvl+' poziom.');if((INV.gold||0)<price)return dlgRoot('Nie stać cię. Potrzebujesz '+price+' złota.');
  INV.gold-=price;MNT[k]=1;LS.set('mounts',MNT);saveInv();updHud();sfx('coin');toast(k==='kon'?'Kupiono konia! Przywołasz go klawiszem G.':'Kupiono gryfa! Przywołasz go klawiszem V.','#7dd87d');dlgRoot(k==='kon'?'Dobry wybór. Gwizdnij (G), a przybiegnie.':'Gryf jest twój. Wezwij go klawiszem V.')}
function mountFrame(dt){if(!(VH.mode===5||VH.mode===6))return;if(!VH.mnt){VH.mode=0;return}
  if(P2.dead){dismountOwn(1);return}if(VH.mode===5&&player.swim){dismountOwn(1);toast('Koń nie wejdzie do głębokiej wody','#ff8a7a');return}
  const M=VH.mnt.m,ox=M.position.x,oz=M.position.z;M.position.copy(player.p);let dr=player.ry-M.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));M.rotation.y+=dr*Math.min(1,dt*10);
  const spd=Math.hypot(player.p.x-ox,player.p.z-oz)/Math.max(dt,1e-3),air=VH.mode===6&&!player.ground;animEnemy(M,air?0:Math.min(16,spd),dt,0,0,false);
  let bob=0;if(VH.mode===6){VH.bank=(VH.bank||0)+((-dr*2.4)-(VH.bank||0))*Math.min(1,dt*3);M.rotation.z=air?Math.max(-0.5,Math.min(0.5,VH.bank)):0;M.rotation.x=air?Math.max(-0.3,Math.min(0.3,-player.v.y*0.025+Math.min(0.2,spd*0.006))):0;
    if(air){for(const l of M.userData.plegs)l.rotation.x=-0.9;bob=Math.sin(performance.now()*0.004)*0.1;M.position.y+=bob;VH.flapT=(VH.flapT||0)-dt;if(VH.flapT<=0){VH.flapT=0.55+Math.random()*0.4;sfx('flap',0.35)}}}
  else{M.rotation.z=0;M.rotation.x=0}
  meRef.position.y+=(VH.mode===5?1.0:0.95)+bob;meRef.rotation.z=M.rotation.z;meRef.rotation.x=M.rotation.x;const u=meRef.userData;u.ll.rotation.x=-1.35;u.rl.rotation.x=-1.35}
function remoteMount(r,c,dt){if(c.veh===5||c.veh===6){const kind=c.veh===5?'kon':'gryf';if(!r.mnt||r.mntK!==kind||(kind==='kon'&&(r.mnt.userData.coat||0)!==(c.hc||0))){if(r.mnt)scene.remove(r.mnt);r.mnt=kind==='kon'?horseCoat(makeHorseE('kon',false),c.hc||0):makeEnemy('gryf',false);r.mntK=kind;scene.add(r.mnt)}
    const ox=r.mnt.position.x,oz=r.mnt.position.z;r.mnt.position.set(r.g.position.x,r.g.position.y,r.g.position.z);r.mnt.rotation.y=r.g.rotation.y;const s=Math.hypot(r.mnt.position.x-ox,r.mnt.position.z-oz)/Math.max(dt,1e-3);animEnemy(r.mnt,Math.min(16,s),dt,0,0,false);
    r.g.position.y+=kind==='kon'?1.0:0.95;const u=r.g.userData;u.ll.rotation.x=-1.35;u.rl.rotation.x=-1.35}else if(r.mnt){scene.remove(r.mnt);r.mnt=null}}
// ===== kondycja (stamina) na sprint =====
function staTick(dt,wantS,moving){if(!isFinite(P2.sta))P2.sta=100;if(!isFinite(dt))dt=0.016;let sprint=wantS&&moving&&!P2.staLock&&P2.sta>0;
  if(sprint){P2.sta=Math.max(0,P2.sta-dt*20*(1-0.004*Math.min(100,skL('wytrz')))*(1-0.12*pk('kondycja')));P2.staT=0.9;if(P2.sta<=0)P2.staLock=1}
  else{P2.staT=(P2.staT||0)-dt;if(P2.staT<=0)P2.sta=Math.min(100,P2.sta+dt*(player.ground?28:12)*(1+0.15*pk('kondycja')))}
  if(P2.staLock&&P2.sta>=30)P2.staLock=0;const e=document.getElementById('stb');if(e){e.style.width=P2.sta+'%';const w=e.parentNode;w.classList.toggle('lock',!!P2.staLock);w.classList.toggle('full',P2.sta>=99.9)}return sprint}
// ===== światło od świecących stworzeń (sloty 8-11) =====
const GLOWL={zywiolak:[1,.55,.2,11,2.6],lich:[.75,.45,1,7,1.6],upior:[.5,.85,1,6,1.3],matka:[.5,1,.4,5,1.1],golem:[.5,.9,1,4.5,0.9],kolos:[1,.6,.2,5,1.0],faraon:[.5,.9,1,4,.9],mumia:[1,.85,.3,4,.8],krol_s:[1,.25,.2,4,1],smok:[1,.5,.2,6,0.9]};
function glowLights(){const cand=[];for(const e of enemies.values()){if(e.st===2)continue;const G=GLOWL[e.t];if(!G)continue;const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d<70)cand.push([d,e,G])}cand.sort((a,b)=>a[0]-b[0]);const now=performance.now();
  for(let k=0;k<4;k++){const U=SEAS_U.uLamp.value[8+k],c=cand[k];if(c){const e=c[1],G=c[2],fl=e.t==='zywiolak'?1+Math.sin(now*0.017+e.id)*0.12+Math.sin(now*0.041+e.id*2)*0.08:1+Math.sin(now*0.003+e.id)*0.05;U.set(e.p.x,e.p.y+1.4*(e.elite?1.35:1),e.p.z,G[3]*(e.elite?1.25:1));SEAS_U.uLampI.value[8+k]=G[4]*fl;SEAS_U.uLampC.value[8+k].set(G[0],G[1],G[2])}else{U.w=0;SEAS_U.uLampI.value[8+k]=0}}}
// ===== odgłosy stworzeń: [w spoczynku, przy zamachu, przy uderzeniu] =====
const CRS={krowa:['moo'],owca:['baa'],swinia:['oink'],kura:['cluck'],kaczka:['quack'],pies:['bark'],kot:['meow'],kon:['neigh'],koza:['baa'],jelen:[null],renifer:[null],wielblad:['grunt'],
 wilk:['howl','growl','bite'],wilkolak:['howl','growl','claw'],dzik:['snort','snort','thud'],niedzwiedz:['bearroar','bearroar','claw'],pajak:['hiss','hiss','bite'],matka:['hiss','screech','bite'],skorpion:['hiss','hiss','claw'],krab:[null,'claw','claw'],slime:['squelch','squelch','squelch'],ropucha:['frog','frog','squelch'],
 yeti:['roar','roar','slam'],golem:[null,'grunt','slam'],kolos:[null,'roar','slam'],bazyliszek:['hiss','hiss','bite'],gryf:['screech','screech','claw'],zywiolak:['crackle','crackle','slam'],smok:['roar','roar','bite'],
 troll:['grunt','roar','thud'],krol_troll:['grunt','roar','thud'],ork:['grunt','grunt','whoosh'],goblin:[null,'screech','whoosh'],bandyta:[null,'grunt','whoosh'],szaman:[null,'moan','whoosh'],szkielet:['rattle','rattle','whoosh'],lucznik_s:['rattle','rattle',null],krol_s:['rattle','moan','whoosh'],mumia:['moan','moan','thud'],faraon:['moan','moan','whoosh'],upior:['moan','moan','whoosh'],lich:['moan','moan',null],drzewiec:['grunt','grunt','thud'],prastary:['grunt','roar','thud']};
function sfxAt(n,x,z,vol){if(!n||!AUD.on)return;const d=Math.hypot(x-player.p.x,z-player.p.z);if(d>42)return;sfx(n,(vol??1)*Math.pow(Math.max(0,1-d/42),1.3))}
function enemySounds(m,u,st,dt){const S2=CRS[u.et];if(!m.parent)return;const x=m.position.x,z=m.position.z;
  if(st===2){if(!u.sdead){u.sdead=1;sfxAt(u.pas?'thud':'kill',x,z,0.7)}return}u.sdead=0;
  if(!S2)return;if(u.lastSt!==1&&st===1&&Math.random()<0.45)sfxAt(S2[1],x,z,0.8);
  u.sndT=(u.sndT??(3+Math.random()*10))-dt;if(u.sndT<=0){u.sndT=7+Math.random()*16;if(S2[0]&&Math.random()<0.6)sfxAt(S2[0],x,z,u.pas?0.5:0.65)}}
function enemyStrikeSound(m,u){const S2=CRS[u.et];if(m.parent)sfxAt((S2&&S2[2])||'whoosh',m.position.x,m.position.z,0.8)}
// ===== style ataku stworzeń =====
const ATKS={wolf:'pounce',dog:'pounce',fox:'pounce',cat:'pounce',griffin:'rear',bear:'rear',boar:'charge',deer:'charge',reindeer:'charge',goat:'charge',cow:'charge',camel:'charge',yeti:'slam',golem:'slam',colossus:'slam',dragon:'rear',scorpion:'sting',spider:'pounceS',spiderq:'pounceS',crab:'pounceS',toad:'pounce',basilisk:'charge',turtle:'charge',lizard:'pounce'};
function atkStyle(u,w,sk){const sty=ATKS[u.pk];if(!sty||(w<=0.001&&sk<=0.001))return 0;const S=u.S,R=u.root;
  switch(sty){case 'pounce':R.position.y+=(-w*0.1+sk*0.42)*S;R.position.z+=(-w*0.12+sk*0.55)*S;R.rotation.x+=w*0.14-sk*0.28;break;
   case 'pounceS':R.position.y+=(w*0.1+sk*0.2)*S;R.position.z+=(-w*0.1+sk*0.42)*S;R.rotation.x+=-w*0.38+sk*0.22;break;
   case 'charge':R.position.z+=(-w*0.16+sk*0.75)*S;R.rotation.x+=w*0.1-sk*0.05;return 0.5*w-0.7*sk;
   case 'rear':R.rotation.x+=-w*0.6+sk*0.38;R.position.y+=w*0.16*S;R.position.z+=(sk*0.42-w*0.08)*S;break;
   case 'slam':R.rotation.x+=-w*0.3+sk*0.48;R.position.y+=(w*0.08-sk*0.05)*S;R.position.z+=sk*0.28*S;R.rotation.z+=Math.sin(u.idt*45)*0.035*sk;break;
   case 'sting':R.rotation.x+=-w*0.28+sk*0.32;R.position.z+=(-w*0.1+sk*0.38)*S;break}return 0}

const tameable=t=>!!FOODOF[t]&&!EDEF[t].boss;
const MOUNT=Object.assign(MOUNT_X,{gryf:0.95,wilkolak:0.95,wilk:0.65,dzik:0.6,yeti:1.8,golem:2.0,skorpion:0.6,pajak:0.75,kon:1.0,jelen:0.9,renifer:0.9,wielblad:1.4,niedzwiedz:1.15});
const MH={};// wysokość siodła dla zwierząt bez wpisu w MOUNT (z obrysu modelu)
function mountH(t,m){if(!t||!EDEF[t])return 0;if(MOUNT[t]!=null)return MOUNT[t];const d=EDEF[t];if(HUM[t]||d.sea||d.swim||NOMOUNT.has(t))return 0;if(MH[t]!=null)return MH[t];
  if(!m&&PET&&PET.t===t)m=PET.m;let tmp=null;if(!m){try{m=tmp=makeEnemy(t,false)}catch(_){return 0}}let h=0.8,raw=1;try{const B=hbLocal(m);if(B){raw=(B[4]-B[1])*(m.scale?m.scale.y:1);h=raw*0.74}}catch(_){}if(tmp)try{tmp.userData.mat&&tmp.userData.mat.dispose()}catch(_){}return MH[t]=raw<1.05?0:Math.max(0.5,Math.min(2.2,h))}
const NOMOUNT=new Set(['szczur','kura','kurczak','zaba','motyl','wazka','swietlik','krolik','wiewiorka','jez','kaczka','ryba','mysz','nietoperz','cma','cma_ksiezycowa','swietlik_bledny']);
const MSPD={slon:1.15,los:1.4,strus:1.55,jednorozec:1.6,pegaz:1.7,jelen_ks:1.4,zolw_kr:0.8,slimak:0.6,gryf:1.6,kon:1.5,jelen:1.35,renifer:1.35,wielblad:1.25,wilk:1.2,niedzwiedz:1.1};
// łódź na 2 graczy + po jednym zwierzęciu: sternik w 0, pasażer z przodu, zwierzęta na dziobie i rufie
const BSEAT={drv:0,pas:1.75,petD:-1.2,petP:2.85};
function makeBoat(){
  // prosta łódź wiosłowa: klepkowy kadłub, dwie burty z listwą, trzy ławki, dulki i dobrze ustawione wiosła
  const g=new THREE.Group(),L=[],WP=['#8a6240','#7a5532','#94693f'],DK='#4a2f1d',IN='#9a7048',cz=0.7,half=2.85,n=26,dz=2*half/n;
  const W=t=>Math.max(0.22,1.55*Math.pow(Math.max(0,1-Math.pow(Math.abs(t),2.2)),0.5));
  for(let i=0;i<n;i++){const z=cz-half+(i+0.5)*dz,t=(z-cz)/half,w=W(t),rise=0.22*t*t*(t>0?1.3:0.8),bot=-0.3+0.16*t*t,top=0.5+rise,dd=dz+0.004;
    L.push([0,bot,z,Math.max(0.16,w*0.55),0.1,dd,DK]);
    for(let k=0;k<3;k++){const hS=(top-bot)/3,y0=bot+k*hS,xo=w/2*(0.62+0.38*k/2),th=0.09;for(const sg of [-1,1])L.push([sg*(xo-th/2),y0+hS/2,z,th,hS+0.03,dd,WP[(k+(i>>2))%3]])}
    for(const sg of [-1,1])L.push([sg*(w/2-0.02),top+0.04,z,0.12,0.07,dd,'#6b4528']);
    if(Math.abs(t)<0.86)L.push([0,bot+0.08,z,w*0.62-0.06,0.03,dd,i%2?IN:'#8e6640']);else L.push([0,(bot+top)/2,z,w*0.9,top-bot,dd,WP[0]])}
  L.push([0,-0.36,cz,0.1,0.08,2*half-0.1,DK]);
  {const zf=cz+half,zb=cz-half;L.push([0,0.62,zf-0.05,0.12,0.55,0.16,DK],[0,0.95,zf+0.02,0.1,0.1,0.12,'#6b4528']);L.push([0,0.18,zb+0.06,1.0,0.62,0.08,WP[1]],[0,0.5,zb+0.04,1.04,0.06,0.1,DK])}
  for(const [z,w] of [[0,1.38],[1.75,1.2],[-1.2,1.1]])L.push([0,0.3,z,w,0.07,0.34,'#a07650'],[0,0.12,z,0.12,0.3,0.12,DK]);
  L.push([0.35,0.12,2.6,0.4,0.3,0.4,'#8a5a30'],[0.35,0.28,2.6,0.44,0.04,0.44,'#3a3a40'],[-0.3,0.08,-1.9,0.42,0.12,0.42,'#d8c8a0'],[-0.3,0.15,-1.9,0.3,0.04,0.3,'#c8b890']);
  for(const sg of [-1,1])L.push([sg*0.68,0.6,0.1,0.06,0.14,0.06,'#3a3a40'],[sg*0.68,0.68,0.1,0.06,0.04,0.16,'#3a3a40']);
  g.add(new THREE.Mesh(boxes(L),decoMat));
  const oar=sg=>{const o=new THREE.Group();o.position.set(sg*0.68,0.66,0.1);const inner=new THREE.Group();inner.rotation.z=sg*-0.42;
    inner.add(new THREE.Mesh(boxes([[sg*0.62,0,0,2.3,0.055,0.055,'#9a7448'],[sg*-0.44,0,0,0.22,0.08,0.08,'#5a3a22'],[sg*0.05,0,0,0.12,0.08,0.08,'#3a3a40'],[sg*1.92,0,0,0.6,0.22,0.035,'#9a7448'],[sg*1.62,0,0,0.08,0.12,0.045,'#7a5532'],[sg*2.2,0,0,0.04,0.22,0.04,'#6b4528']]),decoMat));
    o.add(inner);g.add(o);return o};
  if(MNT.sail){const S2=[];S2.push([0,2.6,0.9,0.14,4.4,0.14,'#5a3a22'],[0,4.6,0.9,0.1,0.1,2.4,'#4a2f1d'],[0,1.6,0.9,0.1,0.1,2.6,'#4a2f1d']);for(let k=0;k<5;k++)S2.push([0.05,1.8+k*0.56,0.9,0.04,0.58,2.3-k*0.12,k%2?'#efe6d0':'#e0d4b8']);S2.push([0,5,0.9,0.04,0.4,0.6,'#a8302a']);const sm=new THREE.Mesh(boxes(S2),decoMat);sm.castShadow=true;g.add(sm)}
  g.userData={oL:oar(-1),oR:oar(1),ph:0};g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g;
}
function makeGlider(){const L=[],n=10;
  for(let k=0;k<n;k++){const z=0.95-k*0.21,hw=0.22+k/(n-1)*2.05,y=-k*0.014,dz=0.21;
    L.push([0,y,z,hw*0.5,0.045,dz,k%3===0?'#c9a24a':'#efe8d6'],[hw*0.625,y-0.002,z,hw*0.75,0.045,dz,k%2?'#a8352a':'#b8452f'],[-hw*0.625,y-0.002,z,hw*0.75,0.045,dz,k%2?'#a8352a':'#b8452f'],
      [hw+0.03,y+0.01,z,0.07,0.07,dz,'#4a2f1d'],[-hw-0.03,y+0.01,z,0.07,0.07,dz,'#4a2f1d'])}
  L.push([0,0.04,0.0,0.07,0.07,2.2,'#4a2f1d'],[0,0.06,-1.0,0.05,0.22,0.3,'#3a2414'],[0,-0.12,0.05,0.06,0.2,0.06,'#4a2f1d']);
  L.push([0.36,-0.5,0.1,0.05,0.95,0.05,'#5a3b22'],[-0.36,-0.5,0.1,0.05,0.95,0.05,'#5a3b22'],[0,-0.98,0.1,0.82,0.06,0.06,'#5a3b22'],[0.36,-0.98,0.1,0.08,0.12,0.08,'#3a2414'],[-0.36,-0.98,0.1,0.08,0.12,0.08,'#3a2414']);
  L.push([0,-0.03,0.5,0.34,0.05,0.34,'#c9a24a'],[0,-0.025,0.5,0.18,0.05,0.18,'#3f5a8a']);
  const m=new THREE.Mesh(boxes(L),decoMat);m.castShadow=true;m.position.y=2.45;return m}
function animBoat(b,spd,dt){const u=b.userData;u.ph+=dt*(1+Math.abs(spd)*0.6);const t=u.ph,s=Math.min(1,Math.abs(spd)/6);
  let dr=b.rotation.y-(u.lry??b.rotation.y);dr=Math.atan2(Math.sin(dr),Math.cos(dr));u.lry=b.rotation.y;u.turn=(u.turn||0)+((dr/Math.max(dt,1e-3))-(u.turn||0))*Math.min(1,dt*4);
  b.rotation.z=Math.sin(t*0.9)*0.03+Math.sin(t*2.3)*0.01-u.turn*0.09*s;b.rotation.x=Math.sin(t*0.7)*0.02-s*0.05+Math.sin(t*2.2)*0.012*s;
  const go=Math.abs(spd)>0.5,ph=t*2.2,sw=go?Math.sin(ph)*0.55:0,dip=Math.cos(ph),lift=go?(dip>0?-0.04:0.22):0.16;u.oL.rotation.y=-sw;u.oR.rotation.y=sw;u.oL.rotation.z=-lift;u.oR.rotation.z=lift;u.row=go?Math.sin(ph):0;
  b.position.y+=Math.sin(t*1.7)*0.05+Math.sin(t*0.6)*0.03;
  if(typeof PFX!=='undefined'&&b.parent){const a=b.rotation.y;if(s>0.25&&Math.random()<dt*10*s)PFX.emit(b.position.x-Math.sin(a)*2.4+(Math.random()-0.5)*1.2,WATER-0.05,b.position.z-Math.cos(a)*2.4,1,['#ffffff','#d8f0ff'],{sp:1,up:0.8,g:5,life:0.7,size:0.08});
    if(go&&dip>0.96&&!u.spl){u.spl=1;for(const sd of [1,-1])PFX.emit(b.position.x+Math.cos(a)*1.9*sd,WATER,b.position.z-Math.sin(a)*1.9*sd,4,['#ffffff','#cfe8ff'],{sp:1.5,up:1.6,g:7,life:0.5,size:0.07});sfx('splash',0.12)}else if(dip<0.85)u.spl=0}}
// --- łódź ---
function toggleBoat(){
  if(VH.mode===1)return exitBoat();
  if(VH.mode===4)return leavePassenger();
  if(VH.mode!==0||P2.dead)return;
  for(const [id,r] of remotes){if(!r.boat)continue;const sp=seatPos(r.boat,BSEAT.pas);if(Math.hypot(sp[0]-player.p.x,sp[2]-player.p.z)<4.5){if([...remotes.values()].some(o=>o!==r&&o.buf.length&&o.buf[o.buf.length-1].veh===4&&o.buf[o.buf.length-1].bh===id))return toast('Miejsce pasażera jest zajęte','#ff8a7a');
    VH.mode=4;VH.host=id;toast('Płyniesz jako pasażer · B wysiada','#cfe8ff');return}}
  let spot=null;const p=player.p,ic=season===2&&WATER_U.uIce.value>0.5,okW=h=>h!==null&&h<(ic?WATER-4.2:WATER-0.6);
  const okR=(x,z)=>{const h=colAt(x,z),w=wlAt(x,z);return w>WATER&&h!==null&&h<w-0.6};
  if(okW(colAt(p.x,p.z))||okR(p.x,p.z))spot=[p.x,p.z];
  for(let r=1;r<=4&&!spot;r++)for(let a=0;a<6.28&&!spot;a+=0.5){const x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r,h=colAt(x,z);if(okW(h)||okR(x,z))spot=[x,z]}
  if(!spot)return toast(ic?'Woda jest tu zamarznięta – łódź zwodujesz tylko przy głębokiej wodzie':'Łódź zwodujesz tylko przy wodzie','#ff8a7a');
  VH.mode=1;VH.bry=player.ry;VH.spd=0;VH.push=0;VH.wl=wlAt(spot[0],spot[1]);p.set(spot[0],VH.wl-0.05,spot[1]);player.v.set(0,0,0);VH.boat=makeBoat();scene.add(VH.boat);toast('Łódź: W/S płyń, A/D skręcaj, B wysiądź','#cfe8ff');
}
function seatPos(b,z){const ry=b.rotation.y;return[b.position.x+Math.sin(ry)*z,b.position.y+0.1,b.position.z+Math.cos(ry)*z,ry]}
function passengerTick(){const r=remotes.get(VH.host);if(!r||!r.boat){leavePassenger();return}const s=seatPos(r.boat,BSEAT.pas);player.p.set(s[0],s[1],s[2]);player.v.set(0,0,0);player.ry=s[3];player.ground=true;player.swim=false}
function leavePassenger(){VH.mode=0;VH.host=null;const p=player.p;for(let rr=2;rr<=7;rr++)for(let a=0;a<6.28;a+=0.4){const x=p.x+Math.cos(a)*rr,z=p.z+Math.sin(a)*rr,h=colAt(x,z);if(h!==null&&!wetAt(x,z,h)){p.set(x,h+0.05,z);return}}p.y=(VH.wl||WATER)-1.3}
function exitBoat(land){
  if(VH.boat){scene.remove(VH.boat);VH.boat=null}VH.mode=0;
  if(land)player.p.set(land[0],land[1]+0.05,land[2]);else{player.p.y=(VH.wl||WATER)-1.3}
  player.v.set(0,0,0);
}
function boatPhysics(dt){
  const p=player.p,mul=hasP('plywak')?1.25:1;
  if(keys.has('KeyA'))VH.bry+=1.7*dt;if(keys.has('KeyD'))VH.bry-=1.7*dt;
  if(keys.has('KeyW'))VH.spd=Math.min((MNT.sail?17:11)*mul,VH.spd+7*dt);else if(keys.has('KeyS'))VH.spd=Math.max(-4,VH.spd-7*dt);else VH.spd*=1-0.7*dt;
  const nx=p.x+Math.sin(VH.bry)*VH.spd*dt,nz=p.z+Math.cos(VH.bry)*VH.spd*dt,ax=nx+Math.sin(VH.bry)*(VH.spd>=0?3.9:-2.1),az=nz+Math.cos(VH.bry)*(VH.spd>=0?3.9:-2.1),ah=colAt(ax,az);
  const curL=VH.wl||WATER,aL=ah===null?curL:wlAt(ax,az);
  const iced=season===2&&WATER_U.uIce.value>0.5&&curL===WATER;
  if(ah===null){VH.spd=0}
  else if(iced&&ah<WATER-0.35&&ah>WATER-4.2){VH.spd=Math.min(VH.spd,0);if(keys.has('KeyW')&&!VH.iceT){VH.iceT=1;toast('Lód blokuje łódź – płyń głębszą wodą','#cfe8ff');setTimeout(()=>VH.iceT=0,4000)}}
  else if(ah<aL-0.35&&aL>curL+0.5){VH.spd=Math.min(VH.spd,0);if(keys.has('KeyW')&&!VH.iceT){VH.iceT=1;toast('Wodospad – łodzią nie popłyniesz pod prąd','#cfe8ff');setTimeout(()=>VH.iceT=0,4000)}}
  else if(ah>=aL-0.35){if(keys.has('KeyW')){VH.push+=dt;if(VH.push>0.35){const lx=nx+Math.sin(VH.bry)*4.3,lz=nz+Math.cos(VH.bry)*4.3,lh=colAt(lx,lz);if(lh!==null&&lh-curL<2.2){exitBoat([lx,lh,lz]);return}}}VH.spd=Math.min(VH.spd,0)}
  else{VH.push=0;p.x=nx;p.z=nz}
  {const h0=colAt(p.x,p.z),w0=wlAt(p.x,p.z);if(h0!==null&&h0<w0){if(w0<curL-0.5&&VH.wl!==w0)sfx('splash',0.8);if(w0<=curL||w0-curL<0.6)VH.wl=w0}}
  {const T=(VH.wl||WATER)-0.05;p.y=p.y>T+0.01?Math.max(T,p.y-15*dt):T}
  player.v.set(0,0,0);player.ry=VH.bry;player.ground=true;player.swim=false;
}
// --- lotnia ---
function startGlide(){if(VH.mode!==0||player.ground||player.swim||P2.dead)return false;const h=colAt(player.p.x,player.p.z);if(h!==null&&player.p.y-h<2.2)return false;VH.mode=2;VH.gl=makeGlider();meRef.add(VH.gl);return true}
function stopGlide(){if(VH.gl){meRef.remove(VH.gl);VH.gl=null}if(VH.mode===2)VH.mode=0;meRef.rotation.z=0}
function gliderVel(v,dt){
  const fy=facing();let dr=fy-player.ry;dr=Math.atan2(Math.sin(dr),Math.cos(dr));player.ry+=dr*Math.min(1,3*dt);
  const w=keys.has('KeyW'),s=keys.has('KeyS'),spd=w?19:s?9:14,vy=(w?-2.6:s?-0.45:-0.95)*(1-0.1*pk('lotnik'));
  v.x+=(Math.sin(player.ry)*spd-v.x)*Math.min(1,2*dt);v.z+=(Math.cos(player.ry)*spd-v.z)*Math.min(1,2*dt);v.y+=(vy-v.y)*Math.min(1,3*dt);
}
// --- zwierzaki ---
if(!INV.lampGiven){INV.lampGiven=1;const has=INV.eq.latarnia||INV.bag.some(b=>b&&b.base==='latarnia');if(!has)INV.eq.latarnia={id:'i'+Date.now()+'L',slot:'latarnia',base:'latarnia',rar:0,lvl:1,name:'Latarnia Wędrowca'}}
INV.hot=INV.hot||[{k:'pot'},null,null,null,null,null,null,null];
$('hotbar').onclick=e=>{const b=e.target.closest('[data-hot]');if(b)useHot(+b.dataset.hot)};
$('hotbar').oncontextmenu=e=>{e.preventDefault();const b=e.target.closest('[data-hot]');if(b&&INV.hot[+b.dataset.hot]&&INV.hot[+b.dataset.hot].k!=='pot'){INV.hot[+b.dataset.hot]=null;saveInv();renderHot()}};
$('hotbar').ondragover=e=>e.preventDefault();
$('hotbar').ondrop=e=>{e.preventDefault();const b=e.target.closest('[data-hot]'),id=e.dataTransfer.getData('text/iid');if(!b||!id)return;for(let k=0;k<8;k++)if(INV.hot[k]&&INV.hot[k].id===id)INV.hot[k]=null;INV.hot[+b.dataset.hot]={k:'item',id};saveInv();renderHot()};
document.addEventListener('dragstart',e=>{const s=e.target.closest&&e.target.closest('[data-iid]');if(s)e.dataTransfer.setData('text/iid',s.dataset.iid)});
setTimeout(renderHot,500);
INV.pets=INV.pets||[];INV.food=INV.food||{koniczyna:2,marchew:2,owies:1,mieso:1};if(INV.treat){INV.food.mieso=(INV.food.mieso||0)+INV.treat}delete INV.treat;
let PET=null;
function petDef(){return INV.pets.find(p=>p.id===INV.petA)||null}
function spawnPet(){despawnPet();const d=petDef();if(!d)return;const m=makeEnemy(d.t,false);m.add(nameTag(d.name||EDEF[d.t].n,'#7dd87d'));m.children[m.children.length-1].position.y=(EDEF[d.t].legs.length?1.9:1.5)*(EDEF[d.t].sc||1);scene.add(m);
  const a=player.ry+Math.PI;PET={t:d.t,m,p:new THREE.Vector3(player.p.x+Math.sin(a)*2,player.p.y,player.p.z+Math.cos(a)*2),ry:player.ry,cd:0,st:0,stT:0,speed:0}}
function despawnPet(){if(PET){scene.remove(PET.m);PET.m.userData.mat.dispose();PET=null}if(VH.mode===3)VH.mode=0}

// ===== kompani (zwierzak + najemnicy) jako cele wrogów =====
function petMaxHp(){if(!PET)return 1;const pd=petDef();return Math.round(EDEF[PET.t].hp*1.6*(1+0.38*(((pd&&pd.lvl)||1)-1))*(pd&&pd.el?1.4:1))}
function folEq(d){d.eq=d.eq||{};let def=0,hp=0;for(const k in d.eq){const it=d.eq[k];if(!it)continue;const u=1+0.1*(it.up||0);if(it.def)def+=it.def*u;if(it.hp)hp+=it.hp*u}return{def,hp}}
function folMaxHp(d){return Math.round(80+d.lvl*20+folEq(d).hp)}
function compTargets(){const l=[];if(PET&&PET.m.visible&&VH.mode!==3){const pd=petDef();if(!(pd&&pd.down>Date.now()))l.push({id:'c:pet',p:PET.p,comp:'pet'})}
  for(const f of FOL)if(!(f.d.deadUntil>Date.now()))l.push({id:'c:'+f.d.id,p:f.p,comp:f});
  if(NET.role==='host')for(const [pid,r] of remotes){const b=r.buf[r.buf.length-1];if(!b||b.a===5)continue;for(const q of (b.fo||[]))if(q[7]!==0)l.push({id:'r:'+pid+':'+q[5],p:{x:q[0],y:q[1],z:q[2]},comp:'remote',peer:pid,cid:q[5]});if(b.pet&&b.veh!==3)l.push({id:'r:'+pid+':pet',p:{x:b.pet[1],y:b.pet[2],z:b.pet[3]},comp:'remote',peer:pid,cid:'pet'})}
  return l}
function compHurt(tg,dmg,e){if(tg.comp==='remote'){if(NET.tr)NET.tr.send({t:'chit',from:NET.id,to:tg.peer,cid:tg.cid,dmg:Math.round(dmg),eid:e?e.id:null});return}if(tg.comp==='pet'&&PET&&e){PET.lastAtk=e.id;PET.lastAtkT=nowS()}if(tg.comp&&tg.comp.d&&e){tg.comp.lastAtk=e.id;tg.comp.lastAtkT=nowS()}if(tg.comp==='pet'){if(!PET)return;if(PET.max==null){PET.max=petMaxHp();PET.hp=PET.max}PET.hp-=dmg*0.8;PET.hurtT=nowS();fxNum(PET.p.x,PET.p.y+1.6,PET.p.z,Math.round(dmg*0.8),'#ff9d6b');
    if(PET.hp<=0){const pd=petDef();if(pd){pd.down=Date.now()+120000;saveInv()}PET.m.visible=false;toast((pd&&pd.name||'Zwierzak')+' jest ciężko ranny i ucieka. Wróci za 2 minuty.','#ff8a7a');sfx('hurt',0.5)}return}
  const f=tg.comp;if(!f||f.d.deadUntil>Date.now())return;if(f.max==null){f.max=folMaxHp(f.d);f.hp=f.max}const def=folEq(f.d).def,k=1-def/(def+70);f.hp-=dmg*k;f.hurtT=nowS();fxNum(f.p.x,f.p.y+2.2,f.p.z,Math.round(dmg*k),'#ff9d6b');
  if(f.hp<=0){f.d.deadUntil=Date.now()+600000;f.m.visible=false;saveInv();toast(f.d.name+' pada w walce! Wróci do drużyny za 10 minut.','#ff8a7a');sfx('hurt',0.6)}}
function compSeparate(){const L=[];if(PET&&PET.m.visible&&VH.mode===0)L.push(PET);for(const f of FOL)if(f.m.visible)L.push(f);L.push({p:player.p,fixed:1});
  for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){const a=L[i],b=L[j],dx=a.p.x-b.p.x,dz=a.p.z-b.p.z,d=Math.hypot(dx,dz),mn=1.5;if(d<mn){const ux=d>1e-3?dx/d:Math.cos(i+j),uz=d>1e-3?dz/d:Math.sin(i+j),k=(mn-d);if(a.fixed){b.p.x-=ux*k;b.p.z-=uz*k}else if(b.fixed){a.p.x+=ux*k;a.p.z+=uz*k}else{a.p.x+=ux*k/2;a.p.z+=uz*k/2;b.p.x-=ux*k/2;b.p.z-=uz*k/2}}}}
function petTick(dt){
  if(!PET)return;const P=PET,d=EDEF[P.t];if(custOn||(SPC&&SPC.func==='garderoba')){P.m.visible=false;P.cust=1;return}if(P.cust){P.cust=0;P.p.set(player.p.x-1.5,player.p.y,player.p.z-1.5);P.m.visible=true}{const pd=petDef();if(P.max==null){P.max=petMaxHp();P.hp=P.max}if(pd&&pd.down>Date.now()){P.m.visible=false;return}if(!P.m.visible&&VH.mode!==3){P.m.visible=true;P.hp=P.max;P.p.set(player.p.x-1.5,player.p.y,player.p.z-1.5);if(pd&&pd.down){pd.down=0;saveInv();toast((pd.name||'Zwierzak')+' wraca do ciebie!','#7dd87d')}}if(P.hp<P.max&&nowS()-(P.hurtT||0)>6)P.hp=Math.min(P.max,P.hp+P.max*0.04*dt)}P.cd-=dt;P.stT-=dt;if(P.stT<=0)P.st=0;const ox=P.p.x,oz=P.p.z;
  if(VH.mode===3){P.p.copy(player.p);P.ry=player.ry}
  else if((VH.mode===1&&VH.boat)||(VH.mode===4&&remotes.get(VH.host)&&remotes.get(VH.host).boat)){const b=VH.mode===1?VH.boat:remotes.get(VH.host).boat,s=seatPos(b,VH.mode===1?BSEAT.petD:BSEAT.petP);P.p.set(s[0],s[1]+0.35,s[2]);P.ry=s[3];P.speed=0}
  else{
    let tg=null,td=1e9;for(const e of enemies.values()){if(e.st===2||!((e.hurtP&&nowS()-e.hurtP<15)||(P.lastAtk===e.id&&nowS()-(P.lastAtkT||0)<15)))continue;const dp=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z),de=Math.hypot(e.p.x-P.p.x,e.p.z-P.p.z);if(dp<13*(1+0.15*ppk(petDef(),'czujnosc'))&&de<18&&de<td){td=de;tg=e}}
    let tx,tz,spd;
    if(tg&&!P2.dead){tx=tg.p.x;tz=tg.p.z;spd=d.spd*1.2*(1+0.08*ppk(petDef(),'zwinnosc'));const rr=d.rng*0.9+0.3;
      if(eDist(tg,P.p.x,P.p.z)<rr){tx=P.p.x;tz=P.p.z;P.ry=Math.atan2(tg.p.x-P.p.x,tg.p.z-P.p.z);if(P.cd<=0){P.cd=1.2*(1-0.08*ppk(petDef(),'zapal'));P.st=1;P.stT=0.3;const pd=petDef(),dmg=(1+0.08*pk('opiekun'))*(1+0.1*ppk(pd,'kly'))*d.dmg*(1+0.3*(HERO.lvl-1))*(1+0.1*((pd&&pd.lvl||1)-1))*(pd&&pd.el?1.25:1)*(hasP('przyjaciel')?1.3:1)*rnd(0.9,1.1);petXp(dmg*0.12);HIT_SRC='pet';dealHit(tg,dmg,false,(tg.p.x-P.p.x)/(td||1),(tg.p.z-P.p.z)/(td||1));HIT_SRC=null}}}
    else{const a=player.ry+Math.PI;tx=player.p.x+Math.sin(a)*2.3;tz=player.p.z+Math.cos(a)*2.3;spd=Math.min(11,Math.hypot(tx-P.p.x,tz-P.p.z)*2.2)}
    const dx=tx-P.p.x,dz=tz-P.p.z,dd=Math.hypot(dx,dz);
    if(dd>40){P.p.set(tx,player.p.y,tz)}else if(dd>0.4){const pst=Math.min(dd,spd*dt),pnx=P.p.x+dx/dd*pst,pnz=P.p.z+dz/dd*pst;if(!SPC&&VOX.size&&voxProbe(pnx,pnz,P.p.y,0.3,1.0).block){if(!voxProbe(pnx,P.p.z,P.p.y,0.3,1.0).block)P.p.x=pnx;else if(!voxProbe(P.p.x,pnz,P.p.y,0.3,1.0).block)P.p.z=pnz}else{P.p.x=pnx;P.p.z=pnz}if(!tg||td>=d.rng)P.ry=Math.atan2(dx,dz)}
    if(!SPC){try{villageCollide(P.p);structCollide(P.p)}catch(_){}}
    const h=colAt(P.p.x,P.p.z,P.p.y);if(h!==null)P.p.y+=(Math.max(h,wlAt(P.p.x,P.p.z)-1.1)-P.p.y)*Math.min(1,12*dt);
  }
  P.speed=Math.hypot(P.p.x-ox,P.p.z-oz)/Math.max(dt,1e-3);
  P.m.position.copy(P.p);let dr=P.ry-P.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));P.m.rotation.y+=dr*Math.min(1,10*dt);
  animEnemy(P.m,Math.min(P.speed,9),dt,P.st,0,false);
}
const HEARTS=[];const heartTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#ff4a6a';x.strokeStyle='#fff';x.lineWidth=4;x.beginPath();x.moveTo(32,54);x.bezierCurveTo(4,34,8,8,32,22);x.bezierCurveTo(56,8,60,34,32,54);x.fill();x.stroke();return new THREE.CanvasTexture(c)})();
function hearts(x,y,z){for(let i=0;i<9;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:heartTex,transparent:true,depthWrite:false}));s.scale.setScalar(0.5+Math.random()*0.3);s.position.set(x+(Math.random()-0.5)*1.2,y+1+Math.random()*0.8,z+(Math.random()-0.5)*1.2);scene.add(s);HEARTS.push({s,t:-i*0.12,vx:(Math.random()-0.5)*0.6,vz:(Math.random()-0.5)*0.6})}}
function heartTick(dt){for(let i=HEARTS.length-1;i>=0;i--){const h=HEARTS[i];h.t+=dt;if(h.t<0){h.s.visible=false;continue}h.s.visible=true;h.s.position.y+=dt*1.3;h.s.position.x+=h.vx*dt;h.s.position.z+=h.vz*dt;h.s.material.opacity=Math.max(0,1-h.t/1.6);if(h.t>1.6){scene.remove(h.s);h.s.material.dispose();HEARTS.splice(i,1)}}}
function tameTarget(){let best=null,bd=4.5;for(const e of enemies.values()){if(e.st===2||!tameable(e.t)||e.sid||e.qid)continue;const d=Math.hypot(e.p.x-player.p.x,e.p.z-player.p.z);if(d<bd){bd=d;best=e}}return best}
function tryTame(){
  const best=tameTarget();
  if(!best)return toast('Podejdź bliżej do zwierzęcia, które da się oswoić','#ff8a7a');
  const fk=FOODOF[best.t];
  if(!(INV.food[fk]>0))return toast('Potrzebujesz: '+foodName(fk)+' (dla: '+EDEF[best.t].n+'). Kupisz u kupca.','#ff8a7a');
  if(INV.pets.length>=PETMAX)return toast('Drużyna jest pełna ('+PETMAX+'). Wypuść któregoś zwierzaka w oknie kompanów (P).','#ff8a7a');
  INV.food[fk]--;const ch=tameChance(best);
  if(Math.random()<ch){const pd={id:'p'+Date.now(),t:best.t,name:EDEF[best.t].n,lvl:Math.max(1,best.lvl||1),xp:0,el:best.elite?1:0,at:Date.now()};INV.pets.push(pd);INV.petA=pd.id;spawnPet();petNew=pd.id;hearts(best.p.x,best.p.y,best.p.z);sfx('tame');
    if(isAuth())removeEnemy(best.id);else NET.tr.send({t:'tamek',from:NET.id,eid:best.id});toast('Oswojono: '+pd.name+'!','#7dd87d');ringFx(best.p.x,best.p.y,best.p.z,2,'lvl')}
  else{best.tries=(best.tries||0)+1;toast('Nie udało się (szansa '+Math.round(ch*100)+'%). Spróbuj jeszcze raz.','#ff8a7a');if(isAuth()&&!best.pas){best.prov=8}}
  saveInv();updHud();if(invOpen())renderInv();
}
const tameChance=e=>e.pas?Math.min(0.95,0.5+(hasP('przyjaciel')?0.25:0)+(e.tries||0)*0.15):Math.max(0.05,Math.min(0.95,0.2+0.55*(1-e.hp/e.max)+(hasP('przyjaciel')?0.25:0)-(e.elite?0.25:0)));
function toggleMount(){
  if(VH.mode===3){VH.mode=0;player.p.y+=0.1;return}
  if(VH.mode!==0||!PET||P2.dead)return;
  if(!mountH(PET.t,PET.m))return toast('Na tym zwierzaku nie da się jeździć','#ff8a7a');
  if(player.swim)return toast('Nie w wodzie','#ff8a7a');
  VH.mode=3;toast('Jazda: R zsiada','#cfe8ff');
}
function vehFrame(dt){
  if(VH.mode===1&&VH.boat){VH.boat.position.set(player.p.x,player.p.y-0.1,player.p.z);VH.boat.rotation.y=VH.bry;animBoat(VH.boat,VH.spd,dt)}
  if(VH.mode===3&&PET)meRef.position.y+=mountH(PET.t,PET.m)||0.8;
  mountFrame(dt);lavaTick(dt);if((performance.now()|0)%30<17)kingTick();arenaTick(dt);arenaHud();
  if(VH.mode===3&&player.swim){VH.mode=0}
  const u=meRef.userData;if(VH.mode===4){u.ll.rotation.x=-1.35;u.rl.rotation.x=-1.35;u.la.rotation.x=-0.3;u.ra.rotation.x=-0.3}
  if(VH.mode===1||VH.mode===3){u.ll.rotation.x=-1.35;u.rl.rotation.x=-1.35;if(VH.mode===1){const k=(VH.boat?VH.boat.userData.row||0:0)*0.55;u.la.rotation.x=-1.1+k;u.ra.rotation.x=-1.1+k;meRef.rotation.x=k*0.12}}
  if(VH.mode===2){const tt=performance.now()*0.001;let dr=player.ry-(VH._gry??player.ry);dr=Math.atan2(Math.sin(dr),Math.cos(dr));VH._gry=player.ry;VH._gt=(VH._gt||0)+((dr/Math.max(dt,1e-3))-(VH._gt||0))*Math.min(1,dt*4);const w=keys.has('KeyW'),s=keys.has('KeyS');
    u.la.rotation.x=-2.9+Math.sin(tt*1.3)*0.05;u.ra.rotation.x=-2.9+Math.cos(tt*1.3)*0.05;u.la.rotation.z=0.18;u.ra.rotation.z=-0.18;u.ll.rotation.x=0.35+Math.sin(tt*2.1)*0.18;u.rl.rotation.x=0.35-Math.sin(tt*2.1)*0.18;VH._pit=(VH._pit??0.1)+(((w?0.18:s?0.02:0.1))-(VH._pit??0.1))*Math.min(1,dt*3);meRef.rotation.x=VH._pit;meRef.rotation.z=Math.max(-0.2,Math.min(0.2,-VH._gt*0.12));VH._gb=1;
    if(Math.random()<dt*(w?14:6)&&typeof PFX!=='undefined'){const a=player.ry+Math.PI/2;for(const sd of [1,-1])PFX.emit(player.p.x+Math.sin(a)*2.6*sd,player.p.y+2.6,player.p.z+Math.cos(a)*2.6*sd,1,['#ffffff','#e8f4ff'],{sp:0.2,g:0,life:0.35,size:0.05,dx:-Math.sin(player.ry)*6,dz:-Math.cos(player.ry)*6})}}
  else if(VH._gb){VH._gb=0;meRef.rotation.z=0;meRef.rotation.x=0;u.la.rotation.z=0;u.ra.rotation.z=0}
  // podpowiedź oswajania
  const pr=$('prompt');
  if(pr.hidden&&VH.mode===0){const best=tameTarget();
    if(best){const fk=FOODOF[best.t],have=INV.food[fk]||0;pr.hidden=false;pr.innerHTML='<kbd>T</kbd> Oswój: <b></b>';pr.querySelector('b').textContent=EDEF[best.t].n+' · potrzebne: '+foodName(fk)+' (masz '+have+')'+(have?' · szansa '+Math.round(tameChance(best)*100)+'%':'')}}
}
function remoteVeh(r,c,dt){
  remoteMount(r,c,dt);
  if(c.veh===1){if(!r.boat){r.boat=makeBoat();scene.add(r.boat)}r.boat.position.set(r.g.position.x,r.g.position.y-0.1,r.g.position.z);r.boat.rotation.y=c.bry||0;animBoat(r.boat,c.bs||0,dt)}else if(r.boat){scene.remove(r.boat);r.boat=null}
  if(c.veh===2){if(!r.gl){r.gl=makeGlider();r.g.add(r.gl)}}else if(r.gl){r.g.remove(r.gl);r.gl=null}
  const u=r.g.userData;if(c.veh===1||c.veh===3||c.veh===4){u.ll.rotation.x=-1.35;u.rl.rotation.x=-1.35}if(c.veh===3&&c.pet&&mountH(c.pet[0]))r.g.position.y+=mountH(c.pet[0]);if(c.veh===2){u.la.rotation.x=-2.9;u.ra.rotation.x=-2.9}
  if(c.pet){if(!r.pet||r.petT!==c.pet[0]){if(r.pet)scene.remove(r.pet);r.pet=makeEnemy(c.pet[0],false);r.petT=c.pet[0];scene.add(r.pet);r.pet.position.set(c.pet[1],c.pet[2],c.pet[3])}
    const ox=r.pet.position.x,oz=r.pet.position.z;r.pet.position.x+=(c.pet[1]-ox)*Math.min(1,10*dt);r.pet.position.y+=(c.pet[2]-r.pet.position.y)*Math.min(1,10*dt);r.pet.position.z+=(c.pet[3]-oz)*Math.min(1,10*dt);r.pet.rotation.y=c.pet[4];
    animEnemy(r.pet,Math.min(9,Math.hypot(r.pet.position.x-ox,r.pet.position.z-oz)/Math.max(dt,1e-3)),dt,c.pet[5]||0,0,false)}
  else if(r.pet){scene.remove(r.pet);r.pet=null}
}
const PETMAX=24;
const PETPERKS=[['kly','Ostre kły','+10% obrażeń kompana'],['zapal','Zapał','Kompan atakuje o 8% szybciej'],['zwinnosc','Zwinność','+8% szybkości kompana'],['czujnosc','Czujność','Kompan wyczuwa wrogów o 15% dalej'],['aura','Aura ochronna','+2 obrony dla ciebie, gdy kompan jest przy tobie'],['opieka','Opieka','+0,3 zdrowia na sekundę dla ciebie']];
const ppk=(p,k)=>p&&p.pp?p.pp[k]||0:0;const petPts=p=>Math.max(0,(p.lvl||1)-1-Object.values(p.pp||{}).reduce((a,b)=>a+b,0));let petNew=null,petSel=null;
const petNeed=l=>Math.round(90+70*Math.pow(l,1.4));
function petXp(x){const p=petDef();if(!p)return;p.lvl=p.lvl||1;p.xp=(p.xp||0)+x;let up=false;while(p.lvl<50&&p.xp>=petNeed(p.lvl)){p.xp-=petNeed(p.lvl);p.lvl++;up=true}
  if(up){toast((p.name||EDEF[p.t].n)+' awansuje na poziom '+p.lvl+'!','#7dd87d');if(PET)ringFx(PET.p.x,PET.p.y,PET.p.z,1.6,'lvl');saveInv()}}
// portrety zwierząt: renderujemy model do małej tekstury raz na gatunek (cache)
const PORTR={};let portrRT=null;const portrScene=new THREE.Scene(),portrCam=new THREE.PerspectiveCamera(32,1,0.1,60);
portrScene.add(new THREE.HemisphereLight(0xfff6e8,0x504030,1.0));{const dl=new THREE.DirectionalLight(0xffffff,0.75);dl.position.set(3,5,4);portrScene.add(dl)}
function portrait(t){
  if(PORTR[t])return PORTR[t];
  try{const S2=128;if(!portrRT)portrRT=new THREE.WebGLRenderTarget(S2,S2);
    const mdl=makeEnemy(t,false);mdl.rotation.y=0.65;portrScene.add(mdl);
    const sc=EDEF[t].sc||1,hy=(EDEF[t].legs&&EDEF[t].legs.length?0.75:0.5)*sc,D=2.6*sc+(EDEF[t].L||0.6);
    portrCam.position.set(D*0.55,hy+D*0.32,D);portrCam.lookAt(0,hy,0);
    const bg=portrScene.background;portrScene.background=new THREE.Color(0x2a2016);
    renderer.setRenderTarget(portrRT);renderer.render(portrScene,portrCam);const px=new Uint8Array(S2*S2*4);renderer.readRenderTargetPixels(portrRT,0,0,S2,S2,px);renderer.setRenderTarget(null);
    portrScene.remove(mdl);mdl.userData.mat.dispose();portrScene.background=bg;
    const c=document.createElement('canvas');c.width=c.height=S2;const x=c.getContext('2d'),id=x.createImageData(S2,S2);
    for(let y=0;y<S2;y++)id.data.set(px.subarray((S2-1-y)*S2*4,(S2-y)*S2*4),y*S2*4);x.putImageData(id,0,0);PORTR[t]=c.toDataURL();
  }catch(e){PORTR[t]=''}
  return PORTR[t];
}
const petsOpen=()=>!$('petsui').hidden;
function togglePets(){const v=$('petsui');v.hidden=!v.hidden;if(!v.hidden){try{document.exitPointerLock()}catch(e){}if(petNew){petSel=petNew;petNew=null}renderPets()}}
function petKind(t){const d=EDEF[t];return d.passive?(mountH(t)?'Wierzchowiec':'Zwierzę'):d.boss?'Legendarny':'Bestia'}
function renderPets(){
  if(!INV.pets.find(p=>p.id===petSel))petSel=INV.petA||(INV.pets[0]&&INV.pets[0].id)||null;
  const cards=INV.pets.map(p=>{const d=EDEF[p.t],img=portrait(p.t);return `<button class="pcard${p.id===petSel?' sel':''}${p.id===INV.petA?' act':''}" data-psel="${p.id}">
    ${img?`<img src="${img}" alt="">`:`<span class="pimg"></span>`}<b>${esc(p.name||d.n)}</b><small>Poz. ${p.lvl||1} · ${petKind(p.t)}</small>${p.id===INV.petA?'<em>Kompan</em>':''}${p.el?'<i>★</i>':''}</button>`}).join('');
  const empty=Array.from({length:Math.max(0,Math.min(PETMAX,Math.ceil((INV.pets.length+1)/4)*4)-INV.pets.length)},()=>'<div class="pcard empty"></div>').join('');
  $('pgrid').innerHTML=INV.pets.length?cards+empty:'<p class="sub2" style="grid-column:1/-1">Nie masz jeszcze zwierzaków. Podejdź do zwierzęcia z jego ulubionym jedzeniem i naciśnij <kbd>T</kbd>.</p>';
  const p=INV.pets.find(q=>q.id===petSel);let h='';
  if(p){const d=EDEF[p.t],lv=p.lvl||1,need=petNeed(lv),dm=Math.round(d.dmg*(1+0.1*(lv-1))*(p.el?1.25:1)*10)/10;
    h=`<div class="pbig">${portrait(p.t)?`<img src="${portrait(p.t)}" alt="">`:''}</div>
    <h3 id="pname">${esc(p.name||d.n)}</h3><p class="sub2">${d.n} · ${petKind(p.t)}${p.el?' · elitarny ★':''}</p>
    <div class="pxp"><div style="width:${Math.min(100,(p.xp||0)/need*100)}%"></div><span>Poziom ${lv} · ${Math.floor(p.xp||0)} / ${need} PD</span></div>
    <table><tr><td>Siła ataku</td><td>${dm}</td></tr><tr><td>Szybkość</td><td>${d.spd.toFixed(1)}</td></tr><tr><td>Jazda wierzchem</td><td>${mountH(p.t)?'tak (R) · ×'+(MSPD[p.t]||1).toFixed(2):'nie'}</td></tr><tr><td>Ulubione jedzenie</td><td>${FOODOF[p.t]?foodName(FOODOF[p.t]):'—'}</td></tr></table>
    <h2 style="margin-top:12px">Perki zwierzaka <small style="color:var(--mut);font-size:13px">punkty: ${petPts(p)}</small></h2><div class="pperks">${PETPERKS.map(([k,n,dd])=>{const r=ppk(p,k);return `<div class="pperk"><div><b>${n}</b><span>${dd}</span></div><div class="pips">${'<i class="on"></i>'.repeat(r)}${'<i></i>'.repeat(5-r)}</div><button data-pperk="${k}"${petPts(p)>0&&r<5?'':' disabled'}>+</button></div>`}).join('')}</div>
    <div class="pbtns">${INV.petA===p.id?'<button data-pact="off">Odeślij</button>':'<button class="pri" data-pact="on">Wybierz na kompana</button>'}<button data-pact="ren">Zmień imię</button><button data-pact="rel">${p.rel?'Na pewno? Kliknij ponownie':'Wypuść'}</button></div>
    <div id="prenw" hidden><input id="prenin" maxlength="18" value="${esc(p.name||d.n)}"><button data-pact="rok">Zapisz</button></div>`}
  else h='<p class="sub2">Wybierz zwierzaka z listy.</p>';
  const fl=Object.keys(INV.food).filter(k=>INV.food[k]>0&&FOODS[k]);
  h+='<h2 style="margin-top:14px">Jedzenie do oswajania</h2>'+(fl.length?'<div class="foods">'+fl.map(k=>`<div class="food"><img class="fimg" src="${itemIcon({base:'food',var:k,rar:0})}" alt=""><div><b>${foodName(k)} ×${INV.food[k]}</b><span>dla: ${foodFor(k)}</span></div></div>`).join('')+'</div>':'<p class="sub2">Brak. Kupisz je u kupców.</p>');
  $('pdet').innerHTML=h;$('pcount').textContent=INV.pets.length+' / '+PETMAX;
  $('folbox').innerHTML='<h2>Towarzysze broni <small style="color:var(--mut);font-size:13px">'+INV.fol.length+' / 2 · werbujesz ich w karczmach i w miastach</small></h2>'+(INV.fol.length?INV.fol.map((d,i)=>{d.eq=d.eq||{};const f=FOL[i],dead=d.deadUntil>Date.now(),hp=f&&f.max?Math.round(f.hp)+' / '+f.max:folMaxHp(d),eqv=folEq(d),wn=d.eq.bron?d.eq.bron.name:WEAP[d.w].n;
    const slots=FOLSL.filter(([k])=>!(k==='helm'&&RACES[d.race]&&RACES[d.race].nohelm)).map(([k,n])=>{const it=d.eq[k];return `<button class="slot r${it?it.rar:'x'} fslot${folPick&&folPick.i===i&&folPick.k===k?' sel':''}" data-fslot="${i}:${k}" title="${n}${it?': '+esc(it.name):''}">${it?icHTML(it):`<span class="fsl">${n}</span>`}</button>`}).join('');
    let pick='';if(folPick&&folPick.i===i){const cand=INV.bag.map((it,bi)=>[it,bi]).filter(([it])=>it&&it.slot===folPick.k);pick=`<div class="fpick"><b>${FOLSL.find(q=>q[0]===folPick.k)[1]}: wybierz z plecaka</b>${cand.length?cand.map(([it,bi])=>`<button data-fput="${i}:${bi}">${icHTML(it)}<span style="color:${RAR[it.rar].c}">${esc(it.name)}</span><small>poz. ${it.lvl}</small></button>`).join(''):'<p class="sub2">Brak pasujących przedmiotów w plecaku.</p>'}${d.eq[folPick.k]?`<button data-foff="${i}:${folPick.k}">Zdejmij do plecaka</button>`:''}</div>`}
    return `<div class="pperk folcard"><div style="flex:1"><div class="fname"><input data-fname="${i}" value="${esc(d.name)}" maxlength="22"><button data-fren="${i}" style="width:auto;padding:3px 8px">Zmień imię</button></div><span>Poziom ${d.lvl} · ${esc(wn)} · ${dead?'<b style="color:#ff8a7a">poległ – wróci za '+Math.ceil((d.deadUntil-Date.now())/60000)+' min</b>':'zdrowie '+hp}${eqv.def?' · obrona '+Math.round(eqv.def):''}</span><div class="fslots">${slots}</div>${pick}</div><button data-folx="${i}" style="width:auto;padding:4px 10px">Odpraw</button></div>`}).join(''):'<p class="sub2">Nikt jeszcze z tobą nie wędruje.</p>');
}
$('petsui').onclick=e=>{{const fx=e.target.closest('[data-folx]');if(fx){dismissFol(+fx.dataset.folx);renderPets();return}}
  {const b=e.target.closest('[data-fren]');if(b){const i=+b.dataset.fren,inp=document.querySelector(`[data-fname="${i}"]`),d=INV.fol[i],nm=(inp&&inp.value||'').trim().slice(0,22);if(d&&nm){d.name=nm;saveInv();spawnFols();toast('Najemnik nazywa się teraz: '+nm,'#ffd34d')}renderPets();return}}
  {const b=e.target.closest('[data-fslot]');if(b){const [i,k]=b.dataset.fslot.split(':');folPick=folPick&&folPick.i===+i&&folPick.k===k?null:{i:+i,k};renderPets();return}}
  {const b=e.target.closest('[data-fput]');if(b){const [i,bi]=b.dataset.fput.split(':').map(Number),d=INV.fol[i],it=INV.bag[bi];if(d&&it&&it.slot===folPick.k){d.eq=d.eq||{};if(it.slot==='tarcza'&&TWOH(d.eq.bron||{base:d.w})){toast(d.name+' walczy bronią dwuręczną – tarcza się nie przyda','#ff8a7a');return}if(it.slot==='bron'&&TWOH(it)&&d.eq.tarcza){INV.bag.push(d.eq.tarcza);delete d.eq.tarcza}const old=d.eq[it.slot];INV.bag.splice(bi,1);if(old)INV.bag.push(old);d.eq[it.slot]=it;if(it.slot==='bron'){d.w0=d.w0||d.w;d.w=WEAP[it.base]?it.base:d.w}const f=FOL[i];if(f){f.max=folMaxHp(d);f.hp=Math.min(f.hp||f.max,f.max)}saveInv();spawnFols();toast(d.name+' zakłada: '+it.name,RAR[it.rar].c);folPick=null}renderPets();return}}
  {const b=e.target.closest('[data-foff]');if(b){const [i,k]=b.dataset.foff.split(':'),d=INV.fol[+i];if(d&&d.eq&&d.eq[k]){if(INV.bag.length>=bagN()){toast('Plecak pełny','#ff8a7a');return}INV.bag.push(d.eq[k]);delete d.eq[k];if(k==='bron'&&d.w0)d.w=d.w0;saveInv();spawnFols();folPick=null}renderPets();return}}{const b=e.target.closest('[data-pperk]');if(b){const p=INV.pets.find(q=>q.id===petSel);if(p&&petPts(p)>0){p.pp=p.pp||{};p.pp[b.dataset.pperk]=Math.min(5,(p.pp[b.dataset.pperk]||0)+1);saveInv();renderPets()}return}}const s=e.target.closest('[data-psel]');if(s){petSel=s.dataset.psel;for(const p of INV.pets)p.rel=0;renderPets();return}
  const b=e.target.closest('[data-pact]');if(!b)return;const p=INV.pets.find(q=>q.id===petSel);if(!p)return;const a=b.dataset.pact;
  if(a==='on'){INV.petA=p.id;spawnPet();toast((p.name||EDEF[p.t].n)+' jest teraz twoim kompanem','#7dd87d')}
  else if(a==='off'){INV.petA=null;despawnPet()}
  else if(a==='ren'){$('prenw').hidden=false;$('prenin').focus();$('prenin').select();return}
  else if(a==='rok'){const v=$('prenin').value.trim();if(v){p.name=v.slice(0,18);if(INV.petA===p.id)spawnPet()}}
  else if(a==='rel'){if(!p.rel){p.rel=1;renderPets();return}const i=INV.pets.indexOf(p);if(INV.petA===p.id){INV.petA=null;despawnPet()}INV.pets.splice(i,1);toast('Wypuszczono: '+(p.name||EDEF[p.t].n),'#cfe8ff')}
  saveInv();renderPets();if(invOpen())renderInv()};
$('petsclose').onclick=togglePets;$('petsbtn').onclick=togglePets;
function petsHTML(){
  return `<p class="sub2">Kompanów wybierasz w oknie drużyny: klawisz <kbd>P</kbd>.</p><button id="openpets2">Otwórz drużynę (${INV.pets.length})</button>`;
}
function petsHTML_old(){
  const fl=Object.keys(INV.food).filter(k=>INV.food[k]>0&&FOODS[k]);
  return `<p class="sub2">Każde zwierzę oswoisz jego ulubionym jedzeniem (T obok niego). Wrogów najpierw osłab. Wierzchowce dosiadasz klawiszem R.</p>`+
   (fl.length?'<div class="foods">'+fl.map(k=>`<div class="food"><img class="fimg" src="${itemIcon({base:'food',var:k,rar:0})}" alt=""><div><b>${foodName(k)} ×${INV.food[k]}</b><span>dla: ${foodFor(k)}</span></div></div>`).join('')+'</div>':'<p class="sub2">Nie masz jedzenia dla zwierząt. Kupisz je u kupców.</p>')+
   (INV.pets.length?INV.pets.map((p,i)=>`<div class="petrow"><span>${esc(p.name)}${mountH(p.t)?' · wierzchowiec':''}</span>${INV.petA===p.id?'<button data-pet="off" >Odeślij</button>':`<button data-pet="${i}">Przywołaj</button>`}<button data-petx="${i}">Wypuść</button></div>`).join(''):'<p class="sub2">Nie masz jeszcze zwierzaków.</p>');
}
$('pets').onclick=e=>{if(e.target.closest('#openpets2')){toggleInv();togglePets();return}const b=e.target.closest('[data-pet],[data-petx]');if(!b)return;
  if(b.dataset.petx!=null){const p=INV.pets[+b.dataset.petx];if(p&&INV.petA===p.id){INV.petA=null;despawnPet()}INV.pets.splice(+b.dataset.petx,1)}
  else if(b.dataset.pet==='off'){INV.petA=null;despawnPet()}else{INV.petA=INV.pets[+b.dataset.pet].id;spawnPet()}
  saveInv();renderInv()};

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
$('volm').value=AUD.volM;$('volf').value=AUD.volF;$('volm').oninput=e=>{AUD.volM=+e.target.value;LS.set('volM',AUD.volM);if(AUD.mus)AUD.mus.gain.value=AUD.volM*0.5};$('volf').oninput=e=>{AUD.volF=+e.target.value;LS.set('volF',AUD.volF);if(AUD.fx)AUD.fx.gain.value=AUD.volF};
let musT=0;function audioTick(dt){if(!AUD.on)return;musT+=dt;if(musT>2){musT=0;MUS.wantMood=musicMood()}musicTick()}

// =================== PRZESTRZENIE ZAMKNIĘTE: wnętrza budynków, lochy, jaskinie ===================
// Każda przestrzeń leży wysoko nad swoim miejscem na mapie (y≥560), ma siatkę ścian (solid) i własną podłogę.
const SPACES=new Map();let SPC=null,spcLeaveT=0;const ENTERABLE={karczma:'Karczma',kuznia:'Kuźnia',sklep:'Sklep',piekarnia:'Piekarnia',kaplica:'Kaplica',warsztat:'Warsztat',stajnia:'Stajnia',spichlerz:'Spichlerz',dom:'Dom'};
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
  for(let j=1;j<D-1;j++){P(0,-0.1,Z(j)+0.5,W-2,0.2,1,j%2?'#8a6240':'#7e5838');P(0,0.004,Z(j)+0.02,W-2,0.01,0.04,'#4a2f1d');let x=X(1)+(j%3)*0.9+0.8;while(x<X(W-1)-0.4){P(x,0.004,Z(j)+0.5,0.04,0.01,0.96,'#4a2f1d');x+=1.6+((j*7+Math.round(x*3))%5)*0.35}}
  for(const [x,z,w,d] of [[0,Z(0.5),W,1],[0,Z(D-0.5),W,1],[X(0.5),0,1,D],[X(W-0.5),0,1,D]])P(x,s.ceil/2,z,w,s.ceil,d,PL);
  for(const [x,z,w,d] of [[0,Z(1)+0.03,W-2,0.06],[0,Z(D-1)-0.03,W-2,0.06],[X(1)+0.03,0,0.06,D-2],[X(W-1)-0.03,0,0.06,D-2]]){P(x,0.55,z,w,1.1,d,'#7a5030');P(x,1.12,z,w+(d>w?0.04:0),0.08,d+(w>d?0.04:0),'#4a2f1d');P(x,0.06,z,w+(d>w?0.03:0),0.12,d+(w>d?0.03:0),'#4a2f1d')}
  for(let i=2;i<W-1;i+=3){P(X(i),s.ceil/2,Z(1)+0.03,0.25,s.ceil,0.06,WDD);P(X(i),s.ceil/2,Z(D-1)-0.03,0.25,s.ceil,0.06,WDD)}
  for(let j=2;j<D-1;j+=3){P(X(1)+0.03,s.ceil/2,Z(j),0.06,s.ceil,0.25,WDD);P(X(W-1)-0.03,s.ceil/2,Z(j),0.06,s.ceil,0.25,WDD)}
  P(0,s.ceil+0.15,0,W,0.3,D,'#5a3a22');for(let i=2;i<W-1;i+=2)P(X(i),s.ceil-0.15,0,0.3,0.3,D-2,WDD);
  P(0,1.2,Z(D-1)-0.02,1.4,2.4,0.08,'#5a3a22');P(0,2.5,Z(D-1)-0.05,1.8,0.2,0.12,WDD);   // drzwi
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
  else if(f==='dom'){// izba mieszkalna: łóżko, szafa, palenisko z kociołkiem, stół z ławami, kredens, skrzynia
    SOL(1,1,2,3);P(X(2),0.25,Z(2.5),2,0.5,3,WD);P(X(2),0.55,Z(2.6),1.8,0.18,2.6,'#e8e2d0');P(X(2),0.66,Z(3.1),1.86,0.08,1.7,['#a8352a','#3f6a8a','#5a8a3a'][Math.floor(r()*3)]);P(X(2),0.7,Z(1.6),1.2,0.16,0.5,'#f4efe4');P(X(2),0.9,Z(1)+0.12,2,1.0,0.12,WDD);
    SOL(1,4,1,4);P(X(1.5),0.35,Z(4.5),0.9,0.7,0.7,'#7a4b22');P(X(1.5),0.72,Z(4.5),0.94,0.06,0.74,'#3a3a40');
    SOL(W-3,1,W-2,1);P(X(W-2),1.2,Z(1.45),1.9,2.4,0.8,WD);P(X(W-2)-0.47,1.2,Z(1.87),0.9,2.2,0.04,'#8a6240');P(X(W-2)+0.47,1.2,Z(1.87),0.9,2.2,0.04,'#8a6240');for(const x of [-0.08,0.08])P(X(W-2)+x,1.25,Z(1.9),0.05,0.14,0.04,'#c9a24a');
    fire(5,1,true);P(X(6),0.95,Z(1.75),0.06,0.06,0.9,'#3a3a40');P(X(6),0.6,Z(1.9),0.6,0.4,0.6,'#2a2a30');P(X(6),0.82,Z(1.9),0.5,0.04,0.5,'#6a8a4a');
    table(4,5);for(const x of [X(4.6),X(5.4)])P(x,0.94,Z(5.5),0.12,0.16,0.12,'#f0e8d0'),P(x,1.06,Z(5.5),0.06,0.08,0.06,'#ffd38a');
    SOL(W-2,4,W-2,6);P(X(W-1.5),1.0,Z(5.5),0.7,2,2.8,WD);for(const y of [0.7,1.3,1.9])P(X(W-1.5)-0.05,y,Z(5.5),0.62,0.05,2.7,WDD);for(let k=0;k<6;k++)P(X(W-1.5)-0.15,0.85+Math.floor(k/3)*0.6,Z(4.4+(k%3)*0.9),0.2,0.25,0.25,['#d8d0b8','#c9a24a','#8a5a30','#3f6d9a'][k%4]);
    barrel(1,D-3);npc('mieszk','Gospodarz',W/2-2,7.5,0);torch(X(1)+0.2,Z(6));s.pets=[r()<0.5?'kot':'pies']}
  else if(f==='warsztat'){SOL(2,1,5,1);P(X(4),0.9,Z(1.5),4,0.15,0.9,'#8a6240');P(X(4),0.45,Z(1.5),3.8,0.9,0.7,WD);for(let k=0;k<6;k++)P(X(2.4+k*0.6),1.6,Z(1)+0.08,0.08,0.4+(k%3)*0.1,0.05,k%2?'#8a8f94':'#6b4528');P(X(4),1.4,Z(1)+0.05,3.6,0.06,0.06,WDD);
    SOL(W-4,3,W-3,3);P(X(W-3),0.45,Z(3.5),1.8,0.12,0.4,WD);for(const x of [-0.7,0.7])P(X(W-3)+x,0.25,Z(3.5),0.12,0.5,0.6,WDD);P(X(W-3),0.75,Z(3.5),1.6,0.4,0.4,'#a87a4a');
    SOL(1,4,1,6);for(let k=0;k<6;k++)P(X(1.5),0.1+k*0.14,Z(5),0.7,0.12,2.6,k%2?'#b88a5a':'#a87a4a');for(let k=0;k<12;k++)P(X(3+r()*6),0.02,Z(3+r()*4),0.2,0.02,0.1,'#d8b07a');
    barrel(W-2,D-3);barrel(W-2,D-4);torch(X(W/2),Z(D-1)-0.2);npc('mieszk','Cieśla',W/2,4.2,0);s.pets=r()<0.4?['kot']:[]}
  else{for(let k=0;k<5;k++){const i=1+k*2;SOL(i,1,i+1,2);for(let q=0;q<3;q++)P(X(i+1),0.35+q*0.6,Z(2),1.6,0.6,1.6,q%2?'#d8c8a0':'#d8b24a')}
    SOL(W-4,4,W-2,5);P(X(W-3),0.45,Z(5),3,0.9,2,'#7a5532');for(let k=0;k<8;k++)P(X(2+r()*7),0.03,Z(4+r()*3),0.12,0.04,0.12,'#d8b24a');torch(X(W/2),Z(D-1)-0.2);npc('mieszk','Zarządca',W/2,5,0);s.pets=r()<0.5?['kot']:[]}
  // ===== detale każdego wnętrza: dywan, żyrandol ze świecami, półki, obrazy, zioła, pajęczyny, rośliny =====
  {const free=(i,j)=>i>0&&j>0&&i<W-1&&j<D-1&&!s.solid[j*W+i],cx=Math.floor(W/2),cz=Math.floor(D/2);
    if(free(cx,cz)&&free(cx-1,cz)&&f!=='stajnia'){const rc=['#8a2a2a','#2f4f7f','#5a3a6a','#6a5a2a'][Math.floor(r()*4)];P(0,0.01,Z(cz+0.5),3.2,0.03,2.2,rc);P(0,0.025,Z(cz+0.5),2.8,0.02,1.8,'#d8b24a');P(0,0.035,Z(cz+0.5),2.5,0.02,1.5,rc)}
    if(f!=='karczma'){P(0,s.ceil-0.35,0,0.08,0.6,0.08,'#3a3a40');P(0,s.ceil-0.7,0,1.3,0.08,1.3,'#3a2414');for(const [a,b] of [[-0.55,0],[0.55,0],[0,-0.55],[0,0.55]])P(a,s.ceil-0.58,b,0.1,0.22,0.1,'#f0e8d0');s.torches.push([s.x0+W/2,s.fy+s.ceil-0.5,s.z0+D/2])}
    // okna: rama z krzyżem, szyby, parapet i plama światła na podłodze
    const WIN=new Set(),WALL=new Set(),wb=(sd,j)=>WALL.has(sd+':'+j)||WIN.has(sd+':'+j);
    // ściany zajęte przez stałe wyposażenie (stojak kowala, chorągwie kaplicy) — tam nie wieszamy okien ani ozdób
    if(f==='kuznia')for(let j=1;j<D-1;j++)WALL.add('1:'+j);if(f==='kaplica')for(const j of [3,4,7,8])WALL.add('0:'+j),WALL.add('1:'+j);
    const GL='#cfe6ff',win=(side,c)=>{const sx=side===0?X(1):side===1?X(W-1):0,dir=side===0?1:side===1?-1:0;
      if(side<2){const z=Z(c+0.5),x=sx+dir*0.06;P(x,2.1,z,0.04,1.1,0.9,GL);for(const dz of [-0.5,0.5])P(x+dir*0.03,2.1,z+dz,0.12,1.24,0.1,'#4a2f1d');for(const dy of [-0.6,0.6])P(x+dir*0.03,2.1+dy,z,0.12,0.1,1.1,'#4a2f1d');P(x+dir*0.05,2.1,z,0.08,1.1,0.06,'#4a2f1d');P(x+dir*0.05,2.15,z,0.08,0.06,0.9,'#4a2f1d');P(sx+dir*0.14,1.44,z,0.28,0.07,1.2,'#7a5030');if(free(side?W-2:1,c))P(sx+dir*1.4,0.013,z+0.15,1.9,0.01,0.85,'#efdca0');WIN.add(side+':'+c)}
      else{const x=X(c+0.5),z=Z(D-1)-0.06;P(x,2.1,z,0.9,1.1,0.04,GL);for(const dx of [-0.5,0.5])P(x+dx,2.1,z-0.03,0.1,1.24,0.12,'#4a2f1d');for(const dy of [-0.6,0.6])P(x,2.1+dy,z-0.03,1.1,0.1,0.12,'#4a2f1d');P(x,2.1,z-0.05,0.06,1.1,0.08,'#4a2f1d');P(x,2.15,z-0.05,0.9,0.06,0.08,'#4a2f1d');P(x,1.44,Z(D-1)-0.14,1.2,0.07,0.28,'#7a5030');if(free(c,D-2))P(x+0.15,0.013,Z(D-1)-1.4,0.85,0.01,1.9,'#efdca0')}};
    for(const c of [Math.max(2,Math.round(W*0.22)),W-1-Math.max(2,Math.round(W*0.22))])if(c>1&&c<W-2&&Math.abs(c+0.5-W/2)>1.6)win(2,c);
    for(let j=2;j<D-2;j+=3)for(const sd of [0,1]){const wx=sd?W-2:1;if(r()<0.25)continue;if(!free(wx,j)||wb(sd,j)||wb(sd,j-1)||wb(sd,j+1))continue;win(sd,j)}
    for(let j=2;j<D-2;j+=3){for(const [x,wx] of [[X(1)+0.18,1],[X(W-1)-0.18,W-2]]){const sd=wx===1?0:1;if(wb(sd,j)||wb(sd,j+1)||wb(sd,j-1))continue;if(!free(wx,j)||!free(wx,j+1)||r()<0.35)continue;WALL.add(sd+':'+j);WALL.add(sd+':'+(j+1));P(x,1.85,Z(j+0.5),0.3,0.06,1.4,WD);for(let k=0;k<4;k++)P(x,2.0,Z(j)+0.25+k*0.3,0.18,0.24-(k%2)*0.06,0.14,['#a8452f','#3f6d9a','#d8d0b8','#5a8a3a','#c9a24a'][(k+j)%5])}}
    for(const [x,z,rot,sd,cj] of [[X(1)+0.04,Z(D/2-1.5),1,0,Math.floor(D/2-1.5)],[X(W-1)-0.04,Z(D/2+1),1,1,Math.floor(D/2+1)],[X(W/2+2),Z(1)+0.04,0,-1,0]]){if(r()<0.4)continue;if(sd>=0&&(wb(sd,cj)||wb(sd,cj-1)||wb(sd,cj+1)||!free(sd?W-2:1,cj)))continue;if(sd<0&&(!free(Math.floor(W/2+2),1)||!free(Math.floor(W/2+1),1)||['sklep','piekarnia','karczma','kaplica'].includes(f)))continue;if(sd>=0){WALL.add(sd+':'+cj);WALL.add(sd+':'+(cj-1));WALL.add(sd+':'+(cj+1))}const pc=['#3f6a8a','#8a5a3a','#5a7a4a','#7a3a5a'][Math.floor(r()*4)];if(rot){P(x,2.4,z,0.04,0.9,1.2,'#c9a24a');P(x,2.4,z,0.06,0.74,1.04,pc);P(x,2.3,z,0.07,0.3,0.4,'#e8d8a8')}else{P(x,2.4,z,1.2,0.9,0.04,'#c9a24a');P(x,2.4,z,1.04,0.74,0.06,pc)}}
    for(const [i,j] of [[1,D-2],[W-2,D-2]])if(free(i,j)&&r()<0.7){SOL(i,j,i,j);P(X(i+0.5),0.25,Z(j+0.5),0.5,0.5,0.5,'#8a5a3a');P(X(i+0.5),0.7,Z(j+0.5),0.7,0.5,0.7,'#4a8a3a');P(X(i+0.5),1.05,Z(j+0.5),0.45,0.3,0.45,'#5aa04a')}
    for(let k=0;k<3;k++){const x=X(2+r()*(W-4)),z=Z(2+r()*(D-4));P(x,s.ceil-0.5,z,0.04,0.5,0.04,'#6a4a2a');P(x,s.ceil-0.85,z,0.22,0.3,0.12,['#6a8a3a','#8a7a3a','#a87a4a'][k])}
    for(const [x,z] of [[X(1)+0.15,Z(1)+0.15],[X(W-1)-0.15,Z(1)+0.15]])P(x,s.ceil-0.25,z,0.5,0.5,0.03,'#e8e6e0');
    for(const k of WALL)WIN.add(k);interiorExtras(P,SOL,free,s,f,r,X,Z,W,D,WIN)}
  try{raceInterior(L,v&&v.race)}catch(e){}s.geoL=L;SPACES.set(key,s);return s}
// dodatkowe wyposażenie wnętrz: stołki, skrzynie, świeczniki, worki, trofea, narzędzia (tylko na wolnych polach)
function interiorExtras(P,SOL,free0,s,f,r,X,Z,W,D,WIN){const free=(i,j)=>free0(i,j)&&!(s.npcs||[]).some(n=>Math.abs(n.x-(s.x0+i+0.5))<1.2&&Math.abs(n.z-(s.z0+j+0.5))<1.2)&&!(s.exit&&Math.abs(s.exit[0]-(s.x0+i+0.5))<1.5&&Math.abs(s.exit[1]-(s.z0+j+0.5))<2.2);const WD='#7a5030',WDD='#4a2f1d',pick=a=>a[Math.floor(r()*a.length)];
  const wallSpots=[];for(let j=2;j<D-2;j++)for(const sd of [0,1]){const i=sd?W-2:1;if(free(i,j)&&!WIN.has(sd+':'+j)&&!WIN.has(sd+':'+(j-1))&&!WIN.has(sd+':'+(j+1)))wallSpots.push([sd,i,j])}
  const take=()=>{if(!wallSpots.length)return null;const k=Math.floor(r()*wallSpots.length),q=wallSpots[k];wallSpots.splice(k,1);for(let m=wallSpots.length-1;m>=0;m--)if(wallSpots[m][0]===q[0]&&Math.abs(wallSpots[m][2]-q[2])<2)wallSpots.splice(m,1);return q};
  const stool=(x,z)=>{P(x,0.45,z,0.42,0.07,0.42,WD);for(const [a,b] of [[-0.15,-0.15],[0.15,-0.15],[-0.15,0.15],[0.15,0.15]])P(x+a,0.21,z+b,0.06,0.42,0.06,WDD)};
  const chest=(sd,i,j)=>{SOL(i,j,i,j);const x=X(i+0.5)+(sd?0.1:-0.1),z=Z(j+0.5);P(x,0.3,z,0.7,0.6,1.0,'#7a4b22');P(x,0.62,z,0.72,0.08,1.02,'#5a3416');for(const dz of [-0.35,0.35])P(x,0.33,z+dz,0.74,0.62,0.06,'#3a3a40');P(x+(sd?-0.37:0.37),0.45,z,0.04,0.12,0.12,'#c9a24a')};
  const sacks=(sd,i,j)=>{SOL(i,j,i,j);const x=X(i+0.5),z=Z(j+0.5);P(x,0.3,z-0.2,0.5,0.6,0.45,'#c8b48a');P(x,0.62,z-0.2,0.3,0.1,0.3,'#a8946a');P(x+0.05,0.26,z+0.28,0.45,0.52,0.42,'#bca67a');P(x+0.05,0.55,z+0.28,0.26,0.08,0.26,'#9a8660')};
  const candle=(sd,i,j)=>{const x=X(i+0.5)+(sd?0.15:-0.15),z=Z(j+0.5);SOL(i,j,i,j);P(x,0.45,z,0.5,0.9,0.5,WD);P(x,0.92,z,0.56,0.05,0.56,WDD);P(x,1.05,z,0.08,0.22,0.08,'#f0e8d0');P(x,1.19,z,0.05,0.07,0.05,'#ffd38a');P(x+0.15,1.0,z+0.1,0.06,0.14,0.06,'#f0e8d0')};
  const trophy=(sd,j)=>{const x=sd?X(W-1)-0.06:X(1)+0.06,z=Z(j+0.5),dx=sd?-1:1;P(x,2.6,z,0.06,0.5,0.4,WDD);P(x+dx*0.18,2.6,z,0.3,0.22,0.2,'#8a6a4a');for(const g of [-1,1]){P(x+dx*0.2,2.85,z+g*0.18,0.06,0.3,0.06,'#e8dcc0');P(x+dx*0.2,3.0,z+g*0.3,0.06,0.06,0.25,'#e8dcc0')}};
  const rack=(sd,j)=>{const x=sd?X(W-1)-0.1:X(1)+0.1,z=Z(j+0.5);P(x,1.6,z,0.08,0.08,1.4,WDD);P(x,1.0,z,0.08,0.08,1.4,WDD);for(let k=0;k<3;k++){const zz=z-0.45+k*0.45;P(x+(sd?-0.06:0.06),1.35,zz,0.05,1.4,0.05,'#6b4528');P(x+(sd?-0.06:0.06),2.1,zz,0.05,0.25,0.12,'#aeb6bd')}};
  const pots=(sd,j)=>{const x=sd?X(W-1)-0.15:X(1)+0.15,z=Z(j+0.5);P(x,2.2,z,0.06,0.06,1.3,'#3a3a40');for(let k=0;k<3;k++){const zz=z-0.45+k*0.45;P(x,2.0,zz,0.02,0.3,0.02,'#3a3a40');P(x,1.75,zz,0.28,0.22,0.28,k%2?'#8a5a3a':'#5a5a62')}};
  const n=f==='stajnia'?1:2+Math.floor(r()*2);for(let k=0;k<n;k++){const q=take();if(!q)break;const [sd,i,j]=q,t=r();if(t<0.35)chest(sd,i,j);else if(t<0.6)candle(sd,i,j);else sacks(sd,i,j)}
  {const q=take();if(q&&f!=='kaplica'){const [sd,,j]=q;(f==='kuznia'?rack:(f==='karczma'||f==='dom')?(r()<0.5?trophy:pots):pick([rack,pots,trophy]))(sd,j)}}
  for(let k=0;k<6;k++){const i=2+Math.floor(r()*(W-4)),j=2+Math.floor(r()*(D-5));if(free(i,j)&&free(i+1,j)&&free(i,j+1)&&f!=='kaplica'&&f!=='stajnia'){stool(X(i+0.5),Z(j+0.5));break}}
  if(f==='karczma')for(const [ti,tj] of [[2,5],[W-4,5],[2,8],[W-4,8]])for(const dx of [-0.5,0.45]){const x=X(ti+1)+dx,z=Z(tj+0.5)+(dx>0?-0.2:0.15);P(x,0.95,z,0.14,0.2,0.14,'#a8803a');P(x,1.06,z,0.12,0.03,0.12,'#f4efe4')}
  if(f==='sklep'){P(0.9,1.18,Z(4.5),0.5,0.06,0.3,'#c9a24a');P(0.9,1.4,Z(4.5),0.05,0.4,0.05,'#c9a24a');P(0.9,1.58,Z(4.5),0.7,0.04,0.04,'#c9a24a')}}
// --- lochy i jaskinie: pokoje + korytarze (loch) albo automat komórkowy (jaskinia) ---
// ===== arena z zewnątrz: okrągły amfiteatr z arkadami, bramą i chorągwiami =====
let ARENA_GEO=null;
function arenaExtList(){const L=[],P=(...b)=>L.push(b),R=9.2,S1='#8e8994',S2='#7d7884',S3='#a39ea8',DK='#2a2018';
  P(0,0.15,0,15.5,0.3,15.5,'#d8c08a');P(0,0.32,0,3,0.06,3,'#a8452c');
  for(let k=0;k<44;k++){const a=k/44*Math.PI*2,c=Math.cos(a),s=Math.sin(a);if(s>0.93)continue;const x=c*R,z=s*R;
    P(x,3.5,z,1.9,7,1.9,k%2?S1:S2);P(x,7.3,z,2.1,0.6,2.1,S3);if(k%2===0)P(c*(R+0.35),7.95,s*(R+0.35),0.75,0.7,0.75,S1);
    if(k%2===0){P(c*(R+0.86),1.5,s*(R+0.86),0.95,2.4,0.95,DK);P(c*(R+0.86),4.9,s*(R+0.86),0.8,1.5,0.8,DK);P(c*(R+0.9),2.85,s*(R+0.9),1.15,0.25,1.15,S3)}
    if(k%6===3){P(x,9.4,z,0.16,3.2,0.16,'#4a2f1d');P(x+c*0.5,10.3,z+s*0.5,0.9,1.1,0.9,k%12===3?'#a8352a':'#d9b23a')}
    P(c*(R-1.6),2.3,s*(R-1.6),1.6,1.2,1.6,'#86807a');P(c*(R-2.9),1.3,s*(R-2.9),1.4,1.0,1.4,'#9a948e');
    if(k%3)P(c*(R-1.6),3.2,s*(R-1.6),0.5,0.7,0.4,['#a8352a','#2f5f8f','#3f7a35','#d9b23a','#6a3a8a'][k%5])}
  for(const sx of [-1,1]){P(sx*2.7,4.8,9.2,2.6,9.6,2.6,S2);P(sx*2.7,9.9,9.2,3.0,0.6,3.0,S3);for(const dz of [-1,1])P(sx*2.7+dz*1.1,10.5,9.2+dz*1.1,0.7,0.7,0.7,S1);P(sx*2.7,11.6,9.2,0.16,2.6,0.16,'#4a2f1d');P(sx*2.7+0.5,12.2,9.2,0.9,1,0.1,'#a8352a');P(sx*1.95,5.4,10.55,0.85,0.95,0.12,'#a8352a');P(sx*1.95,5.4,10.62,0.4,0.45,0.06,'#d9b23a')}
  P(0,6.6,9.4,3.0,1.8,1.8,S1);P(0,7.7,9.4,3.6,0.4,2.0,S3);P(0,2.8,10.15,2.6,5.2,0.2,'#1a1410');for(let x=-1.1;x<=1.15;x+=0.45)P(x,3.2,10.3,0.12,4.4,0.12,'#3a3a40');P(0,5.1,10.3,2.6,0.14,0.14,'#3a3a40');
  P(0,0.06,11.5,3.4,0.12,3,'#8e8994');return L}
function arenaExtGeo(){return ARENA_GEO||(ARENA_GEO=boxes(arenaExtList()))}
// ===== ARENA w mieście: fale wrogów =====
ENTERABLE.arena='Arena';
function genArena(h,v){const key='ar:'+v.id;if(SPACES.has(key))return SPACES.get(key);const W=26,D=26,cs=2,cx=W/2,cz=D/2;
  const s={id:key,kind:'arena',cs,W,D,x0:Math.round(h.x)-W,z0:Math.round(h.z)-D,fy:900,ceil:12,solid:new Uint8Array(W*D),torches:[],rooms:[],npcs:[],v,built:false};
  for(let j=0;j<D;j++)for(let i=0;i<W;i++){const r=Math.hypot(i+0.5-cx,j+0.5-cz);if(r>11||i===0||j===0||i===W-1||j===D-1)s.solid[j*W+i]=1}
  const wx=i=>s.x0+i*cs,wz=j=>s.z0+j*cs;s.cx=wx(cx);s.cz=wz(cz);s.spawn=[s.cx,s.cz+18];s.exit=[s.cx,s.cz+20.5];s.gong=[s.cx+4.5,s.cz+18.5];
  const [dx,dz]=doorOf(h);s.out=[dx,dz];s.outY=h.top;
  for(let k=0;k<10;k++){const a=k/10*Math.PI*2+0.3;s.torches.push([s.cx+Math.cos(a)*20.5,s.fy+2.6,s.cz+Math.sin(a)*20.5])}
  s.braz=[];for(let k=0;k<4;k++){const a=k/4*Math.PI*2+Math.PI/4;const bx=s.cx+Math.cos(a)*15.5,bz=s.cz+Math.sin(a)*15.5;s.braz.push([bx,s.fy+1.3,bz]);const ii=Math.floor((bx-s.x0)/cs),jj=Math.floor((bz-s.z0)/cs);if(ii>=0&&jj>=0&&ii<W&&jj<D)s.solid[jj*W+ii]=1}
  SPACES.set(key,s);return s}
// widz areny: osadnik rasy królestwa (kolory skóry/włosów/strojów + cechy: uszy, kły, brody, pyski)
function crowdFig(P,r,R,x,y,z,fx,fz){const pk=a=>a[Math.floor(r()*a.length)],hs=(R.hs||1)*(0.92+r()*0.12),sk=pk(R.skin),hr=pk(R.hair),cl=pk(R.cloth),kid=r()<0.12?0.72:1,S=hs*kid,bh=0.8*S,hd=0.42*S;
  const ws=(R.ws||1);P(x,y+bh/2+0.15,z,0.55*ws*kid,bh,0.45*ws*kid,cl);if(r()<0.5)P(x,y+bh*0.62+0.15,z,0.57*ws*kid,0.1*S,0.47*ws*kid,pk(R.cloth));
  const hy=y+bh+0.15+hd/2;P(x,hy,z,hd,hd,hd,sk);const ox=fx*hd*0.5,oz=fz*hd*0.5,sx=-fz,sz=fx;
  if(R.lizard){P(x+ox*1.4,hy-hd*0.12,z+oz*1.4,hd*0.5,hd*0.42,hd*0.5,sk);P(x-ox*0.2,hy+hd*0.58,z-oz*0.2,hd*0.16,hd*0.3,hd*0.9,hr)}
  else{if(r()<0.85)P(x-ox*0.2,hy+hd*0.5,z-oz*0.2,hd*1.06,hd*0.18,hd*1.06,hr);if(R.beard&&(kid===1)&&r()<0.8)P(x+ox*1.02,hy-hd*0.45,z+oz*1.02,hd*0.8,hd*0.7,hd*0.3,hr)}
  if(R.ears)for(const g of [1,-1])P(x+sx*g*hd*0.62,hy+hd*0.18,z+sz*g*hd*0.62,hd*0.16+Math.abs(sx)*hd*0.22,hd*0.22,hd*0.16+Math.abs(sz)*hd*0.22,sk);
  if(R.tusks)for(const g of [1,-1])P(x+ox*1.05+sx*g*hd*0.22,hy-hd*0.28,z+oz*1.05+sz*g*hd*0.22,hd*0.1,hd*0.2,hd*0.1,'#efe8d0');
  if(r()<0.28){const up=r()<0.5;P(x+sx*0.36*ws,y+bh+(up?0.55:0.1),z+sz*0.36*ws,0.14,up?0.6:0.5,0.14,up?sk:cl);if(up&&r()<0.4)P(x+sx*0.36*ws,y+bh+0.98,z+sz*0.36*ws,0.04,0.5,0.32,pk(['#a8352a','#2f5f8f','#d9b23a',cl]))}}
function arenaGeo(s){const RC=RACES[(s.v&&s.v.race)||'ludzie']||RACES.ludzie,L=[],P=(...b)=>L.push(b),r=rngOf(s.id+'g'),cx=s.cx-(s.x0+s.W*s.cs/2),cz=s.cz-(s.z0+s.D*s.cs/2);
  P(0,-0.1,0,s.W*s.cs,0.2,s.D*s.cs,'#cbb07a');for(let k=0;k<70;k++){const a=r()*6.283,d=r()*19;P(cx+Math.cos(a)*d,0.02,cz+Math.sin(a)*d,1+r()*2,0.04,1+r()*2,r()<0.5?'#d8c08a':'#bfa26c')}
  P(cx,0.03,cz,6,0.06,6,'#a8452c');P(cx,0.05,cz,4,0.06,4,'#d9b23a');
  for(let k=0;k<64;k++){const a=k/64*Math.PI*2,x=cx+Math.cos(a)*22.6,z=cz+Math.sin(a)*22.6;P(x,1.6,z,2.4,3.2,2.4,k%2?'#8e8994':'#7d7884');if(k%8===0)P(x-Math.cos(a)*1.25,2,z-Math.sin(a)*1.25,0.1,2.2,1.6,k%16?'#a8352a':'#2f5f8f')}
  for(let t=0;t<5;t++){const R=24.5+t*1.8,hh=3.4+t*1.3;for(let k=0;k<72;k++){const a=k/72*Math.PI*2,x=cx+Math.cos(a)*R,z=cz+Math.sin(a)*R;if(Math.abs(x)>s.W*s.cs/2-1||Math.abs(z)>s.D*s.cs/2-1)continue;P(x,hh/2,z,2.2,hh,2.2,t%2?'#9a948e':'#86807a');
      if(r()<0.6)crowdFig(P,r,RC,x,hh,z,-Math.cos(a),-Math.sin(a))}}
  {const gx=s.gong[0]-(s.x0+s.W*s.cs/2),gz=s.gong[1]-(s.z0+s.D*s.cs/2);P(gx-1.1,1.4,gz,0.25,2.8,0.25,'#4a2f1d');P(gx+1.1,1.4,gz,0.25,2.8,0.25,'#4a2f1d');P(gx,2.8,gz,2.5,0.25,0.25,'#4a2f1d');P(gx,1.7,gz,1.7,1.7,0.18,'#d9b23a');P(gx,1.7,gz+0.1,1.0,1.0,0.1,'#b8892e')}
  for(const [x,y,z] of s.torches){const ax=x-(s.x0+s.W*s.cs/2),az=z-(s.z0+s.D*s.cs/2);P(ax,1.2,az,0.5,2.4,0.5,'#5d5a63');P(ax,2.5,az,0.9,0.3,0.9,'#3a3a40')}
  for(const [x,y,z] of (s.braz||[])){const ax=x-(s.x0+s.W*s.cs/2),az=z-(s.z0+s.D*s.cs/2);P(ax,0.35,az,0.9,0.7,0.9,'#4a4650');P(ax,0.8,az,0.35,0.5,0.35,'#3a3640');P(ax,1.15,az,1.3,0.25,1.3,'#2e2a30');P(ax,1.3,az,1.0,0.12,1.0,'#ff8a2a')}
  {const ex=s.exit[0]-(s.x0+s.W*s.cs/2),ez=s.exit[1]-(s.z0+s.D*s.cs/2);P(ex,1.8,ez+0.6,3.4,3.6,0.4,'#3a2a1a');P(ex,3.8,ez+0.6,4.4,0.6,0.6,'#7d7884')}
  return L}
const AR={s:null,on:false,wave:0,ids:[],t:0,best:LS.get('arenaBest',0)};
const AR_POOL=[['goblin','szkielet','bandyta','wilk','slime','dzik'],['ork','lucznik_s','upior','pajak','kultysta','wilkolak'],['troll','mroczny_rycerz','golem','lodowy_golem','mumia','zywiolak','bazyliszek','wiwerna']],AR_BOSS=['krol_troll','krol_s','lich','faraon','prastary'];
function arenaStart(s){if(AR.on)return toast('Walka już trwa!','#ff8a7a');if(!isAuth()){sendFx({k:'arstart',sid:s.id,vid:s.v&&s.v.id});toast('Gong! Walka się zaczyna…','#ffd27a');return}
  AR.s=s;AR.on=true;AR.wave=0;AR.t=3;AR.ids=[];AR.rew=0;sfx('thunder',0.4);sendFx({k:'armsg',txt:'Gong! Walka na arenie się zaczyna!'});toast('Gong! Walka na arenie się zaczyna!','#ffd27a')}
function arenaSpawn(s,w){const boss=w%5===0,n=Math.min(10,2+Math.floor(w*0.8)),lvl=Math.max(1,HERO.lvl-1)+Math.floor(w/2),tier=w<4?0:w<8?1:2,pool=AR_POOL[tier].filter(t=>EDEF[t]).concat(tier?AR_POOL[tier-1].filter(t=>EDEF[t]):[]);
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+Math.random(),d=9+Math.random()*7,x=s.cx+Math.cos(a)*d,z=s.cz-2+Math.sin(a)*d;const e=makeE(pick(pool),lvl,w>=4&&Math.random()<0.15,x,s.fy+0.05,z,{sid:'ar:'+s.id,home:[s.cx,s.cz],prov:60,evt:1});AR.ids.push(e.id)}
  if(boss){const t=AR_BOSS[(w/5-1)%AR_BOSS.length];if(EDEF[t]){const e=makeE(t,lvl,true,s.cx,s.fy+0.05,s.cz-8,{sid:'ar:'+s.id,home:[s.cx,s.cz],prov:60,evt:1});AR.ids.push(e.id)}}
  const txt=boss?`Fala ${w} — BOSS!`:`Fala ${w}`;toast(txt,'#ffd34d');sfx('roar',0.6);sendFx({k:'armsg',txt});AR.cur=w}
function arenaGive(w){const g=25*w;INV.gold+=g;try{gainXp(40*w)}catch(e){}let it=null;if(w%5===0)try{it=genItem(HERO.lvl+2,1);if(INV.bag.length<bagN())INV.bag.push(it);else it=null}catch(e){}
  saveInv();updHud();sfx('coin');toast(`Fala ${w} pokonana! +${g} zł`+(it?' · nagroda: '+it.name:''),'#7dd87d');if(w>AR.best){AR.best=w;LS.set('arenaBest',w);toast('Nowy rekord areny: '+w+' fal!','#ffd34d')}}
function arenaEnd(){if(!AR.on)return;AR.on=false;for(const id of AR.ids)if(enemies.has(id))removeEnemy(id);const w=Math.max(0,AR.wave-1);AR.ids=[];const txt='Koniec walki na arenie — fale: '+w+' (rekord: '+Math.max(AR.best,w)+')';toast(txt,'#d2c29e');sendFx({k:'armsg',txt})}
function arenaTick(dt){if(!AR.on||!isAuth())return;const s=AR.s,inA=p=>!p.dead&&p.p.y>s.fy-8&&p.p.y<s.fy+30&&p.p.x>=s.x0&&p.p.x<s.x0+s.W*s.cs&&p.p.z>=s.z0&&p.p.z<s.z0+s.D*s.cs;
  if(!playersList().some(inA)){AR.lost=(AR.lost||0)+dt;if(AR.lost>4)arenaEnd();return}AR.lost=0;
  const alive=AR.ids.some(id=>{const e=enemies.get(id);return e&&e.st!==2});
  if(!alive){if(AR.wave>0&&!AR.rew){AR.rew=1;if(SPC&&SPC.kind==='arena')arenaGive(AR.wave);sendFx({k:'arrew',w:AR.wave});AR.t=6}AR.t-=dt;if(AR.t<=0){AR.rew=0;AR.wave++;AR.ids=AR.ids.filter(id=>enemies.has(id));arenaSpawn(s,AR.wave)}}}
function arenaHud(){const el=document.getElementById('arenabar');if(!el)return;const s=SPC;if(!s||s.kind!=='arena'){el.hidden=true;return}el.hidden=false;let n=0;for(const e of enemies.values())if(e.st!==2&&!e.pas&&e.p.y>s.fy-8&&e.p.y<s.fy+30&&Math.hypot(e.p.x-s.cx,e.p.z-s.cz)<26)n++;
  el.innerHTML=(AR.on||n?`<b>ARENA</b> · Fala ${AR.cur||AR.wave||1} · wrogów: ${n}`:'<b>ARENA</b> · uderz w gong (<kbd>F</kbd>), aby rozpocząć')+` · rekord: ${AR.best}`}

function genDungeon(st,lvl){lvl=lvl||1;const key='dg:'+st.id+(lvl>1?':'+lvl:'');if(SPACES.has(key))return SPACES.get(key);const cave=st.type==='jaskinia',r=rngOf(key),W=cave?40:34,D=cave?40:34,cs=2;
  const s={id:key,lvl,maxL:cave?1:3,kind:cave?'cave':'dungeon',cs,W,D,x0:Math.round(st.x)-W,z0:Math.round(st.z)-D,fy:cave?600:640+(lvl-1)*30,ceil:cave?6:4.8,solid:new Uint8Array(W*D).fill(1),st,torches:[],rooms:[],npcs:[],built:false};
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
    free.sort((a,b)=>Math.hypot(a.cx-st0[0],a.cz-st0[1])-Math.hypot(b.cx-st0[0],b.cz-st0[1]));
    s.pool=new Set();for(const q of free.slice(-6).filter((_,k)=>k%3===1)){const stk=[[q.cx,q.cz]];let n=0;while(stk.length&&n<18){const [i,j]=stk.shift(),k=j*W+i;if(s.solid[k]||s.pool.has(k))continue;s.pool.add(k);n++;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])if(r()<0.8)stk.push([i+a,j+b])}}
    s.crys=[];for(let j=2;j<D-2;j++)for(let i=2;i<W-2;i++){const k=j*W+i;if(s.solid[k]||s.pool.has(k))continue;let wall=0;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])wall+=s.solid[(j+b)*W+i+a];if(wall&&r()<0.07)s.crys.push([i,j,Math.floor(r()*3),r()])}s.rooms=free.filter((_,k)=>k%2===0).slice(0,10);if(!s.rooms.length)s.rooms=[{cx:st0[0],cz:st0[1]-2,i:st0[0]-1,j:st0[1]-3,w:3,d:3}]}
  const R0=s.rooms[0],RL=s.rooms[s.rooms.length-1],cw=i=>s.x0+(i+0.5)*cs,cz=j=>s.z0+(j+0.5)*cs;
  s.spawn=cave?[cw(W>>1),cz(D-3)]:[cw(R0.cx),cz(R0.cz)];s.exit=s.spawn.slice();s.out=[st.x,st.z+(cave?6.5:4.6)];s.outY=null;s.outRy=0;s.chest=[cw(RL.cx),cz(RL.cz)];
  for(const q of s.rooms)if(q!==R0)s.torches.push([cw(q.cx),s.fy+2.4,cz(q.cz)]);
  if(!cave){dgPuzzle(s,r);if(lvl<s.maxL){s.down=s.chest;s.chest=null}}
  SPACES.set(key,s);return s}
// ===== lochy wielopoziomowe: dźwignie, krata, kolce =====
function dgPuzzle(s,r){const W=s.W,D=s.D,R=s.rooms;if(s.kind!=='dungeon'||R.length<4)return;const cs=s.cs,cw=i=>s.x0+(i+0.5)*cs,cz=j=>s.z0+(j+0.5)*cs,inRoom=(i,j)=>R.some(q=>i>=q.i&&i<q.i+q.w&&j>=q.j&&j<q.j+q.d);
  const RL=R[R.length-1];s.gate=[];for(let j=RL.j-1;j<=RL.j+RL.d;j++)for(let i=RL.i-1;i<=RL.i+RL.w;i++){const ring=i===RL.i-1||i===RL.i+RL.w||j===RL.j-1||j===RL.j+RL.d,corner=(i===RL.i-1||i===RL.i+RL.w)&&(j===RL.j-1||j===RL.j+RL.d);if(!ring||corner||i<1||j<1||i>=W-1||j>=D-1)continue;if(!s.solid[j*W+i]&&!inRoom(i,j))s.gate.push([i,j])}
  if(!s.gate.length){s.gate=null;return}for(const [i,j] of s.gate)s.solid[j*W+i]=1;
  const P=R[R.length-2],Q=R.length>=5?R[R.length-3]:P,far=Math.hypot(P.cx-Q.cx,P.cz-Q.cz)>14;
  s.levers=[[cw(P.i),cz(P.cz)],far||Q===P?[cw(P.i+P.w-1),cz(P.cz)]:[cw(Q.i+Q.w-1),cz(Q.cz)]];if(!far&&Q!==P)s.levers[1]=[cw(Q.i+Q.w-1),cz(Q.cz)];
  s.levT=[0,0];s.gateOpen=false;
  const cand=[];for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){if(s.solid[j*W+i]||inRoom(i,j))continue;if(Math.hypot(i-R[0].cx,j-R[0].cz)<5)continue;cand.push([i,j])}
  s.spikes=[];for(let k=0;k<6&&cand.length;k++){const t=cand.splice(Math.floor(r()*cand.length),1)[0];s.spikes.push([cw(t[0]),cz(t[1]),r()*2.4])}}
function dgBuildExtras(s,g){if(s.kind!=='dungeon')return;const ox=s.x0+s.W*s.cs/2,oz=s.z0+s.D*s.cs/2;
  if(s.gate){const L=[];for(const [i,j] of s.gate){const x=s.x0+(i+0.5)*s.cs-ox,z=s.z0+(j+0.5)*s.cs-oz;for(let k=-2;k<=2;k++){L.push([x+k*0.4,1.6,z,0.12,3.2,0.12,'#3a3a40'],[x,1.6,z+k*0.4,0.12,3.2,0.12,'#3a3a40'])}L.push([x,0.4,z,2,0.15,2,'#4a4a52'],[x,2.6,z,2,0.15,2,'#4a4a52'])}
    const m=new THREE.Mesh(boxes(L),decoMat);m.position.set(ox,s.fy,oz);g.add(m);s.gateM=m;if(s.gateOpen)m.position.y=s.fy+3.4}
  if(s.levers){s.levM=[];for(const [x,z] of s.levers){const grp=new THREE.Group();grp.position.set(x,s.fy,z);grp.add(new THREE.Mesh(boxes([[0,0.35,0,0.8,0.7,0.6,'#5d5a63'],[0,0.75,0,0.6,0.1,0.4,'#3a3a40']]),decoMat));const h=new THREE.Group();h.position.y=0.75;h.add(new THREE.Mesh(boxes([[0,0.45,0,0.12,0.9,0.12,'#6b4a2b'],[0,0.95,0,0.24,0.24,0.24,'#c8302a']]),decoMat));h.rotation.x=0.6;grp.add(h);const gl=new THREE.Mesh(boxes([[0,0.95,0,0.3,0.3,0.3,'#ffd34d']]),GLOWMAT);gl.visible=false;h.add(gl);g.add(grp);s.levM.push({h,gl})}}
  if(s.spikes){s.spM=[];for(const [x,z] of s.spikes){const base=new THREE.Mesh(boxes([[0,0.03,0,1.8,0.06,1.8,'#3a3a40']]),decoMat);base.position.set(x,s.fy,z);g.add(base);const L=[];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)L.push([a*0.55,0.35,b*0.55,0.14,0.7,0.14,'#c8ccd2'],[a*0.55,0.75,b*0.55,0.07,0.15,0.07,'#e8eef2']);const sp=new THREE.Mesh(boxes(L),decoMat);sp.position.set(x,s.fy-0.8,z);g.add(sp);s.spM.push(sp)}}}
function pullLever(s,k,remote){if(!s||!s.levers||s.gateOpen)return;s.levT[k]=performance.now();if(!remote){sendFx({k:'lever',sid:s.id,i:k});sfx('door',0.6)}if(s.levM&&s.levM[k]){s.levM[k].h.rotation.x=-0.6;s.levM[k].gl.visible=true}
  const o=s.levT[1-k];if(o&&performance.now()-o<8000){openGate(s,remote)}else if(!remote)toast('Dźwignia przestawiona! Druga dźwignia musi zostać pociągnięta w ciągu 8 sekund.','#ffd27a')}
function openGate(s,remote){if(s.gateOpen)return;s.gateOpen=true;for(const [i,j] of (s.gate||[]))s.solid[j*s.W+i]=0;sfx('thunder',0.25);toast('Krata się podnosi!','#7dd87d');if(!remote)sendFx({k:'gate',sid:s.id})}
function dgTick(s,dt){if(!s||s.kind!=='dungeon')return;const now=performance.now(),p=player.p;
  if(s.levers&&!s.gateOpen)s.levers.forEach((_,k)=>{if(s.levT[k]&&now-s.levT[k]>8000){s.levT[k]=0;if(s.levM&&s.levM[k]){s.levM[k].h.rotation.x=0.6;s.levM[k].gl.visible=false}}});
  if(s.gateM&&s.gateOpen&&s.gateM.position.y<s.fy+3.4)s.gateM.position.y=Math.min(s.fy+3.4,s.gateM.position.y+dt*1.5);
  if(s.spikes){const t=now/1000;s.spikes.forEach((q,k)=>{const ph=(t+q[2])%2.4,up=ph>1.4&&ph<2.2,m=s.spM&&s.spM[k];if(m){const ty=s.fy+(up?0:-0.8);m.position.y+=(ty-m.position.y)*Math.min(1,dt*(up?30:6))}
    if(up&&Math.abs(p.x-q[0])<1&&Math.abs(p.z-q[1])<1&&p.y<s.fy+0.6&&!P2.dead){P2.spkT=(P2.spkT||0)-dt;if(P2.spkT<=0){P2.spkT=0.8;try{takeDamage((18+4*(s.lvl||1))*(1-0.15*pk('ogien')),'kolce')}catch(e){}sfx('claw',0.7)}}})}}
function goDown(s){const nx=genDungeon(s.st,(s.lvl||1)+1);nx.up=s;enterSpace(nx);toast('Poziom '+nx.lvl+' lochu','#ffd27a')}
function goUp(){const s=SPC;if(!s||!s.up)return leaveSpace();const P=s.up;buildSpace(P);player.p.set(P.down[0]+1.6,P.fy+0.05,P.down[1]);player.v.set(0,0,0);camY=null;SPC=P;sfx('door');if(PET)PET.p.copy(player.p);for(const f of FOL)f.p.copy(player.p);setTimeout(()=>{if(SPC!==s)unbuildSpace(s)},1500)}

function dungeonGeo(s){const L=[],cs=s.cs,cave=s.kind==='cave',r=rngOf(s.id+'g'),W=s.W,D=s.D,P=(...b)=>L.push(b),lx=i=>(i+0.5)*cs-W*cs/2,lz=j=>(j+0.5)*cs-D*cs/2;
  const C1=cave?['#6a5a4a','#5a4a3c','#7a6a58','#4a3e34']:['#6f6a73','#5d5a63','#7d7884','#66636d'];
  P(0,-0.1,0,W*cs,0.2,D*cs,cave?'#4a3e34':'#5d5a63');P(0,s.ceil+0.4,0,W*cs,0.8,D*cs,cave?'#3a3028':'#4a4750');
  for(let j=0;j<D;j++)for(let i=0;i<W;i++){if(!s.solid[j*W+i])continue;let edge=false;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=i+a,y=j+b;if(x>=0&&y>=0&&x<W&&y<D&&!s.solid[y*W+x])edge=true}if(!edge)continue;
    const h=s.ceil+(cave?(r()-0.5)*0.6:0);P(lx(i),h/2,lz(j),cs,h,cs,C1[(i*7+j*3)%4]);if(cave&&r()<0.15)P(lx(i),0.3,lz(j),cs+0.3,0.6,cs+0.3,C1[3])}
  if(!cave)for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){if(s.solid[j*W+i])continue;if((i+j)%2)P(lx(i),0.02,lz(j),cs-0.1,0.04,cs-0.1,'#66636d');if(r()<0.03)P(lx(i)+0.3,0.12,lz(j)-0.2,0.5,0.14,0.16,'#e8e2cc')}
  else for(let j=1;j<D-1;j++)for(let i=1;i<W-1;i++){if(s.solid[j*W+i]||(s.pool&&s.pool.has(j*W+i)))continue;const t=r();if(t<0.05){const hh=0.6+r()*1.4;P(lx(i)+(r()-0.5),hh/2,lz(j)+(r()-0.5),0.4,hh,0.4,'#7a6a58')}else if(t<0.09){const hh=0.5+r()*1.2;P(lx(i),s.ceil-hh/2,lz(j),0.35,hh,0.35,'#6a5a4a')}else if(t<0.12)P(lx(i),0.25,lz(j),0.3,0.5,0.3,['#7fe3ff','#c87aff','#7dff8a'][Math.floor(r()*3)])}
  for(const [x,y,z] of s.torches){const ax=x-(s.x0+W*cs/2),az=z-(s.z0+D*cs/2);P(ax,1.4,az,0.16,2.6,0.16,'#4a2f1d');P(ax,2.75,az,0.36,0.3,0.36,'#3a3a40')}
  if(s.down){const ax=s.down[0]-(s.x0+W*cs/2),az=s.down[1]-(s.z0+D*cs/2);P(ax,0.02,az,3,0.04,3,'#1a1614');for(let k=0;k<4;k++)P(ax,-0.1-k*0.25,az-1+k*0.6,2.4,0.2,0.6,'#5d5a63');P(ax-1.6,0.6,az,0.3,1.2,3,'#7d7884');P(ax+1.6,0.6,az,0.3,1.2,3,'#7d7884')}
  // schody wyjścia
  {const ax=s.exit[0]-(s.x0+W*cs/2),az=s.exit[1]-(s.z0+D*cs/2);for(let k=0;k<4;k++)P(ax,0.15+k*0.3,az+0.6+k*0.5,2,0.3,0.6,'#8e8994')}
  return L}
function buildSpace(s){if(s.g)return;const g=new THREE.Group();let L=s.geoL;if(s.kind==='arena')L=arenaGeo(s);else if(s.kind!=='interior')L=dungeonGeo(s);
  const m=new THREE.Mesh(kitB(L),matB);m.position.set(s.x0+s.W*s.cs/2,s.fy,s.z0+s.D*s.cs/2);m.scale.setScalar(BS);m.receiveShadow=true;g.add(m);
  // płomienie (świecą bez światła)
  const FL=[];for(const [x,y,z] of s.torches)FL.push([x-(s.x0+s.W*s.cs/2),y-s.fy+(s.kind==='interior'?-0.2:0.45),z-(s.z0+s.D*s.cs/2),0.26,0.42,0.26,'#ffb030'],[x-(s.x0+s.W*s.cs/2),y-s.fy+(s.kind==='interior'?0.05:0.72),z-(s.z0+s.D*s.cs/2),0.14,0.22,0.14,'#fff2a0']);
  for(const [x,y,z] of (s.braz||[])){const ax=x-(s.x0+s.W*s.cs/2),az=z-(s.z0+s.D*s.cs/2),ay=y-s.fy;FL.push([ax,ay+0.35,az,0.8,0.6,0.8,'#ff7a1a'],[ax+0.1,ay+0.75,az-0.1,0.45,0.55,0.45,'#ffb030'],[ax-0.05,ay+1.05,az,0.22,0.35,0.22,'#fff2a0'])}
  if(FL.length){const fm=new THREE.Mesh(boxes(FL),new THREE.MeshBasicMaterial({vertexColors:true}));fm.position.set(s.x0+s.W*s.cs/2,s.fy,s.z0+s.D*s.cs/2);g.add(fm);s.flames=fm}
  if(s.kind==='cave'){const cx0=s.x0+s.W*s.cs/2,cz0=s.z0+s.D*s.cs/2,lx=i=>s.x0+(i+0.5)*s.cs-cx0,lz=j=>s.z0+(j+0.5)*s.cs-cz0,CC=[['#7fe3ff','#c8f6ff'],['#c87aff','#ecd0ff'],['#7dff8a','#d8ffd8']];
    if(s.crys&&s.crys.length){const CL=[];for(const [i,j,c,q] of s.crys){const [a,b]=CC[c],x=lx(i)+(q-0.5)*0.8,z=lz(j)+(q*7%1-0.5)*0.8,h=0.8+q*1.2;CL.push([x,h/2,z,0.32,h,0.32,a],[x+0.3,h*0.3,z+0.15,0.24,h*0.6,0.24,b],[x-0.25,h*0.25,z-0.2,0.22,h*0.5,0.22,a],[x,0.05,z,0.9,0.1,0.9,b])}
      const cm=new THREE.Mesh(boxes(CL),new THREE.MeshBasicMaterial({vertexColors:true}));cm.position.set(cx0,s.fy,cz0);g.add(cm)}
    if(s.pool&&s.pool.size){const PL=[];for(const k of s.pool){const i=k%s.W,j=Math.floor(k/s.W);PL.push([lx(i),0.14,lz(j),s.cs+0.02,0.06,s.cs+0.02,'#2d6a9a'])}const pm=new THREE.Mesh(boxes(PL),new THREE.MeshLambertMaterial({vertexColors:true,transparent:true,opacity:0.82,emissive:0x0a2a40}));pm.position.set(cx0,s.fy,cz0);g.add(pm)}}
  // NPC wnętrza
  s.live=[];const v=s.v;if(s.kind==='interior'&&v){const R=RACES[v.race];s.npcs.forEach((q,k)=>{if(q.horse){const hm=makeEnemy('kon',false);hm.position.set(q.x,s.fy,q.z);hm.rotation.y=q.ry;g.add(hm);s.live.push({horse:hm});return}
      const rr=rngOf(s.id+'n'+k),fem=rr()<0.4,pool=fem?R.f:R.m,n={id:s.id+':'+q.role+k,vid:v.id,role:q.role,fem,name:pool[Math.floor(rr()*pool.length)],roleN:q.roleN||(ROLE[q.role]||['Najemnik','Najemniczka'])[fem?1:0],x:q.x,z:q.z,ry:q.ry,skin:rpick(rr,R.skin),hair:rpick(rr,R.hair),cloth:rpick(rr,R.cloth),race:v.race,qg:false,inside:s.id};
      if(q.role==='najemnik')n.merc=mercOffer(n,v);if(q.role==='mieszk'||q.role==='wedr')n.wan={t:1+rr()*3,hx:q.x,hz:q.z};n.m=makeNpc(n);n.m.position.set(n.x,s.fy,n.z);n.m.rotation.y=n.ry;n.m.add(nameTag(n.name+' · '+n.roleN,q.role==='najemnik'?'#ff9d6b':q.role==='kupiec'?'#7dd87d':'#9fb6c8'));g.add(n.m);s.live.push(n)})}
  if(s.kind==='interior')for(const t of (s.pets||[])){if(!EDEF[t])continue;try{const pm=makeEnemy(t,false),x=s.x0+s.W/2+(Math.random()-0.5)*3,z=s.z0+s.D/2+(Math.random()-0.5)*2;pm.position.set(x,s.fy,z);g.add(pm);s.live.push({pet:pm,x,z,ry:0,t:2})}catch(_){}}
  try{dgBuildExtras(s,g)}catch(e){console.warn(e)}
  if(s.chest&&s.kind!=='interior'){const CM=chestModel(true),c=new THREE.Group(),base=new THREE.Mesh(boxes(CM[0]),decoMat),lid=new THREE.Group();lid.position.set(0,CM[2],-CM[3]/2);lid.add(new THREE.Mesh(boxes(CM[1]),decoMat));c.add(base,lid);c.position.set(s.chest[0],s.fy,s.chest[1]);g.add(c);s.lid=lid;if(W.opened[s.id])lid.rotation.x=-1.9}
  scene.add(g);s.g=g}
function unbuildSpace(s){if(!s.g)return;scene.remove(s.g);s.g.traverse(o=>{if(o.geometry&&o.geometry.userData&&!o.userData.keep&&o.geometry!==ringGeo)o.geometry.dispose()});s.g=null;s.live=null}
function enterSpace(s){buildSpace(s);s.backFrom=[player.p.x,player.p.y,player.p.z];player.p.set(s.spawn[0],s.fy+0.05,s.spawn[1]);player.v.set(0,0,0);camY=null;SPC=s;sfx('door');
  if(PET)PET.p.copy(player.p);for(const f of FOL)f.p.set(player.p.x+1,player.p.y,player.p.z+1);
  if(s.kind==='dungeon'||s.kind==='cave'){const def={id:s.id,type:s.kind==='cave'?'jaskinia':'loch',x:s.st.x,z:s.st.z,lvl:(s.st.lvl||1)+((s.lvl||1)-1)*2,b:s.st.b,space:1};if(isAuth())spawnStructGuards(def);else NET.tr&&NET.tr.send({t:'sspawn',from:NET.id,def})}
  toast(s.kind==='interior'?ENTERABLE[s.func]:s.kind==='arena'?'Arena — uderz w gong, by zacząć walkę':s.kind==='cave'?'Jaskinia':'Loch','#ffd27a')}
function leaveSpace(){const s=SPC;if(!s)return;const y=s.outY??(colAt(s.out[0],s.out[1])??player.p.y);player.p.set(s.out[0],y+0.1,s.out[1]);player.v.set(0,0,0);camY=null;SPC=null;sfx('door');if(PET)PET.p.copy(player.p);for(const f of FOL)f.p.copy(player.p);setTimeout(()=>{if(SPC!==s)unbuildSpace(s)},1500)}
let nearDoor=null;
function spaceTick(dt){
  nearDoor=null;const p=player.p;SPC=spaceIn(p);
  if(SPC){const s=SPC;if(Math.hypot(p.x-s.exit[0],p.z-s.exit[1])<1.6)nearDoor={exit:1};dgTick(s,dt);if(s.kind==='arena'&&s.gong&&Math.hypot(p.x-s.gong[0],p.z-s.gong[1])<2.4)nearDoor={arena:s};
    if(s.down&&Math.hypot(p.x-s.down[0],p.z-s.down[1])<2)nearDoor={down:s};if(s.levers&&!s.gateOpen)s.levers.forEach((q,k)=>{if(Math.hypot(p.x-q[0],p.z-q[1])<1.6)nearDoor={lever:k+1,s}});
    if(s.live)for(const n of s.live){if(n.horse){animEnemy(n.horse,0,dt,0,0,0);continue}
      if(n.pet||n.wan){const freeAt=(x,z)=>{const i=Math.floor((x-s.x0)/s.cs),j=Math.floor((z-s.z0)/s.cs);return i>0&&j>0&&i<s.W-1&&j<s.D-1&&!s.solid[j*s.W+i]};const W2=n.pet?n:n.wan;let sp=0;
        if(W2.t>0){W2.t-=dt}else if(W2.tx==null){for(let k=0;k<12;k++){const tx=s.x0+1.5+Math.random()*(s.W-3),tz=s.z0+1.5+Math.random()*(s.D-3.5);if(freeAt(tx,tz)&&(!n.wan||Math.hypot(tx-W2.hx,tz-W2.hz)<5)){W2.tx=tx;W2.tz=tz;break}}if(W2.tx==null)W2.t=2}
        else{const dx=W2.tx-n.x,dz=W2.tz-n.z,dd=Math.hypot(dx,dz),near=n.wan&&(dlg&&dlg.n===n||Math.hypot(p.x-n.x,p.z-n.z)<1.8);if(dd<0.3||near){if(dd<0.3){W2.tx=null;W2.t=2+Math.random()*(n.pet?5:6)}}else{sp=n.pet?1.1:0.9;const st=Math.min(dd,sp*dt),nx=n.x+dx/dd*st,nz=n.z+dz/dd*st;if(freeAt(nx,nz)){n.x=nx;n.z=nz}else{W2.tx=null;W2.t=1}n.ry=Math.atan2(dx,dz)}}
        if(n.pet){n.pet.position.set(n.x,s.fy,n.z);let dr=n.ry-n.pet.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));n.pet.rotation.y+=dr*Math.min(1,6*dt);animEnemy(n.pet,sp,dt,0,0,0);continue}
        n.m.position.x=n.x;n.m.position.z=n.z;const G=n.m.userData.g;if(G)animChar(G,sp>0?1.2:0,dt,false,false);if(sp>0){let dr=n.ry-n.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));n.m.rotation.y+=dr*Math.min(1,6*dt);continue}}const dx=p.x-n.x,dz=p.z-n.z,d=Math.hypot(dx,dz);const tr=d<5?Math.atan2(dx,dz):n.ry;let dr=tr-n.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));n.m.rotation.y+=dr*Math.min(1,5*dt);if(d<2.6&&(!nearNpc||d<Math.hypot(p.x-nearNpc.x,p.z-nearNpc.z)))nearNpc=n}
    if(s.heal&&P2.hp<ST.hp&&!P2.dead)P2.hp=Math.min(ST.hp,P2.hp+ST.hp*0.05*dt);
    if(s.lid&&(!W.opened[s.id]||chestLeft(s.id))&&Math.hypot(p.x-s.chest[0],p.z-s.chest[1])<2.2)nearDoor={chest:s};if(s.lid&&W.opened[s.id])s.lid.rotation.x+=(-1.9-s.lid.rotation.x)*Math.min(1,6*dt)}
  else{// drzwi budynków i wejścia do lochów
    for(const v of villages.values()){if(!v||!v.g||Math.abs(v.x-p.x)>90||Math.abs(v.z-p.z)>90)continue;for(const h of v.houses){if(!ENTERABLE[h.func]||h.farm||!h.core)continue;const [dx,dz]=doorOf(h);if(Math.hypot(p.x-dx,p.z-dz)<1.8&&Math.abs(p.y-h.top)<2.2){nearDoor={house:h,v};break}}if(nearDoor)break}
    if(!nearDoor)for(const st of structs.values()){if(!st||(st.type!=='loch'&&st.type!=='jaskinia'))continue;const ex=st.x,ez=st.z+(st.type==='jaskinia'?6.5:4.6);if(Math.hypot(p.x-ex,p.z-ez)<2.4){nearDoor={st};break}}}
  if(nearNpc&&nearNpc.inside&&!dlg){const pr=$('prompt');pr.hidden=false;pr.innerHTML='<kbd>F</kbd> Rozmowa: <b></b>';pr.querySelector('b').textContent=nearNpc.name+' ('+nearNpc.roleN+')'}
  if(nearDoor&&!nearNpc&&!dlg){const pr=$('prompt');pr.hidden=false;pr.innerHTML=nearDoor.arena?(AR.on?'Walka trwa…':'<kbd>F</kbd> Uderz w gong — rozpocznij walkę'):nearDoor.lever?'<kbd>F</kbd> Pociągnij dźwignię':nearDoor.down?'<kbd>F</kbd> Zejdź niżej (poziom '+((nearDoor.down.lvl||1)+1)+')':nearDoor.exit?(SPC&&SPC.up?'<kbd>F</kbd> Wejdź poziom wyżej':'<kbd>F</kbd> Wyjdź na zewnątrz'):nearDoor.chest?'<kbd>F</kbd> Otwórz skrzynię':nearDoor.st?'<kbd>F</kbd> '+(nearDoor.st.type==='jaskinia'?'Wejdź do jaskini':'Zejdź do lochu'):'<kbd>F</kbd> Wejdź: '+ENTERABLE[nearDoor.house.func]}
  // światła: latarnie graczy w slotach 0–3, pochodnie najbliżej gracza w 4–7
  const T=[];if(SPC&&SPC.torches)for(const t of SPC.torches)T.push(t);if(SPC&&SPC.braz)for(const t of SPC.braz)T.push([t[0],t[1]+0.15,t[2]]);if(!SPC)for(const h of (W.huts||[]))T.push([h.x+Math.sin(h.ry)*1.3,h.y+1.2,h.z+Math.cos(h.ry)*1.3]);for(const e of enemies.values())if(e.torch&&e.st!==2&&e.m)T.push([e.p.x,e.p.y+2.2,e.p.z]);
  T.sort((a,b)=>Math.hypot(a[0]-p.x,a[2]-p.z)-Math.hypot(b[0]-p.x,b[2]-p.z));const fl=1+Math.sin(performance.now()*0.017)*0.06;
  for(let k=0;k<4;k++){const U=SEAS_U.uLamp.value[4+k],t=T[k];if(t&&Math.hypot(t[0]-p.x,t[2]-p.z)<60){U.set(t[0],t[1],t[2],SPC&&SPC.kind==='interior'?9:11);SEAS_U.uLampI.value[4+k]=(SPC?1.05:0.9)*fl}else{U.w=0;SEAS_U.uLampI.value[4+k]=0}}
}
function useDoor(d){if(d.exit)return SPC&&SPC.up?goUp():leaveSpace();if(d.down){if(guardsAlive({id:d.down.id}))return toast('Najpierw pokonaj strażników tego poziomu','#ff8a7a');return goDown(d.down)}if(d.lever)return pullLever(d.s,d.lever-1);if(d.chest)return openSpaceChest(d.chest);if(d.st)return enterSpace(genDungeon(d.st));if(d.arena)return arenaStart(d.arena);if(d.house)return enterSpace(d.house.func==='arena'?genArena(d.house,d.v):genInterior(d.house,d.v))}
function openSpaceChest(s,remote){if(s.lvl>1&&!remote)toast('Skarb z '+s.lvl+'. poziomu lochu!','#ffd34d');if(!remote&&guardsAlive({id:s.id}))return toast('Najpierw pokonaj obrońców lochu','#ff8a7a');W.opened[s.id]=W.opened[s.id]||Date.now();if(!remote)sendFx({k:'wopen',id:s.id,at:W.opened[s.id],nm:S.name});sfx('open');const lv=(s.st.lvl||1)+2+((s.lvl||1)-1)*2;if(remote){INV.gold+=Math.round(lv*rnd(4,8)*2);INV.pot+=2;saveInv();updHud();return}W.chestLoot=W.chestLoot||{};if(!W.chestLoot[s.id]){const items=[];for(let i=0;i<3;i++)items.push(genItem(lv,20));W.chestLoot[s.id]={gold:Math.round(lv*rnd(4,8)*2),pot:2,food:0,items};gainXp(60*lv)}saveW();chestUiOpen(s.id,'Skarb lochu')}
function spaceSpawnList(def){const mm2=/^dg:(.+?)(?::(\d+))?$/.exec(def.id)||[0,def.id.slice(3)];const s=SPACES.get(def.id)||(def.type==='jaskinia'||def.type==='loch'?genDungeon({id:mm2[1],type:def.type,x:def.x,z:def.z,lvl:def.lvl,b:def.b},+mm2[2]||1):null);if(!s)return[];
  const cave=s.kind==='cave',out=[],R=s.rooms,mob=cave?['pajak','slime','ropucha','pajak','bazyliszek']:['szkielet','lucznik_s','szkielet','upior','mumia'],boss=cave?(def.b===6||def.b===5?'troll':'matka'):(strHash(s.id)%2?'lich':'krol_s');
  R.forEach((q,k)=>{if(k===0)return;const last=k===R.length-1,n=last?2:1+(k%2);for(let i=0;i<n;i++)out.push([mob[(k+i)%mob.length],s.x0+(q.cx+0.5+(i-0.5)*1.2)*s.cs,s.fy,s.z0+(q.cz+0.5)*s.cs,false]);if(last)out.push([(s.lvl||1)<(s.maxL||1)?mob[(k+2)%mob.length]:boss,s.x0+(q.cx+0.5)*s.cs,s.fy,s.z0+(q.cz-0.3)*s.cs,true])});
  {const free=(i,j)=>i>0&&j>0&&i<s.W-1&&j<s.D-1&&!s.solid[j*s.W+i];
   if(!out.length){let best=null,bd=-1;for(let j=1;j<s.D-1;j++)for(let i=1;i<s.W-1;i++)if(free(i,j)){const d=Math.hypot(s.x0+(i+0.5)*s.cs-s.spawn[0],s.z0+(j+0.5)*s.cs-s.spawn[1]);if(d>bd){bd=d;best=[i,j]}}if(best)for(let k=0;k<2;k++)out.push([mob[k],s.x0+(best[0]+0.5)*s.cs,s.fy,s.z0+(best[1]+0.5)*s.cs,false])}
   for(const o of out){const ci=Math.floor((o[1]-s.x0)/s.cs),cj=Math.floor((o[3]-s.z0)/s.cs);if(free(ci,cj))continue;let f=null;for(let r=1;r<6&&!f;r++)for(let dj=-r;dj<=r&&!f;dj++)for(let di=-r;di<=r;di++)if(Math.max(Math.abs(di),Math.abs(dj))===r&&free(ci+di,cj+dj)){f=[ci+di,cj+dj];break}if(f){o[1]=s.x0+(f[0]+0.5)*s.cs;o[3]=s.z0+(f[1]+0.5)*s.cs}}}
  return out}

// =================== TOWARZYSZE BRONI (najemnicy, maks. 2) ===================
const FOL=[];INV.fol=INV.fol||[];let folPick=null;const FOLSL=[['bron','Broń'],['tarcza','Tarcza'],['helm','Hełm'],['zbroja','Zbroja'],['rekawice','Rękawice'],['buty','Buty']];
const MERCW=['miecz','topor','wlocznia','buzdygan','luk','kusza','szabla','mlot'];
function mercOffer(n,v){const r=rngOf('merc'+n.id),lvl=Math.max(1,(v&&v.lvl||1)+Math.floor(r()*3)),w=MERCW[Math.floor(r()*MERCW.length)];
  return{lvl,w,price:Math.round(30+lvl*22),look:{fem:n.fem?1:0,skin:n.skin,hairC:n.hair,hair:n.fem?rpick(r,['dlugie','warkocze','kucyk']):rpick(r,['krotkie','krotkie','lysy','irokez']),beard:n.fem?'brak':rpick(r,['brak','zarost','krotka','dluga']),eyes:Math.floor(r()*5),tunic:n.cloth,pants:darker(n.cloth,0.6),boots:'#3a2a1a',cape:r()<0.5?1:0,capeC:rpick(r,['#7a2a2a','#2a4a6a','#3a5a3a'])},
    ex:{hat:rpick(r,['helm','kaptur',undefined]),armor:r()<0.6?rpick(r,['#8a8f94','#7a5030','#9aa0a6']):undefined,gloves:'#4a3020'},name:n.name,race:n.race}}
function hireMerc(n){const o=n.merc;if(!o)return;if(INV.fol.length>=2)return dlgShow('Masz już dwóch towarzyszy. Więcej z tobą nie pójdzie.',[bye]);if(INV.gold<o.price)return dlgShow(`Za ${o.price} złota pójdę z tobą choćby do piekła. Wróć, gdy uzbierasz.`,[bye]);
  INV.gold-=o.price;INV.fol.push({id:'f'+Date.now(),name:o.name,lvl:o.lvl,w:o.w,look:o.look,ex:o.ex,race:o.race});n.merc=null;saveInv();updHud();spawnFols();sfx('recruit');toast(o.name+' dołącza do drużyny!','#ffd34d');
  dlgShow('Umowa stoi. Prowadź, a ja będę pilnować twoich pleców.',[bye])}
function spawnFols(){for(const f of FOL)scene.remove(f.m);FOL.length=0;INV.fol.forEach((d,i)=>{d.eq=d.eq||{};const ex={...(d.ex||{})};const RR=RACES[d.race]||{};if(d.eq.helm&&!RR.nohelm)ex.hat='helm';if(RR.nohelm&&ex.hat==='helm')ex.hat=undefined;if(RR.lizard&&d.look){d.look.hair='lysy';d.look.beard='brak'}if(RR.ears)ex.ears=1;if(d.eq.zbroja)ex.armor=['#8a8f94','#9aa0a6','#7a8a9a','#8a6ab0','#c9a24a'][d.eq.zbroja.rar||0];if(d.eq.rekawice)ex.gloves='#5a4a3a';const m=makeChar(d.look,ex);m.userData.herb=S.herb;m.userData.skinC=d.look&&d.look.skin;try{applyGear(m,RR.nohelm?Object.assign({},d.eq,{helm:undefined}):d.eq)}catch(_){}try{raceDeco(m,d.race);if(RR.hs&&RR.hs!==1)m.scale.set(RR.ws,RR.hs,RR.ws)}catch(_){}const wi=d.eq.bron;if(wi)setWeapon(m,wi.base,wi.rar||0,wi.var,wi.lk,wi.sd);else setWeapon(m,d.w,Math.min(4,Math.floor(d.lvl/8)));m.add(nameTag(d.name+' · poz. '+d.lvl,'#ffd34d'));scene.add(m);
  FOL.push({d,m,p:new THREE.Vector3(player.p.x+1+i,player.p.y,player.p.z+1),ry:0,cd:0,atk:0,atkD:0.4,combo:0,i,speed:0,shotT:0})})}
function dismissFol(i){const d=INV.fol[i];if(!d)return;for(const k in (d.eq||{}))if(d.eq[k])INV.bag.push(d.eq[k]);INV.fol.splice(i,1);saveInv();spawnFols();toast(d.name+' odchodzi.','#cfe8ff')}
function remoteFols(r,c,dt){r.fols=r.fols||new Map();const seen=new Set();
  for(const q of (c.fo||[])){const id=q[5];seen.add(id);let o=r.fols.get(id);if(!o){const d=(c.fl||[]).find(x=>x[0]===id);if(!d)continue;const mm=makeChar(d[1],d[2]);setWeapon(mm,q[4],0);mm.add(nameTag(d[3],'#ffd34d'));scene.add(mm);o={m:mm,ph:0};r.fols.set(id,o)}
    const ox=o.m.position.x,oz=o.m.position.z;o.m.position.x+=(q[0]-ox)*Math.min(1,10*dt);o.m.position.y+=(q[1]-o.m.position.y)*Math.min(1,10*dt);o.m.position.z+=(q[2]-oz)*Math.min(1,10*dt);o.m.rotation.y=q[3];
    o.m.visible=q[7]!==0;if(q[6]){o.ph+=dt*3;animCombat(o.m,'melee',0,(o.ph%1))}else animChar(o.m,Math.hypot(o.m.position.x-ox,o.m.position.z-oz)/Math.max(dt,1e-3),dt,false,false)}
  for(const [id,o] of r.fols)if(!seen.has(id)){scene.remove(o.m);r.fols.delete(id)}}
function folTick(dt){
  if(custOn||(SPC&&SPC.func==='garderoba')){for(const f of FOL){f.m.visible=false;f.cust=1}return}for(const f of FOL)if(f.cust){f.cust=0;f.p.set(player.p.x+1.5,player.p.y,player.p.z+1.5);if(!(f.d.deadUntil>Date.now()))f.m.visible=true}
  compSeparate();
  for(const f of FOL){const d=f.d,ox=f.p.x,oz=f.p.z,bow=d.w==='luk'||d.w==='kusza';f.cd-=dt;if(f.max==null){f.max=folMaxHp(d);f.hp=f.max}
    if(d.deadUntil>Date.now()){f.m.visible=false;continue}if(!f.m.visible){f.m.visible=true;f.hp=f.max;f.p.set(player.p.x+1.5,player.p.y,player.p.z+1.5);if(d.deadUntil){d.deadUntil=0;saveInv();toast(d.name+' wraca do drużyny!','#ffd34d')}}
    if(f.hp<f.max&&nowS()-(f.hurtT||0)>6)f.hp=Math.min(f.max,f.hp+f.max*0.03*dt);
    let tg=null,td=1e9;const myC='c:'+d.id;for(const e of enemies.values()){if(e.st===2||!((e.hurtP&&nowS()-e.hurtP<15)||(f.lastAtk===e.id&&nowS()-(f.lastAtkT||0)<15)))continue;const de=Math.hypot(e.p.x-f.p.x,e.p.z-f.p.z);if(de<22&&de<td&&Math.abs(e.p.y-f.p.y)<6){td=de;tg=e}}
    let tx,tz,spd;const side=f.i?-1:1,a=player.ry+Math.PI+side*1.15;
    if(tg&&!P2.dead){const rng=bow?14:2.0;if((bow?td:eDist(tg,f.p.x,f.p.z))>rng){tx=tg.p.x;tz=tg.p.z;spd=6.5}else{tx=f.p.x;tz=f.p.z;spd=0;f.ry=Math.atan2(tg.p.x-f.p.x,tg.p.z-f.p.z);
        if(f.cd<=0){f.cd=bow?1.6:1.1;f.atk=f.atkD;f.combo=(f.combo+1)%3;f.tg=tg;f.hitDone=false}}}
    else{tx=player.p.x+Math.sin(a)*3.1;tz=player.p.z+Math.cos(a)*3.1;spd=Math.min(9,Math.hypot(tx-f.p.x,tz-f.p.z)*2)}
    const dx=tx-f.p.x,dz=tz-f.p.z,dd=Math.hypot(dx,dz);
    if(dd>45||Math.abs(player.p.y-f.p.y)>30){f.p.set(player.p.x-1,player.p.y,player.p.z-1)}else if(dd>0.35&&spd>0){const st=Math.min(dd,spd*dt);const nx=f.p.x+dx/dd*st,nz=f.p.z+dz/dd*st,h=colAt(nx,nz,f.p.y),vb=!SPC&&VOX.size&&voxProbe(nx,nz,f.p.y,0.3,1.6).block;if(vb){const sx=voxProbe(nx,f.p.z,f.p.y,0.3,1.6).block,sz=voxProbe(f.p.x,nz,f.p.y,0.3,1.6).block;if(!sx)f.p.x=nx;else if(!sz)f.p.z=nz}else if(h!==null&&h-f.p.y<1.2){f.p.x=nx;f.p.z=nz}else{f.p.x+=dx/dd*st*0.3}f.ry=Math.atan2(dx,dz)}
    if(!SPC&&VH.mode!==4){try{villageCollide(f.p);structCollide(f.p)}catch(_){}}
    const h=colAt(f.p.x,f.p.z,f.p.y);if(h!==null)f.p.y+=(Math.max(h,wlAt(f.p.x,f.p.z)-1.3)-f.p.y)*Math.min(1,12*dt);
    if(f.atk>0){f.atk-=dt;const k=1-f.atk/f.atkD;if(bow){animCombat(f.m,'bow',0,Math.min(0.99,k*1.1));if(!f.hitDone&&k>0.85&&f.tg){f.hitDone=true;const e=f.tg,o=[f.p.x,f.p.y+1.35,f.p.z],ddx=e.p.x-o[0],ddy=e.p.y+0.9-o[1],ddz=e.p.z-o[2],l=Math.hypot(ddx,ddy,ddz)||1;spawnProj('arrow',o,[ddx/l,ddy/l+0.04,ddz/l],true,folDmg(d),{src:d.id});sendFx({k:'proj',kind:'arrow',o,d:[ddx/l,ddy/l+0.04,ddz/l],sm:1});sfx('bow',0.6)}}
      else{animCombat(f.m,weaponKind(d.w)==='dagger'?'dagger':'melee',f.combo,k);if(!f.hitDone&&k>0.42&&f.tg&&f.tg.st!==2){f.hitDone=true;const e=f.tg,ex=e.p.x-f.p.x,ez=e.p.z-f.p.z,l=Math.hypot(ex,ez)||1;if(eDist(e,f.p.x,f.p.z)<2.8){HIT_SRC=d.id;dealHit(e,folDmg(d)*rnd(0.9,1.1),Math.random()<0.08,ex/l,ez/l);HIT_SRC=null}sfx('swing',0.6)}}}
    f.speed=Math.hypot(f.p.x-ox,f.p.z-oz)/Math.max(dt,1e-3);
    f.m.position.copy(f.p);let dr=f.ry-f.m.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));f.m.rotation.y+=dr*Math.min(1,10*dt);
    if(f.atk<=0)animChar(f.m,Math.min(f.speed,9),dt,false,f.p.y<wlAt(f.p.x,f.p.z)-1.2)}
}
const folDmg=d=>{const it=d.eq&&d.eq.bron;if(it&&it.dmg!=null)return it.dmg*(1+0.1*(it.up||0))*(1+0.06*(d.lvl-1))*0.9;return(WEAP[d.w].dmg*(1+0.13*(d.lvl-1)))*(1+0.04*(HERO.lvl-1))*0.8};
// =================== BANDY WROGÓW WĘDRUJĄCE PO MAPIE (z pochodniami) ===================
const BANDS=new Map();let bandSeq=1;
function spawnBand(pp){const a=Math.random()*6.283,d=rnd(60,90),x=pp.p.x+Math.cos(a)*d,z=pp.p.z+Math.sin(a)*d,h=colAt(x,z),b=biomeAt(x,z);if(h===null||h<WATER||inVillage(x,z,60))return;
  const night=hour<6||hour>19.5,kinds=night&&Math.random()<0.5?['szkielet','lucznik_s','szkielet','upior']:b===4||b===8?['ork','ork','bandyta','ork']:b===6||b===5||b===12?['troll','ork','ork']:b===3||b===9||b===10?['goblin','goblin','szaman','goblin']:['bandyta','bandyta','bandyta','szaman','bandyta'];
  const n=4+Math.floor(Math.random()*4),id=bandSeq++,sp=spawnPt(),lvl=Math.max(1,1+Math.floor(Math.hypot(x-sp[0],z-sp[2])/260));const B={id,tx:x,tz:z,t:0,mem:[]};BANDS.set(id,B);
  for(let i=0;i<n;i++){const xx=x+rnd(-3,3),zz=z+rnd(-3,3),hh=colAt(xx,zz);if(hh===null)continue;const t=kinds[i%kinds.length],e=makeE(t,lvl,i===0&&Math.random()<0.5,xx,hh,zz,{band:id,torch:HUM[t]&&(i%2===0||night),bo:[(i%3-1)*1.8,-Math.floor(i/3)*1.8-(i?1.4:0)]});B.mem.push(e.id)}}
function bandMove(e,dt){const B=BANDS.get(e.band);if(!B)return null;const lead=enemies.get(B.mem.find(id=>{const q=enemies.get(id);return q&&q.st!==2}));if(!lead){BANDS.delete(e.band);return null}
  if(lead===e&&B.raid){B.tx=B.raid[0]+Math.cos(worldT*0.25+B.id)*6;B.tz=B.raid[1]+Math.sin(worldT*0.25+B.id)*6;const dx=B.tx-e.p.x,dz=B.tz-e.p.z,l=Math.hypot(dx,dz)||1;e.ry=Math.atan2(dx,dz);return l<1.5?[0,0,0]:[dx/l,dz/l,0.7]}
  if(lead===e){B.t-=dt;const d=Math.hypot(B.tx-e.p.x,B.tz-e.p.z);if(d<3||B.t<=0){const a=Math.random()*6.283,r=rnd(50,110);let nx=e.p.x+Math.cos(a)*r,nz=e.p.z+Math.sin(a)*r;if(inVillage(nx,nz,40)){nx=e.p.x-Math.cos(a)*r;nz=e.p.z-Math.sin(a)*r}B.tx=nx;B.tz=nz;B.t=40}
    const dx=B.tx-e.p.x,dz=B.tz-e.p.z,l=Math.hypot(dx,dz)||1;e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,0.42]}
  const c=Math.cos(lead.ry),s=Math.sin(lead.ry),ox=e.bo[0]*c+e.bo[1]*s,oz=-e.bo[0]*s+e.bo[1]*c,tx=lead.p.x+ox,tz=lead.p.z+oz,dx=tx-e.p.x,dz=tz-e.p.z,l=Math.hypot(dx,dz);
  if(l<0.4)return[0,0,0];e.ry=Math.atan2(dx,dz);return[dx/l,dz/l,Math.min(0.75,0.3+l*0.12)]}
function torchModel(m){const u=m.userData;if(!u.ch||u.torchM)return;const t=new THREE.Group();t.add(new THREE.Mesh(boxes([[0,-0.3,0.25,0.07,0.07,0.75,'#4a2f1d'],[0,-0.3,0.65,0.13,0.13,0.14,'#3a3a40']]),decoMat));
  const fl=new THREE.Mesh(boxes([[0,-0.3,0.78,0.2,0.2,0.24,'#ff8a2e'],[0,-0.3,0.9,0.12,0.12,0.16,'#ffe08a']]),new THREE.MeshBasicMaterial({vertexColors:true}));t.add(fl);
  const gs=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));gs.scale.set(1.3,1.3,1);gs.position.set(0,-0.3,0.85);t.add(gs);
  t.rotation.x=-0.9;u.ch.userData.le.add(t);u.torchM=t;u.flame=fl}

// =================== MIASTA, DROGI, RUCH NA DROGACH ===================
Object.assign(HT,{kamienica:[kamienicaGen,2,2,2,5,48,64],podcienia:[podcieniaGen,3,3,3,5,64,64],rez:[rezGen,2,2,16,24,96,96]});
const CITYN={niziolki:['Wielki Pagórek','Miodowa Dolina','Zielony Gród','Jabłoniec','Słoneczna Kotlina'],drowy:['Menzoberran','Zhaerith','Velkyndar','Ilphukiir','Shar\'Nethra'],saurianie:['Tlaxkoatl','Ssirakhar','Ixtlapan','Quetzhaal','Zhar-Tlan'],ludzie:['Złotogród','Mirogród','Białogród','Wilkogród','Dębogród','Srebrnogród','Lwigród'],elfy:['Aelthalor','Silvaneth','Lithmiriel','Caelandor'],krasnoludy:['Żelazna Twierdza','Kamienny Gród','Głębia Brokka','Miedziany Szczyt'],orkowie:['Gor-Mazgul','Ugrathak','Krag-Morok','Dhu-Zagash']};
const CR=1300;
function setupCity(c){
  const r=rngOf('city'+c.id),Hs=c.Hs;c.name=rpick(r,CITYN[c.race]);c.lvl=villLvl(c);c.houses=[];c.yards=[];
  const types=['kamienica','kamienica','kupiec','dom','podcienia','wiezaDom','karczma','dom','chalupa'];
  const castleQ=[r()<0.5?1:-1,r()<0.5?1:-1];
  for(const sx of [-1,1])for(const sz of [-1,1]){
    const castle=sx===castleQ[0]&&sz===castleQ[1];
    if(castle){const px=sx*37,pz=sz*37;c.houses.push({x:c.x+px,z:c.z+pz,rot:sz>0?Math.PI:0,top:c.h,bot:c.h-1,type:'rez',v:Math.floor(r()*2),castle:1})}
    const PP=[8.5,18.5,31.5,41.5,54.5,64.5],SL=[0,25].concat(48<Hs-7?[48]:[],[Hs-3.5]);
    for(let i=0;i<PP.length;i++)for(let j=0;j<PP.length;j++){const px=sx*PP[i],pz=sz*PP[j];
      if(Math.abs(px)+4.6>Hs-6.5||Math.abs(pz)+4.6>Hs-6.5)continue;if(Math.abs(px)<15&&Math.abs(pz)<15)continue;
      if(castle&&Math.abs(px)>=28&&Math.abs(px)<=46&&Math.abs(pz)>=28&&Math.abs(pz)<=46)continue;
      if(i+j>1&&r()<0.15){c.yards.push([c.x+px,c.z+pz]);continue}
      let best=1e9,rot=0;for(const l of SL){const dx=Math.abs(Math.abs(px)-l),dz=Math.abs(Math.abs(pz)-l);if(dx<best){best=dx;rot=(Math.abs(px)>l?-Math.sign(px):Math.sign(px))*Math.PI/2}if(dz<best){best=dz;rot=(Math.abs(pz)>l?(pz>0?Math.PI:0):(pz>0?0:Math.PI))}}
      const fn=rpick(r,['dom','dom','dom','dom','kuznia','piekarnia','warsztat','spichlerz','sklep','karczma','dom','kaplica']);c.houses.push({x:c.x+px,z:c.z+pz,rot,top:c.h,bot:c.h-1,type:CFTYPE[fn](r),func:fn,city:1,v:Math.floor(r()*5)})}}
  if(c.gen===2){const all=[[-1,-1],[1,-1],[-1,1],[1,1]],Q={},qn=(a,b)=>a+','+b;Q[qn(castleQ[0],castleQ[1])]='zamek';
    if(c.port!=null){const ps=[[0,-1],[0,1],[-1,0],[1,0]][c.port];const cand=all.filter(([a,b])=>(ps[0]&&a===ps[0])||(ps[1]&&b===ps[1])).filter(q=>!Q[qn(q[0],q[1])]);if(cand.length)Q[qn(cand[0][0],cand[0][1])]='port'}
    for(const q of all){if(Q[qn(q[0],q[1])])continue;Q[qn(q[0],q[1])]=(q[0]===-castleQ[0]&&q[1]===-castleQ[1]&&!Object.values(Q).includes('rynek'))?'rynek':(!Object.values(Q).includes('slumsy')?'slumsy':!Object.values(Q).includes('rynek')?'rynek':'rzem')}
    const DT0=0;const DT={zamek:[['kamienica','dom'],['wiezaDom','dom'],['kamienica','kaplica'],['podcienia','dom']],rynek:[['kupiec','sklep'],['podcienia','sklep'],['karczma','karczma'],['kamienica','dom'],['podcienia','dom']],port:[['chata','spichlerz'],['chalupa','warsztat'],['kupiec','sklep'],['chata','spichlerz']],slumsy:[['chata','dom'],['chalupa','dom'],['chata','dom']],rzem:[['chalupa','kuznia'],['dom','warsztat'],['chalupa','piekarnia'],['kamienica','dom']]};
    for(const h of c.houses){if(h.castle)continue;const d=Q[qn(Math.sign(h.x-c.x)||1,Math.sign(h.z-c.z)||1)];const p=rpick(r,DT[d]);h.type=p[0];h.func=p[1];h.dist=d}
    c.districts=all.map(([a,b])=>({sx:a,sz:b,k:Q[qn(a,b)],n:DNAME[Q[qn(a,b)]],x:c.x+a*Hs*0.5,z:c.z+b*Hs*0.5}));
    if(c.port!=null){const ps=[[0,-1],[0,1],[-1,0],[1,0]][c.port];c.pier={a:[c.x+ps[0]*(Hs+2),c.z+ps[1]*(Hs+2)],b:[c.x+ps[0]*((c.portD||Hs+24)+8),c.z+ps[1]*((c.portD||Hs+24)+8)],y:WATER+1.35,w:2.0}}}
  {const cand=c.houses.filter(h=>!h.castle&&(h.dist==='rynek'||!h.dist)&&Math.abs(h.x-c.x)<Hs-14&&Math.abs(h.z-c.z)<Hs-14);const ah=cand.length?cand[Math.floor(r()*cand.length)]:null;if(ah){ah.func='arena';ah.type='kupiec';ah.arena=1;c.houses=c.houses.filter(q=>q===ah||q.castle||Math.hypot(q.x-ah.x,q.z-ah.z)>13.5);c.yards=(c.yards||[]).filter(y=>Math.hypot(y[0]-ah.x,y[1]-ah.z)>13.5)}c._ah=ah}
  for(const h of c.houses){const k=h.arena?{w:19,d:19,ox:0,oz:0,front:9.5,pw:21,pd:21}:houseCore(h);h.core=k;h.cx=h.x+k.ox*Math.cos(h.rot)+k.oz*Math.sin(h.rot);h.cz=h.z-k.ox*Math.sin(h.rot)+k.oz*Math.cos(h.rot)}
  // mury: odcinki z przerwą na bramę, wieże narożne i bramne
  const W=[],T=9,th=2.4;
  for(const side of [0,1,2,3]){const ax=side<2,sg=side%2?1:-1;
    for(const [a0,a1] of [[-Hs,-3.6],[3.6,Hs]]){const len=a1-a0,mid=(a0+a1)/2;W.push(ax?[mid,sg*Hs,len,th,T]:[sg*Hs,mid,th,len,T])}}
  c.walls=W.map(([x,z,w,d,hgt])=>[c.x+x,c.z+z,w/2,d/2,c.h+hgt]);
  c.towers=[[-Hs,-Hs],[Hs,-Hs],[-Hs,Hs],[Hs,Hs]].map(([x,z])=>[c.x+x,c.z+z,3.6,3.6,c.h+16]).concat([[0,-Hs],[0,Hs],[-Hs,0],[Hs,0]].flatMap(([x,z])=>x===0?[[c.x-5.4,c.z+z,2.2,2.2,c.h+13.5],[c.x+5.4,c.z+z,2.2,2.2,c.h+13.5]]:[[c.x+x,c.z-5.4,2.2,2.2,c.h+13.5],[c.x+x,c.z+5.4,2.2,2.2,c.h+13.5]]));
  c.cols=c.walls.concat(c.towers);
  c.npcs=genCityNpcs(c);addFarms(c);
}
// targ na rynku miasta: 8 kramów na pierścieniu placu (z dala od dróg), sprzedawca za ladą twarzą do środka
const MKT_A=[0.55,1.02,2.12,2.59,3.69,4.16,5.26,5.73],MKT_R=11.5;
function mktSlot(c,i){const a=MKT_A[i],x=c.x+Math.cos(a)*MKT_R,z=c.z+Math.sin(a)*MKT_R;return[x,z,Math.atan2(c.x-x,c.z-z)]}
function stallBoxes(n){const AW={owoce:'#3f8a4a',sukno:'#3f6fa8',ziola:'#6a8a3a',garnki:'#a8452f'}[n.mk]||(n.rare?'#7a3a8a':'#c0503a'),L=[[0,0.5,0,2.4,1.0,1.0,'#8f5a2a'],[0,1.02,0,2.5,0.06,1.1,'#6b4528'],[1.1,1.4,-0.4,0.12,1.8,0.12,'#4a2f1d'],[-1.1,1.4,-0.4,0.12,1.8,0.12,'#4a2f1d'],[1.1,1.25,0.45,0.1,1.5,0.1,'#4a2f1d'],[-1.1,1.25,0.45,0.1,1.5,0.1,'#4a2f1d'],[0,2.3,0,2.8,0.12,1.6,AW+'~'],[0,2.2,0.8,2.8,0.22,0.04,'#efe6d0'],[0,0.25,-0.9,1.0,0.5,0.6,'#7a5030']];
  const G={owoce:[['#d84a3a',-0.8],['#f0b030',-0.3],['#86c060',0.2],['#9a4ac0',0.7]],sukno:[['#a8452f',-0.75],['#3f6fa8',-0.25],['#e8d8a8',0.25],['#5a8a3a',0.75]],ziola:[['#5a9a3e',-0.7],['#8ac060',-0.2],['#c8a8e0',0.3],['#d8c050',0.75]],garnki:[['#b8683a',-0.7],['#8a5a3a',-0.15],['#c87a4a',0.4],['#e0d0b0',0.8]]}[n.mk];
  if(G)G.forEach(([c,x],i)=>{if(n.mk==='sukno')L.push([x,1.12,0,0.42,0.16,0.7,c],[x,1.26,0,0.4,0.12,0.66,darker(c,1.12)]);else if(n.mk==='garnki')L.push([x,1.25,0,0.3,0.42,0.3,c],[x,1.48,0,0.18,0.06,0.18,darker(c,0.85)]);else{L.push([x,1.1,0.1,0.42,0.14,0.42,'#a87a4a']);for(let k=0;k<3;k++)L.push([x+(k-1)*0.11,1.22,0.1+(k%2)*0.08,0.12,0.12,0.12,c])}
    if(n.mk==='ziola')L.push([x,1.75,-0.35,0.08,0.4,0.08,c])});
  else L.push([-0.6,1.1,0,0.4,0.2,0.4,'#d8b24a'],[0.5,1.1,0,0.5,0.25,0.4,'#86c060'],[0.05,1.12,0.25,0.3,0.12,0.25,'#e8e2cc']);
  return L}
function genCityNpcs(c){
  const R=RACES[c.race],r=rngOf('cnpc'+c.id),list=[],pool={m:R.m.slice(),f:R.f.slice()};
  const take=fem=>{let f=fem;if(!pool[f?'f':'m'].length)f=!f;if(!pool[f?'f':'m'].length){pool.m=R.m.slice();pool.f=R.f.slice()}const p=pool[f?'f':'m'];return[f,p.splice(Math.floor(r()*p.length),1)[0]]};
  const add=(role,x,z,ry,roleN)=>{const [fem,name]=take(r()<0.45);list.push({id:c.id+':'+role+list.length,vid:c.id,role,fem,name,roleN:roleN||ROLE[role][fem?1:0],x,z,ry,skin:rpick(r,R.skin),hair:rpick(r,R.hair),cloth:rpick(r,R.cloth),race:c.race})};
  const S=i=>mktSlot(c,i);add('starszy',c.x+3,c.z+2,r()*6,'Burmistrz');add('kupiec',...S(0));add('kupiec',...S(4));add('kowal',...S(2));
  const hs=c.houses.filter(h=>!h.castle);for(let i=0;i<16&&i<hs.length;i++){const h=hs[Math.floor(r()*hs.length)],k=h.core,f=k.pd/2+2.6,lat=(k.ox+3.6)*(r()<0.5?1:-1);add('mieszk',h.x+Math.sin(h.rot)*f+Math.cos(h.rot)*lat,h.z+Math.cos(h.rot)*f-Math.sin(h.rot)*lat,h.rot)}
  const Hs=c.Hs-3.5;add('straz',c.x+2.5,c.z-Hs,Math.PI);add('straz',c.x-2.5,c.z+Hs,0);add('straz',c.x-Hs,c.z+2.5,Math.PI/2);add('straz',c.x+Hs,c.z-2.5,-Math.PI/2);
  if(r()<0.6)add('wedr',c.x+(r()-0.5)*16,c.z+(r()-0.5)*16,r()*6);
  if(c.pier){const ps=[[0,-1],[0,1],[-1,0],[1,0]][c.port],d=c.Hs-6.5;add('portowy',c.x+ps[0]*d+(ps[1]?4.5:0),c.z+ps[1]*d+(ps[0]?4.5:0),Math.atan2(ps[0],ps[1]))}
  add('najemnik',c.x+10.5,c.z+2.2,-Math.PI/2);add('najemnik',c.x-2.2,c.z-10.5,0);
  {const MK=[['owoce','Przekupka owocami','Przekupień owoców'],['sukno','Handlarka suknem','Handlarz suknem'],['ziola','Zielarka','Zielarz'],['garnki','Garncarka','Garncarz']];[1,3,5,7].forEach((si,k)=>{const [x,z,ry]=S(si);add('kupiec',x,z,ry);const n=list[list.length-1];n.mk=MK[k][0];n.roleN=MK[k][n.fem?1:2];n.qg=false})}
  assignQG(list);for(const n of list)if(n.role==='najemnik')n.merc=mercOffer(n,c);return list;
}
// ===== mury w stylu ras (elfy / krasnoludy / orkowie) — te same odcinki, wieże i bramy co u ludzi (kolizje bez zmian) =====
function raceCityWall(c){const race=c.race,L=[],P=(x,y,z,w,h,d,col)=>L.push([x,y,z,w,h,d,col]),Hs=c.Hs,r=rngOf('rcw'+c.id);
  const seg=fn=>{for(const [x,z,hw,hd,top] of c.walls){const lx=x-c.x,lz=z-c.z,H=top-c.h,long=hw>hd,len=(long?hw:hd)*2,th=(long?hd:hw)*2,out=long?Math.sign(lz):Math.sign(lx);fn((a,y,o,la,h,w,col)=>long?P(lx+a,y,lz+o*out,la,h,w,col):P(lx+o*out,y,lz+a,w,h,la,col),H,len,th)}};
  const gates=fn=>{for(const [x,z,ax] of [[0,-Hs,1],[0,Hs,1],[-Hs,0,0],[Hs,0,0]]){const out=ax?Math.sign(z):Math.sign(x);fn((a,y,o,la,h,w,col)=>ax?P(x+a,y,z+o*out,la,h,w,col):P(x+o*out,y,z+a,w,h,la,col))}};
  const towers=fn=>{for(const [x,z,hw,hd,top] of c.towers)fn(x-c.x,z-c.z,hw,top-c.h,hw>3)};
  if(race==='elfy'){const ST='#ece8e0',ST2='#d8d2c6',ST3='#f4f0e8',GD='#c8a85a',TR=['#6a5032','#7a6040','#5a4428'],LF=['#3f8a4a','#4a9a50','#5aa858','#367a3e','#6cb860'],GL='#a8f0ff',FL=['#f0a8c8','#fff4e0','#c8a8f0'];
    seg((A,H,len,th)=>{A(0,0.3,0,len,0.6,th+1.2,ST2);
      // smukłe arkady: filary + łuki, ażurowe prześwity wypełnione pnączami
      const n=Math.max(2,Math.round(len/3.2)),s=len/n;for(let i=0;i<=n;i++){const a=-len/2+i*s;A(a,H/2,0,0.8,H,th*0.7,ST);A(a,0.9,0,1.1,0.6,th*0.85,ST2);A(a,H*0.62,0,1.0,0.3,th*0.8,GD)}
      for(let i=0;i<n;i++){const a=-len/2+(i+0.5)*s;A(a,H*0.25,0,s-0.8,H*0.5,th*0.45,ST3);
        for(let k=0;k<4;k++){const q=(k+0.5)/4,ya=H*0.62+Math.sin(q*Math.PI)*1.1;A(a-s/2+0.4+q*(s-0.8),ya,0,(s-0.8)/4+0.05,0.5,th*0.7,ST)}
        A(a,H*0.84,0,s,H*0.32,th*0.7,ST);A(a,H*0.62+0.2,th*0.36,s-1,0.15,0.05,'#3a7a3a');
        for(let k=0;k<3;k++){const vx=a-s/2+0.6+r()*(s-1.2),vy=H*0.5+r()*H*0.3,vl=1.2+r()*1.8;A(vx,vy-vl/2,th*0.36,0.16,vl,0.1,'#4a8a3a');A(vx,vy-vl*r(),th*0.38,0.3,0.3,0.1,FL[k%3])}}
      // łagodny daszek z liści zamiast blanków
      A(0,H+0.15,0,len+0.4,0.35,th*0.95,GD);for(let a=-len/2;a<len/2;a+=1.2){A(a+0.6,H+0.55+((Math.round(a*3))%2)*0.12,0,1.3,0.45,th*1.05,LF[Math.abs(Math.round(a*7))%5]);if(Math.abs(Math.round(a*5))%4===0)A(a+0.6,H+1.0,0,0.7,0.5,0.7,LF[4])}
      for(let a=-len/2+3;a<len/2-2;a+=6){A(a,H-1.6,th*0.45,0.12,1.2,0.12,TR[0]);A(a,H-2.4,th*0.5,0.36,0.5,0.36,GL)}});
    towers((lx,lz,hw,H,big)=>{const s=hw*1.5;P(lx,0.4,lz,s+1.6,0.8,s+1.6,ST2);
      for(let y=0.8,k=0;y<H;y+=1.2,k++){const w2=s*(1-0.12*y/H);P(lx,y+0.6,lz,w2,1.2,w2,k%5===4?GD:ST)}
      for(const [ax,az] of [[1,1],[1,-1],[-1,1],[-1,-1]]){for(let y=0.8,k=0;y<H*0.9;y+=1.3,k++)P(lx+ax*s*0.5+Math.sin(k)*0.1,y+0.65,lz+az*s*0.5,0.5,1.3,0.5,TR[k%3])}
      for(const y of [H*0.4,H*0.7]){P(lx,y,lz+s*0.48,0.5,1.2,0.1,GL);P(lx+s*0.48,y,lz,0.1,1.2,0.5,GL);P(lx,y,lz-s*0.48,0.5,1.2,0.1,GL);P(lx-s*0.48,y,lz,0.1,1.2,0.5,GL)}
      P(lx,H+0.2,lz,s+1.4,0.4,s+1.4,GD);for(let a=0;a<12;a++){const an=a/12*Math.PI*2;P(lx+Math.cos(an)*(s/2+0.5),H+0.8,lz+Math.sin(an)*(s/2+0.5),0.25,1,0.25,ST)}
      let yy=H+1.3;const n=big?9:7;for(let i=0;i<n;i++){const w2=(s+1.8)*(1-i/n)+0.3;P(lx,yy+0.4,lz,w2,0.8,w2,LF[i%5]);if(i%2===0)P(lx,yy+0.15,lz,w2+0.5,0.3,w2+0.5,LF[3]);yy+=0.8}
      P(lx,yy+0.6,lz,0.5,1.2,0.5,GL);P(lx,yy+1.4,lz,0.25,0.5,0.25,'#ffffff');P(lx,H+1.0,lz,0.3,0.3,0.3,GL)});
    gates(G=>{// brama jako dwa splecione drzewa tworzące łuk
      for(const sg of [-1,1]){for(let y=0,k=0;y<9;y+=1,k++){const lean=Math.pow(y/9,2)*2.2;G(sg*(3.8-lean),y+0.5,0,1.3,1.05,1.5,TR[k%3])}G(sg*4.4,0.4,0.6,1.4,0.6,0.6,TR[2]);G(sg*4.6,0.4,-0.7,1,0.5,0.6,TR[2])}
      G(0,9.6,0,4.2,1,1.4,TR[1]);for(let i=0;i<14;i++){const a=(r()-0.5)*9,y=9+r()*2.8,o=(r()-0.5)*2.4;G(a,y,o,1.6+r(),1.0,1.6+r(),LF[i%5])}
      for(let i=0;i<6;i++)G(-2.5+i,8.6-Math.abs(i-2.5)*0.4,0.75,0.16,1.2,0.1,'#4a8a3a'),G(-2.5+i,8.0-Math.abs(i-2.5)*0.4,0.8,0.3,0.3,0.1,FL[i%3]);
      for(const sg of [-1,1]){G(sg*2.4,7.2,0.9,0.1,1.2,0.1,TR[0]);G(sg*2.4,6.4,0.9,0.4,0.5,0.4,GL)}G(0,10.5,0.85,0.9,0.9,0.12,GL)});
    P(0,0.3,0,5,0.6,5,ST2);P(0,0.75,0,4.4,0.3,4.4,ST);P(0,0.82,0,3.8,0.08,3.8,'#5aa8c8');for(let k=0;k<3;k++)P(0,1.4+k*0.9,0,0.9-k*0.2,0.9,0.9-k*0.2,ST3);P(0,4.3,0,0.6,0.9,0.6,GL);
    for(const [x,z] of [[-7,-7],[7,7],[-7,7],[7,-7]]){P(x,0.35,z,2.6,0.7,2.6,ST2);for(let k=0;k<6;k++)P(x-0.9+(k%3)*0.9,0.9,z-0.4+Math.floor(k/3)*0.8,0.6,0.5,0.6,k%2?LF[k%5]:FL[k%3]);P(x,1.6,z,0.2,2,0.2,TR[0]);P(x,2.8,z,1.4,1.0,1.4,LF[1])}}
  else if(race==='krasnoludy'){const S=['#76716e','#6a6670','#827c78','#5f5b63'],SD='#4a4750',DK='#34323a',GD='#d9b23a',RN='#ff9a3e',IR='#3a3a40',CU='#5a9a7a',RD='#8a2a22';
    seg((A,H,len,th)=>{const T=th+1.2;A(0,0.5,0.3,len,1.6,T+1.4,DK);A(0,1.6,0.2,len,0.6,T+0.8,SD);
      // ciosy kamienne w przesuniętych rzędach (lico zewnętrzne)
      for(let y=1.9,row=0;y<H-0.6;y+=1.1,row++){let a=-len/2+(row%2?0.9:0);while(a<len/2-0.1){const l=Math.min(len/2-a,1.4+((Math.round(a*3)+row)%3)*0.5);A(a+l/2,y+0.5,T/2-0.15,l-0.08,1.0,0.5,S[(Math.round(a*7)+row)%4]);a+=l}}
      A(0,H/2+0.8,0,len,H-1.6,T-0.4,S[1]);A(0,H*0.55,T/2+0.12,len,0.35,0.15,GD);
      for(let a=-len/2+2;a<len/2-1;a+=4){A(a,H*0.55,T/2+0.22,0.5,0.5,0.1,RD)}
      // runy świecące co kilka metrów
      for(let a=-len/2+4;a<len/2-3;a+=8){A(a,H*0.32,T/2+0.13,0.12,1.4,0.06,RN);A(a-0.3,H*0.32+0.4,T/2+0.13,0.6,0.12,0.06,RN);A(a+0.25,H*0.32-0.3,T/2+0.13,0.4,0.12,0.06,RN)}
      // masywne przypory schodkowe
      for(let a=-len/2+3;a<len/2-2;a+=5.5){A(a,2.2,T/2+0.9,1.6,4.4,1.8,S[2]);A(a,5,T/2+0.55,1.3,1.4,1.1,S[0]);A(a,6.2,T/2+0.3,1.0,1,0.6,SD)}
      // płaskie, prostokątne blanki krasnoludów + gzyms
      A(0,H-0.6,0.2,len+0.2,0.6,T+0.6,SD);A(0,H-0.15,0.25,len+0.3,0.3,T+0.8,S[2]);
      const nb=Math.max(2,Math.floor(len/2.2));for(let i=0;i<nb;i++){const a=-len/2+(i+0.5)*len/nb;A(a,H+0.6,T/2,len/nb*0.62,1.2,0.8,S[i%4]);A(a,H+1.25,T/2,len/nb*0.7,0.15,0.9,SD)}
      A(0,H+0.3,-T/2+0.3,len,0.6,0.6,S[3])});
    towers((lx,lz,hw,H,big)=>{const s=hw*2+0.8;P(lx,0.6,lz,s+2,1.2,s+2,DK);P(lx,1.5,lz,s+1.2,0.6,s+1.2,SD);
      for(let y=1.8,k=0;y<H-0.5;y+=1.1,k++)P(lx,y+0.55,lz,s+(k%2?0:0.12),1.1,s+(k%2?0.12:0),S[k%4]);
      for(const y of [H*0.35,H*0.7])P(lx,y,lz,s+0.4,0.4,s+0.4,GD);
      for(const [ax,az] of [[1,0],[-1,0],[0,1],[0,-1]]){const y=H*0.52;if(ax){P(lx+ax*(s/2+0.03),y,lz,0.06,1.6,0.9,IR);for(const q of [-0.3,0,0.3])P(lx+ax*(s/2+0.08),y,lz+q,0.06,1.6,0.08,IR)}else{P(lx,y,lz+az*(s/2+0.03),0.9,1.6,0.06,IR)}P(lx+ax*(s/2+0.06),H*0.2,lz+az*(s/2+0.06),ax?0.06:0.6,0.6,ax?0.6:0.06,RN)}
      P(lx,H+0.2,lz,s+1.4,0.6,s+1.4,SD);const m=big?5:3,st=(s+1.4)/(m*2-1);for(let i=0;i<m*2-1;i+=2){const o=-(s+1.4)/2+(i+0.5)*st;for(const sg of [-1,1]){P(lx+o,H+1.1,lz+sg*((s+1.4)/2-0.4),st,1.3,0.8,S[i%4]);P(lx+sg*((s+1.4)/2-0.4),H+1.1,lz+o,0.8,1.3,st,S[(i+1)%4])}}
      // kosz ognia na szczycie i miedziana kopułka
      P(lx,H+0.8,lz,1.6,0.8,1.6,IR);P(lx,H+1.4,lz,1.2,0.6,1.2,RN);if(big){P(lx,H+2.4,lz,0.2,1.2,0.2,CU);P(lx,H+3.2,lz,2.2,0.4,2.2,CU);P(lx,H+3.6,lz,1.2,0.4,1.2,CU);P(lx,H+4.1,lz,0.4,0.6,0.4,GD)}});
    gates(G=>{// brama w kształcie kamiennej twarzy przodka z okutymi wrotami
      G(0,8.4,0.3,8.4,4,4.2,S[0]);G(0,6.5,0.4,8.6,0.5,4.4,SD);for(const sg of [-1,1]){G(sg*3.3,5,0.3,1.6,3,3.8,S[2]);G(sg*2.7,6.1,0.3,0.9,0.8,3.8,S[1])}
      G(0,9.2,2.45,5.4,2.6,0.3,S[2]);G(-1.2,9.7,2.62,1.1,0.6,0.1,DK);G(1.2,9.7,2.62,1.1,0.6,0.1,DK);G(-1.2,9.7,2.66,0.4,0.3,0.06,RN);G(1.2,9.7,2.66,0.4,0.3,0.06,RN);G(0,9.0,2.7,0.6,1.0,0.3,S[3]);
      for(let i=-2;i<=2;i++)G(i*0.55,7.6-Math.abs(i)*0.12,2.62,0.5,1.4-Math.abs(i)*0.2,0.2,'#bab4ac');G(0,10.7,2.62,5.8,0.5,0.25,GD);
      for(let i=0;i<5;i++)G(-3.6+i*1.8,10.9,1.9,1.2,1.0,0.8,S[i%4]);
      for(const sg of [-1,1]){G(sg*3.3,2.7,2.1,0.5,5.2,1.6,'#4a2f1d');for(const y of [1,2.6,4.2])G(sg*3.3,y,2.1,0.58,0.3,1.64,IR);G(sg*4.8,1,2.6,1.2,2,1.2,DK);G(sg*4.8,2.2,2.6,1.6,0.4,1.6,IR);G(sg*4.8,2.7,2.6,1,0.6,1,RN)}});
    P(0,0.4,0,5,0.8,5,S[0]);P(0,0.9,0,4,0.2,4,SD);P(0,1.6,0,1.2,1.4,1.2,DK);P(0,2.5,0,2,0.4,2,IR);P(0,2.9,0,1.2,0.5,1.2,RN);
    for(const [x,z] of [[-7,-7],[7,7],[-7,7],[7,-7]]){P(x,0.6,z,2.4,1.2,1.4,S[2]);P(x,1.3,z,2.6,0.2,1.6,SD);P(x-0.6,1.55,z,0.6,0.3,0.6,GD);P(x+0.5,1.55,z,0.7,0.3,0.4,IR);P(x,1.6,z+0.3,0.4,0.4,0.4,CU)}}
  else if(race==='orkowie'){const LG=['#5a3a22','#4a2f1d','#6a4428','#553620'],BK='#3a2414',HD=['#8a6a4a','#7a5a3a','#9a7650','#6e5236'],BN='#e8e0c8',RD='#a8302a',FI='#ff8a2e',IR='#4a4448';
    seg((A,H,len,th)=>{A(0,0.15,0,len+0.5,0.3,th+1.5,'#5a4630');
      // palisada z zaostrzonych pali o nierównej wysokości
      for(let a=-len/2+0.45;a<len/2;a+=0.9){const k=Math.round(a*11),hh=H-0.5+((k*7)%5)*0.35,lean=((k*3)%3-1)*0.06;A(a,hh/2,lean,0.85,hh,0.85,LG[Math.abs(k)%4]);A(a,hh+0.25,lean,0.55,0.5,0.55,LG[Math.abs(k+1)%4]);A(a,hh+0.65,lean,0.25,0.4,0.25,'#9a7a5a')}
      for(const y of [H*0.28,H*0.72])A(0,y,0.47,len,0.3,0.12,BK);
      // ukośne kolce przed palisadą i pomost od środka
      for(let a=-len/2+1;a<len/2-0.5;a+=1.6){A(a,0.9,1.2,0.3,0.3,1.8,LG[1]);A(a,1.25,2.1,0.18,0.2,0.6,'#9a7a5a')}
      A(0,H-2.2,-1.1,len,0.25,1.3,HD[3]);for(let a=-len/2+1;a<len/2;a+=3)A(a,(H-2.2)/2,-1.6,0.35,H-2.2,0.35,BK);
      // czaszki na palach, skóry i czerwone tarcze
      for(let a=-len/2+2.5;a<len/2-1;a+=5){const k=Math.round(a);A(a,H+1.0,0,0.7,0.6,0.7,BN);A(a-0.17,H+1.05,0.36,0.18,0.16,0.04,'#141414');A(a+0.17,H+1.05,0.36,0.18,0.16,0.04,'#141414');
        if(k%3===0){A(a+1.6,H*0.55,0.5,1.4,1.2,0.12,RD);A(a+1.6,H*0.55,0.58,0.4,0.4,0.06,BN)}else{A(a+1.4,H*0.5,0.5,1.6,1.8,0.08,HD[k&3])}}});
    towers((lx,lz,hw,H,big)=>{const s=hw*1.8,TH=H+(big?1:0);
      for(const [ax,az] of [[1,1],[1,-1],[-1,1],[-1,-1]])P(lx+ax*s/2,TH/2,lz+az*s/2,0.7,TH,0.7,LG[(ax+az+2)%4]);
      for(const y of [TH*0.3,TH*0.6]){P(lx,y,lz+s/2,s,0.25,0.25,BK);P(lx,y,lz-s/2,s,0.25,0.25,BK);P(lx+s/2,y,lz,0.25,0.25,s,BK);P(lx-s/2,y,lz,0.25,0.25,s,BK)}
      for(const sg of [-1,1]){for(let k=0;k<6;k++){const y=TH*0.05+k*TH*0.1;P(lx+sg*s/2,y+0.4,lz-s/2+k*s/6+0.4,0.15,0.15,s/3,BK)}}
      P(lx,TH,lz,s+1.2,0.4,s+1.2,HD[3]);for(let a=-s/2-0.4;a<=s/2+0.5;a+=0.8){for(const sg of [-1,1]){P(lx+a,TH+0.9,lz+sg*(s/2+0.5),0.6,1.4+(Math.round(a*5)%2)*0.3,0.6,LG[Math.abs(Math.round(a*3))%4]);P(lx+sg*(s/2+0.5),TH+0.9,lz+a,0.6,1.4,0.6,LG[Math.abs(Math.round(a*7))%4])}}
      for(const [ax,az] of [[1,1],[1,-1],[-1,1],[-1,-1]])P(lx+ax*s/2,TH+2.4,lz+az*s/2,0.3,2.8,0.3,BK);
      for(let i=0;i<3;i++){const w2=s+1.4-i*1.2;P(lx,TH+3.6+i*0.6,lz,w2,0.6,w2,HD[i%4])}P(lx,TH+5.6,lz,0.3,1.6,0.3,BK);P(lx,TH+6.6,lz,0.9,0.8,0.9,BN);P(lx-0.7,TH+6.9,lz,0.6,0.3,0.3,BN);P(lx+0.7,TH+6.9,lz,0.6,0.3,0.3,BN);
      P(lx+0.5,TH+5.9,lz,0.06,1.2,0.8,RD);if(big){P(lx,TH+0.9,lz,1,0.5,1,IR);P(lx,TH+1.3,lz,0.7,0.4,0.7,FI)}});
    gates(G=>{// brama z wielkich bali z kłami i czaszką
      for(const sg of [-1,1]){for(const o of [-0.6,0.6])G(sg*4.1,6,o,1.3,12,1.3,LG[(o>0?1:0)+(sg>0?2:0)]);G(sg*4.1,12.4,0,1.0,0.8,1.0,'#9a7a5a')}
      G(0,10.4,0,10,1.3,1.6,LG[0]);G(0,11.6,0,9,0.8,1.2,LG[2]);for(let i=-3;i<=3;i++)G(i*1.3,12.4+(i%2?0:0.5),0,0.6,1,0.6,LG[Math.abs(i)%4]);
      for(let k=0;k<5;k++){for(const sg of [-1,1])G(sg*(3.2-k*0.35),9.9-k*0.85,1.0,0.5,0.9,0.5,BN)}
      G(0,10.6,1.0,1.8,1.6,1.2,BN);G(-0.4,10.8,1.62,0.4,0.36,0.06,'#141414');G(0.4,10.8,1.62,0.4,0.36,0.06,'#141414');G(-1.5,11.3,1.0,1.2,0.4,0.4,BN);G(1.5,11.3,1.0,1.2,0.4,0.4,BN);G(-2.1,11.8,1.0,0.4,0.8,0.4,BN);G(2.1,11.8,1.0,0.4,0.8,0.4,BN);
      for(const sg of [-1,1]){G(sg*3.25,2.7,2.1,0.6,5.4,1.6,LG[3]);G(sg*3.25,1.4,2.1,0.66,0.25,1.66,BK);G(sg*3.25,4.0,2.1,0.66,0.25,1.66,BK);G(sg*5.6,1.6,1.8,0.3,3.2,0.3,BK);G(sg*5.6,3.4,1.8,0.6,0.6,0.6,FI);G(sg*5.4,6,1.2,1.4,2.6,0.08,RD)}});
    for(let k=0;k<8;k++){const a=k/8*Math.PI*2;P(Math.cos(a)*1.8,0.35,Math.sin(a)*1.8,0.9,0.7,0.9,'#6a6670')}P(0,0.4,0,2.2,0.6,2.2,FI);P(0,1.6,0,0.25,2.4,0.25,BK);for(const sg of [-1,1])P(sg*1.6,1.6,0,0.2,3.2,0.2,BK);P(0,2.9,0,3.4,0.2,0.2,BK);
    for(const [x,z] of [[-7,-7],[7,7],[-7,7],[7,-7]]){for(let k=0;k<4;k++)P(x,0.6+k*1.1,z,0.9,1.1,0.9,k===2?RD:LG[k%4]);P(x,4.8,z,1,0.9,1,BN);P(x-0.25,4.9,z+0.52,0.22,0.2,0.04,'#141414');P(x+0.25,4.9,z+0.52,0.22,0.2,0.04,'#141414');P(x-0.9,4.4,z,0.8,0.3,0.3,BN);P(x+0.9,4.4,z,0.8,0.3,0.3,BN);P(x+1.4,0.4,z,1.6,0.8,1.2,HD[1])}}
  else return null;const g=kitB(L);g.userData.raced=1;return g}
// mury i wieże w skali domów z kitu (×BS), kolorami palet: kamień, ciemny kamień, dachówka, drewno — shader sam dorysowuje faktury
function kitB(list){return voxGeo(deZ(vb(list).map(b=>[b[0]/BS,b[1]/BS,b[2]/BS,b[3]/BS,b[4]/BS,b[5]/BS,b[6]]),.12),.06)}
function kingBanners(c){const H=vHerb(c),L=[],WDD='#4a2f1d',G='#c9a24a';if(!c.walls)return L;
  for(const [x,z,hw,hd,top] of c.walls){const lx=x-c.x,lz=z-c.z,Hh=top-c.h,long=hw>hd,len=(long?hw:hd)*2,th=(long?hd:hw)*2,out=long?Math.sign(lz):Math.sign(lx),o=th/2+0.5;
    for(let i=1;i<Math.floor(len/14);i++){const a=-len/2+i*14,bx=long?lx+a:lx+o*out,bz=long?lz+o*out:lz+a,ax=long?'z':(out>0?'x':'x-'),A=(u,y,w,h,d,col)=>L.push(long?[bx+u,y,bz,w,h,d,col]:[bx,y,bz+u,d,h,w,col]);
      A(0,Hh-1.2,3.9,0.26,0.26,WDD);A(0,Hh-1.2,4.2,0.1,0.1,G);A(2.1,Hh-1.2,0.22,0.34,0.34,G);A(-2.1,Hh-1.2,0.22,0.34,0.34,G);
      for(const q of herbBoxes(H,ax,bx,Hh-3.6,bz,3.4,4.5,0.08))L.push(q);const c1=HTIN[H.c1][1];
      A(-0.95,Hh-6.3,1.3,1.0,0.08,c1);A(0.95,Hh-6.3,1.3,1.0,0.08,c1);A(0,Hh-1.4,3.5,0.14,0.1,G)}}
  return L}
function cityWallGeo(c){
  if(RBASE[c.race]){const g0=cityWallGeo(Object.assign({},c,{race:RBASE[c.race]}));let g=g0;try{g=recolorShare(g0,RREC[c.race])}catch(_){}g.userData=g.userData||{};g.userData.raced=1;return g}
  if(c.race&&c.race!=='ludzie'){try{const g=raceCityWall(c);if(g)return g}catch(e){console.warn('mur rasy',e)}}
  const L=[],S='#8e8994',S2='#9a95a0',SD='#6f6a73',SDD='#5d5a63',RF=['#a8452c','#93391f'],RG='#6a2a1a',WD='#7a5030',WDD='#4a2f1d',SL='#2b2633',MOSS='#5b8f3a';
  const Hs=c.Hs,P=(x,y,z,w,h,d,col)=>L.push([x,y,z,w,h,d,col]);
  // odcinki muru
  for(const [x,z,hw,hd,top] of c.walls){const lx=x-c.x,lz=z-c.z,H=top-c.h,long=hw>hd,len=(long?hw:hd)*2,th=(long?hd:hw)*2,out=long?Math.sign(lz):Math.sign(lx);
    const A=(a,y,o,la,h,w,col)=>long?P(lx+a,y,lz+o*out,la,h,w,col):P(lx+o*out,y,lz+a,w,h,la,col);   // a: wzdłuż muru, o: w poprzek (na zewnątrz +)
    A(0,0.4,0.15,len,2.6,th+0.9,SD);                 // cokół ze skosem
    A(0,-0.6,0.25,len+0.2,1.2,th+1.3,SDD);
    A(0,H/2+0.6,0,len,H-1.2,th,S);                   // lico muru
    A(0,H-1.15,0.05,len+0.05,0.45,th+0.35,S2);       // gzyms
    A(0,H-0.62,-0.05,len,0.25,th-0.5,WD);           // chodnik dla straży
    A(0,H-0.2,out>0?0:0,len,0.1,0.01,SD);
    // blanki i strzelnice po stronie zewnętrznej, niski murek od wewnątrz
    const nb=Math.max(2,Math.floor(len/1.5));for(let i=0;i<nb;i++){const a=-len/2+(i+0.5)*len/nb;if(i%2===0){A(a,H+0.15,th/2-0.3,len/nb*0.98,1.3,0.6,S);A(a,H+0.2,th/2+0.02,0.14,0.62,0.04,SL)}}
    A(0,H-0.35,th/2-0.3,len,0.7,0.62,S);
    A(0,H-0.05,-th/2+0.22,len,0.6,0.44,S2);
    // przypory co ~7 jednostek i mech u podstawy
    const np=Math.floor(len/7);for(let i=1;i<np;i++){const a=-len/2+i*len/np;A(a,1.6,th/2+0.45,0.9,4.2,0.9,SD);A(a,3.95,th/2+0.32,0.7,0.5,0.64,S2);
      A(a+0.9,2.6+(i%3)*0.9,th/2+0.03,0.14,0.55,0.04,SL)}
    for(let i=0;i<Math.floor(len/5);i++){const a=-len/2+2+i*5+((i*37)%7)*0.3;A(a,1.75,th/2+0.47,1.1+((i*13)%5)*0.2,0.18,0.06,MOSS)}
    const BN=['#a8302a','#2f5f8f'];if(!c.walls)for(let i=1;i<Math.floor(len/14);i++){const a=-len/2+i*14,bc=BN[(i+Math.round(c.x))&1];A(a,H-1.0,th/2+0.24,1.5,0.14,0.14,WDD);A(a,H-2.8,th/2+0.2,1.3,3.4,0.04,bc);A(a,H-4.6,th/2+0.2,0.6,0.35,0.04,bc);A(a,H-2.4,th/2+0.23,0.6,0.6,0.03,'#e6c25a');A(a,H-1.3,th/2+0.22,1.3,0.12,0.04,'#e6c25a')}}
  // wieże
  const tower=(lx,lz,hw,H,big)=>{const s=hw*2;
    P(lx,0.3,lz,s+1.1,2.6,s+1.1,SD);P(lx,-0.7,lz,s+1.5,1.2,s+1.5,SDD);
    P(lx,H/2+0.8,lz,s,H-1.6,s,S);
    for(const y of [H*0.33,H*0.66])P(lx,y,lz,s+0.25,0.35,s+0.25,S2);
    // strzelnice na 4 ścianach
    for(const [ax,az] of [[1,0],[-1,0],[0,1],[0,-1]])for(const y of [H*0.42,H*0.75]){if(ax)P(lx+ax*(hw+0.01),y,lz,0.04,0.9,0.18,SL);else P(lx,y,lz+az*(hw+0.01),0.18,0.9,0.04,SL)}
    // machikuły (wsporniki) i korona z blankami
    const ck=s+1.0;P(lx,H+0.25,lz,ck,0.7,ck,S2);
    const n=big?5:3;for(let i=0;i<n;i++){const o=-hw+(i+0.5)*s/n;for(const sg of [-1,1]){P(lx+o,H-0.3,lz+sg*(hw+0.25),0.42,0.5,0.5,SD);P(lx+sg*(hw+0.25),H-0.3,lz+o,0.5,0.5,0.42,SD)}}
    const m2=big?7:5,step=ck/m2;for(let i=0;i<m2;i++){if(i%2)continue;const o=-ck/2+(i+0.5)*step;for(const sg of [-1,1]){P(lx+o,H+1.15,lz+sg*(ck/2-0.25),step*0.98,1.1,0.5,S);P(lx+sg*(ck/2-0.25),H+1.15,lz+o,0.5,1.1,step*0.98,S)}}
    // dach namiotowy z dachówki: schodki zwężające się ku górze + kalenica i iglica z chorągwią
    const steps=big?7:6,rh=big?6.4:4.8,b0=s+0.2;
    for(let i=0;i<steps;i++){const w=b0*(1-i/steps)+0.18,y=H+0.75+i*rh/steps;P(lx,y+rh/steps/2,lz,w,rh/steps+0.06,w,RF[i%2]);P(lx,y+0.05,lz,w+0.28,0.12,w+0.28,RG)}
    P(lx,H+0.75+rh+0.5,lz,0.16,1.4,0.16,WDD);P(lx,H+0.75+rh+1.3,lz,0.36,0.36,0.36,'#c9a24a');
    P(lx,H+0.75+rh+1.95,lz+0.0,0.07,1.3,0.07,WDD);P(lx+0.55,H+0.75+rh+2.3,lz,1.0,0.55,0.05,'#b03a2a~');P(lx+0.55,H+0.75+rh+2.3,lz,0.4,0.18,0.06,'#e6c25a');
    // drzwi na chodnik
    P(lx,H-1.6,lz,0.9,1.6,s+0.06,WDD)};
  for(const [x,z,hw,hd,top] of c.towers){const lx=x-c.x,lz=z-c.z,H=top-c.h;tower(lx,lz,hw,H,hw>3)}
  // bramy: łuk, krata (podniesiona), wrota otwarte, herbowe chorągwie
  for(const [x,z,ax] of [[0,-Hs,1],[0,Hs,1],[-Hs,0,0],[Hs,0,0]]){const out=ax?Math.sign(z):Math.sign(x);
    const G=(a,y,o,la,h,w,col)=>ax?P(x+a,y,z+o*out,la,h,w,col):P(x+o*out,y,z+a,w,h,la,col);
    G(0,8.2,0,7.0,3.2,3.2,S);G(0,6.35,0,7.0,0.5,3.5,S2);
    for(const sg of [-1,1]){G(sg*3.0,5.6,0,1.0,1.0,3.0,S);G(sg*2.55,6.15,0,0.9,0.6,3.0,S)}
    G(0,9.95,1.42,7.4,0.35,0.5,S2);
    for(let i=0;i<5;i++){if(i%2)continue;G(-3.2+i*1.6,10.7,1.4,1.2,1.1,0.5,S)}
    for(let i=-3;i<=3;i++)G(i*0.9,6.75,1.75,0.09,1.4,0.09,'#3a3a40');G(0,6.2,1.75,6.6,0.12,0.12,'#3a3a40');G(0,7.3,1.75,6.6,0.12,0.12,'#3a3a40');
    for(const sg of [-1,1]){G(sg*3.25,2.7,2.1,0.5,5.2,1.6,WD);G(sg*3.25,1.6,2.1,0.56,0.14,1.62,'#3a3a40');G(sg*3.25,4.0,2.1,0.56,0.14,1.62,'#3a3a40')}
    for(const sg of [-1,1]){G(sg*1.9,7.6,1.65,1.1,2.6,0.06,'#a8352a~');G(sg*1.9,8.0,1.68,0.6,0.6,0.06,'#e6c25a');G(sg*1.9,6.15,1.65,1.1,0.24,0.08,'#e6c25a')}
    G(0,8.6,1.62,1.3,1.3,0.08,'#c9a24a');G(0,8.6,1.66,0.8,0.8,0.08,'#3f5a8a')}
  // rynek: studnia-fontanna z daszkiem i kramy z płóciennymi daszkami
  P(0,0.35,0,4.6,0.7,4.6,S);P(0,0.8,0,4.0,0.2,4.0,S2);P(0,0.74,0,3.5,0.08,3.5,'#3f6d9a');P(0,1.5,0,0.9,1.6,0.9,S);P(0,2.35,0,1.8,0.3,1.8,S2);P(0,2.52,0,1.1,0.08,1.1,'#3f6d9a');P(0,2.9,0,0.4,0.6,0.4,S);
  for(const [x,z,cc] of [[-7,-7,'#c0503a~'],[7,7,'#3a6aa0~'],[-7,7,'#d8a43a~'],[7,-7,'#5a8a3a~']]){P(x,0.5,z,2.4,1.0,1.2,'#8f5a2a');P(x-1.1,1.3,z-0.5,0.14,1.6,0.14,WDD);P(x+1.1,1.3,z-0.5,0.14,1.6,0.14,WDD);P(x-1.1,1.1,z+0.5,0.14,1.2,0.14,WDD);P(x+1.1,1.1,z+0.5,0.14,1.2,0.14,WDD);
    P(x,2.1,z-0.2,2.8,0.12,1.0,cc);P(x,1.85,z+0.55,2.8,0.12,0.7,cc);P(x-0.5,1.08,z,0.5,0.16,0.5,'#d8b24a');P(x+0.5,1.08,z,0.5,0.16,0.5,'#86c060');P(x,1.12,z+0.2,0.35,0.24,0.35,'#b84a3a')}
  return kitB(L);
}
// ---------- drogi i ruch ----------
let roads=[],roadQ={x:1e9,z:1e9,t:0},worldT=LS.get('wt',0);
function roadsTick(){const now=performance.now();if(!S.spawn)return;if(Math.hypot(player.p.x-roadQ.x,player.p.z-roadQ.z)>200||now-roadQ.t>15000){roadQ={x:player.p.x,z:player.p.z,t:now};const w=workers[0];w.busy++;w.postMessage({type:'roads',seed:S.seed,x:player.p.x,z:player.p.z,r:700,sx:S.spawn[0],sz:S.spawn[2],id:reqId++})}}
// odkrywanie dróg: drogi dzielone na odcinki ~8 m; odcinek pojawia się na mapie, gdy gracz był w pobliżu (zapis w W.rs)
let _rrT=0;function roadReveal(){const now=performance.now();if(now-_rrT<500)return;_rrT=now;W.rs=W.rs||{};let ch=false;const px=player.p.x,pz=player.p.z;
  for(const r of roads){if(!r.fp)continue;let st=W.rs[r.id]||'';if(st.length<r.fp.length-1)st=st.padEnd(r.fp.length-1,'0');let a=null;
    for(let i=0;i<r.fp.length-1;i++){if(st[i]==='1')continue;const p=r.fp[i],q=r.fp[i+1],mx=(p[0]+q[0])/2,mz=(p[1]+q[1])/2;if(Math.abs(mx-px)<60&&Math.abs(mz-pz)<60&&Math.hypot(mx-px,mz-pz)<55){a=a||st.split('');a[i]='1'}}
    if(a){W.rs[r.id]=a.join('');ch=true}}if(ch){MAP3D.dirty=true;saveW()}}
function roadSeenSegs(r){const st=(W.rs&&W.rs[r.id])||'';const out=[];if(!r.fp||st.indexOf('1')<0)return out;let cur=null;for(let i=0;i<r.fp.length-1;i++){if(st[i]==='1'){if(!cur){cur=[r.fp[i]];out.push(cur)}cur.push(r.fp[i+1])}else cur=null}return out}
function onRoads(list){roads=list.map(r=>{let L=0;const seg=[];for(let i=0;i<r.pts.length-1;i++){const l=Math.hypot(r.pts[i+1][0]-r.pts[i][0],r.pts[i+1][1]-r.pts[i][1]);seg.push(l);L+=l}
  const fp=[r.pts[0]];for(let i=0;i<r.pts.length-1;i++){const a=r.pts[i],b=r.pts[i+1],n=Math.max(1,Math.round(seg[i]/8));for(let k=1;k<=n;k++)fp.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n])}return{...r,seg,L,fp}});try{bridgesUpdate()}catch(e){console.warn(e)}}
// ===== mosty na drogach i pomosty w portach =====
const BRS=[],BRM=new Map();
function bridgeMesh(sp){const [x0,z0,x1,z1]=sp,dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz),y=(sp[4]||WATER)+1.5,EL=[];
  for(let s=-L/2;s<L/2;s+=1.2)EL.push([0,y,s+0.6,4,0.35,1.15,((s*10|0)&1)?'#8a6240':'#7a5532']);
  for(const sd of [-1.85,1.85]){EL.push([sd,y+0.9,0,0.18,0.18,L,'#5a3a22']);for(let s=-L/2;s<=L/2;s+=2.4)EL.push([sd,y+0.5,s,0.2,0.9,0.2,'#5a3a22'])}
  for(let s=-L/2+1.5;s<L/2;s+=4.5)for(const sd of [-1.6,1.6])EL.push([sd,y-1.8,s,0.45,3.6,0.45,'#4a2f1d']);
  const m=new THREE.Mesh(boxes(EL),matB);m.position.set((x0+x1)/2,0,(z0+z1)/2);m.rotation.y=Math.atan2(dx,dz);m.castShadow=true;m.receiveShadow=true;return m}
function bridgesUpdate(){const keep=new Set();BRS.length=0;
  for(const r of roads){if(!r.br)continue;r.br.forEach((sp,k)=>{const id=r.id+'#'+k;keep.add(id);BRS.push({a:[sp[0],sp[1]],b:[sp[2],sp[3]],y:(sp[4]||WATER)+1.68,w:2.1});if(!BRM.has(id)){const m=bridgeMesh(sp);scene.add(m);BRM.set(id,m)}})}
  for(const [id,m] of BRM)if(!keep.has(id)){scene.remove(m);m.geometry.dispose();BRM.delete(id)}
  for(const v of villages.values())if(v&&v.pier)BRS.push(v.pier)}
function bridgeGround(x,z,y){let best=null;for(const B of BRS){const ax=B.a[0],az=B.a[1],dx=B.b[0]-ax,dz=B.b[1]-az,l2=dx*dx+dz*dz||1;let t=((x-ax)*dx+(z-az)*dz)/l2;if(t<0||t>1)continue;const d=Math.hypot(x-ax-t*dx,z-az-t*dz);if(d<B.w&&y>=B.y-1.3&&(best===null||B.y>best))best=B.y}return best}
// ===== lawa parzy =====
function lavaTick(dt){if(P2.dead||!player.ready||VH.mode===6||VH.mode===2)return;if(biomeAt(player.p.x,player.p.z)!==17||!player.ground)return;P2.lavaT=(P2.lavaT||0)-dt;if(P2.lavaT<=0){P2.lavaT=0.5;try{takeDamage(14*(1-0.15*pk('ogien')),'lawa')}catch(e){}if(typeof PFX!=='undefined')PFX.emit(player.p.x,player.p.y+0.4,player.p.z,8,['#ff7a1a','#ffb030','#ffe080'],{sp:2,up:3,life:0.6,size:0.09});sfx('crackle',0.8);if(!P2.lavaMsg){P2.lavaMsg=1;toast('Lawa parzy! Uciekaj!','#ff7a3a')}}}
const DNAME={zamek:'Dzielnica zamkowa',rynek:'Dzielnica kupiecka',port:'Port',slumsy:'Slumsy',rzem:'Dzielnica rzemieślnicza'};
function districtAt(x,z){for(const v of villages.values()){if(!v||!v.city||!v.districts)continue;if(Math.abs(x-v.x)>v.Hs||Math.abs(z-v.z)>v.Hs)continue;if(Math.abs(x-v.x)<15&&Math.abs(z-v.z)<15)return (v.name||'Miasto')+' · Rynek';const sx=Math.sign(x-v.x)||1,sz=Math.sign(z-v.z)||1,d=v.districts.find(q=>q.sx===sx&&q.sz===sz);return (v.name||'Miasto')+(d?' · '+d.n:'')}return null}

function roadAt(r,u){let a=u;for(let i=0;i<r.seg.length;i++){if(a<=r.seg[i]||i===r.seg.length-1){const t=Math.min(1,a/r.seg[i]),p=r.pts[i],q=r.pts[i+1];return[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,Math.atan2(q[0]-p[0],q[1]-p[1])]}a-=r.seg[i]}return[r.pts[0][0],r.pts[0][1],0]}
const TRAV=new Map();
function makeTraveler(kind,seed,px,pz){
  const g=new THREE.Group(),r=mulb(seed),parts=[];
  const person=(x,z,o)=>{const m=makeChar({skin:rpick(r,SKINS),hair:rpick(r,['krotkie','dlugie','kucyk','lysy']),hairC:rpick(r,HAIRC),beard:rpick(r,['brak','krotka','zarost']),tunic:rpick(r,CLOTHC),pants:rpick(r,CLOTHC),boots:'#4a3020'},o);m.position.set(x,0,z);g.add(m);parts.push(m);return m};
  const beast=(t,x,z)=>{const m=makeEnemy(t,false);m.position.set(x,0,z);g.add(m);parts.push(m);return m};
  let spd=1.4;
  if(kind==='woz'){spd=2.6;beast('kon',0,1.6);const cart=new THREE.Group();cart.add(new THREE.Mesh(boxes([[0,0.85,0,1.5,0.14,2.4,'#8a6a44'],[0.72,1.15,0,0.08,0.5,2.4,'#7a5a3a'],[-0.72,1.15,0,0.08,0.5,2.4,'#7a5a3a'],[0,1.15,-1.17,1.5,0.5,0.08,'#7a5a3a'],[0,1.25,0.2,1.2,0.5,1.4,'#d8b24a'],[0,1.55,-0.4,1.1,0.4,0.9,'#a8452f~'],[0.3,0.75,1.5,0.08,0.08,1.4,'#6b4528'],[-0.3,0.75,1.5,0.08,0.08,1.4,'#6b4528']]),decoMat));
    const wheel=x=>{const w=new THREE.Mesh(boxes([[0,0,0,0.1,0.8,0.8,'#4a2f1d'],[0,0,0,0.12,0.56,0.56,'#6b4528'],[0,0,0,0.14,0.16,0.16,'#3a3a3a']]),decoMat);w.position.set(x,0.42,-0.4);cart.add(w);return w};
    g.userData.wheels=[wheel(0.82),wheel(-0.82)];cart.position.z=-1.2;g.add(cart);const d=person(0,-0.6,{});d.position.y=0.62;d.userData.sit=1}
  else if(kind==='karawana'){spd=2.0;const t=r()<0.5?'wielblad':'kon';for(let i=0;i<3;i++){const b=beast(t,0,-i*2.4);b.add(new THREE.Mesh(boxes([[0.42,1.5,0,0.24,0.4,0.6,'#8a5a30'],[-0.42,1.5,0,0.24,0.4,0.6,'#6b4a2b'],[0,1.75,0,0.7,0.12,0.5,'#c0503a~']]),decoMat))}
    person(0.9,1.2,{hat:'kaptur'});person(-0.9,-6.4,{pack:1})}
  else if(kind==='patrol'){spd=1.6;const H=herbNear(px||0,pz||0);for(const [x,z] of [[0.5,0],[-0.5,-1.2]]){const m=person(x,z,{hat:'helm'});soldierGear(m,H,'ludzie',true);const sp=new THREE.Mesh(boxes([[0,-0.3,0.2,0.05,0.05,2.0,'#6b4a2b'],[0,-0.3,1.25,0.1,0.06,0.25,'#c9cfd4']]),decoMat);sp.rotation.x=-Math.PI/2;if(m.userData.re)m.userData.re.add(sp)}}
  else{spd=1.3;person(0,0,{pack:1,hat:r()<0.5?'kaptur':undefined});if(r()<0.4)person(0.7,-0.9,{})}
  g.userData.parts=parts;g.userData.spd=spd;return g;
}
function trafficTick(dt){
  if(isAuth())worldT+=dt;const seen=new Set();
  for(const r of roads){const n=Math.max(1,Math.floor(r.L/380));
    for(let j=0;j<n;j++){const key=r.id+'#'+j,sd=strHash(key+S.seed),kindR=(sd%100)/100,kind=kindR<0.35?'woz':kindR<0.55?'karawana':kindR<0.68?'patrol':'piechur',spd=kind==='woz'?2.6:kind==='karawana'?2.0:kind==='patrol'?1.6:1.3;
      const ph=((sd>>>7)%1000)/1000,s=(worldT*spd+ph*2*r.L)%(2*r.L),fw=s<r.L,u=fw?s:2*r.L-s,[x,z,ang]=roadAt(r,u);
      if(Math.hypot(x-player.p.x,z-player.p.z)>170)continue;const h=colAt(x,z);if(h===null)continue;seen.add(key);
      let t=TRAV.get(key);if(!t){t={g:makeTraveler(kind,sd,x,z),ph:0};scene.add(t.g);TRAV.set(key,t)}
      const g=t.g,ry=fw?ang:ang+Math.PI;g.position.set(x,h,z);let dr=ry-g.rotation.y;dr=Math.atan2(Math.sin(dr),Math.cos(dr));g.rotation.y+=dr*Math.min(1,4*dt);
      t.ph+=dt;for(const p of g.userData.parts){if(p.userData.ll&&!p.userData.sit)animChar(p,spd,dt,false,false);else if(p.userData.legs)animEnemy(p,spd,dt,0,0,false);if(p.userData.sit){p.userData.ll.rotation.x=-1.35;p.userData.rl.rotation.x=-1.35}}
      if(g.userData.wheels)for(const w of g.userData.wheels)w.rotation.x+=spd*dt/0.4;
      // nie wchodź w wóz
      const dx=player.p.x-x,dz=player.p.z-z,dd=Math.hypot(dx,dz);if(dd<1.3&&dd>1e-3&&Math.abs(player.p.y-h)<2){player.p.x=x+dx/dd*1.3;player.p.z=z+dz/dd*1.3}}}
  for(const [k,t] of TRAV)if(!seen.has(k)){scene.remove(t.g);t.g.traverse(o=>{if(o.material&&o.material!==decoMat&&o.material.dispose)o.material.dispose()});TRAV.delete(k)}
}

// =================== EDYTOR WYGLĄDU POSTACI ===================
let custOn=false;const custOpen=()=>custOn;
function genWardrobe(){const key='garderoba';let s=SPACES.get(key);const W=10,D=9;
  if(!s){s={id:key,kind:'interior',func:'garderoba',cs:1,W,D,x0:0,z0:0,fy:950,ceil:4.2,solid:new Uint8Array(W*D),npcs:[],torches:[],built:false};
    for(let j=0;j<D;j++)for(let i=0;i<W;i++)if(i===0||j===0||i===W-1||j===D-1)s.solid[j*W+i]=1;
    const SOL=(i0,j0,i1,j1)=>{for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)s.solid[j*W+i]=1};
    const L=[],X=i=>i-W/2,Z=j=>j-D/2,WD='#7a5030',WDD='#4a2f1d',PL='#e8dcc4',P=(...b)=>L.push(b);
    for(let j=1;j<D-1;j++)P(0,-0.1,Z(j)+0.5,W-2,0.2,1,j%2?'#8a6240':'#7e5838');
    for(const [x,z,w,d] of [[0,Z(0.5),W,1],[0,Z(D-0.5),W,1],[X(0.5),0,1,D],[X(W-0.5),0,1,D]])P(x,s.ceil/2,z,w,s.ceil,d,PL);
    P(0,s.ceil+0.15,0,W,0.3,D,'#5a3a22');for(let i=2;i<W-1;i+=2)P(X(i),s.ceil-0.15,0,0.3,0.3,D-2,WDD);
    P(0,0.02,0.3,5,0.04,4,'#8a2a2a');P(0,0.03,0.3,4.4,0.04,3.4,'#c9a24a');P(0,0.04,0.3,4,0.04,3,'#7a2222');
    P(0,1.9,Z(1)+0.06,2.2,3.0,0.08,'#c9a24a');P(0,1.9,Z(1)+0.11,1.9,2.7,0.04,'#cfe6f2');P(0.4,2.4,Z(1)+0.14,0.3,1.4,0.02,'#f4fbff');
    SOL(1,1,2,2);P(X(2),1.5,Z(2),2,3,1.8,WD);P(X(2),1.5,Z(3)+0.02,0.06,2.8,0.04,WDD);P(X(2)-0.2,1.6,Z(3)+0.05,0.08,0.3,0.06,'#c9a24a');P(X(2)+0.2,1.6,Z(3)+0.05,0.08,0.3,0.06,'#c9a24a');
    SOL(W-3,1,W-2,2);P(X(W-2),1.5,Z(2),2,3,1.8,WD);P(X(W-2),1.5,Z(3)+0.02,0.06,2.8,0.04,WDD);
    SOL(W-2,5,W-2,5);P(X(W-1.5),0.1,Z(5.5),0.6,0.2,0.6,WDD);P(X(W-1.5),0.9,Z(5.5),0.12,1.6,0.12,WDD);P(X(W-1.5),1.6,Z(5.5),0.7,0.8,0.4,'#8a8f94');P(X(W-1.5),2.15,Z(5.5),0.4,0.4,0.4,'#9aa0a6');P(X(W-1.5),2.38,Z(5.5),0.06,0.1,0.34,'#a8352a');
    SOL(1,5,1,6);P(X(1.5),0.45,Z(6),0.8,0.12,2,WD);P(X(1.5),0.22,Z(6),0.7,0.44,0.15,WDD);P(X(1.5),0.56,Z(5.5),0.5,0.1,0.6,'#3f5f8a');P(X(1.5),0.56,Z(6.5),0.5,0.12,0.5,'#a8452f');
    P(0,1.2,Z(D-1)-0.02,1.4,2.4,0.08,'#5a3a22');P(0,2.5,Z(D-1)-0.05,1.8,0.2,0.12,WDD);
    const torch=(x,z)=>{P(x,2.2,z,0.12,0.5,0.12,WDD);s.torches.push([x,2.6,z])};torch(X(1)+0.2,Z(4));torch(X(W-1)-0.2,Z(4));
    s.geoL=L;s.tl=s.torches.map(t=>t.slice());SPACES.set(key,s)}
  if(!SPC){if(s.g)unbuildSpace(s);s.x0=Math.round(player.p.x)-W/2;s.z0=Math.round(player.p.z)-D/2;s.torches=s.tl.map(t=>[s.x0+W/2+t[0],s.fy+t[1],s.z0+D/2+t[2]]);
    s.exit=[s.x0+W/2,s.z0+D-1.6];s.spawn=[s.x0+W/2,s.z0+D/2+1.2];s.out=[player.p.x,player.p.z];s.outY=player.p.y;s.outRy=player.ry}
  return s}
function openCustom(){if(!SPC&&!P2.dead&&!VH.mode){enterSpace(genWardrobe());player.ry=Math.PI;yaw=Math.PI}custOn=true;$('custom').hidden=false;try{document.exitPointerLock()}catch(e){}renderCustom()}
function closeCustom(){custOn=false;$('custom').hidden=true;if(SPC&&SPC.func==='garderoba')leaveSpace();if(!S.look){S.look=lookOf(null);LS.set('look',S.look)}}
function renderHerbEd(){const el=$('herbed');if(!el)return;const H=S.herb,sw=(k)=>`<div class="sw">${HTIN.map(([n,c],i)=>`<button class="swc${H[k]===i?' on':''}" style="background:${c} !important" data-hk="${k}" data-hv="${i}" title="${n}"></button>`).join('')}</div>`,ch=(k,arr)=>`<div class="chips">${arr.map((n,i)=>`<button class="chip2${H[k]===i?' on':''}" data-hk="${k}" data-hv="${i}">${n}</button>`).join('')}</div>`;
  el.innerHTML=`<div class="herbtop"><canvas id="herbcv" width="108" height="128"></canvas><div><label class="hchk"><input type="checkbox" data-hb="sh" ${H.sh?'checked':''}> Na tarczy</label><label class="hchk"><input type="checkbox" data-hb="tu" ${H.tu?'checked':''}> Na tunice i wapenroku</label><button data-hrand="1">Losuj herb</button></div></div><label>Podział tarczy</label>${ch('d',HDIV)}<label>Barwa pola</label>${sw('c1')}<label>Druga barwa</label>${sw('c2')}<label>Godło</label>${ch('ch',HCH.map(c=>c[0]))}<label>Barwa godła</label>${sw('cc')}`;herbDraw($('herbcv'),H)}
function herbSet(){LS.set('herb',S.herb);meRef.userData.gsig=null;for(const f of FOL)if(f.m){f.m.userData.herb=S.herb;f.m.userData.gsig=null;try{applyGear(f.m,f.d.eq||{})}catch(_){}}renderHerbEd()}
function renderCustom(){const L=lookOf(S.look);try{renderLookSlots()}catch(e){}try{renderHerbEd()}catch(e){console.warn(e)}
  const sw=(key,arr)=>`<div class="sw">${arr.map((c,i)=>`<button class="swc${L[key]===i?' on':''}" style="background:${c} !important" data-k="${key}" data-v="${i}" aria-label="${i+1}"></button>`).join('')}</div>`;
  const ch=(key,arr)=>`<div class="chips">${arr.map(([v,n])=>`<button class="chip2${L[key]===v?' on':''}" data-k="${key}" data-s="${v}">${n}</button>`).join('')}</div>`;
  L.fem=L.fem?1:0;$('custbody').innerHTML=`<label>Sylwetka</label>${ch('fem',[[0,'Męska'],[1,'Kobieca (suknia)']])}<label>Skóra</label>${sw('skin',SKINS)}<label>Fryzura</label>${ch('hair',HAIRS)}<label>Kolor włosów</label>${sw('hairC',HAIRC)}<label>Zarost</label>${ch('beard',BEARDS)}<label>Oczy</label>${sw('eyes',EYEC)}<label>Brwi</label>${ch('brows',[[0,'Delikatne'],[1,'Krzaczaste'],[2,'Groźne']])}<label>Uszy</label>${ch('ears',[['ludzkie','Ludzkie'],['elfie','Elfie'],['orcze','Orcze z kłami']])}<label>Blizna</label>${ch('scar',[['brak','Brak'],['policzek','Na policzku'],['oko','Przez oko']])}<label>Opaska na oko</label>${ch('patch',[[0,'Nie'],[1,'Tak']])}<label>Malunek twarzy</label>${ch('paint',[['brak','Brak'],['pasy','Pasy'],['kropki','Kropki'],['maska','Maska']])}${L.paint!=='brak'?sw('paintC',PAINTC):''}<label>Dodatek</label>${ch('acc',[['brak','Brak'],['kolczyki','Kolczyki'],['naszyjnik','Naszyjnik'],['opaska','Opaska'],['szal','Szal']])}${L.acc!=='brak'?sw('accC',ACCC):''}<label>Tunika</label>${sw('tunic',CLOTHC)}<label>Spodnie</label>${sw('pants',CLOTHC)}<label>Buty</label>${sw('boots',CLOTHC)}<label>Pas</label>${sw('belt',BELTC)}<label>Peleryna</label>${ch('cape',[[0,'Bez peleryny'],[1,'Peleryna'],[2,'Długi płaszcz'],[3,'Krótka narzutka']])}${L.cape?sw('capeC',CLOTHC):''}<label>Budowa</label>${ch('build',[[0,'Smukła'],[1,'Krępa'],[2,'Masywna']])}<label>Wzrost</label>${ch('ht',[[0,'Niski'],[1,'Średni'],[2,'Wysoki']])}`;
}
$('custbody').onclick=e=>{const b=e.target.closest('[data-k]');if(!b)return;const L=lookOf(S.look),s=b.dataset.s;L[b.dataset.k]=b.dataset.v!=null?+b.dataset.v:(/^[0-9]$/.test(s)?+s:s);S.look=L;LS.set('look',L);rebuildMe();renderCustom()};
$('custok').onclick=closeCustom;
$('herbed').onclick=e=>{const b=e.target.closest('[data-hk]');if(b){S.herb[b.dataset.hk]=+b.dataset.hv;herbSet();return}if(e.target.closest('[data-hrand]')){const r=Math.random;S.herb=herbOf({d:Math.floor(r()*HDIV.length),c1:Math.floor(r()*10),c2:Math.floor(r()*10),ch:1+Math.floor(r()*(HCH.length-1)),cc:Math.floor(r()*10),sh:S.herb.sh,tu:S.herb.tu});if(S.herb.c2===S.herb.c1)S.herb.c2=(S.herb.c1+2)%10;if(S.herb.cc===S.herb.c1)S.herb.cc=(S.herb.c1+5)%10;herbSet()}};
$('herbed').onchange=e=>{const c=e.target.closest('[data-hb]');if(c){S.herb[c.dataset.hb]=c.checked?1:0;herbSet()}};
$('custslots').onclick=e=>{const b=e.target.closest('[data-ls]');if(!b)return;const [act,i]=b.dataset.ls.split(':'),L=LS.get('looks',[null,null,null]);
  if(act==='s'){L[+i]=lookOf(S.look);LS.set('looks',L);toast('Zapisano wygląd w slocie '+(+i+1),'#ffd34d')}else if(L[+i]){S.look=lookOf(L[+i]);LS.set('look',S.look);rebuildMe();renderCustom();toast('Wczytano slot '+(+i+1),'#ffd34d')}renderLookSlots()};
function renderLookSlots(){const L=LS.get('looks',[null,null,null]);$('custslots').innerHTML=[0,1,2].map(i=>`<div class="lslot"><b>Slot ${i+1}</b><button data-ls="s:${i}">Zapisz</button><button data-ls="l:${i}" ${L[i]?'':'disabled'}>Wczytaj</button></div>`).join('')}
$('custrand').onclick=()=>{const ri=n=>Math.floor(Math.random()*n);S.look={skin:ri(SKINS.length),hair:pick(HAIRS)[0],hairC:ri(HAIRC.length),beard:pick(BEARDS)[0],eyes:ri(EYEC.length),tunic:ri(CLOTHC.length),pants:ri(CLOTHC.length),boots:ri(CLOTHC.length),cape:ri(4),capeC:ri(CLOTHC.length),build:ri(3),brows:ri(3),scar:pick(['brak','brak','policzek','oko']),paint:pick(['brak','brak','brak','pasy','kropki','maska']),paintC:ri(PAINTC.length),patch:Math.random()<0.1?1:0,ears:pick(['ludzkie','ludzkie','elfie','orcze']),ht:ri(3),acc:pick(['brak','kolczyki','naszyjnik','opaska','szal']),accC:ri(ACCC.length),belt:ri(BELTC.length)};LS.set('look',S.look);rebuildMe();renderCustom()};
$('custbtn').onclick=()=>{toggleMenu();openCustom()};
$('fov').value=S.fov;$('fovv').textContent=S.fov;$('fov').oninput=e=>{S.fov=+e.target.value;$('fovv').textContent=S.fov;LS.set('fov',S.fov)};
let crossH=null;
function crossTick(){const h=uiOpen()||invOpen()||!$('perks').hidden||!$('journal').hidden||!!dlg||P2.dead>0||!player.ready||!$('mapwrap').hidden||!$('loading').hidden;if(h!==crossH){crossH=h;$('cross').hidden=h}}

// ---------- pętla ----------
let last=performance.now(), acc=0, fpsT=0, frames=0, fps=0, chunkT=0, saveT=0;
newWorld(S.seed, LS.get('pos',null)&&LS.get('posSeed',null)===S.seed?LS.get('pos'):null);
let hidRender=0,villT=0;
function loop(now,bg){
  if(!bg)requestAnimationFrame(loop);
  const dt=Math.min(0.1,(now-last)/1000); last=now;
  chunkT+=dt; if(chunkT>0.15){chunkT=0;updateChunks()}
  processResults();
  if(player.hold){const h=colAt(player.p.x,player.p.z);const near=[...chunks.values()].filter(c=>c.mesh&&Math.hypot(c.cx-pc.x,c.cz-pc.z)<=2).length;
    $('loadbar').style.width=Math.min(100,near/13*100)+'%';
    if(h!==null&&near>=13){if(player.p.y<h)player.p.y=h;player.hold=false;$('loading').hidden=true;if(INV.petA&&!PET)spawnPet();if(!FOL.length&&INV.fol.length)spawnFols();if(!HERO.pas||HERO.pas.length!==3)openClsel();else if(!S.look)openCustom()}}
  if(!player.hold){villT+=dt;if(villT>1){villT=0;villTick();strTick()}buildTick();npcTick(dt);spaceTick(dt);strFrame(dt);trafficTick(dt);ambTick(dt);audioTick(dt);heartTick(dt);folTick(dt);slashTick(dt);questTick(dt);combatTick(dt);if(isAuth()){spawnT+=dt;if(spawnT>1){spawnT=0;spawnTick();hostHmaps()}simEnemies(dt)}renderEnemies(dt);dropsTick(dt);try{eventTick(dt)}catch(e){console.error(e)}for(const fn of TICKS)try{fn(dt)}catch(e){console.error(e)}}
  if(!player.hold&&!uiOpen()){acc+=dt;while(acc>=1/60){physics(1/60);acc-=1/60}} else acc=0;
  if(!player.hold&&uiOpen()){acc=0}
  meRef.position.copy(player.p);{const dy=player.p.y-(player.visY??player.p.y);if(player.visY==null||Math.abs(dy)>2.4||(!player.ground&&!player.swim)||SPC)player.visY=player.p.y;else player.visY+=dy*Math.min(1,(dy>0?13:10)*dt);meRef.position.y=player.visY} let dr=player.ry-meRef.rotation.y; dr=Math.atan2(Math.sin(dr),Math.cos(dr)); meRef.rotation.y+=dr*Math.min(1,12*dt);
  meRef.userData.vy=player.v.y;animChar(meRef,P2.roll>0?0:Math.hypot(player.v.x,player.v.z),dt,!player.ground&&!player.swim&&!(P2.climbing>0),player.swim);animMe(dt);meRef.scale.y=P3.sneak?0.86:1;sneakHud();try{waterLifeTick(dt);fallsTick(dt)}catch(err){console.warn(err)}poseExtra(meRef,INV.eq.bron,!!P3.block,INV.eq.tarcza);try{enchGlow(dt)}catch(_){}vehFrame(dt);if(!player.hold)petTick(dt);
  interpRemotes(dt); netTick(dt); updateCamera(dt); instFrame(); crossTick();
  if(isAuth())hour=(hour+dt/60)%24;
  try{ikTick()}catch(_){}
  if(!bg||(hidRender+=dt)>0.5){hidRender=0;renderer.render(scene,camera);fxTick(dt);updHud()}
  frames++; fpsT+=dt; if(fpsT>=0.5){fps=Math.round(frames/fpsT);frames=0;fpsT=0;
    const b=biomeAt(player.p.x,player.p.z);const dn=districtAt(player.p.x,player.p.z);$('biome').textContent=dn||(player.swim?'Pływanie · '+(BIOMES[b]||''):(BIOMES[b]||'…'));
    $('stats').textContent=!S.dbg?`🕒 ${clockTxt()} · ${['Lato','Jesień','Zima','Wiosna'][season]||''} · ${WXN[WX.k]}${kingCur?' · 👑 '+kName(kingCur):''}${EVT.cur&&!EVT.cur.done?' · ⚑ '+EVT.cur.name:''}`:`${fps} FPS · chunki ${[...chunks.values()].filter(c=>c.mesh).length} · obiekty ${instTotal} · wywołania ${renderer.info.render.calls} · trójkąty ${(renderer.info.render.triangles/1000|0)}k · godz. ${clockTxt()} · X ${Math.floor(player.p.x)} Y ${Math.floor(player.p.y)} Z ${Math.floor(player.p.z)}`;
    miniDraw(); status($('netstat').textContent,$('netstat').className==='bad')}
  if(!$('mapwrap').hidden){if(mapV.follow){mapV.x=player.p.x;mapV.z=player.p.z}if(map3dInit()){MAP3D.on=true;try{map3dRender();drawMap3DOverlay(bx,big.width,big.height)}catch(err){console.warn(err);MAP3D.fail=1;MAP3D.on=false}}else{MAP3D.on=false;drawMap(bx,big.width,big.height,mapScale,mapV.x,mapV.z,true)}}
  saveT+=dt; if(saveT>3&&player.ready&&!player.hold){saveT=0;if(!SPC&&player.p.y<450&&VH.mode!==4)LS.set('pos',[player.p.x,player.p.y,player.p.z]);LS.set('hour',hour);LS.set('dist',dist);LS.set('wt',worldT);LS.set('posSeed',S.seed);LS.set('yaw',yaw)}
}
requestAnimationFrame(loop);
// karta w tle: rAF stoi, a host musi dalej wysyłać stan graczy – zegar w workerze nie jest dławiony
const ticker=new Worker(URL.createObjectURL(new Blob(['setInterval(()=>postMessage(0),50)'],{type:'text/javascript'})));
ticker.onmessage=()=>{if(document.hidden)loop(performance.now(),true)};
function saveAllNow(){try{if(player.ready&&!player.hold&&!SPC&&player.p.y<450&&VH.mode!==4){LS.set('pos',[player.p.x,player.p.y,player.p.z]);LS.set('posSeed',S.seed)}LS.set('hour',hour);LS.set('wt',worldT);LS.set('yaw',yaw);saveInv();saveW()}catch(e){}}
addEventListener('beforeunload',()=>{saveAllNow();if(NET.tr)try{NET.tr.send({t:'bye',from:NET.id})}catch(e){}});addEventListener('pagehide',saveAllNow);document.addEventListener('visibilitychange',()=>{if(document.hidden)saveAllNow()});
}
window.__mainReady=true;
