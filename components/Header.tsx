import Link from 'next/link';

export function Header({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <header className="mb-6 rounded border border-line bg-panel p-4">
      <div className="mb-3 text-xl font-semibold">{title}</div>
      <nav className="flex flex-wrap gap-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded border border-line px-3 py-2 text-sm hover:bg-black/30">
            {l.label}
          </Link>
        ))}
        <form action="/api/auth/logout" method="post"><button className="border border-line">ログアウト</button></form>
      </nav>
    </header>
  );
}
