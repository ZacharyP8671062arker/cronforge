export interface CronGroup {
  id: string;
  name: string;
  description?: string;
  expressions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const groups = new Map<string, CronGroup>();

export function createGroup(name: string, description?: string): CronGroup {
  const id = `group_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date();
  const group: CronGroup = {
    id,
    name,
    description,
    expressions: [],
    createdAt: now,
    updatedAt: now,
  };
  groups.set(id, group);
  return group;
}

export function addToGroup(groupId: string, expression: string): boolean {
  const group = groups.get(groupId);
  if (!group) return false;
  if (!group.expressions.includes(expression)) {
    group.expressions.push(expression);
    group.updatedAt = new Date();
  }
  return true;
}

export function removeFromGroup(groupId: string, expression: string): boolean {
  const group = groups.get(groupId);
  if (!group) return false;
  const idx = group.expressions.indexOf(expression);
  if (idx === -1) return false;
  group.expressions.splice(idx, 1);
  group.updatedAt = new Date();
  return true;
}

export function getGroup(groupId: string): CronGroup | undefined {
  return groups.get(groupId);
}

export function listGroups(): CronGroup[] {
  return Array.from(groups.values());
}

export function deleteGroup(groupId: string): boolean {
  return groups.delete(groupId);
}

export function getGroupsForExpression(expression: string): CronGroup[] {
  return Array.from(groups.values()).filter(g => g.expressions.includes(expression));
}

export function clearGroups(): void {
  groups.clear();
}
