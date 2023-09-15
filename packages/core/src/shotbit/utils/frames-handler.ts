import path from 'node:path';
import { mkdir, readdir, rm } from 'fs/promises';
import ffmpeg from '../../ffmpeg/index.js';
import { GetFramePathsOptions, VideoData } from './types';
import { tmpdir } from 'node:os';

function parseVideoData(videoPath: string): VideoData {
  const fileName = path.basename(videoPath);
  const videoName = path.parse(fileName).name;

  return {
    path: videoPath,
    fileName,
    videoName,
  };
}

export class FramesHandler {
  private readonly videoData: VideoData;

  constructor(
    private readonly videoPath: string,
    private readonly options: GetFramePathsOptions,
  ) {
    this.videoData = parseVideoData(videoPath);
  }

  private async getFramesDirectory(): Promise<string> {
    let framesDirectory: string;
    const cachedDirectory = await this.findCachedDirectory();
    
    if(cachedDirectory) {
      framesDirectory = cachedDirectory;
    }
    else {
      framesDirectory = await this.createFramesDirectory();
      await ffmpeg.extractFrames(this.videoData.path, framesDirectory);
    }

    return framesDirectory;
  }

  private async getCachedDirectoryNames(): Promise<string[]> {
    const directoryContent = await readdir(tmpdir(), { withFileTypes: true });

    const directoryNames = directoryContent
      .filter(
        (dirent) => dirent.isDirectory() && dirent.name.startsWith('shotbit'),
      )
      .map((dirent) => dirent.name);

    return directoryNames;
  }

  private async findCachedDirectory(): Promise<string | undefined> {
    if(this.options.noCache) {
      await this.removeCachedDirectory();
      return undefined;
    }

    const directoryNames = await this.getCachedDirectoryNames();

    const cachedDirectory = directoryNames.find(
      (directoryName) =>
        directoryName.split(/shotbit-/)[1] === this.videoData.videoName,
    );

    return cachedDirectory ? path.join(tmpdir(), cachedDirectory) : undefined;
  }

  async removeCachedDirectory(): Promise<void> {
    const videoData = parseVideoData(this.videoPath);

    const directoryContent = await readdir(tmpdir(), { withFileTypes: true });

    const cachedDirectories = directoryContent
      .filter(
        (dirent) =>
          dirent.isDirectory() &&
          dirent.name.startsWith('shotbit') &&
          dirent.name.split(/shotbit-/)[1] === videoData.videoName,
      )
      .map((dirent) => path.join(tmpdir(), dirent.name));

    await Promise.all(
      cachedDirectories.map((directoryPath) =>
        rm(directoryPath, { force: true, recursive: true }),
      ),
    );
  }

  private async createFramesDirectory(): Promise<string> {
    const directoryName = `shotbit-${this.videoData.videoName}`;
    const framesDirectory = path.join(tmpdir(), directoryName);
    await mkdir(framesDirectory);

    return framesDirectory;
  }

  async getFrames(): Promise<string[]> {
    const framesDirectory = await this.getFramesDirectory();

    const paths = (await readdir(framesDirectory))
      .map((framePath) => path.join(framesDirectory, framePath))
      .sort((a, b) => {
        a = path.basename(a);
        b = path.basename(b);

        const [aNumber] = a.match(/\d+/) as RegExpMatchArray;
        const [bNumber] = b.match(/\d+/) as RegExpMatchArray;

        return Number(aNumber) - Number(bNumber);
      });

    return paths;
  }
}
