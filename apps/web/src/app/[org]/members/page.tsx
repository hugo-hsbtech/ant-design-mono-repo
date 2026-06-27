import { requireOrgAccess } from '@/lib/org';
import { listInvites, listMembers } from '@/lib/data';
import { MembersView } from './members-view';

export default async function MembersPage({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const { org, role, user } = await requireOrgAccess(slug);
  const members = listMembers(org.id).map((m) => ({
    userId: m.userId,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
  }));
  const invites = listInvites(org.id);
  return (
    <MembersView
      slug={slug}
      role={role}
      currentUserId={user.id}
      members={members}
      invites={invites}
    />
  );
}
