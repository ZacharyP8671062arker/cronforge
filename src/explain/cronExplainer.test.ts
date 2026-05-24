import { explainCron, compareCronExplanations } from './cronExplainer';

describe('explainCron', () => {
  it('returns valid explanation for a standard expression', () => {
    const result = explainCron('0 9 * * 1-5');
    expect(result.isValid).toBe(true);
    expect(result.fields.minute).toBe('0');
    expect(result.fields.hour).toBe('9');
    expect(result.fields.dayOfWeek).toBe('1-5');
    expect(result.humanReadable).toBeTruthy();
    expect(result.warnings).toHaveLength(0);
  });

  it('returns invalid for a bad expression', () => {
    const result = explainCron('not-a-cron');
    expect(result.isValid).toBe(false);
    expect(result.humanReadable).toBe('Invalid expression');
    expect(result.fields.minute).toBe('');
  });

  it('warns when both dayOfMonth and dayOfWeek are set', () => {
    const result = explainCron('0 12 15 * 3');
    expect(result.warnings.some((w) => w.includes('day-of-month'))).toBe(true);
  });

  it('warns when expression runs every minute', () => {
    const result = explainCron('* * * * *');
    expect(result.warnings.some((w) => w.includes('every minute'))).toBe(true);
  });

  it('provides a nextRunHint for valid expressions', () => {
    const result = explainCron('30 6 * * *');
    expect(result.nextRunHint).not.toBe('N/A');
  });
});

describe('compareCronExplanations', () => {
  it('reports no changes for identical expressions', () => {
    const result = compareCronExplanations('0 9 * * *', '0 9 * * *');
    expect(result.changedFields).toHaveLength(0);
    expect(result.explanation).toContain('identical');
  });

  it('reports changed fields between two expressions', () => {
    const result = compareCronExplanations('0 9 * * *', '0 10 * * *');
    expect(result.changedFields).toContain('hour');
    expect(result.explanation).toContain('hour');
  });
});
