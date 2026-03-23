import Link from 'next/link';
import { Header } from '@/components/Header';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';

export default async function MembersPage() {
  await requireUser('ADMIN');
  const members = await prisma.member.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <Header title="会員一覧" links={[{ href: '/admin', label: '管理トップ' }]} />
      <form action="/api/admin/members" method="post" className="mb-4 grid gap-2 rounded border border-line bg-panel p-4 md:grid-cols-4">
        <input name="name" placeholder="氏名" required />
        <input name="phone" placeholder="電話番号" required />
        <input name="email" placeholder="メール" type="email" required />
        <input name="memo" placeholder="メモ" />
        <button className="bg-white text-black md:col-span-4">会員登録</button>
      </form>
      <div className="overflow-x-auto rounded border border-line">
        <table className="w-full text-sm"><thead className="bg-black/30"><tr><th className="p-2 text-left">氏名</th><th>電話</th><th>メール</th><th /></tr></thead><tbody>
          {members.map((m) => <tr key={m.id} className="border-t border-line"><td className="p-2">{m.name}</td><td>{m.phone}</td><td>{m.email}</td><td><Link className="underline" href={`/admin/members/${m.id}`}>詳細/編集</Link></td></tr>)}
        </tbody></table>
      </div>
    </div>
  );
}
