// game.js — logika "Senja di Pelabuhan": klik, marker, penghitung, timer,
// petunjuk (hint), layar mulai/menang, keyboard, dan adegan screenshot
// deterministik lewat ?shot=start|play|end&seed=1.
'use strict';

const HINT_TIME_PENALTY_SECONDS = 20;
const HINT_SCORE_PENALTY = 50;
const WRONG_SCORE_PENALTY = 10;
const HINT_PULSE_MS = 2600;
const HINT_COOLDOWN_MS = 4000;
const WIN_TIME_LIMIT_SECONDS = 300;

const $ = (id) => document.getElementById(id);

const leftCanvas = $('panel-left');
const rightCanvas = $('panel-right');
const leftCtx = leftCanvas.getContext('2d');
const rightCtx = rightCanvas.getContext('2d');

const state = {
  screen: 'start', // 'start' | 'play' | 'win'
  found: new Set(),
  foundOrder: [],
  wrongClicks: 0,
  hintsUsed: 0,
  score: 1000,
  elapsedMs: 0,
  running: false,
  lastTick: 0,
  hint: null, // { diff, until }
  hintCooldownUntil: 0,
  pops: [], // { diff, startedAt } animasi marker baru
  miss: null, // { x, y, side, until } tanda X merah
  shot: null, // 'start' | 'play' | 'end' saat mode screenshot
};

/* ---------- util ---------- */

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return String(m).padStart(2, '0') + ':' + String(rest).padStart(2, '0');
}

function remainingCount() {
  return TOTAL_DIFFERENCES - state.found.size;
}

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ---------- HUD ---------- */

function updateHud() {
  const remaining = remainingCount();
  const counter = $('counter-value');
  counter.textContent = remaining + ' / ' + TOTAL_DIFFERENCES;
  counter.classList.toggle('done', remaining === 0);
  $('counter-label').textContent = remaining === 0 ? 'Semua ketemu!' : 'Perbedaan tersisa';
  const timer = $('timer-value');
  timer.textContent = formatTime(state.elapsedMs / 1000);
  timer.classList.toggle('low-time', state.elapsedMs / 1000 > WIN_TIME_LIMIT_SECONDS - 60 && state.screen === 'play');
  $('score-value').textContent = String(Math.max(0, state.score));
  $('hint-button').disabled = state.screen !== 'play' || remaining === 0;
  const names = state.foundOrder.map((id) => {
    const d = DIFFERENCES.find((item) => item.id === id);
    return d ? d.name : id;
  });
  $('found-list').textContent = names.length > 0
    ? 'Ketemu: ' + names.join(' · ')
    : 'Belum ada yang ketemu — klik perbedaan di salah satu panel.';
}

/* ---------- gambar ---------- */

