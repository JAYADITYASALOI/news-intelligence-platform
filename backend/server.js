import app from './app.js';
import env from './config/env.js';
import logger from './utils/logger.js';
import pool, { initializeDatabase, testConnection } from './config/db.js';
import { startNewsSyncJob } from './jobs/fetchNewsJob.js';
import { syncNews } from './services/syncService.js';

async function bootstrap() {
  try {
    await initializeDatabase();
    await testConnection();

    const server = app.listen(env.PORT, () => {
      logger.info(`Backend running on port ${env.PORT}`);
    });

    startNewsSyncJob();

    if (env.AUTO_SYNC_ON_STARTUP) {
      syncNews({
        q: env.NEWSDATA_DEFAULT_QUERY,
        country: env.NEWSDATA_DEFAULT_COUNTRY,
        category: env.NEWSDATA_DEFAULT_CATEGORY,
        language: env.NEWSDATA_DEFAULT_LANGUAGE,
        maxArticles: env.NEWSDATA_MAX_ARTICLES
      }).catch((error) => logger.error('Startup sync failed', error.message));
    }

    const shutdown = async () => {
      logger.info('Shutting down server...');
      server.close(async () => {
        try {
          await pool.end();
        } finally {
          process.exit(0);
        }
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Failed to bootstrap backend', error);
    process.exit(1);
  }
}

bootstrap();
