import { isValidCron } from '../parser';

export interface ScheduledJob {
  id: string;
  expression: string;
  callback: () => void | Promise<void>;
  lastRun?: Date;
  nextRun?: Date;
  enabled: boolean;
}

const jobs = new Map<string, ScheduledJob>();

export function getNextRunDate(expression: string, from: Date = new Date()): Date | null {
  if (!isValidCron(expression)) return null;

  const parts = expression.split(' ');
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  const next = new Date(from);
  next.setSeconds(0, 0);
  next.setMinutes(next.getMinutes() + 1);

  for (let i = 0; i < 366 * 24 * 60; i++) {
    if (
      matchesField(minute, next.getMinutes(), 0, 59) &&
      matchesField(hour, next.getHours(), 0, 23) &&
      matchesField(dayOfMonth, next.getDate(), 1, 31) &&
      matchesField(month, next.getMonth() + 1, 1, 12) &&
      matchesField(dayOfWeek, next.getDay(), 0, 6)
    ) {
      return next;
    }
    next.setMinutes(next.getMinutes() + 1);
  }

  return null;
}

export function matchesField(field: string, value: number, min: number, max: number): boolean {
  if (field === '*') return true;

  if (field.includes('/')) {
    const [, step] = field.split('/');
    return value % parseInt(step, 10) === 0;
  }

  if (field.includes('-')) {
    const [start, end] = field.split('-').map(Number);
    return value >= start && value <= end;
  }

  if (field.includes(',')) {
    return field.split(',').map(Number).includes(value);
  }

  return parseInt(field, 10) === value;
}

export function scheduleJob(id: string, expression: string, callback: () => void | Promise<void>): ScheduledJob | null {
  if (!isValidCron(expression)) return null;

  const job: ScheduledJob = {
    id,
    expression,
    callback,
    nextRun: getNextRunDate(expression) ?? undefined,
    enabled: true,
  };

  jobs.set(id, job);
  return job;
}

export function removeJob(id: string): boolean {
  return jobs.delete(id);
}

export function getJob(id: string): ScheduledJob | undefined {
  return jobs.get(id);
}

export function listJobs(): ScheduledJob[] {
  return Array.from(jobs.values());
}

export function toggleJob(id: string, enabled: boolean): boolean {
  const job = jobs.get(id);
  if (!job) return false;
  job.enabled = enabled;
  return true;
}
