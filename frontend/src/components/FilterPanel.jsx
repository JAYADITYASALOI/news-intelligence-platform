const sentiments = [
  { value: 'all', label: 'All sentiments' },
  { value: 'positive', label: 'Positive' },
  { value: 'negative', label: 'Negative' },
  { value: 'neutral', label: 'Neutral' }
];

export default function FilterPanel({ filters, onChange, onReset }) {
  return (
    <div className="control-card mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-3">
          <label className="form-label muted">Sentiment</label>
          <select
            className="form-select"
            value={filters.sentiment}
            onChange={(e) => onChange('sentiment', e.target.value)}
          >
            {sentiments.map((item) => (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label muted">Category</label>
          <input
            className="form-control"
            value={filters.category}
            onChange={(e) => onChange('category', e.target.value)}
            placeholder="technology, business..."
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label muted">Source</label>
          <input
            className="form-control"
            value={filters.source}
            onChange={(e) => onChange('source', e.target.value)}
            placeholder="BBC, Reuters..."
          />
        </div>
        <div className="col-12 col-md-3 d-flex gap-2">
          <button className="btn btn-outline-light w-100" onClick={onReset}>
            Reset
          </button>
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label muted">From</label>
          <input
            type="date"
            className="form-control"
            value={filters.from}
            onChange={(e) => onChange('from', e.target.value)}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label muted">To</label>
          <input
            type="date"
            className="form-control"
            value={filters.to}
            onChange={(e) => onChange('to', e.target.value)}
          />
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label muted">Sort by</label>
          <select
            className="form-select"
            value={filters.sortBy}
            onChange={(e) => onChange('sortBy', e.target.value)}
          >
            <option value="published_at">Published date</option>
            <option value="created_at">Saved date</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="col-12 col-md-3">
          <label className="form-label muted">Order</label>
          <select
            className="form-select"
            value={filters.sortDir}
            onChange={(e) => onChange('sortDir', e.target.value)}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>
    </div>
  );
}