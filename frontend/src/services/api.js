import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  timeout: 30000
});

export async function fetchArticles(params = {}) {
  const response = await api.get('/api/articles', { params });
  return response.data;
}

export async function fetchArticleById(id) {
  const response = await api.get(`/api/articles/${id}`);
  return response.data;
}

export async function fetchOverviewStats() {
  const response = await api.get('/api/stats/overview');
  return response.data;
}

export async function triggerSync(payload = {}) {
  const response = await api.post('/api/sync', payload);
  return response.data;
}

export async function fetchLatestSync() {
  const response = await api.get('/api/sync/latest');
  return response.data;
}

export default api;