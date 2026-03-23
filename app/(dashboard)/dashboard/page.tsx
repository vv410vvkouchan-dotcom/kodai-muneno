import { requireUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await requireUser();
  redirect(user.role === 'ADMIN' ? '/admin' : '/member');
}
