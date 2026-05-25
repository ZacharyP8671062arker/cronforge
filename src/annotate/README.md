# cronforge — Annotate Module

The `annotate` module lets you attach human-readable metadata to cron expressions: a short **label**, free-form **notes**, and **tags**.

## Usage

```ts
import {
  addAnnotation,
  getExpressionAnnotation,
  isAnnotated,
  setNotes,
  deleteAnnotation,
  searchByLabel,
  getAllAnnotations,
} from "cronforge/annotate";

// Annotate an expression
addAnnotation("0 9 * * 1", "Weekly Standup", ["Runs every Monday at 9am"], ["team", "weekly"]);

// Retrieve it
const ann = getExpressionAnnotation("0 9 * * 1");
console.log(ann?.label); // "Weekly Standup"

// Check existence
console.log(isAnnotated("0 9 * * 1")); // true

// Update notes
setNotes("0 9 * * 1", ["Runs every Monday at 9am UTC"]);

// Search by label
const results = searchByLabel("standup");

// Remove
deleteAnnotation("0 9 * * 1");
```

## API

| Function | Description |
|---|---|
| `addAnnotation(expr, label, notes?, tags?)` | Attach metadata to an expression |
| `getExpressionAnnotation(expr)` | Retrieve the annotation, or `undefined` |
| `isAnnotated(expr)` | Check if an expression has an annotation |
| `setNotes(expr, notes)` | Replace notes on an existing annotation |
| `deleteAnnotation(expr)` | Remove an annotation |
| `searchByLabel(label)` | Find annotations by partial label match |
| `getAllAnnotations()` | List all stored annotations |
| `clearAnnotations()` | Wipe all annotations (useful in tests) |
