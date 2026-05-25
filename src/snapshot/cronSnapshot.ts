/**
 * cronSnapshot.ts
 * Captures and restores full cron expression state snapshots
 */

export interface CronSnapshot {
  id: string;
  expression: string;
  label?: string;
  tags: string[];
  createdAt: Date;
  metadata: Record<string, unknown>;
}

const snapshots = new Map<string, CronSnapshot>();

function generateId(): string {
  return `snap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function captureSnapshot(
  expression: string,
  options: { label?: string; tags?: string[]; metadata?: Record<string, unknown> } = {}
): CronSnapshot {
  const snapshot: CronSnapshot = {
    id: generateId(),
    expression,
    label: options.label,
    tags: options.tags ?? [],
    createdAt: new Date(),
    metadata: options.metadata ?? {},
  };
  snapshots.set(snapshot.id, snapshot);
  return snapshot;
}

export function restoreSnapshot(id: string): CronSnapshot | undefined {
  return snapshots.get(id);
}

export function listSnapshots(): CronSnapshot[] {
  return Array.from(snapshots.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export function deleteSnapshot(id: string): boolean {
  return snapshots.delete(id);
}

export function findSnapshotsByTag(tag: string): CronSnapshot[] {
  return listSnapshots().filter((s) => s.tags.includes(tag));
}

export function findSnapshotsByLabel(label: string): CronSnapshot[] {
  return listSnapshots().filter(
    (s) => s.label?.toLowerCase().includes(label.toLowerCase())
  );
}

export function clearSnapshots(): void {
  snapshots.clear();
}

export function snapshotCount(): number {
  return snapshots.size;
}
