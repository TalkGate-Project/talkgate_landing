"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Project, PricingPlan, BillingCycle } from "@/types";
import { ProjectSelectStep, PlanSelectStep, CheckoutStep } from "@/modules/pricing";
import type { PlanSelectionContext } from "@/modules/pricing/PlanSelectStep";
import { getLoginUrl } from "@/lib/auth";
import { SubscriptionService } from "@/lib/subscription";
import type { SubscriptionPlan, CouponInfoForCheckout } from "@/types/subscription";

type PricingStep = "project" | "plan" | "checkout";

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
    maxMembers: plan.memberCountLimit,
    aiTokensPerMonth: plan.aiUsageLimit,
    smsCountPerMonth: plan.smsUsageLimit,
    highlighted: index > 0,
  };
}

export default function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 상태 읽기
  const stepFromUrl = searchParams.get("step") as PricingStep | null;
  const projectIdFromUrl = searchParams.get("projectId");
  const projectNameFromUrl = searchParams.get("projectName");
  const billingCycleFromUrl = searchParams.get("billingCycle"); // "monthly" | "quarterly" | null
  const planTypeFromUrl = searchParams.get("planType");

  // 인증 상태 - 헤더와 동일하게 /api/auth/check(메인 서비스 API 검증) 사용 → 비로그인 시 플랜 페이지
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // 선택된 데이터
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(() => {
    // URL에서 프로젝트 정보 복원
    if (projectIdFromUrl && projectNameFromUrl) {
      return {
        id: projectIdFromUrl,
        name: decodeURIComponent(projectNameFromUrl),
      };
    }
    return undefined;
  });
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | undefined>();
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>(() => {
    // URL에서 billingCycle 복원 (quarterly는 yearly로 매핑)
    if (billingCycleFromUrl === "monthly") {
      return "monthly";
    } else if (billingCycleFromUrl === "quarterly" || billingCycleFromUrl === "yearly") {
      return "yearly";
    }
    return "monthly";
  });
  const [planSelectionContext, setPlanSelectionContext] = useState<PlanSelectionContext | undefined>();
  const [couponInfo, setCouponInfo] = useState<CouponInfoForCheckout | undefined>();
  const [autoSelectingPlan, setAutoSelectingPlan] = useState(false);

  // 현재 스텝 결정 (URL 기반)
  // 비로그인 상태에서는 프로젝트 선택을 스킵하고 플랜 선택부터 시작
  const getDefaultStep = (): PricingStep => {
    if (!isAuthenticated) return "plan";
    return "project";
  };
  const currentStep: PricingStep = stepFromUrl || getDefaultStep();

  // URL 업데이트 함수
  const updateUrl = useCallback(
    (step: PricingStep, project?: Project) => {
      const params = new URLSearchParams();
      params.set("step", step);

      if (project) {
        params.set("projectId", project.id);
        params.set("projectName", encodeURIComponent(project.name));
      } else if (selectedProject && step !== "project") {
        params.set("projectId", selectedProject.id);
        params.set("projectName", encodeURIComponent(selectedProject.name));
      }

      router.push(`/pricing?${params.toString()}`, { scroll: false });
    },
    [router, selectedProject]
  );

  // 마운트 시 /api/auth/check로 인증 확인 (헤더·레이아웃과 동일 검증)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/check", { credentials: "include", cache: "no-store" });
        const data = res.ok ? await res.json() : { authenticated: false };
        if (!cancelled) setIsAuthenticated(data.authenticated === true);
      } catch {
        if (!cancelled) setIsAuthenticated(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // 비로그인인데 step=project면 URL을 step=plan으로 정리 (플랜 페이지가 맞음)
  useEffect(() => {
    if (isAuthenticated !== false || stepFromUrl !== "project") return;
    router.replace("/pricing?step=plan", { scroll: false });
  }, [isAuthenticated, stepFromUrl, router]);

  // URL 파라미터에서 플랜 자동 선택 (checkout 단계이고 planType이 있을 때)
  useEffect(() => {
    const shouldAutoSelect = 
      isAuthenticated === true &&
      stepFromUrl === "checkout" && 
      planTypeFromUrl && 
      billingCycleFromUrl &&
      !selectedPlan &&
      !autoSelectingPlan;

    if (!shouldAutoSelect) return;

    const autoSelectPlan = async () => {
      setAutoSelectingPlan(true);
      try {
        // 플랜 목록 로드
        const response = await SubscriptionService.getPlans();
        const apiPlans = response.data?.data?.plans || [];
        const sortedPlans = [...apiPlans].sort((a, b) => a.sortOrder - b.sortOrder);
        const convertedPlans = sortedPlans.map((plan, index) =>
          convertToPricingPlan(plan, index)
        );

        // planType에 맞는 플랜 찾기 (basic -> Basic, pro -> Pro)
        const planTypeMap: Record<string, string> = {
          basic: "Basic",
          pro: "Pro",
        };
        const targetPlanName = planTypeMap[planTypeFromUrl.toLowerCase()];
        
        if (targetPlanName) {
          const foundPlan = convertedPlans.find((plan) => {
            const badge = plan.badge?.toLowerCase() || "";
            return badge === targetPlanName.toLowerCase();
          });

          if (foundPlan) {
            // 플랜 선택 및 billingCycle 설정 (quarterly는 yearly로 매핑)
            setSelectedPlan(foundPlan);
            const billingCycle: BillingCycle = 
              billingCycleFromUrl === "quarterly" || billingCycleFromUrl === "yearly" 
                ? "yearly" 
                : "monthly";
            setSelectedBillingCycle(billingCycle);
            // 서비스 페이지에서 step=checkout&projectId&planType 링크로 오는 경우는 항상 업그레이드(플랜 변경) 진입
            setPlanSelectionContext({ isPlanChange: true, isUpgrade: true });
          }
        }
      } catch (err) {
        console.error("플랜 자동 선택 실패:", err);
      } finally {
        setAutoSelectingPlan(false);
      }
    };

    autoSelectPlan();
  }, [isAuthenticated, stepFromUrl, planTypeFromUrl, billingCycleFromUrl, selectedPlan, autoSelectingPlan]);

  // 로딩 중일 때
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[16px] text-[#808080]">불러오는 중...</div>
      </div>
    );
  }

  // 프로젝트 선택 핸들러
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    updateUrl("plan", project);
  };

  // 플랜 구독 핸들러 (쿠폰 적용 시 couponInfo 전달)
  const handleSubscribe = (
    plan: PricingPlan,
    billingCycle: BillingCycle,
    context?: PlanSelectionContext,
    coupon?: CouponInfoForCheckout
  ) => {
    setSelectedPlan(plan);
    setSelectedBillingCycle(billingCycle);
    setPlanSelectionContext(context);
    setCouponInfo(coupon);
    updateUrl("checkout");
  };

  // 로그인 페이지로 이동 (returnUrl = 현재 도메인 기준 /pricing?step=project)
  const handleLogin = () => {
    window.location.href = getLoginUrl("/pricing?step=project");
  };

  // 뒤로 가기 핸들러들
  const handleBackFromPlan = () => {
    updateUrl("project");
    setSelectedProject(undefined);
  };

  const handleBackFromCheckout = () => {
    updateUrl("plan");
    setPlanSelectionContext(undefined);
    setCouponInfo(undefined);
  };

  // 현재 단계에 따라 컴포넌트 렌더링
  switch (currentStep) {
    case "project":
      // 비로그인(액세스·리프레시 둘 다 없음) → 프로젝트 미선택 더미 플랜 선택으로
      if (!isAuthenticated) {
        return (
          <PlanSelectStep
            isAuthenticated={isAuthenticated}
            selectedProject={undefined}
            onSubscribe={handleSubscribe}
            onLogin={handleLogin}
          />
        );
      }
      return (
        <ProjectSelectStep
          onSelectProject={handleSelectProject}
        />
      );

    case "plan":
      // 로그인 상태에서 프로젝트가 선택되지 않았으면 프로젝트 선택 화면으로
      if (isAuthenticated && !selectedProject && !projectIdFromUrl) {
        return (
          <ProjectSelectStep
            onSelectProject={handleSelectProject}
          />
        );
      }

      return (
        <PlanSelectStep
          isAuthenticated={isAuthenticated}
          selectedProject={isAuthenticated ? selectedProject : undefined}
          onSubscribe={handleSubscribe}
          onLogin={handleLogin}
          onBack={isAuthenticated ? handleBackFromPlan : undefined}
        />
      );

    case "checkout":
      // 플랜 자동 선택 중이면 로딩 표시
      if (autoSelectingPlan) {
        return (
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#E2E2E2] border-t-[#00E272] rounded-full animate-spin mx-auto mb-4" />
              <div className="text-[16px] text-[#808080]">플랜 정보를 불러오는 중...</div>
            </div>
          </div>
        );
      }

      // 플랜이 선택되지 않았으면 플랜 선택 화면으로
      if (!selectedPlan) {
        // 로그인 상태이고 프로젝트가 없으면 프로젝트 선택부터
        if (isAuthenticated && !selectedProject && !projectIdFromUrl) {
          return (
            <ProjectSelectStep
              onSelectProject={handleSelectProject}
            />
          );
        }
        return (
          <PlanSelectStep
            isAuthenticated={isAuthenticated}
            selectedProject={isAuthenticated ? selectedProject : undefined}
            onSubscribe={handleSubscribe}
            onLogin={handleLogin}
            onBack={isAuthenticated ? handleBackFromPlan : undefined}
          />
        );
      }

      return (
        <CheckoutStep
          selectedPlan={selectedPlan}
          selectedProject={selectedProject}
          billingCycle={selectedBillingCycle}
          onBack={handleBackFromCheckout}
          planSelectionContext={planSelectionContext}
          couponInfo={couponInfo}
        />
      );

    default:
      // 비로그인(둘 다 토큰 없음) → 더미 플랜 선택
      if (!isAuthenticated) {
        return (
          <PlanSelectStep
            isAuthenticated={isAuthenticated}
            selectedProject={undefined}
            onSubscribe={handleSubscribe}
            onLogin={handleLogin}
          />
        );
      }
      return (
        <ProjectSelectStep
          onSelectProject={handleSelectProject}
        />
      );
  }
}
