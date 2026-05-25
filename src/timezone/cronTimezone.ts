/**
 * cronTimezone.ts
 * Utilities for converting and describing cron expressions in the context of timezones.
 */

export interface TimezoneConversionResult {
  original: string;
  converted: string;
  fromTimezone: string;
  toTimezone: string;
  offsetDiffMinutes: number;
}

/**
 * Get UTC offset in minutes for a given IANA timezone string.
 * Uses Intl.DateTimeFormat to determine offset.
 */
export function getUtcOffsetMinutes(timezone: string, date: Date = new Date()): number {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return (tzDate.getTime() - utcDate.getTime()) / 60000;
}

/**
 * Shift a cron hour field by a given offset in hours.
 * Handles wrapping (0-23) and wildcards.
 */
export function shiftHourField(hourField: string, shiftHours: number): string {
  if (hourField === '*') return '*';

  const shifted = hourField.split(',').map((part) => {
    if (part.includes('/')) {
      const [base, step] = part.split('/');
      if (base === '*') return part;
      const newBase = ((parseInt(base, 10) + shiftHours) % 24 + 24) % 24;
      return `${newBase}/${step}`;
    }
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      const newStart = ((start + shiftHours) % 24 + 24) % 24;
      const newEnd = ((end + shiftHours) % 24 + 24) % 24;
      return `${newStart}-${newEnd}`;
    }
    const val = parseInt(part, 10);
    if (isNaN(val)) return part;
    return String(((val + shiftHours) % 24 + 24) % 24);
  });

  return shifted.join(',');
}

/**
 * Convert a cron expression from one timezone to another.
 * Only adjusts the hour (and optionally minute) field based on UTC offset difference.
 */
export function convertCronTimezone(
  expression: string,
  fromTimezone: string,
  toTimezone: string,
  date: Date = new Date()
): TimezoneConversionResult {
  const fromOffset = getUtcOffsetMinutes(fromTimezone, date);
  const toOffset = getUtcOffsetMinutes(toTimezone, date);
  const offsetDiffMinutes = toOffset - fromOffset;
  const offsetDiffHours = Math.round(offsetDiffMinutes / 60);

  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { original: expression, converted: expression, fromTimezone, toTimezone, offsetDiffMinutes };
  }

  const [minute, hour, dom, month, dow] = parts;
  const newHour = shiftHourField(hour, offsetDiffHours);
  const converted = [minute, newHour, dom, month, dow].join(' ');

  return { original: expression, converted, fromTimezone, toTimezone, offsetDiffMinutes };
}

/**
 * Describe what timezone a cron expression is interpreted in.
 */
export function describeTimezoneContext(expression: string, timezone: string): string {
  const offset = getUtcOffsetMinutes(timezone);
  const sign = offset >= 0 ? '+' : '-';
  const absHours = Math.floor(Math.abs(offset) / 60);
  const absMins = Math.abs(offset) % 60;
  const offsetStr = `UTC${sign}${String(absHours).padStart(2, '0')}:${String(absMins).padStart(2, '0')}`;
  return `Expression "${expression}" is interpreted in timezone "${timezone}" (${offsetStr})`;
}
