import fs from 'node:fs';
import path from 'node:path';

export function resolveEnvPath(startDir = process.cwd()) {
  let currentDir = path.resolve(startDir);

  while (true) {
    const candidates = [
      path.join(currentDir, 'server', '.env'),
      path.join(currentDir, '.env')
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
  }

  return path.join(path.resolve(startDir), 'server', '.env');
}
