import axios from 'axios';
import env from '../config/env.js';
import logger from '../utils/logger.js';

const http = axios.create({
  timeout: 2147483646
});

function cleanValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value ?? null;
}

function normalizeNewsDataArticle(article) {
  return {
    title: article.title || article.headline || 'Untitled article',
    description: article.description || article.summary || article.content || '',
    content: article.content || article.description || '',
    article_url: article.link || article.url || article.article_url || '',
    image_url: article.image_url || article.image || article.imageUrl || null,
    source_id: cleanValue(article.source_id),
    source_name: article.source_name || article.source || article.sourceName || 'Unknown Source',
    source_url: article.source_url || article.source?.url || null,
    author: cleanValue(article.creator || article.author),
    country: cleanValue(article.country),
    category: cleanValue(article.category),
    language: article.language || null,
    published_at: article.pubDate || article.pub_date || article.publishedAt || null,
    raw_json: article
  };
}

export async function fetchNewsPage(params = {}) {
  if (!env.NEWSDATA_API_KEY) {
    throw new Error('Missing NEWSDATA_API_KEY in backend .env');
  }

  const queryParams = {
    apikey: env.NEWSDATA_API_KEY,
    q: params.q || env.NEWSDATA_DEFAULT_QUERY || 'technology',
    country: params.country || env.NEWSDATA_DEFAULT_COUNTRY || undefined,
    category: params.category || env.NEWSDATA_DEFAULT_CATEGORY || undefined,
    language: params.language || env.NEWSDATA_DEFAULT_LANGUAGE || 'en',
    page: params.page || undefined
  };

  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] === undefined || queryParams[key] === '') {
      delete queryParams[key];
    }
  });

  const response = await http.get(`${env.NEWSDATA_BASE_URL.replace(/\/$/, '')}`, {
    params: queryParams
  });

  const payload = response.data || {};
  const results = Array.isArray(payload.results) ? payload.results : [];
  const nextPage = payload.nextPage || null;

  logger.info('Fetched NewsData.io page', {
    fetched: results.length,
    nextPage: Boolean(nextPage)
  });

  return {
    results: results.map(normalizeNewsDataArticle),
    nextPage,
    raw: payload
  };
}

export async function fetchManyNews({ q, country, category, language, maxPages = env.NEWSDATA_MAX_PAGES, maxArticles = env.NEWSDATA_MAX_ARTICLES } = {}) {
  const collected = [];
  let pageToken = null;

  for (let page = 0; page < maxPages && collected.length < maxArticles; page += 1) {
    const pageResult = await fetchNewsPage({
      q,
      country,
      category,
      language,
      page: pageToken
    });

    collected.push(...pageResult.results);

    if (!pageResult.nextPage) {
      break;
    }

    pageToken = pageResult.nextPage;
  }

  return collected.slice(0, maxArticles);
}