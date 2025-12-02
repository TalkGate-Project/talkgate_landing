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

import Link from 'next/link';
import { getStartUrl } from '@/lib/auth';
import { BRAND } from '@/lib/constants';

export default function MainPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20">
        <div className="container-hero text-center">
          <h1 className="typo-hero max-w-4xl mx-auto">
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
            <span className="badge badge-primary mb-4">
              통합의 시작, 성과의 출발
            </span>
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
                title: '놓치지 않는 신규 고객 관리',
                description: '모든 채널의 고객 문의를 한 곳에서 관리하세요.',
              },
              {
                title: '협업에 보는 전체 정보의 공유',
                description: '팀원 모두가 같은 고객 정보를 공유합니다.',
              },
              {
                title: '언제 어디서든 바로 확인 가능',
                description: '모바일에서도 실시간으로 확인하세요.',
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
          <h2 className="typo-h2 mb-4">
            신속한 소통으로 고객에 신뢰를 확보하고,
            <br />
            비즈니스를 성장시키세요.
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={getStartUrl()} className="btn btn-primary">
              시작하기
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              요금제 보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

