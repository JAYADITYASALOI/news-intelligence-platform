import { Router } from 'express';
import { latestSync, syncNow } from '../controllers/syncController.js';

const router = Router();

router.get('/latest', latestSync);
router.post('/', syncNow);

export default router;
