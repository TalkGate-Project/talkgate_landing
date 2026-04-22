/**
 * Project Privacy Processing Consent API 타입 정의
 */

export interface ProjectPrivacyConsent {
  id: number;
  projectId: number;
  userId: number;
  agreedAt: string;
  createdAt: string;
}

export interface ProjectPrivacyConsentCheckResponse {
  result: true;
  data: {
    isConsented: boolean;
    consent: ProjectPrivacyConsent | null;
  };
}

export interface ProjectPrivacyConsentCreateResponse {
  result: true;
  data: ProjectPrivacyConsent;
}
