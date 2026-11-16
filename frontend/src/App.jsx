import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, FilePlus2, SearchX } from 'lucide-react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import NoteCard from './components/NoteCard';
import NoteForm from './components/NoteForm';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Loading from './components/Loading';
import { createNote, deleteNote, getErrorMessage, getNotes, updateNote } from './services/noteService';

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
    setShowForm(true);
  }

  function openEditForm(note) {
    setFormNote(note);
    setShowForm(true);
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
      setShowForm(false);
      await loadNotes();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteNote(deleteTarget._id);
      setDeleteTarget(null);
      setFeedback('Your note has been deleted.');
      await loadNotes();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setDeleting(false);
    }
  }

  const isSearching = Boolean(debouncedSearch.trim());

  return (
    <div className="app-shell">
      <Header onAddNote={openCreateForm} />
      <main className="dashboard">
        <section className="welcome-row">
          <div>
            <p className="eyebrow">YOUR PERSONAL SPACE</p>
            <h1>Notes that stay with you<span className="title-period">.</span></h1>
            <p className="welcome-copy">Keep the little things, big ideas, and everything in between.</p>
          </div>
          <div className="note-count" aria-live="polite">
            <span className="count-number">{totalCount}</span>
            <span>{totalCount === 1 ? 'note' : 'notes'} saved</span>
          </div>
        </section>

        <section className="notes-toolbar" aria-label="Notes controls">
          <div className="toolbar-title">
            <h2>{isSearching ? 'Search results' : 'All notes'}</h2>
            {!loading && <span className="result-count">{notes.length}</span>}
          </div>
          <div className="toolbar-actions">
            <SearchBar value={search} onChange={setSearch} />
            <button className="button button-primary toolbar-add" onClick={openCreateForm}>
              <FilePlus2 size={17} /> Add note
            </button>
          </div>
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
              <NoteCard key={note._id} note={note} onEdit={openEditForm} onDelete={setDeleteTarget} />
            ))}
          </section>
        ) : isSearching ? (
          <div className="empty-state">
            <div className="empty-icon"><SearchX size={25} /></div>
            <h2>No notes found</h2>
            <p>Try a different search, or clear it to see all your notes.</p>
            <button className="text-button" onClick={() => setSearch('')}>Clear search</button>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><FilePlus2 size={25} /></div>
            <h2>No notes yet</h2>
            <p>Your best ideas start somewhere. Make a little room for them here.</p>
            <button className="button button-primary empty-add" onClick={openCreateForm}>
              <FilePlus2 size={17} /> Create your first note
            </button>
          </div>
        )}
      </main>
      <footer className="app-footer">A quiet place for everything on your mind.</footer>

      {showForm && (
        <NoteForm
          key={formNote?._id || 'new-note'}
          note={formNote}
          saving={saving}
          onClose={() => setShowForm(false)}
          onSubmit={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirmModal
          note={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
