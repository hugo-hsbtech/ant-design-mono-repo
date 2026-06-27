import { describe, it, expect } from 'vitest';
import { can, requirePermission } from './rbac';

describe('rbac', () => {
  it('grants project:read to every role', () => {
    for (const role of ['owner', 'admin', 'member', 'viewer'] as const) {
      expect(can(role, 'project:read')).toBe(true);
    }
  });

  it('restricts deletion and member management to owner/admin', () => {
    expect(can('member', 'project:delete')).toBe(false);
    expect(can('viewer', 'project:delete')).toBe(false);
    expect(can('admin', 'project:delete')).toBe(true);
    expect(can('owner', 'member:remove')).toBe(true);
    expect(can('member', 'member:invite')).toBe(false);
  });

  it('requirePermission throws for an unauthorized role', () => {
    expect(() => requirePermission('viewer', 'project:create')).toThrow(/Forbidden/);
    expect(() => requirePermission('owner', 'org:update')).not.toThrow();
  });
});
