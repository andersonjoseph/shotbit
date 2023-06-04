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

let i = 0;
function exportVideoFragment(
  videoPath: string,
  outputPath: string,
  startTime: number,
  endTime: number,
): Promise<void> {
  const videoFileName = path.basename(videoPath);
  const videoName = path.parse(videoFileName).name;

  return new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .addOutputOption(`-ss ${startTime}.0`)
      .addOutputOption('-c:v libx264')
      .addOutputOption('-crf 18')
      .addOutputOption(`-to ${endTime}.0`)
      .addOutputOption(`-y`)
      .addOutputOption('-an')
      .save(path.join(outputPath, `${videoName}-${i++}.mp4`))
      .once('end', () => {
        resolve();
      })
      .once('error', (err) => {
        reject(err);
      });
  });
}

export default {
  extractFrames,
  exportVideoFragment,
};
