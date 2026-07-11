import type { Settings } from "./types";

// Default Nodus backend. Point this at your deployed Nodus URL in production;
// it can be changed any time from the extension's Settings page.
export const DEFAULT_API_BASE =
  "https://2ac24d96-49b7-4164-9baa-1369e8bcf2c5-00-1s2owlo516m91.sisko.replit.dev";

export const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
export const AI_SUMMARY_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export const DEFAULT_SETTINGS: Settings = {
  apiBase: DEFAULT_API_BASE,
  protectionEnabled: true,
  walletAddress: "",
  whitelist: [],
};

export async function getSettings(): Promise<Settings> {
  const stored = await chrome.storage.local.get("settings");
  return {
    ...DEFAULT_SETTINGS,
    ...((stored.settings as Partial<Settings>) ?? {}),
  };
}

export async function saveSettings(
  patch: Partial<Settings>,
): Promise<Settings> {
  const current = await getSettings();
  const next: Settings = { ...current, ...patch };
  await chrome.storage.local.set({ settings: next });
  return next;
}

export function normalizeBase(base: string): string {
  return base.trim().replace(/\/+$/, "");
}
