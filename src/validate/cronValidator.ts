/**
 * cronValidator.ts
 * Provides detailed validation of cron expressions with structured error reporting.
 */

export type FieldName = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';

export interface FieldValidationResult {
  field: FieldName;
  valid: boolean;
  value: string;
  error?: string;
}

export interface CronValidationResult {
  valid: boolean;
  expression: string;
  fields: FieldValidationResult[];
  errors: string[];
}

const FIELD_RANGES: Record<FieldName, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 7 },
};

const FIELD_ORDER: FieldName[] = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

function validateSingleField(value: string, field: FieldName): string | null {
  const { min, max } = FIELD_RANGES[field];

  if (value === '*') return null;

  // Step values: */n or n/n
  if (value.includes('/')) {
    const [base, step] = value.split('/');
    const stepNum = Number(step);
    if (isNaN(stepNum) || stepNum < 1) return `Invalid step value "${step}" in field "${field}"`;
    if (base !== '*') {
      const baseNum = Number(base);
      if (isNaN(baseNum) || baseNum < min || baseNum > max)
        return `Base value "${base}" out of range [${min}-${max}] in field "${field}"`;
    }
    return null;
  }

  // Range values: n-m
  if (value.includes('-')) {
    const [start, end] = value.split('-').map(Number);
    if (isNaN(start) || isNaN(end)) return `Invalid range "${value}" in field "${field}"`;
    if (start < min || start > max) return `Range start "${start}" out of range [${min}-${max}] in field "${field}"`;
    if (end < min || end > max) return `Range end "${end}" out of range [${min}-${max}] in field "${field}"`;
    if (start > end) return `Range start "${start}" must be <= end "${end}" in field "${field}"`;
    return null;
  }

  // List values: n,m,o
  if (value.includes(',')) {
    const parts = value.split(',');
    for (const part of parts) {
      const num = Number(part);
      if (isNaN(num) || num < min || num > max)
        return `List value "${part}" out of range [${min}-${max}] in field "${field}"`;
    }
    return null;
  }

  // Single numeric value
  const num = Number(value);
  if (isNaN(num)) return `Non-numeric value "${value}" in field "${field}"`;
  if (num < min || num > max) return `Value "${value}" out of range [${min}-${max}] in field "${field}"`;

  return null;
}

export function validateCron(expression: string): CronValidationResult {
  const trimmed = expression.trim();
  const parts = trimmed.split(/\s+/);

  if (parts.length !== 5) {
    return {
      valid: false,
      expression: trimmed,
      fields: [],
      errors: [`Expected 5 fields but got ${parts.length}`],
    };
  }

  const fields: FieldValidationResult[] = parts.map((value, i) => {
    const field = FIELD_ORDER[i];
    const error = validateSingleField(value, field) ?? undefined;
    return { field, valid: !error, value, error };
  });

  const errors = fields.filter((f) => f.error).map((f) => f.error as string);

  return {
    valid: errors.length === 0,
    expression: trimmed,
    fields,
    errors,
  };
}

export function getFieldErrors(expression: string): Partial<Record<FieldName, string>> {
  const result = validateCron(expression);
  const map: Partial<Record<FieldName, string>> = {};
  for (const f of result.fields) {
    if (f.error) map[f.field] = f.error;
  }
  return map;
}
