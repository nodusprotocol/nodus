import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import {
  db,
  guardiansTable,
  reportsTable,
  reputationEventsTable,
} from "@workspace/db";
import {
  ConnectGuardianBody,
  GetGuardianLeaderboardQueryParams,
} from "@workspace/api-zod";
import { verifyWalletSignature } from "../lib/solanaAuth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function tierFor(reputation: number): string {
  if (reputation >= 1000) return "sentinel";
  if (reputation >= 250) return "warden";
  return "guardian";
}

router.post("/guardians/connect", async (req, res) => {
  const parsed = ConnectGuardianBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid wallet." });
  }
  const { walletAddress, message, signature } = parsed.data;

  // Establishing a Guardian identity is trust-bearing: require the client to
  // prove ownership of the wallet with a fresh ed25519 signature so an
  // identity cannot be spoofed by sending someone else's address.
  const verification = verifyWalletSignature(walletAddress, message, signature, {
    Action: "connect_guardian",
  });
  if (!verification.ok) {
    return res.status(401).json({ error: verification.reason ?? "Invalid signature." });
  }

  try {
    await db
      .insert(guardiansTable)
      .values({ walletAddress })
      .onConflictDoNothing();

    const [guardian] = await db
      .select()
      .from(guardiansTable)
      .where(eq(guardiansTable.walletAddress, walletAddress));

    return res.json(guardian);
  } catch (err) {
    logger.error({ err }, "guardian connect failed");
    return res.status(400).json({ error: "Guardian connect failed." });
  }
});

router.get("/guardians/leaderboard", async (req, res) => {
  const parsed = GetGuardianLeaderboardQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query." });
  }
  const { limit } = parsed.data;

  const rows = await db
    .select()
    .from(guardiansTable)
    .orderBy(desc(guardiansTable.reputation))
    .limit(limit ?? 20);

  return res.json(rows);
});

router.get("/guardians/:wallet", async (req, res) => {
  const wallet = req.params.wallet;

  const [guardian] = await db
    .select()
    .from(guardiansTable)
    .where(eq(guardiansTable.walletAddress, wallet));

  if (!guardian) {
    return res.status(404).json({ error: "Guardian not found." });
  }

  const [recentReports, reputationHistory] = await Promise.all([
    db
      .select()
      .from(reportsTable)
      .where(eq(reportsTable.reporterWallet, wallet))
      .orderBy(desc(reportsTable.createdAt))
      .limit(20),
    db
      .select()
      .from(reputationEventsTable)
      .where(eq(reputationEventsTable.guardianWallet, wallet))
      .orderBy(desc(reputationEventsTable.createdAt))
      .limit(20),
  ]);

  return res.json({
    guardian: { ...guardian, tier: tierFor(guardian.reputation) },
    recentReports,
    reputationHistory,
  });
});

export default router;
