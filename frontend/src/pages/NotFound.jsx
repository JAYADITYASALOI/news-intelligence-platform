import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-wrap">
      <div className="panel p-5 text-center">
        <h1 className="display-6 fw-bold">404</h1>
        <p className="muted mb-4">The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-brand">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}