// GitHub Pages serves actual directories; provide an entry point for every app route.
import { mkdir, copyFile } from 'node:fs/promises';
const routes = ['over-ons', 'activiteiten', 'pluspunten', 'reserveren'];
for (const route of routes) {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile('dist/index.html', `dist/${route}/index.html`);
}
