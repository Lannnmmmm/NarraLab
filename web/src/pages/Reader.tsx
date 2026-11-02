import { useEffect, useMemo, useState } from "react";
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
  finalOnly: boolean;
}

export default function Reader({ index, number, version, finalOnly }: ReaderProps) {
  const chapter = index.chapters.find((c) => c.number === number);
  const active = version ?? chapter?.latestVersion ?? 0;
  const info = chapter?.versions.find((v) => v.version === active);
  const body = useText(info?.path ?? null);
  const [progress, setProgress] = useState(0);

  const visible = useMemo(
    () => index.chapters.filter((c) => !finalOnly || c.status === "final" || c.number === number),
    [index, finalOnly, number],
  );
  const pos = visible.findIndex((c) => c.number === number);
  const prev = pos > 0 ? visible[pos - 1] : null;
  const next = pos >= 0 && pos < visible.length - 1 ? visible[pos + 1] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [number, active]);

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
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [loaded, number, active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "SELECT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowLeft" && prev) window.location.hash = hrefChapter(prev.number);
      if (e.key === "ArrowRight" && next) window.location.hash = hrefChapter(next.number);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  if (!chapter) return <NotFound message={`Bab ${number} belum ada di naskah.`} />;
  if (!info) {
    return (
      <NotFound message={`Bab ${number} tidak punya versi v${active}. Versi terbaru adalah v${chapter.latestVersion}.`} />
    );
  }

  const isOld = active !== chapter.latestVersion;

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

        {chapter.versions.length > 1 && (
          <label className="version-picker">
            <span>Versi</span>
            <select
              value={active}
              onChange={(e) => {
                const v = Number(e.target.value);
                window.location.hash = hrefChapter(chapter.number, v === chapter.latestVersion ? null : v);
              }}
            >
              {[...chapter.versions].reverse().map((v) => (
                <option key={v.version} value={v.version}>
                  {`v${v.version}${v.version === chapter.latestVersion ? " (terbaru)" : ""} · ${v.status}${
                    v.date ? ` · ${v.date}` : ""
                  }`}
                </option>
              ))}
            </select>
          </label>
        )}
      </header>

      {isOld && (
        <div className="banner" role="status">
          <span>
            Anda membaca <strong>v{active}</strong>, bukan versi terbaru.
          </span>
          <a href={hrefChapter(chapter.number)}>Buka v{chapter.latestVersion}</a>
        </div>
      )}

      {info.note && (
        <details className="note">
          <summary>Catatan revisi v{info.version}</summary>
          <p>{info.note}</p>
        </details>
      )}

      {body.status === "ready" && <Prose text={body.text} />}
      {body.status === "loading" && <p className="muted">Memuat bab…</p>}
      {body.status === "error" && <p className="muted">Gagal memuat isi bab ini.</p>}

      {chapter.summaryPath && <Summary path={chapter.summaryPath} />}

      <nav className="chapter-nav" aria-label="Pindah bab">
        {prev ? (
          <a className="nav-card nav-prev" href={hrefChapter(prev.number)} rel="prev">
            <span className="nav-dir">
              <ArrowLeftIcon size={16} /> Sebelumnya
            </span>
            <span className="nav-title">
              Bab {prev.number} · {prev.title}
            </span>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a className="nav-card nav-next" href={hrefChapter(next.number)} rel="next">
            <span className="nav-dir">
              Berikutnya <ArrowRightIcon size={16} />
            </span>
            <span className="nav-title">
              Bab {next.number} · {next.title}
            </span>
          </a>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

function Summary({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const text = useText(open ? path : null);

  return (
    <details className="note summary" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>Ringkasan bab</summary>
      {open && (text.status === "ready" ? <Prose text={text.text} /> : <p className="muted">Memuat…</p>)}
    </details>
  );
}
