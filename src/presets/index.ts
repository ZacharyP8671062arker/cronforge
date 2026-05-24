export {
  CRON_PRESETS,
  getPresetByName,
  getPresetsByTag,
  searchPresets,
} from './cronPresets';
export type { CronPreset } from './cronPresets';

import { getPresetByName, searchPresets } from './cronPresets';

/**
 * Returns the cron expression for a named preset, or undefined if not found.
 */
export function getPresetExpression(name: string): string | undefined {
  return getPresetByName(name)?.expression;
}

/**
 * Returns all preset names that match a search query.
 */
export function findPresetNames(query: string): string[] {
  return searchPresets(query).map((p) => p.name);
}

/**
 * Returns true if a preset with the given name exists.
 */
export function isKnownPreset(name: string): boolean {
  return getPresetByName(name) !== undefined;
}
