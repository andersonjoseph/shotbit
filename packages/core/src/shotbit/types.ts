export type ShotbitOptions = {
  videoPath: string;
  outputPath: string;
  similarityTreshold?: number;
  minLength?: number;
  noCache?: boolean;
};

export type ShotbitEvents = {
  started: () => void;
  finished: () => void;
  error: (err: Error) => void;
  startedRetrievingFrames: () => void;
  framesRetrieved: (framePaths: string[]) => void;
  startedExportingShots: () => void;
  shotsExported: () => void;
};
