"use client";

import { useState, useEffect } from "react";
import { SubscriptionService } from "@/lib/subscription";
import type { DiscountCouponInfo, SubscriptionBillingCycle } from "@/types/subscription";

interface DiscountCouponModalProps {
  open: boolean;
  planId: number;
  billingCycle: SubscriptionBillingCycle;
  /** 모달 재오픈 시 이미 적용된 쿠폰으로 입력·검증 결과 초기화 */
  initialCoupon?: DiscountCouponInfo | null;
  onClose: () => void;
  onApply: (coupon: DiscountCouponInfo) => void;
}

export default function DiscountCouponModal({
  open,
  planId,
  billingCycle,
  initialCoupon,
  onClose,
  onApply,
}: DiscountCouponModalProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<DiscountCouponInfo | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initialCoupon) {
      setInput(initialCoupon.code);
      setValidationResult(initialCoupon);
    } else {
      setInput("");
      setValidationResult(null);
    }
    setValidationError(null);
  }, [open, initialCoupon]);

  const handleRegister = async () => {
    const code = input.trim();
    if (!code) return;

    setLoading(true);
    setValidationResult(null);
    setValidationError(null);

    try {
      const res = await SubscriptionService.discountCouponInfo({
        code,
        planId,
        billingCycle,
      });
      const data = res.data?.data;
      if (!data) {
        setValidationError("쿠폰 정보를 불러올 수 없습니다.");
        return;
      }
      if (!data.canUse) {
        setValidationError(data.unavailableReason || "유효하지 않은 쿠폰입니다.");
        return;
      }
      setValidationResult(data);
    } catch {
      setValidationError("유효하지 않은 쿠폰입니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!validationResult) return;
    onApply(validationResult);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-white rounded-[14px] w-full max-w-[440px] overflow-hidden"
        style={{ boxShadow: "0px 8px 12px rgba(9,30,66,0.1), 0px 13px 61px rgba(169,169,169,0.37)" }}
      >
        <div className="flex items-center justify-between px-7 pt-6 pb-4">
          <h3 className="font-semibold text-[18px] leading-[21px] text-[#000000]">쿠폰 적용하기</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18M18 6L6 18" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-7 pb-5">
          <div className="bg-[#F8F8F8] rounded-[12px] flex flex-col gap-2 py-[18px] px-4 sm:px-6 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <input
                type="text"
                placeholder="쿠폰코드를 입력해주세요"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setValidationResult(null);
                  setValidationError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRegister();
                  }
                }}
                className="flex-1 min-w-0 h-[34px] bg-white border border-[#E2E2E2] rounded-[5px] px-3 font-medium text-[14px] tracking-[0.2px] text-[#000000] focus:outline-none focus:border-[#00E272]"
              />
              <button
                type="button"
                onClick={handleRegister}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 h-[34px] px-3 sm:px-4 bg-white border border-[#E2E2E2] rounded-[5px] font-semibold text-[14px] tracking-[-0.02em] text-[#000000] whitespace-nowrap hover:bg-[#F0F0F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "확인 중" : "쿠폰조회"}
              </button>
            </div>
            {validationResult && (
              <>
                <p className="font-medium text-[14px] leading-[150%] tracking-[-0.02em] text-[#00B55B]" style={{ height: "21px" }}>
                  유효한 쿠폰입니다.
                </p>
                {validationResult.discountType === "percentage" && (
                  <div className="flex items-center" style={{ height: "24px" }}>
                    <span className="font-medium text-[14px] leading-[24px] text-[#808080]" style={{ width: "120px" }}>
                      할인율
                    </span>
                    <span className="font-medium text-[14px] leading-[24px] text-[#4D82F3]">
                      {validationResult.discountValue}%
                    </span>
                  </div>
                )}
                <div className="flex items-center" style={{ height: "24px" }}>
                  <span className="font-medium text-[14px] leading-[24px] text-[#808080]" style={{ width: "120px" }}>
                    할인금액
                  </span>
                  <span className="font-medium text-[14px] leading-[24px] text-[#4D82F3]">
                    {validationResult.pricing.discountAmount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-center" style={{ height: "24px" }}>
                  <span className="font-medium text-[14px] leading-[24px] text-[#808080]" style={{ width: "120px" }}>
                    할인 적용 기간
                  </span>
                  <span className="font-medium text-[14px] leading-[24px] text-[#4D82F3]">
                    앞으로 {validationResult.durationMonths}개월간 할인 적용
                  </span>
                </div>
              </>
            )}
            {validationError && (
              <p className="font-medium text-[14px] leading-[150%] tracking-[-0.02em] text-red-500" style={{ height: "21px" }}>
                {validationError}
              </p>
            )}
          </div>
        </div>
        <div className="border-t border-[#E2E2E2]" />
        <div className="flex items-center justify-end gap-3 px-7 py-3">
          <button
            type="button"
            onClick={onClose}
            style={{ width: "48px", height: "34px" }}
            className="flex items-center justify-center border border-[#E2E2E2] rounded-[5px] font-semibold text-[14px] tracking-[-0.02em] text-[#000000] hover:bg-[#F8F8F8] transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!validationResult}
            style={{ width: "48px", height: "34px" }}
            className="flex items-center justify-center bg-[#252525] rounded-[5px] font-semibold text-[14px] tracking-[-0.02em] text-[#EDEDED] hover:bg-[#3a3a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
