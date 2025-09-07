#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mapCli = path.resolve(__dirname, 'map.mjs');

// Preserve existing flags but inject --source off
const args = process.argv.slice(2);
const result = spawnSync(process.execPath, [mapCli, '--source', 'off', ...args], { stdio: 'inherit' });
process.exit(result.status ?? 2);
