import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: '認証エラー' }, { status: 401 });
  const form = await req.formData();
  const { id } = await params;
  await prisma.member.update({ where: { id }, data: { name: String(form.get('name')), phone: String(form.get('phone')), email: String(form.get('email')), memo: String(form.get('memo') ?? '') } });
  return NextResponse.redirect(new URL(`/admin/members/${id}`, req.url));
}
