"use client";

import { useState } from "react";
import type { PricingPlan, Project } from "@/types";
import { ChevronUpIcon, VisaIcon, MastercardIcon, AmexIcon, DiscoverIcon } from "@/components/icons";

interface CheckoutStepProps {
  selectedPlan: PricingPlan;
  selectedProject?: Project;
  onBack: () => void;
}

export default function CheckoutStep({
  selectedPlan,
  selectedProject,
  onBack,
}: CheckoutStepProps) {
  const [formData, setFormData] = useState({
    email: "",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    country: "대한민국",
    postalCode: "",
  });

  const [saveInfo, setSaveInfo] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert("이용약관 및 개인정보처리방침에 동의해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      // TODO: 결제 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("결제가 완료되었습니다!");
      // TODO: 결제 완료 후 처리
    } catch (error) {
      console.error("Payment failed:", error);
      alert("결제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  // 가격 계산 (VAT 포함)
  const subtotal = selectedPlan.priceMonthly;
  const perSeat = Math.floor(subtotal / 1.1); // VAT 제외 금액
  const vat = subtotal - perSeat;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-white py-6 md:py-20">
      <div className="max-w-[1078px] mx-auto px-6 md:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-11 md:gap-12">
          {/* Left Column - Subscription Details */}
          <div className="w-full md:max-w-[418px]">
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
                  / 매월
                </span>
              </div>
              <p className="font-semibold text-[16px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-[#595959] mt-3 md:mt-4">
                매월 구독하기
              </p>
            </div>

            {/* 청구 상세 */}
            <div className="space-y-4 md:space-y-6">
              {/* 월간 청구 */}
              <div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-[14px] md:text-[16px] leading-[150%] tracking-[-0.02em] text-[#000000]">
                    월간 청구
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
          </div>

          {/* Right Column - Payment Form */}
          <div className="w-full md:max-w-[572px]">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[10px] w-full bg-white md:border-2 md:border-[#E2E2E2] rounded-[24px] md:rounded-[42px] md:p-[52px]"
            >
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
                  이메일 정보
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@company.com"
                  required
                  className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#000000] bg-white"
                />
              </div>

              {/* Cardholder Name */}
              <div className="flex flex-col gap-2">
                <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
                  카드 소유자 이름
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="홍길동"
                  required
                  className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#000000] bg-white"
                />
              </div>

              {/* Card Info */}
              <div className="flex flex-col gap-2">
                <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
                  카드 정보
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 1234 1234 1234"
                    required
                    maxLength={19}
                    className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] pr-20 md:pr-28 text-[14px] text-[#000000] bg-white"
                  />
                  <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <VisaIcon />
                    <MastercardIcon />
                    <AmexIcon />
                    <DiscoverIcon />
                  </div>
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="flex gap-2 md:gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
                    만료기간
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM / YY"
                    required
                    maxLength={7}
                    className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#808080] bg-white"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
                    보안코드
                  </label>
                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    placeholder="CVC"
                    required
                    maxLength={4}
                    className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#808080] bg-white"
                  />
                </div>
              </div>

              {/* Country & Postal Code */}
              <div className="flex gap-2 md:gap-3">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
                    청구주소
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#000000] bg-white appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3 4.5L6 7.5L9 4.5' stroke='%23000000' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                    }}
                  >
                    <option value="대한민국">대한민국</option>
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#808080]">
                    우편번호
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="우편번호"
                    required
                    className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-3 py-[10px] text-[14px] text-[#808080] bg-white"
                  />
                </div>
              </div>

              {/* Save Info Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer !mt-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="w-5 h-5 appearance-none rounded-[5px] border-2 border-[#E2E2E2] checked:bg-[#00E272] checked:border-[#00E272] cursor-pointer transition-colors"
                  />
                  {saveInfo && (
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
                <span className="font-normal text-[12px] md:text-[13px] leading-[16px] text-[#595959] opacity-80">
                  더 빠른 결제를 위해 내 정보 저장
                </span>
              </label>

              {/* Terms Agreement */}
              <div className="!mt-4">
                <label className="flex items-start gap-2 cursor-pointer">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
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
                  <span className="font-normal text-[12px] md:text-[13px] leading-[18px] md:leading-[16px] text-[#595959] opacity-80">
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
                type="submit"
                disabled={submitting || !agreedToTerms}
                className="w-full h-[48px] md:h-[52px] !mt-6 rounded-[30px] bg-[#000000] text-white font-semibold text-[16px] md:text-[18px] leading-[150%] tracking-[-0.02em] text-center hover:bg-[#252525] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? "처리 중..." : "결제하기"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
