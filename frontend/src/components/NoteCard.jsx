import { FileText, Pencil, Trash2 } from 'lucide-react';

const cardColors = ['yellow', 'pink', 'lavender', 'mint', 'peach', 'blue'];

function getCardColor(note) {
  const identity = note._id || note.title;
  const hash = [...identity].reduce((total, character) => total + character.charCodeAt(0), 0);
  return cardColors[hash % cardColors.length];
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

export default function NoteCard({ note, onEdit, onDelete }) {
  const updatedDate = new Date(note.updatedAt || note.createdAt);

  return (
    <article className={`note-card note-card--${getCardColor(note)}`}>
      <div className="note-card-top">
        <span className="note-icon"><FileText size={16} /></span>
        <div className="note-actions">
          <button className="icon-button" type="button" aria-label={`Edit ${note.title}`} onClick={() => onEdit(note)}><Pencil size={15} /></button>
          <button className="icon-button delete-action" type="button" aria-label={`Delete ${note.title}`} onClick={() => onDelete(note)}><Trash2 size={15} /></button>
        </div>
      </div>
      <h2>{note.title}</h2>
      <p className={`note-content${note.content ? '' : ' note-content-empty'}`}>
        {note.content || 'No additional details'}
      </p>
      <footer className="note-footer">
        <span>Updated {formatDate(updatedDate)}</span>
      </footer>
    </article>
  );
}
