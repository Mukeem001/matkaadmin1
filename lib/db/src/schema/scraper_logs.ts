import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { marketsTable } from "./markets";

export const scraperLogsTable = pgTable("scraper_logs", {
  id: serial("id").primaryKey(),
  marketId: integer("market_id").references(() => marketsTable.id),
  marketName: text("market_name"),
  sourceUrl: text("source_url"),
  success: boolean("success").notNull(),
  openResult: text("open_result"),
  closeResult: text("close_result"),
  jodiResult: text("jodi_result"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertScraperLogSchema = createInsertSchema(scraperLogsTable).omit({ id: true, createdAt: true });
export type InsertScraperLog = z.infer<typeof insertScraperLogSchema>;
export type ScraperLog = typeof scraperLogsTable.$inferSelect;
