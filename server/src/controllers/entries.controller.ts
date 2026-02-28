import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as entriesService from '../services/entries.service';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');
const isoTime = z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM').optional();

const createSchema = z.object({
  habitId: z.string().min(1),
  date: isoDate,
  time: isoTime,
  notes: z.string().max(1000).optional(),
});

const updateSchema = z.object({
  time: isoTime.nullable(),
  notes: z.string().max(1000).nullable().optional(),
});

const querySchema = z.object({
  startDate: isoDate,
  endDate: isoDate,
  habitId: z.string().optional(),
});

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { startDate, endDate, habitId } = querySchema.parse(req.query);
    const entries = await entriesService.getEntries(startDate, endDate, habitId);
    res.json({ data: entries, error: null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: { code: 'VALIDATION_ERROR', message: err.message } });
      return;
    }
    next(err);
  }
}

export async function today(req: Request, res: Response, next: NextFunction) {
  try {
    const entries = await entriesService.getTodayEntries();
    res.json({ data: entries, error: null });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse(req.body);
    const entry = await entriesService.createEntry(data);
    res.status(201).json({ data: entry, error: null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: { code: 'VALIDATION_ERROR', message: err.message } });
      return;
    }
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const entry = await entriesService.updateEntry(req.params.id, data);
    res.json({ data: entry, error: null });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ data: null, error: { code: 'VALIDATION_ERROR', message: err.message } });
      return;
    }
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await entriesService.deleteEntry(req.params.id);
    res.json({ data: { success: true }, error: null });
  } catch (err) {
    next(err);
  }
}
