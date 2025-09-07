interface SkeletonProps {
  variant?: 'rows' | 'cards';
  count?: number;
}

// Skeleton renders placeholder blocks for loading states.
export default function Skeleton({ variant = 'rows', count = 3 }: SkeletonProps) {
  const items = Array.from({ length: count });
  if (variant === 'cards') {
    return (
      <div className="grid gap-4" data-testid="skeleton-cards">
        {items.map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded bg-soft-border"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-2" data-testid="skeleton-rows">
      {items.map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-soft-border"
        />
      ))}
    </div>
  );
}
