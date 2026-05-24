import { diffCron, getChangedFields } from './cronDiff';

describe('diffCron', () => {
  it('returns no changes for identical expressions', () => {
    const result = diffCron('0 9 * * 1', '0 9 * * 1');
    expect(result.hasChanges).toBe(false);
    expect(result.summary).toBe('No changes between expressions');
  });

  it('detects a single field change', () => {
    const result = diffCron('0 9 * * 1', '0 10 * * 1');
    expect(result.hasChanges).toBe(true);
    const hourField = result.fields.find(f => f.field === 'hour');
    expect(hourField?.changed).toBe(true);
    expect(hourField?.from).toBe('9');
    expect(hourField?.to).toBe('10');
  });

  it('detects multiple field changes', () => {
    const result = diffCron('0 9 * * 1', '30 18 * * 5');
    expect(result.hasChanges).toBe(true);
    const changed = result.fields.filter(f => f.changed).map(f => f.field);
    expect(changed).toContain('minute');
    expect(changed).toContain('hour');
    expect(changed).toContain('dayOfWeek');
  });

  it('includes human-readable descriptions for each field', () => {
    const result = diffCron('0 9 * * *', '0 10 * * *');
    const hourField = result.fields.find(f => f.field === 'hour');
    expect(typeof hourField?.fromDescription).toBe('string');
    expect(typeof hourField?.toDescription).toBe('string');
  });

  it('builds a summary string for changed fields', () => {
    const result = diffCron('0 9 * * *', '0 10 * * *');
    expect(result.summary).toContain('hour');
    expect(result.summary).toContain('→');
  });

  it('throws on invalid cron expression', () => {
    expect(() => diffCron('not-valid', '0 9 * * *')).toThrow();
  });
});

describe('getChangedFields', () => {
  it('returns empty array for identical expressions', () => {
    expect(getChangedFields('*/5 * * * *', '*/5 * * * *')).toEqual([]);
  });

  it('returns changed field names', () => {
    const changed = getChangedFields('0 9 * * *', '0 9 1 * *');
    expect(changed).toContain('dayOfMonth');
    expect(changed).not.toContain('minute');
    expect(changed).not.toContain('hour');
  });
});
