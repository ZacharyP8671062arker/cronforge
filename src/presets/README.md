# Cron Presets

The `presets` module provides a curated library of commonly used cron expressions with human-readable names, descriptions, and searchable tags.

## Usage

```typescript
import {
  CRON_PRESETS,
  getPresetByName,
  getPresetsByTag,
  searchPresets,
  getPresetExpression,
  findPresetNames,
  isKnownPreset,
} from 'cronforge/presets';

// Get a preset by its unique name
const preset = getPresetByName('daily-midnight');
console.log(preset?.expression); // '0 0 * * *'

// Get the raw expression for a named preset
const expr = getPresetExpression('every-15-minutes');
console.log(expr); // '*/15 * * * *'

// Filter presets by tag
const dailyPresets = getPresetsByTag('daily');

// Full-text search across name, description, and tags
const results = searchPresets('midnight');

// Check if a preset name exists
if (isKnownPreset('weekdays-9am')) {
  // use it
}

// Find matching preset names
const names = findPresetNames('hour');
```

## Available Presets

| Name | Expression | Description |
|------|------------|-------------|
| `every-minute` | `* * * * *` | Every minute |
| `every-hour` | `0 * * * *` | Every hour |
| `daily-midnight` | `0 0 * * *` | Every day at midnight |
| `daily-noon` | `0 12 * * *` | Every day at noon |
| `weekdays-9am` | `0 9 * * 1-5` | Every weekday at 9am |
| `weekly-sunday` | `0 0 * * 0` | Every Sunday at midnight |
| `monthly-first` | `0 0 1 * *` | First day of every month |
| `yearly-jan1` | `0 0 1 1 *` | January 1st at midnight |
| `every-15-minutes` | `*/15 * * * *` | Every 15 minutes |
| `every-6-hours` | `0 */6 * * *` | Every 6 hours |
