export default function Loading() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" />
      <span>Gathering your notes...</span>
    </div>
  );
}
