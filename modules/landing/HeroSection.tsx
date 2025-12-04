'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStartUrl } from '@/lib/auth';
import { BRAND } from '@/lib/constants';

const HERO_IMAGES = [
  '/images/hero-1.png',
  '/images/hero-2.png',
  '/images/hero-3.png',
];

type AnimationPhase = 'display' | 'fade-out' | 'fade-in';

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('display');

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 이미지 페이드 애니메이션 (멀어지고 가까워지는 효과)
  useEffect(() => {
    let isMounted = true;

    const runAnimation = async () => {
      while (isMounted) {
        // 1. 현재 이미지 표시 (5초)
        await new Promise((resolve) => setTimeout(resolve, 5000));
        if (!isMounted) break;
        
        // 2. 페이드 아웃 시작 (이미지가 작아지면서 멀어지는 효과)
        setAnimationPhase('fade-out');
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (!isMounted) break;
        
        // 3. 인덱스 변경 및 페이드 인 시작 (다음 이미지가 가까워지는 효과)
        setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
        setAnimationPhase('fade-in');
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (!isMounted) break;
        
        // 4. 표시 상태로 복귀
        setAnimationPhase('display');
      }
    };

    runAnimation();

    return () => {
      isMounted = false;
    };
  }, [currentIndex]);

  // 스크롤에 따라 그리드를 위로 이동 (최대 200px까지)
  const gridOffset = Math.min(scrollY * 0.5, 200);

  return (
    <section className="py-4">
      <div className="relative container-hero h-[808px] flex flex-col items-center pt-[50px]">
        <h1 className="text-[38px] font-bold font-en leading-[1.3] text-[#ffffff] text-center z-20 tracking-[-0.03em]">
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

        {/* Dashboard Preview with Fade Animation */}
        <div 
          className="absolute bottom-0 mx-auto z-10"
          style={{ 
            left: '50%',
            boxShadow: "10px 10px 200px 20px #F4F4F4A3",
            opacity: animationPhase === 'fade-out' ? 0 : 1,
            transform: `translateX(-50%) scale(${
              animationPhase === 'fade-out' ? 0.95 : 1
            })`,
            transition: 'all 0.8s ease-in-out',
          }}
        >
          <div className="hero-image-wrapper flex justify-center">
            <Image
              key={currentIndex}
              src={HERO_IMAGES[currentIndex]}
              alt="Talkgate 대시보드"
              width={776}
              height={490}
              priority={currentIndex === 0}
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

