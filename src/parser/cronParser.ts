/**
 * Core cron expression parser for cronforge.
 * Parses and validates standard cron expressions (5-field format).
 */

export interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface ParseResult {
  valid: boolean;
  fields?: CronFields;
  errors: string[];
}

const FIELD_RANGES: Record<keyof CronFields, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 7 },
};

function validateField(value: string, fieldName: keyof CronFields): string[] {
  const errors: string[] = [];
  const { min, max } = FIELD_RANGES[fieldName];

  if (value === '*') return errors;

  const parts = value.split(',');
  for (const part of parts) {
    if (part.includes('/')) {
      const [range, step] = part.split('/');
      const stepNum = Number(step);
      if (isNaN(stepNum) || stepNum < 1) {
        errors.push(`Invalid step value "${step}" in field "${fieldName}"`);
      }
      if (range !== '*') {
        const rangeNum = Number(range);
        if (isNaN(rangeNum) || rangeNum < min || rangeNum > max) {
          errors.push(`Value "${range}" out of range [${min}-${max}] in field "${fieldName}"`);
        }
      }
    } else if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
        errors.push(`Invalid range "${part}" in field "${fieldName}" (expected ${min}-${max})`);
      }
    } else {
      const num = Number(part);
      if (isNaN(num) || num < min || num > max) {
        errors.push(`Value "${part}" out of range [${min}-${max}] in field "${fieldName}"`);
      }
    }
  }

  return errors;
}

export function parseCron(expression: string): ParseResult {
  const trimmed = expression.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length !== 5) {
    return {
      valid: false,
      errors: [`Expected 5 fields, got ${parts.length}`],
    };
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  const fields: CronFields = { minute, hour, dayOfMonth, month, dayOfWeek };

  const errors: string[] = [];
  for (const [fieldName, value] of Object.entries(fields)) {
    errors.push(...validateField(value, fieldName as keyof CronFields));
  }

  return {
    valid: errors.length === 0,
    fields: errors.length === 0 ? fields : undefined,
    errors,
  };
}
