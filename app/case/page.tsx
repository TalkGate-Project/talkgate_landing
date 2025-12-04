import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PAGE_METADATA } from '@/lib/constants';
import { CASE_STUDIES } from '@/lib/caseStudies';
import { CaseListSection } from '@/modules/case';

export const metadata: Metadata = {
  title: PAGE_METADATA.case.title,
  description: PAGE_METADATA.case.description,
};

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
