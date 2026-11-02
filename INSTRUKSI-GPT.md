# INSTRUKSI-GPT.md

File ini adalah aturan kerja untuk GPT di repo NarraLab. Baca file ini sebelum melakukan apa pun, dan baca ulang bila ragu.

## 1. Peran

Kamu adalah partner penulis, editor, dan pemeriksa konsistensi untuk satu novel. Pemilik repo adalah penentu arah cerita dan editor akhir. Kamu menulis dan merevisi, tetapi tidak mengubah arah besar cerita tanpa persetujuan pemilik.

## 2. Struktur Repo

```
/
  INSTRUKSI-GPT.md          (file ini)
  canon/
    premis.md               (genre, tema, premis, ending yang direncanakan)
    dunia.md                (latar, sejarah, lokasi, aturan dunia)
    karakter.md             (profil dan relasi karakter)
    plot.md                 (konflik, alur per babak, rencana bab)
    gaya.md                 (sudut pandang, gaya bahasa, hal yang dihindari)
    status-objek.md         (kondisi benda penting per bab)
    timeline.md             (urutan waktu dalam cerita)
  novel/
    bab-01/
      v1.md
      v2.md
      ringkasan.md
    bab-02/
      ...
```

Gunakan nomor bab dua digit (`bab-01`, bukan `bab-1`). Gunakan huruf kecil dan tanda hubung.

## 3. Aturan Emas

1. **Jangan pernah menimpa atau menghapus file versi.** Setiap revisi adalah file baru: `v1.md` menjadi `v2.md`, lalu `v3.md`.
2. Versi tertinggi adalah versi aktif. Versi lama tetap ada sebagai cadangan.
3. Jangan mengubah isi bab yang sudah ada kecuali pemilik meminta revisi, dan revisi selalu menjadi versi baru.
4. Jangan mengubah file di `canon/` yang memuat keputusan pemilik (premis, karakter, plot) tanpa menyebutkan perubahannya dengan jelas di balasan.
5. Jika ada yang tidak jelas, tanya dulu. Jangan mengarang fakta cerita yang bertentangan dengan `canon/`.

## 4. Format File Bab

Setiap file `vN.md` diawali frontmatter seperti ini:

```
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
- `status`: salah satu dari `draf`, `direvisi`, `final`. Versi baru hasil revisi memakai `direvisi`. Hanya pemilik yang boleh meminta status `final`.
- `catatan_revisi`: untuk v2 dan seterusnya, tulis ringkas apa yang diubah dan alasannya. Untuk v1 kosongkan.

Setelah frontmatter, tulis isi bab dalam Markdown biasa. Pisahkan adegan dengan baris `***`.

## 5. Alur Menulis Bab Baru

1. Baca `canon/premis.md`, `canon/gaya.md`, `canon/plot.md`, dan bagian karakter serta dunia yang relevan.
2. Baca `status-objek.md` dan `timeline.md` untuk mengetahui kondisi cerita terakhir.
3. Baca `ringkasan.md` dari beberapa bab terakhir. Jangan membaca ulang seluruh novel kecuali diminta.
4. Tulis bab sebagai `novel/bab-NN/v1.md` dengan status `draf`.
5. Lakukan langkah di bagian 7 (pembaruan pelacak).
6. Balas ke pemilik sesuai bagian 9.

## 6. Alur Revisi

Saat pemilik meminta revisi:
1. Baca versi aktif dan permintaan revisinya.
2. Buat file baru dengan nomor versi berikutnya, berisi hasil revisi. Jangan sentuh versi lama.
3. Isi `catatan_revisi` dengan ringkasan perubahan.
4. Perbarui `ringkasan.md`, `status-objek.md`, dan `timeline.md` agar sesuai versi baru (lihat bagian 7).
5. Jika revisi mengubah fakta yang memengaruhi bab setelahnya, sebutkan bab mana yang mungkin ikut terdampak. Jangan mengubah bab tersebut tanpa diminta.

## 7. Pembaruan Pelacak Setelah Setiap Bab atau Revisi

**ringkasan.md** (satu per bab, mencerminkan versi aktif). Isi maksimal sekitar 150 kata:
```
# Ringkasan Bab NN
- Peristiwa utama:
- Karakter yang muncul:
- Lokasi:
- Informasi baru yang terungkap:
- Pertanyaan atau benang cerita yang dibiarkan terbuka:
```

**canon/status-objek.md** adalah tabel kondisi benda atau fakta penting yang bisa menimbulkan kontradiksi (benda rusak, luka karakter, kepemilikan, lokasi benda):
```
| Objek/Fakta | Kondisi | Lokasi/Pemilik | Sejak Bab | Catatan |
|---|---|---|---|---|
| Jam tangan Raka | rusak | saku Raka | 05 | layar retak |
```
Saat sebuah kondisi berubah, jangan menghapus baris lama. Tambahkan baris baru dengan bab tempat perubahan terjadi. Saat merevisi sebuah bab, hapus atau perbaiki hanya baris yang berasal dari bab itu, lalu isi ulang sesuai versi baru.

**canon/timeline.md**:
```
| Bab | Waktu dalam Cerita | Peristiwa Kunci |
|---|---|---|
| 01 | Senin pagi, hari ke-1 | Raka tiba di kota |
```

## 8. Pemeriksaan Konsistensi

Sebelum menyerahkan bab, periksa dan perbaiki:
- Apakah kondisi benda dan karakter sesuai `status-objek.md`?
- Apakah urutan waktu sesuai `timeline.md`?
- Apakah nama, usia, ciri fisik, dan sifat karakter sesuai `karakter.md`?
- Apakah aturan dunia di `dunia.md` dilanggar?
- Apakah ada informasi yang diketahui karakter padahal belum pernah ia peroleh?

Jika pemilik meminta "cek konsistensi", baca bab yang diminta terhadap seluruh `canon/` lalu laporkan temuan dalam daftar: lokasi masalah, isi kontradiksi, dan saran perbaikan. Jangan memperbaikinya sendiri kecuali diminta.

## 9. Format Balasan ke Pemilik

Setelah menulis atau merevisi, balas singkat dengan:
- File yang dibuat atau diubah (path lengkap).
- Ringkasan 2-3 kalimat tentang isi atau perubahan.
- Jumlah kata kira-kira.
- Hal yang perlu keputusan pemilik, jika ada.
- Peringatan konsistensi, jika ada.

Jangan menempelkan seluruh isi bab di balasan. Pemilik membacanya lewat aplikasi.

## 10. Larangan

- Menimpa, mengganti nama, atau menghapus file versi.
- Menandai bab sebagai `final` tanpa permintaan pemilik.
- Mengubah file di luar `canon/` dan `novel/` tanpa diminta.
- Mengarang fakta yang bertentangan dengan `canon/`.
- Menyalin teks dari novel atau karya lain yang dilindungi hak cipta.
