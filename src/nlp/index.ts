/**
 * NLP module entry point.
 * Provides natural language parsing utilities integrated with the cron validator.
 */

export { parseNaturalLanguage, type NLPResult } from './naturalLanguageParser';
import { parseNaturalLanguage } from './naturalLanguageParser';
import { isValidCron } from '../parser';

/**
 * Attempts to convert a natural language string to a cron expression.
 * Returns the cron string if successful and valid, otherwise null.
 */
export function nlpToCron(input: string): string | null {
  const result = parseNaturalLanguage(input);
  if (!result) return null;
  return isValidCron(result.cron) ? result.cron : null;
}

/**
 * Returns a human-readable description derived from natural language input,
 * or null if the input could not be parsed.
 */
export function nlpToDescription(input: string): string | null {
  const result = parseNaturalLanguage(input);
  return result?.description ?? null;
}

/**
 * Checks whether a natural language string can be converted to a valid cron expression.
 */
export function canParseNaturalLanguage(input: string): boolean {
  return nlpToCron(input) !== null;
}
