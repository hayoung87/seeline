import { readdir, mkdir, rm, copyFile, cp } from 'node:fs/promises';
import { extname } from 'node:path';
// Publish only browser assets. Server code, credentials and setup docs stay out of public/.
await rm('public', { recursive: true, force: true });
await mkdir('public');
for (const entry of await readdir('.', { withFileTypes: true })) {
  if (entry.isFile() && ['.html', '.css', '.js'].includes(extname(entry.name))) {
    await copyFile(entry.name, `public/${entry.name}`);
  }
}
await cp('images', 'public/images', { recursive: true });
