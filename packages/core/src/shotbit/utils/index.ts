import path from 'node:path';
import { readdirSync, rmSync } from 'fs';

export * from './frame-paths.js';

const __dirname = new URL('.', import.meta.url).pathname;

export function removeAllGeneratedVideos(outputPath: string): void {
  const directoryContent = readdirSync(outputPath, { withFileTypes: true });

  directoryContent
    .filter((dirent) => dirent.name.startsWith('shotbit'))
    .map((dirent) => path.join(__dirname, dirent.name))
    .forEach((path) => {
      rmSync(path, { force: true, recursive: true });
    });
}
