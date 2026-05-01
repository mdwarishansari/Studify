import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import userRoutes from "./routes/user.routes.js";

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────
// In development, allow all origins (covers Expo tunnel + Next.js).
// In production, restrict to CLIENT_URL.
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3000",
  "http://localhost:8081",
];

app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? allowedOrigins
    : true, // allow all in dev — Expo tunnel has dynamic URLs
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Clerk Auth ───────────────────────────────────────────────────
app.use(clerkMiddleware());

// ─── Health Check ────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "API is running 🟢" });
});

// ─── Routes ──────────────────────────────────────────────────────
app.use("/api/users", userRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[ERROR]", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

export default app;