import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

// EmptyState conveys absence of data with optional icon and action.
export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="py-8 text-center" data-testid="empty-state">
      {icon && <div className="mx-auto mb-4 h-8 w-8 text-primary">{icon}</div>}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
