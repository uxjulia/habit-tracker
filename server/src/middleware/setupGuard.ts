import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

let setupComplete: boolean | null = null;

export async function setupGuard(req: Request, res: Response, next: NextFunction): Promise<void> {
  // Allow setup endpoint, status check, and health check through
  if (req.path === "/api/auth/setup" || req.path === "/api/auth/status" || req.path === "/api/health") {
    next();
    return;
  }

  // Cache the result so we don't query on every request after setup
  if (setupComplete === null) {
    const count = await prisma.user.count();
    setupComplete = count > 0;
  }

  if (!setupComplete) {
    // Reset cache on each request until setup is done
    setupComplete = null;
    // For API requests return JSON; for page requests let the SPA handle redirect
    if (req.path.startsWith("/api/")) {
      res.status(403).json({
        data: null,
        error: { code: "SETUP_REQUIRED", message: "Initial setup required" },
      });
    } else {
      // SPA will handle routing to /setup
      next();
    }
    return;
  }

  next();
}

export function invalidateSetupCache(): void {
  setupComplete = null;
}
