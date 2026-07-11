import { getSettings, normalizeBase } from "./config";
import type { AIAnalyzeResult, ScanResult, TargetType } from "./types";

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
): Promise<AIAnalyzeResult> {
  const { apiBase } = await getSettings();
  const base = normalizeBase(apiBase);

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
    throw new Error(await readApiError(res, `AI summary failed (${res.status})`));
  }

  return (await res.json()) as AIAnalyzeResult;
}
