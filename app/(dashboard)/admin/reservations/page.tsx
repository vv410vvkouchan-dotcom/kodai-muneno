import Link from 'next/link';
import { addDays, format, startOfDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Header } from '@/components/Header';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { formatJpDate } from '@/lib/date';
import { RESERVATION_STATUS_LABEL } from '@/lib/reservation-status';

export default async function AdminReservationsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  await requireUser('ADMIN');
  const { view = 'day' } = await searchParams;
  const now = new Date();
  const to = view === 'week' ? addDays(now, 7) : addDays(now, 1);
  const reservations = await prisma.reservation.findMany({ where: { startsAt: { gte: startOfDay(now), lt: to } }, include: { member: true, course: true }, orderBy: { startsAt: 'asc' } });

  return (
    <div>
      <Header title="予約一覧" links={[{ href: '/admin', label: '管理トップ' }, { href: '/admin/reservations?view=day', label: '日別' }, { href: '/admin/reservations?view=week', label: '週別' }]} />
      <p className="mb-3 text-sm text-gray-300">{view === 'week' ? '週別' : '日別'}表示 ({format(now, 'yyyy/MM/dd', { locale: ja })} 起点)</p>
      <div className="overflow-x-auto rounded border border-line">
        <table className="w-full text-sm">
          <thead className="bg-black/30"><tr><th className="p-2 text-left">会員名</th><th>日時</th><th>コース</th><th>ステータス</th><th>備考</th><th /></tr></thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-t border-line">
                <td className="p-2">{r.member.name}</td><td>{formatJpDate(r.startsAt)}</td><td>{r.course.name}</td><td>{RESERVATION_STATUS_LABEL[r.status]}</td><td>{r.note || '-'}</td>
                <td><Link className="underline" href={`/admin/reservations/${r.id}`}>詳細</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
