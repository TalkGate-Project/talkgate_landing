import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PAGE_METADATA } from '@/lib/constants';
import type { CaseStudy } from '@/types';
import { CaseListSection } from '@/modules/case';

export const metadata: Metadata = {
  title: PAGE_METADATA.case.title,
  description: PAGE_METADATA.case.description,
};

/**
 * 고객 성공 사례 데이터
 * 실제 운영 환경에서는 API 또는 CMS에서 데이터를 가져옵니다.
 */
const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    tag: '[스타트업]',
    title: 'NANO-M (온라인 구독 서비스)[스타트업] NANO-M (온라인 구독 서비스)',
    summary:
      "'통합 히스토리 뷰' 기능을 도입하여 고객의 과거 상담 기록, 웹사이트 방문 기록, 구매 내역 등을 클릭 한 번으로 확인할 수 있습니다.",
    thumbnailUrl: '/images/success-case-1.png',
    publishedAt: '2025.11.01',
    viewCount: 1250,
  },
  {
    id: '2',
    tag: '[중견 기업]',
    title: 'D-Partners (B2B 솔루션 영업)',
    summary:
      "'자동 활동 기록' 기능으로 전화, 이메일 등 모든 상호작용이 자동으로 기록되어 데이터 누락을 원천 차단했습니다.",
    thumbnailUrl: '/images/success-case-2.png',
    publishedAt: '2025.10.28',
    viewCount: 980,
  },
  {
    id: '3',
    tag: '[금융사]',
    title: 'K-Asset (자산 관리)',
    summary:
      "'권한 기반 관리 정책' 기능을 활용하여, 자산 관리팀, CS팀, 마케팅팀 등 조직 역할에 따라 접근할 수 있는 고객 데이터 영역을 자동으로 구분하고 통제했습니다.",
    thumbnailUrl: '/images/success-case-3.png',
    publishedAt: '2025.10.25',
    viewCount: 1580,
  },
  {
    id: '4',
    tag: '[IT 서비스]',
    title: 'TechFlow (클라우드 솔루션)',
    summary:
      "'실시간 대시보드' 기능을 통해 고객 응대 현황과 성과 지표를 한눈에 파악하고, 즉각적인 의사결정이 가능해졌습니다.",
    thumbnailUrl: '/images/success-case-4.png',
    publishedAt: '2025.10.20',
    viewCount: 2100,
  },
  {
    id: '5',
    tag: '[제조업]',
    title: 'GlobalTech (산업 자동화)',
    summary:
      "'AI 예측 분석' 기능으로 고객의 구매 패턴과 니즈를 사전에 파악하여, 맞춤형 제안으로 매출이 30% 증가했습니다.",
    thumbnailUrl: '/images/success-case-5.png',
    publishedAt: '2025.10.15',
    viewCount: 1750,
  },
  {
    id: '6',
    tag: '[교육]',
    title: 'EduNext (온라인 교육 플랫폼)',
    summary:
      "'멀티채널 통합 관리' 기능으로 웹, 모바일, 이메일 등 다양한 채널의 고객 문의를 하나의 플랫폼에서 효율적으로 관리합니다.",
    thumbnailUrl: '/images/success-case-6.png',
    publishedAt: '2025.10.10',
    viewCount: 1420,
  },
];

/**
 * 성공 케이스 페이지
 * 고객들의 Talkgate 도입 성공 사례를 소개합니다.
 */
export default function CasePage() {
  return (
    <section className="pt-[75px] pb-[166px]">
      <div className="max-w-[1152px] mx-auto">
        {/* Header */}
        <div className="text-center mb-[60px]">
          <h1 className="text-[32px] font-bold leading-[1.5] tracking-[-0.03em] text-[#252525] !mb-3">
            실제 기업들의 성과를 확인하고,
            <br />
            가치를 확인하세요.
          </h1>
          <p className="text-[16px] leading-[1.5] tracking-[-0.02em] text-[#595959]">
            고객들의 도입 성공 사례를 확인하세요.
          </p>
        </div>

        {/* Case List with Sort */}
        <Suspense fallback={<CaseListSkeleton />}>
          <CaseListSection caseStudies={CASE_STUDIES} />
        </Suspense>
      </div>
    </section>
  );
}

/**
 * 케이스 리스트 로딩 스켈레톤
 */
function CaseListSkeleton() {
  return (
    <>
      {/* Sort Tabs Skeleton */}
      <div className="flex justify-end gap-4 mb-10">
        <div className="h-[24px] w-[48px] bg-muted rounded animate-pulse" />
        <div className="h-[24px] w-[64px] bg-muted rounded animate-pulse" />
        <div className="h-[24px] w-[64px] bg-muted rounded animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-[68px]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            {/* Thumbnail Skeleton */}
            <div className="aspect-[16/10] rounded-lg bg-muted mb-4" />
            {/* Title Skeleton */}
            <div className="h-[48px] bg-muted rounded mb-2" />
            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
