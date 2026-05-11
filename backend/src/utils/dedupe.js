import crypto from 'crypto';

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '');
}

export function createArticleHash(article) {
  const seed = [
    normalizeText(article.article_url || article.link),
    normalizeText(article.title),
    normalizeText(article.source_name),
    normalizeText(article.published_at || article.pubDate)
  ].join('|');

  return crypto.createHash('sha256').update(seed).digest('hex');
}

export function uniqueByHash(items) {
  const seen = new Set();
  return items.filter((item) => {
    const hash = item.article_hash;
    if (!hash || seen.has(hash)) return false;
    seen.add(hash);
    return true;
  });
}

export function safeJson(value, fallback = null) {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }
  return value;
}