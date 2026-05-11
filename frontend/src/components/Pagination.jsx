export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages } = meta;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <nav className="mt-4">
      <ul className="pagination justify-content-center flex-wrap gap-2">
        <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
        </li>
        {pages.map((num) => (
          <li className={`page-item ${num === page ? 'active' : ''}`} key={num}>
            <button className="page-link" onClick={() => onPageChange(num)}>
              {num}
            </button>
          </li>
        ))}
        <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
