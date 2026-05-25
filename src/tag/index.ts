// index.ts — Public API for the cron tagging module

import {
  tagExpression,
  removeTag,
  getTagsForExpression,
  getExpressionsByTag,
  getAllTags,
  listTaggedExpressions,
  clearTagStore,
  TaggedExpression,
} from "./cronTagger";

export type { TaggedExpression };

export function addTag(
  expression: string,
  tags: string | string[],
  label?: string
): TaggedExpression {
  const tagArray = Array.isArray(tags) ? tags : [tags];
  return tagExpression(expression, tagArray, label);
}

export function dropTag(expression: string, tag: string): boolean {
  return removeTag(expression, tag);
}

export function getTagsOf(expression: string): string[] {
  return getTagsForExpression(expression);
}

export function findByTag(tag: string): TaggedExpression[] {
  return getExpressionsByTag(tag);
}

export function listAllTags(): string[] {
  return getAllTags();
}

export function hasTag(expression: string, tag: string): boolean {
  return getTagsForExpression(expression).includes(tag);
}

export { listTaggedExpressions, clearTagStore };
