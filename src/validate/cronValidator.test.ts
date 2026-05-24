import { validateCron, getFieldErrors } from './cronValidator';

describe('validateCron', () => {
  it('validates a standard cron expression', () => {
    const result = validateCron('0 12 * * 1');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.fields).toHaveLength(5);
  });

  it('returns invalid for wrong number of fields', () => {
    const result = validateCron('0 12 *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Expected 5 fields/);
  });

  it('validates wildcard in all fields', () => {
    const result = validateCron('* * * * *');
    expect(result.valid).toBe(true);
  });

  it('validates step values like */5', () => {
    const result = validateCron('*/5 * * * *');
    expect(result.valid).toBe(true);
  });

  it('validates step values with base like 0/15', () => {
    const result = validateCron('0/15 * * * *');
    expect(result.valid).toBe(true);
  });

  it('invalidates step with bad step number', () => {
    const result = validateCron('*/0 * * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Invalid step value/);
  });

  it('validates range values like 1-5', () => {
    const result = validateCron('* * * * 1-5');
    expect(result.valid).toBe(true);
  });

  it('invalidates reversed range', () => {
    const result = validateCron('* * * * 5-1');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/must be <= end/);
  });

  it('validates list values like 1,15,30', () => {
    const result = validateCron('1,15,30 * * * *');
    expect(result.valid).toBe(true);
  });

  it('invalidates out-of-range minute', () => {
    const result = validateCron('60 * * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/out of range/);
  });

  it('invalidates out-of-range hour', () => {
    const result = validateCron('0 25 * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/out of range/);
  });

  it('invalidates non-numeric field', () => {
    const result = validateCron('abc * * * *');
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/Non-numeric/);
  });

  it('returns field-level details', () => {
    const result = validateCron('0 12 * * 1');
    const minuteField = result.fields.find((f) => f.field === 'minute');
    expect(minuteField?.value).toBe('0');
    expect(minuteField?.valid).toBe(true);
  });
});

describe('getFieldErrors', () => {
  it('returns empty object for valid expression', () => {
    const errors = getFieldErrors('0 12 * * *');
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('returns error keyed by field name', () => {
    const errors = getFieldErrors('99 25 * * *');
    expect(errors.minute).toMatch(/out of range/);
    expect(errors.hour).toMatch(/out of range/);
  });

  it('returns only the affected field error', () => {
    const errors = getFieldErrors('0 99 * * *');
    expect(errors.minute).toBeUndefined();
    expect(errors.hour).toMatch(/out of range/);
  });
});
