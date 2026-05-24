import { parseNaturalLanguage } from './naturalLanguageParser';

describe('parseNaturalLanguage', () => {
  describe('minute intervals', () => {
    it('parses "every 5 minutes"', () => {
      const result = parseNaturalLanguage('every 5 minutes');
      expect(result).not.toBeNull();
      expect(result?.cron).toBe('*/5 * * * *');
    });

    it('parses "every 15 minute"', () => {
      const result = parseNaturalLanguage('every 15 minute');
      expect(result?.cron).toBe('*/15 * * * *');
    });
  });

  describe('hour intervals', () => {
    it('parses "every 2 hours"', () => {
      const result = parseNaturalLanguage('every 2 hours');
      expect(result?.cron).toBe('0 */2 * * *');
    });

    it('parses "every 6 hour"', () => {
      const result = parseNaturalLanguage('every 6 hour');
      expect(result?.cron).toBe('0 */6 * * *');
    });
  });

  describe('every day', () => {
    it('parses "every day" without time defaults to midnight', () => {
      const result = parseNaturalLanguage('every day');
      expect(result?.cron).toBe('0 0 * * *');
    });

    it('parses "every day at 9am"', () => {
      const result = parseNaturalLanguage('every day at 9am');
      expect(result?.cron).toBe('0 9 * * *');
    });

    it('parses "every day at noon"', () => {
      const result = parseNaturalLanguage('every day at noon');
      expect(result?.cron).toBe('0 12 * * *');
    });

    it('parses "every day at 3:30pm"', () => {
      const result = parseNaturalLanguage('every day at 3:30pm');
      expect(result?.cron).toBe('30 15 * * *');
    });
  });

  describe('day of week', () => {
    it('parses "every monday"', () => {
      const result = parseNaturalLanguage('every monday');
      expect(result?.cron).toBe('0 0 * * 1');
    });

    it('parses "every friday at 5pm"', () => {
      const result = parseNaturalLanguage('every friday at 5pm');
      expect(result?.cron).toBe('0 17 * * 5');
    });

    it('parses abbreviated day "every mon at noon"', () => {
      const result = parseNaturalLanguage('every mon at noon');
      expect(result?.cron).toBe('0 12 * * 1');
    });
  });

  describe('monthly', () => {
    it('parses "every january"', () => {
      const result = parseNaturalLanguage('every january');
      expect(result?.cron).toBe('0 0 1 1 *');
    });

    it('parses "every december at midnight"', () => {
      const result = parseNaturalLanguage('every december at midnight');
      expect(result?.cron).toBe('0 0 1 12 *');
    });
  });

  describe('unrecognized input', () => {
    it('returns null for unrecognized phrases', () => {
      const result = parseNaturalLanguage('run the job whenever');
      expect(result).toBeNull();
    });
  });
});
