// =================== RDZEŃ PINTARA (skopiowany bez zmian z pintar_kit.html) ===================
function hash(x,y,z=0){let h=(x*374761393+y*668265263+z*2147483647)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}
const V=1/16;
const SEAS_U={uTime:{value:0},uVox:{value:LS.get('voxT',1)},uSnow:{value:0},uAut:{value:0},uSpr:{value:0},uFall:{value:0},uPat:{value:1},uCam:{value:new THREE.Vector3()},uWet:{value:0},uSunW:{value:new THREE.Vector3(0,1,0)},uLampN:{value:12},uLamp:{value:Array.from({length:40},()=>new THREE.Vector4(0,-999,0,0))},uLampI:{value:new Array(40).fill(0)},uLampC:{value:Array.from({length:40},()=>new THREE.Vector3(1,.74,.42))}};
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
function seasonPatch(m,terrain,dec,bld,clo,con,obj){
 const PB=!!bld,PT=!!terrain,PD=!!(dec||con),PC=!!(bld||clo),PO=!!obj;
 try{m.extensions=Object.assign(m.extensions||{},{derivatives:true})}catch(_){}
 m.onBeforeCompile=sh=>{for(const k of ['uTime','uVox','uSnow','uAut','uSpr','uFall','uPat','uCam','uWet','uSunW','uLamp','uLampI','uLampC','uLampN'])sh.uniforms[k]=SEAS_U[k];
  sh.vertexShader='varying float vUp;varying vec3 vWp;varying vec3 vNw;varying float vBy;varying vec2 vT;varying vec3 vLp;varying vec3 vNl;'+(PC?'attribute vec2 aT;':'')+'\n'+sh.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\n{vec4 wp=vec4(transformed,1.);vec4 o4=vec4(0.,0.,0.,1.);\n#ifdef USE_INSTANCING\nwp=instanceMatrix*wp;o4=instanceMatrix*o4;\n#endif\nvWp=(modelMatrix*wp).xyz;vBy=(modelMatrix*o4).y;vLp=transformed;vT='+(PC?'aT':'vec2(0.)')+';}').replace('#include <defaultnormal_vertex>','#include <defaultnormal_vertex>\nvNl=objectNormal;vUp=dot(normalize(transformedNormal),normalize((viewMatrix*vec4(0.,1.,0.,0.)).xyz));vNw=normalize((vec4(transformedNormal,0.)*viewMatrix).xyz);');
  sh.fragmentShader='varying float vUp;varying vec3 vWp;varying vec3 vNw;varying float vBy;varying vec2 vT;varying vec3 vLp;varying vec3 vNl;uniform float uTime;uniform float uSnow;uniform float uAut;uniform float uSpr;uniform float uFall;uniform float uPat;uniform float uVox;uniform float uWet;uniform vec3 uCam;uniform vec3 uSunW;uniform vec4 uLamp[40];uniform float uLampI[40];uniform vec3 uLampC[40];uniform float uLampN;float ph2(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}\n'+sh.fragmentShader.replace('#include <aomap_fragment>','#include <aomap_fragment>\n{vec3 lsum=vec3(0.);for(int li=0;li<40;li++){if(float(li)>=uLampN)break;vec4 L=uLamp[li];if(L.w>0.){vec3 dv=L.xyz-vWp;float d=length(dv);float a=pow(clamp(1.-d/L.w,0.,1.),1.5);float nd=max(dot(normalize(vNw),dv/max(d,.001)),0.)*.7+.3;lsum+=a*nd*uLampI[li]*uLampC[li];}}lsum=1.25*lsum/(vec3(1.)+lsum);/* v124: miękkie nasycenie — nakładające się lampy nie prześwietlają */totalEmissiveRadiance+=diffuseColor.rgb*lsum;reflectedLight.directDiffuse+=vec3(0.);}').replace('#include <emissivemap_fragment>',`#include <emissivemap_fragment>
  {vec3 c0=diffuseColor.rgb;float gd=c0.g-max(c0.r,c0.b);float leaf=smoothstep(.015,.1,gd)*smoothstep(.28,.42,c0.g);
   bool tg=${PC?'vT.y>2.5':'false'};float vr=fract(sin(dot(floor(vWp.xz*1.3+vWp.y*.7),vec2(12.9,78.2)))*43758.5);
   ${dec?'float vr2=fract(sin(dot(floor(vWp*7.+.37),vec3(12.9,78.2,37.7)))*43758.5);if(leaf>.45&&vr2<uFall*1.3)discard;':''}
   vec3 au=mix(vec3(c0.g*1.55,c0.g*.82,c0.g*.28),vec3(c0.g*1.35,c0.g*.5,c0.g*.2),vr);
   ${terrain?'au=c0*mix(vec3(1.7,.85,.3),vec3(1.25,.62,.28),vr);':'if(tg)au=c0*mix(vec3(1.7,.85,.3),vec3(1.25,.62,.28),vr);'}
   diffuseColor.rgb=mix(c0,au,leaf*uAut*${terrain?'.85':'(tg?.85:1.0)'});
   diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.04,1.1,.96)+vec3(.0,.03,.0),leaf*uSpr);
   {float gz=smoothstep(.01,.07,diffuseColor.g-max(diffuseColor.r,diffuseColor.b));float lm=dot(diffuseColor.rgb,vec3(.3,.55,.15));diffuseColor.rgb=mix(diffuseColor.rgb,mix(vec3(lm),diffuseColor.rgb,.58)*vec3(1.04,1.0,.93),gz);}
   float sj=0.,pj=0.;
   ${(PC||PT||PD||PO)?`{const bool PB=${PB},PT=${PT},PD=${PD},PC=${PC},PO=${PO};
    float ny=vNw.y,wall=1.-smoothstep(.3,.65,abs(ny)),top=smoothstep(.5,.8,ny);    float mx=max(c0.r,max(c0.g,c0.b)),mn=min(c0.r,min(c0.g,c0.b)),dl=mx-mn,sat=dl/(mx+.001),val=mx,hh=0.;
    if(dl>.001){if(mx==c0.r)hh=mod((c0.g-c0.b)/dl,6.);else if(mx==c0.g)hh=(c0.b-c0.r)/dl+2.;else hh=(c0.r-c0.g)/dl+4.;}hh*=60.;
    bool greyC=sat<.16&&val>.2,redC=sat>.4&&(hh<17.||hh>340.)&&val>.3,brownC=sat>.35&&hh>=17.&&hh<48.&&val<.62&&val>.15,strawC=sat>.35&&hh>=24.&&hh<55.&&val>=.62;
    bool plastC=sat>=.16&&sat<.4&&val>.6&&hh>15.&&hh<70.,blueC=sat>.22&&hh>180.&&hh<265.&&val>.25,slateC=sat>=.1&&sat<=.22&&hh>190.&&hh<260.&&val>.2,greenC=hh>=70.&&hh<=170.&&sat>.25;
    float aFr=${PC?'vT.x':'0.'},aLong=step(128.,aFr),aF=aFr-128.*aLong,aM=${PC?'vT.y':'0.'};bool cloth=PC&&aM>.5&&aM<1.5,big=aF>=5.;bool stoneC=greyC&&val<.8,plasterG=greyC&&val>=.8;if(aF>8.5&&aF<9.5){stoneC=true;plasterG=false;}
    bool loc=PD||cloth;vec3 pp=(loc?vLp:vWp)*16.;vec3 an=abs(loc?vNl:vNw);float hu=an.x>an.z?pp.z:pp.x,hy=pp.y,m=1.;vec2 tp=pp.xz;
    float fade=aF>=7.?1.-smoothstep(90.,260.,length(uCam-vWp)):1.-smoothstep(40.,120.,length(uCam-vWp));if(aF>=7.){float ks=aF>=7.5?2.:1.5;hu/=ks;hy/=ks;}
    float mossA=0.;vec3 mossC=vec3(.35,.4,.2);
    if(uPat>.5&&fade>.01&&(aM<1.5||aM>2.5)){
     if(cloth){vec2 q=(an.y>an.x&&an.y>an.z)?pp.xz:(an.x>an.z?pp.zy:pp.xy);q*=1.5;
      m=1.-.11*step(fract(q.x),.34)-.09*step(fract(q.y),.34)+(ph2(floor(q))-.5)*.06;}
     else if(PO||(PB&&aFr<.5&&aM<.5)){/* v140: faktury obiektów i ozdób bez własnej tekstury — w skali świata (8 tekseli na metr), wzór zależny od rodzaju materiału */
      vec3 q3=vWp*8.;vec2 F=top>.5?q3.xz:vec2(an.x>an.z?q3.z:q3.x,q3.y);
      if(redC){m=1.+(ph2(floor(F/2.))-.5)*.2+(ph2(floor(F/5.))-.5)*.14-.12*step(.9,ph2(floor(F)+4.));}
      else if(PO&&(greyC&&val<.82||slateC)){float cr=step(.88,ph2(floor(F/1.5)+floor(F.yx/4.)*5.));m=1.+(ph2(floor(F/2.))-.5)*.3+(ph2(floor(F/5.))-.5)*.2-.24*cr+(ph2(floor(F))-.5)*.08;}
      else if(greyC&&val<.82||slateC){float row=floor(F.y/3.),bu=F.x+mod(row,2.)*3.+ph2(vec2(row,3.))*5.,fu=fract(bu/6.),fv=fract(F.y/3.);m=mix(1.+(ph2(vec2(floor(bu/6.),row))-.5)*.3+(ph2(floor(F))-.5)*.1,.72,max(step(fu,.07),step(fv,.11)));if(top>.5)m*=1.-.12*step(.93,ph2(floor(F/2.)+3.));}
      else if(brownC){float pl=floor(F.x/3.),seam=step(fract(F.x/3.),.1);m=1.-.32*seam+(ph2(vec2(pl,floor(F.y/10.)))-.5)*.24+sin(F.y*.9+ph2(vec2(pl,1.))*6.)*.06-.2*step(.97,ph2(floor(F*vec2(1.,.5))));}
      else if(greenC){m=1.+(ph2(floor(F))-.5)*.28+(ph2(floor(F/3.))-.5)*.18;}
      else if(strawC){m=1.+(ph2(vec2(floor(F.x),floor(F.y/5.)))-.5)*.3-.18*step(fract(F.y/3.),.18);}
      else if(plasterG||plastC||(sat<.3&&val>.6)){m=1.+(ph2(floor(F/2.))-.5)*.12+(ph2(floor(F/6.))-.5)*.1-.14*step(.92,ph2(floor(F/3.)+7.))+.05*step(.9,ph2(floor(F)+2.));}
      else if(blueC||sat>.45){m=1.+(ph2(floor(F/2.))-.5)*.14+.1*step(.86,fract((F.x+F.y)*.11))-.06*step(.9,ph2(floor(F)+5.));}
      else{m=1.+(ph2(floor(F))-.5)*.16+(ph2(floor(F/4.))-.5)*.12;}}
     else if(PB){
      if(wall>.01){
       if(big&&redC){float row=floor(hy/2.),bu=hu+mod(row,2.)*2.25+ph2(vec2(row,7.))*4.5,fu=fract(bu/4.5),fv=fract(hy/2.);
        float mort=max(step(fu,.16),step(fv,.3)),bv=ph2(vec2(floor(bu/4.5),row));
        m=mix(1.+(bv-.5)*.5+step(.67,fv)*.08,.55,mort);}
       else if(big&&stoneC){float row=floor(hy/4.),bu=hu+mod(row,2.)*4.+ph2(vec2(row,3.))*8.,fu=fract(bu/8.),fv=fract(hy/4.);
        float mort=max(step(fu,.12),step(fv,.24)),bv=ph2(vec2(floor(bu/8.),row));
        m=mix(1.+(bv-.5)*.42+(ph2(floor(vec2(hu,hy)/2.))-.5)*.1,.55,mort);}
       else if(big&&(brownC||blueC)){float pl=floor(hu/4.),seam=step(fract(hu/4.),.13);
        m=1.-.5*seam+(ph2(vec2(pl,floor(hy/9.)))-.5)*.34+sin(hy*.8+ph2(vec2(pl,1.))*6.)*.07;}
       else if(big&&(plastC||plasterG)){m=1.+(ph2(floor(vec2(hu,hy)/2.))-.5)*.18+(ph2(floor(vec2(hu,hy)/8.))-.5)*.14+step(.86,ph2(floor(vec2(hu,hy)/5.)))*-.07;}
       else if(!big&&aLong>.5&&(redC||blueC||slateC)){float row=floor(hy/3.),o=mod(row,2.)*1.5,fu=fract((hu+o)/3.),fv=fract(hy/3.);
        m=1.-.4*step(fv,.2)-.28*step(fu,.15)+(ph2(vec2(floor((hu+o)/3.),row))-.5)*.3;}
       else if(strawC){m=1.+(ph2(vec2(floor(hu),floor(hy/6.)))-.5)*.3-.2*step(fract(hy/3.),.2);}
       else if(!big&&brownC){float gc=ph2(floor(vec2(hu,hy)/8.));float a1=gc>.5?hu:hy,a2=gc>.5?hy:hu;
        m=1.+(ph2(vec2(floor(a1*1.5),floor(a2/12.)+gc*9.))-.5)*.4-.18*step(.8,ph2(vec2(floor(a1*.7),floor(a2/5.))));}
       else if(greenC){m=1.+(ph2(floor(pp.xz*.5)+floor(pp.y*.5)*17.)-.5)*.26;}
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
       else if(greenC){mt=1.+(ph2(floor(tp*.6))-.5)*.24+(ph2(floor(tp*.5))-.5)*.12;}
       else if(big&&plastC){mt=1.+(ph2(floor(tp*.6))-.5)*.12+sin(tp.x*.9+tp.y*.5)*.03;}
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
       if(greenC){float n1=ph2(floor(tp*.6)),n2=ph2(floor(tp*.5)),bl=ph2(floor(vec2(tp.x*4.,tp.y*1.3)+floor(tp.y*1.3)*3.));
        mt=1.+(n1-.5)*.24+(n2-.5)*.14+(bl-.5)*.14+(ph2(floor(tp/6.))-.5)*.1;
        float fl=step(.988,ph2(floor(tp*1.)+3.));if(fl>0.){float fc=ph2(floor(tp)+9.);mossA=max(mossA,fl);mossC=fc<.33?vec3(.95,.92,.85):fc<.66?vec3(.95,.8,.25):vec3(.85,.35,.45);}}
       else if(strawC||plastC){float rp=sin(tp.x*.55+tp.y*.22+ph2(floor(tp/16.))*6.)*.5+.5;mt=1.+(rp-.5)*.14+(ph2(floor(tp*.6))-.5)*.12-.14*step(.975,ph2(floor(tp*.6)+9.))+.08*step(.985,ph2(floor(tp*.6)+21.));}
       else if(greyC&&val>=.85){mt=1.+(ph2(floor(tp*.5))-.5)*.05+(ph2(floor(tp*.6))-.5)*.04-.05*smoothstep(.4,1.,sin(tp.x*.3+tp.y*.2+ph2(floor(tp/12.))*5.));float sp2=step(.993,ph2(floor(tp*.6)+5.));if(sp2>0.){mossA=max(mossA,sp2*.7);mossC=vec3(1.,1.,1.05);}}
       else if(greyC){float cr=step(.9,ph2(floor(tp)+floor(tp.yx/3.)*5.));mt=1.+(ph2(floor(tp*.5))-.5)*.34+(ph2(floor(tp/3.))-.5)*.2-.28*cr+(ph2(floor(tp*.6))-.5)*.08;sj=cr*top;}
       else if(brownC){mt=1.+(ph2(floor(tp*.6))-.5)*.28+(ph2(floor(tp*.5))-.5)*.16;float pb=step(.93,ph2(floor(tp*1.5)+4.));if(pb>0.){mossA=max(mossA,pb*.65);mossC=vec3(.52,.48,.44)*(.8+.4*ph2(floor(tp*1.5)));}}
       else if(redC){mt=1.+(ph2(floor(tp*.7))-.5)*.3-.2*step(.94,ph2(floor(tp*1.5)+2.));}
       else mt=1.+(ph2(floor(tp*.6))-.5)*.2+(ph2(floor(tp*.5))-.5)*.12;
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
        else{m=1.+(ph2(floor(pp.xz*.5)+floor(pp.y*.5)*17.)-.5)*.26+(ph2(floor(pp.xz/3.)+floor(pp.y/3.)*11.)-.5)*.2;}}
       else if(sat>.18&&val>.25){m=1.+(ph2(floor(pp.xz*.5)+floor(pp.y*.5)*17.)-.5)*.3+(ph2(floor(pp.xz/3.)+floor(pp.y/3.)*11.)-.5)*.18-.14*step(.86,ph2(floor(pp.xz)+floor(pp.y)*7.));}
       else if(wall>.01&&val<=.6){m=1.+(ph2(vec2(floor(hu/2.),floor(hy/8.)))-.5)*.32-.22*step(.78,ph2(vec2(floor(hu),floor(hy/4.))));}
       else if(val>.75){m=1.+(ph2(floor(pp.xz*.5)+floor(pp.y*.5)*13.)-.5)*.07;}
       else{m=1.+(ph2(floor(pp.xz*.5)+floor(pp.y*.5)*17.)-.5)*.2;}}
     {/* v151: AA of procedural patterns */float aaT=0.;
#if __VERSION__>=300 || defined(GL_OES_standard_derivatives)
aaT=length(fwidth(vWp))*16.;
#endif
fade*=1.-smoothstep(.55,1.5,aaT);}diffuseColor.rgb*=mix(1.,m,fade);
     diffuseColor.rgb=mix(diffuseColor.rgb,mossC,mossA*.8*fade*(1.-uSnow*.7));}
    if(uWet>.01&&(PB||PT)){vec3 Vv=normalize(uCam-vWp),Nn=normalize(vNw);float wf=uWet*(PB?(.3*top+.1*wall):.16*top);
     diffuseColor.rgb*=1.-wf;
     float fr=pow(1.-max(dot(Vv,Nn),0.),3.),sp=pow(max(dot(reflect(-Vv,Nn),uSunW),0.),14.)*step(0.,uSunW.y);
     float gl=PB?1.:((greyC||redC)?1.:0.);
     totalEmissiveRadiance+=uWet*top*gl*(vec3(.95,.92,.8)*sp*.5+vec3(.5,.58,.68)*fr*.3);}
   }`:''}
   ${terrain?`/* v140: płynąca lawa — przesuwający się żar, pulsujące świecenie i stygnąca skorupa */if(c0.r>.85&&c0.g>.28&&c0.g<.62&&c0.b<.22){float t=uTime;vec2 p=vWp.xz;float n1=ph2(floor(p*2.+vec2(t*.6,t*.25))),n2=ph2(floor(p*.8-vec2(t*.2,t*.45))+7.);float fl=.5+.5*sin(p.x*1.3+p.y*.9+t*1.6+n2*3.)*sin(p.y*1.1-t*1.1+n1*2.);float cr=step(.74,ph2(floor(p*1.5+vec2(t*.15,t*.05))))*(.6+.4*step(.5,ph2(floor(p*.5))));vec3 hot=mix(vec3(1.,.36,.05),vec3(1.,.85,.3),fl);diffuseColor.rgb=mix(hot,vec3(.2,.08,.05),cr*.85);totalEmissiveRadiance+=mix(hot*(.6+.4*fl),vec3(.06,.015,0.),cr);}`:''}
   float up=vUp;float pz=ph2(floor(vWp.xz*${terrain?'6.':'10.'}+floor(vWp.y*8.)));
   float cover=${terrain?'smoothstep(.1,.35,uSnow*1.4-pz*.9)':'smoothstep(.0,.28,uSnow*1.7-(1.-sj)*.55-pz*.3)'};
   float sn=${terrain?'cover*smoothstep(.35,.7,up)':'smoothstep(.5,.88,up)*cover'};sn*=1.0-step(c0.r*1.08,c0.b)*${terrain?'1.0':'0.0'};sn*=mix(1.,mix(.74,1.,sj),pj);
   diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.93,.96,1.)*(.8+.2*vr),sn*.92);}`)};m.customProgramCacheKey=()=>'seas'+(terrain?'T':'V')+(dec?'D':'')+(bld?'B':'')+(clo?'C':'')+(con?'K':'')+(obj?'O':'')};
const matV=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matV,false);
const matVD=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matVD,false,true);
const matVK=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matVK,false,false,false,false,true);
const matB=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matB,false,false,true);
const matVO=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matVO,false,false,false,false,false,true);
const matC=new THREE.MeshLambertMaterial({vertexColors:true});seasonPatch(matC,false,false,false,true);
const CONK=['pine','cis','bush','bushB'];const DECIDK=['oak','birch','willow','lipa','jesion','buk','modrzew'];
const HFC={on:(function(){try{return localStorage.getItem('hf')!=='0'}catch(e){return true}})(),total:0,removed:0};
/* pamięć: kopie CPU atrybutów geometrii zbędne po wgraniu na GPU; wybieranie klikiem przez AABB */

