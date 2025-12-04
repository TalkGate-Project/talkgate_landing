"use client";

import { useState, useEffect } from "react";
import type { Project, PricingPlan } from "@/types";
import { ProjectSelectStep, PlanSelectStep, CheckoutStep } from "@/modules/pricing";
import { getLoginUrl, AUTH_COOKIE_NAME } from "@/lib/auth";

type PricingStep = "project-select" | "plan-select" | "checkout";

// Dev 환경 여부 확인
const isDev = process.env.NODE_ENV === "development";

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
      const authenticated = !!authCookie;
      
      // 한 번의 렌더링으로 모든 상태 업데이트
      setIsAuthenticated(authenticated);
      setCurrentStep(authenticated ? "project-select" : "plan-select");
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

  // Dev 모드: 임시 로그인 처리
  const handleDevLogin = () => {
    // 임시 세션 쿠키 설정 (30일 만료)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    document.cookie = `${AUTH_COOKIE_NAME}=dev_session_token; expires=${expiryDate.toUTCString()}; path=/`;
    
    // 페이지 새로고침하여 로그인 상태 적용
    window.location.reload();
  };

  // Dev 모드: 로그아웃 처리
  const handleDevLogout = () => {
    // 쿠키 삭제
    document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    
    // 페이지 새로고침하여 로그아웃 상태 적용
    window.location.reload();
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

  return (
    <>
      {content}

      {/* Dev 모드 테스트 버튼 (개발 환경에서만 표시) */}
      {isDev && (
        <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-2">
          {isAuthenticated ? (
            <button
              onClick={handleDevLogout}
              className="px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[14px] font-semibold shadow-lg transition-colors flex items-center gap-2"
              title="Dev 모드: 로그아웃 테스트"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6M10.6667 11.3333L14 8M14 8L10.6667 4.66667M14 8H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              DEV 로그아웃
            </button>
          ) : (
            <button
              onClick={handleDevLogin}
              className="px-4 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white text-[14px] font-semibold shadow-lg transition-colors flex items-center gap-2"
              title="Dev 모드: 로그인 테스트"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V3.33333C14 2.97971 13.8595 2.64057 13.6095 2.39052C13.3594 2.14048 13.0203 2 12.6667 2H10M5.33333 11.3333L2 8M2 8L5.33333 4.66667M2 8H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              DEV 로그인
            </button>
          )}
          <div className="text-center text-[10px] text-gray-500 bg-white/90 px-2 py-1 rounded">
            Dev Mode
          </div>
        </div>
      )}
    </>
  );
}
