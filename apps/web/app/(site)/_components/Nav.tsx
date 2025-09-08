import fs from 'node:fs';
import path from 'node:path';
import NavClient from './NavClient';

// Server component reads available connector pages and forwards them to the client.
export default function Nav() {
  const base = path.join(process.cwd(), 'app/connectors');
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
