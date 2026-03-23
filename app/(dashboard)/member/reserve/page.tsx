import { addDays, format } from 'date-fns';
import { Header } from '@/components/Header';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAvailableSlots } from '@/lib/reservation';

export default async function ReservePage({ searchParams }: { searchParams: Promise<{ date?: string; courseId?: string; error?: string }> }) {
  await requireUser('MEMBER');
  const { date = format(addDays(new Date(), 1), 'yyyy-MM-dd'), courseId, error } = await searchParams;
  const courses = await prisma.course.findMany({ orderBy: { durationMinutes: 'asc' } });
  const selectedCourse = courses.find((c) => c.id === courseId) ?? courses[0];
  const slots = selectedCourse ? await getAvailableSlots(date, selectedCourse.durationMinutes) : [];

  return (
    <div>
      <Header title="予約作成" links={[{ href: '/member', label: '会員トップ' }, { href: '/member/reservations', label: '自分の予約一覧' }]} />
      {error && <p className="mb-3 rounded border border-red-700 bg-red-900/20 px-3 py-2 text-sm">{decodeURIComponent(error)}</p>}
      <form className="mb-4 flex flex-wrap gap-2" method="get">
        <input type="date" name="date" defaultValue={date} />
        <select name="courseId" defaultValue={selectedCourse?.id}>{courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <button className="border border-line">表示</button>
      </form>
      {slots.length === 0 && <p className="mb-3 text-sm text-gray-300">選択した日は予約可能枠がありません（休業日・休館日・営業時間外の可能性があります）。</p>}
      <div className="grid gap-2 md:grid-cols-2">
        {slots.map((s) => (
          <form key={s.start.toISOString()} action="/api/reservations" method="post" className={`rounded border p-3 ${s.available ? 'border-line bg-panel' : 'border-red-700 bg-red-900/20'}`}>
            <input type="hidden" name="courseId" value={selectedCourse.id} />
            <input type="hidden" name="startsAt" value={s.start.toISOString()} />
            <p>{format(s.start, 'HH:mm')} - {format(s.end, 'HH:mm')}</p>
            <button disabled={!s.available} className="mt-2 border border-line disabled:opacity-40">{s.available ? 'この枠を予約' : '予約不可'}</button>
          </form>
        ))}
      </div>
    </div>
  );
}
