import {
  convertToTimezone,
  getOffsetMinutes,
  shiftCronHours,
  describeInTimezone,
  isSameOffset,
} from './index';

describe('timezone index', () => {
  describe('getOffsetMinutes', () => {
    it('returns 0 for UTC', () => {
      expect(getOffsetMinutes('UTC')).toBe(0);
    });

    it('returns a number for a valid timezone', () => {
      const offset = getOffsetMinutes('America/New_York');
      expect(typeof offset).toBe('number');
    });
  });

  describe('shiftCronHours', () => {
    it('shifts a specific hour forward', () => {
      const result = shiftCronHours('0 10 * * *', 2);
      expect(result).toBe('0 12 * * *');
    });

    it('wraps around midnight correctly', () => {
      const result = shiftCronHours('0 23 * * *', 2);
      expect(result).toBe('0 1 * * *');
    });

    it('handles negative offsets', () => {
      const result = shiftCronHours('0 3 * * *', -5);
      expect(result).toBe('0 22 * * *');
    });

    it('leaves wildcard hour unchanged', () => {
      const result = shiftCronHours('0 * * * *', 3);
      expect(result).toContain('*');
    });

    it('throws on invalid cron', () => {
      expect(() => shiftCronHours('bad', 1)).toThrow();
    });
  });

  describe('convertToTimezone', () => {
    it('returns a string', () => {
      const result = convertToTimezone('0 9 * * *', 'UTC', 'America/New_York');
      expect(typeof result).toBe('string');
    });

    it('returns same expression for same timezone', () => {
      const result = convertToTimezone('0 9 * * *', 'UTC', 'UTC');
      expect(result).toBe('0 9 * * *');
    });
  });

  describe('describeInTimezone', () => {
    it('returns a non-empty string', () => {
      const desc = describeInTimezone('0 9 * * 1', 'UTC');
      expect(typeof desc).toBe('string');
      expect(desc.length).toBeGreaterThan(0);
    });
  });

  describe('isSameOffset', () => {
    it('returns true for UTC and UTC', () => {
      expect(isSameOffset('UTC', 'UTC')).toBe(true);
    });

    it('returns false for different offsets', () => {
      const result = isSameOffset('UTC', 'America/Los_Angeles');
      expect(result).toBe(false);
    });
  });
});
