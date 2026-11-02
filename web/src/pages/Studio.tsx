import { useEffect, useMemo, useState } from "react";
import "./studio.css";

type Character = {
  id: string;
  name: string;
  role: string;
  goal: string;
  conflict: string;
  traits: string;
};

type Story = {
  title: string;
  genre: string;
  audience: string;
  premise: string;
  synopsis: string;
  tone: string;
  targetWords: number;
};

type Workspace = { story: Story; characters: Character[] };

const KEY = "narralab:workspace:v1";
const EMPTY: Workspace = {
  story: { title: "", genre: "", audience: "", premise: "", synopsis: "", tone: "", targetWords: 80000 },
  characters: [],
};

function loadWorkspace(): Workspace {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const value = JSON.parse(raw) as Partial<Workspace>;
    return {
      story: { ...EMPTY.story, ...(value.story ?? {}) },
      characters: Array.isArray(value.characters) ? value.characters : [],
    };
  } catch {
    return EMPTY;
  }
}

export default function Studio() {
  const [workspace, setWorkspace] = useState<Workspace>(loadWorkspace);
  const [tab, setTab] = useState<"overview" | "story" | "characters">("overview");
  const [editing, setEditing] = useState<Character | null>(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(workspace));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [workspace]);

  const updateStory = (field: keyof Story, value: string | number) => {
    setWorkspace((current) => ({ ...current, story: { ...current.story, [field]: value } }));
  };

  const saveCharacter = () => {
    if (!editing || !editing.name.trim()) return;
    setWorkspace((current) => ({
      ...current,
      characters: editing.id.startsWith("new-")
        ? [...current.characters, { ...editing, id: String(Date.now()) }]
        : current.characters.map((item) => item.id === editing.id ? editing : item),
    }));
    setEditing(null);
  };

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(workspace, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "narralab-workspace-backup.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const completion = useMemo(() => {
    const fields = [workspace.story.title, workspace.story.genre, workspace.story.premise, workspace.story.synopsis, workspace.story.tone];
    return Math.round((fields.filter((value) => value.trim()).length / fields.length) * 100);
  }, [workspace.story]);

  return (
    <div className="studio">
      <div className="studio-top">
        <div>
          <p className="eyebrow">Ruang produksi pribadi</p>
          <h1>Production Workspace</h1>
          <p className="studio-lede">Bangun fondasi cerita sebelum mulai menulis bab.</p>
        </div>
        <div className="studio-actions">
          <span className={saved ? "save-state" : "save-state save-error"}>{saved ? "Tersimpan di browser" : "Gagal menyimpan"}</span>
          <button className="btn" type="button" onClick={exportBackup}>Ekspor backup</button>
        </div>
      </div>

      <nav className="studio-tabs" aria-label="Modul workspace">
        {(["overview", "story", "characters"] as const).map((item) => (
          <button key={item} type="button" className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
            {item === "overview" ? "Ringkasan" : item === "story" ? "Pengembangan Cerita" : "Karakter"}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <section className="studio-grid">
          <article className="studio-card studio-feature">
            <p className="eyebrow">Proyek novel aktif</p>
            <h2>{workspace.story.title || "Novel tanpa judul"}</h2>
            <p className="muted">{workspace.story.genre || "Genre belum ditentukan"} · {workspace.story.audience || "Target pembaca belum ditentukan"}</p>
            <div className="studio-progress"><span style={{ width: completion + "%" }} /></div>
            <p className="muted small">{completion}% fondasi cerita terisi</p>
            <button className="btn btn-primary" type="button" onClick={() => setTab("story")}>Lengkapi cerita</button>
          </article>
          <article className="studio-card">
            <p className="eyebrow">Karakter</p>
            <strong className="studio-number">{workspace.characters.length}</strong>
            <p className="muted">Profil karakter tersimpan</p>
            <button className="link-btn" type="button" onClick={() => setTab("characters")}>Kelola karakter →</button>
          </article>
          <article className="studio-card">
            <p className="eyebrow">Target panjang novel</p>
            <strong className="studio-number">{workspace.story.targetWords.toLocaleString("id-ID")}</strong>
            <p className="muted">Perkiraan jumlah kata</p>
            <button className="link-btn" type="button" onClick={() => setTab("story")}>Atur target →</button>
          </article>
          <article className="studio-card studio-note">
            <h3>Catatan penyimpanan</h3>
            <p>Data workspace tahap awal disimpan di browser ini, bukan ke GitHub. Gunakan Ekspor backup secara berkala. Sinkronisasi GitHub akan dibuat setelah format data dan alur kerja stabil.</p>
          </article>
        </section>
      )}

      {tab === "story" && (
        <section className="studio-card studio-form-card">
          <div className="section-heading"><div><p className="eyebrow">Story development</p><h2>Identitas cerita</h2></div><span className="muted small">Perubahan tersimpan otomatis</span></div>
          <div className="studio-form">
            <label>Judul sementara<input value={workspace.story.title} onChange={(e) => updateStory("title", e.target.value)} placeholder="Mis. Kota yang Menyimpan Hujan" /></label>
            <div className="studio-form-row">
              <label>Genre<input value={workspace.story.genre} onChange={(e) => updateStory("genre", e.target.value)} placeholder="Fantasi, romansa, thriller..." /></label>
              <label>Target pembaca<input value={workspace.story.audience} onChange={(e) => updateStory("audience", e.target.value)} placeholder="Dewasa muda, umum..." /></label>
            </div>
            <label>Premis<textarea rows={3} value={workspace.story.premise} onChange={(e) => updateStory("premise", e.target.value)} placeholder="Siapa tokoh utamanya, apa yang terjadi, dan apa keunikan konflik ceritanya?" /></label>
            <label>Sinopsis<textarea rows={5} value={workspace.story.synopsis} onChange={(e) => updateStory("synopsis", e.target.value)} placeholder="Ringkasan alur dari awal hingga akhir. Boleh masih kasar." /></label>
            <div className="studio-form-row">
              <label>Gaya / nuansa<input value={workspace.story.tone} onChange={(e) => updateStory("tone", e.target.value)} placeholder="Gelap, puitis, realistis, humor..." /></label>
              <label>Target jumlah kata<input type="number" min={1000} step={1000} value={workspace.story.targetWords} onChange={(e) => updateStory("targetWords", Math.max(1000, Number(e.target.value) || 1000))} /></label>
            </div>
          </div>
        </section>
      )}

      {tab === "characters" && (
        <section className="studio-card studio-form-card">
          <div className="section-heading"><div><p className="eyebrow">Character bible</p><h2>Karakter cerita</h2></div><button className="btn btn-primary" type="button" onClick={() => setEditing({ id: "new-" + Date.now(), name: "", role: "", goal: "", conflict: "", traits: "" })}>+ Tambah karakter</button></div>
          {workspace.characters.length === 0 ? (
            <div className="studio-empty"><h3>Belum ada karakter</h3><p className="muted">Mulai dari protagonis. Tetapkan tujuan, konflik, dan sifat yang memengaruhi tindakannya.</p></div>
          ) : (
            <div className="character-list">
              {workspace.characters.map((character) => (
                <article className="character-item" key={character.id}>
                  <div><h3>{character.name}</h3><p className="muted small">{character.role || "Peran belum ditentukan"}</p><p>{character.goal || "Tujuan belum diisi"}</p></div>
                  <button className="btn" type="button" onClick={() => setEditing(character)}>Edit</button>
                  <button className="link-btn danger-link" type="button" onClick={() => setWorkspace((current) => ({ ...current, characters: current.characters.filter((item) => item.id !== character.id) }))}>Hapus</button>
                </article>
              ))}
            </div>
          )}
          {editing && (
            <div className="character-editor">
              <h3>{editing.id.startsWith("new-") ? "Karakter baru" : "Edit karakter"}</h3>
              <div className="studio-form">
                <div className="studio-form-row">
                  <label>Nama<input autoFocus value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Nama karakter" /></label>
                  <label>Peran<input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} placeholder="Protagonis, antagonis..." /></label>
                </div>
                <label>Tujuan<input value={editing.goal} onChange={(e) => setEditing({ ...editing, goal: e.target.value })} placeholder="Apa yang paling ingin dicapai?" /></label>
                <label>Konflik / ketakutan<input value={editing.conflict} onChange={(e) => setEditing({ ...editing, conflict: e.target.value })} placeholder="Apa yang menghalangi atau ditakuti?" /></label>
                <label>Sifat dan ciri khas<textarea rows={2} value={editing.traits} onChange={(e) => setEditing({ ...editing, traits: e.target.value })} placeholder="Kepribadian, kebiasaan, cara bicara..." /></label>
                <div className="editor-actions"><button className="btn btn-primary" type="button" onClick={saveCharacter} disabled={!editing.name.trim()}>Simpan karakter</button><button className="btn" type="button" onClick={() => setEditing(null)}>Batal</button></div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
