import {
  createGroup,
  addToGroup,
  removeFromGroup,
  getGroup,
  listGroups,
  deleteGroup,
  getGroupsForExpression,
  clearGroups,
  CronGroup,
} from './cronGroup';

export function newGroup(name: string, description?: string): CronGroup {
  return createGroup(name, description);
}

export function assignToGroup(groupId: string, expression: string): boolean {
  return addToGroup(groupId, expression);
}

export function unassignFromGroup(groupId: string, expression: string): boolean {
  return removeFromGroup(groupId, expression);
}

export function findGroup(groupId: string): CronGroup | undefined {
  return getGroup(groupId);
}

export function getAllGroups(): CronGroup[] {
  return listGroups();
}

export function removeGroup(groupId: string): boolean {
  return deleteGroup(groupId);
}

export function groupsContaining(expression: string): CronGroup[] {
  return getGroupsForExpression(expression);
}

export function isInAnyGroup(expression: string): boolean {
  return getGroupsForExpression(expression).length > 0;
}

export function resetGroups(): void {
  clearGroups();
}

export type { CronGroup };
