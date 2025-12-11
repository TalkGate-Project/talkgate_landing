import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Montserrat } from 'next/font/google';
import { cookies } from 'next/headers';
import { Header, Footer } from '@/components';
import { BRAND, PAGE_METADATA } from '@/lib/constants';
import { checkAuthStatus } from '@/lib/auth';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 서버에서 인증 상태 확인 (메인 서비스 API를 통해)
  const cookieStore = await cookies();
  const isAuthenticated = await checkAuthStatus(cookieStore);

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header isAuthenticated={isAuthenticated} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
