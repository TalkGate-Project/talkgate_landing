"use client";

import { useState } from "react";
import type { BillingCycle, PricingPlan, Project } from "@/types";

interface PlanSelectStepProps {
  selectedProject?: Project;
  isAuthenticated: boolean;
  onSubscribe: (plan: PricingPlan) => void;
  onLogin: () => void;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "basic",
    name: "Talkgate",
    badge: "Basic",
    description: "개인 및 소규모 팀을 위한 기본 플랜",
    priceMonthly: 199000,
    priceYearly: 1990000,
    priceUnit: "/ 매월",
    features: [
      "(필수) 정기결제 및 원클릭 결제 동의",
      "(필수) 이용약관 및 결제 및 멤버십 유의사항",
      "(필수) 멤버십 제 3자 개인정보 제공",
    ],
    ctaText: "구독하기",
    ctaHref: "/checkout/basic",
  },
  {
    id: "premium",
    name: "Talkgate",
    badge: "Premium",
    description: "성장하는 팀을 위한 프로페셔널 플랜",
    priceMonthly: 299000,
    priceYearly: 2990000,
    priceUnit: "/ 매월",
    features: [
      "(필수) 정기결제 및 원클릭 결제 동의",
      "(필수) 이용약관 및 결제 및 멤버십 유의사항",
      "(필수) 멤버십 제 3자 개인정보 제공",
    ],
    highlighted: true,
    ctaText: "구독하기",
    ctaHref: "/checkout/premium",
  },
];

