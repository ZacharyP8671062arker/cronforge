import { clearHistory, recordExpression } from './cronHistory';
import {
  saveSnapshot,
  loadSnapshot,
  listSnapshots,
  deleteSnapshot,
  getSnapshot,
} from './historyStore';

beforeEach(() => {
  clearHistory();
});

describe('saveSnapshot', () => {
  it('captures current history into a named snapshot', () => {
    recordExpression('0 9 * * *', 'manual');
    const snap = saveSnapshot('morning');
    expect(snap.entries).toHaveLength(1);
    expect(snap.entries[0].expression).toBe('0 9 * * *');
  });
});

describe('loadSnapshot', () => {
  it('restores history from a snapshot', () => {
    recordExpression('0 9 * * *', 'manual');
    saveSnapshot('test');
    clearHistory();
    expect(loadSnapshot('test')).toBe(true);
    const { getHistory } = require('./cronHistory');
    const history = getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].expression).toBe('0 9 * * *');
  });

  it('returns false for unknown snapshot', () => {
    expect(loadSnapshot('nonexistent')).toBe(false);
  });
});

describe('listSnapshots', () => {
  it('lists all saved snapshot names', () => {
    saveSnapshot('snap1');
    saveSnapshot('snap2');
    expect(listSnapshots()).toContain('snap1');
    expect(listSnapshots()).toContain('snap2');
  });
});

describe('deleteSnapshot', () => {
  it('removes a snapshot by name', () => {
    saveSnapshot('toDelete');
    expect(deleteSnapshot('toDelete')).toBe(true);
    expect(getSnapshot('toDelete')).toBeUndefined();
  });

  it('returns false when snapshot not found', () => {
    expect(deleteSnapshot('missing')).toBe(false);
  });
});
