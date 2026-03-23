import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const store = await cookies();
  const userId = store.get('userId')?.value;
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId }, include: { member: true } });
}

export async function requireUser(role?: 'ADMIN' | 'MEMBER') {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (role && user.role !== role) redirect('/dashboard');
  return user;
}
