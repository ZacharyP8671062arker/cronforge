import { humanizeCron, describeCron } from './humanizer';

describe('humanizeCron', () => {
  it('describes every minute', () => {
    expect(humanizeCron('* * * * *')).toBe('Every minute');
  });

  it('describes every hour', () => {
    expect(humanizeCron('0 * * * *')).toBe('Every hour');
  });

  it('describes every day at midnight', () => {
    expect(humanizeCron('0 0 * * *')).toBe('Every day at midnight');
  });

  it('describes every Sunday at midnight', () => {
    expect(humanizeCron('0 0 * * 0')).toBe('Every Sunday at midnight');
  });

  it('describes midnight on the 1st of every month', () => {
    expect(humanizeCron('0 0 1 * *')).toBe('At midnight on the 1st of every month');
  });

  it('describes midnight on January 1st', () => {
    expect(humanizeCron('0 0 1 1 *')).toBe('At midnight on January 1st');
  });

  it('describes a specific time', () => {
    const result = humanizeCron('30 9 * * *');
    expect(result).toContain('09:30');
  });

  it('describes a specific day and month', () => {
    const result = humanizeCron('0 12 15 6 *');
    expect(result).toContain('12:00');
    expect(result).toContain('15');
    expect(result).toContain('June');
  });

  it('returns invalid message for wrong field count', () => {
    expect(humanizeCron('* * *')).toBe('Invalid cron expression');
    expect(humanizeCron('')).toBe('Invalid cron expression');
  });
});

describe('describeCron', () => {
  it('returns structured description for every minute', () => {
    const desc = describeCron('* * * * *');
    expect(desc.minute).toBe('every minute');
    expect(desc.hour).toBe('every hour');
    expect(desc.summary).toBe('Every minute');
  });

  it('describes step values', () => {
    const desc = describeCron('*/15 * * * *');
    expect(desc.minute).toBe('every 15 minutes');
  });

  it('describes range values', () => {
    const desc = describeCron('0 9-17 * * *');
    expect(desc.hour).toBe('hours 9 through 17');
  });

  it('describes comma-separated values', () => {
    const desc = describeCron('0 0 * * 1,3,5');
    expect(desc.dayOfWeek).toContain('Monday');
    expect(desc.dayOfWeek).toContain('Wednesday');
    expect(desc.dayOfWeek).toContain('Friday');
  });

  it('returns all five field descriptions plus summary', () => {
    const desc = describeCron('0 8 1 1 *');
    expect(desc).toHaveProperty('minute');
    expect(desc).toHaveProperty('hour');
    expect(desc).toHaveProperty('dayOfMonth');
    expect(desc).toHaveProperty('month');
    expect(desc).toHaveProperty('dayOfWeek');
    expect(desc).toHaveProperty('summary');
  });
});
