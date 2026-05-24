# cronforge — Diff Module

The `diff` module provides utilities for comparing two cron expressions and understanding what changed between them.

## API

### `compareCron(fromExpr, toExpr): CronDiffResult`

Compares two cron expressions field by field and returns a structured diff.

```ts
import { compareCron } from 'cronforge/diff';

const result = compareCron('0 9 * * 1', '0 10 * * 5');
console.log(result.summary);
// hour: "at 9" → "at 10"; dayOfWeek: "on Monday" → "on Friday"
```

### `isSameCron(exprA, exprB): boolean`

Returns `true` if both expressions are functionally identical.

```ts
isSameCron('0 9 * * *', '0 9 * * *'); // true
isSameCron('0 9 * * *', '0 10 * * *'); // false
```

### `changedFields(fromExpr, toExpr): string[]`

Returns an array of field names that differ between the two expressions.

```ts
changedFields('0 9 * * *', '0 9 1 * *');
// ['dayOfMonth']
```

## CronDiffResult Shape

```ts
interface CronDiffResult {
  fields: CronFieldDiff[];  // one entry per cron field
  hasChanges: boolean;
  summary: string;          // human-readable change summary
}

interface CronFieldDiff {
  field: string;            // 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'
  from: string;
  to: string;
  fromDescription: string;
  toDescription: string;
  changed: boolean;
}
```
