import { requireAuth } from "@clerk/express";

// Export the clerk requireAuth middleware to keep standard structure
export const authMiddleware = requireAuth();
