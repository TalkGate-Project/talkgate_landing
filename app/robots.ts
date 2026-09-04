import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { isIndexableRequest } from '@/lib/seo';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = 'https://talkgate.im';
  const headersList = await headers();

  if (!isIndexableRequest(headersList)) {
    /**
     * 비운영 배포(dev.talkgate.im 등).
     *
     * 주의: 여기서 `Disallow: /`를 쓰면 안 됩니다.
     * dev URL이 이미 색인된 상태이므로, 크롤링을 막으면 검색엔진이
     * 페이지의 noindex 메타를 읽지 못해 "robots.txt에 의해 차단되었으나 색인됨"
     * 상태로 계속 남습니다.
     *
     * 따라서 크롤링은 열어두고(= noindex를 읽게 하고), 색인은
     * 각 페이지의 noindex 메타로 막습니다. (app/layout.tsx generateMetadata)
     * 색인에서 완전히 제거된 것을 GSC에서 확인한 뒤에 Disallow로 전환하면 됩니다.
     *
     * 운영 sitemap은 광고하지 않습니다.
     */
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/test/'],
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/test/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    // Host 지시어는 프로토콜을 제외한 호스트명만 사용합니다.
    host: new URL(baseUrl).host,
  };
}
