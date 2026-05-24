import { listJobs, getNextRunDate, ScheduledJob } from './cronScheduler';

let intervalHandle: ReturnType<typeof setInterval> | null = null;

function tickJobs(): void {
  const now = new Date();
  const jobs = listJobs();

  for (const job of jobs) {
    if (!job.enabled) continue;

    const next = job.nextRun;
    if (!next) continue;

    const diffMs = Math.abs(now.getTime() - next.getTime());
    if (diffMs <= 30000) {
      job.lastRun = new Date();
      job.nextRun = getNextRunDate(job.expression, now) ?? undefined;

      try {
        const result = job.callback();
        if (result instanceof Promise) {
          result.catch((err: unknown) => {
            console.error(`[cronforge] Job "${job.id}" threw an async error:`, err);
          });
        }
      } catch (err) {
        console.error(`[cronforge] Job "${job.id}" threw a sync error:`, err);
      }
    }
  }
}

export function startRunner(intervalMs = 60000): void {
  if (intervalHandle !== null) return;
  intervalHandle = setInterval(tickJobs, intervalMs);
  console.info('[cronforge] Scheduler runner started.');
}

export function stopRunner(): void {
  if (intervalHandle === null) return;
  clearInterval(intervalHandle);
  intervalHandle = null;
  console.info('[cronforge] Scheduler runner stopped.');
}

export function isRunnerActive(): boolean {
  return intervalHandle !== null;
}

export { tickJobs as _tickJobsForTesting };
