import { isValidCron, getCronErrors } from '../parser/index';
import { humanizeCron } from '../humanizer/humanizer';
import { getNextRunDate } from '../scheduler/cronScheduler';

export interface AuditResult {
  expression: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  description: string | null;
  nextRuns: Date[];
  risk: 'low' | 'medium' | 'high';
}

export function auditFrequency(parts: string[]): string[] {
  const warnings: string[] = [];
  const [minute, hour] = parts;

  if (minute === '*' && hour === '*') {
    warnings.push('Expression runs every minute — this may cause high system load.');
  }

  if (minute.includes('/')) {
    const step = parseInt(minute.split('/')[1], 10);
    if (!isNaN(step) && step < 5) {
      warnings.push(`Minute step of ${step} may result in very frequent execution.`);
    }
  }

  return warnings;
}

export function assessRisk(warnings: string[], errors: string[]): 'low' | 'medium' | 'high' {
  if (errors.length > 0) return 'high';
  if (warnings.length >= 2) return 'high';
  if (warnings.length === 1) return 'medium';
  return 'low';
}

export function auditCron(expression: string, nextRunCount = 5): AuditResult {
  const valid = isValidCron(expression);
  const errors = getCronErrors(expression);
  const warnings: string[] = [];

  let description: string | null = null;
  const nextRuns: Date[] = [];

  if (valid) {
    try {
      description = humanizeCron(expression);
    } catch {
      description = null;
    }

    const parts = expression.trim().split(/\s+/);
    warnings.push(...auditFrequency(parts));

    let cursor = new Date();
    for (let i = 0; i < nextRunCount; i++) {
      const next = getNextRunDate(expression, cursor);
      if (!next) break;
      nextRuns.push(next);
      cursor = new Date(next.getTime() + 1000);
    }
  }

  const risk = assessRisk(warnings, errors);

  return { expression, valid, errors, warnings, description, nextRuns, risk };
}
