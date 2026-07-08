import { logger } from "./logger";

const GOPLUS_BASE = "https://api.gopluslabs.io/api/v1";
// Solana chain id used by GoPlus token security endpoints.
const SOLANA_CHAIN = "solana";

export interface GoPlusResult {
  available: boolean;
  score: number;
  summary: string;
  details: Record<string, unknown>;
}

/**
 * GoPlus token security for a Solana token/contract address.
 * Returns a normalized 0-100 score (higher is safer).
 */
export async function scanToken(address: string): Promise<GoPlusResult> {
  try {
    const res = await fetch(
      `${GOPLUS_BASE}/solana/token_security?contract_addresses=${encodeURIComponent(
        address,
      )}`,
    );
    if (!res.ok) {
      return {
        available: false,
        score: 0,
        summary: `GoPlus token lookup failed (${res.status}).`,
        details: {},
      };
    }
    const data = (await res.json()) as {
      code?: number;
      result?: Record<string, Record<string, unknown>>;
    };

    const entry = data.result?.[address] ?? Object.values(data.result ?? {})[0];
    if (!entry) {
      return {
        available: false,
        score: 0,
        summary: "No GoPlus data found for this token.",
        details: {},
      };
    }

    const flags: string[] = [];
    let penalty = 0;
    // GoPlus Solana fields are sometimes primitives ("1") and sometimes
    // nested objects of the form { status: "1", authority: [...] }.
    const isFlagged = (v: unknown): boolean => {
      if (v === "1" || v === 1 || v === true) return true;
      if (v && typeof v === "object") {
        const status = (v as { status?: unknown }).status;
        return status === "1" || status === 1 || status === true;
      }
      return false;
    };
    const check = (key: string, label: string, weight: number) => {
      if (isFlagged(entry[key])) {
        flags.push(label);
        penalty += weight;
      }
    };

    check("is_honeypot", "Honeypot detected", 60);
    check("mintable", "Token is mintable", 15);
    check("freezable", "Token is freezable", 15);
    check("non_transferable", "Non-transferable", 40);
    check("transfer_fee_upgradable", "Transfer fee upgradable", 20);
    check("balance_mutable_authority", "Balance mutable by authority", 25);
    check("closable", "Account closable by authority", 20);

    const score = Math.max(0, 100 - penalty);
    const summary =
      flags.length > 0
        ? `GoPlus flagged: ${flags.join(", ")}.`
        : "GoPlus found no critical token risks.";

    return {
      available: true,
      score,
      summary,
      details: { flags, raw: entry },
    };
  } catch (err) {
    logger.error({ err }, "GoPlus token scan error");
    return {
      available: false,
      score: 0,
      summary: "GoPlus request failed.",
      details: {},
    };
  }
}

/**
 * GoPlus malicious address check — works across chains for scam/sanctioned
 * wallet detection.
 */
export async function scanAddress(address: string): Promise<GoPlusResult> {
  try {
    const res = await fetch(
      `${GOPLUS_BASE}/address_security/${encodeURIComponent(
        address,
      )}?chain_id=${SOLANA_CHAIN}`,
    );
    if (!res.ok) {
      return {
        available: false,
        score: 0,
        summary: `GoPlus address lookup failed (${res.status}).`,
        details: {},
      };
    }
    const data = (await res.json()) as {
      code?: number;
      result?: Record<string, unknown>;
    };
    const entry = data.result ?? {};

    const flags: string[] = [];
    let penalty = 0;
    const check = (key: string, label: string, weight: number) => {
      const v = entry[key];
      if (v === "1" || v === 1 || v === true) {
        flags.push(label);
        penalty += weight;
      }
    };

    check("phishing_activities", "Phishing activity", 50);
    check("blacklist_doubt", "On blacklist", 40);
    check("stealing_attack", "Stealing attack", 60);
    check("fake_kyc", "Fake KYC", 30);
    check("malicious_mining_activities", "Malicious mining", 25);
    check("darkweb_transactions", "Darkweb transactions", 40);
    check("money_laundering", "Money laundering", 50);
    check("sanctioned", "Sanctioned address", 60);
    check("honeypot_related_address", "Honeypot related", 40);

    const score = Math.max(0, 100 - penalty);
    const summary =
      flags.length > 0
        ? `GoPlus flagged: ${flags.join(", ")}.`
        : "GoPlus found no malicious history for this address.";

    return {
      available: true,
      score,
      summary,
      details: { flags, raw: entry },
    };
  } catch (err) {
    logger.error({ err }, "GoPlus address scan error");
    return {
      available: false,
      score: 0,
      summary: "GoPlus request failed.",
      details: {},
    };
  }
}

/**
 * GoPlus phishing site check for a URL/domain.
 */
export async function scanSite(url: string): Promise<GoPlusResult> {
  try {
    const res = await fetch(
      `${GOPLUS_BASE}/phishing_site?url=${encodeURIComponent(url)}`,
    );
    if (!res.ok) {
      return {
        available: false,
        score: 0,
        summary: `GoPlus phishing check failed (${res.status}).`,
        details: {},
      };
    }
    const data = (await res.json()) as {
      code?: number;
      result?: { phishing_site?: number; website_contract_security?: unknown };
    };
    const isPhishing = data.result?.phishing_site === 1;
    return {
      available: true,
      score: isPhishing ? 0 : 100,
      summary: isPhishing
        ? "GoPlus flagged this site as a known phishing site."
        : "GoPlus did not flag this site as phishing.",
      details: { raw: data.result ?? {} },
    };
  } catch (err) {
    logger.error({ err }, "GoPlus site scan error");
    return {
      available: false,
      score: 0,
      summary: "GoPlus request failed.",
      details: {},
    };
  }
}
