'use client';

import { useMemo, useState } from 'react';
import type { CaseStudy, CaseSortOption } from '@/types';
import { SortTabs } from './SortTabs';
import { CaseCard } from './CaseCard';

interface CaseListSectionProps {
  caseStudies: CaseStudy[];
}

/**
 * 케이스 리스트 섹션
 * 
 * 정렬 기능이 포함된 성공 케이스 목록 (전체/날짜순/조회순)
 */
export function CaseListSection({ caseStudies }: CaseListSectionProps) {
  const [activeSort, setActiveSort] = useState<CaseSortOption>('date');

  const sortedCases = useMemo(() => {
    const sorted = [...caseStudies];
    
    switch (activeSort) {
      case 'date':
        return sorted.sort((a, b) => {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
      
      case 'views':
        return sorted.sort((a, b) => {
          return (b.viewCount || 0) - (a.viewCount || 0);
        });
      
      case 'all':
      default:
        return sorted;
    }
  }, [caseStudies, activeSort]);

  return (
    <>
      <SortTabs activeSort={activeSort} onSortChange={setActiveSort} />

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-[68px]">
        {sortedCases.map((caseStudy) => (
          <CaseCard key={caseStudy.id} caseStudy={caseStudy} />
        ))}
      </div>
    </>
  );
}