import { Router } from "express";
import { syncUser, getMe } from "../controllers/user.controller.js";
import { protect } from "../middleware/requireAuth.middleware.js";
import { attachUser } from "../middleware/attachUser.middleware.js";

const router = Router();

// POST /api/users/sync — call this after every login to ensure DB record exists
router.post("/sync", protect, syncUser);

// GET /api/users/me — fetch the logged-in user's MongoDB profile
router.get("/me", protect, attachUser, getMe);

export default router;
