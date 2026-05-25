import { lintCron, getLintMessages } from './cronLinter';
import { isClean, getLintFeedback, getLintScore, getSignificantIssues } from './index';

describe('lintCron', () => {
  it('returns error for invalid field count', () => {
    const result = lintCron('* * * *');
    expect(result.valid).toBe(false);
    expect(result.rules[0].code).toBe('E001');
    expect(result.score).toBe(0);
  });

  it('warns when all fields are wildcards', () => {
    const result = lintCron('* * * * *');
    expect(result.rules.some((r) => r.code === 'W001')).toBe(true);
  });

  it('warns on high-frequency schedule (*/1)', () => {
    const result = lintCron('*/1 * * * *');
    expect(result.rules.some((r) => r.code === 'W002')).toBe(true);
  });

  it('warns on high-frequency schedule (*/3)', () => {
    const result = lintCron('*/3 * * * *');
    expect(result.rules.some((r) => r.code === 'W002')).toBe(true);
  });

  it('does not warn on acceptable frequency (*/10)', () => {
    const result = lintCron('*/10 * * * *');
    expect(result.rules.some((r) => r.code === 'W002')).toBe(false);
  });

  it('warns when both dom and dow are set', () => {
    const result = lintCron('0 9 15 * 1');
    expect(result.rules.some((r) => r.code === 'W003')).toBe(true);
  });

  it('reports info for redundant /1 step', () => {
    const result = lintCron('0 8/1 * * *');
    expect(result.rules.some((r) => r.code === 'I001')).toBe(true);
  });

  it('reports info when month is set but day fields are wildcards', () => {
    const result = lintCron('0 0 * 6 *');
    expect(result.rules.some((r) => r.code === 'I002')).toBe(true);
  });

  it('returns high score for clean expression', () => {
    const result = lintCron('0 9 * * 1-5');
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.valid).toBe(true);
  });
});

describe('getLintMessages', () => {
  it('formats messages with severity and code', () => {
    const result = lintCron('* * * * *');
    const messages = getLintMessages(result);
    expect(messages[0]).toMatch(/\[WARNING\] W001/);
  });
});

describe('lint index', () => {
  it('isClean returns true for a clean expression', () => {
    expect(isClean('0 12 * * *')).toBe(true);
  });

  it('isClean returns false for all-wildcard expression', () => {
    expect(isClean('* * * * *')).toBe(false);
  });

  it('getLintFeedback returns array of strings', () => {
    const feedback = getLintFeedback('*/2 * * * *');
    expect(Array.isArray(feedback)).toBe(true);
  });

  it('getLintScore returns a number between 0 and 100', () => {
    const score = getLintScore('0 6 * * 1');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('getSignificantIssues excludes info-level rules', () => {
    const issues = getSignificantIssues('0 8/1 * 6 *');
    expect(issues.every((r) => r.severity !== 'info')).toBe(true);
  });
});
