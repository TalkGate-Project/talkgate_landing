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

import { BRAND } from "@/lib/constants";
import { HeroSection } from "@/modules/landing/HeroSection";
import { FeaturesSection } from "@/modules/landing/FeaturesSection";
import { CtaSection } from "@/modules/landing/CtaSection";
import { CustomerFeatureSection } from "@/modules/landing/CustomerFeatureSection";
import { IntroduceStatusSection } from "@/modules/landing/IntroduceStatusSection";
import { SecuritySection } from "@/modules/landing/SecuritySection";
import { FinalCtaSection } from "@/modules/landing/FinalCtaSection";

export default function MainPage() {
  // WebSite 구조화 데이터는 대표 페이지(홈)에만 노출합니다.
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND.nameKo,
    alternateName: [BRAND.name, "토크게이트", `${BRAND.nameKo} ${BRAND.name}`],
    url: "https://talkgate.im",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CtaSection />

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
