"use client";

import { useState } from "react";
import { VisaIcon, MastercardIcon, AmexIcon, DiscoverIcon } from "@/components/icons";
import { BillingService } from "@/lib/billing";
import type { BillingRegisterInput } from "@/types/billing";

interface BillingRegisterModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function BillingRegisterModal({
  onClose,
  onSuccess,
}: BillingRegisterModalProps) {
  const [formData, setFormData] = useState({
    cardNo: "",
    expYear: "",
    expMonth: "",
    idNo: "",
    cardPw: "",
    buyerName: "",
    buyerEmail: "",
    buyerTel: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // 카드번호 포맷팅 (1234 1234 1234 1234)
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(" ") : "";
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setFormData((prev) => ({ ...prev, cardNo: value }));
    setError(null);
  };

  // 만료일 포맷팅 (MM / YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    const month = value.slice(0, 2);
    const year = value.slice(2, 4);
    setFormData((prev) => ({
      ...prev,
      expMonth: month,
      expYear: year,
    }));
    setError(null);
  };

  const getExpiryDisplayValue = () => {
    if (!formData.expMonth && !formData.expYear) return "";
    if (formData.expMonth && !formData.expYear) return formData.expMonth;
    return `${formData.expMonth} / ${formData.expYear}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (formData.cardNo.length < 15) {
      setError("카드번호를 올바르게 입력해주세요.");
      return;
    }
    if (!formData.expMonth || !formData.expYear) {
      setError("만료일을 입력해주세요.");
      return;
    }
    if (!formData.cardPw || formData.cardPw.length < 2) {
      setError("카드 비밀번호 앞 2자리를 입력해주세요.");
      return;
    }
    if (!formData.idNo || formData.idNo.length < 6) {
      setError("생년월일(6자리) 또는 사업자등록번호(10자리)를 입력해주세요.");
      return;
    }
    if (!formData.buyerName) {
      setError("카드 소유자 이름을 입력해주세요.");
      return;
    }
    if (!formData.buyerEmail) {
      setError("이메일을 입력해주세요.");
      return;
    }
    if (!formData.buyerTel) {
      setError("연락처를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const input: BillingRegisterInput = {
        cardNo: formData.cardNo,
        expYear: formData.expYear,
        expMonth: formData.expMonth,
        idNo: formData.idNo,
        cardPw: formData.cardPw,
        buyerName: formData.buyerName,
        buyerEmail: formData.buyerEmail,
        buyerTel: formData.buyerTel,
      };

      await BillingService.register(input);
      onSuccess();
    } catch (err: unknown) {
      console.error("결제 수단 등록 실패:", err);
      const error = err as { data?: { message?: string } };
      const errorMessage = error?.data?.message || "결제 수단 등록에 실패했습니다. 다시 시도해주세요.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] md:rounded-[42px] shadow-[0px_13px_61px_rgba(169,169,169,0.37)] w-full max-w-[520px] p-6 md:p-[52px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] md:text-[20px] font-bold text-[#252525]">
            결제 수단 등록
          </h2>
          <button
            aria-label="닫기"
            className="cursor-pointer w-8 h-8 grid place-items-center hover:opacity-70 transition-opacity"
            onClick={onClose}
            disabled={submitting}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6L18 18"
                stroke="#B0B0B0"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[14px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* 이메일 */}
          <div className="flex flex-col gap-2">
            <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="buyerEmail"
              value={formData.buyerEmail}
              onChange={handleInputChange}
              placeholder="email@company.com"
              required
              disabled={submitting}
              className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#000000] bg-white disabled:bg-gray-100"
            />
          </div>

          {/* 카드 소유자 이름 */}
          <div className="flex flex-col gap-2">
            <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
              카드 소유자 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="buyerName"
              value={formData.buyerName}
              onChange={handleInputChange}
              placeholder="홍길동"
              required
              disabled={submitting}
              className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#000000] bg-white disabled:bg-gray-100"
            />
          </div>

          {/* 연락처 */}
          <div className="flex flex-col gap-2">
            <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="buyerTel"
              value={formData.buyerTel}
              onChange={handleInputChange}
              placeholder="01012345678"
              required
              disabled={submitting}
              className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#000000] bg-white disabled:bg-gray-100"
            />
          </div>

          {/* 카드 번호 */}
          <div className="flex flex-col gap-2">
            <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
              카드 번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formatCardNumber(formData.cardNo)}
                onChange={handleCardNumberChange}
                placeholder="1234 1234 1234 1234"
                required
                disabled={submitting}
                className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] pr-24 md:pr-28 text-[14px] text-[#000000] bg-white disabled:bg-gray-100"
              />
              <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <VisaIcon />
                <MastercardIcon />
                <AmexIcon />
                <DiscoverIcon />
              </div>
            </div>
          </div>

          {/* 만료일 & 카드 비밀번호 */}
          <div className="flex gap-2 md:gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
                만료일 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={getExpiryDisplayValue()}
                onChange={handleExpiryChange}
                placeholder="MM / YY"
                required
                disabled={submitting}
                className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#808080] bg-white disabled:bg-gray-100"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
                카드 비밀번호 앞 2자리 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="cardPw"
                value={formData.cardPw}
                onChange={handleInputChange}
                placeholder="••"
                required
                maxLength={2}
                disabled={submitting}
                className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#808080] bg-white disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* 생년월일/사업자번호 */}
          <div className="flex flex-col gap-2">
            <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
              생년월일(6자리) 또는 사업자등록번호(10자리) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="idNo"
              value={formData.idNo}
              onChange={handleInputChange}
              placeholder="YYMMDD 또는 사업자등록번호"
              required
              maxLength={10}
              disabled={submitting}
              className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#000000] bg-white disabled:bg-gray-100"
            />
          </div>

          {/* 안내 문구 */}
          <p className="text-[12px] text-[#808080] mt-2">
            * 입력하신 카드 정보는 안전하게 암호화되어 처리됩니다.
          </p>

          {/* 등록 버튼 */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-[48px] md:h-[52px] mt-4 rounded-[30px] bg-[#000000] text-white font-semibold text-[16px] md:text-[18px] leading-[150%] tracking-[-0.02em] text-center hover:bg-[#252525] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {submitting ? "등록 중..." : "등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
