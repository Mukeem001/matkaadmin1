import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
export const apkFilesTable = pgTable("apk_files", {
    id: serial("id").primaryKey(),
    filename: text("filename").notNull(),
    filepath: text("filepath").notNull(),
    filesize: text("filesize"),
    versionCode: text("version_code"),
    versionName: text("version_name"),
    isActive: text("is_active").default("true"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
export const insertApkFileSchema = createInsertSchema(apkFilesTable).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
//# sourceMappingURL=apk-files.js.map