import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PAGE_METADATA } from '@/lib/constants';
import type { CaseStudy, CaseSortOption } from '@/types';

export const metadata: Metadata = {
  title: PAGE_METADATA.case.title,
  description: PAGE_METADATA.case.description,
};

/**
 * 고객 성공 사례 데이터
 * 실제 데이터는 API 또는 CMS에서 가져올 수 있음
 */
const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    tag: '[스타트업]',
    title: 'NANO-M (온라인 구독 서비스)[스타트업] NANO-M (온라인 구독 서비스)',
    summary:
      "'통합 히스토리 뷰' 기능을 도입하여 고객의 과거 상담 기록, 웹사이트 방문 기록, 구매 내역 등을 클릭 한 번으로확인할수있습니다.",
    thumbnailUrl: '/images/cases/case-1.jpg',
    publishedAt: '2025.11.01',
  },
  {
    id: '2',
    tag: '[중견 기업]',
    title: 'D-Partners (B2B 솔루션 영업)',
    summary:
      "'자동 활동 기록' 기능으로 전화, 이메일 등 모든 상호작용이 자동으로 기록되어 데이터 누락을 원천 차단했습니다.",
    thumbnailUrl: '/images/cases/case-2.jpg',
    publishedAt: '2025.11.01',
  },
  {
    id: '3',
    tag: '[금융사]',
    title: 'K-Asset (자산 관리)',
    summary:
      "'권한 기반 관리 정책' 기능을 활용하여, 자산 관리팀, CS팀, 마케팅팀 등 조직 역할에 따라 접근할 수 있는 고객 데이터 영역을 자동으로 구분하고 통제했습니다.",
    thumbnailUrl: '/images/cases/case-3.jpg',
    publishedAt: '2025.11.01',
  },
];

export default function CasePage() {
  return (
    <section className="py-20">
      <div className="">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="typo-h1 mb-4">
            실제 기업들의 성과를 확인하고,
            <br />
            가치를 확인하세요.
          </h1>
          <p className="typo-body text-muted-foreground">
            고객들의 도입 성공 사례를 확인하세요.
          </p>
        </div>

        {/* Sort Tabs */}
        <SortTabs />

        {/* Case Grid */}
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((caseStudy) => (
            <CaseCard key={caseStudy.id} caseStudy={caseStudy} />
          ))}
        </div>

        {/* More cases - duplicate for demo */}
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((caseStudy) => (
            <CaseCard key={`dup-${caseStudy.id}`} caseStudy={caseStudy} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SortTabs() {
  // TODO: 클라이언트 컴포넌트로 분리하여 정렬 상태 관리
  const tabs: { value: CaseSortOption; label: string }[] = [
    { value: 'all', label: '전체' },
    { value: 'date', label: '날짜순' },
    { value: 'views', label: '조회순' },
  ];

  return (
    <div className="flex justify-end gap-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`typo-body-sm ${
            tab.value === 'date'
              ? 'text-foreground font-medium border-b-2 border-foreground pb-1'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function CaseCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <article className="group">
      {/* Thumbnail */}
      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-4">
        {/* 실제 구현시 Image 컴포넌트 사용 */}
        <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
          <span className="text-muted-foreground text-sm">[이미지]</span>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="typo-h4 mb-2 group-hover:text-primary transition-colors">
          {caseStudy.tag} {caseStudy.title}
        </h3>
        <p className="typo-body-sm text-muted-foreground line-clamp-3">
          {caseStudy.summary}
        </p>
      </div>
    </article>
  );
}

