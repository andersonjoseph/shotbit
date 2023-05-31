import ffmpeg from 'fluent-ffmpeg';
import { mkdir, readdir, rm } from 'fs/promises';
import path from 'node:path';

const __dirname = new URL('.', import.meta.url).pathname;

function extractFramesFromVideo(
  videoPath: string,
  outputPath: string,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .addOutputOption('-r 1')
      .save(path.join(outputPath, '%01d.jpg'))
      .once('end', () => {
        resolve();
      })
      .once('error', (err: unknown) => {
        reject(err);
      });
  });
}

async function getCachedFramesDirectory(
  videoName: string,
): Promise<string | undefined> {
  const directoryContent = await readdir(__dirname, { withFileTypes: true });

  const tmpDirectoryNames = directoryContent
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const cachedFramesDirectory = tmpDirectoryNames.find(
    (directoryName) => directoryName.split('-')[1] === videoName,
  );

  if (cachedFramesDirectory) {
    const [timeStamp] = cachedFramesDirectory.split('-');

    const cacheDate = new Date(Number(timeStamp));

    if (new Date().getDate() - cacheDate.getDate() >= 1) {
      await rm(path.join(__dirname, cachedFramesDirectory), {
        force: true,
        recursive: true,
      });
      return undefined;
    }
  }
  return cachedFramesDirectory;
}

async function createFramesDirectory(videoName: string): Promise<string> {
  const directoryName = `${Date.now().toString()}-${videoName}`;
  const framesDirectory = path.join(__dirname, directoryName);
  await mkdir(framesDirectory);

  return framesDirectory;
}

async function getFramesDirectory(videoPath: string): Promise<string> {
  let directory: string;
  const videoName = path.basename(videoPath);

  const cachedFramesDirectory = await getCachedFramesDirectory(videoName);
  if (cachedFramesDirectory) {
    directory = path.join(__dirname, cachedFramesDirectory);
  } else {
    directory = await createFramesDirectory(videoName);
    await extractFramesFromVideo(videoPath, directory);
  }

  return directory;
}

export async function getFramePaths(videoPath: string) {
  const framesDirectory = await getFramesDirectory(videoPath);

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
