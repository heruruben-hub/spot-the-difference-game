// Senja di Pelabuhan — our entry for the make.fun "best spot the difference" bounty.
// The game is a hand-drawn harbour at dusk, painted procedurally on canvas: two panels
// side by side show the same sunset scene, and the player hunts for ten quiet differences
// between them — a missing boat here, a recoloured lantern there. Clicking a real difference
// circles it on both panels; a counter shows how many are left, a timer keeps the pressure
// on, and a hint button briefly flashes the area of an unfound difference. Find all ten and
// the win screen appears.
//
// This program is the hand-in step. It copies the finished game (game/) and the screenshots
// we rendered from it (screenshots/) into the output folder, then writes dossier.json —
// the summary the judge reads — using the vendored make.fun library. Run it locally with
// MAKEFUN_OUTPUT_DIR set to a scratch folder to check the output before submitting.
import { readdirSync } from 'node:fs';

// A working best-game-01 entry (Node 22, standard library only): the game is this directory's
// game/ folder, plain static files a desktop browser loads offline (game/index.html and its ES
// modules, no library and no network request), and the program hands it in. It copies game/ and
// screenshots/ from beside this file to /output and writes /output/dossier.json, the summary the
// judge reads, with the vendored make.fun library. A starting point, not a winner: Block Dodger, a
// plain 2D canvas game where a paddle dodges falling blocks and catches coins, with a title screen,
// score, lives and levels, game over and restart, flat colours and no sound. Build your own game
// (any genre, any library you vendor under game/, or none), put your 3 or 4 PNG or JPEG screenshots
// in screenshots/ (the first by name is the cover) and run it.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB of game
// files, in all, or a path under game/ over 1000 bytes: game/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

// A one-line build summary for the person running this by hand: the game name plus how many
// screenshots were handed in alongside it, so a glance at the terminal confirms the entry
// is complete without opening the output folder.
const shotDir = join(here, 'screenshots');
const shotCount = existsSync(shotDir)
  ? readdirSync(shotDir).filter((name) => /\.(png|jpe?g)$/i.test(name)).length
  : 0;
console.log(`Senja di Pelabuhan — handed in game/ plus ${shotCount} screenshot(s) and dossier.json.`);
