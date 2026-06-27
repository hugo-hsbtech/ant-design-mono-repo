'use server';
import { revalidatePath } from 'next/cache';
import { requireOrgAccess } from '@/lib/org';
import { requirePermission } from '@/lib/rbac';
import {
  cancelInvite,
  countOwners,
  getMembership,
  inviteMember,
  removeMember,
  updateMemberRole,
} from '@/lib/data';
import type { Role } from '@/lib/types';

export async function inviteMemberAction(slug: string, email: string, role: Role) {
  const { org, role: myRole } = await requireOrgAccess(slug);
  requirePermission(myRole, 'member:invite');
  const result = inviteMember(org.id, email, role);
  revalidatePath(`/${slug}/members`);
  return result;
}

export async function updateMemberRoleAction(slug: string, userId: string, role: Role) {
  const { org, role: myRole } = await requireOrgAccess(slug);
  requirePermission(myRole, 'member:update');
  const current = getMembership(userId, org.id);
  // Never leave an org without an owner.
  if (current?.role === 'owner' && role !== 'owner' && countOwners(org.id) <= 1) {
    throw new Error('Não é possível rebaixar o único owner');
  }
  updateMemberRole(org.id, userId, role);
  revalidatePath(`/${slug}/members`);
}

export async function removeMemberAction(slug: string, userId: string) {
  const { org, role: myRole } = await requireOrgAccess(slug);
  requirePermission(myRole, 'member:remove');
  const target = getMembership(userId, org.id);
  if (target?.role === 'owner' && countOwners(org.id) <= 1) {
    throw new Error('Não é possível remover o único owner');
  }
  removeMember(org.id, userId);
  revalidatePath(`/${slug}/members`);
}

export async function cancelInviteAction(slug: string, id: string) {
  const { org, role: myRole } = await requireOrgAccess(slug);
  requirePermission(myRole, 'member:remove');
  cancelInvite(org.id, id);
  revalidatePath(`/${slug}/members`);
}
