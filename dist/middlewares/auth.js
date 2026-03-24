import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "matka-admin-secret-key-2024";
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.adminId;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
}
export function userAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid token" });
    }
}
export function signToken(adminId) {
    return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: "7d" });
}
export function signUserToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
//# sourceMappingURL=auth.js.map