"use client";

import { useState } from "react";
import type { Project } from "@/types";

interface ProjectSelectStepProps {
  onSelectProject: (project: Project) => void;
}

// Dev 환경 여부 확인
const isDev = process.env.NODE_ENV === "development";

// Dev 모드 예시 프로젝트
const DEV_SAMPLE_PROJECTS: Project[] = [
  {
    id: "dev-project-1",
    name: "거래소 텔레마케팅 관리",
    memberCount: 261,
    assignedCustomerCount: 16,
    todayScheduleCount: 22,
  },
  {
    id: "dev-project-2",
    name: "스마트 영업 관리",
    memberCount: 0,
    assignedCustomerCount: 0,
    todayScheduleCount: 0,
  },
];

export default function ProjectSelectStep({
  onSelectProject,
}: ProjectSelectStepProps) {
  // Lazy initialization: 초기 프로젝트 목록을 한 번만 계산
  const [projects] = useState<Project[]>(() => {
    // TODO: API 호출로 프로젝트 목록 가져오기
    // Dev 환경에서는 예시 프로젝트 표시
    return isDev ? DEV_SAMPLE_PROJECTS : [];
  });

  const [showCreateModal, setShowCreateModal] = useState(false);

  const montserratStyle = {
    fontFamily:
      'var(--font-montserrat), "Pretendard Variable", Pretendard, ui-sans-serif, system-ui',
  };

  // useEffect 제거 - 더 이상 필요 없음

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1192px] mx-auto pt-[40px] md:pt-[74px] pb-12 md:pb-24 px-4">
        {/* Title Section */}
        <h1 className="font-bold text-[24px] md:text-[32px] leading-[150%] text-center tracking-[-0.03em] text-[#252525] !mb-3">
          당신의 아이디어를
          <br />
          프로젝트로 바로 실현하세요.
        </h1>
        <p className="font-normal text-[14px] md:text-[16px] leading-[150%] text-center tracking-[-0.02em] text-[#595959] !mb-[40px] md:!mb-[67px]">
          간단한 생성만으로 새로운 업무 환경이 열립니다.
        </p>

        {/* Create New Project Card - 중앙 단독 배치 */}
        <div className="flex justify-center mb-6 md:mb-[32px]">
          <div
            className="w-full h-[180px] md:h-[225px] rounded-[14px] border-2 border-dashed border-[#E2E2E2] hover:border-[#00E272] transition-colors duration-200 bg-white flex flex-col items-center justify-center cursor-pointer px-4"
            onClick={() => setShowCreateModal(true)}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#EDEDED] grid place-items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                <path
                  d="M12 5V19M19 12L5 12"
                  stroke="#808080"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="mt-4 md:mt-6 text-[16px] md:text-[18px] font-semibold leading-[21px] text-[#000000]">
              새 프로젝트 생성
            </div>
            <div className="mt-2 md:mt-4 text-[14px] md:text-[16px] font-medium leading-[19px] tracking-[-0.04em] text-[#808080] text-center">
              새로운 고객관리 프로젝트를 만들어보세요
            </div>
          </div>
        </div>

        {/* Existing Projects - 2열 그리드 */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-[48px] mb-8 md:mb-[54px]">
            {projects.map((p: Project) => (
              <div
                key={p.id}
                className="min-h-[200px] md:h-[225px] rounded-[14px] bg-[#F8F8F8] border border-[#E2E2E2] p-4 md:p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectProject(p)}
              >
                {/* Project Header */}
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
                  {p.logoUrl ? (
                    <img
                      src={p.logoUrl}
                      alt={`${p.name} 로고`}
                      width={28}
                      height={28}
                      className="w-6 h-6 md:w-7 md:h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#EDEDED]" />
                  )}
                  <div className="text-[16px] md:text-[18px] font-semibold leading-[21px] text-[#000000] truncate flex-1 min-w-0">
                    {p.name}
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1 rounded-[30px] bg-[#E2E2E2]">
                    <span className="text-[11px] md:text-[12px] font-medium leading-[14px] text-[#595959] opacity-80">
                      멤버 {p.memberCount ?? 0}명
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#D83232]" />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 md:gap-5">
                  <div className="rounded-[14px] bg-white shadow-[6px_6px_54px_rgba(0,0,0,0.05)] p-3 md:p-5 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] md:text-[16px] font-semibold leading-[19px] text-[#252525] mb-1 md:mb-2">
                        나에게 할당된 고객
                      </div>
                      <div
                        className="text-[20px] md:text-[28px] font-bold leading-[34px] tracking-[1px] text-[#252525]"
                        style={montserratStyle}
                      >
                        {p.assignedCustomerCount ?? 0}건
                      </div>
                    </div>
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 md:w-[60px] md:h-[60px] flex-shrink-0"
                    >
                      <path
                        opacity="0.1"
                        d="M48 0C54.6273 0.000125631 60 5.37266 60 12V48C59.9999 54.6272 54.6272 59.9999 48 60H12C5.37268 60 0.000147504 54.6273 0 48V12C0 5.37258 5.37258 4.83108e-07 12 0H48Z"
                        fill="#B0B0B0"
                      />
                      <path
                        opacity="0.587821"
                        d="M38 24.6663C40.2089 24.6665 42 26.4573 42 28.6663C42 30.8753 40.2089 32.666 38 32.6663C35.7909 32.6663 34 30.8754 34 28.6663C34.0001 26.4572 35.7909 24.6663 38 24.6663ZM26 17.9993C28.9453 17.9995 31.333 20.3879 31.333 23.3333C31.3329 26.2786 28.9453 28.6661 26 28.6663C23.0546 28.6663 20.6661 26.2787 20.666 23.3333C20.666 20.3877 23.0545 17.9993 26 17.9993Z"
                        fill="#B0B0B0"
                      />
                      <path
                        d="M25.9775 31.3328C32.3613 31.3328 37.6064 34.3909 37.9971 40.9333C38.0126 41.1942 37.9971 41.9996 36.9961 41.9998H14.9707C14.6364 41.9998 13.9733 41.2791 14.001 40.9324C14.5178 34.569 19.6825 31.3329 25.9775 31.3328ZM37.4697 34.0017C42.0109 34.0518 45.7186 36.3468 45.998 41.199C46.0093 41.3944 45.9982 41.9994 45.2754 41.9998H40.1338C40.1337 38.9993 39.1425 36.2297 37.4697 34.0017Z"
                        fill="#B0B0B0"
                      />
                    </svg>
                  </div>
                  <div className="rounded-[14px] bg-white shadow-[6px_6px_54px_rgba(0,0,0,0.05)] p-3 md:p-5 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] md:text-[16px] font-semibold leading-[19px] text-[#252525] mb-1 md:mb-2">
                        오늘 예약 일정
                      </div>
                      <div
                        className="text-[20px] md:text-[28px] font-bold leading-[34px] tracking-[1px] text-[#252525]"
                        style={montserratStyle}
                      >
                        {p.todayScheduleCount ?? 0}건
                      </div>
                    </div>
                    <svg
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 md:w-[60px] md:h-[60px] flex-shrink-0"
                    >
                      <path
                        opacity="0.1"
                        d="M48 0C54.6273 0.000125631 60 5.37266 60 12V48C59.9999 54.6272 54.6272 59.9999 48 60H12C5.37268 60 0.000147504 54.6273 0 48V12C0 5.37258 5.37258 4.83108e-07 12 0H48Z"
                        fill="#B0B0B0"
                      />
                      <path
                        d="M30.0002 17.2C25.361 17.2 21.6002 21.498 21.6002 26.8V32.5372L20.6103 33.6686C20.2099 34.1262 20.0901 34.8144 20.3068 35.4122C20.5235 36.0101 21.034 36.4 21.6002 36.4H38.4002C38.9665 36.4 39.477 36.0101 39.6937 35.4122C39.9104 34.8144 39.7906 34.1262 39.3902 33.6686L38.4002 32.5372V26.8C38.4002 21.498 34.6394 17.2 30.0002 17.2Z"
                        fill="#B0B0B0"
                      />
                      <path
                        d="M30.0002 42.8C27.6806 42.8 25.8002 40.6509 25.8002 38H34.2002C34.2002 40.6509 32.3198 42.8 30.0002 42.8Z"
                        fill="#B0B0B0"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subscribe Button */}
        <div className="flex justify-center mt-8 md:mt-[54px]">
          <button
            className="w-full max-w-[360px] h-[48px] md:h-[52px] flex items-center justify-center bg-[#000000] rounded-[30px] text-[16px] md:text-[18px] font-semibold leading-[150%] tracking-[-0.02em] text-white hover:bg-[#252525] transition-colors"
            onClick={() => {
              // TODO: 구독 버튼 클릭 처리
              alert("구독 기능은 준비 중입니다.");
            }}
          >
            구독하기 ({projects.length})
          </button>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(project) => {
            setShowCreateModal(false);
            onSelectProject(project);
          }}
        />
      )}
    </div>
  );
}

