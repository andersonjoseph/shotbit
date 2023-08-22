import assert from 'node:assert';
import path from 'node:path';
import { beforeEach, describe, test } from 'node:test';
import { FramesHandler } from '../../../src/shotbit/utils/frames-handler';

describe('FramesHandler', () => {
  let framesHandler: FramesHandler;

  beforeEach(async () => {
    const videoPath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'test',
      'videos',
      'ultimas-palabras.mp4',
    );

    framesHandler = new FramesHandler(videoPath, { noCache: false });
  });

  test('extract the frames from the video', async () => {
    await framesHandler.getFrames();

    const paths = await framesHandler.getFrames();

    assert.strictEqual(240, paths.length);
  });

  test('sort the frames in ascending order', async () => {
    await framesHandler.getFrames();

    const paths = await framesHandler.getFrames();

    const [firstFramePath, secondFramePath] = paths;

    assert(path.basename(firstFramePath) < path.basename(secondFramePath));
  });
});
