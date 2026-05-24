import {
  CRON_PRESETS,
  getPresetByName,
  getPresetsByTag,
  searchPresets,
} from './cronPresets';

describe('CRON_PRESETS', () => {
  it('should contain at least 10 presets', () => {
    expect(CRON_PRESETS.length).toBeGreaterThanOrEqual(10);
  });

  it('every preset should have a non-empty expression', () => {
    CRON_PRESETS.forEach((preset) => {
      expect(preset.expression.trim().length).toBeGreaterThan(0);
    });
  });

  it('every preset should have at least one tag', () => {
    CRON_PRESETS.forEach((preset) => {
      expect(preset.tags.length).toBeGreaterThan(0);
    });
  });
});

describe('getPresetByName', () => {
  it('returns the correct preset for a known name', () => {
    const preset = getPresetByName('every-minute');
    expect(preset).toBeDefined();
    expect(preset?.expression).toBe('* * * * *');
  });

  it('returns undefined for an unknown name', () => {
    expect(getPresetByName('not-a-preset')).toBeUndefined();
  });
});

describe('getPresetsByTag', () => {
  it('returns presets matching the given tag', () => {
    const daily = getPresetsByTag('daily');
    expect(daily.length).toBeGreaterThan(0);
    daily.forEach((p) => expect(p.tags).toContain('daily'));
  });

  it('returns empty array for unknown tag', () => {
    expect(getPresetsByTag('unknown-tag')).toHaveLength(0);
  });
});

describe('searchPresets', () => {
  it('finds presets by partial name', () => {
    const results = searchPresets('weekly');
    expect(results.length).toBeGreaterThan(0);
  });

  it('finds presets by description keyword', () => {
    const results = searchPresets('midnight');
    expect(results.length).toBeGreaterThan(0);
  });

  it('returns empty array when nothing matches', () => {
    expect(searchPresets('zzznomatch')).toHaveLength(0);
  });
});