function drawMarkers(ctx, side, now) {
  for (const id of state.foundOrder) {
    const diff = DIFFERENCES.find((item) => item.id === id);
    if (!diff) continue;
    const pop = state.pops.find((p) => p.diff.id === id);
    let scale = 1;
    if (pop) {
      const age = now - pop.startedAt;
      scale = age < 220 ? 0.6 + (age / 220) * 0.55 : 1.15 - Math.min(0.15, (age - 220) / 1500);
    }
    const r = (diff.r + 7) * scale;
    ctx.save();
    ctx.strokeStyle = '#7ee2a0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, r + 3, 0, Math.PI * 2);
    ctx.stroke();
    // Nomor urutan penemuan di tengah marker.
    const order = state.foundOrder.indexOf(id) + 1;
    ctx.fillStyle = '#1c1030';
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7ee2a0';
    ctx.font = 'bold 13px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(order), diff.x, diff.y + 0.5);
    ctx.restore();
  }
  // Tanda X merah untuk klik yang salah.
  if (state.miss && state.miss.side === side && now < state.miss.until) {
    const { x, y } = state.miss;
    ctx.save();
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 10, y - 10);
    ctx.lineTo(x + 10, y + 10);
    ctx.moveTo(x + 10, y - 10);
    ctx.lineTo(x - 10, y + 10);
    ctx.stroke();
    ctx.restore();
  }
  // Denyut petunjuk: cincin berkedip di perbedaan yang belum ditemukan.
  if (state.hint && now < state.hint.until) {
    const diff = state.hint.diff;
    const phase = (now % 500) / 500;
    const pulse = 0.55 + 0.45 * Math.sin(phase * Math.PI * 2);
    ctx.save();
    ctx.globalAlpha = 0.45 + 0.55 * pulse;
    ctx.strokeStyle = '#ffd23f';
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 7]);
    ctx.beginPath();
    ctx.arc(diff.x, diff.y, diff.r + 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function render(now) {
  drawHarborScene(leftCtx, 'left');
  drawHarborScene(rightCtx, 'right');
  drawMarkers(leftCtx, 'left', now);
  drawMarkers(rightCtx, 'right', now);
}

function frame(now) {
  if (state.running) {
    state.elapsedMs += now - state.lastTick;
  }
  state.lastTick = now;
  render(now);
  updateHud();
  window.requestAnimationFrame(frame);
}

/* ---------- aksi permainan ---------- */

function canvasPoint(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * PANEL_WIDTH;
  const y = ((event.clientY - rect.top) / rect.height) * PANEL_HEIGHT;
  return { x, y };
}

function onPanelClick(event, side) {
  if (state.screen !== 'play') return;
  const canvas = side === 'left' ? leftCanvas : rightCanvas;
  const { x, y } = canvasPoint(event, canvas);
  const diff = findDifferenceAt(x, y, state.found);
  if (diff) {
    state.found.add(diff.id);
    state.foundOrder.push(diff.id);
    state.pops.push({ diff, startedAt: performance.now() });
    showToast('Ketemu! ' + diff.name + ' (' + state.found.size + '/' + TOTAL_DIFFERENCES + ')');
    if (remainingCount() === 0) winGame();
  } else {
    state.wrongClicks += 1;
    state.score = Math.max(0, state.score - WRONG_SCORE_PENALTY);
    state.miss = { x, y, side, until: performance.now() + 700 };
    canvas.classList.remove('shake');
    void canvas.offsetWidth;
    canvas.classList.add('shake');
    showToast('Bukan di situ — coba perhatikan lagi.');
  }
}

function useHint() {
  if (state.screen !== 'play' || remainingCount() === 0) return;
  const now = performance.now();
  if (now < state.hintCooldownUntil) return;
  const unfound = DIFFERENCES.filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return;
  // Pilih perbedaan yang belum ditemukan secara acak.
  const diff = unfound[Math.floor(Math.random() * unfound.length)];
  state.hint = { diff, until: now + HINT_PULSE_MS };
  state.hintCooldownUntil = now + HINT_COOLDOWN_MS;
  state.hintsUsed += 1;
  state.score = Math.max(0, state.score - HINT_SCORE_PENALTY);
  state.elapsedMs += HINT_TIME_PENALTY_SECONDS * 1000;
  showToast('Petunjuk: ' + diff.hint + ' (+' + HINT_TIME_PENALTY_SECONDS + ' dtk, -' + HINT_SCORE_PENALTY + ' poin)');
}

function computeScore() {
  const seconds = Math.floor(state.elapsedMs / 1000);
  let score = 1000 - seconds * 3 - state.wrongClicks * WRONG_SCORE_PENALTY - state.hintsUsed * HINT_SCORE_PENALTY;
  if (seconds <= 120) score += 200;
  else if (seconds <= 180) score += 100;
  return Math.max(100, score);
}

function startGame() {
  state.screen = 'play';
  state.found = new Set();
  state.foundOrder = [];
  state.pops = [];
  state.miss = null;
  state.hint = null;
  state.wrongClicks = 0;
  state.hintsUsed = 0;
  state.score = 1000;
  state.elapsedMs = 0;
  state.running = true;
  state.lastTick = performance.now();
  $('start-overlay').classList.add('hidden');
  $('win-overlay').classList.add('hidden');
  showToast('Cari 10 perbedaan — klik di panel kiri atau kanan!');
}

function winGame() {
  state.screen = 'win';
  state.running = false;
  state.score = computeScore();
  const seconds = Math.floor(state.elapsedMs / 1000);
  $('win-time').textContent = formatTime(seconds);
  $('win-score').textContent = String(state.score);
  $('win-wrong').textContent = String(state.wrongClicks);
  $('win-hints').textContent = String(state.hintsUsed);
  $('win-title').textContent = seconds <= 180
    ? 'Luar biasa! Senja berhasil diabadikan.'
    : 'Menang! Semua perbedaan ketemu.';
  $('win-overlay').classList.remove('hidden');
}

/* ---------- adegan screenshot (?shot=...) ---------- */

function stageShot(shot) {
  state.shot = shot;
  if (shot === 'start') {
    state.screen = 'start';
    state.running = false;
    $('start-overlay').classList.remove('hidden');
    return;
  }
  if (shot === 'play') {
    // Tengah permainan: 4 perbedaan sudah ditemukan, 6 tersisa.
    startGame();
    const preset = ['lighthouse-beam', 'gull-missing', 'cabin-window', 'anchor-missing'];
    for (const id of preset) {
      const diff = DIFFERENCES.find((d) => d.id === id);
      state.found.add(id);
      state.foundOrder.push(id);
      state.pops.push({ diff, startedAt: performance.now() - 1000 });
    }
    state.elapsedMs = 83 * 1000; // 01:23
    state.running = false; // beku supaya screenshot stabil
    state.score = 1000;
    return;
  }
  if (shot === 'end') {
    startGame();
    for (const diff of DIFFERENCES) {
      state.found.add(diff.id);
      state.foundOrder.push(diff.id);
      state.pops.push({ diff, startedAt: performance.now() - 1000 });
    }
    state.elapsedMs = 167 * 1000; // 02:47
    state.wrongClicks = 2;
    state.hintsUsed = 1;
    state.running = false;
    winGame();
  }
}

/* ---------- wiring ---------- */

leftCanvas.addEventListener('click', (event) => onPanelClick(event, 'left'));
rightCanvas.addEventListener('click', (event) => onPanelClick(event, 'right'));
$('hint-button').addEventListener('click', useHint);
$('restart-button').addEventListener('click', startGame);
$('start-button').addEventListener('click', startGame);
$('again-button').addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'h') useHint();
  else if (key === 'r') startGame();
  else if ((key === 'enter' || key === ' ') && state.screen !== 'play') {
    event.preventDefault();
    startGame();
  }
});

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot === 'start' || shot === 'play' || shot === 'end') {
  stageShot(shot);
} else {
  state.lastTick = performance.now();
}
updateHud();
window.requestAnimationFrame(frame);
