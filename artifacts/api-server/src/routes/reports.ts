import { Router, type IRouter } from "express";
import { and, desc, eq, sql, type SQL } from "drizzle-orm";
import {
  db,
  reportsTable,
  guardiansTable,
  reputationEventsTable,
  reputationScoresTable,
  usedSignaturesTable,
} from "@workspace/db";
import { ListReportsQueryParams, SubmitReportBody } from "@workspace/api-zod";
import { verifyWalletSignature } from "../lib/solanaAuth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const REPORT_POINTS = 10;

class ReplayError extends Error {}

router.get("/reports", async (req, res) => {
  const parsed = ListReportsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query." });
  }
  const { status, wallet, limit } = parsed.data;

  const filters: SQL[] = [];
  if (status) filters.push(eq(reportsTable.status, status));
  if (wallet) filters.push(eq(reportsTable.reporterWallet, wallet));

  const rows = await db
    .select()
    .from(reportsTable)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(reportsTable.createdAt))
    .limit(limit ?? 50);

  return res.json(rows);
});

router.post("/reports", async (req, res) => {
  const parsed = SubmitReportBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid report." });
  }
  const body = parsed.data;

  // Reputation-granting action: require proof the reporter owns the wallet AND
  // that the signed message is bound to this exact report content, so a
  // signature cannot be reused for different reports.
  const verification = verifyWalletSignature(
    body.reporterWallet,
    body.message,
    body.signature,
    {
      Action: "submit_report",
      Target: body.target,
      TargetType: body.targetType,
      ThreatType: body.threatType,
    },
  );
  if (!verification.ok) {
    return res
      .status(401)
      .json({ error: verification.reason ?? "Wallet signature invalid." });
  }

  try {
    const report = await db.transaction(async (tx) => {
      // Anti-replay: each signature can be consumed exactly once. The unique
      // constraint on `signature` rejects reuse within its freshness window.
      const consumed = await tx
        .insert(usedSignaturesTable)
        .values({
          signature: body.signature,
          walletAddress: body.reporterWallet,
        })
        .onConflictDoNothing()
        .returning();
      if (consumed.length === 0) {
        throw new ReplayError("Signature already used.");
      }

      const [created] = await tx
        .insert(reportsTable)
        .values({
          reporterWallet: body.reporterWallet,
          target: body.target,
          targetType: body.targetType,
          threatType: body.threatType,
          description: body.description ?? null,
          evidenceUrl: body.evidenceUrl ?? null,
        })
        .returning();

      // Ensure the reporter exists as a Guardian, award reputation, log it.
      await tx
        .insert(guardiansTable)
        .values({ walletAddress: body.reporterWallet })
        .onConflictDoNothing();

      await tx
        .update(guardiansTable)
        .set({
          reportsSubmitted: sql`${guardiansTable.reportsSubmitted} + 1`,
          reputation: sql`${guardiansTable.reputation} + ${REPORT_POINTS}`,
        })
        .where(eq(guardiansTable.walletAddress, body.reporterWallet));

      await tx.insert(reputationEventsTable).values({
        guardianWallet: body.reporterWallet,
        eventType: "report_submitted",
        points: REPORT_POINTS,
        reason: `Submitted report for ${body.target}`,
      });

      // Maintain the aggregate reputation score snapshot for this wallet.
      await tx
        .insert(reputationScoresTable)
        .values({
          walletAddress: body.reporterWallet,
          totalScore: REPORT_POINTS,
          activityScore: REPORT_POINTS,
        })
        .onConflictDoUpdate({
          target: reputationScoresTable.walletAddress,
          set: {
            totalScore: sql`${reputationScoresTable.totalScore} + ${REPORT_POINTS}`,
            activityScore: sql`${reputationScoresTable.activityScore} + ${REPORT_POINTS}`,
            updatedAt: sql`now()`,
          },
        });

      return created;
    });

    return res.status(201).json(report);
  } catch (err) {
    if (err instanceof ReplayError) {
      return res.status(409).json({ error: err.message });
    }
    logger.error({ err }, "report submission failed");
    return res.status(400).json({ error: "Report submission failed." });
  }
});

export default router;
