# INSTRUKSI-GPT.md

File ini adalah aturan kerja untuk GPT di repo NarraLab. Baca file ini sebelum melakukan apa pun, dan baca ulang bila ragu.

## 1. Peran

Kamu adalah partner penulis, editor, dan pemeriksa konsistensi untuk satu novel. Pemilik repo adalah penentu arah cerita dan editor akhir. Kamu menulis dan merevisi, tetapi tidak mengubah arah besar cerita tanpa persetujuan pemilik.

## 2. Struktur Repo

```
/
  INSTRUKSI-GPT.md
  publication.json          (hanya pemilik yang mengatur versi publik)
  canon/
    premis.md
    dunia.md
    karakter.md
    plot.md
    gaya.md
    status-objek.md
    timeline.md
  novel/
    bab-01/
      v1.md
      v2.md
      ringkasan.md
    bab-02/
      ...
  web/                      (aplikasi Public Reader; jangan ubah kecuali diminta)
```

Gunakan nomor bab dua digit (`bab-01`, bukan `bab-1`). Gunakan huruf kecil dan tanda hubung.

## 3. Aturan Emas

1. **Jangan pernah menimpa atau menghapus file versi.** Setiap revisi adalah file baru: `v1.md` menjadi `v2.md`, lalu `v3.md`.
2. Versi bernomor tertinggi adalah versi kerja terbaru, bukan otomatis versi yang diterbitkan.
3. Jangan mengubah isi bab yang sudah ada kecuali pemilik meminta revisi; revisi selalu menjadi file versi baru.
4. Jangan mengubah Canon yang memuat keputusan pemilik tanpa menjelaskan perubahan dan alasannya.
5. Jangan mengubah `publication.json`. Pemilihan versi publik adalah keputusan eksplisit pemilik.
6. Jika ada yang tidak jelas atau bertentangan, tandai dan tanyakan. Jangan mengarang fakta yang bertentangan dengan Canon.

## 4. Format File Bab

Setiap file `vN.md` diawali frontmatter seperti ini:

```yaml
---
bab: 1
versi: 1
judul: Judul Bab
status: draf
tanggal: 2026-11-02
catatan_revisi: ""
---
```

Keterangan:
- `status`: `draf`, `direvisi`, atau `final`.
- Versi baru hasil revisi memakai status `direvisi`.
- Hanya pemilik yang boleh meminta status `final`.
- `catatan_revisi` menjelaskan perubahan pada v2 dan seterusnya.

Setelah frontmatter, tulis isi bab dalam Markdown biasa. Pisahkan adegan dengan baris `***`.

## 5. Alur Menulis Bab Baru

1. Baca `canon/premis.md`, `canon/gaya.md`, `canon/plot.md`, dan bagian karakter serta dunia yang relevan.
2. Baca `canon/status-objek.md` dan `canon/timeline.md` untuk mengetahui keadaan cerita terakhir.
3. Baca ringkasan beberapa bab terakhir. Jangan membaca ulang seluruh novel kecuali diminta.
4. Tulis bab sebagai `novel/bab-NN/v1.md` dengan status `draf`.
5. Perbarui ringkasan dan tracker sesuai bagian 7.
6. Lakukan pemeriksaan konsistensi sebelum menyerahkan hasil.
7. Balas kepada pemilik sesuai bagian 9.

## 6. Alur Revisi

Saat pemilik meminta revisi:
1. Baca versi kerja terbaru dan permintaan revisi.
2. Buat file baru dengan nomor versi berikutnya. Jangan sentuh versi lama.
3. Isi `catatan_revisi` dengan ringkasan perubahan.
4. Perbarui `ringkasan.md`, `canon/status-objek.md`, dan `canon/timeline.md` jika fakta cerita berubah.
5. Jika revisi berdampak pada bab setelahnya, sebutkan bab yang mungkin terdampak. Jangan mengubah bab lain tanpa diminta.

## 7. Pembaruan Pelacak

**ringkasan.md** (satu per bab, mencerminkan versi kerja terbaru), maksimal sekitar 150 kata:

```markdown
# Ringkasan Bab NN
- Peristiwa utama:
- Karakter yang muncul:
- Lokasi:
- Informasi baru yang terungkap:
- Pertanyaan atau benang cerita yang dibiarkan terbuka:
```

**canon/status-objek.md** mencatat kondisi benda atau fakta yang dapat menimbulkan kontradiksi:

```markdown
| Objek/Fakta | Kondisi | Lokasi/Pemilik | Sejak Bab | Catatan |
|---|---|---|---|---|
| Jam tangan Raka | rusak | saku Raka | 05 | layar retak |
```

Saat kondisi berubah, catat perubahan beserta bab pemicunya. Jangan menghapus riwayat perubahan yang masih relevan. Saat merevisi bab, perbaiki catatan yang berasal dari bab tersebut lalu evaluasi dampaknya pada bab berikutnya.

**canon/timeline.md**:

```markdown
| Bab | Waktu dalam Cerita | Peristiwa Kunci |
|---|---|---|
| 01 | Senin pagi, hari ke-1 | Raka tiba di kota |
```

## 8. Pemeriksaan Konsistensi

Sebelum menyerahkan bab, periksa:
- Kondisi benda dan karakter sesuai tracker.
- Urutan waktu sesuai timeline.
- Nama, usia, ciri fisik, sifat, dan relasi karakter sesuai Canon.
- Aturan dunia tidak dilanggar.
- Informasi yang diketahui karakter memang sudah diperoleh olehnya.
- Perubahan kondisi memiliki peristiwa penyebab yang jelas.

Jika pemilik meminta "cek konsistensi", laporkan lokasi masalah, kontradiksi, tingkat dampak, dan saran perbaikan. Jangan mengubah naskah kecuali diminta.

## 9. Format Balasan

Setelah menulis atau merevisi, balas singkat dengan:
- File yang dibuat atau diubah.
- Ringkasan isi atau perubahan.
- Jumlah kata kira-kira.
- Hal yang memerlukan keputusan pemilik.
- Peringatan konsistensi dan bab terdampak.

Jangan menempelkan seluruh isi bab di balasan.

## 10. Larangan

- Menimpa, mengganti nama, atau menghapus file versi.
- Menandai bab sebagai `final` tanpa permintaan pemilik.
- Mengubah `publication.json` atau mengatur publikasi tanpa persetujuan pemilik.
- Mengarang fakta yang bertentangan dengan Canon.
- Menyalin teks dari novel atau karya lain yang dilindungi hak cipta.
