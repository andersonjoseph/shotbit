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
  similarityThreshold: {
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
  similarityThreshold: parsedOptions.similarityThreshold,
  minLength: parsedOptions.minLength,
  noCache: parsedOptions.noCache,
});

const spinner = new Spinnies();
spinner.add('main', { text: 'shotbit v1.0.0-alpha' });

shotbit.on('startedRetrievingFrames', () => {
  spinner.update('main', {
    text: 'retrieving frames (this could take a while)',
    color: 'white',
  });
});

shotbit.on('startedExportingShots', () => {
  spinner.update('main', { text: 'exporting shots (this could take a while)' });
});

shotbit.on('shotsExported', () => {
  spinner.succeed('main', { text: 'done' });
});

shotbit.on('error', (err: Error) => {
  spinner.fail('main', { text: `'an error has occured:' ${err.message}` });
});

shotbit.getShots();
