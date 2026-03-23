import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: '認証エラー' }, { status: 401 });
  const { id } = await params;
  const form = await req.formData();
  const status = String(form.get('status') ?? 'RESERVED') as 'RESERVED' | 'CHECKED' | 'COMPLETED' | 'CANCELED';
  await prisma.reservation.update({ where: { id }, data: { status } });
  return NextResponse.redirect(new URL(`/admin/reservations/${id}`, req.url));
}
