/**
 * snapshot/index.ts
 * Public API for cron snapshot management
 */

import {
  captureSnapshot,
  restoreSnapshot,
  listSnapshots,
  deleteSnapshot,
  findSnapshotsByTag,
  findSnapshotsByLabel,
  clearSnapshots,
  snapshotCount,
  type CronSnapshot,
} from './cronSnapshot';

export type { CronSnapshot };

/** Save a cron expression as a named snapshot */
export function saveSnapshot(
  expression: string,
  label?: string,
  tags: string[] = []
): CronSnapshot {
  return captureSnapshot(expression, { label, tags });
}

/** Retrieve a previously saved snapshot by ID */
export function getSnapshot(id: string): CronSnapshot | undefined {
  return restoreSnapshot(id);
}

/** Get all saved snapshots, newest first */
export function getAllSnapshots(): CronSnapshot[] {
  return listSnapshots();
}

/** Remove a snapshot by ID */
export function removeSnapshot(id: string): boolean {
  return deleteSnapshot(id);
}

/** Find snapshots matching a tag */
export function getSnapshotsByTag(tag: string): CronSnapshot[] {
  return findSnapshotsByTag(tag);
}

/** Find snapshots whose label contains the search string */
export function searchSnapshotsByLabel(label: string): CronSnapshot[] {
  return findSnapshotsByLabel(label);
}

/** Returns true if any snapshots have been saved */
export function hasSnapshots(): boolean {
  return snapshotCount() > 0;
}

/**
 * Returns the most recently saved snapshot, or undefined if none exist.
 * Useful for quickly accessing the last captured state without needing an ID.
 */
export function getLatestSnapshot(): CronSnapshot | undefined {
  const snapshots = listSnapshots();
  return snapshots.length > 0 ? snapshots[0] : undefined;
}

export { clearSnapshots };
