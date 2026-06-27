'use server';
import { revalidatePath } from 'next/cache';
import { requireOrgAccess } from '@/lib/org';
import { requirePermission } from '@/lib/rbac';
import { updateOrg } from '@/lib/data';

export async function updateOrgAction(slug: string, name: string) {
  const { org, role } = await requireOrgAccess(slug);
  requirePermission(role, 'org:update');
  updateOrg(org.id, { name });
  revalidatePath(`/${slug}/settings`);
  revalidatePath(`/${slug}`, 'layout');
}
