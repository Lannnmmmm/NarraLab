# NarraLab
### AI-Assisted Novel Production Studio

**From an idea to a story worth reading.**

NarraLab adalah workspace pribadi untuk mengembangkan, menulis, memeriksa, merevisi, dan menyiapkan novel dengan bantuan AI. Repository ini berisi sistem kerja novel, data cerita, dan aplikasi pembaca publik.

## Prinsip utama

1. **Story first** — kualitas cerita lebih penting daripada fitur dekoratif.
2. **Canon is the source of truth** — fakta cerita yang disetujui menjadi acuan.
3. **Human approval** — hasil AI tidak menjadi versi resmi tanpa persetujuan pemilik.
4. **Continuity before convenience** — keadaan cerita harus diperiksa sebelum bab dilanjutkan.
5. **Version everything** — revisi tidak menimpa versi sebelumnya.
6. **Low-cost first** — MVP tidak bergantung pada API AI berbayar atau backend berbayar.

## Struktur repository

- `INSTRUKSI-GPT.md` — aturan kerja AI untuk menulis dan merevisi novel.
- `canon/` — dokumen internal cerita: premis, dunia, karakter, plot, gaya, timeline, dan status objek.
- `novel/` — naskah per bab dan riwayat versinya.
- `publication.json` — daftar versi final yang dipilih untuk ditampilkan di Public Reader.
- `web/` — aplikasi pembaca berbasis React, TypeScript, dan Vite.
- `.github/workflows/deploy.yml` — pemeriksaan tipe, build, dan deployment ke GitHub Pages.

## Cara menerbitkan bab

Public Reader **tidak otomatis menampilkan versi terbaru**. Pemilik harus memilih versi final secara eksplisit di `publication.json`.

Contoh:

```json
{
  "chapters": {
    "bab-01": 2,
    "bab-02": 1
  }
}
```

Artinya Bab 1 menerbitkan `novel/bab-01/v2.md` dan Bab 2 menerbitkan `novel/bab-02/v1.md`. File versi yang dipilih wajib memiliki frontmatter `status: final`. Jika versi tidak ditemukan atau belum final, proses build akan gagal agar naskah yang salah tidak terbit.

Untuk menarik bab dari situs, hapus entri bab tersebut dari `publication.json`.

## Alur AI tanpa API berbayar

1. Baca Canon dan ringkasan cerita yang relevan.
2. Siapkan prompt dan konteks untuk ChatGPT.
3. Tulis hasil sebagai versi baru dengan status `draf`.
4. Periksa kontinuitas dan revisi.
5. Pemilik menyetujui versi dengan status `final`.
6. Pemilik memilih versi itu di `publication.json` jika siap diterbitkan.

## Batasan keamanan dan publikasi

Repository ini bersifat **public**. Semua file yang di-commit, termasuk draft, Canon, dan riwayat revisi, dapat dibaca melalui GitHub. Manifest publikasi hanya mengatur apa yang disalin ke situs GitHub Pages; manifest **bukan** sistem privasi untuk menyembunyikan file di repository.

Jika naskah atau catatan harus benar-benar rahasia, simpan di repository private atau lokasi lokal yang tidak dipublikasikan.
