import assert from 'assert';
import path from 'node:path';
import { describe, test } from 'node:test';
import { Frame } from '../../src/frame/index';

describe('Frame', () => {
  const framesPath = path.join(__dirname, '..', '..', '..', 'test', 'frames');

  test('create a frame with the correct number and file name', () => {
    const framePath = path.join(framesPath, 'frame1.jpg');

    const frame = new Frame(framePath);

    assert.strictEqual(frame.number, 1);
    assert.strictEqual(frame.fileName, 'frame1.jpg');
  });

  test('throw an error if the file name does not contain a number', () => {
    const framePath = 'not-a-number.jpg';

    assert.throws(
      () => new Frame(framePath),
      /filename must contain the frame number/,
    );
  });

  test('get pixels', async () => {
    const framePath = path.join(framesPath, 'frame1.jpg');

    const frame = new Frame(framePath);

    const pixels = await frame.getPixels();

    assert.ok(pixels.length);
    assert.strictEqual(pixels.length, 72);
  });

  test('similarity with another frame with the same DHash', async () => {
    const framePath1 = path.join(framesPath, 'frame1.jpg');
    const framePath2 = path.join(framesPath, 'frame2.jpg');

    const frame1 = new Frame(framePath1);
    const frame2 = new Frame(framePath2);

    const similarityThreshold = 1;

    const isSimilar = await frame1.isSimilarTo(frame2, similarityThreshold);

    assert.ok(isSimilar);
  });

  test('is not similar to another frame with a different DHash', async () => {
    const framePath1 = path.join(framesPath, 'frame1.jpg');
    const framePath2 = path.join(framesPath, 'frame3.jpg');

    const frame1 = new Frame(framePath1);
    const frame2 = new Frame(framePath2);

    const similarityThreshold = 1;

    const isSimilar = await frame1.isSimilarTo(frame2, similarityThreshold);

    assert.strictEqual(isSimilar, false);
  });
});
