import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import clsx from 'clsx';

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={clsx('flex w-full border-b', className)}
      {...props}
    />
  ),
);
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={clsx(
        'flex-1 px-3 py-2 text-sm font-medium text-gray-700 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary',
        className,
      )}
      {...props}
    />
  ),
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content ref={ref} className={clsx('pt-4', className)} {...props} />
  ),
);
TabsContent.displayName = TabsPrimitive.Content.displayName;
