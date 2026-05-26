import {
  exportExpressions,
  exportAsJson,
  exportAsYaml,
  exportAsCsv,
  exportAsText,
  getSupportedFormats,
  isExportFormat,
} from './index';
import type { ExportRecord } from './index';

const records: ExportRecord[] = [
  { expression: '0 0 * * *', label: 'Daily Midnight', tags: ['daily'] },
  { expression: '0 12 * * 0', label: 'Sunday Noon' },
];

describe('exportExpressions', () => {
  it('defaults to json format', () => {
    const result = exportExpressions(records);
    const parsed = JSON.parse(result);
    expect(parsed).toHaveLength(2);
  });

  it('accepts explicit format', () => {
    const csv = exportExpressions(records, 'csv');
    expect(csv).toContain('expression,label');
  });
});

describe('exportAsJson', () => {
  it('returns valid JSON string', () => {
    const result = exportAsJson(records);
    expect(() => JSON.parse(result)).not.toThrow();
  });
});

describe('exportAsYaml', () => {
  it('returns yaml with header', () => {
    const result = exportAsYaml(records);
    expect(result).toContain('cron_expressions:');
  });
});

describe('exportAsCsv', () => {
  it('returns csv with header row', () => {
    const result = exportAsCsv(records);
    expect(result.split('\n')[0]).toBe('expression,label,description,tags,createdAt');
  });
});

describe('exportAsText', () => {
  it('returns plain text lines', () => {
    const result = exportAsText(records);
    expect(result).toContain('0 0 * * *');
    expect(result).toContain('# Daily Midnight');
  });
});

describe('getSupportedFormats', () => {
  it('returns all four formats', () => {
    const formats = getSupportedFormats();
    expect(formats).toContain('json');
    expect(formats).toContain('yaml');
    expect(formats).toContain('csv');
    expect(formats).toContain('text');
    expect(formats).toHaveLength(4);
  });
});

describe('isExportFormat', () => {
  it('returns true for valid formats', () => {
    expect(isExportFormat('json')).toBe(true);
    expect(isExportFormat('yaml')).toBe(true);
    expect(isExportFormat('csv')).toBe(true);
    expect(isExportFormat('text')).toBe(true);
  });

  it('returns false for invalid formats', () => {
    expect(isExportFormat('xml')).toBe(false);
    expect(isExportFormat('')).toBe(false);
    expect(isExportFormat('markdown')).toBe(false);
  });
});
