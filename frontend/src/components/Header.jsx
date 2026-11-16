import { BookOpen, PenLine } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Header({ onAddNote, search, onSearchChange }) {
  return (
    <header className="studio-header">
      <a className="header-brand" href="/" aria-label="Creative Notes Studio home">
        <span className="brand-mark"><BookOpen size={19} strokeWidth={2.2} /></span>
        <span>memo<span className="brand-accent">studio</span></span>
      </a>
      <div className="studio-header-actions">
        <SearchBar value={search} onChange={onSearchChange} />
        <button className="button button-primary header-add" type="button" onClick={onAddNote}>
          <PenLine size={17} /> <span>New note</span>
        </button>
      </div>
    </header>
  );
}
