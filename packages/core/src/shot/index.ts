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

  isLargeEnough(): boolean {
    return Math.abs(this.startFrame.number - this.endFrame.number) >= 6;
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
