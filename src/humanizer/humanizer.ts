/**
 * Converts a cron expression into a human-readable description.
 */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

function describeField(value: string, singular: string, plural: string): string {
  if (value === '*') return `every ${singular}`;
  if (value.startsWith('*/')) {
    const step = value.slice(2);
    return `every ${step} ${plural}`;
  }
  if (value.includes('-')) {
    const [start, end] = value.split('-');
    return `${singular}s ${start} through ${end}`;
  }
  if (value.includes(',')) {
    const parts = value.split(',');
    return `${singular}s ${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
  }
  return `${singular} ${value}`;
}

function describeMonth(value: string): string {
  if (value === '*') return '';
  if (value.includes(',')) {
    return value.split(',').map(m => MONTHS[parseInt(m) - 1] ?? m).join(', ');
  }
  const num = parseInt(value);
  return isNaN(num) ? value : MONTHS[num - 1] ?? value;
}

function describeDayOfWeek(value: string): string {
  if (value === '*') return '';
  if (value.includes(',')) {
    return value.split(',').map(d => DAYS_OF_WEEK[parseInt(d)] ?? d).join(', ');
  }
  const num = parseInt(value);
  return isNaN(num) ? value : DAYS_OF_WEEK[num] ?? value;
}

export function humanizeCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return 'Invalid cron expression';
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  if (expression === '* * * * *') return 'Every minute';
  if (expression === '0 * * * *') return 'Every hour';
  if (expression === '0 0 * * *') return 'Every day at midnight';
  if (expression === '0 0 * * 0') return 'Every Sunday at midnight';
  if (expression === '0 0 1 * *') return 'At midnight on the 1st of every month';
  if (expression === '0 0 1 1 *') return 'At midnight on January 1st';

  const timePart = `at ${hour === '*' ? 'every hour' : hour.padStart(2, '0')}:${minute === '*' ? '00' : minute.padStart(2, '0')}`;
  const monthPart = describeMonth(month);
  const dowPart = describeDayOfWeek(dayOfWeek);
  const domPart = dayOfMonth !== '*' ? `on day ${dayOfMonth}` : '';

  const parts2: string[] = [timePart];
  if (domPart) parts2.push(domPart);
  if (monthPart) parts2.push(`in ${monthPart}`);
  if (dowPart) parts2.push(`on ${dowPart}`);

  return parts2.join(' ');
}

export function describeCron(expression: string): {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  summary: string;
} {
  const parts = expression.trim().split(/\s+/);
  const [minute = '*', hour = '*', dayOfMonth = '*', month = '*', dayOfWeek = '*'] = parts;
  return {
    minute: describeField(minute, 'minute', 'minutes'),
    hour: describeField(hour, 'hour', 'hours'),
    dayOfMonth: describeField(dayOfMonth, 'day', 'days'),
    month: month === '*' ? 'every month' : describeMonth(month),
    dayOfWeek: dayOfWeek === '*' ? 'every day of the week' : describeDayOfWeek(dayOfWeek),
    summary: humanizeCron(expression),
  };
}
