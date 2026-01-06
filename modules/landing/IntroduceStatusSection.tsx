'use client';

import { useEffect, useRef, useState } from 'react';
import Image from "next/image";

export function IntroduceStatusSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 md:py-20 px-4" ref={sectionRef}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-5 md:mb-16">
          <h5 className="text-primary-60 font-semibold text-[14px] md:text-[18px] leading-[1.5] tracking-[-0.02em] !mb-3">
            데이터 기반의 통계
          </h5>
          <h2 className="text-[20px] md:text-[32px] leading-[1.5] tracking-[-0.03em] font-bold">
            성과 랭킹을 공개하여<br className="md:hidden" />목표달성을 촉진하세요.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[70px]">
          <div className={`bg-[#F6F6F6] rounded-[16px] text-center px-4 md:px-6 md:!px-[36px] pt-4 md:pt-8 md:!pt-[58px] pb-4 md:pb-0 w-full md:min-h-[570px] status-card-left ${isVisible ? 'animate' : ''}`}>
            <Image
              src="/images/introduce-status-1.png"
              alt="introduce-status-1"
              width={478}
              height={264}
              className="w-full h-auto"
            />
            <h3 className="text-[16px] md:text-[24px] font-bold leading-[1.5] tracking-[-0.03em] text-[#000] !mt-8 md:!mt-[62px] !mb-4 md:!mb-5">다양한 기준별 성과 및 순위 분석</h3>
            <p className="text-[14px] md:text-[17px] text-[#595959] font-normal leading-[1.5] tracking-[-0.02em]">
              일간, 월간 등 기간별 상세 데이터를<br className="md:hidden" />손쉽게 비교하고, <br className="hidden md:block" />
              다양한 기준별 비즈니스 성장의 <br className="md:hidden" />패턴을 명확히 파악하세요.
            </p>
          </div>
          <div className={`bg-[#F6F6F6] rounded-[16px] text-center px-4 md:px-6 md:!px-[36px] pt-4 md:pt-8 md:!pt-[58px] pb-4 md:pb-0 w-full md:min-h-[570px] status-card-right ${isVisible ? 'animate' : ''}`}>
            <Image
              src="/images/introduce-status-2.png"
              alt="introduce-status-2"
              width={478}
              height={264}
              className="w-full h-auto"
            />
            <h3 className="text-[16px] md:text-[24px] font-bold leading-[1.5] tracking-[-0.03em] text-[#000] !mt-8 md:!mt-[62px] !mb-4 md:!mb-5">팀별 랭킹을 공개하여 목표 달성 촉진</h3>
            <p className="text-[14px] md:text-[17px] text-[#595959] font-normal leading-[1.5] tracking-[-0.03em]">
              팀별 성과 랭킹과 금액을 투명하게 공개하고, 건강한 경쟁을 통해{" "}
              <br className="hidden md:block" />
              목표 달성을 촉진하세요.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
