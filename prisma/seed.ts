import { PrismaClient, ReservationStatus, UserRole } from '@prisma/client';
import { addDays, setHours, setMinutes, setSeconds } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.member.deleteMany();
  await prisma.course.deleteMany();
  await prisma.businessHour.deleteMany();
  await prisma.closedDay.deleteMany();
  await prisma.appSetting.deleteMany();

  const course30 = await prisma.course.create({ data: { name: '30分コース', durationMinutes: 30 } });
  const course60 = await prisma.course.create({ data: { name: '60分コース', durationMinutes: 60 } });

  await Promise.all(Array.from({ length: 7 }).map((_, day) => prisma.businessHour.create({ data: { dayOfWeek: day, isOpen: day !== 0, openTime: '09:00', closeTime: '21:00' } })));

  await prisma.closedDay.create({ data: { date: addDays(new Date(), 3), reason: 'メンテナンス休館日' } });
  await prisma.appSetting.create({ data: { cancellationDeadlineHour: 12 } });

  const memberA = await prisma.member.create({ data: { name: '山田 太郎', phone: '090-1111-1111', email: 'member1@example.com', memo: '肩こり改善希望' } });
  const memberB = await prisma.member.create({ data: { name: '佐藤 花子', phone: '090-2222-2222', email: 'member2@example.com', memo: 'ダイエット目的' } });

  await prisma.user.createMany({ data: [
    { email: 'admin@basegym24.local', password: 'admin123', role: UserRole.ADMIN },
    { email: 'member1@example.com', password: 'member123', role: UserRole.MEMBER, memberId: memberA.id },
    { email: 'member2@example.com', password: 'member123', role: UserRole.MEMBER, memberId: memberB.id },
  ]});

  const tomorrow10 = setSeconds(setMinutes(setHours(addDays(new Date(), 1), 10), 0), 0);
  const tomorrow11 = setSeconds(setMinutes(setHours(addDays(new Date(), 1), 11), 0), 0);

  await prisma.reservation.create({ data: { memberId: memberA.id, courseId: course60.id, startsAt: tomorrow10, endsAt: new Date(tomorrow10.getTime() + 60 * 60000), status: ReservationStatus.RESERVED, note: '下半身中心' } });
  await prisma.reservation.create({ data: { memberId: memberB.id, courseId: course30.id, startsAt: tomorrow11, endsAt: new Date(tomorrow11.getTime() + 30 * 60000), status: ReservationStatus.CHECKED, note: '体験2回目' } });
}

main().finally(async () => prisma.$disconnect());
