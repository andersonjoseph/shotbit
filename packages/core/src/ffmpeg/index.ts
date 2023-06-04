import ffmpeg from 'fluent-ffmpeg';
import path from 'node:path';

async function extractFrames(
  videoPath: string,
  outputPath: string,
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
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

export default {
  extractFrames,
};
