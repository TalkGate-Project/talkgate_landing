"use client";

import { useState, useEffect } from "react";
import type { PricingPlan, Project, BillingCycle } from "@/types";
import type { BillingInfo } from "@/types/billing";
import { ChevronUpIcon } from "@/components/icons";
import { BillingService } from "@/lib/billing";
import { SubscriptionService } from "@/lib/subscription";
import { showErrorModal } from "@/lib/errorModalEvents";
import BillingRegisterModal from "./BillingRegisterModal";
import type { PlanSelectionContext } from "./PlanSelectStep";

// 정기과금(자동승인) 이용약관 내용
const RECURRING_BILLING_TERMS = `1. 이용자는 본 신청서에 서명하거나 공인인증 및 그에 준하는 전자 인증절차를 통함으로써 본 서비스를 이용할 수 있습니다.

2. 이용자가 납부하여야 할 요금에 대하여 별도의 통지 없이 이용자의 지급결제수단 정보를 사용하여 청구기관이 정한 지정 승인일(휴일인 경우 익영업일)에 승인 납부 됩니다.

3. 이용자는 이용자와 결제기관과의 이용약관이나 약정서 규정에도 불구하고 안심클릭, ISP 등 별도의 인증 절차 없이 정기과금(자동승인) 처리 절차에 의하여 승인하여도 이의가 없습니다.

4. 정기과금(자동승인) 승인일을 이용자가 지정하지 않은 경우 청구기관(재화 등을 공급하는 자)으로부터 사전 통지 받은 승인일을 최초 승인일로 하며, 승인일에 동일한 수종의 정기과금(자동승인)이 있는 경우 승인 우선 순위는 이용자의 결제기관이 정하는 바에 따릅니다.

6. 정기과금 승인일이 영업일이 아닌 경우에는 다음 영업일을 승인일로 하며, 이용자가 정기과금(자동승인)의 신청(신규, 해지, 변경)을 원하는 경우 해당 승인일 30일 전까지 청구기관에 통지해야 합니다.

8. 이용자의 지급결제수단의 승인한도가 청구기관의 청구금액보다 부족하거나 지급제한, 연체 등 이용자의 과실에 의해 발생하는 손해의 책임은 이용자에게 있습니다.

9. 이용자가 본 서비스를 이용하는 과정에서 발생하는 청구금액의 이의 등 이의가 있는 경우에는 이용자와 청구기관이 협의하여 조정키로 합니다.

10. 회사는 이용자와의 자동이체서비스 이용과 관련된 구체적인 권리, 의무를 정하기 위하여 본 약관과는 별도로 자동이체서비스이용약관을 제정할 수 있습니다`;

// 구독 및 취소 약관 내용
const SUBSCRIPTION_CANCEL_TERMS = `[구독 약관]

주문이 처리되면 구독이 시작됩니다. 귀하의 구독은 귀하가 취소할 때까지 매월 통지 없이 자동적으로 갱신될 것입니다. 귀하는 우리가 귀하의 결제 방법을 저장하고 귀하가 취소할 때까지 매달 자동적으로 귀하의 결제 방법으로 청구하는 것을 승인합니다. 우리는 귀하가 취소할 때까지 매월 갱신시 귀하의 플랜에 대한 당시의 요금과 관련 세금(예: 요금에 포함되지 않은 경우, VAT)을 자동적으로 청구할 것입니다.

우리는 귀하 플랜의 요율을 매월 갱신시 변경할 수 있으며, 요율이 변경되는 경우에는 취소 옵션과 함께 귀하에게 통지할 것입니다. 1개월 약정 기간에 해당 VAT 요율(또는 기타 포함되는 세금)이 변경되는 경우, 우리는 그에 따라 다음 과금일에 귀하의 플랜에 대한 세금 포함 요금을 조정할 것입니다.

귀하의 기본 결제 방법이 실패하는 경우, 귀하는 우리가 귀하의 계정에 다른 결제 방법으로 청구하는 것을 승인합니다. 귀하가 우리에게 대체 결제 방법을 제공하지 않은 상태에서 결제하지 않거나 귀하 계정의 모든 결제 방법이 실패하는 경우, 우리는 귀하의 구독을 정지시킬 수 있습니다. 귀하는 언제든지 Talkgate 페이지에서 결제 정보를 편집할 수 있습니다.

[취소 약관]

귀하는 언제든지 Talkgate 페이지를 통해 또는 고객지원센터에 연락하여 가입을 취소할 수 있습니다. 최초 주문 후 14일 이내 취소하는 경우 결제금액에서 사용기간만큼 일할 계산 후 차감되어 환불됩니다. 15일 이후 취소하는 경우에는 결제 금액을 환불할 수 없으며, 해당 월의 결제 기간이 종료될 때까지 서비스가 계속됩니다.

귀하는 재화 등이 내용이 표시, 광고 내용과 다르거나 계약내용과 다른 재화가 제공된 경우, 그 사실을 안 날 또는 알 수 있었던 날부터 15일 이내에 환불을 요청할 수 있습니다.

우리는 귀하가 유료서비스를 선물 받거나, 프로모션 등을 통해 무료/무상으로 취득하는 등 귀하가 직접 비용을 지불하지 아니하고 이용하는 유료서비스에 대하여 귀하에게 유료서비스 결제 대금을 환불할 의무를 부담하지 않습니다.`;

