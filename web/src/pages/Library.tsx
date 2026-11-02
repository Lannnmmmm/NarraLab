import { formatDate, formatNumber, readingMinutes } from "../format";
import StatusBadge from "../components/StatusBadge";
import { hrefChapter } from "../router";
import { LAST_READ_KEY } from "../settings";
import { readStore } from "../storage";
import type { SiteIndex } from "../types";

export default function Library({ index }: { index: SiteIndex }) {
  const lastNumber = Number(readStore(LAST_READ_KEY));
  const lastChapter = index.chapters.find((chapter) => chapter.number === lastNumber);

  return (
    <div className="page">
      <section className="hero">
        <p className="eyebrow">Naskah terbit</p>
        <h1>Perpustakaan bab</h1>
        <p className="lede">
          {index.chapters.length === 0
            ? "Belum ada bab yang diterbitkan."
            : `${index.chapters.length} bab · ${formatNumber(index.totalWords)} kata`}
        </p>

        {lastChapter && (
          <a className="btn btn-primary" href={hrefChapter(lastChapter.number)}>
            Lanjutkan membaca: Bab {lastChapter.number}
          </a>
        )}
      </section>

      {index.chapters.length === 0 ? (
        <div className="state empty">
          <p>Belum ada bab yang dipilih untuk diterbitkan.</p>
          <p className="muted">
            Pemilik novel dapat memilih versi final melalui file <code>publication.json</code> di repository.
          </p>
        </div>
      ) : (
        <ol className="chapter-list">
          {index.chapters.map((chapter) => (
            <li key={chapter.id}>
              <a className="chapter-card" href={hrefChapter(chapter.number)}>
                <span className="chapter-number" aria-hidden="true">{chapter.number}</span>
                <span className="chapter-body">
                  <span className="chapter-title">{chapter.title}</span>
                  <span className="chapter-meta">
                    <StatusBadge status={chapter.status} />
                    <span>v{chapter.latestVersion}</span>
                    <span>{formatNumber(chapter.words)} kata</span>
                    <span>±{readingMinutes(chapter.words)} mnt</span>
                    {chapter.date && <span>{formatDate(chapter.date)}</span>}
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
