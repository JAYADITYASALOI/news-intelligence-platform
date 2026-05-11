import pool, { query, execute } from '../config/db.js';
import { safeJson } from '../utils/dedupe.js';

function toJson(value) {
  if (value == null) return null;
  return JSON.stringify(value);
}

export function mapArticleRow(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    article_hash: row.article_hash,
    title: row.title,
    description: row.description,
    content: row.content,
    article_url: row.article_url,
    image_url: row.image_url,
    source_id: row.source_id,
    source_name: row.source_name,
    source_url: row.source_url,
    author: row.author,
    country: row.country,
    category: row.category,
    language: row.language,
    published_at: row.published_at,
    ai_summary: row.ai_summary,
    ai_sentiment: row.ai_sentiment || 'neutral',
    ai_insights: safeJson(row.ai_insights, []),
    ai_keywords: safeJson(row.ai_keywords, []),
    raw_json: safeJson(row.raw_json, {}),
    sync_run_id: row.sync_run_id,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
}

export async function getArticles(filters = {}) {
  const {
    q = '',
    sentiment = 'all',
    category = '',
    source = '',
    page = 1,
    limit = 12,
    sortBy = 'published_at',
    sortDir = 'desc',
    from = '',
    to = ''
  } = filters;

  const where = [];
  const params = [];

  if (q) {
    where.push('(title LIKE ? OR description LIKE ? OR content LIKE ? OR source_name LIKE ? OR category LIKE ? OR ai_summary LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like, like, like, like);
  }

  if (sentiment && sentiment !== 'all') {
    where.push('ai_sentiment = ?');
    params.push(sentiment);
  }

  if (category) {
    where.push('category LIKE ?');
    params.push(`%${category}%`);
  }

  if (source) {
    where.push('source_name LIKE ?');
    params.push(`%${source}%`);
  }

  if (from) {
    where.push('DATE(published_at) >= DATE(?)');
    params.push(from);
  }

  if (to) {
    where.push('DATE(published_at) <= DATE(?)');
    params.push(to);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const allowedSort = new Set(['published_at', 'created_at', 'title']);
  const safeSortBy = allowedSort.has(sortBy) ? sortBy : 'published_at';
  const safeSortDir = String(sortDir).toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const offset = (Number(page) - 1) * Number(limit);

  const countSql = `SELECT COUNT(*) AS total FROM articles ${whereClause}`;
  const countRows = await query(countSql, params);
  const total = Number(countRows?.[0]?.total || 0);

  const dataSql = `
    SELECT *
    FROM articles
    ${whereClause}
    ORDER BY ${safeSortBy} ${safeSortDir}, id DESC
    LIMIT ? OFFSET ?
  `;
  const rows = await query(dataSql, [...params, Number(limit), offset]);

  return {
    data: rows.map(mapArticleRow),
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.max(1, Math.ceil(total / Number(limit)))
    }
  };
}

export async function getArticleById(id) {
  const rows = await query('SELECT * FROM articles WHERE id = ?', [id]);
  return mapArticleRow(rows[0]);
}

export async function getArticleByHash(articleHash) {
  const rows = await query('SELECT * FROM articles WHERE article_hash = ? LIMIT 1', [articleHash]);
  return mapArticleRow(rows[0]);
}

export async function upsertArticle(article) {
  const sql = `
    INSERT INTO articles (
      article_hash, title, description, content, article_url, image_url,
      source_id, source_name, source_url, author, country, category, language,
      published_at, ai_summary, ai_sentiment, ai_insights, ai_keywords, raw_json, sync_run_id
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      description = VALUES(description),
      content = VALUES(content),
      article_url = VALUES(article_url),
      image_url = VALUES(image_url),
      source_id = VALUES(source_id),
      source_name = VALUES(source_name),
      source_url = VALUES(source_url),
      author = VALUES(author),
      country = VALUES(country),
      category = VALUES(category),
      language = VALUES(language),
      published_at = VALUES(published_at),
      ai_summary = VALUES(ai_summary),
      ai_sentiment = VALUES(ai_sentiment),
      ai_insights = VALUES(ai_insights),
      ai_keywords = VALUES(ai_keywords),
      raw_json = VALUES(raw_json),
      sync_run_id = VALUES(sync_run_id)
  `;

  const result = await execute(sql, [
    article.article_hash,
    article.title,
    article.description,
    article.content,
    article.article_url,
    article.image_url,
    article.source_id,
    article.source_name,
    article.source_url,
    article.author,
    article.country,
    article.category,
    article.language,
    article.published_at,
    article.ai_summary,
    article.ai_sentiment,
    toJson(article.ai_insights),
    toJson(article.ai_keywords),
    toJson(article.raw_json),
    article.sync_run_id || null
  ]);

  return result;
}

export async function createSyncRun(payload = {}) {
  const result = await execute(
    `INSERT INTO sync_runs (status, source, query_text, country, category, language, fetched_count, inserted_count, skipped_count, error_message)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.status || 'running',
      payload.source || 'newsdata.io',
      payload.query_text || null,
      payload.country || null,
      payload.category || null,
      payload.language || null,
      payload.fetched_count || 0,
      payload.inserted_count || 0,
      payload.skipped_count || 0,
      payload.error_message || null
    ]
  );

  return result.insertId;
}

export async function updateSyncRun(id, payload = {}) {
  const fields = [];
  const params = [];

  for (const [key, value] of Object.entries(payload)) {
    fields.push(`${key} = ?`);
    params.push(value);
  }

  if (!fields.length) return;
  params.push(id);

  await execute(`UPDATE sync_runs SET ${fields.join(', ')} WHERE id = ?`, params);
}

export async function getLatestSyncRun() {
  const rows = await query('SELECT * FROM sync_runs ORDER BY id DESC LIMIT 1');
  return rows[0] || null;
}

export async function getOverviewStats() {
  const totalRows = await query('SELECT COUNT(*) AS total FROM articles');
  const sentimentRows = await query(`
    SELECT ai_sentiment, COUNT(*) AS total
    FROM articles
    GROUP BY ai_sentiment
  `);
  const categoryRows = await query(`
    SELECT COALESCE(NULLIF(TRIM(category), ''), 'uncategorized') AS label, COUNT(*) AS total
    FROM articles
    GROUP BY label
    ORDER BY total DESC, label ASC
    LIMIT 8
  `);
  const sourceRows = await query(`
    SELECT COALESCE(NULLIF(TRIM(source_name), ''), 'Unknown Source') AS label, COUNT(*) AS total
    FROM articles
    GROUP BY label
    ORDER BY total DESC, label ASC
    LIMIT 8
  `);
  const latestRows = await query(`
    SELECT id, status, source, fetched_count, inserted_count, skipped_count, started_at, completed_at
    FROM sync_runs
    ORDER BY id DESC
    LIMIT 1
  `);

  const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };
  for (const row of sentimentRows) {
    sentimentCounts[row.ai_sentiment] = Number(row.total);
  }

  return {
    totalArticles: Number(totalRows?.[0]?.total || 0),
    sentimentCounts,
    topCategories: categoryRows.map((row) => ({ label: row.label, total: Number(row.total) })),
    topSources: sourceRows.map((row) => ({ label: row.label, total: Number(row.total) })),
    latestSync: latestRows[0] || null
  };
}