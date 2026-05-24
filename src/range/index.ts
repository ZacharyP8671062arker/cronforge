/**
 * Public API for the cronRange module.
 */

import {
  expandField,
  fieldMatchCount,
  fieldsOverlap,
  fieldIntersection,
  CronField,
} from './cronRange';

export type { CronField };

/**
 * Expand a cron field expression into all matching numeric values.
 * @example expandCronField('1-5', 'minute') // [1,2,3,4,5]
 */
export function expandCronField(expression: string, field: CronField): number[] {
  return expandField(expression, field);
}

/**
 * Returns how many distinct values a cron field expression matches.
 */
export function countMatches(expression: string, field: CronField): number {
  return fieldMatchCount(expression, field);
}

/**
 * Returns true if two field expressions share at least one matching value.
 */
export function doFieldsOverlap(
  exprA: string,
  exprB: string,
  field: CronField
): boolean {
  return fieldsOverlap(exprA, exprB, field);
}

/**
 * Returns the shared values between two field expressions.
 */
export function getFieldIntersection(
  exprA: string,
  exprB: string,
  field: CronField
): number[] {
  return fieldIntersection(exprA, exprB, field);
}
