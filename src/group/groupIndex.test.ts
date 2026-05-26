import {
  newGroup,
  assignToGroup,
  unassignFromGroup,
  findGroup,
  getAllGroups,
  removeGroup,
  groupsContaining,
  isInAnyGroup,
  resetGroups,
} from './index';

beforeEach(() => {
  resetGroups();
});

describe('newGroup', () => {
  it('creates and returns a new group', () => {
    const g = newGroup('daily jobs', 'All daily crons');
    expect(g.name).toBe('daily jobs');
    expect(g.id).toBeDefined();
  });
});

describe('assignToGroup / unassignFromGroup', () => {
  it('assigns and unassigns expressions', () => {
    const g = newGroup('test');
    expect(assignToGroup(g.id, '0 12 * * *')).toBe(true);
    expect(findGroup(g.id)?.expressions).toContain('0 12 * * *');
    expect(unassignFromGroup(g.id, '0 12 * * *')).toBe(true);
    expect(findGroup(g.id)?.expressions).not.toContain('0 12 * * *');
  });
});

describe('getAllGroups', () => {
  it('returns all groups', () => {
    newGroup('a');
    newGroup('b');
    expect(getAllGroups().length).toBe(2);
  });
});

describe('removeGroup', () => {
  it('removes a group by id', () => {
    const g = newGroup('removable');
    expect(removeGroup(g.id)).toBe(true);
    expect(findGroup(g.id)).toBeUndefined();
  });
});

describe('groupsContaining', () => {
  it('finds all groups containing an expression', () => {
    const g1 = newGroup('g1');
    const g2 = newGroup('g2');
    assignToGroup(g1.id, '*/5 * * * *');
    assignToGroup(g2.id, '*/5 * * * *');
    const result = groupsContaining('*/5 * * * *');
    expect(result.map(g => g.id)).toContain(g1.id);
    expect(result.map(g => g.id)).toContain(g2.id);
  });
});

describe('isInAnyGroup', () => {
  it('returns true if expression is in at least one group', () => {
    const g = newGroup('check');
    assignToGroup(g.id, '0 0 1 * *');
    expect(isInAnyGroup('0 0 1 * *')).toBe(true);
  });

  it('returns false if expression is in no group', () => {
    expect(isInAnyGroup('0 0 1 * *')).toBe(false);
  });
});
