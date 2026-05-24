# cronforge

A human-readable cron expression builder and validator with natural language parsing support.

## Installation

```bash
npm install cronforge
```

## Usage

```typescript
import { CronForge } from 'cronforge';

// Build a cron expression using the fluent API
const cron = new CronForge()
  .every('weekday')
  .at('9:00 AM')
  .build();

console.log(cron.expression); // "0 9 * * 1-5"
console.log(cron.description); // "At 09:00 AM, Monday through Friday"

// Parse natural language into a cron expression
const parsed = CronForge.parse('every Monday at midnight');
console.log(parsed.expression); // "0 0 * * 1"

// Validate an existing cron expression
const result = CronForge.validate('0 9 * * 1-5');
console.log(result.valid); // true
console.log(result.description); // "At 09:00 AM, Monday through Friday"
```

## API

| Method | Description |
|---|---|
| `CronForge.parse(text)` | Convert natural language to a cron expression |
| `CronForge.validate(expr)` | Validate and describe a cron expression |
| `.every(interval)` | Set the recurrence interval |
| `.at(time)` | Set the time of execution |
| `.build()` | Return the final cron expression object |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on [GitHub](https://github.com/your-username/cronforge).

## License

MIT © [Your Name](https://github.com/your-username)