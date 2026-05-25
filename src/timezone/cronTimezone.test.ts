import {
  getUtcOffsetMinutes,
  shiftHourField,
  convertCronTimezone,
  describeTimezoneContext,
} from './cronTimezone';

describe('getUtcOffsetMinutes', () => {
  it('returns 0 for UTC', () => {
    const offset = getUtcOffsetMinutes('UTC');
    expect(offset).toBe(0);
  });

  it('returns a numeric value for a known timezone', () => {
    const offset = getUtcOffsetMinutes('America/New_York');
    expect(typeof offset).toBe('number');
  });
});

describe('shiftHourField', () => {
  it('returns * unchanged', () => {
    expect(shiftHourField('*', 3)).toBe('*');
  });

  it('shifts a simple hour value forward', () => {
    expect(shiftHourField('10', 3)).toBe('13');
  });

  it('wraps around midnight when shifting forward', () => {
    expect(shiftHourField('22', 3)).toBe('1');
  });

  it('wraps around when shifting backward', () => {
    expect(shiftHourField('1', -3)).toBe('22');
  });

  it('shifts comma-separated values', () => {
    expect(shiftHourField('8,12,18', 2)).toBe('10,14,20');
  });

  it('shifts a range', () => {
    expect(shiftHourField('9-17', 1)).toBe('10-18');
  });

  it('shifts a step expression with numeric base', () => {
    expect(shiftHourField('6/4', 2)).toBe('8/4');
  });

  it('leaves */step unchanged', () => {
    expect(shiftHourField('*/6', 3)).toBe('*/6');
  });
});

describe('convertCronTimezone', () => {
  it('returns the original expression if it does not have 5 parts', () => {
    const result = convertCronTimezone('invalid', 'UTC', 'America/New_York');
    expect(result.converted).toBe('invalid');
  });

  it('converts expression from UTC to UTC with no change', () => {
    const result = convertCronTimezone('0 10 * * *', 'UTC', 'UTC');
    expect(result.converted).toBe('0 10 * * *');
    expect(result.offsetDiffMinutes).toBe(0);
  });

  it('includes fromTimezone and toTimezone in result', () => {
    const result = convertCronTimezone('0 8 * * 1', 'UTC', 'Europe/London');
    expect(result.fromTimezone).toBe('UTC');
    expect(result.toTimezone).toBe('Europe/London');
  });

  it('preserves non-hour fields during conversion', () => {
    const result = convertCronTimezone('30 9 15 6 *', 'UTC', 'UTC');
    const parts = result.converted.split(' ');
    expect(parts[0]).toBe('30');
    expect(parts[2]).toBe('15');
    expect(parts[3]).toBe('6');
    expect(parts[4]).toBe('*');
  });
});

describe('describeTimezoneContext', () => {
  it('returns a descriptive string containing the expression and timezone', () => {
    const desc = describeTimezoneContext('0 9 * * *', 'UTC');
    expect(desc).toContain('0 9 * * *');
    expect(desc).toContain('UTC');
    expect(desc).toContain('UTC+00:00');
  });

  it('includes timezone name in description', () => {
    const desc = describeTimezoneContext('*/5 * * * *', 'America/Chicago');
    expect(desc).toContain('America/Chicago');
  });
});
