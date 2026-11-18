import { AlertTriangle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function DeleteConfirmModal({ note, deleting, error, onCancel, onConfirm }) {
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef(null);

 // Clean up the close timer when the component unmounts to prevent memory leaks 

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const closeModal = useCallback(() => {
    if (deleting || closing) return;
    setClosing(true);
    closeTimer.current = window.setTimeout(onCancel, 160);
  }, [closing, deleting, onCancel]);

// Handle the Escape key to close the modal when pressed

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') closeModal();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

// Confirm the deletion of the note and close the modal if successful

  async function confirmDelete() {
    const deleted = await onConfirm();
    if (deleted) closeModal();
  }

  return (
    <div className={`modal-backdrop${closing ? ' is-closing' : ''}`} onMouseDown={(event) => event.target === event.currentTarget && closeModal()}>
      <section className="modal confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
        <div className="confirm-icon"><AlertTriangle size={22} /></div>
        <h2 id="delete-title">Delete this note?</h2>
        <p id="delete-description">“{note.title}” will be permanently removed. This action cannot be undone.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-buttons">
          <button className="button button-secondary" type="button" disabled={deleting} onClick={closeModal}>Keep note</button>
          <button className="button button-danger" type="button" disabled={deleting} onClick={confirmDelete}>
            {deleting ? 'Deleting...' : 'Delete note'}
          </button>
        </div>
      </section>
    </div>
  );
}
