import {
  detectFormat,
  convertCron,
  normalizeCron,
} from './cronConverter';

describe('detectFormat', () => {
  it('detects standard 5-field format', () => {
    expect(detectFormat('0 9 * * 1')).toBe('standard');
  });

  it('detects extended 6-field format', () => {
    expect(detectFormat('30 0 9 * * 1')).toBe('extended');
  });

  it('detects quartz 7-field format', () => {
    expect(detectFormat('0 0 9 * * 1 2024')).toBe('quartz');
  });
});

describe('convertCron', () => {
  it('returns same expression when format matches', () => {
    const result = convertCron('0 9 * * 1', 'standard');
    expect(result.expression).toBe('0 9 * * 1');
    expect(result.warnings).toHaveLength(0);
  });

  it('converts standard to extended by prepending seconds', () => {
    const result = convertCron('0 9 * * 1', 'extended');
    expect(result.expression).toBe('0 0 9 * * 1');
    expect(result.format).toBe('extended');
  });

  it('converts standard to quartz by prepending seconds and appending year', () => {
    const result = convertCron('0 9 * * 1', 'quartz');
    expect(result.expression).toBe('0 0 9 * * 1 *');
    expect(result.format).toBe('quartz');
  });

  it('converts extended to standard by dropping seconds field', () => {
    const result = convertCron('0 0 9 * * 1', 'standard');
    expect(result.expression).toBe('0 9 * * 1');
    expect(result.warnings).toHaveLength(0);
  });

  it('warns when dropping non-zero seconds in extended to standard', () => {
    const result = convertCron('30 0 9 * * 1', 'standard');
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('30');
  });

  it('converts quartz to standard dropping seconds and year', () => {
    const result = convertCron('0 0 9 * * 1 *', 'standard');
    expect(result.expression).toBe('0 9 * * 1');
  });

  it('warns when quartz year field is not wildcard on downgrade', () => {
    const result = convertCron('0 0 9 * * 1 2025', 'standard');
    expect(result.warnings.some(w => w.includes('2025'))).toBe(true);
  });

  it('converts quartz to extended by dropping year', () => {
    const result = convertCron('0 0 9 * * 1 *', 'extended');
    expect(result.expression).toBe('0 0 9 * * 1');
  });
});

describe('normalizeCron', () => {
  it('normalizes extended to standard', () => {
    expect(normalizeCron('0 0 9 * * 1')).toBe('0 9 * * 1');
  });

  it('normalizes quartz to standard', () => {
    expect(normalizeCron('0 0 9 * * 1 *')).toBe('0 9 * * 1');
  });

  it('returns standard unchanged', () => {
    expect(normalizeCron('*/5 * * * *')).toBe('*/5 * * * *');
  });
});
