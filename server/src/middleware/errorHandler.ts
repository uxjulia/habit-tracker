import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err);

  if (res.headersSent) return;

  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({
    data: null,
    error: { code: 'INTERNAL_ERROR', message },
  });
}
