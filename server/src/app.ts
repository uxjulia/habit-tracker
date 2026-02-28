import express from 'express';
import cors from 'cors';
import path from 'path';
import { setupGuard } from './middleware/setupGuard';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes';
import { env } from './config/env';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: env.NODE_ENV === 'development' ? 'http://localhost:5173' : false }));

  // Setup guard: check if initial user exists
  app.use(setupGuard);

  // API routes
  app.use('/api', apiRouter);

  // In production, serve the Vite-built client
  if (env.NODE_ENV === 'production') {
    const clientDist = path.join(__dirname, '../../client/dist');
    app.use(express.static(clientDist));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  app.use(errorHandler);

  return app;
}
