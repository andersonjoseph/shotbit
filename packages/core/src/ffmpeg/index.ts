import ffmpeg from 'fluent-ffmpeg';
import path from 'node:path';
import { Shot } from '../shot/index.js';

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

function exportShots(
  shots: Shot[],
  videoPath: string,
  outputPath: string,
): Promise<void> {
  const videoFileName = path.basename(videoPath);
  const videoName = path.parse(videoFileName).name;

  const ffmpegCommand = ffmpeg(videoPath);

  for (const indexShot in shots) {
    ffmpegCommand
      .addOutput(path.join(outputPath, `shotbit-${videoName}-${indexShot}.mp4`))
      .addOutputOption(`-ss ${shots[indexShot].startFrame.number}.0`)
      .addOutputOption('-c:v libx264')
      .addOutputOption('-crf 18')
      .addOutputOption(`-to ${shots[indexShot].endFrame.number - 3}.0`)
      .addOutputOption(`-y`)
      .addOutputOption('-an');
  }

  return new Promise<void>((resolve, reject) => {
    ffmpegCommand.once('end', () => {
      resolve();
    });
    ffmpegCommand.once('error', (err) => {
      reject(err);
    });

    ffmpegCommand.run();
  });
}

function isVideo(filePath: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    ffmpeg(filePath).ffprobe((err, data) => {
      if (err) {
        reject(err);
      }

      resolve(
        data.format.format_name !== undefined &&
          !data.format.format_name.includes('pipe') &&
          data.streams.some((stream) => stream.codec_type === 'video'),
      );
    });
  });
}

export default {
  extractFrames,
  isVideo,
  exportShots,
};
