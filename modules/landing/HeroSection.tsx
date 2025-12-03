'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStartUrl } from '@/lib/auth';
import { BRAND } from '@/lib/constants';

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 스크롤에 따라 그리드를 위로 이동 (최대 200px까지)
  const gridOffset = Math.min(scrollY * 0.5, 200);

  return (
    <section className="py-4">
      <div className="relative container-hero h-[808px] flex flex-col items-center pt-[50px]">
        <h1 className="typo-hero font-en max-w-4xl leading-[1.3] text-[#ffffff] text-center z-20">
          All your business
          <br />
          workflows in one place.
        </h1>

        <p className="typo-body !mt-6 max-w-2xl text-[#ffffff] text-center z-20 whitespace-pre-line">
          {BRAND.description}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center z-20">
          <Link href={getStartUrl()} className="btn btn-dark w-[96px]">
            시작하기
          </Link>
          <Link href="/case" className="btn btn-white w-[96px]">
            상담요청
          </Link>
        </div>

        {/* Dashboard Preview with Animation */}
        <div className="absolute -bottom-[210px] left-1/2 -translate-x-1/2 mx-auto z-10">
          <div className="hero-image-wrapper flex justify-center">
            <Image
              src="/images/hero-1.png"
              alt="Talkgate 대시보드"
              width={1106}
              height={698}
              priority
              className="max-w-none"
            />
          </div>
        </div>

        {/* Dashboard Grid Preview with Parallax */}
        <div 
          className="absolute left-1/2 mx-auto z-0"
          style={{
            bottom: `${-570 + gridOffset}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <Image 
            src="/images/hero-grid.png" 
            alt="Talkgate 대시보드" 
            width={2500} 
            height={1033} 
            className="max-w-none opacity-50"
          />
        </div>
      </div>
    </section>
  );
}

