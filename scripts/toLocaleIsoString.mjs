export const toLocaleIsoString = (datetime = new Date()) => {
  const timeZoneOffset = datetime.getTimezoneOffset();
  const offsetSign = Math.sign(timeZoneOffset);
  const offsetSignSymbol = offsetSign > 0 ? "-" : offsetSign < 0 ? "+" : "";
  const offsetHours = Math.abs(Math.floor(timeZoneOffset / 60))
    .toString()
    .padStart(2, "0");
  const offsetMinutes = (timeZoneOffset % 60).toString().padStart(2, "0");
  const timeZoneString = timeZoneOffset === 0 ? "Z" : `${offsetSignSymbol}${offsetHours}:${offsetMinutes}`;

  const datetimeString = [
    datetime.getFullYear().toString().padStart(4, "0"),
    "-",
    (datetime.getMonth() + 1).toString().padStart(2, "0"),
    "-",
    datetime.getDate().toString().padStart(2, "0"),
    "T",
    datetime.getHours().toString().padStart(2, "0"),
    ":",
    datetime.getMinutes().toString().padStart(2, "0"),
    ":",
    datetime.getSeconds().toString().padStart(2, "0"),
    ".",
    datetime.getMilliseconds().toString().padStart(3, "0"),
    timeZoneString,
  ].join("");
  return datetimeString;
};
