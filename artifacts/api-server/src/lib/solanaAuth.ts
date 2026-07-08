import nacl from "tweetnacl";
import bs58 from "bs58";
import { logger } from "./logger";

// Signed messages older than this are rejected to prevent replay.
const MAX_MESSAGE_AGE_MS = 5 * 60 * 1000;

export interface VerifyResult {
  ok: boolean;
  reason?: string;
}

/**
 * Verify that `signature` is a valid Solana ed25519 signature of `message`
 * produced by `walletAddress`, that the message binds to this wallet, a recent
 * timestamp, and every provided content binding.
 *
 * Clients (Phantom `signMessage`) must sign a UTF-8 message of the form:
 *   Nodus Protocol
 *   Action: <action>
 *   Wallet: <walletAddress>
 *   Target: <target>
 *   TargetType: <targetType>
 *   ThreatType: <threatType>
 *   Timestamp: <unix-ms>
 *
 * `bindings` are additional `Key: value` lines that MUST appear verbatim in the
 * signed message, so a signature cannot be reused for different content.
 */
export function verifyWalletSignature(
  walletAddress: string,
  message: string,
  signature: string,
  bindings: Record<string, string> = {},
): VerifyResult {
  try {
    if (!message.includes(`Wallet: ${walletAddress}`)) {
      return { ok: false, reason: "Message does not bind to wallet." };
    }

    for (const [key, value] of Object.entries(bindings)) {
      if (!message.includes(`${key}: ${value}`)) {
        return { ok: false, reason: `Message does not bind to ${key}.` };
      }
    }

    const tsMatch = message.match(/Timestamp:\s*(\d+)/);
    if (!tsMatch) {
      return { ok: false, reason: "Message missing timestamp." };
    }
    const ts = Number(tsMatch[1]);
    if (!Number.isFinite(ts) || Math.abs(Date.now() - ts) > MAX_MESSAGE_AGE_MS) {
      return { ok: false, reason: "Signature expired." };
    }

    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(walletAddress);

    if (publicKeyBytes.length !== 32 || signatureBytes.length !== 64) {
      return { ok: false, reason: "Malformed key or signature." };
    }

    const valid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes,
    );
    return valid ? { ok: true } : { ok: false, reason: "Invalid signature." };
  } catch (err) {
    logger.warn({ err }, "signature verification error");
    return { ok: false, reason: "Signature verification failed." };
  }
}
