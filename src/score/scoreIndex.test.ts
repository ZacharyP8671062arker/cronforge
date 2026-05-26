import {
  getCronScore,
  getReadabilityScore,
  getSpecificityScore,
  getBestPracticesScore,
  isHighQuality,
  getScoreGrade,
} from './index';

describe('score index', () => {
  describe('getCronScore', () => {
    it('returns a full score object for a well-formed expression', () => {
      const score = getCronScore('0 9 * * 1-5');
      expect(score).toHaveProperty('total');
      expect(score).toHaveProperty('readability');
      expect(score).toHaveProperty('specificity');
      expect(score).toHaveProperty('bestPractices');
      expect(score).toHaveProperty('grade');
    });

    it('assigns a grade based on total score', () => {
      const score = getCronScore('0 9 * * 1-5');
      expect(['A', 'B', 'C', 'D', 'F']).toContain(score.grade);
    });

    it('returns numeric scores in valid range', () => {
      const score = getCronScore('* * * * *');
      expect(score.total).toBeGreaterThanOrEqual(0);
      expect(score.total).toBeLessThanOrEqual(100);
    });
  });

  describe('getReadabilityScore', () => {
    it('returns a number for a valid expression', () => {
      const result = getReadabilityScore('0 0 * * *');
      expect(typeof result).toBe('number');
    });
  });

  describe('getSpecificityScore', () => {
    it('returns a higher score for more specific expressions', () => {
      const specific = getSpecificityScore('30 8 1 1 *');
      const broad = getSpecificityScore('* * * * *');
      expect(specific).toBeGreaterThan(broad);
    });
  });

  describe('getBestPracticesScore', () => {
    it('returns a number for a valid expression', () => {
      const result = getBestPracticesScore('0 12 * * *');
      expect(typeof result).toBe('number');
    });
  });

  describe('isHighQuality', () => {
    it('returns true for a well-scored expression', () => {
      const result = isHighQuality('0 9 * * 1-5');
      expect(typeof result).toBe('boolean');
    });

    it('returns false for a very broad expression', () => {
      const result = isHighQuality('* * * * *');
      expect(result).toBe(false);
    });
  });

  describe('getScoreGrade', () => {
    it('returns a letter grade', () => {
      const grade = getScoreGrade('0 9 * * 1-5');
      expect(['A', 'B', 'C', 'D', 'F']).toContain(grade);
    });

    it('returns F for a very low scoring expression', () => {
      const grade = getScoreGrade('* * * * *');
      expect(grade).toBe('F');
    });
  });
});
