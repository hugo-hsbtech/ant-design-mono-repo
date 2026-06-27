// In-memory mock data layer (dev). Shape mirrors a shared-DB multi-tenant model
// (every tenant-scoped row carries `orgId`). Swap this module for a real DB
// client later; the call sites (services + server actions) stay the same.
import 'server-only';
import type { Membership, Org, Project, User } from './types';

export type { Membership, Org, Project, Role, User } from './types';

const users: User[] = [
  { id: 'u_ada', name: 'Ada Lovelace', email: 'ada@plataforma.dev' },
  { id: 'u_alan', name: 'Alan Turing', email: 'alan@plataforma.dev' },
];

const orgs: Org[] = [
  { id: 'o_apollo', slug: 'apollo', name: 'Apollo' },
  { id: 'o_hermes', slug: 'hermes', name: 'Hermes' },
];

const memberships: Membership[] = [
  { userId: 'u_ada', orgId: 'o_apollo', role: 'owner' },
  { userId: 'u_ada', orgId: 'o_hermes', role: 'member' },
  { userId: 'u_alan', orgId: 'o_apollo', role: 'viewer' },
];

let projects: Project[] = [
  { id: 'p1', orgId: 'o_apollo', name: 'Apollo Web', status: 'active' },
  { id: 'p2', orgId: 'o_apollo', name: 'Apollo Mobile', status: 'archived' },
  { id: 'p3', orgId: 'o_hermes', name: 'Hermes API', status: 'active' },
];

let seq = 100;

// ── Users ───────────────────────────────────────────────────────────────────
export const getUserByEmail = (email: string): User | undefined =>
  users.find((u) => u.email.toLowerCase() === email.toLowerCase());
export const getUserById = (id: string): User | undefined => users.find((u) => u.id === id);

// ── Orgs / memberships ──────────────────────────────────────────────────────
export const getOrgBySlug = (slug: string): Org | undefined =>
  orgs.find((o) => o.slug === slug);

export const getMembership = (userId: string, orgId: string): Membership | undefined =>
  memberships.find((m) => m.userId === userId && m.orgId === orgId);

export const listOrgsForUser = (userId: string): Org[] =>
  memberships
    .filter((m) => m.userId === userId)
    .map((m) => orgs.find((o) => o.id === m.orgId))
    .filter((o): o is Org => Boolean(o));

export const listMembers = (orgId: string): Array<Membership & { user: User }> =>
  memberships
    .filter((m) => m.orgId === orgId)
    .map((m) => ({ ...m, user: getUserById(m.userId)! }));

// ── Projects (tenant-scoped) ────────────────────────────────────────────────
// Every query is filtered by orgId — the cross-tenant isolation guarantee.
export const listProjects = (orgId: string): Project[] =>
  projects.filter((p) => p.orgId === orgId);

export const createProject = (orgId: string, name: string): Project => {
  const project: Project = { id: `p${seq++}`, orgId, name, status: 'active' };
  projects = [...projects, project];
  return project;
};

export const deleteProject = (orgId: string, id: string): void => {
  // Scope the delete by orgId too, so one tenant can never remove another's row.
  projects = projects.filter((p) => !(p.id === id && p.orgId === orgId));
};
