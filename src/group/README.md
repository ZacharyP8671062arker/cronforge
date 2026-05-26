# cronforge — Group Module

The `group` module allows you to organize cron expressions into named groups for easier management, categorization, and retrieval.

## Features

- Create named groups with optional descriptions
- Assign and unassign cron expressions to/from groups
- Look up which groups contain a given expression
- List, find, and delete groups

## Usage

```typescript
import {
  newGroup,
  assignToGroup,
  unassignFromGroup,
  groupsContaining,
  isInAnyGroup,
  getAllGroups,
  removeGroup,
} from './src/group';

// Create a group
const group = newGroup('nightly', 'All nightly jobs');

// Assign expressions
assignToGroup(group.id, '0 0 * * *');
assignToGroup(group.id, '0 2 * * *');

// Check membership
console.log(isInAnyGroup('0 0 * * *')); // true

// Find which groups contain an expression
const groups = groupsContaining('0 0 * * *');
console.log(groups.map(g => g.name)); // ['nightly']

// Remove expression from group
unassignFromGroup(group.id, '0 0 * * *');

// List all groups
const all = getAllGroups();

// Delete a group
removeGroup(group.id);
```

## API

| Function | Description |
|---|---|
| `newGroup(name, description?)` | Create a new group |
| `assignToGroup(groupId, expression)` | Add expression to group |
| `unassignFromGroup(groupId, expression)` | Remove expression from group |
| `findGroup(groupId)` | Get group by ID |
| `getAllGroups()` | List all groups |
| `removeGroup(groupId)` | Delete a group |
| `groupsContaining(expression)` | Find groups with this expression |
| `isInAnyGroup(expression)` | Check if expression belongs to any group |
