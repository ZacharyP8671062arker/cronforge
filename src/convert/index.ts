/**
 * Public API for the cron converter module.
 */

import {
  convertCron,
  detectFormat,
  normalizeCron,
  CronFormat,
  ConversionResult,
} from './cronConverter';

export { CronFormat, ConversionResult };

/**
 * Convert a cron expression to the specified format.
 */
export function toCronFormat(
  expression: string,
  format: CronFormat
): string {
  return convertCron(expression, format).expression;
}

/**
 * Get the detected format of a cron expression.
 */
export function getCronFormat(expression: string): CronFormat {
  return detectFormat(expression);
}

/**
 * Normalize any cron expression to standard 5-field format.
 */
export function toStandardCron(expression: string): string {
  return normalizeCron(expression);
}

/**
 * Returns true if the expression is already in the target format.
 */
export function isFormat(expression: string, format: CronFormat): boolean {
  return detectFormat(expression) === format;
}

/**
 * Returns any warnings that would occur during conversion.
 */
export function getConversionWarnings(
  expression: string,
  targetFormat: CronFormat
): string[] {
  return convertCron(expression, targetFormat).warnings;
}
