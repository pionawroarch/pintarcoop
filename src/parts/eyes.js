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
