import { Header } from '@/components/Header';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatJpDate } from '@/lib/date';
import { RESERVATION_STATUS_LABEL } from '@/lib/reservation-status';

export default async function MyReservations({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser('MEMBER');
  const { error } = await searchParams;
  const reservations = await prisma.reservation.findMany({ where: { memberId: user.memberId! }, include: { course: true }, orderBy: { startsAt: 'asc' } });

  return (
    <div>
      <Header title="自分の予約一覧" links={[{ href: '/member', label: '会員トップ' }, { href: '/member/reserve', label: '予約作成' }]} />
      {error === 'cancel-limit' && <p className="mb-3 rounded border border-red-700 bg-red-900/20 px-3 py-2 text-sm">キャンセル期限を過ぎているため取消できません。</p>}
      <div className="space-y-2">
        {reservations.map((r) => (
          <div key={r.id} className="rounded border border-line bg-panel p-3 text-sm">
            <p>{formatJpDate(r.startsAt)} / {r.course.name} / {RESERVATION_STATUS_LABEL[r.status]}</p>
            {r.status !== 'CANCELED' && <form action="/api/reservations" method="post" className="mt-2"><input type="hidden" name="mode" value="cancel" /><input type="hidden" name="reservationId" value={r.id} /><button className="border border-line">キャンセル</button></form>}
          </div>
        ))}
      </div>
    </div>
  );
}
