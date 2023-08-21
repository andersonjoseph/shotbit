import assert from 'node:assert';
import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import fs from 'fs/promises';
import { describe, test } from 'node:test';
import {
  assignDefined,
  createDirIfNotExists,
  isValidVideo,
  mapSimilarityTreshold,
  removeAllGeneratedVideos,
} from '../../../src/shotbit/utils/index';

const dirExists = async (path: string) =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);

describe('mapSimilarityTreshold', () => {
  test('return the correct value for a value between 0 and 1', () => {
    const actual = mapSimilarityTreshold(0.5);
    const expected = 27.5;

    assert.strictEqual(actual, expected, 'actual should be equal to expected');
  });

  test('throw an error for a value less than 0', () => {
    assert.throws(
      () => mapSimilarityTreshold(-0.5),
      /value must be between 0 and 1/,
    );
  });

  test('throw an error for a value greater than 1', () => {
    assert.throws(
      () => mapSimilarityTreshold(1.5),
      /value must be between 0 and 1/,
    );
  });
});

describe('assignDefined', () => {
  test('return the target object with the values of the source object for all keys that are defined in the source object', () => {
    const target = { a: 1, b: undefined };
    const source = { a: 2, b: 3, c: 4 };

    const actual = assignDefined(target, source);

    assert.deepStrictEqual(
      actual,
      { a: 2, b: 3, c: 4 },
      'actual should be equal to expected',
    );
  });
});

describe('removeAllGeneratedVideos', () => {
  test('should remove all the videos in the output path that start with the string "shotbit"', async () => {
    const outputPath = path.join(__dirname, 'output1');
    await mkdir(outputPath);
    await fs.writeFile(
      path.join(outputPath, 'shotbit-test.mp4'),
      Buffer.from('yo'),
    );

    await removeAllGeneratedVideos(outputPath);

    const directoryContent = await readdir(outputPath, { withFileTypes: true });

    const expectedFiles = directoryContent.filter((dirent) =>
      dirent.name.startsWith('shotbit'),
    );

    assert.strictEqual(
      expectedFiles.length,
      0,
      'There should be no files starting with "shotbit"',
    );

    await rm(outputPath, { force: true, recursive: true });
  });

  test('should ignore files that do not start with the string "shotbit"', async () => {
    const outputPath = path.join(__dirname, 'output2');
    await mkdir(outputPath);
    await fs.writeFile(
      path.join(outputPath, 'notShotbit.mp4'),
      Buffer.from('yo'),
    );

    await removeAllGeneratedVideos(outputPath);

    const directoryContent = await readdir(outputPath, { withFileTypes: true });

    assert.strictEqual(directoryContent.length, 1, 'There should be one file');
    assert.strictEqual(
      directoryContent[0].name,
      'notShotbit.mp4',
      'The file should be named "notShotbit.mp4"',
    );

    await rm(outputPath, { force: true, recursive: true });
  });

  test('should throw an error if the output path does not exist', async () => {
    await assert.rejects(removeAllGeneratedVideos('./doesNotExist'));
  });
});

describe('isValidVideo', () => {
  test('should return true if the file exists and is a video', async () => {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'test',
      'videos',
      'ultimas-palabras.mp4',
    );

    const actual = await isValidVideo(filePath);

    assert.strictEqual(actual, true, 'The file should be a video');
  });

  test('should return false if the file does not exist', async () => {
    const filePath = './doesNotExist.mp4';

    const actual = await isValidVideo(filePath);

    assert.strictEqual(actual, false, 'The file should not exist');
  });

  test('should return false if the file is not a video', async () => {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'videos',
      'not-video.txt',
    );

    const actual = await isValidVideo(filePath);

    assert.strictEqual(actual, false, 'The file should not be a video');
  });
});

describe('createDirIfNotExists', () => {
  test('should create the directory if it does not exist', async () => {
    const dirPath = path.join(__dirname, 'test-dir');

    await createDirIfNotExists(dirPath);

    const exists = await dirExists(dirPath);

    assert.strictEqual(exists, true, 'The directory should exist');

    await rm(dirPath, { force: true, recursive: true });
  });

  test('should not create the directory if it already exists', async () => {
    const dirPath = path.join(__dirname, 'test-dir');

    await mkdir(dirPath);

    await createDirIfNotExists(dirPath);

    const exists = await dirExists(dirPath);

    assert.strictEqual(exists, true, 'The directory should still exist');

    await rm(dirPath, { force: true, recursive: true });
  });
});
