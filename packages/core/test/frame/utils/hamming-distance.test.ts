import assert from 'assert';
import { describe, test } from 'node:test';
import { getHammingDistance } from '../../../src/frame/utils/hamming-distance';

describe('getHammingDistance', () => {
  test('return 0 if the strings are the same', () => {
    assert.strictEqual(getHammingDistance('123456', '123456'), 0);
  });

  test('return 1 if one bit is different', () => {
    assert.strictEqual(getHammingDistance('123456', '123457'), 1);
  });

  test('return the correct Hamming distance for longer strings', () => {
    assert.strictEqual(getHammingDistance('1234567890', '1234567809'), 4);
  });

  test('throw an error if the strings are not the same length', () => {
    assert.throws(
      () => getHammingDistance('123456', '12345'),
      /Argument must have equal lengths./,
    );
  });
});
