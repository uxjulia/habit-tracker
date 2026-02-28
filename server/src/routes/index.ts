import { Router } from 'express';
import authRoutes from './auth.routes';
import habitsRoutes from './habits.routes';
import entriesRoutes from './entries.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ data: { status: 'ok' }, error: null });
});

router.use('/auth', authRoutes);
router.use('/habits', habitsRoutes);
router.use('/entries', entriesRoutes);

export default router;
