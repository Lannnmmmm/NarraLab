import { useEffect, useState } from "react";

type Story = {
  title: string; genre: string; audience: string; premise: string; synopsis: string; tone: string; targetWords: number;
};
type Character = { name: string; role: string; goal: string; conflict: string; traits: string };
type Props = { story: Story; characters: Character[] };

type Stage = "architect" | "writer" | "editor";
const STORAGE_KEY = "narralab:ai-pipeline:v1";

const STAGES: { id: Stage; label: string; description: string }[] = [
  { id: "architect", label: "Story Architect", description: "Mengembangkan ide menjadi fondasi cerita dan Canon awal." },
  { id: "writer", label: "Novel Writer", description: "Menulis bab berdasarkan Canon, outline, dan arahan adegan." },
  { id: "editor", label: "AI Editor", description: "Mengevaluasi naskah tanpa mengubahnya sebelum kamu menyetujui revisi." },
];

function buildPrompt(stage: Stage, story: Story, characters: Character[], brief: string, chapter: string, manuscript: string) {
  const storyContext = [
    `Judul: ${story.title || "Belum ditentukan"}`,
    `Genre: ${story.genre || "Belum ditentukan"}`,
    `Target pembaca: ${story.audience || "Belum ditentukan"}`,
    `Premis: ${story.premise || "Belum tersedia"}`,
    `Sinopsis: ${story.synopsis || "Belum tersedia"}`,
    `Tone/gaya: ${story.tone || "Belum ditentukan"}`,
    `Target panjang: ${story.targetWords.toLocaleString("id-ID")} kata`,
  ].join("\n");
  const characterContext = characters.length
    ? characters.map((c, i) => `${i + 1}. ${c.name} (${c.role || "peran belum ditentukan"})\n   Tujuan: ${c.goal || "-"}\n   Konflik/ketakutan: ${c.conflict || "-"}\n   Sifat/ciri: ${c.traits || "-"}`).join("\n")
    : "Belum ada karakter yang ditetapkan.";

  const common = `Kamu adalah AI dalam NarraLab, sebuah studio produksi novel. Pemilik proyek bertindak sebagai Author/Director dan memegang keputusan akhir. Kamu bertanggung jawab mengerjakan tugas kreatif secara profesional.\n\nATURAN KERJA:\n- Jangan mengarang fakta yang bertentangan dengan Canon atau konteks yang diberikan.\n- Pisahkan fakta yang sudah disetujui dari usulan baru. Beri label PROPOSED untuk ide yang belum disetujui.\n- Jika informasi penting belum ada, ajukan pertanyaan atau nyatakan asumsi secara eksplisit.\n- Jangan mengubah arah besar cerita tanpa persetujuan pemilik.\n- Hindari klise, eksposisi berlebihan, dialog kaku, dan pengulangan informasi.\n- Hasil harus spesifik, koheren, dan siap ditinjau manusia.\n\nKONTEKS PROYEK:\n${storyContext}\n\nCHARACTER BIBLE SAAT INI:\n${characterContext}`;

  if (stage === "architect") return `${common}\n\nTUGAS: STORY ARCHITECT\nKembangkan brief pemilik menjadi fondasi novel yang kuat. Kerjakan bertahap: (1) evaluasi dan tajamkan premis, (2) logline dan hook, (3) tema dan pertanyaan dramatik, (4) konflik utama dan stakes, (5) sinopsis awal dari pembuka sampai ending, (6) usulan karakter dan arc, (7) struktur plot/turning points, (8) risiko klise atau lubang logika.\nJangan menganggap usulanmu sebagai Canon. Pisahkan bagian FAKTA DARI PEMILIK, USULAN AI, dan PERTANYAAN UNTUK AUTHOR. Jangan menulis bab dulu.\n\nARAHAN PEMILIK:\n${brief || "Kembangkan fondasi berdasarkan konteks proyek yang tersedia."}`;

  if (stage === "writer") return `${common}\n\nTUGAS: NOVEL WRITER\nTulis satu bab/adegan sesuai arahan. Pertahankan voice, karakterisasi, sudut pandang, timeline, dan keadaan cerita. Jangan memperkenalkan fakta besar atau karakter baru tanpa kebutuhan plot. Jika Chapter Plan atau informasi penting tidak tersedia, sebutkan kekurangannya sebelum menulis atau gunakan asumsi minimal yang ditandai.\n\nARAHAN BAB / CHAPTER PLAN:\n${chapter || "Belum ada arahan bab. Minta pemilik melengkapi tujuan bab, POV, lokasi/waktu, konflik, dan perubahan yang harus terjadi."}\n\nKONTEKS TAMBAHAN / RINGKASAN BAB SEBELUMNYA:\n${brief || "Tidak ada konteks tambahan."}\n\nFORMAT OUTPUT:\n- Mulai dengan judul bab.
- Tulis prosa novel, bukan outline.
- Pisahkan pergantian adegan dengan ***.
- Akhiri dengan hook yang sesuai kebutuhan cerita.
- Setelah naskah, berikan catatan singkat: asumsi, fakta baru yang diperkenalkan, dan potensi dampak kontinuitas.
- Status hasil adalah DRAF, bukan FINAL.`;

  return `${common}\n\nTUGAS: AI EDITOR\nEvaluasi naskah berikut. Jangan langsung menulis ulang. Berikan temuan yang terukur dan contoh lokasi/kalimat yang relevan. Nilai: struktur adegan, pacing, voice, konsistensi karakter, dialog, repetisi, kejelasan, emosi, hook, serta kontinuitas terhadap konteks. Kelompokkan temuan menjadi BLOCKER, MAJOR, MINOR, dan OPTIONAL. Untuk setiap temuan berikan alasan dan saran. Akhiri dengan prioritas revisi. Tunggu persetujuan pemilik sebelum membuat versi revisi.\n\nARAHAN EDITORIAL:\n${brief || "Lakukan evaluasi editorial menyeluruh."}\n\nNASKAH UNTUK DITINJAU:\n${manuscript || "[Tempel naskah yang akan dievaluasi di sini]"}`;
}

