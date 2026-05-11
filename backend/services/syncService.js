import { createArticleHash } from '../utils/dedupe.js';
import { syncRequestSchema } from '../utils/validators.js';
import { fetchManyNews } from './newsService.js';
import { enrichArticle } from './aiService.js';
import {
  createSyncRun,
  updateSyncRun,
  upsertArticle,
  getArticleByHash
} from './articleService.js';
import logger from '../utils/logger.js';

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function normalizeArticle(raw) {
  const article = {
    title: raw.title || 'Untitled article',
    description: raw.description || '',
    content: raw.content || '',
    article_url: raw.article_url || '',
    image_url: raw.image_url || null,
    source_id: raw.source_id || null,
    source_name: raw.source_name || 'Unknown Source',
    source_url: raw.source_url || null,
    author: raw.author || null,
    country: raw.country || null,
    category: raw.category || null,
    language: raw.language || 'en',
    published_at: normalizeDate(raw.published_at),
    raw_json: raw.raw_json || raw
  };

  article.article_hash = createArticleHash(article);
  return article;
}

export async function syncNews(payload = {}) {
  const validated = syncRequestSchema.parse(payload);

  const syncRunId = await createSyncRun({
    status: 'running',
    query_text: validated.q || null,
    country: validated.country || null,
    category: validated.category || null,
    language: validated.language || null
  });

  let insertedCount = 0;
  let skippedCount = 0;
  let fetchedCount = 0;

  try {
    const rawArticles = await fetchManyNews({
      q: validated.q,
      country: validated.country,
      category: validated.category,
      language: validated.language,
      maxArticles: validated.maxArticles
    });

    fetchedCount = rawArticles.length;

    for (const raw of rawArticles) {
      const article = normalizeArticle(raw);
      if (!article.article_url || !article.title) {
        skippedCount += 1;
        continue;
      }

      const existing = await getArticleByHash(article.article_hash);
      const ai = await enrichArticle(article);

      article.ai_summary = ai.summary;
      article.ai_sentiment = ai.sentiment;
      article.ai_insights = ai.insights;
      article.ai_keywords = ai.keywords;
      article.sync_run_id = syncRunId;

      await upsertArticle(article);

      if (existing) {
        skippedCount += 1;
      } else {
        insertedCount += 1;
      }
    }

    const status = insertedCount > 0 ? 'success' : 'partial';
    await updateSyncRun(syncRunId, {
      status,
      fetched_count: fetchedCount,
      inserted_count: insertedCount,
      skipped_count: skippedCount,
      completed_at: new Date()
    });

    return {
      syncRunId,
      fetchedCount,
      insertedCount,
      skippedCount,
      status
    };
  } catch (error) {
    logger.error('Sync failed', error);
    await updateSyncRun(syncRunId, {
      status: 'failed',
      fetched_count: fetchedCount,
      inserted_count: insertedCount,
      skipped_count: skippedCount,
      error_message: error.message,
      completed_at: new Date()
    });
    throw error;
  }
}
