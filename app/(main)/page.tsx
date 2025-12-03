/**
 * 메인 랜딩 페이지
 *
 * 섹션 구성 (참고용):
 * - Hero: 메인 타이틀 + CTA
 * - Features: 주요 기능 소개
 * - Dashboard Preview: 대시보드 미리보기
 * - Integrations: 연동 채널 소개
 * - Testimonials: 고객 후기
 * - CTA: 최종 전환 유도
 */

import Link from "next/link";
import { getStartUrl } from "@/lib/auth";
import { BRAND } from "@/lib/constants";
import Image from "next/image";
import { HeroSection } from "@/modules/landing/HeroSection";
import { FeaturesSection } from "@/modules/landing/FeaturesSection";
import { CustomerFeatureSection } from "@/modules/landing/CustomerFeatureSection";
import { IntroduceStatusSection } from "@/modules/landing/IntroduceStatusSection";
import { SecuritySection } from "@/modules/landing/SecuritySection";
import { FinalCtaSection } from "@/modules/landing/FinalCtaSection";

export default function MainPage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="text-center">
          <h5 className="text-primary-60 typo-h5">스마트한 고객 채팅</h5>
          <h2 className="typo-h2 mb-4">
            소통의 속도를 높여, 고객 만족을 극대화하세요.
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <ul>
              <li>
                <div className="flex items-center gap-4">
                  <div className="bg-primary-60 rounded-[12px] w-[32px] h-[32px] md:w-[60px] md:h-[60px] flex items-center justify-center">
                    <Image
                      src="/images/cta-1.svg"
                      alt="CTA 1"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <h3 className="typo-h3">모든 채널 상담 통합 관리</h3>
                    <p className="typo-body">
                      다양한 채널의 고객 문의를 하나의 대시보드에서 <br />
                      처리하고, 일관된 고객 경험을 유지하세요.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-4">
                  <div className="bg-primary-60 rounded-[12px] w-[32px] h-[32px] md:w-[60px] md:h-[60px] flex items-center justify-center">
                    <Image
                      src="/images/cta-2.svg"
                      alt="CTA 2"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <h3 className="typo-h3">대화 중 실시간 고객 정보 제공</h3>
                    <p className="typo-body">
                      고객 정보, 고객 연동, 상담 내역을 실시간으로 <br />
                      확인하여, 고객에게 가장 적합한 응대를 제공합니다.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-4">
                  <div className="bg-primary-60 rounded-[12px] w-[32px] h-[32px] md:w-[60px] md:h-[60px] flex items-center justify-center">
                    <Image
                      src="/images/cta-3.svg"
                      alt="CTA 3"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <h3 className="typo-h3">AI 기반 상담 효율 극대화</h3>
                    <p className="typo-body">
                      AI 상담 도우미를 활용하여 반복 업무를 줄이고, <br />
                      고객 응대 효율을 극대화하세요.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
            <div
              className="relative md:w-[706px] md:h-[479px] overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(173, 246, 210, 0.15) 0%, rgba(0, 226, 114, 0.15) 150.96%)",
              }}
            >
              <Image
                className="absolute -bottom-[72px] left-10 z-0"
                src="/images/cta-4.png"
                alt="CTA 4"
                width={606}
                height={407}
              />
              <Image
                className="absolute top-1/2 right-6 -translate-y-1/2 z-10"
                src="/images/cta-5.png"
                alt="CTA 5"
                width={262}
                height={433}
              />
            </div>
          </div>
        </div>
      </section>

      {/* customer feature section */}
      <CustomerFeatureSection />

      {/* introduce status section */}
      <IntroduceStatusSection />

      {/* security section */}
      <SecuritySection />

      {/* final cta section */}
      <FinalCtaSection />
    </>
  );
}
