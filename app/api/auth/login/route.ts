import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.formData();
  const email = String(data.get('email') ?? '');
  const password = String(data.get('password') ?? '');

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return NextResponse.redirect(new URL('/login?error=1', req.url));
  }

  const res = NextResponse.redirect(new URL('/dashboard', req.url));
  res.cookies.set('userId', user.id, { httpOnly: true, path: '/' });
  return res;
}
