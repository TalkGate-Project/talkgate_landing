import Image from 'next/image';
import type { CaseStudy } from '@/types';

interface CaseCardProps {
  caseStudy: CaseStudy;
}

/**
 * 성공 케이스 카드 컴포넌트
 */
export function CaseCard({ caseStudy }: CaseCardProps) {
  return (
    <article className="group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-muted mb-4">
        <Image
          src={caseStudy.thumbnailUrl}
          alt={`${caseStudy.title} 성공 사례`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div>
        <h3 className="h-[48px] text-[16px] font-bold leading-[1.5] tracking-[-0.02em] text-[#000] !mb-[5px] group-hover:text-[#808080] transition-colors">
          <span>{caseStudy.tag}</span> {caseStudy.title}
        </h3>
        <p className="text-[16px] leading-[1.5] tracking-[-0.02em] text-[#595959] line-clamp-3">
          {caseStudy.summary}
        </p>
      </div>
    </article>
  );
}