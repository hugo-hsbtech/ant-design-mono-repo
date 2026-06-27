// In-memory mock data layer (dev). Shape mirrors a shared-DB multi-tenant model
// (every tenant-scoped row carries `orgId`). Swap this module for a real DB
// client later; the call sites (services + server actions) stay the same.
//
// State lives on `globalThis` so it's a single instance across server bundles
// (Next can otherwise give server actions and RSC renders separate module
// copies — the same reason the Prisma client is kept as a global singleton).
import 'server-only';
import type { Membership, Org, PendingInvite, Project, Role, User } from './types';

export type { Membership, Org, PendingInvite, Project, Role, User } from './types';

interface Store {
  users: User[];
  orgs: Org[];
  memberships: Membership[];
  projects: Project[];
  invites: PendingInvite[];
  seq: number;
}

const globalRef = globalThis as unknown as { __plataformaStore?: Store };

const store: Store = (globalRef.__plataformaStore ??= {
  users: [
    { id: 'u_ada', name: 'Ada Lovelace', email: 'ada@plataforma.dev' },
    { id: 'u_alan', name: 'Alan Turing', email: 'alan@plataforma.dev' },
    { id: 'u_grace', name: 'Grace Hopper', email: 'grace@plataforma.dev' },
  ],
  orgs: [
    { id: 'o_apollo', slug: 'apollo', name: 'Apollo' },
    { id: 'o_hermes', slug: 'hermes', name: 'Hermes' },
  ],
  memberships: [
    { userId: 'u_ada', orgId: 'o_apollo', role: 'owner' },
    { userId: 'u_ada', orgId: 'o_hermes', role: 'member' },
    { userId: 'u_alan', orgId: 'o_apollo', role: 'viewer' },
  ],
  projects: [
    { id: 'p1', orgId: 'o_apollo', name: 'Apollo Web', status: 'active' },
    { id: 'p2', orgId: 'o_apollo', name: 'Apollo Mobile', status: 'archived' },
    { id: 'p3', orgId: 'o_hermes', name: 'Hermes API', status: 'active' },
  ],
  invites: [],
  seq: 100,
});

// ── Users ───────────────────────────────────────────────────────────────────
export const getUserByEmail = (email: string): User | undefined =>
  store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
export const getUserById = (id: string): User | undefined =>
  store.users.find((u) => u.id === id);

// ── Orgs / memberships ──────────────────────────────────────────────────────
export const getOrgBySlug = (slug: string): Org | undefined =>
  store.orgs.find((o) => o.slug === slug);

export const getMembership = (userId: string, orgId: string): Membership | undefined =>
  store.memberships.find((m) => m.userId === userId && m.orgId === orgId);

export const listOrgsForUser = (userId: string): Org[] =>
  store.memberships
    .filter((m) => m.userId === userId)
    .map((m) => store.orgs.find((o) => o.id === m.orgId))
    .filter((o): o is Org => Boolean(o));

export const listMembers = (orgId: string): Array<Membership & { user: User }> =>
  store.memberships
    .filter((m) => m.orgId === orgId)
    .map((m) => ({ ...m, user: getUserById(m.userId)! }));

export const countOwners = (orgId: string): number =>
  store.memberships.filter((m) => m.orgId === orgId && m.role === 'owner').length;

export const updateOrg = (orgId: string, patch: Partial<Pick<Org, 'name'>>): Org | undefined => {
  const org = store.orgs.find((o) => o.id === orgId);
  if (org && patch.name !== undefined) org.name = patch.name;
  return org;
};

export const updateMemberRole = (orgId: string, userId: string, role: Role): void => {
  const m = store.memberships.find((x) => x.orgId === orgId && x.userId === userId);
  if (m) m.role = role;
};

export const removeMember = (orgId: string, userId: string): void => {
  store.memberships = store.memberships.filter(
    (m) => !(m.orgId === orgId && m.userId === userId),
  );
};

// ── Invites (tenant-scoped) ─────────────────────────────────────────────────
export const listInvites = (orgId: string): PendingInvite[] =>
  store.invites.filter((i) => i.orgId === orgId);

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
      store.memberships.push({ userId: user.id, orgId, role });
    }
    return { status: 'added' };
  }
  if (
    !store.invites.some((i) => i.orgId === orgId && i.email.toLowerCase() === email.toLowerCase())
  ) {
    store.invites.push({ id: `inv${store.seq++}`, orgId, email, role });
  }
  return { status: 'invited' };
};

export const cancelInvite = (orgId: string, id: string): void => {
  store.invites = store.invites.filter((i) => !(i.id === id && i.orgId === orgId));
};

// ── Projects (tenant-scoped) ────────────────────────────────────────────────
// Every query is filtered by orgId — the cross-tenant isolation guarantee.
export const listProjects = (orgId: string): Project[] =>
  store.projects.filter((p) => p.orgId === orgId);

export const createProject = (orgId: string, name: string): Project => {
  const project: Project = { id: `p${store.seq++}`, orgId, name, status: 'active' };
  store.projects.push(project);
  return project;
};

export const deleteProject = (orgId: string, id: string): void => {
  // Scope the delete by orgId too, so one tenant can never remove another's row.
  store.projects = store.projects.filter((p) => !(p.id === id && p.orgId === orgId));
};
