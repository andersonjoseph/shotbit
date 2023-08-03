import assert from 'node:assert';
import { readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { Shotbit } from '../src';

test('shotbit.getShots()', async () => {
  const videoPath = path.join(
    __dirname,
    '..',
    '..',
    'test',
    'videos',
    'ultimas-palabras.mp4',
  );
  const outputPath = path.join(tmpdir(), 'shotbit-test');

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
