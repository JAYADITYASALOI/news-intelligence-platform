import { Link } from 'react-router-dom';
import SentimentBadge from './SentimentBadge.jsx';
import { formatDate } from '../utils/formatDate.js';
import { truncate } from '../utils/helpers.js';

export default function ArticleCard({ article }) {
  return (
    <div className="news-card">
      {article.image_url ? (
        <img className="article-image mb-3" src={article.image_url} alt={article.title} />
      ) : (
        <div className="article-image mb-3 d-flex align-items-center justify-content-center muted">
          No image
        </div>
      )}

      <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
        <SentimentBadge sentiment={article.ai_sentiment} />
        <span className="small-quiet">{formatDate(article.published_at)}</span>
      </div>

      <h5 className="mb-2 line-clamp-2">{article.title}</h5>
      <div className="small-quiet mb-2">
        {article.source_name || 'Unknown Source'} {article.category ? `• ${article.category}` : ''}
      </div>
      <p className="muted line-clamp-3">{truncate(article.ai_summary || article.description || article.content, 180)}</p>

      <div className="d-flex align-items-center justify-content-between mt-3 gap-2">
        <Link className="btn btn-sm btn-brand px-3" to={`/article/${article.id}`}>
          Open details
        </Link>
        {article.article_url ? (
          <a className="btn btn-sm btn-outline-light px-3" href={article.article_url} target="_blank" rel="noreferrer">
            Source
          </a>
        ) : null}
      </div>
    </div>
  );
}
