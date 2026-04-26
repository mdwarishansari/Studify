import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { User } from "../models/User.js";

// Extends Express Request to carry the Mongo user
declare global {
  namespace Express {
    interface Request {
      mongoUser?: InstanceType<typeof User>;
    }
  }
}

/**
 * attachUser — runs AFTER requireAuth.
 * Looks up the MongoDB User document by clerkId and attaches it to req.mongoUser.
 */
export const attachUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found in database. Please sync your account first.",
      });
      return;
    }

    req.mongoUser = user;
    next();
  } catch (error) {
    next(error);
  }
};
