import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/login', authController.login);
router.post('/setup', authController.setup);
router.get('/status', authController.status);
router.get('/me', requireAuth, authController.me);
router.put('/password', requireAuth, authController.changePassword);

export default router;
