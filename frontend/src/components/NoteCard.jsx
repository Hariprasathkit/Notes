import { FileText, Pencil, Trash2 } from 'lucide-react';

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="note-card">
      <div className="note-card-top">
        <span className="note-icon"><FileText size={17} /></span>
        <div className="note-actions">
          <button className="icon-button" aria-label={`Edit ${note.title}`} onClick={() => onEdit(note)}><Pencil size={16} /></button>
          <button className="icon-button delete-action" aria-label={`Delete ${note.title}`} onClick={() => onDelete(note)}><Trash2 size={16} /></button>
        </div>
      </div>
      <h2>{note.title}</h2>
      <p className={`note-content${note.content ? '' : ' note-content-empty'}`}>
        {note.content || 'No additional details'}
      </p>
      <footer className="note-footer">
        <span>{formatDate(note.updatedAt || note.createdAt)}</span>
      </footer>
    </article>
  );
}
