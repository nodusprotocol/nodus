import { logger } from "./logger";

const VT_BASE = "https://www.virustotal.com/api/v3";

function apiKey(): string | null {
  return process.env.VIRUSTOTAL_API_KEY ?? null;
}

export interface VirusTotalResult {
  available: boolean;
  score: number;
  summary: string;
  details: Record<string, unknown>;
}

function urlToId(url: string): string {
  return Buffer.from(url).toString("base64url").replace(/=+$/, "");
}

/**
 * Look up an existing URL analysis in VirusTotal. If not present, submit it
 * and poll briefly for the result. Returns a normalized security score
 * (0-100, higher is safer).
 */
export async function scanUrl(rawUrl: string): Promise<VirusTotalResult> {
  const key = apiKey();
  if (!key) {
    return {
      available: false,
      score: 0,
      summary: "VirusTotal API key not configured.",
      details: {},
    };
  }

  let url = rawUrl.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const id = urlToId(url);
    let report = await fetch(`${VT_BASE}/urls/${id}`, {
      headers: { "x-apikey": key },
    });

    if (report.status === 404) {
      const form = new URLSearchParams({ url });
      const submit = await fetch(`${VT_BASE}/urls`, {
        method: "POST",
        headers: {
          "x-apikey": key,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: form,
      });
      if (!submit.ok) {
        return {
          available: false,
          score: 0,
          summary: `VirusTotal submission failed (${submit.status}).`,
          details: {},
        };
      }
      await new Promise((r) => setTimeout(r, 4000));
      report = await fetch(`${VT_BASE}/urls/${id}`, {
        headers: { "x-apikey": key },
      });
    }

    if (!report.ok) {
      return {
        available: false,
        score: 0,
        summary: `VirusTotal lookup failed (${report.status}).`,
        details: {},
      };
    }

    const data = (await report.json()) as {
      data?: {
        attributes?: {
          last_analysis_stats?: {
            harmless?: number;
            malicious?: number;
            suspicious?: number;
            undetected?: number;
            timeout?: number;
          };
          reputation?: number;
        };
      };
    };

    const stats = data.data?.attributes?.last_analysis_stats ?? {};
    const malicious = stats.malicious ?? 0;
    const suspicious = stats.suspicious ?? 0;
    const harmless = stats.harmless ?? 0;
    const undetected = stats.undetected ?? 0;
    const total = malicious + suspicious + harmless + undetected;

    let score = 100;
    if (total > 0) {
      const badRatio = (malicious + suspicious * 0.5) / total;
      score = Math.max(0, Math.round(100 - badRatio * 100));
    }

    const summary =
      malicious > 0
        ? `${malicious} security vendors flagged this URL as malicious.`
        : suspicious > 0
          ? `${suspicious} vendors flagged this URL as suspicious.`
          : "No security vendors flagged this URL.";

    return {
      available: true,
      score,
      summary,
      details: {
        malicious,
        suspicious,
        harmless,
        undetected,
        reputation: data.data?.attributes?.reputation ?? 0,
      },
    };
  } catch (err) {
    logger.error({ err }, "VirusTotal scan error");
    return {
      available: false,
      score: 0,
      summary: "VirusTotal request failed.",
      details: {},
    };
  }
}
