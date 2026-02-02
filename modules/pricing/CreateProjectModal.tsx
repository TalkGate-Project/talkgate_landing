"use client";

import { useState, useRef, useCallback } from "react";
import { ProjectsService } from "@/lib/projects";
import { AssetsService } from "@/lib/assets";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** true면 바깥(백드롭) 클릭 시 모달이 닫히지 않음 */
  persistent?: boolean;
}

// 서브도메인 형식 검증 (영문 소문자, 숫자, 하이픈만 허용)
const SUBDOMAIN_PATTERN = /^[a-z0-9-]+$/;
const PROJECT_NAME_MAX_LENGTH = 20;

function getFileType(file: File): string {
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
}

export default function CreateProjectModal({
  open,
  onClose,
  onSuccess,
  persistent = false,
}: CreateProjectModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: 브랜드 아이콘 + 프로젝트 이름
  const [projectName, setProjectName] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Step 2: 서브도메인
  const [subdomain, setSubdomain] = useState("");
  const [domainChecking, setDomainChecking] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [lastCheckedSubdomain, setLastCheckedSubdomain] = useState("");

  const [createError, setCreateError] = useState<string | null>(null);

  const onPickFile = useCallback(() => fileInputRef.current?.click(), []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIconFile(file);
    if (file) setIconPreview(URL.createObjectURL(file));
    else setIconPreview(null);
  }, []);

  const clearIconFile = useCallback(() => {
    setIconFile(null);
    setIconPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentTarget = e.currentTarget;
    const relatedTarget = e.relatedTarget as Node | null;
    if (!currentTarget.contains(relatedTarget)) setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith("image/")) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  }, []);

  const validateSubdomain = useCallback(async () => {
    setDomainError(null);
    if (!subdomain || subdomain.length < 3) {
      setDomainAvailable(null);
      return;
    }
    if (!SUBDOMAIN_PATTERN.test(subdomain)) {
      setDomainAvailable(false);
      setDomainError("영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.");
      return;
    }
    if (subdomain.startsWith("-") || subdomain.endsWith("-")) {
      setDomainAvailable(false);
      setDomainError("하이픈(-)으로 시작하거나 끝날 수 없습니다.");
      return;
    }
    if (subdomain.length > 30) {
      setDomainAvailable(false);
      setDomainError("서브도메인은 30자를 초과할 수 없습니다.");
      return;
    }
    setLastCheckedSubdomain(subdomain);
    try {
      setDomainChecking(true);
      const res = await ProjectsService.checkSubDomainDuplicate(subdomain);
      const payload = res.data;
      const duplicateInfo = payload?.data;
      const isDuplicate = Boolean(duplicateInfo?.isDuplicate);
      setDomainAvailable(!isDuplicate);
      if (isDuplicate) {
        setDomainError("이미 사용 중인 도메인입니다. 다른 도메인을 입력해주세요.");
      }
    } catch (err: unknown) {
      setDomainAvailable(false);
      const errObj = err as { data?: { message?: string }; message?: string };
      const message = errObj?.data?.message || errObj?.message || "";
      if (message.includes("regular expression") || message.includes("match")) {
        setDomainError("영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.");
      } else if (message) {
        setDomainError(message);
      } else {
        setDomainError("도메인 확인 중 오류가 발생했습니다.");
      }
    } finally {
      setDomainChecking(false);
    }
  }, [subdomain]);

  const canGoNext =
    step === 1
      ? projectName.trim().length > 0
      : Boolean(subdomain && domainAvailable === true);

  const handleSubmit = useCallback(
    async (options?: { skipSubdomain?: boolean }) => {
      if (submitting) return;
      setSubmitting(true);
      setCreateError(null);
      try {
        let logoUrl: string | undefined;
        if (iconFile) {
          const fileType = getFileType(iconFile);
          const presignedRes = await AssetsService.presignProjectLogo({
            fileName: iconFile.name,
            fileType,
          });
          const presignedData = presignedRes.data?.data;
          if (!presignedData?.uploadUrl) {
            throw new Error("업로드 URL을 받지 못했습니다.");
          }
          await AssetsService.uploadToS3(presignedData.uploadUrl, iconFile, fileType);
          logoUrl = presignedData.fileUrl;
        }
        const subDomainValue = options?.skipSubdomain ? undefined : (subdomain || undefined);
        await ProjectsService.create({
          name: projectName.trim(),
          subDomain: subDomainValue,
          logoUrl,
        });
        setProjectName("");
        clearIconFile();
        setSubdomain("");
        setDomainAvailable(null);
        setDomainError(null);
        setStep(1);
        onSuccess?.();
        onClose();
      } catch (err) {
        console.error("프로젝트 생성 실패:", err);
        setCreateError("프로젝트 생성에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, iconFile, projectName, subdomain, clearIconFile, onSuccess, onClose]
  );

  const handleSkip = useCallback(() => {
    setSubdomain("");
    setDomainAvailable(null);
    setDomainError(null);
    handleSubmit({ skipSubdomain: true });
  }, [handleSubmit]);

  const handleCloseModal = useCallback(() => {
    if (submitting) return;
    setStep(1);
    setProjectName("");
    clearIconFile();
    setSubdomain("");
    setDomainAvailable(null);
    setDomainError(null);
    setCreateError(null);
    onClose();
  }, [submitting, clearIconFile, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={persistent ? undefined : handleCloseModal}
      />
      <div className="relative bg-white rounded-[14px] shadow-[0px_13px_61px_rgba(169,169,169,0.37)] w-full max-w-[520px] md:max-w-[640px] max-h-[90vh] flex flex-col md:h-[637px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 md:px-7 pt-5 md:pt-6 pb-0">
          <h2 className="text-[18px] font-semibold text-[#000]">새 프로젝트 생성</h2>
          <button
            aria-label="close"
            className="cursor-pointer w-6 h-6 grid place-items-center"
            onClick={handleCloseModal}
            disabled={submitting}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6M6 6L18 18" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex flex-col items-center mt-8 mb-4 md:mb-6 px-5 md:px-7">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${step >= 1 ? "bg-[#00E272]" : "bg-[#E2E2E2]"}`}
              >
                <span className={`text-[18px] font-semibold leading-none tabular-nums ${step >= 1 ? "text-white" : "text-[#808080]"}`}>1</span>
              </div>
            </div>
            <div className="w-[48px] md:w-[60px] h-px bg-[#E2E2E2] mx-1 flex-shrink-0" aria-hidden />
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center ${step >= 2 ? "bg-[#00E272]" : "bg-[#E2E2E2]"}`}
              >
                <span className={`text-[18px] font-semibold leading-none tabular-nums ${step >= 2 ? "text-white" : "text-[#808080]"}`}>2</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-[52px] pl-2 mt-2">
            <span className={`text-[14px] text-center font-medium ${step >= 1 ? "text-[#00E272]" : "text-[#808080]"}`}>
              기본정보
            </span>
            <span className={`text-[14px] text-center font-medium ${step >= 2 ? "text-[#00E272]" : "text-[#808080]"}`}>
              도메인 설정
            </span>
          </div>
        </div>

        <p className="!mb-4 md:!mb-6 text-[14px] md:text-[16px] text-center font-medium text-[#252525] px-5 md:px-7">
          {step === 1
            ? "프로젝트의 브랜드 아이콘과 이름을 설정해주세요."
            : "프로젝트에서 사용할 서브 도메인을 설정해주세요."}
        </p>

        {/* Content: min-h-0 allows flex child to shrink so overflow-y-auto works when modal has fixed height (web) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 md:px-7 pb-4">
          {step === 1 ? (
            <div className="space-y-4 md:space-y-5">
              {/* 브랜드 아이콘 */}
              <div
                className={`relative rounded-[8px] bg-[#F8F8F8] px-4 md:px-6 py-4 md:min-h-[181px] border-2 border-dashed transition-colors ${
                  isDragging ? "border-[#00E272] bg-[#00E272]/5" : "border-[#E2E2E2]"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-[14px] font-medium text-[#252525] mb-3">브랜드 아이콘</div>
                <div className="flex flex-col items-center">
                  <div
                    className={`relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-[12px] flex-shrink-0 ${
                      iconPreview ? "border border-dashed border-[#E2E2E2]" : "border-2 border-dashed border-[#E2E2E2]"
                    } bg-white overflow-hidden cursor-pointer grid place-items-center hover:border-[#00E272] transition-colors`}
                    onClick={onPickFile}
                  >
                    {iconPreview ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={iconPreview} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearIconFile();
                          }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 3L9 9M9 3L3 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M19 12L5 12" stroke="#B0B0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-[11px] text-[#B0B0B0]">업로드</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-[13px] text-[#808080] leading-[1.5] text-center">
                    PNG, JPG, WEBP 파일 (최대 5MB) · 정사각형 이미지 권장
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="hidden"
                  onChange={onFileChange}
                />
                {isDragging && (
                  <div className="absolute inset-0 rounded-[8px] bg-[#00E272]/10 flex items-center justify-center pointer-events-none z-10">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#00E272] flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-[16px] font-semibold text-[#00E272]">여기에 드롭하세요</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 프로젝트 이름 */}
              <div className="rounded-[8px] bg-[#F8F8F8] px-4 md:px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[14px] font-medium text-[#252525]">
                    프로젝트 이름 <span className="text-[#F00]">*</span>
                  </label>
                  <span className="text-[12px] text-[#808080]">{projectName.length}/{PROJECT_NAME_MAX_LENGTH}</span>
                </div>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value.slice(0, PROJECT_NAME_MAX_LENGTH))}
                  placeholder="거래소 텔레마케팅 관리"
                  maxLength={PROJECT_NAME_MAX_LENGTH}
                  className="w-full h-[40px] rounded-[5px] border border-[#E2E2E2] px-3 text-[14px] text-[#000] bg-white focus:outline-none focus:border-[#00E272] transition-colors"
                  disabled={submitting}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 서브도메인 설정 */}
              <div className="rounded-[8px] bg-[#F8F8F8] px-4 md:px-6 py-4 min-h-[146px] flex flex-col">
                <div className="text-[14px] font-medium text-[#252525] mb-3">서브도메인 설정</div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-2">
                  <div className="flex-1 min-w-0 flex items-center rounded-[5px] border border-[#E2E2E2] bg-white overflow-hidden focus-within:border-[#00E272] transition-colors">
                    <input
                      type="text"
                      value={subdomain}
                      onChange={(e) => {
                        const next = e.target.value.toLowerCase();
                        setSubdomain(next);
                        setDomainAvailable(null);
                        setDomainError(null);
                      }}
                      placeholder="myservice"
                      className="flex-1 min-w-0 h-[40px] px-3 border-0 text-[14px] font-medium text-[#000] bg-transparent focus:outline-none focus:ring-0"
                    />
                    <span className="flex-shrink-0 px-3 py-2 text-[14px] font-medium text-[#252525] whitespace-nowrap">
                      .app.talkgate.im
                    </span>
                  </div>
                  <button
                    type="button"
                    className="h-[40px] px-4 rounded-[5px] bg-[#252525] text-white text-[14px] font-semibold whitespace-nowrap disabled:opacity-50 flex-shrink-0 w-full sm:w-auto"
                    onClick={validateSubdomain}
                    disabled={domainChecking || !subdomain || subdomain === lastCheckedSubdomain}
                  >
                    {domainChecking ? "확인 중..." : "중복확인"}
                  </button>
                </div>
                {domainAvailable !== null && (
                  <div
                    className={`text-[14px] font-medium mb-2 ${
                      domainAvailable ? "text-[#00E272]" : "text-[#D83232]"
                    }`}
                  >
                    {domainAvailable
                      ? "사용가능한 도메인입니다."
                      : domainError || "도메인을 사용할 수 없습니다."}
                  </div>
                )}
                <div className="text-[14px] font-medium text-[#808080] leading-[1.6]">
                  <div>• 영문 소문자, 숫자, 하이픈(-) 사용 가능 (3-30자)</div>
                  <div>• 하이픈(-)으로 시작하거나 끝날 수 없습니다</div>
                </div>
              </div>

              {/* 건너뛰기 */}
              <div className="rounded-[8px] bg-[#F8F8F8] px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-[14px] font-medium text-[#252525] mb-2">도메인을 나중에 설정하시겠습니까?</div>
                  <div className="text-[14px] font-medium text-[#808080] leading-[1.6]">
                    이 단계를 건너뛰면 무작위 도메인이 자동으로 생성됩니다.<br/>언제든지 설정 &gt; 일반에서 변경할 수 있습니다.
                  </div>
                </div>
                <button
                  type="button"
                  className="h-[40px] px-4 rounded-[5px] border border-[#E2E2E2] bg-white text-[#252525] text-[14px] font-semibold disabled:opacity-50 w-full md:w-auto"
                  onClick={handleSkip}
                  disabled={submitting}
                >
                  건너뛰기
                </button>
              </div>
            </div>
          )}

          {createError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-[14px]">
              {createError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E2E2E2] px-5 md:px-7 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            className="cursor-pointer h-[40px] px-5 rounded-[8px] border border-[#E2E2E2] text-[14px] font-semibold text-[#252525] bg-white hover:bg-[#F8F8F8] disabled:opacity-50"
            onClick={handleCloseModal}
            disabled={submitting}
          >
            취소
          </button>
          {step === 2 && (
            <button
              type="button"
              className="cursor-pointer h-[40px] px-5 rounded-[8px] border border-[#E2E2E2] text-[14px] font-semibold text-[#252525] bg-white hover:bg-[#F8F8F8] disabled:opacity-50"
              onClick={() => setStep(1)}
              disabled={submitting}
            >
              이전
            </button>
          )}
          {step === 1 ? (
            <button
              type="button"
              className="cursor-pointer h-[40px] px-5 rounded-[8px] bg-[#252525] text-white text-[14px] font-semibold hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setStep(2)}
              disabled={!canGoNext || submitting}
            >
              다음
            </button>
          ) : (
            <button
              type="button"
              className="cursor-pointer h-[40px] px-5 rounded-[8px] bg-[#252525] text-white text-[14px] font-semibold hover:bg-[#3a3a3a] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleSubmit()}
              disabled={submitting || !canGoNext}
            >
              {submitting ? "생성 중..." : "확인"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
