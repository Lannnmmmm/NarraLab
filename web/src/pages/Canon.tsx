import NotFound from "../components/NotFound";
import Prose from "../components/Prose";
import { useText } from "../data";
import { hrefCanon } from "../router";
import type { SiteIndex } from "../types";

interface CanonProps {
  index: SiteIndex;
  id: string | null;
}

export default function Canon({ index, id }: CanonProps) {
  const doc = id ? index.canon.find((d) => d.id === id) : index.canon[0];
  const body = useText(doc?.path ?? null);

  if (index.canon.length === 0) {
    return (
      <div className="page">
        <div className="state empty">
          <h1>Canon</h1>
          <p>Folder canon/ belum berisi dokumen.</p>
        </div>
      </div>
    );
  }

  if (!doc) return <NotFound message="Dokumen canon yang diminta tidak ada." />;

  return (
    <div className="page canon-layout">
      <nav className="canon-nav" aria-label="Dokumen Canon">
        <p className="eyebrow">Canon</p>
        <ul>
          {index.canon.map((d) => (
            <li key={d.id}>
              <a href={hrefCanon(d.id)} aria-current={d.id === doc.id ? "page" : undefined}>
                {d.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <article className="canon-doc">
        {body.status === "ready" && <Prose text={body.text} />}
        {body.status === "loading" && <p className="muted">Memuat…</p>}
        {body.status === "error" && <p className="muted">Gagal memuat dokumen ini.</p>}
      </article>
    </div>
  );
}
