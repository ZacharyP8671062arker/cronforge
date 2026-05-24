/**
 * cronRange.ts
 * Utilities for expanding and analyzing cron field ranges.
 */

export type CronField = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';

const FIELD_BOUNDS: Record<CronField, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 6 },
};

/**
 * Expands a single cron field expression into an array of matching numbers.
 */
export function expandField(expression: string, field: CronField): number[] {
  const { min, max } = FIELD_BOUNDS[field];
  const results = new Set<number>();

  for (const part of expression.split(',')) {
    if (part === '*') {
      for (let i = min; i <= max; i++) results.add(i);
    } else if (part.includes('/')) {
      const [rangeStr, stepStr] = part.split('/');
      const step = parseInt(stepStr, 10);
      const [rangeMin, rangeMax] =
        rangeStr === '*'
          ? [min, max]
          : rangeStr.split('-').map(Number);
      for (let i = rangeMin; i <= (rangeMax ?? rangeMin); i += step) {
        if (i >= min && i <= max) results.add(i);
      }
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        if (i >= min && i <= max) results.add(i);
      }
    } else {
      const val = parseInt(part, 10);
      if (!isNaN(val) && val >= min && val <= max) results.add(val);
    }
  }

  return Array.from(results).sort((a, b) => a - b);
}

/**
 * Returns the count of distinct values a field matches.
 */
export function fieldMatchCount(expression: string, field: CronField): number {
  return expandField(expression, field).length;
}

/**
 * Checks whether two field expressions overlap (share at least one value).
 */
export function fieldsOverlap(
  exprA: string,
  exprB: string,
  field: CronField
): boolean {
  const setA = new Set(expandField(exprA, field));
  return expandField(exprB, field).some((v) => setA.has(v));
}

/**
 * Returns the intersection of values matched by two field expressions.
 */
export function fieldIntersection(
  exprA: string,
  exprB: string,
  field: CronField
): number[] {
  const setA = new Set(expandField(exprA, field));
  return expandField(exprB, field).filter((v) => setA.has(v));
}
