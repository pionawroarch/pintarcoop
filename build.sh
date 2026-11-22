#!/usr/bin/env bash
# Składa grę w jeden plik index.html: src/template.html + src/worker.js + src/main.js + src/parts/*.js
set -e
cd "$(dirname "$0")/src"
python3 - <<'P'
R=lambda f:open(f,encoding='utf8').read()
t=R('template.html');cp=R('parts/cityplan.js');w=R('worker.js').replace('/*CITYPLAN*/',cp)
m=R('main.js').replace('/*CITYPLAN*/',cp).replace('/*LANDMARKS*/',R('parts/landmarks.js')).replace('/*BIODECO*/',R('parts/biodeco.js')).replace('/*STRUCTS2*/',R('parts/structs.js')).replace('/*CREATURES2*/',R('parts/creatures.js')).replace('/*TRADE2*/',R('parts/trade.js')+R('parts/garrison.js')+R('parts/racehouses.js')).replace('/*MUSIC2*/',R('parts/music.js'))
assert '</script' not in w and '</script' not in m
open('../index.html','w',encoding='utf8').write(t.replace('/*WORKER*/',w).replace('/*MAIN*/',m))
print('index.html gotowy')
P
