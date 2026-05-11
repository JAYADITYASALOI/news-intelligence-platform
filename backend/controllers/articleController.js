import { articleQuerySchema } from '../utils/validators.js';
import { getArticleById, getArticles } from '../services/articleService.js';

export async function listArticles(req, res, next) {
  try {
    const filters = articleQuerySchema.parse(req.query);
    const result = await getArticles(filters);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

export async function readArticle(req, res, next) {
  try {
    const id = Number(req.params.id);
    const article = await getArticleById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
}