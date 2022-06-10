// Check if the app is being run from a specified environment, or just return the running environment (dev, prod, test)
import { default as dayjs } from 'dayjs';

type Env = typeof process.env.NODE_ENV;

export function checkEnv(): string;
export function checkEnv(type: Env): boolean;
export function checkEnv(type?: Env | undefined) {
  const environment = process.env.NODE_ENV;
  if (type === undefined) return environment as string;
  return process.env.NODE_ENV === type;
}

export const formatDate = (date: number) =>
  dayjs.unix(date).format('MMM D, YYYY, H:mm:s');

export const formatTime = (time_s: number) => {
  const seconds = Math.floor(time_s % 60);
  let remainder = Math.floor(time_s / 60);
  const mins = Math.floor(remainder % 60);
  remainder = Math.floor(remainder / 60);
  const hours = Math.floor(remainder % 24);
  const days = Math.floor(remainder / 24);
  return days
    ? `${days}days ${hours}hrs ${mins}mins ${seconds}secs`
    : `${hours}hrs ${mins}mins ${seconds}secs`;
};
