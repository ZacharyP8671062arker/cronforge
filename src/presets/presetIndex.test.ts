import {
  getPresetExpression,
  findPresetNames,
  isKnownPreset,
} from './index';

describe('getPresetExpression', () => {
  it('returns the expression for a known preset', () => {
    expect(getPresetExpression('daily-midnight')).toBe('0 0 * * *');
  });

  it('returns undefined for an unknown preset', () => {
    expect(getPresetExpression('does-not-exist')).toBeUndefined();
  });

  it('returns correct expression for every-15-minutes', () => {
    expect(getPresetExpression('every-15-minutes')).toBe('*/15 * * * *');
  });
});

describe('findPresetNames', () => {
  it('returns matching preset names for a query', () => {
    const names = findPresetNames('hour');
    expect(names.length).toBeGreaterThan(0);
    names.forEach((n) => expect(typeof n).toBe('string'));
  });

  it('returns empty array for no matches', () => {
    expect(findPresetNames('zzznomatch')).toHaveLength(0);
  });
});

describe('isKnownPreset', () => {
  it('returns true for a known preset name', () => {
    expect(isKnownPreset('every-hour')).toBe(true);
  });

  it('returns false for an unknown preset name', () => {
    expect(isKnownPreset('every-second')).toBe(false);
  });
});
