import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service";
import { prisma } from "../lib/prisma";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const setupSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const result = await authService.login(username, password);
    res.json({ data: result, error: null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: err.message } });
      return;
    }
    if (err instanceof Error && err.message === "Invalid credentials") {
      res.status(401).json({ data: null, error: { code: "INVALID_CREDENTIALS", message: err.message } });
      return;
    }
    next(err);
  }
}

export async function setup(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = setupSchema.parse(req.body);
    const result = await authService.setup(username, password);
    res.status(201).json({ data: result, error: null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: err.message } });
      return;
    }
    if (err instanceof Error && err.message === "Setup already complete") {
      res.status(403).json({ data: null, error: { code: "SETUP_COMPLETE", message: err.message } });
      return;
    }
    next(err);
  }
}

export async function status(_req: Request, res: Response, next: NextFunction) {
  try {
    const count = await prisma.user.count();
    res.json({ data: { setupRequired: count === 0 }, error: null });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response) {
  res.json({ data: { username: req.user!.username }, error: null });
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    await authService.changePassword(req.user!.userId, currentPassword, newPassword);
    res.json({ data: { success: true }, error: null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: err.message } });
      return;
    }
    if (err instanceof Error && err.message === "Current password is incorrect") {
      res.status(400).json({ data: null, error: { code: "WRONG_PASSWORD", message: err.message } });
      return;
    }
    next(err);
  }
}
