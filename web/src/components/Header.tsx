import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_READER,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  type ReaderSettings,
  type ReadingFont,
  type ReadingWidth,
} from "../settings";
import { hrefLibrary, hrefStudio } from "../router";
import type { ThemePref } from "../theme";
import { AutoIcon, MoonIcon, SunIcon, TextIcon } from "./Icons";

interface HeaderProps {
  page: string;
  theme: ThemePref;
  onTheme: (theme: ThemePref) => void;
  reader: ReaderSettings;
  onReader: (settings: ReaderSettings) => void;
}

const THEMES: { id: ThemePref; label: string; Icon: typeof SunIcon }[] = [
  { id: "light", label: "Tema terang", Icon: SunIcon },
  { id: "system", label: "Ikuti sistem", Icon: AutoIcon },
  { id: "dark", label: "Tema gelap", Icon: MoonIcon },
];

const WIDTHS: { id: ReadingWidth; label: string }[] = [
  { id: "narrow", label: "Sempit" },
  { id: "medium", label: "Sedang" },
  { id: "wide", label: "Lebar" },
];

const FONTS: { id: ReadingFont; label: string }[] = [
  { id: "serif", label: "Serif" },
  { id: "sans", label: "Sans" },
];

export default function Header({ page, theme, onTheme, reader, onReader }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="brand" href={hrefLibrary()}>
          <span className="brand-mark" aria-hidden="true">N</span>
          <span className="brand-name">NarraLab</span>
        </a>

        <nav className="site-nav" aria-label="Navigasi utama">
          <a href={hrefStudio()} aria-current={page === "studio" ? "page" : undefined}>Workspace</a>
          <a href={hrefLibrary()} aria-current={page === "library" || page === "chapter" ? "page" : undefined}>Novel</a>
        </nav>

        <div className="header-tools">
          <div className="popover-wrap" ref={panelRef}>
            <button
              type="button"
              className="icon-btn"
              aria-label="Pengaturan membaca"
              aria-expanded={open}
              aria-controls="reader-panel"
              onClick={() => setOpen((value) => !value)}
            >
              <TextIcon />
            </button>

            {open && (
              <div className="popover" id="reader-panel" role="dialog" aria-label="Pengaturan membaca">
                <label className="field">
                  <span className="field-label">
                    Ukuran huruf <output>{reader.fontSize}px</output>
                  </span>
                  <input
                    type="range"
                    min={FONT_SIZE_MIN}
                    max={FONT_SIZE_MAX}
                    step={1}
                    value={reader.fontSize}
                    onChange={(event) => onReader({ ...reader, fontSize: Number(event.target.value) })}
                  />
                </label>

                <div className="field">
                  <span className="field-label">Jenis huruf</span>
                  <div className="segmented" role="group" aria-label="Jenis huruf">
                    {FONTS.map((font) => (
                      <button key={font.id} type="button" aria-pressed={reader.font === font.id}
                        onClick={() => onReader({ ...reader, font: font.id })}>{font.label}</button>
                    ))}
                  </div>
                </div>

                <div className="field">
                  <span className="field-label">Lebar teks</span>
                  <div className="segmented" role="group" aria-label="Lebar teks">
                    {WIDTHS.map((width) => (
                      <button key={width.id} type="button" aria-pressed={reader.width === width.id}
                        onClick={() => onReader({ ...reader, width: width.id })}>{width.label}</button>
                    ))}
                  </div>
                </div>

                <button type="button" className="link-btn" onClick={() => onReader(DEFAULT_READER)}>
                  Kembalikan ke bawaan
                </button>
              </div>
            )}
          </div>

          <div className="segmented segmented-icons" role="group" aria-label="Tema tampilan">
            {THEMES.map(({ id, label, Icon }) => (
              <button key={id} type="button" aria-label={label} title={label} aria-pressed={theme === id}
                onClick={() => onTheme(id)}><Icon /></button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
