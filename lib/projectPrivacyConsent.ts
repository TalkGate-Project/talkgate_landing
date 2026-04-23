import { apiClient } from "@/lib/apiClient";
import type {
  ProjectPrivacyConsentCheckResponse,
  ProjectPrivacyConsentCreateResponse,
} from "@/types/projectPrivacyConsent";

const ENDPOINT = "/v1/project-privacy-processing-consents";

export const ProjectPrivacyConsentService = {
  /**
   * 프로젝트의 개인정보 처리 위탁 계약서 동의 여부 확인
   */
  check(projectId: string | number) {
    return apiClient.get<ProjectPrivacyConsentCheckResponse>(ENDPOINT, {
      headers: { "x-project-id": String(projectId) },
    });
  },

  /**
   * 개인정보 처리 위탁 계약서 동의 기록 (어드민 전용)
   */
  agree(projectId: string | number) {
    return apiClient.post<ProjectPrivacyConsentCreateResponse>(
      ENDPOINT,
      undefined,
      { headers: { "x-project-id": String(projectId) } }
    );
  },
};

export type {
  ProjectPrivacyConsent,
  ProjectPrivacyConsentCheckResponse,
  ProjectPrivacyConsentCreateResponse,
} from "@/types/projectPrivacyConsent";
