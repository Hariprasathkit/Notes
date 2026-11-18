import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export default function NoteForm({ note, saving, error, onClose, onSubmit, onClearError }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [validationError, setValidationError] = useState('');
  const [closing, setClosing] = useState(false);
  const titleRef = useRef(null);
  const closeTimer = useRef(null);

  // Focus the title input when the component mounts

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

// Clear the close timer when the component unmounts to prevent memory leaks

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Function to handle closing the modal with a slight delay for animation

  const closeModal = useCallback(() => {
    if (saving || closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(onClose, 160);
  }, [closing, onClose, saving]);

  // Handle the Escape key to close the modal

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') closeModal();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  // Handle form submission, validate input, and call the onSubmit prop

  async function handleSubmit(event) {
    event.preventDefault();
    onClearError();
    if (!title.trim()) {
      setValidationError('Please give your note a title.');
      titleRef.current?.focus();
      return;
    }
    setValidationError('');
    const saved = await onSubmit({ title: title.trim(), content });
    if (saved) closeModal();
  }

  return (
    <div className={`modal-backdrop${closing ? ' is-closing' : ''}`} onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
      <section className="modal note-form-modal" role="dialog" aria-modal="true" aria-labelledby="note-form-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{note ? 'REFINE YOUR THOUGHT' : 'CAPTURE A THOUGHT'}</p>
            <h2 id="note-form-title">{note ? 'Edit note' : 'New note'}</h2>
          </div>
          <button className="icon-button modal-close" type="button" aria-label="Close dialog" disabled={saving} onClick={closeModal}><X size={19} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="note-title">Title</label>
          <input
            ref={titleRef}
            id="note-title"
            className="form-input"
            value={title}
            onChange={(event) => { setTitle(event.target.value); setValidationError(''); onClearError(); }}
            maxLength={100}
            placeholder="Give your note a title"
            required
          />
          <div className="character-count">{title.length}/100</div>

          <label className="form-label content-label" htmlFor="note-content">Your note <span className="optional-label">optional</span></label>
          <textarea
            id="note-content"
            className="form-input form-textarea"
            value={content}
            onChange={(event) => { setContent(event.target.value); onClearError(); }}
            maxLength={2000}
            placeholder="Start writing..."
            rows={7}
          />
          <div className="character-count">{content.length}/2000</div>
          {(validationError || error) && <p className="form-error" role="alert">{validationError || error}</p>}
          <div className="form-buttons">
            <button type="button" className="button button-secondary" disabled={saving} onClick={closeModal}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? <><span className="button-spinner" /> Saving...</> : note ? 'Save changes' : 'Save note'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
