import { requireOrgAccess } from '@/lib/org';
import { Shell } from '@/components/shell/Shell';

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ org: string }>;
}) {
  const { org } = await params;
  // Server-side authorization gate for every /[org]/... route.
  const access = await requireOrgAccess(org);
  return <Shell value={access}>{children}</Shell>;
}
