import { Suspense } from 'react';
import ResultsClient from './results-client';

// Wraps the client results component in Suspense to satisfy Next.js requirements
// around search params.
export default function ResultsPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ResultsClient />
    </Suspense>
  );
}
