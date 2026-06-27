'use server';
import { revalidatePath } from 'next/cache';
import { requireOrgAccess } from '@/lib/org';
import { requirePermission } from '@/lib/rbac';
import { createProject, deleteProject } from '@/lib/data';

// Server actions: authorization and tenant scoping are enforced HERE, on the
// server — never trust the client or middleware (cf. CVE-2025-29927).

export async function createProjectAction(slug: string, name: string) {
  const { org, role } = await requireOrgAccess(slug);
  requirePermission(role, 'project:create');
  createProject(org.id, name.trim());
  revalidatePath(`/${slug}`);
}

export async function deleteProjectAction(slug: string, id: string) {
  const { org, role } = await requireOrgAccess(slug);
  requirePermission(role, 'project:delete');
  deleteProject(org.id, id);
  revalidatePath(`/${slug}`);
}
