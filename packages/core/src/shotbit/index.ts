import { strict as assert } from 'node:assert';
import ffmpeg from '../ffmpeg/index.js';
import { Frame } from '../frame/index.js';
import { Shot } from '../shot/index.js';
import { ShotbitOptions } from './types.js';
import {
  createDirIfNotExists,
  removeCachedDirectorySync,
  getFramePaths,
  removeAllGeneratedVideos,
} from './utils/index.js';

type RequiredShotbitOptions = Required<ShotbitOptions>;

const defaultOptions: Omit<RequiredShotbitOptions, 'videoPath' | 'outputPath'> =
  {
    similarityTreshold: 20,
    minLength: 5,
    noCache: false,
  };

export class Shotbit {
  private readonly options: RequiredShotbitOptions;

  constructor(options: ShotbitOptions) {
    this.options = Object.assign(defaultOptions, options);

    for (const event of [
      'SIGINT',
      'SIGUSR1',
      'SIGUSR2',
      'uncaughtException',
      'SIGTERM',
    ]) {
      process.on(event, this.cleanUp.bind(this));
    }
  }

  private cleanUp() {
    removeCachedDirectorySync(this.options.videoPath);
    removeAllGeneratedVideos(this.options.outputPath);
  }

  async getShots(): Promise<void> {
    try {
      assert.ok(await ffmpeg.isVideo(this.options.videoPath));
    } catch (err) {
      //TODO: emit error event
      process.exit(1);
    }

    await createDirIfNotExists(this.options.outputPath);

    const framePaths = await getFramePaths(this.options.videoPath, {
      noCache: this.options.noCache,
    });

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
