import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <main className="mx-auto min-h-screen max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
