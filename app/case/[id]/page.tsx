import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCaseStudyById, getAllCaseStudyIds } from '@/lib/caseStudies';

interface CaseDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 정적 경로 생성 (SSG)
 */
export function generateStaticParams() {
  const ids = getAllCaseStudyIds();
  return ids.map((id) => ({ id }));
}

/**
 * 메타데이터 생성
 */
export async function generateMetadata({
  params,
}: CaseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const caseStudy = getCaseStudyById(id);

  if (!caseStudy) {
    return {
      title: '케이스를 찾을 수 없습니다',
    };
  }

  return {
    title: `${caseStudy.tag} ${caseStudy.title} | Talkgate`,
    description: caseStudy.summary,
  };
}

/**
 * 고객 성공 사례 상세 페이지
 */
export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params;
  const caseStudy = getCaseStudyById(id);

  if (!caseStudy) {
    notFound();
  }

  return (
    <section className="relative bg-white">
      {/* Main Content Container */}
      <div className="max-w-[752px] mx-auto pt-[40px] md:pt-[112px] pb-[60px] md:pb-[141px] px-4 md:px-0">
        {/* Breadcrumb Navigation */}
        <div className="mb-[32px] md:mb-[56px]">
          <Link
            href="/case"
            className="inline-flex items-center gap-2 text-[18px] md:text-[24px] font-bold leading-[1.5] tracking-[-0.03em] text-[#252525] hover:text-[#808080] transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-90"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            고객 성공 사례
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-[24px] md:text-[36px] font-bold leading-[1.5] tracking-[-0.03em] text-[#252525] !mb-[20px] md:!mb-[24px]">
          {caseStudy.tag} {caseStudy.title}
        </h1>

        {/* Main Image */}
        {caseStudy.detailImageUrl && (
          <div className="relative w-full md:w-[752px] h-[200px] md:h-[462px] mx-auto mb-[20px] md:mb-[24px] rounded-[12px] overflow-hidden">
            <Image
              src={caseStudy.detailImageUrl}
              alt={`${caseStudy.title} 이미지`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 752px"
              priority
            />
          </div>
        )}

        {/* Content Sections */}
        {caseStudy.sections && caseStudy.sections.length > 0 && (
          <div className="w-full md:w-[752px] flex flex-col gap-[24px] md:gap-[28px] items-start">
            {caseStudy.sections.map((section, index) => (
              <div key={index} className="flex flex-col">
                {/* Section Title */}
                <h2 className="text-[20px] md:text-[24px] font-bold leading-[1.5] tracking-[-0.02em] text-[#252525] text-left !mb-[20px] md:!mb-[28px]">
                  {section.title}
                </h2>

                {/* Section Content */}
                <p className="text-[14px] md:text-[16px] font-normal leading-[1.5] tracking-[-0.02em] text-[#595959] whitespace-pre-wrap">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

