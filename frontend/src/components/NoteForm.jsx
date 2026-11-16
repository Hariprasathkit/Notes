import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export default function NoteForm({ note, saving, onClose, onSubmit }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [validationError, setValidationError] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setValidationError('Please give your note a title.');
      titleRef.current?.focus();
      return;
    }
    setValidationError('');
    onSubmit({ title: title.trim(), content });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !saving && onClose()}>
      <section className="modal note-form-modal" role="dialog" aria-modal="true" aria-labelledby="note-form-title">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">{note ? 'REFINE YOUR THOUGHT' : 'CAPTURE A THOUGHT'}</p>
            <h2 id="note-form-title">{note ? 'Edit note' : 'New note'}</h2>
          </div>
          <button className="icon-button modal-close" type="button" aria-label="Close dialog" disabled={saving} onClick={onClose}><X size={19} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="form-label" htmlFor="note-title">Title</label>
          <input
            ref={titleRef}
            id="note-title"
            className="form-input"
            value={title}
            onChange={(event) => { setTitle(event.target.value); setValidationError(''); }}
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
            onChange={(event) => setContent(event.target.value)}
            maxLength={2000}
            placeholder="Start writing..."
            rows={7}
          />
          <div className="character-count">{content.length}/2000</div>
          {validationError && <p className="form-error" role="alert">{validationError}</p>}
          <div className="form-buttons">
            <button type="button" className="button button-secondary" disabled={saving} onClick={onClose}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? <><span className="button-spinner" /> Saving...</> : note ? 'Save changes' : 'Save note'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
