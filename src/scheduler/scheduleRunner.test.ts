import { startRunner, stopRunner, isRunnerActive, _tickJobsForTesting } from './scheduleRunner';
import { scheduleJob, removeJob, getJob, listJobs } from './cronScheduler';

describe('scheduleRunner', () => {
  afterEach(() => {
    stopRunner();
    listJobs().forEach(job => removeJob(job.id));
  });

  it('should start and stop the runner', () => {
    expect(isRunnerActive()).toBe(false);
    startRunner(100);
    expect(isRunnerActive()).toBe(true);
    stopRunner();
    expect(isRunnerActive()).toBe(false);
  });

  it('should not start twice', () => {
    startRunner(100);
    startRunner(100);
    expect(isRunnerActive()).toBe(true);
    stopRunner();
    expect(isRunnerActive()).toBe(false);
  });

  it('should call callback when job is due', () => {
    const mockFn = jest.fn();
    const job = scheduleJob('runner-test', '* * * * *', mockFn)!;

    // Force nextRun to now so tick triggers it
    job.nextRun = new Date();

    _tickJobsForTesting();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not call callback for disabled job', () => {
    const mockFn = jest.fn();
    const job = scheduleJob('runner-disabled', '* * * * *', mockFn)!;
    job.nextRun = new Date();
    job.enabled = false;

    _tickJobsForTesting();

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should update lastRun after execution', () => {
    const mockFn = jest.fn();
    const job = scheduleJob('runner-lastrun', '* * * * *', mockFn)!;
    job.nextRun = new Date();

    _tickJobsForTesting();

    expect(getJob('runner-lastrun')!.lastRun).toBeInstanceOf(Date);
  });
});
