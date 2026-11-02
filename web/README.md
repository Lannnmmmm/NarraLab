# NarraLab Web

Aplikasi React, TypeScript, dan Vite yang berisi dua permukaan: Production Workspace local-first dan Public Reader.

## Production Workspace

- Diakses melalui menu **Workspace** (`#/studio`).
- Modul awal: Ringkasan, Story Development, dan Character Bible.
- Data disimpan di localStorage browser dan dapat diekspor sebagai JSON backup.
- Data belum disinkronkan ke GitHub atau perangkat lain.
- Jangan menyimpan data rahasia pada repository public. LocalStorage tetap berada di browser lokal, tetapi bukan backup yang tahan kehilangan perangkat/browser.

## AI Production Pipeline\n\n- Tab **Studio AI** menyediakan Story Architect, Novel Writer, dan AI Editor.\n- Prompt dibangun dari data Story Development dan Character Bible yang ada di browser.\n- Pemilik mengirim prompt ke ChatGPT/AI secara manual, lalu menempelkan hasilnya kembali.\n- Hasil dan prompt disimpan sementara di localStorage; hasil dapat diekspor sebagai Markdown.\n- Tidak ada integrasi API/model otomatis, pembacaan Canon dari GitHub, atau commit naskah otomatis pada tahap ini.\n- AI output tetap draf/usulan sampai Author meninjau dan menyetujui.\n\n## Public Reader

Public Reader hanya menampilkan bab yang secara eksplisit dipilih pemilik melalui root `publication.json`. Folder `canon/`, draft, dan versi revisi tidak disalin ke hasil build publik.

Alur build:
1. `scripts/build-index.mjs` membaca manifest `../publication.json`.
2. Script mengambil hanya file versi terpilih dari `../novel/bab-NN/vN.md`.
3. File harus tersedia dan berstatus `final`.
4. Hanya naskah terpilih dan ringkasan opsional yang disalin ke `public/content/`.
5. Vite membangun aplikasi ke `dist/`.

## Menjalankan lokal

Dari root repository:

```bash
cd web
npm install
npm run dev
```

Perintah lain: `npm run typecheck`, `npm run build`, dan `npm run preview`.

## Privasi

Repository NarraLab saat ini public. Semua file sumber yang di-commit, termasuk draft dan Canon, dapat dibaca melalui GitHub. Manifest hanya mengontrol konten GitHub Pages, bukan privasi repository.
