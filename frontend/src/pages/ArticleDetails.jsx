import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchArticleById } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SentimentBadge from '../components/SentimentBadge.jsx';
import SummaryBox from '../components/SummaryBox.jsx';
import InsightBox from '../components/InsightBox.jsx';
import { formatDate } from '../utils/formatDate.js';

export default function ArticleDetails() {
  const { id } = useParams();
  const [state, setState] = useState({
    loading: true,
    error: '',
    data: null
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setState({ loading: true, error: '', data: null });
        const response = await fetchArticleById(id);
        if (!mounted) return;
        setState({
          loading: false,
          error: '',
          data: response.data
        });
      } catch (error) {
        if (!mounted) return;
        setState({
          loading: false,
          error: error?.response?.data?.message || error.message || 'Failed to load article',
          data: null
        });
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (state.loading) {
    return (
      <div className="page-wrap">
        <LoadingSpinner label="Loading article..." />
      </div>
    );
  }

  if (state.error || !state.data) {
    return (
      <div className="page-wrap">
        <div className="panel p-4 text-center">
          <h4 className="mb-2">Article not found</h4>
          <p className="muted mb-3">{state.error || 'No article available.'}</p>
          <Link to="/" className="btn btn-brand">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const article = state.data;

  return (
    <div className="page-wrap">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <Link to="/" className="small-quiet">← Back to dashboard</Link>
          <h1 className="h3 mt-2 mb-1">{article.title}</h1>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <SentimentBadge sentiment={article.ai_sentiment} />
            <span className="small-quiet">{article.source_name || 'Unknown Source'}</span>
            <span className="small-quiet">•</span>
            <span className="small-quiet">{formatDate(article.published_at)}</span>
          </div>
        </div>
        {article.article_url ? (
          <a className="btn btn-brand" href={article.article_url} target="_blank" rel="noreferrer">
            Open original source
          </a>
        ) : null}
      </div>

      <div className="detail-card p-4">
        {article.image_url ? (
          <img className="detail-image mb-4" src={article.image_url} alt={article.title} />
        ) : null}

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <SummaryBox summary={article.ai_summary} />
            <div className="panel p-3 mb-3">
              <div className="section-title">Article Description</div>
              <p className="mb-0 muted">{article.description || 'No description available.'}</p>
            </div>
            <div className="panel p-3">
              <div className="section-title">Raw Content</div>
              <p className="mb-0 muted">{article.content || 'No content available.'}</p>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <InsightBox insights={article.ai_insights || []} />
            <div className="panel p-3 mt-3">
              <div className="section-title">Metadata</div>
              <div className="d-flex flex-column gap-2">
                <div><span className="muted">Category:</span> {article.category || 'N/A'}</div>
                <div><span className="muted">Language:</span> {article.language || 'N/A'}</div>
                <div><span className="muted">Author:</span> {article.author || 'N/A'}</div>
                <div><span className="muted">Country:</span> {article.country || 'N/A'}</div>
                <div><span className="muted">Source URL:</span> {article.source_url || 'N/A'}</div>
              </div>
            </div>
            <div className="panel p-3 mt-3">
              <div className="section-title">Keywords</div>
              <div className="d-flex flex-wrap gap-2">
                {(article.ai_keywords || []).length ? article.ai_keywords.map((item, index) => (
                  <span className="chip chip-neutral" key={`${index}-${item}`}>{item}</span>
                )) : <span className="muted">No keywords available.</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}