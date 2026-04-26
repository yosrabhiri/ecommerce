import { LoaderCircle } from 'lucide-react';

export function LoadingState({ title, message }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-icon" aria-hidden="true">
        <LoaderCircle size={34} />
      </span>
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
}
