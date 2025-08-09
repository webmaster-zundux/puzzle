const getDefaultHumanizeTimeOptions = (): Required<HumanizeTimeOptions> => ({
  milliseconds: false,
  seconds: true,
  minutes: true,
  hours: true,
  days: true,
});

export type HumanizeTimeOptions = {
  milliseconds?: boolean;
  seconds?: boolean;
  minutes?: boolean;
  hours?: boolean;
  days?: boolean;
};

export const humanizeTime = (
  timeInMilliseconds?: number,
  options: HumanizeTimeOptions = getDefaultHumanizeTimeOptions(),
): string => {
  let time = timeInMilliseconds;
  if (!time || time < 0 || isNaN(time)) {
    return "0:00";
  }

  const printOptions: Required<HumanizeTimeOptions> = {
    ...getDefaultHumanizeTimeOptions(),
    ...options,
  };

  let timeString = "";

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
    printOptions.days && days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "",
    days > 0 ? " " : "",
    printOptions.hours && hours > 0 ? (days > 0 ? `${hours.toString().padStart(2, "0")}` : `${hours}`) : "",
    hours > 0 || days > 0 ? ":" : "",
    printOptions.minutes ? (hours > 0 || days > 0 ? `${minutes.toString().padStart(2, "0")}` : `${minutes}`) : "",
    printOptions.seconds ? ":" : "",
    printOptions.seconds ? `${seconds.toString().padStart(2, "0")}` : "",
    printOptions.milliseconds ? "." : "",
    printOptions.milliseconds ? `${milliseconds.toString().padStart(3, "0")}` : "",
  ];

  timeString = timeStringParts.join("");

  return timeString;
};

/**
 * Returns string representation of elapsed time
 *
 * Example: "PT2W28D23H4M21.240S"
 *
 * More: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-duration-string
 *
 * @param timeInMilliseconds time in milliseconds
 * @param options {precisionToSeconds: false}
 * @returns string
 */
export const getDutarionStringForTimeHtmlElement = (
  timeInMilliseconds?: number,
  options?: { accuracyDownToSeconds: boolean },
): string => {
  let time = timeInMilliseconds;
  if (!time || time < 0 || isNaN(time)) {
    return "PT0S";
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

  const days = time % 7;
  time -= days;
  time /= 7;

  const weeks = time;

  const { accuracyDownToSeconds = false } = options || {};

  const durationTimeString = [
    "PT",
    weeks > 0 ? `${weeks}W ` : "",
    days > 0 ? `${days}D ` : "",
    hours > 0 ? `${hours}H ` : "",
    minutes > 0 ? `${minutes}M` : "",
    accuracyDownToSeconds
      ? seconds > 0
        ? `${seconds}S`
        : "0S"
      : seconds > 0
        ? `${seconds}${milliseconds > 0 ? `.${milliseconds}` : ""}S`
        : milliseconds > 0
          ? `.${milliseconds}S`
          : "",
  ].join("");

  return durationTimeString;
};
