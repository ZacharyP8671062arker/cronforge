import {
  getCompareResult,
  areIdentical,
  getSimilarityScore,
  getDifferingFields,
  getMatchingFields,
} from './index';

describe('areIdentical', () => {
  it('returns true for identical expressions', () => {
    expect(areIdentical('0 0 * * *', '0 0 * * *')).toBe(true);
  });

  it('returns false for different expressions', () => {
    expect(areIdentical('0 0 * * *', '0 12 * * *')).toBe(false);
  });

  it('trims whitespace before comparing', () => {
    expect(areIdentical('  0 0 * * *  ', '0 0 * * *')).toBe(true);
  });
});

describe('getSimilarityScore', () => {
  it('returns 1 for identical expressions', () => {
    expect(getSimilarityScore('0 9 * * 1', '0 9 * * 1')).toBe(1);
  });

  it('returns a value between 0 and 1 for partial matches', () => {
    const score = getSimilarityScore('0 9 * * 1', '0 18 * * 5');
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(1);
  });
});

describe('getDifferingFields', () => {
  it('returns empty array for identical expressions', () => {
    expect(getDifferingFields('* * * * *', '* * * * *')).toEqual([]);
  });

  it('returns differing field names', () => {
    const fields = getDifferingFields('0 9 * * *', '0 17 * * *');
    expect(fields).toContain('hour');
    expect(fields).not.toContain('minute');
  });
});

describe('getMatchingFields', () => {
  it('returns all fields for identical expressions', () => {
    const fields = getMatchingFields('0 9 * * 1', '0 9 * * 1');
    expect(fields).toHaveLength(5);
  });

  it('returns only matching field names', () => {
    const fields = getMatchingFields('0 9 * * 1', '30 9 * * 1');
    expect(fields).toContain('hour');
    expect(fields).not.toContain('minute');
  });
});

describe('getCompareResult', () => {
  it('returns a full comparison result object', () => {
    const result = getCompareResult('0 0 * * *', '0 12 * * *');
    expect(result).toHaveProperty('identical');
    expect(result).toHaveProperty('similarityScore');
    expect(result).toHaveProperty('matchingFields');
    expect(result).toHaveProperty('differingFields');
    expect(result).toHaveProperty('summary');
  });
});
