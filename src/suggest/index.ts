import {
  suggestByPartialInput,
  suggestSimilar,
  suggestFromKeyword,
  CronSuggestion,
} from './cronSuggester';

export type { CronSuggestion };

/**
 * Returns top cron expression suggestions based on a partially typed expression.
 */
export function getPartialSuggestions(partial: string): string[] {
  return suggestByPartialInput(partial).map((s) => s.expression);
}

/**
 * Returns similar cron expressions to the given valid expression.
 */
export function getSimilarExpressions(expression: string): string[] {
  return suggestSimilar(expression).map((s) => s.expression);
}

/**
 * Returns labeled suggestions matching a natural keyword like "daily" or "hourly".
 */
export function getKeywordSuggestions(keyword: string): CronSuggestion[] {
  return suggestFromKeyword(keyword);
}

/**
 * Returns true if there are any suggestions for the given partial input.
 */
export function hasSuggestions(partial: string): boolean {
  return suggestByPartialInput(partial).length > 0;
}
