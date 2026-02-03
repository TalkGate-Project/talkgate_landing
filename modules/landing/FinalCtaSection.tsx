'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getStartUrl } from '@/lib/auth';
import { useLandingBaseUrl } from '@/components/common';

export function FinalCtaSection() {
  const landingBaseUrl = useLandingBaseUrl();
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
    <section className="flex justify-center md:mt-6 px-4 md:px-6 mb-20 md:!mb-[136px]" ref={sectionRef}>
      <div className="w-full max-w-[327px] md:max-w-[1170px]">
        <div
          className="final-cta-container rounded-xl md:rounded-3xl px-5 md:px-[82px] py-4 md:py-16 h-[142px] md:h-[224px] flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8"
        >
          {/* Text Area */}
          <div className="md:flex-1">
            <h2 className="font-bold text-[16px] md:typo-h3 leading-[1.5] tracking-[-0.03em] text-neutral-90">
              신속한 소통으로 고객의 신뢰를 확보하고,
              <br />
              비즈니스를 성장시키세요.
            </h2>
          </div>

          {/* Button Area */}
          <div className={`flex gap-2.5 md:gap-4 flex-shrink-0 final-cta-buttons ${isVisible ? 'animate' : ''}`}>
            <Link
              href={getStartUrl()}
              className="w-[137px] md:w-auto px-3 md:px-6 py-1.5 md:py-2 h-[34px] md:h-auto bg-neutral-90 leading-[17px] md:leading-[1] text-[14px] text-neutral-0 rounded-[5px] font-semibold transition-colors flex items-center justify-center"
            >
              시작하기
            </Link>
            <Link
              href="https://talkgate.channel.io/home"
              className="w-[137px] md:w-auto px-3 md:px-6 py-1.5 md:py-2 h-[34px] md:h-auto bg-neutral-0 text-neutral-90 leading-[17px] md:leading-[1] text-[14px] rounded-[5px] font-semibold hover:bg-neutral-10 transition-colors flex items-center justify-center"
            >
              상담요청
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}