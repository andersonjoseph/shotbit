import { Shotbit } from '@shotbit/core';
import { parseArgs } from 'node:util';
import { CliOptions, parseOptions } from './utils.js';

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
  noCache: {
    type: 'boolean',
  },
} as const;

const options = parseArgs({
  options: optionsSchema,
}).values;

let parsedOptions: CliOptions;

try {
  parsedOptions = parseOptions(options);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log('Error:', err.message);
  }
  process.exit(1);
}

const shotbit = new Shotbit({
  videoPath: parsedOptions.input,
  outputPath: parsedOptions.output,
  similarityTreshold: parsedOptions.similarityTreshold,
  minLength: parsedOptions.minLength,
  noCache: parsedOptions.noCache,
});

console.log('generating shots...');

await shotbit.getShots();

console.log('done');
