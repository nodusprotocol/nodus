import {
  pgTable,
  serial,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reportsTable = pgTable(
  "reports",
  {
    id: serial("id").primaryKey(),
    reporterWallet: text("reporter_wallet").notNull(),
    target: text("target").notNull(),
    targetType: text("target_type").notNull(),
    threatType: text("threat_type").notNull(),
    description: text("description"),
    evidenceUrl: text("evidence_url"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("reports_wallet_idx").on(table.reporterWallet),
    index("reports_status_idx").on(table.status),
    index("reports_created_idx").on(table.createdAt),
  ],
);

export const insertReportSchema = createInsertSchema(reportsTable).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reportsTable.$inferSelect;
