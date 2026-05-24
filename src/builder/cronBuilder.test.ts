import { CronBuilder, createCronBuilder } from './cronBuilder';

describe('CronBuilder', () => {
  let builder: CronBuilder;

  beforeEach(() => {
    builder = createCronBuilder();
  });

  it('should default to wildcard expression', () => {
    expect(builder.build()).toBe('* * * * *');
  });

  it('should set individual fields via fluent API', () => {
    const expr = builder
      .setMinute(30)
      .setHour(9)
      .setDayOfMonth(1)
      .setMonth(6)
      .setDayOfWeek('*')
      .build();
    expect(expr).toBe('30 9 1 6 *');
  });

  it('should build every N minutes expression', () => {
    expect(builder.everyMinutes(15).build()).toBe('*/15 * * * *');
  });

  it('should build every N hours expression', () => {
    expect(builder.everyHours(6).build()).toBe('0 */6 * * *');
  });

  it('should build dailyAt expression', () => {
    expect(builder.dailyAt(8, 30).build()).toBe('30 8 * * *');
  });

  it('should default minute to 0 for dailyAt when not provided', () => {
    expect(builder.dailyAt(12).build()).toBe('0 12 * * *');
  });

  it('should build onWeekdays expression', () => {
    const expr = builder.dailyAt(9).onWeekdays(1, 2, 3, 4, 5).build();
    expect(expr).toBe('0 9 * * 1,2,3,4,5');
  });

  it('should reset all fields to wildcards', () => {
    builder.dailyAt(10).onWeekdays(1, 5);
    builder.reset();
    expect(builder.build()).toBe('* * * * *');
  });

  it('should support method chaining', () => {
    const result = createCronBuilder()
      .setMinute('*/5')
      .setHour('8-17')
      .setDayOfWeek('1-5')
      .build();
    expect(result).toBe('*/5 8-17 * * 1-5');
  });
});
