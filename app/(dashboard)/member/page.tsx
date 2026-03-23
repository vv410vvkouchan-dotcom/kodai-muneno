import { Header } from '@/components/Header';
import { requireUser } from '@/lib/auth';

export default async function MemberTop() {
  const user = await requireUser('MEMBER');
  return (
    <div>
      <Header title={`ようこそ ${user.member?.name ?? ''} さん`} links={[{ href: '/member/reserve', label: '予約作成' }, { href: '/member/reservations', label: '予約一覧' }, { href: '/member/mypage', label: 'マイページ' }]} />
      <div className="rounded border border-line bg-panel p-4 text-sm">予約作成から空き枠を選択して予約できます。</div>
    </div>
  );
}
