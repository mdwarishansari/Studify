import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

// Custom middleware to replace deprecated requireAuth
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  next();
};
