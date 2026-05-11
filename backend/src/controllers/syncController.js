import { syncRequestSchema } from '../utils/validators.js';
import { syncNews } from '../services/syncService.js';
import { getLatestSyncRun } from '../services/articleService.js';

export async function syncNow(req, res, next) {
  try {
    const payload = syncRequestSchema.parse(req.body || {});
    const result = await syncNews(payload);
    res.status(201).json({
      success: true,
      message: 'Sync completed',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

export async function latestSync(req, res, next) {
  try {
    const latest = await getLatestSyncRun();
    res.json({
      success: true,
      data: latest
    });
  } catch (error) {
    next(error);
  }
}