import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Fenomenológico',
  description: 'Fenomenológico - Spero',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
