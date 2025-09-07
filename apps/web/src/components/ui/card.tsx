import * as React from 'react';
import clsx from 'clsx';

// Lightweight card wrapper for product display.
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('rounded-lg border bg-white p-4 shadow-sm', className)} {...props} />
);
