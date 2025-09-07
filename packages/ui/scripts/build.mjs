#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
// pnpm --filter ui build --if-present may forward --if-present to this script.
// Strip it before calling tsc so CI doesn't fail on unknown options.
const args = process.argv.slice(2).filter(arg => arg !== '--if-present');
const result = spawnSync('tsc', ['-p', 'tsconfig.json', ...args], {
  stdio: 'inherit'
});
process.exit(result.status ?? 0);
