export const time = {
  secondToMillisecond: (seconds: number) => seconds * 1000,
  minuteToMillisecond: (minutes: number) => minutes * 60 * 1000,
  hourToMillisecond: (hours: number) => hours * 60 * 60 * 1000,
  dayToMillisecond: (days: number) => days * 24 * 60 * 60 * 1000,
};
