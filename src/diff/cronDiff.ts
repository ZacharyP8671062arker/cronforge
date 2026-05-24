/**
 * cronDiff.ts
 * Compares two cron expressions and returns a human-readable diff.
 */

import { parseCron } from '../parser/cronParser';
import { describeField, describeMonth, describeDayOfWeek } from '../humanizer/humanizer';

export interface CronFieldDiff {
  field: string;
  from: string;
  to: string;
  fromDescription: string;
  toDescription: string;
  changed: boolean;
}

export interface CronDiffResult {
  fields: CronFieldDiff[];
  hasChanges: boolean;
  summary: string;
}

const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

function describeByField(field: string, value: string): string {
  if (field === 'month') return describeMonth(value);
  if (field === 'dayOfWeek') return describeDayOfWeek(value);
  return describeField(value, field);
}

export function diffCron(fromExpr: string, toExpr: string): CronDiffResult {
  const fromParts = parseCron(fromExpr);
  const toParts = parseCron(toExpr);

  if (!fromParts || !toParts) {
    throw new Error('Invalid cron expression provided to diffCron');
  }

  const fromValues = [fromParts.minute, fromParts.hour, fromParts.dayOfMonth, fromParts.month, fromParts.dayOfWeek];
  const toValues = [toParts.minute, toParts.hour, toParts.dayOfMonth, toParts.month, toParts.dayOfWeek];

  const fields: CronFieldDiff[] = FIELD_NAMES.map((name, i) => {
    const from = fromValues[i];
    const to = toValues[i];
    return {
      field: name,
      from,
      to,
      fromDescription: describeByField(name, from),
      toDescription: describeByField(name, to),
      changed: from !== to,
    };
  });

  const changedFields = fields.filter(f => f.changed);
  const hasChanges = changedFields.length > 0;

  const summary = hasChanges
    ? changedFields.map(f => `${f.field}: "${f.fromDescription}" → "${f.toDescription}"`).join('; ')
    : 'No changes between expressions';

  return { fields, hasChanges, summary };
}

export function getChangedFields(fromExpr: string, toExpr: string): string[] {
  return diffCron(fromExpr, toExpr).fields.filter(f => f.changed).map(f => f.field);
}
