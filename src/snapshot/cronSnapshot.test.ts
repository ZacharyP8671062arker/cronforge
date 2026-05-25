import {
  captureSnapshot,
  restoreSnapshot,
  listSnapshots,
  deleteSnapshot,
  findSnapshotsByTag,
  findSnapshotsByLabel,
  clearSnapshots,
  snapshotCount,
} from './cronSnapshot';

beforeEach(() => {
  clearSnapshots();
});

describe('captureSnapshot', () => {
  it('creates a snapshot with a unique id', () => {
    const s1 = captureSnapshot('* * * * *');
    const s2 = captureSnapshot('0 9 * * 1');
    expect(s1.id).not.toBe(s2.id);
  });

  it('stores the expression and defaults', () => {
    const snap = captureSnapshot('0 0 * * *', { label: 'midnight' });
    expect(snap.expression).toBe('0 0 * * *');
    expect(snap.label).toBe('midnight');
    expect(snap.tags).toEqual([]);
    expect(snap.createdAt).toBeInstanceOf(Date);
  });

  it('stores tags and metadata', () => {
    const snap = captureSnapshot('*/5 * * * *', {
      tags: ['frequent', 'polling'],
      metadata: { owner: 'team-a' },
    });
    expect(snap.tags).toContain('frequent');
    expect(snap.metadata.owner).toBe('team-a');
  });
});

describe('restoreSnapshot', () => {
  it('returns the snapshot for a known id', () => {
    const snap = captureSnapshot('0 12 * * *');
    expect(restoreSnapshot(snap.id)).toEqual(snap);
  });

  it('returns undefined for unknown id', () => {
    expect(restoreSnapshot('nonexistent')).toBeUndefined();
  });
});

describe('listSnapshots', () => {
  it('returns snapshots newest first', () => {
    captureSnapshot('* * * * *');
    captureSnapshot('0 9 * * 1');
    const list = listSnapshots();
    expect(list.length).toBe(2);
    expect(list[0].createdAt.getTime()).toBeGreaterThanOrEqual(
      list[1].createdAt.getTime()
    );
  });
});

describe('deleteSnapshot', () => {
  it('removes a snapshot by id', () => {
    const snap = captureSnapshot('0 0 1 * *');
    expect(deleteSnapshot(snap.id)).toBe(true);
    expect(restoreSnapshot(snap.id)).toBeUndefined();
  });

  it('returns false for unknown id', () => {
    expect(deleteSnapshot('ghost')).toBe(false);
  });
});

describe('findSnapshotsByTag', () => {
  it('returns only snapshots with matching tag', () => {
    captureSnapshot('* * * * *', { tags: ['test'] });
    captureSnapshot('0 0 * * *', { tags: ['prod'] });
    const results = findSnapshotsByTag('test');
    expect(results.length).toBe(1);
    expect(results[0].tags).toContain('test');
  });
});

describe('findSnapshotsByLabel', () => {
  it('returns snapshots with label containing search string (case-insensitive)', () => {
    captureSnapshot('0 6 * * *', { label: 'Morning Job' });
    captureSnapshot('0 22 * * *', { label: 'Night Job' });
    const results = findSnapshotsByLabel('morning');
    expect(results.length).toBe(1);
    expect(results[0].label).toBe('Morning Job');
  });
});

describe('snapshotCount', () => {
  it('returns the number of stored snapshots', () => {
    expect(snapshotCount()).toBe(0);
    captureSnapshot('* * * * *');
    captureSnapshot('0 0 * * *');
    expect(snapshotCount()).toBe(2);
  });
});