interface CheckoutStepProps {
  selectedPlan: PricingPlan;
  selectedProject?: Project;
  billingCycle: BillingCycle;
  onBack: () => void;
  planSelectionContext?: PlanSelectionContext;
}

export default function CheckoutStep({
  selectedPlan,
  selectedProject,
  billingCycle,
  onBack,
  planSelectionContext,
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
  const [estimateAmount, setEstimateAmount] = useState<number | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  
  // 약관 펼침 상태
  const [showRecurringTerms, setShowRecurringTerms] = useState(false);
  const [showCancelTerms, setShowCancelTerms] = useState(false);

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

  const subscriptionBillingCycle = billingCycle === "yearly" ? "quarterly" : "monthly";
  const isPlanChange = planSelectionContext?.isPlanChange ?? false;
  const isUpgrade = planSelectionContext?.isUpgrade ?? false;

  useEffect(() => {
    const fetchEstimate = async () => {
      if (!isPlanChange || !isUpgrade || !selectedProject) {
        setEstimateAmount(null);
        setEstimateError(null);
        return;
      }

      setLoadingEstimate(true);
      setEstimateError(null);
      try {
        const response = await SubscriptionService.estimatePlanChange(selectedProject.id, {
          newPlanId: Number(selectedPlan.id),
          newBillingCycle: subscriptionBillingCycle,
        });
        const estimate = response.data?.data;
        setEstimateAmount(estimate?.additionalCost ?? 0);
      } catch (err) {
        console.error("플랜 변경 금액 조회 실패:", err);
        setEstimateError("플랜 변경 금액을 불러오지 못했습니다.");
        setEstimateAmount(null);
      } finally {
        setLoadingEstimate(false);
      }
    };

    fetchEstimate();
  }, [isPlanChange, isUpgrade, selectedProject, selectedPlan.id, subscriptionBillingCycle]);

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
      const planId = Number(selectedPlan.id);

      if (isPlanChange) {
        await SubscriptionService.changePlan(selectedProject.id, {
          newPlanId: planId,
          newBillingCycle: subscriptionBillingCycle,
        });

        showErrorModal({
          type: "success",
          title: "플랜 변경 완료",
          headline: "플랜 변경이 완료되었습니다.",
          description: "변경된 상품은 다음 갱신일에 자동으로 적용됩니다.",
          confirmText: "확인",
          hideCancel: true,
          onConfirm: () => {
            window.location.href = "/pricing?step=project";
          },
        });
      } else {
        await SubscriptionService.start({
          projectId: Number(selectedProject.id),
          planId,
          billingCycle: subscriptionBillingCycle,
        });

        // 구독 성공 모달 표시
        showErrorModal({
          type: "success",
          title: "구독 완료",
          headline: "구독이 완료되었습니다!",
          description: `${selectedProject.name} 프로젝트에 ${selectedPlan.badge || selectedPlan.name} 플랜이 적용되었습니다.`,
          confirmText: "확인",
          hideCancel: true,
          onConfirm: () => {
            // 확인 클릭 시 /pricing으로 새로고침하여 프로젝트 목록 업데이트
            window.location.href = "/pricing?step=project";
          },
        });
      }
    } catch (err: unknown) {
      console.error(isPlanChange ? "플랜 변경 실패:" : "구독 실패:", err);
      const error = err as { data?: { message?: string } };
      const errorMessage =
        error?.data?.message ||
        (isPlanChange ? "플랜 변경에 실패했습니다. 다시 시도해주세요." : "구독에 실패했습니다. 다시 시도해주세요.");
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

  // 가격 계산 (VAT 별도)
  const basePlanAmount =
    billingCycle === "monthly"
      ? selectedPlan.priceMonthly
      : selectedPlan.priceYearly || selectedPlan.priceMonthly;
  const planAmount = isPlanChange && isUpgrade ? estimateAmount ?? 0 : basePlanAmount;
  const subtotal = planAmount; // 소계는 플랜금액
  const vat = Math.floor(planAmount * 0.1); // 부가가치세는 소계의 10%
  const total = planAmount + vat; // 지불 총액은 플랜금액 + 부가세
  const priceUnit = billingCycle === "monthly" ? "/ 매월" : "/ 3개월";
  const billingPeriod = billingCycle === "monthly" ? "매월" : "3개월";
  const billingLabel = isPlanChange ? "추가 청구 금액" : billingCycle === "monthly" ? "월간 청구" : "3개월 청구";
  const titleText = isPlanChange ? "플랜 변경" : "구독하기";

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
            {titleText}
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
            {isPlanChange ? "플랜 변경 결제" : `${billingPeriod} 구독하기`}
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
                {planAmount.toLocaleString()}원
              </p>
            </div>
            <div className="w-full h-px bg-[#E2E2E2] mt-4 md:mt-6" />
          </div>

          {/* 소계 */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-[#000000]">
                소계
              </h3>
              <p className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-right text-[#000000]">
                {subtotal.toLocaleString()}원
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
                  <div className="flex items-center">
                    <p className="text-[14px] font-medium text-[#252525]">
                      {billingInfo.cardCompany || "신용카드"} {getMaskedCardNumber()}
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
        {(error || estimateError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[14px] mb-4">
            {error || estimateError}
          </div>
        )}

        {/* Terms Agreement */}
        <div className="mt-6 space-y-4">
          {/* 정기과금(자동승인) 이용약관 */}
          <div className="border border-[#E2E2E2] rounded-[8px] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowRecurringTerms(!showRecurringTerms)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#F8F8F8] hover:bg-[#F0F0F0] transition-colors"
            >
              <span className="text-[14px] font-medium text-[#252525]">
                정기과금(자동승인) 이용약관
              </span>
              <ChevronUpIcon className={`w-4 h-4 transition-transform ${showRecurringTerms ? "" : "rotate-180"}`} />
            </button>
            {showRecurringTerms && (
              <div className="px-4 py-3 bg-white max-h-[200px] overflow-y-auto">
                <p className="text-[12px] text-[#595959] whitespace-pre-line leading-[1.6]">
                  {RECURRING_BILLING_TERMS}
                </p>
              </div>
            )}
          </div>

          {/* 구독 및 취소 약관 */}
          <div className="border border-[#E2E2E2] rounded-[8px] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowCancelTerms(!showCancelTerms)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#F8F8F8] hover:bg-[#F0F0F0] transition-colors"
            >
              <span className="text-[14px] font-medium text-[#252525]">
                구독 및 취소 약관
              </span>
              <ChevronUpIcon className={`w-4 h-4 transition-transform ${showCancelTerms ? "" : "rotate-180"}`} />
            </button>
            {showCancelTerms && (
              <div className="px-4 py-3 bg-white max-h-[200px] overflow-y-auto">
                <p className="text-[12px] text-[#595959] whitespace-pre-line leading-[1.6]">
                  {SUBSCRIPTION_CANCEL_TERMS}
                </p>
              </div>
            )}
          </div>

          {/* 동의 체크박스 */}
          <label className="flex items-start gap-2 cursor-pointer mt-4">
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
              위 약관에 동의합니다. 이용약관에 명시된 대로 요금이 변경될 수 있으며, 언제든지
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
          disabled={submitting || !agreedToTerms || loadingBilling || loadingEstimate || (isPlanChange && isUpgrade && estimateAmount === null)}
          className="w-full h-[48px] md:h-[52px] mt-8 rounded-[30px] bg-[#000000] text-white font-semibold text-[16px] md:text-[18px] leading-[150%] tracking-[-0.02em] text-center hover:bg-[#252525] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting
            ? "처리 중..."
            : loadingEstimate
            ? "청구 금액 계산 중..."
            : "결제하기"}
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
