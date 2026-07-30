import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveEnvPath } from '../env.js';

test('resolveEnvPath prefers the server .env file when the app starts from the project root', () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(__dirname, '..', '..');

  const resolved = resolveEnvPath(projectRoot);

  assert.equal(resolved, path.join(projectRoot, 'server', '.env'));
});

test('resolveEnvPath also works when the app starts from the server directory', () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(__dirname, '..', '..');
  const serverDir = path.resolve(__dirname, '..');

  const resolved = resolveEnvPath(serverDir);

  assert.equal(resolved, path.join(projectRoot, 'server', '.env'));
});
