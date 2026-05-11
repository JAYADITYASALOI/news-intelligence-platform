import { z } from 'zod';

export const articleQuerySchema = z.object({
  q: z.string().trim().optional().default(''),
  sentiment: z.enum(['positive', 'negative', 'neutral', 'all']).optional().default('all'),
  category: z.string().trim().optional().default(''),
  source: z.string().trim().optional().default(''),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
  sortBy: z.enum(['published_at', 'created_at', 'title']).optional().default('published_at'),
  sortDir: z.enum(['asc', 'desc']).optional().default('desc'),
  from: z.string().trim().optional().default(''),
  to: z.string().trim().optional().default('')
});

export const syncRequestSchema = z.object({
  q: z.string().trim().optional().default(''),
  country: z.string().trim().optional().default(''),
  category: z.string().trim().optional().default(''),
  language: z.string().trim().optional().default('en'),
  maxArticles: z.coerce.number().int().min(1).max(500).optional().default(100)
});