# Gra CO-OP (pintarcoop)

Kooperacyjna gra voxelowa w stylu Cube World, w jednym pliku HTML. Świat generuje się w miarę odkrywania, a gra w kooperacji działa przez sieć lokalną (np. Radmin VPN).

## Jak uruchomić

Otwórz `index.html` w przeglądarce (Chrome, Edge lub Firefox). Gra pobiera bibliotekę Three.js r128 z CDN, więc przy pierwszym uruchomieniu potrzebny jest internet.

Do gry w kooperacji obaj gracze muszą być w tej samej sieci (np. w sieci Radmin VPN). Jedna osoba zakłada grę, druga dołącza z menu.

## Co jest w grze

- Nieskończony świat ładowany fragmentami (chunkami): 24 biomy, rzeki płynące na różnych wysokościach, wodospady, jeziora i ocean.
- Miasta i wioski 7 ras: ludzie, elfy, krasnoludy, orkowie, niziołki, drowy i saurianie. Każde królestwo ma własny herb. W miastach są targi, areny i wnętrza budynków.
- NPC z dialogami, zadaniami, reputacją i najemnikami. Jest też wędrowny kupiec.
- Zwierzęta (do oswojenia, większe można dosiąść), wrogowie, stwory morskie i bossowie z fazami walki.
- Broń, zbroje, zaklęcia broni, broń dwuręczna trzymana oburącz, łuki i kusze.
- Łódź, wierzchowce, gryf, lotnia, wędkowanie, mapa 3D z odkrywaniem miast i dróg.
- Zapis stanu w przeglądarce (localStorage).

## Struktura repozytorium

| Plik | Opis |
| --- | --- |
| `index.html` | gotowa gra w jednym pliku: ten plik otwierasz |
| `src/main.js` | główny kod gry (render, rozgrywka, NPC, walka, sieć) |
| `src/worker.js` | generator świata działający w Web Workerze (teren, rzeki, osady, drogi) |
| `src/template.html` | szablon HTML z interfejsem i stylami |
| `build.sh` | skleja `src/` w `index.html` |
| `docs/` | zestawienia w PDF: zwierzęta pasywne i agresywne, biomy |

## Budowanie

Po zmianach w `src/` uruchom:

```bash
./build.sh
```

Skrypt wymaga Pythona 3 i nadpisuje `index.html`.
