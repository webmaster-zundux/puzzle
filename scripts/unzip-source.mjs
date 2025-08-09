import decompress from "decompress";
import { toLocaleIsoString } from "./toLocaleIsoString.mjs";
import { humanizeFileSize } from "./humanizeFileSize.mjs";
import { humanizeTime } from "./humanizeTime.mjs";

const unzipSource = async (printProcessedFileNames = false) =>
  new Promise((resolve) => {
    decompress("source.zip", ".").then((entries) => {
      const startDatetimeMark = new Date();
      const startTime = startDatetimeMark;
      console.log('"source.zip" decompressed to "." folder');

      if (printProcessedFileNames) {
        console.log("");
      }

      let directories = 0;
      let files = 0;
      entries.map((entry) => {
        if (entry.type === "directory") {
          directories += 1;
        } else if (entry.type === "file") {
          files += 1;
        }

        if (printProcessedFileNames) {
          console.log(
            `${toLocaleIsoString(entry.mtime)} ${entry.path} ${entry.type} ${humanizeFileSize(entry.data.byteLength)}`,
          );
        }
      });

      if (printProcessedFileNames) {
        console.log("");
      }

      console.log(`entries: ${entries.length}`);
      console.log(`directories: ${directories}`);
      console.log(`files: ${files}`);

      const endTime = new Date();
      const time = humanizeTime(endTime.getTime() - startTime.getTime());
      console.log(`processing took ${time}`);

      resolve();
    });
  });

await unzipSource();
