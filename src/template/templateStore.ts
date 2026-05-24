/**
 * templateStore.ts
 * In-memory store for managing named cron templates.
 */

import { CronTemplate, createTemplate } from './cronTemplate';

const store = new Map<string, CronTemplate>();

export function registerTemplate(
  name: string,
  template: string,
  description?: string
): CronTemplate {
  const cronTemplate = createTemplate(name, template, description);
  store.set(name, cronTemplate);
  return cronTemplate;
}

export function getTemplate(name: string): CronTemplate | undefined {
  return store.get(name);
}

export function listTemplates(): CronTemplate[] {
  return Array.from(store.values());
}

export function removeTemplate(name: string): boolean {
  return store.delete(name);
}

export function clearTemplates(): void {
  store.clear();
}

export function hasTemplate(name: string): boolean {
  return store.has(name);
}

// Seed some built-in templates
registerTemplate(
  'daily-at-hour',
  '0 {{hour}} * * *',
  'Run daily at a specific hour'
);

registerTemplate(
  'weekly-on-day',
  '0 {{hour}} * * {{day}}',
  'Run weekly on a specific day at a given hour'
);

registerTemplate(
  'monthly-on-date',
  '0 {{hour}} {{date}} * *',
  'Run monthly on a specific date'
);

registerTemplate(
  'every-n-minutes',
  '*/{{interval}} * * * *',
  'Run every N minutes'
);
