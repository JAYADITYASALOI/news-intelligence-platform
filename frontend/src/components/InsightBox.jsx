export default function InsightBox({ insights = [] }) {
  return (
    <div className="panel p-3">
      <div className="section-title">Key Insights</div>
      {insights.length ? (
        <ul className="mb-0 ps-3">
          {insights.map((item, index) => (
            <li key={`${index}-${item}`} className="mb-2">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-0 muted">No insights available.</p>
      )}
    </div>
  );
}