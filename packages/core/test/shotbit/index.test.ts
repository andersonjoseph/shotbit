import assert from 'node:assert';
import { beforeEach, describe, test } from 'node:test';
import { Shotbit } from '../../src/index';
import path from 'node:path';
import { readdir } from 'node:fs/promises';

describe('Shotbit', () => {
  let shotbit: Shotbit;

  const outputPath = path.join(__dirname, 'output1');

  const videoPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'test',
    'videos',
    'ultimas-palabras.mp4',
  );

  beforeEach(() => {
    shotbit = new Shotbit({
      videoPath,
      outputPath,
    });
  });

  test('extract shots', async () => {
    await shotbit.getShots();

    const exportedShots = await readdir(outputPath);

    assert.strictEqual(exportedShots.length, 4);
  });
});
