/**
 * cronLinter.ts
 * Lints cron expressions for common issues, anti-patterns, and style violations.
 */

export interface LintRule {
  code: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface LintResult {
  expression: string;
  valid: boolean;
  rules: LintRule[];
  score: number; // 0-100, higher is better
}

const FIELD_NAMES = ['minute', 'hour', 'day-of-month', 'month', 'day-of-week'];

function hasRedundantStar(fields: string[]): boolean {
  return fields.every((f) => f === '*');
}

function isOverlyBroad(field: string, index: number): boolean {
  if (field === '*') return true;
  if (field.includes('/1')) return true; // */1 is same as *
  return false;
}

function detectConflictingDayFields(dom: string, dow: string): boolean {
  return dom !== '*' && dow !== '*';
}

function detectHighFrequency(minute: string, hour: string): boolean {
  if (minute.startsWith('*/') ) {
    const interval = parseInt(minute.split('/')[1], 10);
    if (!isNaN(interval) && interval < 5) return true;
  }
  return minute === '*' && hour === '*';
}

export function lintCron(expression: string): LintResult {
  const fields = expression.trim().split(/\s+/);
  const rules: LintRule[] = [];

  if (fields.length !== 5) {
    return {
      expression,
      valid: false,
      rules: [{ code: 'E001', severity: 'error', message: 'Expression must have exactly 5 fields.' }],
      score: 0,
    };
  }

  const [minute, hour, dom, month, dow] = fields;

  if (hasRedundantStar(fields)) {
    rules.push({ code: 'W001', severity: 'warning', message: 'All fields are wildcards — job runs every minute.' });
  }

  if (detectHighFrequency(minute, hour)) {
    rules.push({ code: 'W002', severity: 'warning', message: 'High-frequency schedule detected (sub-5 minute interval).' });
  }

  if (detectConflictingDayFields(dom, dow)) {
    rules.push({ code: 'W003', severity: 'warning', message: 'Both day-of-month and day-of-week are set; this may cause unexpected behavior.' });
  }

  fields.forEach((field, i) => {
    if (field.includes('/1') && field !== '*/1') {
      rules.push({ code: 'I001', severity: 'info', message: `Field '${FIELD_NAMES[i]}' uses '/1' step which is redundant.` });
    }
  });

  if (month !== '*' && dom === '*' && dow === '*') {
    rules.push({ code: 'I002', severity: 'info', message: 'Month is restricted but day fields are wildcards — runs every day in that month.' });
  }

  const errorCount = rules.filter((r) => r.severity === 'error').length;
  const warningCount = rules.filter((r) => r.severity === 'warning').length;
  const score = Math.max(0, 100 - errorCount * 40 - warningCount * 10);

  return { expression, valid: errorCount === 0, rules, score };
}

export function getLintMessages(result: LintResult): string[] {
  return result.rules.map((r) => `[${r.severity.toUpperCase()}] ${r.code}: ${r.message}`);
}
