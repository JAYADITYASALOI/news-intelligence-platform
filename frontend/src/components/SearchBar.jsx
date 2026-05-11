export default function SearchBar({ value, onChange, placeholder = 'Search articles...' }) {
  return (
    <div className="mb-3">
      <input
        className="form-control form-control-lg"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
