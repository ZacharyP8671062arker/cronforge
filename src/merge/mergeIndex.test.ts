import { mergeExpressions, getMergeResult, canMerge, doExpressionsOverlap } from './index';

describe('mergeExpressions', () => {
  it('returns merged expression for valid inputs', () => {
    const result = mergeExpressions(['0 8 * * *', '0 20 * * *']);
    expect(result).toBe('0 8,20 * * *');
  });

  it('returns empty string when merge has conflicts', () => {
    const result = mergeExpressions(['bad input']);
    expect(result).toBe('');
  });

  it('returns single expression unchanged', () => {
    expect(mergeExpressions(['5 4 * * 0'])).toBe('5 4 * * 0');
  });
});

describe('getMergeResult', () => {
  it('returns full result object', () => {
    const result = getMergeResult(['0 9 * * *', '0 17 * * *']);
    expect(result).toHaveProperty('merged');
    expect(result).toHaveProperty('conflicts');
    expect(result).toHaveProperty('warnings');
  });

  it('includes warnings for empty input', () => {
    const result = getMergeResult([]);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});

describe('canMerge', () => {
  it('returns true for valid expressions', () => {
    expect(canMerge(['0 9 * * *', '0 18 * * *'])).toBe(true);
  });

  it('returns false for invalid expressions', () => {
    expect(canMerge(['not valid'])).toBe(false);
  });

  it('returns true for empty array (no conflicts)', () => {
    expect(canMerge([])).toBe(true);
  });
});

describe('doExpressionsOverlap', () => {
  it('detects overlap between two wildcard expressions', () => {
    expect(doExpressionsOverlap('* * * * *', '0 9 * * *')).toBe(true);
  });

  it('returns false for non-overlapping day-of-week', () => {
    expect(doExpressionsOverlap('0 9 * * 1', '0 9 * * 5')).toBe(false);
  });
});
