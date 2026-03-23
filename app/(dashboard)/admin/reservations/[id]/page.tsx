import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { formatJpDate } from '@/lib/date';

const labels = { RESERVED: '予約済み', CHECKED: '確認済み', COMPLETED: '完了', CANCELED: 'キャンセル' } as const;

export default async function ReservationDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireUser('ADMIN');
  const { id } = await params;
  const r = await prisma.reservation.findUnique({ where: { id }, include: { member: true, course: true } });
  if (!r) notFound();

  return (
    <div>
      <Header title="予約詳細" links={[{ href: '/admin/reservations', label: '一覧へ戻る' }]} />
      <div className="space-y-2 rounded border border-line bg-panel p-4 text-sm">
        <p>会員名: {r.member.name}</p><p>日時: {formatJpDate(r.startsAt)}</p><p>コース: {r.course.name}</p><p>ステータス: {labels[r.status]}</p><p>備考: {r.note || '-'}</p>
      </div>
      <form action={`/api/admin/reservations/${r.id}/status`} method="post" className="mt-4 flex flex-wrap gap-2">
        <select name="status" defaultValue={r.status}><option value="RESERVED">予約済み</option><option value="CHECKED">確認済み</option><option value="COMPLETED">完了</option><option value="CANCELED">キャンセル</option></select>
        <button className="bg-white text-black">更新</button>
      </form>
    </div>
  );
}
