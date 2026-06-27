// In-memory mock data layer (dev). Shape mirrors a shared-DB multi-tenant model
// (every tenant-scoped row carries `orgId`). Swap this module for a real DB
// client later; the call sites (services + server actions) stay the same.
import 'server-only';
import type { Membership, Org, PendingInvite, Project, Role, User } from './types';

export type { Membership, Org, PendingInvite, Project, Role, User } from './types';

const users: User[] = [
  { id: 'u_ada', name: 'Ada Lovelace', email: 'ada@plataforma.dev' },
  { id: 'u_alan', name: 'Alan Turing', email: 'alan@plataforma.dev' },
  { id: 'u_grace', name: 'Grace Hopper', email: 'grace@plataforma.dev' },
];

const orgs: Org[] = [
  { id: 'o_apollo', slug: 'apollo', name: 'Apollo' },
  { id: 'o_hermes', slug: 'hermes', name: 'Hermes' },
];

let memberships: Membership[] = [
  { userId: 'u_ada', orgId: 'o_apollo', role: 'owner' },
  { userId: 'u_ada', orgId: 'o_hermes', role: 'member' },
  { userId: 'u_alan', orgId: 'o_apollo', role: 'viewer' },
];

let invites: PendingInvite[] = [];

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

export const countOwners = (orgId: string): number =>
  memberships.filter((m) => m.orgId === orgId && m.role === 'owner').length;

export const updateOrg = (orgId: string, patch: Partial<Pick<Org, 'name'>>): Org | undefined => {
  const org = orgs.find((o) => o.id === orgId);
  if (org && patch.name !== undefined) org.name = patch.name;
  return org;
};

export const updateMemberRole = (orgId: string, userId: string, role: Role): void => {
  const m = memberships.find((x) => x.orgId === orgId && x.userId === userId);
  if (m) m.role = role;
};

export const removeMember = (orgId: string, userId: string): void => {
  memberships = memberships.filter((m) => !(m.orgId === orgId && m.userId === userId));
};

// ── Invites (tenant-scoped) ─────────────────────────────────────────────────
export const listInvites = (orgId: string): PendingInvite[] =>
  invites.filter((i) => i.orgId === orgId);

/**
 * Invite by email. If the email belongs to a known user they're added as a
 * member directly; otherwise a pending invite is recorded.
 */
export const inviteMember = (
  orgId: string,
  email: string,
  role: Role,
): { status: 'added' | 'invited' } => {
  const user = getUserByEmail(email);
  if (user) {
    if (!getMembership(user.id, orgId)) {
      memberships = [...memberships, { userId: user.id, orgId, role }];
    }
    return { status: 'added' };
  }
  if (!invites.some((i) => i.orgId === orgId && i.email.toLowerCase() === email.toLowerCase())) {
    invites = [...invites, { id: `inv${seq++}`, orgId, email, role }];
  }
  return { status: 'invited' };
};

export const cancelInvite = (orgId: string, id: string): void => {
  invites = invites.filter((i) => !(i.id === id && i.orgId === orgId));
};

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