/* ułatwienia: wzorce materiałów można wyłączyć dla wybranych kolorów/modeli */

const NOPATC={'#f4f0e8':1,'#f0ead6':1,'#f0ece0':1,'#e6dcc0':1};
var VOXNP=false;
function voxGeo(boxes,jit=.06,tagFn){
  if(!boxes.__dz)boxes=deZ(boxes.map(b=>{const c=b.slice();for(const k in b)if(isNaN(k))c[k]=b[k];return c}));
  const pos=[],nor=[],col=[],prt=[],aTt=[],c=new THREE.Color();
  const n=boxes.length,E=1e-4,lo=new Float32Array(n*3),hi=new Float32Array(n*3),ok=new Uint8Array(n);
  for(let i=0;i<n;i++){const b=boxes[i];if(b[3]>0&&b[4]>0&&b[5]>0){ok[i]=1;lo[i*3]=b[0];lo[i*3+1]=b[1];lo[i*3+2]=b[2];hi[i*3]=b[0]+b[3];hi[i*3+1]=b[1]+b[4];hi[i*3+2]=b[2]+b[5]}}
  /* ściana f boxa i jest ukryta, gdy inny box zasłania ją w całości (przecina płaszczyznę ściany i obejmuje jej prostokąt) */
  /* v122: siatka przestrzenna — ścianę sprawdzamy tylko z bryłami w jej okolicy (było: z każdą bryłą modelu, co przy całym mieście dawało setki milionów porównań i przycięcia przy zbliżaniu się) */
  let GR=null,BIG=null,CS=16;if(n>48&&!window.__noGR){GR=new Map();BIG=[];for(let j=0;j<n;j++){if(!ok[j])continue;const x0=Math.floor(lo[j*3]/CS),x1=Math.floor(hi[j*3]/CS),y0=Math.floor(lo[j*3+1]/CS),y1=Math.floor(hi[j*3+1]/CS),z0=Math.floor(lo[j*3+2]/CS),z1=Math.floor(hi[j*3+2]/CS);
      if((x1-x0+1)*(y1-y0+1)*(z1-z0+1)>512){BIG.push(j);continue}for(let x=x0;x<=x1;x++)for(let y=y0;y<=y1;y++)for(let z=z0;z<=z1;z++){const k=(x*4096+y)*4096+z;let L=GR.get(k);if(!L){L=[];GR.set(k,L)}L.push(j)}}}
  const _pt=[0,0,0];
  const hidden=(i,f)=>{const a=f>>1,pl=(f&1)?lo[i*3+a]:hi[i*3+a],u=(a+1)%3,w=(a+2)%3,sg=(f&1)?-1:1;
    const u0=lo[i*3+u]-E,u1=hi[i*3+u]+E,w0=lo[i*3+w]-E,w1=hi[i*3+w]+E;
    if(GR){_pt[a]=pl+sg*E;_pt[u]=(lo[i*3+u]+hi[i*3+u])/2;_pt[w]=(lo[i*3+w]+hi[i*3+w])/2;const k=(Math.floor(_pt[0]/CS)*4096+Math.floor(_pt[1]/CS))*4096+Math.floor(_pt[2]/CS);
      const test=j=>{if(j===i||!ok[j])return false;if(lo[j*3+u]>u0||hi[j*3+u]<u1-2*E||lo[j*3+w]>w0||hi[j*3+w]<w1-2*E)return false;return sg>0?(lo[j*3+a]<=pl+E&&hi[j*3+a]>pl+E):(hi[j*3+a]>=pl-E&&lo[j*3+a]<pl-E)};
      const L=GR.get(k);if(L)for(const j of L)if(test(j))return true;for(const j of BIG)if(test(j))return true;return false}
    for(let j=0;j<n;j++){if(j===i||!ok[j])continue;
      if(lo[j*3+u]>u0||hi[j*3+u]<u1-2*E||lo[j*3+w]>w0||hi[j*3+w]<w1-2*E)continue;
      if(sg>0){if(lo[j*3+a]<=pl+E&&hi[j*3+a]>pl+E)return true}else{if(hi[j*3+a]>=pl-E&&lo[j*3+a]<pl-E)return true}}
    return false};
  boxes.forEach((b,bi)=>{
    if(!ok[bi])return;
    /* v122: gotowy wzór sześcianu zamiast tworzenia BoxGeometry dla każdej bryły */if(!voxGeo.T){const t=new THREE.BoxGeometry(1,1,1).toNonIndexed();voxGeo.T=[Float32Array.from(t.attributes.position.array),Float32Array.from(t.attributes.normal.array)];t.dispose()}
    const sx=b[3]*V,sy=b[4]*V,sz=b[5]*V,ox=(b[0]+b[3]/2)*V,oy=(b[1]+b[4]/2)*V,oz=(b[2]+b[5]/2)*V,TP=voxGeo.T[0];
    const cs6=typeof b[6]==='string'&&b[6].charCodeAt(b[6].length-1)===126,mnD=Math.min(b[3],b[4],b[5]),sh2=b[3]+b[4]+b[5]-mnD-Math.max(b[3],b[4],b[5]);let cm=cs6?1:(VOXNP?2:(mnD<=1.2&&sh2>=5?2:(NOPATC[b[6]]?2:0)));c.set(cs6?b[6].slice(0,-1):b[6]);
    if(!cs6&&!VOXNP&&b[1]<.05&&b[4]<=1.01&&b[3]>=2.5&&b[5]>=2.5){const hs={};c.getHSL(hs);if(hs.h>.17&&hs.h<.45&&hs.s>.22&&hs.l>.18&&hs.l<.6){cm=3;if(b[3]>=8&&b[5]>=8)c.set('#5b8f3a')}}
    const k=(cm===3?1:1+(hash(bi,boxes.length,(b[3]*7)|0)-.5)*jit);
    const nn=voxGeo.T[1];
    for(let f=0;f<6;f++){HFC.total++;if(HFC.on&&n>1&&hidden(bi,f)){HFC.removed++;continue}
      const fa=f>>1,fd=Math.min(120,Math.round(Math.min(b[3+(fa+1)%3],b[3+(fa+2)%3])))+(Math.max(b[3+(fa+1)%3],b[3+(fa+2)%3])>=9?128:0);for(let i=f*18;i<f*18+18;i+=3){aTt.push(fd,cm);pos.push(TP[i]*sx+ox,TP[i+1]*sy+oy,TP[i+2]*sz+oz);nor.push(nn[i],nn[i+1],nn[i+2]);col.push(c.r*k,c.g*k,c.b*k);if(tagFn)prt.push(tagFn(b))}}
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

const FLOWERS=['#d04a6a','#e8c040','#f08aa0','#c05ac0','#ffffff','#e05a3a','#7a8ae0'];

/* ---------- building helpers (vox; 16 per tile; front = +z) ---------- */
const ROOFK=.78;
function gableX(B,x0,z0,w,d,y0,o,sh,step,cA,cB){sh*=ROOFK;let i=0;for(let z1=z0-o,z2=z0+d+o;z2-z1>2;z1+=step,z2-=step,i++)B.push([x0-o,y0+i*sh,z1,w+2*o,sh,z2-z1,i%2?cB:cA]);return y0+i*sh}

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
  if(HFL&&o.floors){const f=Math.max(1,o.floors+HFL);if(f!==o.floors){const st=o.styles;o={...o,floors:f};if(st)o.styles=Array.from({length:f},(_,i)=>st[Math.min(i,st.length-1)])}}
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

function dlugiGen(P,v){const r=houseGen({styles:v===2?['stone']:null,W:48,D:96,iL:4,iR:4,iB:4,iF:6,floors:1,fh:21,ridge:'z',rsh:3,rst:2,ov:4,style:v===4?'log':'timber',gtimber:true,gwin:true,gwin2:false,dw:18,dh:16,chim:[[.5,.25]],shut:v%2===1,flow:v===0,lamp:true},P,v);const B=r.B;
  B.push([2,0,40,2,6,10,P.wood],[1,0,62,3,6,4,'#d8c060']);pHay(B,39,88);pCart(B,1,74);pBarrel(B,40,40);
  return r}
function kamienicaGen(P,v){return houseGen({arcade:v===2||v===4,W:48,D:64,iL:2,iR:2,iB:2,iF:5,floors:4,fh0:18,fh:15,styles:['stone','prussian','prussian','prussian'],jetty:true,jetStep:.9,ridge:'z',rsh:3.6,rst:1.9,ov:1.6,ox:1.6,gtimber:true,gableC:P.brick,gwin:true,gwin2:true,shop:true,shut:v!==1,flow:v!==2,chim:[[.15,.3],[.85,.7]],wsp:22,lamp:true,sign:true,dw:9},P,v)}

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
function deZ(B,EPS=.037){if(B.__dz)return B;
  /* usuwanie migotania (z-fighting): ściany brył zwrócone w tę samą stronę, leżące w jednej płaszczyźnie (różnica < TOL) i nakładające się.
     Dla każdej osi i zwrotu ściany przetwarzamy w kolejności od wewnątrz na zewnątrz (przy równej płaszczyźnie najpierw większe).
     Ściana w konflikcie z już ustaloną wychodzi na zewnątrz tuż za nią (+EPS) i wraca do kolejki — zawsze się kończy, także dla gniazd
     wielu prawie identycznych brył. Dotyczy też brył w tym samym kolorze, bo voxGeo losuje każdej bryle własny odcień.
     EPS celowo poza siatką 0,05, na której leżą współrzędne modeli. */
  const TOL=EPS*.6,OV=EPS*.25,n=B.length;/* OV < EPS: łapie też paski powstałe po wysunięciu sąsiedniej ściany */
  const less=(x,y)=>x[0]<y[0]-1e-9||(Math.abs(x[0]-y[0])<=1e-9&&(x[1]<y[1]||(x[1]===y[1]&&x[2]<y[2])));
  for(let round=0;round<4;round++){let moved=0;
    for(let a=0;a<3;a++){const s0=a+3,a1=(a+1)%3,a2=(a+2)%3,s1=a1+3,s2=a2+3;
      for(let sd=0;sd<2;sd++){const sg=sd?1:-1,H=[];
        const up=k=>{while(k>0){const p=(k-1)>>1;if(!less(H[k],H[p]))break;[H[k],H[p]]=[H[p],H[k]];k=p}},dn=k=>{for(;;){const l=2*k+1,r=l+1;let m=k;if(l<H.length&&less(H[l],H[m]))m=l;if(r<H.length&&less(H[r],H[m]))m=r;if(m===k)break;[H[k],H[m]]=[H[m],H[k]];k=m}};
        const push=e=>{H.push(e);up(H.length-1)},pop=()=>{const t=H[0],l=H.pop();if(H.length){H[0]=l;dn(0)}return t};
        for(let i=0;i<n;i++){const q=B[i];if(!(q[3]>0&&q[4]>0&&q[5]>0))continue;push([sg*(sd?q[a]+q[s0]:q[a]),-(q[s1]*q[s2]),i])}
        const W=[];let w0=0,guard=0;
        while(H.length&&guard++<n*40){const [u,na,i]=pop();while(w0<W.length&&W[w0][0]<u-TOL)w0++;const q=B[i];let mx=null;
          for(let t=w0;t<W.length;t++){const [u2,j]=W[t];if(u-u2>=TOL)continue;const o=B[j];
            if(Math.min(q[a1]+q[s1],o[a1]+o[s1])-Math.max(q[a1],o[a1])>OV&&Math.min(q[a2]+q[s2],o[a2]+o[s2])-Math.max(q[a2],o[a2])>OV&&(mx===null||u2>mx))mx=u2}
          if(mx===null){W.push([u,i]);continue}
          const d=mx+EPS-u;if(sd)q[s0]+=d;else{q[a]-=d;q[s0]+=d}moved++;push([u+d,na,i])}}}
    if(!moved)break}
  B.__dz=1;return B}var GENTYPE='';
/* materiały okien (jak w grze): zgaszone Lambert, zapalone Basic */
const winOff=new THREE.MeshLambertMaterial({color:0x2b2633}),winOn=new THREE.MeshBasicMaterial({color:0xffd27a});

/* --- model budynku: generator -> boxy -> deZ(cutHoles()) -> voxGeo (+ okna jako osobne geometrie) --- */

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

