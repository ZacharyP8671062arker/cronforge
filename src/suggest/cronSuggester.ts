import { isValidCron } from '../parser/index';
import { getPresetByName, searchPresets } from '../presets/cronPresets';
import { humanizeCron } from '../humanizer/humanizer';

export interface CronSuggestion {
  expression: string;
  label: string;
  description: string;
  score: number;
}

const COMMON_EXPRESSIONS: Array<{ expression: string; label: string }> = [
  { expression: '* * * * *', label: 'Every minute' },
  { expression: '0 * * * *', label: 'Every hour' },
  { expression: '0 0 * * *', label: 'Every day at midnight' },
  { expression: '0 9 * * *', label: 'Every day at 9am' },
  { expression: '0 0 * * 0', label: 'Every Sunday at midnight' },
  { expression: '0 0 1 * *', label: 'First of every month' },
  { expression: '*/5 * * * *', label: 'Every 5 minutes' },
  { expression: '*/15 * * * *', label: 'Every 15 minutes' },
  { expression: '0 */2 * * *', label: 'Every 2 hours' },
  { expression: '0 9-17 * * 1-5', label: 'Hourly during business hours' },
];

export function suggestByPartialInput(partial: string): CronSuggestion[] {
  const parts = partial.trim().split(/\s+/);
  const suggestions: CronSuggestion[] = [];

  for (const entry of COMMON_EXPRESSIONS) {
    const entryParts = entry.expression.split(' ');
    let score = 0;
    let match = true;

    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === '') continue;
      if (i >= entryParts.length) { match = false; break; }
      if (entryParts[i] === parts[i]) {
        score += 10;
      } else if (parts[i] !== '*' && entryParts[i].startsWith(parts[i])) {
        score += 5;
      } else if (i < parts.length - 1) {
        match = false;
        break;
      }
    }

    if (match) {
      suggestions.push({
        expression: entry.expression,
        label: entry.label,
        description: humanizeCron(entry.expression),
        score,
      });
    }
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 5);
}

export function suggestSimilar(expression: string): CronSuggestion[] {
  if (!isValidCron(expression)) return [];

  const parts = expression.split(' ');
  const suggestions: CronSuggestion[] = [];

  for (const entry of COMMON_EXPRESSIONS) {
    if (entry.expression === expression) continue;
    const entryParts = entry.expression.split(' ');
    const matchCount = parts.filter((p, i) => p === entryParts[i]).length;
    if (matchCount >= 3) {
      suggestions.push({
        expression: entry.expression,
        label: entry.label,
        description: humanizeCron(entry.expression),
        score: matchCount,
      });
    }
  }

  return suggestions.sort((a, b) => b.score - a.score).slice(0, 3);
}

export function suggestFromKeyword(keyword: string): CronSuggestion[] {
  const presets = searchPresets(keyword);
  return presets.slice(0, 5).map((preset) => ({
    expression: preset.expression,
    label: preset.name,
    description: humanizeCron(preset.expression),
    score: 1,
  }));
}
