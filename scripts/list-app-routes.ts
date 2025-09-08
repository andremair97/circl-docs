import { glob } from 'glob';
import fs from 'node:fs';
import path from 'node:path';

async function main() {
  const candidates = ['apps/web/src/app', 'apps/web/app'];
  const base = candidates.find((p) => fs.existsSync(p));
  if (!base) {
    console.error('app directory not found');
    process.exit(1);
  }

  const files = await glob('**/page.tsx', { cwd: base, nodir: true });

  const routes = files
    .map((file) => {
      const dir = path.posix.dirname(file);
      const segments = dir === '.' ? [] : dir.split('/');
      const filtered = segments.filter(
        (seg) => !seg.startsWith('(') && !seg.startsWith('_')
      );
      return '/' + filtered.join('/');
    })
    .sort();

  for (const route of routes) {
    console.log(route || '/');
  }
}

main();
