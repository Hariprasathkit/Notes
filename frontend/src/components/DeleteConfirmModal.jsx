import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ note, deleting, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && !deleting && onCancel()}>
      <section className="modal confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
        <div className="confirm-icon"><AlertTriangle size={22} /></div>
        <h2 id="delete-title">Delete this note?</h2>
        <p id="delete-description">“{note.title}” will be permanently removed. This action cannot be undone.</p>
        <div className="form-buttons">
          <button className="button button-secondary" disabled={deleting} onClick={onCancel}>Keep note</button>
          <button className="button button-danger" disabled={deleting} onClick={onConfirm}>
            {deleting ? 'Deleting...' : 'Delete note'}
          </button>
        </div>
      </section>
    </div>
  );
}
