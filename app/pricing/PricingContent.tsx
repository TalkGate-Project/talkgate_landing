"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Project, PricingPlan, BillingCycle } from "@/types";
import { ProjectSelectStep, PlanSelectStep, CheckoutStep } from "@/modules/pricing";
import type { PlanSelectionContext } from "@/modules/pricing/PlanSelectStep";
import { getLoginUrl, AUTH_COOKIE_NAME } from "@/lib/auth";
import { SubscriptionService } from "@/lib/subscription";
import type { SubscriptionPlan } from "@/types/subscription";

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

  // 인증 상태 - 초기값을 함수로 계산 (hydration 후)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
    // SSR에서는 null 반환
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    const authCookie = cookies.find((c) =>
      c.trim().startsWith(`${AUTH_COOKIE_NAME}=`)
    );

    if (authCookie) {
      const value = authCookie.split("=")[1];
      return !!value && value !== "undefined" && value !== "null";
    }
    return false;
  });

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

  // Hydration 완료 후 인증 상태 재확인 (SSR → CSR 전환 시 필요)
  useEffect(() => {
    if (isAuthenticated === null) {
      const cookies = document.cookie.split(";");
      const authCookie = cookies.find((c) =>
        c.trim().startsWith(`${AUTH_COOKIE_NAME}=`)
      );

      let authenticated = false;
      if (authCookie) {
        const value = authCookie.split("=")[1];
        authenticated = !!value && value !== "undefined" && value !== "null";
      }

      setIsAuthenticated(authenticated);
    }
  }, [isAuthenticated]);

  // URL 파라미터에서 플랜 자동 선택 (checkout 단계이고 planType이 있을 때)
  useEffect(() => {
    const shouldAutoSelect = 
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
            // planSelectionContext는 기본값으로 설정 (플랜 변경이 아닌 새 구독으로 가정)
            setPlanSelectionContext({ isPlanChange: false, isUpgrade: false });
          }
        }
      } catch (err) {
        console.error("플랜 자동 선택 실패:", err);
      } finally {
        setAutoSelectingPlan(false);
      }
    };

    autoSelectPlan();
  }, [stepFromUrl, planTypeFromUrl, billingCycleFromUrl, selectedPlan, autoSelectingPlan]);

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

  // 플랜 구독 핸들러
  const handleSubscribe = (
    plan: PricingPlan,
    billingCycle: BillingCycle,
    context?: PlanSelectionContext
  ) => {
    setSelectedPlan(plan);
    setSelectedBillingCycle(billingCycle);
    setPlanSelectionContext(context);
    updateUrl("checkout");
  };

  // 로그인 페이지로 이동
  const handleLogin = () => {
    // 로그인 후 프로젝트 선택 화면으로 이동하도록 returnUrl 설정
    const returnUrl = `${window.location.origin}/pricing?step=project`;
    const loginUrl = getLoginUrl(returnUrl);
    window.location.href = loginUrl;
  };

  // 뒤로 가기 핸들러들
  const handleBackFromPlan = () => {
    updateUrl("project");
    setSelectedProject(undefined);
  };

  const handleBackFromCheckout = () => {
    updateUrl("plan");
    setPlanSelectionContext(undefined);
  };

  // 현재 단계에 따라 컴포넌트 렌더링
  switch (currentStep) {
    case "project":
      // 비로그인 상태에서 project 단계 접근 시 plan으로 리다이렉트
      if (!isAuthenticated) {
        return (
          <PlanSelectStep
            isAuthenticated={isAuthenticated}
            selectedProject={selectedProject}
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
          selectedProject={selectedProject}
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
            selectedProject={selectedProject}
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
        />
      );

    default:
      // 비로그인 상태에서는 플랜 선택부터
      if (!isAuthenticated) {
        return (
          <PlanSelectStep
            isAuthenticated={isAuthenticated}
            selectedProject={selectedProject}
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
