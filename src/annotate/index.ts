/**
 * annotate/index.ts
 * Public API for the annotation module.
 */

import {
  annotateExpression,
  getAnnotation,
  updateNotes,
  removeAnnotation,
  listAnnotations,
  findAnnotationsByLabel,
  clearAnnotations,
  CronAnnotation,
} from "./cronAnnotator";

export type { CronAnnotation };

/** Attach a label and optional notes/tags to a cron expression. */
export function addAnnotation(
  expression: string,
  label: string,
  notes?: string[],
  tags?: string[]
): CronAnnotation {
  return annotateExpression(expression, label, notes, tags);
}

/** Retrieve the annotation for a cron expression, if any. */
export function getExpressionAnnotation(
  expression: string
): CronAnnotation | undefined {
  return getAnnotation(expression);
}

/** Returns true if the expression has been annotated. */
export function isAnnotated(expression: string): boolean {
  return getAnnotation(expression) !== undefined;
}

/** Replace the notes on an existing annotation. */
export function setNotes(expression: string, notes: string[]): boolean {
  return updateNotes(expression, notes);
}

/** Remove annotation for a given expression. */
export function deleteAnnotation(expression: string): boolean {
  return removeAnnotation(expression);
}

/** Get all annotations whose label matches the search string. */
export function searchByLabel(label: string): CronAnnotation[] {
  return findAnnotationsByLabel(label);
}

/** List every stored annotation. */
export function getAllAnnotations(): CronAnnotation[] {
  return listAnnotations();
}

export { clearAnnotations };
