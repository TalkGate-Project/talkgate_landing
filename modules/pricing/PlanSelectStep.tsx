"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { BillingCycle, PricingPlan, Project } from "@/types";
import type { SubscriptionPlan, AdminProjectSubscription } from "@/types/subscription";
import { SubscriptionService } from "@/lib/subscription";
import { showErrorModal } from "@/lib/errorModalEvents";

export type PlanSelectionContext = {
  isPlanChange: boolean;
  isUpgrade: boolean;
};

interface PlanSelectStepProps {
  selectedProject?: Project;
  isAuthenticated: boolean;
  onSubscribe: (
    plan: PricingPlan,
    billingCycle: BillingCycle,
    context?: PlanSelectionContext
  ) => void;
  onLogin: () => void;
  onBack?: () => void;
}

// API 플랜을 UI 플랜으로 변환
function convertToPricingPlan(plan: SubscriptionPlan, index: number): PricingPlan {
  return {
    id: String(plan.id),
    name: "Talkgate",
    badge: plan.name,
    description: plan.description,
    priceMonthly: plan.monthlyPrice,
    priceYearly: plan.quarterlyPrice,
    priceUnit: "/ 매월",
    features: [],
    ctaText: "구독하기",
    ctaHref: `/checkout/${plan.id}`,
    maxMembers: plan.maxMembers,
    aiTokensPerMonth: plan.aiUsageLimit,
    smsCountPerMonth: plan.smsUsageLimit,
    // 두 번째 플랜 이상을 highlighted로 표시 (Premium 등)
    highlighted: index > 0,
  };
}