export default function PlanSelectStep({
  selectedProject,
  isAuthenticated,
  onSubscribe,
  onLogin,
}: PlanSelectStepProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("premium"); // 초기 선택: Premium
  const [agreedPlans, setAgreedPlans] = useState<Record<string, boolean>>({
    premium: true, // Premium 초기 동의 상태
  });

  const handleSubscribe = (plan: PricingPlan) => {
    // 로그인 상태 확인
    if (!isAuthenticated) {
      // 사용자에게 로그인이 필요하다고 안내
      const confirmed = window.confirm(
        "구독하려면 로그인이 필요합니다.\n\n로그인 페이지로 이동하시겠습니까?\n(로그인 후 이 페이지로 다시 돌아옵니다)"
      );
      
      if (confirmed) {
        // 로그인 페이지로 이동 (현재 페이지를 returnUrl로 전달)
        onLogin();
      }
      return;
    }

    // 로그인된 경우 다음 단계로 진행
    onSubscribe(plan);
  };

  const toggleAgreement = (planId: string) => {
    setAgreedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  return (
    <section className="py-20 min-h-screen bg-white">
      <div className="max-w-[1192px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[32px] leading-[150%] font-bold tracking-[-0.03em] text-[#252525] mb-4">
            복잡한 고민 없이,
            <br />
            모든 기능을 지금 바로 시작하세요.
          </h1>
          <p className="text-[18px] leading-[150%] tracking-[-0.02em] text-[#595959]">
            가장 합리적인 가격으로 우리 팀의 성장을 가속화하세요.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full bg-[#F8F8F8] p-1">
            <button
              className={`w-[196px] px-8 py-3 rounded-full font-semibold text-[18px] transition-colors ${
                billingCycle === "monthly"
                  ? "bg-[#252525] text-white"
                  : "text-[#808080] cursor-pointer"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              월마다
            </button>
            <button
              className={`w-[196px] px-8 py-3 rounded-full font-semibold text-[18px] transition-colors ${
                billingCycle === "yearly"
                  ? "bg-[#252525] text-white"
                  : "text-[#808080] cursor-pointer"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              년마다
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-12 max-w-[1192px] mx-auto">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              isSelected={selectedPlanId === plan.id}
              agreed={agreedPlans[plan.id] || false}
              onSelectPlan={() => handleSelectPlan(plan.id)}
              onToggleAgreement={() => toggleAgreement(plan.id)}
              onSubscribe={() => handleSubscribe(plan)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: BillingCycle;
  isSelected: boolean;
  agreed: boolean;
  onSelectPlan: () => void;
  onToggleAgreement: () => void;
  onSubscribe: () => void;
}

function PricingCard({
  plan,
  billingCycle,
  isSelected,
  agreed,
  onSelectPlan,
  onToggleAgreement,
  onSubscribe,
}: PricingCardProps) {
  const price =
    billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;

  return (
    <div
      className={`w-[572px] h-[646px] rounded-[42px] bg-white shadow-[0_13px_61px_rgba(169,169,169,0.37)] px-20 py-[56px] cursor-pointer transition-all ${
        isSelected ? "border-2 border-[#00E272]" : "border border-[#E2E2E2]"
      }`}
      onClick={onSelectPlan}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="text-[24px] font-bold text-[#474747]">
          <svg
            width="208"
            height="49"
            viewBox="0 0 208 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M124.669 8.60782V36.5283C124.669 41.9195 119.081 49 113.388 49H103.673V42.4891L104.007 42.2043C104.099 42.1979 104.177 42.3791 104.23 42.3791H117.411L117.745 42.049V15.5588L117.411 15.2287H101.216V30.4575H115.177L115.511 30.7876V36.9684L115.177 37.2985H107.132C92.8175 37.2985 89.0244 15.164 102.336 9.60452C102.985 9.33269 104.99 8.60135 105.566 8.60135H124.669V8.60782Z"
              fill="#474747"
            />
            <path
              d="M51.8325 18.9826C51.8849 17.9017 51.9176 16.685 51.0594 15.8889C50.9415 15.7789 50.0047 15.2352 49.9392 15.2352H34.1901V8.6143H49.9392C54.0468 8.6143 58.7636 14.2903 58.7636 18.2124V36.9749C58.7636 37.5315 57.4469 37.0849 57.0996 37.072C51.0005 36.9102 43.7811 37.6609 37.8784 37.0785C30.5542 36.3601 27.5669 26.3672 32.7292 21.3966C33.6857 20.4776 36.352 18.9761 37.6557 18.9761H51.8456L51.8325 18.9826ZM51.8325 25.6035H37.6426C35.4348 25.6035 35.7755 30.4252 37.6819 30.4252C38.9201 30.4252 40.1517 30.4511 41.213 30.4511C43.3749 30.4511 45.5564 30.4511 47.7118 30.4511C49.0351 30.4511 50.6402 30.354 51.8325 30.354V25.61V25.6035Z"
              fill="#474747"
            />
            <path
              d="M146.452 8.60782C150.219 9.11264 155.054 13.7143 155.054 17.5457V36.9684C154.89 37.1949 154.858 37.2079 154.596 37.2079C147.795 37.2273 140.969 36.9231 134.162 37.0784C125.718 35.6999 123.753 23.2994 131.666 19.8239C132.269 19.5586 133.809 18.9761 134.385 18.9761H148.346C148.562 17.9082 147.717 15.2223 146.446 15.2223H130.697V8.60135H146.446L146.452 8.60782ZM148.346 25.6035H134.156C133.278 25.6035 133.036 29.4285 133.874 30.1792C133.946 30.2439 134.981 30.6776 135.047 30.6776H148.005L148.339 30.3475V25.6035H148.346Z"
              fill="#474747"
            />
            <path
              d="M208 26.2637H186.217L185.883 25.9336V19.6428H200.852V15.2288H183.983C183.662 15.423 183.675 15.6689 183.636 15.9925C183.256 19.1897 183.714 23.7655 183.878 27.0274C183.937 28.1665 183.819 29.325 183.865 30.4576L204.645 30.7877V36.9685C204.338 37.4604 203.931 37.0462 203.427 37.0721C193.037 37.5963 179.043 39.1949 176.77 25.6618C174.497 12.1287 187.095 5.31361 198.73 9.26805C202.995 10.7178 207.993 16.2708 207.993 20.866V26.2766L208 26.2637Z"
              fill="#474747"
            />
            <path
              d="M77.9725 2.28882e-05V18.5425L78.6472 18.2124L88.3627 8.60787H97.8553L83.7703 22.8464L97.744 36.8584L97.5147 37.305L88.2513 36.9685L78.6472 27.4804L77.9725 27.1503V37.0785H71.0479V0.330098L71.382 2.28882e-05H77.9725Z"
              fill="#474747"
            />
            <path
              d="M34.1841 0V6.5109L33.85 6.84098H20.7804V36.9685L20.407 37.2662L14.1768 37.2467L13.8492 36.9685V6.84098H0.334111L0 6.5109V0.330075L0.334111 0H34.1841Z"
              fill="#474747"
            />
            <path
              d="M164.434 2.42704V8.60786H175.827V15.2288H164.434V30.4576H175.493L175.827 30.7876V36.9685C175.146 37.6998 174.104 37.0979 173.265 37.072C169.308 36.949 166.983 37.3568 163.471 35.0527C160.72 33.247 157.51 28.8395 157.51 25.4935V2.42704H164.434Z"
              fill="#474747"
            />
            <path
              d="M68.368 2.28882e-05V36.9685L68.0339 37.2532C67.9421 37.2597 67.8635 37.0785 67.8111 37.0785H61.4434V2.28882e-05H68.368Z"
              fill="#474747"
            />
          </svg>
        </div>
        {plan.badge && (
          <span
            className={`px-3 py-1 rounded-[30px] text-[14px] font-medium ${
              isSelected
                ? "bg-[#D6FAE8] text-[#00B55B]"
                : "bg-[#E2E2E2] text-[#595959]"
            } opacity-80`}
          >
            {plan.badge}
          </span>
        )}
      </div>

      {plan.description && (
        <p className="text-[14px] font-medium tracking-[0.2px] text-[#808080] !mb-6">
          {plan.description}
        </p>
      )}

      <hr className="border-[#E2E2E2] !mb-6" />

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-0">
          <span className="text-[60px] font-bold leading-[150%] tracking-[-0.03em] text-[#252525] text-center">
            ₩ {price?.toLocaleString()}
          </span>
          <span className="text-[18px] font-normal leading-[150%] tracking-[-0.02em] text-[#595959] ml-2">
            {plan.priceUnit}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-5 mb-6">
        {/* 멤버 수 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2.90278C8.48863 2.34917 9.20354 2 10 2C11.4728 2 12.6667 3.19391 12.6667 4.66667C12.6667 6.13943 11.4728 7.33333 10 7.33333C9.20354 7.33333 8.48863 6.98416 8 6.43055M10 14H2V13.3333C2 11.1242 3.79086 9.33333 6 9.33333C8.20914 9.33333 10 11.1242 10 13.3333V14ZM10 14H14V13.3333C14 11.1242 12.2091 9.33333 10 9.33333C9.27143 9.33333 8.58835 9.52812 8 9.86846M8.66667 4.66667C8.66667 6.13943 7.47276 7.33333 6 7.33333C4.52724 7.33333 3.33333 6.13943 3.33333 4.66667C3.33333 3.19391 4.52724 2 6 2C7.47276 2 8.66667 3.19391 8.66667 4.66667Z"
                stroke="#00E272"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-[14px] font-medium leading-[17px] text-[#000000]">
              멤버 수
            </span>
          </div>
          <span className="text-[14px] font-medium leading-[17px] text-right text-[#252525]">
            최대 명
          </span>
        </div>

        {/* AI 상담 도우미 토큰 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33333 2V4.66667M2 3.33333H4.66667M4 11.3333V14M2.66667 12.6667H5.33333M8.66667 2L10.1905 6.57143L14 8L10.1905 9.42857L8.66667 14L7.14286 9.42857L3.33333 8L7.14286 6.57143L8.66667 2Z"
                stroke="#00E272"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-[14px] font-medium leading-[17px] text-[#000000]">
              AI 상담 도우미 토큰
            </span>
          </div>
          <span className="text-[14px] font-medium leading-[17px] text-right text-[#252525]">
            월 N회 / 월 N회
          </span>
        </div>

        {/* 문자 전송 횟수 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 12H8.00667M5.33333 14H10.6667C11.403 14 12 13.403 12 12.6667V3.33333C12 2.59695 11.403 2 10.6667 2H5.33333C4.59695 2 4 2.59695 4 3.33333V12.6667C4 13.403 4.59695 14 5.33333 14Z"
                stroke="#00E272"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-[14px] font-medium leading-[17px] text-[#000000]">
              문자 전송 횟수
            </span>
          </div>
          <span className="text-[14px] font-medium leading-[17px] text-right text-[#252525]">
            월 N회 / 월 N회
          </span>
        </div>
      </div>

      <hr className="border-[#E2E2E2] mb-5" />

      {/* 월 요금제 Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] font-bold leading-[17px] text-[#000000]">
          월 요금제
        </p>
        <p className="text-[16px] font-bold leading-[19px] text-right text-[#252525]">
          {price?.toLocaleString()}원
        </p>
      </div>

      {/* Agreement */}
      <div className="mb-6">
        <label
          className="flex items-center gap-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="relative">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                e.stopPropagation();
                onToggleAgreement();
              }}
              className="w-5 h-5 appearance-none rounded-[5px] border-2 border-[#E2E2E2] checked:bg-[#00E272] checked:border-[#00E272] cursor-pointer transition-colors"
            />
            {agreed && (
              <svg
                className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 10L8.5 13.5L15 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-[14px] font-medium leading-[17px] text-[#252525] opacity-80">
            모두 동의합니다.
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-auto"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#959595"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </label>
      </div>

      {/* CTA Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSubscribe();
        }}
        disabled={!agreed}
        className={`w-full h-[52px] rounded-[30px] font-semibold text-[18px] leading-[150%] tracking-[-0.02em] text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isSelected
            ? "bg-[#00B55B] text-white hover:bg-[#00A052]"
            : "bg-[#000000] text-white hover:bg-[#252525]"
        }`}
      >
        {plan.ctaText}
      </button>
    </div>
  );
}
