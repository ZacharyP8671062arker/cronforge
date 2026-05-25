/**
 * cronAnnotator.ts
 * Attach human-readable annotations (labels, notes, metadata) to cron expressions.
 */

export interface CronAnnotation {
  expression: string;
  label: string;
  notes: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const store = new Map<string, CronAnnotation>();

export function annotateExpression(
  expression: string,
  label: string,
  notes: string[] = [],
  tags: string[] = []
): CronAnnotation {
  const now = new Date();
  const existing = store.get(expression);
  const annotation: CronAnnotation = {
    expression,
    label,
    notes,
    tags,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  };
  store.set(expression, annotation);
  return annotation;
}

export function getAnnotation(expression: string): CronAnnotation | undefined {
  return store.get(expression);
}

export function updateNotes(expression: string, notes: string[]): boolean {
  const existing = store.get(expression);
  if (!existing) return false;
  existing.notes = notes;
  existing.updatedAt = new Date();
  return true;
}

export function removeAnnotation(expression: string): boolean {
  return store.delete(expression);
}

export function listAnnotations(): CronAnnotation[] {
  return Array.from(store.values());
}

export function findAnnotationsByLabel(label: string): CronAnnotation[] {
  return listAnnotations().filter((a) =>
    a.label.toLowerCase().includes(label.toLowerCase())
  );
}

export function clearAnnotations(): void {
  store.clear();
}
