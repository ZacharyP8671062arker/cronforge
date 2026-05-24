/**
 * Natural language parser for converting human-readable strings to cron expressions.
 * Supports phrases like "every 5 minutes", "every day at 9am", "every Monday at noon"
 */

const DAYS_OF_WEEK: Record<string, number> = {
  sunday: 0, sun: 0,
  monday: 1, mon: 1,
  tuesday: 2, tue: 2,
  wednesday: 3, wed: 3,
  thursday: 4, thu: 4,
  friday: 5, fri: 5,
  saturday: 6, sat: 6,
};

const MONTHS: Record<string, number> = {
  january: 1, jan: 1,
  february: 2, feb: 2,
  march: 3, mar: 3,
  april: 4, apr: 4,
  may: 5,
  june: 6, jun: 6,
  july: 7, jul: 7,
  august: 8, aug: 8,
  september: 9, sep: 9,
  october: 10, oct: 10,
  november: 11, nov: 11,
  december: 12, dec: 12,
};

function parseTimeOfDay(phrase: string): { hour: string; minute: string } | null {
  const noonMidnight = phrase.match(/\b(noon|midnight)\b/);
  if (noonMidnight) {
    return noonMidnight[1] === 'noon'
      ? { hour: '12', minute: '0' }
      : { hour: '0', minute: '0' };
  }

  const timeMatch = phrase.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const period = timeMatch[3]?.toLowerCase();
    if (period === 'pm' && hour < 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    return { hour: String(hour), minute: String(minute) };
  }

  return null;
}

export interface NLPResult {
  cron: string;
  description: string;
}

export function parseNaturalLanguage(input: string): NLPResult | null {
  const text = input.toLowerCase().trim();

  // Every N minutes
  const everyMinutes = text.match(/every\s+(\d+)\s+minute/);
  if (everyMinutes) {
    const n = everyMinutes[1];
    return { cron: `*/${n} * * * *`, description: `Every ${n} minute(s)` };
  }

  // Every N hours
  const everyHours = text.match(/every\s+(\d+)\s+hour/);
  if (everyHours) {
    const n = everyHours[1];
    return { cron: `0 */${n} * * *`, description: `Every ${n} hour(s)` };
  }

  // Every day at time
  const everyDay = text.match(/every\s+day/);
  if (everyDay) {
    const time = parseTimeOfDay(text);
    const h = time?.hour ?? '0';
    const m = time?.minute ?? '0';
    return { cron: `${m} ${h} * * *`, description: `Every day at ${h}:${m.padStart(2, '0')}` };
  }

  // Every weekday name at time
  for (const [name, num] of Object.entries(DAYS_OF_WEEK)) {
    if (text.includes(`every ${name}`)) {
      const time = parseTimeOfDay(text);
      const h = time?.hour ?? '0';
      const m = time?.minute ?? '0';
      return { cron: `${m} ${h} * * ${num}`, description: `Every ${name} at ${h}:${m.padStart(2, '0')}` };
    }
  }

  // Every month name
  for (const [name, num] of Object.entries(MONTHS)) {
    if (text.includes(`every ${name}`)) {
      const time = parseTimeOfDay(text);
      const h = time?.hour ?? '0';
      const m = time?.minute ?? '0';
      return { cron: `${m} ${h} 1 ${num} *`, description: `First of ${name} at ${h}:${m.padStart(2, '0')}` };
    }
  }

  return null;
}
