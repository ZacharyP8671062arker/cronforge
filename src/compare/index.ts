/**
 * compare/index.ts
 * Public API for the cronCompare module.
 */

import {
  compareCronExpressions,
  CronCompareResult,
  compareFields,
  similarityScore,
  splitExpression,
} from './cronCompare';

export { CronCompareResult };

/**
 * Returns a full structured comparison between two cron expressions.
 */
export function getCompareResult(
  a: string,
  b: string
): CronCompareResult {
  return compareCronExpressions(a, b);
}

/**
 * Returns true if the two expressions are identical.
 */
export function areIdentical(a: string, b: string): boolean {
  return a.trim() === b.trim();
}

/**
 * Returns a 0.0–1.0 similarity score between two cron expressions.
 */
export function getSimilarityScore(a: string, b: string): number {
  const { matching } = compareFields(a, b);
  return similarityScore(matching.length, 5);
}

/**
 * Returns the list of field names that differ between the two expressions.
 */
export function getDifferingFields(a: string, b: string): string[] {
  return compareFields(a, b).differing;
}

/**
 * Returns the list of field names that match between the two expressions.
 */
export function getMatchingFields(a: string, b: string): string[] {
  return compareFields(a, b).matching;
}
