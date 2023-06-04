// based on the algorithm described in: https://www.hackerfactor.com/blog/index.php?/archives/529-Kind-of-Like-That.html
export function calculateHash(pixels: number[]) {
  const rowsNumber = 9;
  const columnsNumber = 8;

  let rowHash = 0;
  for (let i = 0; i < pixels.length; i += rowsNumber) {
    for (let j = 0; j < columnsNumber; j++) {
      const offset = i + j;

      const currentBit = Number(pixels[offset] <= pixels[offset + 1]);
      rowHash = (rowHash << 1) | currentBit;
    }
  }

  let colHash = 0;
  for (let i = 0; i < rowsNumber; i++) {
    for (let j = 0; j < pixels.length - rowsNumber; j += rowsNumber) {
      const offset = i + j;

      const currentBit = Number(pixels[offset] <= pixels[offset + 1]);
      colHash = (colHash << 1) | currentBit;
    }
  }

  colHash = colHash >>> 0;
  rowHash = rowHash >>> 0;

  const hash = colHash.toString(16) + rowHash.toString(16);

  if (hash.length < 16) {
    return '0000000000000000';
  }

  return hash;
}
