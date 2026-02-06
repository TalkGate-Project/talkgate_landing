"use client";

import { useState } from "react";
import { showErrorModal } from "@/lib/errorModalEvents";

export default function TestContent() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[32px] font-bold text-[#252525] mb-2">
          UI 컴포넌트 테스트 페이지
        </h1>
        <p className="text-[16px] text-[#808080] mb-12">
          이 페이지에서 프로젝트의 대표적인 스타일과 컴포넌트를 테스트할 수 있습니다.
        </p>

        {/* 색상 팔레트 */}
        <section className="mb-12">
          <h2 className="text-[24px] font-semibold text-[#252525] mb-6">
            색상 팔레트
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[#252525]" />
              <p className="text-[14px] font-medium text-[#252525]">Primary Dark</p>
              <p className="text-[12px] text-[#808080]">#252525</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[#00E272]" />
              <p className="text-[14px] font-medium text-[#252525]">Success Green</p>
              <p className="text-[12px] text-[#808080]">#00E272</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[#D83232]" />
              <p className="text-[14px] font-medium text-[#252525]">Error Red</p>
              <p className="text-[12px] text-[#808080]">#D83232</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[#3B82F6]" />
              <p className="text-[14px] font-medium text-[#252525]">Info Blue</p>
              <p className="text-[12px] text-[#808080]">#3B82F6</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[#808080]" />
              <p className="text-[14px] font-medium text-[#252525]">Neutral 50</p>
              <p className="text-[12px] text-[#808080]">#808080</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[#E2E2E2]" />
              <p className="text-[14px] font-medium text-[#252525]">Border Gray</p>
              <p className="text-[12px] text-[#808080]">#E2E2E2</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-[#F8F8F8]" />
              <p className="text-[14px] font-medium text-[#252525]">Background</p>
              <p className="text-[12px] text-[#808080]">#F8F8F8</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-white border border-[#E2E2E2]" />
              <p className="text-[14px] font-medium text-[#252525]">White</p>
              <p className="text-[12px] text-[#808080]">#FFFFFF</p>
            </div>
          </div>
        </section>

        {/* 타이포그래피 */}
        <section className="mb-12">
          <h2 className="text-[24px] font-semibold text-[#252525] mb-6">
            타이포그래피
          </h2>
          <div className="space-y-4 p-6 bg-[#F8F8F8] rounded-lg">
            <div>
              <p className="text-[12px] text-[#808080] mb-1">Heading 1 - 32px Bold</p>
              <h1 className="text-[32px] font-bold text-[#252525]">
                복잡한 고민 없이, 모든 기능을 지금 바로 시작하세요.
              </h1>
            </div>
            <div>
              <p className="text-[12px] text-[#808080] mb-1">Heading 2 - 24px Semibold</p>
              <h2 className="text-[24px] font-semibold text-[#252525]">
                가장 합리적인 가격으로 우리 팀의 성장을 가속화하세요.
              </h2>
            </div>
            <div>
              <p className="text-[12px] text-[#808080] mb-1">Heading 3 - 18px Semibold</p>
              <h3 className="text-[18px] font-semibold text-[#252525]">
                결제 수단 등록
              </h3>
            </div>
            <div>
              <p className="text-[12px] text-[#808080] mb-1">Body - 16px Normal</p>
              <p className="text-[16px] font-normal text-[#595959]">
                이 텍스트는 본문 텍스트 예시입니다. 다양한 상황에서 사용됩니다.
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[#808080] mb-1">Caption - 14px Medium</p>
              <p className="text-[14px] font-medium text-[#808080]">
                이 텍스트는 캡션 또는 보조 텍스트 예시입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 버튼 스타일 */}
        <section className="mb-12">
          <h2 className="text-[24px] font-semibold text-[#252525] mb-6">
            버튼 스타일
          </h2>
          <div className="space-y-6">
            {/* Primary Buttons */}
            <div>
              <p className="text-[14px] font-medium text-[#808080] mb-3">Primary Buttons</p>
              <div className="flex flex-wrap gap-4">
                <button className="h-[40px] px-6 rounded-[8px] bg-[#252525] text-white text-[14px] font-semibold hover:bg-[#3a3a3a] transition-colors">
                  기본 버튼
                </button>
                <button className="h-[40px] px-6 rounded-[8px] bg-[#00E272] text-white text-[14px] font-semibold hover:bg-[#00c964] transition-colors">
                  성공 버튼
                </button>
                <button className="h-[40px] px-6 rounded-[8px] bg-[#D83232] text-white text-[14px] font-semibold hover:bg-[#c22929] transition-colors">
                  위험 버튼
                </button>
                <button className="h-[40px] px-6 rounded-[8px] bg-[#3B82F6] text-white text-[14px] font-semibold hover:bg-[#2563eb] transition-colors">
                  정보 버튼
                </button>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div>
              <p className="text-[14px] font-medium text-[#808080] mb-3">Secondary Buttons</p>
              <div className="flex flex-wrap gap-4">
                <button className="h-[40px] px-6 rounded-[8px] border border-[#E2E2E2] bg-white text-[#252525] text-[14px] font-semibold hover:bg-[#F8F8F8] transition-colors">
                  테두리 버튼
                </button>
                <button className="h-[40px] px-6 rounded-[8px] border border-[#00E272] bg-white text-[#00E272] text-[14px] font-semibold hover:bg-[#00E272]/10 transition-colors">
                  성공 테두리
                </button>
                <button className="h-[40px] px-6 rounded-[8px] bg-[#F8F8F8] text-[#252525] text-[14px] font-semibold hover:bg-[#EDEDED] transition-colors">
                  Ghost 버튼
                </button>
              </div>
            </div>

            {/* Disabled State */}
            <div>
              <p className="text-[14px] font-medium text-[#808080] mb-3">Disabled State</p>
              <div className="flex flex-wrap gap-4">
                <button
                  disabled
                  className="h-[40px] px-6 rounded-[8px] bg-[#252525] text-white text-[14px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  비활성화 버튼
                </button>
                <button
                  disabled
                  className="h-[40px] px-6 rounded-[8px] border border-[#E2E2E2] bg-white text-[#252525] text-[14px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  비활성화 테두리
                </button>
              </div>
            </div>

            {/* Size Variants */}
            <div>
              <p className="text-[14px] font-medium text-[#808080] mb-3">Size Variants</p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="h-[34px] px-4 rounded-[5px] bg-[#252525] text-white text-[13px] font-semibold">
                  Small
                </button>
                <button className="h-[40px] px-6 rounded-[8px] bg-[#252525] text-white text-[14px] font-semibold">
                  Medium
                </button>
                <button className="h-[48px] px-8 rounded-[10px] bg-[#252525] text-white text-[16px] font-semibold">
                  Large
                </button>
              </div>
            </div>

            {/* Pill Buttons */}
            <div>
              <p className="text-[14px] font-medium text-[#808080] mb-3">Pill Buttons</p>
              <div className="flex flex-wrap gap-4">
                <button className="h-[40px] px-6 rounded-full bg-[#252525] text-white text-[14px] font-semibold">
                  Pill 버튼
                </button>
                <button className="h-[40px] px-6 rounded-full border border-[#E2E2E2] bg-white text-[#252525] text-[14px] font-semibold">
                  Pill 테두리
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 입력 필드 */}
        <section className="mb-12">
          <h2 className="text-[24px] font-semibold text-[#252525] mb-6">
            입력 필드
          </h2>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-[14px] font-medium text-[#252525] mb-2">
                기본 입력 필드
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="입력해주세요"
                className="w-full h-[40px] rounded-[5px] border border-[#E2E2E2] px-3 text-[14px] text-[#252525] placeholder:text-[#B0B0B0] focus:outline-none focus:border-[#00E272] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#252525] mb-2">
                에러 상태
              </label>
              <input
                type="text"
                placeholder="에러 상태 입력 필드"
                className="w-full h-[40px] rounded-[5px] border border-[#D83232] px-3 text-[14px] text-[#252525] placeholder:text-[#B0B0B0] focus:outline-none"
              />
              <p className="mt-1 text-[12px] text-[#D83232]">필수 입력 항목입니다.</p>
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#252525] mb-2">
                비활성화
              </label>
              <input
                type="text"
                disabled
                placeholder="비활성화된 입력 필드"
                className="w-full h-[40px] rounded-[5px] border border-[#E2E2E2] px-3 text-[14px] text-[#808080] bg-[#F8F8F8] cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* 카드 스타일 */}
        <section className="mb-12">
          <h2 className="text-[24px] font-semibold text-[#252525] mb-6">
            카드 스타일
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[14px] bg-white border border-[#E2E2E2]">
              <h3 className="text-[18px] font-semibold text-[#252525] mb-2">기본 카드</h3>
              <p className="text-[14px] text-[#808080]">
                기본적인 카드 스타일입니다.
              </p>
            </div>
            <div className="p-6 rounded-[14px] bg-[#F8F8F8]">
              <h3 className="text-[18px] font-semibold text-[#252525] mb-2">배경 카드</h3>
              <p className="text-[14px] text-[#808080]">
                배경색이 있는 카드 스타일입니다.
              </p>
            </div>
            <div className="p-6 rounded-[14px] bg-white border-2 border-[#00E272]">
              <h3 className="text-[18px] font-semibold text-[#252525] mb-2">강조 카드</h3>
              <p className="text-[14px] text-[#808080]">
                강조된 테두리가 있는 카드입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 뱃지 & 태그 */}
        <section className="mb-12">
          <h2 className="text-[24px] font-semibold text-[#252525] mb-6">
            뱃지 & 태그
          </h2>
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E2E2E2] text-[12px] font-medium text-[#595959]">
              기본 뱃지
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#00E272]/10 text-[12px] font-medium text-[#00E272]">
              성공
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#D83232]/10 text-[12px] font-medium text-[#D83232]">
              에러
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#3B82F6]/10 text-[12px] font-medium text-[#3B82F6]">
              정보
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-[5px] bg-[#252525] text-[12px] font-semibold text-white">
              Pro
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-[5px] border border-[#E2E2E2] text-[12px] font-medium text-[#808080]">
              Basic
            </span>
          </div>
        </section>

        {/* 모달 테스트 */}
        <section className="mb-12">
          <h2 className="text-[24px] font-semibold text-[#252525] mb-6">
            모달 테스트
          </h2>
          <div className="p-6 bg-[#F8F8F8] rounded-lg">
            <p className="text-[14px] text-[#808080] mb-6">
              아래 버튼을 클릭하여 다양한 타입의 모달을 테스트해보세요.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* Error Modal */}
              <button
                onClick={() =>
                  showErrorModal({
                    type: "error",
                    title: "오류 발생",
                    headline: "요청을 처리할 수 없습니다.",
                    description: "잠시 후 다시 시도해주세요.\n문제가 지속되면 고객센터로 문의해주세요.",
                    confirmText: "확인",
                    hideCancel: true,
                  })
                }
                className="h-[40px] px-6 rounded-[8px] bg-[#D83232] text-white text-[14px] font-semibold hover:bg-[#c22929] transition-colors"
              >
                에러 모달
              </button>

              {/* Success Modal */}
              <button
                onClick={() =>
                  showErrorModal({
                    type: "success",
                    title: "완료",
                    headline: "작업이 완료되었습니다!",
                    description: "변경사항이 성공적으로 저장되었습니다.",
                    confirmText: "확인",
                    hideCancel: true,
                  })
                }
                className="h-[40px] px-6 rounded-[8px] bg-[#00E272] text-white text-[14px] font-semibold hover:bg-[#00c964] transition-colors"
              >
                성공 모달
              </button>

              {/* Info Modal */}
              <button
                onClick={() =>
                  showErrorModal({
                    type: "info",
                    title: "알림",
                    headline: "새로운 기능이 추가되었습니다!",
                    description: "지금 바로 새로운 기능을 확인해보세요.",
                    confirmText: "확인하기",
                    cancelText: "나중에",
                  })
                }
                className="h-[40px] px-6 rounded-[8px] bg-[#3B82F6] text-white text-[14px] font-semibold hover:bg-[#2563eb] transition-colors"
              >
                정보 모달
              </button>

              {/* Confirm Modal */}
              <button
                onClick={() =>
                  showErrorModal({
                    type: "error",
                    title: "삭제 확인",
                    headline: "정말 삭제하시겠습니까?",
                    description: "삭제된 데이터는 복구할 수 없습니다.",
                    confirmText: "삭제",
                    cancelText: "취소",
                    onConfirm: () => {},
                    onCancel: () => {},
                  })
                }
                className="h-[40px] px-6 rounded-[8px] border border-[#D83232] bg-white text-[#D83232] text-[14px] font-semibold hover:bg-[#D83232]/10 transition-colors"
              >
                확인 모달 (Confirm)
              </button>

              {/* Success with callback */}
              <button
                onClick={() =>
                  showErrorModal({
                    type: "success",
                    title: "구독 완료",
                    headline: "구독이 완료되었습니다!",
                    description: "프로젝트에 Pro 플랜이 적용되었습니다.",
                    confirmText: "확인",
                    hideCancel: true,
                    onConfirm: () => {},
                  })
                }
                className="h-[40px] px-6 rounded-[8px] bg-[#252525] text-white text-[14px] font-semibold hover:bg-[#3a3a3a] transition-colors"
              >
                구독 완료 모달
              </button>

              {/* Persistent Modal */}
              <button
                onClick={() =>
                  showErrorModal({
                    type: "info",
                    title: "필수 동의",
                    headline: "이용약관에 동의해주세요.",
                    description: "서비스 이용을 위해 약관 동의가 필요합니다.",
                    confirmText: "동의",
                    cancelText: null,
                    hideCancel: true,
                    persistent: true,
                    hideCloseButton: true,
                  })
                }
                className="h-[40px] px-6 rounded-[8px] border border-[#E2E2E2] bg-white text-[#252525] text-[14px] font-semibold hover:bg-[#F8F8F8] transition-colors"
              >
                강제 모달 (닫기 불가)
              </button>

              {/* Plan Change Modal */}
              <button
                onClick={() =>
                  showErrorModal({
                    type: "info",
                    title: "플랜 변경",
                    headline: "Basic 구독상품을 변경할까요?",
                    description: "현재 사용 중인 기능은 이번 결제 주기 종료 시까지 그대로 유지되며,\n변경된 상품은 다음 갱신일에 적용됩니다.",
                    confirmText: "변경",
                    cancelText: "취소",
                    onConfirm: () => {},
                    onCancel: () => {},
                  })
                }
                className="h-[40px] px-6 rounded-[8px] bg-[#3B82F6] text-white text-[14px] font-semibold hover:bg-[#2563eb] transition-colors"
              >
                플랜 변경 확인 모달
              </button>
            </div>
          </div>
        </section>

        {/* 상태 인디케이터 */}
        <section className="mb-12">
          <h2 className="text-[24px] font-semibold text-[#252525] mb-6">
            상태 인디케이터
          </h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00E272]" />
              <span className="text-[14px] text-[#252525]">구독 활성</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#D83232]" />
              <span className="text-[14px] text-[#252525]">구독 필요</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="text-[14px] text-[#252525]">대기 중</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#808080]" />
              <span className="text-[14px] text-[#252525]">비활성</span>
            </div>
          </div>
        </section>

        {/* 로딩 상태 */}
        <section className="mb-12">
          <h2 className="text-[24px] font-semibold text-[#252525] mb-6">
            로딩 상태
          </h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#E2E2E2] border-t-[#252525] rounded-full animate-spin" />
              <span className="text-[14px] text-[#808080]">로딩 중...</span>
            </div>
            <button
              disabled
              className="h-[40px] px-6 rounded-[8px] bg-[#252525] text-white text-[14px] font-semibold disabled:opacity-60 flex items-center gap-2"
            >
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              처리 중...
            </button>
          </div>
        </section>

        {/* 토글 */}
        <section className="mb-12">
          <h2 className="text-[24px] font-semibold text-[#252525] mb-6">
            토글 버튼 그룹
          </h2>
          <div className="inline-flex p-1 bg-[#EDEDED] rounded-full">
            <button className="px-6 py-2 rounded-full bg-[#252525] text-white text-[14px] font-semibold transition-all">
              월마다
            </button>
            <button className="px-6 py-2 rounded-full text-[#808080] text-[14px] font-semibold hover:text-[#252525] transition-all">
              3개월마다
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
