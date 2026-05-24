export { explainCron, compareCronExplanations } from './cronExplainer';
export type { CronExplanation } from './cronExplainer';

import { explainCron } from './cronExplainer';

/**
 * Returns a plain-text summary of a cron expression.
 */
export function summarizeCron(expression: string): string {
  const explanation = explainCron(expression);
  if (!explanation.isValid) {
    return `"${expression}" is not a valid cron expression.`;
  }
  const warningText =
    explanation.warnings.length > 0
      ? ` Warnings: ${explanation.warnings.join(' ')}`
      : '';
  return `${explanation.humanReadable}.${warningText}`;
}

/**
 * Returns true if the expression has any warnings.
 */
export function hasWarnings(expression: string): boolean {
  return explainCron(expression).warnings.length > 0;
}
