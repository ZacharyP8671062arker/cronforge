import {
  recordExpression,
  getHistory,
  getRecentExpressions,
  findInHistory,
  clearHistory,
  removeFromHistory,
  getHistoryBySource,
  HistoryEntry,
} from './cronHistory';

export function trackExpression(
  expression: string,
  source: HistoryEntry['source'] = 'manual',
  label?: string
): void {
  recordExpression(expression, source, label);
}

export function recentExpressions(limit = 10): string[] {
  return getRecentExpressions(limit);
}

export function hasBeenUsed(expression: string): boolean {
  return findInHistory(expression) !== undefined;
}

export function getUsageSource(expression: string): HistoryEntry['source'] | null {
  return findInHistory(expression)?.source ?? null;
}

export {
  getHistory,
  clearHistory,
  removeFromHistory,
  getHistoryBySource,
};
