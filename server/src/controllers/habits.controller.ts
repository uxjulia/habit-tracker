import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as habitsService from "../services/habits.service";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex color like #6366f1"),
  emoji: z.string().max(10).optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  emoji: z.string().max(10).nullable().optional(),
  archived: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const reorderSchema = z.object({
  ids: z.array(z.string()).min(1),
});

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const includeArchived = req.query.includeArchived === "true";
    const habits = await habitsService.listHabits(includeArchived);
    res.json({ data: habits, error: null });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const habit = await habitsService.createHabit(data);
    res.status(201).json({ data: habit, error: null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: err.message } });
      return;
    }
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const habit = await habitsService.updateHabit(req.params.id, data);
    res.json({ data: habit, error: null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: err.message } });
      return;
    }
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await habitsService.deleteHabit(req.params.id);
    res.json({ data: { success: true }, error: null });
  } catch (err) {
    next(err);
  }
}

export async function reorder(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids } = reorderSchema.parse(req.body);
    await habitsService.reorderHabits(ids);
    res.json({ data: { success: true }, error: null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", message: err.message } });
      return;
    }
    next(err);
  }
}
