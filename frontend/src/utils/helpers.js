export function truncate(text, length = 140) {
  if (!text) return '';
  const clean = String(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).trim()}...`;
}

export function ensureArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}