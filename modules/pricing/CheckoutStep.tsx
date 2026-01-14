"use client";

import { useState, useEffect } from "react";
import type { PricingPlan, Project, BillingCycle } from "@/types";
import type { BillingInfo } from "@/types/billing";
import { ChevronUpIcon } from "@/components/icons";
import { BillingService } from "@/lib/billing";
import { SubscriptionService } from "@/lib/subscription";
import BillingRegisterModal from "./BillingRegisterModal";

interface CheckoutStepProps {
  selectedPlan: PricingPlan;
  selectedProject?: Project;
  billingCycle: BillingCycle;
  onBack: () => void;
}

export default function CheckoutStep({
  selectedPlan,
  selectedProject,
  billingCycle,
  onBack,
}: CheckoutStepProps) {
  // 컴포넌트 마운트 시 스크롤을 맨 위로 올리기
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loadingBilling, setLoadingBilling] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 결제 수단 조회
  useEffect(() => {
    const fetchBillingInfo = async () => {
      setLoadingBilling(true);
      try {
        const response = await BillingService.list();
        const billingInfos = response.data?.data?.billingInfos || [];
        // 활성화된 결제 수단 중 첫 번째를 사용
        const activeBilling = billingInfos.find((b) => b.isActive) || billingInfos[0] || null;
        setBillingInfo(activeBilling);
      } catch (err) {
        console.error("결제 수단 조회 실패:", err);
        setBillingInfo(null);
      } finally {
        setLoadingBilling(false);
      }
    };

    fetchBillingInfo();
  }, []);

  const handleSubscribe = async () => {
    if (!agreedToTerms) {
      setError("이용약관 및 개인정보처리방침에 동의해주세요.");
      return;
    }

    // 결제 수단이 없으면 등록 안내 모달 표시
    if (!billingInfo) {
      setShowConfirmModal(true);
      return;
    }

    // 프로젝트가 선택되지 않은 경우 (임시로 에러 처리, 실제로는 플로우에서 프로젝트 선택 필요)
    if (!selectedProject) {
      setError("프로젝트를 먼저 선택해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 플랜 ID 매핑 (기존 하드코딩된 플랜 ID를 실제 API 플랜 ID로 변환 필요)
      // 임시로 플랜 이름으로 ID 추측
      const planIdMap: Record<string, number> = {
        basic: 1,
        premium: 2,
      };
      const planId = planIdMap[selectedPlan.id] || 1;

      // billingCycle 변환 (monthly, yearly -> monthly, quarterly)
      const subscriptionBillingCycle = billingCycle === "yearly" ? "quarterly" : "monthly";

      await SubscriptionService.start({
        projectId: Number(selectedProject.id),
        planId,
        billingCycle: subscriptionBillingCycle,
      });

      alert("구독이 완료되었습니다!");
      // TODO: 구독 완료 후 대시보드로 이동
    } catch (err: unknown) {
      console.error("구독 실패:", err);
      const error = err as { data?: { message?: string } };
      const errorMessage = error?.data?.message || "구독에 실패했습니다. 다시 시도해주세요.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // 결제 수단 등록 확인 모달에서 확인 클릭
  const handleConfirmRegister = () => {
    setShowConfirmModal(false);
    setShowRegisterModal(true);
  };

  // 결제 수단 등록 성공
  const handleRegisterSuccess = async () => {
    setShowRegisterModal(false);
    // 결제 수단 다시 조회
    try {
      const response = await BillingService.list();
      const billingInfos = response.data?.data?.billingInfos || [];
      const activeBilling = billingInfos.find((b) => b.isActive) || billingInfos[0] || null;
      setBillingInfo(activeBilling);
    } catch (err) {
      console.error("결제 수단 조회 실패:", err);
    }
  };

  // 가격 계산 (VAT 포함)
  const price = billingCycle === "monthly" ? selectedPlan.priceMonthly : (selectedPlan.priceYearly || selectedPlan.priceMonthly);
  const subtotal = price;
  const perSeat = Math.floor(subtotal / 1.1); // VAT 제외 금액
  const vat = subtotal - perSeat;
  const total = subtotal;
  const priceUnit = billingCycle === "monthly" ? "/ 매월" : "/ 3개월";
  const billingPeriod = billingCycle === "monthly" ? "매월" : "3개월";
  const billingLabel = billingCycle === "monthly" ? "월간 청구" : "3개월 청구";

  // 카드 정보 마스킹
  const getMaskedCardNumber = () => {
    if (!billingInfo) return "";
    return `•••• •••• •••• ${billingInfo.lastFourDigits}`;
  };

  return (
    <div className="min-h-screen bg-white py-6 md:py-20">
      <div className="max-w-[640px] mx-auto px-6 md:px-4">
        {/* 뒤로 가기 버튼 with 구독하기 제목 */}
        <div className="flex items-center gap-2 mb-5 md:mb-12 -translate-x-2 md:translate-x-0">
          <button
            onClick={onBack}
            className="cursor-pointer flex items-center justify-center w-6 h-6 hover:opacity-70 transition-opacity"
          >
            <ChevronUpIcon className="rotate-90" />
          </button>
          <h1 className="font-bold text-[20px] md:text-[24px] leading-[150%] tracking-[-0.03em] text-[#252525]">
            구독하기
          </h1>
        </div>

        {/* 가격 섹션 */}
        <div className="mb-7 md:mb-12">
          <div className="flex items-baseline">
            <span className="font-bold text-[40px] md:text-[60px] leading-[150%] tracking-[-0.03em] text-center text-[#252525]">
              ₩ {total.toLocaleString()}
            </span>
            <span className="font-normal text-[16px] md:text-[18px] leading-[150%] tracking-[-0.02em] text-[#595959] ml-2">
              {priceUnit}
            </span>
          </div>
          <p className="font-semibold text-[16px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-[#595959] mt-3 md:mt-4">
            {billingPeriod} 구독하기
          </p>
        </div>

        {/* 청구 상세 */}
        <div className="space-y-4 md:space-y-6">
          {/* 청구 */}
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-[#000000]">
                {billingLabel}
              </h3>
              <p className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-right text-[#000000]">
                {perSeat.toLocaleString()}원
              </p>
            </div>
            <p className="font-medium text-[13px] leading-[150%] tracking-[-0.02em] text-right text-[#808080]">
              seat당 {perSeat.toLocaleString()}원* (직원 수 무관)
            </p>
            <div className="w-full h-px bg-[#E2E2E2] mt-4 md:mt-6" />
          </div>

          {/* 소계 */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-[#000000]">
                소계
              </h3>
              <p className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-right text-[#000000]">
                {perSeat.toLocaleString()}원
              </p>
            </div>
          </div>

          {/* 부가가치세 */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-[#808080]">
                부가가치세 (10%)
              </h3>
              <p className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-right text-[#808080]">
                {vat.toLocaleString()}원
              </p>
            </div>
            <div className="w-full h-px bg-[#E2E2E2] mt-4 md:mt-6" />
          </div>

          {/* 당일 지불 총액 */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-[#000000]">
              당일 지불 총액
            </h3>
            <p className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-right text-[#000000]">
              {total.toLocaleString()}원
            </p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-[#E2E2E2] my-8 md:my-10" />

        {/* 결제 수단 정보 */}
        <div className="mb-6">
          <h3 className="font-semibold text-[16px] md:text-[18px] text-[#252525] mb-4">
            결제 수단
          </h3>
          
          {loadingBilling ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-[14px] text-[#808080]">결제 수단 확인 중...</span>
            </div>
          ) : billingInfo ? (
            <div className="p-4 bg-[#F8F8F8] rounded-[12px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-[#252525] rounded flex items-center justify-center">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="16" rx="2" fill="#252525"/>
                      <rect x="2" y="4" width="4" height="3" rx="0.5" fill="#FFD700"/>
                      <rect x="2" y="9" width="6" height="1" rx="0.5" fill="#888"/>
                      <rect x="2" y="11" width="4" height="1" rx="0.5" fill="#888"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#252525]">
                      {billingInfo.cardCompany || "신용카드"} {getMaskedCardNumber()}
                    </p>
                    <p className="text-[12px] text-[#808080]">
                      {billingInfo.cardType || "신용"} | {billingInfo.ownerType === "personal" ? "개인" : "법인"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="text-[13px] text-[#00B55B] font-medium hover:underline"
                >
                  변경
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#FFF9E6] rounded-[12px]">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5">
                  <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#92400E] mb-1">
                    등록된 결제 수단이 없습니다
                  </p>
                  <p className="text-[13px] text-[#B45309]">
                    구독을 시작하려면 결제 수단을 먼저 등록해주세요.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="mt-3 w-full h-[40px] rounded-[8px] bg-white text-[14px] font-semibold text-[#252525] hover:bg-[#F8F8F8] transition-colors"
              >
                결제 수단 등록하기
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[14px] mb-4">
            {error}
          </div>
        )}

        {/* Terms Agreement */}
        <div className="mt-6">
          <label className="flex items-start gap-2 cursor-pointer">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  setError(null);
                }}
                className="w-5 h-5 appearance-none rounded-[5px] border border-[#B0B0B0] checked:bg-[#00E272] checked:border-[#00E272] cursor-pointer transition-colors"
              />
              {agreedToTerms && (
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
            <span className="font-normal text-[12px] md:text-[13px] leading-[18px] md:leading-[20px] text-[#595959] opacity-80">
              이용약관에 명시된 대로 요금이 변경될 수 있으며, 언제든지
              구독을 취소할 수 있습니다. 구독함으로써 회사의{" "}
              <a href="/terms" className="text-[#00B55B] underline">
                이용약관
              </a>{" "}
              및{" "}
              <a href="/privacy" className="text-[#00B55B] underline">
                개인정보처리방침
              </a>
              에 동의하며, 서비스 갱신 및 기타 구매를 위해 회사가 결제
              수단을 저장하도록 허가합니다.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubscribe}
          disabled={submitting || !agreedToTerms || loadingBilling}
          className="w-full h-[48px] md:h-[52px] mt-8 rounded-[30px] bg-[#000000] text-white font-semibold text-[16px] md:text-[18px] leading-[150%] tracking-[-0.02em] text-center hover:bg-[#252525] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting ? "처리 중..." : "결제하기"}
        </button>
      </div>

      {/* 결제 수단 등록 필요 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirmModal(false)} />
          <div className="relative bg-white rounded-[16px] shadow-[0px_13px_61px_rgba(169,169,169,0.37)] w-full max-w-[400px] p-6">
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-[#FFF9E6] rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-[18px] font-bold text-[#252525] mb-2">
                결제 수단 등록이 필요합니다
              </h3>
              <p className="text-[14px] text-[#595959]">
                구독을 시작하려면 먼저 결제 수단을 등록해주세요.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 h-[44px] rounded-[8px] border border-[#E2E2E2] text-[14px] font-semibold text-[#252525] bg-white hover:bg-[#F8F8F8] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmRegister}
                className="flex-1 h-[44px] rounded-[8px] bg-[#252525] text-white text-[14px] font-semibold hover:bg-[#3a3a3a] transition-colors"
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 결제 수단 등록 모달 */}
      {showRegisterModal && (
        <BillingRegisterModal
          onClose={() => setShowRegisterModal(false)}
          onSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
}
