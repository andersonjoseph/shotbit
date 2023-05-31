import { strict as assert } from 'node:assert';
import { Frame } from '../frame/index.js';
import { Shot } from '../shot/index.js';
import { ShotbitOptions } from './types.js';
import { getFramePaths } from './utils/index.js';

export class Shotbit {
  constructor(private readonly options: ShotbitOptions) {}

  async getShots(): Promise<void> {
    const framePaths = await getFramePaths(this.options.videoPath);

    const referenceFramePath = framePaths.shift();
    assert.ok(referenceFramePath);

    let referenceFrame = new Frame(referenceFramePath);

    const shots: Shot[] = [];

    for (let i = 0; i < framePaths.length; i++) {
      const currentFramePath = framePaths[i];
      const currentFrame = new Frame(currentFramePath);

      const frameIsInTheSameShot = await referenceFrame.isSimilarTo(
        currentFrame,
        this.options.similarityTreshold,
      );

      if (!frameIsInTheSameShot) {
        const currentShot = new Shot(referenceFrame, currentFrame);

        if (currentShot.isLargeEnough(this.options.minLength)) {
          const lastShot = shots[shots.length - 1];
          if (lastShot && currentShot.isContinuationOf(lastShot)) {
            shots[shots.length - 1] = new Shot(
              lastShot.startFrame,
              currentShot.endFrame,
            );
          } else {
            shots.push(currentShot);
          }
        }

        referenceFrame = currentFrame;
      }
    }

    await Promise.all(
      shots.map((shot) =>
        shot.export(this.options.videoPath, this.options.outputPath),
      ),
    );
  }
}
