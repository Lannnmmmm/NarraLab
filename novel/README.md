# Novel

Folder ini menyimpan naskah kerja. Setiap bab memiliki folder sendiri dan setiap revisi disimpan sebagai file versi baru.

```
novel/
  bab-01/
    v1.md
    v2.md
    ringkasan.md
  bab-02/
    v1.md
    ringkasan.md
```

## Aturan versi

- Versi bernomor tertinggi adalah **versi kerja terbaru**.
- Versi kerja terbaru tidak otomatis menjadi versi terbit.
- Versi yang tampil di Public Reader hanya versi yang dipilih secara eksplisit di root `publication.json`.
- File versi lama tidak boleh ditimpa atau dihapus.
- File yang dipilih di `publication.json` wajib memiliki frontmatter `status: final`.
- `ringkasan.md` mengikuti versi kerja terbaru dan dapat disertakan pada halaman baca jika bab tersebut diterbitkan.

Format file dan alur revisi dijelaskan di [INSTRUKSI-GPT.md](../INSTRUKSI-GPT.md).
