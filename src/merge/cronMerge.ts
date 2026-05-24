/**
 * cronMerge.ts
 * Utilities for merging multiple cron expressions into a unified schedule.
 */

export interface MergeResult {
  merged: string;
  conflicts: string[];
  warnings: string[];
}

const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

/**
 * Merges two field values, returning a combined expression or detecting conflicts.
 */
export function mergeField(
  a: string,
  b: string,
  fieldName: string
): { value: string; conflict: string | null } {
  if (a === b) return { value: a, conflict: null };
  if (a === '*') return { value: b, conflict: null };
  if (b === '*') return { value: a, conflict: null };

  const combined = `${a},${b}`;
  return {
    value: combined,
    conflict: null,
  };
}

/**
 * Merges an array of cron expressions into one.
 * Returns a MergeResult with the merged expression and any conflicts or warnings.
 */
export function mergeCrons(expressions: string[]): MergeResult {
  if (expressions.length === 0) {
    return { merged: '* * * * *', conflicts: [], warnings: ['No expressions provided; defaulting to wildcard.'] };
  }

  if (expressions.length === 1) {
    return { merged: expressions[0], conflicts: [], warnings: [] };
  }

  const parsed = expressions.map((expr) => expr.trim().split(/\s+/));
  const invalidExprs = parsed
    .map((fields, i) => (fields.length !== 5 ? expressions[i] : null))
    .filter(Boolean) as string[];

  if (invalidExprs.length > 0) {
    return {
      merged: '',
      conflicts: invalidExprs.map((e) => `Invalid expression: "${e}"`),
      warnings: [],
    };
  }

  const conflicts: string[] = [];
  const warnings: string[] = [];
  const mergedFields: string[] = [];

  for (let i = 0; i < 5; i++) {
    let current = parsed[0][i];
    for (let j = 1; j < parsed.length; j++) {
      const { value, conflict } = mergeField(current, parsed[j][i], FIELD_NAMES[i]);
      if (conflict) conflicts.push(conflict);
      current = value;
    }
    if (current.includes(',') && current.split(',').length > 10) {
      warnings.push(`Field "${FIELD_NAMES[i]}" has many values after merge; consider simplifying.`);
    }
    mergedFields.push(current);
  }

  return {
    merged: mergedFields.join(' '),
    conflicts,
    warnings,
  };
}

/**
 * Returns true if two cron expressions have overlapping schedules (share at least one common trigger time).
 */
export function cronOverlaps(a: string, b: string): boolean {
  const fieldsA = a.trim().split(/\s+/);
  const fieldsB = b.trim().split(/\s+/);
  if (fieldsA.length !== 5 || fieldsB.length !== 5) return false;

  return fieldsA.every((fieldA, i) => {
    const fieldB = fieldsB[i];
    return fieldA === '*' || fieldB === '*' || fieldA === fieldB ||
      fieldA.split(',').some((v) => fieldB.split(',').includes(v));
  });
}
