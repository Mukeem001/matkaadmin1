import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

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
export type InsertApkFile = z.infer<typeof insertApkFileSchema>;
export type ApkFile = typeof apkFilesTable.$inferSelect;
