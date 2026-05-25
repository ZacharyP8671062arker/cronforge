export interface HistoryEntry {
  expression: string;
  label?: string;
  usedAt: Date;
  source: 'manual' | 'nlp' | 'preset' | 'builder';
}

const history: HistoryEntry[] = [];
const MAX_HISTORY = 50;

export function recordExpression(
  expression: string,
  source: HistoryEntry['source'] = 'manual',
  label?: string
): HistoryEntry {
  const entry: HistoryEntry = { expression, label, usedAt: new Date(), source };
  const existing = history.findIndex(e => e.expression === expression);
  if (existing !== -1) {
    history.splice(existing, 1);
  }
  history.unshift(entry);
  if (history.length > MAX_HISTORY) {
    history.splice(MAX_HISTORY);
  }
  return entry;
}

export function getHistory(): HistoryEntry[] {
  return [...history];
}

export function getRecentExpressions(limit = 10): string[] {
  return history.slice(0, limit).map(e => e.expression);
}

export function findInHistory(expression: string): HistoryEntry | undefined {
  return history.find(e => e.expression === expression);
}

export function clearHistory(): void {
  history.splice(0, history.length);
}

export function removeFromHistory(expression: string): boolean {
  const idx = history.findIndex(e => e.expression === expression);
  if (idx !== -1) {
    history.splice(idx, 1);
    return true;
  }
  return false;
}

export function getHistoryBySource(source: HistoryEntry['source']): HistoryEntry[] {
  return history.filter(e => e.source === source);
}
