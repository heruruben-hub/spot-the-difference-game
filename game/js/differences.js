// differences.js — data 10 perbedaan di adegan pelabuhan saat senja.
// Satu perbedaan = satu titik di panel (koordinat canvas 560x420) beserta
// radius kliknya. Panel kiri selalu menampilkan versi "asli", panel kanan
// menampilkan versi yang diubah; scene.js memakai `key` untuk menggambar
// tiap perbedaan secara berbeda di kedua panel.
'use strict';

const PANEL_WIDTH = 560;
const PANEL_HEIGHT = 420;
const TOTAL_DIFFERENCES = 10;

const DIFFERENCES = [
  {
    id: 'lighthouse-beam',
    key: 'beam',
    name: 'Sorot mercusuar',
    hint: 'Lihat ke arah cahaya mercusuar di kiri.',
    x: 175, y: 128, r: 46,
  },
  {
    id: 'sun-rays',
    key: 'rays',
    name: 'Sinar matahari',
    hint: 'Matahari di kanan atas tampak berbeda.',
    x: 445, y: 78, r: 42,
  },
  {
    id: 'gull-missing',
    key: 'gull',
    name: 'Camar ketiga',
    hint: 'Hitung camar di langit.',
    x: 265, y: 95, r: 22,
  },
  {
    id: 'flag-colour',
    key: 'flag',
    name: 'Warna bendera kapal',
    hint: 'Bendera di ujung tiang kapal.',
    x: 440, y: 192, r: 22,
  },
  {
    id: 'buoy-missing',
    key: 'buoy',
    name: 'Pelampung oranye',
    hint: 'Ada yang mengapung di laut kanan bawah.',
    x: 535, y: 355, r: 24,
  },
  {
    id: 'cabin-window',
    key: 'window',
    name: 'Jendela kabin kapal',
    hint: 'Jendela kecil di badan kapal.',
    x: 407, y: 302, r: 18,
  },
  {
    id: 'crate-missing',
    key: 'crate',
    name: 'Peti paling atas',
    hint: 'Tumpukan peti di dermaga.',
    x: 186, y: 265, r: 24,
  },
  {
    id: 'anchor-missing',
    key: 'anchor',
    name: 'Jangkar di dermaga',
    hint: 'Benda besi di ujung dermaga.',
    x: 330, y: 302, r: 24,
  },
  {
    id: 'chimney-smoke',
    key: 'smoke',
    name: 'Asap cerobong gubuk',
    hint: 'Gubuk kecil di kanan, lihat cerobongnya.',
    x: 527, y: 185, r: 26,
  },
  {
    id: 'jumping-fish',
    key: 'fish',
    name: 'Ikan melompat',
    hint: 'Ada percikan di air sebelah kiri bawah.',
    x: 80, y: 365, r: 26,
  },
];

/** Cari perbedaan yang belum ditemukan di titik (x, y) panel, atau null. */
function findDifferenceAt(x, y, foundIds) {
  for (const diff of DIFFERENCES) {
    if (foundIds.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    const reach = diff.r + 10;
    if (dx * dx + dy * dy <= reach * reach) return diff;
  }
  return null;
}
