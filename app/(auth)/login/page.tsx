import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getCurrentUser();
  if (user) redirect('/dashboard');
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md rounded border border-line bg-panel p-6">
      <h1 className="mb-2 text-2xl font-bold">BASEGYM24 予約管理</h1>
      <p className="mb-4 text-sm text-gray-300">管理者または会員でログインしてください</p>
      {error && <p className="mb-3 rounded border border-red-700 bg-red-900/20 px-3 py-2 text-sm">メールアドレスまたはパスワードが違います。</p>}
      <form action="/api/auth/login" method="post" className="space-y-3">
        <div><label className="mb-1 block text-sm">メールアドレス</label><input name="email" type="email" required className="w-full" /></div>
        <div><label className="mb-1 block text-sm">パスワード</label><input name="password" type="password" required className="w-full" /></div>
        <button className="w-full bg-white text-black">ログイン</button>
      </form>
      <div className="mt-4 text-xs text-gray-400">
        <p>管理者: admin@basegym24.local / admin123</p>
        <p>会員: member1@example.com / member123</p>
      </div>
    </div>
  );
}
