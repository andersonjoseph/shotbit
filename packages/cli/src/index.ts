import { Shotbit } from '@shotbit/core';
import { parseArgs } from 'node:util';
import { parseOptions } from './utils.js';

const args = process.argv.slice(2, process.argv.length);

const optionsSchema = {
  input: {
    type: 'string',
    short: 'i',
  },
  output: {
    type: 'string',
    short: 'o',
  },
  similarityTreshold: {
    type: 'string',
  },
  minLength: {
    type: 'string',
  },
} as const;

const options = parseArgs({
  args,
  optionsSchema,
}).values;

const parsedOptions = parseOptions(options);

const shotbit = new Shotbit({
  videoPath: parsedOptions.input,
  outputPath: parsedOptions.output,
  similarityTreshold: parsedOptions.similarityTreshold,
  minLength: parsedOptions.minLength,
});

console.log('generating shots...');

await shotbit.getShots();

console.log('done');
