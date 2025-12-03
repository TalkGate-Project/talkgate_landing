'use client';

import React from 'react';
import type { CaseStudy, CaseSortOption } from '@/types';
import { SortTabs } from './SortTabs';
import { CaseCard } from './CaseCard';

interface CaseListSectionProps {
  caseStudies: CaseStudy[];
}

/**
 * 케이스 리스트 섹션 - 정렬 기능이 포함된 클라이언트 컴포넌트
 * 
 * @description
 * 성공 케이스 목록을 표시하고 정렬 기능을 제공합니다.
 * - 전체: 기본 순서 유지
 * - 날짜순: 최신순 정렬
 * - 조회순: 조회수 높은 순 정렬
 */
export function CaseListSection({ caseStudies }: CaseListSectionProps) {
  const [activeSort, setActiveSort] = React.useState<CaseSortOption>('date');

  // 정렬된 케이스 목록
  const sortedCases = React.useMemo(() => {
    const sorted = [...caseStudies];
    
    switch (activeSort) {
      case 'date':
        // 날짜순: 최신순 (publishedAt 내림차순)
        return sorted.sort((a, b) => {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
      
      case 'views':
        // 조회순: 조회수 높은 순
        return sorted.sort((a, b) => {
          return (b.viewCount || 0) - (a.viewCount || 0);
        });
      
      case 'all':
      default:
        // 전체: 기본 순서 유지
        return sorted;
    }
  }, [caseStudies, activeSort]);

  return (
    <>
      {/* Sort Tabs */}
      <SortTabs activeSort={activeSort} onSortChange={setActiveSort} />

      {/* Case Grid - 반응형: 모바일(1열), 태블릿(2열), 데스크톱(3열) */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-[68px]">
        {sortedCases.map((caseStudy) => (
          <CaseCard key={caseStudy.id} caseStudy={caseStudy} />
        ))}
      </div>
    </>
  );
}

