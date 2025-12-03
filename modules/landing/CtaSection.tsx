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
    <section className="pt-[54px] pb-[58px]" ref={sectionRef}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <h5 className="text-primary-60 font-semibold text-[18px] leading-[1.5] tracking-[-0.02em] !mb-3">스마트한 고객 채팅</h5>
          <h2 className="text-[32px] leading-[1.5] tracking-[-0.03em] font-bold">소통의 속도를 높여, 고객 만족을 극대화하세요.</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          {/* Left: Feature List */}
          <ul className="flex flex-col gap-[66px]">
            {features.map((feature, index) => (
              <li 
                key={index} 
                className={`flex items-start gap-8 cta-feature-item ${isVisible ? 'animate' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="bg-primary-60 rounded-[12px] w-[60px] h-[60px] flex items-center justify-center flex-shrink-0">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h3 className="typo-h3 !mb-2">{feature.title}</h3>
                  <p className="typo-body-1 text-muted-foreground whitespace-pre-line">
                    {feature.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* Right: Visual */}
          <div
            className={`relative w-full lg:w-[706px] h-[479px] rounded-2xl overflow-hidden flex-shrink-0 cta-chat-container ${isVisible ? 'animate' : ''}`}
            style={{
              background:
                'linear-gradient(180deg, rgba(173, 246, 210, 0.15) 0%, rgba(0, 226, 114, 0.15) 150.96%)',
            }}
          >
            <Image
              className={`absolute -bottom-[72px] left-10 z-0 cta-chat-bg ${isVisible ? 'animate' : ''}`}
              src="/images/cta-4.png"
              alt="채팅 인터페이스"
              width={606}
              height={407}
            />
            <Image
              className={`absolute top-1/2 right-3 -translate-y-1/2 z-10 cta-chat-panel ${isVisible ? 'animate' : ''}`}
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

