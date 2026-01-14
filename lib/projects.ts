import { apiClient } from "@/lib/apiClient";
import type {
  ProjectListResponse,
  ProjectCreateInput,
  ProjectCreateResponse,
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
   */
  listAdmin() {
    return apiClient.get<ProjectListResponse>("/v1/projects/admin");
  },

  /**
   * 프로젝트 생성
   */
  create(input: ProjectCreateInput) {
    return apiClient.post<ProjectCreateResponse>("/v1/projects", input);
  },
};

// Re-export types for convenience
export type {
  ProjectInfo,
  ProjectCreateInput,
  ProjectCreateResponse,
  ProjectListResponse,
} from "@/types/project";
