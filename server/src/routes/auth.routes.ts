import { Router } from "express";
import { syncUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// /api/auth/sync
router.post("/sync", authMiddleware, syncUser);

export default router;
