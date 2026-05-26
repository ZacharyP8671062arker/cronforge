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
 * @throws {Error} If the cron expression does not have at least 5 fields.
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

/**
 * Returns the UTC offset as a formatted string (e.g. "+05:30" or "-08:00")
 * for a given IANA timezone identifier.
 */
export function getOffsetString(timezone: string): string {
  const totalMinutes = getUtcOffsetMinutes(timezone);
  const sign = totalMinutes >= 0 ? '+' : '-';
  const absMinutes = Math.abs(totalMinutes);
  const hours = String(Math.floor(absMinutes / 60)).padStart(2, '0');
  const minutes = String(absMinutes % 60).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
}
