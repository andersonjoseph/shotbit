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

shotbit.on('started', () => {
  console.log('process started...');
});

shotbit.on('startedRetrievingFrames', () => {
  console.log('retrieving frames...');
});

shotbit.on('framesRetrieved', () => {
  console.log('done');
});

shotbit.on('startedExportingShots', () => {
  console.log('exporting shots...');
});

shotbit.on('framesRetrieved', () => {
  console.log('frames retrieved...');
});

shotbit.on('shotsExported', () => {
  console.log('done');
});

shotbit.on('error', (err: Error) => {
  console.log('an error has occured:', err.message);
});

await shotbit.getShots();
