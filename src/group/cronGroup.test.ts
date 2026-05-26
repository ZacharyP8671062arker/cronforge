import {
  createGroup,
  addToGroup,
  removeFromGroup,
  getGroup,
  listGroups,
  deleteGroup,
  getGroupsForExpression,
  clearGroups,
} from './cronGroup';

beforeEach(() => {
  clearGroups();
});

describe('createGroup', () => {
  it('creates a group with name and description', () => {
    const g = createGroup('nightly', 'Runs at night');
    expect(g.name).toBe('nightly');
    expect(g.description).toBe('Runs at night');
    expect(g.expressions).toEqual([]);
    expect(g.id).toMatch(/^group_/);
  });

  it('creates a group without description', () => {
    const g = createGroup('hourly');
    expect(g.description).toBeUndefined();
  });
});

describe('addToGroup', () => {
  it('adds an expression to a group', () => {
    const g = createGroup('test');
    const result = addToGroup(g.id, '0 * * * *');
    expect(result).toBe(true);
    expect(getGroup(g.id)?.expressions).toContain('0 * * * *');
  });

  it('does not add duplicate expressions', () => {
    const g = createGroup('test');
    addToGroup(g.id, '0 * * * *');
    addToGroup(g.id, '0 * * * *');
    expect(getGroup(g.id)?.expressions.length).toBe(1);
  });

  it('returns false for unknown group', () => {
    expect(addToGroup('unknown', '0 * * * *')).toBe(false);
  });
});

describe('removeFromGroup', () => {
  it('removes an expression from a group', () => {
    const g = createGroup('test');
    addToGroup(g.id, '0 * * * *');
    const result = removeFromGroup(g.id, '0 * * * *');
    expect(result).toBe(true);
    expect(getGroup(g.id)?.expressions).not.toContain('0 * * * *');
  });

  it('returns false if expression not in group', () => {
    const g = createGroup('test');
    expect(removeFromGroup(g.id, '0 * * * *')).toBe(false);
  });
});

describe('listGroups', () => {
  it('returns all created groups', () => {
    createGroup('a');
    createGroup('b');
    expect(listGroups().length).toBe(2);
  });
});

describe('deleteGroup', () => {
  it('deletes an existing group', () => {
    const g = createGroup('temp');
    expect(deleteGroup(g.id)).toBe(true);
    expect(getGroup(g.id)).toBeUndefined();
  });
});

describe('getGroupsForExpression', () => {
  it('returns groups containing the expression', () => {
    const g1 = createGroup('g1');
    const g2 = createGroup('g2');
    addToGroup(g1.id, '0 0 * * *');
    addToGroup(g2.id, '0 0 * * *');
    const result = getGroupsForExpression('0 0 * * *');
    expect(result.length).toBe(2);
  });

  it('returns empty array if expression not in any group', () => {
    expect(getGroupsForExpression('0 0 * * *')).toEqual([]);
  });
});
