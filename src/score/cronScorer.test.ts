import { scoreCron, scoreReadability, scoreSpecificity, scoreBestPractices } from './cronScorer';

describe('scoreReadability', () => {
  it('returns full score for clean expression', () => {
    const { score, notes } = scoreReadability(['0', '9', '*', '*', '1']);
    expect(score).toBe(100);
    expect(notes).toHaveLength(0);
  });

  it('penalizes */1 usage', () => {
    const { score, notes } = scoreReadability(['*/1', '*', '*', '*', '*']);
    expect(score).toBeLessThan(100);
    expect(notes[0]).toContain('*/1');
  });

  it('penalizes excessive comma-separated values', () => {
    const { score, notes } = scoreReadability(['1,2,3,4,5,6', '*', '*', '*', '*']);
    expect(score).toBeLessThan(100);
    expect(notes[0]).toContain('comma-separated');
  });
});

describe('scoreSpecificity', () => {
  it('returns high score for specific expression', () => {
    const { score } = scoreSpecificity(['0', '9', '1', '1', '1']);
    expect(score).toBe(100);
  });

  it('penalizes wildcards in minute and hour', () => {
    const { score, notes } = scoreSpecificity(['*', '*', '*', '*', '*']);
    expect(score).toBeLessThan(50);
    expect(notes.length).toBeGreaterThan(0);
  });

  it('reduces score proportionally with wildcard count', () => {
    const { score: s1 } = scoreSpecificity(['*', '9', '*', '*', '*']);
    const { score: s2 } = scoreSpecificity(['*', '*', '*', '*', '*']);
    expect(s1).toBeGreaterThan(s2);
  });
});

describe('scoreBestPractices', () => {
  it('penalizes every-minute expressions', () => {
    const { score, notes } = scoreBestPractices(['*', '*', '*', '*', '*']);
    expect(score).toBeLessThan(80);
    expect(notes.some(n => n.includes('every minute'))).toBe(true);
  });

  it('penalizes both dom and dow being set', () => {
    const { score, notes } = scoreBestPractices(['0', '9', '1', '*', '1']);
    expect(score).toBeLessThan(100);
    expect(notes.some(n => n.includes('day-of-month'))).toBe(true);
  });

  it('penalizes very high frequency intervals', () => {
    const { score, notes } = scoreBestPractices(['*/2', '*', '*', '*', '*']);
    expect(score).toBeLessThan(100);
    expect(notes.some(n => n.includes('interval'))).toBe(true);
  });

  it('gives full score for well-formed expression', () => {
    const { score } = scoreBestPractices(['0', '9', '*', '*', '1']);
    expect(score).toBe(100);
  });
});

describe('scoreCron', () => {
  it('returns zero score for invalid expression', () => {
    const result = scoreCron('* * *');
    expect(result.total).toBe(0);
    expect(result.details[0]).toContain('Invalid');
  });

  it('scores a clean daily expression highly', () => {
    const result = scoreCron('0 9 * * 1');
    expect(result.total).toBeGreaterThanOrEqual(70);
  });

  it('scores an every-minute expression poorly', () => {
    const result = scoreCron('* * * * *');
    expect(result.total).toBeLessThan(60);
  });

  it('returns all score dimensions', () => {
    const result = scoreCron('0 12 * * *');
    expect(result).toHaveProperty('readability');
    expect(result).toHaveProperty('specificity');
    expect(result).toHaveProperty('bestPractices');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('details');
  });

  it('details array collects issues from all dimensions', () => {
    const result = scoreCron('*/1 * 1 * 1');
    expect(result.details.length).toBeGreaterThan(0);
  });
});
