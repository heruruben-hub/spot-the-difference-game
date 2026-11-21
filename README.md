# Senja di Pelabuhan — Cari 10 Perbedaan

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/heruruben-hub/spot-the-difference-game/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/heruruben-hub/spot-the-difference-game/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

Game cari perbedaan orisinal: dua gambar pelabuhan saat senja yang terlihat sama,
padahal menyimpan **10 perbedaan** tersembunyi — sorot mercusuar, sinar matahari,
camar yang hilang, warna bendera, pelampung, jendela kabin, peti, jangkar, asap
cerobong, sampai ikan yang melompat. Semua adegan digambar prosedural dengan
canvas 2D, tanpa gambar atau aset luar.

## Cara bermain

- Klik perbedaan di panel kiri **atau** kanan. Setiap temuan ditandai lingkaran
  hijau bernomor yang muncul di **kedua panel** sekaligus.
- Penghitung "Perbedaan tersisa" dan timer selalu terlihat di bar atas.
- **Petunjuk (H):** salah satu perbedaan yang belum ketemu berkedip kuning
  selama beberapa detik — harganya +20 detik dan -50 poin.
- **Ulang (R):** mulai lagi dari awal. Enter / Spasi untuk mulai.
- Menang saat semua 10 perbedaan ketemu. Skor mulai dari 1000 dan berkurang
  seiring waktu, klik salah (-10 poin), dan petunjuk (-50 poin); selesai di
  bawah 3 menit dapat bonus.

## Menjalankan lokal

```sh
node serve.ts
```

Lalu buka http://localhost:8080 di desktop Chrome. Game sepenuhnya statis
dan offline: tidak ada request jaringan, tidak ada library eksternal.

## Screenshot deterministik

- `?shot=start` — layar awal
- `?shot=play` — tengah permainan, 4 perbedaan sudah ditemukan
- `?shot=end` — layar menang

## Struktur

- `game/index.html` — halaman dan layar mulai/menang
- `game/css/style.css` — tampilan
- `game/js/scene.js` — menggambar adegan pelabuhan (canvas 2D)
- `game/js/differences.js` — data 10 perbedaan
- `game/js/game.js` — logika klik, marker, timer, petunjuk, dan skor
