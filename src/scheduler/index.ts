export {
  scheduleJob,
  removeJob,
  getJob,
  listJobs,
  toggleJob,
  getNextRunDate,
  matchesField,
} from './cronScheduler';

export type { ScheduledJob } from './cronScheduler';

/**
 * Returns a human-readable summary of when a cron expression will next run.
 * @param expression - A valid cron expression
 * @param from - Optional reference date (defaults to now)
 */
export function describeNextRun(expression: string, from?: Date): string {
  const { getNextRunDate } = require('./cronScheduler');
  const next = getNextRunDate(expression, from);
  if (!next) return 'Invalid cron expression';

  const now = from ?? new Date();
  const diffMs = next.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 60) return `Next run in ${diffMins} minute(s)`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Next run in ${diffHours} hour(s)`;
  const diffDays = Math.floor(diffHours / 24);
  return `Next run in ${diffDays} day(s)`;
}
