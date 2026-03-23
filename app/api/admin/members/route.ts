import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: '認証エラー' }, { status: 401 });
  const form = await req.formData();
  await prisma.member.create({ data: { name: String(form.get('name')), phone: String(form.get('phone')), email: String(form.get('email')), memo: String(form.get('memo') ?? '') } });
  return NextResponse.redirect(new URL('/admin/members', req.url));
}
