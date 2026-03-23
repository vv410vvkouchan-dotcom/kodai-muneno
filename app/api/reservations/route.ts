import { addHours, isBefore } from 'date-fns';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { canReserve } from '@/lib/reservation';

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'MEMBER' || !user.memberId) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const form = await req.formData();
  const mode = String(form.get('mode') ?? 'create');

  if (mode === 'cancel') {
    const reservationId = String(form.get('reservationId') ?? '');
    const setting = await prisma.appSetting.findUnique({ where: { id: 'singleton' } });
    const r = await prisma.reservation.findUnique({ where: { id: reservationId } });
    if (!r || r.memberId !== user.memberId) return NextResponse.json({ error: '対象予約が見つかりません。' }, { status: 404 });

    const cancelLimit = addHours(new Date(), setting?.cancellationDeadlineHour ?? 12);
    if (!isBefore(cancelLimit, r.startsAt)) {
      return NextResponse.redirect(new URL('/member/reservations?error=cancel-limit', req.url));
    }

    await prisma.reservation.update({ where: { id: reservationId }, data: { status: 'CANCELED' } });
    return NextResponse.redirect(new URL('/member/reservations', req.url));
  }

  const courseId = String(form.get('courseId') ?? '');
  const startsAt = new Date(String(form.get('startsAt') ?? ''));
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return NextResponse.json({ error: 'コースが存在しません。' }, { status: 400 });

  const check = await canReserve(startsAt, course.durationMinutes);
  if (!check.ok) return NextResponse.redirect(new URL(`/member/reserve?error=${encodeURIComponent(check.message ?? '予約エラー')}`, req.url));

  await prisma.reservation.create({ data: { memberId: user.memberId, courseId, startsAt, endsAt: check.end!, status: 'RESERVED' } });
  return NextResponse.redirect(new URL('/member/reservations', req.url));
}
