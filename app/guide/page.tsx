import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BRAND, PAGE_METADATA, EXTERNAL_LINKS } from "@/lib/constants";

export const metadata: Metadata = {
  title: PAGE_METADATA.guide.title,
  description: PAGE_METADATA.guide.description,
  alternates: { canonical: "/guide" },
};

export default function GuidePage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: BRAND.nameKo,
        item: "https://talkgate.im",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "이용가이드",
        item: "https://talkgate.im/guide",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      <section className="overflow-hidden bg-white px-4">
        <div className="mx-auto flex min-h-[620px] max-w-[1164px] flex-col items-center justify-center gap-10 py-14 md:min-h-[668px] md:flex-row md:justify-between md:gap-12 md:py-16 lg:gap-20 xl:translate-x-[19px] xl:items-start xl:gap-0 xl:py-0">
          <div className="guide-hero-content w-full max-w-[360px] text-center md:w-[36%] md:max-w-[360px] md:text-left xl:mt-[165px] xl:w-[280px]">
            <p className="text-[16px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#00E272] md:text-[18px]">
              Talkgate 이용가이드
            </p>
            <h1 className="!mt-3 text-[28px] font-bold leading-[1.5] tracking-[-0.03em] text-black md:text-[32px]">
              필요한 기능부터,
              <br />
              쉽게 시작해보세요.
            </h1>
            <p className="!mt-6 text-[15px] leading-[1.5] tracking-[-0.02em] text-[#595959] md:text-[16px]">
              Talkgate의 주요 기능과 사용 방법을 확인하고 프로젝트에 맞게 활용해보세요.
            </p>
            <Link
              href={EXTERNAL_LINKS.userGuide}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-[52px] w-full max-w-[280px] items-center justify-center rounded-full bg-black px-6 text-[17px] font-semibold leading-[1.5] tracking-[-0.02em] text-white transition-colors hover:bg-[#252525] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00E272] md:mt-10 md:text-[18px]"
            >
              이용가이드
            </Link>
          </div>

          <div className="guide-hero-image relative w-full max-w-[642px] md:w-[56%] xl:mt-[97px] xl:w-[642px] xl:max-w-none xl:translate-x-6">
            <Image
              src="/images/guide-hero.png"
              alt="Talkgate 고객관리 대시보드 이용가이드 미리보기"
              width={1242}
              height={865}
              className="h-auto w-full"
              sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) 56vw, 642px"
              priority
            />
          </div>
        </div>
      </section>
    </>
  );
}
