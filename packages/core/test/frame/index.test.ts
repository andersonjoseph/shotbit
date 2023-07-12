import assert from 'node:assert';
import path from 'node:path';
import { test, describe, beforeEach } from 'node:test';
import { Frame } from '../../src/frame/index.js';

describe('Frame', () => {
  let frame: Frame;
  const similarityTreshold = 25;

  beforeEach(() => {
    frame = new Frame(path.join(__dirname, 'frame1.jpg'));
  });

  test('should extract the frame number from the framePath', () => {
    assert.equal(frame.number, 1);
  });

  test('should return an array of pixels for the frame', async () => {
    const pixels = await frame.getPixels();

    assert.notEqual(pixels, undefined);
    assert.equal(pixels.length, 72);
  });

  test('should calculate the DHash for the frame', async () => {
    const dHash = await frame.getDHash();

    assert.notEqual(dHash, undefined);
    assert.equal(dHash.length, 16);
  });

  test('should return true if the frame is similar to another frame with a similar DHash', async () => {
    const otherFrame = new Frame(path.join(__dirname, 'frame2.jpg'));
    const isSimilar = await frame.isSimilarTo(otherFrame, similarityTreshold);

    assert.ok(isSimilar);
  });

  test('should return false if the frame is not similar to another frame with a different DHash', async () => {
    const otherFrame = new Frame(path.join(__dirname, 'frame3.jpg'));
    const isSimilar = await frame.isSimilarTo(otherFrame, similarityTreshold);

    assert.equal(isSimilar, false);
  });
});
