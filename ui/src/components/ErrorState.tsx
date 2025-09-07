interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

// ErrorState shows an error message and optional retry button.
export default function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="py-8 text-center" data-testid="error-state">
      <h2 className="text-lg font-semibold text-bad">{title}</h2>
      {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded border border-soft-border px-4 py-2 text-primary hover:bg-soft-border"
        >
          Retry
        </button>
      )}
    </div>
  );
}
