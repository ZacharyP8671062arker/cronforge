import {
  getAuditSummary,
  isHighRisk,
  describeFrequency,
  getAuditWarnings,
} from './index';

describe('audit index', () => {
  describe('getAuditSummary', () => {
    it('returns a summary object with expected keys', () => {
      const summary = getAuditSummary('0 * * * *');
      expect(summary).toHaveProperty('expression', '0 * * * *');
      expect(summary).toHaveProperty('valid');
      expect(summary).toHaveProperty('riskLevel');
      expect(summary).toHaveProperty('frequencyLabel');
      expect(summary).toHaveProperty('warnings');
      expect(summary).toHaveProperty('suggestions');
    });

    it('marks a valid expression as valid', () => {
      const summary = getAuditSummary('0 9 * * 1-5');
      expect(summary.valid).toBe(true);
    });

    it('marks an invalid expression as invalid', () => {
      const summary = getAuditSummary('invalid cron');
      expect(summary.valid).toBe(false);
    });
  });

  describe('isHighRisk', () => {
    it('returns true for a very frequent expression like * * * * *', () => {
      expect(isHighRisk('* * * * *')).toBe(true);
    });

    it('returns false for a low-frequency expression', () => {
      expect(isHighRisk('0 0 1 1 *')).toBe(false);
    });
  });

  describe('describeFrequency', () => {
    it('returns a non-empty string for a valid expression', () => {
      const label = describeFrequency('0 12 * * *');
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    });
  });

  describe('getAuditWarnings', () => {
    it('returns an array', () => {
      const warnings = getAuditWarnings('* * * * *');
      expect(Array.isArray(warnings)).toBe(true);
    });

    it('returns warnings for a high-frequency expression', () => {
      const warnings = getAuditWarnings('* * * * *');
      expect(warnings.length).toBeGreaterThan(0);
    });

    it('returns no warnings for a safe expression', () => {
      const warnings = getAuditWarnings('0 9 * * 1-5');
      expect(warnings.length).toBe(0);
    });
  });
});
