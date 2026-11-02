export type ReadingWidth = "narrow" | "medium" | "wide";
export type ReadingFont = "serif" | "sans";

export interface ReaderSettings {
  fontSize: number;
  width: ReadingWidth;
  font: ReadingFont;
}

export const DEFAULT_READER: ReaderSettings = {
  fontSize: 19,
  width: "medium",
  font: "serif",
};

export const FONT_SIZE_MIN = 15;
export const FONT_SIZE_MAX = 28;

export interface Prefs {
  finalOnly: boolean;
}

export const DEFAULT_PREFS: Prefs = { finalOnly: false };

export const LAST_READ_KEY = "narralab:last";
