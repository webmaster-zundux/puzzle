import archiver from "archiver";
import fs from "fs";
import { humanizeFileSize } from "./humanizeFileSize.mjs";
import { humanizeTime } from "./humanizeTime.mjs";
import { toLocaleIsoString } from "./toLocaleIsoString.mjs";

export const compress = async (
  filenamePrefix = "source",
  withNodeModulesDirectory = false,
  withGitDirectory = false,
  printProgress = false,
  printProcessedFileNames = false,
) =>
  new Promise((resolve, reject) => {
    const startDatetimeMark = new Date();
    const startTime = startDatetimeMark;
    const fileCreationDatetimeMark = toLocaleIsoString(startDatetimeMark).replace(/:/gi, "-");

    const outputFilename = `./${filenamePrefix} - ${fileCreationDatetimeMark}.zip`;
    const output = fs.createWriteStream(outputFilename);
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    let originalFileSizeInBytes = 0;
    let globalProgress = {
      processed: 0,
      total: 0,
      directories: 0,
      files: 0,
    };

    output.on("close", function () {
      if (printProcessedFileNames) {
        console.log("");
      }
      console.log(`processed entries: ${globalProgress.processed}/${globalProgress.total}`);

      console.log(`processed directories: ${globalProgress.directories}`);
      console.log(`processed files: ${globalProgress.files}`);

      const endTime = new Date();
      const time = humanizeTime(endTime.getTime() - startTime.getTime());
      console.log(`processing took ${time}`);
      console.log(
        `total size of original files: ${humanizeFileSize(originalFileSizeInBytes)} (${originalFileSizeInBytes} total bytes)`,
      );

      console.log("");
      console.log(`output file "${outputFilename.substring(2)}" was created`);

      const fileSizeInBytes = archive.pointer();
      console.log(`output file size: ${humanizeFileSize(fileSizeInBytes)} (${fileSizeInBytes} total bytes)`);

      resolve();
    });

    output.on("end", function () {
      console.log("Data has been drained");
    });

    archive.on("warning", function (err) {
      console.warn("warning", err);
    });

    archive.on("error", function (err) {
      reject(err);
    });

    archive.on("entry", function (entry) {
      const entrySize = entry.stats.size;

      if (printProcessedFileNames) {
        console.log(`${entry.name} (${humanizeFileSize(entrySize)})`);
      }

      if (entry.stats.isDirectory()) {
        globalProgress.directories += 1;
      } else if (entry.stats.isFile()) {
        globalProgress.files += 1;
      }

      originalFileSizeInBytes += entrySize;
    });

    archive.on("progress", function (progress) {
      const processed = progress.entries.processed;
      const total = progress.entries.total;
      const processedBytes = humanizeFileSize(progress.fs.processedBytes);
      const totalBytes = humanizeFileSize(progress.fs.totalBytes);

      globalProgress.processed = progress.entries.processed;
      globalProgress.total = progress.entries.total;

      if (printProgress) {
        console.log(`processed ${processed}/${total} (${processedBytes}/${totalBytes})`);
        console.log("");
      }
    });

    archive.pipe(output);

    const nodeModulesDirectory = "**/node_modules";
    const gitDirectory = ".git";

    let ignoreRules = ["*.zip", "**/*-snapshots/**/*.png"];
    let ignoreFolderRules = ["**/playwright-report", "**/test-results", "**/.ssl", "**/dist", '**/build', "**/coverage"];

    if (!withNodeModulesDirectory) {
      ignoreFolderRules.push(nodeModulesDirectory);
    }

    if (!withGitDirectory) {
      ignoreFolderRules.push(gitDirectory);
    }

    archive.glob("**/*", {
      dot: true,
      ignore: ignoreRules,
      skip: ignoreFolderRules,
    });

    archive.finalize();
  });
