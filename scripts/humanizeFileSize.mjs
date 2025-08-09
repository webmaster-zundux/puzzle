/**
 * @param {number} sizeInBytes - natural number in range 1 - Math.pow(1024^9)
 * @returns string - formatted size (e.g. "0.000 B", "112.515 KB", "20.419 PB")
 */
export const humanizeFileSize = (sizeInBytes = 0) => {
  const prefix = ["K", "M", "G", "T", "P", "E", "Z", "Y"];
  const size = Math.floor(sizeInBytes);

  if (!Number.isFinite(size) || size < 1) {
    return `0 B`;
  }

  let value = 0;
  let pow = 0;
  do {
    if (pow >= 8 + 2) {
      break;
    }
    value = size / Math.pow(1024, pow);
    pow++;
  } while (Math.floor(value) > 0 && pow >= 0);

  return `${(size / Math.pow(1024, pow - 2)).toFixed(3)} ${prefix[pow - 3] || ""}B`;
};
