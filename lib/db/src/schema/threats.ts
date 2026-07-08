import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const threatsTable = pgTable(
  "threats",
  {
    id: serial("id").primaryKey(),
    target: text("target").notNull(),
    targetType: text("target_type").notNull(),
    threatType: text("threat_type").notNull(),
    severity: text("severity").notNull().default("medium"),
    score: integer("score").notNull().default(0),
    source: text("source").notNull(),
    description: text("description"),
    evidenceUrl: text("evidence_url"),
    verified: boolean("verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("threats_target_idx").on(table.target),
    index("threats_type_idx").on(table.threatType),
    index("threats_created_idx").on(table.createdAt),
  ],
);

export const insertThreatSchema = createInsertSchema(threatsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertThreat = z.infer<typeof insertThreatSchema>;
export type Threat = typeof threatsTable.$inferSelect;
