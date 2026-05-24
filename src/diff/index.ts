/**
 * diff/index.ts
 * Public API for the cron diff module.
 */

import { diffCron, getChangedFields, CronDiffResult, CronFieldDiff } from './cronDiff';

export type { CronDiffResult, CronFieldDiff };

/**
 * Compare two cron expressions and return a structured diff.
 */
export function compareCron(fromExpr: string, toExpr: string): CronDiffResult {
  return diffCron(fromExpr, toExpr);
}

/**
 * Returns true if two cron expressions are functionally identical.
 */
export function isSameCron(exprA: string, exprB: string): boolean {
  try {
    return !diffCron(exprA, exprB).hasChanges;
  } catch {
    return false;
  }
}

/**
 * Returns the list of field names that differ between two cron expressions.
 */
export function changedFields(fromExpr: string, toExpr: string): string[] {
  return getChangedFields(fromExpr, toExpr);
}
