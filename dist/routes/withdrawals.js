import { Router } from "express";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db, withdrawalsTable, usersTable } from "@workspace/db";
import { ApproveWithdrawalParams, RejectWithdrawalParams } from "@workspace/api-zod";
import { authMiddleware } from "../middlewares/auth.js";
const router = Router();
const formatWithdrawal = (w, userName) => ({
    id: w.id,
    userId: w.userId,
    userName,
    amount: parseFloat(w.amount),
    status: w.status,
    bankName: w.bankName,
    accountNumber: w.accountNumber,
    ifscCode: w.ifscCode,
    upiId: w.upiId,
    createdAt: w.createdAt.toISOString(),
    processedAt: w.processedAt?.toISOString() ?? null,
});
router.get("/withdrawals", authMiddleware, async (_req, res) => {
    const withdrawals = await db
        .select({
        id: withdrawalsTable.id,
        userId: withdrawalsTable.userId,
        userName: usersTable.name,
        amount: withdrawalsTable.amount,
        status: withdrawalsTable.status,
        bankName: withdrawalsTable.bankName,
        accountNumber: withdrawalsTable.accountNumber,
        ifscCode: withdrawalsTable.ifscCode,
        upiId: withdrawalsTable.upiId,
        createdAt: withdrawalsTable.createdAt,
        processedAt: withdrawalsTable.processedAt,
    })
        .from(withdrawalsTable)
        .leftJoin(usersTable, eq(withdrawalsTable.userId, usersTable.id));
    res.json(withdrawals.map(w => ({
        ...w,
        userName: w.userName ?? "Unknown",
        amount: parseFloat(w.amount),
        createdAt: w.createdAt.toISOString(),
        processedAt: w.processedAt?.toISOString() ?? null,
    })));
});
router.post("/withdrawals/:id/approve", authMiddleware, async (req, res) => {
    const params = ApproveWithdrawalParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }
    const withdrawalId = params.data.id;
    // Get withdrawal details first
    const [withdrawal] = await db.select().from(withdrawalsTable).where(eq(withdrawalsTable.id, withdrawalId));
    if (!withdrawal || withdrawal.status !== "pending") {
        res.status(404).json({ error: "Withdrawal not found or already processed" });
        return;
    }
    await db.transaction(async (tx) => {
        // Update withdrawal status
        const [updatedWithdrawal] = await tx.update(withdrawalsTable)
            .set({ status: "approved", processedAt: new Date() })
            .where(eq(withdrawalsTable.id, withdrawalId))
            .returning();
        // Deduct balance from user wallet
        await tx.update(usersTable)
            .set({ walletBalance: sql `${usersTable.walletBalance} - ${withdrawal.amount}` })
            .where(eq(usersTable.id, withdrawal.userId));
        const [user] = await tx.select().from(usersTable).where(eq(usersTable.id, withdrawal.userId));
        res.json(formatWithdrawal(updatedWithdrawal, user?.name ?? "Unknown"));
    });
});
router.post("/withdrawals/:id/reject", authMiddleware, async (req, res) => {
    const params = RejectWithdrawalParams.safeParse(req.params);
    if (!params.success) {
        res.status(400).json({ error: "Invalid ID" });
        return;
    }
    const [withdrawal] = await db.update(withdrawalsTable)
        .set({ status: "rejected", processedAt: new Date() })
        .where(eq(withdrawalsTable.id, params.data.id))
        .returning();
    if (!withdrawal) {
        res.status(404).json({ error: "Withdrawal not found" });
        return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, withdrawal.userId));
    res.json(formatWithdrawal(withdrawal, user?.name ?? "Unknown"));
});
export default router;
//# sourceMappingURL=withdrawals.js.map