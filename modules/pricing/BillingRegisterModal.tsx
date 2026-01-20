"use client";

import { useState, useRef } from "react";
import { VisaIcon, MastercardIcon, AmexIcon, DiscoverIcon, ChevronUpIcon } from "@/components/icons";
import { BillingService } from "@/lib/billing";
import type { BillingRegisterInput, BillingTermsType } from "@/types/billing";

// 나이스페이 약관 타입 정의
type NicePayTerms = {
  type: BillingTermsType;
  title: string;
  content: string | null;
  loading: boolean;
  expanded: boolean;
  agreed: boolean;
};

const NICEPAY_TERMS_CONFIG: { type: BillingTermsType; label: string }[] = [
  { type: "ElectronicFinancialTransactions", label: "전자금융거래 약관" },
  { type: "CollectPersonalInfo", label: "개인정보 수집 및 이용 약관" },
  { type: "SharingPersonalInformation", label: "개인정보 제3자 제공 약관" },
];

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

  // 카드번호를 4개 부분으로 분리
  const [cardNumberParts, setCardNumberParts] = useState({
    part1: "", // 앞 4자리
    part2: "", // 중간 첫 4자리
    part3: "", // 중간 두 번째 4자리
    part4: "", // 뒤 4자리
  });

  // 카드번호 입력 필드 refs
  const cardInputRefs = {
    part1: useRef<HTMLInputElement>(null),
    part2: useRef<HTMLInputElement>(null),
    part3: useRef<HTMLInputElement>(null),
    part4: useRef<HTMLInputElement>(null),
  };

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 나이스페이 약관 상태
  const [nicePayTerms, setNicePayTerms] = useState<NicePayTerms[]>(
    NICEPAY_TERMS_CONFIG.map((config) => ({
      type: config.type,
      title: config.label,
      content: null,
      loading: false,
      expanded: false,
      agreed: false,
    }))
  );

  // 모든 약관 동의 여부
  const allTermsAgreed = nicePayTerms.every((term) => term.agreed);

  // 약관 내용 로드 (펼칠 때 lazy loading)
  const loadTermsContent = async (type: BillingTermsType) => {
    const termIndex = nicePayTerms.findIndex((t) => t.type === type);
    if (termIndex === -1 || nicePayTerms[termIndex].content !== null) return;

    setNicePayTerms((prev) =>
      prev.map((t) =>
        t.type === type ? { ...t, loading: true } : t
      )
    );

    try {
      const response = await BillingService.getTerms(type);
      const data = response.data?.data;
      setNicePayTerms((prev) =>
        prev.map((t) =>
          t.type === type
            ? { ...t, content: data?.content || "약관 내용을 불러올 수 없습니다.", loading: false }
            : t
        )
      );
    } catch (err) {
      console.error("약관 조회 실패:", err);
      setNicePayTerms((prev) =>
        prev.map((t) =>
          t.type === type
            ? { ...t, content: "약관 내용을 불러올 수 없습니다.", loading: false }
            : t
        )
      );
    }
  };

  // 약관 펼침/접기 토글
  const toggleTermExpanded = (type: BillingTermsType) => {
    setNicePayTerms((prev) =>
      prev.map((t) => {
        if (t.type === type) {
          const newExpanded = !t.expanded;
          if (newExpanded && t.content === null) {
            loadTermsContent(type);
          }
          return { ...t, expanded: newExpanded };
        }
        return t;
      })
    );
  };

  // 약관 동의 토글
  const toggleTermAgreed = (type: BillingTermsType) => {
    setNicePayTerms((prev) =>
      prev.map((t) =>
        t.type === type ? { ...t, agreed: !t.agreed } : t
      )
    );
    setError(null);
  };

  // 전체 동의
  const toggleAllAgreed = () => {
    const newValue = !allTermsAgreed;
    setNicePayTerms((prev) =>
      prev.map((t) => ({ ...t, agreed: newValue }))
    );
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // 카드번호 부분 업데이트 및 전체 카드번호 합치기
  const handleCardNumberPartChange = (
    part: "part1" | "part2" | "part3" | "part4",
    value: string
  ) => {
    const numbers = value.replace(/\D/g, "").slice(0, 4);
    setCardNumberParts((prev) => {
      const updated = { ...prev, [part]: numbers };
      // 전체 카드번호 업데이트
      const fullCardNo = updated.part1 + updated.part2 + updated.part3 + updated.part4;
      setFormData((prev) => ({ ...prev, cardNo: fullCardNo }));
      
      // 4자리 입력 완료 시 다음 필드로 자동 이동
      if (numbers.length === 4) {
        if (part === "part1" && cardInputRefs.part2.current) {
          cardInputRefs.part2.current.focus();
        } else if (part === "part2" && cardInputRefs.part3.current) {
          cardInputRefs.part3.current.focus();
        } else if (part === "part3" && cardInputRefs.part4.current) {
          cardInputRefs.part4.current.focus();
        }
      }
      
      return updated;
    });
    setError(null);
  };

  // 카드번호 부분에 키보드 이벤트 처리
  const handleCardNumberKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentPart: "part1" | "part2" | "part3" | "part4"
  ) => {
    const input = e.currentTarget;
    const value = input.value.replace(/\D/g, "");

    // 백스페이스 처리: 빈 필드에서 백스페이스 시 이전 필드로 이동
    if (e.key === "Backspace" && value.length === 0) {
      if (currentPart === "part2" && cardInputRefs.part1.current) {
        cardInputRefs.part1.current.focus();
      } else if (currentPart === "part3" && cardInputRefs.part2.current) {
        cardInputRefs.part2.current.focus();
      } else if (currentPart === "part4" && cardInputRefs.part3.current) {
        cardInputRefs.part3.current.focus();
      }
    }
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

    if (!allTermsAgreed) {
      setError("모든 약관에 동의해주세요.");
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
      <div className="relative bg-white rounded-[24px] md:rounded-[42px] shadow-[0px_13px_61px_rgba(169,169,169,0.37)] w-full max-w-[520px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* 스크롤 가능한 내부 영역 */}
        <div className="flex-1 overflow-y-auto p-6 md:p-[52px]">
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
              {/* 모바일: 2x2 그리드, 데스크톱: 4개 가로 배치 */}
              <div className="grid grid-cols-4 gap-1.5 md:gap-2">
                {/* 앞 4자리 */}
                <input
                  ref={cardInputRefs.part1}
                  type="text"
                  inputMode="numeric"
                  value={cardNumberParts.part1}
                  onChange={(e) => handleCardNumberPartChange("part1", e.target.value)}
                  onKeyDown={(e) => handleCardNumberKeyDown(e, "part1")}
                  placeholder="1234"
                  maxLength={4}
                  required
                  disabled={submitting}
                  className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-2 md:px-3 py-[10px] text-[12px] md:text-[14px] text-[#000000] bg-white disabled:bg-gray-100 text-center"
                />
                {/* 중간 첫 4자리 (마스킹) */}
                <input
                  ref={cardInputRefs.part2}
                  type="password"
                  inputMode="numeric"
                  value={cardNumberParts.part2}
                  onChange={(e) => handleCardNumberPartChange("part2", e.target.value)}
                  onKeyDown={(e) => handleCardNumberKeyDown(e, "part2")}
                  placeholder="****"
                  maxLength={4}
                  required
                  disabled={submitting}
                  className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-2 md:px-3 py-[10px] text-[12px] md:text-[14px] text-[#000000] bg-white disabled:bg-gray-100 text-center"
                />
                {/* 중간 두 번째 4자리 (마스킹) */}
                <input
                  ref={cardInputRefs.part3}
                  type="password"
                  inputMode="numeric"
                  value={cardNumberParts.part3}
                  onChange={(e) => handleCardNumberPartChange("part3", e.target.value)}
                  onKeyDown={(e) => handleCardNumberKeyDown(e, "part3")}
                  placeholder="****"
                  maxLength={4}
                  required
                  disabled={submitting}
                  className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-2 md:px-3 py-[10px] text-[12px] md:text-[14px] text-[#000000] bg-white disabled:bg-gray-100 text-center"
                />
                {/* 뒤 4자리 */}
                <div className="relative">
                  <input
                    ref={cardInputRefs.part4}
                    type="text"
                    inputMode="numeric"
                    value={cardNumberParts.part4}
                    onChange={(e) => handleCardNumberPartChange("part4", e.target.value)}
                    onKeyDown={(e) => handleCardNumberKeyDown(e, "part4")}
                    placeholder="1234"
                    maxLength={4}
                    required
                    disabled={submitting}
                    className="w-full h-[40px] rounded-[6px] border border-[#E2E2E2] px-2 md:px-3 py-[10px] text-[12px] md:text-[14px] text-[#000000] bg-white disabled:bg-gray-100 text-center"
                  />
                  {/* 카드 아이콘은 데스크톱에서만 표시 */}
                  {/* <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-1 pointer-events-none">
                    <VisaIcon />
                    <MastercardIcon />
                    <AmexIcon />
                    <DiscoverIcon />
                  </div> */}
                </div>
              </div>
              {/* 모바일에서 카드 아이콘을 아래에 표시 */}
              <div className="md:hidden flex items-center justify-center gap-1 mt-2">
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
          <p className="text-[12px] text-[#808080] mt-2 mb-4">
            * 입력하신 카드 정보는 안전하게 암호화되어 처리됩니다.
          </p>

          {/* 나이스페이 약관 동의 */}
          <div className="border border-[#E2E2E2] rounded-[8px] overflow-hidden">
            {/* 전체 동의 */}
            <div className="px-4 py-3 bg-[#F8F8F8] border-b border-[#E2E2E2]">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={allTermsAgreed}
                    onChange={toggleAllAgreed}
                    disabled={submitting}
                    className="w-5 h-5 appearance-none rounded-[5px] border border-[#B0B0B0] checked:bg-[#00E272] checked:border-[#00E272] cursor-pointer transition-colors disabled:opacity-50"
                  />
                  {allTermsAgreed && (
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
                <span className="text-[14px] font-semibold text-[#252525]">
                  전체 동의
                </span>
              </label>
            </div>

            {/* 개별 약관 */}
            {nicePayTerms.map((term) => (
              <div key={term.type} className="border-b border-[#E2E2E2] last:border-b-0">
                <div className="flex items-center justify-between px-4 py-3">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={term.agreed}
                        onChange={() => toggleTermAgreed(term.type)}
                        disabled={submitting}
                        className="w-4 h-4 appearance-none rounded-[4px] border border-[#B0B0B0] checked:bg-[#00E272] checked:border-[#00E272] cursor-pointer transition-colors disabled:opacity-50"
                      />
                      {term.agreed && (
                        <svg
                          className="absolute top-0 left-0 w-4 h-4 pointer-events-none"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 8L7 11L12 5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="text-[13px] text-[#595959]">
                      {term.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleTermExpanded(term.type)}
                    className="text-[12px] text-[#808080] hover:text-[#252525] transition-colors flex items-center gap-1"
                  >
                    <span>상세보기</span>
                    <ChevronUpIcon className={`w-3 h-3 transition-transform ${term.expanded ? "" : "rotate-180"}`} />
                  </button>
                </div>
                {term.expanded && (
                  <div className="px-4 py-3 bg-[#FAFAFA] border-t border-[#E2E2E2] max-h-[150px] overflow-y-auto">
                    {term.loading ? (
                      <div className="text-[12px] text-[#808080]">약관을 불러오는 중...</div>
                    ) : (
                      <p className="text-[11px] text-[#595959] whitespace-pre-line leading-[1.6]">
                        {term.content}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

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
    </div>
  );
}
