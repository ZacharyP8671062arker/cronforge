import {
  extractVariables,
  applyTemplate,
  createTemplate,
  renderTemplate,
  isTemplateComplete,
} from './cronTemplate';

describe('extractVariables', () => {
  it('extracts single variable', () => {
    expect(extractVariables('0 {{hour}} * * *')).toEqual(['hour']);
  });

  it('extracts multiple variables', () => {
    const vars = extractVariables('0 {{hour}} {{date}} * {{day}}');
    expect(vars).toContain('hour');
    expect(vars).toContain('date');
    expect(vars).toContain('day');
  });

  it('returns empty array for no variables', () => {
    expect(extractVariables('0 9 * * *')).toEqual([]);
  });

  it('deduplicates repeated variables', () => {
    const vars = extractVariables('{{x}} {{x}} {{y}}');
    expect(vars).toHaveLength(2);
  });
});

describe('applyTemplate', () => {
  it('substitutes variables correctly', () => {
    expect(applyTemplate('0 {{hour}} * * *', { hour: '9' })).toBe('0 9 * * *');
  });

  it('throws on missing variable', () => {
    expect(() => applyTemplate('0 {{hour}} * * *', {})).toThrow('Missing template variable: hour');
  });
});

describe('createTemplate', () => {
  it('creates a template with correct metadata', () => {
    const t = createTemplate('test', '{{min}} {{hour}} * * *', 'A test template');
    expect(t.name).toBe('test');
    expect(t.variables).toContain('min');
    expect(t.variables).toContain('hour');
    expect(t.description).toBe('A test template');
  });
});

describe('renderTemplate', () => {
  it('renders a complete template', () => {
    const t = createTemplate('t', '0 {{hour}} * * *');
    expect(renderTemplate(t, { hour: '12' })).toBe('0 12 * * *');
  });

  it('throws when variables are missing', () => {
    const t = createTemplate('t', '0 {{hour}} {{date}} * *');
    expect(() => renderTemplate(t, { hour: '9' })).toThrow('Missing variables');
  });
});

describe('isTemplateComplete', () => {
  it('returns true when all variables provided', () => {
    const t = createTemplate('t', '*/{{n}} * * * *');
    expect(isTemplateComplete(t, { n: '5' })).toBe(true);
  });

  it('returns false when a variable is missing', () => {
    const t = createTemplate('t', '0 {{hour}} {{date}} * *');
    expect(isTemplateComplete(t, { hour: '9' })).toBe(false);
  });

  it('returns false for empty string value', () => {
    const t = createTemplate('t', '0 {{hour}} * * *');
    expect(isTemplateComplete(t, { hour: '' })).toBe(false);
  });
});
