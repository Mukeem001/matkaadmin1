import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { marketsTable } from "./markets";
export const resultsTable = pgTable("results", {
    id: serial("id").primaryKey(),
    marketId: integer("market_id").notNull().references(() => marketsTable.id),
    resultDate: text("result_date").notNull(),
    openResult: text("open_result"),
    closeResult: text("close_result"),
    jodiResult: text("jodi_result"),
    pannaResult: text("panna_result"),
    declaredAt: timestamp("declared_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertResultSchema = createInsertSchema(resultsTable).omit({ id: true, createdAt: true });
//# sourceMappingURL=results.js.map