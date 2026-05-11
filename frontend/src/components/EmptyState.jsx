export default function EmptyState({ title = 'No data found', message = 'Try changing your filters or sync fresh articles.' }) {
  return (
    <div className="panel text-center py-5 px-4">
      <h4 className="mb-2">{title}</h4>
      <p className="muted mb-0">{message}</p>
    </div>
  );
}
