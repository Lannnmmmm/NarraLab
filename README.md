# NarraLab
### AI-Assisted Novel Production Studio

**From an idea to a story worth reading.**

NarraLab adalah workspace pribadi untuk mengembangkan, menulis, memeriksa, merevisi, dan menyiapkan novel dengan bantuan AI.

## Modul saat ini

- **Production Workspace** — dashboard, pengembangan cerita, dan Character Bible tahap awal.\n- **AI Production Pipeline** — Story Architect, Novel Writer, dan AI Editor dengan alur manual copy-paste tanpa API berbayar.
- **Public Reader** — pembaca publik yang hanya menampilkan bab yang dipilih secara eksplisit melalui `publication.json`.
- **Canon & manuscript repository** — dokumen cerita, naskah, dan riwayat versi tetap disimpan sebagai file Markdown.

## Prinsip utama

1. **Story first** — kualitas cerita lebih penting daripada fitur dekoratif.
2. **Canon is the source of truth** — fakta cerita yang disetujui menjadi acuan.
3. **Human approval** — hasil AI tidak menjadi versi resmi tanpa persetujuan pemilik.
4. **Continuity before convenience** — keadaan cerita harus diperiksa sebelum bab dilanjutkan.
5. **Version everything** — revisi tidak menimpa versi sebelumnya.
6. **Low-cost first** — MVP tidak bergantung pada API AI berbayar atau backend berbayar.

## Struktur repository

- `INSTRUKSI-GPT.md` — aturan kerja AI untuk menulis dan merevisi novel.
- `novels/<slug>/` — seluruh materi tiap novel dipisahkan per proyek: fondasi, canon, outline, bab, dan draf.
- `templates/` — template kosong untuk memulai novel baru.
- `publication.json` — daftar versi final yang dipilih untuk ditampilkan di Public Reader.
- `web/` — aplikasi React, TypeScript, dan Vite untuk workspace serta pembaca publik.
- `.github/workflows/deploy.yml` — pemeriksaan tipe, build, dan deployment ke GitHub Pages.

## Struktur proyek novel

Setiap judul wajib memiliki folder sendiri di `novels/`. Contoh: `novels/takhta-abu/`. Jangan menyimpan canon atau naskah novel tertentu di folder root bersama. Folder `templates/` hanya berisi template kosong.

## Production Workspace tahap awal

Buka menu **Workspace** pada situs. Modul yang tersedia:
- Ringkasan proyek dan progres pengisian fondasi cerita.
- Story Development: judul, genre, target pembaca, premis, sinopsis, tone, dan target kata.
- Character Bible dasar: nama, peran, tujuan, konflik/ketakutan, sifat dan ciri khas.

**Penyimpanan tahap ini bersifat local-first:** data disimpan di localStorage browser yang digunakan dan dapat diekspor sebagai JSON backup. Data ini belum otomatis tersinkron ke GitHub atau perangkat lain. Jangan menganggap localStorage sebagai satu-satunya backup.

## Alur AI Production Pipeline\n\n1. Author memberi ide atau arahan kepada Story Architect.\n2. AI mengembangkan premis, konflik, karakter, dan struktur; Author menyetujui Canon.\n3. Novel Writer menerima Chapter Plan dan konteks, lalu menghasilkan draf.\n4. AI Editor memeriksa kualitas dan kontinuitas.\n5. Author menyetujui hasil; draf disimpan sebagai versi baru.\n\nStudio AI saat ini menyiapkan prompt dan menerima hasil melalui copy-paste. Tidak ada panggilan model otomatis atau sinkronisasi naskah ke GitHub. Hasil disimpan sementara di browser dan dapat diekspor sebagai Markdown.\n\n## Cara menerbitkan bab

Public Reader **tidak otomatis menampilkan versi terbaru**. Pemilik harus memilih versi final secara eksplisit di `publication.json`. File versi yang dipilih wajib memiliki frontmatter `status: final`.

## Alur AI tanpa API berbayar

1. Baca Canon dan ringkasan cerita yang relevan.
2. Siapkan prompt dan konteks untuk ChatGPT.
3. Tulis hasil sebagai versi baru dengan status `draf`.
4. Periksa kontinuitas dan revisi.
5. Pemilik menyetujui versi dengan status `final`.
6. Pemilik memilih versi itu di `publication.json` jika siap diterbitkan.

## Batasan keamanan dan privasi

Repository ini bersifat **public**. Semua file yang di-commit, termasuk draft, Canon, dan riwayat revisi, dapat dibaca melalui GitHub. Manifest publikasi hanya mengatur apa yang disalin ke situs GitHub Pages; manifest **bukan** sistem privasi untuk menyembunyikan file di repository. Jika naskah atau catatan harus benar-benar rahasia, simpan di repository private atau lokasi lokal yang tidak dipublikasikan.
