import { summarizeCron, hasWarnings, explainCron } from './index';

describe('summarizeCron', () => {
  it('returns a human-readable summary for a valid expression', () => {
    const summary = summarizeCron('0 0 * * *');
    expect(typeof summary).toBe('string');
    expect(summary.length).toBeGreaterThan(0);
    expect(summary).not.toContain('not a valid');
  });

  it('returns an error message for an invalid expression', () => {
    const summary = summarizeCron('bad input');
    expect(summary).toContain('not a valid cron expression');
  });

  it('appends warnings when present', () => {
    const summary = summarizeCron('* * * * *');
    expect(summary).toContain('Warnings');
  });

  it('does not append warnings when none exist', () => {
    const summary = summarizeCron('0 9 * * 1-5');
    expect(summary).not.toContain('Warnings');
  });
});

describe('hasWarnings', () => {
  it('returns true for expressions with warnings', () => {
    expect(hasWarnings('* * * * *')).toBe(true);
  });

  it('returns false for clean expressions', () => {
    expect(hasWarnings('0 9 * * 1-5')).toBe(false);
  });
});

describe('explainCron re-export', () => {
  it('is accessible from the index', () => {
    const result = explainCron('0 0 1 1 *');
    expect(result).toHaveProperty('isValid');
    expect(result).toHaveProperty('fields');
  });
});
