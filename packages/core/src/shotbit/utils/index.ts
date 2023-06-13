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

export function assignDefined<
  T extends Record<PropertyKey, unknown>,
  S extends Record<PropertyKey, unknown>,
>(target: T, source: S): T & S {
  const keys = Object.keys(source);

  for (const key of keys) {
    if (source[key] !== undefined) {
      Reflect.set(target, key, source[key]); // https://github.com/microsoft/TypeScript/issues/47357#issuecomment-1364043084
    }
  }

  return target as T & S;
}

export function mapSimilarityTreshold(parameterValue: number): number {
  const min = 20;
  const max = 35;

  const range = max - min;
  const mappedValue = range * parameterValue + min;

  return mappedValue;
}
