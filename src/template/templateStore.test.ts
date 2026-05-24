import {
  registerTemplate,
  getTemplate,
  listTemplates,
  removeTemplate,
  hasTemplate,
  clearTemplates,
} from './templateStore';

beforeEach(() => {
  clearTemplates();
});

describe('registerTemplate', () => {
  it('registers and returns a template', () => {
    const t = registerTemplate('my-template', '0 {{hour}} * * *', 'desc');
    expect(t.name).toBe('my-template');
    expect(t.variables).toContain('hour');
  });

  it('overwrites an existing template with the same name', () => {
    registerTemplate('dup', '0 {{hour}} * * *');
    registerTemplate('dup', '*/{{n}} * * * *');
    const t = getTemplate('dup');
    expect(t?.variables).toContain('n');
    expect(t?.variables).not.toContain('hour');
  });
});

describe('getTemplate', () => {
  it('returns undefined for unknown template', () => {
    expect(getTemplate('nonexistent')).toBeUndefined();
  });

  it('retrieves a registered template', () => {
    registerTemplate('t1', '0 9 * * *');
    expect(getTemplate('t1')).toBeDefined();
  });
});

describe('listTemplates', () => {
  it('returns all registered templates', () => {
    registerTemplate('a', '0 1 * * *');
    registerTemplate('b', '0 2 * * *');
    const all = listTemplates();
    expect(all.map((t) => t.name)).toContain('a');
    expect(all.map((t) => t.name)).toContain('b');
  });

  it('returns empty array when store is cleared', () => {
    expect(listTemplates()).toHaveLength(0);
  });
});

describe('removeTemplate', () => {
  it('removes an existing template', () => {
    registerTemplate('to-remove', '0 6 * * *');
    expect(removeTemplate('to-remove')).toBe(true);
    expect(hasTemplate('to-remove')).toBe(false);
  });

  it('returns false when template does not exist', () => {
    expect(removeTemplate('ghost')).toBe(false);
  });
});

describe('hasTemplate', () => {
  it('returns true for registered template', () => {
    registerTemplate('exists', '0 0 * * *');
    expect(hasTemplate('exists')).toBe(true);
  });

  it('returns false for unregistered template', () => {
    expect(hasTemplate('nope')).toBe(false);
  });
});
