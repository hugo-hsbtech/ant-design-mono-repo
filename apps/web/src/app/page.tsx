import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listOrgsForUser } from '@/lib/data';

// Entry point: send the user to their first org, or to login.
export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  const orgs = listOrgsForUser(session.user.id);
  if (orgs.length === 0) redirect('/login');
  redirect(`/${orgs[0]!.slug}`);
}
