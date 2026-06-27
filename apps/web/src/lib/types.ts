// Shared domain types — safe to import from client and server (no runtime deps).
export type Role = 'owner' | 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Org {
  id: string;
  slug: string;
  name: string;
}

export interface Membership {
  userId: string;
  orgId: string;
  role: Role;
}

export interface Project {
  id: string;
  orgId: string; // tenant_id
  name: string;
  status: 'active' | 'archived';
}
