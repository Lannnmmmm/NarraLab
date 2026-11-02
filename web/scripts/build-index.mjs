// Build public reader content from the explicit publication manifest.
// Drafts, revision history, and Canon documents are not copied to the public site.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(process.env.NARRALAB_ROOT ?? path.join(here, "..", ".."));
const OUT = path.resolve(process.env.NARRALAB_OUT ?? path.join(here, "..", "public", "content"));

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function parseFrontmatter(raw) {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
  if (!match) return { meta: {}, body: text };

  const meta = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    if (key) meta[key] = value;
  }
  return { meta, body: text.slice(match[0].length) };
}

function countWords(body) {
  return body
    .replace(/^\s*(\*\*\*|---|___)\s*$/gm, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

async function copyPublishedFile(source, destination) {
  const raw = await fs.readFile(source, "utf8");
  const { meta, body } = parseFrontmatter(raw);
  const target = path.join(OUT, destination);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body.replace(/^\n+/, ""), "utf8");
  return { meta, body };
}

async function readPublicationManifest() {
  const manifestPath = path.join(ROOT, "publication.json");
  if (!(await exists(manifestPath))) {
    throw new Error("publication.json tidak ditemukan. Buat manifest sebelum melakukan build.");
  }

  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  if (!manifest || !manifest.chapters || typeof manifest.chapters !== "object" || Array.isArray(manifest.chapters)) {
    throw new Error('Format publication.json tidak valid. Gunakan properti "chapters" berbentuk object.');
  }

  for (const [chapterId, version] of Object.entries(manifest.chapters)) {
    if (!/^bab-\d+$/.test(chapterId) || !Number.isInteger(version) || version < 1) {
      throw new Error(`Entri publikasi tidak valid: ${chapterId} = ${version}`);
    }
  }

  return manifest.chapters;
}

async function buildPublishedChapters(publication) {
  const novelDir = path.join(ROOT, "novel");
  const chapters = [];

  for (const [id, version] of Object.entries(publication).sort(([a], [b]) =>
    a.localeCompare(b, "en", { numeric: true }),
  )) {
    const chapterDir = path.join(novelDir, id);
    const source = path.join(chapterDir, `v${version}.md`);

    if (!(await exists(source))) {
      throw new Error(`Versi terbit tidak ditemukan: novel/${id}/v${version}.md`);
    }

    const relativePath = `novel/${id}/v${version}.md`;
    const { meta, body } = await copyPublishedFile(source, `content/${relativePath}`);

    if (meta.status !== "final") {
      throw new Error(
        `Versi ${relativePath} belum berstatus "final". Hanya versi final yang boleh diterbitkan.`,
      );
    }

    const number = Number(id.slice(4));
    const summarySource = path.join(chapterDir, "ringkasan.md");
    let summaryPath = null;

    if (await exists(summarySource)) {
      await copyPublishedFile(summarySource, `content/novel/${id}/ringkasan.md`);
      summaryPath = `content/novel/${id}/ringkasan.md`;
    }

    chapters.push({
      id,
      number,
      title: meta.judul || `Bab ${number}`,
      status: "final",
      latestVersion: version,
      words: countWords(body),
      date: meta.tanggal || "",
      summaryPath,
      versions: [
        {
          version,
          status: "final",
          date: meta.tanggal || "",
          note: meta.catatan_revisi || "",
          words: countWords(body),
          path: `content/${relativePath}`,
        },
      ],
    });
  }

  return chapters;
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const publication = await readPublicationManifest();
  const chapters = await buildPublishedChapters(publication);
  const totalWords = chapters.reduce((sum, chapter) => sum + chapter.words, 0);
  const index = { generatedAt: new Date().toISOString(), chapters, canon: [], totalWords };

  await fs.writeFile(path.join(OUT, "index.json"), JSON.stringify(index, null, 2), "utf8");
  console.log(
    `[narralab] ${chapters.length} bab terbit, ${totalWords} kata -> ${OUT}`,
  );
}

main().catch((error) => {
  console.error(`[narralab] build gagal: ${error.message}`);
  process.exit(1);
});
