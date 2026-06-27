import { requireOrgAccess } from '@/lib/org';
import { SettingsView } from './settings-view';

export default async function SettingsPage({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const { org, role } = await requireOrgAccess(slug);
  return <SettingsView slug={slug} role={role} orgName={org.name} orgSlug={org.slug} />;
}
