// Memindai ../novel dan ../canon, lalu menulis web/public/content/:
//   - index.json : daftar bab, versi tertinggi tiap bab, riwayat versi, dokumen canon
//   - salinan file Markdown (tanpa frontmatter) yang dibaca aplikasi saat runtime
//
// Variabel lingkungan opsional (dipakai untuk pengujian):
//   NARRALAB_ROOT = folder yang berisi novel/ dan canon/ (default: root repo)
//   NARRALAB_OUT  = folder tujuan (default: web/public/content)

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(process.env.NARRALAB_ROOT ?? path.join(here, "..", ".."));
const OUT = path.resolve(process.env.NARRALAB_OUT ?? path.join(here, "..", "public", "content"));

const STATUSES = new Set(["draf", "direvisi", "final"]);
const CANON_ORDER = ["premis", "dunia", "karakter", "plot", "gaya", "status-objek", "timeline"];

const warnings = [];
const warn = (msg) => warnings.push(msg);

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function parseFrontmatter(raw) {
  const text = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
  if (!m) return { meta: {}, body: text };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (
      val.length >= 2 &&
      ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
    ) {
      val = val.slice(1, -1);
    }
    if (key) meta[key] = val;
  }
  return { meta, body: text.slice(m[0].length) };
}

function countWords(body) {
  const clean = body.replace(/^\s*(\*\*\*|---|___)\s*$/gm, "");
  return clean.trim().split(/\s+/).filter(Boolean).length;
}

function firstHeading(body, fallback) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : fallback;
}

async function copyBody(srcFile, destRel) {
  const raw = await fs.readFile(srcFile, "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const dest = path.join(OUT, destRel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, body.replace(/^\n+/, ""), "utf8");
  return { meta, body };
}

async function buildChapters() {
  const novelDir = path.join(ROOT, "novel");
  if (!(await exists(novelDir))) return [];

  const entries = await fs.readdir(novelDir, { withFileTypes: true });
  const dirs = entries
    .filter((d) => d.isDirectory() && /^bab-\d+$/.test(d.name))
    .map((d) => d.name)
    .sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)));

  const chapters = [];
  for (const dir of dirs) {
    const number = Number(dir.slice(4));
    const files = await fs.readdir(path.join(novelDir, dir));
    const versionNumbers = files
      .map((f) => f.match(/^v(\d+)\.md$/))
      .filter(Boolean)
      .map((m) => Number(m[1]))
      .sort((a, b) => a - b);

    if (versionNumbers.length === 0) {
      warn(`${dir}: tidak ada file vN.md, dilewati`);
      continue;
    }

    const versions = [];
    for (const v of versionNumbers) {
      const rel = `novel/${dir}/v${v}.md`;
      const { meta, body } = await copyBody(path.join(novelDir, dir, `v${v}.md`), rel);
      let status = meta.status;
      if (!STATUSES.has(status)) {
        if (status) warn(`${rel}: status "${status}" tidak dikenal, dianggap "draf"`);
        status = "draf";
      }
      versions.push({
        version: v,
        status,
        title: meta.judul || "",
        date: meta.tanggal || "",
        note: meta.catatan_revisi || "",
        words: countWords(body),
        path: `content/${rel}`,
      });
    }

    let summaryPath = null;
    if (files.includes("ringkasan.md")) {
      const rel = `novel/${dir}/ringkasan.md`;
      await copyBody(path.join(novelDir, dir, "ringkasan.md"), rel);
      summaryPath = `content/${rel}`;
    }

    const latest = versions[versions.length - 1];
    if (!latest.title) warn(`${dir}/v${latest.version}.md: frontmatter "judul" kosong`);
    chapters.push({
      id: dir,
      number,
      title: latest.title || `Bab ${number}`,
      status: latest.status,
      latestVersion: latest.version,
      words: latest.words,
      date: latest.date,
      summaryPath,
      versions: versions.map(({ title: _title, ...rest }) => rest),
    });
  }
  return chapters;
}

async function buildCanon() {
  const canonDir = path.join(ROOT, "canon");
  if (!(await exists(canonDir))) return [];

  const names = (await fs.readdir(canonDir))
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .map((f) => f.slice(0, -3));
  const ordered = [
    ...CANON_ORDER.filter((n) => names.includes(n)),
    ...names.filter((n) => !CANON_ORDER.includes(n)).sort(),
  ];

  const docs = [];
  for (const id of ordered) {
    const rel = `canon/${id}.md`;
    const { body } = await copyBody(path.join(canonDir, `${id}.md`), rel);
    docs.push({ id, title: firstHeading(body, id), path: `content/${rel}` });
  }
  return docs;
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const chapters = await buildChapters();
  const canon = await buildCanon();
  const totalWords = chapters.reduce((sum, c) => sum + c.words, 0);

  const index = { generatedAt: new Date().toISOString(), chapters, canon, totalWords };
  await fs.writeFile(path.join(OUT, "index.json"), JSON.stringify(index, null, 2), "utf8");

  console.log(
    `[narralab] ${chapters.length} bab, ${canon.length} dokumen canon, ${totalWords} kata -> ${OUT}`,
  );
  for (const w of warnings) console.warn(`[narralab] peringatan: ${w}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
