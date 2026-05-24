import {
  suggestByPartialInput,
  suggestSimilar,
  suggestFromKeyword,
} from './cronSuggester';
import {
  getPartialSuggestions,
  getSimilarExpressions,
  getKeywordSuggestions,
  hasSuggestions,
} from './index';

describe('suggestByPartialInput', () => {
  it('returns suggestions for a single wildcard', () => {
    const results = suggestByPartialInput('*');
    expect(results.length).toBeGreaterThan(0);
    results.forEach((r) => expect(r.expression).toBeDefined());
  });

  it('returns exact match with high score', () => {
    const results = suggestByPartialInput('0 0 * * *');
    const match = results.find((r) => r.expression === '0 0 * * *');
    expect(match).toBeDefined();
    expect(match!.score).toBeGreaterThanOrEqual(10);
  });

  it('returns at most 5 suggestions', () => {
    const results = suggestByPartialInput('0');
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it('returns empty for clearly non-matching input', () => {
    const results = suggestByPartialInput('99 99 99 99 99');
    expect(results.length).toBe(0);
  });
});

describe('suggestSimilar', () => {
  it('returns similar expressions for a valid cron', () => {
    const results = suggestSimilar('0 0 * * *');
    expect(Array.isArray(results)).toBe(true);
    results.forEach((r) => expect(r.expression).not.toBe('0 0 * * *'));
  });

  it('returns empty for invalid cron', () => {
    const results = suggestSimilar('not a cron');
    expect(results).toHaveLength(0);
  });

  it('returns at most 3 suggestions', () => {
    const results = suggestSimilar('0 9 * * *');
    expect(results.length).toBeLessThanOrEqual(3);
  });
});

describe('suggestFromKeyword', () => {
  it('returns suggestions for a known keyword', () => {
    const results = suggestFromKeyword('daily');
    expect(Array.isArray(results)).toBe(true);
  });

  it('each suggestion has required fields', () => {
    const results = suggestFromKeyword('hourly');
    results.forEach((r) => {
      expect(r.expression).toBeDefined();
      expect(r.label).toBeDefined();
      expect(r.description).toBeDefined();
    });
  });
});

describe('index exports', () => {
  it('getPartialSuggestions returns string array', () => {
    const results = getPartialSuggestions('0 0');
    results.forEach((r) => expect(typeof r).toBe('string'));
  });

  it('getSimilarExpressions returns string array', () => {
    const results = getSimilarExpressions('*/5 * * * *');
    results.forEach((r) => expect(typeof r).toBe('string'));
  });

  it('getKeywordSuggestions returns CronSuggestion array', () => {
    const results = getKeywordSuggestions('weekly');
    expect(Array.isArray(results)).toBe(true);
  });

  it('hasSuggestions returns true for partial wildcard', () => {
    expect(hasSuggestions('*')).toBe(true);
  });

  it('hasSuggestions returns false for nonsense input', () => {
    expect(hasSuggestions('99 99 99 99 99')).toBe(false);
  });
});
