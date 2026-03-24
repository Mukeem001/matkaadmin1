import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const noticesTable = pgTable("notices", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
export const insertNoticeSchema = createInsertSchema(noticesTable).omit({ id: true, createdAt: true });
//# sourceMappingURL=notices.js.map