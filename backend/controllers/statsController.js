import { getOverviewStats } from '../services/articleService.js';

export async function overviewStats(req, res, next) {
  try {
    const data = await getOverviewStats();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
} 