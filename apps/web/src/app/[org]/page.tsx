import { requireOrgAccess } from '@/lib/org';
import { listProjects } from '@/lib/data';
import { ProjectsView } from './projects-view';

export default async function OrgDashboard({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const { org, role } = await requireOrgAccess(slug);
  const projects = listProjects(org.id); // tenant-scoped
  return <ProjectsView slug={slug} role={role} projects={projects} />;
}
