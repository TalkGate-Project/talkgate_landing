"use client";

import { useState, useEffect, useRef } from "react";
import type { Project } from "@/types";
import type { ProjectInfo } from "@/types/project";
import { ProjectsService } from "@/lib/projects";
import CreateProjectModal from "./CreateProjectModal";

interface ProjectSelectStepProps {
  onSelectProject: (project: Project) => void;
  onCreateProject?: () => void;
}

// API 프로젝트를 UI 프로젝트로 변환
function convertToProject(project: ProjectInfo): Project {
  return {
    id: String(project.id),
    name: project.name,
    logoUrl: project.logoUrl,
    memberCount: project.memberCount,
    assignedCustomerCount: project.assignedCustomerCount,
    todayScheduleCount: project.todayScheduleCount,
    useAttendanceMenu: project.useAttendanceMenu,
  };
}

export default function ProjectSelectStep({
  onSelectProject,
}: ProjectSelectStepProps) {
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Animation refs
  const headerRef = useRef<HTMLDivElement>(null);
  const createCardRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [createCardVisible, setCreateCardVisible] = useState(false);
  const [projectsVisible, setProjectsVisible] = useState(false);

  const montserratStyle = {
    fontFamily:
      'var(--font-montserrat), "Pretendard Variable", Pretendard, ui-sans-serif, system-ui',
  };

  // Animation observers
  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '50px' };

    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
          }
        });
      },
      observerOptions
    );

    const createCardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCreateCardVisible(true);
          }
        });
      },
      observerOptions
    );

    const projectsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setProjectsVisible(true);
          }
        });
      },
      observerOptions
    );

    if (headerRef.current) headerObserver.observe(headerRef.current);
    if (createCardRef.current) createCardObserver.observe(createCardRef.current);
    if (projectsRef.current) projectsObserver.observe(projectsRef.current);

    // IntersectionObserver가 트리거되지 않을 경우를 대비해 일정 시간 후 강제로 표시
    const fallbackTimer = setTimeout(() => {
      setHeaderVisible(true);
      setCreateCardVisible(true);
      if (projects.length > 0) {
        setProjectsVisible(true);
      }
    }, 100);

    return () => {
      headerObserver.disconnect();
      createCardObserver.disconnect();
      projectsObserver.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [projects.length]); // projects가 로드되면 observer 재설정

  // 프로젝트 목록 로드
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      // Admin 역할인 프로젝트만 조회 (401 시 자동 로그아웃 비활성화 → pricing 페이지 유지)
      const response = await ProjectsService.listAdmin({ suppressAutoLogout: true });
      const projectList = response.data?.data || [];
      setProjects(Array.isArray(projectList) ? projectList : []);
    } catch (err) {
      console.error("프로젝트 목록 조회 실패:", err);
      setError("프로젝트 목록을 불러오는데 실패했습니다.");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (project: ProjectInfo) => {
    // 활성 구독이 없는 프로젝트도 선택 가능 (구독하기 위해)
    const converted = convertToProject(project);
    onSelectProject(converted);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1192px] mx-auto pt-[40px] md:pt-[74px] pb-12 md:pb-24 px-4">
        {/* Title Section */}
        <div ref={headerRef} className={`pricing-project-header ${headerVisible ? 'animate' : ''}`}>
          <h1 className="font-bold text-[24px] md:text-[32px] leading-[150%] text-center tracking-[-0.03em] text-[#252525] !mb-3">
            구독할 프로젝트를 선택하세요
          </h1>
          <p className="font-normal text-[14px] md:text-[16px] leading-[150%] text-center tracking-[-0.02em] text-[#595959] !mb-[40px] md:!mb-[67px]">
            플랜을 적용할 프로젝트를 선택하거나 새로운 프로젝트를 생성하세요.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#E2E2E2] border-t-[#00E272] rounded-full animate-spin mb-4" />
            <div className="text-[16px] text-[#808080]">프로젝트 목록을 불러오는 중...</div>
          </div>
        )}

        {/* Error State - 에러가 있어도 Content는 표시 */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-4 mb-6">
            <div className="text-[14px] text-red-500 mb-2">{error}</div>
            <button
              onClick={fetchProjects}
              className="px-4 py-2 bg-[#252525] text-white rounded-full text-[12px] font-medium hover:bg-[#3a3a3a] transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Content - loading이 false이면 항상 표시 */}
        {!loading && (
          <>
            {/* Create New Project Card - 중앙 단독 배치 */}
            <div ref={createCardRef} className="flex justify-center mb-6 md:mb-[32px]">
              <div
                className={`w-full h-[180px] md:h-[225px] rounded-[14px] border-2 border-dashed border-[#E2E2E2] hover:border-[#00E272] transition-colors duration-200 bg-white flex flex-col items-center justify-center cursor-pointer px-4 pricing-create-card ${createCardVisible ? 'animate' : ''}`}
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
              <div ref={projectsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-[48px] mb-8 md:mb-[54px]">
                {projects.map((p, index) => (
                  <div
                    key={p.id}
                    className={`min-h-[200px] md:h-[225px] rounded-[14px] bg-[#F8F8F8] border border-[#E2E2E2] p-4 md:p-6 cursor-pointer hover:shadow-lg hover:border-[#00E272] transition-all pricing-project-card ${projectsVisible ? 'animate' : ''}`}
                    onClick={() => handleSelectProject(p)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Project Header */}
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 flex-wrap">
                      {p.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
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
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: p.hasActiveSubscription ? "#00E272" : "#D83232",
                        }}
                        title={p.hasActiveSubscription ? "구독 활성" : "구독 필요"}
                      />
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
          </>
        )}
      </div>

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
