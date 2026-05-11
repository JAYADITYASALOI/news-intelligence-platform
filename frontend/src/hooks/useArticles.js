import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchArticles, fetchOverviewStats, triggerSync } from '../services/api.js';

const defaultFilters = {
  q: '',
  sentiment: 'all',
  category: '',
  source: '',
  from: '',
  to: '',
  sortBy: 'published_at',
  sortDir: 'desc'
};

export default function useArticles() {
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [articlesState, setArticlesState] = useState({
    loading: true,
    error: '',
    data: [],
    meta: {
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1
    }
  });
  const [stats, setStats] = useState({
    loading: true,
    error: '',
    data: null
  });
  const [syncState, setSyncState] = useState({
    loading: false,
    error: '',
    success: ''
  });

  const queryParams = useMemo(() => ({
    ...filters,
    page,
    limit: 12
  }), [filters, page]);

  const loadArticles = useCallback(async () => {
    setArticlesState((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const result = await fetchArticles(queryParams);
      setArticlesState({
        loading: false,
        error: '',
        data: result.data || [],
        meta: result.meta || {
          total: 0,
          page,
          limit: 12,
          totalPages: 1
        }
      });
    } catch (error) {
      setArticlesState((prev) => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.message || error.message || 'Failed to load articles'
      }));
    }
  }, [queryParams, page]);

  const loadStats = useCallback(async () => {
    setStats((prev) => ({ ...prev, loading: true, error: '' }));
    try {
      const result = await fetchOverviewStats();
      setStats({
        loading: false,
        error: '',
        data: result.data || null
      });
    } catch (error) {
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: error?.response?.data?.message || error.message || 'Failed to load stats'
      }));
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadArticles(), loadStats()]);
  }, [loadArticles, loadStats]);

  const syncNow = useCallback(async () => {
    setSyncState({ loading: true, error: '', success: '' });
    try {
      const result = await triggerSync({
        q: filters.q || undefined,
        country: undefined,
        category: filters.category || undefined,
        language: 'en',
        maxArticles: 100
      });
      setSyncState({
        loading: false,
        error: '',
        success: result?.message || 'Sync completed'
      });
      await refreshAll();
      return result;
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Sync failed';
      setSyncState({ loading: false, error: message, success: '' });
      throw error;
    }
  }, [filters, refreshAll]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const updateFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setPage(1);
    setFilters(defaultFilters);
  };

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    page,
    setPage,
    articlesState,
    stats,
    syncState,
    refreshAll,
    syncNow
  };
}
