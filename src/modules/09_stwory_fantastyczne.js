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



