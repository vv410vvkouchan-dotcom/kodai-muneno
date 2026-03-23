import { Header } from '@/components/Header';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/auth';
import { toDateKey } from '@/lib/date';

const days = ['日', '月', '火', '水', '木', '金', '土'];

export default async function SettingsPage() {
  await requireUser('ADMIN');
  const [hours, closedDays, setting] = await Promise.all([
    prisma.businessHour.findMany({ orderBy: { dayOfWeek: 'asc' } }),
    prisma.closedDay.findMany({ orderBy: { date: 'asc' } }),
    prisma.appSetting.findUnique({ where: { id: 'singleton' } }),
  ]);

  return (
    <div>
      <Header title="営業日・営業時間設定" links={[{ href: '/admin', label: '管理トップ' }]} />
      <form action="/api/admin/settings" method="post" className="space-y-4">
        <div className="rounded border border-line bg-panel p-4">
          <h3 className="mb-2 font-semibold">営業時間</h3>
          <div className="space-y-2">{hours.map((h) => <div key={h.id} className="grid grid-cols-4 items-center gap-2 text-sm"><span>{days[h.dayOfWeek]}</span><select name={`open_${h.dayOfWeek}`} defaultValue={h.isOpen ? '1' : '0'}><option value="1">営業</option><option value="0">休業</option></select><input name={`start_${h.dayOfWeek}`} type="time" defaultValue={h.openTime} /><input name={`end_${h.dayOfWeek}`} type="time" defaultValue={h.closeTime} /></div>)}</div>
        </div>
        <div className="rounded border border-line bg-panel p-4">
          <h3 className="mb-2 font-semibold">キャンセル期限(時間)</h3>
          <input name="deadline" type="number" defaultValue={setting?.cancellationDeadlineHour ?? 12} />
        </div>
        <button className="bg-white text-black">設定保存</button>
      </form>
      <form action="/api/admin/settings" method="post" className="mt-4 rounded border border-line bg-panel p-4 text-sm">
        <h3 className="mb-2 font-semibold">休館日追加</h3>
        <input type="hidden" name="mode" value="closed" />
        <input name="closedDate" type="date" required />
        <input name="reason" placeholder="理由" className="ml-2" />
        <button className="ml-2 border border-line">追加</button>
      </form>
      <ul className="mt-3 text-sm">{closedDays.map((c) => <li key={c.id}>{toDateKey(c.date)} {c.reason ? `- ${c.reason}` : ''}</li>)}</ul>
    </div>
  );
}
