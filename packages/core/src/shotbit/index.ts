import { strict as assert } from 'node:assert';
import { Frame } from '../frame/index.js';
import { Shot } from '../shot/index.js';
import { getFramePaths } from './utils/index.js';

type ShotbitOptions = {
  videoPath: string;
  outputPath: string;
};

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
      );

      if (!frameIsInTheSameShot) {
        const shot = new Shot(referenceFrame, currentFrame);

        if (shot.isLargeEnough()) {
          shots.push(shot);
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
