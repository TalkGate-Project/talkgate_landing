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
import type { CouponInfoForCheckout } from "@/types/subscription";

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
  /** 쿠폰으로 진입한 경우 (info API로 검증 완료된 상태) */
  couponInfo?: CouponInfoForCheckout;
}

export default function CheckoutStep({
  selectedPlan,
  selectedProject,
  billingCycle,
  onBack,
  planSelectionContext,
  couponInfo,
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

  // 결제 수단 조회 (쿠폰 결제 시에는 스킵)
  useEffect(() => {
    if (couponInfo) {
      setLoadingBilling(false);
      return;
    }
    const fetchBillingInfo = async () => {
      setLoadingBilling(true);
      try {
        const response = await BillingService.list();
        const billingInfos = response.data?.data?.billingInfos || [];
        const activeBilling = billingInfos.find((b) => b.isActive) || billingInfos[0] || null;
        setBillingInfo(activeBilling);
      } catch {
        setBillingInfo(null);
      } finally {
        setLoadingBilling(false);
      }
    };

    fetchBillingInfo();
  }, [couponInfo]);

  const subscriptionBillingCycle = billingCycle === "yearly" ? "quarterly" : "monthly";
  const isPlanChange = planSelectionContext?.isPlanChange ?? false;
  const isUpgrade = planSelectionContext?.isUpgrade ?? false;
  const isCouponCheckout = Boolean(couponInfo);

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
      } catch {
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

    // 쿠폰이 아닌 경우에만 결제 수단 필요
    if (!isCouponCheckout && !billingInfo) {
      setShowConfirmModal(true);
      return;
    }

    if (!selectedProject) {
      setError("프로젝트를 먼저 선택해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const planId = Number(selectedPlan.id);

      if (isCouponCheckout && couponInfo) {
        await SubscriptionService.couponApply(selectedProject.id, { code: couponInfo.code });
        showErrorModal({
          type: "success",
          title: "구독 완료",
          headline: "구독이 완료되었습니다!",
          description: `${selectedProject.name} 프로젝트에 쿠폰이 적용된 ${selectedPlan.badge || selectedPlan.name} 플랜이 활성화되었습니다.`,
          confirmText: "확인",
          hideCancel: true,
          onConfirm: () => {
            window.location.href = "/pricing?step=project";
          },
        });
        return;
      }

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

        showErrorModal({
          type: "success",
          title: "구독 완료",
          headline: "구독이 완료되었습니다!",
          description: `${selectedProject.name} 프로젝트에 ${selectedPlan.badge || selectedPlan.name} 플랜이 적용되었습니다.`,
          confirmText: "확인",
          hideCancel: true,
          onConfirm: () => {
            window.location.href = "/pricing?step=project";
          },
        });
      }
    } catch (err: unknown) {
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
    } catch {
      // 결제 수단 조회 실패
    }
  };

  // 가격 계산 (VAT 별도). 쿠폰 시 실제 결제액은 0원
  const basePlanAmount =
    billingCycle === "monthly"
      ? selectedPlan.priceMonthly
      : selectedPlan.priceYearly || selectedPlan.priceMonthly;
  const planAmount = isPlanChange && isUpgrade ? estimateAmount ?? 0 : basePlanAmount;
  const subtotal = planAmount;
  const vat = Math.floor(planAmount * 0.1);
  const totalOriginal = planAmount + vat;
  const total = isCouponCheckout ? 0 : totalOriginal;
  const priceUnit = billingCycle === "monthly" ? "/ 매월" : "/ 3개월";
  const billingPeriod = billingCycle === "monthly" ? "매월" : "3개월";
  const billingLabel = isPlanChange ? "추가 청구 금액" : billingCycle === "monthly" ? "월간 청구" : "3개월 청구";
  const planDisplayName = selectedPlan.badge || selectedPlan.name;
  const titleText = isPlanChange ? "플랜 변경" : `${planDisplayName} 구독하기`;

  // 삭선 원가: 쿠폰 할인 시 또는 3개월 할인 시 가격 위에 표시
  const showStrikethrough = isCouponCheckout || billingCycle === "yearly";
  const strikethroughAmount = showStrikethrough
    ? isCouponCheckout
      ? totalOriginal
      : (selectedPlan.priceMonthly ?? 0) * 3 + Math.floor(((selectedPlan.priceMonthly ?? 0) * 3) * 0.1)
    : 0;

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

        {/* 가격 섹션 (쿠폰/3개월 할인 시 원가 삭선을 가격 위에 표시) */}
        <div className="mb-7 md:mb-12">
          {showStrikethrough && (
            <div className="text-[24px] md:text-[24px] text-[#808080] line-through leading-[150%] tracking-[-0.03em] mb-1">
              ₩ {strikethroughAmount.toLocaleString()}
            </div>
          )}
          <div className="flex items-baseline flex-wrap gap-x-2">
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

          {/* 당일 지불 총액 (쿠폰 시 원가 삭선 + 0원) */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-[#000000]">
              당일 지불 총액
            </h3>
            <p className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-right text-[#000000]">
              {isCouponCheckout ? (
                <span className="inline-flex items-center gap-2">
                  <span>{total.toLocaleString()}원</span>
                  <span className="line-through text-[#808080] font-normal">
                    ₩ {totalOriginal.toLocaleString()}
                  </span>
                </span>
              ) : (
                `${total.toLocaleString()}원`
              )}
            </p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-[#E2E2E2] my-8 md:mt-6 md:mb-12" />

        {/* 결제 수단 / 쿠폰 정보 */}
        <div className="mb-6">
          <h3 className="font-semibold text-[16px] md:text-[18px] text-[#252525] !mb-4">
            결제수단
          </h3>

          {isCouponCheckout && couponInfo ? (
            <div className="px-4 py-3.5 bg-[#F8F8F8] rounded-[12px] mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0">
                  <svg width="34" height="20" viewBox="0 0 34 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M33.9923 13.2414C32.2612 13.1794 31.0045 11.6842 31.033 9.8827C31.0604 8.12861 32.3083 6.7003 33.9956 6.64438L33.9923 1.4271C33.9923 0.653984 33.4325 0.0814441 32.7685 0L28.7893 0.106971C28.6896 0.593205 28.4245 0.825381 28.087 0.815657C27.7792 0.807148 27.5611 0.519054 27.4395 0.102109L1.24136 0.00121558C0.54563 0.0826597 0.00657386 0.656415 0.00547822 1.43196L0 6.64438C1.72892 6.7003 2.98891 8.18817 2.96591 10.0006C2.9429 11.7474 1.69167 13.1867 0.00438257 13.2414L0.0241042 18.5668C0.0273911 19.4408 0.812967 19.9587 1.56458 19.8991L27.4362 20C27.5633 19.5198 27.8011 19.2427 28.1999 19.2755C28.476 19.2974 28.6864 19.6037 28.8321 19.9939L32.7148 19.8991C33.5289 19.8092 34 19.16 34 18.3298L33.9934 13.2438L33.9923 13.2414ZM27.846 1.45505C28.1747 1.29824 28.5516 1.43439 28.7094 1.79785C28.8354 2.08837 28.74 2.53206 28.3993 2.73993C28.1473 2.89309 27.7342 2.7533 27.5743 2.45913C27.3902 2.12119 27.4976 1.62037 27.846 1.45505ZM28.3664 4.74078C27.9906 4.88786 27.6236 4.66176 27.5228 4.32748C27.4056 3.93606 27.5765 3.5021 27.972 3.39148C28.3007 3.29909 28.6425 3.53249 28.74 3.87163C28.8343 4.20106 28.6283 4.63988 28.3664 4.74199V4.74078ZM28.4694 18.6021C28.1594 18.7954 27.7573 18.6799 27.5874 18.3894C27.3935 18.0563 27.4779 17.5409 27.8515 17.3585C28.1911 17.1932 28.5779 17.35 28.7225 17.7293C28.8244 17.9955 28.7028 18.4574 28.4683 18.6033L28.4694 18.6021ZM28.3741 16.6693C27.9884 16.8188 27.6291 16.5879 27.5239 16.2572C27.399 15.8646 27.5776 15.4306 27.9753 15.3212C28.293 15.2337 28.6502 15.4683 28.7368 15.7856C28.8332 16.1381 28.6294 16.5708 28.3741 16.6705V16.6693ZM28.407 14.6612C28.1374 14.824 27.709 14.6721 27.5655 14.3779C27.3924 14.023 27.4998 13.5452 27.8591 13.3739C28.1867 13.217 28.5571 13.3739 28.7083 13.7288C28.8376 14.0315 28.7302 14.4679 28.407 14.6624V14.6612ZM27.8548 11.3937C28.1955 11.2308 28.5768 11.3888 28.7258 11.7729C28.8266 12.0318 28.7017 12.4998 28.4672 12.6445C28.1605 12.8329 27.754 12.7126 27.5918 12.4318C27.3924 12.0853 27.4768 11.576 27.8548 11.3949V11.3937ZM28.3675 10.702C27.9895 10.8454 27.628 10.6266 27.5217 10.2851C27.4023 9.90336 27.5809 9.4694 27.9742 9.35756C28.2952 9.2664 28.6469 9.501 28.7379 9.82678C28.8343 10.1708 28.6316 10.6011 28.3675 10.702ZM28.4059 8.70358C28.155 8.86039 27.7101 8.70723 27.5765 8.43372C27.3968 8.06418 27.4965 7.58646 27.857 7.41385C28.1824 7.25825 28.5549 7.40655 28.7127 7.76029C28.843 8.05324 28.728 8.50179 28.4059 8.70236V8.70358ZM28.2711 6.75621C27.9326 6.82915 27.594 6.59576 27.5195 6.30888C27.4121 5.89923 27.5633 5.4604 28.0399 5.36559C28.3456 5.30481 28.7148 5.63423 28.7554 5.90774C28.8167 6.31739 28.568 6.693 28.2711 6.75743V6.75621Z" fill="#252526" />
                    <path d="M8.50041 8.88616C7.82446 8.96922 7.65058 9.90364 7.90895 10.6328C8.00079 10.8918 8.36081 11.0909 8.60939 11.0958C8.82491 11.0994 9.18983 10.8576 9.27799 10.5632C9.41269 10.1113 9.38575 9.67889 9.22166 9.29657C9.11758 9.0535 8.72572 8.85928 8.50041 8.88616Z" fill="#252526" />
                    <path d="M19.6281 8.88C19.4432 8.88 19.0734 9.08032 18.9914 9.26721C18.7795 9.74602 18.7783 10.2309 18.9914 10.7061C19.0783 10.9003 19.4396 11.1006 19.6281 11.1043C19.8155 11.108 20.1914 10.8869 20.2735 10.6646C20.4596 10.1577 20.4437 9.71793 20.2539 9.27942C20.1718 9.08887 19.8143 8.88123 19.6294 8.88H19.6281Z" fill="#252526" />
                    <path d="M16.1253 9.00589L15.5767 8.95703L15.5742 9.90977C16.0714 9.77908 16.2342 9.72167 16.2722 9.5812C16.3114 9.43707 16.2685 9.01933 16.124 9.00589H16.1253Z" fill="#252526" />
                  </svg>
                </div>
                <div>
                  <p className="text-[16px] font-medium text-[#252525]">
                    {couponInfo.info.name}
                  </p>
                </div>
              </div>
            </div>
          ) : loadingBilling ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-[14px] text-[#808080]">결제 수단 확인 중...</span>
            </div>
          ) : billingInfo ? (
            <div className="p-4 bg-[#F8F8F8] rounded-[12px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-7 bg-[#252525] rounded flex items-center justify-center">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="24" height="16" rx="2" fill="#252525" />
                      <rect x="2" y="4" width="4" height="3" rx="0.5" fill="#FFD700" />
                      <rect x="2" y="9" width="6" height="1" rx="0.5" fill="#888" />
                      <rect x="2" y="11" width="4" height="1" rx="0.5" fill="#888" />
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
                  <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

        {/* Submit Button (쿠폰 시에도 구독하기 라벨 유지) */}
        <button
          onClick={handleSubscribe}
          disabled={
            submitting ||
            !agreedToTerms ||
            (!isCouponCheckout && (loadingBilling || (isPlanChange && isUpgrade && estimateAmount === null) || loadingEstimate))
          }
          className="w-full h-[48px] md:h-[52px] mt-8 rounded-[30px] bg-[#000000] text-white font-semibold text-[16px] md:text-[18px] leading-[150%] tracking-[-0.02em] text-center hover:bg-[#252525] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting
            ? "처리 중..."
            : !isCouponCheckout && loadingEstimate
              ? "청구 금액 계산 중..."
              : "구독하기"}
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
                  <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
