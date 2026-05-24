import {
  expandField,
  fieldMatchCount,
  fieldsOverlap,
  fieldIntersection,
} from './cronRange';

describe('expandField', () => {
  it('expands wildcard for minutes', () => {
    const result = expandField('*', 'minute');
    expect(result).toHaveLength(60);
    expect(result[0]).toBe(0);
    expect(result[59]).toBe(59);
  });

  it('expands a simple range', () => {
    expect(expandField('1-5', 'hour')).toEqual([1, 2, 3, 4, 5]);
  });

  it('expands a step expression', () => {
    expect(expandField('*/15', 'minute')).toEqual([0, 15, 30, 45]);
  });

  it('expands a step with range', () => {
    expect(expandField('0-6/2', 'hour')).toEqual([0, 2, 4, 6]);
  });

  it('expands a list', () => {
    expect(expandField('1,3,5', 'dayOfWeek')).toEqual([1, 3, 5]);
  });

  it('expands a single value', () => {
    expect(expandField('7', 'hour')).toEqual([7]);
  });

  it('clamps values to field bounds', () => {
    const result = expandField('*', 'dayOfWeek');
    expect(result[0]).toBe(0);
    expect(result[result.length - 1]).toBe(6);
  });

  it('handles combined list with range', () => {
    expect(expandField('1-3,5', 'minute')).toEqual([1, 2, 3, 5]);
  });
});

describe('fieldMatchCount', () => {
  it('returns 60 for wildcard minute', () => {
    expect(fieldMatchCount('*', 'minute')).toBe(60);
  });

  it('returns correct count for step', () => {
    expect(fieldMatchCount('*/10', 'minute')).toBe(6);
  });

  it('returns 1 for single value', () => {
    expect(fieldMatchCount('5', 'hour')).toBe(1);
  });
});

describe('fieldsOverlap', () => {
  it('returns true when expressions share values', () => {
    expect(fieldsOverlap('1-5', '3-7', 'hour')).toBe(true);
  });

  it('returns false when expressions do not share values', () => {
    expect(fieldsOverlap('1-3', '5-7', 'hour')).toBe(false);
  });

  it('returns true for wildcard vs any value', () => {
    expect(fieldsOverlap('*', '30', 'minute')).toBe(true);
  });
});

describe('fieldIntersection', () => {
  it('returns shared values', () => {
    expect(fieldIntersection('1-5', '3-7', 'hour')).toEqual([3, 4, 5]);
  });

  it('returns empty array for no overlap', () => {
    expect(fieldIntersection('1-3', '5-7', 'hour')).toEqual([]);
  });

  it('returns correct intersection with steps', () => {
    expect(fieldIntersection('*/2', '*/3', 'hour')).toEqual([0, 6, 12, 18]);
  });
});
