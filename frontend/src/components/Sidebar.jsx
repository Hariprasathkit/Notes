import { Moon, NotebookPen, NotebookText, Sparkles, Sun } from 'lucide-react';

export default function Sidebar({ theme, noteCount, onShowAll, onToggleTheme }) {
  return (
    <aside className="sidebar">
      <a className="sidebar-brand" href="/" aria-label="Creative Notes Studio home">
        <span className="sidebar-brand-mark"><NotebookPen size={21} strokeWidth={2} /></span>
        <span className="sidebar-brand-name">Notes<span>App</span></span>
      </a>

      <div className="sidebar-section-label">LIBRARY</div>
      <nav className="sidebar-nav" aria-label="Notes navigation">
        <button className="sidebar-link is-active" type="button" aria-label="All notes" aria-current="page" onClick={onShowAll}>
          <NotebookText size={18} />
          <span>All notes</span>
          <span className="sidebar-count">{noteCount}</span>
        </button>
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-about">
        <span className="sidebar-about-icon"><Sparkles size={16} /></span>
        <p>Make room for the ideas you don't want to lose.</p>
        <span className="sidebar-about-caption">YOUR CREATIVE SPACE</span>
      </div>

      <button
        className="theme-toggle"
        type="button"
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span className="theme-toggle-icon">
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </span>
        <span className="theme-toggle-label">{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
        <span className="theme-toggle-state">{theme === 'light' ? 'OFF' : 'ON'}</span>
      </button>
    </aside>
  );
}
