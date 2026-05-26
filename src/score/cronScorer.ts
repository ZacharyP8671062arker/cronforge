/**
 * cronScorer.ts
 * Scores a cron expression based on readability, specificity, and best practices.
 */

export interface CronScore {
  total: number;
  readability: number;
  specificity: number;
  bestPractices: number;
  details: string[];
}

const FIELDS = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

export function scoreReadability(parts: string[]): { score: number; notes: string[] } {
  const notes: string[] = [];
  let score = 100;

  parts.forEach((part, i) => {
    if (part.includes('*/1')) {
      score -= 10;
      notes.push(`${FIELDS[i]}: '*/1' is redundant, use '*' instead`);
    }
    if ((part.match(/,/g) || []).length > 4) {
      score -= 10;
      notes.push(`${FIELDS[i]}: many comma-separated values reduce readability`);
    }
  });

  return { score: Math.max(0, score), notes };
}

export function scoreSpecificity(parts: string[]): { score: number; notes: string[] } {
  const notes: string[] = [];
  let wildcards = 0;

  parts.forEach((part, i) => {
    if (part === '*') {
      wildcards++;
      if (i < 2) notes.push(`${FIELDS[i]}: wildcard reduces specificity`);
    }
  });

  const score = Math.max(0, 100 - wildcards * 15);
  return { score, notes };
}

export function scoreBestPractices(parts: string[]): { score: number; notes: string[] } {
  const notes: string[] = [];
  let score = 100;

  const [minute, hour, dom, , dow] = parts;

  if (minute === '*' && hour === '*') {
    score -= 30;
    notes.push('Running every minute is rarely intentional — consider specifying minute/hour');
  }

  if (dom !== '*' && dow !== '*') {
    score -= 15;
    notes.push('Specifying both day-of-month and day-of-week can cause unexpected behavior');
  }

  if (minute.includes('*/') ) {
    const interval = parseInt(minute.replace('*/', ''), 10);
    if (!isNaN(interval) && interval < 5) {
      score -= 20;
      notes.push(`minute: interval of ${interval} is very high frequency`);
    }
  }

  return { score: Math.max(0, score), notes };
}

export function scoreCron(expression: string): CronScore {
  const parts = expression.trim().split(/\s+/);

  if (parts.length !== 5) {
    return {
      total: 0,
      readability: 0,
      specificity: 0,
      bestPractices: 0,
      details: ['Invalid cron expression: expected 5 fields'],
    };
  }

  const readabilityResult = scoreReadability(parts);
  const specificityResult = scoreSpecificity(parts);
  const bestPracticesResult = scoreBestPractices(parts);

  const total = Math.round(
    readabilityResult.score * 0.3 +
    specificityResult.score * 0.3 +
    bestPracticesResult.score * 0.4
  );

  return {
    total,
    readability: readabilityResult.score,
    specificity: specificityResult.score,
    bestPractices: bestPracticesResult.score,
    details: [
      ...readabilityResult.notes,
      ...specificityResult.notes,
      ...bestPracticesResult.notes,
    ],
  };
}
