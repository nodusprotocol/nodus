import type { ScanResult, Verdict } from "./types";

/** Vivid colors for the badge (needs strong contrast against white text). */
export function badgeColor(verdict: Verdict): string {
  switch (verdict) {
    case "safe":
      return "#16a34a";
    case "caution":
      return "#d97706";
    case "danger":
      return "#dc2626";
  }
}

export function verdictLabel(verdict: Verdict): string {
  switch (verdict) {
    case "safe":
      return "Safe";
    case "caution":
      return "Caution";
    case "danger":
      return "Danger";
  }
}

/**
 * Build a concise, honest summary purely from the real scan result — no
 * fabricated claims. Reflects the verdict, contributing sources, and any
 * community signal returned by the Nodus backend.
 */
export function buildSummary(result: ScanResult): string {
  const parts: string[] = [];
  const available = result.sources.filter((s) => s.available);

  if (result.knownThreat) {
    parts.push("This target matches a verified threat in the Nodus database.");
  }

  if (result.verdict === "safe") {
    parts.push("No significant threats were detected by the available intelligence sources.");
  } else if (result.verdict === "caution") {
    parts.push("Some risk signals were found. Review the details before connecting your wallet.");
  } else {
    parts.push("High-risk signals detected. Avoid connecting your wallet or signing transactions.");
  }

  if (available.length > 0) {
    parts.push(`Analyzed by ${available.map((s) => s.source).join(" and ")}.`);
  } else {
    parts.push("No automated third-party intelligence was available for this target.");
  }

  if (result.communityReports > 0) {
    parts.push(
      `${result.communityReports} community report${result.communityReports === 1 ? "" : "s"} on file.`,
    );
  }

  return parts.join(" ");
}
