import {
  getNextRunDate,
  matchesField,
  scheduleJob,
  removeJob,
  getJob,
  listJobs,
  toggleJob,
} from './cronScheduler';

describe('matchesField', () => {
  it('should match wildcard', () => {
    expect(matchesField('*', 5, 0, 59)).toBe(true);
  });

  it('should match exact value', () => {
    expect(matchesField('30', 30, 0, 59)).toBe(true);
    expect(matchesField('30', 15, 0, 59)).toBe(false);
  });

  it('should match step values', () => {
    expect(matchesField('*/15', 30, 0, 59)).toBe(true);
    expect(matchesField('*/15', 31, 0, 59)).toBe(false);
  });

  it('should match range', () => {
    expect(matchesField('9-17', 12, 0, 23)).toBe(true);
    expect(matchesField('9-17', 8, 0, 23)).toBe(false);
  });

  it('should match comma-separated list', () => {
    expect(matchesField('1,3,5', 3, 0, 6)).toBe(true);
    expect(matchesField('1,3,5', 2, 0, 6)).toBe(false);
  });
});

describe('getNextRunDate', () => {
  it('should return null for invalid expression', () => {
    expect(getNextRunDate('invalid')).toBeNull();
  });

  it('should return a future date for valid expression', () => {
    const next = getNextRunDate('* * * * *');
    expect(next).toBeInstanceOf(Date);
    expect(next!.getTime()).toBeGreaterThan(Date.now());
  });

  it('should respect the from date', () => {
    const from = new Date('2024-01-01T12:00:00Z');
    const next = getNextRunDate('0 9 * * *', from);
    expect(next).toBeInstanceOf(Date);
  });
});

describe('scheduleJob', () => {
  afterEach(() => {
    listJobs().forEach(job => removeJob(job.id));
  });

  it('should schedule a valid job', () => {
    const job = scheduleJob('test-1', '*/5 * * * *', jest.fn());
    expect(job).not.toBeNull();
    expect(job!.id).toBe('test-1');
    expect(job!.enabled).toBe(true);
  });

  it('should return null for invalid expression', () => {
    const job = scheduleJob('test-2', 'bad cron', jest.fn());
    expect(job).toBeNull();
  });

  it('should toggle a job', () => {
    scheduleJob('test-3', '0 * * * *', jest.fn());
    expect(toggleJob('test-3', false)).toBe(true);
    expect(getJob('test-3')!.enabled).toBe(false);
  });

  it('should remove a job', () => {
    scheduleJob('test-4', '0 0 * * *', jest.fn());
    expect(removeJob('test-4')).toBe(true);
    expect(getJob('test-4')).toBeUndefined();
  });
});
