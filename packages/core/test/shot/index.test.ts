import assert from 'node:assert';
import { test, describe, beforeEach } from 'node:test';
import { Frame } from '../../src/frame/index.js';
import { Shot } from '../../src/shot/index.js';

describe('Shot', () => {
  let shot: Shot;

  beforeEach(() => {
    shot = new Shot(new Frame('./2'), new Frame('./10'));
  });

  test('throw an error if the startFrame is after the endFrame', () => {
    assert.throws(() => new Shot(new Frame('./2'), new Frame('./1')));
  });

  test('return true if it is large enough', () => {
    assert.ok(shot.isLargeEnough(0));
  });

  test('return false if it is not large enough', () => {
    assert.equal(shot.isLargeEnough(10), false);
  });

  test('return true if it is a continuation of the previous shot', () => {
    const previousShot = new Shot(new Frame('./0'), new Frame('./1'));
    assert.ok(shot.isContinuationOf(previousShot));
  });

  test('return false if it is not a continuation of the previous shot', () => {
    const previousShot = new Shot(new Frame('./0'), new Frame('./1'));
    assert.ok(shot.isContinuationOf(previousShot));
  });
});
