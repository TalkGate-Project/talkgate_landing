'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export function CtaSection() {
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
  const features = [
    {
      icon: '/images/cta-1.svg',
      title: '모든 채널 상담 통합 관리',
      description:
        '다양한 채널의 고객 문의를 하나의 대시보드에서\n처리하고, 일관된 고객 경험을 유지하세요.',
    },
    {
      icon: '/images/cta-2.svg',
      title: '대화 중 실시간 고객 정보 제공',
      description:
        '고객 정보, 고객 연동, 상담 내역을 실시간으로\n확인하여, 고객에게 가장 적합한 응대를 제공합니다.',
    },
    {
      icon: '/images/cta-3.svg',
      title: 'AI 기반 상담 효율 극대화',
      description:
        'AI 상담 도우미를 활용하여 반복 업무를 줄이고,\n고객 응대 효율을 극대화하세요.',
    },
  ];

  return (
    <section className="pt-8 pb-10 md:pt-[54px] md:pb-[58px] px-4" ref={sectionRef}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h5 className="text-primary-60 font-semibold text-[14px] md:text-[18px] leading-[1.5] tracking-[-0.02em] !mb-3">스마트한 고객 채팅</h5>
          <h2 className="text-[20px] md:text-[32px] leading-[1.5] tracking-[-0.03em] font-bold">소통의 속도를 높여, <br className="lg:hidden" />고객 만족을 극대화하세요.</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-center justify-between">
          {/* Left: Feature List - 모바일에서는 아래, PC에서는 왼쪽 */}
          <ul className="flex flex-col gap-8 md:gap-[66px] order-2 lg:order-1 w-full lg:w-auto">
            {features.map((feature, index) => (
              <li 
                key={index} 
                className={`flex items-start gap-3 md:gap-8 cta-feature-item ${isVisible ? 'animate' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="bg-primary-60 rounded-[8px] lg:rounded-[12px] w-[32px] h-[32px] md:w-[60px] md:h-[60px] flex items-center justify-center flex-shrink-0">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={24}
                    height={24}
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold lg:typo-h3 mb-1 lg:!mb-2 text-[16px] md:text-[18px]">{feature.title}</h3>
                  <p className="typo-body-1 text-muted-foreground whitespace-pre-line text-[14px] md:text-base">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Right: Visual - 모바일에서는 위, PC에서는 오른쪽 */}
          <div
            className={`relative w-full lg:w-[706px] aspect-[706/479] lg:h-[479px] rounded-2xl overflow-hidden flex-shrink-0 cta-chat-container order-1 lg:order-2 ${isVisible ? 'animate' : ''}`}
            style={{
              background:
                'linear-gradient(180deg, rgba(173, 246, 210, 0.15) 0%, rgba(0, 226, 114, 0.15) 150.96%)',
            }}
          >
            <Image
              className={`absolute -bottom-[20px] md:-bottom-[72px] left-1/2 -translate-x-1/2 md:translate-x-0 md:left-10 z-0 cta-chat-bg ${isVisible ? 'animate' : ''}`}
              src="/images/cta-4.png"
              alt="채팅 인터페이스"
              width={606}
              height={407}
              style={{ width: 'auto', height: 'auto', maxWidth: '85%' }}
            />
            <Image
              className={`absolute top-1/2 right-1 md:right-3 -translate-y-1/2 z-10 cta-chat-panel hidden md:block ${isVisible ? 'animate' : ''}`}
              src="/images/cta-5.png"
              alt="고객 정보 패널"
              width={262}
              height={433}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

