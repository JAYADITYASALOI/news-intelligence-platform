import dotenv from 'dotenv';

dotenv.config();

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: toInt(process.env.PORT, 5000),

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'news_intelligence_db',
  DB_PORT: toInt(process.env.DB_PORT, 3306),

  NEWSDATA_API_KEY: process.env.NEWSDATA_API_KEY || '',
  NEWSDATA_BASE_URL: process.env.NEWSDATA_BASE_URL || 'https://newsdata.io/api/1',
  NEWSDATA_DEFAULT_QUERY: process.env.NEWSDATA_DEFAULT_QUERY || 'technology',
  NEWSDATA_DEFAULT_COUNTRY: process.env.NEWSDATA_DEFAULT_COUNTRY || '',
  NEWSDATA_DEFAULT_CATEGORY: process.env.NEWSDATA_DEFAULT_CATEGORY || '',
  NEWSDATA_DEFAULT_LANGUAGE: process.env.NEWSDATA_DEFAULT_LANGUAGE || 'en',
  NEWSDATA_MAX_PAGES: toInt(process.env.NEWSDATA_MAX_PAGES, 10),
  NEWSDATA_MAX_ARTICLES: toInt(process.env.NEWSDATA_MAX_ARTICLES, 150),

  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',

  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  CRON_SCHEDULE: process.env.CRON_SCHEDULE || '0 */6 * * *',
  AUTO_SYNC_ON_STARTUP: String(process.env.AUTO_SYNC_ON_STARTUP || 'false').toLowerCase() === 'true'
};

export default env;