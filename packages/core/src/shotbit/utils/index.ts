import path from 'node:path';
import { readdirSync, rmSync } from 'fs';

export * from './frame-paths.js';

export function removeAllGeneratedVideos(outputPath: string): void {
  const directoryContent = readdirSync(outputPath, { withFileTypes: true });

  directoryContent
    .filter((dirent) => dirent.name.startsWith('shotbit'))
    .map((dirent) => path.join(dirent.path, dirent.name))
    .forEach((path) => {
      rmSync(path, { force: true, recursive: true });
    });
}
