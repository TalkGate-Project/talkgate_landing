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
import { CustomerFeatureSection } from "@/modules/landing/CustomerFeatureSection";
import { IntroduceStatusSection } from "@/modules/landing/IntroduceStatusSection";
import { SecuritySection } from "@/modules/landing/SecuritySection";
import { FinalCtaSection } from "@/modules/landing/FinalCtaSection";

export default function MainPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20">
        <div className="container-hero text-center">
          <h1 className="typo-hero font-en max-w-4xl mx-auto">
            All your business
            <br />
            workflows in one place.
          </h1>

          <p className="typo-body text-muted-foreground mt-6 max-w-2xl mx-auto">
            {BRAND.description}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={getStartUrl()} className="btn btn-primary">
              시작하기
            </Link>
            <Link href="/case" className="btn btn-secondary">
              사례 보기
            </Link>
          </div>

          {/* Dashboard Preview Placeholder */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="aspect-[16/10] rounded-xl border border-border bg-card shadow-xl flex items-center justify-center">
              <span className="text-muted-foreground">
                [대시보드 미리보기 이미지]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Placeholder */}
      <section className="py-20">
        <div className="container-landing">
          <div className="text-center mb-16">
            <h5 className="text-primary-60 typo-h5 mb-4">통합된 관리 플랫폼</h5>
            <h2 className="typo-h1">
              하나로 연결하여,
              <br />
              스마트하게 관리합니다.
            </h2>
          </div>

          {/* Feature Cards Placeholder */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "놓치지 않는 신규 고객 관리",
                description: "모든 채널의 고객 문의를 한 곳에서 관리하세요.",
              },
              {
                title: "협업에 보는 전체 정보의 공유",
                description: "팀원 모두가 같은 고객 정보를 공유합니다.",
              },
              {
                title: "언제 어디서든 바로 확인 가능",
                description: "모바일에서도 실시간으로 확인하세요.",
              },
            ].map((feature, index) => (
              <div key={index} className="card p-6">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">[Icon]</span>
                </div>
                <h3 className="typo-h4 mb-2">{feature.title}</h3>
                <p className="typo-body-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container-landing text-center">
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
