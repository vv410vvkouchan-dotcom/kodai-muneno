import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { formatJpDate } from '@/lib/date';
import { RESERVATION_STATUS_LABEL } from '@/lib/reservation-status';

export default async function MemberDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireUser('ADMIN');
  const { id } = await params;
  const member = await prisma.member.findUnique({ where: { id }, include: { reservations: { include: { course: true }, orderBy: { startsAt: 'desc' } } } });
  if (!member) notFound();

  return (
    <div>
      <Header title="会員詳細 / 編集" links={[{ href: '/admin/members', label: '会員一覧へ戻る' }]} />
      <form action={`/api/admin/members/${member.id}`} method="post" className="grid gap-2 rounded border border-line bg-panel p-4 md:grid-cols-2">
        <input name="name" defaultValue={member.name} required />
        <input name="phone" defaultValue={member.phone} required />
        <input name="email" defaultValue={member.email} type="email" required />
        <input name="memo" defaultValue={member.memo || ''} />
        <button className="bg-white text-black md:col-span-2">更新</button>
      </form>
      <h3 className="mt-4 mb-2 text-lg">予約履歴</h3>
      <div className="space-y-2">
        {member.reservations.map((r) => <div key={r.id} className="rounded border border-line bg-panel p-3 text-sm">{formatJpDate(r.startsAt)} / {r.course.name} / {RESERVATION_STATUS_LABEL[r.status]}</div>)}
      </div>
    </div>
  );
}
