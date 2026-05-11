import OpenAI from 'openai';
import env from '../config/env.js';

const client = env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY })
  : null;

const positiveWords = new Set(['gain', 'growth', 'strong', 'profit', 'win', 'improve', 'positive', 'record', 'boost', 'rise', 'surge', 'success']);
const negativeWords = new Set(['loss', 'decline', 'drop', 'fall', 'weak', 'negative', 'crisis', 'concern', 'risk', 'down', 'warn', 'slump']);

function extractBaseText(article) {
  return [
    article.title,
    article.description,
    article.content
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

function heuristicSentiment(text) {
  const words = text.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  let score = 0;
  for (const word of words) {
    if (positiveWords.has(word)) score += 1;
    if (negativeWords.has(word)) score -= 1;
  }
  if (score > 1) return 'positive';
  if (score < -1) return 'negative';
  return 'neutral';
}

function heuristicSummary(article) {
  const base = (article.description || article.content || article.title || '').replace(/\s+/g, ' ').trim();
  if (!base) return 'No summary available.';
  const sentences = base.split(/(?<=[.!?])\s+/).filter(Boolean);
  return sentences.slice(0, 2).join(' ').slice(0, 320);
}

function heuristicInsights(article) {
  const title = article.title || 'This article';
  const description = article.description || article.content || '';
  const text = extractBaseText(article);
  const insights = [
    `The story centers on ${title.toLowerCase()}.`,
    description ? 'The article provides context that may matter to readers tracking this topic.' : 'The article is short, so the headline carries most of the meaning.',
    `This item appears to fit the broader trend around ${article.category || 'current news'}.`
  ];
  if (text.length > 220) {
    insights.push('There is enough detail to support a stronger editorial or business takeaway.');
  }
  return insights.slice(0, 5);
}

async function openAISummary(article) {
  const fallbackText = extractBaseText(article);

  if (!client) {
    return {
      summary: heuristicSummary(article),
      sentiment: heuristicSentiment(fallbackText),
      insights: heuristicInsights(article),
      keywords: Array.from(new Set((fallbackText.toLowerCase().match(/[a-z]{4,}/g) || []).slice(0, 8)))
    };
  }

  const prompt = {
    title: article.title || '',
    description: article.description || '',
    content: article.content || '',
    source_name: article.source_name || '',
    category: article.category || '',
    language: article.language || 'en'
  };

  try {
    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are a news analyst. Return only valid JSON with keys summary, sentiment, insights, and keywords. Sentiment must be one of positive, negative, or neutral. Summary must be one or two sentences. Insights must be an array of 3 to 5 concise bullets. Keywords must be an array of short strings.'
        },
        {
          role: 'user',
          content: JSON.stringify(prompt)
        }
      ],
      response_format: { type: 'json_object' }
    });

    const raw = completion?.choices?.[0]?.message?.content || '{}';
    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }

    return {
      summary: typeof parsed.summary === 'string' && parsed.summary.trim() ? parsed.summary.trim() : heuristicSummary(article),
      sentiment: ['positive', 'negative', 'neutral'].includes(parsed.sentiment) ? parsed.sentiment : heuristicSentiment(fallbackText),
      insights: Array.isArray(parsed.insights) && parsed.insights.length
        ? parsed.insights.slice(0, 5).map((item) => String(item).trim()).filter(Boolean)
        : heuristicInsights(article),
      keywords: Array.isArray(parsed.keywords) && parsed.keywords.length
        ? parsed.keywords.slice(0, 10).map((item) => String(item).trim()).filter(Boolean)
        : Array.from(new Set((fallbackText.toLowerCase().match(/[a-z]{4,}/g) || []).slice(0, 8)))
    };
  } catch {
    return {
      summary: heuristicSummary(article),
      sentiment: heuristicSentiment(fallbackText),
      insights: heuristicInsights(article),
      keywords: Array.from(new Set((fallbackText.toLowerCase().match(/[a-z]{4,}/g) || []).slice(0, 8)))
    };
  }
}

export async function enrichArticle(article) {
  return openAISummary(article);
}