import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

/**
 * protect — Custom middleware replacing deprecated requireAuth.
 * Rejects unauthenticated requests with 401 before the route handler runs.
 */
export const protect = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ success: false, message: "Unauthorized: No active session" });
    return;
  }
  next();
};
