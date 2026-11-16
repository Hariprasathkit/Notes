import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-field">
      <Search size={18} aria-hidden="true" />
      <span className="visually-hidden">Search notes</span>
      <input
        type="search"
        placeholder="Search your notes..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button className="icon-button search-clear" type="button" aria-label="Clear search" onClick={() => onChange('')}>
          <X size={16} />
        </button>
      )}
    </label>
  );
}
