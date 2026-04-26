import { requireAuth } from "@clerk/express";

/**
 * requireAuth — Clerk's built-in middleware.
 * Rejects unauthenticated requests with 401 before the route handler runs.
 */
export const protect = requireAuth();
