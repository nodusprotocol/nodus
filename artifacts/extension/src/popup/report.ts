import { normalizeBase } from "../shared/config";
import type { TargetType } from "../shared/types";

export type ThreatType =
  | "phishing"
  | "drainer"
  | "scam"
  | "rugpull"
  | "fake_token"
  | "fake_social"
  | "malicious_contract"
  | "other";

export interface ReportInput {
  apiBase: string;
  target: string;
  targetType: TargetType;
  threatType: ThreatType;
  description?: string;
  evidenceUrl?: string;
}

export interface ReportOutcome {
  ok: boolean;
  error?: string;
}

/**
 * Runs in the ACTIVE TAB's page context (MAIN world) so it can reach the
 * injected Phantom provider (`window.solana`). Connects, signs the exact
 * canonical Nodus message, then POSTs the report straight to the backend.
 *
 * MUST be fully self-contained — Chrome serializes this via `toString()`, so it
 * cannot reference any imports or outer-scope bindings.
 */
function signAndReport(params: ReportInput): Promise<ReportOutcome> {
  return (async () => {
    const provider = (window as unknown as { solana?: any }).solana;
    if (!provider || !provider.isPhantom) {
      return {
        ok: false,
        error: "Phantom not detected on this page. Install Phantom and reload the tab.",
      };
    }
    try {
      const conn = await provider.connect();
      const walletAddress = (conn?.publicKey ?? provider.publicKey)?.toString();
      if (!walletAddress) return { ok: false, error: "Could not read wallet address." };

      const timestamp = Date.now();
      const message =
        "Nodus Protocol\n" +
        "Action: submit_report\n" +
        "Wallet: " + walletAddress + "\n" +
        "Target: " + params.target + "\n" +
        "TargetType: " + params.targetType + "\n" +
        "ThreatType: " + params.threatType + "\n" +
        "Timestamp: " + timestamp;

      const encoded = new TextEncoder().encode(message);
      const signed = await provider.signMessage(encoded, "utf8");
      const sigBytes: Uint8Array = signed?.signature ?? signed;

      // Inline base58 (bitcoin alphabet) encoder — no imports allowed here.
      const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
      const bytes = Array.from(sigBytes);
      const digits: number[] = [0];
      for (let i = 0; i < bytes.length; i++) {
        let carry = bytes[i];
        for (let j = 0; j < digits.length; j++) {
          carry += digits[j] << 8;
          digits[j] = carry % 58;
          carry = (carry / 58) | 0;
        }
        while (carry > 0) {
          digits.push(carry % 58);
          carry = (carry / 58) | 0;
        }
      }
      let signature = "";
      for (let k = 0; k < bytes.length && bytes[k] === 0; k++) signature += "1";
      for (let q = digits.length - 1; q >= 0; q--) signature += ALPHABET[digits[q]];

      const res = await fetch(params.apiBase + "/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterWallet: walletAddress,
          target: params.target,
          targetType: params.targetType,
          threatType: params.threatType,
          description: params.description || undefined,
          evidenceUrl: params.evidenceUrl || undefined,
          message,
          signature,
        }),
      });

      if (!res.ok) {
        let msg = "Submit failed (" + res.status + ")";
        try {
          const j = await res.json();
          if (j && j.error) msg = j.error;
        } catch {
          // ignore non-JSON error body
        }
        return { ok: false, error: msg };
      }
      return { ok: true };
    } catch (e) {
      const err = e as { message?: string };
      return { ok: false, error: err?.message || "Signature request was rejected." };
    }
  })();
}

/**
 * Submit a report directly to the Nodus backend by signing with the Phantom
 * wallet in the given tab. The signing + POST happen inside the page, so the
 * submission completes even if this popup closes when Phantom takes focus.
 */
export async function submitReport(
  tabId: number,
  input: ReportInput,
): Promise<ReportOutcome> {
  const params: ReportInput = { ...input, apiBase: normalizeBase(input.apiBase) };
  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId },
      world: "MAIN",
      func: signAndReport,
      args: [params],
    });
    return (injection?.result as ReportOutcome) ?? {
      ok: false,
      error: "No response from page.",
    };
  } catch {
    return {
      ok: false,
      error: "Can't sign on this page. Open the site in a normal tab and try again.",
    };
  }
}
