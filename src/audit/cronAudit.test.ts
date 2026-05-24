import { auditCron, auditFrequency, assessRisk } from './cronAudit';

describe('auditFrequency', () => {
  it('warns when expression runs every minute', () => {
    const warnings = auditFrequency(['*', '*', '*', '*', '*']);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toMatch(/every minute/);
  });

  it('warns when minute step is too small', () => {
    const warnings = auditFrequency(['*/2', '*', '*', '*', '*']);
    expect(warnings.some(w => w.includes('step of 2'))).toBe(true);
  });

  it('does not warn for normal expressions', () => {
    const warnings = auditFrequency(['0', '9', '*', '*', '*']);
    expect(warnings).toHaveLength(0);
  });
});

describe('assessRisk', () => {
  it('returns high risk when errors exist', () => {
    expect(assessRisk([], ['invalid field'])).toBe('high');
  });

  it('returns high risk when multiple warnings exist', () => {
    expect(assessRisk(['warn1', 'warn2'], [])).toBe('high');
  });

  it('returns medium risk for a single warning', () => {
    expect(assessRisk(['warn1'], [])).toBe('medium');
  });

  it('returns low risk when no issues', () => {
    expect(assessRisk([], [])).toBe('low');
  });
});

describe('auditCron', () => {
  it('returns valid audit for a standard expression', () => {
    const result = auditCron('0 9 * * 1-5');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.description).not.toBeNull();
    expect(result.nextRuns.length).toBeGreaterThan(0);
    expect(result.risk).toBe('low');
  });

  it('returns invalid audit for a bad expression', () => {
    const result = auditCron('99 99 99 99 99');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.risk).toBe('high');
    expect(result.nextRuns).toHaveLength(0);
  });

  it('flags high-frequency expressions with warnings', () => {
    const result = auditCron('* * * * *');
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(['medium', 'high']).toContain(result.risk);
  });

  it('respects nextRunCount parameter', () => {
    const result = auditCron('0 0 * * *', 3);
    expect(result.nextRuns.length).toBeLessThanOrEqual(3);
  });
});
