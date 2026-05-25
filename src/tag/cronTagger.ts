// cronTagger.ts — Assign and manage tags on cron expressions

export interface TaggedExpression {
  expression: string;
  tags: string[];
  label?: string;
  createdAt: Date;
}

const tagStore: Map<string, TaggedExpression> = new Map();

export function tagExpression(
  expression: string,
  tags: string[],
  label?: string
): TaggedExpression {
  const existing = tagStore.get(expression);
  const merged = existing
    ? Array.from(new Set([...existing.tags, ...tags]))
    : [...tags];

  const entry: TaggedExpression = {
    expression,
    tags: merged,
    label: label ?? existing?.label,
    createdAt: existing?.createdAt ?? new Date(),
  };

  tagStore.set(expression, entry);
  return entry;
}

export function removeTag(expression: string, tag: string): boolean {
  const entry = tagStore.get(expression);
  if (!entry) return false;
  entry.tags = entry.tags.filter((t) => t !== tag);
  tagStore.set(expression, entry);
  return true;
}

export function getTagsForExpression(expression: string): string[] {
  return tagStore.get(expression)?.tags ?? [];
}

export function getExpressionsByTag(tag: string): TaggedExpression[] {
  return Array.from(tagStore.values()).filter((e) => e.tags.includes(tag));
}

export function getAllTags(): string[] {
  const all = new Set<string>();
  for (const entry of tagStore.values()) {
    entry.tags.forEach((t) => all.add(t));
  }
  return Array.from(all).sort();
}

export function clearTagStore(): void {
  tagStore.clear();
}

export function listTaggedExpressions(): TaggedExpression[] {
  return Array.from(tagStore.values());
}
