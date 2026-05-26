import { scoreCron, scoreReadability, scoreSpecificity, scoreBestPractices } from './cronScorer';

export interface CronScore {
  total: number;
  readability: number;
  specificity: number;
  bestPractices: number;
  grade: string;
}

function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export function getCronScore(expression: string): CronScore {
  const result = scoreCron(expression);
  return {
    total: result.total,
    readability: result.readability,
    specificity: result.specificity,
    bestPractices: result.bestPractices,
    grade: getGrade(result.total),
  };
}

export function getReadabilityScore(expression: string): number {
  return scoreReadability(expression);
}

export function getSpecificityScore(expression: string): number {
  return scoreSpecificity(expression);
}

export function getBestPracticesScore(expression: string): number {
  return scoreBestPractices(expression);
}

export function isHighQuality(expression: string): boolean {
  const { total } = scoreCron(expression);
  return total >= 80;
}

export function getScoreGrade(expression: string): string {
  const { total } = scoreCron(expression);
  return getGrade(total);
}