// Simplified Create Project Modal (basic version)
function CreateProjectModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (project: Project) => void;
}) {
  const [projectName, setProjectName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!projectName.trim() || submitting) return;

    setSubmitting(true);
    try {
      // TODO: API 호출로 프로젝트 생성
      // 임시로 모의 프로젝트 생성
      const newProject: Project = {
        id: Date.now().toString(),
        name: projectName.trim(),
        memberCount: 0,
        assignedCustomerCount: 0,
        todayScheduleCount: 0,
      };

      await new Promise((resolve) => setTimeout(resolve, 500));
      onCreated(newProject);
    } catch (error) {
      console.error("Project creation failed:", error);
      alert("프로젝트 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-[14px] shadow-[0px_13px_61px_rgba(169,169,169,0.37)] w-full max-w-[440px] p-5 md:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-[16px] md:text-[18px] font-semibold text-[#000]">
            새 프로젝트 생성
          </h2>
          <button
            aria-label="close"
            className="cursor-pointer w-6 h-6 grid place-items-center"
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

        {/* Body */}
        <div className="mb-4 md:mb-6">
          <label className="block text-[13px] md:text-[14px] font-medium text-[#000] mb-2">
            프로젝트 이름 <span className="text-[#F00]">*</span>
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="프로젝트 이름을 입력하세요"
            className="w-full h-[40px] rounded-[5px] border border-[#E2E2E2] px-3 text-[14px] text-[#000] bg-white"
            disabled={submitting}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 md:gap-3">
          <button
            className="cursor-pointer h-[38px] px-4 md:px-5 rounded-[8px] border border-[#E2E2E2] text-[13px] md:text-[14px] font-semibold text-[#252525] bg-white hover:bg-[#F8F8F8] transition-colors disabled:opacity-50"
            onClick={onClose}
            disabled={submitting}
          >
            취소
          </button>
          <button
            className="cursor-pointer h-[38px] px-4 md:px-5 rounded-[8px] bg-[#252525] text-white text-[13px] md:text-[14px] font-semibold hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!projectName.trim() || submitting}
          >
            {submitting ? "생성 중..." : "생성"}
          </button>
        </div>
      </div>
    </div>
  );
}
