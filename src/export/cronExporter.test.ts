import { exportCrons, exportToJson, exportToYaml, exportToCsv, exportToText } from './cronExporter';
import type { ExportRecord } from './cronExporter';

const sampleRecords: ExportRecord[] = [
  {
    expression: '0 9 * * 1-5',
    label: 'Weekday Morning',
    description: 'Runs at 9am on weekdays',
    tags: ['work', 'morning'],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    expression: '*/15 * * * *',
    label: 'Every 15 Minutes',
    description: 'Frequent check',
    tags: ['frequent'],
    createdAt: '2024-01-02T00:00:00Z',
  },
];

describe('exportToJson', () => {
  it('should produce valid JSON', () => {
    const result = exportToJson(sampleRecords);
    const parsed = JSON.parse(result);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].expression).toBe('0 9 * * 1-5');
  });

  it('should handle empty records', () => {
    expect(exportToJson([])).toBe('[]');
  });
});

describe('exportToYaml', () => {
  it('should include cron_expressions header', () => {
    const result = exportToYaml(sampleRecords);
    expect(result).toContain('cron_expressions:');
    expect(result).toContain('expression: "0 9 * * 1-5"');
    expect(result).toContain('label: "Weekday Morning"');
    expect(result).toContain('tags: ["work", "morning"]');
  });

  it('should skip missing optional fields', () => {
    const result = exportToYaml([{ expression: '* * * * *' }]);
    expect(result).not.toContain('label:');
    expect(result).not.toContain('tags:');
  });
});

describe('exportToCsv', () => {
  it('should include header row', () => {
    const result = exportToCsv(sampleRecords);
    expect(result.startsWith('expression,label,description,tags,createdAt')).toBe(true);
  });

  it('should produce correct number of rows', () => {
    const result = exportToCsv(sampleRecords);
    const rows = result.split('\n');
    expect(rows).toHaveLength(3); // header + 2 data rows
  });

  it('should join tags with semicolon', () => {
    const result = exportToCsv(sampleRecords);
    expect(result).toContain('work;morning');
  });
});

describe('exportToText', () => {
  it('should include expression and label', () => {
    const result = exportToText(sampleRecords);
    expect(result).toContain('0 9 * * 1-5');
    expect(result).toContain('# Weekday Morning');
  });

  it('should include description as comment', () => {
    const result = exportToText(sampleRecords);
    expect(result).toContain('// Runs at 9am on weekdays');
  });
});

describe('exportCrons', () => {
  it('should delegate to correct format', () => {
    expect(() => exportCrons(sampleRecords, 'json')).not.toThrow();
    expect(() => exportCrons(sampleRecords, 'yaml')).not.toThrow();
    expect(() => exportCrons(sampleRecords, 'csv')).not.toThrow();
    expect(() => exportCrons(sampleRecords, 'text')).not.toThrow();
  });

  it('should throw on unknown format', () => {
    expect(() => exportCrons(sampleRecords, 'xml' as any)).toThrow();
  });
});
