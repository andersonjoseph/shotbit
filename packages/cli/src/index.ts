import { strict as assert } from 'node:assert';
import { Shotbit } from '@shotbit/core';

const videoPath = process.argv[2];
assert.ok(videoPath, 'video path is missing');

const outputPath = process.argv[3];
assert.ok(outputPath, 'output path is missing');

const shotbit = new Shotbit({ videoPath, outputPath });

console.log('generating shots...');

await shotbit.getShots();

console.log('done');
