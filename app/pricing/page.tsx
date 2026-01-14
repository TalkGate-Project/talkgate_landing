"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Project, PricingPlan, BillingCycle } from "@/types";
import { ProjectSelectStep, PlanSelectStep, CheckoutStep } from "@/modules/pricing";
import { getLoginUrl, AUTH_COOKIE_NAME } from "@/lib/auth";

type PricingStep = "project" | "plan" | "checkout";

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 상태 읽기
  const stepFromUrl = searchParams.get("step") as PricingStep | null;
  const projectIdFromUrl = searchParams.get("projectId");
  const projectNameFromUrl = searchParams.get("projectName");

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
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>("monthly");

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

      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR hydration 패턴
      setIsAuthenticated(authenticated);
    }
  }, [isAuthenticated]);

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
  const handleSubscribe = (plan: PricingPlan, billingCycle: BillingCycle) => {
    setSelectedPlan(plan);
    setSelectedBillingCycle(billingCycle);
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

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-[16px] text-[#808080]">불러오는 중...</div>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
