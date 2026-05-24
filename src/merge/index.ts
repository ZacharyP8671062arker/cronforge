/**
 * merge/index.ts
 * Public API for the cron merge module.
 */

import { mergeCrons, cronOverlaps, MergeResult } from './cronMerge';

/**
 * Merges multiple cron expressions into a single unified expression.
 * Returns the merged expression string, or empty string on failure.
 */
export function mergeExpressions(expressions: string[]): string {
  const result = mergeCrons(expressions);
  return result.conflicts.length === 0 ? result.merged : '';
}

/**
 * Returns full merge details including conflicts and warnings.
 */
export function getMergeResult(expressions: string[]): MergeResult {
  return mergeCrons(expressions);
}

/**
 * Returns true if merging the given expressions produces no conflicts.
 */
export function canMerge(expressions: string[]): boolean {
  const result = mergeCrons(expressions);
  return result.conflicts.length === 0;
}

/**
 * Returns true if two cron expressions overlap (share potential trigger times).
 */
export function doExpressionsOverlap(a: string, b: string): boolean {
  return cronOverlaps(a, b);
}

export type { MergeResult };
