import type { CaseSortOption } from '@/types';

interface SortTabsProps {
  activeSort: CaseSortOption;
  onSortChange: (sort: CaseSortOption) => void;
}

const SORT_TABS: { value: CaseSortOption; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'date', label: '날짜순' },
  { value: 'views', label: '조회순' },
];

/**
 * 케이스 정렬 탭 컴포넌트
 */
export function SortTabs({ activeSort, onSortChange }: SortTabsProps) {
  return (
    <div className="flex justify-end gap-4">
      {SORT_TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onSortChange(tab.value)}
          className={`text-[16px] font-medium leading-[1] pb-3 border-b-2 transition-colors ${
            tab.value === activeSort
              ? 'text-[#252525] border-[#252525]'
              : 'text-[#808080] border-transparent hover:text-[#252525]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}