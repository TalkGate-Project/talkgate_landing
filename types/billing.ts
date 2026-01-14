/**
 * Billing API 타입 정의
 */

/**
 * 빌링 정보 (결제 수단 정보)
 */
export interface BillingInfo {
  id: number;
  userId: number;
  lastFourDigits: string;
  cardCompany: string;
  cardType: string;
  ownerType: string;
  authenticatedAt: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * 빌링키 목록 조회 응답
 */
export interface BillingListResponse {
  result: true;
  data: {
    billingInfos: BillingInfo[];
  };
}

/**
 * 빌링키 등록 요청 입력
 */
export interface BillingRegisterInput {
  cardNo: string;
  expYear: string;
  expMonth: string;
  idNo: string;
  cardPw: string;
  buyerName: string;
  buyerEmail: string;
  buyerTel: string;
}

/**
 * 빌링키 등록 응답
 */
export interface BillingRegisterResponse {
  result: true;
  data: BillingInfo;
}

/**
 * 빌링키 변경 요청 입력
 */
export interface BillingUpdateInput {
  billingInfoId: number;
  cardNo: string;
  expYear: string;
  expMonth: string;
  idNo: string;
  cardPw: string;
  buyerName: string;
  buyerEmail: string;
  buyerTel: string;
}

/**
 * 빌링키 변경 응답
 */
export interface BillingUpdateResponse {
  result: true;
  data: BillingInfo;
}

/**
 * 약관 유형
 */
export type BillingTermsType =
  | "ElectronicFinancialTransactions" // 전자금융거래 약관
  | "CollectPersonalInfo" // 개인정보 수집 및 이용 약관
  | "SharingPersonalInformation"; // 개인정보 제3자 제공약관

/**
 * 약관 조회 응답
 */
export interface BillingTermsResponse {
  result: true;
  data: {
    termsTitle: string;
    content: string;
  };
}
