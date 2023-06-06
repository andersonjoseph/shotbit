import path from 'node:path';
import { readdirSync, rmSync } from 'fs';
import { access } from 'node:fs/promises';
import ffmpeg from '../../ffmpeg/index.js';

export * from './frame-paths.js';

const __dirname = new URL('.', import.meta.url).pathname;

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
  } catch (_) {
    return false;
  }

  return true;
}

export function removeAllGeneratedVideos(outputPath: string): void {
  const directoryContent = readdirSync(outputPath, { withFileTypes: true });

  directoryContent
    .filter((dirent) => dirent.name.startsWith('shotbit'))
    .map((dirent) => path.join(__dirname, dirent.name))
    .forEach((path) => {
      rmSync(path, { force: true, recursive: true });
    });
}

export async function isValidVideo(filePath: string) {
  const [videoExists, isVideo] = await Promise.all([
    fileExists(filePath),
    ffmpeg.isVideo(filePath),
  ]);

  return videoExists && isVideo;
}
