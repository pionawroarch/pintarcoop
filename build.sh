#!/usr/bin/env bash
# Składa grę w jeden plik index.html: src/template.html + src/worker.js + src/main.js
set -e
cd "$(dirname "$0")"
python3 - <<'P'
t=open('src/template.html').read();w=open('src/worker.js').read();m=open('src/main.js').read()
assert '</script' not in w and '</script' not in m
open('index.html','w').write(t.replace('/*WORKER*/',w).replace('/*MAIN*/',m))
print('index.html gotowy')
P
