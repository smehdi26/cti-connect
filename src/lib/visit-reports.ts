export type VisitReport = {
  fileName: string;
  fileSize: number;
  validated: boolean;
  validatedAt?: string;
  note?: string;
};

const KEY = "cti-visit-reports";

export const visitKey = (clientId: string, year: number, index: number) =>
  `${clientId}-${year}-${index}`;

export function loadReports(): Record<string, VisitReport> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, VisitReport>;
  } catch {
    return {};
  }
}

export function saveReports(reports: Record<string, VisitReport>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(reports));
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
