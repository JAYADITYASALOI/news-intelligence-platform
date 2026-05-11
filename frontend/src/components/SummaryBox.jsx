export default function SummaryBox({ summary }) {
  return (
    <div className="panel p-3 mb-3">
      <div className="section-title">AI Summary</div>
      <p className="mb-0 muted">{summary || 'No summary available.'}</p>
    </div>
  );
}