import assert from 'node:assert';
import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { Shotbit } from '../../src/index.js';

const __dirname = new URL('.', import.meta.url).pathname;

test('shotbit.getShots()', { skip: true }, async () => {
  const videoPath = path.join(
    __dirname,
    '..',
    'videos',
    'ultimas-palabras.mp4',
  );
  const outputPath = path.join(__dirname, '..', 'videos', 'tmp');

  const shotbit = new Shotbit({
    videoPath,
    outputPath,
    noCache: true,
  });

  await shotbit.getShots();

  const directoryContent = await readdir(outputPath);

  assert.equal(directoryContent.length, 4);

  await rm(outputPath, { force: true, recursive: true });
});
