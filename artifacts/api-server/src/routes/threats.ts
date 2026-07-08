import { Router, type IRouter } from "express";
import { and, desc, eq, gte, lte, type SQL } from "drizzle-orm";
import { db, threatsTable } from "@workspace/db";
import { ListThreatsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/threats", async (req, res) => {
  const parsed = ListThreatsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid query." });
  }
  const { threatType, severity, dateFrom, dateTo, limit } = parsed.data;

  const filters: SQL[] = [eq(threatsTable.verified, true)];
  if (threatType) filters.push(eq(threatsTable.threatType, threatType));
  if (severity) filters.push(eq(threatsTable.severity, severity));
  if (dateFrom) {
    const from = new Date(dateFrom);
    if (!Number.isNaN(from.getTime())) filters.push(gte(threatsTable.createdAt, from));
  }
  if (dateTo) {
    const to = new Date(dateTo);
    if (!Number.isNaN(to.getTime())) filters.push(lte(threatsTable.createdAt, to));
  }

  const rows = await db
    .select()
    .from(threatsTable)
    .where(and(...filters))
    .orderBy(desc(threatsTable.createdAt))
    .limit(limit ?? 50);

  return res.json(rows);
});

export default router;
