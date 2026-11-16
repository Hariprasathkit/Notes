import { BookOpen, Plus } from 'lucide-react';

export default function Header({ onAddNote }) {
  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="Notes home">
        <span className="brand-mark"><BookOpen size={19} strokeWidth={2.2} /></span>
        <span>paper<span className="brand-accent">trail</span></span>
      </a>
      <div className="header-right">
        <span className="header-caption">A little space for your thoughts</span>
        <button className="button button-primary header-add" onClick={onAddNote}>
          <Plus size={18} /> <span>New note</span>
        </button>
      </div>
    </header>
  );
}
