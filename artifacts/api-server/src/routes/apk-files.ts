import { Router, type IRouter } from "express";
import { db, apkFilesTable } from "@workspace/db";
import { authMiddleware } from "../middlewares/auth.js";
import { eq } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const downloadDir = path.join(process.cwd(), "downloads");

// Ensure downloads directory exists
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, downloadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/vnd.android.package-archive" || file.originalname.endsWith(".apk")) {
      cb(null, true);
    } else {
      cb(new Error("Only APK files are allowed"));
    }
  },
});

const router: IRouter = Router();

// GET all APK files
router.get("/apk-files", authMiddleware, async (_req, res): Promise<void> => {
  try {
    const files = await db.select().from(apkFilesTable).orderBy(apkFilesTable.createdAt);
    res.json(files || []);
  } catch (error) {
    console.error("Error fetching APK files:", error);
    res.status(500).json({ error: "Failed to fetch APK files" });
  }
});

// POST upload APK file
router.post("/apk-files", authMiddleware, upload.single("file"), async (req, res): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const { versionCode, versionName } = req.body;
    const filename = typeof req.file.filename === 'string' ? req.file.filename : req.file.filename[0];
    const size = typeof req.file.size === 'number' ? req.file.size : parseInt(req.file.size as unknown as string) || 0;

    const result = await db
      .insert(apkFilesTable)
      .values({
        filename: req.file.originalname,
        filepath: `/downloads/${filename}`,
        filesize: size.toString(),
        versionCode: versionCode || "1",
        versionName: versionName || "1.0.0",
        isActive: "true",
      })
      .returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error("Error uploading APK file:", error);
    res.status(500).json({ error: "Failed to upload APK file", details: (error as Error).message });
  }
});

// PUT update APK file metadata
router.put("/apk-files/:id", authMiddleware, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { versionCode, versionName, isActive } = req.body;

    const result = await db
      .update(apkFilesTable)
      .set({
        versionCode,
        versionName,
        isActive,
      })
      .where(eq(apkFilesTable.id, parseInt(String(id))))
      .returning();

    const apkFile = result[0];
    if (!apkFile) {
      res.status(404).json({ error: "APK file not found" });
      return;
    }

    res.json(apkFile);
  } catch (error) {
    console.error("Error updating APK file:", error);
    res.status(500).json({ error: "Failed to update APK file" });
  }
});

// DELETE APK file
router.delete("/apk-files/:id", authMiddleware, async (req, res): Promise<void> => {
  try {
    const { id } = req.params;

    const result = await db
      .delete(apkFilesTable)
      .where(eq(apkFilesTable.id, parseInt(String(id))))
      .returning();

    const apkFile = result[0];
    if (!apkFile) {
      res.status(404).json({ error: "APK file not found" });
      return;
    }

    // Delete physical file
    const filePath = path.join(process.cwd(), apkFile.filepath);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Error deleting physical file:", err);
      }
    }

    res.json({ message: "APK file deleted successfully", apkFile });
  } catch (error) {
    console.error("Error deleting APK file:", error);
    res.status(500).json({ error: "Failed to delete APK file" });
  }
});

export default router;
