import { strict as assert } from 'node:assert';
import { exportVideoFragment } from './utils/index.js';
import { Frame } from '../frame/index.js';

export class Shot {
  constructor(
    public readonly startFrame: Frame,
    public readonly endFrame: Frame,
  ) {
    assert.ok(
      startFrame.number < endFrame.number,
      'endFrame must be ahead of startFrame',
    );
  }

  isLargeEnough(minLength = 6): boolean {
    return Math.abs(this.startFrame.number - this.endFrame.number) >= minLength;
  }

  isContinuationOf(previousShot: Shot): boolean {
    return previousShot.endFrame.number + 1 === this.startFrame.number;
  }

  async export(videoPath: string, outputPath: string): Promise<void> {
    await exportVideoFragment(
      videoPath,
      outputPath,
      this.startFrame.number,
      this.endFrame.number - 3,
    );
  }
}
