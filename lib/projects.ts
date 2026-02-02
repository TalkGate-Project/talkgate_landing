import { apiClient } from "@/lib/apiClient";
import type {
  ProjectListResponse,
  ProjectCreateInput,
  ProjectCreateResponse,
  CheckSubDomainDuplicateResponse,
} from "@/types/project";

export const ProjectsService = {
  /**
   * 내 프로젝트 목록 조회
   */
  list() {
    return apiClient.get<ProjectListResponse>("/v1/projects");
  },

  /**
   * 내가 어드민인 프로젝트 목록 조회
   * Admin 역할인 프로젝트만 조회합니다.
   * @param options.suppressAutoLogout - true면 401 시 자동 로그아웃 리다이렉트 생략 (pricing 등)
   */
  listAdmin(options?: { suppressAutoLogout?: boolean }) {
    const reqOpts = options?.suppressAutoLogout ? { suppressAutoLogout: true } : {};
    return apiClient.get<ProjectListResponse>("/v1/projects/admin", reqOpts);
  },

  /**
   * 프로젝트 생성
   */
  create(input: ProjectCreateInput) {
    return apiClient.post<ProjectCreateResponse>("/v1/projects", input);
  },

  /**
   * 서브도메인 중복 확인
   */
  checkSubDomainDuplicate(subDomain: string) {
    return apiClient.post<CheckSubDomainDuplicateResponse>(
      "/v1/projects/check-sub-domain-duplicate",
      { subDomain }
    );
  },
};

// Re-export types for convenience
export type {
  ProjectInfo,
  ProjectCreateInput,
  ProjectCreateResponse,
  ProjectListResponse,
  CheckSubDomainDuplicateResponse,
} from "@/types/project";