export default function AiPipeline({ story, characters }: Props) {
  const [stage, setStage] = useState<Stage>("architect");
  const [brief, setBrief] = useState("");
  const [chapter, setChapter] = useState("");
  const [manuscript, setManuscript] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved) as { stage?: Stage; brief?: string; chapter?: string; manuscript?: string; prompt?: string; result?: string };
      if (data.stage) setStage(data.stage);
      setBrief(data.brief ?? "");
      setChapter(data.chapter ?? "");
      setManuscript(data.manuscript ?? "");
      setPrompt(data.prompt ?? "");
      setResult(data.result ?? "");
    } catch { /* ignore invalid local draft */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ stage, brief, chapter, manuscript, prompt, result }));
    } catch { setNotice("Penyimpanan browser penuh atau tidak tersedia."); }
  }, [stage, brief, chapter, manuscript, prompt, result]);

  const stageInfo = STAGES.find((item) => item.id === stage)!;
  const contextReady = Boolean(story.title || story.premise || story.synopsis);

  const generate = () => {
    setPrompt(buildPrompt(stage, story, characters, brief, chapter, manuscript));
    setNotice("Prompt siap. Salin ke ChatGPT atau AI pilihanmu.");
  };

  const copyPrompt = async () => {
    try { await navigator.clipboard.writeText(prompt); setNotice("Prompt berhasil disalin."); }
    catch { setNotice("Clipboard tidak tersedia. Salin prompt dari kotak teks."); }
  };

  const exportResult = () => {
    const title = story.title.trim() || "Novel NarraLab";
    const body = stage === "writer" ? result : `# Hasil ${stageInfo.label}\n\n${result}`;
    const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${stage}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("File Markdown diekspor. Tinjau sebelum memasukkannya ke Canon atau naskah.");
  };

  return (
    <section className="studio-card studio-form-card ai-pipeline">
      <div className="section-heading">
        <div><p className="eyebrow">AI production pipeline</p><h2>Studio AI</h2></div>
        <span className="muted small">Manual handoff · tanpa API berbayar</span>
      </div>
      <div className="ai-flow">
        {STAGES.map((item, index) => <button type="button" key={item.id} className={stage === item.id ? "ai-stage active" : "ai-stage"} onClick={() => { setStage(item.id); setPrompt(""); setNotice(""); }}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong></button>)}
      </div>
      <p className="muted ai-description">{stageInfo.description}</p>
      {!contextReady && <p className="ai-warning">Fondasi cerita masih kosong. Kamu tetap bisa mencoba, tetapi hasil AI akan lebih umum. Isi premis dan genre terlebih dahulu untuk hasil lebih terarah.</p>}
      {stage === "architect" && (
        <label className="ai-field">Ide / arahan Author<textarea rows={5} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Ceritakan ide mentah, tema, konflik, suasana, atau hal yang ingin kamu eksplorasi. AI akan mengembangkannya menjadi fondasi novel." /></label>
      )}
      {stage === "writer" && (
        <>
          <label className="ai-field">Chapter Plan / arahan bab<textarea rows={5} value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="Tujuan bab, POV, waktu/lokasi, karakter yang muncul, konflik, beat adegan, emosi, dan hook." /></label>
          <label className="ai-field">Ringkasan bab sebelumnya / konteks tambahan<textarea rows={3} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Tempel ringkasan bab sebelumnya atau keadaan cerita terakhir." /></label>
        </>
      )}
      {stage === "editor" && (
        <>
          <label className="ai-field">Fokus evaluasi<textarea rows={2} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Mis. fokus pacing dan dialog, jangan ubah sudut pandang." /></label>
          <label className="ai-field">Naskah yang akan ditinjau<textarea rows={9} value={manuscript} onChange={(e) => setManuscript(e.target.value)} placeholder="Tempel draf bab atau adegan di sini." /></label>
        </>
      )}
      <div className="ai-actions">
        <button className="btn btn-primary" type="button" onClick={generate}>Buat prompt AI</button>
        <span className="muted small">Konteks otomatis: ${characters.length} karakter · data proyek saat ini</span>
      </div>
      {prompt && (
        <div className="ai-output-block">
          <div className="ai-output-heading"><strong>Prompt siap dikirim</strong><button className="btn" type="button" onClick={copyPrompt}>Salin prompt</button></div>
          <textarea rows={12} readOnly value={prompt} aria-label="Prompt AI yang dihasilkan" />
        </div>
      )}
      <div className="ai-output-block">
        <div className="ai-output-heading"><strong>Hasil dari AI</strong><span className="muted small">Tempel jawaban AI di sini</span></div>
        <textarea rows={10} value={result} onChange={(e) => setResult(e.target.value)} placeholder="Setelah prompt dikirim ke ChatGPT, tempel hasilnya di sini untuk ditinjau dan diekspor." />
        <div className="ai-actions">
          <button className="btn" type="button" onClick={exportResult} disabled={!result.trim()}>Ekspor hasil .md</button>
          <span className="muted small">{result.trim() ? result.trim().split(/\s+/).length.toLocaleString("id-ID") + " kata" : "Belum ada hasil"}</span>
        </div>
      </div>
      {notice && <p className="ai-notice" role="status">{notice}</p>}
      <p className="ai-footnote">Penting: hasil yang ditempel di sini belum otomatis menjadi Canon atau versi bab resmi. Tinjau dulu, lalu simpan sebagai file versi baru. Jangan tempel rahasia ke layanan AI publik.</p>
    </section>
  );
}
