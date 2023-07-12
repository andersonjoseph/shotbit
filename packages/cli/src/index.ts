import { Shotbit } from '@shotbit/core';

import { parseArgs } from 'node:util';
import { CliOptions, parseOptions } from './utils.js';
import Spinnies from 'spinnies';

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

const spinner = new Spinnies();
spinner.add('main');

shotbit.on('started', () => {
  spinner.update('main', { text: 'shotbit v1' });
});

shotbit.on('startedRetrievingFrames', () => {
  spinner.update('main', { text: 'retrieving frames', color: 'white' });
});

shotbit.on('startedExportingShots', () => {
  spinner.update('main', { text: 'exporting shots' });
});

shotbit.on('shotsExported', () => {
  spinner.succeed('main', { text: 'done' });
});

shotbit.on('error', (err: Error) => {
  spinner.fail(`'an error has occured:' ${err.message}`);
});

shotbit.getShots();
