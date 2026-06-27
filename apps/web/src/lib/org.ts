import 'server-only';
import { notFound, redirect } from 'next/navigation';
import { auth } from './auth';
import {
  getMembership,
  getOrgBySlug,
  listOrgsForUser,
  type Org,
  type Role,
} from './data';

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
}

export interface OrgAccess {
  user: SessionUser;
  org: Org;
  role: Role;
  orgs: Org[];
}

/** Require an authenticated session (server-side). Redirects to /login if absent. */
export async function requireSession(): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  return session.user;
}

/**
 * Resolve and authorize access to an org by slug — the server-side gate for
 * every `/[org]/...` route. Returns the current org, the caller's role, and
 * their org list. Non-members get a 404 (not 403) so org existence isn't
 * leaked. This runs on the server; never trust the client/middleware for this.
 */
export async function requireOrgAccess(slug: string): Promise<OrgAccess> {
  const user = await requireSession();
  const org = getOrgBySlug(slug);
  if (!org) notFound();
  const membership = getMembership(user.id, org.id);
  if (!membership) notFound();
  return { user, org, role: membership.role, orgs: listOrgsForUser(user.id) };
}
