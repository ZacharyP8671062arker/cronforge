import {
  getUtcOffsetMinutes,
  shiftHourField,
  convertCronTimezone,
  describeTimezoneContext,
} from './cronTimezone';

/**
 * Convert a cron expression from one timezone to another.
 * Returns the adjusted cron expression string.
 */
export function convertToTimezone(
  cron: string,
  fromTz: string,
  toTz: string
): string {
  return convertCronTimezone(cron, fromTz, toTz);
}

/**
 * Get the UTC offset in minutes for a given IANA timezone identifier.
 */
export function getOffsetMinutes(timezone: string): number {
  return getUtcOffsetMinutes(timezone);
}

/**
 * Shift only the hour field of a cron expression by a given offset in hours.
 * Useful for quick manual adjustments.
 */
export function shiftCronHours(cron: string, offsetHours: number): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) throw new Error('Invalid cron expression');
  const shifted = shiftHourField(parts[1], offsetHours);
  parts[1] = shifted;
  return parts.join(' ');
}

/**
 * Returns a human-readable description of a cron expression in a given timezone.
 */
export function describeInTimezone(cron: string, timezone: string): string {
  return describeTimezoneContext(cron, timezone);
}

/**
 * Returns true if the two timezone strings represent the same UTC offset.
 */
export function isSameOffset(tzA: string, tzB: string): boolean {
  return getUtcOffsetMinutes(tzA) === getUtcOffsetMinutes(tzB);
}
