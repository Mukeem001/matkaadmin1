import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    adminId?: number;
    userId?: number;
}
export declare function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void;
export declare function userAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction): void;
export declare function signToken(adminId: number): string;
export declare function signUserToken(userId: number): string;
//# sourceMappingURL=auth.d.ts.map