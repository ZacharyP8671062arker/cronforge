import { exportCrons, exportToJson, exportToYaml, exportToCsv, exportToText } from './cronExporter';
import type { ExportRecord, ExportFormat } from './cronExporter';

export type { ExportRecord, ExportFormat };

export function exportExpressions(
  records: ExportRecord[],
  format: ExportFormat = 'json'
): string {
  return exportCrons(records, format);
}

export function exportAsJson(records: ExportRecord[]): string {
  return exportToJson(records);
}

export function exportAsYaml(records: ExportRecord[]): string {
  return exportToYaml(records);
}

export function exportAsCsv(records: ExportRecord[]): string {
  return exportToCsv(records);
}

export function exportAsText(records: ExportRecord[]): string {
  return exportToText(records);
}

export function getSupportedFormats(): ExportFormat[] {
  return ['json', 'yaml', 'csv', 'text'];
}

export function isExportFormat(value: string): value is ExportFormat {
  return ['json', 'yaml', 'csv', 'text'].includes(value);
}
