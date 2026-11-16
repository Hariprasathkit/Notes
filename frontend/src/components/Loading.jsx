export default function Loading() {
  return (
    <div className="loading-state" role="status" aria-live="polite" aria-label="Loading notes">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="skeleton-card" key={index} aria-hidden="true">
          <span className="skeleton-icon" />
          <span className="skeleton-line skeleton-line-short" />
          <span className="skeleton-line" />
          <span className="skeleton-line skeleton-line-medium" />
          <span className="skeleton-footer" />
        </div>
      ))}
    </div>
  );
}
