import * as React from 'react';
import clsx from 'clsx';

// Basic button matching shadcn/ui style with Circl's green accent.
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = 'Button';
