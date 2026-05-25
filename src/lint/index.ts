/**
 * src/lint/index.ts
 * Public API for the cron linter module.
 */

import { lintCron, getLintMessages, LintResult, LintRule } from './cronLinter';

export { LintResult, LintRule };

/**
 * Lint a cron expression and return the full result.
 */
export function lintExpression(expression: string): LintResult {
  return lintCron(expression);
}

/**
 * Returns true if the expression passes linting with no errors.
 */
export function isClean(expression: string): boolean {
  const result = lintCron(expression);
  return result.valid && result.rules.filter((r) => r.severity === 'error').length === 0;
}

/**
 * Returns human-readable lint messages for the expression.
 */
export function getLintFeedback(expression: string): string[] {
  const result = lintCron(expression);
  return getLintMessages(result);
}

/**
 * Returns the lint quality score (0-100) for the expression.
 */
export function getLintScore(expression: string): number {
  return lintCron(expression).score;
}

/**
 * Returns only warning and error rules (ignores info-level).
 */
export function getSignificantIssues(expression: string): LintRule[] {
  return lintCron(expression).rules.filter((r) => r.severity !== 'info');
}
