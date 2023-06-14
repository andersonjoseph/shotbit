import assert from 'node:assert';
import { test, describe } from 'node:test';
import fs, { mkdirSync, rmSync } from 'node:fs';
import {
  assignDefined,
  createDirIfNotExists,
  mapSimilarityTreshold,
  removeAllGeneratedVideos,
} from '../../src/shotbit/utils/index.js';
import path from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;

describe('mapSimilarityTreshold(parameterValue: number)', () => {
  test('map a value between 20 and 35', () => {
    let value: number;

    value = mapSimilarityTreshold(0);
    assert.equal(value, 20);

    value = mapSimilarityTreshold(1);
    assert.equal(value, 35);

    value = mapSimilarityTreshold(0.5);
    assert.equal(value, 27.5);
  });

  test('throw error if value is not between 0 and 1', () => {
    assert.throws(() => mapSimilarityTreshold(2));
    assert.throws(() => mapSimilarityTreshold(-1));
  });
});

describe('assignDefined', () => {
  test('return a new object with the values of the source object for the keys that are not undefined', () => {
    const target = { a: 1, b: 2, c: 3 };
    const source = { b: 4, d: 5 };
    const expected = { a: 1, b: 4, c: 3, d: 5 };
    const actual = assignDefined(target, source);

    assert.deepEqual(actual, expected);
  });
});

describe('removeAllGeneratedVideos', () => {
  test('remove all generated videos from the output path', () => {
    mkdirSync(path.join(__dirname, 'output'));

    const outputPath = path.join(__dirname, 'output');
    const videoPath1 = path.join(outputPath, 'shotbit.mp4');
    const videoPath2 = path.join(outputPath, 'shotbit2.mp4');

    fs.writeFileSync(videoPath1, 'some video data');
    fs.writeFileSync(videoPath2, 'some video data');

    removeAllGeneratedVideos(outputPath);

    assert.equal(fs.existsSync(videoPath1), false);
    assert.equal(fs.existsSync(videoPath2), false);

    rmSync(outputPath, { force: true, recursive: true });
  });
});

describe('createDirIfNotExists', () => {
  test('create a directory if it does not already exist', async () => {
    const testPath = path.join(__dirname, './test-dir');
    await createDirIfNotExists(testPath);
    assert.ok(fs.existsSync(testPath));

    rmSync(testPath, { force: true, recursive: true });
  });

  test('not create a directory if it already exists', async () => {
    const testPath = path.join(__dirname, './test-dir');
    fs.mkdirSync(testPath);
    await createDirIfNotExists(testPath);
    assert.ok(fs.existsSync(testPath));

    rmSync(testPath, { force: true, recursive: true });
  });
});
