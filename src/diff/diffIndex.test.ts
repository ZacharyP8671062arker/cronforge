import { compareCron, isSameCron, changedFields } from './index';

describe('compareCron', () => {
  it('returns a CronDiffResult with fields array', () => {
    const result = compareCron('0 9 * * *', '0 10 * * *');
    expect(Array.isArray(result.fields)).toBe(true);
    expect(result.fields).toHaveLength(5);
  });

  it('marks hasChanges correctly', () => {
    expect(compareCron('0 9 * * *', '0 9 * * *').hasChanges).toBe(false);
    expect(compareCron('0 9 * * *', '0 10 * * *').hasChanges).toBe(true);
  });
});

describe('isSameCron', () => {
  it('returns true for identical expressions', () => {
    expect(isSameCron('*/15 * * * *', '*/15 * * * *')).toBe(true);
  });

  it('returns false for different expressions', () => {
    expect(isSameCron('0 9 * * 1', '0 9 * * 5')).toBe(false);
  });

  it('returns false for invalid expressions without throwing', () => {
    expect(isSameCron('bad', '0 9 * * *')).toBe(false);
  });
});

describe('changedFields', () => {
  it('returns names of changed fields only', () => {
    const fields = changedFields('0 9 * * *', '0 9 1 3 *');
    expect(fields).toContain('dayOfMonth');
    expect(fields).toContain('month');
    expect(fields).not.toContain('minute');
    expect(fields).not.toContain('hour');
    expect(fields).not.toContain('dayOfWeek');
  });

  it('returns empty array when nothing changed', () => {
    expect(changedFields('0 0 * * *', '0 0 * * *')).toEqual([]);
  });
});
