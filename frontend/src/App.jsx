import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, FilePlus2, SearchX } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteCard from './components/NoteCard';
import NoteForm from './components/NoteForm';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Loading from './components/Loading';
import { createNote, deleteNote, getErrorMessage, getNotes, updateNote } from './services/noteService';

function getInitialTheme() {
  const savedTheme = document.documentElement.dataset.theme;
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  try {
    return window.localStorage.getItem('notes-studio-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export default function App() {
  const [notes, setNotes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formNote, setFormNote] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [theme, setTheme] = useState(getInitialTheme);
  const [formError, setFormError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#15151b' : '#f8f7f4',
    );
    try {
      window.localStorage.setItem('notes-studio-theme', theme);
    } catch {
      setFeedback('Theme preference could not be saved in this browser.');
    }
  }, [theme]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [matchingNotes, allNotes] = await Promise.all([
        getNotes(debouncedSearch),
        debouncedSearch.trim() ? getNotes() : Promise.resolve(null),
      ]);
      setNotes(matchingNotes);
      setTotalCount(allNotes ? allNotes.length : matchingNotes.length);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (!feedback) return undefined;
    const timer = window.setTimeout(() => setFeedback(''), 3200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  function openCreateForm() {
    setFormNote(null);
    setFormError('');
    setShowForm(true);
  }

  function openEditForm(note) {
    setFormNote(note);
    setFormError('');
    setShowForm(true);
  }

  function openDeleteConfirm(note) {
    setDeleteError('');
    setDeleteTarget(note);
  }

  async function handleSave(payload) {
    setSaving(true);
    try {
      if (formNote) {
        await updateNote(formNote._id, payload);
        setFeedback('Your note has been updated.');
      } else {
        await createNote(payload);
        setFeedback('Your note has been saved.');
      }
      await loadNotes();
      return true;
    } catch (requestError) {
      setFormError(getErrorMessage(requestError));
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteNote(deleteTarget._id);
      setFeedback('Your note has been deleted.');
      await loadNotes();
      return true;
    } catch (requestError) {
      setDeleteError(getErrorMessage(requestError));
      return false;
    } finally {
      setDeleting(false);
    }
  }

  const isSearching = Boolean(debouncedSearch.trim());

  return (
    <div className="studio-shell">
      <Sidebar
        theme={theme}
        noteCount={totalCount}
        onShowAll={() => setSearch('')}
        onToggleTheme={() => setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')}
      />
      <div className="workspace">
        <Header
          onAddNote={openCreateForm}
          search={search}
          onSearchChange={setSearch}
        />
        <main className="dashboard">
        <section className="welcome-row">
          <div>
            <p className="eyebrow">A LITTLE SPACE TO THINK</p>
            <h1>Your creative space<span className="title-period">.</span></h1>
            <p className="welcome-copy">Capture your thoughts, one note at a time.</p>
          </div>
          <div className="note-count" aria-live="polite">
            <span className="count-number">{totalCount.toString().padStart(2, '0')}</span>
            <span>{totalCount === 1 ? 'note' : 'notes'} in your studio</span>
          </div>
        </section>

        <section className="notes-toolbar" aria-label="Notes controls">
          <div className="toolbar-title">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h2>{isSearching ? 'Search results' : 'All notes'}</h2>
            </div>
            {!loading && <span className="result-count">{notes.length}</span>}
          </div>
          {isSearching && <span className="search-summary">Matching “{debouncedSearch}”</span>}
        </section>

        {feedback && <div className="toast" role="status">{feedback}</div>}
        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
            <button className="button button-secondary retry-button" onClick={loadNotes}>Try again</button>
          </div>
        )}

        {loading ? <Loading /> : error ? null : notes.length ? (
          <section className="notes-grid" aria-label="Your notes">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} onEdit={openEditForm} onDelete={openDeleteConfirm} />
            ))}
          </section>
        ) : isSearching ? (
          <div className="empty-state">
            <div className="empty-illustration"><SearchX size={27} /></div>
            <p className="eyebrow">NOTHING ON THAT PAGE</p>
            <h2>No notes found</h2>
            <p>Try another phrase or clear your search to see everything.</p>
            <button className="button button-secondary empty-clear" onClick={() => setSearch('')}>Clear search</button>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-illustration empty-illustration-notes">
              <span className="empty-note empty-note-back" />
              <span className="empty-note empty-note-front"><FilePlus2 size={23} /></span>
            </div>
            <p className="eyebrow">A FRESH PAGE</p>
            <h2>Your space is waiting.</h2>
            <p>Start capturing your thoughts and ideas.</p>
            <button className="button button-primary empty-add" onClick={openCreateForm}>
              <FilePlus2 size={17} /> Create your first note
            </button>
          </div>
        )}
        </main>
        <footer className="app-footer">A quiet place for everything on your mind.</footer>
      </div>

      {showForm && (
        <NoteForm
          key={formNote?._id || 'new-note'}
          note={formNote}
          saving={saving}
          error={formError}
          onClose={() => setShowForm(false)}
          onClearError={() => setFormError('')}
          onSubmit={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          note={deleteTarget}
          deleting={deleting}
          error={deleteError}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
