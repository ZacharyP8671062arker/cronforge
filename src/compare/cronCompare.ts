/**
 * cronCompare.ts
 * Compares two cron expressions and returns a structured similarity report.
 */

export interface CronCompareResult {
  expressionA: string;
  expressionB: string;
  identical: boolean;
  similarityScore: number; // 0.0 - 1.0
  matchingFields: string[];
  differingFields: string[];
  summary: string;
}

const FIELD_NAMES = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

export function splitExpression(expr: string): string[] {
  return expr.trim().split(/\s+/);
}

export function compareFields(
  a: string,
  b: string
): { matching: string[]; differing: string[] } {
  const partsA = splitExpression(a);
  const partsB = splitExpression(b);
  const matching: string[] = [];
  const differing: string[] = [];

  const len = Math.min(partsA.length, partsB.length, FIELD_NAMES.length);
  for (let i = 0; i < len; i++) {
    if (partsA[i] === partsB[i]) {
      matching.push(FIELD_NAMES[i]);
    } else {
      differing.push(FIELD_NAMES[i]);
    }
  }

  return { matching, differing };
}

export function similarityScore(matching: number, total: number): number {
  if (total === 0) return 0;
  return parseFloat((matching / total).toFixed(2));
}

export function compareCronExpressions(
  a: string,
  b: string
): CronCompareResult {
  const identical = a.trim() === b.trim();
  const { matching, differing } = compareFields(a, b);
  const score = similarityScore(matching.length, FIELD_NAMES.length);

  let summary: string;
  if (identical) {
    summary = 'Both expressions are identical.';
  } else if (score >= 0.8) {
    summary = `Expressions are very similar, differing only in: ${differing.join(', ')}.`;
  } else if (score >= 0.4) {
    summary = `Expressions share some fields (${matching.join(', ')}), but differ in: ${differing.join(', ')}.`;
  } else {
    summary = `Expressions are mostly different, only matching in: ${matching.join(', ') || 'none'}.`;
  }

  return {
    expressionA: a,
    expressionB: b,
    identical,
    similarityScore: score,
    matchingFields: matching,
    differingFields: differing,
    summary,
  };
}
