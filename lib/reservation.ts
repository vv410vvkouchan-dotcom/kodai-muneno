import { addMinutes, isBefore, parseISO, setHours, setMinutes, startOfDay } from 'date-fns';
import { prisma } from '@/lib/prisma';

function parseTime(base: Date, time: string) {
  const [h, m] = time.split(':').map(Number);
  return setMinutes(setHours(base, h), m);
}

function overlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export async function getAvailableSlots(targetDateISO: string, duration: number) {
  const targetDate = parseISO(targetDateISO);
  const dow = targetDate.getDay();
  const hour = await prisma.businessHour.findUnique({ where: { dayOfWeek: dow } });
  if (!hour || !hour.isOpen) return [];

  const closed = await prisma.closedDay.findFirst({ where: { date: { gte: startOfDay(targetDate), lt: addMinutes(startOfDay(targetDate), 1440) } } });
  if (closed) return [];

  const open = parseTime(targetDate, hour.openTime);
  const close = parseTime(targetDate, hour.closeTime);

  const reservations = await prisma.reservation.findMany({ where: { startsAt: { lt: close }, endsAt: { gt: open }, status: { not: 'CANCELED' } } });

  const slots: { start: Date; end: Date; available: boolean }[] = [];
  for (let cursor = new Date(open); cursor < close; cursor = addMinutes(cursor, 30)) {
    const end = addMinutes(cursor, duration);
    if (end > close) continue;
    const conflicted = reservations.some((r) => overlap(cursor, end, r.startsAt, r.endsAt));
    const available = !conflicted && !isBefore(cursor, new Date());
    slots.push({ start: new Date(cursor), end, available });
  }
  return slots;
}

export async function canReserve(start: Date, duration: number) {
  const dow = start.getDay();
  const hour = await prisma.businessHour.findUnique({ where: { dayOfWeek: dow } });
  if (!hour || !hour.isOpen) return { ok: false, message: 'この日は営業日ではありません。' };
  const closed = await prisma.closedDay.findFirst({ where: { date: { gte: startOfDay(start), lt: addMinutes(startOfDay(start), 1440) } } });
  if (closed) return { ok: false, message: '休館日のため予約できません。' };
  if (isBefore(start, new Date())) return { ok: false, message: '過去日時は予約できません。' };

  const open = parseTime(start, hour.openTime);
  const close = parseTime(start, hour.closeTime);
  const end = addMinutes(start, duration);
  if (start < open || end > close) return { ok: false, message: '営業時間外は予約できません。' };

  const conflicts = await prisma.reservation.findMany({ where: { startsAt: { lt: end }, endsAt: { gt: start }, status: { not: 'CANCELED' } } });
  if (conflicts.length > 0) return { ok: false, message: 'この時間枠は既に予約されています。' };

  return { ok: true, end };
}
