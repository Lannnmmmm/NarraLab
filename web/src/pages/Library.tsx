import { formatDate, formatNumber, readingMinutes } from "../format";
import StatusBadge from "../components/StatusBadge";
import { hrefChapter } from "../router";
import { LAST_READ_KEY } from "../settings";
import { readStore } from "../storage";
import type { SiteIndex } from "../types";

interface LibraryProps {
  index: SiteIndex;
  finalOnly: boolean;
  onFinalOnly: (value: boolean) => void;
}

export default function Library({ index, finalOnly, onFinalOnly }: LibraryProps) {
  const lastNumber = Number(readStore(LAST_READ_KEY));
  const lastChapter = index.chapters.find((c) => c.number === lastNumber);
  const list = index.chapters.filter((c) => !finalOnly || c.status === "final");
  const finalCount = index.chapters.filter((c) => c.status === "final").length;

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">Naskah</p>
        <h1>Perpustakaan bab</h1>
        <p className="lede">
          {index.chapters.length === 0
            ? "Belum ada bab."
            : `${index.chapters.length} bab · ${formatNumber(index.totalWords)} kata · ${finalCount} final`}
        </p>

        {lastChapter && (
          <a className="btn btn-primary" href={hrefChapter(lastChapter.number)}>
            Lanjutkan membaca: Bab {lastChapter.number}
          </a>
        )}
      </section>

      {index.chapters.length > 0 && (
        <div className="toolbar">
          <label className="check">
            <input
              type="checkbox"
              checked={finalOnly}
              onChange={(e) => onFinalOnly(e.target.checked)}
            />
            <span>Hanya bab final</span>
          </label>
        </div>
      )}

      {index.chapters.length === 0 ? (
        <div className="state empty">
          <p>Minta GPT menulis bab pertama di repo, misalnya:</p>
          <p>
            <code>novel/bab-01/v1.md</code>
          </p>
          <p className="muted">Setelah commit, situs akan memperbarui daftar ini otomatis.</p>
        </div>
      ) : list.length === 0 ? (
        <div className="state empty">
          <p>Belum ada bab berstatus final.</p>
          <button type="button" className="btn" onClick={() => onFinalOnly(false)}>
            Tampilkan semua bab
          </button>
        </div>
      ) : (
        <ol className="chapter-list">
          {list.map((c) => (
            <li key={c.id}>
              <a className="chapter-card" href={hrefChapter(c.number)}>
                <span className="chapter-number" aria-hidden="true">
                  {c.number}
                </span>
                <span className="chapter-body">
                  <span className="chapter-title">{c.title}</span>
                  <span className="chapter-meta">
                    <StatusBadge status={c.status} />
                    <span>v{c.latestVersion}</span>
                    {c.versions.length > 1 && <span>{c.versions.length} versi</span>}
                    <span>{formatNumber(c.words)} kata</span>
                    <span>±{readingMinutes(c.words)} mnt</span>
                    {c.date && <span>{formatDate(c.date)}</span>}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
