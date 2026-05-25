import {
  compareCronExpressions,
  compareFields,
  similarityScore,
  splitExpression,
} from './cronCompare';

describe('splitExpression', () => {
  it('splits a standard 5-field cron expression', () => {
    expect(splitExpression('0 9 * * 1')).toEqual(['0', '9', '*', '*', '1']);
  });

  it('handles extra whitespace', () => {
    expect(splitExpression('  0  9  *  *  1  ')).toEqual(['0', '9', '*', '*', '1']);
  });
});

describe('compareFields', () => {
  it('identifies all matching fields for identical expressions', () => {
    const { matching, differing } = compareFields('0 9 * * 1', '0 9 * * 1');
    expect(matching).toEqual(['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek']);
    expect(differing).toHaveLength(0);
  });

  it('identifies differing fields', () => {
    const { matching, differing } = compareFields('0 9 * * 1', '30 18 * * 5');
    expect(differing).toContain('minute');
    expect(differing).toContain('hour');
    expect(differing).toContain('dayOfWeek');
    expect(matching).toContain('dayOfMonth');
    expect(matching).toContain('month');
  });
});

describe('similarityScore', () => {
  it('returns 1.0 for all matching', () => {
    expect(similarityScore(5, 5)).toBe(1);
  });

  it('returns 0.0 for no matches', () => {
    expect(similarityScore(0, 5)).toBe(0);
  });

  it('returns correct partial score', () => {
    expect(similarityScore(3, 5)).toBe(0.6);
  });
});

describe('compareCronExpressions', () => {
  it('returns identical=true for same expressions', () => {
    const result = compareCronExpressions('0 0 * * *', '0 0 * * *');
    expect(result.identical).toBe(true);
    expect(result.similarityScore).toBe(1);
    expect(result.summary).toMatch(/identical/);
  });

  it('returns high similarity for near-identical expressions', () => {
    const result = compareCronExpressions('0 9 * * 1', '0 9 * * 2');
    expect(result.identical).toBe(false);
    expect(result.similarityScore).toBeGreaterThanOrEqual(0.8);
    expect(result.differingFields).toEqual(['dayOfWeek']);
  });

  it('returns low similarity for very different expressions', () => {
    const result = compareCronExpressions('0 0 1 1 *', '30 23 15 6 5');
    expect(result.similarityScore).toBeLessThan(0.5);
  });

  it('includes expressionA and expressionB in result', () => {
    const result = compareCronExpressions('* * * * *', '0 0 * * *');
    expect(result.expressionA).toBe('* * * * *');
    expect(result.expressionB).toBe('0 0 * * *');
  });
});
