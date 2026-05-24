import { parseCron, ParseResult } from './cronParser';

describe('parseCron', () => {
  describe('valid expressions', () => {
    it('should parse a simple every-minute expression', () => {
      const result = parseCron('* * * * *');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.fields).toEqual({
        minute: '*',
        hour: '*',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*',
      });
    });

    it('should parse a specific time expression', () => {
      const result = parseCron('30 9 * * 1');
      expect(result.valid).toBe(true);
      expect(result.fields?.minute).toBe('30');
      expect(result.fields?.hour).toBe('9');
      expect(result.fields?.dayOfWeek).toBe('1');
    });

    it('should parse step values', () => {
      const result = parseCron('*/15 * * * *');
      expect(result.valid).toBe(true);
    });

    it('should parse range values', () => {
      const result = parseCron('0 9-17 * * 1-5');
      expect(result.valid).toBe(true);
    });

    it('should parse comma-separated values', () => {
      const result = parseCron('0 8,12,18 * * *');
      expect(result.valid).toBe(true);
    });

    it('should trim leading/trailing whitespace', () => {
      const result = parseCron('  * * * * *  ');
      expect(result.valid).toBe(true);
    });
  });

  describe('invalid expressions', () => {
    it('should reject expressions with wrong number of fields', () => {
      const result = parseCron('* * * *');
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toMatch(/Expected 5 fields/);
    });

    it('should reject out-of-range minute values', () => {
      const result = parseCron('60 * * * *');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('minute'))).toBe(true);
    });

    it('should reject out-of-range hour values', () => {
      const result = parseCron('0 24 * * *');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('hour'))).toBe(true);
    });

    it('should reject invalid range where start > end', () => {
      const result = parseCron('0 17-9 * * *');
      expect(result.valid).toBe(false);
    });

    it('should reject invalid step values', () => {
      const result = parseCron('*/0 * * * *');
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('step'))).toBe(true);
    });

    it('should not return fields on invalid expression', () => {
      const result = parseCron('99 * * * *');
      expect(result.valid).toBe(false);
      expect(result.fields).toBeUndefined();
    });
  });
});
