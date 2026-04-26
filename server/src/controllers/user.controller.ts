import { Request, Response } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { User } from "../models/User.js";

/**
 * POST /api/users/sync
 * Called by the frontend right after login.
 * Creates a MongoDB user record if one does not already exist.
 */
export const syncUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    // Return existing user immediately — no duplicate creation
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
      res.status(200).json({
        success: true,
        message: "User already synced",
        data: existingUser,
      });
      return;
    }

    // Fetch full profile from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);

    const primaryEmailObj = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    );

    const newUser = await User.create({
      clerkId: userId,
      name:
        `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
        "User",
      email: primaryEmailObj?.emailAddress ?? "",
      image: clerkUser.imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "User synced successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("[syncUser]", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * GET /api/users/me
 * Returns the currently authenticated user's MongoDB profile.
 * Requires: protect + attachUser middleware.
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: req.mongoUser,
  });
};
