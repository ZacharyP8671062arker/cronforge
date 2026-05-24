export interface CronPreset {
  name: string;
  description: string;
  expression: string;
  tags: string[];
}

export const CRON_PRESETS: CronPreset[] = [
  {
    name: 'every-minute',
    description: 'Every minute',
    expression: '* * * * *',
    tags: ['frequent', 'minute'],
  },
  {
    name: 'every-hour',
    description: 'Every hour',
    expression: '0 * * * *',
    tags: ['frequent', 'hour'],
  },
  {
    name: 'daily-midnight',
    description: 'Every day at midnight',
    expression: '0 0 * * *',
    tags: ['daily', 'midnight'],
  },
  {
    name: 'daily-noon',
    description: 'Every day at noon',
    expression: '0 12 * * *',
    tags: ['daily', 'noon'],
  },
  {
    name: 'weekdays-9am',
    description: 'Every weekday at 9am',
    expression: '0 9 * * 1-5',
    tags: ['weekday', 'business-hours'],
  },
  {
    name: 'weekly-sunday',
    description: 'Every Sunday at midnight',
    expression: '0 0 * * 0',
    tags: ['weekly', 'sunday'],
  },
  {
    name: 'monthly-first',
    description: 'First day of every month at midnight',
    expression: '0 0 1 * *',
    tags: ['monthly'],
  },
  {
    name: 'yearly-jan1',
    description: 'January 1st at midnight',
    expression: '0 0 1 1 *',
    tags: ['yearly', 'annual'],
  },
  {
    name: 'every-15-minutes',
    description: 'Every 15 minutes',
    expression: '*/15 * * * *',
    tags: ['frequent', 'interval'],
  },
  {
    name: 'every-6-hours',
    description: 'Every 6 hours',
    expression: '0 */6 * * *',
    tags: ['interval', 'hour'],
  },
];

export function getPresetByName(name: string): CronPreset | undefined {
  return CRON_PRESETS.find((p) => p.name === name);
}

export function getPresetsByTag(tag: string): CronPreset[] {
  return CRON_PRESETS.filter((p) => p.tags.includes(tag));
}

export function searchPresets(query: string): CronPreset[] {
  const lower = query.toLowerCase();
  return CRON_PRESETS.filter(
    (p) =>
      p.name.includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.tags.some((t) => t.includes(lower))
  );
}
