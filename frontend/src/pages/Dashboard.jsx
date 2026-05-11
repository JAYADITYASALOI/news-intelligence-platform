import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import useArticles from '../hooks/useArticles.js';
import SearchBar from '../components/SearchBar.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import ArticleList from '../components/ArticleList.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Pagination from '../components/Pagination.jsx';
import SentimentBadge from '../components/SentimentBadge.jsx';

function MetricCard({ label, value, subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {subtitle ? <div className="small-quiet">{subtitle}</div> : null}
    </div>
  );
}

export default function Dashboard() {
  const {
    filters,
    updateFilter,
    resetFilters,
    page,
    setPage,
    articlesState,
    stats,
    syncState,
    syncNow
  } = useArticles();

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const articles = articlesState.data || [];
  const meta = articlesState.meta || { total: 0, page: 1, limit: 12, totalPages: 1 };
  const overview = stats.data;

  const topCategory = useMemo(() => {
    if (!overview?.topCategories?.length) return 'No categories yet';
    return overview.topCategories[0].label;
  }, [overview]);

  useEffect(() => {
    if (!overview || !chartRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Positive', 'Negative', 'Neutral'],
        datasets: [
          {
            data: [
              overview.sentimentCounts?.positive || 0,
              overview.sentimentCounts?.negative || 0,
              overview.sentimentCounts?.neutral || 0
            ],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#e5eefc'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [overview]);

  const handleSync = async () => {
    try {
      await syncNow();
    } catch {
      // handled in hook
    }
  };

  return (
    <div className="page-wrap">
      <section className="hero-card mb-4">
        <div className="row align-items-center g-4">
          <div className="col-12 col-lg-8">
            <span className="chip chip-neutral mb-3">Real data • AI insights • MySQL</span>
            <h1 className="display-6 fw-bold mb-3">AI-Powered News Intelligence Platform</h1>
            <p className="lead muted mb-4">
              Track real news, read AI summaries, inspect sentiment, and uncover important patterns from a clean professional dashboard.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-brand px-4" onClick={handleSync} disabled={syncState.loading}>
                {syncState.loading ? 'Syncing...' : 'Sync fresh news'}
              </button>
              <Link className="btn btn-outline-light px-4" to="/">
                Refresh view
              </Link>
            </div>
            {syncState.success ? <div className="mt-3 text-success">{syncState.success}</div> : null}
            {syncState.error ? <div className="mt-3 text-danger">{syncState.error}</div> : null}
          </div>
          <div className="col-12 col-lg-4">
            <div className="panel p-3">
              <div className="section-title">Snapshot</div>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between"><span className="muted">Top category</span><strong>{topCategory}</strong></div>
                <div className="d-flex justify-content-between"><span className="muted">Current page</span><strong>{meta.page}</strong></div>
                <div className="d-flex justify-content-between"><span className="muted">Total articles</span><strong>{meta.total}</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard label="Total articles" value={overview?.totalArticles ?? '—'} subtitle="From database" />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard label="Positive" value={overview?.sentimentCounts?.positive ?? '—'} subtitle={<SentimentBadge sentiment="positive" />} />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard label="Negative" value={overview?.sentimentCounts?.negative ?? '—'} subtitle={<SentimentBadge sentiment="negative" />} />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <MetricCard label="Neutral" value={overview?.sentimentCounts?.neutral ?? '—'} subtitle={<SentimentBadge sentiment="neutral" />} />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <div className="control-card">
            <SearchBar
              value={filters.q}
              onChange={(value) => updateFilter('q', value)}
              placeholder="Search title, source, summary, or category..."
            />
            <FilterPanel
              filters={filters}
              onChange={updateFilter}
              onReset={resetFilters}
            />
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="panel p-3 h-100">
            <div className="section-title">Sentiment mix</div>
            <div className="chart-wrap">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div>
          <div className="section-title mb-1">Latest articles</div>
          <div className="small-quiet">
            {articlesState.loading ? 'Loading data...' : `${meta.total} articles in the database`}
          </div>
        </div>
      </div>

      {articlesState.loading ? (
        <LoadingSpinner label="Loading articles..." />
      ) : articlesState.error ? (
        <EmptyState title="Could not load articles" message={articlesState.error} />
      ) : articles.length ? (
        <>
          <ArticleList articles={articles} />
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState
          title="No articles yet"
          message="Run a sync to fetch real NewsData.io articles into MySQL."
        />
      )}
    </div>
  );
}