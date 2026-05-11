import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top">
      <div className="container-fluid px-3 px-md-4 py-2 page-wrap d-flex align-items-center justify-content-between">
        <Link className="navbar-brand d-flex align-items-center gap-3 m-0" to="/">
          <span className="brand-mark">NI</span>
          <span>
            <div className="fw-bold">News Intelligence</div>
            <div className="small-quiet">AI-powered dashboard</div>
          </span>
        </Link>
        <div className="d-flex gap-2 align-items-center">
          <NavLink to="/" className="btn btn-sm btn-outline-light rounded-pill px-3">
            Dashboard
          </NavLink>
        </div>
      </div>
    </nav>
  );
}