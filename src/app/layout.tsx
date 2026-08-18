import 'bootstrap/dist/css/bootstrap.min.css';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: '109 Transfer',
  description: '109 Transfer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
