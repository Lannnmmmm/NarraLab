import { hrefLibrary } from "../router";

export default function NotFound({ message }: { message: string }) {
  return (
    <div className="state">
      <h1>Tidak ditemukan</h1>
      <p>{message}</p>
      <p>
        <a className="btn" href={hrefLibrary()}>
          Kembali ke daftar bab
        </a>
      </p>
    </div>
  );
}
