export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="d-flex align-items-center justify-content-center py-5">
      <div className="text-center">
        <div className="spinner-border text-light mb-3" role="status" aria-hidden="true"></div>
        <div>{label}</div>
      </div>
    </div>
  );
}