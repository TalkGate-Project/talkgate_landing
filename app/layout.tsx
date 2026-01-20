import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Montserrat } from 'next/font/google';
import { cookies } from 'next/headers';
import { Header, Footer } from '@/components';
import { ErrorFeedbackModalProvider } from '@/components/common';
import { BRAND, PAGE_METADATA, COMPANY_INFO } from '@/lib/constants';
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
  metadataBase: new URL('https://talkgate.im'),
  title: {
    default: PAGE_METADATA.main.title,
    template: '%s | Talkgate',
  },
  description: PAGE_METADATA.main.description,
  keywords: [...PAGE_METADATA.main.keywords],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: COMPANY_INFO.name,
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/',
      'en-US': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    url: 'https://talkgate.im',
    siteName: BRAND.name,
    title: PAGE_METADATA.main.title,
    description: PAGE_METADATA.main.description,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Talkgate - All your business workflows in one place',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_METADATA.main.title,
    description: PAGE_METADATA.main.description,
    images: ['/images/og-image.png'],
    creator: '@talkgate',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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

  const siteUrl = 'https://talkgate.im';

  // JSON-LD Structured Data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.name,
    alternateName: ['톡게이트', '토크게이트', 'Talkgate'],
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    description: BRAND.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.representativeNumber,
      contactType: 'customer service',
      email: COMPANY_INFO.email,
      areaServed: 'KR',
      availableLanguage: ['Korean', 'English'],
    },
    sameAs: [
      // 소셜 미디어 링크가 있다면 추가
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND.name,
    alternateName: ['톡게이트', '토크게이트'],
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col`}
      >
        <ErrorFeedbackModalProvider>
          <Header isAuthenticated={isAuthenticated} />
          <main className="flex-1">{children}</main>
          <Footer />
        </ErrorFeedbackModalProvider>
      </body>
    </html>
  );
}
