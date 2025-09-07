import { spawnSync } from 'node:child_process';

const tests = [
  'tests/test_off.mjs',
  'tests/test_ifixit.mjs',
  'tests/test_ebay.mjs',
  'tests/test_lot.mjs'
];

for (const t of tests) {
  const res = spawnSync('node', [t], { stdio: 'inherit' });
  if (res.status !== 0) {
    process.exit(res.status || 1);
  }
}

console.log('All connector smoke tests passed ✅');
