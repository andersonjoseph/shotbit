# Shotbit

Shotbit is a NodeJS tool that allows you to extract movie scenes/shots easily.

![shotbit example](./cover.gif)

## Getting Started

To install Shotbit, run the following commands:

```sh
git clone git@github.com:andersonjoseph/shotbit.git
cd shotbit
pnpm install
```

## Usage

### CLI

To use Shotbit CLI, run the following command:

```
pnpm cli -i <video-file> -o <output-path>
```

The following options are available:

| Option               | Description                                                                                                                                                                                                                                                                                                 | Default  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| -o, --output         | Save the extracted scene or shot to the specified file.                                                                                                                                                                                                                                                     | Required |
| -i, --input          | Set the resolution of the extracted scene or shot.                                                                                                                                                                                                                                                          | Required |
| --similarityTreshold | The similarity threshold parameter controls how similar the shots in a scene must be in order to be considered part of the same scene. A higher value will result in more scenes being extracted, while a lower value will result in fewer scenes being extracted. This parameter should be between 0 and 1 | 0        |
| --minLength          | Set the minimum length of a shot in seconds. Shots shorter than the specified length will be ignored.                                                                                                                                                                                                       | 5        |
| --noCache            | The no cache parameter controls whether or not the tool should use cached frames. If set, the tool will re-process all frames. This can be useful for debugging, but it can also slow down the process.                                                                                                     | false    |

### Shotbit Class

The Shotbit class is the core class of Shotbit. It is used to generate and export shots and scenes. The class has a number of methods that allow you to control the generation and export process.

---

#### `new Shotbit(options: ShotbitOptions)`

The Shotbit constructor is used to create a new Shotbit instance to export shots from videos. The options parameter is a `ShotbitOptions` object that specifies the options for the Shotbit instance.

#### `ShotbitOptions`

| Option             | Type    | Description                                           | Default  |
| ------------------ | ------- | ----------------------------------------------------- | -------- |
| videoPath          | string  | The path to the input video file.                     | Required |
| outputPath         | string  | The path to the output directory.                     | Required |
| similarityTreshold | number  | The similarity threshold for shot detection.          | 0        |
| minLength          | number  | The minimum length of a shot in seconds.              | 5        |
| noCache            | boolean | Whether to disable caching of shot detection results. | false    |

#### Example

```typescript
import { Shotbit, ShotbitOptions } from 'shotbit';

const options: ShotbitOptions = {
  videoPath: 'input.mp4',
  outputPath: 'output',
  similarityTreshold: 0.5,
  minLength: 10,
  noCache: true,
};

const shotbit = new Shotbit(options);
```

---

#### `Shotbit.getShots(): Promise<void>`

The `getShots()` method begins the process of extracting shots from a video. It returns a void Promise that will be resolved when the extraction process is complete.

---

#### `Shotbit.on(eventName: keyof ShotbitEvents)`

The Shotbit class supports a list of events that fire when a process has begun or completed. These events can be used to track the progress of the Shotbit and to respond to events such as the completion of a process.

Here is a list of the events that the Shotbit class supports:

| Event                     | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| `started`                 | Shotbit process has started.                                 |
| `finished`                | Shotbit process has finished running.                        |
| `error`                   | An error has occurred.                                       |
| `startedRetrievingFrames` | The process of retrieving frames from a video has begun.     |
| `framesRetrieved`         | The process of retrieving frames from a video has completed. |
| `startedExportingShots`   | The process of exporting shots from a video has begun.       |
| `shotsExported`           | The process of exporting shots from a video has completed.   |

#### Example

```typescript
shotbit.on('startedExportingShots', () => {
  // The shots extraction process has begun.
});
```

---
