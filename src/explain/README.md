# cronforge — Explain Module

The `explain` module provides deep introspection of cron expressions, combining parsing, humanization, and diff capabilities into a single explanation API.

## API

### `explainCron(expression: string): CronExplanation`

Returns a full breakdown of a cron expression:

```ts
import { explainCron } from 'cronforge/explain';

const info = explainCron('0 9 * * 1-5');
console.log(info.humanReadable); // "At 09:00, Monday through Friday"
console.log(info.warnings);      // []
```

### `summarizeCron(expression: string): string`

Returns a single plain-text sentence describing the expression, including any warnings.

```ts
import { summarizeCron } from 'cronforge/explain';

console.log(summarizeCron('* * * * *'));
// "Every minute. Warnings: Expression runs every minute — ensure this is intentional."
```

### `hasWarnings(expression: string): boolean`

Returns `true` if the expression triggers any advisory warnings.

### `compareCronExplanations(exprA, exprB)`

Compares two expressions and returns a human-readable summary of what changed.

```ts
import { compareCronExplanations } from 'cronforge/explain';

const diff = compareCronExplanations('0 9 * * *', '0 10 * * *');
console.log(diff.explanation); // "Changed fields: hour."
```

## Warnings

| Condition | Warning |
|---|---|
| Both `dayOfMonth` and `dayOfWeek` set | Behavior may vary by system |
| `minute` and `hour` both `*` | Runs every minute |
