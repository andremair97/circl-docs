'use client';
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Product } from '../types/universal';

// Dialog exposes raw source details for transparency.
export default function ProvenanceDialog({ item }: { item: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-2 py-1 text-xs">ⓘ provenance</Button>
      </DialogTrigger>
      <DialogContent>
        <h3 className="mb-2 text-lg font-semibold">Provenance</h3>
        <p className="text-sm">Source: {item.source}</p>
        <p className="break-all text-sm">
          URL:{' '}
          <a href={item.url} className="text-blue-600 underline">
            {item.url}
          </a>
        </p>
        <p className="text-sm">Fetched: {item.fetched_at}</p>
      </DialogContent>
    </Dialog>
  );
}
