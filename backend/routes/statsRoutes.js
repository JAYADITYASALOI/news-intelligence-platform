import { Router } from 'express';
import { overviewStats } from '../controllers/statsController.js';

const router = Router();

router.get('/overview', overviewStats);

export default router;