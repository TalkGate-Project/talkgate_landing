"use client";

import { useState, useEffect } from "react";
import type { Project, PricingPlan } from "@/types";
import { ProjectSelectStep, PlanSelectStep, CheckoutStep } from "@/modules/pricing";
import { getLoginUrl, AUTH_COOKIE_NAME } from "@/lib/auth";

type PricingStep = "project-select" | "plan-select" | "checkout";

export default function PricingPage() {
  // Hydration 오류 방지: 초기값은 null로 설정
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState<PricingStep>("plan-select");
  const [selectedProject, setSelectedProject] = useState<Project | undefined>();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | undefined>();

  // 클라이언트에서만 인증 상태 확인 (Hydration 이후)
  // Note: Hydration 오류 방지를 위해 useEffect에서 상태 설정이 필요합니다.
  // 브라우저 환경에서만 사용 가능한 document.cookie에 접근하므로,
  // 서버-클라이언트 불일치를 피하기 위해 useEffect 사용이 적절합니다.
  useEffect(() => {
    const initializeAuth = () => {
      const cookies = document.cookie.split(";");
      const authCookie = cookies.find((c) =>
        c.trim().startsWith(`${AUTH_COOKIE_NAME}=`)
      );
      
      // 쿠키가 있고 값이 유효한 경우에만 인증됨으로 간주
      let authenticated = false;
      if (authCookie) {
        const value = authCookie.split('=')[1];
        authenticated = !!value && value !== 'undefined' && value !== 'null';
      }
      
      // 한 번의 렌더링으로 모든 상태 업데이트
      setIsAuthenticated(authenticated);
      // 로그인된 경우에만 project-select 단계로 시작
      setCurrentStep(authenticated ? "plan-select" : "plan-select");
    };

    initializeAuth();
  }, []);

  // 로딩 중일 때 (Hydration 완료 전)
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
    setCurrentStep("plan-select");
  };

  // 플랜 구독 핸들러
  const handleSubscribe = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setCurrentStep("checkout");
  };

  // 로그인 페이지로 이동
  const handleLogin = () => {
    const loginUrl = getLoginUrl("/pricing");
    window.location.href = loginUrl;
  };

  // 결제 화면에서 뒤로 가기
  const handleBackFromCheckout = () => {
    setCurrentStep("plan-select");
  };

  // 현재 단계에 따라 컴포넌트 렌더링
  let content;
  switch (currentStep) {
    case "project-select":
      content = <ProjectSelectStep onSelectProject={handleSelectProject} />;
      break;

    case "plan-select":
      content = (
        <PlanSelectStep
          selectedProject={selectedProject}
          isAuthenticated={isAuthenticated}
          onSubscribe={handleSubscribe}
          onLogin={handleLogin}
        />
      );
      break;

    case "checkout":
      content = selectedPlan ? (
        <CheckoutStep
          selectedPlan={selectedPlan}
          selectedProject={selectedProject}
          onBack={handleBackFromCheckout}
        />
      ) : null;
      break;

    default:
      content = null;
  }

  return <>{content}</>;
}
