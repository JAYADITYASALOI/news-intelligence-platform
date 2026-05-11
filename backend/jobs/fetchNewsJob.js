import cron from 'node-cron';
import env from '../config/env.js';
import logger from '../utils/logger.js';
import { syncNews } from '../services/syncService.js';

export function startNewsSyncJob() {
  if (!env.CRON_SCHEDULE) {
    return null;
  }

  const task = cron.schedule(env.CRON_SCHEDULE, async () => {
    try {
      logger.info('Scheduled sync started');
      await syncNews({
        q: env.NEWSDATA_DEFAULT_QUERY,
        country: env.NEWSDATA_DEFAULT_COUNTRY,
        category: env.NEWSDATA_DEFAULT_CATEGORY,
        language: env.NEWSDATA_DEFAULT_LANGUAGE,
        maxArticles: env.NEWSDATA_MAX_ARTICLES
      });
      logger.info('Scheduled sync finished');
    } catch (error) {
      logger.error('Scheduled sync failed', error.message);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Kolkata'
  });

  return task;
}