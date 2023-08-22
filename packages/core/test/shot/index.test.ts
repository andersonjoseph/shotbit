import assert from 'node:assert';
import { beforeEach, describe, test } from 'node:test';
import { Frame } from '../../src/frame/index';
import { Shot } from '../../src/shot/index';

describe('Shot', () => {
  let startFrame: Frame;
  let endFrame: Frame;
  let shot: Shot;

  beforeEach(() => {
    startFrame = new Frame('5.jpg');
    endFrame = new Frame('10.jpg');

    shot = new Shot(startFrame, endFrame);
  });

  test('throw an error if the end frame is before the start frame', () => {
    assert.throws(
      () => new Shot(endFrame, startFrame),
      /endFrame must be ahead of startFrame/,
    );
  });

  test('return true if the shot is large enough', () => {
    assert.ok(shot.isLargeEnough(2));
  });

  test('return false if the shot is not large enough', () => {
    assert.ok(!shot.isLargeEnough(20));
  });

  test('return true if the shot is a continuation of the previous shot', () => {
    const previousShot = new Shot(new Frame('1.jpg'), new Frame('4.jpg'));

    assert.ok(shot.isContinuationOf(previousShot));
  });

  test('return false if the shot is not a continuation of the previous shot', () => {
    const previousShot = new Shot(new Frame('2.jpg'), new Frame('5.jpg'));
    assert.ok(!shot.isContinuationOf(previousShot));
  });
});
