import { Header } from '@/components/Header';
import { requireUser } from '@/lib/auth';

export default async function MyPage() {
  const user = await requireUser('MEMBER');
  return (
    <div>
      <Header title="マイページ" links={[{ href: '/member', label: '会員トップ' }, { href: '/member/reservations', label: '予約一覧' }]} />
      <div className="rounded border border-line bg-panel p-4 text-sm space-y-1">
        <p>氏名: {user.member?.name}</p>
        <p>電話: {user.member?.phone}</p>
        <p>メール: {user.member?.email}</p>
        <p>メモ: {user.member?.memo || '-'}</p>
      </div>
    </div>
  );
}
