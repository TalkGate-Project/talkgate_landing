import type { Metadata } from 'next';
import Link from 'next/link';
import { PAGE_METADATA } from '@/lib/constants';
import { getStartUrl } from '@/lib/auth';
import type { PricingPlan, BillingCycle } from '@/types';

export const metadata: Metadata = {
  title: PAGE_METADATA.pricing.title,
  description: PAGE_METADATA.pricing.description,
};

/**
 * 요금제 데이터
 * 실제 데이터는 API 또는 CMS에서 가져올 수 있음
 */
const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Talkgate',
    badge: 'Basic',
    priceMonthly: 199000,
    priceYearly: 1990000,
    priceUnit: '/ 매 월',
    features: [
      '(필수) 정기결제 및 원클릭 결제 동의',
      '(필수) 이용약관 및 결제 및 멤버십 유의사항',
      '(필수) 멤버십 제 3자 개인정보 제공',
    ],
    ctaText: '결제하기',
    ctaHref: '/checkout/basic',
  },
  {
    id: 'premium',
    name: 'Talkgate',
    badge: 'Premium',
    priceMonthly: 299000,
    priceYearly: 2990000,
    priceUnit: '/ 매 월',
    features: [
      '(필수) 정기결제 및 원클릭 결제 동의',
      '(필수) 이용약관 및 결제 및 멤버십 유의사항',
      '(필수) 멤버십 제 3자 개인정보 제공',
    ],
    highlighted: true,
    ctaText: '결제하기',
    ctaHref: '/checkout/premium',
  },
];

export default function PricingPage() {
  return (
    <section className="py-20">
      <div className="container-landing">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="typo-h1 mb-4">
            복잡한 고민 없이,
            <br />
            모든 기능을 지금 바로 시작하세요.
          </h1>
          <p className="typo-body text-muted-foreground">
            가장 합리적인 가격으로 우리 팀의 성장을 가속화하세요.
          </p>
        </div>

        {/* Billing Toggle */}
        <BillingToggle />

        {/* Pricing Cards */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BillingToggle() {
  // TODO: 클라이언트 컴포넌트로 분리하여 상태 관리
  return (
    <div className="flex justify-center">
      <div className="inline-flex rounded-full bg-muted p-1">
        <button className="px-6 py-2 rounded-full bg-background text-foreground font-medium text-sm">
          월마다
        </button>
        <button className="px-6 py-2 rounded-full text-muted-foreground text-sm">
          년마다
        </button>
      </div>
    </div>
  );
}

function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`card p-8 ${plan.highlighted ? 'border-primary border-2' : ''}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl font-bold">{plan.name}</span>
        {plan.badge && (
          <span
            className={`badge ${plan.highlighted ? 'badge-primary' : 'badge-secondary'}`}
          >
            {plan.badge}
          </span>
        )}
      </div>

      <hr className="border-border mb-6" />

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">
            ₩ {plan.priceMonthly.toLocaleString()}
          </span>
          <span className="text-muted-foreground">{plan.priceUnit}</span>
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <p className="typo-body-sm font-medium mb-4">매 월 구독하기</p>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 accent-primary"
            />
            <span className="typo-body-sm">모두 동의합니다.</span>
          </label>
          {plan.features.map((feature, index) => (
            <label key={index} className="flex items-center gap-2 pl-4">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-primary"
              />
              <span className="typo-caption text-muted-foreground">
                {feature}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href={plan.ctaHref}
        className={`btn w-full ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
      >
        {plan.ctaText}
      </Link>
    </div>
  );
}

