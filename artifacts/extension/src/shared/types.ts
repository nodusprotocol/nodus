export type Verdict = "safe" | "caution" | "danger";

export type TargetType = "website" | "wallet" | "contract" | "token" | "social";

export interface ScanSource {
  source: string;
  available: boolean;
  score: number;
  summary: string;
  details: Record<string, unknown>;
}

export interface ScanResult {
  target: string;
  targetType: TargetType;
  score: number;
  verdict: Verdict;
  sources: ScanSource[];
  communityReports: number;
  knownThreat: boolean;
}

export interface AIAnalyzeResult {
  target: string;
  verdict: Verdict;
  score: number;
  analysis: string;
  recommendations: string[];
}

export interface CachedScan {
  result?: ScanResult;
  fetchedAt: number;
  error?: string;
}

export interface Settings {
  apiBase: string;
  protectionEnabled: boolean;
  walletAddress: string;
  whitelist: string[];
}

/** Message contract between popup/content and the background service worker. */
export type RuntimeMessage =
  | { type: "GET_SCAN"; url: string; force?: boolean }
  | { type: "CONTENT_READY" };

export interface GetScanResponse extends CachedScan {
  domain?: string;
  whitelisted?: boolean;
  disabled?: boolean;
}
