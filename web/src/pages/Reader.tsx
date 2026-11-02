import { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "../components/Icons";
import NotFound from "../components/NotFound";
import Prose from "../components/Prose";
import StatusBadge from "../components/StatusBadge";
import { useText } from "../data";
import { formatDate, formatNumber, readingMinutes } from "../format";
import { hrefChapter } from "../router";
import { LAST_READ_KEY } from "../settings";
import { writeStore } from "../storage";
import type { SiteIndex } from "../types";

interface ReaderProps {
  index: SiteIndex;
  number: number;
  version: number | null;
}

export default function Reader({ index, number, version }: ReaderProps) {
  const chapter = index.chapters.find((item) => item.number === number);
  const active = chapter?.latestVersion ?? 0;
  const info = chapter?.versions.find((item) => item.version === active);
  const body = useText(info?.path ?? null);
  const [progress, setProgress] = useState(0);

  const position = index.chapters.findIndex((item) => item.number === number);
  const previous = position > 0 ? index.chapters[position - 1] : null;
  const next = position >= 0 && position < index.chapters.length - 1 ? index.chapters[position + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [number]);

  useEffect(() => {
    if (chapter) writeStore(LAST_READ_KEY, String(chapter.number));
  }, [chapter]);

  useEffect(() => {
    if (!chapter) return;
    document.title = `${chapter.title} · Bab ${chapter.number} · NarraLab`;
    return () => {
      document.title = "NarraLab";
    };
  }, [chapter]);

  const loaded = body.status === "ready";
  useEffect(() => {
    const update = () => {
      const element = document.documentElement;
      const max = element.scrollHeight - element.clientHeight;
      setProgress(max > 0 ? Math.min(1, element.scrollTop / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [loaded, number]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
      if (event.key === "ArrowLeft" && previous) window.location.hash = hrefChapter(previous.number);
      if (event.key === "ArrowRight" && next) window.location.hash = hrefChapter(next.number);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previous, next]);

  if (!chapter) return <NotFound message={`Bab ${number} belum diterbitkan.`} />;
  if (version !== null && version !== active) {
    return <NotFound message="Versi ini tidak tersedia di Public Reader." />;
  }
  if (!info) return <NotFound message={`Versi terbit Bab ${number} tidak ditemukan.`} />;

  return (
    <article className="reader">
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${progress * 100}%` }} />
      </div>

      <header className="chapter-head">
        <p className="eyebrow">Bab {chapter.number}</p>
        <h1>{chapter.title}</h1>
        <div className="meta-row">
          <StatusBadge status={info.status} />
          <span>{formatNumber(info.words)} kata</span>
          <span>±{readingMinutes(info.words)} menit baca</span>
          {info.date && <span>{formatDate(info.date)}</span>}
        </div>
        {info.note && (
          <details className="note">
            <summary>Catatan edisi</summary>
            <p>{info.note}</p>
          </details>
        )}
      </header>

      {body.status === "ready" && <Prose text={body.text} />}
      {body.status === "loading" && <p className="muted">Memuat bab…</p>}
      {body.status === "error" && <p className="muted">Gagal memuat isi bab ini.</p>}

      {chapter.summaryPath && <Summary path={chapter.summaryPath} />}

      <nav className="chapter-nav" aria-label="Pindah bab">
        {previous ? (
          <a className="nav-card nav-prev" href={hrefChapter(previous.number)} rel="prev">
            <span className="nav-dir"><ArrowLeftIcon size={16} /> Sebelumnya</span>
            <span className="nav-title">Bab {previous.number} · {previous.title}</span>
          </a>
        ) : <span />}
        {next ? (
          <a className="nav-card nav-next" href={hrefChapter(next.number)} rel="next">
            <span className="nav-dir">Berikutnya <ArrowRightIcon size={16} /></span>
            <span className="nav-title">Bab {next.number} · {next.title}</span>
          </a>
        ) : <span />}
      </nav>
    </article>
  );
}

function Summary({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const text = useText(open ? path : null);

  return (
    <details className="note summary" onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary>Ringkasan bab</summary>
      {open && (text.status === "ready" ? <Prose text={text.text} /> : <p className="muted">Memuat…</p>)}
    </details>
  );
}
