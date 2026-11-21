// scene.js — menggambar adegan "Senja di Pelabuhan" secara prosedural di canvas 2D.
// Satu fungsi menggambar kedua panel; parameter `side` ('left' | 'right')
// menentukan varian tiap perbedaan dari differences.js. Tidak ada gambar,
// font, atau aset luar: semua bentuk digambar dari kode.
'use strict';

/* ---------- helpers ---------- */

function skyGradient(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, 258);
  g.addColorStop(0, '#3d1e5e');
  g.addColorStop(0.35, '#c94b7c');
  g.addColorStop(0.7, '#ff7e4a');
  g.addColorStop(1, '#ffc46b');
  return g;
}

function seaGradient(ctx) {
  const g = ctx.createLinearGradient(0, 258, 0, 420);
  g.addColorStop(0, '#e08a4e');
  g.addColorStop(0.25, '#7a5a6e');
  g.addColorStop(0.6, '#1d5f73');
  g.addColorStop(1, '#0a3348');
  return g;
}

function drawCloud(ctx, x, y, scale, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#ffd9c2';
  ctx.beginPath();
  ctx.ellipse(x, y, 34 * scale, 12 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 22 * scale, y + 3 * scale, 24 * scale, 10 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 24 * scale, y + 4 * scale, 20 * scale, 9 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawGull(ctx, x, y, scale) {
  ctx.save();
  ctx.strokeStyle = '#2c1b3d';
  ctx.lineWidth = 2.4 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 11 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 7 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 7 * scale, x + 11 * scale, y);
  ctx.stroke();
  ctx.restore();
}

function drawSun(ctx, side) {
  const cx = 445;
  const cy = 78;
  // Halo lembut.
  const halo = ctx.createRadialGradient(cx, cy, 8, cx, cy, 74);
  halo.addColorStop(0, 'rgba(255, 236, 160, 0.85)');
  halo.addColorStop(1, 'rgba(255, 236, 160, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(cx, cy, 74, 0, Math.PI * 2);
  ctx.fill();
  // Perbedaan "sun-rays": sinar hanya ada di panel kiri.
  if (side === 'left') {
    ctx.save();
    ctx.strokeStyle = '#ffe9a3';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * Math.PI * 2;
      const x1 = cx + Math.cos(a) * 40;
      const y1 = cy + Math.sin(a) * 40;
      const x2 = cx + Math.cos(a) * 54;
      const y2 = cy + Math.sin(a) * 54;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.fillStyle = '#fff3b0';
  ctx.beginPath();
  ctx.arc(cx, cy, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffdf6b';
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fill();
}

function drawLighthouse(ctx, side) {
  // Sorot cahaya: perbedaan "lighthouse-beam", hanya di panel kiri.
  if (side === 'left') {
    const beam = ctx.createLinearGradient(84, 128, 268, 128);
    beam.addColorStop(0, 'rgba(255, 244, 170, 0.75)');
    beam.addColorStop(1, 'rgba(255, 244, 170, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(84, 120);
    ctx.lineTo(268, 104);
    ctx.lineTo(268, 152);
    ctx.lineTo(84, 138);
    ctx.closePath();
    ctx.fill();
  }
  // Menara bergaris merah-putih.
  ctx.fillStyle = '#f4ede1';
  ctx.beginPath();
  ctx.moveTo(62, 258);
  ctx.lineTo(70, 138);
  ctx.lineTo(98, 138);
  ctx.lineTo(106, 258);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(65, 226);
  ctx.lineTo(67, 196);
  ctx.lineTo(101, 196);
  ctx.lineTo(103, 226);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(68, 168);
  ctx.lineTo(70, 138);
  ctx.lineTo(98, 138);
  ctx.lineTo(100, 168);
  ctx.closePath();
  ctx.fill();
  // Ruang lampu dan kubah.
  ctx.fillStyle = '#2c1b3d';
  ctx.fillRect(66, 118, 36, 22);
  ctx.fillStyle = '#ffe9a3';
  ctx.fillRect(71, 122, 26, 14);
  ctx.fillStyle = '#c0392b';
  ctx.beginPath();
  ctx.moveTo(62, 118);
  ctx.lineTo(84, 100);
  ctx.lineTo(106, 118);
  ctx.closePath();
  ctx.fill();
  // Batu karang di kaki mercusuar.
  ctx.fillStyle = '#4a3550';
  ctx.beginPath();
  ctx.moveTo(30, 258);
  ctx.quadraticCurveTo(48, 232, 72, 244);
  ctx.quadraticCurveTo(92, 230, 118, 246);
  ctx.quadraticCurveTo(132, 258, 128, 262);
  ctx.lineTo(30, 262);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5d4666';
  ctx.beginPath();
  ctx.ellipse(58, 252, 16, 7, 0, 0, Math.PI * 2);
  ctx.ellipse(102, 254, 13, 6, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawHut(ctx, side) {
  // Gubuk nelayan di tepi kanan.
  ctx.fillStyle = '#6b4226';
  ctx.beginPath();
  ctx.moveTo(468, 258);
  ctx.lineTo(468, 226);
  ctx.lineTo(540, 226);
  ctx.lineTo(540, 258);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#8e2f23';
  ctx.beginPath();
  ctx.moveTo(460, 228);
  ctx.lineTo(504, 200);
  ctx.lineTo(548, 228);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffe9a3';
  ctx.fillRect(482, 236, 14, 14);
  ctx.fillRect(512, 236, 14, 14);
  ctx.strokeStyle = '#2c1b3d';
  ctx.lineWidth = 2;
  ctx.strokeRect(482, 236, 14, 14);
  ctx.strokeRect(512, 236, 14, 14);
  // Cerobong + asap: perbedaan "chimney-smoke", asap hanya di panel kiri.
  ctx.fillStyle = '#4a3550';
  ctx.fillRect(524, 204, 10, 20);
  if (side === 'left') {
    ctx.fillStyle = 'rgba(230, 220, 225, 0.75)';
    ctx.beginPath();
    ctx.arc(524, 196, 7, 0, Math.PI * 2);
    ctx.arc(530, 184, 9, 0, Math.PI * 2);
    ctx.arc(524, 170, 11, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDock(ctx, side) {
  // Dermaga kayu.
  ctx.fillStyle = '#7a4a21';
  ctx.fillRect(120, 298, 240, 12);
  ctx.fillStyle = '#8f5a2b';
  for (let x = 120; x < 360; x += 24) {
    ctx.fillRect(x, 298, 20, 12);
    ctx.fillStyle = '#5d3a1a';
    ctx.fillRect(x + 20, 298, 2, 12);
    ctx.fillStyle = '#8f5a2b';
  }
  ctx.fillStyle = '#5d3a1a';
  for (const x of [138, 206, 274, 342]) {
    ctx.fillRect(x, 310, 8, 44);
    ctx.beginPath();
    ctx.arc(x + 4, 310, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  // Peti di dermaga: perbedaan "crate-missing", peti atas hanya di panel kiri.
  ctx.fillStyle = '#b07a2e';
  ctx.fillRect(158, 276, 26, 22);
  ctx.fillRect(188, 276, 26, 22);
  ctx.strokeStyle = '#6b4423';
  ctx.lineWidth = 2;
  ctx.strokeRect(158, 276, 26, 22);
  ctx.strokeRect(188, 276, 26, 22);
  if (side === 'left') {
    ctx.fillStyle = '#c98f3a';
    ctx.fillRect(173, 254, 26, 22);
    ctx.strokeRect(173, 254, 26, 22);
  }
  // Jangkar: perbedaan "anchor-missing", hanya di panel kiri.
  if (side === 'left') {
    ctx.save();
    ctx.translate(330, 302);
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(0, -12, 5, 0, Math.PI * 2);
    ctx.moveTo(0, -7);
    ctx.lineTo(0, 12);
    ctx.moveTo(-13, 2);
    ctx.quadraticCurveTo(-12, 14, 0, 14);
    ctx.quadraticCurveTo(12, 14, 13, 2);
    ctx.moveTo(-13, 2);
    ctx.lineTo(-17, -4);
    ctx.moveTo(13, 2);
    ctx.lineTo(17, -4);
    ctx.stroke();
    ctx.restore();
  }
}

function drawBoat(ctx, side) {
  // Lambung kapal, mengapung di kanan dermaga.
  ctx.fillStyle = '#274b63';
  ctx.beginPath();
  ctx.moveTo(380, 312);
  ctx.lineTo(470, 312);
  ctx.lineTo(458, 336);
  ctx.lineTo(392, 336);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(380, 312, 90, 5);
  // Kabin dan jendela: perbedaan "cabin-window", menyala di kiri, gelap di kanan.
  ctx.fillStyle = '#f4ede1';
  ctx.fillRect(390, 292, 34, 20);
  ctx.fillStyle = side === 'left' ? '#ffe9a3' : '#2c3e50';
  ctx.beginPath();
  ctx.arc(407, 302, 6, 0, Math.PI * 2);
  ctx.fill();
  if (side === 'left') {
    const glow = ctx.createRadialGradient(407, 302, 2, 407, 302, 16);
    glow.addColorStop(0, 'rgba(255, 233, 163, 0.6)');
    glow.addColorStop(1, 'rgba(255, 233, 163, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(407, 302, 16, 0, Math.PI * 2);
    ctx.fill();
  }
  // Tiang, layar, dan bendera: perbedaan "flag-colour", merah di kiri, biru di kanan.
  ctx.fillStyle = '#5d3a1a';
  ctx.fillRect(423, 195, 5, 117);
  ctx.fillStyle = '#f7ead7';
  ctx.beginPath();
  ctx.moveTo(430, 202);
  ctx.lineTo(430, 300);
  ctx.lineTo(462, 300);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = side === 'left' ? '#c0392b' : '#2471a3';
  ctx.beginPath();
  ctx.moveTo(428, 190);
  ctx.lineTo(452, 196);
  ctx.lineTo(428, 202);
  ctx.closePath();
  ctx.fill();
}

function drawSeaLife(ctx, side) {
  // Pantulan matahari di air, di bawah lambung kapal (sama di kedua panel).
  ctx.fillStyle = 'rgba(255, 220, 130, 0.5)';
  for (let i = 0; i < 6; i += 1) {
    const y = 346 + i * 10;
    const w = 58 - i * 6;
    ctx.fillRect(445 - w / 2, y, w, 4);
  }
  // Riak air.
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  for (const [x, y, w] of [[180, 330, 60], [260, 380, 70], [360, 385, 54], [470, 395, 52], [150, 395, 44]]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + w / 2, y - 5, x + w, y);
    ctx.stroke();
  }
  // Pelampung: perbedaan "buoy-missing", hanya di panel kiri.
  if (side === 'left') {
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(535, 355, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f4ede1';
    ctx.fillRect(522, 351, 26, 7);
    ctx.fillStyle = '#2c1b3d';
    ctx.fillRect(533, 338, 4, 8);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(535, 370, 18, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Ikan melompat: perbedaan "jumping-fish", hanya di panel kiri.
  if (side === 'left') {
    ctx.save();
    ctx.translate(80, 358);
    ctx.rotate(-0.5);
    ctx.fillStyle = '#7fb3c8';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(-20, -7);
    ctx.lineTo(-20, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(68, 374, 10, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(92, 376, 8, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  }
}

/** Gambar seluruh adegan untuk satu panel. `side` = 'left' atau 'right'. */
function drawHarborScene(ctx, side) {
  ctx.save();
  // Langit dan laut.
  ctx.fillStyle = skyGradient(ctx);
  ctx.fillRect(0, 0, PANEL_WIDTH, 258);
  ctx.fillStyle = seaGradient(ctx);
  ctx.fillRect(0, 258, PANEL_WIDTH, PANEL_HEIGHT - 258);
  // Awan dan matahari.
  drawCloud(ctx, 120, 52, 1, 0.9);
  drawCloud(ctx, 300, 38, 0.7, 0.7);
  drawCloud(ctx, 500, 108, 0.8, 0.55);
  drawSun(ctx, side);
  // Camar: perbedaan "gull-missing", camar ketiga hanya di panel kiri.
  drawGull(ctx, 150, 85, 1);
  drawGull(ctx, 205, 62, 0.8);
  if (side === 'left') drawGull(ctx, 265, 95, 0.9);
  // Garis cakrawala dan kapal jauh.
  ctx.fillStyle = '#5d3a5e';
  ctx.fillRect(0, 256, PANEL_WIDTH, 3);
  ctx.fillStyle = '#3d2b4d';
  ctx.beginPath();
  ctx.moveTo(196, 256);
  ctx.lineTo(196, 240);
  ctx.lineTo(200, 240);
  ctx.lineTo(200, 256);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(188, 256);
  ctx.lineTo(214, 256);
  ctx.lineTo(208, 246);
  ctx.lineTo(194, 246);
  ctx.closePath();
  ctx.fill();
  // Daratan, bangunan, dermaga, kapal, dan kehidupan laut.
  drawLighthouse(ctx, side);
  drawHut(ctx, side);
  drawSeaLife(ctx, side);
  drawBoat(ctx, side);
  drawDock(ctx, side);
  ctx.restore();
}
