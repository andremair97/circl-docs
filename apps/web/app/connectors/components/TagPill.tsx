import type { ReactNode } from "react";

// Pill used to display filter tags; minimal styling to match existing UI.
export default function TagPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block text-xs px-2 py-1 rounded-full border bg-gray-50">
      {children}
    </span>
  );
}
