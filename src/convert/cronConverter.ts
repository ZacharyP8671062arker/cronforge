/**
 * cronConverter.ts
 * Converts cron expressions between different formats and standards.
 * Supports standard 5-field, extended 6-field (with seconds), and Quartz 7-field formats.
 */

export type CronFormat = 'standard' | 'extended' | 'quartz';

export interface ConversionResult {
  expression: string;
  format: CronFormat;
  fields: string[];
  warnings: string[];
}

/**
 * Detects the format of a cron expression based on field count.
 */
export function detectFormat(expression: string): CronFormat {
  const fields = expression.trim().split(/\s+/);
  if (fields.length === 7) return 'quartz';
  if (fields.length === 6) return 'extended';
  return 'standard';
}

/**
 * Converts a cron expression to the target format.
 */
export function convertCron(
  expression: string,
  targetFormat: CronFormat
): ConversionResult {
  const fields = expression.trim().split(/\s+/);
  const sourceFormat = detectFormat(expression);
  const warnings: string[] = [];
  let resultFields: string[];

  if (sourceFormat === targetFormat) {
    return { expression, format: targetFormat, fields, warnings };
  }

  if (sourceFormat === 'standard') {
    // standard: min hour dom month dow
    if (targetFormat === 'extended') {
      resultFields = ['0', ...fields]; // prepend seconds=0
    } else {
      // quartz: sec min hour dom month dow year
      resultFields = ['0', ...fields, '*'];
    }
  } else if (sourceFormat === 'extended') {
    // extended: sec min hour dom month dow
    if (targetFormat === 'standard') {
      if (fields[0] !== '0') {
        warnings.push(`Seconds field "${fields[0]}" dropped in standard format.`);
      }
      resultFields = fields.slice(1);
    } else {
      // quartz
      resultFields = [...fields, '*'];
    }
  } else {
    // quartz: sec min hour dom month dow year
    if (targetFormat === 'standard') {
      if (fields[0] !== '0') {
        warnings.push(`Seconds field "${fields[0]}" dropped in standard format.`);
      }
      if (fields[6] !== '*') {
        warnings.push(`Year field "${fields[6]}" dropped in standard format.`);
      }
      resultFields = fields.slice(1, 6);
    } else {
      // extended
      if (fields[6] !== '*') {
        warnings.push(`Year field "${fields[6]}" dropped in extended format.`);
      }
      resultFields = fields.slice(0, 6);
    }
  }

  const result = resultFields.join(' ');
  return { expression: result, format: targetFormat, fields: resultFields, warnings };
}

/**
 * Normalizes a cron expression to standard 5-field format.
 */
export function normalizeCron(expression: string): string {
  return convertCron(expression, 'standard').expression;
}
