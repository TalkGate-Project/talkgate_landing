import { MetadataRoute } from 'next';
import { CASE_STUDIES } from '@/lib/caseStudies';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://talkgate.im';

  const pages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/introduce`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guide`,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  const casePages: MetadataRoute.Sitemap = CASE_STUDIES.map((caseStudy) => ({
    url: `${baseUrl}/case/${caseStudy.id}`,
    lastModified: new Date(caseStudy.publishedAt.replaceAll('.', '-')),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...pages, ...casePages];
}
