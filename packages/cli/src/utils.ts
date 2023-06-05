import { strict as assert } from 'assert';

export type CliOptions = {
  input: string;
  output: string;
  similarityTreshold?: number;
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

  let similarityTreshold: number | undefined;
  if ('similarityTreshold' in options) {
    assert.ok(typeof options.similarityTreshold === 'string');

    similarityTreshold = Number(options.similarityTreshold);
    assert.notEqual(
      isNaN(similarityTreshold),
      true,
      '--similarityTreshold should be a valid number',
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
    similarityTreshold,
    minLength,
    noCache,
  };
}
