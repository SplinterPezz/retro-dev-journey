const MS_PER_CENTISECOND = 10;
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;

const pad = (n: number) => String(n).padStart(2, '0');

// Like a timed race: 15'30,20 (min'sec,hundredths), with the hours in front once there is one: 1'15'30,20.
export const formatElapsed = (ms: number): string => {
  const hours = Math.floor(ms / MS_PER_HOUR);
  const minutes = Math.floor((ms % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((ms % MS_PER_MINUTE) / MS_PER_SECOND);
  const hundredths = Math.floor((ms % MS_PER_SECOND) / MS_PER_CENTISECOND);
  const clock = `${pad(seconds)},${pad(hundredths)}`;
  return hours > 0 ? `${hours}'${pad(minutes)}'${clock}` : `${minutes}'${clock}`;
};
