export type ExportFormat = 'json' | 'yaml' | 'csv' | 'text';

export interface ExportRecord {
  expression: string;
  description?: string;
  label?: string;
  tags?: string[];
  createdAt?: string;
}

export function exportToJson(records: ExportRecord[]): string {
  return JSON.stringify(records, null, 2);
}

export function exportToYaml(records: ExportRecord[]): string {
  const lines: string[] = ['cron_expressions:'];
  for (const record of records) {
    lines.push(`  - expression: "${record.expression}"`);
    if (record.label) lines.push(`    label: "${record.label}"`);
    if (record.description) lines.push(`    description: "${record.description}"`);
    if (record.tags && record.tags.length > 0) {
      lines.push(`    tags: [${record.tags.map(t => `"${t}"`).join(', ')}]`);
    }
    if (record.createdAt) lines.push(`    createdAt: "${record.createdAt}"`);
  }
  return lines.join('\n');
}

export function exportToCsv(records: ExportRecord[]): string {
  const header = 'expression,label,description,tags,createdAt';
  const rows = records.map(r => {
    const tags = (r.tags ?? []).join(';');
    const desc = (r.description ?? '').replace(/,/g, ' ');
    const label = (r.label ?? '').replace(/,/g, ' ');
    return `"${r.expression}","${label}","${desc}","${tags}","${r.createdAt ?? ''}"`;
  });
  return [header, ...rows].join('\n');
}

export function exportToText(records: ExportRecord[]): string {
  return records.map(r => {
    const parts = [r.expression];
    if (r.label) parts.push(`# ${r.label}`);
    if (r.description) parts.push(`// ${r.description}`);
    return parts.join('  ');
  }).join('\n');
}

export function exportCrons(records: ExportRecord[], format: ExportFormat): string {
  switch (format) {
    case 'json': return exportToJson(records);
    case 'yaml': return exportToYaml(records);
    case 'csv': return exportToCsv(records);
    case 'text': return exportToText(records);
    default: throw new Error(`Unsupported export format: ${format}`);
  }
}
