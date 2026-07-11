import { AI_SUMMARY_CACHE_TTL_MS, getSettings, normalizeBase } from "./config";
import type { AIAnalyzeResult, ScanResult, TargetType } from "./types";

type CachedAIAnalyzeResult = {
  result: AIAnalyzeResult;
  fetchedAt: number;
};

type AIAnalyzeCache = Record<string, CachedAIAnalyzeResult>;

const AI_SUMMARY_CACHE_KEY = "aiSummaryCache";

function aiCacheKey(
  apiBase: string,
  target: string,
  targetType: TargetType,
): string {
  return `${normalizeBase(apiBase)}::${targetType}::${target.toLowerCase()}`;
}

async function getAIAnalyzeCache(): Promise<AIAnalyzeCache> {
  const stored = await chrome.storage.local.get(AI_SUMMARY_CACHE_KEY);
  return (stored[AI_SUMMARY_CACHE_KEY] as AIAnalyzeCache | undefined) ?? {};
}

async function saveAIAnalyzeCache(cache: AIAnalyzeCache): Promise<void> {
  await chrome.storage.local.set({ [AI_SUMMARY_CACHE_KEY]: cache });
}

async function readApiError(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data?.error || fallback;
  } catch {
    return fallback;
  }
}

export async function scanTarget(
  target: string,
  targetType: TargetType = "website",
): Promise<ScanResult> {
  const { apiBase } = await getSettings();
  const base = normalizeBase(apiBase);

  const res = await fetch(`${base}/api/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target, targetType }),
  });

  if (!res.ok) {
    throw new Error(await readApiError(res, `Scan failed (${res.status})`));
  }

  return (await res.json()) as ScanResult;
}

export async function analyzeTargetWithAI(
  target: string,
  targetType: TargetType = "website",
  force = false,
): Promise<AIAnalyzeResult> {
  const { apiBase } = await getSettings();
  const base = normalizeBase(apiBase);
  const cacheKey = aiCacheKey(base, target, targetType);

  if (!force) {
    const cache = await getAIAnalyzeCache();
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.fetchedAt < AI_SUMMARY_CACHE_TTL_MS) {
      return cached.result;
    }
  }

  const res = await fetch(`${base}/api/ai/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      target,
      targetType,
      question: "Summarize this target's risk for the browser extension popup.",
    }),
  });

  if (!res.ok) {
    throw new Error(
      await readApiError(res, `AI summary failed (${res.status})`),
    );
  }

  const result = (await res.json()) as AIAnalyzeResult;
  const cache = await getAIAnalyzeCache();
  cache[cacheKey] = { result, fetchedAt: Date.now() };
  await saveAIAnalyzeCache(cache);

  return result;
}
