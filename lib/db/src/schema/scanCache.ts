import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const scanCacheTable = pgTable(
  "scan_cache",
  {
    id: serial("id").primaryKey(),
    target: text("target").notNull(),
    targetType: text("target_type").notNull(),
    score: integer("score").notNull(),
    result: jsonb("result").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("scan_cache_target_idx").on(table.target)],
);

export type ScanCache = typeof scanCacheTable.$inferSelect;
