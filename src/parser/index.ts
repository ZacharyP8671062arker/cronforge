/**
 * Public API for the cronforge parser module.
 */

export { parseCron } from './cronParser';
export type { CronFields, ParseResult } from './cronParser';

/**
 * Convenience function: returns true if the given cron expression is valid.
 *
 * @param expression - A 5-field cron expression string
 * @returns boolean indicating validity
 *
 * @example
 * isValidCron('* * * * *');   // true
 * isValidCron('60 * * * *');  // false
 */
export function isValidCron(expression: string): boolean {
  const { parseCron: parse } = require('./cronParser');
  return parse(expression).valid;
}

/**
 * Returns a human-readable summary of parse errors for an invalid expression.
 *
 * @param expression - A cron expression string to validate
 * @returns An array of error messages, or an empty array if valid
 *
 * @example
 * getCronErrors('60 * * * *');
 * // => ['Value "60" out of range [0-59] in field "minute"']
 */
export function getCronErrors(expression: string): string[] {
  const { parseCron: parse } = require('./cronParser');
  return parse(expression).errors;
}
