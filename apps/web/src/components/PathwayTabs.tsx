'use client';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

export type Mode = 'borrow' | 'repair' | 'used' | 'bfl';

const modes: { value: Mode; label: string }[] = [
  { value: 'borrow', label: 'Borrow' },
  { value: 'repair', label: 'Repair' },
  { value: 'used', label: 'Used' },
  { value: 'bfl', label: 'Buy-for-Life' },
];

// Renders tabs for each sustainability pathway and notifies parent on change.
export default function PathwayTabs({ mode, onModeChange }: { mode: Mode; onModeChange: (m: Mode) => void }) {
  return (
    <Tabs value={mode} onValueChange={(v) => onModeChange(v as Mode)} className="w-full">
      <TabsList>
        {modes.map((m) => (
          <TabsTrigger key={m.value} value={m.value}>
            {m.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
