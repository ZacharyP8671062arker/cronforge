import { HistoryEntry, recordExpression, getHistory, clearHistory } from './cronHistory';

export interface HistorySnapshot {
  capturedAt: Date;
  entries: HistoryEntry[];
}

const snapshots: Map<string, HistorySnapshot> = new Map();

export function saveSnapshot(name: string): HistorySnapshot {
  const snapshot: HistorySnapshot = {
    capturedAt: new Date(),
    entries: getHistory(),
  };
  snapshots.set(name, snapshot);
  return snapshot;
}

export function loadSnapshot(name: string): boolean {
  const snapshot = snapshots.get(name);
  if (!snapshot) return false;
  clearHistory();
  for (const entry of [...snapshot.entries].reverse()) {
    recordExpression(entry.expression, entry.source, entry.label);
  }
  return true;
}

export function listSnapshots(): string[] {
  return Array.from(snapshots.keys());
}

export function deleteSnapshot(name: string): boolean {
  return snapshots.delete(name);
}

export function getSnapshot(name: string): HistorySnapshot | undefined {
  return snapshots.get(name);
}
