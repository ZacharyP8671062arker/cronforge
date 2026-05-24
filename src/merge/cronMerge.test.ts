import { mergeField, mergeCrons, cronOverlaps } from './cronMerge';

describe('mergeField', () => {
  it('returns the same value when both fields are identical', () => {
    expect(mergeField('5', '5', 'minute')).toEqual({ value: '5', conflict: null });
  });

  it('returns b when a is wildcard', () => {
    expect(mergeField('*', '10', 'hour')).toEqual({ value: '10', conflict: null });
  });

  it('returns a when b is wildcard', () => {
    expect(mergeField('10', '*', 'hour')).toEqual({ value: '10', conflict: null });
  });

  it('combines different values with comma', () => {
    const result = mergeField('5', '10', 'minute');
    expect(result.value).toBe('5,10');
    expect(result.conflict).toBeNull();
  });
});

describe('mergeCrons', () => {
  it('returns default wildcard for empty input', () => {
    const result = mergeCrons([]);
    expect(result.merged).toBe('* * * * *');
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('returns the single expression unchanged', () => {
    const result = mergeCrons(['0 9 * * 1']);
    expect(result.merged).toBe('0 9 * * 1');
    expect(result.conflicts).toHaveLength(0);
  });

  it('merges two compatible expressions', () => {
    const result = mergeCrons(['0 9 * * *', '0 17 * * *']);
    expect(result.merged).toBe('0 9,17 * * *');
    expect(result.conflicts).toHaveLength(0);
  });

  it('merges wildcard fields correctly', () => {
    const result = mergeCrons(['* * * * *', '30 6 * * *']);
    expect(result.merged).toBe('30 6 * * *');
  });

  it('returns conflict for invalid expressions', () => {
    const result = mergeCrons(['not a cron']);
    expect(result.conflicts.length).toBeGreaterThan(0);
    expect(result.merged).toBe('');
  });

  it('merges three expressions', () => {
    const result = mergeCrons(['0 8 * * *', '0 12 * * *', '0 18 * * *']);
    expect(result.merged).toBe('0 8,12,18 * * *');
    expect(result.conflicts).toHaveLength(0);
  });
});

describe('cronOverlaps', () => {
  it('returns true for identical expressions', () => {
    expect(cronOverlaps('0 9 * * *', '0 9 * * *')).toBe(true);
  });

  it('returns true when one is a full wildcard', () => {
    expect(cronOverlaps('* * * * *', '0 9 * * 1')).toBe(true);
  });

  it('returns false for non-overlapping expressions', () => {
    expect(cronOverlaps('0 9 * * 1', '0 9 * * 2')).toBe(false);
  });

  it('returns true when comma-separated values share a value', () => {
    expect(cronOverlaps('0 9,17 * * *', '0 17,20 * * *')).toBe(true);
  });

  it('returns false for invalid expressions', () => {
    expect(cronOverlaps('invalid', '0 9 * * *')).toBe(false);
  });
});
