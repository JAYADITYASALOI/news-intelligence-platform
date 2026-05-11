export default function SentimentBadge({ sentiment = 'neutral' }) {
  const normalized = String(sentiment || 'neutral').toLowerCase();
  const className =
    normalized === 'positive'
      ? 'chip chip-positive'
      : normalized === 'negative'
      ? 'chip chip-negative'
      : 'chip chip-neutral';

  return <span className={className}>{normalized}</span>;
}
