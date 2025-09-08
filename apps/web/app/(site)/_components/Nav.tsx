import fs from 'node:fs';
import path from 'node:path';
import NavClient from './NavClient';

// Server component reads available connector pages and forwards them to the client.
export default function Nav() {
  const candidates = ['app/connectors', 'apps/web/app/connectors'];
  // Prefer app/connectors for local packages; fall back to apps/web/app/connectors when run from repo root
  const base =
    candidates
      .map((p) => path.join(process.cwd(), p))
      .find((p) => fs.existsSync(p)) ?? path.join(process.cwd(), candidates[0]);
  let connectors: string[] = [];
  try {
    connectors = fs
      .readdirSync(base, { withFileTypes: true })
      .filter(
        (d) =>
          d.isDirectory() &&
          !d.name.startsWith('_') &&
          fs.existsSync(path.join(base, d.name, 'page.tsx'))
      )
      .map((d) => d.name)
      .sort();
  } catch {
    connectors = [];
  }

  return <NavClient connectors={connectors} />;
}
