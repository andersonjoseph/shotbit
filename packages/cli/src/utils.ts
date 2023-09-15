import { strict as assert } from 'assert';

export type CliOptions = {
  input: string;
  output: string;
  similarityThreshold?: number;
  minLength?: number;
  noCache?: boolean;
};

export function parseOptions(options: Record<string, unknown>): CliOptions {
  assert.ok('input' in options, 'input (-i | --input) is required');
  assert.ok(typeof options.input === 'string');
  const input = options.input;

  assert.ok('output' in options, 'input (-o | --output) is required');
  assert.ok(typeof options.output === 'string');
  const output = options.output;

  let similarityThreshold: number | undefined;
  if ('similarityThreshold' in options) {
    assert.ok(typeof options.similarityThreshold === 'string');

    similarityThreshold = Number(options.similarityThreshold);
    assert.notEqual(
      isNaN(similarityThreshold),
      true,
      '--similarityThreshold should be a valid number',
    );
  }

  let minLength: number | undefined;
  if ('minLength' in options) {
    assert.ok(typeof options.minLength === 'string');

    minLength = Number(options.minLength);
    assert.notEqual(
      isNaN(minLength),
      true,
      '--minLength should be a valid number',
    );
  }

  let noCache: boolean | undefined;
  if ('noCache' in options) {
    assert.ok(typeof options.noCache === 'boolean');

    noCache = options.noCache;
  }

  return {
    input,
    output,
    similarityThreshold: similarityThreshold,
    minLength,
    noCache,
  };
}
