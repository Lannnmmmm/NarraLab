# NarraLab Public Reader

Aplikasi pembaca publik berbasis React, TypeScript, dan Vite. Aplikasi ini hanya menampilkan bab yang secara eksplisit dipilih pemilik melalui `../publication.json`.

## Batas tanggung jawab

- Aplikasi ini adalah **Public Reader**, bukan workspace produksi novel.
- Penulisan, pengembangan cerita, Canon, dan revisi dikelola di luar aplikasi pembaca.
- Folder `canon/` tidak dibaca atau disalin ke hasil build publik.
- Draft dan versi revisi tidak disalin ke hasil build publik.
- Versi yang diterbitkan harus dipilih secara eksplisit di root `publication.json` dan memiliki frontmatter `status: final`.

## Alur build publik

1. `scripts/build-index.mjs` membaca manifest `../publication.json`.
2. Untuk setiap entri, script mengambil hanya file versi yang dipilih dari `../novel/bab-NN/vN.md`.
3. Script memvalidasi bahwa file tersedia dan berstatus `final`.
4. Hanya naskah terpilih dan ringkasan bab opsional yang disalin ke `public/content/`.
5. Vite membangun aplikasi ke `dist/`; GitHub Actions menjalankan typecheck, build, dan deployment ke GitHub Pages.

Contoh manifest di root repository:

```json
{
  "chapters": {
    "bab-01": 2,
    "bab-02": 1
  }
}
```

Manifest kosong berarti belum ada bab yang diterbitkan. Menghapus entri akan menarik bab tersebut dari situs pada build berikutnya.

## Fitur pembaca

- Tema terang, gelap, atau mengikuti sistem.
- Pengaturan ukuran huruf, jenis huruf, dan lebar teks yang tersimpan di browser.
- Daftar bab terbit dan metadata bacaan.
- Pembaca Markdown, progres baca, navigasi antar bab, dan ringkasan opsional.
- Pengingat posisi baca terakhir.

## Menjalankan lokal

Dari root repository:

```bash
cd web
npm install
npm run dev
```

Perintah lain:

```bash
npm run typecheck
npm run build
npm run preview
```

`npm run dev` dan `npm run build` menjalankan generator indeks publik terlebih dahulu.

## Deployment

GitHub Actions menggunakan workflow `.github/workflows/deploy.yml`. Pastikan GitHub Pages menggunakan **Build and deployment → Source: GitHub Actions**.

## Keamanan dan privasi

Penyaringan ini hanya mengatur isi yang disalin ke GitHub Pages. Repository NarraLab saat ini public, sehingga semua file sumber yang di-commit—termasuk draft dan Canon—tetap dapat dibaca melalui GitHub. Jangan menyimpan materi rahasia di repository public.

Markdown diproses melalui `src/markdown.ts`; pertahankan sanitasi HTML dan URL ketika mengubah pipeline rendering.
