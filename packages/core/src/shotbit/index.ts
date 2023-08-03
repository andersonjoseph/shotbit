import { strict as assert } from 'node:assert';
import EventEmitter from 'node:events';
import ffmpeg from '../ffmpeg/index.js';
import { Frame } from '../frame/index.js';
import { Shot } from '../shot/index.js';
import { ShotbitEvents, ShotbitOptions } from './types.js';
import {
  createDirIfNotExists,
  getFramePaths,
  removeAllGeneratedVideos,
  isValidVideo,
  assignDefined,
  mapSimilarityTreshold,
  removeCachedDirectory,
} from './utils/index.js';

type RequiredShotbitOptions = Required<ShotbitOptions>;

const defaultOptions: Omit<RequiredShotbitOptions, 'videoPath' | 'outputPath'> =
  {
    similarityTreshold: 0,
    minLength: 5,
    noCache: false,
  };

// Typed event emitter
export interface Shotbit {
  on: <T extends keyof ShotbitEvents>(
    eventName: T,
    cb: ShotbitEvents[T],
  ) => this;
  emit: <T extends keyof ShotbitEvents>(
    name: T,
    ...args: Parameters<ShotbitEvents[T]>
  ) => boolean;
}

export class Shotbit extends EventEmitter {
  private readonly options: RequiredShotbitOptions;

  constructor(options: ShotbitOptions) {
    super();

    this.options = assignDefined(defaultOptions, options);

    try {
      this.options.similarityTreshold = mapSimilarityTreshold(
        this.options.similarityTreshold,
      );
    } catch (err) {
      if (err instanceof Error) {
        this.emit('error', err);
      }
      return;
    }

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

  private async cleanUp() {
    await removeCachedDirectory(this.options.videoPath);
    await removeAllGeneratedVideos(this.options.outputPath);
  }

  async getShots(): Promise<void> {
    try {
      assert.ok(
        await isValidVideo(this.options.videoPath),
        'input file must be a valid video',
      );
    } catch (err) {
      if (err instanceof Error) {
        this.emit('error', err);
      }

      throw err;
    }

    this.emit('started');

    await createDirIfNotExists(this.options.outputPath);

    this.emit('startedRetrievingFrames');

    const framePaths = await getFramePaths(this.options.videoPath, {
      noCache: this.options.noCache,
    });

    this.emit('framesRetrieved', framePaths);

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

    this.emit('startedExportingShots');

    await ffmpeg.exportShots(
      shots,
      this.options.videoPath,
      this.options.outputPath,
    );

    this.emit('shotsExported');

    this.emit('finished');
  }
}
