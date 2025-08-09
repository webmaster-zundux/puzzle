/**
 * @param {number} timeInMilliseconds - natural number
 * @returns string - formatted time (e.g. "0.000 seconds", "1 hour 1.000 second", "72 days 1 hour 12 minutes 3.100 seconds")
 */
export const humanizeTime = (timeInMilliseconds = 0) => {
  let time = Math.floor(timeInMilliseconds);

  if (!isFinite(time) || time < 1) {
    return "0.000 seconds";
  }

  const milliseconds = time % 1000;
  time -= milliseconds;
  time /= 1000;

  const seconds = time % 60;
  time -= seconds;
  time /= 60;

  const minutes = time % 60;
  time -= minutes;
  time /= 60;

  const hours = time % 24;
  time -= hours;
  time /= 24;

  const days = time;

  const timeStringParts = [
    days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "",
    hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "",
    minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "",
    `${seconds > 0 ? seconds : "0"}.${milliseconds.toString().padStart(3, "0")} second${seconds > 1 ? "s" : ""}`,
  ];

  return timeStringParts.filter((v) => v).join(" ");
};
