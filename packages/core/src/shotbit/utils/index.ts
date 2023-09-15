import path from 'node:path';
import { access, mkdir, readdir, rm } from 'node:fs/promises';
import ffmpeg from '../../ffmpeg/index.js';
import assert from 'node:assert';

export * from './frames-handler';

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
  } catch (_) {
    return false;
  }

  return true;
}

export async function createDirIfNotExists(path: string): Promise<void> {
  try {
    await mkdir(path);
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && err.code === 'EEXIST') {
      return;
    }
    throw err;
  }
}

export async function removeAllGeneratedVideos(
  outputPath: string,
): Promise<void> {
  const directoryContent = await readdir(outputPath, { withFileTypes: true });

  const promises = directoryContent
    .filter((dirent) => dirent.name.startsWith('shotbit'))
    .map((dirent) => path.join(outputPath, dirent.name))
    .map((path) => rm(path, { force: true, recursive: true }));

  await Promise.all(promises);
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

export function mapSimilarityThreshold(parameterValue: number): number {
  assert.ok(
    parameterValue >= 0 && parameterValue <= 1,
    'value must be between 0 and 1',
  );

  const min = 20;
  const max = 35;

  const range = max - min;
  const mappedValue = range * parameterValue + min;

  return mappedValue;
}
