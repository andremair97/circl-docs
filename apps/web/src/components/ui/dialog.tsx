import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import clsx from 'clsx';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40" />
      <DialogPrimitive.Content
        ref={ref}
        className={clsx('fixed left-1/2 top-1/2 w-11/12 max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-4 shadow-lg', className)}
        {...props}
      />
    </DialogPrimitive.Portal>
  ),
);
DialogContent.displayName = DialogPrimitive.Content.displayName;
