import ArticleCard from './ArticleCard.jsx';

export default function ArticleList({ articles = [] }) {
  if (!articles.length) return null;

  return (
    <div className="row g-4">
      {articles.map((article) => (
        <div className="col-12 col-md-6 col-xl-4" key={article.id}>
          <ArticleCard article={article} />
        </div>
      ))}
    </div>
  );
}