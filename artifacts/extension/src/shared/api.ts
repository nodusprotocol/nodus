import { getSettings, normalizeBase } from "./config";
import type { ScanResult, TargetType } from "./types";

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
    let message = `Scan failed (${res.status})`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }

  return (await res.json()) as ScanResult;
}
