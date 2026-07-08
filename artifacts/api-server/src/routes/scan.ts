import { Router, type IRouter } from "express";
import { and, count, eq } from "drizzle-orm";
import { db, threatsTable, reportsTable, guardiansTable } from "@workspace/db";
import { ScanTargetBody } from "@workspace/api-zod";
import { scanUrl } from "../lib/virustotal";
import { scanToken, scanAddress, scanSite } from "../lib/goplus";
import { logger } from "../lib/logger";

const router: IRouter = Router();

type SourceResult = {
  source: string;
  available: boolean;
  score: number;
  summary: string;
  details: Record<string, unknown>;
};

function verdictFor(score: number): "safe" | "caution" | "danger" {
  if (score >= 75) return "safe";
  if (score >= 45) return "caution";
  return "danger";
}

router.post("/scan", async (req, res) => {
  const parsed = ScanTargetBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid scan request." });
  }
  const { target, targetType } = parsed.data;

  const sources: SourceResult[] = [];

  try {
    if (targetType === "website") {
      const [vt, gp] = await Promise.all([scanUrl(target), scanSite(target)]);
      sources.push({ source: "VirusTotal", ...vt });
      sources.push({ source: "GoPlus", ...gp });
    } else if (targetType === "token" || targetType === "contract") {
      const gp = await scanToken(target);
      sources.push({ source: "GoPlus", ...gp });
    } else if (targetType === "wallet") {
      const gp = await scanAddress(target);
      sources.push({ source: "GoPlus", ...gp });
    } else {
      // social — no third-party address intel; rely on community reports.
      sources.push({
        source: "GoPlus",
        available: false,
        score: 0,
        summary: "No automated intelligence available for social accounts.",
        details: {},
      });
    }

    // Community intelligence: known threats + open reports for this target.
    const [knownThreatRows, reportRows] = await Promise.all([
      db
        .select({ c: count() })
        .from(threatsTable)
        .where(and(eq(threatsTable.target, target), eq(threatsTable.verified, true))),
      db
        .select({ c: count() })
        .from(reportsTable)
        .where(eq(reportsTable.target, target)),
    ]);

    const communityReports = reportRows[0]?.c ?? 0;
    const knownThreat = (knownThreatRows[0]?.c ?? 0) > 0;

    const availableScores = sources
      .filter((s) => s.available)
      .map((s) => s.score);

    let score: number;
    if (availableScores.length > 0) {
      score = Math.round(
        availableScores.reduce((a, b) => a + b, 0) / availableScores.length,
      );
    } else {
      // No external intel — start neutral, then apply community signal.
      score = 70;
    }

    if (knownThreat) score = Math.min(score, 10);
    if (communityReports > 0) {
      score = Math.max(0, score - Math.min(40, communityReports * 10));
    }

    return res.json({
      target,
      targetType,
      score,
      verdict: verdictFor(score),
      sources,
      communityReports,
      knownThreat,
    });
  } catch (err) {
    logger.error({ err }, "scan failed");
    return res.status(400).json({ error: "Scan failed." });
  }
});

router.get("/scan/stats", async (_req, res) => {
  const [threats, reports, guardians, byType] = await Promise.all([
    db.select({ c: count() }).from(threatsTable),
    db.select({ c: count() }).from(reportsTable),
    db.select({ c: count() }).from(guardiansTable),
    db
      .select({
        threatType: threatsTable.threatType,
        c: count(),
      })
      .from(threatsTable)
      .groupBy(threatsTable.threatType),
  ]);

  const typeMap = new Map(byType.map((r) => [r.threatType, Number(r.c)]));

  return res.json({
    totalThreats: Number(threats[0]?.c ?? 0),
    totalReports: Number(reports[0]?.c ?? 0),
    totalGuardians: Number(guardians[0]?.c ?? 0),
    phishingCount: typeMap.get("phishing") ?? 0,
    drainerCount: typeMap.get("drainer") ?? 0,
    scamCount:
      (typeMap.get("scam") ?? 0) +
      (typeMap.get("rugpull") ?? 0) +
      (typeMap.get("fake_token") ?? 0),
  });
});

export default router;
