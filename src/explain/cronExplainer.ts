import { parseCron } from '../parser/cronParser';
import { humanizeCron } from '../humanizer/humanizer';
import { diffCron } from '../diff/cronDiff';

export interface CronExplanation {
  expression: string;
  isValid: boolean;
  fields: {
    minute: string;
    hour: string;
    dayOfMonth: string;
    month: string;
    dayOfWeek: string;
  };
  humanReadable: string;
  nextRunHint: string;
  warnings: string[];
}

export function explainCron(expression: string): CronExplanation {
  const warnings: string[] = [];
  let isValid = true;
  let parsed: ReturnType<typeof parseCron> | null = null;

  try {
    parsed = parseCron(expression);
  } catch {
    isValid = false;
  }

  if (parsed && parsed.dayOfMonth !== '*' && parsed.dayOfWeek !== '*') {
    warnings.push('Both day-of-month and day-of-week are set; behavior may vary by system.');
  }

  if (parsed && parsed.minute === '*' && parsed.hour === '*') {
    warnings.push('Expression runs every minute — ensure this is intentional.');
  }

  const humanReadable = isValid ? humanizeCron(expression) : 'Invalid expression';

  return {
    expression,
    isValid,
    fields: parsed
      ? {
          minute: parsed.minute,
          hour: parsed.hour,
          dayOfMonth: parsed.dayOfMonth,
          month: parsed.month,
          dayOfWeek: parsed.dayOfWeek,
        }
      : { minute: '', hour: '', dayOfMonth: '', month: '', dayOfWeek: '' },
    humanReadable,
    nextRunHint: isValid ? 'Use scheduler to compute exact next run.' : 'N/A',
    warnings,
  };
}

export function compareCronExplanations(
  exprA: string,
  exprB: string
): { explanation: string; changedFields: string[] } {
  const diff = diffCron(exprA, exprB);
  const changedFields = diff.filter((d) => d.changed).map((d) => d.field);
  const explanation =
    changedFields.length === 0
      ? 'Expressions are identical.'
      : `Changed fields: ${changedFields.join(', ')}.`;
  return { explanation, changedFields };
}
