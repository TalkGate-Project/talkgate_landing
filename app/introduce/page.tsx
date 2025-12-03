import type { Metadata } from 'next';
import Link from 'next/link';
import { PAGE_METADATA, BRAND } from '@/lib/constants';
import type { TimelineItem } from '@/types';

export const metadata: Metadata = {
  title: PAGE_METADATA.introduce.title,
  description: PAGE_METADATA.introduce.description,
};

/**
 * 회사 스토리 타임라인 데이터
 */
const STORY_ITEMS: TimelineItem[] = [
  {
    date: '2025.11.01',
    title: '고객 관계(CRM) 트렌드 선도, Talkgate이 이끄는 차세대 CX 솔루션',
  },
  {
    date: '2025.11.01',
    title: 'AI 챗봇, Talkgate AI 상담 도우미로 효율 극대화',
  },
];

export default function IntroducePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20">
        <div className="">
          {/* Main Visual */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 p-8 md:p-16 text-white mb-16">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                {BRAND.name}
              </h1>
              <p className="text-lg text-neutral-300 leading-relaxed">
                미래의 고객 변화에 미리 대응하고 앞서 나갈 수 있도록
                <br />
                고객 관계 혁신의 여정을
                <br />
                {BRAND.name}이 함께 만들어갑니다.
              </p>
            </div>
          </div>

          {/* Second Visual + Description */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted">
              <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 flex items-center justify-center">
                <span className="text-muted-foreground">[이미지]</span>
              </div>
            </div>
            <div>
              <p className="typo-h3 leading-relaxed">
                AI와 자동화 기술을 통해 비효율적인 상담
                <br />
                및 영업 프로세스를 제거하고,
                <br />
                기업이 더욱 스마트하고 전략적인
                <br />
                성장을 이룰 수 있도록 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="">
          <h2 className="typo-h1 mb-8">Our Mission</h2>

          <div className="max-w-3xl">
            <p className="typo-h3 mb-6">
              복잡해지는 고객 여정 속에서, 기업의 성장을 가속할 수 있는 최적의
              솔루션은 여전히 부족합니다.
            </p>

            <p className="typo-body text-muted-foreground mb-6">
              {BRAND.name}은 중소기업과 스타트업이 더 빠르게 핵심 고객을 파악할
              수 있도록, 데이터 기반의 의사결정을 돕는 통합 관리 도구와 혁신적인
              고객 관리 시스템을 제공합니다. {BRAND.name}는 중소기업과 스타트업의
              고객 관리 프로세스와 영업 효율 방식을 혁신해 나가고 있습니다.
            </p>

            <p className="typo-body text-muted-foreground">
              앞으로도 {BRAND.name}는 기업들의 성장을 위한 가장 강력한 엔진이
              되어, 비즈니스 발전에 기여하겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="">
          <h2 className="typo-h1 mb-12">Our Story</h2>

          <div className="space-y-6">
            {STORY_ITEMS.map((item, index) => (
              <StoryCard key={index} item={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function StoryCard({ item }: { item: TimelineItem }) {
  return (
    <div className="grid md:grid-cols-[1fr,auto] gap-6 p-6 rounded-xl bg-muted">
      <div>
        <h3 className="typo-h4 mb-2">{item.title}</h3>
        <p className="typo-caption text-muted-foreground">{item.date}</p>
      </div>
      <div className="aspect-video md:w-64 rounded-lg overflow-hidden bg-neutral-800 flex items-center justify-center">
        <span className="text-2xl font-bold text-neutral-400">
          {BRAND.name}
        </span>
      </div>
    </div>
  );
}

