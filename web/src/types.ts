export type Status = "draf" | "direvisi" | "final";

export interface VersionInfo {
  version: number;
  status: Status;
  date: string;
  note: string;
  words: number;
  path: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  status: Status;
  latestVersion: number;
  words: number;
  date: string;
  summaryPath: string | null;
  versions: VersionInfo[];
}

export interface CanonDoc {
  id: string;
  title: string;
  path: string;
}

export interface SiteIndex {
  generatedAt: string;
  chapters: Chapter[];
  canon: CanonDoc[];
  totalWords: number;
}
