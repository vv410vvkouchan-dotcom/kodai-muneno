import { parseISO } from 'date-fns';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return NextResponse.json({ error: '認証エラー' }, { status: 401 });

  const form = await req.formData();
  const mode = String(form.get('mode') ?? 'main');

  if (mode === 'closed') {
    await prisma.closedDay.create({ data: { date: parseISO(String(form.get('closedDate'))), reason: String(form.get('reason') ?? '') } });
    return NextResponse.redirect(new URL('/admin/settings', req.url));
  }

  for (let d = 0; d < 7; d += 1) {
    await prisma.businessHour.update({
      where: { dayOfWeek: d },
      data: {
        isOpen: form.get(`open_${d}`) === '1',
        openTime: String(form.get(`start_${d}`)),
        closeTime: String(form.get(`end_${d}`)),
      },
    });
  }

  await prisma.appSetting.upsert({ where: { id: 'singleton' }, create: { id: 'singleton', cancellationDeadlineHour: Number(form.get('deadline') ?? 12) }, update: { cancellationDeadlineHour: Number(form.get('deadline') ?? 12) } });
  return NextResponse.redirect(new URL('/admin/settings', req.url));
}
