import { pgTable, serial, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const gameRatesTable = pgTable("game_rates", {
    id: serial("id").primaryKey(),
    singleDigit: numeric("single_digit", { precision: 10, scale: 2 }).notNull().default("9"),
    jodiDigit: numeric("jodi_digit", { precision: 10, scale: 2 }).notNull().default("90"),
    singlePanna: numeric("single_panna", { precision: 10, scale: 2 }).notNull().default("150"),
    doublePanna: numeric("double_panna", { precision: 10, scale: 2 }).notNull().default("300"),
    triplePanna: numeric("triple_panna", { precision: 10, scale: 2 }).notNull().default("600"),
    halfSangam: numeric("half_sangam", { precision: 10, scale: 2 }).notNull().default("1500"),
    fullSangam: numeric("full_sangam", { precision: 10, scale: 2 }).notNull().default("3000"),
});
export const insertGameRatesSchema = createInsertSchema(gameRatesTable).omit({ id: true });
//# sourceMappingURL=game_rates.js.map