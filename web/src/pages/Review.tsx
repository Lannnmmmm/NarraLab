import { useEffect, useState } from "react";
import Prose from "../components/Prose";

const REPO = "Lannnmmmm/NarraLab";
const BRANCH = "main";
const ROOT = "novels/takhta-abu";
const TREE_URL = `https://api.github.com/repos/${REPO}/git/trees/${BRANCH}?recursive=1`;
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/`;
const NOTES_KEY = "narralab:review-notes:v1";

type ReviewFile = { path: string; chapter: number; version: number };
type ReviewNote = { decision: "belum_diperiksa" | "perlu_revisi" | "disetujui"; note: string; updatedAt: string };
type ReviewNotes = Record<string, ReviewNote>;

function parseMeta(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  const meta: Record<string, string> = {};
  if (match) {
    for (const line of match[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return { meta, body: match ? raw.slice(match[0].length).replace(/^\n+/, "") : raw };
}

function readNotes(): ReviewNotes {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || "{}") as ReviewNotes; }
  catch { return {}; }
}

export default function Review() {
  const [files, setFiles] = useState<ReviewFile[]>([]);
  const [selected, setSelected] = useState("");
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const [error, setError] = useState("");
  const [notes, setNotes] = useState<ReviewNotes>(readNotes);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(TREE_URL, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`GitHub API: HTTP ${response.status}`);
        return response.json() as Promise<{ tree?: { path: string; type: string }[]; truncated?: boolean }>;
      })
      .then((tree) => {
        if (tree.truncated) throw new Error("Daftar file GitHub terpotong. Perlu indeks khusus.");
        const found = (tree.tree || []).flatMap((item) => {
          const match = item.path.match(new RegExp(`^${ROOT}/chapters/bab-(\\d{2})/v(\\d+)\\.md$`));
          return match && item.type === "blob" ? [{ path: item.path, chapter: Number(match[1]), version: Number(match[2]) }] : [];
        });
        const latest = new Map<number, ReviewFile>();
        for (const file of found) {
          const current = latest.get(file.chapter);
          if (!current || file.version > current.version) latest.set(file.chapter, file);
        }
        const result = [...latest.values()].sort((a, b) => a.chapter - b.chapter);
        if (!cancelled) {
          setFiles(result);
          setSelected((current) => result.some((item) => item.path === current) ? current : result[0]?.path || "");
          setStatus(result.length ? "ready" : "empty");
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) { setError(reason instanceof Error ? reason.message : String(reason)); setStatus("error"); }
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selected) { setBody(""); return; }
    let cancelled = false;
    setBody("");
    fetch(RAW_BASE + selected, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Gagal memuat naskah: HTTP ${response.status}`);
        return response.text();
      })
      .then((raw) => {
        if (cancelled) return;
        const parsed = parseMeta(raw);
        setTitle(parsed.meta.judul || `Bab ${files.find((item) => item.path === selected)?.chapter ?? ""}`);
        setBody(parsed.body);
      })
      .catch((reason: unknown) => { if (!cancelled) setBody(`Gagal memuat naskah. ${reason instanceof Error ? reason.message : String(reason)}`); });
    return () => { cancelled = true; };
  }, [selected, files]);

  useEffect(() => { setNoteDraft(selected ? notes[selected]?.note || "" : ""); }, [selected, notes]);

  const active = files.find((item) => item.path === selected);
  const activeNote = active ? notes[active.path] : undefined;

  const saveReview = (decision: ReviewNote["decision"]) => {
    if (!active) return;
    const next = { ...notes, [active.path]: { decision, note: noteDraft.trim(), updatedAt: new Date().toISOString() } };
    setNotes(next);
    localStorage.setItem(NOTES_KEY, JSON.stringify(next));
  };

  const decisionLabel = (decision?: ReviewNote["decision"]) =>
    decision === "disetujui" ? "Disetujui" : decision === "perlu_revisi" ? "Perlu revisi" : "Belum diperiksa";

  return (
    <section className="review-workspace">
      <div className="review-heading">
        <div><p className="eyebrow">Manuscript review</p><h2>Review Naskah</h2><p className="muted">Membaca versi terbaru langsung dari repository GitHub.</p></div>
        <button className="btn" type="button" onClick={() => window.location.reload()}>Muat ulang</button>
      </div>
      {status === "loading" && <div className="studio-empty">Memeriksa naskah di GitHub…</div>}
      {status === "error" && <div className="studio-empty"><h3>Gagal mengambil daftar naskah</h3><p className="muted">{error}</p><a href={`https://github.com/${REPO}/tree/${BRANCH}/${ROOT}/chapters`} target="_blank" rel="noreferrer">Buka folder bab di GitHub ↗</a></div>}
      {status === "empty" && <div className="studio-empty"><h3>Belum ada bab untuk ditinjau</h3><p className="muted">Folder <code>{ROOT}/chapters/</code> belum berisi file versi bab. Setelah AI menyimpan <code>bab-01/v1.md</code>, naskah akan muncul otomatis di sini.</p><a href={`https://github.com/${REPO}/tree/${BRANCH}/${ROOT}/chapters`} target="_blank" rel="noreferrer">Lihat folder bab di GitHub ↗</a></div>}
      {status === "ready" && (
        <div className="review-layout">
          <aside className="review-sidebar">
            <p className="eyebrow">Daftar bab · {files.length}</p>
            {files.map((file) => {
              const note = notes[file.path];
              return <button key={file.path} type="button" className={selected === file.path ? "review-chapter active" : "review-chapter"} onClick={() => { setSelected(file.path); setNoteDraft(notes[file.path]?.note || ""); }}>
                <span>Bab {file.chapter}</span><strong>v{file.version}</strong><small>{decisionLabel(note?.decision)}</small>
              </button>;
            })}
          </aside>
          <div className="review-main">
            <div className="review-document-head">
              <div><p className="eyebrow">Bab {active?.chapter} · Versi terbaru v{active?.version}</p><h2>{title || "Memuat judul…"}</h2></div>
              <a href={`https://github.com/${REPO}/blob/${BRANCH}/${selected}`} target="_blank" rel="noreferrer">Lihat di GitHub ↗</a>
            </div>
            <article className="review-prose">{body ? <Prose text={body} /> : <p className="muted">Memuat isi bab…</p>}</article>
            <section className="review-feedback">
              <div className="review-feedback-head"><h3>Catatan peninjauan</h3><span className="muted small">Status: {decisionLabel(activeNote?.decision)}</span></div>
              <textarea rows={4} value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder="Tulis bagian yang perlu diperbaiki, pertanyaan, atau catatan untuk AI…" />
              <div className="editor-actions">
                <button className="btn" type="button" onClick={() => saveReview("perlu_revisi")}>Minta revisi</button>
                <button className="btn btn-primary" type="button" onClick={() => saveReview("disetujui")}>Tandai disetujui</button>
              </div>
              <p className="ai-footnote">Catatan dan status tersimpan di browser ini saja. Persetujuan di sini belum menerbitkan bab atau mengubah file GitHub.</p>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}
