import type { ATSCheckResult } from "@/types/atsCheck";

/*
 * A free scan kept in this browser so a visitor can sign up and come back to it,
 * or hand it to the ATS optimizer, without uploading again. Nothing is stored on
 * our side; the file itself is never kept.
 */

const KEY = "rj-saved-scan";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export interface SavedScan {
  fileName: string;
  text: string;
  result: ATSCheckResult;
  savedAt: number;
}

export function saveScan(scan: Omit<SavedScan, "savedAt">) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...scan, savedAt: Date.now() }));
  } catch {
    // Private mode or storage full: the flow still works, it just can't resume.
  }
}

export function loadScan(): SavedScan | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const scan = JSON.parse(raw) as SavedScan;
    if (!scan?.text || !scan?.result || Date.now() - scan.savedAt > MAX_AGE_MS) return null;
    return scan;
  } catch {
    return null;
  }
}

export function clearScan() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
