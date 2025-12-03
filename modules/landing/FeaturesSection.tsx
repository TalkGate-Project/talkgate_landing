'use client';

import { useEffect, useRef, useState } from 'react';
import Image from "next/image";

export function FeaturesSection() {
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
      { threshold: 0.2 }  // 20% 보이면 트리거
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  const features = [
    {
      content: (
        <>
          <Image
            src="/images/features-section-4.png"
            alt="놓치지 않는 신규 고객 관리"
            width={208}
            height={80}
            className="absolute z-10 top-1 -right-2 feature-floating-badge"
          />
          <Image
            src="/images/features-section-1.png"
            alt="놓치지 않는 신규 고객 관리"
            width={470}
            height={227}
            className="z-0 feature-slide-up-left"
          />
        </>
      ),
      title: "놓치지 않는 신규 고객 관리",
      description: "모든 채널의 고객 문의를 한 곳에서 관리하세요.",
    },
    {
      content: (
        <>
          <Image
            src="/images/features-section-2.png"
            alt="한눈에 보는 판매 성과 분석"
            width={322}
            height={414}
            className="z-0 feature-slide-up-center"
          />
        </>
      ),
      title: "한눈에 보는 판매 성과 분석",
      description: "팀원 모두가 같은 고객 정보를 공유합니다.",
    },
    {
      content: (
        <>
          <Image
            src="/images/features-section-5.png"
            alt="놓치지 않는 신규 고객 관리"
            width={208}
            height={80}
            className="absolute z-10 top-1 left-1 feature-floating-badge-delayed"
          />
          <Image
            src="/images/features-section-3.png"
            alt="완벽한 팀 일정 및 계획 관리"
            width={588}
            height={302}
            className="z-0 feature-slide-up-right"
          />
        </>
      ),
      title: "완벽한 팀 일정 및 계획 관리",
      description: "모바일에서도 실시간으로 확인하세요.",
    },
  ];

  return (
    <section className="py-20" ref={sectionRef}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-center items-center gap-[200px] mb-[52px]">
          <div className="text-left">
            <h5 className="text-primary-60 font-semibold text-[18px] leading-[1.5] tracking-[-0.02em] !mb-3 leading-[1]">
              통합된 관리 플랫폼
            </h5>
            <h2 className="text-[32px] leading-[1.5] tracking-[-0.03em] font-bold">
              하나로 연결하여,
              <br />
              스마트하게 관리합니다.
            </h2>
          </div>

          <p className="text-[#595959] leading-[1.5]">
            우리의 플랫폼은 고객 관리, 성과 분석, 일정 계획을 한 곳에 모아
            비즈니스의 모든
            <br />
            핵심 영역을 지능적으로 관리하도록 돕습니다.
            <br />
            성공을 위한 필수 요소를 지금 바로 경험해 보세요.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center p-6">
              <div className={`relative w-[300px] h-[300px] rounded-[12px] bg-[#ededed] flex items-center justify-center mb-[30px] overflow-hidden ${isVisible ? 'animate' : ''}`}>
                {feature.content}
              </div>
              <h3 className="mb-2 text-center font-bold">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
