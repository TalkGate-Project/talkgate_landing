"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Project } from "@/types";
import type { ProjectInfo } from "@/types/project";
import { ProjectsService } from "@/lib/projects";
import { AssetsService } from "@/lib/assets";

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
  const [creatingProject, setCreatingProject] = useState(false);
  
  // 프로젝트 생성 폼 상태
  const [newProjectName, setNewProjectName] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const montserratStyle = {
    fontFamily:
      'var(--font-montserrat), "Pretendard Variable", Pretendard, ui-sans-serif, system-ui',
  };

  // 프로젝트 목록 로드
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ProjectsService.list();
      const projectList = response.data?.data || [];
      setProjects(Array.isArray(projectList) ? projectList : []);
    } catch (err) {
      console.error("프로젝트 목록 조회 실패:", err);
      setError("프로젝트 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = (project: ProjectInfo) => {
    // 활성 구독이 없는 프로젝트도 선택 가능 (구독하기 위해)
    const converted = convertToProject(project);
    onSelectProject(converted);
  };

  // 파일 선택 핸들러
  const onPickFile = useCallback(() => fileInputRef.current?.click(), []);
  
  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIconFile(file);
    if (file) {
      setIconPreview(URL.createObjectURL(file));
    } else {
      setIconPreview(null);
    }
  }, []);

  const clearIconFile = useCallback(() => {
    setIconFile(null);
    setIconPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // 파일 타입 감지 헬퍼
  const getFileType = useCallback((file: File): string => {
    if (file.type) return file.type;
    
    const extension = file.name.split(".").pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      svg: "image/svg+xml",
      gif: "image/gif",
      webp: "image/webp",
    };
    
    return mimeTypes[extension || ""] || "image/jpeg";
  }, []);

  // 프로젝트 생성
  const handleCreateProject = async () => {
    if (!newProjectName.trim() || creatingProject) return;

    setCreatingProject(true);
    setCreateError(null);

    try {
      let logoUrl: string | undefined = undefined;

      // 이미지가 있으면 업로드
      if (iconFile) {
        const fileType = getFileType(iconFile);

        // 1. Presigned URL 발급
        const presignedRes = await AssetsService.presignProjectLogo({
          fileName: iconFile.name,
          fileType,
        });

        const presignedData = presignedRes.data?.data;
        if (!presignedData?.uploadUrl) {
          throw new Error("업로드 URL을 받지 못했습니다.");
        }

        // 2. S3에 직접 업로드
        await AssetsService.uploadToS3(presignedData.uploadUrl, iconFile, fileType);

        // 3. fileUrl 저장
        logoUrl = presignedData.fileUrl;
      }

      // 프로젝트 생성
      await ProjectsService.create({
        name: newProjectName.trim(),
        logoUrl,
      });

      // 프로젝트 목록 새로고침
      await fetchProjects();
      
      // 모달 닫기 및 상태 초기화
      setShowCreateModal(false);
      setNewProjectName("");
      clearIconFile();
    } catch (err) {
      console.error("프로젝트 생성 실패:", err);
      setCreateError("프로젝트 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setCreatingProject(false);
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    if (creatingProject) return;
    setShowCreateModal(false);
    setNewProjectName("");
    clearIconFile();
    setCreateError(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1192px] mx-auto pt-[40px] md:pt-[74px] pb-12 md:pb-24 px-4">
        {/* Title Section */}
        <h1 className="font-bold text-[24px] md:text-[32px] leading-[150%] text-center tracking-[-0.03em] text-[#252525] !mb-3">
          구독할 프로젝트를 선택하세요
        </h1>
        <p className="font-normal text-[14px] md:text-[16px] leading-[150%] text-center tracking-[-0.02em] text-[#595959] !mb-[40px] md:!mb-[67px]">
          플랜을 적용할 프로젝트를 선택하거나 새로운 프로젝트를 생성하세요.
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-[16px] text-[#808080]">프로젝트 목록을 불러오는 중...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-[16px] text-red-500 mb-4">{error}</div>
            <button
              onClick={fetchProjects}
              className="px-6 py-2 bg-[#252525] text-white rounded-full text-[14px] font-medium hover:bg-[#3a3a3a] transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
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
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="min-h-[200px] md:h-[225px] rounded-[14px] bg-[#F8F8F8] border border-[#E2E2E2] p-4 md:p-6 cursor-pointer hover:shadow-lg hover:border-[#00E272] transition-all"
                    onClick={() => handleSelectProject(p)}
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

            {/* Empty State */}
            {projects.length === 0 && (
              <div className="text-center py-10">
                <p className="text-[16px] text-[#808080]">
                  아직 프로젝트가 없습니다. 새 프로젝트를 생성해주세요.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />
          <div className="relative bg-white rounded-[14px] shadow-[0px_13px_61px_rgba(169,169,169,0.37)] w-full max-w-[500px] p-5 md:p-7">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-semibold text-[#000]">
                새 프로젝트 생성
              </h2>
              <button
                aria-label="close"
                className="cursor-pointer w-6 h-6 grid place-items-center"
                onClick={handleCloseModal}
                disabled={creatingProject}
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

            {/* 브랜드 아이콘 영역 */}
            <div className="rounded-[8px] bg-[#F8F8F8] px-4 py-4 mb-4">
              <div className="text-[14px] font-medium text-[#252525] mb-3">브랜드 아이콘</div>
              <div className="flex items-center gap-4">
                {/* 아이콘 프리뷰 / 업로드 버튼 */}
                <div
                  className={`relative w-[80px] h-[80px] rounded-[12px] ${
                    iconPreview ? "border border-dashed border-[#E2E2E2]" : "border-2 border-dashed border-[#E2E2E2]"
                  } bg-white overflow-hidden cursor-pointer grid place-items-center hover:border-[#00E272] transition-colors`}
                  onClick={onPickFile}
                >
                  {iconPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={iconPreview} alt="preview" className="w-full h-full object-cover" />
                      {/* 삭제 버튼 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearIconFile();
                        }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 3L9 9M9 3L3 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 5V19M19 12L5 12"
                          stroke="#B0B0B0"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="text-[11px] text-[#B0B0B0]">업로드</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-[#808080] leading-[1.5]">
                    PNG, JPG, SVG 파일<br />
                    (최대 5MB) · 정사각형 이미지 권장
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                onChange={onFileChange}
              />
            </div>

            {/* 프로젝트 이름 영역 */}
            <div className="rounded-[8px] bg-[#F8F8F8] px-4 py-4 mb-4">
              <label className="block text-[14px] font-medium text-[#252525] mb-2">
                프로젝트 이름 <span className="text-[#F00]">*</span>
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="프로젝트 이름을 입력하세요"
                className="w-full h-[40px] rounded-[5px] border border-[#E2E2E2] px-3 text-[14px] text-[#000] bg-white focus:outline-none focus:border-[#00E272] transition-colors"
                disabled={creatingProject}
              />
            </div>

            {/* 에러 메시지 */}
            {createError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[14px]">
                {createError}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-end gap-3">
              <button
                className="cursor-pointer h-[40px] px-5 rounded-[8px] border border-[#E2E2E2] text-[14px] font-semibold text-[#252525] bg-white hover:bg-[#F8F8F8] transition-colors disabled:opacity-50"
                onClick={handleCloseModal}
                disabled={creatingProject}
              >
                취소
              </button>
              <button
                className="cursor-pointer h-[40px] px-5 rounded-[8px] bg-[#252525] text-white text-[14px] font-semibold hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || creatingProject}
              >
                {creatingProject ? "생성 중..." : "생성"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
