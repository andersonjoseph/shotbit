import ffmpeg from 'fluent-ffmpeg';
import path from 'node:path';

let i = 0;
export function exportVideoFragment(
  videoPath: string,
  outputPath: string,
  startTime: number,
  endTime: number,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .addOutputOption(`-ss ${startTime}.0`)
      .addOutputOption(`-to ${endTime}.0`)
      .addOutputOption(`-y`)
      .addOutputOption('-c copy')
      .addOutputOption('-an')
      .save(path.join(outputPath, `${i++}.mp4`))
      .once('end', () => {
        resolve();
      })
      .once('error', (err) => {
        reject(err);
      });
  });
}
