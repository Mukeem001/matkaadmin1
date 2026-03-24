import { Router } from "express";
import { eq, ilike, or, count } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { GetUsersQueryParams, GetUserByIdParams, UpdateUserParams, UpdateUserBody } from "@workspace/api-zod";
import { authMiddleware } from "../middlewares/auth.js";
const router = Router();
router.get("/users", authMiddleware, async (req, res) => {
    const query = GetUsersQueryParams.safeParse(req.query);
    const page = query.success ? (query.data.page ?? 1) : 1;
    const limit = query.success ? (query.data.limit ?? 20) : 20;
    const search = query.success ? query.data.search : undefined;
    const offset = (page - 1) * limit;
    let whereClause = undefined;
    if (search) {
        whereClause = or(ilike(usersTable.name, `%${search}%`), ilike(usersTable.email, `%${search}%`), ilike(usersTable.phone, `%${search}%`));
    }
    const [totalResult] = await db.select({ count: count() }).from(usersTable);
    const users = await db.select().from(usersTable)
        .where(whereClause)
        .limit(limit)
        .offset(offset);
    res.json({
        users: users.map(u => ({
            ...u,
            walletBalance: parseFloat(u.walletBalance),
            createdAt: u.createdAt.toISOString(),
        })),
        total: totalResult?.count ?? 0,
        page,
        limit,
    });
});
router.get("/users/:id", authMiddleware, async (req, res) => {
    const params = GetUserByIdParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, params.data.id));
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json({ ...user, walletBalance: parseFloat(user.walletBalance), createdAt: user.createdAt.toISOString() });
});
router.patch("/users/:id", authMiddleware, async (req, res) => {
    const params = UpdateUserParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }
    const body = UpdateUserBody.safeParse(req.body);
    if (!body.success) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }
    const updateData = {};
    if (body.data.isBlocked !== undefined)
        updateData.isBlocked = body.data.isBlocked;
    if (body.data.walletBalance !== undefined)
        updateData.walletBalance = String(body.data.walletBalance);
    if (body.data.name !== undefined)
        updateData.name = body.data.name;
    if (body.data.phone !== undefined)
        updateData.phone = body.data.phone;
    const [user] = await db.update(usersTable).set(updateData).where(eq(usersTable.id, params.data.id)).returning();
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    res.json({ ...user, walletBalance: parseFloat(user.walletBalance), createdAt: user.createdAt.toISOString() });
});
export default router;
//# sourceMappingURL=users.js.map