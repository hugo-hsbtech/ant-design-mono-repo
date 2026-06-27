import type { Role } from './types';

export type Permission =
  | 'project:read'
  | 'project:create'
  | 'project:delete'
  | 'member:read'
  | 'member:invite'
  | 'member:update'
  | 'member:remove'
  | 'org:update';

// Single source of truth: PERMISSION → roles that hold it.
const PERMISSIONS: Record<Permission, Role[]> = {
  'project:read': ['owner', 'admin', 'member', 'viewer'],
  'project:create': ['owner', 'admin', 'member'],
  'project:delete': ['owner', 'admin'],
  'member:read': ['owner', 'admin', 'member', 'viewer'],
  'member:invite': ['owner', 'admin'],
  'member:update': ['owner', 'admin'],
  'member:remove': ['owner', 'admin'],
  'org:update': ['owner', 'admin'],
};

/** Whether a role holds a permission. Safe to use on client and server. */
export function can(role: Role, permission: Permission): boolean {
  return PERMISSIONS[permission].includes(role);
}

/**
 * Server-side guard. Throws if the role lacks the permission — call this in
 * server actions / route handlers. Never rely on the UI or middleware alone
 * for authorization (cf. CVE-2025-29927).
 */
export function requirePermission(role: Role, permission: Permission): void {
  if (!can(role, permission)) {
    throw new Error(`Forbidden: role "${role}" lacks "${permission}"`);
  }
}
