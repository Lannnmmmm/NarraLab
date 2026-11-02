# NarraLab Web

Aplikasi pembaca naskah (React + TypeScript + Vite). Aplikasi ini **hanya membaca**: semua tulisan dibuat dan direvisi GPT langsung di folder `novel/` dan `canon/` pada repo.

## Cara kerja

1. `scripts/build-index.mjs` memindai `../novel` dan `../canon`, membaca frontmatter, memilih versi tertinggi tiap bab (`v2` mengalahkan `v1`), lalu menulis `public/content/index.json` beserta salinan file Markdown.
2. Aplikasi memuat `index.json` dan menampilkan daftar bab, pembaca dengan riwayat versi, dan dokumen Canon.
3. Setiap push ke `main` memicu GitHub Actions (`.github/workflows/deploy.yml`) yang membangun ulang situs dan men-deploy ke GitHub Pages.

## Fitur

- Tema terang, gelap, atau ikut sistem (tanpa kedip saat dimuat).
- Pengaturan membaca: ukuran huruf, jenis huruf (serif/sans), lebar teks. Tersimpan di browser.
- Pemilih versi per bab, dengan banner saat membaca versi lama dan catatan revisi.
- Ringkasan bab, bilah progres, navigasi bab dengan tombol panah kiri/kanan.
- Halaman Canon (premis, dunia, karakter, plot, gaya, status objek, timeline).
- Filter "Hanya bab final" dan tombol "Lanjutkan membaca".

## Menjalankan lokal

```bash
cd web
npm install
npm run dev        # indeks dibuat otomatis, lalu server dev berjalan
npm run build      # hasil di web/dist
npm run typecheck  # pemeriksaan tipe TypeScript
```

## Mengaktifkan GitHub Pages (sekali saja)

Di GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Keamanan konten

Naskah ditulis AI dan repo ini publik, jadi HTML mentah di dalam Markdown tidak dirender (tampil sebagai teks), gambar jarak jauh tidak dimuat, dan tautan `javascript:` dibuang. Lihat `src/markdown.ts`.