export default function PlanSelectStep({
  selectedProject,
  isAuthenticated,
  onSubscribe,
  onLogin,
  onBack,
}: PlanSelectStepProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [planMeta, setPlanMeta] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<AdminProjectSubscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);
  
  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [toggleVisible, setToggleVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  // Animation observers
  useEffect(() => {
    const observerOptions = { threshold: 0.2 };

    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
          }
        });
      },
      observerOptions
    );

    const toggleObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setToggleVisible(true);
          }
        });
      },
      observerOptions
    );

    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCardsVisible(true);
          }
        });
      },
      observerOptions
    );

    if (headerRef.current) headerObserver.observe(headerRef.current);
    if (toggleRef.current) toggleObserver.observe(toggleRef.current);
    if (cardsRef.current) cardsObserver.observe(cardsRef.current);

    return () => {
      headerObserver.disconnect();
      toggleObserver.disconnect();
      cardsObserver.disconnect();
    };
  }, [plans.length]); // plans가 로드되면 카드 observer 재설정

  // 플랜 데이터 로드
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await SubscriptionService.getPlans();
        const apiPlans = response.data?.data?.plans || [];
        // sortOrder로 정렬
        const sortedPlans = [...apiPlans].sort((a, b) => a.sortOrder - b.sortOrder);
        const convertedPlans = sortedPlans.map((plan, index) =>
          convertToPricingPlan(plan, index)
        );
        setPlans(convertedPlans);
        setPlanMeta(sortedPlans);
      } catch (err) {
        console.error("플랜 조회 실패:", err);
        setError("플랜 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const normalizePlanName = (value: string) => value.trim().toLowerCase();

  const currentPlanMeta = useMemo(() => {
    if (!currentSubscription) return null;
    const target = normalizePlanName(currentSubscription.subscriptionName);
    return planMeta.find((plan) => normalizePlanName(plan.name) === target) || null;
  }, [currentSubscription, planMeta]);

  const currentPlanRank = currentPlanMeta?.sortOrder;

  const getPlanRank = (plan: PricingPlan) => {
    const target = normalizePlanName(plan.badge ?? plan.name);
    return planMeta.find((meta) => normalizePlanName(meta.name) === target)?.sortOrder;
  };

  const selectedSubscriptionBillingCycle =
    billingCycle === "yearly" ? "quarterly" : "monthly";

  const hasActiveSubscription = Boolean(
    currentSubscription?.subscriptionName && selectedProject
  );

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!isAuthenticated || !selectedProject) {
        setCurrentSubscription(null);
        return;
      }

      setLoadingSubscription(true);
      try {
        const response = await SubscriptionService.getAdminProjects();
        const projects = response.data?.data?.projects || [];
        const matched = projects.find(
          (project) => String(project.projectId) === String(selectedProject.id)
        );
        setCurrentSubscription(matched || null);
      } catch (err) {
        console.error("프로젝트 구독 정보 조회 실패:", err);
        setCurrentSubscription(null);
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchSubscriptionInfo();
  }, [isAuthenticated, selectedProject]);

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

    if (changingPlan || loadingSubscription) return;

    const nextPlanRank = getPlanRank(plan);
    const isSamePlan =
      currentPlanRank !== undefined &&
      nextPlanRank !== undefined &&
      nextPlanRank === currentPlanRank;
    const isSamePlanAndCycle =
      isSamePlan &&
      currentSubscription?.billingCycle === selectedSubscriptionBillingCycle;
    const isQuarterlyToMonthlyPlanChange =
      currentSubscription?.billingCycle === "quarterly" &&
      selectedSubscriptionBillingCycle === "monthly" &&
      !isSamePlan;
    const isUpgrade =
      currentPlanRank !== undefined &&
      nextPlanRank !== undefined &&
      nextPlanRank > currentPlanRank;
    const isUpgradeWithShorterCycle =
      isUpgrade &&
      currentSubscription?.billingCycle === "quarterly" &&
      selectedSubscriptionBillingCycle === "monthly";

    if (
      hasActiveSubscription &&
      (isSamePlanAndCycle || isUpgradeWithShorterCycle || isQuarterlyToMonthlyPlanChange)
    ) {
      return;
    }

    if (hasActiveSubscription && currentPlanRank !== undefined && nextPlanRank !== undefined) {
      if (!isUpgrade) {
        const planName = plan.badge || plan.name;
        showErrorModal({
          type: "info",
          title: "플랜 변경",
          headline: `${planName} 구독상품을 변경할까요?`,
          description:
            "현재 사용 중인 기능은 이번 결제 주기 종료 시까지 그대로 유지되며,\n변경된 상품은 다음 갱신일에 적용됩니다.",
          confirmText: "변경",
          cancelText: "취소",
          onConfirm: async () => {
            if (!selectedProject) return;
            try {
              setChangingPlan(true);
              await SubscriptionService.changePlan(selectedProject.id, {
                newPlanId: Number(plan.id),
                newBillingCycle: selectedSubscriptionBillingCycle,
              });
              showErrorModal({
                type: "success",
                title: "플랜 변경",
                headline: "구독 상품이 성공적으로 변경되었습니다.",
                description: "변경된 상품은 다음 갱신일에 자동으로 적용됩니다.",
                confirmText: "확인",
                hideCancel: true,
                onConfirm: () => {
                  window.location.href = "/pricing?step=project";
                },
              });
            } catch (err) {
              console.error("플랜 변경 실패:", err);
              showErrorModal({
                type: "error",
                title: "플랜 변경 실패",
                headline: "플랜 변경에 실패했습니다.",
                description: "잠시 후 다시 시도해주세요.",
                confirmText: "확인",
                hideCancel: true,
              });
            } finally {
              setChangingPlan(false);
            }
          },
        });
        return;
      }

      onSubscribe(plan, billingCycle, { isPlanChange: true, isUpgrade: true });
      return;
    }

    // 로그인된 경우 다음 단계로 진행 (billingCycle 정보도 함께 전달)
    onSubscribe(plan, billingCycle, { isPlanChange: false, isUpgrade: false });
  };

  return (
    <section className="py-12 md:py-20 min-h-screen bg-white">
      <div className="max-w-[1192px] mx-auto px-4">
        {/* 뒤로가기 및 선택된 프로젝트 표시 */}
        {onBack && (
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <button
              onClick={onBack}
              className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F8F8F8] transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="#252525"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {selectedProject && (
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#808080]">프로젝트:</span>
                <span className="text-[14px] md:text-[16px] font-semibold text-[#252525]">
                  {selectedProject.name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div ref={headerRef} className={`text-center mb-10.5 md:mb-12 pricing-header ${headerVisible ? 'animate' : ''}`}>
          <h1 className="text-[20px] md:text-[32px] leading-[150%] font-bold tracking-[-0.03em] text-[#252525] !mb-4">
            복잡한 고민 없이,
            <br />
            모든 기능을 지금 바로 시작하세요.
          </h1>
          <p className="text-[14px] md:text-[18px] leading-[150%] tracking-[-0.02em] text-[#595959]">
            가장 합리적인 가격으로 우리 팀의 성장을 가속화하세요.
          </p>
        </div>

        {/* Billing Toggle */}
        <div ref={toggleRef} className={`flex justify-center mb-9.5 md:mb-12 pricing-toggle ${toggleVisible ? 'animate' : ''}`}>
          <div className="w-full md:w-auto inline-flex rounded-full bg-[#F8F8F8] p-1">
            <button
              className={`w-1/2 md:w-[196px] h-9 md:h-auto px-4 md:px-8 py-0 md:py-3 rounded-full font-semibold text-[14px] md:text-[18px] transition-colors flex items-center justify-center ${
                billingCycle === "monthly"
                  ? "bg-[#252525] text-white"
                  : "text-[#808080] cursor-pointer"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              월마다
            </button>
            <button
              className={`w-1/2 md:w-[196px] h-9 md:h-auto px-4 md:px-8 py-0 md:py-3 rounded-full font-semibold text-[14px] md:text-[18px] transition-colors flex items-center justify-center ${
                billingCycle === "yearly"
                  ? "bg-[#252525] text-white"
                  : "text-[#808080] cursor-pointer"
              }`}
              onClick={() => setBillingCycle("yearly")}
            >
              3개월마다
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#E2E2E2] border-t-[#00E272] rounded-full animate-spin mb-4" />
            <div className="text-[16px] text-[#808080]">플랜 정보를 불러오는 중...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-[16px] text-red-500 mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#252525] text-white rounded-full text-[14px] font-medium hover:bg-[#3a3a3a] transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Pricing Cards */}
        {!loading && !error && plans.length > 0 && (
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-[1192px] mx-auto">
            {plans.map((plan, index) => {
              const nextPlanRank = getPlanRank(plan);
              const isSamePlan =
                currentPlanRank !== undefined &&
                nextPlanRank !== undefined &&
                nextPlanRank === currentPlanRank;
              const isSamePlanAndCycle =
                isSamePlan &&
                currentSubscription?.billingCycle === selectedSubscriptionBillingCycle;
              const isQuarterlyToMonthlyPlanChange =
                currentSubscription?.billingCycle === "quarterly" &&
                selectedSubscriptionBillingCycle === "monthly" &&
                !isSamePlan;
              const isUpgrade =
                currentPlanRank !== undefined &&
                nextPlanRank !== undefined &&
                nextPlanRank > currentPlanRank;
              const isUpgradeWithShorterCycle =
                isUpgrade &&
                currentSubscription?.billingCycle === "quarterly" &&
                selectedSubscriptionBillingCycle === "monthly";
              const isDisabled =
                loadingSubscription ||
                changingPlan ||
                isSamePlanAndCycle ||
                isUpgradeWithShorterCycle ||
                isQuarterlyToMonthlyPlanChange;
              const ctaText = hasActiveSubscription ? "플랜 변경" : plan.ctaText;
              const disabledReason = isUpgradeWithShorterCycle
                ? "업그레이드 시 현재 이용 중인 기간보다 짧게 변경할 수 없습니다."
                : isQuarterlyToMonthlyPlanChange
                ? "3개월 요금제 이용 중에는 다른 플랜의 월 요금제로 변경할 수 없습니다."
                : isSamePlanAndCycle
                ? "현재 구독 중인 상품입니다."
                : undefined;

              return (
              <PricingCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                onSubscribe={() => handleSubscribe(plan)}
                className={`${plan.highlighted ? "order-1 md:order-2" : "order-2 md:order-1"} pricing-card ${cardsVisible ? 'animate' : ''}`}
                ctaText={ctaText}
                isDisabled={isDisabled}
                disabledReason={disabledReason}
                animationDelay={index * 0.1}
              />
            );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && plans.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-[16px] text-[#808080]">이용 가능한 플랜이 없습니다.</div>
          </div>
        )}
      </div>
    </section>
  );
}

interface PricingCardProps {
  plan: PricingPlan;
  billingCycle: BillingCycle;
  onSubscribe: () => void;
  className?: string;
  ctaText?: string;
  isDisabled?: boolean;
  disabledReason?: string;
  animationDelay?: number;
}

function PricingCard({
  plan,
  billingCycle,
  onSubscribe,
  className = "",
  ctaText,
  isDisabled = false,
  disabledReason,
  animationDelay = 0,
}: PricingCardProps) {
  const price =
    billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
  const priceUnit = billingCycle === "monthly" ? "/ 매월" : "/ 3개월";
  const isHighlighted = plan.highlighted || false;

  return (
    <div
      className={`w-full md:w-[572px] min-h-[400px] md:min-h-[546px] rounded-[24px] md:rounded-[42px] bg-white shadow-[0_13px_61px_rgba(169,169,169,0.37)] px-8 md:px-20 py-9 md:py-[56px] transition-all ${
        isHighlighted ? "border-2 border-[#00E272]" : "border border-[#E2E2E2]"
      } ${className}`}
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5">
        <div className="text-[20px] md:text-[24px] font-bold text-[#474747]">
          <svg
            width="160"
            height="38"
            viewBox="0 0 160 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[120px] h-[28px] md:w-[160px] md:h-[38px]"
          >
            <path
              d="M95.8997 6.67546V28.3281C95.8997 32.5091 91.6011 38 87.2219 38H79.7485V32.9507L80.0055 32.7299C80.076 32.7249 80.1365 32.8654 80.1768 32.8654H90.3161L90.5731 32.6094V12.066L90.3161 11.8101H77.8587V23.6201H88.5976L88.8547 23.8761V28.6694L88.5976 28.9254H82.4093C71.3982 28.9254 68.4804 11.7599 78.7204 7.44841C79.2193 7.23761 80.7614 6.67044 81.2049 6.67044H95.8997V6.67546Z"
              fill="#474747"
            />
            <path
              d="M39.8712 14.7212C39.9115 13.883 39.9367 12.9394 39.2766 12.322C39.1859 12.2367 38.4652 11.8151 38.4148 11.8151H26.3001V6.68048H38.4148C41.5745 6.68048 45.2029 11.0823 45.2029 14.1239V28.6744C45.2029 29.1061 44.19 28.7597 43.9229 28.7497C39.2312 28.6242 33.6778 29.2065 29.1373 28.7547C23.5033 28.1976 21.2053 20.448 25.1763 16.5933C25.9121 15.8806 27.9631 14.7161 28.966 14.7161H39.8813L39.8712 14.7212ZM39.8712 19.8558H28.9559C27.2576 19.8558 27.5197 23.595 28.9861 23.595C29.9386 23.595 30.886 23.6151 31.7024 23.6151C33.3654 23.6151 35.0435 23.6151 36.7014 23.6151C37.7194 23.6151 38.954 23.5398 39.8712 23.5398V19.8608V19.8558Z"
              fill="#474747"
            />
            <path
              d="M112.656 6.67546C115.554 7.06695 119.273 10.6356 119.273 13.6069V28.6694C119.147 28.8451 119.121 28.8551 118.92 28.8551C113.689 28.8702 108.438 28.6343 103.202 28.7547C96.7062 27.6856 95.1944 18.0689 101.282 15.3737C101.746 15.1679 102.93 14.7161 103.373 14.7161H114.112C114.279 13.888 113.628 11.805 112.651 11.805H100.536V6.67044H112.651L112.656 6.67546ZM114.112 19.8558H103.197C102.522 19.8558 102.335 22.8221 102.98 23.4043C103.036 23.4545 103.832 23.7908 103.882 23.7908H113.85L114.107 23.5348V19.8558H114.112Z"
              fill="#474747"
            />
            <path
              d="M160 20.3678H143.244L142.987 20.1118V15.2332H154.502V11.8101H141.526C141.279 11.9607 141.289 12.1514 141.259 12.4024C140.966 14.8818 141.319 18.4304 141.445 20.96C141.49 21.8434 141.4 22.7418 141.435 23.6202L157.42 23.8761V28.6694C157.183 29.0509 156.871 28.7297 156.482 28.7497C148.49 29.1563 137.726 30.396 135.977 19.901C134.229 9.40592 143.919 4.12075 152.869 7.18746C156.15 8.31175 159.995 12.6182 159.995 16.1818V20.3778L160 20.3678Z"
              fill="#474747"
            />
            <path
              d="M59.9788 3.05176e-05V14.3799L60.4979 14.1239L67.9713 6.67551H75.2733L64.4387 17.7177L75.1877 28.5841L75.0113 28.9304L67.8856 28.6695L60.4979 21.3114L59.9788 21.0554V28.7548H54.6522V0.256007L54.9092 3.05176e-05H59.9788Z"
              fill="#474747"
            />
            <path
              d="M26.2955 0V5.04927L26.0385 5.30525H15.9849V28.6694L15.6977 28.9003L10.9052 28.8852L10.6533 28.6694V5.30525H0.257009L0 5.04927V0.255977L0.257009 0H26.2955Z"
              fill="#474747"
            />
            <path
              d="M126.488 1.88217V6.67547H135.252V11.8101H126.488V23.6201H134.995L135.252 23.8761V28.6694C134.728 29.2366 133.926 28.7698 133.281 28.7497C130.238 28.6543 128.449 28.9706 125.747 27.1837C123.631 25.7834 121.162 22.3653 121.162 19.7704V1.88217H126.488Z"
              fill="#474747"
            />
            <path
              d="M52.591 3.05176e-05V28.6694L52.334 28.8903C52.2634 28.8953 52.2029 28.7548 52.1626 28.7548H47.2643V3.05176e-05H52.591Z"
              fill="#474747"
            />
          </svg>
        </div>
        {plan.badge && (
          <span
            className={`px-2 md:px-3 py-1 rounded-[30px] text-[12px] md:text-[14px] font-medium ${
              isHighlighted
                ? "bg-[#D6FAE8] text-[#00B55B]"
                : "bg-[#E2E2E2] text-[#595959]"
            } opacity-80`}
          >
            {plan.badge}
          </span>
        )}
      </div>

      {plan.description && (
        <p className="text-[12px] md:text-[14px] font-medium tracking-[0.2px] text-[#808080] !mb-4 md:!mb-6">
          {plan.description}
        </p>
      )}

      <hr className="border-[#E2E2E2] !mb-4 md:!mb-6" />

      {/* Price */}
      <div className="mb-4 md:mb-6">
        <div className="flex items-end md:items-baseline gap-0">
          <span className={`font-bold leading-[150%] tracking-[-0.03em] text-[#252525] text-center ${
            billingCycle === "yearly" 
              ? "text-[36px] md:text-[40px]" 
              : "text-[42px] md:text-[48px]"
          }`}>
            ₩ {price?.toLocaleString()}
          </span>
          <span className="text-[14px] md:text-[18px] font-normal leading-[150%] tracking-[-0.02em] text-[#595959] ml-2">
            {priceUnit}
          </span>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-5 mb-4 md:mb-6">
        {/* 멤버 수 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 md:w-4 md:h-4"
            >
              <path
                d="M8 2.90278C8.48863 2.34917 9.20354 2 10 2C11.4728 2 12.6667 3.19391 12.6667 4.66667C12.6667 6.13943 11.4728 7.33333 10 7.33333C9.20354 7.33333 8.48863 6.98416 8 6.43055M10 14H2V13.3333C2 11.1242 3.79086 9.33333 6 9.33333C8.20914 9.33333 10 11.1242 10 13.3333V14ZM10 14H14V13.3333C14 11.1242 12.2091 9.33333 10 9.33333C9.27143 9.33333 8.58835 9.52812 8 9.86846M8.66667 4.66667C8.66667 6.13943 7.47276 7.33333 6 7.33333C4.52724 7.33333 3.33333 6.13943 3.33333 4.66667C3.33333 3.19391 4.52724 2 6 2C7.47276 2 8.66667 3.19391 8.66667 4.66667Z"
                stroke="#00E272"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-[13px] md:text-[14px] font-medium leading-[17px] text-[#000000]">
              멤버 수
            </span>
          </div>
          <span className="text-[13px] md:text-[14px] font-medium leading-[17px] text-right text-[#252525]">
            최대 {plan.maxMembers}명
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
              className="w-4 h-4 md:w-4 md:h-4"
            >
              <path
                d="M3.33333 2V4.66667M2 3.33333H4.66667M4 11.3333V14M2.66667 12.6667H5.33333M8.66667 2L10.1905 6.57143L14 8L10.1905 9.42857L8.66667 14L7.14286 9.42857L3.33333 8L7.14286 6.57143L8.66667 2Z"
                stroke="#00E272"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-[13px] md:text-[14px] font-medium leading-[17px] text-[#000000]">
              Talkgate AI 사용량
            </span>
          </div>
          <span className="text-[13px] md:text-[14px] font-medium leading-[17px] text-right text-[#252525]">
            월 {plan.aiTokensPerMonth.toLocaleString()} 사용량
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
              className="w-4 h-4 md:w-4 md:h-4"
            >
              <path
                d="M8 12H8.00667M5.33333 14H10.6667C11.403 14 12 13.403 12 12.6667V3.33333C12 2.59695 11.403 2 10.6667 2H5.33333C4.59695 2 4 2.59695 4 3.33333V12.6667C4 13.403 4.59695 14 5.33333 14Z"
                stroke="#00E272"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span className="text-[13px] md:text-[14px] font-medium leading-[17px] text-[#000000]">
              문자 전송 횟수
            </span>
          </div>
          <span className="text-[13px] md:text-[14px] font-medium leading-[17px] text-right text-[#252525]">
            월 {plan.smsCountPerMonth.toLocaleString()}건
          </span>
        </div>
      </div>

      <hr className="border-[#E2E2E2] mb-4 md:mb-5" />

      {/* 요금제 Summary */}
      <div className="flex items-center justify-between mb-8 md:mb-[42px]">
        <p className="text-[13px] md:text-[14px] font-bold leading-[17px] text-[#000000]">
          {billingCycle === "monthly" ? "월 요금제" : "3개월 요금제"}
        </p>
        <p className="text-[14px] md:text-[16px] font-bold leading-[19px] text-right text-[#252525]">
          {price?.toLocaleString()}원
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={onSubscribe}
        disabled={isDisabled}
        title={disabledReason}
        className={`cursor-pointer w-full h-[48px] md:h-[52px] rounded-[30px] font-semibold text-[16px] md:text-[18px] leading-[150%] tracking-[-0.02em] text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          isHighlighted
            ? "bg-[#00B55B] text-white hover:bg-[#00A052]"
            : "bg-[#000000] text-white hover:bg-[#252525]"
        }`}
      >
        {ctaText || plan.ctaText}
      </button>
    </div>
  );
}
