import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header, Footer } from '@/components';
import { BRAND, PAGE_METADATA } from '@/lib/constants';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: PAGE_METADATA.main.title,
  description: PAGE_METADATA.main.description,
  keywords: ['CRM', '고객관리', '상담관리', 'Talkgate', '톡게이트'],
  authors: [{ name: BRAND.name }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: BRAND.name,
    title: PAGE_METADATA.main.title,
    description: PAGE_METADATA.main.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_METADATA.main.title,
    description: PAGE_METADATA.main.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: 서버에서 인증 상태 확인
  // const cookieStore = await cookies();
  // const isAuthenticated = checkAuthFromCookies(cookieStore);
  const isAuthenticated = false;

  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header isAuthenticated={isAuthenticated} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
