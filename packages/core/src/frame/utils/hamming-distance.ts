import assert from 'assert';

const lookup = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  a: '1010',
  b: '1011',
  c: '1100',
  d: '1101',
  e: '1110',
  f: '1111',
  A: '1010',
  B: '1011',
  C: '1100',
  D: '1101',
  E: '1110',
  F: '1111',
};

function hexToBinaryString(hexString: string): string {
  assert(/^[0-9a-fA-F]+$/.test(hexString));
  let output = '';

  for (let i = 0; i < hexString.length; i++) {
    const hexKey = hexString[i] as keyof typeof lookup;
    output += lookup[hexKey];
  }

  return output;
}

export function getHammingDistance(a: string, b: string) {
  assert.strictEqual(a.length, b.length, 'Argument must have equal lengths.');

  a = hexToBinaryString(a);
  b = hexToBinaryString(b);

  let count = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      count++;
    }
  }

  return count;
}
