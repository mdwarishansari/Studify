import { Request, Response } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { User } from "../models/User.js";

export const syncUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Check if user already exists in MongoDB
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // Fetch full user details from Clerk
      const clerkUser = await clerkClient.users.getUser(userId);

      // Extract primary email
      const primaryEmailObj = clerkUser.emailAddresses.find(
        (email) => email.id === clerkUser.primaryEmailAddressId
      );

      // Create new user in DB
      user = await User.create({
        clerkId: userId,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
        email: primaryEmailObj?.emailAddress || "",
        image: clerkUser.imageUrl,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User synced successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
