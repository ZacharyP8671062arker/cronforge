import {
  recordExpression,
  getHistory,
  getRecentExpressions,
  findInHistory,
  clearHistory,
  removeFromHistory,
  getHistoryBySource,
} from './cronHistory';

beforeEach(() => {
  clearHistory();
});

describe('recordExpression', () => {
  it('adds an entry to history', () => {
    recordExpression('0 9 * * 1', 'manual', 'Weekday morning');
    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].expression).toBe('0 9 * * 1');
    expect(history[0].label).toBe('Weekday morning');
    expect(history[0].source).toBe('manual');
  });

  it('moves duplicate to front instead of adding', () => {
    recordExpression('0 9 * * 1', 'manual');
    recordExpression('0 12 * * *', 'preset');
    recordExpression('0 9 * * 1', 'builder');
    const history = getHistory();
    expect(history).toHaveLength(2);
    expect(history[0].expression).toBe('0 9 * * 1');
  });
});

describe('getRecentExpressions', () => {
  it('returns limited list of recent expressions', () => {
    recordExpression('* * * * *', 'manual');
    recordExpression('0 0 * * *', 'preset');
    const recent = getRecentExpressions(1);
    expect(recent).toHaveLength(1);
    expect(recent[0]).toBe('0 0 * * *');
  });
});

describe('findInHistory', () => {
  it('finds an existing entry', () => {
    recordExpression('0 6 * * *', 'nlp', 'Daily 6am');
    const entry = findInHistory('0 6 * * *');
    expect(entry).toBeDefined();
    expect(entry?.label).toBe('Daily 6am');
  });

  it('returns undefined for unknown expression', () => {
    expect(findInHistory('0 99 * * *')).toBeUndefined();
  });
});

describe('removeFromHistory', () => {
  it('removes an existing entry', () => {
    recordExpression('0 9 * * *', 'manual');
    expect(removeFromHistory('0 9 * * *')).toBe(true);
    expect(getHistory()).toHaveLength(0);
  });

  it('returns false when entry not found', () => {
    expect(removeFromHistory('not-here')).toBe(false);
  });
});

describe('getHistoryBySource', () => {
  it('filters entries by source', () => {
    recordExpression('* * * * *', 'manual');
    recordExpression('0 0 * * *', 'preset');
    recordExpression('0 12 * * *', 'nlp');
    expect(getHistoryBySource('preset')).toHaveLength(1);
    expect(getHistoryBySource('nlp')).toHaveLength(1);
    expect(getHistoryBySource('builder')).toHaveLength(0);
  });
});
