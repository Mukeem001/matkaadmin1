import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, noticesTable } from "@workspace/db";
import { CreateNoticeBody, DeleteNoticeParams } from "@workspace/api-zod";
import { authMiddleware } from "../middlewares/auth.js";
const router = Router();
router.get("/notices", authMiddleware, async (_req, res) => {
    const notices = await db.select().from(noticesTable);
    res.json(notices.map(n => ({ ...n, createdAt: n.createdAt.toISOString() })));
});
router.post("/notices", authMiddleware, async (req, res) => {
    const body = CreateNoticeBody.safeParse(req.body);
    if (!body.success) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }
    const [notice] = await db.insert(noticesTable).values(body.data).returning();
    res.status(201).json({ ...notice, createdAt: notice.createdAt.toISOString() });
});
router.delete("/notices/:id", authMiddleware, async (req, res) => {
    const params = DeleteNoticeParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }
    const [deleted] = await db.delete(noticesTable).where(eq(noticesTable.id, params.data.id)).returning();
    if (!deleted) {
        res.status(404).json({ error: "Notice not found" });
        return;
    }
    res.json({ success: true, message: "Notice deleted" });
});
export default router;
//# sourceMappingURL=notices.js.map