import Link from 'next/link';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export default async function AdminPage() {
  await requireUser('ADMIN');
  const [todayCount, memberCount] = await Promise.all([
    prisma.reservation.count(),
    prisma.member.count(),
  ]);

  return (
    <div>
      <Header title="管理ダッシュボード" links={[{ href: '/admin/reservations', label: '予約一覧' }, { href: '/admin/members', label: '会員管理' }, { href: '/admin/settings', label: '営業時間設定' }]} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="予約総数"><p className="text-3xl font-bold">{todayCount}</p></Card>
        <Card title="会員数"><p className="text-3xl font-bold">{memberCount}</p></Card>
      </div>
      <div className="mt-4"><Link href="/admin/reservations" className="rounded bg-white px-4 py-2 text-black">予約を確認する</Link></div>
    </div>
  );
}
