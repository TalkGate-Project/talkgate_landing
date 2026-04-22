"use client";

import { useState } from "react";
import { ProjectPrivacyConsentService } from "@/lib/projectPrivacyConsent";
import { isForbiddenError, isUnauthorizedError } from "@/lib/apiClient";

interface ProjectPrivacyConsentModalProps {
  open: boolean;
  projectId: string | number;
  onAgreed: () => void;
}

/**
 * 개인정보 처리 위탁 계약 동의 모달
 *
 * 프로젝트 어드민이 동의를 완료해야 하는 필수 모달입니다.
 * - 닫기 버튼 없음
 * - ESC, 배경 클릭으로 닫을 수 없음
 * - 체크박스 체크 후 확인 버튼 클릭 시에만 진행 가능
 */
export default function ProjectPrivacyConsentModal({
  open,
  projectId,
  onAgreed,
}: ProjectPrivacyConsentModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!open) return null;

  const handleConfirm = async () => {
    if (!agreed || submitting) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      await ProjectPrivacyConsentService.agree(projectId);
      onAgreed();
    } catch (err: unknown) {
      if (isUnauthorizedError(err)) {
        setErrorMessage("로그인이 만료되었습니다. 다시 로그인해주세요.");
      } else if (isForbiddenError(err)) {
        setErrorMessage("프로젝트 관리자 권한이 필요합니다.");
      } else {
        const errObj = err as { status?: number; data?: { code?: string } };
        if (errObj?.status === 409 || errObj?.data?.code === "ALREADY_EXISTS") {
          // 이미 동의된 상태라면 그대로 진행
          onAgreed();
          return;
        }
        setErrorMessage("동의 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <div
        className="relative bg-white rounded-[14px] shadow-[0px_13px_61px_rgba(169,169,169,0.37)] w-full max-w-[640px] max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-consent-title"
      >
        {/* Header */}
        <div className="px-5 md:px-7 pt-5 md:pt-6">
          <h2
            id="privacy-consent-title"
            className="text-[18px] font-semibold text-[#000]"
          >
            개인정보 처리 위탁 계약 동의
          </h2>
        </div>

        <p className="mt-6 md:mt-8 mb-4 md:mb-6 text-[14px] md:text-[16px] text-center font-medium text-[#252525] px-5 md:px-7">
          약관에 대한 동의를 완료해주세요.
        </p>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 md:px-7 pb-4 space-y-4">
          <div className="rounded-[8px] bg-[#F8F8F8] px-4 md:px-6 py-4 max-h-[260px] overflow-y-auto">
            <div className="text-[14px] font-semibold text-[#252525] mb-3">
              개인정보 처리위탁 계약서
            </div>
            <div className="text-[13px] leading-[1.7] text-[#595959] whitespace-pre-line">
              {`본 개인정보 처리위탁 계약(이하 "본 계약")은 talkgate 서비스 운영사 주식회사 핑크코브라(이하 "수탁자")와 서비스를 이용하는 고객사 또는 이용자(이하 "위탁자") 간 개인정보 처리위탁에 관한 사항을 정함을 목적으로 한다.

제1조 (목적)
본 계약은 위탁자가 제공하거나 연동한 개인정보를 수탁자가 처리함에 있어 관련 법령을 준수하고, 개인정보의 안전한 처리를 확보하기 위하여 필요한 사항을 규정함을 목적으로 한다.

제2조 (위탁 업무의 내용 및 처리 목적)
수탁자는 위탁자가 제공하는 개인정보를 다음 각 호의 목적으로만 처리한다.
1. 고객 정보 저장 및 관리
2. CRM 시스템 운영 및 유지보수
3. 보안 관리 및 장애 대응

제3조 (위탁 기간)
본 계약의 위탁 기간은 서비스 이용 계약 종료 시까지로 한다.

제4조 (재위탁 제한)
수탁자는 위탁자의 사전 서면 동의 없이 위탁받은 개인정보를 제3자에게 재위탁할 수 없다.

제5조 (개인정보의 안전성 확보 조치)
수탁자는 개인정보 보호법 등 관련 법령에서 정하는 바에 따라 개인정보의 안전한 처리를 위하여 필요한 기술적·관리적 보호조치를 취한다.

제6조 (수탁자의 의무)
① 수탁자는 위탁 목적 범위 내에서만 개인정보를 처리하며, 목적 외 이용 또는 제3자 제공을 하지 않는다.
② 수탁자는 본 계약 종료 시 위탁받은 개인정보를 지체 없이 파기하거나 위탁자에게 반환한다.

제7조 (손해배상)
수탁자는 본 계약을 위반하여 위탁자 또는 정보주체에게 손해를 발생시킨 경우 관련 법령에 따라 손해를 배상한다.`}
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-[8px] bg-[#F8F8F8] px-4 md:px-6 py-4 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="sr-only peer"
            />
            <span
              className={`flex-shrink-0 w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors ${
                agreed
                  ? "bg-[#00E272] border-[#00E272]"
                  : "bg-white border-[#E2E2E2]"
              }`}
              aria-hidden
            >
              {agreed && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.5 6L5 8.5L9.5 3.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <span className="text-[14px] font-medium text-[#252525] leading-[1.5]">
              개인정보 처리 위탁 계약에 동의합니다.{" "}
              <span className="text-[#00E272]">(필수)</span>
            </span>
          </label>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[8px] text-red-600 text-[14px]">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E2E2E2] px-5 md:px-7 py-4 flex items-center justify-end">
          <button
            type="button"
            className="cursor-pointer h-[40px] px-5 rounded-[8px] bg-[#252525] text-white text-[14px] font-semibold hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={!agreed || submitting}
          >
            {submitting ? "처리 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
