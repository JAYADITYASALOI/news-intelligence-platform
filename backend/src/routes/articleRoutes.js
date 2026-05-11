import { Router } from 'express';
import { listArticles, readArticle } from '../controllers/articleController.js';

const router = Router();

router.get('/', listArticles);
router.get('/:id', readArticle);

export default router;