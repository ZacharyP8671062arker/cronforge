/**
 * CronBuilder — A fluent API for constructing cron expressions programmatically.
 */

type CronField = string | number;

interface CronParts {
  minute: CronField;
  hour: CronField;
  dayOfMonth: CronField;
  month: CronField;
  dayOfWeek: CronField;
}

export class CronBuilder {
  private parts: CronParts = {
    minute: '*',
    hour: '*',
    dayOfMonth: '*',
    month: '*',
    dayOfWeek: '*',
  };

  setMinute(value: CronField): this {
    this.parts.minute = value;
    return this;
  }

  setHour(value: CronField): this {
    this.parts.hour = value;
    return this;
  }

  setDayOfMonth(value: CronField): this {
    this.parts.dayOfMonth = value;
    return this;
  }

  setMonth(value: CronField): this {
    this.parts.month = value;
    return this;
  }

  setDayOfWeek(value: CronField): this {
    this.parts.dayOfWeek = value;
    return this;
  }

  /** Every N minutes */
  everyMinutes(n: number): this {
    this.parts.minute = `*/${n}`;
    return this;
  }

  /** Every N hours */
  everyHours(n: number): this {
    this.parts.hour = `*/${n}`;
    this.parts.minute = 0;
    return this;
  }

  /** At a specific time each day */
  dailyAt(hour: number, minute = 0): this {
    this.parts.hour = hour;
    this.parts.minute = minute;
    this.parts.dayOfMonth = '*';
    this.parts.dayOfWeek = '*';
    return this;
  }

  /** On specific weekdays (0=Sun, 6=Sat) */
  onWeekdays(...days: number[]): this {
    this.parts.dayOfWeek = days.join(',');
    return this;
  }

  /** Build and return the cron expression string */
  build(): string {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = this.parts;
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }

  /** Reset all fields to wildcard */
  reset(): this {
    this.parts = { minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' };
    return this;
  }
}

export function createCronBuilder(): CronBuilder {
  return new CronBuilder();
}
