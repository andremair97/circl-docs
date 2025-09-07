import clsx from 'clsx';

// Source or eco info badge.
export const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={clsx('inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800', className)}
    {...props}
  />
);
